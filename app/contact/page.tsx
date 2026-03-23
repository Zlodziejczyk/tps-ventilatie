import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met TPS Ventilatie voor advies, afspraken of offertes.",
};

export default function ContactPage() {
  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 font-label">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-primary">Contact</span>
        </nav>

        <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-on-surface mb-6">
          Contact
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl mb-16 leading-relaxed">
          Heeft u een vraag of wilt u een afspraak maken? Neem gerust contact met ons op.
        </p>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold font-headline mb-6">Stuur ons een bericht</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline mb-6">Contactgegevens</h2>

            <div className="space-y-6">
              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon name="phone" className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Bel ons</p>
                  <p className="font-bold text-on-surface">{SITE.phoneDisplay}</p>
                </div>
              </a>

              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon name="mail" className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">E-mail</p>
                  <p className="font-bold text-on-surface">{SITE.email}</p>
                </div>
              </a>

              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#25D366]/10 rounded-xl hover:bg-[#25D366]/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 flex items-center justify-center">
                  <Icon name="chat" filled className="text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">WhatsApp</p>
                  <p className="font-bold text-on-surface">Direct chatten</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name="location_on" className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Adres</p>
                  <p className="font-bold text-on-surface">{SITE.address}</p>
                  <p className="text-on-surface-variant">{SITE.postcode} {SITE.city}</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-surface-container-high rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center text-on-surface-variant">
                <Icon name="map" className="text-4xl mb-2 block mx-auto text-primary/30" />
                <p className="text-sm">Google Maps</p>
                <p className="text-xs">{SITE.address}, {SITE.postcode} {SITE.city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
