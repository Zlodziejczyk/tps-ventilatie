---
phase: 03-seo-infrastructure
plan: 03-08
subsystem: verification
tags: [seo, runbook, assertions, build-gate, verification]

requires:
  - phase: 03-seo-infrastructure
    provides: "03-04 sitemap/robots; 03-05 layout; 03-06 routes; 03-07 static pages; 03-01..03 lib/seo"
provides:
  - "docs/seo-owner-runbook.md — owner GBP/GSC/Vercel/AI/geo checklist"
  - "scripts/assert-seo.ts — locks indexing policy + JSON-LD invariants"
  - "Whole-phase green build gate (out/ wiring proven)"

affects: [phase-4]

tech-stack:
  added: []
  patterns:
    - "Build-time assert script (node:assert/strict) + out/ grep gate as the phase verification harness"

key-files:
  created:
    - docs/seo-owner-runbook.md
    - scripts/assert-seo.ts
  modified: []

key-decisions:
  - "Build gate runs with the sandbox disabled (next/font/google needs network) + a retry to clear a transient OneDrive read timeout"
  - "out/ is gitignored — task 3 is a verification gate, no commit"

patterns-established:
  - "assert-seo.ts joins assert-registry/assert-site-shape as the on-demand SEO regression guard"

requirements-completed: [SEO-07, SEO-09]

duration: ~40 min (mostly build-env troubleshooting)
completed: 2026-06-06
---

# Phase 03 Plan 08: Owner Runbook + SEO Assertions + Whole-Phase Build Gate Summary

**The phase's verification gate: a `docs/seo-owner-runbook.md` for the credential-bound owner steps, a `scripts/assert-seo.ts` that locks the indexing-policy + JSON-LD invariants, and a GREEN `npm run build` whose `out/` proves every piece of the SEO wiring (sitemap, robots, JSON-LD, canonical, noindex, no stale brand).**

## Performance

- **Duration:** ~40 min (build ran green; most time was OneDrive/sandbox build-env troubleshooting)
- **Tasks:** 3
- **Files created:** 2 (runbook + assert script); task 3 is a verification gate (no file)

## Accomplishments
- `docs/seo-owner-runbook.md`: GBP (name + `Airconditioningsbedrijf` + secondaries + `SITE.serviceAreas`), GSC (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` + sitemap submit), Vercel enable, AI-crawler opt-out reference, geo + www→apex confirm — no secrets.
- `scripts/assert-seo.ts` passes (exit 0): 4 indexable statics, sitemap 4 absolute-apex, apex canonical, HVACBusiness `@id` w/o ratings (geoRadius 60000), faq null-on-empty. `assert-registry.ts` still green (no regression).
- **`npm run build` GREEN** (taxonomy prebuild + Turbopack compile + TypeScript + static export of 27 routes). All 18 `out/` proof greps pass + bonus checks.

## out/ Build-Gate Proofs (all pass)
- `out/sitemap.xml`: exactly `/`, `/tarieven`, `/over-ons`, `/contact` (absolute apex); excludes `/privacy-beleid` + `/diensten*`.
- `out/robots.txt`: `Sitemap: https://tpsventilatie.nl/sitemap.xml`, all 7 AI bots `Allow: /`, **no** `Disallow`.
- `out/index.html`: `application/ld+json` + `HVACBusiness`, absolute `rel="canonical"`, `og:image`, `<title>` = "TPS klimaattechniek | …" (no stale "TPS Ventilatie", no double-brand).
- `out/diensten/airconditioning.html` (draft pillar): `noindex` + `Service` + `BreadcrumbList`. `out/privacy-beleid.html`: `noindex`.
- `next.config.ts` still `output: "export"` (untouched — Phase 5 gate).

## Task Commits

1. **Task 03-08-1: owner runbook** - `ed171ca` (docs)
2. **Task 03-08-2: scripts/assert-seo.ts** - `60a25dd` (test)
3. **Task 03-08-3: whole-phase build gate** - verification only (out/ gitignored, no commit)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `docs/seo-owner-runbook.md` - owner ops checklist (SEO-07/SEO-09).
- `scripts/assert-seo.ts` - SEO invariant assertions.

## Decisions Made
- The build gate is run with the sandbox disabled because `next/font/google` (Inter + Plus Jakarta Sans, pre-existing in `app/layout.tsx`) fetches `.woff2` from `fonts.gstatic.com` at build time; the default sandbox blocks that host.

## Deviations from Plan

None to the code. Build-environment handling differed from the happy path — see Issues.

## Issues Encountered
- **Build env (environmental, not a code defect):** the in-place `npm run build` first failed because the sandbox blocked `fonts.gstatic.com` (next/font/google), then — once run with network — failed once more with a transient `ETIMEDOUT` filesystem read in the export-worker phase (OneDrive Files-On-Demand hydration, a documented constraint of this mount). A **retry with the warmed `.next` compile cache completed GREEN** and produced a correct `out/`. The canonical build env (CI/Vercel: clean checkout, network, local disk) has neither limitation.
- **Cosmetic:** the home `rel="canonical"` renders as `https://tpsventilatie.nl` (Next drops the root trailing slash under `trailingSlash:false`); the sitemap `<loc>` keeps `…/`. Both are RFC-equivalent representations of the root — no SEO impact.

## User Setup Required
The runbook + `03-USER-SETUP.md` capture the owner steps (GBP, GSC token + sitemap submit, Vercel enable, geo confirm).

## Next Phase Readiness
- **Phase 3 complete.** Every route is indexable + richly described (sitemap/robots/JSON-LD/canonical/OG), the brand is fixed, analytics + GSC are wired, and the policy is locked by `assert-seo.ts` + the build gate. Phase 4 publishes copy → pages auto-enter the sitemap + flip to `index` via the single editorial lever, with zero Phase-3 rework.

---
*Phase: 03-seo-infrastructure*
*Completed: 2026-06-06*
