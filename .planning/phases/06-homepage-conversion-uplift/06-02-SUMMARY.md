---
phase: 06-homepage-conversion-uplift
plan: 02
subsystem: ui
tags: [react, forms, lead-capture, whatsapp, zod, conversion]

requires:
  - phase: 05
    provides: OfferteForm, /api/lead secure route, leadSchema, submitLead, buildWhatsAppLeadUrl
provides:
  - "OfferteForm variant \"full\"|\"compact\" + optional controlled dienst/onDienstChange"
  - "COMPACT_LEAD_NAME sentinel on lib/whatsapp.ts (omits its Naam line)"
affects: [06-04 HomeHero]

tech-stack:
  added: []
  patterns:
    - "One form, two layouts — variant prop instead of a forked component (D-03)"
    - "Optional controlled/uncontrolled select binding via spread object (D-09)"
    - "Sentinel naam keeps a shared server schema valid for a low-friction form"

key-files:
  created: []
  modified:
    - components/OfferteForm.tsx
    - lib/whatsapp.ts

key-decisions:
  - "COMPACT_LEAD_NAME = \"Snelaanvraag\" (len 12, >= 2 for naam.min(2); owner-recognizable hero signal)"
  - "leadSchema NOT weakened — hidden sentinel naam + explicit condensed consent satisfy naam.min(2) + consent literal(true)"
  - "Honeypot renders in BOTH variants (route checks name=website); dienst select / submit / honeypot extracted as single shared definitions"
  - "Gate implemented as `if (variant === \"full\") return …` with compact as fallthrough — keeps full-mode markup byte-identical"

patterns-established:
  - "Backward-compatible component extension: new optional props default to prior behavior"

requirements-completed: [D-03, D-09]

duration: 12min
completed: 2026-07-01
---

# Phase 6 · Plan 02: Compact OfferteForm Summary

**Extended the Phase-5 OfferteForm into one form with two layouts — a low-friction `compact` hero variant (Postcode + Telefoon + Dienst + condensed consent) with an optional controlled dienst dropdown — without forking a component or weakening the shared `/api/lead` leadSchema.**

## Performance

- **Duration:** ~12 min
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `COMPACT_LEAD_NAME` ("Snelaanvraag", len 12) exported from `lib/whatsapp.ts`; `buildWhatsAppLeadUrl` now pushes the Naam line only for a real, non-sentinel name (real names unchanged, sentinel omitted)
- `OfferteForm` gains `variant`, `dienst`, `onDienstChange` props (all backward-compatible defaults)
- Compact mode renders 3 visible fields + condensed required AVG consent + hidden sentinel naam + honeypot, all posting through the same secure `/api/lead` route
- Dienst select is controlled only when `dienst !== undefined` — a post-mount pillar click can move it (D-09 enabler); otherwise the uncontrolled `defaultDienst` path is untouched

## Task Commits

1. **Task 1: COMPACT_LEAD_NAME sentinel + conditional Naam line** — `83466e8` (feat)
2. **Task 2: variant + controlled dienst + compact layout** — `96827fa` (feat)

## Files Created/Modified
- `lib/whatsapp.ts` — `COMPACT_LEAD_NAME` export; conditional Naam push
- `components/OfferteForm.tsx` — variant/controlled-dienst props; compact layout; shared select/submit/honeypot definitions

## Decisions Made
- Sentinel over an owner-block: resolved Open-Q1 in-plan so the phase isn't blocked; the sentinel is owner-recognizable and schema-valid.
- Kept full mode as the first `return` branch so its markup is provably unchanged; compact is the fallthrough.

## Deviations from Plan
None — plan executed as written. (Structured the variant gate as `if (variant === "full") return` with a compact fallthrough rather than inline per-field `variant === "full" &&` guards; same effect — naam/email/bericht are full-only — and keeps the existing full-form markup identical. Automated verify + guardrail greps all pass.)

## Issues Encountered
None. Both `npx tsx` pure-module asserts passed (`OK len=12`); guardrail grep clean (no raw material-symbols, no phantom sketch vars).

## User Setup Required
None — reuses the Phase-5 `/api/lead` route + `NEXT_PUBLIC_GHL_WEBHOOK_URL` already configured.

## Next Phase Readiness
- 06-04 HomeHero can render `<OfferteForm variant="compact" dienst={dienst} onDienstChange={setDienst} />` and pre-select a service from a pillar click.
- Full typecheck of the widened props verified at the Wave-2/3 Vercel preview build (E2E: hero compact submit → POST /api/lead 200 + WhatsApp opens).

---
*Phase: 06-homepage-conversion-uplift*
*Completed: 2026-07-01*
