---
phase: 05-lead-capture-form-security-launch-qa
plan: 02
subsystem: api
tags: [zod, route-handler, ratelimit, upstash, honeypot, security, nodejs, ghl]

requires:
  - phase: 05-01
    provides: hybrid next.config (Route Handlers unlocked), @upstash/* deps, server-only GHL_WEBHOOK_URL contract
provides:
  - "lib/lead-schema.ts — shared Zod v4 lead contract (leadSchema + LeadInput), server-authoritative + client-reusable"
  - "app/api/lead/route.ts — the single dynamic endpoint: rate-limit -> parse -> safeParse -> honeypot -> server-only secret -> GHL forward -> structured JSON"
  - Client-exposed-webhook + no-input-validation CONCERNS closed in code (preview-proof in 05-06)
affects: [05-03, 05-06]

tech-stack:
  added: []
  patterns:
    - "Server-authoritative validation via a shared Zod schema imported by both route and form"
    - "Graceful-degrade rate limiting: limiter built only when Upstash env present; honeypot is the always-on control"
    - "Structured generic error codes (no PII, no field echoes) across the route->client boundary"

key-files:
  created: [lib/lead-schema.ts, app/api/lead/route.ts]
  modified: []

key-decisions:
  - "Graceful-degrade rate limiter (makeRatelimit() -> Ratelimit|null) instead of the RESEARCH snippet's module-level Redis.fromEnv() — so a preview works before Upstash is provisioned and a limiter backend error can never 500 a legitimate lead"
  - "Added a cheap Content-Type=application/json guard (defense-in-depth); deliberately SKIPPED the optional Origin allowlist (spoofable + false-positive risk on same-origin fetch) — the real controls are Zod + honeypot + rate limit + server-only secret"
  - "Forward the same flat field shape the existing GHL workflow expects (naam, telefoon, email, postcode, dienst, bericht, submittedAt); consent/website never forwarded"

patterns-established:
  - "Single dynamic endpoint pattern: one /api/lead Route Handler; everything else stays SSG"

requirements-completed: [QA-02, LEAD-02]

duration: ~10 min
completed: 2026-06-29
---

# Phase 5 Plan 02: Secure Lead Path (Zod Schema + /api/lead Route) Summary

**A shared Zod v4 lead schema plus a nodejs Route Handler that rate-limits by IP, validates server-side, silent-accepts honeypots, reads the server-only GHL webhook, and forwards valid leads — closing the client-exposed-secret and no-validation concerns.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-06-29
- **Completed:** 2026-06-29
- **Tasks:** 2
- **Files modified:** 2 (both created)

## Accomplishments
- `lib/lead-schema.ts`: one Zod v4 `leadSchema` + inferred `LeadInput`, the single server-authoritative definition of a valid lead (naam/telefoon/postcode/dienst required, email optional-or-empty, consent `literal(true)`, `website` honeypot `max(0)`), Dutch messages, importable by route + form.
- `app/api/lead/route.ts`: `runtime="nodejs"` POST that does, in order — rate-limit (graceful-degrade) → content-type+JSON parse → `safeParse` → honeypot silent-accept → server-only `GHL_WEBHOOK_URL` → forward to GHL → structured `{ ok, error? }`. The webhook string never appears client-side; no PII is logged.

## Task Commits

1. **Task 1: Shared Zod v4 lead schema** - `6fac341` (feat)
2. **Task 2: Secure /api/lead POST route** - `a5dd125` (feat)

## Files Created/Modified
- `lib/lead-schema.ts` - Shared lead validation contract (Zod v4)
- `app/api/lead/route.ts` - The secure dynamic endpoint

## Decisions Made
- Graceful-degrade limiter (plan-mandated over the RESEARCH verbatim snippet): no module-load crash without Upstash; limiter errors fall through rather than blocking leads.
- Content-Type guard added; Origin allowlist intentionally skipped (Claude's discretion per plan — Origin is spoofable and risks blocking same-origin fetches).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Verify-grep false-positives from descriptive comments**
- **Found during:** Task 1 + Task 2 (acceptance-criteria gate)
- **Issue:** The Task verifies grep the source for `z.string().email(` and `force-dynamic` to flag anti-patterns; my explanatory comments literally contained those tokens ("NOT the deprecated z.string().email()", "no force-dynamic needed") and tripped the greps even though the code is correct (this is the documented OneDrive anti-drift-token-in-comments hazard).
- **Fix:** Reworded both comments to describe the idiom without the literal forbidden tokens.
- **Files modified:** `lib/lead-schema.ts`, `app/api/lead/route.ts`
- **Verification:** All three 05-02 node verifies print OK.
- **Committed in:** `6fac341`, `a5dd125` (within the task commits)

---

**Total deviations:** 1 auto-fixed (1 bug — comment/grep collision)
**Impact on plan:** Cosmetic comment edits only; runtime behavior unchanged. No scope creep.

## Issues Encountered
None beyond the comment/grep collision above. No local build/tsc attempted (OneDrive) — the route is curl-tested on the Vercel preview in 05-06.

## User Setup Required
None in this plan. The live `GHL_WEBHOOK_URL` + Upstash REST vars are set in Vercel as part of 05-06.

## Next Phase Readiness
- 05-03 can now thin `lib/forms.ts` to POST `/api/lead` and build `<OfferteForm>` against `leadSchema`'s field names.
- Runtime proof (curl 400/400/200-no-deliver/200 + client-bundle grep for the absent webhook string) is deferred to the Vercel preview in 05-06.

---
*Phase: 05-lead-capture-form-security-launch-qa*
*Completed: 2026-06-29*
