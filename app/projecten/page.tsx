import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { findBySlug } from "@/lib/services/registry";
import { PROJECTS } from "@/lib/projects";
import { ProjectCase } from "@/components/ProjectCase";
import { CTABanner } from "@/components/CTABanner";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata = buildMetadata(findBySlug("/projecten")!);

export default function ProjectenPage() {
  return (
    <main id="main" tabIndex={-1} className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <AnimateOnScroll>
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 font-label">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-medium text-primary">Projecten</span>
          </nav>

          <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-on-surface mb-8">
            Ons <span className="text-primary">werk</span>
          </h1>

          <div className="max-w-3xl space-y-4 mb-16">
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Een greep uit onze recente installaties in Zoetermeer en omgeving:
              wandunits, vloermodellen, multi-splitsystemen en maatwerk — allemaal
              gefotografeerd door ons eigen team, direct na oplevering.
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Uit respect voor de privacy van onze klanten delen wij geen adressen
              of herkenbare persoonlijke details.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Project cases */}
        <div className="space-y-8 md:space-y-12 mb-20">
          {PROJECTS.map((project) => (
            <ProjectCase key={project.slug} project={project} />
          ))}
        </div>
      </div>

      <CTABanner
        heading="Ook zo'n strakke installatie?"
        description="Vertel ons wat u zoekt — wij komen vrijblijvend langs voor een opname en een offerte op maat."
      />
    </main>
  );
}
