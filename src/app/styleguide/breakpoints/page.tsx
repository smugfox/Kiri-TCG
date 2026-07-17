"use client";

/**
 * Dev scratch page: renders live pages inside fixed-width frames so every
 * component can be checked at each rung of the responsive ladder
 * (docs/design.md: 1024px card stacking · 900px mobile nav · 640px phone).
 * Frames are real viewports, so this never drifts from the shipped CSS.
 * Not linked from navigation.
 */
import { useState } from "react";

const WIDTHS = [
  { w: 390, note: "phone · cards stack vertically, wells hug their vignettes" },
  { w: 768, note: "tablet · fixed-width cards stretch full width, one per row; mobile nav" },
  { w: 1024, note: "ladder boundary · last width with full-width stacking; desktop nav" },
  { w: 1280, note: "desktop · cards at spec widths, three across" },
];

const PAGES = [
  { path: "/", label: "Home" },
  { path: "/pricing", label: "Pricing" },
  { path: "/signin", label: "Sign in" },
  { path: "/cards", label: "Cards" },
];

export default function Breakpoints() {
  const [page, setPage] = useState("/");
  return (
    <div className="page" style={{ paddingBottom: 96 }}>
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginTop: 32 }}>Breakpoint preview</h1>
      <p style={{ font: "var(--type-body-sm)", color: "var(--color-on-surface-muted)", margin: "8px 0 16px", maxWidth: "60ch" }}>
        Each frame is a live viewport at a rung of the responsive ladder, so what renders here is exactly
        what ships. Scroll inside a frame to review the full page.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {PAGES.map((p) => (
          <button
            key={p.path}
            className={`chip ${page === p.path ? "selected" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setPage(p.path)}
          >
            {p.label}
          </button>
        ))}
      </div>
      {WIDTHS.map(({ w, note }) => (
        <section key={w}>
          <h2 style={{ font: "var(--type-h4)", letterSpacing: "var(--type-h4-ls)", marginTop: 40 }}>{w}px</h2>
          <p style={{ font: "var(--type-caption)", letterSpacing: "var(--type-caption-ls)", color: "var(--color-on-surface-muted)", margin: "2px 0 12px" }}>
            {note}
          </p>
          <div style={{ width: "max-content", maxWidth: "100%", overflowX: "auto", border: "1px solid var(--color-border-strong)", borderRadius: "var(--rounded-md)", background: "var(--color-surface)" }}>
            <iframe
              key={`${page}-${w}`}
              src={page}
              title={`${page} at ${w}px`}
              style={{ width: w, height: 720, border: 0, display: "block" }}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
