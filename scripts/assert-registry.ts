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
import { PAGES, urlFor, validateTaxonomy } from "@/lib/services/registry";

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

console.log(
  `✅ Registry OK — ${PAGES.length} pages, ${uniqueUrls.size} unique URLs, D-03 policy holds, taxonomy validates.`,
);
