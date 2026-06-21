// NOTE FOR THE OWNER: This is a sensible starting template, not legal advice.
// Adjust it to match the tools you actually use (analytics, email provider,
// etc.), replace [BRACKETED] placeholders, and have it reviewed by a lawyer —
// especially if you serve customers in the EU/UK (GDPR) or California (CCPA).
import type { Metadata } from "next";
import LegalPage from "@/frontend/components/LegalPage";
import { store } from "@/shared/products";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${store.brand} collects, uses, and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 18, 2026"
      intro={`This Privacy Policy explains how ${store.brand} ("we", "us", "our") collects, uses, and protects your information when you visit our site or buy a product. We keep the data we collect to a minimum.`}
      sections={[
        {
          heading: "1. Information we collect",
          body: [
            "Information you provide: your email address (for delivery and receipts) and any details you include when you contact support.",
            "Payment information: handled entirely by Stripe. We never see or store your full card number. We may receive limited, non-sensitive details such as the last four digits and your billing country.",
            "Automatically collected: basic technical data such as your browser type and pages visited, used to keep the site secure and working.",
          ],
        },
        {
          heading: "2. How we use your information",
          body: [
            "To deliver your purchase and send your download link and receipt.",
            "To provide customer support and respond to your questions.",
            "To process refunds, prevent fraud, and meet our legal obligations.",
          ],
        },
        {
          heading: "3. Payment processing",
          body: [
            "Payments are processed by Stripe, Inc. Your payment is subject to Stripe's privacy policy. We use Stripe so that sensitive card data never touches our servers.",
          ],
        },
        {
          heading: "4. Sharing your information",
          body: [
            "We do not sell your personal information. We share data only with service providers that help us run the store — such as our payment processor (Stripe) and our email provider — and only as needed to deliver our service or comply with the law.",
          ],
        },
        {
          heading: "5. Cookies",
          body: [
            "We use only the cookies necessary to operate the site and process payments. We do not use cookies to build advertising profiles. [If you add analytics or marketing cookies, disclose them here.]",
          ],
        },
        {
          heading: "6. Data retention",
          body: [
            "We keep order and contact records for as long as needed to provide support, honor our guarantee, and meet tax and legal requirements, after which we delete or anonymize them.",
          ],
        },
        {
          heading: "7. Your rights",
          body: [
            "Depending on where you live, you may have the right to access, correct, or delete the personal information we hold about you, or to object to certain processing. To exercise these rights, email us and we will respond within a reasonable time.",
          ],
        },
        {
          heading: "8. Security",
          body: [
            "We take reasonable technical and organizational measures to protect your information. No method of transmission over the internet is completely secure, but we work to safeguard your data.",
          ],
        },
        {
          heading: "9. Children",
          body: [
            "Our products are not directed to children, and we do not knowingly collect personal information from anyone under the age of 16.",
          ],
        },
        {
          heading: "10. Changes & contact",
          body: [
            "We may update this policy from time to time; the latest version will always be posted here. If you have any questions, contact us using the email below.",
          ],
        },
      ]}
    />
  );
}
