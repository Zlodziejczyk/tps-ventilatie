"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

type Tab = "wtw" | "mv" | "airco";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "wtw", label: "WTW Unit", icon: "air" },
  { id: "mv", label: "Mechanische Ventilatie", icon: "mode_fan" },
  { id: "airco", label: "Airconditioning", icon: "ac_unit" },
];

const WTW_UNITS = [
  { name: "Itho HRU 200", subtitle: "Basis model", price: "€ 1.849,-", features: ["Capaciteit: 200 m³/h", "Rendement: 92%", "Installatietijd: 3-4 uur"], popular: false },
  { name: "Zehnder E300/400", subtitle: "All-round topper", price: "€ 2.195,-", features: ["Capaciteit: 300/400 m³/h", "Rendement: 96%", "Uit voorraad leverbaar"], popular: true },
  { name: "Zehnder Q350/450", subtitle: "Premium serie", price: "€ 2.645,-", features: ["Capaciteit: Tot 450 m³/h", "Ultra stil ontwerp", "Smart App control"], popular: false },
  { name: "Orcon HRC 400", subtitle: "Eco-vriendelijk", price: "€ 2.395,-", features: ["Capaciteit: 400 m³/h", "Maximale energiezuinigheid", "Compact design"], popular: false },
];

const ONDERHOUD = [
  { label: "Klein Onderhoud", price: "€ 149,-", description: "Reiniging van filters en ventilatoren in de unit.", popular: false },
  { label: "Groot Onderhoud", price: "€ 249,-", description: "Unit reinigen, inregelen en controle van alle componenten.", popular: true, extras: ["Filterset inclusief", "Volledige systeemcheck"] },
  { label: "Kanalen Reinigen", price: "€ 399,-", description: "Mechanische borstelreiniging van alle luchtkanalen in huis.", popular: false },
];

const INREGELEN = [
  { label: "Basis", price: "€ 125,-", description: "Luchtmeting op 4 punten." },
  { label: "Compleet", price: "€ 195,-", description: "Volledige balancering hele woning." },
  { label: "Compleet + CO2", price: "€ 275,-", description: "Inregelen incl. sensor optimalisatie." },
];

