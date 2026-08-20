---
phase: 08-indexation-unlock
verified: 2026-08-20T14:35:00Z
status: passed
requirements_verified: [IDX-01, IDX-02, IDX-03, IDX-04, IDX-05]
requirements_unaccounted: []
success_criteria:
  total: 5
  met: 5
must_haves:
  total: 38
  verified: 38
human_verification: []
---

# Phase 8: Indexation Unlock — Verification Report

**Verified:** 2026-08-20T14:35:00Z
**Status:** PASSED — 5/5 success criteria, 5/5 requirements, 38/38 plan must-haves
**Method:** goal-backward. Every criterion re-checked against the live codebase and against
production HTTP responses, independently of what the plan summaries claim.

## Phase Goal

> Make the 21 built-but-hidden service pages visible to Google, and make that class of regression
> impossible to ship silently again.

**Both halves achieved.** The 21 pages plus the hub are live and indexable in production; the gate
that previously *enforced* the bug now asserts a relationship, is build-blocking, and was observed
failing during this verification.

## Success Criteria

### ✅ 1. `assert-seo.ts` asserts sitemap membership ⇔ `isIndexable()` per node plus a floor, and fails if either breaks

Not taken on trust — proven by perturbation during verification. One WTW node was reverted to
`draft` in the working tree and the gate was run:

```
[below-floor] Only 26 indexable pages, floor is 27. A DROP MEANS A PAGE WAS DE-INDEXED —
find out what went dark before you touch this number. Lower the floor ONLY when a page was
deliberately retired, and never raise or lower it just to make the build pass (that is what
commit 82d897b did, and it kept the entire service surface hidden from Google for months).
```

The file was restored and the gate re-run green; `git status` confirms a clean tree. The gate calls
`checkIndexationInvariants({ floor: INDEXABLE_FLOOR })`, so both halves of the criterion — the
per-node relation and the floor — are enforced by one call.

> **Verification note:** the first attempt at this proof used a `perl` line-range guard that never
> matched, so the perturbation was never applied and the gate appeared not to fire. Re-done with a
> correct edit. Recording it because a verification step that silently tests nothing is precisely
> the failure mode this phase exists to eliminate.

### ✅ 2. Production HTML for all 21 service URLs contains no `noindex` directive

All 21 checked individually against production (not sampled):

```
SC-2: checking all 21 service URLs on PRODUCTION
  ✅ 21/21 service URLs: HTTP 200, index+follow, no noindex in HTML or header
```

### ✅ 3. Production `sitemap.xml` returns 27 URLs

`curl https://www.tpsklimaattechniek.nl/sitemap.xml | grep -c '<loc>'` → **27**.
`verify-indexation.ts` additionally confirms all 27 are direct 200s, duplicate-free, and
self-canonical.

### ✅ 4. `/diensten` renders real content passing the ≥120-word / 3–6 FAQ gate

| Check | Value | Bar |
|---|---|---|
| status | `published` | must be published |
| intro | **170 words** | ≥120 |
| steps | **4** | ≥1 |
| faqs | **5** | 3–6 |
| `publishedContentSchema.safeParse` | **true** | must pass |

And rendered, on production HTML: intro's first sentence present, **4/4** step titles, **5/5** FAQ
questions, `FAQPage` JSON-LD emitted. The data bar and the rendered page agree — which is the point.

### ✅ 5. `npm run build` passes on Vercel with the new assertions in place

Production deployment `dpl_6C1FGNExq1hGZXXneTRbsYZgTw9b` (commit `a2258cd`) reached **READY**. Its
build log shows the full eight-guard `prebuild` chain running ahead of `next build`, then
`Finished TypeScript in 5.7s` and 36 static pages generated. The chain also ran green on four
successive preview builds during the phase.

## Requirements Traceability

| ID | Requirement | Evidence | Status |
|---|---|---|---|
| IDX-01 | Relational build gate instead of a hardcoded page list | `lib/seo/invariants.ts` + rewritten `assert-seo.ts`; observed failing under perturbation (SC-1) | ✅ |
| IDX-02 | All 21 service nodes published, no `noindex` in production | 21/21 verified live (SC-2); 0 `review` nodes remain in the repo | ✅ |
| IDX-03 | `/diensten` carries real content clearing the bar, published | 170 words / 4 steps / 5 FAQs, `published`, all rendered (SC-4) | ✅ |
| IDX-04 | Production `sitemap.xml` lists all 27 indexable pages | 27 `<loc>`, all direct 200s (SC-3) | ✅ |
| IDX-05 | The 6 statics carry a `status` consistent with actual indexability | 5 content statics `published`, `privacy-beleid` `draft` and serving `noindex, follow` | ✅ |

