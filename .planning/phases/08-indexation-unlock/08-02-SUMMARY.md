---
phase: 08-indexation-unlock
plan: 02
subsystem: infra
tags: [seo, zod, indexability, taxonomy, robots, vercel]

requires:
  - phase: 08-indexation-unlock
    provides: "08-01's relational invariant + build-blocking guard chain — the harness that makes this edit safe to attempt"
provides:
  - "isIndexable() as a single data-driven predicate with no type branches (D-20)"
  - "6 statics carrying an honest status — 5 published, privacy-beleid draft (IDX-05)"
  - "CONTENT_BAR_TYPES — the anti-thin-content bar scoped to the taxonomy-rendered types"
  - "Named safety belts asserting privacy-beleid is out and home is in"
affects: [08-03, 08-04, 08-05, phase-12-kennisbank]

tech-stack:
  added: []
  patterns:
    - "Scope a validation rule to the nodes whose data is actually rendered — a bar applied where nothing renders manufactures content that appears nowhere"
    - "Ship a predicate change and the data relabel it depends on as ONE commit, so no intermediate state serves the wrong directive"
    - "Belt-and-braces on data-driven policy: when a code branch is deleted, replace it with a named assertion on the page where being wrong is most expensive"

key-files:
  created: []
  modified:
    - lib/services/types.ts
    - lib/seo/policy.ts
    - lib/services/registry.ts
    - scripts/assert-seo.ts
    - scripts/assert-gate-blocks.ts

key-decisions:
  - "The anti-thin-content bar is scoped to hub|pillar|service via a named CONTENT_BAR_TYPES constant — statics render bespoke pages, so their shell is metadata, not the page body"
  - "publishedContentSchema's thresholds and the PageStatus enum are untouched; only the governed set narrows"
  - "privacy-beleid is excluded from the index by carrying draft, not by a code branch — the accepted D-20 trade-off, recorded inline on the node"
  - "assert-seo gained a home-IS-indexable assertion alongside the privacy belt: the predicate change's worst plausible failure is taking down the home page"

patterns-established:
  - "A deliberate positive proof (empty published static ACCEPTED) is labelled as deliberate in the harness so a future reader does not 'fix' it back"
  - "The empty-hub rejection is the mechanism that forces 08-04 to author real content before publishing"

requirements-completed: [IDX-05]

duration: 22 min
completed: 2026-08-20
---

# Phase 8 Plan 02: Predicate Unification & Honest Statics Summary

**`isIndexable()` collapsed to `status === "published"` for every node type, the 6 statics relabelled to match what they actually serve, and the thin-content bar scoped to the types that render from the shell — with the indexable set provably unchanged at the same 5 URLs.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-08-20T12:02:00Z
- **Completed:** 2026-08-20T12:24:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 5

## Accomplishments

- **Indexability is now purely data.** One predicate, no type branches, no per-page carve-outs. A reader of the taxonomy can see what is indexed without opening `policy.ts`, and the editorial status flip *is* the index lever.
- **The data stopped lying.** Every static previously said `status: "draft"` while serving `index, follow` — the exact "data says one thing, page does another" split this phase exists to close. Now 5 say `published` and serve `index`, one says `draft` and serves `noindex`.
- **Unblocked the landing that could not build.** `pageSchema` applied the ≥120-word / ≥1-step / 3–6-FAQ bar to every `review|published` node regardless of type, so publishing the 5 content statics produced 13 Zod violations. Scoping the bar to `hub|pillar|service` fixed it without weakening it anywhere it renders.
- **Nothing moved.** Indexable set identical, sitemap identical, verified on served output — which is what makes this diff safe to revert in isolation if anything downstream goes wrong.

## Task Commits

1. **Task 1: Scope the anti-thin-content bar** — `b558eff` (fix)
2. **Task 2: Unify predicate + relabel statics (atomic)** — `1db9e97` (feat)
3. **Task 3: Preview gate** — no code commit; verification recorded below

