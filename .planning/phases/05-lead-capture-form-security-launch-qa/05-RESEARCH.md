# Phase 5: Lead Capture, Form Security & Launch QA - Research

**Researched:** 2026-06-29
**Domain:** Next.js 16 hybrid hosting · secure Route Handler + validation · Vercel image optimization · mobile Core Web Vitals · layout-level sticky UI
**Confidence:** HIGH (core mechanics verified against current Next.js 16.2.9 docs, Upstash docs, and the live codebase)

<user_constraints>
## User Constraints (from CONTEXT.md)

> Decision IDs are **Phase-5-local** (D-01…D-17). Project-wide decisions referenced by name (e.g. *project D-03 trailingSlash*).

### Locked Decisions

**Hosting & Notification — the Decision Gate**
- **D-01 — Hybrid hosting (THE gate, resolved):** Drop `output: "export"` from `next.config.ts`. Add **one** server Route Handler (e.g. `app/api/lead/route.ts`) that holds the GHL webhook secret **server-side (no `NEXT_PUBLIC_`)**, performs Zod validation + honeypot + rate limiting (QA-02), then POSTs to GHL. Every other page stays statically generated (SSG; `generateStaticParams` unchanged). **Preserve project D-03 `trailingSlash: false` and the project D-01 apex canonical (`https://tpsventilatie.nl`).** → MUST be logged in `.planning/PROJECT.md` Key Decisions (QA-01).
- **D-02 — Owner notification = WhatsApp + email (both)** via the GHL workflow.
- **D-03 — Secret + env:** GHL webhook URL/secret stored as a **Vercel env var scoped to Preview + Production** (not `NEXT_PUBLIC_`). The **agency configures the GHL workflow** (form trigger → WhatsApp + email).
- **D-04 — QA-08 live test on preview:** Real submit → owner-notified test against a **Vercel preview deployment**. **Never push `main` / never `vercel --prod`.**

**Offerte form**
- **D-05 — Field set:** `naam` (required), `telefoon` (**required**), `e-mail` (**optional**), `postcode` (**required**, no service-area logic in v1), `dienst` (required), `bericht`.
- **D-06 — `dienst` input:** Dropdown of the 4 pillars + **"Anders / weet ik nog niet"**, **context-prefilled** from the taxonomy/page when embedded.
- **D-07 — Fail-safe (no silent hang):** try/catch so a network rejection **or** non-OK response sets a visible error state offering **one-tap Bel (`tel:`) + WhatsApp (`wa.me`) fallback + retry**.
- **D-08 — AVG consent (LEAD-06):** Required consent checkbox linking to `/privacy-beleid`; **name GoHighLevel as verwerker (processor)** in the privacy text.
- **D-09 — Reassurance copy:** *gratis, vrijblijvend, reactie binnen 24u* (Dutch).
- **D-10 — Reusable component:** Build as a reusable `<OfferteForm>` so service pages **and the Phase-6 homepage** embed it and post via the same secure route.

**Site-wide contact**
- **D-11 — One shared sticky contact bar (not a separate WhatsApp FAB):** the **validated Sketch-003-D bar**, rendered at **`app/layout.tsx` / body level** (avoid the container-trap). Contents **Bel · WhatsApp · Offerte**; **scroll-in ~200px**; **dismissible (×)**; **mobile-safe** (`padding-bottom: max(12px, env(safe-area-inset-bottom))`, stacked < 560px); **reduced-motion-aware**. **Phase 6 inherits this exact component.**
- **D-12 — Dismissal persists for the session** (`sessionStorage`); reappears on fresh visit.
- **D-13 — Link sweep (LEAD-04):** Verify every CTA, `tel:`, `mailto:`, `wa.me` link across all pages. All values from `SITE`.

**Mobile launch-QA**
- **D-14 — Motion gating (QA-06):** Do **not** mount `SoftAurora` (WebGL) or canvas particles on **mobile** — render the static gradient fallback. On **desktop**, drop to a static snapshot for `prefers-reduced-motion`.
- **D-15 — Contact map (QA-05):** Keep the Google Maps **iframe** but correct coordinates from **`SITE.geo` (52.04822769870841, 4.502050197039296)** and **lazy-load** it.
- **D-16 — Images (QA-07):** Remove `images.unoptimized`; serve **WebP/AVIF + responsive sizes + lazy-loading via `next/image`**. Convert the hero set, the over-ons trust shot, content images.
- **D-17 — CWV launch gate (SEO-10):** Verify **mobile INP < 200ms + good LCP** on the Vercel preview (Lighthouse/PageSpeed).

### Claude's Discretion
- Server-route runtime/location, the **rate-limiting mechanism**, and the exact **Zod schema**.
- The "Offerte" action target on the sticky bar (deep-link to `/contact` vs open the form inline) — keep simple.
- Whether to place a static thumbnail behind the lazy map iframe (optional polish).
- Image-conversion breadth — prioritize LCP-critical images first.

