---
quick_id: 260701-koc
title: Fix StickyContactBar mobile layout (compact single-row contact pills <560px)
date: 2026-07-01
status: planned
---

# Quick Task 260701-koc — Fix StickyContactBar mobile shatter

## Problem (verified via mobile-audit harness, 2026-07-01)

`components/StickyContactBar.tsx` is the site-wide always-on contact bar (mounted at
body level in `app/layout.tsx`). Below the `max-[560px]` breakpoint the three action
buttons (Bel / WhatsApp / Offerte) stay in a **flex row** with `max-[560px]:flex-1`,
so on 320–414px screens each button is crushed to ~⅓ of the width. The "Bel" pill
collapses to ~24px and the phone text `06 - 29 40 34 50` shatters vertically:

- Bar balloons to **258px** (29% of a 390px screen, 45% of a 320px screen) vs 80px at 768px.
- Phone number wraps one token per line ("Bel / 06 / - / 29 / 40 / 34 / 50").
- The "Offerte" button is clipped off the right edge.

Confirmed at 320/360/390/414; clean at 768 (breakpoint boundary). This is the exact
bug the owner reported on an iPhone 12 Pro (390px). It is conversion-critical (the
one always-on contact CTA) and appears on every page.

## Chosen fix (owner decision)

**Compact single row of three equal icon+label pills**, with the inline phone digits
dropped on mobile (`tel:` link still dials on tap). Label "Direct contact?" stays on
its own row above the pills (the outer container is already `flex-col` <560px).

Unchanged at ≥560px — the desktop single-row layout with visible digits is correct.

## Task

### T1 — StickyContactBar mobile pill layout
- **File:** `components/StickyContactBar.tsx`
- **Action:**
  1. Hide the phone-digits span inside the "Bel" pill on mobile (`max-[560px]:hidden`)
     so only "Bel" (icon + word) shows <560px; digits reappear ≥560px.
  2. On the button group + the three pills, add `min-w-0` and mobile-tightened spacing
     (`max-[560px]:px-*`, `max-[560px]:gap-*`, smaller mobile label/icon size) plus
     `whitespace-nowrap` so labels never wrap/shatter and the row fits one line.
  3. Keep `max-[560px]:flex-1` (equal thirds) and `justify-center`.
- **Verify:** re-run `mobile-audit.mjs` against `:3100`. Gate:
  - `shatter` = 0 for the bar's phone/label spans at 320/360/390/414
  - `horizScroll` = false on the bar at all mobile widths
  - sticky bar height ≤ ~100px (down from 258px)
  - all three pills on one visible row, none clipped
  - tap height ≥44px per pill; 768px layout unchanged
- **Done:** harness shows 0 bar shatter + 0 horiz overflow at all four mobile widths,
  and a screenshot confirms three readable pills on one row.

## Out of scope (folded into Phase 7)
- A11Y-04 sticky-close button 32×32 → ≥44px (Phase 7 Wave 1).
- 40px "Bekijk …" service CTAs, 9px "Nieuw" badge, WhatsApp contrast A11Y-01,
  raw material-symbols spans → Phase 7.
