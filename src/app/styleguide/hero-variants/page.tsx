"use client";

/**
 * Dev scratch page: three homepage hero directions for side-by-side review.
 * Throwaway exploration, self-contained on purpose; whichever direction wins
 * gets promoted into src/app/page.tsx properly. Not linked from navigation.
 */
import Link from "next/link";
import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

const money = (v: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Sparkline({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 170 50" className="hv-spark" aria-hidden>
      <path
        d="M0,44 C14,40 22,42 34,36 C46,30 54,34 66,28 C78,24 86,30 98,22 C110,16 120,20 132,14 C146,8 158,12 170,6"
        pathLength={1}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function PortfolioPanel({ dark = false }: { dark?: boolean }) {
  const v = useCountUp(2340.19);
  return (
    <div className={`hv-panel ${dark ? "dark" : ""}`}>
      <div className="hv-plabel">Portfolio</div>
      <div className="hv-pval tnum">
        ${money(v)}
        <span className="hv-delta">▲ 1.8%</span>
      </div>
      <Sparkline stroke={dark ? "var(--color-haku-pale)" : "var(--color-trend-up)"} />
      <div className="hv-pfoot tnum">Unrealized P&L · <b>+$730.19</b></div>
    </div>
  );
}

function CardFan({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`hv-fan ${dark ? "dark" : ""}`} aria-hidden>
      <div className="hv-card c1"><span className="hv-gem" /></div>
      <div className="hv-card c2"><span className="hv-gem" /></div>
      <div className="hv-card c3"><span className="hv-gem" /></div>
    </div>
  );
}

const TICKS = [
  ["Lightning Bolt", "$52.40", "+4.8%", true],
  ["Charizard VMAX", "$88.10", "-1.2%", false],
  ["Blue-Eyes White Dragon", "$34.75", "+2.3%", true],
  ["Sol Ring", "$18.02", "+1.1%", true],
  ["Pikachu ex", "$21.60", "-0.4%", false],
  ["Dark Magician", "$12.95", "+0.9%", true],
  ["Black Lotus", "$11,240.00", "+0.6%", true],
  ["Grim Reaper", "$7.85", "+3.2%", true],
] as const;

function Ticker() {
  const row = (key: string) => (
    <div className="hv-tickrow" key={key} aria-hidden={key === "b"}>
      {TICKS.map(([name, price, delta, up]) => (
        <span className="hv-tick tnum" key={`${key}-${name}`}>
          <b>{name}</b> {price} <i className={up ? "up" : "down"}>{delta}</i>
        </span>
      ))}
    </div>
  );
  return <div className="hv-ticker">{row("a")}{row("b")}</div>;
}

function HeroCopy({ dark = false }: { dark?: boolean }) {
  return (
    <div className="hv-copy">
      <span className={`chip ${dark ? "hv-chip-dark" : ""}`}>The stock app for your card collection</span>
      <h1 className="hv-title">
        Know what your collection is <em>worth.</em>
      </h1>
      <p className="hv-sub">
        Track prices across Magic, Pokémon, Yu-Gi-Oh, and Sorcery. Add cards in seconds,
        follow every swing, and trade with confidence.
      </p>
      <div className="hv-cta">
        {dark ? (
          <>
            <Link href="/signin" className="btn btn-inverted">Start tracking free</Link>
            <Link href="/cards" className="hv-ghost-dark">Browse card prices</Link>
          </>
        ) : (
          <>
            <Link href="/signin" className="btn btn-primary">Start tracking free</Link>
            <Link href="/cards" className="btn btn-secondary">Browse card prices</Link>
          </>
        )}
      </div>
      <div className={`hv-fresh ${dark ? "dark" : ""}`}>
        <span className="hv-dot" /> 23,412 prices refreshed last night
      </div>
    </div>
  );
}

function VariantLabel({ n, name, note }: { n: string; name: string; note: string }) {
  return (
    <div className="hv-vhead">
      <span className="hv-vnum">Variant {n}</span>
      <span className="hv-vname">{name}</span>
      <span className="hv-vnote">{note}</span>
    </div>
  );
}

export default function HeroVariants() {
  return (
    <div className="page hv-page">
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginTop: 32 }}>Homepage hero variants</h1>
      <p style={{ font: "var(--type-body-sm)", color: "var(--color-on-surface-muted)", margin: "8px 0 40px", maxWidth: "62ch" }}>
        Three directions for bringing the homepage to life. All use existing tokens and the
        150/300/600ms motion tiers; count-up and line draw respect reduced motion. Reload to replay.
      </p>

      <VariantLabel n="01" name="The collection on the table" note="light hero, portfolio panel and card fan fill the empty half" />
      <section className="hv-canvas">
        <div className="hv-hero">
          <HeroCopy />
          <div className="hv-visual">
            <CardFan />
            <PortfolioPanel />
          </div>
        </div>
      </section>

      <VariantLabel n="02" name="Urushi anchor" note="the brand's dark lacquer and bronze arrive above the fold" />
      <section className="hv-canvas">
        <div className="hv-dark-band">
          <div className="hv-hero">
            <HeroCopy dark />
            <div className="hv-visual">
              <CardFan dark />
              <PortfolioPanel dark />
            </div>
          </div>
        </div>
      </section>

      <VariantLabel n="03" name="Ticker tape" note="light hero plus a live market strip, leaning into the stock-app voice" />
      <section className="hv-canvas">
        <div className="hv-hero">
          <HeroCopy />
          <div className="hv-visual">
            <CardFan />
            <PortfolioPanel />
          </div>
        </div>
        <Ticker />
      </section>

      <style>{`
        .hv-page { padding-bottom: 96px; }
        .hv-vhead { display: flex; align-items: baseline; gap: 12px; margin: 48px 0 12px; flex-wrap: wrap; }
        .hv-vnum { font: var(--type-label); letter-spacing: var(--type-label-ls); text-transform: uppercase; color: var(--color-accent); font-weight: 700; }
        .hv-vname { font: 400 18px/1.3 var(--font-heading); }
        .hv-vnote { font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); }
        .hv-canvas { border: 1px solid var(--color-border); border-radius: var(--rounded-lg); background: var(--color-background); overflow: hidden; }

        .hv-hero { display: flex; gap: var(--space-7); align-items: center; padding: var(--space-8) var(--space-7); flex-wrap: wrap; }
        .hv-copy { flex: 1 1 380px; max-width: 560px; }
        .hv-title { font: 400 clamp(34px, 4vw, 52px)/1.2 var(--font-heading); letter-spacing: -0.025em; margin: 16px 0 0; max-width: 18ch; }
        .hv-title em { font-style: italic; }
        .hv-sub { font: var(--type-body-lg); color: var(--color-on-surface-muted); max-width: 48ch; margin: 16px 0 24px; }
        .hv-cta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .hv-fresh { display: flex; align-items: center; gap: 8px; font: var(--type-caption); letter-spacing: var(--type-caption-ls); color: var(--color-on-surface-muted); margin-top: 24px; }
        .hv-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-success); animation: hv-pulse 2.4s ease-out infinite; }
        @keyframes hv-pulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-success) 45%, transparent); } 70% { box-shadow: 0 0 0 7px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }

        .hv-visual { flex: 1 1 340px; position: relative; min-height: 330px; display: flex; align-items: center; justify-content: center; }
        .hv-fan { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .hv-card { position: absolute; width: 128px; height: 179px; border-radius: var(--rounded-sm); background: var(--gradient-haku); border: 1px solid rgba(50,32,20,.25); box-shadow: 0 10px 24px rgba(50,32,20,.22); display: flex; align-items: center; justify-content: center; transition: transform .3s ease-out; }
        .hv-card .hv-gem { width: 22px; height: 22px; background: rgba(50,32,20,.45); transform: rotate(45deg); border-radius: 3px; }
        .hv-card.c1 { transform: translateX(-96px) rotate(-9deg); }
        .hv-card.c2 { transform: translateY(-14px) rotate(-1deg); }
        .hv-card.c3 { transform: translateX(96px) rotate(8deg); }
        .hv-visual:hover .hv-card.c1 { transform: translateX(-112px) rotate(-12deg); }
        .hv-visual:hover .hv-card.c2 { transform: translateY(-22px) rotate(-1deg); }
        .hv-visual:hover .hv-card.c3 { transform: translateX(112px) rotate(11deg); }

        .hv-panel { position: relative; background: var(--color-surface-raised); border: 1px solid var(--color-border-strong); border-radius: var(--rounded-md); box-shadow: var(--shadow-float); padding: 20px 24px; width: 260px; transform: translateY(84px); }
        .hv-plabel { font: var(--type-label); letter-spacing: var(--type-label-ls); text-transform: uppercase; color: var(--color-on-surface-muted); margin-bottom: 6px; }
        .hv-pval { font: 400 30px/1.2 var(--font-heading); letter-spacing: -0.015em; display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; }
        .hv-delta { font: 600 12px/1 var(--font-body); color: var(--color-trend-up); background: color-mix(in srgb, var(--color-trend-up) 12%, var(--color-surface)); border-radius: var(--rounded-xs); padding: 4px 6px; }
        .hv-spark { width: 100%; height: 44px; display: block; }
        .hv-spark path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: hv-draw .6s ease-out .25s forwards; }
        @keyframes hv-draw { to { stroke-dashoffset: 0; } }
        .hv-pfoot { font: var(--type-body-sm); color: var(--color-on-surface-muted); margin-top: 8px; }
        .hv-pfoot b { color: var(--color-trend-up); font-weight: 600; }

        /* variant 02: dark band */
        .hv-dark-band { background-color: var(--color-brand-950); background-image: radial-gradient(rgba(245,244,242,.05) 1px, transparent 1.5px); background-size: 22px 22px; }
        .hv-dark-band .hv-title { color: #F5F4F2; }
        .hv-dark-band .hv-title em { color: var(--color-haku-pale); }
        .hv-dark-band .hv-sub { color: rgba(234,231,226,.72); }
        .chip.hv-chip-dark { background: transparent; border-color: rgba(197,166,129,.4); color: #EAE7E2; }
        .hv-ghost-dark { font: var(--type-body); color: var(--color-haku-pale); text-decoration: none; padding: 10px 12px; }
        .hv-ghost-dark:hover { color: #EAE7E2; }
        .hv-fresh.dark { color: rgba(234,231,226,.6); }
        .hv-panel.dark { background: #342115; border-color: rgba(197,166,129,.3); }
        .hv-panel.dark .hv-pval { color: #F5F4F2; }
        .hv-panel.dark .hv-plabel, .hv-panel.dark .hv-pfoot { color: rgba(234,231,226,.6); }
        .hv-panel.dark .hv-delta { color: #A3BD90; background: rgba(163,189,144,.14); }
        .hv-panel.dark .hv-pfoot b { color: #A3BD90; }
        .hv-fan.dark .hv-card { border-color: rgba(197,166,129,.45); box-shadow: 0 12px 28px rgba(0,0,0,.5); }

        /* variant 03: ticker */
        .hv-ticker { display: flex; overflow: hidden; background: var(--color-brand-950); border-top: 1px solid var(--color-border-strong); padding: 10px 0; }
        .hv-ticker:hover .hv-tickrow { animation-play-state: paused; }
        .hv-tickrow { display: flex; flex: none; align-items: center; animation: hv-scroll 36s linear infinite; }
        .hv-tick { font: var(--type-body-sm); color: rgba(234,231,226,.75); padding: 0 28px; white-space: nowrap; }
        .hv-tick b { color: #EAE7E2; font-weight: 500; }
        .hv-tick i { font-style: normal; font-weight: 600; }
        .hv-tick i.up { color: #A3BD90; }
        .hv-tick i.down { color: #E09A8C; }
        @keyframes hv-scroll { from { transform: translateX(0); } to { transform: translateX(-100%); } }

        @media (prefers-reduced-motion: reduce) {
          .hv-spark path { animation: none; stroke-dashoffset: 0; }
          .hv-tickrow { animation: none; }
          .hv-dot { animation: none; }
          .hv-card { transition: none; }
        }
        @media (max-width: 900px) {
          .hv-visual { min-height: 300px; }
          .hv-panel { transform: translateY(64px); }
        }
      `}</style>
    </div>
  );
}
