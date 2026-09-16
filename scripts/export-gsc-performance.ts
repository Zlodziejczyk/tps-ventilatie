// Baseline export of Search Console data — NOT shipped runtime code (CLI).
// Intentional console usage; every API call is read-only and runs sequentially.
//
// Usage:  npx tsx scripts/export-gsc-performance.ts [--out <dir>] [--property <siteUrl>]... [--sitemap-only]
//   default --out       docs/baseline/<today UTC>/gsc
//   default --property  both Domain properties (PROPERTY_NEW and PROPERTY_LEGACY)
//   --sitemap-only      only the sitemap proof (D-10) and the legacy sitemap list (D-09)
//
// WHAT IT WRITES
//   serp-queries.json                          the SERP-baseline shortlist (D-13), DERIVED from the
//                                              registry's primaryKeyword fields + the two brand queries —
//                                              never hand-typed, so the milestone-close retake recomputes
//                                              exactly the same list
//   performance-<domain>-by-query.{json,csv}   Search Analytics by query, the full available history (D-16)
//   performance-<domain>-by-page.{json,csv}    Search Analytics by page (D-16)
//   shortlist-<domain>.json                    one entry per shortlist query with its rows; an EMPTY row
//                                              list is the recorded zero — "prove the negative" (D-13)
//   sitemap-tpsklimaattechniek.nl.json         Google's own record of the submitted sitemap; asserts
//                                              contents[web].submitted === INDEXABLE_FLOOR and errors === 0
//                                              (D-10) — a mismatch is a FINDING and exits non-zero
//   sitemaps-tpsventilatie.nl.json             the legacy property's sitemap list, expected empty: no
//                                              sitemap is ever submitted for the legacy domain (D-09)
//
// RE-RUN at milestone close into a NEW dated directory (docs/baseline/<date>/gsc) so a
// before/after pair exists. Idempotent; safe to re-run into the same directory.
// The new-domain property was verified on 2026-09-16 and Search Analytics lags ~2 days,
// so an empty first export there is a TIMING statement, not a bug (RESEARCH §Pitfall 9);
// the script says so and still exits 0.
//
// It reads and writes files; it never submits anything to Google. No code path calls
// a submit or delete method, and the token carries the read-only scope.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CANONICAL_ORIGIN } from "@/lib/constants";
import { PAGES } from "@/lib/services/registry";
import { isIndexable } from "@/lib/seo/policy";
import { INDEXABLE_FLOOR } from "@/lib/seo/invariants";
import { getAccessToken } from "./gsc/auth";
import {
  PROPERTY_LEGACY,
  PROPERTY_NEW,
  getSitemap,
  listSitemaps,
  querySearchAnalytics,
  type SearchAnalyticsRow,
} from "./gsc/api";

// The day the new domain went public (memory: domain live 2026-08-12) — nothing
// can have been searched for on it before that.
const NEW_DOMAIN_LIVE = "2026-08-12";
// Search Console exposes at most 16 months of history.
const LEGACY_MONTHS = 16;
const BRAND_QUERIES = ["tps klimaattechniek", "tps ventilatie"];
const SHORTLIST_MIN = 15;
const SHORTLIST_MAX = 25;
const ROW_LIMIT = 25000;

// ── CLI ──
const args = process.argv.slice(2);
let out = "";
const properties: string[] = [];
let sitemapOnly = false;
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if (a === "--out") out = args[++i] ?? "";
  else if (a.startsWith("--out=")) out = a.slice(6);
  else if (a === "--property") properties.push(args[++i] ?? "");
  else if (a.startsWith("--property=")) properties.push(a.slice(11));
  else if (a === "--sitemap-only") sitemapOnly = true;
  else {
    console.error(`Unknown argument: ${a}`);
    console.error("Usage: npx tsx scripts/export-gsc-performance.ts [--out <dir>] [--property <siteUrl>]... [--sitemap-only]");
    process.exit(2);
  }
}
if (properties.some((p) => !p.startsWith("sc-domain:"))) {
  console.error("Usage: --property expects a Domain property, e.g. sc-domain:tpsklimaattechniek.nl");
  process.exit(2);
}

