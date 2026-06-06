// Mechanische ventilatie (MV) pillar + sub-service nodes (taxonomy data layer,
// plan 01-05). Typed against the PageNode union in ./types. Content filled/expanded
// in Phase 4 (04-06): the ported onderhoud-reinigen intro (incl. the folded
// dakventilator content, P2 D-05) is retained and extended; the other intros were
// written/expanded to >=120w and FAQs added to every node (none had any). MV
// sub-services reference no brands.
//
// YMYL note (D-10/D-13): MV-subsidie is the easiest over-promise. ISDE for MV from
// 2026 is NARROW: only CO2-gestuurde systemen (centrale vraaggestuurde afzuiging
// >125 m³/h + minimaal 2 CO2-sensoren) AND combined with an isolatiemaatregel. A
// plain ventilation box without CO2-sturing does NOT qualify. The pillar ISDE FAQ is
// the canonical home: it states those narrow conditions, cites the rvo.nl ventilatie
// URL, and routes euro amounts to a consult. Never a blanket "MV is gesubsidieerd".
// Formal `u` (D-14); interim trust wording "vakkundig"/"ervaren"; cross-sell in-copy
// (no `relatedOverride` in the locked taxonomy).
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

const MV_PILLAR_STEPS: StepItem[] = [
  {
    title: "Opname & advies",
    body: "Wij bekijken uw situatie en adviseren onafhankelijk over de beste oplossing.",
  },
  {
    title: "Offerte op maat",
    body: "Een heldere offerte voor vervangen, onderhoud, een storing of een nieuw systeem.",
  },
  {
    title: "Vakkundige uitvoering",
    body: "Onze ervaren monteurs voeren het werk netjes en volgens de normen uit.",
  },
  {
    title: "Controle & oplevering",
    body: "Wij controleren de werking, stellen de luchthoeveelheden in en leveren schoon op.",
  },
];

const MV_VERVANGEN_STEPS: StepItem[] = [
  {
    title: "Oude box verwijderen",
    body: "Wij demonteren en voeren de oude, vaak luidruchtige ventilatiebox netjes af.",
  },
  {
    title: "Kanalen & ventielen controleren",
    body: "Controle en zo nodig reiniging van de kanalen en ventielen voor een goede afzuiging.",
  },
  {
    title: "Nieuwe zuinige box monteren",
    body: "Montage van een energiezuinige gelijkstroombox, eventueel CO2-gestuurd.",
  },
  {
    title: "Instellen & oplevering",
    body: "Wij stellen de luchthoeveelheden in, testen de werking en leveren schoon op.",
  },
];

const MV_ONDERHOUD_STEPS: StepItem[] = [
  {
    title: "Inspectie",
    body: "Wij beoordelen de staat van kanalen, box, ventielen en dakventilator.",
  },
  {
    title: "Kanalen reinigen",
    body: "Reiniging van de luchtkanalen met een roterende borstel — grondig en professioneel.",
  },
  {
    title: "Box, ventielen & dakventilator",
    body: "Reiniging en onderhoud van de ventilatiebox, de ventielen en de dakventilator.",
  },
  {
    title: "Controle & nameten",
    body: "Wij controleren de werking en stellen de luchthoeveelheden waar nodig bij.",
  },
];

const MV_STORING_STEPS: StepItem[] = [
  {
    title: "Gerichte diagnose",
    body: "Wij controleren motor, lagers, kleppen, ventielen en kanalen om de oorzaak te vinden.",
  },
  {
    title: "Oorzaak herstellen",
    body: "Waar mogelijk verhelpen wij de storing direct; een onderdeel regelen wij snel.",
  },
  {
    title: "Controle & nameten",
    body: "Na herstel controleren wij de afzuiging en meten wij de luchtbalans na.",
  },
];

const MV_AANLEGGEN_STEPS: StepItem[] = [
  {
    title: "Ontwerp & kanaalplan",
    body: "Op basis van de plattegrond en het Bouwbesluit bepalen wij kanaalroutes en posities.",
  },
  {
    title: "Kanalen aanleggen",
    body: "Wij leggen de afvoerkanalen geluidsarm aan naar keuken, badkamer en toilet.",
  },
  {
    title: "Box monteren & afvoerpunten plaatsen",
    body: "De ventilatiebox wordt op een bereikbare plek gemonteerd en de afvoerpunten geplaatst.",
  },
  {
    title: "Instellen & oplevering",
    body: "Wij stellen het systeem correct in en leveren op volgens de normen.",
  },
];

