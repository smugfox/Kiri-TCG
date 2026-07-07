import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // users: auth-managed fields plus Kiri's app fields (all app fields optional
  // because Convex Auth creates the row; defaults are applied in code).
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    tier: v.optional(v.union(v.literal("free"), v.literal("trader"), v.literal("dealer"))),
    emailAlertsEnabled: v.optional(v.boolean()),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("byPolarCustomer", ["polarCustomerId"]),

  games: defineTable({
    slug: v.string(),
    name: v.string(),
    justTcgId: v.string(),
  }).index("slug", ["slug"]),

  // JustTCG request budget bookkeeping: one row per UTC day.
  syncState: defineTable({
    day: v.string(),
    requestsUsed: v.number(),
  }).index("byDay", ["day"]),
});
