<!-- refreshed: 2026-06-01 -->
# Architecture

**Analysis Date:** 2026-06-01

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    Browser (Static Export via Vercel)                │
├──────────────────────────────────────────────────────────────────────┤
│              Next.js App Router (app/)                               │
│                                                                      │
│  app/layout.tsx  →  Navbar + {children} + Footer                    │
│                                                                      │
│  Pages (Server Components, static)                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│  │ app/page.tsx │ │app/diensten/ │ │app/tarieven/ │                 │
│  │  (Home)      │ │  page.tsx    │ │  page.tsx    │                 │
│  └──────┬───────┘ └──────────────┘ └──────────────┘                │
│         │ imports page-sections                                      │
│         ▼                                                            │
│  app/page-sections/  (home-only section components)                  │
│  HeroSection | ServicesSection | PricingSection |                    │
│  WhyTPSSection | ReviewsSection                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ imports
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│            components/   (shared UI components)                      │
│  Navbar  Footer  CTABanner  ContactForm  Icon  AnimateOnScroll       │
│  StaggerChildren  MobileMenu  DienstenNav  ReviewCarousel            │
│  PricingTabs  PricingCard  ServiceCard  SoftAurora  FanSVG           │
│  AmbientParticles  FocalParticles                                    │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ imports
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│            lib/   (constants, utilities, hooks)                      │
│  constants.ts  (SITE, NAV_LINKS, dropdowns)                         │
│  forms.ts      (submitForm → GoHighLevel webhook)                    │
│  useParticleEngine.ts  (canvas particle system hook)                 │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ fetch
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│            External: GoHighLevel webhook                             │
│            NEXT_PUBLIC_GHL_WEBHOOK_URL (env var)                    │
└─────────────────────────────────────────────────────────────────────┘
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

**Overall:** Static Next.js brochure site using App Router with server components as default, `"use client"` added only for interactive/animated components.

**Key Characteristics:**
- All pages are statically exported (`output: "export"` in `next.config.ts`) — no server runtime
- Pages are Server Components that import Client Components for interactivity
- Shared state is avoided — each interactive component manages its own local state
- Design tokens defined in `app/globals.css` via Tailwind v4 `@theme inline` — all colors, fonts, radii available as CSS custom properties

## Layers

**Pages Layer (`app/`):**
- Purpose: Route definitions, SEO metadata, page layout composition
- Location: `app/`
- Contains: `page.tsx` per route, `layout.tsx`, `globals.css`
- Depends on: `components/`, `lib/`
- Used by: Next.js router (file-based routing)

**Page Sections Layer (`app/page-sections/`):**
- Purpose: Home page section components — not reused across pages
- Location: `app/page-sections/`
- Contains: `HeroSection.tsx`, `ServicesSection.tsx`, `PricingSection.tsx`, `WhyTPSSection.tsx`, `ReviewsSection.tsx`
- Depends on: `components/`, `lib/`
- Used by: `app/page.tsx` only

**Shared Components Layer (`components/`):**
- Purpose: Reusable UI building blocks used across multiple pages
- Location: `components/`
- Contains: Layout chrome (Navbar, Footer), interaction primitives (CTABanner, ContactForm), animation utilities (AnimateOnScroll, StaggerChildren), visual effects (SoftAurora, FanSVG, particles)
- Depends on: `lib/`
- Used by: `app/layout.tsx`, all page files, `app/page-sections/`

**Library Layer (`lib/`):**
- Purpose: Shared constants, utilities, and custom hooks
- Location: `lib/`
- Contains: Business data constants, form submission helper, particle engine hook
- Depends on: Nothing internal
- Used by: All component and page layers

## Data Flow

### Contact Form Submission

1. User fills form in `ContactForm` (`components/ContactForm.tsx`)
2. `handleSubmit` calls `submitForm("contact", data)` from `lib/forms.ts`
3. `submitForm` POSTs JSON to `NEXT_PUBLIC_GHL_WEBHOOK_URL` (env var)
4. GoHighLevel CRM receives lead data
5. Component shows success/error state

### Navigation

1. `Navbar` renders from `app/layout.tsx` — wraps every page
2. Nav links sourced from `NAV_LINKS` in `lib/constants.ts`
3. Dropdown items sourced from `DIENSTEN_DROPDOWN` / `TARIEVEN_DROPDOWN` in `lib/constants.ts`
4. `usePathname()` hook drives active link highlighting in `Navbar` and `MobileMenu`

### Pricing Tab Navigation

