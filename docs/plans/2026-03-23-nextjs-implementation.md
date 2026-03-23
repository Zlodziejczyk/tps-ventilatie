# TPS Ventilatie Next.js Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert 3 Stitch HTML designs + firecrawl content into a fully functional Next.js 15 website, deployable via Vercel.

**Architecture:** Next.js 15 App Router with static export. Shared layout (Navbar + Footer) wraps all 6 pages. Tailwind CSS v4 with custom design tokens from the "Atmospheric Clarity" design system. Forms use a central webhook utility pre-wired for GHL.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, App Router, next/image, Google Fonts (Plus Jakarta Sans + Inter), Material Symbols Outlined icons

**Reference files:**
- Design system: `.stitch/aura_flow/DESIGN.md`
- Home HTML: `.stitch/tps_ventilatie_home_page_with_airconditioning/code.html`
- Diensten HTML: `.stitch/onze_diensten_tps_ventilatie/code.html`
- Tarieven HTML: `.stitch/onze_tarieven_tps_ventilatie/code.html`
- Client data: `.firecrawl/contact.md`, `.firecrawl/over-ons.md`, `.firecrawl/home.md`
- All firecrawl service pages in `.firecrawl/`

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `.env.example`

**Step 1: Initialize Next.js 15 with TypeScript and Tailwind**

Run:
```bash
cd "/Users/brickpro-macos/Library/CloudStorage/OneDrive-Personal/work/Polaris360/Projects/TPS Ventilatie"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes
```

Expected: Project scaffolded with `app/` directory, `package.json`, etc.

**Step 2: Configure next.config.ts for static export**

Replace `next.config.ts` with:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

**Step 3: Configure Tailwind with design system tokens**

