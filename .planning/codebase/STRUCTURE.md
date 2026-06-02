<!-- refreshed: 2026-06-01 -->
# Codebase Structure

**Analysis Date:** 2026-06-01

## Directory Layout

```
tps-ventilatie/
├── app/                        # Next.js App Router — pages, layout, global CSS
│   ├── layout.tsx              # Root layout: fonts, Navbar, Footer, <html>
│   ├── page.tsx                # Home page — imports page-sections
│   ├── globals.css             # Tailwind v4 @theme inline design tokens + utilities
│   ├── favicon.ico
│   ├── page-sections/          # Home-page-only section components
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── WhyTPSSection.tsx
│   │   └── ReviewsSection.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── diensten/
│   │   └── page.tsx
│   ├── over-ons/
│   │   └── page.tsx
│   ├── tarieven/
│   │   └── page.tsx
│   └── privacy-beleid/
│       └── page.tsx
├── components/                 # Shared reusable UI components
│   ├── Navbar.tsx              # Fixed top navigation with dropdowns
│   ├── Footer.tsx              # 4-column footer
│   ├── MobileMenu.tsx          # Mobile slide-in drawer
│   ├── CTABanner.tsx           # Reusable dark CTA section
│   ├── ContactForm.tsx         # Client form → GoHighLevel webhook
│   ├── Icon.tsx                # Material Symbols wrapper
│   ├── AnimateOnScroll.tsx     # Scroll-triggered fade-up (Framer Motion)
│   ├── StaggerChildren.tsx     # Staggered list animation (Framer Motion)
│   ├── DienstenNav.tsx         # Sticky scroll-spy section nav
│   ├── PricingTabs.tsx         # Tab-based pricing UI
│   ├── PricingCard.tsx         # Individual pricing item
│   ├── ServiceCard.tsx         # Individual service feature card
│   ├── ReviewCarousel.tsx      # Auto-advancing review slider
│   ├── SoftAurora.tsx          # WebGL aurora background (OGL + GLSL)
│   ├── FanSVG.tsx              # Animated SVG fan illustration
│   ├── AmbientParticles.tsx    # Canvas ambient particle effect
│   └── FocalParticles.tsx      # Canvas focal particle effect
├── lib/                        # Shared constants, utilities, hooks
│   ├── constants.ts            # SITE info, NAV_LINKS, dropdown data
│   ├── forms.ts                # submitForm() → GoHighLevel webhook
│   └── useParticleEngine.ts    # Custom hook for canvas particle system
├── public/                     # Static assets
│   └── images/
│       ├── hero-ventilatie.jpg
│       ├── mv/                 # Mechanische Ventilatie images
│       ├── work/               # Before/after work photos
│       └── wtw/                # WTW unit images
├── docs/
│   └── plans/                  # Implementation plan documents
├── .planning/
│   └── codebase/               # GSD codebase analysis documents
├── .stitch/                    # Design reference files (READ ONLY)
│   └── aura_flow/
│       └── DESIGN.md           # "Atmospheric Clarity" design system spec
├── .firecrawl/                 # Competitor/research crawl data (READ ONLY)
├── next.config.ts              # Next.js config: output="export", images.unoptimized
├── tsconfig.json               # TypeScript config: strict, paths alias @/* → ./*
├── postcss.config.mjs          # PostCSS config for Tailwind v4
├── eslint.config.mjs           # ESLint config
├── package.json                # Dependencies and scripts
├── .env.example                # Required env var template
├── CLAUDE.md                   # Project instructions for Claude
└── oferta-tps-ventilatie.html  # Standalone offer document (not part of site)
```

## Directory Purposes

**`app/`:**
- Purpose: All Next.js App Router pages and the root layout
- Contains: `page.tsx` per route segment, `layout.tsx`, `globals.css`, `favicon.ico`, `page-sections/` sub-directory
- Key files: `app/layout.tsx` (root shell), `app/page.tsx` (home), `app/globals.css` (design tokens)

**`app/page-sections/`:**
- Purpose: Section components used exclusively on the home page (`app/page.tsx`)
- Contains: Five named section components: Hero, Services, Pricing, WhyTPS, Reviews
- Rule: Components here are NOT reused elsewhere. Anything reused across multiple pages belongs in `components/`

**`components/`:**
- Purpose: Shared UI components imported by multiple pages or by `app/layout.tsx`
- Contains: Layout chrome (Navbar, Footer), interaction components (ContactForm, PricingTabs), animation utilities (AnimateOnScroll, StaggerChildren), visual effects (SoftAurora, particles)
- Key files: `Navbar.tsx`, `Footer.tsx`, `CTABanner.tsx`, `AnimateOnScroll.tsx`, `Icon.tsx`

**`lib/`:**
- Purpose: Non-React shared code: constants, utility functions, custom hooks
- Contains: `constants.ts` (single source of truth for all business data and nav), `forms.ts` (form submission logic), `useParticleEngine.ts` (canvas hook)
- Key files: `lib/constants.ts` — always import `SITE` from here, never hardcode contact info

