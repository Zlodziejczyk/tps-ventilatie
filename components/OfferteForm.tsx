"use client";

import { useState } from "react";
import Link from "next/link";
import { submitLead } from "@/lib/forms";
import { buildWhatsAppLeadUrl, COMPACT_LEAD_NAME } from "@/lib/whatsapp";
import { pillars } from "@/lib/services/registry";
import { SITE } from "@/lib/constants";
import { Icon } from "@/components/Icon";

const inputClass =
  "w-full px-4 py-3 bg-surface-container-highest rounded-xl text-on-surface focus:bg-surface-container-lowest focus:border-l-2 focus:border-l-primary focus:outline-none transition-all";

interface OfferteFormProps {
  // Context-prefill the dienst dropdown (e.g. from a pillar/service page or the
  // Phase-6 homepage) WITHOUT forcing the host page dynamic — a plain prop, no
  // useSearchParams. Falls back to the unselected placeholder when omitted.
  defaultDienst?: string;
  // Layout variant (D-03). "full" = the service-page form (naam/email/bericht +
  // postcode/telefoon/dienst). "compact" = the Phase-6 hero quick-start (Postcode
  // + Telefoon + Dienst + condensed consent) with a hidden sentinel naam so the
  // shared /api/lead leadSchema still validates. Defaults to "full" — existing
  // usages are unaffected.
  variant?: "full" | "compact";
  // Optional CONTROLLED dienst pair (D-09). When both are provided the select is
  // controlled (value + onChange), so a post-mount pillar click can pre-select the
  // service. When omitted the select stays uncontrolled via defaultDienst — the
  // existing (backward-compatible) behavior.
  dienst?: string;
  onDienstChange?: (value: string) => void;
}

