//! Pure fan-control maths, kept free of I/O so it can be unit tested.
//!
//! Everything that decides *how fast the fan should spin* lives here: the thermal
//! safety floor, curve sanitising and curve evaluation.

use crate::datastructs::GraphPoint;

/// Thermal safety floor as `(temperature °C, minimum fan ratio)`.
///
/// At or below the first temperature there is no floor; between entries the minimum
/// is interpolated linearly; above the last entry it stays at the last ratio.
pub const SAFETY_FLOOR: [(f64, f64); 3] = [(80.0, 0.4), (90.0, 0.6), (95.0, 1.0)];

/// Curves with more points than this are truncated after sanitising.
pub const MAX_CURVE_POINTS: usize = 32;

/// Two points closer than this (as a temperature ratio, i.e. 0.01 °C) are merged.
const MERGE_EPSILON: f64 = 1e-4;

/// Minimum fan ratio allowed at `temp_c`.
///
/// An unreadable (non-finite) temperature is treated as the worst case.
pub fn floor_at(temp_c: f64) -> f64 {
    if !temp_c.is_finite() {
        return 1.0;
    }
    if temp_c <= SAFETY_FLOOR[0].0 {
        return 0.0;
    }
    for pair in SAFETY_FLOOR.windows(2) {
        let (t0, r0) = pair[0];
        let (t1, r1) = pair[1];
        if temp_c <= t1 {
            return r0 + (temp_c - t0) / (t1 - t0) * (r1 - r0);
        }
    }
    SAFETY_FLOOR[SAFETY_FLOOR.len() - 1].1
}

/// Drop invalid points, clamp to `0..=1`, sort by temperature and merge duplicates
/// (the later point wins), so evaluation can never divide by zero.
pub fn sanitize_curve(points: &[GraphPoint]) -> Vec<GraphPoint> {
    let mut cleaned: Vec<GraphPoint> = points
        .iter()
        .filter(|p| p.x.is_finite() && p.y.is_finite())
        .map(|p| GraphPoint {
            x: p.x.clamp(0.0, 1.0),
            y: p.y.clamp(0.0, 1.0),
        })
        .collect();
    // stable sort keeps insertion order for equal x, so "later wins" below holds
    cleaned.sort_by(|a, b| a.x.total_cmp(&b.x));
    let mut merged: Vec<GraphPoint> = Vec::with_capacity(cleaned.len());
    for point in cleaned {
        match merged.last_mut() {
            Some(last) if (point.x - last.x).abs() < MERGE_EPSILON => *last = point,
            _ => merged.push(point),
        }
    }
    merged.truncate(MAX_CURVE_POINTS);
    merged
}

/// Evaluate a sanitised curve at `temp_ratio` (temperature °C / 100).
///
/// Below the first point and above the last point the value is held (no
/// extrapolation). Returns `None` for curves with fewer than two points, which are
/// not allowed to control the fan.
pub fn eval_curve(curve: &[GraphPoint], interpolate: bool, temp_ratio: f64) -> Option<f64> {
    if curve.len() < 2 {
        return None;
    }
    let index = curve.iter().rposition(|p| p.x < temp_ratio);
    let value = match index {
        None => curve[0].y,
        Some(i) if i + 1 >= curve.len() => curve[i].y,
        Some(i) if !interpolate => curve[i].y,
        Some(i) => {
            let lower = &curve[i];
            let upper = &curve[i + 1];
            let dx = upper.x - lower.x;
            if dx.abs() < f64::EPSILON {
                lower.y
            } else {
                lower.y + (upper.y - lower.y) * ((temp_ratio - lower.x) / dx)
            }
        }
    };
    if value.is_finite() {
        Some(value.clamp(0.0, 1.0))
    } else {
        None
    }
}

/// Raise a ratio to the safety floor and keep it in `0..=1`.
pub fn apply_floor(ratio: f64, temp_c: f64) -> f64 {
    let ratio = if ratio.is_finite() { ratio } else { 1.0 };
    ratio.max(floor_at(temp_c)).clamp(0.0, 1.0)
}

/// Fan ratio for a point curve, or `None` when the curve cannot control the fan.
pub fn curve_target(curve: &[GraphPoint], interpolate: bool, temp_c: f64) -> Option<f64> {
    eval_curve(curve, interpolate, temp_c / 100.0).map(|r| apply_floor(r, temp_c))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn gp(x: f64, y: f64) -> GraphPoint {
        GraphPoint { x, y }
    }

    #[test]
    fn floor_matches_table() {
        assert_eq!(floor_at(20.0), 0.0);
        assert_eq!(floor_at(80.0), 0.0);
        assert!((floor_at(85.0) - 0.5).abs() < 1e-9);
        assert!((floor_at(90.0) - 0.6).abs() < 1e-9);
        assert!((floor_at(92.5) - 0.8).abs() < 1e-9);
        assert_eq!(floor_at(95.0), 1.0);
        assert_eq!(floor_at(120.0), 1.0);
        assert_eq!(floor_at(f64::NAN), 1.0);
    }

    #[test]
    fn sanitize_merges_duplicates_and_drops_garbage() {
        let curve = sanitize_curve(&[
            gp(0.5, 0.5),
            gp(f64::NAN, 0.1),
            gp(0.2, 2.0),
            gp(0.5, 0.7),
            gp(-1.0, 0.3),
        ]);
        assert_eq!(curve.len(), 3);
        assert_eq!((curve[0].x, curve[0].y), (0.0, 0.3));
        assert_eq!((curve[1].x, curve[1].y), (0.2, 1.0));
        assert_eq!((curve[2].x, curve[2].y), (0.5, 0.7)); // later duplicate wins
    }

    #[test]
    fn duplicate_x_never_produces_nan() {
        // upstream divided by zero here and wrote 0 RPM
        let curve = sanitize_curve(&[gp(0.4, 0.2), gp(0.4, 0.9), gp(0.6, 0.5)]);
        for t in 0..=100 {
            let r = curve_target(&curve, true, t as f64).unwrap();
            assert!(r.is_finite());
        }
    }

    #[test]
    fn curve_needs_two_points() {
        assert_eq!(eval_curve(&[], true, 0.5), None);
        assert_eq!(eval_curve(&[gp(0.5, 0.5)], true, 0.5), None);
    }

    #[test]
    fn curve_holds_endpoints_and_interpolates() {
        let curve = [gp(0.4, 0.2), gp(0.6, 0.6)];
        assert_eq!(eval_curve(&curve, true, 0.1), Some(0.2));
        assert_eq!(eval_curve(&curve, true, 0.9), Some(0.6));
        assert!((eval_curve(&curve, true, 0.5).unwrap() - 0.4).abs() < 1e-9);
        assert_eq!(eval_curve(&curve, false, 0.5), Some(0.2));
    }

    #[test]
    fn floor_overrides_low_curve() {
        let curve = [gp(0.3, 0.0), gp(1.0, 0.0)];
        assert_eq!(curve_target(&curve, true, 50.0), Some(0.0));
        assert!((curve_target(&curve, true, 92.5).unwrap() - 0.8).abs() < 1e-9);
        assert_eq!(curve_target(&curve, true, 99.0), Some(1.0));
    }
}
