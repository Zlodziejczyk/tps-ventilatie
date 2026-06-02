// Warmtepompen pillar + sub-service nodes (taxonomy data layer, plan 01-05).
// Typed against the PageNode union in ./types. All nodes ship status "draft"
// with empty body content (Phase 4 writes the copy); SEO fields carry short
// non-empty placeholders to satisfy the structure-only contentShellSchema.
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

export const WARMTEPOMPEN_PAGES: PageNode[] = [
  {
    type: "pillar",
    pillarSlug: "warmtepompen",
    status: "draft",
    primaryKeyword: "warmtepomp",
    searchIntent: "commercieel",
    secondaryKeywords: ["warmtepomp specialist", "hybride warmtepomp Zoetermeer"],
    navTitle: "Warmtepompen",
    navDescription: "Installatie, onderhoud en reparatie van warmtepompen",
    icon: "heat_pump",
    content: draftShell(
      "Warmtepompen in Zoetermeer",
      "Warmtepomp Zoetermeer | TPS klimaattechniek",
      "Warmtepompen: installatie, onderhoud en reparatie in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "warmtepompen",
    serviceSlug: "installatie",
    status: "draft",
    primaryKeyword: "warmtepomp laten installeren",
    searchIntent: "transactioneel",
    secondaryKeywords: [
      "warmtepomp installatie kosten",
      "warmtepomp installateur",
    ],
    navTitle: "Installatie",
    navDescription: "Warmtepomp laten installeren door een specialist",
    icon: "build",
    brandIds: ["daikin", "mitsubishi-ecodan"],
    content: draftShell(
      "Warmtepomp laten installeren",
      "Warmtepomp laten installeren | TPS klimaattechniek",
      "Laat uw warmtepomp vakkundig installeren door TPS klimaattechniek in de regio Zoetermeer.",
    ),
  },
  {
    type: "service",
    pillarSlug: "warmtepompen",
    serviceSlug: "onderhoud",
    status: "draft",
    primaryKeyword: "warmtepomp onderhoud",
    searchIntent: "commercieel",
    secondaryKeywords: [
      "warmtepomp onderhoud kosten",
      "onderhoudscontract warmtepomp",
    ],
    navTitle: "Onderhoud",
    navDescription: "Periodiek onderhoud voor een efficiënte warmtepomp",
    icon: "cleaning_services",
    content: draftShell(
      "Warmtepomp onderhoud",
      "Warmtepomp onderhoud | TPS klimaattechniek",
      "Periodiek warmtepomp-onderhoud voor optimale prestaties en een langere levensduur.",
    ),
  },
  {
    type: "service",
    pillarSlug: "warmtepompen",
    serviceSlug: "reparatie-storing",
    status: "draft",
    primaryKeyword: "warmtepomp storing",
    searchIntent: "transactioneel",
    secondaryKeywords: ["warmtepomp reparatie", "warmtepomp monteur"],
    navTitle: "Reparatie & storing",
    navDescription: "Snelle hulp bij warmtepompstoringen",
    icon: "handyman",
    content: draftShell(
      "Warmtepomp reparatie en storing",
      "Warmtepomp storing & reparatie | TPS klimaattechniek",
      "Snelle reparatie bij warmtepompstoringen in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "warmtepompen",
    serviceSlug: "advies",
    status: "draft",
    primaryKeyword: "warmtepomp advies regio Den Haag",
    searchIntent: "informationeel",
    secondaryKeywords: ["warmtepomp advies", "welke warmtepomp"],
    navTitle: "Advies",
    navDescription: "Welke warmtepomp past bij uw woning?",
    icon: "support_agent",
    content: draftShell(
      "Warmtepomp advies",
      "Warmtepomp advies regio Den Haag | TPS klimaattechniek",
      "Onafhankelijk advies over de juiste warmtepomp voor uw woning, inclusief ISDE-subsidie.",
    ),
  },
];
