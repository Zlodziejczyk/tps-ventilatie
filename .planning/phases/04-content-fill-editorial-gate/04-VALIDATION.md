---
phase: 04
slug: content-fill-editorial-gate
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-06
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> **This is an editorial phase.** The "tests" are structural (build-blocking Zod gate),
> factual (sourced YMYL facts + anti-claim grep), and human (owner sign-off) — NOT unit tests.
> No test framework is installed and **none should be added** (test infra is Out of Scope per
> REQUIREMENTS.md). Source: `04-RESEARCH.md` §Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (none installed; test infra Out of Scope). Validation = build-time `tsx` scripts + human editorial review. |
| **Config file** | none |
| **Quick run command** | `npx tsx scripts/validate-taxonomy.ts` (existing prebuild uniqueness gate) + `npx tsx scripts/assert-no-forbidden-claims.ts` (Wave 0 — new) |
| **Full suite command** | `npm run build` (prebuild gates + render all 22 routes) |
| **Estimated runtime** | `tsx` asserts ~seconds; full build ~30s on a clean checkout |

> ⚠️ **OneDrive runtime constraint:** `next build` and full-project `tsc` deadlock on this mount.
> Run the **full build on Vercel CI / preview deploy** (canonical env), not locally. The `tsx`
> assert scripts ARE fast/reliable locally and are the per-task gate. See memory `onedrive-execution-constraints`.

---

## Sampling Rate

- **Per drafting commit:** the prebuild gate runs on every Vercel **preview deploy** — catches structural failures (intro <120w / missing step / wrong FAQ count) immediately and renders the page for review.
- **Per pillar complete (D-03):** Claude self-review against the per-page intent-angle map + the D-13 anti-claim checklist BEFORE flipping that pillar's nodes `draft → review`.
- **Phase gate (D-07/D-09):** ONE whole-site owner review on the preview deploy → batch-flip the approved set to `published` → final green build on Vercel.
- **Max feedback latency:** one preview-deploy cycle (push → Vercel build), ~1–2 min.

---

## Requirement → Validation Map

> Per-task rows are finalized once PLAN.md files exist (verify-phase / nyquist-auditor stamps task-level status).
> At planning time the contract is keyed to requirements:

| Requirement | Behavior validated | Validator type | How | Exists? |
|-------------|--------------------|----------------|-----|---------|
| CONT-01 / 02 / 09 | intro ≥120w, ≥1 step, 3–6 FAQs on `review`/`published` nodes | **structural (build-blocking)** | `publishedContentSchema` via `scripts/validate-taxonomy.ts` (prebuild) | ✅ exists (P1) |
| CONT-01 / 02 (uniqueness *quality*) | no two pages distinguishable only by H1 (D-15) | **human** | owner + Claude editorial read on preview deploy | ✅ process (D-05/D-07) |
| CONT-04 | ISDE/subsidie facts accurate + sourced (WP yes; WTW/MV yes-from-2026 + isolatie + CO2-MV-only; airco no) | **factual** | source-URL present in copy + `[UNVERIFIED]` discipline (research found none unverified) + RESEARCH.md verified-facts table | ✅ this research |
| CONT-03 / 06 | no unverified dealer / cert / keurmerk claim | **anti-claim (build-blocking)** | `scripts/assert-no-forbidden-claims.ts` grep gate **+** written D-13 checklist | ❌ Wave 0 |
| CONT-05 | no Belgian 6% BTW; all-in incl. BTW framing honest | **anti-claim** | same grep gate (`/6\s*%\s*btw/i`) + checklist | ❌ Wave 0 |
| CONT-08 | `aggregateRating` only with REAL Google score/count | **factual + human** | slot stays empty until intake §8 returns real data; grep for stray rating literals | ✅ gated by D-13 |
| CONT-07 | Over-ons "Verhaal van Thomas" + 4 USPs present; USP copy literally true (D-02) | **human + anti-claim** | editorial read + grep ("gecertificeerd" before proof) | ⚠️ partial (Wave 0 grep) |
| CONT-10 | every shipped page owner-approved before live | **human acceptance gate** | preview review → `status` flip to `published` (git commit = audit trail) | ✅ process (D-06/D-07) |

---

## Wave 0 Requirements

- [ ] `scripts/assert-no-forbidden-claims.ts` — D-13 anti-claim grep gate, wired into the prebuild hook alongside `validate-taxonomy.ts` (covers CONT-03/05/06; mirrors existing `scripts/assert-seo.ts` pattern)
- [ ] `lib/reviews.ts` (or `SITE.reviews` extension) — single consolidated reviews source replacing the 3 scattered `REVIEWS` arrays (CONT-08, D-17)
- [ ] Written D-13 anti-claim checklist artifact (in-plan or a short `docs/` note) — handles nuance a regex can't (e.g. airco-pillar subsidie context)

*No test-framework install — explicitly NOT a gap (Out of Scope).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Per-page uniqueness *quality* (distinct intent angle, no swapped boilerplate) | CONT-01/02, D-15 | Length is automatable; distinctiveness/quality is editorial judgment | Read each pillar's pages on preview; confirm Installatie/Onderhoud/Storing/Vervangen each lead with their own angle and concrete service-specific detail |
| Whole-site owner editorial sign-off | CONT-10, D-07 | The hard gate is the owner's approval; only Thomas can give it | Thomas reviews all 21 rendered pages on the preview URL; approval = the git commit flipping `status` to `published` (D-06) |
| ISDE/subsidie factual correctness in context | CONT-04 | A grep can't judge whether a condition is stated correctly for its pillar | Cross-check each ISDE paragraph against the RESEARCH.md verified-facts table + the cited rvo.nl URL |

---

## Validation Sign-Off

- [ ] All tasks have an `<automated>` verify (tsx assert / build) or a documented manual gate + Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive content tasks without a structural (prebuild) gate
- [ ] Wave 0 covers all MISSING references (`assert-no-forbidden-claims.ts`, `lib/reviews.ts`, checklist)
- [ ] No watch-mode flags (CI/preview is non-interactive)
- [ ] Feedback latency < one preview-deploy cycle
- [ ] `nyquist_compliant: true` set in frontmatter (after the planner wires task-level verifies)

**Approval:** pending
