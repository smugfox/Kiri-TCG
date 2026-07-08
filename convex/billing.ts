"use node";

import { ConvexError, v } from "convex/values";
import { Polar } from "@polar-sh/sdk";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Polar checkout + customer portal. Env (Convex):
 *   POLAR_ACCESS_TOKEN, POLAR_SANDBOX=true|false,
 *   POLAR_PRICE_TRADER_MONTH / _YEAR, POLAR_PRICE_DEALER_MONTH / _YEAR
 * Until the token is set, billing actions throw BILLING_NOT_CONFIGURED and
 * the UI says checkout isn't live yet.
 */

function polarClient(): Polar {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) {
    throw new ConvexError({
      code: "BILLING_NOT_CONFIGURED",
      message: "Checkout isn't live yet. Kiri is in beta; the free tier keeps working.",
    });
  }
  return new Polar({
    accessToken,
    server: process.env.POLAR_SANDBOX === "false" ? "production" : "sandbox",
  });
}

function productIdFor(plan: "trader" | "dealer", interval: "month" | "year"): string {
  const key = `POLAR_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`;
  const id = process.env[key];
  if (!id) {
    throw new ConvexError({
      code: "BILLING_NOT_CONFIGURED",
      message: "Checkout isn't live yet. Kiri is in beta; the free tier keeps working.",
    });
  }
  return id;
}

export const createCheckout = action({
  args: {
    plan: v.union(v.literal("trader"), v.literal("dealer")),
    interval: v.union(v.literal("month"), v.literal("year")),
  },
  handler: async (ctx, { plan, interval }): Promise<{ url: string }> => {
    const viewer = await ctx.runQuery(api.users.viewer, {});
    if (!viewer) throw new ConvexError({ code: "UNAUTHORIZED", message: "Sign in to upgrade." });
    const polar = polarClient();
    const siteUrl = process.env.SITE_URL ?? "http://localhost:3100";
    const checkout = await polar.checkouts.create({
      products: [productIdFor(plan, interval)],
      successUrl: `${siteUrl}/portfolio?upgraded=1`,
      customerEmail: viewer.email ?? undefined,
      metadata: { userId: viewer._id, plan },
    });
    return { url: checkout.url };
  },
});

export const createPortalSession = action({
  args: {},
  handler: async (ctx): Promise<{ url: string }> => {
    const viewer = await ctx.runQuery(api.users.viewer, {});
    if (!viewer) throw new ConvexError({ code: "UNAUTHORIZED", message: "Sign in first." });
    if (!viewer.polarCustomerId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "No subscription on this account yet." });
    }
    const polar = polarClient();
    const session = await polar.customerSessions.create({
      customerId: viewer.polarCustomerId,
    });
    return { url: session.customerPortalUrl };
  },
});

/** Account deletion: cancel any Polar subscription first, then hard-delete. */
export const cancelAndDeleteAccount = action({
  args: {},
  handler: async (ctx): Promise<{ deleted: boolean }> => {
    const viewer = await ctx.runQuery(api.users.viewer, {});
    if (!viewer) throw new ConvexError({ code: "UNAUTHORIZED", message: "Sign in first." });
    if (viewer.polarCustomerId && process.env.POLAR_ACCESS_TOKEN) {
      try {
        const polar = polarClient();
        const subs = await polar.subscriptions.list({ customerId: viewer.polarCustomerId, active: true });
        for await (const page of subs) {
          for (const sub of page.result.items) {
            await polar.subscriptions.revoke({ id: sub.id });
          }
        }
      } catch (err) {
        console.error(`polar: subscription cleanup failed during deletion: ${String(err)}`);
      }
    }
    await ctx.runMutation(api.users.deleteAccount, {});
    return { deleted: true };
  },
});
