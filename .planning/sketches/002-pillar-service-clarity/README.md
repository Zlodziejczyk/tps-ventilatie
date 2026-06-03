---
sketch: 002
name: pillar-service-clarity
question: "How do the 4 climate pillars (incl. the new Warmtepompen) read as instantly scannable AND premium-engineered?"
winner: "D"
tags: [services, pillars, layout]
---

# Sketch 002: 4-Pillar Service Clarity

## Design Question

The home page must let a visitor grasp TPS's **four vakgebieden** in seconds —
Airconditioning, **Warmtepompen** (net-new), WTW, Mechanische ventilatie — and
self-route into the right one. The challenge: make it *instantly scannable* while
keeping the **premium-engineered** feel established by the hero (Sketch 001 → D).

Carries forward D's craft: engineered card treatment (top-accent reveal, blueprint
texture), real taxonomy data, and the interactive "alive" feel.

## How to View

```
open .planning/sketches/002-pillar-service-clarity/index.html
```

Real sub-service names are pulled from `lib/services/*.ts` (17 services total).

## Variants

- **A — Equal refined grid** — 4 equal premium cards (icon, pillar, one-liner, the
  real sub-services as chips, brand line for Airco/WP, "Bekijk" link). Balanced,
  democratic, maximally scannable. Warmtepompen carries a *Nieuw* tag but no extra
  weight. *Best when all 4 pillars are equally important.*
- **B — Featured Warmtepompen + 3** — Asymmetric: Warmtepompen as a large dark
  **engineered feature card** (ISDE-subsidie highlight, brands, CTA), the other 3 as
  compact mini-cards beside it. Pushes the new, high-value pillar hard. *Best for
  driving the warmtepomp opportunity (ISDE momentum).*
- **C — Interactive selector** — A pillar rail (left) + a large **engineered detail
  panel** (right) that updates on click: description, brands, the full sub-service
  grid, and a CTA. The most "alive" / Daikin-configurator feel; extends the hero's
  interactivity. *Best for depth + engagement, one pillar in focus at a time.*
- **D — Equal grid, engineered & branded (synthesis A + C + logos)** ✦ — A's
  all-visible scannable grid + two upgrades: **per-pillar brand logo chips**
  (grayscale → brand-color on hover) and a **click-to-expand** "Details & offerte"
  drawer (USPs + CTAs) — interaction without hiding any pillar. *The intended
  direction: scannability of A, liveliness of C, plus the premium brand-logo signal.*

## What to Look For

- **Variant D is the proposed direction** (A's grid + logos + click-to-expand).
  Click a card's "Details & offerte"; hover the brand chips to see them colorize.
- **Scannability vs. focus:** A/D treat all 4 equally; B & C spotlight one. Does
  Warmtepompen need the extra push (B), or is parity (A/D) cleaner?
- **Does it feel "engineered/premium"** like the hero, or just a card grid?
- **The sub-services** — useful inline (shows depth + SEO internal links), or noise?
- **Interaction (C):** click through the pillars — does the configurator feel worth
  the click, or do you prefer everything visible at once (A/B)?
- **Phone width** (toolbar 📱): A → 1 column, B → stacked, C → rail becomes a
  horizontal scroller above the panel.

## Notes / Placeholders

- **ISDE "tot € 2.700"** in Variant B is an illustrative stand-in — real subsidy
  figures are owner-verified/sourced in Phase 4 (CONT-04). WTW/MV also qualify from
  2026 (per roadmap) — not claimed here to keep the sketch honest.
- Sub-service names + brand sets are the **real taxonomy** (`lib/services/`).
- **Brand logos (Variant D) are placeholder lockups, not official assets.** Real
  manufacturer logos require: (1) owner confirmation of **authorized-dealer status**
  (a flagged STATE.md blocker for Daikin/Mitsubishi), (2) official brand-kit SVGs,
  (3) trademark/usage rights. The WTW/MV brand names (Itho, Brink, Zehnder, Vasco,
  Orcon) are **illustrative** — owner confirms which brands TPS actually services.
- Brand display order/claims (incl. dealer status) owner-verified in Phase 4.
