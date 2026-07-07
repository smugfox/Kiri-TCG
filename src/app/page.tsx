import Link from "next/link";

export default function Home() {
  return (
    <div className="page">
      <section className="mhero-lite">
        <span className="chip">Portfolio tracking</span>
        <h1>Know what your collection is worth</h1>
        <p>
          Track prices across Magic, Pokémon, Yu-Gi-Oh, and Sorcery. Add cards in
          seconds, follow every swing, and trade with confidence.
        </p>
        <div className="cta">
          <Link href="/signin" className="btn btn-primary">Start tracking free</Link>
          <Link href="/cards" className="btn btn-secondary">Browse cards →</Link>
        </div>
        <p className="note">Full landing page arrives in Phase 4; this is the Phase 0 shell.</p>
      </section>
    </div>
  );
}
