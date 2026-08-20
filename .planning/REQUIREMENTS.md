# Requirements: TPS klimaattechniek — Milestone v1.1

**Defined:** 2026-08-20
**Milestone:** v1.1 "Rebrand Migration & SEO Ranking Push"
**Core Value:** Turn local search demand into contacted leads.

> v1.0's requirements are archived at [`milestones/v1.0-REQUIREMENTS.md`](milestones/v1.0-REQUIREMENTS.md).
> REQ-IDs below continue that numbering where a category already existed (SEO), and open new categories
> for work this milestone introduces.

## v1.1 Requirements

### Indexation Unlock (IDX) — the milestone's blocking dependency

- [x] **IDX-01**: The SEO build gate asserts a *relational* invariant — sitemap membership equals `isIndexable()` for every node, plus a minimum indexable-page floor — instead of a hardcoded page list
- [x] **IDX-02**: All 21 `review` service nodes (4 pillars + 17 sub-services) are `published` and serve no `noindex` directive in production HTML
- [ ] **IDX-03**: The `/diensten` hub carries real content clearing the anti-thin-content bar (≥120-word intro, ≥1 step, 3–6 FAQs) and is published
- [ ] **IDX-04**: Production `sitemap.xml` lists all 27 indexable pages
- [x] **IDX-05**: The 6 static nodes carry a `status` consistent with their actual indexability, so the data no longer misleads a reader

### Measurement & Search Console (MEAS)

- [ ] **MEAS-01**: Both new-domain variants (`tpsklimaattechniek.nl`, `www.`) are verified in Google Search Console
- [ ] **MEAS-02**: Both legacy-domain variants are verified in GSC **while legacy DNS still resolves to WordPress** (verification becomes materially harder after the repoint)
- [ ] **MEAS-03**: Sitemap submitted; indexing manually requested for the hub + 4 pillar pages
- [ ] **MEAS-04**: Pre-migration baseline captured — GSC performance export, ranking snapshot for top queries, GBP state (name/categories/URL/review count/rating), and a full DNS zone snapshot
- [ ] **MEAS-05**: Indexation coverage is reviewed weekly against defined warning thresholds (indexed count, "Crawled – currently not indexed", "Discovered – currently not indexed")
- [ ] **MEAS-06**: Vercel Analytics enabled and reporting

### Old-Brand Migration (MIG) — reversible by construction

- [ ] **MIG-01**: A full WordPress backup (files + database) is stored off-host and its restorability confirmed
- [ ] **MIG-02**: The legacy SPF record drops the `a` mechanism (→ `v=spf1 mx include:_spf.cyberfolks.pl -all`) so the mail server stays authorized and Vercel's IP does not become one
- [ ] **MIG-03**: An alternate webmail route is documented for the owner and verified working **before** cutover
- [ ] **MIG-04**: An alternate WordPress-admin route is verified working **before** cutover, so the rollback target stays inspectable
- [ ] **MIG-05**: A typed 9-entry redirect map lives in `lib/seo/redirects.ts` with every destination built from `CANONICAL_ORIGIN`
- [ ] **MIG-06**: A build gate fails on redirect chains, duplicate sources, or any destination not returning a direct 200
- [ ] **MIG-07**: Both legacy hostnames are attached to Vercel and repointed, and every legacy URL reaches its target in exactly **one** hop
- [ ] **MIG-08**: `info@tpsventilatie.nl` is verified sending **and** receiving after cutover
- [ ] **MIG-09**: A Change of Address request is submitted for every verified legacy variant, from a domain-level property
- [ ] **MIG-10**: The rollback procedure is documented, and the WordPress install is left intact and reachable

### Google Business Profile (GBP)

- [ ] **GBP-01**: Website URL points at the `www` production host
- [ ] **GBP-02**: Primary category is the correct HVAC/installation category, with ≤4 secondaries
- [ ] **GBP-03**: The Services list is populated from the site taxonomy
- [ ] **GBP-04**: Service area is configured from the 8 confirmed `SITE.serviceAreas` entries, and the stale `owner-review-pending` comment is removed from `lib/constants.ts` so the data no longer reads as provisional
- [ ] **GBP-05**: Opening hours, attributes and photos are current
- [ ] **GBP-06**: The business name reads `TPS klimaattechniek`, changed **in an isolated session, after** citations already show the new name
- [ ] **GBP-07**: 72h after the rename the profile is unsuspended with all 34 reviews and the 4,9 rating intact
- [ ] **GBP-08**: Any duplicate or legacy listing under the old brand is identified and resolved

### NAP & Citations (NAP)

- [ ] **NAP-01**: A master NAP profile is documented as the single reference for every external listing — distinguishing brand (`TPS klimaattechniek`) from KvK legal entity (`TPS services`)
- [ ] **NAP-02**: Tier-1 records corrected — KvK, Apple Business Connect, Bing Places
- [ ] **NAP-03**: Tier-2 Dutch directories corrected (De Telefoongids/Gouden Gids, Telefoonboek.nl, Openingstijden.nl, Trustoo, Werkspot)
- [ ] **NAP-04**: Manufacturer dealer-locator listings (Daikin, Mitsubishi) updated to the new brand and domain
- [ ] **NAP-05**: An audit record lists every discovered external old-brand mention with its correction status

### On-Page SEO Depth (SEO — continues from v1.0's SEO-10)

- [ ] **SEO-11**: A keyword→page map covers all 27 indexable pages with no cannibalization
- [ ] **SEO-12**: Titles and meta descriptions are rewritten against real target queries
- [ ] **SEO-13**: An internal-linking architecture connects hub → pillar → sub-service with related-service blocks and contextual links, and a gate proves no dead internal links
- [ ] **SEO-14**: `/projecten` case studies are linked from the service pages they evidence
- [ ] **SEO-15**: Schema is enriched beyond the v1.0 baseline where it earns richer results

