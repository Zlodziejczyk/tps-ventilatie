# Feature Research

**Domain:** Local-SEO growth programme for a Dutch climate-tech installer (airco, warmtepompen, WTW, mechanische ventilatie) mid-rebrand
**Researched:** 2026-08-20
**Confidence:** HIGH for GBP + NAP mechanics (sourced); MEDIUM for exact GBP category label wording in the NL interface — flagged `[VERIFY IN GBP UI]`

> Written inline by the orchestrator after the Features research subagent died twice on this OneDrive mount.

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Complexity | Owner-blocked? | Notes |
|---|---|---|---|
| **GBP primary category correct** | Low | No | Primary category is the single largest Maps ranking lever. `HVAC contractor` (NL: *Installatiebedrijf voor verwarming en airconditioning*) `[VERIFY IN GBP UI]`. The classic own-goal is picking a generic *Aannemer / General contractor* — it removes you from airco- and warmtepomp-specific queries entirely |
| **GBP secondary categories, ≤4** | Low | No | Up to 9 allowed; practitioners advise ≤4 so classification stays sharp. Candidates: *Airconditioningmonteur*, *Reparatiebedrijf voor airconditioning*, *Ventilatiebedrijf*, *Warmtepompleverancier* |
| **GBP name = exact brand** | Low | No | Must become `TPS klimaattechniek`. Keyword-stuffing the name (e.g. "TPS klimaattechniek \| Airco Zoetermeer") is a suspension trigger — see PITFALLS |
| **GBP website URL → new domain** | Low | No | Must be `https://www.tpsklimaattechniek.nl` (the `www` production host, not the 308-ing apex) |
| **GBP opening hours** | Low | No | Already known: Ma–za 08:00–17:30. Recency of hours is cited as one of the top-three Maps factors |
| **GBP service area configured** | Low | ⚠️ Partly | Service-area business, no storefront walk-ins. Feeds from `SITE.serviceAreas` — **which is still marked `owner-review-pending` in the code** |
| **GBP Services list populated** | Med | No | Should mirror the 21 taxonomy service nodes — a rare case where our data model maps 1:1 onto a GBP feature |
| **NAP identical everywhere** | Med | No | Inconsistent NAP is repeatedly named the biggest blocker to local visibility. See the three-names problem below |
| **Sitemap submitted + indexed** | Low | No | Currently moot — only 5 URLs are indexable. Gated on the status flip |
| **Reviews recent and flowing** | Med | ⚠️ Yes | 4,9 / 34 is a genuine asset. Review *recency* is a ranking factor, so a steady trickle beats a big historical count |

### Differentiators (Competitive Advantage)

| Feature | Complexity | Owner-blocked? | Notes |
|---|---|---|---|
| **21 indexable service pages** | Low (flip) | No | Most local installers run 5–10 thin pages. A 21-page taxonomy where each node has ≥120-word intro, steps and 3–6 FAQs is a real moat — **already built and already passing the content gate**, just switched off |
| **Real project showcase** | Done | No | `/projecten` with 21 owner photos across 7 cases. Most competitors use stock imagery. Underused as an SEO asset — currently indexable but barely linked from service pages |
| **Verified dealer status surfaced** | Done | No | Daikin + Mitsubishi erkend installateur, BRL 100/200. Feeds E-E-A-T |
| **Manufacturer dealer-locator listings** | Low | ⚠️ Yes | Daikin / Mitsubishi "vind een installateur" pages are high-trust citations most competitors never claim. Needs owner credentials |
| **Kennisbank with genuine expertise** | Med | No | Cost breakdowns and subsidy explainers written by an actual installer outrank content-farm equivalents |
| **FAQ schema already emitting** | Done | No | 3–6 FAQs per service node already feed `FAQPage` JSON-LD |
| **Google Posts cadence** | Low | ⚠️ Yes | Needs a supply of owner photos/updates. Modest direct ranking effect; real effect on profile conversion |

### Anti-Features (Commonly Requested, Often Problematic)

