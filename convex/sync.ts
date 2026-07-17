"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { justTcgFetch, justTcgPost, JustTcgError, DAILY_BUDGET } from "./lib/justtcg";

type ApiVariant = {
  id: string;
  condition?: string;
  printing?: string;
  price?: number;
  lastUpdated?: number;
  priceChange7d?: number;
  priceChange30d?: number;
  priceChange90d?: number;
  priceHistory?: Array<{ p: number; t: number }>;
};

type ApiCard = {
  id: string;
  name?: string;
  set_name?: string;
  number?: string | null;
  rarity?: string | null;
  imageUrl?: string;
  variants?: ApiVariant[];
};

/**
 * Backfill the catalog for a search that missed the cache. One JustTCG
 * request (≤20 cards), drawn from the reserved backfill pool; when that
 * pool is spent the search stays uncached until tomorrow (the caller's
 * empty state says so). Scheduled by cards.requestBackfill.
 */
export const searchBackfill = internalAction({
  args: {
    q: v.optional(v.string()),
    gameSlug: v.optional(v.string()),
    setId: v.optional(v.string()),
  },
  handler: async (ctx, { q, gameSlug, setId }) => {
    const granted: number = await ctx.runMutation(internal.syncDb.takeBudget, {
      kind: "backfill",
      count: 1,
    });
    if (granted < 1) {
      console.warn(`backfill: budget exhausted, "${q ?? setId}" waits for tomorrow`);
      return { fetched: 0, budgetExhausted: true };
    }

    const params: Record<string, string> = { limit: "20" };
    if (q) params.q = q;
    if (setId) params.set = setId;
    if (gameSlug) params.game = gameSlug;
    let cards: ApiCard[];
    try {
      const res = await justTcgFetch<{ data: ApiCard[] }>("/cards", params);
      cards = res.data ?? [];
    } catch (err) {
      if (err instanceof JustTcgError) {
        console.error(`backfill: JustTCG failed for "${q}": ${err.message}`);
        return { fetched: 0, error: err.message };
      }
      throw err;
    }

    let fetched = 0;
    for (const card of cards) {
      if (!card.id || !card.name || !card.set_name) {
        console.error(`backfill: malformed card skipped: ${JSON.stringify(card).slice(0, 200)}`);
        continue;
      }
      await ctx.runMutation(internal.syncDb.upsertCardFromApi, {
        gameSlug,
        card: {
          justTcgCardId: card.id,
          name: card.name,
          setName: card.set_name,
          number: card.number ?? undefined,
          rarity: card.rarity ?? undefined,
          imageUrl: card.imageUrl,
          // Upstream uses null for absent stats; our validators want absent.
          variants: (card.variants ?? []).map((variant) => ({
            justTcgVariantId: variant.id,
            condition: variant.condition ?? undefined,
            printing: variant.printing ?? undefined,
            price: variant.price ?? undefined,
            lastUpdated: variant.lastUpdated ?? undefined,
            change7d: variant.priceChange7d ?? undefined,
            change30d: variant.priceChange30d ?? undefined,
            change90d: variant.priceChange90d ?? undefined,
            priceHistory: (variant.priceHistory ?? []).filter(
              (point) => typeof point?.p === "number" && typeof point?.t === "number",
            ),
          })),
        },
      });
      fetched++;
    }
    return { fetched };
  },
});

/**
 * Nightly refresh (PRD FR-005): pull current prices for tracked variants in
 * priority order, 20 per request, within the day's remaining budget. Writes
 * variants.current* and one priceSnapshot per variant per day (idempotent).
 * Overflow is logged and picked up stalest-first tomorrow.
 */
export const refreshVariants = internalAction({
  args: {},
  handler: async (ctx) => {
    const candidates: string[] = await ctx.runQuery(internal.syncDb.refreshCandidates, {
      limit: DAILY_BUDGET * 20,
    });
    let refreshed = 0;
    let requests = 0;
    for (let i = 0; i < candidates.length; i += 20) {
      const granted: number = await ctx.runMutation(internal.syncDb.takeBudget, {
        kind: "nightly",
        count: 1,
      });
      if (granted < 1) {
        console.warn(
          `refresh: budget exhausted after ${requests} requests; ${candidates.length - i} variants roll to tomorrow`,
        );
        break;
      }
      const batch = candidates.slice(i, i + 20).map((variantId) => ({ variantId }));
      let cards: ApiCard[];
      try {
        const res = await justTcgPost<{ data: ApiCard[] }>("/cards", batch);
        cards = res.data ?? [];
      } catch (err) {
        if (err instanceof JustTcgError) {
          console.error(`refresh: JustTCG failed on batch ${i / 20 + 1}: ${err.message}`);
          continue;
        }
        throw err;
      }
      requests++;
      for (const card of cards) {
        if (!card.id || !card.name || !card.set_name) {
          console.error(`refresh: malformed card skipped: ${JSON.stringify(card).slice(0, 200)}`);
          continue;
        }
        await ctx.runMutation(internal.syncDb.upsertCardFromApi, {
          card: {
            justTcgCardId: card.id,
            name: card.name,
            setName: card.set_name,
            number: card.number ?? undefined,
            rarity: card.rarity ?? undefined,
            imageUrl: card.imageUrl,
            variants: (card.variants ?? []).map((variant) => ({
              justTcgVariantId: variant.id,
              condition: variant.condition ?? undefined,
              printing: variant.printing ?? undefined,
              price: variant.price ?? undefined,
              lastUpdated: variant.lastUpdated ?? undefined,
              change7d: variant.priceChange7d ?? undefined,
              change30d: variant.priceChange30d ?? undefined,
              change90d: variant.priceChange90d ?? undefined,
              priceHistory: (variant.priceHistory ?? []).filter(
                (point) => typeof point?.p === "number" && typeof point?.t === "number",
              ),
            })),
          },
        });
        refreshed += (card.variants ?? []).length;
      }
    }
    return { refreshed, requests };
  },
});

