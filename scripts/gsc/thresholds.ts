// Indexation thresholds — a PURE evaluator, NOT shipped runtime code.
//
// Turns two weekly readings (previous, current) into named flags (D-20). No I/O,
// no clock, no network: the "today" date and both readings are injected, so a
// tsx -e proof can feed fabricated readings and watch each flag fire — the Phase 8
// habit (lib/seo/invariants.ts): a gate that has never been observed failing has
// not been shown to work. scripts/measure-indexation.ts is the only caller.
//
// Every constant states its derivation; every threshold is a FLOOR, never an
// exact count; every flag names the URL when there is one. If a run flags and the
// instinct is to lower a rung, that is the moment to find out which page is stuck.

import type { IndexStatusResult } from "./api";
import { LEGACY_CUTOVER_DATE } from "@/lib/seo/cutover";
import { LEGACY_HOST_PATTERN } from "@/lib/seo/redirects";

// One inspected URL. Either Google's index status (from urlInspection) or the
// error that prevented the inspection — never both.
export interface UrlReading extends Partial<IndexStatusResult> {
  url: string;
  error?: string;
}

export interface Reading {
  taken: string; // ISO timestamp of the run
  property: string; // sc-domain:…
  floor: number; // INDEXABLE_FLOOR at the time of the run
  urls: UrlReading[];
  sitemap?: { submitted: number; errors: number; lastDownloaded?: string };
  analytics?: { visits7d: number };
  // OPTIONAL, and that is load-bearing: every reading committed in 2026-09 predates the
  // legacy section and must stay parseable. Absent means "not measured" — a GAP, never a
  // zero. evaluateReading refuses to flag on a missing block for exactly that reason.
  legacy?: LegacyBlock;
}

/** The retired property's side of a weekly reading (D-25). */
export interface LegacyBlock {
  property: string; // sc-domain:… of the LEGACY property
  impressions28d: number;
  clicks28d: number;
  /** Consecutive readings with zero impressions, carried IN the reading so the history is
   *  auditable in git rather than recomputed from a directory scan. See nextZeroStreak(). */
  zeroStreak?: number;
  urls: LegacyUrlReading[];
}

export interface LegacyUrlReading {
  url: string;
  verdict?: string;
  coverageState?: string;
  googleCanonical?: string;
  /** The late coverage for the HTTP watch D-19 declined: a detached Vercel domain or a
   *  lapsed certificate surfaces here as SERVER_ERROR / ACCESS_DENIED / REDIRECT_ERROR. */
  pageFetchState?: string;
  error?: string;
}

export type FlagCode =
  | "below-ramp"
  | "lost-indexation"
  | "robots-not-allowed"
  | "canonical-mismatch"
  | "count-vs-floor"
  | "simulated-breach"
  | "legacy-canonical-not-moved"
  | "legacy-traffic-zero";

export interface MeasurementFlag {
  code: FlagCode;
  url?: string;
  message: string;
}

// The date the sitemap was submitted AND processed by Google at 27 URLs (D-10) —
// the moment Google was told the pages exist. "Week N" everywhere below means N
// weeks after this date.
export const RAMP_ANCHOR = "2026-09-16";

// D-20's calendar ramp, as FLOORS: from week 2 at least 10 of the 27 must be
// indexed, from week 4 at least 20, from week 8 at least 25. A shortfall does not
// mean the rung is wrong; it means pages are stuck — find which ones.
export const RAMP: readonly { fromWeek: number; min: number }[] = [
  { fromWeek: 2, min: 10 },
  { fromWeek: 4, min: 20 },
  { fromWeek: 8, min: 25 },
];

// Google's lag after a domain move is WEEKS, not days. A consolidation reading taken one
// week after the flip shows nothing and would be read as failure by whoever opens the issue,
// so the flag deliberately does not speak before week 8. Weeks are counted from the single
// declared cutover date (lib/seo/cutover.ts) — when the cutover has not been declared, no
// legacy week has elapsed and this flag cannot fire at all.
// Raising this to silence a flag hides a stuck URL; the URL is named for a reason.
export const LEGACY_CONSOLIDATION_WEEK = 8;