## Files Created/Modified

- `lib/services/types.ts` — `CONTENT_BAR_TYPES` names the taxonomy-rendered types; `pageSchema` applies `publishedContentSchema` only to those. Thresholds and enum untouched.
- `lib/seo/policy.ts` — `isIndexable()` is one line; the `type === "static"` branch and its `pathSegment` carve-out are gone. Header rationale rewritten (it explained an "all-draft reality" that expired with this commit).
- `lib/services/registry.ts` — home/tarieven/projecten/over-ons/contact → `published`; privacy-beleid → `draft` with the D-20 trade-off recorded inline. Two stale comments claiming "statics index by type via policy.ts" corrected; the `PAGES` header arithmetic fixed (it still said 5 statics / 27 nodes).
- `scripts/assert-seo.ts` — privacy belt reworded to name the deleted exception it replaces; home-is-indexable assertion added.
- `scripts/assert-gate-blocks.ts` — proof (D) empty published hub REJECTED, proof (E) empty published static ACCEPTED (labelled deliberate).

## Decisions Made

- **Scope the bar, don't author filler.** The alternative — writing 120+ words, steps and FAQs into five nodes that render none of it — would have manufactured the very defect the phase is closing (and D-11 rejects it explicitly for the hub).
- **One commit, two edits.** Predicate and relabel are separable in code but not in effect: either alone serves a wrong `robots` directive on real pages. Committed together so the revert is equally atomic.
- **A positive proof needs a label.** "Empty published static validates" looks like a hole. It is annotated as deliberate, with a pointer to `CONTENT_BAR_TYPES`, so the next reader finds the reasoning before the "fix".

## Deviations from Plan

None — plan executed exactly as written. Task 1's Zod-violation prediction, the 13-violation count and the four trial outcomes from research all held; no surprises surfaced.

## Issues Encountered

None. (Worth noting for later plans: the `web_fetch_vercel_url` MCP tool returns Vercel's "Deployment is building" placeholder page rather than an error while a build is in flight. The branch preview is publicly reachable, so plain `curl` is both cheaper and unambiguous for served-output probes — used for the checks below.)

## Preview Gate (Task 3)

| Item | Value |
|---|---|
| Deployment id | `dpl_vKZVs59qsEzB1aE39pJRBtBgaaoG` |
| Preview URL | https://tps-ventilatie-lywfqzi25-pushly-projects.vercel.app |
| Branch alias | https://tps-ventilatie-git-gsd-phase-8-indexatio-5b8213-pushly-projects.vercel.app |
| Commit | `1db9e97` |
| State | **READY** (build ~33s) |

All eight guards green in the build log ahead of `next build`. The three served-output observations D-10 exists to make:

1. **`sitemap.xml` → exactly 5 `<loc>`**, the same URLs as before this landing: `/`, `/tarieven`, `/projecten`, `/over-ons`, `/contact`.
2. **Home page → `<meta name="robots" content="index, follow">`**, zero occurrences of `noindex` in the served HTML. This is the specific failure the atomic commit was designed to prevent.
3. **`/privacy-beleid` → `<meta name="robots" content="noindex, follow">`.** The legal page stays out of the index now that it is excluded by data rather than by a code branch.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Ready for 08-03, the unlock.** The predicate now reads one field, so flipping 21 `review` nodes to `published` is a pure data change with no code edit — and the invariant from 08-01 will catch it if the sitemap and the robots directives disagree.
- The empty-hub rejection proved in (D) means the hub CANNOT publish until 08-04 authors real content. That is intentional load-bearing friction, not an obstacle to route around.
- Expected after 08-03: indexable 26, sitemap 26, with `/diensten` still `draft` — the floor constant and the 27th page land together in 08-04.

---
*Phase: 08-indexation-unlock*
*Completed: 2026-08-20*
