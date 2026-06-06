# Phase 3: SEO Infrastructure — Verification

**Verified:** 2026-06-06 (inline goal-backward, per the OneDrive execution constraint — no verifier subagent)
**Verdict:** ✅ Phase goal achieved (8/8 plans, all in-scope criteria met; deferred portions correctly out of Phase-3 scope)

**Goal:** Make every page indexable and richly described before any final copy lands — programmatic sitemap/robots from the taxonomy, server-rendered JSON-LD, correct canonical/metadata/OG, GBP alignment, and live measurement.

## Success Criteria

### 1. Sitemap + robots resolve at build, list every canonical page, no drift — ✅ MET
- `out/sitemap.xml` resolves: exactly the 4 indexable canonical pages (apex `/`, `/tarieven`, `/over-ons`, `/contact`), absolute apex URLs; excludes `/privacy-beleid` + all `/diensten*` drafts.
- `out/robots.txt` resolves: open policy, 7 AI bots allowed, absolute `Sitemap:` pointer, no `Disallow`.
- **No drift:** both derive from the single `lib/seo/policy.ts isIndexable()` lever (sitemap membership == per-page robots). Locked by `scripts/assert-seo.ts` (exit 0). Service pages auto-join on the Phase-4 `status:"published"` flip — by design, not a gap.

### 2. Single absolute self-canonical + metadataBase + OG/Twitter on every page — ✅ MET
- `metadataBase` = apex set once on the root layout; every page emits an absolute self-canonical via `buildMetadata` (one builder for static + dynamic routes → no drift).
- Consistent trailing-slash policy (none, matching `trailingSlash:false`; Next normalizes the root accordingly).
- OG + Twitter on every page (layout default + per-page). `out/index.html` proven: absolute `rel="canonical"` + `og:image`.

### 3. HVACBusiness + per-page Service/BreadcrumbList/FAQPage JSON-LD, server-rendered, zero client JS — ✅ MET (markup); live Rich-Results test = post-deploy owner step
- Site-wide `HVACBusiness` rendered once (proven in `out/index.html`); per-page `Service` + `BreadcrumbList` on the 21 service-surface routes (proven in `out/diensten/airconditioning.html`).
- `FAQPage` renders only when `content.faqs` is non-empty → correctly absent on the current all-draft pages; appears automatically as Phase 4 fills FAQs.
- Server-rendered, zero client JS (`JsonLd` server component, `<`-escaped). NO `aggregateRating`/`review` (reserved for Phase 4).
- **Residual:** Google Rich Results Test validates a *live URL* — run it post-deploy (owner/QA step). The emitted markup is valid Schema.org (correct `@type`/`@context`, stable `@id`, escaped).

### 4. Zoetermeer + regio in metadata/NAP/JSON-LD; on-site NAP matches GBP — ✅ MET (Phase-3 scope); page-copy + GBP-dashboard = Phase 4 / owner runbook
- Regio in metadata (regio-bearing descriptions/metaTitles), full NAP from `SITE`, and JSON-LD `areaServed` (60 km `GeoCircle` + 8 `serviceAreas` Places).
- **By scope (CONTEXT D-07):** page-*body* regio copy is Phase 4; GBP alignment (categories, service area, verified pin) ships as the owner runbook (`docs/seo-owner-runbook.md`) + `03-USER-SETUP.md`. The on-site NAP/JSON-LD side is done.

### 5. Analytics collecting + GSC verified + sitemap submitted — ✅ MET (code); activation = owner dashboard step (runbook)
- Vercel Analytics + Speed Insights wired (cookieless); GSC verification meta wired (conditional on `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).
- **By scope (CONTEXT D-06):** enabling collection + completing GSC verification + submitting the sitemap are owner Vercel/GSC dashboard steps — documented in the runbook + `03-USER-SETUP.md`. GA4 deliberately deferred (consent scope).

## Cross-cutting constraints — all held
- One canonical origin (`CANONICAL_ORIGIN` apex) — every absolute URL derives from it. ✅
- One indexing lever (`isIndexable`) drives sitemap + robots. ✅
- All JSON-LD server-rendered, zero client JS, `<`-escaped; no ratings. ✅
- `next.config.ts` still `output:"export"` (untouched). ✅

## Evidence
- Green `npm run build` (Turbopack compile + TypeScript + static export of 27 routes); 18/18 `out/` proof greps pass.
- `scripts/assert-seo.ts` exit 0; `scripts/assert-registry.ts` + `scripts/assert-site-shape.ts` still green (no regression).
- 24 atomic commits (feat/test per task + docs per plan); clean working tree.

## Owner / post-deploy follow-ups (documented, not Phase-3 blockers)
1. Run Google Rich Results Test on the deployed URLs (criterion 3 live check).
2. Owner runbook steps: GBP name/categories/service-area/pin; set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` + verify GSC + submit sitemap; enable Vercel Analytics/Speed Insights; confirm real business `geo` lat/lng.
3. Re-confirm `www→apex` 301 just before launch.
