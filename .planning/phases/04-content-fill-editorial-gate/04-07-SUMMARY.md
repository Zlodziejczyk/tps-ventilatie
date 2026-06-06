---
phase: 04-content-fill-editorial-gate
plan: 07
subsystem: content
tags: [brands, pricing, transparency, btw, voorrijkosten, cont-03, cont-05]

requires:
  - phase: 04-content-fill-editorial-gate
    provides: 04-01 anti-claim gate; airco/WP installatie nodes (rendered brand content)
provides:
  - Filled brand install blurbs (4 brands) as forward-compatible data; erkendInstallateur all false
  - Pricing-transparency copy on the tarieven static node (all-in incl. BTW + voorrijkosten; WP op maat)
affects: [04-09]

tech-stack:
  added: []
  patterns:
    - "Forward-compatible brand DATA (blurbs) while the locked BrandGrid renders names only"
    - "registry draftShell widened for extra — statics/hub still pass no extra"

key-files:
  created: []
  modified:
    - lib/services/brands.ts
    - lib/services/registry.ts

key-decisions:
  - "Brand blurbs are install-context only; erkendInstallateur stays false for all 4 (flips in 04-09 only on intake §5 proof)"
  - "BrandGrid (locked P2) and PricingTabs (pricing data) untouched — blurbs are data, pricing copy is framing only"
  - "tarieven node stays status:draft (statics index by type; Zod gate doesn't bite drafts) — rich body added safely"

patterns-established: []

requirements-completed: [CONT-03, CONT-05]

duration: 14 min
completed: 2026-06-06
---

# Phase 04 Plan 07: Brands + Pricing Transparency Summary

**Brand install blurbs filled as forward-compatible data (dealer status still gated false on all 4 brands) and pricing-transparency framing added to the tarieven node — all-in incl. BTW + voorrijkosten for airco/WTW/MV and warmtepompen "op maat via offerte" with inclusions — without touching the locked BrandGrid or the PricingTabs pricing data.**

## Performance
- **Duration:** ~14 min
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `brands.ts`: filled nl install-context `blurb` for Daikin, Mitsubishi Electric, Mitsubishi Heavy Industries and Mitsubishi Ecodan (each names a product TPS installs, no dealer/erkend/gecertificeerd claim). `erkendInstallateur` stays `false` for all four. `as const` + `BrandId` type and the placeholder `logo` paths preserved; BrandGrid (locked) untouched. Header reworded to keep the gated literal out of the file.
- `registry.ts`: widened the static `draftShell` to accept an `extra` object (statics/hub that pass nothing still default to empty). Added transparency copy to the `tarieven` node: all-in incl. BTW + voorrijkosten for airco/WTW/MV, warmtepompen "op maat via offerte" with inclusions (opname/warmteverliesberekening, materiaal, installatie, inbedrijfstelling), plus 3 pricing FAQs. NL 21% framing, never Belgian 6%. Actual price numbers untouched (they stay in PricingTabs.tsx).

## Task Commits
1. **Tasks 1+2: brand blurbs + tarieven transparency copy** - `52e1d55` (feat)

## Files Created/Modified
- `lib/services/brands.ts` - 4 install blurbs filled, dealer status gated, types preserved
- `lib/services/registry.ts` - draftShell widened; tarieven node carries transparency copy + FAQs

## Decisions Made
See key-decisions. The blurbs-as-data + PricingTabs-untouched split keeps locked infra and pricing data intact while delivering CONT-03/CONT-05 in the sanctioned content layer.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None. (erkendInstallateur flips and any logo assets arrive via owner intake §5/§9, mapped in 04-09.)

## Verification Notes
- OneDrive-safe text validation: 4 blurbs ≥10 chars, all erkendInstallateur false, no gated claim, as const/BrandId intact; tarieven has voorrijkosten + BTW + op-maat, no Belgian 6% btw; `git status` confirms PricingTabs.tsx untouched. `tsx`/build deferred to Vercel CI.

## Next Phase Readiness
- Wave 2 complete: all four service silos drafted at `review`, brand data + pricing framing in place. Remaining: human gates 04-08 (publish intake + message Thomas) and 04-09 (owner editorial sign-off → batch publish + map intake returns).

---
*Phase: 04-content-fill-editorial-gate*
*Completed: 2026-06-06*
