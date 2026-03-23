# TPS Ventilatie — Next.js Website Design

## Stack
- Next.js 15, App Router, TypeScript, Tailwind CSS v4
- Static site with `output: 'export'` for Vercel
- Forms pre-wired for GHL (GoHighLevel) webhook integration

## Pages
| Route | Source |
|-------|--------|
| `/` | Stitch home design |
| `/diensten` | Stitch diensten design |
| `/tarieven` | Stitch tarieven design |
| `/contact` | Firecrawl + new design |
| `/over-ons` | Firecrawl reviews + about |
| `/privacy-beleid` | Firecrawl content |

## Shared Components
- Navbar — Glassmorphism fixed nav, mobile hamburger
- Footer — 4-column, real contact info (KvK 73722650, +31 6 29403450)
- CTABanner — Dark CTA section reusable across pages
- ServiceCard — Icon, title, description, action buttons
- PricingCard — Price, features list, CTA
- ContactForm — GHL-ready form with webhook utility

## Design System
- Colors: Full Material 3 token palette from Stitch (primary #006580, tertiary #006b42, surface hierarchy)
- Fonts: Plus Jakarta Sans (headlines), Inter (body/labels)
- Glassmorphism: bg-white/70 backdrop-blur-md
- Signature gradient: linear-gradient(135deg, #006580, #257f9c)
- No-border cards: tonal layering instead of borders

## Form Strategy
Central `lib/forms.ts` with `submitForm(formId, data)` that posts to `NEXT_PUBLIC_GHL_WEBHOOK_URL` env var when set. Dev fallback logs to console.

## Images
Placeholder images in `/public/images/`. `next/image` with proper alt text. Easy swap later.

## Real Client Data
- Phone: +31 6 29403450
- Email: info@tpsventilatie.nl
- Address: Industrieweg 6 B, 2712LB Zoetermeer
- KvK: 73722650
- Services: WTW Unit (vervangen/onderhoud/inregelen), Mechanische Ventilatie (onderhoud/vervangen/dakventilator), Airconditioning (installatie/onderhoud/reparatie/advies)
