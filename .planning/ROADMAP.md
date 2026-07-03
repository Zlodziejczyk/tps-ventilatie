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
- [x] **Phase 3: SEO Infrastructure** - Sitemap, robots, JSON-LD, canonical/OG, GBP alignment, and analytics + Search Console across every page (completed 2026-06-06)
- [ ] **Phase 4: Content Fill & Editorial Gate** - Unique, accurate, owner-reviewed Dutch copy on every page (the launch quality gate)
- [ ] **Phase 5: Lead Capture, Form Security & Launch QA** - Secure lead path with instant owner notification, the static-vs-hybrid decision gate, and the launch-readiness QA pass
- [x] **Phase 6: Homepage conversion uplift** - Premium conversion-optimized home page (proof-forward hero, equal 4-pillar grid, trust/contact band) built from the validated sketch findings (completed 2026-07-01)
- [ ] **Phase 7: UI/UX & Accessibility Remediation** - Bring every page to WCAG 2.1 AA (contrast, heading order, skip-link/landmarks, touch targets) and apply brand-consistency polish, from the 2026-06-30 UI/UX audit (8.7/10)

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

**Plans**: 8 plans (4 waves)

**Wave 1**

- [x] 03-01-PLAN.md — SEO foundation: canonical origin (apex, D-01) + GSC field + indexing-policy helper (`lib/seo/policy.ts`) [wave 1]

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03-02-PLAN.md — Shared metadata builder (`lib/seo/metadata.ts`: canonical/OG/Twitter/robots) + branded 1200×630 OG image [wave 2]
- [x] 03-03-PLAN.md — JSON-LD: `JsonLd` injector + HVACBusiness / Service / BreadcrumbList / FAQPage builders (no ratings) [wave 2]
- [x] 03-04-PLAN.md — Programmatic `app/sitemap.ts` (force-static) + `app/robots.ts` (open, AI-bots, absolute pointer) [wave 2]

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 03-05-PLAN.md — Root layout: brand rebrand + metadataBase + default OG + sitewide HVACBusiness JSON-LD + Vercel Analytics/Speed Insights + GSC meta [wave 3]
- [x] 03-06-PLAN.md — Dynamic pillar + sub-service routes: `generateMetadata`→builder + per-page Service/BreadcrumbList/FAQPage JSON-LD [wave 3]
- [x] 03-07-PLAN.md — Static-page metadata via the builder (home/tarieven/over-ons/contact index; privacy-beleid + hub noindex) [wave 3]

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 03-08-PLAN.md — Owner-ops runbook (GBP/GSC/Vercel/AI-opt-out/geo) + `scripts/assert-seo.ts` + green-build phase gate [wave 4]

**Cross-cutting constraints** (hold across plans):
- One canonical origin (`CANONICAL_ORIGIN` = apex `https://tpsventilatie.nl`, live-confirmed) — every absolute URL derives from it.
- One indexing lever: `lib/seo/policy.ts isIndexable()` drives both sitemap membership and per-page `robots` (statics index now except privacy-beleid; hub/pillar/service gate on `status:"published"` → Phase 4 flips them).
- All JSON-LD server-rendered, zero client JS, `<`-escaped; NO `aggregateRating`/`review` (reserved for Phase 4).
- `next.config.ts` stays `output:"export"` — do NOT relax it (Phase 5 decision gate).

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

**Plans**: 9 plans (3 waves)

**Wave 1** *(foundation — parallel, no shared files)*

- [x] 04-01-PLAN.md — D-13 anti-claim grep gate (scripts/assert-no-forbidden-claims.ts) + prebuild wire + written checklist [wave 1]
- [x] 04-02-PLAN.md — Reviews consolidation (lib/reviews.ts) + gated aggregateRating slot + over-ons/home USP interim-true copy (CONT-07/08) [wave 1]
- [x] 04-08-PLAN.md — Owner intake: publish Tally 2EojAA + send Thomas one message (autonomous:false) [wave 1]

**Wave 2** *(pillar content silos — depend on 04-01; each pillar its own file)*

