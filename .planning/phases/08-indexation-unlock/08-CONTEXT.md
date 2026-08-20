# Phase 8: Indexation Unlock - Context

**Gathered:** 2026-08-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the 21 built-but-hidden service pages visible to Google — sitemap 5 → 27 URLs, zero `noindex`
on the service surface — and convert the snapshot build gate that *enforced* the bug into a
relational invariant that makes this class of regression impossible to ship silently again.

**In scope:** IDX-01 (relational build gate), IDX-02 (flip 21 `review` → `published`), IDX-03
(author + publish the `/diensten` hub), IDX-04 (sitemap = 27), IDX-05 (honest `status` on the 6
statics), plus the wiring and live verification that make those provable.

**Not in scope (belongs elsewhere):** redirects and the old-domain migration (Phase 10 — and it is
hard-gated *behind* this phase), GSC verification/submission and monitoring (Phase 9), the
systematic title/meta rewrite across the other 26 pages and internal-linking architecture
(Phase 12), the kennisbank (Phase 12).

</domain>

<decisions>
## Implementation Decisions

> Phase-8 decisions are `D-0x`. Carried-forward locks cited as `P1/P3/P4 D-0x` are **NOT re-opened**:
> `status` is both the editorial gate and the index lever and `isIndexable()` is the single place
> membership is decided (P1 D-08, P3 D-02); three-state `draft`/`review`/`published` flow with the
> status-flip commit *as* the approval record (P4 D-06/D-08); batch-publish the approved set
> (P4 D-09); review surface is the Vercel preview (P4 D-05); `FAQPage` renders only when
> `content.faqs[]` is present (P3 D-04); the anti-claim list is build-enforced (P4 D-13); Dutch
> `u`-voice (P4 D-14); no per-town pages.

### Gate Enforcement & Build Blocking (IDX-01)

- **D-01 — Wire every guard into `prebuild`.** Today `prebuild` runs only `validate-taxonomy.ts` +
  `assert-no-forbidden-claims.ts`; `assert-seo.ts`, `assert-registry.ts`, `assert-site-shape.ts` and
  `assert-gate-blocks.ts` are documented "run on demand" and are executed by **nothing**. That is a
  root cause equal to the wrong assertion itself. All of them become build-blocking. Cost is a few
  seconds of `tsx` startup per Vercel build — accepted.
- **D-02 — Floor = numeric canary **plus** named structural assertions.** `>= 27` guards against mass
  loss; on top of it, the hub and all 4 pillar nodes are asserted indexable **by name**, so a single
  pillar going dark can never be masked by growth elsewhere. A future sub-service page may still be
  legitimately authored in `draft`/`review` without editing the gate (preserves P4 D-08).
- **D-03 — Extract the invariant into a pure checker and prove it bites.** `assert-seo.ts` asserts at
  module top-level, so it cannot be re-run against perturbed data. Move the logic into a pure function
  (e.g. `lib/seo/invariants.ts` → returns a violation list). `assert-seo.ts` runs it on real data;
  `assert-gate-blocks.ts` runs it on perturbed clones — a pillar reverted to `review`, a node dropped
  from the sitemap — and asserts each is caught. Mirrors how the taxonomy gate already proves itself.
- **D-04 — Guard the `buildMetadata` bypass path.** The relational check cannot see a route that skips
  the seam. Add a source-level assertion: no file under `app/` may declare a literal `robots:` /
  `index: false` outside `lib/seo/metadata.ts`, and taxonomy-backed routes must import `buildMetadata`.
  Makes "the seam is the only way" enforced rather than merely commented.
- **D-05 — Write the checker source-agnostically.** It takes whatever indexable-entity collection
  `policy.ts` exposes, not `PAGES` by name, so Phase 12's kennisbank articles inherit the invariant
  with zero gate changes — and a parallel list bolted onto `app/sitemap.ts` fails the per-entry check
  because those URLs have no backing node. (Research is explicit that a second list would recreate
  exactly this bug.)
- **D-06 — Named constant + anti-bump failure message.** The floor lives in a named constant with its
  derivation stated (`28 nodes − privacy-beleid = 27`), and the failure message says explicitly: a drop
  means a page was **de-indexed** — find what went dark; only lower this when a page is deliberately
  retired. This targets the documented human failure mode (commit `82d897b` bumped the expected number
  to match reality instead of asking what broke).
