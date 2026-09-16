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
}

export type FlagCode =
  | "below-ramp"
  | "lost-indexation"
  | "robots-not-allowed"
  | "canonical-mismatch"
  | "count-vs-floor"
  | "simulated-breach";

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

  return flags;
}
