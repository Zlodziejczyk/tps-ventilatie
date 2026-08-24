# Phase 9: Measurement Foundation - Context

**Gathered:** 2026-08-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Be able to **prove what this milestone did**, and **capture the pre-migration state while it still
exists**. Google Search Console verified across every hostname variant of both domains, the sitemap
submitted and processed, indexing requested for the hub + 4 pillars, a committed baseline artefact
(GSC export, ranking snapshot, GBP state, full DNS zone snapshot), Vercel Analytics reporting, and a
weekly indexation review that actually runs.

**In scope:** MEAS-01 (new-domain variants verified), MEAS-02 (legacy variants verified *while legacy
DNS still resolves to WordPress*), MEAS-03 (sitemap submitted + indexing requested for 5 URLs),
MEAS-04 (pre-migration baseline captured and committed), MEAS-05 (weekly indexation review with
defined thresholds), MEAS-06 (Vercel Analytics enabled and reporting) — plus, by explicit decision
(D-22), Phase 8's deferred post-deploy automation of `scripts/verify-indexation.ts`, which rides
along on the CI this phase stands up anyway.

**Not in scope (belongs elsewhere):** the Change of Address submission, the legacy redirect map, and
the DNS repoint (Phase 10 — hard-gated *behind* this phase); any GBP *edit* — this phase only
snapshots GBP state, Phase 11 changes it; the keyword→page map and title/meta rewrite that will
*consume* this measurement data (Phase 12); the repo/Vercel rename (Phase 13).

**Why the timing is load-bearing:** live-probed 2026-08-24, `tpsventilatie.nl` still resolves to
WordPress (`195.78.67.39`, HTTP 200). Legacy GSC verification by HTML file is a one-minute job today
and becomes an awkward thing we have to build into our own Next app the moment Phase 10 repoints the
apex. This phase exists to spend that window.

</domain>

<decisions>
## Implementation Decisions

> Carried-forward locks that are **NOT re-opened**: GA4 stays deliberately out — Vercel Web Analytics
> + Speed Insights only, cookieless, no consent banner (P3, LEAD-06). `lib/seo/policy.ts` is the only
> place sitemap membership and the `robots` directive are decided (P1 D-08, P3 D-02). Build gates are
> `tsx` + `node:assert` CLIs, not a test framework (P8). Vercel preview is the build gate; there is no
> local `next build` on this OneDrive mount (P8 D-08). `INDEXABLE_FLOOR` is the single named source of
> "how many pages complete looks like" (P8 D-25).

### Execution Model & Access

