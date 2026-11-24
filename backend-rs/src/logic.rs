//! Pure fan-control maths, kept free of I/O so it can be unit tested.
//!
//! Everything that decides *how fast the fan should spin* lives here: the thermal
//! safety floor, curve sanitising, curve evaluation and a port of the SteamOS
//! (`jupiter-fan-control`) controller used by the built-in system profiles.

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

/// The curve as it actually takes effect, for adapters that upload a whole curve to
/// firmware (ROG Ally): every point is raised to the floor and the floor's corners
/// are inserted so the firmware cannot interpolate through the dead zone.
pub fn effective_points(curve: &[GraphPoint]) -> Vec<GraphPoint> {
    let mut points: Vec<GraphPoint> = curve
        .iter()
        .map(|p| GraphPoint { x: p.x, y: apply_floor(p.y, p.x * 100.0) })
        .collect();
    for (temp_c, ratio) in SAFETY_FLOOR {
        // the corner sits exactly on the floor's breakpoint, so the 80 °C step is
        // reached at 80 °C already (slightly conservative)
        let x = temp_c / 100.0;
        let held = eval_curve(curve, true, x).unwrap_or(0.0);
        points.push(GraphPoint { x, y: held.max(ratio) });
    }
    sanitize_curve(&points)
}

/// One SteamOS controller (`type: quadratic` or `type: ffquad` in the YAML).
#[derive(Debug, Clone, PartialEq)]
pub struct ValveController {
    pub a: f64,
    pub b: f64,
    pub c: f64,
    pub t_threshold: f64,
    /// Feed-forward on APU power (`A_ff * watts + B_ff`); `None` for plain quadratic.
    pub feed_forward: Option<(f64, f64)>,
    pub max_temp: f64,
}

impl ValveController {
    /// Output in RPM for one device, bounded like `Device.get_output` in fancontrol.py.
    pub fn output(&self, temp_c: f64, apu_power_w: f64, fan_max_speed: f64) -> f64 {
        if temp_c > self.max_temp {
            return fan_max_speed;
        }
        // ffquad's inner quadratic has no threshold, matching fancontrol.py
        let quad = if self.feed_forward.is_none() && temp_c < self.t_threshold {
            0.0
        } else {
            (self.a * temp_c * temp_c + self.b * temp_c + self.c).trunc()
        };
        let ff = match self.feed_forward {
            Some((a_ff, b_ff)) => (a_ff * apu_power_w + b_ff).trunc(),
            None => 0.0,
        };
        (quad + ff).max(0.0)
    }
}

/// A SteamOS board profile (`jupiter-config.yaml`, `galileo-config.yaml`).
#[derive(Debug, Clone, PartialEq)]
pub struct ValveProfile {
    pub name: String,
    pub description: String,
    pub min_speed: f64,
    pub threshold_speed: f64,
    pub max_speed: f64,
    pub min_time_on_s: f64,
    pub hysteresis: f64,
    /// Controller applied to the CPU (acpitz) temperature.
    pub cpu: ValveController,
    /// Controller applied to the GPU (amdgpu) temperature, when it can be read.
    pub gpu: ValveController,
    /// Whether the values were read from the installed SteamOS files.
    pub from_system_files: bool,
}

impl ValveProfile {
    /// Built-in copy of `jupiter-config.yaml` (LCD), jupiter-fan-control 20260902.1.
    pub fn jupiter_builtin() -> Self {
        let quad = ValveController {
            a: 2.286,
            b: -188.6,
            c: 5457.0,
            t_threshold: 55.0,
            feed_forward: None,
            max_temp: 90.0,
        };
        Self {
            name: "jupiter".into(),
            description: "SteamOS LCD (Jupiter)".into(),
            min_speed: 10.0,
            threshold_speed: 1500.0,
            max_speed: 7300.0,
            min_time_on_s: 120.0,
            hysteresis: 700.0,
            cpu: quad.clone(),
            gpu: quad,
            from_system_files: false,
        }
    }

    /// Built-in copy of `galileo-config.yaml` (OLED), jupiter-fan-control 20260902.1.
    pub fn galileo_builtin() -> Self {
        let ffquad = ValveController {
            a: 0.762,
            b: -26.7,
            c: 1257.0,
            t_threshold: 45.0,
            feed_forward: Some((225.0, -1575.0)),
            max_temp: 90.0,
        };
        Self {
            name: "galileo".into(),
            description: "SteamOS OLED (Galileo)".into(),
            min_speed: 10.0,
            threshold_speed: 2000.0,
            max_speed: 7300.0,
            min_time_on_s: 120.0,
            hysteresis: 700.0,
            cpu: ffquad.clone(),
            gpu: ffquad,
            from_system_files: false,
        }
    }

    /// Raw controller demand in RPM before hysteresis and minimum-speed handling.
    pub fn demand(&self, inputs: &ValveInputs) -> f64 {
        let cpu = self.cpu.output(inputs.cpu_temp_c, inputs.apu_power_w, self.max_speed);
        let gpu = inputs
            .gpu_temp_c
            .map(|t| self.gpu.output(t, inputs.apu_power_w, self.max_speed))
            .unwrap_or(0.0);
        cpu.max(gpu)
    }

