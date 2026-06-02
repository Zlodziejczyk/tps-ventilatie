# CLAUDE.md — TPS klimaattechniek

> Project guide managed by GSD. Content between `<!-- GSD:* -->` markers is tool-generated (`/gsd-*`) — refresh those via the workflow, not by hand. The guardrails below are hand-maintained and always apply.

## Project Guardrails (always apply)

- **Reference-only dirs:** never modify `.stitch/` or `.firecrawl/`.
- **Business data:** phone, email, address, KvK/BTW, and service radius come only from `SITE` in `lib/constants.ts` — never hardcode contact info.
- **Forms:** submit via `lib/forms.ts` `submitForm()`. **Icons:** use the `components/Icon.tsx` wrapper (never raw Material Symbols spans).
- **Active plan lives in `.planning/`:** PROJECT.md, ROADMAP.md, REQUIREMENTS.md, STATE.md, research/.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**TPS klimaattechniek**

TPS klimaattechniek is a Zoetermeer-based climate-technology installer — airconditioning, heat pumps (warmtepompen), and ventilation (WTW + mechanical). This is their marketing website: currently a **pre-launch proposal** that established the look, feel, and core page set, now being expanded into a full multi-service, SEO-driven lead-generation site and prepared for official launch.

Built with Next.js 16 (App Router, static export), TypeScript, and Tailwind CSS v4 ("Atmospheric Clarity" design system), deployed on Vercel. Built and maintained by Pushly.nl for the client (owner: Thomas / Tomasz) as an ongoing development + maintenance engagement.

**Core Value:** **Turn local search demand into contacted leads.** A prospect in the Zoetermeer region looking for airco, heat-pump, or ventilation work finds TPS, trusts it, and reaches out — and the owner is notified instantly. Every workstream (service depth, SEO, content, conversion) serves this one outcome.

### Constraints

