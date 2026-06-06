---
phase: 04-content-fill-editorial-gate
plan: 04
subsystem: content
tags: [warmtepompen, isde, subsidie, rvo, pricing, ymyl, dutch]

requires:
  - phase: 04-content-fill-editorial-gate
    provides: 04-01 anti-claim gate + checklist; ContentShell Zod gate (P1)
provides:
  - Complete warmtepompen silo (net-new pillar + 4 subs) at status review
  - ISDE canonical home on the pillar — durable conditions + rvo.nl cite + amounts-to-consult
  - WP pricing transparency ("op maat via offerte" + inclusions) rendered on the pillar (CONT-05)
  - Brand install copy (Daikin/Mitsubishi Ecodan) as equipment, no dealer claim
affects: [04-09]

tech-stack:
  added: []
  patterns:
    - "ISDE one-canonical-home: full conditions on pillar; subs link to it (D-16)"
    - "Pricing-on-pillar workaround: tarieven page has no WP tab, so CONT-05 framing lives in pillar content"

key-files:
  created: []
  modified:
    - lib/services/warmtepompen.ts

key-decisions:
  - "ISDE conditions stated as durable facts + literal rvo.nl URL; euro amounts always routed to a free consult (D-10) — no bedragen anywhere"
  - "Split-system caveat phrased generally ('voor sommige split-systemen gelden aanvullende voorwaarden') to stay durable rather than stating volatile kg/GWP thresholds"
  - "WP pricing framing placed on the pillar because app/tarieven/page.tsx is hardcoded JSX with no WP tab and never renders node content"

patterns-established:
  - "Net-new silo fill: widen draftShell -> per-node step consts -> intent-angle intros + canonical-home FAQ allocation -> review"

requirements-completed: [CONT-01, CONT-02, CONT-04, CONT-05, CONT-09]

duration: 24 min
completed: 2026-06-06
---

# Phase 04 Plan 04: Warmtepompen Silo Summary

**Net-new warmtepompen silo (pillar + installatie/onderhoud/reparatie-storing/advies), with the ISDE story as canonical home on the pillar — durable conditions, the official rvo.nl warmtepomp URL cited literally, and all euro amounts routed to a free consult — plus the CONT-05 "op maat via offerte" pricing rendered on the pillar, brands as installed equipment only, all 5 nodes at `review`.**

## Performance
- **Duration:** ~24 min
- **Tasks:** 2 (pillar+ISDE+pricing+widen draftShell; 4 subs + flip)
- **Files modified:** 1

## Accomplishments
- Widened `draftShell` (was 3-arg only) for `steps?`/`faqs?`. Filled 5 net-new nodes: intros 145/132/135/140/136 words; FAQ split [5,3,3,3,3], 17 distinct questions, no duplicate.
- ISDE canonical FAQ on the pillar: eligible (hybride) WP, bouwjaar vóór 1-1-2019 (of vergunning vóór 1-7-2018), volledige installatie door een bedrijf, nieuw + meldcodelijst, aanvraag binnen 24 maanden; cites `https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp`; amounts → consult. No euro figures anywhere (grep-verified).
- CONT-05 pricing-transparency FAQ on the pillar: "op maat via offerte" + inclusions (opname/warmteverliesberekening, materiaal, installatie, inbedrijfstelling) — the only WP pricing surface visitors see.
- Daikin / Mitsubishi Ecodan named as installed equipment on installatie (no dealer claim); subs link back to the pillar for ISDE rather than restating conditions (D-16). Formal `u`; interim "vakkundig"/"ervaren".

## Task Commits
1. **Tasks 1+2: fill warmtepompen silo (one cohesive data file)** - `d4070e5` (feat)

## Files Created/Modified
- `lib/services/warmtepompen.ts` - 5 net-new nodes filled, draftShell widened, 5 step consts, ISDE + pricing on pillar, status→review

## Decisions Made
See key-decisions. The pricing-on-pillar placement and the durable-conditions-not-amounts ISDE framing are the notable YMYL calls.

## Deviations from Plan
None - plan executed exactly as written. (Single cohesive file; review-flip depends on the whole silo passing, so committed as one unit.)

## Issues Encountered
None.

## User Setup Required
None.

## Verification Notes
- OneDrive-safe text validation: 5 nodes review, intros ≥120w, FAQ 3–6/node, no dup, steps present, pillar cites rvo.nl + carries op-maat pricing; anti-claim + no-euro grep clean. `tsx`/build deferred to Vercel CI.

## Next Phase Readiness
- The strongest subsidie differentiator is drafted and accurate, ready for 04-09 owner review. WTW (04-05) is next — note its live wtw.ts:65 "gecertificeerde monteurs" D-02 violation must be fixed there.

---
*Phase: 04-content-fill-editorial-gate*
*Completed: 2026-06-06*
