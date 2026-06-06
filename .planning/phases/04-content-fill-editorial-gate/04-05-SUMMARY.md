---
phase: 04-content-fill-editorial-gate
plan: 05
subsystem: content
tags: [wtw, balansventilatie, isde, ventilatie, ymyl, dutch]

requires:
  - phase: 04-content-fill-editorial-gate
    provides: 04-01 anti-claim gate + checklist; ContentShell Zod gate (P1)
provides:
  - Complete WTW silo (pillar + 5 subs) at status review; ported intros expanded
  - Live wtw.ts D-02 "gecertificeerd" violation fixed -> interim vakkundig/ervaren
  - 2026 WTW ISDE story (isolatiemaatregel precondition + rendement/capaciteit) citing rvo.nl ventilatie URL
affects: [04-09]

tech-stack:
  added: []
  patterns:
    - "Expand-and-complete a partially-ported silo (intros up to >=120w, FAQs net-new)"

key-files:
  created: []
  modified:
    - lib/services/wtw.ts

key-decisions:
  - "WTW ISDE always paired with the isolatiemaatregel precondition — never a blanket 'ventilatie is gesubsidieerd' (D-13)"
  - "Rendement/capaciteit thresholds stated (centraal 85%/125 m³/h, decentraal 80%/80 m³/h) as durable facts; amounts -> consult"
  - "wtw.ts:65 'gecertificeerde monteurs' -> 'vakkundige, ervaren monteurs' (D-02), and kept matchable literals out of comments"

patterns-established: []

requirements-completed: [CONT-01, CONT-02, CONT-04, CONT-09]

duration: 22 min
completed: 2026-06-06
---

# Phase 04 Plan 05: WTW Silo Summary

**Half-ported WTW pages turned into a complete 6-node silo: the live "gecertificeerde monteurs" D-02 violation fixed, every intro expanded to ≥120 words, 19 net-new distinct FAQs added, and the accurate 2026 WTW ISDE story (qualifies only with an isolatiemaatregel + rendement/capaciteit thresholds, citing the rvo.nl ventilatie URL, amounts to a consult) on the pillar — all 6 nodes at `review`.**

## Performance
- **Duration:** ~22 min
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Fixed the live D-02/D-13 violation (`wtw.ts:65` "gecertificeerde monteurs" → "vakkundige, ervaren monteurs"); grep confirms no "gecertificeerd" remains anywhere (incl. comments).
- Widened `draftShell` for `faqs?`. Expanded all ported intros and wrote 3 empty ones: intros 147/136/143/147/140/146 words. Added 19 distinct FAQs (the silo had none); per-node split [4,3,3,3,3,3], no duplicates.
- ISDE canonical FAQ on the pillar: WTW qualifies from 2026 ONLY combined with an isolatiemaatregel, at minimaal rendement/capaciteit (centraal 85% / 125 m³/h, decentraal 80% / 80 m³/h), aanvraag binnen 24 maanden na de isolatiemaatregel, bouwjaar vóór 1-1-2019; cites `rvo.nl/.../ventilatie`; amounts → consult. The aanleggen node points to this canonical FAQ rather than restating it.
- Added 4 new named-const step arrays (pillar, onderhoud, inregelen, storing, aanleggen) plus reused `WTW_REPLACEMENT_STEPS` for vervangen. Formal `u`; interim "vakkundig"/"ervaren".

## Task Commits
1. **Tasks 1+2: fix violation + complete WTW silo** - `879310e` (feat)

## Files Created/Modified
- `lib/services/wtw.ts` - violation fixed, 6 nodes expanded/filled, 19 FAQs, 4 new step consts, status→review

## Decisions Made
See key-decisions. The isolatie-precondition pairing is the key YMYL discipline (no blanket ventilatie-subsidy claim).

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None. (Header comment initially quoted the old violation literal for documentation; reworded before the anti-claim grep — caught pre-commit.)

## User Setup Required
None.

## Verification Notes
- OneDrive-safe text validation: 6 nodes review, intros ≥120w, FAQ 3–6/node, no dup, steps present, pillar cites rvo.nl + isolatie precondition; dedicated gecertificeerd-removed check + anti-claim grep clean. `tsx`/build deferred to Vercel CI.

## Next Phase Readiness
- WTW silo complete and accurate, ready for 04-09 owner review. Mechanische ventilatie (04-06) is next — the trickiest ISDE nuance (MV qualifies only for CO2-gestuurde systems + isolatie).

---
*Phase: 04-content-fill-editorial-gate*
*Completed: 2026-06-06*
