# Phase 10: Reversible Old-Brand Migration - Research

**Researched:** 2026-09-21
**Domain:** DNS cutover · host-conditional HTTP redirects (Next.js 16 on Vercel) · mail continuity · Google site-move signalling
**Confidence:** HIGH on mechanism (official docs + Next.js v16.2.1 source + live probes), MEDIUM on Google-side timing

> **Reading order for the planner.** §Summary names four findings that change what the plans must
> contain. §Pitfall 1 (trailing slash) and §Pitfall 2 (catch-all host gate) are the two that will
> silently ship a broken migration if missed. §Execution Sequence is the spine of the plan waves.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01 … D-28) — carried into the plans unchanged

**Carried-forward locks that are NOT re-opened:** `lib/seo/policy.ts` is the only place sitemap
membership and the `robots` directive are decided (P1 D-08, P3 D-02, P8 D-05). Build gates are
`tsx` + `node:assert` CLIs wired into `prebuild`, never a test framework (P8 D-01). Vercel preview
is the build gate; there is no local `next build` on this OneDrive mount (P8 D-08). `INDEXABLE_FLOOR`
is the single named source of "how many pages complete looks like" (P8 D-25). The two probes stay
distinct and both stay (P9 D-23). Legacy GSC verification is never removed (P9 D-07). Redirects live
in `next.config.ts`, never `.htaccess`; per-URL map over a blanket redirect; WordPress is never
deleted; `info@tpsventilatie.nl` is kept indefinitely (PROJECT.md Key Decisions).

**Access Reality & Requirement Corrections**

- **D-01 — We hold dd24 (the domain and its DNS) and nothing else on the old stack.** WordPress admin,
  the cyberfolks hosting panel and the `info@tpsventilatie.nl` mailbox are all held by cyberfolks/Thomas.
  `PROJECT.md` §Context is wrong where it says *"Access held for v1.1: … admin on the old site's
  hosting"* — the hosting half is false and must be corrected as part of this phase. Only MIG-01 could
  not be executed from our side.
- **D-02 — MIG-01 is reduced to a credential-free public content mirror, and the residual risk is
  explicitly accepted.** The DNS change moves two A records and touches neither files, database, vhost
  nor subscription. **A backup does not protect reversibility — "we never touch the install" plus "the
  subscription stays for mail" does.** Accepted risks: (1) the install rots unpatched (WP 7.1.1);
  (2) the cyberfolks subscription ends; (3) a host-side accident. Storing a backup at cyberfolks is not
  "off-host". Instead: a `wget`/`httrack` mirror of the 9 public legacy pages and their assets, taken by
  us while the old site is still live. No ask on Thomas.
- **D-03 — The MIG-01 change is recorded by amending the milestone artefacts, not by a footnote.**
  Rewrite `MIG-01` in `.planning/REQUIREMENTS.md`, and adjust `.planning/ROADMAP.md` §"Phase 10"
  success criterion 4 and the `MIG-01…04` hard-gate line.

**Pre-flight dd24 Zone Work (MIG-02)**

- **D-04 — TTL: lower the apex and `www` A records to 300 s, at least 8 h before the cutover**, and hold
  them low for the whole ~28-day reversibility window; restore to 28800 at the day-28 final declaration.
  Only the two records that change get touched.
- **D-05 — Drop the SPF `a` mechanism in the same dd24 session that lowers the TTLs, ≥8 h before the
  cutover.** Target: `v=spf1 mx include:_spf.cyberfolks.pl -all`.
- **D-06 — HARD CONSTRAINT: `google-site-verification=DvCnCNBbXd73JTab3-DsDmq_KgkQmlCZ7onK6OqDkoI`
  must not be touched while editing that zone.**

**Cutover Execution (MIG-07)**

- **D-07 — The user edits the two A records by hand at dd24, inside a live Claude session.** Claude
  supplies the exact host / type / value / TTL beforehand, then within minutes: `dig` against all three
  dd24 nameservers, probes all 9 redirects from both legacy hostnames, confirms Vercel issued the
  certificate, runs the mail round-trip. Check the dd24 status banner before touching anything.
- **D-08 — HARD CONSTRAINT: both legacy hostnames are attached to the Vercel project as ordinary
  serving domains, with no Vercel-level domain redirect between them.**
- **D-09 — The map is proven green *before* any DNS record changes, via a spoofed `Host` header.**
  Attach both legacy hostnames first (Vercel will show "Invalid Configuration" — expected), then probe.
  All 9 sources × both hostnames plus a catch-all sample proven before the one-way door opens.

**Rollback (MIG-10)**

- **D-10 — Rollback triggers are mail and TLS only.** Revert the two A records immediately if
  `info@tpsventilatie.nl` fails to send **or** receive, or if either legacy hostname lacks a valid
  certificate ~30 minutes after the flip. Search performance never triggers a revert. A broken redirect
  is fixed by a deploy, not by DNS.
- **D-11 — Day 28 is the declared point of no return.** Migration declared final in a dated note in
  `docs/baseline/`; TTLs go back to 28800. The rollback document must state that the old WordPress
  install lives only as long as the cyberfolks subscription, which exists only for `info@tpsventilatie.nl`.

**Redirect Map (MIG-05)**

- **D-12 — A path-preserving catch-all, `/:path*` → `${CANONICAL_ORIGIN}/:path*`, placed *after* the 9
  explicit rules.** Without a catch-all the Next app serves every new route under the old hostname.
  Rejected: catch-all → homepage; an added 410 set for WP paths.
- **D-13 — `/mechanische-ventilatie-dakventilator/` → `/diensten/mechanische-ventilatie` (the pillar),
  not `…/aanleggen`.** Live page H2 is "Dakventilator Onderhoud"; packages are maintenance/cleaning/
  replacement. Evidence travels with the entry (D-16).
- **D-14 — Explicit `statusCode: 301`, not `permanent: true`.**
- **D-15 — The legacy host's `/robots.txt` and `/sitemap.xml` are 301'd like everything else.**
- **D-16 — Every entry carries `confidence: "certain" | "judgement"`, and `assert-redirects.ts` requires
  a non-empty `why` on every `judgement` entry.**

**Gates & Verification (MIG-06)**

- **D-17 — Split the gate: structural at build time, live after deploy.** `assert-redirects.ts` joins
  `prebuild` and checks structure only. The live assertion extends `scripts/verify-indexation.ts`.
- **D-18 — "Exactly one hop" is asserted from `https://`, on both legacy hostnames.** Vercel's automatic
  `http`→`https` 308 is recorded in the probe output as a known, accepted extra hop.
- **D-19 — No additional scheduled HTTP watch on the redirects.** *(User's deliberate choice against the
  recommendation.)* Reconciled by D-25's weekly GSC legacy section.

**Owner Continuity & Mail (MIG-03, MIG-04, MIG-08)**

- **D-20 — Webmail: document `https://s161.cyber-folks.pl/webmail/`.**
- **D-21 — WP-admin: an `/etc/hosts` override (`tpsventilatie.nl` → `195.78.67.39`), with `siteurl` left
  untouched.** Documented caveat: the old box's Let's Encrypt certificate cannot renew after cutover.
- **D-22 — MIG-04 is green only when both halves are proven** — the mechanical half (ours) and the human
  half (Thomas logs in through it, once, pre-cutover, dated and recorded).
- **D-23 — MIG-08 is proven by a reply round-trip with headers captured** into `docs/baseline/`.

**Change of Address & the 180-Day Floor (MIG-09)**

- **D-24 — File the Change of Address the same day**, once the one-hop probe is green from both legacy
  hostnames. Filed from the legacy Domain property plus both legacy URL-prefix properties.
- **D-25 — Extend the Phase 9 weekly cron with a legacy section**: Search Analytics for
  `tpsventilatie.nl` + URL Inspection on the 9 legacy URLs. Flag when legacy impressions have been ~0
  for N consecutive weeks.

**Brand Continuity**

- **D-26 — A permanent, small "voorheen TPS Ventilatie" line in the footer** (and/or `over-ons`) —
  unconditional, not arrival-detected. Site copy → owner's editorial gate.
- **D-27 — The GBP website-URL edit stays in Phase 11.**

**Mirror Storage**

- **D-28 — The legacy content mirror lives in git at `docs/baseline/<capture-date>/legacy-site-mirror/`,
  with a size ceiling.** If the mirror exceeds ~25 MB, HTML stays in git and images move to external
  storage with location + SHA-256 in the baseline manifest. Measured at execution. Take it before cutover.

### Claude's Discretion — resolved by this research

| # | Discretion area | Resolution |
|---|---|---|
| 1 | Module layout / naming inside `lib/seo/*`; internals of `assert-redirects.ts` | §Pattern 1 + §Pattern 2 |
| 2 | Live one-hop assertion: extend `verify-indexation.ts` or sibling script | **Sibling script** `scripts/verify-redirects.ts` — §Pattern 3 |
| 3 | Branch vs `main`; commit granularity | **Branch** `gsd/phase-10-reversible-old-brand-migration` — §Execution Sequence |
| 4 | Shape/location of the day-28 "declared final" record | §Pattern 8 |
| 5 | Mirror tooling and flags | **`wget` 1.25.0 via Homebrew** — §Pattern 6 (measured: ~1.6 MB, ceiling will not bind) |
| 6 | How the runbook absorbs D-20/D-21/D-10/D-11; Dutch wording | §Pattern 7 |
| 7 | The N in "legacy impressions ~0 for N consecutive weeks"; legacy reporting shape | **N = 4**, §Pattern 9 |
| 8 | Dutch wording of the D-26 footer line | §Pattern 10 |

### Deferred Ideas (OUT OF SCOPE — do not plan)

- A full WordPress files + database backup, off-host and restore-tested.
- Cyberfolks hosting-panel access (ideally a sub-account).
- A scheduled live HTTP watch on the 9 redirects.
- GBP website-URL change — Phase 11.
- A conditional "you arrived from the old domain" notice.
- Retiring the redirect map — gated on D-25's evidence, never before the 180-day floor.
- The GSC service-account key rotation — carried from Phase 9 as an outstanding owner action.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description (as amended by D-02/D-03) | Research support |
|----|----|----|
| MIG-01 | ~~Full WordPress backup off-host, restorability confirmed~~ → **a credential-free public content mirror of the 9 legacy pages + assets, committed to `docs/baseline/<date>/legacy-site-mirror/`** | §Pattern 6 — `wget` invocation, measured footprint (~1.6 MB), `wget` **not installed** (§Environment Availability) |
| MIG-02 | Legacy SPF drops the `a` mechanism | §Execution Sequence step 3; live-re-verified 2026-09-21 that SPF still carries `a` and TTL is 28800 |
| MIG-03 | Alternate webmail route documented + verified before cutover | §Pattern 7; D-20's route is host-level and DNS-independent |
| MIG-04 | Alternate WP-admin route verified before cutover | §Pattern 7 + §Pitfall 4 (the cert expiry date is **2026-10-29**, not "~90 days") |
| MIG-05 | Typed 9-entry map in `lib/seo/redirects.ts`, destinations from `CANONICAL_ORIGIN` | §Pattern 1 — incl. the **allowed-keys constraint** that forces `confidence`/`why` to stay out of the emitted objects |
| MIG-06 | Build gate fails on chains, duplicate sources, non-200 destinations | §Pattern 2 (structural, `prebuild`) + §Pattern 3 (live) |
| MIG-07 | Both legacy hostnames attached + repointed; every legacy URL one hop | §Pattern 5 + §Pitfall 1 (**one hop is impossible without `skipTrailingSlashRedirect`**) |
| MIG-08 | `info@tpsventilatie.nl` verified sending and receiving after cutover | §Pattern 7; §Pitfall 4 names a dated follow-up check |
| MIG-09 | Change of Address for every verified legacy variant, from a domain-level property | §Pattern 9 — Google confirms the tool **does not move subdomains**, so per-variant filing is required, not belt-and-braces |
| MIG-10 | Rollback documented; WordPress left intact and reachable | §Pattern 8 + §Runtime State Inventory |
</phase_requirements>

---

## Summary

This phase is not a coding problem. It is one irreversible DNS edit wrapped in a pre-flight checklist,
and the research question that matters is: *which of the mechanisms the CONTEXT assumes actually behave
the way it assumes?* Four do not, and all four are load-bearing.

**Finding 1 — the blocker that isn't.** The brief flagged a suspected BLOCKER: `redirects()` is
explicitly unsupported under `output: "export"`, which `CLAUDE.md` still says this project uses.
It doesn't. `output: "export"` was **dropped in Phase 5** to ship `app/api/lead/route.ts`
(`.planning/PROJECT.md:116`: *"Hosting is hybrid (dropped `output: "export"` for `/api/lead`)"*), and the
current `next.config.ts` is `trailingSlash: false` + `images.formats` only. Verified three ways: the file
on GitHub, the PROJECT.md line, and a live probe — `POST /api/lead` → **400**, `GET /api/lead` → **405**,
which a static export cannot produce. `redirects()` works. **`CLAUDE.md`'s Technology Stack section is
stale and should be corrected in this phase** (it is the same class of drift D-01/D-03 are already fixing
in PROJECT.md).

**Finding 2 — one hop is unreachable as the map is currently specified, and the failure is silent.**
`trailingSlash: false` makes Next.js `unshift` an internal `/:path+/` → `/:path+` **308 to the front of
the redirects array**, ahead of every user-defined rule (Next.js v16.2.1 `load-custom-routes.ts`, read
directly). The legacy site's canonicals are slashed — live-verified:
`<link rel="canonical" href="https://tpsventilatie.nl/over-ons/" />`. So *every* legacy inbound link
would walk **two hops**: `…tpsventilatie.nl/over-ons/` → 308 → `…tpsventilatie.nl/over-ons` → 301 → new
site. ARCHITECTURE.md's instruction *"Sources must be written with the trailing slash"* is precisely what
cannot work. The fix is `skipTrailingSlashRedirect: true` plus a verbatim re-add of the internal rule
**after** the legacy rules — see §Pitfall 1. A build-time structural gate cannot see this; only the live
probe can.

