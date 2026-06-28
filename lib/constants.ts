export const SITE = {
  name: "TPS klimaattechniek",
  // Registered KvK entity name (intake §1, 2026-06-28) — distinct from the trade
  // name above. Emitted as JSON-LD `legalName`; the brand/display name stays
  // "TPS klimaattechniek" (name ≠ legal entity, D-01).
  legalName: "TPS services",
  tagline: "Specialist in gezond binnenklimaat",
  phone: "+31 6 29403450",
  phoneDisplay: "06 - 29 40 34 50",
  email: "info@tpsventilatie.nl",
  address: "Industrieweg 6 B",
  postcode: "2712LB",
  city: "Zoetermeer",
  province: "Zuid-Holland",
  country: "NL",
  // Verified business-location pin (Industrieweg 6 B, 2712 LB Zoetermeer), confirmed
  // by the owner via Google Maps embed (2026-06-06, resolves A-1/A3). Feeds JSON-LD
  // GeoCoordinates + areaServed geoMidpoint.
  geo: { lat: 52.04822769870841, lng: 4.502050197039296 },
  serviceRadiusKm: 60,
  // Opening hours (owner-confirmed intake §2, 2026-06-28): Ma–za 08:00–17:30,
  // zondag gesloten. Buiten deze tijden ook op afspraak + storingsdienst. Feeds the
  // schema OpeningHoursSpecification (lib/seo/jsonld) and the contact-page hours card.
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "17:30",
  },
  // owner-review-pending: seed coverage list (D-11 / A2). Owner curates before
  // publish — never claim an unserved area. Phase 3+ JSON-LD areaServed reads this.
  serviceAreas: [
    "Zoetermeer",
    "Den Haag",
    "Leidschendam-Voorburg",
    "Pijnacker-Nootdorp",
    "Lansingerland",
    "Delft",
    "Gouda",
    "Leiden",
  ],
  kvk: "73722650",
  btw: "NL859640929B01",
  whatsappUrl: "https://wa.me/31629403450",
} as const;

// Canonical origin (D-01) — the apex, live-confirmed (RESEARCH §1) as the served
// primary (www→apex 301 in place). This is the ONLY place the origin string is
// written: metadataBase, every absolute canonical, OG `url`, sitemap `<loc>`,
// robots `Sitemap:`, and JSON-LD `url`/`@id` all import it. No trailing slash.
export const CANONICAL_ORIGIN = "https://tpsventilatie.nl";

// Google Search Console verification token (D-06). Public by design (read from a
// NEXT_PUBLIC_ env var) — not a secret. Empty string when unset so downstream
// code omits the verification tag rather than shipping an empty/invalid one.
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Diensten", href: "/diensten" },
  { label: "Tarieven", href: "/tarieven" },
  { label: "Over Ons", href: "/over-ons" },
  { label: "Contact", href: "/contact" },
] as const;

export interface DropdownItem {
  icon: string;
  title: string;
  description: string;
  href: string;
}

// The hardcoded Diensten dropdown list was removed (IA-07): the Diensten nav is
// now taxonomy-derived from pillars()/childrenOf() in Navbar + MobileMenu.
// TARIEVEN_DROPDOWN stays (pricing nav is not part of the service taxonomy).
export const TARIEVEN_DROPDOWN: DropdownItem[] = [
  {
    icon: "air",
    title: "Ventilatie tarieven",
    description: "WTW, mechanische ventilatie en meer",
    href: "/tarieven",
  },
  {
    icon: "ac_unit",
    title: "Airconditioning tarieven",
    description: "Split-systemen, onderhoud en reparatie",
    href: "/tarieven?tab=airco",
  },
];
