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
