"use client";

import { ChevronDown } from "lucide-react";

export type SortDir = "asc" | "desc";

/**
 * sort-control (design.md § Components): compact select with a muted "Sort:"
 * prefix and a bordered direction toggle flipping between ↑ and ↓. Grids use
 * this where tables use sortable headers.
 */
export default function SortControl<Key extends string>({
  options,
  value,
  dir,
  onChange,
}: {
  options: Array<{ key: Key; label: string }>;
  value: Key;
  dir: SortDir;
  onChange: (value: Key, dir: SortDir) => void;
}) {
  const current = options.find((o) => o.key === value) ?? options[0];
  return (
    <span className="sortctl">
      <span className="ssel" style={{ position: "relative" }}>
        <span className="k">Sort:</span> <b>{current.label}</b>
        <ChevronDown size={13} aria-hidden />
        <select
          aria-label="Sort by"
          value={value}
          onChange={(e) => onChange(e.target.value as Key, dir)}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
        >
          {options.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </span>
      <button
        className="dir"
        aria-label={dir === "asc" ? "Sorted ascending" : "Sorted descending"}
        onClick={() => onChange(value, dir === "asc" ? "desc" : "asc")}
      >
        {dir === "asc" ? "↑" : "↓"}
      </button>
    </span>
  );
}
