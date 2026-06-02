# Phase 1: Taxonomy & Data Model - Research

**Researched:** 2026-06-02
**Domain:** Typed data modeling (TypeScript discriminated unions) + build-time validation (Zod 4) + Dutch local-SEO keyword architecture for an HVAC/climate-tech service surface on Next.js 16 static export
**Confidence:** HIGH (stack/validation/schema.org), HIGH-for-intent / MEDIUM-for-volume (keyword map — SERP intent is verified, absolute monthly volumes are not available without a paid keyword tool)

<user_constraints>
## User Constraints (from CONTEXT.md)

> These are LOCKED. Research below explains HOW to implement them well — it does not re-open them.

### Locked Decisions

**URL & Slug Structure**
- **D-01 — Nested URLs.** `/diensten/{pillar}/{sub-service}`. Hub at `/diensten`, 4 pillars at `/diensten/{pillar}`, 17 subs at `/diensten/{pillar}/{sub}`. Maps to Next.js `[pillar]/[service]` route segments in Phase 2.
- **D-02 — Full descriptive Dutch slugs.** Pillars: `airconditioning`, `warmtepompen`, `wtw`, `mechanische-ventilatie`. Subs — Airco/WP: `installatie`, `onderhoud`, `reparatie-storing`, `advies`; WTW: `vervangen`, `onderhoud-reinigen`, `inregelen`, `storing`, `aanleggen`; MV: `vervangen`, `onderhoud-reinigen`, `storing`, `aanleggen`. (`wtw` stays lowercase.)
- **D-03 — URL policy: no trailing slash, lowercase, leading slash.** `next.config.ts` → `trailingSlash: false`. A single `urlFor()` helper in `registry.ts` is the ONLY place hrefs are built.
- **D-04 — One unified page registry.** Discriminated union by page type (`hub | pillar | service | static`). Sitemap and nav read this one list.

**Taxonomy Model & Validation**
- **D-05 — Per-pillar files + registry.** `lib/services/{airconditioning,warmtepompen,wtw,mechanische-ventilatie}.ts`, `types.ts`, `registry.ts`. `registry.ts` is a documented exception to the no-barrel rule (an aggregation module, not a re-export barrel). Each file <800 lines.
- **D-06 — Normalized brand registry.** `lib/services/brands.ts`: each brand once (`id`, name, logo, blurb, dealer-status flag). Brand→pillar: Airco Installatie → Daikin, Mitsubishi Electric, Mitsubishi Heavy; Warmtepompen Installatie → Daikin, Mitsubishi Ecodan; WTW/MV → no BrandGrid. Dealer-status values owner-verified in Phase 4.
- **D-07 — Uniqueness bar enforced via Zod at build.** Zod content schema (intro ≥120 words, 3-6 FAQs, non-empty steps + local angle) run by `validateTaxonomy()`. Empty/short fields → readable, blocking build error. Introduces the `zod` dependency (reused by Phase 5 QA-02).
- **D-08 — Per-page `status` field gates enforcement.** `status: "draft" | "review" | "published"`. Structure always checked; CONTENT rules only for `review`/`published`. Phase 1 ships all pages `draft` → build stays green with empty content.

**NAP, Radius & Service Area (`lib/constants.ts` `SITE`)**
- **D-09 — Service radius = 60 km.** `SITE.serviceRadiusKm = 60`. Copy: "tot 60 km vanuit Zoetermeer". Replace `app/tarieven/page.tsx:62` ("straal van 50km") and `components/PricingTabs.tsx:442 & 519` ("straal van 100 km") with the SITE-sourced value (fixes QA-03). JSON-LD `geoRadius` = 60000 m (Phase 3).
- **D-10 — `SITE.name = "TPS klimaattechniek"`** (was "TPS Ventilatie"). Domain stays `tpsventilatie.nl` for launch.
- **D-11 — Service area = radius + named regions.** `SITE.serviceAreas` = core municipalities (Zoetermeer, Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden…). OWNER reviews the town list.
- **D-12 — Full structured NAP in Phase 1.** Address parts, `country: "NL"`, `province: "Zuid-Holland"`, `geo: { lat, lng }`, `serviceRadiusKm`, `serviceAreas[]`, alongside existing phone/email/postcode/city/kvk/btw/whatsapp. Real `geo.lat/lng` owner-verify-pending. Satisfies SEO-08.

**Keyword Map & Content Shells**
- **D-13 — Keyword data per-page + uniqueness enforced.** Each node carries `primaryKeyword` + `searchIntent` (+ optional `secondaryKeywords[]`). `validateTaxonomy()` asserts each is unique across all pages → cannibalization is a build error (IA-09, criterion 2).
- **D-14 — Content shell = content + SEO metadata (one source).** Shells hold body content AND per-page SEO metadata (`metaTitle`, `metaDescription`, `ogImage`) AND keyword fields. Status-gated.
- **D-15 — Content field shapes.** `faqs: { question, answer }[]` and `steps: { title, body }[]` are structured arrays (feed FAQPage JSON-LD + components with zero re-parsing). `intro` + `localAngle` are prose text.

### Claude's Discretion
- **D-03 trailing-slash:** locked no-trailing-slash / lowercase / leading-slash as the documented URL convention.
- **Pricing boundary:** pricing data stays in `components/PricingTabs.tsx` — NOT absorbed into the taxonomy this phase (CONT-05 handles pricing in Phase 4).
- **Compound sub-service slugs** (`reparatie-storing`, `onderhoud-reinigen`) derive deterministically from D-02 — planner finalizes.
- **SITE field layout** (nested `geo {}`/`address {}` objects vs flat) — planner's call within D-12.
- **Prose renderer** (Markdown lib vs paragraph array) for `intro`/`localAngle` — planner's call within D-15.

