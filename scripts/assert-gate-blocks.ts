// Build-time CLI — proves the taxonomy gate genuinely BLOCKS both failure modes
// WITHOUT committing broken data: it perturbs in-memory clones of PAGES and
// asserts pagesSchema rejects them. node:assert only (no jest/vitest — out of
// scope this milestone). Intentional console usage (build-time CLI).
//
// Run on demand:  npx tsx scripts/assert-gate-blocks.ts

import assert from "node:assert/strict";
import { pagesSchema } from "@/lib/services/types";
import { PAGES } from "@/lib/services/registry";

// (A) Duplicate primaryKeyword (cannibalization) — give node #1 node #0's primary.
const dupClone = structuredClone(PAGES);
dupClone[1].primaryKeyword = dupClone[0].primaryKeyword;
const dupResult = pagesSchema.safeParse(dupClone);
assert.equal(
  dupResult.success,
  false,
  "duplicate primaryKeyword must make the gate fail (cannibalization)",
);

// (B) Short published intro (thin content) — flip node #1 to published while its
//     draft intro is empty (<120 words).
const shortClone = structuredClone(PAGES);
shortClone[1].status = "published";
const shortResult = pagesSchema.safeParse(shortClone);
assert.equal(
  shortResult.success,
  false,
  "a published node with a <120-word intro must make the gate fail (thin content)",
);

// (C) Missing slug — a service node stripped of its serviceSlug must fail the
//     discriminated-union gate (it would otherwise yield a /…/undefined URL).
const noSlugClone = structuredClone(PAGES) as unknown as Record<string, unknown>[];
const service = noSlugClone.find((node) => node.type === "service");
if (service) {
  delete service.serviceSlug;
}
const noSlugResult = pagesSchema.safeParse(noSlugClone);
assert.equal(
  noSlugResult.success,
  false,
  "a service node missing serviceSlug must fail the discriminated-union gate",
);

// Sanity — the unmodified, committed all-draft taxonomy still validates.
assert.equal(
  pagesSchema.safeParse(PAGES).success,
  true,
  "the committed all-draft taxonomy must validate",
);

console.log(
  "✅ Gate blocks all three failure modes (duplicate primaryKeyword + short published intro + missing slug); committed taxonomy validates.",
);
