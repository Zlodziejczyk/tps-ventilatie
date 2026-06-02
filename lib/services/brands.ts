// Normalized brand registry (D-06). Each brand lives ONCE here and is
// referenced by service nodes via `brandIds` (e.g. Daikin is referenced by both
// the airconditioning and the warmtepompen `installatie` nodes — the concrete
// reason to normalize). Phase 2's BrandGrid resolves id -> data.
//
// owner-verify-pending: `erkendInstallateur` is `false` for every brand as a
// placeholder. NEVER render an "erkend installateur" / dealer claim until the
// owner verifies real dealer status in Phase 4 (D-06 / CONT-03). Logos are
// placeholder paths; real SVG assets are a Phase 2 concern.

export const BRANDS = {
  daikin: {
    id: "daikin",
    name: "Daikin",
    logo: "/images/brands/daikin.svg",
    blurb: "",
    erkendInstallateur: false,
  },
  "mitsubishi-electric": {
    id: "mitsubishi-electric",
    name: "Mitsubishi Electric",
    logo: "/images/brands/mitsubishi-electric.svg",
    blurb: "",
    erkendInstallateur: false,
  },
  "mitsubishi-heavy": {
    id: "mitsubishi-heavy",
    name: "Mitsubishi Heavy Industries",
    logo: "/images/brands/mitsubishi-heavy.svg",
    blurb: "",
    erkendInstallateur: false,
  },
  "mitsubishi-ecodan": {
    id: "mitsubishi-ecodan",
    name: "Mitsubishi Ecodan",
    logo: "/images/brands/mitsubishi-ecodan.svg",
    blurb: "",
    erkendInstallateur: false,
  },
} as const;

export type BrandId = keyof typeof BRANDS;
