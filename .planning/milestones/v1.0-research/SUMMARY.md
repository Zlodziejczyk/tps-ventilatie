# Project Research Summary

**Project:** TPS klimaattechniek — full climate-tech lead-gen site
**Domain:** Dutch local-service (HVAC / klimaattechniek) SEO-driven lead generation — Zoetermeer + regio
**Researched:** 2026-06-02
**Confidence:** HIGH

## Executive Summary

TPS klimaattechniek is moving from a 6-page proposal to a full multi-pillar lead-generation site across Airconditioning, Warmtepompen, WTW, and Mechanische Ventilatie. The site is built on Next.js 16 App Router with Tailwind v4, deployed on Vercel, and earns its living as a local-search-to-phone-call machine for a single Zoetermeer installer. Experts build this category of site with a taxonomy-driven static-page system (one data file generates 20+ pages), tight local SEO infrastructure (HVACBusiness JSON-LD, GBP alignment, NAP consistency), and a secured, monitored lead path. The additive dependency count is intentionally minimal: `generateStaticParams`, the Metadata API, `app/sitemap.ts`, and `app/robots.ts` are all built into Next 16. The only net-new runtime additions are `schema-dts`, `zod`, the MDX set (`@next/mdx` + `gray-matter`), and `@vercel/analytics`.

The recommended approach pivots on one load-bearing architectural decision: **drop `output: "export"` in favour of Vercel hybrid deployment**. Under full static export, a POST Route Handler that reads a request body is explicitly unsupported — which means the GoHighLevel webhook URL cannot be moved server-side, the form cannot be validated server-side, and `next/image` optimization stays disabled. Switching to hybrid costs nothing visible (all pages remain statically pre-rendered on the CDN; only one serverless POST function is added) and unblocks form security, reliable lead notification, and image optimization simultaneously. This decision gates three downstream pitfalls and must be resolved as an explicit milestone gate before the QA/communications phase, not deferred.

The primary existential risk is Google's December 2025 Core Update, which explicitly targets templated location pages with swapped nouns and mass-produced AI content without human oversight — the exact pattern this milestone plans to build. Home services are YMYL; the quality bar is high. The architecture defends against this by making unique content a *structural requirement* (typed mandatory fields: unique intro ≥120 words, service-specific steps, per-page FAQs, brand-specific paragraphs, local angle) and by enforcing a human editorial review gate before any page ships. Additionally, ISDE subsidy accuracy is a non-negotiable trust signal: Warmtepompen ✅, WTW/MV ✅ (from 1-1-2026, plus insulation condition), Airco ❌ — and NL heat-pump BTW stays 21% (not Belgian 6%). Getting these wrong is a credibility landmine on a YMYL site.

## Key Findings

### Recommended Stack

The base stack (Next.js 16.2.7, React 19, Tailwind v4, Framer Motion, OGL, GoHighLevel webhook) is proven and unchanged. All new SEO and routing work uses capabilities built into Next.js 16: `generateStaticParams` for the 20+ data-driven service pages, the Metadata API for per-page title/description/canonical/OG, `app/sitemap.ts` and `app/robots.ts` for static sitemap and robots files. These require zero additional dependencies. The one place `output: "export"` must be relaxed is the form's secure server route — dropping that one config line, adding `app/api/contact/route.ts` as a POST handler, and moving the webhook to a server-only env var (no `NEXT_PUBLIC_`) is the cleanest and strongly recommended path.

**Core technologies (additive — base stack already in place):**
- `generateStaticParams` (built-in Next 16): pre-renders all pillar/service/brand routes from one taxonomy file — the supported static-export approach for dynamic routes
- Next.js Metadata API (built-in): per-page `<title>`, description, canonical, OG, Twitter, verification — replaces `next-seo` entirely in App Router
- `app/sitemap.ts` + `app/robots.ts` (built-in): static-render to `sitemap.xml` and `robots.txt` at build, sourced from the same taxonomy so they cannot drift
- `zod` v4.4.3: single schema for form validation reused client-side (UX errors) and server-side (trust boundary in the POST handler)
- `schema-dts` v2.0.0: TypeScript types for JSON-LD (LocalBusiness/Service/BreadcrumbList/FAQPage) — types only, zero runtime
- `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` + `gray-matter` + `@tailwindcss/typography`: local, build-time MDX blog/FAQ — fully static-export compatible
- `@vercel/analytics` v2.0.1: cookieless analytics on Vercel (no GDPR cookie banner needed); coexists with GA4 via `@next/third-parties`