Replace `tailwind.config.ts` with the full color palette, font families, and border radius from the Stitch HTML `tailwind.config` blocks. All color tokens must be included:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#006580",
        "primary-container": "#257f9c",
        "on-primary": "#ffffff",
        "on-primary-container": "#fffeff",
        "on-primary-fixed": "#001f29",
        "on-primary-fixed-variant": "#004d62",
        "primary-fixed": "#baeaff",
        "primary-fixed-dim": "#82d1f1",
        "inverse-primary": "#82d1f1",
        "secondary": "#5a5f64",
        "secondary-container": "#dce0e6",
        "secondary-fixed": "#dfe3e9",
        "secondary-fixed-dim": "#c2c7cd",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#5e6369",
        "on-secondary-fixed": "#171c21",
        "on-secondary-fixed-variant": "#42474c",
        "tertiary": "#006b42",
        "tertiary-container": "#1b8657",
        "tertiary-fixed": "#94f7be",
        "tertiary-fixed-dim": "#78daa3",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fdfffa",
        "on-tertiary-fixed": "#002111",
        "on-tertiary-fixed-variant": "#005232",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "background": "#f1fbfe",
        "on-background": "#141d1f",
        "surface": "#f1fbfe",
        "surface-dim": "#d2dcdf",
        "surface-bright": "#f1fbfe",
        "surface-variant": "#dae4e7",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#ebf5f8",
        "surface-container": "#e6f0f3",
        "surface-container-high": "#e0eaed",
        "surface-container-highest": "#dae4e7",
        "surface-tint": "#006781",
        "on-surface": "#141d1f",
        "on-surface-variant": "#3f484d",
        "inverse-surface": "#293234",
        "inverse-on-surface": "#e8f2f5",
        "outline": "#6f787d",
        "outline-variant": "#bec8cd",
      },
      fontFamily: {
        headline: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        label: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 4: Set up globals.css with custom utilities**

Replace `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .glass-nav {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .signature-gradient {
    background: linear-gradient(135deg, #006580 0%, #257f9c 100%);
  }

  .text-balance {
    text-wrap: balance;
  }
}

@layer base {
  .material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
    display: inline-block;
    vertical-align: middle;
  }
}

@keyframes air-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

.air-pulse {
  animation: air-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Step 5: Set up root layout with fonts and metadata**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TPS Ventilatie — Uw Ventilatiespecialist",
    template: "%s | TPS Ventilatie",
  },
  description:
    "Specialist in installatie, onderhoud en advies voor WTW units, mechanische ventilatie en airconditioning in de regio Zoetermeer.",
  keywords: [
    "ventilatie",
    "WTW",
    "mechanische ventilatie",
    "airconditioning",
    "Zoetermeer",
    "onderhoud",
    "installatie",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${jakarta.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
        {children}
      </body>
    </html>
  );
}
```

**Step 6: Create .env.example**

```
# GoHighLevel webhook URL — set this to connect forms to GHL
NEXT_PUBLIC_GHL_WEBHOOK_URL=
```

**Step 7: Create placeholder app/page.tsx**

```tsx
export default function Home() {
  return <main className="pt-24 px-6 max-w-7xl mx-auto"><h1 className="text-5xl font-headline font-extrabold">TPS Ventilatie</h1></main>;
}
```

**Step 8: Verify dev server starts**

Run: `npm run dev`
Expected: Server starts at localhost:3000, page renders with "TPS Ventilatie" heading

**Step 9: Add .stitch and .firecrawl to .gitignore**

Append to `.gitignore`:
```
# Reference files (not part of the app)
.stitch/
.firecrawl/
```

**Step 10: Initialize git and commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 15 project with Tailwind design system"
```

---

### Task 2: Create Shared Components — Navbar & Footer

**Files:**
- Create: `components/Navbar.tsx`
- Create: `components/Footer.tsx`
- Create: `components/MobileMenu.tsx`
- Create: `lib/constants.ts`
- Modify: `app/layout.tsx` (wrap children with Navbar + Footer)

**Step 1: Create constants file with site data**

Create `lib/constants.ts`:
```typescript
export const SITE = {
  name: "TPS Ventilatie",
  tagline: "Specialist in Schone Lucht",
  phone: "+31 6 29403450",
  phoneDisplay: "06 - 29 40 34 50",
  email: "info@tpsventilatie.nl",
  address: "Industrieweg 6 B",
  postcode: "2712LB",
  city: "Zoetermeer",
  kvk: "73722650",
  btw: "NL862655889B01",
  whatsappUrl: "https://wa.me/31629403450",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/diensten" },
  { label: "Tarieven", href: "/tarieven" },
  { label: "Over Ons", href: "/over-ons" },
  { label: "Contact", href: "/contact" },
] as const;
```

**Step 2: Create Navbar component**

Create `components/Navbar.tsx` — glassmorphism fixed nav matching Stitch design:
- Fixed top, z-50, glass-nav background
- Logo text "TPS Ventilatie" on left
- Desktop nav links (hidden md:flex) with active state detection via `usePathname()`
- CTA button "Offerte Aanvragen" with signature-gradient
- Mobile hamburger button triggering MobileMenu
- Reference: `.stitch/tps_ventilatie_home_page_with_airconditioning/code.html` lines 91-108

**Step 3: Create MobileMenu component**

Create `components/MobileMenu.tsx`:
- Slide-in overlay with nav links
- Close button
- Phone + WhatsApp CTAs at bottom
- Uses `"use client"` with useState for open/close

**Step 4: Create Footer component**

Create `components/Footer.tsx` — 4-column footer matching Stitch design:
- Column 1: Logo + description
- Column 2: Diensten links
- Column 3: Bedrijf links
- Column 4: Contact info (real data from `SITE` constants)
- Bottom bar with copyright, KvK, BTW
- Reference: `.stitch/onze_tarieven_tps_ventilatie/code.html` lines 370-414

**Step 5: Update layout.tsx to include Navbar + Footer**

Modify `app/layout.tsx` body to wrap children:
```tsx
<body className="...">
  <Navbar />
  {children}
  <Footer />
</body>
```

**Step 6: Verify layout renders**

Run: `npm run dev`
Expected: Nav and footer visible on page, links work, mobile menu opens/closes

**Step 7: Commit**

```bash
git add components/ lib/constants.ts app/layout.tsx
git commit -m "feat: add shared Navbar, MobileMenu, and Footer components"
```

---

### Task 3: Create Utility Components

**Files:**
- Create: `components/CTABanner.tsx`
- Create: `components/ServiceCard.tsx`
- Create: `components/PricingCard.tsx`
- Create: `components/Icon.tsx`
- Create: `lib/forms.ts`

**Step 1: Create Icon wrapper component**

Create `components/Icon.tsx`:
```tsx
interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
}

