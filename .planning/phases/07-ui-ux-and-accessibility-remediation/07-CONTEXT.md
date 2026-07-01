# Phase 07 — UI/UX & Accessibility Remediation · CONTEXT

**Provenance:** Findings from the UI/UX audit of the Vercel preview (`tps-ventilatie-mpan4b7q6`), 2026-06-30 → 07-01. Method: Playwright rendered capture + objective checks (contrast ratio, touch-target geometry, heading order, alt/label/accessible-name coverage, horizontal-scroll, focus, Navigation-Timing) across **8 pages × 4 viewports** (375 / 768 / 1024 / 1440), every machine flag verified against the screenshot, graded against the `ui-ux-pro-max` design-intelligence DB. Overall score **8.7/10 (A−)**. Full method + gotchas: `ui-audit-harness` memory. Re-verify script: `./re-audit.mjs` (needs a `playwright` node_modules symlink + the current preview URL — see the memory).

**Phase goal:** WCAG 2.1 AA on the audited dimensions + brand-consistency polish, verified on preview. **A11Y-01 is the only launch-gating item.**

---

## Baseline that is already strong — do NOT regress
- **Perf:** home FCP 376 ms, load 1.28 s, 568 KB / 61 reqs. Fonts `display:swap`.
- **Semantics:** exactly 1×`h1`/page, `lang="nl"`, viewport meta, `<main>` landmark on every route, 0 images missing alt, 0 unlabeled controls, 0 interactive elements without an accessible name.
- **Responsive:** 0 horizontal scroll at 375 px on all pages; 16 px body text.
- **Reduced motion:** fully handled (CSS `@media` + framer-motion gating + desktop-only WebGL aurora for INP).
- **`OfferteForm` a11y is exemplary** (label `htmlFor` on every field, `aria-hidden` off-screen honeypot, AVG consent, fail-safe error UI). Keep intact.

---

## WAVE 1 — Accessibility (launch-hardening; shared components, independent of Phase 6)

### A11Y-01 · WhatsApp button contrast — **AA FAIL, launch-gating**
- Measured: white text/icon on `#25D366` = **1.98:1** (need 4.5:1 text / 3:1 glyph).
- Files: `components/CTABanner.tsx:34`, `components/ServiceHero.tsx:82`.
- **Recommended fix:** dark on-surface text (`#141D1F`) on the green ≈ **8.5:1** — keeps the recognizable WhatsApp green. Alt: darken green for white text (needs ≈ `#0A6E3D`, less "WhatsApp"). Pick once; apply to both files identically.
- The contact-page WhatsApp *tint row* (`bg-[#25D366]/10` + dark text) already passes — leave it (its icon is UI-10).

### A11Y-02 · Heading-level skips
- h1→h3 on `/diensten` and `/over-ons`; h2→h4 in `app/page-sections/WhyTPSSection.tsx` and the Footer.
- **Fix:** re-rank so levels nest without gaps. Visual size unchanged — keep the Tailwind `text-*` classes; only the tag/level changes. One h1/page already holds.

### A11Y-03 · Skip-link + landmark
- No keyboard skip-link on these nav-heavy pages. `<main>` already exists on every route.
- **Fix:** add `id="main"` to `<main>` and a visually-hidden-until-focus "Naar inhoud" link at the top of `app/layout.tsx` (before `<Navbar>`), `sr-only` + `focus:not-sr-only`.

### A11Y-04 · Touch targets < 44 px
- sticky-bar close **32×32** (`components/StickyContactBar.tsx`), mobile-menu accordion chevrons **40×42** (`components/MobileMenu.tsx`), review-carousel arrows **40×40** (`components/ReviewCarousel.tsx`).
- **Fix:** pad hit-area to ≥ 44×44 (keep glyph size). Inline text links ~20 px tall (breadcrumbs, "34 reviews", "privacybeleid", "Ga naar contactpagina") are WCAG 2.5.x-exempt — no action.

---

## WAVE 2 — Polish & brand consistency

### UI-05 · Dutch hero badge  ⚠ Phase-6 hero dependency
- "Clean Air Technology" (English) in `app/page-sections/HeroSection.tsx`. Replace with a Dutch equivalent (align with the SITE slogan "Specialist in gezond binnenklimaat"). Confirm the badge survives the Phase-6 rebuild before editing.

