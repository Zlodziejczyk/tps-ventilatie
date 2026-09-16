---
phase: 09-measurement-foundation
plan: 01
subsystem: measurement
tags: [dns, dig, gsc, gbp, baseline, docs]

# Dependency graph
requires:
  - phase: 08-indexation-unlock
    provides: INDEXABLE_FLOOR = 27 and the sitemap processed at 27 (the number the GSC screenshot evidences)
provides:
  - scripts/snapshot-dns.sh — read-only, diffable, timestamped zone snapshot CLI (D-14)
  - docs/baseline/2026-09-16/ skeleton with README manifest, D-26/D-27 decision records, D-06/D-07 rule
  - Pre-switch cyberfolks zone (SOA 2024020301), 33/33 dd24 mirror proof, both live post-switch zones
  - GSC evidence for MEAS-03 (sitemap Success 27, legacy Domain property verified)
  - GBP state transcribed with 9 deviations vs SITE for Phase 11 (D-15)
affects: [09-02, 09-03, 09-06, 10-migration, 11-gbp-citations]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Read-only dig snapshot with headers byte-compatible with the hand-taken capture so diff works across dates"
    - "Baseline manifest rows carry their own taken: timestamp (D-27); placeholders ⬜ <plan> are resolved by the named plan"

key-files:
  created:
    - scripts/snapshot-dns.sh
    - docs/baseline/2026-09-16/README.md
    - docs/baseline/2026-09-16/dns/tpsventilatie.nl-pre-switch-2026-09-16T175840Z.txt
    - docs/baseline/2026-09-16/dns/tpsklimaattechniek.nl-2026-09-16T175843Z.txt
    - docs/baseline/2026-09-16/dns/dd24-records-to-enter.md
    - docs/baseline/2026-09-16/dns/dd24-mirror-verification.txt
    - docs/baseline/2026-09-16/dns/dd24-zone-table.jpg
    - docs/baseline/2026-09-16/dns/tpsventilatie.nl-2026-09-16T203208Z.txt
    - docs/baseline/2026-09-16/dns/tpsklimaattechniek.nl-2026-09-16T203209Z.txt
    - docs/baseline/2026-09-16/gsc/sitemap-success-27.jpg
    - docs/baseline/2026-09-16/gsc/legacy-domain-property-verified.jpg
    - docs/baseline/2026-09-16/gbp/gbp-state.md
    - docs/baseline/2026-09-16/gbp/gbp-profile-manager-locations-2026-09-16T203932Z.jpg
    - docs/baseline/2026-09-16/gbp/gbp-profile-manager-reviews-2026-09-16T203944Z.jpg
  modified: []

key-decisions:
  - "Snapshot filenames use <zone>-YYYY-MM-DDTHHMMSSZ.txt (matching the rescued evidence names) rather than the compact YYYYmmddTHHMMSSZ the plan text used — one naming scheme inside dns/"
  - "GBP knowledge panel and profile editor transcribed verbatim from page text (the Chrome extension may read www.google.com but not screenshot it); provenance screenshots taken on business.google.com; knowledge-panel screenshot deferred to 09-06 once google.nl is permitted"
  - "Requirement IDs (MEAS-03/04) are marked complete at phase close via phase.complete, not after this plan — the baseline is only partly captured until 09-06"

patterns-established:
  - "Evidence rescue: copy scratchpad files byte-identical (cmp), rename only to disambiguate, never edit contents"
  - "Every DNS interaction in Phase 9 is a read; the script's verify greps reject write verbs"

requirements-completed: [MEAS-04, MEAS-03]

# Metrics
duration: 13min
completed: 2026-09-16
---

# Phase 9 Plan 01: Baseline directory, DNS snapshot script, evidence rescue, GBP state Summary

**Read-only `dig` zone snapshot CLI plus a committed `docs/baseline/2026-09-16/` that rescues the pre-switch cyberfolks zone and the 33/33 dd24 mirror proof, records D-26 (legacy delegation moved to dd24, with rollback) and D-27, and transcribes the Google Business Profile — still the old brand, 38 reviews at 4,9, a landline the site never shows, and three provinces as service area — as diffable text for Phase 11.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-09-16T20:29:38Z
- **Completed:** 2026-09-16T20:42:30Z
- **Tasks:** 3
- **Files modified:** 14 created

