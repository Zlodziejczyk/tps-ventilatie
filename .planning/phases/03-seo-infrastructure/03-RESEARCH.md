# Phase 3 Research — SEO Infrastructure

**Mode:** light inline research (no subagent; OneDrive execution constraint — same as Phase 2).
**Researched:** 2026-06-05
**Answers:** "How do we instrument all ~27 routes for indexing — sitemap, robots, JSON-LD,
canonical/metadataBase/OG, analytics + GSC — on Next.js 16 `output: export`, BEFORE final
copy lands (Phase 4)?"

Every architectural decision is already locked in `03-CONTEXT.md` (D-01…D-07). This note
records the *technical how* on Next 16, the live-config confirmation D-01 demanded, the
package legitimacy audit, the validation harness, and the pitfalls a verbatim-from-the-plan
executor must not trip on. The data contract is the Phase-1 taxonomy (`lib/services/`) +
`SITE` (`lib/constants.ts`); this phase is the **instrumentation layer** over it.

## 1. Canonical host — LIVE-CONFIRMED (D-01)

D-01 required confirming the served www-vs-apex primary so the emitted canonical equals the
served origin. Probed 2026-06-05:

```
https://tpsventilatie.nl      → 200  (apex is the served primary)
https://www.tpsventilatie.nl  → 301 → https://tpsventilatie.nl/   (www→apex redirect IS in place)
```

→ **`CANONICAL_ORIGIN = "https://tpsventilatie.nl"` (apex)** is correct and canonical == served
origin. No redirect/canonical mismatch. `metadataBase`, every `alternates.canonical`, OG `url`,
sitemap `<loc>`, robots `Sitemap:`, and JSON-LD `url`/`@id` all use this exact origin. Brand
**name** stays "TPS klimaattechniek" (name ≠ domain is deliberate, D-01). The owner runbook
still lists "re-confirm www→apex 301 before launch" as a cheap pre-launch check; `assert-seo.ts`
asserts the constant equals the apex string so it can't silently drift.

## 2. Route conventions (Next 16 App Router + static export)

`output: "export"` (unchanged this phase — Phase 5 owns that gate) means **everything is
build-time**; no runtime, no `ImageResponse`. The Metadata file conventions all support this:

- **`app/sitemap.ts`** → `export const dynamic = "force-static"; export default function
  sitemap(): MetadataRoute.Sitemap` returning an array of `{ url, lastModified? }`. `force-static`
  is required under `output: export` (success criterion 1 / SEO-01). Emits `/sitemap.xml`.
- **`app/robots.ts`** → `export const dynamic = "force-static"; export default function
  robots(): MetadataRoute.Robots`. The `rules` field accepts an **array** of
  `{ userAgent, allow, disallow? }` so we can list `*` plus each AI bot explicitly; `sitemap`
  takes the absolute URL; `host` takes the apex. Emits `/robots.txt` (SEO-02 / D-03).
- **Per-page metadata** → static pages keep `export const metadata` (now built by the shared
  `buildMetadata`); the two dynamic routes keep `generateMetadata` (Next 16: `params` is a
  **Promise** — `await params` already in place from Phase 2; do not regress it). The Phase-2
  seam returns only `{ title, description }`; Phase 3 widens it to canonical + OG/Twitter +
  per-page `robots` via one builder so nothing drifts (D-05).
- `metadataBase = new URL(CANONICAL_ORIGIN)` is set **once** on the root layout; relative
  `alternates.canonical` would resolve against it, but we emit **absolute** canonicals via
  `absoluteUrl(urlFor(node))` for zero ambiguity. `trailingSlash:false` is already locked
  (P1 D-03) → non-root canonicals carry no trailing slash; root canonical = `${origin}/`.

### ⚠ Pitfalls
- `app/sitemap.ts` / `app/robots.ts` **must** export `dynamic = "force-static"`, else the
  export build can error or skip them under `output: export`.
- `MetadataRoute.Sitemap` / `MetadataRoute.Robots` are the correct return types (import from
  `next`). Returning a bare object instead of the array shape silently drops entries.
- Do **not** add a dynamic `app/opengraph-image.tsx` (`ImageResponse` needs a runtime → breaks
  static export). Use ONE static asset (`/og-default.jpg`), D-05.

