# SERP-nulmeting — 24 queries × 2 domeinen (D-13)

taken: 2026-09-17T09:00Z – 10:58Z (q1–q17 p.1), 11:22Z – 11:33Z (q17 p.2, q18–q23) en 11:54Z (q24) — de twee onderbrekingen zijn Google's 403-blokkades (±20 min wachten)
aantal queries: 24 (gelezen uit `gsc/serp-queries.json`, niet overgetypt)

## Methode

- **Browser:** Chrome, ingelogd profiel, aangestuurd door Claude (D-01); personalisatie uit via `pws=0`; geen Guest-venster beschikbaar in de sessie. Het ingelogde profiel toont bij de merknaam-query een "Je bedrijf op Google"-paneel (beheerder van het Business Profile) — dat staat los van de organische posities.
- **URL-template:** `https://www.google.nl/search?q=<query, URL-encoded>&gl=nl&hl=nl&pws=0&num=20&uule=<waarde>`; voor de tweede pagina `&start=10`.
- **uule** (v1-vorm) voor de canonieke locatie `Zoetermeer,South Holland,Netherlands`, berekend met
  `node -e "const k='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';const n='Zoetermeer,South Holland,Netherlands';console.log('w+CAIQICI'+k[n.length]+Buffer.from(n).toString('base64'))"`
  → `w+CAIQICIkWm9ldGVybWVlcixTb3V0aCBIb2xsYW5kLE5ldGhlcmxhbmRz`. **Let op:** de `+` moet letterlijk in de URL staan; met `%2B` negeerde Google de parameter (footer: "Onbekend").
- **Footer-controle:** de footer toont **"Zoetermeer - Op basis van je IP-adres"** (Google's label voor een uule-locatie) — bevestigd bij de eerste query en bij elke vastgelegde pagina — zie `serp-example-footer.png`. Bij elke vastgelegde pagina is gecontroleerd dat de footer "Zoetermeer" toont (kolom *opmerking* meldt het als dat niet zo was).
- **num=20 wordt door Google genegeerd** (max. 10 organische resultaten per pagina, 2025+): de top 20 is daarom pagina 1 (`start=0`) plus pagina 2 (`start=10`); een positie op p.2 = 10 + positie binnen p.2 (bij 9 organische resultaten op p.1: 9 + positie, zie *opmerking*). Pagina 2 is alleen geladen als een van beide domeinen niet op p.1 stond.
- **Organische positie:** 1-gebaseerde volgorde van de resultaten met een `h3`-kop binnen `#rso` (ads, "Mensen vragen ook", video-carrousels en het local pack tellen niet mee); per URL ontdubbeld. Gesponsorde resultaten (o.a. Werkspot-advertenties die "TPS Ventilatie" noemen) zijn genegeerd.
- **Local pack:** aanwezig als de SERP een blok "Plaatsen"/"Bedrijven" bevat; *ja* = een TPS-vermelding in dat blok.
- **Tempo:** ±5–15 s tussen pagina's bij q1–17. Google toonde twee keer een reCAPTCHA (door de eigenaar opgelost; niets gescript) en gaf na q17 p.1 een harde 403; na ±20 min wachten is met ±20 s tussen pagina's verder vastgelegd (welke pagina's wanneer: zie *taken*; een nieuwe 403 wordt in de tabel als `niet vastgelegd (Google 403)` gemeld).
- Eén rij per query; zie de totalen onderaan. Herhalen bij milestone-afsluiting met exact deze template.

| # | query | tpsklimaattechniek.nl | tpsventilatie.nl | local pack | opmerking |
|---|---|---|---|---|---|
| 1 | klimaattechniek Zoetermeer | 19 (p.2) | niet in top 20 | nee |  |
| 2 | airconditioning | niet in top 20 | niet in top 20 | nee | p.1 telde 9 organische resultaten |
| 3 | airco laten installeren | niet in top 20 | niet in top 20 | nee |  |
| 4 | airco onderhoud | niet in top 20 | niet in top 20 | nee | p.1 telde 9 organische resultaten |
| 5 | airco storing | niet in top 20 | niet in top 20 | nee |  |
| 6 | airco advies Zoetermeer | niet in top 20 | niet in top 20 | nee |  |
| 7 | warmtepomp | niet in top 20 | niet in top 20 | ja | p.1 telde 9 organische resultaten; TPS in local pack alleen op p.2 |
| 8 | warmtepomp laten installeren | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 9 organische resultaten |
| 9 | warmtepomp onderhoud | niet in top 20 | niet in top 20 | ja |  |
| 10 | warmtepomp storing | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 9 organische resultaten |
| 11 | warmtepomp advies regio Den Haag | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 9 organische resultaten |
| 12 | wtw unit | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 7 organische resultaten |
| 13 | wtw-unit vervangen | niet in top 20 | 16 (p.2) | geen local pack | p.1 telde 9 organische resultaten |
| 14 | wtw onderhoud | niet in top 20 | niet in top 20 | ja | p.1 telde 9 organische resultaten |
| 15 | wtw inregelen | niet in top 20 | 16 (p.2) | geen local pack | p.1 telde 8 organische resultaten |
| 16 | wtw storing | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 9 organische resultaten |
| 17 | wtw unit aanleggen | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 7 organische resultaten |
| 18 | mechanische ventilatie | niet in top 20 | niet in top 20 | ja | p.1 telde 6 organische resultaten |
| 19 | mechanische ventilatie vervangen | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 8 organische resultaten |
| 20 | mechanische ventilatie onderhoud | niet in top 20 | niet in top 20 | ja | p.1 telde 9 organische resultaten |
| 21 | mechanische ventilatie storing | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 9 organische resultaten |
| 22 | mechanische ventilatie aanleggen | niet in top 20 | niet in top 20 | geen local pack | p.1 telde 7 organische resultaten |
| 23 | tps klimaattechniek | 1 | 6 | geen local pack |  |
| 24 | tps ventilatie | 2 | 1 | geen local pack | p.1 telde 7 organische resultaten |

**Totalen (24 van 24 queries vastgelegd):** tpsklimaattechniek.nl `niet in top 20` bij **21/24** vastgelegde queries; tpsventilatie.nl `niet in top 20` bij **20/24**; TPS in het local pack bij **5/24**. De nullen zijn de vóór-kant van de milestone-claim (D-13).
