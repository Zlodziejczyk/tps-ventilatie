# SEO Owner Runbook — TPS klimaattechniek

> Owner-internal checklist for the credential-bound SEO steps that cannot be done in
> the repository (D-07, SEO-07 / SEO-09). The code is shipped; these are the external
> dashboard actions that activate it. Work through each section once before launch.
>
> **Geen wachtwoorden/tokens in dit document.** De GSC-token hoort in een Vercel
> environment variable, niet hier.

Last updated: 2026-09-17 (Phase 9 — Measurement Foundation: §2/§3 uitgevoerd, §6 geautomatiseerd, §7 nieuw)

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

## 2. Google Search Console — uitgevoerd (Phase 9)

Dit is gedaan op 2026-09-16 (Phase 9, plannen 09-01 t/m 09-03); er is hier niets meer aan te vinken.

- **Vijf properties, allemaal geverifieerd.** Twee Domain-properties — `sc-domain:tpsklimaattechniek.nl`
  en `sc-domain:tpsventilatie.nl` — geverifieerd via een DNS-TXT-record bij dd24 (beide zones staan
  sinds 2026-09-16 bij dd24, zie D-26 in `docs/baseline/2026-09-16/README.md`). Daaronder drie
  URL-prefix-properties: `https://www.tpsklimaattechniek.nl/` (via DNS geërfd **én** via de HTML-tag),
  `https://tpsventilatie.nl/` en `https://www.tpsventilatie.nl/` (via DNS geërfd; status in
  `docs/baseline/2026-09-16/gsc/legacy-url-prefix-status.md`).
- **Sitemap** `https://www.tpsklimaattechniek.nl/sitemap.xml` is ingediend en verwerkt: **27** URL's,
  0 fouten (machinebewijs: `docs/baseline/2026-09-16/gsc/sitemap-tpsklimaattechniek.nl.json`). Voor de
  5 nieuwe URL's is indexering aangevraagd; alle 27 staan op 2026-09-17 als "Submitted and indexed"
  (`docs/measurements/gsc/2026-09-17.json`).
- **Waar het token staat.** De HTML-tag-waarde staat als Vercel-omgevingsvariabele
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Production); productie serveert precies één
  `<meta name="google-site-verification">`. Het is een publiek token, geen secret.
- **Eigenaarschap.** Thomas (`tpsventilatie@gmail.com`) is gedelegeerd Owner op alle vijf properties;
  het service-account `gsc-measure@tps-klimaattechniek-seo.iam.gserviceaccount.com` heeft Full-rechten
  op de twee Domain-properties (voor de metingen van §7). Rollen: `docs/baseline/2026-09-16/gsc/users-and-permissions.md`.

**De `google-site-verification`-TXT-records op beide domeinen worden nooit verwijderd — ook niet na
Phase 10, ook niet als de legacy-site verdwijnt.** Zonder die records vervallen de Domain-properties en
de daarvan afgeleide URL-prefix-properties na Google's respijtperiode; `scripts/verify-measurement.ts`
controleert de aanwezigheid van beide records bij elke run (D-07).

## 3. Vercel Web Analytics + Speed Insights — uitgevoerd (Phase 9)

Ingeschakeld en bewezen rapporterend op 2026-09-16 (09-03); er is hier niets meer aan te vinken.

- **Web Analytics** staat aan sinds 2026-09-16T22:18Z en telt: de browser-beacon
  (`POST …/view` → 200) en de API-telling (2 bezoekers / 5 paginaweergaven binnen het eerste uur) staan
  in `docs/baseline/2026-09-16/vercel/`. **Speed Insights** verzamelde al sinds 2026-08-23 (metrics-query
  in `docs/baseline/2026-09-16/vercel/speed-insights-enabled.txt`).
- **Rapportagevenster** op het Hobby-plan: 1 maand voor Web Analytics. Wie een langere geschiedenis wil,
  exporteert periodiek (of upgradet). Cookieloos → geen consent-banner nodig (LEAD-06).
- **GA4** blijft bewust uit (zou consent + verwerkersvermelding in het privacybeleid vergen).

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

## 6. Indexatie controleren — `verify-indexation.ts`

Sinds Phase 8 staan alle 27 pagina's op `published` en in de sitemap. Er is een
script dat controleert of dat op de **live site** ook echt zo is — niet in de
data, maar in wat Google daadwerkelijk terugkrijgt.

**Draaien:**

```bash
npx tsx scripts/verify-indexation.ts https://www.tpsklimaattechniek.nl
```

Het script controleert vier dingen op elke URL uit de sitemap:

1. de sitemap bevat precies **27** URL's (het aantal dat `INDEXABLE_FLOOR` vastlegt);
2. elke URL geeft **direct een 200** terug — geen tussenliggende redirect;
3. geen enkele pagina stuurt een `noindex` mee;
4. de canonical van elke pagina wijst naar zichzelf.

