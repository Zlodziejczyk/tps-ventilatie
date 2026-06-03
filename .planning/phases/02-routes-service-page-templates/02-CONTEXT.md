# Phase 2: Routes & Service-Page Templates - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 turns the Phase-1 taxonomy into **visible, navigable pages** — the rendering layer. The deliverable is **routes + reusable server components + taxonomy-derived navigation**, NOT final copy (Phase 4) and NOT SEO infrastructure (Phase 3).

**In scope:**
- The `/diensten` hub, 4 pillar pages, and ~17 sub-service pages, all generated from ONE data-driven template via `generateStaticParams` with `dynamicParams = false` (every route pre-rendered; production build green).
- The 6 reusable server components named in IA-05: **ServiceHero, ServiceSteps, ServiceFAQ, BrandGrid, RelatedServices, Breadcrumbs**.
- BrandGrid rendering the locked brand sets on Installatie pages (resolving `brandIds` → `lib/services/brands.ts`).
- Navbar "Diensten" dropdown + mobile menu rebuilt as **taxonomy-derived** (IA-07) — no hardcoded nav entries.
- Porting the existing `/diensten` copy/visuals into the matching draft shells (see D-04).

**Out of scope (other phases):**
- Writing/expanding real Dutch copy and the editorial sign-off → **Phase 4** (Phase 2 ports existing copy as `draft` seed and renders empty shells gracefully).
- `sitemap.xml` / `robots.txt` / JSON-LD / canonical / OG / `metadataBase` → **Phase 3** (Phase 2 wires only basic `title`/`description`; see D-13).
- Pricing data + transparency → stays in `components/PricingTabs.tsx` (Phase-1 boundary); CONT-05 in **Phase 4**. Service pages link to `/tarieven?tab={pillar}`.
- Form security, instant notification, WhatsApp affordance, motion/CWV gating → **Phase 5**.
- **Home-page premium/conversion uplift** → its OWN future phase (see Deferred Ideas). Phase 2 only keeps service heroes consistent with it.

</domain>

<decisions>
## Implementation Decisions

> Phase-2 decisions are `D-0x`. Phase-1 locks carried forward are cited as `P1 D-0x` (see `01-CONTEXT.md`) and are NOT re-opened: nested URLs `/diensten/{pillar}/{sub}`, full Dutch slugs, `urlFor()` as the sole href builder, the unified `PAGES` registry, the brand→pillar mapping, and status-gated empty shells.

### Template Anatomy *(Claude's discretion — user chose "you decide")*
- **D-01 — Sub-service page = convert-forward stack.** `Breadcrumbs → ServiceHero (h1 · intro · icon · "Offerte aanvragen" CTA) → ServiceSteps → BrandGrid (Installatie pages only / when brandIds present) → ServiceFAQ (with the regio line from localAngle rendered just above it) → RelatedServices (same-pillar siblings) → CTABanner`. Mirrors the proven flow of today's page (hero → how-it-works → proof → objections → keep-on-site → close).
- **D-02 — Page-level differentiation: pillars rich, hub lean.**
  - **Hub `/diensten` (lean):** `Hero → 4 pillar cards → trust/reviews strip → CTABanner`. Replaces the current anchored page; acts as a clean router.
  - **Pillar page (rich):** `Hero → sub-service card grid → BrandGrid (if the pillar carries brands) → pillar-level FAQ → RelatedServices (other pillars) → CTABanner`. A real landing page built to rank for the head term (e.g. "warmtepompen Zoetermeer").
  - **Sub-service page:** the full D-01 stack.
- **D-03 — Components.** All 6 IA-05 blocks are **server components**. BrandGrid renders conditionally on `brandIds`. Reuse the existing `components/CTABanner.tsx`. Breadcrumbs derive from `canonicalPath` segments + each node's `navTitle`, and expose their trail data in a shape Phase 3 can reuse for BreadcrumbList JSON-LD (D-13).

### Existing-Content Salvage *(user decision)*
- **D-04 — Port copy + salvage visuals.** Move the existing `/diensten` WTW / MV / Airco copy into the matching taxonomy shells, keeping `status: "draft"` so the ≥120-word / uniqueness gate never fires and the Phase-3 sitemap skips them. Lift the visual treatments (service cards, before/after photo pattern, enrichment blocks, step list) into the reusable components. Phase 4 reviews/expands and fills gaps — **Warmtepompen is net-new and ships empty**.
- **D-05 — Porting watch-items (for the planner / Phase 4):**
  - Align ported Airco brand mentions to the taxonomy set — **drop "Panasonic"** (taxonomy = Daikin / Mitsubishi Electric / Mitsubishi Heavy).
  - The existing **"dakventilator"** block has no taxonomy sub-service — fold its content into MV `onderhoud-reinigen` / `vervangen`. **Not a new route** (no scope creep).
  - **Pricing stays in `components/PricingTabs.tsx`** — service pages link to `/tarieven?tab={pillar}` instead of embedding prices.

