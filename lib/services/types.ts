// Taxonomy typed contract — the single discriminated-union shape every page
// node satisfies (D-04), plus the content shell that co-locates body content,
// per-page SEO metadata, and keyword fields in one source (D-14/D-15).
//
// Import direction (resolved per plan 01-04): the canonical-URL derivation
// (`canonicalPath`) lives HERE so the Zod uniqueness refinement in `pagesSchema`
// needs no import from `./registry` (which would be circular). Plan 01-05's
// public `urlFor()` delegates to `canonicalPath` — one implementation, no drift.
//
// No concrete page data lives here (that is `lib/services/*` data files + the
// `PAGES` aggregation in `registry.ts`, plan 01-05).

// ── Discriminant + classification unions (mirror the in-repo `type Tab` idiom) ──

export type PageType = "hub" | "pillar" | "service" | "static";

export type SearchIntent =
  | "informationeel"
  | "commercieel"
  | "transactioneel"
  | "navigationeel";

export type PageStatus = "draft" | "review" | "published";

// ── Content shell: body content + SEO metadata + (keyword fields live on the
//    node). Structured `steps`/`faqs` arrays so Phase 2 components and Phase 3
//    JSON-LD consume them with zero re-parsing (D-15). ──

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface ContentShell {
  h1: string;
  intro: string;
  steps: StepItem[];
  faqs: FaqItem[];
  localAngle: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}

// ── Page node variants (discriminated by `type`) ──

export interface PageBase {
  status: PageStatus;
  primaryKeyword: string;
  searchIntent: SearchIntent;
  secondaryKeywords?: string[];
  // Nav-relevant fields modeled now so Phase 2 derives the dropdowns from the
  // taxonomy (mirrors the `DropdownItem { icon; title; description }` shape).
  navTitle: string;
  navDescription: string;
  icon: string;
  content: ContentShell;
}

export interface HubPage extends PageBase {
  type: "hub";
  segment: "diensten";
}

export interface PillarPage extends PageBase {
  type: "pillar";
  pillarSlug: string;
}

export interface ServicePage extends PageBase {
  type: "service";
  pillarSlug: string;
  serviceSlug: string;
  brandIds?: string[];
}

export interface StaticPage extends PageBase {
  type: "static";
  pathSegment: string; // "" === home ("/")
}

export type PageNode = HubPage | PillarPage | ServicePage | StaticPage;
