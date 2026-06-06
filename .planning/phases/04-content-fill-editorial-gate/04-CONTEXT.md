# Phase 4: Content Fill & Editorial Gate - Context

**Gathered:** 2026-06-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 4 fills every page with **unique, accurate, trust-building Dutch copy** that clears the build-enforced uniqueness bar and passes a **hard owner editorial sign-off** — the real defense against the Dec-2025 Core Update / YMYL thin-content risk. This is an **editorial phase, not a code phase**: the templates (Phase 2) and SEO instrumentation (Phase 3) already exist; Phase 4 writes the content *into* them and flips the editorial/index gate.

**In scope:**
- Unique copy for all **4 pillar pages** (intro ≥120w, decision-level FAQs, local angle) and all **17 sub-service pages** (service-specific intro ≥120w, steps, 3-6 unique task FAQs, regio angle) — written into the typed `ContentShell` in `lib/services/*.ts` (CONT-01, CONT-02, CONT-09).
- **Brand install content** (CONT-03) — blurbs for Daikin / Mitsubishi Electric / Heavy / Ecodan; any "erkend installateur"/dealer claim gated on owner verification.
- **Per-pillar ISDE/subsidie content** (CONT-04) — WP yes, WTW/MV yes from 2026 + insulation condition, Airco no — accurate + sourced.
- **Pricing transparency copy** (CONT-05) — all-in incl. BTW for Airco/WTW/MV; Warmtepompen "op maat via offerte" with inclusions. (Pricing *data* stays in `components/PricingTabs.tsx`.)
- **Certification/keurmerk trust block** (CONT-06) — only owner-verified marks, display-gated on proof.
- **Over-ons refresh** (CONT-07) — "Verhaal van Thomas" + 4 USPs (Gecertificeerd, Snel, Persoonlijk, Transparant).
- **Reviews consolidation** (CONT-08) — single source + Google score/count/link on home and key pages + the reserved `aggregateRating` JSON-LD slot.
- **The hard editorial gate** (CONT-10) — owner sign-off before any page ships, enforced via the `status` field flip to `published`.
- **The owner intake form workstream** — publish Tally `2EojAA`, send to Thomas, map returns to code (the input mechanism this phase depends on).

**Out of scope (other phases / versions):**
- **Home-page visual/layout rebuild → Phase 6** (Phase 4 touches the home at the *data/content* level only — see D-18).
- Form security, instant owner notification, WhatsApp affordance, static-vs-hybrid decision, Maps-pin fix, image optimization, mobile-CWV pass → **Phase 5** (LEAD/QA/SEO-10).
- Blog / kennisbank → **v1.x fast-follow (BLOG-01)**; per-location pages → **v2 (BLOG-02)**.
- Per-brand dedicated pages → **v2 (CONT-V2-01)**; onderhoudscontract tiers → **v2 (CONT-V2-02)**; dedicated VvE section → **v2 (CONT-V2-03)**; deep energy-savings cross-sell → **v2 (CONT-V2-04)**.
- Changing the taxonomy structure, routes, templates, or SEO infra (Phases 1-3 are locked; Phase 4 only writes content into them).

</domain>

<decisions>
## Implementation Decisions

> Phase-4 decisions are `D-0x`. Carried-forward locks are cited as `P1/P2/P3 D-0x` (see `01/02/03-CONTEXT.md`) and are **NOT re-opened**: content lives in the typed `ContentShell` in `lib/services/*.ts` with structured `faqs[]`/`steps[]` + prose `intro`/`localAngle` (P1 D-14/D-15); the `status` field is the editorial gate AND the index lever (P1 D-08, P3 D-02); the uniqueness bar (intro ≥120w, ≥1 step, 3-6 FAQs for review/published) is build-enforced via Zod (P1 D-07); brands ship `erkendInstallateur:false` and never render a dealer claim until verified (P1 D-06); the `aggregateRating` JSON-LD slot is wired-but-empty, reserved for here (P3 D-04); regio = signals baked into copy, never city pages.