**`public/images/`:**
- Purpose: Static images served directly by the browser
- Sub-directories: `mv/` (mechanische ventilatie), `work/` (before/after photos), `wtw/` (WTW unit images)
- Referenced via: Next.js `Image` component with `fill` or `src` props

**`.stitch/`:**
- Purpose: Design system reference files provided by the design tool — READ ONLY, never modify
- Key file: `.stitch/aura_flow/DESIGN.md` — "Atmospheric Clarity" design system specification

**`.firecrawl/`:**
- Purpose: Competitor/market research crawl data — READ ONLY, never modify

**`docs/plans/`:**
- Purpose: Implementation plan documents for past and future phases

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents (this directory)
- Generated: Yes (by `/gsd-map-codebase`)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML shell, font setup, Navbar + Footer wrapper
- `app/page.tsx`: Home page — assembles `page-sections/` components

**Design System:**
- `app/globals.css`: All Material Design 3 color tokens, font variables, utility classes (`glass-nav`, `signature-gradient`, `btn-hover`, `hover-lift`)

**Business Data:**
- `lib/constants.ts`: `SITE` object (phone, email, address, KvK, BTW, WhatsApp URL), `NAV_LINKS`, `DIENSTEN_DROPDOWN`, `TARIEVEN_DROPDOWN`

**Form Integration:**
- `lib/forms.ts`: `submitForm(formId, data)` — single integration point for GoHighLevel CRM webhook

**Animation Utilities:**
- `components/AnimateOnScroll.tsx`: Scroll-triggered entry animation wrapper
- `components/StaggerChildren.tsx`: Staggered list/grid reveal (`StaggerChildren` + `StaggerItem` exports)

**Configuration:**
- `next.config.ts`: `output: "export"`, `images.unoptimized: true`
- `tsconfig.json`: Path alias `@/*` maps to project root
- `.env.example`: Documents `NEXT_PUBLIC_GHL_WEBHOOK_URL`

## Naming Conventions

**Files:**
- React components: `PascalCase.tsx` (e.g., `CTABanner.tsx`, `AnimateOnScroll.tsx`)
- Utilities and hooks: `camelCase.ts` (e.g., `forms.ts`, `constants.ts`, `useParticleEngine.ts`)
- Pages: always named `page.tsx` (Next.js App Router convention)
- Config files: lowercase with extension (e.g., `next.config.ts`, `eslint.config.mjs`)

**Directories:**
- Route segments: `kebab-case` (e.g., `over-ons/`, `privacy-beleid/`)
- Component directories: flat (all components directly in `components/`)
- Image sub-directories: lowercase abbreviation (e.g., `mv/`, `wtw/`, `work/`)

**Exports:**
- Named exports for all components (no default exports from component files except page routes)
- Page routes use `export default function PageName()` (required by Next.js)

**Constants:**
- SCREAMING_SNAKE_CASE for exported constant objects: `SITE`, `NAV_LINKS`, `DIENSTEN_DROPDOWN`

## Where to Add New Code

**New Page Route:**
- Create `app/<route-slug>/page.tsx`
- Add named export for `metadata: Metadata`
- Add default export function `<Name>Page()`
- Add link to `lib/constants.ts` `NAV_LINKS` if it appears in navigation

**New Reusable Component:**
- Add `components/<ComponentName>.tsx`
- Use named export: `export function ComponentName(...) {}`
- Add `"use client"` only if it uses hooks, browser APIs, or Framer Motion

**New Home Page Section:**
- Add `app/page-sections/<SectionName>Section.tsx`
- Import and place in `app/page.tsx`
- If reused on other pages, move to `components/` instead

**New Static Image:**
- Add to `public/images/` in the appropriate sub-directory (`mv/`, `wtw/`, `work/`)
- Reference with Next.js `<Image src="/images/<subdir>/<file>.jpg" />`
- Use `fill` prop with a positioned parent for responsive images

**New Site-wide Content / Contact Info:**
- Add to the `SITE` object in `lib/constants.ts`
- Import in components: `import { SITE } from "@/lib/constants"`

**New Form:**
- Call `submitForm(formId, data)` from `lib/forms.ts`
- Manage form state locally in the component (`"idle" | "sending" | "success" | "error"`)
- Mark the form component `"use client"`

**New Animation:**
- Wrap content with `<AnimateOnScroll>` for scroll-triggered fade-up
- Wrap grid/list with `<StaggerChildren>` and each child with `<StaggerItem>` for staggered reveal
- For hero/enter animations, use Framer Motion `motion.*` directly with `initial`/`animate` props

## Special Directories

**`.next/`:**
- Purpose: Next.js build cache and dev artifacts
- Generated: Yes
- Committed: No (in `.gitignore`)

**`out/`:**
- Purpose: Static export output — the deployable site
- Generated: Yes (by `npm run build`)
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: npm package dependencies
- Generated: Yes
- Committed: No

**`.stitch/`:**
- Purpose: Design reference — never edit
- Generated: No (provided by design tool)
- Committed: Yes (reference only)

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents
- Generated: Yes (by `/gsd-map-codebase`)
- Committed: Yes

---

*Structure analysis: 2026-06-01*
