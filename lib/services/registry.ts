// TAXONOMY REGISTRY — the single source of truth for the full routable surface.
//
// NO-BARREL EXCEPTION (D-05): this file is NOT a generic re-export barrel. It is
// a JUSTIFIED aggregation module — it assembles the unified `PAGES` array, is the
// sole place hrefs are built (`urlFor`), provides lookups, and runs taxonomy
// validation. It deliberately does NOT re-export the pillar files wholesale;
// only `PAGES`, `urlFor`, the lookups, and `validateTaxonomy` are exported.
//
// `urlFor` mirrors `canonicalPath` in ./types (the primitive the Zod uniqueness
// schema uses). Both are exhaustive switches enforcing D-03 (lowercase, leading
// slash, no trailing slash); scripts/assert-registry.ts asserts they agree for
// every node, so the two cannot drift.

import { pagesSchema, type PageNode, type PageType } from "./types";
import { AIRCONDITIONING_PAGES } from "./airconditioning";
import { WARMTEPOMPEN_PAGES } from "./warmtepompen";
import { WTW_PAGES } from "./wtw";
import { MECHANISCHE_VENTILATIE_PAGES } from "./mechanische-ventilatie";

function draftShell(
  h1: string,
  metaTitle: string,
  metaDescription: string,
): PageNode["content"] {
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

// Hub node — the /diensten umbrella. Its head term is intentionally broad so it
// never competes with a specific pillar/sub.
const HUB_PAGE: PageNode = {
  type: "hub",
  segment: "diensten",
  status: "draft",
  primaryKeyword: "klimaattechniek Zoetermeer",
  searchIntent: "commercieel",
  secondaryKeywords: ["klimaatbeheersing", "airco warmtepomp ventilatie"],
  navTitle: "Diensten",
  navDescription: "Airconditioning, warmtepompen en ventilatie",
  icon: "home_repair_service",
  content: draftShell(
    "Onze diensten",
    "Klimaattechniek Zoetermeer | TPS klimaattechniek",
    "Airconditioning, warmtepompen en ventilatie in Zoetermeer en omgeving.",
  ),
};

// Static pages (modeled per D-04). Home takes a brand+region head term DISTINCT
// from the hub's umbrella head term (RESEARCH Open-Q 2 — avoids a duplicate-
// keyword build error). privacy-beleid is a noindex candidate; Phase 3 decides
// indexing.
const STATIC_PAGES: PageNode[] = [
  {
    type: "static",
    pathSegment: "",
    status: "draft",
    primaryKeyword: "airco warmtepomp ventilatie Zoetermeer",
    searchIntent: "commercieel",
    secondaryKeywords: ["klimaattechniek", "TPS klimaattechniek"],
    navTitle: "Home",
    navDescription: "TPS klimaattechniek — specialist in schone lucht",
    icon: "home",
    content: draftShell(
      "TPS klimaattechniek",
      "TPS klimaattechniek | Airco, warmtepomp & ventilatie Zoetermeer",
      "Specialist in airconditioning, warmtepompen en ventilatie in Zoetermeer en omgeving.",
    ),
  },
  {
    type: "static",
    pathSegment: "tarieven",
    status: "draft",
    primaryKeyword: "ventilatie tarieven",
    searchIntent: "commercieel",
    secondaryKeywords: ["airco onderhoud prijs", "airco tarieven"],
    navTitle: "Tarieven",
    navDescription: "Transparante prijzen, inclusief BTW en voorrijkosten",
    icon: "request_quote",
    content: draftShell(
      "Onze tarieven",
      "Tarieven | TPS klimaattechniek",
      "Transparante prijzen voor ventilatie en airconditioning — inclusief BTW en voorrijkosten.",
    ),
  },
  {
    type: "static",
    pathSegment: "over-ons",
    status: "draft",
    primaryKeyword: "TPS klimaattechniek",
    searchIntent: "navigationeel",
    navTitle: "Over Ons",
    navDescription: "Het verhaal achter TPS klimaattechniek",
    icon: "groups",
    content: draftShell(
      "Over TPS klimaattechniek",
      "Over ons | TPS klimaattechniek",
      "Maak kennis met TPS klimaattechniek, uw specialist in schone lucht.",
    ),
  },
  {
    type: "static",
    pathSegment: "contact",
    status: "draft",
    primaryKeyword: "TPS klimaattechniek contact",
    searchIntent: "navigationeel",
    navTitle: "Contact",
    navDescription: "Neem contact op voor advies of een offerte",
    icon: "mail",
    content: draftShell(
      "Contact",
      "Contact | TPS klimaattechniek",
      "Neem contact op met TPS klimaattechniek voor advies of een vrijblijvende offerte.",
    ),
  },
  {
    type: "static",
    pathSegment: "privacy-beleid",
    status: "draft",
    primaryKeyword: "privacybeleid TPS klimaattechniek",
    searchIntent: "navigationeel",
    navTitle: "Privacybeleid",
    navDescription: "Hoe wij met uw gegevens omgaan",
    icon: "policy",
    content: draftShell(
      "Privacybeleid",
      "Privacybeleid | TPS klimaattechniek",
      "Lees hoe TPS klimaattechniek met uw persoonsgegevens omgaat.",
    ),
  },
];

// THE single source of truth — every routable page (1 hub + 4 pillars + 17 subs
// + 5 static = 27). Nav, sitemap, and JSON-LD all read this one array (IA-01).
export const PAGES: PageNode[] = [
  HUB_PAGE,
  ...AIRCONDITIONING_PAGES,
  ...WARMTEPOMPEN_PAGES,
  ...WTW_PAGES,
  ...MECHANISCHE_VENTILATIE_PAGES,
  ...STATIC_PAGES,
];

// The ONLY href builder. Exhaustive switch over the discriminant; enforces D-03
// (lowercase, leading slash, no trailing slash). Mirrors ./types canonicalPath.
export function urlFor(node: PageNode): string {
  switch (node.type) {
    case "hub":
      return `/${node.segment}`;
    case "pillar":
      return `/diensten/${node.pillarSlug}`;
    case "service":
      return `/diensten/${node.pillarSlug}/${node.serviceSlug}`;
    case "static":
      return node.pathSegment === "" ? "/" : `/${node.pathSegment}`;
  }
}

// Small pure lookups (kept tiny, in the getInitials/lerp style).
export function findByType(type: PageType): PageNode[] {
  return PAGES.filter((node) => node.type === type);
}

export function findBySlug(url: string): PageNode | undefined {
  return PAGES.find((node) => urlFor(node) === url);
}

// Validate the taxonomy WITHOUT throwing — returns the project ok-result
// convention (mirrors lib/forms.ts). The 01-06 prebuild script owns process.exit.
// The error type is derived from safeParse so it tracks Zod's own type exactly.
type TaxonomyError = Extract<
  ReturnType<typeof pagesSchema.safeParse>,
  { success: false }
>["error"];

export type TaxonomyValidation =
  | { ok: true }
  | { ok: false; error: TaxonomyError };

export function validateTaxonomy(pages: PageNode[] = PAGES): TaxonomyValidation {
  const result = pagesSchema.safeParse(pages);
  if (result.success) {
    return { ok: true };
  }
  return { ok: false, error: result.error };
}