### Empty-Shell Rendering *(user decision)*
- **D-06 — Graceful omit, content-conditional sections.** Every page ALWAYS renders `Hero + Breadcrumbs + RelatedServices + CTABanner` so it is never broken-looking. `ServiceSteps` / `ServiceFAQ` / the localAngle line are **omitted when their data is empty**. `BrandGrid` renders whenever `brandIds` exist (even before brand copy lands). `navDescription` is the **hero-intro fallback** when `content.intro === ""`. No "binnenkort" placeholders. Honors success criterion 2 (all ~22 routes still render/pre-render).

### Navigation *(user decisions)*
- **D-07 — Mega-menu (desktop).** The Navbar "Diensten" dropdown becomes a **taxonomy-derived mega-menu**: 4 pillar columns, each listing its sub-services; the pillar header links to the pillar page, sub links to subs. Reads from `registry` `PAGES` — no hardcoded `DIENSTEN_DROPDOWN` (IA-07). Gives every service a sitewide internal link (a Phase-3 indexing/link-equity asset).
- **D-08 — Mobile = 2-level accordion.** In `MobileMenu`, the mega-menu collapses to a 2-level accordion: Diensten → pillars (tappable label opens the pillar page; a separate chevron expands) → subs. Every service reachable from the drawer.
- **D-09 — Retire `DienstenNav`.** The single-page scroll-spy (3 hardcoded `#anchors`) is obsolete once content is per-route. Remove the component and its usage; no dead anchors. Wayfinding is fully covered by the mega-menu + Breadcrumbs + pillar card grids + RelatedServices.

### Motion & Performance *(user decisions)*
- **D-10 — Service heroes: lean static + CWV-safe.** Service-page heroes use a clean tonal-background + icon and reuse **only** the cheap `AnimateOnScroll` / `StaggerChildren` fade-ins. **No WebGL `SoftAurora` and no canvas particles** (`AmbientParticles` / `FocalParticles` / `useParticleEngine`) on the ~22 service pages — those stay home-only. Rationale: 22-page surface × mobile CWV (SEO-10 launch criterion), pre-empts QA-06 (Phase 5) motion-gating rework, and respects the CONCERNS.md perf flags. Service heroes are the **"lite" tier** of a shared motion language whose premium tier will be set by the future Homepage uplift phase.

### RelatedServices / Cross-sell *(user decision)*
- **D-11 — Same-pillar siblings.** RelatedServices shows the other sub-services in the same pillar (deterministic from the taxonomy; clean topical siloing). Cross-pillar cross-sell (airco→warmtepomp / energiebesparing) is deferred to Phase 4 as an optional editorial `relatedOverride` once real copy exists.

### Hub Trust / Reviews *(user decision)*
- **D-12 — Reuse existing reviews now.** The hub trust/reviews strip reuses the existing `ReviewCarousel` + `REVIEWS` data so the hub looks finished at Phase 2 close. Phase 4 (CONT-08) swaps in the single consolidated source + Google score/count/link. No stub.

