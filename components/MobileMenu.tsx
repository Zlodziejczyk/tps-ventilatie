"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/constants";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

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

          <nav className="flex-1 px-6 space-y-1">
            {NAV_LINKS.map((link) => (
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
            ))}
          </nav>

          <div className="p-6 space-y-3 border-t border-outline-variant/20">
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
