# Phase 6: Homepage conversion uplift - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-01
**Phase:** 6-homepage-conversion-uplift
**Areas discussed:** Page composition & scope, Hero (form + imagery + headline/geo), Pillar card interaction, Brand logos & proof band, Footer checkup, Reviews display + avatars, Closing CTA

---

## Page composition & scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full rebuild | Hero → 4-pillar grid → proof/trust band → closing CTA; retire ServicesSection/WhyTPSSection/ReviewsSection (absorbed) | ✓ |
| Rebuild + keep pricing | Same, but keep a PricingSection teaser | |
| Surgical swap | Only replace hero + services→pillar grid; leave the rest | |

**User's choice:** Full rebuild.

| Option (Pricing) | Description | Selected |
|--------|-------------|----------|
| Trust-pill only | No pricing section; transparency via USP pills; detail on /tarieven | |
| Keep a short pricing teaser | Compact preview on the home | |
| You decide | Claude picks during planning | ✓ |

**User's choice:** You decide → default trust-pill only, teaser allowed only if the page reads thin (CWV-mindful).

---

## Hero — form + imagery

| Option (form) | Description | Selected |
|--------|-------------|----------|
| Compact quick-start | Postcode + Telefoon + Dienst; compact OfferteForm variant → /api/lead | ✓ |
| Full OfferteForm in hero | 6-field Phase-5 form as-is | |
| Two-step teaser → full form | Minimal teaser reveals the full form lower | |

| Option (image) | Description | Selected |
|--------|-------------|----------|
| Photo in the hero | home-hero.jpg as hero visual (becomes LCP) | |
| Aurora-only hero, photo lower | Aurora hero; home-hero.jpg as a band lower down | ✓ |
| Aurora-only, photo unused | Hero aurora-only; image not used on home | |

**User's choice:** Compact quick-start form + aurora-only hero with home-hero.jpg placed lower.

---

## Hero — headline & geo

| Option | Description | Selected |
|--------|-------------|----------|
| Keep light geo in home H1 | Zoetermeer stays in the H1 (local anchor) | (basis) |
| De-localise the home H1 too | Match service pages; city only in <title>/sub-copy | |
| **Other (user)** | "Zoetermeer feels too local … more emphasis on the region (Zuid-Holland)" | ✓ |

**User's choice:** Region-emphasis (free text). Resolved together: keep **Zoetermeer as the ranking anchor** but frame regionally — H1 = "…goed geregeld in **Zoetermeer en heel Zuid-Holland**" + a coverage line "Van Den Haag tot Gouda en Leiden — actief binnen 60 km rondom Zoetermeer" (from `SITE.serviceAreas` + `serviceRadiusKm`). Rejected: bare-province H1 (dilutes local intent), "Central Holland" (not a real Dutch geo term). User accepted Claude's pick of framing #1.
**Notes:** Real footprint spans Den Haag/Delft/Leiden/Gouda across Zuid-Holland — regional emphasis is factually justified. Per-town location pages parked as v2/BLOG-02.

---

## Pillar card interaction

| Option (primary click) | Description | Selected |
|--------|-------------|----------|
| Link to pillar page + Offerte CTA | Card → /diensten/[pillar]; distinct Offerte CTA routes service into hero form + scrolls | ✓ |
| Whole card routes into the form | Card click pre-selects service + scrolls; Bekijk is secondary | |
| Expand in-place drawer | Click toggles a drawer on the home | |

| Option (detail depth) | Description | Selected |
|--------|-------------|----------|
| Chips as links, no drawer | Sub-service chip links only; depth on pillar page | |
| Keep the expandable drawer | Chip links + click-to-expand USP drawer | |
| You decide | Claude picks | ✓ |

**User's choice:** Card → pillar page + Offerte-routing CTA; sub-service chips as internal links; drawer = Claude's discretion (default: no drawer, best CWV).

---

## Brand logos & proof band

| Option (chip rendering) | Description | Selected |
|--------|-------------|----------|
| Styled text-word chips now | grayscale→brand-color name chips; SVGs later | ✓ |
| Wait for official SVG logos | Hold until owner supplies brand-kit | |
| No brand chips at launch | Sub-service chips only | |

| Option (which pillars) | Description | Selected |
|--------|-------------|----------|
| Airco + Warmtepompen only | Dealer-confirmed pillars only | |
| All 4 pillars | Include WTW/MV (needs owner brand confirmation) | ✓ |
| You decide | Claude picks | |

**User's choice:** Text-word chips now, on all 4 pillars.
**Notes:** WTW/MV brand names require owner confirmation before build; neutral "diverse merken / merkonafhankelijk" fallback if unconfirmed. Proof-band numbers taken as owner-finalized (4,9/34, BRL 100/200 + KvK; F-gassen/STEK dropped) — captured without re-asking.

---

## Reviews display + avatars

| Option (reviews) | Description | Selected |
|--------|-------------|----------|
| Static 3-up cards | Three fixed cards from lib/reviews.ts; no carousel JS | ✓ |
| Reuse ReviewCarousel | Auto-advancing carousel in the proof band | |

| Option (avatars) | Description | Selected |
|--------|-------------|----------|
| Initials monogram chips | Reviewer initials from real names (getInitials) | ✓ |
| Google-G + score only | No avatar stack | |
| Generic silhouette avatars | Placeholder faces (authenticity risk) | |

**User's choice:** Static 3-up cards + initials monogram chips.

---

## Closing CTA band

| Option | Description | Selected |
|--------|-------------|----------|
| Keep engineered dark band | gradient-ink Bel·WhatsApp·Offerte, AA-safe, before footer | ✓ |
| Drop the closing band | Rely on hero form + sticky bar + proof CTAs | |

**User's choice:** Keep the engineered dark closing band (AA-safe WhatsApp — bakes in A11Y-01).

---

## Footer checkup

| Option (placement) | Description | Selected |
|--------|-------------|----------|
| Fold into Phase 6 | Refresh footer as part of this phase | |
| Consolidate in Phase 7 | Do all footer work with the A11Y-02 pass | ✓ |
| Quick task now | Standalone /gsd-quick | |

**Scope selected (multi):** Real PNG logo · Klimaattechniek copy · Live-taxonomy Diensten links · Drop the 1px border.
**User's choice:** Route the footer refresh to **Phase 7** (out of Phase 6 scope). Added to 07-CONTEXT.md as UI-11.
**Notes:** Social icons (Instagram/Facebook) remain owner-blocked (IG/FB URLs pending).

---

## Claude's Discretion
- Pricing teaser (default: none).
- Pillar-card expand-drawer (default: none).
- Compact-form `naam` mechanic, coverage-line exact wording, which 3 reviews to feature, section spacing/order nuance, motion timing.

## Deferred Ideas
- Footer refresh → Phase 7 (UI-11).
- Official manufacturer SVG brand logos → follow-up (owner brand-kit + rights).
- WTW/MV serviced-brand list → owner input before build.
- Footer social icons → owner-blocked (IG/FB URLs pending).
- Per-town location pages → v2 (BLOG-02).
- Pricing teaser on the home → not shipping by default.