- **D-07 — `check-radius-literals.sh` also wired, and widened to `lib/`.** It is a seventh unwired
  guard, and it currently greps only `app/` + `components/` — so a hardcoded "60 km" in the hub copy
  we are about to author in `lib/services/` would sail past it, contradicting the
  `SITE.serviceRadiusKm` single source (QA-03). Watch for false positives against existing pillar prose.

### Landing & Commit Sequencing

- **D-08 — Branch → Vercel preview → merge.** Work on `gsd/phase-8-indexation-unlock` (project config
  is `branching_strategy: none`, so this is an explicit per-phase choice, matching how Phase 5 landed).
  There is no local `next build` on this OneDrive mount: the preview build is where the newly-wired
  gates run for real, and the preview URL is where served HTML and `sitemap.xml` get probed before
  anything reaches production. `main` deploys straight to production.
- **D-09 — Split the gate so every commit builds green.** The relational check is true at 5 pages
  *and* at 27; only the floor is state-dependent. So: **commit 1** = relational invariant + pure
  checker + seam guard + `prebuild` wiring (green at 5, and it is what proves the gate works before it
  guards anything); the **floor constant lands in the same commit as the flip that satisfies it**.
  This satisfies the roadmap's "IDX-01 before IDX-02" ordering without a red intermediate build.
- **D-10 — Predicate + statics relabel are one atomic commit, sitting between the gate and the flip.**
  Landing the predicate change alone would instantly `noindex` all 5 content statics **including the
  home page**. It gets its own diff and its own revert — the riskiest single edit in the phase. At that
  point the sitemap is still 5 and the build is still green (no floor yet).

  **Resulting sequence:** relational gate → predicate + statics → flip 21 + floor → hub content + publish.

### /diensten Hub (IDX-03)

- **D-11 — Append content sections to the existing page; do not rebuild it.** Keep the current hero and
  4 pillar cards (a live, converting page) and render `intro`/`steps`/`faqs` below them via the existing
  `ServiceIntro` / `ServiceFAQ` components. Data-only authoring was rejected: it would write 120+ words
  and 3–6 FAQs no visitor ever sees — the same "data says one thing, page does another" class this phase
  exists to eliminate — and FAQ markup without visible FAQs violates Google's structured-data policy.
- **D-12 — Content angle: "which service do I need?"** Orientation and routing — airco vs warmtepomp for
  verwarmen, WTW vs mechanische ventilatie, combining disciplines in one job, werkgebied, how an opname
  works. Comparative/navigational by nature, so it structurally cannot overlap the pillars' *decision*
  FAQs (P4 D-16), and it matches the node's `commercieel` search intent and umbrella head term
  ("klimaattechniek Zoetermeer"). Rejected: company-capability framing (territory `/over-ons` owns) and
  a "what is klimaattechniek" explainer (informational, thin on reasons to contact).
- **D-13 — `steps` = the shared TPS traject.** Opname op locatie → advies & offerte → installatie →
  nazorg/onderhoud. True across all four disciplines, answers "how do you work" once at umbrella level,
  and does not collide with the service-specific steps below it (P4 D-15).
- **D-14 — Rewrite the hub's `metaTitle` + `metaDescription` — and only the hub's.** The current
  description is the 69-character draft placeholder, roughly half the usable SERP width, on a page we
  are authoring from scratch today and indexing this phase. The other 26 pages stay untouched for
  Phase 12's data-driven pass (SEO-11…15).
- **D-15 — `FaqItem` shape unchanged.** `ServiceFAQ` renders `{faq.answer}` as plain text, so answers
  cannot link to the pillar they recommend. Accepted: the 4 pillar cards sit directly above the FAQs and
  already carry those links. Adding `links[]` would change the Zod contract shared by all 28 nodes inside
  the phase that must not break the build; noted as a Phase 12 idea instead.
- **D-16 — Section order: hero → intro → cards → FAQ → reviews → CTA.** Matches the pillar contract
  (`ServiceIntro` is built to sit directly under the hero in a reading column; `ServiceFAQ` before the
  trust strip), keeps the routing cards high, and answers "which one do I need?" right after the reader
  has seen the four choices.