- **Tech stack:** Next.js 16 App Router + TypeScript + Tailwind v4 — keep. Currently `output: "export"` (fully static); may need to relax to a hybrid (one server route) to secure the form — open decision.
- **Design system:** "Atmospheric Clarity" — no 1px section borders (use tonal background layering), no 100% black text (`on-surface` #141D1F), Material Symbols via the `Icon` wrapper, business data via the `SITE` constant. Never modify `.stitch/` or `.firecrawl/`.
- **Language:** all site-facing content in Dutch (`nl`).
- **Content model:** Claude drafts content from research + owner notes; owner reviews/approves before publish.
- **Timeline:** quality-gated ("when it's right") — favor thoroughness; no hard deadline.
- **Hosting:** Vercel (project `prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q`).
- **Lead routing:** GoHighLevel webhook + workflow for instant owner notification.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - All application code (`app/`, `components/`, `lib/`)
- CSS - Design tokens and global styles (`app/globals.css` via Tailwind v4 `@theme inline`)
## Runtime
- Node.js v26 (detected in environment; no `.nvmrc` or `.node-version` pinned)
- npm 11.12.1
- Lockfile: `package-lock.json` present (lockfileVersion 3)
## Frameworks
- Next.js 16.2.1 - Full-stack React framework; configured for static export (`output: "export"` in `next.config.ts`)
- React 19.2.4 - UI rendering
- TypeScript 5.x - Type checking; config at `tsconfig.json`
- Tailwind CSS v4 - Utility-first CSS via CSS-first config (`@tailwindcss/postcss` plugin); PostCSS config at `postcss.config.mjs`
- ESLint 9 - Linting; config at `eslint.config.mjs` using `eslint-config-next` core-web-vitals + typescript presets
- Not detected — no test framework installed
## Key Dependencies
- `framer-motion` ^12.38.0 - Animation library; used for entrance animations and page-level motion (`HeroSection.tsx`, `AnimateOnScroll.tsx`, `StaggerChildren.tsx`)
- `ogl` ^1.0.11 - Lightweight WebGL library; used exclusively in `components/SoftAurora.tsx` for the aurora canvas background effect
- `next` 16.2.1 - Includes image optimization (disabled for static export via `unoptimized: true`), `next/font/google` for font loading, and `next/link`/`next/image` components
## Configuration
- Single env var required: `NEXT_PUBLIC_GHL_WEBHOOK_URL` (GoHighLevel webhook URL for contact forms)
- Example file: `.env.example` — contains the key name only, no values
- When `NEXT_PUBLIC_GHL_WEBHOOK_URL` is absent, `lib/forms.ts` falls back to `console.log` (dev mode)
- `next.config.ts` — enables static export, disables image optimization
- `postcss.config.mjs` — registers `@tailwindcss/postcss` plugin
- `tsconfig.json` — strict mode, `bundler` module resolution, `@/*` path alias pointing to repo root
- `@/*` → `./*` (repo root) — used throughout all imports
## Platform Requirements
- Node.js (v26 in current env; no minimum version pinned)
- npm as package manager
- Run with: `npm run dev`
- Static export to `out/` directory
- Deployed to Vercel (project ID `prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q`, org `team_YrD4rsBlATPg7g02y1QThOhg`)
- Build command: `npm run build` (generates `out/`)
- No server-side runtime required — fully static HTML/CSS/JS
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Components use PascalCase: `ContactForm.tsx`, `ReviewCarousel.tsx`, `AnimateOnScroll.tsx`
- Utilities and hooks use camelCase: `forms.ts`, `constants.ts`, `useParticleEngine.ts`
- Page sections live in `app/page-sections/` and follow PascalCase with a `Section` suffix: `HeroSection.tsx`, `ServicesSection.tsx`
- Next.js pages follow the file-system convention: `app/contact/page.tsx`, `app/tarieven/page.tsx`
- All React components use named exports (not default), except Next.js route `page.tsx` files which export `default`
- Function names match their file names exactly: file `ContactForm.tsx` exports `ContactForm`
- Internal helper components within a file use PascalCase and are NOT exported: `DienstenPanel`, `TarievenPanel`, `ReviewCard`, `Stars`
- Custom hooks start with `use`: `useParticleEngine`
- Animation variant objects and config constants use camelCase: `fadeUp`, `springTransition`, `container`, `staggerItem`
- Module-level data arrays and config objects use SCREAMING_SNAKE_CASE: `SITE`, `NAV_LINKS`, `DIENSTEN_DROPDOWN`, `TABS`, `REVIEWS`, `WTW_UNITS`, `DIRTY_COLORS`
- Local state variables follow camelCase: `mobileOpen`, `currentIndex`, `indicatorStyle`
- Animation transition objects use camelCase: `springTransition`, `fadeUp`
- Props interfaces are named `<ComponentName>Props`: `IconProps`, `CTABannerProps`, `ReviewCarouselProps`
- Domain types are short and descriptive: `Review`, `DropdownItem`, `ParticleConfig`, `Particle`
- String union types are concise: `type Tab = "wtw" | "mv" | "airco"`
- `interface` is used for object shapes (props, config, domain models); `type` is used for unions
## Code Style
- No Prettier config found — formatting is enforced implicitly via ESLint + `eslint-config-next`
- Double quotes for all JSX attribute strings and TypeScript string literals
- Semicolons present throughout
- Trailing commas used in multi-line arrays and objects
- Config: `eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- One custom rule: `"@next/next/no-page-custom-font": "off"` (allows direct `<link>` font loading in layout)
- TypeScript `strict: true` in `tsconfig.json`
- Run: `npm run lint`
## Import Organization
- `@/*` maps to the project root — used for all cross-directory imports
- Relative imports (`./Icon`, `"./MobileMenu"`) are used only within the same directory
- `import type { ReactNode }` from react and `import type { Review }` from sibling files — used consistently when only the type is needed
## Error Handling
- Async form submission wraps `fetch` with a result object `{ ok: boolean }` rather than throwing — the component checks `result.ok` to set UI state
- No try/catch blocks used in the codebase; network errors from `fetch` are swallowed (fetch rejection would leave `status` stuck at `"sending"`)
- Component-level status state machine: `"idle" | "sending" | "success" | "error"` (see `components/ContactForm.tsx`)
- The `submitForm` function in `lib/forms.ts` has a dev fallback: when `NEXT_PUBLIC_GHL_WEBHOOK_URL` is not set, it logs to console and returns `{ ok: true }`
## Logging
- One intentional dev-only `console.log` in `lib/forms.ts` line 21: `console.log(\`[Form ${formId}]\`, data)` inside the "no webhook URL" fallback branch — never fires in production
## Comments
- Inline comments explain non-obvious layout and animation logic: `// Green corner glow`, `// Seed initial particles so animation starts full`, `// Reduced motion — static snapshot`
- Section delimiters inside large render blocks: `{/* WTW Tab */}`, `{/* Navigation arrows */}`
- No JSDoc/TSDoc on any functions — props interfaces serve as self-documentation
## Function Design
- Component functions are generally compact; `PricingTabs.tsx` is the largest at 620 lines but contains large inline data arrays (`WTW_UNITS`, `MV_ONDERHOUD`, etc.) that inflate the count
- Helper functions (`getInitials`, `lerp`, `randomFrom`) are kept very small (2–5 lines)
- The particle engine hook `useParticleEngine` in `lib/useParticleEngine.ts` (391 lines) is intentionally large due to canvas animation loop complexity
- Props are destructured at the function signature: `function Icon({ name, filled = false, className = "" }: IconProps)`
- Default parameter values are set inline in destructuring
- Server components return JSX directly
- Utilities return plain objects: `{ ok: boolean }`
## Module Design
- Named exports everywhere except Next.js pages (`export default function Page()`)
- No barrel/index files — every import references the exact file
- Added only to interactive components that use hooks or browser APIs:
- Static components (`ServiceCard.tsx`, `CTABanner.tsx`, `Footer.tsx`, `Icon.tsx`, `PricingCard.tsx`, `FanSVG.tsx`) have NO `"use client"` — they are Server Components
## Design System Rules (from CLAUDE.md)
- Never use `1px solid` borders for section separation — use background color token shifts (`bg-surface-container-low`, `bg-surface-container-high`, etc.)
- Never use `#000000` black text — always use `text-on-surface` (`#141D1F`)
- Colors come exclusively from Material Design 3 CSS tokens defined in `app/globals.css` `@theme inline` block
- No dark mode
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```text
```
## Component Responsibilities
| Component | Responsibility | File |
|-----------|----------------|------|
| RootLayout | Global HTML shell, font loading, Navbar+Footer wrap | `app/layout.tsx` |
| Home | Home page composition; imports all page-sections | `app/page.tsx` |
| HeroSection | Animated hero with aurora, rotating word cycle, trust pills | `app/page-sections/HeroSection.tsx` |
| ServicesSection | Home services overview cards | `app/page-sections/ServicesSection.tsx` |
| PricingSection | Pricing preview on home | `app/page-sections/PricingSection.tsx` |
| WhyTPSSection | USP / trust block on home | `app/page-sections/WhyTPSSection.tsx` |
| ReviewsSection | Review carousel on home | `app/page-sections/ReviewsSection.tsx` |
| DienstenPage | Full diensten (services) page — WTW, MV, Airco | `app/diensten/page.tsx` |
| TarievenPage | Pricing page with tab navigation | `app/tarieven/page.tsx` |
| ContactPage | Contact form + info + Google Maps embed | `app/contact/page.tsx` |
| OverOnsPage | About page with team info and reviews | `app/over-ons/page.tsx` |
| PrivacyBeleidPage | Legal privacy policy text | `app/privacy-beleid/page.tsx` |
| Navbar | Fixed top nav, desktop dropdowns, mobile menu trigger | `components/Navbar.tsx` |
| Footer | 4-column footer with links, contact info, KvK/BTW | `components/Footer.tsx` |
| CTABanner | Reusable dark CTA strip with phone and WhatsApp links | `components/CTABanner.tsx` |
| ContactForm | Client-side form wired to `submitForm()` | `components/ContactForm.tsx` |
| MobileMenu | Slide-in mobile nav drawer | `components/MobileMenu.tsx` |
| DienstenNav | Sticky scroll-spy section navigator | `components/DienstenNav.tsx` |
| PricingTabs | Tab-based pricing UI (reads `?tab=` URL param) | `components/PricingTabs.tsx` |
| PricingCard | Single pricing item card | `components/PricingCard.tsx` |
| ServiceCard | Single service feature card | `components/ServiceCard.tsx` |
| ReviewCarousel | Auto-advancing review display | `components/ReviewCarousel.tsx` |
| AnimateOnScroll | Framer Motion scroll-triggered fade-up wrapper | `components/AnimateOnScroll.tsx` |
| StaggerChildren / StaggerItem | Framer Motion staggered list animation | `components/StaggerChildren.tsx` |
| SoftAurora | WebGL aurora background via OGL library | `components/SoftAurora.tsx` |
| FanSVG | Animated SVG fan illustration | `components/FanSVG.tsx` |
| AmbientParticles | Canvas ambient particle decoration | `components/AmbientParticles.tsx` |
| FocalParticles | Canvas focal-point particle effect | `components/FocalParticles.tsx` |
| Icon | Wrapper for Material Symbols Outlined icon font | `components/Icon.tsx` |
| SITE / NAV_LINKS / Dropdowns | Single source of truth for business info and nav | `lib/constants.ts` |
| submitForm | GoHighLevel webhook POST with dev fallback | `lib/forms.ts` |
| useParticleEngine | Canvas particle animation custom hook | `lib/useParticleEngine.ts` |
## Pattern Overview
- All pages are statically exported (`output: "export"` in `next.config.ts`) — no server runtime
- Pages are Server Components that import Client Components for interactivity
- Shared state is avoided — each interactive component manages its own local state
- Design tokens defined in `app/globals.css` via Tailwind v4 `@theme inline` — all colors, fonts, radii available as CSS custom properties
## Layers
- Purpose: Route definitions, SEO metadata, page layout composition
- Location: `app/`
- Contains: `page.tsx` per route, `layout.tsx`, `globals.css`
- Depends on: `components/`, `lib/`
- Used by: Next.js router (file-based routing)
- Purpose: Home page section components — not reused across pages
- Location: `app/page-sections/`
- Contains: `HeroSection.tsx`, `ServicesSection.tsx`, `PricingSection.tsx`, `WhyTPSSection.tsx`, `ReviewsSection.tsx`
- Depends on: `components/`, `lib/`
- Used by: `app/page.tsx` only
- Purpose: Reusable UI building blocks used across multiple pages
- Location: `components/`
- Contains: Layout chrome (Navbar, Footer), interaction primitives (CTABanner, ContactForm), animation utilities (AnimateOnScroll, StaggerChildren), visual effects (SoftAurora, FanSVG, particles)
- Depends on: `lib/`
- Used by: `app/layout.tsx`, all page files, `app/page-sections/`
- Purpose: Shared constants, utilities, and custom hooks
- Location: `lib/`
- Contains: Business data constants, form submission helper, particle engine hook
- Depends on: Nothing internal
- Used by: All component and page layers
## Data Flow
### Contact Form Submission
### Navigation
### Pricing Tab Navigation
### Scroll Animations
- No global state. Each component manages local `useState`.
- No state library (no Zustand, Redux, etc.)
- URL search params serve as "state" for `PricingTabs` tab selection
## Key Abstractions
- Purpose: Consistent scroll-triggered entry animation across all pages
- Usage: `<AnimateOnScroll delay={0.15}>...</AnimateOnScroll>`
- File: `components/AnimateOnScroll.tsx`
- Pattern: Framer Motion `whileInView`, `initial/animate` with viewport `once: true`
- Purpose: Staggered list/grid reveal animation
- Usage: Wrap container with `<StaggerChildren>`, each item with `<StaggerItem>`
- File: `components/StaggerChildren.tsx`
- Pattern: Framer Motion `variants` with `staggerChildren` transition
- Purpose: Reusable dark call-to-action section with phone + WhatsApp
- Usage: `<CTABanner heading="..." description="..." />`
- File: `components/CTABanner.tsx`
- Pattern: All contact info sourced from `SITE` constant — no hardcoded numbers
- Purpose: Single wrapper for Material Symbols Outlined icon font
- Usage: `<Icon name="air" filled className="text-primary" />`
- File: `components/Icon.tsx`
- Pattern: `filled` prop toggles `fontVariationSettings: "'FILL' 1"`
- Purpose: WebGL animated aurora background using OGL and GLSL shaders
- Usage: Used in `HeroSection` as absolute-positioned background
- File: `components/SoftAurora.tsx`
- Pattern: Fully parametrized (speed, color, noise, mouse interaction)
## Entry Points
- Location: `app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Sets `<html lang="nl">`, loads fonts (Plus Jakarta Sans, Inter, Material Symbols), renders Navbar and Footer around `{children}`
- Location: `app/page.tsx`
- Triggers: Request to `/`
- Responsibilities: Composes all home page sections in order
- Location: `next.config.ts`
- Triggers: `npm run build`
- Responsibilities: Outputs static HTML/CSS/JS to `out/` directory; images unoptimized (no server)
## Architectural Constraints
- **Static export only:** `output: "export"` in `next.config.ts` — no API routes, no server-side rendering at runtime, no Next.js Image optimization
- **No server runtime:** All data is hardcoded in components or `lib/constants.ts`; the only network call is the form webhook POST (client-side)
- **`"use client"` boundary:** Any component using React hooks, `usePathname`, Framer Motion animations, or browser APIs requires `"use client"` at the top
- **`<Suspense>` for `useSearchParams`:** `PricingTabs` uses `useSearchParams` — `TarievenPage` wraps it in `<Suspense>` to satisfy static export requirements
- **Global state:** None. Module-level constants only (`SITE`, `NAV_LINKS`, etc.) in `lib/constants.ts`
- **Circular imports:** None detected
## Anti-Patterns
### Hardcoding contact info in components
### Using `border` for visual separation
### Adding `"use client"` to layout-level or static page files
## Error Handling
- `ContactForm` tracks `"idle" | "sending" | "success" | "error"` state and renders inline feedback
- `submitForm` in `lib/forms.ts` returns `{ ok: boolean }` — callers check `result.ok`
- Dev fallback in `submitForm`: if `NEXT_PUBLIC_GHL_WEBHOOK_URL` is absent, logs to console and returns `{ ok: true }`
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