| Anti-feature | Why it's wrong |
|---|---|
| **Per-town / per-neighbourhood pages** | Explicitly out of scope in PROJECT.md, and correctly so. Town-name-swapped pages are the canonical thin-content penalty. Gate stays until GSC shows converting queries |
| **Keywords in the GBP business name** | Direct violation of Google's representation guidelines; a common cause of hard suspension. Risks the 34 reviews |
| **Photo geotagging (EXIF) for Maps ranking** | Folklore. Google strips EXIF on upload. Zero measurable effect |
| **Buying citations in bulk / 500-directory blasts** | Low-quality directories add nothing and multiply the NAP surface you must later correct — actively harmful mid-rebrand |
| **Claiming ISDE subsidy for airconditioning** | Factually wrong — ISDE covers heat pumps, not airco. PROJECT.md already lists this as a standing anti-claim, and `scripts/assert-no-forbidden-claims.ts` gates it in the build |
| **Review gating / incentivised reviews** | Against Google policy; risks the profile's most valuable asset |
| **A second GBP listing for the new brand name** | Would split the 34 reviews and create a duplicate. **Rename the existing listing — never create a new one** |
| **Chasing synthetic mobile PSI** | PROJECT.md records SEO-10 as accepted throttle-bound; do not re-open |

## The Three-Names Problem (specific to this business)

Citation cleanup here is harder than a normal rebrand because **three names are legitimately in circulation**:

| Name | Where it is correct | Where it must not appear |
|---|---|---|
| `TPS klimaattechniek` | Brand — GBP, website, directories, socials | — |
| `TPS services` | KvK legal entity (`SITE.legalName`, emitted as JSON-LD `legalName`) | Should not be the GBP name or the directory display name |
| `TPS Ventilatie` | **Nowhere, going forward** | Everywhere — this is the cleanup target |

A naive "find and replace the old name" sweep will trip over `TPS services`, which is *correct* in the KvK
register and in structured data. The cleanup requirement must therefore be *"every public-facing brand
mention reads `TPS klimaattechniek`; `TPS services` remains only as the registered legal entity"* — not
"eliminate every name that isn't the brand".

Second wrinkle: **`SITE.email` is still `info@tpsventilatie.nl`** by owner decision. So the old domain
remains publicly visible in the NAP record even after the rebrand. Any citation audit will keep flagging
it; that is expected and accepted, and should be written down so it isn't "fixed" by mistake.

## Dutch Citation Landscape

Consensus guidance is **15–30 well-chosen directories**, selected on indexation, relevance and region,
driven from **one master NAP profile** used verbatim everywhere.

| Tier | Sources | Why |
|---|---|---|
| **Tier 1 — must** | Google Business Profile, KvK register, Apple Maps/Business Connect, Bing Places | The entity backbone. GBP alone outweighs the rest combined |
| **Tier 2 — high value NL** | De Telefoongids / Gouden Gids, Telefoonboek.nl, Openingstijden.nl, Trustoo, Werkspot | Well-indexed NL aggregators; commonly cited as the practical core set |
| **Tier 3 — sector** | Daikin + Mitsubishi dealer locators, BRL/certification registers, regional ondernemersverenigingen | Highest trust, lowest competition — most installers never claim these |
| **Tier 4 — skip** | Bulk directory packages | See anti-features |

**Honest weighting:** GBP optimization is where the leverage is. Citations mostly function as *corroboration*
— they prevent Google from doubting the entity rather than actively boosting it. Mid-rebrand that corroborating
role is unusually important, because conflicting old-brand data is exactly what makes an entity ambiguous.

## Kennisbank — what actually earns its place

| Article type | Value | Notes |
|---|---|---|
| **Cost breakdown** ("Wat kost een warmtepomp in 2026?") | High | Highest-intent informational query in this sector; links naturally into pillar + `/tarieven` |
| **ISDE subsidy explainer** | High | Genuine recurring demand. ⚠️ Must state plainly that ISDE does **not** cover airconditioning — the accuracy is itself a differentiator |
| **Comparison** ("WTW vs mechanische ventilatie") | High | Maps onto two existing pillars; strong internal-link anchor |
| **Maintenance how-to / frequency** | Medium | Supports the onderhoud service nodes; low competition |
| **Buying guide** ("Welke airco past bij mijn woning?") | Medium | Commercial-investigation intent, feeds the advies nodes |
| **Company news / "wij zijn verhuisd"** | ~Zero | Classic filler |

**Shape:** 3–5 articles, 1200–2000 words, each linking to ≥2 pillar pages and ≥1 sub-service, published
steadily rather than in one dump. Quality bar should match the taxonomy's: if an article cannot clear
something like the ≥120-word-intro / real-structure standard, it should not ship.