**What NOT to use:**
- `next-sitemap`, `next-seo`, `contentlayer`, `react-schemaorg` — redundant or unmaintained in this App Router context
- A GET-only Route Handler as a "secure form proxy" under `output: "export"` — architecturally impossible (Route Handlers under export are static and GET-only)
- Server Actions for the form — unsupported under `output: "export"`; heavier than a plain POST route even after switching to hybrid
- reCAPTCHA — GDPR friction; honeypot + time-trap first, Cloudflare Turnstile only if spam persists
- Any headless CMS this milestone — content lives in-repo by decision

### Expected Features

Research audited live NL competitors (AircoProfs, Aircoland, DEK, Koelklimaattechniek) and ISDE/BTW primary sources. The market floor is rising; weak sites that hide pricing and omit certs feel evasive. TPS's wedge is honest, certified, personal, and transparent — correct per-pillar subsidy info (including the underexploited 2026 WTW/MV ISDE), real Google reviews with score and count, all-in pricing where it is standard, and the owner-led story.

**Must have (table stakes — v1 launch):**
- 4-pillar IA: `/diensten` hub + Airconditioning, Warmtepompen, WTW, Mechanische Ventilatie pillar pages (data-driven template)
- Per-pillar core sub-services: Installatie / Onderhoud / Reparatie-Storing / Advies at minimum
- Offerte flow with reassurance copy ("gratis", "vrijblijvend", "binnen 24 uur reactie") and a short form (name, contact, postcode, dienst, bericht)
- Secured lead path + instant owner notification — form must never silently fail; leads are the product
- Floating WhatsApp + verified tel:/mailto:/wa.me on every page
- Certification/keurmerk trust block (only genuinely-held: F-gassen/STEK, BRL/InstallQ/VCA where true)
- Google Reviews consolidated to one source: score + count + link on home and key pages
- Pricing transparency: all-in incl. BTW for Airco/WTW/MV; WP = "op maat via offerte" with inclusions
- Accurate per-pillar ISDE/subsidie: WP ✅, WTW/MV ✅ (2026+insulation), Airco ❌ — sourced/linked
- Brand authority block (Daikin, Mitsubishi Electric/Heavy, Ecodan) with accurate "erkend installateur" claims
- Service area: canonical radius/town list, fix the 50km/100km inconsistency at `lib/constants.ts`
- FAQ per pillar + general (kosten, garantie, subsidie, VvE/vergunning, geluid, onderhoud) with FAQPage JSON-LD
- Technical + local SEO floor: sitemap.xml, robots.txt, HVACBusiness + Service + FAQ JSON-LD, OG/Twitter meta, GBP alignment, NAP consistency, page-speed pass
- Analytics (Vercel Analytics + GA4) + Google Search Console + sitemap submission

**Should have (competitive differentiators — v1.x after validation):**
- Per-location / per-neighbourhood pages (pillar × region), genuinely unique — only after confirming which queries actually convert in GSC
- Light blog / kennisbank (evergreen, locally framed; internal links to pillars)
- Onderhoudscontract offering with tiers
- VvE / appartement guidance section
- Energy-savings / gas-vs-airco framing with airco→WP cross-sell content
- Brand-specific install content (Daikin / Mitsubishi Electric / Heavy / Ecodan)

**Defer to v2+:**
- Headless CMS — only when owner needs self-service editing
- Full GHL CRM pipelines / nurture automation
- Customer portal / online appointment scheduling
- Standardized WP pricing tooling / configurator
- Multi-language (EN)
- Domain migration to tpsklimaattechniek.nl