const isoDate = (d: Date): string => d.toISOString().slice(0, 10);
const now = new Date();
const taken = now.toISOString();
const todayIso = isoDate(now);
const yesterday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
const endDate = isoDate(yesterday);
if (!out) out = join("docs", "baseline", todayIso, "gsc");
const selected = properties.length > 0 ? properties : [PROPERTY_NEW, PROPERTY_LEGACY];
const domainOf = (property: string): string => property.replace(/^sc-domain:/, "");

function legacyStartDate(): string {
  const d = new Date(yesterday);
  d.setUTCMonth(d.getUTCMonth() - LEGACY_MONTHS);
  d.setUTCDate(d.getUTCDate() + 3); // stay safely inside Google's 16-month window
  return isoDate(d);
}

function writeJson(file: string, data: unknown): void {
  writeFileSync(join(out, file), `${JSON.stringify(data, null, 2)}\n`);
}

function csvField(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function writeCsv(file: string, keyHeader: string, rows: SearchAnalyticsRow[]): void {
  const lines = [[keyHeader, "clicks", "impressions", "ctr", "position"].map(csvField).join(",")];
  for (const row of rows) {
    lines.push([row.keys?.[0] ?? "", row.clicks, row.impressions, row.ctr, row.position].map(csvField).join(","));
  }
  writeFileSync(join(out, file), `${lines.join("\n")}\n`);
}

// (a) The shortlist — derived, never typed. Only nodes whose page template renders
//     the keyword (hub / pillar / service) and that the policy says are indexable.
function deriveShortlist(): string[] {
  const fromRegistry = PAGES.filter(
    (node) => (node.type === "hub" || node.type === "pillar" || node.type === "service") && isIndexable(node),
  ).map((node) => node.primaryKeyword);
  return [...fromRegistry, ...BRAND_QUERIES];
}

async function exportDimension(
  token: string,
  property: string,
  dimension: "query" | "page",
  startDate: string,
): Promise<SearchAnalyticsRow[]> {
  const rows: SearchAnalyticsRow[] = [];
  let startRow = 0;
  for (;;) {
    const res = await querySearchAnalytics(token, property, {
      startDate,
      endDate,
      dimensions: [dimension],
      rowLimit: ROW_LIMIT,
      startRow,
      dataState: "final",
    });
    const page = res.rows ?? [];
    rows.push(...page);
    if (page.length < ROW_LIMIT) break;
    startRow += page.length;
  }
  return rows;
}

interface Summary {
  property: string;
  byQuery: number;
  byPage: number;
  zeros: string;
  sitemap: string;
}

async function main(): Promise<void> {
  mkdirSync(out, { recursive: true });
  const token = await getAccessToken();
  const summaries: Summary[] = [];
  let findings = 0;

  const queries = deriveShortlist();
  if (!sitemapOnly) {
    if (queries.length < SHORTLIST_MIN || queries.length > SHORTLIST_MAX) {
      console.error(
        `✗ shortlist has ${queries.length} queries, outside the D-13 band ${SHORTLIST_MIN}–${SHORTLIST_MAX} — ` +
          `the registry changed shape; decide deliberately instead of adjusting the band.`,
      );
      process.exit(1);
    }
    writeJson("serp-queries.json", {
      derivedFrom: "lib/services/registry.ts primaryKeyword of indexable hub|pillar|service nodes + brand",
      taken,
      queries,
    });
    console.log(`shortlist: ${queries.length} queries (${queries.length - BRAND_QUERIES.length} from the registry + ${BRAND_QUERIES.length} brand) → serp-queries.json`);
  }

  for (const property of selected) {
    const domain = domainOf(property);
    const summary: Summary = { property, byQuery: 0, byPage: 0, zeros: "–", sitemap: "–" };

    if (!sitemapOnly) {
      const startDate = property === PROPERTY_NEW ? NEW_DOMAIN_LIVE : legacyStartDate();

      // (b) by query, by page — JSON + CSV
      const byQuery = await exportDimension(token, property, "query", startDate);
      writeJson(`performance-${domain}-by-query.json`, { property, startDate, endDate, taken, rows: byQuery });
      writeCsv(`performance-${domain}-by-query.csv`, "query", byQuery);
      const byPage = await exportDimension(token, property, "page", startDate);
      writeJson(`performance-${domain}-by-page.json`, { property, startDate, endDate, taken, rows: byPage });
      writeCsv(`performance-${domain}-by-page.csv`, "page", byPage);
      summary.byQuery = byQuery.length;
      summary.byPage = byPage.length;

      // (c) the shortlist, one filtered query each — the zeroes are the point (D-13)
      const entries: { query: string; rows: SearchAnalyticsRow[]; zero: boolean }[] = [];
      for (const query of queries) {
        const res = await querySearchAnalytics(token, property, {
          startDate,
          endDate,
          dimensions: ["page"],
          dimensionFilterGroups: [
            {
              filters: [
                { dimension: "query", operator: "equals", expression: query },
                { dimension: "country", operator: "equals", expression: "nld" },
              ],
            },
          ],
          rowLimit: 100,
          dataState: "final",
        });
        const rows = res.rows ?? [];
        entries.push({ query, rows, zero: rows.length === 0 });
      }
      writeJson(`shortlist-${domain}.json`, { property, startDate, endDate, country: "nld", taken, entries });
      summary.zeros = `${entries.filter((e) => e.zero).length}/${entries.length}`;

      if (property === PROPERTY_NEW && byQuery.length === 0) {
        console.log(
          `note: ${property} has 0 rows by query for ${startDate}..${endDate} — Search Analytics lags ~2 days ` +
            `after verification on 2026-09-16 (RESEARCH §Pitfall 9); re-run before the 09-06 completeness gate.`,
        );
      }
    }

    // (d) Google's own record of the sitemap (D-10) — new domain only; legacy gets none (D-09)
    if (property === PROPERTY_NEW) {
      const feedpath = `${CANONICAL_ORIGIN}/sitemap.xml`;
      const sitemap = await getSitemap(token, property, feedpath);
      writeJson(`sitemap-${domain}.json`, { property, feedpath, taken, ...sitemap });
      const web = sitemap.contents?.find((c) => c.type === "web");
      const submitted = web?.submitted ?? 0;
      const errors = sitemap.errors ?? 0;
      summary.sitemap = `${submitted} submitted, ${errors} errors`;
      if (!web || submitted !== INDEXABLE_FLOOR || errors !== 0) {
        findings += 1;
        console.error(
          `✗ FINDING (D-10): Google reports ${submitted} submitted URL(s) and ${errors} error(s) for ${feedpath}; ` +
            `expected exactly ${INDEXABLE_FLOOR} (INDEXABLE_FLOOR) and 0 errors. Investigate — do not adjust the floor.`,
        );
      }
    } else if (property === PROPERTY_LEGACY) {
      const listed = await listSitemaps(token, property);
      const sitemaps = listed.sitemap ?? [];
      writeJson(`sitemaps-${domain}.json`, {
        property,
        taken,
        sitemaps,
        note: "geen sitemap ingediend (D-09): wp-sitemap.xml is een 404; de legacy-property bestaat voor de export en de Change of Address",
      });
      summary.sitemap = sitemaps.length === 0 ? "none (D-09)" : `${sitemaps.length} listed — UNEXPECTED (D-09)`;
      if (sitemaps.length !== 0) {
        findings += 1;
        console.error(`✗ FINDING (D-09): ${property} lists ${sitemaps.length} sitemap(s); none should ever be submitted.`);
      }
    }
    summaries.push(summary);
  }

  // (e) summary table
  console.log("");
  console.log("| property | rows by query | rows by page | zeros/shortlist | sitemap |");
  console.log("|---|---|---|---|---|");
  for (const s of summaries) {
    console.log(`| ${s.property} | ${s.byQuery} | ${s.byPage} | ${s.zeros} | ${s.sitemap} |`);
  }
  console.log(`\nwritten to ${out}/ (taken ${taken})`);
  if (findings > 0) {
    console.error(`\n✗ ${findings} finding(s) — see above.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`✗ export crashed: ${(error as Error).message}`);
  process.exit(1);
});
