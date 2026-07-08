# Phase 7 — Re-audit RESULTS (07-08 verification gate)

**Date:** 2026-07-08
**Preview:** https://tps-ventilatie-r6q8rfhg1-pushly-projects.vercel.app
**Commit:** `2578956` (docs(07-09): complete Nieuw badge legibility plan)
**Build gate:** ✅ Vercel preview build **READY** (deployment `dpl_63SDZNEVAHhgobinyU5CUWns6svz`, type LAMBDAS/hybrid — no build errors)
**Harness:** `re-audit.mjs` (Playwright, 7 pages × desktop+mobile, + tablet/laptop/sticky/menu/focus probes)
**Evidence:** `07-08-audit.json` (this dir) + screenshots in session scratchpad `.../shots/`

---

## Machine gates — ALL GREEN

| Page | h1Count | heading order | skipLink | solid-bg AA contrast fails |
|------|---------|---------------|----------|----------------------------|
| `/` | 1 ✅ | clean ✅ | true ✅ | 0 ✅ |
| `/contact` | 1 ✅ | clean ✅ | true ✅ | 0 ✅ |
| `/diensten` | 1 ✅ | clean ✅ (¹) | true ✅ | 0 ✅ |
| `/diensten/airconditioning` | 1 ✅ | clean ✅ | true ✅ | 0 ✅ |
| `/tarieven` | 1 ✅ | clean ✅ | true ✅ | 0 ✅ (²) |
| `/over-ons` | 1 ✅ | clean ✅ | true ✅ | 0 ✅ |
| `/diensten/airconditioning/installatie` | 1 ✅ | clean ✅ | true ✅ | 0 ✅ |

Also on every page: 0 images missing `alt`, 0 unlabeled form controls, 0 interactive elements without an accessible name, `lang=nl`, correct viewport meta, **no horizontal scroll at 375px**.

**Touch targets (A11Y-04 / 07-04):** the previously-flagged **sticky-bar close** and **review-carousel arrows** are **absent** from `smallTargets` on every page ✅. Residual sub-44px items are pre-existing patterns out of this gate's scope: desktop top-nav text links (24px), breadcrumb links (20px), and inline underline links in running text.

**Focus probe (A11Y-03 / UI-09):** first Tab stop is the skip link **"Naar inhoud"** (focusable, `#`-anchor) ✅; subsequent Tab stops (logo, Home, **Diensten**, sub-items) all show a visible focus outline.

**Perf (bonus):** `/` FCP 720ms / load 1025ms / 573KB · `/contact` FCP 564ms / load 1180ms / 483KB.

---

## ¹ ² Two audit artifacts (NOT real failures) — verified against source + screenshots

Per the harness memory ("never trust a number alone; verify visually"), both automated flags were run down and confirmed benign:

**¹ `/diensten` "Skipped from h1 to h3"** — **audit artifact.**
`app/diensten/page.tsx:43` has a valid `<h2 className="sr-only">Onze vakgebieden</h2>` between the h1 (line 30) and the ServiceCard `<h3>` pillar cards. The real assistive-tech heading order is **h1 → h2 → h3** (no skip; the h2 is visually hidden but exposed to AT — not `aria-hidden`/`display:none`). The harness only flagged it because its `visible()` filter drops the 1×1px `sr-only` element from the order check.

**² `/tarieven` "2 solid-bg contrast failures"** — **audit artifact (active-tab indicator).**
The two flags (`span.material-symbols-outlined "air"`, `span.sm:hidden "WTW"`, white on `rgb(241,251,254)`) are the PricingTabs **active-tab** label + icon. The active tab's teal background comes from a separately-positioned `indicatorStyle` element (a sibling, not a DOM ancestor), so the ancestor-walking contrast function reads the section's near-white bg. The `tarieven__mobile-fold.png` screenshot shows the active **WTW** tab as white-on-solid-teal — high contrast, fully legible. **Real solid-bg AA contrast failures = 0.**

---

## Manual / visual pass (pre-verified from harness screenshots)