**Anti-features to reject:**
- Claiming ISDE subsidy for airco (factually wrong; damages "Transparant" USP)
- Quoting 6%/9% BTW on airco without NL verification (NL WP stays 21%; 6% is Belgium)
- Generic town-name-swapped location pages — Google's thin-content target; waste of effort
- Instant online price calculator / self-serve booking — wrong fit for a consultative purchase
- Long mandatory quote forms (10+ required fields) — kills conversion
- Fake/unverifiable trust badges or certifications TPS does not hold

### Architecture Approach

The architecture is a taxonomy-as-single-source-of-truth system where one typed data file (`lib/services/taxonomy.ts`) drives route generation, page content, nav dropdowns, sitemap, and JSON-LD simultaneously — structural drift between pages, nav, and sitemap becomes impossible. The existing anti-pattern (inline data arrays inside JSX, e.g., 400-line `app/diensten/page.tsx`) is replaced by a clean boundary: `lib/services/` (data only, no JSX) feeds `app/diensten/` (templates only, no data definitions). Content is split by pillar across small files (`content/airconditioning.ts`, `warmtepompen.ts`, `wtw.ts`, `mechanische-ventilatie.ts`) to stay within the 200-400-line file norm. JSON-LD is rendered from pure server components (never `"use client"`) so it bakes into static HTML with zero client JS and no hydration-mismatch risk. The blog is local MDX via `@next/mdx` + `gray-matter`, build-time only, static-export safe.

**Major components:**
1. `lib/services/taxonomy.ts` — the lightweight tree (slugs, pillar→sub→brand relations); the only file `sitemap.ts` and `generateStaticParams` need to import
2. `lib/services/content/*.ts` — one file per pillar with per-sub-service unique copy, steps, FAQs, local angle; the thin-content defense executed in data
3. `app/diensten/[pillar]/[service]/page.tsx` — the workhorse template that generates all 20+ pages via `generateStaticParams` + `dynamicParams = false`
4. `components/service/*` — reusable template building blocks (ServiceHero, ServiceSteps, ServiceFAQ, BrandGrid, RelatedServices, Breadcrumbs); server components receiving data as props
5. `components/seo/JsonLd.tsx` + `schema.ts` — render-only server components that serialize LocalBusiness/Service/BreadcrumbList/FAQPage schema; zero client JS
6. `app/sitemap.ts` + `app/robots.ts` — programmatic, import the same taxonomy; emit static files at build
7. `app/api/contact/route.ts` (POST) — the single serverless function after dropping `output: "export"`; Zod-validates, honeypot-checks, forwards to GHL with server-only webhook secret

### Critical Pitfalls

1. **Doorway/thin templated pages (Dec 2025 Core Update target)** — Design uniqueness into the data model itself: `intro` (≥120 words, required), `steps[]` (service-specific), `faqs[]` (3-6 per page, unique), brand-specific paragraphs from `brands.ts`, local angle. If two pages' body text is >70% identical, merge or rewrite before shipping. Treat "indistinguishable but for the H1" as a launch blocker.

2. **Static-export vs hybrid: impossible to secure the form under `output: "export"`** — A POST Route Handler that reads a request body is explicitly unsupported under static export. Drop `output: "export"`, add one serverless POST route, move webhook to server-only env var. This is the load-bearing decision that gates form security, reliable notification, and image optimization.

3. **NAP inconsistency across 20+ pages and GBP** — Fix the 50km/100km radius bug at `lib/constants.ts` (not in JSX). Extend `SITE` constants to cover `serviceRadiusKm`, `serviceAreaText`, and all address/phone fields. JSON-LD sourced from the same constants. Reconcile site NAP with GBP before launch. Settle the klimaattechniek rebrand/domain question early.

