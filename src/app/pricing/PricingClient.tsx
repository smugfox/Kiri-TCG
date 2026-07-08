"use client";

import { useState } from "react";
import Link from "next/link";
import PlanCards from "@/components/features/PlanCards";

/** FAQ copy from product-vision § objection handlers. */
const FAQ = [
  {
    q: "Another tracker?",
    a: "Trackers list cards; Kiri does portfolio math. Cost basis, P&L, movers, and daily history across every game you collect, in one place.",
  },
  {
    q: "Are the prices legit?",
    a: "Market data refreshed nightly, per condition and printing, with the update time printed next to every number. Stale prices are honest prices.",
  },
  {
    q: "Why pay when spreadsheets are free?",
    a: "Your spreadsheet was stale the day you made it. Kiri reprices your whole collection every night while you sleep.",
  },
  {
    q: "Does it do my game?",
    a: "Magic, Pokémon, Yu-Gi-Oh, and Sorcery at launch, including Japanese sets. The model is game-agnostic on purpose; more games follow demand.",
  },
];

export default function PricingClient() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="page" style={{ maxWidth: 1080, margin: "0 auto", padding: "var(--space-8) var(--space-5)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-7)" }}>
        <h1 style={{ font: "var(--type-h1)", letterSpacing: "var(--type-h1-ls)", marginBottom: "var(--space-3)" }}>
          Pricing
        </h1>
        <p style={{ font: "var(--type-body-lg)", color: "var(--color-on-surface-muted)", maxWidth: "48ch", margin: "0 auto" }}>
          Free until your collection outgrows it. Upgrade when the shoebox becomes a portfolio.
        </p>
      </div>

      <PlanCards />

      <section style={{ margin: "var(--space-9) auto 0", maxWidth: 560 }}>
        <h2 style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)", marginBottom: "var(--space-4)" }}>
          Fair questions
        </h2>
        <div className="acc" style={{ width: "100%" }}>
          {FAQ.map((item, i) => (
            <div className="acc-i" key={item.q}>
              <div
                className="acc-q"
                role="button"
                tabIndex={0}
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setOpen(open === i ? null : i);
                }}
              >
                {item.q}
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: open === i ? "rotate(180deg)" : undefined, transition: "transform .15s", color: "var(--color-on-surface-muted)", flex: "none" }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              {open === i && <div className="acc-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "var(--space-9)" }}>
        <div className="ctaband">
          <div className="t">Your collection has a number.</div>
          <div className="d">Find it tonight. Ten cards in, you&apos;ll know what the binder is worth.</div>
          <Link href="/signin" className="btn btn-inverted">Start tracking free</Link>
        </div>
      </section>
    </div>
  );
}
