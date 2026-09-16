# Phase 9: Measurement Foundation - Research

**Researched:** 2026-09-16
**Domain:** Google Search Console (properties, URL Inspection API, Search Analytics API, Sitemaps API) ·
service-account auth without client libraries · first GitHub Actions on this repo · Vercel Web Analytics /
Speed Insights · DNS zone snapshots · a repeatable SERP baseline
**Confidence:** HIGH for everything executed or read from official docs this session; MEDIUM for the two
Google-behaviour claims marked `[ASSUMED]` in the log; LOW only for the `uule` geolocation mechanics.
**Method:** inline, orchestrator-written. Planning-class subagents starve on this OneDrive mount
(`[[onedrive-execution-constraints]]`, 2026-08-20 update); every live claim below was probed with `dig`,
`curl`, `gh api`, the Vercel MCP or `npx tsx` in this session, and every external claim carries a source tag.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01 … D-25) — carried into the plans unchanged

| ID | Decision (compressed; the full text in `09-CONTEXT.md` governs) |
|----|-----------------------------------------------------------------|
| D-01 | Claude drives Chrome (`claude-in-chrome`, the user's logged-in Google session) for the Google-side work: verification completion, sitemap submission, indexing requests, the performance export, the GBP snapshot. Plans carry executable browser steps with an expected result per step — not runbook prose |
| D-02 | GSC properties live under the Pushly/Oskar Google account; Thomas is added as **delegated Owner** on every property. GBP permissions unchanged (Thomas owner, Oskar admin — sufficient for the read-only snapshot) |
| D-03 | The user places DNS TXT records by hand in both registrar panels; Claude supplies host/value and confirms with `dig` before completing verification. **Superseded in execution — see D-26 below** |
| D-04 | Evidence standard: machine proof plus a committed, re-runnable script for anything HTTP-observable (TXT records, served meta tag, sitemap reachability + `INDEXABLE_FLOOR`, analytics beacon); screenshots only for what has no machine form (GBP state, GSC panels). Extends the `scripts/assert-*.ts` family |
| D-05 | Four properties: Domain `tpsklimaattechniek.nl` (TXT at dd24), Domain `tpsventilatie.nl` (TXT — now also at dd24, see D-26), URL-prefix `https://tpsventilatie.nl/`, URL-prefix `https://www.tpsventilatie.nl/` |
| D-06 | Legacy verification happens before anything in Phase 10 moves — the reason Phase 9 precedes Phase 10 |
| D-07 | Legacy verification is **never removed** after the repoint (180-day redirect floor); the TXT record / file stays |
| D-08 | Activate the wired-but-unset `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` seam and verify a **fifth** property, URL-prefix `https://www.tpsklimaattechniek.nl/` (HTML-tag method) — beyond the success criterion, recorded as such |
| D-09 | No legacy sitemap submission (`wp-sitemap.xml` is a 404) |
| D-10 | Submit `https://www.tpsklimaattechniek.nl/sitemap.xml`; success = GSC reports **27** discovered URLs (= `INDEXABLE_FLOOR`); a disagreement is a finding |
| D-11 | Indexing requested for exactly the 5 named URLs (`/diensten` + 4 pillars) |
| D-12 | Baseline lives in `docs/baseline/<date>/` (operational tree, next to `docs/seo-owner-runbook.md`). **Date resolved by D-27** |
| D-13 | Ranking snapshot = GSC performance export **plus** a manual geolocated SERP baseline (~15–25 taxonomy queries, logged-out, Zoetermeer, both domains, **recording honest zeroes**); method written down so the retake is mechanical |
| D-14 | DNS zone snapshot = committed `dig`-based script writing a timestamped file per zone (NS, A, MX, TXT/SPF, DMARC, DKIM), re-runnable and diffable |
| D-15 | GBP state = screenshot for provenance + transcribed fields: name, primary + secondary categories, website URL, service area, review count, rating |
| D-16 | GSC performance export for both domains, **after** verification completes (16-month backfill) |
| D-17 | The whole baseline completes before Phase 10 starts; the capture date is the artefact directory name |
| D-18 | Search Console API via a Google Cloud **service account**; the JSON key is a real secret — gitignored, GitHub Actions repo secret, never committed |
| D-19 | URL Inspection API per URL across all 27 sitemap URLs (not the aggregate Coverage report, which the API does not expose); URL list from `sitemapEntries()` — never a parallel list |
| D-20 | Thresholds: calendar ramp ≥10/27 by week 2, ≥20 by week 4, ≥25 by week 8; immediate flags on lost indexation, any `robotsTxtState` ≠ ALLOWED, and Google canonical ≠ ours |
| D-21 | Runner = weekly GitHub Actions cron that commits the dated reading and opens an issue on breach — the **first CI on this repo** |
| D-22 | Fold in Phase 8's deferred post-deploy automation of `scripts/verify-indexation.ts` (explicit scope addition, approved 2026-08-24) |
| D-23 | Two probes stay distinct: `verify-indexation.ts` = what we serve; the GSC script = what Google concluded. A disagreement is the most valuable signal |
| D-24 | Enable Web Analytics + Speed Insights in Vercel (code already wired); D-04 script checks the beacon; dashboard screenshot evidences data arriving; GA4 stays out |
| D-25 | Order: (a) TXT + HTML file → (b) five properties verified → (c) sitemap + 5 indexing requests → (d) baseline → (e) service account, weekly script, Actions. (b) gates (c)/(d); (e) is independent and **can be built in parallel**; (a)–(d) gate Phase 10 |

### Executed-state addendum (recorded in CONTEXT.md on 2026-09-16 — user decisions taken during execution)

| ID | Decision |
|----|----------|
| D-26 | **Legacy `tpsventilatie.nl` DNS delegation was moved from cyberfolks (`ns1/ns2.opeiron.com`) to dd24 (`ns1/2/3.domaindiscount24.net`) on 2026-09-16**, the zone mirrored record-for-record (33/33 comparisons PASS, DKIM byte-identical) so the GSC TXT could be placed in an authoritative zone nobody else had access to. Explicit user go, twice. Supersedes D-03's "user pastes TXT at opeiron" and the REQUIREMENTS out-of-scope row "Moving legacy DNS nameservers". Rollback = dd24 → Nameserver tab → external `ns1/2/3.cyberfolks.pl` (cyberfolks still holds its zone). This phase **records** the decision in the baseline; Phase 10's A-record repoint now happens at dd24 |
| D-27 | The baseline directory is **`docs/baseline/2026-09-16/`** — the date the pre-migration state was first captured (both zones snapshotted, both Domain properties verified, sitemap processed) — not the D-12 context-gathering date. Later-captured artefacts (SERP, GBP, exports) carry their own `taken:` timestamps in the manifest, per D-17 |

### Claude's Discretion — resolved by this research

| Discretion item (CONTEXT) | Resolution | Where |
|---|---|---|
| Script/module naming | `scripts/gsc/{auth,api,thresholds}.ts` + `scripts/measure-indexation.ts` (weekly, D-19/D-20) + `scripts/export-gsc-performance.ts` (baseline, D-16) + `scripts/snapshot-dns.sh` (D-14) + `scripts/verify-measurement.ts <baseUrl>` (the D-04 evidence probe, sibling of `verify-indexation.ts`) | §Architecture |
| D-04 assertions: new script or extend? | **New** `verify-measurement.ts`. `verify-indexation.ts` stays untouched — D-23 wants the two questions separate, and Phase 10 already depends on the existing probe's shape | §Pattern 7 |
| Actions structure / schedule / reporting | Two workflows: `measure-indexation.yml` (cron Monday 06:17 UTC + `workflow_dispatch`; commits `docs/measurements/gsc/<date>.json`; opens/updates one labelled issue on breach) and `verify-indexation.yml` (`deployment_status` success on `Production` → runs the Phase 8 probe; issue on failure). Reporting = committed file **and** issue body | §Pattern 5 |
| The 15–25 query shortlist + geolocation | **24 queries, derived mechanically**: the `primaryKeyword` of every indexable hub/pillar/service node (22) + `tps klimaattechniek` + `tps ventilatie`. Emitted to `serp-queries.json` by the export script so the retake recomputes the same list. Geolocation via `uule` (Zoetermeer) + `gl=nl&hl=nl&pws=0`, self-verified by the SERP location footer | §Pattern 4, §Pitfall 12 |
| SA permission level | **Full user** on each property (URL Inspection is available to Owner and Full; Restricted is fetch-only). Not Owner — an Owner SA could add users. Token minted with the **read-only** scope | §Pattern 1 |
| Baseline layout | `README.md` manifest + per-artefact files in `dns/`, `gsc/`, `gbp/`, `serp/` sub-folders | §Structure |
| Branch vs `main` | **`main`**, small commits. Changes are additive (scripts, workflows, docs, gitignore); nothing under `app/`/`lib/` changes; and `workflow_dispatch` / cron only run reliably from the default branch | §Pitfall 7 |
| GSC export method (D-01 vs D-04 tension) | Primary: **Search Analytics API** through the same service account (machine-readable, re-runnable — what D-13's "mechanical retake" and D-04 require). Fallback, if the SA is not usable when the baseline is taken: the Chrome-driven UI export exactly as D-01 states. D-25 explicitly allows (e) to be built in parallel with (d), so the SA can exist before the export | §Pattern 4 |
| Weekly rebuild caused by the reading commit | **Accepted, not suppressed.** The bot's push to `main` triggers a production rebuild of identical code — which re-runs the 8-guard `prebuild` chain and the D-22 post-deploy probe every week for free. `ignoreCommand` is the documented opt-out if it ever becomes noisy | §Pitfall 6 |

### Deferred Ideas (OUT OF SCOPE — do not plan)

Runbook reconcile **is** in scope (flagged as a candidate task — adopted, plan 09-05). Out of scope: re-taking
the baseline at milestone close; Search Analytics **trend reporting** for Phase 12's keyword map; a paid rank
tracker; broader CI (lint/typecheck/prebuild on PRs) beyond the two workflows above; Vercel plan-tier retention
as an open question (answered below, no action beyond the durable weekly reading).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Requirement | State on 2026-09-16 (live-probed) | Research support |
|----|-------------|-----------------------------------|------------------|
| MEAS-01 | Both new-domain variants verified in GSC | **Half done.** Domain property `sc-domain:tpsklimaattechniek.nl` verified (TXT `eXe-fYdK…` live at dd24). Fifth property (D-08, `https://www.tpsklimaattechniek.nl/`, HTML tag) **not** done — production serves no `google-site-verification` meta | §Pattern 7, §Pitfall 2/3 |
| MEAS-02 | Both legacy variants verified **while legacy DNS still resolves to WordPress** | **Half done.** Domain property `sc-domain:tpsventilatie.nl` verified ~19:40Z (TXT `DvCnCNBb…` live at dd24); apex still `195.78.67.39`, HTTP 200 "TPS Ventilatie". The two URL-prefix properties (D-05 #3/#4) not yet created | §Pitfall 4 (inheritance instead of a WordPress file) |
| MEAS-03 | Sitemap submitted; indexing requested for hub + 4 pillars | **Done** (screenshots in the 2026-09-16 scratchpad: sitemap Success, 27 discovered; 5 requests, all "URL is on Google"). Remaining: the **machine proof** (`sitemaps.get` → `contents[].submitted === 27`) and the evidence copied into the baseline | §Pattern 3 |
| MEAS-04 | Pre-migration baseline: GSC export, ranking snapshot, GBP state, full DNS zone snapshot | **Started, uncommitted.** Both zones snapshotted + mirror verification live only in an ephemeral scratchpad. GSC export, SERP baseline, GBP transcription not taken | §Pattern 4/6, §Structure |
| MEAS-05 | Weekly indexation review against defined thresholds | **Not started.** No `.github/`, no service account, no script | §Pattern 1/2/5 |
| MEAS-06 | Vercel Analytics enabled and reporting | **Not done.** Vercel MCP `get_web_analytics` → `404 "Web Analytics not found"` (not enabled). `/_vercel/insights/script.js` returns 200 regardless — **not** proof | §Pitfall 1 |
</phase_requirements>

---

## Summary

Phase 9 is no longer a greenfield phase. On 2026-09-16, ahead of planning, the Google-side gates (a)–(c) of
D-25 were executed inline in the user's Chrome session: both **Domain** properties are verified, the sitemap is
processed at exactly **27** discovered URLs, and indexing was requested for the 5 named pages. To make the legacy
TXT placeable at all, the user moved the legacy zone's delegation to dd24 (D-26). What remains is (1) the
**fifth property + meta-tag seam** (D-08), (2) the two legacy **URL-prefix** properties, (3) **Vercel Analytics /
Speed Insights** (genuinely not enabled), (4) the **committed baseline** (the DNS evidence is sitting in a
scratchpad that will be garbage-collected), (5) the **service account + weekly script + the repo's first GitHub
Actions** (MEAS-05, D-18…D-23), and (6) the docs reconcile.

The technical core is small and dependency-free: a ~40-line RS256 JWT mint with `node:crypto` against Google's
documented service-account flow, three `fetch` calls (`urlInspection.index:inspect`, `sitemaps.get`,
`searchanalytics.query`), thresholds as a pure function, and two ~40-line workflow files. Everything joins the
existing `tsx` + `node:assert` CLI family; **no npm package is installed**. Two facts change how the D-04
evidence must be written: the Vercel beacon is injected **client-side** (the SSR HTML never contains
`/_vercel/insights`), and `/_vercel/insights/script.js` answers 200 even while Web Analytics is disabled — so
"reporting" must be proven by the Vercel API count (or MCP) and the browser's `/_vercel/insights/view` request,
never by grepping HTML.

**Primary recommendation:** plan five plans on `main`: (1) commit the baseline skeleton + DNS snapshot script and
rescue the 2026-09-16 evidence, (2) service account + GSC client + performance export + weekly script, (3) the
fifth property, legacy URL-prefix properties, Vercel Analytics, delegation, and the `verify-measurement.ts`
evidence probe, (4) the two GitHub Actions workflows with a dispatched green run, (5) the SERP baseline,
baseline completeness gate (D-17) and the docs reconcile.

---

## Executed-state delta (why the plans must not re-do (a)–(c))

Live on 2026-09-16 (this session, `dig +short` / `curl`):

```
tpsklimaattechniek.nl  NS  ns1/2/3.domaindiscount24.net
tpsklimaattechniek.nl  TXT "google-site-verification=eXe-fYdK-V_ZCSunAaB7sVfj-fPiWtqtjlKPnWlwCZk"  ← D-05 #1 done
tpsventilatie.nl       NS  ns1/2/3.domaindiscount24.net        ← D-26 (was ns1/ns2.opeiron.com on 2026-08-24)
tpsventilatie.nl       A   195.78.67.39  (www too)  HTTP 200 "TPS Ventilatie"  ← window still open (D-06)
tpsventilatie.nl       TXT "google-site-verification=DvCnCNBbXd73JTab3-DsDmq_KgkQmlCZ7onK6OqDkoI"  ← D-05 #2 done; D-07: never remove
tpsventilatie.nl       TXT "v=spf1 a mx include:_spf.cyberfolks.pl -all"  MX 10 mail.  ← untouched (Phase 10 tidies `a`)
https://www.tpsklimaattechniek.nl/   no google-site-verification meta        ← D-08 NOT done
https://www.tpsklimaattechniek.nl/sitemap.xml  27 <loc>                     ← INDEXABLE_FLOOR holds
Vercel MCP get_web_analytics → 404 "Web Analytics not found"                ← MEAS-06 NOT done
```

Evidence that must be **rescued into `docs/baseline/2026-09-16/`** before it evaporates (scratchpad of session
`29fcd5a0`, `/private/tmp/claude-501/…/29fcd5a0-956d-4f2b-ac40-6646ac18e664/scratchpad/`):

| File | What it proves |
|---|---|
| `dns-snapshot-2026-09-16/tpsventilatie.nl.txt` | Full legacy zone as served by `ns1.cyberfolks.pl` **before** the NS switch (SOA serial 2024020301) |
| `dns-snapshot-2026-09-16/tpsklimaattechniek.nl.txt` | New-domain zone at dd24 incl. the GSC TXT and Titan MX/SPF/DKIM |
| `dns-snapshot-2026-09-16/dd24-records-to-enter.md` | The 12-record mirror plan (D-26) |
| `dns-snapshot-2026-09-16/dd24-mirror-verification.txt` | 33/33 name/type/NS comparisons PASS, pre-switch |
| `dns-snapshot-2026-09-16/dd24-zone-table.jpg` | dd24 zone screenshot (provenance) |
| `gsc-evidence-2026-09-16/sitemap-success-27.jpg` | GSC Sitemaps: Success, 27 discovered (D-10) |
| `gsc-evidence-2026-09-16/legacy-domain-property-verified.jpg` | `sc-domain:tpsventilatie.nl` "Ownership auto verified" (D-05 #2, D-06) |

The plans reference these by absolute path; if the directory is gone at execution time, the DNS files are
re-generated by `scripts/snapshot-dns.sh` (the zone has not changed since) and the two GSC screenshots are
re-taken in Chrome — both are re-observable, nothing is lost except the pre-switch SOA line.

---

## Architectural Responsibility Map

| Capability | Primary tier | Secondary | Rationale |
|---|---|---|---|
| Deciding which 27 URLs are "the surface" | Repo data — `lib/seo/policy.ts` `sitemapEntries()` / `lib/seo/invariants.ts` `INDEXABLE_FLOOR` | — | Single source (P8 D-05/D-25); the measurement script **imports** it (D-19), the evidence probe imports only the floor |
| Serving the verification meta tag | Frontend server (Next metadata `verification.google` in `app/layout.tsx`) | Vercel env var (build-time) | Seam already wired; value comes from `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` at **build** time |
| DNS TXT ownership tokens | External — dd24 zones (both domains) | `scripts/snapshot-dns.sh` (read-only) | Zones are the authority; the repo only snapshots and asserts |
| Asking Google what it concluded | CI / local CLI — `scripts/measure-indexation.ts` → Search Console API | GitHub Actions cron | No runtime code; read-only API; secret lives in Actions |
| Proving what we serve | CI / local CLI — `scripts/verify-indexation.ts` (exists) + `scripts/verify-measurement.ts` (new) | `deployment_status` workflow | HTTP-observable (D-04) |
| Analytics collection | Browser (client-side beacon from `@vercel/analytics/next`) → Vercel edge `/_vercel/insights/*` | Vercel dashboard/API for "reporting" | Beacon is injected by `useEffect`; SSR HTML never contains it |
| Baseline artefacts | Repo docs — `docs/baseline/2026-09-16/` | Chrome (screenshots, SERP, GBP) | Durable, diffable, findable during an incident (D-12) |
| Weekly readings | Repo docs — `docs/measurements/gsc/<date>.json` | GitHub issue on breach | Committed by the workflow (D-21) |

---

## Standard Stack

### Core (nothing new is installed)

| Tool | Version (verified) | Purpose | Why |
|---|---|---|---|
| Node.js | local **v26.0.0**; Vercel project `nodeVersion: 24.x` `[VERIFIED: Vercel MCP get_project]` | runs the scripts; `fetch`, `node:crypto`, `node:dns` built in | matches the existing `tsx` CLI family; Actions pins **24** to match production |
| `tsx` | ^4.22.4 (in repo) | executes `scripts/*.ts` with `@/*` paths | proven fast on this mount; all 8 guards run through it |
| `node:crypto` `sign('sha256', …)` RS256 | built-in — **executed this session** (256-byte signature) | mint the service-account JWT | the official REST flow needs nothing else |
| `node:dns/promises` `resolveTxt` / `dig` 9.10.6 | built-in / `/usr/bin/dig` | TXT assertions; zone snapshot | `dig` already produced the 2026-09-16 snapshot format |
| GitHub CLI `gh` | 2.93.0, logged in as `Zlodziejczyk`, scopes `repo`, `workflow` `[VERIFIED]` | create secrets, dispatch/inspect runs, create issues | `workflow` scope is what pushing `.github/workflows/*` over HTTPS requires |
| `actions/checkout` | **v7.0.1** latest `[VERIFIED: gh api releases/latest]` | workflow checkout | pin `@v7` |
| `actions/setup-node` | **v7.0.0** latest `[VERIFIED: gh api releases/latest]` | Node 24 + npm cache in Actions | pin `@v7` |
| `js-yaml` | 4.1.1 present transitively in `node_modules` `[VERIFIED]` | local syntax check of the workflow YAML before pushing | avoids a broken-workflow push; not a dependency |
| Vercel CLI | global 50.25.4, **not logged in** (`vercel whoami` → invalid token) | `vercel project web-analytics`, `vercel env add` | needs `! vercel login` first; Chrome dashboard is the D-01 fallback |
| Vercel MCP | connected (`get_project`, `get_web_analytics`, …) | in-session proof that analytics data is arriving | authoritative "not enabled" signal today |

### Alternatives considered

| Instead of | Could use | Tradeoff → verdict |
|---|---|---|
| hand-minted JWT (`node:crypto`) | `google-auth-library` 11.1.0 / `googleapis` 181.0.0 `[VERIFIED: npm view]` | pulls a large dependency tree into a repo whose only runtime deps are the app's; the REST flow is 40 lines and fully documented → **hand-mint, with the doc cited in the file header** |
| GitHub Actions | scheduled Claude routine / manual `npm run measure` | rejected in CONTEXT (D-21) |
| Search Console URL Inspection API | Indexing API | the Indexing API "can only be used to crawl pages with either `JobPosting` or `BroadcastEvent`" `[CITED: developers.google.com/search/apis/indexing-api/v3/quota-pricing]` → not applicable |
| `gcloud` CLI for the service account | Google Cloud Console in Chrome | `gcloud` is **not installed** `[VERIFIED]`; D-01 already puts one-time Google-side setup in Chrome → **Console in Chrome**; `brew install --cask google-cloud-sdk` + `gcloud auth login` is the fallback if the console UI proves brittle |
| `vercel.json` `ignoreCommand` to skip the weekly rebuild | accept the rebuild | see §Pitfall 6 → **accept** |

### Package Legitimacy Audit

**No packages are installed by this phase** (nothing added to `package.json` `dependencies`/`devDependencies`;
Actions are pinned to major tags of GitHub-owned actions). Audit table: none. `T-9-SC` in the threat model
records this explicitly so the checker sees it was considered, not skipped.

---

## Architecture Patterns

### System diagram — three loops and one capture

```
                      ┌──────────────────────────────── REPO (single source) ─────────────────────────────┐
                      │ lib/seo/policy.ts sitemapEntries() ── 27 URLs ──┐   lib/seo/invariants.ts INDEXABLE_FLOOR=27 │
                      └──────────────────────────────────────────────────┼───────────────────────────────────────────┘
                                                                         │
   WEEKLY LOOP (D-18…D-21)                                               ▼
   GitHub Actions cron ──► npm ci ──► scripts/measure-indexation.ts ──► for each URL: POST urlInspection/index:inspect
     (Mon 06:17 UTC)                     │  (GSC_SERVICE_ACCOUNT_JSON → JWT RS256 → oauth2 token, readonly scope)
                                         ├─► GET sites/{sc-domain}/sitemaps/{sitemap.xml}  (submitted count, lastDownloaded, errors)
                                         ├─► [optional VERCEL_TOKEN] GET /v1/query/web-analytics/visits/count (7d)
                                         ▼
                              docs/measurements/gsc/<YYYY-MM-DD>.json   ──diff vs previous reading──► thresholds.ts (pure)
                                         │                                                              │ flags?
                                         ├── git commit + push (contents: write) ──► Vercel rebuilds main (accepted, §Pitfall 6)
                                         └── flags → gh issue create/comment  label: indexation-alert  (issues: write) → exit 1

   POST-DEPLOY LOOP (D-22/D-23)
   Vercel deploys main ──► GitHub Deployment + deployment_status(success, environment=Production)
                     ──► verify-indexation.yml ──► npx tsx scripts/verify-indexation.ts <CANONICAL_ORIGIN>  (what we SERVE)
                                                       └── failure → gh issue (same label)

   EVIDENCE PROBE (D-04)                              BASELINE CAPTURE (D-12…D-17, once, before Phase 10)
   scripts/verify-measurement.ts <baseUrl>           scripts/snapshot-dns.sh → dns/<zone>-<UTC>.txt (D-14)
     ├─ dns.resolveTxt both zones ∋ google-site-…     scripts/export-gsc-performance.ts → gsc/*.json|csv (D-16, D-13 zeroes)
     ├─ GET / ∋ <meta name="google-site-verification"> Chrome: GBP fields + screenshot (D-15) · SERP 24×2 with uule (D-13)
     ├─ GET /sitemap.xml <loc> == INDEXABLE_FLOOR     README.md manifest: what · taken · how to retake · D-26/D-27
     └─ GET /_vercel/insights/script.js 200 + [VERCEL_TOKEN] visits count > 0
```

### Recommended structure (new files only)

```
scripts/
├── gsc/
│   ├── auth.ts                  # getAccessToken(scope): JWT RS256 → oauth2 token; never logs secrets
│   ├── api.ts                   # inspectUrl(), getSitemap(), querySearchAnalytics(); typed responses
│   └── thresholds.ts            # RAMP_ANCHOR, RAMP, evaluateReading(prev, curr, today) — pure, tsx-testable
├── measure-indexation.ts        # weekly CLI (D-19/D-20): reading file + flags + exit code
├── export-gsc-performance.ts    # baseline CLI (D-16/D-13): by-query, by-page, shortlist zeroes, sitemap proof, serp-queries.json
├── snapshot-dns.sh              # D-14: dig-based, timestamped, diffable, per zone
└── verify-measurement.ts        # D-04 evidence probe (sibling of verify-indexation.ts; distinct question, D-23)
.github/workflows/
├── measure-indexation.yml       # schedule + workflow_dispatch; contents/issues: write
└── verify-indexation.yml        # deployment_status → Production only
docs/
├── baseline/2026-09-16/         # README.md (manifest + D-26/D-27 records + SERP method) · dns/ · gsc/ · gbp/ · serp/
└── measurements/                # README.md (what/why/thresholds/alerts) · gsc/<date>.json
.gitignore                       # + service-account key patterns
.env.example                     # + GSC_SERVICE_ACCOUNT_JSON, VERCEL_TOKEN (optional)
package.json                     # + measure / verify:measurement / baseline:gsc / snapshot:dns scripts (NOT in prebuild)
```

### Pattern 1 — Service-account access token with `node:crypto` only (D-18)

Source: Google "Using OAuth 2.0 for Server to Server Applications", HTTP/REST section
`[CITED: developers.google.com/identity/protocols/oauth2/service-account]`.

```ts
// scripts/gsc/auth.ts — shape only; the executor writes it against the cited doc
import { createSign } from "node:crypto";
const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");
export async function getAccessToken(scope = "https://www.googleapis.com/auth/webmasters.readonly") {
  const key = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON ?? "");   // { client_email, private_key, … }
  const iat = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({ iss: key.client_email, scope, aud: "https://oauth2.googleapis.com/token", iat, exp: iat + 3600 }));
  const sig = createSign("RSA-SHA256").update(`${header}.${claims}`).end().sign(key.private_key);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${claims}.${b64url(sig)}` }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);   // never echo the body verbatim in CI logs
  return (await res.json()).access_token as string;                         // expires_in: 3600
}
```

Facts the executor must respect: `aud` is exactly `https://oauth2.googleapis.com/token`; `exp` ≤ 1 hour after
`iat`; the JSON key file's `private_key` is PEM with literal `\n`; `client_email` is the identity to add in GSC.
Scopes: `https://www.googleapis.com/auth/webmasters` (read/write) or `…/webmasters.readonly` — URL Inspection,
Sitemaps `get` and Search Analytics `query` all accept the **read-only** scope
`[CITED: developers.google.com/webmaster-tools/v1/urlInspection.index/inspect, …/v1/sitemaps/get, …/v1/searchanalytics/query]`.

### Pattern 2 — URL Inspection per URL + thresholds as a pure function (D-19/D-20)

Endpoint: `POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` with body
`{ inspectionUrl, siteUrl, languageCode? }`; `siteUrl` for a Domain property is **`sc-domain:tpsklimaattechniek.nl`**
(URL-prefix would be `https://www.tpsklimaattechniek.nl/` with the trailing slash)
`[CITED: developers.google.com/webmaster-tools/v1/urlInspection.index/inspect]`.

Response `inspectionResult.indexStatusResult` `[VERIFIED: searchconsole.googleapis.com/$discovery/rest?version=v1]`:

| Field | Type / enum values |
|---|---|
| `verdict` | `VERDICT_UNSPECIFIED · PASS · PARTIAL · FAIL · NEUTRAL` |
| `coverageState` | free string (e.g. "Submitted and indexed") — store verbatim for humans, never match on it |
| `robotsTxtState` | `ROBOTS_TXT_STATE_UNSPECIFIED · ALLOWED · DISALLOWED` |
| `indexingState` | `INDEXING_STATE_UNSPECIFIED · INDEXING_ALLOWED · BLOCKED_BY_META_TAG · BLOCKED_BY_HTTP_HEADER · BLOCKED_BY_ROBOTS_TXT` |
| `pageFetchState` | `PAGE_FETCH_STATE_UNSPECIFIED · SUCCESSFUL · SOFT_404 · BLOCKED_ROBOTS_TXT · NOT_FOUND · ACCESS_DENIED · SERVER_ERROR · REDIRECT_ERROR · ACCESS_FORBIDDEN · BLOCKED_4XX · INTERNAL_CRAWL_ERROR · INVALID_URL` |
| `crawledAs` | `CRAWLING_USER_AGENT_UNSPECIFIED · DESKTOP · MOBILE` |
| `lastCrawlTime` | RFC 3339 datetime |
| `googleCanonical`, `userCanonical` | strings |
| `sitemap[]`, `referringUrls[]` | string arrays |

Quota `[CITED: developers.google.com/webmaster-tools/limits]`: URL Inspection **2,000 QPD and 600 QPM per
site**; Search Analytics 1,200 QPM per site. 27 inspections a week is ~0.2 % of the daily quota — run them
sequentially with ~150 ms spacing; no concurrency needed.

Threshold semantics to encode in `scripts/gsc/thresholds.ts` (pure, so a `tsx -e` proof can feed it fabricated
readings — the Phase 8 lesson: a gate that has never been observed failing has not been shown to work):

- `isIndexed(r) = r.verdict === "PASS"` (Google's "URL is on Google").
- **Ramp** anchored on `RAMP_ANCHOR = "2026-09-16"` (sitemap submission date, D-10) — rungs: ≥10 from week 2
  (2026-09-30), ≥20 from week 4 (2026-10-14), ≥25 from week 8 (2026-11-11). Named constants with the
  derivation stated, floors not exact counts (P8 D-06 spirit).
- **Regressions** (immediate, independent of the ramp): `lost-indexation` (previous reading PASS, current not),
  `robots-not-allowed` (`robotsTxtState !== "ALLOWED"` **only when `lastCrawlTime` is present** — an uncrawled
  URL reports `UNSPECIFIED` and is informational), `canonical-mismatch` (`googleCanonical` present and ≠ the
  inspected URL).
- Also record, informational: `count-vs-floor` (URL list length vs `INDEXABLE_FLOOR`) and `sitemap.submitted`.
- Exit codes: `0` clean · `1` flags tripped (the workflow turns this into an issue) · `2` usage/auth error.

### Pattern 3 — Machine proof for "processed with 27 discovered" (D-10)

`GET https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}` (both URL-encoded; `siteUrl`
= `sc-domain:tpsklimaattechniek.nl`, `feedpath` = `https://www.tpsklimaattechniek.nl/sitemap.xml`) returns a
`WmxSitemap`: `path`, `lastSubmitted`, `lastDownloaded`, `isPending`, `isSitemapsIndex`, `type`, `errors`,
`warnings`, `contents[]{type, submitted, indexed}`; **`contents[].indexed` is deprecated — do not use**
`[CITED: developers.google.com/webmaster-tools/v1/sitemaps, …/v1/sitemaps/get]`. The D-10 assertion is therefore
`contents.find(c => c.type === "web").submitted === INDEXABLE_FLOOR && errors === 0`. Stored in every weekly
reading and in the baseline.

### Pattern 4 — Performance export and honest zeroes (D-13/D-16)

`POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`, body
`{ startDate, endDate, dimensions: ["query"|"page"|…], rowLimit ≤ 25000, startRow, dataState: "final"|"all",
dimensionFilterGroups: [{ filters: [{ dimension, operator, expression }] }] }`; rows `{ keys[], clicks,
impressions, ctr, position }` `[CITED: developers.google.com/webmaster-tools/v1/searchanalytics/query]`.

Baseline export per property (`sc-domain:tpsklimaattechniek.nl` from 2026-08-12, `sc-domain:tpsventilatie.nl`
from 16 months back — Google exposes up to 16 months `[ASSUMED, A2]`): by `query` (25,000 cap), by `page`, and,
for each of the 24 shortlist queries, a filtered query (`dimension: "query", operator: "equals"` + country
`nld`) whose **absence of rows is the recorded zero**. Written as JSON + CSV. GSC data lags ~2 days; the
new-domain property was verified 2026-09-16 and the panels showed "Processing data" — an empty first export is
expected, re-run after 48–72 h (§Pitfall 9).

The 24-query shortlist, derived from the registry `[VERIFIED: npx tsx enumeration this session]`:
`klimaattechniek Zoetermeer` (hub); `airconditioning`, `warmtepomp`, `wtw unit`, `mechanische ventilatie`
(pillars); `airco laten installeren`, `airco onderhoud`, `airco storing`, `airco advies Zoetermeer`,
`warmtepomp laten installeren`, `warmtepomp onderhoud`, `warmtepomp storing`, `warmtepomp advies regio Den Haag`,
`wtw-unit vervangen`, `wtw onderhoud`, `wtw inregelen`, `wtw storing`, `wtw unit aanleggen`,
`mechanische ventilatie vervangen`, `mechanische ventilatie onderhoud`, `mechanische ventilatie storing`,
`mechanische ventilatie aanleggen` (17 sub-services); plus `tps klimaattechniek`, `tps ventilatie` (brand).
The export script **emits** this list (`serp-queries.json`) from `PAGES` so the retake cannot drift.

### Pattern 5 — The two workflows (D-21/D-22)

Facts `[CITED: docs.github.com … events-that-trigger-workflows, triggering-a-workflow]` and `[VERIFIED: gh api]`:

- **Schedule**: POSIX cron, UTC by default (an IANA `timezone` key exists); minimum 5 min; **only runs from the
  default branch**; in a **public repo scheduled workflows are auto-disabled after 60 days without repository
  activity** (re-enable in the Actions tab). This repo is public. Add `workflow_dispatch` alongside the cron.
- **`deployment_status`**: fires when a third party (Vercel's GitHub app) sets a deployment status; not for
  `inactive`. Vercel creates deployments with `environment` **`Production`** / **`Preview`** and statuses with
  `state: success` and `environment_url` = the unique `*-pushly-projects.vercel.app` URL (probed:
  deployment `6003058827`, commit `634071e`). Gate on
  `github.event.deployment_status.state == 'success' && github.event.deployment.environment == 'Production'`
  and probe **`CANONICAL_ORIGIN`**, not `environment_url` — the probe's `X-Robots-Tag` enforcement and the
  self-canonical path check are meant for the production host (Phase 8's platform-header note).
- **`GITHUB_TOKEN`**: this repo's default workflow permission is **`read`** (`gh api …/actions/permissions/workflow`),
  so every workflow needs an explicit `permissions:` block (`contents: write` for the reading commit,
  `issues: write` for alerts). Pass it to the CLI as `GH_TOKEN: ${{ github.token }}`. "Events triggered by the
  `GITHUB_TOKEN` will not create a new workflow run" (except `workflow_dispatch`/`repository_dispatch`) — the
  weekly push therefore cannot recurse into Actions; Vercel, a separate GitHub app, **does** still deploy it
  `[ASSUMED, A3]`.
- Actions are enabled on the repo (`enabled: true, allowed_actions: all`).

```yaml
# .github/workflows/measure-indexation.yml — skeleton the executor fills in
name: measure-indexation
on:
  schedule: [{ cron: "17 6 * * 1" }]     # Monday 06:17 UTC — off the top-of-hour load spike
  workflow_dispatch:
permissions: { contents: write, issues: write }
concurrency: { group: measure-indexation, cancel-in-progress: false }
jobs:
  measure:
    runs-on: ubuntu-latest
    env: { GH_TOKEN: "${{ github.token }}" }
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - id: measure
        run: npx tsx scripts/measure-indexation.ts
        env: { GSC_SERVICE_ACCOUNT_JSON: "${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}" }
        continue-on-error: true              # the reading is committed even when thresholds trip
      - run: |                               # commit the dated reading (bot identity), push
          git config user.name  "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add docs/measurements/gsc && git diff --cached --quiet || git commit -m "chore(measure): weekly GSC indexation reading"
          git push
      - if: steps.measure.outcome == 'failure'
        run: |                               # one open issue per breach stream — comment if it already exists
          … gh issue list --label indexation-alert --state open … ? gh issue comment : gh issue create --label indexation-alert …
          exit 1
```

```yaml
# .github/workflows/verify-indexation.yml — skeleton
name: verify-indexation
on: { deployment_status: }
permissions: { contents: read, issues: write }
jobs:
  probe:
    if: github.event.deployment_status.state == 'success' && github.event.deployment.environment == 'Production'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npx tsx scripts/verify-indexation.ts "$(npx tsx -e "import { CANONICAL_ORIGIN } from '@/lib/constants'; console.log(CANONICAL_ORIGIN)")"
      - if: failure()
        env: { GH_TOKEN: "${{ github.token }}" }
        run: gh issue create --label indexation-alert --title "Post-deploy indexation probe failed" --body-file …
```

Validate locally before pushing: `node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/measure-indexation.yml','utf8'))"`
(js-yaml 4.1.1 is present in `node_modules`), then `gh workflow run measure-indexation.yml` + `gh run watch`.

### Pattern 6 — DNS zone snapshot script (D-14)

`scripts/snapshot-dns.sh <zone>… [--out dir]`: for each zone, resolve the authoritative NS (`dig +short NS`),
then `dig @<ns1> +noall +answer` for `SOA NS A MX TXT` at the apex and `A` for `www mail ftp smtp pop`,
`TXT _dmarc`, `TXT x._domainkey` / `titan1._domainkey`, `CNAME autoconfig`, `SRV _autodiscover._tcp`, plus
`dig DS` at the registry; header lines `# DNS snapshot <zone> taken <UTC> queried @<ns>` and
`# registry delegation: …` — **byte-compatible with the 2026-09-16 files** so `diff` works across captures.
Output `dns/<zone>-<UTC>.txt`. Read-only by construction (no zone edits anywhere in this phase; the SPF `a`
tidy is Phase 10's MIG-02).

### Pattern 7 — The D-04 evidence probe: `scripts/verify-measurement.ts <baseUrl>`

Mirrors `verify-indexation.ts`'s shape (usage guard, collect every violation, print all, exit non-zero) and asks
the **measurement** question (D-23 keeps it separate from the indexation probe):

1. `dns.promises.resolveTxt("tpsklimaattechniek.nl")` and `("tpsventilatie.nl")` each contain a
   `google-site-verification=` record (D-05, D-07 — the legacy record must still exist long after Phase 10).
2. `GET {base}/` HTML contains `<meta name="google-site-verification" content="…">` inside `<head>`; when
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is set in the environment, the content must equal it (D-08).
3. `GET {base}/sitemap.xml` → 200, `<loc>` count `=== INDEXABLE_FLOOR` (imports **only** the constant, P8 D-25).
4. `GET {base}/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` → 200 with a JavaScript
   content-type — a **necessary, not sufficient** condition (§Pitfall 1); printed as such.
5. When `VERCEL_TOKEN` is set: `GET https://api.vercel.com/v1/query/web-analytics/visits/count?projectId=prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q&teamId=team_YrD4rsBlATPg7g02y1QThOhg&since=<7d ago>&until=<now>`
   `[CITED: vercel.com/docs/rest-api/sdk/web-analytics/counts-page-views]` must return 200 and a positive
   count — this is "reporting live traffic" (MEAS-06) in machine form. Absent the token, the step is reported
   as skipped, never as passed.

### Anti-patterns to avoid

- **Grepping SSR HTML for `/_vercel/insights`** — `@vercel/analytics/next` 2.0.1 injects the script from a
  `useEffect` (`createElement("script")` in `dist/next/index.mjs`, verified); production HTML has zero hits.
- **Treating `script.js` 200 as "enabled"** — it answered 200 while the API says analytics is not found.
- **A hand-maintained URL list in the measurement script** — D-19 + the Phase 8 bug; import `sitemapEntries()`.
- **Matching on `coverageState` text** — free-form, localised; match on `verdict`.
- **Printing the access token or the token-exchange body** in CI logs — Actions masks only exact secret values.
- **Setting the env var without a redeploy** — `NEXT_PUBLIC_*` is inlined at build time; the tag appears only
  after the next production build (§Pitfall 3). Likewise analytics routes appear "after your next deployment".
- **Running `next build`, `tsc --noEmit` or `eslint` locally** — deadlock on this mount; `tsx` and the Vercel
  build are the gates.

---

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---|---|---|---|
| OAuth2 access token | an OAuth *client* flow, refresh tokens, consent screens | the documented **JWT-bearer service-account** exchange (Pattern 1) | one POST, no browser, no refresh — the only hand-rolled crypto is a standard RS256 signature via `node:crypto` |
| Sitemap XML parsing | an XML library | the same `<loc>` regex `verify-indexation.ts` uses | 27 URLs, no namespaces; a dependency buys nothing |
| Workflow YAML validation | a YAML linter install | `js-yaml` already in `node_modules` + `gh workflow run` | GitHub is the only real validator |
| DNS querying in the probe | shelling out to `dig` from TypeScript | `node:dns/promises.resolveTxt` | built in; `dig` stays in the bash snapshot where its output format matters |
| Issue de-duplication | a state file | `gh issue list --label indexation-alert --state open --json number` | the label is the state |
| Geolocated SERP checks | a rank-tracker signup | `uule` + `gl/hl` + `pws=0`, footer-verified (§Pitfall 12) | rejected in D-13 on recurring cost |

---

## Common Pitfalls

### Pitfall 1 — "Analytics is on" without evidence   ⚠ MEAS-06 blocker
**What goes wrong:** `/_vercel/insights/script.js` returns 200 today, yet the Vercel API/MCP answers
`404 "Web Analytics not found"`. A probe that checks only the script URL reports success on a project that is
collecting nothing. **Why:** the script endpoint is served platform-wide; enablement is a project setting.
**Avoid:** enable in the dashboard (Project → Analytics → Enable; Speed Insights likewise) or `vercel project
web-analytics` after `vercel login` `[CITED: vercel.com/docs/cli/project]`; then **redeploy** ("Enabling Web
Analytics will add new routes … after your next deployment" `[CITED: vercel.com/docs/analytics/quickstart]`);
prove "reporting" with the API count / MCP and the browser's `/_vercel/insights/view` request (Chrome
`read_network_requests`). Also "a 404 error … while loading `script.js`" is the documented symptom of deploying
before enabling `[CITED: vercel.com/docs/analytics/troubleshooting]` — the plan sequences enable → redeploy.

### Pitfall 2 — DNS cannot verify a URL-prefix property; a parent property can
**What goes wrong:** planning to verify `https://tpsventilatie.nl/` by pasting the DNS token — Google states the
DNS method "is required only for Domain property … not URL-prefix properties"; URL-prefix accepts HTML file,
HTML tag, GA, GTM `[CITED: support.google.com/webmasters/answer/9008080]`. The HTML file/tag needs cyberfolks or
WP-admin access, which **nobody on our side holds today** (memory 2026-09-16, contradicting PROJECT.md's older
"hosting admin held"). **Avoid:** create the two URL-prefix properties and expect **inherited verification** —
"any child properties that you create … will be auto-verified" under a verified parent (same doc; that the
Domain property counts as the parent is `[ASSUMED, A1]`). If GSC still demands a method, record the property as
**owner-blocked** with the reason; the two verified Domain properties already satisfy "both variants of each
domain (domain-level where possible)".

### Pitfall 3 — The meta tag needs a *build*, not a restart
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is read at build time into `GOOGLE_SITE_VERIFICATION` and emitted as
`verification.google` (in `<head>`, which Google requires — same doc). After `vercel env add … production`, push
an empty commit or use the dashboard "Redeploy"; then `curl` the home page for the tag **before** clicking
Verify in GSC. Expect the URL-prefix property to auto-verify via the parent Domain property first — still add
the HTML-tag method on the Ownership-verification page so the seam is independently proven (D-08's point).

### Pitfall 4 — Wrong `siteUrl` shape → 403/404 that looks like a permission problem
Domain properties are addressed as `sc-domain:example.com`; URL-prefix as the full origin **with** trailing
slash. The service account must be a **Full** user on *each* property it queries (add its `client_email` under
Settings → Users and permissions); an SA missing from a property gets a 403 on that property only. Restricted
users cannot use URL Inspection `[CITED: support.google.com/webmasters/answer/7687615]`.

### Pitfall 5 — Default `GITHUB_TOKEN` is read-only here
Verified `default_workflow_permissions: read`. Without `permissions: { contents: write, issues: write }` the
reading commit fails with 403 and the issue step fails. Keep `contents: read` on the deploy-triggered probe.

### Pitfall 6 — The weekly commit rebuilds production (accepted) and must not recurse
The bot's push cannot retrigger Actions (documented `GITHUB_TOKEN` rule) but Vercel's GitHub app will build it
`[ASSUMED, A3]`. That is a **feature** here: identical code, plus a weekly run of the 8-guard `prebuild` and the
D-22 probe. If it ever becomes noisy, the opt-out is `ignoreCommand: "git diff --quiet HEAD^ HEAD -- . ':(exclude)docs/measurements'"`
in `vercel.json` (exit 0 = skip) `[CITED: vercel.com/docs/project-configuration/vercel-json]` — deliberately
**not** added now (STACK.md: no `vercel.json` unless it earns its place).

### Pitfall 7 — Scheduled workflows die quietly on a public repo
Auto-disabled after 60 days without repository activity; only the default branch is scheduled. The weekly
reading commit is itself activity `[ASSUMED, A4]`; `workflow_dispatch` is the manual re-arm; the runbook
documents "if the weekly issue stops appearing, check Actions → measure-indexation → Enable".

### Pitfall 8 — Public repo, public readings
Every weekly JSON (per-URL index state, canonical, crawl time) becomes public. Acceptable — none of it is
secret (`site:` queries reveal the same). What must **never** enter the repo: the SA key, the access token, a
Vercel token. `.gitignore` gains the key patterns; the scripts never log token material (T-9-token-log).

### Pitfall 9 — Day-one GSC data is empty, not broken
Performance data lags ~2 days and the new property showed "Processing data" on 2026-09-16. An empty export for
`sc-domain:tpsklimaattechniek.nl` in the first 48–72 h is expected; the export script prints the date range and
row count so "0 rows" is visibly a timing statement, and the plan re-runs it before declaring the baseline
complete (D-17).

### Pitfall 10 — URL Inspection ≠ Request indexing
The API only inspects; "Request indexing" is UI-only (done for the 5 URLs on 2026-09-16, D-11). Do not plan an
API-driven indexing request; do not use the Indexing API (job postings / broadcast events only).

### Pitfall 11 — Chrome quirks already paid for (memory 2026-09-16)
GSC "inspect" deep links 404 — use the top "Inspect any URL" bar (two clicks to focus). dd24 modal form fields
need a `find` refresh before `form_input`; "Opslaan" needs two clicks (first blurs). The extension cannot resize
below ~1316 px and is not available in incognito — see Pitfall 12.

### Pitfall 12 — "Logged-out, geolocated" SERPs from a logged-in Chrome
The extension runs in the user's signed-in profile. Use `https://www.google.nl/search?q=<query>&gl=nl&hl=nl&pws=0&uule=<Zoetermeer>`;
`pws=0` disables personalisation, `uule` is Google's encoded canonical location (`w+CAIQICI` + length-secret +
base64 of `Zoetermeer,South Holland,Netherlands`; generate with the SerpApi/OpenWeb Ninja UULE tool)
`[LOW: community-documented — serpapi.com/tools/uule-generator, valentin.app/uule.html]`. **Self-verify each
session**: the SERP footer must read "Zoetermeer" as the location; if it does not, the snapshot is invalid.
Record the exact URL template in the baseline README so the retake is mechanical (D-13). A Chrome **Guest**
window is the cleaner logged-out surface if the user opens one.

### Pitfall 13 — Two zones carry live mail; this phase never edits either
All TXT records are already in place. Every DNS action in this phase is a **read** (`dig`, `resolveTxt`). The
only write anyone should ever contemplate — the SPF `a` drop — is Phase 10's MIG-02.

---

## Code Examples

Additional verified shapes the executor copies from:

```ts
// scripts/gsc/api.ts — inspect one URL (Pattern 2)
export async function inspectUrl(token: string, siteUrl: string, inspectionUrl: string) {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ inspectionUrl, siteUrl, languageCode: "en-US" }),
  });
  if (!res.ok) throw new Error(`inspect ${inspectionUrl} → HTTP ${res.status}`);   // 403 ⇒ SA not a user on siteUrl
  return (await res.json()).inspectionResult.indexStatusResult as IndexStatusResult;
}
// sitemaps.get (Pattern 3): GET https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}
// searchanalytics.query (Pattern 4): POST https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query
```

```bash
# scripts/snapshot-dns.sh — the record set (Pattern 6), one zone
NS=$(dig +short NS "$zone" | sort | head -1)
{ echo "# DNS snapshot $zone  taken $(date -u +%FT%TZ)  queried @$NS"
  echo "# registry delegation: $(dig +short NS "$zone" | tr '\n' ' ')"
  echo "# DS: $(dig +short DS "$zone" | tr '\n' ' ') (empty = DNSSEC off)"; echo
  for t in SOA NS A MX TXT; do dig @"$NS" +noall +answer "$zone" "$t"; done
  for h in www mail ftp smtp pop; do dig @"$NS" +noall +answer "$h.$zone" A; done
  dig @"$NS" +noall +answer "_dmarc.$zone" TXT
  for s in x titan1; do dig @"$NS" +noall +answer "$s._domainkey.$zone" TXT; done
  dig @"$NS" +noall +answer "autoconfig.$zone" CNAME; dig @"$NS" +noall +answer "_autodiscover._tcp.$zone" SRV
} > "$out/$zone-$(date -u +%Y%m%dT%H%M%SZ).txt"
```

```ts
// scripts/gsc/thresholds.ts — proof shape (tsx -e), the Phase 8 "prove the gate bites" habit
// evaluateReading(prev, curr, "2026-10-15") with 12 PASS → flags include below-ramp (week 4 needs 20)
// evaluateReading(prevWithPASS, currWithFAIL, …) → lost-indexation names the URL
// evaluateReading(undefined, curr, "2026-09-22") → no ramp rung applies yet, only regressions (none) → []
```

---

## State of the Art

| Old approach | Current approach | Since | Impact here |
|---|---|---|---|
| GA4 + consent banner | Vercel Web Analytics + Speed Insights, cookieless | carried lock (P3) | no privacy-policy processor entry; Hobby retention is **1 month**, Pro **12 months** `[CITED: vercel.com/docs/analytics/limits-and-pricing]` |
| Speed Insights paid-only | free tier on all plans (RES score, 24h/7d ranges; Plus unlocks CWV breakdown) `[CITED: vercel.com/docs/speed-insights/limits-and-pricing]` | 2025 | enable it; do not budget for Plus |
| Index Coverage report | URL Inspection API per URL (aggregate report not exposed) | D-19 | names the stuck page |
| `vercel.json` | `vercel.ts` recommended | 2026 | irrelevant — no Vercel config file added |
| `actions/checkout@v4` / `setup-node@v4` | **v7** / **v7** | 2026 | pin `@v7` |

**Deferred question answered:** Vercel retention on the current plan — the project's plan is not exposed by
`get_project`; if the team is Hobby, the reporting window is one month, so the **weekly committed reading**
(with the optional `VERCEL_TOKEN`-gated 7-day visit count) is the durable record, exactly as CONTEXT anticipated.

---

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|---|---|---|
| A1 | A verified **Domain** property counts as the parent that auto-verifies child URL-prefix properties (`https://tpsventilatie.nl/`, `https://www.tpsventilatie.nl/`) | Pitfall 2 | the two legacy URL-prefix properties stay owner-blocked (needs WP/cyberfolks access); Domain properties still cover CoA |
| A2 | Search Analytics exposes up to 16 months of history for a newly verified property (legacy backfill, D-16) | Pattern 4 | baseline shows a shorter legacy window; still a valid "before" |
| A3 | Vercel's GitHub app deploys pushes authored by `github-actions[bot]` via `GITHUB_TOKEN` | Pitfall 6 | no weekly rebuild — nothing breaks; the D-22 probe simply runs less often |
| A4 | The bot's weekly commit counts as "repository activity" for the 60-day scheduled-workflow rule | Pitfall 7 | the cron silently disables after 60 quiet days — `workflow_dispatch` + runbook note re-arm it |
| A5 | Google accepts a service-account `client_email` as a GSC user (standard practice for the API) | Pattern 1 | fallback: OAuth client with a stored refresh token — heavier; would need re-planning |
| A6 | Key creation is allowed on the agency Google account (no org policy `iam.disableServiceAccountKeyCreation`) | Pattern 1 | Workload Identity Federation for Actions (keyless) — heavier; re-plan |
| A7 | `uule` + `pws=0` produce Zoetermeer-localised, de-personalised results (footer-verified) | Pitfall 12 | fall back to a Chrome Guest window opened by the user; the method is recorded either way |

---

## Open Questions (RESOLVED)

1. **SA permission level (CONTEXT discretion)** — RESOLVED: **Full** user per property; readonly scope on the token.
2. **Baseline directory date** — RESOLVED by D-27: `docs/baseline/2026-09-16/`.
3. **How to verify the legacy URL-prefix properties without WordPress access** — RESOLVED: inherited verification under
   the Domain property (A1); if refused, record as owner-blocked; success criterion 1 is met domain-level.
4. **How to prove "Analytics reporting" mechanically** — RESOLVED: Vercel API `visits/count` (token-gated) / MCP in
   session + browser `/_vercel/insights/view` request; script URL alone is necessary-not-sufficient.
5. **Whether the weekly commit should skip the Vercel build** — RESOLVED: accept the rebuild; `ignoreCommand` documented
   as the opt-out.
6. **Ramp anchor for D-20** — RESOLVED: `RAMP_ANCHOR = 2026-09-16` (sitemap submission), rungs 09-30 / 10-14 / 11-11.
7. **Where Thomas's Google identity comes from (D-02)** — RESOLVED as a plan step: attempt `tpsservices001@gmail.com`
   (dd24 whois contact); if GSC rejects it as not-a-Google-account, the delegation becomes an owner-dependent open item
   recorded in the baseline README and STATE, not a phase blocker.

---

## Environment Availability

| Dependency | Required by | Available | Version / state | Fallback |
|---|---|---|---|---|
| Node + `tsx` | all scripts | ✓ | v26.0.0 / ^4.22.4 | — |
| `dig`, `node:dns` | D-14, D-04 | ✓ | 9.10.6 | — |
| `gh` (auth, `repo`+`workflow` scopes) | secrets, workflows, issues | ✓ | 2.93.0, `Zlodziejczyk` | — |
| GitHub Actions on the repo | D-21/D-22 | ✓ | enabled, all actions allowed, default token **read** | — |
| Vercel CLI login | `vercel env add`, `vercel project web-analytics` | ✗ | token invalid | `! vercel login`, or the dashboard in Chrome (D-01) |
| Vercel MCP | in-session analytics proof | ✓ | `get_project` OK; `get_web_analytics` → not enabled | REST API with `VERCEL_TOKEN` |
| `claude-in-chrome` | GSC/GCP/GBP/Vercel dashboards, SERP | ✓ (deferred tools) | signed-in profile | — |
| `gcloud` | service-account creation via CLI | ✗ | not installed | Cloud Console in Chrome (D-01); `brew install --cask google-cloud-sdk` |
| Google Cloud project | D-18 | ✗ (none yet) | — | create in Console (free; the Search Console API needs no billing) |
| `js-yaml` (transitive) | workflow YAML pre-check | ✓ | 4.1.1 | `gh workflow run` is the real validator |
| Local `next build` / `tsc` / `eslint` | — | ✗ (deadlock on mount) | — | Vercel build; `tsx` |

**Missing with no fallback:** none. **Missing with fallback:** Vercel CLI login (Chrome), `gcloud` (Chrome), GCP project (create).

---

## Validation Architecture

**Honest constraint (unchanged from Phase 8):** no test framework by decision, no local build. Validation is
`tsx` CLI runs, live HTTP/DNS probes, `gh api`/`gh run` state, and — for the workflows — a dispatched run.

### Test framework

| Property | Value |
|---|---|
| Framework | none — `tsx` + `node:assert/strict` CLIs and live probes (project decision) |
| Config file | `package.json` scripts (`measure`, `verify:measurement`, `baseline:gsc`, `snapshot:dns`) — **not** in `prebuild` (network + secrets) |
| Quick run command | `npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` (~5 s) · `npx tsx -e` proofs against `scripts/gsc/thresholds.ts` (~2 s) |
| Full suite command | `npm run prebuild` (8 existing guards, ~2 s — unchanged) + `npx tsx scripts/verify-indexation.ts <prod>` + `npx tsx scripts/verify-measurement.ts <prod>` + `gh run list --workflow measure-indexation.yml --limit 1 --json conclusion` |
| Estimated runtime | ~30 s local; a dispatched workflow ~2 min |

### Phase requirements → verification map

| Req | Behaviour | Type | Automated command | Exists? |
|---|---|---|---|---|
| MEAS-01 | new-domain TXT resolves; served meta tag present and equal to the env token; 5th property verified | probe | `npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` | ❌ plan 09-03 creates |
| MEAS-02 | legacy TXT resolves **while** apex still 200s WordPress | probe | same probe (TXT) + `curl -sI https://tpsventilatie.nl/ \| head -1` = 200 | ❌ plan 09-03 |
| MEAS-03 | sitemap processed, `submitted === 27`, 0 errors | API | `npx tsx scripts/export-gsc-performance.ts --sitemap-only` (reads `gsc/sitemap-*.json`) | ❌ plan 09-02 |
| MEAS-04 | baseline directory complete: dns/ gsc/ gbp/ serp/ + README manifest | file assertions | `node -e` existence/shape checks over `docs/baseline/2026-09-16/` | ❌ plans 09-01/02/05 |
| MEAS-05 | weekly reading produced, thresholds evaluated, workflow green, issue path proven | tsx + gh | `npx tsx scripts/measure-indexation.ts` exit 0 · `npx tsx -e` threshold proofs · `gh run list --workflow measure-indexation.yml` conclusion=success | ❌ plans 09-02/04 |
| MEAS-06 | analytics enabled + reporting | probe + API | `VERCEL_TOKEN=… npx tsx scripts/verify-measurement.ts <prod>` (count > 0) · MCP `get_web_analytics` | ❌ plan 09-03 |

### Sampling rate
- **Per task commit:** the script that task touches (`npx tsx …`, seconds).
- **Per plan:** `npm run prebuild` (must stay green — nothing here joins it, but it must not break) + the probe(s) the plan delivers.
- **Phase gate:** both probes green against production, a green dispatched `measure-indexation` run, a green
  `verify-indexation` run triggered by a real production deployment, baseline manifest complete (D-17).

### Wave 0 gaps
None — `tsx`/`node:assert` infrastructure exists and was exercised (all 8 guards, `verify-indexation.ts`) this milestone.

### Manual-only verifications

| Behaviour | Req | Why manual | Instructions |
|---|---|---|---|
| GBP fields transcribed correctly | MEAS-04 (D-15) | GBP has no read API we hold | Chrome: Business Profile → Info; screenshot + transcribe 6 fields; second look at the public knowledge panel |
| SERP positions / zeroes | MEAS-04 (D-13) | Google SERP is not machine-queryable | Chrome with the URL template; footer shows Zoetermeer; record top-20 position or "niet in top 20" for both domains |
| GSC Ownership-verification panel lists the HTML-tag method | MEAS-01 (D-08) | UI-only | Screenshot into `gsc/` |
| Thomas added as Owner | D-02 | account identity | Settings → Users and permissions; screenshot or record "rejected: not a Google account" |
| Vercel Analytics dashboard shows data | MEAS-06 | dashboard | screenshot after ≥24 h of traffic (API count is the machine form) |

---

## Security Domain

### Applicable ASVS L1 categories

| Category | Applies | Control |
|---|---|---|
| V2 Authentication | yes (machine identity) | Google service account, **JWT-bearer** flow (Pattern 1); token TTL 1 h; readonly scope |
| V4 Access control | yes | SA = **Full** user on exactly the two Domain properties, nothing more; **no GCP IAM roles** needed; workflow `permissions:` minimal per job |
| V5 Input validation | yes | API responses treated as untrusted: enum values checked, `coverageState` stored not matched; sitemap `<loc>` parsed defensively (existing pattern) |
| V6 Cryptography | yes | RS256 via `node:crypto` only (no hand-rolled primitives); key never leaves env/secret |
| V8 Data protection | yes | key in `.env.local`/Actions secret; `.gitignore` patterns; never logged; readings contain no secrets |
| V14 Configuration | yes | actions pinned `@v7`; `concurrency` group; no `pull_request_target`; `deployment_status` job gated to `Production` |

### Threat patterns

| Pattern | STRIDE | Mitigation |
|---|---|---|
| SA key committed / printed | Information disclosure | gitignore patterns (`*.serviceaccount.json`, `gsc-service-account*.json`); scripts print only status codes; Actions masks the secret value; the derived access token is never echoed |
| Over-privileged SA | Elevation | Full (not Owner) on GSC; readonly OAuth scope; SA has no IAM roles |
| Workflow token abuse | Elevation | `permissions:` explicit and minimal; `contents: read` on the deploy probe |
| Recursive/duplicate runs | DoS | `GITHUB_TOKEN` pushes don't retrigger; `concurrency` group; single labelled issue with comments |
| Poisoned reading (tampered JSON) | Tampering | readings are informational; thresholds re-derived from live API each run, previous reading only used for the lost-indexation diff |
| Supply chain (T-9-SC) | Tampering | **no new npm packages**; GitHub-owned actions pinned by major |
| DNS zone edit by mistake | Tampering | phase is read-only on DNS by construction; snapshot script has no write path |

---

## Sources

### Primary (HIGH — executed or official docs)
- Live probes this session: `dig` both zones; `curl` production HTML/sitemap/analytics scripts; legacy HTTP; `gh api` deployments/statuses/permissions; Vercel MCP `get_project` / `get_web_analytics`; `npx tsx` registry enumeration; `node:crypto` RS256 sign; `node_modules/@vercel/analytics/dist/next/index.mjs` inspection
- https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect — endpoint, request, scopes
- https://searchconsole.googleapis.com/$discovery/rest?version=v1 — `IndexStatusInspectionResult` enums
- https://developers.google.com/webmaster-tools/limits — quotas
- https://developers.google.com/webmaster-tools/v1/sitemaps and …/sitemaps/get — `WmxSitemap`, `indexed` deprecated
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query — request/response
- https://developers.google.com/identity/protocols/oauth2/service-account — JWT-bearer flow
- https://support.google.com/webmasters/answer/7687615 — permission levels
- https://support.google.com/webmasters/answer/9008080 — verification methods, child auto-verification, periodic re-checks
- https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows — `schedule`, `deployment_status`, `workflow_dispatch`
- https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow — `GITHUB_TOKEN` no-recursion rule
- https://vercel.com/docs/analytics/quickstart, …/troubleshooting, …/limits-and-pricing; https://vercel.com/docs/speed-insights/limits-and-pricing; https://vercel.com/docs/cli/project; https://vercel.com/docs/rest-api/sdk/web-analytics/counts-page-views; https://vercel.com/docs/project-configuration/vercel-json
- https://developers.google.com/search/apis/indexing-api/v3/quota-pricing — Indexing API scope restriction
- `09-CONTEXT.md`, `08-CONTEXT.md`, `08-05-SUMMARY.md`, `08-VERIFICATION.md`, `.planning/research/{STACK,PITFALLS,ARCHITECTURE,SUMMARY}.md`, memory `gsc-state-2026-09-16`, `onedrive-execution-constraints`

### Secondary / tertiary (LOW — marked for validation at execution)
- `uule` mechanics: serpapi.com/tools/uule-generator, valentin.app/uule.html, openwebninja.com UULE tool

---

## Metadata

**Confidence breakdown:** stack HIGH (nothing installed; versions verified) · architecture HIGH (mirrors the
proven Phase 8 probe/guard shapes; APIs read from official references) · pitfalls HIGH for the six verified by
probe, MEDIUM for A1–A6, LOW for A7.
**Research date:** 2026-09-16 · **Valid until:** 2026-10-16 (GSC/GitHub/Vercel surfaces are stable; re-check
action majors and the analytics-enabled state at execution).

---
*Phase: 09-measurement-foundation*
*Research completed: 2026-09-16 (inline)*
*Ready for planning: yes*