**Unaccounted requirement IDs: none.** Every ID in the phase's `phase_req_ids` is claimed by a plan
and verified here.

## Plan Must-Haves

All 38 `must_haves.truths` across the five plans were checked. Spot-verified independently rather
than read off the summaries:

- **Single-source indexability** — `isIndexable` appears nowhere outside `lib/seo/*` (one comment
  reference in `app/diensten/page.tsx`). No parallel logic survived the D-20 unification.
- **Source-agnostic checker** — `lib/seo/invariants.ts` does not contain the string `PAGES`; it
  iterates `indexableSurface()`.
- **Every guard build-blocking** — `package.json` `prebuild` chains all eight with `&&`; whole chain
  runs in **1.7s**, well inside the D-01 budget.
- **Guards provably bite** — `assert-gate-blocks.ts` carries 5 Zod perturbations and 5 invariant
  perturbations, each asserting a specific violation code, plus P5/(E) controls proving the checker
  is not simply always angry.
- **Seam enforced** — 18 files under `app/` scanned, 9 page routes all import `buildMetadata`, no
  route declares its own robots directive; the negative proof (injecting a real bypass) was executed
  during 08-01.
- **No authored sentence renders nowhere** — every hub sentence, step and FAQ located in the served
  production HTML.
- **Floor defined once** — `INDEXABLE_FLOOR` is exported from `lib/seo/invariants.ts` and imported by
  both `assert-seo.ts` and `verify-indexation.ts`; no second definition exists.

## Regression Check

This milestone has no test framework (a recorded scope decision), so the de-facto regression suite is
the guard chain, which carries assertions from Phases 1, 2, 3 and 5 — taxonomy schema, registry
helpers, content-port spot checks, NAP shape, anti-claim literals, radius literals. **8/8 green**
after the phase's changes.

Notably, this phase *strengthened* prior-phase coverage rather than eroding it: two guards that had
been silently RED for weeks (`assert-registry.ts`, `assert-gate-blocks.ts`) are green again, and a
third stale assertion (the brand lists) was found and repaired along the way.

## Code Review

`08-REVIEW.md` — 0 Critical, 1 Warning (fixed during review), 3 Info (accepted, with reasons
recorded). Both gates were re-run green after the fix.

## Deviations Across the Phase

Five in total, all in-scope repairs of the same failure class the phase targets:

| Plan | Rule | What |
|---|---|---|
| 08-01 | 1 | `assert-registry` brand assertions had gone stale (WTW/MV gained brands 2026-07-02/03) — rewritten to the helper's derivation contract |
| 08-01 | 2 | Two more guard headers still claimed "run on demand" |
| 08-04 | 1 | `assert-gate-blocks` proof (D) decayed the moment the hub gained content — repaired content-addressed |
| 08-05 | 3 | The preview gate was unpassable as specified (Vercel's platform `X-Robots-Tag`) — signals separated, not relaxed |
| review | — | Probe crashed on a malformed `<loc>` instead of reporting it |

None widened scope. No behaviour, route, or content changed beyond what the plans specified.

## Human Verification

**None outstanding for the phase itself.** Both visual viewports were captured and reviewed against
production (desktop 1440 and mobile 390, no horizontal overflow at either).

One **operator-owned** follow-up sits outside the phase gate: notifying Thomas that `/diensten`
carries new orientation copy (D-21 is explicitly *notify, don't block*, and the operator elected to
send it themselves). It does not affect any success criterion — the copy is live and reverting is a
one-line `status` change.

## Next Phase Readiness

- **Phase 10 is unblocked.** It was hard-gated behind this phase because 301s pointing at noindexed
  pages would funnel the legacy domain's equity into a wall. All 27 targets are now live 200s with
  self-canonicals, and `verify-indexation.ts` already implements the "every target 200, one hop"
  checklist that migration needs.
- **Phase 9 owns the deliberate deferrals**: GSC verification and sitemap submission, and automating
  the probe after every production deploy. Both are recorded as decisions in the owner runbook.

---
*Verified: 2026-08-20T14:35:00Z*
*Method: inline goal-backward verification (executor/verifier subagents hang on this OneDrive mount)*