**Finding 3 — D-09's probe cannot run as written.** Vercel's edge dispatches on the HTTP `Host` header
(proven: `Host: tpsklimaattechniek.nl` sent over a TLS connection to `www.tpsklimaattechniek.nl` returned
that domain's 308), so the *idea* is sound. But aiming it at a `*.vercel.app` deployment URL returns
**403 `x-vercel-mitigated: deny`** — Vercel blocks Host/SNI mismatch on `.vercel.app` endpoints. The
working form aims the TLS connection at the **production custom domain** and spoofs `Host` there. That
adds one sequencing constraint the CONTEXT does not state: the map must already be **deployed to
production** before the pre-flight probe is meaningful (harmless — the rules are host-gated and no
legacy DNS points at Vercel yet).

**Finding 4 — an undocumented dated risk to the owner's mail.** `mail.tpsventilatie.nl` serves IMAPS
(993), SMTPS (465) and submission (587) with a single Let's Encrypt certificate whose SANs are
`mail.tpsventilatie.nl`, `tpsventilatie.nl`, `www.tpsventilatie.nl` — the two names this phase repoints —
expiring **2026-10-29** (38 days from today). If cyberfolks renews via HTTP-01 for all three SANs, the
apex and www challenges will be answered by Vercel after cutover and the order can fail, taking the mail
client's TLS with it — *weeks* after the cutover, quite possibly after D-11's day-28 point of no return.
This is not in CONTEXT.md. §Pitfall 4 gives the dated check and the escape hatch.

**Primary recommendation:** plan the phase as four gates — *prep (fully reversible)* → *pre-flight proof
(the checklist, with the map already live in production behind the host gate)* → *the flip (one dd24
session, one live Claude session)* → *post-flip within 24 h (CoA, headers, DNS diff)*. Add
`skipTrailingSlashRedirect: true` and re-add the normalization rule; gate the catch-all on `has: host`
or the new site takes itself down; and add the 2026-10-29 mail-certificate check to the runbook.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Legacy → current URL mapping (data) | Repo — `lib/seo/redirects.ts` | — | Pure, typed, serialisable; outlives `.planning/` (D-16) |
| Host-conditional 301 execution | Vercel edge (compiled from `next.config.ts` `redirects()`) | — | Evaluated before filesystem routes and before any function is invoked; zero runtime cost |
| Trailing-slash normalisation | Vercel edge (same redirects array) | — | Currently framework-implicit; this phase makes it **explicit** so ordering is controllable (§Pitfall 1) |
| Structural correctness of the map | Build — `scripts/assert-redirects.ts` in `prebuild` | — | Reasons about data; must never touch the network (D-17) |
| Served correctness (one hop, 200) | CI — `scripts/verify-redirects.ts` on `deployment_status` | Local `npx tsx` run | Reasons about real HTTP responses; the only tier that can see Finding 2 |
| Hostname → project binding | Vercel project domains | dd24 zone | Alias table is independent of DNS; that separation is what makes D-09's pre-flight possible |
| Name resolution + mail authorisation | dd24 zone | — | The only external system this phase mutates; hand-edited (D-07) |
| Site-move signal to Google | GSC Change of Address (3 properties) | The 301s themselves | Google validates the redirects at submission, so the redirect tier must be green first |
| Consolidation evidence | CI — weekly `measure-indexation.ts` legacy section | — | Answers "did Google agree?"; the only tier that can retire the map (D-25) |
| Mail delivery | cyberfolks (`mail.` A + MX, untouched) | — | Out of our control by construction — which is the point of not touching those records |
| Legacy content preservation | Git — `docs/baseline/<date>/legacy-site-mirror/` | — | Public HTML/images only; no personal data, so it can be committed (D-28) |

---

## Standard Stack

### Core (nothing new is installed into the application)

| Library / tool | Version | Purpose | Why standard here |
|---|---|---|---|
| `next` | **16.2.1** (installed) | `redirects()` with `has: [{ type: "host" }]` | Already the framework; the mechanism is first-party and compiles to edge routes |
| `tsx` | ^4.22.4 (installed) | `assert-redirects.ts`, `verify-redirects.ts` | The established gate runtime (P8 D-01) — 8 guards already in `prebuild` |
| `node:assert/strict` | Node 26 builtin | Structural assertions | House convention; no test framework by decision |
| `dig` (bind tools) | system | TTL/SPF/A verification at all three authoritative NS | Already used by `scripts/snapshot-dns.sh` |
| `curl` | 8.7.1 | One-hop probing, spoofed-`Host` pre-flight | `--max-redirs`/`-w` give exact hop counts; no library needed |
| `openssl` | 3.6.2 | Certificate issuance/expiry verification | The only tool that can answer D-10's TLS rollback trigger and §Pitfall 4 |

### Supporting (new tooling, dev-machine only — never a project dependency)

| Tool | Version | Purpose | When |
|---|---|---|---|
| `wget` | **1.25.0** (Homebrew, **not installed**) | The D-28 legacy content mirror | Once, before cutover |

### Alternatives considered

| Instead of | Could use | Tradeoff |
|---|---|---|
| `next.config.ts` `redirects()` | `vercel.json` `redirects` | Vercel's own docs: *"When using Next.js, you do not need to use `vercel.json`. Instead, use the framework-native `next.config.js`"*, and framework-level redirects take precedence. Same `has: host` semantics, but splits the source of truth and does **not** pre-empt the trailing-slash rule. ✗ |
| `next.config.ts` `redirects()` | Vercel **Project Routes** (dashboard/API) | Genuinely runs *before* the deployment's own routes, so it would solve §Pitfall 1 without `skipTrailingSlashRedirect`. But it lives outside git, outside `assert-redirects.ts`, and outside D-16's typed map. **Keep as the documented fallback**, not the plan. |
| `next.config.ts` `redirects()` | `vercel.json` `bulkRedirectsPath` | Runs earliest of all, but *"do not support wildcard or header matching"* — no `has: host`, so it would redirect the **new** domain too. ✗ Disqualified. |
| `next.config.ts` `redirects()` | `proxy.ts` (Next 16 middleware) | Would work, but D-12 already rejected middleware as a mechanism this phase does not otherwise require, and it puts an edge function in front of every request. ✗ |
| `wget` | `httrack` 3.50.2 | Also fine and also not installed. `wget` wins on ubiquity, on a one-line reproducible command (D-28 requires reproducibility from a recorded command), and on `--no-parent`/`--domains` being easier to audit. |
| `wget` | hand-rolled `curl` loop | No recursion, no `--page-requisites`, no link rewriting — would miss CSS-referenced assets. See §Don't Hand-Roll. |

**Installation (dev machine only, not the repo):**

```bash
brew install wget        # 1.25.0 — required only for the one-time D-28 mirror
```

**Version verification (run 2026-09-21):** `brew info wget` → `stable 1.25.0 (bottled)`, `Not installed`.
`brew info httrack` → `stable 3.50.2 (bottled)`, `Not installed`. `next` 16.2.1 confirmed in
`package.json` and `node_modules`.

---

## Package Legitimacy Audit

**No npm packages are added by this phase.** `package.json` `dependencies` and `devDependencies` are
unchanged; the only new artefacts are two `scripts/*.ts` files and one `lib/seo/*.ts` module, all using
already-installed `tsx` + Node builtins.

| Package | Registry | Age | Downloads | Source repo | slopcheck | Disposition |
|---|---|---|---|---|---|---|
| *(none added)* | — | — | — | — | n/a | **No audit required** |
| `wget` | Homebrew (not npm) | GNU, since 1996 | core formula | git.savannah.gnu.org/wget | n/a — not an npm package | Approved; **system tool, dev machine only, never enters the repo or `package.json`** |

**Packages removed due to slopcheck [SLOP] verdict:** none — no packages proposed.
**Packages flagged as suspicious [SUS]:** none.

*Rationale for skipping the slopcheck gate: the gate applies to phases that install external packages.
This phase installs none. `wget` is a GNU core utility distributed by Homebrew, not a registry package,
and it is used once on the developer's machine to produce a static artefact — it is not a supply-chain
surface for the deployed application. This mirrors Phase 9's "no new npm packages" posture.*

---

## Architecture Patterns

### System Architecture Diagram

```
            ┌──────────── INBOUND (post-cutover) ────────────┐
            │                                                │
 Google / links / bookmarks                          Owner (Thomas)
            │                                                │
            ▼                                                ▼
 https://(www.)tpsventilatie.nl/<path>/            /etc/hosts override
            │                                     tpsventilatie.nl → 195.78.67.39
   dd24 zone: apex A + www record → Vercel                    │
            │                                                ▼
            ▼                                     old LiteSpeed box (untouched)
   ┌───────────────────────────────────────┐      /wp-login.php · WordPress 7.1.1
   │  VERCEL EDGE — dispatch by Host hdr    │      (cert expires 2026-10-29 → §Pitfall 4)
   │  (proven: alias lookup, not TLS SNI)   │
   └───────────────┬───────────────────────┘
                   │  redirects[] evaluated IN ARRAY ORDER, before filesystem
                   ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │ [0..8]  9 explicit legacy rules   has:host=(www\.)?tpsventilatie\.nl │
  │         source keeps the LEGACY TRAILING SLASH   → 301             │
  │ [9]     legacy catch-all /:path*  has:host=…  (MUST be host-gated) │
  │ [10]    /:path+/ → /:path+  308   ← re-added normalisation,        │
  │         replaces the internal rule skipTrailingSlashRedirect removes│
  └──────────────────────────────┬───────────────────────────────────┘
                                 │  destination = `${CANONICAL_ORIGIN}${to}`
                                 ▼
              https://www.tpsklimaattechniek.nl/<target>   → 200 (direct)
                                 │
        ┌────────────────────────┴────────────────────────┐
        ▼                                                 ▼
  BUILD GATE (data)                              LIVE GATE (HTTP)
  scripts/assert-redirects.ts                    scripts/verify-redirects.ts
  in `prebuild`, no network                      on deployment_status=Production
  · no duplicate sources                         · 9 sources × 2 hostnames
  · no destination that is a source              · exactly 1 hop, then 200
  · every destination ∈ sitemapEntries()         · records the http→https 308
  · every judgement entry has a `why`            · catch-all sample
                                 │
                                 ▼
                     WEEKLY CRON (what did Google conclude?)
                     measure-indexation.ts + legacy section
                     · Search Analytics sc-domain:tpsventilatie.nl  → the 180-day condition
                     · URL Inspection × 9 legacy URLs               → googleCanonical moved?
```

### Recommended structure (new files only)

```
lib/seo/
└── redirects.ts              # NEW — typed map + the pure emitter next.config imports
scripts/
├── assert-redirects.ts       # NEW — structural gate, joins `prebuild` (guard #9)
└── verify-redirects.ts       # NEW — live one-hop probe (sibling of verify-indexation.ts)
docs/
├── baseline/<capture-date>/
│   ├── legacy-site-mirror/   # NEW — D-28 wget mirror + CAPTURE.md (the exact command)
│   ├── dns/                  # re-run snapshot-dns.sh post-cutover; diff vs 2026-09-16
│   ├── mail/                 # NEW — D-23 reply headers
│   └── migration-final.md    # NEW — D-11 day-28 declaration
└── seo-owner-runbook.md      # §8 webmail · §9 WP-admin · §10 rollback (Dutch)
```

**Why `verify-redirects.ts` is a sibling, not an extension of `verify-indexation.ts` (Discretion #2).**
The two answer different questions about different hosts and have different failure meanings. Merging
them would make a legacy-redirect regression indistinguishable from an indexation regression in the same
alert issue, and would make the indexation probe depend on the legacy domain being attached — coupling a
permanent check to a temporary one that D-25 will eventually retire. The P9 D-23 "two probes, two
questions" split is the house pattern; this is a third question, so it gets a third probe. Both are
invoked from the same `verify-indexation.yml` job so there is still one workflow and one alert path.

---

### Pattern 1 — The typed map and the `next.config.ts` wiring (D-12 … D-16)

**What:** `lib/seo/redirects.ts` holds the map as data plus a pure emitter. `next.config.ts` imports the
emitter and nothing else.

**The constraint that shapes the module — verified in Next.js v16.2.1 source.** `checkCustomRoutes()`
validates each redirect object against an allow-list:

```ts
// next/src/lib/load-custom-routes.ts (v16.2.1)
const allowedKeys = new Set<string>(['source', 'locale', 'has', 'missing'])
// + for redirects: 'basePath', 'statusCode', 'permanent', 'destination'
const invalidKeys = keys.filter((key) => !allowedKeys.has(key))
// → "invalid fields: confidence,why for route {...}"  and the build FAILS
```

So D-16's `confidence` and `why` **cannot appear on the objects returned to `redirects()`**. They live on
the map entries and are stripped by the emitter. This is not a style choice — shipping them fails the
build. Two further facts from the same file:

- `type: 'host'` is typed `{ type: 'host'; key?: undefined; value: string }` — **`key` must be absent,
  `value` is required.**
- `if (typeof route.permanent !== 'boolean' && !route['statusCode'])` → invalid. So `statusCode: 301`
  **alone** is valid and `permanent` must then be omitted. D-14 is expressible exactly as written.

**And the matcher semantics — from `next/src/shared/lib/router/utils/prepare-destination.ts` (v16.2.1):**

```ts
case 'host': {
  const { host } = req?.headers || {}
  const hostname = host?.split(':', 1)[0].toLowerCase()   // Host HEADER, port stripped, lowercased
  value = hostname
  break
}
...
const matcher = new RegExp(`^${hasItem.value}$`)          // ANCHORED
```

Three consequences:
1. **`value` is an anchored regex.** `value: "tpsventilatie.nl"` matches the apex **only** — not
   `www.tpsventilatie.nl`. One rule covering both requires alternation:
   `value: "(www\\.)?tpsventilatie\\.nl"`. ARCHITECTURE.md's Pattern 2 sketch already has this right;
   the risk is someone "simplifying" it.
2. **Escape the dots.** Unescaped `.` is regex-any, so `tpsventilatie.nl` would also match
   `tpsventilatieXnl`. Harmless in practice (the host must be attached to the project) but free to fix.
3. **Multiple `has` entries are AND** (`has.every(...)`), so "host A **or** host B" is only expressible
   as alternation inside one `value`, never as two `has` items.

**Module shape:**

```ts
// lib/seo/redirects.ts — the map outlives .planning/ (D-16). Pure, no I/O.
// NO-BARREL EXCEPTION (P8 D-05): member of the lib/seo/* family.
import { CANONICAL_ORIGIN } from "@/lib/constants";

// The legacy hosts, as ONE anchored regex alternation. `has` items AND together,
// so both hostnames must be one value — two `has` entries would match nothing.
export const LEGACY_HOST_PATTERN = "(www\\.)?tpsventilatie\\.nl";

export interface LegacyRedirect {
  /** Legacy path, WITH the trailing slash the old WordPress site serves and Google indexed. */
  from: string;
  /** Path on the new site. Joined to CANONICAL_ORIGIN by toNextRedirect — never hand-typed. */
  to: string;
  confidence: "certain" | "judgement";
  /** REQUIRED when confidence === "judgement" (D-16); asserted by assert-redirects.ts. */
  why?: string;
}

export const LEGACY_REDIRECTS: readonly LegacyRedirect[] = [
  { from: "/",                                          to: "/",                                                   confidence: "certain" },
  { from: "/over-ons/",                                 to: "/over-ons",                                           confidence: "certain" },
  { from: "/contact/",                                  to: "/contact",                                            confidence: "certain" },
  { from: "/privacy-beleid/",                           to: "/privacy-beleid",                                     confidence: "certain" },
  { from: "/wtw-unit-vervangen/",                       to: "/diensten/wtw/vervangen",                             confidence: "certain" },
  { from: "/wtw-unit-onderhoud-reinigen/",              to: "/diensten/wtw/onderhoud-reinigen",                    confidence: "certain" },
  { from: "/wtw-unit-inregelen/",                       to: "/diensten/wtw/inregelen",                             confidence: "certain" },
  { from: "/mechanische-ventilatie-vervangen/",         to: "/diensten/mechanische-ventilatie/vervangen",          confidence: "certain" },
  { from: "/mechanische-ventilatie-onderhoud-reinigen/",to: "/diensten/mechanische-ventilatie/onderhoud-reinigen", confidence: "certain" },
  {
    from: "/mechanische-ventilatie-dakventilator/",
    to: "/diensten/mechanische-ventilatie",
    confidence: "judgement",
    // D-13. Live page fetched 2026-09-18: H2 is "Dakventilator Onderhoud"; its three
    // packages are maintenance/cleaning (€190, €250) and replacement (€700). There is no
    // new-installation content on it, so `…/aanleggen` (the research table's proposal) is
    // wrong. The page spans maintenance, cleaning AND replacement, so no single sub-service
    // matches; the pillar hands the visitor all four with the intent intact.
    why: "Legacy page covers onderhoud + reiniging + vervanging, not aanleg — no single sub-service matches, so the pillar preserves intent.",
  },
] as const;

/** Only the keys Next.js allows. `confidence`/`why` are metadata and MUST NOT leak here. */
export function toNextRedirects() {
  return LEGACY_REDIRECTS.map(({ from, to }) => ({
    source: from,
    destination: `${CANONICAL_ORIGIN}${to === "/" ? "" : to}`,
    statusCode: 301 as const,                                    // D-14 — never `permanent`
    has: [{ type: "host" as const, value: LEGACY_HOST_PATTERN }],
  }));
}

/** D-12 catch-all — path-preserving, HOST-GATED, emitted AFTER the explicit rules. */
export function toCatchAllRedirect() {
  return {
    source: "/:path*",
    destination: `${CANONICAL_ORIGIN}/:path*`,
    statusCode: 301 as const,
    has: [{ type: "host" as const, value: LEGACY_HOST_PATTERN }],  // ← §Pitfall 2
  };
}

/**
 * Re-adds the trailing-slash normalisation that `skipTrailingSlashRedirect: true` removes.
 * Byte-identical to the rule Next.js would `unshift` for `trailingSlash: false`
 * (load-custom-routes.ts), minus its internal-only `internal`/`priority` flags — so canonical-host
 * behaviour is preserved EXACTLY. It is emitted LAST so the legacy rules win on legacy hosts.
 */
export function toTrailingSlashRedirect() {
  return { source: "/:path+/", destination: "/:path+", permanent: true as const };
}
```

```ts
// next.config.ts
import type { NextConfig } from "next";
import { toCatchAllRedirect, toNextRedirects, toTrailingSlashRedirect } from "@/lib/seo/redirects";

const nextConfig: NextConfig = {
  trailingSlash: false,
  // Phase 10 / §Pitfall 1. With this unset, Next.js `unshift`es a `/:path+/` → `/:path+` 308 to
  // the FRONT of the redirects array, ahead of every rule below — so a legacy URL like
  // /over-ons/ would cost TWO hops and MIG-07 could never be green. Disabling it and re-adding
  // the identical rule LAST puts the ordering under our control. Removing this line silently
  // reintroduces the second hop; scripts/verify-redirects.ts is what catches that.
  skipTrailingSlashRedirect: true,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      ...toNextRedirects(),      // 9 explicit, most specific first
      toCatchAllRedirect(),      // then the host-gated catch-all (D-12: after, never before)
      toTrailingSlashRedirect(), // then canonical-host normalisation
    ];
  },
};

export default nextConfig;
```

**Note on `/` → `/`:** `destination: CANONICAL_ORIGIN` with no trailing path. `absoluteUrl()` in
`lib/seo/policy.ts` keeps the root's slash for sitemap entries; the redirect destination should be the
bare origin (Vercel normalises), and `assert-redirects.ts` should assert the root entry resolves to the
sitemap's root URL rather than string-comparing.

---

### Pattern 2 — `scripts/assert-redirects.ts`: structural only, no network (D-17)

Joins `prebuild` as guard #9, after `assert-seo.ts`. Follows the `assert-*` family conventions: `tsx`,
`node:assert/strict`, intentional `console` output, non-zero exit aborts the build, relational
assertions and named failure messages — never snapshots (the `INDEXABLE_FLOOR` lesson).

The checks, each stating what *wrong* means:

| # | Assertion | Why |
|---|---|---|
| 1 | No duplicate `from` across the map | Two rules for one source — the second is dead and invisible |
| 2 | No `to` equals any `from` (modulo trailing slash) | A destination that is itself a source is a chain — the thing MIG-06 exists to stop |
| 3 | Every emitted `destination` startsWith `CANONICAL_ORIGIN` | Prevention rule 1 against chains (ARCHITECTURE.md); catches a hand-typed apex |
| 4 | Every `to` resolves to a URL in `sitemapEntries()` | The destination is a real, **indexable** page — pointing 301s at a `noindex` page funnels equity into a wall. Import `sitemapEntries` from `lib/seo/policy.ts` (the D-17 source) |
| 5 | Every `from` starts with `/`, and every non-root `from` **ends with `/`** | The legacy site serves and canonicalises slashed URLs (live-verified). A slash-less source would only ever be reached via the normalisation hop |
| 6 | Every `confidence: "judgement"` entry has a non-empty `why` (D-16) | Forces the next judgement call to explain itself |
| 7 | Emitted objects contain **only** Next's allowed keys | Guards Pattern 1's allow-list constraint at our layer, with a readable message, instead of Next's `invalid fields: …` at build time |
| 8 | The catch-all carries a `has: host` entry, and its `value` equals `LEGACY_HOST_PATTERN` | §Pitfall 2 — an un-gated catch-all takes the live site down |
| 9 | `LEGACY_HOST_PATTERN` matches both `tpsventilatie.nl` and `www.tpsventilatie.nl` and matches **neither** `tpsklimaattechniek.nl` nor `www.tpsklimaattechniek.nl`, under `new RegExp(\`^${p}$\`)` | Reproduces Next's exact anchoring locally, so a "simplified" pattern is caught by the build rather than by production |
| 10 | The emitted array's **last** element is the `/:path+/` normalisation rule, and `skipTrailingSlashRedirect` is `true` in the config | §Pitfall 1 — the ordering is the whole mechanism; assert it, don't trust it |

Assertions 9 and 10 are the ones that make this gate worth having: they encode the two findings that
would otherwise be discovered by Google.

**It must not fetch anything.** A network call inside `prebuild` makes every Vercel build depend on
production being reachable, and makes the build assert against the deployment it is producing (D-17).

---

### Pattern 3 — `scripts/verify-redirects.ts`: the live one-hop probe (D-17/D-18)

Modelled on `scripts/verify-indexation.ts`: collects *every* violation rather than throwing on the
first, prints a human-readable report, exits non-zero on any violation.

```
Usage:  npx tsx scripts/verify-redirects.ts [--via <production-origin>]

Mode A (pre-flight, before DNS):  --via https://www.tpsklimaattechniek.nl
        sends `Host: <legacy-host>` over a TLS connection to the production origin
Mode B (post-cutover, default):   connects to https://<legacy-host> directly
```

For each of 9 sources × 2 legacy hostnames (18 checks) plus ≥3 catch-all samples:

1. `fetch(url, { redirect: "manual" })` → assert **301** (not 308, not 302 — D-14 asserts the code too).
2. Assert `location` **exactly equals** `${CANONICAL_ORIGIN}${to}` — not "starts with", so a stray
   trailing slash or a query-string surprise is a failure.
3. Fetch the `location` with `redirect: "manual"` → assert **200**. A redirect here is the chain
   MIG-06 forbids, and the message must say so.
4. Record — never assert away — Vercel's `http`→`https` **308** for the `http://` form of one sampled
   source, labelled as a platform hop (D-18's "record it, don't hide it").

Catch-all samples that should be in the plan explicitly:
- `/feed/` and `/wp-json/wp/v2/pages` → 301 → path-preserved → expected **404** on the new site
  (honest, and visible in GSC as a list of things we could still map — D-12).
- `/robots.txt` and `/sitemap.xml` → 301 → **200** on the new site (D-15; both verified 200 today).
- **`/over-ons` (no slash)** → must still be exactly one hop. This is the assertion that proves
  §Pitfall 1 is actually solved rather than merely described.

Wired into the existing `verify-indexation.yml` job as a second step so there is one workflow and one
alert issue. Runs in Mode B post-cutover; Mode A is invoked by hand during the pre-flight gate.

---

### Pattern 4 — The spoofed-`Host` pre-flight probe, corrected (D-09)

**D-09's intent is sound and its mechanism is proven. Its endpoint is wrong.** Measured 2026-09-21:

| TLS SNI | `Host:` header | Result |
|---|---|---|
| `www.tpsklimaattechniek.nl` | `www.tpsklimaattechniek.nl` | **200** |
| `www.tpsklimaattechniek.nl` | `tpsklimaattechniek.nl` (attached) | **308 → https://www.tpsklimaattechniek.nl/** ✅ *the mechanism, demonstrated* |
| `www.tpsklimaattechniek.nl` | `www.tpsventilatie.nl` (**not** attached) | **404 `x-vercel-error: DEPLOYMENT_NOT_FOUND`** |
| `tps-ventilatie.vercel.app` | `www.tpsklimaattechniek.nl` | **403 `x-vercel-mitigated: deny`** ❌ |
| `tps-ventilatie.vercel.app` | `tpsklimaattechniek.nl` | **403 `x-vercel-mitigated: deny`** ❌ |
| `tps-ventilatie.vercel.app` | *(none — direct)* | **200** |

Three conclusions:

1. **Vercel dispatches on the HTTP `Host` header, not TLS SNI.** Row 2 is decisive: the TLS handshake
   was for `www.…`, the response was the *apex* domain's redirect. The `has: host` matcher therefore
   sees exactly what `curl -H 'Host: …'` sends (and Next's `matchHas` reads `req.headers.host` —
   confirmed in source).
2. **Do not aim the probe at a `*.vercel.app` URL.** Vercel denies Host/SNI mismatch on those endpoints
   (anti-domain-fronting). D-09 as written — `curl -H 'Host: …' https://<deployment><source>` — returns
   **403**, which reads like a broken map and is not.
3. **`--resolve` is not the answer either, pre-cutover.** It would set SNI to `www.tpsventilatie.nl`,
   for which Vercel holds no certificate until DNS points at it. `-H` is strictly better: it keeps a
   valid TLS session and exercises the exact matcher we care about.

**The working pre-flight command:**

```bash
curl -sS -o /dev/null -D- --max-time 20 \
  -H 'Host: www.tpsventilatie.nl' \
  https://www.tpsklimaattechniek.nl/wtw-unit-vervangen/
# expect: HTTP/2 301 + location: https://www.tpsklimaattechniek.nl/diensten/wtw/vervangen
```

**Two preconditions the CONTEXT does not state, both harmless:**

- **Both legacy hostnames must already be attached to the Vercel project** — otherwise
  `DEPLOYMENT_NOT_FOUND`. D-09 already sequences the attach first; the new information is the *shape of
  the failure*, which `verify-redirects.ts` must name explicitly so a 404 here is never mistaken for a
  bad rule.
- **The map must already be deployed to production.** `Host` resolves to the production alias, hence the
  production deployment — spoofing `Host` against a *preview* URL would still serve production, so a
  preview cannot be pre-flight-tested this way. This is safe: the rules are host-gated, and until the
  dd24 records move, no real request can carry a legacy `Host`. Deploying the map to production is a
  fully reversible act.

---

### Pattern 5 — Attaching both legacy hostnames with no Vercel-level redirect (D-08)

**The default Vercel behaviour D-08 is guarding against, quoted:** *"If a user visits your domain with or
without the 'www' subdomain prefix, we will attempt to redirect automatically"*, and *"Adding an apex
domain to a Project on Vercel will automatically suggest adding its `www` counterpart… We recommend
using the `www` subdomain as your primary domain, with a redirect from the non-`www` domain to it."*

That is exactly the chain D-08 forbids for the legacy pair. The dashboard control is **Project Settings
→ Domains → Edit → "Redirect to" dropdown**; leaving it unset ("No Redirect") is what D-08 requires.
The *existing* `tpsklimaattechniek.nl` apex → `www` **308** (verified live) is an instance of this same
mechanism and should be left alone — it is the canonical domain's own normalisation, and it is
irrelevant to the legacy pair because every legacy destination already points at the `www` host.

**"Invalid Configuration" is the expected state during pre-flight** (D-09), and it is only a DNS *check*
— the alias table binding hostname → deployment is independent of it, which is precisely why the
spoofed-`Host` probe works before any DNS change.

**The concrete record values — copy the pattern already proven on the new domain (same registrar, same
nameservers), measured 2026-09-21:**

| Hostname | Type | Value | TTL |
|---|---|---|---|
| `tpsklimaattechniek.nl` | A | `216.198.79.1` | 300 |
| `www.tpsklimaattechniek.nl` | CNAME | `863afab58c3e6cf4.vercel-dns-017.com.` | 300 |

Note `216.198.79.1` — **not** the `76.76.21.21` that older guides (and Vercel's own KB blurb) still
quote. **The planner must read the exact values off this project's Domains page at execution time and
record them in the plan**, rather than copying the table above; Vercel issues project-specific values and
has changed the apex IP at least once.

**One naming correction for D-07/D-10/D-11.** The `www` side is a **CNAME** in the proven pattern, while
the legacy `www` is currently an **A** record. So the cutover is "apex A value change + `www` A→CNAME
replacement", and the revert is "apex A back to `195.78.67.39` + delete the CNAME, restore
`www` A `195.78.67.39`". Still two records, still minutes, but the phrase *"revert two A records"* in the
rollback document should become *"revert the two hostname records"*, with both the old and new values
written out verbatim so the revert is a copy-paste rather than a recollection.

*(An apex-style A record at `www` pointing to `216.198.79.1` would probably also work, since Vercel
dispatches on `Host` — and it would preserve the literal two-A-record revert. But it is undocumented and
unsupported by Vercel's guidance, which is a poor trade for a cosmetic simplification on the highest-risk
action in the milestone. **[ASSUMED]** — not verified, and not recommended.)*

---

### Pattern 6 — The legacy content mirror (MIG-01 as amended, D-02/D-28)

**Measured footprint, 2026-09-21:** the 10 public pages total **666 KB** of HTML; their 58 unique
referenced assets (including `srcset` candidates) total **952 KB**. **≈ 1.6 MB.** Even allowing wget's
recursion to pull in CSS-referenced images and WordPress boilerplate, a 2–5 MB result is expected.
**D-28's ~25 MB ceiling will almost certainly not bind** — plan the "images move to external storage"
branch as a documented contingency, not as work.

**Site is mirror-friendly, verified:** `robots.txt` is `Disallow: /wp-admin/` only; a `Wget/1.25.0`
user-agent gets an identical 200 and byte count to a default curl (LiteSpeed does not gate on UA);
all 10 sources return 200.

```bash
# D-28 — run ONCE, BEFORE the cutover, from the repo root. Record this command verbatim
# in docs/baseline/<date>/legacy-site-mirror/CAPTURE.md alongside the wget version and the
# UTC timestamp, so the artefact is reproducible from the record (D-28's requirement).
brew install wget            # 1.25.0 — not installed on this machine

OUT="docs/baseline/$(date -u +%F)/legacy-site-mirror"
mkdir -p "$OUT"
wget \
  --recursive --level=2 \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --no-parent \
  --domains=tpsventilatie.nl \
  --no-host-directories \
  --directory-prefix="$OUT" \
  --wait=1 --random-wait \
  --restrict-file-names=windows \
  --user-agent='Mozilla/5.0 (compatible; TPS-archive/1.0; +https://www.tpsklimaattechniek.nl/)' \
  --input-file=- <<'URLS'
https://tpsventilatie.nl/
https://tpsventilatie.nl/over-ons/
https://tpsventilatie.nl/contact/
https://tpsventilatie.nl/privacy-beleid/
https://tpsventilatie.nl/wtw-unit-vervangen/
https://tpsventilatie.nl/wtw-unit-onderhoud-reinigen/
https://tpsventilatie.nl/wtw-unit-inregelen/
https://tpsventilatie.nl/mechanische-ventilatie-vervangen/
https://tpsventilatie.nl/mechanische-ventilatie-onderhoud-reinigen/
https://tpsventilatie.nl/mechanische-ventilatie-dakventilator/
URLS

du -sh "$OUT"   # D-28's measurement — record it; branch only if > ~25 MB
```

Flag rationale (each is load-bearing, none is decoration):

| Flag | Why |
|---|---|
| `--input-file=-` with the 10 URLs | Anchors the capture to the 9 mapped pages + root rather than crawling whatever the site links to |
| `--domains=tpsventilatie.nl` | **Keeps it from wandering off-site.** The pages reference `fonts.googleapis.com` and `api.whatsapp.com` (measured); without this, `--page-requisites` would chase them |
| `--no-parent` | Belt-and-braces with `--domains` |
| `--level=2` | Enough to catch same-site links from the seeds without crawling the whole WP install |
| `--page-requisites` | The images/CSS/JS that make the archive render — the actual point |
| `--convert-links` | Rewrites links to relative so the archive opens offline from `index.html` |
| `--adjust-extension` | Slashed WP URLs become `over-ons/index.html` — browsable, and diffable in git |
| `--no-host-directories` | Drops the `tpsventilatie.nl/` prefix so the tree is `legacy-site-mirror/over-ons/index.html` |
| `--wait=1 --random-wait` | Courtesy to a live production box we do not own |
| `--restrict-file-names=windows` | Keeps filenames portable; the repo is on a OneDrive mount |
| **no `-e robots=off`** | Deliberate. `robots.txt` only disallows `/wp-admin/`, which we neither want nor are entitled to archive. Respecting it is correct and keeps the artefact defensible |
| **no `--mirror`** | `--mirror` implies `-r -N -l inf --no-remove-listing` — infinite depth would crawl the whole WordPress install including pagination and feeds. We want a bounded capture |

---

### Pattern 7 — Owner continuity: runbook additions (D-20/D-21/D-22/D-23, Discretion #6)

The runbook is Dutch and numbered §1–§7 with a closing "Samenvatting — wat hangt waarvan af". Three new
sections append cleanly:

- **§8 Webmail na de overstap** — `https://s161.cyber-folks.pl/webmail/`, the reason it is unaffected
  (host-level hostname, no records of ours involved), the accepted cost (unmemorable; moves if cyberfolks
  re-provisions off `s161`), and "bookmark this now".
- **§9 WordPress-beheer na de overstap** — the exact `/etc/hosts` line, verbatim and copy-pasteable:
  ```
  195.78.67.39  tpsventilatie.nl www.tpsventilatie.nl
  ```
  plus the expected response (`https://tpsventilatie.nl/wp-login.php` serves the real WordPress login
  form, not our app), **plus the dated certificate caveat from §Pitfall 4 — `2026-10-29`, not "~90 days"**.
- **§10 Terugdraaien (rollback)** — D-10's two triggers and only those, the two records with old **and**
  new values written out, D-11's day-28 line, and the silent dependency: *the old WordPress install lives
  exactly as long as the cyberfolks subscription, and that subscription exists only for
  `info@tpsventilatie.nl`.*

**D-22's human half and D-23's ask are one message to Thomas.** Design it as a single Dutch message with
two asks, sent pre-cutover for the first and at cutover for the second:
1. *(pre-cutover)* "Log even in op `https://tpsventilatie.nl/wp-login.php` nadat ik je deze regel heb
   laten toevoegen — werkt het?" → dated, recorded, MIG-04 green.
2. *(at cutover)* "Ik heb je net een mail gestuurd op `info@tpsventilatie.nl` — kun je even antwoorden?"
   → his reply proves receipt **and** send in one action (D-23), and the full headers go into
   `docs/baseline/<date>/mail/`.

**What to capture from the reply** (the machine evidence, not a screenshot): the full `Received:` chain
plus `Authentication-Results:` showing `spf=pass`, `dkim=pass`, `dmarc=pass`. In Gmail:
*Show original → Download original* → commit the `.eml`. Redact nothing except any third-party address.

---

### Pattern 8 — Rollback and the day-28 declaration (D-10/D-11, Discretion #4)

`docs/baseline/<cutover-date>/migration-final.md`, written on day 28, containing: the declared-final
date, the TTL restoration to 28800 (with the `dig` output proving it), a pointer to the pre- and
post-cutover DNS snapshots and their `diff`, the `verify-redirects.ts` output on that day, the first
legacy GSC reading showing consolidation, and a one-line restatement of the subscription dependency.

Sitting it in the dated baseline directory rather than in the runbook is deliberate: the runbook is the
owner's operational document and stays short; `docs/baseline/` is the evidence trail, and this is
evidence. The runbook §10 links to it.

**Re-run the DNS snapshot after cutover:**
```bash
bash scripts/snapshot-dns.sh tpsventilatie.nl --out "docs/baseline/$(date -u +%F)/dns"
diff docs/baseline/2026-09-16/dns/tpsventilatie.nl-2026-09-16T203208Z.txt \
     docs/baseline/<cutover-date>/dns/tpsventilatie.nl-<stamp>.txt
```
**Gap to close:** `snapshot-dns.sh` queries only the *first* authoritative nameserver (`head -1`), but
D-07 requires confirming the flip against **all three**. Do not modify the snapshot script (its byte
format is deliberately frozen for diffability). Run a separate three-NS loop at cutover — §Code Examples.

---

### Pattern 9 — Change of Address + the weekly legacy section (D-24/D-25, Discretion #7)

**Change of Address — what Google actually requires, from the current Help documentation:**

- *"The Change of Address tool can be used only on properties at the domain level: that is, you can move
  `example.com`, `m.example.com`, or `http://example.com`. You cannot move properties at the path level."*
  → all three legacy properties qualify (a Domain property and two bare-host URL-prefix properties).
- *"You must be an owner of both the old and new properties in Search Console."* → satisfied; Phase 9
  verified five properties.
- *"The tool does not move any subdomains below the specified domain (including www). So if you specify
  `example.com` in the tool, it will not move `www.example.com` or `m.example.com.`"* and *"make sure to
  use this tool for all subdomain variants of the old domain, including www and non-www… even if you're
  not actively using these variants currently."* → **D-24's three filings are a requirement, not
  redundancy.** This is the strongest single justification for D-06 (the TXT record that keeps all three
  verified).
- *"The tool runs a few pre-move checks before telling Google about the move. If you fail any critical
  pre-move checks, you must fix the issue before you can continue."* The checks include ownership of both
  sides and **301s on sampled pages** → the redirects must be live and one-hop **before** filing, which
  is exactly D-24's same-day-after-green-probe sequencing.
- *"These actions continue for 180 days after you start migration"*, after which *"Google does not
  recognize any relationship between the old and new sites"*. Redirects must outlive that: *"Maintain the
  redirects for at least 180 days — longer if you still see any traffic to them from Google Search."*
- Cancellable within 180 days via **Cancel Move** in the old property — worth recording in the rollback
  document as the *search-side* half of a revert, alongside the DNS half.

**The weekly legacy section — the extension is genuinely minimal.** `scripts/gsc/api.ts` already exports
everything needed, including an as-yet-unused constant:

```ts
export const PROPERTY_NEW = "sc-domain:tpsklimaattechniek.nl";
export const PROPERTY_LEGACY = "sc-domain:tpsventilatie.nl";   // ← already there, currently unused by measure-indexation.ts
export async function inspectUrl(token, siteUrl, inspectionUrl): Promise<IndexStatusResult>
export async function querySearchAnalytics(token, siteUrl, body): Promise<SearchAnalyticsResponse>
```

**The property-targeting rule, from the URL Inspection API reference:** `inspectionUrl` *"Must be under
the property specified in `siteUrl`."* So legacy URLs are inspected with
`siteUrl = PROPERTY_LEGACY`, **not** with the new property. A Domain property covers every subdomain and
protocol, so one property inspects both `tpsventilatie.nl/…` and `www.tpsventilatie.nl/…` — no second
property needed for the inspection half.

Shape of the addition to `measure-indexation.ts`:

```
Reading {                                  // existing
  taken, property, floor, urls[], sitemap, analytics
  legacy?: {                               // NEW — optional so old readings stay parseable
    property: "sc-domain:tpsventilatie.nl",
    impressions28d: number,                // querySearchAnalytics, aggregationType "byProperty"
    clicks28d: number,
    urls: { url, verdict, coverageState, googleCanonical }[]   // inspectUrl × 9 legacy URLs
  }
}
```

**Two new flag codes**, added to `scripts/gsc/thresholds.ts` as pure evaluator logic so a `tsx -e` proof
can fire them without waiting for reality (the established habit):

| Code | Fires when | Meaning |
|---|---|---|
| `legacy-canonical-not-moved` | ≥ 8 weeks after cutover, a legacy URL's `googleCanonical` is still on `tpsventilatie.nl` | Google has not consolidated that URL — the highest-value single signal the phase can produce |
| `legacy-traffic-zero` | `impressions28d === 0` for **N = 4** consecutive weekly readings | The *evidence* half of the 180-day retirement conversation |

**N = 4 (Discretion #7).** Four weekly readings ≈ 28 days of confirmed zero, layered on top of the
28-day lookback each reading already uses — so the flag needs roughly two months of genuine silence
before it speaks. One or two weeks would fire on ordinary seasonal noise for a nine-page local-services
site whose baseline is 130 query rows over 16 months. And the flag is deliberately *not* an
authorisation: D-25 and the Deferred list both say retiring the map is a separate decision, never before
the 180-day floor. Four weeks is long enough that the flag means something and short enough that it
appears well inside the first year.

**Reporting shape:** the legacy section renders as its own block in the workflow's output and the
committed reading, under a `— legacy (tpsventilatie.nl) —` header, so the weekly issue body never
conflates a legacy consolidation signal with a new-domain indexation regression.

**D-19 reconciliation, for the planner:** the weekly legacy section *partially* covers the drift D-19
declined to watch directly. A detached Vercel domain or a lapsed certificate surfaces here as
`pageFetchState` moving to `SERVER_ERROR` / `ACCESS_DENIED` / `REDIRECT_ERROR` on the legacy URLs — with
Google's lag, not a direct HTTP check. Treat it as late coverage, not as equivalent coverage, and do not
silently widen `verify-redirects.ts` into a cron to "fix" it.

---

### Pattern 10 — The "voorheen TPS Ventilatie" footer line (D-26, Discretion #8)

Unconditional, no client component, no state. It goes in `components/Footer.tsx` (a Server Component,
no `"use client"` — keep it that way) and reads from `SITE`-adjacent constants, not hard-coded strings
that duplicate brand names.

Drafted Dutch for the owner's editorial gate (three registers, owner picks one):

| # | Copy | Register |
|---|---|---|
| A | *TPS klimaattechniek — voorheen TPS Ventilatie* | Minimal, closest to a legal footnote |
| B | *TPS klimaattechniek is de nieuwe naam van TPS Ventilatie.* | Plain sentence; clearest entity signal for Google |
| C | *Bekend van TPS Ventilatie — sinds 2026 TPS klimaattechniek.* | Warmest; carries continuity for returning customers |

**Recommend B.** It is an explicit "X is the new name of Y" statement, which is the entity association
this milestone wants Google to read, and it is unambiguous to a human searching the old brand.

Styling per the design system: `text-on-surface-variant`, small, in the existing footer bottom bar —
**no `1px` border to separate it** (project guardrail), no `#000` text. It is site copy, so it goes
through the owner's editorial gate before publish.

---

### Anti-patterns to avoid

- **Writing the catch-all without `has: host`.** Takes the live site down. §Pitfall 2.
- **Removing `skipTrailingSlashRedirect: true` as "unnecessary config".** Silently reintroduces the
  second hop on 100% of legacy traffic. §Pitfall 1. Assertion #10 exists for this.
- **Hand-typing `https://www.tpsklimaattechniek.nl` in a destination.** ARCHITECTURE.md Anti-Pattern 3.
  `CANONICAL_ORIGIN` or nothing.
- **Putting `confidence`/`why` on the emitted redirect objects.** Fails the build with Next's
  `invalid fields:` error. Pattern 1.
- **Adding a network call to `assert-redirects.ts`.** D-17.
- **Deleting the `google-site-verification` TXT while "tidying" the zone.** D-06. It silently unverifies
  all three legacy properties and kills the Change of Address.
- **Filing the CoA from only the Domain property.** Google states the tool does not move subdomains.
- **Touching MX, `mail` A, DMARC or DKIM.** Not in scope, and every one of them is live mail.
- **Probing a `*.vercel.app` URL with a spoofed `Host`.** 403 `x-vercel-mitigated: deny`. Pattern 4.
- **Lowering a threshold or narrowing an assertion to make a gate green.** The house rule.

---

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---|---|---|---|
| Host-conditional 301s | Middleware/`proxy.ts` that inspects `request.headers.get("host")` | `next.config.ts` `redirects()` with `has: [{ type: "host" }]` | Compiles to edge routing config evaluated before any function runs — zero cold starts, zero cost, and it is the mechanism D-12 already chose over middleware |
| Trailing-slash normalisation | A bespoke regex rule invented from scratch | The **verbatim** `{ source: '/:path+/', destination: '/:path+', permanent: true }` read out of Next's `load-custom-routes.ts` | Guarantees canonical-host behaviour is byte-identical to today's, so `skipTrailingSlashRedirect` changes ordering and nothing else |
| Offline site archive | A `curl` loop over 10 URLs | `wget --recursive --page-requisites --convert-links --adjust-extension --domains=…` | A curl loop misses CSS-referenced images, `srcset` candidates and fonts, and produces an archive that does not render. Link rewriting alone is a parser |
| GSC access token | An OAuth library | The existing `scripts/gsc/auth.ts` (RS256 JWT via `node:crypto`) | Already built, already proven weekly in CI, zero new dependencies |
| GSC API calls | New fetch wrappers | The existing `scripts/gsc/api.ts` — `inspectUrl`, `querySearchAnalytics`, `PROPERTY_LEGACY` | All four already exist; `PROPERTY_LEGACY` is already declared and merely unused |
| DNS zone evidence | Ad-hoc `dig` copy-paste | `bash scripts/snapshot-dns.sh` | Built in P9 D-14 for exactly this diff; its output format is frozen for diffability |
| Certificate checking | Parsing `curl -v` stderr | `openssl s_client … \| openssl x509 -noout -dates -ext subjectAltName` | The only reliable way to read expiry and SANs — and SANs are what §Pitfall 4 turns on |
| Mail deliverability proof | mail-tester / a send-only test | One reply from Thomas, headers captured | D-23. A reply proves both directions in one action; a send-only test cannot see a broken MX |

**Key insight:** every mechanism this phase needs already exists in the repo or in the platform. The
phase's difficulty is entirely in *ordering and proving*, not in building. Any plan task that proposes
new machinery is probably solving a problem the CONTEXT already decided away.

---

## Runtime State Inventory

> This is a migration phase. Every category is answered explicitly; "nothing found" is stated, not left blank.

| Category | Items found | Action required |
|---|---|---|
| **Stored data** | **None in our systems.** No database stores the legacy hostname as a key. `docs/measurements/gsc/*.json` readings carry `property: "sc-domain:tpsklimaattechniek.nl"` only — the legacy section D-25 adds is *new* data, not a rename of existing data. `docs/baseline/2026-09-16/gsc/` contains legacy exports that are historical evidence and must **not** be rewritten. | **None.** Explicitly do not "update" the 2026-09-16 baseline — it is the before-picture. |
| **Live service config** | **Vercel project domains** — `tpsventilatie.nl` and `www.tpsventilatie.nl` must be *added* (dashboard/API state, not in git), with **no** "Redirect to" set (D-08). **GSC properties** — three legacy properties exist and stay verified via the DNS TXT (D-06); the Change of Address is GSC-side state filed three times (D-24). **GoHighLevel** — the lead webhook is keyed to the form, not the hostname; unaffected. **Google Business Profile** — website URL still points at the legacy domain; deliberately **Phase 11** (D-27). | Attach 2 Vercel domains; file 3 CoAs. Record both in the plan as checkpoints, since neither is in git and neither can be asserted by a build gate. |
| **OS-registered state** | **`/etc/hosts` on the developer's and owner's machines** (D-21) — this is *newly created* state, not migrated state, and it must be documented in the runbook because it is invisible and will confuse whoever finds it later. No launchd/systemd/pm2/Task Scheduler entries reference either domain. | Add the hosts line; document it in runbook §9 with a "remove this line when you no longer need WP-admin" note. |
| **Secrets / env vars** | `GSC_SERVICE_ACCOUNT_JSON` (GitHub secret) — **unchanged**; the same credential gains access to a property it already has. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — new-domain token, unaffected. `NEXT_PUBLIC_GHL_WEBHOOK_URL` / lead-route secrets — unaffected. **The dd24 `google-site-verification` TXT is not a secret but behaves like one for D-06 purposes: removing it breaks three properties.** | **None** — but carry forward Phase 9's outstanding owner action to **rotate the GSC service-account key**; D-25's extension uses that same credential. |
| **Build artifacts / installed packages** | `out/` and `.next/` on this machine are stale artefacts of the pre-Phase-5 static-export era and of later builds; they are not deployed from here (Vercel builds). No `egg-info`-style stale metadata. **`CLAUDE.md`'s Technology Stack section is a stale build artefact of the `output: "export"` era** and actively misdescribes the deployment model. | Correct `CLAUDE.md` (Finding 1) and `PROJECT.md` §Context (D-01) in the same documentation task. Leave `out/`/`.next/` alone — untracked and harmless. |

**The canonical question — after every file in the repo is updated, what still holds the old string?**
Three things, all deliberate and all documented: `SITE.email` = `info@tpsventilatie.nl` (owner's
decision), the `privacy-beleid` page in consequence, and four verbatim customer quotes in
`lib/reviews.ts` (**do not edit**). Plus the repo and Vercel project names — already Phase 13.

---

## Common Pitfalls

### Pitfall 1 — `trailingSlash: false` costs a second hop on every legacy URL, and only a live probe can see it 🔴 BLOCKS MIG-07

**What goes wrong:** every legacy inbound link resolves in **two** hops, silently. ROADMAP success
criterion 1 and MIG-07 both fail, the equity loss is real, and every build stays green.

**Why it happens** — Next.js v16.2.1, `packages/next/src/lib/load-custom-routes.ts`:

```ts
if (!config.skipTrailingSlashRedirect) {
  if (config.trailingSlash) { /* … */ } else {
    redirects.unshift({                      // ← FRONT of the array, ahead of every user rule
      source: '/:path+/',
      destination: '/:path+',
      permanent: true,
      internal: true,
      priority: true,
    })
  }
}
```

Redirects are evaluated in array order (Vercel: *"Vercel processes routes in the order you define them
in the array"*), so this rule wins. The official `skipTrailingSlashRedirect` reference confirms the
behaviour it produces:

| `trailingSlash` | Request | Default response |
|---|---|---|
| `false` | `/about/` | **`308` redirect to `/about`** |

And the legacy site's indexed URLs **are** the slashed ones — live-verified 2026-09-21:
`<link rel="canonical" href="https://tpsventilatie.nl/over-ons/" />`. So the real walk is:

```
https://tpsventilatie.nl/over-ons/  →308→  https://tpsventilatie.nl/over-ons  →301→  https://www.tpsklimaattechniek.nl/over-ons  →200
                                    ^^^^ internal rule, still on the LEGACY host — hop 1 of 2
```

This also means ARCHITECTURE.md's instruction — *"Sources must be written with the trailing slash to
match real inbound links"* — describes sources that, as things stand, **can never match**.

**How to avoid:** `skipTrailingSlashRedirect: true`, then re-add the identical rule as the **last**
entry (Pattern 1). The docs confirm the re-add is safe: *"Your own `redirects` and `rewrites` from
`next.config.js` still apply."* Canonical-host behaviour is preserved byte-for-byte because the re-added
rule is copied verbatim from the internal one.

**Secondary effect to check:** `skipTrailingSlashRedirect` also stops Next normalising slashes during
client-side navigation — *"`<Link>` and router URLs keep the path exactly as written."* Every internal
`href` in this codebase is already slash-less (`NAV_LINKS` = `/diensten`, `/tarieven`, `/contact`, …),
so nothing changes. Worth an assertion in `assert-redirects.ts` anyway: **no internal `href` ends in
`/` except the root.**

**Warning signs:** `verify-redirects.ts` reports `301` where a `308` was received, or reports the
`location` as a `tpsventilatie.nl` URL instead of a `tpsklimaattechniek.nl` one. In GSC, legacy URLs show
`pageFetchState: REDIRECT_ERROR` or a `googleCanonical` that never moves.

---

### Pitfall 2 — An un-gated catch-all takes the live site down 🔴 CATASTROPHIC

**What goes wrong:** `{ source: "/:path*", destination: `${CANONICAL_ORIGIN}/:path*`, statusCode: 301 }`
**without** a `has: host` entry matches **every request to every host**, including
`www.tpsklimaattechniek.nl`. Every page on the live site becomes a 301 to itself — an infinite loop.
Browsers show `ERR_TOO_MANY_REDIRECTS`; Google drops the site.

**Why it happens:** D-12 describes the catch-all in terms of its *path* behaviour and its *ordering*
relative to the 9 explicit rules. It does not restate the host gate, because the host gate is implicit in
"legacy catch-all". An implementer reading D-12 alone can write it without `has`.

**How to avoid:** `assert-redirects.ts` assertion #8 — the catch-all must carry a `has` entry of
`type: "host"` whose `value` equals `LEGACY_HOST_PATTERN`. Build-blocking, so it can never ship.
Assertion #9 additionally proves the pattern does not match the canonical hostnames, under Next's exact
anchoring.

**Warning signs:** a Vercel preview where the home page will not load at all. This is the one failure in
the phase that the existing preview-is-the-build-gate convention would catch immediately — **which is
exactly why the map must reach a preview before it reaches production.**

---

### Pitfall 3 — The pre-flight probe returns 403 or 404 for reasons that are not the map 🟡

**What goes wrong:** the D-09 gate produces a red result that looks like a broken redirect and is not,
and someone "fixes" a correct map.

**Three distinct non-map failures, all measured 2026-09-21:**

| Symptom | Cause | Fix |
|---|---|---|
| `403` + `x-vercel-mitigated: deny` | The TLS connection targeted a `*.vercel.app` host while `Host:` said something else. Vercel blocks this. | Aim the connection at `https://www.tpsklimaattechniek.nl` (Pattern 4) |
| `404` + `x-vercel-error: DEPLOYMENT_NOT_FOUND` | The legacy hostname is not attached to the Vercel project yet | Attach both legacy hostnames first (D-09's own step 1) |
| A `308` to the new domain's `www`, not a `301` to the mapped target | The production deployment does not yet contain the map | Deploy the map to production before probing (Pattern 4) |

**How to avoid:** `verify-redirects.ts` must branch on `x-vercel-error` / `x-vercel-mitigated` and print
the diagnosis, not just the status code. A probe that says *"404 — is `www.tpsventilatie.nl` attached to
the Vercel project?"* is a gate; one that says *"expected 301, got 404"* is a puzzle.

---

### Pitfall 4 — The owner's mail certificate is signed for the two names we are repointing, and expires 2026-10-29 🔴 NOT IN CONTEXT.md

**What goes wrong:** roughly five weeks after cutover — plausibly *after* D-11's day-28 point of no
return — the owner's mail client starts refusing to connect over TLS, and the cause looks unrelated to a
DNS change nobody has thought about for a month.

**Measured 2026-09-21.** `mail.tpsventilatie.nl` on **993 (IMAPS)**, **465 (SMTPS)** and **587
(submission)** all present the same certificate:

```
subject = CN=mail.tpsventilatie.nl
issuer  = C=US, O=Let's Encrypt, CN=YE1
notAfter= Oct 29 05:19:42 2026 GMT
X509v3 Subject Alternative Name:
    DNS:mail.tpsventilatie.nl, DNS:tpsventilatie.nl, DNS:www.tpsventilatie.nl
```

Two of those three SANs are the names this phase repoints to Vercel. If cyberfolks renews via HTTP-01
across all three, the apex and `www` challenges will be answered by Vercel after cutover, and — depending
on their ACME client — either the whole order fails (cert expires, mail TLS breaks) or the client drops
the failing names and re-issues for `mail.` alone (which still validates: the `mail` A record is never
touched). **Which of those happens is cyberfolks' implementation detail, invisible to us.**

This is *also* the true version of D-21's caveat. D-21 says the WP-admin hosts-override route shows a
certificate warning "within ~90 days". The actual date is **2026-10-29** — 38 days from today — because
the existing cert expires then regardless of when renewal is attempted.

**How to avoid — three cheap steps, in descending order of value:**

1. **Pre-cutover, one question to Thomas for cyberfolks** (same class of ask as D-22/D-23, no
   credentials): *"Kan het SSL-certificaat voor `mail.tpsventilatie.nl` los worden uitgegeven, dus zonder
   `tpsventilatie.nl` en `www.tpsventilatie.nl` erin? Die twee gaan naar een andere server."* If they say
   yes, or that they validate via DNS-01, the risk is closed before it opens.
2. **A dated check in the runbook and in `migration-final.md`**, for on/around **2026-10-30**:
   ```bash
   echo | openssl s_client -servername mail.tpsventilatie.nl \
       -connect mail.tpsventilatie.nl:993 2>/dev/null |
     openssl x509 -noout -dates -ext subjectAltName
   # PASS if notAfter has moved past 2026-10-29. FAIL means renewal broke — see step 3.
   ```
3. **The escape hatch, if it does break:** point the mail client's server hostname at
   `s161.cyber-folks.pl`, which is covered by the `*.cyber-folks.pl` wildcard valid to **2026-12-24**
   (measured on `mail.tpsventilatie.nl:443`). It is the same host-level hostname D-20 already uses for
   webmail, so the runbook is already teaching the owner to trust it.

**Why this belongs in the rollback document:** D-10 names mail failure as a rollback trigger. This is a
mail failure with a **known date that may fall after the revert window closes** — so the mitigation has
to be prevention (step 1) and detection (step 2), never rollback.

---

### Pitfall 5 — The dd24 trap, and the records that must not be touched 🔴 HARD GATE

dd24 suspended this domain once already (2026-08-12, contact verification). **Read the status banner
before touching anything** (CONTEXT §Specifics).

Live-re-verified 2026-09-21 — unchanged from 2026-09-18, and all three nameservers agree:

```
tpsventilatie.nl.       28800 IN A    195.78.67.39
www.tpsventilatie.nl.   28800 IN A    195.78.67.39
tpsventilatie.nl.       28800 IN MX   10 mail.tpsventilatie.nl.
tpsventilatie.nl.       28800 IN TXT  "google-site-verification=DvCnCNBbXd73JTab3-DsDmq_KgkQmlCZ7onK6OqDkoI"
tpsventilatie.nl.       28800 IN TXT  "v=spf1 a mx include:_spf.cyberfolks.pl -all"
```

Everything D-04/D-05/D-06 assert is still true, including the 28800 TTL that makes the ≥8 h lead time
non-negotiable. **Touch exactly four things across two sessions: the apex A, the `www` record, their
TTLs, and the SPF string. Nothing else.** The GSC TXT in particular (D-06) is what keeps three legacy
properties verified and the Change of Address alive.

---

### Pitfall 6 — Filing the Change of Address from one property 🟡 BLOCKS MIG-09

Google: *"The tool does not move any subdomains below the specified domain (including www)."* Filing only
from `sc-domain:tpsventilatie.nl` leaves `www.tpsventilatie.nl` — **the hostname where the legacy
`www`→apex 301 lived and where a large share of inbound links point** — with no site-move signal.
File three times. D-06 is the precondition that makes all three possible.

---

### Pitfall 7 — Filing the CoA before the redirects are green 🟡

Google runs pre-move checks that sample the redirects at submission: *"If you fail any critical pre-move
checks, you must fix the issue before you can continue."* Filing before the 9 × 2 probe is green wastes
the attempt and can leave a confusing partial state. D-24's "same day, once the probe is green" is the
correct order; the plan should express it as a hard dependency edge, not as two adjacent tasks.

---

### Pitfall 8 — Expecting `verify-indexation.ts` to cover the legacy domain 🟡

`verify-indexation.ts` derives its URL list from `/sitemap.xml` on `CANONICAL_ORIGIN`. The legacy
hostnames are not in that sitemap and never will be. It will stay green through a completely broken
redirect map. P8 D-24's comment — *"Checks 2 and 4 are deliberately broader than this phase needs… so it
arrives already load-bearing"* — is true of the *assertions*, which `verify-redirects.ts` should reuse in
spirit, but **not** of the URL source. This is why Pattern 3 is a sibling script.

---

### Pitfall 9 — Reading the OneDrive mount as if it were a normal filesystem 🟡 EXECUTION HAZARD

During this research, `next.config.ts` was **unreadable** for the entire session — `cat`, `sed`,
`python3 open()`, `grep`, `git show` and `git cat-file` all returned `Operation timed out` / `mmap
failed`, while neighbouring files in the same directory read fine. The content had to be fetched from
GitHub (`gh api repos/Zlodziejczyk/tps-ventilatie/contents/next.config.ts`).

**This is the file the phase's central change lands in.** Plan for it:
- `gh api repos/.../contents/<path>` is a reliable read fallback and is already authenticated.
- A failed read is *not* evidence the file is missing or unchanged — it is the mount.
- This reinforces P8 D-08 (Vercel preview is the build gate) rather than contradicting it, and it is a
  concrete reason to prefer a branch + preview deploy over local verification for this phase.

---

### Pitfall 10 — Two facts in CONTEXT.md that live probing contradicts 🟢 MINOR, RECORD ONLY

| CONTEXT claim | Measured 2026-09-21 | Impact |
|---|---|---|
| D-15: *"it retires the stale `/wp-sitemap.xml` pointer … that 404s today"* | `/wp-sitemap.xml` returns **200** (a valid sitemap index); `/sitemap.xml` returns **301** | D-15's *conclusion* is unaffected — the pointer does become stale at cutover. Only the stated reason is wrong. Do not repeat "404s today" in the plan |
| ARCHITECTURE.md map row | `/mechanische-ventilatie-dakventilator/` → `…/aanleggen` | **Superseded by D-13** → `/diensten/mechanische-ventilatie`. Both targets verified 200 today; use the pillar |

---

## Code Examples

### Confirming the flip at all three dd24 nameservers (D-07)

`snapshot-dns.sh` queries only the first NS. At cutover, confirm all three agree before declaring
success — a zone that has propagated to one nameserver and not the others is the classic partial flip.

```bash
# Run immediately after the dd24 save, then again ~5 min later.
for ns in $(dig +short NS tpsventilatie.nl); do
  printf '%-34s ' "${ns%.}"
  dig @"${ns%.}" +noall +answer tpsventilatie.nl A www.tpsventilatie.nl A \
    | awk '{printf "%s(%s ttl=%s) ", $1, $5, $2}'
  echo
done
# PASS when all three show the Vercel values at TTL 300, for BOTH hostnames.
```

### The pre-flight gate, in full (D-09, corrected — Pattern 4)

```bash
# PRECONDITIONS: both legacy hostnames attached to the Vercel project (Invalid Configuration
# is expected and fine); the redirect map already deployed to PRODUCTION. No DNS has changed.
VIA="https://www.tpsklimaattechniek.nl"
TARGET="https://www.tpsklimaattechniek.nl"

fail=0
probe() {  # probe <legacy-host> <legacy-path> <expected-target-path>
  local host="$1" src="$2" want="$3" code loc
  read -r code loc < <(curl -sS -o /dev/null \
      -w '%{http_code} %{redirect_url}' --max-time 20 \
      -H "Host: ${host}" "${VIA}${src}")
  if [ "$code" != "301" ] || [ "$loc" != "${TARGET}${want}" ]; then
    echo "✗ ${host}${src} → ${code} ${loc}   (want 301 ${TARGET}${want})"; fail=1; return
  fi
  # hop 2 must be a DIRECT 200 — a redirect here is the chain MIG-06 forbids
  local dest; dest=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$loc")
  [ "$dest" = "200" ] || { echo "✗ ${loc} → ${dest} (want 200)"; fail=1; return; }
  echo "✓ ${host}${src} → 301 → ${loc} → 200"
}

for h in tpsventilatie.nl www.tpsventilatie.nl; do
  probe "$h" /                                           ""
  probe "$h" /over-ons/                                  /over-ons
  probe "$h" /contact/                                   /contact
  probe "$h" /privacy-beleid/                            /privacy-beleid
  probe "$h" /wtw-unit-vervangen/                        /diensten/wtw/vervangen
  probe "$h" /wtw-unit-onderhoud-reinigen/               /diensten/wtw/onderhoud-reinigen
  probe "$h" /wtw-unit-inregelen/                        /diensten/wtw/inregelen
  probe "$h" /mechanische-ventilatie-vervangen/          /diensten/mechanische-ventilatie/vervangen
  probe "$h" /mechanische-ventilatie-onderhoud-reinigen/ /diensten/mechanische-ventilatie/onderhoud-reinigen
  probe "$h" /mechanische-ventilatie-dakventilator/      /diensten/mechanische-ventilatie   # D-13
  # catch-all + §Pitfall 1 regression samples
  probe "$h" /over-ons                                   /over-ons          # slash-less: still ONE hop
  probe "$h" /robots.txt                                 /robots.txt        # D-15
  probe "$h" /sitemap.xml                                /sitemap.xml       # D-15
done
exit $fail
```

### Certificate verification (D-07 / D-10 / §Pitfall 4)

```bash
# ~30 min after the flip — D-10's TLS rollback trigger.
for h in tpsventilatie.nl www.tpsventilatie.nl; do
  echo "== $h =="
  echo | openssl s_client -servername "$h" -connect "$h":443 2>/dev/null \
    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName \
    || echo "  NO VALID CERT — D-10 rollback trigger"
done

# On/around 2026-10-30 — §Pitfall 4. This one is about MAIL, not the website.
echo | openssl s_client -servername mail.tpsventilatie.nl \
    -connect mail.tpsventilatie.nl:993 2>/dev/null |
  openssl x509 -noout -dates -ext subjectAltName
# PASS if notAfter > 2026-10-29. FAIL → escape hatch: point the mail client at s161.cyber-folks.pl
```

### Recording, not hiding, the `http`→`https` hop (D-18)

```bash
curl -sS -o /dev/null -w 'http://%{host}%{url_effective} → %{http_code} → %{redirect_url}\n' \
  --max-time 20 "http://tpsventilatie.nl/over-ons/"
# Expected: 308 → https://tpsventilatie.nl/over-ons/
# Vercel platform behaviour, not configurable. RECORD it in the probe output as a known,
# accepted extra hop for http-only inbound links. Never silently exclude it.
```

---

## Execution Sequence

The dependency order, with the one-way door marked. **Everything above the door is reversible with no
trace; everything below it starts a 28-day clock.**

| # | Step | Reversible? | Who | Blocks |
|---|---|---|---|---|
| **— REVERSIBLE PREP — runs on branch `gsd/phase-10-…`, no external effect —** |
| 1 | Amend `REQUIREMENTS.md` MIG-01, `ROADMAP.md` criterion 4 + hard-gate line (D-03); correct `PROJECT.md` §Context (D-01) and `CLAUDE.md` §Technology Stack (Finding 1) | ✅ git | Claude | — |
| 2 | Take the D-28 legacy mirror **while the old site is live**; commit + `CAPTURE.md` | ✅ git | Claude | must precede step 11 |
| 3 | Build `lib/seo/redirects.ts`, wire `next.config.ts` (incl. `skipTrailingSlashRedirect`), add `assert-redirects.ts` to `prebuild` | ✅ git | Claude | 4 |
| 4 | Push branch → **Vercel preview is the build gate** (P8 D-08). Preview must load (proves §Pitfall 2) and `prebuild` must pass 9 guards | ✅ | Claude | 5 |
| 5 | Add `scripts/verify-redirects.ts`; wire into `verify-indexation.yml` | ✅ git | Claude | 8 |
| 6 | Add the D-25 legacy section + 2 flag codes; prove both flags fire with `tsx -e` on fabricated readings | ✅ git | Claude | — |
| 7 | Runbook §8/§9/§10 (D-20/D-21/D-10/D-11) + D-26 footer line drafted for the editorial gate | ✅ git | Claude | 9 |
| 8 | **Merge to `main` → production deploy.** The map is live but inert: host-gated, and no legacy DNS points at Vercel | ✅ revert-and-deploy | Claude | 10 |
| 9 | Attach `tpsventilatie.nl` + `www.tpsventilatie.nl` to the Vercel project, **no "Redirect to"** (D-08). "Invalid Configuration" expected | ✅ detach | **User** | 10 |
| **— PRE-FLIGHT GATE (MIG-01…04) — the hard gate; all four must be green —** |
| 10 | **Spoofed-`Host` pre-flight probe, 9 × 2 + samples, all green** (Pattern 4) | ✅ | Claude | **DOOR** |
| 11 | MIG-01 mirror committed and spot-opened offline ✅ | ✅ | Claude | **DOOR** |
| 12 | MIG-03 webmail route verified 200 + in runbook ✅ | ✅ | Claude | **DOOR** |
| 13 | MIG-04 **both halves**: hosts line serves the real `wp-login.php` (ours) **and** Thomas confirms he logged in (dated) (D-22) | ✅ | Claude + **Thomas** | **DOOR** |
| 14 | *(new — §Pitfall 4)* Ask cyberfolks, via Thomas, to split the `mail.` certificate off the apex/www SANs | ✅ | **Thomas** | advisory, not blocking |
| **— ≥ 8 HOURS BEFORE THE FLIP (D-04/D-05) —** |
| 15 | dd24 session 1: lower apex + `www` TTL to **300**; rewrite SPF to `v=spf1 mx include:_spf.cyberfolks.pl -all`. **Do not touch the GSC TXT (D-06).** Check the suspension banner first | ✅ | **User** | 16 |
| 16 | Verify at all three NS: TTL 300 visible, SPF updated, GSC TXT intact. **Then wait ≥ 8 h** for the old 28800-second cache to drain | ✅ | Claude | 17 |
| **— 🚪 THE ONE-WAY DOOR — one live Claude session, D-07 —** |
| 17 | dd24 session 2: apex A → Vercel value; `www` → Vercel CNAME. Both TTL 300 | ⚠️ minutes (TTL 300) | **User** | 18 |
| 18 | Within minutes: `dig` all three NS · `verify-redirects.ts` Mode B, 9 × 2 green · certificates issued on both legacy hostnames · re-run `snapshot-dns.sh` and diff | — | Claude | 19 |
| 19 | **Mail round-trip (D-23):** send to `info@tpsventilatie.nl`, Thomas replies, headers → `docs/baseline/<date>/mail/` | — | Claude + **Thomas** | 20 |
| 20 | **~30 min after the flip: D-10 decision point.** Mail broken or either cert missing → **revert the two records now.** Anything else → proceed | ⚠️ last cheap revert | Claude + **User** | 21 |
| **— POST-FLIP, SAME DAY —** |
| 21 | **File the Change of Address ×3** — Domain property + both legacy URL-prefix properties (D-24/§Pitfall 6) | search-side: Cancel Move within 180 d | **User** (GSC UI) | — |
| 22 | Commit the post-cutover DNS snapshot, the diff, the probe output and the mail headers | ✅ git | Claude | — |
| **— THE 28-DAY WINDOW —** |
| 23 | Weekly: the cron's legacy section reports impressions + per-URL `googleCanonical` | — | CI | — |
| 24 | *(dated)* **~2026-10-30 — mail certificate check** (§Pitfall 4) | — | Claude | — |
| 25 | **Day 28 (D-11):** write `migration-final.md`; restore TTLs to 28800. **After this, revert is a second migration** | ❌ | Claude + **User** | — |

**Owner/user-blocked steps, collected for scheduling:** 9, 13, 14, 15, 17, 19, 20, 21, 25. Five of those
need Thomas specifically (13, 14, 19) or the dd24 panel (15, 17). The ≥8 h gap between 15 and 17 means
this phase spans **at minimum two calendar days**, and realistically three once Thomas's replies are
scheduled. A plan that puts steps 15 and 17 in the same wave is wrong.

---

## State of the Art

| Old approach | Current approach | When changed | Impact here |
|---|---|---|---|
| `output: "export"` + client-side webhook POST | Hybrid Vercel hosting + `app/api/lead/route.ts` | **Phase 5** (this project) | `redirects()` is available. `CLAUDE.md` still documents the old model |
| `permanent: true` (308) as the only permanent option | `statusCode: 301` supported standalone | Next.js ≥ 9.5 | D-14 is expressible exactly as written |
| Vercel apex A `76.76.21.21` | Project-specific values; apex now `216.198.79.1` on this project | ongoing | **Read the value off the dashboard; do not copy an old guide** |
| `middleware.ts` | `proxy.ts` | Next.js 16 | Only relevant because D-12 rejected this mechanism — the rename is why older middleware guidance looks stale |
| CoA covers a domain and its subdomains | *"The tool does not move any subdomains below the specified domain (including www)"*; file for every variant | Google guidance, reaffirmed **2026-06-17** | D-24's three filings are mandatory |
| `vercel.json` `routes` for everything | `redirects`/`rewrites`/`headers`, and for Next.js: *"you do not need to use `vercel.json`"* | ongoing | Keep the map in `next.config.ts` |
| Redirect config only in code | Vercel **Project Routes** + **bulk redirects** (CSV/JSON, thousands of rules) | 2026 | Not used here — bulk redirects have no `has` host matching; Project Routes live outside git |

**Deprecated / outdated:**
- **`CLAUDE.md` §Technology Stack** — says `output: "export"` and `images.unoptimized: true`. Both false
  since Phase 5. Correct it in this phase.
- **`PROJECT.md` §Context** — "access held … on the old site's hosting" is false (D-01).
- **ARCHITECTURE.md's 9-entry map row for dakventilator** — superseded by D-13.
- **ARCHITECTURE.md's "sources must be written with the trailing slash"** — necessary but, on its own,
  insufficient and actively misleading without §Pitfall 1's config change.

---

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|---|---|---|
| A1 | Vercel's edge preserves Next.js redirect **array order** exactly as compiled, so the re-added `/:path+/` rule stays last | §Pitfall 1, Pattern 1 | Legacy rules could be shadowed → two hops. **Detected by** `verify-redirects.ts` on the first production deploy, before DNS moves — cheap to discover |
| A2 | Attaching a hostname whose DNS points elsewhere still binds it in Vercel's alias table, so the spoofed-`Host` probe resolves | Pattern 4 | The pre-flight gate cannot run; fall back to verifying immediately post-cutover (D-09's rejected option) with the TTL-300 revert as the safety net. **Cheap to test:** attach, then probe — that *is* step 10 |
| A3 | cyberfolks' ACME client renews the mail cert for all three SANs via HTTP-01 | §Pitfall 4 | If they use DNS-01 or per-host certs, the risk is nil and step 14 is wasted breath. Asking costs one sentence |
| A4 | An apex-style A record at `www` pointing to `216.198.79.1` would work | Pattern 5 | Explicitly **not recommended** and not planned; noted only so nobody "simplifies" the CNAME into it |
| A5 | `wget --level=2` captures every asset the 10 pages need | Pattern 6 | An incomplete archive. **Verified at execution** by opening `index.html` offline (step 11) and by `du -sh` against the ~1.6 MB estimate |
| A6 | Google's CoA pre-move check samples the *homepage* redirect primarily | Pitfall 7 | Only affects how surprising a rejection is; the mitigation (probe green first) is the same either way |
| A7 | N = 4 weeks of zero legacy impressions is the right retirement signal | Pattern 9 | A wrong N only changes when a *conversation* starts; the 180-day floor and the "separate decision" rule are the real guards |
| A8 | Vercel's `x-vercel-mitigated: deny` on `.vercel.app` Host mismatch is platform-wide, not a firewall rule on this project | Pitfall 3 | If it is project-level it could be disabled — but the recommended probe does not need it disabled, so the distinction does not change the plan |

---

## Open Questions (RESOLVED)

1. **Does the 9-entry map need a 10th entry for `/wp-sitemap.xml`?**
   - **Known:** it returns 200 today and is advertised by the legacy `robots.txt`. The catch-all
     path-preserves it to `https://www.tpsklimaattechniek.nl/wp-sitemap.xml`, which 404s.
   - **Unclear:** whether a 404 or a 301 to `/sitemap.xml` is the better signal. A 301 is tidier; a 404
     is honest and self-documenting in GSC (D-12's stated preference for WordPress leftovers).
   - **Recommendation:** leave it to the catch-all → 404. It is consistent with D-12's reasoning for
     `/feed/` and `/wp-json/*`, and D-15 already redirects the *advertised* `/robots.txt` and
     `/sitemap.xml`, which is the pointer that matters.

2. **Which exact A / CNAME values does Vercel show for this project today?**
   - **Known:** the working pattern on the sibling domain is A `216.198.79.1` and CNAME
     `863afab58c3e6cf4.vercel-dns-017.com.`, and the CNAME target is project-specific so it should be
     identical for the legacy `www`.
   - **Unclear:** whether the dashboard currently offers a different apex value for a newly added domain.
   - **Recommendation:** step 9 reads the values off the Domains page and the plan records them verbatim
     before step 17. Do not hardcode from this document.

3. **Will Thomas's mail client break at the certificate rollover?** (§Pitfall 4)
   - **Known:** the cert expires 2026-10-29 and two of its three SANs move to Vercel.
   - **Unclear:** cyberfolks' ACME behaviour — invisible to us.
   - **Recommendation:** ask (step 14), check on the date (step 24), and keep the
     `s161.cyber-folks.pl` escape hatch documented. Do not let this block the cutover.

4. **Should the D-26 footer line also appear on `/over-ons`?**
   - **Known:** D-26 says "footer (and/or `over-ons`)".
   - **Recommendation:** footer only for now — one unconditional statement sitewide is the strongest
     entity signal per unit of copy, and `over-ons` is already going through Phase 12's content work.
     Offer it to the owner as an option at the editorial gate rather than deciding it here.

---

## Environment Availability

| Dependency | Required by | Available | Version | Fallback |
|---|---|---|---|---|
| `curl` | Pre-flight probe, `verify-redirects.ts`, D-18 | ✅ | 8.7.1 | — |
| `dig` | D-04/D-05/D-07 verification, `snapshot-dns.sh` | ✅ | system (bind) | — |
| `openssl` | D-10 TLS trigger, §Pitfall 4 cert checks | ✅ | 3.6.2 | — |
| `node` / `npx` / `tsx` | All gates and probes | ✅ | Node 26.0.0, npm 11.12.1, tsx ^4.22.4 | — |
| `gh` (authenticated) | Workflow dispatch, run status, **and reading files the OneDrive mount refuses** (§Pitfall 9) | ✅ | 2.93.0, scopes `repo, workflow, gist, read:org` | — |
| `git` | Everything | ✅ | 2.50.1 | — |
| `jq`, `python3` | Ad-hoc JSON | ✅ | jq 1.7.1, Python 3.14.5 | — |
| Vercel CLI | Optional — domain attach could be CLI-driven | ⚠️ local dep only (`node_modules/.bin/vercel`) | ^54.18.1 | **Dashboard.** Memory records `vercel` CLI enable as interactive-only on this machine — plan step 9 as a dashboard action by the user |
| **`wget`** | **D-28 legacy mirror (MIG-01)** | ❌ **MISSING** | — | `brew install wget` → 1.25.0. Homebrew 7.0.3 present |
| `httrack` | Alternative mirror tool | ❌ MISSING | — | `brew install httrack` → 3.50.2. Not needed if `wget` is used |
| `swaks` | *(not required)* | ❌ MISSING | — | D-23's mail proof is a human reply, not a synthetic send — deliberately |
| dd24 panel | D-04/D-05/D-07 | ⚠️ user-only | — | **None.** By decision (D-07), never automated |
| GSC UI | D-24 Change of Address ×3 | ⚠️ user-only | — | **None.** The CoA has no API |
| GSC service account | D-25 weekly legacy section | ✅ | `GSC_SERVICE_ACCOUNT_JSON` repo secret | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** `wget` — one `brew install`, blocking only step 2 (MIG-01).
Plan it as the first action of that task, not as a prerequisite discovered mid-task.
**Access constraints that shape the plan, not tool gaps:** the dd24 panel and the GSC Change of Address
are user-only by decision; `next.config.ts` may be locally unreadable (§Pitfall 9).

---

## Validation Architecture

**Honest constraint (unchanged from Phases 8–9):** no test framework by decision, no local `next build`
on this OneDrive mount. Validation is `tsx` CLI runs, live HTTP/DNS/TLS probes, `gh run` state, and — for
the irreversible half — timed external observation.

### Test Framework

| Property | Value |
|---|---|
| Framework | none — `tsx` + `node:assert/strict` CLIs and live probes (project decision, P8 D-01) |
| Config file | `package.json` `prebuild` chain (currently 8 guards, ~1.7 s) + `.github/workflows/verify-indexation.yml` |
| Quick run command | `npx tsx scripts/assert-redirects.ts` (~0.3 s, no network) |
| Full suite command | `npm run prebuild` (**9** guards after this phase) + `npx tsx scripts/verify-redirects.ts` + `npx tsx scripts/verify-indexation.ts <prod>` |
| Estimated runtime | ~2 s build gates; ~25 s for the 18-source × 2-request live probe |

### Phase Requirements → Test Map

| Req | Behaviour | Test type | Automated command | File exists? |
|---|---|---|---|---|
| MIG-01 | Mirror exists, is complete, renders offline, size recorded | file assertions | `node -e` over `docs/baseline/<date>/legacy-site-mirror/` (index.html + ≥9 subdirs + `CAPTURE.md`); `du -sh` | ❌ Wave 0 (mirror task) |
| MIG-02 | SPF has no `a`; mail server still authorized | DNS probe | `dig +short TXT tpsventilatie.nl \| grep -c 'v=spf1 mx include:_spf.cyberfolks.pl -all'` | ❌ — add to the cutover checklist |
| MIG-03 | Webmail route 200, documented | HTTP + doc | `curl -sS -o /dev/null -w '%{http_code}' https://s161.cyber-folks.pl/webmail/` = 200; grep the runbook | ❌ |
| MIG-04 | WP-login served through the hosts override **and** Thomas confirmed | HTTP + **manual** | `curl --resolve tpsventilatie.nl:443:195.78.67.39 …/wp-login.php` → WordPress form; Thomas's dated confirmation | ❌ + manual half |
| MIG-05 | Map structurally correct, destinations derived, judgement explained | unit-ish | `npx tsx scripts/assert-redirects.ts` (10 assertions) | ❌ Wave 0 |
| MIG-06 | Build fails on chain / duplicate / non-sitemap destination / un-gated catch-all | **negative proof** | `npx tsx -e` feeding perturbed maps into the pure checker; each must exit non-zero | ❌ Wave 0 |
| MIG-07 | 9 × 2 sources → exactly one hop → 200 | live probe | `npx tsx scripts/verify-redirects.ts` | ❌ Wave 0 |
| MIG-08 | Send **and** receive on `info@tpsventilatie.nl` | **manual + artefact** | Thomas's reply `.eml` in `docs/baseline/<date>/mail/` with `spf=pass dkim=pass dmarc=pass` | manual-only |
| MIG-09 | CoA filed from all three legacy properties | **manual + artefact** | GSC UI × 3; screenshot + dated note | manual-only |
| MIG-10 | Rollback documented; WP reachable; record values captured | doc + HTTP | grep runbook §10 for both old and new record values; `curl --resolve` → WP 200 | ❌ |

### Sampling Rate — and where a single-point check aliases into a false pass

This is the section that matters most for this phase, because **four of the five claim classes have a
Nyquist problem**: the thing being claimed changes on a timescale, or across a population, that a single
check cannot see.

| Claim class | Single-point check | Why it **aliases** | Minimum sufficient sampling |
|---|---|---|---|
| **Redirect correctness** | Probe one source on one hostname | 18 independent rules; a typo in rule 7 is invisible when you sampled rule 1. And §Pitfall 1 makes the *slashed* form fail while the slash-less form passes — so sampling the wrong form reports green on a broken map | **Exhaustive, not sampled: all 9 × both hostnames, every run.** Plus ≥3 catch-all samples and — mandatory — **one slash-less source** (`/over-ons`) as the §Pitfall 1 regression canary. 18 + 4 requests is ~25 s; there is no reason to sample |
| **DNS propagation** | `dig` once, against the default resolver | The default resolver may hold a 28800-s cached answer (or a fresh one, by luck). One authoritative NS answering correctly says nothing about the other two — a partial zone push is the classic failure | **All three authoritative NS, twice**: immediately after the save and again ~5 min later. Two readings separated in time distinguish "propagated" from "caught it mid-push" |
| **Certificate issuance** | Check once, right after the flip | Vercel issues asynchronously; checking at T+0 reports a false failure, and checking only once at T+2 min can report a false pass for a cert that is about to be replaced. **And the mail-cert risk (§Pitfall 4) is invisible at any time before 2026-10-29** | **T+2 min, T+15 min, T+30 min** on both legacy hostnames (T+30 is D-10's decision point), **plus a dated check on ~2026-10-30 for `mail.tpsventilatie.nl:993`.** A 38-day-out failure cannot be sampled by any probe run on cutover day — only a calendar entry catches it |
| **Mail deliverability** | One outbound send (e.g. mail-tester) | Outbound-only. A broken MX or a DNS mistake kills *inbound*, which the send never touches. And a single round-trip proves the state at one instant, not across SPF cache drain | **One reply round-trip** (proves both directions in one action — D-23) **at T+30 min**, plus the ≥8 h SPF lead time (D-05) so the SPF change is fully propagated *before* the apex moves and cannot be confounded with it. The round-trip is the sample; the 8 h gap is what makes one sample sufficient |
| **GSC consolidation** | Check the week after cutover | Google's lag is weeks. One reading a week after cutover shows nothing and would be read as failure; one reading at week 8 showing success cannot distinguish "consolidated at week 3" from "consolidated yesterday" | **Weekly, indefinitely** — the existing cron. Per-URL `googleCanonical` (9 URLs, so a stuck URL is *named*) plus a 28-day impressions window. `legacy-canonical-not-moved` deliberately does not fire before **week 8** |

**Per task commit:** `npx tsx scripts/assert-redirects.ts` (no network, sub-second).
**Per wave / plan:** `npm run prebuild` (9 guards) **and a pushed branch → Vercel preview that loads** —
on this repo the preview *is* the build, and for this phase a preview that fails to load is the
signature of §Pitfall 2.
**Phase gate:** the full pre-flight table (step 10) green; `verify-redirects.ts` green in Mode B
post-cutover; the `verify-indexation.yml` run triggered by the real production deployment green;
all four manual artefacts present in `docs/baseline/<date>/`.

### Wave 0 Gaps

- [ ] `scripts/assert-redirects.ts` — MIG-05, MIG-06 (structural half)
- [ ] `scripts/verify-redirects.ts` — MIG-06 (live half), MIG-07
- [ ] `lib/seo/redirects.ts` — MIG-05 (the data the gates reason about; must land first)
- [ ] `brew install wget` — MIG-01 (blocking, trivial)
- [ ] Negative-proof harness for the 10 structural assertions — the P8/P9 habit: a gate that has never
      been observed failing has not been shown to work. Assertions **#8, #9 and #10** in particular must
      each be watched to fire on a perturbed map, because those three encode the findings that would
      otherwise reach production.

*(No test-framework install: none exists and none is wanted.)*

### Manual-only verifications — claims only an external observer can settle

| Behaviour | Req | Why manual | Instructions |
|---|---|---|---|
| Thomas logs in to WP-admin through the hosts override | MIG-04 (D-22) | Only he holds the credentials — and the untested half is exactly the failure it insures against | Dated confirmation recorded in the plan and in `docs/baseline/<date>/` |
| `info@tpsventilatie.nl` sends **and** receives | MIG-08 (D-23) | Only the mailbox owner can reply from it; **only his mail client can observe the TLS state** | Send external → he replies → capture full headers → commit the `.eml` |
| Change of Address accepted ×3 | MIG-09 (D-24) | **No API exists.** Google is the observer; its pre-move checks are the verdict | GSC UI per property; screenshot the confirmation and the pre-move check result |
| dd24 record state + suspension banner | MIG-02, MIG-07 | Registrar panel, user-only by decision (D-07) | Screenshot before and after each of the two sessions |
| Vercel domains attached with **no** "Redirect to" | MIG-07 (D-08) | Dashboard state, not in git, and the default is the wrong one | Screenshot the Domains page showing both legacy hostnames with no redirect target |
| Google has consolidated the legacy URLs | MIG-09 | **Google is the only observer that can answer this**, and it answers on its own schedule | Weekly cron; `googleCanonical` per legacy URL. Nothing we serve can prove it |
| Mail certificate renewed past 2026-10-29 | §Pitfall 4 | 38 days out — no probe run during this phase can see it | Calendar entry → `openssl s_client … :993` |
| D-26 footer copy approved | D-26 | Site copy → owner's editorial gate | Present options A/B/C; record the choice |

---

## Security Domain

### Applicable ASVS L1 categories

| Category | Applies | Control |
|---|---|---|
| V2 Authentication | yes (machine identity) | Unchanged from Phase 9 — the GSC service account (RS256 JWT, `node:crypto`, read-only scope, 1 h token). D-25 adds **no new credential**; it uses the existing one against a property it already holds |
| V4 Access control | yes | SA stays **Full** on exactly the two Domain properties. Workflow `permissions:` stay minimal per job. The dd24 panel and the GSC CoA remain **human-only by decision (D-07/D-24)** — the highest-blast-radius actions in the milestone have no automation surface at all |
| V5 Input validation | yes | The redirect map is **data compiled into edge config**, never request-derived. `has: host` values are literal anchored patterns, never interpolated from a request. API responses treated as untrusted (existing pattern) |
| V6 Cryptography | yes | No new crypto. TLS is verified with `openssl`, never bypassed — **no `curl -k` / `--insecure` anywhere in this phase**, because the certificate *is* one of the two rollback triggers (D-10) and silencing it would silence the trigger |
| V8 Data protection | yes | The D-28 mirror is **public HTML and images only** — no database dump, no personal data (that is the explicit reason D-28 permits committing it). Before committing, grep the mirror for form submissions, `wp-admin` artefacts and email addresses beyond the public `info@` |
| V12 Files | yes | `wget` is constrained by `--domains` and `--no-parent`; `--restrict-file-names=windows` prevents path surprises on the OneDrive mount; `-e robots=off` deliberately **not** used |
| V14 Configuration | yes | `skipTrailingSlashRedirect: true` is a routing-behaviour change; assertion #10 pins it. Actions stay pinned `@v7`; no `pull_request_target`; the `deployment_status` job stays gated to Production |

### Threat patterns for this stack

| Pattern | STRIDE | Standard mitigation |
|---|---|---|
| **Open redirect** via the catch-all | Tampering / phishing | `destination` is built from the `CANONICAL_ORIGIN` **constant**; only `:path*` is request-derived, and it is a path, never a host. Vercel's own docs warn that *"Some redirects and rewrites configurations can accidentally become gateways for semantic attacks"* — assertion #3 (every destination starts with `CANONICAL_ORIGIN`) is the structural answer |
| **Un-gated catch-all → self-redirect loop** | DoS (self-inflicted) | §Pitfall 2; assertion #8, build-blocking |
| **SPF widened to authorize Vercel's IPs to send as the domain** | Spoofing | D-05 drops `a` **≥8 h before** the apex moves, so the widened window never opens. Verified by `dig` at all three NS before step 17 |
| **Silent loss of GSC ownership** | Tampering | D-06 — the TXT record is treated as immutable during the zone edits; verified present immediately after each dd24 session |
| **Mail TLS failure from a shared-SAN certificate** | DoS | §Pitfall 4 — prevention (split the cert), detection (dated `openssl` check), fallback (`s161.cyber-folks.pl`) |
| **Unpatched WordPress 7.1.1 compromised while dormant** | Tampering | **Accepted risk (D-02, risk 1)**, with the consequence named: a DNS revert would restore a possibly-compromised site. The D-28 mirror is the clean copy of the *content*; the rollback document must say the install is not trusted after a long dormancy |
| **Credential sprawl at the registrar** | Elevation | No dd24 automation, no stored registrar credential, no Claude-driven Chrome in that panel (D-07's explicit rejection) |
| **Secrets in the committed mirror** | Information disclosure | The mirror is a crawl of public pages by an unauthenticated client — it cannot contain anything a visitor could not fetch. Still grep before committing |
| **Supply chain** | Tampering | **No new npm packages.** `wget` is a GNU core utility on the dev machine, never in `package.json`, never in the build |

---

## Sources

### Primary (HIGH — official docs, first-party source, or measured live)

- **Next.js v16.2.1 source, read directly** —
  `packages/next/src/lib/load-custom-routes.ts` (the `redirects.unshift` trailing-slash rule; the
  `allowedKeys` allow-list; `allowedHasTypes`; the `RouteHas` union typing `host` as
  `{ type: 'host'; key?: undefined; value: string }`; the `permanent`-xor-`statusCode` check) and
  `packages/next/src/shared/lib/router/utils/prepare-destination.ts` (`matchHas` reading
  `req.headers.host` and anchoring `new RegExp(\`^${value}$\`)`). Fetched from
  `raw.githubusercontent.com/vercel/next.js/v16.2.1/…`
- [nextjs.org/docs/app/api-reference/config/next-config-js/redirects](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects) — `has`/`missing`, the `type: 'host'` example, `statusCode` vs `permanent`, *"Redirects are checked before the filesystem"*
- [nextjs.org/docs/app/api-reference/config/next-config-js/skipTrailingSlashRedirect](https://nextjs.org/docs/app/api-reference/config/next-config-js/skipTrailingSlashRedirect) — the behaviour table, *"Your own `redirects` and `rewrites` from `next.config.js` still apply"*, the duplicate-URL caution
- [nextjs.org/docs/app/guides/static-exports](https://nextjs.org/docs/app/guides/static-exports) — Redirects listed under "Unsupported Features" (the hypothesis that **does not** apply here)
- [vercel.com/docs/project-configuration/vercel-json](https://vercel.com/docs/project-configuration/vercel-json) — `redirects` schema, `has`/`missing` with `type: host`, `bulkRedirectsPath` (*"do not support wildcard or header matching"*)
- [vercel.com/docs/routing/redirects/configuration-redirects](https://vercel.com/docs/routing/redirects/configuration-redirects) — *"When using Next.js, you do not need to use `vercel.json`"*; limits 2,048 redirects / 4,096-char source and destination
- [vercel.com/docs/routing](https://vercel.com/docs/routing) — routing order; Project Routes *"run after bulk redirects and before your deployment's own routes"*
- [vercel.com/docs/domains/working-with-domains/add-a-domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain) — adding domains, apex A vs subdomain CNAME, Invalid Configuration troubleshooting
- [vercel.com/docs/domains/working-with-domains/deploying-and-redirecting](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting) — the **"Redirect to"** dropdown, the automatic www↔apex redirect D-08 guards against
- [support.google.com/webmasters/answer/9370220](https://support.google.com/webmasters/answer/9370220?hl=en) — Change of Address: domain-level only, *"does not move any subdomains … including www"*, pre-move checks, the 180-day window, Cancel Move
- [developers.google.com/webmaster-tools/v1/urlInspection.index/inspect](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect) — *"Must be under the property specified in `siteUrl`"*
- **Live measurements, 2026-09-21 (this session):** Vercel `Host`-header dispatch and the `x-vercel-mitigated: deny` / `DEPLOYMENT_NOT_FOUND` matrix · `POST /api/lead` 400 + `GET` 405 (hybrid hosting proof) · legacy zone TTL 28800 / SPF-with-`a` / GSC TXT at all three dd24 NS · legacy canonicals are slashed · `/wp-sitemap.xml` 200 · all 10 legacy sources 200 · all 11 new-site targets 200 · new-domain DNS pattern (A `216.198.79.1`, CNAME `863afab58c3e6cf4.vercel-dns-017.com.`, TTL 300) · the shared-SAN mail certificate on 993/465/587 expiring 2026-10-29 · mirror footprint ~1.6 MB · environment tool audit
- **Repo, read this session:** `next.config.ts` (via `gh api`), `package.json`, `scripts/verify-indexation.ts`, `scripts/gsc/api.ts`, `scripts/gsc/thresholds.ts`, `scripts/measure-indexation.ts`, `scripts/export-gsc-performance.ts`, `scripts/snapshot-dns.sh`, `lib/constants.ts`, `lib/seo/invariants.ts`, `lib/seo/policy.ts`, both workflows, `docs/seo-owner-runbook.md`, `.planning/PROJECT.md`, `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/research/{ARCHITECTURE,PITFALLS}.md`, `09-RESEARCH.md`

### Secondary (MEDIUM — verified against an official source)

- GNU wget flag semantics — cross-checked against [gnu.org/software/wget/manual](https://www.gnu.org/software/wget/manual/wget.html) (rate-limited during this session; flags corroborated by [kevincox.ca/2022/12/21/wget-mirror](https://kevincox.ca/2022/12/21/wget-mirror/) and [guyrutenberg.com](https://www.guyrutenberg.com/2014/05/02/make-offline-mirror-of-a-site-using-wget/)) and by `brew info wget` for the version
- Framework-vs-platform redirect precedence — the Vercel docs statement above, corroborated by [vercel/community discussion #535](https://github.com/vercel/community/discussions/535)
- [searchengineland.com — for site moves, specify all domain variants](https://searchengineland.com/for-site-moves-specify-all-domain-variants-with-googles-change-of-address-tool-480552) — the 2026-06-17 guidance change; the substance is confirmed by the Google Help text quoted above

### Tertiary (LOW — flagged for validation at execution)

- A2 (Vercel alias binding before DNS) — inferred from the alias/DNS-check separation and from the
  `DEPLOYMENT_NOT_FOUND` vs 308 contrast. **Validated by running step 10.**
- A3 (cyberfolks ACME behaviour) — unknowable from outside. **Validated by asking (step 14).**
- A4 (apex-style A at `www`) — not verified, not recommended, recorded only as a guard-rail.

---

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|---|---|---|
| Redirect mechanism (`has: host`, `statusCode`, allowed keys, anchoring) | **HIGH** | Read out of the installed version's own source plus the matching official reference |
| Trailing-slash ordering (§Pitfall 1) | **HIGH** | `redirects.unshift` in v16.2.1 source + the official behaviour table + live confirmation that the new site 308s `/over-ons/` and that legacy canonicals are slashed |
| Vercel `Host`-header dispatch and the probe correction (§Pattern 4) | **HIGH** | Six measured SNI × Host combinations against the live project today |
| Hosting model (hybrid, not static export) | **HIGH** | Three independent confirmations, one of them a live behavioural probe |
| Vercel domain attachment / no-redirect option | **MEDIUM-HIGH** | Official docs + the working sibling-domain pattern measured; the exact dashboard state is user-verified at step 9 |
| Change of Address requirements | **HIGH** | Google Help quoted verbatim, corroborated by the 2026-06-17 reporting |
| GSC API surface for the legacy section | **HIGH** | Official constraint quoted; the client functions and `PROPERTY_LEGACY` already exist in the repo |
| Mirror tooling and footprint | **MEDIUM-HIGH** | Footprint measured (~1.6 MB); wget flags corroborated but the manual was rate-limited — verify by opening the archive offline |
| Mail-certificate risk (§Pitfall 4) | **MEDIUM** | The certificate, its SANs and its expiry are **measured facts**; cyberfolks' renewal behaviour is an unknown, which is why the mitigation is ask-check-fallback rather than a prediction |
| Google-side consolidation timing | **LOW-MEDIUM** | Google does not commit to a timeline; the 180-day floor is the only firm number |

**Research date:** 2026-09-21
**Valid until:** **2026-10-12 (21 days)** — shorter than the usual 30 because three inputs move:
Vercel's DNS values and dashboard flows change without notice, Google's site-move guidance changed as
recently as 2026-06-17, and **the measured mail certificate expires 2026-10-29**, which is inside any
plausible execution window. Re-verify the dd24 zone state and the Vercel record values immediately
before step 15.
