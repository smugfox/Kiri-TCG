"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { sendEmail } from "./lib/resend";

/**
 * Alert email, quiet-confidence voice. Env-gated: without RESEND_API_KEY it
 * logs and returns (the in-app notification already exists). Retries twice
 * with backoff per PRD edge cases.
 */
export const sendAlertEmail = internalAction({
  args: {
    to: v.string(),
    cardName: v.string(),
    setName: v.string(),
    direction: v.union(v.literal("above"), v.literal("below")),
    threshold: v.number(),
    price: v.number(),
    cardPath: v.string(),
  },
  handler: async (_ctx, { to, cardName, setName, direction, threshold, price, cardPath }) => {
    const dollars = (n: number) => `$${n.toFixed(2)}`;
    const verb = direction === "above" ? "passed" : "fell below";
    const siteUrl = process.env.SITE_URL ?? "http://localhost:3100";
    const subject = `${cardName} ${verb} your ${dollars(threshold)} alert`;
    const html = `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #322014;">
        <p style="font-size: 18px; margin: 24px 0 4px;"><strong>${cardName}</strong> · ${setName}</p>
        <p style="font-size: 15px; margin: 0 0 16px;">${verb} your ${dollars(threshold)} alert · now <strong>${dollars(price)}</strong></p>
        <p style="margin: 0 0 24px;"><a href="${siteUrl}${cardPath}" style="color: #7E4E2D;">See the chart on Kiri</a></p>
        <p style="font-size: 12px; color: #66625F;">You asked Kiri to watch this price. Turn email alerts off any time in <a href="${siteUrl}/settings" style="color: #66625F;">settings</a>; in-app alerts stay on.</p>
      </div>`;
    return sendEmail({ to, subject, html });
  },
});
