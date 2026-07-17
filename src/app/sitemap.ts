import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { ARTICLES } from "@/lib/articles";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kiri-tcg.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/cards`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/news`, changeFrequency: "weekly", priority: 0.8 },
    ...ARTICLES.map((a) => ({ url: `${SITE}/news/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return staticPages;
  try {
    const cards = await fetchQuery(api.cards.forSitemap, {});
    return [
      ...staticPages,
      ...cards.map((card) => ({
        url: `${SITE}/cards/${card.gameSlug}/${card.slug}`,
        lastModified: new Date(card.lastSyncedAt),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticPages;
  }
}
