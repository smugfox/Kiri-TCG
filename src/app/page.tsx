import Link from "next/link";
import PlanCards from "@/components/features/PlanCards";
import HeroShowcase from "@/components/features/HeroShowcase";
import MarketTicker from "@/components/features/MarketTicker";

export const metadata = {
  description:
    "Track prices across Magic, Pokémon, Yu-Gi-Oh, and Sorcery. Add cards in seconds, follow every swing, and trade with confidence.",
};

/** Landing page per product-vision § Messaging Framework; copy verbatim. */
export default function Home() {
  return (
    <div className="page" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 var(--space-5)" }}>

      <section className="mhero hero-flex">
        <div className="hero-copy">
          <span className="chip">The stock app for your card collection</span>
          <h1 className="mtitle">Know what your collection is <em>worth.</em></h1>
          <p className="msub">
            Track prices across Magic, Pokémon, Yu-Gi-Oh, and Sorcery. Add cards in
            seconds, follow every swing, and trade with confidence.
          </p>
          <div className="mcta">
            <Link href="/signin" className="btn btn-primary">Start tracking free</Link>
            <Link href="/cards" className="btn btn-secondary">Browse card prices</Link>
          </div>
          <div className="hero-fresh"><span className="dot" /> 23,412 prices refreshed last night</div>
        </div>
        <HeroShowcase />
      </section>

      <section style={{ padding: "var(--space-7) 0" }}>
        <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <div className="fcard">
            <div className="well">
              <div className="mini">
                <div className="mrow" style={{ justifyContent: "space-between" }}>
                  <b style={{ font: "var(--type-h4)", fontFamily: "var(--font-heading)" }}>$2,340.19</b>
                  <span className="pdelta up">1.8%</span>
                </div>
                <div className="mrow dim">Cost basis · $1,610.00</div>
                <div className="mrow dim">Unrealized P&L · <span className="pl up">+$730.19</span></div>
              </div>
            </div>
            <div className="cap">
              <div className="t">Your whole collection, one number</div>
              <div className="d">Portfolio value, daily change, and P&L across every game you collect.</div>
            </div>
          </div>

          <div className="fcard">
            <div className="well">
              <div className="mini">
                <div className="mrow"><b>Lightning Bolt</b></div>
                <div className="mrow dim">passed your $50.00 alert</div>
                <div className="mrow"><span className="pl up">now $52.40</span></div>
              </div>
            </div>
            <div className="cap">
              <div className="t">The market watches itself</div>
              <div className="d">Set a threshold on any card; Kiri tells you when it crosses. Sell the spike instead of reading about it.</div>
            </div>
          </div>

          <div className="fcard">
            <div className="well">
              <div className="mini">
                <div className="mrow">Magic <span style={{ marginLeft: "auto", color: "var(--color-on-surface-muted)" }}>1,204 cards</span></div>
                <div className="mrow">Pokémon <span style={{ marginLeft: "auto", color: "var(--color-on-surface-muted)" }}>862</span></div>
                <div className="mrow">Yu-Gi-Oh <span style={{ marginLeft: "auto", color: "var(--color-on-surface-muted)" }}>590</span></div>
                <div className="mrow">Sorcery <span style={{ marginLeft: "auto", color: "var(--color-on-surface-muted)" }}>118</span></div>
              </div>
            </div>
            <div className="cap">
              <div className="t">Every game in one binder</div>
              <div className="d">Prices you can check the freshness of: dated, charted, and per-condition, across all four games.</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "var(--space-7) 0" }}>
        <div className="sechead" style={{ marginBottom: "var(--space-6)" }}>
          <div>
            <div className="eyebrow">Pricing</div>
            <div className="st">Free until it outgrows the shoebox</div>
            <div className="si">A real portfolio for up to 100 cards, free forever. Trader unlocks the rest.</div>
          </div>
          <Link className="btn btn-secondary sm" href="/pricing" style={{ textDecoration: "none" }}>Compare plans</Link>
        </div>
        <PlanCards showToggle={false} />
      </section>

      <section style={{ padding: "var(--space-7) 0 var(--space-9)" }}>
        <div className="ctaband">
          <div className="t">Your collection has a number.</div>
          <div className="d">Find it tonight. Ten cards in, you&apos;ll know what the binder is worth.</div>
          <Link href="/signin" className="btn btn-inverted">Start tracking free</Link>
        </div>
      </section>

      <MarketTicker bleed aboveFooter />
    </div>
  );
}
