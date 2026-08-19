# Stack Research

**Domain:** Rebrand/domain migration + indexation unlock + light content layer on an existing Next.js 16 local-SEO site
**Researched:** 2026-08-20
**Confidence:** HIGH for the redirect + MDX mechanics (verified against Next.js/Vercel docs and Aug-2026 sources); HIGH for Change of Address (Google revised the guidance 2026-06-17)

> Written inline by the orchestrator after the Stack research subagent died twice on this OneDrive
> mount. Claims below are either verified by live probe, read from the repo, or sourced — sources listed.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why |
|---|---|---|---|
| Next.js | 16.2.1 (in repo) | Framework | **Keep.** No version change needed for any v1.1 capability. |
| `next.config.ts` `redirects()` | built-in | Per-URL legacy → current 301/308 map | The only mechanism giving **per-URL** granularity while both domains sit on one project |
| `@next/mdx` | latest 3.x | Kennisbank article rendering | Official Next.js team package; App Router native |

**The single most important stack decision — how the legacy domain redirects.** Two mechanisms exist
and they are not interchangeable:

| Mechanism | Granularity | Verdict |
|---|---|---|
| Vercel dashboard → Project Settings → Domains → **"Redirect to"** dropdown | **Whole domain**, path preserved | ❌ Rejected. `tpsventilatie.nl/wtw-unit-vervangen/` would become `www.tpsklimaattechniek.nl/wtw-unit-vervangen/` — a **404**, since the new site's URL is `/diensten/wtw/vervangen`. Path-preserving is exactly wrong for a site whose IA changed completely. |
| `redirects()` in `next.config.ts` with `has: [{ type: "host" }]` | **Per-URL** | ✅ Chosen. Maps each of the 9 legacy URLs to its real equivalent, host-scoped so the primary domain is untouched. |

Both legacy hostnames must be **added to the Vercel project** (not redirected at the dashboard level)
so requests reach the app and the `has: host` rules can run.

**301 vs 308 — resolved, and it does not matter for SEO.** Next.js `permanent: true` emits **308**, not
301 (307/308 preserve the request method; 301/302 historically let browsers rewrite POST→GET). Google's
John Mueller has stated 308 is treated the same as 301 by Google. So `permanent: true` is correct and
no `statusCode: 301` override is needed. Worth writing into the plan explicitly, because a reviewer
seeing 308 in a "301 redirect map" will otherwise flag it as a bug.

### Supporting Libraries

| Library | Version | Purpose | Notes |
|---|---|---|---|
| `@next/mdx` | ^3 | MDX → App Router pages | Official; wraps config via `createMDX()` |
| `@mdx-js/loader` | ^3 | Webpack/Turbopack loader | Required peer of `@next/mdx` |
| `@mdx-js/react` | ^3 | MDX component context | Required peer |
| `@types/mdx` | ^2 | Types | Dev dependency |
| `zod` | already in repo | Article frontmatter validation | **Reuse.** Articles get a Zod schema mirroring `pageSchema` so the same editorial rigour applies |

**MDX integration constraint that matters:** `createMDX()` mutates `pageExtensions` to include `md`/`mdx`.
The repo's `next.config.ts` currently also needs to grow the `redirects()` function — both changes land in
the same file, so they are one coordinated edit, not two independent ones.

### Development Tools

| Tool | Purpose | Notes |
|---|---|---|
| `tsx` | already in repo | Runs the `scripts/assert-*.ts` gates. **Fast and reliable on this OneDrive mount** — unlike `next build` |
| `scripts/assert-redirects.ts` | NEW gate | Asserts: every legacy source appears exactly once; every destination is built from `CANONICAL_ORIGIN`; no destination is itself a redirect source (chain guard) |
| `scripts/assert-seo.ts` | REWRITE | See ARCHITECTURE.md — must move from snapshot to relational assertions **before** the status flip |

## Installation

```bash
# Kennisbank only — nothing else in v1.1 needs a new dependency
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install -D @types/mdx
```

The redirect work, the status flip, the GSC work, GBP, and citations require **zero new packages**.

## Alternatives Considered

| Option | Verdict | Reason |
|---|---|---|
| `.htaccess` on the cyberfolks box | ❌ Rejected (owner already chose in-repo) | Rules live outside version control on a host nobody watches; untestable in CI |
| Vercel dashboard domain-level "Redirect to" | ❌ Rejected | Path-preserving → 404s on every changed URL. See table above |
| Routing Middleware for redirects | ❌ Rejected | Invokes a function per request for a purely static 9-entry map; `redirects()` is handled at the edge, cheaper and simpler |
| `vercel.ts` / `vercel.json` routing | ⚠️ Viable but not chosen | Vercel now recommends `vercel.ts` over `vercel.json`; but this project has **no** `vercel.*` config today, and adding one to express redirects splits routing truth across two files. Keep it in `next.config.ts` alongside the app it serves |
| `next-mdx-remote` | ❌ Rejected | Designed for runtime/CMS-sourced MDX; our articles are in-repo at build time |
| Content Collections / Contentlayer | ❌ Rejected | Real typing benefits, but heavy for 3–5 articles and adds a build step to a repo whose builds are already fragile on this mount |
| A headless CMS for articles | ❌ Rejected | Explicitly out of scope in PROJECT.md |

