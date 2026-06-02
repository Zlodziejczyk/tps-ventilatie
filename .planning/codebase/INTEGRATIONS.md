# External Integrations

**Analysis Date:** 2026-06-01

## APIs & External Services

**CRM / Lead Capture:**
- GoHighLevel (GHL) — Receives contact form submissions via outgoing webhook POST
  - SDK/Client: None — raw `fetch()` call in `lib/forms.ts`
  - Auth: None on client side; webhook URL acts as the secret
  - Env var: `NEXT_PUBLIC_GHL_WEBHOOK_URL`
  - Payload: `{ formId, ...formFields, submittedAt: ISO8601 }`
  - Graceful fallback: if env var is unset, `submitForm()` logs to console and returns `{ ok: true }`

**Fonts:**
- Google Fonts — Loads Material Symbols Outlined icon font via `<link>` tag in `app/layout.tsx`
  - URL: `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap`
  - No API key required
- Google Fonts CDN (via `next/font/google`) — Self-hosts Plus Jakarta Sans and Inter at build time; no runtime Google dependency after build

**Maps:**
- Google Maps — Embedded as an `<iframe>` on the contact page (`app/contact/page.tsx`)
  - Embed type: Static Maps Embed API (no API key in this embed URL)
  - Address shown: Industrieweg 6B, 2712 LB Zoetermeer

## Data Storage

**Databases:**
- None — this is a fully static site; no database

**File Storage:**
- Local filesystem only — images served from `public/images/`

**Caching:**
- None — static export, CDN-level caching via Vercel

## Authentication & Identity

**Auth Provider:**
- None — no user authentication; public brochure site only

## Monitoring & Observability

**Error Tracking:**
- None detected

**Analytics:**
- None detected in source code (no gtag, no GA script tags, no Plausible, no Vercel Analytics imports)

**Logs:**
- Development: `console.log` fallback in `lib/forms.ts` when GHL webhook URL is absent
- Production: No structured logging

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Project: `tps-ventilatie` (`prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q`)
  - Org: `team_YrD4rsBlATPg7g02y1QThOhg`
  - Config: `.vercel/project.json`

**CI Pipeline:**
- Not detected — no GitHub Actions, no CI config files present

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_GHL_WEBHOOK_URL` — GoHighLevel webhook endpoint; set in Vercel project environment variables

**Secrets location:**
- Vercel project environment variables (production)
- Local `.env.local` file for development (not committed; `.env.example` provides the template)

## Webhooks & Callbacks

**Incoming:**
- None — static site receives no incoming webhooks

**Outgoing:**
- GoHighLevel webhook — triggered on contact form submission from `lib/forms.ts`
  - Method: `POST`
  - Content-Type: `application/json`
  - Endpoint: configured via `NEXT_PUBLIC_GHL_WEBHOOK_URL`

## External Link Integrations

**WhatsApp:**
- Direct link `https://wa.me/31629403450` — opens WhatsApp chat with business number
- Used in: `components/CTABanner.tsx`, `components/MobileMenu.tsx`

**Tel / Mailto:**
- `tel:+31629403450` — direct phone call links
- `mailto:info@tpsventilatie.nl` — direct email links
- Used in: `components/Footer.tsx`, `components/CTABanner.tsx`, `components/MobileMenu.tsx`
- Values sourced from `lib/constants.ts` `SITE` object

---

*Integration audit: 2026-06-01*
