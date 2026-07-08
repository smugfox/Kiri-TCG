"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexReady } from "@/app/providers";
import Sparkline from "@/components/charts/Sparkline";
import Kebab from "@/components/ui/Kebab";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { RarityDot } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { money, signedPercent } from "@/lib/format";

export default function WatchlistClient() {
  const ready = useConvexReady();
  const router = useRouter();
  const toast = useToast();
  const rows = useQuery(api.watchlist.list, ready ? {} : "skip");
  const toggle = useMutation(api.watchlist.toggle);

  if (!ready) return null;

  return (
    <div className="page" style={{ maxWidth: 720, margin: "0 auto", padding: "var(--space-6) var(--space-5)" }}>
      <h1 style={{ font: "var(--type-h2)", letterSpacing: "var(--type-h2-ls)", marginBottom: "var(--space-4)" }}>
        Watchlist
      </h1>

      {rows === undefined && (
        <div aria-busy="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="skel" style={{ display: "block", height: 44, marginBottom: 10, borderRadius: "var(--rounded-sm)" }} />
          ))}
        </div>
      )}

      {rows && rows.length === 0 && (
        <EmptyState
          title="Nothing on your watchlist yet"
          description="Watch any card to follow its price without adding it to your portfolio."
          action={<Button onClick={() => router.push("/cards")}>Browse cards</Button>}
        />
      )}

      {rows &&
        rows.map((row) => (
          <div className="spark-row" key={row._id} style={{ width: "100%" }}>
            <span className="nm" style={{ minWidth: 0 }}>
              <Link
                href={`/cards/${row.gameSlug}/${row.slug}`}
                style={{ color: "inherit", textDecoration: "none", fontWeight: 500 }}
              >
                {row.name}
              </Link>
              <span className="h-set" style={{ display: "block" }}>
                {row.setName} <RarityDot tier={row.rarityTier}>{row.rarity ?? row.rarityTier}</RarityDot>
              </span>
            </span>
            {row.sparkline.length >= 2 ? (
              <Sparkline points={row.sparkline} />
            ) : (
              // <2 snapshots: flat placeholder, not a broken chart (US-007)
              <Sparkline points={[1, 1]} />
            )}
            {row.change7d !== null && row.change7d !== 0 && (
              <span className={`pdelta ${row.change7d > 0 ? "up" : "down"}`}>
                {signedPercent(row.change7d).slice(1)}
              </span>
            )}
            <span className="pr">{row.price !== undefined ? money(row.price) : "·"}</span>
            <Kebab
              label={`Actions for ${row.name}`}
              items={[
                { label: "View card", onClick: () => router.push(`/cards/${row.gameSlug}/${row.slug}`) },
                { label: "Set alert", onClick: () => router.push(`/cards/${row.gameSlug}/${row.slug}`) },
                {
                  label: "Remove",
                  danger: true,
                  onClick: () =>
                    toggle({ cardId: row.cardId }).then(() => toast(`Stopped watching ${row.name}.`)),
                },
              ]}
            />
          </div>
        ))}
    </div>
  );
}
