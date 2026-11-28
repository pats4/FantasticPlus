// Large fan curve editor, drawn on a canvas.
//
// Tap empty space to add a point, tap a point to remove it. Points that would fall
// into the dead zone (below the thermal safety floor) are lifted onto its edge. The
// drawn line is what the fan will actually do: dashed where the floor holds it up.

import { useEffect, useLayoutEffect, useRef, useState, VFC } from "react";

import { Floor, Point, DEFAULT_FLOOR, effectiveAt, evalCurve, floorAt, sanitize, snapToFloor } from "./curve";

const PAD = { left: 34, right: 10, top: 10, bottom: 20 };
const POINT_RADIUS = 6;
const HIT_RADIUS = 16;

const COL_BG = "#1a1f2c";
const COL_GRID = "#0d3a5c";
const COL_GRID_MAJOR = "#14507f";
const COL_LINE = "#1a9fff";
const COL_TEXT = "#8ea3b0";
const COL_TEMP = "#ffb300";
const COL_FLOOR_EDGE = "rgba(255, 92, 92, 0.65)";
const COL_FLOOR_HATCH = "rgba(255, 120, 120, 0.14)";
const COL_INFO_BG = "rgba(8, 14, 24, 0.82)";
const COL_INFO = "#cfe6ff";
const COL_WARN = "#ff9d9d";

type Rect = { x: number; y: number; w: number; h: number };

function plotRect(width: number, height: number): Rect {
  return {
    x: PAD.left,
    y: PAD.top,
    w: Math.max(1, width - PAD.left - PAD.right),
    h: Math.max(1, height - PAD.top - PAD.bottom),
  };
}

const sx = (r: Rect, x: number) => r.x + x * r.w;
const sy = (r: Rect, y: number) => r.y + (1 - y) * r.h;

export type EditorProps = {
  curve: Point[];
  interpolate: boolean;
  /** Current temperature in °C, for the marker and the read-out. */
  temperature: number | null;
  floor?: Floor;
  /** Called with every edited (sanitised) curve. */
  onChange?: (curve: Point[]) => void;
};

export const CurveEditor: VFC<EditorProps> = ({ curve: initial, interpolate, temperature, floor, onChange }) => {
  const limit = floor ?? DEFAULT_FLOOR;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [curve, setCurve] = useState<Point[]>(() => sanitize(initial.map((p) => snapToFloor(p, limit))));
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) {
        const h = Math.round(Math.min(Math.max(w * 0.45, 200), Math.max(300, (window.innerHeight || 800) * 0.5)));
        setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, size.w, size.h, curve, interpolate, temperature, limit, notice);
  }, [curve, size, interpolate, temperature, limit, notice]);

  const flash = (text: string) => {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 1800);
  };

  const onClick = (e: any) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const r = plotRect(bounds.width, bounds.height);
    const cx = e.clientX - bounds.left - r.x;
    const cy = e.clientY - bounds.top - r.y;
    for (let i = 0; i < curve.length; i++) {
      const shown = Math.max(curve[i].y, floorAt(curve[i].x * 100, limit));
      const dx = curve[i].x * r.w - cx;
      const dy = (1 - shown) * r.h - cy;
      if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) {
        const next = curve.filter((_, j) => j !== i);
        setCurve(next);
        onChange?.(next);
        return;
      }
    }
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const tapped = { x: Math.round(clamp(cx / r.w) * 100) / 100, y: Math.round(clamp(1 - cy / r.h) * 100) / 100 };
    const point = snapToFloor(tapped, limit);
    if (point.y !== tapped.y) flash("Moved onto the safety floor");
    const next = sanitize(curve.concat([point]));
    setCurve(next);
    onChange?.(next);
  };

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      <canvas
        ref={canvasRef}
        onClick={onClick}
        style={{
          width: "100%",
          height: size.h + "px",
          display: "block",
          border: "1px solid " + COL_LINE,
          borderRadius: "4px",
          backgroundColor: COL_BG,
        }}
      />
    </div>
  );
};

