# Feature Research

**Domain:** Dutch local climate-tech / HVAC installer lead-generation website (airco, warmtepompen, WTW, mechanische ventilatie) — Zoetermeer + regio
**Researched:** 2026-06-02
**Confidence:** HIGH (multiple live NL competitor sites audited directly; certification, ISDE, and BTW rules verified against RVO/Belastingdienst-adjacent sources and 2026 industry coverage)

## How to read this

This is a **lead-gen brochure site**, not a webshop. "Conversion" = the prospect contacts TPS (offerte / call / WhatsApp). Every feature below is judged by one question: *does it help a Zoetermeer-region homeowner trust TPS and reach out?* Features are mapped to the 4 pillars where it matters: **Airco**, **Warmtepompen (WP)**, **WTW**, **Mechanische Ventilatie (MV)**.

The single most important market-specific finding, repeated throughout: **ISDE subsidie and BTW rules differ per pillar.** Getting this wrong is both a trust-killer and a compliance/credibility risk (see anti-features). Summary table:

| Pillar | ISDE subsidie? | Notes |
|--------|----------------|-------|
| **Warmtepompen** (lucht/water, hybride) | ✅ YES — the headline subsidy | 2026: hybride start ~€1.025 + €225/kW; all-electric up to ~€13k. The flagship "subsidie" hook. |
| **WTW / balansventilatie (type D)** & **vraaggestuurd MV (C+)** | ✅ YES — **new from 1-1-2026** | €400, but **only combined with ≥1 insulation measure**. Newly relevant — most competitors haven't updated yet (opportunity). |
| **Airco** (lucht/lucht split) | ❌ NO | Split airco = air-air heat pump, explicitly excluded from ISDE. Stating otherwise is misinformation. |

---

## Feature Landscape

### Table Stakes (Users Expect These)

