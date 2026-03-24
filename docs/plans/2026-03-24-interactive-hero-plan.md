# Interactive Hero Particle Animation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the static hero image with an interactive canvas-based HVAC particle visualization showing dirty air being purified through a spinning fan.

**Architecture:** Two canvas layers (ambient background + focal particle system) with an SVG fan overlay. Canvas handles particle physics via `requestAnimationFrame`. Framer Motion animates the fan SVG and existing UI elements. Desktop gets cursor-reactive particles; mobile gets passive ambient particles only.

**Tech Stack:** HTML Canvas API, Framer Motion (already installed), React refs/hooks, SVG, TypeScript

**Design doc:** `docs/plans/2026-03-24-interactive-hero-design.md`

---

### Task 1: Create the Particle Engine Hook

**Files:**
- Create: `lib/useParticleEngine.ts`

**Step 1: Create the particle engine hook**

This hook manages the full particle lifecycle: spawning, physics, transformation, rendering. It takes a canvas ref and config object, and runs a `requestAnimationFrame` loop.

```typescript
"use client";

import { useEffect, useRef, useCallback } from "react";

export interface ParticleConfig {
  /** Max particles alive at once */
  maxParticles: number;
  /** Particles spawned per second */
  spawnRate: number;
  /** Center point of the fan (0-1 normalized coordinates) */
  fanCenter: { x: number; y: number };
  /** Fan radius in normalized coordinates */
  fanRadius: number;
  /** Whether cursor reactivity is enabled */
  cursorReactive: boolean;
  /** "ambient" mode: slower, more transparent, no fan interaction */
  mode: "focal" | "ambient";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  phase: "dirty" | "transforming" | "clean";
  life: number;
  maxLife: number;
}

const DIRTY_COLORS = ["#8B7355", "#A0896C", "#9B8567"];
const CLEAN_COLORS = ["#006580", "#006B42", "#257F9C"];
const AMBIENT_COLORS = ["#006580", "#006B42", "#257F9C", "#82d1f1", "#78daa3"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function useParticleEngine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  config: ParticleConfig
) {
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);

  const spawnParticle = useCallback(
    (width: number, height: number): Particle => {
      if (config.mode === "ambient") {
        return {
          x: Math.random() * width * 0.1,
          y: Math.random() * height,
          vx: 0.2 + Math.random() * 0.4,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 1 + Math.random() * 2,
          opacity: 0.08 + Math.random() * 0.12,
          color: randomFrom(AMBIENT_COLORS),
          phase: "clean",
          life: 0,
          maxLife: 600 + Math.random() * 400,
        };
      }

      // Focal mode — spawn dirty particle from left
      return {
        x: Math.random() * width * 0.05,
        y: height * 0.2 + Math.random() * height * 0.6,
        vx: 0.8 + Math.random() * 0.6,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 3 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.2,
        color: randomFrom(DIRTY_COLORS),
        phase: "dirty",
        life: 0,
        maxLife: 400 + Math.random() * 200,
      };
    },
    [config.mode]
  );

  const updateParticle = useCallback(
    (p: Particle, width: number, height: number): boolean => {
      p.life++;

      if (config.mode === "ambient") {
        p.x += p.vx;
        p.y += p.vy;
        // Fade in and out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) p.opacity = lerp(0, 0.15, lifeRatio / 0.1);
        else if (lifeRatio > 0.8) p.opacity = lerp(0.15, 0, (lifeRatio - 0.8) / 0.2);
        return p.x < width && p.life < p.maxLife;
      }

      // Focal mode
      const fanX = config.fanCenter.x * width;
      const fanY = config.fanCenter.y * height;
      const fanR = config.fanRadius * width;

      const dx = fanX - p.x;
      const dy = fanY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (p.phase === "dirty") {
        // Attract toward fan
        const attraction = 0.02;
        p.vx += (dx / dist) * attraction;
        p.vy += (dy / dist) * attraction;

        // Check if reached fan
        if (dist < fanR * 0.4) {
          p.phase = "transforming";
          p.life = 0;
          p.maxLife = 20 + Math.random() * 15;
        }
      } else if (p.phase === "transforming") {
        // Slow down near center
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.opacity = lerp(0.7, 0.3, p.life / p.maxLife);
        p.radius = lerp(4, 2, p.life / p.maxLife);

        // Transition color
        const t = p.life / p.maxLife;
        if (t > 0.5) {
          p.color = randomFrom(CLEAN_COLORS);
        }

        if (p.life >= p.maxLife) {
          p.phase = "clean";
          p.life = 0;
          p.maxLife = 200 + Math.random() * 150;
          p.color = randomFrom(CLEAN_COLORS);
          p.radius = 1.5 + Math.random() * 1.5;
          p.opacity = 0.3 + Math.random() * 0.2;
          // Emit to the right with spread
          const angle = (Math.random() - 0.5) * Math.PI * 0.6;
          const speed = 1.2 + Math.random() * 0.8;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.x = fanX + fanR * 0.4;
        }
      } else {
        // Clean phase — drift right and fade
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio > 0.6) {
          p.opacity = lerp(0.4, 0, (lifeRatio - 0.6) / 0.4);
        }
      }

      // Cursor repulsion (desktop only)
      if (config.cursorReactive && mouseRef.current) {
        const mdx = p.x - mouseRef.current.x;
        const mdy = p.y - mouseRef.current.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 30 && mDist > 0) {
          const force = (30 - mDist) / 30 * 0.5;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }
      }

      // Apply velocity with damping
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      return p.x < width + 10 && p.x > -10 && p.y > -10 && p.y < height + 10 && p.life < p.maxLife;
    },
    [config]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Size canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!config.cursorReactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => { mouseRef.current = null; };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // IntersectionObserver to pause when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Seed initial particles for reduced motion snapshot
    if (prefersReducedMotion) {
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < config.maxParticles * 0.6; i++) {
        const p = spawnParticle(rect.width, rect.height);
        p.x = Math.random() * rect.width;
        p.y = Math.random() * rect.height;
        if (config.mode === "focal" && p.x > rect.width * 0.5) {
          p.phase = "clean";
          p.color = randomFrom(CLEAN_COLORS);
          p.radius = 1.5 + Math.random() * 1.5;
          p.opacity = 0.3 + Math.random() * 0.2;
        }
        particlesRef.current.push(p);
      }
      // Render once
      const renderRect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, renderRect.width, renderRect.height);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        observer.disconnect();
      };
    }

    // Animation loop
    const animate = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!isVisible) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Spawn new particles
      const spawnInterval = 1000 / config.spawnRate;
      if (timestamp - lastSpawnRef.current > spawnInterval && particlesRef.current.length < config.maxParticles) {
        particlesRef.current.push(spawnParticle(width, height));
        lastSpawnRef.current = timestamp;
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => updateParticle(p, width, height));

      // Render
      ctx.clearRect(0, 0, width, height);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      particlesRef.current = [];
    };
  }, [canvasRef, config, spawnParticle, updateParticle]);
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors related to `useParticleEngine.ts`

**Step 3: Commit**

```bash
git add lib/useParticleEngine.ts
git commit -m "feat: add particle engine hook for hero animation"
```

---

### Task 2: Create the Fan SVG Component

**Files:**
- Create: `components/FanSVG.tsx`

**Step 1: Create the spinning fan SVG component**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FanSVG({ className }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  const bladeCount = 6;
  const blades = Array.from({ length: bladeCount }, (_, i) => {
    const angle = (i * 360) / bladeCount;
    return (
      <g key={i} transform={`rotate(${angle} 50 50)`}>
        <path
          d="M50 50 Q55 30 50 12"
          fill="none"
          stroke="#006580"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>
    );
  });

  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer dashed ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#006580"
          strokeWidth="0.8"
          strokeDasharray="4 4"
          animate={prefersReducedMotion ? {} : { opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Spinning blades group */}
        <motion.g
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ originX: "50px", originY: "50px" }}
        >
          {blades}
        </motion.g>

        {/* Center hub */}
        <circle cx="50" cy="50" r="4" fill="#006580" opacity="0.4" />
      </svg>
    </div>
  );
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors related to `FanSVG.tsx`

**Step 3: Commit**

```bash
git add components/FanSVG.tsx
git commit -m "feat: add spinning fan SVG component"
```

---

### Task 3: Create the Background Ambient Canvas Component

**Files:**
- Create: `components/AmbientParticles.tsx`

**Step 1: Create the ambient background particle component**

```tsx
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
```

**Step 2: Commit**

```bash
git add components/AmbientParticles.tsx
git commit -m "feat: add ambient background particle canvas component"
```

---

### Task 4: Create the Focal Particle Canvas Component

**Files:**
- Create: `components/FocalParticles.tsx`

**Step 1: Create the focal particle + fan composite component**

```tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useParticleEngine } from "@/lib/useParticleEngine";
import { FanSVG } from "./FanSVG";