### Kennisbank (BLOG)

- [ ] **BLOG-01**: An MDX content engine renders articles, which join the sitemap **through** `lib/seo/policy.ts` rather than a parallel list
- [ ] **BLOG-03**: 3–5 evergreen, locally-framed articles are published, each clearing the same content bar as the service pages
- [ ] **BLOG-04**: Each article links to ≥2 pillar pages and ≥1 sub-service page
- [ ] **BLOG-05**: Articles emit valid `Article`/`BlogPosting` JSON-LD

### Brand Tail (BRND)

- [ ] **BRND-01**: Footer social icons and JSON-LD `sameAs` carry the owner's Instagram and Facebook URLs
- [ ] **BRND-02**: The GitHub repo and Vercel project are renamed to `tpsklimaattechniek`, with custom domains, `/api/lead`, and env vars re-verified afterwards

## Future Requirements

Acknowledged, not in this milestone.

- **BLOG-02**: Per-town / per-neighbourhood location pages — gate reaffirmed; only once GSC shows converting queries
- **999.1**: Branded OG / social-share card — deferred by the owner this milestone (its "needs logo asset" blocker is now stale; `public/tps-logo.png` exists)
- **Mailbox migration** to `@tpsklimaattechniek.nl` — owner chose to keep `info@tpsventilatie.nl` indefinitely
- **Structured review-request flow** and a Google Posts cadence — after the GBP rename settles
- **Tier-3 sector citations** beyond the manufacturer locators

## Out of Scope

| Feature | Reason |
|---|---|
| Per-town/per-neighbourhood pages | Thin-content anti-feature; data-gated on Search Console evidence we don't have yet |
| Deleting the WordPress install | Explicitly excluded — the client may revert; rollback must stay a DNS-only operation |
| Moving legacy DNS nameservers | Unnecessary risk to a live mail configuration |
| Upstash rate-limiting on `/api/lead` | Declined again; honeypot-only remains accepted |
| Re-chasing SEO-10 mobile CWV | Accepted as throttle-bound and field-monitored at v1.0 |
| A second GBP listing for the new brand | Would split 34 reviews and create a duplicate — rename, never recreate |
| Headless CMS | Content stays in-repo |
| Automated test framework | Build gates via `tsx` + `node:assert` remain the pattern |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|---|---|---|
| IDX-01 | Phase 8 | Complete |
| IDX-02 | Phase 8 | Complete |
| IDX-03 | Phase 8 | Pending |
| IDX-04 | Phase 8 | Pending |
| IDX-05 | Phase 8 | Complete |
| MEAS-01 | Phase 9 | Pending |
| MEAS-02 | Phase 9 | Pending |
| MEAS-03 | Phase 9 | Pending |
| MEAS-04 | Phase 9 | Pending |
| MEAS-05 | Phase 9 | Pending |
| MEAS-06 | Phase 9 | Pending |
| MIG-01 | Phase 10 | Pending |
| MIG-02 | Phase 10 | Pending |
| MIG-03 | Phase 10 | Pending |
| MIG-04 | Phase 10 | Pending |
| MIG-05 | Phase 10 | Pending |
| MIG-06 | Phase 10 | Pending |
| MIG-07 | Phase 10 | Pending |
| MIG-08 | Phase 10 | Pending |
| MIG-09 | Phase 10 | Pending |
| MIG-10 | Phase 10 | Pending |
| GBP-01 | Phase 11 | Pending |
| GBP-02 | Phase 11 | Pending |
| GBP-03 | Phase 11 | Pending |
| GBP-04 | Phase 11 | Pending |
| GBP-05 | Phase 11 | Pending |
| GBP-06 | Phase 11 | Pending |
| GBP-07 | Phase 11 | Pending |
| GBP-08 | Phase 11 | Pending |
| NAP-01 | Phase 11 | Pending |
| NAP-02 | Phase 11 | Pending |
| NAP-03 | Phase 11 | Pending |
| NAP-04 | Phase 11 | Pending |
| NAP-05 | Phase 11 | Pending |
| SEO-11 | Phase 12 | Pending |
| SEO-12 | Phase 12 | Pending |
| SEO-13 | Phase 12 | Pending |
| SEO-14 | Phase 12 | Pending |
| SEO-15 | Phase 12 | Pending |
| BLOG-01 | Phase 12 | Pending |
| BLOG-03 | Phase 12 | Pending |
| BLOG-04 | Phase 12 | Pending |
| BLOG-05 | Phase 12 | Pending |
| BRND-01 | Phase 13 | Pending |
| BRND-02 | Phase 13 | Pending |

**Coverage:**
- v1.1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0 ✓

## Open Questions

Resolved 2026-08-20 during requirements confirmation:

1. ✅ **DNS-zone access for `tpsventilatie.nl` — CONFIRMED.** We can edit the zone directly, so MIG-02
   (SPF fix) and MIG-07 (apex + `www` repoint) proceed without an owner dependency, and MEAS-02 can use
   DNS TXT verification for a domain-level GSC property covering all variants at once.
2. ✅ **`SITE.serviceAreas` — CONFIRMED as-is.** The 8 seeded areas are treated as owner-confirmed; they
   have been live in JSON-LD since v1.0 without objection. GBP-04 now also removes the stale
   `owner-review-pending` comment.

Still open, and owner-dependent rather than planning-blocking:

3. ⚠️ **IG/FB URLs** outstanding from the owner (BRND-01). Chase early so it doesn't stall the final phase.
4. ⚠️ Whether a **duplicate or legacy GBP listing** exists under the old brand name (GBP-08) — discoverable
   during the GBP phase, not before.

---
*Requirements defined: 2026-08-20*