4. **AI-drafted Dutch content failing E-E-A-T on a YMYL site** — Enforce human editorial review as a gate. Inject real experience signals the AI cannot invent: Thomas's certifications, real job-site context, Zoetermeer-specific local detail, named credentials. Verify every technical/regulatory claim (F-gassen, ISDE amounts, BTW rates) against NL primary sources before publishing.

5. **Keyword cannibalization between pillar and sub-service pages** — Build a keyword map before writing any page: one primary keyword + one search intent per URL. Pillar owns the broad head term; each sub-page owns a distinct long-tail/intent. Internal linking encodes the hierarchy (sub-pages link up; pillar links down).

6. **GHL webhook spam and silent lead notification failure** — GHL's built-in captcha is documented as ineffective by its own community. Add honeypot + time-trap (zero deps); add Zod validation; add try/catch with visible error state + phone/WhatsApp fallback. Verify the entire notification chain end-to-end before launch.

7. **Static-export sitemap build failure** — `app/sitemap.ts` fails the export build unless it includes `export const dynamic = "force-static"`. Combine with `metadataBase` set to the canonical production origin, consistent `trailingSlash` across config/canonical tags/sitemap URLs/Vercel redirects, and absolute self-canonicals on every page.

## Implications for Roadmap

Based on combined research, six dependency-driven phases are suggested. The ordering is non-negotiable: each phase's output is an input to the next. The content phase is where launch quality is actually won — budget accordingly.

### Phase 1: Taxonomy and Data Model

**Rationale:** Every other layer reads this. Lock the data shape (slugs, URL structure, types, accessors, brand facts, empty content shells) before building templates. This phase also defines the keyword map (one primary keyword per URL) and the anti-doorway uniqueness bar — both are design-time decisions that cannot be retrofitted cheaply. Fix the NAP inconsistency (`lib/constants.ts`) here.

**Delivers:** `lib/services/taxonomy.ts`, `lib/services/types.ts`, `lib/services/brands.ts`, `lib/services/content/*.ts` (shells), keyword map (one primary per URL), uniqueness-bar definition, fixed `SITE` constants (radius, address, phone — single source), `lib/seo.ts` (`BASE_URL`, default OG, geo).

**Addresses:** Service taxonomy (FEATURES.md), anti-thin-content pattern (ARCHITECTURE.md Pattern 4), NAP consistency (PITFALLS.md Pitfall 3), keyword cannibalization prevention (PITFALLS.md Pitfall 2).

**Avoids:** Inline data in JSX, one mega service-data file, NAP drift across 20+ pages.

**Research flag:** Standard Next.js 16 patterns — no phase research needed. The keyword map requires editorial judgment, not technical research.

### Phase 2: Routes and Service-Page Templates

**Rationale:** Needs the data contract from Phase 1. Produces visible pages — even with placeholder copy — that validate the generation mechanic and `dynamicParams = false` under `output: "export"` early in the build cycle. Locks the URL structure so later SEO work has stable targets.

**Delivers:** `app/diensten/` hub + `[pillar]/page.tsx` + `[pillar]/[service]/page.tsx` with `generateStaticParams` + `dynamicParams = false`; `components/service/*` (ServiceHero, ServiceSteps, ServiceFAQ, BrandGrid, RelatedServices, Breadcrumbs); Navbar dropdown derived from taxonomy; 20+ static pages building successfully.

**Uses:** `generateStaticParams` (built-in), Metadata API `generateMetadata` (built-in).

**Avoids:** Catch-all vanity route, forgetting `dynamicParams = false`.

**Research flag:** Standard Next.js 16 patterns — no phase research needed.

### Phase 3: SEO Infrastructure

**Rationale:** Layers onto existing templates; mechanically independent of final copy. Closes the CONCERNS.md "missing SEO infra" gap. Do this before content fill so every page that receives copy is immediately SEO-ready. All items in this phase interact with each other (`metadataBase`, `trailingSlash`, canonical strategy, sitemap, robots) — do them together.

