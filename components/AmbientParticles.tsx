"use client";

import { useRef } from "react";
import { useParticleEngine } from "@/lib/useParticleEngine";

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useParticleEngine(canvasRef, {
    maxParticles: 25,
    spawnRate: 1.5,
    fanCenter: { x: 0.5, y: 0.5 },
    fanRadius: 0,
    cursorReactive: false,
    mode: "ambient",
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
