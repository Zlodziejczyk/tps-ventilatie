// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node 26 built-ins suffice).
//
// Wired into `npm run prebuild` — build-blocking on every Vercel build (D-01).
// Run standalone:  npx tsx scripts/assert-registry.ts
// Validates Crit 1 / IA-01: the unified PAGES array is the full routable
// surface, every urlFor() is unique, the D-03 URL policy holds, urlFor agrees
// with the schema's canonicalPath primitive (no drift), and the taxonomy
// validates. The surface itself is asserted by type composition plus a named
// floor rather than by an exact count — see the MIN_ROUTABLE_PAGES block below
// for why. Exits non-zero (assertion throws) on any gap.

import assert from "node:assert/strict";
import { canonicalPath } from "@/lib/services/types";
import { BRANDS } from "@/lib/services/brands";
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

// The routable surface, asserted as a COMPOSITION plus a floor — never as one
// exact number. This block used to be a single equality against a hardcoded 27.
// It had been failing since /projecten joined the surface (quick task 260719-t62)
// and nobody knew, because nothing executed this script. The tempting repair —
// change the number to 28 — is precisely the move that kept the whole service
// surface hidden from Google (commit 82d897b), so the shape below is deliberate:
// structural counts where the count is genuinely fixed, floors where the surface
// is meant to grow.
//
// MIN_ROUTABLE_PAGES derivation: 1 hub + 4 pillars + 17 sub-services + 6 statics = 28.
const MIN_ROUTABLE_PAGES = 28;

const HUB_COUNT = findByType("hub").length;
const PILLAR_COUNT = findByType("pillar").length;
const SERVICE_COUNT = findByType("service").length;
const STATIC_COUNT = findByType("static").length;

// (1a) Type composition by name — exactly one hub and exactly four pillars (the
//      IA is fixed at that level); services and statics are FLOORS so a
//      legitimately-added page never requires a gate edit.
assert.equal(HUB_COUNT, 1, `exactly 1 hub node expected, got ${HUB_COUNT}`);
assert.equal(PILLAR_COUNT, 4, `exactly 4 pillar nodes expected, got ${PILLAR_COUNT}`);
assert(
  SERVICE_COUNT >= 17,
  `at least 17 sub-service nodes expected, got ${SERVICE_COUNT}`,
);
assert(STATIC_COUNT >= 6, `at least 6 static nodes expected, got ${STATIC_COUNT}`);

// (1b) Every node is reachable through a recognised type. If a node carried an
//      unrecognised `type` it would silently drop out of every traversal (nav,
//      sitemap, JSON-LD) while still inflating the array length.
const TYPED_TOTAL = HUB_COUNT + PILLAR_COUNT + SERVICE_COUNT + STATIC_COUNT;
assert.equal(
  TYPED_TOTAL,
  PAGES.length,
  `every node must have a recognised type: Σ findByType = ${TYPED_TOTAL} but PAGES holds ${PAGES.length}`,
);

// (1c) The floor. Read the message before touching the number.
assert(
  PAGES.length >= MIN_ROUTABLE_PAGES,
  `Only ${PAGES.length} routable pages, floor is ${MIN_ROUTABLE_PAGES}. A DROP MEANS A PAGE LEFT THE ` +
    `ROUTABLE SURFACE — find out what disappeared before you touch this number. Lower the floor ONLY when a ` +
    `page was deliberately retired, and never edit it just to make the build pass.`,
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

// (9) brandsForPillar — asserted as the helper's CONTRACT, not as a snapshot of
//     which brands TPS currently installs. This block used to deep-equal four
//     fixed brand lists, including "wtw must carry no brands" and the same for
//     mechanische-ventilatie. Both went stale the moment the owner confirmed the
//     Zehnder / Duco / Itho Daalderop sets (2026-07-02/03) — and, like the count
//     above, nothing re-ran this script, so nobody found out. Editing the four
//     lists to match today's brands would just re-arm the same trap. What is
//     actually invariant is the derivation: the helper returns the de-duplicated
//     union of its children's brandIds, in first-appearance order, and every id
//     it returns resolves to a real brand.
for (const pillar of pillars()) {
  const expected: string[] = [];
  for (const child of childrenOf(pillar.pillarSlug)) {
    for (const id of child.brandIds ?? []) {
      if (!expected.includes(id)) {
        expected.push(id);
      }
    }
  }
  assert.deepEqual(
    brandsForPillar(pillar.pillarSlug),
    expected,
    `brandsForPillar("${pillar.pillarSlug}") must be the de-duplicated, order-stable union of its children's brandIds`,
  );
  for (const id of brandsForPillar(pillar.pillarSlug)) {
    assert(
      id in BRANDS,
      `brand id "${id}" on pillar "${pillar.pillarSlug}" does not resolve in BRANDS — a brand mark would render blank`,
    );
  }
}

// (9b) At least one pillar actually exposes brands, so a bug that made
//      brandsForPillar always return [] could not pass (9) vacuously.
assert(
  pillars().some((p) => brandsForPillar(p.pillarSlug).length > 0),
  "at least one pillar must expose brand ids — an always-empty helper would satisfy (9) vacuously",
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

// ── 02-06 content-port spot checks (D-04/D-05) — lock the salvaged content. ──

// (12) WTW vervangen carries the salvaged 10-step sequence, every step non-empty.
const wtwVervangen = findService("wtw", "vervangen");
assert(wtwVervangen, "wtw/vervangen must exist");
assert.equal(
  wtwVervangen.content.steps.length,
  10,
  `wtw/vervangen must carry 10 ported steps, got ${wtwVervangen.content.steps.length}`,
);
assert(
  wtwVervangen.content.steps.every(
    (s) => s.title.trim() !== "" && s.body.trim() !== "",
  ),
  "every wtw/vervangen step must have a non-empty title and body",
);

// (13) No node's intro mentions "Panasonic" (D-05 — taxonomy brands are
//      Daikin / Mitsubishi Electric / Mitsubishi Heavy / Mitsubishi Ecodan).
assert(
  PAGES.every((node) => !node.content.intro.includes("Panasonic")),
  "no node content.intro may mention Panasonic (D-05 brand alignment)",
);

// (14) Warmtepompen installatie still carries its 2 brandIds (port regression guard).
const wpInstallatie = findService("warmtepompen", "installatie");
assert(wpInstallatie, "warmtepompen/installatie must exist");
assert.equal(
  wpInstallatie.brandIds?.length,
  2,
  "warmtepompen/installatie must keep its 2 brandIds after the content port",
);

console.log(
  `✅ Registry OK — ${PAGES.length} routable pages (${HUB_COUNT} hub / ${PILLAR_COUNT} pillars / ${SERVICE_COUNT} services / ${STATIC_COUNT} statics, floor ${MIN_ROUTABLE_PAGES}), ` +
    `${uniqueUrls.size} unique URLs, D-03 policy holds, taxonomy validates, Phase-2 helpers locked, content port spot-checked (WTW 10 steps).`,
);
