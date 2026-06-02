---
phase: 01-taxonomy-data-model
verified: 2026-06-02T12:00:00Z
status: human_needed
score: 13/13
overrides_applied: 0
human_verification:
  - test: "Confirm WhyTPSSection h2 still reads 'TPS Ventilatie' (old brand name)"
    expected: "The h2 should read 'TPS klimaattechniek' if the brand-name correction propagated to visible copy; however the REVIEW explicitly marks visible-copy propagation as out-of-phase-1 scope (only SITE.name was corrected)"
    why_human: "The phase intentionally did NOT update visible copy — this is a documentation confirmation that the deferred copy item is tracked and won't be mistaken for a gap. A human should confirm the REVIEW disposition note is understood."
  - test: "Owner reviews SITE.serviceAreas seed list and owner-verify-pending geo lat/lng"
    expected: "Owner confirms the 8 seed service areas are accurate (or corrects them) and supplies real geo coordinates to replace the Zoetermeer centroid placeholder"
    why_human: "Flagged inline as owner-verify-pending placeholders (A2/A3). Not a code defect — by design these await owner input before Phase 3/5 JSON-LD and Maps pin work begins."
  - test: "Owner/SEO validates [ASSUMED] keyword strings before Phase 4"
    expected: "The keyword map (primaryKeyword on all 27 nodes) is validated in Google Keyword Planner / Ahrefs and any adjustments recorded before Phase 4 locks content"
    why_human: "All keyword strings carry an [ASSUMED] file-level annotation (per plan 01-05). This is a deliberate pre-Phase-4 checkpoint, not a code error."
---

# Phase 1: Taxonomy & Data Model — Verification Report

**Phase Goal:** Establish a single typed source of truth for the entire service surface — slugs, URL structure, brand facts, content shells, the keyword map, the anti-thin-content uniqueness bar — and fix NAP/service-radius at the constants layer so it can never drift across the 20+ pages.
**Verified:** 2026-06-02T12:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

All 5 ROADMAP Success Criteria and all 16 plan-frontmatter must-have truths were verified against the actual codebase and live script execution.

| # | Truth (ROADMAP SC / Plan must-have) | Status | Evidence |
|---|-------------------------------------|--------|----------|
| SC-1 | A single taxonomy data model defines every pillar, sub-service, and brand relation — routes, nav, sitemap, JSON-LD all read from it | VERIFIED | `lib/services/registry.ts` exports `PAGES: PageNode[]` (27 nodes). `assert-registry.ts` exit 0: "27 pages, 27 unique URLs, D-03 policy holds, taxonomy validates." No parallel hardcoded route list found. |
| SC-2 | Each planned URL has exactly one assigned primary keyword/search intent — no two URLs target the same intent | VERIFIED | `pagesSchema` superRefine checks `primaryKeyword` uniqueness at build time. `prebuild` exits 0 with 27 pages. `assert-gate-blocks.ts` confirms duplicate primaryKeyword makes the gate exit non-zero. WR-02 (home secondary == over-ons primary) was fixed in `f0eef32` — "TPS klimaattechniek" dropped from home's secondaryKeywords. |
| SC-3 | Every page type has typed required content fields (intro ≥120 words, steps, 3-6 FAQs, local angle) such that a missing field is blocking | VERIFIED | `publishedContentSchema` superRefine enforces these rules for review/published nodes. `assert-gate-blocks.ts` case B (published + empty intro) exits 0, proving the gate blocks thin content. CR-01 fix: `z.discriminatedUnion("type", [...])` at `types.ts:215` — missing slug on a service node now fails the gate (case C in assert-gate-blocks). |
| SC-4 | The service radius reads one corrected value from `lib/constants.ts` — the 50 km / 100 km inconsistency no longer exists anywhere in the codebase | VERIFIED | `SITE.serviceRadiusKm === 60` in `lib/constants.ts:16`. `app/tarieven/page.tsx:63` uses `{SITE.serviceRadiusKm}`. `components/PricingTabs.tsx:443,520` both use `{SITE.serviceRadiusKm}`. `app/page-sections/WhyTPSSection.tsx:21` uses `${SITE.serviceRadiusKm}` (WR-05 fix). `check-radius-literals.sh` exits 0. Manual grep: no `straal van 50|straal van 100|100 km|50km|50 km` found in app/ or components/. |
| SC-5 | NAP resolves from one constants source, ready to feed visible copy and structured data | VERIFIED | `lib/constants.ts` SITE holds: name, address, postcode, city, province, country, geo, serviceRadiusKm, serviceAreas, phone, email, kvk, btw. `assert-site-shape.ts` exits 0: "NAP field set complete (8 service areas, radius 60 km)." |
| T-01 | zod in dependencies, tsx in devDependencies, prebuild wired | VERIFIED | `package.json`: `"zod": "^4.4.3"` in dependencies, `"tsx": "^4.22.4"` in devDependencies, `"prebuild": "tsx scripts/validate-taxonomy.ts"`. |
| T-02 | next.config.ts has trailingSlash: false and retains output: export | VERIFIED | `next.config.ts:5` `trailingSlash: false`, `next.config.ts:4` `output: "export"` unchanged. |
| T-03 | NAP resolves from one SITE constant with full structured field set | VERIFIED | All fields confirmed present at `lib/constants.ts:1-32`. |
| T-04 | SITE.serviceRadiusKm === 60 | VERIFIED | `lib/constants.ts:16: serviceRadiusKm: 60`. `assert-site-shape.ts` asserts equality. |
| T-05 | SITE.name === 'TPS klimaattechniek' | VERIFIED | `lib/constants.ts:2: name: "TPS klimaattechniek"`. |
| T-06 | SITE exposes geo.lat/lng, country, province, serviceAreas[] | VERIFIED | `lib/constants.ts` lines 10-28 confirm all four fields with owner-verify-pending comments on geo and serviceAreas. |
| T-07 | 50km / 100 km inconsistency gone from app/ and components/ | VERIFIED | `check-radius-literals.sh` exits 0. Manual grep returns no matches. |
| T-08 | discriminated-union PageNode type exists with ContentShell + Zod schemas | VERIFIED | `lib/services/types.ts`: `PageNode` union at line 89, `ContentShell` at line 41, `z.discriminatedUnion` at line 215, 3 superRefine calls, 0 `.nonempty()` usages. |
| T-09 | Single PAGES array aggregates 27 nodes | VERIFIED | `assert-registry.ts` exit 0 with count 27. `registry.ts:145` exports `PAGES`. |
| T-10 | urlFor is the ONLY href builder, delegates to canonicalPath | VERIFIED | `registry.ts:157-159`: `urlFor` body is `return canonicalPath(node)`. `assert-registry.ts` equality guard passes for all 27 nodes. |
| T-11 | Prebuild gate exits 0 with all-draft taxonomy; exits non-zero on broken data | VERIFIED | `npm run prebuild` exits 0, output "27 pages passed pagesSchema". `assert-gate-blocks.ts` exits 0 proving 3 failure modes blocked: duplicate primaryKeyword, published + short intro, missing serviceSlug. |

