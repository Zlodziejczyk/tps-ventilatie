---
phase: 04-content-fill-editorial-gate
plan: 03
subsystem: content
tags: [airconditioning, service-copy, faqs, ymyl, isde, dutch]

requires:
  - phase: 04-content-fill-editorial-gate
    provides: 04-01 anti-claim gate + checklist; ContentShell Zod gate (P1)
provides:
  - Complete airconditioning silo (pillar + 4 subs) at status review
  - Airco-no-ISDE fact stated in the subsidie FAQ (D-13)
  - Brand install copy (Daikin/Mitsubishi Electric/Heavy) as equipment, no dealer claim
affects: [04-09]

tech-stack:
  added: []
  patterns:
    - "Widened local draftShell to accept steps?/faqs? (mirrors wtw.ts)"
    - "Per-node named-const StepItem[] arrays; intent-angle-led intros (D-15)"

key-files:
  created: []
  modified:
    - lib/services/airconditioning.ts

key-decisions:
  - "Airco = koeling -> NO ISDE; subsidie FAQ states this plainly and nudges WP for heating (light D-20 cross-sell, in-copy since no relatedOverride field exists)"
  - "Brands named as installed equipment only; erkendInstallateur stays false (04-07)"
  - "Per-node intent angles: installatie=proces/merken, onderhoud=preventie/checklist, storing=symptomen/spoed, advies=onafhankelijke keuze/capaciteit"

patterns-established:
  - "Silo fill pattern: widen draftShell -> named-const steps -> intent-angle intros + 3-6 unique FAQs + regio localAngle -> flip all to review"

requirements-completed: [CONT-01, CONT-02, CONT-04, CONT-09]

duration: 18 min
completed: 2026-06-06
---

# Phase 04 Plan 03: Airconditioning Silo Summary

**Complete airconditioning silo — pillar + installatie/onderhoud/reparatie-storing/advies — each with a unique 138–151-word intent-angled intro, service-specific steps, 3–6 distinct FAQs and a regio localAngle, the airco-no-ISDE fact stated plainly, brands named as installed equipment only, all 5 nodes flipped to `review`.**

## Performance
- **Duration:** ~18 min
- **Tasks:** 2 (pillar + draftShell widen; 4 subs + flip to review)
- **Files modified:** 1

## Accomplishments
- Widened `draftShell` to accept `steps?`/`faqs?` (imports `FaqItem`/`StepItem`), mirroring wtw.ts.
- Filled all 5 nodes: intros 148/151/138/146/140 words; per-node FAQ split [4,4,3,3,3] with no duplicate question across the silo; ≥1 service-specific step each (5 named-const step arrays).
- YMYL: the only subsidie mention is "Voor airconditioning (koeling) is er geen ISDE-subsidie beschikbaar" (D-13); no euro amounts (pricing routed to /tarieven + consult).
- Brand install content (Daikin / Mitsubishi Electric / Mitsubishi Heavy) on the installatie node as equipment — no dealer/authorised-installer claim; formal `u`; interim "vakkundig"/"ervaren".
- All 5 nodes flipped `draft → review`.

## Task Commits
1. **Tasks 1+2: fill airconditioning silo (one cohesive data file)** - `d0953f1` (feat)

## Files Created/Modified
- `lib/services/airconditioning.ts` - filled 5 nodes, widened draftShell, 5 step consts, status→review

## Decisions Made
See key-decisions. Notably airco-no-ISDE framing + in-copy WP cross-sell (no `relatedOverride` field in locked taxonomy).

## Deviations from Plan
None - plan executed exactly as written. (Tasks 1 and 2 both target the single airconditioning.ts file and the review-flip depends on the whole silo passing the gate, so they were written and committed as one cohesive unit.)

## Issues Encountered
None. (A header comment initially contained the forbidden literals for documentation; reworded to keep matchable phrases out of the file before the anti-claim grep — caught pre-commit.)

## User Setup Required
None.

## Verification Notes
- OneDrive-safe text validation: 5 nodes, intros all ≥120w, per-node FAQ 3–6, no dup FAQ, steps present, all `review`; anti-claim grep clean (no erkend-installateur / certified-word / 6% btw). `tsx`/build deferred to Vercel CI per the OneDrive guard.

## Next Phase Readiness
- Airco silo ready for the 04-09 owner review. Warmtepompen (04-04) is next.

---
*Phase: 04-content-fill-editorial-gate*
*Completed: 2026-06-06*
