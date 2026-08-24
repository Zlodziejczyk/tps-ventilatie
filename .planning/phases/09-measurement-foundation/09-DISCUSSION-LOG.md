# Phase 9: Measurement Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-24
**Phase:** 9-Measurement Foundation
**Areas discussed:** Execution model, GSC property shape, Baseline artefact, Weekly review (MEAS-05)

---

## Area selection

| Option | Description | Selected |
|--------|-------------|----------|
| Execution model | Who drives the Google/Vercel dashboards — Chrome automation, runbook, or API | ✓ |
| GSC property shape | Domain vs URL-prefix properties; the wired-but-unset verification meta-tag seam | ✓ |
| Baseline artefact | Location, format, and how the ranking snapshot is taken | ✓ |
| Weekly review (MEAS-05) | Mechanism, thresholds, runner; and Phase 8's deferred post-deploy automation | ✓ |

**User's choice:** all four.

---

## Execution model

### Q1 — Primary execution surface for the Google/Vercel dashboard work

| Option | Description | Selected |
|--------|-------------|----------|
| Claude drives Chrome | claude-in-chrome against the logged-in Google session; fast, evidence captured inline; needs Chrome open and per-site permission | ✓ |
| Runbook, you execute | Numbered runbook in the `seo-owner-runbook.md` pattern; zero automation risk but a calendar dependency in front of Phase 10 | |
| API-first where possible | Service account + Search Console API; highest setup cost, best compounding | |
| Hybrid: Chrome now, API later | Chrome for one-time setup, API only if the weekly ritual proves it worth it | |

**User's choice:** Claude drives Chrome.
**Notes:** The hybrid framing effectively survived anyway — the API was later adopted for the recurring work only (see Weekly review Q1), which is the split the hybrid option described.

### Q2 — Which Google account owns the four GSC properties

| Option | Description | Selected |
|--------|-------------|----------|
| Pushly account, client delegated | Verify from the agency account, add Thomas as delegated Owner per property | ✓ (after clarification) |
| Client's account (same as GBP) | Verify from Thomas's account; cleanest handover, reintroduces the calendar dependency | |
| Pushly only, delegate at handover | Fewest moving parts; client can't see the milestone evidence | |

**User's choice:** free text — *"as of currently i'am added to thomas's GBP as an administrator, but he's the owner. if that's what you mean."* then *"alright your call."*
**Notes:** Clarified that Google Business Profile and Search Console are separate permission systems — GBP admin access does not grant GSC access, and zero GSC properties exist on either domain. GBP admin access *is* sufficient for the MEAS-04 snapshot, which is a read. User delegated the GSC decision; recorded as option 1.

### Q3 — Who touches the two DNS control panels (dd24 + opeiron)

| Option | Description | Selected |
|--------|-------------|----------|
| Claude drives both panels | Same Chrome session; fastest, but dd24 has a suspension history and both zones carry live mail | |
| You place TXT, I verify + finish | Claude supplies exact values, user pastes, Claude confirms with dig and completes GSC | ✓ |
| Claude on dd24, you on opeiron | Split by risk — the legacy zone carries the client's live mailbox | |

**User's choice:** You place TXT, I verify + finish.

### Q4 — Evidence standard for dashboard steps

| Option | Description | Selected |
|--------|-------------|----------|
| Machine proof + re-runnable script | Committed assertions for anything HTTP-observable; screenshots only where nothing is | ✓ |
| Screenshots + dated checklist | Simple, no new code, but a snapshot of a moment | |
| Machine proof only | Leanest, but MEAS-04's GBP state has no HTTP-observable form | |

**User's choice:** Machine proof + re-runnable script.
**Notes:** Framed against this project's history — three build guards sat RED for weeks because nothing executed them, and a green build shipped a fully-noindexed site.

---

## GSC property shape

### Q1 — Property shape

