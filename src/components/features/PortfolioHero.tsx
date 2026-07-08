"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ChartArea, ChartBaseline, RANGE_LABELS, type ChartRange } from "@/components/charts/PriceChart";
import { money, signedPercent } from "@/lib/format";

/**
 * portfolio-hero (design.md § Components): uppercase eyebrow, the total in
 * serif h1 with a price-delta badge, and the portfolio-wide area chart with
 * range tabs. Day one shows a single point plus "history builds daily".
 */
export default function PortfolioHero({
  totalValue,
  dayChangePercent,
}: {
  totalValue: number;
  dayChangePercent: number | null;
}) {
  const [range, setRange] = useState<ChartRange>("30d");
  const history = useQuery(api.portfolio.history, { range });
  const data = history ?? [];

  return (
    <section className="pchart hero" style={{ width: "100%" }}>
      <div className="phead">
        <div>
          <div className="lbl2" style={{ font: "var(--type-label)", letterSpacing: "var(--type-label-ls)", textTransform: "uppercase", color: "var(--color-on-surface-muted)", marginBottom: 6 }}>
            Portfolio value
          </div>
          <div className="pval">
            {money(totalValue)}
            {dayChangePercent !== null && dayChangePercent !== 0 && (
              <span className={`pdelta ${dayChangePercent > 0 ? "up" : "down"}`}>
                {signedPercent(dayChangePercent).slice(1)}
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
              onClick={() => setRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {data.length >= 2 ? (
        <ChartArea data={data} />
      ) : (
        <ChartBaseline caption="Your portfolio charts from tonight. History builds daily." />
      )}
    </section>
  );
}
