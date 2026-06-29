"use client";

import { useEffect, useState } from "react";

// SSR-safe gate for heavy (WebGL / canvas) motion. Returns false on the server
// AND on the first client render, then flips to true only after mount when the
// viewport is desktop (>= minWidth) AND prefers-reduced-motion is no-preference.
//
// Initializing to false guarantees (a) no hydration mismatch and (b) mobile / SSR
// / reduced-motion always render the cheap static fallback — the heavy component
// is never mounted there (QA-06; the likeliest INP offender). This hook is the
// reusable seam Phase 6 inherits for its own hero motion.
export function useEnableHeavyMotion(minWidth = 768): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(`(min-width:${minWidth}px)`);
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(desktop.matches && motionOk.matches);
    update();
    desktop.addEventListener("change", update);
    motionOk.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      motionOk.removeEventListener("change", update);
    };
  }, [minWidth]);

  return enabled;
}
