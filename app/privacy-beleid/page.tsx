import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Beleid",
  description: "Privacy beleid van TPS Ventilatie.",
};

const SECTIONS = [
  {
    title: "1) Waarborgen Privacy",
    content:
      "Het waarborgen van de privacy van bezoekers van tpsventilatie.nl is een belangrijke taak voor ons. Daarom beschrijven we in onze privacy policy welke informatie we verzamelen en hoe we deze informatie gebruiken.",
  },
  {
    title: "2) Toestemming",
    content:
      "Door de informatie en de diensten op tpsventilatie.nl te gebruiken, gaat u akkoord met onze privacy policy en de voorwaarden die wij hierin hebben opgenomen.",
  },
  {
    title: "3) Vragen",
    content:
      "Als u meer informatie wilt ontvangen, of vragen hebt over de privacy policy van TPS Ventilatie en specifiek tpsventilatie.nl, kun u ons benaderen via e-mail. Ons e-mailadres is info@tpsventilatie.nl.",
  },
  {
    title: "4) Monitoren gedrag bezoeker",
    content:
      "tpsventilatie.nl maakt gebruik van verschillende technieken om bij te houden wie de website bezoekt, hoe deze bezoeker zich op de website gedraagt en welke pagina's worden bezocht. Dat is een gebruikelijke manier van werken voor websites omdat het informatie oplevert die bijdraagt aan de kwaliteit van de gebruikerservaring. De informatie die we, via cookies, registreren, bestaat uit onder meer IP-adressen, het type browser en de bezochte pagina's. Tevens monitoren we waar bezoekers de website voor het eerst bezoeken en vanaf welke pagina ze vertrekken. Deze informatie houden we anoniem bij en is niet gekoppeld aan andere persoonlijke informatie.",
  },
  {
    title: "5) Gebruik van cookies",
    content:
      "tpsventilatie.nl plaatst cookies bij bezoekers. Dat doen we om informatie te verzamelen over de pagina's die gebruikers op onze website bezoeken, om bij te houden hoe vaak bezoekers terug komen en om te zien welke pagina's het goed doen op de website. Ook houden we bij welke informatie de browser deelt.",
  },
  {
    title: "6) Cookies uitschakelen",
    content:
      "U kunt er voor kiezen om cookies uit te schakelen. Dat doet u door gebruik te maken de mogelijkheden van uw browser. U vindt meer informatie over deze mogelijkheden op de website van de aanbieder van uw browser.",
  },
  {
    title: "7) Cookies van derde partijen",
    content:
      "Het is mogelijk dat derde partijen, zoals Google, op onze website adverteren of dat wij gebruik maken van een andere dienst. Daarvoor plaatsen deze derde partijen in sommige gevallen cookies. Deze cookies zijn niet door tpsventilatie.nl te beïnvloeden.",
  },
  {
    title: "8) Privacy policy van adverteerders/derde partijen",
    content:
      "Voor meer informatie over de privacy policy van onze adverteerders en derde partijen die verbonden zijn aan deze website, kun u terecht op de websites van deze respectievelijke partijen. tpsventilatie.nl kan geen invloed uitoefenen op deze cookies en de privacy policy van door derden geplaatste cookies. Deze cookies vallen buiten het bereik van de privacy policy van tpsventilatie.nl.",
  },
];

export default function PrivacyBeleidPage() {
  return (
    <main className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 font-label">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-primary">Privacy Beleid</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
          Privacy Beleid
        </h1>
        <p className="text-on-surface-variant mb-12">
          Privacy policy voor TPS Ventilatie, eigenaar van tpsventilatie.nl
        </p>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
                {section.title}
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
