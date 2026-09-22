---
phase: 10-reversible-old-brand-migration
plan: 03
subsystem: seo
tags: [nextjs, redirects, build-gate, invariants, typescript, vercel]

# Dependency graph
requires:
  - phase: 08-indexation-unlock
    provides: "lib/seo/invariants.ts — the pure-injectable-checker shape this plan's checker copies, and the 27-page indexable surface every destination is validated against"
  - phase: 05-launch-qa
    provides: "hybrid hosting — dropping output: \"export\" is what makes redirects() available at all"
provides:
  - "lib/seo/redirects.ts — the typed legacy map (9 mapped pages + root) and the three pure emitters next.config.ts composes"
  - "lib/seo/redirect-invariants.ts — checkRedirectInvariants(), fully injectable, 11 violation codes"
  - "lib/seo/cutover.ts — LEGACY_CUTOVER_DATE, the one place the flip date is written (10-09 sets it)"
  - "scripts/assert-redirects.ts — prebuild guard #9, offline, reading the array next.config.ts actually returns"
  - "R1-R9 in scripts/assert-gate-blocks.ts — each load-bearing assertion observed firing on a perturbed map"
  - "next.config.ts — skipTrailingSlashRedirect plus the three emitters in the only order that yields one hop"
affects: [10-05, 10-06, 10-07, 10-09, 10-10]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "A gate reasons about the VALUE the build uses (the array next.config.ts returns, the config key itself), never about the source text — a value assertion cannot be defeated by a comment"
    - "An exception to a build-blocking check is allowed but must explain itself in a field (nonIndexableReason, mirroring confidence/why) rather than by weakening the check for everyone"
    - "The next.config.ts module graph cannot use the @/ alias — imports there and in anything it reaches must be relative"

key-files:
  created:
    - lib/seo/redirects.ts
    - lib/seo/redirect-invariants.ts
    - lib/seo/cutover.ts
    - scripts/assert-redirects.ts
  modified:
    - next.config.ts
    - scripts/assert-gate-blocks.ts
    - package.json

key-decisions:
  - "LEGACY_REDIRECTS has 10 entries, not the 9 the plan's assertion expected: the 9 mapped legacy pages PLUS the root, exactly the set 10-02 captured. MIG-05's \"9-entry map\" counts the content pages"
  - "destination-not-indexable split into destination-not-routable (hard) and destination-not-indexable (opt-out via a stated reason) — the plan's map and the plan's assertion could not both hold otherwise"
  - "The chain check compares a destination against OTHER entries' sources only; comparing against its own flagged the entire shape of the map"
  - "Imports in the next.config.ts graph are relative, against repo convention, with a comment at each site explaining why"

patterns-established:
  - "tsx does not type-check and resolves @/ correctly, so an alias fault in the config graph passes every local gate and fails only in a real build — the Vercel preview is load-bearing, not a formality"

requirements-completed: [MIG-05, MIG-06]

# Metrics
duration: 2h 10m
completed: 2026-09-22
---

# Phase 10 Plan 03: The Redirect Map and Its Build Gate Summary

**Typed 10-entry legacy map with a host-gated path-preserving catch-all, backed by a pure injectable checker whose eleven codes are each watched firing on a perturbed map, wired into `prebuild` as guard #9 and confirmed by a Vercel preview that compiles clean and serves its home page**

## Performance

- **Duration:** ~2h 10m (including two failed/slow local-tooling detours and one red preview)
- **Completed:** 2026-09-22
- **Tasks:** 3
- **Files created:** 4 · **modified:** 3

## Accomplishments

- **The two findings that would otherwise have been discovered by Google are now build-blocking.** `catchall-not-host-gated` (an un-gated `/:path*` 301s the live site to itself → `ERR_TOO_MANY_REDIRECTS`) and `normalisation-not-last` (Next unshifts its own `/:path+/` 308 to the front unless `skipTrailingSlashRedirect` is on, costing every legacy URL a second hop with every build still green). Both observed firing — R1 and R3/R4 respectively.
- **Every assertion has been seen to fail.** R1–R9 sit alongside the existing P1–P5, each perturbation addressed by predicate, each asserting its own code, plus the unperturbed control. The control matters as much as the perturbations: without it the whole block could be passing because the checker is simply always angry.
- **The gate reads values, not text.** `assert-redirects.ts` imports `next.config.ts` and awaits `redirects()`, then asserts against that array and against `nextConfig.skipTrailingSlashRedirect`. Reordering the emitters or deleting the config line fails the build; a comment claiming the ordering is fine does nothing.
- **Nine guard lines green on Vercel, `✓ Compiled successfully in 11.3s`, Ready** — deployment `aub2t3jtd`.
- **The preview home page returns 200**, which is the live proof the catch-all is host-gated. A red `ERR_TOO_MANY_REDIRECTS` here is the signature of the catastrophic failure, and it is precisely why the map reaches a preview before production.

