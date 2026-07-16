/**
 * Full-bleed market strip under the homepage hero. Stays brand-950 dark in
 * both themes, like the footer. Sample data for now; wire to Convex movers
 * when live prices should drive it. Pauses on hover, static under
 * prefers-reduced-motion.
 */
const TICKS: ReadonlyArray<readonly [string, string, string, boolean]> = [
  ["The One Ring", "$98.65", "+1.6%", true],
  ["Umbreon VMAX", "$1,318.00", "+2.1%", true],
  ["Blue-Eyes White Dragon", "$34.75", "+2.3%", true],
  ["Philosopher's Stone", "$3,898.96", "+0.8%", true],
  ["Pikachu ex", "$21.60", "-0.4%", false],
  ["Dark Magician", "$12.95", "+0.9%", true],
  ["Lightning Bolt", "$52.40", "+4.8%", true],
  ["Charizard VMAX", "$88.10", "-1.2%", false],
];

export default function MarketTicker({ bleed = false }: { bleed?: boolean }) {
  const row = (key: string) => (
    <div className="trow" key={key} aria-hidden={key === "b"}>
      {TICKS.map(([name, price, delta, up]) => (
        <span className="tick" key={`${key}-${name}`}>
          <b>{name}</b> {price} <i className={up ? "up" : "down"}>{delta}</i>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`market-ticker ${bleed ? "ticker-bleed" : ""}`} role="marquee" aria-label="Card market movers">
      {row("a")}
      {row("b")}
    </div>
  );
}
