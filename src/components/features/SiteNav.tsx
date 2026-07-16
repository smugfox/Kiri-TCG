"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useConvexAuth } from "convex/react";
import { Search } from "lucide-react";
import { useConvexReady } from "@/app/providers";
import { useFocusTrap } from "@/lib/useFocusTrap";
import UserMenu from "./UserMenu";
import NotificationsPanel from "./NotificationsPanel";
import CardSearch from "./CardSearch";
import BrandLockup from "./BrandLockup";

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
  return (
    <>
      <NotificationsPanel />
      <UserMenu />
    </>
  );
}

/** Command-style search overlay, opened from the nav well or ⌘K. */
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true, onClose);
  return (
    <div className="search-overlay" onClick={onClose}>
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search cards"
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <CardSearch
          autoFocus
          placeholder="Search any card"
          onSelect={(card) => {
            onClose();
            router.push(`/cards/${card.gameSlug}/${card.slug}`);
          }}
        />
      </div>
    </div>
  );
}

export default function SiteNav() {
  const ready = useConvexReady();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K / Ctrl+K opens the search overlay from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = LINKS.map((l) => (
    <Link key={l.href} href={l.href} className={pathname.startsWith(l.href) ? "navlink-active" : ""}>
      {l.label}
    </Link>
  ));

  return (
    <>
      <nav className="nav-demo site-nav" aria-label="Main">
        <Link href="/" className="brand" style={{ textDecoration: "none" }} aria-label="Kiri home"><BrandLockup /></Link>
        <span className="nav-links">{links}</span>
        <span className="nav-search">
          <button onClick={() => setSearchOpen(true)} aria-label="Search any card (Command K)">
            <Search size={14} aria-hidden />
            Search any card
            <span className="kbd" aria-hidden>⌘K</span>
          </button>
        </span>
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
            <span className="brand"><BrandLockup /></span>
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
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
