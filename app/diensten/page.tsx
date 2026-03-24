import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTABanner } from "@/components/CTABanner";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";
import { DienstenNav } from "@/components/DienstenNav";

export const metadata: Metadata = {
  title: "Diensten",
  description:
    "Van ventilatie tot airconditioning — alle diensten van TPS Ventilatie onder één dak.",
};

const AIRCO_CARDS = [
  { icon: "hvac", title: "Installatie", description: "Complete montage van Single of Multi-split systemen in uw woning of kantoor." },
  { icon: "precision_manufacturing", title: "Onderhoud", description: "Voorkom storingen en nare geurtjes door een jaarlijkse checkup en reiniging." },
  { icon: "troubleshoot", title: "Reparatie & Storing", description: "Snelle hulp bij lekkages, vreemde geluiden of systemen die niet meer koelen." },
  { icon: "lightbulb", title: "Advies", description: "Vrijblijvende opname op locatie om de beste positie en capaciteit te bepalen." },
];

const WTW_REPLACEMENT_STEPS = [
  "Demonteren en afvoeren oude WTW unit",
  "Reinigen van luchtkanalen",
  "Monteren nieuwe WTW unit (wandbeugel of montagestoel)",
  "Aanpassen luchtkanalen indien nodig",
  "Aansluiten condensafvoer",
  "Instelling en configuratie",
  "Testen van nieuwe installatie",
  "Inregelen per ruimte volgens bouwbesluit normen",
  "Werkplek schoon opleveren",
  "Gebruiksinstructies voor bewoner",
];

const MV_BENEFITS = [
  "Een gezond binnenklimaat",
  "Minder stof in uw woning",
  "Langere levensduur systeem",
  "Minder gezondheidsproblemen",
  "Een lagere energierekening per jaar",
  "Een lager CO2-gehalte in uw woning",
  "Minder lawaai vanuit uw ventilatie",
];

const MV_CLEANING_REASONS = [
  "Voorkom gezondheidsklachten",
  "Voorkom ongedierte in huis",
  "Voorkom extra onderhoudswerk",
];

