// LEGACY REDIRECT MAP — the single source for how the retired tpsventilatie.nl brand
// reaches the new site (Phase 10, D-12…D-16). The map is DATA; three pure emitters
// turn it into the array `next.config.ts` hands to Next.js. Nothing here does I/O.
//
// WHY THE MAP LIVES IN lib/ AND NOT IN THE PLAN: `.planning/` is archived at milestone
// close. This file is where the one judgement call (the dakventilator entry) has to keep
// explaining itself to whoever reads it in a year, so the evidence is in the entry.
//
// NO-BARREL EXCEPTION (P8 D-05): member of the `lib/seo/*` family, same rationale as
// policy.ts. Pure functions only — no rendering, no I/O, server-safe.
//
// IMPORT DISCIPLINE: this module imports CANONICAL_ORIGIN and NOTHING else. `next.config.ts`
// imports it, and Next evaluates the config in its own module graph — pulling in
// `lib/seo/policy.ts` would drag the entire taxonomy registry into that graph for no reason.
// That constraint is why the origin is joined locally below rather than through absoluteUrl().

import { CANONICAL_ORIGIN } from "@/lib/constants";

// Both legacy hostnames, as ONE anchored regex alternation. Three facts make this shape
// non-negotiable, all verified in the Next.js v16.2.1 source:
//
//   1. Next compiles `value` into `new RegExp("^" + value + "$")` — it is ANCHORED. A bare
//      `tpsventilatie.nl` therefore matches the apex ONLY, never the `www` form. Both
//      hostnames are being repointed, so both must match or half the legacy traffic
//      falls through to the catch-all's host gate and never redirects at all.
//   2. The dots are ESCAPED because an unescaped `.` is regex-any.
//   3. Multiple `has` entries AND together (`has.every(...)`), so "host A or host B" is
//      only expressible as alternation inside ONE value — never as two `has` items,
//      which would match nothing.
//
// The realistic failure here is someone "simplifying" this string. `host-pattern-scope`
// in ./redirect-invariants is build-blocking for exactly that reason.
export const LEGACY_HOST_PATTERN = "(www\\.)?tpsventilatie\\.nl";

export interface LegacyRedirect {
  /** Legacy path, WITH the trailing slash the old WordPress site serves and Google indexed. */
  from: string;
  /** Path on the new site. Joined to CANONICAL_ORIGIN by the emitter — never hand-typed. */
  to: string;
  /** "certain" = the legacy page and its target are the same service. "judgement" = a call was made. */
  confidence: "certain" | "judgement";
  /** REQUIRED when confidence is "judgement" (D-16) — `judgement-without-why` is build-blocking. */
  why?: string;
  /**
   * Set ONLY when `to` is deliberately a non-indexable page, and say why the lost equity does
   * not matter for it. Without this, `destination-not-indexable` is build-blocking — a 301 into
   * a noindex page normally funnels the legacy domain's authority into a wall.
   */
  nonIndexableReason?: string;
}

// The nine legacy URLs, most specific first. Eight are mechanical; one is a judgement call
// that carries its evidence.
export const LEGACY_REDIRECTS: readonly LegacyRedirect[] = [
  { from: "/", to: "/", confidence: "certain" },
  { from: "/over-ons/", to: "/over-ons", confidence: "certain" },
  { from: "/contact/", to: "/contact", confidence: "certain" },
  {
    from: "/privacy-beleid/",
    to: "/privacy-beleid",
    confidence: "certain",
    // The one page deliberately kept out of the index on BOTH domains — it is the entire
    // derivation of INDEXABLE_FLOOR (28 routable nodes minus this one = 27). The redirect is
    // still right: a bookmark or a link to the old privacy statement must reach the new one.
    // There is simply no ranking equity on a legal page to preserve, so the usual objection to
    // a noindex destination does not apply here.
    nonIndexableReason:
      "The legal page is noindex by design on both domains (it is the INDEXABLE_FLOOR carve-out). The redirect serves humans following an old link; there is no search equity to lose.",
  },
  { from: "/wtw-unit-vervangen/", to: "/diensten/wtw/vervangen", confidence: "certain" },
  { from: "/wtw-unit-onderhoud-reinigen/", to: "/diensten/wtw/onderhoud-reinigen", confidence: "certain" },
  { from: "/wtw-unit-inregelen/", to: "/diensten/wtw/inregelen", confidence: "certain" },
  { from: "/mechanische-ventilatie-vervangen/", to: "/diensten/mechanische-ventilatie/vervangen", confidence: "certain" },
  {
    from: "/mechanische-ventilatie-onderhoud-reinigen/",
    to: "/diensten/mechanische-ventilatie/onderhoud-reinigen",
    confidence: "certain",
  },
  {
    from: "/mechanische-ventilatie-dakventilator/",
    to: "/diensten/mechanische-ventilatie",
    confidence: "judgement",
    // D-13. The live page, fetched 2026-09-18: its H2 is "Dakventilator Onderhoud" and its
    // three packages are maintenance/cleaning (EUR 190, EUR 250) and replacement (EUR 700).
    // There is no new-installation content on it at all, so the earlier research table's
    // proposal of a `.../aanleggen` target is simply wrong about what the page is.
    // The page spans maintenance, cleaning AND replacement, so no single sub-service matches
    // it either — the pillar hands the visitor all four with the intent intact.
    why: "Legacy page covers onderhoud + reiniging + vervanging, not aanleg — no single sub-service matches, so the pillar preserves intent.",
  },
] as const;

