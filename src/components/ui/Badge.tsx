import { ReactNode } from "react";

export type RarityTier = "common" | "uncommon" | "rare" | "epic" | "mythic" | "secret";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`badge ${className}`}>{children}</span>;
}

/** Standard rarity badge: tinted wash per the design system. */
export function RarityBadge({ tier, prismatic = false, children }: { tier: RarityTier; prismatic?: boolean; children: ReactNode }) {
  return <span className={`badge r-${tier} ${prismatic && tier === "secret" ? "prismatic" : ""}`}>{children}</span>;
}

/** Dense variant for tables, lists, and tile meta lines. */
export function RarityDot({ tier, children }: { tier: RarityTier; children: ReactNode }) {
  return <span className={`badge-dot r-${tier}`}>{children}</span>;
}
