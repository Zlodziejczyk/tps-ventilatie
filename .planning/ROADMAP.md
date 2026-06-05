# Roadmap: TPS klimaattechniek

## Overview

The TPS site already exists as a 6-page pre-launch proposal. This milestone expands it into a full ~22-page, SEO-driven, lead-generation climate-tech site (Airconditioning, Warmtepompen, WTW, Mechanische Ventilatie) and takes it to official launch. The build is strictly dependency-ordered: a single taxonomy data model feeds route generation, navigation, sitemap, and JSON-LD; templates render the 20+ pages; SEO infrastructure instruments those pages before any copy lands; unique owner-reviewed Dutch content fills them (the real quality gate against the Dec-2025 Core Update); and finally the lead path is secured and hardened, resolving the static-export-vs-hybrid decision that gates form security, instant owner notification, and image optimization. Every workstream serves one outcome: turn local search demand into contacted leads with the owner notified instantly.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Taxonomy & Data Model** - One typed source of truth for routes, nav, sitemap, and JSON-LD; fixed NAP/radius; keyword map; uniqueness bar (completed 2026-06-02)
- [x] **Phase 2: Routes & Service-Page Templates** - Data-driven hub + pillar + sub-service pages (~22) generated from the taxonomy with taxonomy-derived nav (completed 2026-06-05)
- [ ] **Phase 3: SEO Infrastructure** - Sitemap, robots, JSON-LD, canonical/OG, GBP alignment, and analytics + Search Console across every page
- [ ] **Phase 4: Content Fill & Editorial Gate** - Unique, accurate, owner-reviewed Dutch copy on every page (the launch quality gate)
- [ ] **Phase 5: Lead Capture, Form Security & Launch QA** - Secure lead path with instant owner notification, the static-vs-hybrid decision gate, and the launch-readiness QA pass
- [ ] **Phase 6: Homepage conversion uplift** - Premium conversion-optimized home page (proof-forward hero, equal 4-pillar grid, trust/contact band) built from the validated sketch findings

## Phase Details

### Phase 1: Taxonomy & Data Model

**Goal**: Establish a single typed source of truth for the entire service surface — slugs, URL structure, brand facts, content shells, the keyword map, the anti-thin-content uniqueness bar — and fix NAP/service-radius at the constants layer so it can never drift across the 20+ pages.
**Depends on**: Nothing (first phase)
**Requirements**: IA-01, IA-08, IA-09, SEO-08, QA-03
**Success Criteria** (what must be TRUE):

  1. A single taxonomy data model defines every pillar, sub-service, and brand relation — and routes, nav, sitemap, and JSON-LD all read from it (no parallel hardcoded lists exist)
  2. Each planned URL has exactly one assigned primary keyword/search intent recorded in a keyword map (no two URLs target the same intent)
  3. Every page type has typed required content fields (unique intro ≥120 words, service-specific steps, 3-6 FAQs, brand paragraphs, local angle) such that a missing field is visible/blocking
  4. The service radius reads one corrected value from `lib/constants.ts` — the 50 km / 100 km inconsistency no longer exists anywhere in the codebase
  5. NAP (name, address, phone, service area) resolves from one constants source, ready to feed both visible copy and structured data**Plans**: 6 plans (4 waves)

**Wave 1**

- [x] 01-01-PLAN.md — Build foundation: add zod + tsx (supply-chain gated), wire prebuild gate, add trailingSlash: false [wave 1]
- [x] 01-02-PLAN.md — Extend SITE into the full structured NAP source (name, radius 60, geo, serviceAreas) + SITE-shape assertion [wave 1]

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-03-PLAN.md — Fix the 50/100 km radius literals to read from SITE.serviceRadiusKm (QA-03) [wave 2]
- [x] 01-04-PLAN.md — Taxonomy types: PageNode discriminated union + ContentShell + Zod schemas (structure + status-gated + uniqueness) [wave 2]

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-05-PLAN.md — Taxonomy data: normalized brands + 4 pillar files (keyword map) + registry (PAGES, urlFor, validateTaxonomy) [wave 3]

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 01-06-PLAN.md — Prebuild gate + negative fixture (proves blocking) + Crit-4 radius grep + green npm run build [wave 4]

### Phase 2: Routes & Service-Page Templates

