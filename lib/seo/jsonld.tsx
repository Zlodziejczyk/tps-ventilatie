// JSON-LD STRUCTURED DATA (D-04, SEO-03/SEO-06) — server-rendered, zero client JS,
// XSS-safe. One reusable injector + typed builders that turn SITE + a taxonomy node
// into valid Schema.org data. NO `aggregateRating`/`review` in Phase 3 (reserved for
// Phase 4 / CONT-08 — ratings must reflect consolidated, sourced, on-page reviews).
//
// Server-only file (.tsx, no client directive). Part of the `lib/seo/*` no-barrel
// family. All business data flows from SITE; the origin from CANONICAL_ORIGIN.

import { CANONICAL_ORIGIN, SITE } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo/policy";
import { trailFor, urlFor } from "@/lib/services/registry";
import type { PageNode } from "@/lib/services/types";

// Stable @id for the one site-wide business node, so per-page Service nodes can
// reference it as their `provider` (D-04).
const BUSINESS_ID = `${CANONICAL_ORIGIN}/#business`;

// The branded sitewide image/logo (same asset as metadata's OG_IMAGE), absolute.
const BUSINESS_IMAGE = absoluteUrl("/og-default.jpg");

// Reusable injector: writes typed JSON into an inline <script type="application/ld+json">.
// Escapes "<" → < so no string value can ever close the </script> context — the
// documented Next pattern, and the only safe use of dangerouslySetInnerHTML here (the
// data is typed SITE/taxonomy, never user input; the escape is defense-in-depth).
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

// Site-wide HVACBusiness (a LocalBusiness subtype — stronger HVAC signal). Built
// entirely from SITE. Carries NO aggregateRating/review (Phase 4) and NO sameAs
// while the owner GBP/social URLs are pending (A-3) — omitting optional props is
// valid JSON-LD; never emit empty/placeholder URLs.
export function businessJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": BUSINESS_ID,
    url: CANONICAL_ORIGIN,
    name: SITE.name,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      postalCode: SITE.postcode,
      addressLocality: SITE.city,
      addressRegion: SITE.province,
      addressCountry: SITE.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    // Regio signal (SEO-06): a GeoCircle of the service radius PLUS the named
    // service areas as Places.
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: SITE.geo.lat,
          longitude: SITE.geo.lng,
        },
        geoRadius: SITE.serviceRadiusKm * 1000,
      },
      ...SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
    ],
    priceRange: "€€",
    image: BUSINESS_IMAGE,
    logo: BUSINESS_IMAGE,
  };
}

// Per-page Service node (pillar + sub-service; the hub omits it). `provider` points
// at the site-wide business @id; `areaServed` carries the regio Places (SEO-06).
export function serviceJsonLd(node: PageNode): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: node.navTitle,
    serviceType: node.primaryKeyword,
    provider: { "@id": BUSINESS_ID },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
    url: absoluteUrl(urlFor(node)),
  };
}

// BreadcrumbList from trailFor(node) — the same trail the visible Breadcrumbs use
// (P2 D-13), each `item` an absolute URL, `position` 1-indexed.
export function breadcrumbJsonLd(node: PageNode): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trailFor(node).map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

// FAQPage from node.content.faqs — returns null when empty, so it only renders once
// Phase 4 fills FAQs on published pages (callers render <JsonLd> only when non-null).
export function faqJsonLd(node: PageNode): object | null {
  if (node.content.faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: node.content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