export function PricingTabs() {
  const [active, setActive] = useState<Tab>("wtw");

  return (
    <>
      {/* Tab buttons */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold whitespace-nowrap transition-all ${
                active === tab.id
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* WTW Tab */}
      {active === "wtw" && (
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {/* WTW Vervangen */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-headline">WTW Unit Vervangen</h2>
              <span className="text-sm bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-bold">
                Inclusief Installatie
              </span>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-8 -mx-2 px-2">
              {WTW_UNITS.map((unit) => (
                <div
                  key={unit.name}
                  className={`min-w-[320px] rounded-2xl p-6 flex flex-col ${
                    unit.popular
                      ? "bg-white shadow-2xl shadow-primary/10 border-2 border-primary relative scale-105 z-10"
                      : "bg-surface-container-lowest shadow-sm border border-transparent hover:border-primary/20 transition-all"
                  }`}
                >
                  {unit.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      Populaire keuze
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold font-headline text-on-primary-fixed">{unit.name}</h3>
                    <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{unit.subtitle}</span>
                  </div>
                  <div className="text-4xl font-extrabold text-primary mb-6">{unit.price}</div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {unit.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Icon name="check_circle" filled className="text-tertiary text-lg" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`w-full py-3 rounded-lg font-bold text-center block ${
                      unit.popular
                        ? "signature-gradient text-white shadow-lg shadow-primary/30"
                        : "border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                    }`}
                  >
                    {unit.popular ? "Vraag offerte aan" : "Selecteren"}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Onderhoud & Reinigen */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-headline">Onderhoud &amp; Reinigen</h2>
              <p className="text-on-surface-variant">Houd uw binnenklimaat gezond met periodiek onderhoud.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ONDERHOUD.map((item) => (
                <div
                  key={item.label}
                  className={`p-8 rounded-3xl relative ${
                    item.popular
                      ? "bg-surface-container-lowest border-2 border-tertiary shadow-xl"
                      : "bg-surface-container-low group"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3 right-6 bg-tertiary text-white px-3 py-1 rounded-full text-xs font-bold">
                      Meest gekozen
                    </div>
                  )}
                  <div className={`font-bold mb-2 ${item.popular ? "text-tertiary" : "text-primary"}`}>{item.label}</div>
                  <div className={`text-3xl font-extrabold mb-4 ${item.popular ? "text-primary" : ""}`}>{item.price}</div>
                  <p className="text-sm text-on-surface-variant mb-6">{item.description}</p>
                  {item.extras && (
                    <ul className="space-y-2 mb-6 text-sm">
                      {item.extras.map((e) => (
                        <li key={e} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-tertiary text-sm">check</span> {e}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.popular && (
                    <Link href="/contact" className="w-full py-2 bg-tertiary text-white rounded-lg font-bold text-center block">
                      Direct boeken
                    </Link>
                  )}
                  {!item.popular && <div className="h-1 w-0 group-hover:w-full bg-primary transition-all duration-300" />}
                </div>
              ))}
            </div>
          </section>

          {/* Inregelen */}
          <section className="bg-surface-container-highest/30 p-10 rounded-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold font-headline mb-4">Ventilatie Inregelen</h2>
                <p className="text-sm text-on-surface-variant">Zorg voor de juiste luchtbalans in elke ruimte. Cruciaal voor comfort en energiebesparing.</p>
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                {INREGELEN.map((item) => (
                  <div key={item.label} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-on-surface-variant uppercase mb-1">{item.label}</div>
                    <div className="text-2xl font-bold text-primary mb-2">{item.price}</div>
                    <p className="text-xs">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* MV Tab */}
      {active === "mv" && (
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <Icon name="mode_fan" className="text-6xl text-primary/30 mb-4 block mx-auto" />
            <h2 className="text-3xl font-bold font-headline mb-4">Mechanische Ventilatie</h2>
            <p className="text-on-surface-variant mb-8 max-w-xl mx-auto">
              Voor tarieven voor mechanische ventilatie vervanging en onderhoud, neem contact met ons op voor een offerte op maat.
            </p>
            <Link href="/contact" className="signature-gradient text-on-primary px-8 py-4 rounded-xl font-bold inline-block">
              Offerte Aanvragen
            </Link>
          </div>
        </div>
      )}

      {/* Airco Tab */}
      {active === "airco" && (
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-on-primary-fixed text-white rounded-4xl p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="relative z-10 md:w-1/2">
              <div className="inline-flex items-center gap-2 bg-tertiary/20 text-tertiary-fixed-dim px-4 py-1 rounded-full text-xs font-bold mb-6">
                <span className="animate-pulse w-2 h-2 rounded-full bg-tertiary" />
                NIEUW IN ONS ASSORTIMENT
              </div>
              <h2 className="text-4xl font-headline font-bold mb-6">Airconditioning Installatie</h2>
              <p className="text-blue-100/70 mb-8 leading-relaxed">
                Wij leveren en installeren hoogwaardige split-systemen voor een perfect klimaat, het hele jaar door.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <span className="font-bold">Single Split (Basis)</span>
                  <span className="text-2xl font-extrabold text-primary-fixed">v.a. € 1.550,-</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <span className="font-bold">Multi Split (2-3 ruimtes)</span>
                  <span className="text-2xl font-extrabold text-primary-fixed">v.a. € 2.850,-</span>
                </div>
              </div>
              <Link href="/contact" className="signature-gradient text-white px-8 py-4 rounded-xl font-bold inline-block mt-8 shadow-lg">
                Offerte Aanvragen
              </Link>
            </div>
            <div className="md:w-1/2 relative flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center">
                <Icon name="ac_unit" className="text-7xl text-primary-fixed mb-4 block" />
                <p className="text-lg font-bold">Premium A-merken</p>
                <p className="text-sm text-primary-fixed/70">Daikin &bull; Mitsubishi &bull; Panasonic</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
