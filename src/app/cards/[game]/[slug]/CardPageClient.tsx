"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMutation, usePreloadedQuery, useQuery, type Preloaded } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import PriceChart, { type ChartRange } from "@/components/charts/PriceChart";
import PriceMatrix from "@/components/features/PriceMatrix";
import FreshnessChip from "@/components/features/FreshnessChip";
import CardFrame from "@/components/features/CardFrame";
import { RarityBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import AddCardDrawer from "@/components/features/AddCardDrawer";
import { defaultLanguage, languagesOf, variantLanguage } from "@/lib/languages";

export default function CardPageClient({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.cards.getBySlug>;
}) {
  const data = usePreloadedQuery(preloaded);
  const toast = useToast();
  const touchViewed = useMutation(api.cards.touchViewed);
  const [range, setRange] = useState<ChartRange>("30d");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null); // null = default
  const [addOpen, setAddOpen] = useState(false);

  const cardId = data?.card._id;
  useEffect(() => {
    if (cardId) touchViewed({ cardId }).catch(() => {});
  }, [cardId, touchViewed]);

  // English is the default surface; other languages sit behind the select.
  const allVariants = useMemo(() => data?.variants ?? [], [data]);
  const languages = useMemo(() => languagesOf(allVariants), [allVariants]);
  const activeLanguage = language ?? defaultLanguage(allVariants);
  const shownVariants = useMemo(
    () => allVariants.filter((x) => variantLanguage(x) === activeLanguage),
    [allVariants, activeLanguage],
  );

  const defaultVariant = useMemo(() => {
    return (
      shownVariants.find((x) => x.condition === "NM" && x.printing === "Normal") ??
      shownVariants.find((x) => x.condition === "NM") ??
      shownVariants.find((x) => x.currentPrice !== undefined) ??
      shownVariants[0]
    );
  }, [shownVariants]);

  const selected =
    shownVariants.find((x) => x._id === selectedVariantId) ?? defaultVariant;

  const history = useQuery(
    api.prices.history,
    selected ? { variantId: selected._id, range } : "skip",
  );

  if (data === null) notFound();
  if (!data) return null;
  const { card, game, variants } = data;
  const freshest = Math.max(
    ...variants.filter((x) => x.currentPrice !== undefined).map((x) => x.lastUpdatedAt),
    0,
  );

  return (
    <div className="page" style={{ maxWidth: 1080, margin: "0 auto", padding: "var(--space-6) var(--space-5)" }}>
      <nav className="crumbs" aria-label="Breadcrumb" style={{ marginBottom: "var(--space-5)" }}>
        <Link href="/cards">{game.name}</Link>
        <span className="sep">›</span>
        <Link href="/cards">{card.setName}</Link>
        <span className="sep">›</span>
        <span className="cur" aria-current="page">{card.name}</span>
      </nav>

      <div style={{ display: "flex", gap: "var(--space-7)", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "0 1 280px", minWidth: 220 }}>
          <CardFrame imageUrl={card.imageUrl} name={card.name} />
          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
            <Button onClick={() => setAddOpen(true)}>Add to portfolio</Button>
            <Button variant="secondary" onClick={() => toast("Watchlist arrives in a later phase.")}>
              Watch
            </Button>
          </div>
        </div>

        <div style={{ flex: "1 1 480px", minWidth: 0, display: "grid", gap: "var(--space-5)" }}>
          <header>
            <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginBottom: 6 }}>
              {card.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <span className="cs-set">
                {card.setName}
                {card.number ? ` · ${card.number}` : ""}
              </span>
              <RarityBadge tier={card.rarityTier}>{card.rarity ?? card.rarityTier}</RarityBadge>
              {freshest > 0 && <FreshnessChip updatedAt={freshest} />}
            </div>
          </header>

          <PriceChart
            title={
              selected
                ? `${selected.condition} · ${selected.printing}${activeLanguage !== "English" ? ` · ${activeLanguage}` : ""}`
                : card.name
            }
            data={history ?? []}
            range={range}
            onRange={setRange}
            delta7d={selected?.change7d ?? null}
          />

          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
              <h2 style={{ font: "var(--type-h4)", letterSpacing: "var(--type-h4-ls)" }}>
                Prices by condition
              </h2>
              {languages.length > 1 && (
                <Select
                  aria-label="Language"
                  value={activeLanguage}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setSelectedVariantId(null);
                  }}
                  style={{ minWidth: 150 }}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </Select>
              )}
            </div>
            <PriceMatrix
              variants={shownVariants}
              selectedId={selected?._id}
              onSelect={(variant) => setSelectedVariantId(variant._id)}
            />
          </section>
        </div>
      </div>
      <AddCardDrawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        card={card}
        variants={variants}
      />
    </div>
  );
}
