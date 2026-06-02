// Airconditioning pillar + sub-service nodes (taxonomy data layer, plan 01-05).
// Typed against the PageNode union in ./types. All nodes ship status "draft"
// with empty body content (Phase 4 writes the copy); SEO h1/metaTitle/
// metaDescription carry short non-empty placeholders to satisfy the
// structure-only contentShellSchema.
//
// [ASSUMED] every primaryKeyword/secondaryKeyword is a defensible starting
// assignment from RESEARCH §Keyword Map, pending validation in a keyword tool
// (Google Keyword Planner / Ahrefs) before Phase 4 locks content (A1).

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

export const AIRCONDITIONING_PAGES: PageNode[] = [
  {
    type: "pillar",
    pillarSlug: "airconditioning",
    status: "draft",
    primaryKeyword: "airconditioning",
    searchIntent: "commercieel",
    secondaryKeywords: ["airco specialist Zoetermeer", "airco regio Den Haag"],
    navTitle: "Airconditioning",
    navDescription: "Installatie, onderhoud en reparatie van aircosystemen",
    icon: "ac_unit",
    content: draftShell(
      "Airconditioning in Zoetermeer",
      "Airconditioning Zoetermeer | TPS klimaattechniek",
      "Airconditioning: installatie, onderhoud en reparatie in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "airconditioning",
    serviceSlug: "installatie",
    status: "draft",
    primaryKeyword: "airco laten installeren",
    searchIntent: "transactioneel",
    secondaryKeywords: [
      "airco installatie kosten",
      "airco laten plaatsen Zoetermeer",
    ],
    navTitle: "Installatie",
    navDescription: "Airco laten installeren door een specialist",
    icon: "build",
    brandIds: ["daikin", "mitsubishi-electric", "mitsubishi-heavy"],
    content: draftShell(
      "Airco laten installeren",
      "Airco laten installeren | TPS klimaattechniek",
      "Laat uw airco vakkundig installeren door TPS klimaattechniek in de regio Zoetermeer.",
    ),
  },
  {
    type: "service",
    pillarSlug: "airconditioning",
    serviceSlug: "onderhoud",
    status: "draft",
    primaryKeyword: "airco onderhoud",
    searchIntent: "commercieel",
    secondaryKeywords: ["airco onderhoud kosten", "airco service"],
    navTitle: "Onderhoud",
    navDescription: "Periodiek onderhoud voor een efficiënte airco",
    icon: "cleaning_services",
    content: draftShell(
      "Airco onderhoud",
      "Airco onderhoud | TPS klimaattechniek",
      "Periodiek airco-onderhoud voor optimale prestaties en een langere levensduur.",
    ),
  },
  {
    type: "service",
    pillarSlug: "airconditioning",
    serviceSlug: "reparatie-storing",
    status: "draft",
    primaryKeyword: "airco storing",
    searchIntent: "transactioneel",
    secondaryKeywords: ["airco reparatie", "airco monteur spoed"],
    navTitle: "Reparatie & storing",
    navDescription: "Snelle hulp bij aircostoringen",
    icon: "handyman",
    content: draftShell(
      "Airco reparatie en storing",
      "Airco storing & reparatie | TPS klimaattechniek",
      "Snelle reparatie bij aircostoringen in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "airconditioning",
    serviceSlug: "advies",
    status: "draft",
    primaryKeyword: "airco advies Zoetermeer",
    searchIntent: "informationeel",
    secondaryKeywords: ["welke airco kiezen", "airco of warmtepomp"],
    navTitle: "Advies",
    navDescription: "Welke airco past bij uw situatie?",
    icon: "support_agent",
    content: draftShell(
      "Airco advies",
      "Airco advies Zoetermeer | TPS klimaattechniek",
      "Onafhankelijk advies over de juiste airco voor uw woning of bedrijf.",
    ),
  },
];
