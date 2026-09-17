# Google Business Profile — staat op 2026-09-16 (D-15, alleen gelezen)

taken: 2026-09-16T20:39Z
bron: Business Profile Manager (`business.google.com`, Oskar = beheerder, Thomas = eigenaar) · het
profiel-bewerkscherm in Google Zoeken (`www.google.com/local/business/7574263772122699263/editprofile/info`,
geopend en **alleen gelezen** — niets ingevuld, niets opgeslagen) · het publieke kennispaneel bij de
zoekopdracht "TPS ventilatie , airco's en warmtepompen" (ingelogd, `hl=en`).
identificatie: GBP-locatie-id `7574263772122699263` · Maps `ludocid` `5138944915883887365` ·
Knowledge-Graph `kgmid` `/g/11h07d_z1t` (dezelfde als `REVIEW_RATING.url` in `lib/reviews.ts`).

> **Er is niets gewijzigd.** Phase 11 (GBP & citations) doet de bewerkingen — waaronder de naamswijziging
> die de 38 reviews en de 4,9 in gevaar brengt. Dit bestand legt vast wat er stond, als diffbare tekst.

## Velden (D-15)

| Veld | Waarde in GBP op 2026-09-16 |
|---|---|
| Naam | `TPS ventilatie , airco's en warmtepompen` (inclusief de spatie vóór de komma) |
| Primaire categorie | `Installation service` (Engelse UI; Nederlands label: *Installatiebedrijf*) |
| Secundaire categorieën | `Chimney services` · `Air conditioning contractor` — **plus een niet-goedgekeurde, onverwerkte wijziging** (banner "Something went wrong and your edit wasn't published") die daar `Air conditioning repair shop` aan zou toevoegen; de sectie toont CURRENT (3 categorieën) naast NOT APPROVED (4 categorieën) |
| Website-URL | `http://tpsventilatie.nl/` (oud domein, http) |
| Servicegebied | `Zuid-Holland, Nederland` · `Noord-Brabant, Nederland` · `Noord-Holland, Nederland` (drie provincies; geen plaatsen) |
| Aantal reviews | **38** (Google); het kennispaneel toont daarnaast Werkspot: 66 reviews |
| Beoordeling | **4,9** (Google); Werkspot 4,7 |
| Telefoon | `079 204 6078` (= +31 79 204 6078, vast nummer); chat-knop: WhatsApp `https://wa.me/31629403450` ("Your messaging options were updated by Google") |
| Adres | Industrieweg 6 B, 2712 LB Zoetermeer, Nederland (provincie Zuid-Holland) — Maps-pin gekoppeld |
| Openingstijden | ma–za 07:00–20:00, zondag gesloten (kennispaneel op 2026-09-16 ±20:35Z: "Closed · Opens 7 am Thu"); geen speciale uren |
| Openingsdatum | 1 april 2009 |
| Sociale profielen | geen |
| Kenmerken | Toegankelijkheid: "Has wheelchair-accessible car park" (door Google bijgewerkt); verder niets ingevuld |
| Status / gezondheid | Verified; profielsterkte "Looks good!"; 585 klantinteracties; "1768 monthly views"; "2 new reviews"; "August performance report is ready"; in de Manager staan **2 "Google updates"** (door Google voorgestelde wijzigingen) open — het potlood-icoon draagt een rode stip |

**Beschrijving (letterlijk):**

> TPS is gespecialiseerd in installatie en onderhoud van ventilatie en airconditioning. Met meer dan 10 jaar
> ervaring doen we alles aan om uw woning te voorzien van een duurzaam gezond en comfortabel binnenklimaat.
> U kunt bij TPS terecht voor :
> - installatie en onderhoud van airco's en warmte pompen
> - installatie en onderhoud van WTW ventilatie
> - installatie en onderhoud van mechanische ventilatie systemen
> - vervangen ventilatie systemen
> - aanleg van luchtkanalen
> - reiniging van luchtkanalen
> Bel ons voor meer informatie 0629403450

## Afwijkingen t.o.v. SITE (`lib/constants.ts`) — bevindingen voor Phase 11

