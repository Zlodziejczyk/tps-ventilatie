# Codebase Concerns

**Analysis Date:** 2026-06-01

## Tech Debt

**PricingTabs — Monolithic Component:**
- Issue: All three tab panels (WTW, MV, Airco), their full data arrays, and rendering logic live in a single 620-line file. The tab indicator logic, URL sync, scroll behavior, and complex card layouts are coupled together.
- Files: `components/PricingTabs.tsx`
- Impact: Hard to extend with new tabs or pricing tiers; any pricing copy change requires navigating a very large file; increases risk of accidental breakage in unrelated tabs.
- Fix approach: Extract data arrays to `lib/pricing-data.ts`; split tab panels into `components/pricing/WTWTab.tsx`, `MVTab.tsx`, `AircoTab.tsx`; keep `PricingTabs.tsx` as a pure tab shell.

**Diensten Page — Inline Data and Layout Mixed:**
- Issue: `app/diensten/page.tsx` is 400 lines with content arrays (`AIRCO_CARDS`, `WTW_REPLACEMENT_STEPS`, `MV_BENEFITS`, `MV_CLEANING_REASONS`) defined inline alongside JSX layout.
- Files: `app/diensten/page.tsx`
- Impact: Content updates require understanding JSX structure; difficult to share data with other pages.
- Fix approach: Move data arrays to `lib/diensten-data.ts`; reduce page file to layout-only responsibility.

**Review Data Duplicated Across Two Files:**
- Issue: Review testimonials are defined separately in `app/page-sections/ReviewsSection.tsx` (18 reviews, full dataset) and `app/over-ons/page.tsx` (3 reviews, subset with different data shape — includes `initials` field that the home version lacks).
- Files: `app/page-sections/ReviewsSection.tsx`, `app/over-ons/page.tsx`
- Impact: Adding or updating a review requires changes in two places; the two data shapes are inconsistent (`timeAgo` vs `initials`).
- Fix approach: Consolidate into `lib/reviews-data.ts` with a unified `Review` type that includes both `timeAgo` and `initials`; import from both pages.

**Airco Tab is a Placeholder:**
- Issue: The Airco tab in `components/PricingTabs.tsx` (line 581–616) contains only a single "coming soon" style card with two inline price points and no detailed pricing structure comparable to WTW and MV tabs. It does not match the breadth of the other tabs.
- Files: `components/PricingTabs.tsx`
- Impact: Visitors navigating `/tarieven?tab=airco` receive incomplete pricing information; inconsistent experience.
- Fix approach: Add proper Airco pricing data arrays and card grid matching the WTW/MV pattern.

## Known Bugs

**Service-Area Radius Inconsistency:**
- Symptoms: The service radius is stated as 100 km in two info banners inside `PricingTabs.tsx` (lines 442, 519) but as 50 km in the disclaimer at the bottom of the tarieven page (`app/tarieven/page.tsx` line 62) and as an undefined "regio" in `app/over-ons/page.tsx`.
- Files: `components/PricingTabs.tsx`, `app/tarieven/page.tsx`, `app/over-ons/page.tsx`
- Trigger: Always visible on any screen width.
- Workaround: None — one of these values is wrong.

**Form Submit Has No Network Error Handling:**
- Symptoms: `lib/forms.ts` calls `fetch()` but wraps nothing in try/catch. If the network request throws (e.g., DNS failure, CORS error, timeout), the promise rejects and the `ContactForm` component has no handler for the rejection — the form will silently hang in "sending" state indefinitely.
- Files: `lib/forms.ts`, `components/ContactForm.tsx`
- Trigger: Submit the contact form with no internet connection or with an invalid webhook URL.
- Workaround: None currently.

**Google Maps Embed Uses a Placeholder `pb=` Value:**
- Symptoms: The Maps iframe src in `app/contact/page.tsx` (line 105) uses `!1s0x47c5b0e4c3e3b9a1%3A0x0` as the place ID, which is a generic placeholder coordinate (`52.0623, 4.4932`) rather than a verified Google Place ID for the actual business address. The map may not pin to the exact TPS Ventilatie location.
- Files: `app/contact/page.tsx`
- Trigger: Visible on the contact page at all times.
- Workaround: None — the embed may display a wrong or imprecise location.

**Review Timestamps Are Hardcoded and Will Age:**
- Symptoms: All review `timeAgo` strings in `ReviewsSection.tsx` are static relative strings like "2 maanden geleden", "7 maanden geleden". These were accurate when written but will become increasingly incorrect over time. In a year these will show as 2–7 months ago when they are actually 12–18 months old.
- Files: `app/page-sections/ReviewsSection.tsx`
- Trigger: Progressively worsens over time without any code change.
- Workaround: None currently.

## Security Considerations

