/**
 * The news desk's articles. A static module stands in for a CMS in this
 * portfolio prototype; the shapes are what a real backend would return.
 */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; attribution: string };

export type Article = {
  slug: string;
  title: string;
  standfirst: string;
  date: string;
  read: string;
  category: "Market" | "Collecting" | "Strategy" | "Sets";
  cover?: string;
  author: string;
  role: string;
  featured?: boolean;
  body: ArticleBlock[];
};

export const ARTICLES: Article[] = [
  {
    slug: "the-one-ring-third-rally",
    title: "The One Ring Keeps Climbing: What Its Third Rally Tells Us",
    standfirst: "Three spikes in twelve months is not hype, it is a supply story. We chart every reprint rumor against the price line.",
    date: "Jul 14, 2026", read: "12 min read", category: "Market",
    cover: "/cards/the-one-ring.jpg",
    author: "Robin Fox", role: "Market Desk", featured: true,
    body: [
      { type: "p", text: "Three spikes in twelve months is not hype, it is a supply story. When The One Ring first cleared $60 in early 2025, the market called it a fluke of movie-adjacent sentiment. The second rally looked like buyout mechanics. This third one is different: slower, broader, and stubbornly resistant to profit-taking." },
      { type: "p", text: "The pattern matches what we saw with reserved-list staples in 2020, but compressed. Singles supply concentrates into fewer hands each cycle, and every reprint rumor that fails to materialize ratchets the floor upward." },
      { type: "quote", text: "Everyone is waiting for the reprint that makes this affordable. The market has started pricing in the possibility that it never comes.", attribution: "Amara Diallo, buylist manager, quoted with permission" },
      { type: "h", text: "What the price line actually shows" },
      { type: "p", text: "Chart the three rallies against announcement windows and a pattern emerges: each spike begins roughly two weeks after a set reveal that could have contained the reprint and did not. The market is not reacting to demand. It is reacting to the absence of supply news." },
      { type: "p", text: "For collectors tracking a copy in Kiri, the practical takeaway is the alert threshold. Set it above the previous rally's peak, not below: this card's floor has moved up three times, and the exits that mattered were on the way up." },
      { type: "h", text: "The collector's position" },
      { type: "p", text: "If you hold one, nothing here says sell. If you want one, the uncomfortable truth is that the three best buying windows of the last year were all quiet weeks after failed reprint rumors, and patience beat timing every time." },
    ],
  },
  {
    slug: "moonbreon-modern-grail",
    title: "Moonbreon at $1,300: Anatomy of the Modern Grail",
    standfirst: "Evolving Skies did everything wrong for sealed collectors and everything right for Umbreon. A case study in chase-card economics.",
    date: "Jul 11, 2026", read: "9 min read", category: "Market",
    cover: "/cards/umbreon-vmax.png",
    author: "Robin Fox", role: "Market Desk",
    body: [
      { type: "p", text: "Every era of the Pokemon TCG produces one card that becomes shorthand for the whole hobby. Base Set had Charizard. The Sword and Shield era has the Evolving Skies alternate-art Umbreon VMAX, and its path to $1,300 explains more about modern collecting than any market report." },
      { type: "p", text: "The recipe was almost accidental: a beloved Eeveelution, a moonlit alternate art with genuine composition, and a set whose pull rates made the card a statistical event rather than a purchase." },
      { type: "h", text: "Scarcity by pull rate, not print run" },
      { type: "p", text: "Evolving Skies was printed to meet demand; the alt-art slot was not. That distinction is the whole story. Sealed product stayed available for years while the card itself concentrated into graded slabs, and every restock of boosters reset the lottery without resetting the odds." },
      { type: "p", text: "Kiri's nightly line shows the result: a chase card whose drawdowns keep getting shallower, because each dip meets buyers who watched the last one." },
    ],
  },
  {
    slug: "sorcery-alpha-foils",
    title: "Sorcery's Alpha Foils Are Quietly Outperforming Everything",
    standfirst: "The Philosopher's Stone doubled while blue chips slept. Inside the smallest, strangest corner of the TCG market.",
    date: "Jul 8, 2026", read: "11 min read", category: "Collecting",
    cover: "/cards/philosophers-stone.jpg",
    author: "Robin Fox", role: "Collector's Desk",
    body: [
      { type: "p", text: "While the big three games argued about reprints, the strangest performer of the year came from a game most collectors have never played. Sorcery: Contested Realm's Alpha foils have posted the quietest, steadiest climb in the hobby, led by the Philosopher's Stone." },
      { type: "p", text: "The mechanics are old-fashioned in the best way: a genuinely small first print run, foils as a fraction of it, and a player base that skews collector-first." },
      { type: "h", text: "Small ponds, deep value" },
      { type: "p", text: "The risk is liquidity. A card that doubles on twelve sales can halve on six. But as a study in what makes cardboard appreciate, nothing this year has been cleaner: real scarcity, real demand, and no supply overhang waiting in a warehouse." },
      { type: "quote", text: "Alpha foils feel like 1993 again, except everyone knows it this time.", attribution: "A dealer at the Contested Realm regional, who asked not to be named" },
    ],
  },
  {
    slug: "grading-2026-psa9-vs-raw",
    title: "Grading in 2026: When PSA 9 Beats a Raw Near Mint",
    standfirst: "We priced 400 slabs against their raw twins across four games. The premium is real, but only above a threshold.",
    date: "Jul 5, 2026", read: "14 min read", category: "Collecting",
    cover: "https://d27a44hjr9gen3.cloudfront.net/cards/001-boneyard-b-s.png",
    author: "Robin Fox", role: "Collector's Desk",
    body: [
      { type: "p", text: "The grading question has a lazy answer (grade everything valuable) and a real answer, which depends on the card, the game, and a threshold that moved twice this year. We compared 400 graded sales against raw near-mint copies of the same printing to find it." },
      { type: "h", text: "The threshold" },
      { type: "p", text: "Below roughly $150 raw, a PSA 9 is a fee-shaped hole in your margin. Above it, the slab premium clears grading costs in every game we tracked, and for vintage it clears them threefold. The surprise was condition-sensitive modern: full-art surfaces chip so easily that a 9 now functions as proof of preservation rather than a discount grade." },
      { type: "p", text: "Kiri tracks per-condition prices nightly, which makes the math checkable for your own binder instead of ours." },
    ],
  },
  {
    slug: "budget-blue-eyes-tier-deck",
    title: "Budget Blue-Eyes: A Tier Deck for Under $40",
    standfirst: "Ranked play without the wallet damage. Every swap explained, every cut justified.",
    date: "Jul 2, 2026", read: "7 min read", category: "Strategy",
    cover: "https://images.pokemontcg.io/base1/4_hires.png",
    author: "Robin Fox", role: "Play Desk",
    body: [
      { type: "p", text: "The full-power list runs $600. Ours runs $38.50 at last night's prices and keeps the deck's actual game plan intact, because the expensive cards in this archetype are upgrades, not engines." },
      { type: "h", text: "Where the money was not doing anything" },
      { type: "p", text: "Three of the four premium staples in the meta list are there to win mirrors at tournament pace. On ladder, their budget stand-ins cost you almost nothing in win rate, and every swap in this list is priced live so you can watch for the moment an upgrade dips into range." },
    ],
  },
  {
    slug: "set-review-edge-of-eternities",
    title: "Set Review: Edge of Eternities for Collectors, Not Players",
    standfirst: "The playables are obvious. The collectibles are not. What to pull, hold, and ignore from the new set.",
    date: "Jun 28, 2026", read: "10 min read", category: "Sets",
    author: "Robin Fox", role: "Sets Desk",
    body: [
      { type: "p", text: "Set reviews written for players tell you what wins games this quarter. This one is about what holds value in five years, and the answer starts with print-run math rather than power level." },
      { type: "p", text: "The short version: the borderless planet cycle is this set's real chase, the standard rares are shelf filler, and one uncommon has quietly become the set's best pickup because commander demand does not read rarity symbols." },
    ],
  },
  {
    slug: "five-storage-mistakes",
    title: "Five Storage Mistakes Quietly Eating Your Collection's Value",
    standfirst: "Sunlight is not the only enemy. The five habits that turn near mint into moderately played, and the cheap fixes.",
    date: "Jun 24, 2026", read: "6 min read", category: "Collecting",
    author: "Robin Fox", role: "Collector's Desk",
    body: [
      { type: "p", text: "Condition drift is the silent tax on every binder. None of these five mistakes feel like damage while you are making them, which is exactly why they cost collectors more per year than any market dip." },
      { type: "p", text: "The list, in ascending order of regret: overstuffed binder pages, sleeves without toploaders in transport boxes, direct sun on display shelves, humidity swings in garages and attics, and the classic: handling raw vintage with dry hands straight over a hard floor." },
    ],
  },
  {
    slug: "nightly-prices-vs-live-tickers",
    title: "Why Nightly Prices Beat Live Tickers for Collectors",
    standfirst: "Live tickers optimize for traders. Collectors need a trustworthy close, and there is a reason ours lands at night.",
    date: "Jun 20, 2026", read: "8 min read", category: "Market",
    author: "Robin Fox", role: "Market Desk",
    body: [
      { type: "p", text: "A live price feels more honest than a nightly one until you watch a thin market print three fake swings in an afternoon off two sales and a delisting. Card markets are not equities; most cards trade a handful of times a day, and intraday noise is mostly noise." },
      { type: "p", text: "A nightly close smooths the artifacts without hiding the trend, which is why Kiri charts one dependable number per day and saves the drama for cards that actually earn it." },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
