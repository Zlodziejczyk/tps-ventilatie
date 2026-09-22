# SSL-certificaat `mail.tpsventilatie.nl` — vraag bewust NIET gesteld

**datum besluit:** 2026-09-22
**status:** GESLOTEN zonder vraag aan cyberfolks. Dit heeft de overstap nooit geblokkeerd
en blokkeert hem ook nu niet.

## Wat de vraag zou zijn geweest

RESEARCH §Pitfall 4 stelde voor om via Thomas aan cyberfolks te vragen:

> "Kan het SSL-certificaat voor `mail.tpsventilatie.nl` los worden uitgegeven, dus zonder
> `tpsventilatie.nl` en `www.tpsventilatie.nl` erin? Die twee gaan naar een andere server."

De aanleiding is echt en gemeten (2026-09-22, `mail.tpsventilatie.nl:993`):

```
subject = CN=mail.tpsventilatie.nl
notAfter = Oct 29 05:19:42 2026 GMT
SANs     = mail.tpsventilatie.nl, tpsventilatie.nl, www.tpsventilatie.nl
```

Twee van de drie namen zijn precies de namen die deze fase verhuist. Na de overstap kan de
oude server zich niet meer valideren via HTTP-01, dus het certificaat vernieuwt niet en
verloopt op **2026-10-29** — ná het einde van de terugdraaitermijn van 28 dagen.

## Waarom de vraag niet is gesteld

De eigenaar (Oskar) heeft op **2026-09-22** vastgesteld dat de premisse niet klopt:

- **`info@tpsventilatie.nl` is in de praktijk niet in gebruik.** Thomas werkt vanaf een
  Gmail-adres. (Consistent met Phase 9: de gedelegeerde GSC-eigenaar is
  `tpsventilatie@gmail.com`.)
- Het verlopen van dit certificaat is daarmee **uitdrukkelijk geaccepteerd**: *"dan verloopt
  het, geen probleem."*
- Een **mailmigratie** wordt later als apart voorstel aan Tomasz voorgelegd, buiten Phase 10.

Thomas' tijd is de schaarste input in deze fase (zie `mig-04-owner-confirmation.md`: één
bericht, zo min mogelijk vragen). Hem laten uitzoeken of cyberfolks een certificaat kan
splitsen voor een mailbox die niemand gebruikt, kost een reactie die we nodig hebben voor de
vraag die er wél toe doet.

## Wat hiervan overblijft

1. Het certificaat verloopt op 2026-10-29. Dat is een **gedateerd feit, geen
   terugdraai-signaal** — runbook §9 zegt dit ook zo.
2. De beheerroute naar WordPress geeft vanaf die datum een certificaatwaarschuwing.
   Alternatief zonder waarschuwing: `s161.cyber-folks.pl` (certificaat geldig tot
   2026-12-24), of de twee DNS-records tijdelijk terugzetten.
3. **Het echte restrisico is een ander.** D-02 nam aan dat het cyberfolks-abonnement blijft
   bestaan *omdat* `info@` nodig is. Als die mailbox niet gebruikt wordt, is er geen
   dagelijkse reden om het abonnement aan te houden — en met het abonnement vertrekt de
   WordPress-installatie, die het doelwit van de rollback is. Plan 10-10 moet vóór de
   dag-28-verklaring controleren dat die installatie er dan nog staat, in plaats van
   omkeerbaarheid te herhalen.