**Webhook URL Exposed Client-Side:**
- Risk: `NEXT_PUBLIC_GHL_WEBHOOK_URL` is prefixed with `NEXT_PUBLIC_`, making it accessible in browser JavaScript. Any visitor can extract the full GoHighLevel webhook URL and submit arbitrary payloads directly, bypassing the form.
- Files: `lib/forms.ts`, `.env.example`
- Current mitigation: GoHighLevel may have its own rate limiting and validation.
- Recommendations: Move submission to a Next.js API route (or Vercel serverless function) and store the webhook URL as a server-only secret (no `NEXT_PUBLIC_` prefix). The API route validates and forwards; the client never sees the webhook URL.

**No Input Validation on Contact Form:**
- Risk: The contact form in `components/ContactForm.tsx` relies entirely on HTML5 `required` and `type="email"` attributes for validation. No server-side or JavaScript schema validation (e.g., Zod) occurs before posting to the webhook. Malformed or malicious payloads pass through.
- Files: `components/ContactForm.tsx`, `lib/forms.ts`
- Current mitigation: HTML5 browser validation only — easily bypassed via DevTools or direct HTTP.
- Recommendations: Add Zod schema validation in `lib/forms.ts` before the `fetch()` call; validate name length, email format, phone format, and message length.

**No CSRF Protection on Form Submission:**
- Risk: The static export architecture means there is no server-side CSRF token mechanism. The webhook is the sole target; if the URL leaks (see above), bots can spam the GoHighLevel webhook.
- Files: `lib/forms.ts`
- Current mitigation: None — this is an inherent risk of client-side static + external webhook architecture.
- Recommendations: Add honeypot fields to the form; implement rate limiting at GoHighLevel level; use a Vercel API route with server-side rate limiting.

## Performance Bottlenecks

**WebGL Aurora Runs on Every Hero Render:**
- Problem: `components/SoftAurora.tsx` instantiates a full OGL `Renderer`, compiles a GLSL fragment shader with 3-octave Perlin noise, and starts a continuous `requestAnimationFrame` loop every time `HeroSection` mounts.
- Files: `components/SoftAurora.tsx`, `app/page-sections/HeroSection.tsx`
- Cause: The `useEffect` dependency array includes all 13 props. If any prop reference changes (e.g., parent re-render creates a new inline object), the entire WebGL context is torn down and rebuilt.
- Improvement path: Memoize `SoftAurora` with `React.memo`; stabilize prop references with `useMemo` at call site; consider lowering DPR cap on mobile or replacing with CSS gradient fallback on low-end devices.

**Two Separate Canvas-Based Particle Systems:**
- Problem: `FocalParticles.tsx` and `AmbientParticles.tsx` both use `useParticleEngine` which runs a separate `requestAnimationFrame` loop each. On a page with both active, two animation loops run concurrently — each calling `canvas.getBoundingClientRect()` every frame (triggers layout).
- Files: `components/FocalParticles.tsx`, `components/AmbientParticles.tsx`, `lib/useParticleEngine.ts`
- Cause: No shared scheduler; `getBoundingClientRect()` called in `animate()` function inside both loops (line 342 of `useParticleEngine.ts`).
- Improvement path: Cache dimensions and update only on resize; use a shared animation scheduler if both systems co-exist on a page.

**Image Optimization Disabled:**
- Problem: `next.config.ts` sets `images: { unoptimized: true }` due to the static export constraint. All images (product photos in `PricingTabs`, work photos in `diensten`) are served at full resolution without Next.js automatic WebP conversion or responsive size generation.
- Files: `next.config.ts`, `components/PricingTabs.tsx`, `app/diensten/page.tsx`
- Cause: `output: "export"` is incompatible with Next.js Image Optimization API.
- Improvement path: Pre-optimize images at build time with `sharp` or `squoosh`; add explicit `sizes` attributes on all `<Image>` components; consider switching to Vercel-hosted deployment with ISR to re-enable optimization.

**Font Loading via External Google Fonts CDN:**
- Problem: `app/layout.tsx` loads Material Symbols via a `<link>` tag pointing to `fonts.googleapis.com`. This is a render-blocking external request (not the same as `next/font` which is self-hosted). On slow connections or when Google's CDN is slow, icons will be invisible or show as text fallback until the font resolves.
- Files: `app/layout.tsx`
- Cause: Material Symbols Outlined cannot currently be loaded via `next/font/google` with variable axis support in a straightforward way.
- Improvement path: Self-host the Material Symbols woff2 subset; or accept the current tradeoff and add `font-display: optional` to the link preload to avoid layout shift.

## Fragile Areas

**PricingTabs URL Sync (Render During Render Anti-Pattern):**
- Files: `components/PricingTabs.tsx` lines 192–196
- Why fragile: The component uses a synchronous state update during render to sync URL params with component state (`if (tabFromUrl !== prevUrl) { setPrevUrl(...); setActive(...); }`). This is the "render during render" pattern that React's strict mode warns against. It works currently but could cause double-render issues or subtle bugs in React 19's concurrent renderer.
- Safe modification: Replace with `useEffect` to sync tab state from URL params, or use `useRouter` to drive state entirely from the URL.
- Test coverage: No tests exist for this component.

