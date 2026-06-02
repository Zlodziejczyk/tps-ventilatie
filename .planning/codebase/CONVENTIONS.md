# Coding Conventions

**Analysis Date:** 2026-06-01

## Naming Patterns

**Files:**
- Components use PascalCase: `ContactForm.tsx`, `ReviewCarousel.tsx`, `AnimateOnScroll.tsx`
- Utilities and hooks use camelCase: `forms.ts`, `constants.ts`, `useParticleEngine.ts`
- Page sections live in `app/page-sections/` and follow PascalCase with a `Section` suffix: `HeroSection.tsx`, `ServicesSection.tsx`
- Next.js pages follow the file-system convention: `app/contact/page.tsx`, `app/tarieven/page.tsx`

**Functions / Components:**
- All React components use named exports (not default), except Next.js route `page.tsx` files which export `default`
- Function names match their file names exactly: file `ContactForm.tsx` exports `ContactForm`
- Internal helper components within a file use PascalCase and are NOT exported: `DienstenPanel`, `TarievenPanel`, `ReviewCard`, `Stars`
- Custom hooks start with `use`: `useParticleEngine`
- Animation variant objects and config constants use camelCase: `fadeUp`, `springTransition`, `container`, `staggerItem`

**Variables / Constants:**
- Module-level data arrays and config objects use SCREAMING_SNAKE_CASE: `SITE`, `NAV_LINKS`, `DIENSTEN_DROPDOWN`, `TABS`, `REVIEWS`, `WTW_UNITS`, `DIRTY_COLORS`
- Local state variables follow camelCase: `mobileOpen`, `currentIndex`, `indicatorStyle`
- Animation transition objects use camelCase: `springTransition`, `fadeUp`

**Types / Interfaces:**
- Props interfaces are named `<ComponentName>Props`: `IconProps`, `CTABannerProps`, `ReviewCarouselProps`
- Domain types are short and descriptive: `Review`, `DropdownItem`, `ParticleConfig`, `Particle`
- String union types are concise: `type Tab = "wtw" | "mv" | "airco"`
- `interface` is used for object shapes (props, config, domain models); `type` is used for unions

## Code Style

**Formatting:**
- No Prettier config found — formatting is enforced implicitly via ESLint + `eslint-config-next`
- Double quotes for all JSX attribute strings and TypeScript string literals
- Semicolons present throughout
- Trailing commas used in multi-line arrays and objects

**Linting:**
- Config: `eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- One custom rule: `"@next/next/no-page-custom-font": "off"` (allows direct `<link>` font loading in layout)
- TypeScript `strict: true` in `tsconfig.json`
- Run: `npm run lint`

## Import Organization

**Order observed across the codebase:**
1. Next.js internals (`"next/link"`, `"next/image"`, `"next/navigation"`, `"next"`)
2. Third-party libraries (`"framer-motion"`, `"react"`)
3. Internal `@/lib/*` utilities and constants
4. Internal `@/components/*` or local `./ComponentName`

**Path Aliases:**
- `@/*` maps to the project root — used for all cross-directory imports
- Relative imports (`./Icon`, `"./MobileMenu"`) are used only within the same directory

**Type-only imports:**
- `import type { ReactNode }` from react and `import type { Review }` from sibling files — used consistently when only the type is needed

## Error Handling

**Patterns:**
- Async form submission wraps `fetch` with a result object `{ ok: boolean }` rather than throwing — the component checks `result.ok` to set UI state
- No try/catch blocks used in the codebase; network errors from `fetch` are swallowed (fetch rejection would leave `status` stuck at `"sending"`)
- Component-level status state machine: `"idle" | "sending" | "success" | "error"` (see `components/ContactForm.tsx`)
- The `submitForm` function in `lib/forms.ts` has a dev fallback: when `NEXT_PUBLIC_GHL_WEBHOOK_URL` is not set, it logs to console and returns `{ ok: true }`

## Logging

**Framework:** `console.log` (development only)

**Patterns:**
- One intentional dev-only `console.log` in `lib/forms.ts` line 21: `console.log(\`[Form ${formId}]\`, data)` inside the "no webhook URL" fallback branch — never fires in production

## Comments

**When to Comment:**
- Inline comments explain non-obvious layout and animation logic: `// Green corner glow`, `// Seed initial particles so animation starts full`, `// Reduced motion — static snapshot`
- Section delimiters inside large render blocks: `{/* WTW Tab */}`, `{/* Navigation arrows */}`
- No JSDoc/TSDoc on any functions — props interfaces serve as self-documentation

## Function Design

**Size:**
- Component functions are generally compact; `PricingTabs.tsx` is the largest at 620 lines but contains large inline data arrays (`WTW_UNITS`, `MV_ONDERHOUD`, etc.) that inflate the count
- Helper functions (`getInitials`, `lerp`, `randomFrom`) are kept very small (2–5 lines)
- The particle engine hook `useParticleEngine` in `lib/useParticleEngine.ts` (391 lines) is intentionally large due to canvas animation loop complexity

**Parameters:**
- Props are destructured at the function signature: `function Icon({ name, filled = false, className = "" }: IconProps)`
- Default parameter values are set inline in destructuring

**Return Values:**
- Server components return JSX directly
- Utilities return plain objects: `{ ok: boolean }`

## Module Design

**Exports:**
- Named exports everywhere except Next.js pages (`export default function Page()`)
- No barrel/index files — every import references the exact file

**`"use client"` Directive:**
- Added only to interactive components that use hooks or browser APIs:
  - `components/ContactForm.tsx` — form state
  - `components/Navbar.tsx` — pathname, dropdown state
  - `components/MobileMenu.tsx` — animation
  - `components/ReviewCarousel.tsx` — carousel state
  - `components/PricingTabs.tsx` — tab state, URL search params
  - `components/AnimateOnScroll.tsx` — framer-motion whileInView
  - `components/StaggerChildren.tsx` — framer-motion
  - `components/SoftAurora.tsx` — WebGL canvas
  - `components/AmbientParticles.tsx`, `components/FocalParticles.tsx` — canvas
  - `lib/useParticleEngine.ts` — RAF loop, DOM events
- Static components (`ServiceCard.tsx`, `CTABanner.tsx`, `Footer.tsx`, `Icon.tsx`, `PricingCard.tsx`, `FanSVG.tsx`) have NO `"use client"` — they are Server Components

## Design System Rules (from CLAUDE.md)

- Never use `1px solid` borders for section separation — use background color token shifts (`bg-surface-container-low`, `bg-surface-container-high`, etc.)
- Never use `#000000` black text — always use `text-on-surface` (`#141D1F`)
- Colors come exclusively from Material Design 3 CSS tokens defined in `app/globals.css` `@theme inline` block
- No dark mode

---

*Convention analysis: 2026-06-01*
