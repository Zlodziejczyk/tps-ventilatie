// TAXONOMY REGISTRY — the single source of truth for the full routable surface.
//
// NO-BARREL EXCEPTION (D-05): this file is NOT a generic re-export barrel. It is
// a JUSTIFIED aggregation module — it assembles the unified `PAGES` array, is the
// sole place hrefs are built (`urlFor`), provides lookups, and runs taxonomy
// validation. It deliberately does NOT re-export the pillar files wholesale;
// only `PAGES`, `urlFor`, the lookups, and `validateTaxonomy` are exported.
//
// `urlFor` delegates to the `canonicalPath` primitive in ./types (the same
// function the Zod uniqueness schema uses), so URL derivation has exactly ONE
// implementation — the schema's view of a node's URL and the app's can never
// drift. canonicalPath is the exhaustive switch enforcing D-03 (lowercase,
// leading slash, no trailing slash); scripts/assert-registry.ts still asserts
// urlFor(node) === canonicalPath(node) for every node as a regression guard.

import {
  canonicalPath,
  pagesSchema,
  type PageNode,
  type PageType,
  type PillarPage,
  type ServicePage,
} from "./types";
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
    // "TPS klimaattechniek" is over-ons's primaryKeyword — keep it off home's
    // secondaries so the two pages don't compete for the brand term (WR-02).
    secondaryKeywords: ["klimaattechniek", "klimaatinstallateur Zoetermeer"],
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

// The ONLY public href builder. Delegates to the canonicalPath primitive in
// ./types so URL logic lives in exactly one place (enforcing D-03: lowercase,
// leading slash, no trailing slash). Nav, sitemap, and JSON-LD all call this.
export function urlFor(node: PageNode): string {
  return canonicalPath(node);
}

// Small pure lookups (kept tiny, in the getInitials/lerp style).
export function findByType(type: PageType): PageNode[] {
  return PAGES.filter((node) => node.type === type);
}

export function findBySlug(url: string): PageNode | undefined {
  return PAGES.find((node) => urlFor(node) === url);
}

// ── Phase 2 taxonomy lookups + render helpers (D-14). Pure, typed against the
//    ./types union, narrowed via type-guard predicates (no `as` casts). Every
//    href delegates to urlFor — the sole href builder (P1 D-03). The render
//    layer (routes, the 6 IA-05 components, the taxonomy-derived nav) reads
//    these so taxonomy traversal is never re-implemented downstream. Kept here
//    under the same no-barrel justification as the lookups above. ──

// The 4 pillar pages, in registry order.
export function pillars(): PillarPage[] {
  return PAGES.filter((node): node is PillarPage => node.type === "pillar");
}

// A pillar by its slug.
export function findPillar(pillarSlug: string): PillarPage | undefined {
  return pillars().find((p) => p.pillarSlug === pillarSlug);
}

// The sub-services of one pillar, in registry order.
export function childrenOf(pillarSlug: string): ServicePage[] {
  return PAGES.filter(
    (node): node is ServicePage =>
      node.type === "service" && node.pillarSlug === pillarSlug,
  );
}

// A specific sub-service within a pillar.
export function findService(
  pillarSlug: string,
  serviceSlug: string,
): ServicePage | undefined {
  return childrenOf(pillarSlug).find((s) => s.serviceSlug === serviceSlug);
}

// Same-pillar siblings of a sub-service, excluding the node itself (D-11).
export function siblingsOf(
  pillarSlug: string,
  serviceSlug: string,
): ServicePage[] {
  return childrenOf(pillarSlug).filter((s) => s.serviceSlug !== serviceSlug);
}

// Order-stable, de-duplicated union of the brandIds across a pillar's children
// (drives the pillar-page BrandGrid, D-02). Pillars whose children carry no
// brands (wtw, mechanische-ventilatie) return an empty array.
export function brandsForPillar(pillarSlug: string): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const service of childrenOf(pillarSlug)) {
    for (const id of service.brandIds ?? []) {
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
  }
  return ids;
}

// A single breadcrumb: a visible label + the href urlFor produced for its node.
export interface Crumb {
  label: string;
  href: string;
}

// The breadcrumb trail for a node: Home → Diensten → [pillar] → [node]. Every
// href delegates to urlFor (the sole builder), so Phase 3 reuses this exact
// shape for BreadcrumbList JSON-LD (D-13). A hub node's trail is Home + Diensten
// only; a pillar adds its own crumb; a service resolves its pillar crumb first.
export function trailFor(node: PageNode): Crumb[] {
  const trail: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Diensten", href: "/diensten" },
  ];
  if (node.type === "pillar") {
    trail.push({ label: node.navTitle, href: urlFor(node) });
  } else if (node.type === "service") {
    const pillar = findPillar(node.pillarSlug);
    if (pillar) {
      trail.push({ label: pillar.navTitle, href: urlFor(pillar) });
    }
    trail.push({ label: node.navTitle, href: urlFor(node) });
  }
  return trail;
}

// Maps a pillar slug to its PricingTabs tab id, or null when the pillar has no
// pricing tab. Warmtepompen pricing is "op maat via offerte" — no tab exists
// (RESEARCH §5), so the template links to /contact instead of a dead tab.
export function pillarTarievenTab(pillarSlug: string): string | null {
  switch (pillarSlug) {
    case "airconditioning":
      return "airco";
    case "wtw":
      return "wtw";
    case "mechanische-ventilatie":
      return "mv";
    default:
      return null; // warmtepompen (and any unknown slug) → no tarieven tab
  }
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
