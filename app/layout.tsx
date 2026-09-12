import type { Metadata } from "next";
import { Bricolage_Grotesque, Newsreader, IBM_Plex_Mono } from "next/font/google";
import { store } from "@/shared/products";
import "@/frontend/styles/globals.css";

/* Three faces, three jobs: a grotesque that carries the headlines, a serif
   that carries the reading, and a mono that carries every number and label. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
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
    <html
      lang="en"
      className={`${bricolage.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
