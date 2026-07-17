"use client";

import { ReactNode, useState } from "react";
import { CircleX, Info, TriangleAlert } from "lucide-react";

type Kind = "info" | "warning" | "error";
const ICONS: Record<Kind, typeof Info> = { info: Info, warning: TriangleAlert, error: CircleX };

/**
 * System banner. Default is the inset card treatment (full hairline border,
 * rounded.sm); pass `flush` for the page-level strip under the nav (square
 * corners, side borders omitted, per design.md § banner).
 */
export default function Banner({
  kind = "info",
  flush = false,
  action,
  children,
}: {
  kind?: Kind;
  flush?: boolean;
  action?: ReactNode;
  children: ReactNode;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const Icon = ICONS[kind];
  return (
    <div
      className={`banner ${flush ? "flush" : ""}`}
      style={{ ["--sem" as string]: `var(--color-${kind})` }}
      role="region"
      aria-label="Site notice"
    >
      <Icon className="ic" size={16} strokeWidth={2} aria-hidden />
      {children}
      {action && <span className="bact">{action}</span>}
      <button className="bx" onClick={() => setDismissed(true)} aria-label="Dismiss notice">✕</button>
    </div>
  );
}
