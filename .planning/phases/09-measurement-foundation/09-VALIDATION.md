---
phase: 9
slug: measurement-foundation
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-09-16
updated: 2026-09-16
plans: 6
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **Honest constraint (from 09-RESEARCH.md §Validation Architecture):** no test framework by decision, no CI
> *until this phase creates it*, and no local `next build` / `tsc` / `eslint` on the OneDrive mount. Validation
> is `tsx` CLI runs, live HTTP/DNS probes, `gh api` / `gh run` state, and — for the two workflows — a real
> dispatched run and a real deployment-triggered run. As in Phase 8, the gates are simultaneously the
> deliverable and the test. The Vercel **preview build** of the phase branch is the TypeScript gate for every
> new script (`tsconfig.json` `include` covers `**/*.ts`).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — `tsx` + `node:assert/strict` CLIs and live probes (project decision) |
| **Config file** | `package.json` scripts `measure`, `verify:measurement`, `baseline:gsc`, `snapshot:dns` (added in 09-06) — deliberately **not** in `prebuild` (network + secrets) |
| **Quick run command** | `npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` (~5 s) · `npx tsx -e "…thresholds proof…"` (~2 s) |
| **Full suite command** | `npm run prebuild && npx tsx scripts/verify-indexation.ts https://www.tpsklimaattechniek.nl && npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl && gh run list --workflow measure-indexation.yml --limit 1 --json conclusion` |
| **Estimated runtime** | ~30 s local · ~2 min per workflow run |

---

## Sampling Rate

