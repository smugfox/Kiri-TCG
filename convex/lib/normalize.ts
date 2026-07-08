/**
 * Normalization of upstream JustTCG labels into Kiri's fixed vocabularies:
 * conditions collapse to NM/LP/MP/HP/DMG, and per-game rarity strings map
 * onto the design system's six-tier ladder (design.md § Components,
 * "Rarity badges" mapping table). Unknown values fall back to the lowest
 * tier with a console warning rather than failing the sync.
 */

export type Condition = "NM" | "LP" | "MP" | "HP" | "DMG";

export type RarityTier =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "mythic"
  | "secret";

const CONDITION_MAP: Record<string, Condition> = {
  "nm": "NM",
  "near mint": "NM",
  "nearmint": "NM",
  "mint": "NM",
  "m": "NM",
  "lp": "LP",
  "lightly played": "LP",
  "light play": "LP",
  "excellent": "LP",
  "ex": "LP",
  "mp": "MP",
  "moderately played": "MP",
  "moderate play": "MP",
  "played": "MP",
  "good": "MP",
  "gd": "MP",
  "hp": "HP",
  "heavily played": "HP",
  "heavy play": "HP",
  "poor": "DMG",
  "dmg": "DMG",
  "damaged": "DMG",
};

export function normalizeCondition(raw: string | undefined | null): Condition {
  if (!raw) return "NM";
  const hit = CONDITION_MAP[raw.trim().toLowerCase()];
  if (hit) return hit;
  console.warn(`normalize: unknown condition "${raw}", defaulting to NM`);
  return "NM";
}

/**
 * Per-game rarity ladders, keyed by game slug. Keys are lowercased upstream
 * rarity labels. Prestige mapping per design.md's table; labels the table
 * doesn't name are mapped by prestige alongside their named peers.
 */
const RARITY_MAPS: Record<string, Record<string, RarityTier>> = {
  "magic-the-gathering": {
    "common": "common",
    "uncommon": "uncommon",
    "rare": "rare",
    "mythic": "mythic",
    "mythic rare": "mythic",
    "special": "secret",
    "land": "common",
    "basic land": "common",
    "token": "common",
    "promo": "rare",
  },
  "pokemon": {
    "common": "common",
    "uncommon": "uncommon",
    "rare": "rare",
    "rare holo": "rare",
    "holo rare": "rare",
    "double rare": "epic",
    "ultra rare": "epic",
    "rare ultra": "epic",
    "illustration rare": "mythic",
    "special illustration rare": "mythic",
    "rare secret": "secret",
    "secret rare": "secret",
    "hyper rare": "secret",
    "promo": "rare",
  },
  "yugioh": {
    "common": "common",
    "rare": "uncommon",
    "super rare": "rare",
    "ultra rare": "mythic",
    "ultimate rare": "mythic",
    "secret rare": "secret",
    "ghost rare": "secret",
    "starlight rare": "secret",
    "quarter century secret rare": "secret",
    "prismatic secret rare": "secret",
    "collector's rare": "secret",
    "gold rare": "rare",
    "starfoil rare": "rare",
    "shatterfoil rare": "rare",
    "mosaic rare": "rare",
    "short print": "common",
  },
  "sorcery-contested-realm": {
    "ordinary": "common",
    "exceptional": "uncommon",
    "elite": "rare",
    "unique": "mythic",
  },
};

export function normalizeRarity(
  gameSlug: string,
  raw: string | undefined | null,
): RarityTier {
  if (!raw) return "common";
  const map = RARITY_MAPS[gameSlug];
  const hit = map?.[raw.trim().toLowerCase()];
  if (hit) return hit;
  console.warn(
    `normalize: unknown rarity "${raw}" for game "${gameSlug}", defaulting to common`,
  );
  return "common";
}

/** URL-safe slug from card name, set, and collector number; unique per game. */
export function cardSlug(name: string, setName: string, number?: string | null): string {
  return [name, setName, number ?? ""]
    .join(" ")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Languages JustTCG appends to printing labels ("Normal - Japanese"). */
const LANGUAGES = [
  "English",
  "Japanese",
  "Korean",
  "Chinese (S)",
  "Chinese (T)",
  "German",
  "French",
  "Italian",
  "Spanish",
  "Portuguese",
  "Russian",
] as const;

const LANGUAGE_SET = new Set<string>(LANGUAGES);

/**
 * Split an upstream printing label into its base printing and language.
 * "Normal - Japanese" → { printing: "Normal", language: "Japanese" };
 * "Foil" → { printing: "Foil", language: "English" }. Only a suffix that is
 * a known language splits, so exotic printings with hyphens stay intact.
 */
export function splitPrinting(raw: string | undefined | null): {
  printing: string;
  language: string;
} {
  const label = (raw ?? "Normal").trim();
  const at = label.lastIndexOf(" - ");
  if (at > 0) {
    const suffix = label.slice(at + 3).trim();
    if (LANGUAGE_SET.has(suffix)) {
      return { printing: label.slice(0, at).trim(), language: suffix };
    }
  }
  return { printing: label, language: "English" };
}
