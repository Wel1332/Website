// NOTE FOR THE OWNER: This mirrors the 14-day guarantee promised on the
// homepage and FAQ. Keep these consistent. This is a starting template, not
// legal advice — review it before launch.
import type { Metadata } from "next";
import LegalPage from "@/frontend/components/LegalPage";
import { store } from "@/shared/products";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `${store.brand}'s 14-day money-back guarantee and how to request a refund.`,
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="June 18, 2026"
      intro={`We want you to be happy with your purchase. Every product from ${store.brand} is backed by a 14-day money-back guarantee.`}
      sections={[
        {
          heading: "Our 14-day guarantee",
          body: [
            "If a product isn't the right fit, you can request a full refund within 14 days of your purchase. No forms and no complicated process — just email us.",
          ],
        },
        {
          heading: "How to request a refund",
          body: [
            `Email ${store.supportEmail} from the address you used at checkout, include your receipt or order details, and let us know which product you'd like refunded. A short note on what didn't work for you is appreciated but not required.`,
          ],
        },
        {
          heading: "How refunds are processed",
          body: [
            "Approved refunds are issued to your original payment method via Stripe. Depending on your bank or card provider, it can take 5–10 business days for the funds to appear.",
          ],
        },
        {
          heading: "A note on digital products",
          body: [
            "Because our products are delivered instantly, your access begins immediately at purchase. The 14-day guarantee above applies regardless, but we may decline repeated or clearly abusive refund requests (for example, downloading the full product and routinely requesting refunds).",
          ],
        },
        {
          heading: "Chargebacks",
          body: [
            "If something goes wrong, please contact us first — we can almost always resolve it faster than a chargeback. Opening a chargeback without contacting us may delay a resolution.",
          ],
        },
      ]}
    />
  );
}
