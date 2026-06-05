# Phase 03 — User Setup Required

**Status:** Incomplete
**Generated:** 2026-06-05 (plan 03-05)

These steps need owner/external dashboard access — they cannot be done in-repo. The
full operational detail lives in `docs/seo-owner-runbook.md` (plan 03-08); this is the
GSD-tracked checklist.

## Service: Vercel (Analytics + Speed Insights — SEO-09)

The code is wired (`<Analytics />` + `<SpeedInsights />` in `app/layout.tsx`); collection
must be turned on in the dashboard.

### Dashboard config
- [ ] **Enable Web Analytics and Speed Insights** — Vercel Dashboard → Project `tps-app`
  → Analytics / Speed Insights → **Enable**.

Cookieless / privacy-friendly — no cookie-consent banner needed (LEAD-06).

## Service: Google Search Console (verification — SEO-09)

### Environment variables
| Name | Source | Notes |
|------|--------|-------|
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console → Settings → Ownership verification → **HTML tag** (the `content` value) | Public token, not a secret. Set it in Vercel project env. When unset, the verification meta tag is simply omitted (no empty tag shipped). |

### Verification
- [ ] After setting the env var and redeploying, view-source on the homepage and confirm
  `<meta name="google-site-verification" content="…">` is present.
- [ ] In GSC, complete verification, then submit `https://tpsventilatie.nl/sitemap.xml`.

---
*Mark this file complete once the owner has enabled Vercel collection and set the GSC token.*