### Owner-Input Gating & Sequencing
- **D-01 — Draft now, quarantine claims.** Draft ALL researchable copy immediately (service intros, steps, FAQs, ISDE/subsidie facts, regio angle — none need owner input). Only genuinely owner-gated claims wait. The taxonomy was purpose-built for this (status gate + `erkendInstallateur` flags + empty rating slot). Nothing blocks on the form.
- **D-02 — Neutral interim phrasing for gated items, and it MUST be literally true.** While owner verification is pending, use neutral trust phrasing — but never a claim that isn't yet verified. Concretely: `vakkundige` / `ervaren monteurs`, **NOT** `gecertificeerd`, until at least one certification is confirmed; no named keurmerk, no dealer/"erkend installateur" badge, and no star rating until proof/data arrives. (Refined from the YMYL discussion — see D-12.)
- **D-03 — Drafting order: pillar-by-pillar, complete silos.** Draft a whole pillar (pillar page + all its sub-services) before the next, so each becomes a complete topical silo and reviews batch cleanly. (Publishing timing is governed by D-09, not per-pillar.)
- **D-04 — The intake form is in Phase 4 scope.** The plan OWNS the owner-input dependency: publish the Tally form `2EojAA` (verify password `tpsklimaat2026` is active → publish), send Thomas one message (link + password + photo instruction), and map returns to code (`brands.ts` dealer status, `SITE` NAP/hours, reviews, story, pricing confirmation, cert proofs). See `docs/owner-intake-spec.md`.

### Editorial Workflow & Sign-Off (CONT-10)
- **D-05 — Review surface = Vercel preview deploy.** Thomas (non-technical) reviews the **rendered pages on a preview URL**, not the TS data files. He sees what visitors see; zero export overhead since the pages already render.
- **D-06 — Approval record = the status flip itself.** The git commit that flips a node's `status` to `published` IS the audit trail — one lever, no parallel tracking doc (mirrors the project's single-source ethos).
- **D-07 — Sign-off granularity = one whole-site review.** Thomas does a single consolidated review pass over all 21 pages before launch (minimizes owner interruptions), rather than per-page or per-pillar rounds.
- **D-08 — Status flow uses all three states.** `draft` = not ready / empty shell (noindex, out of sitemap). `review` = Claude finished + build uniqueness-gate passed, awaiting Thomas (still noindex/out-of-sitemap, so safe to sit). `published` = owner-approved → indexed + in sitemap. Slow approvals simply leave pages safely out of the index — graceful partial launch is built in.
- **D-09 — Launch shape: draft incrementally → `review` → ONE whole-site review → batch-publish.** Claude drafts pillar-by-pillar (D-03), flipping each completed pillar to `review` as it passes the gate; Thomas reviews the whole site once (D-07); we then **batch-flip the approved set to `published`** for a single clean go-live. (Reconciles D-03's per-pillar drafting with D-07's single review — drafting is incremental, publishing is one batch.)

### YMYL Accuracy: Subsidie, Pricing & Claims
- **D-10 — Subsidie depth: eligibility + conditions + official RVO link; amounts routed to a consult.** Explain who qualifies and the conditions accurately, link the official RVO source, but route concrete euro amounts to a free consult ("vraag vrijblijvend advies"). Durable (conditions change less than amounts), low factual-risk, still demonstrates expertise. Applies per-pillar: **WP** (ISDE) yes, **WTW/MV** yes from 2026 + the **insulation condition**, **Airco** no subsidy.
- **D-11 — Pricing transparency: confirm the existing table, add all-in clarity.** Owner confirms the current `PricingTabs` numbers via the form; we add transparency framing — **all-in incl. BTW + voorrijkosten** note for Airco/WTW/MV, and **Warmtepompen "op maat via offerte"** with what's included. Keep the proven all-in table; sharpen the "Transparant" USP.
- **D-12 — Certification/keurmerk: hard display-gate, literally-true interim copy.** No named mark (F-gassen/STEK, InstallQ, BRL, VCA, verzekering) renders until the owner uploads proof. Interim copy obeys D-02. Zero false-claim risk; protects the "Transparant" USP.
- **D-13 — Locked anti-claim list (a content-review gate every page is checked against before `review`).** NEVER claim: ISDE/subsidie for airco; Belgian 6% BTW; unverified dealer / "erkend installateur" status; unheld keurmerken/certifications; a star rating or `aggregateRating` without a real Google source. (Mirrors REQUIREMENTS.md "Out of Scope" anti-features.)

