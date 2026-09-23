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
| `legacy-canonical-not-moved` | Google noemt voor een oude URL nog steeds een adres op **tpsventilatie.nl** als canonical, acht weken of langer na de omschakeling | Controleer dat juist díe URL nog in één stap doorverwijst (`scripts/verify-redirects.ts`), dat de *Change of Address* voor de betreffende property nog actief is, en dat de bestemming indexeerbaar is. **Verhoog de week-drempel niet om het stil te krijgen** — de URL wordt met naam genoemd omdat er iets vastzit |
| `legacy-traffic-zero` | Vier wekelijkse metingen op rij geen enkele vertoning op het oude domein | **Niets automatisch.** Dit opent een gesprek over het opruimen van de redirect-tabel; het is géén toestemming. De tabel gaat nooit weg vóór de **180 dagen** die Google minimaal eist na een *Change of Address*, en dat blijft een apart besluit |

Sinds Phase 10 vraagt de wekelijkse run óók wat Google met de **negen oude adressen** heeft gedaan: hoeveel
vertoningen het oude domein nog krijgt, en welk adres Google per oude URL als canonical kiest. Dat staat in
de uitvoer onder een eigen kopje — `— legacy (tpsventilatie.nl) —` — en in de meting onder `legacy`. Die
scheiding is met opzet: een signaal over het oude domein mag nooit worden aangezien voor een terugval op het
nieuwe. Ontbreekt het `legacy`-blok in een meting, dan is dat een **gat, geen nul**: er wordt dan niets
gemeld, want "niet gemeten" is iets anders dan "geen verkeer".

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

## Automatisch (GitHub Actions)

Sinds Phase 9 (09-05) draait de meting zonder mens:

- **Wekelijks** — `.github/workflows/measure-indexation.yml` start elke **maandag 06:17 UTC** (08:17 Nederlandse zomertijd, 07:17 wintertijd) en voert `scripts/measure-indexation.ts` uit. Een groene run commit de nieuwe dagmeting als `github-actions[bot]` in `docs/measurements/gsc/` (`chore(measure): weekly GSC indexation reading`). Slaat een drempel aan (exit 1), dan opent de run **één** issue met het label `indexation-alert` (of reageert op het openstaande issue) en wordt de run rood. Handmatig starten: Actions → measure-indexation → *Run workflow*, of `gh workflow run measure-indexation.yml`; met de invoer `simulate_breach=true` bewijs je alleen het alarmpad (label `[SIMULATED]`, er wordt geen meting gecommit).
- **Na elke productie-deploy** — `.github/workflows/verify-indexation.yml` reageert op Vercel's `deployment_status` voor *Production* en draait `scripts/verify-indexation.ts` tegen `CANONICAL_ORIGIN` (wat wij serveren, D-22/D-23). Rood = een geserveerde regressie (pagina donker, redirect, noindex) en levert hetzelfde `indexation-alert`-issue op. De twee workflows stellen twee verschillende vragen; als ze het oneens zijn, is dát het signaal om als eerste te onderzoeken.
- **60-dagenregel** — GitHub schakelt een geplande workflow op een publieke repository uit na **60** dagen zonder activiteit in de repository. De wekelijkse bot-commit is zelf activiteit, dus dit gebeurt normaal niet; blijft de maandagmeting toch uit, dan: Actions → measure-indexation → *Enable workflow*, of één handmatige dispatch.
- **Sleutel roteren** — de workflow gebruikt precies één secret, `GSC_SERVICE_ACCOUNT_JSON` (de JSON-sleutel van `gsc-measure@tps-klimaattechniek-seo.iam.gserviceaccount.com`). Roteren: Cloud Console → IAM → Service accounts → gsc-measure → Keys → *Add key* (JSON) → `gh secret set GSC_SERVICE_ACCOUNT_JSON < nieuwe-sleutel.json` → het lokale bestand `~/.config/tps-klimaattechniek/gsc-service-account.json` vervangen → de oude sleutel in de Console verwijderen. Aanbevolen direct na Phase 9 (de eerste sleutel is tijdens de uitvoering handmatig verplaatst).
- **Wekelijkse rebuild** — de bot-push naar `main` laat Vercel dezelfde code opnieuw bouwen: een gratis wekelijkse bouwcontrole, bewust geaccepteerd. Wordt dat ooit storend, dan is `ignoreCommand` in `vercel.json` de uitschakelknop (bijv. overslaan als alleen `docs/measurements/` wijzigde).
