import { Focusable, PanelSectionRow } from "decky-frontend-lib";
import { useState, VFC } from "react";

const RANGES = [60, 300];
const W = 300;
const H = 40;
/** The y-axis spans at least this many °C, so a steady temperature reads as a flat line. */
const MIN_SPAN = 10;

/**
 * Sparkline of the last 1 or 5 minutes of temperature, from the back-end's in-memory
 * buffer (one reading per second). Tap to switch the range. Plain SVG, no chart library.
 */
export const TempHistory: VFC<{ history: (number | null)[] }> = ({ history }) => {
  const [range, setRange] = useState(0);
  const seconds = RANGES[range];
  const data = history.slice(-seconds);
  const known = data.filter((t): t is number => t != null);
  if (known.length < 2) return null;

  let lo = Math.min(...known);
  let hi = Math.max(...known);
  const avg = known.reduce((a, b) => a + b, 0) / known.length;
  if (hi - lo < MIN_SPAN) {
    const mid = (hi + lo) / 2;
    lo = mid - MIN_SPAN / 2;
    hi = mid + MIN_SPAN / 2;
  }
  // newest reading at the right edge; a short buffer fills from the right
  const offset = seconds - data.length;
  const x = (i: number) => ((offset + i) / (seconds - 1)) * W;
  const y = (t: number) => 2 + (H - 4) * (1 - (t - lo) / (hi - lo));

  let line = "";
  let pen = false;
  data.forEach((t, i) => {
    if (t == null) {
      pen = false;
      return;
    }
    line += (pen ? "L" : "M") + x(i).toFixed(1) + " " + y(t).toFixed(1);
    pen = true;
  });

  const toggle = () => setRange((r) => (r + 1) % RANGES.length);
  return (
    <PanelSectionRow>
      <Focusable onActivate={toggle} onClick={toggle} style={{ width: "100%", padding: "2px 0 6px" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: "block" }}>
          <path d={line} fill="none" stroke="#1a9fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", opacity: 0.7 }}>
          <span>{seconds === 60 ? "Last minute" : "Last 5 minutes"}</span>
          <span>
            {Math.round(Math.min(...known))}–{Math.round(Math.max(...known))} °C · avg {avg.toFixed(0)}
          </span>
        </div>
      </Focusable>
    </PanelSectionRow>
  );
};
