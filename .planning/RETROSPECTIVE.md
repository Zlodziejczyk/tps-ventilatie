# Retrospective — TPS klimaattechniek

Living retrospective across milestones. Newest milestone first.

## Milestone: v1.0 — Launch

**Shipped:** 2026-08-12
**Phases:** 7 | **Plans:** 53

### What Was Built

A 6-page pre-launch proposal became a launch-ready ~22-page, SEO-driven, lead-generation climate-tech site: a typed taxonomy single-source-of-truth feeding routes/nav/sitemap/JSON-LD; a data-driven template rendering the hub + 4 pillars + ~17 sub-services; full SEO infrastructure (programmatic sitemap/robots, server-rendered JSON-LD, canonical/OG, GBP, analytics); unique owner-reviewed Dutch content on every page; a secure hybrid lead path (`/api/lead` with a server-only GHL secret, Zod, honeypot, WhatsApp-first notification); a conversion-rebuilt homepage; and WCAG 2.1 AA remediation. Post-milestone: a `/projecten` showcase from real owner photos.

### What Worked

- **Strict dependency ordering.** Taxonomy → templates → SEO infra → content → lead path → conversion → a11y. Each phase had fixed targets from the one before; almost no rework across phase boundaries.
- **Taxonomy-first, build-blocking gates.** A Zod-validated registry + prebuild uniqueness/anti-claim gates caught drift (URLs, keywords, forbidden claims) at build time instead of in review.
- **Preview-as-the-build-gate.** With local `next build` deadlocking on the OneDrive mount, pushing a non-main branch to a Vercel preview became the reliable CI gate. Green preview + screenshot audit repeatedly caught what a green build alone missed (e.g. the hero gradient shipping as blue blocks).
- **Decision gate discipline.** The static-export-vs-hybrid call was surfaced and logged before form work started, so form security/notification/image-opt all unblocked cleanly.
- **Owner-in-the-loop content model.** Claude drafted, owner reviewed — the hard editorial gate (CONT-10) protected against thin-content/YMYL risk without blocking the build on per-page approval.

### What Was Inefficient

- **The editorial gate stretched wall-clock.** CONT-10 stayed async for weeks waiting on the owner's whole-site sign-off (planned 2026-07 → landed 2026-08-05). Fine for a quality-gated timeline, but it kept the milestone "plan-complete but not shipped" for a long tail.
- **OneDrive mount friction.** `gsd-sdk`, git history walks, and worktrees hang or time out on this mount; several workflow steps had to be done inline/manually. Real recurring tax on every session.
- **Imagery iteration churn.** Multiple owner review rounds on AI-generated hero/pillar imagery (fake-brand artifacts, invented logos) — several re-rolls before acceptance.
- **A late audit scope-add.** Phase 7 grew mid-flight (2026-07-01 mobile re-audit added UI-11…15), needing a replan after Phase 6 landed.

### Patterns Established

- **Never push `main` / never `vercel --prod` during phase work** — all proof on preview; owner sign-off is the launch gate. (Relaxed only at milestone close: FF-merge to main → pre-prod prod deploy.)
- **Move the ref, don't churn the tree** — on the OneDrive mount, `git branch -f main HEAD` + checkout beats a checkout-then-merge that rewrites files twice.
- **Accept-with-evidence over chase** — SEO-10 mobile PSI dispositioned as throttle-bound (desktop green + field CWV) rather than chasing a synthetic number; QA-08 satisfied by a real inbound lead.
- **Deployment model documented in-repo** — main/Vercel = pre-prod; real domain attaches at finalize.

### Key Lessons

- A green Vercel build ≠ visually correct — always screenshot-audit after a UI deploy.
- Surface irreversible/architectural decisions (hosting model) as explicit gates before dependent work.
- On constrained mounts, prefer inline execution + CLI-free equivalents over the standard subagent/SDK path.
- For an owner-gated content site, treat the editorial sign-off as a first-class, long-lead dependency — plan around its async nature.

### Cost Observations

- Model mix: predominantly Opus for planning/execution (quality profile).
- Execution: inline (no worktrees/parallel subagents) due to the OneDrive constraint.
- Notable: the single biggest schedule cost was external (owner sign-off + imagery rounds), not build effort.

---

## Cross-Milestone Trends

_Populated as more milestones ship._

| Milestone | Shipped | Phases | Plans | Standout lesson |
|-----------|---------|--------|-------|-----------------|
| v1.0 Launch | 2026-08-12 | 7 | 53 | Dependency-ordered phases + preview-as-gate; owner editorial sign-off is a long-lead dependency |
