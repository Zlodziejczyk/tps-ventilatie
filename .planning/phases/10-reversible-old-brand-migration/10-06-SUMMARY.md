---
phase: 10-reversible-old-brand-migration
plan: 06
subsystem: seo
tags: [gsc, measurement, cron, legacy, thresholds, consolidation]

# Dependency graph
requires:
  - phase: 10-reversible-old-brand-migration
    provides: "10-03's LEGACY_REDIRECTS (the inspection list) and LEGACY_CUTOVER_DATE (the consolidation clock)"
  - phase: 09-measurement-foundation
    provides: "the weekly cron, scripts/gsc/* client, the service-account credential, and the thresholds evaluator this extends"
provides:
  - "legacy-canonical-not-moved and legacy-traffic-zero, with LEGACY_CONSOLIDATION_WEEK=8 and LEGACY_ZERO_WEEKS=4 carrying their derivations"
  - "Reading.legacy — the retired property's 28-day traffic and per-URL consolidation state, written weekly"
  - "nextZeroStreak() and isOnLegacyHost() as pure, reusable transitions"
  - "The evidence base that will eventually justify retiring the redirect map — and the first real measurement of it"
affects: [10-09, 10-10]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "An injectable date parameter (opts.legacyCutoverDate) is what lets a flag be PROVEN firing while the real date is still null — the checkRedirectInvariants(opts?) shape, reused"
    - "When an input is unavailable, drop the whole block rather than record a zero: a fabricated zero is indistinguishable from real silence and marches a streak toward a flag meaning the opposite"

key-files:
  created: []
  modified:
    - scripts/gsc/thresholds.ts
    - scripts/measure-indexation.ts
    - docs/measurements/README.md
    - .github/workflows/measure-indexation.yml

key-decisions:
  - "10 legacy URLs, not 9 — derived from LEGACY_REDIRECTS as the plan instructs; the map holds 9 mapped pages plus the root"
  - "evaluateReading gained an injectable cutover date so both flags could be observed firing before 10-09 declares the real one"
  - "A Search Analytics failure drops the entire legacy block rather than recording impressions28d: 0 — the type makes the honest choice the only choice"
  - "MIG-09 deliberately NOT marked complete: it requires a submitted Change of Address, which is 10-10's work. This plan builds the instrument that will later show whether it worked"

patterns-established:
  - "ugrep is aliased to grep on this machine and rejects the plus-anchored pattern (^\\+\\+\\+) that diff-filtering checks use. The chained `grep … || echo PASS` shape then reports a PASS from its own error fallback — a false green. Filter diffs in python, not in that grep chain."

requirements-completed: []

# Metrics
duration: 40 min
completed: 2026-09-23
---

# Phase 10 Plan 06: The Weekly Legacy Section Summary

**The weekly GSC cron now also asks what Google did with the retired domain — two flags carrying their derivations, both observed firing and staying silent against an unperturbed control, and a first real reading showing the old domain still drawing 2,132 impressions in 28 days**

## Performance

- **Duration:** ~40 min
- **Completed:** 2026-09-23
- **Tasks:** 3
- **Files created:** 0 · **modified:** 4

## Accomplishments

