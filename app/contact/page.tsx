import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

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
        <AnimateOnScroll>
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
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <AnimateOnScroll>
          <div>
            <h2 className="text-2xl font-bold font-headline mb-6">Stuur ons een bericht</h2>
            <ContactForm />
          </div>
          </AnimateOnScroll>

          {/* Contact Info */}
          <AnimateOnScroll delay={0.15}>
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

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2448.5!2d4.4932!3d52.0623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b0e4c3e3b9a1%3A0x0!2sIndustrieweg%206B%2C%202712%20LB%20Zoetermeer!5e0!3m2!1sen!2snl!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TPS Ventilatie locatie - Industrieweg 6 B, 2712LB Zoetermeer"
              />
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
