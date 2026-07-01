// Shared pure util (D-07 / D-14 enabler). Lifted verbatim out of the "use client"
// ReviewCarousel so server sections (ProofBand cards, HomeHero proof bar) can import
// initials logic without pulling in client carousel machinery. No side effects.
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
