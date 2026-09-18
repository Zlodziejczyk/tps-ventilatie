# Phase 10: Reversible Old-Brand Migration - Context

**Gathered:** 2026-09-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Retire `tpsventilatie.nl` as a competing brand and hand its equity to
`https://www.tpsklimaattechniek.nl` — without breaking the owner's mail, and without closing the
door on a revert. MIG-01…MIG-10.

**In scope:** the dd24 zone work (TTL, SPF, the apex + `www` A-record repoint), the typed 9-entry
redirect map plus a path-preserving catch-all, the build-time and post-deploy gates that prove it,
attaching both legacy hostnames to Vercel, the owner-facing webmail and WP-admin routes, the mail
round-trip proof, the Change of Address, the rollback procedure, and a credential-free content
mirror of the old site.

**Not in scope (belongs elsewhere):** any Google Business Profile *edit*, including the website-URL
field (Phase 11 — see D-26); off-site NAP / citation cleanup (Phase 11); the keyword→page map and
title/meta rewrite (Phase 12); the kennisbank (Phase 12); the repo and Vercel project rename
(Phase 13).

**Why this phase is here:** the redirect targets must already be indexable (Phase 8 — pointing 301s
at `noindex` pages funnels every scrap of legacy equity into a wall) and the legacy property must
already be GSC-verified and baselined (Phase 9 — that window only existed while the old DNS still
resolved to WordPress). Both are now done.

**The point of no return.** Roughly 3–4 weeks after the repoint, Google has consolidated signals
onto the new URLs and reverting no longer restores the prior state — it becomes a *second*
migration. D-11 fixes that moment at day 28 and makes it an explicit, dated act rather than a date
that quietly passes.

</domain>

<decisions>
## Implementation Decisions

> Carried-forward locks that are **NOT re-opened**: `lib/seo/policy.ts` is the only place sitemap
> membership and the `robots` directive are decided (P1 D-08, P3 D-02, P8 D-05). Build gates are
> `tsx` + `node:assert` CLIs wired into `prebuild`, never a test framework (P8 D-01). Vercel preview
> is the build gate; there is no local `next build` on this OneDrive mount (P8 D-08). `INDEXABLE_FLOOR`
> is the single named source of "how many pages complete looks like" (P8 D-25). The two probes stay
> distinct and both stay (P9 D-23). Legacy GSC verification is never removed (P9 D-07). Redirects live
> in `next.config.ts`, never `.htaccess`; per-URL map over a blanket redirect; WordPress is never
> deleted; `info@tpsventilatie.nl` is kept indefinitely (PROJECT.md Key Decisions).

### Access Reality & Requirement Corrections

- **D-01 — We hold dd24 (the domain and its DNS) and nothing else on the old stack.** WordPress
  admin, the cyberfolks hosting panel and the `info@tpsventilatie.nl` mailbox are all held by
  cyberfolks/Thomas. **`PROJECT.md` §Context is wrong** where it says *"Access held for v1.1: admin on
  the TPS Google Business Profile, and on the old site's hosting"* — the hosting half is false and must
  be corrected as part of this phase. Walking MIG-01…10 against what we actually hold: **only MIG-01
  could not be executed from our side** (there is no way to pull a WordPress database over HTTP; the
  REST API yields page *content*, not the install). Everything else is ours (dd24 / repo / Vercel /
  GSC) or ~30 seconds of Thomas's time.

- **D-02 — MIG-01 is reduced to a credential-free public content mirror, and the residual risk is
  explicitly accepted.** The premise of MIG-01 as written is a non-sequitur: the DNS change moves two
  A records and touches neither the files, the database, the vhost nor the subscription, so the install
  stays alive on cyberfolks and reverting the two records brings it back within TTL. **A backup does not
  protect reversibility — "we never touch the install" plus "the subscription stays for mail" does.**
  What MIG-01 would have insured against is three slower risks, all now **accepted**: (1) the install
  rots unpatched — WP **7.1.1**, version advertised in the generator meta, `readme.html` reachable, CF7
  exposed on the REST API, and nobody patches a site that is no longer the website, so a later
  compromise means a DNS revert restores a *compromised* site; (2) the cyberfolks subscription ends —
  it is paid for `info@` alone, so if mail ever moves the WordPress install leaves with it; (3) a
  host-side accident with retention unknown to us. **Storing a backup at cyberfolks is not "off-host"** —
  same host, same single point of failure as risks 2 and 3. What we do instead: a `wget`/`httrack`
  mirror of the 9 public legacy pages and their assets, taken by us **while the old site is still
  live**, depending on nobody. No ask on Thomas.

