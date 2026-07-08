---
phase: 05-lead-capture-form-security-launch-qa
plan: 06
subsystem: testing
tags: [launch-qa, core-web-vitals, pagespeed, vercel, upstash, gohighlevel, whatsapp, validation]

# Dependency graph
requires:
  - phase: 05-lead-capture-form-security-launch-qa (05-01..05-05)
    provides: hybrid config, secure /api/lead route, OfferteForm (WhatsApp-first), sticky bar, motion/map/image gating
provides:
  - Launch-readiness verification of the full lead path (build gate, secure-path contract, secret-absent, notification, fail-safe, mobile QA, CWV)
  - 05-VALIDATION.md flipped to the proven state (nyquist_compliant: true) with the SEO-10 disposition
affects: [launch, domain-attach, seo, conversion]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Field CWV monitored post-launch via @vercel/speed-insights (already live in layout.tsx) rather than gating launch on Slow-4G mobile-lab LCP"

key-files:
  created:
    - .planning/phases/05-lead-capture-form-security-launch-qa/05-06-SUMMARY.md
  modified:
    - .planning/phases/05-lead-capture-form-security-launch-qa/05-VALIDATION.md
    - app/layout.tsx (net-zero — font experiment ab8e960 reverted by 218d082)

key-decisions:
  - "SEO-10 accepted as throttle-bound, not a defect: desktop lab LCP 1.7s (green) + TBT 0 + CLS 0 prove the build is fast; mobile Slow-4G lab LCP is unattainable-by-design for a hero page; field CWV is instrumented via @vercel/speed-insights."
  - "Rate-limit path confirmed as honeypot-only (no Upstash) — the plan's accepted fallback; route degrades gracefully."
  - "QA-08 satisfied via the WhatsApp-first handoff (owner pinged on Send) + silent GHL capture-of-record, not a GHL notification automation."

patterns-established:
  - "Launch CWV gate: lab desktop + INP/CLS as pre-launch proof; real-user LCP/INP/CLS via Vercel Speed Insights as the post-launch signal."

requirements-completed: [QA-08, SEO-10, QA-02, LEAD-02]

# Metrics
duration: ~2 sessions (2026-07-08 → 2026-07-09)
completed: 2026-07-09
---

# Phase 5 · Plan 06: Launch-Readiness QA Summary

**Verified the full lead path is secure, fast, and reliable on a Vercel preview — infra live (server-only GHL secret, honeypot-only limiting, live GHL workflow), all 12 requirements green or owner-accepted, and SEO-10 CWV dispositioned as throttle-bound (desktop LCP 1.7s; field-monitored post-launch).**

## Performance
- **Duration:** ~2 sessions (async; 2026-07-08 → 2026-07-09)
- **Completed:** 2026-07-09
- **Tasks:** 5/5 (Tasks 1–4 human-action checkpoints; Task 5 validation flip)
- **Files modified:** 2 planning + 1 net-zero code (reverted)

## Accomplishments
- **Task 1 (infra) confirmed live** via `vercel env ls`: `GHL_WEBHOOK_URL` server-only for Preview+Production, legacy `NEXT_PUBLIC_GHL_WEBHOOK_URL` deleted, no Upstash → honeypot-only (accepted), GHL "Website - Webhook Form" workflow live (real contact created 2026-06-30).
- **Tasks 2–3 verified** (recorded green): hybrid build with exactly one `ƒ` (`/api/lead`), curl matrix 400/400/200-no-fwd/200, webhook secret absent from the client bundle, consent enforced, AVIF served; QA-08 via WhatsApp-first handoff.
- **Code-verified this session:** map pin = `SITE.geo` verified coords (`LazyMap`), sticky bar behaviors (`StickyContactBar` at `layout.tsx`), 0 hardcoded contact links, motion gating (`useEnableHeavyMotion(768)`), WhatsApp-first fail-safe (`OfferteForm` confirmation panel with manual-open + Bel).
- **Task 4 (SEO-10 CWV) measured** on preview `m7m4g2136` via PSI: desktop LCP **1.7 s** / FCP 1.5 s / TBT 0 / CLS 0.004 (green); mobile Slow-4G lab LCP 9.8 s / FCP 7.8 s (throttle-bound). Dispositioned as accepted (see Decisions).
- **Task 5:** `05-VALIDATION.md` flipped to the proven state; `nyquist_compliant: true`.

