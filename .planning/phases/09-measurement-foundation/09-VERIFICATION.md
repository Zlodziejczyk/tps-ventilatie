# Phase 9 — Verification: Measurement Foundation

**Verified:** 2026-09-18 · **Method:** goal-backward, inline (subagents hang on the OneDrive mount) · **Verdict: PASSED — 6/6 requirements met**

## The question this phase had to answer

Phase 9 exists so that the v1.1 milestone's central claim — that moving the brand from `tpsventilatie.nl` to `tpsklimaattechniek.nl` did not cost search visibility, and ideally gained it — can be **proven rather than asserted**. That requires a before-side captured while the old world still exists, and an instrument that keeps reading after Phase 10 changes it.

Verification therefore asks of each requirement: *is the evidence on disk, is it machine-derived rather than typed, and would it still be there if this session vanished?*

## Requirement by requirement

### MEAS-01 — both new-domain variants verified in GSC · **MET**

`sc-domain:tpsklimaattechniek.nl` (DNS TXT at dd24) and `https://www.tpsklimaattechniek.nl/` (inherited, plus an HTML-tag method) are both verified, recorded in `gsc/users-and-permissions.md` with "Unused ownership tokens: 0" on every property. The served verification tag is asserted on every production deploy by `verify-measurement.ts` check 2, which requires **exactly one** tag inside `<head>` — the seam that once looked live and was not.

### MEAS-02 — both legacy variants verified while legacy DNS still points at WordPress · **MET**

`sc-domain:tpsventilatie.nl`, `https://tpsventilatie.nl/` and `https://www.tpsventilatie.nl/` are verified, evidenced in `gsc/legacy-url-prefix-status.md` (with the pre-check that the apex still returned 200 from WordPress at capture time) and `gsc/legacy-domain-property-verified.jpg` ("Ownership auto verified").

The requirement's parenthetical — *verification becomes materially harder after the repoint* — is the reason this phase is ordered before Phase 10, and it held: the work was done while the old site still answered. The probe now treats the legacy TXT record as a **permanent** requirement (D-07), failing if it is ever removed, because the Change of Address runs from that property and Google re-checks ownership. That is the one piece of this phase that must survive Phase 10 untouched.

### MEAS-03 — sitemap submitted; indexing requested for the hub + 4 pillars · **MET**

Google's own record, not ours: `sitemaps.get` returns `submitted: 27`, `errors: 0`, last downloaded 2026-09-17T21:03:34Z. Manual "Indexering aanvragen" was performed for exactly five URLs — `/diensten` plus `/diensten/airconditioning`, `/diensten/warmtepompen`, `/diensten/wtw`, `/diensten/mechanische-ventilatie` — all five already reporting "URL is on Google" with valid breadcrumb and review rich results, with `gsc/url-inspection-diensten.png` as the image.

### MEAS-04 — pre-migration baseline captured · **MET (all four parts)**

| part | evidence | machine-derived? |
|---|---|---|
| GSC performance export | 20 rows by query (new), 130 by query over 16 months (legacy) | yes — `searchAnalytics.query`, `dataState: final` |
| Ranking snapshot, top queries | 24 SERP rows × 2 domains with a local-pack column | yes — queries derived from the registry, positions read from the live SERP |
| GBP state | 18-row transcription plus three images incl. the knowledge panel | transcribed verbatim from page text |
| DNS zone snapshot | 5 zone snapshots across 7 files, before and after the nameserver switch | yes — `dig` at the authoritative nameserver |

Two properties of this baseline matter more than its size. **The zeroes are recorded as data**, not omitted: 21 of 24 SERP queries say `niet in top 20` for the new domain and 22 of 24 shortlist entries carry `zero: true`. An absence that is written down is falsifiable; an absence that is skipped is not. And **the query list is derived**, never typed — `serp-queries.json` comes from the registry's `primaryKeyword` fields, so the milestone-close retake recomputes the same list instead of trusting a copy.

