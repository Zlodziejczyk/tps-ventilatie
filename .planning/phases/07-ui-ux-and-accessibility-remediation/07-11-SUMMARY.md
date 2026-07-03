---
phase: 07-ui-ux-and-accessibility-remediation
plan: 11
subsystem: ui
tags: [dead-code, cleanup, homepage, ui-13, a11y-02]

requires:
  - phase: 06-homepage-uplift
    provides: rebuilt app/page.tsx on page-sections/home/* (orphaned the 5 old sections)
provides:
  - Clean app/page-sections tree — 5 retired section files removed
  - Last live UI-13 raw-material-symbols violation (PricingSection) removed at the source
  - Stale WhyTPSSection A11Y-02 heading skip removed at the source
affects: [07-08]

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - app/page-sections/HeroSection.tsx
    - app/page-sections/ServicesSection.tsx
    - app/page-sections/PricingSection.tsx
    - app/page-sections/WhyTPSSection.tsx
    - app/page-sections/ReviewsSection.tsx

key-decisions:
  - "Confirmed zero importers via grep before deletion; lib/reviews.ts mention is a historical comment, not an import — left as-is"

patterns-established: []

requirements-completed: []

duration: 3 min
completed: 2026-07-03
---

# Phase 7 Plan 11: Retired Section File Cleanup Summary

**The five Phase-6-orphaned homepage section files (HeroSection, ServicesSection, PricingSection, WhyTPSSection, ReviewsSection) are deleted — zero dangling imports, live home/ sections and ServiceHero untouched.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-03
- **Completed:** 2026-07-03
- **Tasks:** 1
- **Files modified:** 5 (deleted)

## Accomplishments
- Removed all five retired `app/page-sections/*.tsx` files via `git rm` after re-confirming zero importers in `app/` and `components/`.
- Erased the last UI-13 raw-icon violation (PricingSection's raw `material-symbols-outlined` spans) and the WhyTPSSection A11Y-02 heading skip at the source — both now moot.
- Live `app/page-sections/home/*` and `components/ServiceHero.tsx` verified intact.

## Task Commits

1. **Task 1: Delete 5 retired section files** - `ebd525e` (chore)

## Files Created/Modified
- `app/page-sections/HeroSection.tsx` - deleted (dead)
- `app/page-sections/ServicesSection.tsx` - deleted (dead)
- `app/page-sections/PricingSection.tsx` - deleted (dead; last UI-13 offender)
- `app/page-sections/WhyTPSSection.tsx` - deleted (dead; stale A11Y-02 skip)
- `app/page-sections/ReviewsSection.tsx` - deleted (dead)

## Decisions Made
- Followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Node existence + grep verify printed OK (no dangling imports, live files intact).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Final build proof is the Vercel preview (07-08): a green build confirms nothing imported the deleted files.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-03*
