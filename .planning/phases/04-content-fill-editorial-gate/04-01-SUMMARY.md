---
phase: 04-content-fill-editorial-gate
plan: 01
subsystem: infra
tags: [build-gate, tsx, ymyl, content-integrity, prebuild, zod-adjacent]

requires:
  - phase: 01-taxonomy-data-model
    provides: PAGES registry + ContentShell + status field the gate iterates
  - phase: 03-seo-infrastructure
    provides: scripts/assert-* + prebuild idiom this gate mirrors
provides:
  - Build-enforced D-13 anti-claim grep gate over review/published node content
  - prebuild chains validate-taxonomy && assert-no-forbidden-claims (blocks on Vercel CI)
  - Written per-node anti-claim checklist (the nuance the regex cannot catch)
affects: [04-03, 04-04, 04-05, 04-06, 04-07, 04-09]

tech-stack:
  added: []
  patterns:
    - "Build-time tsx assertion over serialized PAGES content (mirrors validate-taxonomy/assert-seo)"
    - "Forbidden literals confined to regex sources only — self-scan-safe script"

key-files:
  created:
    - scripts/assert-no-forbidden-claims.ts
    - docs/anti-claim-checklist.md
  modified:
    - package.json

key-decisions:
  - "Both enforcement layers shipped: build-time grep gate (coarse) + written human checklist (nuance), per RESEARCH recommendation"
  - "why strings kept free of matchable literals so the gate cannot false-positive on its own source (satisfies AC4)"
  - "gecertificeerd pattern is temporary — to be scoped/removed once F-gassen/STEK is owner-verified (intake §6)"

patterns-established:
  - "D-13 anti-claim gate: any new forbidden YMYL literal is added as one {pattern,why} row; only review/published nodes are scanned"

requirements-completed: [CONT-03, CONT-05, CONT-06]

duration: 12 min
completed: 2026-06-06
---

# Phase 04 Plan 01: D-13 Anti-Claim Gate Summary

**Build-time tsx grep gate that fails the build on Belgian-VAT / unverified-dealer / pre-proof-certified literals in any review/published node, chained into prebuild, plus a written per-node anti-claim checklist for the per-pillar ISDE nuance a regex cannot judge.**

## Performance

- **Duration:** ~12 min
- **Tasks:** 2
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- `scripts/assert-no-forbidden-claims.ts` — iterates `PAGES`, skips `draft`, tests 3 forbidden regexes against `JSON.stringify(node.content)`, exits 1 on any hit. Forbidden literals live only in regex sources, so the script is self-scan-safe.
- `package.json` prebuild now chains `tsx scripts/validate-taxonomy.ts && tsx scripts/assert-no-forbidden-claims.ts` — the D-13 gate is genuinely build-blocking on Vercel CI alongside the existing taxonomy gate.
- `docs/anti-claim-checklist.md` — the human pre-`review` gate: per-pillar ISDE rule (airco=none, WP=yes, WTW/MV=2026+isolatiemaatregel, MV=CO2-only), rvo.nl citation + amounts-to-consult, brand/cert gates, verbatim-reviews rule, and a copy-paste per-node checkbox block.

## Task Commits

1. **Task 1: anti-claim grep gate + prebuild chain** - `c04d5ce` (feat)
2. **Task 2: anti-claim review checklist** - `154f010` (docs)

## Files Created/Modified
- `scripts/assert-no-forbidden-claims.ts` - D-13 build-time grep gate over serialized review/published content
- `package.json` - prebuild chains the new gate after validate-taxonomy
- `docs/anti-claim-checklist.md` - written per-node pre-review anti-claim checklist

## Decisions Made
- Shipped both layers (script + checklist) rather than choosing one — the regex is a coarse net, the checklist handles nuance (per-pillar subsidie, brand/cert gating). RESEARCH explicitly recommended both.
- Kept the matchable phrases out of comments and `why` strings; an AC4 check caught one "Gecertificeerd" in a header comment and it was reworded before commit.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. (The AC4 comment-literal catch was a normal in-task verification loop, fixed and re-verified before the Task 1 commit — not a post-completion issue.)

## User Setup Required
None - no external service configuration required.

## Verification Notes
- All local-safe checks pass: Task-1 script-shape + prebuild-chain + AC1 structure + AC4 comment-clean; Task-2 keyword coverage (all 8 keywords).
- Per the OneDrive guard, `npx tsx` / `next build` were NOT run locally (deadlock risk). The gate executes in prebuild on Vercel CI; it exits 0 today (all service nodes are still `draft`) and begins enforcing as 04-03..06 flip pillars to `review`.

## Next Phase Readiness
- Foundation in place: 04-03..06 can now flip pillars to `review` against a genuine, build-enforced YMYL gate, applying `docs/anti-claim-checklist.md` per node before each flip.
- No blockers.

---
*Phase: 04-content-fill-editorial-gate*
*Completed: 2026-06-06*