**Goal**: Turn the taxonomy into visible, navigable pages — the `/diensten` hub, 4 pillar pages, and ~17 sub-service pages — all generated from the data-driven template with stable URLs, so later SEO and content work has fixed targets.
**Depends on**: Phase 1
**Requirements**: IA-02, IA-03, IA-04, IA-05, IA-06, IA-07
**Success Criteria** (what must be TRUE):

  1. A visitor can open `/diensten` and reach all 4 pillars (Airconditioning, Warmtepompen, WTW, Mechanische Ventilatie), and from each pillar reach its sub-service pages
  2. All ~22 pages render from one template via `generateStaticParams` with `dynamicParams = false`, and the production build succeeds with every route pre-rendered
  3. Each Installatie page shows the correct brand sections (Daikin, Mitsubishi Electric, Mitsubishi Heavy, Mitsubishi Ecodan) via a reusable BrandGrid
  4. Reusable server-component building blocks (ServiceHero, ServiceSteps, ServiceFAQ, BrandGrid, RelatedServices, Breadcrumbs) render every service page consistently
  5. The Navbar diensten dropdown and DienstenNav reflect the live taxonomy with no hardcoded navigation entries

**Plans**: 6 plans (5 waves)

**Wave 1**

- [x] 02-01-PLAN.md — Registry lookups + render helpers (pillars, childrenOf, siblingsOf, brandsForPillar, trailFor, pillarTarievenTab) + assert-registry extension [wave 1]

**Wave 2** *(blocked on Wave 1)*

- [x] 02-02-PLAN.md — Six IA-05 server components: ServiceHero, ServiceSteps, ServiceFAQ, Breadcrumbs, BrandGrid, RelatedServices (graceful omit, text brand chips, cheap motion) [wave 2]

**Wave 3** *(blocked on Wave 2)*

- [x] 02-03-PLAN.md — Pillar + sub-service dynamic routes: generateStaticParams (4 + 17), async params, dynamicParams=false, generateMetadata (D-13) [wave 3]
- [x] 02-04-PLAN.md — Lean /diensten hub (4 pillar cards + reviews strip) + retire DienstenNav [wave 3]

**Wave 4** *(blocked on Wave 3 routes)*

- [x] 02-05-PLAN.md — Taxonomy-derived nav: Navbar mega-menu + MobileMenu 2-level accordion + remove DIENSTEN_DROPDOWN (IA-07) [wave 4]

**Wave 5** *(blocked on Wave 4)*

- [x] 02-06-PLAN.md — Content salvage port (D-04/D-05: drop Panasonic, fold dakventilator) + phase verification (green build, 22 routes pre-rendered) [wave 5]

**UI hint**: yes

### Phase 3: SEO Infrastructure

**Goal**: Make every page indexable and richly described before any final copy lands — programmatic sitemap and robots from the taxonomy, server-rendered JSON-LD, correct canonical/metadata/OG, Google Business Profile alignment, and live measurement so SEO isn't run blind.
**Depends on**: Phase 2
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-09
**Success Criteria** (what must be TRUE):

  1. `/sitemap.xml` (force-static, taxonomy-sourced) and `/robots.txt` resolve at build and list every canonical page with no drift from the route set
  2. Every page exposes a single absolute self-canonical with a consistent trailing-slash policy and a correct `metadataBase`, plus Open Graph / Twitter metadata
  3. Site-wide HVACBusiness/LocalBusiness JSON-LD plus per-page Service, BreadcrumbList, and FAQPage markup validate in Google's Rich Results Test (server-rendered, zero client JS)
  4. Zoetermeer + regio signals appear in page copy, metadata, and NAP, and the on-site NAP matches the Google Business Profile (categories, service area, verified maps pin)
  5. Analytics (Vercel Analytics, optional GA4) is collecting and Google Search Console is verified with the sitemap submitted

**Plans**: TBD
**UI hint**: yes

### Phase 4: Content Fill & Editorial Gate

