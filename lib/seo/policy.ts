// SEO INDEXING POLICY — the single source that decides which pages are indexable
// and which appear in the sitemap (D-02). Mirrors the `urlFor()` single-source
// pattern: both `app/sitemap.ts` and every page's per-page `robots` directive read
// `isIndexable` here, so sitemap membership can NEVER drift from the index directive.
//
// NO-BARREL EXCEPTION (D-05): the `lib/seo/*` family is a justified module group
// (same rationale as `registry.ts`), not a generic re-export barrel. Pure functions
// only — no rendering, no I/O, server-safe (never a client module).
//
// Indexing rule (RESEARCH §4, the all-draft reality): keys off `type`, not a naive
// `status === "published"` (every node is currently draft, which would noindex the
// whole site). Static content pages render real content now → indexable now (except
// the legal privacy page); hub/pillar/service pages gate on the Phase-4 editorial
// flip to `published` (CONT-10 — one lever, no parallel list, no Phase-3 rework).

import { CANONICAL_ORIGIN } from "@/lib/constants";
import { PAGES, urlFor } from "@/lib/services/registry";
import type { PageNode } from "@/lib/services/types";

// The SINGLE place index membership is decided. Static pages render real content
// independent of the draft taxonomy shells → indexable now (privacy-beleid is the
// one legal-page exception); hub/pillar/service gate on `status === "published"`.
export function isIndexable(node: PageNode): boolean {
  if (node.type === "static") {
    return node.pathSegment !== "privacy-beleid";
  }
  return node.status === "published";
}

// Absolute URL from a canonical path. Root keeps its slash to match the served
// origin; non-root paths already carry no trailing slash (urlFor / trailingSlash:false,
// P1 D-03). The ONLY place a path is joined to CANONICAL_ORIGIN.
export function absoluteUrl(path: string): string {
  return path === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${path}`;
}

// One sitemap entry per indexable node, `url` absolute via absoluteUrl(urlFor(node)).
// `lastModified` is omitted for now (no per-node timestamp source yet). The return
// shape is structurally a MetadataRoute.Sitemap, consumed by app/sitemap.ts.
export function sitemapEntries(): { url: string; lastModified?: Date }[] {
  return PAGES.filter(isIndexable).map((node) => ({ url: absoluteUrl(urlFor(node)) }));
}
