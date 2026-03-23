import Link from "next/link";
import { SITE } from "@/lib/constants";

interface CTABannerProps {
  heading: string;
  description: string;
}

export function CTABanner({ heading, description }: CTABannerProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-20">
      <div className="bg-on-primary-fixed text-white rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Decorative blur */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
            {heading}
          </h2>
          <p className="text-primary-fixed/80 text-lg mb-8">{description}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-3 bg-white text-on-primary-fixed px-6 py-3 rounded-xl font-bold hover:bg-primary-fixed transition-colors"
            >
              <span className="material-symbols-outlined">phone</span>
              {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">chat</span>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-center">
            <span className="material-symbols-outlined text-5xl mb-4 text-primary-fixed block">
              support_agent
            </span>
            <p className="font-bold mb-4">Direct een expert spreken?</p>
            <Link
              href="/contact"
              className="text-white underline underline-offset-8 font-medium hover:text-primary-fixed transition-colors"
            >
              Ga naar contactpagina
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
