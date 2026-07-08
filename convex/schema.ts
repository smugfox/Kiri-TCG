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
    onboardingDismissed: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("byPolarCustomer", ["polarCustomerId"]),

  games: defineTable({
    slug: v.string(),
    name: v.string(),
    justTcgId: v.string(),
  }).index("slug", ["slug"]),

  // cards: one row per printed card (per set/number); catalog rows are append-only.
  cards: defineTable({
    gameId: v.id("games"),
    justTcgCardId: v.string(),
    name: v.string(),
    setName: v.string(),
    number: v.optional(v.string()),
    rarity: v.optional(v.string()),
    rarityTier: v.union(
      v.literal("common"),
      v.literal("uncommon"),
      v.literal("rare"),
      v.literal("epic"),
      v.literal("mythic"),
      v.literal("secret"),
    ),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
    searchText: v.string(),
    lastSyncedAt: v.number(),
    lastViewedAt: v.optional(v.number()),
  })
    .index("byJustTcgId", ["justTcgCardId"])
    .index("byGameSlug", ["gameId", "slug"])
    .index("byLastViewed", ["lastViewedAt"])
    .searchIndex("search", { searchField: "searchText", filterFields: ["gameId"] }),

  // variants: condition × printing per card; the priceable unit.
  variants: defineTable({
    cardId: v.id("cards"),
    justTcgVariantId: v.string(),
    condition: v.string(),
    printing: v.string(), // base printing: Normal, Foil, 1st Edition, ...
    language: v.optional(v.string()), // "English" default; "Japanese", ...
    currentPrice: v.optional(v.number()),
    change7d: v.optional(v.number()),
    change30d: v.optional(v.number()),
    change90d: v.optional(v.number()),
    lastUpdatedAt: v.number(),
  })
    .index("byCard", ["cardId"])
    .index("byJustTcgId", ["justTcgVariantId"])
    .index("byLastUpdated", ["lastUpdatedAt"]),

  // priceSnapshots: one per variant per day; the proprietary history, never deleted.
  priceSnapshots: defineTable({
    variantId: v.id("variants"),
    price: v.number(),
    day: v.string(),
  }).index("byVariantDay", ["variantId", "day"]),

  // holdings: a user's position in a variant.
  holdings: defineTable({
    userId: v.id("users"),
    variantId: v.id("variants"),
    quantity: v.number(), // 1-999
    costBasisPerCard: v.optional(v.number()), // USD, what they paid each
    acquiredAt: v.optional(v.number()),
  })
    .index("byUser", ["userId"])
    .index("byUserVariant", ["userId", "variantId"])
    .index("byVariant", ["variantId"]), // refresh prioritization

  // portfolioSnapshots: nightly per-user total for the portfolio chart.
  portfolioSnapshots: defineTable({
    userId: v.id("users"),
    totalValue: v.number(),
    costBasis: v.number(),
    day: v.string(),
  }).index("byUserDay", ["userId", "day"]),

  // JustTCG request budget bookkeeping: one row per UTC day.
  syncState: defineTable({
    day: v.string(),
    requestsUsed: v.number(),
    backfillUsed: v.optional(v.number()),
  }).index("byDay", ["day"]),

  // Per-user hourly cap on uncached-search backfill triggers (PRD § Security).
  backfillTriggers: defineTable({
    key: v.string(), // user id, or "anon" for unauthenticated searches
    hour: v.string(), // "2026-07-07T13" UTC
    count: v.number(),
  }).index("byKeyHour", ["key", "hour"]),
});
