// SHARED PAGE-METADATA BUILDER (D-05) — the ONE seam every page's <head> goes
// through, so metadataBase / canonical / OG / Twitter / robots never drift across
// the ~27 routes. Used by BOTH the static-page `metadata` exports (03-07) AND the
// dynamic routes' `generateMetadata` (03-06), widening the Phase-2 title/desc seam.
//
// Server-safe pure function — no rendering, no I/O, never a client module. Part of
// the `lib/seo/*` no-barrel family (same rationale as registry.ts).

import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { urlFor } from "@/lib/services/registry";
import type { PageNode } from "@/lib/services/types";
import { absoluteUrl, isIndexable } from "@/lib/seo/policy";

// The one branded sitewide OG image (1200×630). Relative path — `metadataBase`
// (set on the root layout in 03-05) resolves it to an absolute URL for OG/Twitter
// consumers. A future per-page `content.ogImage` slots in without touching callers.
export const OG_IMAGE = "/og-default.jpg";

// Build a complete Metadata object for a taxonomy node: absolute self-canonical,
// OpenGraph + Twitter (sharing one image + the canonical URL), and the per-page
// `robots` directive derived from the single-source indexing policy.
export function buildMetadata(node: PageNode): Metadata {
  const canonical = absoluteUrl(urlFor(node));
  const idx = isIndexable(node);
  const title = node.content.metaTitle;
  const description = node.content.metaDescription;
  const image = node.content.ogImage ?? OG_IMAGE;

  return {
    // `absolute` so the node's metaTitle (which already carries the brand, e.g.
    // "Airconditioning Zoetermeer | TPS klimaattechniek") is used verbatim — the
    // layout `title.template` would otherwise double-brand a plain-string title.
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical, // same value as the canonical — no drift
      title,
      description,
      siteName: SITE.name,
      locale: "nl_NL",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    // Always `follow: true` — even noindex pages (drafts + privacy-beleid) stay
    // crawlable so the directive is actually seen (D-02/D-03). The index bit is
    // the single-source policy decision.
    robots: { index: idx, follow: true },
  };
}
