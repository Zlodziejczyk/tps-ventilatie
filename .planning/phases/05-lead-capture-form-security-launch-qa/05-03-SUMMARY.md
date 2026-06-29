---
phase: 05-lead-capture-form-security-launch-qa
plan: 03
subsystem: ui
tags: [form, lead-capture, consent, honeypot, fail-safe, avg, taxonomy, react]

requires:
  - phase: 05-02
    provides: the secure /api/lead route + shared leadSchema field contract
  - phase: 05-01
    provides: server-only secret (so the client form holds none)
provides:
  - "components/OfferteForm.tsx — reusable D-05 form (dienst dropdown from pillars(), AVG consent, reassurance, honeypot, fail-safe error UI), defaultDienst prop for context-prefill"
  - "lib/forms.ts — thin submitLead(/api/lead) client caller, no secret"
  - "Contact page swapped to <OfferteForm/>; ContactForm.tsx removed"
  - "GoHighLevel named as AVG verwerker in the privacy policy (LEAD-06)"
affects: [05-06, 06-homepage-conversion-uplift]

tech-stack:
  added: []
  patterns:
    - "Reusable form with a defaultDienst prop (context-prefill without useSearchParams — host pages stay SSG)"
    - "Fail-safe submit: visible error state with Bel + WhatsApp + retry (never a silent sending hang)"
    - "Client form mirrors the server leadSchema field names; consent sent as a boolean"

key-files:
  created: [components/OfferteForm.tsx]
  modified: [lib/forms.ts, app/contact/page.tsx, app/privacy-beleid/page.tsx]

key-decisions:
  - "submitLead typed Record<string, unknown> (not the plan/RESEARCH Record<string, string>) — consent must serialize to JSON boolean true to satisfy the server's z.literal(true); a string would fail validation"
  - "Consent enforced client-side via a required checkbox + server-side via the schema; read as fd.has('consent') -> boolean"
  - "dienst dropdown derived from pillars() (4 pillar navTitles) + 'Anders / weet ik nog niet' — no hardcoded parallel list"
  - "Error affordance kept inline (form stays mounted) so a retry preserves the user's input"

patterns-established:
  - "OfferteForm is THE lead form; service pages and the Phase-6 homepage embed it with defaultDienst and post via the same secure route"

requirements-completed: [LEAD-01, LEAD-05, LEAD-06, QA-04]

duration: ~18 min
completed: 2026-06-29
---

# Phase 5 Plan 03: Reusable OfferteForm + Fail-Safe Lead Capture Summary

**A reusable, phone-first <OfferteForm> (taxonomy dienst dropdown, AVG consent, honeypot, reassurance) that posts through the secure /api/lead route and fails safely with a visible Bel/WhatsApp/retry affordance — replacing ContactForm, with GoHighLevel named as the AVG processor.**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-06-29
- **Completed:** 2026-06-29
- **Tasks:** 3
- **Files modified:** 4 (1 created, 2 modified, 1 deleted)

## Accomplishments
- `lib/forms.ts`: gutted to a thin `submitLead` that POSTs to `/api/lead` (same-origin), returns `{ ok: res.ok }`, and resolves `{ ok: false }` on network rejection — the D-07 fail-safe seam. No `NEXT_PUBLIC_` secret, no direct GHL fetch, no dev console.log.
- `components/OfferteForm.tsx`: `"use client"` form with the D-05 field set (naam/telefoon/postcode/dienst required; email + bericht optional), a `pillars()`-derived `dienst` dropdown + "Anders / weet ik nog niet", a required AVG consent checkbox linking `/privacy-beleid`, reassurance copy (gratis · vrijblijvend · reactie binnen 24 uur), a visually-hidden `website` honeypot, and a `defaultDienst` prefill prop. On a failed submit it shows a visible error block with one-tap **Bel**, **WhatsApp**, and **Opnieuw proberen** — never stuck on "sending".
- Contact page now renders `<OfferteForm />`; `ContactForm.tsx` deleted (no dead code; zero remaining references).
- Privacy policy gained a "Verwerkers — contactformulier" section naming **GoHighLevel** as the processor of form submissions (LEAD-06).

## Task Commits

1. **Task 1: Thin lib/forms.ts → submitLead** - `76a1bdf` (feat)
2. **Task 2: OfferteForm + remove ContactForm** - (OfferteForm commit) (feat)
3. **Task 3: Contact swap + GoHighLevel AVG processor** - `32cb524` (feat)

## Files Created/Modified
- `components/OfferteForm.tsx` - The reusable, fail-safe lead form
- `lib/forms.ts` - Thin secure-route caller (no secret)
- `app/contact/page.tsx` - Renders `<OfferteForm />`
- `app/privacy-beleid/page.tsx` - GoHighLevel named as AVG verwerker
- `components/ContactForm.tsx` - Removed (superseded by OfferteForm)

## Decisions Made
- `submitLead` payload typed `Record<string, unknown>` so `consent` can be a boolean (see deviation).
- Inline error affordance (form stays mounted) preserves typed input on retry.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] submitLead payload type widened to allow a boolean consent**
- **Found during:** Task 1 + Task 2 (wiring the form to the schema)
- **Issue:** The plan/RESEARCH typed `submitLead(data: Record<string, string>)`, but the server schema (05-02) requires `consent: z.literal(true)` — a JSON boolean. Sending `consent` as a string ("on"/"true") would fail server validation, so a consenting user would wrongly hit the error state.
- **Fix:** Typed `submitLead(data: Record<string, unknown>)` and built `consent: fd.has("consent")` (boolean) in the form, so it serializes to JSON `true`.
- **Files modified:** `lib/forms.ts`, `components/OfferteForm.tsx`
- **Verification:** forms.ts + OfferteForm verifies pass; payload now matches the schema's boolean consent.
- **Committed in:** `76a1bdf` + the OfferteForm commit

---

**Total deviations:** 1 auto-fixed (1 bug — type would break consent validation)
**Impact on plan:** Correctness fix; behavior matches the server contract. No scope creep.

## Issues Encountered
None. Transient: between the Task-1/2/3 commits the working tree is briefly inconsistent (forms.ts renamed before ContactForm deletion; contact page swapped after) — harmless under the preview-only build model (the consistent final HEAD is what 05-06 deploys). No local build attempted (OneDrive).

## User Setup Required
None.

## Next Phase Readiness
- Wave 3 complete. The full lead path (form → thin caller → secure route → GHL) exists in code.
- Only 05-06 (launch gate, autonomous:false) remains: live Vercel/Upstash/GHL setup + preview deploy + curl/notification/CWV proofs — human-in-the-loop.
- Forced-failure proof (route 502 / offline → visible error + Bel/WhatsApp/retry) and the no-consent block run on the preview in 05-06.

---
*Phase: 05-lead-capture-form-security-launch-qa*
*Completed: 2026-06-29*
