# Legacy URL-prefix properties — status (D-05, D-06, MEAS-02)

taken: 2026-09-16T21:29:13Z
executed by: Claude in Chrome (D-01), signed in as oskar.kolodziejczyk@polaris360.nl
pre-checks at execution time: `curl -sI https://tpsventilatie.nl/` → `HTTP/2 200` (WordPress `wp-json` link header on the apex; `https://www.tpsventilatie.nl/` → 301 by WordPress to the apex); `dig +short TXT tpsventilatie.nl` → contains `google-site-verification=…` (D-07 record present at dd24, D-26)

| Property (exact resource_id) | Result | Verification method shown by Google | Notes |
|---|---|---|---|
| `https://tpsventilatie.nl/` | **verified (inherited)** | "Ownership auto verified — Domain name provider" | inherited from parent `sc-domain:tpsventilatie.nl` (RESEARCH assumption A1 confirmed); no HTML file / tag / GA / GTM method attempted |
| `https://www.tpsventilatie.nl/` | **verified (inherited)** | "Ownership auto verified — Domain name provider" | idem; www currently 301s to the apex, the property exists for the historical www URLs while the WordPress window is open |

Domain-level coverage: both variants (apex + www, http + https) were already covered by `sc-domain:tpsventilatie.nl`, verified on 2026-09-16 (see `legacy-domain-property-verified.jpg`). The URL-prefix properties add per-prefix reporting (Performance/Pages split by host) for the migration window; they do not add ownership beyond the Domain property.

Nothing was removed: no DNS record, token, or property was deleted (D-07). Google's own notice on each dialog: "To stay verified, don't remove the DNS record."

Fifth property (D-08), for completeness: `https://www.tpsklimaattechniek.nl/` — verified (inherited) the same way; the HTML-tag method is added in 09-03 Task 2 after the production redeploy (see `ownership-verification-www-tpsklimaattechniek.png`).
