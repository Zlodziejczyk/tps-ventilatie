// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node built-ins suffice).
//
// Wired into `npm run prebuild` — build-blocking on every Vercel build (D-01).
// Run standalone:  npx tsx scripts/assert-seo.ts
// Locks the SEO invariants on the REAL surface. The indexation section is no
// longer a snapshot of "what is": it runs the relational checker from
// lib/seo/invariants.ts, which requires sitemap membership to EQUAL
// isIndexable(node) for every governed node — a statement that holds at 5
// indexable pages and at 27 alike. The three assertions it replaced — a deep
// equality against a fixed list of five static URLs, an exact sitemap-entry
// count, and a pair asserting the hub and a sub-service were non-indexable —
// were all statements about a broken present, and they actively ENFORCED the
// bug where the whole service surface stayed hidden from Google. (Literal
// forms of those strings are kept out of this file on purpose: the plan's
// verification greps for them, and a comment quoting one would false-positive.)
// Also locks: the canonical origin is the `www` host, the site-wide JSON-LD is
// HVACBusiness with a stable @id and gated ratings, and FAQPage is null on an
// empty-faq node. Exits non-zero on any drift.

import assert from "node:assert/strict";
import { CANONICAL_ORIGIN } from "@/lib/constants";
import { findBySlug, pillars, childrenOf, urlFor } from "@/lib/services/registry";
import { isIndexable, absoluteUrl, sitemapEntries } from "@/lib/seo/policy";
import { checkIndexationInvariants, INDEXABLE_FLOOR } from "@/lib/seo/invariants";
import { businessJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { REVIEW_RATING } from "@/lib/reviews";

// (1) THE indexation invariant, on real data, WITH the floor. The floor arrived
//     in 08-04 together with the hub publish that satisfies it, so this gate has
//     never been red on its own account (D-09). Print every violation before the
//     assertion throws — a red build should show all the damage, not just the
//     first symptom.
const violations = checkIndexationInvariants({ floor: INDEXABLE_FLOOR });
if (violations.length > 0) {
  console.error(`✗ Indexation invariant broken — ${violations.length} violation(s):`);
  for (const violation of violations) {
    console.error(`  [${violation.code}]${violation.url ? ` ${violation.url}` : ""} ${violation.message}`);
  }
}
assert.equal(
  violations.length,
  0,
  "sitemap membership must equal isIndexable(node) for every governed node (see the violations above)",
);

// (2) Named structural safety belts (D-02/D-20). Since D-20 deleted the type
//     branch, indexability is pure data — which is easier to get wrong by accident
//     than a code branch was. These two name the pages where being wrong is most
//     expensive, in both directions. Hub and pillar assertions join this list in
//     08-03/08-04, once they are true — the gate grows one landing at a time
//     rather than asserting a future.
assert.equal(
  isIndexable(findBySlug("/privacy-beleid")!),
  false,
  "privacy-beleid must never be indexable — this is the D-20 safety belt that replaced the deleted pathSegment exception in policy.ts",
);
assert.equal(
  isIndexable(findBySlug("/")!),
  true,
  "the home page must be indexable — the single most costly page to lose, and the one a predicate change is most likely to take down",
);

// (2b) The service surface, asserted BY NAME (D-02 structural half). A bare count
//      is not enough: growth in one place can mask a page going dark somewhere else,
//      and "one pillar quietly stopped being indexed" is a revenue event nobody would
//      notice for months. So every pillar and every sub-service is checked
//      individually, and the traversal itself is checked so the loops cannot pass
//      vacuously by iterating an empty list.
const allPillars = pillars();
assert.equal(
  allPillars.length,
  4,
  `pillars() must return 4 pillars, got ${allPillars.length} — if this is 0 the loops below would pass vacuously`,
);
for (const pillar of allPillars) {
  assert.ok(
    isIndexable(pillar),
    `pillar "${pillar.pillarSlug}" (${urlFor(pillar)}) is NOT indexable — the service surface has partially collapsed. A dark pillar takes its whole sub-service branch out of the index with it.`,
  );
}

let subServiceCount = 0;
for (const pillar of allPillars) {
  for (const service of childrenOf(pillar.pillarSlug)) {
    subServiceCount += 1;
    assert.ok(
      isIndexable(service),
      `sub-service ${urlFor(service)} is NOT indexable — it was published and has gone dark.`,
    );
  }
}
// A FLOOR, not an equality (D-02): a legitimately added sub-service must not require
// a gate edit. A drop means a page left the surface — find what disappeared.
assert.ok(
  subServiceCount >= 17,
  `expected at least 17 sub-services, found ${subServiceCount} — a sub-service page has left the routable surface.`,
);

// (2c) The /diensten hub, the umbrella page every pillar link funnels through. It
//      was the last page on the service surface still serving noindex; it joined
//      the index in 08-04 once its content was authored and rendered.
assert.equal(
  isIndexable(findBySlug("/diensten")!),
  true,
  "the /diensten hub must be indexable — it is the umbrella page the whole service surface hangs off",
);

// (3) Canonical origin is the www host with no trailing slash; root keeps its slash.
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

// (4) Site-wide business JSON-LD is HVACBusiness, stable @id, geoRadius 60000.
// aggregateRating is gated on REVIEW_RATING (D-17): absent until the owner supplies
// real Google data, present + typed once set.
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

// (5) FAQPage returns null for an empty-faq node (renders only where FAQs exist).
assert.equal(faqJsonLd(findBySlug("/contact")!), null, "faqJsonLd must be null on an empty-faq node");

console.log(
  `✅ SEO policy OK — indexation invariant holds (sitemap membership ⇔ isIndexable, ${sitemapEntries().length} entries ` +
    `vs floor ${INDEXABLE_FLOOR}, all absolute on the canonical origin, none orphaned); ` +
    `hub + 4/4 pillars + ${subServiceCount} sub-services indexable by name, privacy-beleid noindex; ` +
    `www canonical, HVACBusiness @id (geoRadius 60000), faq null-on-empty.`,
);
