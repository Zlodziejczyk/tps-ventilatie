import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceHero } from "@/components/ServiceHero";
import { ServiceIntro } from "@/components/ServiceIntro";
import { BrandGrid } from "@/components/BrandGrid";
import { ServiceFAQ } from "@/components/ServiceFAQ";
import { RelatedServices } from "@/components/RelatedServices";
import { CTABanner } from "@/components/CTABanner";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";
import {
  pillars,
  findPillar,
  childrenOf,
  brandsForPillar,
  pillarTarievenTab,
  urlFor,
} from "@/lib/services/registry";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo/jsonld";

// Pillar hero imagery (TIER 3, 2026-06-28): one scene per pillar, rendered in the
// ServiceHero right column on pillar pages only. Service detail pages keep the
// trust card. Keys MUST match pillarSlug.
const PILLAR_IMAGES: Record<string, { src: string; alt: string }> = {
  airconditioning: {
    src: "/images/heroes/airco.jpg",
    alt: "Monteur van TPS klimaattechniek installeert een airco-binnenunit in een lichte woonkamer",
  },
  warmtepompen: {
    src: "/images/heroes/warmtepomp.jpg",
    alt: "Warmtepomp-buitenunit naast een moderne woning",
  },
  wtw: {
    src: "/images/heroes/wtw.jpg",
    alt: "Monteur controleert het filter van een WTW-ventilatie-unit",
  },
  "mechanische-ventilatie": {
    src: "/images/heroes/mv.jpg",
    alt: "Monteur stelt een ventilatieventiel in het plafond af",
  },
};

// Scannable hero key-points per pillar (owner feedback 2026-06-29: make it less
// of a text wall, more scannable). Short, truthful — each is backed by the pillar
// intro. Keys MUST match pillarSlug. ISDE only on warmtepompen (anti-claim §2).
const PILLAR_HIGHLIGHTS: Record<string, string[]> = {
  airconditioning: [
    "Koelen én verwarmen",
    "Daikin & Mitsubishi",
    "Stil & energiezuinig",
    "Vrijblijvende opname op locatie",
  ],
  warmtepompen: [
    "Lager energieverbruik & CO₂",
    "Lucht-water & hybride",
    "Daikin & Mitsubishi Ecodan",
    "ISDE-subsidie mogelijk",
  ],
  wtw: [
    "Tot 95% warmteterugwinning",
    "Vervangen · onderhoud · inregelen",
    "Inregelen met meetrapport",
    "Fluisterstil & zuinig",
  ],
  "mechanische-ventilatie": [
    "Voorkomt vocht & schimmel",
    "CO₂-gestuurd mogelijk",
    "Vervangen · reinigen · storing",
    "Stille, frisse afvoer",
  ],
};

// One data-driven template for all 4 pillar pages (IA-03/IA-04, D-02 layout).
// dynamicParams=false → only the 4 enumerated slugs pre-render; anything else
// 404s at export. Server component, cheap motion only (D-10).
export const dynamicParams = false;

type Params = Promise<{ pillar: string }>;

export async function generateStaticParams() {
  return pillars().map((p) => ({ pillar: p.pillarSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { pillar } = await params;
  const node = findPillar(pillar);
  // Widened from the Phase-2 title/desc seam to full canonical + OG/Twitter +
  // per-page robots via the shared builder (D-05). Draft pillars get noindex,follow.
  return node ? buildMetadata(node) : {};
}

export default async function PillarPage({ params }: { params: Params }) {
  const { pillar } = await params;
  const node = findPillar(pillar);
  if (!node) notFound();

  const children = childrenOf(pillar);
  const tarievenTab = pillarTarievenTab(pillar);

  return (
    <main className="pt-28 pb-20">
      {/* Per-page structured data (D-04) — server-rendered, no visual effect */}
      <JsonLd data={serviceJsonLd(node)} />
      <JsonLd data={breadcrumbJsonLd(node)} />
      {node.content.faqs.length > 0 && <JsonLd data={faqJsonLd(node)!} />}

      <ServiceHero
        node={node}
        image={PILLAR_IMAGES[pillar]}
        highlights={PILLAR_HIGHLIGHTS[pillar]}
      />
      <ServiceIntro node={node} />

      {/* Sub-service card grid — the routes into each sub-service page */}
      <section className="max-w-7xl mx-auto px-6 my-16">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface mb-8">
          Onze {node.navTitle.toLowerCase()} diensten
        </h2>
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((service) => (
            <StaggerItem key={urlFor(service)}>
              <ServiceCard
                icon={service.icon}
                title={service.navTitle}
                description={service.navDescription}
                primaryAction={{ label: "Bekijk dienst", href: urlFor(service) }}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <BrandGrid brandIds={brandsForPillar(pillar)} />

      <ServiceFAQ faqs={node.content.faqs} localAngle={node.content.localAngle} />

      <RelatedServices node={node} />

      {/* Tarieven seam (RESEARCH §5): warmtepompen has no tab → omit the price
          link (the hero "Offerte aanvragen" → /contact already covers it). */}
      {tarievenTab ? (
        <section className="max-w-7xl mx-auto px-6 my-12">
          <div className="bg-surface-container-low rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-1">
                Benieuwd naar de tarieven?
              </h3>
              <p className="text-on-surface-variant">
                Bekijk transparante prijzen — inclusief BTW en voorrijkosten.
              </p>
            </div>
            <Link
              href={`/tarieven?tab=${tarievenTab}`}
              className="shrink-0 inline-flex items-center gap-2 bg-surface-container-high text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-highest transition-colors"
            >
              Bekijk tarieven
              <Icon name="arrow_forward" className="text-lg" />
            </Link>
          </div>
        </section>
      ) : null}

      <CTABanner
        heading={`Interesse in ${node.navTitle.toLowerCase()}?`}
        description="Vraag vrijblijvend een offerte aan of bel direct met een specialist voor advies op maat."
      />
    </main>
  );
}
