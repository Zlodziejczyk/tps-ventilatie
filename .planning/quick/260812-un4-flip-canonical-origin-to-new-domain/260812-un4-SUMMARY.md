---
id: 260812-un4
status: complete
date: 2026-08-12
commit: a98567a
---

# Quick Task 260812-un4 — Summary

Flipped `CANONICAL_ORIGIN` from the retired `https://tpsventilatie.nl` to
`https://www.tpsklimaattechniek.nl`, the live Vercel Production host.

## What unblocked this

The domain was not merely unconfigured — it was **suspended**. SIDN delegated
`tpsklimaattechniek.nl` to `ns3/ns4.emailverification.info`, which served the
dd24 (Key-Systems) *Contact Verification Suspension Page*. While that held, no
DNS record and no nameserver change could take effect; mail was down too (no MX
resolved at all). Once the registrant contact was verified, dd24 restored
`ns1/ns2/ns3.domaindiscount24.net` and published the zone — including a `www`
CNAME that was already sitting in it.

Verified live before touching code:

```
https://www.tpsklimaattechniek.nl/   200, valid cert, server: Vercel, x-vercel-cache: HIT
https://tpsklimaattechniek.nl/       308 -> www
apex A -> 216.198.79.1
www  CNAME -> 863afab58c3e6cf4.vercel-dns-017.com
MX -> mx0101/mx0102.titan.email (intact)
```

No nameserver change was made. Moving DNS to Vercel would have caused an
outage on a working site and dropped the Titan mail records for zero benefit.

## Changes

| File | Change |
|---|---|
| `lib/constants.ts` | `CANONICAL_ORIGIN` → www host; comment rewritten (it claimed "www→apex 301", the inverse of live behaviour) |
| `scripts/assert-seo.ts` | 4 hard-coded origin literals + "absolute-apex" wording in header and section (3)/(4) comments |
| `app/privacy-beleid/page.tsx` | 9 self-references → `tpsklimaattechniek.nl` |
| `app/page.tsx` | stale self-canonical comment |

## Decision recorded

**Canonical host = www, not the apex.** ROADMAP.md and the assert-seo messages
previously locked "the apex". www is what Vercel serves as Production and the
apex 308-redirects to it, so pointing canonicals at the apex would aim every
canonical, sitemap `<loc>`, and JSON-LD `url` at a redirecting host. The
convention is superseded rather than worked around.

**`SITE.email` unchanged** — stays `info@tpsventilatie.nl` per owner decision.
Old-domain mail is still deliverable (`mail.tpsventilatie.nl`, SPF via
cyberfolks.pl); the `@tpsklimaattechniek.nl` mailbox is not confirmed
provisioned. Deferred, not forgotten.

## Verification status — READ THIS

`scripts/assert-seo.ts` **was not run to completion.** Two attempts (`npx tsx`
and the local `./node_modules/.bin/tsx`) both wedged on the OneDrive mount —
alive but ~0.3s CPU after 8 minutes — and were killed. This matches the known
constraint that heavy local execution deadlocks on this mount.

Verified statically instead: `absoluteUrl()` is a pure template join on
`CANONICAL_ORIGIN`, so all four assertions are internally consistent with the
new literal, and `grep` confirms the only surviving `tpsventilatie` strings in
source are the two intentional email references plus one comment naming the
retired brand.

**The real gate is the Vercel preview build on this branch** — per the project's
established workaround for the OneDrive deadlock. Not yet pushed.

## Follow-ups

- Push branch → confirm Vercel preview builds green (the actual gate).
- After merge, re-check `/robots.txt`, `/sitemap.xml`, and a page's `<link rel="canonical">` on the live host.
- 301 `tpsventilatie.nl` → new domain (owner chose this; DNS/host change at
  cyberfolks.pl, keep the `mail` A record so email survives).
- Google Search Console: add the new property, submit the sitemap.
