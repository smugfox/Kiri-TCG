import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * One-time cleanup for the portfolio-prototype pivot: removes every card,
 * variant, set, and dependent row that came from the old JustTCG sync,
 * leaving only the curated demo catalog (rows keyed "demo-*", seeded by
 * demoCatalog:seedAll). Users are kept; demo accounts re-seed themselves.
 *
 * Run with: npx convex run demoPurge:purgeAll
 */
export const purgeCardsBatch = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cards = await ctx.db.query("cards").take(5);
    let purged = 0;
    for (const card of cards) {
      if (card.justTcgCardId.startsWith("demo-")) continue;
      const variants = await ctx.db
        .query("variants")
        .withIndex("byCard", (q) => q.eq("cardId", card._id))
        .collect();
      for (const variant of variants) {
        for (const row of await ctx.db.query("priceSnapshots").withIndex("byVariantDay", (q) => q.eq("variantId", variant._id)).collect()) {
          await ctx.db.delete(row._id);
        }
        for (const row of await ctx.db.query("holdings").withIndex("byVariant", (q) => q.eq("variantId", variant._id)).collect()) {
          await ctx.db.delete(row._id);
        }
        for (const row of await ctx.db.query("alerts").withIndex("byVariantActive", (q) => q.eq("variantId", variant._id)).collect()) {
          await ctx.db.delete(row._id);
        }
        await ctx.db.delete(variant._id);
      }
      for (const row of await ctx.db.query("watchlist").withIndex("byCard", (q) => q.eq("cardId", card._id)).collect()) {
        await ctx.db.delete(row._id);
      }
      await ctx.db.delete(card._id);
      purged++;
    }
    return { scanned: cards.length, purged };
  },
});

export const purgeSetsBatch = internalMutation({
  args: {},
  handler: async (ctx) => {
    const sets = await ctx.db.query("sets").take(200);
    let purged = 0;
    for (const set of sets) {
      if (set.justTcgSetId.startsWith("demo-")) continue;
      await ctx.db.delete(set._id);
      purged++;
    }
    return { scanned: sets.length, purged };
  },
});

export const purgeAll = internalAction({
  args: {},
  handler: async (ctx) => {
    let cardsPurged = 0;
    for (let i = 0; i < 2000; i++) {
      const res: { scanned: number; purged: number } = await ctx.runMutation(internal.demoPurge.purgeCardsBatch, {});
      cardsPurged += res.purged;
      if (res.purged === 0) break;
    }
    let setsPurged = 0;
    for (let i = 0; i < 50; i++) {
      const res: { scanned: number; purged: number } = await ctx.runMutation(internal.demoPurge.purgeSetsBatch, {});
      setsPurged += res.purged;
      if (res.purged === 0) break;
    }
    return { cardsPurged, setsPurged };
  },
});
