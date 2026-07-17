import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { utcDay } from "./lib/budget";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Fills an anonymous demo account with a sample collection so the portfolio,
 * watchlist, alerts, and notifications surfaces all have life in them.
 * Idempotence is marker-based (users.demoSeededAt), not holdings-based:
 * legacy demo accounts that collected a stray card or two before seeding
 * existed still get topped up to the full demo shape, and holdings missing
 * a cost basis are healed so the P&L tiles never sit empty. Only runs for
 * anonymous users; real accounts are never touched.
 */
export const ensureDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");
    const user = await ctx.db.get(userId);
    if (!user?.isAnonymous) return "not-a-demo-account";
    // Demo identity: name + the bundled avatar (also healed on revisit).
    const identity: { name?: string; image?: string } = {};
    if (!user.name) identity.name = "Demo Collector";
    if (!user.image) identity.image = "/avatar.webp";
    if (Object.keys(identity).length > 0) await ctx.db.patch(userId, identity);
    if (user.demoSeededAt) return "already-seeded";

    // Pre-existing state (legacy demo accounts): keep the user's cards, but
    // heal any missing cost basis so the P&L surfaces read.
    const existingHoldings = await ctx.db
      .query("holdings")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    const heldCards = new Set<string>();
    for (const holding of existingHoldings) {
      const variant = await ctx.db.get(holding.variantId);
      if (variant) heldCards.add(variant.cardId);
      if (holding.costBasisPerCard == null && variant) {
        const price = variant.currentPrice ?? 5;
        await ctx.db.patch(holding._id, {
          costBasisPerCard: Math.round(price * 0.8 * 100) / 100,
        });
      }
    }

    // Build a believable, good-looking collection: prefer cards with real
    // images, spread across games, in a $3-$1,500 band, one variant per card.
    const recent = await ctx.db
      .query("variants")
      .withIndex("byLastUpdated")
      .order("desc")
      .take(400);
    const priced = recent.filter((v) => (v.currentPrice ?? 0) >= 3 && (v.currentPrice ?? 0) <= 1500);
    const withCards: Array<{ variant: (typeof priced)[number]; hasImage: boolean; gameId: string }> = [];
    for (const variant of priced) {
      const card = await ctx.db.get(variant.cardId);
      if (!card) continue;
      withCards.push({ variant, hasImage: !!card.imageUrl, gameId: card.gameId });
    }
    withCards.sort(
      (a, b) =>
        Number(b.hasImage) - Number(a.hasImage) ||
        (b.variant.currentPrice ?? 0) - (a.variant.currentPrice ?? 0)
    );
    const seenCards = new Set<string>(heldCards);
    const perGame = new Map<string, number>();
    const picks: typeof priced = [];
    const seedTarget = Math.max(0, 12 - existingHoldings.length);
    for (const { variant, gameId } of withCards) {
      if (picks.length >= seedTarget) break;
      if (seenCards.has(variant.cardId)) continue;
      if ((perGame.get(gameId) ?? 0) >= 3) continue;
      seenCards.add(variant.cardId);
      perGame.set(gameId, (perGame.get(gameId) ?? 0) + 1);
      picks.push(variant);
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

    // Watchlist: top up to five distinct cards (imaged ones first), skipping
    // anything already held or already watched.
    const existingWatch = await ctx.db
      .query("watchlist")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    for (const row of existingWatch) seenCards.add(row.cardId);
    let watched = existingWatch.length;
    for (const { variant } of withCards) {
      if (watched >= 5) break;
      if (seenCards.has(variant.cardId)) continue;
      seenCards.add(variant.cardId);
      await ctx.db.insert("watchlist", { userId, cardId: variant.cardId });
      watched++;
    }

    // A couple of live alerts on the biggest seeded holdings (only if the
    // account has none, so we never pile onto a user's own alerts).
    const existingAlert = await ctx.db
      .query("alerts")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .first();
    if (!existingAlert) {
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
    }

    // Backfill 90 days of portfolio snapshots so the value chart draws
    // immediately instead of waiting for the nightly cron. A gentle upward
    // random walk that ends exactly at today's real totals (all holdings,
    // pre-existing ones included). Skipped if history already exists.
    const existingSnapshot = await ctx.db
      .query("portfolioSnapshots")
      .withIndex("byUserDay", (q) => q.eq("userId", userId))
      .first();
    if (!existingSnapshot) {
      let totalValue = 0;
      let costBasis = 0;
      for (let i = 0; i < picks.length; i++) {
        const qty = quantities[i] ?? 1;
        totalValue += (picks[i].currentPrice ?? 5) * qty;
        costBasis += (picks[i].currentPrice ?? 5) * (0.65 + (i % 5) * 0.08) * qty;
      }
      for (const holding of existingHoldings) {
        const variant = await ctx.db.get(holding.variantId);
        const price = variant?.currentPrice ?? 5;
        totalValue += price * holding.quantity;
        costBasis += (holding.costBasisPerCard ?? price * 0.8) * holding.quantity;
      }
      costBasis = Math.round(costBasis * 100) / 100;
      const days = 90;
      const values: number[] = [totalValue];
      for (let i = 1; i <= days; i++) {
        const prev = values[i - 1];
        // walking backwards in time: mostly drift down with noise
        const step = 1 - 0.0022 + (Math.random() - 0.5) * 0.012;
        values.push(prev * step);
      }
      for (let i = days; i >= 0; i--) {
        await ctx.db.insert("portfolioSnapshots", {
          userId,
          totalValue: Math.round(values[i] * 100) / 100,
          costBasis,
          day: utcDay(now - i * DAY),
        });
      }
    }

    const hasWelcome = await ctx.db
      .query("notifications")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .first();
    if (!hasWelcome) {
      await ctx.db.insert("notifications", {
        userId,
        kind: "system" as const,
        title: "Welcome to the Kiri demo",
        body: "This anonymous account comes pre-filled with a sample collection. Add, remove, and alert on cards freely.",
        read: false,
      });
    }
    await ctx.db.patch(userId, { demoSeededAt: now });
    return existingHoldings.length > 0 ? "topped-up" : "seeded";
  },
});
