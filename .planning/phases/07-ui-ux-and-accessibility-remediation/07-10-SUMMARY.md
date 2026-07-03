---
phase: 07-ui-ux-and-accessibility-remediation
plan: 10
subsystem: ui
tags: [wcag, target-size, cta, faq, accessibility]

requires:
  - phase: 07-ui-ux-and-accessibility-remediation
    provides: "07-01 edited a different ServiceHero element (HeroFacts WhatsApp button) — no collision"
provides:
  - ServiceHero + ServiceCard signature-gradient conversion CTAs at >=44px hit-height (RelatedServices covered transitively)
  - ServiceFAQ <summary> disclosure toggles at >=44px tap height
affects: [07-08]

tech-stack:
  added: []
  patterns:
    - "Primary CTA target-size fix = min-h-[44px] + inline-flex centering, gradient/label preserved"

key-files:
  created: []
  modified:
    - components/ServiceHero.tsx
    - components/ServiceCard.tsx
    - components/ServiceFAQ.tsx

key-decisions:
  - "Tracked as UI-15 (not UI-11) — the CONTEXT addendum mislabelled it; UI-11 is the footer refresh (07-12)"

patterns-established:
  - "Conversion CTAs meet the same >=44px target-size floor as the A11Y-04 non-conversion controls"

requirements-completed: [UI-15]

duration: 5 min
completed: 2026-07-03
---

# Phase 7 Plan 10: Conversion CTA + FAQ Target-Size Summary

**The money buttons (ServiceHero offerte CTA, ServiceCard 'Bekijk' CTA / RelatedServices) and the ServiceFAQ `<summary>` toggles now present >=44px tap targets via `min-h-[44px]` — closing UI-15.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-03
- **Completed:** 2026-07-03
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- ServiceHero offerte/"Bekijk" signature-gradient CTA (was ~40px) gains `min-h-[44px]` — already `inline-flex items-center`, so content centers.
- ServiceCard "Bekijk [dienst]" CTA gains `inline-flex items-center justify-center min-h-[44px]` — RelatedServices inherits the fix (it renders ServiceCard).
- ServiceFAQ native `<summary>` (~24px) gains `min-h-[44px]` — chevron + disclosure behavior unchanged.

## Task Commits

1. **Task 1: ServiceHero + ServiceCard CTAs >=44px** - `d51a8d0` (fix)
2. **Task 2: ServiceFAQ summary >=44px** - `c059019` (fix)

## Files Created/Modified
- `components/ServiceHero.tsx` - offerte CTA min-h-[44px]
- `components/ServiceCard.tsx` - CTA inline-flex centering + min-h-[44px]
- `components/ServiceFAQ.tsx` - summary min-h-[44px]

## Decisions Made
- Followed plan as specified. Inline text links (e.g. "(34 reviews op Google)") left alone per audit (WCAG 2.5.x-exempt inline text).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Both Node string-check verifies printed OK; signature-gradient look preserved.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UI-15 closed at the source; final proof is the Vercel-preview re-audit (07-08) target-size checks.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-03*
