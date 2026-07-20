---
quick_id: 260720-rgj
status: complete
completed: 2026-07-20
commits:
  - 8aaa629 (sketch 004 — 4 treatment variants)
  - 5c22751 (consent confirmed in THOMAS-REVIEW)
  - 5ba3195 (photo treatment implementation)
---

# Summary — Photo treatment synthesis (sketch 004 winner)

Owner delegated the treatment pick. Decision + implementation:

- **A (base):** `.photo-grade` calm petrol grade (saturate .78 / contrast .93 /
  brightness 1.07) + `.photo-frame::after` 7% petrol color-blend on ALL project
  photos — tames red brick / warm oak toward the light palette. Pure CSS.
- **C (strip only):** `.photo-duo` petrol duotone at rest, true color reveal on
  hover/focus — inside `@media (hover:hover)` so touch devices get the calm
  grade instead of hidden color. The site's "one tasteful interaction".
- **D (labels):** 15 technical chips ("Toshiba · zolder") on /projecten case
  photos via optional `ProjectPhoto.label`.

Reduced-motion kills the transitions. Zero JS, zero CWV impact.

**Verified on preview:** grade + labels render on /projecten (chip zoom-checked:
white/85 pill, dark petrol text); strip renders unified duotone; hover/focus
reveal rule confirmed present in served CSS inside (hover:hover) — synthetic
hover can't repaint an occluded window, mechanic is plain CSS `:hover`.

Sketch 004 winner recorded (README + MANIFEST): "Synthese A + C(strip) + D(labels)".
Consent gate cleared 2026-07-20 (owner: all supplied job photos have customer
consent). Open: shot-list for Thomas (WTW, finished monoblock, team/bus, video).
