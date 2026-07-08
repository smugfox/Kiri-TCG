import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./lib/access";

export const toggle = mutation({
  args: { cardId: v.id("cards") },
  handler: async (ctx, { cardId }) => {
    const { userId } = await requireUser(ctx);
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("byUserCard", (q) => q.eq("userId", userId).eq("cardId", cardId))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { watching: false };
    }
    const card = await ctx.db.get(cardId);
    if (!card) return { watching: false };
    await ctx.db.insert("watchlist", { userId, cardId });
    return { watching: true };
  },
});

export const isWatching = query({
  args: { cardId: v.id("cards") },
  handler: async (ctx, { cardId }) => {
    const { userId } = await requireUser(ctx);
    const row = await ctx.db
      .query("watchlist")
      .withIndex("byUserCard", (q) => q.eq("userId", userId).eq("cardId", cardId))
      .unique();
    return row !== null;
  },
});

/** Watched cards with 30-day NM/Normal sparkline data and delta. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx);
    const rows = await ctx.db
      .query("watchlist")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    const games = await ctx.db.query("games").collect();
    const gameSlugById = new Map(games.map((g) => [g._id, g.slug]));
    const out = await Promise.all(
      rows.map(async (row) => {
        const card = await ctx.db.get(row.cardId);
        if (!card) return null;
        const variants = await ctx.db
          .query("variants")
          .withIndex("byCard", (q) => q.eq("cardId", card._id))
          .collect();
        const english = variants.filter((x) => (x.language ?? "English") === "English");
        const pool = english.length > 0 ? english : variants;
        const headline =
          pool.find((x) => x.condition === "NM" && x.printing === "Normal") ??
          pool.find((x) => x.condition === "NM") ??
          pool.find((x) => x.currentPrice !== undefined) ??
          pool[0];
        const spark = headline
          ? await ctx.db
              .query("priceSnapshots")
              .withIndex("byVariantDay", (q) => q.eq("variantId", headline._id))
              .order("desc")
              .take(30)
          : [];
        return {
          _id: row._id,
          cardId: card._id,
          name: card.name,
          setName: card.setName,
          rarityTier: card.rarityTier,
          slug: card.slug,
          gameSlug: gameSlugById.get(card.gameId) ?? "",
          price: headline?.currentPrice,
          change7d: headline?.change7d ?? null,
          variantId: headline?._id ?? null,
          sparkline: spark.map((s) => s.price).reverse(),
        };
      }),
    );
    return out.filter((r) => r !== null);
  },
});
