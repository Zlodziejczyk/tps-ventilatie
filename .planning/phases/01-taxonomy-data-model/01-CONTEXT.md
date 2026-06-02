# Phase 1: Taxonomy & Data Model - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 establishes **one typed source of truth** for the entire service surface and fixes NAP/service-radius at the constants layer. The deliverable is **data + types + validation — not rendered pages and not written content.**

**In scope:**
- A `lib/services/` taxonomy that registers every routable page (hub + 4 pillars + 17 sub-services + ~5 static pages) as a typed, validated data model.
- Per-URL primary keyword/intent assignment (the keyword map, IA-09) with anti-cannibalization enforced.
- A typed content-field schema ("shells") per page type with the anti-thin-content uniqueness bar (IA-08) — shells ship **empty/draft** in this phase.
- Per-page SEO metadata fields modeled on the taxonomy.
- An extended `lib/constants.ts` `SITE` as the single NAP source, including the corrected 60 km radius (SEO-08, QA-03).

**Out of scope (other phases):**
- Rendering pages/templates and taxonomy-derived nav → **Phase 2** (this phase only produces the data those routes/nav will read).
- Writing real Dutch copy into the shells → **Phase 4** (Phase 1 = empty draft shells + the schema that gates them).
- `sitemap.xml` / `robots.txt` / JSON-LD / canonical implementation → **Phase 3** (Phase 1 makes them sourceable).
- Pricing data modeling — **stays in `components/PricingTabs.tsx`**; pricing transparency is CONT-05 in Phase 4.
- Reviews consolidation (CONT-08) → Phase 4.
- The static-export-vs-hybrid decision → **Phase 5** (decision gate; do not touch `next.config.ts` output mode here, beyond `trailingSlash`).

</domain>

<decisions>
## Implementation Decisions

