# Phase 10: Reversible Old-Brand Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `10-CONTEXT.md` — this log preserves the alternatives considered.

**Date:** 2026-09-18
**Phase:** 10-Reversible Old-Brand Migration
**Areas discussed:** Cutover & rollback mechanics · Redirect map & its build gate · Owner continuity
after the repoint · WordPress backup & restore proof · (round 2) 180-day floor & watching · Human
brand continuity · GBP URL boundary

---

## Cutover & rollback mechanics

### TTL plan for the legacy zone

| Option | Description | Selected |
|--------|-------------|----------|
| 300 s, held through the window | Lower only apex + `www` A to 300 s ≥8 h before cutover, hold through the ~28-day window, restore at final declaration | ✓ |
| 300 s, restore right after cutover | Same pre-lowering, TTL back to 28800 once redirects verify | |
| Leave at 28800 | Fewest dd24 touches; a revert takes up to 8 h | |

**Notes:** Grounded on a live probe during the discussion — authoritative TTL on every record in that
zone is 28800, so the phase's headline promise ("rollback = revert 2 A records in minutes") was
materially false before this decision.

### How the cutover moment runs

| Option | Description | Selected |
|--------|-------------|----------|
| You edit, live session | User edits at dd24 by hand with Claude live; Claude verifies `dig` × 3 NS, 9 redirects × 2 hostnames, cert, mail | ✓ |
| Claude drives Chrome at dd24 | Faster, but highest blast-radius action in the milestone in a zone holding live mail | |
| You edit async, Claude verifies later | No scheduling dependency; TLS gap and mail failures unobserved for hours | |

**Notes:** P9 D-03 covered TXT records only; this extends the same reasoning to the repoint itself.

### Rollback triggers

| Option | Description | Selected |
|--------|-------------|----------|
| Mail + TLS only | Revert on send/receive failure or missing cert ~30 min post-flip; search performance never triggers | ✓ |
| Mail/TLS + redirect integrity | Also revert on a missed target or extra hop | |
| Add a named traffic floor | Also revert on a GSC clicks/impressions threshold in weeks 1–2 | |

**Notes:** A broken redirect is fixed by a deploy, not by DNS. The traffic-floor option was presented
with its counter-argument stated: by the time a traffic signal is legible, reverting starts a second
migration from a worse position.

### Change of Address timing and declaring the migration final

| Option | Description | Selected |
|--------|-------------|----------|
| Same-day CoA, day-28 final | File once the one-hop probe is green from both hostnames; declare final at day 28 with a dated note | ✓ |
| 72 h soak, then CoA | Three days of watching before signalling Google | |
| Same-day CoA, data-gated final | Declare final on GSC evidence rather than a calendar date | |

---

## Redirect map & its build gate

### Unmapped legacy URLs

| Option | Description | Selected |
|--------|-------------|----------|
| Path-preserving catch-all | `/:path*` → `${CANONICAL_ORIGIN}/:path*` after the 9 rules | ✓ |
| Catch-all → homepage | Research's original sketch; soft-404 risk, hides mapping gaps | |
| Path-preserving + 410 for WP paths | Cleanest "gone" signal; needs middleware or a route handler | |

**Notes:** The question was reframed during the discussion — the load-bearing reason for a catch-all
is not politeness to unmapped URLs but that **without one, the Next app serves every new route under
the retired hostname**.

### Target for `/mechanische-ventilatie-dakventilator/`

| Option | Description | Selected |
|--------|-------------|----------|
| `/diensten/mechanische-ventilatie` (pillar) | No single sub-service matches; the pillar preserves intent | ✓ |
| `…/onderhoud-reinigen` | Follows the page's actual lead; drops the replacement half | |
| `…/vervangen` | Follows commercial intent; risks reading as bait-and-switch | |
| `…/aanleggen` | The research table's proposal | |

