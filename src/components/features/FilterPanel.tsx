"use client";

import { useState } from "react";
import { RarityBadge, type RarityTier } from "@/components/ui/Badge";
import Checkbox from "@/components/ui/Checkbox";
import { GAME_RARITIES } from "@/lib/rarities";

export type Filters = {
  gameSlug: string | null; // null = all games
  setName: string | null; // scoped to the selected game
  rarities: RarityTier[];
};

export const EMPTY_FILTERS: Filters = { gameSlug: null, setName: null, rarities: [] };

/**
 * filter-panel (design.md § Components): 260px facet sidebar with game
 * checkboxes, a set facet (filter-facet-search mini input over a scrollable
 * list, since sets run to the hundreds), the rarity ladder as selectable
 * badges, and the price range slider (visual-only at MVP). On mobile the
 * page hosts this inside a Drawer.
 */
export default function FilterPanel({
  games,
  sets,
  filters,
  onChange,
}: {
  games: Array<{ slug: string; name: string }>;
  /** Sets for the selected game; undefined while loading, [] when no game. */
  sets?: Array<{ setName: string; count: number }>;
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const [setQuery, setSetQuery] = useState("");
  const clear = () => {
    setSetQuery("");
    onChange(EMPTY_FILTERS);
  };
  const shownSets = (sets ?? []).filter((s) =>
    s.setName.toLowerCase().includes(setQuery.trim().toLowerCase()),
  );

  return (
    <div className="fpanel">
      <div className="fph">
        <span className="t">Filters</span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            clear();
          }}
        >
          Clear all
        </a>
      </div>

      <div className="fgroup">
        <div className="gh">Game</div>
        {games.map((game) => (
          <div className="frow" key={game.slug}>
            <Checkbox
              checked={filters.gameSlug === game.slug}
              onChange={(checked) => {
                setSetQuery("");
                // Sets and rarity tiers are game-scoped; changing game resets both.
                onChange({ gameSlug: checked ? game.slug : null, setName: null, rarities: [] });
              }}
            >
              {game.name}
            </Checkbox>
          </div>
        ))}
      </div>

      <div className="fgroup">
        <div className="gh">Set</div>
        {!filters.gameSlug ? (
          <span className="fhint">Pick a game to browse its sets</span>
        ) : (
          <>
            <input
              className="fmini"
              placeholder="Filter sets"
              aria-label="Filter sets"
              value={setQuery}
              onChange={(e) => setSetQuery(e.target.value)}
            />
            <div className="fscroll">
              {shownSets.map((set) => (
                <div className="frow" key={set.setName}>
                  <Checkbox
                    checked={filters.setName === set.setName}
                    onChange={(checked) =>
                      onChange({ ...filters, setName: checked ? set.setName : null })
                    }
                  >
                    <span className="fname" title={set.setName}>{set.setName}</span>
                  </Checkbox>
                  {set.count > 0 && <span className="n">{set.count}</span>}
                </div>
              ))}
              {sets !== undefined && shownSets.length === 0 && (
                <span className="fhint">No cached sets match</span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="fgroup">
        <div className="gh">Rarity</div>
        {!filters.gameSlug ? (
          // Every game names its rarities differently; the ladder only
          // makes sense inside one game.
          <span className="fhint">Pick a game to filter by rarity</span>
        ) : (
          <div className="fbadges">
            {(GAME_RARITIES[filters.gameSlug] ?? []).map(({ tier, label }) => {
              const active = filters.rarities.includes(tier);
              return (
                <button
                  key={tier}
                  aria-pressed={active}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    opacity: active || filters.rarities.length === 0 ? 1 : 0.45,
                  }}
                  onClick={() =>
                    onChange({
                      ...filters,
                      rarities: active
                        ? filters.rarities.filter((t) => t !== tier)
                        : [...filters.rarities, tier],
                    })
                  }
                >
                  <RarityBadge tier={tier}>{label}</RarityBadge>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="fgroup">
        <div className="gh">Price</div>
        <input
          type="range"
          aria-label="Price range (coming soon)"
          disabled
          style={{ width: "100%", marginTop: 10, accentColor: "var(--color-accent)" }}
        />
        <span className="fhint">Price filtering arrives with a later phase</span>
      </div>
    </div>
  );
}
