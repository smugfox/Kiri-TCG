# Product Vision: Kiri

## 1. Vision & Mission

### Vision Statement

Every card collector knows exactly what their collection is worth, the way every investor knows their portfolio, and makes buy, sell, and trade decisions with that same confidence.

### Mission Statement

Kiri turns scattered card prices into a living portfolio: search any card across every major TCG, add it with condition and cost, and watch your collection's value move every day.

### Founder's Why

Robin spent over a decade in product design after starting as a front-end engineer, including nine years at Crunchyroll designing for one of the most passionate fan audiences on the internet, across web, mobile, and living room, and building the design systems that held it all together. That work taught a specific lesson that applies directly here: fans deserve tools that feel as premium as their passion, and most fan-facing tools are built like databases instead.

Robin is also a collector. The problem Kiri solves is felt personally, weekly: prices exist everywhere (TCGplayer, eBay solds, forum lore) but a collection's value exists nowhere. The gap between "I know what this one card is worth" and "I know what my collection did this month" is the gap Kiri closes.

The founder-market fit is unusually complete: a designer who can make a dense financial tool feel crafted, an engineer who can ship it solo with a coding agent, and a collector who is the target user. The design system was built before this document existed; the craft-first approach is not aspirational, it is already on disk.

### Core Values

**Stale prices are honest prices.** Kiri shows when every price was last updated, always. Data freshness is a design element (the freshness chip appears on every pricing surface), never fine print. Trust is the product; the moment a collector doubts a number, Kiri is a toy.

**The collection is precious, treat it that way.** Every design decision echoes the care collectors put into sleeves and binders. The name comes from paulownia (kiri), the wood of Japanese chests built to protect valuables. No spreadsheet aesthetics, no clutter, no shouting.

**Ship the moment, then the feature.** The first-ten-cards reveal matters more than any feature list. Anything that delays a new user seeing their portfolio's worth gets cut or deferred.

**Quiet numbers, no hype.** Kiri reports gains and losses with the same calm tone. No confetti, no rocket emojis, no "to the moon." Collectors are adults with real money in cardboard; the product respects that.

**Every game, one ladder.** Multi-game support is architectural, not bolted on. Rarity, pricing, and portfolio logic are game-agnostic from day one, because the target user's closet contains more than one game.

### Strategic Pillars

**Portfolio-first, marketplace-never.** Kiri tells you what things are worth; it does not sell you cards. This keeps incentives clean (no reason to inflate prices), differentiates from TCGplayer, and keeps MVP scope sane. When a debate arises about a commerce feature, the answer is no.

**Design is the moat.** Competitors have data; none of them feel like a crafted finance app. Every surface must pass the question "would this screenshot make someone ask what app that is?"

**Cache aggressively, respect the rate limit.** The JustTCG free tier (100 requests/day, 20 cards/request) is a hard constraint that shapes architecture: nightly snapshots into our own database, serve everything from cache, never call the API in a user's request path. This constraint is also the moat's foundation: owning our own price history compounds daily.

**Solo pace, working increments.** Nights-and-weekends building means every phase must end with something demoable and nothing half-wired. Scope debates resolve toward the smaller, shippable version.

### Success Looks Like

Twelve months from now, Kiri has around 4,000 registered collectors and 250 paying subscribers, roughly $2,000 in MRR against under $150 of monthly infrastructure. The add-first-card funnel converts above 60 percent because the magic moment arrives inside three minutes. A few hundred price alerts fire every week and collectors screenshot their portfolio heroes into Discord servers Robin has never joined. When someone in r/mtgfinance asks "what do you all use to track your collection," Kiri appears in the replies without Robin posting it. CSV import and trade offers have shipped; the trade-link loop is starting to pull in counterparties. Robin still works nights and weekends, but the question has shifted from "will anyone use this" to "when do I go full-time."

## 2. User Research

### Primary Persona

**Marcus, 34, software engineer, suburban Portland.** He started collecting Magic in high school, drifted in and out through college, and never sold. The result is roughly $12,000 of cards in a closet: two binders of rares, four commander decks, a shoebox of "probably nothing, but maybe." He reads r/mtgfinance on his phone most mornings, knows from memory that his Gaea's Cradle "went up," and could not tell you within $3,000 what the closet is worth this month or whether it beat the S&P.

