import { buildMetadata } from "@/lib/seo/metadata";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceIntro } from "@/components/ServiceIntro";
import { ServiceSteps } from "@/components/ServiceSteps";
import { ServiceFAQ } from "@/components/ServiceFAQ";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { CTABanner } from "@/components/CTABanner";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { pillars, urlFor, findBySlug } from "@/lib/services/registry";
import { REVIEWS } from "@/lib/reviews";

// The hub's <head> comes from the single metadata seam, and its robots directive
// follows the node's status through isIndexable (08-02: one predicate, no
// exceptions). Published in 08-04 once this page could actually show its content.
export const metadata = buildMetadata(findBySlug("/diensten")!);

// The /diensten hub: a router into the 4 pillar pages that also ANSWERS the
// question a visitor arrives with — "which of these do I need?" (D-11/D-12). The
// hero and the 4 cards are unchanged; the authored intro, the shared TPS traject
// and the routing FAQs were appended in 08-04, never a rebuild.
//
// Every authored sentence renders here: the intro through ServiceIntro with
// includeLead (this page has its own hero, so the default mode would drop the
// lead sentence), the traject through ServiceSteps, the FAQs and the werkgebied
// line through ServiceFAQ. The FAQPage markup below is therefore backed by FAQs a
// visitor can actually see, which is what Google's structured-data policy requires
// (D-19). Only FAQPage + BreadcrumbList here: the hub is an umbrella page, not a
// Service, so it deliberately emits no Service node.
export default function DienstenPage() {
  const hub = findBySlug("/diensten")!;

  return (
    <main id="main" tabIndex={-1} className="pt-28 pb-20">
      {/* Per-page structured data (D-19) — server-rendered, no visual effect */}
      <JsonLd data={breadcrumbJsonLd(hub)} />
      {hub.content.faqs.length > 0 && <JsonLd data={faqJsonLd(hub)!} />}

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

      {/* Authored orientation copy — full intro incl. its lead sentence, because
          this page's hero is hardcoded markup rather than a ServiceHero */}
      <ServiceIntro node={hub} includeLead />

      {/* 4 pillar cards — the routes into each pillar page */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <h2 className="sr-only">Onze vakgebieden</h2>
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars().map((pillar) => (
            <StaggerItem key={urlFor(pillar)}>
              <div className="relative h-full">
                {pillar.pillarSlug === "warmtepompen" && (
                  <span className="absolute top-3 right-3 z-10 bg-tertiary-fixed text-on-tertiary-fixed text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
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

      {/* The shared TPS traject — true across all four disciplines (D-13) */}
      <ServiceSteps steps={hub.content.steps} />

      {/* Routing FAQs + werkgebied line (D-16/D-17) */}
      <ServiceFAQ faqs={hub.content.faqs} localAngle={hub.content.localAngle} />

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
