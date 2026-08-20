---
phase: 08-indexation-unlock
plan: 01
subsystem: infra
tags: [seo, build-gate, zod, tsx, node-assert, invariants, vercel]

requires:
  - phase: 03-seo-foundation
    provides: lib/seo/policy.ts isIndexable/sitemapEntries — the single-source indexing policy this invariant now guards
  - phase: 01-taxonomy-foundation
    provides: pagesSchema + the prebuild lifecycle hook the guard chain attaches to
provides:
  - lib/seo/invariants.ts — a pure, injectable, re-runnable indexation invariant checker
  - lib/seo/policy.ts indexableSurface() — the governed-collection extension point (D-05)
  - scripts/assert-metadata-seam.ts — source-level guard that buildMetadata is the only robots-directive seam
  - Eight build-blocking guards chained in package.json prebuild
  - Perturbation proofs P1-P5 demonstrating the invariant actually fails when the world breaks
affects: [08-02, 08-03, 08-04, 08-05, phase-12-kennisbank, phase-10-migration]

tech-stack:
  added: []
  patterns:
    - "Relational build gates: assert sitemap membership ⇔ isIndexable(node) and named floors, never exact lists or counts"
    - "Pure violation-returning checkers instead of module-top-level asserts, so a gate can be run against perturbed data and proven to bite"
    - "Predicate/content-addressed perturbations — never array-index-addressed"
    - "Source-level seam guard with comment stripping for rules a data-level invariant is structurally blind to"

key-files:
  created:
    - lib/seo/invariants.ts
    - scripts/assert-metadata-seam.ts
  modified:
    - lib/seo/policy.ts
    - scripts/assert-seo.ts
    - scripts/assert-gate-blocks.ts
    - scripts/assert-registry.ts
    - scripts/assert-site-shape.ts
    - scripts/assert-no-forbidden-claims.ts
    - scripts/validate-taxonomy.ts
    - scripts/check-radius-literals.sh
    - package.json

key-decisions:
  - "The invariant lives in lib/seo/invariants.ts as a pure function returning IndexationViolation[] — it never throws, so the same logic runs on real data and on perturbed clones (D-03)"
  - "checkIndexationInvariants() defaults to indexableSurface()/sitemapEntries() and never names the registry array, so Phase 12's kennisbank inherits the gate for free (D-05)"
  - "No INDEXABLE_FLOOR constant in this landing — the floor lands with the flip that satisfies it (D-09), keeping every commit green"
  - "assert-registry's brand assertions were rewritten to the helper's derivation contract rather than to today's brand lists — a second decayed snapshot found during execution"
  - "The seam guard is regex-based with comment stripping and is explicitly documented as discretionary (D-04 permits dropping it if it becomes fragile)"

patterns-established:
  - "Anti-bump failure messages: every floor states its derivation and forbids editing the number to make the build pass (D-06)"
  - "Every perturbation proof asserts a SPECIFIC violation code — a wrong-reason pass is how the previous gate rotted"
  - "Guard header comments must describe the wiring that actually exists; stale 'run on demand' notes are the same failure mode as stale assertions"

requirements-completed: [IDX-01]

duration: 41 min
completed: 2026-08-20
---

# Phase 8 Plan 01: Relational Build Gate Summary

**The snapshot gate that enforced the indexation bug is now a pure relational invariant (sitemap membership ⇔ isIndexable per node), proven to bite by five perturbation tests, with a buildMetadata seam guard and all eight guards build-blocking on Vercel.**

## Performance

- **Duration:** 41 min
- **Started:** 2026-08-20T11:20:00Z
- **Completed:** 2026-08-20T12:01:00Z
- **Tasks:** 8 (7 auto + 1 checkpoint)
- **Files modified:** 11 (2 created, 9 modified)

## Accomplishments

