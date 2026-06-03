# Phase 2 Research — Routes & Service-Page Templates

**Mode:** light inline research (no subagent; OneDrive execution constraint).
**Researched:** 2026-06-03
**Answers:** "How do we render the Phase-1 taxonomy as ~22 static routes + 6 reusable
server components + taxonomy-derived nav, on Next.js 16 `output: export`?"

The Phase-1 taxonomy (`lib/services/`) is the data contract; this phase is the
**render layer**. Most architectural decisions are already locked in `02-CONTEXT.md`
(D-01…D-14). This note records the *technical how* + the validation harness + the
pitfalls a verbatim-from-the-plan executor must not trip on.

## 1. Route architecture (Next 16 App Router + static export)

Nested dynamic segments enumerated from `PAGES`, no runtime:

```
app/diensten/page.tsx                         → /diensten            (hub, static)
app/diensten/[pillar]/page.tsx                → /diensten/{pillar}   (4 pillars)
app/diensten/[pillar]/[service]/page.tsx      → /diensten/{pillar}/{service} (17 subs)
```

- Each dynamic segment exports `export const dynamicParams = false;` so any
  non-enumerated path 404s at build/export (success criterion 2 + IA-04 anti-drift).
- `generateStaticParams()`:
  - pillar route → `pillars().map(p => ({ pillar: p.pillarSlug }))` → 4 entries.
  - service route → all 17 `{ pillar, service }` pairs from `childrenOf` across pillars.
- `output: "export"` (next.config.ts, unchanged this phase) means **everything is
  build-time**; no `fetch`, no server runtime. The taxonomy import is plain TS data,
  so it resolves at build with zero runtime cost.

### ⚠ Pitfall — async params (Next 15+/16)

In Next 16, `params` and `searchParams` are **Promises** in page components and in
`generateMetadata`. Every dynamic page/metadata fn MUST await:

```ts
type Params = Promise<{ pillar: string; service: string }>;
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { pillar, service } = await params;
  const node = findService(pillar, service);
  return { title: node?.content.metaTitle, description: node?.content.metaDescription };
}
export default async function Page({ params }: { params: Params }) {
  const { pillar, service } = await params;
  const node = findService(pillar, service);
  if (!node) return notFound(); // belt-and-suspenders; dynamicParams=false already guards
  …
}
```

Forgetting `await` is the single most likely build/type failure — it is called out in
every route plan's acceptance criteria.

## 2. Registry lookups to add (D-14) — `lib/services/registry.ts`

Small, pure, typed; kept in `registry.ts` under the documented no-barrel exception.
`PillarPage` / `ServicePage` are already exported from `./types`.

| Helper | Returns | Used by |
|--------|---------|---------|
| `pillars()` | `PillarPage[]` (4) | hub cards, mega-menu, generateStaticParams |
| `findPillar(slug)` | `PillarPage \| undefined` | pillar route + metadata |
| `childrenOf(slug)` | `ServicePage[]` | pillar sub-grid, mega-menu, service generateStaticParams |
| `findService(p, s)` | `ServicePage \| undefined` | service route + metadata |
| `siblingsOf(p, s)` | `ServicePage[]` (same pillar, excl self) | RelatedServices (D-11) |
| `brandsForPillar(slug)` | `string[]` (deduped union of children `brandIds`) | pillar BrandGrid (D-02) |
| `trailFor(node)` | `Crumb[]` (`{label,href}`) | Breadcrumbs (D-03); Phase-3 reuses for BreadcrumbList JSON-LD |
| `pillarTarievenTab(slug)` | `string \| null` | tarieven CTA target (see §5) |

`trailFor` shape: Home → Diensten → [Pillar] → [Service] via each node's `navTitle`
and `urlFor()`. Last crumb = current page (the component renders it non-linked).

## 3. The 6 IA-05 components (all server components, D-03/D-10)

Composed by the route templates. Placed flat in `components/` (matches the existing
flat convention — no precedent for subdirs).

- **ServiceHero(node)** — tonal-bg section + `Icon` + `h1` + intro (falls back to
  `navDescription` when `content.intro === ""`, D-06) + "Offerte aanvragen" CTA →
  `/contact` (Phase 5 swaps to the secure route). Reuses `AnimateOnScroll`.
- **ServiceSteps(steps)** — numbered list (salvages the existing 10-step visual);
  **omitted when `steps` is empty** (D-06). `StaggerChildren`.
- **ServiceFAQ(faqs, localAngle?)** — disclosure list; the `localAngle` regio line
  renders just above (D-01); **omitted when `faqs` is empty**.
- **Breadcrumbs(node)** — renders `trailFor(node)`; exposes the trail in a Phase-3-
  reusable shape; uses `Icon` chevrons, `urlFor` hrefs.
