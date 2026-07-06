---
phase: 07-ui-ux-and-accessibility-remediation
plan: 05
subsystem: ui
tags: [layout, sticky-bar, footer, spacer, responsive]

requires:
  - phase: 07-ui-ux-and-accessibility-remediation
    provides: "07-04 enlarged the sticky-bar close button (read current file before editing)"
provides:
  - Normal-flow bottom spacer inside StickyContactBar so the fixed bar never occludes the footer's last row
affects: [07-08]

tech-stack:
  added: []
  patterns:
    - "Fixed-bottom bars reserve document clearance via a fragment-sibling spacer that disappears with the bar when dismissed"

key-files:
  created: []
  modified:
    - components/StickyContactBar.tsx

key-decisions:
  - "Static responsive spacer height (h-20, min-[560px]:h-16) matched to the wrapped/unwrapped bar height — sufficient per plan; no ref-measure needed"
  - "Single-file fix — app/layout.tsx untouched to avoid colliding with 07-03's layout edit"

patterns-established:
  - "Sticky-bar clearance handled inside the component, not via layout padding"

requirements-completed: [UI-08]

duration: 4 min
completed: 2026-07-06
---

# Phase 7 Plan 05: Sticky-Bar Footer Clearance Summary

**A fragment-sibling `aria-hidden` spacer (`h-20 min-[560px]:h-16`) inside StickyContactBar now reserves bottom document space equal to the bar height, so the fixed bar never covers the footer's KvK/BTW row at full scroll — closing UI-08.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-06
- **Completed:** 2026-07-06
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Wrapped the component return in a fragment and added a normal-flow spacer `<div aria-hidden="true" className="h-20 min-[560px]:h-16" />` before the fixed bar.
- Spacer is ~80px on narrow/wrapped (<560px, two-row bar) and ~64px >=560px, matching the bar height incl. `env(safe-area-inset-bottom)`.
- Because the whole component early-returns `null` when dismissed, the spacer disappears with the bar — no dead space when dismissed.
- The bar itself stays `position: fixed`; `app/layout.tsx` is not touched (no collision with 07-03's skip-link edit).

## Task Commits

1. **Task 1: Footer-clearance spacer** - `5c4e8fe` (fix)

## Files Created/Modified
- `components/StickyContactBar.tsx` - fragment wrap + responsive aria-hidden bottom spacer

## Decisions Made
- Followed plan as specified (static responsive spacer, not a ref-measured height).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Node string-check verify printed OK; fragment open/close balance confirmed.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UI-08 closed at the source; final proof is the Vercel-preview scroll check (07-08) at 375px and 1440px — footer KvK/BTW fully visible above the bar; dismissed bar leaves no gap.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-06*
