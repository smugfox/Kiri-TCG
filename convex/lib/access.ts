import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

/** Free-tier caps (PRD FR-010). Trader and Dealer are unlimited. */
export const FREE_LIMITS = { holdings: 100, alerts: 1 } as const;

export async function requireUser(
  ctx: QueryCtx | MutationCtx,
): Promise<{ userId: Id<"users">; user: Doc<"users"> }> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError({ code: "UNAUTHORIZED", message: "Sign in to do that." });
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new ConvexError({ code: "UNAUTHORIZED", message: "Sign in to do that." });
  }
  return { userId, user };
}

/**
 * Enforce the free-tier cap before inserting a holdings row or activating an
 * alert. Throws LIMIT_REACHED with the designed copy; the client renders it
 * with the upgrade CTA.
 */
export async function requireCapacity(
  ctx: MutationCtx,
  kind: "holdings" | "alerts",
  userId: Id<"users">,
  user: Doc<"users">,
): Promise<void> {
  const tier = user.tier ?? "free";
  if (tier !== "free") return;

  if (kind === "holdings") {
    const rows = await ctx.db
      .query("holdings")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .take(FREE_LIMITS.holdings + 1);
    if (rows.length >= FREE_LIMITS.holdings) {
      throw new ConvexError({
        code: "LIMIT_REACHED",
        message: `The free tier tracks up to ${FREE_LIMITS.holdings} cards. Upgrade to Trader for an unlimited portfolio.`,
      });
    }
    return;
  }

  // alerts: table arrives in Phase 3; cap is enforced there via this branch.
  throw new ConvexError({
    code: "LIMIT_REACHED",
    message: "The free tier includes one active alert. Upgrade to Trader for unlimited alerts.",
  });
}
