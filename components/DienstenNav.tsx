"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "wtw", label: "WTW Unit", mobileLabel: "WTW" },
  { id: "mechanisch", label: "Mechanische Ventilatie", mobileLabel: "MV" },
  { id: "airco", label: "Airconditioning", mobileLabel: "Airco", badge: "Nieuw" },
];

export function DienstenNav() {
  const [activeId, setActiveId] = useState("wtw");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="sticky top-[72px] z-40 bg-surface/80 backdrop-blur-md border-y border-outline-variant/20 mb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-baseline gap-x-4 sm:gap-x-8 py-4 whitespace-nowrap">
          {SECTIONS.map(({ id, label, mobileLabel, badge }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`font-medium pb-4 transition-all text-sm sm:text-base flex items-baseline gap-1 sm:gap-2 ${
                activeId === id
                  ? "text-primary font-semibold border-b-2 border-primary -mb-[18px]"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="sm:hidden">{mobileLabel}</span>
              <span className="hidden sm:inline">{label}</span>
              {badge && (
                <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider air-pulse relative top-[-1px]">
                  {badge}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
