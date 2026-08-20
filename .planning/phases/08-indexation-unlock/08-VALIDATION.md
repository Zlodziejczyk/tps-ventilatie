---
phase: 8
slug: indexation-unlock
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-08-20
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **Honest constraint (from 08-RESEARCH.md §Validation Architecture):** this project has **no test
> framework** by decision and **no CI**. Local `next build` / full `tsc --noEmit` **deadlock on the
> OneDrive mount**. Validation is therefore **build-gate + pure-function assertion + live HTTP
> probe**, sampled with `tsx` — which is fast (~2 s) and reliable here. This phase's whole subject
> *is* the validation layer, so the gates below are simultaneously the deliverable and the test.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — `tsx` + `node:assert/strict` build-time CLIs (project decision) |
| **Config file** | `package.json` → `prebuild` chain (this phase makes it the complete gate) |
| **Quick run command** | `npx tsx scripts/<guard>.ts` (~2 s) |
| **Full suite command** | `npm run prebuild` (all 7 guards, ~10 s — **never** `npm run build` locally) |
| **Build gate** | push branch → Vercel preview build (~2 min) |
| **Served-output gate** | `npx tsx scripts/verify-indexation.ts <baseUrl>` (~20 s, exists from 08-05) |
| **Estimated runtime** | ~10 s local · ~2 min preview |

---

## Sampling Rate

- **After every task commit:** run the guard(s) that task touches (~2 s).
- **After every plan:** run `npm run prebuild` in full (tsx only).
- **After every landing that changes indexability** (08-02, 08-03, 08-04): push → Vercel preview
  build must be green **and** report the expected indexable count.
- **Before phase close:** `verify-indexation.ts` green against the **preview** and against
  **production** (D-23).
