# Phase 4: Content Fill & Editorial Gate - Research

**Researched:** 2026-06-06
**Domain:** YMYL editorial content for a Dutch HVAC/klimaattechniek installer (subsidie/ISDE accuracy, E-E-A-T trust copy, per-page uniqueness at scale, brand-asset sourcing, reviews/schema)
**Confidence:** HIGH (ISDE facts verified against official RVO pages; Google review/FAQ policy verified against developers.google.com; brand trademark terms verified against official sources). MEDIUM on keyword-volume validation (no paid tool available — intent is verified, volume is not).

## Summary

Phase 4 is an **editorial phase with code-shaped outputs**: the only place copy lands is the typed `ContentShell` in `lib/services/*.ts`, gated by a build-enforced Zod uniqueness bar (intro ≥120w, ≥1 step, 3-6 FAQs on `review`/`published` nodes). The templates (Phase 2) and SEO instrumentation (Phase 3) are LOCKED. The hard problem is **YMYL accuracy under the Dec-2025 Core Update** — every subsidie/ISDE/keurmerk/BTW claim must be literally true while unverified claims (dealer status, certifications, star rating) stay display-gated. The good news: the three core ISDE 2026 facts were verified directly against the official RVO pages and are HIGH confidence.

Two SEO policy shifts discovered this session **materially affect planning** and are not yet reflected in the CONTEXT decisions: (1) Google **no longer shows self-serving aggregateRating rich results** for `LocalBusiness`/`Organization` schema placed on the business's own site (verified against Google docs) — this changes the *value framing* of the reserved `aggregateRating` slot (D-17), though the slot is still worth filling for AI/LLM consumption and on-page display. (2) **FAQPage rich results were deprecated** (Google, May 7 2026) — the 3-6 FAQ Zod gate stays valid for E-E-A-T/helpfulness and on-page UX, just not for rich snippets. Neither shift requires code changes (Phase 3 is locked); both refine the editorial rationale.

The existing draft intros contain **two latent D-13 anti-claim violations** that must be fixed during fill, not just expanded: the WTW pillar intro says "gecertificeerde monteurs" (D-02 forbids "gecertificeerd" until proof) and the airco intros name brands as installed equipment (defensible — naming a product you install is not a dealer claim — but the *dealer/erkend* line must never appear). The scattered `REVIEWS` arrays also still use the old "TPS Ventilatie" brand string in quoted review text.

