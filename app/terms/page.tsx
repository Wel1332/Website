// NOTE FOR THE OWNER: This is a sensible starting template for a digital-goods
// store, not legal advice. Replace the [BRACKETED] placeholders and have it
// reviewed by a qualified lawyer for your jurisdiction before relying on it.
import type { Metadata } from "next";
import LegalPage from "@/frontend/components/LegalPage";
import { store } from "@/shared/products";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing your use of ${store.brand} and purchase of our digital products.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 18, 2026"
      intro={`These Terms of Service ("Terms") govern your access to and use of ${store.brand} ("we", "us", "our") and the purchase of our digital products. By using our site or buying a product, you agree to these Terms.`}
      sections={[
        {
          heading: "1. Our products",
          body: [
            "We sell digital products — such as templates, presets, and document kits — that are delivered electronically. No physical goods are shipped.",
            "We may update, improve, or discontinue any product at any time. Lifetime-update products will continue to receive updates for as long as we offer that product.",
          ],
        },
        {
          heading: "2. License & permitted use",
          body: [
            "When you purchase a product, we grant you a non-exclusive, non-transferable license to use it for your own personal or business projects.",
            "You may not resell, redistribute, sublicense, or share the product files, in whole or in part, or pass them off as your own product. Templates and presets may be used to create your own work, but the underlying files may not be redistributed.",
          ],
        },
        {
          heading: "3. Payment & pricing",
          body: [
            "Payments are processed securely by Stripe. We do not receive or store your full card details. Prices are shown in the currency listed at checkout and may change at any time, but changes never affect orders already placed.",
            "You are responsible for any taxes that apply to your purchase unless we are required to collect them.",
          ],
        },
        {
          heading: "4. Delivery",
          body: [
            "After a successful payment you will receive an email containing a secure download link, typically within a few minutes. No account is required. If your link does not arrive, check your spam folder or contact us.",
          ],
        },
        {
          heading: "5. Refunds",
          body: [
            "Purchases are covered by our money-back guarantee as described in our Refund Policy. Because our products are digital and delivered immediately, refunds are handled under that policy.",
          ],
        },
        {
          heading: "6. Intellectual property",
          body: [
            `All products, content, branding, and materials on this site are owned by ${store.brand} or its licensors and are protected by intellectual-property laws. Your license under Section 2 does not transfer ownership of any product to you.`,
          ],
        },
        {
          heading: "7. Disclaimers",
          body: [
            'Our products are provided "as is" and "as available", without warranties of any kind, whether express or implied. We do not guarantee that a product will meet your specific requirements or be error-free.',
          ],
        },
        {
          heading: "8. Limitation of liability",
          body: [
            "To the maximum extent permitted by law, our total liability for any claim arising from your use of the site or a product is limited to the amount you paid for that product. We are not liable for indirect, incidental, or consequential damages.",
          ],
        },
        {
          heading: "9. Changes to these Terms",
          body: [
            "We may update these Terms from time to time. The version in effect when you make a purchase applies to that purchase. Continued use of the site after changes means you accept the updated Terms.",
          ],
        },
        {
          heading: "10. Governing law",
          body: [
            "These Terms are governed by the laws of [YOUR JURISDICTION], without regard to conflict-of-law principles. Any disputes will be handled in the courts of [YOUR JURISDICTION].",
          ],
        },
      ]}
    />
  );
}
