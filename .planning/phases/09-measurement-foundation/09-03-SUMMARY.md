---
phase: 09-measurement-foundation
plan: 03
subsystem: measurement
tags: [search-console, ownership, url-prefix, vercel-analytics, speed-insights, verification-meta, probe]

# Dependency graph
requires:
  - phase: 08-indexation-unlock
    provides: INDEXABLE_FLOOR = 27 and app/layout.tsx wiring of <Analytics />, <SpeedInsights /> and verification.google from NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  - phase: 09-measurement-foundation (09-01)
    provides: both Domain properties verified on 2026-09-16, baseline manifest with the ⬜ 09-03 row
provides:
  - Five Search Console properties, all verified: sc-domain:tpsklimaattechniek.nl, sc-domain:tpsventilatie.nl, https://www.tpsklimaattechniek.nl/ (DNS-inherited AND HTML tag), https://tpsventilatie.nl/ and https://www.tpsventilatie.nl/ (DNS-inherited)
  - Thomas (tpsventilatie@gmail.com) delegated Owner on all five; the service account Full on both Domain properties
  - Production serves exactly one google-site-verification meta tag (env NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, Production)
  - Vercel Web Analytics enabled (2026-09-16T22:18:46Z) and REPORTING (browser beacon 200 + REST count 2 visitors / 5 pageviews); Speed Insights collecting since 2026-08-23
  - scripts/verify-measurement.ts — the committed D-04 measurement-surface probe, green against production
  - Evidence: gsc/legacy-url-prefix-status.md, gsc/users-and-permissions.md, gsc/url-inspection-diensten.png, gsc/ownership-verification-www-tpsklimaattechniek.png, vercel/web-analytics-enabled.json, vercel/speed-insights-enabled.txt, vercel/insights-view-request.md
affects: [09-05, 09-06, 10-migration, 11-gbp-citations, 13-close]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Two probes, two questions (D-23): verify-indexation.ts = what we serve; verify-measurement.ts = the measurement surface (TXT on both zones, meta tag once in <head>, sitemap floor, analytics endpoints, token-gated visits count reported SKIPPED when absent)"
    - "Analytics 'enabled' is never claimed from script.js 200; the proof is the browser beacon (POST …/view 200) plus an API count"

key-files:
  created:
    - scripts/verify-measurement.ts
    - docs/baseline/2026-09-16/gsc/legacy-url-prefix-status.md
    - docs/baseline/2026-09-16/gsc/users-and-permissions.md
    - docs/baseline/2026-09-16/gsc/url-inspection-diensten.png
    - docs/baseline/2026-09-16/gsc/ownership-verification-www-tpsklimaattechniek.png
    - docs/baseline/2026-09-16/gsc/users-tpsklimaattechniek.nl-2026-09-16T211723Z.jpg
    - docs/baseline/2026-09-16/gsc/users-tpsventilatie.nl-2026-09-16T211859Z.jpg
    - docs/baseline/2026-09-16/gsc/users-www.tpsventilatie.nl-2026-09-16T212913Z.jpg
    - docs/baseline/2026-09-16/vercel/web-analytics-enabled.json
    - docs/baseline/2026-09-16/vercel/speed-insights-enabled.txt
    - docs/baseline/2026-09-16/vercel/insights-view-request.md
  modified:
    - docs/baseline/2026-09-16/README.md

key-decisions:
  - "Evidence for 'analytics enabled' is API/CLI output (web-analytics-enabled.json, speed-insights-enabled.txt) instead of the planned dashboard PNGs — the owner chose the CLI route and skipped the vercel.com browser login; the Task 2 verify was run with the file names adapted accordingly"
  - "The verification token is Google's account-level token (identical to the DNS TXT value) — public by design, set as a Production env var, never treated as a secret"
  - "Production was rebuilt by a git deployment of main @ 56d239c (the CLI's enable flow opened PR #1 'Add Vercel Web Analytics integration', a lockfile-only change the owner merged) — not by a dashboard redeploy; it happened AFTER enabling and after the env var, which is what matters"

