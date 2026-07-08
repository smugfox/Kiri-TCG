"use node";

/**
 * Resend wrapper: env-gated (RESEND_API_KEY in the Convex env), retries
 * twice with backoff, throws to Sentry-visible logs on final failure.
 * From-address domain needs SPF/DKIM set up in Resend (see README).
 */

import { Resend } from "resend";

const FROM = process.env.ALERTS_FROM_EMAIL ?? "Kiri <alerts@kiri.example>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; skipped?: true }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`email skipped (RESEND_API_KEY unset): "${subject}" → ${to}`);
    return { sent: false, skipped: true };
  }
  const resend = new Resend(key);
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { error } = await resend.emails.send({ from: FROM, to, subject, html });
      if (error) throw new Error(error.message);
      return { sent: true };
    } catch (err) {
      lastError = err;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 2 ** attempt * 2000));
    }
  }
  console.error(`email failed after retries: "${subject}" → ${to}: ${String(lastError)}`);
  return { sent: false };
}
