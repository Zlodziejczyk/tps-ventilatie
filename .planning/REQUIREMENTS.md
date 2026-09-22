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
- [x] **IDX-03**: The `/diensten` hub carries real content clearing the anti-thin-content bar (≥120-word intro, ≥1 step, 3–6 FAQs) and is published
- [x] **IDX-04**: Production `sitemap.xml` lists all 27 indexable pages
- [x] **IDX-05**: The 6 static nodes carry a `status` consistent with their actual indexability, so the data no longer misleads a reader

### Measurement & Search Console (MEAS)

- [x] **MEAS-01**: Both new-domain variants (`tpsklimaattechniek.nl`, `www.`) are verified in Google Search Console
- [x] **MEAS-02**: Both legacy-domain variants are verified in GSC **while legacy DNS still resolves to WordPress** (verification becomes materially harder after the repoint)
- [x] **MEAS-03**: Sitemap submitted; indexing manually requested for the hub + 4 pillar pages
- [x] **MEAS-04**: Pre-migration baseline captured — GSC performance export, ranking snapshot for top queries, GBP state (name/categories/URL/review count/rating), and a full DNS zone snapshot
- [x] **MEAS-05**: Indexation coverage is reviewed weekly against defined warning thresholds (indexed count, "Crawled – currently not indexed", "Discovered – currently not indexed")
- [x] **MEAS-06**: Vercel Analytics enabled and reporting

### Old-Brand Migration (MIG) — reversible by construction

- [x] **MIG-01**: A credential-free public content mirror of the 9 legacy pages plus their assets is committed under `docs/baseline/<capture-date>/legacy-site-mirror/`, captured by us while the old site is still live — amended 2026-09-21 by Phase 10 D-02/D-03, because the cutover moves two hostname A records and touches neither the files, the database, the vhost nor the subscription, so reversibility is protected by never touching the install and by the cyberfolks subscription staying alive for `info@tpsventilatie.nl`, not by a files-plus-database copy (a copy parked at cyberfolks would sit on the same host and share the same single point of failure anyway); the three slower risks it would have insured against are accepted — the install rots unpatched (WordPress 7.1.1), the cyberfolks subscription ends, or a host-side accident occurs with retention unknown to us
- [ ] **MIG-02**: The legacy SPF record drops the `a` mechanism (→ `v=spf1 mx include:_spf.cyberfolks.pl -all`) so the mail server stays authorized and Vercel's IP does not become one
- [ ] **MIG-03**: An alternate webmail route is documented for the owner and verified working **before** cutover
- [ ] **MIG-04**: An alternate WordPress-admin route is verified working **before** cutover, so the rollback target stays inspectable — satisfied by a credential-free mechanical proof (`curl --resolve tpsventilatie.nl:443:195.78.67.39 .../wp-login.php` returns 200 with a valid certificate and the real WordPress login form), recorded in `docs/baseline/<capture-date>/owner/mig-04-mechanical.md`; amended 2026-09-22 to drop Phase 10 D-22's additional requirement that the owner log in once, because the purpose clause is inspectability of the rollback target and rollback is a two-record DNS revert — no one authenticates to WordPress to perform it, so the owner's credentials were never on the rollback path
- [x] **MIG-05**: A typed 9-entry redirect map lives in `lib/seo/redirects.ts` with every destination built from `CANONICAL_ORIGIN`
- [x] **MIG-06**: A build gate fails on redirect chains, duplicate sources, or any destination not returning a direct 200
- [ ] **MIG-07**: Both legacy hostnames are attached to Vercel and repointed, and every legacy URL reaches its target in exactly **one** hop
- [ ] **MIG-08**: The legacy domain's mail path is verified unaffected by the cutover — MX, the `mail` A record, SPF, DKIM and DMARC unchanged in the dd24 zone we control, the mail host still accepting connections on 587/993, and inbound delivery to `info@tpsventilatie.nl` confirmed by sending from an address we control and observing no bounce; amended 2026-09-22 because the owner established the mailbox is not in use (Thomas works from Gmail), so Phase 10 D-23's reply round-trip would prove outbound from a mailbox nobody sends from while costing the one reply we need elsewhere — and a non-delivery report returns to the sender, so detecting failure never required access to the destination mailbox
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
| Moving legacy DNS nameservers | Superseded on 2026-09-16 by Phase 9 D-26: the tpsventilatie.nl delegation moved from cyberfolks to dd24 with a record-for-record mirrored zone (33/33 verified), mail untouched; rollback recipe in `docs/baseline/2026-09-16/README.md` |
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
| IDX-03 | Phase 8 | Complete |
| IDX-04 | Phase 8 | Complete |
| IDX-05 | Phase 8 | Complete |
| MEAS-01 | Phase 9 | Complete |
| MEAS-02 | Phase 9 | Complete |
| MEAS-03 | Phase 9 | Complete |
| MEAS-04 | Phase 9 | Complete |
| MEAS-05 | Phase 9 | Complete |
| MEAS-06 | Phase 9 | Complete |
| MIG-01 | Phase 10 | Complete |
| MIG-02 | Phase 10 | Pending |
| MIG-03 | Phase 10 | Pending |
| MIG-04 | Phase 10 | Pending |
| MIG-05 | Phase 10 | Complete |
| MIG-06 | Phase 10 | Complete |
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
| BLOG-02 | — (Future Requirements) | Deferred |

**Coverage:**
- v1.1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0 ✓
- Listed for traceability only, outside the 45: BLOG-02 (per-town location pages) — deferred to a future milestone, gated on GSC showing converting queries. Recorded here so `phase.complete` stops reporting it as missing from this table.

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
