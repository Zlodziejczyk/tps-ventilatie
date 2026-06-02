---
phase: 01-taxonomy-data-model
reviewed: 2026-06-02T00:00:00Z
depth: standard
files_reviewed: 17
files_reviewed_list:
  - next.config.ts
  - package.json
  - lib/constants.ts
  - lib/services/types.ts
  - lib/services/registry.ts
  - lib/services/brands.ts
  - lib/services/airconditioning.ts
  - lib/services/warmtepompen.ts
  - lib/services/wtw.ts
  - lib/services/mechanische-ventilatie.ts
  - app/tarieven/page.tsx
  - components/PricingTabs.tsx
  - scripts/assert-site-shape.ts
  - scripts/assert-registry.ts
  - scripts/validate-taxonomy.ts
  - scripts/assert-gate-blocks.ts
  - scripts/check-radius-literals.sh
findings:
  critical: 1
  warning: 6
  info: 5
  total: 12
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-06-02
**Depth:** standard
**Files Reviewed:** 17
**Status:** issues_found

## Summary

Phase 01 builds a Zod-validated discriminated-union page registry (`lib/services/`), extends the `SITE` NAP constant, derives service-radius copy from `SITE.serviceRadiusKm`, and adds a build-blocking prebuild taxonomy gate plus several on-demand assertion CLIs. The structure is clean and well-documented, the all-draft taxonomy validates, and `npm run build` is green.

However, the central correctness claim of the phase — "the single discriminated-union shape every page node satisfies (D-04)" — does **not** hold at runtime. The `pageSchema` is a flat `z.object` with every slug field independently `.optional()`; it is NOT a `z.discriminatedUnion`. I proved at runtime that a `service` node missing `pillarSlug`/`serviceSlug` passes validation and produces the canonical URL `/diensten/undefined/undefined`, and that a `hub` with an arbitrary wrong `segment` also passes. The TypeScript `PageNode` union enforces these invariants at compile time, but the build-blocking gate (which exists precisely to catch bad data before ship) does not. That is the one BLOCKER.

The remaining findings are WARNINGs about validation gaps the gate silently does not cover (brand referential integrity, discriminant/slug consistency, secondary-vs-primary keyword cannibalization, the segment drift between `urlFor` and `canonicalPath`), one regex-coverage gap in the radius-literal guard, and one hardcoded radius literal that the guard does not catch. Note that `geo`, `serviceAreas`, `erkendInstallateur`, and keyword strings are explicitly flagged owner-verify-pending placeholders for later phases and are therefore **not** flagged as defects here.

No structural-findings block was provided with this review, so the `## Structural Findings (fallow)` section is omitted.

## Critical Issues

### CR-01: `pageSchema` is not a discriminated union — invalid node shapes pass the build gate and produce `/diensten/undefined/undefined`

**File:** `lib/services/types.ts:170-205`
**Issue:** The file header and `PageNode` union (`lib/services/types.ts:67-89`) promise that every node satisfies a discriminated-union contract keyed on `type`: a `service` must have `pillarSlug` + `serviceSlug`, a `hub` must have `segment: "diensten"`, a `static` must have `pathSegment`, etc. But `pageSchema` is a flat `z.object` where `segment`, `pillarSlug`, `serviceSlug`, and `pathSegment` are all independently `.optional()` and not gated on the `type` discriminant. The runtime validation that the prebuild gate (`scripts/validate-taxonomy.ts`) relies on therefore does NOT enforce the contract. I confirmed this directly:

```
service-without-slugs parse success: true
hub-with-wrong-segment parse success: true
canonicalPath(service-no-slugs): "/diensten/undefined/undefined"
pillar-with-extra-serviceSlug parse success: true
```

Impact: a future data edit (Phase 2-4 authors hand-editing `lib/services/*.ts`, or any JSON/CMS-sourced node later) that drops a slug or sets a wrong `segment` will pass the build-blocking gate and emit a live URL containing the literal string `undefined`. The TS union catches this only for object literals checked against `PageNode` at compile time — it does not protect the validation path, which is the entire point of a build gate. Today the committed data happens to be well-formed, so this is latent, but the gate is advertised as the safety net (D-07/D-08) and silently fails its core job.

**Fix:** Replace the flat object + slug-optional shape with a real discriminated union so structure is enforced per variant. Example:

```typescript
const pageBaseFields = {
  status: z.enum(["draft", "review", "published"]),
  primaryKeyword: z.string().min(1),
  searchIntent: z.enum([
    "informationeel", "commercieel", "transactioneel", "navigationeel",
  ]),
  secondaryKeywords: z.array(z.string()).optional(),
  navTitle: z.string().min(1),
  navDescription: z.string().min(1),
  icon: z.string().min(1),
  content: contentShellSchema,
};

const hubSchema = z.object({
  ...pageBaseFields,
  type: z.literal("hub"),
  segment: z.literal("diensten"),
});
const pillarSchema = z.object({
  ...pageBaseFields,
  type: z.literal("pillar"),
  pillarSlug: z.string().min(1),
});
const serviceSchema = z.object({
  ...pageBaseFields,
  type: z.literal("service"),
  pillarSlug: z.string().min(1),
  serviceSlug: z.string().min(1),
  brandIds: z.array(z.string()).optional(),
});
const staticSchema = z.object({
  ...pageBaseFields,
  type: z.literal("static"),
  pathSegment: z.string(), // "" allowed (home)
});

const baseNode = z.discriminatedUnion("type", [
  hubSchema, pillarSchema, serviceSchema, staticSchema,
]);

// Re-apply the status-gated content rule via superRefine on the union result.
export const pageSchema = baseNode.superRefine((node, ctx) => {
  if (node.status === "review" || node.status === "published") {
    const result = publishedContentSchema.safeParse(node.content);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ code: "custom", path: ["content", ...issue.path], message: issue.message });
      }
    }
  }
});
```

This makes the gate reject `service`-without-slugs and `hub`-with-wrong-segment, closing the gap between the compile-time `PageNode` union and the runtime validation the build depends on. (`z.discriminatedUnion` also rejects unknown discriminant values for free.)

## Warnings

### WR-01: Build gate does not verify `brandIds` referential integrity — a typo'd brand id ships silently

**File:** `lib/services/types.ts:189`, `lib/services/brands.ts:11-42`
**Issue:** `brandIds` is validated only as `z.array(z.string()).optional()`. Nothing ties a `brandId` to an existing key in `BRANDS`. `BrandId` (`brands.ts:42`) is a compile-time `keyof typeof BRANDS`, but the service nodes type `brandIds?: string[]` (loose), and the schema accepts any string. A future edit like `brandIds: ["dakin"]` (typo) or referencing a removed brand passes the prebuild gate, and Phase 2's BrandGrid (which "resolves id -> data") will get `undefined` for that id. This is exactly the kind of cross-record integrity a single-source-of-truth registry is supposed to guarantee.
**Fix:** Type the field as `brandIds?: BrandId[]` in `ServicePage`, and validate against the real key set in the schema, e.g. `brandIds: z.array(z.enum(Object.keys(BRANDS) as [BrandId, ...BrandId[]])).optional()`, or add a `pagesSchema` superRefine that checks every `brandId` exists in `BRANDS`. Add a brand-integrity assertion to `scripts/assert-registry.ts` so it is covered even before the schema change lands.

### WR-02: Anti-cannibalization check ignores secondaryKeyword-vs-primaryKeyword collisions — one already exists in committed data

**File:** `lib/services/types.ts:209-236`, `lib/services/registry.ts:66`, `lib/services/registry.ts:96`
**Issue:** `pagesSchema` enforces uniqueness only across `primaryKeyword` values. It does not consider `secondaryKeywords`. The committed data already contains a collision: the Home node (`/`) lists `"TPS klimaattechniek"` as a secondaryKeyword while the over-ons node (`/over-ons`) uses `"TPS klimaattechniek"` as its primaryKeyword (confirmed at runtime). The stated goal (IA-09 anti-cannibalization) is to prevent two pages competing for the same term — a primary/secondary overlap is precisely that competition, yet the gate passes it. Severity is WARNING (not BLOCKER) because all nodes are draft and copy is not yet published, but the validation does not do what its comment claims.
**Fix:** Decide the intended rule and encode it. Either (a) drop `"TPS klimaattechniek"` from the Home node's secondaryKeywords, or (b) extend the `pagesSchema` superRefine to also flag any secondaryKeyword that equals another page's primaryKeyword. If primary/secondary overlap is intentionally allowed, update the comment to say so, so the next author does not assume coverage that is not there.

### WR-03: `urlFor` (registry) and `canonicalPath` (types) diverge on the hub `segment` case

**File:** `lib/services/registry.ts:152-163`, `lib/services/types.ts:95-112`
**Issue:** The two functions are documented as mirror implementations that "cannot drift" (`registry.ts:9-12`), and `scripts/assert-registry.ts:50-58` asserts they agree for every node. But the hub branch differs: `urlFor` returns `` `/${node.segment}` `` (no fallback), while `canonicalPath` returns `` `/${node.segment ?? "diensten"}` ``. They agree today only because the committed hub has `segment: "diensten"` set. If `segment` were ever undefined/empty, `urlFor` would emit `/undefined` (or `/`) while `canonicalPath` emits `/diensten` — a real drift the assert script would catch only by coincidence of current data. Two implementations of the same rule is also a duplication smell; the header even calls out the no-drift intent.
**Fix:** Make `urlFor` delegate to `canonicalPath` (the header for `types.ts` already says the public `urlFor()` "delegates to `canonicalPath` — one implementation, no drift", but the code does not):