## Feature Dependencies

```
Status flip (21 review → published)
   ├──► GSC sitemap submission        [pointless before the flip]
   ├──► Legacy 301 redirects          [MUST come after — else equity hits noindex pages]
   ├──► Internal linking work         [needs live targets]
   └──► Kennisbank internal links     [needs live pillar targets]

GBP rename + URL + categories
   └──► Citation cleanup              [GBP is the canonical record others must match]

SITE.serviceAreas owner curation
   └──► GBP service area + JSON-LD areaServed   [OWNER-BLOCKED]

Owner supplies IG/FB URLs
   └──► Footer icons + JSON-LD sameAs           [OWNER-BLOCKED]
```

### Dependency Notes

- **The flip gates almost everything.** Redirects, GSC, internal linking and kennisbank links all
  depend on the service pages being indexable and linkable.
- **GBP precedes citations.** Correct the canonical record first, then propagate.
- **Two owner-blocked items** — `serviceAreas` curation and IG/FB URLs — should be chased early so they
  don't stall a phase late.

## MVP Definition

### Launch With (v1.1 core)

- Flip 21 `review` → `published`; author + publish the `/diensten` hub
- Rewrite `assert-seo.ts` to a relational invariant (must precede the flip)
- GSC: verify **all variants of both domains**, submit sitemap, monitor coverage
- Legacy 301 map (9 URLs) + `assert-redirects.ts`, after the flip
- GBP: rename, URL, primary + ≤4 secondary categories, hours, service area, Services list
- NAP master profile + Tier 1 & Tier 2 citation cleanup

### Add After Validation (v1.x)

- Tier 3 sector citations (dealer locators — owner credentials)
- Kennisbank articles 4–5
- Google Posts cadence
- Structured review-request flow

### Future Consideration (v2+)

- Per-town pages — **only** once GSC shows converting queries
- 999.1 branded OG card (deferred by owner this milestone; asset now available)
- Upstash rate-limiting (declined again)

## Feature Prioritization Matrix

| Feature | Impact | Effort | Priority |
|---|---|---|---|
| Status flip (21 pages) | **Very High** | Very Low | **1** |
| `assert-seo.ts` rewrite | High (prevents recurrence) | Low | **2** — blocks the flip |
| `/diensten` hub content | High | Medium | 3 |
| GSC verify + submit | High | Low | 4 |
| GBP optimization | **Very High** | Medium | 5 |
| Legacy 301 map | High | Medium | 6 |
| Internal linking | Medium-High | Medium | 7 |
| Citation cleanup | Medium | High (manual) | 8 |
| Kennisbank | Medium | High | 9 |
| Repo/Vercel rename | ~Zero SEO | Low | 10 — last |

## Sources

- [Google Business Profile for HVAC: Full Guide With Best Practices — ServiceTitan](https://www.servicetitan.com/blog/hvac-google-business-profile)
- [How to Rank Your HVAC Company on Google Maps — RS Gonzales](https://rsgonzales.com/blog/rank-hvac-company-google-maps/)
- [Google Bedrijfsprofiel optimaliseren: 14 tips — RabbitBlast](https://www.rabbitblast.nl/14-manieren-om-je-google-bedrijfsprofiel-echt-te-optimaliseren/)
- [SEO voor installateurs — zzpwebsitemaken.nl](https://zzpwebsitemaken.nl/seo-voor-installateurs/)
- [Local SEO in 2026: Complete Gids — Hiveminds](https://hiveminds.nl/seo/local-seo/local-seo-2026-complete-gids)
- [Lokale SEO voor bedrijven: 10 strategieën voor 2026 — OnlineLabs](https://www.onlinelabs.nl/blog/lokale-seo-voor-bedrijven-10-essentiele-strategieen)
- [Bedrijvengidsen linkbuilding in 2026 — LinkbuildingExperts](https://www.linkbuildingexperts.nl/linkbuilding/bedrijvengidsen-linkbuilding/)
- Repo reads: `lib/constants.ts` (`SITE`), `lib/services/*` (21 review nodes), `scripts/assert-no-forbidden-claims.ts`

---
*Feature research for: local-SEO growth programme mid-rebrand*
*Researched: 2026-08-20 (inline — subagents unavailable on this mount)*