Missing any of these makes a NL installer site feel incomplete or untrustworthy. Every credible competitor audited (AircoProfs, Aircoland, DEK, Koelklimaattechniek) has most of them.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Offerte aanvragen** flow (free, no-obligation quote) | The #1 conversion action for every NL installer. "Gratis offerte" / "vrijblijvend" is universal phrasing. Already wired (GHL). | LOW | Have the form; needs reassurance copy ("gratis", "vrijblijvend", "binnen 24 uur reactie") + a clear `/offerte` destination, not just a contact page. |
| **Click-to-call phone (`tel:`)** prominent in header/hero | Older + urgent (storing) prospects call. Every competitor shows a number in the header. | LOW | Already in `SITE`/CTABanner — ensure it is visible in the Navbar, not only the footer. |
| **WhatsApp contact** (floating + links) | Standard low-friction NL channel; AircoProfs and DEK both expose it. PROJECT v1 explicitly wants a site-wide floating affordance. | LOW | `wa.me/31629403450` already used in CTABanner/MobileMenu — promote to a persistent floating button. |
| **Certification / keurmerk trust block** (F-gassen/STEK at minimum) | F-gassen certification is the **legal floor** for any airco/WP refrigerant work since 2020. Buyers increasingly check it. Aircoland/AircoProfs lead with it. | LOW–MED | Display only what TPS genuinely holds (see "certifications" detail below). Per pillar — F-gassen for airco/WP; InstallQ/BRL 6000 angle for WP. |
| **Reviews / beoordelingen with score + count** | Social proof is decisive locally. AircoProfs shows "Google 4.7/5, 167 reviews"; Koelklimaattechniek "9.7/10, 228 (Kiyoh)". A carousel already exists. | LOW–MED | Consolidate to one source (PROJECT says so). **Google Reviews** is the right primary platform (SEO + Maps + recognizable). Show real score + count + link to GBP. |
| **Pricing transparency** (indicative prijzen, *incl. BTW*, "geen verborgen kosten") | NL buyers expect a price range before they call; "alles inclusief, geen verborgen kosten" is a recurring trust line. AircoProfs/Aircoland show ranges; weak sites (DEK) hide it and feel evasive. | MED | Tarieven page exists. Airco/WTW/MV = indicative all-in ranges incl. BTW. **WP = quote-based** (per PROJECT) — say so explicitly rather than omitting. State voorrijkosten policy. |
| **Service-area presentation** (Zoetermeer + named regio towns) | Confirms "do you even come to me?" + drives local SEO. Every competitor lists municipalities (Aircoland 20+, AircoProfs per-neighbourhood). | LOW–MED | **Fix the 50 km vs 100 km inconsistency (launch blocker).** One canonical radius/town list in `lib/constants.ts`. |
| **Per-service content** for each pillar (Installatie / Onderhoud / Reparatie-Storing / Advies) | Buyers expect to find their exact need. PROJECT's IA (hub + 4 pillars + ~20 sub-pages) matches the market. | MED–HIGH | The data-driven template (already planned) is the right call. WP must be promoted from absent to first-class; Airco from stub to first-class. |
| **Brand authority** (Daikin, Mitsubishi Electric / Heavy, Ecodan) logos + "erkend/authorized installateur" | Brand association is a primary trust lever; every airco competitor lists brands. Authorized-dealer status materially boosts credibility + warranty story. | LOW | List the brands TPS installs; claim "erkend/geautoriseerd installateur" **only** where true. Daikin "Stand By Me" / dealer-locator listing is a real signal. |
| **Garantie / warranty terms** stated | "Hoeveel jaar garantie?" is a top FAQ. AircoProfs (1yr install +2 factory, →5 with contract), Koelklimaat (2–5yr, 10yr compressor). | LOW | State install warranty + factory warranty + how a maintenance contract extends it. |
| **Onderhoud + storing/reparatie offer** (incl. response-time promise) | Recurring revenue + trust. "Binnen 48 uur storing verholpen" (Aircoland), 24/7 storingsdienst (Dijkstra/Grijzeboom) are common. | LOW–MED | Even a simple "snelle storingsservice in de regio" with a realistic SLA. Maps to all 4 pillars (esp. airco/WP storing). |
| **Company legitimacy** (KvK, BTW-nummer, address) | NL buyers verify KvK; absence reads as fly-by-night. Footer already has KvK/BTW. | LOW | Keep in footer; mirror into LocalBusiness/HVACBusiness JSON-LD. |
| **FAQ** (per pillar + general) | Pre-empts the same questions and feeds SEO (FAQ schema). AircoProfs has 9, Aircoland 6, covering permits, cost, heating, subsidie, warranty. | MED | Strong table-stakes for SEO. Cover: kosten, garantie, subsidie/ISDE (per pillar!), VvE/vergunning, geluid, onderhoudsfrequentie. |
| **Google Maps embed + route** | "Where are you / how do I get there" + local trust. Contact page already has an embed. | LOW | **Fix the placeholder pin to the verified location (launch blocker).** |
| **Mobile-first responsive + fast** | Majority of local searches are mobile; Core Web Vitals affect ranking. | MED | Static export helps; verify page-speed (a PROJECT SEO task). |

### Differentiators (Competitive Advantage)

