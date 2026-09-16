// Measurement-surface probe — NOT shipped runtime code.
// Intentional console.log/console.error usage; it collects EVERY violation
// before exiting, exactly like its sibling scripts/verify-indexation.ts.
//
// Usage:  npx tsx scripts/verify-measurement.ts <https-baseUrl>
//   e.g.  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<public token> \
//           npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl
//   optional: VERCEL_TOKEN=<short-lived token> adds the machine proof that Web
//             Analytics is REPORTING (check 5). Never commit that token anywhere.
//
// TWO QUESTIONS, TWO PROBES (D-23). verify-indexation.ts asks "are we SERVING the
// 27 pages right?". This script asks "is the MEASUREMENT surface intact?" — the
// things Phase 9 put in place so the milestone can be proven (D-04): ownership
// tokens in DNS, the served verification tag, the sitemap Google was told about,
// and the analytics collection. Keep them separate; a disagreement between the
// two is itself the most valuable signal either can produce.
//
// WHAT IT ASSERTS, on live DNS and HTTP:
//   1. both zones carry a `google-site-verification=` TXT record (D-05). The
//      legacy record is a FOREVER requirement (D-07): the Change of Address runs
//      from that property and Google re-checks ownership periodically, so a
//      missing record here is a failure — never a cleanup — long after Phase 10.
//   2. the served home page carries EXACTLY ONE <meta name="google-site-verification">
//      inside <head> (D-08 — the seam that looked live and was not), equal to
//      NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION when that variable is set
//   3. /sitemap.xml is 200 XML with exactly INDEXABLE_FLOOR <loc> entries (D-10)
//   4. /_vercel/insights/script.js and /_vercel/speed-insights/script.js answer
//      200 as JavaScript — reported as NECESSARY, NOT SUFFICIENT: the platform
//      serves both even while analytics is disabled (RESEARCH §Pitfall 1)
//   5. [VERCEL_TOKEN only] the Web Analytics visits count for the last 7 days is
//      positive — the sufficient proof of MEAS-06. Without the token the check is
//      printed as SKIPPED and is NOT counted as passed.
//
// WHEN TO RUN: after any DNS, environment-variable or analytics change; at the
// 09-06 completeness gate; and whenever anyone proposes to "tidy" a DNS zone.
//
// It imports ONLY `INDEXABLE_FLOOR` from the app (P8 D-25) — never the page
// collection or the policy module, for the same reason verify-indexation.ts
// does not: a probe that reads its expectation from the data it checks agrees
// with any bug in that data.

import { resolveTxt } from "node:dns/promises";
import { INDEXABLE_FLOOR } from "@/lib/seo/invariants";

// The two zones that must carry ownership tokens (D-05, D-07).
const ZONES = ["tpsklimaattechniek.nl", "tpsventilatie.nl"] as const;
// Vercel project / team ids (from .vercel/project.json) for the optional count.
const VERCEL_PROJECT_ID = "prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q";
const VERCEL_TEAM_ID = "team_YrD4rsBlATPg7g02y1QThOhg";
const VISITS_COUNT_URL = "https://api.vercel.com/v1/query/web-analytics/visits/count";

const base = process.argv[2]?.replace(/\/$/, "");
if (!base || !/^https?:\/\//.test(base)) {
  console.error("Usage: npx tsx scripts/verify-measurement.ts <https-baseUrl>");
  console.error("  e.g. npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl");
  process.exit(2);
}

const violations: string[] = [];
const notes: string[] = [];
function fail(message: string): void {
  violations.push(message);
}

async function checkDnsTokens(): Promise<number> {
  let found = 0;
  for (const zone of ZONES) {
    let records: string[][];
    try {
      records = await resolveTxt(zone);
    } catch (error) {
      fail(`${zone} — TXT lookup failed: ${(error as Error).message}`);
      continue;
    }
    const joined = records.map((chunks) => chunks.join(""));
    if (joined.some((txt) => txt.startsWith("google-site-verification="))) {
      found += 1;
    } else {
      fail(
        `${zone} — no google-site-verification TXT record. ` +
          (zone === "tpsventilatie.nl"
            ? "This record must NEVER be removed (D-07): the legacy property and its Change of Address depend on it."
            : "The Domain property tpsklimaattechniek.nl silently loses verification without it."),
      );
    }
  }
  return found;
}

