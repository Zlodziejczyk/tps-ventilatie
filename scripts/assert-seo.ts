// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node built-ins suffice).
//
// Run on demand:  npx tsx scripts/assert-seo.ts
// Locks the Phase-3 SEO invariants: the indexing policy yields exactly the 5
// static content pages, the sitemap carries only absolute canonical-origin URLs, the
// canonical origin is the `www` host (no trailing slash), and the site-wide JSON-LD is HVACBusiness
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
import { REVIEW_RATING } from "@/lib/reviews";

// (1) Exactly the 5 static content pages are indexable, in canonical-URL terms.
// `/projecten` joined the indexable set when the showcase shipped (quick task
// 260719-t62); this assertion still said 4 and had been failing since.
const indexableUrls = PAGES.filter(isIndexable).map(urlFor).sort();
assert.deepEqual(
  indexableUrls,
  ["/", "/contact", "/over-ons", "/projecten", "/tarieven"],
  `isIndexable must yield exactly the 5 static content pages, got: ${indexableUrls.join(", ")}`,
);

// (2) The noindex set: privacy-beleid, the hub, and any draft service are excluded.
assert.equal(isIndexable(findBySlug("/privacy-beleid")!), false, "privacy-beleid must be noindex");
assert.equal(isIndexable(findBySlug("/diensten")!), false, "draft hub must be noindex");
assert.equal(
  isIndexable(findService("airconditioning", "installatie")!),
  false,
  "draft service must be noindex",
);

// (3) Sitemap holds exactly 5 entries, every url absolute on the canonical origin.
const entries = sitemapEntries();
assert.equal(entries.length, 5, `sitemapEntries must hold 5 entries, got ${entries.length}`);
for (const entry of entries) {
  assert.ok(
    entry.url.startsWith("https://www.tpsklimaattechniek.nl"),
    `sitemap url must be absolute on the canonical origin, got ${entry.url}`,
  );
}

// (4) Canonical origin is the www host with no trailing slash; root keeps its slash.
// www (not the apex) is the Vercel Production domain — the apex 308-redirects to it,
// so canonicals must not point at a redirecting host.
assert.equal(
  CANONICAL_ORIGIN,
  "https://www.tpsklimaattechniek.nl",
  "CANONICAL_ORIGIN must be the www host, no trailing slash",
);
assert.equal(absoluteUrl("/"), "https://www.tpsklimaattechniek.nl/", "absoluteUrl('/') keeps the root slash");
assert.equal(
  absoluteUrl("/contact"),
  "https://www.tpsklimaattechniek.nl/contact",
  "non-root carries no trailing slash",
);

// (5) Site-wide business JSON-LD is HVACBusiness, stable @id, geoRadius 60000.
// aggregateRating is gated on REVIEW_RATING (D-17): absent until the owner supplies
// real Google data, present + typed once set. (The "4 indexable statics" / sitemap-4
// assertions above stay valid until nodes actually publish — updated in 04-09.)
const biz = businessJsonLd() as Record<string, unknown>;
assert.equal(biz["@type"], "HVACBusiness", "business node must be HVACBusiness");
assert.ok(String(biz["@id"]).endsWith("/#business"), "business node needs a stable /#business @id");
if (REVIEW_RATING === null) {
  assert.ok(!("aggregateRating" in biz), "no aggregateRating until REVIEW_RATING is set (D-17)");
} else {
  assert.ok("aggregateRating" in biz, "aggregateRating must be present when REVIEW_RATING is set");
  const rating = biz.aggregateRating as Record<string, unknown>;
  assert.equal(rating["@type"], "AggregateRating", "aggregateRating must be a typed AggregateRating");
  assert.equal(rating.ratingValue, REVIEW_RATING.value, "ratingValue must reflect REVIEW_RATING.value");
}
assert.ok(!("review" in biz), "no inline review[] array (aggregateRating only this phase)");
const geoCircle = (biz.areaServed as Array<Record<string, unknown>>)[0];
assert.equal(geoCircle.geoRadius, 60000, "areaServed GeoCircle radius must be 60000 m (60 km)");

// (6) FAQPage returns null for an empty-faq node (renders only once Phase 4 fills FAQs).
assert.equal(faqJsonLd(findBySlug("/contact")!), null, "faqJsonLd must be null on an empty-faq node");

console.log(
  "✅ SEO policy OK — 4 indexable statics, sitemap 4 absolute-apex, apex canonical, HVACBusiness @id w/o ratings (geoRadius 60000), faq null-on-empty.",
);