- **After every task commit:** run the script that task created or touched (`npx tsx …` / `bash …`, seconds).
- **After every plan:** `npm run prebuild` (the 8 existing guards must stay green) plus the probe(s) that plan delivers; push the branch → Vercel preview READY (type gate).
- **After the workflows land (09-05):** `gh workflow run measure-indexation.yml` → `gh run watch` → conclusion `success`; `-f simulate_breach=true` → conclusion `failure` + labelled issue; then confirm the next production deployment triggers `verify-indexation` (`gh run list --workflow verify-indexation.yml`).
- **Before `/gsd-verify-work`:** both probes green against production, one green dispatched weekly run, one green deployment-triggered probe run, baseline manifest complete (D-17, 09-06 Task 2 gate).
- **Max feedback latency:** ~5 s local · ~2 min workflow.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | MEAS-04 | T-9-dns-write | snapshot script has no write path; output header-compatible with the 2026-09-16 files; both TXT tokens present | integration | `bash scripts/snapshot-dns.sh tpsventilatie.nl tpsklimaattechniek.nl --out $T` → 2 files, `google-site-verification=` in each, `# DNS snapshot` header | ✅ (creates) | ⬜ pending |
| 09-01-02 | 01 | 1 | MEAS-04, MEAS-03 | T-9-evidence-loss | 7 scratchpad evidence files rescued verbatim; README manifest lists every file with `taken:`; D-26 rollback + D-27 recorded | file assertions | `node -e` existence checks over the 7 rescued paths + README contains `D-26`, `D-27`, `taken:`, rollback nameservers | ✅ (creates) | ⬜ pending |
| 09-01-03 | 01 | 1 | MEAS-04 | T-9-gbp-edit, T-9-pii | GBP read-only; 8 named fields + `Afwijkingen` transcribed; screenshot present | file assertions (+ manual) | `node -e` asserts `gbp/gbp-state.md` labels and `gbp/*.png` exists | ✅ (creates) | ⬜ pending |
| 09-02-01 | 02 | 1 | MEAS-05 | T-9-key, T-9-scope | key gitignored (two patterns); secret set; SA Full on both properties; token minted read-only; never logged | integration | `git check-ignore -q …` · `gh secret list` has `GSC_SERVICE_ACCOUNT_JSON` · `node -e` shape of `auth.ts` · `npx tsx -e "…getAccessToken()…"` prints `token ok` | ✅ (creates) | ⬜ pending |
| 09-02-02 | 02 | 1 | MEAS-03, MEAS-04 | T-9-token-log | sitemap proof `submitted === 27 && errors === 0`; exports written for both domains; shortlist 15–25 derived from registry incl. brand terms; never submits | integration | `node -e` shape of `api.ts` · `npx tsx scripts/export-gsc-performance.ts --out docs/baseline/2026-09-16/gsc` exit 0 · `node -e` asserts `serp-queries.json` band + `sitemap-tpsklimaattechniek.nl.json` | ✅ (creates) | ⬜ pending |
| 09-03-01 | 03 | 1 | MEAS-01, MEAS-02 | T-9-legacy-token | fifth property added + token copied; legacy URL-prefix properties inherited or recorded owner-blocked; Thomas Owner or reason recorded; legacy apex still 200; TXT never removed | probe + file assertions (+ manual) | `curl -sI https://tpsventilatie.nl/` 200 · `dig +short TXT tpsventilatie.nl` has token · `node -e` over `gsc/legacy-url-prefix-status.md`, `gsc/users-and-permissions.md`, `gsc/url-inspection-diensten.png` | ✅ (creates) | ⬜ pending |
| 09-03-02 | 03 | 1 | MEAS-06, MEAS-01 | T-9-vercel-token | analytics + speed insights enabled BEFORE the single redeploy; env var set for production; meta tag served exactly once; HTML-tag verified; beacon request evidence | probe + file assertions (+ manual) | `curl` home → exactly 1 `google-site-verification` meta · `/_vercel/insights/script.js` 200 · `node -e` over `vercel/*.png`, `vercel/insights-view-request.md`, `gsc/ownership-verification-www-tpsklimaattechniek.png` | ✅ (creates) | ⬜ pending |
| 09-03-03 | 03 | 1 | MEAS-01, MEAS-02, MEAS-06 | T-9-vercel-token | probe imports only the floor; usage guard; VERCEL_TOKEN-gated count explicitly SKIPPED when absent; green against production | probe | `node -e` shape of `verify-measurement.ts` · usage run prints `usage` · `npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` exit 0 | ✅ (creates) | ⬜ pending |
| 09-04-01 | 04 | 2 | MEAS-05 | T-9-snapshot-assert | thresholds pure (no I/O, no clock); `RAMP_ANCHOR` + `RAMP` derived; five proofs incl. the negative (uncrawled DISALLOWED does not flag) | unit | `npx tsx -e "…evaluateReading proofs…"` · `node -e` purity grep | ✅ (creates) | ⬜ pending |
| 09-04-02 | 04 | 2 | MEAS-05 | T-9-parallel-list, T-9-token-log, T-9-partial-run | URL list from `sitemapEntries()`; no hand-typed page URL; no token logging; `--simulate-breach` exits 1 and writes nothing; first reading 27 URLs / floor 27 / submitted 27 | unit + integration | `node -e` shape + README vocabulary · `npx tsx scripts/measure-indexation.ts --simulate-breach` exit 1 · real run + `node -e` reading check | ✅ (creates) | ⬜ pending |
| 09-05-01 | 05 | 3 | MEAS-05 | T-9-actions-perms, T-9-SC, T-9-wronghost | on `main`; both YAML parse; `@v7` pins; node 24; explicit `permissions`; label wired; secret by name only; `environment_url` never probed | unit | `node -e` js-yaml parse + greps · `gh label list` has `indexation-alert` | ✅ (creates) | ⬜ pending |
| 09-05-02 | 05 | 3 | MEAS-05 | T-9-recursion, T-9-issue-spam | dispatched run green (bot reading committed or documented why not); simulated breach → failure + `[SIMULATED]` labelled issue → closed; README automation section | integration | `gh run list --workflow measure-indexation.yml` has `success` + `failure` dispatches · `gh issue list --label indexation-alert` closed has SIMULATED, open = 0 · README greps | ✅ | ⬜ pending |
| 09-05-03 | 05 | 3 | MEAS-05 (D-22, D-23) | T-9-wronghost, T-9-fork | probe workflow gated to `Production` + `success`; real deployment-triggered run green with `27/27` | integration | `gh run list --workflow verify-indexation.yml` has `deployment_status` + `success` · `gh run view --log` contains `27/27` | ✅ (creates) | ⬜ pending |
| 09-06-01 | 06 | 4 | MEAS-04 (D-13) | T-9-serp-method-drift, T-9-unverified-geo | every shortlist query recorded for both domains with position or `niet in top 20`; method with `uule=`, `pws=0`, `gl=nl`; footer screenshot | file assertions (+ manual) | `node -e` cross-checks `serp/serp-baseline.md` rows against `gsc/serp-queries.json` + method tokens + `serp/serp-example-footer.png` | ✅ (creates) | ⬜ pending |
| 09-06-02 | 06 | 4 | MEAS-04 (D-17), MEAS-06 | T-9-txt-cleanup | measurement probe green; every baseline file in the manifest; no `⬜` rows; dns ≥2 / gsc ≥6 / gbp ≥2 / serp ≥1 / vercel ≥3; labelled positive analytics count after ≥24 h; D-25 (a)–(d) declared | probe + file assertions | `npx tsx scripts/verify-measurement.ts …` · `node -e` completeness gate over `docs/baseline/2026-09-16/` | ✅ | ⬜ pending |
| 09-06-03 | 06 | 4 | MEAS-05, MEAS-06 | T-9-docs-stale, T-9-prebuild | runbook §2/§3 done-state without checkboxes + never-remove rule; §6 automated; §7 weekly; REQUIREMENTS row cites D-26; four npm scripts; `prebuild` byte-identical and green | source assertions | `node -e` section-scoped greps + `package.json` compare · `npm run prebuild` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Sampling continuity:** every task above has an automated verify; no window of three consecutive tasks lacks one. Human checks (09-01-03, 09-03-01, 09-03-02, 09-06-01) supplement, never replace, the automated command (`human_verify_mode: end-of-phase`).

