# Phase 5: Lead Capture, Form Security & Launch QA - Context

**Gathered:** 2026-06-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the lead path the product it needs to be — a secure offerte form that never silently fails, an instant owner notification (WhatsApp + email), one site-wide sticky contact bar, and a launch-readiness QA pass. **This phase owns the static-export-vs-hybrid DECISION GATE** (QA-01), now resolved to **hybrid**, which unblocks server-side form security (QA-02), reliable notification (LEAD-02/QA-08), and image optimization (QA-07).

**In scope:** offerte form (LEAD-01/04/05/06), secure server route + notification (QA-01/02/08, LEAD-02), site-wide sticky contact bar (LEAD-03/04), and the mobile launch-QA pass (QA-05/06/07, SEO-10).

**Out of scope (own phases / v2):** full GHL CRM pipelines & nurture (CRM-V2-01), multi-step / conditional forms, A/B testing, live service-area validation, the homepage rebuild itself (Phase 6 — it only *consumes* this phase's form + sticky bar).

</domain>

<decisions>
## Implementation Decisions

> Decision IDs below are **Phase-5-local** (D-01…D-17). Project-wide decisions are referenced by their known names (e.g. *project D-01 apex canonical*, *project D-03 trailingSlash*) to avoid collision.

### Hosting & Notification — the Decision Gate (QA-01, QA-02, LEAD-02, QA-08)
- **D-01 — Hybrid hosting (THE gate, resolved):** Drop `output: "export"` from `next.config.ts`. Add **one** server Route Handler (e.g. `app/api/lead/route.ts`) that holds the GHL webhook secret **server-side (no `NEXT_PUBLIC_`)**, performs Zod validation + honeypot + rate limiting (QA-02), then POSTs to GHL. Every other page stays statically generated (SSG; `generateStaticParams` unchanged) — only the form POST is dynamic. **Preserve project D-03 `trailingSlash: false` and the project D-01 apex canonical (`https://tpsventilatie.nl`) when reconfiguring.** → **MUST be logged in `.planning/PROJECT.md` Key Decisions (QA-01) as part of this phase.**
- **D-02 — Owner notification = WhatsApp + email (both)** via the GHL workflow: instant phone push + durable email record. Serves the "owner notified within seconds" core value and the QA-08 bar.
- **D-03 — Secret + env:** GHL webhook URL/secret stored as a **Vercel env var scoped to Preview + Production** (not `NEXT_PUBLIC_`). The **agency configures the GHL workflow** (form trigger → WhatsApp + email) as part of this phase.
- **D-04 — QA-08 live test on preview:** Run the real submit → owner-notified test against a **Vercel preview deployment** (serverless functions run on previews — a true end-to-end proof). **Never push `main` / never `vercel --prod`** (main = production = launch; owner sign-off gated).

### Offerte form (LEAD-01, LEAD-05, LEAD-06, QA-04)
- **D-05 — Field set:** `naam` (required), `telefoon` (**required** — the callback channel), `e-mail` (**optional**), `postcode` (**required**, no service-area logic in v1), `dienst` (required), `bericht`. Phone-first keeps friction low on the field that converts.
- **D-06 — `dienst` input:** Dropdown of the 4 pillars (Airconditioning, Warmtepompen, WTW, Mechanische ventilatie) + **"Anders / weet ik nog niet"**, **context-prefilled** from the taxonomy/page when embedded on a pillar/service page or the Phase-6 homepage.
- **D-07 — Fail-safe (no silent hang):** Wrap submit in try/catch so a network rejection **or** non-OK response sets a visible error state. The error state offers **one-tap Bel (`tel:`) + WhatsApp (`wa.me`) fallback buttons** (from `SITE`) **+ retry**. Closes QA-04 + LEAD-05.
- **D-08 — AVG consent (LEAD-06):** Required consent checkbox linking to `/privacy-beleid`; **name GoHighLevel as verwerker (processor)** in the privacy policy text.
- **D-09 — Reassurance copy:** Near the form/CTA — *gratis, vrijblijvend, reactie binnen 24u* (Claude drafts, Dutch).
- **D-10 — Reusable component:** Build the form as a reusable component (e.g. `<OfferteForm>`) so service pages **and the Phase-6 homepage** embed it and post via the same secure route.

### Site-wide contact (LEAD-03, LEAD-04)
- **D-11 — One shared sticky contact bar (not a separate WhatsApp FAB):** Realize LEAD-03 as the **validated Sketch-003-D bar**, rendered at **`app/layout.tsx` / body level** (avoid the container-trap — no `transform`/`filter`/`container-type` ancestor). Contents **Bel · WhatsApp · Offerte**; **scroll-in ~200px** past top (so it never competes with a hero CTA); **dismissible (×)**; **mobile-safe** (`padding-bottom: max(12px, env(safe-area-inset-bottom))`, stacked < 560px); **reduced-motion-aware**. **Phase 6 inherits this exact component** — do not ship two competing always-on elements.
- **D-12 — Dismissal persists for the session** (`sessionStorage`); reappears on a fresh visit (avoids re-nagging across the multi-page site).
- **D-13 — Link sweep (LEAD-04):** Verify every CTA, `tel:`, `mailto:`, and `wa.me` link works across all pages (launch-QA task). All values source from `SITE`.

### Mobile launch-QA (QA-05, QA-06, QA-07, SEO-10)
- **D-14 — Motion gating (QA-06):** Do **not** mount `SoftAurora` (WebGL) or the canvas particle components (`AmbientParticles`/`FocalParticles`/`useParticleEngine`) on **mobile** — render the static gradient fallback there. On **desktop**, keep them but drop to a static snapshot for `prefers-reduced-motion`. Particles are main-thread canvas → the likeliest INP offender.
- **D-15 — Contact map (QA-05):** Keep the Google Maps **iframe** but correct its coordinates from **`SITE.geo` (52.04822769870841, 4.502050197039296)** and **lazy-load** it (`loading="lazy"` / mount on scroll-into-view) to limit CWV cost. (Current iframe shows 52.0623, 4.4932 — wrong.)
- **D-16 — Images (QA-07):** Remove `images.unoptimized` from `next.config.ts` (hybrid unlocks it); serve **WebP/AVIF + responsive sizes + lazy-loading via `next/image`**. Convert the hero set (`public/images/heroes/*`), the over-ons trust shot, and content `<img>` tags.
- **D-17 — CWV launch gate (SEO-10):** Verify **mobile INP < 200ms + good LCP** on the Vercel preview deployment (Lighthouse/PageSpeed) as a launch criterion.

### Claude's Discretion
- Server-route runtime/location, the rate-limiting mechanism, and the exact Zod schema (planner/researcher).
- The "Offerte" action target on the sticky bar (deep-link to `/contact` vs open the form inline) — keep simple.
- Whether to place a static thumbnail behind the lazy map iframe (optional polish).
- Image-conversion breadth — prioritize LCP-critical images first.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` — Phase 5 goal, **Decision Gate** wording, and the 5 success criteria.
- `.planning/REQUIREMENTS.md` — acceptance text for LEAD-01..06, QA-01/02/04/05/06/07/08, SEO-10.
- `.planning/PROJECT.md` — Key Decisions table (**log the QA-01 hybrid decision here**), Constraints (GHL lead routing, hosting), Out-of-Scope boundaries.

### Known issues this phase fixes
- `.planning/codebase/CONCERNS.md` — catalogued bugs (no form error handling, placeholder Maps pin) + security (client-exposed webhook, no input validation).
- `.planning/codebase/INTEGRATIONS.md` — GoHighLevel webhook integration shape + env var usage.

### Code touchpoints
- `lib/forms.ts` — current client-side `submitForm` (uses `NEXT_PUBLIC_GHL_WEBHOOK_URL`) → replace with a call to the new secure route.
- `components/ContactForm.tsx` — current form (naam/email/telefoon/bericht) + status state machine → extend to the new field set + fail-safe, refactor into reusable `<OfferteForm>`.
- `next.config.ts` — `output: "export"` + `images.unoptimized: true` → hybrid + `next/image` (keep project D-03 `trailingSlash: false`).
- `lib/constants.ts` — `SITE` (phone, phoneDisplay, email, whatsappUrl, geo verified pin, serviceRadiusKm); `CANONICAL_ORIGIN`.
- `app/contact/page.tsx` (≈ line 116) — Google Maps iframe with wrong coords → fix from `SITE.geo` + lazy-load.
- `components/SoftAurora.tsx`, `components/AmbientParticles.tsx`, `components/FocalParticles.tsx`, `lib/useParticleEngine.ts` — gate on mobile / `prefers-reduced-motion`.
- `components/CTABanner.tsx`, `components/ServiceHero.tsx`, `components/MobileMenu.tsx` — existing `SITE.whatsappUrl` links (reconcile under the new sticky bar + link sweep).

### Validated design — sticky contact bar
- `.claude/skills/sketch-findings-tps-ventilatie/SKILL.md` — homepage-uplift findings index + the explicit **Phase-5 coordination note** ("build ONE shared bar").
- `.claude/skills/sketch-findings-tps-ventilatie/references/trust-and-contact.md` — **Sketch-003-D** shared sticky bar: CSS, scroll-in JS, the container-trap warning, and mobile-safe rules. Port this to a React component at layout level.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`SITE` (`lib/constants.ts`)** — phone/phoneDisplay/email/whatsappUrl/geo/serviceRadiusKm. Every contact + map value sources here; no hardcoding (CLAUDE.md guardrail).
- **`ContactForm.tsx`** — existing form, the `"idle"|"sending"|"success"|"error"` state machine, and `bg-error-container` styling already exist. **Extend, don't rewrite**; refactor into a reusable `<OfferteForm>`.
- **WhatsApp links** already wired in `CTABanner` / `ServiceHero` / `MobileMenu` / contact page — sweep and reconcile so they don't compete with the new sticky bar.
- **Taxonomy (`lib/services/`, `pillars()`)** — source the `dienst` dropdown options + context prefill.
- **Sketch-003-D CSS/JS** (in `trust-and-contact.md`) — ready-to-port markup, `.cbar` CSS (uses `--glass-strong` / `--glass-blur` tokens), and the `scrollY > 200` show/hide JS.

### Established Patterns
- **`"use client"` boundary** — the form, sticky bar, and motion-gating are client components; pages stay server components.
- **Atmospheric Clarity** — no 1px borders (tonal layering), no pure black (`on-surface`), `Icon` wrapper, glass tokens for the bar.
- **Static export currently forces** `images.unoptimized` + no API routes — **the hybrid flip removes both constraints; it is the central enabling change** and should be sequenced first.
- **`<Suspense>` for `useSearchParams`** (PricingTabs precedent) — relevant if the form reads a query param for `dienst` prefill.

### Integration Points
- **New server Route Handler** (`app/api/lead/route.ts`) ← form POST → GHL webhook (secret server-side). `lib/forms.ts` becomes a thin client→route caller.
- **`next.config.ts` hybrid flip** touches the whole build (export → server) — sequence first, then re-verify all ~22 static routes still pre-render on **Vercel CI** (no local build — OneDrive deadlock).
- **Phase 6 homepage** will embed the reusable `<OfferteForm>` and inherit the layout-level sticky bar.

</code_context>

<specifics>
## Specific Ideas

- **Sticky bar = Sketch-003-D** ("Proof section + smart sticky bar", variant D): **Bel · WhatsApp · Offerte**; scroll-in ~200px; dismissible ×; window-fixed at body level; stacked < 560px; reduced-motion-aware. Source markup in `sources/003-trust-contact-band/index.html`.
- **Verified Maps pin** = `SITE.geo` **(52.04822769870841, 4.502050197039296)**; the live iframe currently shows **52.0623, 4.4932** (placeholder — wrong).
- **Owner notification within seconds** = **WhatsApp + email** via GHL.
- **Execution constraints (carry into planning/execution):** never push `main`; never `vercel --prod`; validate on **Vercel CI / preview** (no local `npm run build`/`tsx` — OneDrive deadlock); run GSD execution **inline** (no subagents/worktrees on the OneDrive mount).

</specifics>

<deferred>
## Deferred Ideas

- **Soft out-of-area postcode hint** (live check against the 60 km radius / 8 service areas) — considered for the form; deferred to keep v1 lean. Revisit if lead qualification needs it.
- **Full GHL CRM pipelines / nurture automation** beyond simple notification — v2 (CRM-V2-01).
- **Static map via Static Maps API (key)** — considered for the contact map; deferred in favor of the corrected lazy iframe (D-15).
- **Per-town / per-neighbourhood location pages** (programmatic local SEO) — surfaced in prior phases; v2 (BLOG-02), not this phase.

</deferred>

---

*Phase: 5-lead-capture-form-security-launch-qa*
*Context gathered: 2026-06-29*
