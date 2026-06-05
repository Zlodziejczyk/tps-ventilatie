---
status: passed
phase: 02-routes-service-page-templates
verified: 2026-06-05
method: inline (gsd-verifier subagent unavailable — OneDrive mount deadlocks heavy subagents/build/tsc; goal-backward analysis against the green local-copy build)
requirements: [IA-02, IA-03, IA-04, IA-05, IA-06, IA-07]
score: 5/5 success criteria met
---

# Phase 2 Verification — Routes & Service-Page Templates

**Goal:** Turn the taxonomy into visible, navigable pages — the `/diensten` hub, 4 pillar pages, and 17 sub-service pages — all generated from the data-driven template with stable URLs.

**Verdict: PASSED (5/5).** Evidence is the green static export (built in a local non-OneDrive copy: `npm ci` + `npm run build` exit 0, TypeScript clean, 22 service routes pre-rendered) plus source/grep checks.

## Success Criteria

### 1. Visitor can open /diensten and reach all 4 pillars, and each pillar's sub-services — PASS
- `app/diensten/page.tsx` renders a `pillars()` 4-card grid, each card `urlFor(pillar)`.
- `app/diensten/[pillar]/page.tsx` renders a `childrenOf(pillar)` `ServiceCard` grid linking to each sub-service via `urlFor`.
- Reinforced by the Navbar mega-menu (4 pillar columns + 17 sub links) and the MobileMenu accordion.
- Build export contains `/diensten`, all 4 pillar HTML, and all 17 sub-service HTML.

### 2. All ~22 pages render from one template via generateStaticParams + dynamicParams=false; production build green, every route pre-rendered — PASS
- Two templates: `app/diensten/[pillar]/page.tsx` and `app/diensten/[pillar]/[service]/page.tsx`, both `export const dynamicParams = false`, async-awaited `params`.
- Build route table: `● /diensten/[pillar]` → 4 SSG; `● /diensten/[pillar]/[service]` → 17 SSG. 30 static pages generated, build exit 0.
- `out/`: 1 hub + 4 pillar + 17 service = 22 service-route HTML files (5 spot-checks confirmed present).

### 3. Each Installatie page shows the correct brand sections via a reusable BrandGrid — PASS
- `BrandGrid` resolves `brandIds` → `BRANDS`; renders on `airconditioning/installatie` (Daikin, Mitsubishi Electric, Mitsubishi Heavy) and `warmtepompen/installatie` (Daikin, Mitsubishi Ecodan); pillar pages use `brandsForPillar`.
- `assert-registry` locks the brand sets (airco 3 / warmtepompen 2 / wtw 0 / mv 0). Text chips only — no `<img>`, no dealer/keurmerk claim (compliance).
- Self-omits on the 15 non-Installatie subs (D-06).

### 4. Reusable server-component building blocks render every service page consistently — PASS
- `ServiceHero, ServiceSteps, ServiceFAQ, BrandGrid, RelatedServices, Breadcrumbs` — all server components, composed by both route templates (D-01/D-02). Graceful omit on empty data (D-06).
- Build green = they compile and render across all 22 pages; eslint clean on all Phase-2 files.

### 5. Navbar diensten dropdown + DienstenNav reflect the live taxonomy, no hardcoded nav — PASS
- `Navbar.DienstenPanel` and `MobileMenu` build from `pillars()`/`childrenOf()`/`urlFor()`.
- `DIENSTEN_DROPDOWN` removed from constants; `DienstenNav` component deleted. `grep -rn "DIENSTEN_DROPDOWN" lib app components` and `grep -rn "DienstenNav" app components` both empty.

## Requirement Traceability
| Req | Covered by | Status |
|-----|-----------|--------|
| IA-02 (hub) | 02-04 lean hub | ✅ |
| IA-03 (route templates) | 02-03 | ✅ |
| IA-04 (generateStaticParams/dynamicParams=false) | 02-03 | ✅ |
| IA-05 (6 components) | 02-02 / 02-01 helpers | ✅ |
| IA-06 (BrandGrid) | 02-02 / 02-03 | ✅ |
| IA-07 (taxonomy nav) | 02-05 | ✅ |

## Recommended human checks (non-blocking — UX polish, not goal-blocking)
1. View the dev server / Vercel preview: confirm the pillar/sub pages render cleanly and the D-06 graceful-omit looks right on empty (warmtepompen) shells.
2. Desktop mega-menu hover open/close + 4-column layout; mobile Diensten accordion expand/collapse + every sub reachable.
3. Hub reviews strip (ReviewCarousel) behaves.

## Known items carried forward (tracked, non-blocking)
- **OneDrive build/tsc deadlock (environment):** `next build` and `tsc --noEmit` hang at 0% CPU on the OneDrive mount. The build was verified in a local copy; CI/Vercel (clean checkout) is the canonical build env.
- **Pre-existing lint debt:** 3 eslint errors + 3 warnings in 4 files untouched by Phase 2 (`FocalParticles`, `ReviewCarousel`, `SoftAurora`, `useParticleEngine`) — predate this phase; overlap Phase-5 QA-06 motion-gating. Recommend a small cleanup or fold into QA-06.
