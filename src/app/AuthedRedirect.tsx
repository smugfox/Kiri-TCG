"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";

/** Signed-in visitors landing on / go straight to their portfolio. */
export default function AuthedRedirect() {
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) router.replace("/portfolio");
  }, [isAuthenticated, router]);
  return null;
}
