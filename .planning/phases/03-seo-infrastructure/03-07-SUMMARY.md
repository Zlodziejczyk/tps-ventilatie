---
phase: 03-seo-infrastructure
plan: 03-07
subsystem: static-pages
tags: [seo, metadata, canonical, robots, static-pages]

requires:
  - phase: 03-seo-infrastructure
    provides: "03-02: buildMetadata; 03-01: isIndexable policy"
provides:
  - "All 6 static pages route metadata through buildMetadata (canonical/OG/robots)"
  - "home/tarieven/over-ons/contact indexable; privacy-beleid + draft hub noindex,follow"

affects: [03-08]

tech-stack:
  added: []
  patterns:
    - "Static-page metadata = buildMetadata(findBySlug(path)!) — same builder as dynamic routes"

key-files:
  created: []
  modified:
    - app/page.tsx
    - app/tarieven/page.tsx
    - app/over-ons/page.tsx
    - app/contact/page.tsx
    - app/privacy-beleid/page.tsx
    - app/diensten/page.tsx

key-decisions:
  - "Home gains its first metadata export (was relying on the layout default)"
  - "Inline hardcoded title/description objects removed — titles come from the rebranded registry metaTitles"
  - "Unused `import type { Metadata }` removed from the 5 pages that had it"

patterns-established:
  - "Every page (static + dynamic) shares one metadata builder — canonical/OG/robots cannot drift"

requirements-completed: [SEO-02, SEO-04, SEO-05]

duration: ~12 min
completed: 2026-06-05
---

# Phase 03 Plan 07: Static-Page Metadata via the Shared Builder Summary

**All 6 static pages now emit absolute self-canonical + OG/Twitter + the correct per-page robots via `buildMetadata(findBySlug(path)!)` — home/tarieven/over-ons/contact indexable, privacy-beleid + the draft hub `noindex,follow` — closing the canonical/OG/robots gap on the pages real users and Google already see.**

## Performance

- **Duration:** ~12 min
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Home (`app/page.tsx`) gained its first `metadata` export → absolute canonical `https://tpsventilatie.nl/` + index.
- `tarieven`, `over-ons`, `contact` metadata replaced with the builder → indexable, self-canonical, OG/Twitter; the now-unused `import type { Metadata }` removed.
- `privacy-beleid` + the draft hub `/diensten` route through the builder → `noindex,follow` + sitemap-excluded (the hub auto-flips on Phase-4 publish).
- tsx proof: all 6 slugs resolve (the `!` is safe); the 4 content pages `index:true`, privacy + hub `index:false`; every canonical absolute-apex.
- **`tsc --noEmit` clean (exit 0).**

## Task Commits

1. **Task 03-07-1: home, tarieven, over-ons, contact** - `5b9ea14` (feat)
2. **Task 03-07-2: privacy-beleid + draft hub /diensten** - `e427dbb` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `app/page.tsx`, `app/tarieven/page.tsx`, `app/over-ons/page.tsx`, `app/contact/page.tsx` - indexable metadata via builder.
- `app/privacy-beleid/page.tsx`, `app/diensten/page.tsx` - noindex,follow via builder.

## Decisions Made
- Titles now derive from each node's `content.metaTitle` (already klimaattechniek-branded in the registry), so the stale inline "TPS Ventilatie" *metadata* is gone on every page.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- **Out-of-scope note (not a defect):** several pages still contain "TPS Ventilatie" in their **visible body copy** (over-ons story, contact map title, review quotes, privacy text). This is page-body content, explicitly **Phase 4** (content rewrite / editorial sign-off), not Phase-3 metadata scope. The 03-08 build gate only asserts the metadata `<title>` is clean, which it now is.

## User Setup Required
None.

## Next Phase Readiness
- Wave 3 complete — every page (static + dynamic) is instrumented. 03-08 runs the whole-phase build gate (green export + `out/` proofs) and ships the owner runbook + `assert-seo.ts`.

---
*Phase: 03-seo-infrastructure*
*Completed: 2026-06-05*