Where TPS can stand out. These align with TPS's core value (turn local search demand into contacted leads) and its 4-USP positioning (Gecertificeerd, Snel, Persoonlijk, Transparant). Don't chase all of them — pick the ones that reinforce trust + conversion.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Accurate per-pillar ISDE / subsidie guidance** (esp. WP + the *new 2026 WTW/ventilatie* subsidy) | Most competitors are vague or stale on subsidie; the **ventilatie ISDE (from 1-1-2026)** is brand-new and underexploited. Being correct + current is a genuine trust + SEO edge, and directly relevant to TPS's ventilation roots. | MED | "Transparant" USP made concrete. Show: WP amounts, WTW €400 (+insulation condition), and honestly that **airco ≠ ISDE**. Link RVO. Keep amounts in one data file (they change yearly). |
| **"Eigen monteurs, geen onderaannemers"** + named team / "Verhaal van Thomas" | Personal, owner-led trust beats anonymous lead-aggregators (Airco-Expres etc.). Directly the "Persoonlijk" USP. AircoProfs uses "eigen monteurs" as a selling point. | LOW | Over-ons already has Thomas's story; surface this line site-wide. Strong against faceless competitors. |
| **Transparent indicative pricing per pillar incl. all-in framing** | Few local rivals publish clear *all-in incl. BTW, geen verborgen kosten* numbers; doing so converts price-shoppers who bounce off "neem contact op". | MED | The "Transparant" USP made concrete. Airco/WTW/MV ranges; WP "vanaf / op aanvraag" with what's included. Beats DEK's no-pricing approach. |
| **Fast, specific response promise** ("binnen X uur reactie", instant owner notification) | Speed-to-lead wins in HVAC. PROJECT v1 already adds instant owner WhatsApp/email notification — make the *promise* visible to the user ("binnen 24 uur reactie"). The "Snel" USP. | LOW | The notification (GHL workflow) is backend; the on-page **promise** is the differentiator. Don't over-promise — match the SLA the owner can keep. |
| **Per-location / per-neighbourhood landing pages** done well (unique content) | AircoProfs's 6 Zoetermeer-neighbourhood pages are a clear local-SEO moat. Genuinely useful, locally-worded pages rank where thin rivals don't. | MED–HIGH | **Caveat (see anti-features):** must be genuinely unique per page, not town-name-swapped boilerplate, or Google won't index. Pillar × region matrix. |
| **Onderhoudscontract** offering (priority storing, reduced rates, material discount) | Recurring revenue + retention; signals a serious operator. Dijkstra/AircoProfs use contracts to extend warranty + give priority. | MED | Even a single clear contract tier ("jaarlijks onderhoud, opzegbaar, voorrang bij storing"). Maps to airco/WP/WTW/MV. |
| **HVACBusiness / Service / FAQ JSON-LD + GBP alignment** | The business block (stars, hours, click-to-call) above organic results is powered by LocalBusiness markup + GBP. A structured-data edge punches above a small site's weight. | MED | Use `HVACBusiness` subtype (more specific than generic LocalBusiness), Service schema per pillar, FAQPage schema. Already a PROJECT SEO task — flag the *specific* type. |
| **Light blog / kennisbank** (SEO + trust) | Ranks for informational queries ("airco of warmtepomp?", "kost airco onderhoud", "ISDE 2026"); feeds internal links to service pages. PROJECT scopes a light blog/FAQ. | MED | Start small, evergreen + locally framed. Don't build a heavy CMS (see anti-features) — MDX/in-repo per PROJECT. |
| **VvE / vergunning guidance** (apartments) | Zoetermeer has many flats/VvE's; AircoProfs differentiates with VvE permission help + documentation. Reduces a real buyer blocker. | LOW–MED | A short "airco in een appartement / VvE-toestemming" section. Mostly airco (outdoor-unit placement) + MV. |
| **Energy-savings / running-cost framing** (airco-as-heating, gas-vs-airco) | AircoProfs's gas-vs-airco savings table reframes airco as an investment. Bridges naturally to the warmtepomp pillar. | LOW–MED | Honest, sourced numbers. Useful cross-sell from airco → WP. |

### Anti-Features (Commonly Requested, Often Problematic)