- **D-17 — Hub carries a `localAngle` werkgebied line.** Currently empty, so `ServiceFAQ`'s regio line
  does not render while every pillar has one. Source the region from `SITE`; **no hardcoded radius
  number** in the copy (see D-07).
- **D-18 — 5 FAQs.** Comfortably off the Zod floor of 3, so a later edit that drops one does not break
  the build; enough for the distinct routing questions without burying the reviews strip and CTA.
- **D-19 — Hub JSON-LD = `FAQPage` + `BreadcrumbList`.** Exact parity with pillar pages using the
  existing `faqJsonLd` / `breadcrumbJsonLd` helpers — no new JSON-LD code, and both are backed by content
  now visible on the page. The site-wide `HVACBusiness` node already renders from the root layout. An
  `ItemList` of the 4 pillars was considered and rejected (new helper, thin evidence of benefit).

### Status Semantics (IDX-02 / IDX-05)

- **D-20 — Unify the predicate: `isIndexable()` = `status === "published"` for every node type.** Delete
  the `type === "static"` branch's `pathSegment !== "privacy-beleid"` special case. Set the 5 content
  statics to `published` and `privacy-beleid` to `draft`. Indexability becomes purely data, one predicate,
  no exceptions. **Safety belt:** the gate keeps an explicit named assertion that
  `isIndexable(findBySlug("/privacy-beleid")) === false`, so the legal page can never drift into the
  index. Accepted downside: `draft` reads as "unfinished" for a page that is finished and deliberately
  excluded. Adding an `unlisted` status was considered and rejected as too invasive here — it widens the
  Zod enum and the type contract shared by all 28 nodes.
- **D-21 — The hub publishes in-phase: notify, don't block.** Thomas's 2026-08-05 sign-off covered the 21
  service pages; the hub prose is new copy he has never seen. Send him the preview link and proceed unless
  he objects. The copy is orientation/routing text with no pricing, certification or subsidy claims — the
  class the anti-claim gate (P4 D-13) already guards — and the last review round took roughly seven weeks.
  Blocking would hand this phase's completion, and every phase stacked behind it, to an inbox.

### Production Verification

- **D-22 — Committed probe script `scripts/verify-indexation.ts <baseUrl>`.** Success criteria 2 and 3 are
  about *served output*, and on this project a green build has already shipped visibly wrong output (the
  hero H1 rendered as blue blocks). A manual curl checklist leaves no artifact on a repo where the last
  regression survived months precisely because nothing re-ran. A browser harness adds flake for no extra
  signal — robots meta and sitemap XML are plain HTTP responses.
- **D-23 — Run it explicitly at two gates:** against the Vercel preview URL before merging, and against
  production after the merge deploys. Both recorded in the phase's verification steps. No CI exists on this
  repo; standing one up belongs to Phase 9, not the milestone's foundation phase.
- **D-24 — Probe asserts:** sitemap entry count matches the floor · every sitemap URL returns a **direct**
  200 with no intermediate hop · no served HTML contains a `noindex` directive · each page's canonical
  points at itself. The no-redirect and self-canonical checks cost almost nothing here and are exactly what
  Phase 10's "every target 200, one hop" checklist needs — the script arrives already load-bearing for the
  migration.
- **D-25 — The probe imports the gate's `INDEXABLE_FLOOR` constant.** The number then lives in exactly one
  place, and the build gate and the live probe are structurally incapable of disagreeing about what
  "complete" means. Deriving it live from the taxonomy was rejected — the probe would share the source of
  truth it is meant to check independently.

### Claude's Discretion

- **Hero/intro seam on `/diensten`** (D-11/D-16). `ServiceIntro` deliberately renders the intro **minus**
  its lead sentence because `ServiceHero` shows that sentence (`splitLead` in `lib/services/text.ts`) — but
  the hub has a *hardcoded* hero paragraph instead. Planner's call between sourcing the hero from
  `content.h1` + the intro's lead sentence (retires two hardcoded strings, obeys single-source, needs a
  styling decision for the accent-coloured "diensten" span) versus keeping the hero and rendering the full
  intro. **Hard constraint: no authored sentence may end up rendering nowhere.**
- Exact module layout and naming for the extracted checker (`lib/seo/invariants.ts` or similar) within the
  `lib/seo/*` no-barrel family — D-03.
