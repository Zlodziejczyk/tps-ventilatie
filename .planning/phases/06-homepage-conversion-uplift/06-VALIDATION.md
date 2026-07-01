---
phase: 06
slug: homepage-conversion-uplift
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-01
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **Hard constraint (OneDrive mount):** local `next build`, full-project `tsc --noEmit`, and heavy test runs DEADLOCK. Validation = **(A) in-place source/structure asserts** (`grep`/`rg` + tiny pure-module `npx tsx`) + **(B) behavioral verification on the Vercel preview**. Execution is INLINE (no executor/verifier subagents on this mount). Full behavior→verification map lives in `06-RESEARCH.md` §Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | **None installed** (CLAUDE.md: "no test framework") — do NOT add Jest/Vitest for this phase |
| **Config file** | none — no framework introduced this phase |
| **Quick run command** | `grep`/`rg` source asserts + a single `npx tsx` importing only pure `lib/services`/`lib/reviews` (no React/Next graph) |
| **Full suite command** | push non-main branch → **Vercel preview build** (runs `prebuild` gates + `next build`: compiles + typechecks all routes) |
| **Estimated runtime** | in-place asserts ~seconds; preview build ~1–3 min on CI |

---

## Sampling Rate

- **After every task commit:** Run the grep/tsx source asserts for that task's decision (D-01…D-19).
- **After every plan wave:** Push branch → Vercel preview build must be green (prebuild gates + full route typecheck).
- **Before `/gsd-verify-work`:** Preview build green + preview behavioral gate (below) passes.
- **Max feedback latency:** ~seconds (in-place) / ~1–3 min (preview build).

---

## Per-Task Verification Map

> Task IDs are assigned when plans are written. Each task's `<automated>` verify draws from the decision→assert rows below (source: `06-RESEARCH.md` §Validation Architecture). Executor fills Task IDs + Status during execution.

| Decision | Local source assert (grep/tsx) | Preview verification | Test Type | Status |
|----------|--------------------------------|----------------------|-----------|--------|
| D-01 retired sections gone | `app/page.tsx` no longer imports HeroSection/ServicesSection/PricingSection/WhyTPSSection/ReviewsSection | Home renders new sections only | source | ⬜ pending |
| D-03 compact form → `/api/lead` | `OfferteForm` calls `submitLead` + `buildWhatsAppLeadUrl`; `variant`/controlled `dienst` present | `POST /api/lead → 200` (backup) + WhatsApp opens | source + preview | ⬜ pending |
| D-09 pillar → prefill + scroll | controlled `<select>` wiring + `onOfferte`/`scrollIntoView` | Click "Offerte" → dropdown shows pillar + scrolls to form | source + preview | ⬜ pending |
| D-04 responsive stack < 860px | `@container` + `@min-[860px]`/`@max-[860px]` classes present | Resize 800px → hero stacks; 375px pills clean (UI-07) | source + preview | ⬜ pending |
| D-04/D-19 CSS aurora, no WebGL | new sections: zero `SoftAurora`/`ogl`/`AmbientParticles`/`FocalParticles`/`canvas` | Aurora animates desktop, static on mobile/reduced-motion | source + preview | ⬜ pending |
| D-05 image band off LCP | `home-hero.jpg` uses `loading="lazy"`, **no** `priority` | PageSpeed: LCP element = hero H1 text, good LCP | source + preview | ⬜ pending |
| D-17/A11Y-01 AA WhatsApp | WhatsApp CTA ≠ `#25D366`+`text-white`; dark text on green or `text-primary` glyph | axe/contrast ≥ 4.5:1 text, ≥ 3:1 glyph | source + preview | ⬜ pending |
| D-18/A11Y-02 exactly one h1 | `<h1` count in new home sections == 1; no heading skips | axe heading-order clean | source + preview | ⬜ pending |
| D-15 static 3-up reviews | home does NOT import `ReviewCarousel` | 3 cards visible at once, no carousel controls | source + preview | ⬜ pending |
| D-13 WTW/MV neutral fallback | `npx tsx`: `brandsForPillar("wtw").length===0 && brandsForPillar("mechanische-ventilatie").length===0` | Cards show "diverse merken", not fabricated brands | tsx + preview | ⬜ pending |
| Pitfall 2 no token regressions | new files: zero hits for `var(--gradient-ink\|--glass-strong\|--shadow-\|--ease-clarity\|--color-bg-tint\|--color-text-faint)` | Visual: dark band, shadows, glass render | source + preview | ⬜ pending |
| D-18 guardrails | new files: no `#000`, no `1px solid`, no raw `material-symbols-outlined` span, no hardcoded phone (use `SITE`) | Visual review | source | ⬜ pending |
| D-19/SEO-10 INP < 200ms | (n/a locally) | Preview mobile Lighthouse/PageSpeed INP < 200ms + good LCP | preview | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] **No test framework — do NOT add one.** Wave 0 = confirm the grep/tsx assert commands run in-place and the preview pipeline is reachable (push a trivial branch → preview builds green).
- [ ] (Optional) `lib/initials.ts` extraction so `getInitials` is importable by the new sections without duplicating the ReviewCarousel copy.
- [ ] Confirm the inline Playwright harness resolves (memory: `ui-audit-harness`) for preview INP/contrast probes.

*No unit-test files are created this phase — validation is source-assert + preview-behavioral by design.*

---

## Manual-Only Verifications

| Behavior | Decision | Why Manual | Test Instructions |
|----------|----------|------------|-------------------|
| Mobile INP < 200ms + good LCP | D-19 / SEO-10 | Field/lab CWV can't be measured by local build (OneDrive deadlock) | Run PageSpeed Insights (mobile) against the Vercel preview URL; confirm INP < 200ms and LCP element is hero H1 text |
| AA contrast (WhatsApp CTA + text) | D-17 / A11Y-01 | Rendered-color contrast needs the live page | axe / contrast checker on preview: ≥ 4.5:1 text, ≥ 3:1 glyph |
| Compact-form E2E (POST 200 + WhatsApp) | D-03 | Needs the live `/api/lead` route + WhatsApp deep link | On preview: submit hero form → Network shows `POST /api/lead → 200`; WhatsApp opens with prefilled message |
| Pillar → form scroll + prefill gesture | D-09 | Interaction requires the live client island | On preview: click each pillar "Offerte" → hero `<select>` shows that pillar + viewport scrolls to the form |
| Owner content sign-off (H1/coverage copy, WTW/MV brands) | D-06 / D-13 | Business/authenticity decision | Owner reviews H1 + coverage line; confirms or supplies WTW/MV brand list (else neutral fallback ships) |

---

## Validation Sign-Off

- [ ] All decisions have a source/tsx assert or a documented manual/preview verification
- [ ] Sampling continuity: no 3 consecutive tasks without an in-place assert
- [ ] Wave 0 confirms assert commands + preview pipeline reachable (no framework added)
- [ ] No watch-mode flags; no local `next build`/`tsc` in the loop (OneDrive deadlock)
- [ ] Feedback latency acceptable (in-place ~s; preview ~1–3 min)
- [ ] `nyquist_compliant: true` set in frontmatter after plans wire each task to an assert

**Approval:** pending