He is highly tech-comfortable (he will find the CSV export before you document it) but time-poor: a demanding job, a family, and maybe five hours a week for the hobby. He tried a Google Sheet in 2022; it lasted eleven rows. He tried Card Ladder's trial and respected the data but bounced off the interface and the single-game limit, since a quarter of his collection is Pokémon from a 2021 detour. Emotionally, the closet is a low-grade itch: part asset he feels vaguely irresponsible about not tracking, part identity he is quietly proud of. What makes him switch: adding a card takes seconds, the portfolio number feels trustworthy, and the app looks good enough to leave open on a second monitor.

### Secondary Personas

**Dana, 47, owns a local game store.** Values buylists and display cases weekly, currently with TCGplayer's seller tools plus intuition. She does not need portfolio emotion; she needs fast, per-condition numbers for a hundred cards at a time and an export. She is the Dealer tier ($15/mo) and will judge Kiri entirely on bulk workflow and data trustworthiness.

**Theo, 29, Marcus's trade partner.** He does not have the app. He receives a Kiri trade-offer link showing both sides of a proposed trade with live values and a delta in his favor. The link is his first impression of the product and the built-in growth loop; if responding requires more than one tap into sign-up, the loop dies.

**Priya, 26, competitive player.** Budgets deck upgrades across Standard and a Pokémon side habit. She cares about price timing (buy the reprint dip) more than collection worth. She uses the watchlist and alerts heavily, keeps 40 cards in her portfolio, and may never pay, but she posts screenshots.

### Jobs To Be Done

**Functional jobs.** When I add cards to my collection, I want them valued at the right condition and printing, so my total is real. When I wonder "how's my collection doing," I want one number with a trend, so I stop doing per-card mental math. When a card I own or want moves past a threshold, I want to be told, so I can act without watching daily. When I consider a trade, I want both sides valued, so I can say yes without homework.

**Emotional jobs.** Help me feel like a competent steward of money I have already spent (relief from the low-grade guilt of the untracked closet). Make checking my collection feel like checking a brokerage account, not doing inventory (pride, not chore).

**Social jobs.** Let me show, not tell: a portfolio screenshot that says "I take this seriously" in a Discord argument. Make me the friend who knows whether a trade is fair.

### Pain Points

1. **No aggregate view (severe, constant).** The defining pain. Every existing tool prices one card at a time; the collection-level answer requires a spreadsheet nobody maintains. Consequence: collectors misjudge their own holdings by thousands of dollars and make trades and sales on vibes.
2. **Variant complexity breaks tracking (severe, every entry).** Near Mint versus Lightly Played, normal versus foil, printings across sets. Spreadsheets flatten this and become fiction; tools that model it (Card Ladder) make entry laborious. Kiri's per-variant pricing from JustTCG addresses this directly, and the variant picker is already designed.
3. **Watching the market is a job (moderate, weekly).** Knowing when to sell the spiking card means checking prices habitually. Most collectors miss their windows. Alerts convert this from a job into a notification.
4. **Multi-game means multi-tool (moderate, structural).** Card Ladder is MTG-centric, Pokémon tools ignore Yu-Gi-Oh, and none of them share a portfolio. Real closets are mixed.
5. **Trades run on trust and memory (moderate, situational).** Real pain but less frequent than the daily value question, which is why trading is post-MVP despite being in the one-liner.

### Current Alternatives & Competitive Landscape

**Marketplace tab-hopping (TCGplayer + eBay solds).** Does well: authoritative current asking prices, real sold data. Falls short: prices one card at a time, no memory of what you own, no history charts without digging. Switching cost: zero; Kiri complements rather than replaces the marketplace.

**Google Sheets.** Does well: total flexibility, free, private. Falls short: prices go stale the day they are entered, variants are agony, no charts, no alerts. Switching requires abandoning sunk effort, which CSV import (post-MVP) is designed to harvest.

**Card Ladder (~$10-12/mo).** The most serious competitor. Does well: deep MTG price history, sales data, a real collection tracker, established community trust. Falls short: single-game, dense analyst-oriented interface, no trading story. Kiri wins on multi-game coverage, design quality, and price; it loses on data depth and track record, so it should never fight on "more data."

