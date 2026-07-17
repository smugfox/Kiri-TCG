import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { CompactCard, FeaturedCard, StandardCard } from "@/components/features/ContentCard";

export const metadata = {
  title: "News",
  description: "Market moves, collecting guides, and set reviews from the Kiri desk.",
};

/** The news hub: magazine layout (design.md § content cards) with the
 * category desks below the fold. */
export default function NewsPage() {
  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
  const rest = ARTICLES.filter((a) => a.slug !== featured.slug);
  const desks = [
    { eyebrow: "Market", title: "Market movers", items: rest.filter((a) => a.category === "Market") },
    { eyebrow: "Collecting", title: "The collector's desk", items: rest.filter((a) => a.category === "Collecting") },
    { eyebrow: "Strategy · Sets", title: "Play & preview", items: rest.filter((a) => a.category === "Strategy" || a.category === "Sets") },
  ];
  return (
    <div className="page" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 var(--space-5) var(--space-9)" }}>
      <header style={{ margin: "var(--space-7) 0 var(--space-6)" }}>
        <div className="eyebrow" style={{ font: "var(--type-label)", letterSpacing: "var(--type-label-ls)", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: "var(--space-2)" }}>The Kiri desk</div>
        <h1 style={{ font: "var(--type-h1)", letterSpacing: "var(--type-h1-ls)" }}>News</h1>
      </header>

      <FeaturedCard a={featured} />

      <div className="sechead" style={{ margin: "var(--space-7) 0 var(--space-5)" }}>
        <div>
          <div className="eyebrow" style={{ font: "var(--type-label)", letterSpacing: "var(--type-label-ls)", textTransform: "uppercase", color: "var(--color-on-surface-muted)", marginBottom: "var(--space-2)" }}>Latest</div>
          <div style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)" }}>Fresh off the binder</div>
        </div>
      </div>
      <div className="news-grid3">
        {rest.slice(0, 3).map((a) => <StandardCard key={a.slug} a={a} />)}
      </div>

      {desks.map((desk) =>
        desk.items.length === 0 ? null : (
          <div key={desk.title}>
            <div className="sechead" style={{ margin: "var(--space-7) 0 var(--space-5)" }}>
              <div>
                <div className="eyebrow" style={{ font: "var(--type-label)", letterSpacing: "var(--type-label-ls)", textTransform: "uppercase", color: "var(--color-on-surface-muted)", marginBottom: "var(--space-2)" }}>{desk.eyebrow}</div>
                <div style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)" }}>{desk.title}</div>
              </div>
              <Link className="btn btn-secondary sm" href="/news" style={{ textDecoration: "none" }}>View all</Link>
            </div>
            <div className="news-grid4">
              {desk.items.slice(0, 4).map((a) => <CompactCard key={a.slug} a={a} />)}
            </div>
          </div>
        )
      )}
    </div>
  );
}
