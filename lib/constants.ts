export const SITE = {
  name: "TPS klimaattechniek",
  tagline: "Specialist in Schone Lucht",
  phone: "+31 6 29403450",
  phoneDisplay: "06 - 29 40 34 50",
  email: "info@tpsventilatie.nl",
  address: "Industrieweg 6 B",
  postcode: "2712LB",
  city: "Zoetermeer",
  province: "Zuid-Holland",
  country: "NL",
  // owner-verify-pending: placeholder coordinates (Zoetermeer centroid).
  // Today's Maps pin is a placeholder (CONCERNS.md / A3); Phase 5 QA-05 sets the
  // verified business-location lat/lng. Do NOT render as a confirmed pin until then.
  geo: { lat: 52.0607, lng: 4.4940 },
  serviceRadiusKm: 60,
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
  btw: "NL862655889B01",
  whatsappUrl: "https://wa.me/31629403450",
} as const;

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
