---
phase: 10
slug: reversible-old-brand-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-09-21
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

> **Populated after planning.** Task IDs are reconciled to the final plan layout once `10-*-PLAN.md`
> exists — the Phase 9 pattern. The requirement→behaviour→command mapping below is fixed now; only the
> Task ID and Plan/Wave columns are pending.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | MIG-01 | T-10-mirror-pii | mirror is public HTML/images only; grepped for form submissions, `wp-admin` artefacts and non-public addresses before commit | file assertions | `node -e` over `docs/baseline/<date>/legacy-site-mirror/` (index.html + ≥9 subdirs + `CAPTURE.md`); `du -sh` recorded | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | MIG-02 | T-10-spf-widen | SPF drops `a` ≥8 h before the apex moves, so the "Vercel IPs may send as the domain" window never opens | DNS probe | `dig +short TXT tpsventilatie.nl` matches `v=spf1 mx include:_spf.cyberfolks.pl -all`, at all three NS | ❌ cutover checklist | ⬜ pending |
| TBD | TBD | TBD | MIG-03 | — | host-level route, DNS-independent | HTTP + doc | `curl -sS -o /dev/null -w '%{http_code}' https://s161.cyber-folks.pl/webmail/` = 200; runbook grep | ❌ | ⬜ pending |
| TBD | TBD | TBD | MIG-04 | T-10-rollback-target | `siteurl` left untouched, so rollback stays a pure 2-record revert | HTTP + **manual** | `curl --resolve tpsventilatie.nl:443:195.78.67.39 …/wp-login.php` → real WordPress form; **plus** Thomas's dated confirmation | ❌ + manual half | ⬜ pending |
| TBD | TBD | TBD | MIG-05 | T-10-open-redirect | every destination built from the `CANONICAL_ORIGIN` constant; only `:path*` is request-derived, and it is a path, never a host | unit-ish | `npx tsx scripts/assert-redirects.ts` | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | MIG-06 | T-10-ungated-catchall | build fails on chain / duplicate source / non-sitemap destination / **un-gated catch-all** | **negative proof** | `npx tsx -e` feeding perturbed maps into the pure checker; each must exit non-zero | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | MIG-07 | T-10-two-hop | `skipTrailingSlashRedirect` pinned; internal trailing-slash rule re-added **last** | live probe | `npx tsx scripts/verify-redirects.ts` — 9 × 2 sources, exactly one hop, 200, plus the slash-less canary | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | MIG-08 | T-10-mail-tls | no `curl -k` / `--insecure` anywhere — the certificate **is** a rollback trigger (D-10) | **manual + artefact** | Thomas's reply `.eml` in `docs/baseline/<date>/mail/` showing `spf=pass dkim=pass dmarc=pass` | manual-only | ⬜ pending |
| TBD | TBD | TBD | MIG-09 | T-10-gsc-ownership | the GSC TXT record is immutable during both dd24 sessions; verified present immediately after each | **manual + artefact** | GSC UI × 3 properties; screenshot of the confirmation and the pre-move check result | manual-only | ⬜ pending |
| TBD | TBD | TBD | MIG-10 | T-10-wp-dormant | rollback doc names the accepted risk: a revert restores a possibly-compromised dormant install | doc + HTTP | runbook §rollback greps for **both** old and new record values; `curl --resolve` → WP 200 | ❌ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/seo/redirects.ts` — MIG-05 (the data the gates reason about; must land first)
- [ ] `scripts/assert-redirects.ts` — MIG-05, MIG-06 (structural half); joins the `prebuild` chain
- [ ] `scripts/verify-redirects.ts` — MIG-06 (live half), MIG-07
- [ ] `brew install wget` — MIG-01 (blocking, trivial; **`wget` and `httrack` are both absent** on this machine)
- [ ] Negative-proof harness for the structural assertions — the P8/P9 habit: *a gate that has never been
      observed failing has not been shown to work.* The assertions encoding the un-gated-catch-all, the
      destination-derivation and the `skipTrailingSlashRedirect` pin must **each** be watched to fire on a
      perturbed map, because those three encode the findings that would otherwise reach production.

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

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120 s
- [ ] Task IDs reconciled to the final plan layout
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
