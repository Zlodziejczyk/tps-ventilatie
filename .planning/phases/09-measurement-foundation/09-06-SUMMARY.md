---
phase: 09-measurement-foundation
plan: 06
subsystem: measurement
tags: [serp-baseline, uule, search-analytics, web-analytics, completeness-gate, runbook, npm-scripts]

# Dependency graph
requires:
  - phase: 09-measurement-foundation (09-01)
    provides: docs/baseline/2026-09-16/ with the DNS snapshots, the GBP transcription and the manifest skeleton
  - phase: 09-measurement-foundation (09-02)
    provides: scripts/export-gsc-performance.ts, the service-account key, gsc/serp-queries.json (the 24 derived queries)
  - phase: 09-measurement-foundation (09-03)
    provides: Web Analytics + Speed Insights enabled (enabledAt 2026-09-16T22:18:46Z) and the beacon evidence
  - phase: 09-measurement-foundation (09-04/09-05)
    provides: scripts/verify-measurement.ts and the two GitHub Actions workflows the runbook now documents
provides:
  - docs/baseline/2026-09-16/serp/serp-baseline.md — 24/24 geolocated SERP rows (both domains, local-pack column) with the reproducible uule method
  - docs/baseline/2026-09-16/serp/serp-example-footer.png + gbp/knowledge-panel-2026-09-17T115543Z.png — the geolocation proof and the knowledge-panel image deferred from 09-01
  - docs/baseline/2026-09-16/vercel/analytics-after-24h.md — Web Analytics reporting 33 h after enabling (MEAS-06)
  - docs/baseline/2026-09-16/gsc/ re-exported with real Search Analytics rows (D-16) — the before-side Phase 10 measures against
  - docs/baseline/2026-09-16/README.md — complete manifest (39 files, no placeholders), retake recipe, D-25 (a)-(d) closed
  - docs/seo-owner-runbook.md §2/§3 done-state, §6 automated, new §7; .planning/REQUIREMENTS.md D-26 row; npm scripts measure/verify:measurement/baseline:gsc/snapshot:dns
affects: [10-migration, 11-local-presence, 13-close]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Honest zeroes: absences are recorded as data (niet in top 20 / zero: true), never omitted, so the milestone claim has a falsifiable before-side"
    - "Geolocated SERP via uule with a LITERAL + in the URL, pws=0 and gl/hl=nl; num=20 is ignored by Google, so the top 20 is page 1 + page 2"
    - "Every manifest row carries its own taken timestamp and a retake command; the completeness gate greps the manifest for every file on disk"

key-files:
  created:
    - docs/baseline/2026-09-16/serp/serp-baseline.md
    - docs/baseline/2026-09-16/serp/serp-example-footer.png
    - docs/baseline/2026-09-16/gbp/knowledge-panel-2026-09-17T115543Z.png
    - docs/baseline/2026-09-16/vercel/analytics-after-24h.md
  modified:
    - docs/baseline/2026-09-16/README.md
    - docs/baseline/2026-09-16/gsc/ (12 files re-exported)
    - docs/baseline/2026-09-16/gbp/gbp-state.md
    - docs/baseline/2026-09-16/vercel/insights-view-request.md
    - docs/seo-owner-runbook.md
    - .planning/REQUIREMENTS.md
    - package.json
    - .gitignore

key-decisions:
  - "The D-16 re-export was taken at 41 h after verification instead of the planned >= 72 h, on the owner's explicit call. A read-only probe export showed Google had the data; the 72 h figure existed only to outrun the day-one lag (Pitfall 9), and one more finalized day cannot change a 16-month baseline. The early timing is stated in the manifest and here rather than hidden."
  - "Google served a reCAPTCHA twice and a hard 403 twice during the SERP capture. Every pause was waited out (~20 min) and every CAPTCHA was solved by the owner; nothing was scripted around a protection. The capture therefore ran in three sessions, which the taken: line records."
  - "The knowledge-panel screenshot deferred from 09-01 was taken on the q24 brand SERP (google.nl was permitted for this plan anyway), closing that deviation inside the same phase."
  - "A byte-identical copy of the service-account key was found untracked in <repo>/.config/. It was removed from the working tree and .gitignore now blocks .config/, tps-klimaattechniek-seo-*.json and *service-account*.json. The canonical key at ~/.config/tps-klimaattechniek/ was untouched; rotation stays an open owner follow-up because the contents passed through the assistant context on 2026-09-17."

patterns-established:
  - "A time-gated plan records its gates as absolute timestamps plus a runnable script, so any later session (or model) can finish it without re-deriving the method"

requirements-completed: [MEAS-04, MEAS-05, MEAS-06]

# Metrics
duration: ≈3h15m active (across three days, two waiting gates)
completed: 2026-09-18
---

