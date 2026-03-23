export const SITE = {
  name: "TPS Ventilatie",
  tagline: "Specialist in Schone Lucht",
  phone: "+31 6 29403450",
  phoneDisplay: "06 - 29 40 34 50",
  email: "info@tpsventilatie.nl",
  address: "Industrieweg 6 B",
  postcode: "2712LB",
  city: "Zoetermeer",
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
