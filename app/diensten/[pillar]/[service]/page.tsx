import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceHero } from "@/components/ServiceHero";
import { ServiceSteps } from "@/components/ServiceSteps";
import { BrandGrid } from "@/components/BrandGrid";
import { ServiceFAQ } from "@/components/ServiceFAQ";
import { RelatedServices } from "@/components/RelatedServices";
import { CTABanner } from "@/components/CTABanner";
import { pillars, childrenOf, findService } from "@/lib/services/registry";

// One data-driven template for all 17 sub-service pages (IA-03/IA-04, D-01
// convert-forward stack). dynamicParams=false → only the 17 enumerated
// {pillar,service} pairs pre-render; anything else 404s. Server component.
export const dynamicParams = false;

type Params = Promise<{ pillar: string; service: string }>;

export async function generateStaticParams() {
  return pillars().flatMap((p) =>
    childrenOf(p.pillarSlug).map((s) => ({
      pillar: p.pillarSlug,
      service: s.serviceSlug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { pillar, service } = await params;
  const node = findService(pillar, service);
  return {
    title: node?.content.metaTitle,
    description: node?.content.metaDescription,
  };
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { pillar, service } = await params;
  const node = findService(pillar, service);
  if (!node) notFound();

  return (
    <main className="pt-28 pb-20">
      <Breadcrumbs node={node} />
      <ServiceHero node={node} />
      <ServiceSteps steps={node.content.steps} />
      {/* BrandGrid self-omits unless node.brandIds is present (Installatie only) */}
      <BrandGrid brandIds={node.brandIds} />
      <ServiceFAQ faqs={node.content.faqs} localAngle={node.content.localAngle} />
      <RelatedServices node={node} />
      <CTABanner
        heading={`Offerte voor ${node.navTitle.toLowerCase()}?`}
        description="Vraag vrijblijvend een offerte aan of bel direct — u krijgt snel een eerlijke prijs en helder advies."
      />
    </main>
  );
}
