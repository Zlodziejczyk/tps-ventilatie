# TPS klimaattechniek

## What This Is

TPS klimaattechniek is a Zoetermeer-based climate-technology installer — airconditioning, heat pumps (warmtepompen), and ventilation (WTW + mechanical). This is their marketing website: a **launch-ready ~22-page, SEO-driven, lead-generation site** (v1.0 shipped 2026-08-12), rebuilt from the original 6-page proposal into a full multi-service climate-tech surface with a secure lead path and instant owner notification. It went **publicly live on `https://www.tpsklimaattechniek.nl` on 2026-08-12** (Vercel; apex 308→www).

Built with Next.js 16 (App Router, **hybrid**: statically prerendered pages + one server `/api/lead` route), TypeScript, and Tailwind CSS v4 ("Atmospheric Clarity" design system), deployed on Vercel. Built and maintained by Pushly.nl for the client (owner: Thomas / Tomasz) as an ongoing development + maintenance engagement.

## Core Value

**Turn local search demand into contacted leads.** A prospect in the Zoetermeer region looking for airco, heat-pump, or ventilation work finds TPS, trusts it, and reaches out — and the owner is notified instantly. Every workstream (service depth, SEO, content, conversion) serves this one outcome. *(Verified still correct at v1.0 close.)*

## Current Milestone: v1.1 Rebrand Migration & SEO Ranking Push

**Goal:** Finish the TPS Ventilatie → TPS klimaattechniek migration end-to-end and make the site genuinely rank — starting by un-hiding the 22 service pages Google currently cannot index.

**Target features:**

1. **Unlock indexation** — flip the 21 `review` + 8 `draft` taxonomy nodes to `published` so `/diensten` + 4 pillars + 17 sub-services drop `noindex` and enter the sitemap. *Everything else in this milestone compounds on this.*
2. **Retire the old brand, reversibly** — per-URL 301 map for the 9 `tpsventilatie.nl` URLs → new equivalents, via the old domain attached to Vercel + redirects in `next.config.ts`. WordPress left intact and backed up; rollback = revert 2 A records.
3. **Google Business Profile optimization** — rename, website URL, categories, services, service area, photos, Q&A, posts, review-request flow (admin access now held).
4. **Off-site NAP & citation cleanup** — every external "TPS Ventilatie" / old-domain mention corrected (KvK, directories, socials, dealer listings, Maps duplicates).
5. **On-page SEO depth pass** — keyword→page mapping, title/meta rewrite against real queries, internal-linking architecture across the 22 pages, schema enrichment, competitor gap fill.
6. **Blog / kennisbank (BLOG-01)** — light MDX engine + 3–5 evergreen, locally-framed articles linking into the pillars.
7. **Search Console end-to-end** — verify, submit sitemap, request indexing, then track coverage + queries as the milestone's success evidence.
8. **Brand cleanup tail** — IG/FB footer icons + JSON-LD `sameAs`; rename repo + Vercel project `tps-ventilatie` → `tpsklimaattechniek`.

## Current State

**Shipped v1.0 "Launch" (2026-08-12)** — 7 phases, 53 plans, 43/43 v1 requirements delivered.

- Full service surface: `/diensten` hub + 4 pillars (Airconditioning, Warmtepompen, WTW, Mechanische Ventilatie) + ~17 sub-services, all from one typed taxonomy.
- SEO infrastructure live: programmatic sitemap/robots, server-rendered JSON-LD, canonical/OG, GBP alignment, Speed Insights.
- Unique owner-reviewed Dutch content on every page; brand corrected to "TPS klimaattechniek"; hard editorial sign-off cleared 2026-08-05.
- Secure hybrid lead path: `/api/lead` server route (server-only GHL secret + Zod + honeypot), WhatsApp-first owner notification, site-wide sticky contact bar. Real inbound lead verified 2026-06-30.
- Conversion-rebuilt homepage + WCAG 2.1 AA across all pages.
- Post-milestone: `/projecten` showcase (7 cases, 21 owner photos) + unified photo treatment, merged to main.
- **Public since 2026-08-12** on `https://www.tpsklimaattechniek.nl` (DOM-V2-01 done — `CANONICAL_ORIGIN` flipped, brand favicon shipped, apex 308→www, verified in production 2026-08-15).