## Accomplishments

- `scripts/snapshot-dns.sh` (D-14): resolves the authoritative NS, writes `SOA NS A MX TXT` + `www/mail/ftp/smtp/pop A` + `_dmarc` + `x`/`titan1` DKIM + `autoconfig` CNAME + `_autodiscover._tcp` SRV + DS per zone, with the three header lines byte-compatible with the 2026-09-16 hand-taken files. Record set of the new domain diffs IDENTICAL to the 17:58Z capture. Read-only by construction (no write verbs; verify greps enforce it).
- Live post-switch snapshots of both zones: `tpsventilatie.nl` now delegated to `ns1/2/3.domaindiscount24.net` (D-26) while still serving WordPress at `195.78.67.39` (D-06), GSC TXT `DvCnCNBb…` present (D-07), SPF still carries `a` (Phase 10 MIG-02 territory — untouched); `tpsklimaattechniek.nl` with its GSC TXT, Titan mail records and the `www` CNAME to Vercel.
- Seven scratchpad evidence files rescued byte-identical (`cmp`), including the only surviving view of the legacy zone as cyberfolks served it (SOA serial `2024020301`) and the 33/33 PASS mirror verification.
- Dutch `README.md`: manifest with `taken:` per file, D-26 with the exact dd24 rollback (`Externe nameserver` → `ns1/2/3.cyberfolks.pl`, TTL notes), residual DKIM-selector risk, Phase 10 consequence; D-27 date rule; D-03 marked superseded; D-06 and **D-07 (never remove either `google-site-verification` TXT)** in bold; what each GSC screenshot proves (27 = `INDEXABLE_FLOOR`); a diff-hint explaining the three kinds of non-semantic noise between the pre- and post-switch files.
- GBP transcription (D-15) with provenance: name `TPS ventilatie , airco's en warmtepompen`; primary `Installation service` + `Chimney services` + `Air conditioning contractor` (plus an unapproved pending edit adding `Air conditioning repair shop`); website `http://tpsventilatie.nl/`; service area Zuid-Holland / Noord-Brabant / Noord-Holland; **38 reviews / 4,9**; phone `079 204 6078`; hours ma–za 07:00–20:00; opening date 1 April 2009; description verbatim. Nine deviations vs `SITE` listed for Phase 11.

## Task Commits

Each task was committed atomically:

1. **Task 1: snapshot-dns.sh + live snapshots** - `7da2cb8` (feat)
2. **Task 2: evidence rescue + README with D-26/D-27** - `db94aeb` (docs)
3. **Task 3: GBP state transcription (read-only)** - `6c05e7e` (docs)

**Plan metadata:** see the `docs(09-01): complete …` commit that carries this SUMMARY.

## Files Created/Modified

- `scripts/snapshot-dns.sh` - D-14 read-only zone snapshot CLI (`bash scripts/snapshot-dns.sh <zone>… [--out <dir>]`)
- `docs/baseline/2026-09-16/README.md` - manifest, D-26/D-27/D-03-superseded, D-06/D-07 rules, GSC screenshot meaning, diff-hint, §6 retake stub for 09-06
- `docs/baseline/2026-09-16/dns/*` - 2 rescued zone captures, mirror plan, mirror verification, dd24 screenshot, 2 live snapshots
- `docs/baseline/2026-09-16/gsc/sitemap-success-27.jpg`, `legacy-domain-property-verified.jpg` - MEAS-03 / D-05 #2 evidence
- `docs/baseline/2026-09-16/gbp/gbp-state.md` + 2 Business Profile Manager screenshots - D-15 transcription with deviations

## Decisions Made

