import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import type { Review } from "@/components/ReviewCarousel";
import { Icon } from "@/components/Icon";

const REVIEWS: Review[] = [
  {
    name: "Jacqueline Overwater",
    quote:
      "De opdracht 's middags geplaatst, om half 8 kwam Thomas al langs. Hij heeft alles nagemeten. Hardstikke bedankt Thomas voor deze snelle goede service!",
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

export function ReviewsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
              KLANTVERHALEN
            </div>
            <h2 className="text-4xl font-extrabold font-headline mb-4">
              Wat klanten over ons zeggen
            </h2>
          </div>

          {/* Google rating summary */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6"
              aria-label="Google"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" filled className="text-lg" />
              ))}
            </div>
            <span className="font-bold text-on-surface text-lg">4.9</span>
            <span className="text-on-surface-variant text-sm">
              ({REVIEWS.length}+ reviews op Google)
            </span>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.2}>
          <ReviewCarousel reviews={REVIEWS} />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
