"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/constants";
import { Icon } from "@/components/Icon";

// Lazy-mounted Google Maps embed at the VERIFIED business pin (SITE.geo). Renders
// a lightweight placeholder until it scrolls near the viewport, then swaps in the
// keyless iframe — so the map costs nothing above the fold (QA-05 / CWV).
//
// The agency MAY swap the programmatic embed below for the official GBP
// "Embed a map" iframe (verified business name card) — same component, different
// src — if preferred.
export function LazyMap() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyless embed built from the verified coordinates — never a hardcoded literal.
  const src = `https://www.google.com/maps?q=${SITE.geo.lat},${SITE.geo.lng}&z=15&output=embed`;

  return (
    <div
      ref={ref}
      className="h-64 overflow-hidden rounded-2xl bg-surface-container-low"
    >
      {visible ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${SITE.name} locatie - ${SITE.address}, ${SITE.postcode} ${SITE.city}`}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-on-surface-variant"
          aria-hidden
        >
          <Icon name="map" className="text-4xl" />
        </div>
      )}
    </div>
  );
}