- Whether the seam guard (D-04) is regex-based or AST-based, and its exact match set — keep it inside the
  existing assert-script family and drop it if it turns into fragile regex maintenance.
- Exact Dutch wording of the hub's intro, 5 FAQ pairs, steps and werkgebied line, drafted during execution
  within D-12/D-13/D-17 and the P4 D-13 anti-claim list.
- Commit granularity beyond the four ordered landings in D-09/D-10.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone research (read first — this phase's diagnosis lives here)
- `.planning/research/ARCHITECTURE.md` — the relational-invariant rewrite (with sample code), why
  `isIndexable()` itself needs no change, the recommended new/modified file structure, and the
  single-source indexability pattern
- `.planning/research/PITFALLS.md` §Pitfall 8 — "the build gate that enforces the bug", incl. commit
  `82d897b`; §Pitfall 6 — bulk un-noindexing is lower risk than it looks (pages are already crawled);
  §Pitfall 1 — why Phase 10 is hard-gated behind this phase; §"Looks Done But Isn't" checklist
- `.planning/research/SUMMARY.md` — executive framing and the three sequencing findings
- `.planning/research/STACK.md` — `scripts/assert-seo.ts` marked REWRITE; `tsx` + `node:assert` are the
  reliable gate tooling on this mount

### Phase scope
- `.planning/ROADMAP.md` §"Phase 8: Indexation Unlock" — goal, the 5 success criteria, and the
  IDX-01-before-IDX-02 note
- `.planning/REQUIREMENTS.md` — IDX-01…IDX-05 verbatim
- `.planning/PROJECT.md` §Current State — the 2026-08-19 blocker write-up; §Constraints — OneDrive
  execution constraint (no local `next build`)

### Carried-forward decision locks
- `.planning/phases/03-seo-infrastructure/03-CONTEXT.md` — D-02 (publish-gated sitemap + indexing via one
  policy helper), D-03 (open robots.txt so noindex is actually seen), D-04 (JSON-LD shapes), D-05 (the
  `buildMetadata` seam)
- `.planning/phases/04-content-fill-editorial-gate/04-CONTEXT.md` — D-05/D-06/D-07/D-08/D-09 (editorial
  gate, status flow, sign-off shape), D-13 (anti-claim list), D-14 (voice), D-15/D-16 (per-page uniqueness
  and FAQ allocation)

### Code the phase modifies or depends on
- `lib/seo/policy.ts` — `isIndexable()` / `sitemapEntries()` / `absoluteUrl()`; the predicate D-20 unifies
- `lib/seo/metadata.ts` — `buildMetadata()`, the seam D-04 guards; derives `robots` from `isIndexable`
- `lib/seo/jsonld.ts` — `faqJsonLd` / `breadcrumbJsonLd` helpers reused by D-19
- `lib/services/types.ts` — `PageStatus`, `ContentShell`, `publishedContentSchema` (the ≥120-word / ≥1-step
  / 3–6-FAQ bar), `pageSchema`, `pagesSchema`
- `lib/services/registry.ts` — `draftShell()`, the hub node, the 6 static nodes, `PAGES`
- `lib/services/{airconditioning,warmtepompen,wtw,mechanische-ventilatie}.ts` — the 21 `review` nodes
- `lib/services/text.ts` — `splitLead` / `introSource` / `toParagraphs` (the hero/intro seam)
- `app/diensten/page.tsx` — the hand-built hub page D-11/D-16 extend
- `components/ServiceIntro.tsx`, `components/ServiceFAQ.tsx`, `components/ServiceHero.tsx`
- `scripts/assert-seo.ts` (rewrite), `scripts/assert-gate-blocks.ts` (extend), `scripts/assert-registry.ts`,
  `scripts/assert-site-shape.ts`, `scripts/validate-taxonomy.ts`, `scripts/assert-no-forbidden-claims.ts`,
  `scripts/check-radius-literals.sh`
- `package.json` — the `prebuild` chain D-01/D-07 extend

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`ServiceIntro` / `ServiceFAQ`** — drop-in server components taking a node / `faqs[]` + `localAngle`.
  `ServiceFAQ` renders native `<details>` with zero client JS and omits itself entirely when `faqs` is
  empty; it renders a regio line above the FAQs when `localAngle` is non-empty.
- **`faqJsonLd` / `breadcrumbJsonLd` + the `JsonLd` server component** — already used by pillar and
  sub-service routes; the hub currently emits no JSON-LD at all.
- **`assert-gate-blocks.ts` perturbation pattern** — `structuredClone(PAGES)` → mutate → assert the schema
  rejects it. Exactly the harness D-03 needs, already proven in-repo.
- **`buildMetadata(node)`** — single seam producing canonical + OG + Twitter + `robots: { index: isIndexable(node), follow: true }`.

### Established Patterns
- **Single-source indexability.** `policy.ts` is the only place sitemap membership and the `robots`
  directive are decided; both `app/sitemap.ts` and every page read it. Extend it, never bypass it.
- **Status-gated content quality.** `pageSchema` applies `publishedContentSchema` to `review` **and**
  `published` alike — so all 21 nodes already clear the ≥120-word / ≥1-step / 3–6-FAQ bar and the flip is a
  pure data edit that builds green. Only the hub (an empty `draftShell`) would fail, which is why IDX-03
  exists.
- **Build-time CLIs, not a test framework.** `tsx` + `node:assert`, intentional `console` usage, non-zero
  exit aborts the build. No jest/vitest in this project by decision.
- **No-barrel `lib/seo/*` module family** — pure, server-safe functions; new modules join that family.

### Integration Points
- `package.json` `prebuild` — currently `tsx scripts/validate-taxonomy.ts && tsx scripts/assert-no-forbidden-claims.ts`; D-01/D-07 extend this chain (it is the only thing standing between a regression and production).
- `lib/seo/policy.ts` `isIndexable()` — the one function D-20 edits; every page's `robots` meta and the
  whole sitemap follow from it.
- `app/diensten/page.tsx` — gains `ServiceIntro` + `ServiceFAQ` + `JsonLd`; currently imports none of them.
- Vercel preview build — the de-facto CI for this repo (no GitHub Actions exist).

### Current data state (verified 2026-08-20)
- 28 nodes total: **21 `review`** (4 pillars + 17 sub-services, in the four pillar data files) + **7 `draft`**
  (hub + 6 statics, in `registry.ts`) + **0 `published`**. 27 indexable after the phase (28 − privacy-beleid).
- `assert-seo.ts` currently asserts `indexableUrls` deep-equals the 5 static URLs, `entries.length === 5`,
  and *"draft hub must be noindex"* — it will hard-fail the moment anything publishes.

</code_context>

<specifics>
## Specific Ideas

- **The anti-pattern to name in the plan:** commit `82d897b` — "assert-seo expected 4 indexable pages, site
  serves 5" — the expected number was bumped to match reality rather than questioned. D-06's failure message
  and D-03's negative proof both exist to make that specific move impossible to repeat quietly.
- **Four ordered landings** (D-09/D-10): relational gate (green at 5) → predicate + statics (green at 5) →
  flip 21 + floor (green at 26) → hub content + publish (green at 27).
- **`permanent: true` emits 308, not 301** — noted in research so a reviewer does not flag it as a bug.
  Relevant to Phase 10, not here.
- **Do not write a numeric service radius into hub copy** — derive from `SITE.serviceRadiusKm`; D-07 widens
  the guard to catch it in `lib/`.

</specifics>

<deferred>
## Deferred Ideas

- **`FaqItem.links[]`** — optional per-FAQ links so a routing answer can point at the pillar it recommends.
  Rejected here as a taxonomy contract change (D-15); natural pairing with Phase 12's internal-linking
  architecture (SEO-12).
- **Post-deploy automation of `verify-indexation.ts`** — a GitHub Action or Vercel deploy hook running the
  probe after every production deploy, so drift is caught without anyone remembering. Rejected here because
  no CI exists on this repo (D-23); fits Phase 9 Measurement Foundation.
- **An `unlisted` / `noindex` `PageStatus` value** for complete-but-deliberately-excluded pages. The most
  truthful model for `privacy-beleid`, rejected here as too invasive to the shared Zod contract (D-20);
  revisit if a second such page ever appears.
- **Title/meta rewrite for the other 26 pages** — deliberately left to Phase 12 (SEO-11…15) so it happens
  against real Search Console query data (D-14).

</deferred>

---

*Phase: 8-Indexation Unlock*
*Context gathered: 2026-08-20*
