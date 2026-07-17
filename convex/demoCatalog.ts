"use node";

/**
 * Demo catalog seeder: fills the catalog with well-known cards from free,
 * keyless APIs so the app demos fully without the paid JustTCG key.
 *
 * Run with: npx convex run demoCatalog:seedAll
 *
 * Endpoints verified with curl on 2026-07-16:
 * - Magic (Scryfall):
 *   GET https://api.scryfall.com/cards/search?q=game%3Apaper+usd%3E%3D15&order=usd&dir=desc
 *   → 175 cards/page with name, set_name, set, collector_number, rarity,
 *     image_uris.normal (card_faces[0].image_uris.normal for DFCs),
 *     prices.usd / prices.usd_foil (strings).
 * - Pokémon (pokemontcg.io, no key needed at low volume):
 *   GET https://api.pokemontcg.io/v2/cards?pageSize=50&q=rarity:"Rare Holo" OR rarity:"Rare Secret"
 *   → 47/50 cards had tcgplayer.prices.*.market; images.large present.
 * - Yu-Gi-Oh (YGOPRODeck):
 *   GET https://db.ygoprodeck.com/api/v7/cardinfo.php?name=A|B|C  (pipe-separated
 *   exact names) → card_sets[] with set_name/set_code/set_rarity/set_price,
 *   card_prices[0].tcgplayer_price, card_images[0].image_url. YGOPRODeck asks
 *   consumers to cache images; hotlinking ~50 for a demo is acceptable, so we
 *   store image_url directly.
 * - Sorcery (community API):
 *   GET https://api.sorcerytcg.com/api/cards → 1100 cards with name,
 *   guardian.rarity (Ordinary/Exceptional/Elite/Unique) and sets[] (Alpha/Beta
 *   with Standard/Foil finishes) but NO image URLs and NO prices. Cards are
 *   seeded without imageUrl (the UI renders a gradient placeholder), except
 *   Philosopher's Stone which uses the self-hosted /cards/philosophers-stone.jpg.
 *   Prices for Sorcery are synthesized per rarity band (deterministic).
 *
 * Idempotency: every upsert flows through internal.syncDb.upsertCardFromApi,
 * the same mutation the JustTCG sync uses. Cards key on justTcgCardId
 * ("demo-<game>-<set>-<number>"), variants on justTcgVariantId, and history
 * snapshots dedupe on (variant, day) — safe to re-run, never deletes.
 */

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const DAY_MS = 24 * 60 * 60 * 1000;
const HISTORY_DAYS = 90;
const FETCH_TIMEOUT_MS = 45_000;

/* ------------------------------------------------------------------ */
/* Deterministic PRNG: same card id → same synthetic history on re-run */
/* ------------------------------------------------------------------ */

/** FNV-1a 32-bit string hash → PRNG seed. */
function hashSeed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: tiny deterministic PRNG, uniform in [0, 1). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* ------------------------------------------------------------- */
/* Synthetic 90-day history around the real current market price  */
/* ------------------------------------------------------------- */

type HistoryPoint = { p: number; t: number };

type SynthStats = {
  priceHistory: HistoryPoint[];
  change7d: number;
  change30d: number;
  change90d: number;
};

/**
 * Random-walk the price backwards from today: ±0.5% daily drift, seeded on
 * the variant id so re-runs produce the same walk. Returns history points
 * ({p, t: unix seconds}, oldest first) plus 7d/30d/90d percent changes that
 * are consistent with the walk (matching the UI's signedPercent rendering).
 */
function synthesizeHistory(seedKey: string, currentPrice: number): SynthStats {
  const rand = mulberry32(hashSeed(seedKey));
  const now = Date.now();
  // byDaysAgo[0] = today's real price; walk backwards one day at a time.
  const byDaysAgo: number[] = [currentPrice];
  for (let i = 1; i <= HISTORY_DAYS; i++) {
    const drift = (rand() * 2 - 1) * 0.005; // ±0.5% per day
    byDaysAgo.push(Math.max(0.01, round2(byDaysAgo[i - 1] / (1 + drift))));
  }
  const priceHistory: HistoryPoint[] = [];
  for (let daysAgo = HISTORY_DAYS; daysAgo >= 0; daysAgo--) {
    priceHistory.push({
      p: byDaysAgo[daysAgo],
      t: Math.floor((now - daysAgo * DAY_MS) / 1000),
    });
  }
  const pct = (daysAgo: number) =>
    round2(((currentPrice - byDaysAgo[daysAgo]) / byDaysAgo[daysAgo]) * 100);
  return { priceHistory, change7d: pct(7), change30d: pct(30), change90d: pct(90) };
}

