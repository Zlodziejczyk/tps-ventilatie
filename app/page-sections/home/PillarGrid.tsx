"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  pillars,
  childrenOf,
  brandsForPillar,
  urlFor,
} from "@/lib/services/registry";
import { BRANDS, BRAND_COLOR, type BrandId } from "@/lib/services/brands";

interface PillarGridProps {
  // A pillar Offerte click routes its navTitle into the hero form (D-09). navTitle is
  // passed (not slug) so it matches the form's pillars().map(p => p.navTitle) options.
  onOfferte: (pillarNavTitle: string) => void;
}

// Presentational "Nieuw" tag ships on Warmtepompen only (D-08) — markup, not taxonomy.
const NIEUW_PILLAR_SLUG = "warmtepompen";

export function PillarGrid({ onOfferte }: PillarGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-headline text-2xl font-extrabold text-on-surface sm:text-3xl">
          Vier specialismen, één aanspreekpunt
        </h2>
        <p className="mt-2 text-on-surface-variant">
          Airconditioning, warmtepompen en ventilatie — kies uw dienst of vraag direct
          een offerte aan.
        </p>
      </div>

      {/* Equal grid 4 → 2 → 1, independent card heights (D-08) */}
      <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {pillars().map((pillar) => {
          const subs = childrenOf(pillar.pillarSlug);
          const brandIds = brandsForPillar(pillar.pillarSlug).filter(
            (id): id is BrandId => id in BRANDS,
          );

          return (
            <article
              key={pillar.pillarSlug}
              className="hover-lift flex flex-col rounded-3xl bg-surface-container-lowest p-6 shadow-sm hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
                  <Icon name={pillar.icon} filled className="text-2xl" />
                </span>
                {pillar.pillarSlug === NIEUW_PILLAR_SLUG && (
                  <span className="rounded-full bg-tertiary-fixed px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-on-tertiary-fixed-variant">
                    Nieuw
                  </span>
                )}
              </div>

              <h3 className="mt-4 font-headline text-lg font-bold text-on-surface">
                {pillar.navTitle}
              </h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                {pillar.navDescription}
              </p>

              {/* Sub-service chips = internal links (D-10) */}
              <ul className="mt-4 flex flex-wrap gap-2">
                {subs.map((sub) => (
                  <li key={sub.serviceSlug}>
                    <Link
                      href={urlFor(sub)}
                      className="btn-hover inline-flex whitespace-nowrap rounded-full bg-surface-container-high px-3 py-1 text-xs font-medium text-on-surface"
                    >
                      {sub.navTitle}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Brand chips (D-12) — text-word chips (never <img>, logo paths 404) — or
                  the neutral WTW/MV fallback when the pillar carries no brands (D-13). */}
              <div className="mt-4 flex flex-wrap gap-2">
                {brandIds.length > 0 ? (
                  brandIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-surface-container-lowest px-2.5 py-1 text-xs font-extrabold text-on-surface"
                      style={
                        {
                          "--brand": BRAND_COLOR[id] ?? "var(--color-primary)",
                        } as CSSProperties
                      }
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-sm bg-[var(--brand)]"
                        aria-hidden
                      />
                      {BRANDS[id].name}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-surface-container-lowest px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
                    <Icon name="verified" className="text-sm text-primary" />
                    Diverse merken · merkonafhankelijk
                  </span>
                )}
              </div>

              {/* Primary link → pillar page + a distinct Offerte button → hero form (D-09) */}
              <div className="mt-6 flex items-center gap-3 pt-2">
                <Link
                  href={urlFor(pillar)}
                  className="btn-hover inline-flex items-center gap-1 text-sm font-bold text-primary"
                >
                  Bekijk dienst
                  <Icon name="arrow_forward" className="text-base" />
                </Link>
                <button
                  type="button"
                  onClick={() => onOfferte(pillar.navTitle)}
                  className="btn-hover signature-gradient ml-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-on-primary"
                >
                  <Icon name="request_quote" filled className="text-base" />
                  Offerte
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
