---
phase: 07-ui-ux-and-accessibility-remediation
plan: 02
subsystem: ui
tags: [wcag, heading-hierarchy, accessibility, screen-reader, sr-only]

requires:
  - phase: 06-homepage-uplift
    provides: rebuilt homepage that already nests h1->h2->h3 (retired WhyTPSSection skip is moot)
provides:
  - Footer landmark column headers re-ranked h4->h2 (no site-wide footer skip)
  - /over-ons USP-card titles re-ranked h3->h2 (h1->h2->h2 nests)
  - /diensten hub sr-only h2 section heading before the pillar grid (h1->h2->h3 nests)
affects: [07-08, 07-11, 07-12]

tech-stack:
  added: []
  patterns:
    - "Heading-outline fixes are tag-level (Tailwind Preflight keeps unclassed h2/h3 visually identical); hub gains an invisible sr-only section label rather than demoting the shared ServiceCard h3"

key-files:
  created: []
  modified:
    - components/Footer.tsx
    - app/over-ons/page.tsx
    - app/diensten/page.tsx

key-decisions:
  - "Chose h2 for footer columns (never a skip regardless of preceding page level) rather than matching a per-page level"
  - "Fixed the /diensten hub skip with an sr-only h2 label instead of demoting ServiceCard's h3 — ServiceCard's h3 is correct on pillar/RelatedServices pages"
  - "WhyTPSSection h2->h4 skip NOT touched here — dead file, deleted in 07-11"

patterns-established:
  - "sr-only section headings supply outline structure for card grids that lack a visible heading"

requirements-completed: [A11Y-02]

duration: 6 min
completed: 2026-07-03
---

# Phase 7 Plan 02: Heading Hierarchy Remediation Summary

**The three still-live A11Y-02 heading skips are closed with zero visual change: Footer columns h4->h2, over-ons USP titles h3->h2, and a `sr-only` h2 section label before the /diensten pillar grid.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-03
- **Completed:** 2026-07-03
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Footer landmark's three column headers re-ranked `<h4>` -> `<h2>` — no page skips into the footer.
- /over-ons USP-card title re-ranked `<h3>` -> `<h2>` so the outline nests h1 -> h2 (USP) -> h2 (reviews) -> h2 (CTABanner).
- /diensten hub gains `<h2 className="sr-only">Onze vakgebieden</h2>` before the pillar grid — outline reads h1 -> h2 -> h3 without a skip; shared ServiceCard h3 untouched.

## Task Commits

1. **Task 1: Footer column headers h4 -> h2** - `83854c5` (fix)
2. **Task 2: over-ons USP titles h3 -> h2** - `e91a822` (fix)
3. **Task 3: /diensten hub sr-only h2** - `51350ad` (fix)

## Files Created/Modified
- `components/Footer.tsx` - three column titles h4 -> h2 (class preserved)
- `app/over-ons/page.tsx` - USP-card title h3 -> h2 (class preserved)
- `app/diensten/page.tsx` - sr-only h2 section heading added before the pillar-card grid

## Decisions Made
- Followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. All three Node string-check verifies printed OK; ServiceCard confirmed unchanged (still h3).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- A11Y-02 heading outline fixed at the source; final proof is the Vercel-preview re-audit (07-08): `headingIssues=[]`, `h1Count=1` across audited routes.
- 07-12 (footer refresh) depends on this plan and will build on the corrected h2 column tags.
- 07-11 will delete WhyTPSSection (the fourth, dead skip).

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-03*