**Navbar Dropdown Close Timeout Is a Plain `setTimeout`:**
- Files: `components/Navbar.tsx`
- Why fragile: The dropdown close delay uses `closeTimeout.current = setTimeout(...)`. If the component unmounts while the timeout is pending (e.g., fast navigation), the timeout fires on an unmounted component. The `useCallback` cleanup does not cancel the timeout on unmount.
- Safe modification: Add a `useEffect` cleanup that calls `clearTimeout(closeTimeout.current)` on unmount.
- Test coverage: None.

**`SoftAurora` WebGL Cleanup Race Condition:**
- Files: `components/SoftAurora.tsx` lines 287–291
- Why fragile: The cleanup checks `if (gl.canvas.parentNode)` before calling `container.removeChild(gl.canvas)`. If React renders a new `SoftAurora` before the previous cleanup runs (e.g., StrictMode double-invoke), two canvases could be appended and only one removed.
- Safe modification: Use a mounted flag or ref to track canvas state; ensure only one canvas is ever appended per container.
- Test coverage: None.

## Scaling Limits

**Review Data is Hardcoded (Static Array):**
- Current capacity: 18 reviews in `ReviewsSection.tsx`; 3 in `over-ons/page.tsx`.
- Limit: Adding reviews requires a code change and redeployment. There is no CMS or external data source.
- Scaling path: Pull reviews from a headless CMS (e.g., Sanity, Contentful) or the Google Places API at build time via `getStaticProps` / server component fetch; cache with `revalidate`.

**Pricing Data is Hardcoded (Static Arrays in Components):**
- Current capacity: WTW (6 units, 3 maintenance), MV (3 maintenance, 3 replacement, 5 dakventilator), Airco (2 inline price points).
- Limit: Any price change requires editing source files and redeploying.
- Scaling path: Extract to `lib/pricing-data.ts` as a first step; then move to a CMS or structured JSON if the client updates prices frequently.

## Dependencies at Risk

**`ogl` — Low-level WebGL Library:**
- Risk: `ogl@1.0.11` is a relatively niche library with low community adoption. The package has limited long-term maintenance guarantees and no major corporate backing.
- Impact: If `ogl` is abandoned or breaks with future browser WebGL changes, `SoftAurora.tsx` would need a full rewrite.
- Migration plan: The custom GLSL shader is self-contained. If needed, the OGL rendering setup can be replaced with raw `WebGLRenderingContext` calls or swapped to Three.js (much larger ecosystem).

**`framer-motion@^12` — Version Range is Wide:**
- Risk: The `^12` range allows any `12.x.x` update. Framer Motion 12 introduced breaking API changes from v10/v11. A minor version bump within v12 could still shift behavior of layout animations or spring physics used extensively in `Navbar.tsx` and `HeroSection.tsx`.
- Impact: Subtle visual regressions in dropdown animations or hero word cycling.
- Migration plan: Pin to an exact version (e.g., `12.38.0`) in `package.json` until the site is thoroughly tested; use `npm audit` on each upgrade.

## Missing Critical Features

**No sitemap.xml or robots.txt:**
- Problem: Neither `app/sitemap.ts` nor `public/robots.txt` exists. Search engine crawlers have no explicit instructions about crawlable pages, and Google Search Console will flag the absence of a sitemap.
- Blocks: Full SEO indexing of all 6 routes (`/`, `/diensten`, `/tarieven`, `/over-ons`, `/contact`, `/privacy-beleid`).

**No Open Graph / Twitter Card Metadata:**
- Problem: `app/layout.tsx` defines only `title`, `description`, and `keywords` metadata. There are no `openGraph`, `twitter`, or `icons` metadata entries. Social sharing links (WhatsApp, LinkedIn) will render without preview images or structured titles.
- Blocks: Social sharing generates blank previews.

**No Structured Data (JSON-LD):**
- Problem: As a local service business, TPS Ventilatie would benefit from `LocalBusiness` and `Service` JSON-LD schema. None is present.
- Blocks: Google rich results (star ratings, business info in Knowledge Panel) will not appear.

## Test Coverage Gaps

**Zero Test Coverage — No Test Infrastructure:**
- What's not tested: The entire codebase has no test files and no test runner configured (`package.json` has no test script, no jest/vitest/playwright dependency).
- Files: All files under `app/`, `components/`, `lib/`
- Risk: Regressions in critical paths (form submission, pricing tab URL sync, particle engine cleanup) will only be discovered in production.
- Priority: High

**Contact Form Submission Flow:**
- What's not tested: The webhook submission happy path, network failure fallback, and form state machine (`idle` → `sending` → `success`/`error`) are entirely untested.
- Files: `components/ContactForm.tsx`, `lib/forms.ts`
- Risk: A silent regression in `submitForm()` would stop all leads from reaching GoHighLevel with no visibility.
- Priority: High

**PricingTabs URL Sync:**
- What's not tested: Navigating to `/tarieven?tab=airco` or `/tarieven?tab=mv` and verifying the correct tab activates; deep link to `#wtw-onderhoud` scrolls correctly.
- Files: `components/PricingTabs.tsx`
- Risk: URL-driven tab selection could break silently when Next.js router behavior changes.
- Priority: Medium

---

*Concerns audit: 2026-06-01*
