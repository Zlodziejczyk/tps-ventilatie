---
phase: 02-routes-service-page-templates
plan: 02-03
subsystem: routing
tags: [nextjs, app-router, generateStaticParams, static-export, dynamic-routes]

requires:
  - phase: 02-01
    provides: pillars/findPillar/childrenOf/findService/brandsForPillar/pillarTarievenTab/urlFor
  - phase: 02-02
    provides: ServiceHero/ServiceSteps/ServiceFAQ/Breadcrumbs/BrandGrid/RelatedServices
provides:
  - "app/diensten/[pillar]/page.tsx — 4 pillar pages from one D-02 template"
  - "app/diensten/[pillar]/[service]/page.tsx — 17 sub-service pages from one D-01 template"
  - "Basic per-page generateMetadata (title/description) — D-13 seam for Phase 3"

affects: [02-05, 02-06, phase-3-seo]

tech-stack:
  added: []
  patterns:
    - "Nested dynamic segments + generateStaticParams + dynamicParams=false (no runtime, all pre-rendered)"
    - "Next 16 async params: every page/metadata fn awaits the params Promise"
    - "notFound() defense-in-depth guard after the enumerated-params gate"

key-files:
  created:
    - app/diensten/[pillar]/page.tsx
    - app/diensten/[pillar]/[service]/page.tsx
  modified: []

key-decisions:
  - "Pillar = D-02 (Hero -> sub-grid -> BrandGrid -> FAQ -> RelatedServices(other pillars) -> tarieven seam -> CTABanner)"
  - "Sub-service = D-01 (Breadcrumbs -> Hero -> Steps -> BrandGrid(node.brandIds) -> FAQ -> RelatedServices(siblings) -> CTABanner)"
  - "Tarieven CTA via pillarTarievenTab: link to /tarieven?tab={tab} when non-null; warmtepompen (null) omits the price link"

patterns-established:
  - "One template per route depth, fully taxonomy-driven — zero hardcoded slug lists"

requirements-completed: [IA-03, IA-04, IA-06]

duration: ~10 min
completed: 2026-06-05
---

# Phase 02 Plan 03: Pillar + sub-service dynamic route templates Summary

**Two nested dynamic route templates render all 4 pillar pages (D-02) and 17 sub-service pages (D-01) from the taxonomy via generateStaticParams + dynamicParams=false, with async-awaited params and basic per-page metadata — the phase's core route surface.**

## Performance

- **Duration:** ~10 min
- **Tasks:** 2
- **Files modified:** 2 (both created)

## Accomplishments
- `app/diensten/[pillar]/page.tsx`: `generateStaticParams` → 4 pillar params from `pillars()`; D-02 layout composing ServiceHero, a `childrenOf`-driven ServiceCard grid, BrandGrid(brandsForPillar), ServiceFAQ, RelatedServices(other pillars), the tarieven seam, and CTABanner.
- `app/diensten/[pillar]/[service]/page.tsx`: `generateStaticParams` flat-maps `childrenOf` over `pillars()` → 17 `{pillar,service}` pairs; D-01 stack with BrandGrid receiving `node.brandIds` (self-omits on the 15 non-Installatie subs).
- Both routes export `dynamicParams = false`, await the Next-16 `params` Promise in the page **and** `generateMetadata`, and add a `notFound()` guard.
- Tarieven seam (RESEARCH §5): `pillarTarievenTab` drives a "Bekijk tarieven" link for airco/wtw/mv; warmtepompen renders no price link (null), so no `tarieven?tab=warmtepompen` string exists anywhere.

## Task Commits

1. **Task 02-03-1: Pillar route template** - `9336e67` (feat)
2. **Task 02-03-2: Sub-service route template** - `36efa89` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `app/diensten/[pillar]/page.tsx` - Data-driven pillar page (4 routes).
- `app/diensten/[pillar]/[service]/page.tsx` - Data-driven sub-service page (17 routes).

## Decisions Made
- Followed D-01/D-02 layouts exactly; tarieven CTA placed as its own band before the closing CTABanner so the hero's "Offerte aanvragen" stays the primary action.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Route-count / build proof is intentionally deferred to 02-06's whole-phase `npm run build` (the plan's stated gate). Verified statically here via grep: `dynamicParams = false`, `await params` (×2 per file), taxonomy-derived `generateStaticParams` (no literal slug arrays), full D-01/D-02 component sets, and no aurora/particle imports.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 02-04 (lean hub) and 02-05 (taxonomy nav) now have real route targets for every pillar/sub-service link.
- 02-06's build will statically generate and verify all 22 routes (1 hub + 4 pillar + 17 service) plus compose the Wave-2 components for the first full render proof.

---
*Phase: 02-routes-service-page-templates*
*Completed: 2026-06-05*
