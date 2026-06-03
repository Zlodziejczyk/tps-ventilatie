# Design Language — "Atmospheric Clarity, engineered"

The shared visual vocabulary behind all three homepage-uplift sketches. Agreed
direction: **Daikin-grade polish on the existing Atmospheric Clarity look** —
refined, engineered, light, trustworthy; conversion-forward; CWV-safe.

## Design Decisions

- **Palette = the real MD3 tokens** (do not invent new colors). Petrol/teal primary
  `#006580`, green accent `#006b42`, light `#f1fbfe` surfaces, near-black text
  `#141d1f` (never `#000`). Full set in `sources/themes/default.css`, mirrored from
  `app/globals.css`.
- **Type:** Plus Jakarta Sans (headlines, weight 800, tight tracking `-0.02em`),
  Inter (body). Big confident headline scale via `clamp()`.
- **Shadows are soft & cool-tinted** (teal-tinted, not neutral grey) — this is what
  reads "premium airy." See `--shadow-sm…xl` + `--shadow-glow`.
- **Glass** (`--glass-bg` + `backdrop-filter: blur(20px) saturate(1.2)`) for hero
  cards and the sticky bar.
- **Signature gradient** `linear-gradient(135deg,#006580,#257f9c)` for primary CTAs;
  `--gradient-ink` (dark petrol) for premium dark bands; `--gradient-airy` for
  section backgrounds.
- **The "engineered" motif** (what makes it feel Daikin, not generic): a subtle
  **blueprint grid texture**, a **top-accent line that reveals on hover**, and a
  **live "direct beschikbaar" pulse**. Applied to premium cards, the offerte form,
  and feature panels.
- **Motion = cheap and gated.** Fade-up entrances, hover lifts, a **pure-CSS aurora**
  (NOT WebGL) for "premium airy." Everything respects `prefers-reduced-motion`.

## CSS Patterns

**Top-accent reveal** (signals "engineered/interactive" on hover):
```css
.card { position: relative; overflow: hidden; }
.card::before {
  content:""; position:absolute; top:0; left:0; right:0; height:3px;
  background: var(--gradient-signature);
  transform: scaleX(0); transform-origin:left;
  transition: transform .35s var(--ease-clarity);
}
.card:hover::before, .card.active::before { transform: scaleX(1); }
```

**Blueprint grid texture** (the engineered backdrop on forms/panels):
```css
.engineered::before {
  content:""; position:absolute; inset:0; opacity:.55; pointer-events:none;
  background-image:
    linear-gradient(var(--color-surface-2) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-surface-2) 1px, transparent 1px);
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(circle at 88% 0%, #000, transparent 68%);
  mask-image: radial-gradient(circle at 88% 0%, #000, transparent 68%);
}
.engineered > * { position: relative; z-index: 1; }  /* keep content above grid */
```

**Live pulse** ("direct beschikbaar"):
```css
.live i { width:7px;height:7px;border-radius:50%;background:var(--color-accent);animation:pulse 2s infinite; }
@keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(0,107,66,.4);} 70%{box-shadow:0 0 0 8px rgba(0,107,66,0);} 100%{box-shadow:0 0 0 0 rgba(0,107,66,0);} }
```

**Pure-CSS aurora** (replaces the WebGL `SoftAurora` for CWV — drifting blurred
radial blobs in brand tints):
```css
.aurora{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
.aurora .blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.5;mix-blend-mode:multiply;}
.blob.b1{background:radial-gradient(circle at 30% 30%,#a8dff0,transparent 65%);animation:drift1 22s var(--ease-clarity) infinite alternate;}
/* b2 -> #b8e8d0 (mint), b3 -> #baeaff (light teal); see sources for full keyframes */
```

**Fade-up entrance** (the only entrance motion; staggered via `.d1…d4`):
```css
.fu{opacity:0;transform:translateY(16px);animation:fu .55s var(--ease-clarity) forwards;}
@keyframes fu{to{opacity:1;transform:none;}}
```

## HTML Structures

Shared atoms used across all sketches: `.badge` (accent-wash pill), `.btn` +
`.btn-primary|ghost|accent|light|sm|lg`, `.stars` (gold Material `star` icons),
`.trust-pill`. Icons are Material Symbols (matches the production `components/Icon.tsx`
wrapper). All copy is Dutch.

## What to Avoid

- **No `1px solid` section borders** — separate sections with tonal background shifts
  (`--color-bg` → `--color-bg-tint` → `--color-surface-2`).
- **No `#000000` text** — darkest is `--color-text` `#141d1f`.
- **No WebGL aurora / canvas particles on the service pages** (Phase-2 D-10, SEO-10
  mobile CWV). The CSS aurora above is the approved "premium airy" substitute. The
  WebGL `SoftAurora` stays home-only, and even there is a candidate to gate on mobile
  (Phase 5 QA-06).
- **No invented colors** — only MD3 tokens.

## Origin

Synthesized from sketches 001, 002, 003 (all winner **D**) + `themes/default.css`.
Full source: `sources/themes/default.css`, `sources/00*/index.html`.
