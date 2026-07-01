---
phase: 06-homepage-conversion-uplift
plan: 01
subsystem: ui
tags: [refactor, react, server-components, brands, reviews]

requires:
  - phase: 02
    provides: BRANDS registry + BrandGrid, ReviewCarousel
provides:
  - lib/initials.ts — shared server-safe getInitials(name) util
  - BRAND_COLOR export on lib/services/brands.ts (single source)
affects: [06-04 HomeHero, 06-05 ProofBand, PillarGrid]

tech-stack:
  added: []
  patterns:
    - "Lift pure logic out of \"use client\" components into side-effect-free lib/ modules so server sections can import them"

key-files:
  created:
    - lib/initials.ts
  modified:
    - components/ReviewCarousel.tsx
    - lib/services/brands.ts
    - components/BrandGrid.tsx

key-decisions:
  - "getInitials copied verbatim (split/first-char/upper/slice) — no behavior change"
  - "BRAND_COLOR co-located beside BRANDS data it maps; additive so taxonomy gate stays green"

patterns-established:
  - "Shared primitives live in lib/, consumers re-point to a single source — no duplication"

requirements-completed: [D-07, D-12, D-14]

duration: 6min
completed: 2026-07-01
---

# Phase 6 · Plan 01: Shared Extractions Summary

**Lifted `getInitials` into a server-safe `lib/initials.ts` and promoted `BRAND_COLOR` to a shared export on `lib/services/brands.ts` — both Wave-2 sections can now import a single source with zero duplication.**

## Performance

- **Duration:** ~6 min
- **Tasks:** 2
- **Files modified:** 4 (1 created, 3 edited)

## Accomplishments
- `getInitials` extracted from the `"use client"` ReviewCarousel into `lib/initials.ts` (no client machinery required to compute review initials)
- `BRAND_COLOR` hex map moved from BrandGrid into `lib/services/brands.ts`, beside the `BRANDS` data it keys
- Both original consumers (ReviewCarousel, BrandGrid) re-pointed to the shared source; render output unchanged

## Task Commits

1. **Task 1: Extract getInitials + re-point ReviewCarousel** — `4e2599d` (refactor)
2. **Task 2: Promote BRAND_COLOR + re-point BrandGrid** — `2c95bc3` (refactor)

## Files Created/Modified
- `lib/initials.ts` — new pure `getInitials(name): string` util (server-safe)
- `components/ReviewCarousel.tsx` — imports shared `getInitials`, local copy removed
- `lib/services/brands.ts` — adds `export const BRAND_COLOR` (4 keys)
- `components/BrandGrid.tsx` — imports shared `BRAND_COLOR`, local const removed

## Decisions Made
None — followed plan as specified. Values copied verbatim to guarantee visual parity.

## Deviations from Plan
None — plan executed exactly as written.

## Issues Encountered
None. Both `npx tsx` pure-module asserts passed (`OK CT`, `OK 4`) — the OneDrive-safe verification form, no `next build`/`tsc` needed.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Wave-2 sections (06-04 HomeHero proof bar / 06-05 ProofBand cards) can `import { getInitials } from "@/lib/initials"`.
- Wave-2 PillarGrid can `import { BRAND_COLOR } from "@/lib/services/brands"`.
- Prebuild taxonomy gate unaffected (BRANDS shape unchanged).

---
*Phase: 06-homepage-conversion-uplift*
*Completed: 2026-07-01*