function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  curve: Point[],
  interpolate: boolean,
  temperature: number | null,
  floor: Floor,
  notice: string | null,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = COL_BG;
  ctx.fillRect(0, 0, width, height);
  const r = plotRect(width, height);

  // grid: 10 °C and 10 % steps
  ctx.lineWidth = 1;
  for (let i = 1; i < 10; i++) {
    ctx.strokeStyle = i % 2 === 0 ? COL_GRID_MAJOR : COL_GRID;
    ctx.beginPath();
    ctx.moveTo(sx(r, i / 10), r.y);
    ctx.lineTo(sx(r, i / 10), r.y + r.h);
    ctx.moveTo(r.x, sy(r, i / 10));
    ctx.lineTo(r.x + r.w, sy(r, i / 10));
    ctx.stroke();
  }
  ctx.strokeStyle = COL_GRID_MAJOR;
  ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
  ctx.fillStyle = COL_TEXT;
  ctx.font = "10px sans-serif";
  ctx.textBaseline = "alphabetic";
  for (let i = 0; i <= 10; i++) {
    ctx.textAlign = i === 0 ? "left" : i === 10 ? "right" : "center";
    ctx.fillText(i * 10 + (i === 10 ? "°C" : ""), sx(r, i / 10), r.y + r.h + 14);
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const pct of [20, 40, 60, 80, 100]) ctx.fillText(pct + "%", r.x - 4, sy(r, pct / 100));

  // dead zone under the safety floor
  if (floor.length > 0) {
    const edge: Point[] = [{ x: floor[0][0] / 100, y: 0 }];
    for (const [t, ratio] of floor) edge.push({ x: t / 100, y: ratio });
    edge.push({ x: 1, y: floor[floor.length - 1][1] });
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx(r, edge[0].x), r.y + r.h);
    for (const p of edge) ctx.lineTo(sx(r, p.x), sy(r, p.y));
    ctx.lineTo(r.x + r.w, r.y + r.h);
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = COL_FLOOR_HATCH;
    for (let o = -r.h; o < r.w + r.h; o += 8) {
      ctx.beginPath();
      ctx.moveTo(r.x + o, r.y + r.h);
      ctx.lineTo(r.x + o + r.h, r.y);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = COL_FLOOR_EDGE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    edge.forEach((p, i) => (i === 0 ? ctx.moveTo(sx(r, p.x), sy(r, p.y)) : ctx.lineTo(sx(r, p.x), sy(r, p.y))));
    ctx.stroke();
  }

  // current temperature
  if (temperature != null && isFinite(temperature)) {
    const tx = sx(r, Math.min(1, Math.max(0, temperature / 100)));
    ctx.save();
    ctx.strokeStyle = COL_TEMP;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(tx, r.y);
    ctx.lineTo(tx, r.y + r.h);
    ctx.stroke();
    ctx.restore();
  }

  // effective curve, sampled every 0.5 °C; dashed where the floor holds it up
  if (curve.length >= 2) {
    ctx.strokeStyle = COL_LINE;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    let prev: { x: number; y: number; held: boolean } | null = null;
    for (let i = 0; i <= 200; i++) {
      const t = i / 2;
      const authored = evalCurve(curve, interpolate, t / 100)!;
      const y = floor.length > 0 ? effectiveAt(curve, interpolate, t, floor)! : authored;
      const cur = { x: t / 100, y, held: y > authored + 1e-6 };
      if (prev) {
        ctx.setLineDash(cur.held || prev.held ? [6, 4] : []);
        ctx.beginPath();
        ctx.moveTo(sx(r, prev.x), sy(r, prev.y));
        ctx.lineTo(sx(r, cur.x), sy(r, cur.y));
        ctx.stroke();
      }
      prev = cur;
    }
    ctx.setLineDash([]);
  }

  // points, drawn where they take effect
  for (const p of curve) {
    const y = Math.max(p.y, floorAt(p.x * 100, floor));
    ctx.beginPath();
    ctx.arc(sx(r, p.x), sy(r, y), POINT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = COL_LINE;
    ctx.fill();
  }

  // read-out
  const lines: { text: string; color: string }[] = [];
  let summary = curve.length + " points";
  if (temperature != null && isFinite(temperature)) {
    summary += " · now " + temperature.toFixed(1) + "°C";
    const out = floor.length > 0 ? effectiveAt(curve, interpolate, temperature, floor) : evalCurve(curve, interpolate, temperature / 100);
    if (out != null) summary += " → " + Math.round(out * 100) + "%";
  }
  lines.push({ text: summary, color: COL_INFO });
  if (curve.length < 2) lines.push({ text: "At least 2 points are needed; until then SteamOS keeps the fan", color: COL_WARN });
  if (notice) lines.push({ text: notice, color: COL_WARN });
  else lines.push({ text: "Tap empty space to add a point · tap a point to remove it · dashed = held up by the safety floor", color: COL_TEXT });

  ctx.font = "11px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  let boxW = 0;
  for (const l of lines) boxW = Math.max(boxW, ctx.measureText(l.text).width);
  boxW = Math.min(boxW + 12, r.w - 8);
  ctx.fillStyle = COL_INFO_BG;
  ctx.fillRect(r.x + 4, r.y + 4, boxW, lines.length * 14 + 8);
  lines.forEach((l, i) => {
    ctx.fillStyle = l.color;
    ctx.fillText(l.text, r.x + 10, r.y + 18 + i * 14);
  });
}
