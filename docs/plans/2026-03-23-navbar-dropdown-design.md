# Navbar Dropdown Menus — Design

## Goal
Add hover-activated dropdown panels to the desktop navbar for "Diensten" and "Tarieven", using framer-motion animations adapted to the Atmospheric Clarity design system.

## Approach
Enhance existing `Navbar.tsx` directly (no new component files). Add `framer-motion` as a dependency.

## Dropdown: Diensten
Rich card grid (3 columns) linking to anchor sections on `/diensten`:
1. **WTW Unit** (icon: `heat_pump`) — Vervanging en installatie van warmteterugwinunits → `/diensten#wtw`
2. **Mechanische Ventilatie** (icon: `air`) — Reiniging en onderhoud van ventilatiekanalen → `/diensten#mechanisch`
3. **Airconditioning** (icon: `ac_unit`) — Installatie, onderhoud en reparatie van aircosystemen → `/diensten#airco`

Each card: icon + title (headline font, bold) + description (body font, `on-surface-variant`).

## Dropdown: Tarieven
Compact panel with:
- Highlight badge: "Alle prijzen incl. BTW" with `tertiary` accent
- Two tonal cards linking to `/tarieven`:
  - **Ventilatie tarieven** (icon: `air`) — WTW, mechanische ventilatie en meer
  - **Airconditioning tarieven** (icon: `ac_unit`) — Split-systemen, onderhoud en reparatie

## Styling
- Panel background: glassmorphism (semi-transparent white + backdrop-blur-12px)
- No borders — tonal layering via `surface-container-low` inner sections
- Shadow: `0 20px 40px rgba(0, 31, 41, 0.06)` (tinted ambient)
- Border radius: `rounded-2xl` (1rem)
- Colors: design tokens only (`on-surface`, `on-surface-variant`, `primary`, `tertiary`)
- Animation: framer-motion spring (mass 0.5, damping 11.5, stiffness 100), `layoutId` for smooth panel switching

## Interaction
- Desktop: `onMouseEnter` opens, `onMouseLeave` on menu area closes
- Mobile: unchanged — hamburger slide-out menu
- Items without dropdowns (Home, Over Ons, Contact) remain simple links

## Files Modified
- `components/Navbar.tsx` — add dropdown state, framer-motion panels
- `lib/constants.ts` — add dropdown content data (services, pricing categories)

## Dependencies
- `framer-motion` (new)
