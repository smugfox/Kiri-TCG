/**
 * sparkline (design.md § Components): 90×28 inline SVG polyline for tables
 * and card rows. Single 1.5px line in trend-up, trend-down, or muted bronze
 * for flat. No fill, no axes. Pure SVG, renders on the server.
 */
export default function Sparkline({
  points,
  width = 90,
  height = 28,
}: {
  points: number[];
  width?: number;
  height?: number;
}) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const pad = 2;
  const step = (width - pad * 2) / (points.length - 1);
  const path = points
    .map((p, i) => `${(pad + i * step).toFixed(1)},${(height - pad - ((p - min) / span) * (height - pad * 2)).toFixed(1)}`)
    .join(" ");
  const delta = points[points.length - 1] - points[0];
  const color =
    delta > 0 ? "var(--color-trend-up)" : delta < 0 ? "var(--color-trend-down)" : "var(--color-accent-muted)";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline points={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
