---
phase: 08-indexation-unlock
plan: 05
subsystem: infra
tags: [seo, verification, http-probe, vercel, production]

requires:
  - phase: 08-indexation-unlock
    provides: "INDEXABLE_FLOOR = 27 from 08-04, and the 27-page published surface the probe verifies"
provides:
  - "scripts/verify-indexation.ts — a committed, re-runnable served-output probe"
  - "Phase 8 merged to main and deployed to production"
  - "Green probe runs at both gates (preview and production), recorded verbatim"
  - "docs/seo-owner-runbook.md section 6 — how to re-run the probe and what each failure means"
affects: [phase-09-measurement, phase-10-migration]

tech-stack:
  added: []
  patterns:
    - "Verify served output with a committed script, not a checklist — a checklist leaves no artifact to re-run"
    - "A probe must share only the DEFINITION of correctness with the thing it checks, never the data"
    - "Re-base sitemap URLs onto the host being probed, or probing a preview silently tests production"
    - "Separate platform behaviour from application output rather than relaxing an assertion to accommodate it"

key-files:
  created:
    - scripts/verify-indexation.ts
  modified:
    - docs/seo-owner-runbook.md

key-decisions:
  - "The probe imports only INDEXABLE_FLOOR (D-25) — importing the registry would make it agree with any bug in the taxonomy"
  - "Self-canonical compares PATHS, not full URLs: on a preview the canonical legitimately points at CANONICAL_ORIGIN"
  - "Vercel's preview X-Robots-Tag is skipped by host scope, never by relaxing the check; the page's own robots meta is enforced everywhere"
  - "Merged fast-forward to main, matching how Phases 5 and 6 landed"
  - "Nothing submitted to Google Search Console — that is Phase 9's scope"

patterns-established:
  - "Two-gate verification: preview before merge, production after (D-23)"

requirements-completed: [IDX-02, IDX-04]

duration: 34 min
completed: 2026-08-20
---

# Phase 8 Plan 05: Live Verification & Production Landing Summary

**A committed HTTP probe that verifies served output independently of the taxonomy it checks — run green against the preview before merging and against production after, closing the phase with 27/27 URLs live, every one a direct 200, self-canonical, and free of any noindex directive.**

## Performance

- **Duration:** 34 min
- **Started:** 2026-08-20T13:32:00Z
- **Completed:** 2026-08-20T14:06:00Z
- **Tasks:** 3 (1 auto + 2 checkpoints)
- **Files modified:** 2

## Accomplishments

- **The 21 built-but-hidden pages plus the hub are live and indexable in production** — verified on real HTTP responses, not inferred from a green build.
- **The repo now has the artifact it never had.** The indexation bug survived for months because nothing re-ran; `verify-indexation.ts` is a committed, re-runnable proof with a documented failure vocabulary.
- **The probe caught a flaw in its own specification on its first run** (see Deviations) — which is a good sign about the probe, not a bad one.
- **Phase 10 inherits a working checklist.** The direct-200 and self-canonical checks are exactly what the old-domain migration needs; they arrive already written and already exercised against 27 live URLs.

## Task Commits

1. **Task 1: The committed probe** — `2e13f3b` (feat)
2. **Task 2: Preview gate** — no code commit; output below
3. **Task 3: Merge + production gate + runbook** — `a2258cd` (docs) + merge to `main`

## Files Created/Modified

- `scripts/verify-indexation.ts` *(new)* — takes a base URL; asserts sitemap count against `INDEXABLE_FLOOR` with no duplicates, every URL a direct 200 under `redirect: "manual"`, no `noindex` (page meta always, `X-Robots-Tag` on production), and a self-canonical by path. Bounded concurrency of 6; prints every violation before exiting.
- `docs/seo-owner-runbook.md` — section 6, in Dutch: how to run it, when, and a table translating each failure into what actually happened. States plainly that a count below 27 means a page went dark and the number must not be lowered.

## Gate 1 — Preview (before the merge)

Deployment `dpl_5LbEPtpwfzykwQ2aU1kvS9LewnP3`, commit `2e13f3b`, all 8 guards green in the build log.

```
$ npx tsx scripts/verify-indexation.ts https://tps-ventilatie-3j38xd9bc-pushly-projects.vercel.app
✅ Indexation verified on https://tps-ventilatie-3j38xd9bc-pushly-projects.vercel.app — 27/27 sitemap URLs,
   27 direct 200s (no redirects), 27 free of any noindex directive, 27 self-canonical.
   note: 27 Vercel preview X-Robots-Tag: noindex header(s) ignored — platform behaviour on *.vercel.app,
   not application output. The header IS enforced on production.
exit=0
```

## Gate 2 — Production (after the merge)

`gsd/phase-8-indexation-unlock` fast-forwarded into `main` (`b2c8b87..a2258cd`) and pushed. Production deployment `dpl_6C1FGNExq1hGZXXneTRbsYZgTw9b` reached READY; its build log shows the full eight-guard chain running on the production deploy path for the first time.

```
$ npx tsx scripts/verify-indexation.ts https://www.tpsklimaattechniek.nl
✅ Indexation verified on https://www.tpsklimaattechniek.nl — 27/27 sitemap URLs,
   27 direct 200s (no redirects), 27 free of any noindex directive, 27 self-canonical.
exit=0
```

