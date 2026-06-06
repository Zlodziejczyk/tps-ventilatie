---
status: diagnosed
phase: 03-seo-infrastructure
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md, 03-04-SUMMARY.md, 03-05-SUMMARY.md, 03-06-SUMMARY.md, 03-07-SUMMARY.md, 03-08-SUMMARY.md]
started: 2026-06-06T00:48:21Z
updated: 2026-06-06T00:55:00Z
verification_method: automated build-output inspection (out/ from 2026-06-06T02:34) + assertion scripts — no Playwright (non-visual phase)
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Sitemap resolves with the correct canonical pages
expected: /sitemap.xml lists exactly the 4 indexable pages as absolute apex URLs (https://tpsventilatie.nl/, /tarieven, /over-ons, /contact); draft service pages and /privacy-beleid excluded.
result: pass
evidence: "out/sitemap.xml — exactly 4 <loc> entries, all absolute apex; no /diensten*, no /privacy-beleid."

### 2. Robots is open and AI-crawler friendly
expected: /robots.txt allows all crawlers, explicitly allows 7 AI bots, has no Disallow, and points to the absolute apex sitemap.
result: pass
evidence: "out/robots.txt — User-Agent * Allow /; GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, CCBot all Allow /; no Disallow; Host + Sitemap = https://tpsventilatie.nl absolute."

### 3. Brand corrected in page titles (no stale "TPS Ventilatie", no double-brand)
expected: Page <title> reads "TPS klimaattechniek | …" — the old "TPS Ventilatie" brand is gone from titles/meta and titles are not double-branded.
result: pass
evidence: "out/index.html <title> = 'TPS klimaattechniek | Airco, warmtepomp & ventilatie Zoetermeer'; 0 stale-brand titles; no '… | TPS klimaattechniek | TPS klimaattechniek' duplication."

### 4. Absolute self-canonical on every page
expected: Each page emits a single absolute self-referencing <link rel="canonical"> from the apex origin (metadataBase set once on the layout).
result: pass
evidence: "out/index.html canonical = https://tpsventilatie.nl (root trailing slash dropped per trailingSlash:false — RFC-equivalent); draft pillar self-canonical = https://tpsventilatie.nl/diensten/airconditioning; layout.tsx metadataBase = new URL(CANONICAL_ORIGIN)."

### 5. OpenGraph + Twitter cards complete
expected: Every page carries OG (title, description, url=canonical, site_name, locale nl_NL, absolute image, type) and Twitter summary_large_image with image.
result: pass
evidence: "out/index.html — full og:* set incl. og:image=https://tpsventilatie.nl/og-default.jpg, og:locale=nl_NL, og:site_name='TPS klimaattechniek'; twitter:card=summary_large_image + twitter:image."

### 6. Site-wide HVACBusiness JSON-LD valid
expected: Home renders one server-side HVACBusiness JSON-LD with stable @id, full NAP, geo, areaServed (60 km GeoCircle + service-area Places), priceRange — and NO aggregateRating/review/sameAs (reserved for Phase 4).
result: pass
evidence: "out/index.html block #1 @type=HVACBusiness, @id=…/#business, full PostalAddress, geo, areaServed = GeoCircle(60000) + 8 Places, priceRange €€; no ratings/sameAs. Server-rendered, < escaped, zero client JS."

### 7. Per-page Service + BreadcrumbList JSON-LD on service pages
expected: Each service-surface route renders a Service node (provider → business @id) and a BreadcrumbList, in addition to the inherited business node.
result: pass
evidence: "out/diensten/airconditioning.html — 3 ld+json blocks: HVACBusiness + Service(provider=…/#business) + BreadcrumbList(3 crumbs). FAQPage correctly absent (faqs empty until Phase 4)."

### 8. Index policy — draft pages noindex, content pages indexable
expected: Draft service pages and /privacy-beleid emit noindex,follow; home/tarieven/over-ons/contact have no noindex. Sitemap membership matches the per-page robots (single lever).
result: pass
evidence: "out/diensten/airconditioning.html + out/privacy-beleid.html = 'noindex, follow'; index/tarieven/over-ons/contact = no noindex. assert-seo.ts confirms the single isIndexable() lever drives both sitemap + robots."

### 9. OG image asset present at correct dimensions
expected: public/og-default.jpg exists at exactly 1200×630, valid JPEG.
result: pass
evidence: "out/og-default.jpg — 1200×630, format jpeg, 82 KB."

### 10. Analytics + Speed Insights + metadataBase + conditional GSC wired
expected: Vercel Analytics + Speed Insights mounted; metadataBase set; GSC verification tag emitted only when the env token is set.
result: pass
evidence: "layout.tsx imports + mounts <Analytics/> + <SpeedInsights/> (lines 72-73); 'insights' present in out/_next client bundle; metadataBase=apex; verification gated on GOOGLE_SITE_VERIFICATION. Runtime tracking script injects only on the deployed Vercel domain (expected)."

### 11. SEO assertion scripts green (regression lock)
expected: scripts/assert-seo.ts passes and the pre-existing assert-registry.ts + assert-site-shape.ts still pass (no regression).
result: pass
evidence: "assert-seo.ts exit 0 ('4 indexable statics, sitemap 4 absolute-apex, apex canonical, HVACBusiness @id w/o ratings, faq null-on-empty'); assert-registry.ts + assert-site-shape.ts both green."

### 12. OG social-share card — visual quality
expected: The share-preview card represents TPS well. Reality: plain grey fan product shot, no logo/business-name/tagline (deferred launch default per 03-02). Human judgment call.
result: issue
reported: "TPS Klimaattechniek — wants the share card branded with the business name"
severity: cosmetic

### 13. Business NAP + geo accuracy
expected: The NAP rendered in JSON-LD/metadata is correct — phone +31 6 29403450, email info@tpsventilatie.nl, address Industrieweg 6 B, 2712LB Zoetermeer. Geo lat/lng 52.0607, 4.494 was flagged owner-verify-pending (A-1, placeholder). Needs owner confirmation.
result: issue
reported: "Map embed with correct coordinates provided — Industrieweg 6 B, 2712 LB Zoetermeer → lat 52.04822769870841, lng 4.502050197039296. (NAP/address itself confirmed correct.)"
severity: minor

### 14. GSC verified + sitemap submitted (owner dashboard)
expected: Owner sets NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel, verifies the property in Google Search Console, and submits /sitemap.xml.
result: blocked
blocked_by: third-party
reason: "Owner dashboard action (GSC + Vercel env). Code side wired & conditional. Documented in docs/seo-owner-runbook.md + 03-USER-SETUP.md."

### 15. Vercel Analytics + Speed Insights collection enabled (owner dashboard)
expected: Owner enables Web Analytics + Speed Insights collection in the Vercel dashboard; data flows once deployed.
result: blocked
blocked_by: third-party
reason: "Owner dashboard toggle; tracking activates only on the deployed Vercel domain. Code wired & in bundle. Documented in runbook + 03-USER-SETUP.md."

### 16. Google Rich Results Test on live URLs (post-deploy)
expected: After deploy, the owner/QA runs Google's Rich Results Test on the live home + a published service URL and it validates the HVACBusiness / Service / BreadcrumbList markup.
result: blocked
blocked_by: release-build
reason: "Rich Results Test requires a live URL. Emitted markup is valid Schema.org. Post-deploy owner/QA step in VERIFICATION.md follow-ups."

### 17. www → apex 301 confirmed (pre-launch)
expected: www.tpsventilatie.nl 301-redirects to the apex before launch (single canonical origin).
result: blocked
blocked_by: third-party
reason: "DNS/hosting redirect confirmation; owner pre-launch step in the runbook."

## Summary

total: 17
passed: 11
issues: 2
pending: 0
skipped: 0
blocked: 4

## Gaps

- truth: "The OG/Twitter social-share card visually represents TPS klimaattechniek (brand present)"
  status: failed
  reason: "User reported: wants the card branded with 'TPS klimaattechniek'. Current card is a plain grey fan product shot with no logo/name/tagline."
  severity: cosmetic
  test: 12
  root_cause: "Launch-default OG card was seeded from public/images/hero-ventilatie.jpg via sips with no brand overlay; a branded/bespoke card was explicitly deferred (decision recorded in 03-02-SUMMARY)."
  artifacts:
    - path: "public/og-default.jpg"
      issue: "Plain product shot — no TPS klimaattechniek logo/name/tagline"
  missing:
    - "Design a branded 1200×630 OG card: logo + 'TPS klimaattechniek' + short tagline (airco · warmtepompen · ventilatie · Zoetermeer e.o.) in brand colors"
  debug_session: "inline — no investigation needed (known deferred design decision, not a defect)"

- truth: "JSON-LD/metadata geo coordinates are the verified business location"
  status: failed
  reason: "User reported: geo pin was a placeholder. Verified coords from owner's Google Maps embed for Industrieweg 6 B, 2712 LB Zoetermeer: lat 52.04822769870841, lng 4.502050197039296."
  severity: minor
  test: 13
  root_cause: "lib/constants.ts:15 SITE.geo held placeholder coords {lat:52.0607,lng:4.4940} (line-14 comment explicitly flagged it owner-verify-pending, A-1). Single source consumed by businessJsonLd() GeoCoordinates + areaServed geoMidpoint."
  artifacts:
    - path: "lib/constants.ts"
      issue: "SITE.geo placeholder lat/lng (line 15) + stale 'do not render as confirmed pin' comment (line 14)"
  missing:
    - "Set SITE.geo = { lat: 52.04822769870841, lng: 4.502050197039296 }"
    - "Update the line-14 comment to reflect the now-verified pin"
  debug_session: "inline — root cause known (single-source placeholder, verified replacement provided)"
