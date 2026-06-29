// Warmtepompen pillar + sub-service nodes (taxonomy data layer, plan 01-05).
// Typed against the PageNode union in ./types. Content filled in Phase 4 (04-04):
// this silo was net-new/empty. Each node gets a unique >=120-word intro, service-
// specific steps, 3-6 distinct FAQs and a regio localAngle; all flipped draft->review.
//
// YMYL note (D-10/D-13): warmtepompen DO qualify for ISDE-subsidie. The ISDE FAQ on
// the PILLAR is the canonical home — it states the durable conditions, cites the
// official rvo.nl warmtepomp URL, and routes euro amounts to a free consult (NO
// bedragen in copy). Sub-services link to the pillar instead of restating conditions.
// Pricing (CONT-05/D-11): the tarieven page is hardcoded JSX with no WP tab and does
// NOT render node content, so the "op maat via offerte" framing + inclusions live on
// the pillar (the only WP pricing surface visitors see). Brands are installed
// equipment only — never a dealer/authorised-installer claim (erkendInstallateur stays
// false in brands.ts); cross-sell is in-copy (no `relatedOverride` in the locked
// taxonomy). Formal `u` (D-14); interim trust wording "vakkundig"/"ervaren".
//
// [ASSUMED] keyword strings are defensible starting assignments from RESEARCH
// §Keyword Map, pending validation in a keyword tool before Phase 4 (A1).

import type { ContentShell, FaqItem, PageNode, StepItem } from "./types";

function draftShell(
  h1: string,
  metaTitle: string,
  metaDescription: string,
  extra?: {
    intro?: string;
    steps?: StepItem[];
    faqs?: FaqItem[];
    localAngle?: string;
  },
): ContentShell {
  return {
    h1,
    intro: extra?.intro ?? "",
    steps: extra?.steps ?? [],
    faqs: extra?.faqs ?? [],
    localAngle: extra?.localAngle ?? "",
    metaTitle,
    metaDescription,
  };
}

const WP_PILLAR_STEPS: StepItem[] = [
  {
    title: "Opname & warmteverliesberekening",
    body: "Wij bepalen het benodigde vermogen via een warmteverliesberekening voor uw woning.",
  },
  {
    title: "Advies & offerte op maat",
    body: "U krijgt een onafhankelijk advies en een heldere offerte met alle inclusies.",
  },
  {
    title: "Installatie",
    body: "Vakkundige montage van de buiten- en binnenunit en aansluiting op uw verwarming.",
  },
  {
    title: "Inbedrijfstelling & service",
    body: "Nauwkeurig inregelen, uitleg van de werking en periodiek onderhoud nadien.",
  },
];

const WP_INSTALLATIE_STEPS: StepItem[] = [
  {
    title: "Warmteverliesberekening",
    body: "Wij berekenen exact welk vermogen uw woning nodig heeft, zodat de warmtepomp goed is gedimensioneerd.",
  },
  {
    title: "Plaatsing buiten- en binnenunit",
    body: "De units worden trillingsvrij en op een doordachte plek gemonteerd.",
  },
  {
    title: "Aansluiting & (hybride) koppeling",
    body: "Aansluiting op uw afgiftesysteem; bij een hybride opstelling de koppeling met de cv-ketel.",
  },
  {
    title: "Inbedrijfstelling & uitleg",
    body: "Nauwkeurig inregelen, een functietest en een rustige uitleg van de bediening.",
  },
];

const WP_ONDERHOUD_STEPS: StepItem[] = [
  {
    title: "Koudemiddel & druk controleren",
    body: "Wij controleren het koudemiddelniveau en de werkdruk en vullen bij waar nodig.",
  },
  {
    title: "Filters & buitenunit reinigen",
    body: "Reiniging van filters en de buitenunit voor een hoog rendement.",
  },
  {
    title: "Elektronica & software controleren",
    body: "Controle van de aansluitingen en de regelinstellingen voor een efficiënte werking.",
  },
  {
    title: "Rendementstest",
    body: "Een test of de warmtepomp optimaal presteert, met een kort verslag.",
  },
];

const WP_STORING_STEPS: StepItem[] = [
  {
    title: "Foutcode uitlezen & diagnose",
    body: "Wij lezen de foutcodes uit en controleren koudemiddel, druk, sensoren en elektronica.",
  },
  {
    title: "Reparatie of onderdeel vervangen",
    body: "Waar mogelijk verhelpen wij de storing ter plaatse; een onderdeel regelen wij snel.",
  },
  {
    title: "Inregelen & test",
    body: "Na de reparatie regelen wij de installatie opnieuw in en testen wij de werking.",
  },
];

