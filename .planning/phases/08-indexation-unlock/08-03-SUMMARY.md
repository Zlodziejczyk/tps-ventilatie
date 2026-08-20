---
phase: 08-indexation-unlock
plan: 03
subsystem: seo
tags: [seo, indexation, taxonomy, sitemap, publishing]

requires:
  - phase: 08-indexation-unlock
    provides: "08-01's relational gate (which the old snapshot gate would have blocked) and 08-02's single-lever predicate"
  - phase: 04-content-fill-editorial-gate
    provides: "the owner-approved copy on all 21 service pages, already clearing the anti-thin-content bar at review status"
provides:
  - "21 service pages published — sitemap 5 -> 26"
  - "Named per-pillar and per-sub-service indexability assertions with a >=17 floor"
  - "A durable editorial approval record in the flip commit"
affects: [08-04, 08-05, phase-09-measurement, phase-10-migration, phase-12-on-page-depth]

tech-stack:
  added: []
  patterns:
    - "Structural assertions by name alongside counts — growth in one place must not mask a page going dark in another"
    - "Assert the traversal itself (pillars().length === 4) so per-item loops cannot pass vacuously"
    - "Keep a publishing flip a PURE status edit, enforced by diffing the change set, so its diff is trivially reviewable and revertible"

key-files:
  created: []
  modified:
    - lib/services/airconditioning.ts
    - lib/services/warmtepompen.ts
    - lib/services/wtw.ts
    - lib/services/mechanische-ventilatie.ts
    - scripts/assert-seo.ts

key-decisions:
  - "The flip commit message names all 21 pages and cites the 2026-08-05 owner sign-off — it IS the editorial approval record (P4 D-08)"
  - "Pure status edit, verified by a diff assertion: no copy, metadata or keyword changes smuggled in (those are Phase 12's data-driven pass, D-14)"
  - "Sub-service assertions use a >=17 floor rather than an equality so adding a page never requires a gate edit (D-02)"
  - "The hub-is-non-indexable assertion is marked INVERT IN 08-04 rather than left implicit"

patterns-established:
  - "Every structural guard added in this phase ships with a negative proof executed during the plan"

requirements-completed: [IDX-02]

duration: 18 min
completed: 2026-08-20
---

# Phase 8 Plan 03: The Indexation Unlock Summary

**All 21 finished, owner-approved service pages flipped from `review` to `published` — sitemap 5 → 26, every pillar and sub-service now serving `index, follow` — with named per-page assertions so a pillar can never go dark quietly again.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-08-20T12:25:00Z
- **Completed:** 2026-08-20T12:43:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 5

## Accomplishments

- **The milestone's headline blocker is cleared.** 21 pages that had been built, filled with owner-approved copy, and then served `noindex` to every crawler are now indexable. This is the requirement every other phase in v1.1 stacks behind.
- **The flip took one line of thought and 21 characters of change** — because the two landings before it did the work. `pageSchema` has held `review` nodes to the same content bar as `published` since Phase 4, so all 21 had already cleared it; 08-01 removed the gate that would have blocked its own fix; 08-02 made `status` the only lever. Nothing needed authoring, patching or re-approving.
- **"A pillar went dark" is now a build failure that names the page.** Previously it was a discovery you might make months later — which is exactly the history of these 21 pages.
- **Verified on served HTML, not just data:** 26 sitemap URLs covering all 4 pillars and all 17 sub-services, 8 sampled service pages all returning `index, follow` with zero `noindex` occurrences.

## Task Commits

1. **Task 1: Flip the 21 service nodes** — `d45a0b5` (feat — carries the approval record)
2. **Task 2: Named structural assertions** — `2038367` (test)
3. **Task 3: Preview gate** — no code commit; verification recorded below

## Files Created/Modified

- `lib/services/airconditioning.ts` — 5 nodes → `published` (pillar + installatie, onderhoud, reparatie-storing, advies)
- `lib/services/warmtepompen.ts` — 5 nodes → `published` (pillar + installatie, onderhoud, reparatie-storing, advies)
- `lib/services/wtw.ts` — 6 nodes → `published` (pillar + vervangen, onderhoud-reinigen, inregelen, storing, aanleggen)
- `lib/services/mechanische-ventilatie.ts` — 5 nodes → `published` (pillar + vervangen, onderhoud-reinigen, storing, aanleggen)
- `scripts/assert-seo.ts` — per-pillar and per-sub-service indexability assertions by name, a `pillars().length === 4` non-vacuity check, a `>= 17` sub-service floor, and the hub-still-draft assertion marked for inversion in 08-04

## Decisions Made

- **The commit message is the artifact.** Under the Phase-4 three-state flow the status flip *is* the approval record, so the message enumerates all 21 published pages and cites the 2026-08-05 sign-off. A reviewer asking "who approved publishing this page and when" gets the answer from `git log`.
- **Enforce purity rather than trust it.** A diff assertion confirms only `status:` lines changed inside `lib/services/`. Copy drift smuggled into this commit would be invisible to every other gate, and it would also break the claim that the published copy is the copy Thomas approved.
- **Floors for the things that grow, equalities for the things that don't.** 4 pillars is a fixed IA fact; 17 sub-services is a current count. Asserting the second as an equality would make adding a page require a gate edit — the habit this phase is removing.

## Deviations from Plan

None — plan executed exactly as written. The 21-node count, the per-file distribution (5/5/6/5), and the prediction that a full-flip clone already validates all held exactly.

## Issues Encountered

- The Vercel **branch alias** (`...git-gsd-phase-8-indexatio-5b8213...`) kept serving the previous deployment's 5-URL sitemap for several minutes after the new deployment reached READY. The per-deployment URL served the correct 26 immediately. Verification used the per-deployment URL; worth knowing for 08-05's probe, which should be pointed at a specific deployment URL rather than the branch alias to avoid reading stale output.

## Preview Gate (Task 3)

| Item | Value |
|---|---|
| Deployment id | `dpl_H9y9qruKnD31TH9VWRXvP4voRrzJ` |
| Preview URL | https://tps-ventilatie-6a0sgvuqw-pushly-projects.vercel.app |
| Commit | `2038367` |
| State | **READY** (build 24s) |

- **`sitemap.xml` → exactly 26 `<loc>`**, verified programmatically to contain all 4 pillar URLs and all 17 sub-service URLs (no sampling — the full set was checked against the registry).
- **8 sampled service URLs** (2 per pillar: each pillar plus one sub-service) → all HTTP 200, all `<meta name="robots" content="index, follow">`, zero occurrences of `noindex` in the served HTML.
- **`/diensten` → `<meta name="robots" content="noindex, follow">`** — the single remaining `noindex` on the service surface, as designed; it publishes in 08-04.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Ready for 08-04**, the last landing: author the `/diensten` hub, render every word of it, publish it, and land `INDEXABLE_FLOOR = 27` in the same commit that makes 27 true.
- The hub is now the only page on the service surface serving `noindex`, and the empty-hub Zod rejection (08-02 proof D) blocks publishing it until its content exists — the friction is doing its job.
- Nothing here needs owner action: the published copy is byte-identical to what was signed off on 2026-08-05.

---
*Phase: 08-indexation-unlock*
*Completed: 2026-08-20*
