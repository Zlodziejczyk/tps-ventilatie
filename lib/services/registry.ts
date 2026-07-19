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
  type FaqItem,
  type PageNode,
  type PageType,
  type PillarPage,
  type ServicePage,
  type StepItem,
} from "./types";
import { AIRCONDITIONING_PAGES } from "./airconditioning";
import { WARMTEPOMPEN_PAGES } from "./warmtepompen";
import { WTW_PAGES } from "./wtw";
import { MECHANISCHE_VENTILATIE_PAGES } from "./mechanische-ventilatie";

function draftShell(
  h1: string,
  metaTitle: string,
  metaDescription: string,
  extra?: {
    intro?: string;
    steps?: StepItem[];
    faqs?: FaqItem[];
    localAngle?: string;
  },
): PageNode["content"] {
  return {
    h1,
    intro: extra?.intro ?? "",
    steps: extra?.steps ?? [],
    faqs: extra?.faqs ?? [],
    localAngle: extra?.localAngle ?? "",
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
    // Pricing transparency copy (CONT-05 / D-11). The actual price numbers live in
    // components/PricingTabs.tsx (untouched); this node carries only the all-in /
    // op-maat framing. Stays status:"draft" — statics index by type via policy.ts,
    // and the Zod uniqueness gate only bites review/published, so rich body here is safe.
    content: draftShell(
      "Onze tarieven",
      "Tarieven | TPS klimaattechniek",
      "Transparante prijzen voor ventilatie en airconditioning — inclusief BTW en voorrijkosten.",
      {
        intro:
          "Bij TPS klimaattechniek werken wij met heldere, eerlijke prijzen — zonder verrassingen achteraf. Voor airconditioning, WTW en mechanische ventilatie zijn onze tarieven all-in: inclusief BTW én inclusief voorrijkosten binnen ons werkgebied. Wat u in de offerte ziet, is wat u betaalt. Voor warmtepompen werken wij met een prijs op maat via een vrijblijvende offerte, omdat de prijs sterk afhangt van het type warmtepomp, het benodigde vermogen en uw woning. In die offerte is alles inbegrepen: de opname en warmteverliesberekening, het materiaal, de installatie en de inbedrijfstelling. Zo weet u vooraf precies waar u aan toe bent. Heeft u een specifieke situatie of wilt u meerdere diensten combineren? Vraag gerust een offerte op maat aan, dan rekenen wij het transparant voor u uit.",
        faqs: [
          {
            question: "Zijn de voorrijkosten inbegrepen in de prijs?",
            answer:
              "Ja. Binnen ons werkgebied rond Zoetermeer rekenen wij geen aparte voorrijkosten — die zitten bij de all-in tarieven voor airco, WTW en mechanische ventilatie inbegrepen.",
          },
          {
            question: "Is de BTW inbegrepen in de getoonde prijzen?",
            answer:
              "Ja, onze tarieven voor airco, WTW en mechanische ventilatie zijn inclusief 21% BTW. U betaalt geen onverwachte opslag bovenop het genoemde bedrag.",
          },
          {
            question: "Waarom is de prijs van een warmtepomp op maat?",
            answer:
              "Een warmtepomp stemmen wij af op uw woning: het type (hybride of volledig), het benodigde vermogen en uw afgiftesysteem bepalen de prijs. Daarom maken wij een offerte op maat waarin opname, materiaal, installatie en inbedrijfstelling zijn inbegrepen.",
          },
        ],
      },
    ),
  },
  {
    type: "static",
    pathSegment: "projecten",
    status: "draft",
    primaryKeyword: "airco installatie Zoetermeer voorbeelden",
    searchIntent: "commercieel",
    secondaryKeywords: ["airco projecten", "airco laten installeren voorbeelden"],
    navTitle: "Projecten",
    navDescription: "Recente installaties uit de regio, door ons eigen team",
    icon: "photo_library",
    // Showcase of real owner-supplied install photos (quick task 260719-t62).
    // Body content lives in lib/projects.ts + app/projecten/page.tsx; this node
    // carries SEO metadata and puts the page in sitemap/robots via policy.ts
    // (static type ⇒ indexable, same as the other content statics).
    content: draftShell(
      "Ons werk",
      "Ons werk – airco-installaties Zoetermeer | TPS klimaattechniek",
      "Bekijk recente installaties van TPS klimaattechniek in Zoetermeer en omgeving: wandunits, vloermodellen, multi-splits en maatwerk-oplossingen.",
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
