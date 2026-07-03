---
phase: 07-ui-ux-and-accessibility-remediation
plan: 01
subsystem: ui
tags: [wcag, contrast, accessibility, tailwind, whatsapp, icon-wrapper]

requires:
  - phase: 06-homepage-uplift
    provides: live ServiceHero + CTABanner WhatsApp affordances
provides:
  - AA-safe WhatsApp CTA buttons (dark on-surface text on brand green #25D366)
  - AA-safe contact-page WhatsApp icon glyph on preserved green tint
  - CTABanner icon usage routed through the <Icon> wrapper (no raw material-symbols spans)
affects: [07-08, 07-10]

tech-stack:
  added: []
  patterns:
    - "Dark-text-on-green WhatsApp treatment (owner decision 2026-07-01) for CTABanner/ServiceHero/contact"

key-files:
  created: []
  modified:
    - components/CTABanner.tsx
    - components/ServiceHero.tsx
    - app/contact/page.tsx

key-decisions:
  - "Kept brand green #25D366; only recolored text/glyph to text-on-surface (#141D1F) per locked owner decision 2026-07-01"
  - "Two WhatsApp treatments now coexist site-wide (homepage neutral-pill vs dark-on-green) — surfaced for owner reconciliation in 07-08, not unilaterally changed"

patterns-established:
  - "WCAG contrast fixes are class-only token swaps (text-white -> text-on-surface); no geometry/focus-ring change"

requirements-completed: [A11Y-01, UI-10, UI-13]

duration: 8 min
completed: 2026-07-03
---

# Phase 7 Plan 01: WhatsApp Contrast + Icon Wrapper Summary

**Dark on-surface text/icon on the unchanged WhatsApp green lifts the two CTA buttons from 1.98:1 to ~8.5:1 and the contact glyph from 1.89:1 to >=3:1, and CTABanner's three raw material-symbols spans now route through the `<Icon>` wrapper.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-03
- **Completed:** 2026-07-03
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- A11Y-01 (the only launch-gating WCAG AA failure): WhatsApp CTA buttons in CTABanner + ServiceHero switched from `text-white` to `text-on-surface` on the unchanged `bg-[#25D366]` — text contrast rises to ~8.5:1.
- UI-10: contact-page WhatsApp icon glyph recolored from `text-[#25D366]` to `text-on-surface` on the preserved `bg-[#25D366]/10` tint row + `/20` circle — clears the >=3:1 non-text bar.
- UI-13: CTABanner's phone/chat/support_agent raw `material-symbols-outlined` spans swapped to `<Icon>`; no raw span remains in the file.

## Task Commits

1. **Task 1: Dark on-surface text on WhatsApp CTA buttons** - `9e447d9` (fix)
2. **Task 2: Darken contact-page WhatsApp icon glyph** - `134be50` (fix)
3. **Task 3: Swap CTABanner raw spans to Icon wrapper** - `80a78fa` (refactor)

## Files Created/Modified
- `components/CTABanner.tsx` - WhatsApp button `text-on-surface`; Icon import + 3 `<Icon>` swaps
- `components/ServiceHero.tsx` - HeroFacts WhatsApp button `text-on-surface`
- `app/contact/page.tsx` - WhatsApp row icon glyph `text-on-surface` on preserved tint

## Decisions Made
- Followed plan as specified. Brand green retained; no `#000`/`text-black` introduced.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. All three Node string-check verifies printed OK (OneDrive-safe; no local `next build`).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- A11Y-01 launch gate closed at the source; final proof is the Vercel-preview re-audit (07-08).
- ⚠ Site-wide WhatsApp-treatment split (homepage neutral-pill vs dark-on-green here) is intentional-per-decision but visually inconsistent — flagged for owner eyeball in 07-08.
- 07-10 will further modify ServiceHero (CTA target size) — no conflict with this class-only change.

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-03*
