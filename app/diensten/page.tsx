import { buildMetadata } from "@/lib/seo/metadata";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";
import { ServiceCard } from "@/components/ServiceCard";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { CTABanner } from "@/components/CTABanner";
import { pillars, urlFor, findBySlug } from "@/lib/services/registry";
import { REVIEWS } from "@/lib/reviews";

// Hub node is status:"draft" → builder emits noindex,follow and excludes it from
// the sitemap; it auto-flips to indexed when Phase 4 publishes it (single lever, D-02).
export const metadata = buildMetadata(findBySlug("/diensten")!);

// Lean /diensten hub (D-02): a clean router into the 4 pillar pages. The old
// anchored single-page sections and the scroll-spy navigator are retired
// (D-09); their rich content now lives per-route (seeded in 02-06).
export default function DienstenPage() {
  return (
    <main className="pt-28 pb-20">
      {/* Hero */}
      <AnimateOnScroll
        as="header"
        className="relative px-6 mb-16 max-w-7xl mx-auto overflow-hidden"
      >
        <div
          className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface tracking-tight mb-6 text-balance">
            Onze <span className="text-primary">diensten</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
            Van airconditioning en warmtepompen tot WTW en mechanische
            ventilatie — kies uw vakgebied en ontdek wat TPS voor u kan
            betekenen.
          </p>
        </div>
      </AnimateOnScroll>

      {/* 4 pillar cards — the routes into each pillar page */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <h2 className="sr-only">Onze vakgebieden</h2>
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars().map((pillar) => (
            <StaggerItem key={urlFor(pillar)}>
              <div className="relative h-full">
                {pillar.pillarSlug === "warmtepompen" && (
                  <span className="absolute top-3 right-3 z-10 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Nieuw
                  </span>
                )}
                <ServiceCard
                  icon={pillar.icon}
                  title={pillar.navTitle}
                  description={pillar.navDescription}
                  primaryAction={{
                    label: `Bekijk ${pillar.navTitle.toLowerCase()}`,
                    href: urlFor(pillar),
                  }}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Trust / reviews strip (D-12) */}
      <section className="bg-surface-container-low py-20 mb-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                KLANTVERHALEN
              </div>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface">
                Wat klanten over ons zeggen
              </h2>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.15}>
            <ReviewCarousel reviews={REVIEWS} />
          </AnimateOnScroll>
        </div>
      </section>

      <CTABanner
        heading="Niet zeker welke dienst u nodig heeft?"
        description="Neem vrijblijvend contact op voor advies op maat. Onze specialisten helpen u graag de juiste keuze te maken voor uw situatie."
      />
    </main>
  );
}
