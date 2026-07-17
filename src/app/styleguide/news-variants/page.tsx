/**
 * Dev scratch page: three layout directions for a Kiri "News" content hub
 * (TCGplayer-content-style) built from the design system's notched content
 * cards (card-featured / card-standard / card-compact). Throwaway board;
 * the winning direction gets promoted into a real /news route.
 * Not linked from navigation.
 */
import Link from "next/link";

type Article = {
  title: string;
  excerpt?: string;
  date: string;
  read: string;
  category: string;
  cover?: string;
};

const ARTICLES: Article[] = [
  {
    title: "The One Ring Keeps Climbing: What Its Third Rally Tells Us",
    excerpt: "Three spikes in twelve months is not hype, it is a supply story. We chart every reprint rumor against the price line.",
    date: "Jul 14, 2026", read: "12 min read", category: "Market",
    cover: "/cards/the-one-ring.jpg",
  },
  {
    title: "Moonbreon at $1,300: Anatomy of the Modern Grail",
    excerpt: "Evolving Skies did everything wrong for sealed collectors and everything right for Umbreon. A case study in chase-card economics.",
    date: "Jul 11, 2026", read: "9 min read", category: "Market",
    cover: "/cards/umbreon-vmax.png",
  },
  {
    title: "Sorcery's Alpha Foils Are Quietly Outperforming Everything",
    excerpt: "The Philosopher's Stone doubled while blue chips slept. Inside the smallest, strangest corner of the TCG market.",
    date: "Jul 8, 2026", read: "11 min read", category: "Collecting",
    cover: "/cards/philosophers-stone.jpg",
  },
  {
    title: "Grading in 2026: When PSA 9 Beats a Raw Near Mint",
    excerpt: "We priced 400 slabs against their raw twins across four games. The premium is real, but only above a threshold.",
    date: "Jul 5, 2026", read: "14 min read", category: "Collecting",
    cover: "https://d27a44hjr9gen3.cloudfront.net/cards/001-boneyard-b-s.png",
  },
  {
    title: "Budget Blue-Eyes: A Tier Deck for Under $40",
    excerpt: "Ranked play without the wallet damage. Every swap explained, every cut justified.",
    date: "Jul 2, 2026", read: "7 min read", category: "Strategy",
    cover: "https://images.pokemontcg.io/base1/4_hires.png",
  },
  {
    title: "Set Review: Edge of Eternities for Collectors, Not Players",
    date: "Jun 28, 2026", read: "10 min read", category: "Sets",
  },
  {
    title: "Five Storage Mistakes Quietly Eating Your Collection's Value",
    date: "Jun 24, 2026", read: "6 min read", category: "Collecting",
  },
  {
    title: "Why Nightly Prices Beat Live Tickers for Collectors",
    date: "Jun 20, 2026", read: "8 min read", category: "Market",
  },
];

function Notch() {
  return (
    <div className="notch">
      <svg className="ncap" viewBox="0 0 44 46" aria-hidden="true">
        <path d="M0 46 Q12 46 16 36 L26 14 C29 7 32 0 44 0 L44 46 Z" />
      </svg>
      <div className="nbody">
        <button className="caction"><span className="txt">Read More</span><span className="arr">→</span></button>
      </div>
    </div>
  );
}

function Cover({ a, meta = true }: { a: Article; meta?: boolean }) {
  return (
    <div className="cover">
      <div className="img" style={a.cover ? { background: `center / cover no-repeat url(${a.cover}), var(--gradient-haku)` } : undefined} />
      {meta && <span className="meta-onimg">{a.date} · {a.read}</span>}
    </div>
  );
}

function FeaturedCard({ a, tall = false }: { a: Article; tall?: boolean }) {
  return (
    <article className={`ccard ccard-featured ${tall ? "tall" : ""}`}>
      <div className="cover">
        <div className="img" style={a.cover ? { background: `center / cover no-repeat url(${a.cover}), var(--gradient-haku)` } : undefined} />
        <div className="scrim" />
      </div>
      <span className="chip float-chip">Featured</span>
      <div className="ov-content">
        <div className="meta">{a.date} · {a.read}</div>
        <div className="ttl">{a.title}</div>
        {a.excerpt && <p className="exc">{a.excerpt}</p>}
      </div>
      <Notch />
    </article>
  );
}