- Snapshot filename stamp `YYYY-MM-DDTHHMMSSZ` (matches the rescued files) instead of the compact form in the plan text — within the naming discretion CONTEXT grants.
- The knowledge panel and the profile editor live on `www.google.com`, where the extension can read page text but not screenshot; values were transcribed verbatim from `#rhs` innerText and the same-origin `editprofile/info` iframe, and the provenance screenshots come from `business.google.com` (Businesses list, Reviews). The knowledge-panel screenshot is deferred to 09-06, when `www.google.nl` must be permitted anyway for the SERP baseline.
- `requirements.mark-complete` is deferred to `phase.complete`: MEAS-03/MEAS-04 span 09-01/02/03/06 and a half-captured baseline must not read as done.

## Deviations from Plan

**[Rule 3 - Blocker] Screenshots on www.google.com are blocked by extension site permissions** — Found during: Task 3 | Issue: the plan asked for `gbp-profile-<UTC>.png` (editor view) and `knowledge-panel-<UTC>.png` (public SERP panel); both pages are on `www.google.com`, where the extension returned "Permission denied for this action on this domain" for screenshots and refused navigation to `www.google.nl` outright | Fix: transcribed every D-15 field from page text (knowledge panel `#rhs` + the same-origin editor iframe), took the two provenance screenshots on `business.google.com` (permitted), and recorded the limitation inside `gbp-state.md` | Files: `docs/baseline/2026-09-16/gbp/*` | Verification: plan verify passes (labels + ≥1 screenshot); the human-check (values vs image) is partially covered — name/address/Verified/reviews are on the screenshots, categories/hours/service area only in text | Commit: `6c05e7e`

**Total deviations:** 1 auto-handled (blocker worked around). **Impact:** none on the requirement; the missing knowledge-panel image is queued for 09-06, where the same permission unblocks the SERP baseline.

## Issues Encountered

- Extension permissions: `www.google.com` allows reads (`get_page_text`, `find`, JavaScript) but not screenshots; `www.google.nl` navigation is refused. **09-06's SERP baseline needs the user to grant the Claude Chrome extension access to `www.google.nl` (and ideally `www.google.com`).** Also, a freshly created MCP tab was refused navigation to `business.google.com` while the original tab was allowed — reuse the original tab for permitted domains.
- Findings (not defects of this plan, handed to Phase 11/12): review count is 38 (site `REVIEW_RATING.count` = 34); GBP phone is a landline `079 204 6078` absent from the site; service area = three provinces vs 8 towns / 60 km on the site; hours 07:00–20:00 vs 08:00–17:30; a category edit sits in GBP as NOT APPROVED; 2 "Google updates" are pending in the Manager.

## User Setup Required

None.

## Next Phase Readiness

- 09-02 can start immediately (independent of 09-01); the baseline `gsc/` folder is ready to receive the exports, and the README manifest has its `⬜ 09-02` row.
- Phase 10 already has what it needs from this plan for the DNS side: the pre-switch zone, the rollback recipe, and a re-runnable diff (`bash scripts/snapshot-dns.sh tpsventilatie.nl --out docs/baseline/<date>/dns`).
- Phase 11 has the GBP values at risk recorded as text.

## Self-Check: PASSED

- `[ -f scripts/snapshot-dns.sh ]` ✓ · `[ -f docs/baseline/2026-09-16/README.md ]` ✓ · all 14 key files exist on disk ✓
- `git log --oneline --grep="09-01"` → 3 task commits (7da2cb8, db94aeb, 6c05e7e) ✓
- Task 1 acceptance: purpose header, `set -euo pipefail`, `+noall +answer`, three header prefixes, two `.txt` per run with both TXT tokens + dd24 NS + `195.78.67.39`, no write verbs, two live files committed ✓
- Task 2 acceptance: 7 evidence files present and unchanged (33 PASS lines, `2024020301` present); README has D-26/D-27/D-07/`cyberfolks.pl`/`taken`/`INDEXABLE_FLOOR`, placeholder rows for 09-02/09-03/09-06, D-03 superseded, bold never-remove rule ✓
- Task 3 acceptance: `taken:` + all seven D-15 labels + `Afwijkingen`; 2 screenshots in `gbp/`; nothing edited in GBP ✓
