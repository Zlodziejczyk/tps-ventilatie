---
phase: 01-taxonomy-data-model
plan: 04
subsystem: taxonomy-contracts
tags: [types, discriminated-union, zod, content-shell, validation, ia-08, ia-09]
requires:
  - "zod ^4.4.3 (installed in plan 01-01)"
provides:
  - "PageType/SearchIntent/PageStatus string unions"
  - "PageNode discriminated union (hub|pillar|service|static) + HubPage/PillarPage/ServicePage/StaticPage interfaces (D-04)"
  - "ContentShell interface (h1, intro, steps[], faqs[], localAngle + metaTitle/metaDescription/ogImage?) co-locating content + SEO + keyword fields (D-14/D-15)"
  - "FaqItem {question,answer} + StepItem {title,body} structured types (D-15)"
  - "canonicalPath(node) — the single URL-derivation primitive registry.ts urlFor() will delegate to"
  - "Zod 4 schemas: contentShellSchema (structure), publishedContentSchema (status-gated content rules), pagesSchema (cross-record URL + keyword uniqueness)"
affects:
  - lib/services/types.ts
tech_stack:
  added: []
  patterns:
    - "Discriminated union over a string-literal `type` field (mirrors the in-repo `type Tab` idiom) — exhaustive switch in canonicalPath"
    - "Zod 4: superRefine for status-gated + cross-record rules; ctx.addIssue with write-side `path`; array length via explicit length refinements (no Zod-3 array shortcut); z.prettifyError() reserved for 01-06"
    - "status-gating: draft shells validate structure only; review/published also validate content quality (>=120-word intro, >=1 step, 3-6 faqs)"
key_files:
  created:
    - "lib/services/types.ts — the taxonomy typed contract + Zod schemas (no concrete page data)"
  modified: []
decisions:
  - "IMPORT DIRECTION (resolved for 01-05): canonicalPath() lives in types.ts (option b — local helper). pagesSchema's uniqueness check calls it, so types.ts has ZERO import from registry.ts (no circular dep). Plan 01-05's public urlFor() MUST delegate to canonicalPath (single implementation, no drift)."
  - "URL structure encoded in canonicalPath: static '' -> '/', static X -> '/X'; hub -> '/diensten' (from segment); pillar -> '/diensten/{pillarSlug}'; service -> '/diensten/{pillarSlug}/{serviceSlug}'. 01-05 data files MUST use these slug fields accordingly."
  - "ContentShell uses named FaqItem/StepItem interfaces (reusable by Phase 2 components + Phase 3 JSON-LD) rather than inline object types — same {question,answer}/{title,body} shape"
  - "pageSchema is a flat object schema (all discriminant slug fields optional) + status-gated content superRefine; the discriminant-specific slug REQUIREDness is enforced by the TS PageNode union at authoring time (01-05 data files are type-checked)"
metrics:
  completed: 2026-06-02
  tasks: 2
  files_changed: 1
  commits: 2
---

# Phase 1 Plan 4: Taxonomy Typed Contract + Zod Schemas Summary

Created `lib/services/types.ts` — the **contracts-first** keystone of the phase. It defines the `PageNode` discriminated union (D-04), the `ContentShell` that co-locates body content + per-page SEO metadata + keyword fields in one source (D-14/D-15), and the three Zod 4 schemas that turn the anti-thin-content bar (IA-08) and anti-cannibalization uniqueness (IA-09) into build-checkable validators. Plans 01-05 (data layer) and 01-06 (build gate) implement and validate against these types rather than reverse-engineering them.

## What Was Built

