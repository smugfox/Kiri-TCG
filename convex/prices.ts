import { v } from "convex/values";
import { query } from "./_generated/server";
import { utcDay } from "./lib/budget";

const RANGE_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
  all: 730, // "all" capped at two years of daily points
};

export const history = query({
  args: {
    variantId: v.id("variants"),
    range: v.union(
      v.literal("7d"),
      v.literal("30d"),
      v.literal("90d"),
      v.literal("1y"),
      v.literal("all"),
    ),
  },
  handler: async (ctx, { variantId, range }) => {
    const days = RANGE_DAYS[range];
    const from = utcDay(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await ctx.db
      .query("priceSnapshots")
      .withIndex("byVariantDay", (x) => x.eq("variantId", variantId).gte("day", from))
      .collect();
    return rows
      .map(({ day, price }) => ({ day, price }))
      .sort((a, b) => (a.day < b.day ? -1 : 1));
  },
});
