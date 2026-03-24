"use client";

import { useReducedMotion } from "framer-motion";

export function FanSVG({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  const bladeCount = 5;
  const blades = Array.from({ length: bladeCount }, (_, i) => {
    const angle = (i * 360) / bladeCount;
    return (
      <path
        key={i}
        d="M50 47 C52 38, 56 28, 54 18 C53 16, 50 16, 49 18 C46 28, 44 38, 46 47 Z"
        fill="#006580"
        opacity="0.25"
        stroke="#006580"
        strokeWidth="0.5"
        strokeLinejoin="round"
        transform={`rotate(${angle} 50 50)`}
      />
    );
  });

  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#006580"
          strokeWidth="0.8"
          strokeDasharray="3 5"
          opacity="0.2"
        />

        {/* Inner housing ring */}
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="#006580"
          strokeWidth="0.5"
          opacity="0.12"
        />

        {/* Spinning blades + hub as one solid piece */}
        <g
          className={prefersReducedMotion ? "" : "animate-fan-spin"}
        >
          {/* Hub disc behind blades */}
          <circle cx="50" cy="50" r="8" fill="#006580" opacity="0.25" />
          {blades}
          {/* Hub center dot */}
          <circle cx="50" cy="50" r="3" fill="#006580" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
