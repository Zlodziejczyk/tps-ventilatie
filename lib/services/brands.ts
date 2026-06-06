// Normalized brand registry (D-06). Each brand lives ONCE here and is
// referenced by service nodes via `brandIds` (e.g. Daikin is referenced by both
// the airconditioning and the warmtepompen `installatie` nodes — the concrete
// reason to normalize). Phase 2's BrandGrid resolves id -> data.
//
// owner-verify-pending: `erkendInstallateur` is `false` for every brand as a
// placeholder. NEVER render a dealer / authorised-installer status claim until the
// owner verifies it in Phase 4 (D-06 / CONT-03). The `blurb` fields are filled as
// forward-compatible install-context DATA (04-07): BrandGrid renders brand NAMES
// only, so blurbs do not display yet — brand install CONTENT already reaches
// visitors via the Installatie node intros (04-03/04-04). Logos stay placeholder
// paths; real official SVGs arrive via owner intake §9 / Phase 6 (never aggregator
// logos, D-19). Naming a product TPS installs is fine; a dealer-status claim is not.

export const BRANDS = {
  daikin: {
    id: "daikin",
    name: "Daikin",
    logo: "/images/brands/daikin.svg",
    blurb:
      "Daikin is wereldwijd marktleider in airconditioning en warmtepompen. Wij installeren Daikin-systemen om hun betrouwbaarheid, stille werking en hoge rendement.",
    erkendInstallateur: false,
  },
  "mitsubishi-electric": {
    id: "mitsubishi-electric",
    name: "Mitsubishi Electric",
    logo: "/images/brands/mitsubishi-electric.svg",
    blurb:
      "Mitsubishi Electric staat bekend om degelijke, energiezuinige airco- en klimaatsystemen. Wij installeren hun units voor woning en bedrijf.",
    erkendInstallateur: false,
  },
  "mitsubishi-heavy": {
    id: "mitsubishi-heavy",
    name: "Mitsubishi Heavy Industries",
    logo: "/images/brands/mitsubishi-heavy.svg",
    blurb:
      "Mitsubishi Heavy Industries levert robuuste airconditioning met een sterke prijs-kwaliteitverhouding. Wij installeren deze systemen op maat voor uw situatie.",
    erkendInstallateur: false,
  },
  "mitsubishi-ecodan": {
    id: "mitsubishi-ecodan",
    name: "Mitsubishi Ecodan",
    logo: "/images/brands/mitsubishi-ecodan.svg",
    blurb:
      "Mitsubishi Ecodan is de lucht-water warmtepomplijn van Mitsubishi Electric. Wij installeren Ecodan-warmtepompen voor duurzame, efficiënte verwarming.",
    erkendInstallateur: false,
  },
} as const;

export type BrandId = keyof typeof BRANDS;
