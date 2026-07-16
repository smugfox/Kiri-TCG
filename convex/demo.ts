import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Fills a fresh anonymous demo account with a sample collection so the
 * portfolio, watchlist, alerts, and notifications surfaces all have life
 * in them. Idempotent: a demo account that already has holdings is left
 * alone. Only runs for anonymous users; real accounts are never touched.
 */
export const ensureDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");
    const user = await ctx.db.get(userId);
    if (!user?.isAnonymous) return "not-a-demo-account";
    const existing = await ctx.db
      .query("holdings")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .first();
    if (existing) return "already-seeded";
    if (!user.name) await ctx.db.patch(userId, { name: "Demo Collector" });

    // Prefer recently priced variants, one per distinct card.
    const recent = await ctx.db
      .query("variants")
      .withIndex("byLastUpdated")
      .order("desc")
      .take(300);
    const priced = recent.filter((v) => (v.currentPrice ?? 0) > 1);
    const seenCards = new Set<string>();
    const picks: typeof priced = [];
    for (const variant of priced) {
      if (seenCards.has(variant.cardId)) continue;
      seenCards.add(variant.cardId);
      picks.push(variant);
      if (picks.length >= 12) break;
    }

    const now = Date.now();
    const quantities = [1, 1, 2, 1, 3, 1, 1, 4, 1, 2, 1, 1];
    for (let i = 0; i < picks.length; i++) {
      const variant = picks[i];
      const price = variant.currentPrice ?? 5;
      await ctx.db.insert("holdings", {
        userId,
        variantId: variant._id,
        quantity: quantities[i] ?? 1,
        // bought below current price so the demo shows healthy unrealized P&L
        costBasisPerCard: Math.round(price * (0.65 + (i % 5) * 0.08) * 100) / 100,
        acquiredAt: now - (30 + i * 17) * DAY,
      });
    }

    // Watchlist: the next five distinct cards.
    let watched = 0;
    for (const variant of priced) {
      if (seenCards.has(variant.cardId)) continue;
      seenCards.add(variant.cardId);
      await ctx.db.insert("watchlist", { userId, cardId: variant.cardId });
      if (++watched >= 5) break;
    }

    // A couple of live alerts on the biggest holdings.
    for (const variant of picks.slice(0, 2)) {
      const price = variant.currentPrice ?? 5;
      await ctx.db.insert("alerts", {
        userId,
        variantId: variant._id,
        direction: "above" as const,
        threshold: Math.round(price * 1.15 * 100) / 100,
        active: true,
      });
    }

    await ctx.db.insert("notifications", {
      userId,
      kind: "system" as const,
      title: "Welcome to the Kiri demo",
      body: "This anonymous account comes pre-filled with a sample collection. Add, remove, and alert on cards freely.",
      read: false,
    });
    return "seeded";
  },
});
