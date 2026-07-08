"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export type KebabItem = {
  label: ReactNode;
  onClick: () => void;
  danger?: boolean;
};

/** Row-action kebab (⋮) with the compact floating menu; destructive items in error. */
export default function Kebab({ items, label = "Row actions" }: { items: KebabItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  // Fixed positioning so the menu escapes overflow-x scroll containers (tables).
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const toggle = () => {
    if (!open) {
      const rect = rootRef.current?.getBoundingClientRect();
      if (rect) {
        const MENU_WIDTH = 180;
        const MENU_HEIGHT = items.length * 36 + 12;
        const top =
          rect.bottom + MENU_HEIGHT > window.innerHeight
            ? Math.max(8, rect.top - MENU_HEIGHT)
            : rect.bottom + 4;
        setPos({ top, left: Math.max(8, rect.right - MENU_WIDTH) });
      }
    }
    setOpen((o) => !o);
  };

  return (
    <span ref={rootRef} style={{ position: "relative", display: "inline-block" }}>
      <button className="kebab" aria-label={label} aria-expanded={open} aria-haspopup="menu" onClick={toggle}>
        ⋮
      </button>
      {open && pos && (
        <div className="kmenu" role="menu" style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 30 }}>
          {items.map((item, i) => (
            <a
              key={i}
              role="menuitem"
              href="#"
              className={item.danger ? "danger" : ""}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </span>
  );
}