## 3. JSON-LD — server-rendered, XSS-safe (D-04, SEO-03)

One reusable server component injects every block as `<script type="application/ld+json">`,
zero client JS:

```tsx
export function JsonLd({ data }: { data: object }) {
  // Escape "<" so a string value can never break out of the </script> context.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
```

- **Site-wide** `HVACBusiness` (a LocalBusiness subtype — stronger HVAC signal) built entirely
  from `SITE`: `name`, `address` (PostalAddress), `geo` (GeoCoordinates), `telephone`, `email`,
  `url` (origin), `areaServed` = `GeoCircle { geoMidpoint: geo, geoRadius: 60000 }` **and** the
  named `serviceAreas` as `Place[]`, `priceRange`, `image`/`logo`, stable `@id =
  ${origin}/#business` so per-page `Service` nodes reference it as `provider`. If a coverage gap
  shows up in the Rich Results Test, widen to `@type: ["HVACBusiness","LocalBusiness"]`.
- **NO `aggregateRating` / `review`** in Phase 3 — reserved for Phase 4 (CONT-08); wire the
  builder so the slot is easy to add, but emit nothing now (Google review-snippet guideline /
  manual-action safety).
- **Per-page:** `serviceJsonLd(node)` (pillar + sub-service; `provider`→business `@id`,
  `areaServed`, `serviceType`/`name` from `navTitle`/`primaryKeyword`), `breadcrumbJsonLd(node)`
  from `trailFor(node)` (already shaped for this, P2 D-13 — map each crumb href through
  `absoluteUrl`), `faqJsonLd(node)` from `content.faqs` returning **null when empty** (renders
  only once Phase 4 fills FAQs on published pages).
- MUST validate in Google's Rich Results Test (success criterion 3). Regio signals (SEO-06)
  land here via `areaServed`/`serviceAreas` and in the sitewide description/OG — page-body regio
  copy is Phase 4.

## 4. Indexing policy — the all-draft reality (D-02)

**Critical:** every node in the registry is currently `status: "draft"` — including the 4
static pages. A naïve `status === "published"` rule would noindex the whole site. So the policy
keys off **type**, mirroring `urlFor()`'s single-source pattern (`lib/seo/policy.ts`):

```ts
isIndexable(node):
  if node.type === "static": return node.pathSegment !== "privacy-beleid"   // statics render real content now
  return node.status === "published"                                         // hub/pillar/service gate on the editorial flip
```

Net at Phase-3 close: **sitemap = exactly the 4 static content pages** (`/`, `/tarieven`,
`/over-ons`, `/contact`); `privacy-beleid` is `noindex,follow` + excluded; the hub `/diensten`
and all 4 pillar + 17 service pages are `noindex,follow` + excluded (draft) and **auto-enter**
the sitemap + flip to `index` when Phase 4 sets `status:"published"` (CONT-10 — one lever, no
parallel list, no Phase-3 rework). `sitemapEntries()` and the per-page `robots` directive both
read this one helper, so membership can never diverge from the index directive.

## 5. Analytics + Speed Insights (D-06, SEO-09) + Package Legitimacy Audit

`@vercel/analytics/next` `<Analytics/>` + `@vercel/speed-insights/next` `<SpeedInsights/>` in
the root layout. Both are cookieless / privacy-friendly → no consent banner, minimal AVG scope
(aligns LEAD-06); Speed Insights provides the field CWV/INP signal feeding SEO-10 (Phase 5).
They are client components but compose fine under `output: export` (they mount on the client;
no server runtime needed). **Enabling** them is an owner Vercel-dashboard step (runbook).
GA4 = deferred consent-gated slot (not shipped) — adding it later pulls in a cookie-consent
mechanism + privacy-policy processor mention.

### Package Legitimacy Audit (npm install gate)

| Package | Disposition | Provenance |
|---------|-------------|------------|
| `@vercel/analytics` | **[OK] legitimate** | First-party Vercel, `@vercel` org-scoped (typosquat-proof), `npmjs.com/package/@vercel/analytics`, millions of weekly downloads, MIT. |
| `@vercel/speed-insights` | **[OK] legitimate** | First-party Vercel, `@vercel` org-scoped, `npmjs.com/package/@vercel/speed-insights`, official CWV product, MIT. |