export function Icon({ name, filled = false, className = "" }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
```

**Step 2: Create CTABanner component**

Create `components/CTABanner.tsx` — dark CTA section matching bottom CTA from Stitch diensten page:
- Dark background (bg-on-primary-fixed), white text, rounded-3xl
- Decorative blur circle
- Heading, description, phone + WhatsApp buttons
- Props: `heading: string`, `description: string`
- Reference: `.stitch/onze_diensten_tps_ventilatie/code.html` lines 312-337

**Step 3: Create ServiceCard component**

Create `components/ServiceCard.tsx`:
```tsx
import { Icon } from "./Icon";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  features?: string[];
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

export function ServiceCard({ icon, title, description, features, primaryAction, secondaryAction }: ServiceCardProps) {
  // bg-surface-container-lowest, rounded-xl, shadow-sm, hover states
  // Green corner glow per design system
  // Reference: Stitch diensten service cards
}
```

**Step 4: Create PricingCard component**

Create `components/PricingCard.tsx`:
```tsx
interface PricingCardProps {
  title: string;
  subtitle?: string;
  price: string;
  features: string[];
  popular?: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export function PricingCard({ title, subtitle, price, features, popular, ctaLabel, ctaHref }: PricingCardProps) {
  // popular: scale-105, border-2 border-primary, shadow-2xl, "Populaire keuze" badge
  // normal: border hover, shadow-sm
  // Reference: Stitch tarieven cards
}
```

**Step 5: Create forms utility**

Create `lib/forms.ts`:
```typescript
export async function submitForm(formId: string, data: Record<string, string>): Promise<{ ok: boolean }> {
  const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId, ...data, submittedAt: new Date().toISOString() }),
    });
    return { ok: res.ok };
  }

  // Dev fallback
  console.log(`[Form ${formId}]`, data);
  return { ok: true };
}
```

**Step 6: Commit**

```bash
git add components/CTABanner.tsx components/ServiceCard.tsx components/PricingCard.tsx components/Icon.tsx lib/forms.ts
git commit -m "feat: add utility components (CTABanner, ServiceCard, PricingCard, Icon) and forms lib"
```

---

### Task 4: Build Home Page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/page-sections/HeroSection.tsx`
- Create: `app/page-sections/ServicesSection.tsx`
- Create: `app/page-sections/PricingSection.tsx`
- Create: `app/page-sections/WhyTPSSection.tsx`
- Create: `app/page-sections/ReviewsSection.tsx`

**Step 1: Create Hero section**

Reference: `.stitch/tps_ventilatie_home_page_with_airconditioning/code.html` lines 110-178

- "Clean Air Technology" badge
- H1: "TPS Ventilatie — Uw Ventilatiespecialist"
- Subtitle, two CTA buttons (Onze Diensten + Bekijk Tarieven)
- Trust badges: Snel afspraak, Geen voorrijkosten, Ervaren Team
- Right side: placeholder image with floating "Luchtkwaliteit Status" card
- Decorative SVG circle

**Step 2: Create Services bento section**

Reference: lines 180-270

- H2: "Onze Diensten"
- Bento grid: WTW (6-col), MV (6-col, primary bg), Airco (12-col full width)
- 3 smaller cards: Kanaalreiniging, Onderhoud, Advies op maat (4-col each)

**Step 3: Create Pricing preview section**

Reference: lines 272-427

- H2: "Transparante Tarieven"
- 2 main cards: WTW Vervanging (vanaf €1450), MV Vervanging (vanaf €480)
- 2 airco cards: Single-split (vanaf €1.650), Multi-split (vanaf €2.850)
- Disclaimer text

**Step 4: Create Why TPS section**

Reference: lines 429-485

