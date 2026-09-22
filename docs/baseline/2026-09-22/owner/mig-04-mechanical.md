# MIG-04 — de mechanische helft, bewezen vóór de overstap

**taken:** 2026-09-22T14:12Z
**status:** GROEN (mechanische helft). De menselijke helft — Thomas die er één keer
doorheen inlogt — staat in `mig-04-owner-confirmation.md` en is wat MIG-04 afmaakt.

## Waarom twee helften

MIG-04 is een harde poort: *"An alternate WordPress-admin route is verified working before
cutover, so the rollback target stays inspectable."* Alleen bewijzen dat de rou­te bestaat is
half waar — dat de rou­te een inlogformulier teruggeeft zegt niets over of iemand er
daadwerkelijk doorheen komt, en juist dát is de storing waartegen deze eis verzekert (D-22).
Daarom telt deze poort pas als groen wanneer beide helften een artefact hebben.

## Het commando

Uitgevoerd vanaf de repo-root, terwijl de oude site nog gewoon op de apex stond:

```bash
curl -sS --max-time 25 \
  --resolve tpsventilatie.nl:443:195.78.67.39 \
  https://tpsventilatie.nl/wp-login.php
```

`--resolve` doet in één commando wat de hosts-regel uit runbook §9 permanent doet op de
computer van de eigenaar: het stuurt `tpsventilatie.nl` naar `195.78.67.39` zonder DNS te
raadplegen. Het bewijst dus precies de route die ná de overstap overblijft.

**Geen `-k` en geen `--insecure`, met opzet.** Een ontbrekend of ongeldig certificaat is een
van de signalen waarop we de overstap beoordelen; dat wegklikken maakt het signaal stuk.

## Wat er terugkwam

| meting | waarde |
|---|---|
| HTTP-status | **200** |
| certificaatverificatie | **0** (geldig — er was geen `-k` nodig) |
| `<title>` | `Login ‹ TPS Ventilatie — WordPress` |
| formuliermarkers in de HTML | `loginform`, `wp-login`, `wp-submit` |

Dat is het echte WordPress-inlogscherm van de oude installatie, niet onze nieuwe site.

## De bijbehorende certificaatmeting

Op dezelfde dag gemeten op `mail.tpsventilatie.nl:993`:

```
subject = CN=mail.tpsventilatie.nl
notAfter = Oct 29 05:19:42 2026 GMT
SANs     = mail.tpsventilatie.nl, tpsventilatie.nl, www.tpsventilatie.nl
```

Twee van de drie namen op dat certificaat zijn precies de namen die deze fase verhuist. Na de
overstap kan de oude server zich niet meer valideren en verloopt het certificaat op
**2026-10-29**. Dat is een **gedateerd feit, geen terugdraai-signaal** — zie runbook §9.

**Aanvulling 2026-09-22 (eigenaar):** `info@tpsventilatie.nl` is in de praktijk niet in
gebruik; Thomas werkt vanaf een Gmail-adres. Het verlopen van dit certificaat is daarmee
uitdrukkelijk geaccepteerd ("dan verloopt het, geen probleem"), en een mailmigratie wordt
later als apart voorstel aan Tomasz voorgelegd. Gevolg om vast te houden: het
cyberfolks-abonnement bestond volgens D-02 juist vóór die mailbox, dus de aanname dat het
abonnement vanzelf blijft bestaan is zwakker dan D-02 veronderstelde. Terugdraaien blijft
een DNS-handeling van twee records zolang dat abonnement leeft.

## Opnieuw maken

Het commando hierboven, zolang de oude installatie op `195.78.67.39` draait. Na de overstap
blijft het werken — dat is het hele punt van `--resolve`. Het stopt pas met werken als de
installatie zelf verdwijnt, en dat is precies het risico dat hierboven staat.
