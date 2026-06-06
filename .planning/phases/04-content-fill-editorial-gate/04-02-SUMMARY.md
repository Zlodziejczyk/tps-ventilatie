---
phase: 04-content-fill-editorial-gate
plan: 02
subsystem: ui
tags: [reviews, json-ld, aggregaterating, trust-copy, e-e-a-t, single-source]

requires:
  - phase: 02-routes-service-page-templates
    provides: ReviewCarousel + the scattered REVIEWS arrays this consolidates
  - phase: 03-seo-infrastructure
    provides: businessJsonLd with the reserved (empty) aggregateRating slot
provides:
  - lib/reviews.ts — single consolidated reviews source (REVIEWS) + gated REVIEW_RATING
  - businessJsonLd emits aggregateRating only when REVIEW_RATING is non-null
  - On-page Google score/stars render only with real rating data (no fabricated 4.9)
  - Over-ons + home trust copy literally true (no pre-proof "gecertificeerd", no stale brands)
affects: [04-09]

tech-stack:
  added: []
  patterns:
    - "Single-source data module (lib/reviews.ts) mirroring SITE/PAGES ethos"
    - "Gated JSON-LD slot via conditional object spread (...(GATE && {...}))"

key-files:
  created:
    - lib/reviews.ts
  modified:
    - app/page-sections/ReviewsSection.tsx
    - app/diensten/page.tsx
    - app/over-ons/page.tsx
    - app/page-sections/WhyTPSSection.tsx
    - lib/seo/jsonld.tsx
    - scripts/assert-seo.ts

key-decisions:
  - "REVIEW_RATING defaults null → JSON-LD slot omitted + on-page stars/score hidden until owner supplies real Google data (D-13/D-17)"
  - "Customer quotes kept verbatim incl. the legacy 'TPS Ventilatie' brand string (authenticity > brand consistency); only owner may change a review"
  - "Jacqueline's fuller over-ons quote variant kept in the consolidated source"
  - "Corrected a stale accuracy bug: over-ons claimed Rotterdam (not in SITE.serviceAreas) → aligned to the real coverage list"
  - "USP 'Gecertificeerd' → interim 'Vakkundig' (D-02); swaps back in 04-09 once F-gassen/STEK proof returns"

patterns-established:
  - "Gated trust data: a single null-able const drives both the JSON-LD slot and on-page display; assert-seo asserts both states"

requirements-completed: [CONT-06, CONT-07, CONT-08]

duration: 22 min
completed: 2026-06-06
---

# Phase 04 Plan 02: Reviews Consolidation + Gated Rating + Interim-True Trust Copy Summary

**One consolidated `lib/reviews.ts` feeding ReviewCarousel on home/diensten/over-ons, a gated `aggregateRating` JSON-LD slot (omitted until real Google data), and literally-true Over-ons/home trust copy with the fabricated "4.9" and pre-proof "gecertificeerd" removed — all with zero layout change.**

## Performance

- **Duration:** ~22 min
- **Tasks:** 2
- **Files modified:** 7 (1 created, 6 modified)

## Accomplishments
- `lib/reviews.ts` — single source: 18 verbatim reviews (`Review[]`, reusing ReviewCarousel's shape) + `REVIEW_RATING: {...} | null = null`. Deleted all three scattered arrays; ReviewsSection / diensten / over-ons now import the one source.
- Home rating block gated: stars + score render only when `REVIEW_RATING` is set; while null, a neutral "{count}+ reviews op Google" line shows (no fabricated 4.9). Over-ons derives avatar initials from the name (dropped the per-row `initials` field).
- `businessJsonLd()` spreads `aggregateRating` only when `REVIEW_RATING` is non-null; `scripts/assert-seo.ts` now asserts absent-when-null and typed-`AggregateRating`-when-set (sitemap-count assertions deferred to 04-09).
- Trust copy made literally true (CONT-07/D-02): Over-ons "Verhaal van Thomas" refresh in formal `u`, "gecertificeerde"→"vakkundige", USP "Gecertificeerd"→"Vakkundig" (gated), and a stale unserved-area claim (Rotterdam) corrected to the real `SITE.serviceAreas`. Home `WhyTPSSection` "TPS Ventilatie"→"TPS klimaattechniek" (heading + image alt) and legacy Itho/Zehnder/Orcon brands replaced with a merk-onafhankelijk framing.

## Task Commits

1. **Task 1: consolidate reviews + repoint 3 consumers** - `afd3dde` (feat)
2. **Task 2: gate aggregateRating + interim-true trust copy** - `7638fbc` (feat)

## Files Created/Modified
- `lib/reviews.ts` - single reviews source + gated REVIEW_RATING
- `app/page-sections/ReviewsSection.tsx` - imports source; gated rating block
- `app/diensten/page.tsx` - imports source; removed copied array + stale comment + unused Review type import
- `app/over-ons/page.tsx` - imports source; getInitials; Verhaal-van-Thomas refresh; interim "vakkundig"
- `app/page-sections/WhyTPSSection.tsx` - brand/copy alignment (no layout change)
- `lib/seo/jsonld.tsx` - conditional aggregateRating spread on REVIEW_RATING
- `scripts/assert-seo.ts` - ratings assertion conditional on REVIEW_RATING

## Decisions Made
See key-decisions frontmatter. Notably: kept verbatim customer quotes (incl. legacy brand string), defaulted USP to interim "Vakkundig", and fixed the Rotterdam accuracy bug.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Image alt text still carried the stale brand string**
- **Found during:** Task 2 (WhyTPSSection brand alignment)
- **Issue:** Beyond the heading at line 39, the work-photo `alt="TPS Ventilatie aan het werk"` also contained the old brand name — the must-have ("home trust copy no longer contradicts the taxonomy") and the verify (`/TPS Ventilatie/` over the whole file) required it gone.
- **Fix:** alt → "TPS klimaattechniek aan het werk" (the `tpsventilatie-work.jpg` filename is left untouched — not visitor-facing copy).
- **Files modified:** app/page-sections/WhyTPSSection.tsx
- **Verification:** the WhyTPSSection grep check passes.
- **Committed in:** 7638fbc (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing-critical). **Impact:** in-scope copy correctness (D-18 data/content only); no scope creep, no layout change.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required. (REVIEW_RATING is filled in 04-09 from the owner's intake §8 Google data.)

## Verification Notes
- All Node string checks pass (pure fs reads — OneDrive-safe). `npx tsx scripts/assert-seo.ts` + whole build validate on Vercel CI: in the null launch state it asserts ratings absent; the "4 indexable statics"/sitemap-4 assertions remain valid (no node published yet — those update in 04-09).

## Next Phase Readiness
- One trust-data source is in place for 04-09 to fill `REVIEW_RATING` from owner intake §8, and for Phase 6 to restyle the home reading the same source.
- USP "Vakkundig"→"Gecertificeerd" swap is staged for 04-09 (on F-gassen/STEK proof). No blockers.

---
*Phase: 04-content-fill-editorial-gate*
*Completed: 2026-06-06*