**Notes:** The live page was fetched during the discussion. Its H2 is "Dakventilator Onderhoud" and
its packages span maintenance (€190/€250) and replacement (€700), with **no** installation content —
which contradicts the research table's proposal. Evidence recorded in CONTEXT D-13.

### 301 vs 308

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit `statusCode: 301` | Matches MIG-05/07 and the roadmap verbatim; what auditors look for | ✓ |
| Accept 308 via `permanent: true` | Idiomatic Next; Google-equivalent; leaves a permanent footnote | |
| You decide | | |

### How much of MIG-06 runs at build time

| Option | Description | Selected |
|--------|-------------|----------|
| Split: structural in `prebuild`, live post-deploy | Structure at build; direct-200/one-hop in the CI probe | ✓ |
| Full network check in `prebuild` | Literal reading; makes builds depend on production reachability | |
| Live check only, in CI | Chains and duplicates surface only after shipping | |

### Legacy `/robots.txt` and `/sitemap.xml`

| Option | Description | Selected |
|--------|-------------|----------|
| Let them 301 | Google follows robots redirects; retires the stale `/wp-sitemap.xml` pointer | ✓ |
| Exempt `robots.txt` only | Removes doubt for non-Google crawlers; needs Host branching | |
| Exempt both | Most explicit, most machinery, weakest site-move signal | |

### Per-entry rationale in the map

| Option | Description | Selected |
|--------|-------------|----------|
| `confidence` + `why`, gate-enforced | `why` required on every `judgement` entry | ✓ |
| Keep it `{from, to}` | Leanest; rationale archived with `.planning/` | |
| `why` on every entry | Uniform; eight would read "exact 1:1" and train readers to skip it | |

### Proving the map before DNS changes

| Option | Description | Selected |
|--------|-------------|----------|
| Forced `Host` header | Attach both hostnames first, probe the deployment with `Host` spoofed | ✓ |
| Local `/etc/hosts` override | Closest to the end state; mutates this machine, cert won't match | |
| Verify only after cutover | The pre-flight checklist stops being a gate | |

### Defining "exactly one hop"

| Option | Description | Selected |
|--------|-------------|----------|
| https, both hostnames | 9 × 2 assertions + catch-all sample; http→https 308 recorded as accepted | ✓ |
| https, apex only | Leaves the phase's headline risk (the `www` chain) unmeasured | |
| Treat any http 2-hop as a failure | Would fail permanently; Vercel's redirect is platform-level | |

---

## Owner continuity after the repoint

### What access we hold on the old stack

| Option | Description | Selected |
|--------|-------------|----------|
| WordPress admin login | | |
| cyberfolks hosting panel login | | |
| `info@` mailbox credentials | | |
| None of these — Thomas holds them | | ✓ |

**User's choice:** *"we have dd24 access (domain itself), above are held by cyberfolks."*
**Notes:** This answer reshaped the phase. It also surfaced that `PROJECT.md` §Context is factually
wrong where it claims access to the old site's hosting — recorded as a correction in CONTEXT D-01.

### Webmail route

| Option | Description | Selected |
|--------|-------------|----------|
| Document `s161.cyber-folks.pl/webmail/` | Re-verified 200; host-level, DNS-independent, works today | ✓ |
| Branded `webmail.tpsventilatie.nl` | Needs a cert from cyberfolks — blocked on access we don't hold | |
| Skip webmail — set up IMAP | Better day-to-day; needs the mailbox password and Thomas's device | |

### WP-admin route

| Option | Description | Selected |
|--------|-------------|----------|
| hosts-file override | `siteurl` untouched, so rollback stays a pure 2-record revert | ✓ |
| Branded `oud.` + repoint `siteurl` | Turns "revert 2 A records" into a 3-step procedure | |
| Panel access only | Needs credentials we don't hold | |
| Accept it, revert DNS to get back in | Contradicts MIG-04 as written | |

### SPF `a` drop timing

