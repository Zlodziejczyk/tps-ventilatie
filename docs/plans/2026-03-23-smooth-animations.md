# Smooth Animations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add noticeable & dynamic smooth animations across the entire TPS Ventilatie site using framer-motion (already installed).

**Architecture:** Create two reusable client components (`AnimateOnScroll` for fade+slide-in, `StaggerChildren` for staggered grid items). Apply them across all page sections and subpages. Enhance card/button hover states with CSS transitions. Hero gets a custom staggered entrance.

**Tech Stack:** framer-motion (already in package.json), Next.js 15 App Router, Tailwind CSS v4

---

### Task 1: Create `AnimateOnScroll` component

**Files:**
- Create: `components/AnimateOnScroll.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "header" | "article";
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  as = "div",
}: AnimateOnScrollProps) {
  const Component = motion.create(as);

  return (
    <Component
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

---

### Task 2: Create `StaggerChildren` component

**Files:**
- Create: `components/StaggerChildren.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const container = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
};

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerChildrenProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={staggerDelay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 3: Animate HeroSection with staggered entrance

**Files:**
- Modify: `app/page-sections/HeroSection.tsx`

**Step 1: Convert to client component and add staggered entrance**

Add `"use client";` at top. Import `motion` from framer-motion.

Wrap the left column content in a stagger container. Each child element (badge, h1, p, buttons div, trust badges) gets a `motion.div` with staggered delay.

The hero image column gets a separate fade+scale-in animation.

The floating card gets a delayed slide-up animation.

Key changes:
- Badge: delay 0
- H1: delay 0.1
- Subtitle: delay 0.2
- Buttons: delay 0.3
- Trust badges: delay 0.4
- Image: delay 0.3, with slight scale from 0.95
- Floating card: delay 0.6, slide up from y: 20

Use `motion.div` wrappers around existing elements. Do NOT change any existing classNames or structure — only wrap with motion elements.

Example for the badge:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
>
  {/* existing badge div */}
</motion.div>
```

Use `animate` (not `whileInView`) for hero since it's above the fold and should animate on page load.

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: Hero elements animate in sequence on page load

---

### Task 4: Animate ServicesSection

**Files:**
- Modify: `app/page-sections/ServicesSection.tsx`

**Step 1: Add animations**

Add `"use client";` at top. Import `AnimateOnScroll` and `StaggerChildren`/`StaggerItem`.

- Wrap the heading+subtitle block in `<AnimateOnScroll>`
- Wrap the grid in `<StaggerChildren className="grid grid-cols-1 md:grid-cols-12 gap-6">`
- Wrap each grid child (WTW card, MV card, Airco card, 3 small feature cards) in `<StaggerItem className="md:col-span-X">` — move the col-span from the inner div to the StaggerItem wrapper
- Remove `md:col-span-X` from the inner card divs since StaggerItem handles the grid placement

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: Section heading fades in, then grid cards stagger in one by one

---

### Task 5: Animate PricingSection (home page)

**Files:**
- Modify: `app/page-sections/PricingSection.tsx`

**Step 1: Add animations**

Add `"use client";` at top. Import `AnimateOnScroll` and `StaggerChildren`/`StaggerItem`.

- Wrap heading block in `<AnimateOnScroll>`
- Wrap the ventilatie pricing grid in `<StaggerChildren className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">`
- Wrap each pricing card in `<StaggerItem>`
- Wrap the airco divider+heading in `<AnimateOnScroll>`
- Wrap the airco pricing grid in `<StaggerChildren className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">`
- Wrap each airco card in `<StaggerItem>`
- Wrap the disclaimer `<p>` in `<AnimateOnScroll>`

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: Pricing cards stagger in when scrolled into view

---

### Task 6: Animate WhyTPSSection

**Files:**
- Modify: `app/page-sections/WhyTPSSection.tsx`

**Step 1: Add animations**

Add `"use client";` at top. Import `AnimateOnScroll` and `StaggerChildren`/`StaggerItem`.

- Wrap the left column (heading + USPs) in `<AnimateOnScroll>`
- Wrap the USP list in `<StaggerChildren className="space-y-8">`
- Wrap each USP item in `<StaggerItem>`
- Wrap the right column (photo grid) in `<AnimateOnScroll delay={0.2}>`

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: Left column fades in with staggered USP items, photo grid follows

---

### Task 7: Animate ReviewsSection

**Files:**
- Modify: `app/page-sections/ReviewsSection.tsx`

**Step 1: Add animations**

Add `"use client";` at top. Import `AnimateOnScroll` and `StaggerChildren`/`StaggerItem`.

- Wrap the heading block in `<AnimateOnScroll>`
- Replace the grid div with `<StaggerChildren className="grid md:grid-cols-3 gap-8">`
- Wrap each review card in `<StaggerItem>`

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: Review cards stagger in

---

### Task 8: Animate CTABanner

**Files:**
- Modify: `components/CTABanner.tsx`

**Step 1: Add animation**

Add `"use client";` at top. Import `AnimateOnScroll`.

- Wrap the outer section in `<AnimateOnScroll as="section" className="max-w-7xl mx-auto px-6 mb-20">` — move the className from section to AnimateOnScroll
- Remove the outer `<section>` tag since AnimateOnScroll renders as section

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: CTA banner fades+slides in when scrolled to

---

### Task 9: Enhanced hover states via CSS

**Files:**
- Modify: `app/globals.css`

**Step 1: Add hover utility classes**

Add these utilities after the existing `@utility` blocks:

```css
@utility hover-lift {
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@utility hover-lift:hover {
  transform: translateY(-4px);
}

@utility btn-hover {
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@utility btn-hover:hover {
  transform: scale(1.03);
}
```

Also add reduced motion support for these:

```css
@media (prefers-reduced-motion: reduce) {
  .hover-lift,
  .btn-hover {
    transition: none;
  }
  .hover-lift:hover {
    transform: none;
  }
  .btn-hover:hover {
    transform: none;
  }
}
```

**Step 2: Apply `hover-lift` to cards**

Modify these files to add `hover-lift` class:

- `components/ServiceCard.tsx:22` — add `hover-lift` to the outer div className
- `components/PricingCard.tsx:25` — add `hover-lift` to the outer div className
- `app/page-sections/ServicesSection.tsx` — add `hover-lift` to each service card div
- `app/page-sections/PricingSection.tsx` — add `hover-lift` to each pricing card div
- `app/page-sections/ReviewsSection.tsx` — add `hover-lift` to each review card div

**Step 3: Apply `btn-hover` to CTA buttons**

- `app/page-sections/HeroSection.tsx:28` — add `btn-hover` to "Onze Diensten" link
- `components/CTABanner.tsx:24` — add `btn-hover` to phone button
- `components/CTABanner.tsx:33` — add `btn-hover` to WhatsApp button

**Step 4: Verify dev server**

Run: `npm run dev`
Expected: Cards lift on hover, CTA buttons scale slightly on hover

---

### Task 10: Animate Diensten subpage

**Files:**
- Modify: `app/diensten/page.tsx`

**Step 1: Add animations**

This is a server component with `export const metadata`. We need to split it:
- Keep the page as a server component for metadata
- Create a client wrapper OR import AnimateOnScroll (which is already a client component) and wrap sections.

Since `AnimateOnScroll` and `StaggerChildren` are client components, they can be used inside server components as children wrappers without making the page itself a client component.

Apply:
- Wrap the header content in `<AnimateOnScroll>`
- Wrap WTW section grid in `<StaggerChildren>`, cards in `<StaggerItem>`
- Wrap "Inregelen" banner in `<AnimateOnScroll>`
- Wrap MV heading in `<AnimateOnScroll>`
- Wrap MV grid in `<StaggerChildren>`, cards in `<StaggerItem>`
- Wrap enrichment blocks in `<AnimateOnScroll>`
- Wrap Airco heading block in `<AnimateOnScroll>`
- Wrap Airco grid in `<StaggerChildren>`, cards in `<StaggerItem>`
- Add `hover-lift` to service cards

**Step 2: Verify dev server and smooth scroll**

Run: `npm run dev`
Navigate to /diensten, click sticky nav links (#wtw, #mechanisch, #airco)
Expected: Smooth scroll to sections (already have scroll-smooth on html + scroll-mt-32 on sections), content animates in on scroll

---

### Task 11: Animate Over Ons subpage

**Files:**
- Modify: `app/over-ons/page.tsx`

**Step 1: Add animations**

- Wrap breadcrumb+h1 in `<AnimateOnScroll>`
- Wrap left text column in `<AnimateOnScroll>`
- Wrap right USP column in `<StaggerChildren>`, each USP in `<StaggerItem>`
- Wrap reviews heading in `<AnimateOnScroll>`
- Wrap reviews grid in `<StaggerChildren>`, each review in `<StaggerItem>`
- Add `hover-lift` to review cards

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: Content animates in on scroll on /over-ons

---

### Task 12: Animate Contact subpage

**Files:**
- Modify: `app/contact/page.tsx`

**Step 1: Add animations**

- Wrap breadcrumb+h1+subtitle in `<AnimateOnScroll>`
- Wrap form column in `<AnimateOnScroll>`
- Wrap contact info column in `<AnimateOnScroll delay={0.15}>`
- Add `hover-lift` to contact info cards

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: Contact page content animates in

---

### Task 13: Animate Tarieven subpage

**Files:**
- Modify: `app/tarieven/page.tsx`

**Step 1: Add animations**

- Wrap header content in `<AnimateOnScroll>`
- PricingTabs is already a client component — wrap it in `<AnimateOnScroll>`
- Wrap disclaimer in `<AnimateOnScroll>`

**Step 2: Verify dev server**

Run: `npm run dev`
Expected: Tarieven page content animates in

---

### Task 14: Final build verification

**Step 1: Full build**

Run: `npm run build`
Expected: Static export succeeds with no errors

**Step 2: Lint check**

Run: `npm run lint`
Expected: No lint errors

**Step 3: Manual review**

Check all pages in dev server:
- Home: Hero stagger, sections fade+slide, cards stagger in grids
- Diensten: Smooth scroll between sections, content animates
- Tarieven: Header + tabs animate
- Over Ons: Content + reviews animate
- Contact: Form + info animate
- All cards lift on hover
- CTA buttons scale on hover
- prefers-reduced-motion disables animations
