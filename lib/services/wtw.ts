// WTW (warmteterugwinning) pillar + sub-service nodes (taxonomy data layer,
// plan 01-05). Typed against the PageNode union in ./types. Pillar slug stays
// lowercase "wtw" (D-02). Content filled/expanded in Phase 4 (04-05): the ported
// intros (~50-55w) were expanded to >=120w, FAQs added to every node (none had any),
// and the live D-02 trust-word violation in the ported pillar intro replaced with
// interim "vakkundige"/"ervaren" wording. WTW sub-services reference no brands.
//
// YMYL note (D-10/D-13): WTW (balansventilatie) can qualify for ISDE from 2026, but
// ONLY in combination with an isolatiemaatregel AND at the right rendement/capaciteit.
// The pillar ISDE FAQ is the canonical home: it states those conditions, cites the
// official rvo.nl ventilatie URL, and routes euro amounts to a consult. Never a
// blanket "ventilatie is gesubsidieerd". Formal `u` (D-14); interim trust wording
// "vakkundig"/"ervaren", never the certified-status word until proof; cross-sell is
// in-copy (no `relatedOverride` in the locked taxonomy).
//
// [ASSUMED] keyword strings are defensible starting assignments from RESEARCH
// §Keyword Map, pending validation in a keyword tool before Phase 4 (A1).

import type { ContentShell, FaqItem, PageNode, StepItem } from "./types";

// Salvaged 10-step WTW replacement sequence (D-04 port from the old /diensten
// page). title = concise label, body = the original step phrase verbatim.
const WTW_REPLACEMENT_STEPS: StepItem[] = [
  { title: "Demontage", body: "Demonteren en afvoeren oude WTW unit" },
  { title: "Kanalen reinigen", body: "Reinigen van luchtkanalen" },
  {
    title: "Montage",
    body: "Monteren nieuwe WTW unit (wandbeugel of montagestoel)",
  },
  { title: "Kanalen aanpassen", body: "Aanpassen luchtkanalen indien nodig" },
  { title: "Condensafvoer", body: "Aansluiten condensafvoer" },
  { title: "Configuratie", body: "Instelling en configuratie" },
  { title: "Testen", body: "Testen van nieuwe installatie" },
  { title: "Inregelen", body: "Inregelen per ruimte volgens bouwbesluit normen" },
  { title: "Oplevering", body: "Werkplek schoon opleveren" },
  { title: "Instructie", body: "Gebruiksinstructies voor bewoner" },
];

const WTW_PILLAR_STEPS: StepItem[] = [
  {
    title: "Opname & advies",
    body: "Wij bekijken uw woning en huidige installatie en adviseren u onafhankelijk.",
  },
  {
    title: "Offerte op maat",
    body: "Een heldere offerte voor vervangen, onderhoud, inregelen of aanleggen.",
  },
  {
    title: "Vakkundige uitvoering",
    body: "Onze ervaren monteurs voeren het werk netjes en volgens de normen uit.",
  },
  {
    title: "Inregelen & oplevering",
    body: "Wij regelen het systeem per ruimte in en leveren met een meetrapport op.",
  },
];

const WTW_ONDERHOUD_STEPS: StepItem[] = [
  {
    title: "Filters vervangen of reinigen",
    body: "Vervuilde filters worden vervangen of grondig gereinigd voor schone lucht.",
  },
  {
    title: "Ventilatoren & warmtewisselaar reinigen",
    body: "Reiniging van de ventilatoren en de warmtewisselaar voor maximaal rendement.",
  },
  {
    title: "Ventielen & kanalen controleren",
    body: "Controle van de toevoer- en afvoerventielen en het kanalensysteem.",
  },
  {
    title: "Luchtbalans nameten",
    body: "Wij meten de luchtbalans na en stellen waar nodig bij.",
  },
];

const WTW_INREGELEN_STEPS: StepItem[] = [
  {
    title: "Luchthoeveelheden meten",
    body: "Met meetapparatuur meten wij de toevoer en afvoer bij elk ventiel.",
  },
  {
    title: "Ventielen per ruimte instellen",
    body: "Wij stellen elk ventiel nauwkeurig af volgens de normen uit het Bouwbesluit.",
  },
  {
    title: "Meetrapport opstellen",
    body: "U ontvangt een meetrapport met de ingestelde waarden per ruimte.",
  },
];