// ORIGIN JOIN — a deliberate divergence from policy.ts, stated here so it reads as a
// decision rather than an oversight.
//
// `absoluteUrl()` in lib/seo/policy.ts calls itself "the ONLY place a path is joined to
// CANONICAL_ORIGIN", and it is — for the indexable surface. This module cannot import it
// (see IMPORT DISCIPLINE above), so it joins locally. The two agree on every path except
// the root, where they disagree ON PURPOSE:
//
//   absoluteUrl("/")  ->  "https://www.tpsklimaattechniek.nl/"   (a sitemap needs an entry URL)
//   here,      "/"    ->  "https://www.tpsklimaattechniek.nl"    (a redirect needs a Location value)
//
// Vercel normalises the bare origin, so both are correct for their own consumer. Because of
// that divergence the `destination-not-indexable` check compares root by RESOLVED URL
// (`new URL(x).href`), never by string — a string comparison would fail on the slash alone.
function destinationFor(to: string): string {
  return `${CANONICAL_ORIGIN}${to === "/" ? "" : to}`;
}

/**
 * The nine explicit rules, carrying ONLY the keys Next.js allows.
 *
 * `confidence` and `why` are metadata and MUST NOT reach these objects: Next's
 * `checkCustomRoutes()` validates against an allow-list and fails the build with
 * `invalid fields: confidence,why`. Stripping them here is not a style choice.
 *
 * `statusCode: 301` stands ALONE and `permanent` is omitted (D-14). Next rejects an object
 * carrying neither, and `permanent: true` would emit a 308 — a different status than the one
 * the migration plan and the Change of Address assume.
 */
export function toNextRedirects() {
  return LEGACY_REDIRECTS.map(({ from, to }) => ({
    source: from,
    destination: destinationFor(to),
    statusCode: 301 as const,
    has: [{ type: "host" as const, value: LEGACY_HOST_PATTERN }],
  }));
}

/**
 * D-12's path-preserving catch-all — everything on the legacy hosts that is not one of the
 * nine keeps its path and lands on the new origin. This is what carries /robots.txt,
 * /sitemap.xml and any URL Google knows about that we do not (D-15).
 *
 * Emitted AFTER the explicit rules so it can never shadow one.
 *
 * THE `has` GATE IS LOAD-BEARING. Without it this rule matches EVERY request to
 * www.tpsklimaattechniek.nl and 301s the site to itself: ERR_TOO_MANY_REDIRECTS, the live
 * site down, and Google dropping it. `catchall-not-host-gated` is build-blocking, and the
 * preview home page loading is the live proof.
 */
export function toCatchAllRedirect() {
  return {
    source: "/:path*",
    destination: `${CANONICAL_ORIGIN}/:path*`,
    statusCode: 301 as const,
    has: [{ type: "host" as const, value: LEGACY_HOST_PATTERN }],
  };
}

/**
 * Re-adds the trailing-slash normalisation that `skipTrailingSlashRedirect: true` removes.
 *
 * Byte-identical to the rule Next.js itself `unshift`es for `trailingSlash: false`, minus its
 * internal-only flags — so canonical-host behaviour is preserved EXACTLY and only the ordering
 * changes. Emitted LAST, which is the entire point: Next would put it FIRST, ahead of every
 * legacy rule, and then /over-ons/ on a legacy host would 308 to /over-ons before any legacy
 * rule was consulted — two hops, on 100% of legacy traffic, with every build still green.
 *
 * `normalisation-not-last` in ./redirect-invariants asserts its position against the array the
 * config actually returns.
 */
export function toTrailingSlashRedirect() {
  return { source: "/:path+/", destination: "/:path+", permanent: true as const };
}
