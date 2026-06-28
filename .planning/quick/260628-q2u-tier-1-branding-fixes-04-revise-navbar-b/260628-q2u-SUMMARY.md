---
quick_id: 260628-q2u
slug: tier-1-branding-fixes-04-revise-navbar-b
date: 2026-06-28
status: complete
commits:
  - cbd285d  # feat: brand name + logo
  - 8fbd954  # fix: Nieuw badge clip
preview: https://tps-ventilatie-67hwltb0k-pushly-projects.vercel.app
---

# Quick Task 260628-q2u — SUMMARY

TIER 1 of the owner's 2026-06-28 preview review (OWNER-FEEDBACK-2026-06-28.md):
the high-impact, code-only, zero-asset branding fixes. Shipped to a fresh Vercel
**preview** (not production) for owner re-check.

## What changed

### Task 1 — Brand identity (commit cbd285d)
- `components/Navbar.tsx`: replaced the hardcoded "TPS Ventilatie" wordmark with
  the logo emblem (`public/tps-logo.png` via `next/image`, on a white rounded
  chip because the PNG is opaque white-bg / RGB-no-alpha) **+** a `{SITE.name}`
  text wordmark ("TPS klimaattechniek", `text-lg sm:text-xl whitespace-nowrap`
  so the longer name fits small screens). Added `Image` + `SITE` imports.
- `app/contact/page.tsx`: Maps iframe `title` now sourced from `SITE`
  (`${SITE.name} locatie - ${SITE.address}, ${SITE.postcode} ${SITE.city}`) —
  also removed a hardcoded address.
- `app/privacy-beleid/page.tsx` (×2): brand name → "TPS klimaattechniek";
  domain `tpsventilatie.nl` + email `info@tpsventilatie.nl` left intact.
- `lib/reviews.ts` deliberately untouched (verbatim customer quotes).

### Task 2 — "Nieuw" mega-menu badge clip (commit 8fbd954)
- `components/Navbar.tsx` DienstenPanel: dropped `ml-auto`; wrapped title+badge
  in a `flex flex-wrap` group with the badge `shrink-0 whitespace-nowrap`, and
  widened the panel `w-[760px]` → `w-[840px]`. The badge now sits inline and can
  never clip (wraps instead).
- `components/MobileMenu.tsx`: same `shrink-0 whitespace-nowrap` on its badge.

## Verification (Vercel CI + live preview)
- **Build PASSED on Vercel CI** (real validation — local builds deadlock on
  OneDrive): prebuild taxonomy 27/27 + forbidden-claims 27/27 clean, TypeScript
  finished with no errors, 32 static pages generated.
- Live preview: homepage `HTTP 200` (public, no SSO redirect) + `x-robots-tag:
  noindex` (SEO-safe); navbar `tps-logo.png` present; `/privacy-beleid` shows
  "TPS klimaattechniek" with 0 stale "TPS Ventilatie" hits.
- `grep "TPS Ventilatie" app components` → only `lib/reviews.ts` (protected).

## Constraints honored
- No `git push origin main`; no `vercel --prod` — deployed **preview** only.
- No local build/`tsx` — validated on Vercel CI.
- Stayed on `main` (no branch fork off the stale origin); committed only own files
  (left `package*.json` + untracked `06-homepage/` alone).

## Known follow-ups (not this task)
- **Logo asset**: current PNG is opaque white-bg, 1.1 MB, 1369×1149. Ask owner
  for a **transparent SVG / horizontal lockup**; resize/optimize once received.
  The white chip is a deliberate stopgap.
- **TIER 2**: `ServiceHero` redesign (walls of text) — load
  `sketch-findings-tps-ventilatie`.
- **TIER 3** (asset-blocked on owner): manufacturer logos (Daikin/Mitsubishi),
  cert badges (BRL 100/200, erkend installateur), homepage trust band.