/* ------------------------------------------ */
/* Shapes accepted by syncDb.upsertCardFromApi */
/* ------------------------------------------ */

type DemoVariant = {
  justTcgVariantId: string;
  condition: string;
  printing: string;
  price: number;
  change7d: number;
  change30d: number;
  change90d: number;
  priceHistory: HistoryPoint[];
};

type DemoCard = {
  justTcgCardId: string;
  name: string;
  setName: string;
  number?: string;
  rarity?: string;
  imageUrl?: string;
  variants: DemoVariant[];
};

function demoVariant(variantId: string, printing: "Normal" | "Foil", price: number): DemoVariant {
  const rounded = round2(price);
  return {
    justTcgVariantId: variantId,
    condition: "Near Mint",
    printing,
    price: rounded,
    ...synthesizeHistory(variantId, rounded),
  };
}

/** URL/id-safe token from an upstream set code or name. */
function idToken(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      // Scryfall requires an identifying User-Agent + Accept header.
      "User-Agent": "KiriDemoCatalogSeeder/1.0",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

/* ------------------------------- */
/* Magic: The Gathering (Scryfall) */
/* ------------------------------- */

type ScryfallCard = {
  name?: string;
  set?: string;
  set_name?: string;
  collector_number?: string;
  rarity?: string;
  image_uris?: { normal?: string };
  card_faces?: Array<{ image_uris?: { normal?: string } }>;
  prices?: { usd?: string | null; usd_foil?: string | null };
};

// Rarities lib/normalize.ts knows for MTG ("bonus" etc. would warn → common).
const MTG_RARITIES = new Set(["common", "uncommon", "rare", "mythic", "mythic rare", "special"]);

async function fetchMagic(): Promise<DemoCard[]> {
  const res = await fetchJson<{ data?: ScryfallCard[] }>(
    "https://api.scryfall.com/cards/search?q=game%3Apaper+usd%3E%3D15&order=usd&dir=desc",
  );
  const out: DemoCard[] = [];
  for (const card of res.data ?? []) {
    if (out.length >= 60) break;
    if (!card.name || !card.set || !card.set_name || !card.collector_number) continue;
    if (!card.rarity || !MTG_RARITIES.has(card.rarity)) continue;
    const image =
      card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal ?? undefined;
    const usd = card.prices?.usd ? parseFloat(card.prices.usd) : NaN;
    const usdFoil = card.prices?.usd_foil ? parseFloat(card.prices.usd_foil) : NaN;
    if (!(usd > 0) && !(usdFoil > 0)) continue;
    const id = `demo-mtg-${idToken(card.set)}-${idToken(card.collector_number)}`;
    const variants: DemoVariant[] = [];
    if (usd > 0) variants.push(demoVariant(`${id}-normal`, "Normal", usd));
    if (usdFoil > 0) variants.push(demoVariant(`${id}-foil`, "Foil", usdFoil));
    out.push({
      justTcgCardId: id,
      name: card.name,
      setName: card.set_name,
      number: card.collector_number,
      rarity: card.rarity === "mythic" ? "Mythic" : card.rarity,
      imageUrl: image,
      variants,
    });
  }
  return out;
}

/* ------------------------- */
/* Pokémon (pokemontcg.io)   */
/* ------------------------- */

type PokemonCard = {
  name?: string;
  number?: string;
  rarity?: string;
  set?: { id?: string; name?: string };
  images?: { large?: string; small?: string };
  tcgplayer?: { prices?: Record<string, { market?: number | null }> };
};

// Rarities lib/normalize.ts knows for Pokémon.
const POKEMON_RARITIES = new Set([
  "common", "uncommon", "rare", "rare holo", "holo rare", "double rare",
  "ultra rare", "rare ultra", "illustration rare", "special illustration rare",
  "rare secret", "secret rare", "hyper rare", "promo",
]);

async function fetchPokemon(): Promise<DemoCard[]> {
  const q = encodeURIComponent('rarity:"Rare Holo" OR rarity:"Rare Secret"');
  const res = await fetchJson<{ data?: PokemonCard[] }>(
    `https://api.pokemontcg.io/v2/cards?pageSize=50&q=${q}`,
  );
  const out: DemoCard[] = [];
  for (const card of res.data ?? []) {
    if (out.length >= 50) break;
    if (!card.name || !card.set?.id || !card.set?.name || !card.number) continue;
    if (!card.rarity || !POKEMON_RARITIES.has(card.rarity.toLowerCase())) continue;
    const prices = card.tcgplayer?.prices ?? {};
    const normal = prices.normal?.market ?? undefined;
    const foil =
      prices.holofoil?.market ??
      prices["1stEditionHolofoil"]?.market ??
      prices.reverseHolofoil?.market ??
      undefined;
    if (!normal && !foil) continue;
    const id = `demo-pokemon-${idToken(card.set.id)}-${idToken(card.number)}`;
    const variants: DemoVariant[] = [];
    if (typeof normal === "number" && normal > 0)
      variants.push(demoVariant(`${id}-normal`, "Normal", normal));
    if (typeof foil === "number" && foil > 0)
      variants.push(demoVariant(`${id}-foil`, "Foil", foil));
    if (variants.length === 0) continue;
    out.push({
      justTcgCardId: id,
      name: card.name,
      setName: card.set.name,
      number: card.number,
      rarity: card.rarity,
      imageUrl: card.images?.large ?? card.images?.small,
      variants,
    });
  }
  return out;
}

/* ------------------------ */
/* Yu-Gi-Oh (YGOPRODeck)    */
/* ------------------------ */

type YgoSet = {
  set_name?: string;
  set_code?: string;
  set_rarity?: string;
  set_price?: string;
};

type YgoCard = {
  name?: string;
  card_sets?: YgoSet[];
  card_prices?: Array<{ tcgplayer_price?: string }>;
  card_images?: Array<{ image_url?: string }>;
};

// ~50 iconic staples; exact-name misses are skipped harmlessly.
const YGO_STAPLES = [
  "Blue-Eyes White Dragon", "Blue-Eyes Ultimate Dragon", "Blue-Eyes Alternative White Dragon",
  "Dark Magician", "Dark Magician Girl", "Red-Eyes Black Dragon", "Red-Eyes Darkness Metal Dragon",
  "Summoned Skull", "Jinzo", "Buster Blader", "Kuriboh", "Time Wizard",
  "Cyber Dragon", "Cyber Dragon Infinity", "Elemental HERO Neos", "Stardust Dragon",
  "Black Rose Dragon", "Number 39: Utopia", "Decode Talker", "Accesscode Talker",
  "Firewall Dragon", "Borreload Dragon", "I:P Masquerena", "Knightmare Phoenix",
  "Slifer the Sky Dragon", "Obelisk the Tormentor", "The Winged Dragon of Ra",
  "Exodia the Forbidden One", "Right Arm of the Forbidden One", "Left Arm of the Forbidden One",
  "Right Leg of the Forbidden One", "Left Leg of the Forbidden One",
  "Black Luster Soldier - Envoy of the Beginning", "Dark Armed Dragon", "Judgment Dragon",
  "Honest", "Ash Blossom & Joyous Spring", "Ghost Ogre & Snow Rabbit",
  "Ghost Belle & Haunted Mansion", "Effect Veiler", 'Maxx "C"', "Nibiru, the Primal Being",
  "Infinite Impermanence", "Called by the Grave", "Crossout Designator", "Pot of Greed",
  "Graceful Charity", "Change of Heart", "Monster Reborn", "Raigeki", "Dark Hole",
  "Harpie's Feather Duster", "Mystical Space Typhoon", "Book of Moon", "Foolish Burial",
  "Mirror Force", "Solemn Judgment", "Torrential Tribute",
];

// Rarities lib/normalize.ts knows for Yu-Gi-Oh (exotic parallels excluded).
const YGO_RARITIES = new Set([
  "common", "rare", "super rare", "ultra rare", "ultimate rare", "secret rare",
  "ghost rare", "starlight rare", "quarter century secret rare",
  "prismatic secret rare", "collector's rare", "gold rare", "starfoil rare",
  "shatterfoil rare", "mosaic rare", "short print",
]);

async function fetchYugioh(): Promise<DemoCard[]> {
  const names = encodeURIComponent(YGO_STAPLES.join("|"));
  const res = await fetchJson<{ data?: YgoCard[] }>(
    `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${names}`,
  );
  const out: DemoCard[] = [];
  for (const card of res.data ?? []) {
    if (out.length >= 50) break;
    if (!card.name) continue;
    // Pick the priciest printing whose rarity our vocabulary knows, so the
    // demo shows the collectible version rather than a bulk reprint.
    const printings = (card.card_sets ?? []).filter(
      (s) =>
        s.set_code &&
        s.set_name &&
        s.set_rarity &&
        YGO_RARITIES.has(s.set_rarity.toLowerCase()),
    );
    if (printings.length === 0) continue;
    const best = printings.reduce((a, b) =>
      parseFloat(b.set_price ?? "0") > parseFloat(a.set_price ?? "0") ? b : a,
    );
    const setPrice = parseFloat(best.set_price ?? "0");
    const fallback = parseFloat(card.card_prices?.[0]?.tcgplayer_price ?? "0");
    const price = setPrice > 0.02 ? setPrice : fallback;
    if (!(price > 0)) continue;
    const id = `demo-yugioh-${idToken(best.set_code!)}`;
    out.push({
      justTcgCardId: id,
      name: card.name,
      setName: best.set_name!,
      number: best.set_code!,
      rarity: best.set_rarity!,
      imageUrl: card.card_images?.[0]?.image_url,
      variants: [demoVariant(`${id}-normal`, "Normal", price)],
    });
  }
  return out;
}

/* ---------------------------------- */
/* Sorcery: Contested Realm (community) */
/* ---------------------------------- */

type SorceryCard = {
  name?: string;
  guardian?: { rarity?: string | null };
  sets?: Array<{
    name?: string;
    variants?: Array<{ slug?: string; finish?: string }>;
  }>;
};

// Synthetic USD bands per rarity: the community API carries no prices.
const SORCERY_PRICE_BANDS: Record<string, [number, number]> = {
  Ordinary: [0.25, 1.5],
  Exceptional: [1.5, 6],
  Elite: [6, 25],
  Unique: [25, 120],
};

const PHILOSOPHERS_STONE_IMAGE = "/cards/philosophers-stone.jpg"; // exists in public/cards/

// If api.sorcerytcg.com is down, seed these real Alpha cards (no images; the
// UI renders its gradient placeholder). Names verified against the API dump.
const SORCERY_FALLBACK: Array<{ name: string; rarity: string; foil: boolean }> = [
  { name: "Philosopher's Stone", rarity: "Unique", foil: true },
  { name: "Grim Reaper", rarity: "Unique", foil: true },
  { name: "Lord of the Void", rarity: "Unique", foil: true },
  { name: "Ultimate Horror", rarity: "Unique", foil: true },
  { name: "Witherwing Hero", rarity: "Unique", foil: true },
  { name: "Highland Princess", rarity: "Unique", foil: true },
  { name: "Grandmaster Wizard", rarity: "Elite", foil: true },
  { name: "East-West Dragon", rarity: "Elite", foil: true },
  { name: "Highland Falconer", rarity: "Elite", foil: true },
  { name: "Candlemas Monks", rarity: "Elite", foil: true },
  { name: "Apprentice Wizard", rarity: "Ordinary", foil: true },
  { name: "Browse", rarity: "Unique", foil: true },
];

function sorceryDemoCard(name: string, rarity: string, hasFoil: boolean, imageSlug?: string): DemoCard {
  const id = `demo-sorcery-alpha-${idToken(name)}`;
  const band = SORCERY_PRICE_BANDS[rarity] ?? SORCERY_PRICE_BANDS.Ordinary;
  const rand = mulberry32(hashSeed(`price:${id}`));
  const price = round2(band[0] + rand() * (band[1] - band[0]));
  const variants = [demoVariant(`${id}-normal`, "Normal", price)];
  if (hasFoil) variants.push(demoVariant(`${id}-foil`, "Foil", round2(price * (2 + rand()))));
  // Card art lives on Curiosa's CDN (the official deck builder), addressed by
  // the API's variant slug: https://d27a44hjr9gen3.cloudfront.net/cards/<slug>.png
  const imageUrl = imageSlug
    ? `https://d27a44hjr9gen3.cloudfront.net/cards/${imageSlug}.png`
    : name === "Philosopher's Stone"
      ? PHILOSOPHERS_STONE_IMAGE
      : undefined;
  return {
    justTcgCardId: id,
    name,
    setName: "Alpha",
    // The API's variant slug prefix is not a collector number; omit number.
    rarity,
    imageUrl,
    variants,
  };
}

async function fetchSorcery(): Promise<DemoCard[]> {
  let raw: SorceryCard[];
  try {
    raw = await fetchJson<SorceryCard[]>("https://api.sorcerytcg.com/api/cards");
  } catch (err) {
    console.warn(`demoCatalog: sorcery API unavailable (${String(err)}), using fallback list`);
    return SORCERY_FALLBACK.map((c) => sorceryDemoCard(c.name, c.rarity, c.foil));
  }
  // 10 cards per rarity from the Alpha set, alphabetical for determinism,
  // with Philosopher's Stone pinned (it has the self-hosted image).
  const alpha = raw
    .filter((c) => c.name && c.guardian?.rarity)
    .map((c) => ({
      name: c.name!,
      rarity: c.guardian!.rarity!,
      set: c.sets?.find((s) => s.name === "Alpha"),
    }))
    .filter((c) => c.set !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));
  const out: DemoCard[] = [];
  for (const rarity of ["Unique", "Elite", "Exceptional", "Ordinary"]) {
    const bucket = alpha.filter((c) => c.rarity === rarity);
    const pinned = rarity === "Unique" ? bucket.filter((c) => c.name === "Philosopher's Stone") : [];
    const rest = bucket.filter((c) => c.name !== "Philosopher's Stone");
    for (const card of [...pinned, ...rest].slice(0, 10)) {
      const variants = card.set?.variants ?? [];
      const hasFoil = variants.some((x) => x.finish === "Foil");
      const imageSlug = variants.find((x) => x.finish === "Standard")?.slug ?? variants[0]?.slug;
      out.push(sorceryDemoCard(card.name, card.rarity, hasFoil, imageSlug));
    }
  }
  return out;
}

