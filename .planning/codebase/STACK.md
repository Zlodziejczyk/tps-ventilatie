# Technology Stack

**Analysis Date:** 2026-06-01

## Languages

**Primary:**
- TypeScript 5.x - All application code (`app/`, `components/`, `lib/`)

**Secondary:**
- CSS - Design tokens and global styles (`app/globals.css` via Tailwind v4 `@theme inline`)

## Runtime

**Environment:**
- Node.js v26 (detected in environment; no `.nvmrc` or `.node-version` pinned)

**Package Manager:**
- npm 11.12.1
- Lockfile: `package-lock.json` present (lockfileVersion 3)

## Frameworks

**Core:**
- Next.js 16.2.1 - Full-stack React framework running in **hybrid** mode (default Next.js output: static pages prerender at build time, route handlers run as serverless functions). `output: "export"` was dropped in Phase 5 so `app/api/lead/route.ts` could run server-side; `next.config.ts` carries no `output` key.
- React 19.2.4 - UI rendering

**Build/Dev:**
- TypeScript 5.x - Type checking; config at `tsconfig.json`
- Tailwind CSS v4 - Utility-first CSS via CSS-first config (`@tailwindcss/postcss` plugin); PostCSS config at `postcss.config.mjs`
- ESLint 9 - Linting; config at `eslint.config.mjs` using `eslint-config-next` core-web-vitals + typescript presets

**Testing:**
- Not detected — no test framework installed

## Key Dependencies

**Critical:**
- `framer-motion` ^12.38.0 - Animation library; used for entrance animations and page-level motion (`HeroSection.tsx`, `AnimateOnScroll.tsx`, `StaggerChildren.tsx`)
- `ogl` ^1.0.11 - Lightweight WebGL library; used exclusively in `components/SoftAurora.tsx` for the aurora canvas background effect

**Infrastructure:**
- `next` 16.2.1 - Image Optimization is **on** (no `unoptimized` flag), with `images.formats` opted into AVIF plus WebP; also provides `next/font/google` for font loading and the `next/link`/`next/image` components

## Configuration

**Environment:**
- Single env var required: `NEXT_PUBLIC_GHL_WEBHOOK_URL` (GoHighLevel webhook URL for contact forms)
- Example file: `.env.example` — contains the key name only, no values
- When `NEXT_PUBLIC_GHL_WEBHOOK_URL` is absent, `lib/forms.ts` falls back to `console.log` (dev mode)

**Build:**
- `next.config.ts` — sets `trailingSlash: false` and `images.formats` (AVIF + WebP); as of Phase 10 it also sets `skipTrailingSlashRedirect: true` and a `redirects()` map for the legacy hostnames
- `postcss.config.mjs` — registers `@tailwindcss/postcss` plugin
- `tsconfig.json` — strict mode, `bundler` module resolution, `@/*` path alias pointing to repo root

**TypeScript path alias:**
- `@/*` → `./*` (repo root) — used throughout all imports

## Platform Requirements

**Development:**
- Node.js (v26 in current env; no minimum version pinned)
- npm as package manager
- Run with: `npm run dev`

**Production:**
- Hybrid deploy on Vercel: prerendered pages served as static assets, `app/api/lead/route.ts` as a serverless function
- Deployed to Vercel (project ID `prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q`, org `team_YrD4rsBlATPg7g02y1QThOhg`)
- Build command: `npm run build` (guard chain runs first via `prebuild`)
- A server-side runtime IS required — `/api/lead` is a route handler, not a static file

---

*Stack analysis: 2026-06-01*
