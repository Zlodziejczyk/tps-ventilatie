---
phase: 06-homepage-conversion-uplift
plan: 06
subsystem: ui
tags: [react, server-components, cta, accessibility, composition, seo]

requires:
  - phase: 06
    provides: "HomeHero+PillarGrid (06-04), ProofBand+ImageBand (06-05)"
  - phase: 03
    provides: "buildMetadata + findBySlug for the home metadata export"
provides:
  - "ClosingCTA restyled dark band (AA-safe WhatsApp, Icon wrapper)"
  - "Rewritten app/page.tsx composing the 4 new home sections"
affects: [phase-07 ui-ux-remediation cleanup of retired sections]

tech-stack:
  added: []
  patterns:
    - "Restyle-in-place: new section supersedes a component, fixing its bugs on the way"
    - "Home = Server Component composing sections; a single client island (HomeHero) inside"

key-files:
  created:
    - app/page-sections/home/ClosingCTA.tsx
  modified:
    - app/page.tsx

key-decisions:
  - "WhatsApp AA fix uses the neutral StickyContactBar treatment (bg-surface-container-high + Icon text-primary), not green+dark — consistent with the inherited bar"
  - "app/page.tsx stays a Server Component; metadata export preserved; retired imports dropped"
  - "Retired section files (Hero/Services/Pricing/WhyTPS/Reviews) left on disk for Phase-7 cleanup (lint-safe, imports removed)"
  - "No pricing-preview section (pricing = USP pills only, D-02); no second always-on contact element (D-16)"

patterns-established:
  - "Home sections composed from app/page-sections/home/; StickyContactBar owned solely by layout"

requirements-completed: [D-01, D-02, D-16, D-17, D-18]

duration: 12min
completed: 2026-07-01
---

# Phase 6 · Plan 06: ClosingCTA + Homepage Composition Summary

**Restyled the buggy CTABanner into an engineered dark ClosingCTA band (Icon wrapper + AA-safe WhatsApp) and rewrote `app/page.tsx` into a Server Component that composes the four new home sections, retiring the five old sections + CTABanner while keeping the metadata export.**

## Performance

- **Duration:** ~12 min
- **Tasks:** 2
- **Files:** 1 created, 1 rewritten

## Accomplishments
- **ClosingCTA** (server, D-17): dark `bg-on-primary-fixed` band, Bel · WhatsApp · Offerte all from `SITE`; both CTABanner bugs fixed — Icon wrapper for every glyph (FIX 1) and the AA-failing green+white WhatsApp replaced by the neutral StickyContactBar treatment (FIX 2, A11Y-01)
- **app/page.tsx** (server, D-01/D-02): keeps `buildMetadata`, composes `<main>` = HomeHero → ProofBand → ImageBand → ClosingCTA, drops all five retired section imports + CTABanner; no pricing-preview section; no second sticky bar

## Task Commits

1. **Task 1: ClosingCTA** — `f7e7f7a` (feat)
2. **Task 2: page.tsx composition** — `3ae0ee9` (feat)

## Files Created/Modified
- `app/page-sections/home/ClosingCTA.tsx` — restyled dark closing band
- `app/page.tsx` — Server Component composing the four new sections

## Decisions Made
- Used the neutral WhatsApp pill (matches the inherited StickyContactBar) over green+dark-text for site-wide consistency and a comfortable AA margin.
- Left the retired section files on disk (imports removed) per plan Open-Q3 — deletion is a Phase-7 cleanup task.

## Deviations from Plan
None material. The plan's automated grep verify initially tripped on my explanatory comment (which named the literal `material-symbols-outlined` / `#25D366` tokens it was fixing); reworded the comment so all four literal verify greps pass without weakening the description.

## Issues Encountered
None locally. Full typecheck / route build / behavioral + a11y gates run at the Vercel preview build (the OneDrive-safe canonical gate — no local `next build`/`tsc`).

## User Setup Required
None.

## Next Phase Readiness
- **Phase gate = Vercel preview build** (push branch): expects prebuild taxonomy gate green, full-route typecheck, 27 routes, and the behavioral checks (compact submit → /api/lead 200 + WhatsApp; pillar Offerte pre-select + scroll; aurora desktop-only; 3 static cards; INP < 200ms + LCP = hero H1; axe AA contrast + heading order).
- **Owner sign-off** (end-of-phase, non-blocking): whole-home preview review of H1/coverage copy, WTW/MV brands, and the closing band.
- Phase 7 will delete the retired section files and address the broader UI/UX + a11y remediation.

---
*Phase: 06-homepage-conversion-uplift*
*Completed: 2026-07-01*
