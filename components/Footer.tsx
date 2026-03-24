import Link from "next/link";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-surface-container-low w-full py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div className="font-headline font-bold text-2xl text-primary">
            {SITE.name}
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Uw specialist in hoogwaardige ventilatieoplossingen voor een gezond
            en comfortabel binnenklimaat.
          </p>
        </div>

        {/* Diensten */}
        <div>
          <h4 className="font-bold text-on-surface mb-6">Diensten</h4>
          <ul className="space-y-4 text-on-surface-variant">
            <li>
              <Link href="/diensten" className="hover:text-primary transition-colors">
                WTW Onderhoud
              </Link>
            </li>
            <li>
              <Link href="/diensten" className="hover:text-primary transition-colors">
                Unit Vervangen
              </Link>
            </li>
            <li>
              <Link href="/diensten" className="hover:text-primary transition-colors">
                Kanalen Reinigen
              </Link>
            </li>
            <li>
              <Link href="/diensten" className="hover:text-primary transition-colors">
                Airconditioning
              </Link>
            </li>
          </ul>
        </div>

        {/* Bedrijf */}
        <div>
          <h4 className="font-bold text-on-surface mb-6">Bedrijf</h4>
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
          <h4 className="font-bold text-on-surface mb-6">Contact</h4>
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

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
        <div>&copy; {new Date().getFullYear()} {SITE.name}. {SITE.tagline}.</div>
        <div className="flex gap-6">
          <span>KvK: {SITE.kvk}</span>
          <span>BTW: {SITE.btw}</span>
        </div>
      </div>
    </footer>
  );
}
