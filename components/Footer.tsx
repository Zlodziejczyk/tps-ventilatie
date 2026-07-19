import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import { pillars, urlFor } from "@/lib/services/registry";

export function Footer() {
  return (
    <footer className="bg-surface-container-low w-full py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          {/* Opaque white-bg PNG (RGB, no alpha) — kept on a white chip like the
              Navbar; business name announced via alt for SEO/accessibility. */}
          <span className="relative block w-14 h-14 rounded-full bg-white shadow-sm overflow-hidden">
            <Image
              src="/tps-logo.png"
              alt={SITE.name}
              fill
              sizes="56px"
              className="object-contain p-0.5"
            />
          </span>
          <p className="text-on-surface-variant leading-relaxed">
            Specialist in gezond binnenklimaat — airconditioning, warmtepompen
            en ventilatie (WTW en mechanisch). Advies, installatie en onderhoud
            in {SITE.city} en omgeving.
          </p>
        </div>

        {/* Diensten */}
        <div>
          <h2 className="font-bold text-on-surface mb-6">Diensten</h2>
          <ul className="space-y-4 text-on-surface-variant">
            {pillars().map((pillar) => (
              <li key={pillar.pillarSlug}>
                <Link
                  href={urlFor(pillar)}
                  className="hover:text-primary transition-colors"
                >
                  {pillar.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bedrijf */}
        <div>
          <h2 className="font-bold text-on-surface mb-6">Bedrijf</h2>
          <ul className="space-y-4 text-on-surface-variant">
            <li>
              <Link href="/over-ons" className="hover:text-primary transition-colors">
                Over Ons
              </Link>
            </li>
            <li>
              <Link href="/tarieven" className="hover:text-primary transition-colors">
                Tarieven
              </Link>
            </li>
            <li>
              <Link href="/projecten" className="hover:text-primary transition-colors">
                Projecten
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-beleid" className="hover:text-primary transition-colors">
                Privacy Beleid
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-bold text-on-surface mb-6">Contact</h2>
          <ul className="space-y-4 text-on-surface-variant">
            <li>
              <a href={`tel:${SITE.phone}`} className="hover:text-primary transition-colors">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-primary transition-colors">
                {SITE.email}
              </a>
            </li>
            <li>{SITE.address}</li>
            <li>
              {SITE.postcode} {SITE.city}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar — separated by tonal layering (a surface-token step + spacing),
          not a 1px hairline, per the Atmospheric-Clarity design system. */}
      <div className="max-w-7xl mx-auto mt-16 rounded-2xl bg-surface-container px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
        <div>&copy; {new Date().getFullYear()} {SITE.name}. {SITE.tagline}.</div>
        <div className="flex gap-6">
          <span>KvK: {SITE.kvk}</span>
          <span>BTW: {SITE.btw}</span>
        </div>
      </div>
    </footer>
  );
}
