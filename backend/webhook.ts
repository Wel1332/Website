import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/backend/stripe";
import { getDb, schema } from "@/lib/db";

type OrderStatus = (typeof schema.orderStatus.enumValues)[number];

/* Stripe retries webhooks until it sees a 2xx, and can deliver the same event
   more than once — so recording an order is an upsert keyed on the session
   id, never a plain insert. */
async function recordOrder(session: Stripe.Checkout.Session, status: OrderStatus) {
  const productId = session.metadata?.productId;
  if (!productId) {
    console.warn(`⚠ session ${session.id} has no productId metadata — skipped`);
    return;
  }

  const values = {
    productId,
    customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
    amountCents: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    status,
  };

  await getDb()
    .insert(schema.orders)
    .values({ stripeSessionId: session.id, ...values })
    .onConflictDoUpdate({ target: schema.orders.stripeSessionId, set: values });
}

/** Verifies and processes Stripe webhook events (order fulfillment). */
export async function handleWebhook(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const productId = session.metadata?.productId;
      // Card payments are "paid" here; delayed methods (bank debits etc.)
      // complete as "unpaid" and settle via the async_payment_* events below.
      await recordOrder(
        session,
        session.payment_status === "paid" ? "PAID" : "PENDING"
      );
      // TODO: fulfill the order here, e.g. email the buyer their download link,
      // record the sale, etc. Stripe can also deliver files automatically if
      // you attach them to the product in the Stripe Dashboard.
      console.log(`✅ Paid for product: ${productId} (session ${session.id})`);
      break;
    }
    case "checkout.session.async_payment_succeeded":
      await recordOrder(event.data.object, "PAID");
      break;
    case "checkout.session.async_payment_failed":
      await recordOrder(event.data.object, "FAILED");
      break;
    default:
      // Ignore other event types.
      break;
  }

  return NextResponse.json({ received: true });
}
