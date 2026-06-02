# TPS klimaattechniek

## What This Is

TPS klimaattechniek is a Zoetermeer-based climate-technology installer — airconditioning, heat pumps (warmtepompen), and ventilation (WTW + mechanical). This is their marketing website: currently a **pre-launch proposal** that established the look, feel, and core page set, now being expanded into a full multi-service, SEO-driven lead-generation site and prepared for official launch.

Built with Next.js 16 (App Router, static export), TypeScript, and Tailwind CSS v4 ("Atmospheric Clarity" design system), deployed on Vercel. Built and maintained by Pushly.nl for the client (owner: Thomas / Tomasz) as an ongoing development + maintenance engagement.

## Core Value

**Turn local search demand into contacted leads.** A prospect in the Zoetermeer region looking for airco, heat-pump, or ventilation work finds TPS, trusts it, and reaches out — and the owner is notified instantly. Every workstream (service depth, SEO, content, conversion) serves this one outcome.

## Requirements

### Validated

<!-- Built and present in the codebase (pre-launch — proven to exist, not yet validated by live users). Inferred from .planning/codebase/ map (2026-06-01). -->

- ✓ Static Next.js 16 brochure site, statically exported and deployed on Vercel — existing
- ✓ Home page: animated hero (WebGL aurora), services overview, pricing preview, Waarom TPS, reviews carousel, CTA banner — existing
- ✓ Diensten page covering WTW, Mechanische Ventilatie, and an Airco stub — existing
- ✓ Tarieven page with tabbed pricing (WTW, MV, Airco) — existing
- ✓ Over-ons, Contact (form + Google Maps embed), and Privacy-beleid pages — existing
- ✓ Navbar with dropdowns + mobile menu, and a 4-column Footer with business data — existing
- ✓ Contact form wired to GoHighLevel via client-side webhook (`submitForm`) — existing
- ✓ "Atmospheric Clarity" design system: Material Design 3 tokens, Tailwind v4 `@theme inline`, no-border tonal layering — existing
- ✓ Animation system: Framer Motion (AnimateOnScroll, StaggerChildren), WebGL aurora, canvas particles — existing
- ✓ Single source of truth for business data and navigation (`lib/constants.ts`) — existing

<!-- Delivered by GSD phases (proven in-codebase, build-verified). -->

- ✓ **Taxonomy data model** — typed single source of truth in `lib/services/`: a `PageNode` discriminated union + Zod-validated registry of 27 nodes (1 hub + 4 pillars + 17 sub-services + 5 static), the sole `urlFor()` href builder, a normalized brand registry, and the IA-09 keyword map — with a build-blocking prebuild gate enforcing URL/keyword uniqueness and the anti-thin-content bar — _Validated in Phase 1 (IA-01, IA-08, IA-09)_
- ✓ **NAP single source of truth** — `SITE` extended with the full structured field set (brand name corrected to "TPS klimaattechniek", address/postcode/city/province/country, geo, serviceAreas, serviceRadiusKm) — _Validated in Phase 1 (SEO-08)_
- ✓ **Service-radius inconsistency fixed at the source** — `SITE.serviceRadiusKm = 60`; all visible copy (tarieven, PricingTabs, WhyTPSSection) derives from it; a grep gate guards against regressions — _Validated in Phase 1 (QA-03)_

### Active

<!-- This milestone: take the proposal to launch-ready as a full climate-tech, SEO-driven lead site. -->

**Information architecture & service pages**
- [ ] Restructure services into a `/diensten` hub + 4 pillar pages: Airconditioning, Warmtepompen, WTW, Mechanische Ventilatie
- [ ] Per-sub-service pages under each pillar (~20+ pages total) — Installatie / Onderhoud / Reparatie & Storing / Advies (climate); Vervangen / Onderhoud-Reinigen / Inregelen / Storing / Aanleggen (ventilation)
- [ ] Build on a **data-driven service-page template** — define the service taxonomy once, generate pages — so the 20+ page set stays maintainable
- [ ] Add **Warmtepompen** as a net-new pillar (brands: Daikin, Mitsubishi Ecodan)
- [ ] Promote **Airconditioning** from placeholder to first-class (brands: Daikin, Mitsubishi Electric, Mitsubishi Heavy)
- [ ] Update Navbar diensten dropdown + DienstenNav to reflect the new structure

**Content (Claude drafts, owner reviews)**
- [ ] Draft Dutch SEO copy for all new/expanded service + sub-service pages
- [ ] Brand-specific installation content (Daikin / Mitsubishi Electric / Mitsubishi Heavy / Mitsubishi Ecodan)
- [ ] Light blog / FAQ for SEO and trust signals
- [ ] Consolidate reviews into one source; refresh Over-ons "Verhaal van Thomas" + 4 USPs (Gecertificeerd, Snel, Persoonlijk, Transparant)

**Lead capture & communication (v1 — simple)**
- [ ] Contact-form submission triggers an **instant owner notification** (WhatsApp / email) via a GHL workflow
- [ ] Floating WhatsApp contact affordance, available site-wide
- [ ] Verify every CTA, `tel:`, `mailto:`, and `wa.me` link works across all pages

