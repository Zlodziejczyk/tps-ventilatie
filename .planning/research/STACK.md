# Stack Research

**Domain:** Dutch local-service (HVAC / klimaattechniek) lead-gen site — SEO-driven, data-driven service pages, validated + secure forms, on Next.js 16 static export → Vercel
**Researched:** 2026-06-02
**Confidence:** HIGH

> **Scope note:** This is a SUBSEQUENT-milestone stack research. The base stack (Next.js 16.2.x, React 19, Tailwind v4, Framer Motion, OGL, GoHighLevel webhook) is KNOWN, PROVEN, and intentionally NOT re-researched. Everything below is the *additive* stack for this milestone's new work: 20+ data-driven service pages, full structured data, a light MDX blog/FAQ, validated + anti-spam + secured forms, and analytics/Search-Console/sitemap — all under the `output: "export"` constraint (and the one place we recommend relaxing it).

---

## TL;DR — what to add

| Need | Add | Don't add |
|------|-----|-----------|
| 20+ service pages from one taxonomy | **`generateStaticParams`** (built into Next 16) + plain TS data files | A CMS; a 3rd-party static-gen lib |
| JSON-LD (LocalBusiness/Service/Breadcrumb/FAQ) | **`schema-dts`** (types only) + a tiny `<JsonLd>` component | `react-schemaorg` (stale), `next-seo` (redundant in App Router) |
| Sitemap + robots | **`app/sitemap.ts` + `app/robots.ts`** (built-in) | `next-sitemap` (extra dep, postbuild crawl — unneeded) |
| OG/Twitter/canonical meta | **Next built-in Metadata API** (`metadata` export + `metadataBase`) | `next-seo` |
| Light blog / FAQ | **`@next/mdx` + `@mdx-js/loader` + `@mdx-js/react`** + `gray-matter` + `@tailwindcss/typography` | `contentlayer` (unmaintained), a CMS |
| Form validation | **Zod v4** (`zod`) | `yup`, `joi`, hand-rolled regex |
| Anti-spam | **Honeypot field + time-trap** (zero deps) — optional **Cloudflare Turnstile** later | reCAPTCHA v2/v3 (privacy/GDPR + UX cost) |
| Analytics | **`@vercel/analytics`** (works under export on Vercel) — and/or **GA4 via `@next/third-parties`** | Manually pasting gtag in `<head>`; segment/heavy SDKs |
| Web Vitals | **`@vercel/speed-insights`** (optional) | — |
| **Secure the lead path** | **Drop `output: "export"` → Vercel hybrid + one POST Route Handler** (recommended) | A GET-only Route Handler "proxy" (impossible — see §Form decision) |

---

## Recommended Stack