- **D-01 — Claude drives Chrome for the Google-side work.** Verification completion, sitemap
  submission, indexing requests, the performance export and the GBP snapshot are done by Claude via
  the `claude-in-chrome` tools against the user's logged-in Google session. **Consequence for
  planning:** phase-9 plans must contain executable browser steps with a stated expected result per
  step — not runbook prose handed to a human. Rejected: a runbook the owner executes (Phase 10 is
  hard-gated behind this phase, so a calendar dependency here stalls the whole milestone) and
  API-first for the one-time setup (verification cannot be API'd anyway).
- **D-02 — GSC properties are created under the Pushly/Oskar Google account; Thomas is added as a
  delegated Owner on every property.** Operational control stays with the agency, the client is never
  locked out, and the milestone's success evidence is visible to both. **Google Business Profile
  access is a separate permission system and is unchanged** — Thomas owner, Oskar administrator — and
  that admin access is already sufficient for the MEAS-04 GBP snapshot, which is a read.
- **D-03 — The user places the DNS TXT records by hand in both registrar panels; Claude supplies the
  exact host/value per zone and confirms with `dig` before completing verification in GSC.** The two
  zones sit at different registrars (`ns1/2/3.domaindiscount24.net` for the new domain,
  `ns1/ns2.opeiron.com` for the legacy) and **both carry live mail** — Titan on the new domain, the
  cyberfolks MX and `mail` A record on the legacy. The blast radius of a stray edit there is an order
  of magnitude worse than anything in GSC, and dd24 has already suspended this domain once (2026-08-12,
  contact verification).
- **D-04 — Evidence standard: machine proof plus a committed, re-runnable script for anything
  HTTP-observable; screenshots only for what has no machine form.** Extends the existing
  `scripts/assert-*.ts` family. Assertable: TXT records resolving in both zones, the verification meta
  tag present in served HTML, the sitemap reachable and carrying `INDEXABLE_FLOOR` URLs, the analytics
  beacon in served HTML. Screenshot-only: GBP state, GSC coverage panels. **Rationale is this
  project's own scar tissue** — three build guards sat RED for weeks because nothing executed them,
  and a green build shipped a fully-noindexed site. One-time confirmations rot; assertions do not.

### GSC Property Shape & Verification (MEAS-01, MEAS-02)

- **D-05 — Four properties, with redundancy concentrated where the window closes:**
  1. **Domain** `tpsklimaattechniek.nl` — DNS TXT at dd24
  2. **Domain** `tpsventilatie.nl` — DNS TXT at opeiron ← *the property Phase 10's Change of Address
     runs from*
  3. **URL-prefix** `https://tpsventilatie.nl/` — HTML file on the WordPress root
  4. **URL-prefix** `https://www.tpsventilatie.nl/` — same file

  A Domain property inherently covers http/https, www/apex and any subdomain, which satisfies both the
  CoA domain-level requirement and the success criterion's "both variants of each domain". The two
  legacy URL-prefix properties exist because Google's revised 2026-06-17 site-move guidance asks for a
  CoA covering **every verified variant** of the old domain, and because an HTML file on a live
  WordPress install is trivial *today* and a wart we would have to build *after* the repoint.
- **D-06 — Legacy verification happens before anything in Phase 10 moves.** This is the entire reason
  Phase 9 precedes Phase 10; it is not a soft preference.
- **D-07 — Legacy verification is never removed after the repoint.** The 180-day redirect floor means
  the legacy property must stay verified and monitored well past this milestone. Deleting the TXT
  record or the HTML file to "clean up" would silently drop the property.
- **D-08 — Activate the wired-but-unset `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` seam and verify a fifth
  property: URL-prefix `https://www.tpsklimaattechniek.nl/`.** The seam already exists end-to-end
  (`lib/constants.ts` → `app/layout.tsx` `verification.google`) but has never been given a value, so it
  is code that looks live and is not — precisely the class this project keeps getting bitten by. Cost
  is one Vercel env var and one redeploy. Buys: a second, independent property on the domain that earns
  the money, surviving any future loss of the dd24 TXT record; and a served meta tag that D-04's assert
  script can check. Explicitly beyond the "four properties" success criterion, and recorded as such.
- **D-09 — No legacy sitemap submission.** Live-probed 2026-08-24: `https://tpsventilatie.nl/wp-sitemap.xml`
  returns **HTTP 404 with an XML body**; GSC would refuse it. The legacy properties exist for the
  performance export and the Change of Address, nothing else.

### Sitemap & Indexing Requests (MEAS-03)

- **D-10 — Submit `https://www.tpsklimaattechniek.nl/sitemap.xml`** in the new-domain properties.
  Success is not "submitted" but "GSC reports it processed with **27** discovered URLs" — the same
  number `INDEXABLE_FLOOR` fixes in the build gate and `verify-indexation.ts` asserts on live output.
  If GSC's discovered count disagrees with 27, that is a finding, not a rounding difference.
- **D-11 — Indexing requested for exactly the 5 URLs the requirement names** (the `/diensten` hub +
  4 pillars). Beyond those, "Request indexing" is quota-limited, guarantees nothing, and the 27-URL
  sitemap does the actual work. Not a place to spend effort.

### Baseline Artefact (MEAS-04)

- **D-12 — The baseline lives in `docs/baseline/2026-08-24/`** — the operational tree, next to
  `docs/seo-owner-runbook.md`. It survives milestone archiving untouched, and the DNS zone snapshot is
  the thing someone reaches for *during an incident*, not while reading planning artefacts. Rejected:
  `.planning/baselines/` (gets pruned/archived at milestone close; nobody looks there at 3am) and a
  split across both trees (success criterion 3 asks for one artefact you can point at).
- **D-13 — Ranking snapshot = the GSC performance export PLUS a manual geolocated SERP baseline.** A
  fixed shortlist of ~15–25 target queries sourced from the taxonomy's existing keyword map, checked
  logged-out and Zoetermeer-geolocated, for **both** domains — **recording the honest zeroes**. The GSC
  export alone only contains queries the site already appears for, so it structurally cannot evidence
  "we went from ranking nowhere to page one", which is the exact claim this milestone will want to
  make. The query list and the checking method are written down so the snapshot is repeatable at
  milestone close. Rejected: a paid rank tracker (recurring cost and an account decision that outlives
  this phase; revisit if Phase 12 needs volume data).
- **D-14 — DNS zone snapshot = a committed `dig`-based script writing a timestamped file per zone**,
  not a one-off registrar export. Phase 10's rollback plan is literally "revert two A records", so what
  is needed is something that can be **re-run and diffed** against the live zone after the cutover — a
  PDF from a control panel cannot do that. Must capture NS, A, MX, TXT/SPF, DMARC and DKIM for both
  zones (the same record set the milestone research probed on 2026-08-19/20).
- **D-15 — GBP state = screenshot for provenance plus the fields transcribed** into the artefact: name,
  primary + secondary categories, website URL, service area, review count, rating. Phase 11 diffs
  against transcribed fields; it cannot diff a screenshot. The 34 reviews and the 4,9 rating are the
  values at risk in Phase 11's rename, so they are recorded explicitly.
- **D-16 — GSC performance export for both domains, taken after verification completes.** Search
  Console backfills up to 16 months on verification, so the legacy domain's real history becomes
  available the moment its property exists — which is why the export is sequenced after D-05, not
  before.
- **D-17 — The whole baseline completes before Phase 10 starts.** The capture date is the artefact
  directory name, so "when was this true" is never ambiguous.

### Ongoing Measurement (MEAS-05)

- **D-18 — Search Console API via a Google Cloud service account.** The API is free and requires no
  billing account; quotas (2,000 URL inspections/day, 600/minute per property) dwarf a 27-page site.
  The service-account JSON key is a **real secret**: gitignored locally, stored as a GitHub Actions
  repo secret, never committed. This is the "API-first" option deliberately deferred at D-01 for the
  one-time work and adopted here for the recurring work, where it compounds.
- **D-19 — Use the URL Inspection API per-URL across all 27 sitemap URLs — not the aggregate Index
  Coverage report, which the API does not expose.** Per URL this yields `coverageState`,
  `robotsTxtState`, `lastCrawlTime`, and Google's chosen canonical vs. ours. That is strictly better
  than bucket counts: it names *which* page is stuck and why. The URL list comes from the same
  `sitemapEntries()` source of truth the build gate uses — never a parallel list (P8 D-05).
- **D-20 — Thresholds.** Calendar ramp: **≥10 of 27 indexed by week 2, ≥20 by week 4, ≥25 by week 8** —
  missing a rung flags. Immediate flags, independent of the ramp: any URL that **loses** indexation,
  any `robotsTxtState` that is not ALLOWED, and any URL where Google's chosen canonical differs from
  ours. Rejected: a two-rule "not indexed after 8 weeks / lost indexation" scheme (eight quiet weeks
  before learning that, say, Google is canonicalising pillars onto each other) and a purely
  migration-relative scheme (goes silent exactly during the first-ever indexation of 27 pages).
- **D-21 — Runner: a weekly GitHub Actions cron.** It runs the script, commits the dated reading back
  to the repo, and opens an issue when a threshold trips. No dependency on this machine, the OneDrive
  mount, or anyone remembering. This is the **first CI on this repo** — the repo has a GitHub remote
  (`Zlodziejczyk/tps-ventilatie`) but no `.github/` directory. Rejected: a scheduled Claude routine
  (needs this machine awake with a live session) and manual invocation (the documented failure mode).
- **D-22 — Fold in Phase 8's deferred post-deploy `verify-indexation.ts` automation.** With Actions
  standing up anyway it is nearly free, and it closes the loop Phase 8 left open. **This is an explicit
  scope addition beyond MEAS-01…06**, approved by the user on 2026-08-24, and inherited directly from
  `08-CONTEXT.md`'s deferred list ("fits Phase 9 Measurement Foundation").
- **D-23 — The two probes stay distinct and both stay.** `scripts/verify-indexation.ts` asserts **what
  we serve**; the new GSC script asserts **what Google concluded** about the same 27 URLs. Neither
  replaces the other, and a disagreement between them is itself the most valuable signal this phase can
  produce.

### Vercel Analytics (MEAS-06)

- **D-24 — Enable Web Analytics and Speed Insights in the Vercel dashboard; the code is already
  wired.** `@vercel/analytics` ^2.0.1 and `@vercel/speed-insights` ^2.0.0 are installed and both
  components render from `app/layout.tsx`. "Reporting live traffic" is the success criterion, so the
  D-04 assert script checks the beacon is present in served production HTML, and the dashboard
  screenshot evidences that data is actually arriving. GA4 stays out (carried from Phase 3) — cookieless
  means no consent banner and no processor entry in the privacy policy.

### Sequencing Inside the Phase

- **D-25 — Order: (a) TXT records placed by the user + HTML file on WordPress → (b) all five properties
  verified → (c) sitemap submitted + 5 indexing requests → (d) baseline captured → (e) service account,
  weekly script, GitHub Actions workflow.** (b) gates (c) and (d) — the performance export does not
  exist before the property does (D-16). (e) is independent of the Google-side work and can be built in
  parallel, but its first meaningful reading requires (b). **The whole of (a)–(d) gates Phase 10.**

### Claude's Discretion

- Script and module naming within the existing conventions (`scripts/measure-indexation.ts`,
  `scripts/snapshot-dns.sh`, or whatever fits the `assert-*` / `verify-*` family), and whether the D-04
  evidence assertions live in a new script or extend an existing one.
- The GitHub Actions workflow's structure, schedule time, Node setup, and the exact reporting shape
  (committed file vs. issue body vs. both) within D-21.
- The exact 15–25 query shortlist drawn from the taxonomy keyword map, and the mechanics of geolocating
  the SERP checks — within D-13's requirement that the method be written down and repeatable.
- Whether the service account needs Owner or Full-user permission on each property for the URL
  Inspection API — **confirm at implementation**; add it at the level the API actually requires rather
  than guessing low and debugging a 403.
- Whether `docs/baseline/2026-08-24/` carries a `README.md` index plus per-artefact files, or a single
  `BASELINE.md` with the exports beside it.
- Commit granularity, and whether the phase runs on a `gsd/phase-9-measurement-foundation` branch
  (P8 D-08 pattern) or straight on `main` — this phase's repo changes are additive and low-risk, so a
  branch is optional rather than protective.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope
- `.planning/ROADMAP.md` §"Phase 9: Measurement Foundation" — goal, the 5 success criteria, and the
  "why here" note on the closing legacy window
- `.planning/REQUIREMENTS.md` — MEAS-01…MEAS-06 verbatim; §"Open Questions" #1 (DNS-zone access for
  `tpsventilatie.nl` **confirmed** 2026-08-20, which is what makes a legacy Domain property possible)
