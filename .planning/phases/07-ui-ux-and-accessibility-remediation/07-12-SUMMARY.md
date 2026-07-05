---
phase: 07-ui-ux-and-accessibility-remediation
plan: 12
subsystem: ui
tags: [footer, branding, taxonomy, design-system, next-image]

requires:
  - phase: 07-ui-ux-and-accessibility-remediation
    provides: "07-02 re-ranked footer column headers h4->h2 (preserved here)"
provides:
  - Footer brand column with real PNG logo + 4-pillar klimaattechniek copy
  - Footer Diensten column driven by the live pillars()/urlFor() taxonomy (real pillar URLs incl. Warmtepompen)
  - Footer bottom bar separated by tonal layering (no 1px border)
affects: [07-08]

tech-stack:
  added: []
  patterns:
    - "Footer logo mirrors Navbar's white-chip next/image pattern (opaque white-bg PNG)"
    - "Footer nav links derive from the internal typed taxonomy, not hardcoded hrefs"

key-files:
  created: []
  modified:
    - components/Footer.tsx

key-decisions:
  - "Used pillar.pillarSlug (the real registry field) instead of the plan draft's non-existent p.slug"
  - "Bottom-bar separation via bg-surface-container rounded step (tonal layering) instead of border-t"
  - "IG/FB social icons deferred (owner-blocked on the URLs, which also feed JSON-LD sameAs)"

patterns-established:
  - "No 1px section borders — separation via surface-token step per Atmospheric-Clarity"

requirements-completed: [UI-11]

duration: 7 min
completed: 2026-07-06
---

# Phase 7 Plan 12: Footer Klimaattechniek Refresh Summary

**The site-wide footer now carries the real PNG logo, 4-pillar klimaattechniek copy, live-taxonomy Diensten links (incl. the previously-missing Warmtepompen, at real /diensten/[pillar] URLs), and a borderless tonal bottom bar — closing UI-11.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-07-06
- **Completed:** 2026-07-06
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments
- Brand column: text wordmark `<div>{SITE.name}</div>` replaced with `next/image` `/tps-logo.png` on a white chip (mirrors Navbar; `alt={SITE.name}` for SEO); tagline rewritten from ventilation-only to the 4-pillar klimaattechniek positioning aligned with `SITE.tagline`.
- Diensten column: four stale `href="/diensten"` links replaced with `pillars().map` -> `urlFor(pillar)` — the four real pillars at their real pillar URLs.
- Bottom bar: `border-t border-outline-variant/20` removed; KvK/BTW row now sits on a `bg-surface-container` rounded tonal step (no 1px hairline).
- 07-02's h2 column headers preserved (verified in the final read).

## Task Commits

1. **Task 1: Brand logo + 4-pillar copy** - `fc10713` (feat)
2. **Task 2: Diensten column from live taxonomy** - `31fba12` (feat)
3. **Task 3: Drop 1px bottom-bar border** - `6757e68` (refactor)

## Files Created/Modified
- `components/Footer.tsx` - logo Image, 4-pillar copy, taxonomy-driven Diensten links, tonal bottom bar; `next/image` + `pillars/urlFor` imports added

## Decisions Made
- Used `pillar.pillarSlug` per the live registry type (see Deviations).
- Tonal bottom-bar step (`bg-surface-container` rounded) chosen for the visual break instead of a border.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan draft referenced a non-existent `p.slug` field**
- **Found during:** Task 2 (Diensten column)
- **Issue:** The plan's example used `key={p.slug}`, but the pillar type has no `slug` field — the live registry/PillarGrid use `pillarSlug`.
- **Fix:** Used `key={pillar.pillarSlug}` (confirmed against `lib/services/registry.ts` and the individual service files).
- **Files modified:** components/Footer.tsx
- **Verification:** `grep pillarSlug lib/services/registry.ts` confirms the field; the plan's verify (pillars().map + urlFor + no stale links) passes.
- **Committed in:** `31fba12` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug/field-name correction)
**Impact on plan:** Correctness only — the taxonomy map works as intended. No scope creep.

## Issues Encountered
None. All three Node string-check verifies printed OK.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UI-11 closed at the source; final proof is the Vercel-preview eyeball (07-08): logo + klimaattechniek copy + four live pillar links + borderless bottom bar, with 07-02's h2 headers intact.
- ⚠ OWNER REVIEW: the brand paragraph is a Claude-drafted, owner-reviewable copy change (Dutch marketing content) — flag for owner sign-off.
- ⚠ DEFERRED: Instagram/Facebook social icons not added (owner-blocked on IG/FB URLs; they also feed JSON-LD `sameAs`) — add in a later pass.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-06*
