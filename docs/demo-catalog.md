# Demo Catalog Seeder

`convex/demoCatalog.ts` fills the catalog with roughly 200 well-known cards
from free, keyless APIs so the app demos end to end without the paid JustTCG
key. It seeds games, sets, cards, variants, current prices, and a synthetic
90-day price history per variant.

## Run it

```bash
npx convex run demoCatalog:seedAll
```

Safe to re-run: everything flows through the same upsert mutation the JustTCG
sync uses (`syncDb.upsertCardFromApi`). Cards key on a stable
`demo-<game>-<set>-<number>` id, variants on `<cardId>-normal` / `<cardId>-foil`,
and daily price snapshots dedupe on (variant, day). Nothing is deleted.

## What it seeds, per game

| Game | Source (verified 2026-07-16) | Cards | Prices | Images |
| --- | --- | --- | --- | --- |
| Magic: The Gathering | Scryfall `GET /cards/search?q=game:paper usd>=15&order=usd&dir=desc` | ~60 top-value paper cards | real `prices.usd` / `usd_foil` | `image_uris.normal` (DFC fallback to first face) |
| Pokémon | pokemontcg.io `GET /v2/cards?pageSize=50&q=rarity:"Rare Holo" OR rarity:"Rare Secret"` | ~50 holo rares | real `tcgplayer.prices.*.market` | `images.large` |
| Yu-Gi-Oh! | YGOPRODeck `GET /api/v7/cardinfo.php?name=A|B|C` (about 50 iconic staples by exact name) | ~50 staples | priciest known-rarity printing's `set_price`, fallback `tcgplayer_price` | `card_images[0].image_url` (hotlinked; fine at demo volume) |
| Sorcery: Contested Realm | api.sorcerytcg.com `GET /api/cards` (community API) | 40 Alpha cards, 10 per rarity | synthesized per rarity band (the API has no prices) | none — the UI's gradient placeholder renders; Philosopher's Stone uses the self-hosted `/cards/philosophers-stone.jpg` |

If the Sorcery community API is down, a hardcoded fallback list of 12 real
Alpha cards is seeded instead.

## Price history

Each variant gets a 91-point daily history (today plus 90 days back):
a backwards random walk around the real current market price with ±0.5%
daily drift. The walk is deterministic — the PRNG is seeded on the variant
id — so re-runs regenerate the same curve. `change7d` / `change30d` /
`change90d` on the variant are computed from the same walk, so the chart,
the deltas, and the current price always agree.

## Vocabulary conformance

Upstream rarity strings are pre-filtered to labels that
`convex/lib/normalize.ts` knows for each game, so `rarityTier` lands on the
design system's six-tier ladder without "unknown rarity" warnings. All demo
variants are Near Mint; printings are `Normal` and, where a real foil price
exists, `Foil`.