- H2: "Waarom kiezen voor TPS Ventilatie?"
- 3 USPs: Gecertificeerd Vakmanschap, Snelle Service, Klantgerichte Aanpak
- Right side: 2x2 image grid with placeholder images

**Step 5: Create Reviews section**

Reference: lines 487-end

- H2: "Wat klanten over ons zeggen"
- 3 review cards with star ratings, quotes, names
- Use real reviews from `.firecrawl/over-ons.md`:
  - Jacqueline Overwater
  - Daan Hazelzet
  - Ton Kooremans

**Step 6: Assemble home page**

Wire all sections into `app/page.tsx`:
```tsx
import { HeroSection } from "./page-sections/HeroSection";
import { ServicesSection } from "./page-sections/ServicesSection";
import { PricingSection } from "./page-sections/PricingSection";
import { WhyTPSSection } from "./page-sections/WhyTPSSection";
import { ReviewsSection } from "./page-sections/ReviewsSection";
import { CTABanner } from "@/components/CTABanner";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <WhyTPSSection />
      <ReviewsSection />
      <CTABanner heading="Klaar voor schone lucht?" description="..." />
    </main>
  );
}
```

**Step 7: Visual verification**

Run: `npm run dev`, check localhost:3000
Expected: Full home page rendering matching Stitch design screenshots

**Step 8: Commit**

```bash
git add app/page.tsx app/page-sections/
git commit -m "feat: build complete home page with all sections"
```

---

### Task 5: Build Diensten Page

**Files:**
- Create: `app/diensten/page.tsx`

**Step 1: Create diensten page**

Reference: `.stitch/onze_diensten_tps_ventilatie/code.html`

Full page with:
- Breadcrumb: Home > Diensten
- H1: "Onze Diensten"
- Sticky category nav (WTW Unit | Mechanische Ventilatie | Airconditioning)
- Section 1: WTW Unit — description + 2 service cards (Vervangen, Onderhoud/Reinigen) + Inregelen banner
- Section 2: Mechanische Ventilatie (bg-surface-container-low) — 3 cards (Onderhoud, Vervangen, Dakventilator)
- Section 3: Airconditioning — "Premium Partner" badge, 4 hover cards (Installatie, Onderhoud, Reparatie, Advies)
- Bottom CTA via CTABanner component

Metadata:
```tsx
export const metadata = {
  title: "Diensten",
  description: "Van ventilatie tot airconditioning — alle diensten van TPS Ventilatie onder één dak.",
};
```

**Step 2: Visual verification**

Run: `npm run dev`, navigate to `/diensten`
Expected: Matches Stitch diensten screenshot

**Step 3: Commit**

```bash
git add app/diensten/
git commit -m "feat: build diensten page with WTW, MV, and airco sections"
```

---

### Task 6: Build Tarieven Page

**Files:**
- Create: `app/tarieven/page.tsx`
- Create: `components/PricingTabs.tsx`

**Step 1: Create PricingTabs client component**

`"use client"` component with tab switching (WTW Unit | Mechanische Ventilatie | Airconditioning):
- Pill-style buttons, active = bg-primary text-white
- Controls which content section is visible

**Step 2: Create tarieven page**

Reference: `.stitch/onze_tarieven_tps_ventilatie/code.html`

- Breadcrumb: Home > Tarieven
- H1: "Onze Tarieven"
- "Geen verborgen kosten" badge
- PricingTabs component
- WTW Tab content:
  - WTW Unit Vervangen: 4 horizontal scroll cards (Itho HRU 200 €1.849, Zehnder E300/400 €2.195 [popular], Zehnder Q350/450 €2.645, Orcon HRC 400 €2.395)
  - Onderhoud & Reinigen: 3 bento cards (Klein €149, Groot €249 [popular], Kanalen €399)
  - Ventilatie Inregelen: 3 small cards (Basis €125, Compleet €195, Compleet+CO2 €275)
- Airconditioning section: dark card with Single Split v.a. €1.550, Multi Split v.a. €2.850
- Bottom CTA: "Klaar voor schone lucht?"
- Disclaimer: prices incl. 21% BTW

Metadata:
```tsx
export const metadata = {
  title: "Tarieven",
  description: "Transparante prijzen voor ventilatie en airconditioning — inclusief BTW en voorrijkosten.",
};
```

