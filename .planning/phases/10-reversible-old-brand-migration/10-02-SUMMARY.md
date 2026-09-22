---
phase: 10-reversible-old-brand-migration
plan: 02
subsystem: infra
tags: [wget, archival, evidence, baseline, wordpress, privacy]

# Dependency graph
requires:
  - phase: 09-measurement-foundation
    provides: "docs/baseline/2026-09-16/ — the datumregel, the five-column manifest shape and the not-reproducible-artefact precedent this directory inherits"
provides:
  - "docs/baseline/2026-09-22/legacy-site-mirror/ — 94-file, 2.2 MB offline-renderable capture of the 10 public legacy URLs, taken while the old site still served WordPress"
  - "CAPTURE.md — the verbatim command, wget version, UTC timestamps, measured footprint, and the date this artefact stops being reproducible"
  - "docs/baseline/2026-09-22/README.md — the Phase 10 evidence manifest that 10-04, 10-07, 10-08, 10-09 and 10-10 all land their artefacts in"
affects: [10-04, 10-07, 10-08, 10-09, 10-10]

# Tech tracking
tech-stack:
  added: ["wget 1.25.0 (Homebrew, dev machine only — never in package.json, never in the Vercel build)"]
  patterns:
    - "Evidence directories resolve by glob, never by hardcoded date: `ls -d docs/baseline/*/legacy-site-mirror | head -1 | xargs dirname`"
    - "A recorded command must reproduce exactly what was committed — if the capture needs pruning, fix the command and re-capture rather than prune-then-record"

key-files:
  created:
    - docs/baseline/2026-09-22/legacy-site-mirror/ (94 files)
    - docs/baseline/2026-09-22/legacy-site-mirror/CAPTURE.md
    - docs/baseline/2026-09-22/README.md
  modified: []

key-decisions:
  - "CAPTURE_DATE is 2026-09-22 — this is the directory every later Phase 10 artefact joins, and it is never renamed even if the cutover falls on another date"
  - "Added --reject-regex '(wp-json|xmlrpc)' to RESEARCH Pattern 6's invocation and re-crawled, rather than pruning the first result, so the recorded command reproduces the committed tree exactly"
  - "Kept the 8 index.html@p=NN.html duplicates, feed/, comments/ and robots.txt — public content and crawl policy, not install internals; removing them would be scope creep"
  - "wget exit code 8 is the expected outcome here: four Oxygen theme font files 404 for real visitors too"

patterns-established:
  - "Pruning an artefact after recording its command breaks reproducibility in the dangerous direction — the next person to run the recipe silently regains what you removed"

requirements-completed: [MIG-01]

# Metrics
duration: 38 min
completed: 2026-09-22
---

# Phase 10 Plan 02: The Legacy Content Mirror Summary

**94-file, 2.2 MB offline-renderable `wget` capture of all 10 public `tpsventilatie.nl` URLs committed at `docs/baseline/2026-09-22/legacy-site-mirror/`, taken while the old site still served WordPress on 195.78.67.39 — with a command record that reproduces it exactly and states the date it stops being reproducible**

## Performance

- **Duration:** 38 min (including two crawls — see Deviations)
- **Started:** 2026-09-22T11:52Z
- **Completed:** 2026-09-22T12:08:26Z (final crawl), committed 2026-09-22
- **Tasks:** 2
- **Files created:** 96 (94 mirror files + CAPTURE.md + README.md)

## Accomplishments

- **MIG-01 as amended is discharged.** The content of the site being retired now exists in a form that survives the cutover. This was the one task in the phase with a deadline that is not a date — it had to happen before 10-09 moves the A records, and it did.
- **The capture is reproducible from its record, and honest about when it stops being so.** `CAPTURE.md` carries the verbatim command with a flag-by-flag rationale, `GNU Wget 1.25.0`, the UTC window, the measured footprint, and the four expected 404s. Its `opnieuw maken` cell follows the `dns/…-pre-switch-…txt` precedent: reproducible *only while the old site still serves*, and the sole evidence of the pre-cutover content after that.
- **D-28's ceiling was measured, not assumed.** 2.21 MB against a ~25 MB ceiling — RESEARCH predicted 2–5 MB from a 1.6 MB source measurement and was right. The images-to-external-storage branch stayed a documented contingency.
- **The privacy gate passed on evidence.** Zero `wp-admin`/`wp-login`/`wp-json` artefacts; exactly one email address across all HTML/CSS/JS/TXT/XML/SVG — the public `info@tpsventilatie.nl`.
- **The Phase 10 evidence directory exists and is wired for what comes next.** `README.md` inherits the 2026-09-16 datumregel verbatim in its own words, and §3 pre-declares the rows 10-04, 10-07, 10-08, 10-09 and 10-10 will add.

## Task Commits

1. **Task 1 + Task 2: capture, record, manifest, privacy gate** — `a86f3ad` (docs)

_Note: the plan scoped Task 1 as "capture, do not commit yet" and Task 2 as "record + gate + commit". Nothing enters git until the gate passes, so both tasks land in one commit by the plan's own design._

## Files Created/Modified

