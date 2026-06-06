// The ONE consolidated reviews source (D-17). Replaces the three scattered
// REVIEWS arrays that previously lived in app/page-sections/ReviewsSection.tsx,
// app/diensten/page.tsx, and app/over-ons/page.tsx — ReviewCarousel and every
// trust strip now read from here (single-source ethos, mirrors SITE/PAGES).
//
// Reuses the shipped `Review` shape from ReviewCarousel (no second type).
// Quotes are VERBATIM customer words — including the legacy "TPS Ventilatie"
// brand string in a few of them. Do NOT silently edit a customer's review
// (authenticity > brand consistency); any change goes through the owner (intake §8).

import type { Review } from "@/components/ReviewCarousel";

export const REVIEWS: Review[] = [
  {
    name: "Jacqueline Overwater",
    quote:
      "De opdracht 's middags geplaatst, om half 8 kwam Thomas al langs. Hij heeft alles nagemeten. De schimmel in de badkamer lag niet aan de ventilatie. Hij gaf me het advies om opnieuw een advertentie op werkspot te plaatsen voor afkrabben van de schimmel, primeren, stucen en opnieuw schilderen. Hier heeft hij niets voor gerekend! Hardstikke bedankt Thomas voor deze snelle goede service!",
    timeAgo: "2 maanden geleden",
  },
  {
    name: "Herman Melander",
    quote:
      "TPS Ventilatie heeft bij ons een WTW-installatie geplaatst en naar goed. Uitstekend werk geleverd, netjes en snel. Goede communicatie vooraf en tijdens de werkzaamheden.",
    timeAgo: "3 maanden geleden",
  },
  {
    name: "Albert Terstegs",
    quote:
      "Goede en snelle communicatie. Enorm netjes en gedetailleerd opgeleverd. Was een veel grotere klus dan verwacht, maar toch heel goed opgelost!",
    timeAgo: "2 maanden geleden",
  },
  {
    name: "Christine te Kamp",
    quote:
      "Een fijne vakman waar je op kunt bouwen. Alles keurig netjes gedaan. Het ventilatiesysteem werkt nu weer als nieuw!",
    timeAgo: "4 maanden geleden",
  },
  {
    name: "Koen van Dijk",
    quote:
      "TPS was supersnel om ons te helpen. Tomasz zat erg netjes met alles. Super blij met het resultaat en de service. Echte vakman!",
    timeAgo: "3 maanden geleden",
  },
  {
    name: "Daan Hazelzet",
    quote:
      "Thomasz heeft het oude ventilatie systeem vervangen met een nieuwe met twee afstandsbedieningen. Netjes gehangen in twee uur. Erg blij mee.",
    timeAgo: "5 maanden geleden",
  },
  {
    name: "Lois Lovelle",
    quote:
      "TPS Ventilatie heeft een hele fijne service. Thomas is zeer vakkundig en werkt netjes en snel. Goede communicatie en een eerlijke prijs. Aanrader!",
    timeAgo: "3 maanden geleden",
  },
  {
    name: "Marko de Ridder",
    quote:
      "Fantastisch werk! Thomas heeft ons ventilatiesysteem gereinigd en van nieuwe filters voorzien. Heel professioneel en werkt heel netjes. Echt een topvakman!",
    timeAgo: "6 maanden geleden",
  },
  {
    name: "Jan Arends",
    quote:
      "Super tevreden over de werkzaamheden van TPS. Goede communicatie, vakkundig uitgevoerd. Alles keurig netjes en opgeruimd achtergelaten. Zeer zeker een aanrader.",
    timeAgo: "4 maanden geleden",
  },
  {
    name: "Anneke van Maasland",
    quote:
      "Hele fijne ervaring gehad met TPS ventilatie, ons probleem is super vakkundig en snel opgelost. Eerlijke prijs en goede communicatie. Zeer aan te bevelen!",
    timeAgo: "5 maanden geleden",
  },
  {
    name: "Ton Kooremans",
    quote:
      "Goede TOP vakman, zeer beleefd, werkt snel en laat alles heel netjes achter. Hij heeft het ventilatiesysteem vervangen en alle kanalen schoongemaakt. Echt een aanrader!",
    timeAgo: "7 maanden geleden",
  },
  {
    name: "Roel Leijssen",
    quote:
      "Snel geschakeld en goede service gehad van TPS Ventilatie. Het ventilatiesysteem is goed gecontroleerd en gereinigd. Komt zeker terug!",
    timeAgo: "4 maanden geleden",
  },
  {
    name: "Marcella B",
    quote:
      "Top service! Snelle reactie, goede communicatie en vakkundig werk. Ons ventilatiesysteem draait weer als een zonnetje. Zeer tevreden!",
    timeAgo: "6 maanden geleden",
  },
  {
    name: "Fred Dongen",
    quote:
      "Prima vakman! Heel netjes gewerkt, professioneel en goede communicatie. Het ventilatiesysteem werkt nu perfect. Zeker een aanrader.",
    timeAgo: "5 maanden geleden",
  },
  {
    name: "Helena Bakker",
    quote:
      "Thomas is een echte vakman. Eerlijk advies, nette uitvoering en goede service. Alles in één keer goed en netjes opgeruimd. Top!",
    timeAgo: "3 maanden geleden",
  },
  {
    name: "Bianca van Vlijt",
    quote:
      "Erg blij met de snelle en vakkundige service. Eerlijke prijzen en goede communicatie. Het resultaat is top. Zeker een aanrader!",
    timeAgo: "7 maanden geleden",
  },
  {
    name: "Linda Kossen",
    quote:
      "Super tevreden! Thomas werkt zeer netjes en professioneel. Het ventilatiesysteem is helemaal nagekeken en schoongemaakt. Alles werkt nu weer perfect.",
    timeAgo: "4 maanden geleden",
  },
  {
    name: "Benjamin S",
    quote:
      "Snelle en goede service. Thomas is heel vakkundig en vriendelijk. Alles netjes afgewerkt en opgeruimd. Zeer aan te bevelen!",
    timeAgo: "6 maanden geleden",
  },
];

// Gated aggregate rating (D-13/D-17). Stays `null` until the owner provides the
// REAL Google score + count + profile link via intake §8. While null: the
// businessJsonLd aggregateRating slot is omitted, and on-page score/stars do not
// render — only a neutral "{count}+ reviews op Google" line shows. Never fabricate
// a rating (self-serving ratings earn no Google stars anyway; the slot is for
// honest on-page display + AI/LLM search).
export const REVIEW_RATING: { value: number; count: number; url: string } | null =
  null;