- `.planning/ROADMAP.md` §"Phase 10: Reversible Old-Brand Migration" — read for what this phase must
  hand over: the CoA-capable property, the DNS snapshot, the baseline

### Milestone research (the diagnosis this phase acts on)
- `.planning/research/STACK.md` §"Google Search Console — the part with real requirements" — the
  2026-06-17 guidance change, the three consequences, and the verification-method preference order
- `.planning/research/PITFALLS.md` §"Capture before the repoint" and §"Recovery Strategies" — exactly
  what the baseline must contain and what it insures against; §"Looks Done But Isn't" checklist
- `.planning/research/ARCHITECTURE.md` §"Build Order" steps 5 and 6 — GSC verify/submit and baseline
  capture, and why 6 must precede 7
- `.planning/research/SUMMARY.md` — the B-precedes-C sequencing finding

### Carried-forward decision locks
- `.planning/phases/08-indexation-unlock/08-CONTEXT.md` — D-22…D-25 (the `verify-indexation.ts` probe
  and its `INDEXABLE_FLOOR` import), D-05 (source-agnostic checker; never a parallel URL list), and the
  deferred item this phase adopts as D-22
- `.planning/phases/03-seo-infrastructure/03-CONTEXT.md` — D-02 (publish-gated sitemap via one policy
  helper), D-05 (the `buildMetadata` seam), D-06 (the GSC verification token seam D-08 activates)
