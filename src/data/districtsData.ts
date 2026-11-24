export interface HighlightItem {
  name: string;
  category: 'eten-drinken' | 'cultuur' | 'winkelen' | 'natuur' | 'bezienswaardigheid' | 'actief';
  description: string;
  address?: string;
  image?: string;
  tip?: string;
  sourceType: 'article' | 'agenda' | 'locatie';
  sourceTitle: string;
  sourceUrl: string;
}

export interface TransportInfo {
  ov: string;
  bike: string;
  parking: string;
}

export interface District {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagLine: string;
  description: string;
  longDescription: string;
  vibe: string;
  characterTags: string[];
  color: string; // Pastel fill
  hoverColor: string; // Active/hover vibrant fill
  accentColor: string; // Accent color for text/badges
  textColor: string;
  svgPath: string;
  centerPoint: { x: number; y: number };
  landmarkIcon?: string;
  landmarkLabel?: string;
  highlights: HighlightItem[];
  transportInfo: TransportInfo;
  heroImage: string;
  galleryImages?: string[];
  articleTags?: string[];
}

export interface RiverData {
  name: string;
  path: string;
  centerline: string;
  labelPoint: { x: number; y: number };
  bridges: Array<{
    name: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    year?: string;
    labelAlign?: 'left' | 'right';
    labelOffsetY?: number;
  }>;
}

export interface ParkFeature {
  name: string;
  path: string;
  labelPoint: { x: number; y: number };
}

export interface LandmarkFeature {
  name: string;
  category: 'monument' | 'station' | 'cultuur' | 'natuur';
  x: number;
  y: number;
  label: string;
}

// ---------------------------------------------------------------------------
// REALISTIC TOPOGRAPHY: Nederrijn River Meander, Bridges, Parks & Railway
// Georeferenced from official CBS GM0202 and OpenStreetMap data
// ---------------------------------------------------------------------------

export const RHINE_RIVER: RiverData = {
  name: 'Nederrijn',
  // Natuurlijk vloeiende rivierbedding zonder knikken, verbreed naar 30px
  path: 'M -20.0,365.0 L 40.0,362.0 L 100.0,358.0 L 160.0,352.0 L 218.6,343.7 L 251.0,340.0 L 280.0,332.0 L 310.0,320.0 L 332.8,310.0 L 348.0,307.0 L 350.7,308.5 L 377.7,307.3 L 404.4,313.4 L 419.1,320.4 L 454.7,343.9 L 505.6,363.1 L 539.3,386.1 L 593.0,399.4 L 616.0,410.7 L 633.6,429.2 L 648.7,463.6 L 664.2,483.5 L 693.7,504.7 L 735.8,528.0 L 766.8,544.2 L 815.0,574.0 L 865.0,606.0 L 920.0,638.0 L 980.0,672.0 L 980.0,702.0 L 980.0,702.0 L 920.0,668.0 L 865.0,636.0 L 815.0,604.0 L 766.8,574.2 L 735.8,558.0 L 693.7,534.7 L 664.2,513.5 L 648.7,493.6 L 633.6,459.2 L 616.0,440.7 L 593.0,429.4 L 539.3,416.1 L 505.6,393.1 L 454.7,373.9 L 419.1,350.4 L 404.4,343.4 L 377.7,337.3 L 350.7,338.5 L 348.0,337.0 L 332.8,340.0 L 310.0,350.0 L 280.0,362.0 L 251.0,370.0 L 218.6,373.7 L 160.0,382.0 L 100.0,388.0 L 40.0,392.0 L -20.0,395.0 Z',
  centerline: 'M -20.0,380.0 L 40.0,377.0 L 100.0,373.0 L 160.0,367.0 L 218.6,358.7 L 251.0,355.0 L 280.0,347.0 L 310.0,335.0 L 332.8,325.0 L 348.0,322.0 L 350.7,323.5 L 377.7,322.3 L 404.4,328.4 L 419.1,335.4 L 454.7,358.9 L 505.6,378.1 L 539.3,401.1 L 593.0,414.4 L 616.0,425.7 L 633.6,444.2 L 648.7,478.6 L 664.2,498.5 L 693.7,519.7 L 735.8,543.0 L 766.8,559.2 L 815.0,589.0 L 865.0,621.0 L 920.0,653.0 L 980.0,687.0',
  labelPoint: { x: 670, y: 478 },
  bridges: [
    {
      name: 'John Frostbrug',
      x1: 494,
      y1: 360,
      x2: 494,
      y2: 390,
      year: '1944 Slag om Arnhem',
    },
    {
      name: 'Nelson Mandelabrug',
      x1: 395,
      y1: 313,
      x2: 395,
      y2: 343,
      year: '1977',
    },
    {
      name: 'Spoorbrug Arnhem',
      x1: 336,
      y1: 310,
      x2: 336,
      y2: 340,
      year: '1879',
      labelAlign: 'left',
    },
    {
      name: 'Andrej Sacharovbrug (Pleijroute)',
      x1: 745,
      y1: 532,
      x2: 745,
      y2: 562,
      year: '1987',
    },
  ],
};

// ---------------------------------------------------------------------------
// DISTRICTS DATA
// ---------------------------------------------------------------------------

