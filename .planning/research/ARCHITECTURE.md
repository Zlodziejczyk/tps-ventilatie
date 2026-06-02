# Architecture Research

**Domain:** Taxonomy-driven local-service marketing site + SEO infrastructure on Next.js 16 App Router (`output: "export"`)
**Researched:** 2026-06-02
**Confidence:** HIGH (route/sitemap/MDX mechanics verified against official Next.js 16.2.7 docs, dated 2026-06-01; thin-content guidance is established SEO practice + MEDIUM-confidence community consensus)

> Scope note: This researches **how to architect the NEW work** (taxonomy service-page system + SEO infra + light MDX blog + the form security boundary). The existing system — server components default, client islands, `lib/constants.ts` as single source of truth, `output: "export"` — is already mapped in `.planning/codebase/ARCHITECTURE.md` and is **extended, not re-litigated**. The one open existing decision this research closes is the static-export-vs-hybrid form boundary (see Integration Points).

---

## The Central Constraint (read this first)

Everything below is shaped by one hard fact, verified against the official static-export guide:

**Under `output: "export"`, every dynamic route MUST enumerate all its params at build time and set `dynamicParams = false`.** `dynamicParams: true` and "dynamic route without `generateStaticParams`" are explicitly listed as *unsupported*. There is no on-demand rendering, no ISR, no runtime fallback.

