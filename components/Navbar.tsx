"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, TARIEVEN_DROPDOWN, SITE } from "@/lib/constants";
import { pillars, childrenOf, urlFor } from "@/lib/services/registry";
import { MobileMenu } from "./MobileMenu";
import { Icon } from "./Icon";

const DROPDOWN_ITEMS = ["Diensten", "Tarieven"] as const;

const springTransition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = useCallback((label: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActive(label);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimeout.current = setTimeout(() => setActive(null), 150);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 glass-nav shadow-sm"
      >
        <div className="flex justify-between items-center px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center"
            aria-label={`${SITE.name} home`}
          >
            {/* Logo-only header (owner pref 2026-06-28): the emblem already
                carries "TPS / KLIMAATTECHNIEK", so the text wordmark was dropped
                and the chip enlarged so the logo owns the corner. White chip +
                shadow because the source PNG is opaque white-bg (RGB, no alpha).
                Brand name stays announced via the link aria-label. */}
            <span className="relative w-14 h-14 rounded-full bg-white shadow-sm overflow-hidden shrink-0">
              <Image
                src="/tps-logo.png"
                alt=""
                fill
                sizes="56px"
                className="object-contain p-0.5"
              />
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const hasDropdown = DROPDOWN_ITEMS.includes(
                link.label as (typeof DROPDOWN_ITEMS)[number]
              );

              if (hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                  >
                    <Link
                      href={link.href}
                      onMouseEnter={() => openDropdown(link.label)}
                      onMouseLeave={scheduleClose}
                      className={`transition-colors font-medium flex items-center gap-1 ${
                        pathname === link.href || pathname.startsWith(link.href + "#")
                          ? "text-primary"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      {link.label}
                      <motion.span
                        className="material-symbols-outlined text-base"
                        animate={{ rotate: active === link.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        expand_more
                      </motion.span>
                    </Link>

                    <AnimatePresence>
                      {active === link.label && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10, pointerEvents: "none" as const }}
                          animate={{ opacity: 1, scale: 1, y: 0, pointerEvents: "auto" as const }}
                          exit={{ opacity: 0, scale: 0.95, y: 10, pointerEvents: "none" as const }}
                          transition={springTransition}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                        >
                          <motion.div
                            layout
                            className="bg-surface-container-lowest/90 backdrop-blur-[12px] rounded-2xl shadow-[0_20px_40px_rgba(0,31,41,0.06)] overflow-hidden"
                            onMouseEnter={cancelClose}
                            onMouseLeave={scheduleClose}
                          >
                            {link.label === "Diensten" && <DienstenPanel />}
                            {link.label === "Tarieven" && <TarievenPanel />}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden lg:inline-flex signature-gradient text-on-primary px-6 py-2.5 rounded-lg font-semibold text-sm transition-transform active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Offerte Aanvragen
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-3 text-on-surface cursor-pointer"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

// Taxonomy-derived mega-menu (D-07/IA-07): 4 pillar columns from pillars(), each
// listing its childrenOf() sub-services. Pillar header + every sub link via
// urlFor — no hardcoded dropdown list. Gives every service a sitewide link.
function DienstenPanel() {
  return (
    <div className="p-5 grid grid-cols-4 gap-2 w-[840px]">
      {pillars().map((pillar) => (
        <div key={pillar.pillarSlug} className="flex flex-col">
          <Link
            href={urlFor(pillar)}
            className="group/header flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors mb-1"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-fixed text-primary shrink-0">
              <Icon name={pillar.icon} className="text-xl" />
            </span>
            <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
              <span className="font-headline font-bold text-sm text-on-surface group-hover/header:text-primary transition-colors leading-tight">
                {pillar.navTitle}
              </span>
              {pillar.pillarSlug === "warmtepompen" && (
                <span className="shrink-0 whitespace-nowrap bg-tertiary-fixed text-on-tertiary-fixed text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Nieuw
                </span>
              )}
            </span>
          </Link>
          <div className="flex flex-col">
            {childrenOf(pillar.pillarSlug).map((service) => (
              <Link
                key={urlFor(service)}
                href={urlFor(service)}
                className="px-3 py-1.5 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
              >
                {service.navTitle}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TarievenPanel() {
  return (
    <div className="p-5 w-[380px]">
      <div className="inline-flex items-center gap-2 mb-4 bg-tertiary-fixed/60 px-3 py-1.5 rounded-full">
        <Icon name="verified" filled className="text-tertiary text-sm" />
        <span className="text-xs font-semibold text-on-tertiary-fixed">
          Alle prijzen incl. BTW
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TARIEVEN_DROPDOWN.map((tarief) => (
          <Link
            key={tarief.title}
            href={tarief.href}
            className="group flex flex-col gap-3 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-fixed text-primary">
              <Icon name={tarief.icon} />
            </span>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                {tarief.title}
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                {tarief.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
