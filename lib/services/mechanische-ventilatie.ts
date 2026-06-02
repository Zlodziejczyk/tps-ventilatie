// Mechanische ventilatie (MV) pillar + sub-service nodes (taxonomy data layer,
// plan 01-05). Typed against the PageNode union in ./types. All nodes ship
// status "draft" with empty body content (Phase 4 writes the copy); SEO fields
// carry short non-empty placeholders to satisfy the structure-only
// contentShellSchema. MV sub-services reference no brands.
//
// [ASSUMED] keyword strings are defensible starting assignments from RESEARCH
// §Keyword Map, pending validation in a keyword tool before Phase 4 (A1).

import type { ContentShell, PageNode } from "./types";

function draftShell(
  h1: string,
  metaTitle: string,
  metaDescription: string,
): ContentShell {
  return {
    h1,
    intro: "",
    steps: [],
    faqs: [],
    localAngle: "",
    metaTitle,
    metaDescription,
  };
}

export const MECHANISCHE_VENTILATIE_PAGES: PageNode[] = [
  {
    type: "pillar",
    pillarSlug: "mechanische-ventilatie",
    status: "draft",
    primaryKeyword: "mechanische ventilatie",
    searchIntent: "commercieel",
    secondaryKeywords: ["mv ventilatie", "ventilatiesysteem woning"],
    navTitle: "Mechanische Ventilatie",
    navDescription: "Vervanging, onderhoud en aanleg van ventilatiesystemen",
    icon: "air",
    content: draftShell(
      "Mechanische ventilatie in Zoetermeer",
      "Mechanische ventilatie Zoetermeer | TPS klimaattechniek",
      "Mechanische ventilatie: vervangen, onderhoud, storing en aanleggen in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "mechanische-ventilatie",
    serviceSlug: "vervangen",
    status: "draft",
    primaryKeyword: "mechanische ventilatie vervangen",
    searchIntent: "transactioneel",
    secondaryKeywords: ["ventilatiebox vervangen", "mv box vervangen"],
    navTitle: "Vervangen",
    navDescription: "Ventilatiebox vervangen door een zuinig systeem",
    icon: "swap_horiz",
    content: draftShell(
      "Mechanische ventilatie vervangen",
      "Ventilatiebox vervangen | TPS klimaattechniek",
      "Uw ventilatiebox vervangen door een zuiniger systeem in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "mechanische-ventilatie",
    serviceSlug: "onderhoud-reinigen",
    status: "draft",
    primaryKeyword: "mechanische ventilatie onderhoud",
    searchIntent: "commercieel",
    secondaryKeywords: ["ventilatiekanalen reinigen", "mv onderhoud"],
    navTitle: "Onderhoud & reinigen",
    navDescription: "Ventilatiekanalen reinigen en onderhouden",
    icon: "cleaning_services",
    content: draftShell(
      "Mechanische ventilatie onderhoud en reinigen",
      "Mechanische ventilatie onderhoud | TPS klimaattechniek",
      "Ventilatiekanalen reinigen en onderhouden voor gezonde lucht in huis.",
    ),
  },
  {
    type: "service",
    pillarSlug: "mechanische-ventilatie",
    serviceSlug: "storing",
    status: "draft",
    primaryKeyword: "mechanische ventilatie storing",
    searchIntent: "transactioneel",
    secondaryKeywords: ["ventilatie maakt lawaai", "mv storing verhelpen"],
    navTitle: "Storing",
    navDescription: "Snelle hulp bij ventilatiestoringen en lawaai",
    icon: "handyman",
    content: draftShell(
      "Mechanische ventilatie storing verhelpen",
      "Mechanische ventilatie storing | TPS klimaattechniek",
      "Snelle hulp bij ventilatiestoringen en lawaai in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "mechanische-ventilatie",
    serviceSlug: "aanleggen",
    status: "draft",
    primaryKeyword: "mechanische ventilatie aanleggen",
    searchIntent: "transactioneel",
    secondaryKeywords: ["ventilatiesysteem aanleggen", "mv installeren"],
    navTitle: "Aanleggen",
    navDescription: "Nieuw ventilatiesysteem voor nieuwbouw of renovatie",
    icon: "add_circle",
    content: draftShell(
      "Mechanische ventilatie aanleggen",
      "Mechanische ventilatie aanleggen | TPS klimaattechniek",
      "Een nieuw mechanisch ventilatiesysteem aanleggen bij nieuwbouw of renovatie.",
    ),
  },
];
