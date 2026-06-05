---
phase: 03-seo-infrastructure
plan: 03-01
subsystem: seo-foundation
tags: [seo, canonical, indexing-policy, constants, single-source]

requires:
  - phase: 01-taxonomy-data-model
    provides: PAGES registry, urlFor, PageNode union (static.pathSegment, status)
  - phase: 02-routes-service-page-templates
    provides: trailFor/Crumb (consumed later by 03-03), generateMetadata seam
provides:
  - "CANONICAL_ORIGIN — the single apex origin string (metadataBase / canonicals / sitemap / robots / JSON-LD)"
  - "GOOGLE_SITE_VERIFICATION — public GSC token from NEXT_PUBLIC_ env, empty-when-unset"
  - "lib/seo/policy.ts: isIndexable(node), absoluteUrl(path), sitemapEntries()"

affects: [03-02, 03-03, 03-04, 03-05, 03-06, 03-07, 03-08]

tech-stack:
  added: []
  patterns:
    - "Single-source SEO policy (mirrors urlFor()) — sitemap membership + per-page robots both read isIndexable"
    - "Type-keyed indexing rule (static-aware) instead of naive status==published (all-draft reality, RESEARCH §4)"

key-files:
  created:
    - lib/seo/policy.ts
  modified:
    - lib/constants.ts

key-decisions:
  - "CANONICAL_ORIGIN = apex https://tpsventilatie.nl (D-01, live-confirmed) — no trailing slash"
  - "Constants added as siblings below SITE; SITE `as const` literal untouched (assert-site-shape stays green)"
  - "isIndexable: static pages indexable now (except privacy-beleid); hub/pillar/service gate on status==published"

patterns-established:
  - "lib/seo/* module family under the documented no-barrel exception (same as registry.ts)"

requirements-completed: [SEO-01, SEO-02, SEO-04]

duration: ~25 min
completed: 2026-06-05
---

# Phase 03 Plan 01: SEO Foundation — Canonical Origin + Indexing Policy Summary

**The single-source SEO root: `CANONICAL_ORIGIN` (apex) + `GOOGLE_SITE_VERIFICATION` in `lib/constants.ts`, plus `lib/seo/policy.ts` (`isIndexable`/`absoluteUrl`/`sitemapEntries`) — the one place index membership and absolute-URL derivation are decided, mirroring the `urlFor()` no-drift pattern.**

## Performance

- **Duration:** ~25 min (most of it spent resolving OneDrive tsc contention)
- **Tasks:** 2
- **Files created:** 1 · **modified:** 1

## Accomplishments
- Added `CANONICAL_ORIGIN = "https://tpsventilatie.nl"` (apex, D-01, no trailing slash) and `GOOGLE_SITE_VERIFICATION` (from `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, empty-when-unset) as siblings below `SITE` — the `SITE as const` object is structurally unchanged.
- Created `lib/seo/policy.ts` with three pure functions: `isIndexable` (type-keyed: statics indexable now except `privacy-beleid`; hub/pillar/service gate on `status === "published"`), `absoluteUrl` (root keeps its slash, non-root has none), `sitemapEntries` (one absolute-apex entry per indexable node).
- Functional proof passed: `PAGES.filter(isIndexable).length === 4` → exactly `/`, `/tarieven`, `/over-ons`, `/contact`; `absoluteUrl("/")` → `https://tpsventilatie.nl/`, `absoluteUrl("/contact")` → `https://tpsventilatie.nl/contact`.

## Task Commits

1. **Task 03-01-1: Canonical origin + GSC constants** - `a0bac6f` (feat)
2. **Task 03-01-2: lib/seo/policy.ts indexing helper** - `75816f9` (feat)

**Plan metadata:** committed with this SUMMARY (docs)

## Files Created/Modified
- `lib/constants.ts` - Added `CANONICAL_ORIGIN` + `GOOGLE_SITE_VERIFICATION` exports below `SITE`.
- `lib/seo/policy.ts` - New: `isIndexable`, `absoluteUrl`, `sitemapEntries`; imports `PAGES`/`urlFor` + `CANONICAL_ORIGIN`; server-safe, no client directive.

## Decisions Made
- Indexing keys off **type**, not a naive `status === "published"` — every registry node is currently `draft`, so a status-only rule would noindex the entire site (RESEARCH §4). Statics render real content now → indexable; the service surface flips on the Phase-4 editorial gate.
- `lib/seo/*` is its own module family under the no-barrel exception (same rationale as `registry.ts`).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Two overlapping `tsc --noEmit` runs contended on the OneDrive mount and stalled (>2 min, no completion). Resolved by killing the redundant process and running a single clean `tsc --noEmit` → **exit 0, zero errors**. Verification also used a fast `tsx` logic proof (the project's OneDrive execution pattern, per Phase 2). Going forward: one tsc per plan/wave, never overlapping; comprehensive gate is the 03-08 `npm run build`.

## User Setup Required
None in this plan (the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` owner step is documented in the 03-05 user_setup + 03-08 runbook).

## Next Phase Readiness
- Wave 2 (03-02 metadata builder, 03-03 JSON-LD, 03-04 sitemap/robots) can now import `isIndexable`/`absoluteUrl`/`sitemapEntries` + `CANONICAL_ORIGIN`. The single-source root is in place; nothing downstream hardcodes the origin or an index decision.

---
*Phase: 03-seo-infrastructure*
*Completed: 2026-06-05*
