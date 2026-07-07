"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { useConvexReady } from "@/app/providers";
import UserMenu from "./UserMenu";

const LINKS = [
  { href: "/cards", label: "Cards" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/pricing", label: "Pricing" },
];

function AuthedActions() {
  const { isAuthenticated } = useConvexAuth();
  if (!isAuthenticated) {
    return (
      <>
        <Link href="/signin">Login</Link>
        <Link href="/signin" className="btn btn-primary" style={{ textDecoration: "none" }}>Sign up</Link>
      </>
    );
  }
  return <UserMenu />;
}

export default function SiteNav() {
  const ready = useConvexReady();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const links = LINKS.map((l) => (
    <Link key={l.href} href={l.href} className={pathname.startsWith(l.href) ? "navlink-active" : ""}>
      {l.label}
    </Link>
  ));

  return (
    <>
      <nav className="nav-demo site-nav" aria-label="Main">
        <Link href="/" className="brand" style={{ textDecoration: "none" }}>⬖ Kiri</Link>
        <span className="nav-links">{links}</span>
        <span className="spacer" />
        <span className="nav-actions">
          {ready ? <AuthedActions /> : (
            <>
              <Link href="/signin">Login</Link>
              <Link href="/signin" className="btn btn-primary" style={{ textDecoration: "none" }}>Sign up</Link>
            </>
          )}
        </span>
        <button className="burger" aria-label="Open menu" aria-expanded={sheetOpen} onClick={() => setSheetOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>
      {sheetOpen && (
        <div className="mobile-sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mnav">
            <span className="brand">⬖ Kiri</span>
            <button className="mclose" aria-label="Close menu" onClick={() => setSheetOpen(false)}>✕</button>
          </div>
          <div className="msheet">
            {LINKS.map((l) => (
              <Link key={l.href} className="mlink" href={l.href} onClick={() => setSheetOpen(false)}>{l.label}</Link>
            ))}
            <div className="mfoot">
              <Link href="/signin" className="btn btn-secondary" style={{ textDecoration: "none", flex: 1, justifyContent: "center" }} onClick={() => setSheetOpen(false)}>Login</Link>
              <Link href="/signin" className="btn btn-primary" style={{ textDecoration: "none", flex: 1, justifyContent: "center" }} onClick={() => setSheetOpen(false)}>Sign up</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
