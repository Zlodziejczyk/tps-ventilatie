// Weekly indexation measurement — NOT shipped runtime code (CLI, run by GitHub Actions).
// Intentional console usage; sequential read-only API calls.
//
// Usage:  npx tsx scripts/measure-indexation.ts [--out docs/measurements/gsc] [--property sc-domain:…] [--simulate-breach]
//   env MEASURE_SIMULATE_BREACH=1 is equivalent to --simulate-breach
//   exit 0 = clean · exit 1 = one or more flags (the workflow turns this into an issue) · exit 2 = usage/auth failure
//
// THE QUESTION IT ASKS: "what did Google conclude about each URL we intend to be
// indexed?" — per URL, via the URL Inspection API (D-19): verdict, coverageState,
// indexingState, robotsTxtState, pageFetchState, lastCrawlTime and Google's chosen
// canonical vs ours, plus Google's own count of the submitted sitemap (D-10). A stuck
// page is NAMED, never bucketed.
//
// WHY IT IMPORTS sitemapEntries() — deliberately the OPPOSITE choice from
// scripts/verify-indexation.ts, which imports only the floor. That probe checks what
// we SERVE and must not share the data it validates. This script asks Google about
// exactly the pages the policy intends to be indexed, so the URL list MUST come from
// the governed collection (D-19, P8 D-05) — a hand-maintained list here would be the
// Phase 8 drift all over again. Both choices are decisions; each file says why.
//
// TWO PROBES, TWO QUESTIONS (D-23): verify-indexation.ts = "are we serving it right?";
// this = "did Google agree?". A disagreement between them is the highest-value
// signal this phase can produce — do not merge them.
//
// OUTPUT: <out>/<today UTC>.json (committed by the weekly workflow, D-21), then the
// flags from scripts/gsc/thresholds.ts against the newest earlier reading. With
// --simulate-breach nothing is written and a labelled simulated-breach flag is
// appended so the alert path can be exercised without waiting for a real breach.
// Nothing here prints the access token or the body of a failed exchange.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CANONICAL_ORIGIN } from "@/lib/constants";
import { sitemapEntries } from "@/lib/seo/policy";
import { INDEXABLE_FLOOR } from "@/lib/seo/invariants";
import { getAccessToken } from "./gsc/auth";
import { GscApiError, PROPERTY_NEW, getSitemap, inspectUrl } from "./gsc/api";
import { evaluateReading, isIndexed, rungInForce, type MeasurementFlag, type Reading, type UrlReading } from "./gsc/thresholds";

const DEFAULT_OUT = join("docs", "measurements", "gsc");
const INSPECT_SPACING_MS = 150; // 27 sequential calls vs 600/min — quota is not a concern, attribution is
const VERCEL_PROJECT_ID = "prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q";
const VERCEL_TEAM_ID = "team_YrD4rsBlATPg7g02y1QThOhg";
const VISITS_COUNT_URL = "https://api.vercel.com/v1/query/web-analytics/visits/count";

// ── CLI ──
const args = process.argv.slice(2);
let out = DEFAULT_OUT;
let property = PROPERTY_NEW;
let simulateBreach = process.env.MEASURE_SIMULATE_BREACH === "1";
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if (a === "--out") out = args[++i] ?? out;
  else if (a.startsWith("--out=")) out = a.slice(6);
  else if (a === "--property") property = args[++i] ?? property;
  else if (a.startsWith("--property=")) property = a.slice(11);
  else if (a === "--simulate-breach") simulateBreach = true;
  else {
    console.error(`Unknown argument: ${a}`);
    console.error("Usage: npx tsx scripts/measure-indexation.ts [--out <dir>] [--property <sc-domain:…>] [--simulate-breach]");
    process.exit(2);
  }
}
if (!property.startsWith("sc-domain:")) {
  console.error("Usage: --property expects a Domain property (sc-domain:<host>)");
  process.exit(2);
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function previousReading(dir: string, todayIso: string): Reading | undefined {
  if (!existsSync(dir)) return undefined;
  const earlier = readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f.slice(0, 10) < todayIso)
    .sort();
  const newest = earlier.at(-1);
  if (!newest) return undefined;
  return JSON.parse(readFileSync(join(dir, newest), "utf8")) as Reading;
}