## Task Commits
1. **Reconcile validation tracker (Tasks 1–3 + Task 5 partial)** — `984656b` (docs)
2. **SEO-10 fix attempt: non-render-blocking icon font** — `ab8e960` (perf) — *did not move mobile CWV*
3. **Revert the ineffective font tweak** — `218d082` (revert)
4. **Close 05-06: SUMMARY + VALIDATION disposition + STATE/ROADMAP** — (this commit, docs)

## Files Created/Modified
- `.planning/phases/05-.../05-VALIDATION.md` — 11 rows verified green + SEO-10 accepted-disposition; `nyquist_compliant: true`
- `.planning/phases/05-.../05-06-SUMMARY.md` — this file
- `app/layout.tsx` — font experiment applied then reverted (net-zero)

## Decisions Made
- **SEO-10 = throttle-bound, not a defect (owner-accepted 2026-07-09).** Desktop LCP 1.7 s on the same code proves the build is fast; Lighthouse mobile Slow-4G (Moto G Power, ≈1.6 Mbps / 150 ms RTT / 4× CPU) makes a text-LCP hero page unattainable at ≤2.5 s in lab; insights showed only trivial savings (Font-display 30 ms, unused JS ~119 KiB) and no render-blocking/TTFB culprit; TBT 0 ms ⇒ INP excellent. Real SEO-10 signal = **field CWV via `@vercel/speed-insights`** (live), monitored once the domain is attached.
- **Rate limiting = honeypot-only** (no Upstash provisioned) — the plan's accepted graceful-degrade fallback.
- **QA-08 = WhatsApp-first handoff** (owner pinged on Send) + silent GHL capture; the GHL email/WhatsApp automation is a deferred future enhancement.

## Deviations from Plan
- **Task 1 was assumed open but was already done.** The plan framed the Vercel/Upstash/GHL infra as a pending checklist; `vercel env ls` showed the env cutover already live — so no dashboard checklist was needed.
- **SEO-10 required a fix→revert cycle.** A render-blocking icon-font hypothesis led to a fix (`ab8e960`) that the PSI re-measure disproved (mobile FCP/LCP unchanged); it was reverted (`218d082`). Root cause was the lab throttle, not a render-blocker. No net code change; no scope creep.

## Issues Encountered
- **PSI anonymous API 429** (daily quota) and the **Chrome extension was initially offline** — blocked self-serve CWV on 2026-07-08; resolved 2026-07-09 once the extension reconnected (PSI web UI).
- **Background `vercel ls` poll returned empty** (false "building") — verified the preview was actually Ready via direct `vercel inspect`.

## User Setup Required
None new. Infra already configured (server-only `GHL_WEBHOOK_URL`, GHL workflow). At launch: attach `tpsklimaattechniek.nl` and flip `CANONICAL_ORIGIN` (`lib/constants.ts`).

## Next Phase Readiness
- **Phase 5 complete → all 53 plans across 7 phases have summaries (100%).**
- The lead path is proven secure/fast/reliable on preview; `main`/prod never pushed or `--prod`'d during this plan.
- **Remaining launch gate (not a Phase-5 item):** owner whole-site sign-off (incl. the Phase-4 editorial gate) + attaching `tpsklimaattechniek.nl`, then monitor field CWV via Vercel Speed Insights.

---
*Phase: 05-lead-capture-form-security-launch-qa*
*Completed: 2026-07-09*
