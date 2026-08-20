// SEO INDEXING POLICY — the single source that decides which pages are indexable
// and which appear in the sitemap (D-02). Mirrors the `urlFor()` single-source
// pattern: both `app/sitemap.ts` and every page's per-page `robots` directive read
// `isIndexable` here, so sitemap membership can NEVER drift from the index directive.
//
// NO-BARREL EXCEPTION (D-05): the `lib/seo/*` family is a justified module group
// (same rationale as `registry.ts`), not a generic re-export barrel. Pure functions
// only — no rendering, no I/O, server-safe (never a client module).
//
// Indexing rule (D-20): ONE predicate for every node type — a node is indexable if
// and only if its `status` is "published". No type branches, no per-page exceptions.
// Indexability is purely data, so the editorial status flip IS the index lever and a
// reader of the taxonomy can see what is indexed without reading this file.
//
// This replaced a `type === "static"` branch that indexed statics by type and carved
// out the legal page by pathSegment. That shape made sense while every node was draft,
// but it meant the data lied: the statics said "draft" while serving index,follow. The
// legal page is now excluded the same way as everything else — by carrying `draft` —
// with a named assertion in scripts/assert-seo.ts as the safety belt, since data is
// easier to get wrong by accident than a code branch is.

import { CANONICAL_ORIGIN } from "@/lib/constants";
import { PAGES, urlFor } from "@/lib/services/registry";
import type { PageNode } from "@/lib/services/types";

// The SINGLE place index membership is decided, for every node type alike.
export function isIndexable(node: PageNode): boolean {
  return node.status === "published";
}

// Absolute URL from a canonical path. Root keeps its slash to match the served
// origin; non-root paths already carry no trailing slash (urlFor / trailingSlash:false,
// P1 D-03). The ONLY place a path is joined to CANONICAL_ORIGIN.
export function absoluteUrl(path: string): string {
  return path === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${path}`;
}

// THE governed collection — the set of nodes the indexing policy has authority over
// (D-05). Everything downstream reads the surface through here rather than naming the
// registry array: `sitemapEntries()` below derives from it, and the invariant checker
// in ./invariants iterates it, so neither one is coupled to where the nodes come from.
//
// This is the single extension point. A new indexable entity type (Phase 12's
// kennisbank articles are the next one) joins the index by being returned HERE — never
// by a second URL list appended to app/sitemap.ts. A parallel list would reintroduce
// exactly the sitemap-vs-robots drift this module exists to prevent, and the invariant
// checker flags any sitemap entry with no backing node for that reason.
export function indexableSurface(): PageNode[] {
  return PAGES;
}

// One sitemap entry per indexable node, `url` absolute via absoluteUrl(urlFor(node)).
// `lastModified` is omitted for now (no per-node timestamp source yet). The return
// shape is structurally a MetadataRoute.Sitemap, consumed by app/sitemap.ts.
export function sitemapEntries(): { url: string; lastModified?: Date }[] {
  return indexableSurface()
    .filter(isIndexable)
    .map((node) => ({ url: absoluteUrl(urlFor(node)) }));
}