/* -------- */
/* seedAll  */
/* -------- */

type GameResult = { cards: number; variants: number; sets: number; error?: string };

/**
 * Seed the whole demo catalog: games (via seed.init), then per game its
 * cards, variants, synthetic 90-day histories, and set rows. Idempotent;
 * never deletes. `npx convex run demoCatalog:seedAll`
 */
export const seedAll = internalAction({
  args: {},
  handler: async (ctx) => {
    await ctx.runMutation(internal.seed.init, {});
    const games: Array<{ _id: string; slug: string }> = await ctx.runQuery(
      internal.syncDb.listGamesInternal,
      {},
    );
    const gameIdBySlug = new Map(games.map((g) => [g.slug, g._id]));

    const sources: Array<{ gameSlug: string; fetcher: () => Promise<DemoCard[]> }> = [
      { gameSlug: "magic-the-gathering", fetcher: fetchMagic },
      { gameSlug: "pokemon", fetcher: fetchPokemon },
      { gameSlug: "yugioh", fetcher: fetchYugioh },
      { gameSlug: "sorcery-contested-realm", fetcher: fetchSorcery },
    ];

    const summary: Record<string, GameResult> = {};
    for (const { gameSlug, fetcher } of sources) {
      const gameId = gameIdBySlug.get(gameSlug);
      if (!gameId) {
        summary[gameSlug] = { cards: 0, variants: 0, sets: 0, error: "game row missing" };
        continue;
      }
      let cards: DemoCard[];
      try {
        cards = await fetcher();
      } catch (err) {
        console.error(`demoCatalog: ${gameSlug} fetch failed: ${String(err)}`);
        summary[gameSlug] = { cards: 0, variants: 0, sets: 0, error: String(err) };
        continue;
      }

      let variantCount = 0;
      const setCounts = new Map<string, number>();
      for (const card of cards) {
        await ctx.runMutation(internal.syncDb.upsertCardFromApi, { gameSlug, card });
        variantCount += card.variants.length;
        setCounts.set(card.setName, (setCounts.get(card.setName) ?? 0) + 1);
      }

      const sets = [...setCounts.entries()].map(([name, count]) => ({
        justTcgSetId: `demo-${gameSlug}-${idToken(name)}`,
        name,
        cardsCount: count,
      }));
      await ctx.runMutation(internal.syncDb.upsertSets, {
        gameId: gameId as never,
        sets,
      });
      summary[gameSlug] = { cards: cards.length, variants: variantCount, sets: sets.length };
    }
    return summary;
  },
});