- **Retiring the redirect map is now evidence-driven rather than date-driven.** The 180-day floor is a minimum, not a signal. The question that actually decides it — is Search still sending traffic to the old domain, and has Google moved its chosen canonical? — is answerable only by Google, weekly, and only if something asks. D-25 exists because this repo has already watched three build guards sit red for weeks because nothing executed them.
- **Both flags were seen speaking *and* staying silent before reality was asked.** A stuck canonical at week 9 fires and **names the URL**; the same reading at week 3 does not; nor does it with the cutover undeclared; a fourth consecutive zero fires and a third does not; a reading with no legacy block fires nothing; and **the unperturbed control is silent** — without which every proof above could be passing because the evaluator is simply always angry.
- **The first real reading is itself a finding.** 2,132 impressions and 32 clicks over 28 days on `tpsventilatie.nl`. The redirect map is load-bearing, not ceremonial, and `legacy-traffic-zero` is nowhere near firing. Nine of ten legacy URLs are `PASS` / *Submitted and indexed* with the canonical still on the old host — exactly right, the cutover has not happened. `/privacy-beleid/` is `NEUTRAL` / *URL is unknown to Google*, which is consistent with it being the deliberate noindex destination.
- **The new domain measured 27/27 indexed** in the same run, with the sitemap at 27 submitted / 0 errors.
- **D-19 gets its late coverage.** `pageFetchState` on each legacy URL is where a detached Vercel domain or a lapsed certificate will surface — with Google's lag, not by direct check. Late coverage, **not** equivalent coverage; `verify-redirects.ts` was deliberately not widened into a cron.

## Task Commits

1. **Task 1: the two flags and their derivations** — `0e9087b` (feat)
2. **Task 2: the legacy collector** — `55873e8` (feat)
3. **Task 3: Dutch vocabulary + workflow comment** — `1555e4a` (docs)

## Files Created/Modified

- `scripts/gsc/thresholds.ts` — `LegacyBlock` / `LegacyUrlReading`, an **optional** `Reading.legacy`, both flag codes, `LEGACY_CONSOLIDATION_WEEK = 8` and `LEGACY_ZERO_WEEKS = 4` in the `RAMP_ANCHOR` register, the pure `nextZeroStreak()` and `isOnLegacyHost()`, and an injectable cutover date on `evaluateReading`.
- `scripts/measure-indexation.ts` — `legacySection()`: inspections derived from the map against `PROPERTY_LEGACY`, a 28-day `byProperty` Search Analytics call, the streak transition, the whole thing non-fatal, plus a report under its own `— legacy (tpsventilatie.nl) —` heading.
- `docs/measurements/README.md` — two Dutch rows naming the 180-day floor and denying that either flag is permission, a paragraph on the legacy section, house rule still closing the section.
- `.github/workflows/measure-indexation.yml` — **comment only**; both codes added to the flag vocabulary.

## Decisions Made

- **The host test reuses `LEGACY_HOST_PATTERN` from the map** rather than re-typing the hostname. A second copy would drift and would agree with any bug — the same reasoning that forbids a parallel URL list.
- **`Reading.legacy` is optional and a missing block flags nothing.** A gap is not a zero. A gap silently read as success is the exact failure this section exists to prevent.
- **On Search Analytics failure the whole block is dropped.** Recording `impressions28d: 0` would be indistinguishable from real silence and would march the zero-streak toward a flag meaning the opposite of what happened. The required field in the type makes the honest choice the only available one.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Data] The plan's legacy URL count is 9; the map holds 10**

- **Found during:** Task 2
- **Issue:** the plan says "9 legacy inspection URLs" and its verification asserts `urls.length !== 9` → fail. `LEGACY_REDIRECTS.length` is **10** (9 mapped pages plus the root).
- **Fix:** derived from the map exactly as the plan's own prose instructs — *"for each entry"*, *"never write a second list"* — which yields 10. The root is also the single most valuable URL to watch for consolidation, so excluding it to match a stale number would have been the worse error.
- **Precedent:** identical to 10-05, whose plan said 18 checks where exhaustiveness was 20.
- **Committed in:** `55873e8`

**2. [Rule 1 - Bug] `evaluateReading` could not prove its own consolidation flag**

- **Found during:** Task 1
- **Issue:** `LEGACY_CUTOVER_DATE` is `null` until 10-09, so `legacy-canonical-not-moved` could never be observed firing — only assumed to work. The plan's acceptance criteria require observing it fire at week 8+ *and* stay silent before it.
- **Fix:** an optional 4th parameter `opts: { legacyCutoverDate?: string | null }`, defaulting to the real constant. Production passes nothing. This is the `checkRedirectInvariants(opts?)` shape 10-03 established for exactly this problem.
- **Committed in:** `0e9087b`

