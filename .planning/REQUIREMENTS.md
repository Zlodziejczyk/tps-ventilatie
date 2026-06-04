# Requirements: TPS klimaattechniek

**Defined:** 2026-06-02
**Core Value:** Turn local search demand into contacted leads — a prospect in the Zoetermeer region looking for airco, heat-pump, or ventilation work finds TPS, trusts it, reaches out, and the owner is notified instantly.

## v1 Requirements

Launch scope. Decisions locked during initialization: **broaden to klimaattechniek**, **hub + sub-pages IA (full ~22-page set at launch)**, **brands as rich sections within Installatie pages**, **regio signals baked into pages (no separate city pages)**, **Claude drafts content / owner reviews**, **QA = blockers + hardening**.

### Information Architecture & Service Pages

- [x] **IA-01**: Service taxonomy data model (`lib/services/`) is the single source of truth for routes, nav, sitemap, and JSON-LD
- [ ] **IA-02**: `/diensten` hub page lists and links all 4 service pillars
- [ ] **IA-03**: 4 pillar pages (Airconditioning, Warmtepompen, WTW, Mechanische Ventilatie) generated from the data-driven template
- [ ] **IA-04**: ~17 sub-service pages generated from the taxonomy (Airco/WP: Installatie, Onderhoud, Reparatie & Storing, Advies · WTW: Vervangen, Onderhoud/Reinigen, Inregelen, Storing, Aanleggen · MV: Vervangen, Onderhoud/Reinigen, Storing, Aanleggen)
- [x] **IA-05**: Reusable service-template components (ServiceHero, ServiceSteps, ServiceFAQ, BrandGrid, RelatedServices, Breadcrumbs) as server components
- [ ] **IA-06**: Brand sections (Daikin, Mitsubishi Electric, Mitsubishi Heavy, Mitsubishi Ecodan) rendered within the relevant Installatie pages via BrandGrid
- [ ] **IA-07**: Navbar diensten dropdown and DienstenNav derived from the taxonomy (no hardcoded nav)
- [x] **IA-08**: Per-page uniqueness bar enforced via typed required content fields (anti-thin-content gate)
- [x] **IA-09**: Keyword map assigning one primary keyword/intent per URL (anti-cannibalization)

### Content (Claude drafts, owner reviews)

- [ ] **CONT-01**: Unique Dutch copy for every pillar page (intro ≥120 words, USPs, local angle)
- [ ] **CONT-02**: Unique Dutch copy for every sub-service page (service-specific intro + steps + 3-6 unique FAQs)
- [ ] **CONT-03**: Brand-specific install content (Daikin / Mitsubishi Electric / Heavy / Ecodan) with accurate "erkend installateur" claims
- [ ] **CONT-04**: Accurate per-pillar ISDE/subsidie content (WP ✅, WTW/MV ✅ 2026 + insulation condition, Airco ❌), sourced and linked
- [ ] **CONT-05**: Pricing transparency content — all-in incl. BTW for Airco/WTW/MV; Warmtepompen "op maat via offerte" with inclusions
- [ ] **CONT-06**: Certification/keurmerk trust block showing only genuinely-held marks (owner-verified)
- [ ] **CONT-07**: Refreshed Over-ons — "Verhaal van Thomas" + 4 USPs (Gecertificeerd, Snel, Persoonlijk, Transparant)
- [ ] **CONT-08**: Reviews consolidated to a single source; Google score + count + link shown on home and key pages
- [ ] **CONT-09**: FAQ content per pillar + general topics (kosten, garantie, subsidie, VvE/vergunning, geluid, onderhoud)
- [ ] **CONT-10**: Owner editorial review completed and signed off on every page before it ships (hard gate)

### Lead Capture & Communication (v1 — simple)

- [ ] **LEAD-01**: Offerte/contact form with reassurance copy (gratis, vrijblijvend, binnen 24u) and short field set (naam, contact, postcode, dienst, bericht)
- [ ] **LEAD-02**: Form submission triggers an instant owner notification (WhatsApp / email) via a GHL workflow
- [ ] **LEAD-03**: Floating WhatsApp contact affordance available site-wide
- [ ] **LEAD-04**: Every CTA, `tel:`, `mailto:`, and `wa.me` link verified working across all pages
- [ ] **LEAD-05**: Visible form error state with fallback to phone/WhatsApp — no silent "sending" hang
- [ ] **LEAD-06**: AVG/GDPR consent at the form + GoHighLevel named as processor in the privacy policy

### SEO — Technical, Local, Measurement

- [ ] **SEO-01**: Programmatic `sitemap.xml` sourced from the taxonomy with `dynamic = "force-static"`
- [ ] **SEO-02**: `robots.txt` via `app/robots.ts`
- [ ] **SEO-03**: JSON-LD — site-wide LocalBusiness/HVACBusiness + per-page Service, BreadcrumbList, and FAQPage (server-rendered)
- [ ] **SEO-04**: `metadataBase` + consistent `trailingSlash` + absolute self-canonical on every page
- [ ] **SEO-05**: Open Graph / Twitter card metadata across all pages
- [ ] **SEO-06**: Zoetermeer + regio signals baked into page copy, metadata, and NAP (no separate city pages in v1)
- [ ] **SEO-07**: Google Business Profile alignment (NAP, categories, service area, verified maps pin)
- [x] **SEO-08**: NAP consistency from a single source (`lib/constants.ts`), including the corrected service radius
- [ ] **SEO-09**: Analytics (Vercel Analytics + optional GA4) + Google Search Console verification + sitemap submission
- [ ] **SEO-10**: Page-speed pass with mobile Core Web Vitals (INP < 200ms, good LCP) as a launch criterion