**Delivers:** `components/seo/JsonLd.tsx` + `schema.ts` (HVACBusiness, Service, BreadcrumbList, FAQPage); `app/sitemap.ts` with `dynamic = "force-static"` + taxonomy import; `app/robots.ts`; site-wide HVACBusiness JSON-LD in root layout; `metadataBase` + consistent `trailingSlash` + absolute self-canonicals; OG/Twitter meta + Search Console verification; `@vercel/analytics` + optional GA4; Google Business Profile alignment (NAP, categories, service area, maps pin fix).

**Avoids:** Sitemap build failure (`force-static`), canonical/trailing-slash duplicates, JSON-LD in a client component, self-serving aggregateRating markup, NAP disagreement between schema and visible copy.

**Research flag:** Standard patterns — no phase research needed. Validate with Google Rich Results Test immediately after deploy.

### Phase 4: Content Fill (Editorial Gate)

**Rationale:** The slowest, review-gated work. This is where launch quality is actually won — the architecture makes content absence visible (empty required typed fields), but it cannot write genuinely unique Dutch copy. Ship a few strong pages first; expand only after quality is confirmed. This is not a code phase; it is an editorial phase with a hard owner-review gate.

**Delivers:** Unique Dutch copy for all service + sub-service pages meeting the uniqueness bar (intro ≥120 words, service-specific steps, 3-6 unique FAQs, brand paragraphs, local angle); accurate per-pillar ISDE/subsidie content (WP ✅, WTW/MV ✅ 2026+insulation, Airco ❌); pricing transparency copy; certification/brand claims verified against what TPS actually holds; "Verhaal van Thomas" + 4 USPs refreshed; owner review completed on every page before it ships.

**Avoids:** Rubber-stamp owner review, publication of unverified technical/regulatory claims, mass-publishing 20+ pages on day one.

**Research flag:** No technical research needed but DOES need editorial guardrails: an E-E-A-T injection checklist (credentials, local specifics, real process steps, sourced facts) and a fact-check checklist (F-gassen, ISDE amounts, BTW rates) built before drafting begins. Owner review is a hard gate, not a courtesy.

### Phase 5: Light MDX Blog and FAQ

**Rationale:** Additive and lower priority than the core service surface. Independent of the taxonomy — can run in parallel with late content fill if editorial bandwidth allows. Feeds long-tail informational queries and provides internal-link fodder to pillar pages.

**Delivers:** `@next/mdx` wiring in `next.config.ts`; `mdx-components.tsx`; `content/blog/*.mdx`; `app/blog/[slug]/page.tsx` + `app/blog/page.tsx`; `gray-matter` frontmatter; `@tailwindcss/typography` `prose` styling; blog URLs in `app/sitemap.ts`.

**Uses:** `@next/mdx`, `gray-matter`, `@tailwindcss/typography`, `remark-gfm` (optional), built-in `generateStaticParams` + `dynamicParams = false`.

**Avoids:** `contentlayer` (unmaintained), a remote CMS (out of scope), `next-mdx-remote` (only for remote sources).

**Research flag:** Standard `@next/mdx` patterns — no phase research needed. Turbopack caveat: pass `remark-gfm` as a string name, not a function reference.

### Phase 6: Form Security, Hardening, and QA (Launch Gate)

**Rationale:** Contains the one config decision (`output: "export"` vs hybrid) that cannot be made in parallel with earlier phases without risk of reworking `next.config.ts` mid-stream. Must be fully resolved before launch. Mobile Core Web Vitals pass is a launch criterion.

**Delivers:** Decision logged in PROJECT.md: drop `output: "export"` → Vercel hybrid (strongly recommended) or keep export + standalone Vercel function (fallback); `app/api/contact/route.ts` POST handler with Zod validation + honeypot check + rate limiting + server-only `GHL_WEBHOOK_URL`; visible form error state + fallback to phone/WhatsApp; end-to-end lead notification test (real submit → owner WhatsApp/email in seconds); monitoring setup; AVG consent at form (unchecked checkbox or correct grondslag, privacy link, GoHighLevel named as processor in privacy policy); mobile Lighthouse + field CWV pass (INP <200ms, LCP good) with WebGL/particle effects gated on mobile/`prefers-reduced-motion`; build-time WebP/AVIF image optimization via `sharp`; all CTA/tel/mailto/wa.me links verified across every new page.

