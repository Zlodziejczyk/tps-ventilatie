# Architecture Research

**Domain:** Multi-service local-SEO marketing site — rebrand/domain migration + indexation unlock
**Researched:** 2026-08-19
**Confidence:** HIGH (grounded in direct reads of the live codebase + verified live DNS/HTTP probes)

> Written inline by the orchestrator after three consecutive research subagents died on this
> OneDrive mount. Every claim below is verified against the actual files or a live probe —
> nothing here is recalled. External-doc claims are marked `[VERIFY]`.

## Standard Architecture

### System Overview — as it exists today

```
┌──────────────────────────────────────────────────────────────────────┐
│  ROUTING / RENDER  (app/)                                            │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌───────────────┐ ┌────────────────────────┐          │
│  │ page.tsx │ │ diensten/     │ │ diensten/[pillar]/     │          │
│  │ (statics)│ │ [pillar]/     │ │   [service]/page.tsx   │          │
│  └────┬─────┘ └──────┬────────┘ └───────────┬────────────┘          │
│       │              │                      │                        │
│  ┌────┴──────────────┴──────────────────────┴────┐  ┌─────────────┐  │
│  │ generateMetadata() → robots directive          │  │ api/lead    │  │
│  └────────────────────┬───────────────────────────┘  │ (server)    │  │
│  ┌──────────────┐ ┌───┴──────────┐                   └─────────────┘  │
│  │ sitemap.ts   │ │ robots.ts    │                                    │
│  └──────┬───────┘ └───┬──────────┘                                    │
├─────────┴─────────────┴───────────────────────────────────────────────┤
│  POLICY  (lib/seo/)                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ policy.ts — isIndexable() · absoluteUrl() · sitemapEntries()     │ │
│  │   THE single gate. sitemap membership CANNOT drift from robots.  │ │
│  └──────────────────────────┬──────────────────────────────────────┘ │
│  ┌────────────────────┐     │                                         │
│  │ jsonld.ts          │     │                                         │
│  └────────────────────┘     │                                         │
├─────────────────────────────┴─────────────────────────────────────────┤
│  DATA  (lib/services/, lib/constants.ts)                              │
│  ┌──────────────┐ ┌──────────────────┐ ┌──────────────────────────┐  │
│  │ types.ts     │ │ registry.ts      │ │ constants.ts             │  │
│  │ PageNode +   │ │ PAGES · urlFor() │ │ SITE (NAP)               │  │
│  │ Zod schemas  │ │ lookups          │ │ CANONICAL_ORIGIN         │  │
│  │ canonicalPath│ │                  │ │                          │  │
│  └──────┬───────┘ └────────┬─────────┘ └──────────────────────────┘  │
│         │  airconditioning.ts · warmtepompen.ts · wtw.ts ·            │
│         │  mechanische-ventilatie.ts   (node data files)              │
├─────────┴─────────────────────────────────────────────────────────────┤
│  BUILD GATES  (scripts/, npm prebuild)                                │
│  validate-taxonomy · assert-registry · assert-seo · assert-site-shape │
│  assert-no-forbidden-claims · assert-gate-blocks                      │
└───────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `lib/services/types.ts` | The `PageNode` discriminated union, all Zod schemas, and `canonicalPath()` — the single URL derivation | Zod 4; content rules status-gated |
| `lib/services/registry.ts` | Assembles `PAGES`; sole `urlFor()`; lookups; `validateTaxonomy()` | Justified aggregation module (D-05), not a barrel |
| `lib/seo/policy.ts` | **The single indexability gate.** `isIndexable()`, `absoluteUrl()`, `sitemapEntries()` | Pure functions, server-safe |
| `app/sitemap.ts` | Emits sitemap from `sitemapEntries()` — no hardcoded route list | `force-static` |
| `app/robots.ts` | Open crawl policy + AI-crawler allows + `host` + sitemap pointer | `force-static` |
| `lib/constants.ts` | `SITE` (NAP) + `CANONICAL_ORIGIN` — sole business-data source | Module constants |
| `scripts/assert-*.ts` | Build-time invariant gates run via `tsx` | `node:assert/strict`, exit non-zero on drift |

## The Central Finding: indexability is data, not code

`isIndexable()` is already correct and needs **no change**:

```typescript
export function isIndexable(node: PageNode): boolean {
  if (node.type === "static") return node.pathSegment !== "privacy-beleid";
  return node.status === "published";
}
```

Measured reality of `PAGES` (28 nodes, enumerated live via `tsx`):

| Status | Count | Nodes | Indexable today? |
|---|---|---|---|
| `review` | 21 | 4 pillars + 17 sub-services | **No** — needs `published` |
| `draft` | 7 | 6 statics + the `/diensten` hub | statics **yes** (type exemption); hub **no** |

Two consequences that shape the whole milestone:

1. **The 21 `review` nodes are safe to flip.** `pageSchema.superRefine` applies `publishedContentSchema`
   to `review` **and** `published` alike — intro ≥120 words, ≥1 step, 3–6 FAQs, unique canonical URL,
   unique `primaryKeyword`. All 21 already satisfy the anti-thin-content bar today, or the build
   would already be failing. Flipping them is a pure data edit with a green gate.
2. **The `/diensten` hub is NOT safe to flip.** It is built by `draftShell(...)` with `intro: ""`,
   `steps: []`, `faqs: []`. Setting `status: "published"` makes the Zod gate apply the content
   rules and the **build will fail**. The hub needs real content authored first.

The 6 statics carrying `status: "draft"` while being indexable is a latent data-hygiene wart —
harmless today (the `type === "static"` branch never reads `status`) but actively misleading. Normalising
them is cheap and prevents a future reader "fixing" the wrong thing.

## The Guard Rail Is Pinned To The Broken State

`scripts/assert-seo.ts` does not merely fail to catch this regression — it **enforces** it:

```typescript
assert.deepEqual(indexableUrls,
  ["/", "/contact", "/over-ons", "/projecten", "/tarieven"], ...);
