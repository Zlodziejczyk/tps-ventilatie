export async function submitForm(
  formId: string,
  data: Record<string, string>
): Promise<{ ok: boolean }> {
  const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formId,
        ...data,
        submittedAt: new Date().toISOString(),
      }),
    });
    return { ok: res.ok };
  }

  // Dev fallback
  console.log(`[Form ${formId}]`, data);
  return { ok: true };
}
