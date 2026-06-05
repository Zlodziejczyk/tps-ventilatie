# SEO Owner Runbook — TPS klimaattechniek

> Owner-internal checklist for the credential-bound SEO steps that cannot be done in
> the repository (D-07, SEO-07 / SEO-09). The code is shipped; these are the external
> dashboard actions that activate it. Work through each section once before launch.
>
> **Geen wachtwoorden/tokens in dit document.** De GSC-token hoort in een Vercel
> environment variable, niet hier.

Last updated: 2026-06-05 (Phase 3 — SEO infrastructure)

---

## 1. Google Business Profile (GBP) — SEO-07

The single biggest local-discovery lever. Align GBP exactly with the on-site NAP +
JSON-LD so Google consolidates the signals.

- [ ] **Bedrijfsnaam:** zet de naam op **`TPS klimaattechniek`** (gelijk aan de site,
      JSON-LD `name`, en metadata-merk). Niet "TPS Ventilatie".
- [ ] **Primaire categorie:** **`Airconditioningsbedrijf`** *(aanbevolen — **bevestigen**
      met de eigenaar; dit stuurt de belangrijkste lokale rankingsignalen).*
- [ ] **Secundaire categorieën:** `Verwarmingsinstallateur` (warmtepompen),
      `Ventilatiebedrijf`, `HVAC-aannemer`.
- [ ] **Servicegebied:** gebruik de lijst uit **`SITE.serviceAreas`** (`lib/constants.ts`)
      als bron — momenteel: Zoetermeer, Den Haag, Leidschendam-Voorburg,
      Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden. *Eigenaar cureert deze
      lijst vóór publicatie — claim nooit een gebied dat niet bediend wordt (A-2). Houd
      GBP en `SITE.serviceAreas` gelijk.*
- [ ] **Locatie / maps-pin:** controleer dat de pin op het echte bedrijfsadres staat
      (Industrieweg 6 B, 2712 LB Zoetermeer). Zie §5 (geo) — de coördinaten worden
      gedeeld met de JSON-LD en de Phase-5 maps-embed.
- [ ] **NAP-consistentie:** telefoon `06 - 29 40 34 50`, e-mail `info@tpsventilatie.nl`,
      adres exact gelijk aan de site (`SITE`).
- [ ] Voeg, zodra beschikbaar, de GBP-URL + social-URLs toe — die voeden later de
      JSON-LD `sameAs` (nu bewust leeg gelaten, A-3).

## 2. Google Search Console (GSC) — SEO-09

- [ ] **Verificatie-token instellen:** Vercel → Project `tps-app` → Settings →
      Environment Variables → voeg **`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`** toe met de
      `content`-waarde uit GSC → Settings → Ownership verification → **HTML tag**.
      *(Publiek token, geen secret. Leeg = de meta-tag wordt simpelweg weggelaten.)*
- [ ] Redeploy, bekijk de paginabron en bevestig dat
      `<meta name="google-site-verification" content="…">` aanwezig is.
- [ ] Voltooi de verificatie in GSC.
- [ ] **Sitemap indienen:** GSC → Sitemaps → dien **`https://tpsventilatie.nl/sitemap.xml`**
      in. (Bevat nu de 4 statische pagina's; service-pagina's komen er automatisch bij
      zodra Phase 4 ze publiceert.)
- [ ] **Optionele upgrade:** een DNS-TXT-record voor een **domein-brede** GSC-property
      (vangt http/https + www/apex in één property). Aanbevolen maar niet vereist.

## 3. Vercel — Analytics + Speed Insights — SEO-09

De code is gewired (`<Analytics />` + `<SpeedInsights />` in `app/layout.tsx`); zet de
verzameling aan.

- [ ] Vercel Dashboard → Project `tps-app` → **Analytics** → Enable.
- [ ] Vercel Dashboard → Project `tps-app` → **Speed Insights** → Enable.
- [ ] Cookieless / privacy-vriendelijk → géén cookie-consent-banner nodig (LEAD-06).
      GA4 is bewust uitgesteld (zou consent + privacy-policy-verwerkersvermelding vergen).

## 4. AI-crawler opt-out (optioneel) — documentatie, niet afgedwongen

`app/robots.ts` staat de AI-crawlers **bewust toe** voor GEO / AI-citation-zichtbaarheid
(ChatGPT, Perplexity, AI Overviews) — een echt lokaal-discovery-kanaal. Wil de eigenaar
zich later toch afmelden, dan kan per bot een `disallow` worden toegevoegd. Huidige
toegestane bots:

| Bot | Bron |
|-----|------|
| `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` | OpenAI |
| `ClaudeBot` | Anthropic |
| `PerplexityBot` | Perplexity |
| `Google-Extended` | Google (AI-training) |
| `CCBot` | Common Crawl |

*Afmelden = voeg een `disallow: "/"` toe voor de betreffende `userAgent` in `app/robots.ts`.
Aanbeveling: laten staan (zichtbaarheid > afmelding voor een lokaal installatiebedrijf).*

## 5. Geo-coördinaten + canonical — bevestigen vóór launch

- [ ] **Echte bedrijfs-lat/lng bevestigen.** `SITE.geo` (`lib/constants.ts`) bevat nu de
      **placeholder** Zoetermeer-centroid (`lat 52.0607 / lng 4.4940`, A-1). Deze waarde
      voedt de JSON-LD `geo`, de GBP-pin én (Phase 5, QA-05) de zichtbare maps-embed.
      Vervang door de geverifieerde coördinaten van Industrieweg 6 B.
- [ ] **`www → apex` 301 herbevestigen.** Bevestigd op 2026-06-05
      (`www.tpsventilatie.nl` → `https://tpsventilatie.nl`, 301). Doe een snelle
      her-check vlak vóór launch zodat de canonical (`https://tpsventilatie.nl`) gelijk
      blijft aan de geserveerde origin.

---

### Samenvatting — wat hangt waarvan af
- **JSON-LD `geo` + GBP-pin + Phase-5 maps-embed** delen dezelfde geverifieerde coördinaat (§5).
- **Sitemap-inhoud groeit vanzelf** zodra Phase 4 service-pagina's op `published` zet — niets handmatig bijwerken.
- **`sameAs` (JSON-LD)** blijft leeg tot de eigenaar GBP/social-URLs aanlevert (§1).
