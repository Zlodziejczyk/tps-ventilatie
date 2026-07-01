---
phase: 06-homepage-conversion-uplift
plan: 05
subsystem: ui
tags: [react, server-components, reviews, trust, next-image, cwv]

requires:
  - phase: 06
    provides: "getInitials (06-01), .gmark CSS (06-03)"
  - phase: 04
    provides: "staged public/images/heroes/home-hero.jpg"
provides:
  - "ProofBand server section (score + CSS-G + static 3-up cards + keurmerken + USP pills)"
  - "ImageBand server section (lazy home-hero.jpg, off LCP)"
affects: [06-06 page.tsx composition]

tech-stack:
  added: []
  patterns:
    - "Static 3-up review grid instead of the client carousel (D-15) — zero carousel JS"
    - "Review type derived from REVIEWS (typeof REVIEWS)[number] so a server file never imports the client carousel module"
    - "next/image lazy + intrinsic dims + no priority keeps a decorative band off the LCP path"

key-files:
  created:
    - app/page-sections/home/ProofBand.tsx
    - app/page-sections/home/ImageBand.tsx
  modified: []

key-decisions:
  - "ProofBand is a pure Server Component (no \"use client\", no ReviewCarousel reference at all)"
  - "Google score uses the CSS .gmark (06-03) — no image asset, no 404"
  - "Keurmerken = BRL 100 + BRL 200 + KvK (F-gassen/STEK dropped per owner)"
  - "REVIEW_RATING guarded for null; when null a neutral count line shows, no fabricated score"
  - "ImageBand: no priority (Pitfall 4) so LCP stays the hero H1"

patterns-established:
  - "Trust/proof content is server-rendered static text (React auto-escapes; no dangerouslySetInnerHTML)"

requirements-completed: [D-05, D-14, D-15, D-18]

duration: 12min
completed: 2026-07-01
---

# Phase 6 · Plan 05: ProofBand + ImageBand Summary

**Built the Sketch-003-D proof/trust band and the lazy hero-image band as pure Server Components — a guarded 4,9 Google score with the CSS-only Google-G, three static (non-carousel) review cards, keurmerken + USP pills, and a full-width `next/image` band kept off the LCP path.**

## Performance

- **Duration:** ~12 min
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- **ProofBand** (server, D-14/D-15): heading + guarded score + `.gmark` Google-G + "34 reviews op Google"; static 3-up review cards (local Stars/ReviewCard, no carousel JS); keurmerken strip (BRL 100 / BRL 200 / KvK) + USP pills
- **ImageBand** (server, D-05): `home-hero.jpg` via `next/image`, `loading="lazy"`, intrinsic 1600×900, `sizes="100vw"`, **no** `priority`

## Task Commits

1. **Task 1: ProofBand** — `1bb03b1` (feat)
2. **Task 2: ImageBand** — `7f4d179` (feat)

## Files Created/Modified
- `app/page-sections/home/ProofBand.tsx` — server proof/trust band
- `app/page-sections/home/ImageBand.tsx` — server lazy image band

## Decisions Made
- Derived the `Review` type from `REVIEWS` (`(typeof REVIEWS)[number]`) so ProofBand has **zero** reference to the `ReviewCarousel` client module — cleanly satisfying the D-15 no-carousel gate (a `import type` would have left the string in the file).

## Deviations from Plan
None — plan executed as written.

## Issues Encountered
None. `.gmark` present; no `"use client"`, no `ReviewCarousel`, no `<h1>` (server band uses h2), no `priority` on the image; guardrail greps clean. Render + LCP behavior verified at the phase preview build.

## User Setup Required
None.

## Next Phase Readiness
- 06-06 `app/page.tsx` composes `<ProofBand />` and `<ImageBand />` (both Server Components) alongside `<HomeHero />` and the closing CTA.
- Owner-review (non-blocking): re-confirm the exact live Google review count at sign-off (it ticks up).

---
*Phase: 06-homepage-conversion-uplift*
*Completed: 2026-07-01*
