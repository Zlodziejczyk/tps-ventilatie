import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { findBySlug } from "@/lib/services/registry";
import { Icon } from "@/components/Icon";
import { CTABanner } from "@/components/CTABanner";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";
import { REVIEWS } from "@/lib/reviews";

export const metadata = buildMetadata(findBySlug("/over-ons")!);

// Initials for the review avatar — derived from the name. The consolidated
// reviews source (lib/reviews.ts) dropped the old per-row `initials` field;
// this mirrors ReviewCarousel's getInitials.
function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function OverOnsPage() {
  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <AnimateOnScroll>
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 font-label">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-primary">Over Ons</span>
        </nav>

        <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-on-surface mb-8">
          Over <span className="text-primary">Ons</span>
        </h1>
        </AnimateOnScroll>

        {/* About Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <AnimateOnScroll>
          <div className="space-y-6">
            <p className="text-lg text-on-surface-variant leading-relaxed">
              TPS Ventilatie is opgericht door Thomas, een ervaren en gecertificeerde ventilatiespecialist gevestigd in Zoetermeer. Met jarenlange ervaring in de branche bieden wij hoogwaardige oplossingen voor ventilatie, mechanische afzuiging en airconditioning.
            </p>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Wij geloven dat schone lucht geen luxe is, maar een noodzaak voor een gezond binnenklimaat. Daarom combineren wij vakmanschap met persoonlijke aandacht — elke klus wordt met dezelfde toewijding en precisie uitgevoerd.
            </p>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Ons werkgebied strekt zich uit over de regio Zoetermeer en omstreken, inclusief Den Haag, Leiden, Delft en Rotterdam. Wij staan bekend om onze snelle service, transparante tarieven en eerlijk advies.
            </p>
          </div>
          </AnimateOnScroll>

          <StaggerChildren className="space-y-6">
            {[
              { icon: "workspace_premium", title: "Gecertificeerd", desc: "Opgeleid volgens de nieuwste normen voor ventilatie en koeltechniek." },
              { icon: "speed", title: "Snel & Betrouwbaar", desc: "Wij streven naar een afspraak binnen 48 uur." },
              { icon: "handshake", title: "Persoonlijk Contact", desc: "U heeft altijd rechtstreeks contact met Thomas." },
              { icon: "payments", title: "Transparante Prijzen", desc: "Geen verborgen kosten — wat u ziet is wat u betaalt." },
            ].map((item) => (
              <StaggerItem key={item.title}>
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name={item.icon} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm">{item.desc}</p>
                </div>
              </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        {/* Reviews */}
        <section className="mb-24">
          <AnimateOnScroll>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
              KLANTVERTELLEN
            </div>
            <h2 className="text-4xl font-extrabold font-headline">
              Wat klanten over ons zeggen
            </h2>
          </div>
          </AnimateOnScroll>

          <StaggerChildren className="grid md:grid-cols-3 gap-8">
            {REVIEWS.slice(0, 3).map((review) => (
              <StaggerItem key={review.name}>
              <div className="bg-surface-container-low p-8 rounded-3xl">
                <div className="flex text-yellow-500 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" filled />
                  ))}
                </div>
                <p className="text-on-surface italic mb-8 leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold">
                    {getInitials(review.name)}
                  </div>
                  <div>
                    <p className="font-bold">{review.name}</p>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                      Geverifieerde Klant
                    </p>
                  </div>
                </div>
              </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      </div>

      <CTABanner
        heading="Klaar voor een gezonder binnenklimaat?"
        description="Neem vrijblijvend contact op. Wij denken graag met u mee over de beste oplossing."
      />
    </main>
  );
}
