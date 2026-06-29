// Thin same-origin client caller for the secure /api/lead route (05-02). Holds NO
// webhook URL and NO secret — the server route owns those. A network rejection OR a
// non-OK response resolves to { ok: false } (never throws) so the form can show its
// fail-safe error state (D-07 / QA-04 / LEAD-05).
//
// Note: the payload is Record<string, unknown> (not string) because `consent` is a
// boolean — it must serialize to JSON `true` to satisfy the server schema's
// consent: literal(true).
export async function submitLead(
  data: Record<string, unknown>,
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
