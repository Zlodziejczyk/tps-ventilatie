# Phase 9: Measurement Foundation - Pattern Map

**Mapped:** 2026-09-16 (inline — pattern-mapper subagents starve on this mount; every excerpt below was read
from the working tree this session)
**Files analyzed:** 14 new / 5 modified
**Analogs found:** 11 / 14 new files (3 have no in-repo analog and follow RESEARCH.md patterns)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `scripts/verify-measurement.ts` | CLI probe | request-response (HTTP + DNS) | `scripts/verify-indexation.ts` | **exact** |
| `scripts/measure-indexation.ts` | CLI (API client + file I/O) | request-response + file-I/O | `scripts/verify-indexation.ts` (probe shape) + `scripts/assert-seo.ts` (imports `sitemapEntries`, `INDEXABLE_FLOOR`) | role-match |
| `scripts/export-gsc-performance.ts` | CLI (API client + file I/O) | batch export | `scripts/verify-indexation.ts` (arg handling, reporting) | role-match |
| `scripts/gsc/auth.ts` | utility (auth) | request-response | none in repo (server-only secret handling precedent: `app/api/lead/route.ts` reads `GHL_WEBHOOK_URL` server-side) | partial |
| `scripts/gsc/api.ts` | utility (typed fetch wrappers) | request-response | `scripts/verify-indexation.ts` (`fetch` + status handling) | role-match |
| `scripts/gsc/thresholds.ts` | pure module (invariant evaluator) | transform | `lib/seo/invariants.ts` (`checkIndexationInvariants` — pure, returns a violation list, injectable inputs) | **exact** (pattern) |
| `scripts/snapshot-dns.sh` | bash CLI | file-I/O | `scripts/check-radius-literals.sh` (bash guard style) + the 2026-09-16 scratchpad snapshot format | role-match |
| `.github/workflows/measure-indexation.yml` | CI config | event-driven (cron) | none in repo — RESEARCH §Pattern 5 skeleton | no analog |
| `.github/workflows/verify-indexation.yml` | CI config | event-driven (`deployment_status`) | none in repo — RESEARCH §Pattern 5 skeleton | no analog |
| `docs/baseline/2026-09-16/README.md` | docs (manifest + decision record) | — | `docs/seo-owner-runbook.md` (section style, Dutch reading level) | role-match |
| `docs/measurements/README.md` | docs | — | `docs/seo-owner-runbook.md` §6 (failure-vocabulary table) | role-match |
| `docs/baseline/2026-09-16/dns/*.txt` | data (generated) | file-I/O | scratchpad `dns-snapshot-2026-09-16/*.txt` (exact header format) | **exact** |
| `.gitignore` (modify) | config | — | existing `.env*` / `!.env.example` block | exact |
| `.env.example` (modify) | config (documented contract, no values) | — | existing `GHL_WEBHOOK_URL` / `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` entries | exact |
| `package.json` (modify) | config | — | existing `scripts` block (`prebuild` chain untouched) | exact |
| `docs/seo-owner-runbook.md` (modify) | docs | — | itself — §6 is the model for §7 | exact |
| `.planning/REQUIREMENTS.md` (modify, one row) | docs | — | itself | exact |

## Pattern Assignments

### `scripts/verify-measurement.ts` (CLI probe, HTTP + DNS)

**Analog:** `scripts/verify-indexation.ts` (Phase 8, 08-05)

**Header + usage guard pattern** (lines 1–58):
```ts
// Live-output probe — NOT shipped runtime code.
// Intentional console.log/console.error usage and node:assert-free explicit
// reporting (it collects every violation rather than throwing on the first).
//
// Usage:  npx tsx scripts/verify-indexation.ts <https-baseUrl>
…
import { INDEXABLE_FLOOR } from "@/lib/seo/invariants";

const base = process.argv[2]?.replace(/\/$/, "");
if (!base || !/^https?:\/\//.test(base)) {
  console.error("Usage: npx tsx scripts/verify-indexation.ts <https-baseUrl>");
  console.error("  e.g. npx tsx scripts/verify-indexation.ts https://www.tpsklimaattechniek.nl");
  process.exit(2);
}
const violations: string[] = [];
function fail(message: string): void { violations.push(message); }
```

**Collect-everything reporting pattern** (lines 226–247):
```ts
if (violations.length > 0) {
  console.error(`\n✗ Indexation probe FAILED against ${base} — ${violations.length} violation(s):`);
  for (const violation of violations) console.error(`  • ${violation}`);
  process.exit(1);
}
console.log(`✅ Indexation verified on ${base} — …`);
```

