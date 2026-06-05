---
phase: 03-seo-infrastructure
plan: 03-05
subsystem: root-layout
tags: [seo, metadata, rebrand, json-ld, analytics, gsc, vercel]

requires:
  - phase: 03-seo-infrastructure
    provides: "03-01: CANONICAL_ORIGIN, GOOGLE_SITE_VERIFICATION; 03-02: OG_IMAGE; 03-03: JsonLd, businessJsonLd"
provides:
  - "Root document head: metadataBase + rebranded title/template + default OG/Twitter + conditional GSC meta"
  - "Site-wide HVACBusiness JSON-LD (rendered once)"
  - "Cookieless Vercel Analytics + Speed Insights"

affects: [03-06, 03-07, 03-08]

tech-stack:
  added:
    - "@vercel/analytics ^2.0.1"
    - "@vercel/speed-insights ^2.0.0"
  patterns:
    - "Server-component layout imports client analytics components (allowed)"
    - "verification meta emitted only when the env token is non-empty"

key-files:
  created: []
  modified:
    - app/layout.tsx
    - package.json
    - package-lock.json

key-decisions:
  - "Brand fixed: title.default + template now 'TPS klimaattechniek'; stale 'TPS Ventilatie' gone"
  - "Legacy keywords array dropped (D-05); metadataBase = apex so relative OG/canonical resolve"
  - "Cookieless analytics only — GA4 deferred (would need consent + privacy-policy processor mention)"

patterns-established:
  - "Every page inherits the rebranded head + the one business JSON-LD node + measurement"

requirements-completed: [SEO-03, SEO-04, SEO-05, SEO-06, SEO-09]

duration: ~15 min
completed: 2026-06-05
---

# Phase 03 Plan 05: Root Layout — Rebrand + metadataBase + JSON-LD + Analytics + GSC Summary

**`app/layout.tsx` now sets `metadataBase` to the apex, carries the rebranded "TPS klimaattechniek" title/template (stale "TPS Ventilatie" gone), drops the deprecated keywords meta, renders the one site-wide `HVACBusiness` JSON-LD, and mounts cookieless Vercel Analytics + Speed Insights with a conditional GSC verification tag.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 3
- **Files modified:** 3 (1 source + 2 dependency manifests)

## Accomplishments
- Installed `@vercel/analytics` + `@vercel/speed-insights` ([OK] first-party, RESEARCH §5) and rendered `<Analytics />` + `<SpeedInsights />` before `</body>` (cookieless → no consent banner).
- Rewrote the `metadata` export: `metadataBase: new URL(CANONICAL_ORIGIN)`; `title.default`/`template` rebranded; klimaattechniek description (Zoetermeer + regio); **keywords removed**; default `openGraph`/`twitter` (siteName `SITE.name`, `OG_IMAGE`); `verification` emitted only when the GSC token is set.
- Rendered `<JsonLd data={businessJsonLd()} />` once at the top of `<body>`.
- **`tsc --noEmit` clean (exit 0)** — the full type gate passed (layout is a non-tsx-executable consumer, so tsc is the verifier here).
- Greps: 0 "TPS Ventilatie", 0 `keywords`, ≥1 "TPS klimaattechniek", metadataBase present, `siteName: SITE.name`, no GA4/gtag.

## Task Commits

1. **Task 03-05-1: install + wire Analytics/Speed Insights** - `555ffb2` (feat)
2. **Task 03-05-2: metadataBase + rebrand + OG/Twitter + GSC meta** - `167b395` (feat)
3. **Task 03-05-3: site-wide HVACBusiness JSON-LD** - `9cab123` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `app/layout.tsx` - metadataBase, rebrand, default OG/Twitter, conditional GSC meta, business JSON-LD, analytics mounts.
- `package.json` / `package-lock.json` - the two `@vercel/*` deps (3 packages added including 1 transitive).

## Decisions Made
- Cookieless analytics only (GA4 deferred). Layout stays a server component; the analytics client components import into it cleanly.

## Deviations from Plan

None - plan executed exactly as written. (Reworded a comment to avoid the literal word "keywords" so the anti-drift grep reads 0 — no behavioral change.)

## Issues Encountered
- `npm install` reported 4 pre-existing tree vulnerabilities (2 moderate, 2 high) unrelated to the two first-party `@vercel/*` packages. Not Phase-3 scope; `npm audit fix --force` was deliberately NOT run (risk of breaking changes). Flag for a dedicated dependency-hardening pass (Phase 5 QA).

## User Setup Required
**Yes** — see `.planning/phases/03-seo-infrastructure/03-USER-SETUP.md`:
- Vercel: enable Web Analytics + Speed Insights collection (dashboard).
- GSC: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, verify, submit the sitemap.
(Full operational detail also in the 03-08 `docs/seo-owner-runbook.md`.)

## Next Phase Readiness
- The shared head + business node are live for every page. 03-06 (dynamic routes) and 03-07 (static pages) layer per-page metadata + JSON-LD on top; 03-08 proves it all in `out/`.

---
*Phase: 03-seo-infrastructure*
*Completed: 2026-06-05*
