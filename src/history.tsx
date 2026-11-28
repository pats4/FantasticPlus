import { Focusable, PanelSectionRow } from "decky-frontend-lib";
import { useState, VFC } from "react";

const RANGES = [60, 300];
const W = 300;
const H = 56;
const GUTTER = 28;
const TEMP_COLOR = "#1a9fff";
const FAN_COLOR = "#ff9d3a";
/** The temperature axis spans at least this many °C, so a steady temperature reads as a flat line. */
const MIN_SPAN = 10;

/**
 * Sparkline of the last 1 or 5 minutes: temperature (auto-scaled) and fan speed (fixed 0-100%)
 * from the back-end's in-memory buffers (one reading per second). Tap to switch the range.
 * Plain SVG, no chart library.
 */
export const TempHistory: VFC<{ history: (number | null)[]; fan: (number | null)[] }> = ({ history, fan }) => {
  const [range, setRange] = useState(0);
  const seconds = RANGES[range];
  const data = history.slice(-seconds);
  const fanData = fan.slice(-seconds);
  const known = data.filter((t): t is number => t != null);
  if (known.length < 2) return null;
  const fanKnown = fanData.filter((p): p is number => p != null);
  const fanAvg = fanKnown.length ? fanKnown.reduce((a, b) => a + b, 0) / fanKnown.length : null;

  let lo = Math.min(...known);
  let hi = Math.max(...known);
  if (hi - lo < MIN_SPAN) {
    const mid = (hi + lo) / 2;
    lo = mid - MIN_SPAN / 2;
    hi = mid + MIN_SPAN / 2;
  }
  const yTemp = (t: number) => 2 + (H - 4) * (1 - (t - lo) / (hi - lo));
  const yFan = (p: number) => 2 + (H - 4) * (1 - p / 100);

  // newest reading at the right edge; a short buffer fills from the right
  const x = (i: number) => (i / (seconds - 1)) * W;
  /** SVG path through the known values; a null breaks the line. */
  const path = (values: (number | null)[], yFn: (v: number) => number) => {
    let d = "";
    let pen = false;
    const offset = seconds - values.length;
    values.forEach((v, i) => {
      if (v == null) {
        pen = false;
        return;
      }
      d += (pen ? "L" : "M") + x(offset + i).toFixed(1) + " " + yFn(v).toFixed(1);
      pen = true;
    });
    return d;
  };

  const lineProps = { fill: "none", strokeWidth: 1.5, vectorEffect: "non-scaling-stroke", strokeLinejoin: "round" } as const;
  const label = { position: "absolute", fontSize: "10px", opacity: 0.6, lineHeight: "12px" } as const;

  const toggle = () => setRange((r) => (r + 1) % RANGES.length);
  return (
    <PanelSectionRow>
      <Focusable onActivate={toggle} onClick={toggle} style={{ width: "100%", padding: "2px 0 6px" }}>
        <div style={{ position: "relative", padding: `0 ${GUTTER}px` }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: "block" }}>
            <path d={path(fanData, yFan)} stroke={FAN_COLOR} {...lineProps} />
            <path d={path(data, yTemp)} stroke={TEMP_COLOR} {...lineProps} />
          </svg>
          <span style={{ ...label, left: 0, top: 0 }}>{Math.round(hi)}°C</span>
          <span style={{ ...label, left: 0, bottom: 0 }}>{Math.round(lo)}°C</span>
          <span style={{ ...label, right: 0, top: 0 }}>100%</span>
          <span style={{ ...label, right: 0, bottom: 0 }}>0%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", opacity: 0.7 }}>
          <span>{seconds === 60 ? "Last minute" : "Last 5 minutes"}</span>
          <span>
            <span style={{ color: TEMP_COLOR }}>●</span> {Math.round(Math.min(...known))}–{Math.round(Math.max(...known))} °C{"  "}
            <span style={{ color: FAN_COLOR }}>●</span> fan {fanAvg == null ? "—" : "avg " + Math.round(fanAvg) + "%"}
          </span>
        </div>
      </Focusable>
    </PanelSectionRow>
  );
};
