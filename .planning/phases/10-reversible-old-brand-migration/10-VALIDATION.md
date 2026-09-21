---
phase: 10
slug: reversible-old-brand-migration
status: reconciled
nyquist_compliant: true
wave_0_complete: false
created: 2026-09-21
reconciled: 2026-09-21
plans: 10
waves: 6
tasks: 27
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **Honest constraint (from `10-RESEARCH.md` §Validation Architecture):** no test framework by decision,
> and no local `next build` / `tsc` / `eslint` on the OneDrive mount. Validation is `tsx` CLI runs, live
> HTTP/DNS/TLS probes, `gh run` state, and — for the irreversible half — **timed external observation**.
> The Vercel **preview build** of the phase branch is the TypeScript gate for every new script.
>
> **What makes this phase different from 8 and 9:** it has a one-way door. Four of the five claim classes
> below cannot be settled by a single-point check — the thing being claimed changes on a timescale, or
> across a population, that one probe cannot see. The sampling rates in this document are the minimum
> sufficient rates, not a budget to trim.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — `tsx` + `node:assert/strict` CLIs and live probes (project decision, P8 D-01) |
| **Config file** | `package.json` `prebuild` chain (8 guards today, **9** after this phase, ~1.7 s) + `.github/workflows/verify-indexation.yml` |
| **Quick run command** | `npx tsx scripts/assert-redirects.ts` (~0.3 s, no network) |
| **Full suite command** | `npm run prebuild` && `npx tsx scripts/verify-redirects.ts` && `npx tsx scripts/verify-indexation.ts https://www.tpsklimaattechniek.nl` |
| **Estimated runtime** | ~2 s build gates · ~25 s for the 18-source × 2-request live probe |

---

## Sampling Rate

- **After every task commit:** `npx tsx scripts/assert-redirects.ts` (no network, sub-second).
- **After every plan wave:** `npm run prebuild` (9 guards green) **and** a pushed branch → Vercel preview
  that **loads**. On this repo the preview *is* the build; for this phase a preview that fails to load is
  the signature of an un-gated catch-all (§Pitfall 2).
- **Before the one-way door:** the full pre-flight table green — including the spoofed-`Host` probe against
  the **production custom domain** (not `*.vercel.app` — 403 `x-vercel-mitigated: deny`).
- **Before `/gsd-verify-work`:** `verify-redirects.ts` green in post-cutover mode; the `verify-indexation.yml`
  run triggered by the real production deployment green; all four manual artefacts present in
  `docs/baseline/<date>/`.
- **Max feedback latency:** ~0.3 s local assert · ~25 s live probe · ~2 min workflow.

### Where a single-point check aliases into a false pass

