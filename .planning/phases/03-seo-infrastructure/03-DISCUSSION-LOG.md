# Phase 3: SEO Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-05
**Phase:** 3-SEO Infrastructure
**Areas discussed:** Canonical domain, Sitemap & indexing, JSON-LD type, JSON-LD ratings, Analytics stack, GSC verification, OG image, Metadata brand cleanup, GBP category, AI crawler policy

Gray-area selection 1 (multiSelect): user selected ALL of Canonical domain, Sitemap & indexing, JSON-LD scope, Analytics & verify.
Gray-area selection 2 (multiSelect, "explore more"): user selected ALL of OG image strategy, Metadata brand cleanup, GBP categories & runbook, AI crawler policy.

---

## Canonical domain (metadataBase host)

| Option | Description | Selected |
|--------|-------------|----------|
| tpsventilatie.nl | Keep current live domain (recommended); matches P1 D-10, GBP/citations already point here, zero migration risk; brand name still "TPS klimaattechniek". | |
| tpsklimaattechniek.nl | Switch canonical host to the rebrand domain now; pulls DOM-V2-01 forward (register/verify + 301s + GBP rename + citations). | |
| You decide | Lock tpsventilatie.nl per D-10; note tpsklimaattechniek.nl migration as v2. | ✓ |

**User's choice:** You decide → locked `https://tpsventilatie.nl` (apex) for launch.
**Notes:** Researcher to confirm live www-vs-apex primary so canonical == served origin.

---

## Sitemap & indexing (gate vs draft status)

| Option | Description | Selected |
|--------|-------------|----------|
| Publish-gated | Sitemap + index key off status:"published"; drafts noindex + excluded until Phase 4 flips them; statics index now; privacy-beleid noindex (recommended). | |
| All routes now | Every route in sitemap + indexable immediately; rely on Phase 4 to fill before launch; weaker thin-content protection. | |
| You decide | Implement publish-gated, content-aware approach. | ✓ |

**User's choice:** You decide → publish-gated via one `lib/seo` policy helper.
**Notes:** Static content pages indexable now; service pages auto-join on Phase-4 publish (single status lever = the editorial gate).

---

## JSON-LD type

| Option | Description | Selected |
|--------|-------------|----------|
| HVACBusiness | Specific LocalBusiness subtype for HVAC installers; stronger signal (recommended). | |
| LocalBusiness | Generic local-business type; weaker signal. | |
| You decide | Use HVACBusiness, with LocalBusiness fallback array if research shows a gap. | ✓ |

**User's choice:** You decide → HVACBusiness.

---

## JSON-LD ratings (aggregateRating timing)

| Option | Description | Selected |
|--------|-------------|----------|
| Defer to Phase 4 | Ship JSON-LD without aggregateRating; add in Phase 4 once reviews consolidated + on-page (CONT-08); avoids manual-action risk (recommended). | ✓ |
| Include now | Add aggregateRating from current hardcoded/duplicated review data; faster stars but guideline/manual-action risk. | |
| You decide | Wire JSON-LD without ratings, reserve the slot for Phase 4. | |

**User's choice:** Defer to Phase 4 (explicit selection).

---

## Analytics stack

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel Analytics only | Cookieless + Speed Insights (CWV/INP for SEO-10), no consent banner, minimal AVG scope (recommended). | |
| Vercel Analytics + GA4 | Adds GA4 depth but pulls in AVG cookie-consent + privacy-policy work. | |
| You decide | Ship Vercel Analytics + Speed Insights; GA4 as a documented consent-gated slot. | ✓ |

**User's choice:** You decide → Vercel Analytics + Speed Insights; GA4 deferred.

---

## GSC verification

| Option | Description | Selected |
|--------|-------------|----------|
| Meta tag (in-repo) | google-site-verification via env/SITE; verifiable on deploy; DNS-TXT documented as optional upgrade (recommended). | |
| DNS TXT (owner-run) | Cleanest domain-level property but entirely an owner DNS task; nothing in repo. | |
| You decide | Wire in-repo meta-tag method; document DNS-TXT as the optional domain-property upgrade. | ✓ |

**User's choice:** You decide → in-repo meta-tag method.

---

## OG image strategy

| Option | Description | Selected |
|--------|-------------|----------|
| One branded sitewide | Single 1200×630 branded card on every page; static asset (recommended). | |
| Per-pillar (4) + default | Distinct preview per pillar + sitewide default; 5 assets to design. | |
| You decide | Ship one branded sitewide OG image; per-pillar as a later enhancement. | ✓ |

**User's choice:** You decide → one branded sitewide OG image (static export = no dynamic OG generation).

---

## Metadata brand cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Rebrand + drop keywords | Title/template → "TPS klimaattechniek" from SITE.name; remove deprecated keywords meta (recommended). | |
| Rebrand, keep keywords | Same rebrand but retain keywords array. | |
| You decide | Fully rebrand title/template to klimaattechniek; drop legacy keywords meta. | ✓ |

**User's choice:** You decide → full rebrand + drop keywords. Fixes stale "TPS Ventilatie" in app/layout.tsx.

---

## GBP primary category

| Option | Description | Selected |
|--------|-------------|----------|
| Airconditioningsbedrijf | Air-conditioning contractor; high-intent primary (recommended). | |
| HVAC-aannemer | Broader klimaattechniek contractor; less specific. | |
| Verwarmingsinstallateur | Leads with heating/heat-pumps. | |
| You decide | Recommend Airconditioningsbedrijf primary + Verwarmingsinstallateur/Ventilatiebedrijf/HVAC-aannemer secondaries; flag for owner confirmation. | ✓ |

**User's choice:** You decide → Airconditioningsbedrijf primary, flagged for owner confirmation in the runbook.

---

## AI crawler policy

| Option | Description | Selected |
|--------|-------------|----------|
| Allow all | Permit GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot for GEO/AI-citation visibility (recommended). | |
| Block AI training bots | Disallow AI crawlers; costs AI-citation visibility. | |
| You decide | Allow AI crawlers; document opt-out block list. | ✓ |

**User's choice:** You decide → allow all AI crawlers; opt-out list documented in runbook.

---

## Claude's Discretion

User selected "You decide" on 9 of 10 questions (all except JSON-LD ratings, an explicit "Defer to Phase 4"). Locked recommendations: apex canonical host, publish-gated indexing, HVACBusiness, Vercel Analytics + Speed Insights, in-repo GSC meta tag, one sitewide OG image, full brand rebrand + drop keywords, Airconditioningsbedrijf GBP primary, allow-all AI crawlers. Plus mechanical discretion: www-vs-apex confirmation, @type fallback array, lib/seo module layout, OG image composition/placement, JSON-LD node location.

## Deferred Ideas

- tpsklimaattechniek.nl domain migration → v2 (DOM-V2-01)
- GA4 + AVG cookie-consent → later phase
- aggregateRating / Review JSON-LD → Phase 4 (CONT-08)
- Per-pillar OG images → later enhancement
- Page-body regio copy → Phase 4 (SEO-06 copy side)
- Visible Maps-pin fix → Phase 5 (QA-05); Phase 3 needs only the verified geo coordinate
- Build-time image optimization → Phase 5 (QA-07)