patterns-established:
  - "Property inheritance (RESEARCH A1) holds: every URL-prefix property under a verified Domain property is 'Ownership auto verified — Domain name provider'; no HTML file / GA / GTM method was attempted on the legacy host"
  - "Beacon paths are project-unique (/2fd128cc8fe7c492/view, /9b5146f14b1d5ad9/vitals) — filter network logs on the script path ids, not on /_vercel/"

requirements-completed: [MEAS-01, MEAS-02, MEAS-06]

# Metrics
duration: ≈75min active (wall clock 2026-09-16T20:52Z → 2026-09-17T08:24Z, owner-blocked in between)
completed: 2026-09-17
---

# Phase 9 Plan 03: Fifth property through the meta-tag seam, legacy URL-prefix coverage, delegated ownership, Vercel Analytics proven reporting Summary

**The seam that "looked live" is now provably live — production serves the verification tag, Google verified it through the tag, Thomas owns every property, and Vercel Analytics is counting real page views — and `scripts/verify-measurement.ts` re-proves the measurement surface on every run.**

## Performance

- **Duration:** ≈75 min active; wall clock 2026-09-16T20:52Z → 2026-09-17T08:24Z (two owner gates: the vercel.com / CLI login and the interactive analytics enable)
- **Started:** 2026-09-16T20:52:56Z (`abe8cf5`)
- **Completed:** 2026-09-17T08:24:52Z (vitals note in `ffbdb2c`; main evidence commit `6c2fdcd` at 08:09:18Z)
- **Tasks:** 3 completed
- **Files modified:** 12

