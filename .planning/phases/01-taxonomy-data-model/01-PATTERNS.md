# Phase 1: Taxonomy & Data Model - Pattern Map

**Mapped:** 2026-06-02
**Files analyzed:** 13 (7 new, 6 modified)
**Analogs found:** 9 / 13 with a real in-repo analog; 4 new files are genuinely novel (Zod schemas + prebuild script) — pointed to RESEARCH.md patterns + the nearest convention instead of forcing a weak match.

> This is a **build-time TS data + validation** phase. There are no controllers/components/services in the web sense. "Data flow" below is adapted to this project: how each file's data is produced and consumed (data-declaration, aggregation/transform, build-gate, config, copy-edit).
>
> The single most important real analog is **`lib/constants.ts`** — its `SITE` object (single-source-of-truth to EXTEND, not parallel), its `DropdownItem` interface, and its `DIENSTEN_DROPDOWN`/`TARIEVEN_DROPDOWN` SCREAMING_SNAKE_CASE typed-data arrays are the closest analog for BOTH the `SITE` extension AND every typed taxonomy data file. The `type Tab` union in `components/PricingTabs.tsx` is the analog for the page-type discriminant.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `lib/services/types.ts` | model (shared types) | type-declaration + (NEW) Zod schema | `lib/constants.ts` `DropdownItem` (interface), `components/PricingTabs.tsx` `type Tab` (discriminant union) | role-match (types); **no analog** for Zod schemas → RESEARCH §Code Examples |
| `lib/services/airconditioning.ts` | model (typed data node) | data-declaration | `lib/constants.ts` `DIENSTEN_DROPDOWN`; `components/PricingTabs.tsx` `TABS`/`WTW_UNITS` | role-match |
| `lib/services/warmtepompen.ts` | model (typed data node) | data-declaration | same as above | role-match |
| `lib/services/wtw.ts` | model (typed data node) | data-declaration | same as above | role-match |
| `lib/services/mechanische-ventilatie.ts` | model (typed data node) | data-declaration | same as above | role-match |
| `lib/services/brands.ts` | model (normalized registry) | data-declaration (by-id map) | `lib/constants.ts` `SITE` (`as const` keyed object) | role-match |
| `lib/services/registry.ts` | aggregation module + utility | aggregation/transform (PAGES + `urlFor()` + lookups + `validateTaxonomy()`) | `lib/forms.ts` (pure helper returning a result object); `components/PricingTabs.tsx` exhaustive `switch`-style mapping | partial — **documented no-barrel exception** (D-05) |
| `scripts/validate-taxonomy.ts` | build script (prebuild gate) | build-gate (import → `safeParse` → `process.exit(1)`) | **no analog** (no `scripts/` dir exists) → RESEARCH §Pattern 4 / §Code Examples | none |
| `lib/constants.ts` (MODIFY) | config (single source) | data-declaration (EXTEND `SITE`) | `lib/constants.ts` `SITE` itself (extend in place) | exact (self) |
| `app/tarieven/page.tsx:62` (MODIFY) | page (copy edit) | copy-edit (SITE-sourced string) | `components/CTABanner.tsx` SITE-consumption pattern (CLAUDE.md guardrail) | role-match |
| `components/PricingTabs.tsx:442,519` (MODIFY) | component (copy edit) | copy-edit (SITE-sourced string) | same SITE-consumption pattern | role-match |
| `package.json` (MODIFY) | config | config (add `prebuild` script + deps) | `package.json` `scripts` block itself | exact (self) |
| `next.config.ts` (MODIFY) | config | config (add `trailingSlash: false`) | `next.config.ts` itself | exact (self) |

---

## Pattern Assignments

### `lib/constants.ts` — EXTEND `SITE` (MODIFY) — config, single source

**Analog:** the existing `SITE` object in this same file. **Extend it in place — do NOT create a parallel object** (CLAUDE.md guardrail + D-12 + RESEARCH Architectural Responsibility Map: "Already the single source; extend in place, never parallel").

**Current `SITE` shape to extend** (`lib/constants.ts` lines 1-13):
```typescript
export const SITE = {
  name: "TPS Ventilatie",
  tagline: "Specialist in Schone Lucht",
  phone: "+31 6 29403450",
  phoneDisplay: "06 - 29 40 34 50",
  email: "info@tpsventilatie.nl",
  address: "Industrieweg 6 B",
  postcode: "2712LB",
  city: "Zoetermeer",
  kvk: "73722650",
  btw: "NL862655889B01",
  whatsappUrl: "https://wa.me/31629403450",
} as const;
```

