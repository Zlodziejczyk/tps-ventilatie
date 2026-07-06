---
phase: 07-ui-ux-and-accessibility-remediation
plan: 09
subsystem: ui
tags: [legibility, badge, font-size, mobile]

requires:
  - phase: 07-ui-ux-and-accessibility-remediation
    provides: "07-02 (diensten), 07-04 (MobileMenu), 07-06 (Navbar) landed before this — no same-file collision"
provides:
  - "Nieuw" badge legible at >=11px in the desktop nav, mobile menu, and diensten hub
affects: [07-08]

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - components/Navbar.tsx
    - components/MobileMenu.tsx
    - app/diensten/page.tsx

key-decisions:
  - "Only the font-size utility changed (badge colors/padding/shape/copy preserved)"

patterns-established: []

requirements-completed: [UI-12]

duration: 3 min
completed: 2026-07-06
---

# Phase 7 Plan 09: "Nieuw" Badge Legibility Summary

**The "Nieuw" badge now renders at `text-[11px]` in the desktop nav, mobile menu, and diensten hub (was 9px/9px/10px) — legible per the 2026-07-01 mobile re-audit, closing UI-12.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-06
- **Completed:** 2026-07-06
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments
- `components/Navbar.tsx`: Nieuw badge `text-[9px]` -> `text-[11px]`.
- `components/MobileMenu.tsx`: Nieuw badge `text-[9px]` -> `text-[11px]`.
- `app/diensten/page.tsx`: Nieuw badge `text-[10px]` -> `text-[11px]`.
- Only the font-size utility changed on each span — `bg-tertiary-fixed`, `text-on-tertiary-fixed`, padding, `rounded-full`, `font-bold uppercase tracking-wider`, and the "Nieuw" text preserved.

## Task Commits

1. **Task 1: Bump Nieuw badge to >=11px** - `3dc6500` (fix)

## Files Created/Modified
- `components/Navbar.tsx` - badge font-size 9px -> 11px
- `components/MobileMenu.tsx` - badge font-size 9px -> 11px
- `app/diensten/page.tsx` - badge font-size 10px -> 11px

## Decisions Made
- Followed plan as specified. Ran after 07-02/07-04/07-06 (depends_on) — no same-file collision.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Node string-check verify (badge within 400 chars of "Nieuw" is text-[11px], no sub-11px remains) printed OK in all three files.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UI-12 closed at the source; final proof is the Vercel-preview eyeball (07-08) — badge legible in nav, mobile menu, and diensten hub.
- This is the last autonomous plan; only 07-08 (the human-in-the-loop re-audit gate) remains.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-06*
