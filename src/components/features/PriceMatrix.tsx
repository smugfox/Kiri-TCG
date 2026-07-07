"use client";

import { money } from "@/lib/format";

export type MatrixVariant = {
  _id: string;
  condition: string;
  printing: string;
  currentPrice?: number;
};

const CONDITION_ORDER = ["NM", "LP", "MP", "HP", "DMG"];

/**
 * The compact card-page price matrix: condition rows × printing columns,
 * every cell a right-aligned tabular price (design.md § Components). Cells
 * select the chart's variant.
 */
export default function PriceMatrix({
  variants,
  selectedId,
  onSelect,
}: {
  variants: MatrixVariant[];
  selectedId?: string;
  onSelect: (variant: MatrixVariant) => void;
}) {
  const printings = [...new Set(variants.map((x) => x.printing))].sort((a, b) =>
    a === "Normal" ? -1 : b === "Normal" ? 1 : a.localeCompare(b),
  );
  const conditions = CONDITION_ORDER.filter((c) => variants.some((x) => x.condition === c));
  const byCell = new Map(variants.map((x) => [`${x.condition}|${x.printing}`, x]));

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="demo" style={{ maxWidth: "none", width: "100%" }}>
        <thead>
          <tr>
            <th scope="col">Condition</th>
            {printings.map((p) => (
              <th scope="col" key={p} style={{ textAlign: "right" }}>
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {conditions.map((condition) => (
            <tr key={condition}>
              <td style={{ fontWeight: 500 }}>{condition}</td>
              {printings.map((printing) => {
                const variant = byCell.get(`${condition}|${printing}`);
                const selected = variant && variant._id === selectedId;
                return (
                  <td key={printing} style={{ textAlign: "right", padding: 0 }}>
                    {variant?.currentPrice !== undefined ? (
                      <button
                        onClick={() => onSelect(variant)}
                        aria-pressed={selected}
                        style={{
                          font: "inherit",
                          fontVariantNumeric: "tabular-nums",
                          fontWeight: selected ? 600 : 400,
                          color: selected ? "var(--color-accent)" : "inherit",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "right",
                          padding: "12px 16px",
                        }}
                      >
                        {money(variant.currentPrice)}
                      </button>
                    ) : (
                      <span style={{ display: "block", padding: "12px 16px", color: "var(--color-on-surface-muted)" }}>
                        ·
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
