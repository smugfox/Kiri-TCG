"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Search } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useConvexReady } from "@/app/providers";
import { RarityDot } from "@/components/ui/Badge";
import { money } from "@/lib/format";

type Result = {
  _id: string;
  name: string;
  setName: string;
  number?: string;
  rarity?: string;
  rarityTier: "common" | "uncommon" | "rare" | "epic" | "mythic" | "secret";
  slug: string;
  gameSlug: string;
  imageUrl?: string;
  headline: { price: number; change7d: number | null } | null;
};

/**
 * The 44px card-search combobox (design.md § Components). ARIA combobox with
 * a listbox popup: arrows move the highlight, Enter selects, Esc clears the
 * popup first and the query second. Zero results schedule a JustTCG backfill
 * and say so honestly.
 */
export default function CardSearch({
  autoFocus = false,
  onSelect,
  placeholder = "Search cards across every game",
  game,
}: {
  autoFocus?: boolean;
  /** Override navigation, e.g. the add-card drawer selects instead of routing. */
  onSelect?: (card: Result) => void;
  placeholder?: string;
  /** Scope results to one game (the browse page passes its game filter). */
  game?: Id<"games">;
}) {
  const ready = useConvexReady();
  const router = useRouter();
  const listId = useId();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const requested = useRef(new Set<string>());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 150);
    return () => clearTimeout(t);
  }, [q]);

  const results = useQuery(
    api.cards.search,
    ready && debounced.length >= 2
      ? { q: debounced, game, paginationOpts: { numItems: 8, cursor: null } }
      : "skip",
  );
  const requestBackfill = useMutation(api.cards.requestBackfill);
  const page = (results?.page ?? []) as Result[];
  const loading = debounced.length >= 2 && results === undefined;

  // Empty results for a real query: pull it from the market, once per query.
  useEffect(() => {
    if (!results || page.length > 0) return;
    if (debounced.length < 3 || requested.current.has(debounced)) return;
    requested.current.add(debounced);
    requestBackfill({ q: debounced })
      .then((r) =>
        setNotice(
          r.scheduled
            ? "Searching the market for this card; check back in a minute."
            : null,
        ),
      )
      .catch((err) => {
        const code =
          err instanceof ConvexError ? (err.data as { code?: string }).code : null;
        setNotice(
          code === "RATE_LIMITED"
            ? "You've reached this hour's limit for new-card lookups. Try again in a bit."
            : null,
        );
      });
  }, [results, page.length, debounced, requestBackfill]);

  useEffect(() => setNotice(null), [debounced]);
  useEffect(() => setHighlight(0), [debounced, page.length]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const select = (card: Result) => {
    setOpen(false);
    if (onSelect) onSelect(card);
    else router.push(`/cards/${card.gameSlug}/${card.slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, page.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && open && page[highlight]) {
      e.preventDefault();
      select(page[highlight]);
    } else if (e.key === "Escape") {
      if (open) setOpen(false);
      else setQ("");
    }
  };

  const showPanel = open && debounced.length >= 2;

  return (
    <div className="csearch" ref={rootRef}>
      <Search className="sicon" aria-hidden />
      <input
        className="inp"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showPanel && page[highlight] ? `${listId}-${highlight}` : undefined
        }
        placeholder={placeholder}
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {showPanel && (
        <div className="cs-results" role="listbox" id={listId}>
          {loading &&
            [0, 1, 2].map((i) => (
              <div className="cs-row" key={i} aria-hidden>
                <span className="skel" style={{ width: 34, height: 47, borderRadius: "var(--rounded-xs)" }} />
                <span style={{ flex: 1 }}>
                  <span className="skel" style={{ display: "block", height: 12, width: "60%", marginBottom: 8 }} />
                  <span className="skel" style={{ display: "block", height: 9, width: "38%" }} />
                </span>
              </div>
            ))}
          {!loading &&
            page.map((card, i) => (
              <div
                key={card._id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === highlight}
                className={`cs-row ${i === highlight ? "is-hover" : ""}`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(card)}
              >
                {card.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="cs-thumb" src={card.imageUrl} alt="" style={{ objectFit: "cover" }} />
                ) : (
                  <span className="cs-thumb" aria-hidden />
                )}
                <span>
                  <span className="cs-name" style={{ display: "block" }}>{card.name}</span>
                  <span className="cs-set">
                    {card.setName}
                    {card.number ? ` · ${card.number}` : ""}
                  </span>
                </span>
                <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 10 }}>
                  <RarityDot tier={card.rarityTier}>{card.rarity ?? card.rarityTier}</RarityDot>
                  {card.headline && <span className="cs-price">{money(card.headline.price)}</span>}
                </span>
              </div>
            ))}
          {!loading && page.length === 0 && (
            <div className="cs-note">
              {notice ?? "No cards found. Try another game"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
