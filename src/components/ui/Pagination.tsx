"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Designed pager: 32px rounded-xs squares, Urushi fill on the active page,
 * chevron prev/next (design.md § Components). Nav landmark with
 * aria-current on the active page.
 */
export default function Pagination({
  page,
  pageCount,
  hasMore = false,
  onPage,
}: {
  page: number; // 1-based
  pageCount: number;
  /** More pages exist beyond pageCount (cursor not exhausted). */
  hasMore?: boolean;
  onPage: (page: number) => void;
}) {
  if (pageCount <= 1 && !hasMore) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav className="pager" aria-label="Pagination">
      <a
        href="#"
        aria-label="Previous page"
        aria-disabled={page === 1}
        style={page === 1 ? { color: "var(--color-on-surface-muted)", cursor: "not-allowed", pointerEvents: "none" } : undefined}
        onClick={(e) => {
          e.preventDefault();
          onPage(page - 1);
        }}
      >
        <ChevronLeft size={14} />
      </a>
      {pages.map((n) => (
        <a
          key={n}
          href="#"
          className={n === page ? "active" : ""}
          aria-current={n === page ? "page" : undefined}
          onClick={(e) => {
            e.preventDefault();
            onPage(n);
          }}
        >
          {n}
        </a>
      ))}
      {hasMore && <span className="gap">…</span>}
      <a
        href="#"
        aria-label="Next page"
        aria-disabled={page === pageCount && !hasMore}
        style={page === pageCount && !hasMore ? { color: "var(--color-on-surface-muted)", cursor: "not-allowed", pointerEvents: "none" } : undefined}
        onClick={(e) => {
          e.preventDefault();
          onPage(page + 1);
        }}
      >
        <ChevronRight size={14} />
      </a>
    </nav>
  );
}
