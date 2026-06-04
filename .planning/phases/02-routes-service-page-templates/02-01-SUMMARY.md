---
phase: 02-routes-service-page-templates
plan: 02-01
subsystem: data-layer
tags: [taxonomy, registry, typescript, type-guards, breadcrumbs]

requires:
  - phase: 01-taxonomy-data-model
    provides: PAGES registry, urlFor, canonicalPath, PageNode union, brands map
provides:
  - "pillars()/findPillar()/childrenOf()/findService()/siblingsOf() taxonomy lookups"
  - "brandsForPillar() — order-stable deduped brandIds union per pillar (BrandGrid source)"
  - "trailFor()+Crumb — breadcrumb trail data (Phase-3 BreadcrumbList JSON-LD reuses it)"
  - "pillarTarievenTab() — pillar→PricingTabs tab id, null for warmtepompen"

affects: [02-02, 02-03, 02-04, 02-05, 02-06, phase-3-seo]

tech-stack:
  added: []
  patterns:
    - "Type-guard predicate filters (node is PillarPage) — no `as` casts for narrowing"
    - "Render helpers delegate every href to urlFor (sole builder, P1 D-03)"

key-files:
  created: []
  modified:
    - lib/services/registry.ts
    - scripts/assert-registry.ts

key-decisions:
  - "Helpers kept in registry.ts under the documented no-barrel exception (D-14)"
  - "pillarTarievenTab default branch returns null — warmtepompen + any unknown slug"
  - "trailFor hub trail = Home+Diensten only; pillar adds 1 crumb; service resolves pillar first"

patterns-established:
  - "Taxonomy traversal centralized in registry helpers — render layer never re-implements it"

requirements-completed: [IA-05]

duration: ~18 min
completed: 2026-06-04
---

# Phase 02 Plan 01: Registry lookups + render helpers Summary

**Eight pure taxonomy helpers (pillars, findPillar, childrenOf, findService, siblingsOf, brandsForPillar, trailFor/Crumb, pillarTarievenTab) added to registry.ts and locked by assert-registry — the data-access foundation every Phase-2 render unit reads.**

## Performance

- **Duration:** ~18 min (tsc on the OneDrive mount is very slow — validated via `tsx` logic gate; full type-check deferred to the 02-06 build)
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added 8 exported helpers + the `Crumb` interface to `lib/services/registry.ts`, all pure, typed against the `./types` union, narrowed by type-guard predicates (zero `as` casts).
- `trailFor()` returns `Crumb[]` with hrefs from `urlFor()` — the single trail source Phase 3 reuses for BreadcrumbList JSON-LD (D-13).
- `brandsForPillar()` yields the order-stable deduped brand union (airco 3 / warmtepompen 2 / wtw 0 / mv 0) that drives the pillar BrandGrid (D-02).
- Extended `scripts/assert-registry.ts` with 6 new assertion groups locking pillar count, child count (17), siblings, brand sets, trail lengths + last-crumb href, and the tarieven mapping.

## Task Commits

1. **Task 02-01-1: Add taxonomy lookups + render helpers** - `c6d658b` (feat)
2. **Task 02-01-2: Extend assert-registry to lock helpers** - `0e7cf35` (test)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `lib/services/registry.ts` - Appended the 8 Phase-2 helpers + `Crumb` interface after the existing lookups.
- `scripts/assert-registry.ts` - Imported the helpers and added assertions (6)–(11) locking their behavior.

## Decisions Made
- Helpers live in `registry.ts` (no-barrel exception, D-14) rather than a new module.
- `pillarTarievenTab` uses a `switch` with a `null` default so warmtepompen and any unknown slug both yield no tab.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `tsc --noEmit` is impractically slow on the OneDrive mount (>5 min, no completion). Verification used the fast `tsx scripts/assert-registry.ts` logic gate (exits 0, executes every helper) per the project's OneDrive execution constraint; the comprehensive type gate is the 02-06 `npm run build`.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Wave 2 (02-02) can compose `trailFor`/`siblingsOf`/`brandsForPillar` into the 6 IA-05 components.
- All later waves (routes, nav) read these helpers; data-access foundation is complete.

---
*Phase: 02-routes-service-page-templates*
*Completed: 2026-06-04*
