import type { ReactNode } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import {
  siblingsOf,
  pillars,
  findPillar,
  urlFor,
} from "@/lib/services/registry";
import type { PageNode } from "@/lib/services/types";

// IA-05 cross-sell (server component, D-03/D-11). On a SERVICE node it shows the
// same-pillar siblings (deterministic topical siloing, D-11); on a PILLAR node
// it shows the other pillars (D-02). Reuses ServiceCard. Every href goes through
// urlFor (the sole builder). Renders nothing when the resulting list is empty.
export function RelatedServices({ node }: { node: PageNode }) {
  if (node.type === "service") {
    const siblings = siblingsOf(node.pillarSlug, node.serviceSlug);
    if (siblings.length === 0) return null;
    const pillar = findPillar(node.pillarSlug);
    const heading = pillar
      ? `Andere ${pillar.navTitle.toLowerCase()} diensten`
      : "Gerelateerde diensten";

    return (
      <RelatedShell heading={heading}>
        {siblings.map((sibling) => (
          <ServiceCard
            key={urlFor(sibling)}
            icon={sibling.icon}
            title={sibling.navTitle}
            description={sibling.navDescription}
            primaryAction={{ label: "Bekijk dienst", href: urlFor(sibling) }}
          />
        ))}
      </RelatedShell>
    );
  }

  if (node.type === "pillar") {
    const others = pillars().filter((p) => p.pillarSlug !== node.pillarSlug);
    if (others.length === 0) return null;

    return (
      <RelatedShell heading="Andere diensten">
        {others.map((pillar) => (
          <ServiceCard
            key={urlFor(pillar)}
            icon={pillar.icon}
            title={pillar.navTitle}
            description={pillar.navDescription}
            primaryAction={{
              label: `Bekijk ${pillar.navTitle.toLowerCase()}`,
              href: urlFor(pillar),
            }}
          />
        ))}
      </RelatedShell>
    );
  }

  return null;
}

function RelatedShell({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 my-20">
      <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface mb-8">
        {heading}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
    </section>
  );
}
