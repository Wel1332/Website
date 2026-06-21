import Stripe from "stripe";

/**
 * Lazily create the Stripe client so the app still builds/runs
 * before you've added STRIPE_SECRET_KEY. Returns null if unset.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) {
    // Use the SDK's pinned default API version (avoids type drift across
    // Stripe SDK upgrades). To override, pass an explicit apiVersion string.
    cached = new Stripe(key);
  }
  return cached;
}