**Primary recommendation:** Draft pillar-by-pillar (D-03) into the `ContentShell` data files using the per-pillar ISDE facts table below (cite the exact RVO URLs, route euro amounts to a consult per D-10); enforce the D-13 anti-claim list as BOTH a written checklist AND a lightweight `scripts/assert-no-forbidden-claims.ts` grep gate (recommended — it is cheap and makes the YMYL gate build-enforceable, matching the project's existing `scripts/assert-*` pattern); consolidate reviews into one `lib/reviews.ts` source; default BrandGrid to its text-chip fallback and only ship official SVG logos the owner supplies via intake (official brand logos are gated behind partner portals / prohibited for unauthorized third-party use).

## Architectural Responsibility Map

> This is an editorial phase; "tiers" here are content/data layers, not runtime tiers. Capabilities map to where the artifact lives.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page body copy (intro/steps/FAQs/localAngle) | `lib/services/*.ts` `ContentShell` | — | The only sanctioned home for body copy (P1 D-14/D-15); rendered by Phase 2 server components |
| Per-pillar ISDE/subsidie facts | `lib/services/*.ts` (pillar `intro`/`faqs`) | external cite → rvo.nl URL in copy | Durable conditions live in copy + RVO link; volatile euro amounts route to consult (D-10) |
| Brand blurbs + dealer status | `lib/services/brands.ts` (`blurb`, `erkendInstallateur`) | BrandGrid render | Normalized brand registry (P1 D-06); dealer claim gated until owner-verified |
| Brand logo assets | `/public/images/brands/*.svg` | BrandGrid text-chip fallback | Logos gated behind partner portals; fallback is the safe default (D-19) |
| Pricing transparency copy | content/page copy wrapping `components/PricingTabs.tsx` | — | Pricing DATA stays in PricingTabs (CONT-05, P1 Pitfall 3); only framing copy is added |
| Reviews (score/count/quotes) | new `lib/reviews.ts` (single source) | `aggregateRating` JSON-LD slot + ReviewCarousel | Replaces 3 scattered copies (D-17); slot gated on real Google data |
| Certification/keurmerk trust block | content copy + owner-uploaded proof | schema (if held) | Hard display-gate on proof (D-12); interim copy obeys D-02 |
| Editorial sign-off / index lever | `status` field on each node → `lib/seo/policy.ts` | git commit = audit trail | Status flip IS the gate AND the index lever (P1 D-08, P3 D-02, D-06) |
| Owner intake (input mechanism) | Tally form `2EojAA` → maps to code | — | Publishes the dependency; returns map to SITE/brands/reviews/content (D-04) |

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Owner-Input Gating & Sequencing**
- **D-01 — Draft now, quarantine claims.** Draft ALL researchable copy immediately (service intros, steps, FAQs, ISDE/subsidie facts, regio angle — none need owner input). Only genuinely owner-gated claims wait. Nothing blocks on the form.
- **D-02 — Neutral interim phrasing for gated items, and it MUST be literally true.** Use `vakkundige` / `ervaren monteurs`, **NOT** `gecertificeerd`, until at least one certification is confirmed; no named keurmerk, no dealer/"erkend installateur" badge, and no star rating until proof/data arrives.
- **D-03 — Drafting order: pillar-by-pillar, complete silos.** Draft a whole pillar (pillar page + all its sub-services) before the next.
- **D-04 — The intake form is in Phase 4 scope.** Publish Tally form `2EojAA` (verify password `tpsklimaat2026` active → publish), send Thomas one message (link + password + photo instruction), and map returns to code. See `docs/owner-intake-spec.md`.

**Editorial Workflow & Sign-Off (CONT-10)**
- **D-05 — Review surface = Vercel preview deploy.** Thomas reviews rendered pages on a preview URL, not the TS data files.
- **D-06 — Approval record = the status flip itself.** The git commit that flips `status` to `published` IS the audit trail.
- **D-07 — Sign-off granularity = one whole-site review.** Single consolidated review pass over all 21 pages before launch.
- **D-08 — Status flow uses all three states.** `draft` = empty/not ready (noindex, out of sitemap). `review` = Claude finished + gate passed, awaiting Thomas (still noindex). `published` = owner-approved → indexed + in sitemap.
- **D-09 — Launch shape: draft incrementally → `review` → ONE whole-site review → batch-publish.**

**YMYL Accuracy: Subsidie, Pricing & Claims**
- **D-10 — Subsidie depth: eligibility + conditions + official RVO link; amounts routed to a consult.** Per-pillar: **WP** (ISDE) yes, **WTW/MV** yes from 2026 + the **insulation condition**, **Airco** no subsidy.
- **D-11 — Pricing transparency: confirm the existing table, add all-in clarity.** all-in incl. BTW + voorrijkosten note for Airco/WTW/MV, and Warmtepompen "op maat via offerte" with what's included.
- **D-12 — Certification/keurmerk: hard display-gate, literally-true interim copy.** No named mark (F-gassen/STEK, InstallQ, BRL, VCA, verzekering) renders until owner uploads proof.
- **D-13 — Locked anti-claim list (a content-review gate every page is checked against before `review`).** NEVER claim: ISDE/subsidie for airco; Belgian 6% BTW; unverified dealer / "erkend installateur" status; unheld keurmerken/certifications; a star rating or `aggregateRating` without a real Google source.

**Differentiation, Voice & Reviews**
- **D-14 — Voice = formal `u`, professional-warm.** (The intake form's `je` is owner-facing and does not set the public voice.)
- **D-15 — Per-page uniqueness via intent angle + service-specifics.** Installatie = proces/merken/ISDE, Onderhoud = preventie/contract/checklist, Storing = snelheid/spoed/symptomen, Vervangen/Aanleggen/Inregelen = their own. Concrete, service-specific detail, never swapped boilerplate.
- **D-16 — FAQ allocation: pillar = decision FAQs, sub-service = task FAQs; one canonical home per topic.** Each general topic gets ONE canonical home page and is internal-linked from related pages.
- **D-17 — Reviews: single consolidated source + gated `aggregateRating` + score/count/link.** Create one consolidated reviews module (e.g. `lib/reviews.ts`) that REPLACES the three scattered `REVIEWS` copies. Wire the reserved `aggregateRating` JSON-LD slot from the owner's real Google score + count (gated). Show score/count/link on home + key pages.

**Scope Seams**
- **D-18 — Home boundary: Phase 4 = data/content only; Phase 6 = visual rebuild.** Phase 4 ONLY: wires consolidated reviews source + Google score/count/link (CONT-08), refreshes USP copy feeding existing `WhyTPSSection` (CONT-07), fixes stale service copy. No layout/visual changes.
- **D-19 — Brand logos: source official SVGs ourselves now**, respecting each brand's asset-usage guidelines (use official partner/press resources; logo presence ≠ a dealer/"erkend" claim). Owner-supplied assets via intake §9 can replace them later. BrandGrid's text-chip fallback remains for any brand whose asset isn't obtained.
- **D-20 — Cross-pillar cross-sell: light editorial, where natural.** Use the `relatedOverride` Phase 2 reserved to add tasteful cross-links where they genuinely fit. Light touch only.

### Claude's Discretion
- **OG card (999.1) timing** → stays in the backlog, but is logo-unblocked by Phase 4's intake: opportunistic add if owner logo is in hand, else pairs with Phase 6.
- Module layout/naming for the consolidated reviews source (`lib/reviews.ts` vs a `SITE.reviews` extension) — planner's call within the single-source intent (D-17).
- Exact per-page intent-angle wording and the topic→page FAQ map (D-15/D-16) — drafted during execution.
- Whether the D-13 anti-claim list is enforced as a written review checklist only, or additionally as a lightweight `scripts/` assertion (grep for forbidden strings) — planner's call. **[Research recommends: BOTH — see Validation Architecture.]**
- Whether to flip pages `draft → review` per-pillar in one commit or per-page — within D-08/D-09.

### Deferred Ideas (OUT OF SCOPE)
- **Branded OG card (999.1)** — backlog; logo-unblocked by intake; opportunistic or pairs with Phase 6.
- **Deep energy-savings / gas-vs-airco cross-sell content** — v2 (CONT-V2-04); Phase 4 does only light `relatedOverride` cross-links (D-20).
- **Per-brand dedicated pages** (`/diensten/airconditioning/installatie/daikin`) — v2 (CONT-V2-01).
- **Onderhoudscontract offering with tiers** — v2 (CONT-V2-02); Phase 4 only mentions onderhoud as a service + FAQ topic.
- **Dedicated VvE / appartement section** — v2 (CONT-V2-03); Phase 4 covers VvE/vergunning only as an FAQ topic (D-16).
- **Light blog / kennisbank** — v1.x fast-follow (BLOG-01); Phase 4's CONT-09 is on-page FAQ, not blog articles.
- **Per-pillar OG images / GA4 / aggregateRating beyond the single sourced set** — later enhancements.
- **Home-page visual/layout rebuild** — Phase 6 (D-18).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | Unique Dutch copy for every pillar page (intro ≥120w, USPs, local angle) | E-E-A-T/uniqueness patterns (Architecture Patterns); per-pillar intent angles (D-15); 4 pillars to fill — Warmtepompen empty, WTW pillar intro needs expand + D-13 fix |
| CONT-02 | Unique Dutch copy for every sub-service page (service-specific intro + steps + 3-6 FAQs) | Per-page uniqueness via intent angle + service-specifics (Pattern 2); task-FAQ allocation (D-16); 17 subs, FAQs are 100% net-new |
| CONT-03 | Brand-specific install content with accurate "erkend installateur" claims | Brand blurbs in `brands.ts`; dealer claim stays gated (`erkendInstallateur:false`) until owner proof (D-12); naming a product you install ≠ a dealer claim |
| CONT-04 | Accurate per-pillar ISDE/subsidie content, sourced and linked | **Per-Pillar ISDE 2026 Facts table (VERIFIED against rvo.nl)** — the centerpiece YMYL deliverable |
| CONT-05 | Pricing transparency content (all-in incl. BTW; WP "op maat via offerte") | NL BTW facts (21% standard, 9% on combined supply+install labor; NOT Belgian 6%); pricing DATA stays in PricingTabs |
| CONT-06 | Certification/keurmerk trust block (owner-verified only) | F-gassen/STEK facts (legally required to operate — see Pitfall); hard display-gate on proof (D-12) |
| CONT-07 | Refreshed Over-ons — "Verhaal van Thomas" + 4 USPs | Story sourced from intake §7; USP=Gecertificeerd must stay gated until cert proof (D-02 tension — see Open Questions) |
| CONT-08 | Reviews consolidated to single source; Google score/count/link on home + key pages | `lib/reviews.ts` consolidation (replaces 3 copies); **self-serving aggregateRating no longer shows rich results — affects value framing** |
| CONT-09 | FAQ content per pillar + general topics | FAQ allocation pattern (D-16); FAQPage rich results deprecated but on-page value remains; Zod gate enforces 3-6 |
| CONT-10 | Owner editorial review + sign-off on every page (hard gate) | Editorial validation = preview deploy + status-flip audit trail (D-05/D-06); whole-site single review (D-07) |
</phase_requirements>

## Standard Stack

This is an editorial phase — **no new runtime libraries**. The "stack" is the existing validation + render infrastructure plus the external authoritative sources the copy must cite.

### Core (existing — already installed, no changes)
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `zod` | 4.x (installed P1) | Build-enforced uniqueness gate (`publishedContentSchema`) | The structural validator for content; runs in prebuild `tsx scripts/validate-taxonomy.ts` |
| `tsx` | dev (installed P1) | Runs the build-time validation + assert scripts | Existing pattern (`scripts/assert-seo.ts`, `scripts/validate-taxonomy.ts`) |
| Phase 2 server components | in-repo | `ServiceSteps`/`ServiceFAQ`/`BrandGrid` render `steps[]`/`faqs[]`/`brandIds[]` | Zero re-parse; FAQ auto-feeds FAQPage JSON-LD |
| `lib/seo/policy.ts` `isIndexable()` | in-repo | Status flip → sitemap + robots | The index lever this phase pulls |

### Supporting (new code artifacts this phase introduces — not packages)
| Artifact | Purpose | When to Use |
|----------|---------|-------------|
| `lib/reviews.ts` (or `SITE.reviews`) | Single consolidated reviews source (D-17) | Replaces 3 scattered `REVIEWS` arrays |
| `scripts/assert-no-forbidden-claims.ts` (recommended) | Grep gate for D-13 forbidden strings | Build-time anti-claim enforcement (see Validation Architecture) |
| `/public/images/brands/*.svg` | Official brand logos (owner-supplied via intake) | Only when owner provides; else text-chip fallback |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `lib/reviews.ts` standalone module | Extend `SITE.reviews` in `lib/constants.ts` | `SITE` is the NAP single-source; reviews are arguably business data too. Standalone keeps `constants.ts` lean and mirrors `urlFor()`/`isIndexable()` single-source ethos. Planner's call (D-17 discretion). |
| `scripts/` grep gate for D-13 | Written checklist only | Checklist relies on human diligence; grep gate is build-enforced and catches regressions. **Recommend BOTH** — checklist for nuance, grep for hard strings ("6% btw", "erkend installateur" outside gated render, "gecertificeerd" before proof). |

**Installation:** None — no new npm packages. (Repo is on a slow OneDrive mount; do NOT run `npm install`, `next build`, or `tsc` during planning per the runtime note.)

## Package Legitimacy Audit

> **Not applicable.** Phase 4 installs zero external packages — it writes content into existing typed data files and (optionally) adds in-repo `scripts/` and a `lib/reviews.ts` module. No registry packages are added. `zod`/`tsx` were vetted and installed in Phase 1 (supply-chain gated per P1 D-07).

## Architecture Patterns

### Content Flow Diagram

```
                          ┌─────────────────────────────────────────────┐
   OWNER INTAKE           │  Research (this doc) — VERIFIED facts:        │
   (Tally 2EojAA)         │  • RVO ISDE 2026 conditions + URLs           │
        │                 │  • F-gassen/STEK, NL BTW, brand T&Cs         │
        │ returns         └───────────────────┬─────────────────────────┘
        ▼                                     │
   ┌─────────────┐                            ▼
   │ dealer status│            ┌───────────────────────────────┐
   │ certs+proof  │──gates──▶  │  DRAFTING (pillar-by-pillar)  │
   │ NAP/hours    │            │  into ContentShell:           │
   │ Google score │            │  intro ≥120w · steps[] ·      │
   │ story/USPs   │            │  faqs[3-6] · localAngle       │
   └─────────────┘            └───────────────┬───────────────┘
                                              │
                          ┌───────────────────┼───────────────────┐
                          ▼                    ▼                   ▼
                 ┌─────────────────┐  ┌─────────────────┐ ┌──────────────────┐
                 │ D-13 anti-claim │  │ Zod uniqueness  │ │ status: draft →   │
                 │ gate            │  │ gate (prebuild) │ │ review            │
                 │ (checklist +    │  │ ≥120w/≥1step/   │ │ (noindex, safe)   │
                 │  grep script)   │  │  3-6 faqs       │ │                   │
                 └────────┬────────┘  └────────┬────────┘ └─────────┬────────┘
                          │ pass               │ pass               │
                          └────────────────────┴────────────────────┘
                                              ▼
                              ┌───────────────────────────────┐
                              │  Vercel PREVIEW deploy        │  ◀── Thomas reviews
                              │  (rendered pages, D-05)       │      rendered pages
                              └───────────────┬───────────────┘
                                              │ owner sign-off (D-07, one pass)
                                              ▼
                              ┌───────────────────────────────┐
                              │  status: review → published   │  ── git commit = audit (D-06)
                              │  (batch-flip, D-09)           │
                              └───────────────┬───────────────┘
                                              ▼
                              ┌───────────────────────────────┐
                              │ lib/seo/policy.ts isIndexable │
                              │ → sitemap + robots (indexed)  │
                              └───────────────────────────────┘
```

### Pattern 1: Per-pillar ISDE copy — durable conditions in prose, volatile amounts to consult (D-10)
**What:** State *who qualifies* and *the conditions* (these change slowly), cite the exact RVO URL, route concrete euro amounts to a free consult ("vraag vrijblijvend advies").
**When to use:** Every pillar page's subsidie section + the subsidie decision-FAQ.
**Example (illustrative Dutch, planner finalizes wording):**
```
// Warmtepompen pillar intro / FAQ — conditions are durable, amounts are not.
"Voor de aanschaf van een (hybride) warmtepomp kunt u in 2026 ISDE-subsidie
aanvragen. Voorwaarden: de warmtepomp is nieuw, uw woning heeft een bouwjaar
vóór 1 januari 2019 (of de omgevingsvergunning is vóór 1 juli 2018 aangevraagd),
en een installatiebedrijf voert de volledige installatie uit. U vraagt de
subsidie binnen 24 maanden na installatie aan. De exacte bedragen verschillen
per vermogen en type — vraag ons vrijblijvend om een actuele berekening."
// Source link in copy: https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp
```

### Pattern 2: Per-page uniqueness via intent angle + concrete service detail (D-15)
**What:** Each page leads with its own intent angle and uses real, service-specific detail (steps, symptoms, parts) — never swapped boilerplate. The Zod gate enforces *length*; the angle enforces *distinctiveness*.
**When to use:** Every sub-service page. The test: "no two pages distinguishable only by their H1."
**Angle map (from D-15, confirmed by SEO research — Dec-2025 rewards "do one job exceptionally well"):**

| Sub-service type | Lead angle | Concrete detail to include |
|------------------|-----------|----------------------------|
| Installatie | proces + merken + ISDE | install steps, single/multi-split, ISDE eligibility, site survey |
| Onderhoud / onderhoud-reinigen | preventie + checklist | what's checked/cleaned, frequency, filters/ventielen, energy/hygiene benefit |
| Storing / reparatie-storing | snelheid + symptomen | specific symptoms (lekkage, lawaai, niet koelen), spoed availability, diagnose |
| Vervangen | levensduur + winst | age signals (15-20 yr WTW), efficiency gain, the replacement sequence |
| Aanleggen | nieuwbouw/renovatie | duct routing, bouwbesluit norms, when it applies |
| Inregelen | meetrapport + balans | per-room balancing, meetapparatuur, why it matters |
| Advies | keuze + onafhankelijk | comparison factors, vrijblijvende opname, capacity sizing |

### Pattern 3: FAQ allocation — decision FAQs on pillars, task FAQs on subs, one canonical home (D-16)
**What:** Pillar pages answer cross-cutting *decision* questions (subsidie, garantie, geluid, VvE/vergunning, kosten-indicatie). Sub-service pages answer *task* questions ("hoe lang duurt een wtw-vervanging?"). Each general topic has ONE canonical home, internal-linked from related pages.
**Why:** Verified anti-cannibalization principle — "if you have five pages answering the exact same question, you don't look like an expert" (SEO research). The Zod gate already requires 3-6 FAQs per `review`/`published` node, so every page needs its own distinct set.
**Topic → canonical home (proposed; planner finalizes):**

| General topic | Canonical home (decision FAQ) | Sub-pages link to it |
|---------------|------------------------------|---------------------|
| ISDE/subsidie | each pillar page (pillar-specific: WP/WTW/MV yes, Airco "geen subsidie") | installatie/aanleggen subs |
| Kosten-indicatie | `/tarieven` + pillar | all subs reference, don't duplicate |
| Garantie | pillar page | installatie subs |
| Geluid | pillar page (airco/WP/WTW) | installatie/storing subs |
| VvE / vergunning | airco pillar (most relevant) | airco installatie |
| Onderhoudsfrequentie | onderhoud sub (per pillar) | pillar references |

### Anti-Patterns to Avoid
- **Boilerplate intros that pass the 120w gate but are interchangeable.** The gate measures length, not distinctiveness — a page that hits 120w by padding fails D-15's real bar ("no two pages distinguishable only by H1"). This is the single biggest thin-content risk and the reason the human editorial gate exists.
- **Duplicating the same FAQ across pages** (e.g. the subsidie question verbatim on every sub) — cannibalization; assign one canonical home (D-16).
- **Modeling pricing into the taxonomy** — pricing data stays in `components/PricingTabs.tsx` (P1 Pitfall 3); only framing copy is added.
- **Padding `serviceAreas` with unserved towns** — Dec-2025 thin/irrelevant signal; owner curates (P1 Pitfall 2).
- **Rendering a brand logo as an implied dealer endorsement** — logo presence ≠ "erkend installateur"; keep the dealer line gated (D-12/D-19).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content uniqueness enforcement | A custom word-counter / lint rule | Existing `publishedContentSchema` (Zod, prebuild) | Already build-blocking; reimplementing it gives a worse, non-blocking result |
| Brand logo SVGs | Trace/recreate logos by hand | Owner-supplied official assets via intake §5/§9, else BrandGrid text-chip fallback | Recreating a trademark violates brand T&Cs; Mitsubishi Electric explicitly prohibits modified/recreated marks |
| ISDE euro amounts in copy | Hardcode subsidy bedragen | Route to a consult + link RVO (D-10) | Amounts are volatile YMYL facts (the 2026 amounts already changed vs 2025); conditions are durable, amounts are not |
| Reviews aggregation | Three separate `REVIEWS` arrays (current state) | One `lib/reviews.ts` source | Single-source ethos; three copies already drift (old brand name in quotes) |
| FAQ → JSON-LD wiring | New JSON-LD per page | Existing `ServiceFAQ` → `FAQPage` builder (Phase 3) | Already wired; faqs[] auto-feeds it |

**Key insight:** Almost nothing in this phase should be *built* — it should be *written* into existing typed slots and *gated* by existing validators. The only genuinely new code is the consolidated reviews source and (recommended) the anti-claim grep script.

## Per-Pillar ISDE 2026 Facts (CONT-04 · D-10) — THE CENTERPIECE

> **Confidence: HIGH.** Conditions below were verified by fetching the official RVO pages directly (not aggregators) on 2026-06-06. RVO pages show their own "Laatst gecontroleerd" dates (noted). Euro amounts are included ONLY for researcher context and the D-13 gate — **per D-10 they do NOT go in copy; route to a consult.** Today is June 2026, so 2026 rules are CURRENT.

### Warmtepompen — ISDE: YES `[VERIFIED: rvo.nl, "Laatst gecontroleerd: 3 juni 2026"]`

| Condition (durable — put in copy) | Detail |
|-----------------------------------|--------|
| Eligible types | "(hybride) warmtepomp" for ruimteverwarming or tapwaterverwarming. Excludes warmtepompdrogers. Lucht/water and hybride both qualify. |
| Building-year | Woning bouwjaar **vóór 1 januari 2019**, OR omgevingsvergunning aangevraagd **vóór 1 juli 2018**. |
| Installer | "De volledige installatie doet een bouwinstallatiebedrijf. De installatie mag u niet zelf doen." |
| Apply window | Within **24 maanden na installatie**. |
| New + meldcode | "De warmtepomp is nieuw." Must be on the meldcodelijst (or submit product docs). |
| 2026 restriction | No subsidy for split lucht-water warmtepompen with vulgewicht <3 kg AND GWP >750. `[VERIFIED: rvo.nl "wat-is-er-gewijzigd-vanaf-2026"]` |
| **Amount (DO NOT put in copy — consult per D-10)** | 1st lucht/water: ~€1.025 startbedrag + €225/kW (from 1st kW) + €200 A+++ bonus; 2nd+: €225/kW only. *Changed from 2025.* |

**Source URLs to cite in copy:** `https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp`

### WTW / Balansventilatie — ISDE: YES from 2026 + insulation condition `[VERIFIED: rvo.nl, "Laatst gecontroleerd: 6 mei 2026"]`

| Condition (durable — put in copy) | Detail |
|-----------------------------------|--------|
| Eligible (centrale balansventilatie WTW) | Minimaal rendement **85%** + minimale capaciteit **125 m³/h**. |
| Eligible (decentrale balansventilatie WTW) | Minimaal rendement **80%** + minimale capaciteit **80 m³/h**. |
| **Insulation precondition (THE key 2026 condition)** | Must be **gecombineerd met een of meer isolatiemaatregelen**. Subsidie aanvragen **binnen 24 maanden na installatie van de isolatiemaatregel**. |
| Installer | "Een (bouw)installatiebedrijf voert de volledige installatie uit. De installatie mag u niet zelf uitvoeren." |
| Building-year | Woning bouwjaar **vóór 1 januari 2019** (or omgevingsvergunning vóór 1 juli 2018). |
| **Amount (DO NOT put in copy)** | ~€400 one-time for WTW ventilation (per RVO "what changed" page). |

**Source URLs to cite:** `https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie`

### Mechanische Ventilatie (CO2-gestuurd) — ISDE: YES from 2026 + insulation condition `[VERIFIED: rvo.nl]`

| Condition (durable — put in copy) | Detail |
|-----------------------------------|--------|
| Eligible (centrale CO2-gestuurde afzuigventilator) | Minimale capaciteit **>125 m³/h** + **minimaal 2 CO2-sensoren**. (No rendement % stated for this type.) |
| Insulation precondition | Same as WTW — combine with isolatiemaatregel; apply within 24 months of the insulation measure. |
| Installer / building-year | Same as WTW above. |

**Nuance for copy:** Not *all* mechanical ventilation qualifies — only **CO2-gestuurde** systems with ≥2 sensors (and WTW units). A plain demand-driven box without CO2 sensors and without an insulation measure does **not** qualify. Copy must not over-promise "MV is subsidized" — it's "energiezuinige, CO2-gestuurde ventilatie in combinatie met isolatie."
**Source URLs to cite:** `https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie` and `https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2026`

### Airconditioning — ISDE: NO `[VERIFIED: rvo.nl — airco is NOT mentioned as eligible on any ISDE page; cooling-only is excluded]`

- The RVO "wat-is-er-gewijzigd-vanaf-2026" page makes **no reference to cooling-only air conditioning** as eligible. ISDE covers heat pumps, insulation, ventilation, zonneboilers — not cooling airco.
- **Note the genuine nuance for honest copy:** an **airco-warmtepomp / lucht-lucht** unit used *for heating* is a different category from cooling-only airco. To stay literally true and avoid the D-13 trap, copy should say plainly: *"Voor airconditioning (koeling) is geen ISDE-subsidie beschikbaar."* Do NOT imply any subsidy for airco. (If TPS sells lucht-lucht heating units, that is a separate, owner-confirmable conversation — keep it out of v1 copy unless the owner raises it.)
- This directly satisfies the D-13 anti-claim: **NEVER claim ISDE/subsidie for airco.**

## Pricing & BTW Facts (CONT-05 · D-11) `[VERIFIED: WebSearch, multiple NL sources]`

| Fact | Detail | Copy implication |
|------|--------|------------------|
| NL standard BTW | **21%** on heat pumps and airco (goods). | All-in "incl. BTW" framing is correct and honest. |
| NL reduced labor rate | **9%** can apply to *installation labor* when one party supplies AND installs in one assignment (geen apart "verlaagd tarief" op de warmtepomp zelf). | Do not over-claim a "9% warmtepomp" — it's a labor-component nuance; keep "all-in incl. BTW" simple. |
| **Belgian 6% BTW** | **Belgium only**, from 1 Jan 2026. **NOT applicable in NL.** | **D-13 anti-claim: NEVER state Belgian 6% BTW.** This is the exact trap — many NL-facing pages confuse the two. |
| WP pricing | No standardized NL price list (quote-based). | Warmtepompen = "op maat via offerte" with inclusions (D-11), confirmed by REQUIREMENTS "Out of Scope". |

**Copy guidance:** Airco/WTW/MV keep the proven all-in table (incl. BTW + voorrijkosten note); Warmtepompen = "op maat via offerte". Pricing DATA stays in `components/PricingTabs.tsx` — only framing copy is added.

## Certification / Keurmerk Facts (CONT-06 · D-12) `[VERIFIED: WebSearch — ondernemersplein.overheid.nl, stek.nl]`

| Mark | What it is | Honest-copy implication |
|------|-----------|------------------------|
| **F-gassen / STEK certificaat** | **Legally required** (EU F-gas regulation 517/2014) for any company that installs/services airco or heat pumps with refrigerants. STEK company-cert mandatory since 1 April 2020. | This is a *license to operate*, not a differentiator. If TPS operates legally it holds this — but **D-12 still gates the named claim until proof is uploaded** (do not assume; verify via intake §6). Per 29 Mar 2026 a new A1–E persoonscertificaat system replaces the old one; existing certs valid to 11 Mar 2029. |
| InstallQ (Erkend Installateur) | Voluntary quality register | Named only if held + proof (D-12). |
| BRL (which one?) | Voluntary quality certification | Named only if held + proof; specify which BRL. |
| VCA | Safety certification (relevant for zakelijk) | Named only if held + proof. |
| Bedrijfsaansprakelijkheidsverzekering | Liability insurance | Trust signal; mention only if confirmed. |

**Critical D-02 tension:** the locked USP list (D-14/CONT-07) includes **"Gecertificeerd"**, but D-02 forbids the word "gecertificeerd" until at least one certification is confirmed via proof. See Open Questions — this needs resolution. (Likely resolution: F-gassen/STEK is legally required to operate, so confirming it via intake §6 unblocks the "Gecertificeerd" USP; until then use "Vakkundig"/"Ervaren".)

## Brand-Asset Sourcing (CONT-03 · D-19) `[VERIFIED: official brand sources]`

| Brand | Official asset source | Third-party logo use rule | Disposition for Phase 4 |
|-------|----------------------|---------------------------|------------------------|
| Daikin | My Daikin business portal / Bibliotheek (`my.daikin.nl`) — logos under marketing materials; requires professional account. "Stand By Me Certified Partner" logo gated on certification. `[CITED: daikin.nl]` | Official logos behind partner login; certified-partner badge requires program membership. | **Owner supplies via intake §5/§9** (he has the account if he's a partner). Else text-chip fallback. |
| Mitsubishi Electric | Approved artwork from marketing dept only; "must never be typeset, recreated or modified". Terms of use: **"no use... permitted, nor any license to use"** without express written consent. `[VERIFIED: mitsubishielectric.com/en/terms]` | **Third-party use prohibited without express written consent.** No public partner-logo program found. | **Owner supplies via intake** (with his authorization) or **text-chip fallback**. Do NOT pull from aggregators. |
| Mitsubishi Heavy Industries | `mhinederland.nl` (NL importer) — partner/installer assets via importer relationship. `[CITED: mhinederland.nl]` | Same Mitsubishi-group trademark posture; "officiële installateur" is a claim some dealers make — gated for TPS (D-12). | **Owner supplies via intake** or text-chip fallback. |
| Mitsubishi Ecodan | Ecodan is Mitsubishi Electric's heat-pump line — same Mitsubishi Electric terms apply. | Same as Mitsubishi Electric. | Same — owner-supplied or fallback. |

**Hard rule (reinforces D-19):** Do **not** download brand logos from third-party aggregators (brandfetch, seeklogo, logowik, etc.) — those are unauthorized copies and several brands explicitly prohibit recreated/modified marks. The safe path is **owner-supplied official assets** (he has portal access as an installer) via intake §9, with **BrandGrid's text-chip fallback** as the default for any brand whose official asset isn't in hand. **Logo presence ≠ a dealer/"erkend installateur" claim** — that line stays gated on owner verification (D-12).

## Reviews & aggregateRating (CONT-08 · D-17) `[VERIFIED: developers.google.com]`

### CRITICAL policy finding (not in CONTEXT — refines D-17 rationale, no code change needed)
- **Self-serving aggregateRating gets NO star rich results.** Google: *"If the entity that's being reviewed controls the reviews about itself, their pages that use `LocalBusiness` or any other type of `Organization` structured data are ineligible for star review feature."* This applies whether the rating is in your own structured data OR via an embedded Google/Facebook widget. `[VERIFIED: developers.google.com/search/docs/appearance/structured-data/review-snippet]`
- **Implication for D-17:** the reserved `aggregateRating` slot will **not** produce gold stars in Google's blue links for TPS's own site. It is still worth filling because (a) it is consumed by AI/LLM search (Gemini/ChatGPT/Perplexity) and knowledge panels, (b) it powers honest on-page score/count/link display, and (c) it is technically correct structured data. **Frame the deliverable as "honest on-page trust display + valid structured data," not "Google star snippets."**
- **This does not change Phase 3 code** (the slot is already built empty and Phase 3 is locked) — it changes the *expectation* the planner/owner should have.

### Technical requirements for a valid `aggregateRating` (when owner provides real data)
- Required: `ratingValue` (the average) + at least one of `ratingCount` or `reviewCount`.
- Recommended: `bestRating` (defaults to 5), `worstRating` (defaults to 1).
- **Gated until real:** ship empty until the owner provides the **real Google score + count** via intake §8 (D-13: no rating without a real Google source). Practical safe threshold is ≥5 genuine reviews.

### Consolidation (D-17)
- **Three scattered `REVIEWS` arrays exist** and must collapse to one source:
  - `app/page-sections/ReviewsSection.tsx:6`
  - `app/over-ons/page.tsx:11`
  - `app/diensten/page.tsx:18`
- **Data-quality finding:** several quoted reviews contain the **old brand string "TPS Ventilatie"** (e.g. "TPS Ventilatie heeft bij ons een WTW-installatie geplaatst"). These are *verbatim customer quotes* — do NOT silently edit a customer's words. Surface to the owner via intake whether to keep verbatim (authentic) or request he flag any he wants adjusted. Default: keep verbatim (authenticity > brand consistency in a real review).
- Show score/count/link on home + key pages (D-17); Phase 6 restyles the home presentation but reads this same source (D-18).

## Runtime State Inventory

> This is an editorial phase (content into typed data + one new module). No renames of code symbols, no datastore, no OS state. Included for completeness per the rename/refactor trigger because D-17 *consolidates* (removes) three existing arrays and CONT-08 touches a brand-string-in-data concern.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | None — fully static site, no DB, no datastore. The taxonomy + reviews ARE the data and live in git. | None — verified (ARCHITECTURE.md "no server runtime"; no DB in package.json). |
| **Live service config** | Google Business Profile holds the **real review score/count** (not in git) — needed for `aggregateRating` (D-17). Owner provides via intake §8. GBP NAP already aligned (Phase 3 SEO-07). | Owner action via intake; map returned score/count into the reviews source. |
| **OS-registered state** | None — no cron/Task Scheduler/pm2; Vercel CI builds. | None. |
| **Secrets / env vars** | None added. Existing `NEXT_PUBLIC_GHL_WEBHOOK_URL` + `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` untouched. (Webhook-secret rename is Phase 5.) | None. |
| **Build artifacts** | Removing the 3 scattered `REVIEWS` arrays and adding `lib/reviews.ts` + (optional) `scripts/assert-no-forbidden-claims.ts` are source edits; `out/`/`.next/` regenerate. The prebuild gate (`validate-taxonomy.ts`) re-runs automatically. | After edits, the existing prebuild gate validates on next Vercel build (do NOT run build locally on OneDrive). |

**The canonical question — after every file is updated, what still holds an old value?**
- **Old brand string "TPS Ventilatie"** survives in: (a) verbatim review quotes (keep — customer words, see CONT-08 finding); (b) `SITE.email` domain `info@tpsventilatie.nl` (intentional — domain stays per Phase 3 D-01); (c) the live GBP/domain (owner/Phase-3 scope). In-repo *content* edits in this phase do not need to touch these — but the planner should NOT mass-replace "TPS Ventilatie" in review quotes.
- **Three `REVIEWS` arrays** are the only data with duplicate copies; consolidating to `lib/reviews.ts` (D-17) is a code edit, not a data migration (nothing stores reviews outside git).

## Common Pitfalls

### Pitfall 1: Passing the 120w Zod gate without passing the *uniqueness* bar
**What goes wrong:** A page hits 120 words by padding generic filler; the build goes green, but Google (Dec-2025) and the owner see interchangeable thin content.
**Why it happens:** The Zod gate measures length, not distinctiveness — it's a floor, not the real bar (D-15 is).
**How to avoid:** Use Pattern 2's angle map; include concrete service-specific detail (real steps, symptoms, parts). The human editorial gate (D-07) is the backstop. A self-check: read any two pages back-to-back — if swapping their H1s would make them indistinguishable, rewrite.
**Warning signs:** Two intros sharing >50% phrasing; an FAQ answer copy-pasted across pages.

### Pitfall 2: Stating a subsidy/BTW fact that's true in Belgium but false in NL
**What goes wrong:** Claiming "6% BTW op warmtepompen" (Belgian, from 2026) on an NL page — factually wrong, directly damages the "Transparant" USP, and is the named D-13 anti-claim.
**Why it happens:** Belgian and Dutch HVAC content rank together in Dutch-language search; the 6% headline is everywhere.
**How to avoid:** NL = 21% standard (9% labor nuance only). Cite RVO/Belastingdienst, never a Belgian source. The recommended grep gate catches the literal string "6% btw".
**Warning signs:** Any "6%", "verlaagd btw-tarief 6", or a Belgian source URL in copy.

### Pitfall 3: Over-promising ISDE for mechanische ventilatie or airco
**What goes wrong:** "Mechanische ventilatie is gesubsidieerd" (only CO2-gestuurde + insulation qualifies) or any subsidy implication for airco (none exists).
**Why it happens:** The 2026 ventilation-into-ISDE news is genuinely new and easy to over-generalize.
**How to avoid:** Use the per-pillar facts table precisely — MV needs CO2 sensors + an isolatiemaatregel; airco gets a plain "geen ISDE-subsidie voor koeling." Always pair ventilation subsidy with the insulation precondition.
**Warning signs:** A subsidy claim on the airco pillar; an MV subsidy claim without the CO2-sensor + isolatie conditions.

### Pitfall 4: Rendering a brand logo or "erkend installateur" before owner verification
**What goes wrong:** Shipping an unauthorized brand logo (from an aggregator) or an "erkend installateur" badge TPS can't prove — trademark risk + D-13 violation.
**Why it happens:** Logos are easy to find on aggregator sites; "erkend" reads like a normal trust word.
**How to avoid:** `erkendInstallateur:false` stays until intake §5 proof; logos come only from owner-supplied official assets, else text-chip fallback. Naming a product you install ("wij installeren Daikin") is fine; claiming authorized-dealer status is not.
**Warning signs:** A logo file appearing in `/public/images/brands/` without an owner-supplied provenance; "erkend"/"officiële dealer" in rendered copy.

### Pitfall 5: Expecting Google star snippets from the aggregateRating slot
**What goes wrong:** Owner/planner expects gold stars in Google results from the self-hosted rating; they won't appear (self-serving policy).
**Why it happens:** aggregateRating historically produced stars; the LocalBusiness/Organization self-serving exclusion is not widely known.
**How to avoid:** Frame the slot as honest on-page display + valid structured data for AI/LLM search, not as a Google-stars play. Still fill it with real data (gated).
**Warning signs:** A success criterion or owner expectation phrased as "show stars in Google."

## Code Examples

> Illustrative — planner finalizes field names/wording. These show *shape*, not final copy. Verified against the existing `types.ts` `ContentShell` and Zod gate.

### Filling a ContentShell to clear the gate (the shape every page must satisfy)
```typescript
// lib/services/warmtepompen.ts — pillar node content (currently EMPTY, net-new).
// Must clear: intro >= 120 words, steps.length >= 1, faqs.length in [3,6].
content: {
  h1: "Warmtepompen in Zoetermeer",
  intro: "…>=120 unique Dutch words: category overview + ISDE conditions " +
         "(durable facts, amounts→consult) + regio Zoetermeer angle + " +
         "vakkundige/ervaren framing (NOT 'gecertificeerd' until proof)…",
  steps: [ { title: "Adviesgesprek", body: "…" }, /* concrete, WP-specific */ ],
  faqs: [   // DECISION FAQs on the pillar (D-16): subsidie, garantie, geluid
    { question: "Kom ik in aanmerking voor ISDE-subsidie?", answer: "…conditions + RVO link…" },
    { question: "Hoeveel geluid maakt een warmtepomp?", answer: "…" },
    { question: "Welke garantie geldt er?", answer: "…" },
  ],
  localAngle: "…Zoetermeer + 60 km (Den Haag, Delft, Leiden…) signal, not city pages…",
  metaTitle: "Warmtepomp Zoetermeer | TPS klimaattechniek",
  metaDescription: "…",
}
```

### Recommended D-13 anti-claim grep gate (build-enforced)
```typescript
// scripts/assert-no-forbidden-claims.ts — run in prebuild alongside validate-taxonomy.
// Mirrors existing scripts/assert-seo.ts pattern. Greps the SERIALIZED published/review
// content for forbidden strings. Fails the build (exit 1) on any hit.
import { PAGES } from "@/lib/services/registry";

const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  { pattern: /\b6\s*%\s*btw/i,            why: "Belgian 6% BTW — false in NL (D-13)" },
  { pattern: /erkend\s+installateur/i,    why: "dealer claim — gated until owner proof (D-13)" },
  { pattern: /gecertificeerd/i,           why: "no 'gecertificeerd' until cert proof (D-02/D-13)" },
  // airco + subsidie co-occurrence is best caught per-node (airco pillar must not mention ISDE)
];
let failed = false;
for (const p of PAGES) {
  if (p.status === "draft") continue;             // only gate review/published
  const blob = JSON.stringify(p.content).toLowerCase();
  for (const { pattern, why } of FORBIDDEN) {
    if (pattern.test(blob)) { console.error(`❌ ${p.primaryKeyword}: ${why}`); failed = true; }
  }
}
process.exit(failed ? 1 : 0);
```
*Note: "gecertificeerd" becomes allowed once F-gassen/STEK is owner-verified — at that point remove that one pattern (or scope it to "before proof"). The grep is a coarse net; the written checklist handles nuance the regex can't (e.g. airco-pillar-specific subsidy mentions).*

## State of the Art

| Old Approach | Current Approach | When Changed | Impact on Phase 4 |
|--------------|------------------|--------------|-------------------|
| FAQPage markup → FAQ rich results | FAQ rich results **deprecated**; FAQs valued as on-page content + AI/LLM signal | Google, **7 May 2026** `[VERIFIED]` | Keep the 3-6 FAQ Zod gate (E-E-A-T/UX/AI value); do NOT add FAQs *to chase rich snippets*. No code change (Phase 3 locked). |
| aggregateRating → star snippets for any site | Self-serving (own-site) LocalBusiness/Organization ratings **ineligible for stars** | Google policy (current) `[VERIFIED]` | Fill the slot for honest display + AI search, not for Google stars. Reframe expectation. |
| ISDE = heat pumps + insulation only | **Ventilation (WTW + CO2-MV) added to ISDE** from 1 Jan 2026, with insulation precondition | RVO, 1 Jan 2026 `[VERIFIED]` | The WTW/MV subsidy story is genuinely *new and current* — a real differentiator if stated precisely. |
| E-E-A-T mostly for YMYL | E-E-A-T weighted across **all** content; lived experience rewarded; aged/known entities dominate | Dec 2025 Core Update `[VERIFIED]` | Trust copy must show real experience (Thomas's story, real reviews, real process) — not just keywords. Favors the owner-reviewed, accurate approach this phase takes. |

**Deprecated/outdated:**
- Chasing FAQ/Review rich snippets as a primary goal — both curtailed in 2026. The on-page and AI-consumption value remains; plan for that, not for snippets.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The per-URL `[ASSUMED]` Dutch `primaryKeyword` strings (carried from Phase 1) target the right query (intent verified, **volume not** — no paid tool) | Phase Requirements / Keyword note | A head term with near-zero volume targets the wrong query. **Mitigation:** validate in Keyword Planner/Ahrefs before locking content; keywords are editable node data. The 3 flagged low-volume pages (`advies` ×2, `wtw inregelen`) are highest-risk. |
| A2 | TPS holds a valid F-gassen/STEK certificaat (legally required to operate as an airco/WP installer) | Certification Facts | If TPS somehow lacks it, the "Gecertificeerd" USP and any cert copy are blocked. **Mitigation:** confirm via intake §6 before using "gecertificeerd" (D-02 already gates this). |
| A3 | The owner has business-portal access to official Daikin/Mitsubishi logos (as an installer) | Brand-Asset Sourcing | If not, BrandGrid text-chip fallback is used for those brands (already the safe default per D-19). No blocker. |
| A4 | The `lib/reviews.ts` consolidation target is acceptable vs `SITE.reviews` | Standard Stack | Pure structure choice; D-17 leaves it to planner discretion. Low risk. |
| A5 | RVO 2026 conditions remain stable through launch (verified 2026-06; pages dated May–Jun 2026) | Per-Pillar ISDE Facts | Conditions change slowly (the *amounts* change faster — hence D-10 routes them to consult). **Mitigation:** copy cites the live RVO URL so the reader always reaches current detail; re-verify at launch. |

**This table is non-empty — A1 (keyword volume) and A2 (cert held) are the items needing confirmation before content locks; both have cheap mitigations already baked into the decisions.**

## Open Questions

1. **"Gecertificeerd" USP vs D-02 gate (CONT-07 / D-14).**
   - What we know: the locked 4-USP set includes "Gecertificeerd"; D-02 forbids the word until a certification is proof-confirmed; F-gassen/STEK is *legally required* to operate.
   - What's unclear: whether to (a) confirm F-gassen/STEK via intake §6 and then use "Gecertificeerd", or (b) use a literally-true interim USP ("Vakkundig"/"Ervaren") until proof lands.
   - Recommendation: **Plan both paths.** Default to interim "Vakkundig" wording (D-02-safe); the moment intake §6 returns F-gassen/STEK proof, swap to "Gecertificeerd". Treat the USP word as a gated value, like the dealer badge.

2. **Verbatim "TPS Ventilatie" in customer review quotes (CONT-08).**
   - What we know: real reviews quote the old brand name; editing customer words risks authenticity/fake-review concerns.
   - What's unclear: owner preference.
   - Recommendation: keep verbatim by default (authenticity wins under Dec-2025 trust signals); flag in the intake/owner message as an FYI. Do NOT mass-replace.

3. **Does TPS sell lucht-lucht (airco-as-heating) units that *could* touch ISDE?**
   - What we know: cooling-only airco = no subsidy; some airco units heat and blur the line.
   - What's unclear: TPS's product mix.
   - Recommendation: keep airco copy to a clean "geen ISDE voor koeling" for v1; only revisit if the owner raises lucht-lucht heating. Avoids a YMYL edge case.

## Environment Availability

> Phase 4 is content/data edits + (optionally) two in-repo scripts. The only external dependencies are **authoritative web sources** (for citation) — all reachable and verified this session. No build tools are run during planning (OneDrive deadlock note).

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| rvo.nl (ISDE pages) | CONT-04 citations | ✓ (verified 2026-06-06) | live | — (re-verify at launch) |
| developers.google.com (review/FAQ policy) | CONT-08/09 rationale | ✓ | live | — |
| Official brand portals (My Daikin, MHI NL) | CONT-03 logos | ✓ but gated (owner account) | — | BrandGrid text-chip fallback (D-19) |
| Tally MCP | D-04 form publish | ✓ (loaded this session — `2EojAA` exists, DRAFT) | — | Manual publish in Tally UI |
| Keyword-volume tool (Ahrefs/KW Planner) | A1 validation | ✗ | — | Use Phase-1 SERP-intent assignments; validate post-launch (keywords are editable data) |
| `npm install` / `next build` / `tsc` | (NOT run — OneDrive deadlock) | ✗ by policy | — | Vercel CI runs the prebuild gate on deploy; preview deploy is the validation surface (D-05) |

**Missing dependencies with no fallback:** None — nothing blocks drafting.
**Missing dependencies with fallback:** Keyword tool (→ Phase-1 SERP intent + post-launch validation); official logos (→ owner-supplied or text-chip fallback); local build (→ Vercel CI + preview deploy).

## Validation Architecture

> nyquist_validation is enabled. This is an **editorial** phase, so the "tests" are structural/factual gates + a human acceptance gate rather than unit tests. There is no test framework installed (confirmed: CLAUDE.md "Not detected — no test framework"), and **none should be added** (test infra is explicitly Out of Scope per REQUIREMENTS.md). Validation is build-time assertions + editorial sign-off.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (none installed; test infra Out of Scope). Validation = build-time `tsx` scripts + human review. |
| Config file | none |
| Quick run command | `npx tsx scripts/validate-taxonomy.ts` (the existing prebuild gate) — **run on Vercel CI, not locally** (OneDrive deadlock) |
| Full suite command | `npm run build` on Vercel (prebuild gate + render of all 22 routes) |

### Phase Requirements → Validation Map
| Req | Behavior validated | Validator type | How | Exists? |
|-----|-------------------|----------------|-----|---------|
| CONT-01/02/09 | intro ≥120w, ≥1 step, 3-6 FAQs on review/published | **structural (build-blocking)** | `publishedContentSchema` via `scripts/validate-taxonomy.ts` (prebuild) | ✅ exists (P1) |
| CONT-01/02 (uniqueness *quality*) | no two pages distinguishable only by H1 (D-15) | **human** | owner + Claude editorial read on preview deploy | ✅ process (D-05/D-07) |
| CONT-04 | ISDE facts accurate + sourced | **factual** | source-URL present in copy + `[UNVERIFIED]` discipline (none unverified in this research) + this doc's verified facts table | ✅ this research |
| CONT-03/06 | no unverified dealer/cert/rating claim | **anti-claim (recommend build-blocking)** | `scripts/assert-no-forbidden-claims.ts` grep gate **+** written D-13 checklist | ❌ Wave 0 (build the grep script) |
| CONT-05 | no Belgian 6% BTW; all-in framing honest | **anti-claim** | same grep gate (`/6\s*%\s*btw/`) + checklist | ❌ Wave 0 |
| CONT-08 | aggregateRating only with real Google data | **factual + human** | slot stays empty until intake §8 returns real score/count; grep for stray rating literals | ✅ gated by D-13 |
| CONT-10 | every shipped page owner-approved | **human acceptance gate** | preview deploy review → `status` flip to `published` (git commit = audit) | ✅ process (D-06/D-07) |

### The D-13 anti-claim gate — recommendation
**Implement BOTH** (resolves the Claude's-Discretion item):
- **Written checklist** (per page, before `review`): no ISDE/subsidie for airco; no Belgian 6% BTW; no unverified dealer/"erkend"; no unheld keurmerk; no rating without real Google source. Handles nuance a regex can't (e.g. airco-pillar subsidy context).
- **`scripts/assert-no-forbidden-claims.ts`** wired into prebuild (alongside `validate-taxonomy.ts`): hard-fails the build on literal forbidden strings ("6% btw", "erkend installateur", "gecertificeerd"-before-proof). Mirrors the existing `scripts/assert-seo.ts` pattern; makes the YMYL gate build-enforceable and regression-proof.

### Sampling rate (editorial cadence)
- **Per drafting commit:** the prebuild gate runs on Vercel preview deploy (every push) — catches structural failures (length/steps/faqs) immediately and renders the page for review.
- **Per pillar complete:** Claude self-review against the angle map (Pattern 2) + anti-claim checklist before flipping that pillar's nodes `draft → review`.
- **Phase gate:** one whole-site owner review (D-07) on the preview deploy → batch-flip approved set to `published` (D-09) → final green build.

### Wave 0 gaps
- [ ] `scripts/assert-no-forbidden-claims.ts` — D-13 grep gate, wired into prebuild (CONT-03/05/06).
- [ ] `lib/reviews.ts` (or `SITE.reviews`) — single consolidated reviews source (CONT-08, D-17), replacing the 3 scattered arrays.
- [ ] Written D-13 anti-claim checklist artifact (can live in the plan or a short `docs/` note).
- [ ] (No test framework install — explicitly NOT a gap; Out of Scope.)

## Security Domain

> `security_enforcement` is not set to false in config, so this section is included. **However, Phase 4 introduces no runtime, no input handling, no auth, no network endpoints** — it writes static content into typed data files. Form security, the webhook secret, and input validation are explicitly **Phase 5** (QA-02, LEAD-*). The applicable surface here is narrow.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth in this phase (static content). |
| V3 Session Management | no | No sessions. |
| V4 Access Control | no | No protected routes. |
| V5 Input Validation | **partial** | The only "input" is the **Tally intake form** (D-04) — Tally handles its own validation/storage; it is password-protected (`tpsklimaat2026`) + unguessable URL. No app-side input handling is added. Content itself is build-validated by Zod (a correctness gate, not a security boundary). |
| V6 Cryptography | no | No secrets handled this phase. (Webhook secret = Phase 5.) |

### Known concerns for this phase (content-integrity, not classic AppSec)
| Concern | Type | Mitigation |
|---------|------|------------|
| False YMYL claim published (subsidie/cert/BTW) | **Trust/legal integrity** (the real "threat" here) | D-13 grep gate + checklist + verified facts table + owner sign-off (D-07). This is the phase's primary risk and is gated. |
| Unauthorized brand-logo use | **IP/trademark** | Owner-supplied official assets only, else text-chip fallback (D-19); never aggregator copies. |
| Fake/edited review content | **Trust/policy** (Google fake-review penalty) | Keep reviews verbatim; `aggregateRating` only from real Google data (D-13); review-consent confirmed via intake §8. |
| Tally form access | **Data privacy** (owner's business data) | Tally password + unguessable URL (already specced); owner data routes through GSD, not direct edits. |
| JSON-LD injection via content | **Output integrity** | Phase 3 JSON-LD builders already `<`-escape output (locked); content flows through them safely. No action this phase. |

## Sources

### Primary (HIGH confidence — official, fetched directly)
- **RVO ISDE warmtepomp (woningeigenaren):** https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp — conditions verified, page "Laatst gecontroleerd: 3 juni 2026"
- **RVO ISDE ventilatie (woningeigenaren):** https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie — WTW/MV conditions + insulation precondition, "Laatst gecontroleerd: 6 mei 2026"
- **RVO ISDE — wat wijzigt er vanaf 2026:** https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2026 — ventilation added, airco not mentioned, heat-pump changes, "Laatst gecontroleerd: 5 januari 2026"
- **Google — Review snippet (Review, AggregateRating) structured data:** https://developers.google.com/search/docs/appearance/structured-data/review-snippet — self-serving LocalBusiness/Organization ineligible for star feature; aggregateRating required props
- **Mitsubishi Electric — Terms of use:** https://www.mitsubishielectric.com/en/terms/index.html — third-party trademark use prohibited without express written consent

### Secondary (MEDIUM — verified across multiple credible sources)
- Daikin NL installer/business portal: https://www.daikin.nl/nl_nl/installateurs.html + my.daikin.nl (Bibliotheek; Stand By Me Certified Partner)
- Mitsubishi Heavy Industries NL: https://www.mhinederland.nl/
- F-gassen/STEK (legally required): https://ondernemersplein.overheid.nl/wetten-en-regels/certificaat-voor-werken-met-f-gassen/ + https://stek.nl/warmtepompen-f-gassen-cat-2-examen/ (new A1–E system from 29 Mar 2026)
- NL BTW on heat pumps (21% standard, 9% labor nuance; Belgian 6% is BE-only): https://www.warmtepomp-gids.nl/subsidie/btw/ + https://www.dewarmte.nl/kennisbank/btw-warmtepompen/
- Dec-2025 Core Update / E-E-A-T expansion: https://www.gsqi.com/marketing-blog/google-december-2025-broad-core-update-analysis-findings/ + https://almcorp.com/blog/google-december-2025-core-update-complete-guide/
- Cannibalization / one-canonical-page + FAQ rich-result deprecation (7 May 2026): https://www.dataenriche.com/what-is-cannibalization-in-seo-how-to-fix-it/ + https://developers.google.com/search/docs/appearance/structured-data/faqpage

### Tertiary (LOW — context only, not relied on for facts)
- Aggregator logo sites (brandfetch/seeklogo/logowik) — listed only to mark them as **sources to AVOID** for brand logos (unauthorized copies).

## Metadata

**Confidence breakdown:**
- ISDE per-pillar facts (CONT-04): **HIGH** — fetched from official RVO pages directly; conditions + source URLs captured; amounts deliberately excluded (D-10).
- Anti-claim list / BTW / cert facts (CONT-03/05/06): **HIGH** — Belgian-vs-NL BTW and F-gassen-required both verified; the named D-13 traps are confirmed real.
- Reviews/aggregateRating policy (CONT-08): **HIGH** — self-serving exclusion verified against Google docs.
- Uniqueness/FAQ patterns (CONT-01/02/09): **HIGH** for the principle (Dec-2025 + cannibalization verified); **execution is editorial craft** (the human gate covers it).
- Brand-asset sourcing (CONT-03): **HIGH** on the trademark rules; **MEDIUM** on whether the owner has portal access (A3, cheap fallback).
- Keyword assignments (carried from P1): **MEDIUM** — intent verified, volume not (A1).

**Research date:** 2026-06-06
**Valid until:** ISDE facts — re-verify at launch (RVO updates periodically; copy cites live URLs so readers always see current detail). SEO policy (review/FAQ snippets) — stable but fast-moving; ~30 days. Brand/cert facts — stable; ~90 days.
