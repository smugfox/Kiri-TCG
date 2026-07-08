"use client";

import { Clock } from "lucide-react";
import { relativeTime } from "@/lib/format";

/**
 * freshness-chip (design.md § Components): mandatory on every pricing
 * surface. Stale prices are honest prices.
 */
export default function FreshnessChip({ updatedAt }: { updatedAt: number }) {
  return (
    <span className="fresh">
      <Clock aria-hidden />
      Prices updated {relativeTime(updatedAt)}
    </span>
  );
}
