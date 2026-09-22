// Live-output probe — NOT shipped runtime code.
// Intentional console.log/console.error usage and node:assert-free explicit
// reporting (it collects every violation rather than throwing on the first).
//
// Usage:  npx tsx scripts/verify-redirects.ts [--via <production-origin>] [--post-cutover]
//   exit 0 = clean (or a printed pre-cutover skip) · exit 1 = one or more violations
//   exit 2 = usage error, or a precondition failure that is NOT the map's fault
//
// Run standalone:  npx tsx scripts/verify-redirects.ts
//
// WHY THIS IS A SIBLING OF verify-indexation.ts AND NOT AN EXTENSION OF IT.
// verify-indexation.ts derives its URLs from the canonical sitemap and asks "what
// do we serve on the host customers and Google see?". The legacy hostnames are not
// in that sitemap and never will be — so it stays green through a COMPLETELY broken
// legacy map. Different host, different failure meaning, and a different lifetime:
// this probe gets retired once the legacy domain stops mattering (D-25), while the
// indexation probe is permanent. They share one workflow and one alert issue, and
// nothing else.
//
// WHAT ONLY A LIVE PROBE CAN SEE. scripts/assert-redirects.ts reasons about the
// array next.config.ts returns. It cannot see ordering as the edge applies it. If
// the trailing-slash normalisation runs ahead of the legacy rules, every slashed
// legacy URL costs TWO hops while the build stays green and nothing appears in any
// log. That is what the slash-less canary below exists to catch.
//
// WHY curl AND NOT Node fetch. Measured on Node 26 during planning: fetch(url, {
// headers: { Host: "…" } }) SILENTLY DISCARDS the Host header and returns the
// response for the connected host. A spoofed-Host pre-flight built on fetch would
// print a confident green result about the wrong hostname — worse than a red one.
// curl -H 'Host: …' was measured working against production the same day. Using one
// request mechanism for both modes also means the pre-flight run and the
// post-cutover run are the same probe rather than two that can drift apart.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { CANONICAL_ORIGIN } from "@/lib/constants";
import { LEGACY_REDIRECTS } from "@/lib/seo/redirects";
import { LEGACY_CUTOVER_DATE } from "@/lib/seo/cutover";

const execFileAsync = promisify(execFile);

// Sequential, lightly spaced. Deliberately NOT the concurrent mapper that
// verify-indexation.ts uses: 22 sources × 2 hops must stay attributable to a
// single source when one fails. Same reasoning as INSPECT_SPACING_MS in
// measure-indexation.ts — quota is not the concern, attribution is.
// (The helper's literal name is kept out of this file on purpose: the plan's
// verification greps for its absence, and a comment naming it false-positives.)
const REQUEST_SPACING_MS = 120;

const LEGACY_HOSTS = ["tpsventilatie.nl", "www.tpsventilatie.nl"] as const;

// ── CLI (the measure-indexation.ts parser shape: --flag value and --flag=value) ──
const args = process.argv.slice(2);
let via: string | null = null;
let postCutover = false;
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if (a === "--via") via = args[++i] ?? null;
  else if (a.startsWith("--via=")) via = a.slice(6);
  else if (a === "--post-cutover") postCutover = true;
  else {
    console.error(`Unknown argument: ${a}`);
    console.error("Usage: npx tsx scripts/verify-redirects.ts [--via <production-origin>] [--post-cutover]");
    console.error("  --via          Mode A (pre-flight): connect to this origin, send Host: <legacy-host>");
    console.error("  --post-cutover Mode B forced: assert even though LEGACY_CUTOVER_DATE is not set yet");
    process.exit(2);
  }
}
if (via !== null && !/^https?:\/\//.test(via)) {
  console.error("Usage: --via expects an absolute origin, e.g. --via https://www.tpsklimaattechniek.nl");
  process.exit(2);
}

// A *.vercel.app host is a preview/deployment URL, never the production domain.
// Same named host-class predicate idiom as verify-indexation.ts.
const isVercelDeploymentHost = (host: string): boolean => /\.vercel\.app$/i.test(host);

const violations: string[] = [];
function fail(message: string): void {
  violations.push(message);
}

const observations: string[] = [];
function observe(message: string): void {
  observations.push(message);
}