- `docs/baseline/2026-09-22/legacy-site-mirror/` — 94 files: `index.html` + 9 `<slug>/index.html`, `wp-content/` (70 — Oxygen CSS, plugin assets, media library with srcset variants), `wp-includes/` (3), 8 `index.html@p=NN.html` permalink duplicates, `feed/`, `comments/`, `robots.txt`.
- `docs/baseline/2026-09-22/legacy-site-mirror/CAPTURE.md` — Dutch, matching the baseline register. §1 what it is and what it is *not* (not an install, cannot restore a site), §2 the command + flag table, §3 tree contents and the four 404s, §4 the reject-regex rationale, §5 reproducibility window, §6 how to check it offline.
- `docs/baseline/2026-09-22/README.md` — privacy line with the D-28 and D-23 carve-outs, §1 datumregel + the glob idiom, §2 two-row manifest, §3 the five artefacts still to come, §4 the rules that stay in force (never delete the GSC TXT; never touch the install; never update the mirror).

## Decisions Made

- **`CAPTURE_DATE = 2026-09-22.** Later plans must resolve this with `ls -d docs/baseline/*/legacy-site-mirror | head -1 | xargs dirname`, not by hardcoding the date — stated in both the README and this summary because five plans depend on it.
- **Kept the `?p=NN` duplicates.** They are the shortlink form WordPress advertises in every page head; they prove the `?p=` form 301'd to the clean URL while the site was live. Cheap, and evidence.
- **Two crawls, both polite.** `--wait=1 --random-wait` throughout; ~94 requests a second apart against a brochure site. The threat model names courtesy to a box we do not own, and a second pass at that spacing is well inside it.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added `--reject-regex '(wp-json|xmlrpc)'` to the RESEARCH Pattern 6 invocation and re-crawled**

- **Found during:** Task 1 (the first crawl, while it was still running)
- **Issue:** The plan's own Task 2 privacy gate asserts no `wp-json` artefact is in the tree — but the Task 1 command it told me to run verbatim *produces* them. WordPress puts `<link rel="alternate" type="application/json+oembed">` and an RSD link to `xmlrpc.php` in every page head; `--page-requisites` follows both, and `robots.txt` (which disallows only `/wp-admin/`) does not stop them. The first crawl pulled 10 `wp-json` files plus `xmlrpc.php@rsd`.
- **Why this was worth a second crawl rather than a prune:** the captured files carried `"author_name":"root"` — the WordPress admin account name — in every oembed response, the full REST namespace list including `contact-form-7/v1`, and per-page `data-secret` tokens. D-02 explicitly accepts that this install will rot unpatched at WP 7.1.1. Committing "the admin account is called root" plus a plugin inventory permanently into a public repo enlarges that accepted risk for no gain. The gate was right, and for a better reason than tidiness.
- **Fix:** moved the first tree aside, added `--reject-regex '(wp-json|xmlrpc)'`, re-ran, and recorded *that* command in `CAPTURE.md` §4 with the full rationale. Pruning the first result instead would have left a recorded recipe that silently re-leaks for whoever runs it next — the failure mode pointing the wrong way.
- **Files modified:** the invocation in `CAPTURE.md` §2 and its rationale row; the mirror tree itself.
- **Verification:** `find` for `wp-json|xmlrpc|wp-admin|wp-login` → 0 files; `grep -rl author_name` → 0; the plan's own Task 2 gate → `privacy gate clean (1 address(es), all allowed)`.
- **Committed in:** `a86f3ad`

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** No scope change — the deliverable is exactly what the plan specified. The command in the record is one flag longer than RESEARCH Pattern 6, and §4 of `CAPTURE.md` explains why so the next reader does not "restore" the original.

## Issues Encountered

- **`wget` exits 8, and that is the pass condition here.** Four Oxygen theme font files (`inter/Inter-VariableFont_slnt,wght.woff2` and three `cardo/*.woff2`) 404 — they are referenced by theme CSS but absent from the server, so they 404 for ordinary visitors too. Recorded in `CAPTURE.md` §3 so nobody later reads exit 8 as a broken capture.
- **The crawl is slower than it looks.** `--wait=1 --random-wait` over ~94 requests plus `--level=2` recursion into `?p=` permalink forms meant 2m38s per pass. Worth knowing for 10-07, which probes live.

## User Setup Required

None — no external service configuration required. `wget` was installed via Homebrew on the dev machine only; it is not in `package.json` and never reaches the Vercel build.

## Next Phase Readiness

- **MIG-01 is now genuinely satisfied** — both the amended requirement text (10-01) and the artefact it describes (this plan). The REQUIREMENTS checkbox flips with this plan's close-out, which is the flip 10-01 deliberately withheld.
- **Wave 1 completes once 10-03 lands.** 10-04 (wave 2) depends on this plan and is unblocked: its `docs/baseline/<capture-date>/owner/` resolves to `docs/baseline/2026-09-22/owner/`.
- **The hard ordering constraint is discharged.** The mirror exists before any DNS change; 10-09 can move the A records without destroying unrecoverable evidence.
- **Carry forward:** every later Phase 10 plan must resolve this directory by glob. It is stated in `README.md` §1 and in the key-decisions above.

---
*Phase: 10-reversible-old-brand-migration*
*Completed: 2026-09-22*

## Self-Check: PASSED

- Task 1 gate re-run at close: `mirror OK: 94 files, 2.21 MB, 10 pages present, offline references resolve`.
- Task 2 gate re-run at close: `record + manifest present; privacy gate clean (1 address(es), all allowed)`.
- Second Task 2 automated check: `git log -1 --name-only | grep -c legacy-site-mirror` → 95, mirror is committed.
- All 9 acceptance criteria across both tasks verified by executed command.
- `key-files.created` — all three confirmed on disk and in commit `a86f3ad`.
