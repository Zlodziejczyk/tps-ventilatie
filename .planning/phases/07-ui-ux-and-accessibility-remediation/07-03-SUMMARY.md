---
phase: 07-ui-ux-and-accessibility-remediation
plan: 03
subsystem: ui
tags: [wcag, skip-link, accessibility, bypass-blocks, landmark]

requires:
  - phase: 07-ui-ux-and-accessibility-remediation
    provides: "07-01/07-02 landed edits to contact/over-ons/diensten (read current before editing)"
provides:
  - Site-wide keyboard skip link ('Naar inhoud' -> #main) in app/layout.tsx
  - id="main" + tabIndex={-1} on all 8 route <main> landmarks
affects: [07-08]

tech-stack:
  added: []
  patterns:
    - "Skip link rendered once in layout as first body child; sr-only -> focus:not-sr-only painted chip above the fixed navbar"

key-files:
  created: []
  modified:
    - app/layout.tsx
    - app/page.tsx
    - app/contact/page.tsx
    - app/tarieven/page.tsx
    - app/privacy-beleid/page.tsx
    - app/over-ons/page.tsx
    - app/diensten/page.tsx
    - app/diensten/[pillar]/page.tsx
    - app/diensten/[pillar]/[service]/page.tsx

key-decisions:
  - "Skip target is each page's existing single <main> (given id/tabIndex) — no nested/duplicate landmark added in layout"

patterns-established:
  - "Bypass-blocks (WCAG 2.4.1) handled with a single layout-level skip link + per-route main anchor"

requirements-completed: [A11Y-03]

duration: 6 min
completed: 2026-07-03
---

# Phase 7 Plan 03: Keyboard Skip Link Summary

**A single visually-hidden-until-focus 'Naar inhoud' skip link in app/layout.tsx now jumps keyboard/SR users to `#main` — the existing `<main>` on all 8 routes gained `id="main"` + `tabIndex={-1}`.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-03
- **Completed:** 2026-07-03
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- A11Y-03 (WCAG 2.4.1): added the skip link as the first child of `<body>` before `<Navbar>`; invisible via `sr-only`, painted on focus above the fixed navbar (`z-[10000]`).
- Wired `id="main" tabIndex={-1}` onto all 8 route `<main>` landmarks (app/page.tsx bare `<main>` plus the 7 `<main className="pt-28 pb-20">`), classNames preserved.

## Task Commits

1. **Task 1: Skip link in layout** - `fcb61f0` (feat)
2. **Task 2: id=main + tabIndex on 8 mains** - `21c10ff` (feat)

## Files Created/Modified
- `app/layout.tsx` - skip link as first body child
- `app/page.tsx`, `app/contact/page.tsx`, `app/tarieven/page.tsx`, `app/privacy-beleid/page.tsx`, `app/over-ons/page.tsx`, `app/diensten/page.tsx`, `app/diensten/[pillar]/page.tsx`, `app/diensten/[pillar]/[service]/page.tsx` - `<main id="main" tabIndex={-1}>`

## Decisions Made
- Followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Both Node string-check verifies printed OK (skip link is first body child; all 8 mains have id+tabIndex, exactly one main each).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- A11Y-03 closed at the source; final proof is the Vercel-preview re-audit (07-08): `skipLink=true` on every route + a manual Tab-from-load check.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-03*
