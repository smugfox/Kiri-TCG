"use client";

import { ReactNode } from "react";

export default function Chip({
  children,
  selected = false,
  onRemove,
  className = "",
}: {
  children: ReactNode;
  selected?: boolean;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span className={`chip ${selected ? "selected" : ""} ${className}`}>
      {children}
      {onRemove && (
        <button className="x" onClick={onRemove} aria-label="Remove filter" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
          ✕
        </button>
      )}
    </span>
  );
}