export const MECHANISCHE_VENTILATIE_PAGES: PageNode[] = [
  {
    type: "pillar",
    pillarSlug: "mechanische-ventilatie",
    status: "review",
    primaryKeyword: "mechanische ventilatie",
    searchIntent: "commercieel",
    secondaryKeywords: ["mv ventilatie", "ventilatiesysteem woning"],
    navTitle: "Mechanische Ventilatie",
    navDescription: "Vervanging, onderhoud en aanleg van ventilatiesystemen",
    icon: "air",
    content: draftShell(
      "Mechanische ventilatie in Zoetermeer",
      "Mechanische ventilatie Zoetermeer | TPS klimaattechniek",
      "Mechanische ventilatie: vervangen, onderhoud, storing en aanleggen in Zoetermeer en omgeving.",
      {
        intro:
          "Mechanische ventilatie zorgt ervoor dat vervuilde, vochtige lucht uit uw woning continu wordt afgevoerd. Een ventilatiebox zuigt lucht af uit de vochtige ruimtes — keuken, badkamer en toilet — terwijl verse lucht via roosters of ventielen binnenkomt. Dat voorkomt vocht, schimmel en een benauwde lucht en draagt zo bij aan een gezond binnenklimaat. Bij TPS klimaattechniek verzorgen wij het complete traject met vakkundige, ervaren monteurs: het vervangen van een verouderde of luidruchtige box, het reinigen van kanalen en het onderhoud van de dakventilator, het verhelpen van storingen en het aanleggen van een nieuw systeem bij nieuwbouw of renovatie. Wij adviseren u ook graag over een modern, CO2-gestuurd systeem dat de ventilatie automatisch aanpast aan het gebruik van een ruimte — comfortabel én energiezuinig. Of u nu last heeft van een lawaaiige box, vocht in huis of gewoon toe bent aan een upgrade: wij helpen u in Zoetermeer, Den Haag, Delft, Leiden en de wijde omgeving.",
        steps: MV_PILLAR_STEPS,
        faqs: [
          {
            question: "Kom ik in aanmerking voor ISDE-subsidie op mechanische ventilatie?",
            answer:
              "Vanaf 2026 kan mechanische ventilatie in aanmerking komen voor ISDE-subsidie, maar de voorwaarden zijn smal. Het moet gaan om een CO2-gestuurd systeem: een centrale, vraaggestuurde afzuigventilator met een capaciteit van meer dan 125 m³/h en minimaal 2 CO2-sensoren. Daarnaast geldt dat u de installatie combineert met ten minste één isolatiemaatregel, de woning vóór 1 januari 2019 is gebouwd en u binnen 24 maanden na de isolatiemaatregel aanvraagt. Een gewone mechanische ventilatiebox zonder CO2-sturing komt dus niet in aanmerking. De exacte bedragen veranderen jaarlijks — vraag ons vrijblijvend om advies voor uw situatie. De officiële voorwaarden vindt u op rvo.nl: https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie.",
          },
          {
            question: "Wat is het verschil tussen CO2-gestuurde en traditionele ventilatie?",
            answer:
              "Een traditioneel systeem ventileert continu op een vaste stand, ongeacht of een ruimte gebruikt wordt. Een CO2-gestuurd systeem meet de luchtkwaliteit en ventileert automatisch méér waar het nodig is en minder waar het niet nodig is. Dat is comfortabeler, stiller en zuiniger — en het is bovendien de variant die onder voorwaarden voor subsidie in aanmerking kan komen.",
          },
          {
            question: "Hoe draagt mechanische ventilatie bij aan een gezond binnenklimaat?",
            answer:
              "Door vocht, CO2, geurtjes en fijnstof continu af te voeren voorkomt mechanische ventilatie schimmel en vochtproblemen en houdt zij de lucht fris. Vooral in goed geïsoleerde, kierdichte woningen is dat essentieel, omdat natuurlijke ventilatie daar tekortschiet.",
          },
          {
            question: "Hoeveel geluid hoort een ventilatiesysteem te maken?",
            answer:
              "Een goed werkend, schoon en correct ingesteld systeem hoort u nauwelijks. Hoorbaar gezoem, geratel of trillen wijst meestal op vervuiling, achterstallig onderhoud of een verouderde box — allemaal punten die wij met onderhoud of vervanging oplossen.",
          },
        ],
        localAngle:
          "TPS klimaattechniek werkt aan mechanische ventilatie in Zoetermeer en de regio daaromheen — waaronder Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Delft, Leiden en Gouda. Dankzij korte aanrijtijden bent u snel geholpen en rekenen wij geen voorrijkosten binnen ons werkgebied.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "mechanische-ventilatie",
    serviceSlug: "vervangen",
    status: "review",
    primaryKeyword: "mechanische ventilatie vervangen",
    searchIntent: "transactioneel",
    secondaryKeywords: ["ventilatiebox vervangen", "mv box vervangen"],
    navTitle: "Vervangen",
    navDescription: "Ventilatiebox vervangen door een zuinig systeem",
    icon: "swap_horiz",
    content: draftShell(
      "Mechanische ventilatie vervangen",
      "Ventilatiebox vervangen | TPS klimaattechniek",
      "Uw ventilatiebox vervangen door een zuiniger systeem in Zoetermeer en omgeving.",
      {
        intro:
          "Een oude ventilatiebox vervangen levert direct meer comfort en een lagere energierekening op. Een mechanische ventilatiebox gaat gemiddeld zo'n 15 jaar mee; daarna wordt hij vaak luidruchtig, zuigt hij minder goed af en verbruikt hij onnodig veel stroom. Veel oudere boxen werken namelijk op wisselstroom en verbruiken tot 80% meer energie dan een modern gelijkstroom (DC) systeem. Een nieuwe, zuinige box is niet alleen stiller en gezonder, maar verdient zichzelf deels terug via een lager verbruik. Bij een vervanging verwijderen wij uw oude box, controleren en reinigen wij waar nodig de kanalen en ventielen, monteren wij een nieuwe, energiezuinige unit en stellen wij het systeem correct in. Desgewenst adviseren wij u over een CO2-gestuurde box die de ventilatie automatisch op het gebruik afstemt. Tot slot leveren wij netjes en schoon op, zodat uw woning weer fris en stil geventileerd wordt.",
        steps: MV_VERVANGEN_STEPS,
        faqs: [
          {
            question: "Wanneer kan ik mijn ventilatiebox beter vervangen?",
            answer:
              "Bij een box ouder dan ongeveer 15 jaar, aanhoudend lawaai, een merkbaar slechtere afzuiging of een hoog stroomverbruik is vervangen vaak verstandiger dan blijven repareren. Wij geven u hierin een eerlijk, onafhankelijk advies.",
          },
          {
            question: "Wat bespaart een gelijkstroom-ventilatiebox ten opzichte van een oude wisselstroombox?",
            answer:
              "Oude wisselstroomboxen verbruiken tot 80% meer energie dan een moderne gelijkstroom (DC) box. Een zuinige box draait stiller en efficiënter en verdient het verschil in verbruik over de jaren deels terug.",
          },
          {
            question: "Hoe lang duurt het vervangen van een ventilatiebox?",
            answer:
              "Een één-op-één vervanging ronden wij meestal in een dagdeel af. Moeten er kanalen of de bedrading worden aangepast, dan kan het iets langer duren; dat bespreken wij vooraf met u.",
          },
        ],
        localAngle:
          "Voor woningen in Zoetermeer, Den Haag en de omliggende gemeenten plannen wij een vervanging snel in en laten wij uw woning schoon achter.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "mechanische-ventilatie",
    serviceSlug: "onderhoud-reinigen",
    status: "review",
    primaryKeyword: "mechanische ventilatie onderhoud",
    searchIntent: "commercieel",
    secondaryKeywords: ["ventilatiekanalen reinigen", "mv onderhoud"],
    navTitle: "Onderhoud & reinigen",
    navDescription: "Ventilatiekanalen reinigen en onderhouden",
    icon: "cleaning_services",
    content: draftShell(
      "Mechanische ventilatie onderhoud en reinigen",
      "Mechanische ventilatie onderhoud | TPS klimaattechniek",
      "Ventilatiekanalen reinigen en onderhouden voor gezonde lucht in huis.",
      {
        intro:
          "Schone ventilatiekanalen zorgen voor een gezond binnenklimaat, minder stof in huis, een langere levensduur van het systeem, minder gezondheidsklachten en een lagere energierekening. Wij reinigen uw ventilatiekanalen met een roterende borstel — snel, grondig en professioneel — waarbij al het vuil uit de kanalen wordt verwijderd. Regelmatige reiniging voorkomt gezondheidsklachten, ongedierte en extra onderhoudswerk. Ook uw dakventilator nemen wij mee: een complete reiniging en onderhoud is minimaal iedere 4 jaar (uiterlijk 5 jaar) aan te raden, en vervanging is verstandig zodra deze 15 jaar of ouder is — oude dakventilatoren werken op wisselstroom en verbruiken tot 80% meer energie. Tijdens een onderhoudsbeurt reinigen wij naast de kanalen ook de ventielen en de ventilatiebox, controleren wij de werking en stellen wij de luchthoeveelheden zo nodig bij. Voor woningen, VvE's en bedrijven in Zoetermeer en omgeving plannen wij dit onderhoud op een moment dat u uitkomt.",
        steps: MV_ONDERHOUD_STEPS,
        faqs: [
          {
            question: "Hoe vaak moeten ventilatiekanalen gereinigd worden?",
            answer:
              "Voor de meeste woningen is reiniging van de kanalen elke paar jaar verstandig, afhankelijk van gebruik en vervuiling. Bij klachten over stof, geur of een verminderde afzuiging adviseren wij eerder een reinigingsbeurt.",
          },
          {
            question: "Waarom is het reinigen van ventilatiekanalen belangrijk?",
            answer:
              "Vuile kanalen verspreiden stof en kunnen gezondheidsklachten, geurtjes en zelfs ongedierte veroorzaken. Schone kanalen verbeteren de luchtkwaliteit, verlengen de levensduur van het systeem en houden het energieverbruik laag.",
          },
          {
            question: "Hoe vaak heeft een dakventilator onderhoud nodig?",
            answer:
              "Een dakventilator onderhouden wij bij voorkeur minimaal iedere 4 jaar, en uiterlijk na 5 jaar. Is de dakventilator 15 jaar of ouder, dan is vervangen vaak verstandig: oudere exemplaren op wisselstroom verbruiken tot 80% meer energie dan een modern systeem.",
          },
        ],
        localAngle:
          "Voor woningen, VvE's en bedrijven in Zoetermeer en omgeving verzorgen wij kanaalreiniging en ventilatieonderhoud op een vast of flexibel ritme.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "mechanische-ventilatie",
    serviceSlug: "storing",
    status: "review",
    primaryKeyword: "mechanische ventilatie storing",
    searchIntent: "transactioneel",
    secondaryKeywords: ["ventilatie maakt lawaai", "mv storing verhelpen"],
    navTitle: "Storing",
    navDescription: "Snelle hulp bij ventilatiestoringen en lawaai",
    icon: "handyman",
    content: draftShell(
      "Mechanische ventilatie storing verhelpen",
      "Mechanische ventilatie storing | TPS klimaattechniek",
      "Snelle hulp bij ventilatiestoringen en lawaai in Zoetermeer en omgeving.",
      {
        intro:
          "Maakt uw mechanische ventilatie lawaai, trilt de box, zuigt hij slecht af of heeft u ondanks de ventilatie last van vocht of schimmel? Dat zijn signalen van een storing of achterstallig onderhoud. Een goed werkend ventilatiesysteem hoort u nauwelijks en houdt uw woning fris en droog. Bij TPS klimaattechniek reageren wij snel en komen wij waar mogelijk op korte termijn langs om de storing te verhelpen. Onze monteurs stellen eerst een gerichte diagnose: zij controleren de motor en de lagers van de box, de kleppen, de ventielen en de kanalen om de oorzaak te achterhalen. Veelvoorkomende oorzaken zijn een versleten of vervuilde motor, dichtgeslibde kanalen, een vastgelopen klep of verkeerd ingestelde luchthoeveelheden. Waar het kan verhelpen wij de storing direct; is er een onderdeel nodig, dan regelen wij dat zo snel mogelijk. Zo woont u snel weer in een stil, fris en droog huis.",
        steps: MV_STORING_STEPS,
        faqs: [
          {
            question: "Mijn mechanische ventilatie maakt lawaai — wat kan de oorzaak zijn?",
            answer:
              "Lawaai, gezoem of geratel komt meestal door een vervuilde of versleten motor, dichtgeslibde kanalen, een trillende box of een verkeerde inregeling. Met een gerichte diagnose achterhalen wij de oorzaak en maken wij het systeem weer stil.",
          },
          {
            question: "Ik heb vocht in huis ondanks ventilatie — wat is er aan de hand?",
            answer:
              "Vocht of schimmel ondanks ventilatie wijst vaak op een te lage afzuigcapaciteit: vervuilde kanalen, een verzwakte motor of verkeerd ingestelde luchthoeveelheden. Wij meten de afzuiging na en herstellen die, zodat het vocht weer goed wordt afgevoerd.",
          },
          {
            question: "Hoe snel kunt u bij een ventilatiestoring langskomen?",
            answer:
              "Wij doen ons best om bij storingen snel te schakelen en kunnen vaak op korte termijn langskomen. Neem telefonisch of via WhatsApp contact op, dan plannen wij u zo snel mogelijk in.",
          },
        ],
        localAngle:
          "Dankzij onze ligging in Zoetermeer en korte aanrijtijden in de regio Den Haag, Leiden en Delft zijn wij bij een ventilatiestoring snel ter plaatse.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "mechanische-ventilatie",
    serviceSlug: "aanleggen",
    status: "review",
    primaryKeyword: "mechanische ventilatie aanleggen",
    searchIntent: "transactioneel",
    secondaryKeywords: ["ventilatiesysteem aanleggen", "mv installeren"],
    navTitle: "Aanleggen",
    navDescription: "Nieuw ventilatiesysteem voor nieuwbouw of renovatie",
    icon: "add_circle",
    content: draftShell(
      "Mechanische ventilatie aanleggen",
      "Mechanische ventilatie aanleggen | TPS klimaattechniek",
      "Een nieuw mechanisch ventilatiesysteem aanleggen bij nieuwbouw of renovatie.",
      {
        intro:
          "Een compleet nieuw mechanisch ventilatiesysteem aanleggen is aan de orde bij nieuwbouw, een uitbouw of een ingrijpende renovatie. Een goed geïsoleerde, kierdichte woning heeft mechanische afvoer nodig om vocht, CO2 en geurtjes af te voeren en gezonde lucht te garanderen. Wij beginnen met een ontwerp: op basis van de plattegrond en de eisen uit het Bouwbesluit bepalen wij de kanaalroutes, de positie van de ventilatiebox en de plaats van de afvoerpunten in keuken, badkamer en toilet. Vervolgens leggen wij de kanalen geluidsarm aan, monteren wij de box op een goed bereikbare plek en stellen wij het systeem correct in. Wij adviseren u daarbij graag over een CO2-gestuurd systeem, dat de ventilatie automatisch afstemt op het gebruik van een ruimte — comfortabeler, zuiniger en onder voorwaarden geschikt voor subsidie. Zo krijgt u een installatie die stil, zuinig en volgens de normen functioneert, met een gezond binnenklimaat als resultaat.",
        steps: MV_AANLEGGEN_STEPS,
        faqs: [
          {
            question: "Kan ik mechanische ventilatie laten aanleggen in een bestaande woning?",
            answer:
              "Ja, dat is vaak mogelijk, zeker tijdens een renovatie waarbij toch wordt verbouwd. De haalbaarheid hangt af van de ruimte voor kanalen en de box; tijdens een opname beoordelen wij dit voor uw situatie.",
          },
          {
            question: "Hoe lang duurt het aanleggen van een ventilatiesysteem?",
            answer:
              "Dat hangt af van de woning en het kanaaltracé. Bij nieuwbouw loopt het mee in de bouwplanning; bij een renovatie maken wij vooraf een realistische inschatting op basis van het ontwerp.",
          },
          {
            question: "Kan ik meteen een CO2-gestuurd systeem laten aanleggen?",
            answer:
              "Ja, dat adviseren wij vaak: een CO2-gestuurd systeem stemt de ventilatie automatisch af op het gebruik en is comfortabeler en zuiniger. Zo'n systeem (met minimaal 2 CO2-sensoren) kan vanaf 2026 bovendien in aanmerking komen voor ISDE-subsidie, mits gecombineerd met een isolatiemaatregel — de volledige voorwaarden leest u op onze pagina Mechanische ventilatie en op rvo.nl.",
          },
        ],
        localAngle:
          "Wij leggen mechanische ventilatie aan bij nieuwbouw en renovatie in Zoetermeer en omgeving en stemmen dat af op uw aannemer of verbouwplanning.",
      },
    ),
  },
];