**Goal**: Fill every page with unique, accurate, trust-building Dutch copy that clears the uniqueness bar and passes a hard owner editorial review — the real defense against the Dec-2025 Core Update / YMYL thin-content risk. This is an editorial phase, not a code phase.
**Depends on**: Phase 3
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-08, CONT-09, CONT-10
**Success Criteria** (what must be TRUE):

  1. Every pillar and sub-service page has unique copy (intro ≥120 words, service-specific steps, 3-6 unique FAQs, local angle) — no two pages are distinguishable only by their H1
  2. Per-pillar ISDE/subsidie content is accurate and sourced (Warmtepompen yes, WTW/MV yes from 2026 + insulation condition, Airco no), and pricing is transparent (all-in incl. BTW for Airco/WTW/MV; Warmtepompen "op maat via offerte" with inclusions)
  3. Brand install content and the certification/keurmerk block claim only marks and dealer statuses TPS genuinely holds (owner-verified)
  4. Over-ons shows the refreshed "Verhaal van Thomas" + 4 USPs, and reviews come from one consolidated source with Google score, count, and link on home and key pages
  5. The owner has reviewed and signed off on every page before it ships — no page goes live without editorial approval (hard gate)

**Plans**: TBD
**UI hint**: yes

### Phase 5: Lead Capture, Form Security & Launch QA

**Goal**: Make the lead path the product it needs to be — a secure offerte form that never silently fails, an instant owner notification, site-wide WhatsApp, and a launch-readiness QA pass. This phase OWNS the static-export-vs-hybrid DECISION GATE that unblocks server-side form security, reliable notification, and image optimization.
**Depends on**: Phase 4
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, LEAD-06, QA-01, QA-02, QA-04, QA-05, QA-06, QA-07, QA-08, SEO-10
**Decision Gate**: Resolve and log in PROJECT.md the static-export-vs-hybrid choice (recommended by all researchers: drop `output: "export"` → Vercel hybrid). This is a formal go/no-go that MUST be settled before planning the form work — it gates QA-02 (server-only webhook secret), LEAD-02/QA-08 (notification reliability), and QA-07 (image optimization). Surface it at the start of phase planning.
**Success Criteria** (what must be TRUE):

  1. A prospect can submit a short offerte form (naam, contact, postcode, dienst, bericht) with reassurance copy and AVG consent, and the owner is notified within seconds (real end-to-end submit → WhatsApp/email verified)
  2. The form fails safely: on error the visitor sees a visible error state with a phone/WhatsApp fallback — never a silent "sending" hang — and the lead path is secured (server-only webhook secret with no `NEXT_PUBLIC_`, Zod validation, honeypot, rate limiting)
  3. The static-export-vs-hybrid decision is resolved and logged in PROJECT.md, and the resulting `next.config.ts` supports the secure POST route and build-time WebP/AVIF image optimization
  4. A floating WhatsApp affordance is available site-wide and every CTA, `tel:`, `mailto:`, and `wa.me` link is verified working across all pages
  5. Mobile Core Web Vitals pass as a launch criterion (INP < 200ms, good LCP) with WebGL aurora + canvas particles gated on mobile / `prefers-reduced-motion`, and the Google Maps pin points to the verified business location

**Plans**: TBD
**UI hint**: yes

### Phase 6: Homepage conversion uplift

**Goal**: Rebuild the home page around the three validated sketch-findings winners — a proof-forward hero, an equal scannable 4-pillar grid with brand logos, and a trust + contact band with a smart scroll-in sticky CTA — delivering the premium "Atmospheric Clarity, engineered" UI language so the site's highest-traffic page turns visitors into contacted leads.
**Depends on**: Phase 5
**Requirements**: TBD
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Taxonomy & Data Model | 6/6 | Complete    | 2026-06-02 |
| 2. Routes & Service-Page Templates | 6/6 | Complete   | 2026-06-05 |
| 3. SEO Infrastructure | 0/TBD | Not started | - |
| 4. Content Fill & Editorial Gate | 0/TBD | Not started | - |
| 5. Lead Capture, Form Security & Launch QA | 0/TBD | Not started | - |
| 6. Homepage conversion uplift | 0/TBD | Not started | - |

## Coverage

All 43 v1 requirements mapped to exactly one phase (IA 9, CONT 10, LEAD 6, SEO 10, QA 8). No orphans, no duplicates. BLOG-01 and other v2 items are intentionally excluded from this launch roadmap.

| Phase | Requirements | Count |
|-------|--------------|-------|
| 1 | IA-01, IA-08, IA-09, SEO-08, QA-03 | 5 |
| 2 | IA-02, IA-03, IA-04, IA-05, IA-06, IA-07 | 6 |
| 3 | SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-09 | 8 |
| 4 | CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-08, CONT-09, CONT-10 | 10 |
| 5 | LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, LEAD-06, QA-01, QA-02, QA-04, QA-05, QA-06, QA-07, QA-08, SEO-10 | 14 |
| **Total** | | **43** |
