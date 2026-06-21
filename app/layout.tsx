import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { store } from "@/shared/products";
import "@/frontend/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${store.brand} — Premium Digital Products`,
    template: `%s · ${store.brand}`,
  },
  description: store.blurb,
  keywords: [
    "digital products",
    "notion templates",
    "lightroom presets",
    "resume templates",
    store.brand,
  ],
  applicationName: store.brand,
  authors: [{ name: store.brand }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: store.brand,
    title: `${store.brand} — Premium Digital Products`,
    description: store.blurb,
  },
  twitter: {
    card: "summary_large_image",
    title: `${store.brand} — Premium Digital Products`,
    description: store.blurb,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body>{children}</body>
    </html>
  );
}
