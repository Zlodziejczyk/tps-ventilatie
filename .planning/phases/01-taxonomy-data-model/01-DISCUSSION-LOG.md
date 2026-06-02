# Phase 1: Taxonomy & Data Model - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-02
**Phase:** 1-Taxonomy & Data Model
**Areas discussed:** URL & slug structure, Taxonomy model & validation, NAP/radius/service area, Keyword map & content shells

---

## URL & Slug Structure

### Q1 — URL nesting
| Option | Description | Selected |
|--------|-------------|----------|
| Nested under /diensten | /diensten/{pillar}/{sub}. Clean breadcrumbs, topical siloing, [pillar]/[service] segments | ✓ |
| Pillars at root | /{pillar}/{sub}. Shorter URLs, /diensten as index only; breadcrumbs lose Diensten level | |

### Q2 — Slug convention
| Option | Description | Selected |
|--------|-------------|----------|
| Full descriptive keywords | airconditioning, warmtepompen, wtw, mechanische-ventilatie; subs spelled out | ✓ |
| Short / casual forms | airco, warmtepomp, wtw, mv | |

### Q3 — Trailing-slash / canonical policy
| Option | Description | Selected |
|--------|-------------|----------|
| No trailing slash | Next default, matches current code | |
| Trailing slash | Folder-style /path/index.html | |
| You decide | Claude locks the safest consistent policy | ✓ |

**Notes:** Claude locked no-trailing-slash / lowercase / leading-slash; single `urlFor()` helper as the only href builder.

### Q4 — Page registry scope
| Option | Description | Selected |
|--------|-------------|----------|
| One unified page registry | Discriminated union (hub\|pillar\|service\|static); sitemap + nav read one list | ✓ |
| Services-only taxonomy + static list | Separate STATIC_PAGES array; two lists to sync | |

**User's choice:** Nested under /diensten · full descriptive slugs · you-decide (→ no trailing slash) · unified registry.
**Notes:** Requested "More questions" after Q3, leading to the Q4 unified-registry decision.

---

## Taxonomy Model & Validation

### Q1 — File organization
| Option | Description | Selected |
|--------|-------------|----------|
| Per-pillar files + registry | {pillar}.ts + types.ts + registry.ts aggregator; stays <800 lines | ✓ |
| Single taxonomy file | One taxonomy.ts; will blow past 800 lines in Phase 4 | |
| Split by concern | types.ts + data.ts + registry.ts; data.ts still oversized | |

### Q2 — Brand modeling
| Option | Description | Selected |
|--------|-------------|----------|
| Normalized brand registry | brands.ts holds each brand once; pages reference by id | ✓ |
| Embedded per page | Inline brand objects; Daikin duplicated across pillars | |

### Q3 — Uniqueness-bar enforcement (IA-08)
| Option | Description | Selected |
|--------|-------------|----------|
| Zod schema at build | validateTaxonomy() with refinements; blocking build error | ✓ |
| TypeScript types only | Compile error on missing field; can't enforce word counts | |
| Custom build-check script | Bespoke node script; no dep but more code | |

### Q4 — Empty shells now vs content later
| Option | Description | Selected |
|--------|-------------|----------|
| Per-page status field | draft\|review\|published gates content rules; CONT-10 code-enforced | ✓ |
| Separate publishable list | Second list to sync | |
| Enforce now + placeholders | Thin-placeholder ship risk (Dec-2025 Core Update) | |

**User's choice:** Per-pillar files · normalized brands · Zod at build · per-page status gate.

---

## NAP, Radius & Service Area

### Q1 — Service radius (QA-03)
| Option | Description | Selected |
|--------|-------------|----------|
| 50 km | Currently on /tarieven | |
| 100 km | Currently in PricingTabs (×2) | |
| Confirm with Thomas | Flag as owner-pending | |
| **Other (free text)** | **"tot 60km vanuit zoetermeer"** | ✓ |

**Notes:** Owner provided the real value — **60 km** — neither coded value was correct. Phrasing locked as "tot 60 km vanuit Zoetermeer".

### Q2 — Canonical business name
| Option | Description | Selected |
|--------|-------------|----------|
| TPS klimaattechniek | Matches broadened positioning; needs GBP/KvK alignment | ✓ |
| TPS Ventilatie | Current name; matches domain + GBP now | |
| Confirm GBP name first | Model as single field, flag pending | |

**Notes:** Owner action recorded — align GBP + KvK handelsnaam to "TPS klimaattechniek" (Phase 3 SEO-07 verifies).

### Q3 — Service-area model
| Option | Description | Selected |
|--------|-------------|----------|
| Radius + named regions | serviceRadiusKm + serviceAreas list; feeds areaServed + regio copy | ✓ |
| Radius only | geoCircle only; weaker regio signals | |
| Named regions only | Loses the 60 km geoCircle figure | |

### Q4 — NAP extension completeness (SEO-08)
| Option | Description | Selected |
|--------|-------------|----------|
| Full structured NAP now | address + country + province + geo + radius + serviceAreas; geo verify-pending | ✓ |
| Only what's needed now | Defer geo/country to Phase 3 | |

**User's choice:** 60 km · TPS klimaattechniek · radius + named regions · full structured NAP.

---

## Keyword Map & Content Shells

### Q1 — Keyword location + enforcement (IA-09)
| Option | Description | Selected |
|--------|-------------|----------|
| Per-page field + uniqueness check | primaryKeyword/intent on each page; validateTaxonomy asserts uniqueness | ✓ |
| Separate keyword-map file | url→keyword map; second list to sync | |

### Q2 — Content-shell field set
| Option | Description | Selected |
|--------|-------------|----------|
| Content + SEO metadata | Body content + metaTitle/metaDescription/ogImage + keyword; one source | ✓ |
| Content fields only | Phase 3 adds metadata separately | |

### Q3 — Content field shapes
| Option | Description | Selected |
|--------|-------------|----------|
| Structured FAQs & steps, prose as text | faqs{q,a}[], steps{title,body}[]; intro/localAngle prose | ✓ |
| All Markdown blobs | Rework for FAQPage JSON-LD + components | |
| All fully structured | Heavier authoring; overkill for prose | |

**User's choice:** Per-page keyword field + uniqueness check · content + SEO metadata · structured FAQs/steps with prose text.

---

## Claude's Discretion
- **URL trailing-slash policy** — user chose "you decide" → no-trailing-slash / lowercase / leading-slash locked as the convention.
- **Pricing boundary** — pricing data stays in `PricingTabs.tsx`, out of Phase-1 taxonomy scope (user chose "Ready for context", accepting the boundary).
- Compound sub-service slug derivation, SITE flat-vs-nested layout, and the prose renderer — left to the planner within the locked decisions.

## Deferred Ideas
- Pricing as taxonomy data (revisit at CONT-05 / Phase 4).
- Reviews consolidation data model (CONT-08 / Phase 4).
- Per-brand dedicated pages (v2 — CONT-V2-01).
- Per-location / neighbourhood pages (v2 — BLOG-02); Phase 1 uses regio signals + serviceAreas, not city pages.
- Full rebrand + domain migration to tpsklimaattechniek.nl (v2 — DOM-V2-01).
