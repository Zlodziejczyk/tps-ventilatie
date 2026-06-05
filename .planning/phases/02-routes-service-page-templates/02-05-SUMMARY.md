---
phase: 02-routes-service-page-templates
plan: 02-05
subsystem: navigation
tags: [navbar, mobile-menu, mega-menu, accordion, taxonomy, IA-07]

requires:
  - phase: 02-01
    provides: pillars/childrenOf/urlFor
  - phase: 02-03
    provides: pillar + sub-service routes (every nav link now resolves)
provides:
  - "Navbar Diensten mega-menu (4 pillar columns from taxonomy)"
  - "MobileMenu 2-level Diensten accordion"
  - "DIENSTEN_DROPDOWN hardcoded list removed from constants"

affects: [02-06, phase-3-seo]

tech-stack:
  added: []
  patterns:
    - "Client nav components read the pure taxonomy registry directly (safe to import client-side)"
    - "Every internal service link = a sitewide Phase-3 link-equity asset"

key-files:
  created: []
  modified:
    - components/Navbar.tsx
    - components/MobileMenu.tsx
    - lib/constants.ts

key-decisions:
  - "Mega-menu widened to 4 columns (w-[760px]); pillar header links to pillar page, subs to service pages"
  - "Mobile accordion is single-open (useState); pillar label navigates + closes drawer, chevron only toggles"
  - "Warmtepompen flagged 'Nieuw' (token badge) in both menus"

patterns-established:
  - "No hardcoded service nav entries anywhere — nav is 100% taxonomy-derived (IA-07)"

requirements-completed: [IA-07]

duration: ~12 min
completed: 2026-06-05
---

# Phase 02 Plan 05: Taxonomy-derived navigation Summary

**The Diensten navigation now reads the live taxonomy: a 4-pillar desktop mega-menu and a 2-level mobile accordion built from pillars()/childrenOf(), with the hardcoded DIENSTEN_DROPDOWN removed — every service has a sitewide internal link (IA-07).**

## Performance

- **Duration:** ~12 min
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Rewrote `Navbar` `DienstenPanel` as a 4-column mega-menu (D-07): each column is a pillar (`urlFor` header link + `Icon`) with its `childrenOf` sub-services as links; preserved the glass/blur shell, spring transition, and hover open/close. Warmtepompen flagged "Nieuw".
- Rewrote `MobileMenu` with a 2-level Diensten accordion (D-08): the 4 pillars list under Diensten; each pillar row has a label link (→ pillar page, closes the drawer) and a chevron button that toggles its sub-list via `useState`. Backdrop + tel/WhatsApp footer preserved (switched the footer separator to a tonal shift — no 1px border).
- Removed `DIENSTEN_DROPDOWN` from `lib/constants.ts`; kept `DropdownItem`, `TARIEVEN_DROPDOWN`, `NAV_LINKS`, `SITE`. `grep -rn "DIENSTEN_DROPDOWN" lib app components` is clean.

## Task Commits

1. **Task 02-05-1: Navbar mega-menu** - `c0d20f4` (feat)
2. **Task 02-05-2: MobileMenu accordion** - `64714a0` (feat)
3. **Task 02-05-3: Remove DIENSTEN_DROPDOWN** - `8b4f4e1` (refactor)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `components/Navbar.tsx` - DienstenPanel rebuilt from the taxonomy (4 pillar columns).
- `components/MobileMenu.tsx` - Diensten 2-level accordion; footer/backdrop preserved.
- `lib/constants.ts` - DIENSTEN_DROPDOWN removed.

## Decisions Made
- Single-open mobile accordion (one pillar's subs at a time) for a tidy drawer.
- Reworded the explanatory comments to avoid the literal `DIENSTEN_DROPDOWN`/`DienstenNav` tokens so the anti-drift greps stay clean.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- The MobileMenu footer originally used a `border-t` separator; since the file was rewritten, switched it to a `bg-surface-container-low` tonal shift to honor the design-system "no 1px borders" rule.
- Type validation deferred to the 02-06 local build (in-place `next build`/`tsc` are unreliable on the OneDrive mount — see 02-06).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All nav links resolve to real routes from 02-03. The taxonomy now fully drives routes + nav.
- 02-06 ports the salvaged content and runs the whole-phase build gate (green export + 22 routes).

---
*Phase: 02-routes-service-page-templates*
*Completed: 2026-06-05*
