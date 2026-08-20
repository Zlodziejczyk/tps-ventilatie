// Live-output probe — NOT shipped runtime code.
// Intentional console.log/console.error usage and node:assert-free explicit
// reporting (it collects every violation rather than throwing on the first).
//
// Usage:  npx tsx scripts/verify-indexation.ts <https-baseUrl>
//
// WHY THIS EXISTS. The build gate reasons about DATA; this reasons about what a
// crawler actually receives. On this project a green build has already shipped
// visibly wrong output (the hero H1 once rendered as blue blocks through a
// passing build), and the indexation bug this phase fixed survived for months
// precisely because nothing ever re-ran. A manual curl checklist would have left
// no artifact. This is the artifact.
//
// WHAT IT ASSERTS (D-24), on real HTTP responses:
//   1. /sitemap.xml is 200 XML, its <loc> count EQUALS INDEXABLE_FLOOR, no duplicates
//   2. every listed URL returns a DIRECT 200 under redirect: "manual" — no hop
//   3. no served page carries a noindex directive — in the page's own
//      <meta name="robots"> (always), and in the X-Robots-Tag response header
//      (on production; see the platform-header note below)
//   4. every page's <link rel="canonical"> path equals the path just fetched
//
// It imports ONLY `INDEXABLE_FLOOR` from the app (D-25). It deliberately imports
// nothing from the taxonomy registry or the indexing-policy module — not the page
// collection, not the sitemap emitter. A probe that derived its expectation from
// the same data it validates would agree with any bug in that data. Sharing one
// constant — the definition of "complete" — is the whole point; sharing the data
// would defeat it.
//
// RUN IT AT TWO GATES (D-23): against the Vercel preview before merging, and
// against production after the merge deploys. There is no CI on this repo, so
// this is manual by design; automating it after every production deploy belongs
// to Phase 9, not here.
//
// PLATFORM-HEADER NOTE. Vercel stamps `X-Robots-Tag: noindex` onto EVERY response
// from a preview deployment — that is the platform keeping throwaway hosts out of
// Google, and it has nothing to do with this application. Enforcing the header
// check on a *.vercel.app host would therefore fail all 27 URLs on every preview
// run, making the preview gate unpassable and inviting someone to weaken the probe
// to get past it. So on a *.vercel.app host the header check is SKIPPED and
// reported as skipped, while the page's own <meta name="robots"> — the directive
// this codebase actually emits, via buildMetadata() — is enforced everywhere. On
// production both are enforced. The skip is scoped to the deployment host by
// construction, so it cannot silently apply to production.
//
// Checks 2 and 4 are deliberately broader than this phase needs: "every target a
// direct 200, one hop, self-canonical" is exactly the checklist Phase 10's
// old-domain migration requires, so it arrives already load-bearing.

import { INDEXABLE_FLOOR } from "@/lib/seo/invariants";

const CONCURRENCY = 6;

const base = process.argv[2]?.replace(/\/$/, "");
if (!base || !/^https?:\/\//.test(base)) {
  console.error("Usage: npx tsx scripts/verify-indexation.ts <https-baseUrl>");
  console.error("  e.g. npx tsx scripts/verify-indexation.ts https://www.tpsklimaattechniek.nl");
  process.exit(2);
}

// A *.vercel.app host is a preview/deployment URL, never the production domain.
const isVercelDeploymentHost = /\.vercel\.app$/i.test(new URL(base).host);

const violations: string[] = [];
function fail(message: string): void {
  violations.push(message);
}