const WTW_STORING_STEPS: StepItem[] = [
  {
    title: "Gerichte diagnose",
    body: "Wij controleren ventilatoren, lagers, filters, kleppen en de besturing.",
  },
  {
    title: "Oorzaak herstellen",
    body: "Waar mogelijk verhelpen wij de storing direct; een onderdeel regelen wij snel.",
  },
  {
    title: "Controle & nameten",
    body: "Na herstel controleren wij de werking en meten wij de luchtbalans na.",
  },
];

const WTW_AANLEGGEN_STEPS: StepItem[] = [
  {
    title: "Ontwerp & kanaalplan",
    body: "Op basis van de plattegrond en het Bouwbesluit bepalen wij kanaalroutes en posities.",
  },
  {
    title: "Kanalen aanleggen",
    body: "Wij leggen de toevoer- en afvoerkanalen netjes en geluidsarm aan.",
  },
  {
    title: "Unit monteren & aansluiten",
    body: "De WTW-unit wordt op een bereikbare plek gemonteerd en aangesloten, incl. condensafvoer.",
  },
  {
    title: "Inregelen & oplevering",
    body: "Wij regelen per ruimte in en leveren op met een meetrapport.",
  },
];

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

export const WTW_PAGES: PageNode[] = [
  {
    type: "pillar",
    pillarSlug: "wtw",
    status: "review",
    primaryKeyword: "wtw unit",
    searchIntent: "commercieel",
    secondaryKeywords: ["warmteterugwinning", "wtw ventilatie"],
    navTitle: "WTW Unit",
    navDescription: "Vervanging, onderhoud en installatie van warmteterugwinunits",
    icon: "hvac",
    content: draftShell(
      "Warmteterugwinning (WTW)",
      "WTW units in de regio Zoetermeer | TPS klimaattechniek",
      "WTW units: vervangen, onderhoud, inregelen en aanleggen in Zoetermeer en omgeving.",
      {
        intro:
          "Een WTW-systeem (warmteterugwinning) zorgt voor een gezonde balans tussen luchtkwaliteit en energiebesparing. Verse buitenlucht wordt continu aangevoerd en vervuilde binnenlucht afgevoerd, terwijl de warmte uit die afgevoerde lucht — tot wel 95% — wordt teruggewonnen en aan de verse lucht wordt meegegeven. Zo houdt u een aangename temperatuur en een optimale vochtbalans in uw woning, zonder onnodig te stoken. Bij TPS klimaattechniek verzorgen wij het complete traject met vakkundige, ervaren monteurs: het vervangen van verouderde units, periodiek onderhoud en reinigen, het inregelen met een meetrapport, het verhelpen van storingen en het aanleggen van een nieuw balansventilatiesysteem bij nieuwbouw of renovatie. Wij werken aan alle gangbare merken en denken met u mee over een systeem dat bij uw woning past. Een goed werkend WTW-systeem is fluisterstil, energiezuinig en draagt merkbaar bij aan een gezond binnenklimaat. Wij zijn actief in Zoetermeer, Den Haag, Delft, Leiden en de wijde omgeving.",
        steps: WTW_PILLAR_STEPS,
        faqs: [
          {
            question: "Kom ik in aanmerking voor ISDE-subsidie op een WTW-systeem?",
            answer:
              "Vanaf 2026 kan een balansventilatiesysteem met warmteterugwinning in aanmerking komen voor ISDE-subsidie, maar alleen onder voorwaarden. De WTW moet voldoen aan een minimaal rendement en een minimale capaciteit (voor centrale balansventilatie minimaal 85% rendement en 125 m³/h; voor decentrale systemen 80% en 80 m³/h) en — cruciaal — de installatie moet gecombineerd worden met ten minste één isolatiemaatregel. U vraagt de subsidie aan binnen 24 maanden na de isolatiemaatregel, de woning is gebouwd vóór 1 januari 2019 en de installatie wordt door een installatiebedrijf uitgevoerd. De exacte bedragen veranderen jaarlijks — vraag ons vrijblijvend om een actuele berekening. De officiële voorwaarden vindt u op rvo.nl: https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/ventilatie.",
          },
          {
            question: "Hoeveel geluid maakt een WTW-unit?",
            answer:
              "Een moderne, goed onderhouden en correct ingeregelde WTW-unit is fluisterstil. Geluid of gezoem ontstaat meestal door vervuiling, een verkeerde inregeling of een versleten ventilator — precies de punten die wij bij onderhoud en inregelen aanpakken.",
          },
          {
            question: "Hoe lang gaat een WTW-unit mee?",
            answer:
              "Een WTW-unit gaat met goed onderhoud gemiddeld 15 tot 20 jaar mee. Daarna neemt de prestatie merkbaar af en stijgt het energieverbruik; vervangen door een modern, zuinig model is dan vaak de verstandigste keuze.",
          },
          {
            question: "Hoe draagt WTW bij aan een gezond binnenklimaat?",
            answer:
              "Een WTW-systeem voert vocht, CO2, geurtjes en fijnstof continu af en brengt gefilterde, verse lucht binnen. Dat helpt schimmel en vochtproblemen voorkomen en zorgt voor een prettiger, gezonder binnenklimaat — terwijl u de warmte grotendeels terugwint.",
          },
        ],
        localAngle:
          "TPS klimaattechniek werkt aan WTW-systemen in Zoetermeer en de regio daaromheen — waaronder Den Haag, Leidschendam-Voorburg, Pijnacker-Nootdorp, Delft, Leiden en Gouda. Dankzij korte aanrijtijden bent u snel geholpen en rekenen wij geen voorrijkosten binnen ons werkgebied.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "vervangen",
    status: "review",
    primaryKeyword: "wtw-unit vervangen",
    searchIntent: "transactioneel",
    secondaryKeywords: ["wtw unit vervangen kosten", "wtw vervangen Zoetermeer"],
    navTitle: "Vervangen",
    navDescription: "WTW-unit vervangen door een nieuw, zuinig systeem",
    icon: "swap_horiz",
    content: draftShell(
      "WTW-unit vervangen",
      "WTW-unit vervangen | TPS klimaattechniek",
      "Uw WTW-unit vervangen door een efficiënter systeem in Zoetermeer en omgeving.",
      {
        intro:
          "Uw oude WTW-unit vervangen voor een modern, fluisterstil en energiezuinig model verbetert direct uw comfort én uw energierekening. Een WTW-unit gaat gemiddeld 15 tot 20 jaar mee; daarna neemt de prestatie merkbaar af, wordt het systeem luidruchtiger en stijgt het energieverbruik. Bovendien worden reserveonderdelen voor oudere units steeds lastiger verkrijgbaar. Bij een vervanging demonteren en voeren wij uw oude unit netjes af, reinigen wij waar nodig de luchtkanalen en monteren wij een nieuwe, zuinige unit met warmteterugwinning tot wel 95%. Daarna sluiten wij de condensafvoer aan, configureren wij het systeem en regelen wij het per ruimte in volgens de geldende normen. Tot slot leveren wij de werkplek schoon op en leggen wij de bediening rustig aan u uit. Zo profiteert u jarenlang van gezonde lucht, een lager verbruik en een systeem dat weer als nieuw presteert.",
        steps: WTW_REPLACEMENT_STEPS,
        faqs: [
          {
            question: "Hoe lang duurt het vervangen van een WTW-unit?",
            answer:
              "Een één-op-één vervanging ronden wij meestal in een halve tot een hele dag af. Moeten er kanalen worden aangepast of komt de nieuwe unit op een andere plek, dan kan het iets langer duren; dat bespreken wij vooraf met u.",
          },
          {
            question: "Wanneer kan ik mijn WTW-unit beter vervangen dan repareren?",
            answer:
              "Bij een unit ouder dan 15 jaar, terugkerende storingen, slecht verkrijgbare onderdelen of een duidelijk gestegen energieverbruik is vervangen vaak voordeliger dan blijven repareren. Wij geven u hierin een eerlijk, onafhankelijk advies.",
          },
          {
            question: "Wat kost het vervangen van een WTW-unit?",
            answer:
              "De prijs hangt af van het type unit en of er aanpassingen aan de kanalen nodig zijn. Bekijk onze tarieven voor een indicatie of vraag een vrijblijvende offerte op maat aan, dan rekenen wij het voor uw situatie uit.",
          },
        ],
        localAngle:
          "Voor woningen in Zoetermeer, Den Haag en de omliggende gemeenten plannen wij een vervanging snel in en laten wij uw woning schoon achter.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "onderhoud-reinigen",
    status: "review",
    primaryKeyword: "wtw onderhoud",
    searchIntent: "commercieel",
    secondaryKeywords: ["wtw reinigen", "wtw filter vervangen"],
    navTitle: "Onderhoud & reinigen",
    navDescription: "Filters reinigen en kanalen schoonhouden",
    icon: "cleaning_services",
    content: draftShell(
      "WTW onderhoud en reinigen",
      "WTW onderhoud | TPS klimaattechniek",
      "WTW-onderhoud: filters reinigen en kanalen schoonhouden voor gezonde lucht.",
      {
        intro:
          "Grondig onderhoud en reiniging houden uw WTW-systeem hygiënisch, stil en energiezuinig. In de loop van de tijd raken filters, ventilatoren en het kanalensysteem vervuild met stof en vet; dat verslechtert de luchtkwaliteit, vermindert de warmteterugwinning en kan voor geluid en geurtjes zorgen. Tijdens een onderhoudsbeurt vervangen of reinigen wij de filters, reinigen wij de ventilatoren en de warmtewisselaar, controleren wij de ventielen en het kanalensysteem en stellen wij de luchtbalans waar nodig opnieuw af met geavanceerde meetapparatuur. Zo blijft uw unit op vol vermogen presteren en ademt u thuis schone, frisse lucht in. Wij adviseren u eerlijk over de juiste onderhoudsfrequentie — voor de meeste woningen volstaat een jaarlijkse beurt, met tussentijds zelf de filters controleren. Voor woningen, VvE's en bedrijven in Zoetermeer en omgeving plannen wij het onderhoud op een moment dat u uitkomt, zodat u er verder geen omkijken naar heeft.",
        steps: WTW_ONDERHOUD_STEPS,
        faqs: [
          {
            question: "Hoe vaak moet een WTW-systeem onderhouden worden?",
            answer:
              "Voor de meeste woningen adviseren wij één onderhoudsbeurt per jaar, met tussentijds zelf de filters controleren en zo nodig reinigen. Bij intensief gebruik of een stoffige omgeving kan vaker verstandig zijn.",
          },
          {
            question: "Wat wordt er tijdens WTW-onderhoud gereinigd?",
            answer:
              "Wij vervangen of reinigen de filters, reinigen de ventilatoren en de warmtewisselaar, controleren de ventielen en het kanalensysteem en meten de luchtbalans na. Zo blijft het rendement hoog en de lucht schoon.",
          },
          {
            question: "Kan ik de filters van mijn WTW-unit zelf vervangen?",
            answer:
              "Ja, het controleren en vervangen van de filters kunt u prima zelf doen — dat houdt het systeem schoon tussen de onderhoudsbeurten door. Het reinigen van de warmtewisselaar en het nameten van de luchtbalans laat u beter aan een vakman over.",
          },
        ],
        localAngle:
          "Voor woningen, VvE's en bedrijven in Zoetermeer en omgeving verzorgen wij WTW-onderhoud op een vast of flexibel ritme, precies zoals het u uitkomt.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "inregelen",
    status: "review",
    primaryKeyword: "wtw inregelen",
    searchIntent: "informationeel",
    secondaryKeywords: ["wtw inregelen meetrapport", "ventielen inregelen"],
    navTitle: "Inregelen",
    navDescription: "Ventielen inregelen met meetrapport",
    icon: "tune",
    content: draftShell(
      "WTW inregelen",
      "WTW inregelen | TPS klimaattechniek",
      "WTW-systeem laten inregelen met meetrapport voor een correcte luchtbalans.",
      {
        intro:
          "Een WTW-systeem werkt alleen optimaal als het correct is ingeregeld. Inregelen betekent dat wij per ruimte de exacte hoeveelheid toevoer- en afvoerlucht instellen, zodat de balans tussen verse en afgevoerde lucht overal klopt. Een verkeerd ingeregeld systeem herkent u aan tocht, geluid, vocht- of schimmelproblemen, of ruimtes die maar niet fris worden — en het kost onnodig energie. Met geavanceerde meetapparatuur meten wij de luchthoeveelheden bij elk ventiel en stellen wij deze nauwkeurig af volgens de normen uit het Bouwbesluit. Na afloop ontvangt u een meetrapport waarin de ingestelde waarden per ruimte zijn vastgelegd — handig voor uw eigen administratie en vaak gevraagd bij oplevering of verkoop. Inregelen is zinvol na een nieuwe installatie, na een vervanging, bij klachten over comfort of luchtkwaliteit, of wanneer er aan de woning is verbouwd. Zo haalt u het maximale uit uw systeem en woont u in een gezonde, comfortabele omgeving.",
        steps: WTW_INREGELEN_STEPS,
        faqs: [
          {
            question: "Wat houdt het inregelen van een WTW-systeem precies in?",
            answer:
              "Inregelen is het per ruimte instellen van de juiste hoeveelheid toevoer- en afvoerlucht, zodat de luchtbalans overal klopt. Wij meten dit met meetapparatuur en stellen elk ventiel af volgens de normen uit het Bouwbesluit.",
          },
          {
            question: "Waarom is een meetrapport belangrijk?",
            answer:
              "Een meetrapport legt vast welke luchthoeveelheden per ruimte zijn ingesteld. Dat is het bewijs dat uw systeem volgens de norm functioneert, handig voor uw administratie en vaak gevraagd bij de oplevering of verkoop van een woning.",
          },
          {
            question: "Wanneer moet een WTW-systeem opnieuw ingeregeld worden?",
            answer:
              "Opnieuw inregelen is zinvol na een nieuwe installatie of vervanging, na een verbouwing waarbij ruimtes of kanalen wijzigen, of bij klachten over tocht, geluid, vocht of een onfrisse ruimte.",
          },
        ],
        localAngle:
          "Wij regelen WTW-systemen in en leveren meetrapporten op in Zoetermeer en de regio, ook bij oplevering van nieuwbouw of na een verbouwing.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "storing",
    status: "review",
    primaryKeyword: "wtw storing",
    searchIntent: "transactioneel",
    secondaryKeywords: ["wtw unit maakt lawaai", "wtw storing verhelpen"],
    navTitle: "Storing",
    navDescription: "Snelle hulp bij WTW-storingen en lawaai",
    icon: "handyman",
    content: draftShell(
      "WTW storing verhelpen",
      "WTW storing | TPS klimaattechniek",
      "Snelle hulp bij WTW-storingen en lawaai in Zoetermeer en omgeving.",
      {
        intro:
          "Maakt uw WTW-unit lawaai, trilt hij, voert hij niet meer goed af of staat er een storingsmelding? Een haperend ventilatiesysteem is hinderlijk en gaat ten koste van uw comfort en luchtkwaliteit. Bij TPS klimaattechniek reageren wij snel en komen wij waar mogelijk op korte termijn langs om de storing te verhelpen. Onze monteurs stellen eerst een gerichte diagnose: zij controleren de ventilatoren, de lagers, de filters, de kleppen en de besturing om de oorzaak te achterhalen. Veelvoorkomende oorzaken zijn vervuilde of versleten ventilatoren, dichtgeslibde filters, een defecte klep of een ontregelde besturing. Lawaai en trillingen komen vaak door achterstallig onderhoud of een versleten lager. Waar het kan verhelpen wij de storing direct; is er een onderdeel nodig, dan regelen wij dat zo snel mogelijk. Zo ademt u snel weer schone, frisse lucht in en is het in huis weer rustig.",
        steps: WTW_STORING_STEPS,
        faqs: [
          {
            question: "Mijn WTW-unit maakt lawaai — wat kan de oorzaak zijn?",
            answer:
              "Lawaai of gezoem komt meestal door vervuilde of versleten ventilatoren, dichtgeslibde filters, een versleten lager of een verkeerde inregeling. Met een gerichte diagnose achterhalen wij de oorzaak en maken wij het systeem weer stil.",
          },
          {
            question: "Hoe snel kunt u bij een WTW-storing langskomen?",
            answer:
              "Wij doen ons best om bij storingen snel te schakelen en kunnen vaak op korte termijn langskomen. Neem telefonisch of via WhatsApp contact op, dan plannen wij u zo snel mogelijk in.",
          },
          {
            question: "Wat kost een storingsbezoek voor mijn WTW-systeem?",
            answer:
              "Wij stellen eerst een diagnose en bespreken de kosten met u voordat wij iets vervangen, zodat u nooit voor verrassingen komt te staan. Neem gerust vrijblijvend contact op voor meer informatie.",
          },
        ],
        localAngle:
          "Dankzij onze ligging in Zoetermeer en korte aanrijtijden in de regio Den Haag, Leiden en Delft zijn wij bij een WTW-storing snel ter plaatse.",
      },
    ),
  },
  {
    type: "service",
    pillarSlug: "wtw",
    serviceSlug: "aanleggen",
    status: "review",
    primaryKeyword: "wtw unit aanleggen",
    searchIntent: "transactioneel",
    secondaryKeywords: ["wtw installeren nieuwbouw", "balansventilatie aanleggen"],
    navTitle: "Aanleggen",
    navDescription: "Nieuwe WTW-installatie voor nieuwbouw of renovatie",
    icon: "add_circle",
    content: draftShell(
      "WTW unit aanleggen",
      "WTW unit aanleggen | TPS klimaattechniek",
      "Een nieuwe WTW-installatie aanleggen bij nieuwbouw of renovatie.",
      {
        intro:
          "Een compleet nieuw balansventilatiesysteem met warmteterugwinning aanleggen is de beste keuze bij nieuwbouw en ingrijpende renovaties. Bij een goed geïsoleerde, kierdichte woning is natuurlijke ventilatie niet meer voldoende; een WTW-systeem voert continu vervuilde lucht af en verse lucht aan, en wint daarbij tot wel 95% van de warmte terug. Wij beginnen met een ontwerp: op basis van de plattegrond en de eisen uit het Bouwbesluit bepalen wij de kanaalroutes, de positie van de unit en de plaats van de toevoer- en afvoerventielen. Vervolgens leggen wij de kanalen geluidsarm aan, monteren wij de WTW-unit op een goed bereikbare plek, sluiten wij de condensafvoer aan en regelen wij het systeem per ruimte in met een meetrapport. Of het nu om een nieuwbouwwoning, een aanbouw of een grondige verbouwing gaat: wij zorgen voor een systeem dat stil, zuinig en volgens de normen functioneert, met een gezond binnenklimaat als resultaat.",
        steps: WTW_AANLEGGEN_STEPS,
        faqs: [
          {
            question: "Kan ik balansventilatie laten aanleggen in een bestaande woning?",
            answer:
              "Ja, ook in een bestaande woning is dat vaak mogelijk, zeker bij een renovatie waarbij toch wordt verbouwd. De haalbaarheid hangt af van de ruimte voor kanalen en de unit; tijdens een opname beoordelen wij dit voor uw situatie.",
          },
          {
            question: "Hoe lang duurt het aanleggen van een WTW-systeem?",
            answer:
              "Dat hangt sterk af van de woning en het kanaaltracé. Bij nieuwbouw loopt het mee in de bouwplanning; bij een renovatie maken wij vooraf een realistische inschatting op basis van het ontwerp.",
          },
          {
            question: "Komt een nieuwe WTW-installatie in aanmerking voor ISDE-subsidie?",
            answer:
              "Vanaf 2026 kan dat, maar alleen in combinatie met een isolatiemaatregel en bij de juiste rendement- en capaciteitswaarden. De volledige voorwaarden leest u in de subsidievraag bovenaan deze WTW-pagina en op de officiële website rvo.nl.",
          },
        ],
        localAngle:
          "Wij leggen WTW-systemen aan bij nieuwbouw en renovatie in Zoetermeer en omgeving en werken daarbij samen met uw aannemer of verbouwplanning.",
      },
    ),
  },
];
