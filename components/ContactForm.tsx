"use client";

import { useState } from "react";
import { submitForm } from "@/lib/forms";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const result = await submitForm("contact", data);
    setStatus(result.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="bg-tertiary-fixed/20 rounded-2xl p-8 text-center">
        <span className="material-symbols-outlined text-tertiary text-4xl mb-4 block">check_circle</span>
        <h3 className="text-xl font-bold font-headline mb-2">Bericht Verzonden</h3>
        <p className="text-on-surface-variant">Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="naam" className="block text-sm font-semibold text-on-surface mb-2">
          Uw Naam
        </label>
        <input
          type="text"
          id="naam"
          name="naam"
          required
          className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-on-surface focus:bg-surface-container-lowest focus:border-l-2 focus:border-l-primary focus:outline-none transition-all"
          placeholder="Uw volledige naam"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-2">
          E-mail adres
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-on-surface focus:bg-surface-container-lowest focus:border-l-2 focus:border-l-primary focus:outline-none transition-all"
          placeholder="uw@email.nl"
        />
      </div>

      <div>
        <label htmlFor="telefoon" className="block text-sm font-semibold text-on-surface mb-2">
          Telefoonnummer
        </label>
        <input
          type="tel"
          id="telefoon"
          name="telefoon"
          required
          className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-on-surface focus:bg-surface-container-lowest focus:border-l-2 focus:border-l-primary focus:outline-none transition-all"
          placeholder="06 - 1234 5678"
        />
      </div>

      <div>
        <label htmlFor="bericht" className="block text-sm font-semibold text-on-surface mb-2">
          Uw bericht
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          rows={5}
          className="w-full px-4 py-3 bg-surface-container-highest rounded-xl text-on-surface focus:bg-surface-container-lowest focus:border-l-2 focus:border-l-primary focus:outline-none transition-all resize-none"
          placeholder="Beschrijf uw vraag of situatie..."
        />
      </div>

      {status === "error" && (
        <div className="bg-error-container text-on-error-container rounded-xl p-4 text-sm">
          Er ging iets mis. Probeer het opnieuw of neem telefonisch contact op.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full signature-gradient text-on-primary py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
      >
        {status === "sending" ? "Verzenden..." : "Bericht Versturen"}
      </button>
    </form>
  );
}