## What NOT to Use

- **Do NOT add a `vercel.json`** just for redirects — see above.
- **Do NOT use the dashboard "Redirect to"** for the legacy domain — silently 404s every service URL.
- **Do NOT hand-type redirect destinations.** Build from `CANONICAL_ORIGIN`; the new apex 308s to `www`,
  so a hand-typed apex destination silently adds a hop on every migrated URL.
- **Do NOT install a test framework** for this milestone — `node:assert` + `tsx` remains the pattern
  (consistent with `scripts/assert-*.ts` and with test infra being out of scope).
- **Do NOT run `next build` locally** on this mount to validate — memory records it deadlocking at 0% CPU.
  Vercel preview is the build gate.

## Google Search Console — the part with real requirements

Google **revised its site-move guidance on 2026-06-17** and tightened what a domain migration needs:

1. **Submit a Change of Address request for every verified variant of the old domain** — both `www` and
   non-`www`, plus any subdomains, even unused ones.
2. The Change of Address tool must be run from a **domain-level property** (no path segments).
3. **Maintain redirects for at least 180 days** — longer while Google still sends traffic to them.

Consequences for this milestone, and they are sequencing constraints, not footnotes:

- We must verify **`tpsventilatie.nl` and `www.tpsventilatie.nl`** in GSC — ideally a Domain property
  (DNS TXT) which covers all variants at once.
- ⚠️ **Verify the old domain in GSC BEFORE the DNS repoint.** Today we have hosting admin, so an HTML-file
  or meta-tag verification is trivial to place on the WordPress site. After the apex repoints to Vercel,
  `tpsventilatie.nl/*` is served by the Next app and a file-based verification would have to be served
  from our own app — awkward and easy to get wrong. A DNS TXT verification is better still, but requires
  access to the **opeiron/cyberfolks DNS zone**, which is a separate credential from hosting admin and is
  **not yet confirmed to be in hand.** Treat that as an explicit open question.
- The 180-day floor confirms the old domain and its redirects stay live well beyond this milestone —
  which aligns with the owner's decision to keep the hosting for mail anyway.

Verification method options, in preference order:
1. **DNS TXT** (Domain property, covers all variants) — needs DNS access `[OPEN QUESTION]`
2. **HTML file upload** to the WordPress root — we have hosting admin ✅, but must be done pre-repoint
3. **Meta tag** — requires editing the WP theme; also pre-repoint

## Version Compatibility

| Component | Constraint | Status |
|---|---|---|
| Next.js 16.2.1 + `@next/mdx` ^3 | `createMDX()` + `pageExtensions` | Compatible; official package |
| Next.js `redirects()` + `has: host` | Supported in App Router | Supported |
| `permanent: true` | Emits **308** | Google treats as 301 |
| Turbopack (Next 16 default) + MDX loader | `@mdx-js/loader` | ⚠️ `[VERIFY at implementation]` — confirm on the first Vercel preview build; this is the one integration most likely to surprise |
| Zod (in repo) | Article frontmatter schema | Reuse, no new dep |

## Sources

- [next.config.js: redirects | Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects)
- [SEO: What are HTTP Status Codes? | Next.js](https://nextjs.org/learn/seo/status-codes)
- [Guides: Redirecting | Next.js](https://nextjs.org/docs/app/guides/redirecting)
- [Guides: MDX | Next.js](https://nextjs.org/docs/app/guides/mdx)
- [Redirects | Vercel](https://vercel.com/docs/routing/redirects)
- [Deploying & Redirecting Domains | Vercel](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)
- [Change of Address tool — Search Console Help](https://support.google.com/webmasters/answer/9370220?hl=en)
- [Google Tightens Requirements For Domain Migrations — Search Engine Journal](https://www.searchenginejournal.com/google-tightens-requirements-for-domain-migrations/579781/)
- [For site moves, specify all domain variants — Search Engine Land](https://searchengineland.com/for-site-moves-specify-all-domain-variants-with-googles-change-of-address-tool-480552)
- Repo reads: `next.config.ts`, `package.json`, `scripts/`, `lib/seo/policy.ts`

---
*Stack research for: rebrand/domain migration + indexation unlock*
*Researched: 2026-08-20 (inline — subagents unavailable on this mount)*
