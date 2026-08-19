# Pitfalls Research

**Domain:** Rebrand + domain migration + bulk indexation unlock for a Dutch local installer
**Researched:** 2026-08-20
**Confidence:** HIGH — infrastructure claims verified by live probe; Google-behaviour claims sourced and marked

> Written inline by the orchestrator after both Pitfalls research subagents failed on this OneDrive mount
> (the second spent 43 minutes without getting past file reads). Every infrastructure fact below was
> verified by direct `dig` / `curl` probe on 2026-08-19/20.

## Critical Pitfalls

### Pitfall 1: Pointing 301s at pages that are still `noindex` 🔴 HARD GATE

**What people do:** Treat the redirect work as the urgent part of a migration and ship it first.
**Why it's fatal here:** The 21 service pages currently serve `noindex, follow`. The old site's
`/wtw-unit-vervangen/` etc. hold whatever rankings the business has. Redirecting them onto noindexed
targets funnels every scrap of accumulated equity into a wall — and simultaneously removes the only
pages that *were* ranking. Worst-case outcome of the entire milestone.
**Warning sign:** Any plan where the DNS repoint precedes the status flip.
**Prevention:** Hard ordering — flip → verify indexable in production → *then* redirect. Verify with a
live probe of every redirect target (`robots` meta must not contain `noindex`) before the repoint.
**Owner:** the flip phase gates the migration phase.

### Pitfall 2: Editing GBP name + categories + URL in one session 🔴 HARD GATE — risks 34 reviews

**What people do:** Open the profile and do the whole rebrand in one sitting.
**Why it's dangerous:** Editing name, address, phone and categories together reads to Google's automated
systems as *someone taking over a listing* rather than a business updating itself — a documented
suspension trigger. The business name is described as the most-abused field on a listing and the single
most common suspension cause, ahead of address mismatches and rapid edits.
**What's actually safe:** Reviews and ratings attach to the **Profile**, not the name — a legitimate
rename keeps all 34. The risk is suspension, not review loss.
**Prevention — staged, in this order:**
1. Make the outside world agree first: website (already says TPS klimaattechniek), then directories and socials.
2. Low-risk profile edits first, spaced out: website URL → hours → Services list → photos.
3. **The name change last, alone, in its own session**, with KvK documentation ready for re-verification.
4. Never create a second listing for the new name — that splits the reviews and creates a duplicate.
5. Never keyword-stuff the name (`TPS klimaattechniek | Airco Zoetermeer` = suspension bait).

⚠️ **This inverts the intuitive order.** The instinct is "fix GBP first, then propagate to citations."
For everything *except the name* that's right. For the name specifically, corroboration must exist first.

### Pitfall 3: The apex repoint silently breaks webmail and WordPress admin 🔴 HARD GATE

**Verified topology** (`dig` / `curl`, 2026-08-19):

| Record / path | Value | Survives apex repoint? |
|---|---|---|
| `mail.tpsventilatie.nl` A | `195.78.67.39` | ✅ own record |
| MX | `10 mail.tpsventilatie.nl` | ✅ untouched |
| SPF | `v=spf1 a mx include:_spf.cyberfolks.pl -all` | ⚠️ **the `a` mechanism breaks** |
| DMARC | `v=DMARC1; p=none; sp=none` | ✅ |
| `autoconfig` | → `autodiscover.s161.cyberfolks.pl` | ✅ own record |
| `ftp` | `195.78.67.39` | ✅ own record |
| `webmail` / `cpanel` subdomains | **do not exist** | — |
| `https://tpsventilatie.nl/webmail/` | **200 — served on the APEX PATH** | ❌ **BREAKS** |
| `https://tpsventilatie.nl/wp-admin/` | **302 → wp-login.php, on the APEX PATH** | ❌ **BREAKS** |
| `https://mail.tpsventilatie.nl/...` | **invalid TLS cert (no matching SAN)** | ❌ not a usable fallback |

**Why it matters beyond inconvenience:** losing `/wp-admin` directly undermines the owner's
reversibility requirement — you cannot inspect or repair the site you're promising to be able to revert to.