**✅ RESOLVED 2026-08-20 (Phase 8) — the surface is live and indexable.** Production `sitemap.xml` now serves **27 URLs**; all 21 service pages plus the `/diensten` hub return HTTP 200 with `index, follow` and no `noindex` anywhere, verified on live HTTP responses by the committed probe `scripts/verify-indexation.ts`. The `/diensten` hub was authored (170-word orientation intro, the 4-step TPS traject, 5 routing FAQs) and published as the 27th page. `isIndexable()` is now one predicate — `status === "published"` for every node type — so indexability is purely data. **The root cause is the durable lesson:** the SEO build gate hardcoded `sitemapEntries().length === 5` and deep-equalled a fixed URL list, so it actively *enforced* the broken state and would have blocked its own fix; when it failed, the expected number was bumped to match reality (commit `82d897b`) instead of the assumption being questioned. Two sibling guards had been silently RED for weeks because nothing executed them. All eight guards are now build-blocking in `prebuild` (1.7s), assert relationships and named floors rather than snapshots, and each ships with a perturbation proof that it fails when the world breaks.

**The state that was fixed (recorded 2026-08-19):** the entire service surface was **invisible to Google**. `sitemap.xml` carries only 5 URLs (`/`, `/tarieven`, `/projecten`, `/over-ons`, `/contact`); `/diensten` and every pillar + sub-service page serves `<meta name="robots" content="noindex, follow">`. Cause is mechanical, not a bug: `lib/seo/policy.ts:isIndexable()` gates hub/pillar/service on `status === "published"`, and the registry holds **21 × `review` + 8 × `draft`, 0 × `published`** — the Phase-4 Task-3 batch flip was never executed even though owner editorial sign-off cleared 2026-08-05. The 22-page SEO surface v1.0 was built to create has never been indexable.

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

<!-- Delivered in v1.1 -->
- ✓ **Publish the service surface** — 21 service nodes + the authored `/diensten` hub published; production sitemap 5 → 27 URLs, zero `noindex` on the service surface. Validated in Phase 8: Indexation Unlock (IDX-01…05)
- ✓ **Regression-proof indexation gate** — relational invariant (sitemap membership ⇔ `isIndexable()` per node) + a single named `INDEXABLE_FLOOR`, all eight guards build-blocking, each with an executed perturbation proof, plus a committed live-output probe run at preview and production. Validated in Phase 8 (IDX-01)

### Active

<!-- v1.1 scope. Formally numbered with REQ-IDs in REQUIREMENTS.md. -->

- [ ] **Reversible old-brand retirement** — back up the WordPress site off-host, repoint only `tpsventilatie.nl` apex + `www` A records to Vercel, per-URL 301 map for the 9 old URLs, WP install left untouched for rollback.
- [ ] **Mail preservation** — MX, the `mail` A record, and SPF on `tpsventilatie.nl` survive the repoint; `info@tpsventilatie.nl` keeps working indefinitely; SPF `a` mechanism tidied to `mx` + `include`.
- [ ] **Google Business Profile optimization** — rename to TPS klimaattechniek, website URL → new domain, categories/services/service area, photos, Q&A, posts, review-request flow.
- [ ] **Off-site NAP & citation cleanup** — KvK, directories, socials, dealer/supplier listings, Google Maps duplicates.
- [ ] **On-page SEO depth pass** — keyword→page map, title/meta rewrite, internal-linking architecture, schema enrichment, competitor content-gap fill.
- [ ] **Blog / kennisbank (BLOG-01)** — light MDX engine + 3–5 evergreen, locally-framed articles with internal links to pillars.
- [ ] **Search Console end-to-end** — verify property, submit sitemap, request indexing, monitor coverage + queries as milestone success evidence.
- [ ] **IG/FB footer icons + JSON-LD `sameAs`** — owner supplies URLs; entity signal supporting the rebrand.
- [ ] **Rename repo + Vercel project** `tps-ventilatie` → `tpsklimaattechniek` — last place the old brand lives internally.

### Out of Scope

