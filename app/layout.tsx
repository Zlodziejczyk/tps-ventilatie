import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TPS Ventilatie — Uw Ventilatiespecialist",
    template: "%s | TPS Ventilatie",
  },
  description:
    "Specialist in installatie, onderhoud en advies voor WTW units, mechanische ventilatie en airconditioning in de regio Zoetermeer.",
  keywords: [
    "ventilatie",
    "WTW",
    "mechanische ventilatie",
    "airconditioning",
    "Zoetermeer",
    "onderhoud",
    "installatie",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${jakarta.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body">
        {children}
      </body>
    </html>
  );
}
