# Pitfalls Research

**Domain:** NL local climate-tech (airco / warmtepompen / ventilatie) lead-gen site — Next.js 16 static export + GoHighLevel lead capture, programmatic local-SEO page set
**Researched:** 2026-06-02
**Confidence:** HIGH (local-SEO + Next.js export gotchas verified against Google docs, Dec 2025 Core Update reporting, Next.js 16 docs, and AP/AVG guidance; GHL spam behaviour from HighLevel's own community)

> **Scope note — builds on `.planning/codebase/CONCERNS.md`.** CONCERNS.md already catalogues the *implementation* bugs/debt of the existing 6-page proposal (radius bug, no form error handling, exposed webhook, no JSON-LD, no tests, WebGL/canvas cost). This file covers the **domain-level mistakes for the new launch work** — what goes wrong when you scale to 20+ programmatic Dutch service pages, run real local SEO, and put a public form in front of real lead traffic. Where a CONCERNS.md item becomes a *domain* trap at scale, it is escalated here (marked **↑ from CONCERNS.md**) rather than repeated.

---

## The single most important finding (read first)

**Google's December 2025 Core Update explicitly targets the exact thing this milestone plans to build.** Reporting on the update names "templated location pages that swap in city names but have nothing real underneath" as *the single biggest target*, and "mass-produced AI content without expert oversight" as showing **87% negative impact**. Home services are classified **YMYL** (Your Money or Your Life) — Google applies the same scrutiny it gives health queries. (Sources below; MEDIUM-HIGH confidence — recent third-party reporting on a confirmed Google update, consistent across multiple sources.)

The plan in PROJECT.md — *"data-driven service-page template … generate pages … Claude drafts content"* for *~20+ pages across service × brand × region* — is a textbook setup for this penalty **if executed as pure templating**. It can absolutely be done safely, but only if every generated page carries genuine, page-specific substance and human review. Treat this as the spine that the phase plan must be built around, not a footnote. The entire "Critical Pitfalls" section flows from it.

---

## Critical Pitfalls

### Pitfall 1: Programmatic service pages become "doorway pages" / thin templated content

**What goes wrong:**
The 20+ pages (Installatie / Onderhoud / Reparatie / Advies × Airco / Warmtepomp / WTW / MV, plus brand and regio variants) are generated from one template with only the service noun, brand name, or city swapped. Google's Helpful Content system and the Dec 2025 Core Update classify these as thin/doorway pages — pages that exist to rank, not to help — and either de-index them or suppress the whole domain. Ahrefs' historical penalty data showed doorway-hit sites losing ~75% of organic traffic within 30 days; the 2025 update reportedly hit mass-produced-AI sites with 87% negative impact.

**Why it happens:**
The taxonomy-driven template is the right *engineering* decision (maintainability, per CONCERNS.md's call to extract data) but tempts you to make the *content* equally uniform. "Airco onderhoud" and "WTW onderhoud" share 90% of their words; brand pages (Daikin / Mitsubishi Electric / Mitsubishi Heavy / Ecodan) read identically except the brand name. Each page individually looks fine; the *aggregate* duplication is invisible until Google sees it across the whole site.

**How to avoid:**
- Set a **minimum-unique-substance bar per page** before it may ship: service-specific procedure/steps, what's actually included, realistic price or quote logic, 2-3 genuinely page-specific FAQs, and at least one concrete local or job-site detail. Generic boilerplate (hero, CTA, trust pills) does **not** count toward it.
- **Brand pages must say brand-specific things** — Daikin vs Mitsubishi Ecodan differ in product lines, F-gas/refrigerant, capacity ranges, indoor-unit types. If a brand page would read identically with the brand find-replaced, it is a doorway page — merge it into the pillar instead.
- Prefer **fewer, deeper pages over more, thinner ones.** A strong `/diensten/warmtepompen` pillar beats five anaemic brand stubs. Only split out a sub-page when there is a real, distinct body of content to fill it.
- Use job-site / before-after photos (Google explicitly values these for service businesses) rather than stock — authentic media is itself a thinness antidote and an E-E-A-T signal.

**Warning signs:**
- A new page can be produced by find-replacing one word in an existing page.
- Two pages' visible body text is >70% identical (diff them).
- Search Console later shows "Crawled – currently not indexed" or "Discovered – currently not indexed" piling up on the service pages — Google's polite way of saying "thin/duplicate."
- The owner can't tell two sub-pages apart at a glance.

**Phase to address:**
The **Information-Architecture / service-page-template phase** (design the uniqueness bar into the template + taxonomy from day one) and the **Content phase** (enforce it per page). This must be a phase **gate**, not a post-launch cleanup — recovery requires consolidation + a reconsideration cycle.

---

### Pitfall 2: Keyword cannibalization between the pillar and its own sub-service pages

**What goes wrong:**
`/diensten/airconditioning` (pillar) and `/diensten/airconditioning/installatie` (sub) both target "airco laten installeren Zoetermeer." Google can't tell which to rank, so it splits authority and ranks neither well — or flip-flops between them. The more sub-pages per pillar, the worse the internal competition. Region variants ("airco Zoetermeer" vs "airco Den Haag") compounding on top makes this acute.

**Why it happens:**
The IA is generated from a taxonomy, so nobody consciously assigns each URL a *distinct* primary keyword + search intent. Pillar and sub-pages naturally gravitate to the same head term because they're about the same service. Cannibalization is invisible on any single page — it only appears in aggregate ranking behaviour weeks later.

**How to avoid:**
- Build a **keyword map before writing any page**: one primary keyword + one search intent per URL, written down. Pillar owns the broad/commercial head term ("airconditioning [regio]"); each sub-page owns a distinct long-tail/intent ("airco onderhoud kosten," "airco reparatie storing," "airco advies welk vermogen"). No two URLs share a primary.
- **Internal linking encodes the hierarchy**: sub-pages link *up* to the pillar with descriptive anchors; the pillar links *down* to each sub-page; siblings cross-link where relevant. This tells Google the pillar is canonical for the head term.
- Self-referencing **canonical tags** on every page (see Pitfall 6) so near-duplicate region/brand variants don't compete as accidental duplicates.

**Warning signs:**
- The keyword map has the same primary keyword on two rows (if no map exists, that's the warning sign).
- Two of your own URLs rank on page 1-2 for the same query and trade places week to week.
- Search Console "Performance → Queries" shows one query mapping to several of your URLs with low CTR on all.

**Phase to address:**
**IA / service-page-template phase** (the keyword map is a deliverable of designing the taxonomy — do it once, alongside the page list). Verified in the **SEO/content phase** as pages are written.

---

### Pitfall 3: NAP inconsistency across the page set and against Google Business Profile  ↑ from CONCERNS.md

**What goes wrong:**
Name / Address / Phone (and service-area radius, opening hours, KvK/BTW) disagree between pages, between the site and the **Google Business Profile**, and between the site and directory citations. NAP consistency is a measurable local ranking factor — consistent-NAP businesses are reportedly ~40% more likely to appear in the local pack. Inconsistency dilutes the trust signal and suppresses map/local-pack visibility, which is the *primary* discovery channel for a regional installer.

**Why it happens:**
CONCERNS.md already documents the **50 km vs 100 km service-radius bug** live in the codebase today (`PricingTabs.tsx` 100km vs `tarieven` 50km vs `over-ons` "regio"). That is a NAP inconsistency *in miniature within 6 pages*. Now multiply across 20+ pages, each repeating the service area, phone, and address — plus a separate GBP the agency configures, plus footer/JSON-LD/contact-page copies. Every hand-edited repetition is a chance to drift. The pending **klimaattechniek rebrand** and the **possible domain change** (`tpsventilatie.nl` → `tpsklimaattechniek.nl`) multiply the surfaces that can disagree.

**How to avoid:**
- **Single source of truth, mechanically rendered.** The codebase already centralizes this in `lib/constants.ts` (`SITE`) — *extend that discipline to the new fields*: one canonical `serviceRadiusKm`, one `serviceAreaText`, one address, one phone. **No page hardcodes any of them.** Fix the 50/100 km bug *at the source constant* first, then render everywhere from it.
- The same constants feed the **LocalBusiness JSON-LD** (Pitfall 5) so structured data can't contradict visible copy.
- **Reconcile site ↔ GBP explicitly**: business name, address, phone, categories, and service-area must match the Google Business Profile exactly (same formatting of the phone, same legal name). Make this a checklist item with the GBP open side-by-side.
- Decide the **rebrand + domain question before launch**, or the rename itself becomes a mass NAP/citation-inconsistency event. (Domain change = 301 plan + GBP update + citation updates, not just a deploy.)

**Warning signs:**
- Any number/area appears as a string literal in JSX anywhere outside `lib/constants.ts` (grep for `km`, `0850`, the address).
- Site says one service radius; GBP says another; the contact page Maps pin (placeholder `pb=` per CONCERNS.md) points somewhere else again — three sources, three answers.
- A directory (e.g. an old "TPS Ventilatie" listing) still uses the pre-rebrand name/category after the site moves to "klimaattechniek."

**Phase to address:**
**QA/hardening phase** owns the radius-bug fix and the constants extension (it's a listed launch blocker). **Local-SEO phase** owns the site↔GBP↔citation reconciliation and the rebrand/domain decision.

---

### Pitfall 4: AI-drafted Dutch content at scale fails E-E-A-T for a YMYL home-service

**What goes wrong:**
Claude drafts Dutch copy for 20+ pages + blog/FAQ. Without expert oversight and real experience signals it reads competent-but-generic, trips the "mass-produced AI content" heuristic, and — because home services are **YMYL** — gets held to a high trust bar it doesn't clear. The whole domain's quality score suffers, not just one page. Secondary risk: subtly wrong Dutch technical/regulatory facts (F-gassen certificering, SCIOS/BRL, subsidies like ISDE for warmtepompen, refrigerant types) that erode trust with a knowledgeable local audience and the owner.

**Why it happens:**
"Claude drafts, owner reviews" (a stated Key Decision) is the right model, but the *review* step is where it breaks down: the owner is busy and may rubber-stamp, so AI-generic phrasing and unverified technical claims ship. Volume pressure (20+ pages) makes deep per-page review feel impossible. Dutch fluency masks shallowness — the copy *sounds* native and authoritative even when it's hollow.

**How to avoid:**
- **Position AI as drafting/structuring only; require human refinement into people-first content** — Google's own guidance and the Dec 2025 update both stress human oversight is the dividing line between "helpful AI-assisted" and "penalized mass-produced."
- **Inject real E-E-A-T the AI cannot invent**: the owner Thomas/Tomasz's actual certifications and experience (the planned "Verhaal van Thomas" + 4 USPs Gecertificeerd/Snel/Persoonlijk/Transparant), real project examples, genuine local context (specific Zoetermeer/regio detail), real review quotes, named author/business. Surface certifications and credentials prominently.
- **Verify every technical/regulatory claim** against a primary NL source before publish — F-gassen, BRL/SCIOS, ISDE subsidie amounts, brand spec ranges. Wrong facts on a YMYL page are worse than no facts.
- **Throttle publishing.** Ship a few genuinely strong pages and expand, rather than dumping 20+ AI pages on launch day — a large simultaneous low-differentiation content drop is itself a risk signal and gives no time to verify quality.

**Warning signs:**
- A page has zero information that couldn't have been written without ever having done the job (no specifics, no experience, no local detail).
- Owner review turnaround is suspiciously fast across many pages (rubber-stamping).
- Copy contains hedging AI tells ("it is important to note," "whether you need X or Y, we've got you covered") or unverifiable claims of certification.
- Subsidy/regulation figures with no primary source behind them.

**Phase to address:**
**Content phase** (define the E-E-A-T injection + fact-check checklist *before* drafting; build owner-review into the workflow as a gate). **Trust/Over-ons work** supplies the experience signals the service pages reuse.

---

### Pitfall 5: Missing or invalid LocalBusiness / Service JSON-LD (and GBP mismatch)  ↑ from CONCERNS.md

**What goes wrong:**
CONCERNS.md notes there's *no* JSON-LD yet. The deeper domain trap is adding it **wrong**: `LocalBusiness` (better: an appropriate subtype like `HVACBusiness`) with the wrong/placeholder address, a `priceRange`/`telephone` that contradicts visible copy, fake/self-serving `aggregateRating` (a known manual-action trigger), or `Service`/`areaServed` that disagrees with the page and GBP. Invalid or contradictory schema yields no rich results at best, a structured-data manual action at worst — and silently misleads Google about who/where the business is.

**Why it happens:**
Schema is generated once, often hand-authored or AI-generated, then never re-validated. The address/phone get pasted in rather than sourced from the single constant (see Pitfall 3), so JSON-LD and visible NAP drift apart. `aggregateRating` is tempting because the site already shows 18 reviews — but marking up ratings the page doesn't legitimately/visibly host (or self-applied review markup) violates Google's policy.

**How to avoid:**
- Emit JSON-LD **from `lib/constants.ts`**, same source as visible NAP — they are then structurally incapable of disagreeing.
- Use the correct type (`HVACBusiness`/`LocalBusiness`) with `name`, `address` (PostalAddress), `telephone`, `areaServed`, `geo`, `url`, `openingHours`; per-service pages add `Service` with matching `provider` + `areaServed`.
- **Only mark up `aggregateRating`/`review` if the reviews are genuinely shown on that page and comply with Google's review-snippet policy** (no self-serving first-party ratings). When in doubt, omit ratings markup rather than risk a manual action.
- **Validate** with Google's Rich Results Test + Search Console "Enhancements" after deploy; re-validate after any NAP/rebrand change. Ensure schema `name`/`address`/`phone` matches GBP exactly.

**Warning signs:**
- The address or phone in JSON-LD is a string literal, not pulled from the constant.
- Rich Results Test shows errors/warnings, or Search Console flags "Unparsable structured data."
- `aggregateRating` present but the ratings aren't visibly on the page / aren't policy-compliant.
- Schema NAP ≠ GBP NAP.

**Phase to address:**
**SEO-technical phase** (build + validate the schema, wired to constants). Re-checked in **QA** and again if the **rebrand/domain** lands.

---

### Pitfall 6: Static-export canonical / trailing-slash duplication and sitemap build failure  ↑ from CONCERNS.md

**What goes wrong:**
Two distinct static-export traps:
1. **Canonical/trailing-slash duplicates.** With `output: "export"`, Next.js emits `page/index.html`, reachable as both `/page` and `/page/`. Without a correct `metadataBase` + consistent `trailingSlash` config + Vercel redirects all *agreeing*, every URL becomes a self-duplicate (`/diensten/airco` vs `/diensten/airco/`), splitting signals across 20+ pages. The relative-canonical gotcha (`alternates.canonical: './'`) interacts badly with `trailingSlash` and can emit the wrong canonical.
2. **Sitemap build error.** `app/sitemap.ts` **fails the build under `output: "export"`** unless you add `export const dynamic = "force-static"`. Teams discover this only when the export build breaks — a launch-day surprise.

**Why it happens:**
CONCERNS.md flags the missing sitemap/robots and the static-export image limitation, but not these interaction bugs. They're invisible in `next dev` (which serves both slash forms happily) and only bite in the exported build + on the live CDN. `metadataBase` is easy to forget; `trailingSlash` defaults are easy to leave unconsidered; the sitemap `force-static` requirement is undocumented in the happy-path examples.

**How to avoid:**
- Set **`metadataBase`** to the canonical production origin in root layout, and add an explicit **self-referencing `alternates.canonical`** per page (absolute, slash-form matching the chosen `trailingSlash`). Prefer absolute canonical paths over `./` to dodge the relative-path gotcha.
- **Pick one `trailingSlash` policy** and make `next.config.ts`, the canonical tags, the sitemap URLs, and Vercel redirects all agree. (Vercel's static `cleanUrls`/`trailingSlash` settings must match.)
- For the sitemap, either add **`export const dynamic = "force-static"`** to `app/sitemap.ts`, or generate `public/sitemap.xml` + `public/robots.txt` at build time. For ~20+ URLs a **single** sitemap is correct — **do not** use `generateSitemaps` (its `/sitemap/[id].xml` output is an unnecessary static-export edge case here). Reference the sitemap in `robots.txt` and submit it in Search Console.
- **Verify the actual exported `out/` output and the live URLs**, not just dev. Confirm one canonical per page and that the slash/non-slash variant redirects.

**Warning signs:**
- `npm run build` errors on `/sitemap.xml` mentioning `dynamic`/`revalidate` + `output: export`.
- Viewing source on a live page shows a missing canonical, a `localhost` canonical (metadataBase unset), or a canonical whose slash form doesn't match the URL.
- Both `/page` and `/page/` return 200 with no redirect.
- Search Console "Duplicate without user-selected canonical" appears across the service pages.

**Phase to address:**
**SEO-technical phase** (metadataBase, canonical strategy, sitemap/robots, trailingSlash decision — all together, since they interact). Smoke-tested in **QA** against the exported build and live URLs.

---

### Pitfall 7: Public GHL webhook gets spammed / lead notifications silently fail  ↑ from CONCERNS.md

**What goes wrong:**
Two failure modes on the lead path — the one thing that *is* the product (PROJECT.md core value):
1. **Spam/abuse.** The `NEXT_PUBLIC_` webhook is in client JS (CONCERNS.md). Bots scrape it and POST junk straight to GoHighLevel, bypassing the form. Worse for this milestone: GHL's **own built-in captcha is documented by HighLevel's community as not stopping form spam at all**, so "GHL will handle it" is false comfort. Spam pollutes the CRM and — critically — fires the new **instant owner notification** (WhatsApp/email) on every junk submit, training the owner to ignore notifications.
2. **Silent notification failure.** The whole milestone hinges on form → instant owner WhatsApp/email via a GHL workflow. If the webhook 4xx/5xx/times out (CONCERNS.md: no try/catch — form hangs in "sending"), or the GHL workflow is misconfigured/disabled, **leads vanish with zero visibility**. No server log exists (static site), so nobody notices until the owner asks why it's quiet.

**Why it happens:**
Static export has no server to hide the secret, validate, rate-limit, or log — this is the **static-vs-hybrid open decision** in PROJECT.md surfacing as a concrete risk. Relying on GHL's native protections assumes capabilities its own users report it lacks. The notification chain (form → webhook → GHL workflow → WhatsApp/email provider) has several links and no end-to-end monitoring.

**How to avoid:**
- **Resolve the static-vs-hybrid decision in favour of one server route** (Next.js Route Handler / Vercel function) that holds the webhook as a **server-only secret** (drop `NEXT_PUBLIC_`), validates with a **Zod schema** (CONCERNS.md), applies **rate limiting**, and forwards to GHL. This is the clean fix for spam + secret exposure + validation in one move. (Relaxing `output: "export"` for a single route is the tradeoff PROJECT.md already anticipates.)
- If staying fully static for launch: add a **honeypot field + submission-timing check** (the documented community workaround, since GHL captcha is ineffective), accept the exposed-URL residual risk, and document it.
- **Add the missing try/catch + user-visible error state** so a failed submit never hangs silently and the user is told to call/WhatsApp instead — a lost lead that knows to phone is recoverable; a silent hang is not.
- **Verify the notification end-to-end before launch and monitor it after**: submit a real test, confirm the owner's WhatsApp/email actually fires within seconds, and set up a periodic canary or a "no leads in N days" check so a broken workflow is detected fast.
- **Double-opt-in / lead confirmation** also filters bot leads (a bot won't confirm) — ties into AVG (Pitfall 8).

**Warning signs:**
- The webhook URL is visible in the browser Network tab / built JS (it is, today).
- CRM shows submissions with gibberish names, link-spam messages, or impossible timing.
- The owner says "I'm not getting notifications" or "all leads stopped" — by then they're already lost.
- Submitting with network throttled/offline leaves the form spinning forever.

**Phase to address:**
**Lead-capture & comms phase** owns the notification workflow + end-to-end test + monitoring. **QA/hardening phase** owns the security fix (server route or honeypot, validation, error handling) — and this is where the **static-vs-hybrid decision must be made**, not deferred.

---

### Pitfall 8: AVG/GDPR consent & privacy gaps on the lead forms and WhatsApp affordance

**What goes wrong:**
The contact form (and the new **site-wide floating WhatsApp**) collect personal data (name, phone, email, message — message may contain address/special info) without AVG-compliant consent and disclosure. Under Dutch AVG (enforced by the Autoriteit Persoonsgegevens), this is a real legal/reputational exposure for the client, and broken consent UX (pre-checked boxes) is explicitly non-compliant.

**Why it happens:**
A privacy *policy page* already exists, so it feels "handled" — but AVG requires consent and a privacy link **at the point of collection**, not just a buried page. Devs default to a pre-checked consent box (invalid) or none. The floating WhatsApp is added as a UX convenience and nobody considers that initiating a WhatsApp chat is also a data-processing/disclosure moment.

**How to avoid:**
- **Privacy-statement link placed clearly next to the contact form** (and referenced where the WhatsApp affordance hands off), per AP guidance.
- If using a consent checkbox, it must be **unchecked by default** and the consent text **free, specific, informed, unambiguous**. (Often the cleaner legal basis for an inbound contact form is handling the data subject's own request rather than consent — pick and document the correct AVG grondslag; don't bolt on a meaningless pre-ticked box.)
- State **what happens to the data** (goes to GoHighLevel CRM, used to respond to your request, retention) — and ensure the **privacy policy actually names GoHighLevel as a processor** and covers the WhatsApp channel.
- Make consent **withdrawable** and the form's data flow honest about the third-party processor.

**Warning signs:**
- The form posts personal data with no visible privacy link and no consent affordance at the form.
- A consent checkbox is pre-ticked (or worded as a take-it-or-leave-it bundle).
- The privacy policy doesn't mention GoHighLevel/LeadConnector or WhatsApp.
- No documented legal basis (grondslag) for the lead processing.

**Phase to address:**
**Lead-capture & comms phase** (consent UX on form + WhatsApp at point of collection) and the **Content/legal pass** (privacy policy names the processor and channels). Light lift, easy to forget — make it an explicit checklist item.

---

### Pitfall 9: WebGL aurora + dual canvas loops tank mobile INP/LCP (Core Web Vitals)  ↑ from CONCERNS.md

**What goes wrong:**
CONCERNS.md documents the *render cost* of `SoftAurora` (WebGL/OGL, continuous RAF) and the *two* particle systems (`FocalParticles` + `AmbientParticles`, each its own RAF loop calling `getBoundingClientRect()` per frame). The **domain consequence** is Core Web Vitals failure on mobile — the exact device class most local "airco/warmtepomp Zoetermeer" searches happen on:
- **INP** is the most-failed Core Web Vital (≈43% of sites fail the 200 ms threshold). Any JS task >50 ms blocks the main thread; three concurrent animation loops + Framer Motion hydration are prime offenders, so a tap on the menu/CTA feels laggy → worse INP.
- **LCP**: the hero text/visual sits *in front of* the aurora; the heavy WebGL init competes with rendering the LCP element on a mid-range Android, and only ~62% of mobile pages pass LCP as is.
Poor CWV is both a (minor) ranking input and a real conversion drag on the one page (home/hero) every lead sees first.

**Why it happens:**
The effects are gorgeous on the developer's desktop and "feel premium," so cost is underweighted. CONCERNS.md's prop-reference bug (full 13-prop dependency array tearing down/rebuilding the WebGL context on parent re-render) makes it worse than steady-state. Nobody measures on a throttled mid-range device. New pages reuse the hero pattern, spreading the cost site-wide.

**How to avoid:**
- **Measure on real/throttled mobile** (Lighthouse mobile + field data via CrUX/Search Console "Core Web Vitals"), not desktop — make a passing mobile CWV run a launch criterion.
- Apply CONCERNS.md's fixes (memoize `SoftAurora`, stabilize props, cache `getBoundingClientRect` to resize only, shared scheduler) **and** gate the expensive effects: **honor `prefers-reduced-motion`** (already partly in `globals.css`), drop DPR on mobile, and/or **swap the WebGL aurora for a CSS-gradient fallback on small/low-end screens**. Don't run two particle systems on the same viewport on mobile.
- **Protect LCP**: ensure the hero's LCP element renders without waiting on WebGL; never lazy-load it; `fetchpriority="high"` on any hero image; serve hero imagery as pre-optimized WebP/AVIF (CONCERNS.md's `images:{unoptimized:true}` means *manual* optimization — see Pitfall 10).
- Reuse a **single vetted hero pattern** across new pages so the budget is paid once and capped.

**Warning signs:**
- Lighthouse *mobile* INP/LCP in the red; field CWV "Needs improvement"/"Poor" in Search Console.
- Tapping the navbar/CTA on a real Android feels delayed.
- DevTools Performance shows long tasks and multiple concurrent RAF loops on the home page.
- Battery/fan spin-up on the hero (continuous GPU work).

**Phase to address:**
**Performance / QA-hardening phase** (mobile CWV budget + effect gating as a launch gate). The **IA/template phase** should bake the capped hero pattern in so new pages don't multiply the cost.

---

### Pitfall 10: Unoptimized images at 20+ pages drag LCP and page weight  ↑ from CONCERNS.md

**What goes wrong:**
CONCERNS.md flags `images:{unoptimized:true}` (forced by `output:"export"`). At 6 pages it's a nuisance; across **20+ service/brand pages**, each with product and job-site photography, it becomes systemic: multi-MB full-res JPEG/PNG served raw, no responsive `sizes`, no WebP/AVIF → slow LCP on mobile (compounding Pitfall 9) and heavy pages on mobile data.

**Why it happens:**
Static export disables Next.js's automatic image pipeline, and the project leans into rich photography (a stated content goal — brand installs, before/after). Without a *build-time* optimization step, every new image ships unoptimized by default, and the regression scales linearly with the page count.

**How to avoid:**
- Add a **build-time image optimization step** (`sharp`/`squoosh`, or a pre-commit/CI transform) producing **WebP/AVIF + multiple widths**; set explicit `sizes` on every `<Image>` (CONCERNS.md's exact recommendation) — make it part of the page-template workflow so it's automatic, not per-page discipline.
- Cap source dimensions and weight; lazy-load **below-the-fold** images but never the LCP/hero one.
- (Decision input) if image volume becomes unmanageable, the alternative is relaxing static export to a Vercel-hosted deployment with the Image Optimization API — overlaps the same static-vs-hybrid decision as Pitfall 7.

**Warning signs:**
- `public/` accumulating multi-MB images; Lighthouse "Properly size images"/"Serve images in next-gen formats" flagged.
- Network panel shows full-res originals on mobile.
- New pages added without any image processing step.

**Phase to address:**
**Performance/QA phase** (the optimization pipeline). Wired into the **IA/template phase** so the template enforces it for every generated page.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Pure templated pages, brand/city find-replace, no per-page substance | 20+ pages live fast | Doorway/thin penalty (Dec 2025 update target); domain-wide suppression; consolidation + reconsideration to recover | **Never** for indexable money pages. OK only for genuinely differentiated pages |
| Keep webhook client-side (`NEXT_PUBLIC_`) + honeypot for launch | No server route; stay fully static | Exposed secret, spammable, no validation/log; notification path unmonitored | Only as a **short, documented** launch bridge with honeypot + visible error handling; plan the server route |
| AI drafts shipped with light/rubber-stamp review | Content volume now | E-E-A-T failure on YMYL; wrong NL technical/subsidy facts erode trust | Only with real per-page human refinement + fact-check; never bulk-publish unreviewed |
| Hardcode NAP/radius/area per page | Quick copy edits | NAP drift (the 50/100 km bug, ×20+); local-pack suppression; rebrand becomes a mass-edit | **Never** — render from `lib/constants.ts` |
| `generateSitemaps` / multi-sitemap "to be safe" | Feels scalable | Static-export `/sitemap/[id].xml` edge cases for a 20-URL site | Never at this scale — single sitemap |
| Ship hero WebGL + dual particles unchanged on mobile | Premium feel, no rework | Mobile INP/LCP failure on the first page every lead sees | Only with reduced-motion + low-end fallback + measured budget |
| Defer the static-vs-hybrid decision | Avoids the call now | Form security, notification reliability, and image optimization all stay blocked on it | Never defer past comms/QA planning — it gates three pitfalls |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GoHighLevel webhook | Trusting GHL's built-in captcha to stop spam (its own community says it doesn't) | Server route + Zod + rate limit (preferred), or honeypot + timing check; treat GHL native protection as insufficient |
| GHL workflow → owner WhatsApp/email | Assume it fires; no end-to-end test or monitoring | Send a real test submission; confirm owner notification arrives in seconds; add a "no leads in N days" canary |
| Google Business Profile | Site NAP/categories/service-area drift from GBP; static GBP left stale | Match site↔GBP exactly from one source; keep GBP *active* (posts/photos/reviews) — Google now weights dynamic GBP signals |
| Google Search Console | Launch without submitting sitemap / verifying property; SEO run blind | Verify property, submit single sitemap, watch "Crawled-not-indexed" + "Duplicate without canonical" + CWV reports |
| Google Maps embed | Placeholder `pb=` / unverified Place ID (live today per CONCERNS.md) | Use the verified business Place ID matching GBP/address |
| GA4 / Vercel Analytics | Add analytics, ignore AVG (analytics cookies/consent) | Consent-aware analytics; cover in privacy policy; align with the form consent approach |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Three concurrent RAF loops (aurora + 2 particle systems) + Framer hydration | Laggy taps (high INP), hot device, jank | Gate effects on mobile/reduced-motion; shared scheduler; CSS fallback | Mid-range Android — i.e. typical local search traffic |
| WebGL context rebuild on every parent re-render (13-prop dep array) | Hero stutters on state change/navigation | Memoize `SoftAurora`, stabilize props (CONCERNS.md) | Any home re-render; worse on slow GPUs |
| `getBoundingClientRect()` per animation frame | Forced reflow each frame | Cache dims, update on resize only | Always under load; compounds with 2 loops |
| Unoptimized full-res images ×20+ pages | Slow LCP, heavy pages on mobile data | Build-time WebP/AVIF + `sizes`; never lazy-load LCP | Scales linearly with page/photo count |
| Lazy-loading or WebGL-blocking the hero LCP element | Poor mobile LCP (only ~62% of sites pass) | Render LCP independent of WebGL; `fetchpriority="high"` | Mid-range mobile, slower networks |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| `NEXT_PUBLIC_` webhook in client JS | Anyone POSTs arbitrary leads → CRM spam + bogus owner notifications | Server route holds webhook as server-only secret; validate + rate-limit |
| No input validation (HTML5 only) | Malformed/malicious payloads reach CRM/workflow | Zod schema before send (CONCERNS.md) |
| No honeypot/timing if staying static | Bots flood the public webhook (GHL captcha ineffective) | Honeypot field + submission-timing check |
| Fake/self-serving `aggregateRating` JSON-LD | Structured-data manual action | Only mark up genuinely-shown, policy-compliant reviews; else omit |
| No consent / pre-checked box (AVG) | Non-compliance with Dutch AVG; AP exposure | Privacy link at form; unchecked, specific consent or correct grondslag; name GHL as processor |
| Silent form failure (no try/catch) | Leads lost invisibly | try/catch + visible error + fallback-to-phone |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Form hangs in "sending" on failure | User assumes sent; lead lost; frustration | Visible error + "bel/WhatsApp ons direct" fallback |
| Laggy hero/CTA on mobile (INP) | Feels broken/cheap; bounce before contact | Mobile-gated effects; measured INP |
| Placeholder Maps pin (live today) | Wrong location → lost trust for a local installer | Verified Place ID matching GBP |
| Aging review timestamps ("2 maanden geleden" forever, per CONCERNS.md) | Stale/dishonest as they drift | Absolute dates, or pull live, or drop the relative string |
| Generic AI Dutch copy | Reads like every competitor; no reason to choose TPS | Real experience, local specifics, owner voice/credentials |
| WhatsApp affordance with no consent/disclosure context | Surprise data handoff | Disclose channel; cover in privacy policy |

## "Looks Done But Isn't" Checklist

- [ ] **Service-page template:** renders 20+ pages — but each must clear the **unique-substance bar** (diff two pages; >70% identical body = thin). Verify a brand page says brand-specific things.
- [ ] **Keyword map:** pages exist — but verify **one distinct primary keyword + intent per URL**, no pillar↔sub overlap.
- [ ] **NAP:** copy looks consistent — grep for any number/radius/address literal outside `lib/constants.ts`; confirm site == GBP == JSON-LD == Maps pin. Confirm the **50/100 km bug is fixed at the source**.
- [ ] **JSON-LD:** present — but passes Rich Results Test, sourced from constants, no self-serving `aggregateRating`, matches GBP.
- [ ] **Sitemap/robots:** files exist — but the **export build succeeds** (`dynamic="force-static"` or `public/`), single sitemap, referenced in robots.txt, **submitted in Search Console**.
- [ ] **Canonical/slugs:** pages render — but each has a correct absolute self-canonical; `metadataBase` set (no `localhost`); `trailingSlash` + canonicals + Vercel redirects agree; `/x` vs `/x/` resolves to one.
- [ ] **Lead notification:** form submits — but a **real test fires the owner's WhatsApp/email in seconds**, with monitoring for "no leads in N days."
- [ ] **Form robustness:** happy path works — but offline/throttled submit shows a **visible error + phone fallback**, not an infinite spinner; Zod validation + honeypot present.
- [ ] **AVG:** privacy page exists — but consent/privacy link is **at the form**, box unchecked, policy **names GoHighLevel** and the WhatsApp channel.
- [ ] **Mobile CWV:** looks great on desktop — but **Lighthouse mobile + field CWV pass** (INP <200 ms, LCP good) with effects gated.
- [ ] **Images:** photos display — but optimized (WebP/AVIF + `sizes`), hero not lazy-loaded, `fetchpriority="high"`.
- [ ] **All CTAs/links:** `tel:` / `mailto:` / `wa.me` verified working across **every** new page (PROJECT.md requirement).

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Doorway/thin penalty (Dec 2025 update) | HIGH | Consolidate thin pages into strong pillars, add real substance, 301 weak URLs, rebuild engagement signals, reconsideration request via GSC — months |
| Keyword cannibalization | MEDIUM | Pick the canonical URL per term, merge/re-optimize others to distinct intents, fix internal-link hierarchy, canonicalize |
| NAP inconsistency / wrong GBP | MEDIUM | Reconcile to one source, fix site+JSON-LD+GBP+citations, accept re-confidence lag in local pack |
| AI/E-E-A-T quality hit | MEDIUM-HIGH | Human-rewrite for experience/specifics, add author/credentials/real reviews, throttle, wait for re-crawl |
| Webhook spam / lost leads | LOW-MEDIUM | Add server route + validation/rate-limit (or honeypot), fix error handling, verify + monitor notification; purge CRM spam |
| AVG non-compliance | LOW | Add consent + privacy link at form, update policy to name processor/channel, document grondslag |
| Mobile CWV failure | MEDIUM | Gate/replace effects on mobile, optimize images, protect LCP, re-measure field data |
| Canonical/sitemap export bugs | LOW | Set metadataBase, fix `trailingSlash`+redirects+canonicals, `dynamic="force-static"`, resubmit sitemap |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Doorway/thin templated pages | IA / service-template (design uniqueness bar) → Content (enforce) | Diff pages <70% similar; GSC has no growing "Crawled-not-indexed" on services |
| 2. Pillar↔sub cannibalization | IA / service-template (keyword map) → SEO/Content | Map has unique primary per URL; no two own-URLs trade for one query |
| 3. NAP inconsistency / GBP | QA (fix 50/100 km at source, extend constants) → Local-SEO (site↔GBP↔citations, rebrand/domain call) | grep finds no literals; site==GBP==JSON-LD==pin |
| 4. AI E-E-A-T on YMYL | Content (E-E-A-T + fact-check checklist, review gate) | Every page has non-templatable substance; technical facts sourced |
| 5. JSON-LD invalid / GBP mismatch | SEO-technical (schema from constants) → QA | Rich Results Test clean; no self-serving rating; matches GBP |
| 6. Canonical/slash + sitemap build | SEO-technical (metadataBase, canonical, sitemap, trailingSlash together) → QA | Export build passes; one canonical/page; `/x`==`/x/`; GSC no "Duplicate without canonical" |
| 7. Webhook spam / lost leads | Lead-capture (workflow + e2e test + monitor) + QA (server route/honeypot, validation, error handling — **make static-vs-hybrid call**) | Test submit notifies owner in seconds; webhook not in client; spam blocked |
| 8. AVG consent/privacy | Lead-capture (consent UX) + Content/legal (policy names processor) | Privacy link at form; box unchecked; policy names GHL + WhatsApp |
| 9. Mobile CWV (WebGL/canvas) | Performance/QA (budget + effect gating) ← IA bakes capped hero | Lighthouse mobile + field CWV pass (INP<200ms, LCP good) |
| 10. Unoptimized images ×20+ | Performance/QA (build-time pipeline) ← IA template enforces | WebP/AVIF + `sizes`; hero not lazy; Lighthouse image audits pass |

## Sources

**Local SEO / doorway / cannibalization / E-E-A-T (MEDIUM-HIGH — recent third-party, cross-confirmed; Google docs HIGH):**
- Google — [Creating Helpful, Reliable, People-First Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) (HIGH)
- Orbit Media — [Avoid Google's Doorway Page Spam Penalty](https://www.orbitmedia.com/blog/doorway-pages-seo/)
- Manning Search Marketing — [Location Pages vs. Doorway Pages: Best Practices and Pitfalls](https://www.manningmarketing.com/articles/location-pages-vs-doorway-pages-seo-best-practices-and-pitfalls/)
- RicketyRoo — [Should I Create a Landing Page for Every Location I Service?](https://ricketyroo.com/blog/landing-page-for-every-location/)
- Yoast — [Keyword/Content Cannibalization: identify and fix](https://yoast.com/keyword-cannibalization/)
- Backlinko — [Keyword Cannibalization](https://backlinko.com/keyword-cannibalization)
- ALM Corp — [Google December 2025 Core Update guide](https://almcorp.com/blog/google-december-2025-core-update-complete-guide/) (recent; the "templated location pages" + "87% AI" findings)
- Marketing Code — [Google Core Update: What Contractors Must Do (GBP/AI, 2026)](https://www.marketingcode.com/google-march-core-update-gbp-ai-search-contractors-2026/) (home-services YMYL framing)
- SEO Sherpa — [Does Google Penalize AI Content?](https://seosherpa.com/does-google-penalize-ai-content/)

**NAP / Google Business Profile (MEDIUM — industry studies):**
- BrightLocal — [Google's Local Algorithm and Ranking Factors](https://www.brightlocal.com/learn/google-local-algorithm-and-ranking-factors/)
- BrightLocal — [What is NAP in Local SEO?](https://www.brightlocal.com/learn/what-is-nap/)
- amigostudios — [NAP Consistency for Local SEO (Complete Guide 2026)](https://www.amigostudios.co/blog/nap-consistency-local-seo) (the ~40% local-pack figure)
- Search Engine Journal — [Why Dynamic GBP Profiles Are the New Local Ranking Factor](https://www.searchenginejournal.com/why-dynamic-profiles-are-the-new-local-ranking-factor/568200/)

**Next.js 16 static export / sitemap / canonical (HIGH — official docs + maintained issues):**
- Next.js — [sitemap.xml file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) (v16.2.7; cached-by-default behaviour)
- Next.js — [Static Exports guide](https://nextjs.org/docs/pages/guides/static-exports)
- Next.js — [generateMetadata (metadataBase, alternates/canonical)](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- vercel/next.js — [Discussion #59019: sitemap with `output:"export"`](https://github.com/vercel/next.js/discussions/59019) (`dynamic="force-static"` requirement)
- vercel/next.js — [Discussion #53950: trailing slash on canonical URLs](https://github.com/vercel/next.js/discussions/53950)
- CodeAva — [Common Canonicalisation Mistakes in Next.js Sites](https://www.codeava.com/blog/common-canonical-mistakes-nextjs-cms)

**GoHighLevel webhook / form spam (MEDIUM — HighLevel's own community + docs):**
- HighLevel Ideas — [Spammers accessing forms](https://ideas.gohighlevel.com/forms/p/spammers-accessing-forms) (captcha ineffective)
- HighLevel Blog — [Bot Protection & Faster Forms](https://blog.gohighlevel.com/bot-protection-faster-forms-live/)
- HighLevel — [Webhook Integration Guide](https://marketplace.gohighlevel.com/docs/webhook/WebhookIntegrationGuide/index.html)
- n8n — [Filter spam from webhook form submissions (honeypot + timing)](https://n8n.io/workflows/14028-filter-spam-from-webhook-form-submissions-using-honeypot-and-timing-checks/)

**AVG / GDPR (Netherlands) (HIGH — AP + NL legal sources):**
- Autoriteit Persoonsgegevens — [Right to information](https://www.autoriteitpersoonsgegevens.nl/en/themes/basic-gdpr/privacy-rights-under-the-gdpr/right-to-information)
- GDPRWise — [Privacyverklaring opstellen — wat moet erin staan](https://gdprwise.eu/nl/kennisbank/verplichtingen/privacyverklaring-opstellen/?lang=nl) and [GDPR rechtsgronden](https://gdprwise.eu/nl/kennisbank/verplichtingen/gdpr-rechtsgronden-uitgelegd/)
- Ondernemersplein (overheid.nl) — [AVG: dit moeten ondernemers doen](https://ondernemersplein.overheid.nl/bedrijfsvoering/juridische-zaken/de-avg-dit-moeten-ondernemers-doen/)

**Core Web Vitals / INP / LCP (MEDIUM-HIGH — 2025/26 guides citing Web Almanac):**
- digitalapplied — [Core Web Vitals 2026: INP, LCP & CLS](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide) (INP most-failed; 50 ms task rule)
- corewebvitals.io — [Core Web Vitals explained](https://www.corewebvitals.io/core-web-vitals)
- Ableneo — [How to Improve Core Web Vitals (LCP, INP, CLS)](https://www.ableneo.com/insight/how-to-improve-core-web-vitals-lcp-inp-cls-in-modern-web-apps/)

**Project-internal (HIGH — primary):**
- `.planning/codebase/CONCERNS.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/PROJECT.md`

---
*Pitfalls research for: NL local climate-tech lead-gen site (Next.js static export + GHL + programmatic local SEO)*
*Researched: 2026-06-02*
