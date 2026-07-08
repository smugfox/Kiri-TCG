"use client";

import { money } from "@/lib/format";

// Segment palette per design.md: bronze, slate, plum, gold, with 2px paper gaps.
const SEGMENT_COLORS = [
  "var(--color-accent)",
  "var(--color-accent-alt)",
  "var(--color-rarity-epic)",
  "var(--color-rarity-rare)",
];

export default function AllocationBar({
  allocation,
}: {
  allocation: Array<{ gameSlug: string; gameName: string; value: number; percent: number }>;
}) {
  if (allocation.length === 0) return null;
  return (
    <div className="alloc" style={{ width: "100%" }}>
      <div className="bar" role="img" aria-label="Portfolio allocation by game">
        {allocation.map((seg, i) => (
          <span
            key={seg.gameSlug}
            style={{ width: `${seg.percent}%`, background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
          />
        ))}
      </div>
      <div className="legend">
        {allocation.map((seg, i) => (
          <span className="li" key={seg.gameSlug}>
            <span className="dot" style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }} />
            {seg.gameName} <span className="v">{money(seg.value)} · {seg.percent.toFixed(0)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