1. **Naam** `TPS ventilatie , airco's en warmtepompen` ≠ `SITE.name` = `TPS klimaattechniek`. De naamswijziging
   is de Phase-11-stap met het hoogste risico (moet als laatste en alleen, zie STATE-volgorde).
2. **Website** `http://tpsventilatie.nl/` ≠ `CANONICAL_ORIGIN` = `https://www.tpsklimaattechniek.nl`.
3. **Telefoon** `079 204 6078` ≠ `SITE.phone` = `+31 6 29403450`. Het vaste nummer staat nergens op de site;
   het 06-nummer staat alleen in de GBP-beschrijving en als WhatsApp-chat. NAP-inconsistentie (runbook §1).
4. **Servicegebied**: drie provincies (incl. Noord-Brabant en Noord-Holland) ≠ `SITE.serviceAreas` (8 plaatsen:
   Zoetermeer, Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Lansingerland, Delft, Gouda, Leiden) en de
   60 km-straal van `SITE.serviceRadiusKm`. GBP claimt ruimer dan de site — eigenaar moet kiezen (A-2: nooit
   een gebied claimen dat niet bediend wordt).
5. **Openingstijden** 07:00–20:00 ≠ `SITE.openingHours` 08:00–17:30 (beide ma–za, zondag gesloten). Dezelfde
   uren voeden de JSON-LD `OpeningHoursSpecification` en de contactpagina.
6. **Categorieën**: primair `Installation service` ≠ runbook-aanbeveling `Airconditioningsbedrijf`;
   `Chimney services` past niet bij het aanbod; de aanbevolen `Verwarmingsinstallateur` / `Ventilatiebedrijf` /
   `HVAC-aannemer` ontbreken; en er staat een **niet-goedgekeurde categorie-wijziging** open die eerst
   afgehandeld moet worden (opnieuw indienen of intrekken) vóór iets anders wordt bewerkt.
7. **Reviewaantal** 38 ≠ `REVIEW_RATING.count` = 34 in `lib/reviews.ts` — de `aggregateRating` in de JSON-LD
   van de site loopt vier reviews achter (de 4,9 klopt nog). Bijwerken hoort bij Phase 11/12, niet hier.
8. **Sociale profielen** leeg in GBP én `sameAs` leeg in de JSON-LD — consistent, maar allebei nog te vullen
   zodra de eigenaar Facebook/Instagram-URL's aanlevert (deferred item).
9. **2 openstaande "Google updates"** in de Manager: Phase 11 bekijkt en accepteert/verwerpt ze **vóór** de
   naamswijziging, zodat Google's eigen suggesties niet tegelijk met onze bewerking landen.

## Herkomst

| bestand | wat |
|---|---|
| `gbp-profile-manager-locations-2026-09-16T203932Z.jpg` | Business Profile Manager → Businesses: de TPS-vermelding (naam, adres, status Verified, "Google updates (2)"-filter, potlood met rode stip) |
| `gbp-profile-manager-reviews-2026-09-16T203944Z.jpg` | Business Profile Manager → Reviews: de meest recente Google-reviews (5 sterren, "2 days ago" t/m "34 weeks ago") |

Het kennispaneel en het bewerkscherm draaien op `www.google.com`; de Chrome-extensie mag daar in deze sessie
geen screenshot maken (site-permissie niet verleend), maar kon de paginatekst wél lezen. Alle waarden in de
tabel hierboven zijn daarom **letterlijk uit de paginatekst overgenomen** (`#rhs`-kennispaneel en de
`editprofile/info`-iframe, 2026-09-16 ±20:35Z), niet uit het geheugen. Een screenshot van het publieke
kennispaneel is in 09-06 toegevoegd, nadat `www.google.nl` voor de extensie was toegestaan:
`knowledge-panel-2026-09-17T115543Z.png` (google.nl, merkquery `tps ventilatie` uit de SERP-nulmeting,
2026-09-17T11:55:43Z; ingelogd profiel, dus mét het "Je bedrijf op Google"-beheerderspaneel erboven — het
publieke paneel rechts toont 4,9 ★ / 38 reviews, adres, telefoon en openingstijden, gelijk aan de tabel hierboven).
