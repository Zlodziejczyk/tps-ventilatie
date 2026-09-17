---
phase: 09-measurement-foundation
plan: 02
subsystem: measurement
tags: [google-cloud, service-account, search-console-api, jwt, export, baseline]

# Dependency graph
requires:
  - phase: 08-indexation-unlock
    provides: INDEXABLE_FLOOR = 27, sitemapEntries(), the sitemap Google processed at 27
  - phase: 09-measurement-foundation (09-01)
    provides: docs/baseline/2026-09-16/ manifest with the ⬜ 09-02 placeholder row
provides:
  - GCP project tps-klimaattechniek-seo (org polaris360.nl) with the Search Console API enabled and the service account gsc-measure@tps-klimaattechniek-seo.iam.gserviceaccount.com (Full on both Domain properties)
  - One JSON key, stored ONLY at ~/.config/tps-klimaattechniek/gsc-service-account.json (0600) and as the GitHub secret GSC_SERVICE_ACCOUNT_JSON; .env.local points to the file
  - scripts/gsc/auth.ts — dependency-free JWT-bearer token mint (RS256, readonly scope)
  - scripts/gsc/api.ts — typed inspect / sitemaps / searchAnalytics wrappers, PROPERTY_NEW / PROPERTY_LEGACY
  - scripts/export-gsc-performance.ts — the re-runnable baseline export (D-16/D-13/D-10/D-09)
  - docs/baseline/2026-09-16/gsc/ machine exports: serp-queries.json (24), sitemap proof 27/0, legacy no-sitemap record, performance + shortlist files for both domains
affects: [09-04, 09-05, 09-06, 10-migration, 11-gbp-citations, 12-content, 13-close]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Service-account auth without googleapis: base64url JWT signed with node:crypto, exchanged at oauth2.googleapis.com/token; errors carry HTTP status only, never bodies or token material"
    - "Google int64 fields arrive as strings — normalizeSitemap() converts once at the client boundary"
    - "Every export file carries { property, taken, ... }; empty rows are written as data (zero: true), not skipped"

key-files:
  created:
    - scripts/gsc/auth.ts
    - scripts/gsc/api.ts
    - scripts/export-gsc-performance.ts
    - docs/baseline/2026-09-16/gsc/serp-queries.json
    - docs/baseline/2026-09-16/gsc/sitemap-tpsklimaattechniek.nl.json
    - docs/baseline/2026-09-16/gsc/sitemaps-tpsventilatie.nl.json
    - docs/baseline/2026-09-16/gsc/performance-tpsklimaattechniek.nl-by-query.json
    - docs/baseline/2026-09-16/gsc/performance-tpsklimaattechniek.nl-by-query.csv
    - docs/baseline/2026-09-16/gsc/performance-tpsklimaattechniek.nl-by-page.json
    - docs/baseline/2026-09-16/gsc/performance-tpsklimaattechniek.nl-by-page.csv
    - docs/baseline/2026-09-16/gsc/performance-tpsventilatie.nl-by-query.json
    - docs/baseline/2026-09-16/gsc/performance-tpsventilatie.nl-by-query.csv
    - docs/baseline/2026-09-16/gsc/performance-tpsventilatie.nl-by-page.json
    - docs/baseline/2026-09-16/gsc/performance-tpsventilatie.nl-by-page.csv
    - docs/baseline/2026-09-16/gsc/shortlist-tpsklimaattechniek.nl.json
    - docs/baseline/2026-09-16/gsc/shortlist-tpsventilatie.nl.json
  modified:
    - .gitignore
    - .env.example
    - docs/baseline/2026-09-16/README.md

key-decisions:
  - "The org policy iam.disableServiceAccountKeyCreation (Secure-by-Default on polaris360.nl) was overridden by the OWNER at project level only (legacy constraint → Not enforced; the managed twin was already Not enforced); Claude did not touch org policy"
  - "The key lives outside the repo and in exactly one GitHub secret; .gitignore patterns gsc-service-account*.json / *.serviceaccount.json / secrets/ guard the repo — the downloaded file name tps-klimaattechniek-seo-*.json is NOT covered, which is why the file was moved out of the repo root the moment it appeared there"
  - "Day-one zero rows on BOTH properties are recorded as a timing statement (RESEARCH Pitfall 9: the legacy Domain property was also only verified on 2026-09-16); 09-06 re-runs the export before the completeness gate"