### URL & Slug Structure
- **D-01 — Nested URLs.** `/diensten/{pillar}/{sub-service}`. Hub at `/diensten`, 4 pillars at `/diensten/{pillar}`, 17 subs at `/diensten/{pillar}/{sub}`. Maps to Next.js `[pillar]/[service]` route segments in Phase 2. Gives clean `BreadcrumbList` (Diensten › Pillar › Sub) and strong topical siloing.
- **D-02 — Full descriptive Dutch slugs.** Pillars: `airconditioning`, `warmtepompen`, `wtw`, `mechanische-ventilatie`. Sub-services spelled out — Airco/WP: `installatie`, `onderhoud`, `reparatie-storing`, `advies`; WTW: `vervangen`, `onderhoud-reinigen`, `inregelen`, `storing`, `aanleggen`; MV: `vervangen`, `onderhoud-reinigen`, `storing`, `aanleggen`. (`wtw` kept lowercase as-is — both short AND the dominant search term.)
- **D-03 — URL policy: no trailing slash, lowercase, leading slash.** `next.config.ts` → `trailingSlash: false`. A single `urlFor()` helper in `registry.ts` is the ONLY place hrefs are built; nav, canonical, sitemap, and JSON-LD all consume it. (User said "you decide" — see Claude's Discretion.)
- **D-04 — One unified page registry.** The model registers EVERY routable page — hub + 4 pillars + 17 subs + the ~5 static pages (home, `tarieven`, `over-ons`, `contact`, `privacy-beleid`) — as a **discriminated union by page type (`hub | pillar | service | static`)**. Sitemap (SEO-01) and nav (IA-07) read this one list → directly satisfies success-criterion 1 ("no parallel hardcoded lists exist").

### Taxonomy Model & Validation
- **D-05 — Per-pillar files + registry.** `lib/services/airconditioning.ts`, `warmtepompen.ts`, `wtw.ts`, `mechanische-ventilatie.ts` each hold that pillar + its sub-services; `lib/services/types.ts` for shared interfaces/types; `lib/services/registry.ts` aggregates into the unified `PAGES` list and exposes `urlFor()` + lookup helpers. Keeps each file <800 lines as Phase 4 content lands. **`registry.ts` is an explicit aggregation module — a justified, documented exception to the project's "no barrel files" convention** (it is not a generic re-export barrel).
- **D-06 — Normalized brand registry.** `lib/services/brands.ts` holds each brand once (`id`, name, logo, blurb, `erkendInstallateur`/dealer-status flag). Installatie pages reference brands by `id`; `BrandGrid` (Phase 2) resolves id→data. Brand→pillar mapping (from PROJECT.md): **Airco Installatie** → Daikin, Mitsubishi Electric, Mitsubishi Heavy; **Warmtepompen Installatie** → Daikin, Mitsubishi Ecodan; **WTW/MV** → no BrandGrid (their subs aren't "Installatie"). Daikin intentionally appears under two pillars — the reason for normalizing. Dealer-status values are **owner-verified in Phase 4 (CONT-03)** — modeled now as flags, values pending.
- **D-07 — Uniqueness bar enforced via Zod at build.** A Zod content schema with refinements (intro ≥120 words, 3-6 FAQs, non-empty steps + local angle) run by `validateTaxonomy()` (in `registry.ts` and/or a prebuild/test step). Empty/too-short fields throw a readable **build error → genuinely blocking** (success-criterion 3). **Introduces the `zod` dependency** (not currently installed; consistent with project TS rules; reused by Phase 5 QA-02 form validation).
- **D-08 — Per-page `status` field gates enforcement.** Each page has `status: "draft" | "review" | "published"`. `validateTaxonomy()` ALWAYS checks structure (required fields present, correct types, unique slug, unique primary keyword); checks CONTENT rules (word counts, FAQ ranges) ONLY for `review`/`published` pages. Phase 1 ships all pages as `draft` shells → **build stays green with empty content**. Phase 4 flips each page to `published` on owner sign-off → **CONT-10 editorial gate becomes code-enforced**. Phase 3 sitemap can filter non-published pages for free.

### NAP, Radius & Service Area (`lib/constants.ts` `SITE`)
- **D-09 — Service radius = 60 km** (owner-provided; resolves the 50-vs-100 conflict — *neither* coded value was correct). `SITE.serviceRadiusKm = 60`. Visible copy phrasing: **"tot 60 km vanuit Zoetermeer"**. Replace the two hardcoded mentions — `app/tarieven/page.tsx:62` ("straal van 50km") and `components/PricingTabs.tsx:442 & 519` ("straal van 100 km") — with the SITE-sourced value (**fixes QA-03**). Phase 3 JSON-LD: `geoRadius` 60000 m.
- **D-10 — `SITE.name = "TPS klimaattechniek"`** (was "TPS Ventilatie"). One field; visible brand + LocalBusiness JSON-LD `name` both read it. **OWNER ACTION (downstream):** Google Business Profile — and ideally a KvK handelsnaam — must read "TPS klimaattechniek" so NAP matches; **Phase 3 SEO-07 verifies this**. Domain stays `tpsventilatie.nl` for launch (rebrand/migration deferred — DOM-V2-01).
- **D-11 — Service area = radius + named regions.** `SITE.serviceRadiusKm = 60` AND `SITE.serviceAreas` = list of core municipalities (seed: Zoetermeer, Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden…). JSON-LD `areaServed` uses geoCircle(60 km) and/or the named places; regio copy signals (SEO-06) pull real town names. **OWNER reviews the town list** — never claim unserved areas (relevance/thin-content risk).
- **D-12 — Full structured NAP in Phase 1.** Extend `SITE` to the complete set: address parts, `country: "NL"`, `province: "Zuid-Holland"`, `geo: { lat, lng }`, `serviceRadiusKm`, `serviceAreas[]`, alongside existing phone/email/postcode/city/kvk/btw/whatsapp. Structured so Phase 3 JSON-LD and Phase 5 Maps pin (QA-05) just read fields. **Real `geo.lat/lng` flagged owner-verify-pending** — today's Maps pin is a placeholder (CONCERNS.md). Fully satisfies SEO-08 in one pass.

### Keyword Map & Content Shells
- **D-13 — Keyword data per-page + uniqueness enforced.** Each page node carries `primaryKeyword` + `searchIntent` (+ optional `secondaryKeywords[]`). `validateTaxonomy()` asserts every `primaryKeyword`/intent is **unique across all pages → cannibalization is a build error** (IA-09, success-criterion 2). Keyword lives on the page it targets (one source). The **phase-researcher performs the actual keyword research**; Claude drafts the per-URL assignments from it.
- **D-14 — Content shell = content + SEO metadata (one source).** Shells hold body content (h1, intro ≥120w, steps, 3-6 FAQs, local angle, `brandIds` on Installatie pages) AND per-page SEO metadata (`metaTitle`, `metaDescription`, `ogImage`) AND the keyword fields. Phase 3 metadata generation and Phase 4 content both read the taxonomy → genuinely one source for routing + SEO + content. Metadata/content are status-gated like the rest.
- **D-15 — Content field shapes: structured where downstream needs it, prose as text.** `faqs: { question, answer }[]` and `steps: { title, body }[]` are **structured arrays** — feed FAQPage JSON-LD (Phase 3) + `ServiceFAQ`/`ServiceSteps` components (Phase 2, IA-05) with zero re-parsing. `intro` + `localAngle` are prose text (Markdown string or paragraph array — planner picks the renderer in Phase 2).

### Claude's Discretion
- **D-03 trailing-slash:** user chose "you decide" → locked no-trailing-slash / lowercase / leading-slash as the documented URL convention for all downstream phases.
- **Pricing boundary:** pricing data (`WTW_UNITS`, `MV_ONDERHOUD`, etc. in `components/PricingTabs.tsx`) is **NOT** absorbed into the taxonomy this phase; it stays in PricingTabs (CONT-05 handles pricing transparency in Phase 4). User accepted this by choosing "Ready for context."
- **Compound sub-service slugs** (`reparatie-storing`, `onderhoud-reinigen`) derive deterministically from D-02 — planner finalizes.
- **SITE field layout** (nested `geo {}`/`address {}` objects vs flat fields) — planner's call within D-12.
- **Prose renderer** (Markdown lib vs paragraph array) for `intro`/`localAngle` — planner's call within D-15.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase plan & requirements
- `.planning/ROADMAP.md` §"Phase 1: Taxonomy & Data Model" — goal, the 5 success criteria, requirement set (IA-01, IA-08, IA-09, SEO-08, QA-03). Also §Phase 2/3/4 for the downstream consumers of this taxonomy.
- `.planning/REQUIREMENTS.md` §"Information Architecture & Service Pages" (IA-01, IA-08, IA-09), §"SEO" (SEO-08; plus SEO-01/03/04/06/07 = Phase 3 consumers), §"QA" (QA-03; QA-05 ties to geo). §"v2 Requirements" lists explicitly-deferred items (CONT-V2-01 brand pages, BLOG-02 location pages, DOM-V2-01).
- `.planning/PROJECT.md` §"Key Decisions" + §"Constraints" — locked positioning (klimaattechniek, 4 pillars, brands, regio-not-city-pages); static-vs-hybrid deferred to Phase 5.
- `.planning/STATE.md` §"Blockers/Concerns" — owner-input dependencies (radius now confirmed = 60; certifications/dealer status pending for Phase 4; domain question for Phase 3).

### Codebase files this phase reads or modifies
- `lib/constants.ts` — current `SITE`, `NAV_LINKS`, `DIENSTEN_DROPDOWN`, `TARIEVEN_DROPDOWN`. Phase 1 **extends `SITE`** (D-09–D-12); nav becomes taxonomy-derived in Phase 2.
- `app/tarieven/page.tsx` (line 62) — hardcoded "straal van 50km" → replace with SITE radius (QA-03).
- `components/PricingTabs.tsx` (lines 442, 519) — hardcoded "straal van 100 km" → replace with SITE radius (QA-03). Also holds pricing data that stays OUT of taxonomy scope.
- `app/diensten/page.tsx` — current single diensten page (#wtw/#mechanisch/#airco anchors); becomes the hub in Phase 2; its scattered service data is what the taxonomy consolidates.
- `.planning/codebase/CONVENTIONS.md` — typing conventions: `interface` for shapes, `type`/string-unions for discriminated unions, SCREAMING_SNAKE_CASE for exported data, named exports, no-barrel rule (registry.ts = documented exception).
- `.planning/codebase/STRUCTURE.md` §"Where to Add New Code" — `lib/` placement rules.
- `.planning/codebase/ARCHITECTURE.md` §"Data Flow" / §"Architectural Constraints" — static export, server-component default, taxonomy is build-time TS data consumed by `generateStaticParams`.
- `.planning/codebase/CONCERNS.md` — radius inconsistency, placeholder Maps pin (context for D-12 geo-pending), client-exposed webhook (Phase 5).

*No external ADRs/specs — requirements are fully captured in `.planning/` docs + the decisions above.*

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`lib/constants.ts` `SITE` pattern** — the established single-source-of-truth model to **extend**, not parallel. Add NAP/geo/radius/serviceAreas here.
- **`DropdownItem` interface + `DIENSTEN_DROPDOWN`/`TARIEVEN_DROPDOWN`** — current hardcoded nav data. Phase 2 derives nav from the taxonomy (IA-07), so model nav-relevant fields (`icon`, short `title`, `description`) on pillar/service nodes now.
- **`components/PricingTabs.tsx` data arrays** (`WTW_UNITS`, `MV_ONDERHOUD`, `DIRTY_COLORS`) — existing service/pricing data; a reference for sub-service naming, **not** absorbed into the taxonomy.
- **`app/diensten/page.tsx` + `components/DienstenNav.tsx`** — current service presentation + scroll-spy nav; becomes taxonomy-driven hub/nav in Phase 2.

### Established Patterns
- TypeScript strict; `interface` for object shapes, string-union `type` for the page-type discriminant; SCREAMING_SNAKE_CASE for exported data constants; named exports only; `@/*` path alias.
- No state library, no server runtime (static export) — the taxonomy is **build-time TS data** consumed by `generateStaticParams` (Phase 2) with `dynamicParams = false`.
- `zod` is **not yet a dependency** — Phase 1 introduces it (D-07); Phase 5 (QA-02) reuses it.

### Integration Points
- `lib/services/registry.ts` `urlFor()` + `PAGES` → consumed by Phase 2 routes/nav, Phase 3 sitemap/JSON-LD/canonical.
- `lib/constants.ts` `SITE` → consumed by JSON-LD (Phase 3), Maps pin (Phase 5), all visible NAP copy.
- Per-page `status` field → consumed by Phase 3 sitemap filter + Phase 4 editorial gate.

</code_context>

<specifics>
## Specific Ideas

- Radius copy must read **"tot 60 km vanuit Zoetermeer"** (owner's exact words — "up to", a max boundary, not a fixed circle).
- `wtw` slug stays lowercase as-is (dominant search term + recognized abbreviation) — do not expand to `warmteterugwinning`.
- **Daikin appears under both Airco and Warmtepompen** — the concrete reason brands are normalized (D-06).
- Page-type counts to model: **1 hub + 4 pillars + 17 sub-services + ~5 static = ~27 registered pages** (~22 service-surface + statics).

</specifics>

<deferred>
## Deferred Ideas

- **Pricing as taxonomy data** — considered this phase; left in `components/PricingTabs.tsx`. Revisit alongside CONT-05 (Phase 4) or a future "pricing-as-data" need.
- **Reviews consolidation data model** (CONT-08) — Phase 4.
- **Per-brand dedicated pages** (e.g. `/diensten/airconditioning/installatie/daikin`) — explicitly v2 (CONT-V2-01).
- **Per-location / neighbourhood pages** — v2 (BLOG-02). Phase 1 deliberately uses regio *signals* + `serviceAreas`, NOT city pages (anti-pattern per Dec-2025 Core Update).
- **Full rebrand + domain migration** to `tpsklimaattechniek.nl` — v2 (DOM-V2-01); launch stays on `tpsventilatie.nl`.

*No reviewed-but-deferred todos — todo backlog was empty.*

</deferred>

---

*Phase: 1-Taxonomy & Data Model*
*Context gathered: 2026-06-02*
