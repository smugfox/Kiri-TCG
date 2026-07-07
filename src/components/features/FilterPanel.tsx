"use client";

import { RarityBadge, type RarityTier } from "@/components/ui/Badge";
import Checkbox from "@/components/ui/Checkbox";

const TIERS: RarityTier[] = ["common", "uncommon", "rare", "epic", "mythic", "secret"];

export type Filters = {
  gameSlug: string | null; // null = all games
  rarities: RarityTier[];
};

/**
 * filter-panel (design.md § Components): 260px facet sidebar with game
 * checkboxes, the rarity ladder as selectable badges, and the price range
 * slider (visual-only at MVP). On mobile the page hosts this inside a Drawer.
 */
export default function FilterPanel({
  games,
  filters,
  onChange,
}: {
  games: Array<{ slug: string; name: string }>;
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const clear = () => onChange({ gameSlug: null, rarities: [] });
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
              onChange={(checked) =>
                onChange({ ...filters, gameSlug: checked ? game.slug : null })
              }
            >
              {game.name}
            </Checkbox>
          </div>
        ))}
      </div>
      <div className="fgroup">
        <div className="gh">Rarity</div>
        <div className="fbadges">
          {TIERS.map((tier) => {
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
                <RarityBadge tier={tier}>{tier}</RarityBadge>
              </button>
            );
          })}
        </div>
      </div>
      <div className="fgroup">
        <div className="gh">Price</div>
        <input
          type="range"
          aria-label="Price range (coming soon)"
          disabled
          style={{ width: "100%", marginTop: 10, accentColor: "var(--color-accent)" }}
        />
        <span className="cs-set">Price filtering arrives with a later phase</span>
      </div>
    </div>
  );
}
