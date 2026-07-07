"use client";

import { useEffect, useRef } from "react";
import { AreaSeries, ColorType, createChart, LineStyle } from "lightweight-charts";
import { money, signedPercent } from "@/lib/format";

export type PricePoint = { day: string; price: number };
export type ChartRange = "7d" | "30d" | "90d" | "1y" | "all";

export const RANGE_LABELS: Array<{ key: ChartRange; label: string }> = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "1y", label: "1Y" },
  { key: "all", label: "All" },
];

function cssColor(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** The Lightweight Charts area, themed per design.md § Components. */
function Area({ data }: { data: PricePoint[] }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!el.current) return;
    const accent = cssColor("--color-accent", "#7E4E2D");
    const chart = createChart(el.current, {
      height: 220,
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: cssColor("--color-on-surface-muted", "#66625F"),
        fontFamily: "Geist, sans-serif",
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: cssColor("--color-border", "#EAE3D7") },
      },
      crosshair: {
        vertLine: { color: cssColor("--color-on-surface-muted", "#66625F"), style: LineStyle.Dashed },
        horzLine: { visible: false },
      },
      timeScale: { borderColor: cssColor("--color-border", "#EAE3D7") },
      rightPriceScale: { borderVisible: false },
      handleScroll: false,
      handleScale: false,
    });
    const series = chart.addSeries(AreaSeries, {
      lineColor: accent,
      lineWidth: 2,
      topColor: "rgba(126,78,45,.18)",
      bottomColor: "rgba(126,78,45,0)",
      crosshairMarkerBackgroundColor: accent,
      priceLineVisible: false,
    });
    series.setData(data.map(({ day, price }) => ({ time: day, value: price })));
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [data]);

  return <div ref={el} style={{ width: "100%" }} />;
}

/**
 * price-chart (design.md § Components): serif card name in muted h4, current
 * price in serif h2 with a price-delta badge, segmented range tabs, the
 * bronze area chart, and an avg/low/high footer for the active window.
 */
export default function PriceChart({
  title,
  data,
  range,
  onRange,
  delta7d,
  hero = false,
}: {
  title: string;
  data: PricePoint[];
  range: ChartRange;
  onRange: (range: ChartRange) => void;
  delta7d?: number | null;
  hero?: boolean;
}) {
  const current = data.length > 0 ? data[data.length - 1].price : null;
  const prices = data.map((p) => p.price);
  const stats =
    prices.length > 0
      ? {
          avg: prices.reduce((a, b) => a + b, 0) / prices.length,
          low: Math.min(...prices),
          high: Math.max(...prices),
        }
      : null;

  return (
    <section className={`pchart ${hero ? "hero" : ""}`} style={{ width: "100%" }}>
      <div className="phead">
        <div>
          <div className="pname">{title}</div>
          <div className="pval">
            {current !== null ? money(current) : "No price data"}
            {typeof delta7d === "number" && delta7d !== 0 && (
              <span className={`pdelta ${delta7d > 0 ? "up" : "down"}`}>
                {signedPercent(delta7d).slice(1)}
              </span>
            )}
          </div>
        </div>
        <div className="range-tabs" role="tablist" aria-label="Chart range">
          {RANGE_LABELS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={range === key}
              className={range === key ? "active" : ""}
              onClick={() => onRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {data.length >= 2 ? (
        <Area data={data} />
      ) : (
        <div
          style={{
            height: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--color-accent)",
            }}
          />
          <span className="cs-set">
            {data.length === 1
              ? "One price point so far. History builds daily."
              : "No price history yet. History builds daily."}
          </span>
        </div>
      )}
      {stats && (
        <div className="pstats">
          {(
            [
              ["Avg", stats.avg],
              ["Low", stats.low],
              ["High", stats.high],
            ] as const
          ).map(([k, v]) => (
            <div className="st" key={k}>
              <div className="k">{k}</div>
              <div className="v">{money(v)}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
