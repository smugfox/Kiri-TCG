import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

/** Standard-webhooks (svix-style) HMAC check, V8-runtime friendly. */
async function verifySignature(
  secret: string,
  id: string,
  timestamp: string,
  payload: string,
  signatureHeader: string,
): Promise<boolean> {
  const secretBytes = Uint8Array.from(atob(secret.replace(/^whsec_/, "")), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${timestamp}.${payload}`),
  );
  const expected = btoa(String.fromCharCode(...new Uint8Array(signed)));
  // Header form: "v1,<base64> v1,<base64> ..."
  return signatureHeader
    .split(" ")
    .some((part) => part.split(",")[1] === expected);
}

/** Map a Polar product id (from env) to a Kiri tier. */
function tierForProduct(productId: string | undefined): "trader" | "dealer" | undefined {
  if (!productId) return undefined;
  if (
    productId === process.env.POLAR_PRICE_TRADER_MONTH ||
    productId === process.env.POLAR_PRICE_TRADER_YEAR
  )
    return "trader";
  if (
    productId === process.env.POLAR_PRICE_DEALER_MONTH ||
    productId === process.env.POLAR_PRICE_DEALER_YEAR
  )
    return "dealer";
  return undefined;
}

http.route({
  path: "/polar/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) return new Response("billing not configured", { status: 503 });

    const payload = await request.text();
    const id = request.headers.get("webhook-id") ?? "";
    const timestamp = request.headers.get("webhook-timestamp") ?? "";
    const signature = request.headers.get("webhook-signature") ?? "";
    if (!id || !(await verifySignature(secret, id, timestamp, payload, signature))) {
      return new Response("invalid signature", { status: 403 });
    }

    // Idempotency: each webhook id applies once, replays no-op.
    const fresh = await ctx.runMutation(internal.billingDb.recordEvent, { eventId: id });
    if (!fresh) return new Response("already processed", { status: 200 });

    const event = JSON.parse(payload) as {
      type: string;
      data: {
        id?: string;
        status?: string;
        product_id?: string;
        productId?: string;
        customer_id?: string;
        customerId?: string;
        customer?: { id?: string; email?: string };
        metadata?: { userId?: string };
      };
    };
    const { type, data } = event;

    const handled = [
      "checkout.updated",
      "subscription.created",
      "subscription.active",
      "subscription.updated",
      "subscription.canceled",
      "subscription.revoked",
    ];
    if (!handled.includes(type)) {
      console.log(`polar webhook: ignoring ${type}`);
      return new Response("ok", { status: 200 });
    }
    // checkout.updated only matters once paid; subscription events carry tier.
    if (type === "checkout.updated" && data.status !== "succeeded") {
      return new Response("ok", { status: 200 });
    }

    await ctx.runMutation(internal.billingDb.applySubscription, {
      eventType: type.startsWith("subscription") ? type : "subscription.active",
      userId: data.metadata?.userId,
      customerId: data.customer_id ?? data.customerId ?? data.customer?.id,
      customerEmail: data.customer?.email,
      subscriptionId: type.startsWith("subscription") ? data.id : undefined,
      tier: tierForProduct(data.product_id ?? data.productId),
      status: data.status,
    });
    return new Response("ok", { status: 200 });
  }),
});

export default http;