Both are org-scoped first-party packages → classified `[OK]`, no blocking human-verify
checkpoint required (the gate fires only on `[ASSUMED]`/`[SUS]`). Pin via `package-lock.json`.

## 6. Google Search Console verification (D-06, SEO-09)

In-repo `google-site-verification` meta tag via Next Metadata `verification: { google: value }`,
where `value = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (a public token by design — not
a secret; safe under `NEXT_PUBLIC_`). Emit the verification key only when the env var is set
(empty string → omit, so we never ship an empty/invalid tag). DNS-TXT domain-level verification
is documented in the runbook as the optional owner upgrade. Submitting the sitemap is an owner
GSC step (runbook).

## 7. OG image (D-05)

ONE branded static 1200×630 `public/og-default.jpg`, referenced by the metadata builder default
+ the layout OG defaults. Static export rules out dynamic generation, so seed it from the
existing `public/images/hero-ventilatie.jpg` via macOS `sips` (darwin env confirmed):
`sips --resampleWidth 1200` then center-crop `sips -c 630 1200`. Per-pillar OG images +
bespoke design are explicitly deferred (CONTEXT). The builder references the path as a string,
so code does not block on the asset; the whole-phase build gate (03-08) proves it resolves.

## Validation Architecture (Nyquist anchor)

This phase's validation harness is **build-time assertion + green static export**, extending
the Phase-1/Phase-2 pattern (`scripts/assert-*.ts`, Node `assert/strict`, no test framework
this milestone per REQUIREMENTS):

1. **Policy assertions** — new `scripts/assert-seo.ts` (mirrors `assert-registry.ts`): `isIndexable`
   yields exactly the 4 static pages (home/tarieven/over-ons/contact); `privacy-beleid`, the hub,
   and every pillar/service are excluded; `sitemapEntries()` length === 4 and every entry is an
   absolute apex URL; `CANONICAL_ORIGIN === "https://tpsventilatie.nl"`; `businessJsonLd()` is
   `@type` `HVACBusiness`, has a stable `@id`, and carries **no** `aggregateRating`/`review` key.
2. **Export coverage** (whole-phase gate, 03-08): `npm run build` green (runs the Phase-1
   prebuild taxonomy gate first), then grep `out/`: `out/sitemap.xml` lists the 4 static absolute
   URLs and excludes `/privacy-beleid` + `/diensten/*`; `out/robots.txt` has the absolute
   `Sitemap:` apex pointer + an AI-bot allow line; a built page contains `application/ld+json` +
   `HVACBusiness`; a built **draft** page (e.g. `out/diensten/airconditioning.html`) contains
   `noindex`; `out/index.html` `<title>` no longer contains the stale "TPS Ventilatie".
3. **Anti-drift greps**: no `keywords` array left in `app/layout.tsx`; no hardcoded business data
   (all from `SITE`); `next.config.ts` `output:"export"` untouched.

Each plan carries its own `acceptance_criteria`; 03-08 runs the whole-phase gate. No separate
test runner is introduced (consistent with Phases 1–2).

## Open questions / assumptions

- **A-1** `SITE.geo` (lat 52.0607 / lng 4.4940) is the **owner-verify-pending** Zoetermeer
  centroid placeholder (P1 D-12 / CONCERNS). JSON-LD `geo` ships with this value now; the runbook
  flags "confirm the real business lat/lng" as a shared input for JSON-LD `geo` + the GBP pin +
  Phase-5 QA-05 Maps embed. Not a Phase-3 blocker — the structure ships, the value is a runbook
  confirm.
- **A-2** `serviceAreas[]` is the owner-review-pending seed coverage list (P1 D-11). `areaServed`
  reads it as-is; owner curates before publish (never claim an unserved area).
- **A-3** Brand `sameAs` (GBP URL + socials) is owner-pending → `businessJsonLd` omits `sameAs`
  until the owner supplies the GBP/social URLs (runbook). Omitting an optional property is valid
  JSON-LD; do not emit empty/placeholder URLs.
- **A-4** GBP primary category `Airconditioningsbedrijf` is the recommended default, flagged for
  owner confirmation in the runbook (D-07) — a GBP dashboard action, nothing in repo depends on it.
