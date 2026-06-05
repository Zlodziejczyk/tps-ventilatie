import { buildMetadata } from "@/lib/seo/metadata";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";
import { ServiceCard } from "@/components/ServiceCard";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import type { Review } from "@/components/ReviewCarousel";
import { CTABanner } from "@/components/CTABanner";
import { pillars, urlFor, findBySlug } from "@/lib/services/registry";

// Hub node is status:"draft" → builder emits noindex,follow and excludes it from
// the sitemap; it auto-flips to indexed when Phase 4 publishes it (single lever, D-02).
export const metadata = buildMetadata(findBySlug("/diensten")!);

// D-12: the hub trust strip reuses the existing reviews. REVIEWS in
// app/page-sections/ReviewsSection.tsx is a PRIVATE const (not exported), so the
// array is copied verbatim here per the plan. Phase 4 (CONT-08) consolidates to
// one shared source + Google score/count/link.
const REVIEWS: Review[] = [
  {
    name: "Jacqueline Overwater",
    quote:
      "De opdracht 's middags geplaatst, om half 8 kwam Thomas al langs. Hij heeft alles nagemeten. Hardstikke bedankt Thomas voor deze snelle goede service!",
    timeAgo: "2 maanden geleden",
  },
  {
    name: "Herman Melander",
    quote:
      "TPS Ventilatie heeft bij ons een WTW-installatie geplaatst en naar goed. Uitstekend werk geleverd, netjes en snel. Goede communicatie vooraf en tijdens de werkzaamheden.",
    timeAgo: "3 maanden geleden",
  },
  {
    name: "Albert Terstegs",
    quote:
      "Goede en snelle communicatie. Enorm netjes en gedetailleerd opgeleverd. Was een veel grotere klus dan verwacht, maar toch heel goed opgelost!",
    timeAgo: "2 maanden geleden",
  },
  {
    name: "Christine te Kamp",
    quote:
      "Een fijne vakman waar je op kunt bouwen. Alles keurig netjes gedaan. Het ventilatiesysteem werkt nu weer als nieuw!",
    timeAgo: "4 maanden geleden",
  },
  {
    name: "Koen van Dijk",
    quote:
      "TPS was supersnel om ons te helpen. Tomasz zat erg netjes met alles. Super blij met het resultaat en de service. Echte vakman!",
    timeAgo: "3 maanden geleden",
  },
  {
    name: "Daan Hazelzet",
    quote:
      "Thomasz heeft het oude ventilatie systeem vervangen met een nieuwe met twee afstandsbedieningen. Netjes gehangen in twee uur. Erg blij mee.",
    timeAgo: "5 maanden geleden",
  },
  {
    name: "Lois Lovelle",
    quote:
      "TPS Ventilatie heeft een hele fijne service. Thomas is zeer vakkundig en werkt netjes en snel. Goede communicatie en een eerlijke prijs. Aanrader!",
    timeAgo: "3 maanden geleden",
  },
  {
    name: "Marko de Ridder",
    quote:
      "Fantastisch werk! Thomas heeft ons ventilatiesysteem gereinigd en van nieuwe filters voorzien. Heel professioneel en werkt heel netjes. Echt een topvakman!",
    timeAgo: "6 maanden geleden",
  },
  {
    name: "Jan Arends",
    quote:
      "Super tevreden over de werkzaamheden van TPS. Goede communicatie, vakkundig uitgevoerd. Alles keurig netjes en opgeruimd achtergelaten. Zeer zeker een aanrader.",
    timeAgo: "4 maanden geleden",
  },
  {
    name: "Anneke van Maasland",
    quote:
      "Hele fijne ervaring gehad met TPS ventilatie, ons probleem is super vakkundig en snel opgelost. Eerlijke prijs en goede communicatie. Zeer aan te bevelen!",
    timeAgo: "5 maanden geleden",
  },
  {
    name: "Ton Kooremans",
    quote:
      "Goede TOP vakman, zeer beleefd, werkt snel en laat alles heel netjes achter. Hij heeft het ventilatiesysteem vervangen en alle kanalen schoongemaakt. Echt een aanrader!",
    timeAgo: "7 maanden geleden",
  },
  {
    name: "Roel Leijssen",
    quote:
      "Snel geschakeld en goede service gehad van TPS Ventilatie. Het ventilatiesysteem is goed gecontroleerd en gereinigd. Komt zeker terug!",
    timeAgo: "4 maanden geleden",
  },
  {
    name: "Marcella B",
    quote:
      "Top service! Snelle reactie, goede communicatie en vakkundig werk. Ons ventilatiesysteem draait weer als een zonnetje. Zeer tevreden!",
    timeAgo: "6 maanden geleden",
  },
  {
    name: "Fred Dongen",
    quote:
      "Prima vakman! Heel netjes gewerkt, professioneel en goede communicatie. Het ventilatiesysteem werkt nu perfect. Zeker een aanrader.",
    timeAgo: "5 maanden geleden",
  },
  {
    name: "Helena Bakker",
    quote:
      "Thomas is een echte vakman. Eerlijk advies, nette uitvoering en goede service. Alles in één keer goed en netjes opgeruimd. Top!",
    timeAgo: "3 maanden geleden",
  },
  {
    name: "Bianca van Vlijt",
    quote:
      "Erg blij met de snelle en vakkundige service. Eerlijke prijzen en goede communicatie. Het resultaat is top. Zeker een aanrader!",
    timeAgo: "7 maanden geleden",
  },
  {
    name: "Linda Kossen",
    quote:
      "Super tevreden! Thomas werkt zeer netjes en professioneel. Het ventilatiesysteem is helemaal nagekeken en schoongemaakt. Alles werkt nu weer perfect.",
    timeAgo: "4 maanden geleden",
  },
];

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
