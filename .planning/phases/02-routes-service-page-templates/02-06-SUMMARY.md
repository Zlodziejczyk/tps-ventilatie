---
phase: 02-routes-service-page-templates
plan: 02-06
subsystem: content
tags: [content-port, salvage, build-verification, static-export]

requires:
  - phase: 02-03
    provides: pillar + sub-service route templates
  - phase: 02-04
    provides: lean hub
  - phase: 02-05
    provides: taxonomy-derived nav
provides:
  - "Salvaged WTW/MV/Airco copy ported into draft shells (D-04/D-05)"
  - "Whole-phase build verification: green export, 22 routes, anti-drift clean"

affects: [phase-3-seo, phase-4-content]

tech-stack:
  added: []
  patterns:
    - "Local-copy build verification (OneDrive mount deadlocks next build/tsc in place)"

key-files:
  created: []
  modified:
    - lib/services/wtw.ts
    - lib/services/mechanische-ventilatie.ts
    - lib/services/airconditioning.ts
    - scripts/assert-registry.ts

key-decisions:
  - "Content ported as status:draft mechanical salvage — no editorial expansion (Phase 4 owns that)"
  - "Dakventilator folded into MV onderhoud-reinigen intro (D-05, not a new route)"
  - "Panasonic dropped from airco copy; MV/WTW brand names generalized (owner-verify-pending)"
  - "Build gate run in a local /tmp copy — next build and tsc both deadlock on the OneDrive mount"

patterns-established:
  - "Phase verification = green static export + route coverage + anti-drift greps"

requirements-completed: [IA-02, IA-03, IA-04, IA-05, IA-06, IA-07]

duration: ~40 min
completed: 2026-06-05
---

# Phase 02 Plan 06: Content salvage port + phase verification Summary

**The existing /diensten WTW/MV/Airco copy is ported into the taxonomy draft shells (Panasonic dropped, dakventilator folded into MV), and the whole-phase gate passes: a green static export with all 22 service routes pre-rendered, TypeScript clean, and anti-drift greps empty.**

## Performance

- **Duration:** ~40 min (includes diagnosing/working around the OneDrive build deadlock)
- **Tasks:** 3 (2 code, 1 verification)
- **Files modified:** 4

## Accomplishments
- Ported salvaged copy into `status:draft` shells via an extended `draftShell(..., extra)` helper: WTW `vervangen` carries the 10-step replacement sequence + intro; WTW pillar & `onderhoud-reinigen`, MV `onderhoud-reinigen` (dakventilator facts folded in), and the airco pillar + 4 subs get intros. **Panasonic dropped** (D-05).
- Extended `assert-registry.ts` with content-port spot checks (WTW 10 steps non-empty, no Panasonic in any intro, warmtepompen brandIds intact).
- **Ran the whole-phase build gate in a local copy** and verified it green.

## Task Commits

1. **Task 02-06-1: Port salvaged copy** - `f96d5f2` (feat)
2. **Task 02-06-2: Content-port asserts** - `d0b06db` (test)
3. **Task 02-06-3: Phase verification** - no code (verification evidence below)

**Plan metadata:** committed with this SUMMARY (docs)

## Verification Evidence (02-06-3)

Build/type-check run in a local non-OneDrive copy (`/tmp/tps-build`, `npm ci` + `npm run build`) because `next build` and `tsc` both deadlock on the OneDrive mount (see Issues):

- ✅ `npm run build` exit 0. Prebuild taxonomy gate: "27 pages passed pagesSchema". TypeScript: **passed** (validates every Phase-2 file).
- ✅ Route table: `/diensten/[pillar]` (SSG) → 4 pillars; `/diensten/[pillar]/[service]` (SSG) → 17 services. 30 static pages generated.
- ✅ `out/` export: 1 hub + 4 pillar + 17 service = **22 service routes** as HTML. All 5 spot-checked routes present (`/diensten`, `/diensten/airconditioning`, `/diensten/airconditioning/installatie`, `/diensten/wtw/vervangen`, `/diensten/warmtepompen`).
- ✅ Anti-drift greps empty: no `DienstenNav`, no `DIENSTEN_DROPDOWN`, no `Panasonic` (in `app/diensten`/`lib/services`). `check-radius-literals.sh` passes (QA-03).
- ✅ `npx tsx scripts/assert-registry.ts` exit 0; `npx tsx scripts/validate-taxonomy.ts` exit 0.
- ✅ **Phase-2-authored files lint clean** (eslint exit 0 over all 17 files).
- ⚠️ Full-repo `npm run lint` exits 1: **3 errors + 3 warnings, all in 4 pre-existing files untouched by Phase 2** — `FocalParticles.tsx`, `ReviewCarousel.tsx`, `SoftAurora.tsx`, `useParticleEngine.ts` (home/particle/WebGL layer; `react-hooks/set-state-in-effect` is a new Next-16 rule). Pre-existing debt, out of scope — see Issues.

## Files Created/Modified
- `lib/services/wtw.ts` - WTW intros + 10-step `vervangen` sequence.
- `lib/services/mechanische-ventilatie.ts` - MV `onderhoud-reinigen` intro (dakventilator folded).
- `lib/services/airconditioning.ts` - Airco pillar + 4 sub intros (no Panasonic).
- `scripts/assert-registry.ts` - Content-port spot checks.

## Decisions Made
- MV/WTW brand names generalized rather than ported verbatim (the sketch flags Itho/Zehnder/etc. as unconfirmed; owner verifies in Phase 4). Airco names only the 3 confirmed taxonomy brands.

## Deviations from Plan

### Auto-handled

**1. [Environment] Build gate run in a local copy**
- **Found during:** Task 02-06-3 (phase verification)
- **Issue:** `next build` and a full-project `tsc --noEmit` both deadlock (0% CPU, no output) on the OneDrive-backed working tree — a process launched yesterday was still hung at 0% CPU after a day. The plan anticipated slowness ("run build in background + poll") but the reality is a hard hang, not slowness.
- **Fix:** Synced the source (no node_modules) to `/tmp/tps-build`, ran `npm ci` (5s) + `npm run build` (green) + `eslint` there on local SSD. The OneDrive repo stays the source of truth; the local copy is build-validation only.
- **Verification:** Build exit 0, 22 routes, TS clean (evidence above).

---

**Total deviations:** 1 environment workaround. **Impact:** none on deliverables — the green build + type-check fully validate the Phase-2 code; the build just had to run off the OneDrive mount.

## Issues Encountered
- **OneDrive build/tsc deadlock (environment).** Documented above; the durable workaround is the local-copy build. This also means the project's CI/Vercel deploy (which builds off a clean checkout) is the canonical build environment.
- **Pre-existing lint debt (out of scope).** 4 untouched files carry 3 eslint errors + 3 warnings (mostly `set-state-in-effect` in particle/aurora/carousel components). These predate Phase 2 and were not introduced or modified here; per the deviation scope boundary they were left untouched. They overlap the Phase-5 QA-06 motion-gating surface and are a good candidate for that phase or a small standalone cleanup.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 22 service routes build, render, and pre-render; nav is fully taxonomy-driven; basic metadata is wired (D-13). Phase 3 (SEO) has fixed route + breadcrumb targets to instrument.
- Recommend a small lint-cleanup (or fold into Phase 5 QA-06) for the 4 pre-existing particle/carousel lint errors so the repo lints green.

---
*Phase: 02-routes-service-page-templates*
*Completed: 2026-06-05*
