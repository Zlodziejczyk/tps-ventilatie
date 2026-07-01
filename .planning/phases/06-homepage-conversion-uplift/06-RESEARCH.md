# Phase 6: Homepage Conversion Uplift — Research

**Researched:** 2026-07-01
**Domain:** Frontend rebuild — Next.js 16 (App Router) + React 19 + Tailwind CSS v4 marketing homepage; conversion UX, CWV/INP, WCAG AA
**Confidence:** HIGH (design contract + real code + versions all verified in-session; a few UX mechanics are genuine design decisions flagged for the planner)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01…D-19)

**Page composition & scope**
- **D-01 — Full rebuild.** New `app/page.tsx` = **Hero → 4-pillar grid → proof/trust band → closing CTA band**. **Retire** `ServicesSection`, `WhyTPSSection`, `ReviewsSection` (value absorbed: services→pillar grid; USPs→trust-band USP pills; reviews→proof-band review cards). Keep the `<main>` landmark.
- **D-02 — No pricing-preview section.** Pricing transparency shows only as **USP pills** ("Geen voorrijkosten", etc.); full detail lives on `/tarieven`. *(Discretion: a light "vanaf" teaser only if the page reads thin — CWV-mindful.)*

**Hero (Sketch-001-D)**
- **D-03 — Compact quick-start offerte form above the fold:** **Postcode + Telefoon + Dienst + submit**, phone-first. Build it as a **compact variant/mode of the Phase-5 `<OfferteForm>`** posting via the same secure `/api/lead` route + Zod — **do NOT fork a second form component**. `naam` handled lightly in compact mode (optional/inline or captured on submit); relaxes Phase-5 D-05 (naam required) for the hero layout only — the full form keeps `naam` required. Reassurance line: "Vrijblijvend · geen kosten · AVG-proof".
- **D-04 — Aurora-only hero:** pure-CSS aurora (NO WebGL). Two-column **text | form**, stacks under ~860px (container query).
- **D-05 — `home-hero.jpg` goes lower, not in the hero:** wire `public/images/heroes/home-hero.jpg` as a **full-width band lower on the page** (near/within the trust band) via `next/image` (AVIF/WebP, responsive sizes, lazy). Keeps it off the LCP path (protects SEO-10).
- **D-06 — Headline + geo:** H1 = **"Airco, warmtepomp & ventilatie — goed geregeld in Zoetermeer en heel Zuid-Holland"** (gradient-accent span). Coverage line — **"Van Den Haag tot Gouda en Leiden — actief binnen 60 km rondom Zoetermeer"** — from `SITE.serviceAreas` + `SITE.serviceRadiusKm`. Dutch badge (bakes in UI-05).
- **D-07 — Proof bar (top of hero):** **initials monogram chips** from real reviewer names in `lib/reviews.ts` (the `getInitials` pattern) + **4,9 ★** + short quote + **"34 Google-reviews"**. **No fake face/silhouette avatars.**

**4-pillar grid (Sketch-002-D)**
- **D-08 — Equal 4-card grid, all pillars visible.** Airconditioning (`ac_unit`), Warmtepompen (`heat_pump`, **"Nieuw"** tag), WTW Unit (`hvac`), Mechanische ventilatie (`air`). Grid 4→2→1; **independent card heights** (`align-items:start`).
- **D-09 — Primary card click → the pillar page** (`/diensten/[pillar]`). A **distinct "Offerte" CTA** per card **pre-selects that service in the hero form** (controlled `<select>` value) and **scrolls to it** — the ★ signature gesture (React ref-scroll, not inline `onclick`).
- **D-10 — Sub-service chips = internal links** to sub-service pages, from the `lib/services/` taxonomy.
- **D-11 — Card detail depth = discretion.** Default: **chips-as-links, no expand-drawer** (best CWV); a lightweight drawer allowed only if it adds liveliness without hurting CWV.

**Brand chips (Sketch-002-D)**
- **D-12 — Styled text-word brand chips now** (grayscale → brand-color on hover; the brand **name** styled, NOT the trademarked logo). Reuse/adapt `components/BrandGrid.tsx` + `lib/services/brands.ts`. Official SVG logos deferred.
- **D-13 — Brand chips on ALL 4 pillars.** Airco (Daikin / Mitsubishi Electric / Mitsubishi Heavy) + Warmtepompen (Daikin / Mitsubishi Ecodan) use **confirmed dealer brands**. **WTW/MV brand names require OWNER CONFIRMATION before build** — if unconfirmed by build time, render a **neutral "diverse merken / merkonafhankelijk" chip** (no false endorsement). *Pre-build owner input.*

**Proof / trust band (Sketch-003-D)**
- **D-14 — Dedicated proof section:** big **4,9** + **CSS Google-"G"** (no image) + **"34 reviews"**; **3 review cards** (from `lib/reviews.ts`); **keurmerken strip = BRL 100/200 + KvK** text/CSS chips (F-gassen/STEK dropped); **USP pills** (Geen voorrijkosten · Reactie binnen 1 werkdag · Gecertificeerd & verzekerd).
- **D-15 — Reviews display = static 3-up cards** (NOT `ReviewCarousel`).
- **D-16 — Sticky contact bar is INHERITED** (Phase-5 `StickyContactBar` at layout level). Do **NOT** add a second always-on contact element.

**Closing CTA**
- **D-17 — Keep an engineered dark closing CTA band** before the footer (**Bel · WhatsApp · Offerte**), restyled from `CTABanner`. **AA-safe WhatsApp** contrast (≥4.5:1 text / ≥3:1 glyph — bakes in A11Y-01).

**Accessibility & Phase-7 fold-in**
- **D-18 — Bake in Phase-7 hero items:** UI-05 Dutch badge, UI-06 calmer **brand-teal** CSS aurora (`#a8dff0` / `#b8e8d0` / `#baeaff`), UI-07 trust-pills clean at **375px**, A11Y-01 AA-safe WhatsApp. Keep Atmospheric Clarity: no 1px borders (tonal layering), no `#000` (`on-surface` `#141d1f`), business data via `SITE`, icons via `Icon`. Exactly **one `h1`**; nest headings without skips (A11Y-02).

**Motion / CWV**
- **D-19 — Motion = cheap + gated:** fade-up entrances, top-accent hover reveal, live pulse, pure-CSS aurora. Reuse **`useEnableHeavyMotion`** to gate heavy motion. **No WebGL / canvas particles** (SEO-10). Verify **mobile INP < 200ms + good LCP** on the Vercel preview.

### Claude's Discretion
Pricing teaser (default: none), pillar-card expand-drawer (default: none), section spacing/order nuance, **the compact-form `naam` mechanic**, coverage-line exact wording, which 3 reviews to feature, motion timing/curves.

### Deferred Ideas (OUT OF SCOPE)
- **Footer refresh** → Phase 7 (logo, klimaattechniek copy, live-taxonomy links, drop 1px border).
- **Official manufacturer SVG brand logos** → follow-up (owner brand-kit + usage rights; TIER 3 owner-blocked).
- **WTW/MV serviced-brand list** → owner input needed before build; neutral "diverse merken" fallback otherwise.
- **Footer social icons** (IG/FB) → owner-blocked.
- **Per-town / per-neighbourhood location pages** → v2 (BLOG-02).
- **Pricing teaser on home** → not shipping by default (D-02).
</user_constraints>

<phase_requirements>
## Phase Requirements

