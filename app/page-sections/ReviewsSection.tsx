import { Icon } from "@/components/Icon";

const REVIEWS = [
  {
    initials: "JO",
    name: "Jacqueline Overwater",
    quote: "De opdracht 's middags geplaatst, om half 8 kwam Thomas al langs. Hij heeft alles nagemeten. Hardstikke bedankt Thomas voor deze snelle goede service!",
  },
  {
    initials: "DH",
    name: "Daan Hazelzet",
    quote: "Thomasz heeft het oude ventilatie systeem vervangen met een nieuwe met twee afstandsbedieningen. Netjes gehangen in twee uur. Erg blij mee.",
  },
  {
    initials: "TK",
    name: "Ton Kooremans",
    quote: "Goede TOP vakman, zeer beleefd, werkt snel en laat alles heel netjes achter. Hij heeft het ventilatiesysteem vervangen en alle kanalen schoongemaakt. Echt een aanrader!",
  },
];

function Stars() {
  return (
    <div className="flex text-yellow-500 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" filled />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
            KLANTVERTELLEN
          </div>
          <h2 className="text-4xl font-extrabold font-headline mb-4">
            Wat klanten over ons zeggen
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.name} className="bg-surface-container-low p-8 rounded-3xl relative">
              <Stars />
              <p className="text-on-surface italic mb-8 leading-relaxed">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold">
                  {review.initials}
                </div>
                <div>
                  <p className="font-bold">{review.name}</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                    Geverifieerde Klant
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
