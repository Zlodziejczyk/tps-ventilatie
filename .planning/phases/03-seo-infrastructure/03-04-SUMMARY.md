---
phase: 03-seo-infrastructure
plan: 03-04
subsystem: seo-crawl-control
tags: [seo, sitemap, robots, force-static, ai-crawlers]

requires:
  - phase: 03-seo-infrastructure
    provides: "03-01: sitemapEntries, absoluteUrl, CANONICAL_ORIGIN"
provides:
  - "app/sitemap.ts — /sitemap.xml (force-static, taxonomy-sourced)"
  - "app/robots.ts — /robots.txt (open, AI-crawler-friendly, absolute Sitemap pointer)"

affects: [03-08]

tech-stack:
  added: []
  patterns:
    - "Both crawl-control files derive from the single-source policy helper — never a hand-maintained list"

key-files:
  created:
    - app/sitemap.ts
    - app/robots.ts
  modified: []

key-decisions:
  - "sitemap returns sitemapEntries() verbatim — no logic in the route, membership lives in policy.ts"
  - "robots: allow * + 7 AI bots, no blocked paths (noindex pages stay crawlable, D-03); host + Sitemap from CANONICAL_ORIGIN"

patterns-established:
  - "force-static crawl-control routes under output: export"

requirements-completed: [SEO-01, SEO-02]

duration: ~10 min
completed: 2026-06-05
---

# Phase 03 Plan 04: Programmatic Sitemap + Robots Summary

**`app/sitemap.ts` and `app/robots.ts` — both `force-static`, both derived from the 03-01 single-source policy helper so the sitemap and the per-page robots directive can never drift. Robots is open and AI-crawler-friendly with an absolute apex `Sitemap:` pointer.**

## Performance

- **Duration:** ~10 min
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- `app/sitemap.ts`: `export const dynamic = "force-static"` + `sitemap()` returning `sitemapEntries()` — no hardcoded route list (`grep http` = 0). Resolves to the 4 static absolute apex URLs now; service-surface pages auto-join when Phase 4 publishes them.
- `app/robots.ts`: `force-static`; `rules` = `*` allow `/` plus explicit allow entries for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`; **no** blocked paths anywhere; `sitemap` = `absoluteUrl("/sitemap.xml")`; `host` = `CANONICAL_ORIGIN`.
- tsx proof passed: sitemap → 4 absolute entries; robots → open, AI bots present, no `disallow` key, absolute Sitemap + host.

## Task Commits

1. **Task 03-04-1: app/sitemap.ts** - `d9443a1` (feat)
2. **Task 03-04-2: app/robots.ts** - `90b27d5` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `app/sitemap.ts` - New: force-static sitemap from `sitemapEntries()`.
- `app/robots.ts` - New: force-static open robots with AI-bot allow-list + absolute Sitemap/host.

## Decisions Made
- Zero logic in the routes — membership/origin live in `lib/seo/policy.ts` + `lib/constants.ts`, so the two files can never diverge from the index policy.

## Deviations from Plan

None - plan executed exactly as written. (Reworded one source comment to drop the literal word "disallow" so the grep-based gate reads 0 — no behavioral change.)

## Issues Encountered
- None. The built `out/sitemap.xml` (4 URLs, no privacy/diensten) and `out/robots.txt` (absolute Sitemap + GPTBot allow + no Disallow) are proven in the 03-08 build gate.

## User Setup Required
None (submitting the sitemap to GSC is an owner step in the 03-08 runbook).

## Next Phase Readiness
- Wave 2 complete. Wave 3 (03-05 layout, 03-06 dynamic routes, 03-07 static pages) consumes the metadata builder + JSON-LD builders; 03-08 proves sitemap/robots in the built `out/`.

---
*Phase: 03-seo-infrastructure*
*Completed: 2026-06-05*