**Prevention, all before the repoint:**
- `SPF`: rewrite to drop `a` → `v=spf1 mx include:_spf.cyberfolks.pl -all`. The `mx` mechanism still
  authorizes `mail.tpsventilatie.nl`, so outbound mail keeps passing. Leaving `a` in place would
  authorize *Vercel's* IP to send mail as the domain and stop authorizing the real mail server.
- **Webmail**: `https://s161.cyber-folks.pl/webmail/` returns **200** — verified. Document it for the
  owner, and/or configure an IMAP client, *before* the cutover.
- **WP admin**: establish an alternate route (hosting control panel, host-provided temporary hostname,
  or a local `hosts` entry pointing at `195.78.67.39`) and **verify it works while the old DNS is still live.**
- Send a test mail in **both directions** immediately after the repoint.

### Pitfall 4: Redirect chains — three hops by default

**Verified live:** `www.tpsventilatie.nl` → **301** → `tpsventilatie.nl`, and
`tpsklimaattechniek.nl` → **308** → `www.tpsklimaattechniek.nl`.
An inbound link to `www.tpsventilatie.nl/wtw-unit-vervangen/` would therefore walk
`legacy-www → legacy-apex → new-apex → new-www` — three hops.
**Prevention:** attach and repoint **both** legacy hostnames; match both in the `has: host` rule; build
every destination from `CANONICAL_ORIGIN` (already the `www` host); assert in CI that every target
returns a direct 200.

### Pitfall 5: Retiring the old site too early — Google needs ≥180 days

Google's site-move guidance (revised **2026-06-17**) requires redirects be maintained **at least 180 days**,
longer while Search still sends traffic. It also now requires a Change of Address request for **every
verified variant** of the old domain — `www` and non-`www` and any subdomains — submitted from a
**domain-level property**.
**Prevention:** budget the old domain and its redirects for ≥180 days (already implied by keeping the
hosting for mail). **Verify both legacy variants in GSC *before* the repoint**, while we can still place a
verification file on the WordPress host — afterwards the hostname is served by our Next app and file
verification becomes awkward.

### Pitfall 6: Publishing 21 pages at once on a 3-week-old domain

**Status: judgement, not established fact.** Community consensus, not documented Google policy.
The honest position: these pages are *not* new — they have existed and been crawlable (`noindex, follow`)
since launch, so Google has almost certainly already fetched and assessed them. Removing `noindex` is a
directive change on known URLs, not a bulk publication of unseen content. That materially lowers the risk.
**Warning signs to watch (first 2–4 weeks):** indexed count plateauing well below 27; "Crawled – currently
not indexed" climbing; "Discovered – currently not indexed" on pillar pages; impressions flat after 3 weeks.
**Prevention:** flip everything (staging adds no protection for already-crawled URLs), submit the sitemap,
manually request indexing for the hub + 4 pillars only, then let the 17 sub-services flow naturally.
Track weekly rather than daily — daily noise invites overreaction.

### Pitfall 7: Renaming the repo and Vercel project mid-flight

**What breaks:** the `*.vercel.app` deployment domain changes, every previously shared preview URL 404s,
the Git integration may need reconnecting, and any hardcoded project-name reference breaks. Custom domain
attachments generally survive, but this is exactly the wrong moment to find out.
**Prevention:** do it **last**, after indexation and the migration are verified stable. Re-verify the
custom domains, `/api/lead`, and env vars immediately afterwards. Purely cosmetic — zero SEO value —
so it must never be allowed to jeopardise the rest.

### Pitfall 8: The build gate that enforces the bug

`scripts/assert-seo.ts` asserts `sitemapEntries().length === 5` and *"draft hub must be noindex"*.
Commit `82d897b` shows the failure mode: when it broke, the expected number was **bumped to match reality**
rather than questioned. A snapshot assertion masquerading as an invariant let a 22-page noindex survive an
entire milestone.
**Prevention:** rewrite to a relational invariant (sitemap membership ⇔ `isIndexable()`, plus a floor)
**before** the flip — otherwise the flip cannot build. See ARCHITECTURE.md.

## "Looks Done But Isn't" Checklist

