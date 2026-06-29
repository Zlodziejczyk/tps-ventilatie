"use client";

import { useState } from "react";
import Link from "next/link";
import { submitLead } from "@/lib/forms";
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
}

export function OfferteForm({ defaultDienst }: OfferteFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  // The 4 pillars from the taxonomy + a catch-all (D-06) — never a hardcoded list.
  const dienstOptions = [
    ...pillars().map((p) => p.navTitle),
    "Anders / weet ik nog niet",
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

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

    const result = await submitLead(data);
    setStatus(result.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="bg-tertiary-fixed/20 rounded-2xl p-8 text-center">
        <Icon
          name="check_circle"
          filled
          className="text-tertiary text-4xl mb-4 block"
        />
        <h3 className="text-xl font-bold font-headline mb-2">Aanvraag verzonden</h3>
        <p className="text-on-surface-variant">
          Bedankt voor uw aanvraag. Wij nemen binnen 24 uur contact met u op.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — visually off-screen; real users never fill it (bots do). */}
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

      <div>
        <label htmlFor="dienst" className="block text-sm font-semibold text-on-surface mb-2">
          Waarvoor kunnen we u helpen?
        </label>
        <select
          id="dienst"
          name="dienst"
          required
          defaultValue={defaultDienst ?? ""}
          className={inputClass}
        >
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

      {/* Fail-safe error affordance (D-07 / QA-04 / LEAD-05) — never stranded on "sending". */}
      {status === "error" && (
        <div className="bg-error-container text-on-error-container rounded-xl p-5 space-y-4">
          <p className="text-sm font-medium">
            Er ging iets mis bij het verzenden. Probeer het opnieuw of neem direct
            contact met ons op — we helpen u graag.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${SITE.phone}`}
              className="btn-hover flex items-center justify-center gap-2 rounded-xl bg-on-error-container/10 px-4 py-2.5 font-semibold"
            >
              <Icon name="call" filled className="text-[20px]" /> Bel {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener"
              className="btn-hover flex items-center justify-center gap-2 rounded-xl bg-on-error-container/10 px-4 py-2.5 font-semibold"
            >
              <Icon name="chat" filled className="text-[20px]" /> WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="btn-hover flex items-center justify-center gap-2 rounded-xl bg-on-error-container/10 px-4 py-2.5 font-semibold"
            >
              <Icon name="refresh" className="text-[20px]" /> Opnieuw proberen
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full signature-gradient text-on-primary py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
        >
          {status === "sending" ? "Verzenden..." : "Vraag offerte aan"}
        </button>
        <p className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
          <Icon name="check_circle" filled className="text-tertiary text-base" />
          Gratis en vrijblijvend · reactie binnen 24 uur
        </p>
      </div>
    </form>
  );
}
