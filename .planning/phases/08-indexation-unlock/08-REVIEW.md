---
phase: 08-indexation-unlock
reviewed: 2026-08-20T14:20:00Z
depth: standard
files_reviewed: 20
files_reviewed_list:
  - app/diensten/page.tsx
  - components/ServiceIntro.tsx
  - lib/seo/invariants.ts
  - lib/seo/policy.ts
  - lib/services/airconditioning.ts
  - lib/services/mechanische-ventilatie.ts
  - lib/services/registry.ts
  - lib/services/types.ts
  - lib/services/warmtepompen.ts
  - lib/services/wtw.ts
  - package.json
  - scripts/assert-gate-blocks.ts
  - scripts/assert-metadata-seam.ts
  - scripts/assert-no-forbidden-claims.ts
  - scripts/assert-registry.ts
  - scripts/assert-seo.ts
  - scripts/assert-site-shape.ts
  - scripts/check-radius-literals.sh
  - scripts/validate-taxonomy.ts
  - scripts/verify-indexation.ts
findings:
  critical: 0
  warning: 1
  info: 3
  total: 4
status: issues_found
---

# Phase 8: Code Review Report

**Reviewed:** 2026-08-20T14:20:00Z
**Depth:** standard
**Files Reviewed:** 20
**Status:** issues_found (1 Warning — **fixed during review**; 3 Info — accepted)

## Summary

Reviewed the full Phase-8 source change set: 1110 insertions / 160 deletions across the indexing
policy, the taxonomy data, the hub route, one shared component, and the eight-guard build chain.

The change set is unusually well-covered for this repo because much of it *is* coverage: every new
guard ships with a perturbation proof that was executed during the plan, and both a preview and a
production HTTP probe passed. Verified independently during this review:

- **Single-source indexability holds.** `isIndexable` is referenced nowhere outside `lib/seo/*` — no
  parallel indexability logic survived the unification.
- **The whole guard chain costs 1.7s wall-clock**, well under the "few seconds" D-01 budget.
- **The `X-Robots-Tag` skip is host-scoped correctly**: `www.tpsklimaattechniek.nl`,
  `tpsklimaattechniek.nl` and a lookalike `evil-vercel.app.attacker.com` all enforce the header;
  only a true `*.vercel.app` suffix skips it.

One genuine robustness gap was found in `scripts/verify-indexation.ts` and **fixed during this
review** (WR-01), with both gates re-run green afterwards. The three Info items are accepted
trade-offs, documented here so they are decisions rather than oversights.

No secrets, no injection surface, no unsafe HTML, no new runtime dependencies. The two new modules
are pure and side-effect-free at import; the three new scripts are build-time CLIs that touch no
network except the probe, which is explicitly a network tool.

## Warnings

### WR-01: A malformed `<loc>` crashed the probe instead of being reported — FIXED

**File:** `scripts/verify-indexation.ts:59` (pre-fix)
**Issue:** `onBase()` called `new URL(loc)` outside any try/catch. A sitemap entry that is not a
parseable URL threw a `TypeError` inside a concurrent worker, which rejected `Promise.all(runners)`
and aborted the entire run with a generic "probe crashed" message. Two consequences, both bad: the
malformed entry — a real defect worth reporting — was never named, and every URL not yet processed
went unchecked, so one bad entry could mask genuine violations. This directly contradicted the
file's own stated contract ("collect EVERY violation and print them all before exiting"), which is
the property that makes the probe worth having.
**Fix applied:**
```ts
function onBase(loc: string): string | null {
  try {
    return `${base}${new URL(loc).pathname}`;
  } catch {
    return null;   // a bad <loc> is a finding, not a reason to stop
  }
}
// …in the worker:
const url = onBase(loc);
if (url === null) {
  fail(`sitemap entry is not a parseable URL: ${loc}`);
  return;
}
```
**Verification:** guard exercised on both a valid and a garbage input; `npm run prebuild` still 8/8
green; **both gates re-run after the fix** — production 27/27 and preview 27/27, still green.

## Info

### IN-01: Sitemap non-200 did not say where it redirected — FIXED

**File:** `scripts/verify-indexation.ts:88`
**Issue:** Probing the apex (`https://tpsklimaattechniek.nl`) printed only
`returned 308 — cannot verify anything else`, leaving the operator to work out that the apex
308-redirects to `www`. Small, but this is the message someone will hit at 2am during the Phase-10
migration.
**Fix applied:** the message now names the `location` target and says to probe that host instead:
`✗ …/sitemap.xml returned 308 → https://www.tpsklimaattechniek.nl/sitemap.xml — cannot verify anything else. Probe the host it redirects to, not this one.`

### IN-02: Duplicate sitemap entries produce repeated violations

**File:** `lib/seo/invariants.ts:88` (orphan/non-absolute loops) and `:126` (duplicate loop)
**Issue:** A URL appearing three times yields two `duplicate-entry` violations, and a duplicated
orphan is reported once per occurrence. Verified: a 3× repeat emits exactly two `duplicate-entry`
entries.
**Fix:** Not applied — accepted. The output is noisier than necessary only in an already-failing
build, and de-duplicating the report would add a second set of bookkeeping to a function whose
value is that it is trivially readable. Deliberately left verbose.

### IN-03: The seam guard's comment stripping is regex-based

**File:** `scripts/assert-metadata-seam.ts:47`
**Issue:** The line-comment stripper protects `://` but would still cut a protocol-relative string
such as `"//cdn.example.com"`, and the `index\s*:\s*false` pattern would false-positive on an
unrelated config object under `app/` that happened to use that key. Neither case exists today
(verified: 18 files scanned, all clean).
**Fix:** Not applied — accepted, and already disclosed in the file's own header, which states that
D-04 permits dropping this guard if it becomes fragile maintenance. Flagged here so the next editor
finds the reasoning before assuming a false positive is a real bypass.

### IN-04: `brandsForPillar()` is called two to three times per pillar

**File:** `scripts/assert-registry.ts:141`
**Issue:** The rewritten brand assertion calls the helper once for the deep-equal and again for the
resolvability loop, then once more in the non-vacuity check.
**Fix:** Not applied — a build-time script over 4 pillars; hoisting it would trade clarity for
nothing measurable. The whole chain runs in 1.7s.

## Notes on what was deliberately *not* flagged

- **`findBySlug("/diensten")!` non-null assertions** in `app/diensten/page.tsx` — consistent with
  the pre-existing `metadata` export on the same file and with every other route in the codebase.
  Changing the convention in one file would be worse than the convention.
- **`key={paragraph.slice(0, 24)}` in `ServiceIntro`** — pre-existing, unchanged by this phase, and
  the current content has distinct openings.
- **The scoped content bar letting a published `static` carry an empty shell** — intentional
  (D-20/IDX-05), labelled as intentional in `CONTENT_BAR_TYPES` and in `assert-gate-blocks` proof
  (E) precisely so it is not "fixed" back.

---

_Reviewed: 2026-08-20T14:20:00Z_
_Reviewer: Claude (inline — executor subagents hang on this OneDrive mount; see the project memory note)_
_Depth: standard_
