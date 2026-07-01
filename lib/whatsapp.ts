// Builds a wa.me click-to-chat deep link with the lead's form data pre-filled as the
// message body. WhatsApp is the primary lead channel (owner preference) — the message
// is pre-typed and the lead only taps Send. All content is URL-encoded; email and
// bericht are included only when the lead actually filled them (kept out when blank).
import { SITE } from "@/lib/constants";

export interface WhatsAppLeadFields {
  naam: string;
  telefoon: string;
  postcode: string;
  dienst: string;
  email?: string;
  bericht?: string;
}

// Owner-recognizable sentinel naam for the Phase-6 compact hero form (D-03). It is
// >= 2 chars so the shared leadSchema `naam.min(2)` still passes for the silent GHL
// backup, but the WhatsApp message OMITS its Naam line (see below) so the quick-start
// chat stays clean. "Snelaanvraag" also signals to the owner this came from the hero.
export const COMPACT_LEAD_NAME = "Snelaanvraag";

export function buildWhatsAppLeadUrl(fields: WhatsAppLeadFields): string {
  const lines = [
    "Hoi TPS, ik wil graag een offerte aanvragen:",
    "",
  ];

  // Push Naam only for a real, non-sentinel name — mirrors the email/bericht idiom.
  const naam = fields.naam?.trim();
  if (naam && naam !== COMPACT_LEAD_NAME) lines.push(`Naam: ${naam}`);

  lines.push(`Telefoon: ${fields.telefoon}`);
  lines.push(`Postcode: ${fields.postcode}`);
  lines.push(`Dienst: ${fields.dienst}`);

  const email = fields.email?.trim();
  if (email) lines.push(`E-mail: ${email}`);

  const bericht = fields.bericht?.trim();
  if (bericht) lines.push(`Bericht: ${bericht}`);

  return `${SITE.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
}
