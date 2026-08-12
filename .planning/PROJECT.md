# TPS klimaattechniek

## What This Is

TPS klimaattechniek is a Zoetermeer-based climate-technology installer — airconditioning, heat pumps (warmtepompen), and ventilation (WTW + mechanical). This is their marketing website: a **launch-ready ~22-page, SEO-driven, lead-generation site** (v1.0 shipped 2026-08-12), rebuilt from the original 6-page proposal into a full multi-service climate-tech surface with a secure lead path and instant owner notification. It currently runs **pre-prod on Vercel** (`tps-ventilatie.vercel.app`) — the one remaining step to go publicly live is attaching the `tpsklimaattechniek.nl` domain.

Built with Next.js 16 (App Router, **hybrid**: statically prerendered pages + one server `/api/lead` route), TypeScript, and Tailwind CSS v4 ("Atmospheric Clarity" design system), deployed on Vercel. Built and maintained by Pushly.nl for the client (owner: Thomas / Tomasz) as an ongoing development + maintenance engagement.

## Core Value

**Turn local search demand into contacted leads.** A prospect in the Zoetermeer region looking for airco, heat-pump, or ventilation work finds TPS, trusts it, and reaches out — and the owner is notified instantly. Every workstream (service depth, SEO, content, conversion) serves this one outcome. *(Verified still correct at v1.0 close.)*

## Current State

**Shipped v1.0 "Launch" (2026-08-12)** — 7 phases, 53 plans, 43/43 v1 requirements delivered.

- Full service surface: `/diensten` hub + 4 pillars (Airconditioning, Warmtepompen, WTW, Mechanische Ventilatie) + ~17 sub-services, all from one typed taxonomy.
- SEO infrastructure live: programmatic sitemap/robots, server-rendered JSON-LD, canonical/OG, GBP alignment, Speed Insights.
- Unique owner-reviewed Dutch content on every page; brand corrected to "TPS klimaattechniek"; hard editorial sign-off cleared 2026-08-05.
- Secure hybrid lead path: `/api/lead` server route (server-only GHL secret + Zod + honeypot), WhatsApp-first owner notification, site-wide sticky contact bar. Real inbound lead verified 2026-06-30.
- Conversion-rebuilt homepage + WCAG 2.1 AA across all pages.
- Post-milestone: `/projecten` showcase (7 cases, 21 owner photos) + unified photo treatment, merged to main.

**Tech:** Next.js 16 App Router (hybrid), React 19, TypeScript strict, Tailwind v4. Deployed on Vercel (pre-prod; no public domain yet).

## Requirements

### Validated

<!-- Pre-existing (proposal baseline) -->
- ✓ Static Next.js 16 brochure site on Vercel; home/diensten/tarieven/over-ons/contact/privacy; Navbar + Footer; GHL contact form; "Atmospheric Clarity" design system; Framer Motion + WebGL aurora — baseline

<!-- Delivered in v1.0 -->
- ✓ Taxonomy single-source-of-truth — 27-node Zod-validated registry + `urlFor()` + keyword map + build-blocking uniqueness gate — v1.0 (IA-01/08/09)
- ✓ NAP single source of truth + service radius fixed to 60 km at source — v1.0 (SEO-08, QA-03)
- ✓ Data-driven service pages — `/diensten` hub + 4 pillars + ~17 sub-services from one template — v1.0 (IA-02…07)
- ✓ SEO infrastructure — sitemap, robots, server-rendered JSON-LD (HVACBusiness/Service/BreadcrumbList/FAQPage), canonical/OG, GBP, analytics — v1.0 (SEO-01…09)
- ✓ Unique owner-reviewed Dutch content on every page + owner editorial sign-off — v1.0 (CONT-01…10)
- ✓ Secure hybrid lead path — `/api/lead`, server-only secret, Zod, honeypot; WhatsApp-first instant notification; site-wide WhatsApp; fail-safe error UI; AVG consent — v1.0 (LEAD-01…06, QA-01/02/04/05/06/07/08)
- ✓ Mobile CWV launch pass — accepted throttle-bound (desktop green; field-monitored) — v1.0 (SEO-10)
- ✓ Conversion homepage rebuild (proof-forward hero, 4-pillar grid, trust/contact band) — v1.0 (Phase 6)
- ✓ WCAG 2.1 AA remediation (contrast, heading order, skip-link, ≥44px targets) + brand polish — v1.0 (Phase 7)
- ✓ `/projecten` showcase from owner photos + unified photo treatment — v1.0 post-milestone quick tasks

### Active

<!-- Next-milestone candidates. Fresh, formally-scoped requirements are defined via /gsd-new-milestone. -->

