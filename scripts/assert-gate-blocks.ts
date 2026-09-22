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
import { checkIndexationInvariants, INDEXABLE_FLOOR } from "@/lib/seo/invariants";
import {
  absoluteUrl,
  indexableSurface,
  isIndexable,
  sitemapEntries,
} from "@/lib/seo/policy";
import {
  LEGACY_REDIRECTS,
  toCatchAllRedirect,
  toNextRedirects,
  toTrailingSlashRedirect,
  type LegacyRedirect,
} from "@/lib/seo/redirects";
import { checkRedirectInvariants } from "@/lib/seo/redirect-invariants";

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

// (D) A hub published with an EMPTY content shell must be REJECTED. This is the
//     assertion that forced 08-04 to author real /diensten content before the hub
//     could publish — without it, the hub could have joined the index carrying
//     nothing but metadata. It is the reason the content bar still earns its keep
//     after being scoped to the rendered types in 08-02.
//
//     The perturbation BLANKS THE SHELL explicitly rather than relying on the real
//     hub happening to be empty. Written the first way it silently stopped testing
//     anything the moment 08-04 authored the copy — the same decay that turned
//     perturbation (B) into a no-op. Address the property under test, always.
const emptyHubClone = structuredClone(PAGES);
const emptyHub = emptyHubClone.find((node) => node.type === "hub");
assert(emptyHub, "the clone must contain the hub");
emptyHub.status = "published";
emptyHub.content = { ...emptyHub.content, intro: "", steps: [], faqs: [] };
assert.equal(
  pagesSchema.safeParse(emptyHubClone).success,
  false,
  "a hub with an empty content shell must not be publishable — the umbrella page has to say something before it can be indexed",
);

