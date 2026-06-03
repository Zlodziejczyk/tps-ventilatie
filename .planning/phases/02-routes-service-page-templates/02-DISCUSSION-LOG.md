# Phase 2: Routes & Service-Page Templates - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 2-Routes & Service-Page Templates
**Areas discussed:** Template anatomy, Existing content, Empty-shell rendering, Nav redesign, RelatedServices logic, Hero & motion / CWV, Hub trust strip / reviews, Mobile menu depth, Homepage uplift (routing)

---

## Template Anatomy

### Q1 — Sub-service page section order

| Option | Description | Selected |
|--------|-------------|----------|
| Convert-forward | Breadcrumbs → Hero+CTA → Steps → BrandGrid* → FAQ(+localAngle) → Related → CTABanner | |
| Trust-forward | Brands surface right after the hero, steps pushed down | |
| You decide | Lock convert-forward as Claude's discretion | ✓ |

**User's choice:** You decide → convert-forward locked.

### Q2 — Hub/pillar richness vs sub-service pages

| Option | Description | Selected |
|--------|-------------|----------|
| Pillars rich, hub lean | Pillars are full landing pages; hub is a clean router | |
| All levels rich | Hub also gets intro/why-TPS/FAQ depth | |
| All lean / navigational | Hub + pillars mostly routers; depth on subs only | |
| You decide | Lock "pillars rich, hub lean" | ✓ |

**User's choice:** You decide → pillars rich, hub lean locked.
**Notes:** Both template-anatomy questions delegated; SEO weight of rich pillar pages noted.

---

## Existing Content

| Option | Description | Selected |
|--------|-------------|----------|
| Port copy + salvage visuals | Existing copy → draft shells (status stays draft); visuals → reusable components | ✓ |
| Salvage visuals only | Components adopt the look; copy (re)written fresh in Phase 4 | |
| Clean slate | Fresh components; archive the current page | |
| You decide | — | |

**User's choice:** Port copy + salvage visuals.
**Notes:** Watch-items flagged — drop "Panasonic" to match taxonomy brands; fold "dakventilator" into MV onderhoud-reinigen/vervangen (no new route); pricing stays in PricingTabs.

---

## Empty-Shell Rendering

| Option | Description | Selected |
|--------|-------------|----------|
| Graceful omit | Always render Hero+Breadcrumbs+Related+CTA; omit empty sections; navDescription as intro fallback | ✓ |
| WIP placeholders | Empty sections show "binnenkort meer" / skeleton blocks | |
| You decide | — | |

**User's choice:** Graceful omit.

---

## Nav Redesign

### Q1 — Diensten dropdown pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Mega-menu | 4 pillar columns + their subs, taxonomy-derived; sitewide internal-linking benefit | ✓ |
| Pillars-only dropdown | Dropdown lists 4 pillars; subs reached from pillar pages | |
| You decide | — | |

**User's choice:** Mega-menu.

### Q2 — DienstenNav fate

| Option | Description | Selected |
|--------|-------------|----------|
| Retire it | Remove the scroll-spy; wayfinding absorbed by mega-menu + breadcrumbs + grids + related | ✓ |
| Repurpose as in-pillar strip | Taxonomy-derived sticky sub-service strip on pillar pages | |
| You decide | — | |

**User's choice:** Retire it.

---

## RelatedServices Logic

| Option | Description | Selected |
|--------|-------------|----------|
| Same-pillar siblings | Other subs in the same pillar; cross-sell = Phase 4 override | ✓ |
| Siblings + curated cross-sell | Add one baked-in cross-pillar link now | |
| You decide | — | |

**User's choice:** Same-pillar siblings.

---

## Hero & Motion / CWV

| Option | Description | Selected |
|--------|-------------|----------|
| Lean static hero | Tonal background + icon; reuse only AnimateOnScroll/Stagger; no aurora/particles on service pages | ✓ |
| Rich hero on pillars | Home-style aurora/particles on pillar heroes | |
| You decide | — | |

**User's choice:** Lean static hero.
**Notes:** Re-opened later — user asked to dig into hero motion/animations; resolved as the "lite" tier of a shared motion language. The premium tier was redirected to a separate Homepage uplift phase (below). Rationale: 22-page CWV surface, SEO-10 launch criterion, pre-empts QA-06 (Phase 5) rework, CONCERNS.md perf flags.

---

## Hub Trust Strip / Reviews

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse existing reviews now | Hub trust strip reuses existing ReviewCarousel + REVIEWS; Phase 4 consolidates | ✓ |
| Stub for Phase 4 | Placeholder section Phase 4 fills | |
| You decide | — | |

**User's choice:** Reuse existing reviews now.

---

## Mobile Menu Depth

| Option | Description | Selected |
|--------|-------------|----------|
| 2-level accordion | Pillars expand to subs (collapsed by default); every service reachable from the drawer | ✓ |
| Pillars-only on mobile | Drawer lists 4 pillars; subs from the pillar page | |
| You decide | — | |

**User's choice:** 2-level accordion.

---

## Homepage Uplift (scope routing)

User raised a new goal: make the home page *more premium / professional / "alive," capture attention, ensure conversion*. Flagged as outside Phase 2's boundary (Phase 2 = service-page templates; home page is an existing static node).

| Option | Description | Selected |
|--------|-------------|----------|
| Own phase, sketch first | Log as a dedicated "Homepage conversion uplift" phase; /gsd-sketch to explore, then /gsd-phase to slot it | ✓ |
| Sketch it now | Jump into /gsd-sketch before closing out | |
| Fold into Phase 2 | Build a shared premium-hero/motion system in Phase 2 (cautioned — scope stretch + CWV risk) | |

**User's choice:** Own phase, sketch first.
**Notes:** Phase 2 context finalized regardless; service heroes stay lean & CWV-safe so they inherit the home page's eventual design DNA.

---

## Claude's Discretion

- Sub-service section order (convert-forward) and hub/pillar richness split (pillars rich, hub lean) — user said "you decide."
- Route-segment file structure + `generateStaticParams` enumeration; new registry lookups (`childrenOf`, `siblingsOf`, `pillars`).
- localAngle placement (regio line above FAQ) and exact hero composition.
- Phase 2/3 metadata boundary — basic title/description in Phase 2; canonical/OG/JSON-LD in Phase 3.
- Animation limited to reused Framer helpers — no new motion system this phase.

## Deferred Ideas

- **Homepage conversion uplift** — own future phase (sketch → /gsd-phase). Premium/alive/attention/conversion redesign of the home page.
- Cross-pillar cross-sell in RelatedServices — Phase 4 editorial override (CONT-V2-04).
- Per-brand dedicated pages — v2 (CONT-V2-01).
- Per-location / neighbourhood pages — v2 (BLOG-02).
- Reviews consolidation data model — Phase 4 (CONT-08).
- Mobile / reduced-motion gating of WebGL + particles — Phase 5 (QA-06).
