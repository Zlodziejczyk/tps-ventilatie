import { HeroSection } from "./page-sections/HeroSection";
import { ServicesSection } from "./page-sections/ServicesSection";
import { PricingSection } from "./page-sections/PricingSection";
import { WhyTPSSection } from "./page-sections/WhyTPSSection";
import { ReviewsSection } from "./page-sections/ReviewsSection";
import { CTABanner } from "@/components/CTABanner";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <WhyTPSSection />
      <ReviewsSection />
      <CTABanner
        heading="Klaar voor schone lucht?"
        description="Neem vrijblijvend contact op voor advies op maat. Onze specialisten helpen u graag de juiste keuze te maken voor uw situatie."
      />
    </main>
  );
}
