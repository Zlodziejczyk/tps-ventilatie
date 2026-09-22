---
phase: 10-reversible-old-brand-migration
plan: 05
subsystem: seo
tags: [probe, ci, github-actions, curl, redirects, verification]

# Dependency graph
requires:
  - phase: 10-reversible-old-brand-migration
    provides: "10-03's LEGACY_REDIRECTS (the source list) and LEGACY_CUTOVER_DATE (the Mode B gate)"
  - phase: 09-measurement-foundation
    provides: "verify-indexation.ts and its deployment_status workflow — the shape this probe is a sibling of, and the job it joins"
provides:
  - "scripts/verify-redirects.ts — the only instrument that can see the trailing-slash ordering finding"
  - "Mode A (spoofed Host) for 10-07's pre-flight gate; Mode B + --post-cutover for 10-09's minutes-after-the-flip check"
  - "A post-deploy CI step that is green from merge and assertive from the declared cutover"
affects: [10-07, 10-09, 10-10]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "A precondition failure exits 2 and aborts on first occurrence — reporting a map failure when the map was never exercised is a false accusation against correct code"
    - "Gate a not-yet-meaningful CI step inside the script with a printed skip, never with a soft-failure window and never by leaving it expected-red"

key-files:
  created:
    - scripts/verify-redirects.ts
  modified:
    - .github/workflows/verify-indexation.yml
    - docs/seo-owner-runbook.md

key-decisions:
  - "Requests go through curl rather than Node fetch: fetch silently discards a Host header, so a spoofed-Host pre-flight built on it would be confidently green about the wrong hostname"
  - "DEPLOYMENT_NOT_FOUND and the 403 domain-fronting refusal are PreconditionFailure (exit 2), not violations (exit 1) — the map was never exercised"
  - "Mode B is gated in the script on LEGACY_CUTOVER_DATE, not in YAML; --post-cutover is the human override and CI never passes it"
  - "No scheduled HTTP watch added (D-19) — the drift class it would cover surfaces late via 10-06, which is late coverage, not equivalent coverage"

patterns-established:
  - "This repo's verifications assert the ABSENCE of tokens, and explanatory prose naturally wants to name the thing it forbids — it tripped three times in this session alone (a comment saying 'never -k', one naming the concurrent mapper, one naming the soft-failure YAML key). Describe the forbidden thing, never spell it."

requirements-completed: []

# Metrics
duration: 50 min
completed: 2026-09-22
---

# Phase 10 Plan 05: The Live One-Hop Probe Summary

**`scripts/verify-redirects.ts` — an exhaustive 20-check live probe that asserts exactly one 301 hop from both legacy hostnames, diagnoses the three non-map failures by name, and joins the post-deploy job green-from-merge by gating itself on the declared cutover rather than on a YAML escape hatch**

## Performance

- **Duration:** ~50 min
- **Completed:** 2026-09-22
- **Tasks:** 2
- **Files created:** 1 · **modified:** 2

## Accomplishments

- **The instrument that sees what a build cannot now exists.** `assert-redirects.ts` reasons about the array `next.config.ts` returns; it cannot see ordering as the edge applies it. If the trailing-slash rule runs first, every slashed legacy URL costs two hops with every build green and nothing in any log. The slash-less canary is the single assertion that proves that ordering is actually solved rather than described — and it is labelled in the output so nobody removes it.
- **It diagnoses rather than puzzles, proven on a real run.** Pointed at production it returned, correctly, that the legacy hostnames are not attached to the Vercel project yet and named **plan 10-07** as the fix. That is a diagnostic firing on a genuine condition, not a string sitting in a file.
- **It is green from the day it merges.** Mode B checks `LEGACY_CUTOVER_DATE` and prints an explicit three-line skip explaining what it would otherwise be probing and when it becomes real. No soft-failure window, no expected-red step.
- **One workflow, one alert.** The step appends to the same `probe-output.txt` and reuses the same `indexation-alert` issue; no second label, no alert sprawl.

## Task Commits

1. **Task 1: the probe** — `d3fa5e0` (feat)
2. **Task 2: workflow step + runbook §6** — `62b739f` (ci)

## Files Created/Modified

