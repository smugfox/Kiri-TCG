/**
 * Variant board: card-tile meta layout. Temporary scratch route for
 * picking a direction; deleted once a variant ships.
 */

const cards = [
  { name: "Bulbasaur", set: "Pokemon TCG Classic: Venusaur", num: "001/032", tier: "common", price: "$15.82", delta: "▲ 0.5%", up: true },
  { name: "Lightning Bolt", set: "Masters 25", num: "141", tier: "uncommon", price: "$1.25", delta: "▼ 2.3%", up: false },
  { name: "Snorlax", set: "McDonald's Pokémon-e Minimum Pack", num: "001/018", tier: "mythic", price: "$150.00", delta: "", up: true },
];

const tierColor: Record<string, string> = {
  common: "var(--color-rarity-common)",
  uncommon: "var(--color-rarity-uncommon)",
  mythic: "var(--color-rarity-mythic)",
};

const ell: React.CSSProperties = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
const cover: React.CSSProperties = { aspectRatio: "63 / 88", borderRadius: "var(--rounded-sm)", background: "var(--gradient-haku)", marginBottom: "var(--space-3)" };
const tile: React.CSSProperties = { width: 200, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--rounded-md)", padding: "var(--space-3)" };
const nameStyle: React.CSSProperties = { font: "500 14px/1.35 var(--font-body)", marginBottom: 2, ...ell };
const setStyle: React.CSSProperties = { font: "var(--type-caption)", letterSpacing: "var(--type-caption-ls)", color: "var(--color-on-surface-muted)", ...ell };
const priceRow: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", font: "500 14px/1.4 var(--font-body)", fontVariantNumeric: "tabular-nums", marginTop: "var(--space-2)" };
const dotLabel = (tier: string): React.CSSProperties => ({ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--type-label)", letterSpacing: "var(--type-label-ls)", textTransform: "uppercase", color: "var(--color-on-surface-muted)" });
const dot = (tier: string): React.CSSProperties => ({ width: 8, height: 8, borderRadius: "50%", background: tierColor[tier], flex: "none", display: "inline-block" });

function Delta({ delta, up }: { delta: string; up: boolean }) {
  if (!delta) return null;
  return <span className={`pdelta ${up ? "up" : "down"}`} style={{ fontSize: 12 }}>{delta.slice(2)}</span>;
}

export default function TileBoard() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40, display: "grid", gap: 48 }}>
      <section>
        <h2 style={{ font: "var(--type-h3)", marginBottom: 6 }}>A · rarity dot leads the set line</h2>
        <p style={{ color: "var(--color-on-surface-muted)", marginBottom: 16, font: "var(--type-body-sm)" }}>Dot color carries the tier (label on hover). Three rows, most compact.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {cards.map((c) => (
            <div key={c.name} style={tile}>
              <div style={cover} />
              <div style={nameStyle}>{c.name}</div>
              <div style={{ ...setStyle, display: "flex", alignItems: "center", gap: 6 }} title={c.tier}>
                <span style={dot(c.tier)} />
                <span style={ell}>{c.set} · {c.num}</span>
              </div>
              <div style={priceRow}><span>{c.price}</span><Delta delta={c.delta} up={c.up} /></div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ font: "var(--type-h3)", marginBottom: 6 }}>B · rarity eyebrow above the name</h2>
        <p style={{ color: "var(--color-on-surface-muted)", marginBottom: 16, font: "var(--type-body-sm)" }}>Collector-first: tier reads before the name, brokerage-listing feel. Four rows.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {cards.map((c) => (
            <div key={c.name} style={tile}>
              <div style={cover} />
              <div style={{ ...dotLabel(c.tier), marginBottom: 3 }}><span style={dot(c.tier)} />{c.tier}</div>
              <div style={nameStyle}>{c.name}</div>
              <div style={setStyle}>{c.set} · {c.num}</div>
              <div style={priceRow}><span>{c.price}</span><Delta delta={c.delta} up={c.up} /></div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ font: "var(--type-h3)", marginBottom: 6 }}>C · rarity row between set and price</h2>
        <p style={{ color: "var(--color-on-surface-muted)", marginBottom: 16, font: "var(--type-body-sm)" }}>Every fact on its own line, airiest and tallest. Four rows.</p>
        <div style={{ display: "flex", gap: 16 }}>
          {cards.map((c) => (
            <div key={c.name} style={tile}>
              <div style={cover} />
              <div style={nameStyle}>{c.name}</div>
              <div style={setStyle}>{c.set} · {c.num}</div>
              <div style={{ ...dotLabel(c.tier), marginTop: 3 }}><span style={dot(c.tier)} />{c.tier}</div>
              <div style={priceRow}><span>{c.price}</span><Delta delta={c.delta} up={c.up} /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