**Score:** 13/13 truths verified (SC-1 through SC-5 are the 5 ROADMAP success criteria; T-01 through T-11 cover the 16 plan frontmatter must-have truths merged and de-duplicated)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | zod dep, tsx devDep, prebuild script | VERIFIED | All three present with correct versions |
| `next.config.ts` | trailingSlash: false, output: export intact | VERIFIED | Both keys confirmed |
| `lib/constants.ts` | SITE with full NAP + serviceRadiusKm + geo + serviceAreas | VERIFIED | All fields present, `as const`, owner-pending comments on geo/serviceAreas |
| `scripts/assert-site-shape.ts` | node:assert SITE shape check | VERIFIED | Exits 0, uses node:assert, no jest/vitest |
| `lib/services/types.ts` | PageNode discriminated union + ContentShell + Zod schemas | VERIFIED | 269 lines (well above min_lines:60), `z.discriminatedUnion`, 3 superRefine, 0 nonempty(), exports pagesSchema |
| `lib/services/brands.ts` | Normalized brand registry, Daikin once, erkendInstallateur: false | VERIFIED | 4 brands, single daikin entry, all erkendInstallateur: false |
| `lib/services/airconditioning.ts` | Airco pillar + 4 subs with keyword map | VERIFIED | Exports AIRCONDITIONING_PAGES, 5 nodes, regional primary on advies ("airco advies Zoetermeer"), brandIds on installatie only |
| `lib/services/warmtepompen.ts` | WP pillar + 4 subs with keyword map | VERIFIED | Exports WARMTEPOMPEN_PAGES, 5 nodes, regional primary on advies ("warmtepomp advies regio Den Haag"), brandIds on installatie only |
| `lib/services/wtw.ts` | WTW pillar + 5 subs, no brandIds | VERIFIED | Exports WTW_PAGES, 6 nodes, no brandIds anywhere, niche primary on inregelen ("wtw inregelen") |
| `lib/services/mechanische-ventilatie.ts` | MV pillar + 4 subs, no brandIds | VERIFIED | Exports MECHANISCHE_VENTILATIE_PAGES, 5 nodes, no brandIds |
| `lib/services/registry.ts` | PAGES, urlFor, findByType, findBySlug, validateTaxonomy, no-barrel comment | VERIFIED | All 5 exports present, no-barrel comment at top, urlFor delegates to canonicalPath |
| `scripts/assert-registry.ts` | node:assert PAGES count + URL uniqueness + no trailing slash | VERIFIED | Exits 0 with "27 pages, 27 unique URLs, D-03 policy holds, taxonomy validates" |
| `scripts/validate-taxonomy.ts` | Build-blocking prebuild gate: safeParse + z.prettifyError + process.exit(1) | VERIFIED | All three present, no fs/fetch/http, top-of-file CLI comment |
| `scripts/assert-gate-blocks.ts` | Proves gate blocks 3 failure modes in-memory | VERIFIED | Exits 0 (3 cases: dup keyword, short published intro, missing slug) |
| `scripts/check-radius-literals.sh` | Grep assertion for stale radius literals | VERIFIED | Pattern covers straal van [0-9] + 50/60/100 *km forms; exits 0 |
| `app/tarieven/page.tsx` | SITE.serviceRadiusKm (no 50km literal) | VERIFIED | Line 63: `{SITE.serviceRadiusKm} km vanuit Zoetermeer` |
| `components/PricingTabs.tsx` | SITE.serviceRadiusKm (both occurrences, no 100 km) | VERIFIED | Lines 443 and 520 both use `{SITE.serviceRadiusKm}`, SITE imported at line 7 |
| `app/page-sections/WhyTPSSection.tsx` | SITE.serviceRadiusKm (no hardcoded 60 km — WR-05 fix) | VERIFIED | Line 21: `` `Werkgebied tot ${SITE.serviceRadiusKm} km vanuit Zoetermeer.` `` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `package.json` prebuild | `scripts/validate-taxonomy.ts` | `"prebuild": "tsx scripts/validate-taxonomy.ts"` | VERIFIED | npm run prebuild resolves to real file, exits 0 |
| `scripts/validate-taxonomy.ts` | `lib/services/registry.ts PAGES` + `lib/services/types.ts pagesSchema` | import + safeParse | VERIFIED | Both imports present at lines 13-14; safeParse called at line 16 |
| `app/tarieven/page.tsx` | `lib/constants.ts SITE.serviceRadiusKm` | `import { SITE } from "@/lib/constants"` | VERIFIED | Import at line 4, used at line 63 |
| `components/PricingTabs.tsx` | `lib/constants.ts SITE.serviceRadiusKm` | `import { SITE } from "@/lib/constants"` | VERIFIED | Import at line 7, used at lines 443 and 520 |
| `app/page-sections/WhyTPSSection.tsx` | `lib/constants.ts SITE.serviceRadiusKm` | `import { SITE } from "@/lib/constants"` | VERIFIED | Import at line 3, used at line 21 |
| `lib/services/registry.ts urlFor` | `lib/services/types.ts canonicalPath` | `return canonicalPath(node)` | VERIFIED | Single-line delegation confirmed; assert-registry equality guard passes all 27 nodes |
| `lib/services/registry.ts validateTaxonomy` | `lib/services/types.ts pagesSchema` | `pagesSchema.safeParse(pages)` | VERIFIED | Line 183 |
| `lib/services/registry.ts PAGES` | 4 pillar files | spread imports | VERIFIED | Lines 17-20 import all 4 pillar arrays; lines 145-152 spread them into PAGES |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Prebuild gate exits 0 with all-draft taxonomy | `npm run prebuild` | "27 pages passed pagesSchema" | PASS |
| SITE shape assertion passes | `npx tsx scripts/assert-site-shape.ts` | "NAP field set complete (8 service areas, radius 60 km)" | PASS |
| Registry assertion passes (27 pages, unique URLs, D-03, taxonomy validates) | `npx tsx scripts/assert-registry.ts` | "27 pages, 27 unique URLs, D-03 policy holds, taxonomy validates" | PASS |
| Gate blocks all 3 failure modes in-memory | `npx tsx scripts/assert-gate-blocks.ts` | "Gate blocks all three failure modes…; committed taxonomy validates" | PASS |
| No stale radius literals in app/ or components/ | `bash scripts/check-radius-literals.sh` | "No stale service-radius literal in app/ or components/" | PASS |

