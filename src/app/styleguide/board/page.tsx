/** Variant board: day-one chart state + danger-card layout. Temporary. */

const chartFrame: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--rounded-md)",
  padding: "var(--space-5)",
  width: 640,
};
const capStyle: React.CSSProperties = {
  font: "var(--type-body-sm)",
  color: "var(--color-on-surface-muted)",
  textAlign: "center",
};
const h = (t: string, d: string) => (
  <div style={{ marginBottom: 12 }}>
    <h2 style={{ font: "var(--type-h3)", marginBottom: 4 }}>{t}</h2>
    <p style={{ font: "var(--type-body-sm)", color: "var(--color-on-surface-muted)" }}>{d}</p>
  </div>
);

function Head() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
      <div>
        <div style={{ font: "var(--type-label)", letterSpacing: "var(--type-label-ls)", textTransform: "uppercase", color: "var(--color-on-surface-muted)", marginBottom: 4 }}>Portfolio value</div>
        <div style={{ font: "var(--type-h2)" }}>$5.00</div>
      </div>
      <span className="range-tabs"><button>7D</button><button className="active">30D</button><button>90D</button></span>
    </div>
  );
}

const dangerText = (
  <div className="dinfo">
    <div className="dt">Delete account</div>
    <div className="dd">Removes your portfolio, watchlist, alerts, and history for good, and cancels any subscription. There is no undo.</div>
  </div>
);

export default function Board() {
  return (
    <div style={{ maxWidth: 1420, margin: "0 auto", padding: 40, display: "grid", gap: 40 }}>
      <h1 style={{ font: "var(--type-h2)" }}>Day-one chart state</h1>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div>
          {h("A · Flat line at today's value", "What Robinhood does: the chart exists, it just hasn't moved yet. Solid bronze line, real terminal dot.")}
          <div style={chartFrame}>
            <Head />
            <div style={{ position: "relative", height: 150 }}>
              <div style={{ position: "absolute", left: 0, right: 14, top: "50%", height: 2, background: "var(--color-accent)" }} />
              <span style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-accent) 20%, transparent)" }} />
            </div>
            <div style={capStyle}>Your portfolio charts from tonight. History builds daily.</div>
          </div>
        </div>

        <div>
          {h("B · Ghost chart", "A faded, plausible price path where the chart will live. Decorative, clearly not data.")}
          <div style={chartFrame}>
            <Head />
            <div style={{ position: "relative", height: 150, display: "flex", alignItems: "center" }}>
              <svg width="100%" height="120" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden>
                <path d="M0,88 C60,84 90,66 140,70 C190,74 220,40 280,46 C340,52 370,76 420,60 C470,44 520,30 600,24"
                  fill="none" stroke="var(--color-border-strong)" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
              </svg>
            </div>
            <div style={capStyle}>Your portfolio charts from tonight. History builds daily.</div>
          </div>
        </div>

        <div>
          {h("C · Empty chart skeleton", "The chart's own gridlines and axis, no series. Reads as an empty instrument, not a graphic.")}
          <div style={chartFrame}>
            <Head />
            <div style={{ position: "relative", height: 150, display: "grid", alignContent: "space-between", padding: "10px 0" }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ height: 1, background: "var(--color-border)" }} />
              ))}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...capStyle, background: "var(--color-surface)", padding: "0 14px" }}>
                  Your portfolio charts from tonight. History builds daily.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 style={{ font: "var(--type-h2)", marginTop: 16 }}>Danger card layout</h1>
      <div style={{ display: "grid", gap: 24, maxWidth: 760 }}>
        <div>
          {h("A · Button beside the title (current)", "Top-right, aligned with the heading row.")}
          <div className="danger-card" style={{ maxWidth: "none", alignItems: "flex-start" }}>
            {dangerText}
            <button className="btn btn-destructive">Delete account</button>
          </div>
        </div>

        <div>
          {h("B · Button centered with the copy block", "Vertically centered against the whole text, GitHub-style.")}
          <div className="danger-card" style={{ maxWidth: "none", alignItems: "center" }}>
            {dangerText}
            <button className="btn btn-destructive">Delete account</button>
          </div>
        </div>

        <div>
          {h("C · Button under the copy, left-aligned", "Stacked: read everything first, act last. Slowest, most deliberate.")}
          <div className="danger-card" style={{ maxWidth: "none", display: "block" }}>
            {dangerText}
            <div style={{ marginTop: "var(--space-4)" }}>
              <button className="btn btn-destructive">Delete account</button>
            </div>
          </div>
        </div>

        <div>
          {h("D · Button bottom-right, save-row style", "Mirrors the Save placement in the other settings cards.")}
          <div className="danger-card" style={{ maxWidth: "none", display: "block" }}>
            {dangerText}
            <div style={{ marginTop: "var(--space-4)", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-destructive">Delete account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