### Deferred Ideas (OUT OF SCOPE)
- **Soft out-of-area postcode hint** (live radius check) — deferred.
- **Full GHL CRM pipelines / nurture** beyond simple notification — v2 (CRM-V2-01).
- **Static map via Static Maps API (key)** — deferred in favor of the corrected lazy iframe.
- **Per-town / per-neighbourhood location pages** — v2 (BLOG-02).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LEAD-01 | Offerte form, reassurance copy, short field set | Extend existing `ContactForm` state machine into reusable `<OfferteForm>`; fields per D-05; `dienst` options from `pillars()` (registry.ts) |
| LEAD-02 | Submit triggers instant owner notification (WhatsApp/email) via GHL | Route Handler POSTs to server-only GHL webhook; GHL workflow (agency-configured) fans out to WhatsApp + email |
| LEAD-03 | Floating contact affordance site-wide | Sketch-003-D sticky bar at `app/layout.tsx` body level (container-trap avoidance verified) |
| LEAD-04 | Every CTA/`tel:`/`mailto:`/`wa.me` verified | Link sweep — all 5 existing usage sites enumerated below; all source `SITE` |
| LEAD-05 | Visible error state + phone/WhatsApp fallback, no silent hang | try/catch in client + structured JSON from route; existing `"error"` state + `bg-error-container` styling reused |
| LEAD-06 | AVG consent + GHL named processor in privacy policy | Required checkbox → `/privacy-beleid`; privacy text edit naming GoHighLevel |
| QA-01 | Resolve + log static-vs-hybrid decision in PROJECT.md | Removing `output: "export"` restores Route Handlers + Image Optimization (Next docs verified) |
| QA-02 | Secure form path: server secret, Zod, honeypot, rate limit | Full pattern below; Zod v4 already installed; `@upstash/ratelimit` recommended for durable limiting |
| QA-04 | Network error handling on submit | try/catch wrapping `fetch`; maps rejection + non-OK to error state |
| QA-05 | Fix placeholder Maps pin | Rebuild embed URL from `SITE.geo`; lazy-mount iframe |
| QA-06 | Gate WebGL aurora + particles on mobile / reduced-motion | `useEnableHeavyMotion` hook (SSR-safe `matchMedia`); only `SoftAurora` is currently live |
| QA-07 | Build-time image optimization (WebP/AVIF) | Remove `unoptimized`; add `formats: ['image/avif','image/webp']`; all images already use `next/image` |
| QA-08 | E2E lead-notification test — real submit → owner notified | Run on Vercel **preview** (serverless functions run on previews) |
| SEO-10 | Mobile CWV pass (INP < 200ms, good LCP) | INP good ≤ 200 ms verified (web.dev); measure on preview via Lighthouse/PSI |
</phase_requirements>

## Summary

Phase 5 is dominated by **one enabling change** — removing `output: "export"` from `next.config.ts` — which simultaneously unlocks every other requirement: server Route Handlers (the secure form path), `next/image` optimization (WebP/AVIF), and a clean place to hold the GHL secret. This is verified against current Next.js 16.2.9 docs: with `output: "export"`, Route Handlers may only return static `GET` responses and cannot read the request, and Image Optimization is disabled; **removing the flag restores both** while every page that has `generateStaticParams`/no dynamic API stays statically prerendered (SSG). `trailingSlash: false` and the apex canonical are independent of output mode and survive untouched.

The codebase is **further along than the requirements imply**, which de-risks the phase: there are **zero raw `<img>` tags** (all images already use `next/image`, several with `fill`/`sizes`/`priority`), so QA-07 is mostly config + a `priority→preload` modernization; and the canvas particle systems (`FocalParticles`/`AmbientParticles`) are **not mounted on any route** — only `SoftAurora` (WebGL, in `HeroSection`) is live and ungated, so QA-06's concrete target on the current site is a single component plus a reusable hook that Phase 6 inherits. The form already has the `idle/sending/success/error` state machine and `bg-error-container` styling to extend (D-07).

