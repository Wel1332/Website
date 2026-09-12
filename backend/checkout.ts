import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/backend/stripe";
import { getProductById } from "@/lib/products";

/** Creates a Stripe Checkout session for a single product. */
export async function handleCheckout(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local." },
      { status: 503 }
    );
  }

  let productId: string | undefined;
  try {
    ({ productId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const product =
    typeof productId === "string" && productId
      ? await getProductById(productId)
      : null;
  if (!product || !product.active) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              description: product.tagline,
            },
          },
        },
      ],
      // For real digital delivery, configure the product in Stripe with a
      // file, or handle fulfillment in the webhook.
      metadata: { productId: product.id },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
