import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Icon } from "@/components/Icon";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

// Engineered dark closing band (D-17) — the restyle of the retired CTABanner, with its
// two shipped bugs fixed:
//   FIX 1: raw Material-Symbols glyph spans -> the Icon wrapper (all icons below).
//   FIX 2: the AA-failing green + white WhatsApp CTA (1.99:1) -> the proven
//          StickyContactBar treatment (neutral pill + Icon text-primary glyph, AA-safe).
// Server component; every contact link comes from SITE. Nothing always-on is added —
// the site-wide StickyContactBar stays inherited from app/layout.tsx (D-16).
export function ClosingCTA() {
  return (
    <AnimateOnScroll as="section" className="mx-auto max-w-7xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-4xl bg-on-primary-fixed px-8 py-14 text-center md:px-16 md:py-16">
        {/* Decorative brand glow — tonal layering, not a 1px border */}
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-tertiary/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-headline text-3xl font-bold text-white md:text-4xl">
            Klaar voor een gezond binnenklimaat?
          </h2>
          <p className="mt-4 text-lg text-primary-fixed/90">
            Vraag vrijblijvend advies of een offerte aan — u krijgt binnen één werkdag
            reactie van een specialist uit uw regio.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {/* Bel */}
            <a
              href={`tel:${SITE.phone}`}
              className="btn-hover inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface-container-high px-5 py-3 font-semibold text-on-surface"
            >
              <Icon name="call" filled className="text-[20px] text-primary" />
              Bel {SITE.phoneDisplay}
            </a>

            {/* WhatsApp — AA-safe: neutral pill + primary glyph (StickyContactBar treatment) */}
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener"
              className="btn-hover inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface-container-high px-5 py-3 font-semibold text-on-surface"
            >
              <Icon name="chat" filled className="text-[20px] text-primary" />
              WhatsApp
            </a>

            {/* Offerte */}
            <Link
              href="/contact"
              className="btn-hover signature-gradient inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3 font-semibold text-white"
            >
              <Icon name="request_quote" filled className="text-[20px]" />
              Offerte aanvragen
            </Link>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
