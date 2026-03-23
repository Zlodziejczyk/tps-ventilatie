import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CTABanner } from "@/components/CTABanner";

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

export default function DienstenPage() {
  return (
    <main className="pt-24">
      {/* Hero Header */}
      <header className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
      </header>

      {/* Sticky Category Nav */}
      <div className="sticky top-[72px] z-40 bg-surface/80 backdrop-blur-md border-y border-outline-variant/20 mb-12">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex space-x-8 py-4 whitespace-nowrap">
            <a href="#wtw" className="text-primary font-semibold border-b-2 border-primary pb-4 -mb-[18px] transition-all">WTW Unit</a>
            <a href="#mechanisch" className="text-on-surface-variant hover:text-primary font-medium pb-4 transition-all">Mechanische Ventilatie</a>
            <a href="#airco" className="group flex items-center space-x-2 text-on-surface-variant hover:text-primary font-medium pb-4 transition-all">
              <span>Airconditioning</span>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider air-pulse">Nieuw</span>
            </a>
          </div>
        </div>
      </div>

      {/* Section 1: WTW Unit */}
      <section className="max-w-7xl mx-auto px-6 mb-32 scroll-mt-32" id="wtw">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
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
          </div>

          <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
            {/* Vervangen */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-tertiary/5 rounded-bl-3xl group-hover:bg-tertiary/10 transition-colors" />
              <span className="material-symbols-outlined text-primary text-3xl mb-4 block">sync_alt</span>
              <h3 className="text-xl font-bold mb-3">Vervangen</h3>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Uw oude unit vervangen voor een modern, fluisterstil en energiezuinig model.</p>
              <div className="flex flex-col gap-2">
                <Link href="/tarieven" className="w-full py-2 text-center text-primary font-bold text-sm border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">Bekijk tarieven</Link>
                <Link href="/contact" className="w-full py-2 text-center signature-gradient text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity">Direct aanvragen</Link>
              </div>
            </div>
            {/* Onderhoud */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
              <span className="material-symbols-outlined text-primary text-3xl mb-4 block">build_circle</span>
              <h3 className="text-xl font-bold mb-3">Onderhoud/Reinigen</h3>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">Grondige reiniging van filters, ventilatoren en het kanalensysteem voor maximale hygiëne.</p>
              <div className="flex flex-col gap-2">
                <Link href="/tarieven" className="w-full py-2 text-center text-primary font-bold text-sm border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">Bekijk tarieven</Link>
                <Link href="/contact" className="w-full py-2 text-center signature-gradient text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity">Direct aanvragen</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Inregelen banner */}
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-tertiary">
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-tertiary text-4xl">air_purifier</span>
            <div>
              <h4 className="font-bold text-lg">Inregelen (Luchtbalans)</h4>
              <p className="text-on-surface-variant">Wij stellen uw WTW unit nauwkeurig af met geavanceerde meetapparatuur.</p>
            </div>
          </div>
          <Link href="/tarieven" className="hidden md:block px-6 py-2 bg-white font-bold text-primary rounded-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            Meer info
          </Link>
        </div>
      </section>

      {/* Section 2: Mechanische Ventilatie */}
      <section className="bg-surface-container-low py-24 scroll-mt-32" id="mechanisch">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl font-headline font-bold text-on-surface mb-6 flex items-center gap-3">
              <Icon name="cyclone" className="text-primary text-4xl" />
              Mechanische Ventilatie
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Efficiënte afzuiging in badkamer, keuken en toilet is essentieel om schimmel en vochtproblemen te voorkomen. Wij zorgen dat uw systeem weer op volle kracht draait.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "cleaning_services", title: "Onderhoud & Reinigen", items: ["Reinigen van de ventilatiebox", "Kanalen mechanisch ragen", "Inmeten van de ventielen"] },
              { icon: "settings_input_component", title: "Ventilatiebox Vervangen", items: ["Itho Daalderop of Zehnder", "Inclusief draadloze bediening", "Zeer energiezuinige EC-motoren"] },
              { icon: "roofing", title: "Dakventilator", items: ["Inspectie van dakdoorvoer", "Reparatie van mechanische delen", "Upgrade naar slimme sturing"] },
            ].map((card) => (
              <div key={card.title} className="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full border border-transparent hover:border-primary/10 transition-all shadow-sm">
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
                <Link href="/tarieven" className="w-full py-3 text-center bg-surface-container text-primary font-bold rounded-lg hover:bg-surface-container-high transition-colors block">
                  Dienst bekijken
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Airconditioning */}
      <section className="py-24 max-w-7xl mx-auto px-6 scroll-mt-32" id="airco">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AIRCO_CARDS.map((card) => (
            <div key={card.title} className="group bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300">
              <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl mb-6 block">{card.icon}</span>
              <h4 className="font-bold text-lg mb-3">{card.title}</h4>
              <p className="text-sm opacity-80 mb-6">{card.description}</p>
              <Link href="/contact" className="text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                Lees meer <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <CTABanner
        heading="Niet zeker welke dienst u nodig heeft?"
        description="Neem vrijblijvend contact op voor advies op maat. Onze specialisten helpen u graag de juiste keuze te maken voor uw situatie."
      />
    </main>
  );
}
