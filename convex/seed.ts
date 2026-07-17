import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const GAMES = [
  { slug: "magic-the-gathering", name: "Magic: The Gathering", justTcgId: "magic-the-gathering" },
  { slug: "pokemon", name: "Pokémon", justTcgId: "pokemon" },
  { slug: "yugioh", name: "Yu-Gi-Oh!", justTcgId: "yugioh" },
  { slug: "sorcery-contested-realm", name: "Sorcery: Contested Realm", justTcgId: "sorcery-contested-realm" },
];

/** Idempotent: run with `npx convex run seed:init`. */
export const init = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const game of GAMES) {
      const existing = await ctx.db
        .query("games")
        .withIndex("slug", (q) => q.eq("slug", game.slug))
        .unique();
      if (!existing) await ctx.db.insert("games", game);
    }
    return "seeded";
  },
});

/**
 * Dev tooling: fill a user's portfolio to N rows with distinct variants
 * (marker acquiredAt=1 so testClearHoldings can undo it). Verifies FR-010.
 */
export const testFillHoldings = internalMutation({
  args: { email: v.string(), target: v.number() },
  handler: async (ctx, { email, target }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    if (!user) throw new Error("no user");
    const existing = await ctx.db
      .query("holdings")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .collect();
    const owned = new Set(existing.map((h) => h.variantId));
    const variants = await ctx.db.query("variants").take(target + existing.length + 10);
    let added = 0;
    for (const variant of variants) {
      if (existing.length + added >= target) break;
      if (owned.has(variant._id)) continue;
      await ctx.db.insert("holdings", {
        userId: user._id,
        variantId: variant._id,
        quantity: 1,
        acquiredAt: 1,
      });
      added++;
    }
    return { added, total: existing.length + added };
  },
});

export const testClearHoldings = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    if (!user) throw new Error("no user");
    const rows = await ctx.db
      .query("holdings")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .collect();
    let removed = 0;
    for (const row of rows) {
      if (row.acquiredAt === 1) {
        await ctx.db.delete(row._id);
        removed++;
      }
    }
    return { removed };
  },
});

/**
 * Launch catalog: high-traffic staples per game so first visitors find
 * populated pages and charts. Cache-aware (skips queries that already
 * return results) and budget-guarded, so it can re-run across days:
 * `npx convex run seed:staples`.
 */
export const STAPLES: Array<{ q: string; gameSlug: string }> = [
  // Magic: The Gathering
  ...["sol ring", "counterspell", "brainstorm", "swords to plowshares", "dark ritual",
      "birds of paradise", "force of will", "thoughtseize", "ragavan", "rhystic study",
      "cyclonic rift", "demonic tutor"].map((q) => ({ q, gameSlug: "magic-the-gathering" })),
  // Pokémon
  ...["charizard", "pikachu", "blastoise", "venusaur", "umbreon", "rayquaza",
      "gengar", "mewtwo", "eevee", "lugia", "gardevoir", "dragonite"].map((q) => ({ q, gameSlug: "pokemon" })),
  // Yu-Gi-Oh
  ...["blue-eyes white dragon", "dark magician", "red-eyes black dragon", "exodia",
      "pot of greed", "ash blossom", "dark magician girl", "monster reborn",
      "mirror force", "nibiru", "accesscode talker", "snake-eye"].map((q) => ({ q, gameSlug: "yugioh" })),
  // Sorcery: Contested Realm
  ...["avatar", "dragon", "grim", "flame", "sorcerer", "knight"].map((q) => ({ q, gameSlug: "sorcery-contested-realm" })),
];
