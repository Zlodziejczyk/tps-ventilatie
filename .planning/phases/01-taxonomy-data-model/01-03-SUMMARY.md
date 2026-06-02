---
phase: 01-taxonomy-data-model
plan: 03
subsystem: nap-constants
tags: [service-radius, qa-03, single-source-of-truth, copy, site-consumers]
requires:
  - "lib/constants.ts SITE.serviceRadiusKm (from plan 01-02)"
provides:
  - "app/tarieven/page.tsx radius copy sourced from SITE.serviceRadiusKm (1 occurrence)"
  - "components/PricingTabs.tsx radius copy sourced from SITE.serviceRadiusKm (both info banners)"
  - "Crit 4 satisfied: no 50km/100km literal remains anywhere in app/ or components/"
affects:
  - app/tarieven/page.tsx
  - components/PricingTabs.tsx
tech_stack:
  added: []
  patterns:
    - "Visible copy derives the radius from the single SITE constant via {SITE.serviceRadiusKm} interpolation — never re-hardcode the number"
    - "SITE is a plain module constant, safe to import into a \"use client\" component (PricingTabs)"
key_files:
  created: []
  modified:
    - "app/tarieven/page.tsx — added import { SITE } from \"@/lib/constants\"; line-62 disclaimer now reads 'tot {SITE.serviceRadiusKm} km vanuit Zoetermeer'"
    - "components/PricingTabs.tsx — added SITE import; both identical info-banner strings now read 'Werkgebied: tot {SITE.serviceRadiusKm} km vanuit Zoetermeer'; pricing data arrays untouched"
decisions:
  - "D-09 phrasing: owner's exact wording 'tot 60 km vanuit Zoetermeer' rendered via interpolation (radius value lives once in SITE)"
  - "app/over-ons/page.tsx intentionally NOT touched — it has regio prose but no numeric radius literal, so it is outside the Crit-4 grep target (town-list editorial is Phase 4)"
metrics:
  completed: 2026-06-02
  tasks: 2
  files_changed: 2
  commits: 2
---

# Phase 1 Plan 3: Service-Radius Single-Source Consumers Summary

Replaced the contradictory hardcoded radius literals at their three consuming sites with copy derived from `SITE.serviceRadiusKm` (set to 60 in plan 01-02). This closes **QA-03** and **success criterion 4** — the 50-vs-100 km inconsistency can no longer exist or drift, because the radius now lives once in `SITE` and the visible copy is derived.

## What Was Built

**Task 1 — app/tarieven/page.tsx (commit `ed7d557`)**
- Added `import { SITE } from "@/lib/constants";` in the `@/lib` import position (after next/react, before `@/components`).
- Line-62 disclaimer changed from `"...in een straal van 50km rondom onze hoofdlocatie..."` to `"Wij zijn werkzaam tot {SITE.serviceRadiusKm} km vanuit Zoetermeer. Buiten deze regio geldt een kleine toeslag."` — the `50km` literal is entirely gone; the `60` is interpolated, not re-hardcoded.

**Task 2 — components/PricingTabs.tsx (commit `bd04f1d`)**
- Added `import { SITE } from "@/lib/constants";` (safe in a `"use client"` component — plain module constant, no server-only code).
- Both identical info-banner strings (the WTW-tab banner and the MV-tab banner) changed from `"...Werkgebied: straal van 100 km vanuit Zoetermeer."` to `"...Werkgebied: tot {SITE.serviceRadiusKm} km vanuit Zoetermeer."` — both `100 km` literals gone (a single replace covered both since they were identical).
- Pricing data arrays (`WTW_UNITS`, `MV_ONDERHOUD`, etc.) and the `<Icon name="info" />` banner markup left untouched.

## Verification

- **Crit 4 (phase-wide):** `grep -rn "straal van 50\|straal van 100\|100 km\|50km" app components` → **EMPTY** (no stale radius literal anywhere in app/ or components/).
- `grep -c "SITE.serviceRadiusKm" app/tarieven/page.tsx` → 1.
- `grep -c "SITE.serviceRadiusKm" components/PricingTabs.tsx` → 2 (both banners).
- `grep -c 'import { SITE } from "@/lib/constants"'` → 1 in each file.
- Visible copy renders the owner's phrasing "tot 60 km vanuit Zoetermeer" (60 supplied by SITE).
- Full `npm run build` / `tsc` not run here (expected to fail until 01-06 creates the validator, and slow on the OneDrive mount); the changes are import + JSX-interpolation only and are type-trivial against the existing typed `SITE`.

## Deviations from Plan

None in the work product — both tasks implemented exactly as specified.

**Execution mechanics:** executed inline by the orchestrator (not via a subagent). This phase runs in sequential non-worktree mode on `main`, and after the 01-02 executor subagent suffered a connection drop on this OneDrive mount (~2 min per tool call → stream-idle timeout), the orchestrator switched to inline execution for reliability. Same artifacts (atomic per-task commits, SUMMARY, tracking); only the actor changed.

## Self-Check: PASSED
- FOUND: app/tarieven/page.tsx (SITE import + {SITE.serviceRadiusKm} interpolation; no 50km literal)
- FOUND: components/PricingTabs.tsx (SITE import + 2× {SITE.serviceRadiusKm}; no 100 km literal)
- VERIFIED: Crit-4 phase-wide grep empty
- FOUND commit ed7d557 (Task 1 — tarieven)
- FOUND commit bd04f1d (Task 2 — PricingTabs, both banners)
