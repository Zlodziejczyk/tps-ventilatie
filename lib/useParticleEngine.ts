"use client";

import { useEffect, useRef, useCallback } from "react";

export interface ParticleConfig {
  maxParticles: number;
  spawnRate: number;
  fanCenter: { x: number; y: number };
  fanRadius: number;
  cursorReactive: boolean;
  mode: "focal" | "ambient";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  targetOpacity: number;
  color: string;
  phase: "dirty" | "transforming" | "clean";
  life: number;
  maxLife: number;
}

const DIRTY_COLORS = ["#8B7355", "#A0896C", "#9B8567", "#7A6548", "#6B5A3E"];
const CLEAN_COLORS = ["#82d1f1", "#a8e0f5", "#baeaff", "#6ec8e8", "#93dbf5"];
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
  const seededRef = useRef(false);

  const spawnParticle = useCallback(
    (width: number, height: number): Particle => {
      if (config.mode === "ambient") {
        return {
          x: -10 + Math.random() * width * 0.05,
          y: Math.random() * height,
          vx: 0.3 + Math.random() * 0.5,
          vy: (Math.random() - 0.5) * 0.15,
          radius: 1.5 + Math.random() * 2.5,
          opacity: 0,
          targetOpacity: 0.06 + Math.random() * 0.1,
          color: randomFrom(AMBIENT_COLORS),
          phase: "clean",
          life: 0,
          maxLife: 1200 + Math.random() * 800,
        };
      }

      // Focal mode — spawn dirty particles from the left edge
      return {
        x: -8 + Math.random() * width * 0.06,
        y: height * 0.08 + Math.random() * height * 0.84,
        vx: 0.6 + Math.random() * 0.8,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 3.5 + Math.random() * 3.5,
        opacity: 0,
        targetOpacity: 0.65 + Math.random() * 0.35,
        color: randomFrom(DIRTY_COLORS),
        phase: "dirty",
        life: 0,
        maxLife: 1200 + Math.random() * 600,
      };
    },
    [config.mode]
  );

  const updateParticle = useCallback(
    (p: Particle, width: number, height: number): boolean => {
      p.life++;

      // Fade in during first frames
      if (p.life < 30) {
        p.opacity = lerp(0, p.targetOpacity, p.life / 30);
      }

      if (config.mode === "ambient") {
        p.x += p.vx;
        p.y += p.vy;
        p.y += Math.sin(p.life * 0.008 + p.x * 0.005) * 0.12;
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio > 0.8) p.opacity = lerp(p.targetOpacity, 0, (lifeRatio - 0.8) / 0.2);
        return p.x < width + 20 && p.life < p.maxLife;
      }

      // Focal mode
      const fanX = config.fanCenter.x * width;
      const fanY = config.fanCenter.y * height;
      const fanR = config.fanRadius * width;

      const dx = fanX - p.x;
      const dy = fanY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (p.phase === "dirty") {
        // Steady attraction toward fan — not too fast, creates visible stream
        const attraction = 0.03 + Math.max(0, 1 - dist / (width * 0.6)) * 0.04;
        p.vx += (dx / (dist + 1)) * attraction;
        p.vy += (dy / (dist + 1)) * attraction;

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.8) {
          p.vx = (p.vx / speed) * 2.8;
          p.vy = (p.vy / speed) * 2.8;
        }

        // Slight wobble for organic feel
        p.vy += Math.sin(p.life * 0.05) * 0.03;

        // Enter fan zone
        if (dist < fanR * 0.5) {
          p.phase = "transforming";
          p.life = 0;
          p.maxLife = 18 + Math.random() * 12;
        }
      } else if (p.phase === "transforming") {
        // Swirl inside fan
        p.vx *= 0.75;
        p.vy *= 0.75;
        const swirl = 0.25;
        const tmpVx = p.vx;
        p.vx = p.vx * Math.cos(swirl) - p.vy * Math.sin(swirl);
        p.vy = tmpVx * Math.sin(swirl) + p.vy * Math.cos(swirl);

        const t = p.life / p.maxLife;
        p.radius = lerp(p.radius, 2, t * 0.15);

        if (t > 0.35) {
          p.color = randomFrom(CLEAN_COLORS);
        }

        if (p.life >= p.maxLife) {
          p.phase = "clean";
          p.life = 0;
          p.maxLife = 500 + Math.random() * 400;
          p.color = randomFrom(CLEAN_COLORS);
          p.radius = 1.5 + Math.random() * 2;
          p.opacity = 0.5 + Math.random() * 0.3;
          p.targetOpacity = p.opacity;
          // Emit to the right with spread
          const angle = (Math.random() - 0.5) * Math.PI * 0.45;
          const speed = 1.2 + Math.random() * 0.8;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.x = fanX + fanR * 0.4;
        }
      } else {
        // Clean phase — drift right, long travel to right edge
        const lifeRatio = p.life / p.maxLife;
        // Only start fading well past halfway
        if (lifeRatio > 0.65) {
          p.opacity = lerp(p.targetOpacity, 0, (lifeRatio - 0.65) / 0.35);
        }
        // Gentle vertical spread
        p.vy += (Math.random() - 0.5) * 0.015;
        // Keep moving right
        if (p.vx < 0.4) p.vx += 0.01;
      }

      // Cursor repulsion (desktop only)
      if (config.cursorReactive && mouseRef.current) {
        const mdx = p.x - mouseRef.current.x;
        const mdy = p.y - mouseRef.current.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 60 && mDist > 0) {
          const force = ((60 - mDist) / 60) * 0.6;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }
      }

      // Apply velocity
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.992;
      p.vy *= 0.992;

      return (
        p.x < width + 30 &&
        p.x > -30 &&
        p.y > -30 &&
        p.y < height + 30 &&
        p.life < p.maxLife &&
        p.opacity > 0.003
      );
    },
    [config]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!config.cursorReactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = null;
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Reduced motion — static snapshot
    if (prefersReducedMotion) {
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < config.maxParticles * 0.7; i++) {
        const p = spawnParticle(rect.width, rect.height);
        p.opacity = p.targetOpacity;
        p.x = Math.random() * rect.width;
        p.y = Math.random() * rect.height;
        if (
          config.mode === "focal" &&
          p.x > rect.width * config.fanCenter.x
        ) {
          p.phase = "clean";
          p.color = randomFrom(CLEAN_COLORS);
          p.radius = 1.5 + Math.random() * 2;
          p.opacity = 0.35 + Math.random() * 0.3;
        }
        particlesRef.current.push(p);
      }
      ctx.clearRect(0, 0, rect.width, rect.height);
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

    // Seed initial particles so animation starts full
    if (!seededRef.current) {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const seedCount = Math.floor(config.maxParticles * 0.8);
      for (let i = 0; i < seedCount; i++) {
        const p = spawnParticle(w, h);
        p.opacity = p.targetOpacity;
        const progress = Math.random();
        if (config.mode === "focal") {
          const fanX = config.fanCenter.x * w;
          const fanY = config.fanCenter.y * h;
          if (progress < 0.55) {
            // Dirty particles spread on left side, heading toward fan
            p.x = Math.random() * fanX * 0.95;
            p.y = h * 0.08 + Math.random() * h * 0.84;
            p.life = Math.floor(Math.random() * 60);
          } else if (progress < 0.65) {
            // Near/at fan
            p.x = fanX + (Math.random() - 0.5) * 40;
            p.y = fanY + (Math.random() - 0.5) * 40;
            p.phase = "transforming";
            p.life = Math.floor(Math.random() * 15);
            p.maxLife = 20;
          } else {
            // Clean particles on right side
            const fanR = config.fanRadius * w;
            p.x = fanX + fanR * 0.4 + Math.random() * (w - fanX - fanR * 0.4);
            p.y = h * 0.1 + Math.random() * h * 0.8;
            p.phase = "clean";
            p.color = randomFrom(CLEAN_COLORS);
            p.radius = 1.5 + Math.random() * 2;
            p.opacity = 0.4 + Math.random() * 0.35;
            p.targetOpacity = p.opacity;
            p.vx = 0.6 + Math.random() * 0.8;
            p.vy = (Math.random() - 0.5) * 0.3;
            p.life = Math.floor(Math.random() * 150);
            p.maxLife = 500 + Math.random() * 400;
          }
        } else {
          p.x = Math.random() * w;
          p.life = Math.floor(Math.random() * p.maxLife * 0.5);
        }
        particlesRef.current.push(p);
      }
      seededRef.current = true;
    }

    // Animation loop
    const animate = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!isVisible) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Batch spawn to maintain density
      const spawnInterval = 1000 / config.spawnRate;
      if (timestamp - lastSpawnRef.current > spawnInterval) {
        const deficit = config.maxParticles - particlesRef.current.length;
        const batchSize = Math.min(deficit, Math.ceil(config.spawnRate / 6));
        for (let i = 0; i < batchSize; i++) {
          particlesRef.current.push(spawnParticle(width, height));
        }
        lastSpawnRef.current = timestamp;
      }

      // Update
      particlesRef.current = particlesRef.current.filter((p) =>
        updateParticle(p, width, height)
      );

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
      seededRef.current = false;
    };
  }, [canvasRef, config, spawnParticle, updateParticle]);
}
