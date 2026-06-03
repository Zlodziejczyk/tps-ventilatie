# Sketch Manifest

## Design Direction

Homepage **conversion uplift** for TPS klimaattechniek — make the home page more
premium, professional, and "alive" while keeping the existing **"Atmospheric
Clarity"** DNA (teal `#006580` + green `#006b42`, light `#f1fbfe` surfaces, Plus
Jakarta Sans / Inter, glass + signature gradient). Agreed target: **Daikin-grade
polish on the current airy look** — refined, engineered, trustworthy,
product-forward; *not* dark/cinematic, *not* photography-dependent, motion kept
tasteful and **CWV-safe** (mobile INP < 200ms per SEO-10).

The uplift is **holistic** across four owner-chosen conversion levers — trust &
proof, speed-to-contact, 4-pillar service clarity (incl. the **net-new
Warmtepompen**), and visual wow. Variants explore different *weightings* of these
levers rather than dropping any. Reflects the broadened 4-pillar **klimaattechniek**
positioning (Airconditioning · Warmtepompen · WTW · Mechanische Ventilatie) and
fixes the off-brand English "Clean Air Technology" badge.

## Reference Points

- **Premium HVAC brand sites (Daikin / Mitsubishi Electric)** — clean, engineered,
  product-forward, reassuring. *Chosen reference world.*
- **Current TPS home page** (aurora + glass hero) — the baseline being elevated.
- **Atmospheric Clarity design system** — `app/globals.css` MD3 tokens (source of
  the sketch theme).

## Intake Decisions (2026-06-03)

- **Feel:** Elevate the current airy look (keep Atmospheric Clarity, push depth/polish).
- **Reference world:** Premium HVAC brand (Daikin/Mitsubishi).
- **Emphasis:** all four levers — trust & proof · speed-to-contact · 4-pillar clarity · visual wow.

## Sketches

| # | Name | Design Question | Winner | Tags |
|---|------|----------------|--------|------|
| 001 | homepage-hero | Premium, "alive" first impression that also routes + reassures? | **D** — Proof-forward, engineered | hero, conversion, layout |
| 002 | pillar-service-clarity | 4 climate pillars (incl. new Warmtepompen) scannable + premium? | **D** — Equal grid, engineered & branded | services, pillars, layout |
| 003 | trust-contact-band | Proof + frictionless contact, premium and ever-present? | **D** — Proof section + smart sticky bar | trust, conversion, contact |

## Notes

- All sketches are **throwaway HTML** (no build step) wired to real tokens + real
  `SITE` data from `lib/constants.ts`.
- **Placeholders flagged for Phase 4 (CONT-08):** Google review score/count, exact
  certifications (F-gassen/STEK, BRL, InstallQ) — shown as realistic stand-ins,
  owner-verified before any real build.
- Winning directions feed a future **"Homepage conversion uplift"** phase
  (`/gsd-phase` → `/gsd-sketch --wrap-up`).