export const DISTRICTS: District[] = [
  {
    id: 'centrum',
    slug: 'centrum',
    name: 'Centrum & Binnenstad',
    shortName: 'Centrum',
    tagLine: 'Het bruisende hart vol historie, terrassen en de 7straatjes',
    description:
      'Van de middeleeuwse Eusebiuskerk en gezellige terrassen op de Korenmarkt tot de exclusieve boetieks in de 7straatjes en cultuurhuis Rozet: in de Arnhemse binnenstad voel je overal energie en gastvrijheid.',
    longDescription:
      'De Arnhemse binnenstad combineert rijke historie met een moderne, ontspannen sfeer. Wandel door de sfeervolle 7straatjes vol unieke speciaalzaken en vintage boetieks, beklim de toren van de Eusebiuskerk voor een adembenemend panorama over Gelderland, of geniet van de bourgondische terrassen rond de Korenmarkt en de Jansplaats. Aan de vernieuwde Rijnkade flaneer je heerlijk langs het water.',
    vibe: 'Bruisend & Historisch',
    characterTags: ['Historisch', 'Winkelen', 'Terrassen', 'Cultuur', 'Rijnkade'],
    color: '#FED7AA', // warm peach pastel
    hoverColor: '#FB923C', // vibrant warm orange
    accentColor: '#EA580C',
    textColor: '#9A3412',
    svgPath:
      'M 380.0,285.0 L 405.0,270.0 L 435.0,258.0 L 468.0,265.0 L 498.4,289.5 L 504.8,298.4 L 514.9,302.5 L 521.0,308.2 L 527.8,323.3 L 525.8,334.6 L 527.5,339.5 L 522.2,342.4 L 505.6,363.1 L 454.7,343.9 L 419.1,320.4 L 404.4,313.4 L 377.7,307.3 L 350.7,308.5 L 365.0,300.0 L 380.0,285.0 Z',
    centerPoint: { x: 445, y: 296 },
    landmarkIcon: '⛪',
    landmarkLabel: 'Eusebiuskerk',
    highlights: [
      {
        name: 'Eusebiuskerk & Glazen Balkon',
        category: 'bezienswaardigheid',
        description:
          'Zweef in de panoramalift 73 meter omhoog en stap op de spectaculaire glazen balkons voor een 360° uitzicht over Arnhem en de Rijn.',
        address: 'Kerkplein 1',
        tip: 'Bezoek het glazen balkon tijdens helder weer voor vergezichten tot aan Nijmegen en de Veluwe.',
        sourceType: 'article',
        sourceTitle: 'Het glazen balkon van de Eusebius',
        sourceUrl: '/artikelen/de-eerste-keer-glazen-balkon-eusiebius',
      },
      {
        name: 'Focus Filmtheater',
        category: 'cultuur',
        description:
          'Hét toonaangevende filmtheater van Arnhem met filmzalen, openlucht bioscoopdak en levendig café aan het Audrey Hepburnplein.',
        address: 'Audrey Hepburnplein 1',
        tip: 'In de zomermaanden zijn de openlucht filmavonden op het dakterras een unieke Arnhemse ervaring.',
        sourceType: 'article',
        sourceTitle: 'Extra kinderfilms in Paasweekend bij Focus Filmtheater Arnhem',
        sourceUrl: '/artikelen/extra-kinderfilms-in-paasweekend-bij-focus-filmtheater-arnhem',
      },
      {
        name: 'Rozet Cultuurhuis',
        category: 'cultuur',
        description:
          'Bekroond architectonisch icoon met de stadsbibliotheek, Erfgoedcentrum Rozet, kunstexposities en een panoramisch dakterras.',
        address: 'Kortestraat 16',
        tip: 'Het dakterras is gratis toegankelijk met een weids uitzicht over de binnenstad.',
        sourceType: 'article',
        sourceTitle: 'Rozet in De Stijl!',
        sourceUrl: '/artikelen/rozet-in-de-stijl',
      },
      {
        name: 'Boekhandel Het Colofon',
        category: 'winkelen',
        description:
          'Sfeervolle onafhankelijke boekhandel in de 7straatjes met duizenden boeken, vinyl, live muziek en een fijn café.',
        address: 'Bakkerstraat 56',
        tip: 'Strijk neer voor een kop koffie en een goed boek in de themakamers.',
        sourceType: 'locatie',
        sourceTitle: 'Het Colofon',
        sourceUrl: '/agenda?search=Colofon',
      },
      {
        name: 'Rijnkade Boulevard & John Frostbrug',
        category: 'bezienswaardigheid',
        description:
          'Flaneren langs het water met uitzicht op voorbijvarende schepen, de historische John Frostbrug en sfeervolle terrassen.',
        address: 'Rijnkade',
        tip: 'Ieder jaar in september het decor van de indrukwekkende herdenkingsavond Bridge to Liberation.',
        sourceType: 'article',
        sourceTitle: 'Bridge to Liberation – Herdenkingsavond Slag om Arnhem',
        sourceUrl: '/artikelen/bridge-to-liberation-herdenking-slag-om-arnhem',
      },
    ],
    transportInfo: {
      ov: 'Station Arnhem Centraal ligt direct aan de rand van de binnenstad (3 minuten lopen). Vrijwel alle stads- en streekbussen stoppen bij Centraal of Willemsplein.',
      bike: 'Bewaakte gratis gemeentelijke fietsenstallingen bij Station Centraal, Rozet en Jansplein.',
      parking: 'Parkeergarages Centraal, Rozet, Musis en Langstraat liggen direct rond het voetgangersgebied.',
    },
    heroImage:
      '/images/arnhem/zevenstraatjes-eusebius.jpg',
    galleryImages: [
      '/images/arnhem/zevenstraatjes-terrassen.jpg',
    ],
    articleTags: ['binnenstad', 'centrum', '7straatjes', 'korenmarkt', 'jansplaats', 'eusebius', 'rozet', 'rijnkade', 'focus', 'luxor', 'musis', 'colofon'],
  },
  {
    id: 'spijkerkwartier',
    slug: 'spijkerkwartier',
    name: 'Spijkerkwartier',
    shortName: 'Spijkerkwartier',
    tagLine: 'Statige herenhuizen, verborgen stadstuinen en gezellige eethuisjes',
    description:
      'Een monumentale 19e-eeuwse wijk vol karakter, geheime openbare binnentuinen, intieme koffiebars en een hechte, creatieve buurtcultuur.',
    longDescription:
      'Het Spijkerkwartier is een van Arnhems meest geliefde en fotogenieke stadswijken. Bekend om haar statige 19e-eeuwse herenhuizen met hoge plafonds en ornamenten, maar bovenal om het netwerk van weelderige, publiek toegankelijke binnentuinen die door bewoners worden gekoesterd. In de Steenstraat en de zijstraatjes vind je een eclectische mix van eethuisjes, delicatessenzaken en boetiekjes.',
    vibe: 'Bohemien & Monumentaal',
    characterTags: ['Stadstuinen', 'Herenhuizen', 'Creatief', 'Koffiebars', 'Authentiek'],
    color: '#FECDD3', // soft rose pastel
    hoverColor: '#FB7185', // warm rose
    accentColor: '#E11D48',
    textColor: '#9F1239',
    svgPath:
      'M 498.4,289.5 L 519.3,287.5 L 550.0,288.0 L 590.0,288.0 L 625.0,287.0 L 655.0,286.0 L 652.0,305.0 L 642.0,320.0 L 620.0,332.0 L 586.4,340.0 L 563.0,341.0 L 541.6,344.4 L 531.6,339.6 L 527.5,339.5 L 525.8,334.6 L 527.8,323.3 L 521.0,308.2 L 514.9,302.5 L 504.8,298.4 L 498.4,289.5 Z',
    centerPoint: { x: 585, y: 315 },
    landmarkIcon: '🌿',
    landmarkLabel: 'Stadstuinen',
    highlights: [
      {
        name: 'Vrijstaat Thialf & Brasserie Thialf',
        category: 'actief',
        description:
          'Het bruisende sociale hart van het Spijkerkwartier met wijkpark, speeltuin, gezellige brasserie en het jaarlijkse Festival Spijkerrok.',
        address: 'Dullertstraat 33',
        tip: 'In de zomer een heerlijke ontmoetingsplek voor jong en oud op het groene terras.',
        sourceType: 'article',
        sourceTitle: 'Festival Spijkerrok op Vrijstaat Thialf',
        sourceUrl: '/artikelen/festival-spijkerrok-op-vrijstaat-thialf',
      },
      {
        name: 'Bakkerij Tom van Otterloo (Steenstraat)',
        category: 'eten-drinken',
        description:
          'Ambachtelijke biologische bakkerij aan de levendige Steenstraat, bekend om authentiek desembrood en lokale ingrediënten.',
        address: 'Steenstraat 83',
        tip: 'Probeer het desembrood gemaakt van lokaal Gelders graan.',
        sourceType: 'article',
        sourceTitle: 'Tom van Otterloo serveert smaak met duurzaamheid',
        sourceUrl: '/artikelen/tom-van-otterloo-serveert-smaak-met-duurzaamheid',
      },
      {
        name: 'Klimaatroute & Verborgen Binnentuinen',
        category: 'natuur',
        description:
          'Ontdek de beroemde ecologische binnentuinen en klimaatadaptieve groene straten die het Spijkerkwartier tot een voorbeeldwijk maken.',
        address: 'Spijkerstraat / Driekoningendwarsstraat',
        tip: 'Wandel door de poortjes naar de Lommerrijke Tuin en de Watertuin voor serene rust midden in de stad.',
        sourceType: 'article',
        sourceTitle: 'Loop mee met de klimaatroute door het Spijkerkwartier',
        sourceUrl: '/artikelen/loop-mee-met-de-klimaatroute-door-het-spijkerkwartier-in-arnhem',
      },
      {
        name: 'Buurthuis De Lommerd',
        category: 'cultuur',
        description:
          'Monumentaal wijkcentrum in een voormalige school, ontmoetingsplek voor kunstexposities, buurtinitiatieven en culturele evenementen.',
        address: 'Spijkerstraat 185A',
        tip: 'Bekijk de wisselende exposities van lokale kunstenaars en wijkbewoners.',
        sourceType: 'locatie',
        sourceTitle: 'Buurthuis De Lommerd',
        sourceUrl: '/agenda?search=Lommerd',
      },
      {
        name: 'Café Vrijdag',
        category: 'eten-drinken',
        description:
          'Gezellige, huiselijke ontmoetingsplek aan de rand van het Spijkerkwartier voor koffie, tosti’s, huisgemaakte taart, bordspellen en een zonnig hoekterras.',
        address: 'Velperbuitensingel 21-A',
        tip: 'Geliefde huiskamerlocatie voor buurtbewoners en deelnemende locatie van wijkinitiatieven zoals Kunst op de Koffie.',
        sourceType: 'article',
        sourceTitle: 'Kunst Op De Koffie in het Spijkerkwartier',
        sourceUrl: '/artikelen/kunst-op-de-koffie',
      },
      {
        name: 'Kunst op de Koffie',
        category: 'cultuur',
        description:
          'Bijzonder tweejaarlijks kunstfestival waarbij kunstenaars exposeren in de historische huiskamers en binnentuinen van wijkbewoners.',
        address: 'Spijkerkwartier',
        tip: 'Een unieke kans om achter de monumentale gevels van de 19e-eeuwse herenhuizen te kijken.',
        sourceType: 'article',
        sourceTitle: 'Kunst op de koffie in het Spijkerkwartier',
        sourceUrl: '/artikelen/kunst-op-koffie',
      },
    ],
    transportInfo: {
      ov: 'Op 5 minuten loopafstand van Station Arnhem Velperpoort en op 10 minuten van Centraal. Trolleybus 1 stopt bij de rand van de wijk.',
      bike: 'Uitstekende fietspaden via de Velperbuitensingel en Spoorwegstakingstraat.',
      parking: 'Betaald parkeren in de wijk of parkeergarage Musis nabij de singel.',
    },
    heroImage:
      'https://uitinarnhem.nl/wp-content/uploads/2024/08/Arnhem-klimaatbestendig-vergroening-Emmastraat-20210728_FAM2178-Frank-Myszka.jpg',
    galleryImages: [
      '/images/arnhem/trolleybus-arnhem.jpg',
    ],
    articleTags: ['spijkerkwartier', 'spijkerstraat', 'thialf', 'steenstraat', 'lommerd', 'otterloo', 'gavius', 'cafe vrijdag'],
  },
  {
    id: 'modekwartier',
    slug: 'modekwartier',
    name: 'Modekwartier & Klarendal',
    shortName: 'Modekwartier',
    tagLine: 'Creatieve broedplaats van modeontwerpers, ambacht en gastronomie',
    description:
      'Een dynamische voormalige volkswijk getransformeerd tot het creatieve modehart van Nederland met meer dan 50 ateliers, concept stores en toprestaurants.',
    longDescription:
      'In het Modekwartier (Klarendal) bruist het van de innovatieve ontwerpers, goudsmeden, meubelmakers en modekunstenaars. Langs de Klarendalseweg vind je unieke winkeltjes waar de maker zelf achter de toonbank staat. Combineer een ontdekkingstocht langs haute couture en upcycled design met heerlijk eten bij toonaangevende horecazaken.',
    vibe: 'Creatief & Eigenzinnig',
    characterTags: ['Mode & Design', 'Ateliers', 'Gastronomie', 'Ambacht', 'Volkscultuur'],
    color: '#E9D5FF', // soft purple / lilac pastel
    hoverColor: '#C084FC', // vibrant purple
    accentColor: '#9333EA',
    textColor: '#6B21A8',
    svgPath:
      'M 519.3,287.5 L 519.9,278.6 L 523.2,270.6 L 546.1,238.7 L 567.3,233.2 L 600.9,232.5 L 624.7,239.9 L 646.7,212.3 L 665.0,201.6 L 672.0,225.0 L 674.0,250.0 L 668.0,272.0 L 655.0,286.0 L 625.0,287.0 L 590.0,288.0 L 550.0,288.0 L 519.3,287.5 Z',
    centerPoint: { x: 605, y: 258 },
    landmarkIcon: '✂️',
    landmarkLabel: 'Mode & Design',
    highlights: [
      {
        name: 'Restaurant Goed Proeven',
        category: 'eten-drinken',
        description:
          'Gevestigd in een voormalig kloosterpand in het hart van Klarendal: creatieve gerechten om te delen en een sfeervolle binnentuin.',
        address: 'Klarendalseweg 536',
        tip: 'De zonnige binnentuin is een van de best bewaarde geheimen van het Modekwartier.',
        sourceType: 'locatie',
        sourceTitle: 'Goed Proeven',
        sourceUrl: '/artikelen/klarendal',
      },
      {
        name: 'Molen De Kroon',
        category: 'bezienswaardigheid',
        description:
          'Historische korenmolen uit 1849 die nog altijd meel maalt en het decor vormt voor het jaarlijkse Klarendalse Molenfeest.',
        address: 'Klarendalseweg 82',
        tip: 'Iedere zaterdag geopend voor bezoekers om vers gemalen pannenkoekenmeel te kopen.',
        sourceType: 'article',
        sourceTitle: 'Heropening Molen de Kroon | Klarendals Molenfeest',
        sourceUrl: '/artikelen/heropening-molen-de-kroon',
      },
      {
        name: 'Modekwartier Designateliers',
        category: 'winkelen',
        description:
          'Meer dan 50 ateliers, modeontwerpers, sieradenmakers en conceptstores langs de Klarendalseweg.',
        address: 'Klarendalseweg',
        tip: 'Wandel van noord naar zuid over de Klarendalseweg en ontdek unieke handgemaakte stukken.',
        sourceType: 'article',
        sourceTitle: 'Nieuwe conceptstore opent deuren in Modekwartier',
        sourceUrl: '/artikelen/nieuwe-conceptstore-opent-deuren-in-modekwartier',
      },
      {
        name: 'Café Restaurant Sugar Hill',
        category: 'eten-drinken',
        description:
          'Karakteristiek eetcafé op de hoek van de Klarendalseweg, vermaard om ambachtelijke gerechten, goede wijnen en huisgemaakte taarten.',
        address: 'Klarendalseweg 192',
        tip: 'Vaste pleisterplaats voor creatieve wijkbewoners en bezoekers.',
        sourceType: 'article',
        sourceTitle: 'Klarendal: bruisende volkswijk en creatief hart van designstad Arnhem',
        sourceUrl: '/artikelen/klarendal',
      },
      {
        name: 'Uitgeverij Loopvis & ABC Libertas',
        category: 'cultuur',
        description:
          'Duurzame Arnhemse uitgeverij en creatieve studio gespecialiseerd in bijzondere boeken, proeverijen en papierkunst.',
        address: 'Klarendalseweg 477',
        tip: 'Gevestigd in het monumentale ABC Libertas pand met regelmatige workshops en presentaties.',
        sourceType: 'article',
        sourceTitle: 'Uitgeverij Loopvis: Liefdewerk en nieuw papier',
        sourceUrl: '/artikelen/uitgeverij-loopvis-liefdewerk-en-nieuw-papier',
      },
    ],
    transportInfo: {
      ov: 'Station Arnhem Velperpoort ligt aan de ingang van het Modekwartier (4 minuten lopen). Trolleybus 3 stopt bij halte Klarendalseweg.',
      bike: 'Vanaf Arnhem Centraal fiets je in circa 7 minuten naar het Modekwartier.',
      parking: 'Gratis parkeerterrein bij de wijk aan de Hommelseweg en parkeerplekken langs de wijkstraten.',
    },
    heroImage:
      '/images/arnhem/modekwartier-klarendal.jpg',
    galleryImages: [
      'https://uitinarnhem.nl/wp-content/uploads/2024/05/Street-Art-Tour-20230804_105441-scaled.jpg',
    ],
    articleTags: ['modekwartier', 'klarendal', 'klarendalseweg', 'kroon', 'goed proeven', 'sugar hill', 'loopvis'],
  },
  {
    id: 'sonsbeek',
    slug: 'sonsbeek',
    name: 'Sonsbeek & Parken',
    shortName: 'Sonsbeek',
    tagLine: 'Royaal groen, kabbelende beken en grandioze vergezichten over de stad',
    description:
      'Het kroonjuweel van Arnhem: heuvelachtige stadsparken, de iconische Witte Villa, watervallen en de toegangspoort tot Park Zypendaal.',
    longDescription:
      'Park Sonsbeek is misschien wel het meest geliefde stadspark van Nederland. Aangelegd op een stuwwal met steile heuvels, eeuwenoude beuken, kabbelende beekjes en watervallen. Vanaf de heuvel bij de Witte Villa kijk je uit over de daken van de binnenstad. Het park vloeit naadloos over in Park Zypendaal en Gulden Bodem.',
    vibe: 'Monumentaal & Ontspannen',
    characterTags: ['Parklandschap', 'Witte Villa', 'Watervallen', 'Terrassen', 'Wandelen'],
    color: '#BBF7D0', // soft emerald / sage pastel
    hoverColor: '#4ADE80', // vibrant park green
    accentColor: '#16A34A',
    textColor: '#14532D',
    svgPath:
      'M 549.4,218.6 L 554.4,218.9 L 554.6,224.8 L 565.5,225.1 L 567.2,233.2 L 546.1,238.7 L 523.2,270.6 L 519.3,287.5 L 498.4,289.5 L 481.3,263.7 L 493.1,235.0 L 509.0,232.3 L 527.4,236.5 L 536.0,230.4 L 537.4,219.6 L 544.5,216.6 L 549.4,218.6 Z M 534.2,186.9 L 532.1,191.3 L 546.9,205.2 L 550.2,219.0 L 544.5,216.6 L 537.4,219.6 L 536.0,230.4 L 527.4,236.5 L 509.0,232.3 L 493.1,235.0 L 498.0,226.1 L 479.1,210.8 L 478.4,193.9 L 440.7,200.0 L 437.8,171.7 L 423.8,153.5 L 422.5,144.5 L 463.1,136.8 L 518.5,132.7 L 514.5,143.1 L 536.8,179.7 L 534.2,186.9 Z M 437.3,184.5 L 440.7,200.0 L 478.4,193.9 L 479.1,210.8 L 498.0,226.1 L 481.2,263.2 L 498.4,289.5 L 468.0,265.0 L 435.0,258.0 L 405.0,270.0 L 380.0,285.0 L 369.1,259.6 L 351.7,251.8 L 311.5,241.1 L 260.4,215.2 L 274.4,213.2 L 356.0,166.6 L 408.2,146.0 L 422.5,144.5 L 423.8,153.5 L 437.8,171.7 L 437.3,184.5 Z',
    centerPoint: { x: 463, y: 221 },
    landmarkIcon: '🌳',
    landmarkLabel: 'Park Sonsbeek',
    highlights: [
      {
        name: 'Stadsvilla Sonsbeek (De Witte Villa)',
        category: 'eten-drinken',
        description:
          'Statig landhuis bovenop de heuvel met een grand café en een panoramaterras over de hele stad.',
        address: 'Tellegenlaan 3',
        tip: 'Geniet hier op een zonnige middag van een drankje met weids uitzicht over de Arnhemse skyline.',
        sourceType: 'article',
        sourceTitle: 'NYE in Stadsvilla Sonsbeek | Villa Volta',
        sourceUrl: '/artikelen/nye-villa-volta',
      },
      {
        name: 'Ketelhuis Sonsbeek',
        category: 'eten-drinken',
        description:
          'Industrieel monumentaal pand verscholen tussen de monumentale beuken van Sonsbeek voor een ontspannen lunch of borrel.',
        address: 'Tellegenlaan 4',
        tip: 'Perfect te combineren met een wandeling langs de watervallen en de Steile Tuin.',
        sourceType: 'article',
        sourceTitle: 'Lunchen bij Ketelhuis Sonsbeek',
        sourceUrl: '/artikelen/lunchen-bij-ketelhuis-sonsbeek',
      },
      {
        name: 'Nederlands Watermuseum',
        category: 'cultuur',
        description:
          'Interactief doe-museum over water in al haar facetten, gevestigd aan de kabbelende Sint Jansbeek.',
        address: 'Zijpendaalseweg 26-28',
        tip: 'Een fantastisch en leerzaam uitje voor gezinnen met kinderen direct aan het park.',
        sourceType: 'locatie',
        sourceTitle: 'Watermuseum',
        sourceUrl: '/agenda?search=Watermuseum',
      },
      {
        name: 'Huis & Park Zypendaal',
        category: 'bezienswaardigheid',
        description:
          'Schilderachtig 18e-eeuws landhuis met slotgracht, omgeven door rustige bomenlanen en rododendrons.',
        address: 'Zijpendaalseweg 44',
        tip: 'Wandel via de bosvalleien direct van Sonsbeek door naar Zypendaal.',
        sourceType: 'locatie',
        sourceTitle: 'Huis Zypendaal',
        sourceUrl: '/agenda?search=Zypendaal',
      },
      {
        name: 'Molenplaats Sonsbeek & De Ronde Weide',
        category: 'natuur',
        description:
          'Historische watermolen met theetuin en bezoekerscentrum, startpunt voor wandelroutes en culturele festivals zoals SonsbeekTheaterAvenue.',
        address: 'Zijpendaalseweg 24a',
        tip: 'Strijk neer op het terras aan de beek voor biologische streekproducten.',
        sourceType: 'article',
        sourceTitle: 'SonsbeekTheaterAvenue',
        sourceUrl: '/artikelen/sonsbeektheateravenue',
      },
    ],
    transportInfo: {
      ov: 'Ligt direct achter Arnhem Centraal (Noordzijde uitgang Sonsbeekpark, 2 minuten lopen). Trolleybussen 3 en 8 stoppen bij de hoofdingangen.',
      bike: 'Uitgebreide fietsroutes door en langs de parken; fietsenstalling aan de noordzijde van het station.',
      parking: 'Parkeren kan langs de Zijpendaalseweg of in parkeergarage Centraal.',
    },
    heroImage:
      '/images/arnhem/stadsvilla-sonsbeek-zomer.jpg',
    galleryImages: [
      'https://uitinarnhem.nl/wp-content/uploads/2024/04/Ketelhuis-Sonsbeek-6.jpg',
    ],
    articleTags: ['sonsbeek', 'zypendaal', 'watermuseum', 'witte villa', 'ketelhuis', 'ronde weide', 'molenplaats'],
  },
  {
    id: 'arnhem-west',
    slug: 'arnhem-west',
    name: 'Arnhem-West & Museumkwartier',
    shortName: 'Arnhem-West',
    tagLine: 'Kunst op de stuwwal met adembenemend uitzicht over de Rijn',
    description:
      'De artistieke stuwwal van Arnhem met Museum Arnhem, statige lanen, Mariëndaal en de historische slag om de Rijn herinneringen.',
    longDescription:
      'Arnhem-West strekt zich uit langs de heuvelrug van de Rijn en omvat Heijenoord, Lombok, Klingelbeek en de stuwwal naar Oosterbeek. Het pronkstuk is Museum Arnhem met haar spectaculaire uitkijkvleugel over de rivier. De wijk herbergt schitterende jugendstil villa’s, groene landgoederen en creatieve hotspots.',
    vibe: 'Cultureel & Panoramisch',
    characterTags: ['Museum Arnhem', 'Rijnzicht', 'Groene Lanen', 'Landgoederen', 'Kunst'],
    color: '#A7F3D0', // soft mint pastel
    hoverColor: '#34D399', // vibrant teal/mint
    accentColor: '#059669',
    textColor: '#064E3B',
    svgPath:
      'M 369.1,259.6 L 380.0,285.0 L 365.0,300.0 L 350.7,308.5 L 348.0,307.0 L 332.8,310.0 L 310.0,320.0 L 298.2,273.6 L 304.5,266.4 L 351.6,263.8 L 369.1,259.6 Z M 369.1,259.6 L 351.6,263.8 L 304.5,266.4 L 298.2,273.6 L 310.0,320.0 L 280.0,332.0 L 251.0,340.0 L 218.6,343.7 L 228.9,338.8 L 231.1,330.3 L 240.1,327.4 L 233.1,300.8 L 214.7,292.7 L 223.5,252.3 L 210.7,251.4 L 217.3,219.7 L 260.4,215.2 L 311.5,241.1 L 351.7,251.8 L 369.1,259.6 Z',
    centerPoint: { x: 300, y: 285 },
    landmarkIcon: '🏛️',
    landmarkLabel: 'Museum Arnhem',
    highlights: [
      {
        name: 'Museum Arnhem & Beeldentuin',
        category: 'cultuur',
        description:
          'Toonaangevend museum voor moderne en hedendaagse kunst op de hoge stuwwal, met een spectaculaire glazen uitkijkvleugel boven de Rijn.',
        address: 'Utrechtseweg 87',
        tip: 'De gratis toegankelijke beeldentuin biedt een van de mooiste vergezichten van Nederland.',
        sourceType: 'article',
        sourceTitle: 'Saskia Bak, directeur museum Arnhem: “Mijn opa bouwde als timmerman mee aan de Eusebiuskerk”',
        sourceUrl: '/artikelen/saskia-bak-directeur-museum-arnhem-opa-bouwde-als-timmerman-mee-aan-eusebiuskerk',
      },
      {
        name: 'Airborne Museum Hartenstein',
        category: 'cultuur',
        description:
          'Het voormalige Britse hoofdkwartier tijdens de Slag om Arnhem in september 1944, met een indrukwekkende Airborne Experience.',
        address: 'Utrechtseweg 232',
        tip: 'Volg de historische wandelroutes van de para’s vanaf de Utrechtseweg richting de Rijnbrug.',
        sourceType: 'article',
        sourceTitle: 'Rondleiding door Airborne Museum Hartenstein',
        sourceUrl: '/artikelen/rondleiding-airborne-museum-hartenstein',
      },
      {
        name: 'Broedplaats De Transformatie',
        category: 'cultuur',
        description:
          'Grootschalige creatieve broedplaats in een voormalig schoolcomplex in Heijenoord met ateliers, theatermakers en exposities.',
        address: 'Van Oldenbarneveldtstraat 90',
        tip: 'Houd de open atelierdagen en Transformatie-Lab presentaties in de gaten.',
        sourceType: 'article',
        sourceTitle: 'Transformatie-Lab',
        sourceUrl: '/artikelen/transformatie-lab',
      },
      {
        name: 'Arnhems Buiten & De Zoetenlab',
        category: 'bezienswaardigheid',
        description:
          'Het monumentale voormalige KEMA-terrein vol parkachtige architectuur, bossen, innovatieve bedrijven en culturele bijeenkomsten.',
        address: 'Utrechtseweg 310',
        tip: 'Een schitterend groen wandelgebied tussen monumentale gebouwen en eeuwenoude bomen.',
        sourceType: 'locatie',
        sourceTitle: 'Arnhems Buiten',
        sourceUrl: '/agenda?search=Arnhems+Buiten',
      },
      {
        name: 'Restaurant Klein Hartenstein',
        category: 'eten-drinken',
        description:
          'Sfeervol restaurant gelegen in het groen aan de historische Utrechtseweg, met verfijnde seizoensgerechten en een ruim terras.',
        address: 'Utrechtseweg 226',
        tip: 'Ideaal start- of rustpunt tijdens een wandeling of fietstocht over de Utrechtseweg.',
        sourceType: 'article',
        sourceTitle: 'Uit eten bij: Restaurant Klein Hartenstein',
        sourceUrl: '/artikelen/eten-restaurant-klein-hartenstein',
      },
    ],
    transportInfo: {
      ov: 'Lijn 1, 51 en 352 stoppen direct voor Museum Arnhem. Vanaf Arnhem Centraal 12 minuten wandelen.',
      bike: 'Prachtige fietsroute langs de Utrechtseweg met uitzicht over de Rijn en Rosandepolder.',
      parking: 'Parkeren bij het museumterrein of in de omliggende groene lanen.',
    },
    heroImage:
      '/images/arnhem/museum-arnhem-tuin.jpg',
    galleryImages: [
      '/images/arnhem/rijnkade-schemering.jpg',
    ],
    articleTags: ['arnhem-west', 'museum arnhem', 'mariendaal', 'mariëndaal', 'heijenoord', 'klingelbeek', 'arnhems buiten', 'transformatie', 'hartenstein', 'pierre janssen'],
  },
  {
    id: 'arnhem-noord',
    slug: 'arnhem-noord',
    name: 'Arnhem-Noord & Veluwe',
    shortName: 'Arnhem-Noord',
    tagLine: 'Eindeloze bossen, wereldberoemde dierentuin en openlucht erfgoed',
    description:
      'Waar de stad overgaat in Nationaal Park Veluwezoom: Burgers’ Zoo, het Nederlands Openluchtmuseum en heuvels vol heide en bos.',
    longDescription:
      'Arnhem-Noord is de ultieme combinatie van stadscomfort en pure natuur. Hier liggen nationale topattracties zoals de overdekte ecosystemen van Koninklijke Burgers’ Zoo en het levende geschiedenis van het Openluchtmuseum. Dit is dé uitvalsbasis voor mountainbikers, wandelaars en gezinnen die van de Veluwe houden.',
    vibe: 'Natuurlijk & Groots',
    characterTags: ['Veluwe', 'Burgers Zoo', 'Openluchtmuseum', 'Bossen', 'Familie'],
    color: '#C7D2FE', // soft periwinkle / slate pastel
    hoverColor: '#818CF8', // vibrant periwinkle
    accentColor: '#4F46E5',
    textColor: '#312E81',
    svgPath:
      'M 180,32 L 422.5,32 L 422.5,144.5 L 408.2,146.0 L 356.0,166.6 L 274.4,213.2 L 260.4,215.2 L 217.3,219.7 L 160,140 Z M 422.5,32 L 720,32 L 707.4,114.6 L 576.0,123.8 L 518.5,132.7 L 463.1,136.8 L 422.5,144.5 Z',
    centerPoint: { x: 430, y: 85 },
    landmarkIcon: '🦁',
    landmarkLabel: "Burgers' Zoo & Openluchtmuseum",
    highlights: [
      {
        name: 'Nederlands Openluchtmuseum',
        category: 'cultuur',
        description:
          'Wandel door eeuwen Nederlandse geschiedenis met authentieke boerderijen, historische trams, ambachtslieden en de Canon van Nederland.',
        address: 'Hoeferlaan 4',
        tip: 'Maak een ritje met de historische elektrische tram over het heuvelachtige museumpark.',
        sourceType: 'article',
        sourceTitle: 'We hebben wat te vieren: Nederlands Openluchtmuseum wordt 100 jaar!',
        sourceUrl: '/artikelen/nederlands-openluchtmuseum-100-jaar',
      },
      {
        name: "Koninklijke Burgers' Zoo",
        category: 'cultuur',
        description:
          'Wereldberoemd ecodierenpark met overdekte werelden: Bush, Desert, Ocean, Mangrove en Safari.',
        address: 'Antoon van Hooffplein 1',
        tip: 'In de Mangrove loop je tussen vrij rondvliegende vlinders en zeekoeien in het grootste overdekte mangrovegebied ter wereld.',
        sourceType: 'locatie',
        sourceTitle: "Burgers' Zoo",
        sourceUrl: '/agenda?search=Burgers',
      },
      {
        name: 'Museum Bronbeek',
        category: 'cultuur',
        description:
          'Koninklijk tehuis voor oud-militairen en museum gewijd aan het koloniale verleden en het voormalig Nederlands-Indië.',
        address: 'Velperweg 147',
        tip: 'Wandel door het monumentale park met historische kanonnen en herdenkingsmonumenten.',
        sourceType: 'article',
        sourceTitle: 'Week van de Koloniale Geschiedenis in Museum Bronbeek',
        sourceUrl: '/artikelen/week-van-de-koloniale-geschiedenis-in-museum-bronbeek',
      },
      {
        name: 'Posbank & Nationaal Park Veluwezoom',
        category: 'natuur',
        description:
          'Eindeloze vergezichten over glooiende heidevelden, heuvels tot 90 meter boven NAP en uitgestrekte bossen.',
        address: 'Heuvenseweg',
        tip: 'In augustus en september kleurt de heide adembenemend paars.',
        sourceType: 'locatie',
        sourceTitle: 'Posbank',
        sourceUrl: '/agenda?search=Posbank',
      },
    ],
    transportInfo: {
      ov: 'Trolleybus 3 rijdt frequent vanaf Arnhem Centraal rechtstreeks naar Burgers’ Zoo en Openluchtmuseum.',
      bike: 'Gemarkeerde fietsknooppunten leiden direct vanuit het centrum de Veluwe op.',
      parking: 'Grote parkeerterreinen bij Burgers’ Zoo, Openluchtmuseum en Transferium Arnhem-Noord (A12).',
    },
    heroImage:
      'https://uitinarnhem.nl/wp-content/uploads/2021/08/Afbeelding-Bronbeek-scaled.jpg',
    galleryImages: [
      '/images/arnhem/papendal-bmx.jpg',
    ],
    articleTags: ['openluchtmuseum', 'burgers', 'zoo', 'bronbeek', 'schaarsbergen', 'posbank', 'veluwe'],
  },
  {
    id: 'arnhem-oost',
    slug: 'arnhem-oost',
    name: 'Arnhem-Oost & Presikhaaf',
    shortName: 'Arnhem-Oost',
    tagLine: 'Groene stadsparken, studentendynamiek en moderne innovatie',
    description:
      'De poort naar het oosten met de groene oase van Park Presikhaaf, de campus van de HAN en industrieel erfgoed op Industriepark Kleefse Waard.',
    longDescription:
      'Arnhem-Oost is een levendig, multicultureel en innovatief stadsdeel. Hier studeren duizenden studenten op de HAN-campus, genieten families van Park Presikhaaf met de heemtuin en stadsboerderij, en werken pioniers aan de circulaire economie op het toonaangevende Industriepark Kleefse Waard (IPKW).',
    vibe: 'Dynamisch & Innovatief',
    characterTags: ['Park Presikhaaf', 'HAN Campus', 'IPKW', 'Diversiteit', 'Duurzaamheid'],
    color: '#FEF08A', // soft yellow / gold pastel
    hoverColor: '#FACC15', // vibrant gold
    accentColor: '#CA8A04',
    textColor: '#713F12',
    svgPath:
      'M 642.0,320.0 L 685.3,329.6 L 712.0,341.8 L 790.7,399.9 L 748.9,434.2 L 737.5,451.8 L 731.2,473.0 L 735.8,506.2 L 766.8,544.2 L 693.7,504.7 L 664.2,483.5 L 648.7,463.6 L 633.6,429.2 L 616.0,410.7 L 593.0,399.4 L 539.3,386.1 L 505.6,363.1 L 527.5,339.5 L 531.6,339.6 L 541.6,344.4 L 563.0,341.0 L 586.4,340.0 L 620.0,332.0 L 642.0,320.0 Z M 703.7,303.1 L 717.8,317.2 L 767.7,299.8 L 814.9,350.9 L 793.8,362.0 L 767.9,382.4 L 726.8,351.0 L 699.4,335.4 L 642.0,320.0 L 652.0,305.0 L 655.0,286.0 L 688.1,275.3 L 703.7,303.1 Z M 877.7,299.4 L 925.2,321.1 L 974.4,364.4 L 843.7,381.3 L 815.2,388.0 L 790.7,399.9 L 767.9,382.4 L 793.8,362.0 L 814.9,350.9 L 767.7,299.8 L 717.8,317.2 L 707.5,308.4 L 686.1,276.2 L 763.2,233.6 L 780.7,253.5 L 805.2,271.8 L 833.6,285.4 L 877.7,299.4 Z M 745.9,204.4 L 753.7,222.3 L 765.0,233.0 L 688.1,275.3 L 655.0,286.0 L 668.0,272.0 L 674.0,250.0 L 672.0,225.0 L 665.0,201.6 L 673.1,207.2 L 709.7,180.9 L 705.0,177.6 L 730.3,159.0 L 745.9,204.4 Z M 683.9,132.8 L 689.2,166.9 L 695.3,171.0 L 688.0,176.9 L 697.7,183.2 L 705.0,177.6 L 709.7,180.9 L 673.1,207.2 L 665.0,201.6 L 667.9,200.2 L 634.4,150.4 L 683.9,132.8 Z M 691.1,117.3 L 720.1,141.8 L 730.3,159.0 L 697.7,183.2 L 688.0,176.9 L 695.3,171.0 L 689.2,166.9 L 683.8,132.5 L 634.4,150.4 L 667.9,200.2 L 646.7,212.3 L 624.7,239.9 L 600.9,232.5 L 567.2,233.2 L 565.5,225.1 L 554.6,224.8 L 546.9,205.2 L 532.1,191.3 L 536.8,179.7 L 514.5,143.1 L 518.5,132.7 L 576.0,123.8 L 707.4,114.6 L 691.1,117.3 Z',
    centerPoint: { x: 720, y: 295 },
    landmarkIcon: '🎓',
    landmarkLabel: 'Park Presikhaaf & HAN',
    highlights: [
      {
        name: 'Industriepark Kleefse Waard (IPKW)',
        category: 'cultuur',
        description:
          'Prijswinnende cleantech-campus op een voormalig industrieterrein aan de Rijn, broedplaats voor duurzame innovaties en cultuur.',
        address: 'Westervoortsedijk 73',
        tip: 'Bekijk de iconische industriële hallen en duurzame architectuur langs de rivier.',
        sourceType: 'article',
        sourceTitle: 'IPKW-directeur Kevin Rijke: “Kleefse Waard wordt het duurzaamste park van Nederland”',
        sourceUrl: '/artikelen/kevin-rijke-kleefse-waard-wordt-duurzaamste-park',
      },
      {
        name: 'Restaurant De Kookplaats',
        category: 'eten-drinken',
        description:
          'Het culinaire hart van IPKW waar gewerkt wordt met verse seizoensproducten, biologische ingrediënten en een industrieel decor.',
        address: 'Westervoortsedijk 73',
        tip: 'Populair voor een gezonde lunch of een borrel in een unieke industriële setting.',
        sourceType: 'article',
        sourceTitle: 'Alles kan bij Kookplaats',
        sourceUrl: '/artikelen/kookplaats',
      },
      {
        name: 'Stadsboerderij Presikhaaf & Heemtuin',
        category: 'natuur',
        description:
          'Groot stadspark met een educatieve stadsboerderij, heemtuin, theehuis en speelweiden aan de vijvers van Presikhaaf.',
        address: 'Ruitenberglaan 4',
        tip: 'Ideaal voor een wandeling met kinderen of een rustige middag in de heemtuin.',
        sourceType: 'locatie',
        sourceTitle: 'Stadsboerderij Presikhaaf',
        sourceUrl: '/agenda?search=Presikhaaf',
      },
      {
        name: 'Buurthuis De Oosthof Presikhaaf',
        category: 'cultuur',
        description:
          'Actief buurthuis in Presikhaaf waar bewoners samenkomen voor culturele workshops, fietstochten en wijkfeesten.',
        address: 'Kinderkamp 9',
        tip: 'Organiseert regelmatig startpunten voor natuur- en klimaatfietstochten door de regio.',
        sourceType: 'locatie',
        sourceTitle: 'buurthuis de Oosthof Presikhaaf',
        sourceUrl: '/agenda?search=Oosthof',
      },
    ],
    transportInfo: {
      ov: 'Eigen treinstation: Station Arnhem Presikhaaf. Trolleybussen 1, 5 en 6 verbinden het gebied snel met de binnenstad.',
      bike: 'Snelfietsroute over de Velperweg en Ruitenberglaan; ruime fietsenstallingen bij de stations en HAN.',
      parking: 'Ruime gratis parkeergelegenheid rondom Park Presikhaaf en Winkelcentrum Presikhaaf.',
    },
    heroImage:
      'https://uitinarnhem.nl/wp-content/uploads/2024/05/Street-Art-Tour-20230804_105441-scaled.jpg',
    galleryImages: [
      '/images/arnhem/stadsvilla-sonsbeek-zomer.jpg',
    ],
    articleTags: ['presikhaaf', 'ipkw', 'kleefse waard', 'kookplaats'],
  },
  {
    id: 'arnhem-zuid',
    slug: 'arnhem-zuid',
    name: 'Arnhem-Zuid & Meinerswijk',
    shortName: 'Arnhem-Zuid',
    tagLine: 'Ruige uiterwaarden, Romeins erfgoed en groots entertainment',
    description:
      'Aan de overkant van de Rijn: de wilde natuur van Meinerswijk met konikpaarden, stadion GelreDome, winkelcentrum Kronenburg en moderne woonwijken.',
    longDescription:
      'Arnhem-Zuid is verrassend veelzijdig. Direct aan de zuidoever ligt uiterwaardenpark Meinerswijk, een ruig natuurgebied waar wilde runderen en konikpaarden grazen rondom de resten van een Romeins castellum. Verder naar het zuiden vind je het toonaangevende GelreDome voor wereldconcerten en sport, en bruisende woonwijken zoals Schuytgraaf en Malburgen.',
    vibe: 'Natuurlijk & Ruimtelijk',
    characterTags: ['Meinerswijk', 'Uiterwaarden', 'GelreDome', 'Romeins', 'Rijnzicht'],
    color: '#BAE6FD', // soft sky blue pastel
    hoverColor: '#38BDF8', // vibrant sky blue
    accentColor: '#0284C7',
    textColor: '#075985',
    svgPath:
      'M 472.5,432.4 L 446.9,458.4 L 420.3,476.8 L 394.5,462.1 L 351.2,451.6 L 327.1,449.3 L 309.7,453.7 L 287.6,439.6 L 259.3,440.5 L 243.8,436.1 L 202.6,441.1 L 159.2,437.9 L 160.0,382.0 L 218.6,373.7 L 251.0,370.0 L 280.0,362.0 L 310.0,350.0 L 332.8,340.0 L 348.0,337.0 L 350.7,338.5 L 377.7,337.3 L 404.4,343.4 L 419.1,350.4 L 454.7,373.9 L 505.6,393.1 L 472.5,432.4 Z M 631.0,498.2 L 626.3,500.3 L 625.2,519.4 L 608.8,522.4 L 595.7,502.8 L 522.7,459.5 L 468.6,436.7 L 505.6,393.1 L 539.3,416.1 L 593.0,429.4 L 616.0,440.7 L 633.6,459.2 L 648.7,493.6 L 631.0,498.2 Z M 583.3,498.3 L 600.0,506.3 L 608.8,522.4 L 625.2,519.4 L 623.2,542.5 L 612.7,562.2 L 595.9,558.5 L 568.3,560.8 L 567.6,521.8 L 506.0,518.2 L 480.9,512.9 L 420.3,476.8 L 437.3,466.5 L 468.6,436.7 L 522.7,459.5 L 583.3,498.3 Z M 568.0,540.9 L 568.3,560.8 L 527.5,567.0 L 521.6,576.0 L 505.1,585.7 L 502.7,595.4 L 443.4,581.8 L 424.7,572.9 L 383.7,541.5 L 368.8,509.4 L 420.3,476.8 L 480.9,512.9 L 506.0,518.2 L 567.6,521.8 L 568.0,540.9 Z M 330.4,449.2 L 389.4,460.4 L 420.3,476.8 L 332.5,531.2 L 318.1,545.4 L 311.3,562.3 L 302.5,561.7 L 244.3,541.1 L 295.6,464.7 L 311.1,453.1 L 330.4,449.2 Z M 261.5,440.6 L 291.9,440.4 L 309.7,453.7 L 290.7,470.4 L 244.3,541.1 L 200.0,532.7 L 149.5,535.0 L 145.9,475.3 L 159.2,437.9 L 202.6,441.1 L 243.8,436.1 L 261.5,440.6 Z M 310.1,617.6 L 308.5,646.1 L 293.1,635.0 L 269.6,627.1 L 155.6,609.9 L 149.5,535.0 L 220.0,534.8 L 295.1,560.2 L 311.3,562.3 L 310.1,617.6 Z M 465.8,661.1 L 449.2,682.3 L 394.1,666.8 L 364.8,664.2 L 347.1,655.2 L 308.5,646.1 L 314.3,552.1 L 328.6,534.2 L 368.8,509.4 L 383.7,541.5 L 424.7,572.9 L 443.4,581.8 L 513.5,599.7 L 465.8,661.1 Z M 147.1,505.1 L 155.6,609.9 L 141.0,606.9 L 136.9,617.9 L 62.9,609.7 L 62.8,602.6 L 18.8,602.4 L 11.6,569.0 L 26.3,530.6 L 26.4,509.8 L 19.6,509.2 L 14.3,493.8 L 42.1,480.6 L 49.0,470.5 L 53.6,455.4 L 49.8,424.0 L 54.7,423.7 L 49.4,405.1 L 101.3,412.2 L 162.8,430.5 L 147.2,467.6 L 147.1,505.1 Z',
    centerPoint: { x: 348, y: 505 },
    landmarkIcon: '🌾',
    landmarkLabel: 'Meinerswijk & GelreDome',
    highlights: [
      {
        name: 'Stadsblokken & ASM Haven',
        category: 'cultuur',
        description:
          'Rauw uiterwaarden- en havengebied aan de zuidoever van de Rijn, thuishaven voor Cirque de la Liberté, strandfeesten en festivals.',
        address: 'Stadsblokkenweg 25',
        tip: 'Vanaf hier heb je een fenomenaal uitzicht op de skyline van de Arnhemse binnenstad en de Eusebiuskerk.',
        sourceType: 'article',
        sourceTitle: 'Voor de 10e keer Cirque de la Liberté aan de Rijnoever',
        sourceUrl: '/artikelen/cirque-de-la-liberte',
      },
      {
        name: 'Festivalterrein Meinerswijk & Luie Hond',
        category: 'cultuur',
        description:
          'De ongerepte uiterwaarden van Meinerswijk vormen het decor voor openluchtfestivals zoals Festival de Luie Hond, theater en natuur.',
        address: 'Meinerswijk',
        tip: 'Struin tussen de konikpaarden en Galloway runderen langs de nevengeul en zandstranden van de Rijn.',
        sourceType: 'article',
        sourceTitle: 'Festival de Luie Hond',
        sourceUrl: '/artikelen/luie-hond-festival',
      },
      {
        name: 'GelreDome',
        category: 'cultuur',
        description:
          'Grootste overdekte evenementenarena van Oost-Nederland voor megaconcerten van wereldsterren, dance-events en wedstrijden van Vitesse.',
        address: 'Batavierenweg 25',
        tip: 'Uitstekend bereikbaar per snelle shuttlebus vanaf Arnhem Centraal.',
        sourceType: 'locatie',
        sourceTitle: 'Gelredome',
        sourceUrl: '/agenda?search=Gelredome',
      },
      {
        name: 'Stadsboerderij De Korenmaat',
        category: 'natuur',
        description:
          'Gezellige ecologische stadsboerderij in Arnhem-Zuid met boerderijdieren, tuinen en educatieve natuurpaden.',
        address: 'Marius van Beeklaan 5',
        tip: 'Leuke stop voor families tijdens een fietstocht door Arnhem-Zuid en Park Lingezegen.',
        sourceType: 'locatie',
        sourceTitle: 'Stadsboerderij de Korenmaat',
        sourceUrl: '/agenda?search=Korenmaat',
      },
      {
        name: 'Rozet Kronenburg',
        category: 'cultuur',
        description:
          'Culturele vestiging van Rozet in het winkelcentrum van Arnhem-Zuid met bibliotheek, lezingen en wijkfestivals.',
        address: 'Kronenburggalerij 7',
        tip: 'Regelmatig podium voor cultuurfestivals en kinderworkshops in Arnhem-Zuid.',
        sourceType: 'locatie',
        sourceTitle: 'Rozet Kronenburg',
        sourceUrl: '/agenda?search=Kronenburg',
      },
    ],
    transportInfo: {
      ov: 'Station Arnhem Zuid verzorgt snelle verbindingen richting Nijmegen en Zutphen. Trolleybus 7 en buslijnen verbinden alle wijken razendsnel met Arnhem Centraal.',
      bike: 'Via de Nelson Mandelabrug en John Frostbrug fiets je binnen 5-8 minuten van Zuid naar de Binnenstad.',
      parking: 'Zeer ruime parkeervoorzieningen bij GelreDome, Kronenburg en Transferium Arnhem-Zuid.',
    },
    heroImage:
      '/images/arnhem/john-frostbrug-luchtfoto.jpg',
    galleryImages: [
      '/images/arnhem/rijnkade-schemering.jpg',
    ],
    articleTags: ['meinerswijk', 'gelredome', 'kronenburg', 'stadsblokken', 'korenmaat', 'asm haven', 'cirque de la liberte'],
  },
];

// Helper functions for easy querying
export function getAllDistricts(): District[] {
  return DISTRICTS;
}

export function getDistrictBySlug(slug: string): District | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  return DISTRICTS.find((d) => d.slug === cleanSlug || d.id === cleanSlug);
}

export function getDistrictById(id: string): District | undefined {
  if (!id) return undefined;
  const cleanId = id.toLowerCase().trim();
  return DISTRICTS.find((d) => d.id === cleanId || d.slug === cleanId);
}

export function getFeaturedDistricts(): District[] {
  // Return the most popular/iconic 4 districts for quick carousel/features
  return DISTRICTS.filter((d) =>
    ['centrum', 'modekwartier', 'sonsbeek', 'spijkerkwartier'].includes(d.slug)
  );
}
