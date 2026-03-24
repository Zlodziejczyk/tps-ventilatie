import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CTABanner } from "@/components/CTABanner";
import { PricingTabs } from "@/components/PricingTabs";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Tarieven",
  description:
    "Transparante prijzen voor ventilatie en airconditioning — inclusief BTW en voorrijkosten.",
};

export default function TarievenPage() {
  return (
    <main className="pt-28 pb-20">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 mb-16">
        <AnimateOnScroll>
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-label">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-primary">Tarieven</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-on-primary-fixed mb-4">
              Onze Tarieven
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Transparante prijzen — inclusief BTW, voorrijkosten en klein materiaal. Geen verrassingen achteraf.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-high px-5 py-3 rounded-xl border border-outline-variant/20">
            <Icon name="verified" filled className="text-tertiary" />
            <span className="text-sm font-semibold text-on-surface">Geen verborgen kosten. Wat u ziet is wat u betaalt.</span>
          </div>
        </div>
        </AnimateOnScroll>
      </header>

      <AnimateOnScroll>
      <Suspense>
        <PricingTabs />
      </Suspense>
      </AnimateOnScroll>

      {/* Bottom CTA */}
      <div className="mt-32">
        <CTABanner
          heading="Klaar voor schone lucht?"
          description="Vraag direct een vrijblijvende offerte aan of neem contact op voor advies op maat. Onze specialisten staan voor u klaar."
        />
      </div>

      {/* Disclaimer */}
      <AnimateOnScroll>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="text-sm text-on-surface-variant max-w-2xl mx-auto space-y-2">
          <p>* Alle genoemde prijzen zijn inclusief 21% BTW, voorrijkosten en klein materiaal.</p>
          <p>Wij zijn werkzaam in een straal van 50km rondom onze hoofdlocatie. Buiten deze regio geldt een kleine toeslag.</p>
        </div>
      </div>
      </AnimateOnScroll>
    </main>
  );
}