**Wanneer draaien:** na elke productie-deploy die aan pagina's, statussen of SEO-code
raakt. Bij twijfel: gewoon draaien, het duurt een paar seconden.

**Wat een foutmelding betekent.** Het script noemt altijd de pagina én wat er mis is:

| Melding | Betekenis |
|---|---|
| `sitemap lists N URLs, expected exactly 27` | Er staat een pagina **minder** in de sitemap dan zou moeten — er is dus een pagina uit de index gevallen. **Zoek uit wélke pagina en waarom.** Verlaag het getal NIET om de melding weg te krijgen; dat is precies hoe de vorige fout maandenlang onopgemerkt bleef. Staat er juist een pagina méér in, dan is er iets in de index gekomen dat de build-gate niet kent. |
| `expected a direct 200, got 3xx` | Een URL in de sitemap wordt doorgestuurd in plaats van direct geserveerd. |
| `emits noindex in its own metadata` | Een pagina staat in de sitemap maar zegt tegen Google dat hij niet geïndexeerd mag worden — precies de tegenstrijdigheid die Phase 8 heeft opgelost. Meestal staat de `status` van die pagina niet (meer) op `published`. |
| `canonical points at …, not at itself` | De pagina verwijst als "origineel" naar een andere URL. |

> Op een Vercel *preview*-URL (`*.vercel.app`) zet Vercel zelf een
> `X-Robots-Tag: noindex` op álle pagina's. Dat is normaal — het script meldt dat het
> die header daar overslaat en controleert hem alleen op de productie-URL.

**Automatisch sinds Phase 9.** Dit script draait nu vanzelf na elke productie-deploy:
`.github/workflows/verify-indexation.yml` reageert op Vercel's `deployment_status` (Production,
success) en voert dezelfde vier controles uit tegen `https://www.tpsklimaattechniek.nl`. Een rode run
opent (of vult aan) één GitHub-issue met het label `indexation-alert`. Handmatig draaien blijft
mogelijk en nuttig bij twijfel.


## 7. Wekelijkse indexatiemeting (GitHub Actions)

Sinds Phase 9 (09-04/09-05) vraagt de repository elke **maandag 06:17 UTC** (08:17 zomertijd) aan Google
zelf wat het van elke sitemap-URL vindt: `.github/workflows/measure-indexation.yml` draait
`scripts/measure-indexation.ts` (URL-inspectie per URL + het sitemap-aantal), schrijft de meting als
`docs/measurements/gsc/<datum>.json` en commit die als `github-actions[bot]`. Slaat een drempel aan,
dan wordt de run rood en verschijnt één issue met het label `indexation-alert`.

- **Wat de meldingen betekenen en welke drempels gelden** (de ladder ≥10 / ≥20 / ≥25 geïndexeerd vanaf
  week 2 / 4 / 8 na 2026-09-16, verloren indexatie, robots niet ALLOWED, canonical-afwijking):
  `docs/measurements/README.md`. **Een drempel wordt nooit verlaagd om groen te krijgen** — zoek de
  pagina die vastzit.
- **Twee vragen, twee scripts.** `verify-indexation.ts` (§6) controleert wat wij serveren; de wekelijkse
  meting controleert wat Google concludeerde. Zijn ze het oneens, onderzoek dat als eerste.
- **60-dagenregel.** GitHub zet een geplande workflow op een publieke repository uit na 60 dagen zonder
  activiteit. De wekelijkse bot-commit voorkomt dat; blijft de meting toch uit: Actions →
  measure-indexation → *Enable workflow* (of `gh workflow run measure-indexation.yml`).
- **Sleutel roteren.** Het enige secret is `GSC_SERVICE_ACCOUNT_JSON`: nieuwe JSON-sleutel in de Google
  Cloud Console → `gh secret set GSC_SERVICE_ACCOUNT_JSON < bestand` → lokaal bestand vervangen → oude
  sleutel verwijderen (recept in `docs/measurements/README.md`).
- **Handmatig draaien / alarmpad testen:** `npm run measure` lokaal (sleutel via `.env.local`), of in
  GitHub Actions → *Run workflow*; met `simulate_breach=true` bewijs je het alarmpad zonder meting.

## 8. Webmail na de overstap — MIG-03

Bij de overstap wijzen `tpsventilatie.nl` en `www.tpsventilatie.nl` naar Vercel. Alles wat op
díe twee namen stond is daarna niet meer bereikbaar, en webmail stond erop. De vervangende
route is de servernaam van de hosting zelf:

```
https://s161.cyber-folks.pl/webmail/
```