- `.planning/PROJECT.md` §Constraints — OneDrive execution constraint (no local `next build`);
  §Current State — the Phase 8 resolution and the lesson it encodes

### Operational docs
- `docs/seo-owner-runbook.md` §2 (GSC), §3 (Vercel Analytics), §5 (canonical/geo), §6
  (`verify-indexation.ts` usage and error semantics) — **note:** §2 and §3 describe these as owner
  tasks; D-01 changes who executes them, so the runbook needs reconciling at the end of this phase
- `scripts/verify-indexation.ts` — the existing live-output probe D-23 keeps distinct and D-22 automates

### Code this phase touches or depends on
- `lib/constants.ts` — `CANONICAL_ORIGIN` (`https://www.tpsklimaattechniek.nl`) and
  `GOOGLE_SITE_VERIFICATION` (the seam D-08 activates); `SITE` for NAP/service areas used in the GBP snapshot
- `app/layout.tsx` — `verification.google` metadata, `<Analytics />` and `<SpeedInsights />` (already rendered)
- `lib/seo/policy.ts` — `sitemapEntries()` / `isIndexable()`; the URL source D-19 inspects
- `scripts/assert-*.ts` — the `tsx` + `node:assert` gate family D-04's evidence script joins
- `package.json` — the `prebuild` chain (8 guards) and where a `measure` script would be registered
- `.github/workflows/` — **does not exist yet**; D-21/D-22 create the repo's first CI

