// Build-time CLI — the D-13 anti-claim gate, chained into prebuild after
// validate-taxonomy (package.json: "prebuild": "tsx scripts/validate-taxonomy.ts
// && tsx scripts/assert-no-forbidden-claims.ts"). npm runs this BEFORE
// `next build`; a non-zero exit aborts the build, so a forbidden YMYL claim that
// reaches a review/published node is genuinely build-blocking on Vercel CI.
//
// console.log / console.error / process.exit are INTENTIONAL and correct here —
// this is a build-time CLI, NOT shipped runtime code (the no-console-in-
// production rule does not apply). The script imports only @/lib/services/registry
// and prints to stdout/stderr — no fs writes, no network (tight boundary, same as
// validate-taxonomy.ts / assert-seo.ts).
//
// Run on demand:  npx tsx scripts/assert-no-forbidden-claims.ts
//
// What it locks (the D-13 locked anti-claim list — see docs/anti-claim-checklist.md
// for the nuance a regex cannot catch, e.g. the per-pillar subsidie rule): the
// serialized `content` of every review/published node must NOT contain a forbidden
// YMYL literal. The exact matchable phrases live ONLY in the regex sources below
// (never in comments or plain strings) so this file can never false-positive on
// itself. NOTE: the "erkend installateur" + "gecertificeerd" patterns were removed
// 2026-06-28 once the owner verified the claims (intake §5 + Pushly editorial
// sign-off); only the BE-VAT trap stays locked here (RESEARCH A2 / D-02).

import { PAGES } from "@/lib/services/registry";

// Forbidden literals — the matchable phrase appears ONLY inside `pattern`.
// `why` is a plain-language reason (deliberately free of the matchable phrase).
const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  {
    pattern: /\b6\s*%\s*btw/i,
    why: "Belgian reduced VAT rate (BE-only, from 2026) — never applies in NL, which is 21% (D-13/CONT-05)",
  },
  // The "erkend installateur" + "gecertificeerd" patterns were REMOVED 2026-06-28:
  // the owner verified both (intake §5 + Pushly editorial sign-off), so these claims
  // are now sayable site-wide. Only the BE-VAT trap stays locked.
  // The airco-pillar subsidie trap (airco must mention NO ISDE/subsidie) is
  // best caught per-node by the human checklist, not a blanket regex — see
  // docs/anti-claim-checklist.md §2.
];

let failed = false;

for (const node of PAGES) {
  // Only gate review/published — draft shells may legitimately hold WIP text.
  if (node.status === "draft") continue;

  const blob = JSON.stringify(node.content).toLowerCase();
  for (const { pattern, why } of FORBIDDEN) {
    if (pattern.test(blob)) {
      console.error(`❌ ${node.primaryKeyword}: ${why}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\n✗ Forbidden-claim gate failed — aborting build (D-13).");
  process.exit(1);
}

console.log(
  `✅ No forbidden claims — ${PAGES.length} pages scanned (review/published content clean).`,
);
process.exit(0);