**Collectr (mobile).** Does well: easy mobile collection tracking, strong Pokémon coverage, free tier. Falls short: shallow financial framing (little cost basis or P&L), mobile-first means weak desktop and no SEO surface. Closest in spirit; Kiri differentiates on the finance-app frame and web depth.

**PriceCharting.** Does well: breadth (including graded and sealed), long history. Falls short: utilitarian to a fault; the interface reads like 2009. Useful as a data reference, not a daily home.

**Do nothing.** The largest competitor. Does well: costs no effort. Falls short: the itch never resolves. Kiri's wedge against apathy is that the magic moment costs ten cards and three minutes.

### Key Assumptions to Validate

1. We assume JustTCG's prices are accurate and complete enough for collectors to trust, because spot checks matched TCGplayer. To validate: cross-check 100 high-traffic cards across conditions against TCGplayer weekly during the beta; publish nothing we have not checked.
2. We assume daily snapshots are fresh enough, because collections are not day-traded. To validate: watch for user complaints referencing intraday spikes; measure alert-to-action timing.
3. We assume the free tier's 100 requests/day can bootstrap the card catalog via on-demand fetch plus caching, because 20 cards come per request. To validate: model cache hit rates in week one; the paid tier ($10-30/mo) is the planned relief valve, not a surprise.
4. We assume Marcus will hand-enter his first ten cards without CSV import, because search-and-add takes seconds. To validate: funnel analytics on signup → first card → tenth card; if drop-off clusters before ten, import moves up the roadmap.
5. We assume "finance app for cards" positioning attracts collectors rather than intimidating them. To validate: landing-page copy tests in community posts; watch whether "P&L" language helps or hurts sign-ups.
6. We assume 100 free cards is the right paywall line, generous enough to hook, tight enough to convert the serious. To validate: distribution of collection sizes at day 30; adjust before public launch if the median free user sits at 95.
7. We assume collectors will pay $6/mo for tracking without marketplace features, because Card Ladder charges more for one game. To validate: first 90 days of Trader conversion against the 5 percent benchmark.
8. We assume community-first GTM works without Robin being a known name in these communities. To validate: two build-in-public posts per week for a month; measure whether engagement compounds or flatlines.

### User Journey Map

**Awareness.** Marcus sees a screenshot in r/mtgfinance: a warm, serif-set portfolio hero showing "$4,281, +3.2% this week" above a chart. It looks like a brokerage app that collects Magic cards. Curiosity, mild skepticism ("another tracker?"). Friction: the thread's third comment asks "does it do Pokémon?" and the answer must be yes.

**Consideration.** He clicks through to a card page (SEO or shared link) for a card he owns. Full price history, per-condition prices, freshness chip. No signup wall for looking. Feeling: "the data seems real." Friction: any stale or wrong price here ends the journey.

**First use.** He signs up with Google (one tap, Convex Auth), lands on an empty portfolio with one instruction: "Search for any card to start tracking its value." He searches his Cradle, picks LP, enters what he paid in 2011, adds it. The portfolio exists. Feeling: momentum. Friction: search must be fast and forgiving of misspellings; the variant picker must not confuse.

**Magic moment.** Around card ten, maybe eight minutes in, the hero shows a real number with a real chart. He learns his closet's headline figure for the first time in years. He screenshots it. This is the moment the product exists for; everything before it must be frictionless enough to survive one lazy evening.

**Habit formation.** Kiri emails him when a card crosses a threshold he set, and a weekly digest summarizes movement. He opens the app most mornings alongside his brokerage. Feeling: quiet competence. Friction: alert noise; one false or spammy alert teaches him to ignore all of them.

**Advocacy.** A guildmate asks what his deck is worth; Marcus answers in seconds and shares his portfolio screenshot. Later, he sends his first trade offer link and Theo becomes a user. Advocacy here is not referral programs; it is screenshots and links doing their native work.

## 3. Product Strategy

### Product Principles