---

### Requirements Coverage

| Requirement | Source Plan(s) | Description | Status | Evidence |
|-------------|---------------|-------------|--------|----------|
| IA-01 | 01-05 | Service taxonomy data model is the single source of truth for routes, nav, sitemap, JSON-LD | SATISFIED | PAGES array (27 nodes) is the sole registry; urlFor is the only href builder; no parallel route list exists |
| IA-08 | 01-04, 01-06 | Per-page uniqueness bar enforced via typed required content fields (anti-thin-content gate) | SATISFIED | publishedContentSchema enforces intro≥120w, steps≥1, faqs 3-6; gate proven to block via assert-gate-blocks cases B+C |
| IA-09 | 01-04, 01-05, 01-06 | Keyword map assigning one primary keyword/intent per URL (anti-cannibalization) | SATISFIED | pagesSchema cross-record uniqueness superRefine; 27 distinct primaries; home/hub distinct; 3 low-demand pages on regional primaries; gate proven to block duplicate via case A |
| SEO-08 | 01-02, 01-03 | NAP consistency from a single source including corrected service radius | SATISFIED | SITE holds full NAP, serviceRadiusKm:60; all 3 consuming files import SITE; assert-site-shape exits 0 |
| QA-03 | 01-03, 01-06 | Fix the service-area radius inconsistency (50 km vs 100 km) at the source | SATISFIED | All literals replaced with SITE.serviceRadiusKm; check-radius-literals.sh exits 0; WhyTPSSection WR-05 fix confirmed |

