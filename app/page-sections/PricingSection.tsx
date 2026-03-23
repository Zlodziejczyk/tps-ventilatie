import Link from "next/link";

export function PricingSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold font-headline mb-4">Transparante Tarieven</h2>
          <p className="text-on-surface-variant text-lg">
            Geen verrassingen achteraf. Duidelijke prijzen voor topkwaliteit en installatie.
          </p>
        </div>

        {/* Ventilatie Pricing */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* WTW */}
          <div className="bg-surface-container-lowest border-2 border-transparent hover:border-primary/20 transition-all rounded-5xl p-10 shadow-sm relative overflow-hidden group">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">WTW Vervanging</h3>
              <p className="text-on-surface-variant font-medium">Volledige ontzorging voor uw systeem</p>
            </div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-lg font-bold">vanaf</span>
              <span className="text-5xl font-extrabold text-primary">€1450</span>
              <span className="text-on-surface-variant font-medium">incl. BTW</span>
            </div>
            <ul className="space-y-4 mb-10">
              {["Nieuwe A-merk WTW unit", "Professionele montage", "Inregelen ventielen", "Afvoer oude unit"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">check</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="block w-full text-center py-4 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-colors"
            >
              Vraag Offerte Aan
            </Link>
          </div>

          {/* MV */}
          <div className="bg-surface-container-lowest border-2 border-transparent hover:border-primary/20 transition-all rounded-5xl p-10 shadow-sm relative overflow-hidden group">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">MV Vervanging</h3>
              <p className="text-on-surface-variant font-medium">Stille en krachtige basisventilatie</p>
            </div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-lg font-bold">vanaf</span>
              <span className="text-5xl font-extrabold text-primary">€480</span>
              <span className="text-on-surface-variant font-medium">incl. BTW</span>
            </div>
            <ul className="space-y-4 mb-10">
              {["Nieuwe energiezuinige MV-box", "Draadloze bediening", "Installatie & checkup", "Klein materiaal inbegrepen"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">check</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="block w-full text-center py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors"
            >
              Plan Afspraak
            </Link>
          </div>
        </div>

        {/* Airco Pricing */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-outline-variant flex-1" />
            <h3 className="text-2xl font-bold font-headline text-on-surface-variant">Airconditioning Systemen</h3>
            <div className="h-px bg-outline-variant flex-1" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Single-split */}
            <div className="bg-surface-container-low border-2 border-primary/10 hover:border-primary/40 transition-all rounded-5xl p-10 shadow-sm">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Single-split Systeem</h3>
                <p className="text-on-surface-variant font-medium">Ideaal voor de woonkamer of slaapkamer</p>
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-lg font-bold">vanaf</span>
                <span className="text-5xl font-extrabold text-primary">€1.650</span>
                <span className="text-on-surface-variant font-medium">incl. BTW</span>
              </div>
              <ul className="space-y-4 mb-10">
                {["A-merk unit (Daikin/Mitsubishi)", "Incl. montage tot 5 meter", "Geïntegreerde WiFi module", "Koelen én verwarmen"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">check</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="signature-gradient block w-full text-center py-4 text-on-primary rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                Offerte Aanvragen
              </Link>
            </div>

            {/* Multi-split */}
            <div className="bg-surface-container-low border-2 border-primary/10 hover:border-primary/40 transition-all rounded-5xl p-10 shadow-sm">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Multi-split Systeem</h3>
                <p className="text-on-surface-variant font-medium">Klimaatbeheersing in meerdere ruimtes</p>
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-lg font-bold">vanaf</span>
                <span className="text-5xl font-extrabold text-primary">€2.850</span>
                <span className="text-on-surface-variant font-medium">incl. BTW</span>
              </div>
              <ul className="space-y-4 mb-10">
                {["Voor 2 binnenunits", "Inclusief professionele montage", "Extreem energiezuinig", "Geluidsarme buitenunit"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">check</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block w-full text-center py-4 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors"
              >
                Plan Adviesgesprek
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-on-surface-variant text-sm font-medium italic">
          * Alle prijzen zijn inclusief BTW, voorrijkosten en klein materiaal. Montageprijzen zijn indicatief.
        </p>
      </div>
    </section>
  );
}
