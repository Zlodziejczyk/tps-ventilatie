// PROJECT SHOWCASE DATA — single source for the /projecten page and the
// "Recent geplaatst" strips on pillar pages. Curated from the owner photo set
// of jul 2026 (source originals + index: "iCloud Photos/PHOTOS.md", quick task
// 260719-t62). Anonymity rule (owner decision 2026-07-19): no addresses, no
// customer names, no recognizable personal details in copy or imagery.

export interface ProjectPhoto {
  src: string;
  alt: string;
  orientation: "portrait" | "landscape";
}

export interface Project {
  slug: string;
  title: string;
  period: string; // "juni 2026" — month granularity only (anonymity)
  pillarSlug: "airconditioning" | "warmtepompen" | "wtw" | "mechanische-ventilatie";
  tags: string[];
  summary: string;
  photos: ProjectPhoto[];
}

export const PROJECTS: Project[] = [
  {
    slug: "airco-weggewerkt-in-eikenhout",
    title: "Airco onzichtbaar weggewerkt in eikenhout",
    period: "juni 2026",
    pillarSlug: "airconditioning",
    tags: ["Maatwerk", "Wandunit"],
    summary:
      "In deze hoge woonruimte met vide wilde de bewoner koeling zonder zichtbare techniek. De wandunit is weggewerkt achter een eikenhouten lamellen-omkasting op maat, passend bij de balken en de trap — volledige luchtcirculatie, nauwelijks te zien dat er een airco hangt.",
    photos: [
      {
        src: "/images/projecten/airco-omkasting-eikenhout-vide.jpg",
        alt: "Airco-binnendeel weggewerkt achter een eikenhouten lamellen-omkasting in een woonruimte met vide",
        orientation: "portrait",
      },
      {
        src: "/images/projecten/airco-omkasting-eikenhout-detail.jpg",
        alt: "Close-up van de eikenhouten maatwerk-omkasting rond het airco-binnendeel",
        orientation: "portrait",
      },
    ],
  },
  {
    slug: "matzwarte-multi-split-drie-kamers",
    title: "Matzwarte multi-split door drie kamers",
    period: "juni 2026",
    pillarSlug: "airconditioning",
    tags: ["Toshiba", "Multi-split"],
    summary:
      "Drie slaapkamers gekoeld met matzwarte Toshiba-binnendelen, met zwarte leidinggoten die strak met het interieur meelopen. De twee buitendelen staan samen uit het zicht op de dakkapel, op trillingsdempende voeten.",
    photos: [
      {
        src: "/images/projecten/toshiba-wandunit-zwart-zolder.jpg",
        alt: "Matzwarte Toshiba-wandunit met zwarte leidinggoot op een zolderkamer",
        orientation: "portrait",
      },
      {
        src: "/images/projecten/toshiba-wandunit-zwart-interieur.jpg",
        alt: "Matzwarte Toshiba-wandunit naast industriële hanglampen",
        orientation: "portrait",
      },
      {
        src: "/images/projecten/toshiba-buitendelen-duo-dakkapel.jpg",
        alt: "Twee Toshiba-buitendelen naast elkaar op het platte dak van een dakkapel",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "vloermodel-en-buitendelen-bij-zonnepanelen",
    title: "Vloermodel met buitendelen tussen de zonnepanelen",
    period: "juni 2026",
    pillarSlug: "airconditioning",
    tags: ["Daikin", "Vloermodel"],
    summary:
      "Een Daikin Perfera-vloermodel netjes onder het raam — ideaal waar een wandunit niet past. De buitendelen staan op het platte dak tussen de zonnepanelen, op dempers zonder dakdoorboring.",
    photos: [
      {
        src: "/images/projecten/daikin-perfera-vloermodel-slaapkamer.jpg",
        alt: "Daikin Perfera-vloermodel airco onder een raam in een slaapkamer",
        orientation: "portrait",
      },
      {
        src: "/images/projecten/daikin-buitendelen-plat-dak-zonnepanelen.jpg",
        alt: "Twee Daikin-buitendelen op een plat dak naast zonnepanelen",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "drie-systemen-een-rij",
    title: "Drie systemen, één strakke rij",
    period: "juni 2026",
    pillarSlug: "airconditioning",
    tags: ["Daikin", "Mitsubishi HI"],
    summary:
      "Drie buitendelen — Daikin en Mitsubishi Heavy Industries — broederlijk naast elkaar op het platte dak, elk op eigen dempers met korte, nette leidingroutes. Meerdere merken in één installatie: wij adviseren per ruimte wat het best past.",
    photos: [
      {
        src: "/images/projecten/buitendelen-trio-daikin-mitsubishi.jpg",
        alt: "Drie airco-buitendelen van Daikin en Mitsubishi Heavy Industries op een rij op een plat dak",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "toshiba-daiseikai-duo",
    title: "Toshiba Daiseikai — stil duo aan de gevel",
    period: "juni 2026",
    pillarSlug: "airconditioning",
    tags: ["Toshiba"],
    summary:
      "Twee Toshiba Daiseikai-buitendelen op trillingsdempende voeten, compact opgesteld tegen de witte gevel. De Daiseikai-lijn behoort tot de stilste en zuinigste units die wij plaatsen.",
    photos: [
      {
        src: "/images/projecten/toshiba-daiseikai-buitendelen-duo.jpg",
        alt: "Twee Toshiba Daiseikai-buitendelen op rubberen dempers tegen een witte gevel",
        orientation: "landscape",
      },
    ],
  },
  {
    slug: "mitsubishi-heavy-industries-compleet",
    title: "Mitsubishi Heavy Industries, van dak tot woonkamer",
    period: "juli 2026",
    pillarSlug: "airconditioning",
    tags: ["Mitsubishi HI"],
    summary:
      "Complete installatie met Mitsubishi Heavy Industries: strakke witte wandunit binnen, buitendeel op het dak met volledig ingevulde kenplaat — de koelinstallatie is aantoonbaar volgens de F-gassenregels opgeleverd.",
    photos: [
      {
        src: "/images/projecten/mitsubishi-wandunit-hoek.jpg",
        alt: "Witte Mitsubishi Heavy Industries-wandunit in een hoek bij het raam",
        orientation: "portrait",
      },
      {
        src: "/images/projecten/mitsubishi-buitendeel-dak-closeup.jpg",
        alt: "Mitsubishi Heavy Industries-buitendeel op het dak met ingevulde kenplaat koelinstallatie",
        orientation: "portrait",
      },
      {
        src: "/images/projecten/mitsubishi-buitendeel-terras.jpg",
        alt: "Mitsubishi Heavy Industries-buitendeel op trillingsdempers op een terras",
        orientation: "portrait",
      },
    ],
  },
  {
    slug: "daikin-vloermodel-en-wandunit-in-nis",
    title: "Daikin: vloermodel én wandunit slim in een nis",
    period: "juli 2026",
    pillarSlug: "airconditioning",
    tags: ["Daikin", "Vloermodel"],
    summary:
      "Twee ruimtes, twee oplossingen in één woning: een vloermodel bij de tuindeuren en een wandunit die precies in de nis boven het raam past. De buitendelen staan in een nette rij langs de gevel, weg uit het zicht.",
    photos: [
      {
        src: "/images/projecten/daikin-vloermodel-woonkamer.jpg",
        alt: "Daikin-vloermodel airco naast openslaande tuindeuren in een woonkamer",
        orientation: "portrait",
      },
      {
        src: "/images/projecten/daikin-wandunit-nis.jpg",
        alt: "Daikin-wandunit geplaatst in een nis boven het raam",
        orientation: "portrait",
      },
      {
        src: "/images/projecten/daikin-buitendelen-rij-gevel.jpg",
        alt: "Twee Daikin-buitendelen op een rij langs de gevel met nette leidinggoten",
        orientation: "portrait",
      },
    ],
  },
];

// Curated 4-photo strip for the airconditioning pillar page ("Recent geplaatst").
// Mix of binnen/buiten; all cleared for publication (see PHOTOS.md privacy flags).
export const RECENT_WORK_PHOTOS: ProjectPhoto[] = [
  {
    src: "/images/projecten/toshiba-wandunit-zwart-zolder.jpg",
    alt: "Matzwarte Toshiba-wandunit op een zolderkamer",
    orientation: "portrait",
  },
  {
    src: "/images/projecten/daikin-vloermodel-woonkamer.jpg",
    alt: "Daikin-vloermodel airco bij de tuindeuren",
    orientation: "portrait",
  },
  {
    src: "/images/projecten/daikin-buitendeel-plat-dak-grind.jpg",
    alt: "Daikin-buitendeel op een grinddak met nette leidinggoot",
    orientation: "landscape",
  },
  {
    src: "/images/projecten/daikin-buitendelen-rij-gevel.jpg",
    alt: "Twee Daikin-buitendelen op een rij langs de gevel",
    orientation: "portrait",
  },
];