### Core Technologies (additive — base stack already in place)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js `generateStaticParams` | built into **16.2.7** | Pre-render the 20+ pillar/sub-service/brand routes at build time | Officially the supported way to do dynamic routes under `output: "export"`. Define `[pillar]/[service]` (or `[...slug]`) once, return every combination from one taxonomy object, and Next emits one static HTML file per page. No extra dependency. **Dynamic routes *without* `generateStaticParams`, or with `dynamicParams: true`, are explicitly unsupported under export** — so this is the path. |
| Next.js Metadata API | built into **16.2.7** | Per-page `<title>`, description, canonical, Open Graph, Twitter, `alternates` | Already used in the codebase for static pages. Export a `metadata` object (or `generateMetadata` for the dynamic service pages) — fully static-export compatible. Set `metadataBase` in the root layout so OG/canonical URLs resolve absolutely. Replaces the need for `next-seo` entirely in App Router. |
| `app/sitemap.ts` | built into **16.2.7** | Generates `/sitemap.xml` at build, enumerating all routes incl. the generated service pages | `sitemap.(ts)` is a Route Handler **cached by default**; under `output: "export"` it renders to a static `sitemap.xml` at build time. Import the same taxonomy used by `generateStaticParams` so the sitemap can never drift from the pages. Typed via `MetadataRoute.Sitemap`. |
| `app/robots.ts` | built into **16.2.7** | Generates `/robots.txt` referencing the sitemap | Same static-render-at-build behavior. Typed via `MetadataRoute.Robots`. One file, points Googlebot at `sitemap.xml`. |
| `zod` | **4.4.3** | Schema validation of contact-form input (name/email/phone/message) on both client and server | The de-facto TS validation standard; v4 is a ground-up rewrite (smaller, faster, tree-shakeable). One schema is the single source of truth: reuse it client-side for inline UX errors and server-side (in the form Route Handler) as the trust boundary. Directly closes the "No Input Validation" CONCERN. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `schema-dts` | **2.0.0** | TypeScript types for Schema.org JSON-LD (`LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`) | Always, for the structured-data work. Types-only (zero runtime). Author each schema as a typed object, then render with a tiny `<JsonLd>` server component: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`. Closes the "No Structured Data" CONCERN with rich-result eligibility. |
| `@next/mdx` | **16.2.7** | Compile local `.mdx`/`.md` as pages/imports for the blog + FAQ | The blog/FAQ workstream. `@next/mdx` **sources from local files at build time** → fully static-export compatible. Pair with a `[slug]` route + `generateStaticParams` + `export const dynamicParams = false` (the exact pattern in the Next docs) so each post is a static page. |
| `@mdx-js/loader` | **3.x** (current) | Webpack/Turbopack loader that `@next/mdx` needs | Install alongside `@next/mdx` (peer requirement). |
| `@mdx-js/react` | **3.x** (current) | Provides MDX component context (`mdx-components.tsx`) | Required for `@next/mdx` with App Router — the `mdx-components.tsx` file is mandatory or MDX won't render. |
| `@types/mdx` | **2.x** (current) | Types for `.mdx` imports | Dev-time only, with the MDX packages. |
| `gray-matter` | **4.x** (current) | Parse YAML frontmatter (title/description/date/slug) from MDX | `@next/mdx` does **not** parse frontmatter natively. `gray-matter` (server-side, build-time) is the standard, lightest way to read post metadata for the blog index + per-post `<title>`/JSON-LD. (Alternative: `remark-frontmatter` + `remark-mdx-frontmatter` as remark plugins — heavier; prefer `gray-matter` for a small blog.) |
| `@tailwindcss/typography` | **0.5.x** (current) | `prose` classes to style rendered MDX without hand-writing element styles | The blog/FAQ body. Officially recommended by the Next MDX guide for Tailwind projects. Wrap MDX in a layout with `prose` classes; keeps long-form content readable and on-brand without per-tag CSS. Configure to respect "Atmospheric Clarity" (no 100% black: map `prose` text to `on-surface`). |
| `remark-gfm` | **4.x** (current) | GitHub-flavored markdown (tables, strikethrough, autolinks) in MDX | Optional but recommended for the FAQ/blog so tables and `~~`/autolinks work. Add as a remark plugin in `next.config.mjs`. **Turbopack caveat:** pass plugins by *string name* (`'remark-gfm'`), not function reference — Turbopack can't pass JS functions to its Rust core. |
| `@vercel/analytics` | **2.0.1** | Privacy-friendly page-view/visitor analytics | **Works under `output: "export"` when hosted on Vercel** (see §Analytics decision). Add `<Analytics />` to the root layout. Cookieless (no GDPR cookie banner needed for it), near-zero config, route-aware. Use this as the baseline measurement. |
| `@next/third-parties` | **16.2.7** | Optimized `GoogleAnalytics` (GA4) and `GoogleTagManager` components | If the client wants **GA4** specifically (common for agencies tying into Google Ads / Search Console / Looker). `<GoogleAnalytics gaId="G-XXXX" />` injects `gtag.js` client-side after hydration → static-export compatible. Marked "experimental" by Next but stable in practice; pin to `latest`. Can run *alongside* `@vercel/analytics`. |
| `@vercel/speed-insights` | **2.0.0** | Real-user Core Web Vitals in the Vercel dashboard | Optional. Same client-side-script model as Vercel Analytics → export-compatible on Vercel. Useful given the existing perf CONCERNS (WebGL aurora, particle loops, unoptimized images) — gives a live LCP/CLS signal post-launch. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Google Search Console | Submit `sitemap.xml`, monitor indexing/coverage, see queries | Verify via DNS TXT or the `<meta name="google-site-verification">` tag (add through the Metadata API `verification` field — fully static). Submit the sitemap URL after first deploy. This is the "can't run SEO blind" requirement. |
| `mdx-components.tsx` | Required root file mapping MDX elements → React/Tailwind components | Not optional with `@next/mdx` + App Router. Where you wire `prose`, `next/link`, and the `Icon` wrapper into MDX output. |
| `sharp` (build-time) | Pre-optimize blog/service images to WebP/AVIF since `next/image` optimization is disabled under export | Addresses the "Image Optimization Disabled" CONCERN. Run as a build step or pre-commit; `next/image` stays `unoptimized` but ships already-optimized files. (Out of strict milestone scope but cheap and high-SEO-value.) |

---

## Installation

```bash
# Structured data (types only) + validation
npm install schema-dts@^2 zod@^4