```typescript
import { canonicalPath } from "./types";
export function urlFor(node: PageNode): string {
  return canonicalPath(node);
}
```

That eliminates the divergence by construction and removes the second switch entirely. (Note the `static` branches also differ stylistically — `node.pathSegment === ""` vs `node.pathSegment ?`. Both collapse to one once delegated.)

### WR-04: Radius-literal guard regex misses the spaced `50 km` form and any other phrasing

**File:** `scripts/check-radius-literals.sh:11`
**Issue:** The guard exists to ensure no stale contradictory radius literal (`50` / `100` km) is reintroduced after deriving the value from `SITE.serviceRadiusKm` (QA-03 / Crit 4). The pattern is `straal van 50\|straal van 100\|100 km\|50km`. It matches `50km` (no space) and `100 km` (with space) but is asymmetric: a stale `50 km` (with a space — the natural rendered form, matching the live `{SITE.serviceRadiusKm} km` output spacing) is NOT caught. I verified `grep -c '50 km'` against a sample returns a match the script pattern misses. So a regression like `tot 50 km` would slip through the very guard built to stop it.
**Fix:** Normalize the alternatives to tolerate optional whitespace and both numbers, e.g. extended regex:

```bash
PATTERN='straal van (50|100)|(^|[^0-9])(50|100) ?km'
if MATCHES=$(grep -rnE "$PATTERN" app components 2>/dev/null); then
```

At minimum add `50 km` and `100km` to the alternation so both spacings of both numbers are covered.

### WR-05: Hardcoded `60 km` radius literal in `WhyTPSSection.tsx` bypasses the single-source rule (and the guard's directory scope)

**File:** `app/page-sections/WhyTPSSection.tsx:20`
**Issue:** CLAUDE.md and plan 01-03 require the service radius to derive once from `SITE.serviceRadiusKm`; `app/tarieven/page.tsx:63` and `components/PricingTabs.tsx:443,520` correctly interpolate `{SITE.serviceRadiusKm}`. But `WhyTPSSection.tsx:20` hardcodes the string `"Werkgebied tot 60 km vanuit Zoetermeer."`. This is the same class of defect QA-03 was created to prevent — a numeric radius literal living in source instead of being sourced from `SITE`. If the owner ever changes `serviceRadiusKm`, this home-page USP silently goes stale and contradicts the other pages. The radius-literal guard (`check-radius-literals.sh`) scans `app/` + `components/` but only matches 50/100, so it does not catch the hardcoded `60`.
**Fix:** Source the value from the constant: `` `Werkgebied tot ${SITE.serviceRadiusKm} km vanuit Zoetermeer. ...` `` (import `SITE` from `@/lib/constants`). This file was not in the phase file list but is the same data-layer concern (SITE-derived radius) the phase establishes; flagging so the single-source guarantee actually holds repo-wide.

### WR-06: On-demand assertion CLIs and the radius guard are not wired into any npm script or CI — only `validate-taxonomy` is build-blocking

**File:** `package.json:5-11`, `scripts/assert-registry.ts:1-11`, `scripts/assert-site-shape.ts:1-11`, `scripts/assert-gate-blocks.ts:1-6`, `scripts/check-radius-literals.sh:1-9`
**Issue:** Only `scripts/validate-taxonomy.ts` runs (via `prebuild`). The other four scripts — `assert-registry`, `assert-site-shape`, `assert-gate-blocks`, and `check-radius-literals.sh` — are documented "run on demand" and are wired into nothing (confirmed: `grep` for them in `package.json` returns no script references). The drift guard (assert-registry §4), the SITE-shape guarantee, the gate-blocks proof, and the radius-literal guard therefore never run automatically and will rot: a regression they are designed to catch ships freely because no automated path executes them. The phase positions these as guarantees (Crit 1/4/5), but a guarantee that runs only when someone remembers to type the command is not enforced.
**Fix:** Add them to npm scripts and chain into `prebuild` (or a `verify`/CI step) so they actually gate, e.g.:

```json
"prebuild": "tsx scripts/validate-taxonomy.ts && tsx scripts/assert-registry.ts && tsx scripts/assert-site-shape.ts && bash scripts/check-radius-literals.sh",
"verify": "tsx scripts/assert-gate-blocks.ts"
```