---

### Anti-Patterns Found

No blocking anti-patterns detected in phase-modified files.

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `lib/services/registry.ts` et al. | multiple | `draftShell` helper duplicated verbatim in 5 files (IN-02 from REVIEW) | Info | Accepted trade-off per REVIEW disposition; consolidation deferred to when a shared helper module lands |
| `scripts/assert-registry.ts` | 18 | `EXPECTED_PAGE_COUNT = 27` magic constant (IN-03 from REVIEW) | Info | Accepted per REVIEW; adding a node requires updating this literal |
| `components/PricingTabs.tsx` | 191 | Silent `?tab=` coercion to "wtw" (IN-04 from REVIEW) | Info | Accepted per REVIEW; pre-existing behavior, not introduced by this phase |

No TBD, FIXME, or XXX debt markers found in any phase-modified file.

---

### Human Verification Required

The automated checks all pass (13/13 truths VERIFIED, 5/5 requirements SATISFIED, all scripts exit 0). The following items are marked `human_needed` because they represent owner-input checkpoints that cannot be verified programmatically and are explicitly documented as deferred by design.

#### 1. WhyTPSSection h2 brand-name copy (out-of-phase-1 scope — confirm tracking)

**Test:** Open `app/page-sections/WhyTPSSection.tsx` line 39 and confirm the h2 still reads "TPS Ventilatie" (the old brand name). This is not a defect — the REVIEW explicitly scoped "brand-name propagation to visible copy" as out-of-phase-1 (01-REVIEW.md final table last row).
**Expected:** The h2 text is intentionally "TPS Ventilatie" in this phase; the SITE.name correction is the phase-1 deliverable. Visible-copy propagation is a later content-phase task.
**Why human:** Confirm this is understood and tracked for a future content phase, so it is not inadvertently treated as a gap when Phase 2 or 4 begins.

#### 2. Owner review: SITE.serviceAreas seed list

**Test:** Owner reads the 8 municipalities in `lib/constants.ts` serviceAreas (Zoetermeer, Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden) and confirms or corrects the list before Phase 3 JSON-LD areaServed field consumes it.
**Expected:** Owner either approves the seed list or provides corrections.
**Why human:** Flagged inline as owner-review-pending (A2). A wrong service-area claim in areaServed is a factual error; only the owner can verify coverage.

#### 3. Owner/Phase 5: real geo coordinates for SITE.geo

**Test:** Owner (with Phase 5 QA-05) replaces the Zoetermeer centroid placeholder `{ lat: 52.0607, lng: 4.4940 }` with the verified business location coordinates.
**Expected:** The real business address lat/lng replaces the placeholder before Phase 5 Maps pin and JSON-LD geo anchor.
**Why human:** Flagged inline as owner-verify-pending (A3). Phase 5 QA-05 is the scheduled fix point. Cannot be verified programmatically.

#### 4. Owner/SEO: validate [ASSUMED] keyword strings before Phase 4

**Test:** All 27 nodes carry an [ASSUMED] file-level comment on their keyword strings. Before Phase 4 locks content, run the keyword map through Google Keyword Planner or Ahrefs to confirm or adjust the primaryKeyword/searchIntent assignments.
**Expected:** Keyword validation completed and any adjustments to primaryKeyword values committed before Phase 4 content writing begins (the gate catches duplicates; but keyword quality/volume is an owner/SEO decision).
**Why human:** By design (plan 01-05 RESEARCH A1, VALIDATION.md Manual-Only). Cannot be automated without external tool access.

---

### Gaps Summary

No gaps found. All must-haves are VERIFIED by codebase evidence and live script execution. The status is `human_needed` solely because of the 4 owner-input checkpoints above, which are documented as intentional deferrals — not implementation failures.

The CR-01 BLOCKER from the code review (pageSchema not a discriminated union) was fixed before verification (`z.discriminatedUnion` at `lib/services/types.ts:215`), confirmed by `assert-gate-blocks.ts` case C. All WR-02/WR-03/WR-04/WR-05 warnings were also remediated. WR-01 and WR-06 were intentionally deferred per the REVIEW disposition table and are not must-haves for phase-1.

---

_Verified: 2026-06-02T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
