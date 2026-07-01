# Phase 6: Homepage conversion uplift - Context

**Gathered:** 2026-07-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Rebuild the homepage (`app/page.tsx`) around the three validated **Sketch-D** winners — a **proof-forward hero**, an **equal scannable 4-pillar grid** with brand chips, and a **trust/proof band** — in the premium **"Atmospheric Clarity, engineered"** language, so the site's highest-traffic page turns visitors into contacted leads. The homepage *consumes* Phase-5's `OfferteForm` + layout-level `StickyContactBar`; it does not rebuild them.

**In scope:** the homepage body only — hero (proof bar + headline + compact offerte form + CSS aurora), 4-pillar grid, proof/trust band, closing CTA band, and the wiring of `home-hero.jpg`. Bake in the Phase-7 hero items (Dutch badge, calmer teal aurora, clean 375px pills, AA-safe WhatsApp) so they're built right the first time.

**Out of scope (own phases / follow-ups):**
- **Footer refresh** → **Phase 7** (logo, klimaattechniek copy, live-taxonomy links, drop 1px border) — routed there by owner decision.
- **Official manufacturer SVG brand logos** → follow-up (owner supplies brand-kit + usage rights; TIER 3 owner-blocked).
- **`OfferteForm` / `StickyContactBar` rebuild** → owned by Phase 5 (consume, don't fork).
- **Broad a11y remediation of shared components** (heading order elsewhere, touch targets, skip-link) → Phase 7.
- **Per-town location pages** (regional SEO) → v2 (BLOG-02).

</domain>

<decisions>
## Implementation Decisions

> Decision IDs are **Phase-6-local** (D-01…D-19). Project-wide / Phase-5 decisions are referenced by name.

### Page composition & scope
- **D-01 — Full rebuild.** New `app/page.tsx` = **Hero → 4-pillar grid → proof/trust band → closing CTA band**. **Retire** `ServicesSection`, `WhyTPSSection`, `ReviewsSection` (their value is absorbed: services → the pillar grid; USPs → the trust band's USP pills; reviews → the proof band's review cards). Keep the `<main>` landmark.
- **D-02 — No pricing-preview section.** Pricing transparency shows only as **USP pills** ("Geen voorrijkosten", etc.); full detail lives on `/tarieven` (reachable from nav + pillar CTAs). *(Claude's discretion: a light "vanaf" teaser is allowed only if the page reads thin — CWV-mindful.)*

### Hero (Sketch-001-D)
- **D-03 — Compact quick-start offerte form above the fold:** **Postcode + Telefoon + Dienst + submit**, phone-first, lowest friction. Build it as a **compact variant/mode of the Phase-5 `<OfferteForm>`** posting via the same secure `/api/lead` route + Zod validation — **do NOT fork a second form component**. `naam` handled lightly in compact mode (optional/inline or captured on submit); this relaxes Phase-5 **D-05** (`naam` required) for the hero layout only — the full form keeps `naam` required. Reassurance line: "Vrijblijvend · geen kosten · AVG-proof".
- **D-04 — Aurora-only hero:** pure-CSS aurora (NO WebGL), lightest LCP + sketch-faithful. Two-column **text | form**, stacks under ~860px (container query).
- **D-05 — `home-hero.jpg` goes lower, not in the hero:** wire the staged `public/images/heroes/home-hero.jpg` as a **full-width visual band lower on the page** (near/within the trust band) via `next/image` (AVIF/WebP, responsive sizes, lazy). Keeps it off the LCP path (protects **SEO-10**).
- **D-06 — Headline + geo (working copy, owner-approvable):** H1 = **"Airco, warmtepomp & ventilatie — goed geregeld in Zoetermeer en heel Zuid-Holland"** (gradient-accent span). A **coverage line** under the hero — **"Van Den Haag tot Gouda en Leiden — actief binnen 60 km rondom Zoetermeer"** — sourced from `SITE.serviceAreas` + `SITE.serviceRadiusKm`. **Rationale:** keep **Zoetermeer as the local ranking anchor** (GBP/NAP pinned there) but add **regional Zuid-Holland emphasis** (real footprint reaches Den Haag/Delft/Leiden/Gouda). Avoid a bare province-only H1 (dilutes local intent) and the non-term "Central Holland". Dutch badge (bakes in **UI-05**).
- **D-07 — Proof bar (top of hero):** **initials monogram chips** from real reviewer names in `lib/reviews.ts` (the existing `getInitials` pattern) + **4,9 ★** + a short quote + **"34 Google-reviews"**. **No fake face/silhouette avatars** (authenticity — no real customer photos exist).

### 4-pillar grid (Sketch-002-D)
- **D-08 — Equal 4-card grid, all pillars visible** (no selector hiding pillars). Pillars + icons: **Airconditioning** (`ac_unit`), **Warmtepompen** (`heat_pump`, **"Nieuw"** tag), **WTW Unit** (`hvac`), **Mechanische ventilatie** (`air`). Grid 4→2→1 columns; **independent card heights** (`align-items:start`).
- **D-09 — Primary card click → the pillar page** (`/diensten/[pillar]`, SEO + user expectation). A **distinct "Offerte" CTA** per card **pre-selects that service in the hero form** (controlled `<select>` value) and **scrolls to it** — the ★ signature conversion gesture (React ref-scroll, not the sketch's inline `onclick`).
- **D-10 — Sub-service chips = internal links** to sub-service pages (Phase-3 SEO asset), sourced from the `lib/services/` taxonomy.
- **D-11 — Card detail depth = Claude's discretion.** Default: **chips-as-links, no expand-drawer** (best CWV); a lightweight drawer (USPs on toggle) is allowed only if it adds liveliness without hurting CWV.

### Brand chips (Sketch-002-D)
- **D-12 — Styled text-word brand chips now** (grayscale → brand-color on hover; the brand **name** styled, NOT the trademarked logo). Launch-ready with no asset/rights dependency. **Official SVG logos are a deferred follow-up** (owner brand-kit + usage rights; TIER 3 owner-blocked). Reuse/adapt `components/BrandGrid.tsx` + `lib/services/brands.ts`.
- **D-13 — Brand chips on ALL 4 pillars.** Airco (Daikin / Mitsubishi Electric / Mitsubishi Heavy) + Warmtepompen (Daikin / Mitsubishi Ecodan) use **confirmed dealer brands** (erkend installateur, owner-finalized 2026-06-28). **WTW/MV brand names require OWNER CONFIRMATION before build** — if unconfirmed by build time, render a **neutral "diverse merken / merkonafhankelijk" chip** instead of specific unverified brand names (no false endorsement). *Flag this as a pre-build owner input in the plan.*

### Proof / trust band (Sketch-003-D)
- **D-14 — Dedicated proof section:** big **4,9** score + **CSS Google-"G"** mark (no image) + **"34 reviews"**; **3 review cards** (from `lib/reviews.ts` — stars, quote, name, plaats, "via Google"); **keurmerken strip = BRL 100/200 + KvK** text/CSS chips (**F-gassen/STEK dropped** per owner); **USP pills** (Geen voorrijkosten · Reactie binnen 1 werkdag · Gecertificeerd & verzekerd). All numbers owner-finalized (STATE 2026-06-28); site-wide `aggregateRating` already emits (Phase 4).
- **D-15 — Reviews display = static 3-up cards** (NOT `ReviewCarousel`): lighter, no carousel JS, best CWV, all three visible at once.
- **D-16 — Sticky contact bar is INHERITED** (Phase-5 `StickyContactBar` at `app/layout.tsx` level). Do **NOT** add a second always-on contact element — the homepage simply renders beneath it.

### Closing CTA
- **D-17 — Keep an engineered dark closing CTA band** before the footer (`--gradient-ink`, **Bel · WhatsApp · Offerte**), restyled from the current `CTABanner`. **AA-safe WhatsApp** contrast (≥4.5:1 text / ≥3:1 glyph — bakes in **A11Y-01**). End-of-page conversion catch that survives sticky-bar dismissal.

### Accessibility & Phase-7 fold-in (build-right-first-time)
- **D-18 — Bake in the Phase-7 hero items** so Phase 7 only re-verifies (no rework): **UI-05** Dutch badge, **UI-06** calmer **brand-teal** CSS aurora (brand tints `#a8dff0` / `#b8e8d0` / `#baeaff`, not the loud magenta/green), **UI-07** trust-pills that lay out cleanly at **375px**, **A11Y-01** AA-safe WhatsApp CTAs. Keep **Atmospheric Clarity**: no 1px borders (tonal layering), no `#000` (`on-surface` `#141d1f`), business data via `SITE`, icons via the `Icon` wrapper. Exactly **one `h1`** (the hero headline); nest headings without skips in the new sections (**A11Y-02** discipline).

### Motion / CWV
- **D-19 — Motion = cheap + gated:** fade-up entrances, top-accent hover reveal, live "direct beschikbaar" pulse, pure-CSS aurora. Reuse **`useEnableHeavyMotion`** (Phase 5) to gate heavy motion on mobile / `prefers-reduced-motion`. **No WebGL / canvas particles** on the rebuilt homepage sections (SEO-10). Verify **mobile INP < 200ms + good LCP** on the Vercel preview.

### Claude's Discretion
- Pricing teaser (default: none), pillar-card expand-drawer (default: none), exact section spacing/order nuance, the compact-form `naam` mechanic, coverage-line exact wording, which 3 reviews to feature, motion timing/curves.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Validated design — THE spec for this phase
- `.claude/skills/sketch-findings-tps-ventilatie/SKILL.md` — findings index + carry-forward warnings (owner-verify, Phase-5 coordination, production form via secure route).
- `.claude/skills/sketch-findings-tps-ventilatie/references/hero-and-conversion.md` — **Sketch-001-D** hero: proof bar, engineered offerte form, pillar→form routing, CSS + HTML patterns.
- `.claude/skills/sketch-findings-tps-ventilatie/references/service-pillars.md` — **Sketch-002-D** equal 4-grid, brand-logo chips, sub-service chips, expand drawer, CSS patterns.
- `.claude/skills/sketch-findings-tps-ventilatie/references/trust-and-contact.md` — **Sketch-003-D** proof section + sticky bar (bar = Phase-5), CSS Google-G, container-trap warning.
- `.claude/skills/sketch-findings-tps-ventilatie/references/design-language.md` — "Atmospheric Clarity, engineered": tokens, blueprint/accent/pulse motif, CSS aurora, no-WebGL/no-1px/no-#000 rules.
- `.claude/skills/sketch-findings-tps-ventilatie/sources/themes/default.css` — the real TPS palette as CSS vars (mirror of `app/globals.css`).
- `.claude/skills/sketch-findings-tps-ventilatie/sources/001-homepage-hero/index.html`, `.../002-pillar-service-clarity/index.html`, `.../003-trust-contact-band/index.html` — full winning-variant markup (★ Gekozen).

### Phase scope & cross-phase coordination
- `.planning/ROADMAP.md` — Phase 6 goal; Phase 7 coupling (UI-05/06/07 hero dependency).
- `.planning/PROJECT.md` — constraints (hybrid hosting, Atmospheric Clarity, Dutch), Key Decisions.
- `.planning/phases/05-lead-capture-form-security-launch-qa/05-CONTEXT.md` — `OfferteForm` field set + secure `/api/lead` route (D-05/06/07/10), sticky bar spec (D-11/12), motion gating (D-14), images (D-16). **Consume, don't rebuild.**
- `.planning/phases/07-ui-ux-and-accessibility-remediation/07-CONTEXT.md` — the hero items to bake in (UI-05/06/07, A11Y-01) + the footer refresh routed here.

### Real data (owner-finalized) & code touchpoints
- `.planning/STATE.md` (Blockers/Concerns, 2026-06-28) — dealer status, **4,9 / 34**, BRL 100/200, staged `home-hero.jpg`, owner-blocked items.
- `lib/reviews.ts` — the ONE consolidated reviews source (names, quotes, timeAgo) for the proof band + hero proof bar.
- `lib/services/` (registry, `pillars()`, `brands.ts`) — pillar list, sub-service children (chip links), brand sets.
- `lib/constants.ts` — `SITE` (phone/whatsappUrl/email/geo/**serviceAreas**/**serviceRadiusKm**/province), `CANONICAL_ORIGIN`.
- `components/OfferteForm.tsx`, `components/StickyContactBar.tsx`, `components/BrandGrid.tsx`, `components/ReviewCarousel.tsx`, `components/CTABanner.tsx`, `components/Icon.tsx` — reusable assets.
- `lib/useEnableHeavyMotion.ts` — SSR-safe motion-gating hook (Phase 5).
- `public/images/heroes/home-hero.jpg` — staged homepage image to wire (D-05).
- `app/page.tsx`, `app/page-sections/` — the current homepage being replaced.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`OfferteForm.tsx`** (Phase 5) — canonical lead form → secure `/api/lead`; add a **compact hero layout/mode**, don't fork.
- **`StickyContactBar.tsx`** (Phase 5, layout-level) — inherited; no second contact element.
- **`BrandGrid.tsx` + `lib/services/brands.ts`** — brand-chip rendering + brand data; adapt for the pillar-card text-word chips.
- **`lib/reviews.ts`** — single reviews source (feeds proof band 3-up + hero initials/score).
- **`Icon.tsx`** — Material Symbols wrapper (all pillar/UI icons).
- **`useEnableHeavyMotion.ts`** — gate heavy motion on mobile / reduced-motion.
- **`CTABanner.tsx`** — restyle into the D-17 engineered closing band (fix WhatsApp contrast).
- **`getInitials` pattern** (already in codebase, e.g. ReviewCarousel) — hero proof-bar monogram chips.

### Established Patterns
- **`"use client"` boundary** — hero form, pillar routing (scroll/pre-select), and motion are client; the page shell stays a Server Component.
- **Atmospheric Clarity** — tonal layering (no 1px borders), `on-surface` text, glass + soft cool shadows, MD3 tokens only (no invented colors).
- **`<Suspense>` for `useSearchParams`** (PricingTabs precedent) — relevant if `dienst` prefill reads a query param.
- **Hybrid hosting** (Phase 5) — API route + `next/image` optimization available (no more static-export limits).

### Integration Points
- **Pillar card "Offerte" → hero form** — controlled `<select>` value + ref-scroll; the form POSTs to `/api/lead`.
- **`home-hero.jpg`** → `next/image` band lower on the page.
- **Rebuilt `app/page.tsx`** replaces the section imports; retired sections removed from the page (files may stay until Phase 7 cleanup or be deleted — planner's call).
- **Validate on Vercel preview only** (no local `next build`/`tsx` — OneDrive deadlock); run GSD execution **inline** (no subagents/worktrees on the OneDrive mount).

</code_context>

<specifics>
## Specific Ideas

- **Design = the three Sketch-D winners** (001/002/003, variant D each). Port the CSS/HTML patterns; the theme file mirrors `app/globals.css`.
- **Real proof data** (owner-finalized): **4,9 / 34** Google, **erkend installateur** Daikin + Mitsubishi (Electric/Heavy/Ecodan), keurmerken **BRL 100/200 + KvK** (F-gassen/STEK dropped). KvK `73722650` is real.
- **Geo framing** = anchor **Zoetermeer** + regional **Zuid-Holland**; coverage line names Den Haag→Gouda→Leiden within 60 km (from `SITE`).
- **Authenticity guardrails** — no fake avatars; text-word brand chips (not logos) until assets confirmed; no unverified WTW/MV brand names.
- **Execution constraints** — never push `main`; never `vercel --prod`; preview is the build gate; inline execution on OneDrive.

</specifics>

<deferred>
## Deferred Ideas

- **Footer refresh** → **Phase 7** (consolidated with A11Y-02): real PNG logo, klimaattechniek copy (drop "ventilatieoplossingen"), live-taxonomy Diensten links (add Warmtepompen + real URLs), drop the 1px bottom border. *Added to Phase-7 CONTEXT.*
- **Official manufacturer SVG brand logos** (replace text-word chips) → follow-up when owner supplies brand-kit + usage rights (TIER 3 owner-blocked).
- **WTW/MV serviced-brand list** → **owner input needed before build**; neutral "diverse merken" fallback otherwise.
- **Footer social icons** (Instagram / Facebook) → owner-blocked (IG/FB URLs pending; also JSON-LD `sameAs`).
- **Per-town / per-neighbourhood location pages** (regional SEO) → v2 (BLOG-02).
- **Pricing teaser on the home** → not shipping by default (D-02); revisit if the page reads thin.

</deferred>

---

*Phase: 6-homepage-conversion-uplift*
*Context gathered: 2026-07-01*
