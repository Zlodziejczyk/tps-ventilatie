---
phase: 07-ui-ux-and-accessibility-remediation
plan: 06
subsystem: ui
tags: [wcag, keyboard, aria, mega-menu, navbar]

requires: []
provides:
  - Keyboard-operable desktop mega-menu (Diensten/Tarieven) with aria-haspopup + aria-expanded, onFocus-open, Escape-close
affects: [07-08, 07-09]

tech-stack:
  added: []
  patterns:
    - "Dropdown triggers expose aria-expanded bound to open state; focus opens (mirrors hover), Escape closes"

key-files:
  created: []
  modified:
    - components/Navbar.tsx

key-decisions:
  - "Kept the existing hover/spring open logic; added keyboard/ARIA as a non-structural enhancement (destinations already reachable via the real <Link> + mobile menu)"
  - "Left the Navbar chevron motion.span (raw material-symbols) as-is — out of UI-09 scope and needs Framer animate; not a pre-existing issue this task should auto-fix"

patterns-established:
  - "Hover menus get keyboard parity via onFocus-open + Escape-close without removing hover"

requirements-completed: [UI-09]

duration: 4 min
completed: 2026-07-06
---

# Phase 7 Plan 06: Keyboard Mega-Menu Summary

**The desktop Diensten/Tarieven mega-menu is now keyboard-operable: `aria-haspopup="menu"` + `aria-expanded` bound to open state, opens on `onFocus`, closes on `Escape` — hover/spring behavior preserved. Closes UI-09.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-07-06
- **Completed:** 2026-07-06
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Added `aria-haspopup="menu"` and `aria-expanded={active === link.label}` to the dropdown trigger `<Link>` so assistive tech hears the popup + expanded state.
- `onFocus={() => openDropdown(link.label)}` opens the matching panel from the keyboard (mirrors hover); `onKeyDown` closes it on `Escape` via `setActive(null)`.
- Existing `onMouseEnter`/`onMouseLeave`, href, classes, and the spring AnimatePresence panel are untouched.

## Task Commits

1. **Task 1: ARIA + keyboard open/close on mega-menu** - `a8b69c4` (feat)

## Files Created/Modified
- `components/Navbar.tsx` - dropdown trigger ARIA + onFocus/onKeyDown handlers

## Decisions Made
- Enhancement-only: the trigger stays a real navigable `<Link>`; no structural change to the panel.

## Deviations from Plan

None - plan executed exactly as written. (The Navbar chevron `motion.span` raw material-symbols is left as-is — out of UI-09 scope and required by the Framer rotate animation.)

## Issues Encountered
None. Node string-check verify printed OK.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UI-09 closed at the source; final proof is the Vercel-preview keyboard walkthrough (07-08): Tab to Diensten opens the panel, Tab reaches sub-links, Escape closes.
- 07-09 (Nieuw badge) depends on this plan and also edits Navbar.tsx — runs next, no collision (different element).

---
*Phase: 07-ui-ux-and-accessibility-remediation*
*Completed: 2026-07-06*