**SEO — all fronts**
- [ ] Technical: `sitemap.xml`, `robots.txt`, JSON-LD (LocalBusiness + Service), Open Graph / Twitter meta, page-speed pass
- [ ] Local: Google Business Profile alignment, Zoetermeer + regio keyword targeting, NAP/location signals
- [ ] Content: SEO-optimized service pages + blog/FAQ
- [ ] Measurement: GA4 (or Vercel Analytics) + Google Search Console + sitemap submission (can't run aggressive SEO blind)

**QA & hardening (launch blockers)**
- [x] Fix service-area radius inconsistency (50 km vs 100 km across pages) — Phase 1 (QA-03) ✓
- [ ] Add network error handling to form submit (no silent "sending" hang)
- [ ] Fix placeholder Google Maps pin to the verified business location
- [ ] Add form input validation (schema) + honeypot anti-spam
- [ ] Secure the lead path — resolve the client-exposed webhook (see Key Decisions)

**Owner feedback**
- [ ] Apply the owner's page-structure vision (captured) and fold in further feedback as it arrives

### Out of Scope

<!-- Explicit boundaries for THIS milestone, with reasons. -->

- Full GHL CRM pipelines / automation beyond simple lead notification — keep v1 simple; full CRM is a later milestone
- Test infrastructure + deep tech-debt refactors (PricingTabs split, data consolidation) — QA scope is blockers + hardening only; revisit post-launch
- Detailed heat-pump pricing tables — quote-based for now (no standardized price list yet)
- Domain migration to `tpsklimaattechniek.nl` — owner to verify; launch stays on `tpsventilatie.nl`, not blocking
- Dark mode — explicitly excluded (per CLAUDE.md)
- Headless CMS — Claude-drafted content lives in-repo (MDX / data files); CMS deferred until the owner needs self-service editing

## Context

- **Pre-launch:** the current site is the first proposal shown to the owner. It set the look/feel and base pages but is **not yet publicly launched**.
- **Existing build** (per `.planning/codebase/` map, 2026-06-01): Next.js 16 static export on Vercel; 6 routes; contact form → GoHighLevel webhook; "Atmospheric Clarity" design system; Framer Motion + WebGL aurora + canvas particles; all business data centralized in `lib/constants.ts`.
- **Agency engagement:** built and maintained by Pushly.nl (Oskar) for client TPS — ongoing development + maintenance.
- **GoHighLevel:** Agency subscription available (forms, workflows, notifications, reputation/GBP). Used **lightly in v1** — owner notification only.
- **Owner (Thomas / Tomasz):** provided the expanded page-structure vision and reviews; is broadening the business from "ventilatie" to full "klimaattechniek".
- **Known issues** catalogued in `.planning/codebase/CONCERNS.md`: bugs (radius inconsistency, no form error handling, placeholder Maps pin), security (client-exposed webhook, no input validation), missing SEO infra (no sitemap/robots/JSON-LD/OG), and zero test coverage.

## Constraints

- **Tech stack:** Next.js 16 App Router + TypeScript + Tailwind v4 — keep. Currently `output: "export"` (fully static); may need to relax to a hybrid (one server route) to secure the form — open decision.
- **Design system:** "Atmospheric Clarity" — no 1px section borders (use tonal background layering), no 100% black text (`on-surface` #141D1F), Material Symbols via the `Icon` wrapper, business data via the `SITE` constant. Never modify `.stitch/` or `.firecrawl/`.
- **Language:** all site-facing content in Dutch (`nl`).
- **Content model:** Claude drafts content from research + owner notes; owner reviews/approves before publish.
- **Timeline:** quality-gated ("when it's right") — favor thoroughness; no hard deadline.
- **Hosting:** Vercel (project `prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q`).
- **Lead routing:** GoHighLevel webhook + workflow for instant owner notification.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Broaden positioning to "klimaattechniek" | Owner added heat pumps + airco; the business is full climate-tech, not just ventilation | — Pending |
| Service IA = `/diensten` hub + pillar + sub-service pages (~20+) | Maximize local-SEO surface per service × brand × region | — Pending |
| Data-driven service-page template | Keep 20+ pages maintainable from a single taxonomy source | — Pending |
| Claude drafts content, owner reviews | Move fast without blocking on the owner for every page | — Pending |
| Lead capture v1 = form → instant owner notification (GHL) | Simple conversion + comms now; full CRM later | — Pending |
| QA scope = blockers + hardening (defer tests/refactors) | Reach launch-readiness without over-investing pre-launch | — Pending |
| Stay on `tpsventilatie.nl` for launch | `tpsklimaattechniek` domain unverified; not blocking work | — Pending |
| Keep content in-repo (MDX/data), no CMS yet | Avoid CMS overhead; owner is not self-editing yet | — Pending |
| Static-export vs hybrid for a secure form route | Securing the webhook wants a server route, which conflicts with `output: "export"` | ⚠️ Revisit (resolve in comms/QA planning) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-02 — Phase 1 (Taxonomy & Data Model) complete*