This is not a limitation to work around — it is a **perfect fit** for a finite, known taxonomy of ~20-30 service pages. The taxonomy IS the param source. You define the tree once; `generateStaticParams` walks it; Next.js emits one static `.html` per node. The same constraint, however, makes the secure form route impossible without leaving `output: "export"` (see Integration Points → External Services).

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                       DATA / TAXONOMY LAYER  (lib/)                    │
│                  the single source of truth — no JSX                  │
│  ┌────────────────────┐  ┌───────────────────┐  ┌─────────────────┐  │
│  │ lib/services/      │  │ lib/services/      │  │ lib/services/   │  │
│  │   taxonomy.ts      │  │   content/*.ts     │  │   brands.ts     │  │
│  │ (tree: pillar →    │  │ (per-page unique   │  │ (Daikin, Mits-  │  │
│  │  sub → brand;      │  │  copy, FAQs,       │  │  ubishi E/H/    │  │
│  │  slugs, relations) │  │  steps, USPs)      │  │  Ecodan specs)  │  │
│  └─────────┬──────────┘  └─────────┬─────────┘  └────────┬────────┘  │
│            │   typed via lib/services/types.ts            │           │
└────────────┼─────────────────────┼──────────────────────┼───────────┘
             │ generateStaticParams │ getServiceBySlug()   │
             ▼                      ▼                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    ROUTE / TEMPLATE LAYER  (app/diensten/)            │
│  app/diensten/page.tsx            → hub (4 pillar cards)              │
│  app/diensten/[pillar]/page.tsx   → pillar template (lists subs)     │
│  app/diensten/[pillar]/[service]/page.tsx → sub-service template     │
│       └─ generateStaticParams() enumerates the whole tree            │
│       └─ generateMetadata() per node   └─ dynamicParams = false      │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ composes
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER  (components/service/, components/seo/)│
│  ServiceHero  ServiceSteps  ServiceFAQ  BrandGrid  RelatedServices    │
│  Breadcrumbs                                                          │
│  ── SEO components (render-only, no styling) ──                       │
│  JsonLd  (LocalBusiness | Service | BreadcrumbList | FAQPage)         │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │ reuses existing chrome: CTABanner, AnimateOnScroll, Icon,    │    │
│  │ StaggerChildren, ContactForm, Navbar, Footer (unchanged)     │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
                             ▲ ▲
        build-time emits ────┘ └──── build-time emits
┌────────────────────────────┐  ┌──────────────────────────────────────┐
│  app/sitemap.ts            │  │  light MDX content (blog / FAQ)       │
│  app/robots.ts             │  │  content/blog/*.mdx + gray-matter     │
│  → static /sitemap.xml,    │  │  app/blog/[slug]/page.tsx             │
│    /robots.txt in out/     │  │  (dynamic import + generateStaticParams)│
│  (import same taxonomy)    │  │                                       │
└────────────────────────────┘  └──────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `lib/services/taxonomy.ts` | The tree: pillars → sub-services → brand relations. Slugs, parent/child links, which brands apply. **Structure only, minimal copy.** | A typed const array/object. The skeleton that `generateStaticParams` and `sitemap.ts` both read. |
| `lib/services/content/*.ts` | Per-page **unique** content: intro prose, process steps, FAQ Q&A, local angle, price note. One file per pillar keeps files small. | Typed records keyed by service slug. This is where thin-content is defeated — every node carries hand-written Dutch copy. |
| `lib/services/brands.ts` | Brand facts (Daikin, Mitsubishi Electric/Heavy, Ecodan): model lines, strengths, install specifics. | Typed const; referenced by both climate pillars to inject brand-specific paragraphs. |
| `lib/services/types.ts` | `Pillar`, `SubService`, `Brand`, `ServicePageData` types + `getServiceBySlug`, `getAllServiceParams`, `getSiblings` accessors. | Pure TS. The contract between data and templates. |
| `app/diensten/page.tsx` | Hub. Server component. Lists 4 pillars, light intro. | Reads taxonomy top level; renders `PillarCard` grid. |
| `app/diensten/[pillar]/page.tsx` | Pillar template. Lists that pillar's sub-services + brand grid. | `generateStaticParams` → 4 pillars; `generateMetadata` per pillar. |
| `app/diensten/[pillar]/[service]/page.tsx` | Sub-service template — the workhorse (~20+ pages). | `generateStaticParams` enumerates **all** pillar×service pairs; `generateMetadata` per node; renders from `content/*.ts`. |
| `components/service/*` | Template building blocks: `ServiceHero`, `ServiceSteps`, `ServiceFAQ`, `BrandGrid`, `RelatedServices`, `Breadcrumbs`. Server components where possible. | Presentational; data passed as props. No data fetching inside. |
| `components/seo/JsonLd.tsx` | Renders one `<script type="application/ld+json">`. Variant builders for LocalBusiness / Service / BreadcrumbList / FAQPage. | Server component — serializes object to a script tag into static HTML. Zero client JS. |
| `app/sitemap.ts` | Programmatic sitemap. Imports taxonomy + MDX list → URL array. | Static Route Handler; emits `out/sitemap.xml` at build. |
| `app/robots.ts` | Robots rules + sitemap pointer. | Static Route Handler; emits `out/robots.txt`. |
| `content/blog/*.mdx` + `app/blog/[slug]/page.tsx` | Light blog/FAQ. MDX files read at build via `gray-matter` for frontmatter; dynamic-imported into a `[slug]` template. | `@next/mdx` + `gray-matter`; `generateStaticParams` from a build-time file glob; `dynamicParams = false`. |

---

## Recommended Project Structure

```
app/
├── diensten/
│   ├── page.tsx                       # hub: 4 pillar cards + intro
│   ├── [pillar]/
│   │   ├── page.tsx                   # pillar template (lists subs + brands)
│   │   └── [service]/
│   │       └── page.tsx               # sub-service template (the 20+ pages)
│   └── _components/                   # (optional) diensten-only bits not reused
├── blog/
│   ├── page.tsx                       # blog index (reads frontmatter list)
│   └── [slug]/
│       └── page.tsx                   # MDX renderer via dynamic import
├── sitemap.ts                         # programmatic, imports taxonomy
├── robots.ts                          # static rules + sitemap URL
└── layout.tsx                         # (existing) + site-wide JSON-LD WebSite/LocalBusiness

components/
├── service/                           # NEW — reusable service-template parts
│   ├── ServiceHero.tsx
│   ├── ServiceSteps.tsx
│   ├── ServiceFAQ.tsx                 # also emits FAQPage JSON-LD
│   ├── BrandGrid.tsx
│   ├── RelatedServices.tsx            # internal-linking engine
│   ├── Breadcrumbs.tsx                # visual + drives BreadcrumbList JSON-LD
│   └── PillarCard.tsx
├── seo/                               # NEW — render-only structured data
│   ├── JsonLd.tsx                     # generic <script> serializer
│   └── schema.ts                      # builders: localBusiness(), service(), breadcrumb(), faqPage()
└── (existing chrome unchanged: Navbar, Footer, CTABanner, Icon, AnimateOnScroll, …)

lib/
├── services/                          # NEW — the taxonomy + content model
│   ├── taxonomy.ts                    # the tree (structure, slugs, relations)
│   ├── types.ts                       # types + accessors (getServiceBySlug, getAllServiceParams)
│   ├── brands.ts                      # Daikin / Mitsubishi E,H / Ecodan facts
│   └── content/
│       ├── airconditioning.ts         # per-sub-service unique copy + FAQs
│       ├── warmtepompen.ts
│       ├── wtw.ts
│       └── mechanische-ventilatie.ts
├── blog.ts                            # NEW — getAllPosts(), getPostBySlug() (gray-matter + fs)
├── seo.ts                             # NEW — site constants: BASE_URL, default OG, geo coords
└── constants.ts                       # (existing) SITE, NAV_LINKS — extend dropdowns from taxonomy

content/
└── blog/
    ├── waarom-wtw-onderhoud.mdx       # frontmatter: title, description, date, pillar
    └── …

mdx-components.tsx                     # NEW (root) — required by @next/mdx; maps prose styles
```

### Structure Rationale

- **`lib/services/` (data) is physically separate from `app/diensten/` (templates).** This is the single most important boundary and the direct antidote to the existing `CONCERNS.md` anti-pattern where `app/diensten/page.tsx` mixes 400 lines of inline data arrays (`AIRCO_CARDS`, `MV_BENEFITS`…) with JSX. Templates import data; they never define it. Owner content edits happen in `lib/services/content/*.ts`, never inside JSX.
- **Split content by pillar (`content/airconditioning.ts`, …), not one mega-file.** Honors the project rule "many small files > few large files" (target 200-400 lines) and prevents recreating the 620-line `PricingTabs` monolith for content.
- **`taxonomy.ts` (skeleton) is separate from `content/*.ts` (flesh).** `sitemap.ts` and `generateStaticParams` only need the lightweight tree; they should not import every paragraph of prose. Keeps the build graph clean and makes "what pages exist?" answerable in one file.
- **`components/seo/` is render-only, design-system-agnostic.** JSON-LD has no visual output, so it lives apart from `components/service/` (which is styled). This also means SEO components carry **zero** "Atmospheric Clarity" coupling and add **zero** client JS.
- **`components/service/` mirrors the existing `app/page-sections/` philosophy but promoted to reusable** — because, unlike home sections, these parts render across 20+ pages. (Per `STRUCTURE.md`: "Anything reused across multiple pages belongs in `components/`.")
- **`lib/constants.ts` dropdowns derived from taxonomy.** The Navbar `DIENSTEN_DROPDOWN` should be generated from `taxonomy.ts` (or at least kept in lockstep) so nav never drifts from the actual page set — eliminating a whole class of the duplication bugs flagged in `CONCERNS.md`.

---

## Architectural Patterns

### Pattern 1: Taxonomy-as-data-source with nested `generateStaticParams` (the core pattern)

**What:** A two-segment dynamic route `app/diensten/[pillar]/[service]/`. The **leaf** `page.tsx` enumerates the entire tree bottom-up, returning every `{ pillar, service }` pair. Verified mechanic (Next.js 16 docs): *"`app/products/[category]/[product]/page.js` can generate params for **both** `[category]` and `[product]`."*

**When to use:** Finite, known taxonomy where all pages are buildable at deploy time. Exactly this project.

**Trade-offs:**
- (+) One template generates N pages. Add a service to `taxonomy.ts` → a new SEO page appears on next build. No new files.
- (+) Builds zero-config under `output: "export"` once `dynamicParams = false`.
- (−) Adding a page requires a redeploy (acceptable — content is in-repo by decision, no CMS).
- (−) All variants share a template, so **content uniqueness must be enforced by data, not layout** (see Pattern 4).

**Example:**
```tsx
// app/diensten/[pillar]/[service]/page.tsx
import { getAllServiceParams, getServiceBySlug } from "@/lib/services/types";

export const dynamicParams = false; // REQUIRED for output: "export"

export function generateStaticParams() {
  // bottom-up: returns [{ pillar: "airconditioning", service: "installatie" }, ...]
  return getAllServiceParams();
}

export async function generateMetadata({ params }) {
  const { pillar, service } = await params;          // params is a Promise in Next 16
  const data = getServiceBySlug(pillar, service);
  return { title: data.metaTitle, description: data.metaDescription,
           alternates: { canonical: `/diensten/${pillar}/${service}` } };
}

export default async function ServicePage({ params }) {
  const { pillar, service } = await params;
  const data = getServiceBySlug(pillar, service);    // pulls unique copy + FAQs
  // compose ServiceHero / ServiceSteps / BrandGrid / ServiceFAQ / RelatedServices
}
```

> **Alternative considered — flat `[...slug]` catch-all:** Could collapse hub/pillar/service into one `app/diensten/[[...slug]]`. **Rejected:** loses per-level template clarity, makes `generateMetadata` branch on slug length, and complicates breadcrumb logic. Two explicit nested segments is more maintainable for a fixed 3-level depth.

> **Top-down alternative (valid too):** put `generateStaticParams` for `[pillar]` in `app/diensten/[pillar]/layout.tsx` and only `[service]` in the leaf. Use this **if** you add a shared pillar layout (e.g., a pillar-wide sidebar). For now, bottom-up from the leaf is simpler — fewer files.

### Pattern 2: SEO components as pure render-only server components

**What:** JSON-LD is injected by rendering `<script type="application/ld+json">{JSON.stringify(schema)}</script>` from a **server component**. It serializes straight into the static HTML at build — no client hydration, no `next-seo` dependency needed. Confirmed as the current official Next.js recommendation.

**When to use:** Every page that wants rich results. Per-page `Service` + `BreadcrumbList` (+ `FAQPage` where FAQs exist); site-wide `LocalBusiness`/`WebSite` once in `app/layout.tsx`.

**Trade-offs:**
- (+) Zero runtime cost, zero client JS, no hydration-mismatch risk (server-only render avoids the double-injection problem that plagues client-component JSON-LD).
- (+) Schema builders are plain functions → trivially unit-testable, type-safe.
- (−) You hand-build schema objects (or add a tiny helper). Acceptable; avoids a dependency.

**Example:**
```tsx
// components/seo/JsonLd.tsx  (server component)
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
// components/seo/schema.ts
export const service = (d) => ({ "@context": "https://schema.org", "@type": "Service",
  name: d.h1, areaServed: { "@type": "City", name: "Zoetermeer" },
  provider: { "@type": "LocalBusiness", name: SITE.name }, /* … */ });
