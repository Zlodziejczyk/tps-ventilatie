---
phase: 05-lead-capture-form-security-launch-qa
plan: 01
subsystem: infra
tags: [nextjs, hybrid, image-optimization, upstash, ratelimit, env, avif, webp]

requires:
  - phase: 04-content-fill-editorial-gate
    provides: the ~22 static content/service routes that must keep prerendering after the flip
provides:
  - Hybrid next.config.ts (no output:export, no images.unoptimized) — Route Handlers + Image Optimization unlocked
  - AVIF/WebP image formats opted in explicitly (trailingSlash:false preserved)
  - "@upstash/ratelimit + @upstash/redis installed (durable serverless rate-limit infra for 05-02)"
  - Server-only GHL_WEBHOOK_URL contract in .env.example (+ documented Upstash vars)
  - QA-01 static-vs-hybrid decision resolved to HYBRID and logged in PROJECT.md Key Decisions
affects: [05-02, 05-03, 05-05, 05-06, 06-homepage-conversion-uplift]

tech-stack:
  added: ["@upstash/ratelimit ^2.0.8", "@upstash/redis ^1.38.0"]
  patterns:
    - "Hybrid hosting: SSG pages prerender, one Route Handler runs serverless"
    - "Server-only secrets (no NEXT_PUBLIC_ on the GHL webhook)"

key-files:
  created: []
  modified: [next.config.ts, package.json, package-lock.json, .env.example, .planning/PROJECT.md]

key-decisions:
  - "QA-01 resolved to HYBRID — drop output:export for one server route (app/api/lead/route.ts); all other ~22 pages stay SSG; trailingSlash:false + apex canonical preserved"
  - "AVIF opted in explicitly via images.formats (Next default is webp-only); no images.qualities added (no <Image quality> props exist, default [75] is correct)"
  - "Durable rate limiting via @upstash/ratelimit + @upstash/redis; @vercel/kv deliberately excluded (maintainer-deprecated)"

patterns-established:
  - "Server-only env contract: secret webhook lives in GHL_WEBHOOK_URL (no NEXT_PUBLIC_), set in Vercel Preview+Production"

requirements-completed: [QA-01, QA-07]

duration: ~12 min
completed: 2026-06-29
---

# Phase 5 Plan 01: Hybrid Flip + Rate-Limit Infra + Server-Only Env + QA-01 Decision Summary

**Flipped next.config.ts to Next.js hybrid (AVIF/WebP optimization on, output:export gone), installed @upstash/ratelimit+redis, relocated the GHL webhook to a server-only env var, and logged the QA-01 hybrid decision in the project ledger.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-06-29
- **Completed:** 2026-06-29
- **Tasks:** 4
- **Files modified:** 5

## Accomplishments
- `next.config.ts` is now hybrid: `output: "export"` and `images.unoptimized` removed, `images.formats: ["image/avif","image/webp"]` added, `trailingSlash: false` preserved. This single change unlocks the secure Route Handler (05-02) and `next/image` optimization (QA-07).
- `@upstash/ratelimit ^2.0.8` + `@upstash/redis ^1.38.0` installed (lockfile updated); `@vercel/kv` correctly NOT added.
- The GHL webhook secret is now server-only by contract in `.env.example` (`GHL_WEBHOOK_URL`, no `NEXT_PUBLIC_`); Upstash REST vars documented as optional (route degrades to honeypot-only without them).
- QA-01 (static-vs-hybrid decision gate) resolved to **hybrid** and recorded in PROJECT.md Key Decisions + Constraints, so it can never silently regress.

## Task Commits

1. **Task 1: Flip next.config.ts to hybrid + AVIF/WebP** - `fb038ab` (feat)
2. **Task 2: Install @upstash/ratelimit + @upstash/redis** - `67624e3` (feat)
3. **Task 3: Server-only GHL_WEBHOOK_URL + Upstash vars in .env.example** - `463830e` (feat)
4. **Task 4: Log QA-01 hybrid decision in PROJECT.md** - `3f7b13d` (docs)

## Files Created/Modified
- `next.config.ts` - Hybrid config; AVIF/WebP formats; trailingSlash:false kept
- `package.json` / `package-lock.json` - Upstash rate-limit dependencies
- `.env.example` - Server-only `GHL_WEBHOOK_URL` + documented `UPSTASH_REDIS_REST_URL`/`_TOKEN` + preserved `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `.planning/PROJECT.md` - QA-01 resolved to ✅ hybrid; Constraints + footer updated

## Decisions Made
- Hybrid over a workaround (no static export hacks) — one clean server route, everything else SSG.
- No `images.qualities` entry: a repo-wide grep found zero `<Image quality={N}>` props, so the default `[75]` is correct and adding `qualities` would be noise.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] `.env.example` did not actually contain `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`**
- **Found during:** Task 3 (server-only env)
- **Issue:** The plan's read_first stated `.env.example` already declared `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, and Task 3's verify requires it to be present. In reality the file held only the GHL line. Leaving it out would (a) fail the verify and (b) leave a real, used public var (`lib/constants.ts:56` → `app/layout.tsx` metadata) undocumented.
- **Fix:** Added `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=` with a comment noting it is legitimately public (GSC token rendered into `<head>`).
- **Files modified:** `.env.example`
- **Verification:** Task 3 node verify prints OK (GSC var present, no `NEXT_PUBLIC_GHL_WEBHOOK_URL`).
- **Committed in:** `463830e` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Corrected a stale read_first assumption; the env contract is now complete and the verify passes. No scope creep.

## Issues Encountered
None. `npm install` ran cleanly on the OneDrive mount (exit 0); per project constraints no local `next build`/`tsc` was attempted — the hybrid build is proven on the Vercel preview in 05-06.

## User Setup Required
None in this plan. The live Vercel env cutover (set `GHL_WEBHOOK_URL`, delete the legacy public var) and Upstash provisioning are dashboard actions handled in 05-06.

## Next Phase Readiness
- Wave 2 unblocked: 05-02 (secure `/api/lead` route reading `process.env.GHL_WEBHOOK_URL` + `@upstash/ratelimit`), 05-04 (sticky bar), 05-05 (motion/map/images + active image optimizer) can all proceed.
- The hybrid build itself is unverified locally by design (OneDrive deadlock) — Vercel preview in 05-06 is the build gate.

---
*Phase: 05-lead-capture-form-security-launch-qa*
*Completed: 2026-06-29*
