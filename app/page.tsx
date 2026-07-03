import { HomeHero } from "./page-sections/home/HomeHero";
import { ProofBand } from "./page-sections/home/ProofBand";
import { ImageBand } from "./page-sections/home/ImageBand";
import { ClosingCTA } from "./page-sections/home/ClosingCTA";
import { buildMetadata } from "@/lib/seo/metadata";
import { findBySlug } from "@/lib/services/registry";

// Home had no metadata export — add one via the shared builder so it gets an
// absolute self-canonical (https://tpsventilatie.nl/) + OG/Twitter + index (D-05).
export const metadata = buildMetadata(findBySlug("/")!);

// Phase-6 homepage rebuild (D-01/D-02). Server Component composing the four new home
// sections. The old five sections (Hero/Services/Pricing/WhyTPS/Reviews) + CTABanner
// are retired: their value is absorbed — services -> the pillar grid, USPs -> the proof
// band's USP pills, reviews -> the static 3-up proof cards, and there is deliberately
// NO pricing-preview section (pricing shows only as USP pills). HomeHero is the sole
// client island; the site-wide StickyContactBar stays inherited from app/layout.tsx (D-16).
export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <HomeHero />
      <ProofBand />
      <ImageBand />
      <ClosingCTA />
    </main>
  );
}