// Sitemap <loc> values are absolute on CANONICAL_ORIGIN even on a preview
// deployment (canonicals must never point at a throwaway host). So the origin has
// to be swapped for the base being probed before fetching — WITHOUT this, running
// the probe against a preview URL would silently fetch PRODUCTION and report a
// pass for a deployment it never touched. That is the subtlest trap in this file.
function onBase(loc: string): string | null {
  try {
    return `${base}${new URL(loc).pathname}`;
  } catch {
    // A <loc> that is not a parseable URL is itself a finding. Returning null
    // rather than throwing keeps the promise of this script: report EVERY
    // violation. A throw here would reject the whole concurrent map and leave
    // the remaining URLs unchecked, so one bad entry could mask real ones.
    return null;
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(runners);
  return results;
}

// The sibling build-time scripts are transpiled to CJS, where top-level await is
// unavailable — so the probe body lives in an async main() invoked at the bottom.
async function main(): Promise<void> {
  // ── 1. Sitemap ──────────────────────────────────────────────────────────────
  const sitemapUrl = `${base}/sitemap.xml`;
  const sitemapRes = await fetch(sitemapUrl, { redirect: "manual" });
  if (sitemapRes.status !== 200) {
    const location = sitemapRes.headers.get("location");
    console.error(
      `✗ ${sitemapUrl} returned ${sitemapRes.status}` +
        (location ? ` → ${location}` : "") +
        " — cannot verify anything else." +
        (location ? " Probe the host it redirects to, not this one." : ""),
    );
    process.exit(1);
  }
  const contentType = sitemapRes.headers.get("content-type") ?? "";
  if (!/xml/i.test(contentType)) {
    fail(`sitemap content-type is "${contentType}", expected XML`);
  }

  const sitemapBody = await sitemapRes.text();
  const locs = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  if (locs.length !== INDEXABLE_FLOOR) {
    fail(
      `sitemap lists ${locs.length} URLs, expected exactly ${INDEXABLE_FLOOR}. ` +
        `FEWER means a page went dark — find what changed; do NOT lower the number to make this pass. ` +
        `MORE means something joined the index that the gate does not know about.`,
    );
  }
  const seen = new Set<string>();
  for (const loc of locs) {
    if (seen.has(loc)) fail(`duplicate sitemap entry: ${loc}`);
    seen.add(loc);
  }

  // ── 2-4. Per-URL checks ─────────────────────────────────────────────────────
  let direct200 = 0;
  let cleanIndex = 0;
  let selfCanonical = 0;
  let platformHeaderSkips = 0;

  await mapWithConcurrency(locs, CONCURRENCY, async (loc) => {
    const url = onBase(loc);
    if (url === null) {
      fail(`sitemap entry is not a parseable URL: ${loc}`);
      return;
    }
    const path = new URL(url).pathname;

    let res: Response;
    try {
      res = await fetch(url, { redirect: "manual" });
    } catch (error) {
      fail(`${path} — request failed: ${(error as Error).message}`);
      return;
    }

    // (2) Direct 200, no intermediate hop.
    if (res.status !== 200) {
      const location = res.headers.get("location");
      fail(
        `${path} — expected a direct 200, got ${res.status}` +
          (location ? ` → ${location}` : "") +
          ". A sitemap URL must resolve without a redirect.",
      );
      return;
    }
    direct200 += 1;

    // (3) No noindex. The page's own <meta name="robots"> is checked ALWAYS — that
    //     is the directive buildMetadata() emits and the thing this phase fixed. The
    //     X-Robots-Tag header is checked only off *.vercel.app, because Vercel stamps
    //     `noindex` on every preview response (see the platform-header note above).
    const xRobots = res.headers.get("x-robots-tag") ?? "";
    const html = await res.text();
    const robotsMeta = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? "";
    let dirty = false;

    if (/noindex/i.test(robotsMeta)) {
      dirty = true;
      fail(
        `${path} — the page emits noindex in its own metadata (${robotsMeta.trim()}). ` +
          `A page in the sitemap telling crawlers not to index it is the exact drift this phase removed.`,
      );
    }
    if (/noindex/i.test(xRobots)) {
      if (isVercelDeploymentHost) {
        platformHeaderSkips += 1;
      } else {
        dirty = true;
        fail(
          `${path} — serves X-Robots-Tag: ${xRobots} on the production host. ` +
            `Something outside buildMetadata() is de-indexing this page.`,
        );
      }
    }
    if (!dirty) cleanIndex += 1;

    // (4) Self-canonical, compared by PATH. On a preview deployment the canonical
    //     legitimately points at CANONICAL_ORIGIN rather than the preview host, so
    //     comparing full URLs would false-fail every single preview run.
    const canonicalHref = html.match(
      /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
    )?.[1];
    if (!canonicalHref) {
      fail(`${path} — no <link rel="canonical"> found`);
      return;
    }
    let canonicalPath: string;
    try {
      canonicalPath = new URL(canonicalHref, base).pathname;
    } catch {
      fail(`${path} — canonical href is not a valid URL: ${canonicalHref}`);
      return;
    }
    if (canonicalPath !== path) {
      fail(`${path} — canonical points at ${canonicalPath}, not at itself (${canonicalHref})`);
    } else {
      selfCanonical += 1;
    }
  });

  // ── Report ──────────────────────────────────────────────────────────────────
  if (violations.length > 0) {
    console.error(`\n✗ Indexation probe FAILED against ${base} — ${violations.length} violation(s):`);
    for (const violation of violations) {
      console.error(`  • ${violation}`);
    }
    process.exit(1);
  }

  console.log(
    `✅ Indexation verified on ${base} — ${locs.length}/${INDEXABLE_FLOOR} sitemap URLs, ` +
      `${direct200} direct 200s (no redirects), ${cleanIndex} free of any noindex directive, ` +
      `${selfCanonical} self-canonical.`,
  );
  if (platformHeaderSkips > 0) {
    console.log(
      `   note: ${platformHeaderSkips} Vercel preview X-Robots-Tag: noindex header(s) ignored — ` +
        `platform behaviour on *.vercel.app, not application output. The header IS enforced on production.`,
    );
  }
}

main().catch((error) => {
  console.error(`✗ Indexation probe crashed: ${(error as Error).message}`);
  process.exit(1);
});