| Claim class | Single-point check | Why it **aliases** | Minimum sufficient sampling |
|---|---|---|---|
| **Redirect correctness** | Probe one source on one hostname | 18 independent rules; a typo in rule 7 is invisible when you sampled rule 1. And the trailing-slash finding makes the *slashed* form fail while the slash-less form passes — sampling the wrong form reports green on a broken map | **Exhaustive, never sampled:** all 9 × both hostnames, every run. Plus ≥3 catch-all samples and — mandatory — **one slash-less source** (`/over-ons`) as the trailing-slash regression canary. 18 + 4 requests ≈ 25 s; there is no reason to sample |
| **DNS propagation** | `dig` once, against the default resolver | The default resolver may hold a 28800 s cached answer (or a fresh one, by luck). One authoritative NS answering correctly says nothing about the other two — a partial zone push is the classic failure | **All three authoritative NS, twice:** immediately after the save and again ~5 min later. Two readings separated in time distinguish "propagated" from "caught it mid-push" |
| **Certificate issuance** | Check once, right after the flip | Vercel issues asynchronously: T+0 reports a false failure; a single check at T+2 min can report a false pass for a cert about to be replaced. **And the mail-cert risk is invisible at any time before 2026-10-29** | **T+2 min, T+15 min, T+30 min** on both legacy hostnames (T+30 is D-10's decision point), **plus a dated check on ~2026-10-30** for `mail.tpsventilatie.nl:993`. A 38-day-out failure cannot be sampled by any probe run on cutover day — only a calendar entry catches it |
| **Mail deliverability** | One outbound send (e.g. mail-tester) | Outbound-only. A broken MX or a DNS mistake kills *inbound*, which the send never touches. A single round-trip proves the state at one instant, not across SPF cache drain | **One reply round-trip at T+30 min** (proves both directions in one action — D-23), **plus the ≥8 h SPF lead time** (D-05) so the SPF change is fully propagated before the apex moves. The round-trip is the sample; the 8 h gap is what makes one sample sufficient |
| **GSC consolidation** | Check the week after cutover | Google's lag is weeks. One reading a week after cutover shows nothing and reads as failure; one reading at week 8 showing success cannot distinguish "consolidated at week 3" from "consolidated yesterday" | **Weekly, indefinitely** — the existing cron (D-25). Per-URL `googleCanonical` across the 9 legacy URLs (so a stuck URL is *named*) plus a 28-day impressions window. The legacy-not-moved flag deliberately does not fire before **week 8** |

---

## Per-Task Verification Map

> **Reconciled 2026-09-21** against the final layout: **10 plans, 6 waves, 27 tasks**. Every task has an
> `<automated>` verify, so sampling continuity holds trivially — there is no window of three consecutive
> tasks without one. Four requirements (MIG-04, MIG-08, MIG-09 and the Vercel attach half of MIG-07)
> keep a manual half, because only Thomas, Google or the registrar can settle them; in each case the
> automated command asserts the **artefact** that records the answer.
>
> **Wave-boundary facts this map encodes.** Waves 1–3 are reversible with no trace. Wave 4 (10-08) is the
> first DNS change and records `earliest_flip_at`. **Wave 5 (10-09) is the one-way door** — 10-09-01
> refuses to proceed while the ≥8 h SPF drain is unfinished. Wave 6 is post-flip, same day.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 10-01 | 1 | MIG-01 | T-10-false-pass | the requirement and the ROADMAP criterion are rewritten together, so the verifier cannot grade this phase against a criterion nobody intends to meet | source assertions | `node -e` over REQUIREMENTS/ROADMAP/PROJECT: new text present, superseded phrasing absent | n/a (docs) | ⬜ pending |
| 10-01-02 | 10-01 | 1 | — (RESEARCH Finding 1) | T-10-stale-instructions | the stale static-export claim is fixed at both GSD sources and the generated blocks are regenerated, never hand-patched | source assertions | `node -e` over CLAUDE.md: none of the five stale claims, `hybrid` present, all three markers and the hand-maintained guardrails intact | n/a (docs) | ⬜ pending |
| 10-02-01 | 10-02 | 1 | MIG-01 | T-10-mirror-scope / T-10-repo-bloat | bounded crawl — explicit seeds, `--domains`, `--no-parent`, `--level=2`, no `--mirror`, no `-e robots=off` | file assertions | `node -e` over the mirror: index.html + 9 slug pages, ≥20 files, ≥5 relative references resolve on disk, total under the ~25 MB ceiling | ❌ Wave 0 (this task creates it) | ⬜ pending |
| 10-02-02 | 10-02 | 1 | MIG-01 | T-10-mirror-pii | the committed mirror carries no admin artefact and no address beyond the public `info@` | file assertions | `node -e`: CAPTURE.md has the verbatim flags + wget version + UTC stamp; no `wp-admin`/`wp-login`/`wp-json` path; the address set equals {info@tpsventilatie.nl} | ✅ after Task 1 | ⬜ pending |
| 10-03-01 | 10-03 | 1 | MIG-05 | T-10-open-redirect | every destination is built from the `CANONICAL_ORIGIN` constant; only `:path*` is request-derived, and it is a path, never a host | unit-ish | `npx tsx -e`: 9 entries, D-13 judgement with a `why`, host pattern scoped, catch-all gated, emitted keys legal, checker clean on reality | ❌ Wave 0 (this task creates it) | ⬜ pending |
| 10-03-02 | 10-03 | 1 | MIG-05, MIG-06 | T-10-ungated-catchall / T-10-build-network | build fails on chain / duplicate / non-sitemap destination / un-gated catch-all, and the gate itself never touches the network | **negative proof** | `npx tsx scripts/assert-redirects.ts` and `npx tsx scripts/assert-gate-blocks.ts` (R1–R9, incl. the unperturbed control); prebuild chain ≥9 guards | ❌ Wave 0 (this task creates it) | ⬜ pending |
| 10-03-03 | 10-03 | 1 | MIG-07 | T-10-two-hop | `skipTrailingSlashRedirect` pinned and the internal normalisation rule re-added **last**, asserted against the array the config actually returns | config assertion + live | `npx tsx -e` over `@/next.config`: ≥11 rules, normalisation last, catch-all after the explicit nine, every legacy rule host-gated; plus a Vercel preview that **loads** | ✅ | ⬜ pending |
| 10-04-01 | 10-04 | 2 | MIG-03, MIG-04 | T-10-rollback-target / T-10-insecure-probe | `siteurl` left untouched so rollback stays a pure two-record revert; no `curl -k` anywhere | HTTP + doc | `curl` webmail = 200; `curl --resolve tpsventilatie.nl:443:195.78.67.39 …/wp-login.php` serves the real WordPress form; runbook greps for `s161…`, the hosts line and `2026-10-29` | ✅ | ⬜ pending |
| 10-04-02 | 10-04 | 2 | — (D-26) | T-10-insecure-probe | site copy reads brand strings from `SITE`, stays a Server Component, adds no hairline and no `#000` | source assertions | `npx tsx -e` imports `SITE.formerName`; `node -e` over Footer.tsx: reads `SITE.formerName`, no `use client`, no border, no `#000` | ✅ | ⬜ pending |
| 10-04-03 | 10-04 | 2 | MIG-04 (human half) | T-10-mig04-half-true | MIG-04 is green only when Thomas has actually logged in through the override, dated and recorded | **manual + artefact** | `node -e`: all three dated files under `docs/baseline/<date>/owner/`, with the WP-admin one recording a confirmation | manual-only | ⬜ pending |
| 10-05-01 | 10-05 | 2 | MIG-06, MIG-07 | T-10-two-hop / T-10-silent-host | exhaustive 9 × 2 one-hop assertion with the slash-less canary, requested through `curl` because Node `fetch` silently discards a `Host` header | live probe | `npx tsx scripts/verify-redirects.ts` — usage exits 2; Mode B skips loudly pre-cutover; source check for `LEGACY_REDIRECTS`, no `--insecure`, no concurrency, the canary and the diagnosed failure signatures | ❌ Wave 0 (this task creates it) | ⬜ pending |
| 10-05-02 | 10-05 | 2 | MIG-06 | T-10-expected-red / T-10-alert-sprawl | the CI step is green from merge and assertive from the declared cutover — no `continue-on-error`, one workflow, one alert label | CI config assertion | `node -e` + `js-yaml`: the step exists, pins and the Production gate unchanged, no `continue-on-error`, no second label; runbook §6 documents the probe | ✅ | ⬜ pending |
| 10-06-01 | 10-06 | 2 | MIG-09 | T-10-premature-retire / T-10-false-zero | the retirement flag is not an authorisation, and a missing legacy block is a gap rather than a zero | **negative proof** | `npx tsx -e` over `evaluateReading`: stuck canonical fires at week 8 and not before, N=4 zero streak fires and 3 does not, no-legacy-block fires nothing, the unperturbed control is silent | ❌ Wave 0 (this task creates it) | ⬜ pending |
| 10-06-02 | 10-06 | 2 | MIG-09 | T-10-discarded-measurement / T-10-secret-in-logs | a legacy API failure records a gap and the run continues; the key is read into one env var and never written to the repo | live API run | `node -e` source check (derives from `LEGACY_REDIRECTS`, `PROPERTY_LEGACY`, `aggregationType`, `pageFetchState`, non-fatal wrapper) + a real run to a temp dir yielding a `legacy` block with 9 URLs | ✅ | ⬜ pending |
| 10-06-03 | 10-06 | 2 | MIG-09 | T-10-premature-retire | the Dutch vocabulary states plainly that neither flag is permission to retire the map | doc assertion | `node -e`: both codes and `180` in the measurements README, the house rule intact, the workflow diff is comment-only | ✅ | ⬜ pending |
| 10-07-01 | 10-07 | 3 | MIG-07 | T-10-ungated-catchall | the live canonical site still serves direct 200s after the map ships to production | live HTTP + CI | three `curl --max-redirs 0` 200s on production; `gh run list` shows the `deployment_status` run green with the redirect step standing down | ✅ | ⬜ pending |
| 10-07-02 | 10-07 | 3 | MIG-07 | T-10-vercel-chain / T-10-stale-values | both hostnames attached with **no** Vercel-level redirect, and the flip values read off the dashboard rather than copied | **manual + artefact** + live | spoofed-`Host` request no longer returns `DEPLOYMENT_NOT_FOUND`; `node -e` over `vercel-target-records.md` (new A, new CNAME, old values, TTL 28800, date); `dig` proves DNS untouched | manual-only + ✅ | ⬜ pending |
| 10-07-03 | 10-07 | 3 | MIG-07, MIG-10 | T-10-preflight-misdiagnosis / T-10-wp-dormant | the whole map is proven green **before** any DNS change, and the rollback procedure is a copy-paste naming two triggers only | live probe + doc | `npx tsx scripts/verify-redirects.ts --via https://www.tpsklimaattechniek.nl` exits 0; `node -e` over the runbook (both triggers, both value sets, day 28, `Cancel Move`, the subscription) and the signed checklist with no blocking FAIL | ✅ | ⬜ pending |
| 10-08-01 | 10-08 | 4 | MIG-02 | T-10-registrar-suspension | the banner is read and the zone re-measured before anyone is told to edit anything | DNS probe + doc | three-NS `dig` confirms 28800/`195.78.67.39`/SPF-with-`a`/GSC token; `node -e` over the edit sheet (three edits, the do-not-touch list) | n/a (external) | ⬜ pending |
| 10-08-02 | 10-08 | 4 | MIG-02 | T-10-spf-widen / T-10-gsc-ownership / T-10-mail-records | SPF drops `a` while `mx` and the include keep the mail server authorized; the GSC TXT and all mail records are untouched | DNS probe ×3 NS, twice | per-nameserver `dig`: both A records ttl=300 value unchanged, SPF exactly the target string with no `a`, GSC token present, MX and `mail` A unchanged; zone diff limited to two TTLs + the SPF string | n/a (external) | ⬜ pending |
| 10-08-03 | 10-08 | 4 | MIG-02 | T-10-spf-widen | the ≥8 h SPF drain is a recorded timestamp, not an intention | file assertion | `node -e` parses `saved_at` and `earliest_flip_at` and asserts the gap is ≥8 h; public-resolver TTL readings recorded | ✅ | ⬜ pending |
| 10-09-01 | 10-09 | 5 | MIG-07 | T-10-spf-widen | the flip is blocked until the recorded drain has demonstrably passed | file assertion + DNS probe | `node -e` fails while `earliest_flip_at` is in the future; three-NS `dig` confirms the settled SPF and ttl=300 | ✅ | ⬜ pending |
| 10-09-02 | 10-09 | 5 | MIG-07 | T-10-two-hop / T-10-partial-push / T-10-mail-tls | one hop from both legacy hostnames, all three nameservers agreeing, valid certificates at T+30, mail records untouched | live probe + DNS ×3 NS + TLS | `dig` per nameserver (apex A, `www` CNAME, GSC TXT, MX, `mail` A); `npx tsx scripts/verify-redirects.ts --post-cutover`; `openssl s_client` at T+2/T+15/T+30 on both hostnames; `curl --resolve` proves WP still answers | ✅ | ⬜ pending |
| 10-09-03 | 10-09 | 5 | MIG-08 | T-10-mail-tls | send **and** receive proven by one reply, with `spf=pass dkim=pass dmarc=pass` captured as machine evidence | **manual + artefact** | `node -e` over the committed `.eml` (Received chain + the three passes) and `t30-decision.md`; `npx tsx -e` asserts `LEGACY_CUTOVER_DATE`; the bare probe now asserts; the production run is green | manual-only + ✅ | ⬜ pending |
| 10-10-01 | 10-10 | 6 | MIG-09 | T-10-coa-partial / T-10-coa-premature / T-10-gsc-ownership | filed from all three verified variants, same day, only after a green probe; the TXT record that keeps them verified is still present | **manual + artefact** + live | `npx tsx scripts/verify-redirects.ts` green first; `node -e` over `change-of-address.md` (three exact property ids, the target, dates, `Cancel Move`, `180`) + ≥3 screenshots; three-NS `dig` for the GSC token | manual-only + ✅ | ⬜ pending |
| 10-10-02 | 10-10 | 6 | MIG-10 | T-10-wp-dormant | every artefact has a manifest row; the two unrepeatable ones say so; the day-28 obligation is dated and `pending` | file assertions | `node -e`: manifest rows for all artefacts incl. the `.eml`, the not-reproducible voice present, `migration-final.md` with `status: pending`, a `due:` date, `28800` and the subscription line; runbook links it | ✅ | ⬜ pending |
| 10-10-03 | 10-10 | 6 | MIG-10 | T-10-mail-tls / T-10-gbp-takeover | the 2026-10-29 certificate risk is mitigated by prevention and detection, never rollback; the GBP URL edit is handed to Phase 11 unbatched | doc + TLS baseline | `node -e` over the runbook (date, `:993` command, the `s161` escape hatch, `migration-final`, `28800`) and ROADMAP §Phase 11 (D-27, no batching); a baseline `openssl` reading taken today; `curl --resolve` proves WP reachable | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

> Each gap now names the task that closes it.

- [ ] `lib/seo/redirects.ts` — MIG-05 (the data every gate reasons about; must land first) — **10-03-01**
- [ ] `lib/seo/cutover.ts` — the ONE place the cutover date is written; both the live probe and the weekly
      consolidation flag read it, so a second copy would be the parallel-list anti-pattern — **10-03-01**
      (created `null`), **10-09-03** (set at the flip)
- [ ] `lib/seo/redirect-invariants.ts` — the pure injectable checker, without which the assertions below
      cannot be perturbed at all — **10-03-01**
- [ ] `scripts/assert-redirects.ts` — MIG-05, MIG-06 (structural half); joins the `prebuild` chain as
      guard #9 — **10-03-02**
- [ ] `scripts/verify-redirects.ts` — MIG-06 (live half), MIG-07; Mode A for the pre-flight, Mode B after
      the cutover — **10-05-01**
- [ ] `brew install wget` — MIG-01 (blocking, trivial; **`wget` and `httrack` are both absent** on this
      machine) — the **first action** of **10-02-01**, not a prerequisite discovered mid-task
- [ ] Negative-proof harness for the structural assertions — the P8/P9 habit: *a gate that has never been
      observed failing has not been shown to work.* The assertions encoding the un-gated-catch-all, the
      destination-derivation and the `skipTrailingSlashRedirect` pin must **each** be watched to fire on a
      perturbed map, because those three encode the findings that would otherwise reach production —
      **10-03-02** as `(R1)`–`(R9)` in `scripts/assert-gate-blocks.ts`, addressed **by predicate, never by
      array position**, each asserting its own violation code, with an unperturbed control
- [ ] Negative proofs for the two legacy flags — both must be seen firing on fabricated readings *and*
      staying silent on an unperturbed control, before reality is asked — **10-06-01**

*(No test-framework install: none exists and none is wanted.)*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Thomas logs in to WP-admin through the hosts override | MIG-04 (D-22) | Only he holds the credentials — and the untested half is exactly the failure it insures against (nobody can reach the rollback target) | Dated confirmation recorded in the plan and in `docs/baseline/<date>/` |
| `info@tpsventilatie.nl` sends **and** receives | MIG-08 (D-23) | Only the mailbox owner can reply from it; **only his mail client can observe the TLS state** | Send from an external address → he replies → capture full headers → commit the `.eml` |
| Change of Address accepted ×3 | MIG-09 (D-24) | **No API exists.** Google is the observer; its pre-move checks are the verdict | GSC UI per property; screenshot the confirmation and the pre-move check result |
| dd24 record state + suspension banner | MIG-02, MIG-07 | Registrar panel; user-only by decision (D-07). That registrar suspended this domain once already | Screenshot before and after each of the two dd24 sessions |
| Vercel domains attached with **no** "Redirect to" | MIG-07 (D-08) | Dashboard state, not in git — **and the default is the wrong one** | Screenshot the Domains page showing both legacy hostnames with no redirect target |
| Google has consolidated the legacy URLs | MIG-09 | **Google is the only observer that can answer this**, on its own schedule. Nothing we serve can prove it | Weekly cron (D-25); `googleCanonical` per legacy URL |
| Mail certificate renewed past 2026-10-29 | research §Pitfall 4 | 38 days out — **no probe run during this phase can see it** | Calendar entry → `openssl s_client -connect mail.tpsventilatie.nl:993` |
| D-26 footer copy approved | D-26 | Site copy → the owner's editorial gate | Present wording options; record the choice and the date |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies — 27/27 tasks carry at least one `<automated>` block
- [x] Sampling continuity: no 3 consecutive tasks without automated verify — every task has one, so the window never opens
- [x] Wave 0 covers all MISSING references — `lib/seo/redirects.ts` + `lib/seo/cutover.ts` + `lib/seo/redirect-invariants.ts` (10-03-01), `scripts/assert-redirects.ts` + the R1–R9 negative proofs (10-03-02), `scripts/verify-redirects.ts` (10-05-01), the two legacy flags with their proofs (10-06-01), `brew install wget` as the first action of 10-02-01
- [x] No watch-mode flags — every command is a single-shot `tsx`, `node -e`, `curl`, `dig`, `openssl` or `gh` invocation
- [x] Feedback latency < 120 s — ~0.3 s for `assert-redirects.ts`, ~25 s for the 18-source × 2-request live probe, ~2 min for a workflow run
- [x] Task IDs reconciled to the final plan layout — 10 plans, 6 waves, 27 tasks
- [x] `nyquist_compliant: true` set in frontmatter

**Two claims deliberately left outside the phase gate** (they cannot be sampled by any probe run during
the execution window, and the phase's verification must not depend on them): the **day-28 declaration**
(recorded as `docs/baseline/<capture-date>/migration-final.md` with `status: pending` and a `due:` date,
by 10-10-02) and the **mail-certificate check on or around 2026-10-30** (recorded as a dated runbook
check with its command, its meaning and its `s161.cyber-folks.pl` escape hatch, by 10-10-03, with a
baseline `openssl` reading taken on cutover day for it to compare against).

**Approval:** reconciled to the plan layout on 2026-09-21
