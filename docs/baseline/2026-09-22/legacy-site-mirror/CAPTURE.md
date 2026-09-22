# CAPTURE — contentspiegel van `tpsventilatie.nl` (MIG-01 zoals gewijzigd, D-02/D-28)

> **Geen wachtwoorden, tokens of sleutels in deze map.** Dit is een niet-geauthenticeerde crawl van
> publieke pagina's: HTML en afbeeldingen die iedere bezoeker ook krijgt. Geen database, geen
> persoonsgegevens, geen beheerderspaden. Het enige e-mailadres in de boom is het publieke
> `info@tpsventilatie.nl`, dat op de contactpagina staat.

**taken:** 2026-09-22T12:05:48Z – 2026-09-22T12:08:26Z (crawl), afgerond 2026-09-22T12:08:26Z
**wget-versie:** `GNU Wget 1.25.0 built on darwin25.4.0.` (via Homebrew; niet eerder op deze machine aanwezig)
**omvang:** 94 bestanden, 2,2 MB (`du -sh` → `2.2M`) — ruim onder de ~25 MB-grens van D-28, dus de
uitwijk naar externe opslag was niet nodig
**bron:** `https://tpsventilatie.nl` (WordPress 7.1.1 + Oxygen op LiteSpeed, `195.78.67.39`), **terwijl de
oude site nog live was**

---

## 1. Wat dit is, en waarom het bestaat

MIG-01 vroeg oorspronkelijk om een kopie van bestanden en database. D-02 heeft die premisse verworpen:
de omschakeling verplaatst **twee A-records** en raakt bestanden, database, vhost noch abonnement aan.
Omkeerbaarheid wordt dus beschermd door **de installatie nooit aan te raken** en door **het
cyberfolks-abonnement in leven te houden voor `info@tpsventilatie.nl`** — niet door een kopie.

Wat wél de moeite waard is om te bewaren is de **inhoud**. Die kost niets, vraagt geen inloggegevens en
geen actie van Thomas, en is **na de omschakeling niet meer op te halen**. Vandaar deze spiegel.

**Wat dit niet is.** Dit is een momentopname van gerenderde HTML plus assets. Het is **geen
WordPress-installatie** en het kan **geen site herstellen**: geen database, geen thema's, geen plugins,
geen mediabibliotheek-metadata. Wie de oude site terug wil, draait de twee A-records terug — dat is de
rollback, en die staat in `../README.md` en in de runbook.

## 2. Het commando

Eén commando, letterlijk zo uitgevoerd, vanaf de repo-root. Kopieer-plakbaar:

```bash
brew install wget            # 1.25.0

OUT="docs/baseline/$(date -u +%F)/legacy-site-mirror"
mkdir -p "$OUT"
wget \
  --recursive --level=2 \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --no-parent \
  --domains=tpsventilatie.nl \
  --reject-regex '(wp-json|xmlrpc)' \
  --no-host-directories \
  --directory-prefix="$OUT" \
  --wait=1 --random-wait \
  --restrict-file-names=windows \
  --user-agent='Mozilla/5.0 (compatible; TPS-archive/1.0; +https://www.tpsklimaattechniek.nl/)' \
  --input-file=- <<'URLS'
https://tpsventilatie.nl/
https://tpsventilatie.nl/over-ons/
https://tpsventilatie.nl/contact/
https://tpsventilatie.nl/privacy-beleid/
https://tpsventilatie.nl/wtw-unit-vervangen/
https://tpsventilatie.nl/wtw-unit-onderhoud-reinigen/
https://tpsventilatie.nl/wtw-unit-inregelen/
https://tpsventilatie.nl/mechanische-ventilatie-vervangen/
https://tpsventilatie.nl/mechanische-ventilatie-onderhoud-reinigen/
https://tpsventilatie.nl/mechanische-ventilatie-dakventilator/
URLS

du -sh "$OUT"
```

Elke vlag doet werk; geen ervan is decoratie:

| vlag | waarom |
|---|---|
| `--input-file=-` met de 10 URL's | Verankert de vastlegging aan de 9 gemapte pagina's + de root, in plaats van te crawlen wat de site toevallig linkt |
| `--domains=tpsventilatie.nl` | Houdt de crawl op het domein. De pagina's verwijzen naar `fonts.googleapis.com` en `api.whatsapp.com`; zonder deze vlag zou `--page-requisites` die achterna gaan |
| `--no-parent` | Extra zekerheid naast `--domains` |
| `--level=2` | Genoeg voor de links vanaf de seeds, zonder de hele WordPress-installatie |
| `--page-requisites` | De afbeeldingen/CSS/JS die het archief laten renderen — het eigenlijke punt |
| `--convert-links` | Herschrijft links naar relatief, zodat het archief offline opent vanaf `index.html` |
| `--adjust-extension` | WP-URL's met slash worden `over-ons/index.html` — bladerbaar én diffbaar in git |
| `--reject-regex '(wp-json\|xmlrpc)'` | **Zie §4.** Houdt installatie-interne endpoints uit de boom |
| `--no-host-directories` | Laat het `tpsventilatie.nl/`-voorvoegsel weg; de boom is `legacy-site-mirror/over-ons/index.html` |
| `--wait=1 --random-wait` | Hoffelijkheid tegenover een productiemachine die niet van ons is |
| `--restrict-file-names=windows` | Houdt bestandsnamen draagbaar; de repo staat op een OneDrive-mount |
| **geen** `-e robots=off` | Bewust. `robots.txt` verbiedt alleen `/wp-admin/`, wat we niet willen en waartoe we niet gerechtigd zijn. Respecteren is correct en houdt het artefact verdedigbaar |
| **geen** `--mirror` | `--mirror` betekent `-r -N -l inf`: oneindige diepte zou de hele installatie meenemen, inclusief paginering en feeds |