- **D-03 — The MIG-01 change is recorded by amending the milestone artefacts, not by a footnote.**
  Rewrite `MIG-01` in `.planning/REQUIREMENTS.md`, and adjust `.planning/ROADMAP.md` §"Phase 10"
  success criterion 4 and the `MIG-01…04` hard-gate line, to say what we actually intend and why —
  as an explicit, dated decision inside this phase. A requirement nobody intends to meet as written
  rots into a false "complete" checkbox; that is the Phase 8 lesson wearing a different costume, and
  the verifier checks this phase against those success criteria.

### Pre-flight dd24 Zone Work (MIG-02)

- **D-04 — TTL: lower the apex and `www` A records to 300 s, at least 8 h before the cutover, and
  hold them low for the whole ~28-day reversibility window; restore to 28800 at the day-28 final
  declaration.** Live-probed 2026-09-18: every record in that zone runs **TTL 28800 (8 hours)**, so
  "rollback = revert 2 A records in minutes" is currently false — a revert would take up to 8 hours to
  reach every resolver, including the owner's own mail client. Holding it low through week 2–3 matters
  because that is the likeliest moment someone notices a problem. **Only the two records that change
  get touched** — MX, the `mail` A record, SPF, DMARC and DKIM are not edited.

- **D-05 — Drop the SPF `a` mechanism in the same dd24 session that lowers the TTLs, ≥8 h before the
  cutover.** Target: `v=spf1 mx include:_spf.cyberfolks.pl -all`. Right now `a` resolves to the mail
  server itself, so removing it is a deliverability no-op — `mx` and the `include` keep authorizing
  `mail.tpsventilatie.nl`. Doing it early means it is fully propagated before the apex moves, which
  closes the window where a cached SPF-with-`a` plus a fresh Vercel apex would authorize **Vercel's
  IPs to send mail as the domain**, and it keeps a mail problem from ever being confused with the
  repoint. Rejected: changing SPF at the moment of cutover (one fewer dd24 visit, but SPF carries the
  same 28800 TTL, so the old record stays cached for hours *while the apex already points at Vercel* —
  precisely the exposure window, inside one entangled blast radius).

- **D-06 — HARD CONSTRAINT: `google-site-verification=DvCnCNBbXd73JTab3-DsDmq_KgkQmlCZ7onK6OqDkoI`
  must not be touched while editing that zone.** Both legacy URL-prefix properties are recorded in the
  baseline as **`verified (inherited)`** from the Domain property, which is verified by that DNS TXT —
  not by an HTML file on the WordPress root. That is why verification survives the repoint
  automatically and MIG-09's Change of Address keeps its source properties. Removing the TXT record to
  "tidy up" would silently unverify all three legacy properties and kill the CoA. This makes P9 D-07
  concrete rather than aspirational.

### Cutover Execution (MIG-07)

- **D-07 — The user edits the two A records by hand at dd24, inside a live Claude session.** Claude
  supplies the exact host / type / value / TTL beforehand, then within minutes of the flip: confirms
  with `dig` against **all three** dd24 nameservers, probes all 9 redirects from **both** legacy
  hostnames, confirms Vercel issued the certificate, and runs the mail round-trip. Extends P9 D-03
  (which covered TXT records only) to the repoint itself, on the same reasoning: that zone holds MX +
  SPF + DMARC + DKIM for the owner's working mailbox, and dd24 already suspended this domain once
  (2026-08-12, contact verification — check the status banner before touching anything). Rejected:
  Claude driving Chrome in the dd24 panel (highest blast-radius action in the milestone), and an async
  edit verified at the next session (leaves the TLS gap, a broken redirect or a mail failure unobserved
  for hours — exactly the window where a revert is still cheap).

- **D-08 — HARD CONSTRAINT: both legacy hostnames are attached to the Vercel project as ordinary
  serving domains, with no Vercel-level domain redirect between them.** Vercel's default when you add
  an apex and a `www` is to redirect one to the other — which would rebuild the exact chain the map
  exists to kill. Repointing only the apex is equally wrong: it strands the legacy `www`→apex 301 on
  the old host and preserves a three-hop walk (`legacy-www → legacy-apex → new-apex → new-www`).

- **D-09 — The map is proven green *before* any DNS record changes, via a spoofed `Host` header.**
  Attach both legacy hostnames to the Vercel project first (DNS still on WordPress; Vercel will show
  "Invalid Configuration" — that is expected), then probe the deployment directly:
  `curl -H 'Host: www.tpsventilatie.nl' https://<deployment><source>`. The `has: host` matcher sees
  the legacy host and the whole map runs. All 9 sources × both hostnames plus a catch-all sample are
  proven before the one-way door opens. Rejected: an `/etc/hosts` override (mutates this machine,
  cert won't match, proves nothing about other resolvers) and verifying only after cutover (the
  pre-flight checklist stops being a gate, and the first observers of a broken map are Google and real
  visitors).

