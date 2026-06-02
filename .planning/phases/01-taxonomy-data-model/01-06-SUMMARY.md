---
phase: 01-taxonomy-data-model
plan: 06
subsystem: build-gate
tags: [prebuild-gate, validation, negative-fixture, radius-grep, build, ia-08, ia-09, qa-03]
requires:
  - "package.json prebuild hook (plan 01-01)"
  - "lib/services/registry.ts PAGES + lib/services/types.ts pagesSchema (plans 01-04/01-05)"
  - "app/tarieven + components/PricingTabs radius fix (plan 01-03)"
provides:
  - "scripts/validate-taxonomy.ts — the genuinely build-blocking prebuild gate (safeParse(PAGES), z.prettifyError, process.exit(1))"
  - "scripts/assert-gate-blocks.ts — repeatable proof the gate blocks duplicate-keyword + thin-content (in-memory clones, no broken data committed)"
  - "scripts/check-radius-literals.sh — executable Crit-4 grep assertion (QA-03)"
  - "A verified-green npm run build (prebuild gate + next build static export)"
affects:
  - scripts/validate-taxonomy.ts
  - scripts/check-radius-literals.sh
  - scripts/assert-gate-blocks.ts
  - lib/services/registry.ts
tech_stack:
  added: []
  patterns:
    - "npm pre<script> hook: prebuild runs the Zod gate before next build; non-zero exit aborts the build (D-07)"
    - "Zod 4 z.prettifyError for human-readable, path-named validation errors (not v3 formatError)"
    - "Negative-fixture proof via in-memory clones (structuredClone) — proves blocking without committing broken data"
key_files:
  created:
    - "scripts/validate-taxonomy.ts — prebuild gate; imports PAGES + pagesSchema, safeParse, prints z.prettifyError + process.exit(1) on failure, prints page count on success"
    - "scripts/assert-gate-blocks.ts — node:assert harness proving safeParse rejects (a) a duplicate primaryKeyword clone and (b) a published-with-empty-intro clone, and accepts the committed taxonomy"
    - "scripts/check-radius-literals.sh — inverted-grep assertion (exit 1 if any 50km/100km literal in app/ or components/)"
  modified:
    - "lib/services/registry.ts — validateTaxonomy error type derived from pagesSchema.safeParse (TaxonomyError) so the strict full-project build typechecks (build-greening; see Deviations)"
decisions:
  - "Used the plan's optional repeatable harness (assert-gate-blocks.ts) instead of manual perturbation — proves both failure modes block without ever committing a broken taxonomy"
  - "validate-taxonomy.ts calls pagesSchema.safeParse(PAGES) directly (script owns process.exit), per acceptance criterion"
metrics:
  completed: 2026-06-02
  tasks: 3
  files_changed: 4
  commits: 4
---

# Phase 1 Plan 6: Build-Blocking Taxonomy Gate Summary

Made taxonomy validation **genuinely build-blocking** and proved it. `scripts/validate-taxonomy.ts` (the prebuild gate wired in 01-01) imports `PAGES`, runs `pagesSchema.safeParse`, prints a readable `z.prettifyError` and `process.exit(1)` on failure. A negative-fixture harness proves the gate blocks both the cannibalization and thin-content failure modes, the Crit-4 radius grep confirms QA-03, and `npm run build` is green end-to-end with the all-draft taxonomy.

## What Was Built

**Task 1 — prebuild gate (commit `1477f03`)**
- `scripts/validate-taxonomy.ts`: imports `z`, `pagesSchema` (types), `PAGES` (registry). `pagesSchema.safeParse(PAGES)`; on failure prints a header + `z.prettifyError(result.error)` and `process.exit(1)`; on success prints `✅ Taxonomy valid — 27 pages passed pagesSchema.` Top-of-file comment flags the intentional build-time `console`/`process.exit`. No fs writes, no network (Information-Disclosure boundary).
- The npm `prebuild` hook (01-01) now resolves to this real file → `npm run prebuild` is runnable and green.