**Primary recommendation:** Sequence the `next.config.ts` hybrid flip **first** (it changes the whole build), validate on a Vercel **preview** (local `next build`/`tsx` deadlock on the OneDrive mount — push to a non-`main` branch and let Vercel CI build), then layer the secure `app/api/lead/route.ts` (Zod v4 + honeypot + `@upstash/ratelimit`), the reusable `<OfferteForm>`, the layout-level sticky bar (adapting the sketch CSS to the **real** design tokens — the sketch's `--glass-strong`/`--glass-blur`/`--ease-spring` do **not** exist in `globals.css`), the motion-gate hook, the corrected lazy map, and finally the CWV/link-sweep QA pass on preview. **Never push `main`; never `vercel --prod`.**

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Offerte form UI + client-side UX validation | Browser / Client | — | `<OfferteForm>` is a `"use client"` component; HTML5 + light client checks for UX only |
| Form security: secret, schema validation, honeypot, rate limit, webhook POST | API / Backend (Vercel serverless function) | — | The secret must never reach the browser; validation must be server-authoritative (QA-02) |
| Owner notification (WhatsApp + email) | External service (GoHighLevel) | — | Agency-configured GHL workflow; **not our code** — our route only POSTs the lead |
| ~22 content pages | CDN / Static (SSG prerender) | Frontend Server | Prerendered at build, served from Vercel edge; unchanged by the flip |
| Image optimization (WebP/AVIF, responsive srcset) | Frontend Server (Vercel Image Optimization API) | CDN (edge cache) | On-demand transform at request time, cached on the edge; enabled by dropping `unoptimized` |
| Site-wide sticky contact bar | Browser / Client | — | Scroll/sessionStorage/dismissal are client concerns; mounted at `app/layout.tsx` body level |
| Motion gating (aurora/particles) | Browser / Client | — | `matchMedia` viewport + reduced-motion detection is browser-only |
| Lazy Google Maps embed | Browser / Client | — | IntersectionObserver-mounted iframe |
| CWV measurement (INP/LCP gate) | External tooling (Lighthouse / PageSpeed Insights) | — | Run against the preview URL; not application code |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.1 (installed; latest 16.2.x = 16.2.9) | App Router, Route Handlers, Image Optimization | Project framework — already in use `[VERIFIED: package.json + npm]` |
| `zod` | ^4.4.3 (installed) | Server-side request schema validation for `/api/lead` | Already a project dependency (taxonomy gates use it); the de-facto TS validation lib `[VERIFIED: package.json + npm]` |
| `react` / `react-dom` | 19.2.4 | `<OfferteForm>`, sticky bar, motion-gate hook | Project runtime `[VERIFIED: package.json]` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@upstash/ratelimit` | 2.0.8 | Durable, serverless-correct rate limiting on `/api/lead` | **Recommended** for QA-02's "rate limiting" — reliable across Vercel invocations `[VERIFIED: npm registry + official Upstash docs + slopcheck OK]` |
| `@upstash/redis` | 1.38.0 | REST Redis client backing `@upstash/ratelimit` (`Redis.fromEnv()`) | Required peer of the ratelimiter `[VERIFIED: npm registry + official Upstash docs + slopcheck OK]` |

**Do NOT use `@vercel/kv`** — it is **officially deprecated**. npm deprecation notice: *"Vercel KV is deprecated… moved to Upstash Redis… For new projects, install a Redis integration from Vercel Marketplace."* `[VERIFIED: npm view @vercel/kv deprecated]` The Vercel Marketplace "Upstash Redis" integration provisions the same two env vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) used by `@upstash/ratelimit`.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@upstash/ratelimit` (durable) | **In-memory module-scope Map** token bucket | Simplest (zero new deps/services/env), but **unreliable on Vercel serverless**: memory resets on cold start and is **not shared across concurrent instances** → only weak best-effort. Acceptable ONLY because the honeypot + GHL's own limits are the real defense and traffic is low. If chosen, document the limitation explicitly. |
| `@upstash/ratelimit` | Vercel WAF / Firewall rules | Platform-level rate limiting with no code; viable but coarser (per-path, not per-form-identifier) and config lives in the Vercel dashboard, not git |
| Zod | `valibot` / hand-rolled checks | Zod is already installed and used by the build gates — no reason to add another validator |

**Installation:**
```bash
npm install @upstash/ratelimit @upstash/redis
```
(zod, next, react already present.) **Run `npm install` is fine; do NOT run `npm run build` / `tsx` locally — OneDrive deadlock.** Let Vercel CI build on a pushed preview branch.

**Version verification (run 2026-06-29):**
- `npm view next version` → **16.2.9** (project pins 16.2.1)
- `npm view zod version` → **4.4.3** (matches installed `^4.4.3` — Zod **v4** API applies)
- `npm view @upstash/ratelimit version` → **2.0.8**
- `npm view @upstash/redis version` → **1.38.0**
- `npm view @vercel/kv deprecated` → **deprecated** (do not use)

## Package Legitimacy Audit

slopcheck v0.2.0 run 2026-06-29 (`slopcheck install @upstash/ratelimit @upstash/redis @vercel/kv zod`): **0 phantom packages detected**. Postinstall scripts checked — **none** on any Upstash/Vercel package.

| Package | Registry | Age / Status | Source Repo | slopcheck | Disposition |
|---------|----------|--------------|-------------|-----------|-------------|
| `zod` | npm | Mature, installed | github.com/colinhacks/zod | OK | Approved (already a dependency) |
| `@upstash/ratelimit` | npm | Maintained, v2.0.8 | github.com/upstash/ratelimit-js | OK | Approved — recommended |
| `@upstash/redis` | npm | Maintained, v1.38.0 | github.com/upstash/redis-js | OK | Approved — required peer |
| `@vercel/kv` | npm | **Deprecated** | github.com/vercel/storage | OK | **REMOVED** — deprecated by maintainer |

**Packages removed due to slopcheck [SLOP] verdict:** none.
**Packages flagged [SUS]:** none.
**Packages removed for other reasons:** `@vercel/kv` (maintainer-deprecated; use Upstash directly).

## Architecture Patterns

### System Architecture Diagram

```
                          ┌──────────────────────────────────────────────┐
  Visitor (browser)       │  Vercel Edge / CDN                            │
        │                 │  ~22 pages prerendered (SSG) — unchanged      │
        │  GET /          │  next/image: on-demand WebP/AVIF transform    │
        ├────────────────▶│  (Image Optimization API, edge-cached)        │
        │                 └──────────────────────────────────────────────┘
        │
        │  fills <OfferteForm> (client component)
        │  POST /api/lead  { naam, telefoon, email?, postcode, dienst, bericht?, website(honeypot) }
        ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │  app/api/lead/route.ts   (Vercel serverless function, runtime nodejs) │
  │  1. rate-limit by x-forwarded-for IP  ──▶ @upstash/ratelimit (Redis)  │
  │  2. parse JSON  (400 on malformed)                                    │
  │  3. Zod v4 safeParse  (400 on invalid)                                │
  │  4. honeypot: website field non-empty ▶ return 200 WITHOUT forwarding │
  │  5. read process.env.GHL_WEBHOOK_URL  (server-only, no NEXT_PUBLIC_)  │
  │  6. fetch(GHL webhook)  → 502 on network/non-OK                       │
  │  7. return structured JSON { ok, error? }                            │
  └───────────────────────────────┬─────────────────────────────────────┘
                                   │ POST (secret URL)
                                   ▼
                    ┌──────────────────────────────┐
                    │  GoHighLevel workflow         │  (agency-configured)
                    │  trigger ▶ WhatsApp + email   │──▶ Owner notified in seconds
                    └──────────────────────────────┘

  Client maps { ok:false } / fetch rejection ▶ visible error state
                                              ▶ Bel (tel:) + WhatsApp (wa.me) + Retry
```

### Recommended Project Structure
```
app/
├── api/
│   └── lead/
│       └── route.ts          # NEW — secure POST handler (the only dynamic route)
├── layout.tsx                # + mount <StickyContactBar /> at body level (D-11)
└── contact/page.tsx          # swap <ContactForm/> → <OfferteForm/>; fix map (D-15)
components/
├── OfferteForm.tsx           # NEW — reusable form (refactor of ContactForm) (D-10)
├── StickyContactBar.tsx      # NEW — Sketch-003-D bar, client component (D-11/D-12)
├── LazyMap.tsx               # NEW — IntersectionObserver-mounted map iframe (D-15)
└── HeroSection.tsx           # gate <SoftAurora/> via the hook (D-14)
lib/
├── forms.ts                  # becomes a thin client→/api/lead caller (no secret)
├── lead-schema.ts            # NEW — shared Zod schema (importable by route + form)
└── useEnableHeavyMotion.ts   # NEW — SSR-safe desktop+motion gate hook (D-14)
next.config.ts                # drop output:export + unoptimized; add image formats
.env.example                  # NEXT_PUBLIC_GHL_WEBHOOK_URL → GHL_WEBHOOK_URL (server-only)
```

### Pattern 1: Hybrid flip (the gate) — `next.config.ts`
**What:** Remove `output: "export"` and `images.unoptimized`; keep `trailingSlash: false`; opt into AVIF.
**When to use:** First task of the phase — it changes the whole build.
```ts
// Source: nextjs.org/docs/app/guides/static-exports + .../config/next-config-js/images
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" REMOVED → default hybrid: SSG pages prerender, route handlers
  // run as serverless functions on Vercel. [CITED: nextjs.org static-exports]
  trailingSlash: false,            // project D-03 — independent of output mode, survives
  images: {
    // unoptimized: true REMOVED → Vercel Image Optimization API now active.
    // formats DEFAULT is ['image/webp'] ONLY — AVIF must be opted in explicitly:
    formats: ["image/avif", "image/webp"], // AVIF preferred, WebP fallback
    // deviceSizes/imageSizes defaults are fine for this site (see State of the Art).
  },
};

export default nextConfig;
```
**Verification (Next 16):** With `output:"export"`, "Route Handlers that rely on `Request`", "Cookies/Headers", and "Image Optimization with the default loader" are listed as **unsupported**; removing the flag restores them. `[CITED: nextjs.org/docs/app/guides/static-exports]`

### Pattern 2: Secure Route Handler — `app/api/lead/route.ts`
**What:** A `nodejs`-runtime POST handler. Reading `request.json()` makes the route **inherently dynamic** — in Next 16 you do **not** need `export const dynamic = "force-dynamic"` (that key moved to the legacy "caching-without-cache-components" model). `[CITED: nextjs.org route-segment-config]`
**When to use:** The single dynamic endpoint; everything else stays SSG.
```ts
// Source: nextjs.org Route Handlers + upstash.com ratelimit docs + Zod v4 docs
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { leadSchema } from "@/lib/lead-schema";

export const runtime = "nodejs"; // default; explicit for clarity

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(), // reads UPSTASH_REDIS_REST_URL/_TOKEN
  limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 submits / 10 min per IP
  prefix: "ratelimit:lead",
});

export async function POST(request: NextRequest) {
  // 1. rate limit by client IP (Vercel sets x-forwarded-for; first entry = client)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  // 2. parse JSON safely
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }); }

  // 3. server-authoritative validation
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }
  const data = parsed.data;

  // 4. honeypot — bots fill hidden field; accept silently, do NOT forward
  if (data.website) {
    return NextResponse.json({ ok: true }); // looks successful to the bot
  }

  // 5. server-only secret
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  // 6. forward to GHL (never log the PII payload)
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naam: data.naam, telefoon: data.telefoon, email: data.email ?? "",
        postcode: data.postcode, dienst: data.dienst, bericht: data.bericht ?? "",
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
```

### Pattern 3: Shared Zod v4 schema — `lib/lead-schema.ts`
**What:** One schema imported by both the route (authoritative) and optionally the client (UX).
**Zod v4 idiom:** use top-level `z.email()`, **not** the deprecated `z.string().email()`. `[CITED: zod.dev/v4/changelog]`
```ts
// Source: zod.dev/v4 — z.email() top-level; optional email tolerates empty string
import { z } from "zod";

export const leadSchema = z.object({
  naam: z.string().min(2, "Vul uw naam in").max(100),
  telefoon: z.string().min(8, "Vul een geldig telefoonnummer in").max(20),
  email: z.union([z.email(), z.literal("")]).optional(), // D-05: optional
  postcode: z.string().min(4).max(10),
  dienst: z.string().min(1).max(60),
  bericht: z.string().max(2000).optional(),
  consent: z.literal(true, { error: "Toestemming is vereist" }), // LEAD-06 / D-08
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export type LeadInput = z.infer<typeof leadSchema>;
```

### Pattern 4: SSR-safe motion gate — `lib/useEnableHeavyMotion.ts`
**What:** A hook that returns `false` on the server **and** on first client render, then flips to `true` only after mount when the viewport is desktop **and** motion is allowed. Initializing to `false` guarantees (a) no hydration mismatch and (b) mobile/SSR always renders the static fallback, so the WebGL/canvas component is **never mounted** on mobile.
```ts
// Source: React + MDN matchMedia; pattern hardens existing FocalParticles approach
"use client";
import { useEffect, useState } from "react";

export function useEnableHeavyMotion(minWidth = 768) {
  const [enabled, setEnabled] = useState(false); // SSR + first render = static fallback
  useEffect(() => {
    const desktop = window.matchMedia(`(min-width:${minWidth}px)`);
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(desktop.matches && motionOk.matches);
    update();
    desktop.addEventListener("change", update);
    motionOk.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      motionOk.removeEventListener("change", update);
    };
  }, [minWidth]);
  return enabled;
}
```
Usage in `HeroSection`: `const heavy = useEnableHeavyMotion(); … {heavy ? <SoftAurora …/> : <div className="aurora-fallback" />}` where `.aurora-fallback` is a cheap CSS gradient. This hook is the reusable seam Phase 6 inherits.

### Pattern 5: Layout-level sticky bar — adapt, don't copy, the sketch CSS
**What:** Port Sketch-003-D to `components/StickyContactBar.tsx`, mounted as a **direct child of `<body>`** in `app/layout.tsx`.
**Critical adaptation:** the sketch CSS references tokens that **DO NOT EXIST** in `app/globals.css`: `--glass-strong`, `--glass-blur`, `--ease-spring`. The real tokens are the `@utility glass-nav` (`rgba(255,255,255,0.85)` + `backdrop-filter: blur(20px) saturate(1.2)`) and `signature-gradient`. **Do not paste the sketch CSS verbatim** — translate to Tailwind classes / the `glass-nav` utility and an inline cubic-bezier for the spring.
```tsx
// Source: skill references/trust-and-contact.md (Sketch-003-D), adapted to real tokens
"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";

export function StickyContactBar() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("cbar-dismissed") === "1") { setDismissed(true); return; }
    const onScroll = () => setShow(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[9990] glass-nav shadow-[0_-8px_32px_rgba(0,101,128,0.14)]
                 transition-transform duration-[450ms] motion-reduce:transition-none
                 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
      style={{
        transform: show ? "none" : "translateY(125%)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      {/* inner: .msg + actions (Bel · WhatsApp · Offerte) + close ×; stack < 560px */}
      {/* all hrefs from SITE: tel:${SITE.phone}, SITE.whatsappUrl, /contact */}
    </div>
  );
}
```
**Container-trap check (verified safe):** the `position: fixed` containing block is established only by an ancestor with `transform`, `filter`, `backdrop-filter`, `perspective`, `will-change`, `contain`, or `container-type`. `app/globals.css` sets `overflow-x: clip` on `html, body` — **`overflow` does NOT trap fixed positioning**, so a direct `<body>` child is correct. Keep the bar out of any backdrop-filtered wrapper.

### Pattern 6: Lazy map — `components/LazyMap.tsx`
**What:** A client component that renders a lightweight placeholder and mounts the corrected iframe on first intersection.
**Corrected embed URL (from `SITE.geo`):** the current iframe uses a fake place id (`…0x0`) at the wrong coords (52.0623, 4.4932). Two options:
- **Recommended (official, keyless):** owner/agency grabs a fresh "Embed a map" iframe from the **verified GBP/Google Maps listing** (Share → Embed a map) → exact business pin + name card. One manual step; most correct for launch. `[CITED: Google Maps "Embed a map" share feature]`
- **Programmatic fallback (no owner step):** `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed` built from `SITE.geo` — pins exact coords, keyless. `[ASSUMED: output=embed is the widely-used unofficial keyless form — verify it renders on preview]`

### Anti-Patterns to Avoid
- **Pasting the sketch's `--glass-strong`/`--ease-spring` CSS** — those tokens don't exist; the bar would render unstyled. Adapt to `glass-nav` + Tailwind.
- **Keeping `NEXT_PUBLIC_` on the webhook** — defeats QA-02 entirely; the secret must be `GHL_WEBHOOK_URL` (server-only).
- **Relying on in-memory rate limiting as the sole control** — resets per cold start on serverless; use Upstash or accept it only as honeypot-backed best-effort.
- **Running `next build` / `tsx` locally to verify** — deadlocks on the OneDrive mount; push a preview branch and read Vercel CI.
- **Adding `export const dynamic = "force-dynamic"` reflexively** — unnecessary in Next 16 for a route that reads the request body; it's already dynamic.
- **Mounting the WebGL aurora unconditionally** (current `HeroSection` behavior) — the INP offender; gate it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Request validation | Manual `if (!body.naam …)` chains | `zod` v4 `safeParse` (already installed) | Type-safe, single schema reused client+server, structured errors |
| Rate limiting on serverless | A homemade Map/timestamp limiter as the *only* control | `@upstash/ratelimit` sliding window | Module memory isn't shared across Vercel instances or cold starts |
| Image WebP/AVIF + srcset | `sharp` scripts / manual `<picture>` | `next/image` (already used everywhere) + Vercel Image Optimization | On-demand, edge-cached, responsive — free once `unoptimized` is dropped |
| Desktop/reduced-motion detection | Ad-hoc `window.innerWidth` reads | `matchMedia` in a hook (SSR-safe init) | No hydration mismatch; reacts to viewport + OS motion changes |
| Map lazy-load | Custom scroll math | `IntersectionObserver` (or native iframe `loading="lazy"`) | Robust, no layout thrash |
| Email/phone format checks | Regex zoo | `z.email()` + length bounds | Zod v4 ships maintained format validators |

**Key insight:** Nearly every "secure form" footgun (leaked secret, unvalidated payload, silent failure, unthrottled spam) already has a one-line idiomatic answer in this stack. The phase's value is wiring proven pieces correctly, not inventing mechanisms.

## Runtime State Inventory

> Included because the env-var rename + Vercel/GHL reconfiguration is a migration whose state lives **outside git**. A grep finds the code; it does not find these.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — site has no database (INTEGRATIONS.md: "fully static site; no database"). | None — verified by INTEGRATIONS.md. |
| Live service config | **(1) Vercel env var** `NEXT_PUBLIC_GHL_WEBHOOK_URL` exists in the Vercel project (Preview+Prod) — must be **re-added as server-only `GHL_WEBHOOK_URL`** (no `NEXT_PUBLIC_`). **(2) Upstash Redis** integration must be provisioned (adds `UPSTASH_REDIS_REST_URL/_TOKEN`). **(3) GoHighLevel workflow** (form trigger → WhatsApp + email) must be configured by the agency — lives in the GHL dashboard, not git (D-03). | Vercel dashboard env edits + Upstash Marketplace integration + GHL workflow build; none are code-only |
| OS-registered state | None — no cron, Task Scheduler, pm2, or launchd usage. | None — verified by repo scan (no CI/scheduler config; INTEGRATIONS.md "no CI pipeline"). |
| Secrets/env vars | `.env.example` currently declares `NEXT_PUBLIC_GHL_WEBHOOK_URL=` (public). **Rename to `GHL_WEBHOOK_URL`** and add the two Upstash vars. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is unrelated and stays. | Update `.env.example`; update Vercel; the old `NEXT_PUBLIC_` var should be **deleted** from Vercel after cutover so it can't be read client-side |
| Build artifacts | The build **output mode changes** (export `out/` → server/SSG). No stale local artifact risk because builds run on Vercel CI, not locally. `vercel` CLI 54.18.1 is a project dep (present). | None locally; Vercel rebuilds from scratch per deploy |

**The canonical question — "after every file is updated, what runtime state still has the old value?"** → The **Vercel `NEXT_PUBLIC_GHL_WEBHOOK_URL` env var** (must be replaced + the old one deleted) and the **GHL workflow** (must exist for QA-08 to pass). Both are dashboard state, invisible to grep.

## Common Pitfalls

### Pitfall 1: A page silently opts out of SSG after the flip
**What goes wrong:** Removing `output:"export"` is safe for static pages, but if any page later calls a dynamic function (`cookies()`, `headers()`, uncached `fetch`, `request`-reading) it becomes a serverless render instead of prerendered.
**Why it happens:** Hybrid mode allows dynamic rendering; export mode forbade it (so the codebase is currently "proven static").
**How to avoid:** After the flip, read the Vercel build output — every one of the ~22 routes should show as static/prerendered (`○`/`●`), and only `/api/lead` as a function (`ƒ`). The form uses `useSearchParams` for `dienst` prefill — wrap it in `<Suspense>` (the `PricingTabs` precedent) so it doesn't force dynamic rendering of the host page.
**Warning signs:** A content route appearing as `ƒ (Dynamic)` in the Vercel build log.

### Pitfall 2: `qualities` is now required in Next 16
**What goes wrong:** An `<Image quality={90}>` throws unless `90` is in the `images.qualities` allowlist.
**Why it happens:** Next 16 made `qualities` a security allowlist; the default is `[75]`. `[CITED: nextjs.org images config — "required starting with Next.js 16"]`
**How to avoid:** Either use the default quality (omit the prop) or add the used values: `images.qualities: [75, 90]`. Audit existing `<Image>` usages for custom `quality` props during the flip.
**Warning signs:** Vercel build error referencing image qualities.

### Pitfall 3: `priority` is deprecated → use `preload`
**What goes wrong:** New LCP images written with `priority` log a deprecation; existing `ServiceHero` `priority` still works but is legacy.
**Why it happens:** Next 16 added `preload` and deprecated `priority`. `[CITED: nextjs.org image version history v16.0.0]`
**How to avoid:** For the LCP image on each page (e.g. the home hero in Phase 6, pillar hero), use `preload` instead of `priority`. Optionally modernize the existing `ServiceHero` usage.
**Warning signs:** Build/console deprecation notice on `priority`.

### Pitfall 4: Rate limiter blocks the QA-08 live test
**What goes wrong:** Testing repeated submits on preview trips the limiter and the "owner notified" proof fails confusingly.
**Why it happens:** 5/10 min is deliberately tight.
**How to avoid:** Use distinct test data / wait out the window, or temporarily widen the limit on the preview env; confirm a single clean submit reaches WhatsApp + email.
**Warning signs:** 429s during manual QA.

### Pitfall 5: Hydration mismatch on the sticky bar / motion gate
**What goes wrong:** Reading `sessionStorage`/`matchMedia` during render produces server≠client HTML.
**Why it happens:** Those APIs don't exist on the server.
**How to avoid:** Initialize state to the static/hidden value and only read browser APIs inside `useEffect` (both patterns above do this).
**Warning signs:** React hydration warning in the console.

### Pitfall 6: Cross-origin POST to `/api/lead`
**What goes wrong:** Next Route Handlers don't add CORS, but they also don't block other origins from POSTing — a third-party page could submit.
**Why it happens:** Public endpoint by design.
**How to avoid (ASVS L1, defense-in-depth):** honeypot + rate limit + Zod already blunt abuse; optionally reject when `Origin` is present and not the apex/preview host, and require `Content-Type: application/json`. Don't rely on Origin alone (spoofable by non-browser clients) — it's a cheap extra layer, not the control.
**Warning signs:** Submissions in GHL with no corresponding site session.

## Code Examples

### Thin client caller — `lib/forms.ts` (replaces the webhook-holding version)
```ts
// Source: replaces the NEXT_PUBLIC_ client webhook with a same-origin route call
export async function submitLead(data: Record<string, string>): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { ok: res.ok }; // route returns structured JSON; res.ok=false → error state
  } catch {
    return { ok: false }; // network rejection → D-07 fail-safe error state
  }
}
```

### Link sweep targets (LEAD-04 / D-13) — enumerated from the codebase
All already source `SITE`; the sweep verifies they render and resolve on every page, and that the new bar is the **single** always-on element (there is currently **no** standalone WhatsApp FAB to remove):
- `components/Footer.tsx` — `tel:${SITE.phone}`, `mailto:${SITE.email}`
- `components/ServiceHero.tsx` — `SITE.whatsappUrl`, `tel:${SITE.phone}`
- `components/CTABanner.tsx` — `tel:${SITE.phone}`, `SITE.whatsappUrl`
- `components/MobileMenu.tsx` — `tel:${SITE.phone}`, `SITE.whatsappUrl`
- `app/contact/page.tsx` — `tel:`, `mailto:`, `SITE.whatsappUrl`
- NEW `components/StickyContactBar.tsx` + `<OfferteForm>` error fallback — same `SITE` values.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client webhook via `NEXT_PUBLIC_GHL_WEBHOOK_URL` | Server Route Handler holding `GHL_WEBHOOK_URL` | This phase (D-01/D-03) | Secret leaves the browser; enables validation/throttle |
| `output: "export"` (fully static) | Hybrid (default) — SSG pages + one serverless route | This phase (QA-01) | Unlocks route handlers + image optimization |
| `images: { unoptimized: true }` | Image Optimization on; `formats: ['image/avif','image/webp']` | This phase (D-16) | Real WebP/AVIF + responsive srcset; **AVIF needs explicit opt-in** |
| `<Image priority>` | `<Image preload>` | Next 16.0.0 | `priority` **deprecated**; use `preload` for LCP images |
| `images.qualities` implicit | `qualities` **required**, default `[75]` | Next 16.0.0 | Custom `quality` props must be allowlisted |
| `z.string().email()` | `z.email()` (top-level) | Zod v4 | Old form deprecated; v4 is installed |
| `@vercel/kv` for KV/ratelimit state | `@upstash/ratelimit` + `@upstash/redis` (Marketplace) | Vercel KV deprecation | `@vercel/kv` deprecated — do not use |
| `export const dynamic` in main route-segment table | Reading the request auto-makes a handler dynamic; `dynamic` moved to legacy caching model | Next 16.0.0 | Don't add `force-dynamic` reflexively |

**Deprecated/outdated:**
- `@vercel/kv` — deprecated by maintainer.
- `next/image` `priority` prop — deprecated in favor of `preload`.
- Zod `z.string().email()` — deprecated in v4 in favor of `z.email()`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Keyless `https://www.google.com/maps?q=lat,lng&output=embed` renders a correct pin | Pattern 6 (D-15) | Map shows wrong/blank tile → verify on preview, or use the official GBP "Embed a map" iframe instead |
| A2 | GHL accepts the same flat JSON shape (`{naam, telefoon, …, submittedAt}`) the current client sends, now from the server | Route Handler / LEAD-02 | If GHL expects a different field mapping, notification fails — confirm during QA-08 (agency owns the workflow) |
| A3 | 5 submits / 10 min per IP is an acceptable limit for a low-traffic installer site | Pattern 2 | Too tight → real users blocked; too loose → spam. Tune from preview behavior |
| A4 | Origin/Content-Type checks are sufficient extra hardening at ASVS L1 (no CSRF token needed for a public, unauthenticated lead form) | Security Domain | A public form with no session has no CSRF surface; if auth is ever added, revisit |
| A5 | All ~22 content routes stay SSG after the flip (none currently use dynamic server functions) | Pitfall 1 | A page silently going dynamic raises serverless cost — caught by reading the Vercel build output |
| A6 | LCP "good" ≤ 2.5 s / CLS ≤ 0.1 thresholds (INP ≤ 200 ms is verified) | SEO-10 | Mis-stated gate value — LCP/CLS values are long-stable Google CWV thresholds; confirm in the PSI report |

## Open Questions

1. **Rate-limiter infra vs. zero-infra simplicity**
   - What we know: `@upstash/ratelimit` is the reliable serverless choice; in-memory is simplest but unreliable.
   - What's unclear: whether the owner wants a new (free-tier) Upstash integration provisioned, or prefers honeypot + best-effort in-memory to avoid any new service.
   - Recommendation: default to Upstash (reliable, free tier, 2-min Marketplace setup); document the in-memory fallback so the planner can offer the choice. Either way, honeypot is mandatory.

2. **Map embed source**
   - What we know: the official keyless route is the GBP "Embed a map" iframe; the programmatic `output=embed` form is unofficial.
   - What's unclear: whether the agency will paste a fresh GBP embed (best) or wants it generated from `SITE.geo`.
   - Recommendation: use the GBP embed if the owner can supply it (business name card + verified pin); otherwise `output=embed` from `SITE.geo`, verified on preview.

3. **"Offerte" sticky-bar action target**
   - What we know: D-11 lists Bel · WhatsApp · Offerte; discretion granted on whether Offerte deep-links to `/contact` or opens the form inline.
   - Recommendation: deep-link to `/contact` (or `/contact#offerte`) for launch — simplest, no modal/focus-trap work; inline can come with Phase 6.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/tooling | ✓ | v26.0.0 | — |
| npm | Install deps | ✓ | 11.12.1 | — |
| Vercel CLI | Preview deploys / build gate | ✓ (project dep) | 54.18.1 | `vercel` via `node_modules/.bin` |
| Vercel Image Optimization API | QA-07 (D-16) | ✓ (on Vercel after flip) | platform | — |
| Upstash Redis (Marketplace) | QA-02 rate limiting (recommended) | ✗ (not yet provisioned) | — | honeypot + in-memory best-effort |
| GoHighLevel workflow | LEAD-02 / QA-08 | ✗ (agency must configure) | — | **none** — required for the live notification test |
| Local `next build` / `tsx` | Build verification | ✗ **deadlocks on OneDrive mount** | — | **Vercel CI on a pushed preview branch** |
| slopcheck | Package audit | ✓ | 0.2.0 | — |

**Missing dependencies with no fallback:**
- **GoHighLevel workflow** (form trigger → WhatsApp + email) — QA-08 cannot pass until the agency configures it; the env var `GHL_WEBHOOK_URL` must point at it.
- **Local build/typecheck** — there is *no* safe local fallback; all build/type validation must run on Vercel CI (OneDrive deadlock). Plan accordingly.

**Missing dependencies with fallback:**
- **Upstash Redis** — if not provisioned, honeypot + in-memory best-effort limiting ships QA-02 in a weaker form (document the limitation).

## Validation Architecture

> nyquist_validation is enabled. **Honest constraint:** the project has **no test framework** (package.json has no test runner) and **adding test infrastructure is explicitly Out of Scope** (REQUIREMENTS.md: "Test infrastructure + deep tech-debt refactors … revisit post-launch"). Additionally, **local `next build`/`tsx`/`tsc` deadlock on the OneDrive mount.** Therefore validation for this phase is **build-gate (Vercel CI) + runtime schema contract + preview-based manual checks**, not a unit/e2e suite. The planner should treat these as the validation seams.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | **None installed** — adding one is out of scope this phase |
| Config file | none |
| Quick run command | `git push` to a **non-`main`** branch → Vercel builds the preview (the build gate). Locally: **do not** run `next build`/`tsx` (OneDrive deadlock) |
| Full suite command | Vercel preview build = type-check + prebuild taxonomy/claims gates + prerender of ~22 routes + `/api/lead` function build |

### Phase Requirements → Validation Map
| Req | Behavior to assert | Validation type | Where / how |
|-----|--------------------|-----------------|-------------|
| QA-01 | Build succeeds in hybrid; ~22 routes still SSG, `/api/lead` is a function | Build gate | Read Vercel build output (`○/●` static, `ƒ` for /api/lead) on preview |
| QA-02 | Invalid/oversized/missing-field payloads rejected; honeypot-filled accepted-but-not-forwarded; secret absent from client bundle | Runtime contract + manual | `leadSchema` is the assertion; `curl` the preview `/api/lead` with bad/honeypot bodies; grep the client bundle for the webhook string (must be absent) |
| LEAD-05 / QA-04 | Network failure + non-OK → visible error + Bel/WhatsApp/retry, never stuck "sending" | Manual on preview | Submit with the route forced to 502 / offline; confirm error UI |
| LEAD-02 / QA-08 | Real submit → WhatsApp + email to owner within seconds | Live E2E on **preview** | One clean submit; confirm both channels (agency-configured GHL) |
| LEAD-06 | Submit blocked without consent; privacy page names GHL as processor | Runtime contract + manual | `consent: z.literal(true)` asserts it; visually verify privacy text |
| QA-05 | Map pins the real location | Manual on preview | Visual check against `SITE.geo` |
| QA-06 | No WebGL/canvas mounted on mobile; static fallback; reduced-motion honored | Manual on preview | DevTools mobile emulation + `prefers-reduced-motion` toggle; confirm no `<canvas>` mounts |
| QA-07 / D-16 | Images served as AVIF/WebP with srcset | Manual on preview | Network panel shows `image/avif`/`webp` + `srcset`; Lighthouse "next-gen formats" passes |
| SEO-10 / D-17 | **Mobile INP < 200 ms + good LCP** | Lighthouse / PageSpeed Insights | Run against the **preview URL**; INP good ≤ 200 ms (verified), LCP good ≤ 2.5 s |
| LEAD-04 / D-13 | All contact links resolve on every page | Manual sweep | Click-through the 6 enumerated sites + bar + form fallback |

### Sampling Rate
- **Per task (where safe):** `npm install` + lint only locally; **never** local `next build`.
- **Per wave / pushable checkpoint:** push the preview branch → Vercel build must be green (this is the de-facto "test run").
- **Phase gate:** preview build green **and** the QA-08 live submit proven **and** PSI/Lighthouse mobile INP < 200 ms + good LCP on the preview, before any owner sign-off. `main`/prod stays untouched.

### Wave 0 Gaps
- [ ] **No test framework** — and none will be added (out of scope). Validation is build-gate + schema + manual preview checks. *(This is a deliberate gap, not an oversight.)*
- [ ] **GHL workflow** must exist before QA-08 (agency task, external).
- [ ] **Upstash integration** (or the chosen fallback) must exist before QA-02 rate limiting can be validated.
- [ ] *(Optional, only if the planner wants a cheap automated assertion without a runner)* a single `tsx scripts/check-lead-schema.ts` script mirroring the existing prebuild-gate style could assert the Zod schema accepts/rejects sample inputs — **but** the OneDrive deadlock means it must run in Vercel CI (e.g. as an extra prebuild step), not locally.

## Security Domain

> `security_enforcement: true`, `security_asvs_level: 1`, `security_block_on: high`. This phase introduces the app's only server endpoint, so input-validation and secret-handling are central.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Public, unauthenticated lead form — no accounts |
| V3 Session Management | no | No sessions/cookies introduced |
| V4 Access Control | partial | The endpoint is intentionally public; abuse control = rate limit + honeypot (not authz) |
| V5 Input Validation | **yes** | **Zod v4 `safeParse` server-side** on `/api/lead`; length bounds; honeypot; reject malformed JSON |
| V6 Cryptography | minimal | No app-level crypto; TLS via Vercel; secret stored as env var, never in code |
| V7 Error/Logging | yes | Return generic structured errors to the client; **never log the PII payload** server-side |
| V13/V14 API & Config | **yes** | Server-only `GHL_WEBHOOK_URL` (no `NEXT_PUBLIC_`); delete the old public var; `Content-Type`/`Origin` defense-in-depth |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Webhook URL harvested from client bundle, direct spam | Information Disclosure / DoS | Move secret server-side (no `NEXT_PUBLIC_`); **delete** the old Vercel var post-cutover |
| Bot form spam to GHL | Tampering / DoS | Honeypot (silent accept) + `@upstash/ratelimit` per-IP sliding window |
| Malformed / oversized payloads | Tampering | Zod `safeParse` with `min/max`; reject non-JSON with 400 |
| Cross-origin POST from a third-party page | Spoofing | Honeypot + rate limit + validation; optional `Origin`/`Content-Type` check (cheap extra layer, not sole control) |
| PII leakage via logs/error messages | Information Disclosure | Generic client errors; do not log lead fields; GHL is the AVG processor (named in privacy policy, LEAD-06) |
| Reflected input → XSS | Tampering | Form values are not echoed as HTML (success/error copy is static); keep it that way |

**Block-on-high posture:** the leaked-secret and unvalidated-payload issues catalogued in CONCERNS.md are the high-severity items this phase must close; all are addressed by Patterns 1–3 above.

## Sources

### Primary (HIGH confidence)
- nextjs.org/docs/app/guides/static-exports — `output:"export"` unsupported features (Route Handlers reading Request, Image Optimization, Cookies/Headers); removing it restores them. (v16.2.9, fetched 2026-06-29)
- nextjs.org/docs/app/api-reference/file-conventions/route-segment-config — `runtime` default `nodejs`; `dynamic` moved to legacy caching model in v16. (v16.2.9)
- nextjs.org/docs/app/api-reference/components/image — `priority` deprecated → `preload` (v16.0.0); `loading` defaults lazy. (v16.2.9)
- nextjs.org/docs/app/api-reference/config/next-config-js/images — `formats` default `['image/webp']` (AVIF opt-in); `deviceSizes`/`imageSizes` defaults; `qualities` required in v16, default `[75]`. (v16.2.9)
- upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted — `@upstash/ratelimit` + `@upstash/redis` (`Redis.fromEnv()`), `slidingWindow`, `.limit()` → `{success, remaining, reset}`; env `UPSTASH_REDIS_REST_URL/_TOKEN`.
- zod.dev/v4/changelog — `z.string().email()` deprecated → `z.email()`; v4 breaking changes.
- web.dev/articles/inp — INP good ≤ 200 ms, needs-improvement 200–500 ms, poor > 500 ms, at 75th percentile.
- Codebase (read in-session): `next.config.ts`, `lib/forms.ts`, `components/ContactForm.tsx`, `lib/constants.ts`, `app/layout.tsx`, `app/contact/page.tsx`, `components/ServiceHero.tsx`, `components/SoftAurora.tsx`, `components/FocalParticles.tsx`, `lib/services/registry.ts`, `app/globals.css`, `.claude/skills/sketch-findings-tps-ventilatie/**`.

### Secondary (MEDIUM confidence)
- npm registry (`npm view`): next 16.2.9, zod 4.4.3, @upstash/ratelimit 2.0.8, @upstash/redis 1.38.0, @vercel/kv 3.0.0 **deprecated**.
- slopcheck 0.2.0 audit (0 phantom packages; no postinstall scripts on Upstash/Vercel packages).
- LCP/CLS thresholds (LCP good ≤ 2.5 s, CLS ≤ 0.1) — long-stable Google CWV guidance (confirm in PSI report).

### Tertiary (LOW confidence)
- Keyless `maps?q=lat,lng&output=embed` embed form — widely used but unofficial; verify on preview (Assumption A1).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified on npm; Upstash/Zod/Next usage from official docs; slopcheck clean.
- Architecture (hybrid flip, route handler, image opt): HIGH — confirmed against Next.js 16.2.9 docs and the live codebase.
- Sticky bar / motion gate / map: MEDIUM-HIGH — patterns are standard; the sketch-token mismatch and container-trap are codebase-verified; map embed form is the one ASSUMED item.
- Pitfalls: HIGH — Next 16 version-history items (`priority`, `qualities`, `dynamic`) cited directly.
- Validation/Security: HIGH on the constraints (no test infra, OneDrive deadlock, ASVS L1 scope) — all grounded in config + REQUIREMENTS + CONCERNS.

**Research date:** 2026-06-29
**Valid until:** ~2026-07-29 (30 days; Next.js patch releases and Upstash SDK move fast — re-verify versions if planning slips a month)
