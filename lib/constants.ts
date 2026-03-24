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

export interface DropdownItem {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export const DIENSTEN_DROPDOWN: DropdownItem[] = [
  {
    icon: "heat_pump",
    title: "WTW Unit",
    description: "Vervanging en installatie van warmteterugwinunits",
    href: "/diensten#wtw",
  },
  {
    icon: "air",
    title: "Mechanische Ventilatie",
    description: "Reiniging en onderhoud van ventilatiekanalen",
    href: "/diensten#mechanisch",
  },
  {
    icon: "ac_unit",
    title: "Airconditioning",
    description: "Installatie, onderhoud en reparatie van aircosystemen",
    href: "/diensten#airco",
  },
];

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
