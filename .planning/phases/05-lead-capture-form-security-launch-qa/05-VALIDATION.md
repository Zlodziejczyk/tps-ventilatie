---
phase: 5
slug: lead-capture-form-security-launch-qa
status: in-progress
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-29
last_verified: 2026-06-29
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **Honest constraint (from RESEARCH.md):** the project has **no test framework** and adding one is **explicitly out of scope** this phase (REQUIREMENTS.md: "Test infrastructure + deep tech-debt refactors … revisit post-launch"). Local `next build` / `tsx` / `tsc` **deadlock on the OneDrive mount**. Therefore validation is **build-gate (Vercel CI/preview) + runtime Zod schema contract + preview-based manual & Lighthouse checks**, not a unit/e2e suite. These are the validation seams.

---

## Preview Verification (automated, 2026-06-29)

**Preview:** `https://tps-ventilatie-okkx3nxzc-pushly-projects.vercel.app` (branch `gsd/phase-05-lead-capture-form-security-launch-qa`, commit `ea574f0`, deploy `dpl_GjDZEjg…`). **`main`/production untouched.**

Run via `node scripts/test-lead-route.mjs <preview>` + targeted live checks:

| Check | Result |
|-------|--------|
| Hybrid build green; exactly **1** serverless function (`/api/lead`), rest static | ✅ (`lambdaRuntimeStats {"nodejs":1}`) |
| `/api/lead` malformed JSON → 400 | ✅ |
| `/api/lead` schema-invalid → 400 | ✅ |
| `/api/lead` field bounds (telefoon too short) → 400 | ✅ |
| `/api/lead` honeypot-filled → 200, **not** forwarded | ✅ |
| `/api/lead` consent:false (else valid) → 400 (consent enforced server-side) | ✅ |
| GHL webhook host **absent** from client bundle (12 assets + HTML scanned) | ✅ |
| Image optimizer serves AVIF (`/_next/image` → `Content-Type: image/avif`) | ✅ |

**Still pending** (genuinely external/visual/field): live owner notification (GHL workflow), forced-failure error UI (visual), sticky-bar behavior (visual), map pin (visual), no-canvas-on-mobile (visual), mobile **field** INP/LCP (PSI — anonymous API rate-limited; run in PSI UI or with a key).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | **None installed** — adding one is out of scope this phase |
| **Config file** | none |
| **Quick run command** | `git push` to a **non-`main`** branch → Vercel builds the preview (the build gate). Locally: **do NOT** run `next build` / `tsx` (OneDrive deadlock). Secure-path matrix: `node scripts/test-lead-route.mjs <preview-url>` |
| **Full suite command** | Vercel preview build = TypeScript type-check + prebuild taxonomy/claims gates + prerender of ~22 routes + `/api/lead` function build |
| **Estimated runtime** | ~1–3 min (Vercel CI) |

---

## Sampling Rate

- **Per task (where safe):** `npm install` + `npm run lint` only locally; **never** local `next build`.
- **After every plan wave / pushable checkpoint:** push the preview branch → Vercel build must be green (the de-facto "test run").
- **Phase gate:** preview build green **AND** the QA-08 live submit→notify proven on preview **AND** PageSpeed Insights / Lighthouse mobile **INP < 200 ms + good LCP** on the preview URL, before any owner sign-off.
- **Hard rule:** `main` / prod stays untouched — never push `main`, never `vercel --prod`.
- **Max feedback latency:** ~3 min (Vercel preview build).

---

## Per-Task Verification Map

