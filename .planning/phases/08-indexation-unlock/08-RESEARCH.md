# Phase 8: Indexation Unlock - Research

**Researched:** 2026-08-20
**Method:** inline code-grounded research (every claim below was executed against the working tree,
not inferred). Subagents were deliberately not used — see `[[onedrive-execution-constraints]]`
(2026-08-20 update: planning-class subagents now starve on this mount).
**Status:** Complete — two blocking discoveries, both resolved below.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

D-01…D-25 are locked and carried into the plans verbatim. The load-bearing ones for
implementation shape:

- **D-01/D-07** — all seven guards become `prebuild`-blocking (`validate-taxonomy`,
  `assert-no-forbidden-claims`, `assert-registry`, `assert-site-shape`, `assert-gate-blocks`,
  `assert-seo`, `check-radius-literals.sh`), and the radius grep widens to `lib/`.
- **D-02/D-06** — floor is a *named constant with a stated derivation* plus named structural
  assertions; the failure message forbids the bump-to-match move.
- **D-03/D-05** — the invariant becomes a **pure, re-runnable checker** taking an injectable
  node collection + sitemap entries, so `assert-gate-blocks.ts` can prove it bites on perturbed
  clones and Phase 12's kennisbank inherits it with zero gate edits.
- **D-04** — a source-level seam guard: nothing under `app/` may declare `robots:` / `index:false`
  outside `lib/seo/metadata.ts`.
- **D-09/D-10** — four ordered landings, each green: relational gate (5) → predicate + statics (5)
  → flip 21 (26) → hub content + publish + floor (27).
- **D-11…D-19** — hub content is *appended* to the live page and rendered, never data-only.
- **D-20** — one predicate: `isIndexable() = status === "published"` for every node type.
- **D-22…D-25** — a committed probe script run at two gates, importing the gate's floor constant.

### Claude's Discretion (resolved here)

| Discretion item | Resolution | Where |
|---|---|---|
| Checker module layout/naming | `lib/seo/invariants.ts` — joins the no-barrel `lib/seo/*` family; exports `INDEXABLE_FLOOR`, `checkIndexationInvariants()`, `IndexationViolation` | §Pattern 1 |
| Seam guard regex vs AST | **Regex over comment-stripped source.** Verified tractable: today the only `robots`/`noindex` hits under `app/` are inside comments, and all 9 `page.tsx` files import `buildMetadata` | §Pattern 3 |
| Hero/intro seam on `/diensten` | **Keep the hardcoded hero; render the full intro** via a `lead`-inclusive path. Reason in §Pitfall 3 — `ServiceIntro` drops the lead sentence, so the default wiring would silently orphan the authored lead. Hard constraint from CONTEXT ("no authored sentence renders nowhere") is what decides it | §Pattern 4 |
| Hub Dutch copy | Drafted during execution inside D-12/D-13/D-17 + the anti-claim list | 08-04 |
| Commit granularity | One commit per plan; the four D-09/D-10 landings map 1:1 onto plans 08-01…08-04 | §Landing map |

### Deferred Ideas (OUT OF SCOPE)

`FaqItem.links[]`; post-deploy probe automation (Phase 9); an `unlisted` `PageStatus`;
title/meta rewrite for the other 26 pages (Phase 12); redirects/old-domain (Phase 10).

---

## Phase Requirements

| ID | Requirement | Lands in |
|----|-------------|----------|
| IDX-01 | Relational build gate (membership ⇔ `isIndexable()`) + indexable floor, not a hardcoded list | 08-01 (+ floor in 08-04) |
| IDX-02 | 21 `review` nodes `published`, no `noindex` in production HTML | 08-03 (+ proof in 08-05) |
| IDX-03 | `/diensten` hub carries real content clearing ≥120 words / ≥1 step / 3–6 FAQs, published | 08-04 |
| IDX-04 | Production `sitemap.xml` lists all 27 indexable pages | 08-04 (+ proof in 08-05) |
| IDX-05 | The 6 statics carry a `status` consistent with actual indexability | 08-02 |

---

## Summary

The diagnosis in the milestone research is correct and unchanged: `isIndexable()` is fine, the
data is fine, and the thing standing between 21 finished pages and Google is a snapshot assertion
plus a status field. Executing the phase is mostly a sequencing problem.

Code-grounded research found **two blockers that CONTEXT.md could not have known**, both confirmed
by execution:

1. **Two of the seven guards D-01 wires into `prebuild` are already RED.** Wiring them as-is turns
   every Vercel build red at plan 08-01. They must be repaired in the same landing.
2. **D-20's statics relabel cannot build as written.** Flipping the 5 content statics to
   `published` produces **13 Zod violations**, because the anti-thin-content bar applies to every
   `review|published` node — including statics, whose pages are hand-built and whose taxonomy
   `content` shell is metadata-only. Resolved by scoping the bar to the taxonomy-*rendered* types.

Both are the *same failure mode this phase exists to eliminate*: an assertion that encodes a
snapshot of "what is" rather than "what must be true", left unwired so nothing ever re-ran it.

---

## Verified Current State (executed 2026-08-20)

```
PAGES.length = 28   → hub 1 · pillar 4 · service 17 · static 6
status counts       → draft 7 · review 21 · published 0
indexable today     → 5 (the content statics, via the type-based branch)
sitemapEntries()    → 5
27 after the phase  → 28 nodes − privacy-beleid  ← the INDEXABLE_FLOOR derivation
```

### Guard baseline — the seven guards D-01 must wire

| Guard | Wired today | Runs today | Note |
|---|---|---|---|
| `validate-taxonomy.ts` | ✅ prebuild | ✅ green | "28 pages passed pagesSchema" |
| `assert-no-forbidden-claims.ts` | ✅ prebuild | ✅ green | skips `draft` only — already gates the 21 `review` nodes |
| `assert-seo.ts` | ❌ | ✅ green | the snapshot gate — deep-equals the 5 statics, `entries.length === 5`, "draft hub must be noindex" |
| `assert-site-shape.ts` | ❌ | ✅ green | header even says "NOT wired into prebuild" |
| `check-radius-literals.sh` | ❌ | ✅ green | scans `app/` + `components/` only |
| **`assert-registry.ts`** | ❌ | **❌ RED** | `EXPECTED_PAGE_COUNT = 27`, actual **28** |
| **`assert-gate-blocks.ts`** | ❌ | **❌ RED** | perturbation (B) is a **no-op** |

**`assert-registry.ts`** — `/projecten` joined the surface in quick task `260719-t62`; `assert-seo`
was bumped 4→5, this unwired sibling was never touched, and nothing re-ran it. Exactly commit
`82d897b`'s failure mode, one file over.

**`assert-gate-blocks.ts`** — assertion (B) does `shortClone[1].status = "published"` and expects
rejection. `PAGES[1]` is now the **airconditioning pillar** (`review`, 148-word intro), so flipping
it to `published` validates cleanly. The harness that exists to prove the content gate bites has
been silently proving nothing since the Phase-4 content landed. **An index-addressed perturbation
is itself a snapshot assertion** — it silently decays when the array it indexes into changes.

### D-04 seam guard — verified tractable

All 9 `app/**/page.tsx` files import `buildMetadata`. Grepping `app/` for `robots|noindex|index: false`
returns **8 hits, every one inside a comment** (`sitemap.ts:7`, `robots.ts:5,7,23`,
`privacy-beleid/page.tsx:5`, `diensten/page.tsx:10`, `diensten/[pillar]/page.tsx:101`,
`diensten/[pillar]/[service]/page.tsx:44`). A regex guard therefore **must strip comments first** or
it fails on day one. `app/robots.ts` legitimately exports a `robots()` route handler and must be
allowlisted.

### D-07 radius widening — verified no false positives

`grep 'straal van [0-9]\|50 *km\|60 *km\|100 *km'` over `lib/` returns **zero** hits. The only
repo-wide hit is a *comment* in `scripts/assert-seo.ts:86` — so the widened scan must cover
`app components lib` and must **not** include `scripts/`. `ServiceHero.tsx:22` uses
`${SITE.serviceRadiusKm} km` (no digit before "km") and is correctly not matched.

---

## Architectural Responsibility Map

| Concern | Owner | Rule |
|---|---|---|
| Which nodes exist | `lib/services/registry.ts` `PAGES` | single source of the routable surface |
| Whether a node is indexable | `lib/seo/policy.ts` `isIndexable()` | **one predicate, no type branches after D-20** |
| Which nodes the policy governs | `lib/seo/policy.ts` `indexableSurface()` **(new)** | the extension point Phase 12 joins |
| Sitemap emission | `lib/seo/policy.ts` `sitemapEntries()` | the only emitter; `app/sitemap.ts` stays a 2-liner |
| Per-page `robots` | `lib/seo/metadata.ts` `buildMetadata()` | the only seam; D-04 guards it |
| The invariant itself | `lib/seo/invariants.ts` **(new)** | pure, injectable, re-runnable |
| Invariant on real data | `scripts/assert-seo.ts` (rewrite) | build-blocking |
| Proof the invariant bites | `scripts/assert-gate-blocks.ts` (extend) | perturbed clones |
| Proof of served output | `scripts/verify-indexation.ts` **(new)** | preview + production |