- `scripts/assert-seo.ts` no longer asserts *what is* (a fixed five-URL list, an exact entry count, a pair of noindex-by-name checks). It asserts a relationship that is equally true at 5 indexable pages and at 27 — so it can no longer block its own fix, which is precisely what it did before.
- The invariant is extractable, injectable and re-runnable: `checkIndexationInvariants()` returns a violation list rather than throwing, which is the property that lets `assert-gate-blocks.ts` feed it broken data and prove it fails. Six violation codes, all reachable and all exercised.
- **Two guards that were silently RED are green again** — and both were repaired by replacing the snapshot, not by editing the expected number.
- **A third decayed snapshot was found during execution** (see Deviations): `assert-registry.ts` assertion (9) required WTW and MV to carry no brands, which stopped being true on 2026-07-02/03.
- `buildMetadata()` is now enforced as the only source of a per-page robots directive — the one bypass the data-level invariant is structurally blind to.
- All eight guards run in `prebuild`, verified executing inside a real Vercel build on a clean checkout.

## Task Commits

1. **Task 1: Branch + expose the governed collection** — `0a38f78` (feat)
2. **Task 2: Pure invariant checker (lib/seo/invariants.ts)** — `75681df` (feat)
3. **Task 3: Rewrite assert-seo onto the invariant** — `48d7d79` (refactor)
4. **Task 4: Repair + extend assert-gate-blocks (P1–P5)** — `cdb539b` (fix)
5. **Task 5: Repair assert-registry (composition + floor)** — `245c96f` (fix)
6. **Task 6: Metadata seam guard (D-04)** — `a3c74af` (feat)
7. **Task 7: Wire all guards into prebuild + widen radius scan** — `c4fdca1` (build)
8. **Task 8: Preview gate** — no code commit; verification recorded below

## Files Created/Modified

- `lib/seo/invariants.ts` *(new)* — `checkIndexationInvariants()` + `IndexationViolation`; six checks (`sitemap-without-index`, `index-without-sitemap`, `orphan-entry`, `non-absolute-entry`, `below-floor`, `duplicate-entry`), accumulating, never throwing
- `scripts/assert-metadata-seam.ts` *(new)* — walks `app/`, strips comments, forbids a literal robots key / noindex outside `app/robots.ts`, requires every `page.tsx` to import `buildMetadata`
- `lib/seo/policy.ts` — adds `indexableSurface()`; `sitemapEntries()` now derives from it
- `scripts/assert-seo.ts` — indexation section replaced by one invariant call that prints every violation; JSON-LD / canonical / faq assertions preserved; `privacy-beleid` safety belt kept by name
- `scripts/assert-gate-blocks.ts` — perturbations made predicate/content-addressed; P1–P5 invariant proofs added, each asserting its expected code
- `scripts/assert-registry.ts` — type composition + `MIN_ROUTABLE_PAGES` floor replace the hardcoded count; brand assertions rewritten to the derivation contract
- `scripts/check-radius-literals.sh` — scan widened to `app components lib` (not `scripts/`)
- `package.json` — `prebuild` chains all eight guards with `&&`
- `scripts/{assert-site-shape,assert-no-forbidden-claims,validate-taxonomy}.ts` — header comments corrected to describe the wiring that now exists

## Decisions Made

- **Green at 5, correct at 27.** No floor constant in this landing (D-09) — the relational core is state-independent, so the whole plan lands without a red intermediate build.
- **Repair by re-shaping, not re-numbering.** Both red guards (and the third found mid-execution) were fixed by replacing the snapshot with a relationship or a floor. Bumping the expected value is the exact move (`82d897b`) this phase exists to make impossible; doing it again while fixing it would have been self-defeating.
- **Anti-drift grep tokens kept out of comments.** Two verification greps false-positived on descriptive comments that quoted the removed assertions verbatim. Reworded rather than weakening the greps — the greps are the contract.
- **Seam guard documented as discretionary.** Regex comment-stripping is approximate; the header says so, and D-04 permits dropping the guard if it ever becomes fragile maintenance.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] A third decayed snapshot in `assert-registry.ts` (assertion 9)**
- **Found during:** Task 5 — repairing the page count let execution reach assertion (9) for the first time in weeks
- **Issue:** `brandsForPillar` was asserted against four hardcoded brand lists, including `wtw` and `mechanische-ventilatie` "must carry no brands". The owner confirmed Zehnder / Duco / Itho Daalderop on 2026-07-02/03, so WTW now returns 3 brands and MV returns 2. The script exited 1. The plan explicitly assumed assertions (2)–(14) were relational and passing — they were not.
- **Fix:** Rewrote (9) as the helper's actual contract — for every pillar, `brandsForPillar(slug)` equals the de-duplicated, order-stable union of its children's `brandIds`, and every returned id resolves in `BRANDS` — plus a non-vacuity check so an always-empty helper cannot satisfy it. Deliberately did NOT edit the four lists to today's brands, which would have re-armed the identical trap.
- **Files modified:** `scripts/assert-registry.ts`
- **Verification:** `npx tsx scripts/assert-registry.ts` exits 0; the assertion now tracks the data instead of a moment in time
- **Committed in:** `245c96f` (Task 5 commit)

