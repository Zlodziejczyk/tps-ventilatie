# Navbar Dropdown Menus — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add hover-activated dropdown panels to the desktop navbar for "Diensten" and "Tarieven" with framer-motion animations, styled to the Atmospheric Clarity design system.

**Architecture:** Enhance the existing `Navbar.tsx` with dropdown state (`active` item tracking) and animated dropdown panels using framer-motion. Dropdown content data lives in `constants.ts`. Mobile menu is untouched. No new component files.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, framer-motion (new dep)

---

### Task 1: Install framer-motion

**Step 1: Install the dependency**

Run: `npm install framer-motion`

**Step 2: Verify installation**

Run: `npm ls framer-motion`
Expected: `framer-motion@<version>` listed under dependencies

---

### Task 2: Add dropdown content data to constants.ts

**Files:**
- Modify: `lib/constants.ts`

**Step 1: Add dropdown data types and content**

Add the following after the existing `NAV_LINKS` export in `lib/constants.ts`:

```typescript
export interface DropdownService {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export interface DropdownTarief {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export const DIENSTEN_DROPDOWN: DropdownService[] = [
  {
    icon: "heat_pump",
    title: "WTW Unit",
    description: "Vervanging en installatie van warmteterugwinunits",
    href: "/diensten#wtw",
  },
  {
    icon: "air",
    title: "Mechanische Ventilatie",
    description: "Reiniging en onderhoud van ventilatiekanalen",
    href: "/diensten#mechanisch",
  },
  {
    icon: "ac_unit",
    title: "Airconditioning",
    description: "Installatie, onderhoud en reparatie van aircosystemen",
    href: "/diensten#airco",
  },
];

export const TARIEVEN_DROPDOWN: DropdownTarief[] = [
  {
    icon: "air",
    title: "Ventilatie tarieven",
    description: "WTW, mechanische ventilatie en meer",
    href: "/tarieven",
  },
  {
    icon: "ac_unit",
    title: "Airconditioning tarieven",
    description: "Split-systemen, onderhoud en reparatie",
    href: "/tarieven",
  },
];
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

---

### Task 3: Rewrite Navbar.tsx with dropdown panels

**Files:**
- Modify: `components/Navbar.tsx`

**Step 1: Replace the full contents of `components/Navbar.tsx`**

Replace the entire file with:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, DIENSTEN_DROPDOWN, TARIEVEN_DROPDOWN } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";
import { Icon } from "./Icon";

const DROPDOWN_ITEMS = ["Diensten", "Tarieven"] as const;

const springTransition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 glass-nav shadow-sm"
        onMouseLeave={() => setActive(null)}
      >
        <div className="flex justify-between items-center px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-xl font-bold text-on-surface font-headline tracking-tight"
          >
            TPS Ventilatie
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const hasDropdown = DROPDOWN_ITEMS.includes(
                link.label as (typeof DROPDOWN_ITEMS)[number]
              );

              if (hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setActive(link.label)}
                  >
                    <Link
                      href={link.href}
                      className={`transition-colors font-medium flex items-center gap-1 ${
                        pathname === link.href || pathname.startsWith(link.href + "#")
                          ? "text-primary"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      {link.label}
                      <motion.span
                        className="material-symbols-outlined text-base"
                        animate={{ rotate: active === link.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        expand_more
                      </motion.span>
                    </Link>

                    <AnimatePresence>
                      {active === link.label && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          transition={springTransition}
                          layoutId="navbar-dropdown"
                          className="absolute top-[calc(100%+1rem)] left-1/2 -translate-x-1/2"
                        >
                          <motion.div
                            layout
                            className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,31,41,0.06)] overflow-hidden"
                          >
                            {link.label === "Diensten" && <DienstenPanel />}
                            {link.label === "Tarieven" && <TarievenPanel />}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex signature-gradient text-on-primary px-6 py-2.5 rounded-lg font-semibold text-sm transition-transform active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Offerte Aanvragen
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-3 text-on-surface cursor-pointer"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function DienstenPanel() {
  return (
    <div className="p-5 grid grid-cols-3 gap-3 w-[540px]">
      {DIENSTEN_DROPDOWN.map((service) => (
        <Link
          key={service.href}
          href={service.href}
          className="group flex flex-col gap-3 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-fixed text-primary">
            <Icon name={service.icon} />
          </span>
          <div>
            <p className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
              {service.title}
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
              {service.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function TarievenPanel() {
  return (
    <div className="p-5 w-[380px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon name="verified" filled className="text-tertiary text-lg" />
        <span className="text-xs font-semibold text-tertiary">
          Alle prijzen incl. BTW
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TARIEVEN_DROPDOWN.map((tarief) => (
          <Link
            key={tarief.title}
            href={tarief.href}
            className="group flex flex-col gap-3 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-fixed text-primary">
              <Icon name={tarief.icon} />
            </span>
            <div>
              <p className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                {tarief.title}
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                {tarief.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify dev server renders correctly**

Run: `npm run dev`
Expected: No errors. Navigate to `http://localhost:3000` and hover over "Diensten" and "Tarieven" — dropdown panels should appear with spring animation.

**Step 3: Verify build succeeds**

Run: `npm run build`
Expected: Static export completes with no errors

---

### Task 4: Visual QA and polish

**Step 1: Test dropdown interactions**

Verify manually in the browser:
- Hovering "Diensten" shows 3-column service cards
- Hovering "Tarieven" shows badge + 2 pricing cards
- Moving mouse between "Diensten" and "Tarieven" smoothly transitions the panel (`layoutId`)
- Moving mouse away from nav area closes the dropdown
- Clicking a dropdown link navigates to the correct page/anchor
- "Home", "Over Ons", "Contact" remain simple links with no dropdown
- Mobile hamburger menu still works as before
- CTA button "Offerte Aanvragen" is unaffected

**Step 2: Test responsive breakpoints**

- At `md` and above: dropdowns visible on hover
- Below `md`: nav links hidden, hamburger menu only, no dropdowns

**Step 3: Run lint**

Run: `npm run lint`
Expected: No new lint errors

---
