// REDIRECT INVARIANTS — the legacy map's self-check, expressed as data.
//
// WHY THIS IS A SEPARATE MODULE: the same reason lib/seo/invariants.ts is one. A gate that
// has never been observed failing has not been shown to work. Asserting at module top level
// means the checks can only ever run against the real, committed state — so they can never
// be fed a perturbed map and watched to fire. This module therefore holds PURE functions that
// RETURN a violation list; it never throws and never asserts. `scripts/assert-redirects.ts`
// runs it on reality, `scripts/assert-gate-blocks.ts` runs it on perturbed clones (R1-R9) and
// proves each breakage is actually caught.
//
// Every input is injectable for that reason. Defaults come from the real map, the real
// emitters and the real sitemap surface.
//
// TWO OF THESE CHECKS ENCODE FINDINGS THAT WOULD OTHERWISE BE DISCOVERED BY GOOGLE:
// `catchall-not-host-gated` (an un-gated catch-all 301s the live site to itself) and
// `normalisation-not-last` (every legacy URL silently costs two hops while every build stays
// green). Those two are why this file is worth its length.
//
// NO-BARREL EXCEPTION (P8 D-05): member of the `lib/seo/*` family. Pure, no I/O, server-safe,
// nothing executes at module load.

import { CANONICAL_ORIGIN, NAV_LINKS, TARIEVEN_DROPDOWN } from "@/lib/constants";
import { urlFor } from "@/lib/services/registry";
import { absoluteUrl, indexableSurface, sitemapEntries } from "@/lib/seo/policy";
import {
  LEGACY_HOST_PATTERN,
  LEGACY_REDIRECTS,
  toCatchAllRedirect,
  toNextRedirects,
  toTrailingSlashRedirect,
  type LegacyRedirect,
} from "@/lib/seo/redirects";

// One machine-readable failure. `code` is what callers match on — matching on the message
// would be a snapshot assertion by another name. `source` names the offending rule when
// there is one; `message` is what a human reads in a red build log.
export interface RedirectViolation {
  code: string;
  source?: string;
  message: string;
}

// The keys Next.js v16.2.1's checkCustomRoutes() allows on a redirect object. Anything else
// fails the build with its own terse `invalid fields:` message; we catch it here with a
// readable one instead.
const NEXT_ALLOWED_KEYS = new Set([
  "source",
  "destination",
  "statusCode",
  "permanent",
  "has",
  "missing",
  "basePath",
  "locale",
]);

// The canonical hostnames the legacy pattern must NEVER match. If it does, every request to
// the live site matches the legacy rules.
const CANONICAL_HOSTS = ["tpsklimaattechniek.nl", "www.tpsklimaattechniek.nl"];
const LEGACY_HOSTS = ["tpsventilatie.nl", "www.tpsventilatie.nl"];

// Internal hrefs the app actually navigates to. Collected here rather than in the caller so
// the default is reality and the harness can still inject a perturbed list.
function defaultInternalHrefs(): string[] {
  return [
    ...NAV_LINKS.map((link) => link.href),
    ...TARIEVEN_DROPDOWN.map((item) => item.href),
  ];
}

// Every routable page, indexable or not. `indexableSurface()` is the governed collection —
// the name is about authority, not about the index verdict — so this is the full page set.
function defaultRoutableUrls(): { url: string }[] {
  return indexableSurface().map((node) => ({ url: absoluteUrl(urlFor(node)) }));
}

// Compare two URLs by what they RESOLVE to, never by string. The root is the reason: the
// sitemap carries `${CANONICAL_ORIGIN}/` and a redirect destination is the bare origin, and
// those are the same place. See the ORIGIN JOIN note in ./redirects.
function sameUrl(a: string, b: string): boolean {
  try {
    return new URL(a).href === new URL(b).href;
  } catch {
    return false;
  }
}