// Four weekly readings of zero, layered on the 28-day lookback each reading already uses,
// is roughly two months of genuine silence. One or two weeks would fire on ordinary seasonal
// noise for a nine-page local-services site whose baseline is 130 query rows over 16 months.
//
// THIS FLAG IS NOT AN AUTHORISATION. Retiring the redirect map is a separate decision and
// never happens before the 180-day floor Google requires for a Change of Address. The flag
// opens a conversation; it does not grant permission.
export const LEGACY_ZERO_WEEKS = 4;

// Same anchored alternation Next.js compiles for the redirect host gate, reused rather than
// re-typed: a second copy of the legacy hostname would drift from the map and would agree
// with any bug. Matches http(s)://tpsventilatie.nl/… and the www form, nothing else.
const LEGACY_HOST_RE = new RegExp(`^https?://${LEGACY_HOST_PATTERN}(/|$)`, "i");

/** True when Google's chosen canonical is still an address on the retired domain. */
export function isOnLegacyHost(url: string): boolean {
  return LEGACY_HOST_RE.test(url);
}

// The streak lives in the reading, so define its transition ONCE here and let the collector
// call it. Zero impressions extends the streak (a reading with no recorded streak counts as
// the first); any impression at all resets it to 0.
export function nextZeroStreak(prev: Reading | undefined, impressions28d: number): number {
  if (impressions28d !== 0) return 0;
  return prev?.legacy?.impressions28d === 0 ? (prev.legacy.zeroStreak ?? 1) + 1 : 1;
}

// Google's "URL is on Google" is verdict PASS. coverageState is free text and is
// never matched on.
export function isIndexed(reading: UrlReading): boolean {
  return reading.verdict === "PASS";
}

