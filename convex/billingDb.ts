import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/** Record a webhook event id; returns false if we've already seen it. */
export const recordEvent = internalMutation({
  args: { eventId: v.string() },
  handler: async (ctx, { eventId }) => {
    const seen = await ctx.db
      .query("webhookEvents")
      .withIndex("byEventId", (q) => q.eq("eventId", eventId))
      .unique();
    if (seen) return false;
    await ctx.db.insert("webhookEvents", { provider: "polar", eventId });
    return true;
  },
});

/**
 * Apply a Polar subscription lifecycle event to the user's tier.
 * The user is found by checkout metadata userId, then polarCustomerId,
 * then email. Cancellations keep the tier until revoked (period end).
 */
export const applySubscription = internalMutation({
  args: {
    eventType: v.string(),
    userId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    tier: v.optional(v.union(v.literal("trader"), v.literal("dealer"))),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { eventType, userId, customerId, customerEmail, subscriptionId, tier, status }) => {
    let user = null;
    if (userId) user = await ctx.db.get(userId as Id<"users">).catch(() => null);
    if (!user && customerId) {
      user = await ctx.db
        .query("users")
        .withIndex("byPolarCustomer", (q) => q.eq("polarCustomerId", customerId))
        .unique();
    }
    if (!user && customerEmail) {
      user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", customerEmail))
        .unique();
    }
    if (!user) {
      console.error(`polar webhook: no user match (${eventType}, customer ${customerId})`);
      return { applied: false };
    }

    if (eventType === "subscription.revoked") {
      await ctx.db.patch(user._id, { tier: "free", polarSubscriptionId: undefined });
      return { applied: true, tier: "free" };
    }
    if (eventType === "subscription.canceled") {
      // Takes effect at period end; the revoked event flips the tier.
      console.warn(`polar: subscription canceled for ${user.email}, tier holds until period end`);
      return { applied: true };
    }
    // active / updated / checkout paid
    if (tier && (status === undefined || status === "active" || status === "trialing")) {
      await ctx.db.patch(user._id, {
        tier,
        polarCustomerId: customerId ?? user.polarCustomerId,
        polarSubscriptionId: subscriptionId ?? user.polarSubscriptionId,
      });
      return { applied: true, tier };
    }
    return { applied: false };
  },
});
