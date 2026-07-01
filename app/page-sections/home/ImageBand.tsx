import Image from "next/image";

// Server section (D-05) — the staged home-hero.jpg as a full-width band placed lower
// on the page. loading="lazy" + intrinsic width/height (no CLS) and NO priority keep it
// OFF the LCP path: the LCP element stays the hero H1 text, protecting mobile CWV (SEO-10).
export function ImageBand() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="overflow-hidden rounded-4xl bg-surface-container-high">
        <Image
          src="/images/heroes/home-hero-crop.jpg"
          alt="Wandmodel airconditioning in een lichte woonkamer met daglicht"
          width={1300}
          height={731}
          sizes="100vw"
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
}
