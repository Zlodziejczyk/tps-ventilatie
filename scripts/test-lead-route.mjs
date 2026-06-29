#!/usr/bin/env node
// Secure-path QA matrix for /api/lead (QA-02 / LEAD-02). OneDrive-safe: pure fetch,
// no build/tsc. Run against a deployed Vercel PREVIEW URL — never production.
//
// Usage:
//   node scripts/test-lead-route.mjs <baseUrl>                  # safe matrix (no real lead sent)
//   node scripts/test-lead-route.mjs <baseUrl> --send-real      # also sends ONE clean lead (QA-08 owner notification)
//   node scripts/test-lead-route.mjs <baseUrl> --bundle-grep <substr>  # assert <substr> is ABSENT from the client bundle
//
// Examples:
//   node scripts/test-lead-route.mjs https://tps-ventilatie-git-gsd-phase-05-xxxx.vercel.app
//   node scripts/test-lead-route.mjs https://...vercel.app --bundle-grep leadconnectorhq.com
//
// The safe matrix proves: malformed->400, invalid->400, honeypot->200 (no forward).
// --send-real fires a real submit (rate-limit budget + a real owner WhatsApp/email).

const args = process.argv.slice(2);
const base = args[0]?.replace(/\/$/, "");
const sendReal = args.includes("--send-real");
const grepIdx = args.indexOf("--bundle-grep");
const grepStr = grepIdx !== -1 ? args[grepIdx + 1] : null;

if (!base || !/^https?:\/\//.test(base)) {
  console.error("Usage: node scripts/test-lead-route.mjs <https-baseUrl> [--send-real] [--bundle-grep <substr>]");
  process.exit(2);
}

const endpoint = `${base}/api/lead`;
let failures = 0;

function record(name, ok, detail) {
  console.log(`${ok ? "✅ PASS" : "❌ FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!ok) failures++;
}

async function postRaw(body, headers = { "Content-Type": "application/json" }) {
  const res = await fetch(endpoint, { method: "POST", headers, body });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }
  return { status: res.status, json };
}

const validLead = {
  naam: "QA Test",
  telefoon: "0612345678",
  email: "",
  postcode: "2712LB",
  dienst: "Airconditioning",
  bericht: "Automated QA matrix — please ignore.",
  consent: true,
  website: "",
};

async function run() {
  console.log(`\n▶ Secure-path matrix against ${endpoint}\n`);

  // 1. Malformed JSON -> 400 invalid_json
  try {
    const r = await postRaw("{ not valid json");
    record("malformed JSON -> 400", r.status === 400, `got ${r.status} ${JSON.stringify(r.json)}`);
  } catch (e) {
    record("malformed JSON -> 400", false, `request error: ${e.message}`);
  }

  // 2. Schema-invalid (missing required telefoon + consent false) -> 400 validation
  try {
    const bad = { ...validLead, telefoon: "", consent: false };
    const r = await postRaw(JSON.stringify(bad));
    record("invalid payload -> 400", r.status === 400, `got ${r.status} ${JSON.stringify(r.json)}`);
  } catch (e) {
    record("invalid payload -> 400", false, `request error: ${e.message}`);
  }

  // 3. Honeypot filled -> 200 ok, but NOT forwarded to GHL (verify no owner notification)
  try {
    const trap = { ...validLead, website: "http://spam.example" };
    const r = await postRaw(JSON.stringify(trap));
    record("honeypot -> 200 (no GHL delivery)", r.status === 200 && r.json?.ok === true, `got ${r.status} ${JSON.stringify(r.json)} — confirm NO owner notification arrived`);
  } catch (e) {
    record("honeypot -> 200", false, `request error: ${e.message}`);
  }

  // 4. Clean valid lead -> 200 (guarded — this triggers a REAL owner notification)
  if (sendReal) {
    try {
      const r = await postRaw(JSON.stringify(validLead));
      record("valid lead -> 200 (REAL notify)", r.status === 200 && r.json?.ok === true, `got ${r.status} ${JSON.stringify(r.json)} — confirm WhatsApp + email arrived`);
    } catch (e) {
      record("valid lead -> 200", false, `request error: ${e.message}`);
    }
  } else {
    console.log("⏭  SKIP  valid lead (add --send-real to fire the QA-08 owner-notification test)");
  }

  // Optional: prove the webhook secret is ABSENT from the client bundle
  if (grepStr) {
    console.log(`\n▶ Client-bundle secret check: asserting "${grepStr}" is absent\n`);
    try {
      const html = await (await fetch(base)).text();
      const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1]);
      const urls = scripts.map((s) => (s.startsWith("http") ? s : `${base}${s.startsWith("/") ? "" : "/"}${s}`));
      let found = html.includes(grepStr);
      for (const u of urls.slice(0, 60)) {
        try {
          const js = await (await fetch(u)).text();
          if (js.includes(grepStr)) {
            found = true;
            console.log(`   leaked in: ${u}`);
          }
        } catch {
          /* ignore individual asset fetch errors */
        }
      }
      record(`secret "${grepStr}" absent from bundle`, !found, found ? "LEAK DETECTED" : `scanned ${urls.length} assets + HTML`);
    } catch (e) {
      record("bundle secret check", false, `fetch error: ${e.message}`);
    }
  }

  console.log(`\n${failures === 0 ? "✅ ALL CHECKS PASSED" : `❌ ${failures} CHECK(S) FAILED`}\n`);
  process.exit(failures === 0 ? 0 : 1);
}

run();
