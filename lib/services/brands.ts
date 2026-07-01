// Normalized brand registry (D-06). Each brand lives ONCE here and is
// referenced by service nodes via `brandIds` (e.g. Daikin is referenced by both
// the airconditioning and the warmtepompen `installatie` nodes — the concrete
// reason to normalize). Phase 2's BrandGrid resolves id -> data.
//
// owner-verified (2026-06-28, intake §5): Thomas attested "erkend installateur" for
// all four brands; Pushly editorial sign-off authorises display (physical certificates
// held on-site — the D-12 upload requirement is waived by the owner). Each brand's
// `erkendInstallateur` is therefore `true`, and BrandGrid renders the verified
// "Erkend installateur" badge. The `blurb` fields are forward-compatible install-context
// DATA (04-07); brand install CONTENT also reaches visitors via the Installatie node
// intros (04-03/04-04). Logos stay placeholder paths; real official SVGs arrive via
// owner intake §9 / Phase 6 (never aggregator logos, D-19).

export const BRANDS = {
  daikin: {
    id: "daikin",
    name: "Daikin",
    logo: "/images/brands/daikin.svg",
    blurb:
      "Daikin is wereldwijd marktleider in airconditioning en warmtepompen. Wij installeren Daikin-systemen om hun betrouwbaarheid, stille werking en hoge rendement.",
    erkendInstallateur: true,
  },
  "mitsubishi-electric": {
    id: "mitsubishi-electric",
    name: "Mitsubishi Electric",
    logo: "/images/brands/mitsubishi-electric.svg",
    blurb:
      "Mitsubishi Electric staat bekend om degelijke, energiezuinige airco- en klimaatsystemen. Wij installeren hun units voor woning en bedrijf.",
    erkendInstallateur: true,
  },
  "mitsubishi-heavy": {
    id: "mitsubishi-heavy",
    name: "Mitsubishi Heavy Industries",
    logo: "/images/brands/mitsubishi-heavy.svg",
    blurb:
      "Mitsubishi Heavy Industries levert robuuste airconditioning met een sterke prijs-kwaliteitverhouding. Wij installeren deze systemen op maat voor uw situatie.",
    erkendInstallateur: true,
  },
  "mitsubishi-ecodan": {
    id: "mitsubishi-ecodan",
    name: "Mitsubishi Ecodan",
    logo: "/images/brands/mitsubishi-ecodan.svg",
    blurb:
      "Mitsubishi Ecodan is de lucht-water warmtepomplijn van Mitsubishi Electric. Wij installeren Ecodan-warmtepompen voor duurzame, efficiënte verwarming.",
    erkendInstallateur: true,
  },
} as const;

export type BrandId = keyof typeof BRANDS;

// Shared brand-mark hex map (D-12). Extracted from BrandGrid so the Wave-2
// PillarGrid brand chips can import the same source instead of duplicating it.
// Keyed by the same brand ids as BRANDS. Additive — does not alter BRANDS shape
// or BrandId, so the prebuild taxonomy gate stays green.
export const BRAND_COLOR: Record<string, string> = {
  daikin: "#0086C9",
  "mitsubishi-electric": "#E60012",
  "mitsubishi-heavy": "#003F87",
  "mitsubishi-ecodan": "#E60012",
};
