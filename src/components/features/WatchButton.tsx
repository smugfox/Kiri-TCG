"use client";

import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

/** Watch toggle: optimistic, instant, one tap from any card page (US-007). */
export default function WatchButton({ cardId }: { cardId: Id<"cards"> }) {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const watching = useQuery(api.watchlist.isWatching, isAuthenticated ? { cardId } : "skip");
  const toggle = useMutation(api.watchlist.toggle).withOptimisticUpdate((store, { cardId }) => {
    const current = store.getQuery(api.watchlist.isWatching, { cardId });
    if (current !== undefined) store.setQuery(api.watchlist.isWatching, { cardId }, !current);
  });

  const onClick = () => {
    if (!isAuthenticated) {
      router.push(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }
    toggle({ cardId }).then((r) => {
      if (r.watching) toast("Watching. Find it any time under Watchlist.");
    });
  };

  return (
    <Button variant="secondary" onClick={onClick} aria-pressed={watching === true}>
      {watching ? "Watching ✓" : "Watch"}
    </Button>
  );
}
