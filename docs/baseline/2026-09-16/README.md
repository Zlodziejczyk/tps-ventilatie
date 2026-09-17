# Baseline 2026-09-16 — nulmeting vóór de migratie (Phase 9, MEAS-04)

> **Wat is dit?** De vastgelegde staat van DNS, Google Search Console, Google Business Profile,
> Vercel Analytics en de zoekresultaten **vóórdat Phase 10 het oude domein `tpsventilatie.nl`
> doorstuurt naar `tpsklimaattechniek.nl`**. Alles wat hier staat is bewijs van "zo was het"; het
> wordt nooit bijgewerkt, alleen aangevuld met een eigen `taken:`-tijdstip per bestand.
>
> **Geen wachtwoorden, tokens of sleutels in deze map.** De `google-site-verification`-tokens die in de
> DNS-snapshots staan zijn publiek (ze staan in DNS voor iedereen leesbaar) en zijn geen geheim.

Directory aangemaakt: 2026-09-16 · eerste vastlegging: 2026-09-16T17:58Z · laatste aanvulling: zie manifest

---

## 1. Doel en datumregel (D-12, D-17, D-27)

- Deze map is **het** artefact waar succescriterium 3 van Phase 9 naar wijst ("baseline artefact
  committed: GSC export, ranking snapshot, GBP state, full DNS zone snapshot"). Hij staat in `docs/`
  (naast `seo-owner-runbook.md`) en niet in `.planning/`, omdat iemand tijdens een incident om 3 uur
  's nachts hier moet kunnen kijken — planning-mappen worden bij milestone-afsluiting gearchiveerd.
- **D-27 — datumregel.** De mapnaam is de datum waarop de pre-migratiestaat **voor het eerst** is
  vastgelegd: 2026-09-16 (beide DNS-zones gesnapshot, beide Domain-properties in GSC geverifieerd,
  sitemap verwerkt op 27 URL's). Artefacten die later zijn vastgelegd (GSC-exports, GBP-transcriptie,
  SERP-nulmeting, Vercel-bewijs) dragen hun eigen `taken:`-tijdstip in het manifest hieronder en in het
  bestand zelf. De map wordt dus **niet** hernoemd als er later iets bijkomt.
- **De hermeting bij milestone-afsluiting** (de "na"-kant van dezelfde meting) krijgt een **eigen**
  gedateerde map (`docs/baseline/<datum>/`), zodat er een voor/na-paar ontstaat. Het recept daarvoor
  staat in §6 (wordt door plan 09-06 ingevuld).

## 2. Manifest

Eén rij per bestand. `taken` is UTC. Een rij met ⏳ wacht op een tijdvenster en wordt door 09-06 ingevuld zodra dat venster open is.

| bestand | wat bewijst het | taken (UTC) | bron | opnieuw maken |
|---|---|---|---|---|
| `dns/tpsventilatie.nl-pre-switch-2026-09-16T175840Z.txt` | De volledige legacy-zone zoals **cyberfolks** (`ns1.cyberfolks.pl`) hem serveerde **vóór** de nameserver-wissel (D-26): SOA-serial `2024020301`, NS `ns1/ns2.opeiron.com`, A `195.78.67.39` (WordPress), MX, SPF met `a`, DMARC `p=none`, DKIM-selector `x`, autoconfig/autodiscover | 2026-09-16T17:58:40Z | `dig @ns1.cyberfolks.pl`, met de hand (sessie 29fcd5a0) | **niet** opnieuw te maken — cyberfolks is niet meer autoritatief; dit is het enige bewijs van de zone-vóór-de-wissel |
| `dns/tpsklimaattechniek.nl-2026-09-16T175843Z.txt` | De nieuwe zone bij dd24 op het moment van de eerste vastlegging: GSC-TXT `eXe-fYdK…` (D-05 #1), Titan MX/SPF/DKIM (`titan1`), `www` CNAME naar Vercel, apex A `216.198.79.1` | 2026-09-16T17:58:43Z | `dig @ns1.domaindiscount24.net`, met de hand | `bash scripts/snapshot-dns.sh tpsklimaattechniek.nl --out docs/baseline/<datum>/dns` |
| `dns/dd24-records-to-enter.md` | Het 12-records spiegelplan (D-26): welke records met de hand bij dd24 zijn ingevoerd om de cyberfolks-zone record-voor-record na te bouwen | 2026-09-16T17:58Z | afgeleid uit de pre-switch snapshot | n.v.t. (beslissingsdocument) |
| `dns/dd24-mirror-verification.txt` | **33/33 PASS**: elke (naam, type) vergeleken tussen `@ns1.cyberfolks.pl` en `@ns1/ns2/ns3.domaindiscount24.net` **vóór** de wissel; DKIM byte-identiek; apex-TXT bij dd24 bevat GSC-token + SPF | 2026-09-16T18:31:00Z | `dig`-vergelijking, met de hand | n.v.t. (eenmalig bewijs; cyberfolks-kant niet meer bevraagbaar als autoritatief) |
| `dns/dd24-zone-table.jpg` | Screenshot van de dd24 zone-tabel voor `tpsventilatie.nl` na invoer (herkomstbewijs bij het spiegelplan) | 2026-09-16 ±19:20Z | dd24-panel (Chrome) | dd24 → DNS → zone-tabel |
| `dns/tpsventilatie.nl-2026-09-16T203208Z.txt` | De legacy-zone **na** de wissel, bevraagd bij dd24: delegatie `ns1/2/3.domaindiscount24.net` (D-26), A-records nog steeds `195.78.67.39` (WordPress draait — D-06), GSC-TXT `DvCnCNBb…` aanwezig (D-05 #2, D-07), SPF nog mét `a` (Phase 10 MIG-02 ruimt dat op — hier ongewijzigd) | 2026-09-16T20:32:08Z | `scripts/snapshot-dns.sh` | `bash scripts/snapshot-dns.sh tpsventilatie.nl --out docs/baseline/<datum>/dns` |
| `dns/tpsklimaattechniek.nl-2026-09-16T203209Z.txt` | De nieuwe zone via het script — record-set identiek aan de vastlegging van 17:58Z (gecontroleerd met `diff` bij 09-01) | 2026-09-16T20:32:09Z | `scripts/snapshot-dns.sh` | idem |
| `gsc/sitemap-success-27.jpg` | GSC → Sitemaps voor `sc-domain:tpsklimaattechniek.nl`: **Success, 27 ontdekte URL's** (D-10) | 2026-09-16 ±17:38Z | Search Console (Chrome) | GSC → Sitemaps; de machinevorm is `gsc/sitemap-tpsklimaattechniek.nl.json` (09-02) |
| `gsc/legacy-domain-property-verified.jpg` | GSC → Instellingen → Eigendomsverificatie voor `sc-domain:tpsventilatie.nl`: **"Ownership auto verified"** via DNS-TXT bij dd24 (D-05 #2, D-06) | 2026-09-16 ±19:40Z | Search Console (Chrome) | GSC → Settings → Ownership verification |
| `gbp/gbp-state.md` | Google Business Profile als diffbare tekst (D-15): naam, primaire + secundaire categorieën (incl. een niet-goedgekeurde openstaande wijziging), website-URL, servicegebied (3 provincies), **38 reviews / 4,9**, telefoon, adres, openingstijden, beschrijving — plus 9 afwijkingen t.o.v. `SITE` voor Phase 11 | 2026-09-16T20:39Z | Business Profile Manager + bewerkscherm + kennispaneel (Chrome, alleen gelezen) | Chrome → `business.google.com` → profiel → *Edit profile* → velden overnemen; kennispaneel: zoek de bedrijfsnaam |
| `gbp/gbp-profile-manager-locations-2026-09-16T203932Z.jpg` | Business Profile Manager → Businesses: de TPS-vermelding, Verified, 2 openstaande Google updates | 2026-09-16T20:39:32Z | Chrome (business.google.com) | idem |
| `gbp/gbp-profile-manager-reviews-2026-09-16T203944Z.jpg` | Business Profile Manager → Reviews: de meest recente Google-reviews | 2026-09-16T20:39:44Z | Chrome (business.google.com) | idem |
| `gsc/serp-queries.json` | De 24 shortlist-queries voor de SERP-nulmeting (D-13): 22 `primaryKeyword`s uit `lib/services/registry.ts` (alleen indexeerbare hub/pillar/service-nodes) + 2 merknamen — **afgeleid, nooit overgetypt** | 2026-09-17T08:24:03Z | `scripts/export-gsc-performance.ts` | `npx tsx scripts/export-gsc-performance.ts --out docs/baseline/<datum>/gsc` |
| `gsc/sitemap-tpsklimaattechniek.nl.json` | Machinebewijs van D-10: Google's eigen `contents[web].submitted === 27`, `errors === 0`, `warnings 0`, laatst gedownload 2026-09-16T17:30:55Z | 2026-09-17T08:24:03Z | Search Console API `sitemaps.get` (service account, D-18) | idem |
| `gsc/sitemaps-tpsventilatie.nl.json` | Legacy-domein: **geen** ingediende sitemap (lege lijst, D-09) — er wordt er nooit één ingediend | 2026-09-17T08:24:03Z | Search Console API `sitemaps.list` | idem |
| `gsc/performance-tpsklimaattechniek.nl-by-{query,page}.{json,csv}` | Search-Analytics-export nieuw domein, 2026-08-12 → 2026-09-16 (D-16): **0 rijen** op dag één na verificatie — een tijdstip-uitspraak, geen bug (RESEARCH Pitfall 9); wordt in 09-06 opnieuw getrokken | 2026-09-17T08:24:03Z | Search Console API `searchAnalytics.query` (`dataState: final`) | idem |
| `gsc/performance-tpsventilatie.nl-by-{query,page}.{json,csv}` | Search-Analytics-export legacy-domein, 16 maanden → 2026-09-16: **0 rijen** — de Domain-property is pas op 2026-09-16 geverifieerd, de historie verschijnt met vertraging; 09-06 trekt opnieuw | 2026-09-17T08:24:03Z | idem | idem |
| `gsc/shortlist-tpsklimaattechniek.nl.json`, `gsc/shortlist-tpsventilatie.nl.json` | Per shortlist-query de Search-Analytics-rijen (land `nld`, dimensie `page`) met `zero: true/false` — op dag één **24/24 nullen** voor beide domeinen; de eerlijke nullen zijn het punt (D-13) | 2026-09-17T08:24:03Z | idem | idem |
| `gsc/legacy-url-prefix-status.md` | Status van de twee legacy URL-prefix-properties `https://tpsventilatie.nl/` en `https://www.tpsventilatie.nl/`: beide **verified (inherited)** via de Domain-property; venster D-06 was open (apex 200, TXT aanwezig); niets verwijderd (D-07) | 2026-09-16T21:29:38Z | Search Console (Chrome, D-01) | GSC → property toevoegen → URL-prefix; status: Settings → Ownership verification |
| `gsc/users-and-permissions.md` | Wie is Owner/Full op welke van de vijf properties: Oskar (verified Owner), Thomas `tpsventilatie@gmail.com` (delegated Owner ×5, D-02), service account `gsc-measure@…` (Full op beide Domain-properties, D-18) | 2026-09-16T21:29:38Z | Search Console (Chrome) | GSC → Settings → Users and permissions per property |
| `gsc/users-tpsklimaattechniek.nl-2026-09-16T211723Z.jpg`, `gsc/users-tpsventilatie.nl-2026-09-16T211859Z.jpg`, `gsc/users-www.tpsventilatie.nl-2026-09-16T212913Z.jpg` | Herkomstscreenshots van de gebruikerslijsten (Domain-properties + www-legacy) | 2026-09-16T21:17Z – 21:29Z | Chrome | idem |
| `gsc/url-inspection-diensten.png` | D-11-bewijs: URL-inspectie van `/diensten` — **"URL is on Google"**, geïndexeerd, HTTPS, breadcrumbs + review snippets geldig | 2026-09-16T21:28:39Z | Search Console → bovenste balk "Inspect any URL" (Chrome) | GSC → URL inspection |
| `gsc/ownership-verification-www-tpsklimaattechniek.png` | Vijfde property `https://www.tpsklimaattechniek.nl/` (D-08): **HTML tag — Successfully verified** naast Domain name provider, nadat productie exact één `google-site-verification`-meta serveerde (env `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, build van `main` @ 56d239c) | 2026-09-16T22:30:08Z | Search Console (Chrome) | GSC → Settings → Ownership verification → HTML tag → Verify |
| `vercel/web-analytics-enabled.json` | Project-API-uittreksel: `webAnalytics.enabledAt` 2026-09-16T22:18:46Z (ingeschakeld door de eigenaar via `vercel project web-analytics enable`), Speed Insights `dataReceivedAt` 2026-08-23, productie-deployment 2026-09-16T22:24:48Z **ná** het inschakelen (D-24) — vervangt de geplande dashboard-screenshot (eigenaar koos de CLI-route) | 2026-09-16T22:50:05Z | `vercel api /v9/projects/{id}` (CLI 59.19.1) | `npx vercel@latest api "/v9/projects/prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q?teamId=team_YrD4rsBlATPg7g02y1QThOhg"` |
| `vercel/speed-insights-enabled.txt` | Speed Insights rapporteert: p75-LCP-query over 7 dagen levert echte productie-samples (avg 1,18 s) — was al aan sinds 2026-08-23 | 2026-09-16T22:50:05Z | `vercel metrics vercel.speed_insights.lcp_ms` (CLI 59.19.1) | `npx vercel@latest metrics vercel.speed_insights.lcp_ms --aggregation p75 --since 7d --prod` |
| `vercel/insights-view-request.md` | Browser-beacon-bewijs (MEAS-06): `POST /2fd128cc8fe7c492/view` → 200 op twee pagina's (het project-unieke pad; niet `/_vercel/insights/view`), REST-telling `visitors 2 / pageviews 5` op 2026-09-16/17, MCP-404 en de Speed-Insights-`vitals`-503 als waargenomen genoteerd | 2026-09-16T22:5xZ (zie `taken:` in het bestand) | Chrome `read_network_requests` + `vercel api /v1/query/web-analytics/visits/count` | pagina laden in Chrome, netwerkverzoeken filteren op het script-pad; telling via de REST-call in het bestand |
| `serp/serp-baseline.md` | Geolokaliseerde SERP-nulmeting (D-13): 24 queries × 2 domeinen, positie in de top 20 of `niet in top 20`, local-pack-kolom; **17/24 vastgelegd op 2026-09-17** (Google gaf daarna een 403 — de resterende 7 rijen staan expliciet als `niet vastgelegd` en worden aangevuld) | 2026-09-17T09:00Z–10:58Z (zie `taken:` in het bestand) | Chrome (google.nl, `pws=0`, `uule` Zoetermeer) | de methode-sectie in het bestand: zelfde URL-template, zelfde `uule`, footer-controle, p.1 + p.2 |
| `serp/serp-example-footer.png` | Footer-controle van de eerste SERP: **"Zoetermeer - Op basis van je IP-adres"** — de uule-locatie is actief | 2026-09-17T09:00:09Z | Chrome | eerste query laden, naar de voet scrollen, screenshot |
| `vercel/analytics-after-24h.md` | Web Analytics rapporteert ≥ 24 uur na inschakelen (MEAS-06): positieve bezoekers-/paginaweergaven-telling via de REST-count + rapportagevenster | ⏳ na 2026-09-17T22:18Z (24 h na `enabledAt`) | `vercel api /v1/query/web-analytics/visits/count` | idem |

**Diff-hint bij de DNS-bestanden.** Wie de pre-switch snapshot vergelijkt met de post-switch snapshot
ziet drie soorten ruis die géén inhoudelijk verschil zijn: (1) TTL 14400 → 28800 en een nieuw
SOA-record (dd24 beheert de zone nu); (2) de DKIM-TXT van `x._domainkey` wordt door dd24 op een andere
plek in 255-byte-stukken geknipt dan cyberfolks deed — de aaneengeplakte waarde is byte-identiek
(zie `dd24-mirror-verification.txt`); (3) de regels `autodiscover.s161.cyberfolks.pl. … A/TXT` in de
pre-switch snapshot waren extra records uit de *andere* zone die cyberfolks meestuurde, geen records van
`tpsventilatie.nl`. Alles daarbuiten in een diff is een echte wijziging en dus een bevinding.

## 3. Beslissingen genomen tijdens de uitvoering

### D-26 — Nameservers van `tpsventilatie.nl` verplaatst van cyberfolks naar dd24 (2026-09-16)

**Wat er is gebeurd.** De GSC Domain-property voor `tpsventilatie.nl` kan alleen worden geverifieerd met
een TXT-record in de **autoritatieve** zone. Die zone stond bij cyberfolks.pl (hosting van de oude
WordPress-site, nameservers `ns1/ns2.opeiron.com`); niemand aan onze kant heeft die login, en Tomasz was
niet bereikbaar. De oorspronkelijke aanname (D-03: "de gebruiker plakt het TXT-record in het paneel van
de legacy-registrar") ging er ten onrechte van uit dat de registrar (dd24) ook de zone beheerde.

**De keuze (expliciet akkoord van Oskar, tweemaal).** De cyberfolks-zone is opgesomd (AXFR geweigerd;
~40 namen plus wildcard geprobeerd; statisch sinds SOA-serial `2024020301`), **record-voor-record
gespiegeld bij dd24** — 6×A (`@`, `www`, `mail`, `ftp`, `smtp`, `pop` → `195.78.67.39`), MX 10 `mail`,
SPF, DMARC `p=none`, DKIM `x._domainkey` (410 tekens, byte-identiek), `autoconfig` CNAME en
`_autodiscover._tcp` SRV naar `autodiscover.s161.cyberfolks.pl` — met **33/33 vergelijkingen PASS** vóór
de wissel (`dns/dd24-mirror-verification.txt`), DNSSEC uit, en daarna de nameservers bij dd24 op
**Standaardnameserver = `ns1/ns2/ns3.domaindiscount24.net`** gezet. Hosting en mail zijn **niet**
verplaatst en draaien nog bij cyberfolks (server s161). SIDN publiceerde de nieuwe delegatie ±19:35Z;
de property verifieerde ±19:40Z.

**Rollback** (als mail of site zich vreemd gedraagt en de oorzaak in DNS zit): dd24 → domein
`tpsventilatie.nl` → tabblad *Whois/Nameserver* → type **"Externe nameserver"** →
`ns1.cyberfolks.pl`, `ns2.cyberfolks.pl`, `ns3.cyberfolks.pl` → opslaan. cyberfolks houdt zijn zone
gewoon aan, dus de oude staat komt terug zonder verdere handelingen. Doorlooptijd: registry-TTL ±1 uur
(3600 s); resolvers kunnen de oude NS-set tot 14400 s vasthouden.

**Restrisico.** Alleen DKIM-selector `x` was vindbaar. Signeert cyberfolks uitgaande mail met een andere
selector, dan faalt DKIM zacht (DMARC staat op `p=none`, dus mail wordt niet geweigerd). Controle: open een
echte mail van `info@tpsventilatie.nl`, kijk in de header naar `DKIM-Signature: … s=<selector>`; is dat
niet `x`, voeg die selector toe bij dd24 (waarde opvragen bij cyberfolks).

**Gevolg voor Phase 10.** De A-record-repoint van `@`/`www` en het weghalen van het `a`-mechanisme uit de
SPF (MIG-02) gebeuren nu **bij dd24** — geen cyberfolks-toegang nodig. De WordPress-backup en wp-admin
(MIG-03/04) hebben nog wél cyberfolks- of WP-admin-inloggegevens nodig. Gezien: `tps-ventilatie.nl`
(met koppelteken) is een los, dood domein bij dd24 (NS lh.pl); onschadelijk.

**Vervangt:** D-03 (TXT door de gebruiker bij de legacy-registrar plakken) en de regel "Moving legacy DNS
nameservers" in de Out-of-Scope-tabel van `.planning/REQUIREMENTS.md` (die regel wordt in 09-06
bijgewerkt). **Deze fase wijzigt verder niets in DNS** — alle scripts in deze map lezen alleen.

### D-27 — Deze map heet `2026-09-16`

Zie §1: de datum is de eerste vastlegging van de pre-migratiestaat, niet de datum van het
context-gesprek (2026-08-24, D-12). Latere artefacten dragen een eigen `taken:`.

### D-03 — vervangen

D-03 (de gebruiker plaatst met de hand een TXT-record bij **beide** registrars) is voor het legacy-domein
**vervangen door D-26**; voor het nieuwe domein is het TXT-record wél gewoon bij dd24 geplaatst
(`eXe-fYdK…`, zie de snapshot).

## 4. Regels die blijven gelden

- **D-06 — de legacy-verificatie is afgerond vóórdat Phase 10 iets verplaatst.** `sc-domain:tpsventilatie.nl`
  is geverifieerd terwijl `tpsventilatie.nl` nog `195.78.67.39` (WordPress, HTTP 200) serveert. Dat is de
  reden dat Phase 9 vóór Phase 10 staat; het is geen voorkeur maar een harde volgorde.
- **D-07 — verwijder het `google-site-verification` TXT-record op `tpsventilatie.nl` nooit**, ook niet na
  de migratie en ook niet "om op te ruimen". De Change of Address (Phase 10) draait vanuit deze property,
  Google eist minimaal 180 dagen redirects, en Google controleert de verificatie periodiek: verdwijnt het
  record, dan verliest de property stilletjes haar verificatie. **Hetzelfde geldt voor het TXT-record op
  `tpsklimaattechniek.nl`.** `scripts/verify-measurement.ts` (09-03) controleert bij elke run dat beide
  records nog bestaan — een ontbrekend record is daar een fout, geen opschoning.
- **Alles in deze fase leest DNS alleen** (`dig`, `resolveTxt`). De enige geplande DNS-wijziging op dit
  project is Phase 10's MIG-02.

## 5. Wat de GSC-screenshots bewijzen (MEAS-03)

- `gsc/sitemap-success-27.jpg` — de sitemap `https://www.tpsklimaattechniek.nl/sitemap.xml` is ingediend
  in `sc-domain:tpsklimaattechniek.nl` en door Google verwerkt met **27 ontdekte URL's** (D-10). 27 is
  precies `INDEXABLE_FLOOR` uit `lib/seo/invariants.ts` — hetzelfde getal dat de build-gate en
  `scripts/verify-indexation.ts` afdwingen. Wijkt Google's aantal ooit af van 27, dan is dat een bevinding,
  geen afrondingsverschil. De machinevorm van dit bewijs (`sitemaps.get` → `contents[].submitted`) staat in
  `gsc/sitemap-tpsklimaattechniek.nl.json` (09-02).
- `gsc/legacy-domain-property-verified.jpg` — `sc-domain:tpsventilatie.nl` "Ownership auto verified" via
  de DNS-methode (D-05 #2, D-06).
- Op 2026-09-16 is bovendien voor precies vijf URL's **"Indexering aanvragen"** gedaan (D-11): `/diensten`
  en de vier pijlers `/diensten/airconditioning`, `/diensten/warmtepompen`, `/diensten/wtw`,
  `/diensten/mechanische-ventilatie`. Alle vijf meldden al "URL is on Google" met geldige Breadcrumb- en
  Review-snippet-rich-results. Het URL-inspectie-bewijs (`gsc/url-inspection-diensten.png`) landt in 09-03.
- Er is **geen** sitemap ingediend voor het legacy-domein (D-09): `https://tpsventilatie.nl/wp-sitemap.xml`
  geeft 404; de legacy-properties bestaan voor de performance-export en de Change of Address.

## 6. Opnieuw vastleggen bij milestone-afsluiting

Herhaal bij milestone-afsluiting in een **nieuwe** datummap `docs/baseline/<datum>/` (D-12, D-27) — nooit in deze map:

1. **DNS** — `bash scripts/snapshot-dns.sh tpsklimaattechniek.nl tpsventilatie.nl --out docs/baseline/<datum>/dns` (alleen lezen; diff tegen de bestanden hier). Controleer dat beide `google-site-verification`-TXT-records nog bestaan (D-07).
2. **Search Console** — `npx tsx scripts/export-gsc-performance.ts --out docs/baseline/<datum>/gsc` (of `npm run baseline:gsc -- --out …`); vereist de service-accountsleutel via `.env.local`. Verwacht: sitemap `submitted === 27` (of het dan geldende `INDEXABLE_FLOOR`), `errors === 0`, en nu wél Search-Analytics-rijen.
3. **SERP** — exact de methode uit `serp/serp-baseline.md`: zelfde URL-template, zelfde `uule` (letterlijke `+`), `gl=nl&hl=nl&pws=0`, footer-controle "Zoetermeer", p.1 + p.2 (Google negeert `num=20`), 10–20 s tussen pagina's; queries uit `gsc/serp-queries.json` van de nieuwe export. Vergelijk rij voor rij met deze tabel.
4. **Google Business Profile** — Business Profile Manager → profiel → *Edit profile* → velden overnemen in `gbp/gbp-state.md` (zelfde labels als D-15), plus een screenshot van het kennispaneel op google.nl.
5. **Vercel** — `npm run verify:measurement -- https://www.tpsklimaattechniek.nl` groen; analytics-telling via `vercel api /v1/query/web-analytics/visits/count` in `vercel/analytics-<datum>.md`.
6. **Indexatie** — de wekelijkse metingen in `docs/measurements/gsc/` zijn het tijdreeksbewijs; `npm run measure` levert een extra dagmeting.

D-25 gates: (a) DNS vastgelegd vóór en na de wissel ✅ (09-01), (b) GSC machinebewijs 27/0 + eigenaarschap gedelegeerd ✅ (09-02/09-03), (c) wekelijkse meting + post-deploy-probe geautomatiseerd en bewezen ✅ (09-04/09-05), (d) SERP-nulmeting + analytics-na-24h — **lopend** (09-06: 17/24 SERP-rijen vastgelegd; analytics-venster opent 2026-09-17T22:18Z). Phase 10 is ontgrendeld zodra (d) is afgerond en de completeness-gate groen is.
