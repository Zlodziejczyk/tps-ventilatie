import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyContactBar } from "@/components/StickyContactBar";
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

// Material Symbols icon font (decorative). Loaded NON-render-blocking (SEO-10): the
// page's LCP is H1 text and never needs this font, so it must not gate first paint —
// a plain render-blocking cross-origin <link> was pushing mobile FCP/LCP to ~8–9s on
// Slow-4G. display=block shows blank (not the ligature source text) until glyphs load.
const MATERIAL_SYMBOLS_HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block";

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
        {/* Preconnect so the icon-font fetch doesn't pay a cold cross-origin connection
            on slow mobile; preload keeps its priority high; the stylesheet loads as
            media=print then flips to all on load (non-render-blocking), with a noscript
            fallback. Keeps first paint free of a decorative-font dependency (SEO-10). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href={MATERIAL_SYMBOLS_HREF} />
        <link id="ms-icons" rel="stylesheet" href={MATERIAL_SYMBOLS_HREF} media="print" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.getElementById('ms-icons');if(!l)return;function s(){l.media='all'}l.addEventListener('load',s);if(l.sheet)s();})();",
          }}
        />
        <noscript>
          <link rel="stylesheet" href={MATERIAL_SYMBOLS_HREF} />
        </noscript>
      </head>
      <body className="bg-background text-on-surface font-body">
        {/* Keyboard skip link (A11Y-03, WCAG 2.4.1) — first focusable element,
            invisible until focused, then painted above the fixed navbar. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-lg focus:bg-surface-container-lowest focus:px-4 focus:py-2 focus:font-semibold focus:text-on-surface focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Naar inhoud
        </a>
        {/* Site-wide HVACBusiness node — the single business JSON-LD every page carries (D-04) */}
        <JsonLd data={businessJsonLd()} />
        <Navbar />
        {children}
        <Footer />
        {/* Single always-on contact affordance (LEAD-03) — a direct <body> child so
            it is viewport-fixed, never trapped by a transformed ancestor (LEAD-04). */}
        <StickyContactBar />
        {/* Cookieless, privacy-friendly — no consent banner needed (D-06, LEAD-06) */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