/**
 * Check the whole redirect contract and return EVERY violation found — never early-return, so
 * a red build reports all the damage at once rather than the first symptom. An empty array
 * means the invariant holds.
 *
 * All inputs are injectable so the proof harness can feed perturbed data:
 *   map          — the legacy entries (defaults to LEGACY_REDIRECTS)
 *   emitted      — the array next.config.ts actually returns (defaults to the three emitters)
 *   entries      — the indexable sitemap surface (defaults to sitemapEntries())
 *   hostPattern  — the host regex source (defaults to LEGACY_HOST_PATTERN)
 *   skipTrailingSlashRedirect — the config key's real value; see `normalisation-not-last`
 *   internalHrefs — the app's own hrefs (defaults to the nav + pricing dropdown)
 */
export function checkRedirectInvariants(opts?: {
  map?: readonly LegacyRedirect[];
  emitted?: unknown[];
  entries?: { url: string }[];
  hostPattern?: string;
  skipTrailingSlashRedirect?: boolean;
  internalHrefs?: string[];
  routable?: { url: string }[];
}): RedirectViolation[] {
  const map = opts?.map ?? LEGACY_REDIRECTS;
  const emitted =
    opts?.emitted ?? ([...toNextRedirects(), toCatchAllRedirect(), toTrailingSlashRedirect()] as unknown[]);
  const entries = opts?.entries ?? sitemapEntries();
  const hostPattern = opts?.hostPattern ?? LEGACY_HOST_PATTERN;
  const internalHrefs = opts?.internalHrefs ?? defaultInternalHrefs();
  const routable = opts?.routable ?? defaultRoutableUrls();
  const violations: RedirectViolation[] = [];

  // ---- (1) Map-level shape ------------------------------------------------------------

  const seenSources = new Set<string>();
  for (const entry of map) {
    if (seenSources.has(entry.from)) {
      violations.push({
        code: "duplicate-source",
        source: entry.from,
        message:
          `Two entries both claim ${entry.from}. Next matches the FIRST and the second is dead and ` +
          `invisible — no error, no log, just a rule that silently never runs. Delete one or merge them.`,
      });
    }
    seenSources.add(entry.from);
  }

  for (const entry of map) {
    // A destination only chains if it lands on a DIFFERENT entry's source. Comparing
    // against the entry's own source would flag the whole point of this map: the legacy
    // site serves `/over-ons/` and the new one serves `/over-ons`, so every well-formed
    // entry looks like a self-chain once the trailing slash is normalised away.
    const otherSources = new Set(
      map.filter((other) => other.from !== entry.from).map((other) => other.from.replace(/\/$/, "")),
    );
    if (entry.to === "/") continue;
    if (otherSources.has(entry.to.replace(/\/$/, ""))) {
      violations.push({
        code: "destination-is-a-source",
        source: entry.from,
        message:
          `${entry.from} points at ${entry.to}, which is itself a redirect source. That is a CHAIN — ` +
          `the exact thing MIG-06 exists to stop. Google follows chains reluctantly and passes less ` +
          `equity through each hop. Point it at the final destination instead.`,
      });
    }
  }

  for (const entry of map) {
    if (!entry.from.startsWith("/")) {
      violations.push({
        code: "source-slash-shape",
        source: entry.from,
        message:
          `${entry.from} does not start with "/". Next matches sources as paths; a source without a ` +
          `leading slash matches nothing and the rule is dead on arrival.`,
      });
    } else if (entry.from !== "/" && !entry.from.endsWith("/")) {
      violations.push({
        code: "source-slash-shape",
        source: entry.from,
        message:
          `${entry.from} has no trailing slash. The legacy WordPress site SERVES and canonicalises ` +
          `slashed URLs — that is the form Google indexed. A slash-less source would only ever be ` +
          `reached via the normalisation hop, which is the second hop this phase exists to avoid.`,
      });
    }
  }

  for (const entry of map) {
    if (entry.confidence === "judgement" && !entry.why?.trim()) {
      violations.push({
        code: "judgement-without-why",
        source: entry.from,
        message:
          `${entry.from} is marked confidence: "judgement" but carries no why. A judgement call with ` +
          `no recorded reasoning is indistinguishable from a mistake six months later, when .planning/ ` +
          `has been archived and this file is all that is left. Write down what the legacy page ` +
          `actually contained and why this target preserves the visitor's intent.`,
      });
    }
  }

  // ---- (2) Emitted-array shape — the array the build will actually use -----------------

  for (const rule of emitted) {
    if (typeof rule !== "object" || rule === null) continue;
    const record = rule as Record<string, unknown>;
    const source = typeof record.source === "string" ? record.source : undefined;
    for (const key of Object.keys(record)) {
      if (!NEXT_ALLOWED_KEYS.has(key)) {
        violations.push({
          code: "emitted-invalid-key",
          source,
          message:
            `The emitted rule for ${source ?? "(unknown source)"} carries "${key}", which is not in ` +
            `Next's allow-list. Next's checkCustomRoutes() will fail the build with "invalid fields: ` +
            `${key}" — metadata like confidence/why belongs on the map entry, never on the emitted ` +
            `object. The emitter is supposed to strip it.`,
        });
      }
    }
  }

  for (const rule of emitted) {
    if (typeof rule !== "object" || rule === null) continue;
    const record = rule as Record<string, unknown>;
    const destination = record.destination;
    if (typeof destination !== "string") continue;
    // The normalisation rule is a same-origin path rewrite and has no origin by design.
    if (destination.startsWith("/")) continue;
    if (!destination.startsWith(CANONICAL_ORIGIN)) {
      violations.push({
        code: "destination-off-origin",
        source: typeof record.source === "string" ? record.source : undefined,
        message:
          `${destination} does not start with ${CANONICAL_ORIGIN}. Every destination must be built from ` +
          `the CANONICAL_ORIGIN constant — a hand-typed origin sends the apex form, which then 308s to ` +
          `www, turning one hop into two on every legacy URL it touches.`,
      });
    }
  }

  // ---- (3) Destinations must be real, indexable pages ----------------------------------

  for (const entry of map) {
    const resolved = `${CANONICAL_ORIGIN}${entry.to === "/" ? "" : entry.to}`;

    // (a) The destination must be a real page. No opt-out: a 301 into a 404 is a dead end
    //     for humans and for Google alike.
    if (!routable.some((page) => sameUrl(page.url, resolved))) {
      violations.push({
        code: "destination-not-routable",
        source: entry.from,
        message:
          `${entry.from} points at ${entry.to}, which is not a page on this site at all. The redirect would ` +
          `land the visitor on a 404 — worse than leaving the legacy URL alone, because the old page at ` +
          `least existed. Check the path against the registry.`,
      });
      continue;
    }

    // (b) It must also be INDEXABLE, unless the entry says why not. This is the check that
    //     protects the equity transfer: a 301 into a noindex page funnels the legacy domain's
    //     authority into a wall. The opt-out exists because exactly one legitimate case
    //     exists — the legal page, deliberately kept out of the index — and silently
    //     weakening the check for all nine entries to accommodate it would throw away the
    //     protection for the eight that need it. Same idiom as confidence/why: the exception
    //     is allowed, but it has to explain itself.
    if (!entries.some((sitemapEntry) => sameUrl(sitemapEntry.url, resolved))) {
      if (!entry.nonIndexableReason?.trim()) {
        violations.push({
          code: "destination-not-indexable",
          source: entry.from,
          message:
            `${entry.from} points at ${entry.to}, which is a real page but is NOT in the indexable surface. ` +
            `A 301 into a page Google will not index funnels the legacy domain's equity into a wall — the ` +
            `redirect works for humans and is worthless for search. Either the target is wrong, its node is ` +
            `not published, or this is a deliberate exception — in which case set nonIndexableReason on the ` +
            `entry and say why the lost equity does not matter for this page.`,
        });
      }
    }
  }

  // ---- (4) The host gate — §Pitfall 2, the catastrophic one ----------------------------

  // Addressed BY PREDICATE, never by array position: a reordering of the emitters must not
  // silently turn this check into an assertion about a different rule.
  const catchAll = emitted.find(
    (rule) => typeof rule === "object" && rule !== null && (rule as Record<string, unknown>).source === "/:path*",
  ) as Record<string, unknown> | undefined;

  if (!catchAll) {
    violations.push({
      code: "catchall-not-host-gated",
      message:
        `No catch-all rule ("/:path*") was emitted at all. Every legacy URL Google knows about that is ` +
        `not one of the nine explicit entries — including /robots.txt and /sitemap.xml — would 404 ` +
        `after the cutover instead of redirecting.`,
    });
  } else {
    const has = catchAll.has;
    const gated =
      Array.isArray(has) &&
      has.some(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          (item as Record<string, unknown>).type === "host" &&
          (item as Record<string, unknown>).value === hostPattern,
      );
    if (!gated) {
      violations.push({
        code: "catchall-not-host-gated",
        source: "/:path*",
        message:
          `THE CATCH-ALL IS NOT HOST-GATED. Without a has: [{ type: "host", value: LEGACY_HOST_PATTERN }] ` +
          `entry this rule matches EVERY request to ${CANONICAL_ORIGIN} and 301s the site to itself: ` +
          `ERR_TOO_MANY_REDIRECTS, the live site down, and Google dropping it. This is the single most ` +
          `destructive thing in this phase. Do not "simplify" this away.`,
      });
    }
  }

  // Reproduce Next's exact anchoring locally so a "simplified" pattern is caught by the build
  // rather than by production.
  let hostRe: RegExp | null = null;
  try {
    hostRe = new RegExp(`^${hostPattern}$`);
  } catch {
    violations.push({
      code: "host-pattern-scope",
      message:
        `LEGACY_HOST_PATTERN ("${hostPattern}") is not a valid regex. Next compiles it with ` +
        `new RegExp("^" + value + "$"), so an invalid pattern throws inside the router.`,
    });
  }
  if (hostRe) {
    for (const host of LEGACY_HOSTS) {
      if (!hostRe.test(host)) {
        violations.push({
          code: "host-pattern-scope",
          message:
            `LEGACY_HOST_PATTERN does not match ${host}. Next anchors the pattern, so a bare ` +
            `"tpsventilatie.nl" matches the apex ONLY. Both hostnames are being repointed — if one ` +
            `does not match, that half of the legacy traffic never redirects at all.`,
        });
      }
    }
    for (const host of CANONICAL_HOSTS) {
      if (hostRe.test(host)) {
        violations.push({
          code: "host-pattern-scope",
          message:
            `LEGACY_HOST_PATTERN MATCHES ${host}, a canonical hostname. The legacy rules would then fire ` +
            `on the live site and redirect it to itself. Tighten the pattern before this ships.`,
        });
      }
    }
  }

  // ---- (5) Ordering — §Pitfall 1, the silent one ---------------------------------------

  const last = emitted[emitted.length - 1] as Record<string, unknown> | undefined;
  const lastIsNormalisation =
    !!last && last.source === "/:path+/" && last.destination === "/:path+";

  if (!lastIsNormalisation) {
    violations.push({
      code: "normalisation-not-last",
      message:
        `The LAST emitted rule is not the "/:path+/" -> "/:path+" normalisation. Ordering IS the ` +
        `mechanism here: if that rule runs before the legacy rules, /over-ons/ on a legacy host 308s to ` +
        `/over-ons BEFORE any legacy rule is consulted, so every slashed legacy URL costs TWO hops — on ` +
        `100% of legacy traffic, with every build still green and nothing in any log. MIG-07 can never ` +
        `go green in that state.`,
    });
  }

  if (opts?.skipTrailingSlashRedirect !== true) {
    violations.push({
      code: "normalisation-not-last",
      message:
        `skipTrailingSlashRedirect is not true in next.config.ts. With it unset, Next.js UNSHIFTS its own ` +
        `"/:path+/" 308 to the FRONT of the redirects array, ahead of every rule below — so the ordering ` +
        `above becomes decorative and every slashed legacy URL costs two hops. Re-adding the identical ` +
        `rule last is only correct while this key is on.`,
    });
  }

  // ---- (6) Internal hrefs — the cost of turning normalisation off ----------------------

  for (const href of internalHrefs) {
    if (href === "/") continue;
    // Query strings and hashes are not path shape.
    const path = href.split(/[?#]/)[0];
    if (path !== "/" && path.endsWith("/")) {
      violations.push({
        code: "internal-href-slashed",
        source: href,
        message:
          `The internal href ${href} ends in a slash. With skipTrailingSlashRedirect on, Next no longer ` +
          `normalises client-side navigation, so this is a real dead end rather than a silent 308 — it ` +
          `became a bug the moment that key was set. Drop the trailing slash.`,
      });
    }
  }

  return violations;
}
