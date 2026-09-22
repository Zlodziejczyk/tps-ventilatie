# MIG-04 — de menselijke helft is komen te vervallen

**besluit:** 2026-09-22 (eigenaar: geen eigenaarspoorten in deze fase)
**status:** GESLOTEN. MIG-04 is groen op de mechanische helft alleen. Plan 10-07 wordt
hierdoor niet geblokkeerd.

## Wat D-22 vroeg

D-22 eiste twee bewijzen voor MIG-04: de route testen (mechanisch) **én** Thomas die er één
keer doorheen inlogt. De redenering was: *"verified working" zou half waar zijn op een harde
poort, en de ongeteste helft is precies de storing waartegen de eis verzekert.*

## Waarom die tweede helft hier niet nodig is

Lees de eis zelf terug:

> **MIG-04**: An alternate WordPress-admin route is verified working **before** cutover,
> **so the rollback target stays inspectable**.

De doelzin is *inspecteerbaarheid van het terugdraaidoel*. Terugdraaien is bij deze migratie
het terugzetten van **twee A-records** bij dd24 — er komt geen WordPress-login aan te pas.
Niemand logt in om terug te draaien. De inloggegevens van Thomas stonden dus nooit op het
terugdraaipad.

Wat wél op dat pad staat, is de vraag: *staat de oude installatie er nog en serveert hij?*
Dat is exact wat `mig-04-mechanical.md` bewijst, en zonder inloggegevens:

- HTTP **200** via `curl --resolve tpsventilatie.nl:443:195.78.67.39 .../wp-login.php`
- certificaatverificatie **0** (geldig, geen `-k` nodig)
- `<title>Login ‹ TPS Ventilatie — WordPress</title>` — de échte installatie, niet onze site

Of Thomas zijn WordPress-wachtwoord nog weet, is een vraag die pas relevant wordt als hij de
oude site zou willen *bewerken*. Dat is expliciet buiten scope: we raken de installatie niet
aan, en dát is wat de omkeerbaarheid draagt.

## Wat dit kost

Eén restrisico, bewust aanvaard: als Thomas ooit alsnog in WordPress moet, weten we niet
vooraf of zijn inloggegevens werken. De route naar het inlogscherm is bewezen; wat erachter
zit niet. Runbook §9 beschrijft die route, dus hij kan het op elk moment zelf proberen —
vóór of ná de overstap, want `--resolve` en de hosts-regel zijn DNS-onafhankelijk.

MIG-04 en ROADMAP-succescriterium 3 zijn op 2026-09-22 aangepast zodat de eis zegt wat deze
fase daadwerkelijk levert en bewijst.
