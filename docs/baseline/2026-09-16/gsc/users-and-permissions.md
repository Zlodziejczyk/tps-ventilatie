# Search Console — users and permissions per property (D-02, D-18)

taken: 2026-09-16T21:29:13Z
executed by: Claude in Chrome (D-01)

Identities:
- **Oskar Kolodziejczyk** — `oskar.kolodziejczyk@polaris360.nl` — verified Owner (DNS TXT on both zones; the www URL-prefix property inherits it)
- **Thomas (client, TPS klimaattechniek)** — `tpsventilatie@gmail.com` — Google identity confirmed by the user in this session (the plan's assumed `tpsservices001@gmail.com` was NOT used); added as **delegated Owner** on every property, accepted by Google without rejection
- **Service account** `gsc-measure@tps-klimaattechniek-seo.iam.gserviceaccount.com` (GCP project `tps-klimaattechniek-seo`, D-18) — **Full** on the two Domain properties only; the API scripts (`scripts/gsc/api.ts`) address `sc-domain:` properties exclusively, so no URL-prefix access is needed

| Property | Oskar | Thomas | Service account | Screenshot |
|---|---|---|---|---|
| `sc-domain:tpsklimaattechniek.nl` | Owner (verified) | Owner (delegated) | Full | `users-tpsklimaattechniek.nl-*.jpg` |
| `sc-domain:tpsventilatie.nl` | Owner (verified) | Owner (delegated) | Full | `users-tpsventilatie.nl-*.jpg` |
| `https://www.tpsklimaattechniek.nl/` | Owner (verified, inherited) | Owner (delegated) | — (not needed) | — |
| `https://tpsventilatie.nl/` | Owner (verified, inherited) | Owner (delegated) | — (not needed) | — |
| `https://www.tpsventilatie.nl/` | Owner (verified, inherited) | Owner (delegated) | — (not needed) | `users-www.tpsventilatie.nl-*.jpg` |

Notes:
- Delegated Owner is the maximum non-verified role; Thomas can add/remove users himself and keeps access if the agency relationship ends (D-02). He does not lose anything if the agency's DNS-based verification is ever removed — but the D-07 rule still stands: never remove either `google-site-verification` TXT record.
- "Unused ownership tokens: 0" on every property at the time of writing.
- Re-check: Settings → Users and permissions on each property.
