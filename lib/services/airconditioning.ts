// Airconditioning pillar + sub-service nodes (taxonomy data layer, plan 01-05).
// Typed against the PageNode union in ./types. Content filled in Phase 4 (04-03):
// unique >=120-word intros, service-specific steps, 3-6 distinct FAQs and a regio
// localAngle per node; all nodes flipped draft -> review.
//
// YMYL note (D-13): airconditioning is cooling -> there is NO ISDE/subsidie for it
// (ISDE applies to warmtepompen / ventilatie). Any subsidie mention here is the
// explicit "geen ISDE-subsidie voor koeling" framing. Brands are named as installed
// equipment only — never a dealer / authorised-installer claim (the erkendInstallateur
// flag stays false in brands.ts; cross-sell uses in-copy links because the locked
// taxonomy has no `relatedOverride` field). Voice is formal `u` (D-14); interim
// trust wording is "vakkundig"/"ervaren", never the certified-status word until proof.
//
// [ASSUMED] every primaryKeyword/secondaryKeyword is a defensible starting
// assignment from RESEARCH §Keyword Map, pending validation in a keyword tool (A1).

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

const AIRCO_PILLAR_STEPS: StepItem[] = [
  {
    title: "Opname & advies",
    body: "Vrijblijvende opname op locatie; wij bepalen de juiste capaciteit en de beste positie van de units.",
  },
  {
    title: "Offerte op maat",
    body: "Een heldere offerte met een passend systeem en een all-in prijs, zonder verrassingen achteraf.",
  },
  {
    title: "Vakkundige installatie",
    body: "Nette montage van de binnen- en buitenunit, inclusief leidingwerk, vacuümtrekken en een uitgebreide test.",
  },
  {
    title: "Service & onderhoud",
    body: "Periodiek onderhoud en snelle hulp bij storingen, ook jaren na de installatie.",
  },
];

const AIRCO_INSTALLATIE_STEPS: StepItem[] = [
  {
    title: "Opname & positiebepaling",
    body: "Wij bepalen de beste plek voor de binnen- en buitenunit en de route van het leidingwerk.",
  },
  {
    title: "Montage binnen- en buitenunit",
    body: "De units worden stevig en trillingsvrij gemonteerd op de afgesproken posities.",
  },
  {
    title: "Leidingwerk & vacuümtrekken",
    body: "Koelleidingen worden weggewerkt, het systeem vacuüm getrokken en met koudemiddel gevuld.",
  },
  {
    title: "Testen & oplevering",
    body: "Een volledige functietest, schone oplevering en een rustige uitleg van de bediening.",
  },
];

const AIRCO_ONDERHOUD_STEPS: StepItem[] = [
  {
    title: "Filters & binnenunit reinigen",
    body: "Filters en de binnenunit worden gereinigd voor schone lucht en een hoog rendement.",
  },
  {
    title: "Druk & koudemiddel controleren",
    body: "Wij controleren de werkdruk en het koudemiddelniveau en vullen bij waar nodig.",
  },
  {
    title: "Condensafvoer controleren",
    body: "De condensafvoer wordt geïnspecteerd en doorgespoeld om lekkage en verstopping te voorkomen.",
  },
  {
    title: "Functietest",
    body: "Een test van koelen en verwarmen, zodat u zeker weet dat alles optimaal werkt.",
  },
];

const AIRCO_STORING_STEPS: StepItem[] = [
  {
    title: "Gerichte diagnose",
    body: "Wij controleren elektronica, koudemiddelniveau, sensoren en afvoer om de oorzaak te vinden.",
  },
  {
    title: "Reparatie",
    body: "Waar mogelijk repareren wij ter plaatse; is een onderdeel nodig, dan regelen wij dat snel.",
  },
  {
    title: "Test & oplevering",
    body: "Een functietest en controle voordat wij de klus netjes afronden.",
  },
];