export function OfferteForm({
  defaultDienst,
  variant = "full",
  dienst,
  onDienstChange,
}: OfferteFormProps) {
  // Once set, the lead has been handed off to WhatsApp (the primary channel). We keep
  // the URL so the confirmation panel can offer a manual "open WhatsApp" fallback.
  const [waUrl, setWaUrl] = useState<string | null>(null);

  // The 4 pillars from the taxonomy + a catch-all (D-06) — never a hardcoded list.
  const dienstOptions = [
    ...pillars().map((p) => p.navTitle),
    "Anders / weet ik nog niet",
  ];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const data = {
      naam: String(fd.get("naam") ?? ""),
      telefoon: String(fd.get("telefoon") ?? ""),
      email: String(fd.get("email") ?? ""),
      postcode: String(fd.get("postcode") ?? ""),
      dienst: String(fd.get("dienst") ?? ""),
      bericht: String(fd.get("bericht") ?? ""),
      consent: fd.has("consent"), // boolean — matches the server consent literal(true)
      website: String(fd.get("website") ?? ""), // honeypot — empty for real users
    };

    const url = buildWhatsAppLeadUrl(data);
    setWaUrl(url);

    // Silent GHL backup — fire-and-forget (keepalive lets it finish after we navigate).
    void submitLead(data);

    // Hand off to WhatsApp with the message pre-filled. Same-tab navigation is never
    // pop-up-blocked and reliably deep-links into the app on mobile.
    window.location.href = url;
  }

  if (waUrl) {
    return (
      <div className="bg-tertiary-fixed/20 rounded-2xl p-8 text-center space-y-4">
        <Icon name="chat" filled className="text-tertiary text-4xl block" />
        <h3 className="text-xl font-bold font-headline">WhatsApp wordt geopend…</h3>
        <p className="text-on-surface-variant">
          We openen WhatsApp met uw gegevens al ingevuld — u hoeft alleen nog op
          verzenden te tikken.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            className="btn-hover inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-2.5 font-semibold"
          >
            <Icon name="open_in_new" className="text-[20px]" /> Opent WhatsApp niet? Open handmatig
          </a>
          <a
            href={`tel:${SITE.phone}`}
            className="btn-hover inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-2.5 font-semibold"
          >
            <Icon name="call" filled className="text-[20px]" /> Liever bellen? {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    );
  }

  // Controlled ONLY when a dienst value is supplied (D-09) — a post-mount pillar
  // click can then move the dropdown. Otherwise the uncontrolled defaultValue path
  // (unchanged full-form behavior).
  const dienstBinding =
    dienst !== undefined
      ? {
          value: dienst,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
            onDienstChange?.(e.target.value),
        }
      : { defaultValue: defaultDienst ?? "" };

  // Shared dienst select — identical markup in both variants (controlled-aware).
  const dienstField = (
    <div>
      <label htmlFor="dienst" className="block text-sm font-semibold text-on-surface mb-2">
        Waarvoor kunnen we u helpen?
      </label>
      <select id="dienst" name="dienst" required {...dienstBinding} className={inputClass}>
        <option value="" disabled>
          Kies een dienst
        </option>
        {dienstOptions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );

  // Shared submit button — identical in both variants (reassurance line differs).
  const submitButton = (
    <button
      type="submit"
      className="w-full signature-gradient text-on-primary py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer inline-flex items-center justify-center gap-2"
    >
      <Icon name="chat" filled className="text-[22px]" />
      Verstuur via WhatsApp
    </button>
  );

  // Honeypot — visually off-screen; real users never fill it (bots do). MUST render
  // in BOTH variants: the /api/lead route reads name="website" for spam control, so
  // the compact form has to carry it too.
  const honeypot = (
    <div
      className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      aria-hidden
    >
      <label htmlFor="website">Laat dit veld leeg</label>
      <input
        type="text"
        id="website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );

  if (variant === "full") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {honeypot}

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="naam" className="block text-sm font-semibold text-on-surface mb-2">
              Uw naam
            </label>
            <input type="text" id="naam" name="naam" required className={inputClass} placeholder="Uw volledige naam" />
          </div>
          <div>
            <label htmlFor="telefoon" className="block text-sm font-semibold text-on-surface mb-2">
              Telefoonnummer
            </label>
            <input type="tel" id="telefoon" name="telefoon" required className={inputClass} placeholder="06 - 1234 5678" />
            <p className="mt-1 text-xs text-on-surface-variant">Zo kunnen we u snel terugbellen.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="postcode" className="block text-sm font-semibold text-on-surface mb-2">
              Postcode
            </label>
            <input type="text" id="postcode" name="postcode" required className={inputClass} placeholder="1234 AB" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-2">
              E-mail <span className="font-normal text-on-surface-variant">(optioneel)</span>
            </label>
            <input type="email" id="email" name="email" className={inputClass} placeholder="uw@email.nl" />
          </div>
        </div>

        {dienstField}

        <div>
          <label htmlFor="bericht" className="block text-sm font-semibold text-on-surface mb-2">
            Uw bericht <span className="font-normal text-on-surface-variant">(optioneel)</span>
          </label>
          <textarea
            id="bericht"
            name="bericht"
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Beschrijf uw vraag of situatie..."
          />
        </div>

        {/* AVG consent (D-08 / LEAD-06) — required client-side; the server enforces it too. */}
        <label className="flex items-start gap-3 text-sm text-on-surface-variant">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
          />
          <span>
            Ik ga akkoord met de verwerking van mijn gegevens conform het{" "}
            <Link href="/privacy-beleid" className="text-primary underline hover:no-underline">
              privacybeleid
            </Link>
            .
          </span>
        </label>

        <div className="space-y-3">
          {submitButton}
          <p className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <Icon name="check_circle" filled className="text-tertiary text-base" />
            Gratis en vrijblijvend · u rondt af in WhatsApp
          </p>
        </div>
      </form>
    );
  }

  // Compact variant (D-03) — the Phase-6 hero quick-start: Postcode + Telefoon +
  // Dienst + condensed consent + submit. A hidden sentinel naam keeps the shared
  // leadSchema valid so the silent GHL backup is never dropped.
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {honeypot}

      {/* Hidden sentinel naam — satisfies leadSchema naam.min(2) without asking for a
          name; buildWhatsAppLeadUrl omits its line so the chat message stays clean. */}
      <input type="hidden" name="naam" value={COMPACT_LEAD_NAME} />

      <div>
        <label htmlFor="postcode" className="block text-sm font-semibold text-on-surface mb-2">
          Postcode
        </label>
        <input type="text" id="postcode" name="postcode" required className={inputClass} placeholder="1234 AB" />
      </div>

      <div>
        <label htmlFor="telefoon" className="block text-sm font-semibold text-on-surface mb-2">
          Telefoonnummer
        </label>
        <input type="tel" id="telefoon" name="telefoon" required className={inputClass} placeholder="06 - 1234 5678" />
      </div>

      {dienstField}

      {/* Condensed AVG consent (D-03 / D-08) — still explicit + required; the server enforces it too. */}
      <label className="flex items-start gap-2.5 text-xs text-on-surface-variant">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span>
          Akkoord met het{" "}
          <Link href="/privacy-beleid" className="text-primary underline hover:no-underline">
            privacybeleid
          </Link>
          .
        </span>
      </label>

      <div className="space-y-3">
        {submitButton}
        <p className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
          <Icon name="check_circle" filled className="text-tertiary text-base" />
          Vrijblijvend · geen kosten · AVG-proof
        </p>
      </div>
    </form>
  );
}