patterns-established:
  - "Account-side steps are done in Chrome by Claude (D-01) and every human-only gate (2FA, org policy, a file macOS hides from the shell) is asked for once, with the machine state re-checked before proceeding"
  - "Machine proof over screenshots: Google's own submitted === 27 / errors === 0 is the D-10 evidence"

requirements-completed: [MEAS-03, MEAS-04, MEAS-05]

# Metrics
duration: ≈55min active (wall clock 2026-09-16T20:46Z → 2026-09-17T08:25Z, mostly owner-blocked)
completed: 2026-09-17
---

# Phase 9 Plan 02: Service account, typed Search Console client and the first baseline export Summary

**Google's own numbers are now on disk and re-runnable: the sitemap proof (27 submitted, 0 errors), the 24-query shortlist and the day-one zero rows for both domains — fetched with a service account whose key never enters the repo.**

## Performance

- **Duration:** ≈55 min of active work; wall clock 2026-09-16T20:46Z → 2026-09-17T08:25Z (three owner-only gates in between: Google passkey re-auth, the org-policy override, the key file macOS hid from the shell)
- **Started:** 2026-09-16T20:46:11Z (first commit `67e2afc`)
- **Completed:** 2026-09-17T08:24:52Z (export commit `ffbdb2c`)
- **Tasks:** 2 completed
- **Files modified:** 19 (3 scripts, 2 config files, 14 baseline files)

## Accomplishments
- GCP project `tps-klimaattechniek-seo` created under the polaris360.nl org, Search Console API enabled, service account `gsc-measure@tps-klimaattechniek-seo.iam.gserviceaccount.com` (OAuth2 client id 106525403488405879873) created and added as **Full** user on `sc-domain:tpsklimaattechniek.nl` and `sc-domain:tpsventilatie.nl` (assumption A5 confirmed: a service account is accepted as a GSC user).
- One JSON key (id `a96286e54ca94f972a5f09ced6ade4da5b69f9cf`) stored at `~/.config/tps-klimaattechniek/gsc-service-account.json` (mode 0600) and as the GitHub Actions secret `GSC_SERVICE_ACCOUNT_JSON` (set 2026-09-17T08:23:44Z); `.env.local` carries `GSC_SERVICE_ACCOUNT_JSON_FILE=<that path>`; token proof `token ok (non-empty bearer)`.
- `scripts/gsc/auth.ts` (JWT-bearer, no googleapis dependency), `scripts/gsc/api.ts` (typed `inspectUrl`, `getSitemap`, `listSitemaps`, `querySearchAnalytics`, `GscApiError` with status + hint only) and `scripts/export-gsc-performance.ts` (`--out`, `--property`, `--sitemap-only`; shortlist derived from `PAGES.primaryKeyword` + 2 brand queries, asserted inside the 15–25 band).
- The export ran green against the live API and proved the API is enabled and the account authorised.

## Task Commits

1. **Task 1: Google Cloud project, API, service account, key hygiene, token mint** — `67e2afc` (feat: .gitignore + .env.example + scripts/gsc/auth.ts); account-side work in Chrome + Cloud Console (no repo diff)
2. **Task 2: typed client + export CLI + first export** — `09440a3` (feat: scripts/gsc/api.ts + export CLI), `ffbdb2c` (docs: the 14 export files + README rows resolved)

**Plan metadata:** see the `docs(09-02): complete …` commit that adds this summary.

## Export summary (verbatim, run `2026-09-17T08:24:03Z`)

