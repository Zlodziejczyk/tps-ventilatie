---
status: partial
phase: 01-taxonomy-data-model
source: [01-VERIFICATION.md]
started: 2026-06-02T17:34:41Z
updated: 2026-06-02T17:34:41Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. WhyTPSSection h2 brand-name copy (out-of-phase-1 scope — confirm tracking)
expected: The h2 in app/page-sections/WhyTPSSection.tsx intentionally still reads "TPS Ventilatie"; Phase 1 corrected only SITE.name. Visible-copy brand propagation is a later content phase. Confirm it is tracked, not a gap.
result: [pending]

### 2. Owner review: SITE.serviceAreas seed list
expected: Owner confirms or corrects the 8 seed municipalities (Zoetermeer, Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden) before Phase 3 JSON-LD areaServed consumes them.
result: [pending]

### 3. Owner/Phase 5: real geo coordinates for SITE.geo
expected: Replace the Zoetermeer-centroid placeholder { lat: 52.0607, lng: 4.4940 } with the verified business-location lat/lng before Phase 5 QA-05 (Maps pin + JSON-LD geo).
result: [pending]

### 4. Owner/SEO: validate [ASSUMED] keyword strings before Phase 4
expected: Run the 27-node keyword map through Google Keyword Planner / Ahrefs and commit any adjustments before Phase 4 locks content.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