| Option | Description | Selected |
|--------|-------------|----------|
| Early — with the TTL lowering | Propagated before the apex moves; closes the Vercel-authorized window | ✓ |
| At the same moment as the A records | One fewer dd24 visit; leaves a cached-SPF exposure window | |
| After the cutover verifies green | Maximises the exposure window | |

### Do we ask Thomas for credentials?

| Option | Description | Selected |
|--------|-------------|----------|
| Ask for cyberfolks panel access | | |
| Ask only for WordPress admin | | |
| Ask for nothing — Thomas executes | | |
| Panel access + mailbox credentials | | |

**User's choice:** *"do we need these?"* — a challenge rather than a selection.
**Notes:** Answered by walking MIG-01…10 against held access. Only MIG-01 could not be executed from
our side. Conclusion reported back: **we need the artefact, not the credentials** — which then made
the whole question moot once MIG-01 itself was reduced.

### MIG-08 mail proof

| Option | Description | Selected |
|--------|-------------|----------|
| Reply round-trip, headers captured | One reply proves both directions; headers committed as evidence | ✓ |
| Two separate tests | Cleaner separation; two actions from Thomas at the worst moment | |
| Thomas runs mail-tester.com | Only exercises outbound — receiving is the half at risk | |

### What "MIG-04 verified" means without WP credentials

| Option | Description | Selected |
|--------|-------------|----------|
| Two-part proof | We prove the route serves the real WP login; Thomas confirms login once, dated | ✓ |
| Route-only proof | "Verified" would be half-true on a named hard gate | |
| Fold into the credentials ask | | |

---

## WordPress backup & restore proof

### Does MIG-01 protect reversibility?

**User's challenge (all four questions in the batch):** *"do we need to back it up? i assume when we
cut off dns it still will live on cyberfolks side right?"* · *"at cyberfolks? where his mail also
lives"* · *"we should be able to just revert our dns changes and the old site comes to life?"* ·
*"not relevant assuming we wont be destroying it only changing the dns?"*

**Answer given:** correct on every point. The DNS change moves two A records; files, database, vhost
and subscription are untouched, and a revert brings the site back within TTL. MIG-01's stated logic
("reversible migration, therefore back it up") is a non-sequitur. What a backup *does* insure against
is three slower risks — the install rotting unpatched (WP 7.1.1, generator meta public,
`readme.html` reachable), the cyberfolks subscription ending (it exists only for `info@`), and a
host-side accident. Storing it at cyberfolks is not "off-host" — same host, same single point of
failure. Counter-evidence gathered live during the discussion.

### What MIG-01 becomes

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror now (gate) + backup later (best-effort) | Recommended — content mirror blocking, files+DB non-blocking | |
| Mirror only — close MIG-01 on it | No ask on Thomas; risks 1–3 explicitly accepted | ✓ |
| Keep MIG-01 as written | Hands the milestone's critical path to an inbox | |
| Drop MIG-01 entirely | Loses even the page content | |

**Notes:** User chose against the recommendation, deliberately, having been shown the accepted risks.
Recorded as accepted risk in CONTEXT D-02 rather than as an open gap.

### Recording the requirement change

| Option | Description | Selected |
|--------|-------------|----------|
| Amend REQUIREMENTS + ROADMAP | Rewrite MIG-01, success criterion 4 and the hard-gate line in-phase | ✓ |
| CONTEXT.md only | Verifier would read criterion 4 as unmet | |
| Amend, and flag it for Thomas | Same, plus a client-facing note about the subscription dependency | |

**Notes:** The client-facing variant was not selected; the subscription dependency is still recorded
internally in the rollback document (CONTEXT D-11), which is within MIG-10's existing scope.

### Mirror storage

| Option | Description | Selected |
|--------|-------------|----------|
| In git, with a ~25 MB size ceiling | Public HTML+images, no personal data; committed beside the other baselines | ✓ |
| Always external, pointer in git | Keeps repo weight flat; artefact can quietly disappear | |
| HTML only, skip assets | Loses the project photos — hardest part to reconstruct | |

---

## Round 2 — additional gray areas

