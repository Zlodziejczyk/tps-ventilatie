---
quick_id: 260701-koc
title: Fix StickyContactBar mobile layout (compact single-row contact pills <560px)
date: 2026-07-01
status: complete
---

# Quick Task 260701-koc — SUMMARY

## What was done
Fixed the site-wide sticky "Direct contact?" bar (`components/StickyContactBar.tsx`)
so it no longer shatters on mobile. Root cause: below the `max-[560px]` breakpoint the
three action pills used `flex-1` (equal thirds), crushing them to ~⅓ of the screen so
the long "Bel 06 - 29 40 34 50" text wrapped one token per line and the bar ballooned
to 258px while "Offerte" clipped off-screen.

### Change (single file)
- **Dropped `flex-1`** on the pills — they are now **content-sized**, so the wide
  "WhatsApp" label no longer starves its neighbours (equal-thirds was the real culprit).
- **`whitespace-nowrap`** on all three pills — text can never wrap/shatter.
- **Dropped the inline phone digits <560px** (`max-[560px]:hidden` on the number span) —
  the pill shows just "Bel"; the `tel:` link still dials. Digits remain visible ≥560px.
- **Tightened mobile spacing** (`max-[560px]`: group `gap-1`, pill `gap-1.5`, `px-2`/`px-2.5`,
  `text-sm`, icon `text-[18px]`, container `px-3`) so all three pills fit one centred row
  down to 320px.

## Verification (Playwright, local dev :3100, sticky state)
| width | shatter | overflow | clipped | horizScroll | bar height |
|-------|---------|----------|---------|-------------|-----------|
| 320px | 0 | 0 | no | no | 114px (was 258px) |
| 360px | 0 | 0 | no | no | 114px |
| 390px | 0 | 0 | no | no | 114px (owner's device) |
| 414px | 0 | 0 | no | no | 114px |
| 768px | 0 | 0 | no | no | 80px (unchanged — full digits shown) |

All three pills are 44px tall (WCAG 2.5.5). Screenshots confirm a clean
"📞 Bel · 💬 WhatsApp · 📄 Offerte" row on mobile and the unchanged desktop bar.
Harness: `scratchpad/mobile-audit.mjs` (full) + `scratchpad/verify-bar.mjs` (focused).

## Notes
- `next dev` compiled the change across all 5 viewports (HTTP 200 + rendered); standalone
  `eslint`/`tsc` hit the OneDrive timeout (known env tax) — change is className-only, low risk.
- Remaining mobile-audit findings (40px "Bekijk …" CTAs, A11Y-01 WhatsApp contrast,
  A11Y-04 sticky-close 32×32, 9px "Nieuw" badge, raw material-symbols spans) are handed
  to **Phase 7 (UI/UX & Accessibility Remediation)** per owner decision.