### UI-06 · Aurora hue on-brand  ⚠ Phase-6 hero dependency
- Magenta/green bands read loud vs the calm premium brand. `HeroSection.tsx` (`SoftAurora` `color1/color2`; static fallback `#a8dff0`/`#b8e8d0`). Nudge toward the brand teal/cyan (`#006580`) family.

### UI-07 · Mobile hero trust-pills  ⚠ Phase-6 hero dependency
- 3 pills on desktop, only 2 lay out cleanly at 375 px (absolute `bottom-8` + `flex-wrap`). `HeroSection.tsx`. Likely resolved by the rebuild — verify.

### UI-08 · Sticky bar vs footer
- Ensure `<body>`/layout has bottom padding = sticky-bar height so it never occludes the last footer row at full scroll. `StickyContactBar.tsx` / `app/layout.tsx`. Mitigated by the dismiss X.

### UI-09 · Mega-menu keyboard/ARIA
- Opens on hover only; no `aria-expanded` / `aria-haspopup`, no focus-open. `components/Navbar.tsx`. Add keyboard open + ARIA. Destinations already reachable (trigger links to the pillar page; subs on pillar pages + mobile menu) — enhancement, not a blocker.

### UI-10 · Contact WhatsApp icon
- Green glyph on 10 % green tint ≈ **1.89:1**. `app/contact/page.tsx:80`. Darken glyph for ≥ 3:1 (keep the tint row).

---

### UI-11 · Footer brand refresh  (routed here from the Phase-6 discussion, 2026-07-01)
- Site-wide `components/Footer.tsx`, pairs with the A11Y-02 footer heading-order pass (one footer edit). Scope agreed with owner:
  - **Real PNG logo** — replace the text wordmark (`SITE.name`) with the owner's PNG (via `next/image`), sized for the brand column.
  - **Klimaattechniek copy** — rewrite "Uw specialist in hoogwaardige ventilatieoplossingen…" to the 4-pillar klimaattechniek positioning, aligned with the SITE slogan "Specialist in gezond binnenklimaat".
  - **Live-taxonomy Diensten links** — rebuild the Diensten column from `lib/services/` (add Warmtepompen; link real pillar URLs) instead of the 4 stale links all pointing at `/diensten`.
  - **Drop the 1px border** — replace the bottom-bar `border-t border-outline-variant/20` with Atmospheric-Clarity tonal layering.
- **Owner-blocked (do NOT wait on):** Instagram/Facebook social icons — IG/FB URLs still pending from Thomas (also feeds JSON-LD `sameAs`). Ship the refresh without them; add later.

## Sequencing note (important)
**Phase 6 rebuilds the homepage hero.** Wave-1 items touch shared components (independent — may be pulled forward if launch precedes Phase 6). Wave-2 items **UI-05 / UI-06 / UI-07 live in the hero** → do them *after* Phase 6's hero lands, or fold them into Phase 6, to avoid rework. UI-08 / UI-09 / UI-10 are independent.

## Constraints
- Atmospheric Clarity: no 1px section borders (tonal layering), no `#000` text (use `on-surface` `#141D1F`), business data via the `SITE` constant, icons via the `Icon` wrapper.
- Verify on a **Vercel preview** (no local `next build` — OneDrive deadlock). Re-audit with `./re-audit.mjs`. Gate: 0 solid-bg AA contrast fails, 0 heading skips, skip-link focusable, controls ≥ 44 px.

## Open decisions for planning
1. **WhatsApp fix approach:** dark-text-on-green (recommended — keeps brand) vs darker-green-with-white.
2. **Pull Wave 1 forward** before Phase 6 / launch? (A11Y-01 is the only true launch gate.)
3. **UI-05/06/07:** remediate here after Phase 6, or hand to Phase 6's hero build?

## Success criteria (mirror ROADMAP Phase 7)
1. 0 solid-bg AA contrast failures on interactive text/controls (WhatsApp CTAs + contact icon) — preview-verified.
2. Heading outline nests without skips on every page; visual sizing unchanged.
3. Keyboard skip-link → `<main>`; all non-inline interactive controls ≥ 44 px.
4. Homepage hero on-brand + all-Dutch (Dutch badge, calmer teal aurora, clean 375 px pills) — no regression on the Phase-6 hero.
5. Mega-menu keyboard-operable with correct ARIA; sticky bar never occludes the footer.