### External references
- [Change of Address tool — Search Console Help](https://support.google.com/webmasters/answer/9370220?hl=en)
- [For site moves, specify all domain variants — Search Engine Land](https://searchengineland.com/for-site-moves-specify-all-domain-variants-with-googles-change-of-address-tool-480552)
- Google Search Console API — URL Inspection (`urlInspection.index.inspect`), Sitemaps, and Search
  Analytics endpoints; per-property quotas and the fact that the aggregate Index Coverage report is
  **not** exposed (the constraint behind D-19)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`scripts/verify-indexation.ts`** — already fetches the production sitemap, checks each URL for a
  direct 200, absence of `noindex`, and a self-canonical, and imports `INDEXABLE_FLOOR` so the gate and
  the probe cannot disagree. It is both the pattern for D-04's evidence script and the thing D-22 puts
  on a schedule. It already knows to skip Vercel's preview-only `X-Robots-Tag`.
- **The `scripts/assert-*.ts` family** — `tsx` + `node:assert`, intentional `console` output, non-zero
  exit aborts the build. Eight of them are wired build-blocking in `prebuild` (~1.7s total). New
  measurement assertions join this family rather than inventing a mechanism.
- **`GOOGLE_SITE_VERIFICATION` seam** — `lib/constants.ts` reads `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
  and `app/layout.tsx` emits `verification.google` only when non-empty. Fully wired, never valued;
  D-08 gives it a value.
- **`@vercel/analytics` + `@vercel/speed-insights`** — installed and rendered from `app/layout.tsx`.
  MEAS-06 is a dashboard toggle plus verification, not an integration.
- **`sitemapEntries()` in `lib/seo/policy.ts`** — the single source for which 27 URLs exist. D-19's
  inspection list derives from it, never from a hand-maintained list (the anti-pattern that caused the
  Phase 8 bug).

### Established Patterns
- **Single-source indexability.** `policy.ts` decides sitemap membership and the `robots` directive;
  everything reads it. A measurement script that maintains its own URL list would recreate the exact
  drift Phase 8 eliminated.
- **Assert relationships and named floors, never snapshots.** `INDEXABLE_FLOOR = 27` is derived
  (`28 nodes − privacy-beleid`) and carries a failure message telling the reader not to bump it. The
  measurement thresholds in D-20 follow the same spirit: they say what "wrong" means, not what today's
  number happens to be.
- **Secrets never enter the repo.** `SITE` and `CANONICAL_ORIGIN` are public constants; the GHL webhook
  secret is server-only. The service-account key follows the same rule — env var / repo secret only.
- **Vercel preview is the build gate; there is no local `next build`** on this OneDrive mount.
  Anything added to `prebuild` gets validated by pushing, not by running the build locally.

### Integration Points
- `package.json` `scripts` — where a `measure` entry point registers; `prebuild` is where any new
  build-blocking assertion joins the existing chain of eight.
- `.github/workflows/` — new. Two jobs: a weekly cron (D-21) and a post-production-deploy run of
  `verify-indexation.ts` (D-22). Repo secret for the service-account key.
- Vercel project env vars — `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` added (D-08), requiring a redeploy
  before the meta tag is served and verification can complete.
- `docs/` — gains `baseline/2026-08-24/`; `seo-owner-runbook.md` §2/§3 need reconciling with D-01.

### Current external state (live-probed 2026-08-24)
- `https://www.tpsklimaattechniek.nl/` serves **no** `google-site-verification` meta tag → the env var
  is unset in Vercel today.
- **No** `google-site-verification` TXT on either domain → **zero GSC properties exist**.
- `tpsklimaattechniek.nl` NS = `ns1/ns2/ns3.domaindiscount24.net`; TXT = Titan SPF only.
- `tpsventilatie.nl` NS = `ns1/ns2.opeiron.com`; A = `195.78.67.39` (WordPress); apex returns **200**;
  SPF = `v=spf1 a mx include:_spf.cyberfolks.pl -all` (the `a` mechanism Phase 10 tidies).
- `https://tpsventilatie.nl/robots.txt` advertises `wp-sitemap.xml`, which returns **404 with an XML
  body** (D-09).

</code_context>

<specifics>
## Specific Ideas

- **"Prove the negative."** The reason D-13 pays for a manual SERP baseline is that a GSC export can
  only ever show queries the site already ranks for. Without recorded zeroes, the milestone's central
  claim — that 21 pages went from invisible to ranking — has no before-side. Record the absences.
- **Two probes, two questions.** `verify-indexation.ts` answers "are we serving it right?"; the new GSC
  script answers "did Google agree?". Keep the framing explicit in the code and in the runbook — a
  disagreement between them is the highest-value alert this phase can generate.
- **The dd24 trap.** That registrar suspended this domain once already over contact verification
  (2026-08-12). Read before touching, change nothing but the TXT record, and check the domain's status
  banner while in there.
- **`INDEXABLE_FLOOR` is the shared vocabulary.** The build gate, `verify-indexation.ts`, GSC's
  "discovered URLs" count, and D-20's ramp all refer to the same 27. Any of them disagreeing is a
  finding — never a number to adjust.
- **GSC backfills 16 months on verification** — the legacy domain's history is not lost by verifying
  late, but it *is* lost if the property is never created before the site stops existing.

</specifics>

<deferred>
## Deferred Ideas

- **Reconcile `docs/seo-owner-runbook.md` with D-01.** §2 (GSC) and §3 (Vercel Analytics) are written
  as owner tasks; after this phase they will have been executed by the agency. The runbook should end
  up describing *what was done and where the evidence lives*, not *what you must do*. Small, but it
  should land inside this phase's tail rather than drift — flag for the planner as a candidate task.
- **Re-take the baseline at milestone close** so there is a before/after pair rather than a lone
  "before". Belongs to the v1.1 milestone-completion step, not here — but D-13 requires the method be
  written down precisely so the retake is mechanical.
- **Vercel plan-tier data retention** for Web Analytics — whether the current plan retains enough
  history to serve as milestone evidence at close. Unknown; check when enabling, and if retention is
  short, the weekly committed reading becomes the durable record instead.
- **Search Analytics API for query-level trend reporting.** The same service account unlocks
  clicks/impressions/position by query — which is exactly what Phase 12's keyword→page map wants
  instead of judgement calls. Natural extension of the weekly script; deliberately out of scope here so
  MEAS-05 stays about indexation.
- **A paid rank tracker** (Semrush / Ahrefs / a local-SEO tool) for continuous position trends and
  keyword volume. Rejected at D-13 on recurring cost; revisit if Phase 12's keyword work proves the
  manual snapshot too coarse.
- **Broader CI on the new GitHub Actions foundation** — lint, typecheck, or the `prebuild` gate chain
  on pull requests. This phase creates the first workflow file; expanding it into real CI is a separate
  decision with its own cost/benefit, and Vercel preview already serves as the build gate.

</deferred>

---

*Phase: 9-Measurement Foundation*
*Context gathered: 2026-08-24*
