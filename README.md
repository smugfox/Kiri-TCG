# Kiri

Design system and product planning for **Kiri**, a TCG portfolio web app: Robinhood-style price tracking, collection portfolio with P&L, card database, and trading across Magic, Pokémon, Yu-Gi-Oh, and Sorcery.

## What's here

- `docs/design.md` · the design system source of truth: YAML tokens + prose spec ([design.md format](https://github.com/google-labs-code/design.md)). Coding agents build from this.
- `docs/design.html` · the human-readable mirror: a self-contained, Storybook-style guide (77 stories, Preview / HTML / CSS / Docs tabs, hash-routed pages, light/dark). The two files always change together.
- `memory/` · Claude Code memory files (project decisions, build log, working preferences).
- `.env.example` · copy to `.env` and add the JustTCG API key (not committed).

## Working on a new machine

1. Clone, then copy `.env.example` to `.env` and fill in `JUSTTCG_API_KEY`.
2. Serve the docs folder so the style guide's Docs tabs can read design.md:
   ```
   python3 -m http.server 8934 --directory docs
   ```
   Then open http://localhost:8934/design.html. (Opening the file directly also works, minus the Docs tabs.)
3. To give Claude Code its memory on this machine, copy `memory/*` into
   `~/.claude/projects/<escaped-project-path>/memory/` for wherever you cloned the repo
   (the escaped path replaces `/` with `-`, e.g. `-Users-you-code-TCGDS`).

## Stack decisions so far

JustTCG API for prices (free tier; per-variant priceHistory + 7/30/90d stats) · Lightweight Charts · Lucide icons · Newsreader + Geist type. See `memory/tcg-site-stack-decisions.md`.

## Running the app

```
npm install
npx convex dev        # terminal 1: local backend (keep running)
npx next dev -p 3100  # terminal 2: the app
```

`.env.local` is created by `npx convex dev`. Set secrets in the Convex env
(`npx convex env set KEY value`), never in client code.

## Launch checklist (production)

### Convex + Vercel
1. `npx convex login && npx convex deploy` creates the prod deployment.
2. Vercel env: `NEXT_PUBLIC_CONVEX_URL` (prod convex.cloud URL), `NEXT_PUBLIC_SITE_URL`.
3. Convex prod env: regenerate `JWT_PRIVATE_KEY` + `JWKS` (jose, RS256), `SITE_URL`,
   `JUSTTCG_API_KEY`, `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` (add the prod
   `.convex.site` redirect URI in Google Cloud Console), optional `AUTH_APPLE_*`.
4. Seed: `npx convex run seed:init`, `sync:seedSets`, then `sync:seedStaples`
   (re-run across days until `remaining: 0`).

### Email (Resend)
- Verify a sending domain (SPF + DKIM records in DNS), then set
  `RESEND_API_KEY` and `ALERTS_FROM_EMAIL` in the Convex env.
- Until keyed, alert emails log-and-skip; in-app notifications work fully.

### Payments (Polar)
- Create the org (sandbox first): products Trader ($6/mo, $57.60/yr) and
  Dealer ($15/mo, $144/yr).
- Convex env: `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_SANDBOX`
  (`false` for live), and the four `POLAR_PRICE_*` product ids.
- Point the Polar webhook at `https://<deployment>.convex.site/polar/webhook`.
- Until keyed, upgrade CTAs show a quiet "checkout isn't live yet" toast.

### Analytics + monitoring
- PostHog: `NEXT_PUBLIC_POSTHOG_KEY` (+ `NEXT_PUBLIC_POSTHOG_HOST` for EU) in Vercel.
  Funnel: signup → first_card_added → tenth_card_added.
- Sentry: `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN`; config is wired and env-gated.

### JustTCG budget
- Free tier: 100 requests/day (90 nightly refresh + 10 search backfill),
  20 cards per request ≈ 2,000 tracked variants.
- Watch `npx convex run status:budget`. When unique owned+watched variants
  approach 2,000, move to the paid tier and raise `DAILY_BUDGET` /
  `BACKFILL_BUDGET` in `convex/lib/budget.ts`; no other change needed.

### Support
- Set a support address (e.g. support@ on the sending domain) and put it in
  the footer before announcing.

The BuilderOS **Launch Checklist** skill generates the founder-facing
go-live guide from this repo when you're ready:
https://github.com/BuildGreatProducts/builder-os
