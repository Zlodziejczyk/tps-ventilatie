// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node 26 built-ins suffice).
//
// Run on demand:  npx tsx scripts/assert-site-shape.ts
// Validates Crit 5 / SEO-08: the full structured NAP field set on SITE is
// present and correctly typed. Exits non-zero (assertion throws) on any gap.
// This is standalone — it is NOT wired into `prebuild` (that gate validates the
// taxonomy in plan 01-06; this script validates SITE shape).

import assert from "node:assert/strict";
import { SITE } from "@/lib/constants";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

// NAP string fields — present and non-empty.
for (const field of [
  "name",
  "address",
  "postcode",
  "city",
  "province",
  "country",
] as const) {
  assert(
    isNonEmptyString(SITE[field]),
    `SITE.${field} must be a non-empty string`,
  );
}

// Geo coordinates — present and numeric.
assert(
  SITE.geo !== null && typeof SITE.geo === "object",
  "SITE.geo must be an object",
);
assert(typeof SITE.geo.lat === "number", "SITE.geo.lat must be a number");
assert(typeof SITE.geo.lng === "number", "SITE.geo.lng must be a number");

// Service radius — numeric and the single corrected value (D-09).
assert(
  typeof SITE.serviceRadiusKm === "number",
  "SITE.serviceRadiusKm must be a number",
);
assert(
  SITE.serviceRadiusKm === 60,
  `SITE.serviceRadiusKm must equal 60 (D-09), got ${SITE.serviceRadiusKm}`,
);

// Service areas — non-empty array of non-empty strings.
assert(Array.isArray(SITE.serviceAreas), "SITE.serviceAreas must be an array");
assert(
  SITE.serviceAreas.length > 0,
  "SITE.serviceAreas must be a non-empty array",
);
assert(
  SITE.serviceAreas.every(isNonEmptyString),
  "SITE.serviceAreas must contain only non-empty strings",
);

console.log(
  `✅ SITE shape OK — NAP field set complete (${SITE.serviceAreas.length} service areas, radius ${SITE.serviceRadiusKm} km).`,
);