## Accomplishments
- Search Console: `https://www.tpsklimaattechniek.nl/`, `https://tpsventilatie.nl/` and `https://www.tpsventilatie.nl/` created — all three **"Ownership auto verified — Domain name provider"** (inherited). The legacy window was confirmed open at execution time (apex `HTTP/2 200` from WordPress, TXT `google-site-verification=DvCn…` present at dd24). Nothing removed (D-07).
- Delegation (D-02): `tpsventilatie@gmail.com` (confirmed by the owner; the plan's assumed `tpsservices001@gmail.com` was never used) added as **Owner** on all five properties without rejection; `gsc-measure@…` **Full** on both Domain properties.
- D-11 evidence: `/diensten` → "URL is on Google", page indexed, HTTPS, breadcrumbs 1 valid, review snippets 1 valid.
- Vercel: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` set on Production via `vercel env add`; Web Analytics enabled by the owner (`vercel project web-analytics enable`, enabledAt 2026-09-16T22:18:46Z); production rebuilt at 22:24:48Z from `main` @ 56d239c; `curl` shows exactly one `<meta name="google-site-verification" content="eXe-…">`; GSC HTML-tag **Successfully verified** (now two methods on the fifth property).
- Reporting proven (MEAS-06): browser `POST /2fd128cc8fe7c492/view → 200` on two pages; REST `web-analytics/visits/count` for 2026-09-16..18 = `{ visitors: 2, pageviews: 5 }`. Speed Insights: `vercel metrics vercel.speed_insights.lcp_ms` returns production samples (p75 avg 1.18 s), `dataReceivedAt` 2026-08-23 — it was already on.
- `scripts/verify-measurement.ts` committed and green against production.

## Task Commits

1. **Task 1: properties, delegation, D-11** — `ba71b17` (docs)
2. **Task 2: Vercel enable, env var, redeploy, HTML-tag verification, beacon evidence** — `6c2fdcd` (docs); vitals-503 note in `ffbdb2c`
3. **Task 3: scripts/verify-measurement.ts** — `abe8cf5` (feat)

**Plan metadata:** see the `docs(09-03): complete …` commit that adds this summary.

## Verification outputs (verbatim)

Task 1: `GSC property/delegation records OK (legacy still 200 + TXT present)`

Task 2 (adapted file names, see Deviations): `meta tag served once, analytics enabled (enabledAt 2026-09-16T22:18:46.364Z) + beacon evidence recorded`

Task 3:
```
probe shape OK
usage guard OK
note: Vercel visits count SKIPPED (set VERCEL_TOKEN for the machine proof) — analytics "reporting" was evidenced via MCP/browser in 09-03
✅ Measurement surface verified on https://www.tpsklimaattechniek.nl — TXT ownership records on 2/2 zones, verification meta tag served once, sitemap 27/27, analytics scripts 200 (visits count skipped).
   note: analytics script endpoints answer 200 — necessary, NOT sufficient (the platform serves them even when collection is off)
exit=0
```

## Files Created/Modified
- `scripts/verify-measurement.ts` — five checks, collect-all, exit 0/1/2, token-gated count reported SKIPPED
- `docs/baseline/2026-09-16/gsc/legacy-url-prefix-status.md` — both legacy URL-prefix properties `verified (inherited)`, pre-check results, D-07 note
- `docs/baseline/2026-09-16/gsc/users-and-permissions.md` — role table per property
- `docs/baseline/2026-09-16/gsc/url-inspection-diensten.png`, `ownership-verification-www-tpsklimaattechniek.png`, three `users-*.jpg` — provenance
- `docs/baseline/2026-09-16/vercel/web-analytics-enabled.json`, `speed-insights-enabled.txt`, `insights-view-request.md` — enable state, metrics, beacons, count, MCP 404, vitals 503
- `docs/baseline/2026-09-16/README.md` — ⬜ 09-03 row resolved into per-file rows

## Decisions Made
- Evidence format for the Vercel enable state: machine output instead of dashboard screenshots (owner decision).
- The env var was added via CLI before the owner ran the enable command; the order between those two is immaterial — the single production rebuild came after both (RESEARCH Pitfall 1/3 satisfied).

## Deviations from Plan

1. **Evidence files renamed** — `vercel/web-analytics-enabled.png` → `.json`, `vercel/speed-insights-enabled.png` → `.txt` (owner skipped the vercel.com browser login; Chrome could not log in on its own). The Task 2 verify was executed with these names and additionally asserts `webAnalytics.enabledAt` and a real `…/view | POST | 200` row. Impact: none on MEAS-06; the manifest rows describe the substitution.
2. **Beacon path differs from the plan text** — `@vercel/analytics` 2.x posts to the project-unique `/2fd128cc8fe7c492/view`, not `/_vercel/insights/view`; the evidence file records the real path and why `/_vercel/*/script.js` stays "necessary, not sufficient" in the probe.
3. **Redeploy mechanism** — no dashboard "Redeploy without cache" click: the CLI's enable flow opened GitHub PR #1 (lockfile normalisation only — `libc` arrays removed), the owner merged it, Vercel built `main` @ 56d239c. Consequence for 09-05: `main` moved ahead of the phase branch (merge-base `634071e`), so the branch merges `origin/main` before the fast-forward.
4. **MCP `get_web_analytics` returned 404 "Web Analytics not found"** while the REST count via the CLI token returned data; recorded, the REST call is the machine proof (the same endpoint the probe uses when `VERCEL_TOKEN` is set).

## Issues Encountered
- Vercel CLI 50.x lacks `project web-analytics`; 59.19.1 (via `npx`, no global upgrade) has it but refuses to enable non-interactively ("confirmation_required"; Speed Insights labelled a paid feature — on the Hobby team both have a free allowance and collection pauses at the limit). The owner ran both enable commands in a terminal.
- Speed Insights `POST /9b5146f14b1d5ad9/vitals` answered **503** once (third page); script 200 everywhere, metrics query shows data — recorded as observed, re-checked in 09-06.
- The users/property dialogs in Search Console animate for ~2 s; typing before the animation finished lost input twice — re-issued after a wait.

## User Setup Required
Done during the plan: `vercel login` (CLI), the two interactive enable commands, PR #1 merge. Nothing remains.

## Next Phase Readiness
- 09-05: merge `origin/main` into the phase branch first (PR #1 advanced main), then FF-merge.
- 09-06: re-check analytics after ≥ 24 h (count already positive), Speed Insights vitals, and the GBP knowledge-panel screenshot on google.nl.

## Self-Check: PASSED
- 11 created files + README exist on disk; commits `abe8cf5`, `ba71b17`, `6c2fdcd`, `ffbdb2c` are on the branch and pushed.
- Production check re-runnable: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token> npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` → exit 0.

---
*Phase: 09-measurement-foundation*
*Completed: 2026-09-17*