- **UI-05 Dutch badge** — "SPECIALIST IN GEZOND BINNENKLIMAAT" green pill on the hero ✅
- **UI-06 calm teal CSS aurora** — soft teal/green hero backdrop ✅
- **UI-07 clean 375px hero** — gradient H1 renders as clipped teal→green text (the Phase-6 gradient-text fix held; not blue blocks), no overflow ✅
- **UI-08 footer clearance** — footer KvK/BTW row clear of the sticky contact bar at desktop + 375px ✅
- **UI-11 footer** — PNG logo renders, 4-pillar klimaattechniek copy, four live Diensten links (incl. Warmtepompen), no 1px bottom-bar border ✅
- **UI-12 "Nieuw" badge** — `text-[11px]` (07-09), legible in the diensten cards + mobile menu ✅
- **UI-09 mobile menu** — Diensten expands to 4 chevron rows; rows generously tall ✅

## Remaining genuine human checks (cannot be screenshotted)

- **UI-09 keyboard mega-menu** — ✅ CONFIRMED by owner (2026-07-08): Tab focuses the Diensten trigger (visible focus ring) → mega-menu opens; Escape closes it with focus retained on the trigger. Keyboard-operable, no trap, visible focus.
- **UI-15 FAQ `<summary>` ≥44px** — the harness `smallTargets` selector doesn't measure `<summary>`; eyeball an FAQ accordion on a service page.
- **UI-14 320px spot-check** — quick pass at 320px for clipped cards / CTA overflow (low priority).

## Owner-decision items

- **WhatsApp treatment split → RESOLVED (owner chose "unify now", 2026-07-08).** Commit `c2b6da8` reconciles the two dark-on-green WhatsApp CTAs (`CTABanner.tsx`, `ServiceHero.tsx`) to the canonical AA-safe neutral pill + `text-primary` chat glyph — matching the homepage ClosingCTA / StickyContactBar treatment. Verified-existing tokens (`surface-container-lowest/-high`, `on-primary-fixed`, `primary`); AA-safe by construction (dark text on a light tonal surface). Left intentionally: the contact-page info-row green `/10` tint (not a CTA) and the mobile-menu `signature-gradient` WhatsApp (primary-CTA emphasis).
  - **Build:** ✅ green — the `c2b6da8` Vercel preview (`itrnmxzqr`) build **compiled successfully in 21s** (all routes, incl. every page using CTABanner/ServiceHero); confirmed via build logs.
  - **Deployed VISUAL confirmation: ✅ CONFIRMED on production (2026-07-08).** After merging the branch to `main`, the production deploy (`8k2j3eshe`, commit `cb155c0`) built in 9s and a targeted Playwright check verified the unified WhatsApp CTAs render correctly: **CTABanner** = white pill + dark text (`rgb(0,31,41)`) + teal chat glyph, **17.1:1**, 167×48px (matches its sibling Bel pill on the dark band — see `cta-band.png`); **ServiceHero** = `surface-container-high` pill + dark text + teal glyph, **14.01:1**, 421×52px (see `wa-service.png`). Both ≥44px, AA-safe, visually clean. The earlier `itrnmxzqr` preview stall was a transient Vercel output-deploy issue (a fresh build of the same commit deployed in 9s).
    - _My quick probe also flagged the MobileMenu WhatsApp (white on `signature-gradient`, off-screen at desktop) at 1.11:1 — a gradient false-positive (the authoritative `re-audit.mjs` excludes gradients via `overGradientOrImage`); intentionally left as the primary-CTA emphasis, unchanged by this work._
- **Footer IG/FB social icons** — **deferred to post-launch** (owner decision, 2026-07-08); revisit with the Instagram + Facebook URLs then (footer + JSON-LD `sameAs`).

## Verification provenance

- **Machine + visual a11y/UI gate (A11Y-01..04, UI-05..15):** preview `r6q8rfhg1` (commit `2578956`) — the full 8-page audit above. All green.
- **WhatsApp unification (`c2b6da8`):** build-verified green; deployed-visual pending (infra, see above). Code delta vs the audited `2578956` is 2 className lines in 2 files — no gate-relevant surface changed.