**`async main()` (no top-level await under tsx→CJS)** (lines 100, 249–252):
```ts
async function main(): Promise<void> { … }
main().catch((error) => { console.error(`✗ … crashed: ${(error as Error).message}`); process.exit(1); });
```

**Sitemap `<loc>` regex + floor comparison** (lines 121–130) — reuse verbatim for the light sitemap re-check:
```ts
const locs = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (locs.length !== INDEXABLE_FLOOR) { fail(`sitemap lists ${locs.length} URLs, expected exactly ${INDEXABLE_FLOOR}. …`); }
```

**What to add that the analog lacks:** `import { resolveTxt } from "node:dns/promises"` for the TXT assertions;
an explicit "skipped, not passed" print for the token-gated Vercel count step (mirrors the analog's
`platformHeaderSkips` note — a skip is always reported, never silent).

---

### `scripts/measure-indexation.ts` and `scripts/export-gsc-performance.ts` (API-client CLIs)

**Analogs:** `scripts/verify-indexation.ts` (structure above) and `scripts/assert-seo.ts` for the imports that
D-19 mandates:

```ts
// scripts/assert-seo.ts lines 25–29
import { CANONICAL_ORIGIN } from "@/lib/constants";
import { isIndexable, absoluteUrl, sitemapEntries } from "@/lib/seo/policy";
import { checkIndexationInvariants, INDEXABLE_FLOOR } from "@/lib/seo/invariants";
```

`measure-indexation.ts` imports `sitemapEntries()` (the URL list, D-19) **and** `INDEXABLE_FLOOR` (to record
`count-vs-floor`). Note the contrast with the probe: `verify-indexation.ts` deliberately imports **only** the
floor (P8 D-25). D-19 wants the measurement script to ask Google about exactly the pages *we intend* to be
indexed, so importing the policy there is the decision, not a drift — say so in the header comment.

**Header comment convention** (every script in `scripts/` opens with what it is, why it exists, how to run
it, and what it asserts — see `assert-registry.ts` lines 1–14 and `assert-metadata-seam.ts` lines 1–20).

**Bounded concurrency helper** (`verify-indexation.ts` lines 79–94) — **do not reuse** for inspections; run
sequentially with ~150 ms spacing (27 calls; quota 600/min; sequential keeps per-URL failures attributable).

---

### `scripts/gsc/thresholds.ts` (pure invariant evaluator)

**Analog:** `lib/seo/invariants.ts` — the Phase 8 "pure function that RETURNS a violation list, never throws,
inputs injectable so a proof harness can feed perturbed data":

```ts
// lib/seo/invariants.ts lines 62–72, 78–90
export interface IndexationViolation { code: string; url?: string; message: string; }
export function checkIndexationInvariants(opts?: { nodes?: PageNode[]; entries?: { url: string }[]; floor?: number; }): IndexationViolation[] {
  const violations: IndexationViolation[] = [];
  …
  return violations;
}
```

Copy the shape: `export interface MeasurementFlag { code: "below-ramp" | "lost-indexation" | "robots-not-allowed" | "canonical-mismatch"; url?: string; message: string }`
and `export function evaluateReading(prev: Reading | undefined, curr: Reading, today: string): MeasurementFlag[]`.
Named constants with their derivation stated in a comment, the way `INDEXABLE_FLOOR` does (lines 44–56):
`RAMP_ANCHOR = "2026-09-16"` (sitemap submission, D-10) and `RAMP = [{ fromWeek: 2, min: 10 }, { fromWeek: 4, min: 20 }, { fromWeek: 8, min: 25 }]`.

**Proof habit** (`scripts/assert-gate-blocks.ts` — perturb a clone, assert the specific code): the plan's
verify runs `npx tsx -e` with a fabricated previous/current reading and asserts `lost-indexation` names the
URL, `below-ramp` fires at week 4 with 12 PASS, and a clean reading yields `[]`. Content-addressed (find the
URL by string), never index-addressed — the Phase 8 lesson.

---

### `scripts/gsc/auth.ts` and `scripts/gsc/api.ts` (no exact analog)

Follow RESEARCH.md §Pattern 1 / §Code Examples. In-repo precedent for **secret hygiene** is the lead route:
`app/api/lead/route.ts` reads `process.env.GHL_WEBHOOK_URL` server-side and never echoes it; `.env.example`
documents the *name* with a comment and an empty value:

```bash
# .env.example lines 1–5
# GoHighLevel inbound webhook URL — SERVER-ONLY (no NEXT_PUBLIC_ prefix, so the
# secret never reaches the client bundle). Set in Vercel for Preview + Production.
…
GHL_WEBHOOK_URL=
```