function utcDays(iso: string): number {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

// Whole weeks between the anchor and "today" (floor of days / 7); negative dates
// before the anchor count as week 0.
export function weeksSince(anchorIso: string, todayIso: string): number {
  const days = utcDays(todayIso) - utcDays(anchorIso);
  return Math.max(0, Math.floor(days / 7));
}

// The strictest rung already in force on the given day, or undefined before week 2.
export function rungInForce(todayIso: string): { fromWeek: number; min: number } | undefined {
  const weeks = weeksSince(RAMP_ANCHOR, todayIso);
  return RAMP.filter((rung) => rung.fromWeek <= weeks).at(-1);
}

// Evaluate one reading. Flags are appended, never early-returned: a red run must
// report ALL the damage. `prev` is the newest earlier reading, if any.
export function evaluateReading(
  prev: Reading | undefined,
  curr: Reading,
  todayIso: string,
  // Injectable for the same reason checkRedirectInvariants takes options: a flag that has
  // never been observed firing has not been shown to work, and the real cutover date is
  // null until plan 10-09. Production passes nothing.
  opts: { legacyCutoverDate?: string | null } = {},
): MeasurementFlag[] {
  const flags: MeasurementFlag[] = [];

  // (1) The URL list must be the whole surface (D-19: it comes from sitemapEntries()).
  if (curr.urls.length !== curr.floor) {
    flags.push({
      code: "count-vs-floor",
      message: `reading covers ${curr.urls.length} URLs but the floor is ${curr.floor} — the sitemap surface and INDEXABLE_FLOOR disagree; that is a finding, not a number to edit`,
    });
  }

  // (2) Calendar ramp — a floor for the rung in force today.
  const indexedCount = curr.urls.filter(isIndexed).length;
  const rung = rungInForce(todayIso);
  if (rung && indexedCount < rung.min) {
    flags.push({
      code: "below-ramp",
      message: `only ${indexedCount} of ${curr.floor} URLs are indexed on ${todayIso}; from week ${rung.fromWeek} after ${RAMP_ANCHOR} at least ${rung.min} must be — pages are stuck, find which (do not edit the rung)`,
    });
  }

  // (3) Regressions — immediate, independent of the ramp. Matched by URL string,
  //     never by array position.
  const prevByUrl = new Map((prev?.urls ?? []).map((u) => [u.url, u]));
  for (const u of curr.urls) {
    const before = prevByUrl.get(u.url);
    if (before && isIndexed(before) && !isIndexed(u)) {
      flags.push({
        code: "lost-indexation",
        url: u.url,
        message: `${u.url} was indexed in the previous reading (${prev?.taken ?? "?"}) and now reports verdict ${u.verdict ?? "unknown"}${u.error ? ` (${u.error})` : ""}`,
      });
    }
    // An uncrawled URL reports ROBOTS_TXT_STATE_UNSPECIFIED with no lastCrawlTime;
    // that is informational. Only a CRAWLED URL with a non-ALLOWED state is a flag.
    if (u.robotsTxtState && u.robotsTxtState !== "ALLOWED" && u.lastCrawlTime) {
      flags.push({
        code: "robots-not-allowed",
        url: u.url,
        message: `${u.url} reports robotsTxtState ${u.robotsTxtState} (last crawled ${u.lastCrawlTime}) — Google is being kept out of a page we intend to index`,
      });
    }
    // Sitemap URLs carry no trailing slash except the root, so an exact compare is right.
    if (u.googleCanonical && u.googleCanonical !== u.url) {
      flags.push({
        code: "canonical-mismatch",
        url: u.url,
        message: `${u.url} — Google chose canonical ${u.googleCanonical}; ours is the URL itself. Google is folding this page into another`,
      });
    }
  }

  // (4) The retired domain. Both flags require an actual legacy block: a reading without one
  //     is a GAP, and a gap silently read as success is the failure mode this whole section
  //     exists to avoid.
  if (curr.legacy) {
    const cutover =
      opts.legacyCutoverDate !== undefined ? opts.legacyCutoverDate : LEGACY_CUTOVER_DATE;

    // Consolidation. Inverted canonical-mismatch: a legacy URL is HEALTHY once Google's
    // chosen canonical has moved off the old host. Silent until the cutover is declared and
    // week 8 has passed, because before that a stuck canonical is just Google being slow.
    if (cutover && weeksSince(cutover, todayIso) >= LEGACY_CONSOLIDATION_WEEK) {
      const weeks = weeksSince(cutover, todayIso);
      for (const u of curr.legacy.urls) {
        if (u.googleCanonical && isOnLegacyHost(u.googleCanonical)) {
          flags.push({
            code: "legacy-canonical-not-moved",
            url: u.url,
            message: `${u.url} — ${weeks} weeks after the cutover (${cutover}) Google still names ${u.googleCanonical} as the canonical, an address on the retired domain. Check that this URL still redirects in ONE hop (verify-redirects.ts), that the Change of Address is still active for its property, and that the destination is indexable. Do not raise LEGACY_CONSOLIDATION_WEEK to silence this`,
          });
        }
      }
    }

    // Traffic. The streak is carried in the reading (nextZeroStreak); this only reads it.
    const streak = curr.legacy.zeroStreak ?? 0;
    if (curr.legacy.impressions28d === 0 && streak >= LEGACY_ZERO_WEEKS) {
      flags.push({
        code: "legacy-traffic-zero",
        message: `${curr.legacy.property} has reported zero 28-day impressions for ${streak} consecutive weekly readings (threshold ${LEGACY_ZERO_WEEKS}) — roughly two months of silence. THIS IS NOT AUTHORISATION TO RETIRE THE REDIRECT MAP: that is a separate decision, and never before the 180-day floor. It opens the conversation, nothing more`,
      });
    }
  }

  return flags;
}
