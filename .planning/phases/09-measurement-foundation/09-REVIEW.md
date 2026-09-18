# Phase 9 — Code Review

**Reviewed:** 2026-09-18 · **Depth:** standard · **Reviewer:** inline (subagents hang on the OneDrive mount; see the project's execution constraints)

**Scope — 11 source files changed in Phase 9** (documentation, planning artefacts and `package-lock.json` excluded):

| file | lines |
|---|---|
| `scripts/gsc/auth.ts` | 90 |
| `scripts/gsc/api.ts` | 235 |
| `scripts/gsc/thresholds.ts` | 142 |
| `scripts/measure-indexation.ts` | 203 |
| `scripts/verify-measurement.ts` | 203 |
| `scripts/export-gsc-performance.ts` | 280 |
| `scripts/snapshot-dns.sh` | 93 |
| `.github/workflows/measure-indexation.yml` | 88 |
| `.github/workflows/verify-indexation.yml` | 62 |
| `package.json`, `.env.example`, `.gitignore` | config |

**Verdict: 0 Critical · 2 Warning · 6 Info.** Nothing in this phase ships to the browser — every file is a CLI or CI helper — so the blast radius of any defect here is a red CI run or a missing measurement, never a user-facing regression.

## Security posture (checked first, nothing found)

- **No key material can leak.** `auth.ts` never logs the key, the JWT assertion or the token, and a failed exchange surfaces the HTTP status only, never the response body (line 86). `api.ts` does the same for every call (line 103). Both workflows pass the secret through `env:` and echo nothing.
- **No write surface.** The token is minted with `webmasters.readonly` (line 27), and no submit/delete method is implemented in `api.ts`. `snapshot-dns.sh` invokes `dig` and nothing else, with no registrar or dynamic-DNS path.
- **Least-privilege CI.** `measure-indexation.yml` takes `contents: write` only because the bot commits a reading; `verify-indexation.yml` is `contents: read`. Actions are pinned to major versions, one secret exists, and the bot's `GITHUB_TOKEN` push cannot retrigger Actions.
- **Injection.** The only shell interpolation of external data is `${{ github.sha }}` in an issue title, which GitHub controls. Issue bodies come from `--body-file`, not from interpolated strings.
- **Key hygiene fixed during the phase.** An untracked byte-identical copy of the service-account key was found in `<repo>/.config/` and removed; `.gitignore` now blocks that class of filename (see finding 2, which sharpens the pattern).

## Warning

### 1. A transient API failure discards a completed measurement and raises a false alert

`scripts/measure-indexation.ts:141` (and `:149`)

The weekly run inspects all 27 URLs one by one (lines 120-131, ~30 s of API calls), and only then fetches the sitemap record and the optional Vercel visits count. The reading is written at line 165, *after* both. Neither call is guarded: `getSitemap` is unwrapped, and `visits7d()` handles a non-200 response but not a rejected `fetch`.

**Failure scenario.** Monday 06:17 UTC, Google's `sitemaps.get` answers 503 (or the Vercel API is briefly unreachable). `main()` rejects, the catch at line 200 exits 1, the workflow's measure step reports failure, and an issue titled "Indexation measurement flagged" is opened saying `✗ measurement crashed`. Two things then go wrong: the 27 inspections that had already succeeded are thrown away, and because no reading is committed, the following week compares against a two-week-old reading. A page that lost indexation inside that gap and regained it produces no `lost-indexation` flag at all — the regression detector is blind exactly across the window the failure created.

**Fix.** Wrap both calls, record what was missing inside the reading, and write the file regardless. The flags in `thresholds.ts` already treat `sitemap` as optional.

### 2. `.gitignore` pattern `.config/` is unanchored and matches at any depth

`.gitignore:58`

Written without a leading slash, `.config/` tells git to ignore a directory of that name *anywhere* in the tree, not just at the repo root where the stray key copy appeared.

**Failure scenario.** Someone later adds `apps/web/.config/` or `packages/mailer/.config/` holding real configuration. `git add` reports nothing, the directory never reaches CI, and the build fails on a machine that does not have the untracked files — the hardest class of "works on my machine" to diagnose, because the file is invisible to `git status`.

**Fix.** Anchor the pattern to the repo root: `/.config/`. The two filename patterns beside it (`tps-klimaattechniek-seo-*.json`, `*service-account*.json`) are deliberately unanchored and should stay that way — a key is a key at any depth.

## Info

3. **`.gitignore:57` cites the wrong decision.** The comment reads "Phase 9, D-19", but D-19 is the URL-Inspection decision; service-account key handling is D-18, which the block eight lines above cites correctly. A misleading breadcrumb for whoever next asks why the rule exists.

4. **`scripts/verify-measurement.ts:100` reports one cause as two violations.** When the served HTML has no `</head>`, `head` is the empty string, so the tag scan finds nothing and the run emits both "no `</head>` found" and "serves 0 google-site-verification meta tag(s) … NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is unset in the production build". The second message actively misdiagnoses a truncated-response problem as a missing environment variable. Returning early after the `</head>` failure would keep the diagnosis honest.

5. **`.github/workflows/verify-indexation.yml:43` sleeps after the last attempt.** The loop runs three attempts and sleeps 30 s after each failure, including the third, adding half a minute to every red run before it exits. Moving the sleep to `if [ $i -lt 3 ]` would trim it.

6. **`.github/workflows/verify-indexation.yml` has no `concurrency` group.** Its sibling workflow has one. Two production deployments finishing close together run two probes, and both can reach the create-or-comment step before either issue exists, producing two alert issues for one problem. Deployments are infrequent enough that this has not happened, and the cost when it does is cosmetic.

7. **`package.json:26` keeps the full `vercel` CLI in `dependencies`.** It predates this phase, so it is out of scope for a fix here, but the two workflows added by this phase now install it on every run — a large download for a weekly job that never invokes it. Worth moving to `devDependencies` (or dropping) when something else touches the manifest.

8. **`scripts/export-gsc-performance.ts:92` — month arithmetic rolls over, harmlessly.** `setUTCMonth(getUTCMonth() - 16)` on a 29th-31st date can land on a day the target month does not have and roll forward (2026-03-31 → 2024-12-01 rather than 2024-11-30). The rollover always moves the start date later, so the window only ever gets *shorter* and stays inside Google's 16-month limit — which is what the `+3` on the next line is for. No change needed; recorded so the next reader does not re-derive it.

## What the review confirmed as sound

- **`thresholds.ts` is a genuinely pure evaluator** — no clock, no I/O, no network, both readings and "today" injected — which is what let the flags be observed firing on fabricated input rather than trusted by inspection.
- **Regressions are matched by URL string, never array position** (`thresholds.ts:112`), so a reordered sitemap cannot fake a `lost-indexation` flag.
- **Google's int64-as-string quirk is normalised once** (`api.ts:151-168`), so every consumer compares numbers and the committed JSON carries numbers.
- **Pagination is correct** in `exportDimension` (`export-gsc-performance.ts:132-145`): it stops on a short page and advances by the page length.
- **The two probes stay deliberately separate** — `verify-indexation.ts` imports only the floor, `measure-indexation.ts` imports the governed URL collection — and each file explains why. That asymmetry is the phase's most valuable structural decision and it is intact.
- **Failure modes are named, not bucketed.** Every flag carries the offending URL, and every threshold message tells the reader not to lower the number.

## Actions taken

Findings 1 and 2 were fixed in this phase (commit `fix(09)` below). Findings 3-8 are recorded here; 3 was fixed alongside 2 as a one-word correction. 4-8 are left as-is with the reasoning above and are not blocking.

---
*Phase: 09-measurement-foundation*
*Reviewed: 2026-09-18*