// (E) A static published with an empty shell must be ACCEPTED. DELIBERATE, not an
//     oversight (D-20 / IDX-05): statics are bespoke hand-built routes, so their
//     taxonomy content is metadata, not the page body. Holding them to the
//     thin-content bar would force 120+ words and a set of FAQs into nodes that
//     render none of it. Do NOT "fix" this back — the scoping is in
//     lib/services/types.ts under CONTENT_BAR_TYPES, with the reasoning.
const publishedStaticClone = structuredClone(PAGES);
const emptyStatic = publishedStaticClone.find(
  (node) => node.type === "static" && node.content.intro.trim() === "",
);
assert(emptyStatic, "the clone must contain a static with an empty intro");
emptyStatic.status = "published";
assert.equal(
  pagesSchema.safeParse(publishedStaticClone).success,
  true,
  "a published static with an empty content shell must VALIDATE — the bar governs only the taxonomy-rendered types",
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

// (P4) De-indexation — take ONE published page dark and the REAL floor must trip.
//      This exercises the shipped INDEXABLE_FLOOR rather than an ad-hoc number, so
//      the proof is about the constant the build actually enforces. Predicate-
//      addressed (any published node), so it survives changes to the page set.
const indexableNow = realNodes.filter(isIndexable).length;
const darkNodes = structuredClone(realNodes) as PageNode[];
const goDark = darkNodes.find((node) => node.status === "published");
assert(goDark, "the clone must contain a published node");
goDark.status = "draft";
const p4 = checkIndexationInvariants({
  nodes: darkNodes,
  entries: realEntries,
  floor: INDEXABLE_FLOOR,
});
assert.ok(
  p4.some((v) => v.code === "below-floor"),
  `P4: losing a published page must breach INDEXABLE_FLOOR (${INDEXABLE_FLOOR}), got: ${codes(p4)}`,
);

// (P5) The control. Unperturbed reality must yield exactly zero violations —
//      without this, every proof above could be passing because the checker is
//      simply always angry.
const p5 = checkIndexationInvariants({ floor: INDEXABLE_FLOOR });
assert.equal(
  p5.length,
  0,
  `P5: the real surface must yield zero violations, got: ${codes(p5)}`,
);

console.log(
  `✅ Gates provably bite — Zod: duplicate primaryKeyword + thin published intro + missing serviceSlug + empty published hub all rejected, ` +
    `empty published static accepted (scoped bar, D-20); ` +
    `invariant: relational break (P1), dropped entry (P2), orphan entry (P3), a page going dark under the real ` +
    `INDEXABLE_FLOOR (P4) each caught by code, and the real surface is clean at the floor ` +
    `(P5, ${indexableNow} indexable / ${realEntries.length} entries, floor ${INDEXABLE_FLOOR}).`,
);

// ── (R1)-(R9) The legacy redirect map (Phase 10, D-17) ─────────────────────
//
// Same discipline as above: every perturbation is addressed BY PREDICATE and asserts
// its OWN violation code. R1-R4 are the ones worth the file — they encode the two
// findings that would otherwise have been discovered by Google: an un-gated catch-all
// that 301s the live site to itself, and a normalisation rule in the wrong position
// that silently costs every legacy URL a second hop while every build stays green.

const realEmitted: unknown[] = [
  ...toNextRedirects(),
  toCatchAllRedirect(),
  toTrailingSlashRedirect(),
];

// (R1) Strip the host gate from the catch-all — found by predicate on its source, never
//      by array position. This is the catastrophic one.
const r1Emitted = structuredClone(realEmitted) as Record<string, unknown>[];
const r1CatchAll = r1Emitted.find((rule) => rule.source === "/:path*");
assert(r1CatchAll, "the clone must contain the catch-all");
delete r1CatchAll.has;
const r1 = checkRedirectInvariants({ emitted: r1Emitted, skipTrailingSlashRedirect: true });
assert.ok(
  r1.some((v) => v.code === "catchall-not-host-gated"),
  `R1: an un-gated catch-all must yield catchall-not-host-gated, got: ${codes(r1)}`,
);

// (R2) The plausible "simplification" of the host pattern — dropping the alternation so it
//      no longer matches the www form, which is half the legacy traffic.
const r2 = checkRedirectInvariants({
  emitted: realEmitted,
  hostPattern: "tpsventilatie\\.nl",
  skipTrailingSlashRedirect: true,
});
assert.ok(
  r2.some((v) => v.code === "host-pattern-scope"),
  `R2: a pattern that misses the www form must yield host-pattern-scope, got: ${codes(r2)}`,
);

// (R3) Move the normalisation rule off the last position — the exact thing Next.js does on
//      its own when skipTrailingSlashRedirect is unset.
const r3Emitted = structuredClone(realEmitted) as Record<string, unknown>[];
const r3Index = r3Emitted.findIndex((rule) => rule.source === "/:path+/");
assert(r3Index !== -1, "the clone must contain the normalisation rule");
const [r3Rule] = r3Emitted.splice(r3Index, 1);
r3Emitted.unshift(r3Rule);
const r3 = checkRedirectInvariants({ emitted: r3Emitted, skipTrailingSlashRedirect: true });
assert.ok(
  r3.some((v) => v.code === "normalisation-not-last"),
  `R3: normalisation ahead of the legacy rules must yield normalisation-not-last, got: ${codes(r3)}`,
);

// (R4) The array is correct but the config key is off — the silent half of the same finding.
//      Without this proof, R3 alone would let someone delete the config line and stay green.
const r4 = checkRedirectInvariants({ emitted: realEmitted, skipTrailingSlashRedirect: false });
assert.ok(
  r4.some((v) => v.code === "normalisation-not-last"),
  `R4: skipTrailingSlashRedirect off must yield normalisation-not-last, got: ${codes(r4)}`,
);

// (R5) Duplicate a source — the second rule is dead and invisible.
const r5Map = [...LEGACY_REDIRECTS, { ...LEGACY_REDIRECTS[1] }];
const r5 = checkRedirectInvariants({
  map: r5Map,
  emitted: realEmitted,
  skipTrailingSlashRedirect: true,
});
assert.ok(
  r5.some((v) => v.code === "duplicate-source"),
  `R5: a duplicated source must yield duplicate-source, got: ${codes(r5)}`,
);

// (R6) Point a destination at another entry's source — a chain, which is what MIG-06 exists
//      to stop. Predicate-addressed: take any entry that is not the root and aim it at the
//      root-adjacent source of another.
const r6Map = structuredClone(LEGACY_REDIRECTS) as LegacyRedirect[];
const r6Victim = r6Map.find((entry) => entry.from !== "/" && entry.to !== "/");
const r6Target = r6Map.find((entry) => entry.from !== "/" && entry.from !== r6Victim?.from);
assert(r6Victim && r6Target, "the clone must contain two distinct non-root entries");
r6Victim.to = r6Target.from.replace(/\/$/, "");
const r6 = checkRedirectInvariants({
  map: r6Map,
  emitted: realEmitted,
  skipTrailingSlashRedirect: true,
});
assert.ok(
  r6.some((v) => v.code === "destination-is-a-source"),
  `R6: a destination that is itself a source must yield destination-is-a-source, got: ${codes(r6)}`,
);

// (R7) Drop the why from the one judgement call — found by its confidence, not its slug, so
//      the proof survives the map changing which entry is the judgement.
const r7Map = structuredClone(LEGACY_REDIRECTS) as LegacyRedirect[];
const r7Target = r7Map.find((entry) => entry.confidence === "judgement");
assert(r7Target, "the clone must contain a judgement entry");
delete r7Target.why;
const r7 = checkRedirectInvariants({
  map: r7Map,
  emitted: realEmitted,
  skipTrailingSlashRedirect: true,
});
assert.ok(
  r7.some((v) => v.code === "judgement-without-why"),
  `R7: a judgement call with no reasoning must yield judgement-without-why, got: ${codes(r7)}`,
);

// (R8) Leak a metadata key onto an emitted object — Next would fail the build with its own
//      terse message; we want ours, which says where the key belongs.
const r8Emitted = structuredClone(realEmitted) as Record<string, unknown>[];
const r8Target = r8Emitted.find((rule) => rule.source === "/over-ons/");
assert(r8Target, "the clone must contain the over-ons rule");
r8Target.confidence = "certain";
const r8 = checkRedirectInvariants({ emitted: r8Emitted, skipTrailingSlashRedirect: true });
assert.ok(
  r8.some((v) => v.code === "emitted-invalid-key"),
  `R8: a metadata key on an emitted object must yield emitted-invalid-key, got: ${codes(r8)}`,
);

// (R9) The control. Unperturbed reality must yield exactly zero violations — without this,
//      every proof above could be passing because the checker is simply always angry.
const r9 = checkRedirectInvariants({ emitted: realEmitted, skipTrailingSlashRedirect: true });
assert.equal(
  r9.length,
  0,
  `R9 (control): the real redirect map must yield zero violations, got: ${codes(r9)}`,
);

console.log(
  `✅ Redirect gates provably bite — un-gated catch-all (R1), a host pattern that misses the www form (R2), ` +
    `normalisation off the last position (R3) and skipTrailingSlashRedirect turned off (R4) each caught by code; ` +
    `plus duplicate source (R5), a chain (R6), a judgement with no reasoning (R7) and a leaked metadata key (R8). ` +
    `The real map is clean at the control (R9, ${LEGACY_REDIRECTS.length} entries / ${realEmitted.length} emitted rules).`,
);