- [x] 04-03-PLAN.md — Airconditioning silo (pillar + 4 subs; airco = geen ISDE; brand install copy) → review [wave 2]
- [x] 04-04-PLAN.md — Warmtepompen silo (net-new pillar + 4 subs; ISDE yes + rvo.nl cite, amounts→consult) → review [wave 2]
- [x] 04-05-PLAN.md — WTW silo (fix wtw.ts:65 gecertificeerd; expand intros + FAQs; ISDE yes-2026 + isolatie) → review [wave 2]
- [x] 04-06-PLAN.md — Mechanische Ventilatie silo (expand + FAQs; ISDE CO2-gestuurd-only + isolatie) → review [wave 2]
- [x] 04-07-PLAN.md — Brand blurbs (brands.ts, dealer status gated) + pricing transparency copy (tarieven node) [wave 2]

**Wave 3** *(editorial gate — depends on all content + intake)*

- [ ] 04-09-PLAN.md — Map intake returns → gated slots; whole-site owner review (preview); batch-flip approved set → published; update assert-seo (autonomous:false) [wave 3]

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

**Decision Gate** (resolved): static-export-vs-hybrid → **HYBRID** (drop `output: "export"`; one server `/api/lead` route holds the GHL secret; all other ~22 pages stay SSG; `trailingSlash: false` + apex canonical preserved). Logged in PROJECT.md during 05-01 (QA-01).

**Plans**: 6 plans (4 waves)

**Wave 1**

- [x] 05-01-PLAN.md — Hybrid hosting flip + Upstash deps + server-only `GHL_WEBHOOK_URL` env + log the QA-01 decision in PROJECT.md (QA-01, QA-07 config) [wave 1]

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 05-02-PLAN.md — Shared Zod v4 lead schema + secure `app/api/lead` route (rate-limit + validation + honeypot + server secret + GHL forward) (QA-02, LEAD-02) [wave 2]
- [x] 05-04-PLAN.md — Site-wide sticky contact bar (Sketch-003-D, layout-level) + LEAD-04 link sweep (LEAD-03, LEAD-04) [wave 2]
- [x] 05-05-PLAN.md — Mobile launch polish: SSR-safe motion-gating hook + gated aurora + lazy corrected map + image preload (QA-05, QA-06, QA-07) [wave 2]

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 05-03-PLAN.md — Reusable `<OfferteForm>` + thin client caller + AVG consent + fail-safe error UI (LEAD-01, LEAD-05, LEAD-06, QA-04) [wave 3]

**Wave 4** *(blocked on Wave 3 completion)*

- [ ] 05-06-PLAN.md — External infra (Vercel env/Upstash/GHL) + preview launch-QA: build gate, secure-path, QA-08 live notify, mobile CWV gate (QA-08, SEO-10) `autonomous: false` [wave 4]

**Cross-cutting constraints** (hold across plans):
- The hybrid flip (05-01) changes the whole build — sequence it first; every later plan validates on a **Vercel preview** (no local `next build`/`tsx` — OneDrive deadlock).
- The GHL webhook secret is **server-only** (`GHL_WEBHOOK_URL`, never `NEXT_PUBLIC_`); the old public Vercel var is deleted at cutover (05-06).
- **Never push `main`; never `vercel --prod`** — all proof is on the preview; owner sign-off is the launch gate.
- One shared sticky contact bar (no second WhatsApp FAB); Phase 6 inherits the `<OfferteForm>` + bar.

**UI hint**: yes

### Phase 6: Homepage conversion uplift

