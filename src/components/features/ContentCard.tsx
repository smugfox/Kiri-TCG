import Link from "next/link";
import type { Article } from "@/lib/articles";

/** design.md § content cards: the notched card-featured / card-standard /
 * card-compact family. The whole card is the hit target; the notch's arrow
 * expands into Read More on hover (the only hover motion). */

function Notch() {
  return (
    <div className="notch" aria-hidden>
      <svg className="ncap" viewBox="0 0 44 46"><path d="M0 46 Q12 46 16 36 L26 14 C29 7 32 0 44 0 L44 46 Z" /></svg>
      <div className="nbody">
        <span className="caction"><span className="txt">Read More</span><span className="arr">→</span></span>
      </div>
    </div>
  );
}

function coverStyle(a: Article) {
  return a.cover ? { background: `center / cover no-repeat url(${a.cover}), var(--gradient-haku)` } : undefined;
}

export function FeaturedCard({ a }: { a: Article }) {
  return (
    <article className="ccard ccard-featured">
      <div className="cover"><div className="img" style={coverStyle(a)} /><div className="scrim" /></div>
      <span className="chip float-chip">Featured</span>
      <div className="ov-content">
        <div className="meta">{a.date} · {a.read}</div>
        <div className="ttl">{a.title}</div>
        <p className="exc">{a.standfirst}</p>
      </div>
      <Link className="ccard-link" href={`/news/${a.slug}`} aria-label={a.title} />
      <Notch />
    </article>
  );
}

export function StandardCard({ a }: { a: Article }) {
  return (
    <article className="ccard ccard-standard">
      <div className="cover"><div className="img" style={coverStyle(a)} /><span className="meta-onimg">{a.date} · {a.read}</span></div>
      <div className="body-block">
        <div className="ttl">{a.title}</div>
        <p className="exc">{a.standfirst}</p>
      </div>
      <Link className="ccard-link" href={`/news/${a.slug}`} aria-label={a.title} />
      <Notch />
    </article>
  );
}

export function CompactCard({ a }: { a: Article }) {
  return (
    <article className="ccard ccard-compact">
      <div className="cover"><div className="img" style={coverStyle(a)} /><span className="meta-onimg">{a.date} · {a.read}</span></div>
      <div className="body-block"><div className="ttl">{a.title}</div></div>
      <Link className="ccard-link" href={`/news/${a.slug}`} aria-label={a.title} />
      <Notch />
    </article>
  );
}