### Differentiation, Voice & Reviews
- **D-14 — Voice = formal `u`, professional-warm.** Fits the premium "klimaattechniek" positioning and the consultative, trust-led homeowner audience; **matches the already-shipped ported copy** ("in *uw* woning") so no re-toning is needed. (The intake form's `je` is owner-facing — a different audience — and does not set the public voice.)
- **D-15 — Per-page uniqueness via intent angle + service-specifics.** Each page leads with its own intent angle — **Installatie** = proces/merken/ISDE, **Onderhoud** = preventie/contract/checklist, **Storing** = snelheid/spoed/symptomen, **Vervangen/Aanleggen/Inregelen** = their own — and uses concrete, service-specific detail (real steps, symptoms, parts), never swapped boilerplate. The build gate enforces length; the angle enforces distinctiveness (no two pages distinguishable only by H1).
- **D-16 — FAQ allocation: pillar = decision FAQs, sub-service = task FAQs; one canonical home per topic.** Pillar pages answer cross-cutting decision questions (subsidie, garantie, geluid, VvE/vergunning, kosten-indicatie); sub-service pages answer task-specific ones ("hoe lang duurt een wtw-vervanging?"). Each general topic gets ONE canonical home page and is internal-linked from related pages (anti-cannibalization).
- **D-17 — Reviews: single consolidated source + gated `aggregateRating` + score/count/link.** Create one consolidated reviews module (e.g. `lib/reviews.ts`) that REPLACES the three scattered `REVIEWS` copies (`app/diensten/page.tsx`, `app/page-sections/ReviewsSection.tsx`, `app/over-ons/page.tsx`). Wire the reserved `aggregateRating` JSON-LD slot from the owner's **real** Google score + count (gated until provided, per D-02/D-13). Show score/count/link on home + key pages. Phase 6 restyles the home presentation but reads this same source.

### Scope Seams
- **D-18 — Home boundary: Phase 4 = data/content only; Phase 6 = visual rebuild.** On the home page Phase 4 ONLY: wires the consolidated reviews source + Google score/count/link (CONT-08), refreshes USP copy feeding the existing `WhyTPSSection` (CONT-07), and fixes any stale service copy. **No layout/visual changes** — Phase 6 owns the rebuild and reads the same data. Avoids rework and merge clashes.
- **D-19 — Brand logos: source official SVGs ourselves now.** Proactively obtain official brand SVG logos (Daikin, Mitsubishi Electric/Heavy/Ecodan) for `brands.ts` / BrandGrid this phase, **respecting each brand's asset-usage guidelines** (use official partner/press resources; logo presence ≠ a dealer/"erkend" claim, which stays gated per D-12). Owner-supplied assets via intake §9 can replace them later. BrandGrid's graceful text-chip fallback (P2) remains for any brand whose asset isn't obtained.
- **D-20 — Cross-pillar cross-sell: light editorial, where natural.** Use the `relatedOverride` Phase 2 reserved (P2 D-11) to add tasteful cross-links where they genuinely fit (e.g. airco installatie → "ook interesse in een warmtepomp?", energiebesparing framing). Light touch only; the deeper energy-savings cross-sell remains v2 (CONT-V2-04).

### Claude's Discretion
- **OG card (999.1) timing** (user said "you decide") → **stays in the backlog** as its formal home, but is **logo-unblocked by Phase 4's intake**: if the owner logo is in hand during execution, producing the branded 1200×630 card is a cheap opportunistic add; otherwise it pairs with Phase 6 (brand/visual). The current launch-default OG image keeps working meanwhile.
- Module layout/naming for the consolidated reviews source (`lib/reviews.ts` vs a `SITE.reviews` extension) — planner's call within the single-source intent (D-17).
- Exact per-page intent-angle wording and the topic→page FAQ map (D-15/D-16) — drafted during execution from research; planner sets the structure.
- Whether the D-13 anti-claim list is enforced as a written review checklist only, or additionally as a lightweight `scripts/` assertion (e.g. grep for forbidden strings) — planner's call.
- Whether to flip pages `draft → review` per-pillar in one commit or per-page — within D-08/D-09.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase plan & requirements
- `.planning/ROADMAP.md` §"Phase 4: Content Fill & Editorial Gate" — goal, the 5 success criteria, requirement set (CONT-01…CONT-10). Also §"Phase 3" (the `status:"published"` flip is the index lever this phase pulls) and §"Phase 5/6" (downstream consumers; home rebuild).
- `.planning/REQUIREMENTS.md` §"Content (Claude drafts, owner reviews)" (CONT-01…CONT-10 — the full spec for each), §"SEO" (SEO-06 page-body regio copy lands here; SEO-03 FAQPage/aggregateRating), §"v2 Requirements" (BLOG-01 fast-follow, CONT-V2-01…04 — explicitly deferred), §"Out of Scope" (the anti-claim list behind D-13).
- `.planning/PROJECT.md` §"Key Decisions" + §"Constraints" — positioning, "Claude drafts / owner reviews" content model, regio-not-city-pages, design-system rules.
- `.planning/STATE.md` §"Blockers/Concerns" — owner-input dependencies (certifications + dealer status pending → satisfied by D-04 intake form).

### The data contract this phase writes into (`lib/services/`)
- `lib/services/types.ts` — `ContentShell` (`h1, intro, steps[], faqs[], localAngle, metaTitle, metaDescription, ogImage`), `PageBase` (`status`, `primaryKeyword`, `navTitle/navDescription`), and the **Zod uniqueness gate** (`publishedContentSchema`: intro ≥120w, ≥1 step, 3-6 FAQs — applied to `review`/`published`). THE shape every page must satisfy to publish.
- `lib/services/registry.ts` — `PAGES`, `validateTaxonomy()`, `urlFor()`, `pillars()`/`childrenOf()`; the per-node `status` this phase flips.
- `lib/services/brands.ts` — the 4 brands; `erkendInstallateur:false` + empty `blurb` to fill (D-12/D-19); `logo` placeholder paths (D-19).
- `lib/services/{airconditioning,warmtepompen,wtw,mechanische-ventilatie}.ts` — the per-pillar nodes to fill. **WTW is partially ported (intros below 120w — must EXPAND); Warmtepompen is fully empty/net-new; no page has any FAQs yet.**
- **Phase 1 RESEARCH §Keyword Map** (in `.planning/phases/01-taxonomy-data-model/`) — the `[ASSUMED]` per-URL keyword assignments flagged in the data files for validation **before Phase 4** (assumption A1). Validate/confirm keywords as content is written.

### SEO / indexing lever & JSON-LD (Phase 3 output this phase activates)
- `lib/seo/policy.ts` — `isIndexable()` / sitemap membership keyed on `status === "published"`. Flipping `status` here auto-admits pages to the sitemap + index (no parallel list).
- `lib/seo/*` JSON-LD builders — the `FAQPage` (renders from `content.faqs[]` once present) and the **reserved empty `aggregateRating` slot** on the `HVACBusiness` node (D-17 fills it from real Google data).

### Owner intake (the input mechanism — D-04)
- `docs/owner-intake-spec.md` — full spec + build checklist for Tally form `2EojAA`; the ASK-vs-DERIVE split and the "→ Code destination" mapping (§4 fields → `SITE`/`brands.ts`/content). Memory: `owner-intake-form.md`.

### Prior phase contexts (locks consumed)
- `.planning/phases/01-taxonomy-data-model/01-CONTEXT.md` — P1 D-06 (brand gate), D-07/D-08 (uniqueness bar + status gating), D-14/D-15 (content shell + structured faqs/steps).
- `.planning/phases/02-routes-service-page-templates/02-CONTEXT.md` — P2 D-04/D-05 (ported content + porting watch-items: dropped Panasonic, folded dakventilator), D-06 (graceful empty-shell rendering), D-11 (RelatedServices `relatedOverride` reserved → D-20), D-12 (reviews swap reserved → D-17).
- `.planning/phases/03-seo-infrastructure/03-CONTEXT.md` — P3 D-02 (publish-gated sitemap/index), D-04 (FAQPage + reserved aggregateRating), D-05 (regio in metadata; page-body regio deferred here).

### Codebase maps (patterns)
- `.planning/codebase/CONVENTIONS.md` — nl-only copy, `SITE` for business data, `Icon` wrapper, MD3 tokens / no 1px borders / no `#000` text, named exports.
- `.planning/codebase/STRUCTURE.md` — `lib/` placement (where `lib/reviews.ts` lands).
- `.planning/codebase/CONCERNS.md` — context for the home/Phase-6 seam and the perf flags (Phase 4 adds no heavy motion).

### External sources to verify (YMYL — researcher)
- **RVO ISDE** (official) — current 2026 warmtepomp ISDE conditions; the WTW/MV-from-2026 scheme + insulation condition (D-10). These are the authoritative source links the copy must cite. *(URLs to be confirmed by the phase-researcher against rvo.nl.)*

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`ContentShell` + per-pillar data files** — the only place body copy goes; `draftShell()` helpers already exist in each pillar file (extend/replace as content lands).
- **`ServiceSteps` / `ServiceFAQ` server components** (P2) — render `steps[]`/`faqs[]` with zero re-parsing; FAQ content auto-feeds `FAQPage` JSON-LD.
- **`BrandGrid`** (P2) — resolves `brandIds` → `brands.ts`; graceful text-chip fallback when a logo asset is absent (D-19).
- **`ReviewCarousel` + scattered `REVIEWS`** — to be consolidated into one source (D-17).
- **`components/PricingTabs.tsx`** — holds pricing data; transparency copy (D-11) wraps it, data stays put.
- **`lib/seo/policy.ts` `isIndexable()` + the `aggregateRating` JSON-LD slot** — the index lever (status flip) and the ratings slot this phase activates.

### Established Patterns
- **Build-enforced content gate** — `validateTaxonomy()` runs the Zod uniqueness rules on `review`/`published` nodes at build (prebuild hook). A page that doesn't clear ≥120w / ≥1 step / 3-6 FAQs **cannot** be flipped to `review`/`published` — the gate is genuine, not advisory.
- **Single-source ethos** — mirror `urlFor()`/`isIndexable()` for the new reviews source (D-17).
- **Content is TS data, server-rendered** — static export; no runtime; Thomas reviews via preview deploy (D-05).

### Integration Points
- `status` flip (`draft→review→published`) → `lib/seo/policy.ts` → sitemap + per-page `robots` (the editorial gate IS the index lever).
- `content.faqs[]` → `ServiceFAQ` component + `FAQPage` JSON-LD.
- new reviews source → `ReviewCarousel`, `aggregateRating` JSON-LD, home/key-page score-count-link.
- `brands.ts` (`blurb`, `erkendInstallateur`, `logo`) → `BrandGrid` on Installatie pages.
- `SITE` (NAP/hours, owner-confirmed via intake) → already wired to JSON-LD/contact (Phase 3) — intake returns just update values.

</code_context>

<specifics>
## Specific Ideas

- **Porting ≠ done.** The ported WTW intros are ~50-60 words — **below** the 120-word publish gate — and have **no FAQs**. They must be EXPANDED, not merely kept. **Warmtepompen is fully empty** (net-new pillar). **No page anywhere has FAQs yet** — every FAQ in the project is net-new in this phase.
- **The site already uses formal `u`** ("een optimale vochtbalans in uw woning") — D-14 keeps it; do not introduce `je` in public copy.
- **We are in June 2026**, so the 2026 ISDE rules are *current* — but the WTW/MV-from-2026 scheme + insulation condition still needs source verification (D-10).
- **The status field is a graceful partial-launch mechanism**, not just a gate: any page Thomas hasn't approved stays `review`/`draft` = noindex + out-of-sitemap, so the site can launch with only the approved set live and no broken/thin pages exposed.
- Porting watch-items still apply (P2 D-05): Airco brand mentions = Daikin/Mitsubishi only (no Panasonic in taxonomy brands); the old "dakventilator" content folds into MV `onderhoud-reinigen`/`vervangen` (no new route).

</specifics>

<deferred>
## Deferred Ideas

- **Branded OG card (999.1)** — stays in the backlog as its formal home; **logo-unblocked by Phase 4's intake**; opportunistic add if the logo is in hand, else pairs with Phase 6 (Claude's-discretion note above).
- **Deep energy-savings / gas-vs-airco cross-sell content** — v2 (CONT-V2-04); Phase 4 does only light `relatedOverride` cross-links (D-20).
- **Per-brand dedicated pages** (`/diensten/airconditioning/installatie/daikin`) — v2 (CONT-V2-01).
- **Onderhoudscontract offering with tiers** — v2 (CONT-V2-02); Phase 4 only mentions onderhoud as a service + FAQ topic.
- **Dedicated VvE / appartement section** — v2 (CONT-V2-03); Phase 4 covers VvE/vergunning only as an FAQ topic (D-16).
- **Light blog / kennisbank** — v1.x fast-follow (BLOG-01); Phase 4's CONT-09 is on-page FAQ, not blog articles.
- **Per-pillar OG images / GA4 / aggregateRating beyond the single sourced set** — later enhancements (per Phase 3 deferred list).
- **Home-page visual/layout rebuild** — Phase 6 (D-18 keeps Phase 4 to data/content on the home).

*No reviewed-but-deferred todos — todo backlog was empty.*

</deferred>

---

*Phase: 4-Content Fill & Editorial Gate*
*Context gathered: 2026-06-06*