### Deferred Ideas (OUT OF SCOPE)
- Pricing as taxonomy data — left in PricingTabs (revisit Phase 4 CONT-05).
- Reviews consolidation data model (CONT-08) — Phase 4.
- Per-brand dedicated pages (e.g. `/diensten/airconditioning/installatie/daikin`) — v2 (CONT-V2-01).
- Per-location / neighbourhood pages — v2 (BLOG-02). Phase 1 uses regio *signals* + `serviceAreas`, NOT city pages.
- Full rebrand + domain migration to `tpsklimaattechniek.nl` — v2 (DOM-V2-01).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **IA-01** | Service taxonomy data model (`lib/services/`) is the single source of truth for routes, nav, sitemap, JSON-LD | Discriminated-union page registry pattern (§Architecture Patterns Pattern 1); `urlFor()` as sole href builder (Pattern 2); `PAGES` array consumed by Phase 2 `generateStaticParams` + Phase 3 sitemap. Validation that no parallel list exists = criterion-1 grep test (§Validation Architecture). |
| **IA-08** | Per-page uniqueness bar via typed required content fields (anti-thin-content gate) | Zod content schema with refinements: intro ≥120 words, steps non-empty, FAQs 3-6 (§Don't Hand-Roll + §Code Examples). Justified by Dec-2025 Core Update evidence (§State of the Art). Status-gated so empty `draft` shells don't block (D-08). |
| **IA-09** | Keyword map: one primary keyword/intent per URL (anti-cannibalization) | The full per-URL Dutch keyword map (§Keyword Map — the centerpiece). Cross-record uniqueness enforced via `superRefine` + Set-size check (§Code Examples). Pillar-vs-`installatie` cannibalization split by intent documented per pillar. |
| **SEO-08** | NAP consistency from a single source (`lib/constants.ts`), incl. corrected service radius | Structured `SITE` extension mapped 1:1 to schema.org `LocalBusiness`/`HVACBusiness` (§schema.org NAP Modeling). `serviceRadiusKm = 60` + `serviceAreas[]` + `geo {}`. |
| **QA-03** | Fix service-area radius inconsistency (50 vs 100 km) at the source | Confirmed exact offending strings (§Runtime State Inventory). Replace all three with `SITE.serviceRadiusKm`. Criterion-4 grep test asserts the literal "50km"/"100 km" strings are gone (§Validation Architecture). |
</phase_requirements>

## Summary

This phase is pure data + types + build-time validation — no rendered pages, no finished copy. The technical core is uncontroversial and well-supported: a **discriminated-union page registry** in TypeScript (idiomatic, `type: "hub" | "pillar" | "service" | "static"`), a single `urlFor()` href builder, a unified `PAGES` array that downstream phases read, and **Zod 4** refinements that turn the anti-thin-content rules and the anti-cannibalization rule into genuinely build-blocking errors. All of this is standard, low-risk, and maps cleanly onto the existing `SITE`-as-single-source convention already in `lib/constants.ts`.

The single highest-value deliverable is the **keyword map** (criterion 2 + IA-09). Real Dutch SERP research confirms that every planned slug corresponds to a genuinely-searched term with competing service pages already ranking (Feenstra, Alpha Ventilatie, Verkeyn, AircoExpert24, etc.), which validates D-02's slug choices. The hard problem — and the reason this needs research rather than drafting — is **intent separation between each pillar and its `installatie` sub-service** to keep cannibalization from becoming a build error. The map below assigns the broad/category intent to the pillar and the transactional "laten installeren" intent to the `installatie` sub, and flags three genuinely low-volume subs (`advies` ×2, `wtw inregelen`) that should target long-tail/regional modifiers rather than compete head-to-head.

The Dec-2025 Google Core Update directly justifies the schema's shape: the update penalized "pages that attempt to satisfy various intents at once," "SEO-optimized location pages without substance," and "manufacturer-provided content used by multiple sellers." That is precisely why the model enforces one-intent-per-URL, uses regio *signals* instead of city pages (BLOG-02 stays deferred), and requires a unique ≥120-word intro + service-specific steps + a local angle per page.

**Primary recommendation:** Build the registry as a discriminated union with one `urlFor()` builder and a single `PAGES` array; validate it with Zod 4 in a dedicated `tsx scripts/validate-taxonomy.ts` step wired to the npm `prebuild` hook (so failure aborts `next build` with a readable, page-named error before any rendering happens); model `SITE` to mirror schema.org `HVACBusiness` + `GeoCircle` so Phase 3 JSON-LD just reads fields; and ship all pages as `draft` with the keyword map fully populated and content shells empty.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Taxonomy data (slugs, page types, brand relations) | Build-time TS data (`lib/services/`) | — | Static export has no server runtime; this is plain TS consumed at build by `generateStaticParams`. [VERIFIED: codebase ARCHITECTURE.md] |
| URL construction (`urlFor`) | Build-time TS (`registry.ts`) | — | One pure function; consumed by nav (client/server), sitemap (build), JSON-LD (server-rendered HTML). No runtime tier owns URLs. |
| Taxonomy validation | Build pipeline (npm `prebuild` → `tsx`) | Module-load (page/sitemap import) | Prebuild script gives a dedicated readable error and blocks `next build`; module-load import is a backstop. [VERIFIED: npm-scripts docs] |
| NAP / business facts (`SITE`) | Build-time TS (`lib/constants.ts`) | — | Already the single source; extend in place, never parallel. [VERIFIED: CLAUDE.md guardrail] |
| Keyword map | Build-time TS data (on each page node) | — | Keyword lives on the page it targets (D-13); uniqueness checked at build, not runtime. |
| Rendering pages / nav | — (Phase 2) | — | Out of scope this phase — taxonomy only produces the data those routes read. |
| JSON-LD output | — (Phase 3) | — | Out of scope — this phase makes it *sourceable* (modeling only). |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `zod` | **4.4.3** (latest) | Build-time schema validation of the taxonomy (intro word count, FAQ array length, cross-record slug/keyword uniqueness, status-gated content rules) | TypeScript-first, zero runtime deps, static type inference via `z.infer`; the project's own TS rules already prescribe Zod for input validation. Reused by Phase 5 QA-02 (form validation). [VERIFIED: npm registry — `npm view zod version` → 4.4.3, created 2020-03-07, modified 2026-05-04, MIT, deps: none] [CITED: zod.dev] |
| `tsx` | **4.x** (latest; verify at install) | Run the `validate-taxonomy.ts` script in the `prebuild` step without a separate compile (executes TS directly on Node) | De-facto standard for running standalone TS scripts in Node tooling; lighter than `ts-node` for a one-shot build script. [ASSUMED — confirm exact version + slopcheck at install time; see Package Legitimacy Audit] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | 5.x (already installed) | Discriminated-union types, `interface` for node shapes, string-union for the `type` discriminant | Already the project standard; strict mode on. [VERIFIED: package.json] |
| Next.js | 16.2.1 (already installed) | `next build` is the build whose exit the prebuild gate must precede | Already installed; static export mode. [VERIFIED: package.json] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod 4 | Zod 3.x | v3 lacks `z.prettifyError()` / `z.treeifyError()` (Zod-4-only readable-error helpers) and the newer `.check()` API. No reason to pin to v3 on a greenfield dependency. [VERIFIED: zod GitHub issue #4213/#4268 — these helpers are Zod-4-only] |
| Zod 4 | Valibot / ArkType | Smaller bundle, but Zod is what the project's own rules name, has the best ecosystem docs, and the validation runs at **build time** (bundle size is irrelevant here). Stick with Zod. [ASSUMED] |
| `tsx` prebuild script | Validate only at module-load (import registry in `app/sitemap.ts`) | Module-load works (throws during `next build`) but couples validation to rendering and produces a less obvious error. Prebuild gives a dedicated, readable, page-named failure first. Recommend prebuild as primary, module-load as backstop. [VERIFIED: Next.js static-export docs + npm-scripts] |
| `tsx` | `ts-node`, `bun`, `vite-node` | All work; `tsx` is the lightest common choice for a single script. Planner may pick any that's already ergonomic. [ASSUMED] |

**Installation:**
```bash
npm install zod
npm install -D tsx
```

**Version verification (run before locking the Standard Stack table at plan time):**
```bash
npm view zod version          # confirmed 4.4.3 on 2026-06-02
npm view tsx version          # confirm latest; run slopcheck (see audit)
```

## Package Legitimacy Audit

> Two external packages are introduced this phase: `zod` (runtime dep) and `tsx` (dev dep). slopcheck 0.6.1 was available at research time and was run against `zod`.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `zod` | npm | ~6 yrs (created 2020-03-07) | very high (industry-standard) | github.com/colinhacks/zod | **[OK]** (slopcheck 0.6.1, 2026-06-02) | **Approved.** No `postinstall` script (`npm view zod scripts.postinstall` → empty). MIT, zero deps. |
| `tsx` | npm | mature, widely used | very high | github.com/privatenumber/tsx | **not yet run** | **[ASSUMED]** — dev-only build tool. Planner MUST run `slopcheck install tsx` and `npm view tsx scripts.postinstall` before the install task; gate behind `checkpoint:human-verify` if slopcheck is unavailable at plan time. |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*Both package names were discovered from authoritative sources (zod from the project's own TS rules + zod.dev; tsx is the standard Node TS-runner). `zod` passed slopcheck [OK] AND is documented at zod.dev → eligible for [VERIFIED: npm registry]. `tsx` was not slopchecked in this session → remains [ASSUMED] until the planner verifies at install.*

## Architecture Patterns

### System Architecture Diagram

```text
                          ┌──────────────────────────────────────────────┐
                          │  lib/constants.ts  →  SITE (extended)        │
                          │  name, address parts, country, province,     │
                          │  geo{lat,lng}, serviceRadiusKm=60,           │
                          │  serviceAreas[], phone/email/kvk/btw/wa      │
                          └───────────────────┬──────────────────────────┘
                                              │ read by
        ┌─────────────────────────────────────┼───────────────────────────────────┐
        │                                     │                                   │
        ▼                                     ▼                                   ▼
┌─────────────────────────────┐   (Phase 3 JSON-LD reads SITE)    (Phase 5 Maps pin reads SITE.geo)
│  lib/services/ taxonomy      │
│                              │
│  types.ts ── shared types + Zod schemas (PageNode union, ContentShell, refinements)
│     ▲                                                                       │
│     │ import types                                                          │
│  airconditioning.ts ┐                                                       │
│  warmtepompen.ts    ├─ per-pillar nodes (pillar + its sub-service nodes)    │
│  wtw.ts             │   each node: slug, type, primaryKeyword, intent,      │
│  mechanische-…ts    ┘   secondaryKeywords[], status, content shell (empty)  │
│  brands.ts ── normalized brand registry (Daikin once, etc.)                 │
│     │                                                                       │
│     ▼ aggregated by                                                         │
│  registry.ts ── PAGES: PageNode[]  +  urlFor(node)  +  findBySlug/byType    │
│                 +  validateTaxonomy(PAGES)  (calls Zod schemas)             │
└───────┬───────────────────────────────────────────────────────────────┬────┘
        │                                                               │
        │ (build-time)                                                  │ imported by
        ▼                                                               ▼
┌────────────────────────────┐                          ┌──────────────────────────────────┐
│ npm "prebuild" hook         │                          │ DOWNSTREAM CONSUMERS (other phases)│
│  → tsx scripts/             │                          │  Phase 2: generateStaticParams →   │
│     validate-taxonomy.ts    │  ── fails build on ──►   │           PAGES (dynamicParams=    │
│  calls validateTaxonomy();  │     any Zod error        │           false), nav from PAGES   │
│  z.prettifyError(err);      │     (readable, names     │  Phase 3: sitemap from PAGES,      │
│  process.exit(1) on fail    │      offending page+field)│           JSON-LD from SITE+node   │
└────────────────────────────┘                          │  Phase 4: flips status→published,  │
                                                         │           fills content shells     │
                                                         └──────────────────────────────────┘
```

A reader traces the primary flow: business facts live once in `SITE`; the service surface lives once as `PAGES` (aggregated from per-pillar files); `urlFor()` is the only href source; `validateTaxonomy()` (run by the prebuild script) gates the whole thing at build time; downstream phases read `PAGES` and `SITE` without ever re-declaring a route or a phone number.

### Recommended Project Structure
```text
lib/
├── constants.ts                  # EXTEND SITE here (D-09…D-12) — do not parallel
└── services/                     # NEW — the taxonomy (D-05)
    ├── types.ts                  # PageNode discriminated union, ContentShell interface, Zod schemas
    ├── brands.ts                 # Normalized brand registry (D-06)
    ├── airconditioning.ts        # Airco pillar node + 4 sub-service nodes
    ├── warmtepompen.ts           # Warmtepompen pillar node + 4 sub-service nodes
    ├── wtw.ts                    # WTW pillar node + 5 sub-service nodes
    ├── mechanische-ventilatie.ts # MV pillar node + 4 sub-service nodes
    └── registry.ts               # PAGES aggregate + urlFor() + lookups + validateTaxonomy()

scripts/
└── validate-taxonomy.ts          # NEW — prebuild gate: import PAGES, run validateTaxonomy, exit(1) on fail

# package.json: add  "prebuild": "tsx scripts/validate-taxonomy.ts"
# next.config.ts: add  trailingSlash: false   (D-03 — do NOT touch `output: "export"`)
```

### Pattern 1: Discriminated-union page registry
**What:** Every routable page is one variant of a single union, discriminated by `type`. Shared fields (slug segments, SEO, keyword, status) live on a base; per-type fields (e.g. `brandIds` only on `service` Installatie pages, `subServices` only on `pillar`) are added per variant.
**When to use:** Whenever multiple page kinds must live in one list that nav + sitemap + route generation all consume (exactly D-04).
**Example:**
```typescript
// Source: TypeScript Handbook discriminated unions [CITED: typescriptlang.org/docs/handbook]
//         + project CONVENTIONS.md (string-union `type` for discriminant, `interface` for shapes)
// ILLUSTRATIVE shape — planner finalizes fields; do not treat as the final schema.

type PageType = "hub" | "pillar" | "service" | "static";
type SearchIntent = "informationeel" | "commercieel" | "transactioneel" | "navigationeel";
type PageStatus = "draft" | "review" | "published";

interface PageBase {
  type: PageType;
  status: PageStatus;
  primaryKeyword: string;
  searchIntent: SearchIntent;
  secondaryKeywords?: string[];
  content: ContentShell;      // body + SEO metadata (D-14) — empty in Phase 1
}

interface HubPage extends PageBase { type: "hub"; segment: "diensten"; }
interface PillarPage extends PageBase { type: "pillar"; pillarSlug: string; }
interface ServicePage extends PageBase {
  type: "service";
  pillarSlug: string;         // parent pillar
  serviceSlug: string;        // e.g. "installatie"
  brandIds?: string[];        // present only on Installatie pages (D-06)
}
interface StaticPage extends PageBase { type: "static"; pathSegment: string; } // "", "tarieven", "over-ons"…

type PageNode = HubPage | PillarPage | ServicePage | StaticPage;
```
Why a union beats four parallel arrays: one `PAGES: PageNode[]` is impossible to drift from (criterion 1), and `switch (node.type)` in `urlFor()` is exhaustively type-checked.

### Pattern 2: `urlFor()` as the sole href builder
**What:** A single pure function maps any node to its canonical path; nothing else in the codebase constructs a service URL.
**When to use:** Always — nav (Phase 2), canonical + sitemap + JSON-LD (Phase 3) all call it. This is what makes "no parallel hardcoded lists" provable.
**Example:**
```typescript
// ILLUSTRATIVE — enforces D-03 (lowercase, leading slash, no trailing slash)
export function urlFor(node: PageNode): string {
  switch (node.type) {
    case "hub":     return "/diensten";
    case "pillar":  return `/diensten/${node.pillarSlug}`;
    case "service": return `/diensten/${node.pillarSlug}/${node.serviceSlug}`;
    case "static":  return node.pathSegment === "" ? "/" : `/${node.pathSegment}`;
  }
}
```

### Pattern 3: Normalized brand reference (D-06)
**What:** Brands live once in `brands.ts`; Installatie service nodes hold `brandIds: string[]`; the Phase-2 `BrandGrid` resolves id→data.
**When to use:** Any entity referenced by more than one page — here, **Daikin appears under both Airco and Warmtepompen** Installatie pages, which is the concrete reason to normalize.
**Example:**
```typescript
// brands.ts
export const BRANDS = {
  daikin:           { id: "daikin", name: "Daikin", logo: "/images/brands/daikin.svg", blurb: "", erkendInstallateur: false /* owner-verify Phase 4 */ },
  "mitsubishi-electric": { id: "mitsubishi-electric", name: "Mitsubishi Electric", logo: "…", blurb: "", erkendInstallateur: false },
  // …
} as const;
// airco installatie node:  brandIds: ["daikin", "mitsubishi-electric", "mitsubishi-heavy"]
// warmtepompen installatie node: brandIds: ["daikin", "mitsubishi-ecodan"]
```

### Pattern 4: `prebuild` validation gate (D-07)
**What:** `package.json` `"prebuild"` runs automatically before `"build"`; a non-zero exit aborts `next build`.
**When to use:** This is the cleanest genuinely-blocking validator — it runs before any rendering, so the error is about *data*, not a render crash.
**Example:**
```jsonc
// package.json scripts
{
  "prebuild": "tsx scripts/validate-taxonomy.ts",
  "build": "next build"
}
```
```typescript
// scripts/validate-taxonomy.ts
import { PAGES } from "@/lib/services/registry";
import { validateTaxonomy } from "@/lib/services/registry";
const result = validateTaxonomy(PAGES);   // returns { ok: true } | throws ZodError
// on failure validateTaxonomy throws; catch, print z.prettifyError(err), process.exit(1)
```
[VERIFIED: npm-scripts run order — `pre<script>` runs before `<script>`; non-zero exit halts the chain] [VERIFIED: Next.js — `next build` fails on uncaught errors during static generation]

### Anti-Patterns to Avoid
- **Parallel hardcoded lists.** Re-declaring routes in nav, sitemap, or JSON-LD instead of reading `PAGES`. This is the exact thing criterion 1 forbids — the existing `DIENSTEN_DROPDOWN` / `NAV_LINKS` constants in `lib/constants.ts` become *derived* in Phase 2, not a second source. [VERIFIED: ROADMAP criterion 1]
- **Modeling pricing into the taxonomy.** Pricing stays in `components/PricingTabs.tsx` (CONT-05, Phase 4). The Dec-2025 update specifically flagged "pricing pages that dilute topical expertise" — another reason to keep pricing out of the service taxonomy. [VERIFIED: CONTEXT.md deferred + Dec-2025 update guidance]
- **City/location pages.** Generating `/airconditioning/zoetermeer`, `/airconditioning/delft`, … is an explicit anti-feature (BLOG-02 deferred; "SEO-optimized location pages without substance struggled" in Dec-2025). Use `serviceAreas` + regio signals in copy instead. [VERIFIED: Dec-2025 update + REQUIREMENTS Out-of-Scope]
- **Touching `output: "export"`.** The static-vs-hybrid decision is Phase 5's gate. This phase only adds `trailingSlash: false`. [VERIFIED: CONTEXT.md scope]
- **Generic barrel files.** `registry.ts` is a *justified* aggregation module; do not add `index.ts` re-export barrels elsewhere (project no-barrel rule). [VERIFIED: CONVENTIONS.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Word-count ≥120 on `intro` | A custom string-length parser with ad-hoc messages | `zod` `.refine(v => v.trim().split(/\s+/).filter(Boolean).length >= 120, { error, path })` | Zod gives a typed, composable check with a structured error path that names the field. [CITED: zod.dev/api] |
| FAQ array length 3–6 | Manual `if (faqs.length < 3 …)` scattered across files | `z.array(faqSchema).min(3).max(6)` | One declarative rule; readable error; reused for every page. [CITED: zod.dev/api] |
| Non-empty `steps` / `localAngle` | Truthiness checks per call site | `z.array(stepSchema).min(1)` (v4 replacement for deprecated `.nonempty()`) | Consistent, status-gated, build-blocking. [VERIFIED: zod v4 changelog — `.nonempty()` → `.array().min(1)`] |
| Cross-record uniqueness (slug + primaryKeyword unique across ALL pages) | A nested loop comparing every pair | `z.array(pageSchema).superRefine((pages, ctx) => …Set-size + duplicate index…)` | Single pass; `ctx.addIssue({ path: [i, "primaryKeyword"] })` names the exact offender. [VERIFIED: zod.dev — array `superRefine` Set-size pattern] |
| Readable build error | `console.log(JSON.stringify(err))` | `z.prettifyError(err)` (Zod-4-only) | Human-readable multi-line string naming each failing path — exactly what "readable error naming the offending page+field" requires. [VERIFIED: zod GitHub #4213] |
| Static type for content shells | Hand-written `interface` kept in sync with the validator | `z.infer<typeof contentShellSchema>` | Schema is the single source for both runtime validation and the compile-time type. [CITED: project TS rules] |
| Service-area geo math | Custom haversine to test "is town within 60 km" | Don't compute it — model `serviceAreas` as an owner-reviewed list + `serviceRadiusKm`; JSON-LD `GeoCircle` expresses the radius declaratively | Over-claiming towns is a thin-content/relevance risk; the owner curates the list (D-11). [VERIFIED: schema.org GeoCircle + Dec-2025 guidance] |

**Key insight:** Every "rule" in the uniqueness bar and the keyword map is a one-liner in Zod 4. Hand-rolling validation here means re-implementing error paths, message formatting, and type inference that Zod already gives — and getting a worse, non-build-blocking result. The only genuinely bespoke logic is the cross-record uniqueness `superRefine`, and even that is a documented Zod pattern.

## Runtime State Inventory

> This phase renames a brand string (`SITE.name`), changes a radius value, and introduces new data — so a state inventory is warranted. The "rename" here is data-layer only (a constant value), not a code-symbol rename.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | None — site is fully static, no database, no datastore, no user records. The taxonomy IS the data and it lives in git. | None — verified by ARCHITECTURE.md ("No server runtime… all data hardcoded") + absence of any DB dependency in package.json. |
| **Live service config** | `SITE.name` changing "TPS Ventilatie" → "TPS klimaattechniek" affects **Google Business Profile** (not in git) and ideally a **KvK handelsnaam** — but these are explicitly **owner actions deferred to Phase 3 (SEO-07)**, not Phase 1 code. GoHighLevel webhook config unaffected (no name string). | None in Phase 1 (code-only). Phase 3 SEO-07 verifies GBP alignment. Flag to owner: GBP rename pending. |
| **OS-registered state** | None — no cron, no Task Scheduler, no pm2, no systemd. Build runs on Vercel CI. | None — verified (no process-manager artifacts in repo). |
| **Secrets / env vars** | Only `NEXT_PUBLIC_GHL_WEBHOOK_URL` (`.env.example`). No env var references the brand name or radius. This phase adds **no** new secret. (The webhook-secret rename is Phase 5 QA-02.) | None — verified by grep of `.env.example` + `lib/forms.ts`. |
| **Build artifacts** | `out/` and `.next/` are gitignored and regenerated each build. Introducing `zod` + `tsx` requires a fresh `npm install` so `package-lock.json` updates (lockfileVersion 3 present). No stale egg-info/binary equivalents in a Next.js project. | Run `npm install` after adding deps; commit updated `package-lock.json`. |

**The canonical question — after every file is updated, what runtime systems still hold the old value?**
- The **50 km / 100 km radius strings** are the only "old values" with copies. They are **hardcoded literals in three source locations** (below) — there is no cached/registered copy elsewhere. Replacing all three at the source (D-09) fully resolves QA-03; no migration of stored data is needed because nothing stores the radius.
- The **"TPS Ventilatie" brand string** appears in `SITE.name`, `SITE.email` (`info@tpsventilatie.nl` — domain stays, do NOT change), the domain itself (`tpsventilatie.nl` — stays for launch), and externally in GBP (owner action, Phase 3). In-repo, only `SITE.name` changes this phase.

**Confirmed offending radius strings (QA-03 — grep `"straal van"` on 2026-06-02):**
```
app/tarieven/page.tsx:62        "…werkzaam in een straal van 50km rondom onze hoofdlocatie…"
components/PricingTabs.tsx:442   "…Werkgebied: straal van 100 km vanuit Zoetermeer."
components/PricingTabs.tsx:519   "…Werkgebied: straal van 100 km vanuit Zoetermeer."
```
(`app/over-ons/page.tsx` references an undefined "regio" per CONCERNS.md but holds no numeric radius literal — verify during planning whether it needs a SITE-sourced phrasing too.)

## Common Pitfalls

### Pitfall 1: Pillar vs `installatie` keyword cannibalization
**What goes wrong:** The pillar page (`/diensten/airconditioning`) and its install sub (`/diensten/airconditioning/installatie`) both naturally want "airco installatie" — in this design that is a **build error** (D-13 uniqueness), and in SEO terms it splits ranking signals.
**Why it happens:** "Airco installatie" reads as both a category label and a transactional service.
**How to avoid:** Give the **pillar** the broad/category-commercial head term ("airconditioning", "airco laten plaatsen" as an overview) and give the **`installatie` sub** the specific transactional term ("airco laten installeren" / "airco installatie kosten"). The map below does this for all four pillars. SERP evidence confirms the terms are distinct in usage. [VERIFIED: WebSearch — both terms in heavy independent use; Dec-2025 "do one job exceptionally well"]
**Warning signs:** Two nodes whose `primaryKeyword` differ only by a stop-word; `validateTaxonomy()` throwing a duplicate-keyword issue.

### Pitfall 2: Over-claiming service areas
**What goes wrong:** Listing towns TPS doesn't actually serve (or 30+ towns to "cover the map") in `serviceAreas` → triggers the Dec-2025 thin/irrelevant-content signal and erodes the "Transparant" USP.
**Why it happens:** Temptation to maximize local keyword surface.
**How to avoid:** `serviceAreas` is an **owner-reviewed** curated list (D-11). Model it as data now with a sensible seed; flag it `[ASSUMED — owner must confirm]`. Express the broad reach via `GeoCircle`/`serviceRadiusKm`, not via an inflated town list. [VERIFIED: Dec-2025 update + schema.org best-practice "GeoCircle for radius, cities for specific targets"]
**Warning signs:** Town names in copy that the owner can't confirm they service; a `serviceAreas` array padded past the genuine catchment.

### Pitfall 3: Modeling pricing into the taxonomy
**What goes wrong:** Pulling `WTW_UNITS` / `MV_ONDERHOUD` price arrays into `lib/services/` — out of scope, bloats nodes, and (per Dec-2025) "pricing pages dilute topical expertise."
**Why it happens:** Pricing data *looks* like service data.
**How to avoid:** Hard boundary — pricing stays in `components/PricingTabs.tsx` (CONT-05, Phase 4). The taxonomy references sub-services by slug only. [VERIFIED: CONTEXT.md Claude's Discretion]
**Warning signs:** A `price` field appearing on any `ServicePage`; an import of PricingTabs data into `lib/services/`.

### Pitfall 4: Breaking static export
**What goes wrong:** Adding a server-only API, importing Node built-ins into a client path, or flipping `output` — any of which breaks the static build or pre-empts Phase 5's decision gate.
**Why it happens:** Reaching for a server route to "run validation."
**How to avoid:** Validation runs in a **build-time script** (`tsx scripts/…`) or at module-load — never a runtime route. Keep `output: "export"` untouched; only add `trailingSlash: false`. The taxonomy is plain TS data with no runtime fetch. [VERIFIED: ARCHITECTURE.md constraints + CONTEXT.md scope]
**Warning signs:** A new `app/api/**/route.ts`; `next build` emitting a "cannot use X with output: export" error.

### Pitfall 5: Zod 3-era patterns on Zod 4
**What goes wrong:** Copy-pasting `.nonempty()`, relying on `ctx.path` (read) in `superRefine`, or expecting `formatError()`.
**Why it happens:** Most online Zod snippets are v3.
**How to avoid:** On Zod 4 use `z.array(...).min(1)` (not `.nonempty()`), use the **write** `path` property in `ctx.addIssue({ path: [...] })` (the read-side `ctx.path` was removed for performance), and use `z.prettifyError()` / `z.treeifyError()` for output. `.refine(fn, { error, path })` is the v4 signature (object, not bare string in the 2-arg form). [VERIFIED: zod v4 changelog + GitHub #4213/#4268]
**Warning signs:** TS errors on `.nonempty()`; `ctx.path` undefined; `formatError` not a function.

## Code Examples

> Verified against Zod 4 official docs (zod.dev) on 2026-06-02. Shapes are illustrative; the planner finalizes field names.

### Content shell schema with the uniqueness bar (IA-08, D-07)
```typescript
// Source: zod.dev/api (refinements, array min/max) [CITED]
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const stepSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

// Content fields are only fully enforced for review/published pages (D-08).
// For `draft`, structure is checked but prose/length rules are relaxed.
const contentShellSchema = z.object({
  h1: z.string().min(1),
  intro: z.string(),                 // word-count enforced conditionally below
  steps: z.array(stepSchema),        // non-empty enforced conditionally
  faqs: z.array(faqSchema),          // 3–6 enforced conditionally
  localAngle: z.string(),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  ogImage: z.string().optional(),
});
```

### Status-gated content enforcement (D-08)
```typescript
// Apply strict content rules ONLY when status is review/published.
// `intro` ≥120 words, steps non-empty, faqs 3–6.
const publishedContentSchema = contentShellSchema.superRefine((c, ctx) => {
  const wordCount = c.intro.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 120) {
    ctx.addIssue({ code: "custom", path: ["intro"],
      message: `intro has ${wordCount} words; needs >= 120` });
  }
  if (c.steps.length < 1) {
    ctx.addIssue({ code: "custom", path: ["steps"], message: "steps must be non-empty" });
  }
  if (c.faqs.length < 3 || c.faqs.length > 6) {
    ctx.addIssue({ code: "custom", path: ["faqs"],
      message: `faqs has ${c.faqs.length}; needs 3-6` });
  }
});
```

### Cross-record uniqueness across ALL pages (IA-09, D-13)
```typescript
// Source: zod.dev array superRefine Set-size pattern [VERIFIED]
// pageSchema picks status → applies publishedContentSchema when review/published.
const pagesSchema = z.array(pageSchema).superRefine((pages, ctx) => {
  const seenSlug = new Map<string, number>();
  const seenKw = new Map<string, number>();
  pages.forEach((p, i) => {
    const url = urlFor(p);                       // canonical path is the slug identity
    if (seenSlug.has(url)) {
      ctx.addIssue({ code: "custom", path: [i, "slug"],
        message: `duplicate URL "${url}" (also page #${seenSlug.get(url)})` });
    } else { seenSlug.set(url, i); }

    const kw = p.primaryKeyword.toLowerCase().trim();
    if (seenKw.has(kw)) {
      ctx.addIssue({ code: "custom", path: [i, "primaryKeyword"],
        message: `duplicate primaryKeyword "${kw}" (also page #${seenKw.get(kw)}) — cannibalization` });
    } else { seenKw.set(kw, i); }
  });
});
```

### Build-blocking entry point with a readable error (criterion 3)
```typescript
// scripts/validate-taxonomy.ts  — run by npm "prebuild"
import { z } from "zod";
import { PAGES } from "@/lib/services/registry";
import { pagesSchema } from "@/lib/services/types";

const result = pagesSchema.safeParse(PAGES);
if (!result.success) {
  console.error("\n❌ Taxonomy validation failed:\n");
  console.error(z.prettifyError(result.error));   // Zod-4 human-readable, path-named
  process.exit(1);                                 // non-zero → aborts `next build`
}
console.log(`✅ Taxonomy OK — ${PAGES.length} pages validated.`);
```
[VERIFIED: zod.dev/error-formatting — `z.prettifyError`; npm-scripts — prebuild exit code halts build]

### schema.org NAP modeling target for `SITE` (SEO-08, D-12 → Phase 3 JSON-LD)
```typescript
// Model SITE so Phase 3 JSON-LD reads fields 1:1. NO JSON-LD output this phase.
// Target shape (HVACBusiness ⊂ LocalBusiness):
// {
//   "@type": "HVACBusiness",
//   "name": SITE.name,                       // "TPS klimaattechniek"
//   "telephone": SITE.phone,
//   "email": SITE.email,
//   "address": { "@type": "PostalAddress",
//     "streetAddress": SITE.address, "postalCode": SITE.postcode,
//     "addressLocality": SITE.city, "addressRegion": SITE.province /* "Zuid-Holland" */,
//     "addressCountry": SITE.country /* "NL" */ },
//   "geo": { "@type": "GeoCoordinates", "latitude": SITE.geo.lat, "longitude": SITE.geo.lng },
//   "areaServed": { "@type": "GeoCircle",
//     "geoMidpoint": { "@type": "GeoCoordinates", "latitude": SITE.geo.lat, "longitude": SITE.geo.lng },
//     "geoRadius": SITE.serviceRadiusKm * 1000 /* 60000 metres */ }
//   // optionally ALSO areaServed: SITE.serviceAreas.map(name => ({ "@type": "City", name }))
// }
```
[VERIFIED: schema.org/GeoCircle, schema.org/geoRadius (metres), schema.org/areaServed; HVACBusiness ⊂ LocalBusiness]

---

## KEYWORD MAP (IA-09 · success criterion 2) — THE CENTERPIECE

> **Per-URL primary Dutch keyword + search intent for the full ~27-page surface. No two URLs share a `primaryKeyword`/intent — by design this is enforced as a build error (D-13).**
>
> **Confidence:** Intent classification = **HIGH** (verified from live Dutch SERPs — every term has competing service pages; see Sources). Absolute monthly **search volume = LOW confidence** — Google/Bing web search does not expose volume; figures here are *relative* signals inferred from SERP competition density, not measured numbers. **All `primaryKeyword` strings are `[ASSUMED]` until validated in a keyword tool (Google Keyword Planner / Ahrefs / SEMrush) — see Assumptions Log A1.** They are strong, defensible starting assignments, not locked facts.
>
> **Geography:** Dutch, Zoetermeer (Zuid-Holland), up to 60 km (Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden…). A **regional modifier** (e.g. "… Zoetermeer", "… regio Den Haag") is the recommended **secondary** keyword on most pages and the **primary** on the three low-demand pages flagged below.

### Hub
| URL | Primary keyword | Intent | Secondary (optional) | Notes |
|-----|-----------------|--------|----------------------|-------|
| `/diensten` | **klimaattechniek Zoetermeer** | commercieel (overview) | klimaatbeheersing, airco warmtepomp ventilatie | Hub targets the brand-category + region; intentionally broad so it never competes with a specific pillar/sub. Differentiates from each pillar by being the *umbrella* term. |

### Pillars (broad/category intent — distinct from each pillar's `installatie` sub)
| URL | Primary keyword | Intent | Secondary | Cannibalization control |
|-----|-----------------|--------|-----------|-------------------------|
| `/diensten/airconditioning` | **airconditioning** | commercieel | airco specialist Zoetermeer, airco regio Den Haag | Pillar = the broad category head term. The transactional "airco laten installeren" goes to the `installatie` sub → no overlap. [VERIFIED: SERP — "airconditioning" returns category/overview pages; "airco laten installeren" returns transactional install pages] |
| `/diensten/warmtepompen` | **warmtepomp** | commercieel | warmtepomp specialist, hybride warmtepomp Zoetermeer | Pillar = category; "warmtepomp laten installeren" → sub. ISDE-subsidie angle lives in pillar content (CONT-04). |
| `/diensten/wtw` | **wtw unit** | commercieel | warmteterugwinning, wtw ventilatie | `wtw unit` is the dominant short term (kept lowercase, D-02). "wtw-unit vervangen" → `vervangen` sub. [VERIFIED: SERP — "wtw unit" hub pages vs "wtw-unit vervangen" dedicated pages, e.g. Feenstra/Alpha/Verkeyn] |
| `/diensten/mechanische-ventilatie` | **mechanische ventilatie** | commercieel | mv ventilatie, ventilatiesysteem woning | Category head; the specific subs (storing/onderhoud/aanleggen) take the transactional/urgent terms. |

### Airconditioning sub-services
| URL | Primary keyword | Intent | Secondary | Notes |
|-----|-----------------|--------|-----------|-------|
| `…/airconditioning/installatie` | **airco laten installeren** | transactioneel | airco installatie kosten, airco laten plaatsen Zoetermeer | The transactional twin of the pillar. "laten installeren" = strong buyer intent (verified heavy commercial SERP). [VERIFIED: SERP — HORNBACH, Hoppenbrouwers, KliMate all rank service pages on this] |
| `…/airconditioning/onderhoud` | **airco onderhoud** | commercieel | airco onderhoud kosten, airco service | Recurring-service intent; distinct from install. |
| `…/airconditioning/reparatie-storing` | **airco storing** | transactioneel (urgent) | airco reparatie, airco monteur spoed | **High-urgency, seasonal (summer peak).** Compound slug `reparatie-storing` covers both "airco reparatie" (secondary) and "airco storing" (primary). [VERIFIED: SERP — many 24/7 spoed-reparatie pages, e.g. AircoExpert24, Hartman, Mirkinstallatie] |
| `…/airconditioning/advies` | **airco advies Zoetermeer** ⚠️ | informationeel/commercieel | welke airco kiezen, airco of warmtepomp | ⚠️ **LOW-DEMAND — use a regional/long-tail modifier as primary.** Bare "airco advies" is thin and bundled into broader advisory pages on competitors; "airco advies Zoetermeer" (or fold advies into the pillar) avoids competing nationally for a low-volume head term. [VERIFIED: SERP — "airco advies" mostly appears as a sub-section, few dedicated pages] |

### Warmtepompen sub-services
| URL | Primary keyword | Intent | Secondary | Notes |
|-----|-----------------|--------|-----------|-------|
| `…/warmtepompen/installatie` | **warmtepomp laten installeren** | transactioneel | warmtepomp installatie kosten, warmtepomp installateur | Transactional twin of the pillar. ISDE-subsidie hook in content. |
| `…/warmtepompen/onderhoud` | **warmtepomp onderhoud** | commercieel | warmtepomp onderhoud kosten, onderhoudscontract warmtepomp | Mixed info/commercial SERP dominated by manufacturers (Remeha/Nefit) — a local installer wins on the **local + transactional** angle, not on pure info. [VERIFIED: SERP — warmtepomp onderhoud kosten dominated by brand/energy-co content] |
| `…/warmtepompen/reparatie-storing` | **warmtepomp storing** | transactioneel (urgent) | warmtepomp reparatie, warmtepomp monteur | Urgent breakdown intent; less seasonal than airco (heating = winter relevance). |
| `…/warmtepompen/advies` | **warmtepomp advies regio Den Haag** ⚠️ | informationeel/commercieel | warmtepomp advies, welke warmtepomp | ⚠️ **LOW-DEMAND — regional/long-tail primary.** Same reasoning as airco advies; bare term is low-volume and bundled. Consider folding into the pillar if the planner prefers ≤1 advies page. [VERIFIED: SERP — "warmtepomp advies" mostly advisory sub-sections] |

### WTW sub-services (ventilation — niche but genuinely searched; dedicated competitor pages exist per slug)
| URL | Primary keyword | Intent | Secondary | Notes |
|-----|-----------------|--------|-----------|-------|
| `…/wtw/vervangen` | **wtw-unit vervangen** | transactioneel | wtw unit vervangen kosten, wtw vervangen Zoetermeer | Strong, specific buyer intent; competitors have exact-match pages. Trigger terms: unit >15 jr, lawaai, storingen. [VERIFIED: SERP — Feenstra/Alpha/Duro/Jansen/Lints all rank exact "wtw-unit vervangen" pages] |
| `…/wtw/onderhoud-reinigen` | **wtw onderhoud** | commercieel | wtw reinigen, wtw filter vervangen | Recurring maintenance; "reinigen" as secondary. (≈ every 2 yrs reiniging, every 4 yrs kanalen.) |
| `…/wtw/inregelen` | **wtw inregelen** ⚠️ | informationeel/transactioneel | wtw inregelen meetrapport, ventielen inregelen | ⚠️ **NICHE / LOW-VOLUME (WTW-only — no airco/MV equivalent).** Consistent but small demand; specialist term. Keep as its own page (competitors do, e.g. Alpha "inregelen + meetrapport") but **pair with a meetrapport/long-tail secondary** and don't expect head-term volume. [VERIFIED: SERP — dedicated but few "wtw inregelen" pages] |
| `…/wtw/storing` | **wtw storing** | transactioneel (urgent) | wtw unit maakt lawaai, wtw storing verhelpen | Breakdown intent; distinct from MV `storing` because keyword is "wtw" not "mechanische ventilatie". |
| `…/wtw/aanleggen` | **wtw unit aanleggen** | transactioneel | wtw installeren nieuwbouw, balansventilatie aanleggen | New-install intent (vs `vervangen` = replace existing). Distinguish in content: nieuwbouw/renovatie vs vervanging. |

### Mechanische Ventilatie sub-services
| URL | Primary keyword | Intent | Secondary | Notes |
|-----|-----------------|--------|-----------|-------|
| `…/mechanische-ventilatie/vervangen` | **mechanische ventilatie vervangen** | transactioneel | ventilatiebox vervangen, mv box vervangen | Replace existing MV box; distinct keyword from WTW `vervangen` (different system). |
| `…/mechanische-ventilatie/onderhoud-reinigen` | **mechanische ventilatie onderhoud** | commercieel | ventilatiekanalen reinigen, mv onderhoud | Recurring; "kanalen reinigen" is a strong searched secondary. [VERIFIED: SERP — ESNW/Zehnder/Energiewacht rank MV-onderhoud pages] |
| `…/mechanische-ventilatie/storing` | **mechanische ventilatie storing** | transactioneel (urgent) | ventilatie maakt lawaai, mv storing verhelpen | Breakdown; distinct from WTW storing. [VERIFIED: SERP — Alpha "storing-verhelpen", ESNW storing pages] |
| `…/mechanische-ventilatie/aanleggen` | **mechanische ventilatie aanleggen** | transactioneel | ventilatiesysteem aanleggen, mv installeren | New install (vs vervangen). ISDE €400 (2026) hook for CO2-gestuurde box in content (CONT-04). [VERIFIED: SERP + ISDE 2026 €400 rule] |

### Static pages (modeled in the registry per D-04; light keyword targets)
| URL | Primary keyword | Intent | Notes |
|-----|-----------------|--------|-------|
| `/` (home) | **klimaattechniek Zoetermeer** is owned by the hub → home should target a **brand+region** variant, e.g. **airco warmtepomp ventilatie Zoetermeer** | commercieel/navigationeel | Must NOT duplicate the hub's `klimaattechniek Zoetermeer`. Home = brand entry; hub = services overview. Planner picks a distinct head term. |
| `/tarieven` | **airco / ventilatie tarieven** (e.g. "airco onderhoud prijs") | commercieel | Pricing-intent term; keep distinct from service pages (pricing content stays in PricingTabs). |
| `/over-ons` | **TPS klimaattechniek** (brand) | navigationeel | Brand/about; no service keyword. |
| `/contact` | **TPS klimaattechniek contact** | navigationeel | — |
| `/privacy-beleid` | (noindex candidate — Phase 3) | — | Legal; typically excluded from sitemap/keyword targeting. Model with `status` and let Phase 3 decide indexing. |

### Cannibalization control summary
- **Each pillar (broad/category) vs its `installatie` sub (transactional "laten installeren")** — the four most likely collisions — are split by intent in the table above. This is the core anti-cannibalization design and the main reason research (not drafting) was required.
- **WTW `storing` vs MV `storing`** and **WTW `vervangen` vs MV `vervangen`** are distinct because the keyword carries the system name ("wtw" vs "mechanische ventilatie") — no collision.
- **`reparatie-storing` (Airco/WP) vs `storing` (WTW/MV)** differ by the leading product term — no collision.
- **Hub `klimaattechniek Zoetermeer` vs Home** — flagged: the planner must give home a *different* head term (suggested above) so the two don't collide (build error).
- **Three flagged low-demand pages** (`airco advies`, `warmtepomp advies`, `wtw inregelen`) take **regional/long-tail primaries** rather than competing for thin head terms — directly mitigating the Dec-2025 thin-content risk on the weakest pages.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Zod 3 `.nonempty()`, `ctx.path` (read), `formatError()` | Zod 4 `z.array().min(1)`, write-only `path` in `addIssue`, `z.prettifyError()`/`z.treeifyError()`, `.check()` API | Zod 4.0 (2025), latest 4.4.3 | Use v4 idioms; most online snippets are v3 and will mislead. [VERIFIED: zod v4 changelog] |
| Template/programmatic location pages (town-swapped) | One-intent-per-page, genuine local expertise, regio *signals* not city pages | Google Dec-2025 Core Update (rolled out 11–29 Dec 2025) | Directly validates this phase's design: one keyword/intent per URL, unique ≥120-word intro, no city pages, pricing kept separate. [VERIFIED: WebSearch — multiple Dec-2025 analyses] |
| Manufacturer-provided / duplicated descriptions | Unique, hands-on, results-demonstrating copy per page | Dec-2025 update ("manufacturer content used by multiple sellers lost visibility") | Justifies service-specific `steps` + `localAngle` per page (criterion 3). [VERIFIED: WebSearch] |
| ISDE for ventilation: unclear | **€400 ISDE from 2026** for CO2-gestuurde ventilatiebox **or** WTW-unit in existing homes, **with ≥1 insulation measure** | 2026 ISDE scheme | Content hook for MV/WTW `aanleggen` pages (CONT-04, Phase 4) — note now so the keyword/content angle is right. Airco gets **no** ISDE (anti-feature per REQUIREMENTS). [VERIFIED: WebSearch — multiple Dutch sources cite €400/2026/insulation condition] |

**Deprecated/outdated:**
- Zod 3 refinement patterns (see table). `superRefine` itself still works in v4 but `.check()` is the forward API; `superRefine` is sufficient and clearer for the uniqueness pass here.
- City/location pages as an SEO tactic for this site — deferred (BLOG-02) precisely because of the Dec-2025 signal.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The specific Dutch `primaryKeyword` strings and their relative-volume rankings in the Keyword Map | Keyword Map | **MEDIUM-HIGH.** Intent separation is verified from SERPs, but exact terms/volumes are not (web search exposes no volume). If a chosen head term has near-zero volume or a better synonym exists, that page targets the wrong query. **Mitigation:** validate the map in Google Keyword Planner/Ahrefs/SEMrush before Phase 4 content; the three ⚠️-flagged low-demand pages are the highest-risk. Keywords are editable data on each node, so correction is cheap. |
| A2 | `serviceAreas` seed list (Zoetermeer, Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden) | schema.org NAP / D-11 | MEDIUM. Listing an unserved town is a relevance/thin-content risk. **Mitigation:** owner reviews the list (already required by D-11); flag each town owner-confirm-pending. |
| A3 | `geo.lat/lng` for the business | schema.org NAP / D-12 | LOW (this phase) / MEDIUM (Phase 5 Maps pin). Today's Maps pin is a known placeholder (CONCERNS.md). **Mitigation:** model the field; mark value owner-verify-pending; Phase 5 QA-05 fixes the real pin. |
| A4 | `tsx` as the prebuild runner (name/version not slopchecked this session) | Standard Stack / Package Audit | LOW. Any TS runner works. **Mitigation:** planner runs slopcheck + `npm view tsx scripts.postinstall` at install; gate behind checkpoint if unavailable. |
| A5 | Dealer-status / `erkendInstallateur` flags model as `false` placeholders | Pattern 3 / D-06 | LOW (this phase). Values are explicitly owner-verified in Phase 4 (CONT-03). **Mitigation:** model as flags only; never render an unverified "erkend installateur" claim. |
| A6 | ISDE €400 (2026) ventilation subsidy details | State of the Art / CONT-04 | LOW (this phase — not output here). MEDIUM in Phase 4 if rendered inaccurately. **Mitigation:** Phase 4 sources/links the official RVO/ISDE page before publishing; airco gets no ISDE. |

**This table is non-empty — the Keyword Map (A1) is the key item needing tool-based validation before it becomes locked content.**

## Open Questions

1. **One `advies` page per pillar, or fold advies into the pillar page?**
   - What we know: "airco advies" / "warmtepomp advies" demand is low and competitors bundle it into broader advisory/pillar pages.
   - What's unclear: whether two thin `advies` pages clear the uniqueness bar and earn their keep, or whether they're better merged into the pillar (reducing the surface from ~27 to ~25).
   - Recommendation: model both `advies` nodes now (the roadmap commits to 17 subs), give them **regional long-tail primaries**, and let Phase 4 editorial decide whether to publish or merge. The `status` field makes "modeled but not published" free.

2. **Home vs hub head term.**
   - What we know: both naturally want "klimaattechniek Zoetermeer"; that's a build-error collision under D-13.
   - What's unclear: the exact distinct head term for home.
   - Recommendation: hub keeps `klimaattechniek Zoetermeer`; home takes a brand+service variant (e.g. "airco warmtepomp ventilatie Zoetermeer" or the brand name). Planner finalizes; uniqueness check will catch a mistake at build.

3. **Does `app/over-ons/page.tsx` need a SITE-sourced radius phrasing too?**
   - What we know: CONCERNS.md says it references an undefined "regio" (no numeric literal).
   - What's unclear: whether QA-03's "everywhere" includes adding the 60 km phrasing there.
   - Recommendation: during planning, grep `over-ons` for any radius/regio copy; if present, source it from `SITE.serviceRadiusKm` for consistency (criterion 4 says the inconsistency must be gone *anywhere*).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, tsx script | ✓ | v26.0.0 | — |
| npm | Install zod/tsx, run prebuild | ✓ | 11.12.1 | — |
| Next.js | `next build` (the gated build) | ✓ | 16.2.1 | — |
| TypeScript | Types + tsx execution | ✓ | 5.x | — |
| `zod` | Validation | ✗ (to be installed) | target 4.4.3 | none needed — `npm install zod` (slopcheck [OK]) |
| `tsx` | prebuild script runner | ✗ (to be installed) | latest | If undesired: validate at module-load via import in `app/sitemap.ts` (Phase 3) or a tiny compiled script; or use `node --experimental-strip-types` (Node 26 supports TS stripping) instead of tsx |
| slopcheck | Package legitimacy gate | ✓ | 0.6.1 | If absent at plan time: mark new pkgs [ASSUMED], gate behind checkpoint |
| Google Keyword Planner / Ahrefs / SEMrush | Validating A1 keyword volumes | ✗ (not in this env) | — | **No web-search fallback gives volume.** Owner/agency must validate the map in a keyword tool before Phase 4. This is the one genuine gap. |

**Missing dependencies with no fallback:**
- A keyword-volume tool (for A1). Web search verified *intent* but not *volume*. This does not block Phase 1 (modeling), but the keyword map should be tool-validated before Phase 4 content locks.

**Missing dependencies with fallback:**
- `zod` → install (clean, verified). `tsx` → install, or use Node 26's native `--experimental-strip-types`, or module-load validation.

## Validation Architecture

> nyquist_validation is ENABLED (`.planning/config.json` → `workflow.nyquist_validation: true`). This phase produces no UI and no runtime behavior, so "validation" = **build-time schema checks + static assertions over the data**, not browser tests.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None currently installed** (no jest/vitest/playwright — confirmed package.json). Primary validator for this phase is the **Zod build-time check**, which needs no test framework. A lightweight `tsx`-run assertion script (or `node:test` / `node:assert`, built into Node 26) covers the grep/structural assertions without adding a framework. |
| Config file | none — see Wave 0 |
| Quick run command | `npm run prebuild` (runs `tsx scripts/validate-taxonomy.ts` — the Zod gate) |
| Full suite command | `npm run build` (prebuild gate + `next build`; proves the whole thing compiles and pre-renders are unaffected) |

### Phase Requirements / Success Criteria → Test Map
| Criterion / Req | Behavior | Test Type | Automated Command | File Exists? |
|-----------------|----------|-----------|-------------------|-------------|
| **Crit 1 / IA-01** | nav + sitemap + JSON-LD read only `PAGES` (no parallel hardcoded route list) | structural assertion | a `node:test` / tsx script asserting: `PAGES.length === expected (~27)`; and a **grep test** that no service URL string is hardcoded outside `registry.ts` (e.g. `grep -rn "/diensten/" app components --include=*.tsx \| grep -v registry` returns only derived usages) | ❌ Wave 0 — `scripts/validate-taxonomy.ts` + a grep assertion |
| **Crit 2 / IA-09** | every URL has exactly one primary keyword/intent; no duplicate keyword across pages | Zod `superRefine` (build) | `npm run prebuild` (the cross-record uniqueness check throws on any duplicate `primaryKeyword` or URL) | ❌ Wave 0 — the `pagesSchema` uniqueness refinement |
| **Crit 3 / IA-08** | each page type has typed required fields; missing/short content on a `review`/`published` page is blocking; `draft` shells pass | Zod schema + status gate (build) | `npm run prebuild` (structure always; content rules gated by `status`). Add a negative fixture test: a deliberately-broken page (intro <120 words, status `published`) makes `prebuild` exit non-zero | ❌ Wave 0 — `contentShellSchema` + `publishedContentSchema` + a negative-case assertion |
| **Crit 4 / QA-03** | the "50km"/"100 km" literals are gone; radius reads from `SITE` | grep assertion | `grep -rn "straal van 50\|straal van 100\|100 km\|50km" app components` returns **nothing**; and `SITE.serviceRadiusKm === 60` | ❌ Wave 0 — a grep assertion in the validate script (or CI) |
| **Crit 5 / SEO-08** | NAP (name, address, phone, service area) resolves from one `SITE` source with the full structured field set | structural assertion + tsc | tsc compiles the extended `SITE` (strict); a `node:test` asserts presence of `name, address, postcode, city, province, country, geo.lat, geo.lng, serviceRadiusKm, serviceAreas[]` | ❌ Wave 0 — a `SITE`-shape assertion |

### Sampling Rate
- **Per task commit:** `npm run prebuild` (the Zod gate — sub-second, runs the full validateTaxonomy + uniqueness + status-gated content checks)
- **Per wave merge:** `npm run build` (prebuild + `next build` — proves static export still succeeds and no route/pre-render regressed)
- **Phase gate:** `npm run build` green (taxonomy validates AND the site still builds) before `/gsd-verify-work`; plus the four grep/structural assertions pass.

### Wave 0 Gaps
- [ ] `scripts/validate-taxonomy.ts` — the build-blocking entry point (imports `PAGES`, runs `pagesSchema.safeParse`, prints `z.prettifyError`, `process.exit(1)`) — covers Crit 2 & 3
- [ ] `lib/services/types.ts` — `contentShellSchema`, `publishedContentSchema`, `pagesSchema` (with the cross-record uniqueness `superRefine`) — the validators themselves
- [ ] A **negative fixture / assertion** proving a broken page (duplicate keyword OR <120-word published intro) actually fails the build — without this, "blocking" is unverified (Crit 2 & 3)
- [ ] A **grep assertion** for the radius literals (Crit 4) and the no-parallel-route-list check (Crit 1) — runnable in the validate script or as a `node:test`
- [ ] A **`SITE`-shape assertion** for the full NAP field set (Crit 5)
- [ ] `package.json` — add `"prebuild": "tsx scripts/validate-taxonomy.ts"` and `tsx` devDependency
- [ ] (No test framework install required — Node 26's built-in `node:test`/`node:assert` + the Zod gate suffice; do **not** add jest/vitest, that's out of scope per REQUIREMENTS "no test infrastructure" for this milestone)

*Note: REQUIREMENTS explicitly excludes building test infrastructure this milestone. The validation here is the **Zod build gate + a few assertion scripts**, which satisfy nyquist validation without standing up a test framework.*

## Security Domain

> `security_enforcement: true`, `security_asvs_level: 1`, `security_block_on: high`. This phase ships **no runtime code, no inputs, no auth, no network calls** — it is build-time TS data + a build script. ASVS surface is therefore minimal; the relevant control is supply-chain (the two new packages).

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth in this phase (none in the project). |
| V3 Session Management | no | No sessions (static site). |
| V4 Access Control | no | No protected resources. |
| V5 Input Validation | **partially (build-time only)** | Zod validates the *taxonomy data* at build. No **user** input is processed this phase. (User-input validation — the form — is Phase 5 QA-02, which **reuses this same `zod`**.) |
| V6 Cryptography | no | No crypto, no secrets introduced (the webhook secret is Phase 5). |
| **V14 Dependency / Supply-chain** | **yes** | Vet `zod` + `tsx` before install: slopcheck (`zod` [OK]; `tsx` pending), `npm view <pkg> scripts.postinstall` (zod = none), pin via lockfile (lockfileVersion 3 present). |

### Known Threat Patterns for {static TS data + build script}
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Slopsquatted / malicious npm dependency | Tampering / Elevation | slopcheck + registry+repo verification + postinstall inspection (done for zod; planner does tsx). [VERIFIED: zod [OK], no postinstall] |
| Malicious `postinstall` on a new dep | Elevation of Privilege | `npm view <pkg> scripts.postinstall` before install; `zod` has none. Run install in the normal sandbox. |
| Build script reads outside project / exfiltrates | Information Disclosure | `scripts/validate-taxonomy.ts` only imports local `@/lib` and prints to stdout; no network, no fs writes outside project. Review the script in code review (`code_review: true`). |
| Over-claiming credentials in data (e.g. `erkendInstallateur: true` unverified) | (Trust/Repudiation, not classic STRIDE) | Model dealer/cert flags as `false` placeholders; owner-verify in Phase 4 (CONT-03/CONT-06). Never render an unverified claim. |

**No HIGH-severity security items block this phase** (the `security_block_on: high` gate is satisfied): the only attack surface is the two new build-time dependencies, one of which (`zod`) is verified clean and the other (`tsx`) the planner gates at install.

## Sources

### Primary (HIGH confidence)
- **zod.dev** — `/api` (refinements, `.refine`/`.superRefine`/`.check`, array `.min`/`.max`, `path` option), `/v4/changelog` (v3→v4 breaking changes, `.nonempty()`→`.array().min(1)`, `ctx.path` removal), `/error-formatting` (`z.prettifyError`, `z.treeifyError`, `z.flattenError`)
- **npm registry** — `npm view zod` → version 4.4.3, created 2020-03-07, modified 2026-05-04, MIT, deps: none, no `postinstall`, repo github.com/colinhacks/zod
- **slopcheck 0.6.1** — `slopcheck install zod` → [OK]
- **schema.org** — `/GeoCircle`, `/geoRadius` (metres), `/areaServed`, `/Service` (HVACBusiness ⊂ LocalBusiness field shapes)
- **Next.js docs** — `/docs/app/guides/static-exports`, `/docs/app/api-reference/functions/generate-static-params` (static-export build-fail behavior; `dynamicParams=false`)
- **Project codebase** — `lib/constants.ts`, `next.config.ts`, `package.json`, grep of `"straal van"` (confirmed exact radius strings), `.planning/codebase/{ARCHITECTURE,CONVENTIONS,STRUCTURE,CONCERNS}.md`, `.planning/{PROJECT,REQUIREMENTS,ROADMAP,STATE}.md`, `01-CONTEXT.md`

### Secondary (MEDIUM confidence — verified against ≥1 authoritative source)
- **Live Dutch SERPs (WebSearch, 2026-06-02)** — intent classification for every keyword. Competing service pages observed: Feenstra, Alpha Ventilatie, Verkeyn, Duro Techniek, VDL Techniek, Jansen Ventilatie, Lints Ventilatie (WTW); ESNW, Zehnder, Energiewacht, Bol-Vermeulen (MV); HORNBACH, Hoppenbrouwers, KliMate, Kemkens (airco install); AircoExpert24, Hartman, Mirkinstallatie (airco storing/spoed); Remeha, Nefit Bosch, Frank Energie, Slimster (warmtepomp onderhoud); Warmtepomp Nederland, Klimaat Techniek Nederland, AircoProfs (advies)
- **Dec-2025 Core Update analyses (WebSearch)** — ALM Corp, Growing Search, Think Little Big, Raptive, Search Engine Roundtable (thin-content/programmatic/location-page penalties; "do one job exceptionally well")
- **npm-scripts run order** — `pre<script>` precedes `<script>`; non-zero exit halts the chain (verified via Next.js build discussions + npm docs)
- **zod v4 error-formatting helpers are v4-only** — zod GitHub issues #4213, #4268

### Tertiary (LOW confidence — flagged for validation)
- **Absolute keyword search volumes** — NOT obtained (web search exposes none). All `primaryKeyword` strings are `[ASSUMED]` (Assumptions Log A1); validate in Google Keyword Planner / Ahrefs / SEMrush before Phase 4.
- **ISDE €400 / 2026 ventilation subsidy specifics** — multiple Dutch sources concur, but Phase 4 must confirm against the official RVO/ISDE page before publishing (A6).
- **`tsx` legitimacy** — not slopchecked this session (A4); planner verifies at install.

## Metadata

**Confidence breakdown:**
- Standard stack (zod 4 / tsx): **HIGH** — zod version, age, repo, postinstall, and slopcheck all verified; API confirmed against zod.dev.
- Architecture (discriminated union, `urlFor`, prebuild gate): **HIGH** — idiomatic TS + verified npm-scripts/Next.js build behavior; matches project conventions.
- schema.org NAP modeling: **HIGH** — fields confirmed against schema.org.
- Validation architecture: **HIGH** — Zod-as-build-gate is verified; assertion approach uses Node 26 built-ins (no new framework).
- Keyword map — **intent: HIGH**, **volume/exact-term: LOW** — SERP-verified intent and competing pages; absolute volumes unverifiable without a paid tool (A1).
- Pitfalls: **HIGH** — each is grounded in a verified source (Dec-2025 update, zod v4 changelog, codebase constraints).

**Research date:** 2026-06-02
**Valid until:** Stack/zod/schema.org/Next.js findings ≈ 30 days (stable). Keyword map should be tool-validated before Phase 4 regardless of age. Dec-2025 update guidance is current and stable.
