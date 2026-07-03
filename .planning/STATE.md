---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-07-01T15:32:06.272Z"
last_activity: 2026-07-01 -- Phase 6 execution started
progress:
  total_phases: 7
  completed_phases: 4
  total_plans: 49
  completed_plans: 34
  percent: 57
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-02)

**Core value:** Turn local search demand into contacted leads — a prospect in the Zoetermeer region finds TPS, trusts it, reaches out, and the owner is notified instantly.
**Current focus:** Phase 6 — homepage-conversion-uplift

## Current Position

Phase: 6 (homepage-conversion-uplift) — COMPLETE & FINALIZED (all 6 plans; preview build green; owner-reviewed)
Plan: 6 of 6
Status: Phase 6 finalized — homepage approved on preview; no open items. Ready to merge to main (go-live) on owner go-ahead.
Last activity: 2026-07-03 -- Phase 6 finalized (owner reviewed homepage; WTW/MV brands + erkend badges in; brand-color polish waived)

Progress: [██████████] 97%

## Performance Metrics

**Velocity:**

- Total plans completed: 12
- Average duration: — min
- Total execution time: 0.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 6 | - | - |
| 02 | 6 | - | - |

**Recent Trend:**

- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 01 P01 | 30 | 2 tasks | 3 files |
| Phase 02 P02-01 | 18min | 2 tasks | 2 files |
| Phase 02 P02-02 | 12min | 6 tasks | 6 files |
| Phase 02 P02-03 | 10min | 2 tasks | 2 files |
| Phase 02 P02-04 | 8min | 2 tasks | 2 files |
| Phase 02 P02-05 | 12min | 3 tasks | 3 files |
| Phase 02 P02-06 | 40min | 3 tasks | 4 files |
| Phase 03 P03-01 | ~25 min | 2 tasks | 2 files |
| Phase 03 P03-02 | ~15 min | 2 tasks | 2 files |
| Phase 03 P03-03 | ~15 min | 2 tasks | 1 files |
| Phase 03 P03-04 | ~10 min | 2 tasks | 2 files |
| Phase 03 P03-05 | ~15 min | 3 tasks | 3 files |
| Phase 03 P03-06 | ~10 min | 2 tasks | 2 files |
| Phase 03 P03-07 | ~12 min | 2 tasks | 6 files |
| Phase 03 P03-08 | ~40 min | 3 tasks | 2 files |
| Phase 05 P01 | ~12 min | 4 tasks | 5 files |
| Phase 05 P02 | ~10 min | 2 tasks | 2 files |
| Phase 05 P04 | ~12 min | 2 tasks | 2 files |
| Phase 05 P05 | ~15 min | 3 tasks | 6 files |
| Phase 05 P03 | ~18 min | 3 tasks | 4 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Broaden positioning to "klimaattechniek" (4 pillars: Airco, Warmtepompen, WTW, MV)
- Service IA = `/diensten` hub + pillar + ~22 sub-service pages from a data-driven template
- Claude drafts content, owner reviews before publish (hard editorial gate in Phase 4)
- ⚠️ OPEN: Static-export vs hybrid for a secure form route — decision gate owned by Phase 5 (recommended: drop `output: "export"` → Vercel hybrid)
- [Phase 01]: D-07: zod (runtime) + tsx (dev) + npm prebuild hook installed; taxonomy validation now build-blocking via pre<script>
- [Phase 01]: D-03: trailingSlash: false locked in next.config.ts; output: export left untouched (Phase 5 decision gate)

### Roadmap Evolution

- Phase 6 added: Homepage conversion uplift — rebuild the home page from the validated sketch findings (proof-forward hero, equal 4-pillar grid, trust/contact band)
- Phase 7 added (2026-07-01): UI/UX & Accessibility Remediation — WCAG 2.1 AA + brand-polish from the 2026-06-30 UI/UX audit (8.7/10). Wave 1 a11y (A11Y-01 contrast / A11Y-02 heading order / A11Y-03 skip-link / A11Y-04 touch targets), Wave 2 polish (UI-05…10). A11Y-01 is the only launch-gating item. Context: .planning/phases/07-ui-ux-and-accessibility-remediation/07-CONTEXT.md

### Pending Todos

[From .planning/todos/pending/ — ideas captured during sessions]

None yet.

### Blockers/Concerns

[Issues that affect future work]

