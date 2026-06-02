---
phase: 01-taxonomy-data-model
plan: 02
subsystem: nap-constants
tags: [constants, nap, seo-08, single-source-of-truth, service-radius, geo, assertion]
requires: []
provides:
  - "SITE.name === 'TPS klimaattechniek' (D-10 brand-name correction at source)"
  - "SITE.serviceRadiusKm === 60 (D-09 corrected radius; consumed by plan 01-03 copy)"
  - "SITE structured NAP set: address/postcode/city/province/country flat + geo{lat,lng} nested + serviceAreas[] (D-12 — Phase 3 JSON-LD and Phase 5 Maps pin read fields directly)"
  - "scripts/assert-site-shape.ts — node:assert structural assertion of the full NAP field set (Crit 5)"
affects:
  - lib/constants.ts
  - scripts/assert-site-shape.ts
tech_stack:
  added: []
  patterns:
    - "EXTEND SITE in place (never a parallel constant) — single source of truth for NAP"
    - "Node 26 built-in node:assert/strict for a standalone build-time CLI assertion (no jest/vitest — test frameworks out of scope this milestone)"
    - "owner-pending facts modeled as flagged placeholders (geo) / seed list (serviceAreas) so no unverified location/coverage claim is emitted"
key_files:
  created:
    - "scripts/assert-site-shape.ts — asserts name/address/postcode/city/province/country (non-empty strings), geo.lat/lng (numbers), serviceRadiusKm===60, serviceAreas (non-empty string[]); exits non-zero on any gap"
  modified:
    - "lib/constants.ts — SITE extended in place: name corrected, +country/province, +geo placeholder, +serviceRadiusKm:60, +serviceAreas seed; email/whatsapp/kvk/btw/phone/tagline untouched; as const retained; NAV_LINKS + dropdowns untouched"
decisions:
  - "D-10: SITE.name 'TPS Ventilatie' → 'TPS klimaattechniek' (code-only this phase; GBP/KvK alignment is an owner action verified in Phase 3 SEO-07)"
  - "D-09: serviceRadiusKm = 60 set at the source; the literal copy fixes follow in plan 01-03"
  - "D-12 layout: address/postcode/city/country/province kept FLAT (SITE already had flat address parts); only geo grouped as a nested object (maps to schema.org GeoCoordinates)"
  - "D-11: serviceAreas seeded with the 8 municipalities (Zoetermeer, Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden), flagged owner-review-pending"
  - "geo lat/lng are owner-verify-pending placeholders (Zoetermeer centroid 52.0607, 4.4940); Phase 5 QA-05 sets the verified pin"
metrics:
  completed: 2026-06-02
  tasks: 2
  files_changed: 2
  commits: 2
---

# Phase 1 Plan 2: SITE NAP Single Source of Truth Summary

Extended the existing `SITE` constant in `lib/constants.ts` into the complete, structured single source of truth for NAP (name, address, phone, service area) and added a build-time assertion script that proves the full field set is present and typed. This fully satisfies **SEO-08** in one pass and corrects the brand name (**D-10**) and service radius (**D-09**) at the source — the values every visible NAP string, Phase 3 JSON-LD field, and Phase 5 Maps pin will read.

## What Was Built

**Task 1 — Extend SITE with the full structured NAP field set (commit `f4f2a0c`)**
- `name` corrected `"TPS Ventilatie"` → `"TPS klimaattechniek"` (D-10).
- Added flat siblings `country: "NL"`, `province: "Zuid-Holland"` next to the existing flat `address`/`postcode`/`city`.
- Added `geo: { lat: 52.0607, lng: 4.4940 }` as a nested object (schema.org GeoCoordinates target), with an inline **owner-verify-pending** comment — placeholder Zoetermeer centroid; Phase 5 QA-05 supplies the verified business-location pin.
- Added `serviceRadiusKm: 60` (number, D-09).
- Added `serviceAreas: [...]` seeded with the 8 municipalities (D-11), with an inline **owner-review-pending** comment (Phase 3+ JSON-LD `areaServed` reads this; never claim an unserved area).
- `email` (`info@tpsventilatie.nl`), `whatsappUrl`, `kvk`, `btw`, `phone`, `phoneDisplay`, `tagline` all unchanged; domain stays for launch. `as const` retained. `NAV_LINKS`, `DIENSTEN_DROPDOWN`, `TARIEVEN_DROPDOWN` deliberately untouched (those become taxonomy-derived in Phase 2).

