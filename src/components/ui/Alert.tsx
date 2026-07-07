import { ReactNode } from "react";

type Kind = "info" | "success" | "warning" | "error";
const icon: Record<Kind, string> = { info: "ℹ", success: "✓", warning: "⚠", error: "✗" };

export default function Alert({ kind = "info", children }: { kind?: Kind; children: ReactNode }) {
  return (
    <div className="alert" style={{ ["--sem" as string]: `var(--color-${kind})` }} role={kind === "error" || kind === "warning" ? "alert" : "status"}>
      <span className="ic" aria-hidden="true">{icon[kind]}</span> {children}
    </div>
  );
}
