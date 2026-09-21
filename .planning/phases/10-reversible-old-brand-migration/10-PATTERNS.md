# Phase 10: Reversible Old-Brand Migration - Pattern Map

**Mapped:** 2026-09-21
**Files analyzed:** 7 new / 12 modified (+2 expected-no-change, confirmed)
**Analogs found:** 17 / 19 (2 have no in-repo analog and follow RESEARCH.md patterns)

> **Read note.** This repo is on a OneDrive mount. `components/Footer.tsx`, `.planning/codebase/STACK.md`
> and `.planning/codebase/ARCHITECTURE.md` stalled on every shell read this session; `Footer.tsx` and
> `next.config.ts` were recovered verbatim via `gh api repos/Zlodziejczyk/tps-ventilatie/contents/<path>`.
> Everything else below was read from the working tree. Line numbers for `Footer.tsx` are derived from the
> GitHub copy (112 lines) — treat them as ±1 and locate by the quoted string, not by the number.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `lib/seo/redirects.ts` | **new** — pure module (typed data + emitters + invariant checker) | transform | `lib/seo/policy.ts` (module shape) + `lib/seo/invariants.ts` (pure violation-list checker, named constants) | **exact** (pattern) |
| `scripts/assert-redirects.ts` | **new** — build-time CLI guard (`prebuild` #9) | transform (no network, by decision) | `scripts/assert-seo.ts` | **exact** |
| `scripts/verify-redirects.ts` | **new** — live CLI probe | request-response (HTTP) | `scripts/verify-indexation.ts` | **exact** |
| `scripts/assert-gate-blocks.ts` (modify) | build-time CLI negative proof | transform | itself — the `(P1)`–`(P5)` block | **exact** |
| `next.config.ts` (modify) | config | — | itself (13 lines, reproduced below) | exact |
| `package.json` (modify) | config | — | its own `prebuild` chain (line 7) | exact |
| `.github/workflows/verify-indexation.yml` (modify) | CI config | event-driven (`deployment_status`) | itself — the "Probe production" step | exact |
| `scripts/measure-indexation.ts` (modify — D-25) | CLI (API client + file I/O) | request-response + file-I/O | itself — steps (3) and (4) | exact |
| `scripts/gsc/thresholds.ts` (modify — D-25) | pure evaluator | transform | itself — `FlagCode` union + `evaluateReading()` | exact |
| `components/Footer.tsx` (modify — D-26) | component (Server Component) | — | itself — the bottom bar | exact |
| `docs/seo-owner-runbook.md` (modify — §8/§9/§10) | docs (Dutch, owner-facing) | — | itself — §6 (failure-vocabulary table) and §7 | exact |
| `docs/measurements/README.md` (modify — 2 flag rows) | docs (Dutch) | — | itself — the flag table (lines 31–42) | exact |
| `docs/baseline/<date>/legacy-site-mirror/CAPTURE.md` | **new** — docs (reproducible-command record) | file-I/O | `docs/baseline/2026-09-16/README.md` §2 manifest, `opnieuw maken` column | role-match |
| `docs/baseline/<date>/mail/*.eml` | **new** — data (evidence artefact) | file-I/O | baseline manifest rows for `gsc/*.json` / `gbp/*.jpg` | role-match |
| `docs/baseline/<cutover-date>/migration-final.md` | **new** — docs (dated decision record) | — | `docs/baseline/2026-09-16/README.md` §1 "Doel en datumregel" | role-match |
| `docs/baseline/<cutover-date>/dns/*.txt` | **new** (generated) | file-I/O | `scripts/snapshot-dns.sh` → `docs/baseline/2026-09-16/dns/*.txt` | **exact** (same script) |
| `.planning/REQUIREMENTS.md` (modify — MIG-01, line 32) | docs | — | the `Superseded on 2026-09-16 by Phase 9 D-26: …` Out-of-Scope row (line 98) | exact (voice) |
| `.planning/ROADMAP.md` (modify — criterion 4 line 109, hard gate line 113) | docs | — | itself | exact |
| `.planning/PROJECT.md` (modify — §Context line 109) | docs | — | itself; line 116 is already correct and is the voice to copy | exact |
| `CLAUDE.md` (modify — stale static-export claims) | docs (**GSD tool-generated**) | — | **none** — see §No Analog Found | no analog |
| `scripts/gsc/api.ts` | utility | request-response | **no change expected** — verified below | n/a |
| `scripts/export-gsc-performance.ts` | CLI | batch export | **no change expected** — verified below | n/a |
| `.github/workflows/measure-indexation.yml` | CI config | cron | **no change expected** — verified below | n/a |

## Pattern Assignments

### `lib/seo/redirects.ts` (new — pure module, transform)

**Analogs:** `lib/seo/policy.ts` for the module shape, `lib/seo/invariants.ts` for the checker shape.

**Module header + no-barrel exception + import discipline** (`lib/seo/policy.ts` lines 1–8, 22–24) — copy
this header voice: what the module is, the single-source claim, the no-barrel exemption, "pure functions
only — no rendering, no I/O, server-safe":

```ts
// SEO INDEXING POLICY — the single source that decides which pages are indexable
// and which appear in the sitemap (D-02). …
//
// NO-BARREL EXCEPTION (D-05): the `lib/seo/*` family is a justified module group
// (same rationale as `registry.ts`), not a generic re-export barrel. Pure functions
// only — no rendering, no I/O, server-safe (never a client module).

import { CANONICAL_ORIGIN } from "@/lib/constants";
```

**The one place a path is joined to the origin** (`lib/seo/policy.ts` lines 31–36) — `redirects.ts` is
about to become the *second* such place, so say so explicitly in its header and point at this one:

```ts
// Absolute URL from a canonical path. Root keeps its slash to match the served
// origin; non-root paths already carry no trailing slash (urlFor / trailingSlash:false,
// P1 D-03). The ONLY place a path is joined to CANONICAL_ORIGIN.
export function absoluteUrl(path: string): string {
  return path === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${path}`;
}
```

⚠️ **Divergence the planner must state in the file, not discover in review.** RESEARCH §Pattern 1 emits
`destination: \`${CANONICAL_ORIGIN}${to === "/" ? "" : to}\`` — a *bare origin* for root, whereas
`absoluteUrl("/")` returns the origin *with* its slash. The two disagree only on `/`, and they disagree on
purpose. Either reuse `absoluteUrl()` and let root carry its slash, or keep the local join and write one
comment saying why — but do not leave two silently different origin-joins in `lib/seo/*`.
Assertion #4 (destination ∈ `sitemapEntries()`) must then compare root **by resolved URL**, not by string
(RESEARCH §Pattern 1 "Note on `/` → `/`").

**Named constant carrying its derivation + the anti-bump failure message** (`lib/seo/invariants.ts`
lines 31–44, 126–140) — this is the house exemplar the CONTEXT calls out. `LEGACY_HOST_PATTERN` and the
9-entry map are the Phase 10 equivalents and get the same treatment:

```ts
// THE definition of "complete" for this site, in exactly one place.
//
// Derivation: 28 routable nodes in the registry minus privacy-beleid, the single
// page deliberately kept out of the index = 27.
// …
// Read the below-floor violation message before changing this number.
export const INDEXABLE_FLOOR = 27;
```

```ts
      violations.push({
        code: "below-floor",
        message:
          `Only ${indexableCount} indexable pages, floor is ${opts.floor}. A DROP MEANS A PAGE WAS DE-INDEXED — ` +
          `find out what went dark before you touch this number. Lower the floor ONLY when a page was deliberately ` +
          `retired, and never raise or lower it just to make the build pass (that is what commit 82d897b did, and it ` +
          `kept the entire service surface hidden from Google for months).`,
      });
```

**🔑 THE LOAD-BEARING PATTERN CALL — the checks must be a pure function, not inline `assert`s.**
`lib/seo/invariants.ts` lines 1–24 exist because the previous gate asserted at module top-level and could
therefore never be observed failing. RESEARCH's own test map for MIG-06 already assumes the fix
(*"`npx tsx -e` feeding perturbed maps into the pure checker"*), but §Pattern 2 lists the 10 assertions as
if they live in the script. **Resolve it the invariants.ts way:** put
`checkRedirectInvariants(opts?): RedirectViolation[]` in `lib/seo/redirects.ts` (or a
`lib/seo/redirect-invariants.ts` sibling), with every input injectable; keep `scripts/assert-redirects.ts`
a thin CLI over it. Copy this signature verbatim, including the injectable-inputs comment
(`lib/seo/invariants.ts` lines 46–72):

```ts
// One machine-readable failure. `code` is what callers match on (matching on the
// message would be a snapshot assertion by another name); `url` names the offending
// page when there is one; `message` is what a human reads in a red build log.
export interface IndexationViolation { code: string; url?: string; message: string; }

// Check the full indexation contract and return EVERY violation found (never
// early-return — a red build should report all the damage at once…).
// All inputs are injectable so the proof harness can feed perturbed data:
export function checkIndexationInvariants(opts?: {
  nodes?: PageNode[];
  entries?: { url: string }[];
  floor?: number;
}): IndexationViolation[] {
  const violations: IndexationViolation[] = [];
  …
  return violations;
}
```

For Phase 10 that becomes, roughly:
`checkRedirectInvariants(opts?: { map?: readonly LegacyRedirect[]; emitted?: unknown[]; entries?: { url: string }[]; hostPattern?: string })`.
Assertions **#8 (catch-all is host-gated)**, **#9 (`LEGACY_HOST_PATTERN` anchoring)** and **#10 (normalisation
rule is last)** are the three the Wave-0 gap list demands be *watched to fire* — they are un-perturbable
unless `emitted` and `hostPattern` are injectable.

**Data-registry conventions** already in force and inherited by the map: `readonly …[]` + `as const`,
SCREAMING_SNAKE module-level data (`SITE`, `NAV_LINKS`, `PAGES`, `RAMP`), `interface` for object shapes and
`type` for string unions (`confidence: "certain" | "judgement"`), doc comments on each field.

---

### `scripts/assert-redirects.ts` (new — build-time CLI guard, `prebuild` #9)

**Analog:** `scripts/assert-seo.ts` — the guard it slots in directly after.

**Header block — copy the four-part shape** (lines 1–21): *what it is / what runtime / where it is wired /
what it asserts*, and the grep-token warning that Phase 8 learned the hard way:

```ts
// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node built-ins suffice).
//
// Wired into `npm run prebuild` — build-blocking on every Vercel build (D-01).
// Run standalone:  npx tsx scripts/assert-seo.ts
// … (Literal forms of those strings are kept out of this file on purpose: the
// plan's verification greps for them, and a comment quoting one would
// false-positive.)
```

**Imports** (lines 23–29) — the exact set `assert-redirects.ts` needs is a subset plus the new module:

```ts
import assert from "node:assert/strict";
import { CANONICAL_ORIGIN } from "@/lib/constants";
import { isIndexable, absoluteUrl, sitemapEntries } from "@/lib/seo/policy";
import { checkIndexationInvariants, INDEXABLE_FLOOR } from "@/lib/seo/invariants";
```

**Print every violation, THEN assert** (lines 31–47) — the exact shape for the pure-checker call:

```ts
const violations = checkIndexationInvariants({ floor: INDEXABLE_FLOOR });
if (violations.length > 0) {
  console.error(`✗ Indexation invariant broken — ${violations.length} violation(s):`);
  for (const violation of violations) {
    console.error(`  [${violation.code}]${violation.url ? ` ${violation.url}` : ""} ${violation.message}`);
  }
}
assert.equal(
  violations.length,
  0,
  "sitemap membership must equal isIndexable(node) for every governed node (see the violations above)",
);
```

**Floors, not equalities; vacuous-pass guard** (lines 72–100) — reuse for "the map has 9 explicit entries":
assert a *floor* or assert the emitted array's **shape/order**, never `length === 10`, and guard the loops:

```ts
assert.equal(allPillars.length, 4,
  `pillars() must return 4 pillars, got ${allPillars.length} — if this is 0 the loops below would pass vacuously`);
…
assert.ok(subServiceCount >= 17,
  `expected at least 17 sub-services, found ${subServiceCount} — a sub-service page has left the routable surface.`);
```

**Single-line success summary that names every fact proven** (lines 147–152) — the summary is the artifact
a reader scans in a green build log; match its density:

```ts
console.log(
  `✅ SEO policy OK — indexation invariant holds (sitemap membership ⇔ isIndexable, ${sitemapEntries().length} entries ` +
    `vs floor ${INDEXABLE_FLOOR}, all absolute on the canonical origin, none orphaned); …`,
);
```

**Wiring** — `package.json` line 7, append as guard #9, before the bash guard:

```json
"prebuild": "tsx scripts/validate-taxonomy.ts && tsx scripts/assert-registry.ts && tsx scripts/assert-site-shape.ts && tsx scripts/assert-no-forbidden-claims.ts && tsx scripts/assert-gate-blocks.ts && tsx scripts/assert-metadata-seam.ts && tsx scripts/assert-seo.ts && bash scripts/check-radius-literals.sh"
```

---

### `scripts/assert-gate-blocks.ts` (modify — the negative proof for assertions #8/#9/#10)

**Analog:** itself. The `(P1)`–`(P5)` block is the exact template; add `(R1)`–`(Rn)` alongside it.

**The lesson the file encodes** (lines 14–24) — *address the perturbation by predicate and by the property
under test, never by array position* — applies directly: find the catch-all by `source === "/:path*"`, never
by `emitted.at(-2)`.

**Perturbation + specific-code assertion + the control** (lines 136–152, 195–203):

```ts
const p1 = checkIndexationInvariants({ nodes: flipNodes, entries: realEntries });
assert.ok(
  p1.some((v) => v.code === "sitemap-without-index" || v.code === "index-without-sitemap"),
  `P1: moving a pillar across the indexability line must break the relation, got: ${codes(p1)}`,
);
…
// (P5) The control. Unperturbed reality must yield exactly zero violations —
//      without this, every proof above could be passing because the checker is
//      simply always angry.
const p5 = checkIndexationInvariants({ floor: INDEXABLE_FLOOR });
assert.equal(p5.length, 0, `P5: the real surface must yield zero violations, got: ${codes(p5)}`);
```

Helper to copy verbatim (lines 38–40): `function codes(violations: { code: string }[]): string`.

**Minimum perturbation set for this phase:** strip `has` from the catch-all (#8); replace
`LEGACY_HOST_PATTERN` with `"tpsventilatie.nl"` — the plausible "simplification" — and assert it fails
because it no longer matches `www.…` (#9); move the `/:path+/` rule off the last position (#10); duplicate a
`from` (#1); point a `to` at another entry's `from` (#2); drop `why` from the dakventilator entry (#6); add
a `confidence` key to an emitted object (#7). Plus the unperturbed control.

---

### `scripts/verify-redirects.ts` (new — live probe, request-response)

**Analog:** `scripts/verify-indexation.ts`. RESEARCH §"Recommended structure" fixes it as a **sibling**, not
an extension — and `verify-indexation.ts` lines 45–47 already say it was built with this arrival in mind.

**Header + usage guard + collect-everything reporter** (lines 1–12, 49–66):

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

**Redirect assertion, message shape included** (lines 161–171) — `verify-redirects.ts` inverts the
expectation (301 required, 200 forbidden at hop 1) but keeps the message anatomy `path — expected X, got Y → location. <why it matters>`:

```ts
    if (res.status !== 200) {
      const location = res.headers.get("location");
      fail(
        `${path} — expected a direct 200, got ${res.status}` +
          (location ? ` → ${location}` : "") +
          ". A sitemap URL must resolve without a redirect.",
      );
      return;
    }
```

**`async main()` — no top-level await under tsx→CJS** (lines 102–104, 248–251). Copy verbatim:

```ts
// The sibling build-time scripts are transpiled to CJS, where top-level await is
// unavailable — so the probe body lives in an async main() invoked at the bottom.
async function main(): Promise<void> { … }

main().catch((error) => {
  console.error(`✗ Indexation probe crashed: ${(error as Error).message}`);
  process.exit(1);
});
```

**Report block** (lines 226–245) — and note the *skip is always printed, never silent*. That is the exact
precedent for D-18's "record the `http`→`https` 308, don't hide it":

```ts
  if (violations.length > 0) {
    console.error(`\n✗ Indexation probe FAILED against ${base} — ${violations.length} violation(s):`);
    for (const violation of violations) console.error(`  • ${violation}`);
    process.exit(1);
  }
  console.log(`✅ Indexation verified on ${base} — …`);
  if (platformHeaderSkips > 0) {
    console.log(
      `   note: ${platformHeaderSkips} Vercel preview X-Robots-Tag: noindex header(s) ignored — ` +
        `platform behaviour on *.vercel.app, not application output. The header IS enforced on production.`,
    );
  }
```

**Named host-class predicate** (line 61) — Mode A/B selection copies this idiom rather than inlining a regex:

```ts
// A *.vercel.app host is a preview/deployment URL, never the production domain.
const isVercelDeploymentHost = /\.vercel\.app$/i.test(new URL(base).host);
```

**What the analog has that this one must NOT copy:** `mapWithConcurrency` (lines 85–100). 22 requests × 2
sequential hops, and a per-source failure must be attributable — the P9 precedent for exactly this call is
`INSPECT_SPACING_MS` in `measure-indexation.ts` line 41 (*"sequential keeps per-URL failures attributable"*).

**Argument shape** — the analog takes one positional arg; RESEARCH §Pattern 3 wants `--via <origin>`. Copy
the flag parser from `scripts/measure-indexation.ts` lines 47–67 (supports both `--flag value` and
`--flag=value`, unknown arg → usage + `exit 2`).

---

### `next.config.ts` (modify — `redirects()`, `skipTrailingSlashRedirect`)

**Analog:** itself. Current file **in full** (recovered via `gh api`; do not attempt a shell read):

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hybrid hosting (Phase 5, QA-01): default Next.js mode — static pages
  // prerender, route handlers run as serverless functions, Image Optimization on.
  trailingSlash: false,
  images: {
    // AVIF must be opted in explicitly — the Next default serves WebP only.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

House convention visible here: **every non-obvious config key carries a one-line comment stating the
non-default behaviour and why**. `skipTrailingSlashRedirect: true` is the highest-stakes such key in the
repo — RESEARCH §Pattern 1 already supplies the comment; ship it verbatim, including the last sentence
(*"Removing this line silently reintroduces the second hop; scripts/verify-redirects.ts is what catches that"*).
The file imports nothing today; it will import exactly three emitters from `@/lib/seo/redirects` and nothing
else (the `@/*` → repo-root alias is already in use everywhere).

---

### `.github/workflows/verify-indexation.yml` (modify — add the redirect probe step)

**Analog:** itself. The header block states *what it does / what red means / why the target is derived*
(lines 1–17) — extend it in the same voice for the third question, and keep the "two probes, two questions"
sentence honest by making it three.

**The step to clone** (lines 38–48) — note the target is derived at run time from `lib/constants.ts`, never
typed in YAML, and the 3× retry for alias propagation:

```yaml
      - name: Probe production (what do we serve?)
        shell: bash
        run: |
          URL=$(npx tsx -e "import { CANONICAL_ORIGIN } from '@/lib/constants'; console.log(CANONICAL_ORIGIN)")
          echo "probing $URL"
          for i in 1 2 3; do
            npx tsx scripts/verify-indexation.ts "$URL" 2>&1 | tee probe-output.txt && exit 0
            echo "attempt $i failed — waiting 30 s for alias propagation"
            sleep 30
          done
          exit 1
```

**Job guard and runner block** (lines 27–37) — unchanged; the new step joins the same job:

```yaml
    if: github.event.deployment_status.state == 'success' && (github.event.deployment.environment == 'Production' || github.event.deployment_status.environment == 'Production')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
```

**Alert path** (lines 49–62) — one issue, label `indexation-alert`, `--body-file`. If the redirect step
writes its own output file, either `tee` into the same `probe-output.txt` or `cat` both into the body; do
**not** introduce a second label (RESEARCH: *"one workflow and one alert path"*).

⚠️ **Sequencing trap for the planner.** This step will be **red from the moment it merges until the DNS flip**
if it runs in Mode B (it probes `https://(www.)tpsventilatie.nl`, which still resolves to WordPress). Execution
Sequence puts the wiring at step 5 and the flip at step 17. Either gate the step on the cutover (an input, a
committed date, or a `continue-on-error` window) or land the step in the same commit as the flip — but decide
it explicitly. A step that is *expected* to be red is how the three build guards rotted for weeks (D-25).

---

### `scripts/measure-indexation.ts` + `scripts/gsc/thresholds.ts` (modify — D-25 legacy section)

**Analogs:** both files, themselves.

**`FlagCode` union + flag shape** (`thresholds.ts` lines 31–43) — add `"legacy-canonical-not-moved"` and
`"legacy-traffic-zero"` here:

```ts
export type FlagCode =
  | "below-ramp"
  | "lost-indexation"
  | "robots-not-allowed"
  | "canonical-mismatch"
  | "count-vs-floor"
  | "simulated-breach";

export interface MeasurementFlag { code: FlagCode; url?: string; message: string; }
```

**Anchored, derivation-stated constants + a pure week counter** (`thresholds.ts` lines 45–81) — D-25's
"≥ 8 weeks after cutover" and "N = 4 consecutive weeks" get exactly this treatment. `weeksSince()` and
`rungInForce()` are reusable as-is against a new `CUTOVER_ANCHOR`:

```ts
// The date the sitemap was submitted AND processed by Google at 27 URLs (D-10) —
// the moment Google was told the pages exist. "Week N" everywhere below means N
// weeks after this date.
export const RAMP_ANCHOR = "2026-09-16";

// D-20's calendar ramp, as FLOORS: … A shortfall does not
// mean the rung is wrong; it means pages are stuck — find which ones.
export const RAMP: readonly { fromWeek: number; min: number }[] = [ … ];

export function weeksSince(anchorIso: string, todayIso: string): number { … }
export function rungInForce(todayIso: string): { fromWeek: number; min: number } | undefined { … }
```

**Flag emission — append, never early-return; match by URL string, never by position** (`thresholds.ts`
lines 83–139). The `canonical-mismatch` branch is the direct template for `legacy-canonical-not-moved`
(inverted: a legacy URL is *healthy* once `googleCanonical` has moved off `tpsventilatie.nl`):

```ts
    if (u.googleCanonical && u.googleCanonical !== u.url) {
      flags.push({
        code: "canonical-mismatch",
        url: u.url,
        message: `${u.url} — Google chose canonical ${u.googleCanonical}; ours is the URL itself. Google is folding this page into another`,
      });
    }
```

**`Reading` is extended optionally** (`thresholds.ts` lines 22–29) — RESEARCH's `legacy?: { … }` block keeps
every committed 2026-09 reading parseable; that is why it must be optional:

```ts
export interface Reading {
  taken: string; property: string; floor: number;
  urls: UrlReading[];
  sitemap?: { submitted: number; errors: number; lastDownloaded?: string };
  analytics?: { visits7d: number };
}
```

**The "a transient failure must not discard a completed measurement" rule** (`measure-indexation.ts`
lines 140–154) — this is the commit `61de3b7` lesson and it governs the entire legacy block: the legacy
section is *additive evidence*, so a legacy API failure records a gap and continues. Copy the shape:

```ts
  // (4) Google's record of the sitemap (D-10). NEVER fatal: the 27 inspections above are
  // the expensive, perishable part of this run. A transient 5xx here used to crash main(),
  // discarding them AND raising a false indexation alert … Record the gap in the reading instead.
  let sitemap: Reading["sitemap"];
  try { … } catch (error) {
    console.error(`note: sitemaps.get failed (${(error as Error).message}) — reading written without the sitemap block`);
  }
```

**Sequential inspection with spacing, per-URL error recorded, run continues** (lines 116–138) — reuse
verbatim for the 9 legacy URLs, including `INSPECT_SPACING_MS = 150` (line 41) and the all-failed →
`exit 2` guard with its "not a Full user on this property" hint.

**Reporting block** (lines 189–204) — the legacy section renders as its own table under a
`— legacy (tpsventilatie.nl) —` header, so the issue body never conflates the two domains:

```ts
  console.log("| url | verdict | coverageState | lastCrawlTime | canonical ok? |");
  console.log("|---|---|---|---|---|");
  for (const u of readings) { … }
  for (const flag of flags) console.log(`FLAG [${flag.code}]${flag.url ? ` ${flag.url}` : ""} — ${flag.message}`);
```

**✅ Confirmed no-change files** (read this session; do not open a plan task for them):
- `scripts/gsc/api.ts` — `PROPERTY_LEGACY` (line 25), `inspectUrl()` (107–124) and `querySearchAnalytics()`
  with its full `SearchAnalyticsRequest` type incl. `aggregationType: "byProperty"` (198–235) **all already
  exist**. The D-25 extension is a caller change only.
- `scripts/export-gsc-performance.ts` — already defaults to **both** properties (line 89:
  `const selected = properties.length > 0 ? properties : [PROPERTY_NEW, PROPERTY_LEGACY];`) with a
  `legacyStartDate()` helper (line 92). It is the reference for the legacy Search-Analytics call shape, not
  a file to modify.
- `.github/workflows/measure-indexation.yml` — it runs `npx tsx scripts/measure-indexation.ts` and pipes the
  output to the issue body (line 67). The legacy section rides that unchanged. Its header block
  (lines 10–14) lists the flag vocabulary, so **only the comment needs the two new codes appended**.

---

### `components/Footer.tsx` (modify — D-26 "voorheen TPS Ventilatie")

**Analog:** itself. It is a **Server Component with no `"use client"`** (imports at lines 1–4: `Link`,
`Image`, `SITE`, `pillars`/`urlFor`) — D-26 is unconditional precisely so it stays that way.

**The insertion point — the bottom bar** (≈ lines 101–110 of 112; locate by the comment string):

```tsx
      {/* Bottom bar — separated by tonal layering (a surface-token step + spacing),
          not a 1px hairline, per the Atmospheric-Clarity design system. */}
      <div className="max-w-7xl mx-auto mt-16 rounded-2xl bg-surface-container px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
        <div>&copy; {new Date().getFullYear()} {SITE.name}. {SITE.tagline}.</div>
        <div className="flex gap-6">
          <span>KvK: {SITE.kvk}</span>
          <span>BTW: {SITE.btw}</span>
        </div>
      </div>