- **Max feedback latency:** ~2 s local · ~2 min preview.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | IDX-01 | T-8-bypass | `policy.ts` exposes the governed collection; sitemap emits only from it | unit | `npx tsx scripts/assert-seo.ts` | ✅ | ⬜ pending |
| 08-01-02 | 01 | 1 | IDX-01 | T-8-drift | Pure checker returns a violation list for injectable data | unit | `npx tsx -e "…checkIndexationInvariants()…"` | ✅ | ⬜ pending |
| 08-01-03 | 01 | 1 | IDX-01 | T-8-drift | Invariant asserted on real data, build-blocking | unit | `npx tsx scripts/assert-seo.ts` | ✅ | ⬜ pending |
| 08-01-04 | 01 | 1 | IDX-01 | T-8-decay | Invariant **provably bites**: 5 perturbations rejected, real data clean | unit | `npx tsx scripts/assert-gate-blocks.ts` | ✅ | ⬜ pending |
| 08-01-05 | 01 | 1 | IDX-01 | T-8-snapshot | Registry surface asserted relationally, not as a snapshot count | unit | `npx tsx scripts/assert-registry.ts` | ✅ | ⬜ pending |
| 08-01-06 | 01 | 1 | IDX-01 | T-8-bypass | No `robots:`/`index:false` outside the seam; every page uses `buildMetadata` | unit | `npx tsx scripts/assert-metadata-seam.ts` | ✅ | ⬜ pending |
| 08-01-07 | 01 | 1 | IDX-01 | T-8-unwired | All 7 guards build-blocking via `prebuild`; radius scan covers `lib/` | integration | `npm run prebuild` → then Vercel preview green | ✅ | ⬜ pending |
| 08-02-01 | 02 | 2 | IDX-05 | T-8-thin | Content bar scoped to rendered types; still bites hub/pillar/service | unit | `npx tsx scripts/assert-gate-blocks.ts` | ✅ | ⬜ pending |
| 08-02-02 | 02 | 2 | IDX-05 | T-8-legal | One predicate for every type; `privacy-beleid` provably non-indexable | unit | `npx tsx scripts/assert-seo.ts` | ✅ | ⬜ pending |
| 08-02-03 | 02 | 2 | IDX-05 | — | Preview green, indexable still 5 (no unintended flip) | integration | Vercel preview + `sitemap.xml` `<loc>` count = 5 | ✅ | ⬜ pending |
| 08-03-01 | 03 | 3 | IDX-02 | T-8-thin | 21 nodes `published`; every one still clears the content bar | unit | `npx tsx scripts/validate-taxonomy.ts` | ✅ | ⬜ pending |
| 08-03-02 | 03 | 3 | IDX-02 | T-8-dark | 4 pillars + 17 sub-services asserted indexable **by name** | unit | `npx tsx scripts/assert-seo.ts` | ✅ | ⬜ pending |
| 08-03-03 | 03 | 3 | IDX-02 | — | Preview green, sitemap = 26 | integration | Vercel preview + `<loc>` count = 26 | ✅ | ⬜ pending |
| 08-04-01 | 04 | 4 | IDX-03 | T-8-claim | Hub content clears ≥120 words / ≥1 step / 3–6 FAQs, anti-claim clean | unit | `npx tsx scripts/validate-taxonomy.ts && npx tsx scripts/assert-no-forbidden-claims.ts` | ✅ | ⬜ pending |
| 08-04-02 | 04 | 4 | IDX-03 | T-8-invisible | Every authored sentence renders; `FAQPage` backed by visible FAQs | unit | `node -e` source assertions on `app/diensten/page.tsx` | ✅ | ⬜ pending |
| 08-04-03 | 04 | 4 | IDX-04 | T-8-bump | Hub `published`; `INDEXABLE_FLOOR = 27` enforced with an anti-bump message | unit | `npx tsx scripts/assert-seo.ts && npx tsx scripts/assert-gate-blocks.ts` | ✅ | ⬜ pending |
| 08-04-04 | 04 | 4 | IDX-04 | — | Preview green, sitemap = 27 | integration | Vercel preview + `<loc>` count = 27 | ✅ | ⬜ pending |
| 08-05-01 | 05 | 5 | IDX-02, IDX-04 | T-8-served | Probe asserts count · direct-200 · no `noindex` · self-canonical | integration | `npx tsx scripts/verify-indexation.ts <preview>` | ✅ | ⬜ pending |
| 08-05-02 | 05 | 5 | IDX-02, IDX-04 | T-8-served | **Preview gate** green before merge (D-23) | integration | `npx tsx scripts/verify-indexation.ts <preview>` | ✅ | ⬜ pending |
| 08-05-03 | 05 | 5 | IDX-02, IDX-04 | T-8-served | **Production gate** green after merge (D-23) | integration | `npx tsx scripts/verify-indexation.ts https://www.tpsklimaattechniek.nl` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Sampling continuity:** no 3 consecutive tasks lack an automated verify — every task above has one.

---

## Wave 0 Requirements

None. `tsx` + `node:assert` infrastructure exists and was exercised end-to-end during research
(all seven guards executed 2026-08-20). No framework install required.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hub prose quality + D-12 angle | IDX-03 | Editorial judgment | Read preview `/diensten`; check intro / 5 FAQs / 4 steps / werkgebied line against D-12/D-13/D-17 and `docs/anti-claim-checklist.md` §2 |
| Owner notification of new hub copy | D-21 | Human comms | Send the preview URL to Thomas; proceed unless he objects (notify, don't block) |
| Rich Results on `/diensten` | IDX-03 | External tool | Google Rich Results Test against the preview URL — `FAQPage` + `BreadcrumbList` must validate |
| Visual sanity of the extended hub page | IDX-03 | Visual | Screenshot the preview `/diensten` desktop 1440 + mobile 390 — per `[[visual-verify-after-ui-deploy]]`, a green build is not proof it looks right |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none required)
- [x] No watch-mode flags
- [x] Feedback latency < 120 s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