assert.equal(isIndexable(findBySlug("/diensten")!), false, "draft hub must be noindex");
assert.equal(entries.length, 5, ...);
```

Git history confirms the anti-pattern: commit `82d897b` is titled *"assert-seo expected 4 indexable
pages, site serves 5"* — the assertion was **patched to match reality** rather than reconsidered. It is
a snapshot test masquerading as an invariant, and it will hard-fail the moment we flip.

**It must be rewritten to a relational invariant** that is true before *and* after the flip:

```typescript
// Relational — survives any future publish, catches real drift.
for (const node of PAGES) {
  const inSitemap = sitemapUrls.has(absoluteUrl(urlFor(node)));
  assert.equal(inSitemap, isIndexable(node),
    `${urlFor(node)}: sitemap membership must equal isIndexable()`);
}
// Floor, not an exact list — catches silent mass-noindex without pinning a count.
assert.ok(sitemapEntries().length >= 27, `expected >= 27 indexable pages`);
assert.equal(isIndexable(findBySlug("/privacy-beleid")!), false);
```

This is the single highest-value structural change in the milestone: it converts a class of silent,
months-long regression into a build failure.

## Recommended Structure — new + modified

```
lib/
├── services/            # MODIFIED — status flips only, no shape change
│   ├── airconditioning.ts        review → published (×5)
│   ├── warmtepompen.ts           review → published (×5)
│   ├── wtw.ts                    review → published (×6)
│   ├── mechanische-ventilatie.ts review → published (×5)
│   └── registry.ts               hub: content authored, then → published
├── seo/
│   ├── policy.ts        # UNCHANGED — already correct
│   └── redirects.ts     # NEW — typed legacy→current URL map, single source
└── content/             # NEW — kennisbank layer
    ├── types.ts                  Article + Zod schema, reusing PageStatus
    └── articles/*.mdx            3–5 evergreen articles

app/
├── kennisbank/
│   ├── page.tsx         # NEW — index
│   └── [slug]/page.tsx  # NEW — article route
└── sitemap.ts           # MODIFIED — articles join via policy, not a parallel list

scripts/
├── assert-seo.ts        # REWRITE — relational invariant (see above)
└── assert-redirects.ts  # NEW — no chains, no loops, every target 200
next.config.ts           # MODIFIED — host-conditional redirects from lib/seo/redirects.ts
```

### Structure Rationale

- **`lib/seo/redirects.ts` as a typed module, not inline config.** A 9-entry map inline in
  `next.config.ts` is untestable. As a typed export it can be asserted in CI (every target
  resolves to a live 200; no target is itself a redirect source) and diffed in review.
- **`lib/content/` mirrors `lib/services/`.** Articles get a `status` field reusing `PageStatus`
  so the *same* editorial gate governs them. Articles must join `sitemapEntries()` through
  `policy.ts` — never via a second list in `app/sitemap.ts`, which would recreate exactly the
  drift class `policy.ts` exists to prevent.

## Architectural Patterns

### Pattern 1: Single-source indexability (already established — extend, never bypass)

**What:** One predicate decides both sitemap membership and the per-page `robots` directive.
**Trade-off:** Every new page type must be taught to `policy.ts`. That friction is the point.
**Rule for v1.1:** kennisbank articles integrate by extending `isIndexable()` with an article
branch and joining the `PAGES`-equivalent iteration — *not* by appending to `app/sitemap.ts`.

### Pattern 2: Host-conditional redirects

**What:** One Vercel project serves two domains; the retiring host maps 9 legacy paths to current URLs.

```typescript
// next.config.ts — shape only; mechanism to be confirmed by STACK research [VERIFY]
async redirects() {
  return LEGACY_REDIRECTS.map(({ from, to }) => ({
    source: from,
    has: [{ type: "host", value: "(www\\.)?tpsventilatie\\.nl" }],
    destination: `${CANONICAL_ORIGIN}${to}`,
    permanent: true, // 308; see chain analysis below
  }));
}
```

**Trade-off:** couples the retiring domain's behaviour to the live app's deploy cycle — a bad
deploy breaks the redirects. Mitigated by `assert-redirects.ts` in the build gate.

### Pattern 3: Relational build assertions over snapshot assertions

**What:** Assert *relationships that must always hold*, not *values that happen to be true now*.
**Why it matters here:** the snapshot form of `assert-seo.ts` let a 22-page noindex survive a full
milestone and two "fix" commits.

## Data Flow

### Indexability (the flip)

```
lib/services/*.ts  status: "review" → "published"
        ↓
registry.ts  PAGES  ──────────────┬──────────────────────┐
        ↓                         ↓                      ↓
policy.ts isIndexable()    generateMetadata()      sitemapEntries()
        ↓                         ↓                      ↓
   (single truth)        <meta robots> per page      /sitemap.xml
                                  ↓                      ↓
                          noindex → indexable      5 URLs → 27 URLs
```

### Legacy traffic

```
GET https://tpsventilatie.nl/wtw-unit-vervangen/
        ↓  (apex A → Vercel)
Vercel edge → next.config redirects[] · host matches legacy domain
        ↓
301/308 → https://www.tpsklimaattechniek.nl/diensten/wtw/vervangen
        ↓
200 — MUST be a direct hit, never a further redirect
```

**Redirect-chain hazard — the load-bearing detail.** Two redirects already exist in the topology,
both **verified live 2026-08-19**:

- `https://www.tpsventilatie.nl/` → **301** → `https://tpsventilatie.nl/`  (legacy www→apex)
- `https://tpsklimaattechniek.nl/` → **308** → `https://www.tpsklimaattechniek.nl/`  (new apex→www)

So a naive map is doubly chained. An inbound link to `www.tpsventilatie.nl/wtw-unit-vervangen/`
would walk `legacy-www → legacy-apex → new-apex → new-www` — **three hops** — bleeding equity and
risking Google abandoning the chain. A map written only against the legacy apex still leaves two.
**Prevention — three rules, all mechanically checkable:**
1. Every `destination` is built from `CANONICAL_ORIGIN` (already the `www` host), never hand-typed.
2. **Both** legacy hostnames are attached to the Vercel project and **both** A records repoint, so the
   `has: host` matcher covers `tpsventilatie.nl` *and* `www.tpsventilatie.nl` — each going directly to
   the final target in ONE hop. Repointing only the apex leaves the legacy `www` 301 stranded on the
   old host and preserves the chain.
3. `assert-redirects.ts` fails the build unless every target returns a direct 200 (not a redirect).

### Proposed legacy → current URL map (9 entries)

All 10 sources verified HTTP 200 on the legacy site and all 11 targets verified HTTP 200 on the
new site, 2026-08-19.

| Legacy URL | Target | Confidence |
|---|---|---|
| `/` | `/` | certain |
| `/over-ons/` | `/over-ons` | certain |
| `/contact/` | `/contact` | certain |
| `/privacy-beleid/` | `/privacy-beleid` | certain |
| `/wtw-unit-vervangen/` | `/diensten/wtw/vervangen` | certain |
| `/wtw-unit-onderhoud-reinigen/` | `/diensten/wtw/onderhoud-reinigen` | certain |
| `/wtw-unit-inregelen/` | `/diensten/wtw/inregelen` | certain |
| `/mechanische-ventilatie-vervangen/` | `/diensten/mechanische-ventilatie/vervangen` | certain |
| `/mechanische-ventilatie-onderhoud-reinigen/` | `/diensten/mechanische-ventilatie/onderhoud-reinigen` | certain |
| `/mechanische-ventilatie-dakventilator/` | `/diensten/mechanische-ventilatie/aanleggen` | **judgement** — no exact equivalent; nearest topical match |

Note the legacy site uses **trailing slashes**; the new app is `trailingSlash: false`. Sources must be
written with the trailing slash to match real inbound links. A catch-all `/:path*` → `/` fallback should
follow the 9 explicit rules so unmapped legacy URLs (media, `/feed/`, `/wp-json/`) still land somewhere
valid rather than 404 — but it must sit *after* them so it never shadows a real mapping.

## Build Order (dependency-derived)

| # | Step | Depends on | Why here |
|---|---|---|---|
| 1 | Rewrite `assert-seo.ts` to relational form | — | Must land **before** the flip or the flip cannot build |
| 2 | Flip 21 `review` → `published` | 1 | The unlock. 21 pages indexable, sitemap 5 → 26 |
| 3 | Author `/diensten` hub content, then publish | 1 | Blocked on writing; sitemap → 27 |
| 4 | Normalise the 6 statics' `status` | 1 | Data hygiene; no behaviour change |
| 5 | GSC verify + submit sitemap | 2,3 | Pointless before there is anything to index |
| 6 | Baseline capture — rankings, GSC export, DNS snapshot, WP backup | — | **Must precede 7.** Irreversible-step insurance |
| 7 | Legacy redirect map + `assert-redirects.ts` | 2,3,6 | Targets must be indexable *before* equity is pointed at them |
| 8 | DNS repoint of legacy apex + `www` | 7 | **One-way door in practice.** External propagation delay |
| 9 | GBP rename + URL + categories | 2,3 | High-stakes; see PITFALLS |
| 10 | NAP / citation cleanup | 9 | GBP is the canonical record others should match |
| 11 | On-page depth + internal linking | 2,3 | Compounding, not blocking |
| 12 | Kennisbank (MDX) | 1,2 | Independent; can run parallel |
| 13 | Repo + Vercel project rename | everything | Cosmetic, highest collateral risk — do last |

**Ordering rule that matters most:** steps 2–3 gate step 7. Pointing 301s at pages that are still
`noindex` would funnel every scrap of legacy equity into a wall — the worst possible sequencing, and
the easy mistake to make because the redirect work feels more urgent.

## Anti-Patterns

### Anti-Pattern 1: Appending kennisbank URLs directly to `app/sitemap.ts`

**What people do:** `return [...sitemapEntries(), ...articles.map(...)]`.
**Why it's wrong:** recreates precisely the drift `policy.ts` exists to prevent — sitemap membership
would no longer imply an indexable robots directive. This is how the current 22-page bug is shaped.
**Do this instead:** teach `isIndexable()` about articles; let `sitemapEntries()` remain the only emitter.

### Anti-Pattern 2: Snapshot assertions in build gates

**What people do:** `assert.equal(entries.length, 5)`, then bump the number when it fails.
**Why it's wrong:** demonstrated here — the gate green-lit a fully noindexed service surface, twice.
**Do this instead:** assert relationships and floors.

### Anti-Pattern 3: Hand-typed redirect destinations

**What people do:** `destination: "https://tpsklimaattechniek.nl/diensten/wtw/vervangen"`.
**Why it's wrong:** the apex 308s to `www`, so every hand-typed apex URL silently adds a hop; and it
duplicates `CANONICAL_ORIGIN`, so a future origin change misses it.
**Do this instead:** always `${CANONICAL_ORIGIN}${urlFor(node)}`, asserted in CI.

### Anti-Pattern 4: Publishing the hub without content

**What people do:** flip all statuses in one sed pass.
**Why it's wrong:** the hub's `draftShell` fails `publishedContentSchema` — the build breaks, and the
tempting "fix" is to weaken the gate that protects the whole site from thin content.
**Do this instead:** treat hub content as authoring work with its own task.

## Integration Points

### External Services

| Service | Integration | Gotchas |
|---|---|---|
| Vercel (2nd domain) | Attach `tpsventilatie.nl`; host-conditional redirects | Mechanism to confirm `[VERIFY]`; must not disturb primary domain |
| dd24 DNS (new domain) | Unchanged | NS must stay at dd24 — moving drops Titan mail |
| opeiron/cyberfolks DNS (legacy) | Change **only** apex + `www` A records | MX + `mail` A + SPF must survive; webmail and `wp-admin` live on the apex path and **will break** |
| Google Search Console | Verify, submit sitemap | Verification method `[VERIFY]` |
| Google Business Profile | Rename, URL, categories | Highest-stakes; 34 reviews at risk. See PITFALLS |

### Internal Boundaries

| Boundary | Communication | Notes |
|---|---|---|
| `registry.ts` → `policy.ts` | direct import of `PAGES` | Keep unidirectional |
| `policy.ts` → `sitemap.ts` / `generateMetadata()` | function call | The invariant; never bypass |
| `types.ts` ← `registry.ts` | `canonicalPath` lives in `types.ts` | Deliberate, avoids a cycle |
| `lib/seo/redirects.ts` → `next.config.ts` | build-time import | New; must stay pure/serialisable |
| `lib/content/` → `policy.ts` | extend `isIndexable()` | Must not create a parallel sitemap source |

## Sources

- Direct reads: `lib/seo/policy.ts`, `lib/services/types.ts`, `lib/services/registry.ts`,
  `app/sitemap.ts`, `app/robots.ts`, `next.config.ts`, `scripts/assert-seo.ts`, `package.json`
- Live enumeration of `PAGES` by status via `npx tsx` (28 nodes: 21 review / 7 draft)
- Live probes 2026-08-19: HTTP status + `robots` meta on 5 service URLs; `sitemap.xml` (5 URLs);
  `dig` on both domains; old-site WP REST inventory (9 pages, 0 posts)
- Git history: `82d897b`, `82d897b`-adjacent SEO commits

---
*Architecture research for: rebrand/domain migration + indexation unlock on a Next.js 16 local-SEO site*
*Researched: 2026-08-19 (inline — subagents unavailable)*
