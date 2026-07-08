import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./lib/access";

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const { userId } = await requireUser(ctx);
    const results = await ctx.db
      .query("notifications")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(paginationOpts);
    const games = await ctx.db.query("games").collect();
    const page = await Promise.all(
      results.page.map(async (n) => {
        const card = n.cardId ? await ctx.db.get(n.cardId) : null;
        const gameSlug = card ? (games.find((g) => g._id === card.gameId)?.slug ?? "") : null;
        return {
          _id: n._id,
          kind: n.kind,
          title: n.title,
          body: n.body,
          read: n.read,
          createdAt: n._creationTime,
          cardPath: card ? `/cards/${gameSlug}/${card.slug}` : null,
        };
      }),
    );
    return { ...results, page };
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("byUserRead", (q) => q.eq("userId", userId).eq("read", false))
      .take(100); // the badge caps at 99+
    return unread.length;
  },
});

/** Mark the given notifications read; no ids marks everything. */
export const markRead = mutation({
  args: { ids: v.optional(v.array(v.id("notifications"))) },
  handler: async (ctx, { ids }) => {
    const { userId } = await requireUser(ctx);
    if (ids) {
      for (const id of ids) {
        const n = await ctx.db.get(id);
        if (n && n.userId === userId && !n.read) await ctx.db.patch(id, { read: true });
      }
      return;
    }
    const unread = await ctx.db
      .query("notifications")
      .withIndex("byUserRead", (q) => q.eq("userId", userId).eq("read", false))
      .collect();
    for (const n of unread) await ctx.db.patch(n._id, { read: true });
  },
});
