# Phase 3: SEO Infrastructure - Context

**Gathered:** 2026-06-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 makes every one of the ~22 routes **indexable and richly described — BEFORE final copy lands (Phase 4)**. The deliverable is **SEO instrumentation**: a programmatic sitemap + robots from the taxonomy, server-rendered JSON-LD, correct canonical / `metadataBase` / OG, Google Business Profile alignment, and live measurement. It is NOT content (Phase 4) and NOT the form/launch hardening (Phase 5).

**In scope:**
- `app/sitemap.ts` (`force-static`, taxonomy-sourced) + `app/robots.ts` — list every canonical page, no drift from the route set (SEO-01, SEO-02).
- Server-rendered JSON-LD: site-wide `HVACBusiness` + per-page `Service`, `BreadcrumbList`, `FAQPage` — validating in Google's Rich Results Test, zero client JS (SEO-03).
- `metadataBase` + absolute self-canonical (consistent no-trailing-slash) + Open Graph / Twitter on every page, via ONE shared metadata builder extending the Phase-2 seam (SEO-04, SEO-05).
- Zoetermeer + regio signals at the **metadata / NAP / JSON-LD** level (SEO-06 — page-body regio copy is Phase 4).
- Google Business Profile alignment as an **owner runbook** + on-site NAP/JSON-LD match (SEO-07).
- Analytics (Vercel Analytics + Speed Insights) + Google Search Console verification (in-repo) + an owner runbook for sitemap submission (SEO-09).

**Out of scope (other phases):**
- Writing real Dutch copy + the editorial sign-off → **Phase 4**. Phase 3 instruments empty/draft pages; the indexing gate flips ON automatically as Phase 4 publishes them.
- `aggregateRating` / review JSON-LD → **Phase 4** (CONT-08 consolidates reviews to one sourced, on-page set first).
- The static-export-vs-hybrid decision, secure form route, visible Maps-pin fix (QA-05), build-time image optimization (QA-07), mobile CWV pass (SEO-10) → **Phase 5**. Phase 3 stays fully within `output: "export"`.
- Page-body regio copy, ISDE/subsidie content, pricing transparency → **Phase 4**.
- Domain migration to tpsklimaattechniek.nl → **v2** (DOM-V2-01).

</domain>

<decisions>
## Implementation Decisions

> Phase-3 decisions are `D-0x`. Carried-forward locks are cited as `P1 D-0x` / `P2 D-0x` (see `01-CONTEXT.md` / `02-CONTEXT.md`) and are NOT re-opened: `urlFor()` as sole href builder + `trailingSlash:false` (P1 D-03), per-page `status` gating (P1 D-08), full structured NAP/geo/radius/serviceAreas in `SITE` (P1 D-09/D-11/D-12), brand name "TPS klimaattechniek" (P1 D-10), structured `faqs[]`/`steps[]` (P1 D-15), the Phase-2/3 metadata seam + `trailFor()` BreadcrumbList shape (P2 D-13).

### Canonical Domain & metadataBase
- **D-01 — Canonical host = `https://tpsventilatie.nl` (apex, non-www), locked for launch.** *(user chose "you decide" → locked per P1 D-10.)* `metadataBase` and every absolute canonical, OG `url`, sitemap `<loc>`, robots `Sitemap:` line, and JSON-LD `url`/`@id` use this exact origin. Brand **name** stays "TPS klimaattechniek" everywhere (visible copy, JSON-LD `name`, metadata title per D-05) — only the URL host stays legacy; name ≠ domain is deliberate so SEO signals consolidate on the live, already-cited domain. **Researcher MUST confirm** the live Vercel/DNS primary (www vs apex) and that a `www → apex` 301 is in place, so the emitted canonical equals the served origin (no canonical-vs-redirect mismatch); if the live primary is actually www, flip the redirect OR set `metadataBase` to www — pick ONE and make canonical == served origin. Migration to tpsklimaattechniek.nl (register/verify + 301 plan + GBP rename + citation/NAP updates) → v2 (DOM-V2-01).

