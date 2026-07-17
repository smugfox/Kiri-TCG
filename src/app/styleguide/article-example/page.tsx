/**
 * Dev scratch page: what a Kiri news article looks like when opened from the
 * hub. Assembled 1:1 from the design system's editorial kit (prose, blockquote,
 * figure, author, side-list, cta-card) plus a compact-card tail. Markup mirrors
 * docs/design.html § Editorial. Not linked from navigation.
 */
import Link from "next/link";

const RELATED = [
  { title: "Moonbreon at $1,300: Anatomy of the Modern Grail", date: "Jul 11, 2026", read: "9 min read", cover: "/cards/umbreon-vmax.png" },
  { title: "Sorcery's Alpha Foils Are Quietly Outperforming Everything", date: "Jul 8, 2026", read: "11 min read", cover: "/cards/philosophers-stone.jpg" },
  { title: "Why Nightly Prices Beat Live Tickers for Collectors", date: "Jun 20, 2026", read: "8 min read" },
];

export default function ArticleExample() {
  return (
    <div className="page ax-page">
      <div className="ax-note">Article view example · opened from the news hub · mirrors docs/design.html § Editorial</div>

      <article className="ax-article">
        <header className="ax-head">
          <div className="eyebrow">News · Market</div>
          <h1 className="ax-title">The One Ring Keeps Climbing: What Its Third Rally Tells Us</h1>
          <div className="ax-meta">Jul 14, 2026 · 12 min read</div>
          <div className="author">
            <div className="av">RF</div>
            <div><div className="nm">Robin Fox</div><div className="rl">Market Desk</div></div>
          </div>
        </header>

        <figure className="ax-cover">
          <div className="ax-coverimg" style={{ background: "center 30% / cover no-repeat url(/cards/the-one-ring.jpg), var(--gradient-haku)" }} />
          <figcaption>The One Ring, Tales of Middle-earth borderless printing. Art courtesy of Scryfall.</figcaption>
        </figure>

        <div className="ax-split">
          <div className="prose">
            <p>
              Three spikes in twelve months is not hype, it is a supply story. When The One Ring
              first cleared $60 in early 2025, the market called it a fluke of movie-adjacent
              sentiment. The second rally looked like buyout mechanics. This third one is different:
              slower, broader, and stubbornly resistant to profit-taking.
            </p>
            <p>
              The pattern matches what we saw with reserved-list staples in 2020, but compressed.
              Singles supply concentrates into fewer hands each cycle, and every reprint rumor that
              fails to materialize ratchets the floor upward.
            </p>
            <blockquote>
              “Everyone is waiting for the reprint that makes this affordable. The market has
              started pricing in the possibility that it never comes.”
              <footer>Amara Diallo, buylist manager, quoted with permission</footer>
            </blockquote>
            <div className="h">What the price line actually shows</div>
            <p>
              Chart the three rallies against announcement windows and a pattern emerges: each
              spike begins roughly two weeks after a set reveal that could have contained the
              reprint and did not. The market is not reacting to demand. It is reacting to the
              absence of supply news.
            </p>
            <p>
              For collectors tracking a copy in Kiri, the practical takeaway is the alert
              threshold. Set it above the previous rally&apos;s peak, not below: this card&apos;s
              floor has moved up three times, and the exits that mattered were on the way up.
            </p>
            <div className="h">The collector&apos;s position</div>
            <p>
              If you hold one, nothing here says sell. If you want one, the uncomfortable truth is
              that the three best buying windows of the last year were all quiet weeks after failed
              reprint rumors, and patience beat timing every time.
            </p>
          </div>
          <aside className="side">
            <div className="author">
              <div className="av">RF</div>
              <div><div className="nm">Robin Fox</div><div className="rl">Market Desk</div></div>
            </div>
            <div className="side-list">
              <div className="slbl">Related articles</div>
              {RELATED.map((r) => <a key={r.title} href="#">{r.title}</a>)}
            </div>
            <div className="cta-card">
              <div className="t">Tracking a copy of this card?</div>
              <div className="d">Kiri charts its nightly price and alerts you when it crosses your threshold.</div>
              <Link href="/signin" className="btn btn-primary sm" style={{ textDecoration: "none" }}>Explore the demo</Link>
            </div>
          </aside>
        </div>
      </article>

      <div className="ax-tail">
        <div className="sechead" style={{ margin: "var(--space-7) 0 var(--space-5)" }}>
          <div>
            <div className="eyebrow">More from the Market desk</div>
            <div style={{ font: "var(--type-h3)", letterSpacing: "var(--type-h3-ls)" }}>Keep reading</div>
          </div>
          <Link className="btn btn-secondary sm" href="/styleguide/news-variants" style={{ textDecoration: "none" }}>Back to the hub</Link>
        </div>
        <div className="ax-grid3">
          {RELATED.map((a) => (
            <article className="ccard ccard-compact" key={a.title}>
              <div className="cover">
                <div className="img" style={a.cover ? { background: `center / cover no-repeat url(${a.cover}), var(--gradient-haku)` } : undefined} />
                <span className="meta-onimg">{a.date} · {a.read}</span>
              </div>
              <div className="body-block"><div className="ttl">{a.title}</div></div>
              <div className="notch">
                <svg className="ncap" viewBox="0 0 44 46" aria-hidden="true"><path d="M0 46 Q12 46 16 36 L26 14 C29 7 32 0 44 0 L44 46 Z" /></svg>
                <div className="nbody"><button className="caction"><span className="txt">Read More</span><span className="arr">→</span></button></div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .ax-page { max-width: 1080px; margin: 0 auto; padding-bottom: 96px; }
        .ax-note { font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); margin: 24px 0 32px; }
        .ax-head { max-width: 720px; }
        .ax-head .eyebrow { font: var(--type-label); letter-spacing: var(--type-label-ls); text-transform: uppercase; color: var(--color-accent); margin-bottom: var(--space-3); }
        .ax-title { font: 400 clamp(32px, 4vw, 48px)/1.22 var(--font-heading); letter-spacing: -0.025em; margin-bottom: var(--space-3); }
        .ax-meta { font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); margin-bottom: var(--space-4); }
        .ax-head .author { margin-bottom: var(--space-6); }
        .ax-cover { margin: 0 0 var(--space-7); }
        .ax-coverimg { height: 380px; border-radius: var(--rounded-md); border: 1px solid var(--color-border-strong); }
        .ax-cover figcaption { font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); text-align: center; margin-top: 8px; }
        .ax-split { display: flex; gap: var(--space-8); align-items: flex-start; flex-wrap: wrap; }
        .ax-grid3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-5); }

        /* editorial kit, ported verbatim from docs/design.html */
        .prose { flex: 1 1 420px; max-width: 65ch; }
        .prose .h { font: var(--type-h3); letter-spacing: var(--type-h3-ls); margin: var(--space-5) 0 var(--space-3); }
        .prose p { font: var(--type-body); margin-bottom: var(--space-4); }
        .prose blockquote { border-left: 3px solid var(--color-accent); padding: 4px 0 4px 20px; margin: var(--space-5) 0; font: 400 22px/1.4 var(--font-heading); letter-spacing: -0.015em; }
        .prose blockquote footer { font: var(--type-caption); letter-spacing: var(--type-caption-ls); font-family: var(--font-body); color: var(--color-on-surface-muted); margin-top: 8px; }
        .side { width: 280px; flex: none; display: flex; flex-direction: column; gap: var(--space-6); }
        .author { display: flex; gap: var(--space-3); align-items: center; }
        .author .av { width: 48px; height: 48px; border-radius: var(--rounded-full); background: var(--gradient-haku); color: #F5F4F2; display: flex; align-items: center; justify-content: center; font: var(--type-body-sm); flex: none; }
        .author .nm { font: var(--type-body-sm); font-weight: 500; }
        .author .rl { font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); }
        .side-list .slbl { font: var(--type-label); letter-spacing: var(--type-label-ls); text-transform: uppercase; color: var(--color-on-surface-muted); padding-bottom: var(--space-2); border-bottom: 1px solid var(--color-border-strong); margin-bottom: var(--space-2); }
        .side-list a { display: block; font: var(--type-body-sm); color: var(--color-on-surface-muted); text-decoration: none; padding: var(--space-2) 0; transition: color .15s; }
        .side-list a:hover { color: var(--color-on-surface); }
        .cta-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--rounded-lg); padding: var(--space-5); }
        .cta-card .t { font: var(--type-body); font-weight: 500; margin-bottom: var(--space-2); }
        .cta-card .d { font: var(--type-body-sm); color: var(--color-on-surface-muted); margin-bottom: var(--space-4); }

        /* content-card pieces for the tail (as in the hub variants) */
        .ccard { position: relative; background: var(--color-surface); border-radius: var(--rounded-lg); cursor: pointer; }
        .ccard .cover { position: relative; overflow: hidden; border-radius: var(--rounded-lg) var(--rounded-lg) 0 0; height: 140px; }
        .ccard .img { position: absolute; inset: 0; background: repeating-linear-gradient(100deg, rgba(245,244,242,.04) 0 2px, transparent 2px 9px), var(--gradient-haku); }
        .meta-onimg { position: absolute; top: var(--space-3); left: var(--space-3); z-index: 2; font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: #F5F4F2; background: rgba(26,18,14,.65); padding: 3px 10px; border-radius: var(--rounded-full); }
        .ccard .body-block { padding: var(--space-4) var(--space-4) var(--space-7); }
        .ccard .body-block .ttl { font: var(--type-h3); letter-spacing: var(--type-h3-ls); font-size: 20px; }
        .notch { position: absolute; right: 0; bottom: 0; z-index: 3; display: flex; align-items: stretch; }
        .ncap { display: block; width: 44px; height: 46px; flex: none; }
        .ncap path { fill: var(--color-background); }
        .nbody { position: relative; background: var(--color-background); padding: 6px 0 0 2px; }
        .nbody::before { content: ""; position: absolute; top: -12px; right: 0; width: 12px; height: 12px; background: radial-gradient(circle at 0 0, rgba(0,0,0,0) 12px, var(--color-background) 12px); }
        .caction { display: inline-flex; align-items: center; height: 40px; padding: 0 13px; background: transparent; border: 1px solid transparent; border-radius: var(--rounded-full); font: var(--type-body-sm); font-family: var(--font-body); color: var(--color-on-surface); cursor: pointer; transition: background .3s, border-color .3s; }
        .caction .txt { max-width: 0; opacity: 0; overflow: hidden; white-space: nowrap; margin-right: 0; transition: max-width .35s ease, opacity .3s ease, margin .35s ease; }
        .caction .arr { font-size: 16px; line-height: 1; }
        .ccard:hover .caction { background: var(--color-surface-raised); border-color: var(--color-border-strong); }
        .ccard:hover .caction .txt { max-width: 110px; opacity: 1; margin-right: 6px; }
        @media (max-width: 900px) { .side { width: 100%; } .ax-coverimg { height: 240px; } }
        @media (prefers-reduced-motion: reduce) { .caction, .caction .txt { transition: none; } }
      `}</style>
    </div>
  );
}
