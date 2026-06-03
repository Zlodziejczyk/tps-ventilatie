---
sketch: 003
name: trust-contact-band
question: "How do proof + frictionless contact compose into something premium and ever-present?"
winner: "D"
tags: [trust, conversion, contact]
---

# Sketch 003: Trust & Speed-to-Contact Band

## Design Question

Two of the four prioritized levers — **trust & proof** and **speed-to-contact** —
need a home below the hero: a place that reassures (Google score, reviews,
keurmerken) and makes reaching out effortless (offerte / bellen / WhatsApp). The
question is how to compose them so it feels **premium and ever-present**, not like a
bolted-on footer CTA.

Carries forward the engineered Daikin craft + the offerte form from the hero (001 → D).

## How to View

```
open .planning/sketches/003-trust-contact-band/index.html
```

## Variants

- **A — Unified trust + CTA band** — One cohesive dark **engineered band**: proof on
  the left (4,9 score, a review quote, cert chips), the conversion ask on the right
  (heading + Offerte / Bel / WhatsApp). Proof and action in a single premium block —
  reads like a closing CTA with credibility baked in. *Compact, high-impact, one
  placement.*
- **B — Proof section + sticky action bar** — A richer **proof section** (Google
  score, 3 review cards, keurmerken strip, USP pills) **plus a sticky bottom action
  bar** that stays in view as you scroll (Bel / WhatsApp / Offerte). "Ever-present"
  made literal. *Scroll the page to feel the bar follow you.* *Best for maximum proof
  depth + always-available contact.*
- **C — Inline offerte conversion band** — The hero's **engineered offerte form** as
  a mid/bottom-page conversion band, wrapped in trust: score, two short quotes, cert
  chips, USPs, plus a Bel/WhatsApp fallback under the form. *Best when the goal is to
  actually capture the lead inline a second time, with proof right beside it.*
- **D — Proof section + SMART sticky bar (B, production-shaped)** ✦ — B's proof
  section + the sticky contact bar **the way it would actually ship**: it stays
  hidden until you **scroll past a stand-in hero** (so it never competes with the
  hero's own CTA), is **dismissible** (×), mobile-tuned (safe-area, compact), and is
  correctly **window-fixed** (bars moved outside the preview frame — the container
  query was pinning them to the frame, not the window). Scroll the faux hero to feel
  it slide in. *The intended winner — B's substance, real-world behaviour.*

## What to Look For

- **Variant D is the proposed direction** — scroll the faux hero to watch the bar
  slide in, then hit × to dismiss it. This is how the real site-wide bar behaves.
- **Composition:** A fuses proof+CTA in one band; B/D separate them (section + sticky
  bar); C centers everything on the inline form. Which feels most premium *and* most
  likely to get the click?
- **The sticky bar (B vs D):** B shows it immediately; D waits until past the hero.
  D's "appears on scroll, dismissible" is the recommended real-world behaviour.

## Production / Phase-5 coordination

- A site-wide sticky contact bar is **layout-level** (`app/layout.tsx`), present on
  every page — not part of this section. It **overlaps Phase 5's scoped "floating
  WhatsApp affordance" (QA-04 / LEAD-04)**: build ONE shared bar, not two.
- Must appear after the hero, respect `prefers-reduced-motion` + iOS safe-area, and
  be dismissible. CWV cost is negligible (unlike the WebGL aurora).
- **Repetition check:** the hero (001-D) already has an inline offerte form. Does C
  repeat it too much, or is a second capture point good practice? Does A/B's
  *different* treatment lower-page work better as a pair with the hero?
- **Phone width** (📱): A stacks, B's bar goes vertical, C stacks form under trust.

## Notes / Placeholders

- **Reviews are realistic placeholders** (names, quotes, places) — real reviews +
  Google score/count/link land in Phase 4 (CONT-08) from one consolidated source.
- **Keurmerken (F-gassen/STEK/InstallQ) are placeholders** — owner-verified before
  shipping (flagged STATE.md blocker on exact certifications). KvK 73722650 is real
  (`lib/constants.ts`).
- The Google "G" mark is a CSS approximation; real Google review widget/branding per
  Google's brand guidelines at build time.