1. `TarievenPage` wraps `PricingTabs` in `<Suspense>` (needed for `useSearchParams`)
2. `PricingTabs` reads `?tab=` URL search param to determine active tab
3. URL hash (`#wtw-vervangen`, `#mv-onderhoud`, etc.) used for anchor scrolling from other pages

### Scroll Animations

1. `AnimateOnScroll` wraps any section/element
2. Framer Motion `whileInView` triggers fade-up on viewport entry (`once: true`)
3. `StaggerChildren` + `StaggerItem` pair for list reveals with stagger delay

**State Management:**
- No global state. Each component manages local `useState`.
- No state library (no Zustand, Redux, etc.)
- URL search params serve as "state" for `PricingTabs` tab selection

## Key Abstractions

**`AnimateOnScroll`:**
- Purpose: Consistent scroll-triggered entry animation across all pages
- Usage: `<AnimateOnScroll delay={0.15}>...</AnimateOnScroll>`
- File: `components/AnimateOnScroll.tsx`
- Pattern: Framer Motion `whileInView`, `initial/animate` with viewport `once: true`

**`StaggerChildren` + `StaggerItem`:**
- Purpose: Staggered list/grid reveal animation
- Usage: Wrap container with `<StaggerChildren>`, each item with `<StaggerItem>`
- File: `components/StaggerChildren.tsx`
- Pattern: Framer Motion `variants` with `staggerChildren` transition

**`CTABanner`:**
- Purpose: Reusable dark call-to-action section with phone + WhatsApp
- Usage: `<CTABanner heading="..." description="..." />`
- File: `components/CTABanner.tsx`
- Pattern: All contact info sourced from `SITE` constant — no hardcoded numbers

**`Icon`:**
- Purpose: Single wrapper for Material Symbols Outlined icon font
- Usage: `<Icon name="air" filled className="text-primary" />`
- File: `components/Icon.tsx`
- Pattern: `filled` prop toggles `fontVariationSettings: "'FILL' 1"`

**`SoftAurora`:**
- Purpose: WebGL animated aurora background using OGL and GLSL shaders
- Usage: Used in `HeroSection` as absolute-positioned background
- File: `components/SoftAurora.tsx`
- Pattern: Fully parametrized (speed, color, noise, mouse interaction)

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Sets `<html lang="nl">`, loads fonts (Plus Jakarta Sans, Inter, Material Symbols), renders Navbar and Footer around `{children}`

**Home Page:**
- Location: `app/page.tsx`
- Triggers: Request to `/`
- Responsibilities: Composes all home page sections in order

**Static Export:**
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

**What happens:** Directly writing phone numbers, email, or WhatsApp URLs in JSX strings
**Why it's wrong:** Contact info exists in `lib/constants.ts`; duplication creates maintenance risk
**Do this instead:** Import and use `SITE` from `lib/constants.ts` — e.g. `{SITE.phoneDisplay}`

### Using `border` for visual separation

**What happens:** Adding `border: 1px solid` to create section dividers
**Why it's wrong:** The "Atmospheric Clarity" design system uses tonal background color shifts, not borders
**Do this instead:** Use background color tokens like `bg-surface-container-low`, `bg-surface-container-high` to create depth separation

### Adding `"use client"` to layout-level or static page files

**What happens:** Marking `app/layout.tsx` or simple page files as Client Components
**Why it's wrong:** Pushes the entire subtree to the client bundle; defeats static generation
**Do this instead:** Keep pages and layout as Server Components; isolate interactivity into leaf Client Components

## Error Handling

**Strategy:** Client-side form state only. No API error boundaries since the site is static.

**Patterns:**
- `ContactForm` tracks `"idle" | "sending" | "success" | "error"` state and renders inline feedback
- `submitForm` in `lib/forms.ts` returns `{ ok: boolean }` — callers check `result.ok`
- Dev fallback in `submitForm`: if `NEXT_PUBLIC_GHL_WEBHOOK_URL` is absent, logs to console and returns `{ ok: true }`

## Cross-Cutting Concerns

**Styling:** Tailwind CSS v4 with design tokens in `app/globals.css` `@theme inline` block — all colors and fonts as CSS custom properties

**Icons:** Always use `components/Icon.tsx` — never raw `<span className="material-symbols-outlined">` inline (loses the `filled` prop abstraction)

**Animation:** Framer Motion (`framer-motion`) for all motion. Two reusable patterns: `AnimateOnScroll` (scroll-triggered) and `StaggerChildren/StaggerItem` (staggered lists). Respects `prefers-reduced-motion` via CSS in `globals.css`

**SEO:** Each page exports a `metadata` object (`Metadata` type from `next`). The root layout in `app/layout.tsx` sets site-wide defaults with `title.template`

---

*Architecture analysis: 2026-06-01*