## Task Commits

1. **Tasks 1 + 2: map, cutover constant, checker, guard #9, R1–R9** — `bc48a1b` (feat)
2. **Task 3: next.config.ts wiring** — `255f753` (feat)
3. **Task 3 fix: relative imports in the config graph** — `f86da84` (fix)

## Files Created/Modified

- `lib/seo/redirects.ts` — `LEGACY_HOST_PATTERN` (one anchored alternation, with the three Next-source facts that make that shape non-negotiable), `LegacyRedirect`, the 10-entry map, and the three emitters. Imports `CANONICAL_ORIGIN` and nothing else.
- `lib/seo/redirect-invariants.ts` — `checkRedirectInvariants(opts?)`, 11 codes, every input injectable, never throws.
- `lib/seo/cutover.ts` — 5 lines; `LEGACY_CUTOVER_DATE` is `null` until 10-09.
- `scripts/assert-redirects.ts` — guard #9, offline, with a vacuous-pass floor (≥ 11 rules) in the `assert-seo.ts` style.
- `scripts/assert-gate-blocks.ts` — R1–R9 appended.
- `next.config.ts` — `skipTrailingSlashRedirect: true`, `redirects()` composing the three emitters in order.
- `package.json` — `prebuild` at 9 guards, `assert-redirects` after `assert-seo`.

## Decisions Made

- **`nonIndexableReason` rather than a weaker check.** See Deviations #2. The alternative — dropping the indexability requirement to routability for all ten entries — would have discarded the equity protection for the eight service redirects in order to accommodate one legal page.
- **Kept the root entry explicit** rather than letting the catch-all handle `/`. The plan and RESEARCH both list it, and an explicit rule is what makes the root's destination (bare origin, no trailing path) reviewable.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] The chain check flagged three correct entries**

- **Found during:** Task 2, first run of the new gate
- **Issue:** `destination-is-a-source` compared each destination against *all* sources including the entry's own, after normalising the trailing slash. `/over-ons/` → `/over-ons` therefore read as a self-chain — and that is the entire shape of this map, since the legacy site serves slashed URLs and the new one does not. It fired on `/over-ons/`, `/contact/` and `/privacy-beleid/`.
- **Fix:** compare against *other* entries' sources only.
- **Verification:** the three violations disappeared; R6 still fires by pointing one entry at another's source.
- **Committed in:** `bc48a1b`

**2. [Rule 4 → resolved in-plan] The plan's map and the plan's own assertion could not both hold**

- **Found during:** Task 2, same run
- **Issue:** the plan specifies `/privacy-beleid/` → `/privacy-beleid` in the map, and specifies `destination-not-indexable` as "every `to` resolves to a member of `sitemapEntries()`". But `privacy-beleid` is the single page deliberately kept out of the index — it *is* the derivation of `INDEXABLE_FLOOR = 27` ("28 routable nodes minus privacy-beleid"). The two requirements are mutually exclusive as written.
- **Fix:** split the check. `destination-not-routable` (the destination must be a real page — no opt-out, a 301 into a 404 is worse than leaving the legacy URL alone) and `destination-not-indexable` (opt-out via a non-empty `nonIndexableReason` on the entry). The privacy entry carries that reason: the legal page is noindex by design on both domains, the redirect serves humans following an old link, and there is no search equity on a legal page to lose.
- **Why not just weaken the check:** the indexability requirement is the entire value of that assertion — it is what stops a 301 funnelling the legacy domain's authority into a `noindex` wall. Relaxing it for all ten entries to fit the one legitimate exception would have quietly removed the protection from the eight that need it. Same idiom the file already uses for `confidence`/`why`: the exception is allowed, but it explains itself.
- **Committed in:** `bc48a1b`

**3. [Rule 3 - Blocking] `@/` aliases do not work in the `next.config.ts` module graph**

- **Found during:** Task 3, preview `H6oAA2rK`
- **Issue:** all nine guards passed on Vercel, then `next build` died before rendering anything:
  `Failed to load next.config.ts` → `Cannot find module './lib/constants'`, require stack `lib/seo/redirects.ts` ← `next.config.compiled.js`. Next compiles the config to `next.config.compiled.js` at the repo root and *does* hand tsconfig `paths` to SWC (confirmed in `next/dist/build/next-config-ts/transpile-config.js`), so `@/lib/constants` is rewritten to `./lib/constants` — correct relative to the root. But the `require` then executes from `lib/seo/`, so Node resolves it as `lib/seo/lib/constants`.
