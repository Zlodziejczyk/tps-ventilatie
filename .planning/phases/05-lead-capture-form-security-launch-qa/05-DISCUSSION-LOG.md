# Phase 5: Lead Capture, Form Security & Launch QA - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-29
**Phase:** 5-lead-capture-form-security-launch-qa
**Areas discussed:** Hosting model (gate), Offerte form, WhatsApp & CTAs, Mobile launch-QA

---

## Hosting model (the decision gate — QA-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — hybrid | Drop `output:"export"`; one server Route Handler holds the GHL secret (Zod + honeypot + rate limit); pages stay SSG; re-enable `next/image` | ✓ |
| Stay static + external fn | Keep `output:"export"`; secret in a standalone Vercel Function / GHL proxy; build-time `sharp` | |
| You decide | Defer to the researched recommendation | |

**User's choice:** Yes — hybrid (Recommended)
**Notes:** Resolves the formal QA-01 go/no-go. Must be logged in PROJECT.md Key Decisions. Unblocks QA-02 (server secret), LEAD-02/QA-08 (notification), QA-07 (image opt).

| Option | Description | Selected |
|--------|-------------|----------|
| WhatsApp + email | Both fire via GHL — instant push + durable record | ✓ |
| WhatsApp/SMS only | Single instant push, no paper trail | |
| Email only | Durable but easier to miss / slower | |

**User's choice:** WhatsApp + email (Recommended)
**Notes:** Best serves "never miss a lead" + the QA-08 "within seconds" bar.

| Option | Description | Selected |
|--------|-------------|----------|
| Preview env + agency configures GHL | Secret as Vercel env (Preview+Prod); agency builds the GHL workflow this phase; live test on the preview URL | ✓ |
| GHL is already configured | Code to the existing webhook, test against it | |
| Stub now, wire real webhook at launch | Test sink now, defer the real wiring + live test | |

**User's choice:** Preview env + agency configures GHL (Recommended)
**Notes:** Serverless functions run on Vercel previews → true E2E proof without touching prod. Never push main / never `vercel --prod`.

---

## Offerte form (LEAD-01/05/06, QA-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Phone required, email optional | Telefoon required (callback channel), e-mail optional — lowest friction | ✓ |
| Phone + email both required | Current behavior — most complete, more friction | |
| Single combined contact field | Lowest friction, ambiguous downstream | |

**User's choice:** Phone required, email optional (Recommended)
**Notes:** First answered "both required", then asked to re-ask and switched to phone-required / email-optional.

| Option | Description | Selected |
|--------|-------------|----------|
| Dropdown + context prefill | 4 pillars + "Anders"; pre-selects from page/taxonomy | ✓ |
| Plain dropdown (no prefill) | Same select, always empty default | |
| Free text field | Flexible, messy to route | |

**User's choice:** Dropdown + context prefill (Recommended)
**Notes:** Reuses the taxonomy; supports service-page + Phase-6 homepage embedding.

| Option | Description | Selected |
|--------|-------------|----------|
| Required, no logic | Postcode required, no live checking — lean v1 | ✓ |
| Required + soft out-of-area hint | Inline note if outside served areas | |
| Optional | Lowest friction, weakens qualification | |

**User's choice:** Required, no logic (Recommended)
**Notes:** Geo-qualifiable lead without extra build. Out-of-area hint deferred.

| Option | Description | Selected |
|--------|-------------|----------|
| Error + tap-to-call & WhatsApp | Visible error + one-tap Bel/WhatsApp fallback + retry | ✓ |
| Error + retry only | No alternate channel | |
| Error + phone number as text | No one-tap action | |

**User's choice:** Error + tap-to-call & WhatsApp (Recommended)
**Notes:** Closes QA-04 + LEAD-05 — turns a failed submit into an alternate contact path.

---

## WhatsApp & CTAs (LEAD-03/04)

| Option | Description | Selected |
|--------|-------------|----------|
| Build the shared sticky bar now | Sketch-003-D bar at layout level (Bel · WhatsApp · Offerte); Phase 6 inherits it | ✓ |
| Standalone WhatsApp FAB now | Single button, reconcile in Phase 6 — risks two competing elements | |
| Minimal — existing links only | Defer the affordance to Phase 6 | |

**User's choice:** Build the shared sticky bar now (Recommended)
**Notes:** Honors the sketch-findings Phase-5 coordination note ("build ONE shared bar"). Pre-builds the Phase-6 contact band.

| Option | Description | Selected |
|--------|-------------|----------|
| Persist for the session | Hidden across navigations via sessionStorage | ✓ |
| Reset per page | Re-appears every page (raw sketch behavior) | |
| Not dismissible | Always on, no escape hatch | |

**User's choice:** Persist for the session (Recommended)
**Notes:** Avoids re-nagging across the multi-page site.

---

## Mobile launch-QA (QA-05/06/07, SEO-10)

| Option | Description | Selected |
|--------|-------------|----------|
| Off on mobile + honor reduced-motion | No aurora/particles on mobile (static fallback); desktop honors reduced-motion | ✓ |
| Reduce on mobile | Lighter versions everywhere — harder to guarantee INP | |
| Keep everywhere, gate only reduced-motion | Highest risk to the SEO-10 launch gate | |

**User's choice:** Off on mobile + honor reduced-motion (Recommended)
**Notes:** Particles are main-thread canvas — likeliest INP offender. Protects the launch CWV criterion.

| Option | Description | Selected |
|--------|-------------|----------|
| Facade — tap to open Maps | Static card + deep-link, no third-party JS on load | |
| Keep iframe, fix pin + lazy-load | Correct coords from SITE.geo, lazy-load the embed | ✓ |
| Static map image only | Lightest, loses directions affordance | |

**User's choice:** Keep iframe, fix pin + lazy-load
**Notes:** Keeps the familiar interactive map; pin corrected from SITE.geo; lazy-load mitigates the CWV cost.

| Option | Description | Selected |
|--------|-------------|----------|
| Re-enable next/image | Drop `unoptimized`; WebP/AVIF + responsive + lazy via next/image | ✓ |
| Build-time sharp | Pre-generate assets, plain `<img>` srcset | |
| You decide | Default to next/image | |

**User's choice:** Re-enable next/image (Recommended)
**Notes:** Cleanest fit for hybrid; convert hero set + over-ons + content imagery. Helps LCP.

---

## Claude's Discretion

- Server-route runtime/location, rate-limiting mechanism, exact Zod schema.
- Sticky-bar "Offerte" action target (deep-link vs inline form).
- Optional static thumbnail behind the lazy map iframe.
- Image-conversion breadth (LCP-critical first).

## Deferred Ideas

- Soft out-of-area postcode hint (live 60 km / 8-area check) — keep v1 lean.
- Full GHL CRM pipelines / nurture automation — v2 (CRM-V2-01).
- Static map via Static Maps API (key) — favored the corrected lazy iframe instead.
- Per-town / per-neighbourhood location pages (programmatic local SEO) — v2 (BLOG-02).
