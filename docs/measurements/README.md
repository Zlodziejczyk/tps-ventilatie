# Wekelijkse indexatiemeting — `docs/measurements/`

> Elke week vraagt een script aan Google wat het van elke pagina op de site vindt, en legt het antwoord
> hier vast. Dit is de "heeft Google het gezien?"-kant van Phase 9 (MEAS-05). De andere kant — "serveren
> wij het goed?" — is `scripts/verify-indexation.ts`, en die twee blijven bewust apart (D-23): als ze het
> **oneens** zijn, is dát het waardevolste signaal dat deze meting kan geven.

## Wat staat hier

- `gsc/<datum>.json` — één meting per datum (UTC): per URL uit de sitemap het oordeel van Google
  (`verdict`, `coverageState`, `indexingState`, `robotsTxtState`, `pageFetchState`, `lastCrawlTime`,
  Google's canonical), plus Google's eigen telling van de ingediende sitemap (`sitemap.submitted`,
  `sitemap.errors`) en — als er een Vercel-token beschikbaar was — het aantal bezoeken van de laatste 7
  dagen (`analytics.visits7d`). Geschreven door `scripts/measure-indexation.ts`; de wekelijkse
  GitHub-Actions-run commit het bestand automatisch (zie de sectie *Automatisch* hieronder, toegevoegd in 09-05).
- De URL-lijst komt uit `sitemapEntries()` (`lib/seo/policy.ts`) — dezelfde bron als de sitemap zelf,
  nooit een losse lijst (D-19). Het aantal wordt vergeleken met `INDEXABLE_FLOOR` (27).

## Twee scripts, twee vragen

| script | vraag | bron van waarheid |
|---|---|---|
| `scripts/verify-indexation.ts` | Serveren wij de 27 pagina's goed (200, geen noindex, self-canonical)? | wat een crawler daadwerkelijk krijgt |
| `scripts/measure-indexation.ts` | Wat heeft Google ervan gemaakt? | de URL Inspection API van Search Console |

## Meldingen (flags)

Het script drukt elke melding af als `FLAG [code] <url> — <uitleg>` en eindigt met exit-code 1; de
GitHub-Actions-run opent (of vult aan) dan een issue met het label `indexation-alert`.

| code | betekenis | wat te doen |
|---|---|---|
| `below-ramp` | Minder pagina's geïndexeerd dan de trede van de kalender-ladder (hieronder) voorschrijft | Zoek in de tabel welke URL's géén `PASS` hebben en waarom (`coverageState`, `pageFetchState`); vraag indexering aan in GSC; **verlaag de trede niet** |
| `lost-indexation` | Een URL die in de vorige meting `PASS` was, is dat nu niet meer | Directe regressie. Controleer de pagina zelf (`verify-indexation.ts`), de status in de taxonomie en de laatste deploy |
| `robots-not-allowed` | Google meldt voor een **gecrawlde** URL dat `robots.txt` hem blokkeert (`robotsTxtState` ≠ `ALLOWED`) | Controleer `app/robots.ts` en de live `robots.txt`; een niet-gecrawlde URL geeft géén melding (die staat op `UNSPECIFIED` en is informatief) |
| `canonical-mismatch` | Google koos een andere canonical dan de URL zelf | Google vouwt de pagina samen met een andere. Controleer op dubbele content, verkeerde `<link rel="canonical">` of redirects |
| `count-vs-floor` | Het aantal URL's in de meting is niet gelijk aan `INDEXABLE_FLOOR` | De sitemap-oppervlakte en de vloer zijn het oneens — een bevinding, geen getal om aan te passen |
| `simulated-breach` | Bewust opgewekt met `--simulate-breach` (of `MEASURE_SIMULATE_BREACH=1`) | Niets: dit bewijst alleen dat de alarmroute werkt. Er wordt dan géén meting weggeschreven |

**Verlaag nooit een drempel om groen te krijgen — zoek uit welke pagina vastzit.** Dat is de les van
Phase 8: de vorige gate werd "gerepareerd" door het verwachte getal aan te passen, en daardoor bleef de
hele dienstenlaag maandenlang onzichtbaar voor Google.

## De ladder (D-20)

Verankerd op `RAMP_ANCHOR = 2026-09-16` — de dag waarop de sitemap is ingediend én door Google verwerkt
met 27 URL's (D-10). Alle drempels zijn **ondergrenzen**.

| vanaf (week) | datum | minimaal geïndexeerd |
|---|---|---|
| week 2 | 2026-09-30 | ≥ 10 van 27 |
| week 4 | 2026-10-14 | ≥ 20 van 27 |
| week 8 | 2026-11-11 | ≥ 25 van 27 |

Vóór 2026-09-30 geldt geen trede; de regressie-meldingen (`lost-indexation`, `robots-not-allowed`,
`canonical-mismatch`) gelden **altijd**, los van de ladder. De constanten en hun afleiding staan in
`scripts/gsc/thresholds.ts`; dat bestand is puur (geen netwerk, geen klok) en de plan-verificatie van
09-04 bewijst met verzonnen metingen dat elke melding daadwerkelijk afgaat.

## Lokaal draaien

1. Zet in `.env.local` (staat in `.gitignore`):
   `GSC_SERVICE_ACCOUNT_JSON_FILE=/absoluut/pad/buiten/de/repo/gsc-service-account.json`
   (de sleutel van de service-account `gsc-measure`; zie `.env.example`).
2. `npx tsx scripts/measure-indexation.ts` — schrijft `gsc/<vandaag>.json` en drukt de tabel + meldingen af.
   Opties: `--out <map>`, `--property sc-domain:…`, `--simulate-breach`.
3. Optioneel: `VERCEL_TOKEN=<kortlevend token> npx tsx scripts/measure-indexation.ts` voegt
   `analytics.visits7d` toe. Dat token nooit committen of in GitHub zetten.

Exit-codes: `0` schoon · `1` één of meer meldingen · `2` gebruiks- of authenticatiefout (bijv. de
service-account is geen *Full user* op de property).
