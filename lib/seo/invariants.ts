// INDEXATION INVARIANTS — the indexing policy's self-check, expressed as data.
//
// WHY THIS IS A SEPARATE MODULE (D-03): the old `scripts/assert-seo.ts` asserted at
// module top-level, so its checks could only ever run against the real, committed
// state — they could never be re-run against perturbed input, and therefore could
// never be shown to fail. A gate that has never been observed failing has not been
// shown to work. It duly rotted: it hardcoded `sitemapEntries().length === 5` and
// deep-equalled a fixed URL list, which meant it actively ENFORCED the bug where the
// whole service surface was noindexed. When reality moved, commit `82d897b` bumped
// the expected number to match instead of asking what had broken.
//
// So the logic lives here as a PURE function that RETURNS a violation list. It never
// throws and never asserts — the calling scripts do that. `scripts/assert-seo.ts`
// runs it on the real surface; `scripts/assert-gate-blocks.ts` runs it on perturbed
// clones and proves each breakage is caught.
//
// Every check is RELATIONAL, never a snapshot: sitemap membership must equal
// `isIndexable(node)` per node — a statement that is equally true at 5 indexable
// pages and at 27. Only the optional floor is state-dependent, which is why it is
// opt-in per caller rather than baked in here.
//
// NO-BARREL EXCEPTION (D-05): member of the `lib/seo/*` family (same rationale as
// policy.ts). Pure functions only — no rendering, no I/O, server-safe, and nothing
// executes at module load.

import { CANONICAL_ORIGIN } from "@/lib/constants";
import { urlFor } from "@/lib/services/registry";
import type { PageNode } from "@/lib/services/types";
import { absoluteUrl, indexableSurface, isIndexable, sitemapEntries } from "@/lib/seo/policy";

// THE definition of "complete" for this site, in exactly one place.
//
// Derivation: 28 routable nodes in the registry minus privacy-beleid, the single
// page deliberately kept out of the index = 27.
//
// Both the build gate (scripts/assert-seo.ts) and the live probe
// (scripts/verify-indexation.ts) import THIS constant (D-25), so the thing that
// checks the data and the thing that checks the served site are structurally
// incapable of disagreeing about what "complete" means. Deriving it live from the
// taxonomy was rejected: the probe would then share the source of truth it exists
// to check independently.
//
// Read the below-floor violation message before changing this number.
export const INDEXABLE_FLOOR = 27;

// One machine-readable failure. `code` is what callers match on (matching on the
// message would be a snapshot assertion by another name); `url` names the offending
// page when there is one; `message` is what a human reads in a red build log.
export interface IndexationViolation {
  code: string;
  url?: string;
  message: string;
}

// Check the full indexation contract and return EVERY violation found (never
// early-return — a red build should report all the damage at once, not the first
// symptom). An empty array means the invariant holds.
//
// All inputs are injectable so the proof harness can feed perturbed data:
//   nodes   — defaults to the governed collection (D-05: never named directly here)
//   entries — defaults to the emitted sitemap
//   floor   — OMITTED means the floor is NOT checked. Deliberate (D-09): the floor is
//             the one state-dependent assertion, so it lands with the flip that
//             satisfies it rather than being hardcoded ahead of reality.
export function checkIndexationInvariants(opts?: {
  nodes?: PageNode[];
  entries?: { url: string }[];
  floor?: number;
}): IndexationViolation[] {
  const nodes = opts?.nodes ?? indexableSurface();
  const entries = opts?.entries ?? sitemapEntries();
  const violations: IndexationViolation[] = [];

  const entryUrls = entries.map((entry) => entry.url);
  const entrySet = new Set(entryUrls);
  const nodeUrls = new Set(nodes.map((node) => absoluteUrl(urlFor(node))));

  // (1) THE relational core: for every governed node, presence in the sitemap must
  //     equal the indexing verdict. Both directions are failures, with distinct codes
  //     so a red log reads unambiguously.
  for (const node of nodes) {
    const url = absoluteUrl(urlFor(node));
    const inSitemap = entrySet.has(url);
    const indexable = isIndexable(node);

    if (inSitemap && !indexable) {
      violations.push({
        code: "sitemap-without-index",
        url,
        message: `${url} is listed in the sitemap but the indexing policy says noindex — Google would be invited to a page told not to be indexed.`,
      });
    } else if (!inSitemap && indexable) {
      violations.push({
        code: "index-without-sitemap",
        url,
        message: `${url} is indexable but absent from the sitemap — a page that may be indexed is not being announced.`,
      });
    }
  }

  // (2) Every sitemap entry must map back to a governed node. This is the check that
  //     makes a second URL list bolted onto app/sitemap.ts fail loudly instead of
  //     silently reintroducing the drift the policy module exists to prevent.
  for (const url of entryUrls) {
    if (!nodeUrls.has(url)) {
      violations.push({
        code: "orphan-entry",
        url,
        message: `${url} is in the sitemap but no governed node produces it — sitemap URLs must come from indexableSurface(), never from a parallel list.`,
      });
    }
  }

  // (3) Sitemap URLs are absolute on the canonical origin (a relative or foreign-host
  //     entry is silently ignored by crawlers).
  for (const url of entryUrls) {
    if (!url.startsWith(CANONICAL_ORIGIN)) {
      violations.push({
        code: "non-absolute-entry",
        url,
        message: `${url} is not absolute on the canonical origin ${CANONICAL_ORIGIN} — every sitemap URL must be built through absoluteUrl().`,
      });
    }
  }

  // (4) Floor — opt-in. The message is load-bearing (D-06): the documented human
  //     failure mode is editing the expected number until the build goes green.
  if (typeof opts?.floor === "number") {
    const indexableCount = nodes.filter(isIndexable).length;
    if (indexableCount < opts.floor) {
      violations.push({
        code: "below-floor",
        message:
          `Only ${indexableCount} indexable pages, floor is ${opts.floor}. A DROP MEANS A PAGE WAS DE-INDEXED — ` +
          `find out what went dark before you touch this number. Lower the floor ONLY when a page was deliberately ` +
          `retired, and never raise or lower it just to make the build pass (that is what commit 82d897b did, and it ` +
          `kept the entire service surface hidden from Google for months).`,
      });
    }
  }

  // (5) No duplicate sitemap URLs — cheap, and it catches a merge that double-lists a
  //     page or a node whose canonical path collides with another's.
  const seen = new Set<string>();
  for (const url of entryUrls) {
    if (seen.has(url)) {
      violations.push({
        code: "duplicate-entry",
        url,
        message: `${url} appears more than once in the sitemap — one entry per indexable node.`,
      });
    }
    seen.add(url);
  }

  return violations;
}
