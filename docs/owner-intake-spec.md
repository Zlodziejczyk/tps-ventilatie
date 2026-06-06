# TPS klimaattechniek — Owner Intake Form (Spec + Build Checklist)

**Status:** ✅ Published 2026-06-06 — form `2EojAA` is LIVE (password `tpsklimaat2026` active). Message sent to Thomas; awaiting his input (intake returns mapped to code in plan 04-09). · Drafted 2026-06-03, built 2026-06-04, published 2026-06-06 · Built/operated by Pushly.nl (Polaris360)

> **Live form (PUBLISHED 2026-06-06 via Tally):**
> - Public fill link (LIVE): https://tally.so/r/2EojAA
> - Edit/preview: https://tally.so/forms/2EojAA/edit
> - 12 pages (welcome + 10 sections + thank-you), 196 blocks. Dutch · password `tpsklimaat2026` · save-for-later on · progress bar on.
> - **Done (04-08):** form published + password active; one message sent to Thomas (link + password + photo/logo/cert/dealer-proof instruction). Next: map his returns into the gated slots in 04-09.

> **Reuse model:** this clones the proven **Shine & Drive** intake (Tally form `44O4XB`) — same shell, same conventions — and *extends* it with the installer-specific sections TPS needs (werkgebied, merken/dealerstatus, certificeringen, domein). The S&D 7-section skeleton + ASK-vs-DERIVE split is the reusable Pushly template; TPS adds 3 regulated/multi-service sections on top.
>
> **Prefills sourced from:** `lib/constants.ts` (`SITE`), `lib/services/*` (taxonomy + brands), `.planning/REQUIREMENTS.md`, `.planning/STATE.md`.

---

## 1. Why this exists

Every field clears a real blocker already logged in the planning docs — the form replaces a drip of emails with one structured, mappable sitting that Thomas fills in async before the meeting:

- **Content (Phase 4) is gated** on owner-verified certifications and dealer status — we may only display marks/claims he genuinely holds (`CONT-06`, `D-06`).
- **Local SEO + map pin (Phase 3/5)** need a verified address (→ we derive geo), radius, service-area list, and opening hours (`SEO-07`, `QA-05`).
- **Trust** needs the founder story, USP proof, and the Google reviews source (`CONT-07`, `CONT-08`).
- **One open decision:** the domain (`tpsventilatie.nl` vs `tpsklimaattechniek.nl`).
- **Lead notification (Phase 5)** needs the owner's channel + details (`LEAD-02`, `QA-08`).

## 2. Approach & decisions

| Part | Tool | Why |
|---|---|---|
| The structured fields | **Tally form** | No login for the owner · **real password protection** · free · clean UX + export · native file upload |
| Photos / logo / cert scans | **Tally upload**, with **WhatsApp / Dropbox file-request** fallback | Tally's own upload needs no account; avoid Google Drive/Forms uploads, which *force a Google login on the respondent* |

