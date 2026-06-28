# 04-09 — Owner preview review: design & branding fixes (2026-06-28)

> Owner (Oskar/Pushly) walked the live preview and raised design/branding defects.
> This supersedes the "await Thomas sign-off" pause — we are in a **REVISE cycle**
> before sign-off. Captured so a fresh context session executes without re-discovery.

## Preview
- LIVE + PUBLIC (Vercel Authentication disabled by owner): https://tps-ventilatie-k4pmcvtfz-pushly-projects.vercel.app
- Built from `main@4a92eb6` (Task-1 content verified live). `x-robots-tag: noindex`.
- Deploy loop: edit → owner runs `vercel deploy --yes` (PREVIEW) → **new URL hash each time**.
- HARD CONSTRAINTS: never `git push origin main` / `vercel --prod` (main = production = launch);
  never local `npm run build`/`tsx` (OneDrive deadlock) — validate on Vercel CI via the preview.

## Confirmed defects → root cause → fix → tier

1. **Header shows "TPS Ventilatie"** (should be "TPS klimaattechniek") — on every page.
   - Root: `components/Navbar.tsx:52` hardcodes `TPS Ventilatie` (ignores `SITE.name` = "TPS klimaattechniek").
   - Also stale: `app/contact/page.tsx:124` (Maps iframe `title`); `app/privacy-beleid/page.tsx:23,67` (brand-name only — **KEEP** domain `tpsventilatie.nl` + email `info@tpsventilatie.nl`; canonical host stays the apex).
   - **DO NOT touch `lib/reviews.ts`** — those quotes are VERBATIM customer words; legacy "TPS Ventilatie" is intentional (see file comment).
   - Fix: Navbar wordmark → logo (see #2) with `alt="TPS klimaattechniek"`; correct the 3 stale brand refs. **TIER 1** (code-only).

2. **Logo not used.**
   - Asset SECURED → copied to `public/tps-logo.png` (1369×1149). Full-color circular emblem: blue snowflake + orange flame ring around "TPS" / "KLIMAATTECHNIEK".
   - CAVEAT: PNG appears to have a **white background** (not transparent) → shows as a white box on the glass navbar. Options: (a) ask Thomas for a transparent PNG/SVG + a horizontal lockup, (b) place on a white rounded chip, (c) key out the white. Sub-text "KLIMAATTECHNIEK" is illegible <40px → pair the emblem with a text wordmark "TPS klimaattechniek".
   - Fix: `next/image` in Navbar (`images.unoptimized=true`, plain `<img>` is fine); later reuse for favicon + OG. **TIER 1.**

3. **"Nieuw" badge clipped to "NIE"** in the Diensten mega-menu.
   - Root: `Navbar.tsx:170-174` badge uses `ml-auto`; collides with the long "Warmtepompen" title in a ~185px grid column, and the panel's `overflow-hidden` (line 98) clips it. Same pattern in `MobileMenu.tsx:79-83`.
   - Fix: drop `ml-auto`; badge `shrink-0 whitespace-nowrap` inline after the title; widen `DienstenPanel` (`w-[760px]` → larger) or allow the header row to wrap. **TIER 1.**

4. **Service sub-pages are walls of text** (e.g. `/diensten/warmtepompen/onderhoud`, `/airconditioning/reparatie-storing`).
   - Root: `components/ServiceHero.tsx` renders H1 + the full 120w+ intro as one block; the right column is an empty faint placeholder. (Template `app/diensten/[pillar]/[service]/page.tsx` structure is fine: Hero → Steps → BrandGrid → FAQ → Related → CTA.)
   - Fix (DESIGN): redesign `ServiceHero` — lead sentence + supporting copy, fill the right column (relevant image OR a key-facts / USP / trust card), add scannability + hierarchy. Load `Skill(sketch-findings-tps-ventilatie)` for the "Atmospheric Clarity, engineered" patterns. Imagery: `public/images/` has wtw/mv/work photos but none for airco/warmtepompen — may need assets or a non-photo visual. **TIER 2.**

5. **No manufacturer logos.**
   - Root: `components/BrandGrid.tsx` renders TEXT chips by design (the logo paths in `lib/services/brands.ts` point at assets that don't exist).
   - Fix: needs real logo assets (see ASSETS), then BrandGrid → `<img>`. **TIER 3 (asset-blocked).**

6. **No certificate badges anywhere (incl. homepage).**
   - Root: certs (BRL 100/200, erkend installateur) are text-only; homepage has no trust/cert band.
   - Fix: needs cert assets (see ASSETS); add a trust/cert band (homepage + service/over-ons). Homepage = Phase 6 + sketch-findings skill. **TIER 3 (asset-blocked).**

## ASSETS NEEDED FROM OWNER (the real blockers)
- **Manufacturer logos** (PNG/SVG, transparent): Daikin, Mitsubishi Electric, Mitsubishi Heavy, Mitsubishi Ecodan.
- **Certificate badges**: BRL (100 / 200), erkend-installateur marks, any official Daikin/Mitsubishi installer/dealer badges Thomas is entitled to use.
- **Logo**: transparent-background version + a horizontal lockup if available (current is a white-bg square).
- **Project + portrait photos** (already pending from Thomas) — also solves service-page imagery (#4).

## Suggested execution order (fresh session)
- **TIER 1 first** (high-impact, code-only, zero assets): #1 brand name, #2 logo, #3 badge → redeploy → owner re-checks the header.
- **TIER 2**: #4 ServiceHero redesign (load sketch-findings skill) → redeploy.
- **TIER 3** (once assets arrive): #5 manufacturer logos, #6 cert badges + homepage trust band (Phase 6).

## Restart
`/clear` → `/gsd-resume-work` (reads STATE.md + `.continue-here.md` → this doc).
Scope note: cross-phase polish (P4 content-gate + P2 templates + P6 homepage). The fresh session can decide whether to track this as a 04-revise or a small new "branding & polish" phase.