**Step 3: Visual verification + commit**

```bash
git add app/tarieven/ components/PricingTabs.tsx
git commit -m "feat: build tarieven page with tab navigation and pricing cards"
```

---

### Task 7: Build Contact Page

**Files:**
- Create: `app/contact/page.tsx`
- Create: `components/ContactForm.tsx`

**Step 1: Create ContactForm client component**

`"use client"` form with fields: Naam, E-mail, Telefoonnummer, Bericht.
- Uses `lib/forms.ts` `submitForm("contact", data)`
- Success/error state display
- Styled with design system (surface-container-highest fill inputs, primary left-accent on focus)
- Submit button with signature-gradient

**Step 2: Create contact page**

- H1: "Contact"
- Two-column layout: form on left, contact info on right
- Contact info: phone (clickable), email (clickable), WhatsApp button, address, Google Maps embed placeholder
- Real data from `lib/constants.ts`

Metadata:
```tsx
export const metadata = {
  title: "Contact",
  description: "Neem contact op met TPS Ventilatie voor advies, afspraken of offertes.",
};
```

**Step 3: Commit**

```bash
git add app/contact/ components/ContactForm.tsx
git commit -m "feat: build contact page with GHL-ready form"
```

---

### Task 8: Build Over Ons Page

**Files:**
- Create: `app/over-ons/page.tsx`

**Step 1: Create over-ons page**

Content from `.firecrawl/over-ons.md`:
- H1: "Over Ons"
- About section: paragraph about TPS Ventilatie, their expertise, service area
- Reviews section: 3 review cards (Jacqueline, Daan, Ton) with star ratings and quotes
- CTA section at bottom

Metadata:
```tsx
export const metadata = {
  title: "Over Ons",
  description: "Leer meer over TPS Ventilatie — uw betrouwbare specialist in schone lucht sinds Zoetermeer.",
};
```

**Step 2: Commit**

```bash
git add app/over-ons/
git commit -m "feat: build over-ons page with reviews"
```

---

### Task 9: Build Privacy Beleid Page

**Files:**
- Create: `app/privacy-beleid/page.tsx`

**Step 1: Create privacy-beleid page**

Content from `.firecrawl/privacy-beleid.md`. Static page with:
- H1: "Privacy Beleid"
- Rendered privacy policy content
- Simple typography-focused layout

Metadata:
```tsx
export const metadata = {
  title: "Privacy Beleid",
  description: "Privacy beleid van TPS Ventilatie.",
};
```

**Step 2: Commit**

```bash
git add app/privacy-beleid/
git commit -m "feat: add privacy policy page"
```

---

### Task 10: Final Polish & Build Verification

**Files:**
- Modify: `CLAUDE.md` (update with real project info)
- Create: `public/images/.gitkeep`

**Step 1: Update CLAUDE.md with real project info**

Replace template CLAUDE.md with actual project details:
- Project: TPS Ventilatie website
- Stack: Next.js 15, TypeScript, Tailwind CSS v4
- Commands: dev, build, lint
- Conventions

**Step 2: Create placeholder images directory**

```bash
mkdir -p public/images
touch public/images/.gitkeep
```

**Step 3: Run production build**

Run: `npm run build`
Expected: Static export succeeds, all pages generated in `out/`

**Step 4: Run lint**

Run: `npm run lint`
Expected: No errors

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: update CLAUDE.md, final polish, verify build"
```

---

### Task 11: Update Memory & Prepare for Deployment

**Step 1: Update project memory**

Update `.claude/projects/.../memory/project_tps_ventilatie.md` with current project state.

**Step 2: Deployment readiness check**

Verify:
- [ ] `npm run build` produces clean static export
- [ ] All 6 pages render correctly
- [ ] Mobile responsive on all pages
- [ ] Forms log to console in dev mode
- [ ] `.env.example` documents GHL webhook URL
- [ ] `.gitignore` excludes .stitch/, .firecrawl/, node_modules/, out/, .next/

The site is now ready for `git remote add origin <repo>` and Vercel deployment.
