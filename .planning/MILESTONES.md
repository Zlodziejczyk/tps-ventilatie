# Milestones — TPS klimaattechniek

## v1.0 Launch — ✅ SHIPPED 2026-08-12

**Delivered:** Took the TPS site from a 6-page pre-launch proposal to a launch-ready ~22-page, SEO-driven, lead-generation climate-tech site with a secure lead path and instant owner notification.

**Stats:**
- Phases: 7 (1–7)
- Plans: 53 (all complete)
- Timeline: 2026-06-02 → 2026-08-12 (owner sign-off 2026-08-05; branch merged to `main` + prod pre-prod deploy green)
- Requirements: 43/43 v1 delivered (3 closed with noted outcome)

**Key accomplishments:**
1. **Typed taxonomy single-source-of-truth** (Phase 1) — 27-node Zod-validated registry (hub + 4 pillars + 17 sub-services + statics), the sole `urlFor()` builder, keyword map, and a build-blocking uniqueness/anti-thin-content gate; NAP + 60 km service radius fixed at the constants layer.
2. **Data-driven service surface** (Phase 2) — `/diensten` hub + 4 pillars + ~17 sub-services (~22 pages) generated from one template with stable URLs and fully taxonomy-derived navigation.
3. **Full SEO infrastructure** (Phase 3) — programmatic sitemap/robots, server-rendered JSON-LD (HVACBusiness + Service + BreadcrumbList + FAQPage), canonical/OG/metadata, GBP alignment, Vercel Analytics + Speed Insights.
4. **Unique owner-reviewed Dutch content** (Phase 4) — every page cleared the anti-thin-content bar; certs/dealer status owner-verified (Daikin + Mitsubishi erkend, BRL 100/200); rebrand to "TPS klimaattechniek"; real 4,9/34 Google rating surfaced; hard editorial sign-off cleared 2026-08-05.
5. **Secure lead path** (Phase 5) — resolved static→**hybrid**; `/api/lead` server route with server-only GHL secret + Zod + honeypot; WhatsApp-first instant owner notification (real lead verified 2026-06-30); site-wide sticky contact bar; mobile CWV/motion gating.
6. **Conversion homepage rebuild + WCAG 2.1 AA** (Phases 6–7) — proof-forward hero, equal 4-pillar grid, trust/contact band ("Atmospheric Clarity, engineered"); zero AA contrast fails, clean heading order, skip-link, ≥44px targets.

**Known deferred items at close:** 5 — SEO-10 (mobile CWV accepted, throttle-bound + field-monitored), owner-operational SEO ops (GSC/analytics/301/Rich-Results, in `docs/seo-owner-runbook.md`), IG/FB footer icons (owner URLs pending), 999.1 branded OG card (backlog), Upstash rate-limiting (honeypot-only). See STATE.md → Deferred Items.

**Remaining to go fully public:** attach `tpsklimaattechniek.nl` + flip `CANONICAL_ORIGIN` in `lib/constants.ts` (DOM-V2-01). main + Vercel remain pre-prod (no public domain yet).

**Archives:** `milestones/v1.0-ROADMAP.md` · `milestones/v1.0-REQUIREMENTS.md`
**Tag:** v1.0