### Rollback (MIG-10)

- **D-10 — Rollback triggers are mail and TLS only.** Revert the two A records immediately if
  `info@tpsventilatie.nl` fails to send **or** receive, or if either legacy hostname lacks a valid
  certificate ~30 minutes after the flip. **Search performance never triggers a revert** — a
  post-migration dip is expected, the 180-day floor and the Phase 9 baseline exist to ride it out, and
  reverting mid-consolidation makes it permanently worse. **A broken redirect is fixed by a deploy, not
  by DNS** — pulling the DNS lever for an app-layer bug is the heaviest tool for the lightest problem.
  Rejected explicitly: a named traffic floor in weeks 1–2 (by the time a traffic signal is legible,
  reverting no longer restores the prior state — it starts a second migration from a worse position).

- **D-11 — Day 28 is the declared point of no return.** On that day: the migration is declared final in
  a dated note written into `docs/baseline/`, and the TTLs go back to 28800. Before it, revert is a
  live option; after it, revert is a second migration. The rollback document must also state the silent
  dependency D-02 exposed: **the old WordPress install lives only as long as the cyberfolks
  subscription does, and that subscription exists only for `info@tpsventilatie.nl`.**

### Redirect Map (MIG-05)

- **D-12 — A path-preserving catch-all, `/:path*` → `${CANONICAL_ORIGIN}/:path*`, placed *after* the 9
  explicit rules so it can never shadow one.** The load-bearing reason is not politeness to unmapped
  URLs: **without a catch-all the Next app serves every new route under the old hostname** —
  `tpsventilatie.nl/tarieven` would render the full new site under the brand we are retiring. Path
  preservation keeps every hop count at 1 (`/over-ons` → `/over-ons`, a direct 200), absorbs the
  no-trailing-slash variants without doubling the rules, and lets WordPress leftovers (`/feed/`,
  `/wp-json/*`, `/wp-content/uploads/*`) land on the new site's 404 — honest, and visible in GSC as a
  list of things we could still map. Rejected: catch-all → homepage (Google reads mass redirect-to-home
  as soft-404 and it silently swallows any legacy URL we failed to map, including the owner's own
  `/wp-admin/` and `/webmail/` paths) and an added 410 set for WP paths (410 is not expressible in
  `next.config` `redirects()`; it needs middleware or a route handler, a mechanism this phase otherwise
  does not require).

- **D-13 — `/mechanische-ventilatie-dakventilator/` → `/diensten/mechanische-ventilatie` (the pillar),
  not `…/aanleggen`.** This is the one judgement entry in the 9, and the research table's proposal is
  **contradicted by the live page**, fetched 2026-09-18: its H2 is *"Dakventilator Onderhoud"* and its
  three packages are maintenance/cleaning (€190, €250) and replacement (€700). There is no
  new-installation content on it at all. Because the page spans maintenance, cleaning *and* replacement,
  no single sub-service matches it; the pillar hands the visitor all four (`vervangen`,
  `onderhoud-reinigen`, `storing`, `aanleggen`) with the intent intact. This evidence travels with the
  entry (see D-16) so nobody re-litigates it from the research table.

- **D-14 — Explicit `statusCode: 301`, not `permanent: true`.** Next's `permanent: true` emits **308**.
  Google treats 308 as equivalent for consolidation, so this buys nothing from Google — but it costs
  nothing either, it matches MIG-05/MIG-07 and the roadmap verbatim, and it is what an SEO auditor or a
  third-party migration checker will look for on a brand move. It removes a permanent explanation
  footnote from a repo whose culture is to assert the relationship rather than annotate the exception.

- **D-15 — The legacy host's `/robots.txt` and `/sitemap.xml` are 301'd like everything else.** Google
  follows `robots.txt` redirects and applies the target's rules, which allow crawling — so the legacy
  redirects stay discoverable. Legacy `/sitemap.xml` → the new sitemap is a clean site-move signal. No
  Host-branching mechanism, no exception to explain, and it retires the stale `/wp-sitemap.xml` pointer
  that the legacy `robots.txt` advertises and that 404s today.

- **D-16 — Every entry carries `confidence: "certain" | "judgement"`, and `assert-redirects.ts`
  requires a non-empty `why` on every `judgement` entry.** The research table already classifies all
  ten this way. The dakventilator call then travels with its own evidence in the file that outlives
  every planning document, and the next judgement call is structurally forced to explain itself.
  Rejected: a bare `{from, to}` shape (`.planning/` is archived at milestone close and the map lives
  forever — in six months the dakventilator target is a mystery someone "fixes") and a mandatory `why`
  on every entry (eight would read "exact 1:1 equivalent", which trains readers to skip the field on
  the one entry where it matters).

