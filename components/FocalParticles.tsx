"use client";

import { useRef, useEffect, useState } from "react";
import { useParticleEngine } from "@/lib/useParticleEngine";
import { FanSVG } from "./FanSVG";

export function FocalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useParticleEngine(canvasRef, {
    maxParticles: 200,
    spawnRate: 24,
    fanCenter: { x: 0.45, y: 0.5 },
    fanRadius: 0.22,
    cursorReactive: isDesktop,
    mode: "focal",
  });

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
      <FanSVG className="absolute inset-0 w-[65%] h-[65%] m-auto pointer-events-none" />
    </div>
  );
}