No REQ-IDs are mapped to Phase 6 — coverage is driven entirely by the CONTEXT decisions D-01…D-19. The table below maps each decision to the research that enables it (the planner uses this in place of a REQ→plan map).

| Decision | What it needs | Research support |
|----------|---------------|------------------|
| D-03 | Compact hero form on secure route, no fork | `OfferteForm` already accepts `defaultDienst`; extend with `variant`/controlled `dienst` (Architecture Pattern 1). Shared `leadSchema` requires `naam.min(2)`+`consent(literal true)` — see Open Q1. |
| D-04 | Container-query two-col stack + CSS aurora | Tailwind v4.2.2 container queries VERIFIED (`@container` + `@max-[860px]`/`@min-[860px]`). Pure-CSS aurora pattern + gating (Pattern 3). |
| D-05 | `home-hero.jpg` off LCP path | `next/image` config VERIFIED (`formats:[avif,webp]`, `unoptimized` removed). Lazy band, no `priority` (Pattern 4). |
| D-06 | Geo copy from data | `SITE.serviceAreas` (8 towns) + `SITE.serviceRadiusKm` (60) confirmed. |
| D-07 / D-14 / D-15 | Proof data + static cards | `REVIEWS` (17 real reviews) + `REVIEW_RATING` {4.9, 34} + `getInitials` pattern all confirmed in `lib/reviews.ts`. |
| D-08 | Pillar grid data + icons | `pillars()` returns 4 nodes; pillar `icon` fields already = `ac_unit`/`heat_pump`/`hvac`/`air` (exact sketch match). |
| D-09 | Pillar→form gesture | Controlled-select + ref-scroll pattern (Pattern 2). No query param needed → page stays static, no Suspense. |
| D-10 | Sub-service chip links | `childrenOf(pillarSlug)` → `navTitle` (label) + `urlFor(node)` (href). |
| D-12 / D-13 | Brand chips + WTW/MV fallback | `brandsForPillar()` returns [] for wtw + mechanische-ventilatie (VERIFIED) → neutral fallback required. `BrandGrid`/`BRAND_COLOR` reusable. |
| D-16 | Inherit sticky bar | `StickyContactBar` mounted in `app/layout.tsx` (confirmed). Render nothing new. |
| D-17 / D-18 | AA WhatsApp | `#25D366` + white = 1.99:1 (FAIL, confirmed). `#25D366` + `on-surface #141d1f` = **8.6:1** (PASS, calculated). |
| D-19 | CWV/INP | No WebGL/canvas, static 3-up, CSS motion, image off LCP. Verify on preview. |
</phase_requirements>

## Summary

This is a **frontend rebuild of one route (`app/page.tsx`)** with **zero new dependencies**. Every capability the phase needs already exists in the codebase as a Phase-5/Phase-1..4 asset: the secure lead form (`OfferteForm` → `/api/lead` with Zod), the inherited site-wide sticky bar (`StickyContactBar` at layout level), the consolidated reviews source (`lib/reviews.ts`), the taxonomy registry (`pillars()`, `childrenOf()`, `brandsForPillar()`), brand rendering (`BrandGrid` + `BRAND_COLOR`), the motion gate (`useEnableHeavyMotion`), and the `Icon` wrapper. The design is fully specified by the project-local **sketch-findings skill** (Sketch-001-D / 002-D / 003-D) — research does not re-decide design; it maps the sketch CSS/HTML onto the real Next.js primitives and surfaces the integration seams and landmines.

Three findings shape the plan. **(1)** `OfferteForm` today prefills `dienst` via an *uncontrolled* `defaultDienst` prop — the D-09 pillar→form gesture needs the select to change *after mount*, so the component must be extended to support a *controlled* `dienst` value (a small, backward-compatible enhancement — still "don't fork"). **(2)** The sketch CSS references a whole set of custom properties (`--gradient-ink`, `--glass-strong`, `--shadow-*`, `--ease-clarity`, `--color-bg-tint`, `--color-text-faint`, …) that **do not exist** in `app/globals.css`; the plan must translate them to real MD3 tokens/utilities (translation table provided). **(3)** The compact hero form's biggest open decision is the **`naam` + `consent` mechanic**: the shared server `leadSchema` requires `naam.min(2)` and `consent: literal(true)`, so a Postcode+Telefoon+Dienst-only form will *fail the silent GHL backup* unless it supplies both — a genuine UX/legal choice flagged as Open Q1.

Tailwind v4.2.2 container queries are confirmed available in core (no plugin), so D-04's ~860px stack is a clean `@container` + `@max-[860px]:grid-cols-1`. The pure-CSS aurora and `next/image` band both stay off the LCP path (text H1 is LCP); dropping `ReviewCarousel` for static 3-up cards and forbidding WebGL/canvas keeps mobile INP < 200ms. Validation is preview-based (OneDrive deadlocks local `next build`/`tsc`): grep/source asserts locally, full behavioral verification on the Vercel preview.

**Primary recommendation:** Keep `app/page.tsx` a Server Component that exports `metadata` and composes: one **client "HomeHero" island** (hero + pillar grid sharing `dienst` state + a `formRef`) + **server-rendered** proof band and closing CTA. Extend `OfferteForm` with a `variant: "full" | "compact"` prop and optional controlled `dienst`/`onDienstChange`. Translate sketch tokens via the table below. Verify everything on the Vercel preview.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Hero proof bar (initials, 4,9★, count) | Static/SSR | — | Build-time data from `lib/reviews.ts`, rendered as server HTML |
| Compact offerte form submit | API/Backend (`/api/lead`) | Browser (WhatsApp deep-link) | Zod validation + GHL forward are server-side; primary UX handoff is a client `window.location` to `wa.me` |
| Pillar → form routing (pre-select + scroll) | Browser/Client | — | Same-page React state + `scrollIntoView`; no server round-trip, no query param |
| CSS aurora | Browser/Client (CSS only) | — | Decorative background, CSS-animated, gated on desktop/no-reduced-motion |
| `home-hero.jpg` band | CDN/Static (Next Image Optimizer) | Frontend Server (serverless) | `next/image` serves AVIF/WebP variants via the hybrid runtime |
| Pillar / sub-service internal links | Static/SSR | — | Server-rendered `<Link>` anchors — must be in initial HTML for SEO (D-09/D-10) |
| Proof band + closing CTA band | Static/SSR | — | Pure presentational, zero client JS |
| Rate-limit / honeypot / spam control | API/Backend | — | Owned by Phase-5 `/api/lead` (inherited, not rebuilt) |
| Sticky contact bar | Frontend Server → Browser | — | `StickyContactBar` mounted at `app/layout.tsx` (inherited; D-16) |

## Standard Stack

No new libraries. Everything below is already installed and pinned in `package-lock.json` (lockfileVersion 3). Versions verified in-session against `node_modules/*/package.json`.

### Core
| Library | Version (verified) | Purpose | Why standard here |
|---------|--------------------|---------|-------------------|
| next | 16.2.1 | App Router, `next/image`, route handler `/api/lead` | Project framework; hybrid hosting active (Phase 5) |
| react / react-dom | 19.2.4 | UI + client islands | Project runtime |
| tailwindcss | 4.2.2 | CSS-first design system, **container queries in core** | Design tokens live in `app/globals.css @theme inline` |
| @tailwindcss/postcss | ^4 | PostCSS plugin (only plugin registered) | `postcss.config.mjs` |
| zod | 4.4.3 | Shared `leadSchema` (server-authoritative on `/api/lead`) | Reused, not modified |
| framer-motion | 12.38.0 | `AnimateOnScroll` fade-up (optional; CSS alt preferred for INP) | Already site-wide |

