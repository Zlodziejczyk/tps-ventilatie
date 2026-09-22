# Roadmap: TPS klimaattechniek

## Milestones

- ✅ **v1.0 Launch** — Phases 1–7 (shipped 2026-08-12) — full ~22-page SEO-driven lead-gen site with a secure lead path. Archive: [`milestones/v1.0-ROADMAP.md`](milestones/v1.0-ROADMAP.md)
- 🚧 **v1.1 Rebrand Migration & SEO Ranking Push** — Phases 8–13 (started 2026-08-20) — unlock the 21 noindexed service pages, retire the old brand reversibly, and push local ranking

## Phases

<details>
<summary>✅ v1.0 Launch (Phases 1–7) — SHIPPED 2026-08-12 · 53/53 plans</summary>

- [x] Phase 1: Taxonomy & Data Model (6/6 plans) — completed 2026-06-02
- [x] Phase 2: Routes & Service-Page Templates (6/6 plans) — completed 2026-06-05
- [x] Phase 3: SEO Infrastructure (8/8 plans) — completed 2026-06-06
- [x] Phase 4: Content Fill & Editorial Gate (9/9 plans) — content shipped; owner sign-off 2026-08-05
- [x] Phase 5: Lead Capture, Form Security & Launch QA (6/6 plans) — completed 2026-07-09
- [x] Phase 6: Homepage conversion uplift (6/6 plans) — completed 2026-07-01
- [x] Phase 7: UI/UX & Accessibility Remediation (12/12 plans) — completed 2026-07-07

Full phase detail, success criteria, decisions, and deferred items: [`milestones/v1.0-ROADMAP.md`](milestones/v1.0-ROADMAP.md).

</details>

### 🚧 v1.1 Rebrand Migration & SEO Ranking Push (Phases 8–13)

**Milestone goal:** Finish the TPS Ventilatie → TPS klimaattechniek migration end-to-end and make the site
genuinely rank — starting by un-hiding the 21 service pages Google has never been allowed to index.

- [x] Phase 8: Indexation Unlock (IDX-01…05) (completed 2026-08-20)
- [x] Phase 9: Measurement Foundation (MEAS-01…06) (completed 2026-09-18)
- [ ] Phase 10: Reversible Old-Brand Migration (MIG-01…10)
- [ ] Phase 11: Local Presence — GBP & Citations (GBP-01…08, NAP-01…05)
- [ ] Phase 12: On-Page Depth & Kennisbank (SEO-11…15, BLOG-01/03/04/05)
- [ ] Phase 13: Brand Tail (BRND-01…02)

---

#### Phase 8: Indexation Unlock

**Goal:** Make the 21 built-but-hidden service pages visible to Google, and make that class of regression
impossible to ship silently again.
**Requirements:** IDX-01, IDX-02, IDX-03, IDX-04, IDX-05

**Why first:** every other phase compounds on it. Redirects, GSC submission, internal linking and
kennisbank links all need live, indexable targets.

**Success criteria:**

1. `scripts/assert-seo.ts` asserts sitemap membership ⇔ `isIndexable()` per node plus an indexable floor, and fails if either breaks
2. Production HTML for all 21 service URLs contains no `noindex` directive
3. Production `sitemap.xml` returns 27 URLs
4. `/diensten` renders real content passing the ≥120-word / 3–6 FAQ gate
5. `npm run build` passes on Vercel with the new assertions in place

**Note:** IDX-01 must land **before** IDX-02 — the existing gate hardcodes `length === 5` and would
otherwise block its own fix.

#### Phase 9: Measurement Foundation

**Goal:** Be able to prove what the milestone did, and capture the pre-migration state while it still exists.
**Requirements:** MEAS-01, MEAS-02, MEAS-03, MEAS-04, MEAS-05, MEAS-06

**Why here:** MEAS-02 and MEAS-04 are only possible while the legacy domain still resolves to WordPress.
Once Phase 10 repoints it, verifying the old property and baselining its rankings gets much harder.

**Success criteria:**

1. All four properties verified in GSC — both variants of each domain (domain-level where possible)
2. Sitemap submitted and GSC reports it processed with 27 discovered URLs
3. Baseline artefact committed: GSC export, ranking snapshot, GBP state, full DNS zone snapshot
4. Indexing requested for the hub + 4 pillars
5. Vercel Analytics reporting live traffic

**Plans:** 6/6 plans complete

**Wave 1**

