"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { pillars, childrenOf, urlFor } from "@/lib/services/registry";
import { Icon } from "@/components/Icon";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  // D-08: single-open accordion — which pillar's sub-list is expanded.
  const [openPillar, setOpenPillar] = useState<string | null>(null);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-surface-container-lowest shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6">
            <span className="text-lg font-bold font-headline text-on-surface">
              Menu
            </span>
            <button
              onClick={onClose}
              className="p-3 text-on-surface-variant cursor-pointer"
              aria-label="Sluit menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
            {NAV_LINKS.map((link) =>
              link.label === "Diensten" ? (
                // Diensten — 2-level accordion (D-08): pillar rows (label links
                // to the pillar page) + a chevron toggling each pillar's subs.
                <div key={link.href} className="py-1">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block px-4 py-3 rounded-xl font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    {link.label}
                  </Link>
                  <div className="mt-1 space-y-0.5">
                    {pillars().map((pillar) => {
                      const isOpen = openPillar === pillar.pillarSlug;
                      return (
                        <div key={pillar.pillarSlug}>
                          <div className="flex items-center gap-1">
                            <Link
                              href={urlFor(pillar)}
                              onClick={onClose}
                              className="flex-1 flex items-center gap-2 pl-4 pr-2 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                            >
                              <Icon
                                name={pillar.icon}
                                className="text-lg text-primary"
                              />
                              {pillar.navTitle}
                              {pillar.pillarSlug === "warmtepompen" && (
                                <span className="shrink-0 whitespace-nowrap bg-tertiary-fixed text-on-tertiary-fixed text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                  Nieuw
                                </span>
                              )}
                            </Link>
                            <button
                              onClick={() =>
                                setOpenPillar(isOpen ? null : pillar.pillarSlug)
                              }
                              aria-expanded={isOpen}
                              aria-label={`${pillar.navTitle} diensten ${isOpen ? "inklappen" : "uitklappen"}`}
                              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                            >
                              <Icon
                                name="expand_more"
                                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </button>
                          </div>
                          {isOpen && (
                            <div className="pl-11 pb-1 space-y-0.5">
                              {childrenOf(pillar.pillarSlug).map((service) => (
                                <Link
                                  key={urlFor(service)}
                                  href={urlFor(service)}
                                  onClick={onClose}
                                  className="block px-4 py-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                                >
                                  {service.navTitle}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-primary-fixed text-on-primary-fixed-variant"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="p-6 space-y-3 bg-surface-container-low">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-high text-on-surface font-medium"
            >
              <span className="material-symbols-outlined">phone</span>
              {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl signature-gradient text-on-primary font-semibold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
