// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node built-ins suffice).
//
// Wired into `npm run prebuild` as guard #9, after assert-seo.ts — build-blocking on
// every Vercel build (D-17).
// Run standalone:  tsx scripts/assert-redirects.ts
//
// Locks the legacy redirect map STRUCTURALLY. It is a thin CLI over
// checkRedirectInvariants() in lib/seo/redirect-invariants.ts — all the logic lives
// there as a pure function so scripts/assert-gate-blocks.ts can feed it perturbed maps
// and prove each assertion actually bites (R1-R9). A gate that has never been observed
// failing has not been shown to work.
//
// It reads the array next.config.ts ACTUALLY returns, plus the config's own
// skipTrailingSlashRedirect value — not the source text. That is what makes the ordering
// assertion real: reordering the emitters, or dropping the config key, fails here rather
// than silently costing every legacy URL a second hop in production. A value assertion
// cannot be defeated by a comment. (Literal forms of the strings the plan's verification
// greps for are kept out of this file on purpose — a comment quoting one would
// false-positive that grep.)
//
// IT MUST NOT TOUCH THE NETWORK (D-17). A fetch here would make every Vercel build depend
// on production being reachable, and would assert against the deployment it is producing.
// The live one-hop probe is scripts/verify-redirects.ts, which runs after deploy.

import assert from "node:assert/strict";
import nextConfig from "@/next.config";
import { LEGACY_HOST_PATTERN, LEGACY_REDIRECTS } from "@/lib/seo/redirects";
import { checkRedirectInvariants } from "@/lib/seo/redirect-invariants";
import { CANONICAL_ORIGIN } from "@/lib/constants";

// async main(): these build-time scripts transpile to CJS, where top-level await is
// unavailable (the lesson scripts/verify-indexation.ts already encodes).
async function main(): Promise<void> {
  assert.equal(
    typeof nextConfig.redirects,
    "function",
    "next.config.ts exports no redirects() — the entire legacy map would be absent from the build.",
  );

  const emitted = (await nextConfig.redirects!()) as unknown[];
  const skipTrailingSlashRedirect = nextConfig.skipTrailingSlashRedirect === true;

  // Vacuous-pass guard, in the assert-seo.ts style: a FLOOR, never an equality on a number
  // that may legitimately grow. 9 explicit + catch-all + normalisation = 11.
  assert.ok(
    emitted.length >= 11,
    `Only ${emitted.length} redirect rules were emitted; expected at least 11 (${LEGACY_REDIRECTS.length} explicit ` +
      `+ catch-all + normalisation). A shorter array means the checks below pass VACUOUSLY — they would be ` +
      `iterating over rules that are not there rather than finding nothing wrong with rules that are.`,
  );

  const violations = checkRedirectInvariants({ emitted, skipTrailingSlashRedirect });
  if (violations.length > 0) {
    console.error(`✗ Redirect invariant broken — ${violations.length} violation(s):`);
    for (const violation of violations) {
      console.error(
        `  [${violation.code}]${violation.source ? ` ${violation.source}` : ""} ${violation.message}`,
      );
    }
  }
  assert.equal(
    violations.length,
    0,
    `The legacy redirect map violates ${violations.length} invariant(s) — every one is printed above with what ` +
      `going wrong actually means. Fix the map or the config; do not weaken the checker.`,
  );

  console.log(
    `✅ Redirects OK — ${LEGACY_REDIRECTS.length} legacy entries, ${emitted.length} rules emitted; every ` +
      `destination built from ${CANONICAL_ORIGIN} and resolving into the indexable sitemap surface; no duplicate ` +
      `sources and no destination that is itself a source (no chains); the catch-all is host-gated on ` +
      `/${LEGACY_HOST_PATTERN}/ which matches both legacy hostnames and neither canonical one; the trailing-slash ` +
      `normalisation rule is LAST with skipTrailingSlashRedirect on, so every legacy URL is one hop.`,
  );
}

main();
