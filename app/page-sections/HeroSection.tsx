"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { SoftAurora } from "@/components/SoftAurora";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const, delay },
});

const heroWords = [
  "Ventilatie",
  "Airconditioning",
  "Warmteterugwinning",
  "Luchtkwaliteit",
] as const;

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [wordIndex]);

  return (
    <header className="relative min-h-[85vh] flex items-center justify-center px-6 py-28 xl:py-40 overflow-hidden">
      {/* Aurora background — centered behind hero content */}
      <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
        <div className="w-[120%] h-[80%]">
          <SoftAurora
            speed={0.6}
            scale={1.2}
            brightness={0.9}
            color1="#a8dff0"
            color2="#b8e8d0"
            noiseFrequency={2.0}
            noiseAmplitude={1.2}
            bandHeight={0.5}
            bandSpread={1.5}
            octaveDecay={0.15}
            layerOffset={0.3}
            colorSpeed={0.6}
            enableMouseInteraction
            mouseInfluence={0.2}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Frosted glass backdrop */}
        <div className="absolute inset-0 -mx-8 -my-8 sm:-mx-14 sm:-my-10 rounded-3xl bg-surface-container-lowest/60 backdrop-blur-xl" />

        <div className="relative">
          {/* Badge */}
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Icon name="air" filled className="text-sm" />
            Clean Air Technology
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.1)}
            className="text-3xl sm:text-4xl md:text-5xl xl:text-[4rem] font-extrabold font-headline text-on-surface leading-[1.1] mb-6 tracking-tight"
          >
            Uw specialist in
            <span className="relative block w-full h-[1.15em] overflow-hidden">
              {heroWords.map((word, index) => (
                <motion.span
                  key={word}
                  className="absolute inset-x-0 text-primary font-extrabold"
                  initial={{ opacity: 0, y: "100%" }}
                  animate={
                    wordIndex === index
                      ? { y: "0%", opacity: 1 }
                      : { y: wordIndex > index ? "-100%" : "100%", opacity: 0 }
                  }
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-base sm:text-lg xl:text-xl text-on-surface-variant mb-8 xl:mb-10 leading-relaxed font-light max-w-2xl mx-auto"
          >
            Specialist in installatie, onderhoud en advies voor een gezonde
            leefomgeving. Wij optimaliseren uw binnenklimaat met precisie en
            zorg.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/diensten"
              className="btn-hover signature-gradient text-on-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-center shadow-lg hover:shadow-xl transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Onze Diensten
            </Link>
            <Link
              href="/tarieven"
              className="bg-surface-container-high text-on-surface px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-center hover:bg-surface-container-highest transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Bekijk Tarieven
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Trust badge pills — positioned below the frosted glass card */}
      <motion.div
        {...fadeUp(0.5)}
        className="absolute bottom-8 xl:bottom-12 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3"
      >
        {[
          { icon: "bolt", label: "Snel afspraak" },
          { icon: "payments", label: "Geen voorrijkosten" },
          { icon: "verified_user", label: "Ervaren Team" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/60 backdrop-blur-lg"
          >
            <Icon name={icon} filled className="text-tertiary text-base" />
            <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-on-surface whitespace-nowrap">
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </header>
  );
}
