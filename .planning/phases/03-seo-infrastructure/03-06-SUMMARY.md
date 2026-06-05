---
phase: 03-seo-infrastructure
plan: 03-06
subsystem: dynamic-routes
tags: [seo, metadata, json-ld, generateMetadata, pillar, service]

requires:
  - phase: 03-seo-infrastructure
    provides: "03-02: buildMetadata; 03-03: JsonLd + serviceJsonLd/breadcrumbJsonLd/faqJsonLd"
  - phase: 02-routes-service-page-templates
    provides: "pillar + sub-service route templates with generateMetadata seam"
provides:
  - "Pillar + sub-service routes: full canonical/OG/robots via buildMetadata"
  - "Per-page Service + BreadcrumbList + (guarded) FAQPage JSON-LD on all 21 service-surface routes"

affects: [03-08]

tech-stack:
  added: []
  patterns:
    - "generateMetadata returns buildMetadata(node) — one builder for static + dynamic, no drift"
    - "FAQPage rendered only when content.faqs is non-empty (auto-appears as Phase 4 fills FAQs)"

key-files:
  created: []
  modified:
    - app/diensten/[pillar]/page.tsx
    - app/diensten/[pillar]/[service]/page.tsx

key-decisions:
  - "node ? buildMetadata(node) : {} — the notFound() guard + dynamicParams=false already handle 404s"
  - "JSON-LD injected at top of <main> (no visual effect); visible stacks untouched"

patterns-established:
  - "Draft service-surface pages carry noindex,follow + structured data now; flip to indexed on Phase-4 publish with zero rework"

requirements-completed: [SEO-03, SEO-04, SEO-05]

duration: ~10 min
completed: 2026-06-05
---

# Phase 03 Plan 06: Dynamic Route Metadata + Per-Page JSON-LD Summary

**The two dynamic routes (4 pillar + 17 sub-service = 21 pages) now return full `buildMetadata(node)` (absolute canonical + OG/Twitter + per-page robots) and render `Service` + `BreadcrumbList` + guarded `FAQPage` JSON-LD — draft now, auto-indexed on the Phase-4 publish flip.**

## Performance

- **Duration:** ~10 min
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `app/diensten/[pillar]/page.tsx` + `app/diensten/[pillar]/[service]/page.tsx`: `generateMetadata` widened from `{title, description}` to `node ? buildMetadata(node) : {}`.
- Both render `<JsonLd data={serviceJsonLd(node)} />`, `<JsonLd data={breadcrumbJsonLd(node)} />`, and `{node.content.faqs.length > 0 && <JsonLd data={faqJsonLd(node)!} />}` at the top of `<main>`.
- `export const dynamicParams = false` + `await params` preserved; no `"use client"`; no new client (aurora/particle) imports; visible layouts unchanged.
- **`tsc --noEmit` clean (exit 0)** — the `notFound()` narrowing makes `node` non-undefined for the builders.

## Task Commits

1. **Task 03-06-1: pillar route** - `744cbab` (feat)
2. **Task 03-06-2: sub-service route** - `81a2804` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `app/diensten/[pillar]/page.tsx` - buildMetadata + Service/Breadcrumb/FAQ JSON-LD.
- `app/diensten/[pillar]/[service]/page.tsx` - same widening above the convert-forward stack.

## Decisions Made
- Empty `generateMetadata` fallback (`{}`) when node is undefined — the existing `notFound()` + `dynamicParams=false` already guard the param set, so no duplicate 404 handling.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- None. Full Rich-Results validity + the draft `noindex` + `BreadcrumbList` presence are proven in the 03-08 build gate (grep over a built draft page, e.g. `out/diensten/airconditioning.html`).

## User Setup Required
None.

## Next Phase Readiness
- The service surface is fully instrumented (metadata + structured data). 03-07 does the same for the static pages; 03-08 runs the whole-phase build gate.

---
*Phase: 03-seo-infrastructure*
*Completed: 2026-06-05*
