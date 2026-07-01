# Phase 6: Homepage conversion uplift - Pattern Map

**Mapped:** 2026-07-01
**Files analyzed:** 10 (5 new, 5 modified)
**Analogs found:** 10 / 10 (every new file has a real in-repo analog — this phase is 90% composition of existing assets)

> All line numbers below are from the live code (verified in-session), not from RESEARCH.md. Excerpts are the exact patterns to copy. The **sketch-token → real-token** table at the bottom is load-bearing: the sketch CSS references custom properties that DO NOT exist in `app/globals.css` — porting them verbatim yields silent no-style bugs (RESEARCH Pitfall 2).

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/page.tsx` (REWRITE) | route/page (server) | request-response (compose) | `app/page.tsx` (current) + `app/layout.tsx` | exact (self) |
| `app/page-sections/home/HomeHero.tsx` (NEW) | component — client island (hero + pillar grid, lifts `dienst` state + `formRef`) | request-response (form submit) + event-driven (pillar→scroll) | `app/page-sections/HeroSection.tsx` (client hero, motion gate) | role-match |
| `app/page-sections/home/PillarGrid.tsx` (NEW) | component — client (receives `onOfferte` callback) | event-driven (`onOfferte`) + navigation (`<Link>`) | `app/page-sections/ServicesSection.tsx` (card grid) + `components/BrandGrid.tsx` (taxonomy chips) | role-match |
| `app/page-sections/home/ProofBand.tsx` (NEW) | component — server section | transform/read (static data render) | `components/ReviewCarousel.tsx` (`ReviewCard`/`Stars`/`getInitials`) + `app/page-sections/WhyTPSSection.tsx` (USP list) | role-match |
| `app/page-sections/home/ImageBand.tsx` (NEW, or inline in page) | component — server | file-I/O (`next/image`) | `app/page-sections/WhyTPSSection.tsx` (`next/image` usage) | role-match |
| `app/page-sections/home/ClosingCTA.tsx` (NEW) | component — server | request-response (CTA links) | `components/CTABanner.tsx` | exact |
| `components/OfferteForm.tsx` (EXTEND) | component — client form | request-response | `components/OfferteForm.tsx` (self, backward-compat extend) | exact (self) |
| `lib/whatsapp.ts` (MAYBE — Open Q1) | utility | transform | `lib/whatsapp.ts` (self) | exact (self) |
| `lib/initials.ts` (NEW, optional) | utility | transform | `getInitials` inside `components/ReviewCarousel.tsx` (extract) | exact (extract) |
| `app/globals.css` (ADD aurora + CSS-G) | config/styles | — | existing `@utility` / `@keyframes` blocks (lines 83-149) | exact |

---

## Pattern Assignments

### `app/page.tsx` — REWRITE (route/page, server)

**Analog:** current `app/page.tsx` (keep the metadata export; swap the section composition).

**Keep exactly (lines 6-12):** the metadata builder — do NOT drop it.
```tsx
import { buildMetadata } from "@/lib/seo/metadata";
import { findBySlug } from "@/lib/services/registry";
// Home self-canonical (https://tpsventilatie.nl/) + OG/Twitter + index.
export const metadata = buildMetadata(findBySlug("/")!);
```

**Replace (lines 1-5, 14-28):** the retired imports + composition. New body keeps the `<main>` landmark (D-01):
```tsx
export default function Home() {
  return (
    <main>
      <HomeHero />       {/* client island — hero + pillar grid */}
      <ProofBand />      {/* server — 4,9 + CSS-G + 3 cards + keurmerken + USP pills */}
      <ImageBand />      {/* server — home-hero.jpg, off LCP */}
      <ClosingCTA />     {/* server — restyled dark band */}
    </main>
  );
}
```
- **Remove** the 5 retired imports: `HeroSection`, `ServicesSection`, `PricingSection`, `WhyTPSSection`, `ReviewsSection` and the `CTABanner` import (D-01/D-02). Page stays a **Server Component** (no `"use client"`).
- Verify (RESEARCH Validation map): `grep` `app/page.tsx` shows none of the 5 retired section imports.

---

### `app/page-sections/home/HomeHero.tsx` — NEW (client island)

**Analog:** `app/page-sections/HeroSection.tsx` (the `"use client"` boundary + `useEnableHeavyMotion` gate + brand-teal colors + badge/CTA patterns). **Do NOT copy its WebGL** (`SoftAurora`) — that is the exact anti-pattern D-04/D-19/Pitfall 6 forbid.

**`"use client"` + named-export + motion-gate pattern** (`HeroSection.tsx` lines 1-8, 23-34):
```tsx
"use client";
import { useEffect, useState } from "react";
import { useEnableHeavyMotion } from "@/lib/useEnableHeavyMotion";
// ...
export function HeroSection() {
  const heavy = useEnableHeavyMotion();   // false on SSR/mobile/reduced-motion
```
Convention to copy: **named export**, function name === file name, `"use client"` at top for the hook-using island.

**Brand-teal tokens already in use here** (`HeroSection.tsx` lines 48-64) — reuse for the CSS aurora (D-18/UI-06). These are exactly the calmer tints the phase wants; the static fallback below is the CWV-optimal base layer:
```tsx
color1="#a8dff0"  color2="#b8e8d0"   // WebGL args — DROP the WebGL, keep the colors
// static fallback (KEEP this idea for the CSS aurora base):
<div className="h-full w-full bg-gradient-to-br from-[#a8dff0]/50 via-[#b8e8d0]/40 to-transparent" aria-hidden />
```

**State-lift + ref-scroll gesture (D-09)** — NEW code (no exact analog; nearest state-holder is `HeroSection`'s `useState`). Wire per RESEARCH Pattern 2:
```tsx
const [dienst, setDienst] = useState("");
const formRef = useRef<HTMLDivElement>(null);
function routeToOfferte(pillarNavTitle: string) {
  setDienst(pillarNavTitle);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
}
// render: <div ref={formRef}><OfferteForm variant="compact" dienst={dienst} onDienstChange={setDienst} /></div>
//         <PillarGrid onOfferte={routeToOfferte} />
```

**Badge pattern (D-06 Dutch badge / UI-05)** (`HeroSection.tsx` lines 76-82) — restyle copy to Dutch, keep the `Icon`-in-pill structure:
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold uppercase tracking-widest mb-6">
  <Icon name="air" filled className="text-sm" /> {/* Dutch label, e.g. "Klimaatspecialist Zoetermeer" */}
</div>
```

**Container-query two-col (D-04)** — VERIFIED Tailwind v4.2.2 core syntax (no plugin). This is NEW markup (no analog uses `@container`):
```tsx
<section className="@container">
  <div className="grid gap-10 @min-[860px]:grid-cols-[1.15fr_0.85fr] items-start">
    <div>{/* badge, H1 (signature-gradient span), proof bar, coverage line */}</div>
    <div ref={formRef}>{/* <OfferteForm variant="compact" ... /> */}</div>
  </div>
</section>
```

**Gradient-accent H1 (D-06)** — the `signature-gradient` utility exists (`globals.css` lines 89-91). Exactly ONE `<h1>` on the page (A11Y-02):
```tsx
<h1 className="font-headline font-extrabold tracking-tight text-on-surface text-[clamp(2rem,5vw,3.5rem)]">
  Airco, warmtepomp &amp; ventilatie —{" "}
  <span className="signature-gradient bg-clip-text text-transparent">goed geregeld in Zoetermeer en heel Zuid-Holland</span>
</h1>
```

**Coverage line from data (D-06)** — source from `SITE` (never hardcode towns):
```tsx
import { SITE } from "@/lib/constants";
// SITE.serviceAreas = 8 towns (Zoetermeer, Den Haag, Leiden, Gouda, Delft, …); SITE.serviceRadiusKm = 60
```

**Proof bar (D-07)** — monogram chips from `lib/reviews.ts` via `getInitials` (see `lib/initials.ts` below) + `REVIEW_RATING`. Guard `REVIEW_RATING` for `null`; format Dutch:
```tsx
import { REVIEWS, REVIEW_RATING } from "@/lib/reviews";
const score = REVIEW_RATING ? REVIEW_RATING.value.toLocaleString("nl-NL", { minimumFractionDigits: 1 }) : null; // "4,9"
const count = REVIEW_RATING?.count ?? REVIEWS.length; // 34
```
**No fake avatars** — initials-only monogram chips (D-07).

---

### `app/page-sections/home/PillarGrid.tsx` — NEW (client, receives `onOfferte`)

**Analog:** `app/page-sections/ServicesSection.tsx` (card-grid + `Icon` + feature-chip visual language) for layout, and `components/BrandGrid.tsx` (`BRAND_COLOR` map + `.logo-chip` text-word chips) for the brand chips. **Both analogs hardcode content — the fix is to source from the taxonomy** (`pillars()` / `childrenOf()` / `brandsForPillar()`), never hardcode.

**Card-grid + Icon + feature-chip visual** (`ServicesSection.tsx` lines 22, 84-89):
```tsx
<div className="grid grid-cols-1 md:grid-cols-... gap-6">  {/* D-08: 4→2→1 cols, items-start (independent heights) */}
// feature chip pattern:
<span className="px-4 py-2 bg-surface-container rounded-lg text-sm font-semibold flex items-center gap-2">
  <Icon name="check" className="text-primary text-lg" /> {feat}
</span>
```

**Pillar data + icons (D-08)** — from `pillars()`; icons ALREADY match the sketch (verified): `airconditioning→ac_unit`, `warmtepompen→heat_pump`, `wtw→hvac`, `mechanische-ventilatie→air`. `PillarPage` shape (`lib/services/types.ts` 61-74): `navTitle`, `navDescription`, `icon`, `pillarSlug`.
```tsx
import { pillars, childrenOf, brandsForPillar, urlFor } from "@/lib/services/registry";
// primary click → pillar page (SEO, D-09):  <Link href={urlFor(pillar)}>
// sub-service chips (D-10):  childrenOf(pillar.pillarSlug).map(s => <Link href={urlFor(s)}>{s.navTitle}</Link>)
// "Offerte" button (D-09):  <button onClick={() => onOfferte(pillar.navTitle)}>Offerte</button>
```
> `onOfferte` MUST pass `pillar.navTitle` — the form builds its `<select>` options from `pillars().map(p => p.navTitle)` (`OfferteForm.tsx` lines 27-30), so the controlled value aligns exactly. **"Nieuw" tag** on Warmtepompen (D-08) is presentational — add in markup, not in the taxonomy.

**Brand chips (D-12) + WTW/MV neutral fallback (D-13)** — the `BRAND_COLOR` map lives INSIDE `BrandGrid.tsx` (lines 11-16), NOT exported. `brandsForPillar()` returns `[]` for `wtw` and `mechanische-ventilatie` (VERIFIED). Copy the chip visual (`BrandGrid.tsx` lines 33-48); drive the fallback off the empty array:
```tsx
const brandIds = brandsForPillar(pillar.pillarSlug); // [] for wtw + mechanische-ventilatie
brandIds.length > 0
  ? /* brand-colored dot + name chip, per BrandGrid lines 33-48 (BRAND_COLOR via --brand CSS var) */
  : <span className="inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-1.5 text-sm font-semibold text-on-surface-variant">Diverse merken · merkonafhankelijk</span>
```
**Chip text-word style (`BrandGrid.tsx` lines 36-48)** — brand-colored square + brand NAME (never a trademarked logo image; `brands.ts` logo paths point at non-existent SVGs → an `<img>` would 404):
```tsx
style={{ "--brand": BRAND_COLOR[brand.id] ?? "var(--color-primary)" } as CSSProperties}
<span className="w-3 h-3 rounded-sm bg-[var(--brand)]" aria-hidden="true" />
<span className="font-headline font-extrabold text-sm text-on-surface">{brand.name}</span>
```
> **Pre-build owner input (flag in plan):** confirm WTW/MV serviced brands before build; if unconfirmed, ship the neutral chip (D-13, Pitfall 5). Do not fabricate brand names. If `BRAND_COLOR` is needed here, extract it from `BrandGrid.tsx` to a shared spot rather than duplicating.

---

### `app/page-sections/home/ProofBand.tsx` — NEW (server section)

**Analog:** `components/ReviewCarousel.tsx` (`ReviewCard`, `Stars`, `getInitials` — lines 17-54) for the card visual, and `app/page-sections/WhyTPSSection.tsx` (lines 7-56) for the USP list pattern. **Render as static 3-up cards — do NOT import `ReviewCarousel`** (D-15; drops the interval timer + resize listener → INP win).

**Static review card visual to copy** (`ReviewCarousel.tsx` lines 26-53) — as a plain server subcomponent (strip the `"use client"` carousel machinery):
```tsx
function Stars() { /* 5× <Icon name="star" filled className="text-lg" /> in a text-yellow-500 row */ }
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col h-full min-w-0">
      <Stars />
      <p className="text-on-surface italic mb-8 leading-relaxed flex-1 line-clamp-5">&ldquo;{review.quote}&rdquo;</p>
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold shrink-0">
          {getInitials(review.name)}
        </div>
        <div><p className="font-bold">{review.name}</p><p className="text-xs text-on-surface-variant">{review.timeAgo}</p></div>
      </div>
    </div>
  );
}
```
**Data (D-14):** `REVIEWS` (17 real) + `REVIEW_RATING` (`{value:4.9, count:34, url}`, **can be null → guard**) from `lib/reviews.ts` (lines 13, 135-136). Pick 3 short brand-clean quotes (discretion; e.g. Christine te Kamp, Lois Lovelle, Albert Terstegs). Content is static data → React auto-escapes; **no `dangerouslySetInnerHTML`** (Security V5).

**USP pills (D-14)** — analog `WhyTPSSection.tsx` USP array (lines 7-28) already reads `SITE.serviceRadiusKm`. Copy the icon-in-tile + label pattern; keep pills clean at 375px (UI-07). USP labels: "Geen voorrijkosten · Reactie binnen 1 werkdag · Gecertificeerd & verzekerd".

**Keurmerken strip (D-14):** BRL 100/200 + KvK (`SITE.kvk` = `73722650`) as text/CSS chips (F-gassen/STEK dropped).

**CSS Google-"G" (D-14):** pure CSS `conic-gradient` + `mask` (NEW utility in globals.css — see below). No image asset (no 404 risk).

**Heading discipline (A11Y-02):** this section uses `<h2>`/`<h3>` only — the single `<h1>` is the hero. No level skips.

---

### `app/page-sections/home/ImageBand.tsx` — NEW (server; `next/image`)

**Analog:** `app/page-sections/WhyTPSSection.tsx` lines 2, 66-71 (the repo's `next/image` usage). **Difference for D-05:** the analog uses `fill`; the band should use intrinsic `width`/`height` (no CLS) and stay OFF the LCP path.

**Analog import + Image usage** (`WhyTPSSection.tsx`):
```tsx
import Image from "next/image";
<Image src="/images/work/tpsventilatie-work.jpg" alt="TPS klimaattechniek aan het werk" fill className="object-cover" />
```
**Apply for D-05** (RESEARCH Pattern 4) — `public/images/heroes/home-hero.jpg` (staged, 203 KB); `next.config.ts` already sets `formats:["image/avif","image/webp"]` (no `unoptimized`):
```tsx
<Image
  src="/images/heroes/home-hero.jpg"
  alt="TPS-monteur installeert een klimaatsysteem"   // meaningful Dutch alt
  width={1600} height={900} sizes="100vw"
  className="w-full h-auto object-cover"
  loading="lazy"                                       // NO priority — priority preloads onto LCP path (Pitfall 4)
/>
```
Place lower on the page (near/within the trust band). Verify on preview: LCP element = hero H1 text, not this image.

---

### `app/page-sections/home/ClosingCTA.tsx` — NEW (server)

**Analog:** `components/CTABanner.tsx` (EXACT — restyle it into the D-17 dark band). Two bugs to FIX while porting (they violate CLAUDE.md + A11Y-01):

**Dark band base to keep** (`CTABanner.tsx` line 13) — `bg-on-primary-fixed` (#001f29) IS the "gradient-ink" translation:
```tsx
<div className="bg-on-primary-fixed text-white rounded-3xl p-10 md:p-16 relative overflow-hidden ...">
```

**FIX 1 — raw Material Symbols spans → `Icon` wrapper.** `CTABanner.tsx` lines 27, 36, 44 use `<span className="material-symbols-outlined">` (guardrail violation). Replace with `<Icon name="..." />` (`components/Icon.tsx`).

**FIX 2 — AA-safe WhatsApp.** `CTABanner.tsx` lines 30-38 use `bg-[#25D366] text-white` = **1.99:1 (FAILS AA)**. Use the `StickyContactBar` treatment (the site's proven AA-safe pattern) — neutral surface + teal glyph:
```tsx
// StickyContactBar.tsx lines 83-91 — COPY this AA-safe WhatsApp CTA:
<a href={SITE.whatsappUrl} target="_blank" rel="noopener"
   className="btn-hover flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface-container-high px-4 py-2.5 font-semibold text-on-surface">
  <Icon name="chat" filled className="text-[20px] text-primary" /> WhatsApp
</a>
// Alternative (also AA): bg-[#25D366] with text-on-surface (dark) = 8.6:1 — keeps the vivid green.
```
**Bel / Offerte** — keep `tel:${SITE.phone}` + a signature-gradient "Offerte" pill (StickyContactBar lines 93-99 pattern). All contact data via `SITE` (never hardcode). This band is a **Server Component** (CTABanner is server today — keep it; it wraps with `AnimateOnScroll` but you may swap to CSS `.fu` for INP, discretion D-19).

---

### `components/OfferteForm.tsx` — EXTEND (client form, self)

**Analog:** itself. Backward-compatible extension only — **do NOT fork** (D-03).

**Current props (lines 14-21)** — uncontrolled `defaultDienst`:
```tsx
interface OfferteFormProps { defaultDienst?: string; }
export function OfferteForm({ defaultDienst }: OfferteFormProps) {
```
**Extend to (RESEARCH Pattern 1):**
```tsx
interface OfferteFormProps {
  defaultDienst?: string;                        // existing, uncontrolled prefill (keep)
  variant?: "full" | "compact";                  // NEW — default "full"
  dienst?: string;                               // NEW — when provided, select is CONTROLLED
  onDienstChange?: (value: string) => void;      // NEW
}
```
**Select today (lines 139-155)** is uncontrolled (`defaultValue={defaultDienst ?? ""}`). Make it controlled when props are passed (Pitfall 3 — `defaultValue` is read once at mount, so a post-mount pillar click can't move it):
```tsx
dienst !== undefined
  ? <select value={dienst} onChange={e => onDienstChange?.(e.target.value)} ...>
  : <select defaultValue={defaultDienst ?? ""} ...>   // existing pillar/service-page usages untouched
```
**`compact` variant** renders **Postcode + Telefoon + Dienst + submit** (hide naam/email/bericht from lines 104-133/157-168). **Shared `handleSubmit` (lines 32-56) is reused as-is** — it already builds the WhatsApp URL (`buildWhatsAppLeadUrl`, line 47), fires the silent backup (`submitLead`, line 51, `keepalive`), and navigates to `wa.me` (line 55).

**CRITICAL — compact submit must still satisfy the shared server schema** (`lib/lead-schema.ts` lines 8-19): `naam.min(2)` + `consent: literal(true)`. A Postcode+Telefoon+Dienst-only POST returns 400 and the durable GHL backup is lost silently (Pitfall 1). Open Q1 mechanic (owner-confirm): supply `consent:true` via a compact-but-explicit consent (keep the AVG checkbox at lines 171-185, condensed) **and** a `naam` of length ≥2 (inline naam field OR sentinel like `"Snelaanvraag"`). **Do NOT weaken `leadSchema`** — the full form keeps naam required.

---

### `lib/whatsapp.ts` — MAYBE modify (utility, self; Open Q1)

**Analog:** itself. `buildWhatsAppLeadUrl` (lines 16-33) always emits `Naam: ${fields.naam}` (line 22). If the compact form uses a sentinel naam, add a one-line guard to omit a blank/sentinel `Naam:` line — mirror the existing optional-line pattern (lines 26-30):
```tsx
const email = fields.email?.trim();
if (email) lines.push(`E-mail: ${email}`);   // ← copy this conditional-push idiom for a sentinel Naam
```
Only touch this if Open Q1 lands on a sentinel; an inline naam field needs no change here.

---

### `lib/initials.ts` — NEW (utility, extract)

**Analog:** `getInitials` inside `components/ReviewCarousel.tsx` lines 17-24 (currently un-exported, trapped in a `"use client"` file). Extract verbatim so ProofBand + HomeHero proof bar can import it without pulling in the carousel:
```tsx
export function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
```
Matches the repo's tiny-pure-util convention (registry's `findByType`/`urlFor` style). Re-point `ReviewCarousel` to import from here (optional, avoids duplication).

---

### `app/globals.css` — ADD (config/styles)

**Analog:** existing `@utility` / `@keyframes` blocks (lines 83-149). Add new tokens the SAME way — CSS-first (`@utility` / `@keyframes`), NOT a JS config (Tailwind v4). Existing utilities to REUSE (do not re-create): `signature-gradient` (89-91), `glass-nav` (83-87), `btn-hover` (104-109), `hover-lift` (97-102). Existing reduced-motion guard block (136-149) is the pattern for gating new motion.

**Add:** CSS aurora keyframes/utility (RESEARCH Pattern 3 — animate only inside `@media (min-width:768px) and (prefers-reduced-motion:no-preference)`, brand tints `#a8dff0`/`#b8e8d0`/`#baeaff`), the CSS Google-"G" `.gmark` utility (conic-gradient + mask), and optionally a CSS `.fu` fade-up keyframe (INP-lighter alternative to `AnimateOnScroll`).

---

## Shared Patterns

### Icons (all sections)
**Source:** `components/Icon.tsx` (lines 7-16) — `<Icon name="..." filled className="..." />`.
**Apply to:** every new section. NEVER raw `<span className="material-symbols-outlined">` (CLAUDE.md guardrail; the current `CTABanner` violates this at lines 27/36/44 — fix on restyle).

### Business + geo data
**Source:** `lib/constants.ts` `SITE` (lines 1-44) — `phone`, `phoneDisplay`, `whatsappUrl`, `kvk` (73722650), `serviceAreas` (8 towns), `serviceRadiusKm` (60), `geo`.
**Apply to:** hero coverage line, proof keurmerken, closing CTA. Never hardcode contact info (CLAUDE.md guardrail).

### Forms → secure route (compact hero form)
**Source:** `lib/forms.ts` `submitLead` (lines 13-27, `keepalive`, never throws) + `lib/whatsapp.ts` `buildWhatsAppLeadUrl` (16-33) + `lib/lead-schema.ts` `leadSchema` (7-22, server-authoritative).
**Apply to:** the compact `OfferteForm`. Primary channel = WhatsApp `window.location`; silent backup = `POST /api/lead`. Both must carry `naam.min(2)` + `consent:true` (Pitfall 1 / Security V5).

### Motion gating (D-19)
**Source:** `lib/useEnableHeavyMotion.ts` (lines 13-30, SSR-safe, reduced-motion-aware) — the established gate. Fade-up analog: `components/AnimateOnScroll.tsx` (framer-motion, `whileInView` + `once:true`, ease `[0.25,0.1,0.25,1]`); CSS `.fu` alternative preferred for INP (discretion).
**Apply to:** CSS aurora (or pure-CSS media-gate — Pattern 3), section entrances. **No WebGL/canvas** on the homepage (drop `SoftAurora`/`AmbientParticles`/`FocalParticles`/`useParticleEngine`; grep new sections → must be zero — Pitfall 6).

### Live "direct beschikbaar" pulse (D-19)
**Source:** `components/StickyContactBar.tsx` lines 64-65 — `motion-safe:animate-ping` on a `bg-primary` dot. Copy for the hero proof-bar / availability pulse.

### Responsive pills at 375px (UI-07)
**Source:** `StickyContactBar.tsx` lines 70-91 — `whitespace-nowrap` + content-sized (never `flex-1`) + `max-[560px]:` drops. Apply the same discipline to hero trust pills + proof USP pills so they lay out cleanly at 375px.

### Inherited sticky bar (D-16)
**Source:** `app/layout.tsx` lines 7, 74 — `<StickyContactBar />` is mounted at layout level (direct `<body>` child). Render NOTHING new/always-on on the homepage.

---

## Sketch-token → Real-token Translation (CRITICAL — port through this table)

The sketch CSS (`.claude/skills/sketch-findings-tps-ventilatie/sources/*`) references custom properties that **DO NOT exist** in `app/globals.css`. Porting them verbatim = silent no-style bugs (Pitfall 2). Grep new files for any `var(--gradient-ink|--glass-strong|--shadow-|--ease-clarity|--color-bg-tint|--color-surface-2|--color-text-faint)` → any hit is a bug.

| Sketch var / class | Real token / utility (verified present in `app/globals.css`) |
|--------------------|--------------------------------------------------------------|
| `--color-primary` #006580 | `text-primary` / `bg-primary` ✅ |
| `--color-accent` #006b42 | `--color-tertiary` (#006b42, line 24) → `text-tertiary` (accent == tertiary) |
| `--color-surface` #f1fbfe | `bg-surface` ✅ |
| `--color-bg-tint` / `--color-surface-2` | tonal layering: `bg-surface-container-low` / `-container` / `-high` |
| `--color-text` #141d1f | `text-on-surface` ✅ (never `#000`) |
| `--color-text-faint` | `text-on-surface-variant` (#3f484d) or `text-outline` |
| `--gradient-signature` | `signature-gradient` utility ✅ (globals.css 89-91: `linear-gradient(135deg,#006580→#257f9c)`) |
| `--gradient-ink` (dark band) | **no token** → `bg-on-primary-fixed` (#001f29, line 9) — `CTABanner` line 13 already uses it |
| `--glass-bg` / `--glass-strong` / `--glass-blur` | `glass-nav` utility ✅ (globals.css 83-87: rgba white .85 + blur(20px) saturate(1.2)) |
| `--shadow-sm…xl` / `--shadow-glow` | **no tokens** → `shadow-sm/md/lg` OR teal-tint `shadow-[0_8px_30px_rgba(0,101,128,0.12)]` |
| `--ease-clarity` | `cubic-bezier(0.25,0.1,0.25,1)` (used by `btn-hover`/`hover-lift`/`AnimateOnScroll`) |
| `--ease-spring` | `cubic-bezier(0.22,1,0.36,1)` (StickyContactBar) |
| `--radius-full` | `rounded-full` |
| brand-teal aurora tints | `#a8dff0` / `#b8e8d0` / `#baeaff` (last is `--color-primary-fixed`, line 11) |
| `.badge`/`.btn`/`.trust-pill`/`.stars` | build from existing utilities + `Icon` (no sketch class names) |

---

## No Analog Found

None. Every new file maps to a real in-repo analog. The only genuinely NEW markup patterns (no direct analog, sourced from RESEARCH) are: the `@container` two-column stack (Tailwind v4 core, D-04), the CSS aurora keyframes (Pattern 3), and the CSS Google-"G" `.gmark` (Pattern, D-14) — all pure CSS added to `globals.css`.

---

## Metadata

**Analog search scope:** `app/`, `app/page-sections/`, `components/`, `lib/`, `lib/services/`
**Files scanned:** 18 (OfferteForm, forms, whatsapp, lead-schema, BrandGrid, brands, ReviewCarousel, CTABanner, registry, reviews, Icon, AnimateOnScroll, useEnableHeavyMotion, constants, next.config, page, layout, HeroSection, ServicesSection, WhyTPSSection, StickyContactBar, globals.css, services/types)
**Pattern extraction date:** 2026-07-01
</content>
</invoke>
