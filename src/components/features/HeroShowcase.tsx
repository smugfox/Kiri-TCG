"use client";

import { useEffect, useState } from "react";

/**
 * Homepage hero visual: a static fan of three chase-card scans behind a
 * floating portfolio panel whose value counts up while the sparkline draws.
 * Card scans are self-hosted in public/cards (sources: Scryfall ltr/246,
 * Pokémon TCG API swsh7-215, TCGplayer product 522585).
 */
const FACES = [
  { src: "/cards/the-one-ring.jpg", name: "The One Ring, Magic: The Gathering", cls: "f1" },
  { src: "/cards/umbreon-vmax.png", name: "Umbreon VMAX alternate art, Pokémon Evolving Skies", cls: "f2" },
  { src: "/cards/philosophers-stone.jpg", name: "Philosopher's Stone, Sorcery: Contested Realm Alpha", cls: "f3" },
];

function useCountUp(target: number, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export default function HeroShowcase() {
  const value = useCountUp(2340.19);
  return (
    <div className="hero-visual">
      <div className="card-fan" aria-hidden>
        {FACES.map((f) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={f.cls} className={f.cls} src={f.src} alt="" loading="lazy" />
        ))}
      </div>
      <div className="pfpanel">
        <div className="plabel">Portfolio</div>
        <div className="pval">
          ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="pdelta2">▲ 1.8%</span>
        </div>
        <svg viewBox="0 0 170 50" className="spark" aria-hidden>
          <path
            d="M0,44 C14,40 22,42 34,36 C46,30 54,34 66,28 C78,24 86,30 98,22 C110,16 120,20 132,14 C146,8 158,12 170,6"
            pathLength={1}
            fill="none"
            stroke="var(--color-trend-up)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </svg>
        <div className="pfoot">
          Unrealized P&L · <b>+$730.19</b>
        </div>
      </div>
    </div>
  );
}
