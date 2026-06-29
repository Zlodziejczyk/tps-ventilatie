---
phase: 05-lead-capture-form-security-launch-qa
plan: 04
subsystem: ui
tags: [sticky-bar, contact, layout, glass-nav, sketch-003-d, accessibility, mobile]

requires:
  - phase: 05-01
    provides: hybrid hosting (the bar ships as normal client chrome regardless)
provides:
  - "components/StickyContactBar.tsx — layout-level Sketch-003-D contact bar (Bel/WhatsApp/Offerte; scroll-in >200px; dismissible-for-session; mobile-safe; reduced-motion-aware)"
  - Body-level mount in app/layout.tsx (the single always-on contact affordance, no second FAB)
  - "LEAD-04 link sweep: all tel/mailto/wa.me across the 5 enumerated sites confirmed sourcing SITE"
affects: [05-06, 06-homepage-conversion-uplift]

tech-stack:
  added: []
  patterns:
    - "Layout-level fixed affordance as a direct <body> child (avoids the container-trap)"
    - "Sketch tokens adapted to the real design system (glass-nav + inline cubic-bezier spring)"
    - "Hydration-safe reveal: state inits hidden, scroll/sessionStorage read only in useEffect"

key-files:
  created: [components/StickyContactBar.tsx]
  modified: [app/layout.tsx]

key-decisions:
  - "Adapted Sketch-003-D to real tokens: glass-nav utility + inline cubic-bezier(0.22,1,0.36,1) instead of the non-existent --glass-strong/--glass-blur/--ease-spring"
  - "Offerte action deep-links to /contact (simplest target per RESEARCH Open-Q3); inline-modal deferred to Phase 6"
  - "tel:/wa.me hrefs follow the existing repo convention (tel:${SITE.phone}, SITE.whatsappUrl) — consistent with the 5 swept sites"

patterns-established:
  - "ONE shared always-on contact element site-wide; Phase 6 inherits this exact component (no duplicate WhatsApp FAB)"

requirements-completed: [LEAD-03, LEAD-04]

duration: ~12 min
completed: 2026-06-29
---

# Phase 5 Plan 04: Site-Wide Sticky Contact Bar Summary

**A layout-level glass sticky bar (Bel · WhatsApp · Offerte) that scrolls in past ~200px, is dismissible-for-session and mobile/reduced-motion safe — the one always-on contact affordance site-wide, with a clean LEAD-04 link sweep.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-06-29
- **Completed:** 2026-06-29
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments
- `components/StickyContactBar.tsx`: a `"use client"` bar fixed to the viewport bottom via `glass-nav`, sliding in (`translateY(125%)` → `none`) once `window.scrollY > 200`, dismissible (× → `sessionStorage["cbar-dismissed"]`), mobile-safe (`max(12px, env(safe-area-inset-bottom))`, stacked + full-width buttons < 560px), and reduced-motion-aware (`motion-reduce:transition-none` + `motion-safe:animate-ping` pulse). State inits hidden → no hydration mismatch.
- Mounted as a direct `<body>` child in `app/layout.tsx` (after `<Footer/>`), outside any transformed/container-typed ancestor — so it is genuinely viewport-fixed.
- LEAD-04 sweep: confirmed ServiceHero, MobileMenu, CTABanner, Footer, and the contact page all source `tel:`/`mailto:`/`wa.me` from `SITE` (zero hardcoded literals); no standalone WhatsApp FAB exists — this bar is the single always-on element.

## Task Commits

1. **Task 1: StickyContactBar (Sketch-003-D, real tokens)** - `92537f6` (feat)
2. **Task 2: Mount at body level + LEAD-04 sweep** - `a6767d2` (feat)

## Files Created/Modified
- `components/StickyContactBar.tsx` - The shared sticky contact bar
- `app/layout.tsx` - Body-level mount + import

## Decisions Made
- Real-token adaptation (glass-nav + inline spring) per RESEARCH Pattern 5; no sketch custom props leaked in.
- Offerte → `/contact` deep-link (kept simple; inline modal is a Phase 6 concern).

## Deviations from Plan

None - plan executed as written. The LEAD-04 sweep found everything already sourcing `SITE`, so no link fixes were required (recorded above as the verified result).

## Issues Encountered
None. No local build attempted (OneDrive) — viewport-fixed behavior, scroll-in, dismissal, and the < 560px stack are confirmed visually on the Vercel preview in 05-06.

## User Setup Required
None.

## Next Phase Readiness
- The bar is live site-wide and is the component Phase 6 inherits.
- Visual/behavioral confirmation (scroll-in across routes, mobile stack, reduced-motion, not-trapped) is part of the 05-06 preview matrix.

---
*Phase: 05-lead-capture-form-security-launch-qa*
*Completed: 2026-06-29*
