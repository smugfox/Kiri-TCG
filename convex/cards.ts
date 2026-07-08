import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { BACKFILL_TRIGGERS_PER_HOUR, utcHour } from "./lib/budget";
import type { Doc } from "./_generated/dataModel";

/** English NM/Normal first, then any English NM, then whatever has a price. */
function headlineVariant(variants: Doc<"variants">[]) {
  const english = variants.filter((x) => (x.language ?? "English") === "English");
  const pool = english.length > 0 ? english : variants;
  return (
    pool.find((x) => x.condition === "NM" && x.printing === "Normal") ??
    pool.find((x) => x.condition === "NM") ??
    pool.find((x) => x.currentPrice !== undefined) ??
    pool[0]
  );
}

export const search = query({
  args: {
    q: v.string(),
    game: v.optional(v.id("games")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { q, game, paginationOpts }) => {
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) {
      return { page: [], isDone: true, continueCursor: "" };
    }
    const results = await ctx.db
      .query("cards")
      .withSearchIndex("search", (s) => {
        const withText = s.search("searchText", trimmed);
        return game ? withText.eq("gameId", game) : withText;
      })
      .paginate(paginationOpts);

    const games = await ctx.db.query("games").collect();
    const gameSlugById = new Map(games.map((g) => [g._id, g.slug]));

    const page = await Promise.all(
      results.page.map(async (card) => {
        const variants = await ctx.db
          .query("variants")
          .withIndex("byCard", (x) => x.eq("cardId", card._id))
          .collect();
        const headline = headlineVariant(variants);
        return {
          _id: card._id,
          name: card.name,
          setName: card.setName,
          number: card.number,
          rarityTier: card.rarityTier,
          slug: card.slug,
          gameSlug: gameSlugById.get(card.gameId) ?? "",
          imageUrl: card.imageUrl,
          headline:
            headline?.currentPrice !== undefined
              ? { price: headline.currentPrice, change7d: headline.change7d ?? null }
              : null,
        };
      }),
    );
    return { ...results, page };
  },
});

/**
 * A search came back empty: pull the query from JustTCG in the background.
 * Mutation rather than query because scheduling is a write. Per-user hourly
 * cap keeps one user from draining the shared backfill pool (PRD § Security).
 */
export const requestBackfill = mutation({
  args: {
    q: v.optional(v.string()),
    gameSlug: v.optional(v.string()),
    setId: v.optional(v.string()), // JustTCG set id: pulls a set's first cards
  },
  handler: async (ctx, { q, gameSlug, setId }) => {
    const trimmed = (q ?? "").trim();
    if (trimmed.length < 3 && !setId) return { scheduled: false };

    const userId = await getAuthUserId(ctx);
    const key = userId ?? "anon";
    const hour = utcHour();
    const row = await ctx.db
      .query("backfillTriggers")
      .withIndex("byKeyHour", (x) => x.eq("key", key).eq("hour", hour))
      .unique();
    if ((row?.count ?? 0) >= BACKFILL_TRIGGERS_PER_HOUR) {
      throw new ConvexError({
        code: "RATE_LIMITED",
        message: "You've reached this hour's limit for new-card lookups. Try again in a bit.",
      });
    }
    if (row) await ctx.db.patch(row._id, { count: row.count + 1 });
    else await ctx.db.insert("backfillTriggers", { key, hour, count: 1 });

    await ctx.scheduler.runAfter(0, internal.sync.searchBackfill, {
      q: trimmed || undefined,
      gameSlug,
      setId,
    });
    return { scheduled: true };
  },
});

