// SINGLE source of truth for lead validation. Imported authoritatively by
// app/api/lead/route.ts (server-side) and optionally by the client form for UX.
// Zod v4 idiom: top-level z.email() (not the older chained string-method form).
// All user-facing messages are Dutch (site language is nl).
import { z } from "zod";

export const leadSchema = z.object({
  naam: z.string().min(2, "Vul uw naam in").max(100),
  // telefoon is the required callback channel — phone-first keeps friction low.
  telefoon: z.string().min(8, "Vul een geldig telefoonnummer in").max(20),
  // email is optional and tolerant of an empty string (D-05).
  email: z.union([z.email(), z.literal("")]).optional(),
  // postcode: bounds only, no service-area logic in v1.
  postcode: z.string().min(4, "Vul uw postcode in").max(10),
  // dienst: a bounded free string so the 4 pillars AND "Anders / weet ik nog niet" all pass.
  dienst: z.string().min(1, "Kies een dienst").max(60),
  bericht: z.string().max(2000).optional(),
  // consent: submit is invalid without it (LEAD-06 / D-08).
  consent: z.literal(true, { error: "Toestemming is vereist" }),
  // website: honeypot — must be empty; any content marks a bot.
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