The gate that enforces completeness is mechanical: it walks `docs/baseline/2026-09-16/`, and fails if any file on disk is missing from the manifest, if any placeholder row survives, or if the probe is red.

```
baseline COMPLETE: 39 files, all in the manifest; measurement probe green
```

### MEAS-05 — weekly coverage review against defined thresholds · **MET, with one deliberate substitution**

`measure-indexation.yml` runs every Monday at 06:17 UTC, asks the URL Inspection API about all 27 URLs, commits the dated reading, and on any flag opens or comments on a single `indexation-alert` issue and fails the run. Readings exist for 2026-09-17 and 2026-09-18; both report 27/27 indexed, no flags. Five flag codes are defined (`below-ramp`, `lost-indexation`, `robots-not-allowed`, `canonical-mismatch`, `count-vs-floor`), and every one was observed firing on injected input before being trusted, plus a sixth (`simulated-breach`) that exercises the alert path on demand — proven end to end in 09-05 with issue #2.

**The substitution, stated plainly.** The requirement names three GSC coverage states, including "Crawled – currently not indexed" and "Discovered – currently not indexed". The thresholds deliberately do **not** match on `coverageState`, because it is free text that varies with interface language and wording; they match on `verdict === "PASS"`, which is machine-stable. The coverage state is still captured verbatim for every URL in every reading (today: `{"Submitted and indexed": 27}`), so the exact states the requirement names remain observable and greppable in the time series — the intent is met by a more durable mechanism than the literal wording describes.

A second instrument covers the other half of the question: `verify-indexation.yml` probes production after every successful deployment and asks what we *serve*, while the weekly job asks what Google *concluded*. The two deliberately do not share data. A disagreement between them is the highest-value signal this phase can produce, and merging them would destroy it.

### MEAS-06 — Vercel Analytics enabled **and reporting** · **MET**

Enabled at 2026-09-16T22:18:46Z. Reporting confirmed 33 hours later: 5 visitors / 17 pageviews across the UTC days 09-17 to 09-18, and 7 / 22 since enabling. The distinction the requirement draws is the whole point and the probe encodes it — check 4 (the script endpoints answer 200) is reported as *necessary but not sufficient*, because Vercel serves those routes even while collection is off; only the visits count is sufficient, and without a token that check prints as SKIPPED rather than passing silently.

## Phase-level gates (D-25)

| gate | status |
|---|---|
| (a) DNS captured before and after the nameserver switch | met (09-01) |
| (b) GSC machine evidence 27/0 + ownership delegated to the client | met (09-02/09-03) |
| (c) Weekly measurement and post-deploy probe automated **and observed failing** | met (09-04/09-05) |
| (d) SERP baseline + analytics-after-24h + a re-export carrying real rows | met (09-06) |

## Honest notes

1. **The re-export was taken at 41 hours, not the planned ≥ 72.** A read-only probe showed Google had the rows; the 72-hour figure existed only to outrun the day-one lag, which was over. Recorded in the manifest, the summary and STATE rather than quietly adjusted.
2. **Google blocked the SERP capture twice** (two reCAPTCHAs, two hard 403s). Every pause was waited out and every CAPTCHA was solved by the owner. Nothing was scripted around a protection, which is why the capture took three sessions.
3. **The service-account key must still be rotated.** Its contents passed through the assistant context on 2026-09-17 during a hand-delivery. An untracked copy found in the repo tree was removed and `.gitignore` now blocks that class of filename, but rotation remains an open owner action.
4. **Code review found no critical issues**, two warnings — both fixed and proven (`09-REVIEW.md`, commit `61de3b7`) — and six info items recorded with reasoning.

## Conclusion

The phase delivers what it promised: a before-side that is on disk, derived rather than typed, complete by a gate that refuses to pass otherwise, and an instrument that keeps reading weekly and after every deployment. **Phase 10 is unblocked.**

---
*Phase: 09-measurement-foundation*
*Verified: 2026-09-18*