**Avoids:** Deploying with `NEXT_PUBLIC_GHL_WEBHOOK_URL` in client JS, silent form failure, mobile INP/LCP failure on the first page every lead sees, AVG non-compliance, trusting GHL's built-in captcha.

**Research flag:** The static-vs-hybrid decision is the explicit decision gate for this phase. All three relevant researchers (STACK.md, ARCHITECTURE.md, PITFALLS.md) recommend Option A (drop `output: "export"` → Vercel hybrid). The roadmapper must surface this as a formal go/no-go decision before phase planning begins. Log the outcome in PROJECT.md Key Decisions.

### Phase Ordering Rationale

- Taxonomy first because every other layer is a consumer of it; changing the data shape after templates are built forces cascading rewrites.
- Templates before SEO infra because the template is what gets instrumented with metadata/JSON-LD; you need stable routes before attaching canonical tags and sitemap entries.
- SEO infra before content because every page that receives copy should be immediately indexable; shipping content on pages with missing canonicals or broken sitemap export is wasted editorial effort.
- Content before blog because the core service surface is the conversion machine; the blog is additive SEO, not the product.
- Form security last among build work because resolving `output: "export"` vs hybrid changes `next.config.ts` globally; deciding it after the template and SEO work is stable avoids mid-stream config thrash. But it must be decided before final QA — not after.
- The editorial gate (Phase 4) is not optional and not compressible. It is the actual quality gate for the Dec 2025 Core Update risk.

### Research Flags

Phases needing deeper research or explicit decision gates during planning:
- **Phase 1 (Taxonomy):** keyword map requires editorial judgment on one-primary-per-URL intent differentiation — a planning workshop deliverable, not technical research
- **Phase 4 (Content):** E-E-A-T injection checklist and fact-check checklist must be authored before any drafting begins; needs owner input on certifications actually held and brands actually authorized
- **Phase 6 (Form security):** explicit decision gate — roadmapper must surface the static-vs-hybrid choice as a go/no-go before phase planning; all three researchers recommend Option A

Phases with standard, well-documented patterns (no additional research needed):
- **Phase 2 (Routes/templates):** `generateStaticParams` + `dynamicParams = false` is documented in Next.js 16 official docs with explicit examples — HIGH confidence
- **Phase 3 (SEO infra):** `app/sitemap.ts`, `app/robots.ts`, Metadata API, JSON-LD server components — all official Next.js 16 patterns; `force-static` requirement is the one gotcha, already documented
- **Phase 5 (MDX blog):** `@next/mdx` + `gray-matter` + `generateStaticParams` is the official Next.js 16 MDX guide example verbatim — HIGH confidence

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technology recommendations verified against official Next.js 16.2.7 docs (2026-06-01) and live `npm view` on 2026-06-02. The static-export POST-handler impossibility is an explicit quote from the official docs. |
| Features | HIGH | Multiple live NL competitor sites audited directly. ISDE/BTW rules verified against RVO and Belastingdienst-adjacent primary sources and 2026 industry coverage. |
| Architecture | HIGH | Route/sitemap/MDX mechanics verified against official Next.js 16.2.7 docs. Thin-content guidance is established SEO practice with substantial corroborating community consensus. |
| Pitfalls | MEDIUM-HIGH | Local-SEO and Next.js export gotchas verified against Google docs and Next.js 16 docs (HIGH). Dec 2025 Core Update findings are recent third-party reporting on a confirmed update, consistent across multiple sources (MEDIUM-HIGH). GHL spam behaviour from HighLevel's own community (MEDIUM). |

**Overall confidence:** HIGH

### Gaps to Address

- **Owner certification inventory:** before Phase 4 content drafting, confirm exactly which certifications TPS holds (F-gassen/STEK, BRL 6000, InstallQ, VCA, specific brand authorized-dealer status for Daikin/Mitsubishi). Claiming unverified certs is a credibility and potential legal risk.