const WP_ADVIES_STEPS: StepItem[] = [
  {
    title: "Vrijblijvende opname",
    body: "Wij maken een warmteverliesberekening en bekijken isolatie, afgiftesysteem en wensen.",
  },
  {
    title: "Geschiktheid & isolatie beoordelen",
    body: "Wij beoordelen of een volledige of hybride warmtepomp het meeste oplevert.",
  },
  {
    title: "Onafhankelijk advies & offerte",
    body: "U ontvangt een transparant, merk-onafhankelijk advies en een heldere offerte.",
  },
];

export const WARMTEPOMPEN_PAGES: PageNode[] = [
  {
    type: "pillar",
    pillarSlug: "warmtepompen",
    status: "review",
    primaryKeyword: "warmtepomp",
    searchIntent: "commercieel",
    secondaryKeywords: ["warmtepomp specialist", "hybride warmtepomp Zoetermeer"],
    navTitle: "Warmtepompen",
    navDescription: "Installatie, onderhoud en reparatie van warmtepompen",
    icon: "heat_pump",
    content: draftShell(
      "Warmtepompen",
      "Warmtepomp in de regio Zoetermeer | TPS klimaattechniek",
      "Warmtepompen: installatie, onderhoud en reparatie in Zoetermeer en omgeving.",
      {
        intro:
          "Een warmtepomp is een duurzame, energiezuinige manier om uw woning te verwarmen — en in veel gevallen ook te koelen. In plaats van gas te verstoken haalt een warmtepomp warmte uit de buitenlucht en brengt die met een hoog rendement naar uw woning. Dat verlaagt uw energierekening en uw CO2-uitstoot en maakt u minder afhankelijk van gas. Bij TPS klimaattechniek installeren wij zowel volledige lucht-water warmtepompen als hybride systemen, die de warmtepomp combineren met uw bestaande cv-ketel. Wij werken met betrouwbare merken als Daikin en Mitsubishi Ecodan en verzorgen het hele traject: van een warmteverliesberekening en onafhankelijk advies tot installatie, inbedrijfstelling en periodiek onderhoud. Voor veel woningen is bovendien ISDE-subsidie beschikbaar — wij leggen u de voorwaarden helder uit en helpen u op weg. Onze ervaren monteurs werken netjes en denken met u mee over de beste oplossing voor uw woning in Zoetermeer en omgeving.",
        steps: WP_PILLAR_STEPS,
        faqs: [
          {
            question: "Kom ik in aanmerking voor ISDE-subsidie op een warmtepomp?",
            answer:
              "Voor veel woningen is ISDE-subsidie beschikbaar voor een (hybride) warmtepomp voor ruimte- of tapwaterverwarming. De belangrijkste voorwaarden: uw woning is gebouwd vóór 1 januari 2019 (of de omgevingsvergunning is vóór 1 juli 2018 aangevraagd), de volledige installatie wordt door een installatiebedrijf uitgevoerd (u mag dit niet zelf doen), de warmtepomp is nieuw en staat op de meldcodelijst, en u vraagt de subsidie binnen 24 maanden na installatie aan. Voor sommige split-systemen gelden aanvullende voorwaarden. De exacte bedragen verschillen per vermogen en type en veranderen jaarlijks — vraag ons vrijblijvend om een actuele berekening voor uw situatie. De officiële voorwaarden vindt u op rvo.nl: https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp.",
          },
          {
            question: "Wat kost een warmtepomp?",
            answer:
              "Een warmtepomp leveren wij op maat: de prijs hangt af van het type (hybride of volledig), het benodigde vermogen en uw woning. U ontvangt daarom altijd een offerte op maat. Daarin is alles inbegrepen: de opname en warmteverliesberekening, het materiaal, de installatie en de inbedrijfstelling. Vraag een vrijblijvende offerte aan, dan rekenen wij het voor uw situatie helemaal uit — zonder verrassingen achteraf.",
          },
          {
            question: "Hybride of volledige warmtepomp — wat is het verschil?",
            answer:
              "Een hybride warmtepomp werkt samen met uw bestaande cv-ketel: de warmtepomp verwarmt het grootste deel van het jaar en de ketel springt bij op de koudste dagen. Een volledige (lucht-water) warmtepomp verwarmt uw woning helemaal zelf en maakt de cv-ketel overbodig. Welke het beste past, hangt af van uw isolatie, afgiftesysteem en wensen — wij adviseren u daarin onafhankelijk.",
          },
          {
            question: "Hoeveel geluid maakt de buitenunit van een warmtepomp?",
            answer:
              "Moderne warmtepompen zijn relatief stil, maar de buitenunit maakt wel wat geluid. Daarom kiezen wij samen met u een doordachte plek en houden wij rekening met de geldende geluidsnormen en met uw buren. Bij een appartement of VvE stemmen wij de plaatsing zorgvuldig af.",
          },
          {
            question: "Hoe lang gaat een warmtepomp mee en zit er garantie op?",
            answer:
              "Met goed onderhoud gaat een kwaliteitswarmtepomp doorgaans 15 tot 20 jaar mee. U krijgt fabrieksgarantie op de apparatuur en garantie op onze installatie; periodiek onderhoud houdt de garantie en het rendement op peil. De exacte voorwaarden lichten wij vooraf helder toe.",
          },
        ],
        localAngle:
          "TPS klimaattechniek installeert en onderhoudt warmtepompen in Zoetermeer en de regio daaromheen — waaronder Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Delft, Leiden en Gouda. Dankzij korte aanrijtijden bent u snel geholpen en rekenen wij geen voorrijkosten binnen ons werkgebied.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "warmtepompen",
    serviceSlug: "installatie",
    status: "review",
    primaryKeyword: "warmtepomp laten installeren",
    searchIntent: "transactioneel",
    secondaryKeywords: [
      "warmtepomp installatie kosten",
      "warmtepomp installateur",
    ],
    navTitle: "Installatie",
    navDescription: "Warmtepomp laten installeren door een specialist",
    icon: "build",
    brandIds: ["daikin", "mitsubishi-ecodan"],
    content: draftShell(
      "Warmtepomp laten installeren",
      "Warmtepomp laten installeren | TPS klimaattechniek",
      "Laat uw warmtepomp vakkundig installeren door TPS klimaattechniek in de regio Zoetermeer.",
      {
        intro:
          "Een warmtepomp laten installeren is vakwerk dat begint met een goede berekening. Tijdens de opname maken wij een warmteverliesberekening: zo bepalen wij exact welk vermogen uw woning nodig heeft en voorkomen wij een te zwaar of te licht systeem. Wij installeren zowel volledige lucht-water warmtepompen als hybride opstellingen, met betrouwbare merken als Daikin en Mitsubishi Ecodan. Onze ervaren monteurs verzorgen de complete installatie: het plaatsen van de buiten- en binnenunit, het aansluiten op uw verwarmingssysteem en, bij een hybride opstelling, de koppeling met uw bestaande cv-ketel. Daarna stellen wij het systeem nauwkeurig in bedrijf en leggen wij de werking rustig aan u uit. Voor veel woningen is ISDE-subsidie beschikbaar; op onze warmtepompen-pagina leest u de actuele voorwaarden. Wij leveren netjes op en zorgen dat uw nieuwe warmtepomp vanaf dag één efficiënt presteert.",
        steps: WP_INSTALLATIE_STEPS,
        faqs: [
          {
            question: "Hoe lang duurt het installeren van een warmtepomp?",
            answer:
              "Een doorsnee installatie ronden wij vaak in één tot twee werkdagen af, afhankelijk van het type warmtepomp, uw afgiftesysteem en of er aanpassingen aan leidingwerk nodig zijn. Tijdens de opname geven wij u een realistische inschatting.",
          },
          {
            question: "Waar komt de buitenunit van de warmtepomp te staan?",
            answer:
              "De buitenunit plaatsen wij op de grond of aan de gevel, op een plek met voldoende luchtstroom en zo kort mogelijk leidingwerk. Wij houden rekening met geluid en met de afstand tot ramen en de erfgrens, zodat u en uw buren er geen last van hebben.",
          },
          {
            question: "Kan ik een warmtepomp combineren met mijn bestaande cv-ketel?",
            answer:
              "Ja, dat is precies wat een hybride warmtepomp doet: de warmtepomp verwarmt het grootste deel van het jaar en uw cv-ketel springt bij op de koudste dagen. Het is een toegankelijke eerste stap naar duurzamer verwarmen, vaak zonder dat uw afgiftesysteem aangepast hoeft te worden.",
          },
        ],
        localAngle:
          "Of u nu in Zoetermeer, Den Haag of Lansingerland woont — wij plannen de installatie zorgvuldig in en komen met de juiste materialen bij u langs, zonder voorrijkosten binnen ons werkgebied.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "warmtepompen",
    serviceSlug: "onderhoud",
    status: "review",
    primaryKeyword: "warmtepomp onderhoud",
    searchIntent: "commercieel",
    secondaryKeywords: [
      "warmtepomp onderhoud kosten",
      "onderhoudscontract warmtepomp",
    ],
    navTitle: "Onderhoud",
    navDescription: "Periodiek onderhoud voor een efficiënte warmtepomp",
    icon: "cleaning_services",
    content: draftShell(
      "Warmtepomp onderhoud",
      "Warmtepomp onderhoud | TPS klimaattechniek",
      "Periodiek warmtepomp-onderhoud voor optimale prestaties en een langere levensduur.",
      {
        intro:
          "Een warmtepomp die goed onderhouden wordt, presteert jarenlang zuinig en betrouwbaar. Net als bij een cv-ketel neemt het rendement langzaam af als koudemiddel, filters en elektronica niet periodiek worden gecontroleerd — met een hogere energierekening en meer kans op storingen als gevolg. Tijdens een onderhoudsbeurt controleren wij het koudemiddelniveau en de werkdruk, reinigen wij de filters en de buitenunit, controleren wij de elektrische aansluitingen en de regelinstellingen en testen wij of het systeem optimaal presteert. Zo houdt u uw warmtepomp op vol rendement en verlengt u de levensduur. Voor particulieren en bedrijven in Zoetermeer en omgeving plannen wij het onderhoud op een moment dat u uitkomt; desgewenst bespreken wij een periodieke onderhoudsafspraak, zodat u er niet meer aan hoeft te denken. Wij adviseren u eerlijk over de juiste frequentie voor uw type warmtepomp en gebruik.",
        steps: WP_ONDERHOUD_STEPS,
        faqs: [
          {
            question: "Hoe vaak moet een warmtepomp onderhouden worden?",
            answer:
              "Voor de meeste warmtepompen adviseren wij periodiek onderhoud, doorgaans eens per één à twee jaar afhankelijk van het type en gebruik. Veel fabrikanten koppelen de garantie aan periodiek onderhoud; wij stemmen het juiste interval met u af.",
          },
          {
            question: "Wat wordt er tijdens het onderhoud van een warmtepomp gedaan?",
            answer:
              "Wij controleren het koudemiddelniveau en de werkdruk, reinigen de filters en de buitenunit, controleren de elektrische aansluitingen en de regelinstellingen en voeren een rendementstest uit. Eventuele aandachtspunten bespreken wij direct met u.",
          },
          {
            question: "Is een onderhoudscontract voor mijn warmtepomp verplicht?",
            answer:
              "Een onderhoudscontract is niet wettelijk verplicht, maar wel verstandig: het houdt het rendement hoog, voorkomt storingen en is bij veel fabrikanten een voorwaarde voor de garantie. Wij bespreken graag een periodieke onderhoudsafspraak die bij u past.",
          },
        ],
        localAngle:
          "Voor woningen, VvE's en bedrijven in Zoetermeer en omgeving plannen wij warmtepomponderhoud flexibel in, zodat uw installatie jaar in jaar uit zuinig en betrouwbaar blijft.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "warmtepompen",
    serviceSlug: "reparatie-storing",
    status: "review",
    primaryKeyword: "warmtepomp storing",
    searchIntent: "transactioneel",
    secondaryKeywords: ["warmtepomp reparatie", "warmtepomp monteur"],
    navTitle: "Reparatie & storing",
    navDescription: "Snelle hulp bij warmtepompstoringen",
    icon: "handyman",
    content: draftShell(
      "Warmtepomp reparatie en storing",
      "Warmtepomp storing & reparatie | TPS klimaattechniek",
      "Snelle reparatie bij warmtepompstoringen in Zoetermeer en omgeving.",
      {
        intro:
          "Geeft uw warmtepomp geen warmte meer, toont hij een foutcode of maakt hij een vreemd geluid? Een haperende warmtepomp is vervelend, zeker in het stookseizoen. Bij TPS klimaattechniek reageren wij snel en komen wij waar mogelijk op korte termijn langs om de storing te verhelpen. Onze monteurs stellen eerst een gerichte diagnose: zij lezen de foutcodes uit en controleren het koudemiddelniveau, de druk, de pompen, de sensoren en de elektronica om de oorzaak te achterhalen. Veelvoorkomende klachten zijn een te laag koudemiddelniveau, een lekkage, een defecte sensor, een storing in de buitenunit of een verkeerd ingeregelde installatie. Waar het kan verhelpen wij de storing ter plaatse; is er een onderdeel nodig, dan regelen wij dat zo snel mogelijk. Zo hebt u snel weer een warme woning en een warmtepomp die efficiënt draait, zonder onnodig lang in de kou te zitten.",
        steps: WP_STORING_STEPS,
        faqs: [
          {
            question: "Mijn warmtepomp geeft geen warmte meer — wat kan de oorzaak zijn?",
            answer:
              "Veelvoorkomende oorzaken zijn een te laag koudemiddelniveau, een lekkage, een defecte sensor, een storing in de buitenunit of een verkeerd ingeregelde installatie. Met een uitlezing van de foutcodes en een gerichte diagnose achterhalen wij de oorzaak en lossen wij die waar mogelijk direct op.",
          },
          {
            question: "Wat kost het verhelpen van een warmtepompstoring?",
            answer:
              "Dat hangt af van de oorzaak en eventuele onderdelen. Wij stellen eerst een diagnose en bespreken de kosten met u voordat wij repareren, zodat u nooit voor verrassingen komt te staan. Neem gerust vrijblijvend contact op.",
          },
          {
            question: "Hoe snel kunt u bij een warmtepompstoring langskomen?",
            answer:
              "Wij doen ons best om bij storingen snel te schakelen en kunnen vaak op korte termijn langskomen, zeker in het stookseizoen. Neem telefonisch of via WhatsApp contact op, dan plannen wij u zo snel mogelijk in.",
          },
        ],
        localAngle:
          "Dankzij onze ligging in Zoetermeer en korte aanrijtijden in de regio Den Haag, Leiden en Delft zijn wij bij een warmtepompstoring snel ter plaatse.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "warmtepompen",
    serviceSlug: "advies",
    status: "review",
    primaryKeyword: "warmtepomp advies regio Den Haag",
    searchIntent: "informationeel",
    secondaryKeywords: ["warmtepomp advies", "welke warmtepomp"],
    navTitle: "Advies",
    navDescription: "Welke warmtepomp past bij uw woning?",
    icon: "support_agent",
    content: draftShell(
      "Warmtepomp advies",
      "Warmtepomp advies regio Den Haag | TPS klimaattechniek",
      "Onafhankelijk advies over de juiste warmtepomp voor uw woning, inclusief ISDE-subsidie.",
      {
        intro:
          "Twijfelt u of een warmtepomp geschikt is voor uw woning, of welk type het beste past? Wij geven u graag onafhankelijk en eerlijk advies. Niet elke woning en niet elke situatie vraagt om dezelfde oplossing: de mate van isolatie, het type afgiftesysteem (radiatoren of vloerverwarming) en uw verwarmingsgedrag bepalen of een volledige of een hybride warmtepomp het meeste oplevert. Tijdens een vrijblijvende opname op locatie maken wij een warmteverliesberekening en bekijken wij de isolatie, de ruimte voor een buitenunit en uw wensen. Op basis daarvan adviseren wij u welk systeem en welk vermogen het beste rendement geven — onafhankelijk van merk. Ook bespreken wij of u in aanmerking komt voor ISDE-subsidie; de actuele voorwaarden vindt u op onze warmtepompen-pagina. U ontvangt een transparant advies en een heldere offerte, zodat u een weloverwogen keuze maakt zonder verkooppraatjes.",
        steps: WP_ADVIES_STEPS,
        faqs: [
          {
            question: "Is mijn woning geschikt voor een warmtepomp?",
            answer:
              "Veel woningen zijn geschikt, maar de mate van isolatie en het afgiftesysteem bepalen wat het beste werkt. Goed geïsoleerde woningen met vloerverwarming lenen zich uitstekend voor een volledige warmtepomp; in andere gevallen is een hybride opstelling vaak een verstandige eerste stap. Tijdens de opname beoordelen wij dit voor uw situatie.",
          },
          {
            question: "Welke warmtepomp past het best bij mijn woning?",
            answer:
              "Dat hangt af van uw isolatie, afgiftesysteem, ruimte voor een buitenunit en wensen. Op basis van een warmteverliesberekening adviseren wij u onafhankelijk over het type en het vermogen dat het beste rendement geeft — wij zitten niet vast aan één merk.",
          },
          {
            question: "Helpt u ook met de ISDE-subsidieaanvraag?",
            answer:
              "Ja, wij leggen u de voorwaarden uit en helpen u op weg met de aanvraag. De volledige, actuele voorwaarden en bedragen vindt u op onze warmtepompen-pagina en op de officiële website rvo.nl; wij zorgen dat uw installatie aan de eisen voldoet zodat u de subsidie kunt aanvragen.",
          },
        ],
        localAngle:
          "Wij kennen de woningen en de bouwjaren in de regio Zoetermeer goed en adviseren u op basis van uw specifieke situatie, of u nu in een rijwoning, een vrijstaande woning of een appartement woont.",
      },
    ),
  },
];
