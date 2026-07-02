// Normalized brand registry (D-06). Each brand lives ONCE here and is
// referenced by service nodes via `brandIds` (e.g. Daikin is referenced by both
// the airconditioning and the warmtepompen `installatie` nodes — the concrete
// reason to normalize). Phase 2's BrandGrid resolves id -> data.
//
// owner-verified (2026-06-28, intake §5): Thomas attested "erkend installateur" for
// the four airco/warmtepomp brands (Daikin + Mitsubishi ×3); Pushly editorial sign-off
// authorises display (physical certificates held on-site — the D-12 upload requirement
// is waived by the owner). Those four carry `erkendInstallateur: true` and BrandGrid
// renders the verified "Erkend installateur" badge.
//
// owner-provided (2026-07-02): the WTW/MV brands Thomas installs — Zehnder (his
// preferred/main), Duco, and Itho Daalderop (the budget option). He listed these as
// brands he INSTALLS, not as attested erkend-installateur/dealer status, so they carry
// `erkendInstallateur: false` (no verified badge — no over-claim). WTW = Zehnder, Duco,
// Itho; MV = Zehnder, Duco.
//
// The `blurb` fields are forward-compatible install-context DATA (04-07); brand install
// CONTENT also reaches visitors via the Installatie node intros (04-03/04-04). Logos stay
// placeholder paths and BRAND_COLOR hexes are approximate brand tints; real official SVGs
// + exact brand colors arrive via owner intake (never aggregator logos, D-19).

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
  zehnder: {
    id: "zehnder",
    name: "Zehnder",
    logo: "/images/brands/zehnder.svg",
    blurb:
      "Zehnder is een toonaangevende fabrikant van warmteterugwinning (WTW) en ventilatie. Wij installeren Zehnder-systemen om hun hoge rendement, stille werking en betrouwbaarheid.",
    erkendInstallateur: false,
  },
  duco: {
    id: "duco",
    name: "Duco",
    logo: "/images/brands/duco.svg",
    blurb:
      "Duco levert vraaggestuurde ventilatie- en warmteterugwinsystemen. Wij installeren Duco-oplossingen voor een gezond binnenklimaat op maat van uw woning.",
    erkendInstallateur: false,
  },
  "itho-daalderop": {
    id: "itho-daalderop",
    name: "Itho Daalderop",
    logo: "/images/brands/itho-daalderop.svg",
    blurb:
      "Itho Daalderop is een bekende Nederlandse fabrikant van ventilatie- en WTW-systemen. Wij installeren Itho-units als betrouwbare, prijsbewuste keuze.",
    erkendInstallateur: false,
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
  // WTW/MV brands (2026-07-02) — approximate brand tints, refine when official assets land.
  zehnder: "#E2001A",
  duco: "#57A639",
  "itho-daalderop": "#C8102E",
};