---

## Architecture Patterns

### Pattern 1: The pure, injectable invariant checker — `lib/seo/invariants.ts`

The core of IDX-01. Two properties matter: it is **pure** (so `assert-gate-blocks.ts` can feed it
perturbed data) and it is **source-agnostic** (D-05 — it iterates whatever collection `policy.ts`
governs, so kennisbank articles inherit it for free).

```
export const INDEXABLE_FLOOR = 27;   // 28 nodes − privacy-beleid = 27  ← state the derivation

export interface IndexationViolation { code: string; url?: string; message: string }

export function checkIndexationInvariants(opts?: {
  nodes?: PageNode[];              // default: indexableSurface()
  entries?: { url: string }[];     // default: sitemapEntries()
  floor?: number;                  // omitted ⇒ floor not enforced (green at 5 in 08-01)
}): IndexationViolation[]
```

Checks, in order:
1. **Relational, per node** — `sitemapUrls.has(absoluteUrl(urlFor(node))) === isIndexable(node)`.
   Two distinct violation codes so failures read clearly: `sitemap-without-index` and
   `index-without-sitemap`.
2. **Per entry** — every sitemap URL maps back to a governed node. This is what makes a parallel
   list bolted onto `app/sitemap.ts` fail (ARCHITECTURE §Anti-Pattern 1).
3. **Absolute-origin** — every entry starts with `CANONICAL_ORIGIN`.
4. **Floor**, when passed — `indexableCount >= floor`, with the D-06 anti-bump message.
5. **Named structural** — callers assert hub/pillars/privacy by name (D-02 safety belt), so a
   single pillar going dark can never be masked by growth elsewhere.

`policy.ts` gains one export so the checker never names `PAGES`:

```
export function indexableSurface(): PageNode[] { return PAGES; }
export function sitemapEntries() { return indexableSurface().filter(isIndexable).map(...); }
```

### Pattern 2: Perturbation proofs — extend `scripts/assert-gate-blocks.ts`

The in-repo harness (`structuredClone(PAGES)` → mutate → assert rejection) is exactly right; it
only needs **content-addressed, not index-addressed** perturbations. Proofs to add:

| # | Perturbation | Must produce |
|---|---|---|
| P1 | a pillar reverted to `review`, sitemap left as-is | `sitemap-without-index` |
| P2 | one entry dropped from the sitemap array | `index-without-sitemap` |
| P3 | a foreign URL appended to the sitemap array | `orphan-entry` |
| P4 | count below the floor | floor violation |
| P5 | unperturbed real data | **zero** violations |

and the repair of the existing (B): build the thin node **by blanking its intro**, never by
trusting an array index:

```
const n = clone.find(x => x.type === "pillar")!;
n.status = "published"; n.content = { ...n.content, intro: "Te kort." };
```

### Pattern 3: Seam guard — `scripts/assert-metadata-seam.ts` (D-04)

Walk `app/**/*.{ts,tsx}`, strip block comments then line comments (`(^|[^:])\/\/` so `https://`
survives; the block strip also covers JSX `{/* … */}`), then assert:

- no `robots\s*:` and no `index\s*:\s*false` outside `lib/seo/metadata.ts` — allowlist
  `app/robots.ts` (it *is* the robots route);
- every `app/**/page.tsx` imports `buildMetadata`.

Both hold today, so the guard lands green.

### Pattern 4: Hub composition — `app/diensten/page.tsx` (D-11/D-16)

Section order **hero → intro → cards → FAQ → reviews → CTA**, with `ServiceIntro` / `ServiceFAQ` /
`JsonLd` imported for the first time on this route.

**The seam trap (resolved):** `ServiceIntro` renders `splitLead(introSource(node)).rest` — it
deliberately **drops the lead sentence**, because on pillar pages `ServiceHero` already shows it.
`/diensten` has a *hardcoded* hero paragraph and does not use `ServiceHero`. Wiring `<ServiceIntro
node={hub} />` naively would therefore make the authored intro's **first sentence render nowhere** —
violating the CONTEXT hard constraint. Resolution: render the intro **in full** on the hub (the
whole `introSource`, chunked by `toParagraphs`), leaving the existing hero copy untouched. This is
a hub-local composition, not a change to `ServiceIntro`'s pillar contract.

