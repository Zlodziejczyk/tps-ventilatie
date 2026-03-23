import Link from "next/link";
import { Icon } from "@/components/Icon";

export function HeroSection() {
  return (
    <header className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold uppercase tracking-widest mb-6">
              <Icon name="air" filled className="text-sm" />
              Clean Air Technology
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold font-headline text-on-surface leading-[1.1] mb-6 tracking-tight">
              TPS Ventilatie — <span className="text-primary">Uw Ventilatie</span>specialist
            </h1>

            <p className="text-xl text-on-surface-variant mb-10 leading-relaxed font-light">
              Specialist in installatie, onderhoud en advies voor een gezonde leefomgeving. Wij optimaliseren uw binnenklimaat met precisie en zorg.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/diensten"
                className="signature-gradient text-on-primary px-8 py-4 rounded-xl font-bold text-lg text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                Onze Diensten
              </Link>
              <Link
                href="/tarieven"
                className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg text-center hover:bg-surface-container-highest transition-colors"
              >
                Bekijk Tarieven
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 border-t border-outline-variant/30 pt-8">
              <div className="flex items-center gap-2">
                <Icon name="bolt" filled className="text-tertiary" />
                <span className="font-semibold text-sm uppercase tracking-wider">Snel afspraak</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="payments" filled className="text-tertiary" />
                <span className="font-semibold text-sm uppercase tracking-wider">Geen voorrijkosten</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="verified_user" filled className="text-tertiary" />
                <span className="font-semibold text-sm uppercase tracking-wider">Ervaren Team</span>
              </div>
            </div>
          </div>

          {/* Right side — image placeholder */}
          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-5xl bg-surface-container-low overflow-hidden shadow-2xl relative">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-tertiary/10 flex items-center justify-center">
                <Icon name="air" className="text-8xl text-primary/20" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 max-w-xs border border-surface-container-high">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center">
                <Icon name="eco" filled className="text-tertiary" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Luchtkwaliteit Status</p>
                <p className="text-xs text-tertiary font-medium">Optimaal &amp; Gezond</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative circle */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 pointer-events-none">
        <svg fill="none" height="600" viewBox="0 0 600 600" width="600">
          <circle cx="300" cy="300" r="250" stroke="url(#heroGrad)" strokeDasharray="20 20" strokeWidth="2" />
          <defs>
            <linearGradient id="heroGrad" x1="300" x2="300" y1="50" y2="550" gradientUnits="userSpaceOnUse">
              <stop stopColor="#006580" />
              <stop offset="1" stopColor="#006B42" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </header>
  );
}
