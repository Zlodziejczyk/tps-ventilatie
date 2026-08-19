# Research Summary — Milestone v1.1

**Project:** TPS klimaattechniek — Rebrand Migration & SEO Ranking Push
**Researched:** 2026-08-19 / 2026-08-20
**Confidence:** HIGH

## Executive Summary

The milestone's premise changed during recon. The plan arrived as "finish the rebrand and improve SEO";
research established that **the site's entire SEO surface has never been visible to Google**. 21 of 27
pages serve `noindex, follow` and are absent from the sitemap, because `lib/seo/policy.ts` gates
hub/pillar/service pages on `status === "published"` and the registry holds **21 × `review`, 7 × `draft`,
0 × `published`**. The Phase-4 editorial flip was never executed, even though owner sign-off cleared
2026-08-05.

The good news is how cheap the fix is. The Zod content gate applies its anti-thin-content rules to
`review` **and** `published` alike, so all 21 pages already clear the quality bar — flipping them is a
data edit that builds green. Only the `/diensten` hub needs actual authoring (its content is still an
empty `draftShell`, and publishing it as-is would fail the gate).

Three findings reshape the sequencing:

1. **The build gate enforces the bug.** `scripts/assert-seo.ts` hardcodes `sitemapEntries().length === 5`.
   Commit `82d897b` shows it being *bumped to match reality* when it failed. It must be rewritten to a
   relational invariant **before** the flip, or the flip cannot build.
2. **Redirects must come after the flip.** Pointing legacy 301s at noindexed pages is the single worst
   outcome available in this milestone, and it's the intuitive mistake because redirects feel urgent.
3. **The GBP name change goes last, not first.** Editing name + categories + URL together reads to Google
   as a listing takeover. The outside world must agree on the new name before the profile changes.

## Key Findings

### Recommended Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js `redirects()` + `has: host` | built-in | Per-URL legacy map — the only option with per-URL granularity |
| `@next/mdx` + loader/react/types | ^3 | Kennisbank |
| `zod` | in repo | Reuse for article frontmatter |
| `tsx` + `node:assert` | in repo | Build gates — fast and reliable on this mount, unlike `next build` |

Only the kennisbank needs new packages. Redirects, the flip, GSC, GBP and citations need none.

**Rejected:** Vercel's dashboard "Redirect to" (path-preserving → 404s every changed URL), `.htaccess`
(outside version control), Routing Middleware (overkill for a static 9-entry map), `next-mdx-remote`
and Contentlayer (wrong shape / too heavy for 3–5 articles).

**Resolved:** `permanent: true` emits **308**, not 301. Google treats them identically. Worth stating in
the plan so a reviewer doesn't flag it as a bug.

### Expected Features

**Table stakes:** correct GBP primary category (the largest Maps lever), ≤4 secondaries, exact brand name,
new website URL, hours, service area, Services list, NAP consistency, sitemap submitted, review recency.

**Differentiators:** 21 indexable service pages with real depth (most local installers run 5–10 thin ones)
— already built, just switched off; the `/projecten` showcase with 21 real photos; verified Daikin/Mitsubishi
dealer status; manufacturer dealer-locator citations most competitors never claim.

**Anti-features:** per-town pages (already out of scope, correctly), keyword-stuffed GBP names, EXIF
geotagging (Google strips it), bulk directory blasts, ISDE claims for airco (factually wrong, build-gated),
a second GBP listing for the new name.

**The three-names problem:** `TPS klimaattechniek` (brand), `TPS services` (KvK legal entity, correct in
JSON-LD `legalName`), `TPS Ventilatie` (the cleanup target). A naive find-and-replace breaks the legal
entity. And `SITE.email` is deliberately still `info@tpsventilatie.nl` — audits will keep flagging it;
that's accepted, not a defect.

### Architecture Approach

`isIndexable()` is already correct and needs no change — indexability is **data, not code**. The work is:

- Flip 21 nodes; author + publish the hub; normalise the 6 statics' cosmetic `draft` status.
- Rewrite `assert-seo.ts` from snapshot to relational (`sitemap membership ⇔ isIndexable(node)` + a floor).
- New `lib/seo/redirects.ts` — a typed 9-entry map consumed by `next.config.ts`, assertable in CI.
- Kennisbank joins the sitemap **through** `policy.ts`, never via a second list in `app/sitemap.ts` —
  that shortcut is exactly the drift class that caused the current bug.

### Critical Pitfalls

| # | Pitfall | Severity |
|---|---|---|
| 1 | 301s pointed at still-noindexed pages | 🔴 hard gate |
| 2 | GBP name + categories + URL edited in one session → suspension risk to 34 reviews | 🔴 hard gate |
| 3 | Apex repoint kills webmail **and** `/wp-admin` (both on the apex path); SPF `a` breaks | 🔴 hard gate |
| 4 | Redirect chains — three hops by default | 🟠 high |
| 5 | Retiring the old domain early — Google requires ≥180 days + CoA for every variant | 🟠 high |
| 6 | Bulk un-noindexing — lower risk than it looks; pages are already crawled | 🟡 watch |
| 7 | Repo/Vercel rename breaks preview URLs and Git integration | 🟡 do last |
| 8 | The build gate enforces the bug | 🟠 blocks the flip |

## Implications for Roadmap

### Phase A — Indexation Unlock
Rewrite `assert-seo.ts` relationally → flip 21 `review` → `published` → author and publish the `/diensten`
hub → normalise statics. **Outcome: sitemap 5 → 27 URLs, zero `noindex` on service pages.**