### Pattern 5: Live probe — `scripts/verify-indexation.ts <baseUrl>` (D-22…D-25)

Plain `fetch` + regex; no browser. Imports `INDEXABLE_FLOOR` from `lib/seo/invariants.ts` (D-25) so
the gate and the probe cannot disagree about "complete". Asserts, per D-24:

1. `GET {base}/sitemap.xml` → 200; `<loc>` count `=== INDEXABLE_FLOOR`.
2. Every `<loc>` → `fetch(..., { redirect: "manual" })` returns a **direct 200** (no hop).
3. No served HTML contains a `noindex` directive (`<meta name="robots" …noindex…>`).
4. Each page's `<link rel="canonical">` points at itself.

Exit non-zero on any violation, printing every failure (not just the first).

### Anti-Patterns to Avoid

- **Appending URLs to `app/sitemap.ts`** — recreates the exact drift `policy.ts` prevents. Check 2
  above makes it fail loudly.
- **Index-addressed perturbations** (`clone[1]`) — decay silently into no-ops. This already happened.
- **Bumping an expected number to match reality** — commit `82d897b`. D-06's message names it.
- **Data-only hub authoring** — 120+ words no visitor sees, plus `FAQPage` markup without visible
  FAQs, which violates Google's structured-data policy.
- **Running `next build` / full `tsc --noEmit` locally** — deadlocks on this mount. The Vercel
  preview is the build gate.

---

## Common Pitfalls

### Pitfall 1 — Wiring the guards turns the build red immediately  ⚠ BLOCKER

`assert-registry.ts` (28 ≠ 27) and `assert-gate-blocks.ts` (no-op perturbation) fail **right now**.
D-01 must repair them in the same landing that wires them, or plan 08-01's preview build is red.
Repair them *relationally*, not by bumping: derive the expected surface from the type composition
plus a `>=` floor, and carry the D-06 anti-bump message.

### Pitfall 2 — D-20's statics relabel fails the taxonomy gate  ⚠ BLOCKER

`pageSchema` applies `publishedContentSchema` to **every** `review|published` node. Flipping the 5
content statics to `published` yields **13 violations** (verified):

```
(home)     words=0   steps=0 faqs=0   → FAILS
tarieven   words=122 steps=0 faqs=3   → FAILS  (steps)
projecten  words=0   steps=0 faqs=0   → FAILS
over-ons   words=0   steps=0 faqs=0   → FAILS
contact    words=0   steps=0 faqs=0   → FAILS
```

**Resolution — scope the bar to the taxonomy-*rendered* types (`hub | pillar | service`).** Statics
render bespoke hand-built pages; their `content` shell is metadata plus optional SEO prose, and the
anti-thin-content bar exists to stop thin *taxonomy-rendered* pages. Once D-20 makes `status` the
index lever for every type, that scoping is what keeps the bar meaningful instead of accidental.
Authoring 120 words + steps + FAQs into five nodes that render none of it is the very
"data says one thing, the page does another" class D-11 rejects.

Verified by execution — after scoping:

| Trial | Result |
|---|---|
| statics → `published` (the D-20 relabel) | **VALIDATES** |
| \+ flip 21 `review` → `published` | **VALIDATES** |
| NEGATIVE: pillar `published` with blanked intro | **REJECTED** |
| NEGATIVE: hub `published` with empty content | **REJECTED** (3 issues) |

The last row matters: the bar still forces 08-04 to author real hub content *before* the hub can
publish. The gate keeps biting exactly where content is rendered from the shell.

Both negatives become permanent assertions in `assert-gate-blocks.ts`, plus a positive assertion
that a `published` static with an empty shell is **accepted on purpose** — so the scoping reads as
a decision, not an oversight.

### Pitfall 3 — `ServiceIntro` silently swallows the hub's lead sentence

See §Pattern 4. Detectable only by reading `splitLead`; nothing would fail.

### Pitfall 4 — the radius grep false-positives if scoped too widely

Widen to `app components lib`; never include `scripts/` (a comment there contains "60 km").

### Pitfall 5 — `assert-no-forbidden-claims.ts` starts scanning statics