- **Form tool = Tally** (matches S&D). GHL rejected for this job (clunky, built for CRM lead-capture, not internal intake). Google Forms rejected (upload forces Google login; can't truly password-protect for an external person).
- **Access control:** Tally password (intended: `tpsklimaat2026`) **+** the unguessable form URL as a second layer. One message to the owner: link + password + photo instruction.
- **Language:** **Dutch only.** Tomasz is fluent in Dutch (and Polish) — no translation layer needed (unlike S&D, where we produce the Polish ourselves).
- **Tone:** informal-professional, `je` (matches the S&D template; warm and clear for an owner-facing form).
- **Format:** one multi-step form, sections = pages, **save-for-later enabled**, progress bar on. *(Your "your call" on length → multi-step with resume handles the full set without overwhelming.)*
- **⚠️ Tooling blocker:** the Tally MCP is **not loaded in this Claude session**. Building the form (§5) requires those tools — reload/restart so they appear, then it's a ~clone-and-extend job.

## 3. What we ASK vs what we DERIVE

Don't burden the owner with anything we can produce ourselves (adopted from the S&D template).

- **Ask the owner** (only he knows): legal name, KvK/BTW, confirm address + hours, service area, services offered, brands + **dealer status**, **certifications (+ proof)**, prices, his story + USP proof, review consent, social handles, logo + photos, the **domain choice**, notification preference.
- **We derive** (never ask): exact **GPS lat/lng** → from his confirmed address (`SITE.geo`); all **JSON-LD** values → built from his answers; **OG image** → design job; the **keyword map** and **page copy** → our work.

## 4. Form sections & fields

Columns: **Veld** (owner-facing, NL) · **Type** · **Verplicht?** (✓/–) · **→ Code destination**. Prefills shown *in italics*. Tag: `[GENERIC]` = shared Pushly skeleton · `[TPS]` = installer-specific extension.

### Welkomstscherm
> **TPS klimaattechniek — uw gegevens & wensen.** Met dit formulier verzamelen we in één keer alles wat we nodig hebben voor uw nieuwe website — zo'n 10–15 min. Niet in één keer nodig: sla op en ga later verder. Geen idee bij een vraag? Laat 'm leeg, dan bespreken we het in onze afspraak.

### 1. Bedrijfsgegevens `[GENERIC]`
| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| Officiële bedrijfsnaam — *TPS klimaattechniek* | tekst | ✓ | `SITE.name`, footer, JSON-LD `name`/`legalName` |
| KvK-nummer — *73722650* | tekst | ✓ | `SITE.kvk`, privacy, schema |
| BTW-nummer — *NL862655889B01* | tekst | ✓ | `SITE.btw`, privacy |
| Adres (straat + nr) — *Industrieweg 6 B* | tekst | ✓ | `SITE.address`, contact, schema `address` (→ we derive geo) |
| Postcode + plaats — *2712 LB Zoetermeer* | tekst | ✓ | `SITE.postcode`/`city`, NAP, schema |
| Telefoon / WhatsApp — *06-29 40 34 50* | tel | ✓ | `SITE.phone`/`phoneDisplay`/`whatsappUrl`, schema `telephone` |
| E-mailadres — *info@tpsventilatie.nl* | e-mail | ✓ | `SITE.email`, footer, schema, notificatie-target |
| Slogan — *"Specialist in Schone Lucht"* (nog passend nu het "klimaattechniek" is?) | tekst | – | hero/meta |

### 2. Openingstijden `[GENERIC]`
| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| Per dag (Ma–Zo): open/dicht + van–tot | grid / per-dag | ✓ | schema `OpeningHoursSpecification`, contact page |
| Ook op afspraak buiten deze tijden? | ja/nee | ✓ | contact copy |
| Spoed/storingsdienst beschikbaar? (relevant voor storing-pagina's) | ja/nee + tekst | – | storing service pages |

### 3. Werkgebied `[TPS]`
> *(S&D has no equivalent — it's a fixed-location garage. TPS serves a radius, so this is a genuine TPS extension.)* Never claim an area he doesn't serve.

| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| Straal (km) — *60* | nummer | ✓ | `SITE.serviceRadiusKm` |
| Gemeenten die u bedient *(checklist, alle vooraf aangevinkt: Zoetermeer · Den Haag · Leidschendam-Voorburg · Pijnacker-Nootdorp · Lansingerland · Delft · Gouda · Leiden — vink uit wat niet klopt)* | checklist | ✓ | `SITE.serviceAreas`, `areaServed` JSON-LD |
| Extra gemeenten die u wél bedient | tekst | – | `SITE.serviceAreas` |

### 4. Diensten & prijzen `[TPS taxonomy]`
> Pre-ticked from the registry (4 pijlers, 22 pagina's). Untick anything TPS does NOT do.

| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| **Airconditioning** — Installatie · Onderhoud · Reparatie & storing · Advies | checklist (pre-✓) | ✓ | `lib/services/airconditioning.ts` status |
| **Warmtepompen** — Installatie · Onderhoud · Reparatie & storing · Advies | checklist (pre-✓) | ✓ | `lib/services/warmtepompen.ts` status |
| **WTW** — Vervangen · Onderhoud & reinigen · Inregelen · Storing · Aanleggen | checklist (pre-✓) | ✓ | `lib/services/wtw.ts` status |
| **Mechanische ventilatie** — Vervangen · Onderhoud & reinigen · Storing · Aanleggen | checklist (pre-✓) | ✓ | `lib/services/mechanische-ventilatie.ts` status |
| Ontbrekende dienst? | tekst | – | taxonomy |
| Doelgroep | checklist (Particulier · Zakelijk · VvE · Nieuwbouw · Renovatie) | – | content angle |
| Kloppen de huidige tarieven op de site nog? *(Airco/WTW/MV = all-in incl. BTW + voorrijkosten)* | ja / nee, aangepast + lange tekst | ✓ | `/tarieven`, `PricingTabs` |
| Warmtepompen: prijs op maat via offerte? | bevestig ja/nee | – | tarieven (`CONT-05`) |
| Voorrijkosten — bedrag of inbegrepen? | tekst | – | tarieven |
| Actuele prijslijst (indien beschikbaar) | upload | – | tarieven |

### 5. Merken & dealerstatus `[TPS]`
> **Critical gate.** Every brand ships `erkendInstallateur: false` as a placeholder — we cannot render any dealer/"erkend installateur" claim until verified here (`D-06`, `CONT-03`). One row per brand.

| Merk | Installeert u dit? | Officiële status | Bewijs | → Code |
|---|:--:|---|:--:|---|
| Daikin | ja/nee | Geen / Dealer / Erkend installateur | upload | `brands.ts` `erkendInstallateur`, BrandGrid |
| Mitsubishi Electric | ja/nee | idem | upload | idem |
| Mitsubishi Heavy Industries | ja/nee | idem | upload | idem |
| Mitsubishi Ecodan | ja/nee | idem | upload | idem |

| Veld | Type | Verpl. | → Code |
|---|---|:--:|---|
| Andere merken die u installeert *(bv. Toshiba, LG, Panasonic, Samsung, Nibe, Vaillant)* | tekst | – | `brands.ts` |

### 6. Certificeringen & keurmerken `[TPS]` — HARD GATE
> Display-gated on proof: *"we tonen alleen keurmerken die u écht heeft."* Each tick → upload.

| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| F-gassen / STEK | check + cert-nr + upload | – | trust block (`CONT-06`), schema |
| InstallQ (erkend installateur) | check + upload | – | trust block |
| BRL (welke?) | check + tekst + upload | – | trust block |
| VCA | check + upload | – | trust block (zakelijk) |
| Bedrijfsaansprakelijkheidsverzekering | check + upload | – | trust signal |
| Garantie (jaren / voorwaarden) | tekst | – | service/over-ons copy |
| Andere keurmerken | tekst + upload | – | trust block |

### 7. Over TPS — verhaal & USP's `[GENERIC]`
> Accept bullets or a voice note; we write the prose. Feeds Over-ons (`CONT-07`).

| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| Het verhaal van Thomas — hoe & waarom begonnen | lange tekst | ✓ | `/over-ons` |
| Opgericht (jaar) | nummer | – | over-ons / stats |
| Jaren ervaring | nummer | – | stats |
| Team (namen / rollen) | lange tekst | – | over-ons |
| USP's — *vooraf: Gecertificeerd · Snel · Persoonlijk · Transparant* (bevestig, herformuleer of vervang) | tekst | – | home/over-ons USP block |
| Bewijs per USP (één regel: waarom waar voor TPS?) | lange tekst | – | USP copy |

### 8. Reviews, social & Google `[GENERIC]`
| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| Google-bedrijfsprofiel: link | tekst (URL) | ✓ | reviews source (`CONT-08`), schema `AggregateRating`, GBP (`SEO-07`) |
| Al een GBP, of mogen wij er één opzetten/beheren? | keuze (Ja, heb ik / Nee / Mogen jullie doen) | – | GBP workstream |
| Mogen we reviews tonen op de site? | ja/nee | ✓ | reviews section (avoids fake-review penalty) |
| Uitgelichte review(s) | lange tekst | – | reviews section |
| Andere review-platforms (Werkspot, Trustpilot…) | tekst | – | reviews |
| Social handles (Instagram / Facebook / LinkedIn) | tekst | – | footer social, schema `sameAs` |

### 9. Foto's & logo `[GENERIC]`
> Real photos are the single biggest content-quality lever — they beat stock everywhere.

| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| Logo (SVG/AI/PDF liefst, anders hoogste-res PNG) | upload | ✓ | `/public/images/`, header/footer, OG |
| Projectfoto's (installaties, aan het werk, voor/na) | upload (multi) | – | service pages, over-ons |
| Portretfoto Thomas / team | upload | – | over-ons |
| Liever via WhatsApp/Drive? Plak hier de link | tekst | – | media channel |

### 10. Tot slot — domein, notificaties & overig `[TPS + ops]`
| Veld | Type | Verpl. | → Code destination |
|---|---|:--:|---|
| Welk domein voor de lancering? | keuze (`tpsventilatie.nl` blijven / `tpsklimaattechniek.nl` overstappen / weet ik niet — bespreken) | ✓ | `metadataBase`, deployment, NAP |
| Bezit u tpsklimaattechniek.nl al? | ja/nee | – | domain workstream |
| Hoe wilt u nieuwe aanvragen ontvangen? | checklist (WhatsApp / SMS / e-mail) | ✓ | GHL workflow (`LEAD-02`) |
| Notificatie-nummer/e-mail (indien afwijkend) | tekst | – | GHL workflow |
| Reactietijd-belofte (voor "we reageren binnen X uur") | tekst | – | site copy |
| Nog iets dat u kwijt wilt? (wensen, voorbeelden, dingen die juist NIET moeten) | lange tekst | – | — |

### Bedankscherm
> Bedankt! We nemen alles rustig door en bespreken het in onze afspraak. Tot snel — team Pushly.

## 5. Tally build checklist (when the MCP is live)

1. **Clone** S&D form `44O4XB` (or build fresh via Tally MCP) → title "TPS klimaattechniek — gegevens & wensen".
2. **Clear** all S&D prefills; **add** the TPS-specific sections (§3 werkgebied, §5 merken-matrix, §6 certificeringen, §10 domein) and swap §4 to the climate taxonomy.
3. Set the prefilled values above as placeholder/help text; mark ✓ fields **Required**.
4. **Access → Password** = `tpsklimaat2026`; enable **save-for-later**, progress bar, Dutch system language. *(These 4 settings hit a Tally MCP response bug on S&D — verify them by hand in Tally Settings, then Publish.)*
5. **Media channel:** rely on Tally upload; add a WhatsApp/Dropbox fallback line in §9.
6. **Thank-you** screen set; **Publish**; send the owner one message (link + password + photo instruction).
7. When responses arrive: map each section to its **→ Code destination** — changes route through GSD (Phase 3 NAP/hours/geo/JSON-LD; Phase 4 content/brands/certs/photos; Phase 5 privacy/notification), not direct edits.

## 6. Reuse — how this feeds the Pushly template

The **GENERIC** sections (1, 2, 7, 8, 9 + welcome/thank-you) are the shared S&D skeleton — identical shape, only prefills differ. The **TPS** sections (3, 4, 5, 6, 10) are installer-specific. To templatize: keep the generic skeleton + ASK-vs-DERIVE split + the "→ Code destination" column pattern; treat the TPS extensions as an "installer/multi-service add-on pack." The destination column is the only stack-specific part.

## 7. Verification vs Shine & Drive (alignment check)

Result: **the GENERIC/TPS split holds.** Shared skeleton matches 1:1; TPS legitimately *extends* it because it's a multi-service, regulated installer (vs a fixed-location garage).

| S&D section | TPS | Note |
|---|---|---|
| 1 Bedrijfsgegevens | §1 | match |
| 2 Openingstijden | §2 | **was missing in v1 — backfilled** |
| 3 Diensten & prijzen | §4 | match (TPS = richer taxonomy) |
| 4 Jouw verhaal | §7 | match |
| 5 Reviews, social & Google | §8 | **social handles were missing in v1 — backfilled** |
| 6 Foto's & logo | §9 | match |
| 7 Nog iets? | §10 (tail) | match |
| — | §3 Werkgebied | TPS-only (radius/regio) |
| — | §5 Merken & dealerstatus | TPS-only (brand gate) |
| — | §6 Certificeringen | TPS-only (regulated-trade gate) |
| — | §10 Domein | TPS-only (open decision) |

Also adopted from S&D: the **ASK-vs-DERIVE** split (don't ask geo — derive from address) and the **"→ Code destination"** column.

## 8. Open items

- [ ] **Load the Tally MCP in-session** — required before building (currently absent here).
- [ ] Tally password: free tier or Pro? (cheap either way; S&D had the same open question).
- [ ] Confirm `tpsklimaat2026` as the password, or pick another.
- [ ] Tone `je` vs `u` for TPS's more premium positioning — defaulted to `je`; trivial to switch.
