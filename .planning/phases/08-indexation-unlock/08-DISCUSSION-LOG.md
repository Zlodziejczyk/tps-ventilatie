# Phase 8: Indexation Unlock - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-20
**Phase:** 8-Indexation Unlock
**Areas discussed:** Gate enforcement, /diensten hub build, Static status honesty, Production proof

---

## Gate Enforcement

### Q1 — Which assert scripts should the build actually run?

| Option | Description | Selected |
|--------|-------------|----------|
| Wire all 5 | prebuild runs every existing gate; a few seconds of tsx startup per build | ✓ |
| Wire assert-seo only | Minimal diff; leaves 3 gates orphaned | |
| Keep all on-demand | No wiring; rejects the phase's second goal | |

**Notes:** Scouting found `prebuild` runs only `validate-taxonomy.ts` + `assert-no-forbidden-claims.ts` — `assert-seo`, `assert-registry`, `assert-site-shape` and `assert-gate-blocks` are executed by nothing at all.

### Q2 — What shape should the indexable floor take?

| Option | Description | Selected |
|--------|-------------|----------|
| Floor + pillars named | `>= 27` canary plus hub/4-pillars asserted by name; new draft pages stay legal | ✓ |
| Numeric floor only | Research's original proposal; a magic number with no stated intent | |
| Fully structural, no count | Every hub/pillar/service must be published; forbids WIP pages (breaks P4 D-08) | |

### Q3 — Should the relational invariant be provably-blocking?

| Option | Description | Selected |
|--------|-------------|----------|
| Extract + prove it bites | Pure checker; assert-gate-blocks runs it on perturbed clones | ✓ |
| Assertion only | Smaller diff; a subtly-wrong invariant would pass forever | |
| Prove it later | Defer to Phase 12 | |

### Q4 — Guard the buildMetadata bypass path?

| Option | Description | Selected |
|--------|-------------|----------|
| Guard the seam | Source-level check: no literal `robots:` under `app/` outside lib/seo | ✓ |
| Data path only | Trust the seam by convention, as today | |
| You decide | Planner's call | |

### Q5 — Cover Phase 12's kennisbank articles automatically?

| Option | Description | Selected |
|--------|-------------|----------|
| Source-agnostic checker | Written against policy.ts's entity collection, not `PAGES` | ✓ |
| PAGES-specific now | Simplest today; Phase 12 widens it as scheduled work | |
| You decide | Planner's call | |

### Q6 — How should the flip land, given no local build and main→production?

| Option | Description | Selected |
|--------|-------------|----------|
| Branch → preview → merge | Preview build runs the gates; probe before production | ✓ |
| Straight to main | Faster; production is the verification surface | |
| Branch, merge without preview probe | Green build treated as sufficient | |

### Q7 — Defend against a human bumping the floor to match reality?

| Option | Description | Selected |
|--------|-------------|----------|
| Named constant + loud message | Derivation stated; failure message says find what went dark | ✓ |
| Inline literal, terse message | Compact; relies on reviewer vigilance | |
| You decide | Planner's call on wording | |

### Q8 — Wire the unwired `check-radius-literals.sh` too?

| Option | Description | Selected |
|--------|-------------|----------|
| Wire it + widen to lib/ | Covers taxonomy copy, where the hub prose is about to be written | ✓ |
| Wire it as-is | Closes the "nothing runs it" gap only | |
| Leave it out | Radius literal stays a convention in lib/ | |

**Notes:** Surfaced while scouting hub regio copy — the guard greps only `app/` + `components/`, so a "60 km" literal in `lib/services/` would pass silently.

---

## /diensten Hub Build

### Q1 — Where does the authored hub content render?

| Option | Description | Selected |
|--------|-------------|----------|
| Append sections to current page | Keep hero + cards; add ServiceIntro/ServiceFAQ + JSON-LD below | ✓ |
| Full pillar-template parity | One template for all 27 pages; a visible redesign of a live page | |
| Author data only, page untouched | Fastest to `published`; writes content nobody sees | |

### Q2 — What angle for the hub's intro and FAQs?

| Option | Description | Selected |
|--------|-------------|----------|
| "Which service do I need?" | Orientation/routing; cannot overlap pillar decision FAQs | ✓ |
| One installer, four disciplines | Company-capability framing; overlaps /over-ons | |
| What is klimaattechniek? | Educational; informational on a `commercieel` node | |

### Q3 — What should the hub's steps describe?

| Option | Description | Selected |
|--------|-------------|----------|
| The shared TPS traject | Opname → advies & offerte → installatie → nazorg | ✓ |
| The selection path | Reads as a wizard; repeats the intro and cards | |
| You decide | Planner drafts within the angle | |

### Q4 — How does the hero reconcile with `splitLead`?

| Option | Description | Selected |
|--------|-------------|----------|
| Node-sourced hero | H1 + lead sentence from the node; retires two hardcoded strings | |
| Keep hero, render full intro | Zero visual risk; duplication stays | |
| You decide | Planner's call | ✓ |

**Notes:** Constraint recorded in CONTEXT.md — no authored sentence may end up rendering nowhere. `ServiceIntro` renders the intro *minus* its lead sentence because `ServiceHero` normally shows it.

### Q5 — Rewrite the hub's meta now, or wait for Phase 12?

| Option | Description | Selected |
|--------|-------------|----------|
| Rewrite the hub's only | 69-char placeholder on a page authored and indexed this phase | ✓ |
| Leave all meta to Phase 12 | One consistent pass against real query data | |
| Rewrite hub + the 4 pillars | More upside; edits owner-signed-off content without query data | |

