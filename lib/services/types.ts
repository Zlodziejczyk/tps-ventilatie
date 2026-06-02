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

import { z } from "zod";

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

// ── Canonical URL derivation — the single source `registry.ts urlFor()`
//    delegates to (see header note). Pure function of a node's discriminant +
//    slug fields, so `pagesSchema`'s uniqueness check needs no registry import. ──

export function canonicalPath(node: {
  type: PageType;
  segment?: string;
  pillarSlug?: string;
  serviceSlug?: string;
  pathSegment?: string;
}): string {
  switch (node.type) {
    case "hub":
      return `/${node.segment ?? "diensten"}`;
    case "pillar":
      return `/diensten/${node.pillarSlug}`;
    case "service":
      return `/diensten/${node.pillarSlug}/${node.serviceSlug}`;
    case "static":
      return node.pathSegment ? `/${node.pathSegment}` : "/";
  }
}

// ── Zod schemas. Zod 4 idioms only: array length is enforced via explicit
//    length refinements (the deprecated Zod-3 array shortcut is avoided);
//    `ctx.addIssue` uses the write-side `path` property; `z.prettifyError()` is
//    reserved for the 01-06 prebuild gate. Structure is validated always;
//    content-quality rules are status-gated so empty `draft` shells pass. ──

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const stepSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

// Structure only — an empty `draft` shell passes this.
export const contentShellSchema = z.object({
  h1: z.string().min(1),
  intro: z.string(),
  steps: z.array(stepSchema),
  faqs: z.array(faqSchema),
  localAngle: z.string(),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  ogImage: z.string().optional(),
});

// Status-gated content rules (anti-thin-content — IA-08, D-07/D-08). Applied
// only to review/published nodes (see `pageSchema`).
export const publishedContentSchema = contentShellSchema.superRefine((c, ctx) => {
  const introWords = c.intro.trim().split(/\s+/).filter(Boolean).length;
  if (introWords < 120) {
    ctx.addIssue({
      code: "custom",
      path: ["intro"],
      message: `intro must be >= 120 words for review/published pages (got ${introWords})`,
    });
  }
  if (c.steps.length < 1) {
    ctx.addIssue({
      code: "custom",
      path: ["steps"],
      message: "steps must be a non-empty list for review/published pages",
    });
  }
  if (c.faqs.length < 3 || c.faqs.length > 6) {
    ctx.addIssue({
      code: "custom",
      path: ["faqs"],
      message: `faqs must contain 3-6 items for review/published pages (got ${c.faqs.length})`,
    });
  }
});

// Fields shared by every node variant (mirrors PageBase).
const baseNodeFields = {
  status: z.enum(["draft", "review", "published"]),
  primaryKeyword: z.string().min(1),
  searchIntent: z.enum([
    "informationeel",
    "commercieel",
    "transactioneel",
    "navigationeel",
  ]),
  secondaryKeywords: z.array(z.string()).optional(),
  navTitle: z.string().min(1),
  navDescription: z.string().min(1),
  icon: z.string().min(1),
  content: contentShellSchema,
};

// Per-variant node schemas, discriminated by `type`. This is the RUNTIME
// enforcement of the PageNode contract: a service node MUST carry pillarSlug +
// serviceSlug, a pillar MUST carry pillarSlug, the hub MUST be segment
// "diensten". A missing/empty slug now fails the gate, so canonicalPath can
// never emit a `/diensten/undefined` URL (the slug fields are required, not
// loosely-optional).
const hubNodeSchema = z.object({
  type: z.literal("hub"),
  segment: z.literal("diensten"),
  ...baseNodeFields,
});
const pillarNodeSchema = z.object({
  type: z.literal("pillar"),
  pillarSlug: z.string().min(1),
  ...baseNodeFields,
});
const serviceNodeSchema = z.object({
  type: z.literal("service"),
  pillarSlug: z.string().min(1),
  serviceSlug: z.string().min(1),
  brandIds: z.array(z.string()).optional(),
  ...baseNodeFields,
});
const staticNodeSchema = z.object({
  type: z.literal("static"),
  pathSegment: z.string(),
  ...baseNodeFields,
});

const pageVariantSchema = z.discriminatedUnion("type", [
  hubNodeSchema,
  pillarNodeSchema,
  serviceNodeSchema,
  staticNodeSchema,
]);

// One page node: per-variant structure (discriminated union) always; content
// quality upgraded for review/published.
export const pageSchema = pageVariantSchema.superRefine((node, ctx) => {
  if (node.status === "review" || node.status === "published") {
    const result = publishedContentSchema.safeParse(node.content);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          code: "custom",
          path: ["content", ...issue.path],
          message: issue.message,
        });
      }
    }
  }
});

// The full taxonomy: an array of nodes + cross-record uniqueness (IA-09 anti-
// cannibalization). Duplicate canonical URL or duplicate primaryKeyword fails.
export const pagesSchema = z.array(pageSchema).superRefine((pages, ctx) => {
  const urlSeen = new Map<string, number>();
  const keywordSeen = new Map<string, number>();
  pages.forEach((node, i) => {
    const url = canonicalPath(node);
    const priorUrl = urlSeen.get(url);
    if (priorUrl !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: [i, "slug"],
        message: `Duplicate canonical URL "${url}" — also produced by page #${priorUrl}`,
      });
    } else {
      urlSeen.set(url, i);
    }
    const keyword = node.primaryKeyword.trim().toLowerCase();
    const priorKeyword = keywordSeen.get(keyword);
    if (priorKeyword !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: [i, "primaryKeyword"],
        message: `Duplicate primaryKeyword "${node.primaryKeyword}" — keyword cannibalization with page #${priorKeyword}`,
      });
    } else {
      keywordSeen.set(keyword, i);
    }
  });
});

