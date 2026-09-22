# Baseline 2026-09-22 — bewijsmap van de migratie zelf (Phase 10)

> **Wat is dit?** De map waarin Phase 10 vastlegt wat er tijdens de omschakeling van
> `tpsventilatie.nl` naar `tpsklimaattechniek.nl` daadwerkelijk is gebeurd. Waar
> `docs/baseline/2026-09-16/` de staat **vóór** de migratie vastlegt (Phase 9, MEAS-04), legt deze map
> de migratie **zelf** vast: de contentspiegel van de oude site, de DNS-wijzigingen bij dd24, het
> mailbewijs, de uitkomst van de pre-flight-controle en de einddeclaratie op dag 28.
>
> **Geen wachtwoorden, tokens of sleutels in deze map.** Twee uitzonderingen die publiek-van-aard zijn en
> dus geen geheim: (1) de contentspiegel is een niet-geauthenticeerde crawl van publieke pagina's — HTML
> en afbeeldingen die iedere bezoeker ook krijgt, geen database en geen persoonsgegevens (D-28); (2) in
> het mailbewijs dat later volgt worden headers **niet** geredigeerd, behalve adressen van derden
> (D-23). Het enige e-mailadres in de spiegel is het publieke `info@tpsventilatie.nl`.

Directory aangemaakt: 2026-09-22 · eerste vastlegging: 2026-09-22T12:08:26Z · laatste aanvulling: zie manifest

---

## 1. Doel en datumregel (D-27, geërfd van 2026-09-16)

- Deze map staat in `docs/` en niet in `.planning/`, om dezelfde reden als haar voorganger: iemand moet
  hier tijdens een incident om 3 uur 's nachts kunnen kijken, en planning-mappen worden bij
  milestone-afsluiting gearchiveerd. De einddeclaratie (`migration-final.md`) landt daarom ook hier.
- **Datumregel.** De mapnaam is de datum van de **eerste** vastlegging in deze map: 2026-09-22, de dag
  waarop de contentspiegel is genomen. Artefacten die later bijkomen — de DNS-snapshots rond de
  omschakeling, de mailheaders, de uitvoer van de pre-flight-probe, de post-cutover-controle en de
  dag-28-declaratie — krijgen **hun eigen `taken:`-tijdstip** in het manifest hieronder en in het bestand
  zelf. De map wordt dus **niet** hernoemd als er later iets bijkomt, ook niet als de omschakeling op een
  andere datum valt dan 2026-09-22.
- **Het voor/na-paar.** `docs/baseline/2026-09-16/` is de "vóór"-kant van de meting; deze map is het
  verslag van de overgang. De hermeting bij milestone-afsluiting krijgt weer een **eigen** gedateerde map
  (recept: `../2026-09-16/README.md` §6).
- **Latere plannen zoeken deze map met een glob, nooit met een hardgecodeerde datum:**
  `ls -d docs/baseline/*/legacy-site-mirror | head -1 | xargs dirname`

## 2. Manifest

Eén rij per bestand. `taken` is UTC.

| bestand | wat bewijst het | taken (UTC) | bron | opnieuw maken |
|---|---|---|---|---|
| `legacy-site-mirror/` (94 bestanden, 2,2 MB) | De **inhoud** van `tpsventilatie.nl` zoals die werd geserveerd terwijl de oude site nog live op `195.78.67.39` stond (MIG-01 zoals gewijzigd door D-02/D-03): de 10 publieke URL's (root + 9 gemapte pagina's), hun Oxygen-CSS, plugin-assets en de mediabibliotheek-afbeeldingen inclusief `srcset`-varianten. Opent offline vanaf `index.html`; `robots.txt` is gerespecteerd, dus `/wp-admin/` zit er niet in | 2026-09-22T12:05:48Z – 2026-09-22T12:08:26Z | `wget` 1.25.0, commando in `legacy-site-mirror/CAPTURE.md` | **alleen zolang de oude site nog draait** — het commando in `CAPTURE.md` reproduceert de boom precies, maar **vanaf de A-record-omschakeling (plan 10-09) is dit niet meer opnieuw te maken**; het is dan het enige bewijs van de inhoud-vóór-de-omschakeling |
| `legacy-site-mirror/CAPTURE.md` | Het recept en de eerlijke afbakening: het letterlijke `wget`-commando met vlag-voor-vlag-motivering, de `wget`-versie, het UTC-tijdstip, de gemeten omvang, de vier verwachte 404's (themalettertypen die ook voor bezoekers 404'en), en waarom `--reject-regex '(wp-json\|xmlrpc)'` is toegevoegd. Plus wat de spiegel **niet** is: geen installatie, geen database, kan geen site herstellen | 2026-09-22T12:08:26Z | met de hand, tijdens plan 10-02 | n.v.t. (verslagdocument — het beschrijft de vastlegging hierboven) |

## 3. Wat hier nog bij komt

Deze map is bewust nog niet af. De volgende plannen van Phase 10 vullen hem aan, elk met een eigen rij
in het manifest hierboven en een eigen `taken:`:

| plan | artefact | wat het gaat bewijzen |
|---|---|---|
| 10-04 | `owner/` | De twee routes die bij de omschakeling ophouden te bestaan — webmail en WP-admin — gedocumenteerd en **vóór** de omschakeling werkend bevonden (MIG-03, MIG-04) |
| 10-07 | `dns/vercel-target-records.md`, `preflight/` | De doelwaarden voor dd24, en de uitkomst van de pre-flight-controle: de volledige map, beide legacy-hostnames, groen — terwijl de oude site nog serveert (D-08, D-09) |
| 10-08 | `dns/` | De TTL-verlaging naar 300 s en de SPF-opruiming bij dd24, met snapshots vóór en na (D-04, D-05; MIG-02) |
| 10-09 | `dns/`, `mail/`, `cutover/` | De omschakeling zelf: de drie dd24-nameservers die het eens zijn, het certificaat van Vercel, en de mailronde heen-en-weer (D-07; MIG-07, MIG-08) |
| 10-10 | `gsc/`, `migration-final.md` | De Change of Address per geverifieerde legacy-variant, en de einddeclaratie op dag 28 (D-24; MIG-09, MIG-10) |

## 4. Regels die hier blijven gelden

- **Het `google-site-verification` TXT-record op `tpsventilatie.nl` wordt nooit verwijderd** (D-07 uit
  Phase 9, en D-06 in deze fase). De Change of Address van plan 10-10 draait vanuit die property, Google
  eist minimaal 180 dagen redirects, en Google hercontroleert de verificatie periodiek: verdwijnt het
  record, dan verliest de property stilletjes haar verificatie. Hetzelfde geldt voor het record op
  `tpsklimaattechniek.nl`.
- **De WordPress-installatie wordt niet aangeraakt.** Dat — plus het cyberfolks-abonnement dat in leven
  blijft voor `info@tpsventilatie.nl` — is wat de omschakeling omkeerbaar houdt; niet de spiegel in deze
  map (D-02). De rollback is en blijft het terugzetten van twee A-records.
- **De spiegel wordt niet bijgewerkt.** Net als alles in `2026-09-16/` is dit bewijs van "zo was het".
  Een nieuwe vastlegging hoort in een nieuwe gedateerde map.
