---
name: sketch-findings-tps-ventilatie
description: Validated homepage-uplift design decisions, CSS patterns, and visual direction from the TPS klimaattechniek sketch sessions. Load when building or redesigning the home page (hero, 4-pillar section, trust/contact band) or when establishing the premium "Atmospheric Clarity, engineered" UI language for the real Next.js build.
---

<context>
## Project: TPS Ventilatie (TPS klimaattechniek)

Homepage **conversion uplift** — make the home page more premium, professional, and
"alive" while keeping the existing **Atmospheric Clarity** design system. Agreed
target: **Daikin-grade polish on the current airy look** — refined, engineered,
trustworthy, conversion-forward, and **CWV-safe** (mobile INP < 200ms per SEO-10).

Reference world: **premium HVAC brand sites (Daikin / Mitsubishi Electric)**.
Owner-chosen levers (all four): trust & proof · speed-to-contact · 4-pillar service
clarity (incl. the net-new **Warmtepompen**) · visual wow.

Sketch session wrapped: **2026-06-03**.
</context>

<design_direction>
## Overall Direction

Every one of the three sketches converged on the **same** winning instinct (variant
**D** each time): **lead with proof + a frictionless contact action, dressed in
engineered Daikin craft, with one tasteful interaction.** That convergence is the
design DNA for the homepage-uplift phase.

- **Palette/type/shape:** real MD3 tokens — teal `#006580` + green `#006b42`, light
  `#f1fbfe` surfaces, Plus Jakarta Sans / Inter, soft cool-tinted shadows, glass +
  signature gradient. (`sources/themes/default.css`, mirrors `app/globals.css`.)
- **Engineered motif:** blueprint-grid texture, top-accent hover reveal, live
  "direct beschikbaar" pulse — what makes it read *Daikin*, not generic.
- **Conversion unit:** an engineered inline **offerte form** (Postcode + Telefoon +
  Dienst); Bel + WhatsApp always one tap away; pillar cards route into the form.
- **Motion:** cheap & gated — fade-ups + a **pure-CSS aurora** (no WebGL), all
  reduced-motion aware. Protects the SEO-10 mobile-CWV launch criterion.
- **Positioning fixes:** Dutch chrome (killed "Clean Air Technology"), the 4th pillar
  **Warmtepompen** surfaced everywhere, real taxonomy sub-services + brand sets.
</design_direction>

<findings_index>
## Design Areas

| Area | Reference | Key Decision |
|------|-----------|--------------|
| Design language | references/design-language.md | "Atmospheric Clarity, engineered" — tokens, blueprint/accent/pulse motif, CSS aurora, no-WebGL/no-1px-border/no-#000 rules |
| Hero & conversion | references/hero-and-conversion.md | Proof-forward hero + engineered offerte form; pillar cards route service into the form |
| Service pillars | references/service-pillars.md | Equal scannable 4-pillar grid (nothing hidden) + brand-logo chips + click-to-expand |
| Trust & contact | references/trust-and-contact.md | Proof section + smart site-wide sticky contact bar (scroll-in, dismissible, body-level) |

## Theme

The winning theme file is at `sources/themes/default.css` (the real TPS palette as
CSS variables). Mirrors `app/globals.css` — keep them in sync.

## Source Files

Original sketch HTML (winning variant marked **★ Gekozen**, all alternatives
preserved) in `sources/`:
- `sources/001-homepage-hero/index.html`
- `sources/002-pillar-service-clarity/index.html`
- `sources/003-trust-contact-band/index.html`

## ⚠ Carry-forward before building

- **Owner-verify** (STATE.md blockers): real Google score/count, authorized-dealer
  status + official brand logos, exact certifications (F-gassen/STEK/InstallQ), ISDE
  figures. Sketches use clearly-flagged placeholders.
- **Phase-5 coordination:** the sticky contact bar overlaps Phase 5's scoped floating
  WhatsApp affordance — build ONE shared bar (see trust-and-contact.md).
- **Production form** posts via the Phase-5 secure server route, not the client
  webhook; respect `lib/constants.ts` `SITE` + the `Icon` wrapper.
</findings_index>

<metadata>
## Processed Sketches

- 001-homepage-hero (winner D)
- 002-pillar-service-clarity (winner D)
- 003-trust-contact-band (winner D)
</metadata>
