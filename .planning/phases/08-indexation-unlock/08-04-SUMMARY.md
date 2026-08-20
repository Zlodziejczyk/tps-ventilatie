---
phase: 08-indexation-unlock
plan: 04
subsystem: seo
tags: [seo, content, jsonld, faqpage, indexation, sitemap]

requires:
  - phase: 08-indexation-unlock
    provides: "08-03's 26-page surface, and 08-02's empty-hub Zod rejection which forced this plan to author real content before publishing"
provides:
  - "An authored, published /diensten hub — 170-word intro, the 4-step TPS traject, 5 routing FAQs, werkgebied line"
  - "ServiceIntro includeLead — a page with its own hero can render the intro's lead sentence"
  - "FAQPage + BreadcrumbList JSON-LD on the hub, backed by visible content"
  - "INDEXABLE_FLOOR = 27 — the single definition of complete, shared by the build gate and the live probe"
affects: [08-05, phase-09-measurement, phase-10-migration, phase-12-on-page-depth]

tech-stack:
  added: []
  patterns:
    - "Additive opt-in props over branching components: includeLead defaults to false so 21 existing routes are byte-identical"
    - "Ship a named threshold in the same commit that satisfies it, so the gate is never red on its own account"
    - "Structured data must be generated from the same array the page renders, and asserted to match it"

key-files:
  created: []
  modified:
    - lib/services/registry.ts
    - components/ServiceIntro.tsx
    - app/diensten/page.tsx
    - lib/seo/invariants.ts
    - scripts/assert-seo.ts
    - scripts/assert-gate-blocks.ts

key-decisions:
  - "Hub content angle is orientation and routing (D-12) — comparative by construction, so it cannot collide with the pillars' decision FAQs"
  - "ServiceIntro gained includeLead rather than the hub getting a ServiceHero: the hub's hardcoded hero is a live, converting element and D-11 says append, never rebuild"
  - "ServiceSteps is rendered on the hub so its 4 authored steps are not added to the 16 pillar steps that render nowhere"
  - "INDEXABLE_FLOOR lands with the hub publish (D-09); the probe imports it rather than deriving it (D-25)"
  - "FaqItem left unchanged (D-15) — FAQ answers name the pillar in words instead of linking; a links[] field would change the Zod contract shared by all 28 nodes inside the phase that must not break the build"

patterns-established:
  - "Perturbations must blank the property under test explicitly, never rely on real data happening to have that shape"

requirements-completed: [IDX-03, IDX-04]

duration: 47 min
completed: 2026-08-20
---

# Phase 8 Plan 04: Hub Content & the Completeness Floor Summary

**The `/diensten` hub went from an empty shell with a 69-character description to an authored orientation page — 170-word intro, the 4-step TPS traject, 5 routing FAQs, all rendering — published as the 27th indexable page, with `INDEXABLE_FLOOR = 27` landing in the same commit that makes 27 true.**

## Performance

- **Duration:** 47 min
- **Started:** 2026-08-20T12:44:00Z
- **Completed:** 2026-08-20T13:31:00Z
- **Tasks:** 5 (4 auto + 1 checkpoint)
- **Files modified:** 6

## Accomplishments

- **The umbrella page has a reason to rank.** It answers the question a visitor actually arrives with — "which of these four do I need?" — instead of being a card grid with a placeholder description.
- **Every authored word renders, proven on served HTML.** All 10 intro sentences including the lead, 4 step titles and bodies, 5 FAQ questions and answers, and the werkgebied line were each found in the fetched page. That is the concrete discharge of the CONTEXT hard constraint, not a source-level claim.
- **The lead-sentence trap was real and was closed properly.** `ServiceIntro` drops the intro's first sentence by design (pillar heroes show it). The hub has no `ServiceHero`, so the naive wiring would have silently dropped it. `includeLead` fixes it additively — all 21 existing routes verified byte-identical in the default path.
- **`FAQPage` markup is backed by FAQs a visitor can see** — asserted to equal the rendered count, which is what Google's structured-data policy asks for.
- **"Complete" is now one number in one place.** `INDEXABLE_FLOOR = 27` is enforced by the build gate and will be imported by 08-05's live probe, so the data check and the served-site check cannot disagree.

## Task Commits

1. **Task 1: Author the hub content** — `77d717a` (content)
2. **Task 2: ServiceIntro includeLead seam** — `021411e` (feat)
3. **Task 3: Render intro + steps + FAQ + JSON-LD** — `d4fa6ac` (feat)
4. **Task 4: Publish the hub + INDEXABLE_FLOOR = 27** — `9cddfc4` (feat)
5. **Task 5: Preview gate** — no code commit; verification recorded below

## Files Created/Modified

- `lib/services/registry.ts` — `HUB_PAGE.content` authored (intro / 4 steps / 5 FAQs / localAngle), `metaTitle` + `metaDescription` rewritten (description 69 → 155 chars), `status` → `published`
- `components/ServiceIntro.tsx` — additive `includeLead` prop, default `false`; header documents both modes and names the constraint
- `app/diensten/page.tsx` — appends `ServiceIntro` (with `includeLead`), `ServiceSteps`, `ServiceFAQ` and the JSON-LD pair; hero, cards, reviews and CTA untouched
- `lib/seo/invariants.ts` — `INDEXABLE_FLOOR = 27` with its derivation and the D-25 rationale stated inline
- `scripts/assert-seo.ts` — enforces the floor; hub assertion inverted to indexable-by-name
- `scripts/assert-gate-blocks.ts` — proof (D) repaired content-addressed; P4 now exercises the shipped constant

