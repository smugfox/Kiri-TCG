import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireUser, requireCapacity } from "./lib/access";

const MIN_THRESHOLD = 0.01;
const MAX_THRESHOLD = 100_000;

function validateThreshold(threshold: number) {
  if (!Number.isFinite(threshold) || threshold < MIN_THRESHOLD || threshold > MAX_THRESHOLD) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: "Alert thresholds run from $0.01 to $100,000.",
    });
  }
}

export const create = mutation({
  args: {
    variantId: v.id("variants"),
    direction: v.union(v.literal("above"), v.literal("below")),
    threshold: v.number(),
  },
  handler: async (ctx, { variantId, direction, threshold }) => {
    const { userId, user } = await requireUser(ctx);
    validateThreshold(threshold);
    const variant = await ctx.db.get(variantId);
    if (!variant) throw new ConvexError({ code: "NOT_FOUND", message: "That printing no longer exists." });
    await requireCapacity(ctx, "alerts", userId, user);
    const alertId = await ctx.db.insert("alerts", {
      userId,
      variantId,
      direction,
      threshold,
      active: true,
    });
    return { alertId };
  },
});

export const update = mutation({
  args: {
    alertId: v.id("alerts"),
    threshold: v.optional(v.number()),
    direction: v.optional(v.union(v.literal("above"), v.literal("below"))),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, { alertId, threshold, direction, active }) => {
    const { userId, user } = await requireUser(ctx);
    const alert = await ctx.db.get(alertId);
    if (!alert || alert.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "That alert isn't yours to change." });
    }
    if (threshold !== undefined) validateThreshold(threshold);
    // Re-activating counts against the free cap like creating does.
    if (active === true && !alert.active) {
      await requireCapacity(ctx, "alerts", userId, user);
    }
    await ctx.db.patch(alertId, {
      ...(threshold !== undefined ? { threshold } : {}),
      ...(direction !== undefined ? { direction } : {}),
      ...(active !== undefined ? { active } : {}),
      // Changing the terms re-arms the crossing guard.
      ...(threshold !== undefined || direction !== undefined
        ? { lastFiredAt: undefined, lastFiredPrice: undefined }
        : {}),
    });
  },
});

export const remove = mutation({
  args: { alertId: v.id("alerts") },
  handler: async (ctx, { alertId }) => {
    const { userId } = await requireUser(ctx);
    const alert = await ctx.db.get(alertId);
    if (!alert || alert.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "That alert isn't yours to remove." });
    }
    await ctx.db.delete(alertId);
  },
});

/** All of the user's alerts, joined with card + variant for the table. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx);
    const alerts = await ctx.db
      .query("alerts")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    const games = await ctx.db.query("games").collect();
    const gameSlugById = new Map(games.map((g) => [g._id, g.slug]));
    const rows = await Promise.all(
      alerts.map(async (alert) => {
        const variant = await ctx.db.get(alert.variantId);
        if (!variant) return null;
        const card = await ctx.db.get(variant.cardId);
        if (!card) return null;
        return {
          _id: alert._id,
          direction: alert.direction,
          threshold: alert.threshold,
          active: alert.active,
          lastFiredAt: alert.lastFiredAt,
          lastFiredPrice: alert.lastFiredPrice,
          variantId: variant._id,
          condition: variant.condition,
          printing: variant.printing,
          language: variant.language ?? "English",
          currentPrice: variant.currentPrice,
          card: {
            name: card.name,
            setName: card.setName,
            slug: card.slug,
            gameSlug: gameSlugById.get(card.gameId) ?? "",
            rarityTier: card.rarityTier,
          },
        };
      }),
    );
    return rows.filter((r) => r !== null);
  },
});

/** The user's alert on one variant, for the card-page row. */
export const forVariant = query({
  args: { variantId: v.id("variants") },
  handler: async (ctx, { variantId }) => {
    const { userId } = await requireUser(ctx);
    const alerts = await ctx.db
      .query("alerts")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    return alerts.find((a) => a.variantId === variantId) ?? null;
  },
});

/**
 * Nightly evaluation, 06:45 UTC (after snapshots). Crossing semantics per
 * PRD: "above" fires at ≥ threshold, "below" at ≤, and once fired the alert
 * stays quiet while the condition persists (lastFiredPrice guard); it
 * re-arms when price returns to the allowed side. In-app notification is
 * created regardless of email settings; email is scheduled separately.
 */
export const evaluate = internalMutation({
  args: {},
  handler: async (ctx) => {
    const alerts = await ctx.db.query("alerts").collect();
    let fired = 0;
    for (const alert of alerts) {
      if (!alert.active) continue;
      const variant = await ctx.db.get(alert.variantId);
      if (!variant || variant.currentPrice === undefined) continue;
      const price = variant.currentPrice;
      const crossed =
        alert.direction === "above" ? price >= alert.threshold : price <= alert.threshold;

      if (!crossed) {
        // Condition cleared: re-arm so the next crossing fires again.
        if (alert.lastFiredAt !== undefined) {
          await ctx.db.patch(alert._id, { lastFiredAt: undefined, lastFiredPrice: undefined });
        }
        continue;
      }
      // Persisting condition: fired before and never re-armed → stay quiet.
      if (alert.lastFiredAt !== undefined) continue;

      const card = await ctx.db.get(variant.cardId);
      if (!card) continue;
      await ctx.db.patch(alert._id, { lastFiredAt: Date.now(), lastFiredPrice: price });
      const dollars = (n: number) => `$${n.toFixed(2)}`;
      // Title and body render as separate lines in the panel; the body
      // never repeats the name.
      await ctx.db.insert("notifications", {
        userId: alert.userId,
        kind: "alert",
        title: card.name,
        body: `${alert.direction === "above" ? "Passed" : "Fell below"} your ${dollars(alert.threshold)} alert · now ${dollars(price)}`,
        cardId: card._id,
        read: false,
      });
      const user = await ctx.db.get(alert.userId);
      if (user && (user.emailAlertsEnabled ?? true) && user.email) {
        const games = await ctx.db.query("games").collect();
        const gameSlug = games.find((g) => g._id === card.gameId)?.slug ?? "";
        await ctx.scheduler.runAfter(0, internal.emails.sendAlertEmail, {
          to: user.email,
          cardName: card.name,
          setName: card.setName,
          direction: alert.direction,
          threshold: alert.threshold,
          price,
          cardPath: `/cards/${gameSlug}/${card.slug}`,
        });
      }
      fired++;
    }
    return { fired, scanned: alerts.length };
  },
});
