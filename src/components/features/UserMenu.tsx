"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

/**
 * Avatar-triggered menu. Shows a generic avatar until the viewer query is
 * wired up (Phase 2, once convex/_generated exists on this machine).
 */
export default function UserMenu() {
  const { signOut } = useAuthActions();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button className="avt s40" aria-label="Account menu" aria-expanded={open} onClick={() => setOpen(!open)} style={{ border: "none", cursor: "pointer" }}>
        ⬖
      </button>
      {open && (
        <div className="umenu" role="menu" style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 200 }}>
          <div className="items">
            <Link role="menuitem" href="/portfolio" onClick={() => setOpen(false)}>My portfolio</Link>
            <Link role="menuitem" href="/alerts" onClick={() => setOpen(false)}>Price alerts</Link>
            <Link role="menuitem" href="/settings" onClick={() => setOpen(false)}>Settings</Link>
            <a role="menuitem" className="danger" style={{ cursor: "pointer" }} onClick={() => { setOpen(false); void signOut(); }}>Sign out</a>
          </div>
        </div>
      )}
    </span>
  );
}
