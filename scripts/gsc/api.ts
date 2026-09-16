// Search Console API client — NOT shipped runtime code (CLI / CI helper only).
//
// Typed, dependency-free wrappers for the read-only calls Phase 9 needs
// (RESEARCH §Pattern 2/3/4), every one taking the bearer token first:
//   inspectUrl()            POST searchconsole.googleapis.com/v1/urlInspection/index:inspect
//   getSitemap()            GET  www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}
//   listSitemaps()          GET  www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps
//   querySearchAnalytics()  POST www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
//
// NO WRITE SURFACE. The same API family has methods that submit or remove
// sitemaps and add or remove sites; none is implemented here, on purpose
// (T-9-write-api). The token is minted with the read-only scope anyway.
//
// ERRORS carry the HTTP status, the method and the property — never the
// response body, which could echo request details into public CI logs
// (T-9-token-log). A 403 almost always means the service account is not a
// Full user on that property (Settings → Users and permissions), not a scope
// problem (RESEARCH §Pitfall 4).
//
// PROPERTY NAMES live here exactly once so every script shares one spelling.
// Domain properties are addressed as `sc-domain:<host>`; a URL-prefix property
// would be the full origin WITH its trailing slash.

export const PROPERTY_NEW = "sc-domain:tpsklimaattechniek.nl";
export const PROPERTY_LEGACY = "sc-domain:tpsventilatie.nl";

const INSPECT_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const WMX_SITES = "https://www.googleapis.com/webmasters/v3/sites";

// ── URL Inspection — enum values exactly as the v1 discovery document lists them ──

export type Verdict = "VERDICT_UNSPECIFIED" | "PASS" | "PARTIAL" | "FAIL" | "NEUTRAL";
export type RobotsTxtState = "ROBOTS_TXT_STATE_UNSPECIFIED" | "ALLOWED" | "DISALLOWED";
export type IndexingState =
  | "INDEXING_STATE_UNSPECIFIED"
  | "INDEXING_ALLOWED"
  | "BLOCKED_BY_META_TAG"
  | "BLOCKED_BY_HTTP_HEADER"
  | "BLOCKED_BY_ROBOTS_TXT";
export type PageFetchState =
  | "PAGE_FETCH_STATE_UNSPECIFIED"
  | "SUCCESSFUL"
  | "SOFT_404"
  | "BLOCKED_ROBOTS_TXT"
  | "NOT_FOUND"
  | "ACCESS_DENIED"
  | "SERVER_ERROR"
  | "REDIRECT_ERROR"
  | "ACCESS_FORBIDDEN"
  | "BLOCKED_4XX"
  | "INTERNAL_CRAWL_ERROR"
  | "INVALID_URL";
export type CrawledAs = "CRAWLING_USER_AGENT_UNSPECIFIED" | "DESKTOP" | "MOBILE";

export interface IndexStatusResult {
  verdict: Verdict;
  // Free text such as "Submitted and indexed" — stored for humans, NEVER matched on.
  coverageState: string;
  robotsTxtState: RobotsTxtState;
  indexingState: IndexingState;
  pageFetchState: PageFetchState;
  crawledAs?: CrawledAs;
  lastCrawlTime?: string; // RFC 3339
  googleCanonical?: string;
  userCanonical?: string;
  sitemap?: string[];
  referringUrls?: string[];
}

export class GscApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly siteUrl: string;
  constructor(status: number, method: string, siteUrl: string, hint: string) {
    super(`${method} on ${siteUrl} → HTTP ${status}${hint ? ` — ${hint}` : ""}`);
    this.name = "GscApiError";
    this.status = status;
    this.method = method;
    this.siteUrl = siteUrl;
  }
}

function hintFor(status: number): string {
  if (status === 403) return "the service account is not a Full user on this property (Settings → Users and permissions)";
  if (status === 401) return "the access token is missing, expired, or minted for the wrong scope";
  if (status === 404) return "property or resource not found — check the sc-domain: spelling";
  if (status === 429) return "quota exceeded — slow down (600 inspections/min, 2,000/day per property)";
  return "";
}

