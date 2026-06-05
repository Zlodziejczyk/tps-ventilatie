---
phase: 02-routes-service-page-templates
plan: 02-04
subsystem: ui
tags: [nextjs, hub, reviews, navigation, cleanup]

requires:
  - phase: 02-01
    provides: pillars/urlFor
  - phase: 02-02
    provides: (reuses existing ServiceCard, ReviewCarousel, CTABanner)
provides:
  - "app/diensten/page.tsx — lean hub: hero + 4 pillar cards + reviews strip + CTABanner"
  - "DienstenNav scroll-spy retired (D-09)"

affects: [02-05, 02-06]

tech-stack:
  added: []
  patterns:
    - "Hub as a clean router into pillar pages (no per-service content on /diensten)"

key-files:
  created: []
  modified:
    - app/diensten/page.tsx
  deleted:
    - components/DienstenNav.tsx

key-decisions:
  - "Hub local REVIEWS copied verbatim from ReviewsSection (private const) — D-12; CONT-08 consolidates later"
  - "Warmtepompen card carries a token-colored 'Nieuw' badge (no border)"
  - "Page-level export metadata kept (title 'Diensten'); broadened description to the 4-pillar positioning"

patterns-established:
  - "Anchored single-page sections replaced by per-route pages + taxonomy-driven wayfinding"

requirements-completed: [IA-02]

duration: ~8 min
completed: 2026-06-05
---

# Phase 02 Plan 04: Lean /diensten hub + retire DienstenNav Summary

**The anchored single-page /diensten is now a lean hub — hero + a pillars()-driven 4-card grid (Warmtepompen 'Nieuw' badge) + a D-12 reviews strip + CTABanner — and the obsolete DienstenNav scroll-spy is deleted.**

## Performance

- **Duration:** ~8 min
- **Tasks:** 2
- **Files modified:** 1 rewritten, 1 deleted

## Accomplishments
- Rebuilt `app/diensten/page.tsx` as a lean hub: hero (h1 "Onze diensten" + intro), a `pillars()` 4-card `ServiceCard` grid (each href via `urlFor`, Warmtepompen flagged "Nieuw"), a trust/reviews strip reusing `ReviewCarousel` with a hub-local `REVIEWS: Review[]` (copied verbatim — D-12), and a closing `CTABanner`.
- Removed the three anchored sections (`#wtw`/`#mechanisch`/`#airco`), the inline `AIRCO_CARDS`/`WTW_REPLACEMENT_STEPS`/`MV_*` data consts, and the `DienstenNav` import/usage.
- Deleted `components/DienstenNav.tsx` (D-09); `grep -rn "DienstenNav" app components` is clean.
- Kept the page-level `export const metadata` (title "Diensten"); no `"use client"` (server component).

## Task Commits

1. **Task 02-04-1: Rebuild hub** - `9fe555e` (feat)
2. **Task 02-04-2: Delete DienstenNav** - `59835d0` (refactor)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `app/diensten/page.tsx` - Rewritten as the lean hub.
- `components/DienstenNav.tsx` - Deleted (scroll-spy obsolete).

## Decisions Made
- Reviews reused verbatim from `ReviewsSection.tsx` (its `REVIEWS` is a private const, not exported) — D-12; extracting a shared module is deferred to Phase 4 / CONT-08.
- The original `/diensten` rich copy is NOT lost — it is ported into the taxonomy draft shells in 02-06 (the original is preserved in git history and captured for the port).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- A descriptive comment originally contained the literal "DienstenNav" (and `#wtw/#mechanisch/#airco`), which the 02-06 anti-drift grep would flag. Reworded the comment so `grep -rn "DienstenNav" app components` stays clean — no behavior change.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 02-05 can rebuild Navbar/MobileMenu as the taxonomy-derived mega-menu/accordion; the hub + pillar routes are the link targets.
- Hub render proof folds into 02-06's green build.

---
*Phase: 02-routes-service-page-templates*
*Completed: 2026-06-05*
