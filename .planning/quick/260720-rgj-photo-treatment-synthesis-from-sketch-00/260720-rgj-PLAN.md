---
quick_id: 260720-rgj
slug: photo-treatment-synthesis-from-sketch-00
created: 2026-07-20
status: complete
mode: quick
execution: inline (OneDrive constraint)
must_haves:
  truths:
    - "All project photos share one calm petrol grade (sketch 004 variant A)"
    - "RecentWorkStrip thumbs are petrol duotone at rest with color reveal on hover — hover-capable devices only; touch gets the grade (variant C)"
    - "Case photos on /projecten carry small technical labels (variant D), reduced-motion safe"
  artifacts:
    - app/globals.css photo-grade/photo-frame/photo-duo classes
    - lib/projects.ts photo labels
    - components/ProjectCase.tsx + RecentWorkStrip.tsx wired
  key_links:
    - .planning/sketches/004-projecten-photo-treatment/ (winner = synthesis A+C+D, owner delegated 2026-07-20)
---

# Quick Task 260720-rgj: Photo treatment synthesis (sketch 004 winner)

Owner delegated the pick ("your call"). Decision: **A base + C strip + D labels**
— calm grade everywhere (honest, CWV-free), one tasteful interaction on the
strip only, engineered labels on the showcase page.

## Task 1 — CSS + components + data
- globals.css (bare-classes section, .aurora style): `.photo-grade` (saturate .78,
  contrast .93, brightness 1.07), `.photo-frame::after` petrol color-blend 7%,
  `.photo-duo` duotone-at-rest + hover/focus reveal inside `@media (hover:hover)`,
  transitions killed under prefers-reduced-motion.
- lib/projects.ts: optional `label` on ProjectPhoto + labels for the 7 cases.
- ProjectCase: photo-frame + photo-grade + label chip. RecentWorkStrip: + photo-duo.
- Sketch 004 README/MANIFEST: winner = "Synthese A + C(strip) + D(labels)".
**done:** commit `feat(projecten): unified photo treatment — calm grade + strip duotone + labels`

## Task 2 — Ship gate
Push → Vercel preview → screenshot audit (/projecten + airco strip, incl. hover
reveal via localhost check) → SUMMARY + STATE row.
