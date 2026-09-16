---
phase: 9
slug: measurement-foundation
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-09-16
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **Honest constraint (from 09-RESEARCH.md §Validation Architecture):** no test framework by decision, no CI
> *until this phase creates it*, and no local `next build` / `tsc` / `eslint` on the OneDrive mount. Validation
> is `tsx` CLI runs, live HTTP/DNS probes, `gh api` / `gh run` state, and — for the two workflows — a real
> dispatched run and a real deployment-triggered run. As in Phase 8, the gates are simultaneously the
> deliverable and the test.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — `tsx` + `node:assert/strict` CLIs and live probes (project decision) |
| **Config file** | `package.json` scripts `measure`, `verify:measurement`, `baseline:gsc`, `snapshot:dns` — deliberately **not** in `prebuild` (network + secrets) |
| **Quick run command** | `npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` (~5 s) · `npx tsx -e "…thresholds proof…"` (~2 s) |
| **Full suite command** | `npm run prebuild && npx tsx scripts/verify-indexation.ts https://www.tpsklimaattechniek.nl && npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl && gh run list --workflow measure-indexation.yml --limit 1 --json conclusion` |
| **Estimated runtime** | ~30 s local · ~2 min per workflow run |

---

## Sampling Rate

- **After every task commit:** run the script that task created or touched (`npx tsx …` / `bash …`, seconds).
- **After every plan:** `npm run prebuild` (the 8 existing guards must stay green) plus the probe(s) that plan delivers.
- **After the workflows land (09-04):** `gh workflow run measure-indexation.yml` → `gh run watch` → conclusion `success`; then confirm the next production deployment triggers `verify-indexation` (`gh run list --workflow verify-indexation.yml`).
- **Before `/gsd-verify-work`:** both probes green against production, one green dispatched weekly run with a committed reading, one green deployment-triggered probe run, baseline manifest complete (D-17).
- **Max feedback latency:** ~5 s local · ~2 min workflow.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | MEAS-04 | T-9-dns-write | snapshot script has no write path; output byte-compatible with 2026-09-16 files | integration | `bash scripts/snapshot-dns.sh tpsventilatie.nl tpsklimaattechniek.nl --out /tmp/x && grep -c 'google-site-verification' /tmp/x/*.txt` | ✅ (creates) | ⬜ pending |
| 09-01-02 | 01 | 1 | MEAS-04, MEAS-03 | — | evidence rescued verbatim; manifest lists every file with `taken:` | file assertions | `node -e` existence + header checks over `docs/baseline/2026-09-16/{dns,gsc}/` + README manifest rows | ✅ (creates) | ⬜ pending |
| 09-01-03 | 01 | 1 | MEAS-04 | — | GBP fields transcribed (6 named fields) + screenshot present | file assertions (+ manual) | `node -e` asserts `gbp/gbp-state.md` contains all 6 field labels and `gbp/*.png\|jpg` exists | ✅ (creates) | ⬜ pending |
| 09-02-01 | 02 | 1 | MEAS-05 | T-9-key, T-9-scope | key gitignored; secret set; SA Full on both properties; token minted read-only | integration | `git check-ignore -q gsc-service-account.json && gh secret list \| grep GSC_SERVICE_ACCOUNT_JSON && npx tsx -e "…getAccessToken()…"` prints `token ok` (never the token) | ✅ (creates) | ⬜ pending |
| 09-02-02 | 02 | 1 | MEAS-03, MEAS-04 | T-9-token-log | sitemap proof `submitted === 27`; exports written; shortlist = 24 derived from registry | integration | `npx tsx scripts/export-gsc-performance.ts --out docs/baseline/2026-09-16/gsc` exit 0 · `node -e` asserts `serp-queries.json` length 24 and `sitemap-tpsklimaattechniek.nl.json` `submitted === 27` | ✅ (creates) | ⬜ pending |
| 09-02-03 | 02 | 1 | MEAS-05 | T-9-parallel-list | URL list from `sitemapEntries()`; thresholds pure + proven to bite; reading committed | unit + integration | `npx tsx -e "…evaluateReading proofs (below-ramp, lost-indexation, clean)…"` · `npx tsx scripts/measure-indexation.ts` exit 0 and `docs/measurements/gsc/<date>.json` exists | ✅ (creates) | ⬜ pending |
| 09-03-01 | 03 | 1 | MEAS-01 | — | env var set for production; redeploy; tag in served `<head>`; 5th property verified incl. HTML-tag method | probe | `curl -s https://www.tpsklimaattechniek.nl/ \| grep -c 'google-site-verification'` = 1 · `npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` (meta check) | ✅ (creates probe) | ⬜ pending |
| 09-03-02 | 03 | 1 | MEAS-02 | T-9-legacy-token | legacy URL-prefix properties created (inherited) or recorded blocked; legacy apex still 200 WordPress; TXT never removed | probe | `curl -sI https://tpsventilatie.nl/ \| head -1` contains 200 · `dig +short TXT tpsventilatie.nl \| grep -c google-site-verification` = 1 | ✅ | ⬜ pending |
| 09-03-03 | 03 | 1 | MEAS-06, MEAS-01, MEAS-02 | T-9-vercel-token | analytics + speed insights enabled, redeployed; probe green; API count > 0 when token present | probe + API | `npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` exit 0 (with `VERCEL_TOKEN` set: count step passes, not skipped) | ✅ (creates) | ⬜ pending |
| 09-04-01 | 04 | 2 | MEAS-05 | T-9-actions-perms, T-9-SC | YAML parses; explicit minimal `permissions`; actions pinned `@v7`; secret referenced by name only | unit | `node -e "require('js-yaml').load(fs.readFileSync('.github/workflows/measure-indexation.yml','utf8'))"` · `grep -c 'actions/checkout@v7' …` = 1 · `grep -c 'permissions:' …` ≥ 1 | ✅ (creates) | ⬜ pending |
| 09-04-02 | 04 | 2 | MEAS-05 | T-9-recursion | dispatched run green; reading committed by the bot; issue path proven with a forced breach then closed | integration | `gh workflow run measure-indexation.yml && gh run watch …` conclusion `success` · `git log -1 --format=%an origin/main -- docs/measurements/gsc` = `github-actions[bot]` | ✅ | ⬜ pending |
| 09-04-03 | 04 | 2 | MEAS-05 (D-22) | T-9-wronghost | probe workflow gated to Production; runs on a real deployment against `CANONICAL_ORIGIN` | integration | `gh run list --workflow verify-indexation.yml --limit 1 --json conclusion,event` → `success`, `deployment_status` | ✅ (creates) | ⬜ pending |
| 09-05-01 | 05 | 3 | MEAS-04 | — | 24 queries × 2 domains recorded with position or explicit zero; footer-verified location; URL template recorded | file assertions (+ manual) | `node -e` asserts `serp/serp-baseline.md` has 24 query rows each with a value for both domains and the README contains the URL template with `uule=` | ✅ (creates) | ⬜ pending |
| 09-05-02 | 05 | 3 | MEAS-04 (D-17) | — | manifest complete: every planned artefact present with `taken:`; D-26/D-27 recorded | file assertions | `node -e` completeness gate over `docs/baseline/2026-09-16/` (dns ≥2 files, gsc ≥4, gbp ≥2, serp ≥1, README rows = files) | ✅ | ⬜ pending |
| 09-05-03 | 05 | 3 | MEAS-05, MEAS-06 | — | runbook §2/§3 rewritten as done-state; §7 measurement; REQUIREMENTS out-of-scope row annotated; `docs/measurements/README.md` | source assertions | `grep -c 'measure-indexation' docs/seo-owner-runbook.md` ≥ 1 · `grep -c 'Vercel → Project' docs/seo-owner-runbook.md` = 0 (owner-todo prose gone) · `test -f docs/measurements/README.md` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Sampling continuity:** every task above has an automated verify; no window of three consecutive tasks lacks one.

