// WTW (warmteterugwinning) pillar + sub-service nodes (taxonomy data layer,
// plan 01-05). Typed against the PageNode union in ./types. Pillar slug stays
// lowercase "wtw" (D-02). All nodes ship status "draft" with empty body content
// (Phase 4 writes the copy); SEO fields carry short non-empty placeholders to
// satisfy the structure-only contentShellSchema. WTW sub-services reference no
// brands.
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

export const WTW_PAGES: PageNode[] = [
  {
    type: "pillar",
    pillarSlug: "wtw",
    status: "draft",
    primaryKeyword: "wtw unit",
    searchIntent: "commercieel",
    secondaryKeywords: ["warmteterugwinning", "wtw ventilatie"],
    navTitle: "WTW Unit",
    navDescription: "Vervanging, onderhoud en installatie van warmteterugwinunits",
    icon: "hvac",
    content: draftShell(
      "WTW units in Zoetermeer",
      "WTW unit Zoetermeer | TPS klimaattechniek",
      "WTW units: vervangen, onderhoud, inregelen en aanleggen in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "vervangen",
    status: "draft",
    primaryKeyword: "wtw-unit vervangen",
    searchIntent: "transactioneel",
    secondaryKeywords: ["wtw unit vervangen kosten", "wtw vervangen Zoetermeer"],
    navTitle: "Vervangen",
    navDescription: "WTW-unit vervangen door een nieuw, zuinig systeem",
    icon: "swap_horiz",
    content: draftShell(
      "WTW-unit vervangen",
      "WTW-unit vervangen | TPS klimaattechniek",
      "Uw WTW-unit vervangen door een efficiënter systeem in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "onderhoud-reinigen",
    status: "draft",
    primaryKeyword: "wtw onderhoud",
    searchIntent: "commercieel",
    secondaryKeywords: ["wtw reinigen", "wtw filter vervangen"],
    navTitle: "Onderhoud & reinigen",
    navDescription: "Filters reinigen en kanalen schoonhouden",
    icon: "cleaning_services",
    content: draftShell(
      "WTW onderhoud en reinigen",
      "WTW onderhoud | TPS klimaattechniek",
      "WTW-onderhoud: filters reinigen en kanalen schoonhouden voor gezonde lucht.",
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "inregelen",
    status: "draft",
    primaryKeyword: "wtw inregelen",
    searchIntent: "informationeel",
    secondaryKeywords: ["wtw inregelen meetrapport", "ventielen inregelen"],
    navTitle: "Inregelen",
    navDescription: "Ventielen inregelen met meetrapport",
    icon: "tune",
    content: draftShell(
      "WTW inregelen",
      "WTW inregelen | TPS klimaattechniek",
      "WTW-systeem laten inregelen met meetrapport voor een correcte luchtbalans.",
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "storing",
    status: "draft",
    primaryKeyword: "wtw storing",
    searchIntent: "transactioneel",
    secondaryKeywords: ["wtw unit maakt lawaai", "wtw storing verhelpen"],
    navTitle: "Storing",
    navDescription: "Snelle hulp bij WTW-storingen en lawaai",
    icon: "handyman",
    content: draftShell(
      "WTW storing verhelpen",
      "WTW storing | TPS klimaattechniek",
      "Snelle hulp bij WTW-storingen en lawaai in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "aanleggen",
    status: "draft",
    primaryKeyword: "wtw unit aanleggen",
    searchIntent: "transactioneel",
    secondaryKeywords: ["wtw installeren nieuwbouw", "balansventilatie aanleggen"],
    navTitle: "Aanleggen",
    navDescription: "Nieuwe WTW-installatie voor nieuwbouw of renovatie",
    icon: "add_circle",
    content: draftShell(
      "WTW unit aanleggen",
      "WTW unit aanleggen | TPS klimaattechniek",
      "Een nieuwe WTW-installatie aanleggen bij nieuwbouw of renovatie.",
    ),
  },
];
