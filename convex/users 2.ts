import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./lib/access";

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
    };
  },
});

export const dismissOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx);
    await ctx.db.patch(userId, { onboardingDismissed: true });
  },
});
