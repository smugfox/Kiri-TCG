import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kiri-tcg.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portfolio", "/watchlist", "/alerts", "/settings", "/signin", "/styleguide"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
