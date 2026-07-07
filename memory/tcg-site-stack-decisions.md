---
name: tcg-site-stack-decisions
description: "Confirmed decisions for Kiri (TCG portfolio web app): full stack, APIs, fonts, and product docs"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3796ab52-8d5b-4bcb-b8c0-b511a162e2dc
---

The testBuilderOS project (GitHub: smugfox/TCGDS) is **Kiri**: a TCG collection-portfolio web app ("Kiri helps collectors track, value, and trade their TCG collection across every game"). Named July 7, 2026 after paulownia wood (kiri), used for Japanese valuables chests. Founder: Robin, product designer (ex-Crunchyroll, 9 yrs) with front-end roots. Full product docs exist: docs/VISION.md, product-vision.md, prd.md, product-roadmap.md (68 tasks, 7 phases). Decisions confirmed by the founder:

- **Price data**: JustTCG API (`api.justtcg.com/v1`, `x-api-key` header). Free-tier key stored in `/Users/robinfox/Desktop/sandbox/testBuilderOS/.env` as `JUSTTCG_API_KEY`; server-side only, never in client code or docs. Free tier includes per-variant (condition/printing) `price`, daily `priceHistory` [{p,t}], and 7/30/90d change stats. Covers Magic, Pokémon, Yu-Gi-Oh, Sorcery; no Warlord (out of print).
- **Charts**: Lightweight Charts (TradingView), area/line only, theme config is in design.md's Components section.
- **Icons**: Lucide, inline SVG, currentColor.
- **Heading font**: Newsreader (free stand-in for paid Tiempos Text); body is Geist.
- Product/app stack (July 7 intake): Next.js (App Router) + Convex (+ built-in DB, Convex Auth with Google/Apple/magic-link) + Polar payments (Collector free / Trader $6 / Dealer $15, annual saves 20%) + PostHog + Resend + Sentry; built with Claude Code.
- Design system renamed from "Untitled" to Kiri. The founder wants no trace of the original brand reference name anywhere in source; keep it that way.

**Why:** these were explicit founder choices after comparing options; re-litigating them wastes sessions.
**How to apply:** when building the site, read `.env` for the key, follow design.md as source of truth, and keep design.html in sync with every design.md change.