export default function DienstenPage() {
  return (
    <main className="pt-28 pb-20">
      {/* Hero Header */}
      <header className="relative px-6 mb-16 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <AnimateOnScroll>
          <div className="relative z-10">
            <nav aria-label="Breadcrumb" className="flex mb-6 text-sm font-medium text-outline">
              <ol className="flex items-center space-x-2">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                  <span className="text-on-surface">Diensten</span>
                </li>
              </ol>
            </nav>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface tracking-tight mb-6 text-balance">
              Onze <span className="text-primary">Diensten</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
              Van ventilatie tot airconditioning — alles onder één dak voor een perfect binnenklimaat.
            </p>
          </div>
        </AnimateOnScroll>
      </header>

      {/* Sticky Category Nav */}
      <DienstenNav />

      {/* Section 1: WTW Unit */}
      <section className="max-w-7xl mx-auto px-6 mb-32 scroll-mt-32" id="wtw">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <AnimateOnScroll className="lg:col-span-5">
            <h2 className="text-3xl font-headline font-bold text-on-surface mb-6 flex items-center gap-3">
              <Icon name="energy_savings_leaf" className="text-primary text-4xl" />
              WTW Unit (Warmteterugwinning)
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
              Een WTW-systeem zorgt voor een gezonde balans tussen luchtkwaliteit en energiebesparing. Wij verzorgen het complete traject van installatie tot periodiek onderhoud.
            </p>
            <div className="space-y-4">
              {["Tot 95% warmteterugwinning uit afgezogen lucht", "Optimale vochtbalans in uw woning", "Gecertificeerde monteurs voor alle merken"].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Icon name="check_circle" filled className="text-tertiary" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <div className="lg:col-span-7">
            <StaggerChildren className="grid md:grid-cols-2 gap-6">
              {/* Vervangen */}
              <StaggerItem>
                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-tertiary/5 rounded-bl-3xl group-hover:bg-tertiary/10 transition-colors" />
                  <span className="material-symbols-outlined text-primary text-3xl mb-4 block">sync_alt</span>
                  <h3 className="text-xl font-bold mb-3">Vervangen</h3>
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Uw oude unit vervangen voor een modern, fluisterstil en energiezuinig model.</p>
                  <div className="flex flex-col gap-2">
                    <Link href="/tarieven?tab=wtw#wtw-vervangen" className="w-full py-2 text-center text-primary font-bold text-sm border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">Bekijk tarieven</Link>
                    <Link href="/contact" className="w-full py-2 text-center signature-gradient text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity">Offerte Aanvragen</Link>
                  </div>
                </div>
              </StaggerItem>
              {/* Onderhoud */}
              <StaggerItem>
                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                  <span className="material-symbols-outlined text-primary text-3xl mb-4 block">build_circle</span>
                  <h3 className="text-xl font-bold mb-3">Onderhoud/Reinigen</h3>
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Grondige reiniging van filters, ventilatoren en het kanalensysteem voor maximale hygiëne.</p>
                  <div className="flex flex-col gap-2">
                    <Link href="/tarieven?tab=wtw#wtw-onderhoud" className="w-full py-2 text-center text-primary font-bold text-sm border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">Bekijk tarieven</Link>
                    <Link href="/contact" className="w-full py-2 text-center signature-gradient text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity">Offerte Aanvragen</Link>
                  </div>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </div>

        {/* Inregelen banner */}
        <AnimateOnScroll>
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-tertiary">
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-tertiary text-4xl">air_purifier</span>
            <div>
              <h4 className="font-bold text-lg">Inregelen (Luchtbalans)</h4>
              <p className="text-on-surface-variant">Wij stellen uw WTW unit nauwkeurig af met geavanceerde meetapparatuur.</p>
            </div>
          </div>
          <Link href="/tarieven?tab=wtw#wtw-onderhoud" className="hidden md:block px-6 py-2 bg-white font-bold text-primary rounded-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            Bekijk Tarieven
          </Link>
        </div>
        </AnimateOnScroll>

        {/* WTW Enrichment: When to replace + Step-by-step */}
        <div className="mt-16 space-y-12">
          {/* When to replace */}
          <AnimateOnScroll>
          <div className="bg-surface-container-low rounded-2xl p-8 md:p-10">
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-6 flex items-center gap-3">
              <Icon name="schedule" className="text-primary text-3xl" />
              Wanneer uw WTW unit vervangen?
            </h3>
            <p className="text-on-surface-variant leading-relaxed mb-6 max-w-3xl">
              Een WTW unit gaat gemiddeld 15 tot 20 jaar mee. Na deze periode neemt de prestatie merkbaar af en stijgt het energieverbruik. Regelmatig onderhoud — zoals het schoonhouden van filters en ventielen — verlengt de levensduur aanzienlijk.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: "speed", label: "Verminderde ventilatie-effectiviteit" },
                { icon: "volume_up", label: "Ongebruikelijke geluiden uit het systeem" },
                { icon: "warning", label: "Regelmatige storingen of defecten" },
              ].map((sign) => (
                <div key={sign.label} className="bg-surface-container-lowest rounded-xl p-5 flex items-start gap-3">
                  <Icon name={sign.icon} className="text-tertiary text-2xl shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-on-surface">{sign.label}</span>
                </div>
              ))}
            </div>
          </div>
          </AnimateOnScroll>

          {/* Replacement steps */}
          <AnimateOnScroll>
          <div className="bg-surface-container-low rounded-2xl p-8 md:p-10">
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-8 flex items-center gap-3">
              <Icon name="list_alt" className="text-primary text-3xl" />
              Zo werkt vervanging: stap voor stap
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {WTW_REPLACEMENT_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-4 bg-surface-container-lowest rounded-xl p-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-on-surface leading-relaxed pt-1">{step}</span>
                </div>
              ))}
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Section 2: Mechanische Ventilatie */}
      <section className="bg-surface-container-low py-24 scroll-mt-32" id="mechanisch">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll className="mb-16 max-w-3xl">
            <h2 className="text-3xl font-headline font-bold text-on-surface mb-6 flex items-center gap-3">
              <Icon name="cyclone" className="text-primary text-4xl" />
              Mechanische Ventilatie
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Efficiënte afzuiging in badkamer, keuken en toilet is essentieel om schimmel en vochtproblemen te voorkomen. Wij zorgen dat uw systeem weer op volle kracht draait.
            </p>
          </AnimateOnScroll>
          <StaggerChildren className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "cleaning_services", title: "Onderhoud & Reinigen", items: ["Reinigen van de ventilatiebox", "Kanalen mechanisch ragen", "Inmeten van de ventielen"], href: "/tarieven?tab=mv#mv-onderhoud" },
              { icon: "settings_input_component", title: "Ventilatiebox Vervangen", items: ["Itho Daalderop of Zehnder", "Inclusief draadloze bediening", "Zeer energiezuinige EC-motoren"], href: "/tarieven?tab=mv#mv-vervangen" },
              { icon: "roofing", title: "Dakventilator", items: ["Inspectie van dakdoorvoer", "Reparatie van mechanische delen", "Upgrade naar slimme sturing"], href: "/tarieven?tab=mv#mv-dakventilator" },
            ].map((card) => (
              <StaggerItem key={card.title}>
              <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border border-transparent hover:border-primary/10 transition-all shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Icon name={card.icon} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{card.title}</h3>
                <ul className="text-sm text-on-surface-variant space-y-3 mb-8 flex-grow">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={card.href} className="w-full py-3 text-center bg-surface-container text-primary font-bold rounded-lg hover:bg-surface-container-high transition-colors block">
                  Bekijk Tarieven
                </Link>
              </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* MV Enrichment: Benefits + Cleaning method */}
          <div className="mt-16 space-y-12">
            {/* Benefits after maintenance */}
            <AnimateOnScroll>
            <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-8 flex items-center gap-3">
                <Icon name="thumb_up" className="text-primary text-3xl" />
                Voordelen na professioneel onderhoud
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MV_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 bg-surface-container-low rounded-xl p-4">
                    <Icon name="check_circle" filled className="text-tertiary shrink-0" />
                    <span className="text-sm font-medium text-on-surface">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            </AnimateOnScroll>

            {/* Cleaning method + why it matters */}
            <AnimateOnScroll>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10">
                <h3 className="text-xl font-headline font-bold text-on-surface mb-4 flex items-center gap-3">
                  <Icon name="auto_fix_high" className="text-primary text-2xl" />
                  Professionele reinigingsmethode
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  Wij reinigen uw ventilatiekanalen door middel van een <strong className="text-on-surface">roterende borstel</strong>. Deze methode levert snel resultaat, biedt een grondige professionele reiniging en verwijdert al het vuil uit de kanalen.
                </p>
                <div className="flex items-center gap-3 text-sm text-tertiary font-semibold">
                  <Icon name="verified" filled className="text-tertiary" />
                  Snel, grondig en professioneel
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10">
                <h3 className="text-xl font-headline font-bold text-on-surface mb-4 flex items-center gap-3">
                  <Icon name="priority_high" className="text-primary text-2xl" />
                  Waarom reiniging belangrijk is
                </h3>
                <div className="space-y-4">
                  {MV_CLEANING_REASONS.map((reason) => (
                    <div key={reason} className="flex items-center gap-3 bg-surface-container-low rounded-xl p-4">
                      <Icon name="shield" filled className="text-tertiary shrink-0" />
                      <span className="text-sm font-medium text-on-surface">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </AnimateOnScroll>

            {/* Dakventilator info block */}
            <AnimateOnScroll>
            <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-6 flex items-center gap-3">
                <Icon name="roofing" className="text-primary text-3xl" />
                Alles over uw dakventilator
              </h3>
              <div className="grid lg:grid-cols-2 gap-10">
                <div>
                  <p className="text-on-surface-variant leading-relaxed mb-6">
                    Een dakventilator zorgt voor goede ventilatie en voorkomt dat vervuilde lucht in huis blijft hangen. Regelmatig onderhoud is essentieel voor een gezond binnenklimaat.
                  </p>
                  <div className="space-y-4">
                    {[
                      { icon: "event_repeat", text: "Minimaal iedere 4 jaar (uiterlijk 5 jaar) een complete reiniging en onderhoud" },
                      { icon: "swap_horiz", text: "Vervang uw dakventilator wanneer deze 15 jaar of ouder is" },
                      { icon: "bolt", text: "Oude dakventilatoren werken op wisselstroom en verbruiken tot 80% meer energie" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-start gap-3 bg-surface-container-low rounded-xl p-4">
                        <Icon name={item.icon} className="text-tertiary text-2xl shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-on-surface leading-relaxed">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Before/After photos */}
                <div>
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Resultaat van professionele reiniging</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-surface-container">
                      <Image
                        src="/images/work/kanalen-voor.jpg"
                        alt="Ventilatiekanalen voor reiniging — zichtbaar vuil en stof"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-on-surface/60 text-white text-xs font-bold text-center py-2 backdrop-blur-sm">
                        Voor reiniging
                      </span>
                    </div>
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-surface-container">
                      <Image
                        src="/images/work/kanalen-na.jpg"
                        alt="Ventilatiekanalen na reiniging — schoon en vrij van stof"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-tertiary/80 text-white text-xs font-bold text-center py-2 backdrop-blur-sm">
                        Na reiniging
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Section 3: Airconditioning */}
      <section className="py-24 max-w-7xl mx-auto px-6 scroll-mt-32" id="airco">
        <AnimateOnScroll>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-tertiary-fixed text-on-tertiary-fixed text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">Premium Partner</span>
              <span className="h-px w-12 bg-outline-variant" />
              <span className="text-on-surface-variant text-sm font-medium">Daikin &bull; Mitsubishi &bull; Panasonic</span>
            </div>
            <h2 className="text-4xl font-headline font-bold text-on-surface mb-6">Airconditioning &amp; Koeling</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Geniet het hele jaar door van de perfecte temperatuur. Van duurzame verwarming in de winter tot ijzige koelte in de zomer.
            </p>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl flex items-center gap-4">
            <Icon name="ac_unit" className="text-primary text-3xl" />
            <span className="font-bold text-primary">Vandaag aangevraagd, snel geïnstalleerd!</span>
          </div>
        </div>
        </AnimateOnScroll>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AIRCO_CARDS.map((card) => (
            <StaggerItem key={card.title}>
            <div className="group bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl mb-6 block">{card.icon}</span>
              <h4 className="font-bold text-lg mb-3">{card.title}</h4>
              <p className="text-sm opacity-80 mb-6">{card.description}</p>
              <Link href="/contact" className="text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                Lees meer <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <CTABanner
        heading="Niet zeker welke dienst u nodig heeft?"
        description="Neem vrijblijvend contact op voor advies op maat. Onze specialisten helpen u graag de juiste keuze te maken voor uw situatie."
      />
    </main>
  );
}
