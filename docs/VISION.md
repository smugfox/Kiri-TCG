# Vision — Kiri

> Captured by the Product Planner skill. This file is the source of truth for
> generating product-vision.md, prd.md, and product-roadmap.md. Edit it directly
> and re-run the Product Planner to regenerate downstream documents.

**Created:** 2026-07-07
**Updated:** 2026-07-07

## Founder

- **Name:** Robin
- **Expertise:** Product design (10+ years) with front-end engineering roots. Nine years at Crunchyroll covering design systems, internal tools, web, mobile, and living room.
- **Background:** I started as a front-end engineer and transitioned into product design over a decade ago. Nine of those years were at Crunchyroll, designing for one of the most passionate fan audiences on the internet, across every surface from web to living room, including the design systems that held it all together. I collect and trade cards myself, and I want to build the collector tool I keep wishing existed.

## Purpose

- **Who you help:** Collector-investors: adult TCG collectors (25–45) with real money in cards who treat their collection as an asset. They want to know what it's worth, what's moving, and when to buy, sell, or trade.
- **Problem you solve:** Prices live scattered across TCGplayer listings, eBay solds, and forum lore. Nothing aggregates a collection the way a stock app aggregates a portfolio; nothing says "your collection is worth $4,281 and moved +3.2% this week." Condition and printing variants break every spreadsheet that tries.
- **Desired transformation:** From "a binder of unknown value in the closet" to a living portfolio they check like a stock app, making confident buy, sell, and trade decisions backed by real price history.
- **Why you:** Nine years designing for Crunchyroll's fan audience, which overlaps heavily with TCG collectors, taught me how to make dense collector tools feel premium instead of spreadsheet-like. My front-end engineering background plus a decade of product design means I can design it and ship it solo with a coding agent. And I'm a collector myself, so I feel this problem every week.

## Product

- **Name:** Kiri
- **One-liner:** Kiri helps collectors track, value, and trade their TCG collection across every game.
- **How it works:** A collector searches for any card and lands on its Robinhood-style price page: current value by condition and printing, a price history chart, and change stats. They tap Add, set condition, quantity, and what they paid, and their portfolio starts existing. Each card added compounds the picture until the dashboard shows their total value, daily movement, P&L, and top movers, and price alerts watch the market while they sleep.
- **Key capabilities:**
  - Card search with condition/printing-level prices and Robinhood-style history charts across Magic, Pokémon, Yu-Gi-Oh, and Sorcery
  - Portfolio with total value, cost basis, unrealized P&L, allocation, and top movers
  - Price alerts (above/below thresholds) delivered by email and in-app notifications
  - Watchlist for cards they don't own yet
- **Platform:** web
- **Market differentiation:** Unlike database-dump trackers (PriceCharting, single-game tools like Card Ladder) and marketplaces that treat collections as inventory lists (TCGplayer), Kiri treats a collection like a portfolio: P&L, cost basis, movers, and charts in a crafted, editorial design instead of a spreadsheet with a logo. One app across every game.
- **Magic moment:** The first-ten-cards reveal. A new user adds their first handful of cards and the portfolio hero renders: total worth in big serif, today's change, a real chart. "My binder is worth $2,300" is a screenshot people share.

## Audience

- **Primary user:** Marcus, 34, software engineer, roughly $12k of Magic cards accumulated since high school. He lurks r/mtgfinance, knows individual card prices from memory, but has no idea what the closet is actually worth this month or which way it's moving.
- **Secondary users:**
  - Local game store owners valuing buylists and display cases (the Dealer tier at $15/mo)
  - Trade partners who receive a Kiri trade-offer link and sign up to respond, a built-in viral loop
  - Competitive players budgeting deck upgrades who care about price timing more than collection value
- **Current alternatives:** Marketplace tab-hopping (TCGplayer listings + eBay solds + mental math, card by card), Google Sheets with hand-updated prices, single-game trackers like Card Ladder (MTG) and Collectr, or no tracking at all: value as a vibe, checked only when selling.
- **Frustrations:** Everything prices one card at a time; nothing rolls up to "what is my collection worth and which way is it moving." Condition × printing variants break every spreadsheet. Per-game subscriptions still don't cover a whole collection.

## Business

- **Revenue model:** freemium
- **90-day goal:** MVP live, ~200 signups, 50 weekly-active portfolios, first 10 Trader subscribers ($6/mo), and one genuine community shoutout (Reddit thread or Discord mention). Tiers: Collector free (100 cards, 1 alert), Trader $6/mo, Dealer $15/mo.
- **6-month vision:** A community fixture: ~1,500 users, 100+ paying (~$800 MRR), CSV import and peer trading shipped, and Kiri links showing up organically when collectors argue about prices.
- **Constraints:** Solo founder building nights and weekends around a day job, with a coding agent. Infra budget under $100/mo. JustTCG free tier (100 requests/day) until traction justifies the paid tier, which forces a cache-and-snapshot data architecture. Backend skills rusty after a decade in design, hence a managed TypeScript-native backend.
- **Go-to-market:** Community-first: build in public in r/mtgfinance, PokeInvesting, TCG Discords, and X, the exact rooms where the target user already argues about prices. Programmatic SEO from card price pages and the trade-link loop come later as amplifiers.

## Brand Voice

- **Personality:** The trusted appraiser: calm, knowledgeable, craftsmanlike, warm. An expert friend who knows what your cards are worth and never hypes. Japanese-craft restraint (the name Kiri comes from the paulownia wood used in traditional chests that protect valuables).
- **Tone of voice:** Quiet confidence. Sentence case, no exclamation marks, plain statements; empty states name the next action; errors say what happened and how to fix it. Example success: "Deck saved to your collection." Example error: "Card could not be added: collection limit reached." Example empty state: "No cards in your portfolio yet. Search for any card to start tracking its value."

> Visual identity (mood, anti-patterns, design tokens) is deliberately not
> captured here — it lives in docs/design.md, generated by the Design System
> skill from image references.

## Tech Stack

- **App type:** web
- **Frontend:** Next.js — server-rendered card pages power the programmatic-SEO funnel, best ecosystem and coding-agent support, and the existing design tokens drop in directly
- **Backend:** Convex — TypeScript-native functions, scheduled jobs for nightly JustTCG price snapshots, zero boilerplate for a solo nights-and-weekends builder
- **Database:** Convex Database — included with the backend; document-relational with ACID transactions and reactive queries for live portfolio values
- **Auth:** Convex Auth — native to the backend, supports Google/Apple OAuth and magic links, and keeps the custom-designed auth card fully ours
- **Payments:** Polar — built for SaaS subscriptions, merchant of record (handles global sales tax), clean API for the Trader/Dealer tiers
- **Analytics:** PostHog — free tier with session replay and feature flags bundled; needed to watch the add-first-card funnel
- **Email:** Resend — transactional email for price alerts and magic links, clean fit with the Next.js/TypeScript stack
- **Error tracking:** Sentry — catch crashes before collectors report them

## Tooling

- **Coding agent:** Claude Code
