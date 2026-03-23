import Link from "next/link";
import { Icon } from "@/components/Icon";

export function ServicesSection() {
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold font-headline mb-4 tracking-tight">
              Onze Diensten
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Wij bieden gespecialiseerde oplossingen voor elk type woning, van renovatie tot nieuwbouw.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* WTW */}
          <div className="md:col-span-6 bg-surface-container-lowest p-10 rounded-4xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 text-tertiary">
                <Icon name="heat_pump" filled />
                <span className="font-bold text-sm uppercase">Warmteterugwinning</span>
              </div>
              <h3 className="text-3xl font-bold font-headline mb-4">WTW Unit Installatie</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Maximale energiebesparing en constant verse lucht. Wij vervangen en onderhouden alle grote merken WTW units met uiterste precisie.
              </p>
            </div>
            <div className="mt-12">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  Merk-onafhankelijk advies
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  Volledige inregeling
                </li>
              </ul>
            </div>
          </div>

          {/* MV */}
          <div className="md:col-span-6 bg-primary p-10 rounded-4xl text-on-primary flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 text-primary-fixed">
                <Icon name="cyclone" filled />
                <span className="font-bold text-sm uppercase">Mechanische Ventilatie</span>
              </div>
              <h3 className="text-3xl font-bold font-headline mb-4">MV-Box Vervangen</h3>
              <p className="text-primary-fixed/80 leading-relaxed">
                Stille, krachtige afzuiging voor badkamer, keuken en toilet. Verhoog uw wooncomfort direct met een energiezuinige oplossing.
              </p>
            </div>
            <div className="mt-8 relative z-10">
              <span className="text-5xl font-extrabold opacity-20 absolute -right-4 -bottom-4">MV</span>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Airco */}
          <div className="md:col-span-12 bg-white p-10 rounded-4xl border-2 border-primary/10 shadow-sm flex flex-col md:flex-row gap-8 items-center group hover:shadow-md transition-shadow overflow-hidden relative">
            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 text-primary">
                <Icon name="ac_unit" filled />
                <span className="font-bold text-sm uppercase">Klimaatbeheersing</span>
              </div>
              <h3 className="text-3xl font-bold font-headline mb-4">Airconditioning</h3>
              <p className="text-on-surface-variant leading-relaxed max-w-2xl">
                Koelen en verwarmen met hoog rendement. Wij installeren split-units van gerenommeerde A-merken zoals <strong>Daikin</strong> en <strong>Mitsubishi</strong>. Comfort in elk seizoen, fluisterstil en energiezuinig.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {["Koelen & Verwarmen", "WiFi Besturing", "A++ Energielabel"].map((feat) => (
                  <span key={feat} className="px-4 py-2 bg-surface-container rounded-lg text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">check</span>
                    {feat}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>

          {/* Small features */}
          <div className="md:col-span-4 bg-surface-container-highest p-8 rounded-4xl">
            <span className="material-symbols-outlined text-primary mb-4 text-4xl block">cleaning_services</span>
            <h4 className="text-xl font-bold mb-2">Kanaalreiniging</h4>
            <p className="text-on-surface-variant text-sm">Verwijder stof, schimmels en bacteriën uit uw luchtslangen voor optimale hygiëne.</p>
          </div>
          <div className="md:col-span-4 bg-surface-container-highest p-8 rounded-4xl">
            <span className="material-symbols-outlined text-primary mb-4 text-4xl block">settings_input_component</span>
            <h4 className="text-xl font-bold mb-2">Onderhoud</h4>
            <p className="text-on-surface-variant text-sm">Periodieke controles voor een levenslange optimale werking van uw systemen.</p>
          </div>
          <div className="md:col-span-4 bg-tertiary p-8 rounded-4xl text-on-tertiary">
            <Icon name="insights" filled className="mb-4 text-4xl block" />
            <h4 className="text-xl font-bold mb-2">Advies op maat</h4>
            <p className="opacity-80 text-sm">Altijd de beste oplossing voor uw specifieke woonsituatie en budget.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
