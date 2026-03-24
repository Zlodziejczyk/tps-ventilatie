"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icon";

type Tab = "wtw" | "mv" | "airco";

const TABS: { id: Tab; label: string; mobileLabel: string; icon: string }[] = [
  { id: "wtw", label: "WTW Unit", mobileLabel: "WTW", icon: "air" },
  { id: "mv", label: "Mechanische Ventilatie", mobileLabel: "MV", icon: "mode_fan" },
  { id: "airco", label: "Airconditioning", mobileLabel: "Airco", icon: "ac_unit" },
];

const WTW_UNITS = [
  {
    name: "Itho Daalderop HRU 200 ECO",
    image: "/images/wtw/hru-200-eco.jpg",
    price: "€ 1.450,-",
    highlight: "Vuilfilterindicatie",
    specs: ["Capaciteit: 200 m³/h", "Rendement: 87%", "Installatietijd: 3–5 uur"],
    features: ["Vakkundige installatie", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    name: "Itho Daalderop HRU 350 ECO",
    image: "/images/wtw/hru-350-eco.jpg",
    price: "€ 1.650,-",
    highlight: "Vuilfilterindicatie",
    specs: ["Capaciteit: 350 m³/h", "Rendement: 89,3%", "Installatietijd: 3–5 uur"],
    features: ["Vakkundige installatie", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    name: "Itho Daalderop HRU 300 ECO",
    image: "/images/wtw/hru-300-eco.jpg",
    price: "€ 2.400,-",
    highlight: "Vuilfilterindicatie",
    specs: ["Capaciteit: 300 m³/h", "Rendement: 91,2%", "Installatietijd: 3–5 uur"],
    features: ["Vakkundige installatie", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    name: "Zehnder Comfoair E300/400",
    image: "/images/wtw/zehnder-comfoair-e.jpg",
    price: "€ 2.700,-",
    highlight: "Super stil",
    specs: ["Capaciteit: 350/450/600 m³/h", "Rendement: 98,6%", "Installatietijd: 3–5 uur"],
    features: ["Vakkundige installatie", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: true,
  },
  {
    name: "Zehnder Comfoair Q350/450/600",
    image: "/images/wtw/zehnder-comfoair-q.jpg",
    price: "€ 3.500,-",
    highlight: "Ingebouwde vochtsensor",
    specs: ["Capaciteit: 350/450/600 m³/h", "Rendement: 98,6%", "Installatietijd: 3–5 uur"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    name: "Orcon HRC Ecomax 300/400",
    image: "/images/wtw/orcon-ecomax.jpg",
    price: "€ 2.200,-",
    highlight: "Boven- en zijaansluitingen",
    specs: ["Capaciteit: 300/400 m³/h", "Rendement: 99,3%", "Installatietijd: 3–5 uur"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
];

const WTW_ONDERHOUD = [
  {
    label: "WTW Klein Onderhoud",
    price: "€ 180,-",
    time: "45–90 minuten",
    features: ["Onderhoud WTW unit", "Onderhoud warmtewisselaar", "Reinigen afvoer- en toevoermotor", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Foto's voor en na", "Uitleg en advies"],
    popular: false,
  },
  {
    label: "WTW Groot Onderhoud",
    price: "€ 280,-",
    time: "60–120 minuten",
    features: ["Onderhoud WTW unit", "Onderhoud warmtewisselaar", "Reinigen afvoer- en toevoermotor", "Reinigen afzuig kanalen", "Inspectie toevoer kanalen", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Inregelen volgens bouwbesluit", "Foto's voor en na", "Uitleg en advies"],
    popular: true,
  },
  {
    label: "WTW Kanalen Reinigen",
    price: "€ 200,-",
    time: "45–90 minuten",
    features: ["Reinigen afzuig kanalen", "Inspectie toevoer kanalen", "Foto's voor en na", "Uitleg en advies"],
    popular: false,
  },
];

const MV_ONDERHOUD = [
  {
    label: "MV Groot Onderhoud",
    price: "€ 195,-",
    features: ["Grondig reinigen ventilatiebox", "Inspectie ventilatiebox", "Reinigen ventielen", "Afstellen ventielen", "Reinigen ventilatiekanalen", "Inregelen systeem", "Voor & na foto's", "Uitleg en advies"],
    popular: true,
  },
  {
    label: "MV Klein Onderhoud",
    price: "€ 105,-",
    features: ["Grondig reinigen ventilatiebox", "Inspectie ventilatiebox", "Afstellen ventielen", "Inregelen systeem", "Voor & na foto's", "Uitleg en advies"],
    popular: false,
  },
  {
    label: "MV Kanalen Reinigen",
    price: "€ 165,-",
    features: ["Reinigen ventilatiekanalen", "Voor & na foto's", "Energiebesparing"],
    popular: false,
  },
];

const MV_VERVANGEN = [
  {
    label: "Basis + Reinigen",
    image: "/images/mv/basis-reinigen.jpg",
    price: "€ 480,-",
    product: "Zehnder Comfofan Silent",
    specs: ["Capaciteit: 450 m³/h", "7 jaar garantie", "Inclusief vochtsensor", "Installatietijd: 45–90 min"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Inregelen ventilatiebox", "Reinigen en afstellen ventielen", "Reinigen luchtkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    label: "Compleet + Reinigen",
    image: "/images/mv/compleet-reinigen.jpg",
    price: "€ 540,-",
    product: "Zehnder Comfofan Silent",
    specs: ["Capaciteit: 450 m³/h", "7 jaar garantie", "Inclusief vochtsensor", "Installatietijd: 45–90 min"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Inclusief afstandsbediening", "4 nieuwe Zehnder ventielen", "Inregelen ventilatiebox", "Reinigen en afstellen ventielen", "Reinigen luchtkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: true,
  },
  {
    label: "Compleet + Reinigen + CO2",
    image: "/images/mv/compleet-reinigen-co2.jpg",
    price: "€ 850,-",
    product: "Zehnder Comfofan Silent",
    specs: ["Capaciteit: 450 m³/h", "7 jaar garantie", "Incl. vocht- en CO2-sensor", "Installatietijd: 60–120 min"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Externe CO2-sensor (220V)", "Inregelen ventilatiebox", "Reinigen en afstellen ventielen", "Reinigen luchtkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
];

const MV_DAKVENTILATOR = [
  {
    label: "Dakventilator Onderhoud",
    image: "/images/mv/dakventilator-onderhoud.jpg",
    price: "€ 190,-",
    features: ["Inspectie van dakventilator", "Reiniging van ventilatiekanalen", "Dakventilator schoon borstelen", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Inregelen volgens bouwbesluit", "Voor & na foto's", "Uitleg & ventilatieadvies"],
    popular: false,
  },
  {
    label: "Dakventilator Groot Onderhoud",
    image: "/images/mv/dakventilator-onderhoud.jpg",
    price: "€ 250,-",
    features: ["Inspectie van dakventilator", "Reiniging van ventilator", "Reiniging van ventilatiekanalen", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Inregelen volgens bouwbesluit", "Voor & na foto's", "Uitleg & ventilatieadvies"],
    popular: true,
  },
  {
    label: "Vervangen + Kanalen Reinigen",
    image: "/images/mv/dakventilator-vervangen.jpg",
    price: "€ 700,-",
    features: ["Nieuwe dakventilator", "Reiniging van ventilatiekanalen", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Inregelen volgens bouwbesluit", "Voor & na foto's", "Uitleg & ventilatieadvies"],
    popular: false,
  },
  {
    label: "Itho CVE ECO + Reinigen",
    image: "/images/mv/dakventilator-itho.jpg",
    price: "€ 450,-",
    features: ["Itho CVE ECO met vochtsensor", "Vakkundige montage", "Inclusief draadloze bediening", "5 jaar fabrieksgarantie", "Reinigen ventilatiekanalen", "Reinigen en afstellen ventielen", "Inregelen systeem", "Uitleg en advies"],
    popular: false,
  },
  {
    label: "Zehnder Comfofan Hydro + Reinigen",
    image: "/images/mv/dakventilator-zehnder.jpg",
    price: "€ 450,-",
    features: ["Zehnder Comfofan Hydro", "Vakkundige montage", "Inclusief draadloze bediening", "7 jaar fabrieksgarantie", "Reinigen ventilatiekanalen", "Reinigen en afstellen ventielen", "Inregelen systeem", "Uitleg en advies"],
    popular: false,
  },
];

export function PricingTabs() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tabFromUrl: Tab = tabParam === "airco" ? "airco" : tabParam === "mv" ? "mv" : "wtw";
  const [active, setActive] = useState<Tab>(tabFromUrl);
  const [prevUrl, setPrevUrl] = useState(tabFromUrl);
  if (tabFromUrl !== prevUrl) {
    setPrevUrl(tabFromUrl);
    setActive(tabFromUrl);
  }
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<Tab, HTMLButtonElement>>(new Map());

  const updateIndicator = useCallback(() => {
    const button = buttonRefs.current.get(active);
    const container = tabsRef.current;
    if (button && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left + container.scrollLeft,
        width: buttonRect.width,
      });
    }
  }, [active]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      requestAnimationFrame(() => {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    } else if (tabParam) {
      tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [active, tabParam]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <>
      {/* Tab buttons */}
      <section id="pricing-tabs" className="max-w-7xl mx-auto px-6 mb-12 scroll-mt-24">
        <div ref={tabsRef} className="relative flex gap-2 sm:gap-4 pb-2">
          <div
            className="absolute top-0 h-full rounded-full bg-primary shadow-xl shadow-primary/20 transition-all duration-300 ease-in-out"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          />
          {TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => { if (el) buttonRefs.current.set(tab.id, el); }}
              onClick={() => setActive(tab.id)}
              className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 sm:px-8 sm:py-4 rounded-full font-bold whitespace-nowrap transition-colors duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-xs sm:text-base flex-1 sm:flex-initial min-w-0 ${
                active === tab.id
                  ? "text-on-primary"
                  : "bg-surface-container-lowest text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              <span className="sm:hidden">{tab.mobileLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* WTW Tab */}
      {active === "wtw" && (
        <div className="max-w-7xl mx-auto px-6 space-y-20 animate-[fadeIn_0.3s_ease-in-out]">
          {/* WTW Vervangen */}
          <section id="wtw-vervangen" className="scroll-mt-32">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-headline">WTW Unit Vervangen</h2>
              <span className="text-sm bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-bold">
                Inclusief Installatie
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {WTW_UNITS.map((unit) => (
                <div
                  key={unit.name}
                  className={`rounded-2xl p-6 flex flex-col relative ${
                    unit.popular
                      ? "bg-surface-container-lowest shadow-2xl shadow-primary/10 ring-2 ring-primary z-10"
                      : "bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all"
                  }`}
                >
                  {unit.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                      Populaire keuze
                    </div>
                  )}
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={unit.image}
                      alt={unit.name}
                      width={400}
                      height={300}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <span className="inline-flex items-center gap-1 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold w-fit mb-3">
                    <Icon name="star" filled className="text-sm" />
                    {unit.highlight}
                  </span>
                  <h3 className="text-xl font-bold font-headline text-on-primary-fixed mb-2">{unit.name}</h3>
                  <ul className="space-y-1.5 mb-4">
                    {unit.specs.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="text-4xl font-extrabold text-primary mb-4">{unit.price}</div>
                  <div className="mb-6 flex-grow">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Inbegrepen in pakket</p>
                    <ul className="space-y-2">
                      {unit.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Icon name="check_circle" filled className="text-tertiary text-lg shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/contact"
                    className={`w-full py-3 rounded-lg font-bold text-center block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      unit.popular
                        ? "signature-gradient text-on-primary shadow-lg shadow-primary/30"
                        : "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all"
                    }`}
                  >
                    Offerte Aanvragen
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Onderhoud & Reinigen */}
          <section id="wtw-onderhoud" className="scroll-mt-32">
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-headline">Onderhoud &amp; Reinigen</h2>
              <p className="text-on-surface-variant">Houd uw binnenklimaat gezond met periodiek onderhoud.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WTW_ONDERHOUD.map((item) => (
                <div
                  key={item.label}
                  className={`p-8 rounded-3xl relative ${
                    item.popular
                      ? "bg-surface-container-lowest ring-2 ring-tertiary shadow-xl"
                      : "bg-surface-container-low group hover:shadow-md transition-shadow"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3 right-6 bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs font-bold">
                      Meest gekozen
                    </div>
                  )}
                  <div className={`font-bold mb-1 ${item.popular ? "text-tertiary" : "text-primary"}`}>{item.label}</div>
                  <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant mb-3">
                    <Icon name="schedule" className="text-sm" />
                    {item.time}
                  </span>
                  <div className={`text-3xl font-extrabold mb-4 ${item.popular ? "text-primary" : ""}`}>{item.price}</div>
                  <ul className="space-y-2.5 mb-6">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Icon name="check_circle" filled className="text-tertiary text-lg shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`w-full py-3 rounded-lg font-bold text-center block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      item.popular
                        ? "signature-gradient text-on-primary shadow-lg shadow-primary/30"
                        : "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all"
                    }`}
                  >
                    {item.popular ? "Direct Boeken" : "Offerte Aanvragen"}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* MV Tab */}
      {active === "mv" && (
        <div className="max-w-7xl mx-auto px-6 space-y-20 animate-[fadeIn_0.3s_ease-in-out]">
          {/* MV Onderhoud & Reinigen */}
          <section id="mv-onderhoud" className="scroll-mt-32">
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-headline">Onderhoud &amp; Reinigen</h2>
              <p className="text-on-surface-variant">Periodiek onderhoud voor een gezond en efficiënt ventilatiesysteem.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MV_ONDERHOUD.map((item) => (
                <div
                  key={item.label}
                  className={`p-8 rounded-3xl relative ${
                    item.popular
                      ? "bg-surface-container-lowest ring-2 ring-primary shadow-xl"
                      : "bg-surface-container-low group hover:shadow-md transition-shadow"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3 right-6 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold">
                      Meest gekozen
                    </div>
                  )}
                  <div className={`font-bold mb-2 ${item.popular ? "text-primary" : "text-on-surface"}`}>{item.label}</div>
                  <div className={`text-3xl font-extrabold mb-4 ${item.popular ? "text-primary" : ""}`}>{item.price}</div>
                  <ul className="space-y-2.5 mb-6">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Icon name="check_circle" filled className="text-tertiary text-lg shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`w-full py-3 rounded-lg font-bold text-center block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      item.popular
                        ? "signature-gradient text-on-primary shadow-lg shadow-primary/30"
                        : "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all"
                    }`}
                  >
                    {item.popular ? "Direct Boeken" : "Offerte Aanvragen"}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Info Banner */}
          <div className="bg-surface-container-low rounded-2xl p-6 flex items-center gap-4">
            <Icon name="info" className="text-2xl text-primary shrink-0" />
            <p className="text-sm text-on-surface-variant">
              Alle prijzen zijn inclusief BTW, voorrijkosten en klein materiaal. Werkgebied: straal van 100 km vanuit Zoetermeer.
            </p>
          </div>

          {/* MV Ventilatiebox Vervangen */}
          <section id="mv-vervangen" className="scroll-mt-32">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-headline">Ventilatiebox Vervangen</h2>
              <span className="text-sm bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-bold">
                Inclusief Installatie
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MV_VERVANGEN.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl p-6 flex flex-col relative ${
                    item.popular
                      ? "bg-surface-container-lowest shadow-2xl shadow-primary/10 ring-2 ring-primary z-10"
                      : "bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                      Populaire keuze
                    </div>
                  )}
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={item.image}
                      alt={item.label}
                      width={400}
                      height={300}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold font-headline text-on-primary-fixed mb-1">{item.label}</h3>
                  <p className="text-sm text-on-surface-variant font-medium mb-3">{item.product}</p>
                  <ul className="space-y-1.5 mb-4">
                    {item.specs.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="text-4xl font-extrabold text-primary mb-4">{item.price}</div>
                  <div className="mb-6 flex-grow">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Inbegrepen in pakket</p>
                    <ul className="space-y-2">
                      {item.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Icon name="check_circle" filled className="text-tertiary text-lg shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/contact"
                    className={`w-full py-3 rounded-lg font-bold text-center block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      item.popular
                        ? "signature-gradient text-on-primary shadow-lg shadow-primary/30"
                        : "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all"
                    }`}
                  >
                    Offerte Aanvragen
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Info Banner */}
          <div className="bg-surface-container-low rounded-2xl p-6 flex items-center gap-4">
            <Icon name="info" className="text-2xl text-primary shrink-0" />
            <p className="text-sm text-on-surface-variant">
              Alle prijzen zijn inclusief BTW, voorrijkosten en klein materiaal. Werkgebied: straal van 100 km vanuit Zoetermeer.
            </p>
          </div>

          {/* MV Dakventilator */}
          <section id="mv-dakventilator" className="scroll-mt-32">
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-headline">Dakventilator</h2>
              <p className="text-on-surface-variant">Onderhoud, vervanging en installatie van dakventilatoren.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MV_DAKVENTILATOR.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl p-6 flex flex-col relative ${
                    item.popular
                      ? "bg-surface-container-lowest shadow-2xl shadow-primary/10 ring-2 ring-primary z-10"
                      : "bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                      Meest gekozen
                    </div>
                  )}
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={item.image}
                      alt={item.label}
                      width={400}
                      height={300}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold font-headline text-on-primary-fixed mb-2">{item.label}</h3>
                  <div className="text-3xl font-extrabold text-primary mb-4">{item.price}</div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Icon name="check_circle" filled className="text-tertiary text-lg shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`w-full py-3 rounded-lg font-bold text-center block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      item.popular
                        ? "signature-gradient text-on-primary shadow-lg shadow-primary/30"
                        : "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-all"
                    }`}
                  >
                    Offerte Aanvragen
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Airco Tab */}
      {active === "airco" && (
        <div className="max-w-7xl mx-auto px-6 animate-[fadeIn_0.3s_ease-in-out]">
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
              <Link href="/contact" className="signature-gradient text-on-primary px-8 py-4 rounded-xl font-bold inline-block mt-8 shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
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