**What to change / add** (per D-09…D-12):
- `name: "TPS Ventilatie"` → **`name: "TPS klimaattechniek"`** (D-10). Do NOT touch `email` (`info@tpsventilatie.nl` — domain stays) or `whatsappUrl`.
- ADD: `country: "NL"`, `province: "Zuid-Holland"` (D-12).
- ADD: `geo: { lat: <number>, lng: <number> }` — value **owner-verify-pending** (mark with an inline comment; today's Maps pin is a placeholder per CONCERNS.md / A3).
- ADD: `serviceRadiusKm: 60` (D-09 — the value used by the three copy fixes below).
- ADD: `serviceAreas: [...]` seed list (D-11 / A2: Zoetermeer, Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden…) — **owner-review-pending** inline comment.
- Keep the existing `as const` assertion (preserves literal types for downstream JSON-LD).

**Conventions that bind this file** (CONVENTIONS.md):
- Keep `as const` and double-quoted string literals, trailing commas on multi-line.
- `interface` for any new object shape; nested `geo {}` / flat fields is the planner's call (D-12 Claude's Discretion).
- SITE-field layout (nested `geo {}`/`address {}` objects vs flat) is the planner's call within D-12.

---

### `lib/services/types.ts` (NEW) — shared types + Zod schemas

Two distinct concerns live here; they have different analog situations.

**(a) The TS types — STRONG analogs exist.**

**Discriminant `type` analog** — `components/PricingTabs.tsx` line 9 (this is the closest in-repo precedent for the page-type discriminant):
```typescript
type Tab = "wtw" | "mv" | "airco";
```
Apply the same idiom (CONVENTIONS.md: "String union types are concise … `type` is used for unions") to:
```typescript
type PageType = "hub" | "pillar" | "service" | "static";
type SearchIntent = "informationeel" | "commercieel" | "transactioneel" | "navigationeel";
type PageStatus = "draft" | "review" | "published";
```

**Interface analog** — `lib/constants.ts` lines 23-28 (`interface` for object shapes; `Props`-style naming reserved for components, so domain interfaces are short/descriptive per CONVENTIONS.md like `Review`, `DropdownItem`):
```typescript
export interface DropdownItem {
  icon: string;
  title: string;
  description: string;
  href: string;
}
```
Model `PageBase` / `HubPage` / `PillarPage` / `ServicePage` / `StaticPage` / `ContentShell` as `interface`s in exactly this style. Note `DropdownItem`'s `icon` + `title` + `description` fields are the **nav-relevant fields** that CONTEXT.md §Reusable Assets says to model onto pillar/service nodes now (so Phase 2 can derive the dropdowns). The discriminated-union shape to finalize is RESEARCH §Pattern 1 (lines 211-235) — ILLUSTRATIVE, planner finalizes fields.

**(b) The Zod schemas — NO in-repo analog. `zod` is not yet a dependency.**

