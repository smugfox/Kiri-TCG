"use client";

import Link from "next/link";
import Sparkline from "@/components/charts/Sparkline";
import { money, signedMoney, signedPercent } from "@/lib/format";

type Summary = {
  costBasis: number | null;
  unrealizedPl: number | null;
  plPercent: number | null;
  cardCount: number;
  excludedCount: number;
  topMover: {
    name: string;
    gameSlug: string;
    slug: string;
    change7d: number;
    sparkline: number[];
  } | null;
};

/** stat-tile row per design.md: serif number over a label caption, deltas
 * in the sub line. Cost basis, unrealized P&L, card count, top mover. */
export default function StatTiles({ summary }: { summary: Summary }) {
  const plUp = summary.unrealizedPl !== null && summary.unrealizedPl >= 0;
  return (
    <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
      <div className="stat-tile">
        <div className="num" style={{ fontVariantNumeric: "tabular-nums" }}>
          {summary.costBasis !== null ? money(summary.costBasis) : "·"}
        </div>
        <div className="lbl2">Cost basis</div>
        {summary.costBasis === null && <div className="sub cs-set">Add price paid to track P&L</div>}
      </div>

      <div className="stat-tile">
        <div
          className="num"
          style={{
            fontVariantNumeric: "tabular-nums",
            color: summary.unrealizedPl === null ? undefined : `var(--color-trend-${plUp ? "up" : "down"})`,
          }}
        >
          {summary.unrealizedPl !== null ? signedMoney(summary.unrealizedPl) : "·"}
        </div>
        <div className="lbl2">Unrealized P&L</div>
        {summary.plPercent !== null && (
          <div className="sub">
            <span className={`pdelta ${plUp ? "up" : "down"}`}>{signedPercent(summary.plPercent).slice(1)}</span>
          </div>
        )}
      </div>

      <div className="stat-tile">
        <div className="num" style={{ fontVariantNumeric: "tabular-nums" }}>{summary.cardCount}</div>
        <div className="lbl2">Cards</div>
        {summary.excludedCount > 0 && (
          <div className="sub cs-set">{summary.excludedCount} without price data, excluded</div>
        )}
      </div>

      {summary.topMover && (
        <div className="stat-tile">
          <div className="num" style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)" }}>
            <Link
              href={`/cards/${summary.topMover.gameSlug}/${summary.topMover.slug}`}
              title={summary.topMover.name}
              style={{ color: "inherit", textDecoration: "none", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {summary.topMover.name}
            </Link>
          </div>
          <div className="lbl2">Top mover</div>
          <div className="sub" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className={`pdelta ${summary.topMover.change7d >= 0 ? "up" : "down"}`} style={{ whiteSpace: "nowrap" }}>
              {signedPercent(summary.topMover.change7d).slice(1)} · 7d
            </span>
            <Sparkline points={summary.topMover.sparkline} width={90} height={28} />
          </div>
        </div>
      )}
    </div>
  );
}
