# Phase 4: Content Fill & Editorial Gate - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-06
**Phase:** 04-content-fill-editorial-gate
**Areas discussed:** Owner-input gating & sequencing, Editorial workflow & sign-off, YMYL accuracy (subsidie/pricing/claims), Differentiation/voice/reviews, Scope seams (home / brand logos / cross-sell / OG card)

---

## Owner-input gating & sequencing

### Drafting sequence vs. the unfilled intake form
| Option | Description | Selected |
|--------|-------------|----------|
| Draft now, quarantine claims | Draft all researchable copy immediately; only owner-gated claims wait | ✓ |
| Draft now, hold all publishing | Write everything but flip nothing to published until form returns | |
| Block on the form first | Send form, wait for Thomas, then draft against real answers | |

### Behavior of unverified owner-gated items
| Option | Description | Selected |
|--------|-------------|----------|
| Omit entirely until verified | No mark/claim/rating renders at all until confirmed | |
| Neutral placeholder copy | Safe generic trust phrasing now, swapped for named marks/ratings later | ✓ |
| You decide per item | Choose safest behavior item-by-item | |

**Notes:** Refined in the YMYL area — neutral phrasing must be *literally true* (no "gecertificeerd" until a cert is confirmed).

### Drafting/publishing order
| Option | Description | Selected |
|--------|-------------|----------|
| Pillar-by-pillar, complete silos | Finish a whole pillar before the next | ✓ |
| All intros first, then depth | Get every page over 120w fast, then add steps/FAQs | |
| Priority pillars first | Lead with highest commercial-value pillars | |

### Is the intake form in Phase 4 scope?
| Option | Description | Selected |
|--------|-------------|----------|
| In-scope: Phase 4 owns it | Publish Tally 2EojAA, send to Thomas, map returns to code | ✓ |
| Parallel task, consumed here | Form handled outside GSD; plan around the gate | |
| You decide | — | |

---

## Editorial workflow & sign-off (CONT-10)

### How non-technical Thomas reviews/approves
| Option | Description | Selected |
|--------|-------------|----------|
| Vercel preview deploy | Reviews rendered pages on a preview URL | ✓ |
| Generated review doc | Export copy to a doc for comment-style review | |
| Both: preview + comment doc | Preview for look, doc for line-edits + sign-off record | |

### How approval is recorded
| Option | Description | Selected |
|--------|-------------|----------|
| Status flip = the record | The git commit flipping status is the audit trail | ✓ |
| Checklist doc + status flip | Tracked checklist alongside the flip | |
| You decide | — | |

### Sign-off granularity
| Option | Description | Selected |
|--------|-------------|----------|
| Per-pillar batch | Approve a whole pillar at a time (~5 rounds) | |
| Whole-site, one review | One review pass over all 21 pages before launch | ✓ |
| Per-page approval | Page-by-page sign-off | |

### 3-state status usage
| Option | Description | Selected |
|--------|-------------|----------|
| draft → review → published | review = content-done+gate-passed (noindex); published = approved+indexed | ✓ |
| draft → published directly | Skip the middle state | |
| You decide | — | |

### Reconciliation: launch shape
| Option | Description | Selected |
|--------|-------------|----------|
| Draft incrementally, publish in one batch | Pillar-by-pillar drafting → review → one whole-site review → batch-publish at launch | ✓ |
| Publish each pillar as approved | Index pillars incrementally | |
| Hybrid: a couple of grouped reviews | ~2 review batches | |

**Notes:** Surfaced as a consistency check between Area 1 (per-pillar) and Area 2 (one review). Resolved: drafting is incremental, publishing is a single batch go-live.

---

## YMYL accuracy: subsidie, pricing & claims

### ISDE/subsidie depth
| Option | Description | Selected |
|--------|-------------|----------|
| Eligibility + conditions + RVO link, amounts to consult | Accurate, durable, low-risk; route euro amounts to a consult | ✓ |
| Sourced + concrete amounts + 2026 date stamp | Fullest E-E-A-T; needs verified figures + maintenance | |
| You decide per pillar | Concrete for WP, eligibility-only for WTW/MV | |

### Pricing transparency (CONT-05)
| Option | Description | Selected |
|--------|-------------|----------|
| Confirm existing table + add all-in clarity | Owner confirms numbers; add incl-BTW + voorrijkosten; WP op maat | ✓ |
| Shift to 'vanaf' indicative ranges | Soften to ranges + always-quote | |
| You decide | — | |

