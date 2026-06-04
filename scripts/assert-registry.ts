// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node 26 built-ins suffice).
//
// Run on demand:  npx tsx scripts/assert-registry.ts
// Validates Crit 1 / IA-01: the unified PAGES array is the full routable
// surface, every urlFor() is unique, the D-03 URL policy holds, urlFor agrees
// with the schema's canonicalPath primitive (no drift), and the all-draft
// taxonomy validates. Exits non-zero (assertion throws) on any gap. This is the
// standalone structural check, separate from the 01-06 Zod prebuild gate.

import assert from "node:assert/strict";
import { canonicalPath } from "@/lib/services/types";
import {
  PAGES,
  urlFor,
  validateTaxonomy,
  findByType,
  pillars,
  findPillar,
  childrenOf,
  findService,
  siblingsOf,
  brandsForPillar,
  trailFor,
  pillarTarievenTab,
} from "@/lib/services/registry";

// Expected full surface: 1 hub + 4 pillars + 17 sub-services + 5 static = 27.
const EXPECTED_PAGE_COUNT = 27;

// (1) PAGES is the full surface.
assert.equal(
  PAGES.length,
  EXPECTED_PAGE_COUNT,
  `PAGES must hold ${EXPECTED_PAGE_COUNT} nodes (1 hub + 4 pillars + 17 subs + 5 static), got ${PAGES.length}`,
);

// (2) Every canonical URL is unique across PAGES.
const urls = PAGES.map((node) => urlFor(node));
const uniqueUrls = new Set(urls);
assert.equal(
  uniqueUrls.size,
  PAGES.length,
  "every urlFor(node) must be unique across PAGES (duplicate canonical URL detected)",
);

// (3) D-03 URL policy: leading slash, lowercase, only "/" is the root, no other
//     URL ends in a trailing slash.
let rootCount = 0;
for (const url of urls) {
  assert(url.startsWith("/"), `URL must start with a leading slash: "${url}"`);
  assert.equal(url, url.toLowerCase(), `URL must be lowercase: "${url}"`);
  if (url === "/") {
    rootCount += 1;
  } else {
    assert(!url.endsWith("/"), `non-root URL must not end with a trailing slash: "${url}"`);
  }
}
assert.equal(rootCount, 1, "exactly one URL (home) must be the site root \"/\"");

// (4) urlFor and the schema's canonicalPath primitive agree for every node
//     (drift guard — the two switches must never diverge).
for (const node of PAGES) {
  assert.equal(
    urlFor(node),
    canonicalPath(node),
    `urlFor and canonicalPath disagree for "${node.primaryKeyword}"`,
  );
}

// (5) The all-draft taxonomy validates against pagesSchema (no throw).
const validation = validateTaxonomy(PAGES);
assert(
  validation.ok,
  "validateTaxonomy(PAGES) must be ok for the all-draft taxonomy",
);

// ── Phase 2 (02-01) helper assertions — lock the taxonomy lookups + render
//    helpers. These bind the render layer's data contract: any regression in a
//    helper exits this script non-zero (assert throws). ──

// (6) pillars() returns exactly the 4 pillar pages.
assert.equal(
  pillars().length,
  4,
  `pillars() must return the 4 pillars, got ${pillars().length}`,
);

// (7) The 4 pillars together carry exactly 17 sub-services.
const childCount = pillars().reduce(
  (sum, p) => sum + childrenOf(p.pillarSlug).length,
  0,
);
assert.equal(
  childCount,
  17,
  `Σ childrenOf over the 4 pillars must be 17, got ${childCount}`,
);

// (8) siblingsOf excludes the queried node and stays in-pillar (sample: airco/installatie).
const airSiblings = siblingsOf("airconditioning", "installatie");
assert(
  airSiblings.every((s) => s.serviceSlug !== "installatie"),
  "siblingsOf must exclude the queried service itself",
);
assert(
  airSiblings.every((s) => s.pillarSlug === "airconditioning"),
  "siblingsOf must only return same-pillar services",
);

// (9) brandsForPillar — the locked brand sets (D-02): airco 3, warmtepompen 2, wtw/mv 0.
assert.deepEqual(
  brandsForPillar("airconditioning"),
  ["daikin", "mitsubishi-electric", "mitsubishi-heavy"],
  "airconditioning must expose the 3 locked airco brands (order-stable)",
);
assert.deepEqual(
  brandsForPillar("warmtepompen"),
  ["daikin", "mitsubishi-ecodan"],
  "warmtepompen must expose daikin + mitsubishi-ecodan",
);
assert.equal(brandsForPillar("wtw").length, 0, "wtw pillar must carry no brands");
assert.equal(
  brandsForPillar("mechanische-ventilatie").length,
  0,
  "mechanische-ventilatie pillar must carry no brands",
);

// (10) trailFor lengths (hub 2 / pillar 3 / service 4) + last crumb href === urlFor(node).
const hubNode = findByType("hub")[0];
const pillarNode = findPillar("wtw");
const serviceNode = findService("airconditioning", "installatie");
assert(
  hubNode && pillarNode && serviceNode,
  "hub/pillar/service sample nodes must resolve from the registry",
);
const hubTrail = trailFor(hubNode);
const pillarTrail = trailFor(pillarNode);
const serviceTrail = trailFor(serviceNode);
assert.equal(hubTrail.length, 2, `hub trail must be length 2, got ${hubTrail.length}`);
assert.equal(
  pillarTrail.length,
  3,
  `pillar trail must be length 3, got ${pillarTrail.length}`,
);
assert.equal(
  serviceTrail.length,
  4,
  `service trail must be length 4, got ${serviceTrail.length}`,
);
assert.equal(
  hubTrail[hubTrail.length - 1].href,
  urlFor(hubNode),
  "hub trail's last crumb href must equal urlFor(hub)",
);
assert.equal(
  pillarTrail[pillarTrail.length - 1].href,
  urlFor(pillarNode),
  "pillar trail's last crumb href must equal urlFor(pillar)",
);
assert.equal(
  serviceTrail[serviceTrail.length - 1].href,
  urlFor(serviceNode),
  "service trail's last crumb href must equal urlFor(service)",
);

// (11) pillarTarievenTab — airco/wtw/mv map to a tab; warmtepompen has none (RESEARCH §5).
assert.equal(pillarTarievenTab("airconditioning"), "airco", "airconditioning → airco tab");
assert.equal(pillarTarievenTab("wtw"), "wtw", "wtw → wtw tab");
assert.equal(
  pillarTarievenTab("mechanische-ventilatie"),
  "mv",
  "mechanische-ventilatie → mv tab",
);
assert.equal(
  pillarTarievenTab("warmtepompen"),
  null,
  "warmtepompen → null (no tarieven tab)",
);

console.log(
  `✅ Registry OK — ${PAGES.length} pages, ${uniqueUrls.size} unique URLs, D-03 policy holds, taxonomy validates, Phase-2 helpers locked (4 pillars, 17 subs, brand/trail/tarieven helpers).`,
);
