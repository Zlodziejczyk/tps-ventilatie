import Link from "next/link";
import { Icon } from "@/components/Icon";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import type { PageNode } from "@/lib/services/types";

// IA-05 service hero (server component, D-03/D-10). Lean tonal-background hero —
// icon + h1 + lead + "Offerte aanvragen" CTA. Reuses only the cheap CWV-safe
// AnimateOnScroll motion tier (no SoftAurora/particles — those stay home-only).
// The lead paragraph falls back to navDescription when content.intro is empty
// (D-06), so draft shells never render an empty hero.
export function ServiceHero({ node }: { node: PageNode }) {
  const intro =
    node.content.intro.trim() !== "" ? node.content.intro : node.navDescription;

  return (
    <AnimateOnScroll
      as="header"
      className="relative px-6 pb-12 max-w-7xl mx-auto overflow-hidden"
    >
      <div
        className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center mb-6">
          <Icon name={node.icon} filled className="text-primary text-3xl" />
        </div>
        <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-on-surface tracking-tight mb-6 text-balance">
          {node.content.h1}
        </h1>
        <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed mb-8">
          {intro}
        </p>
        <Link
          href="/contact"
          className="inline-flex signature-gradient text-on-primary px-7 py-3 rounded-lg font-semibold transition-transform active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Offerte aanvragen
        </Link>
      </div>
    </AnimateOnScroll>
  );
}