**Task 2 — blocking proof (commit `f687ff6`)**
- `scripts/assert-gate-blocks.ts` (node:assert): clones `PAGES` via `structuredClone` and asserts `pagesSchema.safeParse` returns `success === false` for (a) a **duplicate primaryKeyword** clone (cannibalization) and (b) a **published node with an empty/<120-word intro** clone (thin content), and `success === true` for the committed taxonomy. No broken data is committed.

**Task 3 — Crit-4 grep + green build (commits `fbaf20f` + `ca8a281`)**
- `scripts/check-radius-literals.sh`: executable inverted-grep over `app components` for `straal van 50|straal van 100|100 km|50km`; exits 1 (with the offending lines) if any match, else exits 0.
- `lib/services/registry.ts`: `validateTaxonomy`'s error type derived from `safeParse` (`TaxonomyError`) so the strict full-project typecheck during `next build` passes (build-greening).

## Verification (evidence)

**`npm run prebuild` → exit 0:**
```
✅ Taxonomy valid — 27 pages passed pagesSchema.
```

**`npx tsx scripts/assert-gate-blocks.ts` → exit 0 (negative-fixture proof — Crit 2 & 3):**
```
✅ Gate blocks both failure modes (duplicate primaryKeyword + short published intro); committed taxonomy validates.
```
Both broken clones are rejected by `pagesSchema` (`success === false`): the duplicate-`primaryKeyword` clone trips the cross-record uniqueness `superRefine`; the published-with-empty-intro clone trips the status-gated `publishedContentSchema` (intro ≥120 words + steps ≥1 + faqs 3–6). The committed all-draft taxonomy passes. This proves "blocking" is real, not assumed.

**`bash scripts/check-radius-literals.sh` → exit 0 (Crit 4 / QA-03):**
```
✅ No stale service-radius literal in app/ or components/ (QA-03 / Crit 4).
```

**`npm run build` → exit 0 (phase gate):**
```
> tps-app@0.1.0 prebuild
> tsx scripts/validate-taxonomy.ts
✅ Taxonomy valid — 27 pages passed pagesSchema.

> tps-app@0.1.0 build
> next build
BUILD_EXIT=0
```
The prebuild gate ran first, then `next build` compiled, **typechecked the entire project under strict mode** (lib/services + all scripts + app — this is the strict typecheck deferred from plans 01-04/01-05, now confirmed clean), and completed the static export. `out/` contains the pre-rendered routes (index, contact, diensten, over-ons, privacy-beleid, tarieven, 404) with `output: "export"` intact. (The verbose `next build` middle output was lost to OneDrive stdout buffering; exit 0 + the populated `out/` are the authoritative success signals.)

**Committed taxonomy is all-draft:** `grep -rc 'status: "published"' lib/services` and `'status: "review"'` both total 0; no duplicate primaryKeyword (the gate would have failed otherwise).

## Deviations from Plan

- **Cross-file touch (registry.ts):** 01-06's files_modified lists only the two scripts, but Task 3 ("confirm npm run build is green") required `next build`'s strict full-project typecheck to pass. `lib/services/registry.ts`'s `validateTaxonomy` error type was changed to a `safeParse`-derived `TaxonomyError` so the typecheck succeeds. Committed under 01-06 (`ca8a281`) as a build-greening fix.
- **Harness over manual perturbation:** used the plan's blessed optional `assert-gate-blocks.ts` harness (repeatable, no broken commit) rather than manual edit-run-revert. The negative-fixture evidence is the harness asserting both clones fail `safeParse`.
- **Execution mechanics:** implemented inline by the orchestrator (sequential non-worktree mode on `main`) for reliability on this OneDrive mount.

## Self-Check: PASSED
- FOUND: scripts/validate-taxonomy.ts (safeParse, z.prettifyError, process.exit(1)) — `npm run prebuild` exits 0
- FOUND: scripts/assert-gate-blocks.ts — exits 0, both failure modes proven to block
- FOUND: scripts/check-radius-literals.sh (executable) — exits 0, Crit-4 clean
- VERIFIED: `npm run build` exits 0 (gate + next build static export); out/ pre-rendered
- FOUND commits ca8a281, 1477f03, f687ff6, fbaf20f