| Option | Description | Selected |
|--------|-------------|----------|
| 2 Domain + legacy URL-prefixes | Domain properties on both zones plus URL-prefix properties on both legacy hostnames, verified now by HTML file while WordPress is still live | ✓ (Claude's call) |
| 2 Domain properties only | Minimum surface; risks needing legacy properties after the repoint | |
| 4 URL-prefix properties | Literal reading of MEAS-01/02 but forecloses Change of Address's domain-level requirement | |

**User's choice:** free text — *"your call on the best approach for best results."*
**Notes:** Claude selected option 1 and added a fifth property (URL-prefix on `https://www.tpsklimaattechniek.nl/`) as ownership insurance, activating the already-wired `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` seam. Recorded in CONTEXT.md as D-05 and D-08, with the fifth property explicitly noted as beyond the success criterion.

### Decided without a question (live probe)

- **No legacy sitemap submission** — `https://tpsventilatie.nl/wp-sitemap.xml` returns HTTP 404 with an XML body; GSC would refuse it (D-09).
- **Indexing requests stay at the 5 named URLs** — beyond those, Request-indexing is quota-limited and the 27-URL sitemap does the work (D-11).

---

## Baseline artefact

### Q1 — How the ranking snapshot is captured

| Option | Description | Selected |
|--------|-------------|----------|
| GSC export only | Free, zero setup; blind to queries the site does not yet rank for | |
| GSC export + manual SERP baseline | ~15–25 geolocated manual checks from the taxonomy keyword map, recording honest zeroes | ✓ |
| Sign up for a rank tracker | Continuous trend line plus volume data for Phase 12; recurring cost | |

**User's choice:** GSC export + manual SERP baseline.
**Notes:** The deciding argument was that a GSC export structurally cannot evidence "we went from ranking nowhere to page one" — the absences have to be recorded deliberately.

### Q2 — Where the baseline lives

| Option | Description | Selected |
|--------|-------------|----------|
| `docs/baseline/2026-08-24/` | Operational tree next to the owner runbook; survives milestone archiving; findable during an incident | ✓ |
| `.planning/baselines/2026-08-24/` | With the milestone evidence, but that tree gets archived and pruned | |
| Split across both | Each artefact by audience, at the cost of no single artefact to point at | |

**User's choice:** `docs/baseline/2026-08-24/`.

### Decided without a question

- **DNS zone snapshot** = a committed `dig`-based script producing timestamped, diffable output per zone, not a registrar export — because Phase 10's rollback is "revert two A records" and needs a re-runnable comparison (D-14).
- **GBP state** = screenshot for provenance plus transcribed fields, because Phase 11 must diff values, not images (D-15).

---

## Weekly review (MEAS-05)

### Q1 — What performs the weekly review

| Option | Description | Selected |
|--------|-------------|----------|
| Committed script + GSC API | Service account, ~an hour of setup, then free forever and runnable by anything | ✓ |
| Scheduled Claude routine in Chrome | No API setup, but depends on this machine and breaks silently when GSC's UI changes | |
| Human ritual + checklist doc | Zero infrastructure, and the documented failure mode of this project | |

**User's choice:** Committed script + GSC API — with the follow-up question *"does it cost money?"*
**Notes:** Answered: the Search Console API is free and needs no billing account; quotas are 2,000 URL inspections/day and 600/minute per property against a 27-page site. Correction issued in the same turn: the aggregate Index Coverage report is **not** exposed by the API, so the design uses the URL Inspection API per-URL across all 27 URLs instead — which yields `coverageState`, `robotsTxtState`, last crawl time and Google's canonical vs. ours, naming the specific stuck page rather than a bucket count.

### Q2 — Thresholds

| Option | Description | Selected |
|--------|-------------|----------|
| Calendar ramp + regressions | ≥10/27 by wk2, ≥20 by wk4, ≥25 by wk8, plus immediate flags on lost indexation, robots state, canonical mismatch | ✓ |
| Two rules only | Not-indexed-after-8-weeks and lost-indexation; almost no false alarms, eight quiet weeks | |
| Migration-relative | Anchored on the cutover instead of the calendar; goes silent during first indexation | |

**User's choice:** Calendar ramp + regressions.

### Q3 — What runs the script

| Option | Description | Selected |
|--------|-------------|----------|
| GitHub Actions cron | Weekly, commits the reading, opens an issue on breach; no machine dependency; makes Phase 8's deferred post-deploy probe nearly free | ✓ |
| Scheduled Claude routine | Interprets rather than diffs, but depends on this machine and the OneDrive mount | |
| Manual `npm run measure` | Zero setup; would mean admitting the real cadence is "when something feels off" | |

**User's choice:** GitHub Actions cron.
**Notes:** This creates the first CI on the repo — a GitHub remote exists (`Zlodziejczyk/tps-ventilatie`) but no `.github/` directory. Phase 8's deferred post-deploy `verify-indexation.ts` automation was folded in on the strength of this choice (D-22), an explicit scope addition beyond MEAS-01…06.

---

## Claude's Discretion

Areas where the user explicitly delegated ("your call", "alright your call"), plus items left to the planner:

- GSC property ownership account and delegation model (Q2 above) — resolved as Pushly-owned with Thomas delegated.
- GSC property shape (Q1 above) — resolved as 2 Domain + 2 legacy URL-prefix + 1 insurance property.
- Script and module naming within the existing `assert-*` / `verify-*` family.
- GitHub Actions workflow structure, schedule time, and reporting shape.
- The exact 15–25 query shortlist and SERP geolocation mechanics.
- Whether the service account needs Owner or Full-user permission for the URL Inspection API — to be confirmed at implementation.
- Baseline directory layout (README index vs single BASELINE.md).
- Branch vs. `main` for this phase's repo changes.

## Deferred Ideas

- Reconcile `docs/seo-owner-runbook.md` §2/§3 with the new execution model — candidate task in this phase's tail.
- Re-take the baseline at milestone close for a before/after pair (belongs to milestone completion).
- Vercel plan-tier data retention for Web Analytics as milestone evidence — check when enabling.
- Search Analytics API for query-level trend reporting — natural extension, deliberately out of scope so MEAS-05 stays about indexation; wanted by Phase 12's keyword→page map.
- A paid rank tracker — rejected on recurring cost; revisit if the manual snapshot proves too coarse in Phase 12.
- Broader CI (lint/typecheck/prebuild on PRs) on the new Actions foundation — separate decision.