**2. [Rule 2 — Missing critical] Two more guard headers claimed a wiring that does not match reality**
- **Found during:** Task 7 — the plan named four files to correct; a repo-wide grep found two more
- **Issue:** `assert-no-forbidden-claims.ts` said "Run on demand" while it had been in `prebuild` all along, and `validate-taxonomy.ts` described a `prebuild` containing only itself. Both are the documentation drift the plan explicitly targets.
- **Fix:** Corrected both headers to describe the eight-guard chain
- **Files modified:** `scripts/assert-no-forbidden-claims.ts`, `scripts/validate-taxonomy.ts`
- **Verification:** `grep -rn "Run on demand\|NOT wired" scripts/` returns nothing
- **Committed in:** `c4fdca1` (Task 7 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both are in-scope repairs of exactly the failure class IDX-01 exists to eliminate. No scope creep — no behavior, route, or content changed.

## Issues Encountered

- **Verification greps false-positived on descriptive comments** (twice: `assert-seo.ts` quoting the removed count assertion, `assert-gate-blocks.ts` quoting the old index-addressed perturbation). Resolved by rewording the comments so the literal tokens do not appear — the documented pattern for this repo. Noted inline in `assert-seo.ts` so a future editor does not reintroduce them.
- **No local `next build` / `tsc --noEmit`** — deadlocks on the OneDrive mount. Type-checking was proven on Vercel instead: the preview build ran `Finished TypeScript in 5.7s` and generated 36 static pages.

## Preview Gate (Task 8)

| Item | Value |
|---|---|
| Branch | `gsd/phase-8-indexation-unlock` (pushed to origin) |
| Deployment id | `dpl_3xReRK2Tx8ZtbiqJZyUVmzdTDAQP` |
| Preview URL | https://tps-ventilatie-7mh92ng3c-pushly-projects.vercel.app |
| Branch alias | https://tps-ventilatie-git-gsd-phase-8-indexatio-5b8213-pushly-projects.vercel.app |
| Commit | `c4fdca1` |
| State | **READY** (build 24s) |

All eight guard success lines appear in the build log ahead of the `next build` output — taxonomy, registry, site-shape, forbidden-claims, gate-blocks, metadata-seam, seo, radius. The preview `sitemap.xml` serves exactly 5 URLs (`/`, `/tarieven`, `/projecten`, `/over-ons`, `/contact`), unchanged: this landing moves no page's indexability.

Checkpoint cleared autonomously — `workflow.human_verify_mode` is `end-of-phase`, every acceptance criterion was verifiable programmatically, and all four passed. Nothing was left for a human to do.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Ready for 08-02.** The gate is proven before it guards anything (D-09), so the predicate unification can land against a harness that will actually catch it if it goes wrong.
- `checkIndexationInvariants()` accepts a `floor` but no constant exists yet — `INDEXABLE_FLOOR` lands in 08-04 with the flip that satisfies it (D-09/D-25).
- 08-02 must keep `npm run prebuild` green through the riskiest single edit in the phase: unifying `isIndexable()` while relabelling the statics, which momentarily changes what every static page's robots directive says.

---
*Phase: 08-indexation-unlock*
*Completed: 2026-08-20*
