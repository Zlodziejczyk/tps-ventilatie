---
phase: 10-reversible-old-brand-migration
plan: 01
subsystem: infra
tags: [documentation, planning-artefacts, nextjs, hybrid-hosting, gsd-tooling]

# Dependency graph
requires:
  - phase: 05-launch-qa
    provides: "the hybrid-hosting switch itself — `output: \"export\"` dropped for `app/api/lead/route.ts`, which is what makes `redirects()` available to this phase"
  - phase: 09-measurement-foundation
    provides: "D-26, the nameserver move from the old registrar pair to dd24, which made PROJECT.md's topology line stale"
provides:
  - "MIG-01 restated as the credential-free public content mirror, with D-02's reasoning inside the requirement sentence"
  - "ROADMAP §Phase 10 criterion 4 and the MIG-01…04 hard-gate line aligned to that same deliverable, so the phase verifier grades against what the phase intends to build"
  - "PROJECT.md §Context matching the real access boundary — dd24 plus repo/Vercel/GSC/GBP, nothing on the old stack"
  - "CLAUDE.md describing hybrid Vercel hosting, regenerated from corrected sources rather than hand-patched"
affects: [10-02, 10-03, 10-07, phase-verification, every-future-agent-session]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Amend-in-place supersession: a changed milestone artefact carries when, by which decision, what actually happened and why, inside the row itself — no footnote (copied from the REQUIREMENTS Out-of-Scope precedent set by Phase 9 D-26)"
    - "Fix the GSD source document, then regenerate — never hand-edit inside `<!-- GSD:* -->` markers"
    - "`gh api contents/<path>` → edit temp copy → whole-file `cp` overwrite, for files the OneDrive mount refuses to read"

key-files:
  created: []
  modified:
    - .planning/REQUIREMENTS.md
    - .planning/ROADMAP.md
    - .planning/PROJECT.md
    - .planning/codebase/STACK.md
    - .planning/codebase/ARCHITECTURE.md
    - CLAUDE.md

key-decisions:
  - "MIG-01 is a credential-free public content mirror of the 9 live legacy pages, not a files-plus-database copy — the cutover moves two hostname A records and touches neither files, database, vhost nor subscription, so reversibility is protected by never touching the install and by the cyberfolks subscription staying alive for info@ (D-02)"
  - "The three risks a copy would have insured against are accepted in writing, at the requirement: the install rots unpatched (WP 7.1.1), the subscription ends, a host-side accident occurs with retention unknown to us"
  - "PATTERNS.md's open question is settled: both codebase source docs did carry the stale static-export claim, so regeneration alone would have reproduced it — sources fixed first"
  - "PROJECT.md's `/wp-sitemap.xml` 404 claim is wrong (it returns 200); D-15's conclusion stands but its stated reason changes to staleness-at-cutover"

patterns-established:
  - "Anti-drift grep tokens: a verification that asserts the ABSENCE of superseded phrasing means the replacement text may not quote the original — including inside a correction note (this bit once during Task 1 and was caught by the gate)"
  - "A requirement claimed by two plans is only complete when the LAST of them lands its artefact — `requirements.mark-complete` runs per-plan from frontmatter and will flip it early; check the artefact exists on disk before accepting the flip"

requirements-completed: []  # MIG-01 is claimed by this plan AND by 10-02. This plan rewrote the
  # requirement's text; 10-02 produces the artefact it describes. MIG-01 is completed by 10-02, and
  # claiming it here would be the exact false-checkbox failure this plan exists to prevent.

# Metrics
duration: 22 min
completed: 2026-09-21
---

# Phase 10 Plan 01: Truth-Up the Milestone Artefacts Summary

**MIG-01 rewritten from a files-plus-database copy to a credential-free public content mirror with D-02's reasoning attached, ROADMAP criterion 4 and the hard-gate line realigned to match, PROJECT.md's access claim corrected to dd24-only, and CLAUDE.md regenerated from two corrected source docs so it stops telling every future agent that `redirects()` is unavailable here**

## Performance

- **Duration:** 22 min
- **Started:** 2026-09-21T00:00:00Z (approx — inline execution)
- **Completed:** 2026-09-21
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- **The phase can now pass honestly.** ROADMAP §Phase 10 criterion 4 demanded a deliverable this phase deliberately does not build. Criterion and requirement are now the same sentence, so the verifier grades the phase against what it intends to do rather than against an artefact nobody planned to produce.
- **The reasoning travels with the change.** D-02's insight — *a copy does not protect reversibility; not touching the install plus the subscription staying for mail does* — is inside the MIG-01 sentence, along with the three accepted risks. A future reader meets it where they meet the requirement.
- **PROJECT.md stopped claiming access we never held.** §Context now states we hold dd24 (the domain and both zones), the repo, Vercel, Search Console and GBP admin — and that WordPress admin, the cyberfolks panel and the `info@` mailbox are Thomas's. Two other re-measured claims dropped in the same pass: the retired nameserver pair (superseded by Phase 9 D-26) and the `/wp-sitemap.xml` 404 (it returns 200).
- **CLAUDE.md no longer contradicts the codebase.** It described a static export — the one description that makes this phase look impossible, since `redirects()` and route handlers are exactly what static export forbids.

## Task Commits

1. **Task 1: Amend MIG-01, ROADMAP criterion 4 and the hard-gate line; correct PROJECT.md §Context** — `e87006c` (docs)
2. **Task 2: Correct the two GSD source documents, then regenerate CLAUDE.md** — `7c47cdf` (docs)

## Files Created/Modified

