import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE, CANONICAL_ORIGIN, GOOGLE_SITE_VERIFICATION } from "@/lib/constants";
import { OG_IMAGE } from "@/lib/seo/metadata";
import { JsonLd, businessJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase makes relative OG/canonical resolve to the apex origin (D-01).
  metadataBase: new URL(CANONICAL_ORIGIN),
  title: {
    default:
      "TPS klimaattechniek — Airco, warmtepompen & ventilatie in Zoetermeer",
    template: "%s | TPS klimaattechniek",
  },
  description:
    "Specialist in airconditioning, warmtepompen en ventilatie in Zoetermeer en omgeving.",
  // Legacy keyword-array meta intentionally dropped (D-05 — deprecated; the keyword
  // map lives in the taxonomy registry).
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "nl_NL",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
  // Emit the GSC verification tag only when the env token is set (never an empty tag).
  verification: GOOGLE_SITE_VERIFICATION
    ? { google: GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${jakarta.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body">
        {/* Site-wide HVACBusiness node — the single business JSON-LD every page carries (D-04) */}
        <JsonLd data={businessJsonLd()} />
        <Navbar />
        {children}
        <Footer />
        {/* Cookieless, privacy-friendly — no consent banner needed (D-06, LEAD-06) */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