---

## Wave 0 Requirements

None. `tsx` + `node:assert` + `gh` infrastructure exists and was exercised this milestone (all 8 guards,
`verify-indexation.ts`, `gh api`). No framework install. No npm package is added in this phase.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GBP fields transcribed correctly | MEAS-04 (D-15) | no GBP read API held | Chrome → Business Profile → screenshot; transcribe name, primary + secondary categories, website URL, service area, review count, rating; cross-check the public knowledge panel (09-01-03) |
| SERP positions / honest zeroes | MEAS-04 (D-13) | Google SERP not machine-queryable | Chrome with the recorded URL template (`gl=nl&hl=nl&pws=0&uule=…`); confirm footer says Zoetermeer; record top-20 position or "niet in top 20" for both domains (09-06-01) |
| Ownership-verification panel lists the HTML-tag method | MEAS-01 (D-08) | UI only | screenshot into `docs/baseline/2026-09-16/gsc/` (09-03-02) |
| Thomas delegated Owner | D-02 | account identity | Settings → Users and permissions → Add user (Owner); screenshot, or record "rejected: not a Google account" as an owner-dependent item (09-03-01) |
| Vercel Analytics dashboard shows visitors | MEAS-06 | dashboard | screenshot after ≥24 h; the API/MCP count is the machine form (09-06-02) |
| `/_vercel/insights/view` request seen in a real browser | MEAS-06 | browser beacon | Chrome `read_network_requests` after loading the production home page (09-03-02) |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none required)
- [x] No watch-mode flags
- [x] Feedback latency < 120 s
- [x] `nyquist_compliant: true` set in frontmatter
- [x] Task IDs reconciled to the final 6-plan layout (09-04 thresholds/measure · 09-05 workflows · 09-06 SERP/gate/docs)

**Approval:** pending