async function checkServedMetaTag(): Promise<void> {
  const res = await fetch(`${base}/`, { redirect: "manual" });
  if (res.status !== 200) {
    fail(`${base}/ returned ${res.status} — expected a direct 200 on the canonical host`);
    return;
  }
  const html = await res.text();
  const headEnd = html.search(/<\/head>/i);
  const head = headEnd >= 0 ? html.slice(0, headEnd) : "";
  const tags = [...head.matchAll(/<meta[^>]+name=["']google-site-verification["'][^>]*>/gi)].map((m) => m[0]);
  if (headEnd < 0) fail(`${base}/ — no </head> found in the served HTML`);
  if (tags.length !== 1) {
    fail(
      `${base}/ serves ${tags.length} google-site-verification meta tag(s) inside <head>, expected exactly 1 ` +
        (tags.length === 0
          ? "— NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is unset in the production build (a new build is required after setting it, D-08)"
          : "— duplicate tags mean two sources emit it"),
    );
    return;
  }
  const content = tags[0].match(/content=["']([^"']*)["']/i)?.[1] ?? "";
  const expected = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  if (!content) fail(`${base}/ — the google-site-verification meta tag has an empty content attribute`);
  else if (expected && content !== expected) {
    fail(`${base}/ — served verification content differs from NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in this environment`);
  } else if (!expected) {
    notes.push("meta tag content not compared (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION not set in this shell)");
  }
}

async function checkSitemapFloor(): Promise<number> {
  const res = await fetch(`${base}/sitemap.xml`, { redirect: "manual" });
  if (res.status !== 200) {
    fail(`${base}/sitemap.xml returned ${res.status}, expected 200`);
    return 0;
  }
  const contentType = res.headers.get("content-type") ?? "";
  if (!/xml/i.test(contentType)) fail(`sitemap content-type is "${contentType}", expected XML`);
  const body = await res.text();
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (locs.length !== INDEXABLE_FLOOR) {
    fail(
      `sitemap lists ${locs.length} URLs, expected exactly ${INDEXABLE_FLOOR}. FEWER means a page went dark — ` +
        `find what changed; do NOT lower the number to make this pass. MORE means something joined the index the gate does not know about.`,
    );
  }
  return locs.length;
}

async function checkAnalyticsScripts(): Promise<void> {
  for (const path of ["/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"]) {
    const res = await fetch(`${base}${path}`, { redirect: "manual" });
    const contentType = res.headers.get("content-type") ?? "";
    if (res.status !== 200) fail(`${path} returned ${res.status}, expected 200 (Vercel serves it once analytics routes exist)`);
    else if (!/javascript/i.test(contentType)) fail(`${path} is served as "${contentType}", expected a JavaScript content-type`);
  }
  notes.push("analytics script endpoints answer 200 — necessary, NOT sufficient (the platform serves them even when collection is off)");
}

async function checkVisitsCount(): Promise<boolean> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    const skipNote =
      "note: Vercel visits count SKIPPED (set VERCEL_TOKEN for the machine proof) — analytics \"reporting\" was evidenced via MCP/browser in 09-03";
    console.log(skipNote);
    return false;
  }
  const until = new Date();
  const since = new Date(until.getTime() - 7 * 24 * 60 * 60 * 1000);
  const url =
    `${VISITS_COUNT_URL}?projectId=${VERCEL_PROJECT_ID}&teamId=${VERCEL_TEAM_ID}` +
    `&since=${encodeURIComponent(since.toISOString())}&until=${encodeURIComponent(until.toISOString())}`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (res.status !== 200) {
    fail(`Vercel visits count returned HTTP ${res.status} — analytics is not reporting, or the API token lacks access to the project`);
    return true;
  }
  const body = (await res.json()) as Record<string, unknown>;
  const data = (typeof body.data === "object" && body.data !== null ? body.data : body) as Record<string, unknown>;
  const candidate = ["total", "visitors", "pageviews", "count", "devices"].find((k) => typeof data[k] === "number");
  if (!candidate) {
    fail(`Vercel visits count: no numeric total in the response — shape was keys(${Object.keys(body).join(",")}) / data keys(${Object.keys(data).join(",")})`);
    return true;
  }
  const total = data[candidate] as number;
  if (total <= 0) fail(`Vercel visits count (${candidate}) is ${total} for the last 7 days — analytics is enabled but not reporting live traffic`);
  else notes.push(`Vercel visits count: ${candidate} = ${total} in the last 7 days (analytics IS reporting)`);
  return true;
}

async function main(): Promise<void> {
  const zonesWithToken = await checkDnsTokens();
  await checkServedMetaTag();
  const locCount = await checkSitemapFloor();
  await checkAnalyticsScripts();
  const counted = await checkVisitsCount();

  if (violations.length > 0) {
    console.error(`\n✗ Measurement probe FAILED against ${base} — ${violations.length} violation(s):`);
    for (const violation of violations) console.error(`  • ${violation}`);
    process.exit(1);
  }
  console.log(
    `✅ Measurement surface verified on ${base} — TXT ownership records on ${zonesWithToken}/${ZONES.length} zones, ` +
      `verification meta tag served once, sitemap ${locCount}/${INDEXABLE_FLOOR}, analytics scripts 200` +
      (counted ? ", visits count checked." : " (visits count skipped)."),
  );
  for (const note of notes) console.log(`   note: ${note}`);
}

main().catch((error) => {
  console.error(`✗ Measurement probe crashed: ${(error as Error).message}`);
  process.exit(1);
});
