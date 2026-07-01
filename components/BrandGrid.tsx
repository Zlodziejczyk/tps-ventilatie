import type { CSSProperties } from "react";
import { BRANDS, BRAND_COLOR, type BrandId } from "@/lib/services/brands";
import { Icon } from "@/components/Icon";

// IA-06 brand grid (server component, D-03). Renders TEXT brand chips — a small
// brand-colored mark + the brand name (sketch .logo-chip pattern). It renders
// NO image elements: the placeholder logo paths in brands.ts point at assets
// that do not exist yet (RESEARCH §4), so an image tag would 404. Renders
// nothing when there are no brandIds (D-06). Brands the owner is an "erkend
// installateur" for show a verified badge (CONT-03 resolved 2026-06-28, intake §5).
// BRAND_COLOR now lives in lib/services/brands.ts (shared with PillarGrid, D-12).

export function BrandGrid({ brandIds }: { brandIds?: string[] }) {
  if (!brandIds || brandIds.length === 0) return null;

  const brands = brandIds
    .filter((id): id is BrandId => id in BRANDS)
    .map((id) => BRANDS[id]);
  if (brands.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 my-16">
      <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
        Wij installeren o.a.
      </p>
      <ul className="flex flex-wrap gap-3">
        {brands.map((brand) => (
          <li
            key={brand.id}
            className="inline-flex items-center gap-2.5 bg-surface-container-low rounded-lg px-4 py-2.5 shadow-sm"
            style={
              {
                "--brand": BRAND_COLOR[brand.id] ?? "var(--color-primary)",
              } as CSSProperties
            }
          >
            <span
              className="w-3 h-3 rounded-sm bg-[var(--brand)]"
              aria-hidden="true"
            />
            <span className="font-headline font-extrabold text-sm text-on-surface">
              {brand.name}
            </span>
            {brand.erkendInstallateur && (
              <span
                title="Erkend installateur"
                className="inline-flex items-center text-primary"
              >
                <Icon name="verified" filled className="text-base" />
                <span className="sr-only">Erkend installateur</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
