# Web Analytics — rapporteert ≥ 24 uur na inschakelen (MEAS-06)

taken: 2026-09-18T07:34:34Z
enabledAt: 2026-09-16T22:18:46Z (`webAnalytics.enabledAt`, zie `web-analytics-enabled.json`) — deze meting is 33 uur later genomen.

## Tellingen (REST, dag-granulariteit)

Bron: `GET https://api.vercel.com/v1/query/web-analytics/visits/count?projectId=prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q&teamId=team_YrD4rsBlATPg7g02y1QThOhg&since=<datum>&until=<datum>` via `npx vercel@59.19.1 api …` (CLI-login van de agency-account). De API rekent in hele UTC-dagen; `until` is exclusief.

| venster | since | until | bezoekers (visitors) | paginaweergaven (pageviews) |
|---|---|---|---|---|
| afgelopen 24 uur (dag-granulair: UTC-dagen 2026-09-17 t/m 2026-09-18) | 2026-09-17 | 2026-09-19 | bezoekers/visitors: 5 | paginaweergaven/pageviews: 17 |
| laatste 7 dagen | 2026-09-12 | 2026-09-19 | bezoekers/visitors: 7 | paginaweergaven/pageviews: 22 |
| sinds inschakelen | 2026-09-16 | 2026-09-19 | bezoekers/visitors: 7 | paginaweergaven/pageviews: 22 |

Vercel MCP `get_web_analytics` gaf voor deze connector een 404 (vastgelegd in `insights-view-request.md`); de REST-telling hierboven is het machinebewijs.

## Rapportagevenster (het "duurzame record"-punt uit CONTEXT)

Het project draait op het **Hobby**-plan: Web Analytics bewaart **1 maand** aan data (Pro: 12 maanden). Daarom is deze telling hier als bestand vastgelegd en herhaalt de weekmeting (`measure-indexation.yml`) de indexatiecijfers in `docs/measurements/`; verkeer dat ouder is dan een maand is alleen nog via zulke exports terug te vinden. Bij milestone-afsluiting: dezelfde REST-call opnieuw draaien en naast deze tabel leggen.

## Probe: `VERCEL_TOKEN=… npx tsx scripts/verify-measurement.ts https://www.tpsklimaattechniek.nl` (2026-09-18T07:34:34Z)

```
✅ Measurement surface verified on https://www.tpsklimaattechniek.nl — TXT ownership records on 2/2 zones, verification meta tag served once, sitemap 27/27, analytics scripts 200, visits count checked.
   note: meta tag content not compared (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION not set in this shell)
   note: analytics script endpoints answer 200 — necessary, NOT sufficient (the platform serves them even when collection is off)
   note: Vercel visits count: visitors = 7 in the last 7 days (analytics IS reporting)
```