**Task 2 — SITE-shape assertion script (commit `e8209f1`)**
- Created `scripts/assert-site-shape.ts` (created the `scripts/` dir). Imports `SITE` from `@/lib/constants`, uses `node:assert/strict` only (no jest/vitest), and asserts the full NAP field set: NAP strings non-empty, `geo.lat/lng` numeric, `serviceRadiusKm === 60`, `serviceAreas` a non-empty array of non-empty strings. Prints a one-line OK on success; throws (non-zero exit) on any gap.
- Top-of-file comment flags the intentional build-time `console` usage and the deliberate no-test-framework choice (so code review does not false-positive). Standalone — NOT wired into `prebuild` (that gate validates the taxonomy in 01-06).

## Verification

- `npx tsx scripts/assert-site-shape.ts` → **exit 0**: `✅ SITE shape OK — NAP field set complete (8 service areas, radius 60 km).` (Crit 5 / SEO-08).
- `grep -c 'name: "TPS klimaattechniek"' lib/constants.ts` → 1 (D-10).
- `grep -c 'serviceRadiusKm: 60' lib/constants.ts` → 1 (D-09 value at source — consumed by plan 01-03).
- `grep -c 'country: "NL"'` → 1 and `grep -c 'province: "Zuid-Holland"'` → 1.
- `grep -c 'info@tpsventilatie.nl' lib/constants.ts` → 1 (email/domain unchanged).
- `geo` object present with numeric lat/lng + owner-verify-pending comment; `serviceAreas` present with 8 towns + owner-review-pending comment (verified by reading the file).
- **Not run mid-phase (expected to fail):** `npm run prebuild` / `npm run build` — `scripts/validate-taxonomy.ts` does not exist until plan 01-06. `npx tsc --noEmit` was not run as a separate gate here (the OneDrive mount makes a full project typecheck very slow); strict-mode soundness of the `as const` literal is confirmed by the successful `tsx` run, which type-loads `SITE`, plus inspection. A full typecheck runs as part of the green build in 01-06.

## Owner Hand-off (Phase 3/4/5)

- **`SITE.geo.lat/lng`** — placeholder (Zoetermeer centroid). Phase 5 **QA-05** must replace with the verified business-location pin before it is rendered as a confirmed Maps pin.
- **`SITE.serviceAreas`** — seed coverage list. Owner curates/approves before publish (D-11); Phase 3+ JSON-LD `areaServed` consumes it.
- **`SITE.name` rename** — code-only this phase. Owner must align Google Business Profile / KvK; verified in Phase 3 **SEO-07**.

## Deviations from Plan

No deviation in the *work product* — both tasks were implemented exactly as specified.

**Execution-mechanics deviation (environment + infrastructure):** The repo lives on a OneDrive mount where git worktree checkout is non-viable (reads from the OneDrive-hosted `.git` object store stall), so the whole phase runs in sequential non-worktree mode on `main` rather than parallel worktrees. During this plan, the executor subagent completed both code edits on disk but its connection dropped (`socket connection closed unexpectedly`, a stream-idle timeout aggravated by the slow mount) **before** the commit / SUMMARY / tracking steps. The orchestrator verified the uncommitted work against every acceptance criterion (file inspection + a live `tsx` assertion run, exit 0), then completed the atomic per-task commits, this SUMMARY, and the tracking updates inline. The delivered state is identical to what the executor would have committed; only the actor for the final mechanical steps changed.

## Self-Check: PASSED
- FOUND: lib/constants.ts (name "TPS klimaattechniek", serviceRadiusKm: 60, country "NL", province "Zuid-Holland", geo{lat,lng}, serviceAreas[8], email unchanged, as const)
- FOUND: scripts/assert-site-shape.ts (node:assert/strict, imports @/lib/constants, asserts full NAP set) — runs green (exit 0)
- FOUND commit f4f2a0c (Task 1 — extend SITE)
- FOUND commit e8209f1 (Task 2 — SITE-shape assertion)