- [ ] Sitemap returns **27** URLs in production — not 5, not 26
- [ ] A live probe of all 21 service URLs shows **no** `noindex` in the served HTML
- [ ] Every redirect target returns a **direct 200**, no intermediate hop
- [ ] `www.tpsventilatie.nl/<legacy>` reaches the final URL in **one** hop
- [ ] Test mail sent **and received** on `info@tpsventilatie.nl` after the repoint
- [ ] SPF no longer contains the `a` mechanism
- [ ] Owner has a working webmail route that is not the apex path
- [ ] WP admin reachable by an alternate route, verified **pre**-cutover
- [ ] Both legacy variants verified in GSC **before** the repoint
- [ ] GBP still live and unsuspended 72h after the rename
- [ ] The 34 reviews still present and the rating still 4,9
- [ ] `/api/lead` still delivers after any Vercel project rename

## Recovery Strategies

| Failure | Recovery | Window |
|---|---|---|
| GBP suspended after rename | Appeal with KvK documentation; do not edit further while pending | Days–weeks |
| Mail stops flowing | Revert the apex A record; MX was never touched so the blast radius is DNS-only | Minutes + TTL |
| Rankings collapse post-migration | Redirects stay; verify no chains; confirm CoA covers all variants; wait — recovery is normally weeks | Weeks |
| Client wants the old site back | Revert 2 A records. **WordPress is never deleted** — this is why | Minutes + TTL |
| Indexation stalls | Check `robots` meta in served HTML first (not the source), then sitemap, then GSC coverage | Days |

**When it stops being reversible:** once 301s have been served and crawled for weeks and Google has
consolidated signals onto the new URLs, reverting no longer restores the prior state — it becomes a
*second* migration. Practical point of no return ≈ 3–4 weeks after the repoint.
**Capture before the repoint:** WordPress files + DB backup, full DNS zone snapshot, GSC performance
export for both domains, a ranking baseline for the top queries, and the current GBP state (name,
categories, URL, review count and rating).

## Pitfall-to-Phase Mapping

| Pitfall | Owning phase |
|---|---|
| 8 — build gate enforces the bug | Indexation unlock (first, blocks the flip) |
| 1 — 301s onto noindex pages | Ordering constraint between unlock and migration |
| 6 — bulk indexation | Indexation unlock + measurement |
| 3 — apex repoint blast radius | Migration (pre-flight checklist) |
| 4 — redirect chains | Migration |
| 5 — ≥180 days + CoA variants | Migration + measurement |
| 2 — GBP rename | GBP phase, staged, name last |
| 7 — repo/Vercel rename | Final phase, after everything is stable |

## Sources

- Live probes 2026-08-19/20: `dig` (NS/A/MX/TXT/SPF/DMARC/DKIM, both domains), `curl` (HTTP status,
  redirect targets, `robots` meta, `/webmail/`, `/wp-admin/`, TLS SAN check), WP REST inventory
- Repo reads: `lib/seo/policy.ts`, `scripts/assert-seo.ts`, `lib/services/*`, `next.config.ts`; git `82d897b`
- [Change of Address tool — Search Console Help](https://support.google.com/webmasters/answer/9370220?hl=en)
- [Google Tightens Requirements For Domain Migrations — Search Engine Journal](https://www.searchenginejournal.com/google-tightens-requirements-for-domain-migrations/579781/)
- [For site moves, specify all domain variants — Search Engine Land](https://searchengineland.com/for-site-moves-specify-all-domain-variants-with-googles-change-of-address-tool-480552)
- [How to Change Your Business Name on Google Without Getting Suspended — Optuno](https://www.optuno.com/blog/how-to-change-your-business-name-on-google-without-getting-suspended)
- [How business name changes can trigger Google profile suspensions — SearchScope](https://searchscope.com.au/google-business-profile/suspension/how-business-name-changes-can-trigger-google-profile-suspensions/)
- [How to change your Google My Business name without losing reviews — Birdeye](https://birdeye.com/blog/google-my-business-name-change/)
- [Google Business Profile Suspended After an Edit — GBP Guardian](https://gbpguardian.com/google-business-profile-suspended-after-edit)
- [SEO: HTTP Status Codes — Next.js](https://nextjs.org/learn/seo/status-codes)

---
*Pitfalls research for: rebrand + domain migration + indexation unlock*
*Researched: 2026-08-20 (inline — subagents unavailable on this mount)*