### Sitemap, robots & Indexing Policy
- **D-02 — Publish-gated sitemap + indexing via ONE `lib/seo` policy helper.** *(user "you decide" → locked content-aware publish-gating.)* A single helper (e.g. `lib/seo/policy.ts`, `isIndexable(node)` / `sitemapEntries()`) is the ONLY place index + sitemap membership is decided — mirroring `urlFor()`'s single-source pattern. Both `app/sitemap.ts` and the per-page `robots` directive (D-05) read it. **Rule:** service + pillar pages are indexable **iff `status === "published"`** → draft service/pillar pages get `robots: { index:false, follow:true }` AND are excluded from the sitemap; when Phase 4 flips a node to `published` it auto-enters the sitemap and becomes indexable (single lever = the editorial gate CONT-10, no parallel list, no Phase-3 rework). The 4 **static content pages** (home, tarieven, over-ons, contact) render real existing content independent of the empty taxonomy shells → **indexable now** (not blocked on shell status). **privacy-beleid** → `noindex, follow` (legal page, no search value), excluded from sitemap. Net at Phase-3 close: sitemap = the 4 static pages; the 21 service-surface pages join as Phase 4 publishes them. `force-static` so it builds under `output: "export"`.
- **D-03 — robots.txt: open, AI-crawler-friendly, absolute sitemap pointer.** *(user "you decide" → allow all.)* `app/robots.ts` (`force-static`): `Allow: /` for all user-agents, **no path disallows** — noindex pages (drafts, privacy-beleid) must stay **crawlable** so the noindex is actually seen, so they are NOT robots-disallowed (the per-page `robots` meta from D-02 handles them). Explicitly **allow AI crawlers** (GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot, Google-Extended, CCBot) for GEO / AI-Overview / ChatGPT / Perplexity citation visibility — a real local-discovery channel serving the "local search demand → contacted leads" core value. `Sitemap:` → absolute `https://tpsventilatie.nl/sitemap.xml`. The opt-out block list is documented in the owner runbook (D-07).

### Structured Data / JSON-LD
- **D-04 — `HVACBusiness` site-wide + per-page `Service`/`BreadcrumbList`/`FAQPage`, server-rendered, NO ratings yet.** *(business type: user "you decide" → HVACBusiness. aggregateRating: explicit user decision → defer to Phase 4.)*
  - **Site-wide:** ONE `HVACBusiness` node (a LocalBusiness subtype — stronger HVAC signal) rendered server-side, populated entirely from `SITE`: `name` "TPS klimaattechniek", `address` (PostalAddress), `geo` (GeoCoordinates), `telephone`, `email`, `url` (canonical host), `areaServed` = `GeoCircle` (center `geo`, `geoRadius` 60000 m per P1 D-09) and/or the named `serviceAreas` as `Place` list, `priceRange`, `image`/`logo`, `sameAs` (GBP + socials when available). Stable `@id` (e.g. `${origin}/#business`) so per-page `Service` nodes reference it as `provider`. If research finds a rich-result coverage gap, emit `@type: ["HVACBusiness","LocalBusiness"]`.
  - **NO `aggregateRating` / `review` in Phase 3** — the slot is reserved for Phase 4 (CONT-08): ratings must reflect consolidated, sourced, on-page reviews (Google guideline + manual-action safety). Wire the slot, leave it empty.
  - **Per-page:** `Service` on pillar + sub-service pages (`provider` → business `@id`, `areaServed`, `serviceType`/`name` from `navTitle`/`primaryKeyword`); `BreadcrumbList` from `trailFor(node)` (already shaped for this, P2 D-13); `FAQPage` from `content.faqs[]` (render only when faqs present → lands as Phase 4 fills FAQs, on published pages).
  - All emitted via a reusable server-side `JsonLd` component (`<script type="application/ld+json">`, zero client JS). MUST validate in Google Rich Results Test (success criterion 3). Exact per-page `Service` property depth = researcher/planner discretion within Rich-Results validity.

