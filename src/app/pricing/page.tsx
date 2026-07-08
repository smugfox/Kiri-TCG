export const metadata = { title: "Pricing" };

/** Placeholder: Polar checkout wires up in Phase 4. */
export default function PricingPage() {
  const plans = [
    { name: "Collector", price: "Free", blurb: "Up to 100 cards and one price alert. Every game, every card page." },
    { name: "Trader", price: "$6/mo", blurb: "Unlimited portfolio, unlimited alerts, priority nightly refresh." },
    { name: "Dealer", price: "$15/mo", blurb: "Everything in Trader, built for inventory-scale collections." },
  ];
  return (
    <div className="page" style={{ maxWidth: 1080, margin: "0 auto", padding: "var(--space-8) var(--space-5)" }}>
      <h1 style={{ font: "var(--type-h1)", letterSpacing: "var(--type-h1-ls)", marginBottom: "var(--space-3)" }}>Pricing</h1>
      <p style={{ color: "var(--color-on-surface-muted)", marginBottom: "var(--space-6)" }}>
        Annual billing saves 20%. Checkout opens later in the build; the free tier is fully usable today.
      </p>
      <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
        {plans.map((plan) => (
          <div key={plan.name} className="stat-tile" style={{ width: 280, flex: "1 1 240px" }}>
            <div className="lbl2">{plan.name}</div>
            <div className="num">{plan.price}</div>
            <div className="sub" style={{ color: "var(--color-on-surface-muted)", font: "var(--type-body-sm)" }}>{plan.blurb}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
