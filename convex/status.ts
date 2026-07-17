import { internalQuery, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { utcDay } from "./lib/budget";

/**
 * Freshness of the signed-in user's owned + watched variants, for the
 * stale-data banner: hours since the oldest relevant price update.
 * Null when signed out or nothing is tracked.
 */
export const staleness = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Pipeline health, not market movement: measured by when WE last
    // synced each tracked card (cards.lastSyncedAt), not when its price
    // last changed upstream.
    const cardIds = new Set<string>();
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    for (const h of holdings) {
      const variant = await ctx.db.get(h.variantId);
      if (variant) cardIds.add(variant.cardId);
    }
    const watched = await ctx.db
      .query("watchlist")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    for (const w of watched) cardIds.add(w.cardId);
    if (cardIds.size === 0) return null;

    let oldest = Infinity;
    for (const id of cardIds) {
      const card = await ctx.db.get(id as never as import("./_generated/dataModel").Id<"cards">);
      if (card && card.lastSyncedAt < oldest) oldest = card.lastSyncedAt;
    }
    if (!Number.isFinite(oldest)) return null;
    return { oldestUpdateHoursAgo: (Date.now() - oldest) / 3_600_000 };
  },
});

/** Today's JustTCG budget usage; run via `npx convex run status:budget`. */
export const budget = internalQuery({
  args: {},
  handler: async (ctx) => {
    const day = utcDay();
    const row = await ctx.db
      .query("syncState")
      .withIndex("byDay", (q) => q.eq("day", day))
      .unique();
    return {
      day,
      nightlyUsed: row?.requestsUsed ?? 0,
      nightlyBudget: 90,
      backfillUsed: row?.backfillUsed ?? 0,
      backfillBudget: 10,
    };
  },
});
