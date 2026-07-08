"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { SlidersHorizontal } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useConvexReady } from "@/app/providers";
import CardSearch from "@/components/features/CardSearch";
import CardTile, { CardTileSkeleton, type CardTileData } from "@/components/features/CardTile";
import FilterPanel, { EMPTY_FILTERS, type Filters } from "@/components/features/FilterPanel";
import Pagination from "@/components/ui/Pagination";
import SortControl, { type SortDir } from "@/components/ui/SortControl";
import Drawer from "@/components/ui/Drawer";
import EmptyState from "@/components/ui/EmptyState";
import Chip from "@/components/ui/Chip";
import AddCardDrawer from "@/components/features/AddCardDrawer";

const PAGE_SIZE = 24;

type SortKey = "name" | "price";

export default function BrowsePage() {
  const ready = useConvexReady();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("name");
  const [dir, setDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState<CardTileData | null>(null);

  const games = useQuery(api.cards.listGames, ready ? {} : "skip") ?? [];
  const gameId = games.find((g) => g.slug === filters.gameSlug)?._id;
  const sets = useQuery(api.cards.listSets, ready && gameId ? { game: gameId } : "skip");

  const { results, status, loadMore } = usePaginatedQuery(
    api.cards.browse,
    ready ? { game: gameId, setName: gameId ? (filters.setName ?? undefined) : undefined } : "skip",
    { initialNumItems: PAGE_SIZE * 2 },
  );

  const filtered = useMemo(() => {
    const cards = (results ?? []) as CardTileData[];
    const byRarity =
      filters.rarities.length === 0
        ? cards
        : cards.filter((c) => filters.rarities.includes(c.rarityTier));
    return [...byRarity].sort((a, b) => {
      const cmp =
        sort === "name"
          ? a.name.localeCompare(b.name)
          : (a.headline?.price ?? 0) - (b.headline?.price ?? 0);
      return dir === "asc" ? cmp : -cmp;
    });
  }, [results, filters.rarities, sort, dir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clamped = Math.min(page, pageCount);
  const visible = filtered.slice((clamped - 1) * PAGE_SIZE, clamped * PAGE_SIZE);
  const loading = ready && status === "LoadingFirstPage";

  // Selecting a set we haven't cached yet pulls its first cards on demand,
  // through the same rate-limited backfill path as uncached searches.
  const requestBackfill = useMutation(api.cards.requestBackfill);
  const pulledSets = useRef(new Set<string>());
  const selectedSet = (sets ?? []).find((s) => s.setName === filters.setName);
  const setIsEmpty =
    !!filters.setName && status === "Exhausted" && filtered.length === 0;
  useEffect(() => {
    if (!setIsEmpty || !selectedSet?.justTcgSetId) return;
    if (pulledSets.current.has(selectedSet.justTcgSetId)) return;
    pulledSets.current.add(selectedSet.justTcgSetId);
    requestBackfill({ gameSlug: filters.gameSlug ?? undefined, setId: selectedSet.justTcgSetId }).catch(
      () => {},
    );
  }, [setIsEmpty, selectedSet, filters.gameSlug, requestBackfill]);
  const activeFilterCount =
    (filters.gameSlug ? 1 : 0) + (filters.setName ? 1 : 0) + filters.rarities.length;

  const setFiltersAndReset = (next: Filters) => {
    setFilters(next);
    setPage(1);
  };

  const panel = (
    <FilterPanel
      games={games}
      sets={gameId ? sets : []}
      filters={filters}
      onChange={setFiltersAndReset}
    />
  );

  return (
    <div className="page" style={{ maxWidth: 1280, margin: "0 auto", padding: "var(--space-6) var(--space-5)" }}>
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginBottom: "var(--space-4)" }}>
        Cards
      </h1>
      <CardSearch game={gameId} />
      <div className="browse-bar">
        <button
          className="chip filters-chip"
          onClick={() => setFiltersOpen(true)}
          aria-label="Open filters"
          style={{ cursor: "pointer" }}
        >
          <SlidersHorizontal size={13} aria-hidden /> Filters
          {activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
        </button>
        {filters.gameSlug && (
          <Chip onRemove={() => setFiltersAndReset({ ...filters, gameSlug: null, setName: null })}>
            {games.find((g) => g.slug === filters.gameSlug)?.name}
          </Chip>
        )}
        {filters.setName && (
          <Chip onRemove={() => setFiltersAndReset({ ...filters, setName: null })}>
            {filters.setName}
          </Chip>
        )}
        <span className="spacer" />
        <SortControl
          options={[
            { key: "name", label: "Name" },
            { key: "price", label: "Price" },
          ]}
          value={sort}
          dir={dir}
          onChange={(key, nextDir) => {
            setSort(key);
            setDir(key === sort ? nextDir : key === "name" ? "asc" : "desc");
          }}
        />
      </div>
      <div className="browse-layout">
        <aside className="browse-side">{panel}</aside>
        <main className="browse-main">
          {loading && (
            <div className="browse-grid">
              {Array.from({ length: 8 }, (_, i) => (
                <CardTileSkeleton key={i} />
              ))}
            </div>
          )}
          {!loading && visible.length > 0 && (
            <div className="browse-grid">
              {visible.map((card) => (
                <CardTile key={card._id} card={card} onQuickAdd={setQuickAdd} />
              ))}
            </div>
          )}
          {!loading && visible.length === 0 && (
            <EmptyState
              title={setIsEmpty ? "Nothing cached from this set yet" : "Nothing in the catalog yet"}
              description={
                setIsEmpty
                  ? "Kiri is pulling this set's first cards from the market; check back in a minute."
                  : "Search for any card above and Kiri pulls it from the market, prices and all."
              }
            />
          )}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-6)" }}>
            <Pagination
              page={clamped}
              pageCount={pageCount}
              hasMore={status === "CanLoadMore"}
              onPage={(n) => {
                if (n > pageCount && status === "CanLoadMore") loadMore(PAGE_SIZE * 2);
                setPage(Math.max(1, n));
              }}
            />
          </div>
        </main>
      </div>
      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        {panel}
      </Drawer>
      <QuickAddHost card={quickAdd} onClose={() => setQuickAdd(null)} />
    </div>
  );
}

/** Tile quick-add: fetch the card's variants, then hand off to the drawer. */
function QuickAddHost({ card, onClose }: { card: CardTileData | null; onClose: () => void }) {
  const ready = useConvexReady();
  const data = useQuery(
    api.cards.getBySlug,
    ready && card ? { gameSlug: card.gameSlug, slug: card.slug } : "skip",
  );
  if (!card || !data) return null;
  return (
    <AddCardDrawer
      open
      onClose={onClose}
      card={data.card}
      variants={data.variants}
    />
  );
}
