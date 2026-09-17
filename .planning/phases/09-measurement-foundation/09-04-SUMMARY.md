---
phase: 09-measurement-foundation
plan: 04
subsystem: measurement
tags: [url-inspection, thresholds, weekly-reading, cli, exit-codes, simulated-breach]

# Dependency graph
requires:
  - phase: 09-measurement-foundation (09-02)
    provides: scripts/gsc/auth.ts getAccessToken(), scripts/gsc/api.ts inspectUrl()/getSitemap(), the service-account key
  - phase: 08-indexation-unlock
    provides: sitemapEntries() and INDEXABLE_FLOOR = 27 (the URL list is never hand-maintained, D-19)
provides:
  - scripts/gsc/thresholds.ts — pure evaluator: RAMP_ANCHOR 2026-09-16, RAMP ≥10/≥20/≥25 at weeks 2/4/8, flags count-vs-floor, below-ramp, lost-indexation, robots-not-allowed, canonical-mismatch, simulated-breach
  - scripts/measure-indexation.ts — the weekly CLI (27 per-URL inspections + sitemap count → dated JSON → flags → exit 0/1/2; --simulate-breach / MEASURE_SIMULATE_BREACH)
  - docs/measurements/README.md — flag vocabulary, ramp table, two-probes rule, never-lower rule (Dutch)
  - docs/measurements/gsc/2026-09-17.json — the first real reading: 27/27 PASS "Submitted and indexed", sitemap 27 / 0 errors
affects: [09-05, 09-06, 10-migration, 13-close]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Thresholds are pure and derived (no clock, no I/O); the CLI injects today's date — so the ramp can be proven on fabricated readings (observed failing before the first real run)"
    - "Readings are append-only dated files; the previous reading is the newest file before today; a threshold is never lowered to get green"

key-files:
  created:
    - scripts/gsc/thresholds.ts
    - scripts/measure-indexation.ts
    - docs/measurements/README.md
    - docs/measurements/gsc/2026-09-17.json
  modified: []

key-decisions:
  - "The ramp is anchored on 2026-09-16 (the day both Domain properties were verified) — rungs fall on 2026-09-30, 2026-10-14 and 2026-11-11; before week 2 no rung is in force, and the first reading says so explicitly"
  - "robots-not-allowed only flags when Google reports a lastCrawlTime (an uncrawled URL has no robots verdict yet); lost-indexation compares against the previous reading, so the very first reading can only flag the floor and the ramp"

patterns-established:
  - "Proof of the alert path: --simulate-breach adds a labelled [SIMULATED] flag and exits 1 without pretending anything is wrong — 09-05 wires this into the workflow dispatch input"

requirements-completed: [MEAS-05]

# Metrics
duration: ≈25min active (code 2026-09-16 20:52Z; first reading 2026-09-17 08:28Z after the key arrived)
completed: 2026-09-17
---

# Phase 9 Plan 04: Weekly indexation measurement with proven thresholds and the first real reading Summary

**Google's per-URL verdict on all 27 sitemap URLs is now a committed, dated reading interpreted by thresholds that were seen failing on fabricated data before they ever saw real data: 27/27 "Submitted and indexed", no flags.**

## Performance

- **Duration:** ≈25 min active (thresholds + CLI written and shape-verified on 2026-09-16; the API-backed runs waited for the 09-02 key)
- **Started:** 2026-09-16T20:52:56Z (`5ba6a2b`)
- **Completed:** 2026-09-17T08:32:29Z (`d85a4a6`)
- **Tasks:** 2 completed
- **Files modified:** 4

## Accomplishments
- `scripts/gsc/thresholds.ts` proven to bite: `thresholds proven: below-ramp, lost-indexation, clean, robots (crawled/uncrawled), canonical` and `thresholds purity OK`.
- `scripts/measure-indexation.ts` + `docs/measurements/README.md`: `measure script + README shape OK`; URL list from `sitemapEntries()` compared to `INDEXABLE_FLOOR`; sequential inspections 150 ms apart; never prints token material.
- Simulated breach exercised first (exit 1):
  ```
  FLAG [simulated-breach] — [SIMULATED] breach requested via --simulate-breach / MEASURE_SIMULATE_BREACH on 2026-09-17 — this proves the alert path, nothing is wrong
  indexed 27/27, sitemap submitted 27 (0 errors), previous reading: none, ramp rung in force: none yet (before week 2)
  ✗ 1 flag(s) — see docs/measurements/README.md for what each code means.
  simulated breach exits 1 as designed
  ```
- First real reading (exit 0):
  ```
  indexed 27/27, sitemap submitted 27 (0 errors), previous reading: none, ramp rung in force: none yet (before week 2)
  ✅ no flags
  first reading OK: 2026-09-17.json — 27/27 PASS
  ```
  Every URL: verdict PASS, coverageState "Submitted and indexed", Google canonical = ours; lastCrawlTime between 2026-08-23 and 2026-09-17 (the home page crawled 2026-09-16T23:04Z, minutes after the production rebuild).

## Task Commits

1. **Task 1: thresholds** — `5ba6a2b` (feat)
2. **Task 2: measure CLI + README + first reading** — `a1da213` (feat), `d85a4a6` (docs: reading)

**Plan metadata:** see the `docs(09-04): complete …` commit that adds this summary.

## Files Created/Modified
- `scripts/gsc/thresholds.ts` — `RAMP_ANCHOR`, `RAMP`, `isIndexed`, `weeksSince`, `rungInForce`, `evaluateReading(prev, curr, todayIso)`
- `scripts/measure-indexation.ts` — flags `--out` (default `docs/measurements/gsc`), `--property`, `--simulate-breach`; writes `<out>/<YYYY-MM-DD>.json` with `taken, property, floor, sitemap, urls`
- `docs/measurements/README.md` — Dutch: flag table, ramp table, the two-scripts distinction (D-23), never-lower rule; 09-05 appends the automation section
- `docs/measurements/gsc/2026-09-17.json` — the reading (18 KB)

## Decisions Made
None beyond the plan — ramp anchor and flag semantics as specified in D-19/D-20/D-21.

## Deviations from Plan
None — plan executed exactly as written (the wave-2 runs were executed as soon as the 09-02 key existed, interleaved with the 09-02/09-03 summaries; every gate of both plans was still performed).

## Issues Encountered
None. The simulated run and the real run each took ≈45 s for 27 inspections.

## User Setup Required
None (the key from 09-02 is the only credential).

## Next Phase Readiness
- 09-05 wires this CLI into the Monday 06:17 UTC cron with the `simulate_breach` dispatch input; the bot commits readings to `docs/measurements/gsc/`.
- The next rung (≥ 10 indexed) applies from 2026-09-30; today's 27/27 already clears every rung.

## Self-Check: PASSED
- 4 files exist; commits `5ba6a2b`, `a1da213`, `d85a4a6` are on the branch and pushed.
- Re-runnable: `npx tsx scripts/measure-indexation.ts --simulate-breach` → exit 1; `npx tsx scripts/measure-indexation.ts` → exit 0 (writes/overwrites today's file).

---
*Phase: 09-measurement-foundation*
*Completed: 2026-09-17*
