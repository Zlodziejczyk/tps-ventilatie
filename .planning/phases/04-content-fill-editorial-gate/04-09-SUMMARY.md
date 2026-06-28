# 04-09 — Map intake returns → gated slots (SUMMARY)

**Status:** Task 1 COMPLETE (2026-06-28). Tasks 2-3 PENDING owner Vercel-preview sign-off.
**Plan:** `.planning/phases/04-content-fill-editorial-gate/04-09-PLAN.md`
**Intake source:** Tally form `2EojAA`, submission `0VvLaDZ` (completed 2026-06-28).

## Task 1 — intake mapped to gated slots ✅

Owner-returned data (with Pushly editorial sign-off where the proof-upload was waived) mapped into code:

| Intake § | Destination | Change |
|---|---|---|
| §1 BTW | `SITE.btw` | → `NL859640929B01` (owner correction; was a placeholder) |
| §1 legal name | `SITE.legalName` + JSON-LD `legalName` | added `"TPS services"` (display/brand stays "TPS klimaattechniek", D-01) |
| §1 slogan | `SITE.tagline` | → "Specialist in gezond binnenklimaat" |
| §2 hours | `SITE.openingHours` + JSON-LD `OpeningHoursSpecification` + contact page card | added Ma–za 08:00–17:30 (+ op afspraak + storingsdienst) |
| §3 radius/areas | `SITE` (already correct) | confirmed 60 km + 8 areas (no change) |
| §4 pricing | tarieven | confirmed correct (no change) |
| §5 brands/dealer | `brands.ts` `erkendInstallateur` + `BrandGrid` | all 4 → `true`; verified "Erkend installateur" badge now renders. D-12 upload waived by owner (physical certs on-site). |
| §6 certs | over-ons USP + `assert-no-forbidden-claims.ts` | "Vakkundig" → "Gecertificeerd" + BRL 100/200; gate patterns lifted. **Certs FINALIZED — F-gassen/STEK chase dropped.** |
| §7 story | `app/over-ons/page.tsx` prose | rewritten as a company description (sinds 2009, 17 jr ervaring, 4 specialisaties, toonaangevende merken) |
| §8 reviews | `lib/reviews.ts` `REVIEW_RATING` | `{ 4.9, 34, GBP }` from real Google data (kgmid /g/11h07d_z1t) → `aggregateRating` JSON-LD + on-page stars now active |
| §10 notify | (Phase 5) | aanvragen via e-mail → `info@tpsventilatie.nl`; reactie ~24u |

**Files modified:** `lib/constants.ts`, `lib/reviews.ts`, `lib/services/brands.ts`, `components/BrandGrid.tsx`, `app/over-ons/page.tsx`, `app/contact/page.tsx`, `lib/seo/jsonld.tsx`, `scripts/assert-no-forbidden-claims.ts`, `scripts/assert-site-shape.ts`.

## Still pending from owner (do NOT block a partial launch — D-08)
- Instagram + Facebook URLs → footer + JSON-LD `sameAs` (currently omitted).
- Project + portrait photos → over-ons / service pages / WhyTPSSection.
- Logo: PNG received (1369×1149, in scratchpad) — header/footer/OG placement deferred to a visual pass.
- Domain `tpsklimaattechniek.nl`: owner does not yet own it → v2 migration (DOM-V2-01); NOT a launch blocker (launch stays on apex `tpsventilatie.nl`).

## Task 2 — whole-site owner preview sign-off (BLOCKING, pending)
Next action: deploy a Vercel preview, send Thomas the preview URL + the 21-page list (4 pillars + 17 subs via `urlFor`), collect "approved: <set>" / "revise: <notes>".

## Task 3 — batch-flip review→published + update assert-seo (pending Task 2)
Not started — waits on sign-off. The status-flip commit is the D-06 audit trail.

## Build note
Not built locally (OneDrive deadlocks `tsx`/Next per plan) — validate on Vercel CI: prebuild Zod gate + `assert-no-forbidden-claims`. `aggregateRating` + `OpeningHoursSpecification` are now active in the sitewide HVACBusiness JSON-LD.
