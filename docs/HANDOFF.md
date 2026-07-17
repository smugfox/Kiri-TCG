> **Superseded (Jul 17, 2026).** This handoff predates the portfolio-prototype
> pivot: the app now runs keyless via the demo catalog
> (`npx convex run demoCatalog:seedAll`, see docs/demo-catalog.md and the
> README), sign-in is demo-first (anonymous accounts), /news exists, and the
> project deploys to Vercel + Convex cloud. Treat the seeding and env steps
> below as historical.

# Handoff · July 8, 2026

Written for picking the build up on the laptop. State of the world, how to
resume, and the Phase 5 summary as delivered.

## Where we left off

- **Roadmap: 60/68 tasks.** Phases 0–5 are complete. Only Phase 6
  (post-launch iteration, evolving backlog) remains.
- **PR #6 is open** (Phase 5: Polish & Launch Prep) on branch
  `phase-5/polish-launch-prep`. Review and merge it first; everything
  before it (PRs #1–#5) is merged into `main`.
- The full production go-live checklist lives in **README.md § Launch
  checklist**. The remaining work is mostly founder steps: Polar org,
  Resend domain + key, PostHog key, Sentry DSN, prod Convex deploy.
- Flagged for beta testing (code-complete, not live-verified): account
  deletion, magic-link reuse. Known Phase 6 item: search relevance for
  hyphenated names ("blue-eyes white dragon" ranks sealed products first).

## Resuming on the laptop · IMPORTANT

The desktop ran an **anonymous local Convex deployment**. Its database
(cards, your portfolio, alert, price history) lives only on the desktop
machine and does not travel with the repo. A fresh clone gets a fresh,
empty backend. To set up:

1. Clone, `npm install`.
2. Copy `.env` from the desktop (gitignored; holds `JUSTTCG_API_KEY`) or
   re-create it from the JustTCG dashboard.
3. Terminal 1: `npx convex dev` (creates the new local deployment and
   `.env.local`). Terminal 2: `npx next dev -p 3100`.
4. Convex env setup (values from your dashboards; none are in the repo):
   ```
   npx convex env set JUSTTCG_API_KEY <key>
   npx convex env set SITE_URL http://localhost:3100
   npx convex env set AUTH_GOOGLE_ID <id>        # Google Cloud Console
   npx convex env set AUTH_GOOGLE_SECRET <secret>
   ```
   The local OAuth redirect URI `http://127.0.0.1:3211/api/auth/callback/google`
   is already registered on the Google client.
5. Generate auth signing keys (Convex Auth can't mint sessions without
   them — this was the Phase 0 sign-in bug):
   ```
   node --input-type=module -e "
   import { exportJWK, exportPKCS8, generateKeyPair } from 'jose';
   const k = await generateKeyPair('RS256', { extractable: true });
   console.log('JWT_PRIVATE_KEY=' + (await exportPKCS8(k.privateKey)).trimEnd().replace(/\n/g, ' '));
   console.log('JWKS=' + JSON.stringify({ keys: [{ use: 'sig', ...(await exportJWK(k.publicKey)) }] }));"
   ```
   then `npx convex env set` each of the two values.
6. Seed the catalog: `npx convex run seed:init`, then
   `npx convex run sync:seedSets`, then `npx convex run sync:seedStaples`
   (re-run until `remaining: 0`; it is budget-guarded at 100 requests/day).
7. Claude Code memory: copy `memory/*` into
   `~/.claude/projects/<escaped-clone-path>/memory/` per the README.

## Phase 5 summary (as reported)

The highlights of what just landed:

**Measured:** PostHog is wired through the whole magic-moment funnel
(signup → first card → tenth card, plus alerts, checkout, and subscription
events) but stays dormant until you add a key. In dev the events log to
the console so you can watch them fire today.

**Fast:** lazy-loading the chart library and PostHog cut the card page
from 297KB to 229KB gzipped (landing 226KB), comfortably under the PRD's
250KB budget.

**Accessible:** axe scans now report zero violations on all main routes.
The interesting fix was design-level: the green delta pills were failing
AA contrast at 4.11:1, so the design system gained a recipe that mixes
70–80% of the trend color into ink; same hue, legible everywhere, spec'd
in design.md.

**Honest about staleness:** the 36-hour "price updates are delayed"
banner is live, and testing caught it firing falsely because it was keyed
to when prices last changed upstream rather than when we last synced. It
now measures our pipeline, which is what it's actually for.

**Seeded:** 641 staple cards across all four games ingested in one
budget-guarded run: Charizard, Sol Ring, Dark Magician and friends all
have populated pages and charts for first visitors. The seeder is
cache-aware and re-runnable.

**Documented:** README now carries the complete production checklist:
every env var, the Resend DNS steps, the Polar live-mode switch, and the
signal for when to move JustTCG to the paid tier (~2,000 tracked
variants).

## Next actions, in order

1. Merge PR #6.
2. Walk README § Launch checklist (founder accounts: Polar, Resend,
   PostHog, Sentry; then prod Convex + Vercel envs).
3. Beta-test the two unverified flows (deletion on a throwaway account,
   magic link once Resend is keyed).
4. Phase 6 backlog: search-relevance pass, mobile-sheet search row,
   full-set pulls on the paid tier, portfolio case-study writeup
   (deferred from the design-system session).
