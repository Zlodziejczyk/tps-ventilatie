---
phase: 03-seo-infrastructure
plan: 03-02
subsystem: seo-metadata
tags: [seo, metadata, opengraph, twitter, canonical, og-image]

requires:
  - phase: 03-seo-infrastructure
    provides: "03-01: absoluteUrl, isIndexable, CANONICAL_ORIGIN"
provides:
  - "lib/seo/metadata.ts buildMetadata(node) — canonical + OG/Twitter + robots, one seam for all pages"
  - "OG_IMAGE constant (/og-default.jpg)"
  - "public/og-default.jpg — 1200×630 branded OG card"

affects: [03-05, 03-06, 03-07]

tech-stack:
  added: []
  patterns:
    - "Single metadata builder feeds both static `metadata` exports and dynamic `generateMetadata`"
    - "title.absolute to use the brand-bearing metaTitle verbatim (no title.template double-brand)"

key-files:
  created:
    - lib/seo/metadata.ts
    - public/og-default.jpg
  modified: []

key-decisions:
  - "title: { absolute: metaTitle } — the registry metaTitles already carry the brand, so a plain-string title would be double-branded by the layout title.template (D-05 fix)"
  - "images = node.content.ogImage ?? OG_IMAGE — a future per-page OG image slots in without touching callers"
  - "OG image is the launch default seeded from hero-ventilatie.jpg; per-pillar bespoke cards deferred"

patterns-established:
  - "Every page's <head> goes through buildMetadata — canonical/OG/robots cannot drift"

requirements-completed: [SEO-04, SEO-05]

duration: ~15 min
completed: 2026-06-05
---

# Phase 03 Plan 02: Shared Metadata Builder + OG Image Summary

**`lib/seo/metadata.ts` `buildMetadata(node)` — the single seam producing absolute self-canonical + OpenGraph + Twitter + per-page `robots` for every one of the ~27 pages, plus the branded 1200×630 `public/og-default.jpg` it references.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- `buildMetadata(node)` returns `alternates.canonical` (absolute via `absoluteUrl(urlFor(node))`), `openGraph` (`url` === canonical, `siteName: SITE.name`, `locale: "nl_NL"`, `type: "website"`, the OG image), `twitter` (`summary_large_image`, same image), and `robots` (`{ index: isIndexable(node), follow: true }`).
- `OG_IMAGE = "/og-default.jpg"` exported for the layout default (03-05); `images` prefers `node.content.ogImage ?? OG_IMAGE` so a future per-page card needs no builder change.
- Produced `public/og-default.jpg` at exactly 1200×630 from `public/images/hero-ventilatie.jpg` via `sips`.
- tsx proof passed: home → `{index:true,follow:true}` + canonical `https://tpsventilatie.nl/`; draft service → `{index:false,follow:true}`; `openGraph.url === alternates.canonical`; `siteName === SITE.name`.

## Task Commits

1. **Task 03-02-1: lib/seo/metadata.ts (buildMetadata + OG_IMAGE)** - `8ccc503` (feat)
2. **Task 03-02-2: branded 1200×630 public/og-default.jpg** - `c3b65a0` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `lib/seo/metadata.ts` - New: `buildMetadata` + `OG_IMAGE`.
- `public/og-default.jpg` - New: 1200×630 branded OG card (ventilation-fan product shot).

## Decisions Made
- **`title: { absolute: metaTitle }`** rather than a plain-string title — the registry metaTitles already embed the brand (e.g. "Tarieven | TPS klimaattechniek"), and the layout `title.template` ("%s | TPS klimaattechniek", set in 03-05) would double-brand a plain string. `absolute` uses the metaTitle verbatim. (See Deviations.)

## Deviations from Plan

**[Rule 2 — Missing critical detail] title.absolute to prevent double-branding**
- Found during: Task 03-02-1.
- Issue: The plan's must_have says `title` = `node.content.metaTitle`. Taken literally as a plain-string title, Next.js applies the parent layout `title.template` ("%s | TPS klimaattechniek"), and since every metaTitle already carries the brand suffix, the rendered `<title>` would be double-branded ("… | TPS klimaattechniek | TPS klimaattechniek"). This latent issue already affects the Phase-2 dynamic routes (plain-string titles).
- Fix: Return `title: { absolute: node.content.metaTitle }` so the brand-bearing metaTitle is used verbatim, bypassing the template. Page title = metaTitle exactly, as intended.
- Files modified: `lib/seo/metadata.ts`.
- Verification: tsx proof asserts `(title as {absolute}).absolute === node.content.metaTitle`. The 03-08 build gate confirms `out/index.html <title>` has no stale brand and no duplication.

**[Execution adaptation] OG image format**
- The seed `public/images/hero-ventilatie.jpg` is a PNG with a `.jpg` extension (sips reported `format: png`); `sips` preserved that format, so the first output was PNG-in-.jpg. Re-encoded with `sips -s format jpeg` → a valid baseline JPEG (1200×630, ~82 KB). Acceptance criterion ("file reports JPEG") now holds.

**Total deviations:** 1 missing-critical fix + 1 format adaptation. **Impact:** Correct, non-double-branded titles; valid JPEG OG asset.

## Issues Encountered
- None blocking. Full `tsc`/build type gate is the 03-08 `npm run build` (project OneDrive pattern); per-task verification used the fast `tsx` logic proof.

## User Setup Required
None.

## Next Phase Readiness
- 03-05 (layout default OG + metadataBase), 03-06 (dynamic `generateMetadata`), and 03-07 (static-page metadata) can now all call `buildMetadata`. `OG_IMAGE` + the asset are in place for the layout default.

---
*Phase: 03-seo-infrastructure*
*Completed: 2026-06-05*