### Gates & Verification (MIG-06)

- **D-17 — Split the gate: structural at build time, live after deploy.** `assert-redirects.ts` joins
  the existing `prebuild` chain and checks **structure only** — no duplicate sources, no destination
  that is itself a source (chains), every destination derived from `CANONICAL_ORIGIN`, every destination
  resolving to a real indexable taxonomy route, and sources carrying the trailing slash the legacy site
  uses. The **live** assertion — direct 200, exactly one hop, from **both** legacy hostnames — extends
  `scripts/verify-indexation.ts`, which Phase 9 already runs in CI on every production
  `deployment_status`. Two probes, two questions — the P8 D-22 / P9 D-23 pattern. Rejected: a full
  network check inside `prebuild` (every Vercel build would depend on production being reachable, the
  build would assert against the deployment it is itself producing, and a transient blip becomes a red
  build) and a live-only check (a chain or duplicate source would surface only after it shipped, and
  `prebuild` is the only thing standing between a regression and production on this repo).

- **D-18 — "Exactly one hop" is asserted from `https://`, on both legacy hostnames.** For each of the
  9 sources × both hostnames: `https://<host><source>` returns **301 directly** to the final
  `https://www.tpsklimaattechniek.nl<target>`, which returns **200** — plus a catch-all sample. Vercel's
  automatic `http`→`https` **308** is platform-level and cannot be configured away; it is **recorded in
  the probe output as a known, accepted extra hop** for http-only inbound links rather than quietly
  excluded. Asserting the `www` side is not optional: `www.tpsventilatie.nl` is precisely where the old
  chain lived.

