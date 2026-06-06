# Phase 4: Content Fill & Editorial Gate - Pattern Map

**Mapped:** 2026-06-06
**Files analyzed:** 13 (10 modify, 2 create, 1 wiring touch-set)
**Analogs found:** 13 / 13 (every file has an in-repo analog — this is a fill/consolidate phase, almost nothing is net-new code)

> **Read this first (executor):** This is an **editorial** phase. The dominant pattern is "write copy into an already-typed shell," not "build a module." The shells, the Zod gate, the JSON-LD slot, the assert-script idiom, and the reviews shape **all already exist**. Copy them exactly. The only genuinely new files are `lib/reviews.ts` (consolidation) and `scripts/assert-no-forbidden-claims.ts` (D-13 gate) — both have a direct sibling analog to mirror line-for-line.

---

## File Classification

| New/Modified File | Action | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|--------|------|-----------|----------------|---------------|
| `lib/services/warmtepompen.ts` | modify | model (content data) | transform (data→render) | `lib/services/airconditioning.ts` | exact (sibling) |
| `lib/services/airconditioning.ts` | modify | model (content data) | transform | itself (expand its own partial intros) | exact |
| `lib/services/wtw.ts` | modify | model (content data) | transform | `lib/services/airconditioning.ts` | exact (sibling) |
| `lib/services/mechanische-ventilatie.ts` | modify | model (content data) | transform | `lib/services/airconditioning.ts` | exact (sibling) |
| `lib/services/brands.ts` | modify | model (config registry) | transform | itself (fill `blurb`, set `logo`) | exact |
| `lib/reviews.ts` | **create** | model (single-source data module) | transform | `lib/constants.ts` (`SITE`) + `lib/services/registry.ts` (`PAGES` aggregation) | role-match |
| `scripts/assert-no-forbidden-claims.ts` | **create** | test (build-time CLI gate) | batch (iterate + assert) | `scripts/validate-taxonomy.ts` (prebuild wiring) + `scripts/assert-seo.ts` (assert idiom) | exact (sibling) |
| `lib/seo/jsonld.tsx` | modify (wiring) | service (JSON-LD builder) | transform | `faqJsonLd()` in the same file (null-on-empty gated builder) | exact (in-file) |
| `app/page-sections/ReviewsSection.tsx` | modify (repoint) | component (client) | request-response (render) | `app/diensten/page.tsx` (same `Review[]` import) | exact |
| `app/diensten/page.tsx` | modify (repoint) | route (server page) | request-response | `app/page-sections/ReviewsSection.tsx` | exact |
| `app/over-ons/page.tsx` | modify (repoint + USP copy) | route (server page) | request-response | `ReviewsSection.tsx` reviews; in-file USP array | role-match |
| `app/page-sections/WhyTPSSection.tsx` | modify (USP copy only) | component | request-response | `app/over-ons/page.tsx` USP array | exact |
| `package.json` | modify (1 line) | config | — | existing `"prebuild"` line | exact |

---

## Pattern Assignments

### `lib/services/{warmtepompen,wtw,airconditioning,mechanische-ventilatie}.ts` (model, transform — FILL the ContentShell)

**Analog:** each other (siblings). `airconditioning.ts` is the richest template; `warmtepompen.ts` is fully empty (net-new copy); `wtw.ts` has ported intros that are **below** the 120w gate and carry a **D-13 violation to fix**.

**The contract every node's `content` must satisfy** — `lib/services/types.ts:41-50` (`ContentShell`) and the **status-gated Zod gate** `lib/services/types.ts:144-167` (`publishedContentSchema`): on `review`/`published` nodes, `intro` ≥120 words, `steps.length ≥ 1`, `faqs.length` in `[3,6]`. An empty `draft` shell passes the structure-only schema (`contentShellSchema`, types.ts:131-140) — so fill happens at `draft`, then flip status.

**The shape to fill** (real signature, from `types.ts`):
```typescript
export interface ContentShell {
  h1: string;
  intro: string;          // ≥120 words on review/published (gate)
  steps: StepItem[];      // ≥1 on review/published; { title, body }
  faqs: FaqItem[];        // 3-6 on review/published; { question, answer }
  localAngle: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}
```

**The `draftShell()` helper pattern** (extend it — do NOT inline raw objects). Each pillar file declares its own local `draftShell()`; the signatures have **drifted** and must be widened per file to accept the fields you're now filling:

- `airconditioning.ts:13-28` and `mechanische-ventilatie.ts:12-27` accept `extra?: { intro?: string; localAngle?: string }` — **no `steps`/`faqs`** param yet.
- `wtw.ts:31-46` accepts `extra?: { intro?: string; steps?: StepItem[]; localAngle?: string }` — **no `faqs`** param yet.
- `warmtepompen.ts:11-25` accepts **no `extra` at all** (3-arg only).

Since Phase 4 adds `faqs[]` to every node (100% net-new) and `steps[]`/`localAngle` to most, **widen each file's `draftShell` `extra` to `{ intro?; steps?; faqs?; localAngle? }`** following the wtw.ts pattern (closest), and default the new keys (`faqs: extra?.faqs ?? []`). Keep `draftShell` local per file (the established no-shared-helper convention here — registry.ts:29 even has its own copy).

**Reusable structured-data pattern — `StepItem[]` as a named const** (wtw.ts:13-29, the salvaged 10-step sequence). Mirror this for per-service step lists: declare a `const X_STEPS: StepItem[] = [...]` above the array, pass via `extra.steps`. `title` = concise label, `body` = the prose phrase.
```typescript
const WTW_REPLACEMENT_STEPS: StepItem[] = [
  { title: "Demontage", body: "Demonteren en afvoeren oude WTW unit" },
  { title: "Kanalen reinigen", body: "Reinigen van luchtkanalen" },
  // …
];
```

**Filled-node reference shape** (airconditioning.ts:41-49, the pattern to scale to ≥120w + steps + faqs):
```typescript
content: draftShell(
  "Airconditioning in Zoetermeer",
  "Airconditioning Zoetermeer | TPS klimaattechniek",
  "Airconditioning: installatie, onderhoud en reparatie in Zoetermeer en omgeving.",
  {
    intro:
      "Geniet het hele jaar door van de perfecte temperatuur … " +  // EXPAND to ≥120w
      "Wij installeren airconditioning van Daikin, Mitsubishi Electric en Mitsubishi Heavy.",
  },
),
```

**⚠️ D-13 fix required during fill (wtw.ts:65):** the WTW pillar intro currently reads `"… en gecertificeerde monteurs voor alle merken."` — the word **`gecertificeerd` is forbidden** until cert proof (D-02/D-13). Replace with `vakkundige` / `ervaren monteurs` while expanding. This intro is also ~55 words → must reach ≥120w.

**Brand-mention convention (airco/WP install nodes):** naming a product you install is allowed (airconditioning.ts:47 `"Wij installeren airconditioning van Daikin, Mitsubishi Electric en Mitsubishi Heavy."`); a **dealer/"erkend installateur"** claim is NOT (gated, D-12). Airco brands = Daikin/Mitsubishi only (no Panasonic — P2 D-05). `brandIds` are already set on install nodes (airconditioning.ts:65, warmtepompen.ts:58).

**ISDE copy convention (CONT-04, D-10):** durable conditions in prose + cite the literal RVO URL in the answer string; route euro amounts to a consult. Per-pillar: WP yes, WTW/MV yes-from-2026 + insulation condition, **airco = "geen ISDE-subsidie voor koeling"** (the airco pillar must contain NO subsidy claim). Source URLs and exact conditions are in `04-RESEARCH.md` §"Per-Pillar ISDE 2026 Facts".

**FAQ allocation (D-16):** pillar nodes = decision FAQs (subsidie/garantie/geluid/VvE); sub-service nodes = task FAQs. 3-6 per node, each distinct (no FAQ duplicated across pages).

**Status flip (the editorial gate / index lever):** leave each node `status: "draft"` while drafting; flip to `"review"` once the node clears the Zod gate + the D-13 checklist; batch-flip approved set to `"published"` after owner sign-off (D-08/D-09). The flip is the ONLY change needed to index a page — `lib/seo/policy.ts:23-28` `isIndexable()` keys hub/pillar/service purely on `status === "published"`.

**Conventions to respect:** nl-only copy; formal `u` (matches shipped copy — wtw.ts:65 "in uw woning"); `import type { ContentShell, PageNode, StepItem } from "./types"` (type-only import, wtw.ts:11); double quotes; trailing commas; named export `export const X_PAGES: PageNode[]`. No `"use client"` (pure data). Keep the `[ASSUMED] keyword` header comment honest — validate keywords as you write (A1).