- **Fix:** both imports in that graph are relative now (`../constants` in `redirects.ts`, `./lib/seo/redirects` in the config), each with a comment saying why, because the repo convention is `@/` everywhere and this otherwise reads as a mistake to be tidied away.
- **Verification:** preview `aub2t3jtd` — nine guards, `✓ Compiled successfully in 11.3s`, Ready, home page 200.
- **Committed in:** `f86da84`

**4. [Recorded, not a code change] The map has 10 entries, not 9**

The plan's Task 1 asserts `LEGACY_REDIRECTS.length === 9`, but its own prose lists nine rows, says "eight are `certain`", and then introduces the dakventilator row as "the tenth row". RESEARCH §Pattern 1's code block likewise contains ten. The correct count is **10 = the 9 mapped legacy pages + the root**, which is exactly the set 10-02 captured ("the 10 public legacy URLs (the 9 mapped pages plus the root)"). MIG-05's "9-entry redirect map" counts the content pages. The data is right and the assertion's number was wrong; dropping an entry to match it would have been the `INDEXABLE_FLOOR` anti-pattern in reverse.

**5. [Recorded] The plan's preview probe expectation was mistaken**

Task 3 says a slashed path on the preview host "must **not** 308 to its slash-less form". Observed: `/over-ons/` → **308** → `/over-ons`; `/over-ons` → 200. That 308 is correct. `skipTrailingSlashRedirect` removes Next's *internal* normalisation and we re-add a byte-identical rule last, so canonical-host behaviour is preserved *exactly* — which is what Task 1 of the same plan says the rule is for. The only observable difference is on a **legacy** host, where the legacy rule must win before normalisation, and that cannot be exercised on a preview (spoofed `Host` goes to the production alias — 10-07's job).

---

**Total deviations:** 3 auto-fixed (1 bug, 1 design conflict, 1 blocking), 2 recorded
**Impact on plan:** No scope change. Two of the three fixes were found by the gate this plan builds, which is the gate working.

## Issues Encountered

- **The mount deadlocked `tsx` for roughly 40 minutes.** `esbuild --service` sat at 0.2% CPU; an existing, previously-fast script (`validate-taxonomy.ts`) hung identically, which is what established it was the environment and not the new code. It cleared on its own — most likely OneDrive churning through the ~95 mirror files committed by 10-02 minutes earlier. Two things worth carrying forward: `npx tsx` adds a resolution step that hangs where `./node_modules/.bin/tsx` does not, and `npx vercel` hangs from inside the mount but works from `/tmp` (CLI auth was present all along; the hang was never a login prompt).
- **`tsx -e` inline scripts do not resolve the `@/` alias** and hang rather than erroring. Use a file under `scripts/`.

## User Setup Required

None.

## Next Phase Readiness

- **Wave 1 is complete.** 10-04, 10-05 and 10-06 are unblocked.
- **10-05 consumes `lib/seo/cutover.ts`** — `verify-redirects.ts` asks `isCutoverDeclared()` to decide whether to assert or skip loudly. `LEGACY_CUTOVER_DATE` stays `null` until 10-09.
- **10-07 owns the real pre-flight probe.** The legacy map cannot be exercised from a preview: `has: host` needs a legacy `Host` header, and Vercel dispatches a spoofed `Host` to the production alias (403 `x-vercel-mitigated: deny` against `*.vercel.app`). That is why the map must be in **production** before the pre-flight runs.
- **Carry forward for any future config work:** nothing reachable from `next.config.ts` may use the `@/` alias, and no local check catches a violation.

---
*Phase: 10-reversible-old-brand-migration*
*Completed: 2026-09-22*

## Self-Check: PASSED

- Full `npm run prebuild` green locally — all 9 guards.
- Vercel preview `aub2t3jtd`: 9 guard lines, `✓ Compiled successfully in 11.3s`, state Ready.
- Preview home page HTTP 200 (the host-gating proof); `/over-ons/` 308 → `/over-ons` 200; `/wtw-unit-vervangen/` 308 → slash-less on the preview host, confirming the catch-all does not fire off a legacy host.
- `checkRedirectInvariants({ skipTrailingSlashRedirect: true })` returns zero violations against the real map; R9 asserts the same as a control inside the build.
- All four `key-files.created` confirmed on disk and in commits `bc48a1b` / `f86da84`.