# Phase 9 Plan 06: Geolocated SERP baseline, completeness gate, analytics-after-24h, runbook reconcile Summary

**The baseline is closed and falsifiable: 24 SERP rows with honest zeroes, a Search Analytics export that finally carries real rows, Web Analytics proven to report 33 hours after it was switched on, and a manifest gate that refuses to pass while any file on disk is undocumented.**

## Performance

- **Duration:** ≈3 h 15 m of active work spread over 2026-09-17 09:00Z → 2026-09-18 10:30Z (two deliberate waits: 24 h for analytics, and Google's two ~20 min blocks)
- **Tasks:** 3 completed
- **Files created/modified:** 21

## Accomplishments

- **SERP baseline 24/24** (`serp/serp-baseline.md`). Both brand queries rank; no generic query does. `tps klimaattechniek` → new domain **1**, legacy **6**. `tps ventilatie` → legacy **1**, new **2**. All 22 generic queries: both domains `niet in top 20`. TPS appears in the local pack for **5/24**. Method recorded well enough to repeat mechanically: URL template, the uule value and how it was computed, the literal-`+` trap, the `num=20` fact, the organic-position definition, the local-pack definition and the pacing.
- **Geolocation proven**, not assumed: every captured page was checked for the footer `Zoetermeer - Op basis van je IP-adres`, with `serp/serp-example-footer.png` as the image.
- **Knowledge-panel screenshot** taken on the brand SERP (`gbp/knowledge-panel-2026-09-17T115543Z.png`) — 4,9 ★ / 38 reviews / Industrieweg 6 B / 079 204 6078 — closing the 09-01 deviation; `gbp-state.md` now points at it.
- **Analytics after 24 h** (`vercel/analytics-after-24h.md`), taken at **33 h**: visitors **5** / pageviews **17** over the UTC days 09-17..09-18, **7 / 22** over 7 days and since enabling. The Hobby 1-month reporting window is written down as the answer to CONTEXT's "durable record" question. The probe was re-run with a short-lived CLI token so the visits-count check passed instead of skipping.
- **D-16 re-export with real data.** The day-one export had 0 rows on both properties (Pitfall 9). At 41 h: new domain **20 rows by query** (28 impressions, 0 clicks) and 16 by page; legacy **130 rows by query** (364 impressions, 4 clicks) over 16 months and 10 by page. Shortlist zeros: **22/24** new, **17/24** legacy. `serp-queries.json` came back identical apart from `taken`, so the SERP table stays row-for-row valid.
- **Completeness gate green** — 39 files, every one of them in the manifest, no placeholders, probe green.
- **Runbook, REQUIREMENTS and npm scripts reconciled** (Task 3, committed 2026-09-17): runbook §2/§3 rewritten to done-state, §6 replaced by the automation, new §7 for the weekly measurement; the REQUIREMENTS out-of-scope row marked superseded by D-26; `measure`, `verify:measurement`, `baseline:gsc`, `snapshot:dns` registered with `prebuild` byte-identical.
- **Key hygiene:** an untracked byte-identical copy of the service-account key was removed from the repo tree and `.gitignore` now blocks that whole class of filename.

## Task Commits

1. **Task 1 (SERP baseline):** `307dc5e`, `7ab9ddb` (17/24 after the first 403), `fac2b4c` (23/24, plus the gitignore guard), `4f688dc` (24/24 + knowledge panel)
2. **Task 2 (gate, re-export, analytics, manifest):** `6715652` (manifest lists every export file literally), `51b191a` (vitals re-check), `60283f4` (analytics-after-24h), `0145b2d` (D-16 re-export + D-25 closing line)
3. **Task 3 (runbook/REQUIREMENTS/npm):** `10bc7c0`
4. Handoff bookkeeping across the waits: `b15698d`, `49990aa`, `69dba77`

**Plan metadata:** see the `docs(09-06): complete …` commit that adds this summary.

## Verification outputs (verbatim)

Task 1:

```
SERP baseline OK: 24 rows, method recorded
```

Task 2 (the phase's MEAS-04 acceptance):

```
✅ Measurement surface verified on https://www.tpsklimaattechniek.nl — TXT ownership records on 2/2 zones, verification meta tag served once, sitemap 27/27, analytics scripts 200 (visits count skipped).
   note: meta tag content not compared (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION not set in this shell)
   note: analytics script endpoints answer 200 — necessary, NOT sufficient (the platform serves them even when collection is off)
baseline COMPLETE: 39 files, all in the manifest; measurement probe green
```

Same probe with a short-lived `VERCEL_TOKEN`, so the count check runs instead of skipping:

```
✅ Measurement surface verified on https://www.tpsklimaattechniek.nl — TXT ownership records on 2/2 zones, verification meta tag served once, sitemap 27/27, analytics scripts 200, visits count checked.
   note: Vercel visits count: visitors = 7 in the last 7 days (analytics IS reporting)
```

Task 3:

```
runbook, REQUIREMENTS row and npm scripts reconciled; prebuild untouched / prebuild green
```

## Files Created/Modified

- `docs/baseline/2026-09-16/serp/serp-baseline.md` — method section + 24 rows + totals
- `docs/baseline/2026-09-16/serp/serp-example-footer.png` — the Zoetermeer footer
- `docs/baseline/2026-09-16/gbp/knowledge-panel-2026-09-17T115543Z.png` + `gbp/gbp-state.md` — the deferred image and its pointer
- `docs/baseline/2026-09-16/vercel/analytics-after-24h.md` — three REST windows, the Hobby window, the token-backed probe
- `docs/baseline/2026-09-16/vercel/insights-view-request.md` — the vitals 503 re-check
- `docs/baseline/2026-09-16/gsc/` — 12 files re-exported (8 performance, 2 shortlist, sitemap + sitemaps, serp-queries)
- `docs/baseline/2026-09-16/README.md` — 39-file manifest, retake recipe, D-25 closed
- `docs/seo-owner-runbook.md`, `.planning/REQUIREMENTS.md`, `package.json`, `.gitignore`

## Decisions Made

See key-decisions: the 41 h vs 72 h call (owner's, stated in the open), never scripting around Google's protections, closing the 09-01 screenshot deviation inside this plan, and the key-copy cleanup.

## Deviations from Plan

1. **Google blocked the SERP capture twice.** Two reCAPTCHAs (solved by the owner) and two hard 403s. Resolution: waited ~20 min each time and resumed at ~20 s per page; the capture ran in three sessions, recorded in the file's `taken:` line and in the method's pacing bullet. No protection was bypassed.
2. **`javascript_tool` intermittently refused the extractor** with `[BLOCKED: Cookie/query string data]` when the script built URLs from `location.search`. Resolution: hard-coded the query and page per call and drove navigation with the navigate tool. Recorded in memory for later sessions.
3. **The re-export ran at 41 h, not ≥ 72 h** — the owner's explicit decision after a read-only probe showed the rows were there. Stated in the manifest and above.
4. **The manifest used brace shorthand** (`performance-…-by-{query,page}.{json,csv}`) for eight files; the gate matches literal filenames, so those two rows were expanded into eight. Found by a dry run of the gate, before the gate itself was due.
5. **An untracked copy of the service-account key** sat in `<repo>/.config/` from the 09-02 hand-delivery. Removed; `.gitignore` extended. It was never committed (verified).
6. **Background `sleep` timers were killed by macOS memory pressure**, which is why the overnight analytics step ran at 07:34Z rather than at 22:23Z. No data was affected — the window only had to be open, and it was.

## Issues Encountered

- The Vercel visits-count API is day-granular, so a "last 24 h" window is expressed as two UTC days; the file says so rather than implying an exact 24 h slice.
- `gsd-sdk query state.record-session` needed the resume file on the paused state; done at `49990aa` and cleared here.

## User Setup Required

None for this plan. Two owner follow-ups remain open from earlier plans:

1. **Rotate the service-account key** (its contents passed through the assistant context on 2026-09-17): create a new key → `gh secret set GSC_SERVICE_ACCOUNT_JSON < file` → replace `~/.config/tps-klimaattechniek/gsc-service-account.json` → delete key `a96286e54ca9…`.
2. **Optionally restore** `iam.disableServiceAccountKeyCreation` to "Inherit parent's policy" on project `tps-klimaattechniek-seo`, re-overriding only for the rotation.

## Next Phase Readiness

- D-25 gates (a)-(d) are complete. **Phase 10 (Reversible Old-Brand Migration) is unblocked**: the legacy property is verified and now carries a real 16-month Search Analytics baseline, which is exactly what the Change of Address and the redirect work will be measured against.
- Phases 11-13 never depended on this plan and were free to start throughout.
- The weekly cron's first scheduled run is Monday 2026-09-22 06:17 UTC; the 2026-09-17 reading is its comparison point.

## Self-Check: PASSED

- 24 rows in `serp-baseline.md`, every query from `serp-queries.json` present, method section carries `uule=`, `pws=0`, `gl=nl`, `Zoetermeer` and `niet in top 20`; footer screenshot exists.
- `analytics-after-24h.md` has `taken:` and labelled positive counts; probe green with the count check.
- Re-export row counts verified from the files themselves (20/16/130/10), not from the script's summary line.
- Completeness gate re-run after every manifest edit: `baseline COMPLETE: 39 files, all in the manifest; measurement probe green`.
- All commits are on `origin/main`; the post-deploy probe ran green on each push.

---
*Phase: 09-measurement-foundation*
*Completed: 2026-09-18*
