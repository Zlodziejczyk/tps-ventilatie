# CLAUDE.md

## Project Overview
TPS Ventilatie website — a professional brochure site for a ventilation specialist in Zoetermeer.
Built with Next.js 15, TypeScript, and Tailwind CSS v4.

## Tech Stack
- Language: TypeScript
- Framework: Next.js 15 (App Router, static export)
- Styling: Tailwind CSS v4 (CSS-first config via `@theme inline`)
- Fonts: Plus Jakarta Sans (headlines), Inter (body), Material Symbols Outlined (icons)
- Package Manager: npm
- Deployment: Vercel (static export to `out/`)

## Project Structure
- app/ — Pages and layouts (App Router)
- app/page-sections/ — Home page section components
- components/ — Reusable UI components (Navbar, Footer, CTABanner, etc.)
- lib/ — Constants and utilities (forms.ts, constants.ts)
- public/ — Static assets and images
- docs/plans/ — Implementation plans

## Commands
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Code Conventions
- Functional components with named exports
- File naming: PascalCase for components, camelCase for utilities
- Double quotes for strings
- `"use client"` only on interactive components (forms, menus, tabs)
- Design system: "Atmospheric Clarity" — see `.stitch/aura_flow/DESIGN.md`

## Important Patterns
- Forms: Use `lib/forms.ts` `submitForm()` — pre-wired for GoHighLevel webhook
- Icons: Use `components/Icon.tsx` wrapper for Material Symbols
- Colors: Full Material Design 3 token set in `app/globals.css` `@theme inline`
- No border lines: Use background color shifts for visual separation (design system rule)

## Things To Avoid
- Never use 1px solid borders for sectioning (use tonal layering)
- Never use 100% black text (use `on-surface` #141D1F)
- Don't modify `.stitch/` or `.firecrawl/` — reference-only files
- Don't add dark mode (not in scope)
