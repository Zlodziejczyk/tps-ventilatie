# Service / Pillar Architecture

From **Sketch 002 → Variant D ("Equal grid, engineered & branded")**. How the four
climate pillars present on the home page so they're instantly scannable *and* premium.

## Design Decisions

- **Equal 4-card grid — all pillars visible at once.** Deliberately chosen over an
  interactive selector (variant C) that hides 3 pillars behind a click. For a
  homepage, "they do all four" must be graspable without interaction. Scannability
  wins; interaction is layered on top, never at the cost of visibility.
- **The 4 pillars + icons:** Airconditioning (`ac_unit`), **Warmtepompen** (`heat_pump`,
  *Nieuw* tag), WTW Unit (`hvac`), Mechanische ventilatie (`air`).
- **Real taxonomy depth** shown as sub-service chips (from `lib/services/`):
  Airco = Installatie · Onderhoud · Reparatie & storing · Advies · **Warmtepompen** =
  same 4 · **WTW** = Vervangen · Onderhoud & reinigen · Inregelen · Storing · Aanleggen ·
  **MV** = Vervangen · Onderhoud & reinigen · Storing · Aanleggen. (Chips double as
  internal links — a Phase-3 SEO asset.)
- **★ Brand-logo chips** per pillar (Airco: Daikin / Mitsubishi Electric / Mitsubishi
  Heavy; Warmtepompen: Daikin / Mitsubishi Ecodan) — **grayscale → brand-color on
  hover**. The premium-HVAC-brand trust signal. **PLACEHOLDERS** until dealer status +
  official assets are confirmed (see What to Avoid).
- **Click-to-expand interaction:** each card has a "Details & offerte" toggle that
  slides open a drawer (USPs + Offerte/Bekijk CTAs). Liveliness without hiding the
  overview. Cards expand independently (`align-items:start`).

## CSS Patterns

**Independent-height grid** (so one expanding card doesn't stretch siblings):
```css
.grid4 { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
#variant-d .grid4 { align-items:start; }
@container stage (max-width:920px){ .grid4{grid-template-columns:repeat(2,1fr);} }
@container stage (max-width:540px){ .grid4{grid-template-columns:1fr;} }
```

**Brand-logo chip** (grayscale → brand color; `--brand` set inline per chip):
```css
.logo-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:var(--radius-md);background:var(--color-bg-tint);transition:all .2s var(--ease-clarity);}
.logo-chip .mark{width:12px;height:12px;border-radius:3px;background:var(--color-text-faint);transition:all .25s;}
.logo-chip .word{font-family:var(--font-headline);font-weight:800;font-size:12.5px;color:var(--color-text-faint);transition:color .25s;}
.logo-chip:hover .mark{background:var(--brand);transform:rotate(45deg);}
.logo-chip:hover .word{color:var(--brand);}
```
```html
<span class="logo-chip" style="--brand:#0086c9"><span class="mark"></span><span class="word">Daikin</span></span>
```

**Expand drawer** (max-height transition):
```css
.detail{max-height:0;overflow:hidden;opacity:0;transition:max-height .4s var(--ease-clarity),opacity .3s,margin .3s;}
.bcard.open .detail{max-height:280px;opacity:1;margin-top:16px;}
```

## HTML Structures

Card = icon (`.picon`, accent variant for Warmtepompen) + `Nieuw` tag + h3 + one-liner
+ `.logo-label` + `.logo-strip` + sub-service chips (`.subs a`) + `.foot` with a
`toggle` button revealing `.detail`. `toggleCard(btn){ btn.closest('.bcard').classList.toggle('open'); }`.

In React: a `Pillar[]` from the taxonomy registry → `<PillarCard>`; the logo chips
become a `<BrandLogos brandIds={…}>` resolving `lib/services/brands.ts`.

## What to Avoid

- **Don't hide pillars behind a selector** on the homepage (variant C) — keep all 4
  visible.
- **Don't ship the brand logos as-is.** They are **placeholder lockups**. Before real
  use: (1) owner confirms **authorized-dealer status** (flagged STATE.md blocker for
  Daikin/Mitsubishi), (2) official brand-kit SVGs, (3) trademark/usage rights. The
  WTW/MV brand names (Itho/Brink/Zehnder/Vasco/Orcon) are **illustrative** until the
  owner confirms which brands TPS services.
- Don't let the chip row imply endorsements/dealer status TPS doesn't hold.

## Origin

Sketch 002, variant **D**. Full markup (+ A equal-grid, B featured, C selector for
reference) in `sources/002-pillar-service-clarity/index.html`.