Things that look appealing for an HVAC lead-gen site but create trust, compliance, or maintenance problems. Documented to prevent scope creep and credibility damage.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Claiming ISDE subsidie for airco** (or vague "subsidie mogelijk!" on airco pages) | "Subsidie" is a powerful hook; tempting to slap it everywhere. | **Factually wrong** — split airco (lucht/lucht) is excluded from ISDE. Misleads buyers, invites disappointment + complaints, undermines the "Transparant" USP, and is a misinformation risk. | Be explicit per pillar: airco ❌, WP ✅, WTW/MV ✅ (2026, +insulation). Honesty here *is* the differentiator. |
| **Quoting a "6% / 9% BTW op airco"** without legal grounding | Competitors and BE sources circulate "6% btw" claims; copying them seems pro-buyer. | In **NL, heat pumps stay 21% in 2026** (the 6% is Belgium). Insulation *labour* is 9% (materials 21%); airco BTW claims are inconsistent and easily wrong. Stating a wrong rate is a credibility/compliance landmine. | Don't publish a BTW rate you haven't verified for NL + the specific service. Show prices **incl. BTW** as a total; let the offerte state the breakdown. If unsure, omit the rate, not the transparency. |
| **Hardcoded standardized heat-pump price tables** | Pricing transparency is good; full WP price lists feel complete. | WP cost varies hugely by home (kW, emitters, hybride vs all-electric); a fixed table will be wrong, set false expectations, and is explicitly **out of scope** per PROJECT (quote-based for now). | WP = "indicatie vanaf / prijs op maat via offerte" + what's included + the subsidie context. Keep firm published prices to airco/WTW/MV where they're more standard. |
| **Generic town-name-swapped location pages at scale** | Easy way to "cover" 20+ towns for SEO. | Google detects near-duplicate location pages and **won't index** them; can drag down site quality. Wasted effort. | Fewer, genuinely unique pages (local landmarks, neighbourhoods, real project context) — AircoProfs-style — prioritised by demand. Quality over count. |
| **Instant online price calculator / "boek nu" booking** | Feels modern, frictionless, "Tesla-like". | This is a **consultative, site-survey-dependent** purchase (placement, electrics, VvE). A self-serve price/booking sets wrong expectations and skips the qualification the owner needs. High build cost, low fit. | Keep the **offerte → human contact** model. The detailed-form approach (Airco Innovatie's m³/unit/placement wizard) captures qualification *without* auto-pricing. |
| **Over-long mandatory quote form (10+ required fields)** | More data per lead seems better; Airco Innovatie collects a lot. | Long required forms **kill conversion** for a small operator who can ask details on the call. Friction beats data here. | Keep v1 form short (name, contact, postcode/plaats, dienst, bericht). Optional detail fields / photo upload as *optional*. Speed-to-lead > rich form. |
| **Heavy headless CMS now** | Self-service editing sounds future-proof. | Owner is not self-editing yet; CMS adds ops overhead and is **out of scope** per PROJECT. | Content in-repo (MDX/data files), Claude-drafted + owner-reviewed. Revisit CMS only when the owner needs self-service. |
| **Live chat / chatbot / AI assistant** | Trendy engagement widget. | Needs staffing to be useful; an unmanned bot frustrates and competes with the WhatsApp + phone + form channels already chosen for v1. Duplicate comms surface. | WhatsApp *is* the lightweight chat channel here. Skip bots in v1. |
| **Fake / unverifiable trust badges or unowned certifications** | Padding the trust block looks stronger. | Claiming STEK/BRL/InstallQ/authorized-dealer status TPS doesn't hold is a serious credibility + (for some) legal risk; easily disproven. | Display only genuinely-held certs/brands. If F-gassen is the only formal one, lead with it confidently + lean on reviews, brand, and the personal/owner story. |
| **Newsletter signup / heavy lead-magnet funnels** | Standard "capture the email" marketing. | Low intent for a one-off install purchase; distracts from the offerte CTA and adds GDPR/AVG surface for little return. | Single-minded focus on offerte / call / WhatsApp. One primary CTA per page. |
| **Aggressive cookie/marketing-tag stack** | "We need all the analytics + retargeting." | AVG/cookie-consent friction + page-speed cost hurt a trust-first local site. PROJECT v1 only needs GA4/Vercel Analytics + Search Console. | Minimal, consent-correct analytics (GA4 or Vercel Analytics) + GSC. Defer ad pixels. |

---

## Feature Dependencies

```
[Per-pillar service pages (data-driven template)]
    └──requires──> [Service taxonomy in lib/constants/data]
                       └──enables──> [Per-pillar FAQ + Service JSON-LD]
                       └──enables──> [Per-location pages (pillar × region)]

[Accurate ISDE/subsidie guidance]
    └──requires──> [Per-pillar content model] (airco vs WP vs WTW/MV differ)
    └──requires──> [Single subsidie-data source] (amounts change yearly)

[Reviews score + count on-page]
    └──requires──> [One canonical review source = Google Business Profile]
                       └──enables──> [Review/AggregateRating in JSON-LD + GBP stars]

[Secure offerte submission + instant owner notification]
    └──requires──> [Resolve client-exposed GHL webhook]  ⚠️ (server route vs output:"export")
    └──enables──> ["binnen 24 uur reactie" promise being truthful]

[Service-area presentation]
    └──requires──> [Fix 50km/100km radius inconsistency]  ⚠️ launch blocker
    └──feeds──> [Per-location pages] [LocalBusiness/HVACBusiness JSON-LD geo]

[HVACBusiness JSON-LD] ──enhances──> [Local SEO / GBP business block]
[Light blog/kennisbank] ──enhances──> [Service pages] (internal links, informational queries)
[Floating WhatsApp] ──enhances──> [All pages] (persistent low-friction conversion)

[Self-serve price calculator] ──conflicts──> [Consultative offerte model] (skips qualification)
[Long mandatory form]        ──conflicts──> [Speed-to-lead / high conversion]
[Airco "subsidie" claim]     ──conflicts──> [Transparant USP + factual accuracy]
```

### Dependency Notes

- **Service pages require the taxonomy first:** PROJECT's data-driven template means defining the pillar × sub-service taxonomy once unlocks pages, FAQ, Service schema, and location pages together. Build the taxonomy/data model before content.
- **ISDE guidance requires per-pillar modelling:** because eligibility splits by pillar (and WTW/MV only from 2026 with an insulation condition), subsidie content cannot be a single global block — it must live per pillar, sourced from one amounts file.
- **Truthful response promise requires the secured lead path:** "binnen 24 uur reactie" is only safe to advertise once the form reliably delivers (resolve the webhook exposure + add network error handling so leads don't silently fail).
- **Per-location pages depend on a fixed service area + unique content:** resolve the radius inconsistency first; then only build location pages you can make genuinely unique (anti-feature: boilerplate).
- **Reviews on-page depend on one canonical source:** pick Google Business Profile as the single source (SEO + recognizability), then drive AggregateRating schema and the carousel from it.
- **Calculator/long-form conflict with the model:** the consultative offerte flow is the product; auto-pricing and over-long forms work against it — keep them out.

---

## MVP Definition

### Launch With (v1) — must-have for going live as a credible 4-pillar lead site

These map directly to PROJECT's Active list + launch blockers. Ruthlessly: trust signals + the 4 pillars + working conversion + the SEO/QA floor.

- [ ] **4-pillar IA**: `/diensten` hub + Airco, Warmtepompen, WTW, Mechanische Ventilatie pillar pages (data-driven template) — *core of becoming "klimaattechniek"; WP + Airco promoted to first-class*
- [ ] **Per-pillar core sub-services** (at least Installatie / Onderhoud / Reparatie-Storing / Advies) — *buyers must find their exact need*
- [ ] **Offerte flow** with reassurance copy ("gratis", "vrijblijvend", "binnen 24 uur reactie") + **short** form (name, contact, postcode/plaats, dienst, bericht) — *the primary conversion*
- [ ] **Secured lead path + instant owner notification** (resolve webhook exposure, add network error handling, input validation/schema, honeypot) — *leads must not silently fail; blocker*
- [ ] **Floating WhatsApp** + verified `tel:`/`mailto:`/`wa.me` on every page — *low-friction conversion, PROJECT v1*
- [ ] **Certification/keurmerk trust block** — F-gassen/STEK (+ any genuinely-held BRL/InstallQ/VCA), per-pillar — *legal-floor trust signal; only what's true*
- [ ] **Reviews** consolidated to Google Business Profile, score + count + link, on home + key pages — *decisive social proof; PROJECT wants one source*
- [ ] **Pricing transparency**: indicative all-in *incl. BTW, geen verborgen kosten* for Airco/WTW/MV; WP = "op maat via offerte" with inclusions + voorrijkosten policy stated — *the Transparant USP; don't hide it like DEK*
- [ ] **Accurate per-pillar ISDE/subsidie note** (WP ✅, WTW/MV ✅ 2026+insulation, airco ❌) sourced/linked — *trust + the new-2026 ventilation angle; avoids the subsidie anti-feature*
- [ ] **Brand authority** block (Daikin, Mitsubishi Electric/Heavy, Ecodan) with accurate "erkend installateur" claims — *primary trust lever*
- [ ] **Garantie + onderhoud/storing** statements with a realistic SLA — *top buyer questions*
- [ ] **Service area**: canonical Zoetermeer + regio list/radius (**fix 50/100km**), presented per pillar — *"do you come to me" + local SEO*
- [ ] **FAQ** per pillar + general (kosten, garantie, subsidie, VvE/vergunning, geluid, onderhoud) — *trust + FAQ schema*
- [ ] **Technical + local SEO floor**: `sitemap.xml`, `robots.txt`, **HVACBusiness + Service + FAQ JSON-LD**, OG/Twitter meta, GBP alignment, NAP consistency, page-speed pass — *can't run SEO blind; PROJECT scope*
- [ ] **Measurement**: GA4 or Vercel Analytics + Google Search Console + sitemap submission
- [ ] **QA blockers fixed**: Maps pin to verified location, radius consistency, form error handling — *launch blockers*

### Add After Validation (v1.x) — once leads are flowing and SEO is indexing

- [ ] **Per-location / per-neighbourhood pages** (pillar × region), genuinely unique — *trigger: confirm which town/pillar queries actually convert in GSC before scaling pages*
- [ ] **Light blog / kennisbank** (evergreen, locally framed; internal links to pillars) — *trigger: SEO baseline live + a few high-value query gaps identified*
- [ ] **Onderhoudscontract** offering with tiers (voorrang, gereduceerd tarief) — *trigger: install volume justifying a recurring-service funnel*
- [ ] **VvE / appartement** guidance section — *trigger: meaningful share of Zoetermeer flat enquiries*
- [ ] **Energy-savings / gas-vs-airco** framing + airco→WP cross-sell content — *trigger: airco pillar performing, push the WP upsell*
- [ ] **Brand-specific install content** (Daikin / Mitsubishi Electric / Heavy / Ecodan) — *trigger: per-brand search demand; PROJECT already plans this in content*
- [ ] **Callback-request** option ("bel mij terug") alongside the form — *trigger: if phone-preferers are bouncing*

### Future Consideration (v2+) — defer until product-market fit / owner readiness

- [ ] **Headless CMS** — *defer: only when the owner wants self-service editing (out of scope now)*
- [ ] **Full GHL CRM pipelines / nurture automation** — *defer: v1 is notify-only; full CRM is a later milestone per PROJECT*
- [ ] **Customer portal / online appointment scheduling** — *defer: consultative model doesn't need it pre-PMF*
- [ ] **Standardized WP pricing tooling / configurator** — *defer: until a real price model exists (out of scope now)*
- [ ] **Multi-language (EN)** — *defer: market is Dutch (`nl`) only for now*
- [ ] **Domain migration to tpsklimaattechniek.nl** — *defer: owner to verify; not blocking, per PROJECT*

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| 4-pillar IA + data-driven service template | HIGH | HIGH | P1 |
| Offerte flow (short form) + reassurance copy | HIGH | LOW | P1 |
| Secured lead path + owner notification + error handling | HIGH | MEDIUM | P1 |
| Floating WhatsApp + verified contact links | HIGH | LOW | P1 |
| Certification/keurmerk trust block (true only) | HIGH | LOW | P1 |
| Reviews (Google) score+count on-page | HIGH | LOW | P1 |
| Pricing transparency (Airco/WTW/MV incl. BTW; WP on aanvraag) | HIGH | MEDIUM | P1 |
| Accurate per-pillar ISDE/subsidie note | HIGH | MEDIUM | P1 |
| Brand authority block | MEDIUM | LOW | P1 |
| Service-area canonical (fix 50/100km) | HIGH | LOW | P1 |
| Garantie + onderhoud/storing statements | MEDIUM | LOW | P1 |
| FAQ per pillar + general | MEDIUM | MEDIUM | P1 |
| SEO floor (sitemap/robots/JSON-LD HVACBusiness/OG) | HIGH | MEDIUM | P1 |
| Analytics + Search Console | MEDIUM | LOW | P1 |
| Maps pin fix + radius fix (QA blockers) | HIGH | LOW | P1 |
| Per-location / neighbourhood pages (unique) | HIGH | HIGH | P2 |
| Light blog / kennisbank | MEDIUM | MEDIUM | P2 |
| Onderhoudscontract offering | MEDIUM | MEDIUM | P2 |
| VvE / appartement guidance | MEDIUM | LOW | P2 |
| Energy-savings framing + airco→WP cross-sell | MEDIUM | LOW | P2 |
| Brand-specific install content | MEDIUM | MEDIUM | P2 |
| Callback-request option | LOW | LOW | P2 |
| Headless CMS | LOW (now) | HIGH | P3 |
| Full CRM automation / nurture | MEDIUM | HIGH | P3 |
| Customer portal / online booking | LOW | HIGH | P3 |
| Price calculator / configurator | LOW (anti-fit) | HIGH | P3 |

**Priority key:** P1 = must have for launch · P2 = should have, add after validation · P3 = nice to have / future

---

## Competitor Feature Analysis

Audited directly (live pages) unless noted. "Strong" = AircoProfs-class full stack; "Weak" = thin/evasive.

| Feature | AircoProfs (strong) | DEK Installaties (regional, thinner) | Koelklimaattechniek (mid) | TPS Approach (recommended) |
|---------|---------------------|--------------------------------------|---------------------------|----------------------------|
| Offerte CTA | "Gratis offerte", 7+ placements, "binnen 1 uur in je inbox" | "Offerte aanvragen" ×3, "vrijblijvend" | Quote + "gratis indicatie" forms | Short offerte form, "gratis/vrijblijvend, binnen 24u reactie" — prominent, repeated |
| WhatsApp | ✅ dedicated number + link | ✅ wa.me link | — | ✅ floating site-wide (v1) |
| Certifications shown | F-gassen, **BRL 100**, **VCA**, MetaalUnie | "gecertificeerd" (vague, none named) | KvK/BTW only | Name **only genuinely-held** (F-gassen/STEK ± BRL/InstallQ/VCA); lead with F-gassen |
| Reviews | **Google 4.7/5 (167)** + named testimonials | Google badge, no score/count | **Kiyoh 9.7/10 (228)** | **Google** score+count+link; consolidate to one source |
| Pricing transparency | Ranges per model, **"alles inclusief, geen verborgen kosten"**, avg quote | ❌ none (feels evasive) | Maintenance €-ranges; no product prices | Airco/WTW/MV all-in incl. BTW ranges; **WP on aanvraag** (stated) |
| ISDE / subsidie | ✅ correct: "split airco komt **niet** in aanmerking" | ❌ none | — | ✅ per-pillar accuracy + **new 2026 WTW/MV** angle (differentiator) |
| Brands | Mitsubishi Heavy (93%), Daikin | Mitsubishi Heavy, LG, Daikin; Elga/Intergas (WP) | Daikin, Panasonic, Mitsubishi, LG, Samsung… | Daikin, Mitsubishi Electric/Heavy, **Ecodan (WP)** — accurate authorized claims |
| Garantie | 1yr install +2 factory (→5 w/ contract) | ❌ not stated | 2–5yr; 10yr compressor | State install+factory+contract-extension |
| Storing/onderhoud SLA | 3-wk install; service-aanvragen | maintenance/repair mentioned | annual maintenance | Realistic regio storing SLA + onderhoud (v1), contract tiers (v2) |
| Local/area pages | ✅ **6 Zoetermeer-neighbourhood** pages (moat) | "regio Zoetermeer e.o." (vague) | 3 towns | Canonical area first; unique location pages in v2 |
| FAQ | ✅ 9 (permits, warranty, subsidie, heating) | ❌ none | ✅ basic | Per-pillar FAQ + schema (v1) |
| Personal/owner trust | "Eigen monteurs, geen onderaannemers" | gediplomeerde vakmensen | — | **"Verhaal van Thomas" + eigen monteurs** — lean into Persoonlijk USP |
| Speed/SEO | fast, neighbourhood SEO | basic | webshop-ish | Static + HVACBusiness JSON-LD + GBP (v1) |

**Read of the field:** the market floor is rising — strong rivals combine transparent all-in pricing, real review scores, named certifications, WhatsApp, per-area SEO, and FAQ. Weak rivals (and lead-aggregators) skip pricing/certs and feel evasive or faceless. **TPS's wedge:** be the *honest, certified, personal, transparent* local operator — correct per-pillar subsidie (incl. the under-exploited 2026 ventilation ISDE), real Google reviews, all-in pricing where it's standard, and Thomas's owner-led story — rather than out-spending aggregators on page count.

---

## Sources

Live competitor pages audited:
- [AircoProfs — Zoetermeer](https://www.aircoprofs.nl/airconditioning/zoetermeer/) (strongest reference: pricing, reviews 4.7/167, certs F-gassen/BRL100/VCA, WhatsApp, neighbourhood pages, FAQ, correct airco-ISDE exclusion)
- [Aircoland — Zoetermeer](https://www.aircoland.com/airco-zoetermeer/) (STEK-led, price range incl. btw, 48u storing, wide service area, FAQ)
- [DEK Installaties (Zoetermeer)](https://dek-installaties.nl) (regional, vague certs, no pricing — weak reference)
- [Koelklimaattechniek — Zoetermeer](https://www.koelklimaattechniekwebwinkel.nl/airco-zoetermeer/) (Kiyoh 9.7/228, 5yr nazorg, maintenance pricing)
- [Airco Innovatie — offerte form](https://aircoinnovatie.nl/offerte-ontvangen/) (detailed multi-field qualification form pattern)
- [KH Installaties](https://khinstallaties.nl/) · [Indoor Comfort (Zuid-Holland)](https://www.indoorcomfort.nl/) · [Aircotech Klimaat (Den Haag)](https://www.aircotechklimaat.nl/) · [Dijkstra Klimaattechniek](https://dijkstra-klimaattechniek.nl/airco-onderhoud/) · [Grijzeboom (Amsterdam)](https://grijzeboom.com/) (24/7 storing, onderhoudscontract, multi-pillar klimaattechniek patterns)

Certifications & quality marks:
- [Kiwa — STEK-certificaat](https://www.kiwa.com/nl/nl/services/certificering/stek-certificaat-het-keurmerk-voor-de-koeltechnische-sector/) · [Ondernemersplein — F-gassen certificaat](https://ondernemersplein.overheid.nl/wetten-en-regels/certificaat-voor-werken-met-f-gassen/) (F-gassen mandatory since 2020; STEK no longer legally required but still a recognised mark)
- [InstallQ — Warmtepompinstallaties](https://installq.nl/warmtepomp-installaties) · [KvINL — BRL6000](https://kvinl.nl/brl6000/) · [Kiwa — BRL 6000-21](https://www.kiwa.com/nl/nl/diensten/certificering/brl-6000-21/) (InstallQ recognition; CentraalRegisterTechniek.nl / EchteInstallateur.nl public registers)
- [Daikin dealer-locator / erkend installateur](https://www.daikin.be/nl_be/particulier/dealer-locator.html) · [Technische Service — BRL-100 + Daikin/Mitsubishi dealer](https://www.technischeservice.nl/airco-assen) (authorized-dealer + BRL100/F-gassen pattern)

ISDE / subsidie (per pillar):
- [RVO — ISDE Warmtepomp woningeigenaren](https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp) · [RVO — ISDE Ventilatie woningeigenaren](https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie) (ventilatie in ISDE from 1-1-2026)
- [Ventilatieland — ISDE op ventilatie vanaf 1-1-2026](https://www.ventilatieland.nl/nl_NL/blog/item/ventilatie-is-officieel-onderdeel-van-isde-subsidie-vanaf-1-januari-2026-wat-moet-je-weten-2095/) (€400, type C+/D, insulation-combination condition)
- [AircoProfs FAQ + Simpel Subsidie](https://simpelsubsidie.nl/blogs/Kan-ik-subsidie-voor-mijn-airco-krijgen) / [NIBE — ISDE warmtepomp 2026](https://aardgasvrij.nibenl.eu/kosten-en-subsidie/subsidie-voor-een-warmtepomp) (airco/lucht-lucht NOT eligible; WP amounts 2026)

Pricing transparency & BTW:
- [Slimster — kosten airco plaatsen 2026](https://slimster.nl/airco/kosten-airco-plaatsen/) · [Aircoland — kosten airco](https://www.aircoland.com/kosten-airco/) (all-in framing, voorrijkosten itemised separately, "geen kleine lettertjes")
- [Belastingdienst — btw isoleren van woningen (9% arbeid)](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/diensten_9_btw/werkzaamheden_aan_woningen/isoleren_van_woningen) · [Warmtepomp-gids — BTW warmtepomp 2026](https://www.warmtepomp-gids.nl/subsidie/btw/) (NL heat pumps remain 21% in 2026; 6% is Belgium — anti-feature basis)

Reviews & local SEO:
- [Kiyoh vs Trustpilot](https://kiyoh.com/en/trustpilot-vs-kiyoh/) / [Fenj — reviews op website](https://www.fenj.nl/reviews-op-website-plaatsen/) (Google = primary for local SEO + recognizability; Kiyoh common for NL SME)
- [ATX Marketing — schema voor dienstverleners (HVACBusiness/Service/FAQ)](https://atxmarketing.nl/schema-markup-dienstverleners/) · [WeTalkSEO — locatiepagina's](https://www.wetalkseo.nl/locatiepaginas-uitgelegd-zo-versterk-je-je-lokale-seo-strategie/) (use HVACBusiness subtype; avoid duplicate location pages)

---
*Feature research for: Dutch local climate-tech (airco / warmtepompen / WTW / mechanische ventilatie) installer lead-gen site — Zoetermeer + regio*
*Researched: 2026-06-02*