```


Three conventions this block encodes, all of which the new line must honour: the bar is already
`text-sm text-on-surface-variant` (RESEARCH §Pattern 10's styling requirement is satisfied by placing the
line inside it — **no new colour classes, no border**); brand tokens come from `SITE`
(`{SITE.name}`, `{SITE.tagline}`) — so the new-name half of the sentence should read from `SITE.name`
rather than re-typing "TPS klimaattechniek"; the separation comment explicitly names the no-1px-hairline
guardrail, so a new `<div>` must not reintroduce one.

The old brand string itself has no constant. `lib/constants.ts` line 51 is `CANONICAL_ORIGIN`; there is no
`SITE.formerName`. Adding one is a reasonable half-measure — but note `lib/reviews.ts` is **do-not-edit**
(four quotes contain "TPS Ventilatie" as verbatim customer words), so a repo-wide grep for the old brand
will always return hits and must not be used as a gate.

---

### `docs/seo-owner-runbook.md` §8 / §9 / §10 (modify — Dutch, owner-facing)

**Analog:** §6 (lines 107–148) — the densest owner section and the model for all three additions.

**Section anatomy:** `## N. <Title>` → 2–3 sentences of context → `**Draaien:**` + a fenced command →
a numbered list of what it checks → `**Wanneer draaien:**` → a **failure-vocabulary table**:

```markdown
| Melding | Betekenis |
|---|---|
| `sitemap lists N URLs, expected exactly 27` | Er staat een pagina **minder** in de sitemap dan zou moeten — er is dus een pagina uit de index gevallen. **Zoek uit wélke pagina en waarom.** Verlaag het getal NIET om de melding weg te krijgen; dat is precies hoe de vorige fout maandenlang onopgemerkt bleef. |
```

**Blockquote for platform caveats** (§6, after the table) — the shape for D-21's dated certificate caveat
(`2026-10-29`) and for "Invalid Configuration is expected":

```markdown
> Op een Vercel *preview*-URL (`*.vercel.app`) zet Vercel zelf een
> `X-Robots-Tag: noindex` op álle pagina's. Dat is normaal — het script meldt dat het
> die header daar overslaat en controleert hem alleen op de productie-URL.
```

**Bulleted operational section** (§7, lines 149–173) — the model for §10 (rollback): each bullet opens with
a bolded noun phrase (`**60-dagenregel.**`, `**Sleutel roteren.**`, `**Twee vragen, twee scripts.**`) and
closes with the concrete command or the concrete consequence. D-11's silent dependency — *the old WordPress
install lives exactly as long as the cyberfolks subscription, and that subscription exists only for
`info@tpsventilatie.nl`* — is one such bullet.

