# Phase 5 — User Setup (launch gate 05-06)

Status: **Incomplete** — these are the dashboard/auth steps no script can do for you.
Everything code-side (Waves 1–3) is done and on branch `gsd/phase-05-lead-capture-form-security-launch-qa`.

There are **two independent GHL hookups** — don't confuse them:

| | Purpose | Credential | Can Claude automate it? |
|---|---|---|---|
| **A. GHL MCP** | Let Claude Code drive GHL (contacts, conversations, etc.) in future sessions | Private Integration **Token** (`pit-…`) + **Location ID** | Config scaffolded (`.mcp.json`); you provide the 2 secrets |
| **B. Lead webhook** | The contact form → owner WhatsApp + email | GHL **Inbound Webhook URL** (from a workflow) | No — GHL has no workflow API/MCP tool; one-time dashboard build (recipe below) |

---

## A. Activate the GHL MCP (durable automation)

1. GHL → **Settings → Private Integrations → Create New Integration**. Select scopes (Contacts, Conversations, Calendars, Opportunities, Custom Fields at minimum). Copy the token — it starts with `pit-`.
2. GHL → **Settings → Company** → copy your **Location ID**.
3. Export both in your shell so `.mcp.json` can resolve them (keeps secrets out of git):
   ```bash
   echo 'export GHL_PIT="pit-xxxxxxxx"'        >> ~/.zshrc
   echo 'export GHL_LOCATION_ID="xxxxxxxxxxxx"' >> ~/.zshrc
   source ~/.zshrc
   ```
4. Restart Claude Code, run `/mcp`, approve the `ghl` server → it should list its tools.

The MCP exposes ~36 tools (contacts, conversations, calendars, opportunities, payments, social, blogs, emails). **It does NOT expose Workflows/inbound-webhooks** — so it can't build hookup B; use the recipe below for that.

---

## B. Lead-notification workflow (the form → WhatsApp + email)

**The exact JSON the secure route POSTs to your GHL inbound webhook** (build the workflow's field mapping around these):
```json
{
  "naam": "Jan Jansen",
  "telefoon": "0612345678",
  "email": "",
  "postcode": "2712LB",
  "dienst": "Airconditioning",
  "bericht": "...",
  "submittedAt": "2026-06-29T12:34:56.000Z"
}
```

**Build it (GHL dashboard, ~5 min):**
1. **Automation → Workflows → + Create Workflow → Start from scratch.**
2. **Trigger:** *Inbound Webhook*. Save → **copy the webhook URL** (this is the value for `GHL_WEBHOOK_URL`). To capture the field shape, fire one sample: `node scripts/test-lead-route.mjs <preview-url> --send-real` (after env is set), or paste the JSON above as a sample event.
3. **Action — Create/Update Contact:** map `telefoon`→Phone, `email`→Email, `naam`→Name, and store `postcode`/`dienst`/`bericht` (custom fields or Notes).
4. **Action — Send Email (to the owner):** internal notification with the lead fields.
5. **Action — Send WhatsApp/SMS (to the owner):** internal notification with name + phone + dienst.
6. **Publish** the workflow.

---

## C. Vercel env cutover

In **Vercel → tps-ventilatie → Settings → Environment Variables** (team `pushly-projects`):
- **Add** `GHL_WEBHOOK_URL` = the inbound-webhook URL from B-2 → scope **Preview + Production**.
- **Delete** the legacy `NEXT_PUBLIC_GHL_WEBHOOK_URL` (kills the client-exposed-secret risk).
- **Rate limiting (your decision):**
  - *Recommended:* add the Vercel Marketplace **Upstash Redis** integration → it sets `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (durable 5/10min per-IP limiting).
  - *Or:* skip it — the route degrades gracefully to **honeypot-only** anti-spam. Fine for launch; add Upstash later.

CLI alternative (after `vercel login`): `vercel env add GHL_WEBHOOK_URL preview` (paste the URL), repeat for `production`, then `vercel env rm NEXT_PUBLIC_GHL_WEBHOOK_URL`.

---

## D. Deploy a preview & verify (NEVER `main`, NEVER `--prod`)

The preview branch is pushed → Vercel auto-builds a preview. Grab the URL from the Vercel dashboard (or it'll be in this session).

**Automated checks** (run from the repo):
```bash
# Safe matrix: malformed->400, invalid->400, honeypot->200 (no delivery)
node scripts/test-lead-route.mjs <preview-url>

# QA-08 live test: also send ONE real lead (after B + C are live) → owner WhatsApp + email
node scripts/test-lead-route.mjs <preview-url> --send-real

# Prove the secret is absent from the client bundle (pass your GHL webhook host)
node scripts/test-lead-route.mjs <preview-url> --bundle-grep leadconnectorhq.com
```

**Manual checks on the preview:** build green + only `/api/lead` is `ƒ`; submit with no consent is blocked; force-offline submit → visible Bel/WhatsApp/retry error; sticky bar scrolls in/dismisses/stacks; no `<canvas>` on mobile; map pin correct; images AVIF/WebP.

**E. Mobile CWV (SEO-10):** PageSpeed Insights mobile on the preview (home + a pillar) → INP < 200ms, LCP ≤ 2.5s.

---

## What I need from you to continue automating

1. **GHL `pit-…` token + Location ID** → I'll verify the MCP connects and can drive GHL.
2. **The GHL inbound-webhook URL** (from B-2) → I'll set Vercel env + re-deploy + run the live test.
3. **Rate-limit choice:** Upstash or honeypot-only.

Once I have #2 (and you're `vercel login`'d, or you add the env in the dashboard), I run the full `test-lead-route.mjs` matrix against the preview and flip `05-VALIDATION.md` to green.