---

### `lib/services/brands.ts` (model, transform — fill blurb + logo)

**Analog:** itself. Current state (brands.ts:11-40): 4 brands, every `blurb: ""`, every `erkendInstallateur: false`, `logo` = placeholder `/images/brands/<id>.svg` paths. `BrandId` is `keyof typeof BRANDS` (brands.ts:42) — the `as const` object is the single brand source (D-06).

**What to change:**
- Fill each `blurb` with nl install-context copy (a product you install ≠ a dealer claim).
- `logo`: keep the path **only if** an official owner-supplied SVG actually lands in `public/images/brands/` (currently **empty dir — no SVGs exist**). Per D-19, do NOT pull aggregator logos; BrandGrid's text-chip fallback (P2) renders when the asset is absent. So either ship the real SVG + keep the path, or leave the path and rely on the fallback.
- **`erkendInstallateur` stays `false`** until owner verification (D-12/D-19) — never flip it without intake proof.

```typescript
daikin: {
  id: "daikin",
  name: "Daikin",
  logo: "/images/brands/daikin.svg",   // path stays; real SVG only if owner-supplied (D-19)
  blurb: "",                            // ← FILL (nl, install-context, no dealer claim)
  erkendInstallateur: false,            // ← stays false until proof (D-12)
},
```
**Convention:** the `as const` object literal + `keyof` id type — preserve it (do not convert to an array or add an id not already referenced by a node's `brandIds`).

---

### `lib/reviews.ts` (model, single-source data module) — **CREATE**

**Analogs:** `lib/constants.ts` (`SITE`/`CANONICAL_ORIGIN` single-source ethos) + `lib/services/registry.ts` (`PAGES` aggregation pattern). The `Review` type already exists at `components/ReviewCarousel.tsx:6-10` — **reuse or re-home it; do not invent a second shape.**

**Why this file:** three scattered `REVIEWS` arrays must collapse to one (D-17):
- `app/page-sections/ReviewsSection.tsx:6` — `Review[]` (`{ name, quote, timeAgo }`)
- `app/diensten/page.tsx:18` — `Review[]` (identical shape; copied verbatim, see the comment at diensten/page.tsx:14-17 that explicitly flags this for Phase-4 consolidation)
- `app/over-ons/page.tsx:11` — **untyped, different shape** `{ initials, name, quote }` (NO `timeAgo`, HAS `initials`). **Reconcile:** drop `initials` (ReviewCarousel derives initials via `getInitials()` at ReviewCarousel.tsx:17-24) and either add `timeAgo` or make it optional.

**The existing `Review` shape to standardize on** (ReviewCarousel.tsx:6-10):
```typescript
export interface Review {
  name: string;
  quote: string;
  timeAgo: string;
}
```

**Module shape to author** (mirror `SITE`/`PAGES` — a typed `as const`/typed array named export, plus the gated rating block for D-17):
```typescript
// lib/reviews.ts — the ONE consolidated reviews source (D-17). Replaces the 3
// scattered REVIEWS arrays. ReviewCarousel/ReviewsSection/diensten/over-ons read here.
import type { Review } from "@/components/ReviewCarousel";   // reuse the shipped shape

export const REVIEWS: Review[] = [ /* the de-duped union of the 3 arrays, verbatim quotes */ ];

// aggregateRating: gated until the owner provides REAL Google data (D-13/D-17).
// null → JSON-LD slot stays empty; on-page score/count/link only renders when set.
export const REVIEW_RATING: { value: number; count: number; url: string } | null = null;
```
**Conventions:** named exports (no default); no barrel; `@/` import alias for cross-dir (`@/components/ReviewCarousel`); SCREAMING_SNAKE_CASE for the module-level data const (matches `SITE`/`NAV_LINKS`/`PAGES`). **Keep customer quotes verbatim** — do NOT mass-replace the old "TPS Ventilatie" string inside quotes (RESEARCH Open Q2). Place in `lib/` per `.planning/codebase/STRUCTURE.md`. *(Discretion D-17: `lib/reviews.ts` vs extending `SITE.reviews` — `lib/constants.ts` is currently lean NAP data; a standalone module mirrors the `registry.ts` single-source pattern better. Planner's call.)*

---

### `scripts/assert-no-forbidden-claims.ts` (test, build-time CLI gate) — **CREATE**

**Direct analogs:** `scripts/validate-taxonomy.ts` (the prebuild-wired gate — copy its shape + wiring) and `scripts/assert-seo.ts` (the assert/iterate idiom). RESEARCH §"Code Examples" gives a ready skeleton.

**The prebuild-gate pattern to mirror** (`validate-taxonomy.ts:12-24` — imports `PAGES`, runs a check, `console.error` + `process.exit(1)` on failure, `console.log` on pass):
```typescript
import { z } from "zod";
import { pagesSchema } from "@/lib/services/types";
import { PAGES } from "@/lib/services/registry";

const result = pagesSchema.safeParse(PAGES);
if (!result.success) {
  console.error("✗ Taxonomy validation failed — aborting build.\n");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}
console.log(`✅ Taxonomy valid — ${PAGES.length} pages passed pagesSchema.`);
```

**The iterate-over-PAGES + gate-on-status idiom** to author (greps serialized `content` of `review`/`published` nodes; skips `draft`; exits 1 on any hit). This is exactly the RESEARCH §"Code Examples" skeleton — reproduce it:
```typescript
import { PAGES } from "@/lib/services/registry";

const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  { pattern: /\b6\s*%\s*btw/i,         why: "Belgian 6% BTW — false in NL (D-13)" },
  { pattern: /erkend\s+installateur/i, why: "dealer claim — gated until owner proof (D-13)" },
  { pattern: /gecertificeerd/i,        why: "no 'gecertificeerd' until cert proof (D-02/D-13)" },
];
let failed = false;
for (const p of PAGES) {
  if (p.status === "draft") continue;                 // only gate review/published
  const blob = JSON.stringify(p.content).toLowerCase();
  for (const { pattern, why } of FORBIDDEN) {
    if (pattern.test(blob)) { console.error(`❌ ${p.primaryKeyword}: ${why}`); failed = true; }
  }
}
process.exit(failed ? 1 : 0);
```

**File-header convention (every script carries it)** — see `validate-taxonomy.ts:1-10` / `assert-seo.ts:1-11`: state that it's a build-time CLI (not shipped runtime), that `console.*`/`process.exit` are intentional, the run command, and what it locks.

**⚠️ Wiring — the one thing the analog doesn't hand you for free:** `package.json:7` currently runs `"prebuild": "tsx scripts/validate-taxonomy.ts"` and that is the **only** prebuild script (`assert-seo.ts`/`assert-registry.ts` are run on-demand, NOT in prebuild). To make the D-13 gate build-blocking, **chain it into prebuild**:
```jsonc
"prebuild": "tsx scripts/validate-taxonomy.ts && tsx scripts/assert-no-forbidden-claims.ts",
```
**Conventions:** `import { PAGES } from "@/lib/services/registry"` (the existing import path — assert-seo.ts:16-21 uses the same `@/` alias from scripts). Note (RESEARCH): `gecertificeerd` becomes allowed once F-gassen/STEK is owner-verified — at that point scope/remove that one pattern. **Do NOT run `tsx`/`next build`/`npm` locally** (OneDrive deadlock) — Vercel CI runs prebuild on deploy.

---

### `lib/seo/jsonld.tsx` (service, transform — fill the reserved aggregateRating slot)

**Analog:** the `faqJsonLd()` builder **in the same file** (jsonld.tsx:107-118) — the established "gated builder that returns null/omits when data absent" pattern.

**The reserved slot:** `businessJsonLd()` (jsonld.tsx:34-74) deliberately carries **NO `aggregateRating`/`review`** (header note jsonld.tsx:2-4, 31-33). It is rendered ONCE at `app/layout.tsx:67` (`<JsonLd data={businessJsonLd()} />`). `scripts/assert-seo.ts:60-61` actively asserts `aggregateRating`/`review` are **absent** — that assertion must be **updated** when you wire the slot (it currently encodes "Phase 3 = no ratings").

**The null-on-empty gate to mirror** (faqJsonLd, jsonld.tsx:107-118):
```typescript
export function faqJsonLd(node: PageNode): object | null {
  if (node.content.faqs.length === 0) return null;   // ← gate: omit when no data
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: /* … */ };
}
```

**Pattern to apply:** read `REVIEW_RATING` from `lib/reviews.ts` (the gated const above); when non-null, spread an `aggregateRating` object into the `businessJsonLd()` return; when null, omit it entirely (never emit empty/placeholder — same discipline as the `sameAs` omission noted at jsonld.tsx:31-33). Required Schema.org props: `ratingValue` + one of `ratingCount`/`reviewCount`. **Gated on real Google data (D-13)** — ships absent until intake §8 returns it. Reframe expectation: self-serving ratings get NO Google star snippets (RESEARCH §Reviews) — the slot is for AI/LLM + on-page display.
```typescript
// inside businessJsonLd()'s returned object — conditional spread, omit when null:
...(REVIEW_RATING && {
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: REVIEW_RATING.value,
    reviewCount: REVIEW_RATING.count,
  },
}),
```
**Conventions:** server-only `.tsx` (no client directive — header jsonld.tsx:6); all business data via `SITE`/imported consts; `@/` imports. Update `assert-seo.ts:60-61` to reflect the now-conditional slot (e.g. assert absent when `REVIEW_RATING === null`).

---

### Reviews consumers — repoint to `lib/reviews.ts` (D-17)

**`app/page-sections/ReviewsSection.tsx`** (component, client): delete the inline `const REVIEWS` (lines 6-…) and import from `lib/reviews.ts`. It already imports `type { Review }` and renders `<ReviewCarousel reviews={REVIEWS} />` (ReviewsSection.tsx:168) and shows `{REVIEWS.length}+ reviews op Google` (line 162) — repoint the source, optionally swap the count to `REVIEW_RATING.count` when present. **D-18: data/source only — no layout change** (Phase 6 owns the home rebuild and reads this same source).

**`app/diensten/page.tsx`** (route, server): delete the verbatim-copied `const REVIEWS` (lines 18-…, flagged by the in-file comment at 14-17) and import from `lib/reviews.ts`. Renders `<ReviewCarousel reviews={REVIEWS} />` (diensten/page.tsx:190).

**`app/over-ons/page.tsx`** (route, server): delete the **differently-shaped** untyped `const REVIEWS` (lines 11-30, `{ initials, name, quote }`) and import the standard `Review[]`. Its render (`REVIEWS.map`, line 101) must drop any `review.initials` usage (derive via the carousel's `getInitials`, or compute inline). **Plus USP refresh (CONT-07)** — see below.

**Convention:** import path `@/lib/reviews`; keep verbatim quotes; same `Review` shape everywhere.

---

### USP copy refresh — `app/over-ons/page.tsx` + `app/page-sections/WhyTPSSection.tsx` (CONT-07, D-18 data/content only)

**`app/over-ons/page.tsx:67-70`** — the 4-USP array (inline object literals: `{ icon, title, desc }`):
```typescript
{ icon: "workspace_premium", title: "Gecertificeerd", desc: "Opgeleid volgens de nieuwste normen…" },
{ icon: "speed", title: "Snel & Betrouwbaar", desc: "Wij streven naar een afspraak binnen 48 uur." },
{ icon: "handshake", title: "Persoonlijk Contact", desc: "U heeft altijd rechtstreeks contact met Thomas." },
{ icon: "payments", title: "Transparante Prijzen", desc: "Geen verborgen kosten — wat u ziet is wat u betaalt." },
```
**⚠️ D-02 tension:** the locked USP set includes **"Gecertificeerd"**, but D-02 forbids that word until cert proof. **Default to interim "Vakkundig"/"Ervaren"** wording; swap to "Gecertificeerd" the moment intake §6 returns F-gassen/STEK proof (treat the USP word as a gated value, like the dealer badge — RESEARCH Open Q1). Also refresh "Verhaal van Thomas" copy from intake §7 (CONT-07).

**`app/page-sections/WhyTPSSection.tsx:7`** — a parallel `const USPs = [...]` array (line 7), rendered at line 43 (`USPs.map`). Same 4-USP refresh; **same D-02 gate on "Gecertificeerd."** Keep both in sync (they are the same 4-pillar set in two places).

**Convention:** `icon` strings are Material Symbols names consumed via the `Icon` wrapper (component design rule); MD3 tokens for any styling; nl `u`-voice; **no layout/visual change** (D-18 — copy only; Phase 6 rebuilds the home visuals).

---

## Shared Patterns

### Build-time gate scripts (the `scripts/assert-*` + prebuild family)
**Source:** `scripts/validate-taxonomy.ts` (prebuild-wired) · `scripts/assert-seo.ts` (assert idiom)
**Apply to:** `scripts/assert-no-forbidden-claims.ts`
- File-header block declaring "build-time CLI, not shipped runtime; console/process.exit intentional; run command; what it locks."
- Import `{ PAGES }` from `@/lib/services/registry`; iterate; `console.error` + `process.exit(1)` on failure, `console.log("✅ …")` on pass.
- **Chain into `package.json` `"prebuild"`** with `&&` (only `validate-taxonomy.ts` is there today).

### Single-source data modules
**Source:** `lib/constants.ts` (`SITE`, `CANONICAL_ORIGIN`) · `lib/services/registry.ts` (`PAGES` aggregation) · `lib/seo/policy.ts` (`isIndexable` — one place membership is decided)
**Apply to:** `lib/reviews.ts` (one reviews source) and the `aggregateRating` slot (reads that one source)
- Named export, no default, no barrel, `@/` alias for cross-dir, SCREAMING_SNAKE_CASE for module-level data.
- Business/trust data lives ONCE; every consumer imports it (the project's core ethos — mirrors `urlFor()`/`isIndexable()`).

### Status-gated content + index lever
**Source:** `lib/services/types.ts:144-167` (`publishedContentSchema`) · `lib/seo/policy.ts:23-28` (`isIndexable`)
**Apply to:** every node fill in the 4 pillar files
- Draft freely (empty/partial passes structure-only schema); the ≥120w / ≥1 step / 3-6 FAQ rules bite only at `review`/`published`.
- Flipping `status` to `"published"` is the ONLY action that indexes a page + adds it to the sitemap — no parallel list (D-06/D-08).

### Gated-claim discipline (D-02/D-12/D-13 — the YMYL backbone)
**Source:** `lib/services/brands.ts:6-9` header (`owner-verify-pending`, `erkendInstallateur:false`) · `lib/seo/jsonld.tsx:31-33` (omit-when-absent)
**Apply to:** brands.ts, all pillar copy, the USP arrays, the aggregateRating slot
- Never render: `gecertificeerd` (pre-proof), named keurmerk, dealer/"erkend installateur", ISDE-for-airco, Belgian 6% BTW, a rating without real Google data.
- Interim copy must be **literally true**: `vakkundige`/`ervaren monteurs`. Naming a product you install is fine; claiming authorized status is not.
- Enforced by BOTH the written D-13 checklist AND `scripts/assert-no-forbidden-claims.ts`.

### Project content conventions (every copy/data edit)
**Source:** `CLAUDE.md` guardrails · `.planning/codebase/CONVENTIONS.md`
- nl-only copy, formal `u` (matches shipped copy); business data only via `SITE` (`lib/constants.ts`) — never hardcode phone/email/address/KvK/BTW; icons via `components/Icon.tsx` Material Symbols wrapper; MD3 tokens, **no 1px section borders, no `#000` text** (`text-on-surface`); named exports (except route `page.tsx` defaults); type-only imports (`import type {...}`); double quotes; trailing commas. Static data files carry no `"use client"`.

---

## No Analog Found

None. Every Phase-4 file maps to an in-repo analog — this is a fill/consolidate/gate phase, not a build-new phase. The two "create" files (`lib/reviews.ts`, `scripts/assert-no-forbidden-claims.ts`) each mirror a direct sibling (`lib/constants.ts`+`registry.ts`, and `validate-taxonomy.ts`+`assert-seo.ts` respectively).

---

## Metadata

**Analog search scope:** `lib/services/`, `lib/seo/`, `lib/` (constants/forms), `scripts/`, `app/` (pages + page-sections), `components/` (ReviewCarousel), `package.json`.
**Files scanned (read in full or targeted):** types.ts, brands.ts, registry.ts (head), all 4 pillar data files, policy.ts, jsonld.tsx, metadata.ts (listed), validate-taxonomy.ts, assert-seo.ts, ReviewCarousel.tsx (head), constants.ts, ReviewsSection.tsx (head), over-ons/page.tsx (regions), diensten/page.tsx (region), WhyTPSSection.tsx (regions), package.json (scripts).
**Pattern extraction date:** 2026-06-06
**Runtime note honored:** Grep/Glob/Read only — no `next build`/`tsc`/`npm` run (OneDrive deadlock).