    /// Sample the profile at idle power for drawing a read-only reference curve.
    pub fn sample(&self, fan_max_rpm: f64) -> Vec<GraphPoint> {
        (20..=100)
            .step_by(5)
            .map(|t| {
                let t = t as f64;
                let rpm = self.demand(&ValveInputs { cpu_temp_c: t, gpu_temp_c: None, apu_power_w: 0.0 });
                GraphPoint { x: t / 100.0, y: (rpm / fan_max_rpm).clamp(0.0, 1.0) }
            })
            .collect()
    }
}

/// Sensor readings consumed by a [`ValveProfile`].
#[derive(Debug, Clone, Copy)]
pub struct ValveInputs {
    pub cpu_temp_c: f64,
    pub gpu_temp_c: Option<f64>,
    /// Averaged APU power in watts (only used by `ffquad` controllers).
    pub apu_power_w: f64,
}

/// Mutable part of the SteamOS controller (`Fan` class in fancontrol.py).
#[derive(Debug, Clone)]
pub struct ValveState {
    hyst_min: f64,
    hyst_max: f64,
    last_speed: f64,
    time_on: f64,
    cold_off: bool,
}

impl Default for ValveState {
    fn default() -> Self {
        Self { hyst_min: 0.0, hyst_max: 0.0, last_speed: 0.0, time_on: 0.0, cold_off: true }
    }
}

impl ValveState {
    /// Port of `Fan.set_speed`: returns the RPM to write to `fan1_target`.
    pub fn step(&mut self, profile: &ValveProfile, demand: f64, charging: bool, now_s: f64) -> f64 {
        let mut speed = demand.min(profile.max_speed);
        // output hysteresis (_apply_hysteresis)
        speed = if speed > self.hyst_max {
            self.hyst_max = speed;
            self.hyst_min = speed - profile.hysteresis;
            speed
        } else if speed < self.hyst_min {
            self.hyst_min = speed;
            self.hyst_max = speed + profile.hysteresis;
            self.hyst_max
        } else {
            self.last_speed
        };
        if charging {
            speed = speed.max(profile.threshold_speed);
        } else if profile.min_time_on_s > 0.0 && speed < profile.threshold_speed {
            if self.cold_off {
                speed = profile.min_speed;
            } else if now_s - self.time_on >= profile.min_time_on_s {
                speed = profile.min_speed;
                self.cold_off = true;
            } else {
                speed = profile.threshold_speed;
            }
        } else if speed <= profile.min_speed {
            speed = profile.min_speed;
        }
        if profile.min_time_on_s > 0.0 && speed > profile.min_speed && self.cold_off {
            self.time_on = now_s;
            self.cold_off = false;
        }
        self.last_speed = speed;
        speed
    }
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

    #[test]
    fn effective_points_stay_above_floor() {
        let pts = effective_points(&[gp(0.3, 0.0), gp(1.0, 0.1)]);
        for t in 0..=100 {
            let t = t as f64;
            let r = eval_curve(&pts, true, t / 100.0).unwrap();
            assert!(r + 1e-9 >= floor_at(t), "{} °C -> {}", t, r);
        }
    }

    #[test]
    fn jupiter_matches_valve_fit() {
        // comment in jupiter-config.yaml: {{55, 2000}, {80, 5000}, {90, 7000}}
        let p = ValveProfile::jupiter_builtin();
        let at = |t| p.demand(&ValveInputs { cpu_temp_c: t, gpu_temp_c: None, apu_power_w: 0.0 });
        assert!((at(55.0) - 2000.0).abs() < 5.0);
        assert!((at(80.0) - 5000.0).abs() < 25.0);
        assert!((at(90.0) - 7000.0).abs() < 25.0);
        assert_eq!(at(54.0), 0.0);
        assert_eq!(at(91.0), 7300.0);
    }

    #[test]
    fn galileo_feed_forward() {
        // comment in galileo-config.yaml: quadratic (60,2400)(80,4000)(95,5600), ff (7,0),(15,1800)
        let p = ValveProfile::galileo_builtin();
        let at = |t, w| p.demand(&ValveInputs { cpu_temp_c: t, gpu_temp_c: None, apu_power_w: w });
        assert!((at(60.0, 7.0) - 2400.0).abs() < 25.0);
        assert!((at(80.0, 15.0) - 5800.0).abs() < 25.0);
    }

    #[test]
    fn valve_state_keeps_fan_on_for_min_time() {
        let p = ValveProfile::jupiter_builtin();
        let mut s = ValveState::default();
        assert_eq!(s.step(&p, 0.0, false, 0.0), 10.0); // cold start: off
        assert_eq!(s.step(&p, 3000.0, false, 1.0), 3000.0);
        // demand drops: hysteresis then min-on-time hold at threshold
        assert_eq!(s.step(&p, 0.0, false, 2.0), 1500.0);
        // inside the hysteresis band the previous output is kept, as in fancontrol.py
        assert_eq!(s.step(&p, 0.0, false, 200.0), 1500.0);
        // charging keeps at least threshold speed
        assert_eq!(s.step(&p, 0.0, true, 201.0), 1500.0);
        // a fresh drop below the band after the minimum on-time switches it off
        let mut s = ValveState::default();
        s.step(&p, 3000.0, false, 0.0);
        assert_eq!(s.step(&p, 0.0, false, 130.0), 10.0);
    }
}