### Page Metadata: canonical, OG/Twitter, brand
- **D-05 — Shared metadata builder: `metadataBase` + self-canonical + OG/Twitter + brand cleanup + one OG image.** *(OG image + brand cleanup: user "you decide".)* Centralize in `lib/seo/metadata.ts`, used by BOTH static-page `metadata` exports AND the dynamic routes' `generateMetadata` (extending the P2 D-13 seam, which today returns only title/description) — one implementation so canonical/OG/robots never drift.
  - `metadataBase` set once on the root layout = the D-01 origin. Every page emits `alternates.canonical` = absolute `urlFor(node)` (no trailing slash, P1 D-03).
  - `openGraph` (`url` = canonical, `title`, `description`, `siteName` "TPS klimaattechniek", `locale` "nl_NL", `images` → the branded OG image) + `twitter` (`card: summary_large_image`, same image).
  - **Brand cleanup:** root `title.default` → "TPS klimaattechniek — Airco, warmtepompen & ventilatie in Zoetermeer", `title.template` → "%s | TPS klimaattechniek", description rebranded to klimaattechniek, brand sourced from `SITE.name` where practical. **DROP** the legacy `keywords` meta (deprecated; the keyword map already lives in the taxonomy). *(Fixes the stale "TPS Ventilatie" still hardcoded in `app/layout.tsx`.)*
  - **OG image:** ONE branded static 1200×630 image — static export rules out dynamic `opengraph-image` (`ImageResponse` needs a runtime). Place under `public/` (or `app/opengraph-image.<ext>` as a static asset); seed from existing brand assets / `public/images/hero-ventilatie.jpg`. Per-pillar images = later enhancement.
  - Per-page `robots` directive comes from the D-02 policy helper. Regio signals (SEO-06) ensured in the site-wide description + OG (registry `metaTitle`s already carry regio); page-body regio copy = Phase 4.

### Analytics & Search Console
- **D-06 — Vercel Analytics + Speed Insights; in-repo GSC meta-tag verification; GA4 deferred.** *(user "you decide" on both.)* Add `@vercel/analytics` + `@vercel/speed-insights` in the root layout — cookieless / privacy-friendly → no cookie-consent banner, minimal AVG scope (aligns LEAD-06); Speed Insights provides the field CWV/INP signal feeding SEO-10 (Phase 5). Works with static export (client components); enabling them on the project is an owner Vercel-dashboard step (runbook). **GSC verification** = `google-site-verification` meta via an env var / `SITE` field (in-repo, verifiable on deploy); DNS-TXT documented as the optional owner upgrade to a domain-level property. **GA4 = deferred, consent-gated slot** (not shipped) — adding it later pulls in an AVG cookie-consent mechanism + a privacy-policy processor mention.

### Google Business Profile & Owner-Ops Runbook
- **D-07 — Phase 3 ships the code; credential-bound ops land as an OWNER RUNBOOK.** A written runbook (in the phase dir or `docs/`) lists the tasks needing owner/external access: **GBP (SEO-07)** — set name to "TPS klimaattechniek"; **primary category `Airconditioningsbedrijf`** *(user "you decide" → recommended, flagged for owner confirmation)*, secondaries `Verwarmingsinstallateur` (warmtepompen) / `Ventilatiebedrijf` / `HVAC-aannemer`; service-area list from `SITE.serviceAreas`; verify the maps pin / business location. **GSC** — confirm verification, submit `https://tpsventilatie.nl/sitemap.xml`; optional DNS-TXT domain property. **Vercel** — enable Analytics + Speed Insights. **Optional** AI-crawler opt-out block list. **Owner-input dependency (carry P1 D-12):** `SITE.geo.lat/lng` is owner-verify-pending and today's Maps embed uses a placeholder (CONCERNS.md) — JSON-LD `geo` + GBP pin both want the **verified** coordinates; Phase 3 should obtain/confirm the real lat/lng so JSON-LD ships correct (the visible Maps-embed fix itself is QA-05/Phase 5, but the coordinate value is shared).