### Certification/keurmerk + interim phrasing
| Option | Description | Selected |
|--------|-------------|----------|
| Hard gate; interim phrasing literally true | No named mark until proof; no "gecertificeerd" until a cert confirmed | ✓ |
| Allow generic "gecertificeerd" pre-verification | Assume basic certs exist | |
| You decide | — | |

### Anti-claim list
| Option | Description | Selected |
|--------|-------------|----------|
| Lock the anti-claim list | No airco-ISDE, no Belgian 6% BTW, no unverified dealer/erkend, no unheld keurmerken, no ratings without real Google source | ✓ |
| Lock it + I'll add more | Start from the list + add TPS-specific don'ts | |
| You decide | — | |

---

## Differentiation, voice & reviews

### Site voice
| Option | Description | Selected |
|--------|-------------|----------|
| Formal 'u', professional-warm | Matches shipped copy + premium positioning | ✓ |
| Informal 'je', approachable | Matches intake form, but contradicts shipped copy | |
| You decide | — | |

### Per-page uniqueness
| Option | Description | Selected |
|--------|-------------|----------|
| Per-page intent angle + service-specifics | Each page leads with its own angle + concrete details | ✓ |
| Differentiate mainly via unique FAQs | Lean on FAQ variation | |
| You decide | — | |

### FAQ topic allocation
| Option | Description | Selected |
|--------|-------------|----------|
| Pillar = decision FAQs, sub = task FAQs | One canonical home per topic; internal-link the rest | ✓ |
| Map each topic to its single best-fit page | Strict one-topic-one-page | |
| You decide | — | |

### Reviews consolidation model (CONT-08)
| Option | Description | Selected |
|--------|-------------|----------|
| Single source + gated aggregateRating + score/count/link | One module replaces 3 scattered copies; wire ratings from real Google data | ✓ |
| Keep scattered reviews, just add score/count/link | Minimal; duplication persists | |
| You decide | — | |

---

## Scope seams

### Home boundary (Phase 4 vs Phase 6)
| Option | Description | Selected |
|--------|-------------|----------|
| Data/content only, minimal | Reviews source + score/count/link + USP copy; no visual | ✓ |
| Also light visual polish now | Small home visual tweaks too | |
| Leave home entirely to Phase 6 | Defers CONT-08 home requirement | |

### Brand logos
| Option | Description | Selected |
|--------|-------------|----------|
| Text chips now, real logos on owner upload | Wait for intake §9 | |
| Source official logos ourselves now | Proactively obtain official brand SVGs (usage-guideline compliant) | ✓ |
| You decide | — | |

### Cross-pillar cross-sell
| Option | Description | Selected |
|--------|-------------|----------|
| Add light editorial cross-sell where natural | Tasteful cross-links via relatedOverride | ✓ |
| Same-pillar siblings only | Defer all cross-pillar to v2 | |
| You decide | — | |

### Branded OG card (999.1)
| Option | Description | Selected |
|--------|-------------|----------|
| Leave in backlog | Design task, pair with Phase 6 | |
| Pull into Phase 4 once logo arrives | Quick win while asset in hand | |
| You decide | Claude's call | ✓ |

**Notes:** Claude's decision — keep 999.1 in backlog as formal home, mark it logo-unblocked by the intake; produce opportunistically if the logo is in hand during execution.

---

## Claude's Discretion

- OG card (999.1) timing (user "you decide") → backlog default, logo-unblocked, opportunistic.
- Reviews module layout (`lib/reviews.ts` vs `SITE.reviews`) — within the single-source intent.
- Per-page intent-angle wording + the topic→page FAQ map — drafted during execution.
- Anti-claim list as a written checklist vs. an additional `scripts/` assertion.
- `draft → review` flip granularity (per-pillar vs per-page commit).

## Deferred Ideas

- Branded OG card 999.1 (backlog, logo-unblocked).
- Deep energy-savings cross-sell → v2 (CONT-V2-04).
- Per-brand dedicated pages → v2 (CONT-V2-01).
- Onderhoudscontract tiers → v2 (CONT-V2-02).
- Dedicated VvE section → v2 (CONT-V2-03); Phase 4 covers VvE as an FAQ topic only.
- Light blog/kennisbank → v1.x fast-follow (BLOG-01).
- Per-pillar OG images / GA4 → later enhancements.
- Home-page visual rebuild → Phase 6.
