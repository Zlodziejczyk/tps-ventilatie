---
phase: 01-taxonomy-data-model
plan: 05
subsystem: taxonomy-data-layer
tags: [registry, pages, urlfor, brands, keyword-map, ia-01, ia-09]
requires:
  - "lib/services/types.ts (PageNode union, ContentShell, pagesSchema, canonicalPath — plan 01-04)"
provides:
  - "PAGES: PageNode[] — the single source of truth for all 27 routable pages (1 hub + 4 pillars + 17 subs + 5 static) (IA-01, Crit 1, D-04)"
  - "urlFor(node) — the sole href builder; lowercase, leading-slash, no-trailing-slash; nested /diensten/{pillar}/{sub} (D-01/D-02/D-03)"
  - "findByType / findBySlug lookups; validateTaxonomy() returning a non-throwing ok-result"
  - "BRANDS — normalized brand registry (Daikin once), erkendInstallateur:false placeholders (D-06)"
  - "The IA-09 keyword map transcribed onto every node (distinct primaryKeyword + searchIntent; regional primaries on the 3 low-demand pages)"
affects:
  - lib/services/brands.ts
  - lib/services/airconditioning.ts
  - lib/services/warmtepompen.ts
  - lib/services/wtw.ts
  - lib/services/mechanische-ventilatie.ts
  - lib/services/registry.ts
  - scripts/assert-registry.ts
tech_stack:
  added: []
  patterns:
    - "Per-pillar data files export a typed PageNode[] (SCREAMING_SNAKE_CASE); registry.ts spreads hub + pillars + statics into one PAGES array (the IA-01 aggregation)"
    - "urlFor as the sole href builder (exhaustive switch over discriminant); registry.ts is the documented no-barrel exception (D-05)"
    - "Normalized brand reference: brands live once in brands.ts, installatie nodes hold brandIds (Daikin referenced by both airco + warmtepompen)"
    - "All nodes status:draft with empty body content; non-empty h1/metaTitle/metaDescription placeholders satisfy the structure-only contentShellSchema so the build stays green (D-08)"
key_files:
  created:
    - "lib/services/brands.ts — BRANDS (daikin, mitsubishi-electric, mitsubishi-heavy, mitsubishi-ecodan), erkendInstallateur:false placeholders, BrandId type"
    - "lib/services/airconditioning.ts — AIRCONDITIONING_PAGES (pillar + 4 subs; installatie brandIds daikin/mitsubishi-electric/mitsubishi-heavy)"
    - "lib/services/warmtepompen.ts — WARMTEPOMPEN_PAGES (pillar + 4 subs; installatie brandIds daikin/mitsubishi-ecodan)"
    - "lib/services/wtw.ts — WTW_PAGES (pillar + 5 subs; no brands)"
    - "lib/services/mechanische-ventilatie.ts — MECHANISCHE_VENTILATIE_PAGES (pillar + 4 subs; no brands)"
    - "lib/services/registry.ts — HUB_PAGE + STATIC_PAGES + PAGES aggregate + urlFor + findByType/findBySlug + validateTaxonomy (no-barrel exception)"
    - "scripts/assert-registry.ts — Crit-1 assertion (count 27, URL uniqueness, D-03 policy, urlFor==canonicalPath drift guard, validateTaxonomy ok)"
  modified: []
decisions:
  - "FINAL PAGES count = 27 (1 hub + 4 pillars + 17 subs + 5 static: home/tarieven/over-ons/contact/privacy-beleid)"
  - "Home head term 'airco warmtepomp ventilatie Zoetermeer' is DISTINCT from the hub head term 'klimaattechniek Zoetermeer' — resolves RESEARCH Open-Q 2 (no duplicate-keyword build error)"
  - "urlFor (registry.ts) is implemented as an exhaustive switch (per 01-05 acceptance + RESEARCH Pattern 2), NOT a thin delegate to canonicalPath. It MIRRORS canonicalPath (types.ts); scripts/assert-registry.ts asserts urlFor(node)===canonicalPath(node) for all 27 nodes, so the two switches cannot drift. (This refines the 01-04 SUMMARY's 'delegates' note — same single-truth guarantee, enforced by assertion rather than by call delegation.)"
  - "tarieven primaryKeyword set to 'ventilatie tarieven' (a clearly distinct pricing-intent term; RESEARCH left it open as 'airco/ventilatie tarieven')"
  - "privacy-beleid modeled with a navigational placeholder primaryKeyword (noindex decision deferred to Phase 3 per RESEARCH)"
  - "A local draftShell() helper is duplicated minimally across the data files + registry.ts (kept in-scope; types.ts not modified)"
metrics:
  completed: 2026-06-02
  tasks: 3
  files_changed: 7
  commits: 3
---

# Phase 1 Plan 5: Taxonomy Data Layer Summary

Built the taxonomy data layer — the normalized brand registry, the four per-pillar data files carrying the transcribed IA-09 keyword map, and the `registry.ts` aggregation module that assembles the unified `PAGES` array, exposes the sole `urlFor()` href builder + lookups, and provides a non-throwing `validateTaxonomy()`. This is the single source of truth that satisfies **IA-01 / Crit 1** ("no parallel hardcoded lists exist") and carries the **IA-09** keyword map.