**Goal**: Rebuild the home page around the three validated sketch-findings winners — a proof-forward hero, an equal scannable 4-pillar grid with brand logos, and a trust + contact band with a smart scroll-in sticky CTA — delivering the premium "Atmospheric Clarity, engineered" UI language so the site's highest-traffic page turns visitors into contacted leads.
**Depends on**: Phase 5
**Requirements**: None mapped (coverage is driven by CONTEXT decisions D-01…D-19 — every trackable decision is cited in a plan's must_haves/truths)
**Plans**: 6 plans (3 waves)
**Success Criteria** (what must be TRUE):

  1. The home page is a full rebuild — Hero → 4-pillar grid → proof/trust band → closing CTA — with the 5 old sections retired and the `<main>` landmark kept (D-01/D-02)
  2. The proof-forward hero leads with proof (initials + 4,9 + 34 Google-reviews) + a compact offerte form that posts through the secure `/api/lead`, with a data-sourced coverage line and a pure-CSS brand-teal aurora (no WebGL) (D-03/D-04/D-06/D-07)
  3. All four pillars are visible as an equal scannable grid; a primary click opens the pillar page and a distinct Offerte button pre-selects that service in the hero form and scrolls to it; WTW/MV render a neutral brand chip (D-08…D-13)
  4. A trust/proof band shows 4,9 + CSS Google-G + 3 static review cards + BRL 100/200 + KvK + USP pills; the home-hero.jpg sits lower as a lazy off-LCP band (D-05/D-14/D-15)
  5. An engineered dark closing CTA band ships AA-safe WhatsApp; Phase-7 hero items are baked in (Dutch badge, teal aurora, 375px pills, one h1); mobile INP < 200ms + good LCP on the Vercel preview (D-16/D-17/D-18/D-19)

**Wave 1** *(enablers — parallel, no shared files)*

- [x] 06-01-PLAN.md — Shared extractions: getInitials → lib/initials.ts + BRAND_COLOR → lib/services/brands.ts (re-point consumers) [wave 1]
- [x] 06-02-PLAN.md — OfferteForm compact variant + controlled dienst + COMPACT_LEAD_NAME sentinel (naam/consent mechanic resolved) [wave 1]
- [x] 06-03-PLAN.md — CSS foundations in globals.css: gated pure-CSS aurora + CSS Google-G + .fu fade-up (no phantom tokens) [wave 1]

**Wave 2** *(section components — blocked on Wave 1)*

- [x] 06-04-PLAN.md — HomeHero client island (badge, one h1, proof bar, coverage line, aurora, compact form) + PillarGrid (taxonomy cards, Offerte gesture, brand chips + WTW/MV fallback) [wave 2]
- [x] 06-05-PLAN.md — ProofBand (score + CSS-G + 3 static cards + BRL 100/200 + KvK + USP pills) + ImageBand (lazy home-hero.jpg, off LCP) [wave 2]

**Wave 3** *(assembly — blocked on Wave 2)*

- [x] 06-06-PLAN.md — ClosingCTA restyle (dark band, AA-safe WhatsApp, Icon wrapper) + app/page.tsx rewrite (compose 4 sections, retire old imports, keep metadata) [wave 3]

**Cross-cutting constraints** (hold across plans):
- Composition of existing verified assets (zero new dependencies) — extend/reuse, never fork (OfferteForm, StickyContactBar inherited, taxonomy, reviews, BrandGrid, Icon).
- Atmospheric Clarity guardrails: no 1px borders (tonal layering), no `#000` (`on-surface`), business data via `SITE`, icons via the `Icon` wrapper; port sketch CSS through the real-token translation table (zero phantom `var(--…)`).
- Validate on the **Vercel preview** (no local `next build`/`tsc` — OneDrive deadlock); no test framework added; execution is **inline** (no worktrees/subagents on this mount). Never push `main` / never `vercel --prod`.

**UI hint**: yes

### Phase 7: UI/UX and Accessibility Remediation

**Goal**: Bring every page to WCAG 2.1 AA on the audited dimensions and resolve the remaining visual/brand-consistency nits from the 2026-06-30 UI/UX audit (Playwright + design-intelligence sweep, 8 pages × 4 viewports, score 8.7/10) — so the site launches accessible and on-brand. Only A11Y-01 is launch-gating; the rest is layered hardening + polish.
**Depends on**: Phase 5 (shared lead-path components: CTABanner, ServiceHero, StickyContactBar, MobileMenu, OfferteForm). Homepage-hero items (UI-05–UI-07) additionally depend on Phase 6's hero rebuild.
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04, UI-05, UI-06, UI-07, UI-08, UI-09, UI-10, UI-11, UI-12, UI-13, UI-15 (UI-14 = 320px spot-check, verified in 07-08; no dedicated plan)
**Success Criteria** (what must be TRUE):

  1. An automated re-audit shows zero solid-background WCAG AA contrast failures on interactive text/controls across all pages — the WhatsApp CTAs (`components/CTABanner.tsx`, `components/ServiceHero.tsx`) and the contact WhatsApp icon read ≥4.5:1 (≥3:1 for the glyph) — verified on the Vercel preview (A11Y-01, UI-10)
  2. Every page's heading outline nests without level skips (exactly one h1; the `Footer`, `/diensten`, `/over-ons` skips fixed; the rebuilt homepage nests clean; the WhyTPSSection skip removed at source by deleting the dead file), with visual sizing unchanged (A11Y-02)
  3. Every page exposes a keyboard-reachable skip-link to the existing `<main>` landmark, and all non-inline interactive controls (sticky-bar close, mobile-menu chevrons, carousel arrows, plus the "Bekijk" conversion CTAs and FAQ toggles) meet a ≥44px hit-area (A11Y-03, A11Y-04, UI-15)
  4. The live homepage hero is on-brand and all-Dutch — Dutch badge (not "Clean Air Technology"), a calm brand-teal CSS aurora, and clean 375px layout — verified against the post-Phase-6 `HomeHero`/`globals.css` with no regression (UI-05, UI-06, UI-07)
  5. Site-wide interaction polish holds: the diensten mega-menu is keyboard-operable with correct `aria-expanded`/`aria-haspopup`, and the sticky contact bar never occludes footer content at full scroll — re-audit + manual pass green on the preview (UI-08, UI-09)
  6. Brand/hygiene polish lands: the footer carries the PNG logo + 4-pillar copy + live-taxonomy Diensten links + no 1px border (UI-11), the "Nieuw" badge is legible ≥11px (UI-12), no raw Material-Symbols spans remain (UI-13), and the 5 retired Phase-6 section files are deleted (dead-code cleanup)

**Plans**: 12 plans (4 waves) — *replanned 2026-07-03 after Phase 6 landed: retargeted the stale hero plan (07-07) to the live `HomeHero`, dropped the dead-file `WhyTPSSection` fix from 07-02, and added the 2026-07-01 mobile re-audit scope (UI-11 footer, UI-12 badge, UI-13 icons, UI-15 CTA targets) + retired-file cleanup.*

**Wave 1** *(local accessibility fixes + cleanup — shared components, independent of the Phase-6 rebuild; may be pulled forward if launch precedes Phase 6)*

- [x] 07-01-PLAN.md — WhatsApp/green contrast: CTABanner + ServiceHero dark-on-green text + contact icon glyph; + CTABanner raw-icon→Icon swap (A11Y-01 launch-gate, UI-10, UI-13) [wave 1]
- [x] 07-02-PLAN.md — Heading-order re-rank: Footer h4→h2, over-ons h3→h2, /diensten sr-only h2 (ServiceCard untouched; WhyTPSSection dropped — dead file) (A11Y-02) [wave 1]
- [ ] 07-04-PLAN.md — Touch targets ≥44px: sticky-bar close, mobile-menu chevrons, review-carousel arrows (A11Y-04) [wave 1]
- [ ] 07-11-PLAN.md — Cleanup: delete the 5 retired Phase-6 homepage section files (HeroSection/ServicesSection/PricingSection/WhyTPSSection/ReviewsSection — zero importers) [wave 1]

**Wave 2** *(blocked on Wave 1 — re-touches the same page files)*

- [ ] 07-03-PLAN.md — Skip-link "Naar inhoud" in layout + `id="main"` on all 8 `<main>` landmarks (A11Y-03) [wave 2]
- [ ] 07-10-PLAN.md — Conversion CTA target sizes ≥44px: ServiceHero + ServiceCard/RelatedServices "Bekijk" buttons + FAQ `<summary>` (UI-15; the CONTEXT's mislabelled 2nd "UI-11") [wave 2]
- [ ] 07-12-PLAN.md — Footer brand refresh: PNG logo + 4-pillar copy + live-taxonomy Diensten links + drop 1px border (IG/FB icons deferred, owner-blocked) (UI-11) [wave 2]

**Wave 3** *(polish; UI-05/06/07 verified against the live post-Phase-6 hero)*

- [ ] 07-05-PLAN.md — Sticky-bar bottom spacer so it never occludes the footer (UI-08) [wave 3]
- [ ] 07-06-PLAN.md — Mega-menu keyboard/ARIA: aria-haspopup/expanded + focus-open + Escape (UI-09) [wave 3]
- [ ] 07-07-PLAN.md — Live homepage hero verify-and-record (HomeHero + globals.css): Dutch badge, calm teal CSS aurora, clean 375px — retargeted off the dead HeroSection (UI-05, UI-06, UI-07) [wave 3]
- [ ] 07-09-PLAN.md — "Nieuw" badge font ≥11px: Navbar, MobileMenu, diensten hub (UI-12) [wave 3]

**Wave 4** *(blocked on all — preview verification gate, `autonomous: false`)*

- [ ] 07-08-PLAN.md — Push→Vercel preview + `re-audit.mjs`: 0 contrast fails, 0 heading skips, skip-link, ≥44px targets + manual UI pass (incl. footer refresh, badges, CTA targets, retired-file build check, UI-14 320px spot-check)

**Cross-cutting constraints** (hold across plans):
- Keep the Atmospheric Clarity design system: no 1px section borders (tonal layering), no `#000` text (use `on-surface` `#141D1F`), business data via the `SITE` constant, icons via the `Icon` wrapper.
- Validate on a **Vercel preview** (no local `next build` — OneDrive deadlock); re-verify with the Playwright UI-audit harness (see the `ui-audit-harness` memory) — target: 0 AA contrast fails, 0 heading skips, skip-link focusable, controls ≥44px.
- Findings source: UI/UX audit 2026-06-30 (8.7/10). **A11Y-01 is the only launch-gating item.**

**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Taxonomy & Data Model | 6/6 | Complete    | 2026-06-02 |
| 2. Routes & Service-Page Templates | 6/6 | Complete    | 2026-06-05 |
| 3. SEO Infrastructure | 8/8 | Complete   | 2026-06-06 |
| 4. Content Fill & Editorial Gate | 8/9 | In Progress|  |
| 5. Lead Capture, Form Security & Launch QA | 5/6 | In Progress|  |
| 6. Homepage conversion uplift | 6/6 | Complete   | 2026-07-01 |
| 7. UI/UX & Accessibility Remediation | 2/12 | In Progress|  |

## Backlog

Deferred items captured outside the active phase sequence. Review or promote with `/gsd-review-backlog`.

- [ ] **999.1: Branded OG / Social-Share Card** (BACKLOG) — Replace the launch-default `public/og-default.jpg` (plain grey fan product shot, no brand) with a purpose-designed 1200×630 card carrying the TPS klimaattechniek logo + tagline. Origin: Phase 3 SEO UAT gap 12 (cosmetic, SEO-05). Needs owner logo asset; natural pairing with Phase 4 (copy) or Phase 6 (brand/visual). Detail: `.planning/phases/999.1-branded-og-card/999.1-CONTEXT.md`

## Coverage

All 43 v1 requirements mapped to exactly one phase (IA 9, CONT 10, LEAD 6, SEO 10, QA 8). No orphans, no duplicates. BLOG-01 and other v2 items are intentionally excluded from this launch roadmap.

Phase 7 introduces a post-audit launch-hardening group additive to the original 43: A11Y-01…04 + UI-05…10 from the 2026-06-30 UI/UX audit (10 items), plus UI-11…15 from the 2026-07-01 mobile re-audit (footer refresh, Nieuw badge, raw-icon cleanup, 320px robustness, conversion-CTA target sizes). None come from the initial requirements scope.

| Phase | Requirements | Count |
|-------|--------------|-------|
| 1 | IA-01, IA-08, IA-09, SEO-08, QA-03 | 5 |
| 2 | IA-02, IA-03, IA-04, IA-05, IA-06, IA-07 | 6 |
| 3 | SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-09 | 8 |
| 4 | CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-08, CONT-09, CONT-10 | 10 |
| 5 | LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, LEAD-06, QA-01, QA-02, QA-04, QA-05, QA-06, QA-07, QA-08, SEO-10 | 14 |
| **Total** | | **43** |
