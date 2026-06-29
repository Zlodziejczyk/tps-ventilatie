---
phase: 05-lead-capture-form-security-launch-qa
plan: 05
subsystem: ui
tags: [cwv, inp, motion-gate, matchmedia, lazy-map, intersection-observer, next-image, preload]

requires:
  - phase: 05-01
    provides: hybrid hosting + active Image Optimization (AVIF/WebP) that makes preload/srcset meaningful
provides:
  - "lib/useEnableHeavyMotion.ts — SSR-safe desktop+motion gate (mobile/SSR/reduced-motion => static fallback); the reusable seam Phase 6 inherits"
  - Hero aurora gated (WebGL only desktop+motion; cheap CSS gradient otherwise) — INP protection (QA-06)
  - "components/LazyMap.tsx — IntersectionObserver-mounted map at the verified SITE.geo pin (QA-05)"
  - "LCP images modernized to Next 16 preload (QA-07)"
affects: [05-06, 06-homepage-conversion-uplift]

tech-stack:
  added: []
  patterns:
    - "SSR-safe capability gate via matchMedia, state inits false (no hydration mismatch, mobile never mounts heavy motion)"
    - "Below-the-fold third-party embeds deferred with IntersectionObserver"

key-files:
  created: [lib/useEnableHeavyMotion.ts, components/LazyMap.tsx]
  modified: [app/page-sections/HeroSection.tsx, app/contact/page.tsx, components/ServiceHero.tsx, app/over-ons/page.tsx]

key-decisions:
  - "Aurora fallback rendered as an inline Tailwind gradient inside HeroSection (approximating the aurora resting colors) rather than a new globals.css utility — keeps the change within the plan's files_modified"
  - "preload confirmed a real Next 16 <Image> prop (node_modules get-img-props.d.ts) before swapping priority -> preload — no risky guesswork"
  - "Map uses the keyless programmatic embed (output=embed) from SITE.geo; agency may swap to the official GBP 'Embed a map' iframe (same component, different src)"

patterns-established:
  - "useEnableHeavyMotion is the canonical heavy-motion gate; any future WebGL/canvas mounts through it"

requirements-completed: [QA-05, QA-06, QA-07]

duration: ~15 min
completed: 2026-06-29
---

# Phase 5 Plan 05: Mobile Launch-QA (Motion Gate + Lazy Map + Images) Summary

**An SSR-safe motion-gate hook keeps the WebGL aurora off mobile (static gradient instead), the contact map now points at the verified SITE.geo pin and lazy-mounts on scroll, and LCP images use Next 16 preload — clearing the path for the SEO-10 mobile-CWV gate.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-06-29
- **Completed:** 2026-06-29
- **Tasks:** 3
- **Files modified:** 6 (2 created, 4 modified)

## Accomplishments
- `lib/useEnableHeavyMotion.ts`: returns `false` on SSR + first render, flips true only on desktop (≥768px) with `prefers-reduced-motion: no-preference`, listening for media-query changes. Mobile/SSR/reduced-motion never mount heavy motion.
- `HeroSection`: `<SoftAurora>` now renders only when the hook is true; otherwise a cheap static Tailwind gradient — removing the main-thread WebGL INP risk on mobile (QA-06). Particles (`AmbientParticles`/`FocalParticles`) were confirmed NOT mounted on any route, so the aurora was the only gate target.
- `components/LazyMap.tsx`: a placeholder that swaps in the keyless Google Maps iframe (`output=embed`) built from `SITE.geo` (52.04823, 4.50205) only on first intersection (`rootMargin: 200px`); the contact page's wrong-coords iframe (52.0623/4.4932) is gone (QA-05).
- LCP images (`ServiceHero`, `over-ons`) switched from the deprecated `priority` to Next 16 `preload` (QA-07). All images already use `next/image` (no raw tags); no custom `quality` props exist, so the default `[75]` allowlist stands.

## Task Commits

1. **Task 1: useEnableHeavyMotion + gate hero aurora** - `438591f` (feat)
2. **Task 2: lazy-mounted contact map at SITE.geo** - (map commit) (feat)
3. **Task 3: LCP images priority -> preload** - `be191c0` (feat)

## Files Created/Modified
- `lib/useEnableHeavyMotion.ts` - SSR-safe motion gate hook
- `app/page-sections/HeroSection.tsx` - Aurora gated + static gradient fallback
- `components/LazyMap.tsx` - Lazy, corrected-pin contact map
- `app/contact/page.tsx` - Uses `<LazyMap />` (old hardcoded iframe removed)
- `components/ServiceHero.tsx` - `priority` → `preload`
- `app/over-ons/page.tsx` - `priority` → `preload`

## Decisions Made
- Inline gradient fallback (not a globals.css utility) to stay within plan scope.
- Verified `preload` against the installed Next types before the swap (avoids a broken-build preview round-trip).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Scope note in plan] Image modernization moved to the files that actually have `priority`**
- **Found during:** Task 3 (image modernization)
- **Issue:** Task 3's `files_modified` listed only `app/page-sections/HeroSection.tsx`, but the home hero is a CSS/text hero with NO `<Image>` — so it had no `priority` to modernize. The real deprecated `priority` props were in `components/ServiceHero.tsx` and `app/over-ons/page.tsx`.
- **Fix:** Swapped `priority` → `preload` in `ServiceHero.tsx` and `over-ons/page.tsx` (the plan's Task 3 scope note explicitly permits modernizing ServiceHero and recording added files here).
- **Files modified:** `components/ServiceHero.tsx`, `app/over-ons/page.tsx`
- **Verification:** Repo-wide grep confirms zero `priority` props remain; HeroSection verify passes.
- **Committed in:** `be191c0` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 scope-note redirect)
**Impact on plan:** QA-07 modernization landed on the correct files; the listed home hero needed no image change. No behavioral regression — `preload` is the Next 16 successor to `priority`.

## Issues Encountered
None. No local build attempted (OneDrive). DevTools "no canvas on mobile", the corrected pin, AVIF/WebP srcset, and mobile INP are confirmed on the Vercel preview in 05-06.

## User Setup Required
None.

## Next Phase Readiness
- Wave 2 complete. 05-03 (Wave 3) can now build `<OfferteForm>` against the secure route + schema.
- The motion-gate hook + lazy-mount pattern are the seams Phase 6 inherits.
- SEO-10 mobile CWV (INP<200ms, good LCP) is measured on the Vercel preview in 05-06.

---
*Phase: 05-lead-capture-form-security-launch-qa*
*Completed: 2026-06-29*
