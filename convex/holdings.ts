import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { requireUser, requireCapacity } from "./lib/access";

const MAX_QUANTITY = 999;

const CONDITIONS = ["NM", "LP", "MP", "HP", "DMG"];

/**
 * Add a position. Adding a variant you already hold merges: quantities sum
 * and cost basis becomes the weighted average of both lots (US-003).
 *
 * A collector's copy may not exist in the market data (nobody is selling an
 * NM Japanese copy right now). `spec` covers that: it resolves to the real
 * variant when one exists, otherwise creates a local unpriced placeholder
 * (justTcgVariantId "local:…"). Placeholders are excluded from totals with
 * the honest excluded-count, skipped by the nightly refresh, and upgraded
 * in place if the market variant appears later.
 */
export const add = mutation({
  args: {
    variantId: v.optional(v.id("variants")),
    spec: v.optional(
      v.object({
        cardId: v.id("cards"),
        condition: v.string(),
        printing: v.string(),
        language: v.string(),
      }),
    ),
    quantity: v.number(),
    costBasisPerCard: v.optional(v.number()),
    acquiredAt: v.optional(v.number()),
  },
  handler: async (ctx, { variantId, spec, quantity, costBasisPerCard, acquiredAt }) => {
    const { userId, user } = await requireUser(ctx);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new ConvexError({ code: "BAD_REQUEST", message: `Quantity must be 1-${MAX_QUANTITY}.` });
    }

    let variant = variantId ? await ctx.db.get(variantId) : null;
    if (!variant && spec) {
      if (!CONDITIONS.includes(spec.condition) || !spec.printing.trim() || !spec.language.trim()) {
        throw new ConvexError({ code: "BAD_REQUEST", message: "That isn't a version we recognize." });
      }
      const card = await ctx.db.get(spec.cardId);
      if (!card) throw new ConvexError({ code: "NOT_FOUND", message: "That card no longer exists." });
      const siblings = await ctx.db
        .query("variants")
        .withIndex("byCard", (q) => q.eq("cardId", spec.cardId))
        .collect();
      variant =
        siblings.find(
          (x) =>
            x.condition === spec.condition &&
            x.printing === spec.printing &&
            (x.language ?? "English") === spec.language,
        ) ?? null;
      if (!variant) {
        const placeholderId = await ctx.db.insert("variants", {
          cardId: spec.cardId,
          justTcgVariantId: `local:${spec.cardId}:${spec.condition}:${spec.printing}:${spec.language}`,
          condition: spec.condition,
          printing: spec.printing,
          language: spec.language,
          lastUpdatedAt: Date.now(),
        });
        variant = await ctx.db.get(placeholderId);
      }
    }
    if (!variant) throw new ConvexError({ code: "NOT_FOUND", message: "That printing no longer exists." });
    const resolvedVariantId = variant._id;

    const existing = await ctx.db
      .query("holdings")
      .withIndex("byUserVariant", (q) => q.eq("userId", userId).eq("variantId", resolvedVariantId))
      .unique();

    if (existing) {
      const newQuantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
      // Weighted-average cost basis across lots; a lot without a price
      // leaves the existing basis untouched.
      let costBasis = existing.costBasisPerCard;
      if (costBasisPerCard !== undefined) {
        costBasis =
          existing.costBasisPerCard !== undefined
            ? (existing.costBasisPerCard * existing.quantity + costBasisPerCard * quantity) /
              (existing.quantity + quantity)
            : costBasisPerCard;
      }
      await ctx.db.patch(existing._id, {
        quantity: newQuantity,
        costBasisPerCard: costBasis,
        acquiredAt: acquiredAt ?? existing.acquiredAt,
      });
      return { holdingId: existing._id, merged: true };
    }

    await requireCapacity(ctx, "holdings", userId, user);
    const holdingId = await ctx.db.insert("holdings", {
      userId,
      variantId: resolvedVariantId,
      quantity,
      costBasisPerCard,
      acquiredAt,
    });
    return { holdingId, merged: false };
  },
});