### Supporting (reused project assets — the real "stack" for this phase)
| Asset | File | Purpose | Notes for Phase 6 |
|-------|------|---------|-------------------|
| `OfferteForm` | `components/OfferteForm.tsx` | Lead form → WhatsApp handoff + silent `/api/lead` backup | Extend with `variant` + controlled `dienst` — do not fork |
| `submitLead` | `lib/forms.ts` | Thin secret-free client caller of `/api/lead` (`keepalive`) | Reuse as-is |
| `buildWhatsAppLeadUrl` | `lib/whatsapp.ts` | Builds `wa.me` deep link from lead fields | May need a tweak to omit blank `Naam:` line (Open Q1) |
| `leadSchema` | `lib/lead-schema.ts` | `naam.min(2)`, `telefoon.min(8)`, `postcode.min(4)`, `dienst.min(1)`, `consent: literal(true)`, honeypot | **Do not weaken** — full form keeps naam required |
| `StickyContactBar` | `components/StickyContactBar.tsx` | The ONE always-on contact bar (layout-level) | Inherited (D-16) — render nothing new |
| `useEnableHeavyMotion` | `lib/useEnableHeavyMotion.ts` | SSR-safe gate (false on server/mobile/reduced-motion) | Optional aurora gate (Pattern 3) |
| `REVIEWS` / `REVIEW_RATING` | `lib/reviews.ts` | 17 real reviews + `{value:4.9,count:34,url}` | Proof bar + 3-up cards. Guard `REVIEW_RATING` for `null` |
| `pillars()` / `childrenOf()` / `brandsForPillar()` / `urlFor()` | `lib/services/registry.ts` | Pillar grid, sub-service chips, brand sets, hrefs | Pillar `icon`s already match the sketch |
| `BRANDS` / `BrandGrid` / `BRAND_COLOR` | `lib/services/brands.ts`, `components/BrandGrid.tsx` | Brand data + text chips + brand hex map | Adapt into a compact per-card chip row (BrandGrid is a full `<section>`) |
| `SITE` | `lib/constants.ts` | phone/whatsappUrl/serviceAreas/serviceRadiusKm/kvk | All contact/geo data (CLAUDE.md guardrail) |
| `Icon` | `components/Icon.tsx` | Material Symbols wrapper | All icons (never raw `material-symbols-outlined` spans) |
| `getInitials` | inside `components/ReviewCarousel.tsx` (NOT exported) | Monogram initials | Extract to a shared util (see Don't Hand-Roll) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Container query (D-04) | viewport media query (`lg:grid-cols-2`) | Locked to D-04; container query is correct here (stacks by the hero *stage* width, robust to future layout nesting). Both work in v4. |
| CSS-only fade-up (`.fu` keyframes) | `AnimateOnScroll` (framer-motion) | CSS is lighter (no hydration/JS for entrance) → better INP; framer-motion is consistent with the rest of the site. Discretion (D-19). |
| Pure-CSS aurora media-gated | `useEnableHeavyMotion` JS gate | CSS media-gate = zero client JS (ideal for a CSS-only effect); the hook is the established pattern and gives one consistent gate. Both satisfy D-04/D-19. |

**Installation:** none — `npm install` runs no new packages this phase.

## Package Legitimacy Audit

**No external packages are installed in Phase 6.** All libraries used are already present in `package.json` / `package-lock.json` and were verified in-session against the on-disk `node_modules`:

| Package | Registry | Installed version | Disposition |
|---------|----------|-------------------|-------------|
| next | npm | 16.2.1 | Reused (already locked) |
| react / react-dom | npm | 19.2.4 | Reused |
| tailwindcss | npm | 4.2.2 | Reused |
| zod | npm | 4.4.3 | Reused |
| framer-motion | npm | 12.38.0 | Reused |

**Packages removed due to slopcheck [SLOP]:** none (no installs).
**Packages flagged [SUS]:** none.
slopcheck was not run because this phase adds no dependencies; there is nothing to gate. If the planner later decides to add a package (not expected), run the Package Legitimacy Gate then.

## Architecture Patterns

### System Architecture Diagram (data flow)

```
                         app/page.tsx  (Server Component — exports metadata)
                                     │ composes
        ┌────────────────────────────┼──────────────────────────────┬───────────────┐
        ▼                            ▼                              ▼               ▼
  <HomeHero> (client island)   ProofBand (server)          ImageBand (server)  ClosingCTA (server)
  ┌───────────────────────┐    ┌──────────────────┐        ┌────────────────┐  ┌──────────────┐
  │ dienst state + formRef │    │ 4,9★ + CSS-G     │        │ next/image     │  │ Bel/WA/Offerte│
  │                       │    │ 3 review cards   │        │ home-hero.jpg  │  │ AA-safe WA   │
  │  ┌─ Hero col A ─────┐ │    │ keurmerken chips │        │ loading=lazy   │  └──────────────┘
  │  │ badge, H1, proof │ │    │ USP pills        │        │ (OFF LCP path) │
  │  │ bar, coverage    │ │    └────────┬─────────┘        └────────────────┘
  │  └──────────────────┘ │             │
  │  ┌─ Hero col B ─────┐ │        lib/reviews.ts (REVIEWS + REVIEW_RATING)
  │  │ <OfferteForm      │ │        SITE.kvk / keurmerken (BRL 100/200)
  │  │   variant=compact │ │
  │  │   dienst=<state>  │─┼──submit──► buildWhatsAppLeadUrl ──► window.location (wa.me)  ← PRIMARY
  │  │   onDienstChange> │ │           └─ submitLead() ──► POST /api/lead ──► Zod ──► GHL  ← BACKUP
  │  └──────────────────┘ │                               (keepalive)   (rate-limit+honeypot, Phase 5)
  │  ┌─ Pillar grid ────┐ │
  │  │ 4 cards:         │ │   pillars() → icon/navTitle/navDescription/pillarSlug
  │  │  primary link →  │─┼──► /diensten/[pillar]              (SSR anchor, SEO)
  │  │  chips →         │─┼──► /diensten/[pillar]/[sub]        childrenOf() (SSR anchors)
  │  │  brand chips     │ │   brandsForPillar() → [] for wtw/mv → neutral "diverse merken"
  │  │  "Offerte" btn   │─┼──► setDienst(navTitle) + formRef.scrollIntoView()  ★ D-09 gesture
  │  └──────────────────┘ │
  └───────────────────────┘

  Inherited from layout.tsx (NOT rebuilt): <StickyContactBar/> (scroll-in >200px, dismissible)
  Decorative (CSS-only, gated): .aurora behind Hero — never the LCP element
```

### Recommended Structure (new/changed files)

```
app/
├── page.tsx                         # Server Component: metadata + compose sections (REWRITE)
└── page-sections/
    ├── home/                        # NEW home sections (or reuse app/page-sections/ flat)
    │   ├── HomeHero.tsx             # "use client" — hero + pillar grid island (dienst state + formRef)
    │   ├── PillarGrid.tsx           # rendered inside HomeHero (needs the shared setDienst + ref)
    │   ├── ProofBand.tsx            # server — 4,9 + CSS-G + 3 cards + keurmerken + USP pills
    │   └── ClosingCTA.tsx           # server — restyled dark band, AA-safe WhatsApp
    ├── HeroSection.tsx              # RETIRE (D-01) — remove import; delete file (home-only)
    ├── ServicesSection.tsx          # RETIRE (D-01)
    ├── PricingSection.tsx           # RETIRE (D-02)
    ├── WhyTPSSection.tsx            # RETIRE (D-01)
    └── ReviewsSection.tsx           # RETIRE (D-01)
components/
└── OfferteForm.tsx                  # EXTEND: variant prop + optional controlled dienst
lib/
├── initials.ts                     # NEW (optional): export getInitials (shared util)
└── whatsapp.ts                     # MAYBE: omit blank "Naam:" line (Open Q1)
app/globals.css                     # ADD: aurora keyframes/utilities + any translated tokens
```

### Pattern 1: Compact `OfferteForm` variant (D-03) — no fork

The current form is uncontrolled (`defaultValue={defaultDienst}`). Extend it with a `variant` and *optional controlled* `dienst` so both the hero-compact layout and the pillar→form gesture work without a second component.

```tsx
// components/OfferteForm.tsx — extended props (backward compatible)
interface OfferteFormProps {
  defaultDienst?: string;                 // existing, uncontrolled prefill
  variant?: "full" | "compact";           // NEW — default "full"
  dienst?: string;                        // NEW — when provided, select is CONTROLLED
  onDienstChange?: (value: string) => void;
}
```

- **compact** renders **Postcode + Telefoon + Dienst + submit** (+ the AA/AVG bits — see Open Q1); **full** keeps naam/email/bericht.
- Select: when `dienst`/`onDienstChange` are passed, render `value={dienst} onChange={e => onDienstChange(e.target.value)}` (controlled); otherwise keep `defaultValue` (uncontrolled) so existing pillar/service-page usages are untouched.
- `handleSubmit` is shared (already builds WhatsApp URL + fires `submitLead` with `keepalive`).

**Why controlled matters:** `defaultValue` is read once at mount — a pillar click after mount cannot change an uncontrolled select. D-09 explicitly wants "controlled `<select>` value."

### Pattern 2: Pillar → hero-form gesture (D-09) — state-lift + ref-scroll

Keep the hero form and pillar grid inside **one client island** so they share state and a ref. No query param → the page stays statically generated (no `useSearchParams`, no `<Suspense>` needed).

```tsx
// app/page-sections/home/HomeHero.tsx
"use client";
export function HomeHero() {
  const [dienst, setDienst] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  function routeToOfferte(pillarNavTitle: string) {
    setDienst(pillarNavTitle);            // controlled pre-select
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }

  return (
    <section className="@container">      {/* container-query context for D-04 */}
      <div className="grid gap-10 @min-[860px]:grid-cols-[1.15fr_0.85fr] items-start">
        <div>{/* badge, H1 (gradient span), proof bar, coverage line */}</div>
        <div ref={formRef}>
          <OfferteForm variant="compact" dienst={dienst} onDienstChange={setDienst} />
        </div>
      </div>
      <PillarGrid onOfferte={routeToOfferte} />
    </section>
  );
}
```

Pillar card = a **primary `<Link href={urlFor(pillar)}>`** (SEO, D-09) + a **separate `<button onClick={() => onOfferte(pillar.navTitle)}>Offerte</button>`**. The button label passed must match a `dienstOptions` entry — use `pillar.navTitle` (the form builds options from `pillars().map(p => p.navTitle)`, so they align exactly).

### Pattern 3: Pure-CSS brand-teal aurora, off LCP + gated (D-04 / D-18 / UI-06)

Render the aurora as a **decorative, CSS-only** layer. Two safe gating options:

- **CWV-optimal (recommended):** pure CSS, animate only inside `@media (min-width:768px) and (prefers-reduced-motion:no-preference)`. Zero client JS. A **static** soft radial-gradient base always paints (mobile / reduced-motion / first render). This can live in a server component.
- **Consistent alternative:** render the animated blobs only when `useEnableHeavyMotion()` is true (it already returns false on SSR/mobile/reduced-motion). Requires the aurora to sit in a client component.

Use the brand tints: `#a8dff0`, `#b8e8d0`, and `#baeaff` (the latter is already the `--color-primary-fixed` token). `pointer-events:none`, `position:absolute; inset:0`, behind the hero content. The LCP element is the **text H1** — keep the aurora colored-but-decorative and never `priority`-loaded.

```css
/* app/globals.css — add */
@keyframes drift1 { to { transform: translate3d(6%, 4%, 0) scale(1.08); } }
.aurora { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
.aurora .blob { position:absolute; border-radius:9999px; filter:blur(60px); opacity:.45; mix-blend-mode:multiply; }
.aurora .b1 { background:radial-gradient(circle at 30% 30%, #a8dff0, transparent 65%); }
.aurora .b2 { background:radial-gradient(circle at 70% 40%, #b8e8d0, transparent 65%); }
.aurora .b3 { background:radial-gradient(circle at 50% 70%, #baeaff, transparent 65%); }
@media (min-width:768px) and (prefers-reduced-motion:no-preference) {
  .aurora .b1 { animation: drift1 22s cubic-bezier(0.25,0.1,0.25,1) infinite alternate; }
  /* b2/b3 with their own drift keyframes */
}
```

### Pattern 4: `next/image` full-width band, lazy, off LCP (D-05)

`next.config.ts` already sets `images.formats:["image/avif","image/webp"]` and no longer sets `unoptimized` (hybrid). Wire `home-hero.jpg` lower on the page:

```tsx
import Image from "next/image";
<Image
  src="/images/heroes/home-hero.jpg"
  alt="TPS-monteur installeert een klimaatsysteem"   // meaningful Dutch alt
  width={1600} height={900}                           // intrinsic ratio → no CLS
  sizes="100vw"
  className="w-full h-auto object-cover"
  loading="lazy"                                       // default; explicit for intent
  // NO priority — priority would preload it onto the LCP path (we want it OFF)
/>
```

### Pattern 5: Static 3-up review cards (D-15) — no carousel JS

Do **not** import `ReviewCarousel` on the home page. Render three chosen `REVIEWS` as a static grid (server component). Reuse the `ReviewCard` visual (stars via `Icon name="star" filled`, `line-clamp-5`, initials monogram). Pick 3 short, brand-clean quotes (e.g. Christine te Kamp, Lois Lovelle, Albert Terstegs). This removes the interval timer + resize listener + transform math from the homepage → direct INP win.

### Sketch-token → real-token translation table (CRITICAL)

The sketch CSS (`references/*.md`, `sources/*`) uses custom properties that **do not exist** in `app/globals.css`. `StickyContactBar` already hit this ("the sketch's `--glass-*` / spring custom props do not exist in globals.css"). Translate before porting:

| Sketch var / class | Real token or utility (exists in `app/globals.css`) |
|--------------------|-----------------------------------------------------|
| `--color-primary` #006580 | `--color-primary` → `text-primary` / `bg-primary` ✅ |
| `--color-accent` #006b42 | **`--color-tertiary`** (#006b42) → `text-tertiary` (accent == tertiary here) |
| `--color-surface` #f1fbfe | `--color-surface` / `bg-surface` ✅ |
| `--color-bg-tint` / `--color-surface-2` | tonal layering: `bg-surface-container-low` / `-container` / `-high` |
| `--color-text` #141d1f | `--color-on-surface` → `text-on-surface` ✅ (never `#000`) |
| `--color-text-faint` | `text-on-surface-variant` (#3f484d) or `text-outline` |
| `--gradient-signature` (135°,#006580→#257f9c) | **`signature-gradient`** utility ✅ (already defined) |
| `--gradient-ink` (dark petrol band) | **no token** → `bg-on-primary-fixed` (#001f29) — `CTABanner` already uses this for the dark band |
| `--gradient-airy` | **no token** → `bg-background` or a subtle surface gradient |
| `--glass-bg` / `--glass-strong` / `--glass-blur` | **`glass-nav`** utility ✅ (rgba white .85 + blur(20px) saturate(1.2)) |
| `--shadow-sm…xl` / `--shadow-glow` | **no tokens** → Tailwind `shadow-sm/md/lg` OR cool-tinted arbitrary `shadow-[0_8px_30px_rgba(0,101,128,0.12)]` (matches StickyContactBar's teal-tint intent) |
| `--ease-clarity` | `cubic-bezier(0.25,0.1,0.25,1)` (used by `btn-hover`/`hover-lift`/`AnimateOnScroll`) |
| `--ease-spring` | `cubic-bezier(0.22,1,0.36,1)` (used by StickyContactBar) |
| `--radius-full` | `rounded-full` |
| `.badge` / `.btn`/`.trust-pill`/`.stars` | build with existing utilities + `Icon` (no sketch class names) |
| `.engineered::before` blueprint grid | port as a scoped CSS utility in globals.css if used (uses `--color-surface-2` → map to `--color-surface-container`) |

### Anti-Patterns to Avoid
- **Forking a second form component** — extend `OfferteForm` (D-03 explicit). One form, two layouts.
- **Reading `?dienst=` for the pillar gesture** — it's same-page state; a query param would force `useSearchParams` + `<Suspense>` AND opt the page into dynamic rendering. Use React state.
- **`priority` on the `home-hero.jpg` band** — that preloads it onto the LCP path (opposite of D-05).
- **Raw `<span className="material-symbols-outlined">`** — use the `Icon` wrapper (CLAUDE.md). *(Note: the current `CTABanner` violates this on lines 27/34/44 — fix when restyling into the D-17 band.)*
- **`1px solid` section borders / `#000` text / hardcoded contact info** — Atmospheric Clarity guardrails (D-18).
- **A second always-on contact element** — the sticky bar is inherited (D-16).
- **Nesting the aurora/animation in a `transform`/`filter`/`container-type` ancestor of the sticky bar** — the container-trap (already avoided; the bar is at layout level, but keep new hero wrappers from wrapping it).

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| Lead validation | A second/relaxed schema | Shared `leadSchema` on `/api/lead` | Server-authoritative; weakening it breaks the full form's guarantee |
| WhatsApp deep link | Manual string concat | `buildWhatsAppLeadUrl` | Already URL-encodes + omits blank optional lines |
| Client→route POST | New fetch wrapper | `submitLead` (`lib/forms.ts`) | Secret-free, `keepalive`, never throws |
| Sticky contact bar | New bar/FAB | Inherited `StickyContactBar` | D-16; two bars = double-nag + container-trap risk |
| Brand hex colors | Hardcode per card | `BRAND_COLOR` map (in `BrandGrid.tsx`) | Single source; extract if shared |
| Pillar list / icons / hrefs | Hardcoded arrays | `pillars()` + `urlFor()` | Taxonomy is the single source; pillar icons already match the sketch |
| Sub-service chip data | Hardcoded chips | `childrenOf(pillarSlug)` → `navTitle`+`urlFor` | Phase-3 SEO internal links, kept in sync |
| Brand set per pillar | Manual mapping | `brandsForPillar(pillarSlug)` | Returns `[]` for wtw/mv → drives the D-13 fallback automatically |
| Initials monogram | New helper | `getInitials` (extract to `lib/initials.ts`) | Currently trapped un-exported inside `ReviewCarousel.tsx` |
| Motion gating | New matchMedia code | `useEnableHeavyMotion` | SSR-safe, hydration-safe, reduced-motion-aware |
| Container-query stacking | JS resize listener | Tailwind `@container` + `@max-[860px]` | Pure CSS, no JS, no INP cost |
| CSS Google-"G" | An image/SVG asset | `conic-gradient` + `mask` (trust-and-contact.md) | No network asset, no 404 risk |

**Key insight:** Phase 6 is 90% *composition of existing verified assets*. The only genuinely new code is layout markup + a small `OfferteForm` prop extension + aurora/keurmerken CSS. Reaching for anything custom in the table above is a smell.

## Common Pitfalls

### Pitfall 1: Compact form silently drops the GHL backup
**What goes wrong:** A Postcode+Telefoon+Dienst-only hero form omits `naam` and `consent`; `submitLead` POSTs to `/api/lead`, the shared `leadSchema` fails (`naam.min(2)` / `consent: literal(true)`), the route returns 400, and the durable GHL lead is lost. WhatsApp still opens (primary), so the failure is invisible in testing.
**Why it happens:** The schema is (correctly) shared and server-authoritative; the compact layout removes fields it still needs to submit.
**How to avoid:** Decide the naam+consent mechanic up front (Open Q1). Whatever the choice, the compact submit must send `consent:true` and a `naam` of length ≥ 2. Verify on the preview by watching the `/api/lead` response == 200.
**Warning signs:** Preview Network tab shows `POST /api/lead → 400 validation` after a compact submit.

### Pitfall 2: Referencing non-existent sketch tokens
**What goes wrong:** Porting `background:var(--gradient-ink)` or `box-shadow:var(--shadow-md)` yields no style (the var is undefined) — silent visual regressions.
**Why it happens:** `sources/themes/default.css` is a *mirror mock*, not `app/globals.css`. Many of its vars were never added to the real theme.
**How to avoid:** Use the translation table above. Grep new files for `var(--gradient-ink|--glass-strong|--shadow-|--ease-clarity|--color-bg-tint|--color-surface-2|--color-text-faint)` before merge — any hit is a bug.

### Pitfall 3: Uncontrolled select won't pre-select on pillar click
**What goes wrong:** Pillar "Offerte" click sets state but the hero `<select>` doesn't change, because it's still `defaultValue` (uncontrolled).
**How to avoid:** Pattern 1 — make the select controlled when `dienst`/`onDienstChange` are provided.
**Warning signs:** State updates (React DevTools) but the dropdown UI doesn't move.

### Pitfall 4: The image band creeps onto the LCP path
**What goes wrong:** Adding `priority`, or placing the image high/large, makes `home-hero.jpg` the LCP element → LCP regresses on mobile (SEO-10 fail).
**How to avoid:** Keep it below the fold, `loading="lazy"`, no `priority`; confirm on preview PageSpeed that LCP = the hero H1 text.

### Pitfall 5: WTW/MV brand chips imply an endorsement TPS doesn't hold
**What goes wrong:** Filling WTW/MV with guessed brand names (Itho/Brink/Zehnder/…) fabricates dealer relationships.
**Why it happens:** `brandsForPillar()` returns `[]` for those pillars, so a naive "always render brands" loop shows nothing OR someone hardcodes placeholders.
**How to avoid:** D-13 — render a neutral **"diverse merken / merkonafhankelijk"** chip when `brandsForPillar(slug).length === 0`. Flag "confirm WTW/MV brands" as a pre-build owner input.

### Pitfall 6: Orphaned WebGL/particle imports after retiring HeroSection
**What goes wrong:** `HeroSection` imported `SoftAurora`/particles; retiring it can leave those components unused (harmless) or, if partially copied, drag WebGL back onto the homepage (SEO-10 fail).
**How to avoid:** Do NOT import `SoftAurora`/`AmbientParticles`/`FocalParticles`/`useParticleEngine` anywhere on the new homepage. Leaving the *files* is lint-safe; just don't import them. Grep the new sections for those names → must be zero.

### Pitfall 7: framer-motion on every section inflates INP
**What goes wrong:** Wrapping many sections in `AnimateOnScroll` adds hydration + main-thread work.
**How to avoid:** Prefer CSS-only fade-up (`.fu` keyframes) for the rebuilt sections; reserve framer-motion for one or two accents if desired (discretion, D-19).

## Code Examples

### Dutch score formatting (4.9 → "4,9")
```tsx
// REVIEW_RATING can be null by design — guard it (lib/reviews.ts contract)
const r = REVIEW_RATING;
const score = r ? r.value.toLocaleString("nl-NL", { minimumFractionDigits: 1 }) : null; // "4,9"
const count = r?.count ?? REVIEWS.length; // "34"
```

### Gradient-accent headline span (D-06)
```tsx
// signature-gradient utility already exists in globals.css
<h1 className="font-headline font-extrabold tracking-tight text-on-surface text-[clamp(2rem,5vw,3.5rem)]">
  Airco, warmtepomp &amp; ventilatie —{" "}
  <span className="signature-gradient bg-clip-text text-transparent">
    goed geregeld in Zoetermeer en heel Zuid-Holland
  </span>
</h1>
```

### Container-query two-column hero (D-04) — VERIFIED Tailwind v4 syntax
```tsx
// Source: https://tailwindcss.com/docs/responsive-design (v4 container queries, core)
<section className="@container">
  <div className="grid gap-10 @min-[860px]:grid-cols-[1.15fr_0.85fr] items-start">
    <div>{/* text column */}</div>
    <div>{/* form column */}</div>
  </div>
</section>
```

### AA-safe WhatsApp CTA (D-17 / A11Y-01)
```tsx
// #25D366 + WHITE = 1.99:1  → FAILS (this was the only prior AA fail)
// #25D366 + on-surface (#141d1f) = 8.6:1 → PASSES (AA + AAA). Keep the vivid brand green, dark text.
<a href={SITE.whatsappUrl} target="_blank" rel="noopener"
   className="btn-hover inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-on-surface px-6 py-3 font-bold
              focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2">
  <Icon name="chat" filled className="text-[20px]" /> WhatsApp
</a>
// Alternative (matches StickyContactBar): neutral surface button + green glyph
//   className="bg-surface-container-high text-on-surface" with <Icon className="text-primary"/>
```

### Neutral brand fallback for WTW/MV (D-13)
```tsx
const brandIds = brandsForPillar(pillar.pillarSlug); // [] for wtw + mechanische-ventilatie (verified)
{brandIds.length > 0
  ? <PillarBrandChips brandIds={brandIds} />          // adapt BRAND_COLOR + .logo-chip
  : <span className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-1.5
                     text-sm font-semibold text-on-surface-variant">
      Diverse merken · merkonafhankelijk
    </span>}
```

### CSS Google-"G" mark, no image (D-14)
```css
/* Source: sketch trust-and-contact.md — pure CSS, no asset */
.gmark { width:16px; height:16px; border-radius:50%;
  background:conic-gradient(from -45deg,#ea4335 0 25%,#fbbc05 0 50%,#34a853 0 75%,#4285f4 0);
  -webkit-mask:radial-gradient(circle 4px at center,transparent 96%,#000);
  mask:radial-gradient(circle 4px at center,transparent 96%,#000); }
```

## State of the Art

| Old approach | Current approach | When changed | Impact for Phase 6 |
|--------------|------------------|--------------|--------------------|
| `@tailwindcss/container-queries` plugin | **Container queries in Tailwind core** | Tailwind v4 | D-04 needs no plugin — `@container` + `@max-[860px]`/`@min-[860px]` work out of the box (v4.2.2 installed) |
| `tailwind.config.js` | **CSS-first `@theme inline` in `globals.css`** | Tailwind v4 | New tokens/utilities are added in CSS (`@utility`, `@theme`), not a JS config |
| Static export (`output:"export"`, `images.unoptimized`) | **Hybrid hosting + Image Optimization** | Phase 5 (this project) | `next/image` AVIF/WebP + a real `/api/lead` route are available — no static-export limits |
| Client webhook (`NEXT_PUBLIC_GHL_WEBHOOK_URL`) | **Secret server route `/api/lead`** | Phase 5 | Compact form posts here; holds no secret client-side |
| FID | **INP** (Core Web Vital) | Mar 2024 | D-19 targets INP < 200ms — favors CSS motion, no carousel/WebGL |
| WebGL `SoftAurora` on home | **Pure-CSS aurora** | This phase | Lighter LCP/INP; WebGL forbidden on the rebuilt home (SEO-10) |

**Deprecated/outdated for this phase:**
- `ReviewCarousel` on the homepage (D-15 → static 3-up).
- `SoftAurora` / `AmbientParticles` / `FocalParticles` on the homepage (D-19 → none).
- The current `CTABanner`'s raw `material-symbols-outlined` spans + `#25D366`+white WhatsApp (fix on restyle).

## Environment Availability

| Dependency | Required by | Available | Version / note | Fallback |
|------------|-------------|-----------|----------------|----------|
| Node / npm | build tooling | ✓ | Node v26, npm 11.12.1 (env) | — |
| next / react / tailwind / zod / framer-motion | whole page | ✓ | 16.2.1 / 19.2.4 / 4.2.2 / 4.4.3 / 12.38.0 (verified on disk) | — |
| `/api/lead` route | compact form backup | ✓ | `app/api/lead/route.ts` present (Phase 5) | WhatsApp handoff still works if backup 400s |
| `home-hero.jpg` | D-05 image band | ✓ | `public/images/heroes/home-hero.jpg` (203 KB, staged) | — |
| Next Image Optimization | D-05 AVIF/WebP | ✓ (hybrid) | `next.config.ts` `formats:[avif,webp]`, no `unoptimized` | — |
| GHL webhook env (`GHL_WEBHOOK_URL`) | GHL forward | server-side (Vercel) | Preview/Prod env (Phase 5) | If unset, route returns `config` 500 — backup only; WhatsApp unaffected |
| Upstash Redis env | rate limit | optional | Graceful-degrade to honeypot-only (route handles absence) | Honeypot remains active |
| Vercel preview | THE build/verify gate | ✓ | push non-main branch → preview | none — local `next build` deadlocks (OneDrive) |
| Inline Playwright harness | preview UI/INP/contrast audit | ✓ | npx-cached, shots → /private/tmp (memory: ui-audit-harness) | manual PageSpeed/axe |

**Missing dependencies with no fallback:** none.
**Missing with fallback:** GHL/Upstash envs on a bare preview degrade gracefully (WhatsApp + honeypot still work).

## Validation Architecture

> `workflow.nyquist_validation: true` and `ui_phase: true` in `.planning/config.json`. **Hard constraint:** local `next build`, full `tsc --noEmit`, and heavy test runs DEADLOCK on the OneDrive mount. No test framework is installed. Validation = **(A) in-place source/structure asserts** (grep + tiny pure-module `npx tsx`) + **(B) behavioral verification on the Vercel preview**. Execution is INLINE (no subagents/worktrees on this mount).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None installed** (CLAUDE.md: "no test framework") — do NOT introduce Jest/Vitest for this phase |
| In-place asserts that work | `grep`/`rg` source assertions; a single tiny `npx tsx` importing only pure `lib/services`/`lib/reviews` (no React/Next graph) |
| Forbidden locally | `next build`, `next dev`, `tsc --noEmit` on the full project (OneDrive deadlock) |
| Canonical build + typecheck | **Vercel preview** — push non-main branch → preview build runs `prebuild` gates + `next build` (compiles + typechecks 27 routes) on CI |
| UI/behavior probe | Inline Playwright harness against the preview URL (INP, contrast, responsive, form POST) |

### Phase behavior → verification map
| Behavior (decision) | Local source assert (grep/tsx) | Preview verification |
|---------------------|--------------------------------|----------------------|
| Retired sections gone (D-01) | `app/page.tsx` no longer imports HeroSection/ServicesSection/PricingSection/WhyTPSSection/ReviewsSection | Home renders new sections only |
| Compact form posts to `/api/lead` (D-03) | grep `OfferteForm` calls `submitLead` + `buildWhatsAppLeadUrl`; `variant`/controlled `dienst` present | Submit → Network `POST /api/lead → 200` (backup captured) + WhatsApp opens |
| Pillar → prefill + scroll (D-09) | grep controlled select wiring + `onOfferte`/`scrollIntoView` | Click "Offerte" → dropdown shows pillar + viewport scrolls to form |
| Responsive stack < 860px (D-04) | grep `@container` + `@min-[860px]`/`@max-[860px]` classes | Resize 800px → hero stacks; 375px trust-pills lay out cleanly (UI-07) |
| CSS aurora, no WebGL (D-04/D-19) | grep new sections: zero `SoftAurora`/`ogl`/`AmbientParticles`/`FocalParticles`/`canvas` | Aurora animates on desktop, static on mobile/reduced-motion |
| Image band off LCP (D-05) | grep `home-hero.jpg` uses `loading="lazy"`, **no** `priority` | PageSpeed: LCP element = hero H1 text (not the image); good LCP |
| AA WhatsApp (D-17/A11Y-01) | grep WhatsApp CTA class ≠ `#25D366`+`text-white`; uses `text-on-surface` or neutral surface + `text-primary` glyph | axe/contrast check ≥ 4.5:1 text, ≥ 3:1 glyph |
| Exactly one h1 (D-18/A11Y-02) | grep `<h1` in new home sections == 1; no heading-level skips | axe heading-order clean |
| Static 3-up reviews (D-15) | grep home does NOT import `ReviewCarousel` | 3 cards visible at once, no carousel controls |
| WTW/MV neutral brand fallback (D-13) | tiny `npx tsx`: assert `brandsForPillar("wtw").length===0 && brandsForPillar("mechanische-ventilatie").length===0` | Cards show "diverse merken / merkonafhankelijk", not fabricated brands |
| No token regressions (Pitfall 2) | grep new files for `var(--gradient-ink|--glass-strong|--shadow-|--ease-clarity|--color-bg-tint|--color-surface-2|--color-text-faint)` → zero hits | Visual: dark band, shadows, glass all render |
| Guardrails (D-18) | grep new files: no `#000`, no `1px solid`, no raw `material-symbols-outlined` span, no hardcoded phone (use `SITE`) | Visual review |
| INP < 200ms (D-19/SEO-10) | (n/a locally) | Preview mobile Lighthouse/PageSpeed INP < 200ms + good LCP — launch gate |

### Sampling Rate
- **Per task (in-place):** the grep/tsx asserts for that task's decision.
- **Per wave / before merge:** push branch → Vercel preview build green (prebuild gates + 27 routes + typecheck).
- **Phase gate:** preview PageSpeed mobile INP < 200ms + good LCP; axe contrast/heading clean; form E2E (POST 200 + WhatsApp) on preview.

### Wave 0 Gaps
- [ ] No test framework — do **not** add one; Wave 0 = confirm the grep/tsx assert scripts run in-place and the preview pipeline is reachable (push a trivial branch → preview builds).
- [ ] (Optional) `lib/initials.ts` extraction so `getInitials` is importable by the new sections without duplicating.
- [ ] Confirm inline Playwright harness still resolves (memory: ui-audit-harness) for the preview INP/contrast probes.

*No unit-test files are created this phase — validation is source-assert + preview-behavioral by design.*

## Security Domain

> `security_enforcement: true`, `security_asvs_level: 1`, `security_block_on: high`. Phase 6 adds **no new endpoint or attack surface** — it consumes the Phase-5 secure `/api/lead`. The relevant controls are input validation (reused) and safe rendering of static content.

### Applicable ASVS (L1) categories
| ASVS category | Applies | Standard control (already in place / to preserve) |
|---------------|---------|----------------------------------------------------|
| V2 Authentication | no | Public marketing page; no auth |
| V3 Session Management | no | No sessions (sticky-bar dismissal uses `sessionStorage`, non-security) |
| V4 Access Control | no | No protected resources |
| V5 Input Validation | **yes** | `leadSchema` (Zod) is server-authoritative on `/api/lead`; compact form MUST post through the same route. Honeypot (`website`) preserved. Content-type gate + safe `request.json()` already in the route. |
| V6 Cryptography | no (client) | GHL secret stays **server-only** (no `NEXT_PUBLIC_`); `submitLead`/`lib/forms.ts` hold no secret — keep it that way |
| V7 Error Handling & Logging | yes | Route never logs the PII payload; only generic error codes cross back. Compact-form failures must not surface PII. |

### Known threat patterns for this stack
| Pattern | STRIDE | Standard mitigation (status) |
|---------|--------|------------------------------|
| Reflected/stored XSS via review quotes or copy | Tampering | Content is **static data** (`lib/reviews.ts`), rendered as text (React auto-escapes). **No `dangerouslySetInnerHTML`.** ✅ |
| Injection into the WhatsApp deep link | Tampering | `buildWhatsAppLeadUrl` uses `encodeURIComponent` ✅ |
| Form spam / enumeration / DoS | Tampering / DoS | Rate-limit (Upstash, graceful-degrade) + honeypot on `/api/lead` (Phase 5) — inherited ✅ |
| Missing consent capture (AVG/GDPR) | Info disclosure / compliance | Compact form must still send `consent:true` and name GHL as verwerker in `/privacy-beleid` (Phase 5 D-08). **Do not drop consent for "friction."** ⚠️ (Open Q1) |
| Secret leakage to client | Info disclosure | Keep GHL webhook server-side; the compact form imports nothing secret ✅ |

**Security gate for the phase:** the compact form must (a) submit only through `/api/lead`, (b) carry consent, (c) never place a secret or webhook URL client-side. No `block_on: high` items introduced.

## Assumptions Log

| # | Claim | Section | Provenance | Risk if wrong |
|---|-------|---------|------------|---------------|
| A1 | Compact hero form should supply a sentinel/relaxed `naam` + `consent:true` so the GHL backup validates while staying low-friction | Open Q1, Pattern 1 | `[ASSUMED]` — a design decision (D-19 discretion) | If naam/consent are simply omitted, the durable GHL backup 400s and leads are lost (WhatsApp still works) |
| A2 | WTW/MV serviced-brand names are **unconfirmed** at build → neutral "diverse merken" fallback | D-13, Pitfall 5 | `[ASSUMED]` pending owner (STATE + CONTEXT flag it) | Fabricated brand endorsements if guessed |
| A3 | AA fix: keep `#25D366` with `text-on-surface` (dark) text | D-17 code example | `[VERIFIED: WCAG contrast calc]` 8.6:1 (white = 1.99:1) | Low — math is deterministic; *which* treatment is a design choice |
| A4 | Aurora is best gated by CSS media queries (lightest) rather than JS | Pattern 3 | `[ASSUMED]` — both valid; recommendation | Slightly higher INP if a JS gate is used unnecessarily |
| A5 | Retired section files may be deleted now (home-only, lint-safe) | Structure, Pitfall 6 | `[VERIFIED: codebase]` CLAUDE.md states `page-sections/` used by `app/page.tsx` only | Low — could defer deletion to Phase 7 |
| A6 | Prefer CSS fade-up over framer-motion for new sections (INP) | Pattern, Alternatives | `[ASSUMED]` — discretion | Minor INP cost if framer-motion used everywhere |
| A7 | Coverage-line wording "Van Den Haag tot Gouda en Leiden — actief binnen 60 km rondom Zoetermeer" | D-06 | `[ASSUMED]` working copy (owner-approvable) | Owner may reword |

## Open Questions (RESOLVED)

> All five were resolved in-plan during /gsd-plan-phase (2026-07-01) — no owner block. Resolution map:
> 1. **RESOLVED** (Plan 06-02) — compact form sends a hidden owner-recognizable `COMPACT_LEAD_NAME = "Snelaanvraag"` sentinel (passes `naam.min(2)`) + a condensed explicit AVG consent (`consent:true` preserved); `buildWhatsAppLeadUrl` omits the sentinel Naam line. `leadSchema` untouched.
> 2. **RESOLVED** (Plan 06-04) — WTW/MV render the neutral "Diverse merken · merkonafhankelijk" chip (`brandsForPillar()===[]`); the serviced-brand list is flagged as a non-blocking owner-review item.
> 3. **RESOLVED** (Plan 06-06) — retired section imports removed now; the files are left on disk (lint-safe) for Phase-7 cleanup.
> 4. **RESOLVED** (Plan 06-03) — aurora gated by pure-CSS media query (`min-width:768px` + `prefers-reduced-motion:no-preference`) for lowest INP; no JS hook.
> 5. **RESOLVED** (Plan 06-03) — fade-up uses the cheap CSS `.fu` class; framer-motion reserved for isolated accents only.

1. **Compact-form `naam` + `consent` mechanic (the key decision).**
   - What we know: the shared server `leadSchema` requires `naam.min(2)` and `consent: literal(true)`; the WhatsApp handoff is the primary channel (name arrives naturally in chat); `submitLead` runs as a best-effort silent backup with `keepalive`.
   - What's unclear: how to keep the hero form Postcode+Telefoon+Dienst-light (D-03) while still letting the GHL backup validate and staying AVG-correct.
   - Recommendation: compact form sends `consent:true` via a **compact but explicit consent** (small checkbox or a clear "door te verzenden ga je akkoord met ons privacybeleid" statement — keep it explicit for AVG) **and** a `naam` that passes `min(2)` — either a lightweight inline naam field or a sentinel like `"Snelaanvraag"` (owner-recognizable), with a one-line tweak to `buildWhatsAppLeadUrl` to omit a blank/sentinel `Naam:` line. Confirm with the owner before build.

2. **WTW / MV serviced brands (pre-build owner input).**
   - What we know: `brandsForPillar()` returns `[]` for both (verified); confirmed dealer brands exist only for Airco + Warmtepompen.
   - Recommendation: request the WTW/MV brand list from the owner; if not confirmed by build, ship the neutral **"diverse merken / merkonafhankelijk"** chip (D-13). Do not guess brand names.

3. **Retired section files: delete now or defer to Phase 7?**
   - What we know: `HeroSection`/`ServicesSection`/`PricingSection`/`WhyTPSSection`/`ReviewsSection` are home-only; removing their imports is lint-safe; deleting the files is also safe (nothing else imports them). `SoftAurora`/particles become orphaned (harmless).
   - Recommendation: remove imports now (required by D-01/D-02); deleting the files is planner's call (safe either way).

4. **Aurora gating: pure-CSS media queries vs `useEnableHeavyMotion`.**
   - Recommendation: pure-CSS media-gate for lowest INP (zero JS); use the hook only if the aurora must live inside the client island for consistency. Both satisfy D-04/D-19.

5. **Fade-up entrance: CSS `.fu` vs `AnimateOnScroll` (framer-motion).**
   - Recommendation: CSS `.fu` for the rebuilt sections (lighter INP); framer-motion acceptable for one/two accents. Discretion (D-19).

## Sources

### Primary (HIGH confidence)
- **Project codebase (read in-session):** `components/OfferteForm.tsx`, `lib/forms.ts`, `lib/whatsapp.ts`, `lib/lead-schema.ts`, `app/api/lead/route.ts`, `components/StickyContactBar.tsx`, `components/BrandGrid.tsx`, `components/CTABanner.tsx`, `components/ReviewCarousel.tsx` (getInitials), `components/Icon.tsx`, `components/AnimateOnScroll.tsx`, `lib/reviews.ts`, `lib/constants.ts`, `lib/useEnableHeavyMotion.ts`, `lib/services/registry.ts`/`brands.ts`/`types.ts`, `app/page.tsx`, `app/tarieven/page.tsx` (Suspense precedent), `app/layout.tsx`, `app/globals.css`, `next.config.ts`, `postcss.config.mjs`, `package.json`.
- **Version checks (on-disk `node_modules`):** next 16.2.1, react 19.2.4, tailwindcss 4.2.2, zod 4.4.3, framer-motion 12.38.0.
- **Design contract (project skill, authoritative):** `.claude/skills/sketch-findings-tps-ventilatie/SKILL.md` + `references/{design-language,hero-and-conversion,service-pillars,trust-and-contact}.md` + `sources/00{1,2,3}/index.html`.
- **Phase context:** `06-CONTEXT.md`, `05-CONTEXT.md`, `.planning/STATE.md`, `./CLAUDE.md`, `.planning/config.json`.
- **Tailwind CSS v4 container queries:** https://tailwindcss.com/docs/responsive-design — VERIFIED `@container` + `@max-[860px]`/`@min-[860px]` are core (no plugin).

### Secondary (MEDIUM confidence)
- WCAG contrast ratios for `#25D366` (computed via the WCAG relative-luminance formula): white = **1.99:1** (fail), `on-surface #141d1f` = **8.6:1** (pass), `#075E54` + white = **7.7:1** (pass alt).

### Tertiary (LOW confidence)
- None material — the phase is codebase-grounded.

## Metadata

**Confidence breakdown:**
- Standard stack / reusable assets: **HIGH** — read the real files + verified versions on disk.
- Architecture patterns (compact variant, pillar routing, aurora, image band): **HIGH** — grounded in actual component signatures + verified Tailwind v4 syntax.
- Token translation table: **HIGH** — verified by grep that sketch vars are absent and mapping targets exist in `globals.css`.
- Pitfalls / validation / security: **HIGH** — derived from the real route/schema + config flags + OneDrive constraint.
- UX decisions (naam mechanic, aurora gate, motion): **MEDIUM** — genuine design choices flagged as Open Questions with recommendations.

**Research date:** 2026-07-01
**Valid until:** ~2026-07-31 (stable stack; re-confirm `REVIEW_RATING.count` at owner sign-off — it ticks up, and confirm WTW/MV brands before build).
</content>
</invoke>
