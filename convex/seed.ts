import { internalMutation } from "./_generated/server";

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
