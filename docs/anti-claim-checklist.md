# D-13 Anti-Claim Checklist — pre-`review` gate for every node

**Purpose.** The build-time grep gate (`scripts/assert-no-forbidden-claims.ts`) is a coarse net: it catches three hard literals in serialized `review`/`published` content. This document is the **human gate** for the nuance a regex cannot judge — run it against **every node** before flipping its `status` to `review` (the gate that admits a page toward index per D-08/D-09).

This is an **internal doc**, not site copy. It is fine to name the forbidden phrases here; never paste them into a `lib/services/*` content file. Voice of the public copy is formal `u` (D-14).

Related: `04-CONTEXT.md` §D-13/D-02/D-10/D-12 · `04-RESEARCH.md` §"Per-Pillar ISDE 2026 Facts" / "Pricing & BTW Facts" / "Certification Facts" · `docs/owner-intake-spec.md` §5 (merken/dealerstatus) + §6 (certificeringen HARD GATE).

---

## 1. Hard forbidden literals (mirror the grep gate — auto-blocking)

The script fails the build (exit 1) if any review/published node's content matches these. Never write them:

| Forbidden literal | Why it is false / gated |
|---|---|
| `6% BTW` (Belgian reduced VAT) | Belgium-only, from 2026. **NL is 21% BTW.** Stating 6% is factually wrong for a NL installer (D-13/CONT-05). |
| `erkend installateur` (and any "dealer"/"authorised installer" badge) | An unverified status claim. Gated until the owner uploads proof per intake §5 (D-13/CONT-03). |
| `gecertificeerd` | The "certified" adjective is gated until at least one certification is owner-verified (intake §6). Use `vakkundig` / `ervaren` until then (D-02/D-13/CONT-06). |

> Once F-gassen/STEK is verified (intake §6), `gecertificeerd` becomes sayable — at that point scope/remove that one pattern in the script (RESEARCH A2).

---

## 2. Per-pillar ISDE / subsidie rule (the regex cannot judge this — read carefully)

Subsidie depth follows **D-10**: state *who qualifies* + *the durable conditions* + *cite the official RVO link*; **route euro amounts to a free consult** (see §3). Per pillar:

- **Airconditioning (koeling) — NO subsidy.** The airco pillar and all 4 airco sub-services MUST contain **no** ISDE/subsidie claim. Where users ask, state it plainly:
  > "Voor airconditioning (koeling) is geen ISDE-subsidie beschikbaar."
  Do not imply any subsidy for cooling airco. (A lucht-lucht unit *used for heating* is a separate, owner-confirmable category — keep it out of v1 copy unless the owner raises it.)
- **Warmtepompen — YES, with conditions.** WP qualifies for ISDE. State the durable conditions (eligible (hybride) warmtepomp for ruimte-/tapwaterverwarming; woning bouwjaar vóór 1-1-2019 of vergunning vóór 1-7-2018; volledige installatie door een installatiebedrijf; aanvraag binnen 24 maanden; nieuw + op de meldcodelijst). Cite the warmtepomp RVO URL.
- **WTW / balansventilatie — YES from 2026, ONLY met de isolatiemaatregel-precondition.** WTW qualifies **only gecombineerd met een of meer isolatiemaatregelen** (aanvraag binnen 24 maanden na de isolatiemaatregel), plus rendement/capaciteit thresholds (centraal ≥85% + ≥125 m³/h; decentraal ≥80% + ≥80 m³/h). Never state WTW subsidy without the **isolatiemaatregel** condition.
- **Mechanische ventilatie — YES from 2026, ONLY for CO2-gestuurde systems + isolatiemaatregel.** MV qualifies **only** for centrale **CO2-gestuurde** afzuigventilatie (>125 m³/h **+ minimaal 2 CO2-sensoren**) AND combined with an **isolatiemaatregel**. A plain demand-driven box without CO2 sensors does **not** qualify. **Never write a blanket "ventilatie is gesubsidieerd"** — frame it as "energiezuinige, CO2-gestuurde ventilatie in combinatie met isolatie."

---

## 3. RVO citation + amounts rule (every ISDE paragraph)

- **Cite the exact official source URL** (rvo.nl, never an aggregator). The three canonical URLs:
  - Warmtepomp: `https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp`
  - Ventilatie (WTW + CO2-MV): `https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie`
  - 2026-wijzigingen: `https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2026`
- **Route concrete euro amounts to a consult.** Never state a bedrag in copy (amounts change yearly; conditions are durable). Use phrasing like "vraag vrijblijvend advies over uw situatie" instead of a number (D-10).

---

## 4. Brand rule (CONT-03 / D-19)

- **Allowed:** naming a product you install ("wij installeren Daikin, Mitsubishi Electric / Heavy en Mitsubishi Ecodan").
- **NOT allowed until intake §5 proof:** a dealer / "erkend installateur" status claim, or presenting a brand logo as an endorsement/partnership badge. `erkendInstallateur` stays `false`; BrandGrid uses the text-chip fallback. A logo's mere presence must not read as an "erkend"/authorised claim.

---

## 5. Certification / keurmerk rule (CONT-06 / D-12 — HARD GATE)

- **No named keurmerk renders until the owner uploads proof** (intake §6): F-gassen/STEK, InstallQ, BRL, VCA, bedrijfsaansprakelijkheidsverzekering — none by name until verified.
- **No `gecertificeerd`** until at least one cert is confirmed. Interim trust copy uses **`vakkundig`** / **`ervaren` monteurs**, never the certified adjective.
- F-gassen/STEK is a *license to operate*, not a differentiator — still gated on proof (do not assume he holds it; confirm via intake §6).

---

## 6. Reviews / rating rule (CONT-08 / D-17)

- **No star rating and no `aggregateRating`** (the JSON-LD slot) renders without a **real Google source** (score + count + profile link, intake §8). Self-serving own-site ratings are ineligible for Google stars anyway — fill the slot for honest display + AI search, not for stars.
- **Keep customer quotes verbatim** — never invent, paraphrase, or embellish a review (avoids the fake-review penalty). Show only reviews the owner consents to display.

---

## Per-node review block (copy-paste, tick before flipping to `review`)

```
Node: ____________________  (pillar / sub-service)
[ ] §1 No hard forbidden literal (6% BTW / erkend installateur / gecertificeerd)
[ ] §2 ISDE per-pillar rule correct (airco=none · WP=yes · WTW/MV=2026+isolatiemaatregel · MV=CO2-gestuurd only)
[ ] §3 Every ISDE claim cites an rvo.nl URL; euro amounts routed to a consult (no bedrag)
[ ] §4 Brand: install-naming only; no dealer/erkend claim, no logo-as-endorsement (erkendInstallateur:false)
[ ] §5 Cert: no named keurmerk / no "gecertificeerd" without proof; interim = vakkundig/ervaren
[ ] §6 Reviews: no unsourced star/aggregateRating; quotes verbatim + consented
```
