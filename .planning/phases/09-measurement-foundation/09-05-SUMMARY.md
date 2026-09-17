---
phase: 09-measurement-foundation
plan: 05
subsystem: infra
tags: [github-actions, cron, deployment_status, workflow_dispatch, gh-cli, alert-issue, ci]

# Dependency graph
requires:
  - phase: 09-measurement-foundation (09-02)
    provides: the GitHub secret GSC_SERVICE_ACCOUNT_JSON and the typed Search Console client
  - phase: 09-measurement-foundation (09-04)
    provides: scripts/measure-indexation.ts (exit 0/1/2, --simulate-breach / MEASURE_SIMULATE_BREACH) and docs/measurements/README.md
  - phase: 08-indexation-unlock
    provides: scripts/verify-indexation.ts (what we serve) and CANONICAL_ORIGIN
provides:
  - .github/workflows/measure-indexation.yml — Monday 06:17 UTC cron + manual dispatch (simulate_breach), bot-committed readings, one indexation-alert issue on red (D-21)
  - .github/workflows/verify-indexation.yml — post-deploy probe on every successful Production deployment_status (D-22/D-23)
  - GitHub label indexation-alert; proven runs: dispatch success (bot commit e410ca0), simulated failure (issue #2 opened and closed), two green deployment_status probe runs with the 27/27 line
  - docs/measurements/README.md § Automatisch (GitHub Actions)
  - main fast-forwarded to the phase branch (after merging origin/main, PR #1) and deployed READY
affects: [09-06, 10-migration, 13-close, every future production deployment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Least-privilege CI: explicit permissions per workflow (contents write only where the bot commits), pinned actions @v7, node 24, one secret, nothing echoed"
    - "Alert as a single labelled issue (create-or-comment) plus a red run; the simulated path is a first-class dispatch input"
    - "The post-deploy probe derives its target from lib/constants.ts at run time and never probes the unique *.vercel.app host"

key-files:
  created:
    - .github/workflows/measure-indexation.yml
    - .github/workflows/verify-indexation.yml
  modified:
    - docs/measurements/README.md
    - docs/measurements/gsc/2026-09-17.json

key-decisions:
  - "Local main had diverged (it still carried the phase-planning commits that only lived on the branch) — it was reset to origin/main (every commit was contained in the phase branch, verified with merge-base) and then fast-forwarded to the branch, which had merged origin/main (PR #1) in 33baec3"
  - "The bot re-ran today's reading (09-04 had already written 2026-09-17.json) and committed the refreshed file — accepted: readings are Google's answer at 'taken', and the weekly cadence makes same-day overlap a one-off"
  - "RESEARCH A3 is TRUE: the bot push rebuilt production (GitHub deployment 6499040467 for e410ca0) and that rebuild's deployment_status ran the probe — a free weekly build-health check, opt-out documented (ignoreCommand)"

patterns-established:
  - "Every automation was seen failing (simulated) and succeeding (real) before being called done — the D-21 contract"

requirements-completed: []

# Metrics
duration: ≈22min
completed: 2026-09-17
---

# Phase 9 Plan 05: Weekly cron + post-deploy probe as GitHub Actions, proven on real runs Summary

**The repository now measures itself: a Monday cron asks Google about all 27 URLs and commits the answer, every production deployment re-verifies what we serve, and both alert through one labelled issue — each path observed on a real run, red and green, before this summary was written.**

## Performance

- **Duration:** ≈22 min (2026-09-17T08:37Z → 08:54Z, plus the two watched runs)
- **Started:** 2026-09-17T08:37Z (main reset + fast-forward)
- **Completed:** 2026-09-17T08:54:12Z (README commit `656d2de`)
- **Tasks:** 3 completed
- **Files modified:** 4

## Accomplishments
- `main` fast-forwarded to the phase branch (`48293b8`) and pushed; Vercel built it READY in 37 s (`dpl_2GHxSsF93NeNdGuz8Y5HUEiSbWnp`). Label `indexation-alert` (#B60205) created.
- Both workflows committed on `main` (`ad1067f`); local check: `both workflows parse and carry pins/permissions` · `label exists`.
- **Dispatch run** https://github.com/Zlodziejczyk/tps-ventilatie/actions/runs/35201419623 → `success`: `indexed 27/27, sitemap submitted 27 (0 errors) … ✅ no flags`; the bot committed `e410ca0 chore(measure): weekly GSC indexation reading` (today's file refreshed) and that push triggered production deployment 6499040467.
- **Simulated run** https://github.com/Zlodziejczyk/tps-ventilatie/actions/runs/35201803874 → `failure` as designed: `FLAG [simulated-breach] … ✗ 1 flag(s)`; issue #2 `[SIMULATED] Indexation measurement flagged (2026-09-17)` created with the script output (contains `simulated-breach`), no reading committed; closed with "Simulated breach — alert path proven during Phase 9 (09-05)." Open alert issues afterwards: 0.
- **Post-deploy probe** ran on `deployment_status` for both production deployments after the workflow landed — https://github.com/Zlodziejczyk/tps-ventilatie/actions/runs/35201446529 (`ad1067f`) and https://github.com/Zlodziejczyk/tps-ventilatie/actions/runs/35201820354 (`e410ca0`) — each `success` with `✅ Indexation verified on https://www.tpsklimaattechniek.nl — 27/27 sitemap URLs, 27 direct 200s (no redirects), 27 free of any noindex directive, 27 self-canonical.` (production host, no platform-header note).
- README section `## Automatisch (GitHub Actions)` added (`656d2de`): cron in UTC + Dutch local time, the bot commit, the label, the 60-day rule and re-arm, key rotation, the accepted weekly rebuild with `ignoreCommand` as the opt-out, the post-deploy probe.

## Task Commits

1. **Task 1: merge to main, label, both workflows** — fast-forward (no new commit), `ad1067f` (ci)
2. **Task 2: dispatched + simulated runs, README section** — bot commit `e410ca0` (chore, by github-actions[bot]), `656d2de` (docs)
3. **Task 3: post-deploy probe proven** — no file change beyond the README sentence in `656d2de`

**Plan metadata:** see the `docs(09-05): complete …` commit that adds this summary.

## Verification outputs (verbatim)
- Task 1: `both workflows parse and carry pins/permissions` / `label exists`
- Task 2: `dispatched success + simulated failure + issue opened and closed + README section` / `bot has committed a reading`
- Task 3: `post-deploy probe ran green on a real Production deployment`

## Files Created/Modified
- `.github/workflows/measure-indexation.yml` — cron `17 6 * * 1`, `workflow_dispatch.inputs.simulate_breach`, `permissions: contents: write, issues: write`, `concurrency: measure-indexation`, bash step with `continue-on-error` + `tee`, bot identity `41898282+github-actions[bot]@users.noreply.github.com`, alert step (`gh issue list/comment/create --label indexation-alert`, then `exit 1`)
- `.github/workflows/verify-indexation.yml` — `on: deployment_status`, gate `state == 'success' && environment == 'Production'`, `permissions: contents: read, issues: write`, URL derived from `CANONICAL_ORIGIN` via `npx tsx -e`, 3 attempts / 30 s, alert on `failure()`
- `docs/measurements/README.md` — automation section
- `docs/measurements/gsc/2026-09-17.json` — refreshed by the bot (taken 08:49Z)

## Decisions Made
See key-decisions: main reset-then-fast-forward, the bot's same-day refresh accepted, A3 confirmed true.

## Deviations from Plan
1. **`git merge --ff-only` first failed** because local `main` was stale/diverged (it pointed at the phase-planning commit `48cd689`, which only origin's branch — not origin/main — contained). Resolution: verified `main` was an ancestor of the phase branch, `git reset --hard origin/main`, then the fast-forward succeeded (`48293b8`). No commit was lost.
2. **PR #1 on main** (opened by the Vercel CLI's analytics enable flow, merged by the owner) had to be merged into the phase branch (`33baec3`) before the fast-forward — a lockfile-only change (`libc` arrays removed).
3. The bot committed a reading even though today's file existed (the plan anticipated "commits nothing"): the script re-inspected and refreshed `taken`, so the diff was non-empty. Recorded; harmless.

## Issues Encountered
- Parsing `vercel ls --prod` text output for readiness was unreliable; the deployment state was confirmed via the Vercel MCP `get_deployment` (READY, `githubCommitSha` 48293b8) instead.

## User Setup Required
None — `gh` had the `workflow` scope; the secret existed from 09-02.

## Next Phase Readiness
- 09-06 can run; the runbook §6 gets the same automation summary.
- Note for the next Monday (2026-09-21 06:17 UTC): the first scheduled run; the 2026-09-17 reading is the "previous" one it will compare against.

## Self-Check: PASSED
- Files exist on `main`; commits `ad1067f`, `e410ca0`, `656d2de` are on origin/main; label present; issue #2 closed; run ids 35201419623 (success), 35201803874 (failure), 35201446529 + 35201820354 (probe, success).

---
*Phase: 09-measurement-foundation*
*Completed: 2026-09-17*