- [x] 09-01-PLAN.md — Baseline directory: read-only DNS snapshot script + live snapshots, rescue of the 2026-09-16 evidence (D-26/D-27 records), GBP state (wave 1)
- [x] 09-02-PLAN.md — GSC service account + JWT auth, Search Console API client, Search Analytics/sitemap export and the 24-query shortlist (wave 1)
- [x] 09-03-PLAN.md — Fifth + legacy URL-prefix properties, ownership delegation, Vercel Web Analytics/Speed Insights + verification env var, `verify-measurement.ts` probe (wave 1)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 09-04-PLAN.md — Pure indexation thresholds (ramp + regressions, proven to bite) and the weekly `measure-indexation.ts` reading (wave 2)

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 09-05-PLAN.md — GitHub Actions: weekly measurement cron with alert issues + post-deploy `verify-indexation` on Production deployments, both observed on real runs (wave 3)

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 09-06-PLAN.md — Geolocated SERP baseline with honest zeroes, D-17 completeness gate, analytics-after-24h proof, runbook/REQUIREMENTS/npm-script reconcile (wave 4)

#### Phase 10: Reversible Old-Brand Migration

**Goal:** Retire `tpsventilatie.nl` as a competing brand and pass its equity to the new domain — without
breaking the owner's email and without closing the door on a revert.
**Requirements:** MIG-01…MIG-10

**Why here:** the redirect targets must already be indexable (Phase 8) and the old property must already
be GSC-verified and baselined (Phase 9).

**Success criteria:**

1. Every one of the 9 legacy URLs reaches its target in exactly one hop, from **both** legacy hostnames
2. `info@tpsventilatie.nl` verified sending and receiving after cutover; SPF no longer contains `a`
3. Owner has working webmail and WP-admin routes that do not depend on the apex, verified pre-cutover
4. Credential-free public content mirror of the 9 legacy pages committed under `docs/baseline/`, captured while the old site is still live; WordPress install left intact and reachable *(amended by Phase 10 D-02/D-03 — see REQUIREMENTS MIG-01)*
5. Change of Address submitted for every verified legacy variant
6. Build gate fails on any redirect chain or non-200 destination

**Hard gates:** the pre-flight checklist (MIG-01…04) completes before any DNS change — MIG-01 being the
credential-free content mirror of the 9 live legacy pages (D-02/D-03), MIG-02 the SPF tidy, MIG-03 the
owner's webmail route and MIG-04 the WP-admin route, each verified while the old site still answers on
its own IP. This is the phase with a real point of no return — roughly 3–4 weeks after cutover,
reverting becomes a second migration.

**Plans:** 3/10 plans executed

**Wave 1** *(reversible prep — no external effect; runs on `gsd/phase-10-reversible-old-brand-migration`)*

- [x] 10-01-PLAN.md — Amend MIG-01 to the content mirror, realign ROADMAP criterion 4 and the hard-gate line, correct PROJECT.md §Context, regenerate CLAUDE.md from corrected sources (wave 1)
- [x] 10-02-PLAN.md — The credential-free legacy content mirror taken while the old site is still live, with CAPTURE.md, a dated baseline manifest and a privacy gate (wave 1)
- [x] 10-03-PLAN.md — Typed 9-entry map + host-gated catch-all, the pure injectable checker, `prebuild` guard #9 with R1–R9 negative proofs, and the `next.config.ts` trailing-slash pin (wave 1)

**Wave 2** *(blocked on 10-02 for 10-04; on 10-03 for 10-05 and 10-06)*

- [ ] 10-04-PLAN.md — Owner continuity: webmail + WP-admin routes with the dated certificate caveat, the permanent former-name footer line, and the one Dutch message to Thomas (wave 2)
- [ ] 10-05-PLAN.md — `verify-redirects.ts`: exhaustive one-hop live probe on both legacy hostnames, wired into the post-deploy job and gated on the declared cutover so it is never expected-red (wave 2)
- [ ] 10-06-PLAN.md — Weekly GSC legacy section: Search Analytics + 9 URL inspections, two flag codes with stated derivations, both observed firing (wave 2)

**Wave 3** *(the pre-flight hard gate — blocked on waves 1–2)*

- [ ] 10-07-PLAN.md — Land the map in production (live but inert), attach both legacy hostnames with no Vercel redirect, prove the whole map through a spoofed `Host` header, write the rollback procedure (wave 3)

**Wave 4** *(dd24 session 1 — must be ≥8 h before the flip, D-04/D-05)*

- [ ] 10-08-PLAN.md — TTL to 300 on both hostname records and SPF without `a`, verified at all three nameservers twice, with `earliest_flip_at` recorded (wave 4)

**Wave 5** *(🚪 THE ONE-WAY DOOR — dd24 session 2, one live session, D-07)*