Four were floated; **two dissolved under investigation** and are recorded in CONTEXT `<specifics>` so
they are not re-raised:

- **Legacy GSC verification surviving the cutover** — checked the baseline: both legacy URL-prefix
  properties are `verified (inherited)` from a **DNS-TXT**-verified Domain property, not an HTML file
  on the WordPress root. Verification survives automatically. Converted into a hard constraint (do not
  touch the TXT record) rather than a decision.
- **Old-brand references left in shipped code** — grepped: all eight hits are deliberate (`SITE.email`
  by owner decision, `privacy-beleid` in consequence, four verbatim customer review quotes). Nothing to
  clean up; the repo/Vercel name is already Phase 13.

### 180-day floor tracking

| Option | Description | Selected |
|--------|-------------|----------|
| Extend the weekly cron | Legacy Search Analytics + URL Inspection on the 9 legacy URLs | ✓ |
| Search Analytics only | Misses Google's chosen-canonical signal | |
| Dated note in the rollback doc | The failure mode this repo has already lived | |

### Scheduled live redirect watching

| Option | Description | Selected |
|--------|-------------|----------|
| Fold into the weekly cron | Recommended — catches drift a deploy-triggered probe can't see | |
| Daily for 30 days, then weekly | Tighter through the risky window | |
| Deploy-triggered only | No additional schedule | ✓ |

**Notes:** Chosen against the recommendation. Reconciliation recorded in CONTEXT D-19: because the
weekly cron now inspects the 9 legacy URLs via GSC, drift is not fully uncovered — it surfaces there
with Google's lag rather than as a direct HTTP check.

### Human brand continuity

| Option | Description | Selected |
|--------|-------------|----------|
| Permanent "voorheen TPS Ventilatie" line | Unconditional, zero SEO risk, doubles as an entity signal | ✓ |
| Nothing — silent 301 | Clean default; leaves the returning customer's doubt unanswered | |
| Conditional notice for legacy arrivals | Needs `?from=legacy` on every destination | |

**Notes:** A correction was issued mid-question — a 301 does not reveal its origin, since the
`Referer` on the redirected request is the original referrer (usually Google), not the legacy host.

### GBP website-URL boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Stays in Phase 11 | Link lands correctly in one hop; keeps Phase 10 scoped to DNS/redirects/mail | ✓ |
| Pull the URL edit into Phase 10, alone | Stronger entity signal during consolidation | |
| Pull it in, after the day-28 declaration | Gives Phase 10 a 28-day tail | |

---

## Claude's Discretion

- Module layout and naming for the redirect map inside `lib/seo/*`; `assert-redirects.ts` internals.
- Whether the live one-hop assertion extends `verify-indexation.ts` directly or lands as a sibling.
- Branch vs. `main`; commit granularity.
- The shape and location of the day-28 "declared final" record.
- Mirror tooling (`wget` vs `httrack`) and flags, provided the command is recorded and reproducible.
- How `docs/seo-owner-runbook.md` absorbs the webmail URL, the hosts-override line and the rollback
  procedure — and all Dutch wording.
- The N in "legacy impressions ~0 for N consecutive weeks", and the legacy section's reporting shape.
- Exact Dutch wording of the footer "voorheen TPS Ventilatie" line, for the owner's editorial gate.

## Deferred Ideas

- Full WordPress files + DB backup, off-host and restore-tested — dropped from MIG-01 with risks
  accepted; returns as a standalone task if the subscription is ever at risk.
- Cyberfolks hosting-panel access (sub-account) — not needed for any MIG requirement as now scoped.
- A scheduled live HTTP watch on the 9 redirects — declined at D-19.
- GBP website-URL change — Phase 11, never batched with the name change.
- A conditional "you arrived from the old domain" notice — superseded by the footer line.
- Retiring the redirect map — gated on evidence (D-25), never before the 180-day floor.
- GSC service-account key rotation — outstanding owner action carried from Phase 9.