### Claude's Discretion
- www-vs-apex final form (apex locked, pending live-config confirmation) — D-01.
- Business `@type` exact form (HVACBusiness, with `["HVACBusiness","LocalBusiness"]` fallback if research shows a gap) and per-page `Service` property depth — D-04.
- Module layout for `lib/seo/*` (policy helper, metadata builder, `JsonLd` component) within project conventions (small pure functions; the registry/seo no-barrel exception) — D-02/D-04/D-05.
- OG image composition, exact filename + placement (`public/` vs `app/opengraph-image`) — D-05.
- Whether the site-wide `HVACBusiness` node renders in the root layout vs a shared server component — D-04.
- Exact robots AI-bot allow-list entries and ordering — D-03.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase plan & requirements
- `.planning/ROADMAP.md` §"Phase 3: SEO Infrastructure" — goal, the 5 success criteria, requirement set (SEO-01…07, SEO-09). Also §"Phase 4" (status flips + CONT-08 reviews) and §"Phase 5" (QA-05 maps pin, QA-07 image opt, SEO-10 CWV) as the downstream consumers of this instrumentation.
- `.planning/REQUIREMENTS.md` §"SEO — Technical, Local, Measurement" (SEO-01…07, SEO-09; SEO-08 = Phase-1 done; SEO-10 = Phase 5), §"Lead Capture & Communication" (LEAD-06 AVG consent — informs the cookieless analytics choice), §"QA & Hardening" (QA-05 maps pin shares the geo coordinate).
- `.planning/PROJECT.md` §"Key Decisions" (klimaattechniek brand, regio-not-city-pages, stay on tpsventilatie.nl for launch, static-vs-hybrid is Phase 5) + §"Constraints" (static export, "Atmospheric Clarity" design system, nl-only).
- `.planning/STATE.md` §"Blockers/Concerns" — the rebrand/domain question (resolved here, D-01), geo-verify-pending, the GHL workflow (Phase 5).
- `.planning/phases/01-taxonomy-data-model/01-CONTEXT.md` — **P1 locks this phase consumes:** D-03 (`urlFor`/`trailingSlash`/canonical policy), D-08 (per-page `status` gating → the sitemap/index lever), D-09/D-11/D-12 (NAP / geoRadius 60000 / `serviceAreas` → JSON-LD + metadata), D-10 (brand name vs domain), D-13/D-14/D-15 (keyword fields + content shell + **structured `faqs[]`/`steps[]`** for FAQPage).
- `.planning/phases/02-routes-service-page-templates/02-CONTEXT.md` — **P2 seams:** D-13 (Phase-2/3 metadata seam — basic title/desc wired; Phase 3 adds canonical/`metadataBase`/OG/JSON-LD), D-03 breadcrumbs (`trailFor()` → BreadcrumbList), D-10 (lean CWV-safe service heroes), `status:"draft"` → Phase-3 sitemap filter.

### Taxonomy + business data this phase reads (`lib/`)
- `lib/services/registry.ts` — `PAGES` (27 nodes), `urlFor()` (sole href builder → canonical + sitemap), `trailFor()` (BreadcrumbList source), `findByType`/`pillars`/`childrenOf`, per-node `status`, `content.metaTitle`/`metaDescription`, `primaryKeyword`.
- `lib/services/types.ts` — `PageNode` discriminated union, `ContentShell` (incl. `faqs[]`, `steps[]`, `metaTitle`, `metaDescription`, optional `ogImage`), `canonicalPath()`, the `status` field.
- `lib/constants.ts` — `SITE` full structured NAP / `geo` / `serviceRadiusKm` (60) / `serviceAreas[]` — the single source for HVACBusiness JSON-LD + metadata + the canonical origin; likely add a GSC-verification field + canonical-origin constant.

### Codebase files this phase creates / modifies
- **NEW:** `app/sitemap.ts` (`force-static`), `app/robots.ts`, `lib/seo/*` (indexing-policy helper, metadata builder, `JsonLd` component), the branded OG image asset, the owner-ops runbook doc.
- **MODIFY:** `app/layout.tsx` (`metadataBase`, brand title/template rebrand, drop `keywords`, OG defaults, Vercel Analytics + Speed Insights, GSC meta, site-wide `HVACBusiness` JSON-LD); `app/diensten/[pillar]/page.tsx` + `app/diensten/[pillar]/[service]/page.tsx` (route `generateMetadata` via the shared builder + inject per-page `Service`/`BreadcrumbList`/`FAQPage`); the 4 static pages (canonical/OG via the builder).
- `next.config.ts` — stays `output:"export"` + `trailingSlash:false`; **do NOT touch the output mode** (Phase 5 decision gate).

### Codebase maps (patterns)
- `.planning/codebase/ARCHITECTURE.md` §"Architectural Constraints" (static export, server-component default, `metadata` object per page + `title.template`) + §"Anti-Patterns" (no `"use client"` on layout/static pages).
- `.planning/codebase/CONVENTIONS.md` — named exports, no-barrel (registry/seo = documented exception), `Icon` wrapper, `SITE` for business data, MD3 tokens / no 1px borders / no `#000` text.
- `.planning/codebase/CONCERNS.md` §"Missing Critical Features" (no sitemap/robots/OG/JSON-LD — exactly what this phase fills) + the placeholder Maps pin + image-opt-disabled (both Phase 5).
- `.planning/codebase/INTEGRATIONS.md` — no analytics yet (SEO-09 is from scratch), the Vercel project id, the GHL webhook (Phase 5), the Google Maps embed on the contact page.