It skips `status === "draft"` only. After 08-02 the 5 content statics become `published` and enter
the scan. Verified clean today (the sole pattern is the BE-VAT `6% btw` trap; `tarieven` says 21%).
No action — recorded so a reviewer does not read it as new risk.

### Pitfall 6 — `privacy-beleid` → `draft` widens the forbidden-claim blind spot

It leaves the anti-claim scan. Legal boilerplate, no YMYL service claims. Accepted; the D-20 safety
belt (named `isIndexable(privacy) === false` assertion) is the control that matters.

### Pitfall 7 — bulk publishing looks riskier than it is

Milestone PITFALLS §6: these URLs are already crawled and known; removing `noindex` is a
low-risk unlock, not a new-site launch. No staged rollout needed.

---

## Landing map (D-09/D-10 → plans)

| # | Landing | Plan | Indexable after | Build |
|---|---------|------|-----------------|-------|
| 1 | Relational gate + pure checker + seam guard + prebuild wiring + **repair the 2 red guards** | 08-01 | 5 | green |
| 2 | Unify predicate + statics relabel + **scope the content bar** | 08-02 | 5 | green |
| 3 | Flip 21 `review` → `published` | 08-03 | 26 | green |
| 4 | Hub content + publish + `INDEXABLE_FLOOR` + named structural assertions | 08-04 | **27** | green |
| 5 | Probe script + preview gate → merge → production gate | 08-05 | 27 | — |

**Why the floor lands in 08-04, not 08-03:** D-09 says the floor constant lands "in the same commit
as the flip that satisfies it". `INDEXABLE_FLOOR = 27` is satisfied by the *hub* publish, not by the
21-node flip (which reaches 26). Landing 27 at 08-03 would be red; landing 26 then raising it to 27
would be a floor bump — textually the D-06 move. 08-03 is instead guarded by the named "4 pillars +
17 sub-services indexable" structural assertions, which are strictly stronger than a floor for that
state.

---

## Environment Availability

| Capability | Status |
|---|---|
| `npx tsx scripts/*.ts` | ✅ fast (seconds) — all seven guards executed this session |
| `node -e` string/shape asserts | ✅ fast |
| `next build` / full `tsc --noEmit` locally | ❌ deadlocks on the OneDrive mount |
| Vercel preview build | ✅ **the build gate** — where the newly-wired guards run for real |
| Live HTTP probe (`fetch`/`curl`) | ✅ |
| CI (GitHub Actions) | ❌ none — Phase 9 |

---

## Assumptions Log