### Phase Seams *(Claude's discretion)*
- **D-13 — Phase 2/3 metadata seam.** Phase 2 wires **basic** per-page metadata via `generateMetadata` reading `content.metaTitle` / `content.metaDescription` so no page ships metadata-less. Canonical, `metadataBase`, Open Graph / Twitter, and all JSON-LD (Service / BreadcrumbList / FAQPage) stay in **Phase 3** (SEO-03/04/05).
- **D-14 — Route structure (planner's call within Next.js idiom).** Nested dynamic segments (`app/diensten/[pillar]/page.tsx` + `app/diensten/[pillar]/[service]/page.tsx`, or equivalent), each with `generateStaticParams` enumerated from `registry` `PAGES` and `dynamicParams = false`. Hub at `app/diensten/page.tsx` replaces the current anchored page. The taxonomy likely needs small new pure lookups (`childrenOf`, `siblingsOf`, `pillars`) added to `registry.ts` (kept under the no-barrel exception).

### Claude's Discretion
- Sub-service section order (D-01) and hub/pillar richness split (D-02) — user said "you decide."
- Route-segment file layout + `generateStaticParams` enumeration (D-14); new registry lookups.
- Exact hero composition and where the localAngle/regio line sits (above FAQ per D-01).
- RelatedServices default = same-pillar siblings (D-11).
- Phase 2/3 metadata boundary (D-13); animation limited to reused Framer helpers (D-10) — no new motion system this phase.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase plan & requirements
- `.planning/ROADMAP.md` §"Phase 2: Routes & Service-Page Templates" — goal, the 5 success criteria, requirement set (IA-02…IA-07). Also §Phase 3/4/5 for the downstream consumers of these routes/nav.
- `.planning/REQUIREMENTS.md` §"Information Architecture & Service Pages" (IA-02…IA-07; IA-01/08/09 = Phase-1 foundation), §"SEO" (SEO-01…07 = Phase-3 consumers of nav/breadcrumbs/metadata seam; SEO-10 = mobile-CWV launch criterion behind D-10), §"v2 Requirements" (CONT-V2-04 cross-sell, CONT-V2-01 brand pages, BLOG-02 location pages — explicitly deferred).
- `.planning/PROJECT.md` §"Key Decisions" + §"Constraints" — positioning, design-system rules, static-export (no server runtime this phase), content model (Claude drafts / owner reviews → editorial gate is Phase 4).
- `.planning/phases/01-taxonomy-data-model/01-CONTEXT.md` — **ALL Phase-1 decisions (P1 D-01…D-15):** URL/slug structure, `urlFor()`, registry, brand mapping, status gating, content-shell shape. This is the data contract Phase 2 renders.

### Phase-1 taxonomy — the data this phase renders (`lib/services/`)
- `lib/services/types.ts` — `PageNode` discriminated union (`hub|pillar|service|static`), `ContentShell` (`h1, intro, steps[], faqs[], localAngle, metaTitle, metaDescription, ogImage`), `PageBase` (`navTitle, navDescription, icon, primaryKeyword, status`), and `canonicalPath()`. **The render contract.**
- `lib/services/registry.ts` — `PAGES` (the single page array), `urlFor()`, `findByType()`, `findBySlug()`, `validateTaxonomy()`. Nav, routes, RelatedServices, and breadcrumbs all read from here. NOTE: no sibling/children helpers yet — Phase 2 adds small pure lookups (D-14).
- `lib/services/brands.ts` — normalized brand registry (`id`, name, logo, blurb, dealer-status flag). BrandGrid resolves `brandIds` → brand data.
- `lib/services/{airconditioning,warmtepompen,wtw,mechanische-ventilatie}.ts` — per-pillar + sub-service nodes (draft shells; **warmtepompen is empty/net-new**).

### Codebase files this phase creates/modifies
- `app/diensten/page.tsx` — current anchored single page; **becomes the lean hub**; its rich content is ported into draft shells (D-04).
- `components/DienstenNav.tsx` — **retire** (D-09).
- `components/Navbar.tsx` + `components/MobileMenu.tsx` — rebuild the Diensten dropdown as a taxonomy-derived mega-menu (D-07) + mobile accordion (D-08).
- `lib/constants.ts` — `DIENSTEN_DROPDOWN` becomes taxonomy-derived (remove the hardcoded list; `TARIEVEN_DROPDOWN` and `SITE` stay).
- **New:** the data-driven service template, the dynamic route files (D-14), and the 6 IA-05 server components (ServiceHero, ServiceSteps, ServiceFAQ, BrandGrid, RelatedServices, Breadcrumbs).
- **Reuse:** `components/CTABanner.tsx`, `ServiceCard.tsx` (pillar/sub cards), `AnimateOnScroll.tsx`, `StaggerChildren.tsx`, `Icon.tsx`, `ReviewCarousel.tsx` (hub trust strip).

### Codebase maps (patterns)
- `.planning/codebase/ARCHITECTURE.md` §"Data Flow" / §"Architectural Constraints" — static export, server-component default, `generateStaticParams` build-time data, `<Suspense>` for `useSearchParams`.
- `.planning/codebase/STRUCTURE.md` §"Where to Add New Code" — `app/` route + `components/` placement.
- `.planning/codebase/CONVENTIONS.md` — named exports, no-barrel (registry = documented exception), `interface` vs `type`, Icon wrapper, `SITE` for business data, design-system rules (no 1px borders, no `#000` text, MD3 tokens).
- `.planning/codebase/CONCERNS.md` — WebGL/particle mobile-CWV perf (motivates D-10 lean heroes).

*No external ADRs/specs — requirements fully captured in `.planning/` docs + the decisions above.*

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`components/CTABanner.tsx`** (sourced from `SITE`) — closing CTA on every service page + the hub.
- **`components/ServiceCard.tsx`** — existing single service card; basis for the pillar/sub card grids on the hub and pillar pages.
- **`AnimateOnScroll` / `StaggerChildren`+`StaggerItem`** — the cheap, CWV-safe Framer motion the template reuses (D-10).
- **`components/ReviewCarousel.tsx` + `REVIEWS` data** — the hub trust strip (D-12).
- **`components/Icon.tsx`** — each `PageNode.icon` renders through it.
- **Existing `app/diensten/page.tsx` content + visual treatments** — WTW 10-step replacement plan, MV before/after photos + cleaning method, airco service cards — ported per D-04.
- **`lib/services` registry** (`PAGES`, `urlFor`, `findByType`, `findBySlug`) — the data source for routes, nav, RelatedServices, breadcrumbs.

### Established Patterns
- **Server Components by default**; `"use client"` only where hooks/browser APIs are needed (Navbar dropdown interactivity, MobileMenu drawer). The template + all 6 IA-05 components are server components.
- **`generateStaticParams` + `dynamicParams = false`** enumerated from `PAGES` — no runtime; unknown slugs 404 automatically.
- **`urlFor()` is the ONLY href builder** (P1 D-03) — nav, breadcrumbs, related links all go through it.
- **Design system:** MD3 tokens, no 1px section borders (tonal layering), no `#000` text (`on-surface`), Material Symbols via `Icon`.
- All site-facing copy in **Dutch (`nl`)**.

### Integration Points
- `registry` `PAGES` → mega-menu (Navbar/MobileMenu), dynamic routes (`generateStaticParams`), RelatedServices, Breadcrumbs.
- New tiny pure lookups likely added to `registry.ts`: `childrenOf(pillarSlug)`, `siblingsOf(serviceSlug)`, `pillars()` — kept in registry per the no-barrel exception.
- Breadcrumb trail data shape → consumed by Phase 3 `BreadcrumbList` JSON-LD (D-13).
- `content.metaTitle` / `content.metaDescription` → Phase 2 `generateMetadata` (basic); Phase 3 adds canonical/OG/JSON-LD.
- `status: "draft"` → Phase 3 sitemap filter + Phase 4 editorial gate (flip to `published`).

</code_context>

<specifics>
## Specific Ideas

- The "convert-forward" service-page flow deliberately mirrors the existing page's proven structure (hero → how-it-works steps → proof → objections/FAQ → keep-on-site → close).
- The mega-menu is chosen partly for its **Phase-3 internal-linking benefit** — every service gets a sitewide link.
- Service heroes are explicitly the **"lite" tier of a shared motion language**; the premium tier is the future Homepage uplift phase — keep them visually compatible.
- The owner (Tomasz) values the existing WTW/MV content — porting it (D-04) preserves that work rather than discarding it.

</specifics>

<deferred>
## Deferred Ideas

- **Homepage conversion uplift (owner-requested — NEW, route to its own phase).** Oskar wants the home page made *more premium / professional / "alive," with stronger attention-capture and conversion*. This is OUT of Phase 2 scope (Phase 2 = service-page templates; the home page is an existing `static` node that already carries the aurora/particle hero). Plan: run `/gsd-sketch` to explore the premium/alive/attention direction as throwaway mockups, then `/gsd-phase` to slot a dedicated **"Homepage conversion uplift"** phase. Phase 2 service heroes are kept lean & CWV-safe (D-10) precisely so they inherit the home page's eventual design DNA in a lighter form. Does not block Phases 2–5.
- **Cross-pillar cross-sell in RelatedServices** (airco→warmtepomp / energiebesparing) — Phase 4 editorial override; CONT-V2-04 is the v2 deepening.
- **Per-brand dedicated pages** (`/diensten/airconditioning/installatie/daikin`) — v2 (CONT-V2-01).
- **Per-location / neighbourhood pages** — v2 (BLOG-02); Phase 2 uses regio *signals* via `localAngle`, not city pages (Dec-2025 thin-content anti-pattern).
- **Reviews consolidation data model** (single source + Google score/count/link) — Phase 4 (CONT-08); Phase 2 reuses the existing `ReviewCarousel`.
- **Mobile / `prefers-reduced-motion` gating of WebGL + particles** — Phase 5 (QA-06); Phase 2 sidesteps it by keeping heavy motion off service pages.

*No reviewed-but-deferred todos — todo backlog was empty.*

</deferred>

---

*Phase: 2-Routes & Service-Page Templates*
*Context gathered: 2026-06-03*