async function call<T>(
  token: string,
  method: string,
  siteUrl: string,
  url: string,
  init: { method: "GET" | "POST"; body?: string },
): Promise<T> {
  const res = await fetch(url, {
    method: init.method,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: init.body,
  });
  if (!res.ok) throw new GscApiError(res.status, method, siteUrl, hintFor(res.status));
  return (await res.json()) as T;
}

export async function inspectUrl(
  token: string,
  siteUrl: string,
  inspectionUrl: string,
): Promise<IndexStatusResult> {
  const body = await call<{ inspectionResult?: { indexStatusResult?: IndexStatusResult } }>(
    token,
    "urlInspection.index.inspect",
    siteUrl,
    INSPECT_URL,
    { method: "POST", body: JSON.stringify({ inspectionUrl, siteUrl, languageCode: "en-US" }) },
  );
  const result = body.inspectionResult?.indexStatusResult;
  if (!result) {
    throw new GscApiError(200, "urlInspection.index.inspect", siteUrl, `no indexStatusResult for ${inspectionUrl}`);
  }
  return result;
}

// ── Sitemaps ──

export interface WmxSitemapContent {
  type: string;
  submitted: number;
  // `indexed` is DEPRECATED by Google and never read by these scripts.
  indexed?: number;
}

export interface WmxSitemap {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  isSitemapsIndex?: boolean;
  type?: string;
  errors?: number;
  warnings?: number;
  contents?: WmxSitemapContent[];
}

const siteBase = (siteUrl: string): string => `${WMX_SITES}/${encodeURIComponent(siteUrl)}`;

// Google serialises int64 fields as JSON STRINGS ("27", "0"). Normalise once here so
// every consumer compares numbers and the committed JSON carries numbers.
function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function normalizeSitemap(raw: WmxSitemap): WmxSitemap {
  return {
    ...raw,
    errors: toNumber(raw.errors),
    warnings: toNumber(raw.warnings),
    contents: raw.contents?.map((c) => ({
      type: c.type,
      submitted: toNumber(c.submitted) ?? 0,
      indexed: toNumber(c.indexed),
    })),
  };
}

export async function getSitemap(token: string, siteUrl: string, feedpath: string): Promise<WmxSitemap> {
  const raw = await call<WmxSitemap>(
    token,
    "sitemaps.get",
    siteUrl,
    `${siteBase(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`,
    { method: "GET" },
  );
  return normalizeSitemap(raw);
}

export async function listSitemaps(token: string, siteUrl: string): Promise<{ sitemap?: WmxSitemap[] }> {
  const raw = await call<{ sitemap?: WmxSitemap[] }>(token, "sitemaps.list", siteUrl, `${siteBase(siteUrl)}/sitemaps`, {
    method: "GET",
  });
  return { sitemap: raw.sitemap?.map(normalizeSitemap) };
}

// ── Search Analytics ──

export type SearchAnalyticsDimension = "date" | "query" | "page" | "country" | "device" | "searchAppearance";

export interface DimensionFilter {
  dimension: SearchAnalyticsDimension;
  operator?: "equals" | "notEquals" | "contains" | "notContains" | "includingRegex" | "excludingRegex";
  expression: string;
}

export interface SearchAnalyticsRequest {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dimensions?: SearchAnalyticsDimension[];
  type?: "web" | "image" | "video" | "news" | "discover" | "googleNews";
  dimensionFilterGroups?: { groupType?: "and"; filters: DimensionFilter[] }[];
  aggregationType?: "auto" | "byPage" | "byProperty" | "byNewsShowcasePanel";
  rowLimit?: number; // ≤ 25000
  startRow?: number;
  dataState?: "final" | "all";
}

export interface SearchAnalyticsRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchAnalyticsResponse {
  rows?: SearchAnalyticsRow[];
  responseAggregationType?: string;
}

export async function querySearchAnalytics(
  token: string,
  siteUrl: string,
  body: SearchAnalyticsRequest,
): Promise<SearchAnalyticsResponse> {
  return call<SearchAnalyticsResponse>(
    token,
    "searchanalytics.query",
    siteUrl,
    `${siteBase(siteUrl)}/searchAnalytics/query`,
    { method: "POST", body: JSON.stringify(body) },
  );
}
