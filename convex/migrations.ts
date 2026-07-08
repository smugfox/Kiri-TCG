import { internalMutation } from "./_generated/server";
import { splitPrinting } from "./lib/normalize";

/**
 * One-off: split language suffixes out of variants.printing into the new
 * language field ("Normal - Japanese" → printing "Normal", language
 * "Japanese"). Idempotent; safe to re-run. July 2026.
 */
export const splitVariantLanguages = internalMutation({
  args: {},
  handler: async (ctx) => {
    const variants = await ctx.db.query("variants").collect();
    let patched = 0;
    for (const variant of variants) {
      const { printing, language } = splitPrinting(variant.printing);
      if (variant.printing !== printing || variant.language !== language) {
        await ctx.db.patch(variant._id, { printing, language });
        patched++;
      }
    }
    return { patched, total: variants.length };
  },
});

/**
 * Housekeeping: delete local placeholder variants no holding references
 * (created by an add that was later removed). Safe to run anytime.
 */
export const deleteOrphanLocalVariants = internalMutation({
  args: {},
  handler: async (ctx) => {
    const variants = await ctx.db.query("variants").collect();
    let deleted = 0;
    for (const variant of variants) {
      if (!variant.justTcgVariantId.startsWith("local:")) continue;
      const holder = await ctx.db
        .query("holdings")
        .withIndex("byVariant", (q) => q.eq("variantId", variant._id))
        .first();
      if (!holder) {
        await ctx.db.delete(variant._id);
        deleted++;
      }
    }
    return { deleted };
  },
});
