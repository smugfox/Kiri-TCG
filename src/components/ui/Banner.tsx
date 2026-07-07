"use client";

import { ReactNode, useState } from "react";

type Kind = "info" | "warning" | "error";
const icon: Record<Kind, string> = { info: "ℹ", warning: "⚠", error: "✗" };

export default function Banner({ kind = "info", action, children }: { kind?: Kind; action?: ReactNode; children: ReactNode }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="banner" style={{ ["--sem" as string]: `var(--color-${kind})` }} role="region" aria-label="Site notice">
      <span className="ic" aria-hidden="true">{icon[kind]}</span>
      {children}
      {action && <span className="bact">{action}</span>}
      <button className="bx" onClick={() => setDismissed(true)} aria-label="Dismiss notice">✕</button>
    </div>
  );
}
