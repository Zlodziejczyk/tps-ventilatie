import { Icon } from "@/components/Icon";

const USPs = [
  {
    icon: "workspace_premium",
    title: "Gecertificeerd Vakmanschap",
    description: "Onze monteurs zijn opgeleid volgens de nieuwste normen voor zowel ventilatie als koeltechniek.",
  },
  {
    icon: "history",
    title: "Snelle Service",
    description: "Wij begrijpen dat comfort niet kan wachten. Daarom streven we naar een afspraak binnen 48 uur.",
  },
  {
    icon: "favorite",
    title: "Klantgerichte Aanpak",
    description: "Persoonlijke aandacht en eerlijk advies over de beste installatie voor uw woonsituatie.",
  },
];

export function WhyTPSSection() {
  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl" />
            <h2 className="text-4xl lg:text-5xl font-extrabold font-headline mb-8 tracking-tight leading-tight">
              Waarom kiezen voor <span className="text-primary">TPS Ventilatie</span>?
            </h2>
            <div className="space-y-8">
              {USPs.map((usp) => (
                <div key={usp.title} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Icon name={usp.icon} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{usp.title}</h4>
                    <p className="text-on-surface-variant">{usp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image grid placeholder */}
          <div className="relative">
            <div className="bg-surface-container-highest rounded-4xl p-4 lg:p-8 aspect-square flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full h-full">
                {["Schone lucht", "Vakmanschap", "Vers interieur", "Modern kantoor"].map((alt, i) => (
                  <div
                    key={alt}
                    className={`rounded-2xl overflow-hidden shadow-lg bg-surface-container-low flex items-center justify-center ${
                      i === 1 ? "translate-y-8" : i === 2 ? "-translate-y-4" : i === 3 ? "translate-y-4" : ""
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-tertiary/5 flex items-center justify-center p-4">
                      <span className="text-xs text-on-surface-variant text-center">{alt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