## Decisions Made

- **Author for the page, not for the schema.** Every element authored has a rendering home. The alternative — data-only authoring — would have produced 120+ words and FAQ markup no visitor sees, which is the defect this phase exists to remove and which also violates Google's structured-data policy.
- **`includeLead` rather than giving the hub a `ServiceHero`.** The hub's hero is a live, converting element with a distinctive accent-span headline; D-11 is explicit that this landing appends rather than rebuilds.
- **Render the traject on the hub.** `ServiceSteps` was imported by exactly one route, which is why 16 authored pillar steps render nowhere. The hub does not join them. (Those 16 remain flagged for Phase 12 — out of scope here.)
- **No pricing, certification or subsidy language on the umbrella page.** ISDE/subsidie is pillar-specific with per-pillar preconditions (anti-claim §2); an umbrella page cannot state it correctly, so it states none of it.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Proof (D) in `assert-gate-blocks.ts` decayed the moment the hub gained content**
- **Found during:** Task 3 — `npm run prebuild` went red immediately after Task 1 authored the copy
- **Issue:** The 08-02 proof published the hub and expected a Zod rejection *because the real hub's shell happened to be empty*. Once the shell was filled, publishing it validated and the assertion failed. It was the same class of decay that had turned perturbation (B) into a silent no-op: relying on real data having a shape, rather than perturbing the property under test.
- **Fix:** The perturbation now blanks the shell explicitly in the clone (`intro: "", steps: [], faqs: []`), so it tests "a hub with an empty shell cannot publish" on both sides of this landing. Comment records the lesson.
- **Files modified:** `scripts/assert-gate-blocks.ts`
- **Verification:** `npx tsx scripts/assert-gate-blocks.ts` exits 0; the proof still rejects an empty published hub with the real hub fully authored
- **Committed in:** `d4fa6ac` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** In-scope repair of the same failure class the phase targets, in a file the plan already lists under Task 4's `files_modified`. No scope creep.

## Issues Encountered

- **Verification greps false-positived on a descriptive comment** for the third time this phase (a comment reading "no serviceJsonLd — the hub is an umbrella" tripped the `serviceJsonLd` absence check). Reworded. This is now a reliable pattern in this repo: never write an anti-drift token into a comment.
- **Mobile-390 screenshot could not be captured** — see the Preview Gate table below.

## Preview Gate (Task 5)

| Item | Value |
|---|---|
| Deployment id | `dpl_9AanCxoREXoe4Kv5TT27MknvADkE` |
| Preview URL | https://tps-ventilatie-9hjao93zq-pushly-projects.vercel.app |
| Commit | `9cddfc4` |
| State | **READY** |

| Check | Result |
|---|---|
| `sitemap.xml` `<loc>` count | **27**, including `/diensten` ✅ |
| `/diensten` robots meta | `index, follow`, zero `noindex` occurrences ✅ |
| Authored content on served HTML | lead sentence + all 10 intro sentences, 4 step titles **and** bodies, 5 FAQ questions **and** answers, localAngle line — **all present** ✅ |
| JSON-LD in served HTML | `FAQPage` ×1, `BreadcrumbList` ×1 ✅ |
| Desktop 1440 visual | ✅ Reviewed. Order renders as designed: hero → intro (2 paragraphs, lead included) → 4-column pillar card grid → "Stap voor stap" 2×2 numbered steps → werkgebied line → "Veelgestelde vragen" accordions → reviews → CTA. No layout defect. |
| Mobile 390 visual | ✅ **Completed in 08-05** (against production, once the Playwright browser download finally landed) — see 08-05-SUMMARY.md |

**Mobile screenshot was blocked by tooling during this plan** (resolved later in 08-05 — see that summary for the captured result). The blocker at the time: The Chrome extension's capture is fixed at 1316 px wide and ignores `resize_window` (verified at 390 px and 500 px — the page did not reflow), and `npx playwright install chromium` does not complete in this environment (three attempts, no bytes written to the browser cache). What can be said without a screenshot: the three sections added here — `ServiceIntro`, `ServiceSteps`, `ServiceFAQ` — are the *same components already rendering on all 21 pillar and sub-service pages*, which passed the Phase-7 mobile a11y audit and have been live for weeks; the hub reuses their containers unchanged. That was a structural argument, not a visual one. **The criterion was carried into 08-05 and has since been met** — the Chromium download completed during that plan and both viewports were captured against production with no defects and no horizontal overflow.

**Owner notification (D-21): NOT SENT — awaiting operator authorization.** The plan calls for sending Thomas the preview link with a note that `/diensten` carries new copy and goes live unless he objects. Messaging the client is an outward-facing action, so it was surfaced to the operator rather than sent unilaterally. Execution was NOT blocked on it, exactly as D-21 directs. The copy carries no pricing, certification or subsidy claims, and reverting is a one-line `status` change.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- **Ready for 08-05**, the closing landing: write `scripts/verify-indexation.ts`, run it against the preview, merge, run it against production.
- `INDEXABLE_FLOOR = 27` is exported and enforced; 08-05 imports it rather than re-deriving.
- One item carries forward for the operator: the Thomas notification (the mobile visual check was completed in 08-05).

---
*Phase: 08-indexation-unlock*
*Completed: 2026-08-20*