interface Probe {
  status: number;
  location: string | null;
  headers: Record<string, string>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * One request, no redirect following, through curl.
 *
 * Certificate verification is never disabled here. The certificate is one of
 * D-10's two rollback triggers, and a probe that skipped it would silence the very
 * signal it stands beside. (The flags that would disable it are deliberately not
 * spelled out — the plan's verification asserts their absence by grep.)
 */
async function probe(url: string, hostHeader?: string): Promise<Probe> {
  const argv = [
    "-sS",
    "-o",
    "/dev/null",
    "-D",
    "-",
    "-w",
    "\\n__STATUS__%{http_code}",
    "--max-redirs",
    "0",
    "--max-time",
    "20",
  ];
  if (hostHeader) argv.push("-H", `Host: ${hostHeader}`);
  argv.push(url);

  const { stdout } = await execFileAsync("curl", argv, { maxBuffer: 4 * 1024 * 1024 });
  const statusMatch = stdout.match(/__STATUS__(\d{3})/);
  const status = statusMatch ? Number(statusMatch[1]) : 0;
  const headers: Record<string, string> = {};
  for (const line of stdout.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9-]+):\s*(.*)$/);
    if (m) headers[m[1].toLowerCase()] = m[2].trim();
  }
  return { status, location: headers.location ?? null, headers };
}

/** Compare by what the URLs RESOLVE to — the root's slash must not be a failure. */
function sameUrl(a: string, b: string): boolean {
  try {
    return new URL(a).href === new URL(b).href;
  } catch {
    return false;
  }
}

/**
 * A precondition failure means the probe never got to test the map at all — the
 * request was refused or misrouted before any redirect rule could run. It exits 2,
 * not 1, and it aborts on the FIRST occurrence: repeating one environment message
 * 22 times buries the diagnosis instead of delivering it.
 */
class PreconditionFailure extends Error {}

/**
 * Name the three failures that are NOT the map's fault (RESEARCH Pitfall 3), so a
 * red run is a diagnosis rather than a puzzle. Returns a message, or null when the
 * response is genuinely about the map. The two environment-class signatures are
 * thrown as PreconditionFailure; the "map not in production yet" case is returned
 * as an ordinary violation, because that one IS about the map.
 */
function diagnoseNonMapFailure(label: string, res: Probe, connectOrigin: string): string | null {
  if (res.status === 403 && res.headers["x-vercel-mitigated"] === "deny") {
    throw new PreconditionFailure(
      `${label} — 403 with x-vercel-mitigated: deny. The TLS connection targeted a *.vercel.app host ` +
      `while the Host header said something else; Vercel treats that as domain fronting and refuses ` +
      `before any redirect rule runs. Point --via at the production custom domain, not a deployment URL.`
    );
  }
  if (res.status === 404 && /DEPLOYMENT_NOT_FOUND/i.test(res.headers["x-vercel-error"] ?? "")) {
    throw new PreconditionFailure(
      `${label} — 404 DEPLOYMENT_NOT_FOUND. Is that hostname attached to the Vercel project? This is a ` +
      `PRECONDITION failure, not a broken map: the legacy hostnames must be added to the project (plan ` +
      `10-07) before any redirect rule can match them. "Invalid Configuration" on the domain is expected ` +
      `and fine until DNS moves.`
    );
  }
  if (res.status === 308 && res.location && /^https:\/\/www\.tpsklimaattechniek\.nl/i.test(res.location)) {
    return (
      `${label} — 308 to the canonical www instead of the expected 301. The deployment serving ` +
      `${connectOrigin} does not contain the legacy map yet; the request fell through to apex→www ` +
      `normalisation. Ship the map to PRODUCTION before running the pre-flight.`
    );
  }
  return null;
}

