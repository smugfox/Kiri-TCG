---
name: build-progress
description: "Kiri build state as of July 8, 2026: phases 0-5 done (60/68), PR #6 open, what's verified vs pending"
metadata:
  type: project
---

Kiri (smugfox/Kiri-TCG) build state, July 8, 2026. Phases 0-5 of the 7-phase
roadmap are complete: 60/68 tasks. PR #6 (Phase 5: Polish & Launch Prep) is
open; PRs #1-#5 are merged. See [[tcg-site-stack-decisions]] for the stack and
docs/HANDOFF.md in the repo for full resume instructions.

Shipped and live-verified: Google sign-in (JWT keys were the Phase 0 bug),
catalog search + on-demand JustTCG backfill, set catalog (1,276 sets) with
on-click set pulls, portfolio with merge-on-duplicate + weighted cost basis,
crossing-semantics alerts (fired exactly once across two runs), notifications
bell, watchlist, Polar billing verified end to end with locally signed
webhooks (activate → trader, replay no-op, revoke → free), pricing/landing/
settings pages, nav with command-K search overlay, axe zero violations,
bundles under 250KB gz, 641 staple cards seeded.

Product decisions from founder review this session: card tile variant C
(name/set/rarity/price each on own line, native rarity names like "Mythic
Rare"); rarity filters gated by game with per-game native ladders
(src/lib/rarities.ts); language is a variant dimension, never a printing
column (English default, select unlocks others, unpriced versions addable as
local: placeholder variants); day-one charts draw a flat Robinhood-style line
at today's value; danger-card button centers against copy; billing card shows
live usage meters; allocation bar needs 2+ games; components never cap their
own width/height (context decides).

Pending founder steps: Polar org + keys, Resend domain + key, PostHog key,
Sentry DSN, prod Convex deploy (README § Launch checklist). Not live-verified:
account deletion, magic-link reuse. Phase 6 seeds: hyphenated-name search
relevance, mobile-sheet search row, full-set pulls on paid tier, portfolio
case-study writeup.

**Why:** resuming on another machine or after a gap needs this state without
re-reading five PRs.
**How to apply:** trust the verified list; start any new session by checking
PR #6 status and docs/HANDOFF.md; the local Convex database does not transfer
between machines (re-seed per HANDOFF).