**Task 1 — Types (commit `37a3b5b`)**
- String unions: `PageType = "hub" | "pillar" | "service" | "static"`, `SearchIntent` (informationeel/commercieel/transactioneel/navigationeel), `PageStatus` (draft/review/published).
- `PageBase` (status, primaryKeyword, searchIntent, secondaryKeywords?, content, + nav-relevant navTitle/navDescription/icon so Phase 2 derives dropdowns).
- Variant interfaces: `HubPage` (type "hub", segment "diensten"), `PillarPage` (pillarSlug), `ServicePage` (pillarSlug + serviceSlug + `brandIds?: string[]`), `StaticPage` (pathSegment, "" = home). `brandIds` is ONLY on ServicePage.
- `PageNode = HubPage | PillarPage | ServicePage | StaticPage`.
- `ContentShell` (h1, intro prose, `steps: StepItem[]`, `faqs: FaqItem[]`, localAngle prose, metaTitle, metaDescription, ogImage?) with structured `FaqItem {question,answer}` / `StepItem {title,body}`.

**Task 2 — Zod 4 schemas + canonicalPath (commit `ca40dde`)**
- `canonicalPath(node)` — pure, exhaustive switch over the discriminant; the URL primitive (see decision above).
- `faqSchema` / `stepSchema` — `{ question/answer }` / `{ title/body }`, each `.min(1)`.
- `contentShellSchema` — STRUCTURE only (h1/metaTitle/metaDescription `.min(1)`; intro/localAngle `z.string()`; steps/faqs arrays; ogImage optional) → an empty draft shell passes.
- `publishedContentSchema` = `contentShellSchema.superRefine(...)` — intro ≥120 words, steps ≥1, faqs 3–6. Fires only for review/published.
- `pageSchema` — node object + `.superRefine` that re-validates `content` with `publishedContentSchema` ONLY when status is review/published, re-pathing issues under `content`.
- `pagesSchema` = `z.array(pageSchema).superRefine(...)` — cross-record uniqueness: duplicate canonical URL → issue at `[i,"slug"]`; duplicate case-insensitive primaryKeyword → cannibalization issue at `[i,"primaryKeyword"]`.

## Verification

- **Behavioral (tsx, throwaway script, exit 0):** draft-with-empty-content PASSES; published-with-short-intro FAILS; fully-valid-published PASSES; duplicate primaryKeyword (case-insensitive) FAILS; duplicate canonical URL FAILS — all 5 expected. This proves the Zod 4 runtime API (superRefine, write-side `path` addIssue) and the status-gating + uniqueness logic.
- `grep -c '"hub" | "pillar" | "service" | "static"'` → 1; `superRefine` → 3 (≥2); `.nonempty()` → 0; `import { z } from "zod"` → 1; imports from `./registry` → 0 (no circular dep); exports contentShellSchema/publishedContentSchema/pagesSchema.
- **Strict `tsc --noEmit` deferred to the 01-06 build** (full-project typecheck is very slow / hang-prone on the OneDrive mount; the file is type-trivial and the tsx load succeeded). The 01-06 `next build` is the strict type gate.

## Hand-off to 01-05

- `registry.ts` must `import { canonicalPath, type PageNode, pagesSchema, ... } from "./types"` and define `urlFor(node)` as the public builder **delegating to `canonicalPath`** (do not re-implement URL logic).
- Data files build `PageNode[]`; slug fields must match the canonicalPath structure (pillarSlug, serviceSlug, segment "diensten", pathSegment).
- 01-06 imports `PAGES` + `pagesSchema` and runs `pagesSchema.safeParse(PAGES)` with `z.prettifyError` on failure.

## Deviations from Plan

None in the work product. **Execution mechanics:** implemented inline by the orchestrator (sequential non-worktree mode on `main`), after subagent execution proved unreliable on this OneDrive mount earlier in the phase. Atomic per-task commits, SUMMARY, and tracking are unchanged.

## Self-Check: PASSED
- FOUND: lib/services/types.ts (PageNode union, ContentShell, canonicalPath, 3 Zod schemas)
- VERIFIED: 5/5 behavioral schema checks pass via tsx (exit 0)
- VERIFIED: Zod-4 idioms (superRefine×3, no .nonempty(), write-side path), no circular import
- FOUND commit 37a3b5b (Task 1 — types)
- FOUND commit ca40dde (Task 2 — Zod schemas)
