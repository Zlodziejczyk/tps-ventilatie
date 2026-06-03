# Trust & Contact Patterns

From **Sketch 003 → Variant D ("Proof section + smart sticky bar")**. Composes the
two remaining levers — trust & proof, speed-to-contact — into a premium, ever-present
pattern below the hero.

## Design Decisions

- **A dedicated proof section:** big `4,9` score with a CSS Google "G" mark + count,
  **3 review cards** (stars, quote, avatar + name + plaats + "via Google"), a
  **keurmerken strip** (F-gassen, STEK, InstallQ, KvK), and **USP pills** (Geen
  voorrijkosten · Reactie binnen 1 werkdag · Gecertificeerd & verzekerd).
- **★ Smart site-wide sticky contact bar** — the production-shaped behaviour:
  - **Appears on scroll** (~200px past the top) so it never competes with the hero's
    own offerte CTA.
  - **Dismissible** (×) — users who don't want it can clear it.
  - **Mobile-safe** — `padding-bottom: max(12px, env(safe-area-inset-bottom))`,
    compact/stacked under 560px.
  - **Window-fixed** — must live at **body / layout level**, NOT inside a
    `transform`/`filter`/`container-type` ancestor (see What to Avoid).
  - Contents: Bel · WhatsApp · Offerte.
- Variant A (unified dark band) and C (inline second offerte form) are preserved for
  reference; D won because it pairs the strongest proof block with the realistic
  always-available contact pattern.

## CSS Patterns

**Sticky contact bar** (transform-based show/hide; lives at body level):
```css
.cbar{position:fixed;left:0;right:0;bottom:0;z-index:9990;transform:translateY(125%);transition:transform .45s var(--ease-spring);}
.cbar.show{transform:none;}
.cbar .inner{background:var(--glass-strong);backdrop-filter:var(--glass-blur);box-shadow:0 -8px 32px rgba(0,101,128,.14);padding:12px clamp(16px,4vw,40px);padding-bottom:max(12px,env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:space-between;gap:16px;}
@media (max-width:560px){ .cbar .inner{flex-direction:column;gap:10px;align-items:stretch;} .cbar .acts{width:100%;} .cbar .acts .btn{flex:1;} }
```
```js
function updateBar(){ bar.classList.toggle('show', window.scrollY > 200 && !dismissed); }
window.addEventListener('scroll', updateBar, { passive: true });
```

**CSS Google "G" mark** (no image):
```css
.gmark .g{width:16px;height:16px;border-radius:50%;background:conic-gradient(from -45deg,#ea4335 0 25%,#fbbc05 0 50%,#34a853 0 75%,#4285f4 0);-webkit-mask:radial-gradient(circle 4px at center,transparent 96%,#000);mask:radial-gradient(circle 4px at center,transparent 96%,#000);}
```

Review card `.rev` and cert chip `.cert` are simple surface cards with `--shadow-sm`
+ hover lift; see source.

## HTML Structures

Proof section: `.proofhead` (badge + h2 + `.score`) → `.revgrid` (3 `.rev` cards) →
`.certstrip` (`.cert` chips) → `.uspstrip` (`.trust-pill`s). Bar markup is `.cbar >
.inner > (.msg + .acts)` with a `.close` button.

## What to Avoid

- **The container-trap (learned the hard way):** a `position:fixed` bar nested inside
  an ancestor with `container-type`, `transform`, `filter`, or `will-change` is
  positioned relative to **that ancestor**, not the viewport — so it won't actually
  stick. Render the bar at **body / `app/layout.tsx`** level.
- **Don't show the bar immediately** over the hero — wait until scrolled past it, and
  make it dismissible + reduced-motion-aware.
- **Reviews & keurmerken are placeholders.** Real reviews + Google score/count/link
  come from one consolidated source in **Phase 4 (CONT-08)**; certifications
  (F-gassen/STEK/InstallQ) are owner-verified (STATE.md blocker). KvK `73722650` is
  real (`lib/constants.ts`).

## ⚠ Phase-5 coordination (important)

A site-wide sticky contact bar is **layout-level** and **overlaps Phase 5's scoped
"floating WhatsApp affordance" (QA-04 / LEAD-04)**. Build **ONE** shared bar, not two.
When the homepage-uplift phase and Phase 5 are both planned, reconcile this component
so the page doesn't ship two competing always-on contact elements.

## Origin

Sketch 003, variant **D**. Full markup (+ A unified band, B always-on bar, C inline
form for reference) in `sources/003-trust-contact-band/index.html`.
