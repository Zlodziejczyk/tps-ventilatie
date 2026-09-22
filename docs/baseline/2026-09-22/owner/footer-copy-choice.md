# Footertekst — keuze van de eigenaar (D-26)

**gevraagd op:** 2026-09-22
**status:** NOG GEEN ANTWOORD. Niet blokkerend voor de overstap; register B staat live op de
preview en is wat er wordt gepubliceerd als er geen andere keuze komt.

## Wat er nu staat

Register **B**, gerenderd in de footer van elke pagina:

> TPS klimaattechniek is de nieuwe naam van TPS Ventilatie.

Preview: https://tps-ventilatie-git-gsd-phase-10-reversib-4ce964-pushly-projects.vercel.app/
(onderaan, in de grijze balk naast KvK/BTW — geverifieerd gerenderd op 2026-09-22.)

## De drie voorstellen

| # | Tekst | Toon |
|---|---|---|
| A | *TPS klimaattechniek — voorheen TPS Ventilatie* | Minimaal, bijna een juridische voetnoot |
| B | *TPS klimaattechniek is de nieuwe naam van TPS Ventilatie.* | Gewone zin; duidelijkste signaal voor Google — **aanbevolen** |
| C | *Bekend van TPS Ventilatie — sinds 2026 TPS klimaattechniek.* | Warmst; spreekt terugkerende klanten aan |

**Waarom B aanbevolen is.** Het is een expliciete "X is de nieuwe naam van Y"-uitspraak. Dat
is precies de koppeling die deze migratie aan Google wil overbrengen, en het is ook voor een
mens die op de oude naam zoekt niet voor tweeërlei uitleg vatbaar.

**Waarom de regel er onvoorwaardelijk staat.** Een 301 verraadt zijn eigen herkomst niet — de
`Referer` van een doorgestuurd verzoek is de oorspronkelijke verwijzer, meestal Google, niet
het oude domein. Er is dus niets om op te conditioneren; de regel staat er voor iedereen, of
altijd niet.

**Plaatsing.** Alleen de footer, voorlopig. Een alinea op `/over-ons` is een optie die open
blijft; RESEARCH Open Question 4 adviseert voorlopig alleen de footer.

## Antwoord

_(nog niet ontvangen — datum en keuze hier invullen; is het niet B, dan wordt de string in
`components/Footer.tsx` aangepast en gepusht vóórdat dit plan sluit)_
