import { Icon } from "@/components/Icon";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";

const USPs = [
  {
    icon: "workspace_premium",
    title: "Meer dan 10 Jaar Ervaring",
    description: "Ruim tien jaar gespecialiseerd in ventilatie. Van WTW-units tot dakventilatoren — wij kennen elk systeem door en door.",
  },
  {
    icon: "tune",
    title: "Merk-onafhankelijk Advies",
    description: "Wij werken met alle grote merken: Itho Daalderop, Zehnder en Orcon. U krijgt altijd het best passende systeem voor uw situatie.",
  },
  {
    icon: "local_shipping",
    title: "Geen Voorrijkosten",
    description: "Werkgebied tot 60 km vanuit Zoetermeer. Voorrijkosten? Daar doen wij niet aan. Wat u ziet is wat u betaalt.",
  },
  {
    icon: "bolt",
    title: "Snel ter Plaatse",
    description: "Geen lange wachttijden. Wij kunnen op korte termijn al bij u langskomen voor inspectie, onderhoud of installatie.",
  },
];

export function WhyTPSSection() {
  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl" />
            <AnimateOnScroll>
            <h2 className="text-4xl lg:text-5xl font-extrabold font-headline mb-8 tracking-tight leading-tight">
              Waarom kiezen voor <span className="text-primary">TPS Ventilatie</span>?
            </h2>
            </AnimateOnScroll>
            <StaggerChildren className="space-y-8">
              {USPs.map((usp) => (
                <StaggerItem key={usp.title}>
                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-center">
                    <Icon name={usp.icon} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{usp.title}</h4>
                    <p className="text-on-surface-variant">{usp.description}</p>
                  </div>
                </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>

          {/* Work photos grid */}
          <AnimateOnScroll delay={0.2}>
          <div className="relative">
            <div className="bg-surface-container-highest rounded-4xl p-4 lg:p-8 aspect-square flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full h-full">
                {/* Top-left: TPS at work */}
                <div className="rounded-2xl overflow-hidden shadow-lg relative">
                  <Image
                    src="/images/work/tpsventilatie-work.jpg"
                    alt="TPS Ventilatie aan het werk"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top-right: Before cleaning */}
                <div className="rounded-2xl overflow-hidden shadow-lg relative translate-y-8">
                  <Image
                    src="/images/work/kanalen-voor.jpg"
                    alt="Ventilatiekanaal voor reiniging"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom-left: After cleaning */}
                <div className="rounded-2xl overflow-hidden shadow-lg relative -translate-y-4">
                  <Image
                    src="/images/work/kanalen-na.jpg"
                    alt="Ventilatiekanaal na reiniging"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom-right: Styled card */}
                <div className="rounded-2xl overflow-hidden shadow-lg bg-surface-container-low translate-y-4 flex flex-col items-center justify-center gap-3 p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="photo_camera" className="text-primary" />
                  </div>
                  <p className="text-sm font-bold text-on-surface text-center leading-snug">
                    Voor &amp; Na Foto&apos;s bij elke klus
                  </p>
                </div>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