**Closing block** (lines 174–177): `### Samenvatting — wat hangt waarvan af` with one bullet per dependency.
Three new dependencies belong there: webmail ↔ `s161`, WP-admin ↔ the hosts line, rollback ↔ TTL 300 until day 28.

---

### `docs/baseline/<date>/…` artefacts (new — mirror, mail headers, migration-final)

**Analog:** `docs/baseline/2026-09-16/README.md`.

**§1 "Doel en datumregel"** (lines 15–30) sets the rule the new directory inherits: the directory name is the
date of *first* capture; later artefacts carry their own `taken:` and the directory is **not renamed**; and
the reason it is in `docs/` not `.planning/` is stated (*"iemand tijdens een incident om 3 uur 's nachts moet
hier kunnen kijken — planning-mappen worden bij milestone-afsluiting gearchiveerd"*). `migration-final.md`
lands here for that same reason.

**§2 manifest — five columns, one row per file** (lines 32–37). Every new artefact (mirror, `.eml`, DNS diff,
probe output, `migration-final.md`) gets a row. The `opnieuw maken` column is where D-28's "reproducible from
a recorded command" requirement is discharged:

```markdown
| bestand | wat bewijst het | taken (UTC) | bron | opnieuw maken |
|---|---|---|---|---|
| `dns/tpsventilatie.nl-2026-09-16T203208Z.txt` | De legacy-zone **na** de wissel … | 2026-09-16T20:32:08Z | `scripts/snapshot-dns.sh` | `bash scripts/snapshot-dns.sh tpsventilatie.nl --out docs/baseline/<datum>/dns` |
| `dns/…-pre-switch-…txt` | … | … | `dig @ns1.cyberfolks.pl`, met de hand | **niet** opnieuw te maken — … dit is het enige bewijs van de zone-vóór-de-wissel |
```

The second row is the precedent for a **not-reproducible** artefact — which is exactly what the legacy mirror
becomes the moment the cutover happens. Say so in its row, in that voice.

**Privacy line** (README lines 7–8) — *"Geen wachtwoorden, tokens of sleutels in deze map"*, with an explicit
carve-out for what is public-by-nature. The mirror (D-28: public HTML/images, no personal data) and the mail
headers (D-23: redact nothing except third-party addresses) each need one sentence in that register.

**DNS re-snapshot** — `scripts/snapshot-dns.sh` is re-run, never modified. Its header (lines 1–30) says why:
*"This is deliberately byte-compatible with the hand-taken 2026-09-16 snapshot files … Do not 'tidy' the
format."* RESEARCH §Pattern 8 notes the script queries only the first authoritative NS (`head -1`) while D-07
needs all three — the three-NS loop is a **separate command in the plan**, not an edit to this script.

---

### `.planning/REQUIREMENTS.md`, `ROADMAP.md`, `PROJECT.md` (modify — the D-01/D-03 amendments)

**Analog for the amendment voice:** `.planning/REQUIREMENTS.md` line 98 — the one existing precedent for
superseding a milestone artefact in place. It states *when*, *by which decision*, *what actually happened*,
and *where the recipe lives* — all in one row, with no footnote:

```markdown
| Moving legacy DNS nameservers | Superseded on 2026-09-16 by Phase 9 D-26: the tpsventilatie.nl delegation moved from cyberfolks to dd24 with a record-for-record mirrored zone (33/33 verified), mail untouched; rollback recipe in `docs/baseline/2026-09-16/README.md` |
```

**Exact edit targets, confirmed this session:**

| File | Line | Current text (abridged) |
|---|---|---|
| `.planning/REQUIREMENTS.md` | 32 | `- [ ] **MIG-01**: A full WordPress backup (files + database) is stored off-host and its restorability confirmed` |
| `.planning/REQUIREMENTS.md` | 122 | `\| MIG-01 \| Phase 10 \| Pending \|` (traceability table — status only) |
| `.planning/ROADMAP.md` | 109 | `4. WordPress backup stored off-host and restore-tested; WP install left intact` |
| `.planning/ROADMAP.md` | 113 | `**Hard gates:** the pre-flight checklist (MIG-01…04) completes before any DNS change.` |
| `.planning/PROJECT.md` | 109 | `- **Access held for v1.1:** admin on the TPS Google Business Profile, and on the old site's hosting. …` |

**PROJECT.md line 116 is already correct** and is the voice to copy for line 109 — a parenthetical that states
the real mechanism rather than a label:
`Hosting is **hybrid** (dropped \`output: "export"\` for \`/api/lead\`; ~22 pages stay SSG; \`trailingSlash: false\` + apex canonical preserved).`

Requirement checkboxes use `- [ ] **ID**: <one sentence, present tense, externally checkable>` — keep that
shape for the rewritten MIG-01 so the verifier can still read it as a criterion, and carry the *reasoning*
(D-02's "the backup does not protect reversibility") in the sentence itself, not in a footnote.

## Shared Patterns

### Destinations derive from `CANONICAL_ORIGIN`; membership derives from `sitemapEntries()`
**Source:** `lib/constants.ts` line 51 (with its "This is the ONLY place the origin string is written"
comment) and `lib/seo/policy.ts` lines 55–59.
**Apply to:** `lib/seo/redirects.ts` (every destination), `scripts/assert-redirects.ts` (assertions #3 and
#4), `scripts/verify-redirects.ts` (the expected `location` value). Never a hand-typed
`https://www.tpsklimaattechniek.nl`, in code *or* in a test expectation.

### "NOT shipped runtime code" header + intentional console usage
**Source:** first comment line of every file in `scripts/`.
**Apply to:** `assert-redirects.ts`, `verify-redirects.ts`. Four parts: what it is, what runtime, where it is
wired, what it asserts — plus `// Run standalone:  npx tsx scripts/<name>.ts`.

### Report every violation, then exit non-zero; usage/auth error = exit 2
**Source:** `scripts/verify-indexation.ts` lines 53–66, 226–245; `scripts/measure-indexation.ts` line 6
(`exit 0 = clean · exit 1 = one or more flags · exit 2 = usage/auth failure`).
**Apply to:** `verify-redirects.ts` (exit 1 = violations, exit 2 = usage / "legacy host not attached").

### Relations and named floors, never snapshots — and the message carries the anti-bump warning
**Source:** `lib/seo/invariants.ts` lines 17–20 and 126–140; `scripts/assert-seo.ts` lines 95–100.
**Apply to:** all 10 structural assertions. Assertion #9 in particular must reproduce Next's anchoring
(`new RegExp(\`^${p}$\`)`) rather than string-comparing the pattern — a relation, not a snapshot.

### A gate that has never been observed failing has not been shown to work
**Source:** `lib/seo/invariants.ts` lines 3–15; `scripts/assert-gate-blocks.ts` lines 14–24.
**Apply to:** assertions #8, #9, #10 at minimum, each perturbed **by predicate**, each asserting its specific
violation code, plus an unperturbed control.

### Two probes, two questions — now three
**Source:** `.github/workflows/verify-indexation.yml` lines 3–9 and `scripts/measure-indexation.ts`
lines 21–23 (*"do not merge them"*).
**Apply to:** `verify-redirects.ts` stays a sibling of `verify-indexation.ts` (different host, different
failure meaning, retired on a different schedule) while sharing one workflow and one `indexation-alert` issue.

### Owner-facing docs are Dutch, numbered, and carry a failure-vocabulary table
**Source:** `docs/seo-owner-runbook.md` §6; `docs/measurements/README.md` lines 26–42.
**Apply to:** runbook §8/§9/§10 and the two new flag rows. Every table ends with the house rule, restated:
*"Verlaag nooit een drempel om groen te krijgen — zoek uit welke pagina vastzit."*

### Anti-drift grep tokens stay out of comments
**Source:** `scripts/assert-seo.ts` lines 16–18.
**Apply to:** comments in the new scripts and the runbook sections — if a plan's verification greps for a
literal (`skipTrailingSlashRedirect`, `195.78.67.39`, a record value), a comment quoting it will
false-positive. This bit Phase 8 four times.

## No Analog Found

| File / task | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `docs/baseline/<date>/legacy-site-mirror/` (the `wget` capture itself) | data (generated) | file-I/O | No site-mirroring precedent in the repo, and `wget` is not installed (RESEARCH §Environment Availability). Follow RESEARCH §Pattern 6 for the invocation; the *record* of it (`CAPTURE.md`) follows the baseline-manifest `opnieuw maken` pattern above. |
| `CLAUDE.md` (the stale static-export claims) | docs (tool-generated) | — | See below — this one is a trap, not a gap. |

**The `CLAUDE.md` trap.** RESEARCH Finding 1 is right that the Technology Stack section is stale, but the
stale text is **inside GSD-generated blocks** and there is no hand-edit precedent to copy:

- markers: `<!-- GSD:project-start source:PROJECT.md -->` (13→33),
  `<!-- GSD:stack-start source:codebase/STACK.md -->` (35→72),
  `<!-- GSD:architecture-start source:ARCHITECTURE.md -->` (139→261)
- stale lines: **20, 26** (project block), **46, 55, 60, 68** (stack block), **181, 246, 249** (architecture block)
- CLAUDE.md line 3 states the rule: *"Content between `<!-- GSD:* -->` markers is tool-generated (`/gsd-*`) —
  refresh those via the workflow, not by hand."*
- **`.planning/PROJECT.md` line 116 is already correct** (it says hybrid), so the project block is stale
  *relative to its own source* — i.e. a regeneration should fix it without any source edit.
- `.planning/codebase/STACK.md` and `.planning/codebase/ARCHITECTURE.md` **could not be read this session**
  (OneDrive stall on both). The planner must check them at execution: if they carry the stale claim, fix the
  source *and* regenerate; if they do not, regeneration alone suffices and a hand-edit would be undone later.

## Metadata

**Analog search scope:** `lib/seo/`, `lib/constants.ts`, `scripts/`, `scripts/gsc/`, `.github/workflows/`,
`components/Footer.tsx`, `docs/seo-owner-runbook.md`, `docs/measurements/README.md`,
`docs/baseline/2026-09-16/README.md`, `package.json`, `next.config.ts`, `.planning/{REQUIREMENTS,ROADMAP,PROJECT}.md`,
`CLAUDE.md`.
**Files scanned:** 22 (2 recovered via `gh api` after shell reads timed out; 3 unreadable and flagged above)
**Pattern extraction date:** 2026-09-21
