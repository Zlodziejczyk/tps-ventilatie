---
phase: 07-ui-ux-and-accessibility-remediation
plan: 04
subsystem: ui
tags: [wcag, target-size, accessibility, tap-target, tailwind]

requires: []
provides:
  - Sticky-bar close button >=44x44 hit-area
  - Mobile-menu accordion chevron toggle >=44x44 hit-area
  - Review-carousel prev/next arrows 44x44 hit-area
affects: [07-05, 07-08, 07-09]

tech-stack:
  added: []
  patterns:
    - "Target-size fixes pad the hit-area box (h-11/w-11 or min-h-11/min-w-11) while keeping the glyph size fixed"

key-files:
  created: []
  modified:
    - components/StickyContactBar.tsx
    - components/MobileMenu.tsx
    - components/ReviewCarousel.tsx

key-decisions:
  - "Used min-h-11/min-w-11 (not fixed h-11) on the mobile chevron toggle to keep its existing p-2 padding while guaranteeing >=44px"

patterns-established:
  - "WCAG 2.5.5/2.5.8 target-size fixes are box-size-only; icon glyph, aria-labels, positions unchanged"

requirements-completed: [A11Y-04]

duration: 5 min
completed: 2026-07-03
---

# Phase 7 Plan 04: Target-Size Remediation Summary

**The three sub-44px non-inline controls (sticky-bar close 32px, mobile chevron 40x42, carousel arrows 40px) now present >=44x44 hit-areas with unchanged glyphs — closing A11Y-04.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-03
- **Completed:** 2026-07-03
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Sticky-bar dismiss button `h-8 w-8` -> `h-11 w-11` (44px); 20px close glyph centered, position/aria-label preserved.
- Mobile-menu pillar accordion chevron gains `flex items-center justify-center min-h-11 min-w-11`; expand_more glyph + aria-expanded preserved.
- Review-carousel prev/next arrows `w-10 h-10` -> `w-11 h-11`; chevrons, translate offsets, and `hidden lg:flex` unchanged.

## Task Commits

1. **Task 1: Sticky-bar close 32->44** - `b0fef31` (fix)
2. **Task 2: Mobile chevron ->44** - `153bf34` (fix)
3. **Task 3: Carousel arrows 40->44** - `2ff2f8f` (fix)

## Files Created/Modified
- `components/StickyContactBar.tsx` - close button hit-area to 44px
- `components/MobileMenu.tsx` - accordion chevron toggle hit-area to >=44px
- `components/ReviewCarousel.tsx` - both arrow buttons to 44px

## Decisions Made
- Followed plan as specified. Inline text links (breadcrumbs, "34 reviews") left alone per audit (WCAG 2.5.x-exempt).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. All three Node string-check verifies printed OK.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- A11Y-04 closed at the source; final proof is the Vercel-preview re-audit (07-08) — desktop `smallTargets` should no longer list the sticky close or carousel arrows; the mobile chevron is a menu-open manual check.
- 07-05 will further modify StickyContactBar (footer-clearance spacer) — no conflict with this class-only change.
- 07-09 will further modify MobileMenu (Nieuw badge) — depends on this plan, no collision.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-03*
