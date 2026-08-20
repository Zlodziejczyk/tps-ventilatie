// Build-time CLI — proves the gates genuinely BLOCK their failure modes WITHOUT
// committing broken data: it perturbs in-memory clones and asserts the gate
// rejects them. node:assert only (no jest/vitest — out of scope this milestone).
// Intentional console usage (build-time CLI).
//
// Wired into `npm run prebuild` — build-blocking on every Vercel build (D-01).
// Run standalone:  npx tsx scripts/assert-gate-blocks.ts
//
// Two families of proof live here:
//   (A)-(C)  the Zod taxonomy gate — perturbed clones must fail pagesSchema
//   (P1)-(P5) the relational indexation invariant — perturbed inputs must yield
//             the SPECIFIC violation code that names the breakage
//
// THE LESSON THIS FILE ENCODES (D-03): address a perturbation by predicate and by
// the property under test — NEVER by array position. Perturbation (B) used to reach
// into the second slot of the array and publish whatever it found there, expecting a
// thin-content rejection. When the Phase-4 content landed, that slot became the
// airconditioning pillar with a 148-word intro, so the clone validated and the
// assertion passed for the wrong reason. It had been proving nothing for months.
// A position-addressed perturbation is itself a snapshot assertion: it decays
// silently the moment the data moves.
// For the same reason each invariant proof below asserts a specific violation
// code rather than merely "the list is non-empty" — a wrong-reason pass is how
// the previous gate rotted.

import assert from "node:assert/strict";
import { pagesSchema } from "@/lib/services/types";
import type { PageNode } from "@/lib/services/types";
import { PAGES } from "@/lib/services/registry";
import { checkIndexationInvariants } from "@/lib/seo/invariants";
import {
  absoluteUrl,
  indexableSurface,
  isIndexable,
  sitemapEntries,
} from "@/lib/seo/policy";

function codes(violations: { code: string }[]): string {
  return violations.map((v) => v.code).join(", ") || "(none)";
}

// ── (A)-(C) The Zod taxonomy gate ──────────────────────────────────────────

// (A) Duplicate primaryKeyword (cannibalization) — give the first pillar the
//     hub's primary keyword. Predicate-addressed: the nodes are found by what
//     they ARE, not by where they sit.
const dupClone = structuredClone(PAGES);
const dupTarget = dupClone.find((node) => node.type === "pillar");
const dupSource = dupClone.find((node) => node.type === "hub");
assert(dupTarget && dupSource, "the clone must contain a pillar and the hub");
dupTarget.primaryKeyword = dupSource.primaryKeyword;
assert.equal(
  pagesSchema.safeParse(dupClone).success,
  false,
  "duplicate primaryKeyword must make the gate fail (cannibalization)",
);

// (B) Thin published content — publish a pillar AND blank its intro. Both halves
//     matter: the status makes the >=120-word bar apply, the blanked intro is the
//     property under test. The old version only did the first half and trusted
//     position 1 to be a thin node; it silently stopped proving anything.
const shortClone = structuredClone(PAGES);
const shortTarget = shortClone.find((node) => node.type === "pillar");
assert(shortTarget, "the clone must contain a pillar");
shortTarget.status = "published";
shortTarget.content = { ...shortTarget.content, intro: "Te kort." };
assert.equal(
  pagesSchema.safeParse(shortClone).success,
  false,
  "a published node with a <120-word intro must make the gate fail (thin content)",
);

// (C) Missing slug — a service node stripped of its serviceSlug must fail the
//     discriminated-union gate (it would otherwise yield a /…/undefined URL).
const noSlugClone = structuredClone(PAGES) as unknown as Record<string, unknown>[];
const service = noSlugClone.find((node) => node.type === "service");
assert(service, "the clone must contain a service node");
delete service.serviceSlug;
assert.equal(
  pagesSchema.safeParse(noSlugClone).success,
  false,
  "a service node missing serviceSlug must fail the discriminated-union gate",
);

// Sanity — the unmodified, committed taxonomy still validates.
assert.equal(
  pagesSchema.safeParse(PAGES).success,
  true,
  "the committed taxonomy must validate",
);

// ── (P1)-(P5) The relational indexation invariant ──────────────────────────

const realNodes = indexableSurface();
const realEntries = sitemapEntries();

// (P1) Move a pillar ACROSS the indexability line while the sitemap stays as it
//      is. Whichever side it starts on, the relation must break: an indexable
//      node missing from the sitemap, or a sitemapped node gone noindex. Written
//      to hold both before the Phase-8 flip (pillars are `review`) and after it
//      (pillars are `published`) — a perturbation that only works in today's
//      state is the same snapshot mistake one level up.
const flipNodes = structuredClone(realNodes) as PageNode[];
const flipTarget = flipNodes.find((node) => node.type === "pillar");
assert(flipTarget, "the clone must contain a pillar");
flipTarget.status = isIndexable(flipTarget) ? "review" : "published";
const p1 = checkIndexationInvariants({ nodes: flipNodes, entries: realEntries });
assert.ok(
  p1.some(
    (v) => v.code === "sitemap-without-index" || v.code === "index-without-sitemap",
  ),
  `P1: moving a pillar across the indexability line must break the relation, got: ${codes(p1)}`,
);

// (P2) Drop an entry from the sitemap — an indexable page that is no longer
//      announced. This is the shape of the bug the whole phase exists to fix.
const p2 = checkIndexationInvariants({
  nodes: realNodes,
  entries: realEntries.slice(1),
});
assert.ok(
  p2.some((v) => v.code === "index-without-sitemap"),
  `P2: dropping a sitemap entry must yield index-without-sitemap, got: ${codes(p2)}`,
);

// (P3) Append a URL no node backs — the "second list bolted onto app/sitemap.ts"
//      failure mode. This is what keeps the sitemap derivable from one source.
const p3 = checkIndexationInvariants({
  nodes: realNodes,
  entries: [...realEntries, { url: absoluteUrl("/niet-bestaand") }],
});
assert.ok(
  p3.some((v) => v.code === "orphan-entry"),
  `P3: a sitemap URL with no backing node must yield orphan-entry, got: ${codes(p3)}`,
);

// (P4) Mass de-indexation — a floor one above the current count must trip.
//      Derived from live data, never hardcoded, so this proof cannot decay.
const indexableNow = realNodes.filter(isIndexable).length;
const p4 = checkIndexationInvariants({ floor: indexableNow + 1 });
assert.ok(
  p4.some((v) => v.code === "below-floor"),
  `P4: a floor above the current indexable count must yield below-floor, got: ${codes(p4)}`,
);

// (P5) The control. Unperturbed reality must yield exactly zero violations —
//      without this, every proof above could be passing because the checker is
//      simply always angry.
const p5 = checkIndexationInvariants();
assert.equal(
  p5.length,
  0,
  `P5: the real surface must yield zero violations, got: ${codes(p5)}`,
);

console.log(
  `✅ Gates provably bite — Zod: duplicate primaryKeyword + thin published intro + missing serviceSlug all rejected; ` +
    `invariant: relational break (P1), dropped entry (P2), orphan entry (P3), below floor (P4) each caught by code, ` +
    `and the real surface is clean (P5, ${indexableNow} indexable / ${realEntries.length} entries).`,
);