function StandardCard({ a }: { a: Article }) {
  return (
    <article className="ccard ccard-standard">
      <Cover a={a} />
      <div className="body-block">
        <div className="ttl">{a.title}</div>
        {a.excerpt && <p className="exc">{a.excerpt}</p>}
      </div>
      <Notch />
    </article>
  );
}

function CompactCard({ a }: { a: Article }) {
  return (
    <article className="ccard ccard-compact">
      <Cover a={a} />
      <div className="body-block">
        <div className="ttl">{a.title}</div>
      </div>
      <Notch />
    </article>
  );
}

function SectionHead({ eyebrow, title, action = "View all" }: { eyebrow: string; title: string; action?: string }) {
  return (
    <div className="sechead" style={{ margin: "var(--space-7) 0 var(--space-5)" }}>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <div className="st" style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)" }}>{title}</div>
      </div>
      <Link className="btn btn-secondary sm" href="#" style={{ textDecoration: "none" }}>{action}</Link>
    </div>
  );
}

function VariantLabel({ n, name, note }: { n: string; name: string; note: string }) {
  return (
    <div className="nv-vhead">
      <span className="nv-vnum">Variant {n}</span>
      <span className="nv-vname">{name}</span>
      <span className="nv-vnote">{note}</span>
    </div>
  );
}

