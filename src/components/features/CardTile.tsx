"use client";

import Link from "next/link";
import { RarityDot, type RarityTier } from "@/components/ui/Badge";
import { money, signedPercent } from "@/lib/format";

export type CardTileData = {
  _id: string;
  name: string;
  setName: string;
  number?: string;
  rarityTier: RarityTier;
  slug: string;
  gameSlug: string;
  imageUrl?: string;
  headline: { price: number; change7d: number | null } | null;
};

/**
 * card-tile (design.md § Components): the workhorse of browse and search
 * grids. Hover lifts 2px and reveals the circular Urushi quick-add over the
 * cover corner.
 */
export default function CardTile({
  card,
  onQuickAdd,
}: {
  card: CardTileData;
  onQuickAdd?: (card: CardTileData) => void;
}) {
  const delta = card.headline?.change7d ?? null;
  return (
    <div className="ctile" style={{ width: "100%" }}>
      <Link
        href={`/cards/${card.gameSlug}/${card.slug}`}
        style={{ color: "inherit", textDecoration: "none" }}
      >
        <span
          className="cimg"
          style={
            card.imageUrl
              ? { backgroundImage: `url(${card.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          {onQuickAdd && (
            <button
              className="qadd"
              aria-label={`Add ${card.name} to portfolio`}
              onClick={(e) => {
                e.preventDefault();
                onQuickAdd(card);
              }}
            >
              +
            </button>
          )}
        </span>
        <span className="tnm" style={{ display: "block" }}>{card.name}</span>
        <span className="tst">
          {card.setName}
          {card.number ? ` · ${card.number}` : ""}
          <RarityDot tier={card.rarityTier}>{card.rarityTier}</RarityDot>
        </span>
        <span className="tpr">
          <span>{card.headline ? money(card.headline.price) : "No price data"}</span>
          {delta !== null && delta !== 0 && (
            <span className={`pdelta ${delta > 0 ? "up" : "down"}`}>
              {signedPercent(delta).slice(1)}
            </span>
          )}
        </span>
      </Link>
    </div>
  );
}

/** Skeleton twin for loading grids. */
export function CardTileSkeleton() {
  return (
    <div className="ctile" style={{ width: "100%" }} aria-hidden>
      <span className="cimg skel" style={{ background: undefined }} />
      <span className="skel" style={{ display: "block", height: 13, width: "70%", marginBottom: 8 }} />
      <span className="skel" style={{ display: "block", height: 10, width: "50%", marginBottom: 10 }} />
      <span className="skel" style={{ display: "block", height: 13, width: "40%" }} />
    </div>
  );
}