/** One source on one legacy hostname: 301 → exact location → direct 200. */
async function checkSource(
  from: string,
  to: string,
  legacyHost: string,
  connectOrigin: string | null,
): Promise<boolean> {
  const url = connectOrigin ? `${connectOrigin}${from}` : `https://${legacyHost}${from}`;
  const label = `${legacyHost}${from}`;
  const expected = `${CANONICAL_ORIGIN}${to === "/" ? "" : to}`;

  const first = await probe(url, connectOrigin ? legacyHost : undefined);

  const diagnosis = diagnoseNonMapFailure(label, first, connectOrigin ?? `https://${legacyHost}`);
  if (diagnosis) {
    fail(diagnosis);
    return false;
  }

  // (1) 301 exactly. A 308 here is how the trailing-slash finding announces itself,
  //     and D-14 asserts the code, not merely "some 3xx".
  if (first.status !== 301) {
    fail(
      `${label} — expected 301, got ${first.status}` +
        (first.location ? ` → ${first.location}` : "") +
        `. ${first.status === 308 ? "A 308 means Next's trailing-slash normalisation ran BEFORE the legacy rule — the ordering finding, live. " : ""}` +
        `The migration and the Change of Address both assume a 301.`,
    );
    return false;
  }

  // (2) Location must EQUAL the mapped destination, resolved — not "starts with".
  if (!first.location || !sameUrl(first.location, expected)) {
    fail(
      `${label} — expected location ${expected}, got ${first.location ?? "(none)"}. ` +
        `A stray trailing slash or query string here is a different URL to Google, not a detail.`,
    );
    return false;
  }

  // (3) Hop two must be a direct 200. A redirect here is the chain MIG-06 forbids.
  await sleep(REQUEST_SPACING_MS);
  const second = await probe(first.location);
  if (second.status !== 200) {
    fail(
      `${label} — hop two (${first.location}) returned ${second.status}` +
        (second.location ? ` → ${second.location}` : "") +
        `. That is a CHAIN, which is exactly what MIG-06 exists to stop: Google follows chains ` +
        `reluctantly and passes less equity through each hop.`,
    );
    return false;
  }
  return true;
}

