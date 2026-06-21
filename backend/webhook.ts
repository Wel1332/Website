import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/backend/stripe";

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
      // TODO: fulfill the order here, e.g. email the buyer their download link,
      // record the sale, etc. Stripe can also deliver files automatically if
      // you attach them to the product in the Stripe Dashboard.
      console.log(`✅ Paid for product: ${productId} (session ${session.id})`);
      break;
    }
    default:
      // Ignore other event types.
      break;
  }

  return NextResponse.json({ received: true });
}