## 3. Wat er in de boom zit

- `index.html` plus de negen `<slug>/index.html`-pagina's — de 10 publieke URL's
- `wp-content/` (70 bestanden) — Oxygen-CSS, plugin-CSS/JS en de mediabibliotheek-afbeeldingen inclusief
  de `srcset`-varianten
- `wp-includes/` (3 bestanden) — de core-scripts die de pagina's inladen
- `index.html@p=NN.html` (8 bestanden) — dezelfde pagina's via hun `?p=<id>`-permalinkvorm, die WordPress
  in de head als `shortlink` adverteert. Duplicaten van bovenstaande pagina's, bewust niet verwijderd:
  ze bewijzen dat de `?p=`-vorm 301'de naar de nette URL toen de site nog draaide
- `feed/`, `comments/`, `robots.txt` — publieke syndicatie en het crawl-beleid zoals het die dag gold

**Vier 404's tijdens de crawl**, alle vier lettertypebestanden waar de Oxygen-thema-CSS naar verwijst maar
die niet op de server staan:
`wp-content/themes/oxygen-is-not-a-theme/assets/fonts/{inter/Inter-VariableFont_slnt,wght,cardo/cardo_normal_400,cardo/cardo_italic_400,cardo/cardo_normal_700}.woff2`.
Die geven **ook voor een gewone bezoeker** een 404 — het is een eigenschap van de live site, geen gat in
deze vastlegging. Daarom eindigt `wget` met exitcode 8 ("server issued an error response"); dat is hier
het verwachte resultaat, geen mislukking.

## 4. Waarom `--reject-regex '(wp-json|xmlrpc)'` erbij staat

Deze vlag stond **niet** in het oorspronkelijke recept (RESEARCH §Pattern 6) en is tijdens de uitvoering
toegevoegd, nadat een eerste crawl liet zien wat er zonder gebeurt.

WordPress zet in de `<head>` van elke pagina een `<link rel="alternate" type="application/json+oembed">`
naar `/wp-json/oembed/1.0/embed?url=…`, plus een RSD-link naar `xmlrpc.php`. `--page-requisites` volgt
die. `robots.txt` verbiedt ze niet, dus `wget` haalde ze keurig binnen. De eerste crawl leverde
**10 `wp-json`-bestanden en een `xmlrpc.php@rsd`** op, en daarin stond:

- `"author_name":"root"` in elke oembed-respons — oftewel: de WordPress-beheerdersaccount heet `root`
- `wp-json/index.html` met de volledige REST-namespacelijst, inclusief `contact-form-7/v1` — een
  opsomming van het plugin-oppervlak
- per pagina een `data-secret`-token voor de oembed-iframe

Dat is precies wat de privacycontrole van dit plan moet tegenhouden, en om een concretere reden dan
netheid: D-02 accepteert expliciet dat deze installatie **ongepatcht blijft rotten** (WP 7.1.1). Publiek
en permanent in een git-repo vastleggen dat het beheerdersaccount `root` heet, samen met de
plugin-inventaris, maakt dat geaccepteerde risico onnodig groter.

De boom is daarom opnieuw opgehaald mét deze vlag, zodat het commando hierboven **exact** reproduceert
wat er is vastgelegd. De alternatieve route — het eerste resultaat achteraf opschonen — zou betekenen dat
wie het opgeschreven commando opnieuw draait, de lekkage stilletjes terugkrijgt.

De crawl is dus twee keer gedraaid (12:05–12:08 UTC de definitieve). Beide keren met `--wait=1
--random-wait`; ~94 verzoeken met een seconde ertussen op een brochuresite.

## 5. Opnieuw maken

**Alleen zolang de oude site nog op `195.78.67.39` staat.** Het commando in §2 reproduceert deze boom
zolang `tpsventilatie.nl` nog naar WordPress wijst. **Vanaf het moment dat plan 10-09 de A-records van
`@` en `www` naar Vercel verplaatst, is dit bestand niet meer opnieuw te maken** — dezelfde URL's leveren
dan de nieuwe site of een redirect op. Dit is dan het enige bewijs van de inhoud-vóór-de-omschakeling,
net zoals `../../2026-09-16/dns/tpsventilatie.nl-pre-switch-2026-09-16T175840Z.txt` het enige bewijs is
van de zone-vóór-de-nameserverwissel.

## 6. Offline controleren

```bash
open docs/baseline/2026-09-22/legacy-site-mirror/index.html
```

De pagina moet openen met opmaak en afbeeldingen, en de negen interne links moeten naar
`<slug>/index.html` binnen deze map wijzen. Wijst een link nog naar `https://tpsventilatie.nl/…`, dan
heeft `--convert-links` zijn werk niet gedaan en is het archief een map met wezen.