# Blog / FAQ via MDX (local, build-time, static-export safe)
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter remark-gfm
npm install -D @types/mdx
npm install -D @tailwindcss/typography   # add `prose` styling

# Analytics on Vercel (baseline) + optional GA4 + optional web vitals
npm install @vercel/analytics
npm install @next/third-parties          # only if GA4/GTM is wanted
npm install @vercel/speed-insights       # optional

# Sitemap, robots, metadata, generateStaticParams → NO installs (built into Next 16)
```

**No install needed** for: `generateStaticParams`, `app/sitemap.ts`, `app/robots.ts`, the Metadata API (OG/Twitter/canonical/verification), or the honeypot/time-trap (plain React + the Route Handler). That is the point — most of this milestone is built-in Next.js, not new dependencies.

---

## The secure-form decision (the open Key Decision)

**This is the one architectural choice in the milestone.** The current webhook is `NEXT_PUBLIC_GHL_WEBHOOK_URL` — exposed in client JS, spammable directly (CONCERNS: "Webhook URL Exposed Client-Side", "No CSRF Protection").

### Hard constraint, verified against Next.js 16.2.7 docs

Under `output: "export"`, **Route Handlers render a *static* response and only `GET` is supported** — *"If you need to read dynamic values from the incoming request, you cannot use a static export."* Server Actions, Cookies, Headers, Rewrites, and Redirects are **all explicitly unsupported** under export. **Therefore an in-build POST endpoint that reads the form body is impossible while `output: "export"` is set.** Any plan that says "add an App Router API route to proxy the webhook" is wrong *as long as* `output: "export"` remains.

### The three real options

| Option | What it is | Secures webhook? | Cost / tradeoff | Verdict |
|--------|-----------|------------------|-----------------|---------|
| **A. Drop `output: "export"` → Vercel hybrid** | Remove the `output: "export"` line. Vercel still statically pre-renders every page (they serve from the CDN exactly as now), and the single `app/api/contact/route.ts` **POST** handler deploys as one serverless function. Webhook URL becomes a server-only secret (no `NEXT_PUBLIC_`). | ✅ Fully. Client never sees the webhook; Zod validates server-side; you can rate-limit + honeypot-check there. | One serverless function (well within Vercel Hobby/Pro free tier for a brochure site). Lose nothing visible: static pages stay static, same CDN delivery, image optimization can even be *re-enabled*. `next/image` `unoptimized` can stay or go. | ✅ **RECOMMENDED** |
| **B. Keep `output: "export"` + separate serverless function** | Keep the fully-static build; add the POST proxy as a **standalone** Vercel Function in `/api` (a plain `api/contact.ts` outside the Next build, deployed by Vercel's filesystem) or a Cloudflare Worker / other edge function. Client posts to that function; it forwards to GHL with the secret. | ✅ Fully (same server-side guarantees as A). | Two deploy artifacts to reason about (the static `out/` + a hand-managed function); slightly more config; the function lives outside Next's DX. Works, but more moving parts for no real gain over A on Vercel. | ◯ Fallback if there's a hard reason to keep `export` |
| **C. Stay 100% static, mitigate only** | No server at all. Keep the client-side POST to GHL but add: honeypot + time-trap, a *non-`NEXT_PUBLIC`-looking* obfuscation (doesn't actually hide it), and lean on **rate-limiting/validation at GoHighLevel**. | ❌ No. The webhook stays extractable; this only *reduces* spam, doesn't secure the endpoint. | Zero infra change. But it does not resolve the CONCERN — a determined actor still has the URL. | ✗ Insufficient alone; acceptable only as a stopgap |

### Recommendation: **Option A — drop `output: "export"`, go Vercel hybrid.**

Rationale:
1. **It actually fixes the security finding.** Server-only secret + server-side Zod + server-side honeypot/rate-limit is the only path that closes the CONCERN. Options B does too, but with more parts.
2. **On Vercel it is nearly free and nearly invisible.** Pages that are statically renderable stay statically pre-rendered and CDN-served — the user-facing performance and the "it's basically a static site" mental model are preserved. The only addition is one tiny POST function that runs a few hundred ms when someone submits the form.
3. **It removes future friction.** ISR, `next/image` optimization (directly relevant to the "Image Optimization Disabled" perf CONCERN), OG image generation, and any later dynamic feature become available instead of blocked. `output: "export"` is a self-imposed ceiling this project will keep bumping into.
4. **It is reversible and low-risk.** The change is deleting one config line and adding one route file; the existing pages don't need rewriting.

**Tradeoff to log honestly:** the site is no longer portable to a dumb static host (e.g. raw S3/Nginx) without that one function — but the project is committed to Vercel (project ID in PROJECT.md), so this is theoretical. If portability-to-any-static-host were a real requirement, choose **B**.

**Defense-in-depth regardless of A/B/C:** add the **honeypot + time-trap** on the form (zero deps, blocks ~80–99% of naive bots), validate with **Zod**, and keep GHL workflow/rate-limit as a backstop. Consider **Cloudflare Turnstile** (privacy-friendly, free, GDPR-friendlier than reCAPTCHA) only if spam persists after honeypot.

---

## Analytics decision (the other open PROJECT.md question)

**Question in PROJECT.md:** "GA4 vs @vercel/analytics — which actually works with `output: export`?"

**Answer: both work, because both are pure client-side scripts that do not need a Next.js server.** Verified against Vercel + Next docs:

- **`@vercel/analytics`**: The Vercel docs ship a **plain-HTML** integration (`<script defer src="/<unique-path>/script.js">`). The collection endpoints (`/_vercel/insights/*`, `/<unique-path>/*`) are **injected by the Vercel platform/CDN at deploy time — not by the Next.js server.** So a statically-exported site *hosted on Vercel* gets working analytics: the `<Analytics />` component just loads a script and beacons to a CDN route. **Requirement: it must be deployed on Vercel and Web Analytics enabled in the dashboard.** (It will *not* work if you self-host the `out/` folder elsewhere.)
- **GA4 via `@next/third-parties`** (`<GoogleAnalytics gaId="G-…" />`): injects `gtag.js` **client-side after hydration**. No server dependency at all → works under export on *any* host.

**Recommendation:** Ship **`@vercel/analytics`** as the zero-config baseline (cookieless → no cookie-consent banner needed for it, good for a Dutch/EU site). Add **GA4 via `@next/third-parties`** if the client/agency wants Google-ecosystem reporting (Ads, Search Console linkage, Looker). They coexist. Either way, this does **not** force or block the form decision — analytics works under export *or* hybrid.

> Note: Option A (hybrid) makes analytics even simpler, but it is **not required** for analytics. The two decisions are independent.

---

## Data-driven service pages — the pattern (not a library)

The "20+ maintainable pages from one taxonomy" requirement is a **code pattern**, not a dependency:

1. Define the taxonomy once in `lib/services-data.ts` — a typed array of pillars (Airconditioning, Warmtepompen, WTW, Mechanische Ventilatie) → sub-services (Installatie/Onderhoud/Reparatie/Advies, etc.) → optional brands (Daikin, Mitsubishi Electric/Heavy/Ecodan).
2. Route folder `app/diensten/[pillar]/[service]/page.tsx` (or a single `[...slug]` catch-all).
3. `export function generateStaticParams()` returns every pillar×service(×brand) combo → Next pre-renders one static HTML page each.
4. `export function generateMetadata({ params })` builds the per-page `<title>`/description/canonical/OG from the taxonomy.
5. The **same** `lib/services-data.ts` feeds `app/sitemap.ts`, the Navbar `DIENSTEN_DROPDOWN`, breadcrumbs, and the `Service` + `BreadcrumbList` JSON-LD — single source of truth, zero drift. This also pays down the existing "inline data mixed with layout" tech-debt CONCERN by moving content into data files.

This pattern is fully `output: "export"`-compatible (it's the canonical Next static-export approach) **and** works unchanged if you adopt Option A.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Built-in `app/sitemap.ts` + `app/robots.ts` | `next-sitemap` (4.2.3) | Only if you need exotic XML extensions the built-in types don't model (e.g. Google News tags), or a postbuild crawl of arbitrary output. For this site the built-in is strictly less brittle and one fewer dep. |
| Next Metadata API | `next-seo` | Pages Router projects, or teams already standardized on it. In App Router it's redundant — the Metadata API covers OG/Twitter/canonical/verification natively. |
| `schema-dts` (typed objects + `<JsonLd>`) | `react-schemaorg` | If you want a ready-made `<JsonLd>` React wrapper. But `react-schemaorg` is effectively unmaintained; rolling a 5-line `<JsonLd>` over `schema-dts` types is safer and trivially small. |
| `@next/mdx` + `gray-matter` | `next-mdx-remote` (6.0.0) / `next-mdx-remote-client` (2.1.11) | Only if posts come from a **remote** source (CMS/DB) at build/runtime. The blog is in-repo (PROJECT.md: "content in-repo, no CMS yet"), so local `@next/mdx` is simpler and faster. |
| `@next/mdx` + `gray-matter` | `fumadocs-mdx` (15.0.10) / Velite | Docs-heavy sites or when you want a typed content layer with schema validation. Overkill for a handful of FAQ/blog posts; revisit if the blog grows large. |
| Honeypot + time-trap (+ optional Turnstile) | Cloudflare Turnstile / hCaptcha | Add a visible challenge only if honeypot+time-trap proves insufficient against persistent spam. Prefer Turnstile over reCAPTCHA for privacy/GDPR. |
| Zod v4 | Valibot | If bundle size in *client* validation is hyper-critical (Valibot is more tree-shakeable). For a brochure form, Zod v4 is already small and the team-standard; not worth the divergence. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| A **GET-only Route Handler as a "secure form proxy"** under `output: "export"` | Verified impossible: under export, Route Handlers are static + GET-only and **cannot read the request body**. It will not work — this is the #1 trap in planning this milestone. | Option A (drop export → hybrid POST) or Option B (separate serverless function). |
| **Server Actions** for the form | Explicitly **unsupported** under `output: "export"`; and even after Option A they're heavier than a plain POST Route Handler for one webhook forward. | A single `app/api/contact/route.ts` POST handler (after Option A). |
| `next-sitemap` | Extra dependency + postbuild crawl step to replicate what `app/sitemap.ts` does natively and type-safely. | Built-in `app/sitemap.ts` (+ `app/robots.ts`). |
| `next-seo` | Redundant in the App Router; the Metadata API already covers OG/Twitter/canonical/verification and is what the codebase already uses. | Next Metadata API (`metadata` / `generateMetadata`). |
| `contentlayer` | Effectively unmaintained / broken on recent Next versions; a known dead-end for new App-Router projects. | `@next/mdx` + `gray-matter`. |
| **reCAPTCHA v2/v3** | GDPR/privacy friction (sends data to Google, often needs consent), adds UX cost and a heavy script, and v3's score model is opaque — disproportionate for a small contact form. | Honeypot + time-trap first; Cloudflare **Turnstile** only if needed. |
| Manually pasting **gtag** `<script>` into the layout `<head>` | Loads render-blocking, untimed, and you re-solve route-change pageviews yourself. | `@next/third-parties` `GoogleAnalytics` (deferred, optimized, route-aware) or `@vercel/analytics`. |
| Keeping `NEXT_PUBLIC_GHL_WEBHOOK_URL` client-side "with obfuscation" | Obfuscation does not secure it; the URL stays extractable. Does not close the CONCERN. | Move it server-side via Option A (no `NEXT_PUBLIC_` prefix). |
| A **headless CMS** (Sanity/Contentful) this milestone | Out of scope per PROJECT.md ("content in-repo, no CMS yet"); adds infra + auth + build coupling for content Claude is drafting into the repo anyway. | TS data files (`lib/services-data.ts`) + local MDX. |

---

## Stack Patterns by Variant

**If the team accepts dropping `output: "export"` (recommended):**
- Remove `output: "export"` from `next.config.ts`; add `app/api/contact/route.ts` (POST) that Zod-validates + honeypot-checks, then forwards to GHL using a **server-only** `GHL_WEBHOOK_URL`.
- Optionally re-enable `next/image` optimization (drop `unoptimized`) to address the image perf CONCERN for free.
- Pages remain statically pre-rendered + CDN-served on Vercel; only the form route is a function.

**If the team insists on staying fully static (`output: "export"`):**
- Keep export; add a **standalone** Vercel Function (`api/contact.ts` at repo root, outside the Next build) or a Cloudflare Worker for the POST proxy with the server-only secret.
- Analytics, sitemap, robots, JSON-LD, MDX blog, and the `generateStaticParams` service pages **all still work** unchanged — none of those require relaxing export.
- Accept that the form path now has a second deploy artifact to maintain.

**If the client wants Google-ecosystem reporting:**
- Add GA4 via `@next/third-parties` (`GoogleAnalytics`) in the root layout, ID from `NEXT_PUBLIC_GA_ID`; keep `@vercel/analytics` for cookieless baseline. Add the Search Console verification meta via the Metadata API `verification.google` field.

**If the blog grows beyond ~20 posts or needs taxonomy/search:**
- Revisit `fumadocs-mdx`/Velite for a typed content layer; until then `@next/mdx` + `gray-matter` is the right size.

---

## Version Compatibility

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| `next` | 16.2.7 | React 19.2.x | Base, already installed. All built-ins below ship with it. |
| `@next/mdx` | 16.2.7 | next 16.2.x | Keep `@next/mdx` major in lockstep with `next`. Requires peer `@mdx-js/loader` + `@mdx-js/react` (3.x) and a mandatory `mdx-components.tsx`. |
| `@next/third-parties` | 16.2.7 | next 16.2.x | Versioned with Next; install with `@latest`. Marked experimental but stable for GA4/GTM. |
| `@vercel/analytics` | 2.0.1 | Any (Next/React/HTML) | v2 is MIT-licensed, adds "Resilient Intake". **Requires Vercel hosting + Web Analytics enabled** for data to flow. Works under `output: "export"` on Vercel. |
| `@vercel/speed-insights` | 2.0.0 | Vercel hosting | Same client-script model; export-safe on Vercel. |
| `zod` | 4.4.3 | TS 5.x | v4 is a rewrite vs v3 — import paths/APIs differ from old v3 snippets; follow v4 docs. Tree-shakeable; use in both client form and server route. |
| `schema-dts` | 2.0.0 | TS 5.x | Types only, zero runtime. Pairs with a hand-rolled `<JsonLd>` server component. |
| `gray-matter` | 4.x | Node (build-time/server only) | Cannot run client-side; use in server components / build scripts to read MDX frontmatter. |
| `@tailwindcss/typography` | 0.5.x | Tailwind v4 | `prose` plugin; wire into `app/globals.css`/`mdx-components.tsx`. Map text color to `on-surface` to honor the no-100%-black design rule. |
| `remark-gfm` | 4.x | @next/mdx 16.x | With **Turbopack**, pass plugins by string name, not function reference (Rust core limitation). |

---

## Confidence Assessment

| Claim | Confidence | Basis |
|-------|------------|-------|
| `generateStaticParams` is the supported way to ship the 20+ pages under export | **HIGH** | Official Next.js 16.2.7 static-export docs (explicit: dynamic routes need `generateStaticParams`; `dynamicParams:true` unsupported). |
| `app/sitemap.ts` + `app/robots.ts` render to static files under export | **HIGH** | Official Next.js 16.2.7 docs — both are cached Route Handlers → static at build. |
| POST Route Handler / Server Actions impossible under `output: "export"` | **HIGH** | Official docs: Route Handlers static + GET-only, "cannot read dynamic values from the request"; Server Actions listed as unsupported. |
| Dropping export → Vercel still pre-renders pages + deploys one POST function | **HIGH** | Vercel Next.js framework docs + static-export semantics; standard hybrid behavior. |
| `@vercel/analytics` works under export *on Vercel* (platform-injected endpoints) | **HIGH** | Vercel Web Analytics docs ship a plain-HTML script integration; endpoints injected at deploy by the platform, not the Next server. |
| GA4 via `@next/third-parties` works under export (client-side gtag) | **HIGH** | Official Next.js 16.2.7 third-parties docs — injects gtag after hydration, no server dep. |
| `@next/mdx` is local/build-time → static-export safe; blog via `[slug]`+`generateStaticParams` | **HIGH** | Official Next.js 16.2.7 MDX docs (explicit local-file sourcing + the exact dynamic-route example). |
| Library versions (zod 4.4.3, @vercel/analytics 2.0.1, schema-dts 2.0.0, next-sitemap 4.2.3, @next/mdx 16.2.7, @vercel/speed-insights 2.0.0) | **HIGH** | Live `npm view` on 2026-06-02. |
| `gray-matter`/`remark-gfm`/`@tailwindcss/typography`/`@mdx-js/*` exact patch versions | **MEDIUM** | Major lines confirmed via Next docs + ecosystem; exact patch not pinned here (install `@latest` within the stated major). |
| Honeypot+time-trap blocks ~80–99% of naive bots | **MEDIUM** | Multiple security/anti-spam sources agree; figure is directional, not guaranteed. |

---

## Sources

- https://nextjs.org/docs/app/guides/static-exports — Next.js 16.2.7: supported/unsupported features under `output: "export"`; Route Handlers static + GET-only; Server Actions/Cookies/Headers/Redirects unsupported (HIGH)
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — `app/sitemap.ts` is a cached Route Handler → static `sitemap.xml`; `MetadataRoute.Sitemap` (HIGH)
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots — `app/robots.ts` → static `robots.txt` with sitemap reference (HIGH)
- https://nextjs.org/docs/app/guides/mdx — Next.js 16.2.7: `@next/mdx` local-file sourcing, required `mdx-components.tsx`, `[slug]`+`generateStaticParams`+`dynamicParams:false`, `@tailwindcss/typography`, frontmatter via gray-matter/remark, Turbopack plugin-string caveat (HIGH)
- https://nextjs.org/docs/app/guides/third-party-libraries — Next.js 16.2.7: `@next/third-parties` `GoogleAnalytics`/`GoogleTagManager`, client-side gtag injection (HIGH)
- https://vercel.com/docs/analytics/quickstart — `@vercel/analytics` install per framework incl. plain-HTML script; `/_vercel/insights` + `/<unique-path>` endpoints added at deploy (HIGH)
- https://vercel.com/docs/analytics/package — `@vercel/analytics` v2 (MIT, Resilient Intake); `inject()` for "other"/"html"; confirms client-side-only model (HIGH)
- https://vercel.com/docs/frameworks/full-stack/nextjs + community/blog corroboration — Vercel hybrid: static pre-rendered pages on CDN + Route Handlers as serverless functions when `output: "export"` is omitted (MEDIUM→HIGH, multi-source)
- npm registry (`npm view`, 2026-06-02) — zod 4.4.3, @vercel/analytics 2.0.1, @vercel/speed-insights 2.0.0, schema-dts 2.0.0, @next/mdx 16.2.7, @next/third-parties 16.2.7, next-sitemap 4.2.3, next-mdx-remote 6.0.0, fumadocs-mdx 15.0.10, react 19.2.7 (HIGH)
- Anti-spam (honeypot + time-trap) — staticforms.dev, datadome.co, dev.to consensus on layered honeypot+timing for static-site forms (MEDIUM)

---
*Stack research for: Dutch HVAC/klimaattechniek SEO lead-gen site on Next.js 16 static export → Vercel*
*Researched: 2026-06-02*