| Requirement | Behavior to assert | Threat Ref | Test Type | Validation (where / how) | Status |
|-------------|--------------------|------------|-----------|--------------------------|--------|
| QA-01 | Build succeeds in hybrid; ~22 routes still SSG, `/api/lead` is a function | — | Build gate | Vercel preview build output: `○/●` static, `ƒ` for `/api/lead` | ✅ green (preview `ea574f0`: green build, exactly 1 `ƒ`) |
| QA-02 | Invalid/oversized/missing-field payloads rejected; honeypot-filled silently accepted-but-not-forwarded; secret absent from client bundle | T-5-secret / T-5-payload | Runtime contract + manual | `leadSchema` `safeParse`; `curl` preview `/api/lead`; grep client bundle for webhook string | ✅ green (preview: 400/400/200-no-fwd + bounds 400 + bundle secret absent) |
| LEAD-01 | Offerte form submits naam/telefoon/email/postcode/dienst/bericht via the secure route | — | Manual on preview | Submit a valid lead on preview; 200 + success UI | ⬜ pending (form renders; true 200 success needs live `GHL_WEBHOOK_URL`) |
| LEAD-02 / QA-08 | Real submit → WhatsApp + email to owner within seconds | — | Live E2E on **preview** | One clean submit; confirm both channels (agency-configured GHL) | ⬜ pending (GHL workflow + env) |
| LEAD-05 / QA-04 | Network failure + non-OK → visible error + Bel/WhatsApp/retry, never stuck "sending" | T-5-failsafe | Manual on preview | Force route 502 / offline; confirm error UI + fallback | ⬜ pending (visual — demonstrable NOW: no-env submit → 500 → fail-safe error) |
| LEAD-06 | Submit blocked without consent; privacy page names GHL as processor (verwerker) | — | Runtime contract + manual | `consent: z.literal(true)`; verify `/privacy-beleid` text | ✅ green (preview: consent:false→400 isolated; privacy names GoHighLevel) |
| LEAD-03 | One site-wide sticky contact bar (Bel · WhatsApp · Offerte), layout-level, scroll-in ~200px, dismissible | — | Manual on preview | Visual + interaction check on multiple routes | ⬜ pending (visual; mounted body-level in code) |
| LEAD-04 / D-13 | Every CTA, `tel:`, `mailto:`, `wa.me` link resolves on every page | — | Manual sweep | Click-through enumerated sites + bar + form fallback | ⬜ pending (link-source sweep code-clean — all from `SITE`; visual click-through outstanding) |
| QA-05 | Map pins the real location | — | Manual on preview | Visual check against `SITE.geo` | ⬜ pending (visual; `LazyMap` derives from `SITE.geo` in code) |
| QA-06 | No WebGL/canvas mounted on mobile; static fallback; reduced-motion honored on desktop | — | Manual on preview | DevTools mobile emulation + `prefers-reduced-motion` | ⬜ pending (visual; `useEnableHeavyMotion` gate in code) |
| QA-07 / D-16 | Images served as AVIF/WebP with srcset | — | Manual on preview | Network panel shows `image/avif`/`webp` + `srcset` | ✅ green (preview `/_next/image` → `Content-Type: image/avif`) |
| SEO-10 / D-17 | **Mobile INP < 200 ms + good LCP** | — | Lighthouse / PSI | Run against the **preview URL**; INP ≤ 200 ms, LCP ≤ 2.5 s | ⬜ pending (PSI anonymous API rate-limited; run in UI / with key; field INP needs traffic) |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] **No test framework** — and none will be added (out of scope). Validation is build-gate + Zod schema + manual preview checks. *(Deliberate gap, not an oversight.)*
- [ ] **GHL workflow** (form trigger → WhatsApp + email) must be agency-configured before QA-08 can be validated. External dependency.
- [ ] **Upstash integration** (or the chosen zero-infra fallback) must exist before QA-02 rate limiting can be validated. *(Route degrades to honeypot-only when absent — proven working on the preview without Upstash.)*

*Otherwise: existing build/prebuild gates cover phase verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Owner notified within seconds | LEAD-02 / QA-08 | Depends on external agency-configured GHL workflow + real channels | `node scripts/test-lead-route.mjs <preview> --send-real` → confirm WhatsApp + email both arrive |
| Fail-safe error affordance | LEAD-05 / QA-04 | No test runner; requires forced failure | Submit a valid lead on the no-env preview (route → 500) OR go offline → confirm visible error + Bel/WhatsApp/retry, never stuck "sending" |
| Mobile INP < 200 ms + good LCP | SEO-10 / D-17 | Real-device/field metric | PSI/Lighthouse mobile against the preview URL |
| Motion gating on mobile | QA-06 | Visual/runtime | Mobile emulation → confirm no `<canvas>`/WebGL mounts + reduced-motion on desktop |
| Maps pin correctness | QA-05 | Visual against geo constant | Compare rendered pin to `SITE.geo` |
| Sticky bar behavior | LEAD-03 | Visual/interaction | Scroll past ~200px on several routes; dismiss persists for session; stacks < 560px |

---

## Validation Sign-Off

- [x] All tasks map to a build-gate, Zod runtime contract, or an enumerated manual preview check
- [x] Sampling continuity: every wave ends in a green Vercel preview build
- [x] Wave 0 external dependencies (GHL workflow, Upstash) flagged in plans as `autonomous: false` where they block validation
- [x] No watch-mode flags; no local `next build`
- [ ] Phase gate: preview green + QA-08 live submit proven + mobile INP < 200 ms / good LCP
- [ ] `nyquist_compliant: true` set in frontmatter (after QA-08 + CWV proven)

**Approval:** pending — automated build/secure-path/AVIF/consent checks **green on preview**; awaiting GHL live notification (QA-08) + mobile CWV (SEO-10) + owner sign-off.
