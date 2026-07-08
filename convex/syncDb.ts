import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { normalizeCondition, normalizeRarity, cardSlug } from "./lib/normalize";
import { DAILY_BUDGET, BACKFILL_BUDGET, utcDay } from "./lib/budget";

/**
 * Atomically claim JustTCG requests from today's budget. Returns how many of
 * the requested count were granted (0 when the day's allowance is spent).
 * Nightly refresh and search backfill draw from separate pools so a burst of
 * uncached searches can never starve owned-card freshness.
 */
export const takeBudget = internalMutation({
  args: {
    kind: v.union(v.literal("nightly"), v.literal("backfill")),
    count: v.number(),
  },
  handler: async (ctx, { kind, count }) => {
    const day = utcDay();
    const row = await ctx.db
      .query("syncState")
      .withIndex("byDay", (q) => q.eq("day", day))
      .unique();
    const used = kind === "nightly" ? (row?.requestsUsed ?? 0) : (row?.backfillUsed ?? 0);
    const budget = kind === "nightly" ? DAILY_BUDGET : BACKFILL_BUDGET;
    const granted = Math.max(0, Math.min(count, budget - used));
    if (granted === 0) return 0;
    if (row) {
      await ctx.db.patch(row._id, {
        requestsUsed: (row.requestsUsed ?? 0) + (kind === "nightly" ? granted : 0),
        backfillUsed: (row.backfillUsed ?? 0) + (kind === "backfill" ? granted : 0),
      });
    } else {
      await ctx.db.insert("syncState", {
        day,
        requestsUsed: kind === "nightly" ? granted : 0,
        backfillUsed: kind === "backfill" ? granted : 0,
      });
    }
    return granted;
  },
});

const apiVariant = v.object({
  justTcgVariantId: v.string(),
  condition: v.optional(v.string()),
  printing: v.optional(v.string()),
  price: v.optional(v.number()),
  lastUpdated: v.optional(v.number()), // unix seconds from upstream
  change7d: v.optional(v.number()),
  change30d: v.optional(v.number()),
  change90d: v.optional(v.number()),
  priceHistory: v.optional(v.array(v.object({ p: v.number(), t: v.number() }))),
});

/**
 * Upsert one card and its variants from a JustTCG payload. Idempotent:
 * cards match on justTcgCardId, variants on justTcgVariantId, and history
 * snapshots dedupe on (variant, day). The game is resolved from the upstream
 * id's slug prefix, falling back to the caller's game filter.
 */
export const upsertCardFromApi = internalMutation({
  args: {
    card: v.object({
      justTcgCardId: v.string(),
      name: v.string(),
      setName: v.string(),
      number: v.optional(v.string()),
      rarity: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      variants: v.array(apiVariant),
    }),
    gameSlug: v.optional(v.string()),
  },
  handler: async (ctx, { card, gameSlug }) => {
    const games = await ctx.db.query("games").collect();
    const game =
      games.find((g) => card.justTcgCardId.startsWith(g.slug + "-")) ??
      games.find((g) => g.slug === gameSlug);
    if (!game) {
      console.error(`sync: no game match for card ${card.justTcgCardId}, skipped`);
      return null;
    }

    const now = Date.now();
    const fields = {
      gameId: game._id,
      name: card.name,
      setName: card.setName,
      number: card.number,
      rarity: card.rarity,
      rarityTier: normalizeRarity(game.slug, card.rarity),
      slug: cardSlug(card.name, card.setName, card.number),
      imageUrl: card.imageUrl,
      searchText: card.name.toLowerCase(),
      lastSyncedAt: now,
    };

    const existing = await ctx.db
      .query("cards")
      .withIndex("byJustTcgId", (q) => q.eq("justTcgCardId", card.justTcgCardId))
      .unique();
    const cardId = existing
      ? (await ctx.db.patch(existing._id, fields), existing._id)
      : await ctx.db.insert("cards", { justTcgCardId: card.justTcgCardId, ...fields });

    for (const variant of card.variants) {
      // PRD edge case: malformed upstream variant data is skipped, not fatal.
      if (!variant.justTcgVariantId || !variant.condition) {
        console.error(
          `sync: malformed variant on ${card.justTcgCardId}, skipped: ${JSON.stringify(variant).slice(0, 200)}`,
        );
        continue;
      }
      const variantFields = {
        cardId,
        condition: normalizeCondition(variant.condition),
        printing: variant.printing ?? "Normal",
        currentPrice: variant.price,
        change7d: variant.change7d,
        change30d: variant.change30d,
        change90d: variant.change90d,
        lastUpdatedAt: variant.lastUpdated ? variant.lastUpdated * 1000 : now,
      };
      const existingVariant = await ctx.db
        .query("variants")
        .withIndex("byJustTcgId", (q) => q.eq("justTcgVariantId", variant.justTcgVariantId))
        .unique();
      const variantId = existingVariant
        ? (await ctx.db.patch(existingVariant._id, variantFields), existingVariant._id)
        : await ctx.db.insert("variants", {
            justTcgVariantId: variant.justTcgVariantId,
            ...variantFields,
          });

      // Seed history from upstream so new cards chart immediately; the
      // nightly cron owns history from here on. Dedupe by (variant, day).
      // Batch refresh lookups return no priceHistory, so today's snapshot
      // also comes from the current price.
      const points = [...(variant.priceHistory ?? []).map((p) => ({ price: p.p, day: utcDay(p.t * 1000) }))];
      if (variant.price !== undefined) points.push({ price: variant.price, day: utcDay() });
      const seenDays = new Set<string>();
      for (const point of points) {
        if (seenDays.has(point.day)) continue;
        seenDays.add(point.day);
        const dupe = await ctx.db
          .query("priceSnapshots")
          .withIndex("byVariantDay", (q) => q.eq("variantId", variantId).eq("day", point.day))
          .unique();
        if (!dupe) await ctx.db.insert("priceSnapshots", { variantId, price: point.price, day: point.day });
      }
    }
    return cardId;
  },
});

/**
 * The nightly refresh worklist, in priority order (PRD FR-005): variants
 * referenced by holdings, then watchlist, then cards viewed in the last
 * 7 days, then stalest first. Holdings and watchlist tables arrive in
 * Phases 2 and 3; their rungs activate when the tables exist. Deduped,
 * capped at `limit`.
 */
export const refreshCandidates = internalQuery({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const ids: string[] = [];
    const seen = new Set<string>();
    const push = (justTcgVariantId: string) => {
      if (ids.length < limit && !seen.has(justTcgVariantId)) {
        seen.add(justTcgVariantId);
        ids.push(justTcgVariantId);
      }
    };

    // Rung 1 (holdings) and rung 2 (watchlist): wired in Phases 2 and 3.

    // Rung 3: variants of cards viewed in the last 7 days.
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const viewed = await ctx.db
      .query("cards")
      .withIndex("byLastViewed", (q) => q.gte("lastViewedAt", weekAgo))
      .take(500);
    for (const card of viewed) {
      const variants = await ctx.db
        .query("variants")
        .withIndex("byCard", (q) => q.eq("cardId", card._id))
        .collect();
      for (const variant of variants) push(variant.justTcgVariantId);
    }

    // Rung 4: stalest first, until the cap.
    if (ids.length < limit) {
      const stalest = await ctx.db
        .query("variants")
        .withIndex("byLastUpdated")
        .order("asc")
        .take(limit);
      for (const variant of stalest) push(variant.justTcgVariantId);
    }
    return ids;
  },
});