- ✅ RESOLVED (intake 2026-06-28): certifications + dealer status FINALIZED by owner / Pushly editorial sign-off — erkendInstallateur=true for Daikin + Mitsubishi (Electric/Heavy/Ecodan), BRL 100/200 surfaced; F-gassen/STEK chase dropped (upload requirement waived, physical certs held on-site); anti-claim gate patterns lifted.
- ✅ RESOLVED (intake 2026-06-28): service radius confirmed 60 km + 8 service areas; NAP corrections applied (BTW NL859640929B01, slogan "Specialist in gezond binnenklimaat"); opening hours Ma–za 08:00–17:30 added (SITE + JSON-LD + contact); legalName "TPS services" added; REVIEW_RATING 4,9/34 set (real Google data) → aggregateRating emits.
- ✅ RESOLVED (Phase 3 D-01): canonical host locked to apex `https://tpsventilatie.nl` for launch (live-confirmed: www→apex 301 in place); brand name stays "TPS klimaattechniek" (name≠domain); tpsklimaattechniek.nl migration deferred to v2 (DOM-V2-01).
- Phase 5 depends on the GHL instant-notification workflow being configured for a live end-to-end test.
- 04-09 Task 1 (map intake → gated slots) ✅ DONE 2026-06-28; company "Verhaal van Thomas" rewritten (experience/specialisaties/merken). STILL PENDING from owner: Instagram + Facebook URLs (footer + JSON-LD sameAs), project + portrait photos, logo placement (PNG in hand), and the whole-site Vercel-preview sign-off (Task 2) before batch-flipping review->published (Task 3). Async. Resume with /gsd-execute-phase 4.
- 04-09 REVISE cycle (owner preview review 2026-06-28): TIER 1 branding fixes ✅ SHIPPED (quick task 260628-q2u). TIER 2 ServiceHero redesign ✅ DONE + SHIPPED to preview (quick task 260628-4d3, b55de17) — preview https://tps-ventilatie-klwgq6xyn-pushly-projects.vercel.app (Vercel CI build PASSED: gates 27/27, TS clean, 32 pages; service page renders the new two-column hero). This preview carries TIER 1 + TIER 2 together. **Owner reviewed 2026-06-28** → TIER 2 approved; two follow-ups: (a) header logo too small → chose logo-only enlarged (drop wordmark) ✅ DONE (6fd2655), redeployed → preview https://tps-ventilatie-9jg4cvqqk-pushly-projects.vercel.app; (b) hero/site imagery → owner generated the 6-image set in Nano Banana (Gemini); Claude sips-optimized → public/images/heroes/ + WIRED IN (f91b783): the 4 pillar pages show their scene in the ServiceHero right column (service detail pages keep the trust card), over-ons gets the human trust shot. home-hero.jpg staged for the Phase 6 homepage rebuild (NOT wired — avoids throwaway). New preview https://tps-ventilatie-o6jc9yc6h-pushly-projects.vercel.app (build PASSED; verified pillar images + over-ons trust + service-detail card intact + 200s). Open imagery polish: wtw shot still shows faint AI fake-brand bottles on a background shelf (no ImageMagick locally to clone → re-roll with the strengthened prompt, or accept); invented polo logos left as generic uniforms (optional TPS-logo swap via Nano Banana). Prompts + STYLE BLOCK in IMAGE-PROMPTS-nano-banana.md. TIER 3 manufacturer/cert logos + homepage trust band still owner-blocked. (2026-06-29) Owner review #3 → pillar hero REWORKED + de-localised: LEAN hero (H1 + lead sentence + scannable key-point chips + balanced 4:3 image; commit 62edb6c) with the full description moved to a new `ServiceIntro` prose section below (readable column, chunked, SEO text stays on-page); the 4 pillar H1s de-localised to service-only ('Airconditioning'/'Warmtepompen'/'Warmteterugwinning (WTW)'/'Mechanische ventilatie') + metaTitles → 'in de regio Zoetermeer' (commit 56afb37 — visible Zoetermeer funnel removed, light geo kept only in <title>; body already had one regional coverage line; sub-service H1s were already city-free). New preview https://tps-ventilatie-r6znbcg6f-pushly-projects.vercel.app (build PASSED, verified H1s + chips + prose + image). FUTURE SEO: per-town location pages (programmatic) for local ranking, not city-in-every-header. NEXT: owner eyeballs preview r6znbcg6f → whole-site sign-off → then 04-09 Task 3.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260628-q2u | TIER 1 branding fixes (04-revise): Navbar brand+logo, stale brand refs, Nieuw badge clip | 2026-06-28 | 8fbd954 | [260628-q2u-tier-1-branding-fixes-04-revise-navbar-b](./quick/260628-q2u-tier-1-branding-fixes-04-revise-navbar-b/) |
| 260628-4d3 | TIER 2 (04-revise): ServiceHero redesign — two-column, lead/supporting split + engineered trust card (defect #4 walls of text) | 2026-06-28 | b55de17 | [260628-4d3-tier-2-servicehero-redesign](./quick/260628-4d3-tier-2-servicehero-redesign/) |
| 260701-koc | Fix StickyContactBar mobile shatter — content-sized single-row pills (<560px), digits dropped on mobile; verified 320/360/390/414 (bar 258px→114px). Rest of mobile audit → Phase 7 | 2026-07-01 | e72464f | [260701-koc-fix-stickycontactbar-mobile-layout-compa](./quick/260701-koc-fix-stickycontactbar-mobile-layout-compa/) |

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-07-01 — Phase 6 executed end-to-end (6/6 plans, 3 waves, inline sequential per OneDrive constraint).
Stopped at: Phase 6 complete — Vercel preview build READY (green). Homepage rebuilt: HomeHero island (proof-forward hero + 4-pillar grid + pillar→form gesture), ProofBand + ImageBand, ClosingCTA; app/page.tsx composes the 4 new sections (5 old sections + CTABanner retired, files left on disk for Phase-7 cleanup). Preview branch alias: tps-ventilatie-git-gsd-phase-05-lead-cap-fd0fe4-pushly-projects.vercel.app (commit 8a29d86).
POST-EXECUTION FIXES (2026-07-01, after owner visual review — screenshot audit added): (a) hero H1 gradient shipped as blue blocks — signature-gradient's `background` shorthand defeats bg-clip-text; fixed with a dedicated `gradient-text` @utility using background-image (commit 7a24d54); (b) ImageBand reframed to a content-cropped home-hero-crop.jpg (blank wall removed via sharp) + pillar cards gained hover depth + aurora opacity bumped (commit 10fa4e4). Verified via Playwright screenshots (desktop 1440 + mobile 390) — all good. LESSON: green Vercel build ≠ visually correct; always screenshot-audit after UI deploy (see memory visual-verify-after-ui-deploy).
WTW/MV BRANDS DONE (owner 2026-07-02→03): WTW = Zehnder (preferred)/Duco/Itho Daalderop, MV = Zehnder/Duco added to BRANDS + wired to the Vervangen nodes; erkendInstallateur:true (owner confirmed 2026-07-03 → verified badge renders on WTW/MV pillar pages, commit 4387d1a). Neutral fallback gone on homepage pillar grid + pillar pages. Verified on preview. Brand-mark square colors are approximate tints — owner WAIVED the official-color/logo swap (accepted as final, no open item).
FINALIZED 2026-07-03 — owner reviewed the homepage and approved; no open items for Phase 6. Merged branch → main (FF, commit 5ab3c5e); Vercel production deploy READY + verified on tps-ventilatie.vercel.app.
DEPLOYMENT MODEL (owner-clarified 2026-07-03): main + Vercel = PRE-PROD work env, NO public domain attached. `tpsventilatie.nl` is the OLD LiteSpeed site (NOT Vercel) and will be SCRAPPED. The real launch domain = `tpsklimaattechniek.nl`, attached only when the whole site is fully finalized. At domain-attach: switch CANONICAL_ORIGIN (lib/constants.ts, currently https://tpsventilatie.nl) → tpsklimaattechniek.nl (feeds canonicals/sitemap/robots/JSON-LD/OG). See memory [[tps-deploy-and-integrations]].
NEXT (owner-driven, non-blocking): (1) continue finishing the site on main/Vercel pre-prod; (2) optional behavioral spot-check (compact submit → /api/lead 200 + WhatsApp; pillar Offerte pre-select+scroll); (3) Phase 7 (UI/UX & a11y remediation) deletes the retired section files; (4) at full finalize: attach tpsklimaattechniek.nl + swap CANONICAL_ORIGIN.
Resume file: .planning/phases/06-homepage-conversion-uplift/06-CONTEXT.md

Session resumed: 2026-06-29 — restored context; frontier = Phase 5 planning (CONTEXT.md ready, decision gate resolved to hybrid). Phase 4 editorial gate remains async/owner-blocked on Thomas's whole-site sign-off (preview r6znbcg6f).