export const update = mutation({
  args: {
    holdingId: v.id("holdings"),
    quantity: v.optional(v.number()),
    costBasisPerCard: v.optional(v.union(v.number(), v.null())),
    acquiredAt: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, { holdingId, quantity, costBasisPerCard, acquiredAt }) => {
    const { userId } = await requireUser(ctx);
    const holding = await ctx.db.get(holdingId);
    if (!holding || holding.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "That holding isn't in your portfolio." });
    }
    if (quantity !== undefined) {
      if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QUANTITY) {
        throw new ConvexError({ code: "BAD_REQUEST", message: `Quantity must be 0-${MAX_QUANTITY}.` });
      }
      // Editing quantity to zero is a remove (PRD edge case).
      if (quantity === 0) {
        await ctx.db.delete(holdingId);
        return { removed: true };
      }
    }
    await ctx.db.patch(holdingId, {
      ...(quantity !== undefined ? { quantity } : {}),
      ...(costBasisPerCard !== undefined
        ? { costBasisPerCard: costBasisPerCard ?? undefined }
        : {}),
      ...(acquiredAt !== undefined ? { acquiredAt: acquiredAt ?? undefined } : {}),
    });
    return { removed: false };
  },
});

export const remove = mutation({
  args: { holdingId: v.id("holdings") },
  handler: async (ctx, { holdingId }) => {
    const { userId } = await requireUser(ctx);
    const holding = await ctx.db.get(holdingId);
    if (!holding || holding.userId !== userId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "That holding isn't in your portfolio." });
    }
    await ctx.db.delete(holdingId);
    return { quantity: holding.quantity };
  },
});

/**
 * Holdings joined with card + variant, sorted, paginated at the caller's
 * page size (the table uses 50). Sorting happens over the user's full set,
 * which is bounded (free: 100; paid portfolios are collections, not feeds).
 */
export const list = query({
  args: {
    sort: v.optional(v.union(v.literal("name"), v.literal("price"), v.literal("pl"))),
    dir: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { sort = "name", dir = "asc", paginationOpts }) => {
    const { userId } = await requireUser(ctx);
    const rows = await ctx.db
      .query("holdings")
      .withIndex("byUser", (q) => q.eq("userId", userId))
      .collect();

    const games = await ctx.db.query("games").collect();
    const gameSlugById = new Map(games.map((g) => [g._id, g.slug]));

    const joined = (
      await Promise.all(
        rows.map(async (holding) => {
          const variant = await ctx.db.get(holding.variantId);
          if (!variant) return null;
          const card = await ctx.db.get(variant.cardId);
          if (!card) return null;
          const value =
            variant.currentPrice !== undefined ? variant.currentPrice * holding.quantity : null;
          const pl =
            value !== null && holding.costBasisPerCard !== undefined
              ? value - holding.costBasisPerCard * holding.quantity
              : null;
          // Last 30 days of snapshots for the sparkline.
          const spark = await ctx.db
            .query("priceSnapshots")
            .withIndex("byVariantDay", (q) => q.eq("variantId", variant._id))
            .order("desc")
            .take(30);
          return {
            _id: holding._id,
            quantity: holding.quantity,
            costBasisPerCard: holding.costBasisPerCard,
            acquiredAt: holding.acquiredAt,
            variantId: variant._id,
            condition: variant.condition,
            printing: variant.printing,
            language: variant.language ?? "English",
            currentPrice: variant.currentPrice,
            change7d: variant.change7d,
            lastUpdatedAt: variant.lastUpdatedAt,
            card: {
              _id: card._id,
              name: card.name,
              setName: card.setName,
              number: card.number,
              rarity: card.rarity,
              rarityTier: card.rarityTier,
              slug: card.slug,
              gameSlug: gameSlugById.get(card.gameId) ?? "",
              imageUrl: card.imageUrl,
            },
            value,
            pl,
            sparkline: spark
              .map((s) => s.price)
              .reverse(),
          };
        }),
      )
    ).filter((row) => row !== null);

    joined.sort((a, b) => {
      const cmp =
        sort === "name"
          ? a.card.name.localeCompare(b.card.name)
          : sort === "price"
            ? (a.currentPrice ?? -1) - (b.currentPrice ?? -1)
            : (a.pl ?? Number.NEGATIVE_INFINITY) - (b.pl ?? Number.NEGATIVE_INFINITY);
      return dir === "asc" ? cmp : -cmp;
    });

    // Cursor is the numeric offset, stringified; fine for a bounded set.
    const offset = paginationOpts.cursor ? parseInt(paginationOpts.cursor, 10) : 0;
    const page = joined.slice(offset, offset + paginationOpts.numItems);
    const nextOffset = offset + page.length;
    return {
      page,
      isDone: nextOffset >= joined.length,
      continueCursor: String(nextOffset),
      total: joined.length,
    };
  },
});