*No external ADRs/specs — requirements are fully captured in `.planning/` docs + the decisions above.*

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`lib/services/registry.ts`** — `urlFor()` / `trailFor()` / `PAGES` / `pillars()` / `childrenOf()`: the exact data the sitemap, canonical, BreadcrumbList, and Service JSON-LD read. No new traversal needed.
- **`lib/constants.ts` `SITE`** — full structured NAP/geo/radius/serviceAreas → the single source for `HVACBusiness` JSON-LD + metadata; no hardcoded business data.
- **Phase-2 `generateMetadata`** in the two dynamic routes — the seam to extend (currently title/description only).
- **`Breadcrumbs` component + the `Crumb` shape** (P2) — the visible trail already mirrors the BreadcrumbList JSON-LD trail (one `trailFor()` source).
- **`public/images/hero-ventilatie.jpg`** — candidate seed for the branded OG image.

### Established Patterns
- **Static export (`output:"export"`)** dictates: sitemap/robots MUST be `force-static`; JSON-LD is build-time server-rendered; **NO dynamic `opengraph-image`** (`ImageResponse` needs a runtime → static OG file); analytics are client components. Do NOT relax the output mode (Phase 5 gate).
- **Server components by default** — the `JsonLd` injector + metadata builders are server-side (zero client JS).
- **Single-source helpers** (the `urlFor()` pattern) — mirror it for the `lib/seo` indexing-policy + metadata builder so canonical / sitemap / robots can never drift.
- Design system / nl-only / `SITE`-sourced business data unchanged.

### Integration Points
- `app/layout.tsx` → `metadataBase`, site-wide OG defaults, `HVACBusiness` JSON-LD, Vercel Analytics + Speed Insights, the GSC meta tag.
- `app/sitemap.ts` / `app/robots.ts` → read the `lib/seo` policy helper (which reads `PAGES` + `status`).
- Dynamic + static page metadata → the shared `lib/seo/metadata.ts` builder (canonical + OG/Twitter + robots directive).
- **`status:"published"` flips in Phase 4** → auto-populate the sitemap + flip `noindex`→`index` (the editorial gate is the index lever; no Phase-3 rework).
- **`SITE.geo`** (owner-verify-pending) → JSON-LD `geo` + the GBP pin + Phase-5 QA-05 Maps embed all share the same verified coordinates.

</code_context>

<specifics>
## Specific Ideas

- The indexing design deliberately **reuses the existing `status` field** (P1 D-08) so Phase 4's editorial sign-off (CONT-10) is the SAME switch that admits a page to the sitemap + index — one lever, no parallel list.
- `aggregateRating` is intentionally held to **Phase 4** to stay inside Google's review-snippet guidelines (ratings must reflect consolidated, sourced, on-page reviews) and avoid a manual action — a deliberate "do it right" call consistent with the project's Dec-2025 thin-content / YMYL caution.
- **AI crawlers are allowed on purpose** — GEO / AI-citation visibility (ChatGPT / Perplexity / AI Overviews) is treated as a real local-discovery channel, matching the "turn local search demand into contacted leads" core value.
- **Canonical host stays `tpsventilatie.nl` while the brand name is "TPS klimaattechniek"** — a conscious name≠domain split so SEO signals consolidate on the live, already-cited domain rather than a not-yet-migrated rebrand domain.

</specifics>

<deferred>
## Deferred Ideas

- **tpsklimaattechniek.nl domain migration** (register/verify + 301 plan + GBP rename + citation/NAP updates) — v2 (DOM-V2-01).
- **GA4** (with an AVG cookie-consent mechanism + privacy-policy processor mention) — later phase; Phase 3 ships cookieless Vercel Analytics only.
- **`aggregateRating` / `Review` JSON-LD** — Phase 4 (CONT-08), once reviews are consolidated + shown on-page.
- **Per-pillar OG images (4)** — later enhancement; Phase 3 ships one branded sitewide OG image.
- **Page-body regio copy** (Zoetermeer + regio in visible text) — Phase 4 (SEO-06 copy side); Phase 3 covers regio in metadata / NAP / JSON-LD only.
- **Visible Google Maps embed pin fix** — Phase 5 (QA-05); Phase 3 needs only the verified geo coordinate value for JSON-LD.
- **Build-time image optimization (WebP/AVIF)** — Phase 5 (QA-07); affects the OG image asset weight, not Phase-3 scope.

*No reviewed-but-deferred todos — todo backlog was empty.*

</deferred>

---

*Phase: 3-SEO Infrastructure*
*Context gathered: 2026-06-05*
