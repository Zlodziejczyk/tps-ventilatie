---
phase: 5
slug: lead-capture-form-security-launch-qa
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-29
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **Honest constraint (from RESEARCH.md):** the project has **no test framework** and adding one is **explicitly out of scope** this phase (REQUIREMENTS.md: "Test infrastructure + deep tech-debt refactors … revisit post-launch"). Local `next build` / `tsx` / `tsc` **deadlock on the OneDrive mount**. Therefore validation is **build-gate (Vercel CI/preview) + runtime Zod schema contract + preview-based manual & Lighthouse checks**, not a unit/e2e suite. These are the validation seams.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | **None installed** — adding one is out of scope this phase |
| **Config file** | none |
| **Quick run command** | `git push` to a **non-`main`** branch → Vercel builds the preview (the build gate). Locally: **do NOT** run `next build` / `tsx` (OneDrive deadlock) |
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

> Per-task IDs are finalized when `gsd-planner` runs. The requirement→validation map below is the contract each task's `<acceptance_criteria>` must satisfy.

| Requirement | Behavior to assert | Threat Ref | Test Type | Validation (where / how) | Status |
|-------------|--------------------|------------|-----------|--------------------------|--------|
| QA-01 | Build succeeds in hybrid; ~22 routes still SSG, `/api/lead` is a function | — | Build gate | Vercel preview build output: `○/●` static, `ƒ` for `/api/lead` | ⬜ pending |
| QA-02 | Invalid/oversized/missing-field payloads rejected; honeypot-filled silently accepted-but-not-forwarded; secret absent from client bundle | T-5-secret / T-5-payload | Runtime contract + manual | `leadSchema` `safeParse` is the assertion; `curl` preview `/api/lead` with bad/honeypot bodies; grep client bundle for webhook string (must be ABSENT) | ⬜ pending |
| LEAD-01 | Offerte form submits naam/telefoon/email/postcode/dienst/bericht via the secure route | — | Manual on preview | Submit a valid lead on preview; 200 + success UI | ⬜ pending |
| LEAD-02 / QA-08 | Real submit → WhatsApp + email to owner within seconds | — | Live E2E on **preview** | One clean submit; confirm both channels (agency-configured GHL) | ⬜ pending |
| LEAD-05 / QA-04 | Network failure + non-OK → visible error + Bel/WhatsApp/retry, never stuck "sending" | T-5-failsafe | Manual on preview | Force route 502 / offline; confirm error UI + tap-to-call/WhatsApp fallback | ⬜ pending |
| LEAD-06 | Submit blocked without consent; privacy page names GHL as processor (verwerker) | — | Runtime contract + manual | `consent: z.literal(true)` asserts it; visually verify `/privacy-beleid` text | ⬜ pending |
| LEAD-03 | One site-wide sticky contact bar (Bel · WhatsApp · Offerte), layout-level, scroll-in ~200px, dismissible | — | Manual on preview | Visual + interaction check on multiple routes; no container-trap | ⬜ pending |
| LEAD-04 / D-13 | Every CTA, `tel:`, `mailto:`, `wa.me` link resolves on every page | — | Manual sweep | Click-through enumerated sites + bar + form fallback; values from `SITE` | ⬜ pending |
| QA-05 | Map pins the real location | — | Manual on preview | Visual check against `SITE.geo` (52.04822769870841, 4.502050197039296) | ⬜ pending |
| QA-06 | No WebGL/canvas mounted on mobile; static fallback; reduced-motion honored on desktop | — | Manual on preview | DevTools mobile emulation + `prefers-reduced-motion` toggle; confirm no `<canvas>` mounts | ⬜ pending |
| QA-07 / D-16 | Images served as AVIF/WebP with srcset | — | Manual on preview | Network panel shows `image/avif`/`webp` + `srcset`; Lighthouse "next-gen formats" passes | ⬜ pending |
| SEO-10 / D-17 | **Mobile INP < 200 ms + good LCP** | — | Lighthouse / PSI | Run against the **preview URL**; INP ≤ 200 ms, LCP ≤ 2.5 s | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] **No test framework** — and none will be added (out of scope). Validation is build-gate + Zod schema + manual preview checks. *(Deliberate gap, not an oversight.)*
- [ ] **GHL workflow** (form trigger → WhatsApp + email) must be agency-configured before QA-08 can be validated. External dependency.
- [ ] **Upstash integration** (or the chosen zero-infra fallback) must exist before QA-02 rate limiting can be validated.
- [ ] *(Optional)* a single `tsx scripts/check-lead-schema.ts` mirroring the existing prebuild-gate style could assert the Zod schema accepts/rejects sample inputs — but the OneDrive deadlock means it must run in **Vercel CI** (extra prebuild step), not locally.

*Otherwise: existing build/prebuild gates cover phase verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Owner notified within seconds | LEAD-02 / QA-08 | Depends on external agency-configured GHL workflow + real channels | One clean submit on preview → confirm WhatsApp push + email both arrive |
| Fail-safe error affordance | LEAD-05 / QA-04 | No test runner; requires forced network failure | Force `/api/lead` to 502 / go offline → confirm visible error + Bel/WhatsApp/retry, never stuck "sending" |
| Mobile INP < 200 ms + good LCP | SEO-10 / D-17 | Real-device/field metric; can't assert in CI without runner | PSI/Lighthouse mobile run against the preview URL |
| Motion gating on mobile | QA-06 | Visual/runtime; no DOM test harness | Mobile emulation → confirm no `<canvas>`/WebGL mounts + reduced-motion honored on desktop |
| Maps pin correctness | QA-05 | Visual against geo constant | Compare rendered pin to `SITE.geo` |
| Next-gen image formats | QA-07 | Network-level observation | Network panel shows AVIF/WebP + srcset |

---

## Validation Sign-Off

- [ ] All tasks map to a build-gate, Zod runtime contract, or an enumerated manual preview check
- [ ] Sampling continuity: every wave ends in a green Vercel preview build
- [ ] Wave 0 external dependencies (GHL workflow, Upstash) flagged in plans as `autonomous: false` where they block validation
- [ ] No watch-mode flags; no local `next build`
- [ ] Phase gate: preview green + QA-08 live submit proven + mobile INP < 200 ms / good LCP
- [ ] `nyquist_compliant: true` set in frontmatter (after planning maps every task)

**Approval:** pending
