// Curve maths shared by the panel and the editor. It mirrors backend-rs/src/logic.rs
// so the editor shows exactly what the back-end will do.

export type Point = { x: number; y: number };
/** [temperature °C, minimum ratio] pairs; must match SAFETY_FLOOR in the back-end. */
export type Floor = [number, number][];

export const DEFAULT_FLOOR: Floor = [[80, 0.4], [90, 0.6], [95, 1.0]];

/** A moderate starting curve for new profiles (x = °C / 100, y = fan ratio). */
export const STARTER_CURVE: Point[] = [
  { x: 0.30, y: 0.0 },
  { x: 0.50, y: 0.25 },
  { x: 0.65, y: 0.40 },
  { x: 0.75, y: 0.55 },
  { x: 0.85, y: 0.80 },
  { x: 0.90, y: 1.0 },
];

export function floorAt(tempC: number, floor: Floor = DEFAULT_FLOOR): number {
  if (!isFinite(tempC)) return 1;
  if (floor.length === 0 || tempC <= floor[0][0]) return 0;
  for (let i = 1; i < floor.length; i++) {
    const [t0, r0] = floor[i - 1];
    const [t1, r1] = floor[i];
    if (tempC <= t1) return r0 + ((tempC - t0) / (t1 - t0)) * (r1 - r0);
  }
  return floor[floor.length - 1][1];
}

/** Sorted, clamped, rounded to whole °C / %, duplicates merged (later wins). */
export function sanitize(points: Point[]): Point[] {
  const cleaned = points
    .filter((p) => isFinite(p.x) && isFinite(p.y))
    .map((p) => ({
      x: Math.round(Math.min(1, Math.max(0, p.x)) * 100) / 100,
      y: Math.round(Math.min(1, Math.max(0, p.y)) * 100) / 100,
    }));
  const merged: Point[] = [];
  for (const p of cleaned.map((p, i) => ({ p, i })).sort((a, b) => a.p.x - b.p.x || a.i - b.i).map((e) => e.p)) {
    const last = merged[merged.length - 1];
    if (last && Math.abs(last.x - p.x) < 1e-4) merged[merged.length - 1] = p;
    else merged.push(p);
  }
  return merged.slice(0, 32);
}

/** Curve value at a temperature ratio, endpoints held; undefined with < 2 points. */
export function evalCurve(curve: Point[], interpolate: boolean, t: number): number | undefined {
  if (curve.length < 2) return undefined;
  let index = -1;
  for (let i = curve.length - 1; i >= 0; i--) {
    if (curve[i].x < t) {
      index = i;
      break;
    }
  }
  if (index < 0) return curve[0].y;
  if (index + 1 >= curve.length || !interpolate) return curve[index].y;
  const lo = curve[index];
  const hi = curve[index + 1];
  const dx = hi.x - lo.x;
  return dx < 1e-9 ? lo.y : lo.y + (hi.y - lo.y) * ((t - lo.x) / dx);
}

/** What the fan is actually told: the curve, never below the floor. */
export function effectiveAt(curve: Point[], interpolate: boolean, tempC: number, floor: Floor = DEFAULT_FLOOR): number | undefined {
  const v = evalCurve(curve, interpolate, tempC / 100);
  return v == null ? undefined : Math.min(1, Math.max(v, floorAt(tempC, floor)));
}

/** Raise a tapped point onto the floor if it would sit in the dead zone. */
export function snapToFloor(p: Point, floor: Floor = DEFAULT_FLOOR): Point {
  const limit = Math.ceil(floorAt(p.x * 100, floor) * 100 - 1e-9) / 100;
  return p.y < limit ? { x: p.x, y: limit } : p;
}
