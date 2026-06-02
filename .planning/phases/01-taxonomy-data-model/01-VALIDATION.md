---
phase: 1
slug: taxonomy-data-model
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-02
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This phase produces **no UI and no runtime behavior** — "validation" = build-time Zod schema checks + static/grep assertions over the data, not browser tests. Source: `01-RESEARCH.md` §Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | **None installed** — and none added this milestone (REQUIREMENTS excludes standing up test infra). Primary validator is the **Zod build-time gate**; lightweight assertions use Node 26 built-in `node:test` / `node:assert` (no jest/vitest/playwright). |
| **Config file** | none — see Wave 0 |
| **Quick run command** | `npm run prebuild` (runs `tsx scripts/validate-taxonomy.ts` — the Zod gate) |
| **Full suite command** | `npm run build` (prebuild gate + `next build`; proves static export still pre-renders) |
| **Estimated runtime** | prebuild ~1–2s · full build ~tens of seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run prebuild` (Zod gate — full `validateTaxonomy` + cross-record uniqueness + status-gated content checks)
- **After every plan wave:** Run `npm run build` (prebuild + `next build` — proves static export still succeeds, no route/pre-render regressed)
- **Before `/gsd-verify-work`:** `npm run build` green AND the four grep/structural assertions pass
- **Max feedback latency:** ~2 seconds (prebuild)

---

## Success-Criterion Verification Map

> Task IDs are assigned during planning; this map is keyed by success criterion / requirement and is refined into a per-task map after `/gsd-plan-phase` emits plans.

| Criterion / Req | Behavior | Test Type | Automated Command | File Exists |
|-----------------|----------|-----------|-------------------|-------------|
| **Crit 1 / IA-01** | nav + sitemap + JSON-LD read only `PAGES` (no parallel hardcoded route list) | structural + grep assertion | `node:test`/tsx asserting `PAGES.length === ~27`; grep that no `/diensten/` service URL is hardcoded outside `registry.ts` | ❌ W0 |
| **Crit 2 / IA-09** | every URL has exactly one primary keyword/intent; no duplicate keyword across pages | Zod `superRefine` (build) | `npm run prebuild` — cross-record uniqueness throws on any duplicate `primaryKeyword` or URL | ❌ W0 |
| **Crit 3 / IA-08** | each page type has typed required fields; missing/short content on `review`/`published` is blocking; `draft` shells pass | Zod schema + status gate (build) | `npm run prebuild` (structure always; content rules gated by `status`) + a negative fixture (broken published page → non-zero exit) | ❌ W0 |
| **Crit 4 / QA-03** | the "50km"/"100 km" literals are gone; radius reads from `SITE` | grep assertion | `grep -rn "straal van 50\|straal van 100\|100 km\|50km" app components` returns nothing; `SITE.serviceRadiusKm === 60` | ❌ W0 |
| **Crit 5 / SEO-08** | NAP (name, address, phone, service area) resolves from one `SITE` source with the full structured field set | structural assertion + tsc | `tsc` compiles extended `SITE` (strict); `node:test` asserts `name, address, postcode, city, province, country, geo.lat, geo.lng, serviceRadiusKm, serviceAreas[]` present | ❌ W0 |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky — all currently ⬜ pending (Wave 0 builds the validators).*

---

## Wave 0 Requirements

- [ ] `scripts/validate-taxonomy.ts` — build-blocking entry point (imports `PAGES`, runs `pagesSchema.safeParse`, prints `z.prettifyError`, `process.exit(1)`) — covers Crit 2 & 3
- [ ] `lib/services/types.ts` — `contentShellSchema`, `publishedContentSchema`, `pagesSchema` (with the cross-record uniqueness `superRefine`) — the validators themselves
- [ ] A **negative fixture / assertion** proving a broken page (duplicate keyword OR <120-word published intro) actually fails the build — without it, "blocking" is unverified (Crit 2 & 3)
- [ ] A **grep assertion** for the radius literals (Crit 4) and the no-parallel-route-list check (Crit 1)
- [ ] A **`SITE`-shape assertion** for the full NAP field set (Crit 5)
- [ ] `package.json` — add `"prebuild": "tsx scripts/validate-taxonomy.ts"` and the `tsx` devDependency (verify `tsx` at install per RESEARCH A4)

*No test framework install required — Node 26's built-in `node:test`/`node:assert` + the Zod gate suffice. Do NOT add jest/vitest (out of scope per REQUIREMENTS "no test infrastructure" this milestone).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Keyword map term/volume accuracy | IA-09 | Web search exposes no search volumes; intent is SERP-verified but exact terms/volumes are `[ASSUMED]` (RESEARCH A1) | Owner/SEO validates `primaryKeyword` strings in Google Keyword Planner / Ahrefs / SEMrush **before Phase 4 content locks** (does not block Phase 1 modeling) |
| Service-area town list | SEO-08 / D-11 | Must not claim unserved areas | Owner reviews `SITE.serviceAreas[]` town list for real coverage |
| `geo.lat/lng`, dealer/cert flags | SEO-08 / D-06 / D-12 | Owner-verify-pending facts | Modeled now as placeholders; owner confirms in Phase 4 (CONT-03/CONT-06); Maps pin is placeholder until verified |

---

## Validation Sign-Off

- [ ] All criteria have an `<automated>` verify or Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (validators + negative fixture + grep + SITE-shape)
- [ ] No watch-mode flags
- [ ] Feedback latency < 2s
- [ ] `nyquist_compliant: true` set in frontmatter (after planner emits per-task `<automated>` blocks)

**Approval:** pending