- [ ] **Domain go-live (DOM-V2-01)** — attach `tpsklimaattechniek.nl`; flip `CANONICAL_ORIGIN` in `lib/constants.ts` (feeds canonicals/sitemap/robots/JSON-LD/OG); 301 plan + GBP + citation updates. *The single step to a public launch.*
- [ ] Post-launch owner ops — GSC verification + sitemap submission, Vercel Analytics enable, www→apex 301, live Rich-Results test (all in `docs/seo-owner-runbook.md`)
- [ ] Light MDX blog / kennisbank — 3–5 evergreen, locally-framed articles with internal links to pillars (BLOG-01, v1.x fast-follow)
- [ ] Branded OG / social-share card (backlog 999.1) — replace grey-fan default with a logo'd 1200×630 card
- [ ] IG/FB footer social icons + JSON-LD `sameAs` — once the owner supplies URLs

### Out of Scope

- Per-location / per-neighbourhood pages — only after Search Console shows converting queries (BLOG-02, data-gated); generic town-name-swapped pages remain an anti-feature (thin-content)
- Full GHL CRM pipelines / nurture automation beyond simple notification — later milestone
- Headless CMS for owner self-service editing — content stays in-repo until the owner needs it
- Automated test infrastructure + deep tech-debt refactors (PricingTabs split) — QA scope was blockers + hardening
- Online price calculator / self-serve booking; customer portal / accounts — wrong fit for a consultative, survey-dependent sale
- Detailed heat-pump pricing tables — quote-based; no standardized WP price list
- Claiming ISDE for airco / Belgian 6% BTW — factually wrong; damages the "Transparant" USP
- Dark mode; multi-language (EN) — excluded per CLAUDE.md / NL-only market

## Context

- **Launch-ready, pre-prod:** v1.0 is complete and green on Vercel pre-prod; the public launch is gated only on the `tpsklimaattechniek.nl` domain attach (owner-timed).
- **Deployment model:** `main` + Vercel = pre-prod work env, no public domain. `tpsventilatie.nl` is the OLD LiteSpeed site (to be scrapped). Real launch domain = `tpsklimaattechniek.nl`. `CANONICAL_ORIGIN` currently `https://tpsventilatie.nl` → switch at domain-attach.
- **Agency engagement:** built + maintained by Pushly.nl (Oskar) for client TPS (owner Thomas/Tomasz). Signed engagement PL-2026-004.
- **GoHighLevel:** used lightly in v1 — WhatsApp-first owner notification + silent capture-of-record. Rate-limiting honeypot-only (Upstash deferred).
- **Known limitations carried:** SEO-10 mobile PSI is throttle-bound (field-monitored, don't re-chase); no automated tests; 999.1 branded OG card pending owner logo asset.

## Constraints

- **Tech stack:** Next.js 16 App Router + TypeScript + Tailwind v4 — keep. Hosting is **hybrid** (dropped `output: "export"` for `/api/lead`; ~22 pages stay SSG; `trailingSlash: false` + apex canonical preserved).
- **Design system:** "Atmospheric Clarity" — no 1px section borders (tonal layering), no `#000` text (`on-surface` #141D1F), Material Symbols via the `Icon` wrapper, business data via the `SITE` constant. Never modify `.stitch/` or `.firecrawl/`.
- **Language:** all site-facing content in Dutch (`nl`).
- **Content model:** Claude drafts from research + owner notes; owner reviews/approves before publish.
- **Timeline:** quality-gated ("when it's right").
- **Hosting:** Vercel (project `prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q`).
- **Execution:** repo is on a OneDrive mount — git worktrees + heavy subagents/`gsd-sdk` calls deadlock; run GSD execution inline; validate on Vercel preview (no local `next build`).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Broaden positioning to "klimaattechniek" (4 pillars) | Owner added heat pumps + airco | ✅ Good — set the whole IA + content scope |
| Service IA = `/diensten` hub + pillar + ~22 sub-service pages | Maximize local-SEO surface per service | ✅ Good — 22 pages live from one taxonomy |
| Data-driven service-page template | Keep 20+ pages maintainable from one source | ✅ Good |
| Claude drafts content, owner reviews (hard gate) | Move fast without per-page blocking | ✅ Good — sign-off 2026-08-05 |
| Lead capture v1 = form → instant WhatsApp-first notification (GHL) | Simple conversion + comms now | ✅ Good — real lead verified 2026-06-30 |
| Static-export → **HYBRID** for the secure form route | Server route needed to hold the GHL secret | ✅ Good (Phase 5, QA-01) |
| Rate-limiting honeypot-only (Upstash deferred) | Not provisioned; route degrades gracefully | ⚠️ Revisit if spam appears |
| SEO-10 mobile CWV accepted as throttle-bound | Desktop green; synthetic mobile PSI is Slow-4G-bound | ✅ Accepted — field-monitored |
| QA scope = blockers + hardening (defer tests/refactors) | Reach launch without over-investing pre-launch | ✅ Good |
| Deployment: main/Vercel = pre-prod; attach `tpsklimaattechniek.nl` at finalize | `tpsventilatie.nl` is the old site to be scrapped | — Pending domain attach (DOM-V2-01) |
| Keep content in-repo (MDX/data), no CMS yet | Avoid CMS overhead; owner not self-editing | ✅ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each milestone** (via `/gsd-complete-milestone`): full review of all sections; Core Value check; audit Out of Scope; update Context with current state.

---
*Last updated: 2026-08-12 after v1.0 "Launch" milestone*
