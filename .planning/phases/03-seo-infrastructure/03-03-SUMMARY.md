---
phase: 03-seo-infrastructure
plan: 03-03
subsystem: seo-structured-data
tags: [seo, json-ld, schema-org, hvacbusiness, breadcrumb, faqpage]

requires:
  - phase: 03-seo-infrastructure
    provides: "03-01: absoluteUrl, CANONICAL_ORIGIN; SITE NAP/geo/serviceAreas"
  - phase: 02-routes-service-page-templates
    provides: "trailFor/Crumb (BreadcrumbList source)"
provides:
  - "lib/seo/jsonld.tsx JsonLd injector (server, XSS-safe)"
  - "businessJsonLd (site-wide HVACBusiness, stable @id, no ratings/sameAs)"
  - "serviceJsonLd / breadcrumbJsonLd / faqJsonLd per-page builders"

affects: [03-05, 03-06]

tech-stack:
  added: []
  patterns:
    - "Single JsonLd injector escapes < so JSON values cannot break out of </script>"
    - "Stable business @id referenced by per-page Service nodes as provider"
    - "faqJsonLd returns null on empty faqs — renders only once Phase 4 fills them"

key-files:
  created:
    - lib/seo/jsonld.tsx
  modified: []

key-decisions:
  - "HVACBusiness (LocalBusiness subtype) — stronger HVAC signal; @type single-form unless a Rich-Results gap shows up"
  - "NO aggregateRating/review (Phase 4 / CONT-08) and NO sameAs (owner GBP/social pending, A-3) — omit optional props, never empty URLs"
  - "areaServed = GeoCircle(60000 m) + the 8 serviceAreas as Place[] (regio signal, SEO-06)"

patterns-established:
  - "All structured data flows from SITE + taxonomy through one server-side injector — zero client JS"

requirements-completed: [SEO-03, SEO-06]

duration: ~15 min
completed: 2026-06-05
---

# Phase 03 Plan 03: JSON-LD Component + Structured-Data Builders Summary

**`lib/seo/jsonld.tsx` — a server-side, XSS-safe `JsonLd` injector plus typed builders that turn `SITE` + a taxonomy node into valid Schema.org data: site-wide `HVACBusiness` and per-page `Service` / `BreadcrumbList` / `FAQPage`, with no ratings yet (reserved for Phase 4).**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2
- **Files created:** 1

## Accomplishments
- `JsonLd({ data })` renders `<script type="application/ld+json">` with `JSON.stringify(data).replace(/</g, "\\u003c")` — the `<` escape prevents any value from closing `</script>` (server component, zero client JS).
- `businessJsonLd()` → `HVACBusiness` with stable `@id` `…/#business`, full NAP/geo from `SITE`, `areaServed` = a 60000 m `GeoCircle` + the 8 service-area `Place`s, `priceRange`, image/logo; carries **no** `aggregateRating`/`review`/`sameAs`.
- `serviceJsonLd(node)` (`provider` → business `@id`, regio `areaServed`), `breadcrumbJsonLd(node)` (absolute, 1-indexed, from `trailFor`), `faqJsonLd(node)` (null when faqs empty).
- tsx proofs passed for both tasks (business shape; Service provider link; breadcrumb absolute/1-indexed length 4; FAQ null-on-empty + object-on-present).

## Task Commits

1. **Task 03-03-1: JsonLd + businessJsonLd** - `2e7415f` (feat)
2. **Task 03-03-2: serviceJsonLd, breadcrumbJsonLd, faqJsonLd** - `535b03d` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `lib/seo/jsonld.tsx` - New: `JsonLd`, `businessJsonLd`, `serviceJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`.

## Decisions Made
- HVACBusiness single `@type` (the `["HVACBusiness","LocalBusiness"]` fallback is held unless the Rich Results Test shows a coverage gap when rendered in 03-05/03-06).
- `sameAs` omitted (owner GBP/social URLs pending, A-3); `geo` ships the current owner-verify-pending Zoetermeer placeholder (A-1, runbook confirms before launch).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- None. Full type/Rich-Results validity is proven once rendered (03-05 sitewide, 03-06 per-page) and spot-checked in the 03-08 build gate; per-task verification used `tsx` logic proofs (OneDrive pattern).

## User Setup Required
None in this plan (owner `sameAs`/GBP + geo confirmation are in the 03-08 runbook).

## Next Phase Readiness
- 03-05 renders `<JsonLd data={businessJsonLd()} />` once in the layout; 03-06 injects `serviceJsonLd`/`breadcrumbJsonLd`/(guarded)`faqJsonLd` on the pillar + sub-service routes.

---
*Phase: 03-seo-infrastructure*
*Completed: 2026-06-05*