type ApiSet = {
  id: string;
  name?: string;
  cards_count?: number | null;
  release_date?: string | null;
  set_value_usd?: number | null;
};

/**
 * Seed the per-game set catalog from JustTCG /sets. One request per game;
 * safe to re-run (upserts). Run manually or after adding a game.
 */
export const seedSets = internalAction({
  args: {},
  handler: async (ctx) => {
    const games: Array<{ _id: string; slug: string; justTcgId: string }> =
      await ctx.runQuery(internal.syncDb.listGamesInternal, {});
    const results: Record<string, number> = {};
    for (const game of games) {
      const granted: number = await ctx.runMutation(internal.syncDb.takeBudget, {
        kind: "nightly",
        count: 1,
      });
      if (granted < 1) {
        console.warn(`seedSets: budget exhausted before ${game.slug}`);
        break;
      }
      const res = await justTcgFetch<{ data: ApiSet[] }>("/sets", { game: game.justTcgId });
      const sets = (res.data ?? [])
        .filter((s) => s.id && s.name)
        .map((s) => ({
          justTcgSetId: s.id,
          name: s.name as string,
          cardsCount: s.cards_count ?? undefined,
          releaseDate: s.release_date ?? undefined,
          setValueUsd: s.set_value_usd ?? undefined,
        }));
      results[game.slug] = await ctx.runMutation(internal.syncDb.upsertSets, {
        gameId: game._id as never,
        sets,
      });
    }
    return results;
  },
});

/**
 * Seed the launch staples (seed.STAPLES): for each uncached query, one
 * backfill request drawn from the nightly pool. Re-run until it reports
 * remaining: 0; it resumes safely across days.
 */
export const seedStaples = internalAction({
  args: {},
  handler: async (ctx) => {
    const { STAPLES } = await import("./seed");
    let fetched = 0;
    let skipped = 0;
    let remaining = 0;
    for (const staple of STAPLES) {
      const cached = await ctx.runQuery(internal.syncDb.hasSearchResults, { q: staple.q });
      if (cached) {
        skipped++;
        continue;
      }
      const granted: number = await ctx.runMutation(internal.syncDb.takeBudget, {
        kind: "nightly",
        count: 1,
      });
      if (granted < 1) {
        remaining++;
        continue;
      }
      const params: Record<string, string> = { q: staple.q, game: staple.gameSlug, limit: "20" };
      try {
        const res = await justTcgFetch<{ data: ApiCard[] }>("/cards", params);
        for (const card of res.data ?? []) {
          if (!card.id || !card.name || !card.set_name) continue;
          await ctx.runMutation(internal.syncDb.upsertCardFromApi, {
            gameSlug: staple.gameSlug,
            card: {
              justTcgCardId: card.id,
              name: card.name,
              setName: card.set_name,
              number: card.number ?? undefined,
              rarity: card.rarity ?? undefined,
              imageUrl: card.imageUrl,
              variants: (card.variants ?? []).map((variant) => ({
                justTcgVariantId: variant.id,
                condition: variant.condition ?? undefined,
                printing: variant.printing ?? undefined,
                price: variant.price ?? undefined,
                lastUpdated: variant.lastUpdated ?? undefined,
                change7d: variant.priceChange7d ?? undefined,
                change30d: variant.priceChange30d ?? undefined,
                change90d: variant.priceChange90d ?? undefined,
                priceHistory: (variant.priceHistory ?? []).filter(
                  (point) => typeof point?.p === "number" && typeof point?.t === "number",
                ),
              })),
            },
          });
          fetched++;
        }
      } catch (err) {
        console.error(`seedStaples: "${staple.q}" failed: ${String(err)}`);
      }
    }
    return { cardsFetched: fetched, staplesSkipped: skipped, remaining };
  },
});
