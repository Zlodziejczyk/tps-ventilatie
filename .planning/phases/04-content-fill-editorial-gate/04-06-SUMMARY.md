---
phase: 04-content-fill-editorial-gate
plan: 06
subsystem: content
tags: [mechanische-ventilatie, co2-gestuurd, isde, dakventilator, ymyl, dutch]

requires:
  - phase: 04-content-fill-editorial-gate
    provides: 04-01 anti-claim gate + checklist; ContentShell Zod gate (P1)
provides:
  - Complete MV silo (pillar + 4 subs) at status review
  - Precisely-scoped MV ISDE (CO2-gestuurd >125 m³/h + ≥2 sensoren + isolatiemaatregel) citing rvo.nl
  - Retained folded dakventilator content (P2 D-05) in onderhoud-reinigen
affects: [04-09]

tech-stack:
  added: []
  patterns:
    - "Narrow-condition YMYL framing: subsidie answer enumerates the disqualifying case (plain box) to prevent over-promise"

key-files:
  created: []
  modified:
    - lib/services/mechanische-ventilatie.ts

key-decisions:
  - "MV ISDE answer explicitly states the disqualifier ('een gewone box zonder CO2-sturing komt niet in aanmerking') — the strongest guard against the blanket-subsidy over-promise (Pitfall 3)"
  - "Folded dakventilator content (4-5 jr onderhoud, wisselstroom tot 80% meer verbruik) kept in onderhoud-reinigen + reused in vervangen"

patterns-established: []

requirements-completed: [CONT-01, CONT-02, CONT-04, CONT-09]

duration: 20 min
completed: 2026-06-06
---

# Phase 04 Plan 06: Mechanische Ventilatie Silo Summary

**Complete MV silo (pillar + vervangen/onderhoud-reinigen/storing/aanleggen) with the trickiest ISDE story scoped precisely — MV qualifies from 2026 ONLY for CO2-gestuurde systemen (>125 m³/h, ≥2 sensoren) combined with an isolatiemaatregel, and the copy explicitly names the disqualifying case so it can never read as a blanket subsidy — the folded dakventilator content retained, all intros ≥120w, FAQs everywhere, all 5 nodes at `review`.**

## Performance
- **Duration:** ~20 min
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Widened `draftShell` for `steps?`/`faqs?`. Filled/expanded 5 nodes: intros 155/140/144/144/147 words; FAQ split [4,3,3,3,3], 16 distinct questions, no duplicates.
- Pillar ISDE FAQ (canonical): CO2-gestuurd (>125 m³/h + ≥2 CO2-sensoren) + isolatiemaatregel + bouwjaar/24-mnd window; explicitly states "een gewone ventilatiebox zonder CO2-sturing komt niet in aanmerking"; cites the rvo.nl ventilatie URL; amounts → consult. No euro, no blanket claim.
- Retained the ported dakventilator content (onderhoud iedere 4–5 jaar; wisselstroom tot 80% meer verbruik) in onderhoud-reinigen and reused the energy fact in vervangen — no new route (P2 D-05 watch-item honored).
- 5 named-const step arrays; formal `u`; interim "vakkundig"/"ervaren".

## Task Commits
1. **Tasks 1+2: complete MV silo** - `feced46` (feat)

## Files Created/Modified
- `lib/services/mechanische-ventilatie.ts` - 5 nodes filled/expanded, 5 step consts, narrow ISDE on pillar, status→review

## Decisions Made
See key-decisions. Naming the disqualifying case in the subsidie answer is the key anti-over-promise device for this pillar.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None.

## Verification Notes
- OneDrive-safe text validation: 5 nodes review, intros ≥120w, FAQ 3–6/node, no dup, steps present, pillar cites rvo.nl + CO2 + isolatie, dakventilator content retained; anti-claim grep clean. `tsx`/build deferred to Vercel CI.

## Next Phase Readiness
- All four service silos (airco, WP, WTW, MV) are now drafted at `review`. Brands + pricing copy (04-07) is the last Wave 2 plan; then the human gates 04-08 (intake) and 04-09 (editorial sign-off + publish).

---
*Phase: 04-content-fill-editorial-gate*
*Completed: 2026-06-06*