---

## Wave 0 Requirements

None. `tsx` + `node:assert` + `gh` infrastructure exists and was exercised this milestone (all 8 guards,
`verify-indexation.ts`, `gh api`). No framework install.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GBP fields transcribed correctly | MEAS-04 (D-15) | no GBP read API held | Chrome → Business Profile → screenshot; transcribe name, primary + secondary categories, website URL, service area, review count, rating; cross-check the public knowledge panel |
| SERP positions / honest zeroes | MEAS-04 (D-13) | Google SERP not machine-queryable | Chrome with the recorded URL template (`gl=nl&hl=nl&pws=0&uule=…`); confirm footer says Zoetermeer; record top-20 position or "niet in top 20" for both domains |
| Ownership-verification panel lists the HTML-tag method | MEAS-01 (D-08) | UI only | screenshot into `docs/baseline/2026-09-16/gsc/` |
| Thomas delegated Owner | D-02 | account identity | Settings → Users and permissions → Add user (Owner); screenshot, or record "rejected: not a Google account" as an owner-dependent item |
| Vercel Analytics dashboard shows visitors | MEAS-06 | dashboard | screenshot after ≥24 h; the API count is the machine form |
| `/_vercel/insights/view` request seen in a real browser | MEAS-06 | browser beacon | Chrome `read_network_requests` after loading the production home page |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none required)
- [x] No watch-mode flags
- [x] Feedback latency < 120 s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