(Keep `assert-gate-blocks` out of `prebuild` if its clone-mutation runtime cost is unwanted, but run it in CI.) If "on-demand only" is a deliberate scoping decision for this milestone, record that explicitly so it is not mistaken for an enforced gate.

## Info

### IN-01: `findByType`, `findBySlug`, and `validateTaxonomy` are exported but unused anywhere in the app

**File:** `lib/services/registry.ts:166-192`
**Issue:** `findByType`, `findBySlug`, and `validateTaxonomy` have no callers outside the registry/scripts (confirmed via repo grep; `validateTaxonomy` is used only by `assert-registry.ts`, and the two lookups are used nowhere). They are presumably scaffolding for Phase 2 nav/sitemap derivation. That is a reasonable forward-looking choice, but as of this phase they are dead exports — flagging so they are intentionally retained, not forgotten. No action required if Phase 2 consumes them imminently.
**Fix:** Leave as-is if Phase 2 wiring is imminent; otherwise consider deferring until consumed to keep the public surface honest.

### IN-02: `draftShell` helper is duplicated verbatim across five files

**File:** `lib/services/registry.ts:20-34`, `lib/services/airconditioning.ts:13-27`, `lib/services/warmtepompen.ts:11-25`, `lib/services/wtw.ts:13-27`, `lib/services/mechanische-ventilatie.ts:12-26`
**Issue:** The identical `draftShell(h1, metaTitle, metaDescription)` factory is copy-pasted into all four pillar data files and the registry. Five copies of the same 14-line function means a future change to the draft content shell (e.g., adding a default `localAngle` or a new required field) must be made in five places, and the registry copy has a subtly different return type annotation (`PageNode["content"]`) than the data-file copies (`ContentShell`) — they are the same type today but the inconsistency invites drift.
**Fix:** Export a single `draftShell` (and its `ContentShell` return type) from one module — e.g. `lib/services/types.ts` or a small `lib/services/draft-shell.ts` — and import it everywhere. Removes ~56 lines of duplication and a divergence risk.

### IN-03: `EXPECTED_PAGE_COUNT` magic constant duplicates the component-count arithmetic in a comment

**File:** `scripts/assert-registry.ts:18`, `lib/services/registry.ts:139-140`
**Issue:** `EXPECTED_PAGE_COUNT = 27` is asserted against `PAGES.length`, but the breakdown (1 hub + 4 pillars + 17 subs + 5 static) lives only in prose comments in two files. Adding or removing a service requires hand-updating the literal `27` and both comments; forgetting the literal turns a legitimate addition into a failed build with a confusing message. The check is also somewhat circular — it asserts a hand-maintained total rather than the structural relationship.
**Fix:** Either derive the expectation structurally (assert per-type counts, e.g. `findByType("pillar").length === 4` and `findByType("service").length === 17`), which localizes failures, or add a short comment at the constant pointing to the registry breakdown so the two stay in sync.

### IN-04: `PricingTabs` tab-from-URL parsing silently coerces any unknown `?tab=` value to `wtw`

**File:** `components/PricingTabs.tsx:191`
**Issue:** `const tabFromUrl: Tab = tabParam === "airco" ? "airco" : tabParam === "mv" ? "mv" : "wtw";` — any value other than `airco`/`mv` (including `?tab=bogus` or a future `?tab=warmtepomp`) silently falls back to `wtw`. This is defensive and avoids crashes (good), but the nested-ternary default also masks typos in internal links (e.g., `TARIEVEN_DROPDOWN` in `lib/constants.ts:81` hardcodes `/tarieven?tab=airco`; a future link with a wrong tab token would land on WTW with no signal). Minor, and arguably correct UX, but worth a comment.
**Fix:** Optional — extract the valid set and document the fallback: `const VALID_TABS = ["wtw","mv","airco"] as const; const tabFromUrl = (VALID_TABS as readonly string[]).includes(tabParam ?? "") ? (tabParam as Tab) : "wtw";` with a comment that unknown values intentionally default to WTW.

### IN-05: `ContentShell.ogImage` is optional and unset on every node, with no validation that a set value is a plausible path

**File:** `lib/services/types.ts:49`, `lib/services/types.ts:139`
**Issue:** `ogImage?: string` / `z.string().optional()` accepts any string with no shape constraint (no leading-slash or extension check), and no node sets it yet. This is fine for draft, but when Phase 3 JSON-LD/OG wiring starts consuming it, an arbitrary or malformed value (e.g. a bare filename) would pass validation and emit a broken OG tag. Flagging now since the content shell is the contract Phase 3 reads.
**Fix:** Optional for this phase — when OG images are introduced, tighten to something like `z.string().regex(/^\//, "ogImage must be a root-relative path").optional()` so a malformed value fails the gate rather than shipping.

---

_Reviewed: 2026-06-02_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