| # | Assumption | Confidence | If wrong |
|---|---|---|---|
| A1 | Scoping the content bar to `hub\|pillar\|service` is acceptable to the owner of D-20 | HIGH — the alternative cannot build | Author real content into 5 statics (large, and it renders nowhere) |
| A2 | Repairing the 2 red guards belongs to this phase | HIGH — D-01 requires them green | Split into a prerequisite quick task |
| A3 | The 21 `review` nodes flip clean (they already clear the bar via `pageSchema`) | HIGH — verified: full-flip clone validates | Per-node content fixes |
| A4 | Vercel preview builds run `prebuild` | HIGH — `npm run build` triggers npm's `prebuild` lifecycle | Wire an explicit `buildCommand` |
| A5 | Thomas does not object to the new hub prose (D-21 notify-don't-block) | MEDIUM | Revise copy; the status flip is a one-line revert |

## Open Questions

None blocking. Two pre-existing instances of the "authored content that renders nowhere" anti-pattern
D-11 names were found while resolving the hub composition. Both are **out of scope here** and both are
natural pairings with Phase 12's SEO-11…15 pass:

1. **`tarieven`** carries a **122-word intro + 3 FAQs that render nowhere** — the page is `PricingTabs`.
2. **The 4 pillar pages carry 4 authored steps each — 16 steps that render nowhere.** `ServiceSteps`
   exists and is imported *only* by `app/diensten/[pillar]/[service]/page.tsx`; the pillar template
   never renders `content.steps`. Verified: `airconditioning`/`warmtepompen`/`wtw`/
   `mechanische-ventilatie` all have `steps.length === 4`.

Finding (2) is load-bearing for **this** phase: D-13 requires the hub to carry the shared TPS traject
as `steps`, and the published-content bar requires ≥1 step. If the hub page did not render them, the
hub's 4 steps would join those 16 — violating the CONTEXT hard constraint inside the very plan meant
to honor it. Resolution: `app/diensten/page.tsx` renders `<ServiceSteps steps={hub.content.steps} />`
between the pillar cards and the FAQ block — the only position that preserves every relative order
D-16 fixes while mirroring the sub-service template's intro→steps sequence (see 08-04 Task 3).

---

## Validation Architecture

**Honest constraint:** this project has **no test framework** by decision (REQUIREMENTS: out of
scope this milestone) and no CI. Local `next build` / full `tsc --noEmit` deadlock on the OneDrive
mount. Validation is therefore **build-gate + pure-function assertion + live HTTP probe**, sampled
with `tsx` — which is fast and reliable here.

### Validation seams

| Seam | Mechanism | Command | Latency |
|---|---|---|---|
| Taxonomy contract | Zod `pagesSchema` | `npx tsx scripts/validate-taxonomy.ts` | ~2 s |
| Indexation invariant (real data) | `checkIndexationInvariants()` | `npx tsx scripts/assert-seo.ts` | ~2 s |
| Invariant **bites** (perturbed) | perturbation clones | `npx tsx scripts/assert-gate-blocks.ts` | ~2 s |
| Registry surface | relational count + composition | `npx tsx scripts/assert-registry.ts` | ~2 s |
| Metadata seam | comment-stripped source scan | `npx tsx scripts/assert-metadata-seam.ts` | ~2 s |
| NAP shape | `node:assert` on `SITE` | `npx tsx scripts/assert-site-shape.ts` | ~1 s |
| Anti-claim | regex over `review\|published` content | `npx tsx scripts/assert-no-forbidden-claims.ts` | ~2 s |
| Radius literals | grep `app components lib` | `bash scripts/check-radius-literals.sh` | <1 s |
| **Whole-build gate** | Vercel preview build (runs all of the above via `prebuild`) | push branch → preview | ~2 min |
| **Served output** | live HTTP probe | `npx tsx scripts/verify-indexation.ts <baseUrl>` | ~20 s |

### Sampling rate

- **After every task commit:** the guard(s) that task touches (~2 s each).
- **After every plan:** the full `prebuild` chain locally via `npm run prebuild` (tsx only — never
  `next build`).
- **After every landing that changes indexability:** push → Vercel preview build must be green.
- **Before phase close:** `verify-indexation.ts` green against the preview **and** against
  production (D-23).
- **Max feedback latency:** ~2 s local, ~2 min preview.

### Wave 0 requirements

None. `tsx` + `node:assert` infrastructure exists and is proven; no framework install needed.

### Manual-only verifications

| Behavior | Requirement | Why manual | Instructions |
|---|---|---|---|
| Hub prose reads well in Dutch and matches the D-12 angle | IDX-03 | Editorial judgment | Read the preview `/diensten`; check intro/FAQ/steps against D-12/D-13/D-17 and `docs/anti-claim-checklist.md` |
| Owner notification of new hub copy | D-21 | Human comms | Send the preview URL to Thomas; proceed unless he objects |
| Rich-Results check on `/diensten` | IDX-03 | External tool | Google Rich Results Test on the preview URL — `FAQPage` + `BreadcrumbList` valid |

---

## Sources

### Primary (HIGH confidence — executed against the working tree this session)
- All seven guard scripts run; `assert-registry` + `assert-gate-blocks` confirmed red
- `PAGES` composition, status counts, per-static content-bar results, D-20 relabel trial, scoped-bar
  trial (4 cases) — all via `npx tsx -e`
- `lib/seo/{policy.ts,metadata.ts,jsonld.tsx}`, `lib/services/{types,registry,text}.ts`,
  `app/diensten/page.tsx`, `app/diensten/[pillar]/page.tsx`, `app/{sitemap,robots}.ts`,
  `components/{ServiceIntro,ServiceFAQ,ServiceHero}.tsx`, `package.json`, `lib/constants.ts`
- `grep` scans for `robots|noindex` under `app/`, radius literals under `lib/`

### Secondary (HIGH confidence — project research)
- `.planning/research/ARCHITECTURE.md` (relational-invariant sample, single-source pattern,
  Anti-Pattern 1), `PITFALLS.md` §1/§6/§8, `SUMMARY.md`, `STACK.md`
- `.planning/phases/0{3,4}-*/0{3,4}-CONTEXT.md` (carried-forward locks)

---

*Phase: 08-indexation-unlock*
*Research: 2026-08-20 (inline, code-grounded)*