1. **Never make the user wait for the API.** All prices render from our snapshot cache instantly; the rate-limited upstream is invisible. If a card is not yet cached, say so honestly and backfill within a day.
2. **The portfolio number is sacred.** Anything that could make the total misleading (unpriced variants, missing conditions, stale data) must be visibly flagged, not silently approximated.
3. **Ten cards in three minutes.** The entire pre-magic-moment funnel is optimized to this budget. Every added field in the add-card flow must justify itself against it (this is why date-acquired is optional).
4. **Read like a catalog, calculate like a terminal.** Editorial serif warmth on the surface, tabular-numeral rigor underneath. Neither is negotiable; the tension is the brand.
5. **Game-agnostic by construction.** No feature ships that assumes Magic. The rarity ladder, variant model, and portfolio math already generalize; keep it that way.
6. **Alerts earn their notifications.** Every alert is user-configured, deduplicated, and rate-limited. Kiri never manufactures urgency.

### Market Differentiation

The tracking space splits into data tools and inventory tools. Data tools (Card Ladder, PriceCharting) have depth but feel like analyst terminals: dense tables, single-game focus, interfaces that repel the casual-serious collector. Inventory tools (Collectr, TCGplayer's collection tab) are easy but financially shallow: they list what you own without really answering how you are doing. Nobody occupies the position every retail brokerage figured out a decade ago: real financial mechanics (cost basis, P&L, movers, history) wrapped in an interface a normal person enjoys opening.

That position matters to Marcus specifically because his relationship to the collection is financial and emotional at once; a terminal serves only the first and an inventory list serves neither well. It is defensible for two compounding reasons. First, design quality of this specificity (a complete, documented token system with a codified voice) is genuinely hard to copy; incumbents would need to rebuild their identity, not restyle a page. Second, every day of operation accretes proprietary price history into our own database, and switching costs grow with every card and alert a user configures. Multi-game coverage is the third leg: it is a checkbox for us and an architectural rewrite for the single-game incumbents.

### Magic Moment Design

The moment: a new user adds their first handful of cards and the portfolio hero renders their total worth, today's change, and a chart. For this to happen reliably in the MVP:

- Search must return the right card in the top three results for a partial, misspelled query, across all four games. This is a data-normalization problem as much as a UI one.
- The add flow must default intelligently: Near Mint, normal printing, quantity one, price-paid optional. Two taps for the common case, full control available.
- The portfolio hero must look meaningful at small n. At three cards, show the total and per-card contributions rather than an empty-feeling chart; the chart earns its place as history accumulates (we own snapshots only from the day a card enters our catalog, so day-one charts may be shallow; design for that honestly with the freshness chip and a "history builds daily" note).
- Sign-up must not precede value. Card pages are public; the wall arrives only at "Add."

Shortest path: land on any card page → Add (Google sign-in inline) → variant defaults → repeat ~9 times with instant search → hero. Target: under three minutes, under ten seconds per add. The moment is achievable in MVP scope as defined; nothing in the must-have list is deferrable without breaking it.

### MVP Definition

Buildable in 6-8 weeks of nights-and-weekends with Claude Code, on top of the already-complete design system:

1. **Card catalog + search.** Typeahead search across Magic, Pokémon, Yu-Gi-Oh, and Sorcery, backed by our Convex cache of JustTCG data with on-demand backfill. Done means: any reasonably spelled card name in the top results in under 500ms from cache, with set, number, and rarity visible per the designed combobox.
2. **Card page with price history.** Per-variant (condition × printing) prices, Lightweight Charts price history from our snapshots, 7/30/90-day stats, freshness chip. Public and indexable. Done means: matches the designed price-chart story pixel-for-pixel, renders from cache only.
3. **Portfolio.** Add/edit/remove holdings with variant, quantity, and optional cost basis; hero with total value, daily delta, and chart; holdings table with P&L; allocation bar. Done means: the designed dashboard, live, with values recomputed from each nightly snapshot.
4. **Price alerts.** Above/below thresholds per card variant, email (Resend) plus in-app notification panel, evaluated after each nightly snapshot. Free tier: one alert. Done means: alert fires exactly once per crossing, with a link to the card.
5. **Watchlist.** Cards you follow but do not own, with sparkline rows. Done means: the designed spark-row list, one tap from any card page.
6. **Accounts + tiers.** Convex Auth (Google, Apple, magic link), free tier limits (100 cards, 1 alert), Polar checkout for Trader ($6/mo) and Dealer ($15/mo) unlocking unlimited cards and alerts. Done means: a free user hits the limit, upgrades, and continues without losing state.
7. **Nightly snapshot engine.** Convex scheduled jobs that refresh cached cards within the API budget, prioritized by ownership and watch count. Done means: every owned or watched card refreshes daily; the freshness chip never exceeds 24h for those cards. This is invisible infrastructure but it is the product's heart, so it is a named MVP feature.

### Explicitly Out of Scope

- **Trading (offers, timelines, comments).** Tempting because it is in the one-liner and fully designed. Deferred because it requires two-sided liquidity the product will not have at launch; shipped to empty rooms, trading would read as failure. Reconsider at ~1,000 users or when two users organically ask to trade in the same week. Target: months 4-6.
- **CSV import.** Tempting because it harvests spreadsheet sunk cost and Dana needs it. Deferred because column-mapping across community formats is a swamp, and hand-entry validates search quality first. Reconsider immediately after launch metrics confirm the funnel; likely the first post-MVP feature. Target: month 3.
- **Graded cards and sealed product.** Tempting because collector-investors care (PSA slabs are half of r/mtgfinance). Deferred because JustTCG's grading coverage needs evaluation and the variant model gains a dimension. Reconsider at month 6.
- **Native mobile apps.** The responsive web behaviors are fully specced and sufficient. Reconsider when weekly retention proves the habit loop, not before.
- **Deck building, marketplace, social feeds.** Off-strategy (see pillars). Trading is the only community feature on the horizon.

### Feature Priority (MoSCoW)

- **Must have:** card search; card page with per-variant prices and history chart; portfolio with hero, holdings table, P&L, cost basis; nightly snapshot engine with freshness chips; accounts with free-tier limits; Polar subscriptions; one price alert (free) with email delivery; watchlist; responsive mobile behavior; error/empty/loading states per the design system.
- **Should have (fast follows):** CSV import; unlimited alerts UX polish (bulk management); weekly email digest; allocation by game/set/rarity views; public shareable portfolio snapshot image.
- **Could have:** trade offers with value deltas and timelines; comparison charts; comments on trades; onboarding checklist; PWA install prompt.
- **Won't have (this time):** marketplace or checkout of any kind; graded/sealed tracking; native apps; deck builder; forums or feeds; multi-currency (USD only at launch).

### Core User Flows

**Flow 1: First card to magic moment.** Trigger: new user lands on a card page or empty portfolio. Steps: search card → select from typeahead (set/number/rarity visible) → Add → variant picker defaults NM/normal/qty 1 → optional price paid → confirm → repeat. Outcome: portfolio hero renders total, delta, chart at n≥1, meaningfully at n≈10. Success criteria: median time signup → 10th card under 8 minutes; ≥60 percent of signups reach first card, ≥40 percent reach tenth.

**Flow 2: The alert that comes back.** Trigger: user sets "alert me when Kiri, Mist Courser goes above $50" on a card page. Steps: threshold input (above/below) → confirm → nightly snapshot evaluates → crossing detected → email + notification panel entry with the price and a link. Outcome: user returns, views the chart, acts (sells elsewhere, adjusts alert, or smugly holds). Success criteria: alert-triggered sessions ≥25 percent of weekly active sessions by day 60; zero duplicate fires per crossing.

**Flow 3: Daily check-in.** Trigger: morning habit. Steps: open Kiri → hero (number, delta) → top movers → maybe tap a mover's chart. Outcome: a 40-second session that ends the "how are we doing" itch. Success criteria: ≥3 sessions/week among users with ≥25 cards; session depth of at least one mover tap 30 percent of the time.

### Success Metrics

**Primary metric: weekly active portfolios** (accounts with ≥10 cards that open the app in a 7-day window). Good at day 90: 50. Great: 120. This single number proves both acquisition and the habit loop.

**Secondary metrics.** Signups (good 200 / great 500 by day 90); Trader conversions (good 10 / great 30); funnel completion signup→10 cards (good 40% / great 60%); MRR (good $60 / great $250); D30 retention of activated users (good 25% / great 40%).

**Leading indicators.** Time-to-tenth-card (watch weekly; the magic-moment budget); search no-result rate (below 5 percent or the catalog has holes); alert opt-in rate among activated users (above 30 percent signals the retention engine is loading); community post engagement per build-in-public update.

### Risks

1. **JustTCG dependency (high likelihood of friction, high impact).** Data errors, coverage gaps, tier-pricing changes, or the service folding would strike the product's heart. Mitigation: own every snapshot from day one (our history survives even if the source changes), abstract the price-provider interface so TCGplayer's API or scraped solds can substitute, and budget for the paid tier immediately at traction.
2. **Rate-limit math fails at scale (medium, high).** 100 requests/day × 20 cards covers ~2,000 card refreshes; a few hundred active users with distinct cards exceed it. Mitigation: refresh prioritization by ownership/watch counts already in the MVP design; paid tier lifts limits by orders of magnitude for tens of dollars; this is a cost curve, not a cliff.
3. **Solo-founder stall (high, high).** Nights-and-weekends projects die at week ten, historically. Mitigation: the roadmap's phases each end demoable; build-in-public posts create external cadence; the design system already being done removes the single biggest time sink.
4. **Trust failure on data accuracy (medium, severe).** One viral "Kiri's prices are wrong" thread poisons the well. Mitigation: freshness chips everywhere, a visible data-source page, cross-checks before launch, and fast correction paths (report-a-price link on every card page).
5. **Card Ladder or Collectr ships multi-game portfolio polish (medium, medium).** Mitigation: speed to community mindshare, design differentiation they cannot quickly copy, and the trade-link loop as a structural acquisition edge they lack.
6. **Retention cliff after the magic moment (medium, high).** The reveal is strong but daily value depends on alerts and movement; flat markets make quiet apps. Mitigation: weekly digest emails, watchlists (wanting cards is evergreen even when owning is calm), and honest measurement of D30 before scaling acquisition.
7. **Conversion resistance at $6 (medium, medium).** Collectors are spendy on cards, stingy on software. Mitigation: the 100-card free line targets exactly the moment of demonstrated seriousness; annual pricing (save 20 percent, already designed) smooths the ask; Dealer tier diversifies revenue.
8. **Community GTM falls flat without standing (medium, medium).** Subreddits smell self-promotion. Mitigation: build in public as a collector first (share the portfolio, not the pitch), contribute price answers using Kiri screenshots, and let the artifact's quality carry the thread.

## 4. Brand Strategy

### Positioning Statement

For collector-investors who have real money in cards but no idea what their collection is doing, Kiri is the portfolio app that tracks, values, and charts every card across every game. Unlike single-game trackers and marketplace inventory tabs, Kiri treats a collection the way a brokerage treats a portfolio, in an interface crafted like the collection deserves.

### Brand Personality

Kiri is the trusted appraiser: the friend who has handled thousands of cards, quotes values from memory, and never once hyped a spike. In conversation they are calm and precise, generous with knowledge, allergic to exclamation marks. They would rather say "I don't have fresh data on that" than guess. They dress in earth tones, keep their collection in kiri-wood boxes with paper labels, and their desk is the tidiest in the shop. They would never rush you into a sale, never gloat over a gain, never mock a sentimental hold. When your card drops 30 percent they tell you plainly and stay in the room. The interface equivalent: warm paper surfaces, serif gravity, tabular numbers, and silence where other apps would put confetti.

### Voice & Tone Guide

The voice is constant: quiet confidence, sentence case, plain statements, collector-to-collector respect. Tone flexes by context: slightly warmer in onboarding, strictly factual around money, briefly human in errors.

| Context | DO | DON'T |
|---|---|---|
| Onboarding | "Search for any card to start tracking its value." | "Let's get you set up! 🚀 First, tell us about yourself!" |
| Empty states | "No cards in your portfolio yet. Search for any card to start tracking its value." | "It's lonely in here! 😢 Add some cards!" |
| Error states | "Card could not be added: collection limit reached." | "Oops! Something went wrong!" |
| Success messages | "Deck saved to your collection." | "Awesome!! Your deck has been saved successfully!!" |
| Price movement | "Kiri, Mist Courser passed your $50.00 alert · now $52.40" | "🔥 Your card is MOONING! Check it out NOW!" |
| Marketing copy | "Know what your collection is worth. Every card, every game, every day." | "The ULTIMATE game-changing TCG portfolio revolution!" |
| Data honesty | "Prices updated 2h ago" (always visible) | Hiding staleness, or "real-time prices" claims we cannot keep |

### Messaging Framework

**Tagline:** Know what your collection is worth.

**Homepage headline:** Know what your collection is worth. **Subhead:** Track prices across Magic, Pokémon, Yu-Gi-Oh, and Sorcery. Add cards in seconds, follow every swing, and trade with confidence.

**Value propositions:**
1. Your whole collection, one number: portfolio value, daily change, and P&L across every game you collect.
2. Prices you can check the freshness of: every number is dated, charted, and per-condition.
3. The market watches itself: alerts tell you when a card you own or want crosses your line.

**Feature descriptions** follow the pattern *plain capability, then the payoff*: "Price alerts. Set a threshold on any card; Kiri emails you when it crosses. Sell the spike instead of reading about it."

**Objection handlers.** *"Another tracker?"* Trackers list cards; Kiri does portfolio math (cost basis, P&L, movers) and covers all your games in one place. *"Are the prices legit?"* Market data refreshed nightly, per condition and printing, with the update time printed next to every number. *"Why pay when spreadsheets are free?"* Your spreadsheet was stale the day you made it; Kiri reprices your collection every night while you sleep. *"Does it do [game]?"* Magic, Pokémon, Yu-Gi-Oh, and Sorcery at launch; the model is game-agnostic on purpose.

### Elevator Pitches

**5 seconds:** Kiri is the stock app for your card collection.

**30 seconds:** Collectors have thousands of dollars in cards and no idea what the pile is worth this month. Prices exist for every card individually; the portfolio view exists nowhere. Kiri tracks, values, and charts your whole collection across Magic, Pokémon, Yu-Gi-Oh, and Sorcery: cost basis, P&L, daily movement, and alerts, in an app that looks like it respects the hobby.

**2 minutes:** Every serious card collector has the same closet: binders and boxes accumulated over years, worth real money, tracked nowhere. The prices exist (TCGplayer, eBay, forums) but only card by card; nobody can tell you what your collection did this month, the way any brokerage tells you about your stocks. The tools that try are single-game analyst terminals or shallow inventory lists. Kiri closes that gap: search any card across the four major games, add it with condition and what you paid, and your collection becomes a living portfolio with a value, a chart, P&L, and alerts that watch the market overnight. The magic moment is three minutes in, when someone learns their childhood binder is worth $2,300 and screenshots it. I'm building it solo: ten years of product design at Crunchyroll for exactly this kind of passionate audience, front-end engineering roots, and a closet of my own cards. The design system shipped before the first feature; the product will feel like the collection deserves. Freemium at $6/mo when your collection passes 100 cards. I'm looking for beta collectors from the price-tracking communities.

### Competitive Differentiation Narrative

The card-collecting economy has marketplaces for buying, terminals for researching, and lists for inventorying, but no home for the question every collector actually asks: how is my collection doing? Card Ladder answers it for Magic alone, in an interface built for analysts. Collectr lists what you own without the financial mechanics that make ownership legible. TCGplayer knows every price and treats your collection as a shopping list. Kiri takes the position none of them can easily reach: a true portfolio product (cost basis, P&L, movers, history, alerts) spanning every game a real closet contains, designed with the craft of a premium finance app rather than the density of a database. The moat compounds in two directions: proprietary daily price history that deepens from day one, and a design language, documented down to the token, that turns every user screenshot into an advertisement no competitor's screenshot can match.

## 5. Visual Design

Visual design tokens (colors, typography, spacing, components, motion) live in `docs/design.md`, with a browsable component guide in `docs/design.html`. The design system is complete: 90+ components across foundations, forms, data, charts, marketing, community, and page templates, specified for keyboard, dark mode, and mobile. It was built before this document, which means the PRD and roadmap can reference implemented-and-verified designs rather than intentions.
