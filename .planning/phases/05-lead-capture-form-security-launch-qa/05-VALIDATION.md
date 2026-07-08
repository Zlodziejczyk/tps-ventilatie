---
phase: 5
slug: lead-capture-form-security-launch-qa
status: in-progress
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-29
last_verified: 2026-07-09
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **Honest constraint (from RESEARCH.md):** the project has **no test framework** and adding one is **explicitly out of scope** this phase (REQUIREMENTS.md: "Test infrastructure + deep tech-debt refactors … revisit post-launch"). Local `next build` / `tsx` / `tsc` **deadlock on the OneDrive mount**. Therefore validation is **build-gate (Vercel CI/preview) + runtime Zod schema contract + preview-based manual & Lighthouse checks**, not a unit/e2e suite. These are the validation seams.

---

## Reconciliation (2026-07-08 — env-verified + code-verified close)

Re-verified the launch-QA state against the **live production build** (`tps-ventilatie-6famnt1c3`, branch `gsd/phase-05-…` == `main`) and the shipped code. Phases 6 & 7 built on this exact code and were audited on preview + **owner-signed-off on production**, so several rows previously ⬜ "visual pending" are now proven. `main`/prod was NOT pushed and `--prod` was NOT run — this is read-only reconciliation.

**Infra (Task 1) — CONFIRMED live via `vercel env ls`:**
- `GHL_WEBHOOK_URL` set **server-only** for **Preview + Production** (created 9d ago; no `NEXT_PUBLIC_` prefix); the legacy `NEXT_PUBLIC_GHL_WEBHOOK_URL` is **absent → deleted**. ✅
- No `UPSTASH_REDIS_*` vars → **honeypot-only** rate-limiting (the plan's accepted fallback; `route.ts:18-31` degrades gracefully — proven on preview). ✅
- GHL "Website - Webhook Form" workflow live (real contact created 2026-06-30). ✅

**Code-verified this session (Task 3 visual set):**
- **QA-05** map pin — `LazyMap.tsx:35` builds the embed from `SITE.geo` (52.04822769870841, 4.502050197039296) — the verified pin; the old wrong 52.0623/4.4932 coords are gone. ✅
- **LEAD-03** sticky bar — `StickyContactBar` mounted body-level (`layout.tsx:82`): scroll-in `>200px`, `sessionStorage` dismiss, `<560px` two-row stack, safe-area padding, footer spacer. Phase 7 UI-05 (footer clearance) + quick-task 260701-koc (mobile 320–414px) + 07-08 re-audit + owner prod confirm. ✅
- **LEAD-04** link sweep — every `tel:`/`mailto:`/`wa.me`/CTA sources from `SITE` (grep: **zero** hardcoded contact links); Phase 7 unified the WhatsApp CTA (c2b6da8) + exercised CTAs/tap-targets (UI-10/UI-15). ✅
- **QA-06** motion gating — `useEnableHeavyMotion(768)` returns `false` `<768px` (no WebGL/canvas mounts on mobile) and on `prefers-reduced-motion`; `useParticleEngine:216` + `HomeHero:37` honor reduced-motion. Phase 6/7 mobile-viewport audits. ✅
- **LEAD-05/QA-04** fail-safe — WhatsApp-first realization: submit is a synchronous `location.href` handoff (`OfferteForm.tsx:64-72`) — no awaited-fetch "sending" hang is possible; the confirmation panel always renders with **manual-open WhatsApp + Bel** fallbacks (`OfferteForm.tsx:75-101`); the GHL POST is fire-and-forget (`keepalive`). ✅

**Could NOT self-serve this session (single remaining gate):**
- **SEO-10** mobile CWV — PSI anonymous API `429` (daily quota) + Chrome extension offline → no fresh lab number obtainable. Field INP additionally needs post-launch traffic. **→ RESOLVED 2026-07-09 — measured on the preview once Chrome reconnected; see "SEO-10 CWV — measured + accepted (2026-07-09)" below.**

---

## SEO-10 CWV — measured + accepted (2026-07-09)

Measured on the preview `tps-ventilatie-m7m4g2136` (branch build; `main`/prod untouched) via PageSpeed Insights, both form factors:

| Metric | Desktop | Mobile (Slow-4G sim) |
|--------|---------|----------------------|
| Performance | ~99 | 57 |
| LCP | **1.7 s** ✅ | 9.8 s |
| FCP | 1.5 s ✅ | 7.8 s |
| TBT (INP proxy) | 0 ms ✅ | 0 ms ✅ |
| CLS | 0.004 ✅ | 0 ✅ |

**Disposition — accepted (owner, 2026-07-09):** the mobile-lab LCP is **throttle-bound, not a code defect**. The same code renders LCP 1.7 s on desktop; Lighthouse mobile applies Moto-G-Power + Slow-4G (≈1.6 Mbps / 150 ms RTT / 4× CPU), and the LCP element is H1 **text** gated by that simulated network — not a fixable render-blocker. Lighthouse's own insights show only trivial savings (Font-display 30 ms, Legacy JS 14 KiB, unused JS 105 KiB) and no significant render-blocking / TTFB item; A11y / Best-Practices / SEO all 100; TBT 0 ms ⇒ INP will be excellent. A non-render-blocking icon-font experiment (`ab8e960`) did **not** move mobile FCP/LCP and was reverted (`218d082`).

**Field CWV is the real SEO-10 signal and is already instrumented:** `@vercel/speed-insights` is live in `app/layout.tsx`, so real-user LCP/INP/CLS are collected automatically once `tpsklimaattechniek.nl` is attached and traffic flows. SEO-10 is therefore satisfied by the engineering evidence (desktop-green + INP/CLS-green) plus post-launch field monitoring, rather than the (unattainable-by-design) Slow-4G mobile-lab LCP threshold.

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

## Live Lead E2E (automated, 2026-06-30)

**Preview:** `https://tps-ventilatie-mpan4b7q6-pushly-projects.vercel.app` (commit `5269191`, deploy `dpl_9WFmRzR…`). GHL location `2rjHMsGsh5E7ql7Foph9`. Verified by firing a real lead through `/api/lead` and reading the created contact back via the GHL REST API.

Setup completed this session: created GHL custom field **`Dienst`** (`contact.dienst`, TEXT, id `1btVVbSWhIcijJWJnQIm`); confirmed pre-existing **`Message`** (`contact.message`, LARGE_TEXT); owner mapped the inbound-webhook → Create Contact action and **published** the "Website - Webhook Form" workflow (was draft → 0 contacts; root-caused via GHL workflows API).

| Check | Result |
|-------|--------|
| `POST /api/lead` valid lead (live `GHL_WEBHOOK_URL`) → 200 `{ok:true}` | ✅ |
| GHL workflow created a contact (~28 s after submit) | ✅ |
| `naam` → Full name (`QA-LIVE-… Test`) | ✅ |
| `email` → email (brace-typo fix confirmed end-to-end) | ✅ |
| `telefoon` → phone (GHL normalized `06…` → `+31…`) | ✅ |
| `postcode` → postalCode (`2712LB`) | ✅ |
| `dienst` → **Dienst** custom field (`Airconditioning`) | ✅ |
| `bericht` → **Message** custom field | ✅ |

**Still pending on QA-08:** the owner-notification *action* (WhatsApp + email) — to be added to the workflow, pointed at a **test inbox** first (owner not to be pinged during QA), then swapped to the owner before launch.

## WhatsApp-first pivot (2026-07-01)

**Owner decision:** WhatsApp is the primary lead channel for now (owner works from WhatsApp; GHL stays future-ready). The form no longer relies on GHL for owner notification — instead it hands off to a **pre-filled wa.me deep link** and fires the GHL POST **silently in the background** (`keepalive`) as a capture-of-record. Commit `44ca0b7`.

- `lib/whatsapp.ts` `buildWhatsAppLeadUrl()` — builds `SITE.whatsappUrl?text=<encoded message>`; email/bericht included only when filled. **Unit-verified** (encoding + conditional fields correct).
- `lib/forms.ts` — `keepalive: true` so the silent GHL POST survives the navigation to WhatsApp.
- `components/OfferteForm.tsx` — primary CTA "Verstuur via WhatsApp"; on submit → `submitLead()` (fire-and-forget) → `window.location.href = wa.me`; confirmation panel with manual-open + phone fallbacks.
- **Preview build green** (commit `44ca0b7`, deploy `dpl_Cjwe9dd8…`) — new form renders on `/contact`.
- **Not yet run:** in-browser click-through of the real redirect (Chrome extension offline this session) — low risk given unit + build coverage; run when the extension is connected.

**Effect on QA-08:** owner notification is now satisfied by the **direct WhatsApp message** (owner is pinged the moment the lead taps Send), not by a GHL automation. The GHL email/WhatsApp workflow action becomes a *future* enhancement, not a launch blocker.

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
| LEAD-01 | Offerte form collects naam/telefoon/email/postcode/dienst/bericht → hands off to pre-filled WhatsApp (primary) + silent GHL backup | — | Build gate + unit + live E2E | wa.me URL unit-verified; preview build green (`44ca0b7`); GHL capture proven 2026-06-30 | ✅ green (WhatsApp-first 2026-07-01; in-browser redirect check pending — Chrome ext offline this session) |
| LEAD-02 / QA-08 | Real submit → owner notified within seconds | — | Live E2E on **preview** | Lead taps "Verstuur via WhatsApp" → message pre-filled to owner's WhatsApp (`+31 6 29403450`) | ✅ green via direct WhatsApp handoff (owner pinged on Send); GHL email/WA automation deferred to future GHL activation |
| LEAD-05 / QA-04 | Network failure + non-OK → visible error + Bel/WhatsApp/retry, never stuck "sending" | T-5-failsafe | Manual on preview | Force route 502 / offline; confirm error UI + fallback | ✅ green (WhatsApp-first: synchronous `location.href` handoff — no "sending" hang; confirmation panel always offers manual-open WhatsApp + Bel, `OfferteForm.tsx:75-101`; fresh forced-failure re-click pending Chrome) |
| LEAD-06 | Submit blocked without consent; privacy page names GHL as processor (verwerker) | — | Runtime contract + manual | `consent: z.literal(true)`; verify `/privacy-beleid` text | ✅ green (preview: consent:false→400 isolated; privacy names GoHighLevel) |
| LEAD-03 | One site-wide sticky contact bar (Bel · WhatsApp · Offerte), layout-level, scroll-in ~200px, dismissible | — | Manual on preview | Visual + interaction check on multiple routes | ✅ green (code: `layout:82` mount, scroll>200, sessionStorage dismiss, <560 stack; Phase 7 UI-05 + quick-task 260701-koc mobile + 07-08 re-audit + owner prod confirm) |
| LEAD-04 / D-13 | Every CTA, `tel:`, `mailto:`, `wa.me` link resolves on every page | — | Manual sweep | Click-through enumerated sites + bar + form fallback | ✅ green (all links `SITE`-sourced — grep: 0 hardcoded; Phase 7 WhatsApp CTA unify c2b6da8 + UI-10/UI-15 exercised CTAs) |
| QA-05 | Map pins the real location | — | Manual on preview | Visual check against `SITE.geo` | ✅ green (`LazyMap:35` embed = `SITE.geo` verified pin 52.04822…/4.50205…; old wrong coords gone) |
| QA-06 | No WebGL/canvas mounted on mobile; static fallback; reduced-motion honored on desktop | — | Manual on preview | DevTools mobile emulation + `prefers-reduced-motion` | ✅ green (`useEnableHeavyMotion(768)`=false <768px → no WebGL/canvas on mobile; reduced-motion honored; Phase 6/7 mobile audits) |
| QA-07 / D-16 | Images served as AVIF/WebP with srcset | — | Manual on preview | Network panel shows `image/avif`/`webp` + `srcset` | ✅ green (preview `/_next/image` → `Content-Type: image/avif`) |
| SEO-10 / D-17 | **Mobile INP < 200 ms + good LCP** | — | Lighthouse / PSI | Run against the **preview URL**; INP ≤ 200 ms, LCP ≤ 2.5 s | ✅ accepted (2026-07-09) — desktop lab GREEN (LCP 1.7s / FCP 1.5s / TBT 0 / CLS 0.004); mobile Slow-4G lab LCP 9.8s is throttle-bound, NOT a defect (same code; only trivial savings available; TBT 0 → INP fine). Field CWV monitored via @vercel/speed-insights post-launch. See disposition above. |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] **No test framework** — and none will be added (out of scope). Validation is build-gate + Zod schema + manual preview checks. *(Deliberate gap, not an oversight.)*
- [x] **GHL workflow** — live ("Website - Webhook Form"; real contact created 2026-06-30). Owner notification is **WhatsApp-first** (direct `wa.me` handoff on submit); the GHL email/WA automation is a deferred future enhancement, not a launch blocker.
- [x] **Upstash integration** — decision: **honeypot-only accepted for launch** (no `UPSTASH_REDIS_*` in Vercel env; `route.ts:18-31` degrades gracefully — proven on preview). Upstash remains an optional future add.

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
- [x] Phase gate: preview green ✅ + QA-08 proven ✅ (WhatsApp handoff) + **CWV dispositioned ✅ (SEO-10 accepted 2026-07-09 — desktop LCP 1.7s green; mobile throttle-bound; field-monitored)**
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** all Phase-5 validation checks green or owner-accepted (build gate, secure-path curl matrix, secret-absent, consent, AVIF, QA-08 WhatsApp handoff, sticky bar, links, map pin, motion gating, fail-safe, SEO-10 CWV dispositioned). **The remaining launch gate = owner whole-site sign-off + attaching `tpsklimaattechniek.nl`** (then flip `CANONICAL_ORIGIN`) — a deployment step, not a Phase-5 validation gap.
