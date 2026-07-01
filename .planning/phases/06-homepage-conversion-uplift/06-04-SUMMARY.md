---
phase: 06-homepage-conversion-uplift
plan: 04
subsystem: ui
tags: [react, client-island, hero, pillar-grid, container-queries, conversion, taxonomy]

requires:
  - phase: 06
    provides: "OfferteForm compact variant (06-02), .aurora CSS (06-03), getInitials (06-01)"
  - phase: 02
    provides: "pillars()/childrenOf()/brandsForPillar()/urlFor(), BRANDS/BRAND_COLOR"
  - phase: 05
    provides: "OfferteForm → /api/lead secure route"
provides:
  - "HomeHero client island (hero + pillar grid share dienst state + formRef)"
  - "PillarGrid (4-card taxonomy grid, brand chips + neutral WTW/MV fallback)"
affects: [06-06 page.tsx composition]

tech-stack:
  added: []
  patterns:
    - "One client island lifts shared state so a pillar click drives the hero form (D-09) — no query param, page stays static"
    - "Tailwind v4 container query (@container + @min-[860px]:) for the two-col hero stack (D-04)"
    - "Gradient-accent H1 via signature-gradient + bg-clip-text text-transparent"

key-files:
  created:
    - app/page-sections/home/HomeHero.tsx
    - app/page-sections/home/PillarGrid.tsx
  modified: []

key-decisions:
  - "Hero + PillarGrid rendered as sibling sections inside one HomeHero island (aurora scoped to the hero section; shared dienst/formRef)"
  - "routeToOfferte passes pillar.navTitle (matches the form's pillars().map(p=>p.navTitle) options exactly)"
  - "Coverage line + badge sourced from SITE (serviceAreas/serviceRadiusKm/tagline) — no hardcoded towns"
  - "Proof bar uses initials monograms (no avatars); REVIEW_RATING guarded for null"
  - "WTW + MV render a neutral 'Diverse merken · merkonafhankelijk' chip (brandsForPillar returns [] — verified); no fabricated brands, no logo <img>"

patterns-established:
  - "Home sections live in app/page-sections/home/ and read the taxonomy registry, never hardcoded service lists"

requirements-completed: [D-04, D-06, D-07, D-08, D-09, D-10, D-11, D-12, D-13, D-18, D-19]

duration: 22min
completed: 2026-07-01
---

# Phase 6 · Plan 04: HomeHero + PillarGrid Summary

**Built the proof-forward hero and the equal 4-pillar grid as one client island — a pillar Offerte click pre-selects the service in the compact hero form and scrolls to it (the signature D-09 gesture) with no query param, so the page stays static; everything is data-sourced from reviews + the taxonomy, behind a pure-CSS aurora (zero WebGL).**

## Performance

- **Duration:** ~22 min
- **Tasks:** 3
- **Files created:** 2

## Accomplishments
- **HomeHero** (Sketch-001-D): Dutch badge, one gradient-accent H1, proof bar (getInitials monograms + guarded 4,9 score + "34 Google-reviews"), data-sourced coverage line, live pulse, compact controlled OfferteForm; decorative `.aurora` behind it; `@container` two-col stacking under 860px
- **PillarGrid** (Sketch-002-D): equal 4→2→1 grid from `pillars()`, "Nieuw" tag on Warmtepompen, sub-service chips as internal links, brand chips via `BRAND_COLOR` with the neutral WTW/MV fallback
- **routeToOfferte** wires the two together: `setDienst` + reduced-motion-aware `scrollIntoView`

## Task Commits

1. **Task 1: HomeHero island** — `1031142` (feat)
2. **Task 2: PillarGrid** — `f47ff6b` (feat)
3. **Task 3: routeToOfferte wiring** — `2e0d67b` (feat)

## Files Created/Modified
- `app/page-sections/home/HomeHero.tsx` — hero island + shared state/ref + pillar gesture
- `app/page-sections/home/PillarGrid.tsx` — taxonomy-sourced 4-pillar grid

## Decisions Made
- Rendered hero + PillarGrid as sibling sections in a fragment so the aurora stays scoped to the hero (not stretched behind the pillar grid) while both keep sharing island state.

## Deviations from Plan
None material. The plan's literal no-WebGL grep (`ogl`) substring-matches "G**oogl**e-reviews" and its `06-` phone pattern matches the plan-id "06-03" in a comment — both are false positives. Verified the real intent with scoped patterns: no `ogl`/SoftAurora/`<canvas>` imports (word-boundary clean), no hardcoded phone, no phantom vars, no `<img>` brand logos, exactly one `<h1>`.

## Issues Encountered
None. `npx tsx` asserts confirm `brandsForPillar('wtw')` and `brandsForPillar('mechanische-ventilatie')` both return `[]` (neutral fallback path proven). Full typecheck / render verified at the phase preview build.

## User Setup Required
None.

## Next Phase Readiness
- 06-06 `app/page.tsx` composes `<HomeHero />` as the top section (client island; page.tsx stays a Server Component exporting metadata).
- Owner-review (non-blocking): H1 + coverage copy approvable; a real WTW/MV serviced-brand list can later replace the neutral chip.

---
*Phase: 06-homepage-conversion-uplift*
*Completed: 2026-07-01*
