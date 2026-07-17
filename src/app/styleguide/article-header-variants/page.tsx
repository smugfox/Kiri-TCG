/**
 * Dev scratch page: three article-header treatments for the news article
 * view (the current header read small and empty). Same One Ring story in
 * all three. Not linked from navigation.
 */

const A = {
  category: "News · Market",
  title: "The One Ring Keeps Climbing: What Its Third Rally Tells Us",
  standfirst: "Three spikes in twelve months is not hype, it is a supply story. We chart every reprint rumor against the price line.",
  date: "Jul 14, 2026",
  read: "12 min read",
  author: "Robin Fox",
  role: "Market Desk",
  cover: "/cards/the-one-ring.jpg",
};

function Author({ light = false }: { light?: boolean }) {
  return (
    <div className={`ah-author ${light ? "light" : ""}`}>
      <div className="av">RF</div>
      <div><div className="nm">{A.author}</div><div className="rl">{A.role} · {A.date} · {A.read}</div></div>
    </div>
  );
}

function VariantLabel({ n, name, note }: { n: string; name: string; note: string }) {
  return (
    <div className="ah-vhead">
      <span className="ah-vnum">Variant {n}</span>
      <span className="ah-vname">{name}</span>
      <span className="ah-vnote">{note}</span>
    </div>
  );
}

export default function ArticleHeaderVariants() {
  return (
    <div className="page ah-page">
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginTop: 32 }}>Article header variants</h1>
      <p style={{ font: "var(--type-body-sm)", color: "var(--color-on-surface-muted)", margin: "8px 0 40px", maxWidth: "62ch" }}>
        Three treatments for the article opening. The prose, sidebar, and tail below the header stay as reviewed.
      </p>

      <VariantLabel n="01" name="Immersive cover" note="the featured-card treatment at page scale: title and byline live on the art over the Urushi scrim" />
      <section className="ah-canvas">
        <header className="ah-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(26,18,14,.25) 0%, rgba(26,18,14,.35) 40%, rgba(26,18,14,.94) 100%), url(${A.cover})` }}>
          <span className="chip ah-chip">{A.category}</span>
          <div className="ah-hero-content">
            <h2 className="ah-display light">{A.title}</h2>
            <p className="ah-stand light">{A.standfirst}</p>
            <Author light />
          </div>
        </header>
      </section>

      <VariantLabel n="02" name="Centered masthead" note="magazine opening: everything centered at display scale, standfirst included, cover follows" />
      <section className="ah-canvas">
        <header className="ah-center">
          <div className="eyebrow" style={{ color: "var(--color-accent)" }}>{A.category}</div>
          <h2 className="ah-display" style={{ margin: "0 auto var(--space-4)" }}>{A.title}</h2>
          <p className="ah-stand" style={{ margin: "0 auto var(--space-5)" }}>{A.standfirst}</p>
          <div style={{ display: "flex", justifyContent: "center" }}><Author /></div>
        </header>
        <div className="ah-coverimg" style={{ background: `center 30% / cover no-repeat url(${A.cover})` }} />
      </section>

      <VariantLabel n="03" name="Split opener" note="title block beside a tall cover crop; no dead right half, the art shares the fold" />
      <section className="ah-canvas">
        <header className="ah-split">
          <div className="ah-split-copy">
            <div className="eyebrow" style={{ color: "var(--color-accent)" }}>{A.category}</div>
            <h2 className="ah-display" style={{ fontSize: "clamp(34px, 3.6vw, 52px)" }}>{A.title}</h2>
            <p className="ah-stand">{A.standfirst}</p>
            <Author />
          </div>
          <div className="ah-split-cover" style={{ background: `center 25% / cover no-repeat url(${A.cover})` }} />
        </header>
      </section>

      <style>{`
        .ah-page { padding-bottom: 96px; }
        .ah-vhead { display: flex; align-items: baseline; gap: 12px; margin: 48px 0 12px; flex-wrap: wrap; }
        .ah-vnum { font: var(--type-label); letter-spacing: var(--type-label-ls); text-transform: uppercase; color: var(--color-accent); font-weight: 700; }
        .ah-vname { font: 400 18px/1.3 var(--font-heading); }
        .ah-vnote { font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); }
        .ah-canvas { border: 1px solid var(--color-border); border-radius: var(--rounded-lg); background: var(--color-background); overflow: hidden; }

        .ah-display { font: 400 clamp(38px, 4.4vw, 60px)/1.15 var(--font-heading); letter-spacing: -0.025em; max-width: 18ch; margin-bottom: var(--space-4); }
        .ah-display.light { color: #F5F4F2; }
        .ah-stand { font: var(--type-body-lg); color: var(--color-on-surface-muted); max-width: 52ch; margin-bottom: var(--space-5); }
        .ah-stand.light { color: rgba(234,231,226,.85); }
        .ah-author { display: flex; gap: var(--space-3); align-items: center; }
        .ah-author .av { width: 48px; height: 48px; border-radius: var(--rounded-full); background: var(--gradient-haku); color: #F5F4F2; display: flex; align-items: center; justify-content: center; font: var(--type-body-sm); flex: none; border: 1px solid var(--color-border-strong); }
        .ah-author .nm { font: var(--type-body-sm); font-weight: 500; }
        .ah-author .rl { font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); }
        .ah-author.light .nm { color: #F5F4F2; }
        .ah-author.light .rl { color: rgba(234,231,226,.75); }

        /* 01 · immersive */
        .ah-hero { position: relative; min-height: 520px; background-size: cover; background-position: center 25%; display: flex; flex-direction: column; justify-content: flex-end; padding: var(--space-7); }
        .ah-chip { position: absolute; top: var(--space-5); left: var(--space-7); background: var(--color-surface); }
        .ah-hero-content { max-width: 720px; }

        /* 02 · centered */
        .ah-center { text-align: center; padding: var(--space-8) var(--space-6) var(--space-7); }
        .ah-center .eyebrow { font: var(--type-label); letter-spacing: var(--type-label-ls); text-transform: uppercase; margin-bottom: var(--space-4); }
        .ah-center .ah-display { max-width: 20ch; }
        .ah-coverimg { height: 420px; margin: 0 var(--space-6) var(--space-6); border-radius: var(--rounded-md); border: 1px solid var(--color-border-strong); }

        /* 03 · split */
        .ah-split { display: grid; grid-template-columns: 1.1fr 1fr; min-height: 460px; }
        .ah-split-copy { padding: var(--space-8) var(--space-7); display: flex; flex-direction: column; justify-content: center; }
        .ah-split-copy .eyebrow { font: var(--type-label); letter-spacing: var(--type-label-ls); text-transform: uppercase; margin-bottom: var(--space-4); }
        .ah-split-cover { min-height: 100%; }
        @media (max-width: 900px) {
          .ah-split { grid-template-columns: 1fr; }
          .ah-split-cover { height: 260px; }
          .ah-hero { min-height: 440px; padding: var(--space-5); }
          .ah-chip { left: var(--space-5); }
        }
      `}</style>
    </div>
  );
}