```

> Security note (matches global rules): JSON-LD content here is **build-time, author-controlled** Dutch copy from `lib/`, never user input — so `dangerouslySetInnerHTML` is safe in this context. Never feed form/user data into it.

### Pattern 3: Programmatic sitemap/robots from the same taxonomy

**What:** `app/sitemap.ts` exports a default function returning a `MetadataRoute.Sitemap` array, built by mapping over `taxonomy.ts` (+ static pages + MDX slugs). `app/robots.ts` returns rules + the sitemap URL. Both are **static Route Handlers** — verified: *"Route Handlers will render a static response when running `next build`"* (GET-only, no `Request` access) — so they emit `out/sitemap.xml` and `out/robots.txt` cleanly under `output: "export"`.

**When to use:** Always, for this project. Single source means a new service page is auto-listed in the sitemap.

**Trade-offs:**
- (+) Sitemap can never drift from the page set — both read one tree.
- (−) `lastModified` must be sourced from data (e.g., a `updated` field per content record), since there's no git/runtime mtime at static-build time. Hardcode-or-omit is fine for launch.

**Example:**
```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllServiceParams } from "@/lib/services/types";
import { BASE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const services = getAllServiceParams().map(({ pillar, service }) => ({
    url: `${BASE_URL}/diensten/${pillar}/${service}`,
    changeFrequency: "monthly" as const, priority: 0.8,
  }));
  const statics = ["", "/diensten", "/tarieven", "/over-ons", "/contact", "/blog"]
    .map((p) => ({ url: `${BASE_URL}${p}`, priority: p === "" ? 1 : 0.7 }));
  return [...statics, ...services];
}
```

### Pattern 4: Anti-thin-content by construction (the differentiator)

**What:** Because 20+ pages share one template, Google's "thin/duplicate content" risk is real and is the #1 failure mode of programmatic SEO. The defense is **structural**: the template renders *slots*, and the **data model makes unique content mandatory** to fill them. A page with empty unique copy should look obviously broken in review.

**When to use:** Every templated service page. This is non-negotiable for the SEO goal.

**Trade-offs:**
- (+) Pages are genuinely distinct → indexable, rankable.
- (−) Real human (Claude-drafted, owner-reviewed) Dutch copy must exist for each node. This is content work, not code — and it gates launch quality, not the build.

**How (concrete tactics, each enforced by a typed field):**
1. **Required unique intro** — `content.intro: string` (≥ ~120 words). Per sub-service, hand-written. No shared boilerplate paragraph.
2. **Service-specific process steps** — `content.steps: Step[]`. "Installatie" steps ≠ "Onderhoud" steps ≠ "Reparatie & Storing" steps.
3. **Unique FAQ set per page** — `content.faqs: {q,a}[]` (3-6 each). Doubles as `FAQPage` JSON-LD. Different questions per service/brand.
4. **Brand-specific paragraphs** — pull from `brands.ts` so Daikin vs Mitsubishi Heavy pages read differently even for the same sub-service.
5. **Local angle** — weave Zoetermeer + regio (Pijnacker, Nootdorp, Berkel…) and a "service-area" line varied per page; ties to `LocalBusiness`/`areaServed`.
6. **Differentiated metadata** — `metaTitle`/`metaDescription` per node (template helper allowed, but body must vary), each with a self-canonical.
7. **Internal-linking via `RelatedServices`** — each page links to siblings (same pillar) + parent pillar + 1-2 cross-pillar relevant pages, with **descriptive Dutch anchor text** (not "lees meer"). This builds topical clusters and distributes link equity. Breadcrumbs add another internal-link layer.
8. **No accidental duplicate pages** — ensure exactly one URL per concept; set `alternates.canonical` on every page; keep `trailingSlash` consistent so `/x` and `/x/` don't both index.

> Rule of thumb: if you could swap two pages' `<h1>` and a reader wouldn't notice, the content is thin. The data model should make that impossible.

### Pattern 5: Light MDX blog/FAQ via dynamic import (static-export-safe)

**What:** `@next/mdx` + `gray-matter`. MDX files in `content/blog/`. A `app/blog/[slug]/page.tsx` reads the directory at build (`fs` + `gray-matter`, server-only), `generateStaticParams` returns the slugs, and the page `await import("@/content/${slug}.mdx")` renders it. `dynamicParams = false`. Verified working with `output: "export"`.

**When to use:** The "light blog / FAQ for SEO + trust" requirement. Don't over-build a CMS (out of scope by decision).

**Trade-offs:**
- (+) Authoring is plain Markdown; React components embeddable (e.g., a `<CTABanner/>` mid-post).
- (+) Frontmatter (`title`, `description`, `date`, `pillar`) powers the blog index list and per-post metadata.
- (−) `@next/mdx` doesn't parse frontmatter natively → add `gray-matter` (or `remark-frontmatter`). One small dep.
- (−) `fs`/glob only run server-side at build (fine here).

**Example:**
```tsx
// app/blog/[slug]/page.tsx
export const dynamicParams = false;
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug })); // lib/blog.ts: fs + gray-matter
}
export default async function Post({ params }) {
  const { slug } = await params;
  const { default: Content } = await import(`@/content/blog/${slug}.mdx`);
  return <article className="prose">{<Content />}</article>;
}
```
Required wiring: `pageExtensions: ["ts","tsx","md","mdx"]` in `next.config`, root `mdx-components.tsx`, and (because remark/rehype are ESM) keep config as `next.config.ts`/`.mjs`.

---

## Data Flow

### Build-time generation flow (the important one — this is a static site)

```
next build
   │
   ├─ generateStaticParams (leaf service page)
   │     reads lib/services/taxonomy.ts ──► [{pillar,service} × ~20+]
   │
   ├─ for each param: render ServicePage (server component)
   │     getServiceBySlug() ──► lib/services/content/*.ts + brands.ts
   │        ├─ ServiceHero / ServiceSteps / BrandGrid / ServiceFAQ / RelatedServices
   │        └─ JsonLd(service) + JsonLd(breadcrumb) + JsonLd(faqPage)
   │     ──► out/diensten/<pillar>/<service>.html   (fully static, SEO-ready)
   │
   ├─ app/sitemap.ts   reads same taxonomy ──► out/sitemap.xml
   ├─ app/robots.ts                          ──► out/robots.txt
   │
   └─ app/blog/[slug]  reads content/blog/*.mdx (fs+gray-matter) ──► out/blog/<slug>.html
```

### Runtime flow (client) — minimal by design

```
Browser loads static HTML (already contains copy + JSON-LD)
   │
   ├─ Client islands hydrate: Navbar dropdown, MobileMenu, ContactForm,
   │     AnimateOnScroll, ReviewCarousel, SoftAurora  (unchanged existing)
   │
   └─ ContactForm submit ─► see Integration Points (the one network call)
```

### Key Data Flows

1. **Taxonomy → pages:** one tree drives route generation, page content, nav dropdowns, and sitemap. Change the tree once; everything follows.
2. **Content record → page + JSON-LD + FAQ:** a single `ServicePageData` record feeds the visual template *and* the structured data — FAQs render as accordion UI **and** `FAQPage` schema from the same array (write once).
3. **Internal links:** `RelatedServices` + `Breadcrumbs` compute links from taxonomy relations, producing the topical-cluster link graph SEO needs.

---

## Scaling Considerations

This is a brochure/lead site; "scale" means **page count and build time**, not concurrent users (static files on Vercel CDN handle traffic trivially).

| Scale | Architecture adjustments |
|-------|--------------------------|
| ~20-40 pages (this milestone) | Single `sitemap.ts`, one taxonomy file, content split by pillar. Build is seconds. No special handling. |
| ~100-500 pages (add cities × services later) | If you templatize per-city (e.g., `[pillar]/[service]/[city]`), watch the **thin-content multiplier** — city pages need real local differentiation or Google treats them as doorway pages. Keep one sitemap until ~10k URLs. |
| 10k+ URLs | Split sitemaps via `generateSitemaps` (Google's 50k/file limit). Not remotely needed here; noted for completeness. |

### Scaling Priorities

1. **First "bottleneck" is editorial, not technical:** the constraint is *writing unique copy per page*, not generating them. The architecture deliberately front-loads this (typed required fields) so quality is visible in review.
2. **Build time:** trivial at this scale. Only relevant if a future city-expansion pushes hundreds of MDX imports — then consider precompiling a content index.

---

## Anti-Patterns

### Anti-Pattern 1: Inline data arrays inside page/template JSX

**What people do:** Define `const AIRCO_CARDS = [...]`, `const STEPS = [...]` at the top of `page.tsx` (exactly what `app/diensten/page.tsx` does today — 400 lines).
**Why it's wrong:** Couples content to layout, blocks reuse across the 20+ pages, makes owner content edits require reading JSX, and is precisely the tech-debt `CONCERNS.md` flags. At 20+ pages it compounds into an unmaintainable mess.
**Do this instead:** All content in `lib/services/content/*.ts`, typed. Templates are layout-only and receive data as props.

### Anti-Pattern 2: One mega service-data file

**What people do:** Put the entire taxonomy + all copy + all FAQs in a single `lib/services.ts`.
**Why it's wrong:** Recreates the 620-line `PricingTabs` monolith problem; merge-conflict magnet; violates the 200-400-line file norm.
**Do this instead:** `taxonomy.ts` (skeleton) + `content/<pillar>.ts` (one per pillar) + `brands.ts` + `types.ts`. Small, cohesive, navigable.

### Anti-Pattern 3: Shipping templated pages with shared/boilerplate body copy

**What people do:** Reuse the same intro paragraph and FAQ set across every sub-service, swapping only the service name.
**Why it's wrong:** Google's duplicate/thin-content and doorway-page detection demotes or de-indexes the whole cluster — actively harming the SEO goal the project exists for.
**Do this instead:** Enforce unique `intro`, `steps`, and `faqs` per node via required typed fields (Pattern 4). Treat "two pages indistinguishable but for the H1" as a launch blocker.

### Anti-Pattern 4: Forgetting `dynamicParams = false` (or expecting fallback)

**What people do:** Add a dynamic route, ship to `output: "export"`, assume unlisted slugs render on demand.
**Why it's wrong:** Unsupported under static export — build errors or silently missing pages. There is no runtime to render the fallback.
**Do this instead:** Every dynamic segment: `export const dynamicParams = false;` + exhaustive `generateStaticParams`. A 404 for an unknown slug is the correct, intended behavior.

### Anti-Pattern 5: JSON-LD in a client component

**What people do:** Render structured data from a `"use client"` component.
**Why it's wrong:** Causes double-injection on hydration (server HTML + client re-render) and ships needless JS. A known foot-gun.
**Do this instead:** Render `<script type="application/ld+json">` from a **server** component (default). It bakes into static HTML once. (Also keeps it off the `"use client"` bundle per the existing architecture's boundary rule.)

### Anti-Pattern 6: Vanity catch-all route that swallows the whole `/diensten` tree

**What people do:** `app/diensten/[[...slug]]/page.tsx` to "handle everything."
**Why it's wrong:** Forces length-based branching in `generateMetadata`/render, tangles breadcrumbs, and obscures which pages exist. Fixed 3-level depth doesn't need it.
**Do this instead:** Explicit `[pillar]` and `[pillar]/[service]` segments. Clear, typed, greppable.

---

## Integration Points

### External Services

| Service | Integration pattern | Notes |
|---------|---------------------|-------|
| **GoHighLevel webhook (lead form)** | **DECISION REQUIRED — binary, no middle ground.** See below. | The project's flagged open decision. |
| **Google Search Console** | Submit `out/sitemap.xml` URL post-deploy. | Programmatic sitemap (Pattern 3) makes this one-and-done. |
| **GA4 / Vercel Analytics** | Client `<Script>` in `layout.tsx`; or Vercel Analytics package. | Vercel Analytics works on static export; GA4 via `next/script` afterInteractive. |
| **MDX content (`@next/mdx`)** | Build-time, local files. | Not a runtime service; sources from `content/blog/`. |

**The form decision — static-export vs hybrid (closing the open question):**

The static-export guide is explicit: under `output: "export"`, **Route Handlers that rely on `Request` are unsupported, and Server Actions are unsupported.** A secure server-side proxy *requires* reading the incoming request body server-side. Therefore:

> **You cannot have both a true secure server-side form route AND `output: "export"`. It is binary.**

- **Option A — Keep `output: "export"` (recommended for this milestone).** Form stays client→GHL webhook. Mitigate the exposed-webhook risk (per `CONCERNS.md`) *within* static constraints: **honeypot field + timing check + Zod validation client-side + GHL-side rate limiting**. The webhook URL is still public, but spam surface is reduced. Owner notification (the actual requirement) works today. **Lowest change, keeps every benefit of full static.** The `NEXT_PUBLIC_` exposure becomes an accepted, documented risk.
- **Option B — Drop `output: "export"`, deploy as standard Vercel app.** Removes one line of config; site stays ~99% statically prerendered (SSG) but gains **one** serverless Route Handler `app/api/lead/route.ts` (POST). Move the webhook to a **server-only** env var (no `NEXT_PUBLIC_`); the handler validates (Zod) + forwards. Client never sees the webhook. Fully resolves the security finding. Cost: lose `out/` portability (now Vercel-coupled), and `next/image` optimization becomes available again (a side benefit). **This is the only path to a genuinely secured form.**

**Recommendation:** Because the project is *already on Vercel* and the security concern is real (anyone can spam the GHL webhook), **Option B is the architecturally correct long-term answer** — and it costs almost nothing since Vercel SSG keeps all pages static except the one API route. **If** the milestone wants to stay strictly static for launch simplicity, **Option A with honeypot + Zod + GHL rate-limiting** is an acceptable v1. The roadmap should treat this as an explicit either/or decision, ideally resolved *before* the form-hardening phase, because it changes `next.config.ts` and where `submitForm` posts.

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `lib/services/` ↔ `app/diensten/` | Typed accessor functions (`getServiceBySlug`, `getAllServiceParams`) | Templates depend on the **types/accessors**, never reach into raw arrays — keeps the data shape swappable (CMS later). |
| `lib/services/` ↔ `app/sitemap.ts` | Imports lightweight `taxonomy.ts` only | Sitemap doesn't pull full content — keeps build graph lean. |
| `lib/services/` ↔ `lib/constants.ts` (Navbar) | Dropdown derived from taxonomy | Eliminates nav-vs-pages drift (a `CONCERNS.md` duplication class). |
| `components/service/` ↔ `components/seo/` | FAQ array passed to both UI accordion and `faqPage()` builder | Write-once content, two outputs (visual + schema). |
| Content (`content/*.ts`, `*.mdx`) ↔ templates | Build-time only | No runtime fetch; everything resolved at `next build`. |

---

## Suggested Build Order (for the roadmap)

Dependency-driven; each layer unblocks the next. This is the recommended phase ordering rationale for the roadmap.

1. **Taxonomy + data model first** (`lib/services/types.ts`, `taxonomy.ts`, `brands.ts`, empty `content/*.ts` shells).
   *Why first:* every other layer reads it. Lock the shape before building templates. Defines the URL structure and the sitemap simultaneously.
2. **Route + templates** (`app/diensten/[pillar]/[service]/page.tsx` + `[pillar]/page.tsx` + hub; `components/service/*`).
   *Why second:* needs the data contract; produces visible pages (even with placeholder copy) to validate the generation mechanic and `dynamicParams = false` under `output: "export"` early.
3. **SEO infrastructure** (`components/seo/`, per-page `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, site-wide `LocalBusiness` JSON-LD, OG/Twitter meta, breadcrumbs).
   *Why third:* layers onto existing templates; mechanically independent of final copy. Closes the `CONCERNS.md` "missing SEO infra" gap.
4. **Content fill** (Claude-drafted unique Dutch copy + FAQs per node; brand paragraphs; local angle) — the **thin-content defense executed**.
   *Why fourth:* the slowest, review-gated work; the architecture makes its absence visible (empty required fields), so it can proceed in parallel/last without blocking the build. **This phase, not the build, is where launch quality is won.**
5. **Light MDX blog/FAQ** (`@next/mdx` wiring, `content/blog/`, `app/blog/`).
   *Why fifth:* additive, lower priority than the core service surface; independent of the taxonomy.
6. **Form security decision + hardening** (resolve Option A/B; Zod + honeypot; network-error handling).
   *Why last among build work:* it's the one cross-cutting config decision; deciding it late avoids reworking `next.config.ts` mid-stream, but it **must** be decided before final QA.

> **Research flags for the roadmap:** Phase 6 (form boundary) needs an explicit decision gate — it's the only item that can change `next.config.ts` globally. Phase 4 (content) is editorial-heavy and the true quality gate; budget accordingly. Phases 1-3 are standard, well-supported Next.js 16 patterns (HIGH confidence, no deep research needed).

---

## Sources

- Next.js 16.2.7 — `generateStaticParams` (nested/multiple dynamic segments, bottom-up & top-down, `dynamicParams`): https://nextjs.org/docs/app/api-reference/functions/generate-static-params — HIGH (official, lastUpdated 2026-06-01)
- Next.js 16.2.7 — Static Exports guide (supported/unsupported features; Route Handlers render static GET responses; `dynamicParams: true` unsupported; no Server Actions / Request-reading handlers): https://nextjs.org/docs/app/guides/static-exports — HIGH (official, 2026-06-01)
- Next.js 16.2.7 — `sitemap.(xml|ts)` file convention (programmatic sitemap as cached Route Handler, `MetadataRoute.Sitemap`, `generateSitemaps`): https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — HIGH (official, 2026-06-01)
- Next.js 16.2.7 — MDX guide (`@next/mdx`, `mdx-components.tsx`, dynamic-import + `generateStaticParams` + `dynamicParams=false`, frontmatter via gray-matter/remark-frontmatter): https://nextjs.org/docs/app/guides/mdx — HIGH (official, 2026-06-01)
- Next.js — JSON-LD guide (render `<script application/ld+json>` from server component; client-component double-injection caveat): https://nextjs.org/docs/app/guides/json-ld — MEDIUM-HIGH (official guide; hydration caveat corroborated by community)
- Existing system context: `.planning/codebase/ARCHITECTURE.md`, `STRUCTURE.md`, `CONCERNS.md` (anti-patterns to avoid: inline data in `app/diensten/page.tsx`, 620-line `PricingTabs`, review/pricing duplication, missing sitemap/robots/JSON-LD, client-exposed webhook) — HIGH (direct repo analysis)
- Thin/duplicate/doorway-content guidance for programmatic SEO: established Google Search guidance + community consensus — MEDIUM (well-established practice; not a single citable doc)

---
*Architecture research for: taxonomy-driven local-service site + SEO infra on Next.js 16 `output: "export"`*
*Researched: 2026-06-02*