- **Rebrand/domain decision:** `tpsventilatie.nl` vs `tpsklimaattechniek.nl` is listed as "not blocking" but has significant SEO implications. A post-launch domain rename requires a 301 plan + GBP update + citation updates. Raise with the owner before Phase 3 (SEO infra) so NAP signals are configured for the right domain from day one.

- **Confirmed service radius:** the 50km/100km bug exists at multiple points in the codebase. Phase 1 fixes it at `lib/constants.ts`. But the correct radius needs to be confirmed with the owner (what does TPS actually cover?) before it is propagated across 20+ pages and into GBP.

- **GHL workflow configuration:** Phase 6 depends on the GHL instant-notification workflow being configured and tested end-to-end. Research documents the risk (GHL captcha ineffective, silent workflow failures) but cannot verify the current GHL account setup. This requires a live end-to-end test as a Phase 6 gate.

- **Brand authorized-dealer status:** "erkend installateur" for Daikin and Mitsubishi is a material trust lever. Verify TPS's actual dealer agreements before Phase 4 brand-specific content is drafted.

## Sources

### Primary (HIGH confidence)

- https://nextjs.org/docs/app/guides/static-exports — Next.js 16.2.7: supported/unsupported features under `output: "export"`; Route Handlers static + GET-only; POST impossibility
- https://nextjs.org/docs/app/api-reference/functions/generate-static-params — nested dynamic segments, `dynamicParams`, bottom-up enumeration
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — `app/sitemap.ts` as cached Route Handler → static `sitemap.xml`
- https://nextjs.org/docs/app/guides/mdx — `@next/mdx`, `mdx-components.tsx`, `[slug]` + `generateStaticParams` + `dynamicParams=false`, `gray-matter`, Turbopack plugin-string caveat
- https://nextjs.org/docs/app/guides/third-party-libraries — `@next/third-parties` `GoogleAnalytics`, client-side gtag injection
- https://vercel.com/docs/analytics/quickstart — `@vercel/analytics` v2, platform-injected endpoints under export on Vercel
- https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp — RVO ISDE warmtepomp eligibility and 2026 amounts
- https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie — RVO ISDE ventilatie from 1-1-2026 (€400 + insulation condition)
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content — people-first content, E-E-A-T, human oversight
- https://www.autoriteitpersoonsgegevens.nl/en/themes/basic-gdpr/privacy-rights-under-the-gdpr/right-to-information — AVG consent requirements
- npm registry (`npm view`, 2026-06-02) — verified: zod 4.4.3, @vercel/analytics 2.0.1, schema-dts 2.0.0, @next/mdx 16.2.7, @vercel/speed-insights 2.0.0

### Secondary (MEDIUM-HIGH confidence)

- ALM Corp — Google December 2025 Core Update guide — "templated location pages" + "87% AI content" findings (recent; confirmed update, cross-corroborated)
- BrightLocal — NAP consistency local ranking factors (~40% local-pack figure)
- AircoProfs, Aircoland, DEK, Koelklimaattechniek — live competitor sites audited for features, pricing, certifications, reviews, SEO patterns
- vercel/next.js Discussion #59019 — `dynamic="force-static"` requirement for `app/sitemap.ts` under `output: "export"`
- HighLevel Ideas community — GHL built-in captcha documented as ineffective for form spam

### Tertiary (MEDIUM confidence)

- https://www.warmtepomp-gids.nl/subsidie/btw/ — NL heat pumps remain 21% BTW in 2026 (6% is Belgium); basis for the anti-feature warning on BTW claims
- Anti-spam (honeypot + time-trap) — staticforms.dev, datadome.co, n8n community: ~80-99% bot reduction figure is directional, not guaranteed
- Thin/doorway-content recovery timelines — Ahrefs historical data, Orbit Media, Manning Search Marketing: figures are illustrative

---
*Research completed: 2026-06-02*
*Ready for roadmap: yes*