- [ ] 10-09-PLAN.md — Repoint apex + `www` to Vercel, then within minutes: three-nameserver `dig`, the full one-hop probe, certificates at T+2/T+15/T+30, the mail round-trip, the T+30 decision, and declaring the cutover (wave 5)

**Wave 6** *(post-flip, same day)*

- [ ] 10-10-PLAN.md — Change of Address from all three verified legacy properties, the consolidated evidence manifest, the pre-addressed day-28 declaration and the dated 2026-10-30 certificate check (wave 6)

#### Phase 11: Local Presence — GBP & Citations

**Goal:** Make Google's entity record for this business correct, consistent, and unambiguous under the new brand.
**Requirements:** GBP-01…08, NAP-01…05

**Success criteria:**

1. GBP primary category is the correct HVAC/installation category with ≤4 secondaries, website URL on the `www` host
2. Services list mirrors the taxonomy; service area set from the 8 confirmed areas
3. A master NAP record exists and Tier-1 + Tier-2 listings match it exactly
4. GBP name reads `TPS klimaattechniek`, changed in an isolated session **after** citations already show it
5. 72h post-rename the profile is unsuspended with all 34 reviews and the 4,9 rating intact

**Sequencing inside the phase is load-bearing:** low-risk GBP edits (URL, hours, Services, photos) →
citation cleanup → **then** the name change, alone. Editing name + categories + URL together reads to
Google as a listing takeover, which is the top suspension trigger.

#### Phase 12: On-Page Depth & Kennisbank

**Goal:** Turn 27 indexable pages into pages that actually compete, and add supporting content.
**Requirements:** SEO-11…15, BLOG-01, BLOG-03, BLOG-04, BLOG-05

**Independent of Phases 10–11** — could run in parallel if capacity allows.

**Success criteria:**

1. A keyword→page map covers all 27 pages with no two pages targeting the same primary term
2. Internal linking connects hub → pillar → sub-service, with a gate proving no dead internal links
3. `/projecten` cases are linked from the service pages they evidence
4. 3–5 kennisbank articles live, each clearing the service-page content bar and linking to ≥2 pillars
5. Articles appear in the sitemap via `policy.ts` — not a parallel list — and emit valid Article JSON-LD

#### Phase 13: Brand Tail

**Goal:** Remove the last places the old brand lives, once everything else is verified stable.
**Requirements:** BRND-01, BRND-02

**Success criteria:**

1. Footer social icons and JSON-LD `sameAs` carry the owner's IG/FB URLs
2. Repo and Vercel project renamed to `tpsklimaattechniek`
3. Post-rename verification passes: custom domains still attached, `/api/lead` still delivers, env vars intact

**Why last:** the rename has zero SEO value and real collateral risk — it changes the `*.vercel.app`
domain and 404s previously shared preview URLs. It must never be able to jeopardise the rest.

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Taxonomy & Data Model | v1.0 | 6/6 | Complete | 2026-06-02 |
| 2. Routes & Service-Page Templates | v1.0 | 6/6 | Complete | 2026-06-05 |
| 3. SEO Infrastructure | v1.0 | 8/8 | Complete | 2026-06-06 |
| 4. Content Fill & Editorial Gate | v1.0 | 9/9 | Complete | 2026-08-05 |
| 5. Lead Capture, Form Security & Launch QA | v1.0 | 6/6 | Complete | 2026-07-09 |
| 6. Homepage conversion uplift | v1.0 | 6/6 | Complete | 2026-07-01 |
| 7. UI/UX & Accessibility Remediation | v1.0 | 12/12 | Complete | 2026-07-07 |
| 8. Indexation Unlock | v1.1 | 5/5 | Complete    | 2026-08-20 |
| 9. Measurement Foundation | v1.1 | 6/6 | Complete    | 2026-09-18 |
| 10. Reversible Old-Brand Migration | v1.1 | 3/10 | In Progress|  |
| 11. Local Presence — GBP & Citations | v1.1 | 0/? | Not started | — |
| 12. On-Page Depth & Kennisbank | v1.1 | 0/? | Not started | — |
| 13. Brand Tail | v1.1 | 0/? | Not started | — |

## Backlog

Deferred items captured outside the active phase sequence. Review or promote with `/gsd-review-backlog`.

- [ ] **999.1: Branded OG / Social-Share Card** (BACKLOG) — Replace the launch-default `public/og-default.jpg` (plain grey fan product shot, no brand) with a purpose-designed 1200×630 card carrying the TPS klimaattechniek logo + tagline. Origin: Phase 3 SEO UAT gap 12 (cosmetic, SEO-05). Needs owner logo asset; natural pairing with v1.1. Detail: `.planning/phases/999.1-branded-og-card/999.1-CONTEXT.md`
