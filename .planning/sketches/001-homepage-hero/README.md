---
sketch: 001
name: homepage-hero
question: "What does a premium, 'alive' homepage hero that also routes and reassures feel like?"
winner: "D"
tags: [hero, conversion, layout]
---

# Sketch 001: Homepage Hero

## Design Question

The hero is the single highest-leverage surface for "premium / professional /
alive + conversion." It must, in one screen: make a premium first impression,
establish trust, route visitors to the 4 pillars (incl. the new **Warmtepompen**),
and offer a frictionless path to contact — all while staying CWV-safe (no WebGL
required; the aurora here is **pure CSS**).

## How to View

```
open .planning/sketches/001-homepage-hero/index.html
```

Switch variants with the dark bar at the top. Use the toolbar (bottom-right) to
preview phone / tablet / desktop widths (layout reflows via container queries).

## Variants

- **A — Elevated-Atmospheric** — The current look, clearly leveled up. Centered
  glass card on a soft CSS aurora, refined type scale, the signature rotating
  headline word **now including Warmtepompen**, inline Google rating, dual CTA
  (*Offerte aanvragen* + click-to-call), 4 pillar quick-chips, trust pills. Lowest
  risk, most on-brand. *Leans: visual wow + airy elevation.*
- **B — Engineered split (Daikin-style)** — Asymmetric two-column: confident
  headline + proof + CTAs on the left; a glass **"engineered panel"** on the right
  with a blueprint grid and an interactive 2×2 pillar selector that updates a live
  preview. Stat row (15+ jaar · 60 km · 4 pijlers · €0 voorrijkosten). *Leans:
  premium-brand + service clarity + routing.*
- **C — Proof-forward (conversion-dense)** — Review proof bar up top (avatars +
  4,9 ★ + quote), headline with gradient accent, an **inline mini-offerte form**
  (postcode + dienst → submit), USP pills, and the 4 pillars as a card row right in
  the hero. WhatsApp + Bel in the nav. *Leans: trust & proof + speed-to-contact.*
- **D — Proof-forward, engineered (synthesis C + B)** ✦ — C's conversion structure
  wearing B's Daikin craft: the **offerte form gets the engineered panel treatment**
  (blueprint texture + live "direct beschikbaar" pulse, now Postcode + Telefoon +
  Dienst), B's **stat row** (15+ jaar · 60 km · 4 pijlers · €0), pillar cards with a
  top-accent reveal, and more airiness. **New interaction:** clicking a pillar card
  **routes that service straight into the offerte form** (service clarity → contact).
  *Leans: all four levers, balanced — the intended winner.*

## What to Look For

- **D vs C** is the live decision. D = "C's conversion brain + B's premium body."
  Does the engineered craft make it read **Daikin-grade** without losing C's
  directness? The winner sets the tone for 002 & 003.
- A = wow/airy, B = engineered clarity, C = proof+contact density (kept for reference).
- **The aurora** is CSS, not WebGL — does the "premium airy" feel survive without
  the heavy effect? (This is the CWV-safe path.)
- **Warmtepompen** prominence — it's net-new; is it surfaced clearly enough?
- **The contact affordance** — is the inline form (C) worth the density, or is the
  dual-CTA (A/B) cleaner?
- **Type scale, glass depth, shadow warmth** — does it read "Daikin-grade"?
- Resize to **phone width** (toolbar 📱) — does each hero hold up on mobile?

## Notes / Placeholders

- Review score **4,9 / 50+** and "15+ jaar", certifications are realistic
  **stand-ins** — owner-verified in Phase 4 (CONT-08) before any real build.
- Icons use Material Symbols (matches the production `Icon` wrapper).
- All copy is Dutch; contact data matches `lib/constants.ts` `SITE`.
