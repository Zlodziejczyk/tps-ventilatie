import Link from "next/link";
import { Icon } from "@/components/Icon";
import { trailFor } from "@/lib/services/registry";
import type { PageNode } from "@/lib/services/types";

// IA-05 breadcrumbs (server component, D-03). Renders trailFor(node) — the
// single trail source (Phase 3 reuses the same data for BreadcrumbList JSON-LD,
// D-13). Every crumb except the last is a Link; the last is the current page
// (non-linked, aria-current). The pillarSlug/serviceSlug → label/href mapping
// lives in trailFor, never re-derived here.
export function Breadcrumbs({ node }: { node: PageNode }) {
  const trail = trailFor(node);

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 mb-2">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-on-surface-variant">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-x-2">
              {i > 0 && (
                <Icon name="chevron_right" className="text-base text-outline" />
              )}
              {isLast ? (
                <span className="text-on-surface" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