**3. [Rule 1 - Bug] The plan's comment-only workflow check reports a false PASS**

- **Found during:** Task 3
- **Issue:** `ugrep` is aliased to `grep` here and rejects `^\+\+\+` with *"invalid syntax"*. The check is a `grep … | grep … | grep -q . && { fail } || echo PASS` chain, so the error takes the `||` branch and prints the success message. It reported PASS **without ever comparing anything**.
- **Fix:** re-verified by filtering added/removed lines in python. Genuine result: 5 added, 3 removed, **0 non-comment** either way.
- **Committed in:** `1555e4a` (documented in the message)

---

**Total deviations:** 3 auto-fixed (1 stale data count, 2 bugs). Two were found only by running the checks rather than reading them.
**Impact on plan:** None on scope. All three acceptance criteria sets are met, one of them by a stricter check than the plan specified.

## Issues Encountered

- **The environment changed underneath this plan.** The OneDrive working copy's git broke completely mid-session (see *User Setup Required*), and execution moved to a local clone. Unrelated to the plan's content, but it is why the commits are authored from `~/dev/tps-klimaattechniek`.

## User Setup Required

**The OneDrive mount can no longer hydrate cloud-only files, and the project moved to local disk.**

- Every read of a dehydrated OneDrive file fails with `Operation timed out` — in the repo this surfaced as `fatal: mmap failed` on `git commit` / `status` / `diff`, with 3040 of 3062 loose objects and `.git/logs/HEAD` stranded.
- It is **mount-wide, not repo-specific**: an unrelated `.docx` elsewhere in OneDrive-Personal fails identically. Launching the OneDrive app (it was not running) did not restore hydration.
- **This needs the owner to open OneDrive and resolve it** — it looks like a sign-in or account-level problem and cannot be fixed from a shell.
- No work was lost: everything committed was already on GitHub, and the one uncommitted file was copied out before anything else was attempted.
- **The live working copy is now `~/dev/tps-klimaattechniek`.**

## Next Phase Readiness

- **MIG-09 remains open, correctly.** It requires a *submitted* Change of Address from a domain-level property — 10-10's work. This plan built the instrument that will later show whether that submission achieved anything. Marking it here would have been the same premature checkbox 10-01 had to reverse on MIG-01.
- **10-09 inherits a live consumer of `LEGACY_CUTOVER_DATE`.** Setting that date arms `verify-redirects.ts` Mode B *and* starts this consolidation clock. That is now two gates on one edit, which is the intended design.
- **10-10 inherits the retirement evidence.** `legacy-traffic-zero` will not fire for a long time on current numbers, which is the correct answer, not a defect.
- **The toolchain is no longer a constraint.** On local disk `npm run build` is green in **~8 s** with all 9 prebuild guards, and `tsc --noEmit` in **2 s** — both previously impossible on this project. Plans written before 2026-09-23 that say *"there is no local `next build` or `tsc --noEmit` on this mount"* are stating a stale fact; the Vercel-preview-as-build-gate workaround is no longer forced.
- **Carried, not this phase's work:** the Phase 9 GSC service-account key rotation is still outstanding on the same credential this plan used.

---
*Phase: 10-reversible-old-brand-migration*
*Completed: 2026-09-23*

## Self-Check: PASSED

- Six fabricated-reading proofs observed, including the unperturbed control and the missing-block case; the plan's own verbatim verification script also passes.
- Real API run: exit 0, 10 legacy URLs, 0 errors, `impressions28d` 2132, `pageFetchState` present on every entry, 27/27 on the new domain.
- `docs/measurements/gsc` untouched by the proof run.
- Workflow diff is comment-only, verified in python after the plan's grep check was found to self-pass; the file still parses as YAML with its 6 steps intact.
- `scripts/gsc/api.ts` and `scripts/export-gsc-performance.ts` unmodified.
- `npm run build` exit 0 with all 9 prebuild guards green; `tsc --noEmit` clean.