**Waarom deze route niet kan breken.** `s161.cyber-folks.pl` is de eigen hostnaam van de
server bij cyberfolks. Er komt geen DNS-record van ons aan te pas, geen certificaat van ons,
en geen toegang die iemand anders moet verlenen. Daarom is "vóór de overstap geverifieerd"
hier geen belofte maar een feit: de route gaf **200** terug op 2026-09-22, en de overstap
verandert er niets aan.

**Twee eerlijke nadelen:**

1. Het is een URL die niemand onthoudt. Hij moet in je favorieten.
2. Hij verhuist mee als cyberfolks je ooit naar een andere server dan `s161` zet. Gebeurt dat,
   dan is de nieuwe servernaam op te vragen bij cyberfolks.

**Zet deze nu in je favorieten** — ná de overstap is hij lastiger terug te vinden dan ervoor.


## 9. WordPress-beheer na de overstap — MIG-04

De oude WordPress-site blijft gewoon draaien op `195.78.67.39`; we raken de installatie niet
aan. Alleen de wég ernaartoe verdwijnt, want `tpsventilatie.nl` wijst dan naar de nieuwe site.
Om er toch in te komen vertel je je eigen computer waar de oude server staat:

```
195.78.67.39  tpsventilatie.nl www.tpsventilatie.nl
```

**Waar die regel heen moet:**

- **macOS:** `sudo nano /etc/hosts`, regel onderaan plakken, opslaan met `ctrl+O` en `ctrl+X`.
- **Windows:** Kladblok *als administrator* openen →
  `C:\Windows\System32\drivers\etc\hosts` → regel onderaan plakken → opslaan.
- **Weghalen:** dezelfde regel verwijderen en opslaan. Doe dat zodra je WP-beheer niet meer
  nodig hebt, anders blijft je computer de oude server gebruiken terwijl de rest van de wereld
  de nieuwe site ziet.

**Wat je dan moet zien.** `https://tpsventilatie.nl/wp-login.php` geeft het échte
WordPress-inlogscherm ("Login ‹ TPS Ventilatie — WordPress"), niet onze nieuwe site.
Geverifieerd op 2026-09-22: **200**, met een geldig certificaat.

**Waarom zo, en niet met een nieuwe naam als `oud.tpsventilatie.nl`.** WordPress heeft
`siteurl = https://tpsventilatie.nl` hard in de database staan. Via een andere naam stuurt
WordPress je meteen terug naar de apex — en die is na de overstap onze 301. Die `siteurl`
aanpassen zou werken, maar dan is terugdraaien geen DNS-wijziging meer: je zou én twee
DNS-records terug moeten zetten én WordPress weer moeten ompunten. De hosts-regel laat de
installatie ongemoeid, en dáárom blijft terugdraaien één handeling.

> **Let op — het certificaat van de oude server.** Het Let's Encrypt-certificaat op die server
> heet `mail.tpsventilatie.nl` en dekt daarnaast `tpsventilatie.nl` en `www.tpsventilatie.nl`
> — precies de twee namen die wij verhuizen. Het verloopt op **2026-10-29** (gemeten
> 2026-09-22). Na de overstap kan die server zichzelf niet meer vernieuwen, want de
> validatie loopt over diezelfde namen. Vanaf die datum geeft deze beheerroute dus een
> certificaatwaarschuwing.
>
> Dat is **geen reden om terug te draaien** — het is een bekende datum, geen storing. Wil je
> na die datum nog bij WP-beheer, gebruik dan de servernaam uit §8-stijl
> (`s161.cyber-folks.pl`, certificaat geldig tot 2026-12-24) of draai de twee DNS-records
> tijdelijk terug; dan valideert de oude server weer en vernieuwt het certificaat vanzelf.
> Klik nooit "toch doorgaan" weg met een `-k` of `--insecure` in een script: een ontbrekend of
> ongeldig certificaat is juist één van de signalen waar we op letten.

---

### Samenvatting — wat hangt waarvan af
- **JSON-LD `geo` + GBP-pin + Phase-5 maps-embed** delen dezelfde geverifieerde coördinaat (§5).
- **Sitemap-inhoud groeit vanzelf** zodra Phase 4 service-pagina's op `published` zet — niets handmatig bijwerken.
- **`sameAs` (JSON-LD)** blijft leeg tot de eigenaar GBP/social-URLs aanlevert (§1).
- **Webmail hangt aan `s161.cyber-folks.pl`** — niet aan `tpsventilatie.nl`, en dus niet aan de overstap (§8).
- **WP-beheer hangt aan de hosts-regel** op je eigen computer; `siteurl` blijft bewust ongewijzigd, zodat terugdraaien één DNS-handeling blijft (§9).
- **Terugdraaien hangt aan TTL 300** tot dag 28 na de overstap *(wordt ingevuld door plan 10-07)*.