## What Was Built

**Task 1 — brands.ts + 4 pillar files (commit `25593a4`)**
- `BRANDS` (`as const`): daikin (once), mitsubishi-electric, mitsubishi-heavy, mitsubishi-ecodan — each `{ id, name, logo, blurb:"", erkendInstallateur:false }` with an owner-verify-pending comment (no "erkend installateur" claim shipped). `BrandId` type.
- Four pillar files each export a typed `PageNode[]` (SCREAMING_SNAKE_CASE). D-02 slugs exactly (wtw lowercase). The IA-09 keyword map transcribed verbatim from RESEARCH onto every node: distinct `primaryKeyword` + `searchIntent` + `secondaryKeywords`. The three low-demand pages take regional/long-tail primaries: airco advies → "airco advies Zoetermeer"; warmtepomp advies → "warmtepomp advies regio Den Haag"; wtw inregelen → "wtw inregelen" (paired with a meetrapport secondary). brandIds ONLY on the two installatie nodes (airco: daikin/mitsubishi-electric/mitsubishi-heavy; warmtepompen: daikin/mitsubishi-ecodan); WTW/MV carry none. All nodes `status:"draft"`, empty body content, `[ASSUMED]` keyword annotation.

**Task 2 — registry.ts (commit `f748667`)**
- No-barrel-exception header comment (D-05). HUB_PAGE ("klimaattechniek Zoetermeer", commercieel) + 5 STATIC_PAGES (home distinct head term, tarieven, over-ons, contact, privacy-beleid).
- `PAGES` = hub + 4 pillar exports + statics = **27 nodes**.
- `urlFor(node)` — exhaustive `switch(node.type)`, the sole href builder, enforcing D-03.
- `findByType`, `findBySlug` lookups; `validateTaxonomy(pages = PAGES)` runs `pagesSchema.safeParse` and returns `{ ok:true } | { ok:false, error }` (no throw — 01-06 owns process.exit).

**Task 3 — scripts/assert-registry.ts (commit `a6d4c7d`)**
- node:assert build-time CLI (mirrors assert-site-shape.ts). Asserts: PAGES length === 27; URL uniqueness (Set size === length); D-03 policy (leading slash, lowercase, exactly one "/" root, no other trailing slash); urlFor === canonicalPath for every node (drift guard); validateTaxonomy(PAGES).ok.

## Verification

- `npx tsx scripts/assert-registry.ts` → **exit 0**: `✅ Registry OK — 27 pages, 27 unique URLs, D-03 policy holds, taxonomy validates.` (Crit 1 / IA-01). This also proves all 7 files load with no import/syntax error and the all-draft taxonomy passes `pagesSchema`.
- `grep` checks: BRANDS daikin ×1, erkendInstallateur:false ×4; airco/WP installatie brandIds correct; `brandIds` in wtw.ts and mechanische-ventilatie.ts → 0; "airco advies Zoetermeer" ×1; "warmtepomp advies regio Den Haag" ×1; `status:"published"` and `status:"review"` total 0 across lib/services; home head term ×1; hub head term ×1 (only on the hub).
- **Strict `tsc --noEmit` deferred to the 01-06 build** (full-project typecheck is hang-prone on the OneDrive mount). The tsx load of all 7 modules succeeded; the explicit `PageNode[]` annotations type-check each node against the union.

## Hand-off (01-06 + Phase 2)

- **01-06:** import `PAGES` + `pagesSchema` (or `validateTaxonomy`) and run the safeParse gate with `z.prettifyError` on failure + `process.exit(1)`. The all-draft set currently validates (green build expected).
- **Phase 2:** read `PAGES`/`urlFor`/`findByType` for nav + `generateStaticParams`; resolve `brandIds` via `BRANDS`; derive dropdowns from nav fields (navTitle/navDescription/icon).
- **Owner / Phase 4 (manual, non-blocking):** validate the `[ASSUMED]` keywords in a keyword tool; verify brand `erkendInstallateur` dealer status; write the draft body content.

## Deviations from Plan

- **urlFor vs canonicalPath:** the 01-04 SUMMARY said urlFor would "delegate" to canonicalPath. To satisfy 01-05's acceptance criterion (urlFor implemented as a switch in registry.ts) and RESEARCH Pattern 2, urlFor is instead an independent exhaustive switch that MIRRORS canonicalPath, with `assert-registry.ts` proving they agree for all 27 nodes — same no-drift guarantee, enforced by assertion. types.ts was not modified.
- **Execution mechanics:** implemented inline by the orchestrator (sequential non-worktree mode on `main`) for reliability on this OneDrive mount. Atomic per-task commits, SUMMARY, tracking unchanged.

## Self-Check: PASSED
- FOUND: brands.ts + 4 pillar files + registry.ts + assert-registry.ts (7 files)
- VERIFIED: assert-registry exits 0 (27 pages, unique URLs, D-03, drift guard, validateTaxonomy ok)
- VERIFIED: brandIds only on installatie nodes; all-draft; home/hub head terms distinct
- FOUND commit 25593a4 (Task 1), f748667 (Task 2), a6d4c7d (Task 3)