- **BrandGrid(brandIds)** — resolves ids → `BRANDS`; **omitted when empty**. See §4.
- **RelatedServices(node)** — `siblingsOf` → `ServiceCard` grid (same-pillar, D-11);
  on a pillar page shows the *other pillars* instead.

Motion is the cheap reused tier only (`AnimateOnScroll`/`StaggerChildren`); **no
`SoftAurora`, no canvas particles** on any service page (D-10 / SEO-10 mobile CWV).

## 4. Brand rendering decision (no asset files exist)

`public/images/brands/` does **not** exist — the `logo` paths in `brands.ts`
(`/images/brands/daikin.svg` …) point at nothing. Rendering `<img>`/`<Image>` would
404. Decision: **BrandGrid renders text-based brand chips** (the sketch `.logo-chip`
pattern — a small CSS `.mark` square + the brand `name`, grayscale→brand-color on
hover), **not** image tags. This:
- avoids broken-image 404s on the 2 Installatie pages,
- needs no owner-pending asset delivery to ship Phase 2,
- and **never renders an "erkend installateur"/dealer claim** (`erkendInstallateur`
  is `false` for every brand — owner-verified in Phase 4 / CONT-03).
Real SVG logos + dealer status are a Phase-4 swap behind the same `brandIds` contract.

## 5. Tarieven seam (porting watch-item, D-05)

`PricingTabs` tabs are `wtw | mv | airco` only — there is **no warmtepompen tab**
(WP pricing is "op maat via offerte", CONT-05/Phase 4). `pillarTarievenTab` maps
airconditioning→`airco`, wtw→`wtw`, mechanische-ventilatie→`mv`, **warmtepompen→null**.
When null, the template shows "Offerte aanvragen" → `/contact` and omits the price
link (never links to a non-existent tab).

## 6. Nav (IA-07) — client components read the taxonomy

`Navbar`/`MobileMenu` are already `"use client"`. The registry is plain data, safe to
import client-side. The mega-menu (D-07) replaces `DienstenPanel`'s hardcoded
`DIENSTEN_DROPDOWN` with 4 pillar columns from `pillars()` + `childrenOf()`; mobile
(D-08) becomes a 2-level accordion (`useState` for the open pillar). `DIENSTEN_DROPDOWN`
is removed from `lib/constants.ts`; `NAV_LINKS`/`TARIEVEN_DROPDOWN`/`SITE`/`DropdownItem`
stay. `DienstenNav` is retired (D-09) — used only in the current `/diensten` page.

## 7. Metadata seam (D-13)

Phase 2 wires **basic** `generateMetadata` → `{ title: content.metaTitle, description:
content.metaDescription }` only. Canonical, `metadataBase`, OG/Twitter, and all JSON-LD
stay in **Phase 3**. No page ships metadata-less.

## Validation Architecture (Nyquist anchor)

This rendering phase's validation harness is **build-time assertion + green export**,
extending the Phase-1 pattern (`scripts/assert-registry.ts`, Node `assert/strict`, no
test framework this milestone per REQUIREMENTS):

1. **Lookup assertions** (extend `scripts/assert-registry.ts`): `pillars().length === 4`;
   Σ`childrenOf` over pillars === 17; `siblingsOf` excludes self & shares pillar;
   `brandsForPillar` = {airco:3, warmtepompen:2, wtw:0, mv:0}; `trailFor` lengths
   (hub→2, pillar→3, service→4); `pillarTarievenTab` mapping incl. warmtepompen→null.
2. **Route coverage** (final verification): `npm run build` green (runs the Phase-1
   prebuild taxonomy gate first), and `out/` contains all 22 service routes
   (1 hub + 4 pillar + 17 service HTML files) — every route pre-rendered.
3. **Anti-drift greps**: no `DienstenNav` import remains; no `DIENSTEN_DROPDOWN` in
   constants; no "Panasonic" in app/components; `serviceRadiusKm`/NAP untouched.

This is the project-idiomatic validation layer; no separate test runner is introduced
(consistent with Phase 1). Each plan carries its own `acceptance_criteria`; 02-06 runs
the whole-phase gate.

## Open questions / assumptions

- **A-1** Brand chips are text lockups (no SVG assets) — see §4. Safe, owner-pending
  assets do not block Phase 2.
- **A-2** Content port (D-04) is mechanical salvage into `status: "draft"` shells; the
  ≥120-word/uniqueness gate is status-gated so it never fires on drafts. Warmtepompen
  ships empty (graceful omit, D-06). Phase 4 owns editorial expansion + sign-off.
- **A-3** `components/` stays flat (6 new files) to match the established convention.
