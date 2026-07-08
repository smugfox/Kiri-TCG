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

/** stat-tile row: cost basis, unrealized P&L in trend colors, card count,
 * top mover with inline sparkline (design.md § Components). */
export default function StatTiles({ summary }: { summary: Summary }) {
  const plClass =
    summary.unrealizedPl === null ? "" : summary.unrealizedPl >= 0 ? "up" : "down";
  return (
    <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
      <div className="stat-tile">
        <div className="lbl2">Cost basis</div>
        <div className="num" style={{ fontVariantNumeric: "tabular-nums" }}>
          {summary.costBasis !== null ? money(summary.costBasis) : "·"}
        </div>
        {summary.costBasis === null && <div className="sub cs-set">Add price paid to track P&L</div>}
      </div>
      <div className="stat-tile">
        <div className="lbl2">Unrealized P&L</div>
        <div className={`num pl ${plClass}`} style={{ fontVariantNumeric: "tabular-nums" }}>
          {summary.unrealizedPl !== null ? signedMoney(summary.unrealizedPl) : "·"}
        </div>
        {summary.plPercent !== null && (
          <div className={`sub pl ${plClass}`}>{signedPercent(summary.plPercent)}</div>
        )}
      </div>
      <div className="stat-tile">
        <div className="lbl2">Cards</div>
        <div className="num" style={{ fontVariantNumeric: "tabular-nums" }}>{summary.cardCount}</div>
        {summary.excludedCount > 0 && (
          <div className="sub cs-set">{summary.excludedCount} without price data, excluded</div>
        )}
      </div>
      {summary.topMover && (
        <div className="stat-tile">
          <div className="lbl2">Top mover</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <div>
              <Link
                href={`/cards/${summary.topMover.gameSlug}/${summary.topMover.slug}`}
                style={{ font: "500 14px/1.4 var(--font-body)", color: "inherit", textDecoration: "none" }}
              >
                {summary.topMover.name}
              </Link>
              <div className={`pl ${summary.topMover.change7d >= 0 ? "up" : "down"}`} style={{ fontSize: 13 }}>
                {signedPercent(summary.topMover.change7d)} · 7d
              </div>
            </div>
            <Sparkline points={summary.topMover.sparkline} />
          </div>
        </div>
      )}
    </div>
  );
}
