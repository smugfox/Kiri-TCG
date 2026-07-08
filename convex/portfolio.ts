import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { requireUser } from "./lib/access";
import { utcDay } from "./lib/budget";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";

/** Shared valuation walk over a user's holdings. */
async function computeTotals(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  const rows = await ctx.db
    .query("holdings")
    .withIndex("byUser", (q) => q.eq("userId", userId))
    .collect();

  let totalValue = 0;
  let costBasis = 0; // over priced rows with a basis, for P&L percent
  let plBaseValue = 0;
  let cardCount = 0;
  let excludedCount = 0;
  const byGame = new Map<Id<"games">, number>();
  let topMover: {
    variant: Doc<"variants">;
    card: Doc<"cards">;
    weight: number;
    value: number;
  } | null = null;

  for (const holding of rows) {
    const variant = await ctx.db.get(holding.variantId);
    if (!variant) continue;
    const card = await ctx.db.get(variant.cardId);
    if (!card) continue;
    cardCount += holding.quantity;
    if (variant.currentPrice === undefined) {
      // PRD edge case: no-price variants are excluded from totals, counted honestly.
      excludedCount += holding.quantity;
      continue;
    }
    const value = variant.currentPrice * holding.quantity;
    totalValue += value;
    byGame.set(card.gameId, (byGame.get(card.gameId) ?? 0) + value);
    if (holding.costBasisPerCard !== undefined) {
      costBasis += holding.costBasisPerCard * holding.quantity;
      plBaseValue += value;
    }
    const weight = Math.abs(variant.change7d ?? 0) * value;
    if (weight > 0 && (!topMover || weight > topMover.weight)) {
      topMover = { variant, card, weight, value };
    }
  }
  return { rows, totalValue, costBasis, plBaseValue, cardCount, excludedCount, byGame, topMover };
}

export const summary = query({
  args: {},
  handler: async (ctx) => {
    const { userId, user } = await requireUser(ctx);
    const totals = await computeTotals(ctx, userId);
    const { totalValue, costBasis, plBaseValue, cardCount, excludedCount, byGame, topMover } = totals;

    // Day change vs the most recent snapshot from a previous day.
    const today = utcDay();
    const snapshots = await ctx.db
      .query("portfolioSnapshots")
      .withIndex("byUserDay", (q) => q.eq("userId", userId).lt("day", today))
      .order("desc")
      .take(1);
    const previous = snapshots[0] ?? null;
    const dayChangeValue = previous ? totalValue - previous.totalValue : null;
    const dayChangePercent =
      previous && previous.totalValue > 0 && dayChangeValue !== null
        ? (dayChangeValue / previous.totalValue) * 100
        : null;

    const unrealizedPl = plBaseValue - costBasis;
    const games = await ctx.db.query("games").collect();
    const allocation = [...byGame.entries()]
      .map(([gameId, value]) => {
        const game = games.find((g) => g._id === gameId);
        return {
          gameSlug: game?.slug ?? "",
          gameName: game?.name ?? "",
          value,
          percent: totalValue > 0 ? (value / totalValue) * 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value);

    let topMoverOut = null;
    if (topMover) {
      const spark = await ctx.db
        .query("priceSnapshots")
        .withIndex("byVariantDay", (q) => q.eq("variantId", topMover.variant._id))
        .order("desc")
        .take(30);
      topMoverOut = {
        name: topMover.card.name,
        gameSlug: games.find((g) => g._id === topMover.card.gameId)?.slug ?? "",
        slug: topMover.card.slug,
        change7d: topMover.variant.change7d ?? 0,
        value: topMover.value,
        sparkline: spark.map((s) => s.price).reverse(),
      };
    }

    return {
      totalValue,
      costBasis: costBasis > 0 ? costBasis : null,
      unrealizedPl: costBasis > 0 ? unrealizedPl : null,
      plPercent: costBasis > 0 ? (unrealizedPl / costBasis) * 100 : null,
      dayChangeValue,
      dayChangePercent,
      cardCount,
      excludedCount,
      allocation,
      topMover: topMoverOut,
      holdingsRows: totals.rows.length,
      onboardingDismissed: user.onboardingDismissed ?? false,
    };
  },
});

export const history = query({
  args: {
    range: v.union(v.literal("7d"), v.literal("30d"), v.literal("90d"), v.literal("1y"), v.literal("all")),
  },
  handler: async (ctx, { range }) => {
    const { userId } = await requireUser(ctx);
    const days = { "7d": 7, "30d": 30, "90d": 90, "1y": 365, all: 730 }[range];
    const from = utcDay(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await ctx.db
      .query("portfolioSnapshots")
      .withIndex("byUserDay", (q) => q.eq("userId", userId).gte("day", from))
      .collect();
    return rows
      .map(({ day, totalValue }) => ({ day, price: totalValue }))
      .sort((a, b) => (a.day < b.day ? -1 : 1));
  },
});

/**
 * Nightly per-user portfolio snapshot (07:00 UTC, after prices refresh).
 * Skips users with zero holdings; one row per user per day, idempotent.
 */
export const snapshotAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const day = utcDay();
    const users = await ctx.db.query("users").collect();
    let written = 0;
    for (const user of users) {
      const anyHolding = await ctx.db
        .query("holdings")
        .withIndex("byUser", (q) => q.eq("userId", user._id))
        .first();
      if (!anyHolding) continue;
      const existing = await ctx.db
        .query("portfolioSnapshots")
        .withIndex("byUserDay", (q) => q.eq("userId", user._id).eq("day", day))
        .unique();
      if (existing) continue;
      const { totalValue, costBasis } = await computeTotals(ctx, user._id);
      await ctx.db.insert("portfolioSnapshots", { userId: user._id, totalValue, costBasis, day });
      written++;
    }
    return { written, day };
  },
});