### Q6 — Extend FaqItem to support links?

| Option | Description | Selected |
|--------|-------------|----------|
| Plain text, cards do the routing | No contract change; pillar cards sit directly above | ✓ |
| Extend FaqItem with optional links | Useful, but touches Zod + all 28 nodes | |
| You decide | Planner's call | |

### Q7 — Section order?

| Option | Description | Selected |
|--------|-------------|----------|
| hero → intro → cards → FAQ → reviews → CTA | Matches the pillar ServiceIntro placement contract | ✓ |
| hero → cards → intro → FAQ → reviews → CTA | Cards closest to the fold; breaks the convention | |
| You decide | Planner's call once copy length is known | |

### Q8 — Should the hub carry a localAngle regio line?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, werkgebied line | Local signal on the page the umbrella term depends on | ✓ |
| Leave it empty | Regio already in meta, JSON-LD and the pillars | |
| You decide | Planner's call | |

### Q9 — How many FAQs (gate allows 3–6)?

| Option | Description | Selected |
|--------|-------------|----------|
| 5 | Off the gate floor; covers the distinct routing questions | ✓ |
| 3 — minimum | Sits exactly on the Zod floor; brittle | |
| 6 — maximum citable surface | Most GEO material; longest scroll on a routing page | |

### Q10 — JSON-LD depth on the hub?

| Option | Description | Selected |
|--------|-------------|----------|
| FAQPage + BreadcrumbList | Parity with pillars using existing helpers; no new code | ✓ |
| Add an ItemList of the 4 pillars | Expresses the IA; new helper, thin evidence of benefit | |
| You decide | Planner's call within Rich-Results validity | |

---

## Static Status Honesty

### Q1 — How should the statics' status become honest?

| Option | Description | Selected |
|--------|-------------|----------|
| Unify the predicate | `status === "published"` for all types; privacy-beleid pinned false at the gate | ✓ |
| Relabel only, keep the special case | Smallest diff; honesty stays skin-deep | |
| Add an `unlisted` status | Most truthful; widens the shared Zod contract | |

### Q2 — How to shape commits when the floor would fail before the flip?

| Option | Description | Selected |
|--------|-------------|----------|
| Split the gate | Relational check first (true at 5 and at 27); floor lands with the flip | ✓ |
| One commit: gate + flip together | No intermediate state; fuses code with 28 data edits | |
| Accept red intermediate commits | Honest about the broken state; normalises red builds | |

### Q3 — Where does the atomic predicate + statics pair sit?

| Option | Description | Selected |
|--------|-------------|----------|
| Its own commit between gate and flip | The one edit that could de-index the home page gets its own revert | ✓ |
| Fold into the flip commit | Fewer commits; buries a risky predicate change in a data diff | |
| You decide | Planner's call on granularity | |

### Q4 — Does publishing the hub block on fresh owner sign-off?

| Option | Description | Selected |
|--------|-------------|----------|
| Notify, don't block | Send Thomas the preview link; proceed unless he objects | ✓ |
| Gate on explicit approval | Faithful to P4 D-05/D-07; open-ended stall on the foundation phase | |
| Publish, flag for retro-review | Least friction; nobody outside the repo reviews the copy | |

**Notes:** The 2026-08-05 sign-off covered the 21 service pages, not the new hub prose. Last review round took roughly seven weeks.

---

## Production Proof

### Q1 — How are the served-output criteria verified?

| Option | Description | Selected |
|--------|-------------|----------|
| Committed probe script | `scripts/verify-indexation.ts <baseUrl>`; reusable by Phase 10 | ✓ |
| Manual curl checklist | Zero code; leaves no artifact and nothing re-runs | |
| Browser harness (Playwright) | Real rendering; flake and setup for no extra signal | |

### Q2 — When does the probe run?

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit runs at two gates | Preview before merge, production after | ✓ |
| Automate post-deploy | Stronger, but no CI exists on this repo | |
| Both — manual now, automate in-phase | Pulls CI setup into the foundation phase | |

### Q3 — What does the probe assert?

| Option | Description | Selected |
|--------|-------------|----------|
| Count + noindex + 200 + no redirect + canonical | Arrives already load-bearing for Phase 10 | ✓ |
| Just the two criteria | Would pass a sitemap full of 301s or 404s | |
| Add reverse coverage | Most thorough; duplicates the build gate against live data | |

### Q4 — Where does the probe's expected count come from?

| Option | Description | Selected |
|--------|-------------|----------|
| Import the gate's named constant | The number lives in exactly one place | ✓ |
| Derive it from the taxonomy live | Probe would share the source of truth it checks | |
| Pass it as a CLI argument | Independent, but typed from memory each run | |

---

## Claude's Discretion

- Hero/intro seam on `/diensten` — node-sourced hero vs keeping the hardcoded hero, with the hard constraint that no authored sentence renders nowhere.
- Module layout and naming for the extracted pure checker within the `lib/seo/*` family.
- Whether the seam guard is regex- or AST-based, and its exact match set.
- Exact Dutch wording of the hub intro, 5 FAQ pairs, steps and werkgebied line.
- Commit granularity beyond the four ordered landings.

## Deferred Ideas

- `FaqItem.links[]` — optional per-FAQ links routing to pillars. Pairs with Phase 12 (SEO-12).
- Post-deploy automation of `verify-indexation.ts` — fits Phase 9 Measurement Foundation; no CI exists today.
- An `unlisted` / `noindex` `PageStatus` value for complete-but-excluded pages — revisit if a second such page appears.
- Title/meta rewrite for the other 26 pages — deliberately left to Phase 12's data-driven pass.