### QA & Hardening (launch blockers)

- [ ] **QA-01**: Resolve and log the static-export-vs-hybrid decision (recommended: drop `output: "export"` → Vercel hybrid) in PROJECT.md
- [ ] **QA-02**: Secure form path — server-only webhook secret (no `NEXT_PUBLIC_`), Zod validation, honeypot, rate limiting
- [x] **QA-03**: Fix the service-area radius inconsistency (50 km vs 100 km) at the source
- [ ] **QA-04**: Add network error handling to form submission
- [ ] **QA-05**: Fix the placeholder Google Maps pin to the verified business location
- [ ] **QA-06**: Gate the WebGL aurora + canvas particles on mobile / `prefers-reduced-motion` (CWV)
- [ ] **QA-07**: Build-time image optimization (WebP/AVIF via re-enabled `next/image` or `sharp`)
- [ ] **QA-08**: End-to-end lead-notification test — real submit → owner notified within seconds

## v2 Requirements

Tracked but not in the launch roadmap. Blog is a fast-follow ("v1.x") right after the core service surface ships.

### Content & SEO Expansion

- **BLOG-01**: Light MDX blog / kennisbank (3-5 evergreen, locally-framed articles, internal links to pillars) — v1.x fast-follow
- **BLOG-02**: Per-location / per-neighbourhood pages (pillar × region) — only after Search Console shows converting queries
- **CONT-V2-01**: Dedicated brand pages (e.g. `/airconditioning/installatie/daikin`) for deeper brand keyword coverage
- **CONT-V2-02**: Onderhoudscontract offering with tiers
- **CONT-V2-03**: VvE / appartement guidance section
- **CONT-V2-04**: Energy-savings / gas-vs-airco framing with airco→warmtepomp cross-sell content

### Platform

- **CRM-V2-01**: Full GHL CRM pipelines / nurture automation beyond simple notification
- **CMS-V2-01**: Headless CMS for owner self-service content editing
- **DOM-V2-01**: Domain migration to `tpsklimaattechniek.nl` (301 plan + GBP + citation updates)

## Out of Scope

Explicitly excluded for this milestone.

| Feature | Reason |
|---------|--------|
| Dark mode | Not in scope (per CLAUDE.md) |
| Online price calculator / self-serve booking | Wrong fit for a consultative, site-survey-dependent sale |
| Customer portal / account system | No authenticated users; public brochure + lead-gen only |
| Test infrastructure + deep tech-debt refactors (PricingTabs split) | QA scope is blockers + hardening; revisit post-launch |
| Detailed heat-pump pricing tables | No standardized WP price list; quote-based |
| Generic town-name-swapped location pages | Anti-feature — Google Dec-2025 thin-content target |
| Claiming ISDE subsidy for airco / Belgian 6% BTW | Anti-feature — factually wrong; damages the "Transparant" USP |
| Multi-language (EN) | NL-only market for launch |

## Traceability

Each v1 requirement maps to exactly one phase. See `.planning/ROADMAP.md` for phase goals and success criteria.

| Requirement | Phase | Status |
|-------------|-------|--------|
| IA-01 | Phase 1 | Complete |
| IA-02 | Phase 2 | Pending |
| IA-03 | Phase 2 | Pending |
| IA-04 | Phase 2 | Pending |
| IA-05 | Phase 2 | Complete |
| IA-06 | Phase 2 | Pending |
| IA-07 | Phase 2 | Pending |
| IA-08 | Phase 1 | Complete |
| IA-09 | Phase 1 | Complete |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CONT-04 | Phase 4 | Pending |
| CONT-05 | Phase 4 | Pending |
| CONT-06 | Phase 4 | Pending |
| CONT-07 | Phase 4 | Pending |
| CONT-08 | Phase 4 | Pending |
| CONT-09 | Phase 4 | Pending |
| CONT-10 | Phase 4 | Pending |
| LEAD-01 | Phase 5 | Pending |
| LEAD-02 | Phase 5 | Pending |
| LEAD-03 | Phase 5 | Pending |
| LEAD-04 | Phase 5 | Pending |
| LEAD-05 | Phase 5 | Pending |
| LEAD-06 | Phase 5 | Pending |
| SEO-01 | Phase 3 | Pending |
| SEO-02 | Phase 3 | Pending |
| SEO-03 | Phase 3 | Pending |
| SEO-04 | Phase 3 | Pending |
| SEO-05 | Phase 3 | Pending |
| SEO-06 | Phase 3 | Pending |
| SEO-07 | Phase 3 | Pending |
| SEO-08 | Phase 1 | Complete |
| SEO-09 | Phase 3 | Pending |
| SEO-10 | Phase 5 | Pending |
| QA-01 | Phase 5 | Pending |
| QA-02 | Phase 5 | Pending |
| QA-03 | Phase 1 | Complete |
| QA-04 | Phase 5 | Pending |
| QA-05 | Phase 5 | Pending |
| QA-06 | Phase 5 | Pending |
| QA-07 | Phase 5 | Pending |
| QA-08 | Phase 5 | Pending |

**Phase totals:** Phase 1 = 5 · Phase 2 = 6 · Phase 3 = 8 · Phase 4 = 10 · Phase 5 = 14

**Coverage:**
- v1 requirements: 43 total (IA 9, CONT 10, LEAD 6, SEO 10, QA 8)
- Mapped to phases: 43 ✓ (every requirement in exactly one phase)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-02*
*Last updated: 2026-06-02 after roadmap creation (traceability populated)*