const AIRCO_ADVIES_STEPS: StepItem[] = [
  {
    title: "Vrijblijvende opname",
    body: "Wij bekijken de te koelen ruimtes, de isolatie en uw wensen op locatie.",
  },
  {
    title: "Capaciteitsberekening",
    body: "Wij berekenen het juiste vermogen, zodat uw airco niet te zwaar of te licht is gedimensioneerd.",
  },
  {
    title: "Persoonlijk advies",
    body: "U ontvangt een helder, onafhankelijk advies en een offerte op maat.",
  },
];

export const AIRCONDITIONING_PAGES: PageNode[] = [
  {
    type: "pillar",
    pillarSlug: "airconditioning",
    status: "review",
    primaryKeyword: "airconditioning",
    searchIntent: "commercieel",
    secondaryKeywords: ["airco specialist Zoetermeer", "airco regio Den Haag"],
    navTitle: "Airconditioning",
    navDescription: "Installatie, onderhoud en reparatie van aircosystemen",
    icon: "ac_unit",
    content: draftShell(
      "Airconditioning",
      "Airconditioning in de regio Zoetermeer | TPS klimaattechniek",
      "Airconditioning: installatie, onderhoud en reparatie in Zoetermeer en omgeving.",
      {
        intro:
          "Airconditioning zorgt het hele jaar door voor een aangename temperatuur in uw woning of bedrijfspand. In de zomer koelt een moderne airco snel en efficiënt, terwijl een lucht-lucht airco in het tussenseizoen ook comfortabel kan verwarmen. Bij TPS klimaattechniek verzorgen wij het complete traject: van een vrijblijvende opname op locatie en onafhankelijk advies tot installatie, periodiek onderhoud en snelle hulp bij storingen. Wij installeren airconditioning van Daikin, Mitsubishi Electric en Mitsubishi Heavy — merken die wij kiezen om hun betrouwbaarheid, stille werking en zuinige rendement. Onze ervaren monteurs werken netjes en denken met u mee over de beste positie en capaciteit voor uw situatie. Of u nu één ruimte wilt koelen met een single-split of meerdere kamers met een multi-split systeem: u krijgt een oplossing die past bij uw woning, uw wensen en uw budget. Wij zijn actief in Zoetermeer, Den Haag, Delft, Leiden en de wijde omgeving.",
        // Light D-20 cross-sell to warmtepompen lives in the subsidie/advies copy
        // (in-copy only — the locked taxonomy has no `relatedOverride` field).
        steps: AIRCO_PILLAR_STEPS,
        faqs: [
          {
            question: "Krijg ik subsidie voor airconditioning?",
            answer:
              "Voor airconditioning (koeling) is er geen ISDE-subsidie beschikbaar; die subsidie geldt voor warmtepompen. Een airco die óók kan verwarmen is wel energiezuinig — wilt u vooral duurzaam verwarmen, vraag ons dan gerust om vrijblijvend advies over een warmtepomp.",
          },
          {
            question: "Is een airconditioning luidruchtig?",
            answer:
              "Moderne systemen zijn fluisterstil; de binnenunit produceert in de praktijk weinig geluid. De buitenunit maakt iets meer geluid, daarom kiezen wij samen met u een doordachte plek zodat u en uw buren er geen last van hebben.",
          },
          {
            question: "Wat kost airconditioning?",
            answer:
              "De prijs hangt af van het type systeem, het aantal te koelen ruimtes en de situatie ter plaatse. Bekijk onze tarieven voor een richtprijs of vraag een vrijblijvende offerte op maat aan.",
          },
          {
            question: "Hoelang gaat een airco mee en zit er garantie op?",
            answer:
              "Met goed onderhoud gaat een kwaliteitsairco doorgaans 10 tot 15 jaar mee. U krijgt fabrieksgarantie op de apparatuur en garantie op onze installatie; de exacte voorwaarden lichten wij vooraf helder toe.",
          },
        ],
        localAngle:
          "TPS klimaattechniek is actief in Zoetermeer en de regio daaromheen — waaronder Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Delft, Leiden en Gouda. Dankzij korte aanrijtijden bent u snel geholpen en rekenen wij geen voorrijkosten binnen ons werkgebied.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "airconditioning",
    serviceSlug: "installatie",
    status: "review",
    primaryKeyword: "airco laten installeren",
    searchIntent: "transactioneel",
    secondaryKeywords: [
      "airco installatie kosten",
      "airco laten plaatsen Zoetermeer",
    ],
    navTitle: "Installatie",
    navDescription: "Airco laten installeren door een specialist",
    icon: "build",
    brandIds: ["daikin", "mitsubishi-electric", "mitsubishi-heavy"],
    content: draftShell(
      "Airco laten installeren",
      "Airco laten installeren | TPS klimaattechniek",
      "Laat uw airco vakkundig installeren door TPS klimaattechniek in de regio Zoetermeer.",
      {
        intro:
          "Een airco laten installeren begint bij een goede voorbereiding. Tijdens een opname op locatie bekijken wij de indeling van uw woning, de beste plek voor de binnen- en buitenunit en de route voor het leidingwerk. Op basis daarvan adviseren wij een single-split met één binnenunit of een multi-split systeem waarmee u meerdere ruimtes vanaf één buitenunit koelt en verwarmt. Wij installeren airconditioning van Daikin, Mitsubishi Electric en Mitsubishi Heavy: betrouwbare merken met een stille werking en een hoog rendement. Onze ervaren monteurs verzorgen de complete montage — het ophangen van de units, het wegwerken van de koelleidingen, het vacuümtrekken en vullen van het systeem en een uitgebreide test. Na afloop leveren wij de installatie schoon op en leggen wij de bediening rustig aan u uit, zodat u direct kunt genieten van een aangename temperatuur. Alles wordt netjes en volgens de geldende normen uitgevoerd, zodat u jarenlang zorgeloos van uw systeem geniet.",
        steps: AIRCO_INSTALLATIE_STEPS,
        faqs: [
          {
            question: "Hoe lang duurt het installeren van een airco?",
            answer:
              "Een standaard single-split installatie ronden wij doorgaans in één dag af. Bij een multi-split systeem met meerdere binnenunits of een lastig leidingtracé kan het iets langer duren; dat bespreken wij vooraf met u.",
          },
          {
            question: "Wat is het verschil tussen een single-split en een multi-split?",
            answer:
              "Een single-split koppelt één binnenunit aan één buitenunit en is ideaal voor één ruimte. Een multi-split verbindt meerdere binnenunits met één buitenunit, zodat u verschillende kamers afzonderlijk regelt zonder meerdere buitenunits aan de gevel.",
          },
          {
            question: "Waar komen de binnen- en buitenunit te hangen?",
            answer:
              "De binnenunit plaatsen wij op een plek met een goede luchtverdeling, bijvoorbeeld hoog aan de wand. De buitenunit komt op de grond, aan de gevel of op het dak — wij kiezen samen met u een plek met zo kort mogelijk leidingwerk en zo min mogelijk geluid.",
          },
          {
            question: "Moet ik iets voorbereiden voordat de monteur komt?",
            answer:
              "U hoeft weinig te doen: zorg dat de gekozen plekken vrij toegankelijk zijn. Tijdens de opname bespreken wij alle details vooraf, zodat de monteur op de afspraak meteen aan de slag kan.",
          },
        ],
        localAngle:
          "Of u nu in Zoetermeer, Den Haag of Pijnacker-Nootdorp woont — wij plannen de installatie op korte termijn en komen met de juiste materialen bij u langs, zonder voorrijkosten binnen ons werkgebied.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "airconditioning",
    serviceSlug: "onderhoud",
    status: "review",
    primaryKeyword: "airco onderhoud",
    searchIntent: "commercieel",
    secondaryKeywords: ["airco onderhoud kosten", "airco service"],
    navTitle: "Onderhoud",
    navDescription: "Periodiek onderhoud voor een efficiënte airco",
    icon: "cleaning_services",
    content: draftShell(
      "Airco onderhoud",
      "Airco onderhoud | TPS klimaattechniek",
      "Periodiek airco-onderhoud voor optimale prestaties en een langere levensduur.",
      {
        intro:
          "Goed onderhoud houdt uw airconditioning efficiënt, hygiënisch en betrouwbaar. Stof, vuil en vocht hopen zich na verloop van tijd op in de filters en de binnenunit, wat de luchtkwaliteit verslechtert, het energieverbruik opdrijft en nare geurtjes kan veroorzaken. Met periodiek onderhoud voorkomt u storingen en verlengt u de levensduur van uw systeem. Tijdens een onderhoudsbeurt reinigen wij de filters en de binnenunit, controleren wij de werkdruk en het koudemiddel, inspecteren wij de condensafvoer op verstoppingen en testen wij of het systeem optimaal koelt en verwarmt. Zo blijft uw airco zuinig draaien en ademt u schone, frisse lucht in. Voor particulieren, VvE's en bedrijven in Zoetermeer en omgeving plannen wij het onderhoud op een moment dat u uitkomt. Wij adviseren u eerlijk over de juiste onderhoudsfrequentie voor uw situatie, zodat u nooit te veel of te weinig laat doen.",
        steps: AIRCO_ONDERHOUD_STEPS,
        faqs: [
          {
            question: "Hoe vaak moet ik mijn airco laten onderhouden?",
            answer:
              "Voor de meeste woonsituaties adviseren wij één onderhoudsbeurt per jaar. Bij intensief gebruik of in een stoffige omgeving kan vaker verstandig zijn; wij stemmen dat met u af op basis van uw gebruik.",
          },
          {
            question: "Wat wordt er tijdens een onderhoudsbeurt gedaan?",
            answer:
              "Wij reinigen de filters en de binnenunit, controleren de werkdruk en het koudemiddelniveau, inspecteren en spoelen de condensafvoer en voeren een functietest uit op koelen en verwarmen.",
          },
          {
            question: "Kan ik mijn airco zelf onderhouden of is een vakman nodig?",
            answer:
              "Het schoonmaken van de filters kunt u prima zelf doen. Het controleren van het koudemiddel en de druk is werk voor een vakkundige monteur met de juiste apparatuur — dat houdt uw systeem veilig én efficiënt.",
          },
        ],
        localAngle:
          "Voor particulieren, VvE's en bedrijven in Zoetermeer en omgeving plannen wij onderhoud flexibel in, ook periodiek, zodat uw airco jaar in jaar uit betrouwbaar blijft draaien.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "airconditioning",
    serviceSlug: "reparatie-storing",
    status: "review",
    primaryKeyword: "airco storing",
    searchIntent: "transactioneel",
    secondaryKeywords: ["airco reparatie", "airco monteur spoed"],
    navTitle: "Reparatie & storing",
    navDescription: "Snelle hulp bij aircostoringen",
    icon: "handyman",
    content: draftShell(
      "Airco reparatie en storing",
      "Airco storing & reparatie | TPS klimaattechniek",
      "Snelle reparatie bij aircostoringen in Zoetermeer en omgeving.",
      {
        intro:
          "Werkt uw airco niet meer naar behoren? Een systeem dat niet meer koelt, water lekt, vreemde geluiden maakt of een foutcode toont, vraagt om snelle en vakkundige hulp. Bij TPS klimaattechniek begrijpen wij dat een defecte airco op een warme dag bijzonder vervelend is. Daarom reageren wij snel en komen wij waar mogelijk op korte termijn langs om de storing te verhelpen. Onze monteurs stellen eerst een gerichte diagnose: zij controleren de elektronica, het koudemiddelniveau, de sensoren en de afvoer om de oorzaak te achterhalen. Veelvoorkomende klachten zijn een te laag koudemiddelniveau, vervuilde filters, een verstopte condensafvoer of een versleten onderdeel. Waar het kan repareren wij ter plaatse; is er een onderdeel nodig, dan regelen wij dat zo snel mogelijk. Zo bent u weer snel verzekerd van een aangenaam binnenklimaat in uw woning of bedrijf, zonder onnodig lang in de kou of de hitte te zitten.",
        steps: AIRCO_STORING_STEPS,
        faqs: [
          {
            question: "Mijn airco koelt niet meer — wat kan de oorzaak zijn?",
            answer:
              "Veelvoorkomende oorzaken zijn een te laag koudemiddelniveau, sterk vervuilde filters, een verstopte condensafvoer of een defect onderdeel. Met een gerichte diagnose achterhalen wij de oorzaak en lossen wij die waar mogelijk direct op.",
          },
          {
            question: "Wat kost een airco-reparatie?",
            answer:
              "De kosten hangen af van de oorzaak en eventuele onderdelen. Wij stellen eerst een diagnose en bespreken de kosten met u voordat wij repareren — u komt nooit voor verrassingen te staan. Vraag gerust vrijblijvend advies aan.",
          },
          {
            question: "Hoe snel kunt u bij een storing langskomen?",
            answer:
              "Wij doen ons best om bij storingen snel te schakelen en kunnen vaak op korte termijn langskomen. Neem telefonisch of via WhatsApp contact op, dan plannen wij u zo snel mogelijk in.",
          },
        ],
        localAngle:
          "Dankzij onze ligging in Zoetermeer en korte aanrijtijden in de regio Den Haag, Leiden en Delft zijn wij bij een storing snel ter plaatse.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "airconditioning",
    serviceSlug: "advies",
    status: "review",
    primaryKeyword: "airco advies Zoetermeer",
    searchIntent: "informationeel",
    secondaryKeywords: ["welke airco kiezen", "airco of warmtepomp"],
    navTitle: "Advies",
    navDescription: "Welke airco past bij uw situatie?",
    icon: "support_agent",
    content: draftShell(
      "Airco advies",
      "Airco advies Zoetermeer | TPS klimaattechniek",
      "Onafhankelijk advies over de juiste airco voor uw woning of bedrijf.",
      {
        intro:
          "Niet zeker welke airconditioning bij uw situatie past? Wij geven u graag onafhankelijk en eerlijk advies. Omdat wij met meerdere topmerken werken, adviseren wij u het systeem dat het best aansluit bij uw woning, uw wensen en uw budget — niet het merk dat ons toevallig uitkomt. Tijdens een vrijblijvende opname op locatie bekijken wij de te koelen ruimtes, de isolatie, de raampartijen en de gewenste temperatuur. Op basis daarvan maken wij een capaciteitsberekening, zodat uw airco niet te zwaar of te licht is gedimensioneerd: dat voorkomt onnodig energieverbruik én een tegenvallend resultaat. Wij leggen u helder de verschillen uit tussen single- en multi-split systemen en tussen koelen en verwarmen. Overweegt u juist een duurzame verwarmingsoplossing, dan bespreken wij ook of een warmtepomp interessant voor u is. U ontvangt een transparant advies waarmee u een weloverwogen keuze maakt, zonder verkooppraatjes.",
        steps: AIRCO_ADVIES_STEPS,
        faqs: [
          {
            question: "Welke airco past het best bij mijn situatie?",
            answer:
              "Dat hangt af van de ruimtes die u wilt koelen of verwarmen, de isolatie en uw wensen. Op basis van een opname en een capaciteitsberekening adviseren wij u onafhankelijk over het systeem dat het best bij u past.",
          },
          {
            question: "Airco of warmtepomp — wat kan ik het beste kiezen?",
            answer:
              "Wilt u vooral koelen (met de optie om bij te verwarmen), dan is een airco vaak de juiste keuze. Wilt u uw woning duurzaam verwarmen en mogelijk gebruikmaken van ISDE-subsidie, dan is een warmtepomp interessanter. Wij bespreken beide opties eerlijk met u.",
          },
          {
            question: "Hoe bepaalt u welk vermogen ik nodig heb?",
            answer:
              "Wij maken een capaciteitsberekening op basis van de ruimte-afmetingen, de isolatie, de raamoppervlakken en de oriëntatie van uw woning. Zo voorkomen wij een te zwaar of te licht gedimensioneerd systeem.",
          },
        ],
        localAngle:
          "Wij kennen de woningen en het klimaat in de regio Zoetermeer goed en adviseren u op basis van uw specifieke situatie, of u nu in een tussenwoning, een appartement of een bedrijfspand zit.",
      },
    ),
  },
];
