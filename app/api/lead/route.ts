// The single dynamic endpoint (Phase 5, QA-02 / LEAD-02). Reading the request
// body makes this route inherently dynamic in Next 16 — no explicit dynamic
// segment flag is required.
// Order: rate-limit -> content-type+parse -> validate -> honeypot -> server-only
// secret -> forward to GoHighLevel -> structured JSON. NEVER log the lead PII
// payload; only generic error codes cross back to the client.
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { leadSchema } from "@/lib/lead-schema";

export const runtime = "nodejs"; // default; explicit for clarity

// Graceful degrade: only build the limiter when BOTH Upstash REST vars are present.
// When absent (e.g. a preview before Upstash is provisioned) the honeypot remains
// the active anti-spam control and the route still works — and a thrown
// Redis.fromEnv() can never 500 the route.
function makeRatelimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  try {
    return new Ratelimit({
      redis: Redis.fromEnv(), // reads UPSTASH_REDIS_REST_URL/_TOKEN
      limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 submits / 10 min per IP
      prefix: "ratelimit:lead",
    });
  } catch {
    return null;
  }
}

const ratelimit = makeRatelimit();

export async function POST(request: NextRequest) {
  // 1. rate limit by client IP (Vercel sets x-forwarded-for; first entry = client)
  if (ratelimit) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    try {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
      }
    } catch {
      // A limiter backend error must not block a legitimate lead — fall through.
    }
  }

  // 2. require a JSON content-type (cheap cross-origin/bot layer — the same-origin
  //    form always sends application/json) then parse the body safely
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // 3. server-authoritative validation (do NOT echo field values back)
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }
  const data = parsed.data;

  // 4. honeypot — a filled hidden field marks a bot; accept silently, do NOT forward
  if (data.website) {
    return NextResponse.json({ ok: true }); // looks successful to the bot
  }

  // 5. server-only secret
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  // 6. forward to GoHighLevel — same flat field shape the agency workflow expects.
  //    consent/website are never forwarded; the PII payload is never logged.
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naam: data.naam,
        telefoon: data.telefoon,
        email: data.email ?? "",
        postcode: data.postcode,
        dienst: data.dienst,
        bericht: data.bericht ?? "",
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