### Phase B — Measurement Foundation
Verify **all variants of both domains** in GSC (old domain **before** the repoint), submit the sitemap,
request indexing for hub + 4 pillars, capture the ranking/coverage baseline.

### Phase C — Reversible Old-Brand Migration
Pre-flight: WP backup, DNS zone snapshot, SPF fix, alternate webmail + `/wp-admin` routes verified while
old DNS is live. Then the typed 9-entry redirect map + `assert-redirects.ts`, attach **both** legacy
hostnames, repoint, submit Change of Address for every variant.

### Phase D — Local Presence
GBP low-risk edits first (URL, hours, Services, photos, service area) → NAP master profile → Tier 1/2
citation cleanup → **then** the GBP name change, alone.

### Phase E — On-Page Depth & Kennisbank
Internal-linking architecture, title/meta rewrite, schema enrichment, MDX engine + 3–5 articles.

### Phase F — Brand Tail
IG/FB `sameAs` (owner-blocked), repo + Vercel rename — last, after everything is verified stable.

### Phase Ordering Rationale

A gates everything: redirects, GSC, internal linking and kennisbank links all need live, indexable targets.
B precedes C because the old domain must be GSC-verified while it still resolves to WordPress. C precedes
the name change in D because Google should see corroborating evidence before the profile name moves.
F is last because it is cosmetic with real collateral risk.

### Research Flags

- ⚠️ **DNS access to the legacy zone (opeiron/cyberfolks) is unconfirmed.** We hold *hosting* admin; the
  DNS zone is a separate credential. It's required for the apex repoint and preferred for GSC domain-property
  verification. **Resolve before planning Phase C.**
- ⚠️ `SITE.serviceAreas` is still marked `owner-review-pending` in code but feeds GBP service area and
  JSON-LD `areaServed`. Owner curation needed.
- ⚠️ IG/FB URLs still owner-blocked.
- `[VERIFY]` Turbopack + `@mdx-js/loader` interaction — confirm on the first Vercel preview.
- `[VERIFY IN GBP UI]` exact Dutch category label wording.

## Confidence Assessment

| Area | Confidence | Basis |
|---|---|---|
| Indexation diagnosis | **HIGH** | Live probes + `tsx` enumeration of all 28 nodes + source reads |
| Redirect map (9 URLs) | **HIGH** | All 10 sources and 11 targets verified 200 |
| DNS / mail blast radius | **HIGH** | Direct `dig`/`curl`, including TLS SAN and apex-path checks |
| Redirect mechanism + 308 | **HIGH** | Next.js + Vercel docs |
| GSC Change of Address rules | **HIGH** | Google guidance revised 2026-06-17, multiple sources |
| GBP rename risk | **MEDIUM-HIGH** | Consistent practitioner sources; Google doesn't publish thresholds |
| Bulk indexation impact | **MEDIUM** | Community consensus; flagged as judgement, not fact |
| Dutch citation landscape | **MEDIUM** | NL sources agree on the core set; weighting is practitioner opinion |

### Gaps to Address

1. Legacy DNS zone access — **blocks Phase C**
2. Owner curation of `serviceAreas`
3. IG/FB URLs
4. Whether a legacy/duplicate GBP listing exists under the old name

## Sources

### Primary (HIGH confidence)
- Live probes 2026-08-19/20 — `dig`, `curl`, WP REST inventory, `tsx` node enumeration
- Repo reads — `lib/seo/policy.ts`, `lib/services/types.ts`/`registry.ts`, `app/sitemap.ts`, `app/robots.ts`,
  `next.config.ts`, `scripts/assert-seo.ts`, `lib/constants.ts`; git `82d897b`
- [Next.js redirects](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects) ·
  [Next.js MDX](https://nextjs.org/docs/app/guides/mdx) · [Vercel Redirects](https://vercel.com/docs/routing/redirects)
- [GSC Change of Address](https://support.google.com/webmasters/answer/9370220?hl=en)

### Secondary (MEDIUM confidence)
- [SEJ — Google Tightens Domain Migration Requirements](https://www.searchenginejournal.com/google-tightens-requirements-for-domain-migrations/579781/)
- [Search Engine Land — specify all domain variants](https://searchengineland.com/for-site-moves-specify-all-domain-variants-with-googles-change-of-address-tool-480552)
- [Optuno — change business name without suspension](https://www.optuno.com/blog/how-to-change-your-business-name-on-google-without-getting-suspended) ·
  [SearchScope](https://searchscope.com.au/google-business-profile/suspension/how-business-name-changes-can-trigger-google-profile-suspensions/) ·
  [Birdeye](https://birdeye.com/blog/google-my-business-name-change/)
- [Hiveminds Local SEO 2026](https://hiveminds.nl/seo/local-seo/local-seo-2026-complete-gids) ·
  [OnlineLabs](https://www.onlinelabs.nl/blog/lokale-seo-voor-bedrijven-10-essentiele-strategieen)

### Method note
All four dimensions were written **inline by the orchestrator**. Six research-subagent attempts failed on
this OneDrive mount (API stream errors and a 600s stall); the last was stopped after 43 minutes without
clearing its file reads. This is consistent with the recorded constraint that heavy subagents starve here.

---
*Research synthesis for milestone v1.1*
*Synthesized: 2026-08-20*