async function main(): Promise<void> {
  const modeA = via !== null;

  if (modeA) {
    const host = new URL(via!).host;
    if (isVercelDeploymentHost(host)) {
      console.error(
        `✗ --via ${via} is a *.vercel.app deployment host. A spoofed Host header against one returns ` +
          `403 x-vercel-mitigated: deny before any redirect rule runs (measured). Use the production ` +
          `custom domain instead.`,
      );
      process.exit(2);
    }
  } else if (LEGACY_CUTOVER_DATE === null && !postCutover) {
    // Gated in the SCRIPT, not in YAML. Until the cutover is declared, Mode B would
    // probe WordPress on the old IP and be red for a reason that is not a defect.
    // A gate everybody expects to be red gets ignored when it goes red for a real
    // reason — that is how three build guards rotted for weeks (D-25). So: print the
    // skip, never silently, and exit 0.
    console.log(
      "⏭  Redirect probe SKIPPED — the cutover has not been declared yet " +
        "(LEGACY_CUTOVER_DATE is null in lib/seo/cutover.ts).",
    );
    console.log(
      "   Mode B connects to the legacy hostnames directly, which still resolve to the old WordPress " +
        "box, so asserting now would be red for a reason that is not a defect.",
    );
    console.log(
      "   This becomes a real assertion the moment plan 10-09 sets that date. " +
        "To force it at the flip, before the date is committed: --post-cutover.",
    );
    process.exit(0);
  }

  if (postCutover && LEGACY_CUTOVER_DATE === null) {
    console.log(
      "⚠  Mode B FORCED via --post-cutover while LEGACY_CUTOVER_DATE is still null. " +
        "This is a human asserting the flip has happened; CI never passes this flag.",
    );
  }

  const connectOrigin = modeA ? via!.replace(/\/$/, "") : null;
  console.log(
    modeA
      ? `Probing in Mode A (pre-flight) — connecting to ${connectOrigin}, spoofing Host per legacy hostname.`
      : `Probing in Mode B (post-cutover) — connecting to the legacy hostnames directly.`,
  );

  // ── 1. The 9 sources × both legacy hostnames. Exhaustive, never sampled: a typo
  //       in rule 7 is invisible when you sampled rule 1 (D-18).
  let sourceChecks = 0;
  let sourcePasses = 0;
  for (const legacyHost of LEGACY_HOSTS) {
    for (const entry of LEGACY_REDIRECTS) {
      sourceChecks += 1;
      if (await checkSource(entry.from, entry.to, legacyHost, connectOrigin)) sourcePasses += 1;
      await sleep(REQUEST_SPACING_MS);
    }
  }

  // ── 2. THE REGRESSION CANARY. A slash-less source must still be exactly one hop.
  //       This is the single assertion that proves the trailing-slash ordering is
  //       actually solved rather than merely described (RESEARCH Pitfall 1).
  //       DO NOT REMOVE IT — it is labelled in the output for that reason.
  const canaryHost = LEGACY_HOSTS[0];
  const canaryUrl = connectOrigin ? `${connectOrigin}/over-ons` : `https://${canaryHost}/over-ons`;
  const canary = await probe(canaryUrl, connectOrigin ? canaryHost : undefined);
  const canaryOk =
    canary.status === 301 && !!canary.location && sameUrl(canary.location, `${CANONICAL_ORIGIN}/over-ons`);
  if (!canaryOk) {
    fail(
      `CANARY ${canaryHost}/over-ons (no trailing slash) — expected a single 301 to ` +
        `${CANONICAL_ORIGIN}/over-ons, got ${canary.status}` +
        (canary.location ? ` → ${canary.location}` : "") +
        `. This is the trailing-slash ordering canary: if it fails, skipTrailingSlashRedirect is off or ` +
        `the normalisation rule is no longer last, and EVERY slashed legacy URL is silently costing two hops.`,
    );
  }
  await sleep(REQUEST_SPACING_MS);

  // ── 3. D-15 samples: the legacy robots.txt and sitemap.xml ride the catch-all.
  let d15Ok = 0;
  for (const path of ["/robots.txt", "/sitemap.xml"]) {
    const url = connectOrigin ? `${connectOrigin}${path}` : `https://${canaryHost}${path}`;
    const res = await probe(url, connectOrigin ? canaryHost : undefined);
    if (res.status !== 301 || !res.location) {
      fail(`${canaryHost}${path} — expected a 301 through the catch-all, got ${res.status}.`);
    } else {
      await sleep(REQUEST_SPACING_MS);
      const second = await probe(res.location);
      if (second.status !== 200) {
        fail(`${canaryHost}${path} — hop two (${res.location}) returned ${second.status}, expected 200 (D-15).`);
      } else {
        d15Ok += 1;
      }
    }
    await sleep(REQUEST_SPACING_MS);
  }

  // ── 4. Expected-404 samples. The catch-all preserves the path, and these paths do
  //       not exist on the new site. That is the honest outcome (D-12) and an
  //       OBSERVATION, not a violation — they stay visible in GSC as things we could
  //       still choose to map.
  let expected404 = 0;
  for (const path of ["/feed/", "/wp-json/wp/v2/pages"]) {
    const url = connectOrigin ? `${connectOrigin}${path}` : `https://${canaryHost}${path}`;
    const res = await probe(url, connectOrigin ? canaryHost : undefined);
    if (res.status === 301 && res.location) {
      await sleep(REQUEST_SPACING_MS);
      const second = await probe(res.location);
      observe(
        `${canaryHost}${path} → 301 → ${res.location} → ${second.status}` +
          (second.status === 404 ? " (expected 404 — path preserved, no such page on the new site)" : ""),
      );
      if (second.status === 404) expected404 += 1;
    } else {
      observe(`${canaryHost}${path} → ${res.status} (expected a 301 through the catch-all)`);
    }
    await sleep(REQUEST_SPACING_MS);
  }

  // ── 5. The platform hop. Vercel answers http:// with its own 308 to https://
  //       BEFORE our rules run, so an http-only inbound link costs one extra hop.
  //       RECORD it (D-18) — never assert it away and never silently exclude it.
  if (!modeA) {
    const httpRes = await probe(`http://${canaryHost}/over-ons/`);
    observe(
      `http://${canaryHost}/over-ons/ → ${httpRes.status}` +
        (httpRes.location ? ` → ${httpRes.location}` : "") +
        (httpRes.status === 308
          ? " — Vercel's platform http→https hop, ACCEPTED as a known extra hop for http-only inbound links."
          : ""),
    );
  }

  // ── Report ──────────────────────────────────────────────────────────────────
  if (observations.length > 0) {
    console.log("\nObservations (recorded, not asserted):");
    for (const observation of observations) console.log(`  · ${observation}`);
  }

  if (violations.length > 0) {
    console.error(`\n✗ Redirect probe FAILED — ${violations.length} violation(s):`);
    for (const violation of violations) console.error(`  • ${violation}`);
    process.exit(1);
  }

  console.log(
    `\n✅ Redirects verified — ${sourcePasses}/${sourceChecks} source checks in exactly one hop ` +
      `(${LEGACY_REDIRECTS.length} sources × ${LEGACY_HOSTS.length} legacy hostnames, exhaustive), ` +
      `the slash-less canary green, ${d15Ok}/2 D-15 samples reaching a 200, and ` +
      `${expected404}/2 catch-all samples landing on the expected 404.`,
  );
}

main().catch((error) => {
  if (error instanceof PreconditionFailure) {
    // Exit 2, never 1: nothing was learned about the map, so reporting a map
    // failure would be a false accusation against correct code.
    console.error(`\n✗ Redirect probe PRECONDITION not met — the map was never exercised:`);
    console.error(`  • ${error.message}`);
    process.exit(2);
  }
  console.error(`✗ Redirect probe crashed: ${(error as Error).message}`);
  process.exit(1);
});