```
shortlist: 24 queries (22 from the registry + 2 brand) → serp-queries.json
note: sc-domain:tpsklimaattechniek.nl has 0 rows by query for 2026-08-12..2026-09-16 — Search Analytics lags ~2 days after verification on 2026-09-16 (RESEARCH §Pitfall 9); re-run before the 09-06 completeness gate.

| property | rows by query | rows by page | zeros/shortlist | sitemap |
|---|---|---|---|---|
| sc-domain:tpsklimaattechniek.nl | 0 | 0 | 24/24 | 27 submitted, 0 errors |
| sc-domain:tpsventilatie.nl | 0 | 0 | 24/24 | none (D-09) |

written to docs/baseline/2026-09-16/gsc/ (taken 2026-09-17T08:24:03.216Z)
```

The plan expected legacy rows > 0 (16 months of history). Both properties returned 0 rows: the legacy Domain property was itself only verified on 2026-09-16, so Google's backfill had not surfaced either. Recorded as a timing statement, not a finding; the 09-06 completeness gate re-takes the export (D-16).

Verification outputs: `api + export shape OK` · `baseline GSC exports OK — sitemap submitted 27, shortlist 24`.

## Files Created/Modified
- `scripts/gsc/auth.ts` — `loadServiceAccount()` (env JSON → env FILE → `.env.local`), `getAccessToken(scope)`; errors carry the HTTP status only
- `scripts/gsc/api.ts` — endpoint wrappers, enum unions, `PROPERTY_NEW`/`PROPERTY_LEGACY`, int64 normalisation
- `scripts/export-gsc-performance.ts` — the baseline export CLI (never submits a sitemap)
- `.gitignore`, `.env.example` — key-file patterns; documented `GSC_SERVICE_ACCOUNT_JSON`, `GSC_SERVICE_ACCOUNT_JSON_FILE`, `VERCEL_TOKEN`
- `docs/baseline/2026-09-16/gsc/*.json|csv` — 14 export files (see manifest rows in the baseline README)

## Decisions Made
- Org-policy override done by the owner, at project scope, on the legacy constraint only (the managed constraint `iam.managed.disableServiceAccountKeyCreation` was already Not enforced; both are evaluated concurrently, which is why the first two overrides "did not work").
- The key is treated as a real secret (D-18): never printed, never committed; `.env.local` is gitignored and only references the file path.

## Deviations from Plan
None in the code. The account-side sequence needed the owner three times where the plan expected at most a 2FA prompt (see Issues).

## Issues Encountered
1. **Org policy blocked key creation** (3 attempts: `iam.disableServiceAccountKeyCreation` "enforced on your organization", tracking c7386093620286633). Resolved by the owner's project-level override; Claude refused to edit org security policy itself.
2. **macOS hid the downloaded key from the shell.** Chrome logged the download as complete (`~/Downloads/tps-klimaattechniek-seo-a96286e54ca9.json`, 2385 bytes) but `ls ~/Downloads` answers "Operation not permitted" in this session (TCC, also with the sandbox off). The owner delivered the file by hand — into the repo root — and it was moved to the target path immediately (`git status` never saw it; the `tps-klimaattechniek-seo-*.json` name is not covered by the ignore patterns).
3. **Key exposure to rotate later.** Because the file was attached to the conversation, its contents passed through the assistant's context. Recommended follow-up (owner action, after the phase lands): create a new key in Cloud Console → `gh secret set GSC_SERVICE_ACCOUNT_JSON < file` → replace the local file → delete key `a96286e54ca9…`. Recorded here and in the 09-05 README rotation recipe.

## User Setup Required
Done during the plan (owner actions): passkey re-auth on the Google account, the org-policy override, the key-file hand-off. Nothing remains for this plan.

## Next Phase Readiness
- 09-04 can measure (token mint + `inspectUrl` proven), 09-05 has its secret, 09-06 must re-run the export (day-one zeros).
- Open item: key rotation after the phase (see Issues 3).

## Self-Check: PASSED
- All 16 created files and 2 modified files exist on disk; commits `67e2afc`, `09440a3`, `ffbdb2c` are on `gsd/phase-9-measurement-foundation` and pushed.
- Secret present: `gh secret list` shows `GSC_SERVICE_ACCOUNT_JSON 2026-09-17T08:23:44Z`.

---
*Phase: 09-measurement-foundation*
*Completed: 2026-09-17*