- Per-location / per-neighbourhood pages — **gate reaffirmed for v1.1**: only after Search Console shows converting queries (BLOG-02, data-gated); generic town-name-swapped pages remain an anti-feature (thin-content)
- Deleting the old WordPress install — explicitly excluded; the client may want to revert, so WP stays intact on cyberfolks and rollback is a 2-record DNS revert
- Migrating `info@tpsventilatie.nl` to an `@tpsklimaattechniek.nl` mailbox — owner chose to keep the old address alive indefinitely; the cyberfolks subscription stays for mail
- Upstash rate-limiting on `/api/lead` — declined again for v1.1; honeypot-only remains accepted
- Full GHL CRM pipelines / nurture automation beyond simple notification — later milestone
- Headless CMS for owner self-service editing — content stays in-repo until the owner needs it
- Automated test infrastructure + deep tech-debt refactors (PricingTabs split) — QA scope was blockers + hardening
- Online price calculator / self-serve booking; customer portal / accounts — wrong fit for a consultative, survey-dependent sale
- Detailed heat-pump pricing tables — quote-based; no standardized WP price list
- Claiming ISDE for airco / Belgian 6% BTW — factually wrong; damages the "Transparant" USP
- Dark mode; multi-language (EN) — excluded per CLAUDE.md / NL-only market

## Context

- **Live since 2026-08-12:** `https://www.tpsklimaattechniek.nl` serves v1.0 on Vercel with a valid cert; apex 308→www; `CANONICAL_ORIGIN` = `https://www.tpsklimaattechniek.nl`. `main` deploys to production.
- **Indexation is the v1.1 headline:** despite being live, only 5 of ~27 pages are indexable. See Current State — the taxonomy `status` flip is the single lever.
- **Old-site topology (verified 2026-08-19):** `tpsventilatie.nl` = WordPress 7.1 + Oxygen + Contact Form 7 on LiteSpeed at `195.78.67.39` (`s161.cyber-folks.pl`), NS `ns1/ns2.opeiron.com`, returns 200 with title "TPS Ventilatie". 9 pages, 0 posts. Its `robots.txt` advertises `/wp-sitemap.xml`, which 404s.
- **Mail and web share one box.** `mail.tpsventilatie.nl` → `195.78.67.39`, SPF `v=spf1 a mx include:_spf.cyberfolks.pl -all`. Keeping `info@tpsventilatie.nl` alive means keeping the cyberfolks subscription (mail-only is fine). The apex/`www` A records are separable from MX + the `mail` A record — that separation is what makes the Vercel repoint safe. ⚠️ The SPF `a` mechanism silently stops authorizing the mail server once the apex repoints; tidy to `mx` + `include`.
- **New-domain DNS:** registrar/DNS at dd24 (Key-Systems); NS stays at dd24, NOT Vercel — moving it would drop the live Titan mail records (`mx0101/mx0102.titan.email` + SPF).
- **Access held for v1.1:** admin on the TPS Google Business Profile, and on the old site's hosting. Search Console is ours to run end-to-end this milestone.
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
| **v1.1:** retire the old site by DNS repoint, not by deleting WP | Client may want to revert; repointing 2 A records touches the old host zero times and rolls back in minutes | — Planned |
| **v1.1:** per-URL 301 map (9 URLs) over a blanket redirect | Old pages hold the current rankings; per-page targets pass relevance instead of reading as soft-404s | — Planned |
| **v1.1:** redirects expressed in `next.config.ts`, not `.htaccess` | Version-controlled, reviewable, testable in CI; no orphaned rules on a host nobody watches | — Planned |
| **v1.1:** keep `info@tpsventilatie.nl` indefinitely (owner call) | Avoids a mailbox migration mid-rebrand; cyberfolks stays as a mail-only subscription | — Planned |
| **v1.1:** flip all 21 `review` nodes straight to `published` | Editorial sign-off already cleared 2026-08-05 — the missing flip is an execution slip, not an open gate | — Planned |
| **v1.1:** regio/location pages stay gated | Still no GSC data (nothing has been indexable); building them now would be the thin-content anti-feature | — Planned |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each milestone** (via `/gsd-complete-milestone`): full review of all sections; Core Value check; audit Out of Scope; update Context with current state.

---
*Last updated: 2026-08-20 — Phase 8 (Indexation Unlock) complete; the service surface is live and indexable in production*