/** Cached-catalog browse: newest-synced first, optional game and set facets. */
export const browse = query({
  args: {
    game: v.optional(v.id("games")),
    setName: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { game, setName, paginationOpts }) => {
    const results =
      game && setName
        ? await ctx.db
            .query("cards")
            .withIndex("byGameSet", (x) => x.eq("gameId", game).eq("setName", setName))
            .order("desc")
            .paginate(paginationOpts)
        : game
          ? await ctx.db
              .query("cards")
              .withIndex("byGameSlug", (x) => x.eq("gameId", game))
              .order("desc")
              .paginate(paginationOpts)
          : await ctx.db.query("cards").order("desc").paginate(paginationOpts);

    const games = await ctx.db.query("games").collect();
    const gameSlugById = new Map(games.map((g) => [g._id, g.slug]));
    const page = await Promise.all(
      results.page.map(async (card) => {
        const variants = await ctx.db
          .query("variants")
          .withIndex("byCard", (x) => x.eq("cardId", card._id))
          .collect();
        const headline = headlineVariant(variants);
        return {
          _id: card._id,
          name: card.name,
          setName: card.setName,
          number: card.number,
          rarityTier: card.rarityTier,
          slug: card.slug,
          gameSlug: gameSlugById.get(card.gameId) ?? "",
          imageUrl: card.imageUrl,
          headline:
            headline?.currentPrice !== undefined
              ? { price: headline.currentPrice, change7d: headline.change7d ?? null }
              : null,
        };
      }),
    );
    return { ...results, page };
  },
});

/**
 * The full set catalog for a game (seeded from JustTCG /sets) merged with
 * cached-card counts. Cached-only sets (e.g. Japanese catalogs we haven't
 * seeded) still appear. `count` is how many of that set's cards we cache.
 */
export const listSets = query({
  args: { game: v.id("games") },
  handler: async (ctx, { game }) => {
    const cards = await ctx.db
      .query("cards")
      .withIndex("byGameSlug", (x) => x.eq("gameId", game))
      .collect();
    const cached = new Map<string, number>();
    for (const card of cards) {
      cached.set(card.setName, (cached.get(card.setName) ?? 0) + 1);
    }
    const catalog = await ctx.db
      .query("sets")
      .withIndex("byGame", (x) => x.eq("gameId", game))
      .collect();
    const out = new Map<
      string,
      { setName: string; count: number; totalCards?: number; justTcgSetId?: string }
    >();
    for (const set of catalog) {
      out.set(set.name, {
        setName: set.name,
        count: cached.get(set.name) ?? 0,
        totalCards: set.cardsCount,
        justTcgSetId: set.justTcgSetId,
      });
    }
    for (const [setName, count] of cached) {
      if (!out.has(setName)) out.set(setName, { setName, count });
    }
    return [...out.values()].sort((a, b) => a.setName.localeCompare(b.setName));
  },
});

/** The four games for facet UI. */
export const listGames = query({
  args: {},
  handler: async (ctx) => {
    const games = await ctx.db.query("games").collect();
    return games.map(({ _id, slug, name }) => ({ _id, slug, name }));
  },
});

export const getBySlug = query({
  args: { gameSlug: v.string(), slug: v.string() },
  handler: async (ctx, { gameSlug, slug }) => {
    const game = await ctx.db
      .query("games")
      .withIndex("slug", (x) => x.eq("slug", gameSlug))
      .unique();
    if (!game) return null;
    const card = await ctx.db
      .query("cards")
      .withIndex("byGameSlug", (x) => x.eq("gameId", game._id).eq("slug", slug))
      .unique();
    if (!card) return null;
    const variants = await ctx.db
      .query("variants")
      .withIndex("byCard", (x) => x.eq("cardId", card._id))
      .collect();
    return { card, game: { slug: game.slug, name: game.name }, variants };
  },
});

/** Card-page view touch; feeds the nightly refresh priority (viewed-this-week). */
export const touchViewed = mutation({
  args: { cardId: v.id("cards") },
  handler: async (ctx, { cardId }) => {
    const card = await ctx.db.get(cardId);
    if (card) await ctx.db.patch(cardId, { lastViewedAt: Date.now() });
  },
});
