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
import { useToast } from "@/components/ui/Toast";

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

  const cardId = data?.card._id;
  useEffect(() => {
    if (cardId) touchViewed({ cardId }).catch(() => {});
  }, [cardId, touchViewed]);

  const defaultVariant = useMemo(() => {
    const variants = data?.variants ?? [];
    return (
      variants.find((x) => x.condition === "NM" && x.printing === "Normal") ??
      variants.find((x) => x.condition === "NM") ??
      variants.find((x) => x.currentPrice !== undefined) ??
      variants[0]
    );
  }, [data]);

  const selected =
    data?.variants.find((x) => x._id === selectedVariantId) ?? defaultVariant;

  const history = useQuery(
    api.prices.history,
    selected ? { variantId: selected._id, range } : "skip",
  );

  if (data === null) notFound();
  if (!data) return null;
  const { card, game, variants } = data;
  const freshest = Math.max(...variants.map((x) => x.lastUpdatedAt), 0);

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
            <Button onClick={() => toast("The portfolio arrives in the next phase of the build.")}>
              Add to portfolio
            </Button>
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
            title={selected ? `${selected.condition} · ${selected.printing}` : card.name}
            data={history ?? []}
            range={range}
            onRange={setRange}
            delta7d={selected?.change7d ?? null}
          />

          <section>
            <h2 style={{ font: "var(--type-h4)", letterSpacing: "var(--type-h4-ls)", marginBottom: "var(--space-3)" }}>
              Prices by condition
            </h2>
            <PriceMatrix
              variants={variants}
              selectedId={selected?._id}
              onSelect={(variant) => setSelectedVariantId(variant._id)}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
