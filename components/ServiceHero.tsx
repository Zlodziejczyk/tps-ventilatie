import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SITE } from "@/lib/constants";
import type { PageNode } from "@/lib/services/types";

// IA-05 service hero (server component, D-03/D-10). Shared by every service AND
// pillar page, so it stays generic — driven only by PageBase fields + SITE.
// "Atmospheric Clarity, engineered" two-column hero: scannable text (lead
// sentence + supporting copy) on the left, an engineered glass key-facts /
// trust card on the right (TIER 2 fix for the "walls of text" owner feedback).
// Reuses only the cheap CWV-safe AnimateOnScroll tier + the pure-CSS air-pulse
// (no SoftAurora/particles — those stay home-only). Right column is a non-photo
// trust card by design: airco/warmtepompen have no imagery yet (that's TIER 3).

// Split the (owner-approved) intro string into a lead sentence + supporting
// copy for hierarchy — a pure presentation transform, no content is authored.
// Boundary = first .?! followed by whitespace + a capital, with a >=30-char
// minimum lead so it never breaks on an early abbreviation ("bijv.", "incl.").
// No boundary found → the whole string is the lead (matches the old single
// block, so draft/short fallbacks never regress).
function splitLead(text: string): { lead: string; rest: string } {
  const trimmed = text.trim();
  const boundary = /[.!?]\s+(?=[A-ZÀ-Þ])/g;
  let match: RegExpExecArray | null;
  while ((match = boundary.exec(trimmed)) !== null) {
    const end = match.index + 1; // keep the punctuation on the lead
    if (end >= 30) {
      return { lead: trimmed.slice(0, end), rest: trimmed.slice(end).trim() };
    }
  }
  return { lead: trimmed, rest: "" };
}

const FACTS: { icon: string; label: string; value: string }[] = [
  {
    icon: "distance",
    label: "Werkgebied",
    value: `${SITE.city} + ${SITE.serviceRadiusKm} km omstreken`,
  },
  {
    icon: "schedule",
    label: "Goed bereikbaar",
    value: "Ma–za 08:00–17:30, ook op afspraak",
  },
  {
    icon: "verified_user",
    label: "Vakkundig & vrijblijvend",
    value: "Eerlijke prijs, helder advies",
  },
];

// Engineered glass trust card — fills the right column with proof + a
// frictionless contact action (the sketch "speed-to-contact" lever).
function HeroFacts() {
  return (
    <div className="relative rounded-3xl bg-surface-container-lowest shadow-[0_18px_50px_-22px_rgba(0,101,128,0.35)] overflow-hidden">
      {/* Engineered top-accent bar (Daikin-craft motif) */}
      <div className="h-1.5 signature-gradient" aria-hidden="true" />
      <div className="p-7 md:p-8">
        {/* Live availability pulse */}
        <div className="flex items-center gap-2.5 mb-7">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="air-pulse absolute inline-flex h-full w-full rounded-full bg-tertiary/50"
              aria-hidden="true"
            />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" />
          </span>
          <span className="text-sm font-semibold text-on-surface">
            Direct beschikbaar voor advies
          </span>
        </div>

        {/* Key facts — universally true for every service/pillar node */}
        <ul className="space-y-4 mb-7">
          {FACTS.map((fact) => (
            <li key={fact.label} className="flex items-start gap-3.5">
              <span className="shrink-0 w-9 h-9 rounded-xl bg-primary-fixed/60 flex items-center justify-center">
                <Icon name={fact.icon} className="text-primary text-lg" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-on-surface">
                  {fact.label}
                </span>
                <span className="block text-sm text-on-surface-variant">
                  {fact.value}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {/* One-tap contact (complements the left-column Bel/Offerte CTAs) */}
        <a
          href={SITE.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hover flex items-center justify-center gap-2.5 bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        >
          <Icon name="chat" filled className="text-xl" />
          Stuur een WhatsApp
        </a>
      </div>
    </div>
  );
}

export function ServiceHero({
  node,
  image,
}: {
  node: PageNode;
  image?: { src: string; alt: string };
}) {
  const source =
    node.content.intro.trim() !== "" ? node.content.intro : node.navDescription;
  const { lead, rest } = splitLead(source);

  return (
    <AnimateOnScroll
      as="header"
      className="relative px-6 pb-12 max-w-7xl mx-auto overflow-hidden"
    >
      <div
        className="absolute -right-24 -top-24 w-[28rem] h-[28rem] bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left — scannable copy with hierarchy */}
        <div className="lg:col-span-7">
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center mb-6">
            <Icon name={node.icon} filled className="text-primary text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-surface tracking-tight mb-5 text-balance">
            {node.content.h1}
          </h1>
          <p className="text-xl md:text-2xl text-on-surface font-medium leading-snug mb-4 max-w-2xl text-balance">
            {lead}
          </p>
          {rest !== "" && (
            <p className="text-base md:text-lg text-on-surface-variant max-w-2xl font-light leading-relaxed mb-8">
              {rest}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 signature-gradient text-on-primary px-7 py-3 rounded-lg font-semibold transition-transform active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Icon name="request_quote" className="text-xl" />
              Offerte aanvragen
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="btn-hover inline-flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-highest transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Icon name="call" className="text-xl text-primary" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Right — pillar hero image when provided (pillar pages), else the
            engineered trust card (service detail pages). */}
        <div className="lg:col-span-5 w-full">
          {image ? (
            <div className="relative aspect-[3/2] rounded-3xl overflow-hidden shadow-[0_18px_50px_-22px_rgba(0,101,128,0.35)]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <HeroFacts />
          )}
        </div>
      </div>
    </AnimateOnScroll>
  );
}