This codebase has **zero** existing Zod usage and no schema-validation precedent — do not force a match. Copy directly from RESEARCH §Code Examples (verified against zod.dev for Zod 4 on 2026-06-02):
- `contentShellSchema` (`faqSchema`, `stepSchema`, structure-only) — RESEARCH lines 371-397.
- `publishedContentSchema` (status-gated `superRefine`: intro ≥120 words, steps non-empty, faqs 3-6) — RESEARCH lines 399-417.
- `pagesSchema` (cross-record uniqueness `superRefine` over `urlFor(p)` + `primaryKeyword`) — RESEARCH lines 419-440.
- Derive the static type via `z.infer<typeof contentShellSchema>` (RESEARCH §Don't Hand-Roll: schema is the single source for runtime check + compile-time type; also user TS rule "Use Zod for schema-based validation and infer types from the schema").

**Zod 4 gotchas (MUST follow — RESEARCH Pitfall 5, lines 360-364):** use `z.array(...).min(1)` NOT `.nonempty()`; use the **write** `path` in `ctx.addIssue({ path: [...] })` (read-side `ctx.path` removed); use `z.prettifyError()` (Zod-4-only) for output. Most online Zod snippets are v3 and will mislead.

> Where `pagesSchema` lives: RESEARCH §Code Examples imports it from `@/lib/services/types` (line 447) while `urlFor` lives in `registry.ts`. The uniqueness `superRefine` calls `urlFor`. Planner resolves the import direction (types.ts↔registry.ts) — one option is to keep `urlFor` in `registry.ts` and pass it into a schema factory, another is a small shared slug helper. Flag, don't pre-decide.

---

### `lib/services/airconditioning.ts`, `warmtepompen.ts`, `wtw.ts`, `mechanische-ventilatie.ts` (NEW) — typed data nodes

**Analog A (preferred) — `lib/constants.ts` lines 30-49** (`DIENSTEN_DROPDOWN`): an exported, typed-against-an-interface, SCREAMING_SNAKE_CASE data array. This is the exact shape to mirror — typed array of domain objects:
```typescript
export const DIENSTEN_DROPDOWN: DropdownItem[] = [
  {
    icon: "heat_pump",
    title: "WTW Unit",
    description: "Vervanging en installatie van warmteterugwinunits",
    href: "/diensten#wtw",
  },
  // …
];
```

**Analog B (reference only — do NOT absorb) — `components/PricingTabs.tsx` lines 11-15 + 17-26** (`TABS` typed config array, `WTW_UNITS` structured data array):
```typescript
const TABS: { id: Tab; label: string; mobileLabel: string; icon: string }[] = [
  { id: "wtw", label: "WTW Unit", mobileLabel: "WTW", icon: "air" },
  // …
];
const WTW_UNITS = [
  { name: "Itho Daalderop HRU 200 ECO", image: "/images/wtw/hru-200-eco.jpg", price: "€ 1.450,-", /* … */ },
  // …
];
```
`WTW_UNITS` is the analog for a **structured typed data array**, and a reference for sub-service naming (`Inregelen WTW`, `Reinigen … ventielen`). **This pricing data stays in PricingTabs (CONT-05/Phase 4) — it is NOT pulled into the taxonomy** (CONTEXT.md Deferred + RESEARCH Pitfall 3). Importing PricingTabs data into `lib/services/` is the documented anti-pattern.

**How to apply to each pillar file:**
- Each file exports its pillar node + sub-service nodes, typed against the `PageType` union from `types.ts` (e.g. `export const AIRCONDITIONING: PillarPage = {…}` and its `ServicePage[]`, or a single `export const AIRCONDITIONING_PAGES: PageNode[]`). SCREAMING_SNAKE_CASE for the exported constant (CONVENTIONS.md line 21).
- Named exports only (CONVENTIONS.md "Named exports everywhere except Next.js pages").
- Each node carries `primaryKeyword` + `searchIntent` (+ optional `secondaryKeywords[]`) — values from RESEARCH §Keyword Map (the per-URL table is the source; e.g. airco pillar = `airconditioning`/commercieel, `…/installatie` = `airco laten installeren`/transactioneel — RESEARCH lines 499, 507). **Keyword strings are `[ASSUMED]` (A1)** — annotate as data pending tool validation.
- Slugs come from D-02 (RESEARCH line 16). `wtw` stays lowercase. Compound subs (`reparatie-storing`, `onderhoud-reinigen`) per D-02 — planner finalizes.
- Content shells ship **empty/draft** (`status: "draft"`) this phase (D-08) — the empty shell is intentional and passes the gate because content rules are status-gated.
- `brandIds?: string[]` only on the two Installatie service nodes (airco + warmtepompen) — values from D-06 / RESEARCH Pattern 3: airco installatie → `["daikin","mitsubishi-electric","mitsubishi-heavy"]`, warmtepompen installatie → `["daikin","mitsubishi-ecodan"]`. WTW/MV subs have NO `brandIds`.
- Keep each file <800 lines (CONVENTIONS.md / D-05) — one pillar per file is precisely to stay under this as Phase 4 content lands.

---

### `lib/services/brands.ts` (NEW) — normalized brand registry

**Analog — `lib/constants.ts` `SITE` (lines 1-13)**: a keyed `as const` object used as a single source. Brands follow the same "declare-once, reference-by-key" idea. Closest concrete shape is RESEARCH Pattern 3 (lines 258-267):
```typescript
export const BRANDS = {
  daikin:                { id: "daikin", name: "Daikin", logo: "/images/brands/daikin.svg", blurb: "", erkendInstallateur: false /* owner-verify Phase 4 */ },
  "mitsubishi-electric": { id: "mitsubishi-electric", name: "Mitsubishi Electric", logo: "…", blurb: "", erkendInstallateur: false },
  // …
} as const;
```
**Apply:** Daikin appears **once** here though it is referenced by both the airco and warmtepompen Installatie nodes (the concrete reason to normalize — D-06). Model `erkendInstallateur`/dealer-status as `false` **placeholders** (A5) — values owner-verified in Phase 4 (CONT-03); **never render an unverified "erkend installateur" claim**. SCREAMING_SNAKE_CASE export, named export, double quotes, trailing commas (CONVENTIONS.md). Logos: image-path strings in the `/images/...` convention (cf. `WTW_UNITS` `image:` paths) — actual brand SVGs are a Phase-2 asset concern; placeholder paths are fine now.

---

### `lib/services/registry.ts` (NEW) — aggregation module + `urlFor()` + lookups + `validateTaxonomy()`

> **DOCUMENTED EXCEPTION TO THE NO-BARREL RULE.** CONVENTIONS.md states "No barrel/index files — every import references the exact file." D-05 explicitly carves out `registry.ts` as a *justified aggregation module* (it aggregates `PAGES`, builds URLs, runs validation — it is NOT a generic re-export barrel). **State this exception in a top-of-file comment** so future readers/linters know it is intentional. Do NOT add `index.ts` re-export barrels anywhere else (RESEARCH anti-pattern, line 294).

**Analog A — exhaustive discriminated `switch` for `urlFor()`** — RESEARCH §Pattern 2 (lines 244-251). The in-repo precedent for a small pure mapping function is `lib/forms.ts` (a pure helper returning a typed object). `urlFor` is the **ONLY** place hrefs are built (D-03); it enforces lowercase / leading-slash / no-trailing-slash:
```typescript
export function urlFor(node: PageNode): string {
  switch (node.type) {
    case "hub":     return "/diensten";
    case "pillar":  return `/diensten/${node.pillarSlug}`;
    case "service": return `/diensten/${node.pillarSlug}/${node.serviceSlug}`;
    case "static":  return node.pathSegment === "" ? "/" : `/${node.pathSegment}`;
  }
}
```
A `switch (node.type)` over the union is exhaustively type-checked (criterion 1 leverage). `PAGES: PageNode[]` is assembled by importing each pillar file's nodes + brands + statics into one array (this is the aggregation; RESEARCH diagram lines 162-164).

**Analog B — `validateTaxonomy()` return shape** — `lib/forms.ts` lines 1-23 (the only existing "function that returns a result object" pattern in the repo):
```typescript
export async function submitForm(/* … */): Promise<{ ok: boolean }> {
  // …
  return { ok: true };
}
```
`validateTaxonomy(PAGES)` mirrors this `{ ok: boolean }` convention (CONVENTIONS.md "Utilities return plain objects: `{ ok: boolean }`"). Per RESEARCH it runs `pagesSchema.safeParse(PAGES)` and surfaces a readable error. Whether it returns `{ ok }` (and the script decides exit) or throws is the planner's call — **the project precedent is `{ ok }` not throwing** (CONVENTIONS.md "No try/catch blocks used in the codebase"), so prefer returning a discriminated result and let `scripts/validate-taxonomy.ts` own `process.exit`. Also expose lookups (`findBySlug`, `findByType`) — small pure helpers in the `lerp`/`getInitials` "kept very small" style (CONVENTIONS.md line 87).

---

### `scripts/validate-taxonomy.ts` (NEW) — prebuild gate — NO in-repo analog

**There is no `scripts/` directory and no build-script precedent in this repo.** Do not force a match. Copy from RESEARCH §Code Examples "Build-blocking entry point" (lines 442-457), verified against zod.dev + npm-scripts docs:
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
**Notes:** This is the genuinely-blocking validator (RESEARCH Pattern 4) — `prebuild` runs before `next build`; non-zero exit halts the chain. `@/*` alias works under `tsx` because `tsconfig.json` defines `@/* → ./*`. This script is the **one place** where `console.error`/`process.exit` are correct despite the "no console.log in production" rule — it is a build-time CLI, not shipped runtime code (flag this so code-review doesn't false-positive it). Must satisfy Crit 2 (uniqueness) + Crit 3 (status-gated content); the negative-fixture assertion (RESEARCH Wave 0, line 646) proves "blocking" actually blocks.

---

### `app/tarieven/page.tsx` line 62 (MODIFY) — replace hardcoded radius

**Exact current string** (`app/tarieven/page.tsx:62`, confirmed via grep 2026-06-02):
```tsx
<p>Wij zijn werkzaam in een straal van 50km rondom onze hoofdlocatie. Buiten deze regio geldt een kleine toeslag.</p>
```
**This file does NOT currently import `SITE`** (its imports are lines 1-7: `Metadata`, `Suspense`, `Link`, `Icon`, `CTABanner`, `PricingTabs`, `AnimateOnScroll`). The planner must **add** `import { SITE } from "@/lib/constants";` (the `@/lib` import idiom is already used for the components on those same lines).
**Replace with** SITE-sourced radius using the owner's exact phrasing "**tot 60 km vanuit Zoetermeer**" (CONTEXT.md Specifics + D-09). Interpolate `{SITE.serviceRadiusKm}` rather than re-hardcoding `60`:
```tsx
<p>Wij zijn werkzaam tot {SITE.serviceRadiusKm} km vanuit Zoetermeer. Buiten deze regio geldt een kleine toeslag.</p>
```
The literal `"straal van 50km"` / `"50km"` must be **gone** (Crit 4 grep assertion). Planner finalizes the exact Dutch sentence within the "tot 60 km vanuit Zoetermeer" constraint.

---

### `components/PricingTabs.tsx` lines 442 & 519 (MODIFY) — replace hardcoded radius (×2)

**Exact current string** (identical at both `components/PricingTabs.tsx:442` and `:519`, confirmed via grep):
```tsx
Alle prijzen zijn inclusief BTW, voorrijkosten en klein materiaal. Werkgebied: straal van 100 km vanuit Zoetermeer.
```
(Surrounding JSX at 438-444 is an info banner: `<div className="bg-surface-container-low …"><Icon name="info" …/><p className="text-sm …">{string}</p></div>`.)
**`PricingTabs.tsx` does NOT currently import `SITE`** (imports are lines 1-7: react, `next/navigation`, `Link`, `Image`, `./Icon`). Add `import { SITE } from "@/lib/constants";`. It is a `"use client"` component — `SITE` is a plain module constant, safe to import into client components (no server-only code).
**Replace BOTH occurrences** with the SITE-sourced value (`{SITE.serviceRadiusKm}`), e.g.:
```tsx
Alle prijzen zijn inclusief BTW, voorrijkosten en klein materiaal. Werkgebied: tot {SITE.serviceRadiusKm} km vanuit Zoetermeer.
```
Both `"straal van 100 km"` / `"100 km"` literals must be **gone** (Crit 4). Update **both** lines — missing one fails the grep. **Do not** touch the surrounding pricing data arrays (out of scope).

---

### `package.json` (MODIFY) — add prebuild script + deps

**Analog — the file's own `scripts` block** (`package.json` lines 5-10):
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
},
```
**Add** (RESEARCH §Pattern 4, lines 273-279): `"prebuild": "tsx scripts/validate-taxonomy.ts"` to `scripts` (npm runs `pre<script>` automatically before `<script>`, so this gates `next build`). Add `zod` to `dependencies` and `tsx` to `devDependencies` (install via `npm install zod` / `npm install -D tsx`; commit updated `package-lock.json`, lockfileVersion 3).
**Package-audit gate (RESEARCH Package Legitimacy Audit, lines 124-132):** `zod` is slopcheck **[OK]**, no `postinstall`, target 4.4.3 — approved. **`tsx` is `[ASSUMED]`** (not slopchecked this session, A4): planner MUST run `slopcheck install tsx` + `npm view tsx scripts.postinstall` **before** the install task; gate behind `checkpoint:human-verify` if slopcheck is unavailable. Fallback if `tsx` is undesired: Node 26 native `--experimental-strip-types`, or module-load validation in Phase 3 (RESEARCH Environment Availability, line 607).

---

### `next.config.ts` (MODIFY) — add `trailingSlash: false`

**Analog — the file itself** (`next.config.ts` lines 1-10):
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```
**Add exactly one key:** `trailingSlash: false` (D-03). **Do NOT touch `output: "export"`** — the static-vs-hybrid decision is Phase 5's gate (CONTEXT.md scope + RESEARCH Pitfall 4, lines 354-358). This is the only `next.config.ts` change this phase.

---

## Shared Patterns

### Single-source-of-truth (SITE) consumption
**Source:** `lib/constants.ts` `SITE` (lines 1-13) + CLAUDE.md guardrail ("phone, email, address, KvK/BTW, and service radius come only from `SITE` … never hardcode contact info").
**Apply to:** every MODIFY copy-edit (`app/tarieven/page.tsx`, `components/PricingTabs.tsx` ×2) reads `SITE.serviceRadiusKm`; all downstream phases (JSON-LD Phase 3, Maps pin Phase 5) read `SITE` fields. The radius fix is the literal embodiment of this rule.
```typescript
import { SITE } from "@/lib/constants";
// …{SITE.serviceRadiusKm}… (never a bare "60"/"50"/"100")
```

### Typed-data-array declaration
**Source:** `lib/constants.ts` `DIENSTEN_DROPDOWN: DropdownItem[]` (lines 30-49); `components/PricingTabs.tsx` `TABS` (lines 11-15).
**Apply to:** all `lib/services/*.ts` data files — exported, typed against an interface/union from `types.ts`, SCREAMING_SNAKE_CASE, named export, double quotes + trailing commas.

### String-union discriminant
**Source:** `components/PricingTabs.tsx` `type Tab = "wtw" | "mv" | "airco";` (line 9); CONVENTIONS.md "String union types are concise … `type` is used for unions."
**Apply to:** `PageType`, `SearchIntent`, `PageStatus` in `types.ts`; exhaustively switched in `urlFor()`.

### Result-object return (no throw)
**Source:** `lib/forms.ts` `Promise<{ ok: boolean }>` (lines 1-23); CONVENTIONS.md "Utilities return plain objects: `{ ok: boolean }`" + "No try/catch blocks used in the codebase."
**Apply to:** `validateTaxonomy()` — prefer returning a discriminated result over throwing; the prebuild script owns `process.exit`.

### Import organization & aliases
**Source:** CONVENTIONS.md §Import Organization + `tsconfig.json` `@/* → ./*`.
**Apply to:** all new files — order: next internals → third-party (`zod`) → `@/lib/*` → local; `import type { … }` for type-only imports (e.g. `import type { PageNode } from "./types"`); same-dir uses relative (`./types`), cross-dir uses `@/lib/services/...`.

---

## No Analog Found

Files/concerns with **no close match** in the codebase — planner uses the cited RESEARCH.md pattern, not a forced in-repo analog:

| File / Concern | Role | Data Flow | Reason | Use Instead |
|----------------|------|-----------|--------|-------------|
| Zod schemas in `lib/services/types.ts` | validation schema | build-validation | `zod` is **not yet a dependency**; zero schema-validation precedent in the repo | RESEARCH §Code Examples (lines 371-457) + user TS rule "Use Zod … infer types from the schema" |
| `scripts/validate-taxonomy.ts` | build script | build-gate | **No `scripts/` directory exists**; no build-script or `process.exit`/`console.error` precedent | RESEARCH §Pattern 4 (lines 269-287) + §Code Examples (lines 442-457) |
| `validateTaxonomy()` cross-record uniqueness `superRefine` | validation logic | transform | The only genuinely-bespoke logic in the phase; no in-repo precedent for set-based uniqueness | RESEARCH §Code Examples (lines 419-440) — documented Zod `superRefine` Set-size pattern |
| `prebuild` npm hook | build config | config | No `pre<script>` hook used in current `package.json` | RESEARCH §Pattern 4 (lines 273-279) |

> For all four: the **nearest project convention** still applies for *style* (named exports, `@/*` alias, double quotes, `{ ok }` result objects, no-barrel except `registry.ts`) — only the *substance* (Zod, build script) comes from RESEARCH because the codebase has no precedent.

## Metadata

**Analog search scope:** `lib/` (constants.ts, forms.ts, useParticleEngine.ts), `components/` (PricingTabs.tsx, CTABanner.tsx refs, Icon refs), `app/tarieven/page.tsx`, `app/diensten/page.tsx`, `next.config.ts`, `package.json`, `tsconfig.json`. Confirmed absence of `scripts/`, any Zod usage, and any test framework.
**Files scanned:** 8 read in full or in targeted ranges; grep across `app/` + `components/` for `"straal van"`, `SITE`, `type Tab`, imports.
**Key grep facts (2026-06-02):** radius literals at exactly `app/tarieven/page.tsx:62` (`straal van 50km`), `components/PricingTabs.tsx:442` & `:519` (`straal van 100 km`); neither file currently imports `SITE`; `type Tab` discriminant at `PricingTabs.tsx:9`.
**Pattern extraction date:** 2026-06-02
