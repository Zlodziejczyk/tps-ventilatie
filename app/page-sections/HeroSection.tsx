"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { AmbientParticles } from "@/components/AmbientParticles";
import { FocalParticles } from "@/components/FocalParticles";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const, delay },
});

const heroWords = ["Ventilatie", "Airco", "WTW"] as const;

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [wordIndex]);

  return (
    <header className="relative pt-28 pb-16 px-6 xl:pt-48 xl:pb-32 overflow-hidden">
      {/* Ambient background particles — hidden on small screens */}
      <div className="absolute inset-0 -z-5 pointer-events-none hidden md:block">
        <AmbientParticles />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid xl:grid-cols-2 gap-8 xl:gap-12 items-center">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold uppercase tracking-widest mb-4 xl:mb-6">
              <Icon name="air" filled className="text-sm" />
              Clean Air Technology
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-extrabold font-headline text-on-surface leading-[1.1] mb-4 xl:mb-6 tracking-tight">
              TPS Ventilatie — Uw{" "}
              <span className="relative inline-block overflow-hidden align-bottom h-[1.1em]" style={{ width: `${heroWords.reduce((max, w) => Math.max(max, w.length), 0)}ch` }}>
                {heroWords.map((word, index) => (
                  <motion.span
                    key={word}
                    className="absolute left-0 text-primary"
                    initial={{ opacity: 0, y: 40 }}
                    animate={
                      wordIndex === index
                        ? { y: 0, opacity: 1 }
                        : { y: wordIndex > index ? -40 : 40, opacity: 0 }
                    }
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <br className="sm:hidden" />
              specialist
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-base sm:text-lg xl:text-xl text-on-surface-variant mb-8 xl:mb-10 leading-relaxed font-light">
              Specialist in installatie, onderhoud en advies voor een gezonde leefomgeving. Wij optimaliseren uw binnenklimaat met precisie en zorg.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 xl:mb-12">
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

            {/* Trust Badges */}
            <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 bg-surface-container-low/50 px-4 rounded-2xl py-4 sm:py-6">
              <div className="flex items-center gap-2">
                <Icon name="bolt" filled className="text-tertiary" />
                <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider">Snel afspraak</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="payments" filled className="text-tertiary" />
                <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider">Geen voorrijkosten</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="verified_user" filled className="text-tertiary" />
                <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider">Ervaren Team</span>
              </div>
            </motion.div>
          </div>

          {/* Right side — particle animation (desktop only, xl+) */}
          <div className="relative hidden xl:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
              className="aspect-square rounded-5xl bg-surface-container-low overflow-hidden shadow-2xl relative"
            >
              <FocalParticles />
            </motion.div>
            {/* Floating card */}
            <motion.div
              {...fadeUp(0.6)}
              className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-2xl shadow-xl flex items-center gap-4 max-w-xs"
            >
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center">
                <Icon name="eco" filled className="text-tertiary" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Luchtkwaliteit Status</p>
                <p className="text-xs text-tertiary font-medium">Optimaal &amp; Gezond</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </header>
  );
}
