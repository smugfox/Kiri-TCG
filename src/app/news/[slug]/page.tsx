import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/articles";
import { CompactCard } from "@/components/features/ContentCard";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  return article ? { title: article.title, description: article.standfirst } : {};
}

/** Article view: immersive cover header (the featured-card treatment at
 * page scale) over the editorial kit (design.md § Editorial). */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const initials = article.author.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  return (
    <div className="page" style={{ maxWidth: 1080, margin: "0 auto", padding: "var(--space-6) var(--space-5) var(--space-9)" }}>
      <article>
        <header
          className="article-hero"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(26,18,14,.18) 0%, rgba(26,18,14,.28) 30%, rgba(26,18,14,.55) 55%, rgba(26,18,14,.93) 100%)${article.cover ? `, url(${article.cover})` : ", var(--gradient-haku)"}`,
          }}
        >
          <Link href="/news" className="chip ah-chip" style={{ textDecoration: "none" }}>News · {article.category}</Link>
          <div className="article-hero-content">
            <h1 className="ttl">{article.title}</h1>
            <p className="stand">{article.standfirst}</p>
            <div className="author">
              <div className="av">{initials}</div>
              <div>
                <div className="nm">{article.author}</div>
                <div className="rl">{article.role} · {article.date} · {article.read}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="article-split">
          <div className="prose">
            {article.body.map((block, i) => {
              if (block.type === "h") return <div className="h" key={i}>{block.text}</div>;
              if (block.type === "quote")
                return (
                  <blockquote key={i}>
                    “{block.text}”
                    <footer>{block.attribution}</footer>
                  </blockquote>
                );
              return <p key={i}>{block.text}</p>;
            })}
          </div>
          <aside className="article-rail">
            <div className="author">
              <div className="av">{initials}</div>
              <div>
                <div className="nm">{article.author}</div>
                <div className="rl">{article.role}</div>
              </div>
            </div>
            <div className="side-list">
              <div className="slbl">Related articles</div>
              {related.map((r) => <Link key={r.slug} href={`/news/${r.slug}`}>{r.title}</Link>)}
            </div>
            <div className="cta-card">
              <div className="t">Tracking cards like this?</div>
              <div className="d">Kiri charts nightly prices and alerts you when they cross your threshold.</div>
              <Link href="/signin" className="btn btn-primary sm" style={{ textDecoration: "none" }}>Explore the demo</Link>
            </div>
          </aside>
        </div>
      </article>

      <div className="sechead" style={{ margin: "var(--space-8) 0 var(--space-5)" }}>
        <div>
          <div style={{ font: "var(--type-label)", letterSpacing: "var(--type-label-ls)", textTransform: "uppercase", color: "var(--color-on-surface-muted)", marginBottom: "var(--space-2)" }}>More from the desk</div>
          <div style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)" }}>Keep reading</div>
        </div>
        <Link className="btn btn-secondary sm" href="/news" style={{ textDecoration: "none" }}>All news</Link>
      </div>
      <div className="news-grid3">
        {related.map((a) => <CompactCard key={a.slug} a={a} />)}
      </div>
    </div>
  );
}