No platform-header note on this run — confirming the `X-Robots-Tag` check ran fully enforced on production and passed. **This is the phase's closing evidence for roadmap success criteria 2 and 3.**

## Visual verification (carried over from 08-04)

The mobile screenshot 08-04 could not capture became possible here once the Playwright Chromium download finally completed (it needed an `executablePath` pin — the installed build was 1208 while the packaged Playwright expected 1228). Captured against **production**:

| Viewport | Result |
|---|---|
| Desktop 1440 | ✅ `scrollWidth === clientWidth === 1440`, no horizontal overflow |
| Mobile 390 | ✅ `scrollWidth === clientWidth === 390`, no horizontal overflow |

Mobile renders correctly: the intro wraps in a single readable column, "Stap voor stap" stacks its 4 numbered cards vertically with full body text, the werkgebied line wraps beside its pin icon, and the FAQ accordions stack with questions wrapping over 2–3 lines and chevrons right-aligned. The `StickyContactBar` overlays the lower edge as it does site-wide — existing behaviour, not introduced here.

## Decisions Made

- **Share the definition, never the data.** The probe imports `INDEXABLE_FLOOR` and nothing else from the app. Had it read the registry, it would have agreed with any bug in the registry — the failure mode this whole phase was built to eliminate.
- **Compare canonicals by path.** On a preview the canonical correctly points at `CANONICAL_ORIGIN`; comparing full URLs would have false-failed every preview run and taught the next person to distrust the probe.
- **Merged fast-forward**, matching how Phases 5 and 6 landed, so `main`'s history stays linear and each landing remains individually revertible.
- **Nothing sent to Google Search Console.** GSC verification and sitemap submission are Phase 9; Phase 10's redirects are hard-gated behind this phase precisely because they need these live, indexable targets.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocker] The preview gate, as specified, could never pass**
- **Found during:** Task 1 — the first dry run against the 08-04 preview returned 27 violations, one per URL
- **Issue:** Vercel stamps `X-Robots-Tag: noindex` onto every response from a preview deployment. That is the platform keeping throwaway hosts out of Google; it has nothing to do with this application. D-24 specifies checking `X-Robots-Tag`, so the probe failed all 27 URLs on a deployment whose *application output* was perfectly clean. Left as-is, the D-23 preview gate would be structurally unpassable — and the obvious "fix" would have been to drop the header check entirely, which is exactly the weakening the plan forbids.
- **Fix:** Split the two signals rather than relaxing either. The page's own `<meta name="robots">` — the directive `buildMetadata()` emits, and the thing this phase actually fixed — is enforced on every host. The `X-Robots-Tag` header check is skipped **only** when the host matches `*.vercel.app`, and the skip is counted and reported in the output so it can never pass silently. On production both are enforced, which the green production run above confirms (no skip note printed).
- **Files modified:** `scripts/verify-indexation.ts`
- **Verification:** Preview run green with the skip note; production run green with no note; host-scoping checked against `www.tpsklimaattechniek.nl`, `tpsklimaattechniek.nl` and a lookalike `evil-vercel.app.attacker.com` — all three correctly enforce the header
- **Committed in:** `2e13f3b` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocker)
**Impact on plan:** The probe is strictly more accurate than specified — it now distinguishes platform behaviour from application output instead of conflating them. No assertion was weakened.

## Issues Encountered

- **Top-level `await` is unavailable** — `tsx` transpiles these scripts to CJS, so the probe body lives in an `async main()`. Noted inline.
- **Playwright's Chromium download is unreliable in this environment** — several attempts wrote nothing; the one that eventually succeeded installed build 1208 while the packaged Playwright expects 1228, so `launch()` needs an explicit `executablePath`. Worth remembering for future visual audits here.
- **12 pre-existing unpushed commits on local `main`** (the Phase-8 planning artifacts) went to origin with this push. Expected, not caused by this phase — but it is why the pushed range is `b2c8b87..a2258cd` rather than only this phase's 25 commits.

## Owner notification (D-21)

**Not sent — assigned to the operator.** D-21 calls for telling Thomas that `/diensten` carries new orientation copy and goes live unless he objects. Messaging the client is an outward-facing action, so it was surfaced rather than sent; the operator elected to handle it. Execution was not blocked on it, exactly as D-21 directs. The copy carries no pricing, certification or subsidy claims, and reverting is a one-line `status` change.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Phase 8 is complete and live.** 27 indexable pages in production, verified on served output at two gates.
- **Phase 10 is unblocked** — it was hard-gated behind this phase because pointing 301s at noindexed pages would have funnelled the legacy domain's equity into a wall. Those targets are now live 200s with self-canonicals, and `verify-indexation.ts` is the checklist that migration needs.
- **Phase 9 owns what is deliberately deferred:** GSC verification and sitemap submission, and automating this probe after every production deploy. Both are recorded as decisions in the runbook, not omissions.
- Open for the operator: notify Thomas about the new `/diensten` copy.

---
*Phase: 08-indexation-unlock*
*Completed: 2026-08-20*