Add `GSC_SERVICE_ACCOUNT_JSON=` and `VERCEL_TOKEN=` in the same voice (what it is, where it is set — GitHub
Actions secret / `.env.local` — and that it must never be committed).

---

### `scripts/snapshot-dns.sh` (bash CLI)

**Analogs:** `scripts/check-radius-literals.sh` for the bash-guard house style (`set -euo pipefail`, a one-line
purpose header, non-zero exit on failure), and the **2026-09-16 scratchpad snapshot for the output format**,
which the new script must reproduce byte-compatibly so `diff` works across captures:

```
# DNS snapshot tpsventilatie.nl  taken 2026-09-16T17:58:40Z  queried @ns1.cyberfolks.pl
# registry delegation: ns1.opeiron.com. ns2.opeiron.com. 
# DS:   (empty = DNSSEC off)

tpsventilatie.nl.	14400	IN	SOA	ns1.opeiron.com. hostmaster.tpsventilatie.nl. 2024020301 14400 3600 1209600 3600
tpsventilatie.nl.	14400	IN	NS	ns2.opeiron.com.
…
x._domainkey.tpsventilatie.nl. 14400 IN	TXT	"v=DKIM1; k=rsa; p=…"
_autodiscover._tcp.tpsventilatie.nl. 14400 IN SRV 10 10 443 autodiscover.s161.cyberfolks.pl.
```

(`dig +noall +answer` output, one record set per zone; header lines exactly as above.)

---

### `.github/workflows/*.yml` (no analog — first CI on this repo)

Use the two skeletons in RESEARCH.md §Pattern 5 verbatim as the starting point. House rules carried from the
repo's scripts: a leading comment block stating what the workflow does, why it exists (D-21 / D-22), and what
"red" means; explicit `permissions:`; actions pinned `@v7`; `node-version: 24` (the Vercel project's
`nodeVersion`); `npm ci` with `cache: npm`.

---

### `docs/baseline/2026-09-16/README.md` and `docs/measurements/README.md` (docs)

**Analog:** `docs/seo-owner-runbook.md` §6 — a Dutch, owner-readable section with a **failure-vocabulary
table** ("Melding | Betekenis") and a plain-language rule that a lower number is never the fix:

```markdown
| Melding | Betekenis |
|---|---|
| `sitemap lists N URLs, expected exactly 27` | Er staat een pagina **minder** in de sitemap dan zou moeten … Verlaag het getal NIET … |
```

`docs/measurements/README.md` gets the same table for the four flag codes; the baseline README gets a
manifest table (`bestand | wat | taken | hoe opnieuw te maken`), the D-26 decision + rollback, the D-27 date
rule, and the SERP URL template (D-13).

## Shared Patterns

### Single source of "how many pages" and "which pages"
**Source:** `lib/seo/invariants.ts` (`INDEXABLE_FLOOR`) and `lib/seo/policy.ts` (`sitemapEntries()`)
**Apply to:** `measure-indexation.ts` (both), `verify-measurement.ts` (floor only), `export-gsc-performance.ts`
(the 24-query shortlist is derived from `PAGES` `primaryKeyword`, so `import { PAGES } from "@/lib/services/registry"`).
Never a hand-typed URL or query list.

### "Not shipped runtime code" header + intentional console usage
**Source:** every file in `scripts/` — first comment line.
**Apply to:** all five new scripts.

### Report every violation, then exit non-zero; usage error = exit 2
**Source:** `scripts/verify-indexation.ts`
**Apply to:** `verify-measurement.ts`, `measure-indexation.ts` (exit 1 = flags, exit 2 = usage/auth).

### Anti-drift grep tokens stay out of comments
**Source:** memory `onedrive-execution-constraints` (hit four times in Phase 8) and `assert-seo.ts` lines
16–19 ("Literal forms of those strings are kept out of this file on purpose: the plan's verification greps
for them"). **Apply to:** any comment in the new scripts/workflows — never quote `Vercel → Project` (the
runbook grep), never write the literal `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=` followed by a value.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.github/workflows/measure-indexation.yml` | CI config | cron | no `.github/` exists — RESEARCH §Pattern 5 |
| `.github/workflows/verify-indexation.yml` | CI config | `deployment_status` | same |
| `scripts/gsc/auth.ts` | auth utility | request-response | no OAuth code in the repo — RESEARCH §Pattern 1 (Google's documented REST flow) |

## Metadata

**Analog search scope:** `scripts/`, `lib/seo/`, `lib/services/registry.ts`, `app/api/lead/`, `docs/`,
`.env.example`, `.gitignore`, `package.json`, plus the 2026-09-16 scratchpad snapshot files.
**Files scanned:** 19
**Pattern extraction date:** 2026-09-16
