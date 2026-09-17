# Vercel Web Analytics — browser beacon evidence (MEAS-06, D-24)

taken: 2026-09-17T08:09:18Z
browser: Chrome, tab driven by Claude (D-01), signed-in profile, production site
pages loaded: `https://www.tpsklimaattechniek.nl/?utm_source=phase9-beacon-check` and `https://www.tpsklimaattechniek.nl/diensten/airconditioning`
capture method: Chrome MCP `read_network_requests` (all requests of the tab, then filtered on the analytics path ids)

## Requests observed (per page load)

| request | method | status | meaning |
|---|---|---|---|
| `/2fd128cc8fe7c492/script.js` | GET | 200 | Web Analytics script (project-unique path served by Vercel) |
| `/2fd128cc8fe7c492/view` | POST | 200 | **the page-view beacon** — this is what the SSR HTML never contains; 200 = accepted by Vercel |
| `/9b5146f14b1d5ad9/script.js` | GET | 200 | Speed Insights script (project-unique path) |
| `/_vercel/insights/view` | — | not used | `@vercel/analytics` 2.x on this deployment posts to the project-unique path above, not to `/_vercel/insights/view`; the platform still answers 200 on `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`, which is why `scripts/verify-measurement.ts` labels those checks "necessary, not sufficient" |

Both pages produced the pair `script.js` + `view` (4 requests for 2 loads). The SSR HTML of `/` contains neither the unique-path script tag nor any beacon — the component injects the script client-side.

## API/MCP proof that the beacons are counted

- Vercel MCP `get_web_analytics` (claude.ai connector, count mode, 2026-09-16..17): **`404 Web Analytics not found`** — the connector's token does not see the team's analytics; recorded as-is, not used as proof.
- REST `GET https://api.vercel.com/v1/query/web-analytics/visits/count?projectId=prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q&teamId=team_YrD4rsBlATPg7g02y1QThOhg&since=2026-09-16&until=2026-09-18` via `vercel api` (CLI 59.19.1, logged-in user token, never stored in the repo):

```json
{ "version": 1, "query": { "since": "2026-09-16T00:00:00.000Z", "until": "2026-09-18T00:00:00.000Z" }, "data": { "visitors": 2, "pageviews": 5 } }
```

  Response shape: `data.visitors`, `data.pageviews` (integers). Minutes after enabling, the count is already positive (the beacons above plus the enable-time redeploy check) — Web Analytics is **reporting**, not merely enabled. 09-06 re-checks after ≥ 24 h.
- Enable timestamps (project API, see `web-analytics-enabled.json`): Web Analytics `enabledAt` 2026-09-16T22:18:46Z; production redeploy (git, `main` @ 56d239c) 2026-09-16T22:24:48Z — enabled BEFORE the redeploy, as required. Speed Insights was already collecting (`dataReceivedAt` 2026-08-23), see `speed-insights-enabled.txt`.

## Deviation from the plan's evidence format

The plan named `web-analytics-enabled.png` / `speed-insights-enabled.png` (dashboard screenshots). The owner chose the CLI route and skipped the Chrome login for vercel.com, so the evidence is machine output instead: `web-analytics-enabled.json` (project API excerpt) and `speed-insights-enabled.txt` (metrics query). Both carry a `taken` timestamp.

## Speed Insights vitals beacon (observed later in the same session)

`POST /9b5146f14b1d5ad9/vitals` → **503** on the third page (`/contact`, after scrolling `/diensten/airconditioning`). The Speed Insights *script* loaded with 200 on every page; the metrics query (see `speed-insights-enabled.txt`) shows production LCP samples for 2026-09-16, so collection was working earlier the same day. A single 503 on the vitals endpoint is recorded here as observed, not explained (Hobby data-point limit or a transient); 09-06 re-checks the metric after ≥ 24 h.
