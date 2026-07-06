---
phase: 07-ui-ux-and-accessibility-remediation
plan: 07
subsystem: ui
tags: [hero, homepage, aurora, branding, verify-and-record]

requires:
  - phase: 06-homepage-uplift
    provides: rebuilt HomeHero (Dutch badge, pure-CSS teal aurora, in-flow proof bar)
provides:
  - Recorded verification that UI-05/UI-06/UI-07 hold on the live post-Phase-6 hero
affects: [07-08]

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified: []

key-decisions:
  - "Verify-and-record: all three items already satisfied by the Phase-6 rebuild — NO source change made (only edit if a residual gap were found)"

patterns-established: []

requirements-completed: [UI-05, UI-06, UI-07]

duration: 3 min
completed: 2026-07-06
---

# Phase 7 Plan 07: Hero UI-05/06/07 Verify-and-Record Summary

**Verified against the LIVE post-Phase-6 hero (HomeHero + CSS aurora): Dutch badge, calm brand-teal aurora, and in-flow proof content all hold — UI-05/06/07 satisfied by Phase 6, no source change.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-06
- **Completed:** 2026-07-06
- **Tasks:** 1 (verify-only)
- **Files modified:** 0

## Accomplishments (verification outcomes)
- **UI-05 — satisfied by Phase 6:** `app/page-sections/home/HomeHero.tsx` badge renders `{SITE.tagline}` ("Specialist in gezond binnenklimaat") with the comment "Dutch badge (UI-05 — no English chrome)". No "Clean Air Technology" / English chrome anywhere in the live home sections.
- **UI-06 — satisfied by Phase 6:** the aurora is a pure-CSS `.aurora`/`.blob b1/b2/b3` in `app/globals.css`; gradients use the calm brand teal/cyan family (`#a8dff0` / `#b8e8d0` / `#baeaff`). No loud magenta/green literal in the aurora rules; no `SoftAurora` WebGL imported by the hero (the only `SoftAurora` string in `app/` is a historical comment in globals.css).
- **UI-07 — satisfied by Phase 6:** hero trust content (proof bar, coverage line, availability pulse) is in normal flow with `flex-wrap`; the old absolute `bottom-8 flex-wrap` 3-pill row is gone (grep confirms none in `app/page-sections/home/`). Final 375px no-overflow proof is the preview (07-08).

## Task Commits

None — verify-and-record plan, no source change. (The dead `components/SoftAurora.tsx` file still exists but is not imported by the live hero; it is out of this plan's scope.)

## Files Created/Modified
- None.

## Decisions Made
- No edit made — the Phase-6 rebuild already meets all three acceptance criteria.

## Deviations from Plan

None - plan executed exactly as written (verify-and-record; expected "satisfied by Phase 6" outcome confirmed).

## Issues Encountered
None. The plan's Node verify printed OK; the supplementary `bottom-8` grep confirmed no old pill row.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UI-05/06/07 recorded as satisfied on the live hero; final visual proof (Dutch badge, calm teal aurora screenshot, 375px `horizScroll=false`) is the Vercel-preview eyeball in 07-08.
- Note for a future cleanup pass: `components/SoftAurora.tsx` appears to be dead (not imported by the live hero) — out of scope here; flag for a later dead-code sweep.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-06*
