import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser, FREE_LIMITS } from "./lib/access";

/** The signed-in user, or null. Nav and settings read this. */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name ?? null,
      email: user.email ?? null,
      image: user.image ?? null,
      tier: user.tier ?? "free",
      emailAlertsEnabled: user.emailAlertsEnabled ?? true,
      polarCustomerId: user.polarCustomerId ?? null,
    };
  },
});

export const updateProfile = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const { userId } = await requireUser(ctx);
    const trimmed = name.trim().slice(0, 80);
    if (!trimmed) {
      throw new ConvexError({ code: "BAD_REQUEST", message: "Name can't be empty." });
    }
    await ctx.db.patch(userId, { name: trimmed });
  },
});

export const setEmailAlerts = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, { enabled }) => {
    const { userId } = await requireUser(ctx);
    await ctx.db.patch(userId, { emailAlertsEnabled: enabled });
  },
});

/**
 * Hard delete per PRD: all six user-owned tables, then the auth rows. The
 * Polar subscription (if any) is canceled by the caller action first.
 */
export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx);
    // TS narrows per-table; a union-typed loop doesn't.
    for (const row of await ctx.db.query("holdings").withIndex("byUser", (q) => q.eq("userId", userId)).collect()) await ctx.db.delete(row._id);
    for (const row of await ctx.db.query("watchlist").withIndex("byUser", (q) => q.eq("userId", userId)).collect()) await ctx.db.delete(row._id);
    for (const row of await ctx.db.query("alerts").withIndex("byUser", (q) => q.eq("userId", userId)).collect()) await ctx.db.delete(row._id);
    for (const row of await ctx.db.query("notifications").withIndex("byUser", (q) => q.eq("userId", userId)).collect()) await ctx.db.delete(row._id);
    for (const row of await ctx.db.query("portfolioSnapshots").withIndex("byUserDay", (q) => q.eq("userId", userId)).collect()) await ctx.db.delete(row._id);
    // Auth bookkeeping rows, then the user itself.
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) await ctx.db.delete(account._id);
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) await ctx.db.delete(session._id);
    await ctx.db.delete(userId);
  },
});

export const dismissOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx);
    await ctx.db.patch(userId, { onboardingDismissed: true });
  },
});

/** Live usage against the free caps, for the settings billing card. */
export const usage = query({
  args: {},
  handler: async (ctx) => {
    const { userId, user } = await requireUser(ctx);
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    const alerts = await ctx.db
      .query("alerts")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();
    const tier = user.tier ?? "free";
    return {
      tier,
      holdingsRows: holdings.length,
      activeAlerts: alerts.filter((a) => a.active).length,
      holdingsCap: tier === "free" ? FREE_LIMITS.holdings : null,
      alertsCap: tier === "free" ? FREE_LIMITS.alerts : null,
    };
  },
});