- `.planning/REQUIREMENTS.md` — MIG-01 restated; checkbox shape kept so the verifier can still read it as a criterion. Line 122's status row left untouched (phase close flips it).
- `.planning/ROADMAP.md` — §Phase 10 criterion 4 rewritten with a `(amended by Phase 10 D-02/D-03 …)` pointer; the `**Hard gates:**` paragraph extended to name what MIG-01…04 each mean, point-of-no-return sentence intact.
- `.planning/PROJECT.md` — §Context access line, old-site topology line.
- `.planning/codebase/STACK.md` — 5 edits: hybrid framework description, Image Optimization on with AVIF+WebP, `next.config.ts` described by what it sets, and both Platform Requirements bullets that asserted an `out/` export and no server runtime.
- `.planning/codebase/ARCHITECTURE.md` — 6 edits: overview, key characteristics, the `next.config.ts` entry-point row, the architectural constraint, the "no server runtime" constraint (now "no database"), and the `<Suspense>` rationale.
- `CLAUDE.md` — regenerated, not hand-edited.

## Decisions Made

- **Supersession is recorded in the row, not in a footnote** (D-03), copying the voice of the one existing precedent in this repo — the Out-of-Scope row where Phase 9 D-26 superseded the nameserver-move exclusion.
- **Sources first, then regenerate.** PATTERNS.md flagged this as an open check: if `STACK.md`/`ARCHITECTURE.md` were already clean, a hand-edit to `CLAUDE.md` would be silently undone by the next regeneration. Both were fetched via `gh api` and both did carry the stale claim, so the source-edit path was the correct one.
- **The `redirects()`-in-`next.config.ts` sentence was written forward-looking** in both source docs ("as of Phase 10 it also sets `skipTrailingSlashRedirect: true` and a `redirects()` map"), matching what 10-03 lands. If 10-03 deviates, these two lines are the ones to re-check.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Reverted a premature MIG-01 completion checkbox written by the close-out tooling**

- **Found during:** Plan close-out (`requirements.mark-complete MIG-01`, run from this plan's `requirements:` frontmatter)
- **Issue:** MIG-01 is claimed by **two** plans — 10-01 (which rewrites the requirement's text) and 10-02 (which produces the artefact it describes). The mechanical close-out step flipped `- [ ] **MIG-01**` → `- [x]` and its traceability row `Pending` → `Complete` after 10-01, but the deliverable — `docs/baseline/<capture-date>/legacy-site-mirror/` — does not exist on disk yet. MIG-01's text is deliberately *externally checkable*, and as of this commit it checks **false**.
- **Why it mattered enough to fix:** this plan exists because a requirement nobody intends to meet as written rots into a false "complete" checkbox. Shipping this plan by creating a false "complete" checkbox would have been the same defect, introduced by the fix for it.
- **Fix:** reverted both the checkbox and the traceability row to `[ ]` / `Pending`. 10-02 owns the flip.
- **Files modified:** `.planning/REQUIREMENTS.md` (net-zero diff against `e87006c` — the revert restored the committed state exactly)
- **Verification:** `ls -d docs/baseline/*/legacy-site-mirror` → no match, confirming the artefact is absent; `grep -c '^- \[x\] \*\*MIG'` → `0`.
- **Committed in:** no separate commit needed — the file returned to its `e87006c` content.

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** No scope change. Requirement tracking now matches disk reality; MIG-01 flips when 10-02 lands the mirror.

### Fallbacks the plan anticipated that were not needed

- `gsd-tools.cjs generate-claude-md --force` **ran cleanly on the mount** (6/6 sections, `sections_fallback: []`), so the documented fetch-edit-overwrite fallback on `CLAUDE.md` itself was not used. The plan's acceptance criteria asked for this to be recorded either way.
- Regeneration also cleared the project block's stale `"may need to relax to a hybrid … open decision"` line without any source edit, exactly as PATTERNS.md predicted — `.planning/PROJECT.md` line 116 had been correct since Phase 5.

`.planning/codebase/STACK.md` and `.planning/codebase/ARCHITECTURE.md` did stall on direct shell reads as the plan warned; the `gh api` route worked on the first attempt for both, and the whole-file `cp` overwrite rehydrated the placeholders so later reads succeed.

## Issues Encountered

**One near-miss, caught by the gate it was designed to catch.** While rewriting PROJECT.md's access line, the correction note initially quoted the superseded phrase verbatim (`the earlier "access on the old site's hosting" claim was false`) — which would have tripped the very grep asserting that phrase's absence. This is the Phase 8 anti-drift-token lesson recurring for a fifth time, and in a new costume: it appeared in *replacement prose*, not in a code comment. Reworded to describe the old claim without reproducing it. The automated verify caught it immediately; no commit carried the defect.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **10-02 and 10-03 are unblocked** (both wave 1, no dependency on this plan's output, but both now reference artefacts that tell the truth).
- **10-03 should confirm** the two forward-looking `next.config.ts` sentences in `STACK.md` and `ARCHITECTURE.md` still match what it actually lands (`skipTrailingSlashRedirect: true` plus a `redirects()` map re-adding the internal `/:path+/` rule LAST).
- **Phase verification will now grade criterion 4 against the content mirror**, which 10-02 produces.

---
*Phase: 10-reversible-old-brand-migration*
*Completed: 2026-09-21*

## Self-Check: PASSED

- Both `<verify><automated>` gates re-run green at close: the REQUIREMENTS/ROADMAP/PROJECT assertion and the CLAUDE.md marker+hybrid assertion.
- All 9 acceptance criteria across both tasks verified by executed command, not by inspection.
- `git log --oneline --all --grep="10-01"` returns 2 production commits (`e87006c`, `7c47cdf`).
- `key-files.modified` — all 6 confirmed present on disk and modified in those commits.