- `scripts/verify-redirects.ts` — Mode A (`--via`, spoofed `Host`), Mode B (direct, gated), `--post-cutover` override; 10 sources × 2 hostnames exhaustively, the canary, the two D-15 samples, the two expected-404 observations, and the recorded platform hop.
- `.github/workflows/verify-indexation.yml` — one step added to the existing `probe` job; header rewritten for three questions with the sibling rationale and the not-expected-red reasoning.
- `docs/seo-owner-runbook.md` — §6 Dutch paragraph on the second probe (including that a pre-cutover skip is normal *and good*), a failure-vocabulary row for `expected 301, got 308`, and a `Samenvatting` dependency bullet.

## Decisions Made

- **20 checks, not 18.** The plan said "9 sources × 2 hostnames = 18". The map has 10 entries (9 mapped pages + root — see 10-03), so exhaustiveness is 20. Derived from `LEGACY_REDIRECTS.length`, never hard-coded, so it tracks the map.
- **`--post-cutover` exists for exactly one moment** — the minutes after the flip in 10-09, before the date is committed. CI never passes it, so a human asserting "the cutover happened" stays a deliberate act rather than an automated assumption.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `DEPLOYMENT_NOT_FOUND` was reported as a map violation**

- **Found during:** Task 1, first live Mode A run against production
- **Issue:** the unattached-hostname case went into `violations` and exited **1**. The plan's own acceptance criterion requires exit **2** — and it is right: when the hostname is not attached, the request never reached a redirect rule, so the map was never exercised. Exiting 1 would be a false accusation against correct code.
- **Fix:** `PreconditionFailure` class, thrown for both environment signatures (404 `DEPLOYMENT_NOT_FOUND` and the 403 domain-fronting refusal), caught in `main().catch()`, printed once, exit 2.
- **Verification:** Mode A against production → exit **2**; Mode B skip → **0**; unknown argument → **2**.
- **Committed in:** `d3fa5e0`

**2. [Rule 1 - Bug] The same environment message printed 23 times**

- **Found during:** same run
- **Issue:** every source hit the same precondition, so the report buried its one useful sentence under 22 duplicates.
- **Fix:** preconditions abort on first occurrence.
- **Committed in:** `d3fa5e0`

---

**Total deviations:** 2 auto-fixed (2 bugs), both surfaced by running the probe for real rather than by reading it.
**Impact on plan:** None on scope. Both fixes were required by the plan's own acceptance criteria.

## Issues Encountered

- **The anti-drift grep trap fired three times in this session, twice in this plan.** The verifications assert that certain tokens are *absent*, and explanatory prose naturally wants to name the thing it is avoiding: a comment saying "never `-k` / `--insecure`", one saying "deliberately NOT `mapWithConcurrency`", and a workflow header saying "not with `continue-on-error`". Each tripped its own gate. All three now describe the forbidden thing without spelling it, and say so. This is the same lesson Phase 8 recorded four times — it recurs because the natural way to document a prohibition is to name it.

## User Setup Required

None.

## Next Phase Readiness

- **10-07 has its instrument.** Mode A is the pre-flight gate, and it already tells the operator exactly what is missing (both hostnames attached + the map in production). It will stay exit-2 until 10-07 does that work — which is the correct, informative state.
- **10-09 has its instrument.** `--post-cutover` forces the assertion in the minutes after the flip; the CI step becomes automatic once 10-09 sets `LEGACY_CUTOVER_DATE`.
- **Mode A cannot go green before 10-07** by construction. That is not a defect to chase.
- **D-19 recorded:** no scheduled HTTP watch was added. The drift class it would have covered — a redirect silently breaking between deploys — surfaces through 10-06's weekly GSC legacy section instead, which is **late coverage, not equivalent coverage**. Worth revisiting if the legacy domain matters longer than expected.

---
*Phase: 10-reversible-old-brand-migration*
*Completed: 2026-09-22*

## Self-Check: PASSED

- Usage path → exit 2; bare Mode B → prints a skip naming the cutover gate and exits 0; Mode A against production → exit 2 with the DEPLOYMENT_NOT_FOUND diagnosis naming 10-07. All three observed, not inferred.
- Source-shape gate green: derives from `LEGACY_REDIRECTS`, gates on `LEGACY_CUTOVER_DATE`, shells out to curl, no insecure flag, no concurrent mapper, records the 308, labels the canary, carries `--post-cutover`, diagnoses both Vercel signatures by name.
- Workflow parses via `js-yaml`; 6 steps; `checkout@v7`, `setup-node@v7`, `node-version: 24`, `deployment_status` + `Production` gate all intact; one alert label; no soft-failure key.
- Runbook contains `verify-redirects` and the `308` vocabulary row.