export default function NewsVariants() {
  const [feat, ...rest] = ARTICLES;
  return (
    <div className="page nv-page">
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginTop: 32 }}>News hub variants</h1>
      <p style={{ font: "var(--type-body-sm)", color: "var(--color-on-surface-muted)", margin: "8px 0 40px", maxWidth: "62ch" }}>
        Three directions for a Kiri content hub built from the notched content cards.
        Hover any card: the notch arrow expands into Read More and the cover zooms.
      </p>

      <VariantLabel n="01" name="Magazine hub" note="featured story on top, latest grid, compact tail; closest to TCGplayer's content page" />
      <section className="nv-canvas">
        <FeaturedCard a={feat} />
        <SectionHead eyebrow="Latest" title="Fresh off the binder" />
        <div className="nv-grid3">
          {rest.slice(0, 3).map((a) => <StandardCard key={a.title} a={a} />)}
        </div>
        <div className="nv-grid4" style={{ marginTop: "var(--space-5)" }}>
          {rest.slice(3, 7).map((a) => <CompactCard key={a.title} a={a} />)}
        </div>
      </section>

      <VariantLabel n="02" name="Front page with rail" note="featured beside a compact rail, then one curated section; editorial front-page rhythm" />
      <section className="nv-canvas">
        <div className="nv-split">
          <FeaturedCard a={feat} tall />
          <div className="nv-rail">
            {rest.slice(0, 3).map((a) => <CompactCard key={a.title} a={a} />)}
          </div>
        </div>
        <SectionHead eyebrow="Market" title="This week in prices" action="All market stories" />
        <div className="nv-grid3">
          {rest.slice(3, 6).map((a) => <StandardCard key={a.title} a={a} />)}
        </div>
      </section>

      <VariantLabel n="03" name="Category desks" note="no hero; each desk leads with a standard card and trails compact, like newspaper sections" />
      <section className="nv-canvas">
        {[
          { eyebrow: "Market", title: "Market movers", items: ARTICLES.filter((a) => a.category === "Market") },
          { eyebrow: "Collecting", title: "The collector's desk", items: ARTICLES.filter((a) => a.category === "Collecting") },
          { eyebrow: "Strategy · Sets", title: "Play & preview", items: ARTICLES.filter((a) => a.category === "Strategy" || a.category === "Sets") },
        ].map((desk) => (
          <div key={desk.title}>
            <SectionHead eyebrow={desk.eyebrow} title={desk.title} />
            <div className="nv-desk">
              {desk.items.slice(0, 1).map((a) => <StandardCard key={a.title} a={a} />)}
              {desk.items.slice(1, 3).map((a) => <CompactCard key={a.title} a={a} />)}
            </div>
          </div>
        ))}
      </section>

      <style>{`
        .nv-page { padding-bottom: 96px; }
        .nv-vhead { display: flex; align-items: baseline; gap: 12px; margin: 48px 0 12px; flex-wrap: wrap; }
        .nv-vnum { font: var(--type-label); letter-spacing: var(--type-label-ls); text-transform: uppercase; color: var(--color-accent); font-weight: 700; }
        .nv-vname { font: 400 18px/1.3 var(--font-heading); }
        .nv-vnote { font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); }
        .nv-canvas { border: 1px solid var(--color-border); border-radius: var(--rounded-lg); background: var(--color-background); padding: var(--space-6); }
        .nv-grid3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-5); }
        .nv-grid4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-5); }
        .nv-split { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-5); align-items: stretch; }
        .nv-rail { display: grid; gap: var(--space-5); align-content: start; }
        .nv-rail .ccard-compact .cover { height: 90px; }
        .nv-rail .ccard-compact .body-block { padding-bottom: var(--space-6); }
        .nv-desk { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: var(--space-5); align-items: start; }
        @media (max-width: 900px) {
          .nv-split, .nv-desk { grid-template-columns: 1fr; }
        }

        /* content cards, ported verbatim from docs/design.html (source of truth) */
        .ccard { position: relative; background: var(--color-surface); border-radius: var(--rounded-lg); cursor: pointer; }
        .ccard .cover { position: relative; overflow: hidden; border-radius: var(--rounded-lg) var(--rounded-lg) 0 0; }
        .ccard .img { position: absolute; inset: 0; background: repeating-linear-gradient(100deg, rgba(245,244,242,.04) 0 2px, transparent 2px 9px), var(--gradient-haku); }
        .meta-onimg { position: absolute; top: var(--space-3); left: var(--space-3); z-index: 2; font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: #F5F4F2; background: rgba(26,18,14,.65); padding: 3px 10px; border-radius: var(--rounded-full); }
        .ccard-featured { width: 100%; height: 400px; }
        .ccard-featured.tall { height: 460px; }
        .ccard-featured .cover { position: absolute; inset: 0; border-radius: var(--rounded-lg); }
        .ccard-featured .scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,18,14,.18) 0%, rgba(26,18,14,.28) 30%, rgba(26,18,14,.55) 55%, rgba(26,18,14,.93) 100%); }
        .ccard-featured .float-chip { position: absolute; top: var(--space-4); left: var(--space-4); z-index: 2; background: var(--color-surface); }
        .ccard-featured .ov-content { position: absolute; left: 0; bottom: 0; z-index: 1; padding: var(--space-6); max-width: 64%; color: #F5F4F2; }
        .ccard-featured .ov-content .meta { font: var(--type-caption); letter-spacing: var(--type-caption-ls); opacity: .85; margin-bottom: var(--space-3); }
        .ccard-featured .ov-content .ttl { font: var(--type-h2); letter-spacing: var(--type-h2-ls); margin-bottom: var(--space-3); }
        .ccard-featured .ov-content .exc { font: var(--type-body-sm); opacity: .9; }
        .ccard-standard .cover { height: 170px; }
        .ccard-compact .cover { height: 140px; }
        .ccard .body-block { padding: var(--space-4) var(--space-4) var(--space-6); }
        .ccard .body-block .ttl { font: var(--type-h3); letter-spacing: var(--type-h3-ls); margin-bottom: var(--space-2); }
        .ccard .body-block .exc { font: var(--type-body-sm); color: var(--color-on-surface-muted); }
        .ccard-compact .body-block { padding-bottom: var(--space-7); }
        .notch { position: absolute; right: 0; bottom: 0; z-index: 3; display: flex; align-items: stretch; }
        .ncap { display: block; width: 44px; height: 46px; flex: none; }
        .ncap path { fill: var(--color-background); transition: fill .25s; }
        .nbody { position: relative; background: var(--color-background); padding: 6px 0 0 2px; transition: background .25s; }
        .nbody::before { content: ""; position: absolute; top: -12px; right: 0; width: 12px; height: 12px; background: radial-gradient(circle at 0 0, rgba(0,0,0,0) 12px, var(--color-background) 12px); }
        .caction { display: inline-flex; align-items: center; height: 40px; padding: 0 13px; background: transparent; border: 1px solid transparent; border-radius: var(--rounded-full); font: var(--type-body-sm); font-family: var(--font-body); color: var(--color-on-surface); cursor: pointer; transition: background .3s, border-color .3s; }
        .caction .txt { max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap; margin-right: 0; transition: max-width .35s ease, opacity .3s ease, margin .35s ease; }
        .caction .arr { font-size: 16px; line-height: 1; }
        .ccard:hover .caction { background: var(--color-surface-raised); border-color: var(--color-border-strong); }
        .ccard:hover .caction .txt { max-width: 110px; opacity: 1; margin-right: 6px; }
        @media (prefers-reduced-motion: reduce) {
          .caction, .caction .txt { transition: none; }
        }
      `}</style>
    </div>
  );
}
