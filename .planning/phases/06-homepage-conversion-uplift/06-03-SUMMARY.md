---
phase: 06-homepage-conversion-uplift
plan: 03
subsystem: ui
tags: [css, tailwind, animation, aurora, cwv, accessibility]

requires:
  - phase: 06
    provides: (none — pure CSS additions to app/globals.css)
provides:
  - ".aurora / .blob / .b1-.b3 + drift1-3 keyframes (gated pure-CSS aurora)"
  - ".fu fade-up entrance class (reduced-motion-safe)"
  - ".gmark CSS Google-G mark (conic-gradient + mask, no image)"
affects: [06-04 HomeHero, 06-05 ProofBand]

tech-stack:
  added: []
  patterns:
    - "Bare global class + @keyframes (mirrors .air-pulse) — NOT @theme/@utility"
    - "Motion gated by @media (min-width:768px) and (prefers-reduced-motion:no-preference) → zero client JS"
    - "Brand mark drawn from conic-gradient + radial mask instead of an image asset"

key-files:
  created: []
  modified:
    - app/globals.css

key-decisions:
  - "Aurora animates only on desktop+no-reduced-motion; static soft base everywhere else (protects mobile INP / SEO-10, off LCP path)"
  - "Sketch --ease-clarity translated to literal cubic-bezier(0.25,0.1,0.25,1); zero phantom sketch vars"
  - ".fu is nulled AND reset (opacity:1/transform:none) under reduced-motion so content never stays invisible"
  - ".gmark fixed 16px (validated sketch value); ProofBand wraps to scale"

patterns-established:
  - "CSS-first decorative primitives live as bare classes in globals.css, consumed by Wave-2 sections via className"

requirements-completed: [D-04, D-14, D-19]

duration: 8min
completed: 2026-07-01
---

# Phase 6 · Plan 03: CSS Primitives Summary

**Landed the three pure-CSS primitives the Wave-2 home sections consume — a desktop-gated brand-teal aurora (no WebGL), a reduced-motion-safe `.fu` fade-up, and a `.gmark` Google-"G" drawn from a conic-gradient + mask — all as bare global classes with zero phantom sketch tokens.**

## Performance

- **Duration:** ~8 min
- **Tasks:** 2
- **Files modified:** 1 (`app/globals.css`)

## Accomplishments
- `.aurora` wrapper + `.blob`/`.b1`–`.b3` variants (brand tints `#a8dff0`/`#b8e8d0`/`#baeaff`) with `drift1`–`drift3` keyframes; drift runs only inside `@media (min-width:768px) and (prefers-reduced-motion:no-preference)`, static base otherwise
- `.fu` CSS fade-up entrance using the real `cubic-bezier(0.25,0.1,0.25,1)`; added to the reduced-motion guard (nulled + reset visible)
- `.gmark` Google-"G" from `conic-gradient(from -45deg, …)` + center-cut radial mask (both `-webkit-mask` and `mask`), no image/SVG

## Task Commits

1. **Task 1: aurora + .fu fade-up** — `cc63854` (feat)
2. **Task 2: .gmark Google-G** — `dee063f` (feat)

## Files Created/Modified
- `app/globals.css` — aurora classes + drift keyframes + desktop/motion gate; `.fu` + `fu` keyframe + reduced-motion reset; `.gmark`

## Decisions Made
- Followed RESEARCH Pattern 3 CWV-optimal path (CSS media-gate) over the `useEnableHeavyMotion` JS gate — zero client JS for a purely decorative layer.
- Used the descendant structure `.aurora .blob.b1` (markup: `class="blob b1"`) so Wave-2 HomeHero renders plain spans.

## Deviations from Plan
None — plan executed exactly as written.

## Issues Encountered
None. Phantom-token gate green (no `var(--gradient-ink|--glass-strong|--shadow-|--ease-clarity|--color-bg-tint|--color-surface-2|--color-text-faint)`); all `rg` asserts pass. Tailwind v4 compiles bare classes unchanged (verified at the Wave-2/3 preview build).

## User Setup Required
None.

## Next Phase Readiness
- 06-04 HomeHero renders `<div className="aurora"><span className="blob b1"/><span className="blob b2"/><span className="blob b3"/></div>` behind the hero content.
- 06-05 ProofBand renders `<span className="gmark" />` beside the 4,9 score.
- `.fu` available as a lightweight entrance for any rebuilt section.

---
*Phase: 06-homepage-conversion-uplift*
*Completed: 2026-07-01*
