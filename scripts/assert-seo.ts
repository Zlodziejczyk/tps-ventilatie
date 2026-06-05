// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node built-ins suffice).
//
// Run on demand:  npx tsx scripts/assert-seo.ts
// Locks the Phase-3 SEO invariants: the indexing policy yields exactly the 4
// static content pages, the sitemap carries only absolute-apex URLs, the canonical
// origin is the apex (no trailing slash), and the site-wide JSON-LD is HVACBusiness
// with a stable @id and NO ratings yet. Exits non-zero (assertion throws) on any
// drift. Separate from the whole-phase build gate (03-08-3 / npm run build).

import assert from "node:assert/strict";
import { CANONICAL_ORIGIN } from "@/lib/constants";
import {
  PAGES,
  urlFor,
  findBySlug,
  findService,
} from "@/lib/services/registry";
import { isIndexable, absoluteUrl, sitemapEntries } from "@/lib/seo/policy";
import { businessJsonLd, faqJsonLd } from "@/lib/seo/jsonld";

// (1) Exactly the 4 static content pages are indexable, in canonical-URL terms.
const indexableUrls = PAGES.filter(isIndexable).map(urlFor).sort();
assert.deepEqual(
  indexableUrls,
  ["/", "/contact", "/over-ons", "/tarieven"],
  `isIndexable must yield exactly the 4 static content pages, got: ${indexableUrls.join(", ")}`,
);

// (2) The noindex set: privacy-beleid, the hub, and any draft service are excluded.
assert.equal(isIndexable(findBySlug("/privacy-beleid")!), false, "privacy-beleid must be noindex");
assert.equal(isIndexable(findBySlug("/diensten")!), false, "draft hub must be noindex");
assert.equal(
  isIndexable(findService("airconditioning", "installatie")!),
  false,
  "draft service must be noindex",
);

// (3) Sitemap holds exactly 4 entries, every url absolute-apex.
const entries = sitemapEntries();
assert.equal(entries.length, 4, `sitemapEntries must hold 4 entries, got ${entries.length}`);
for (const entry of entries) {
  assert.ok(
    entry.url.startsWith("https://tpsventilatie.nl"),
    `sitemap url must be absolute apex, got ${entry.url}`,
  );
}

// (4) Canonical origin is the apex with no trailing slash; root keeps its slash.
assert.equal(CANONICAL_ORIGIN, "https://tpsventilatie.nl", "CANONICAL_ORIGIN must be the apex, no trailing slash");
assert.equal(absoluteUrl("/"), "https://tpsventilatie.nl/", "absoluteUrl('/') keeps the root slash");
assert.equal(absoluteUrl("/contact"), "https://tpsventilatie.nl/contact", "non-root carries no trailing slash");

// (5) Site-wide business JSON-LD is HVACBusiness, stable @id, NO ratings, geoRadius 60000.
const biz = businessJsonLd() as Record<string, unknown>;
assert.equal(biz["@type"], "HVACBusiness", "business node must be HVACBusiness");
assert.ok(String(biz["@id"]).endsWith("/#business"), "business node needs a stable /#business @id");
assert.ok(!("aggregateRating" in biz), "no aggregateRating in Phase 3 (reserved for Phase 4)");
assert.ok(!("review" in biz), "no review in Phase 3 (reserved for Phase 4)");
const geoCircle = (biz.areaServed as Array<Record<string, unknown>>)[0];
assert.equal(geoCircle.geoRadius, 60000, "areaServed GeoCircle radius must be 60000 m (60 km)");

// (6) FAQPage returns null for an empty-faq node (renders only once Phase 4 fills FAQs).
assert.equal(faqJsonLd(findBySlug("/contact")!), null, "faqJsonLd must be null on an empty-faq node");

console.log(
  "✅ SEO policy OK — 4 indexable statics, sitemap 4 absolute-apex, apex canonical, HVACBusiness @id w/o ratings (geoRadius 60000), faq null-on-empty.",
);
