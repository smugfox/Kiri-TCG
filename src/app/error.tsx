"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) Sentry.captureException(error);
  }, [error]);
  return (
    <div className="page" style={{ maxWidth: 720, margin: "0 auto", padding: "var(--space-9) var(--space-5)" }}>
      <div className="error-page">
        <div className="ee">Error 500</div>
        <div className="et">Something broke on our side.</div>
        <div className="ed">Your collection is safe. Try again, and if it keeps happening we&apos;re already looking into it.</div>
        <button className="btn btn-primary" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