- **D-19 — No additional scheduled HTTP watch on the redirects; the deploy-triggered probe is the only
  direct live check.** *(User's deliberate choice against the recommendation — recorded as such.)*
  **Reconciliation:** because D-25 extends the weekly cron to inspect the 9 legacy URLs via GSC, the
  drift class this would have covered — a detached Vercel domain, a lapsed certificate, a DNS change —
  is **not** fully uncovered. It surfaces there as Google failing to fetch those URLs, with Google's lag
  rather than a direct HTTP check. The planner should not treat this as an unmonitored gap, nor as
  equivalent coverage.

### Owner Continuity & Mail (MIG-03, MIG-04, MIG-08)

Re-probed live 2026-09-18 — unchanged from the 2026-08-19 research: `tpsventilatie.nl/webmail/`
returns **200** and `tpsventilatie.nl/wp-admin/` returns **302 → /wp-login.php**, both served on the
**apex path**, so both stop existing at cutover. `mail.tpsventilatie.nl` refuses 443 and its
certificate is `*.cyber-folks.pl` only — it never was a fallback. `webmail.` and `cpanel.` subdomains
do not exist.

- **D-20 — Webmail: document `https://s161.cyber-folks.pl/webmail/`.** Re-verified 200 on 2026-09-18.
  It is the host's own hostname, so it is completely unaffected by anything we do in DNS — no records,
  no certificates, no third-party access — and because it already works, "verified before cutover" is
  satisfied today. Accepted costs: an unmemorable URL Thomas must bookmark, and it moves if cyberfolks
  ever re-provisions him off server `s161`. Rejected: a branded `webmail.tpsventilatie.nl` subdomain
  (that box serves `*.cyber-folks.pl` only, so cyberfolks would have to add the subdomain and issue a
  certificate — blocked on access we do not hold, per D-01).

- **D-21 — WP-admin: an `/etc/hosts` override, with `siteurl` left untouched.** Point
  `tpsventilatie.nl` → `195.78.67.39` on whichever machine needs admin. WordPress hardcodes
  `siteurl = https://tpsventilatie.nl`, so after cutover *any* other route bounces back to the apex —
  which is now our 301. The override sidesteps that and makes WP behave exactly as it does today, which
  also means **a rollback stays a pure 2-record DNS revert with no WP-side undo**. **Documented caveat:**
  the old box's Let's Encrypt certificate cannot renew after cutover (HTTP-01 validation would hit
  Vercel), so within ~90 days this route shows a certificate warning; a DNS revert restores validation
  and it renews again. Rejected: a branded `oud.tpsventilatie.nl` plus a `siteurl` repoint — it would
  turn "revert 2 A records" into a three-step procedure, trading the phase's core promise for
  convenience.

- **D-22 — MIG-04 is green only when both halves are proven.** *Mechanical half (ours):* with the hosts
  override in place, `https://tpsventilatie.nl/wp-login.php` serves the real WordPress login form and
  not our app — recorded as the exact hosts line plus the expected response. *Human half (Thomas, once,
  pre-cutover):* he logs in through it and confirms; the confirmation is dated and recorded. Rejected:
  a route-only proof — "verified working" would be half-true on a named hard gate, and the untested half
  is exactly the failure it insures against (nobody can get into the rollback target).

- **D-23 — MIG-08 is proven by a reply round-trip with headers captured.** Right after the flip we send
  to `info@tpsventilatie.nl` from an external address and ask Thomas to hit reply. **His reply proves
  both directions in one action** — receipt and send — and we capture the full headers from it (the
  `Received` chain, `spf=pass`, `dkim=pass`, `dmarc=pass`) into `docs/baseline/` as machine evidence.
  Total effort from Thomas: one reply. Rejected: mail-tester (only exercises outbound — receiving is
  the half a broken MX or a DNS mistake would kill) and two separate tests (two actions from him at the
  exact moment we most need a fast answer).

### Change of Address & the 180-Day Floor (MIG-09)

- **D-24 — File the Change of Address the same day, once the one-hop probe is green from both legacy
  hostnames.** Google validates the redirects at submission, so they must already be live. Filed from
  the legacy **Domain** property plus **both** legacy URL-prefix properties — the 2026-06-17 guidance
  asks for a CoA covering every verified variant. D-06 is what keeps those three properties verified
  through the cutover. Rejected: a 72-hour soak (three days where Google crawls 301s with no site-move
  signal attached).

- **D-25 — Extend the Phase 9 weekly cron with a legacy section, so retiring the map becomes
  evidence-driven rather than date-driven.** Add, to the existing weekly GitHub Actions job: Search
  Analytics for `tpsventilatie.nl` — which answers the *actual* 180-day condition, "is Search still
  sending traffic to the old domain?" — and URL Inspection on the 9 legacy URLs, which exposes Google's
  chosen canonical per URL and is the definitive "consolidation happened" signal. Flag when legacy
  impressions have been ~0 for N consecutive weeks. Rejected: a dated note in the rollback document —
  this repo has already lived that failure mode (three build guards sat RED for weeks because nothing
  executed them); a documented instruction nobody runs is indistinguishable from no instruction.

### Brand Continuity

- **D-26 — A permanent, small "voorheen TPS Ventilatie" line in the footer (and/or `over-ons`) —
  unconditional, not arrival-detected.** No query parameter, no client component, no dismissal state,
  zero SEO risk. It is also actively useful to the migration: an explicit old-name → new-name
  association on the site is the entity signal this milestone wants Google to read, and it catches
  people searching the old brand. **It is site copy, so it goes through the owner's editorial gate.**
  *Mechanical note for the planner:* a 301 does not reveal its origin — the `Referer` on the redirected
  request is the original referrer (usually Google), not the legacy host — which is why the conditional
  banner alternative would have required `?from=legacy` on every destination. A full interstitial was
  never on the table; Google penalises those.

- **D-27 — The GBP website-URL edit stays in Phase 11.** After cutover the GBP link lands correctly in
  one hop, so it is a slightly weaker signal, not a failure, and Phase 10 stays scoped to DNS,
  redirects and mail — already the riskiest phase in the milestone. **Handoff note for Phase 11:** the
  URL field belongs in the low-risk early group (research's "9a") and must **not** be batched with the
  name change — editing name + categories + URL together reads to Google's automated systems as a
  listing takeover, and 34 reviews plus a 4,9 rating ride on that.

### Mirror Storage

- **D-28 — The legacy content mirror lives in git at `docs/baseline/<capture-date>/legacy-site-mirror/`,
  with a size ceiling.** It is public HTML and images — no personal data, unlike a database dump — so
  unlike a backup it can safely be committed, versioned, and sit next to the DNS and GSC baselines where
  someone can reach it during an incident. **Rule so it cannot bloat the repo silently:** if the mirror
  exceeds ~25 MB, the HTML stays in git and the images move to external storage with the location and a
  SHA-256 recorded in the baseline manifest. **Measured at execution, not guessed now.** Take it
  **before** the cutover, while the old site is still live.

### Claude's Discretion

- Module layout and naming inside `lib/seo/*` for the redirect map, and the internals of
  `assert-redirects.ts` — within the no-barrel `lib/seo/*` family and the `tsx` + `node:assert` gate
  convention.
- Whether the live one-hop assertion extends `scripts/verify-indexation.ts` directly or lands as a
  sibling script it calls — D-17 fixes the split, not the file layout.
- Whether Phase 10 runs on a `gsd/phase-10-reversible-old-brand-migration` branch (the P8 D-08 pattern)
  or straight on `main`; commit granularity throughout.
- The exact shape of the day-28 "declared final" record and where in `docs/baseline/` it sits.
- Mirror tooling (`wget` vs `httrack`) and its exact flags, provided the result is the 9 public pages
  plus their assets and is reproducible from a recorded command.
- How `docs/seo-owner-runbook.md` absorbs the webmail URL (D-20), the hosts-override line (D-21) and
  the rollback procedure (D-10/D-11) — and the exact Dutch wording throughout.
- The N in D-25's "legacy impressions ~0 for N consecutive weeks", and the reporting shape of the
  legacy section within the existing weekly workflow.
- Exact Dutch wording of the D-26 footer line, drafted for the owner's editorial gate.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope
- `.planning/ROADMAP.md` §"Phase 10: Reversible Old-Brand Migration" — goal, the 6 success criteria,
  the "why here" note, and the `MIG-01…04` hard-gate line. **Criterion 4 and the hard-gate line are
  amended by D-02/D-03 in this phase.**
- `.planning/REQUIREMENTS.md` — MIG-01…MIG-10 verbatim; §"Open Questions" #1 (DNS-zone access
  **confirmed**). **MIG-01 is rewritten by D-02/D-03 in this phase.**
- `.planning/ROADMAP.md` §"Phase 11: Local Presence — GBP & Citations" — read for what D-27 hands over.

### Milestone research (the diagnosis this phase acts on)
- `.planning/research/PITFALLS.md` §Pitfall 3 — "the apex repoint silently breaks webmail and WordPress
  admin", with the verified record-by-record survival table; §Pitfall 4 — redirect chains, three hops by
  default; §Pitfall 5 — ≥180 days and the CoA-for-every-variant requirement; §"Looks Done But Isn't"
  checklist; §"Recovery Strategies" and the point-of-no-return note
- `.planning/research/ARCHITECTURE.md` §"Pattern 2: Host-conditional redirects"; §"Data Flow → Legacy
  traffic" including the redirect-chain hazard and its three prevention rules; §"Proposed legacy →
  current URL map (9 entries)" — **note D-13 overrides the dakventilator row on live-page evidence**;
  §"Build Order" steps 6–8; §"Anti-Pattern 3: Hand-typed redirect destinations"
- `.planning/research/SUMMARY.md` — the sequencing findings

### Carried-forward decision locks
- `.planning/phases/09-measurement-foundation/09-CONTEXT.md` — D-03 (user places DNS records by hand;
  D-07 here extends it to the repoint), D-05 (the property shape and which one the CoA runs from),
  D-07 (legacy verification never removed — made concrete by D-06 here), D-19/D-20/D-21 (the weekly
  measurement script, thresholds and cron that D-25 extends), D-23 (two probes, two questions),
  D-26 (the legacy zone now lives at dd24 — no cyberfolks access needed for the repoint or the SPF fix)
- `.planning/phases/08-indexation-unlock/08-CONTEXT.md` — D-22/D-23/D-24/D-25 (`verify-indexation.ts`,
  its assertions, and the `INDEXABLE_FLOOR` import), D-01 (all guards build-blocking in `prebuild`),
  D-05 (source-agnostic checkers; never a parallel list)
- `.planning/PROJECT.md` §Key Decisions (the four v1.1 migration rows), §Constraints (OneDrive
  execution constraint — no local `next build`), §Context (old-site topology; **the "access on the old
  site's hosting" line is corrected by D-01**)

### Baseline evidence (the pre-migration state this phase moves away from)
- `docs/baseline/2026-09-16/README.md` — the manifest and the date rule; §2 row for
  `gsc/legacy-url-prefix-status.md` is the source for D-06's "verified (inherited)" finding
- `docs/baseline/2026-09-16/dns/tpsventilatie.nl-2026-09-16T203208Z.txt` — the legacy zone as dd24
  serves it; the diff target after cutover
- `docs/baseline/2026-09-16/dns/tpsventilatie.nl-pre-switch-2026-09-16T175840Z.txt` — the only record of
  the cyberfolks-era zone; not reproducible
- `docs/baseline/2026-09-16/gsc/` — the Search Analytics exports both sides of the migration are
  measured against (legacy: 130 rows by query over 16 months)

### Operational docs
- `docs/seo-owner-runbook.md` — gains the webmail route (D-20), the hosts-override line (D-21) and the
  rollback procedure (D-10/D-11)
- `scripts/verify-indexation.ts` — the live-output probe D-17/D-18 extend
- `scripts/measure-indexation.ts` + `.github/workflows/` — the weekly GSC job D-25 extends
- `scripts/snapshot-dns.sh` — re-run and diff the zone after cutover (P9 D-14's whole purpose)

### Code this phase touches or depends on
- `next.config.ts` — currently only `trailingSlash: false` + `images.formats`; gains `redirects()`
- `lib/seo/redirects.ts` — **new**; the typed map (D-12…D-16)
- `lib/constants.ts` — `CANONICAL_ORIGIN` = `https://www.tpsklimaattechniek.nl` (line 51); every
  destination derives from it, never hand-typed. `SITE.email` stays `info@tpsventilatie.nl` (owner's call)
- `lib/seo/policy.ts` — `sitemapEntries()`; the source D-17 resolves destinations against
- `scripts/assert-redirects.ts` — **new**; joins the `prebuild` chain
- `package.json` — the `prebuild` chain (currently 8 guards, ~1.7 s)
- `components/Footer.tsx` — D-26's "voorheen TPS Ventilatie" line
- `lib/reviews.ts` — **do not edit**; four quotes contain "TPS Ventilatie" as verbatim customer words

### External references
- [Change of Address tool — Search Console Help](https://support.google.com/webmasters/answer/9370220?hl=en)
- [For site moves, specify all domain variants — Search Engine Land](https://searchengineland.com/for-site-moves-specify-all-domain-variants-with-googles-change-of-address-tool-480552)
- Next.js `redirects()` — `has: [{ type: "host" }]` matching, `statusCode` vs `permanent`, and the fact
  that redirects are evaluated **before** filesystem routes (why D-12's ordering and D-15 both work)

</canonical_refs>

<code_context>
## Existing Code Insights

### Live external state (probed 2026-09-18, during this discussion)

| Fact | Value |
|---|---|
| Legacy NS | `ns1/2/3.domaindiscount24.net` — D-26 already moved it; no cyberfolks access needed |
| Legacy apex + `www` A | both `195.78.67.39`; **authoritative TTL 28800 on every record** |
| `www.tpsventilatie.nl` | HTTP **301 → apex**, served by LiteSpeed; disappears once `www` points at Vercel |
| SPF | `v=spf1 a mx include:_spf.cyberfolks.pl -all` — still carries the `a` |
| Apex TXT | GSC token `DvCnCNBbXd73JTab3-DsDmq_KgkQmlCZ7onK6OqDkoI` — **do not touch (D-06)** |
| MX / `mail` A / DMARC / DKIM | `10 mail.tpsventilatie.nl` / `195.78.67.39` / `p=none` / selector `x` — untouched by this phase |
| All 9 legacy sources | HTTP **200** (spot-checked `/`, `/over-ons/`, `/wtw-unit-vervangen/`, `/mechanische-ventilatie-dakventilator/`) |
| Legacy WordPress | **7.1.1**, generator meta public, `readme.html` 200, CF7 on the REST API |
| `s161.cyber-folks.pl/webmail/` | **200** — the D-20 route, host-level, DNS-independent |
| `mail.tpsventilatie.nl:443` | refused; cert SAN is `*.cyber-folks.pl` only |
| New domain | `www` = Vercel Production (200), apex 308→`www`, sitemap serves **27** URLs |

### Reusable Assets
- **`scripts/verify-indexation.ts`** — already asserts direct-200, no-intermediate-hop and
  self-canonical across the sitemap, and imports `INDEXABLE_FLOOR`. P8 D-24 built the no-redirect and
  self-canonical checks *specifically* for this phase: it arrives already load-bearing for D-18.
- **The `scripts/assert-*.ts` family** — `tsx` + `node:assert`, intentional `console` output, non-zero
  exit aborts the build; eight already wired build-blocking in `prebuild`. `assert-redirects.ts` joins
  this family rather than inventing a mechanism.
- **`scripts/measure-indexation.ts` + the weekly GitHub Actions cron** — a service account, URL
  Inspection over 27 URLs, dated readings committed back, an issue opened on breach. D-25 adds a legacy
  section to a machine that already exists and has already been observed firing on a simulated breach.
- **`scripts/export-gsc-performance.ts`** — the Search Analytics export D-25's traffic question reuses.
- **`scripts/snapshot-dns.sh`** — built in P9 D-14 precisely so the zone can be re-run and diffed after
  the cutover.
- **`CANONICAL_ORIGIN`** — one constant, already the `www` host. Every destination derives from it,
  which is prevention rule 1 against chains.

### Established Patterns
- **Assert relationships and named floors, never snapshots.** `INDEXABLE_FLOOR = 27` is derived and
  carries an anti-bump failure message. D-17's structural checks follow the same spirit: they say what
  *wrong* means, not what today's values happen to be.
- **Two probes, two questions.** One asserts what we serve, one asserts what Google concluded; a
  disagreement between them is the highest-value signal available. D-17 and D-25 keep that split.
- **Build-time CLIs, not a test framework.** No jest/vitest, by decision.
- **Vercel preview is the build gate.** There is no local `next build` on this OneDrive mount; new
  `prebuild` entries are validated by pushing.
- **Secrets never enter the repo.** The GSC service-account key is an env var / repo secret only.
  *(Outstanding owner action carried from Phase 9: rotate that key.)*

### Integration Points
- `next.config.ts` — gains `redirects()`, importing the typed map; the map must stay pure and
  serialisable.
- `package.json` `prebuild` — where `assert-redirects.ts` joins the chain of eight.
- `.github/workflows/` — the existing weekly job gains D-25's legacy section; the existing
  `deployment_status` job carries D-18's live assertion.
- **Vercel project `prj_vL6mnZFhKHcxBjmyeCtrhJEKob0Q`** — both legacy hostnames attach here, as
  serving domains with no Vercel-level redirect (D-08).
- **dd24 panel** — TTL, SPF and the two A records; the only external system this phase mutates.
- `docs/baseline/<capture-date>/` — gains the mirror (D-28), the post-cutover DNS diff, the mail
  headers (D-23) and the day-28 declaration (D-11).

</code_context>

<specifics>
## Specific Ideas

- **"The backup does not protect reversibility."** The single most useful reframe of this discussion,
  and it came from the user challenging the requirement rather than from the research. What protects
  reversibility is *not touching the install* plus *the subscription staying for mail*. Write MIG-01's
  amendment so the next reader gets the reasoning, not just the new text.

- **The dd24 trap.** That registrar suspended this domain once already (2026-08-12, contact
  verification). Read the status banner before touching anything, change only what D-04/D-05 name, and
  leave the GSC TXT alone (D-06).

- **Prove it before the door opens.** D-09's spoofed-`Host` probe is what makes "the pre-flight
  checklist completes before any DNS change" a real gate instead of a sentence. The full map, both
  hostnames, green — while the old site is still serving.

- **The reply is the proof.** D-23 gets both mail directions from a single action by the one person
  whose time we cannot schedule. Design the ask that way — one mail, "kun je even antwoorden?".

- **Record the http hop, don't hide it.** D-18's probe output should name Vercel's `http`→`https` 308
  explicitly. An accepted extra hop that is written down is falsifiable; one that is silently excluded
  from the assertion is a surprise waiting for the next reader.

- **Two things I raised and then disproved — do not re-raise them.** (1) Legacy GSC verification does
  *not* break at cutover: the URL-prefix properties are `verified (inherited)` from a DNS-TXT-verified
  Domain property, so nothing needs protecting except the TXT record itself (D-06). (2) There is *no*
  stray old-brand reference to clean up in shipped code: all eight hits are deliberate — `SITE.email`
  by the owner's decision, `privacy-beleid` in consequence, and four `lib/reviews.ts` quotes that are
  verbatim customer words. The only internal residue left is the repo/Vercel project name, already
  Phase 13.

- **The subscription is the real single point of failure.** The old WordPress install lives exactly as
  long as the cyberfolks subscription, and that subscription exists only for `info@tpsventilatie.nl`.
  State it in the rollback document (D-11) — it is the one dependency nobody would think to check.

</specifics>

<deferred>
## Deferred Ideas

- **A full WordPress files + database backup, off-host and restore-tested.** Consciously dropped from
  MIG-01 (D-02) with risks 1–3 accepted. If the cyberfolks subscription is ever at risk, or if anyone
  wants insurance against the unpatched install being compromised, this returns as a small standalone
  task — it needs one artefact from Thomas, not credentials, and restorability can be confirmed locally
  in a throwaway WordPress without any cyberfolks access.

- **Cyberfolks hosting-panel access (ideally a sub-account).** Not needed for any MIG requirement as
  now scoped. Would be needed for: a server-side backup, a branded `webmail.`/`oud.` subdomain with a
  valid certificate, or anything that has to keep the old install healthy rather than merely intact.

- **A scheduled live HTTP watch on the 9 redirects** (weekly, or daily through the first 30 days).
  Declined at D-19. Revisit if the legacy domain's attachment or certificate ever does drift — the
  weekly GSC reading would show it late rather than not at all.

- **GBP website-URL change** — Phase 11, with D-27's handoff note (low-risk early group; never batched
  with the name change).

- **A conditional "you arrived from the old domain" notice.** Superseded by D-26's unconditional footer
  line. If it ever returns, note that it needs `?from=legacy` on every destination — a 301 does not
  reveal its origin.

- **Retiring the redirect map.** Gated on D-25's evidence, not on a calendar date, and never before the
  180-day floor. When legacy impressions have been ~0 for N consecutive weeks, that is the conversation
  — and it is a separate decision from this phase.

- **The GSC service-account key rotation** — carried from Phase 9 as an outstanding owner action. Not
  this phase's work, but it touches the same credential D-25's extension will use.

</deferred>

---

*Phase: 10-Reversible Old-Brand Migration*
*Context gathered: 2026-09-18*