export function FocalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useParticleEngine(canvasRef, {
    maxParticles: 55,
    spawnRate: 2.5,
    fanCenter: { x: 0.5, y: 0.5 },
    fanRadius: 0.3,
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
```

**Step 2: Commit**

```bash
git add components/FocalParticles.tsx
git commit -m "feat: add focal particle canvas with fan overlay"
```

---

### Task 5: Update HeroSection to Use New Components

**Files:**
- Modify: `app/page-sections/HeroSection.tsx`

**Step 1: Replace the image box with the particle animation**

Replace the entire right-side column content (the `motion.div` with the Image and gradient overlay at lines 68-83) with the `FocalParticles` component. Keep the floating card. Add `AmbientParticles` as a background layer.

Updated `HeroSection.tsx`:

```tsx
"use client";

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

export function HeroSection() {
  return (
    <header className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Ambient background particles */}
      <div className="absolute inset-0 -z-5 pointer-events-none">
        <AmbientParticles />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold uppercase tracking-widest mb-6">
              <Icon name="air" filled className="text-sm" />
              Clean Air Technology
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="text-5xl lg:text-7xl font-extrabold font-headline text-on-surface leading-[1.1] mb-6 tracking-tight">
              TPS Ventilatie — <span className="text-primary">Uw Ventilatie</span>specialist
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-xl text-on-surface-variant mb-10 leading-relaxed font-light">
              Specialist in installatie, onderhoud en advies voor een gezonde leefomgeving. Wij optimaliseren uw binnenklimaat met precisie en zorg.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/diensten"
                className="btn-hover signature-gradient text-on-primary px-8 py-4 rounded-xl font-bold text-lg text-center shadow-lg hover:shadow-xl transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Onze Diensten
              </Link>
              <Link
                href="/tarieven"
                className="bg-surface-container-high text-on-surface px-8 py-4 rounded-xl font-bold text-lg text-center hover:bg-surface-container-highest transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Bekijk Tarieven
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-6 bg-surface-container-low/50 -mx-4 px-4 rounded-2xl py-6">
              <div className="flex items-center gap-2">
                <Icon name="bolt" filled className="text-tertiary" />
                <span className="font-semibold text-sm uppercase tracking-wider">Snel afspraak</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="payments" filled className="text-tertiary" />
                <span className="font-semibold text-sm uppercase tracking-wider">Geen voorrijkosten</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="verified_user" filled className="text-tertiary" />
                <span className="font-semibold text-sm uppercase tracking-wider">Ervaren Team</span>
              </div>
            </motion.div>
          </div>

          {/* Right side — particle animation */}
          <div className="relative hidden lg:block">
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

      {/* Decorative circle */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 pointer-events-none">
        <svg fill="none" height="600" viewBox="0 0 600 600" width="600">
          <circle cx="300" cy="300" r="250" stroke="url(#heroGrad)" strokeDasharray="20 20" strokeWidth="2" />
          <defs>
            <linearGradient id="heroGrad" x1="300" x2="300" y1="50" y2="550" gradientUnits="userSpaceOnUse">
              <stop stopColor="#006580" />
              <stop offset="1" stopColor="#006B42" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </header>
  );
}
```

**Step 2: Run dev server and verify visually**

Run: `npm run dev`
Expected: Hero shows ambient particles across full width, spinning fan with focal particles in the right column on desktop, mobile shows ambient particles only.

**Step 3: Run build to check for errors**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add app/page-sections/HeroSection.tsx
git commit -m "feat: integrate particle animation and fan into hero section"
```

---

### Task 6: Visual Tuning & Polish

**Files:**
- Modify: `lib/useParticleEngine.ts` (tweak values if needed)
- Modify: `components/FanSVG.tsx` (tweak blade curves if needed)

**Step 1: Visual review checklist**

Open `npm run dev` and verify:
- [ ] Ambient particles drift left-to-right at subtle opacity behind text
- [ ] Text remains fully readable over ambient particles
- [ ] Focal canvas shows dirty (brown) particles spawning from left
- [ ] Particles accelerate toward spinning fan center
- [ ] Particles transform: color shifts brown → teal/green, size shrinks
- [ ] Clean particles emit to the right and fade out
- [ ] Fan rotates smoothly at ~8s per revolution
- [ ] Outer ring pulses subtly
- [ ] Cursor proximity gently pushes particles on desktop
- [ ] Mobile viewport: only ambient particles, no fan/focal canvas
- [ ] `prefers-reduced-motion`: static snapshot, no animation
- [ ] No visible performance jank (check with DevTools Performance tab)
- [ ] Floating "Luchtkwaliteit Status" card still visible and positioned correctly

**Step 2: Adjust values as needed**

Tune spawn rates, velocities, opacity ranges, fan rotation speed, and cursor repulsion radius based on visual review. Specific values to watch:
- `spawnRate` in focal config (2.5) — increase if too sparse, decrease if too busy
- `attraction` force (0.02) — increase if particles don't reach fan fast enough
- Fan blade `d` path — adjust curve if blades look too straight or too bent
- Ambient particle `maxParticles` (25) — increase to ~30 on mobile if too sparse

**Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Final commit**

```bash
git add -A
git commit -m "polish: tune particle animation values and visual balance"
```