async function visits7d(): Promise<number | undefined> {
  const apiToken = process.env.VERCEL_TOKEN;
  if (!apiToken) return undefined;
  const until = new Date();
  const since = new Date(until.getTime() - 7 * 24 * 60 * 60 * 1000);
  const url =
    `${VISITS_COUNT_URL}?projectId=${VERCEL_PROJECT_ID}&teamId=${VERCEL_TEAM_ID}` +
    `&since=${encodeURIComponent(since.toISOString())}&until=${encodeURIComponent(until.toISOString())}`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${apiToken}` } });
  if (res.status !== 200) {
    console.error(`note: Vercel visits count returned HTTP ${res.status} — analytics.visits7d omitted from this reading`);
    return undefined;
  }
  const body = (await res.json()) as Record<string, unknown>;
  const data = (typeof body.data === "object" && body.data !== null ? body.data : body) as Record<string, unknown>;
  const key = ["total", "visitors", "pageviews", "count", "devices"].find((k) => typeof data[k] === "number");
  return key ? (data[key] as number) : undefined;
}

async function main(): Promise<void> {
  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);

  // (1) The URL list — the governed collection, never a copy (D-19).
  const urls = sitemapEntries().map((entry) => entry.url);

  // (2) Token — read-only scope.
  let accessToken: string;
  try {
    accessToken = await getAccessToken();
  } catch (error) {
    console.error(`✗ auth failed: ${(error as Error).message}`);
    process.exit(2);
  }

  // (3) Inspect each URL sequentially; a per-URL error is recorded and the run continues.
  const readings: UrlReading[] = [];
  let errors = 0;
  let forbidden = 0;
  for (const url of urls) {
    try {
      const result = await inspectUrl(accessToken, property, url);
      readings.push({ url, ...result });
    } catch (error) {
      errors += 1;
      const status = error instanceof GscApiError ? error.status : 0;
      if (status === 403) forbidden += 1;
      readings.push({ url, error: status ? `HTTP ${status}` : (error as Error).message });
    }
    await sleep(INSPECT_SPACING_MS);
  }
  if (urls.length > 0 && errors === urls.length) {
    console.error(
      `✗ every inspection failed (${errors}/${urls.length}${forbidden ? `, ${forbidden}× HTTP 403` : ""}) — ` +
        `the service account is probably not a Full user on ${property} (Settings → Users and permissions)`,
    );
    process.exit(2);
  }

  // (4) Google's record of the sitemap (D-10). NEVER fatal: the 27 inspections above are
  // the expensive, perishable part of this run. A transient 5xx here used to crash main(),
  // discarding them AND raising a false indexation alert — and the missing reading then blinded
  // next week's regression check across the gap. Record the gap in the reading instead.
  let sitemap: Reading["sitemap"];
  try {
    const sitemapRaw = await getSitemap(accessToken, property, `${CANONICAL_ORIGIN}/sitemap.xml`);
    sitemap = {
      submitted: sitemapRaw.contents?.find((c) => c.type === "web")?.submitted ?? 0,
      errors: sitemapRaw.errors ?? 0,
      lastDownloaded: sitemapRaw.lastDownloaded,
    };
  } catch (error) {
    console.error(`note: sitemaps.get failed (${(error as Error).message}) — reading written without the sitemap block`);
  }

  // (5) Optional analytics count — same rule: a Vercel outage must not cost us the reading.
  const visits = await visits7d().catch((error: unknown) => {
    console.error(`note: Vercel visits count unreachable (${(error as Error).message}) — analytics omitted`);
    return undefined;
  });

  // (6) Previous reading, (7) the current one.
  const prev = previousReading(out, todayIso);
  const reading: Reading = {
    taken: now.toISOString(),
    property,
    floor: INDEXABLE_FLOOR,
    ...(sitemap !== undefined ? { sitemap } : {}),
    ...(visits !== undefined ? { analytics: { visits7d: visits } } : {}),
    urls: readings,
  };
  if (simulateBreach) {
    console.log(`simulated breach requested — no reading written (would have been ${join(out, `${todayIso}.json`)})`);
  } else {
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, `${todayIso}.json`), `${JSON.stringify(reading, null, 2)}\n`);
    console.log(`reading written: ${join(out, `${todayIso}.json`)}`);
  }

  // (8) Evaluate and report.
  const flags: MeasurementFlag[] = evaluateReading(prev, reading, todayIso);
  if (simulateBreach) {
    flags.push({
      code: "simulated-breach",
      message: `[SIMULATED] breach requested via --simulate-breach / MEASURE_SIMULATE_BREACH on ${todayIso} — this proves the alert path, nothing is wrong`,
    });
  }

  console.log("");
  console.log("| url | verdict | coverageState | lastCrawlTime | canonical ok? |");
  console.log("|---|---|---|---|---|");
  for (const u of readings) {
    const canonicalOk = u.error ? "–" : !u.googleCanonical || u.googleCanonical === u.url ? "yes" : `NO → ${u.googleCanonical}`;
    console.log(`| ${u.url} | ${u.error ?? u.verdict} | ${u.error ? "–" : u.coverageState} | ${u.lastCrawlTime ?? "–"} | ${canonicalOk} |`);
  }
  console.log("");
  for (const flag of flags) console.log(`FLAG [${flag.code}]${flag.url ? ` ${flag.url}` : ""} — ${flag.message}`);
  const indexed = readings.filter(isIndexed).length;
  const rung = rungInForce(todayIso);
  const sitemapLine = sitemap ? `sitemap submitted ${sitemap.submitted} (${sitemap.errors} errors)` : "sitemap unavailable this run";
  console.log(
    `\nindexed ${indexed}/${INDEXABLE_FLOOR}, ${sitemapLine}, ` +
      `previous reading: ${prev ? prev.taken : "none"}, ramp rung in force: ${rung ? `≥${rung.min} from week ${rung.fromWeek}` : "none yet (before week 2)"}`,
  );
  if (flags.length > 0) {
    console.error(`\n✗ ${flags.length} flag(s) — see docs/measurements/README.md for what each code means.`);
    process.exit(1);
  }
  console.log("✅ no flags");
}

main().catch((error) => {
  console.error(`✗ measurement crashed: ${(error as Error).message}`);
  process.exit(error instanceof GscApiError && (error.status === 401 || error.status === 403) ? 2 : 1);
});
