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

export function buildWhatsAppLeadUrl(fields: WhatsAppLeadFields): string {
  const lines = [
    "Hoi TPS, ik wil graag een offerte aanvragen:",
    "",
    `Naam: ${fields.naam}`,
    `Telefoon: ${fields.telefoon}`,
    `Postcode: ${fields.postcode}`,
    `Dienst: ${fields.dienst}`,
  ];

  const email = fields.email?.trim();
  if (email) lines.push(`E-mail: ${email}`);

  const bericht = fields.bericht?.trim();
  if (bericht) lines.push(`Bericht: ${bericht}`);

  return `${SITE.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
}
