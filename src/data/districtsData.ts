export interface HighlightItem {
  name: string;
  category: 'eten-drinken' | 'cultuur' | 'winkelen' | 'natuur' | 'bezienswaardigheid' | 'actief';
  description: string;
  address?: string;
  image?: string;
  tip?: string;
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
  // Natural S-curve meander of the river flowing from east (Pleijroute)
  // past John Frostbrug, under Nelson Mandelabrug and Spoorbrug,
  // looping around Meinerswijk towards Klingelbeek/Oosterbeek in the west
  path: 'M -20,368 C 60,372 140,382 200,362 C 265,318 330,292 385,294 C 435,306 480,328 530,354 C 600,386 680,428 735,448 C 790,468 870,503 980,540 L 980,574 C 870,536 790,500 735,480 C 675,460 595,416 525,384 C 475,360 430,338 385,326 C 335,324 270,350 210,392 C 145,412 60,402 -20,398 Z',
  centerline: 'M -20,385 C 60,389 140,399 205,379 C 268,336 332,310 385,312 C 435,324 478,347 528,371 C 598,403 678,446 735,466 C 790,486 870,522 980,560',
  labelPoint: { x: 670, y: 442 },
  bridges: [
    {
      name: 'Spoorbrug Arnhem',
      x1: 334,
      y1: 345,
      x2: 340,
      y2: 295,
      year: '1879',
    },
    {
      name: 'Nelson Mandelabrug',
      x1: 382,
      y1: 348,
      x2: 388,
      y2: 295,
      year: '1977',
    },
    {
      name: 'John Frostbrug',
      x1: 490,
      y1: 385,
      x2: 504,
      y2: 332,
      year: '1944 Slag om Arnhem',
    },
    {
      name: 'Andrej Sacharovbrug (Pleijroute)',
      x1: 735,
      y1: 505,
      x2: 745,
      y2: 448,
      year: '1987',
    },
  ],
};

export const TOPOGRAPHY_PARKS: ParkFeature[] = [
  {
    name: 'Park Sonsbeek & Zypendaal',
    path: 'M 360,135 C 420,120 480,130 520,170 C 535,210 505,250 460,250 C 420,250 370,220 350,175 Z',
    labelPoint: { x: 440, y: 195 },
  },
  {
    name: 'Park Klarenbeek',
    path: 'M 535,160 C 565,145 610,150 625,185 C 620,210 580,215 550,200 Z',
    labelPoint: { x: 578, y: 182 },
  },
  {
    name: 'Park Angerenstein & Bronbeek',
    path: 'M 675,195 C 715,180 765,190 775,225 C 765,250 715,255 675,230 Z',
    labelPoint: { x: 724, y: 215 },
  },
  {
    name: 'Meinerswijk Uiterwaarden',
    path: 'M 190,360 C 240,340 310,360 320,400 C 310,430 250,420 200,410 Z',
    labelPoint: { x: 250, y: 395 },
  },
];

export const RAILWAY_TRACKS = [
  // West-East mainline (Utrecht -> Centraal -> Velperpoort -> Zutphen)
  'M -20,285 C 150,285 270,290 385,295 C 445,285 505,275 550,270 C 620,250 720,210 820,180',
  // East branch from Velperpoort towards Zevenaar
  'M 550,270 C 640,290 740,330 880,360',
  // South branch across Spoorbrug towards Nijmegen
  'M 385,295 C 360,298 337,310 337,340 C 337,420 330,550 330,700',
];

export const RAILWAY_STATIONS = [
  { name: 'Arnhem Centraal', x: 385, y: 295, labelAlign: 'top' as const },
  { name: 'Arnhem Velperpoort', x: 550, y: 270, labelAlign: 'top' as const },
  { name: 'Arnhem Zuid', x: 330, y: 560, labelAlign: 'right' as const },
];

export const TOPOGRAPHY_LANDMARKS: LandmarkFeature[] = [
  { name: 'Eusebiuskerk', category: 'monument', x: 450, y: 320, label: 'Eusebiuskerk' },
  { name: 'Arnhem Centraal', category: 'station', x: 385, y: 295, label: 'Centraal Station' },
  { name: 'Klarendalse Molen', category: 'monument', x: 580, y: 245, label: 'Molen De Kroon' },
  { name: 'Witte Villa', category: 'cultuur', x: 440, y: 220, label: 'Witte Villa' },
  { name: 'Museum Arnhem', category: 'cultuur', x: 295, y: 280, label: 'Museum Arnhem' },
  { name: 'Burgers\' Zoo', category: 'cultuur', x: 420, y: 95, label: 'Burgers\' Zoo' },
  { name: 'GelreDome', category: 'cultuur', x: 360, y: 490, label: 'GelreDome' },
];

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
      'M 407.6,286.6 L 409.2,284.3 L 424.2,285.3 L 456.2,289.7 L 456.0,292.2 L 507.9,285.4 L 515.6,296.1 L 529.7,302.4 L 542.6,323.1 L 540.8,339.5 L 542.8,345.4 L 536.4,348.9 L 516.5,373.7 L 455.4,350.7 L 412.7,322.5 L 395.1,314.1 L 363.0,306.8 L 330.6,308.2 L 327.4,299.2 L 309.2,301.2 L 365.6,285.6 L 372.3,284.9 L 378.8,287.2 L 378.2,282.4 L 407.6,286.6 Z',
    centerPoint: { x: 451, y: 310 },
    landmarkIcon: '⛪',
    landmarkLabel: 'Eusebiuskerk',
    highlights: [
      {
        name: 'Eusebiuskerk & Glazen Balkons',
        category: 'bezienswaardigheid',
        description:
          'Zweef in de panoramalift 73 meter omhoog en stap op de spectaculaire glazen balkons voor een 360° uitzicht over Arnhem en de Rijn.',
        address: 'Kerkplein 1',
        tip: 'Boek de torentour tijdens zonsondergang voor magisch licht.',
      },
      {
        name: 'De 7straatjes',
        category: 'winkelen',
        description:
          'Karakteristieke historische straatjes vol onafhankelijke boetieks, ateliers, concept stores en ambachtelijke bakkers.',
        address: 'Kerkstraat, Arke Noachstraat e.o.',
        tip: 'Bezoek hier unieke vintage mode en handgemaakte sieraden.',
      },
      {
        name: 'Rozet Cultuurhuis',
        category: 'cultuur',
        description:
          'Bekroond architectonisch icoon met de stadsbibliotheek, Erfgoedcentrum, kunstexposities en een prachtig dakterras.',
        address: 'Kortestraat 16',
        tip: 'Het dakterras is gratis toegankelijk met weids zicht op de binnenstad.',
      },
      {
        name: 'Korenmarkt & Jansplaats',
        category: 'eten-drinken',
        description:
          'Hét plein voor borrels, cafés en gastronomische ontdekkingen onder de platanen.',
        address: 'Korenmarkt / Jansplaats',
        tip: 'Perfect startpunt voor een gezellige avond uit.',
      },
      {
        name: 'Rijnkade Boulevard',
        category: 'eten-drinken',
        description:
          'Flaneren langs de kade met uitzicht op voorbijvarende schepen, de John Frostbrug en sfeervolle vis- en grillrestaurants.',
        address: 'Rijnkade',
        tip: 'In de zomer een geliefde plek voor diner aan het water.',
      },
    ],
    transportInfo: {
      ov: 'Station Arnhem Centraal ligt direct aan de rand van de binnenstad (3 minuten lopen). Vrijwel alle stads- en streekbussen stoppen bij Centraal of Willemsplein.',
      bike: 'Bewaakte gratis gemeentelijke fietsenstallingen bij Station Centraal, Rozet en Jansplein.',
      parking: 'Parkeergarages Centraal, Rozet, Musis en Langstraat liggen direct rond het voetgangersgebied.',
    },
    heroImage:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ],
    articleTags: ['centrum', 'binnenstad', 'shoppen', '7straatjes', 'eusebius', 'horeca'],
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
      'M 596.1,316.8 L 587.6,319.3 L 585.9,324.4 L 577.7,325.9 L 567.8,330.7 L 569.2,331.6 L 566.1,339.4 L 563.9,339.6 L 564.8,342.2 L 560.6,344.9 L 561.4,347.9 L 556.0,348.9 L 556.9,350.9 L 548.4,352.2 L 541.0,350.1 L 540.0,352.3 L 533.5,349.2 L 529.1,351.3 L 525.3,350.0 L 527.0,346.1 L 521.6,345.9 L 519.6,340.1 L 522.0,324.9 L 513.2,305.3 L 505.3,297.9 L 492.1,292.5 L 483.8,280.9 L 509.0,278.4 L 533.0,279.8 L 552.5,283.7 L 608.2,299.1 L 602.6,307.3 L 596.3,309.3 L 598.2,316.6 L 596.1,316.8 Z',
    centerPoint: { x: 547, y: 318 },
    landmarkIcon: '🌿',
    landmarkLabel: 'Stadstuinen',
    highlights: [
      {
        name: 'Verborgen Stadstuinen van Spijkerkwartier',
        category: 'natuur',
        description:
          'Een oase van rust midden in de stad: ontdek de Lommerrijke Tuin, Watertuin en Ecologische Tuin verscholen achter monumentale poorten.',
        address: 'Diverse ingangen rond Driekoningendwarsstraat',
        tip: 'Loop rustig door de poortjes; deze paradijsjes zijn overdag vrij toegankelijk.',
      },
      {
        name: 'Café Vrijdag',
        category: 'eten-drinken',
        description:
          'De ultieme ontmoetingsplek voor buurtbewoners met uitstekende koffie, huisgemaakte taarten en een zonovergoten hoekterras.',
        address: 'Velperbuitensingel 21a',
        tip: 'Probeer de seizoensgebonden lunchgerechten.',
      },
      {
        name: 'Thialf Wijkpark & Speeltuin',
        category: 'actief',
        description:
          'Het bruisende sociale hart van de buurt met terras, speelruimte en buurtevents.',
        address: 'Driekoningendwarsstraat 10',
      },
      {
        name: 'Steenstraat Speciaalzaken',
        category: 'winkelen',
        description:
          'Een levendige straat met internationale kruideniers, authentieke bakkers en vintage vinyl.',
        address: 'Steenstraat',
      },
    ],
    transportInfo: {
      ov: 'Op 5 minuten loopafstand van Station Arnhem Velperpoort en op 10 minuten van Centraal. Trolleybus 1 stopt bij de rand van de wijk.',
      bike: 'Uitstekende fietspaden via de Velperbuitensingel en Spoorwegstakingstraat.',
      parking: 'Betaald parkeren in de wijk of parkeergarage Musis nabij de singel.',
    },
    heroImage:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    ],
    articleTags: ['spijkerkwartier', 'stadstuinen', 'steenstraat', 'architectuur', 'koffie'],
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
      'M 640.4,237.1 L 639.2,238.6 L 636.3,237.1 L 633.7,240.0 L 636.5,245.6 L 624.9,247.9 L 624.9,251.4 L 618.4,255.2 L 619.3,257.4 L 611.9,259.4 L 611.1,257.9 L 607.5,258.6 L 601.6,261.4 L 602.8,262.9 L 597.6,266.2 L 592.4,265.5 L 589.8,267.6 L 591.0,270.0 L 587.6,273.4 L 588.5,274.4 L 559.0,290.9 L 558.3,292.5 L 561.6,295.4 L 556.5,296.7 L 559.9,299.9 L 553.4,303.0 L 527.0,296.8 L 501.4,294.9 L 502.2,283.3 L 506.5,272.9 L 536.2,231.4 L 563.8,224.3 L 607.5,223.3 L 638.4,233.0 L 637.0,234.8 L 640.4,237.1 Z',
    centerPoint: { x: 579, y: 263 },
    landmarkIcon: '✂️',
    landmarkLabel: 'Mode & Design',
    highlights: [
      {
        name: 'Klarendalseweg Ateliers',
        category: 'winkelen',
        description:
          'Wandel langs meer dan 50 designateliers, hoedenmakers, keramisten en modeontwerpers.',
        address: 'Klarendalseweg',
        tip: 'Kijk gerust naar binnen: veel ontwerpers tonen met plezier hun werkproces.',
      },
      {
        name: 'Restaurant Goed Proeven',
        category: 'eten-drinken',
        description:
          'Gevestigd in een voormalig kloosterpand: genieten van creatieve sharing gerechten en een sfeervolle binnentuin.',
        address: 'Klarendalseweg 536',
        tip: 'Reserveren voor het weekend is aan te raden!',
      },
      {
        name: 'Station Klarendal',
        category: 'eten-drinken',
        description:
          'Het iconische monumentale postkantoortje op het plein, nu een geliefd café voor lunch en borrels.',
        address: 'Klarendalseweg 193',
      },
      {
        name: 'Molen De Kroon',
        category: 'bezienswaardigheid',
        description:
          'Historische korenmolen uit 1849 die nog altijd meel maalt voor lokale bakkers.',
        address: 'Klarendalseweg 82',
      },
      {
        name: 'Sugar Hill',
        category: 'eten-drinken',
        description:
          'Arnhems icoon voor de allerbeste ambachtelijke burgers, natuurwijnen en huisgemaakte taarten.',
        address: 'Klarendalseweg 192',
      },
    ],
    transportInfo: {
      ov: 'Station Arnhem Velperpoort ligt aan de ingang van het Modekwartier (4 minuten lopen). Trolleybus 3 stopt bij halte Klarendalseweg.',
      bike: 'Vanaf Arnhem Centraal fiets je in circa 7 minuten naar het Modekwartier.',
      parking: 'Gratis parkeerterrein bij de wijk aan de Hommelseweg en parkeerplekken langs de wijkstraten.',
    },
    heroImage:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    ],
    articleTags: ['modekwartier', 'klarendal', 'design', 'ambacht', 'goedproeven', 'mode'],
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
      'M 549.4,218.6 L 554.4,218.9 L 554.6,224.8 L 565.5,225.1 L 567.2,233.2 L 546.1,238.7 L 523.2,270.6 L 519.3,287.5 L 498.4,289.5 L 481.3,263.7 L 493.1,235.0 L 509.0,232.3 L 527.4,236.5 L 536.0,230.4 L 537.4,219.6 L 544.5,216.6 L 549.4,218.6 Z M 534.2,186.9 L 532.1,191.3 L 546.9,205.2 L 550.2,219.0 L 544.5,216.6 L 537.4,219.6 L 536.0,230.4 L 527.4,236.5 L 509.0,232.3 L 493.1,235.0 L 498.0,226.1 L 479.1,210.8 L 478.4,193.9 L 440.7,200.0 L 437.8,171.7 L 423.8,153.5 L 422.5,144.5 L 463.1,136.8 L 518.5,132.7 L 514.5,143.1 L 536.8,179.7 L 534.2,186.9 Z M 437.3,184.5 L 440.7,200.0 L 478.4,193.9 L 479.1,210.8 L 498.0,226.1 L 481.2,263.2 L 498.4,289.5 L 455.2,295.2 L 455.3,293.1 L 428.7,289.4 L 401.0,288.4 L 411.2,275.9 L 351.7,251.8 L 311.5,241.1 L 260.4,215.2 L 274.4,213.2 L 356.0,166.6 L 408.2,146.0 L 422.5,144.5 L 423.8,153.5 L 437.8,171.7 L 437.3,184.5 Z',
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
        tip: 'Geniet hier op een zonnige zondagmiddag van een streekbiertje met uitzicht.',
      },
      {
        name: 'De Grote Waterval & Steile Tuin',
        category: 'natuur',
        description:
          'Romantische waterpartijen, rotstuinen en bloeiende terrassen ontworpen door landschapsarchitect Zocher.',
        address: 'Zijpendaalseweg',
      },
      {
        name: 'Nederlands Watermuseum',
        category: 'cultuur',
        description:
          'Interactief doe-museum over water in al haar facetten, gevestigd aan de Begijnebemden.',
        address: 'Zijpendaalseweg 26-27',
      },
      {
        name: 'Kasteel & Park Zypendaal',
        category: 'bezienswaardigheid',
        description:
          '18e-eeuws landhuis met slotgracht, omgeven door een oase van rust en eeuwenoude bomenlanen.',
        address: 'Zijpendaalseweg 44',
      },
      {
        name: 'De Boerderij Sonsbeek',
        category: 'eten-drinken',
        description:
          'Karakteristieke theetuin en restaurant aan de rand van de grote vijver met zwanen.',
        address: 'Parkweg 2',
      },
    ],
    transportInfo: {
      ov: 'Ligt direct achter Arnhem Centraal (Noordzijde uitgang Sonsbeekpark, 2 minuten lopen). Trolleybussen 3 en 8 stoppen bij de hoofdingangen.',
      bike: 'Uitgebreide fietsroutes door en langs de parken; fietsenstalling aan de noordzijde van het station.',
      parking: 'Parkeren kan langs de Zijpendaalseweg of in parkeergarage Centraal.',
    },
    heroImage:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    articleTags: ['sonsbeek', 'parken', 'zypendaal', 'wittevilla', 'natuur', 'wandelen'],
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
      'M 369.1,259.6 L 411.9,276.4 L 401.0,288.4 L 390.3,287.0 L 390.8,291.0 L 379.8,289.7 L 332.8,302.7 L 296.9,305.6 L 298.2,273.6 L 304.5,266.4 L 351.6,263.8 L 358.9,254.5 L 369.1,259.6 Z M 357.4,257.9 L 351.6,263.8 L 304.5,266.4 L 298.2,273.6 L 296.9,305.6 L 348.0,301.0 L 350.7,308.5 L 328.1,314.4 L 300.9,326.9 L 278.8,343.4 L 261.3,363.3 L 251.0,357.2 L 237.4,362.1 L 224.6,355.4 L 218.6,343.7 L 228.9,338.8 L 231.1,330.3 L 240.1,327.4 L 233.1,300.8 L 214.7,292.7 L 223.5,252.3 L 210.7,251.4 L 217.3,219.7 L 260.4,215.2 L 311.5,241.1 L 358.9,254.5 L 357.4,257.9 Z',
    centerPoint: { x: 300, y: 285 },
    landmarkIcon: '🏛️',
    landmarkLabel: 'Museum Arnhem',
    highlights: [
      {
        name: 'Museum Arnhem & Beeldentuin',
        category: 'cultuur',
        description:
          'Toonaangevend museum voor moderne en hedendaagse kunst met een glazen uitkijkpunt dat boven de rivier zweeft.',
        address: 'Utrechtseweg 87',
        tip: 'De gratis toegankelijke beeldentuin biedt een van de mooiste vergezichten van Nederland.',
      },
      {
        name: 'Landgoed Mariëndaal & De Groene Bedstee',
        category: 'natuur',
        description:
          'Historisch landgoed met de beroemde 300 meter lange beukenloofgang (De Groene Bedstee) en heuvelachtige wandelpaden.',
        address: 'Mariëndaal',
      },
      {
        name: 'Koffiecafé & Bakkershoek Meijer & Beijer',
        category: 'eten-drinken',
        description:
          'Gezellige ontmoetingsplek in Heijenoord voor specialty coffee, vers desembrood en heerlijke brunch.',
        address: 'Utrechtseweg 54',
      },
      {
        name: 'Airborne Herinneringen & Klingelbeek',
        category: 'bezienswaardigheid',
        description:
          'Historische routes langs de route van de Britse para’s in september 1944 richting de brug.',
        address: 'Utrechtseweg / Klingelbeekseweg',
      },
    ],
    transportInfo: {
      ov: 'Lijn 1, 51 en 352 stoppen direct voor Museum Arnhem. Vanaf Arnhem Centraal 12 minuten wandelen.',
      bike: 'Prachtige fietsroute langs de Utrechtseweg met uitzicht over de Rijn en Rosandepolder.',
      parking: 'Parkeren bij het museumterrein of in de omliggende groene lanen.',
    },
    heroImage:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=800&q=80',
    ],
    articleTags: ['arnhem-west', 'museum-arnhem', 'kunst', 'mariendaal', 'rijnzicht'],
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
    centerPoint: { x: 450, y: 95 },
    landmarkIcon: '🦁',
    landmarkLabel: "Burgers' Zoo & Openluchtmuseum",
    highlights: [
      {
        name: "Koninklijke Burgers' Zoo",
        category: 'cultuur',
        description:
          'Wereldberoemd ecodierenpark met overdekte werelden: Bush, Desert, Ocean, Mangrove en Safari.',
        address: 'Antoon van Hooffplein 1',
        tip: 'Neem ruim de tijd voor de Mangrove, het grootste overdekte mangrovegebied ter wereld.',
      },
      {
        name: 'Nederlands Openluchtmuseum',
        category: 'cultuur',
        description:
          'Wandel door eeuwen Nederlandse geschiedenis met authentieke molens, boerderijen, historische trams en de Canon van Nederland.',
        address: 'Hoeferlaan 4',
      },
      {
        name: 'Schaarsbergen Heide & Veluwezoom',
        category: 'natuur',
        description:
          'Eindeloze wandel- en mountainbikeroutes over glooiende heidevelden en door dichte loofbossen.',
        address: 'Schaarsbergen',
      },
      {
        name: 'Boerderij Meyendel & Pinetum',
        category: 'natuur',
        description:
          'Rustieke rustpunten voor een kop koffie of pannenkoek na een boswandeling.',
        address: 'Koningsweg',
      },
    ],
    transportInfo: {
      ov: 'Trolleybus 3 rijdt frequent vanaf Arnhem Centraal rechtstreeks naar Burgers’ Zoo en Openluchtmuseum.',
      bike: 'Gemarkeerde fietsknooppunten leiden direct vanuit het centrum de Veluwe op.',
      parking: 'Grote parkeerterreinen bij Burgers’ Zoo, Openluchtmuseum en Transferium Arnhem-Noord (A12).',
    },
    heroImage:
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    ],
    articleTags: ['arnhem-noord', 'veluwe', 'burgerszoo', 'openluchtmuseum', 'bossen'],
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
      'M 643.3,317.3 L 685.3,329.6 L 712.0,341.8 L 790.7,399.9 L 748.9,434.2 L 737.5,451.8 L 731.2,473.0 L 735.8,506.2 L 766.8,544.2 L 693.7,504.7 L 664.2,483.5 L 648.7,463.6 L 633.6,429.2 L 616.0,410.7 L 593.0,399.4 L 539.3,386.1 L 505.6,363.1 L 527.5,339.5 L 541.6,344.4 L 558.1,341.0 L 563.0,327.8 L 586.4,316.9 L 584.9,311.3 L 594.1,303.5 L 643.3,317.3 Z M 703.7,303.1 L 717.8,317.2 L 767.7,299.8 L 814.9,350.9 L 793.8,362.0 L 767.9,382.4 L 726.8,351.0 L 699.4,335.4 L 592.2,303.0 L 610.1,304.4 L 631.5,301.2 L 686.1,276.2 L 703.7,303.1 Z M 877.7,299.4 L 925.2,321.1 L 974.4,364.4 L 843.7,381.3 L 815.2,388.0 L 790.7,399.9 L 767.9,382.4 L 793.8,362.0 L 814.9,350.9 L 767.7,299.8 L 717.8,317.2 L 707.5,308.4 L 686.1,276.2 L 763.2,233.6 L 780.7,253.5 L 805.2,271.8 L 833.6,285.4 L 877.7,299.4 Z M 745.9,204.4 L 753.7,222.3 L 765.0,233.0 L 688.1,275.3 L 638.4,298.7 L 620.8,303.5 L 592.2,303.0 L 559.3,293.8 L 564.3,291.4 L 563.6,284.5 L 586.3,271.8 L 589.3,264.9 L 610.0,258.7 L 614.3,251.4 L 623.2,249.6 L 621.1,245.3 L 626.2,243.2 L 629.7,229.5 L 647.6,211.6 L 665.0,201.6 L 673.1,207.2 L 709.7,180.9 L 705.0,177.6 L 730.3,159.0 L 745.9,204.4 Z M 683.9,132.8 L 689.2,166.9 L 695.3,171.0 L 688.0,176.9 L 697.7,183.2 L 705.0,177.6 L 709.7,180.9 L 673.1,207.2 L 665.0,201.6 L 667.9,200.2 L 634.4,150.4 L 683.9,132.8 Z M 691.1,117.3 L 720.1,141.8 L 730.3,159.0 L 697.7,183.2 L 688.0,176.9 L 695.3,171.0 L 689.2,166.9 L 683.8,132.5 L 634.4,150.4 L 667.9,200.2 L 646.7,212.3 L 624.7,239.9 L 600.9,232.5 L 567.2,233.2 L 565.5,225.1 L 554.6,224.8 L 546.9,205.2 L 532.1,191.3 L 536.8,179.7 L 514.5,143.1 L 518.5,132.7 L 576.0,123.8 L 707.4,114.6 L 691.1,117.3 Z',
    centerPoint: { x: 676, y: 280 },
    landmarkIcon: '🎓',
    landmarkLabel: 'Park Presikhaaf & HAN',
    highlights: [
      {
        name: 'Park Presikhaaf & Stadsboerderij',
        category: 'natuur',
        description:
          'Groot stadspark met een prachtige heemtuin, theehuis, educatieve stadsboerderij en grote waterpartijen.',
        address: 'Ruitenberglaan 4',
        tip: 'Geweldige plek voor een picknick of ontspannen wandeling met kinderen.',
      },
      {
        name: 'Industriepark Kleefse Waard (IPKW)',
        category: 'cultuur',
        description:
          'Prijswinnende cleantech-campus op voormalig fabrieksterrein met evenementen, kunstinstallaties en Restaurant De Kookplaats.',
        address: 'Westervoortsedijk 73',
      },
      {
        name: 'HAN Campus Arnhem',
        category: 'cultuur',
        description:
          'Moderne onderwijscampus vol studenteninitiatieven, lezingen en creatieve festivals.',
        address: 'Ruitenberglaan 26',
      },
      {
        name: 'Winkelcentrum Presikhaaf',
        category: 'winkelen',
        description:
          'Groot overdekt winkelcentrum met een rijk aanbod aan verse streekproducten en internationale speciaalzaken.',
        address: 'Hanzestraat',
      },
    ],
    transportInfo: {
      ov: 'Eigen treinstation: Station Arnhem Presikhaaf. Trolleybussen 1, 5 en 6 verbinden het gebied snel met de binnenstad.',
      bike: 'Snelfietsroute over de Velperweg en Ruitenberglaan; ruime fietsenstallingen bij de stations en HAN.',
      parking: 'Ruime gratis parkeergelegenheid rondom Park Presikhaaf en Winkelcentrum Presikhaaf.',
    },
    heroImage:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    ],
    articleTags: ['arnhem-oost', 'presikhaaf', 'han', 'ipkw', 'parkpresikhaaf'],
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
      'M 472.5,422.4 L 446.9,448.4 L 420.3,466.8 L 394.5,452.1 L 351.2,441.6 L 327.1,439.3 L 309.7,443.7 L 287.6,429.6 L 259.3,430.5 L 243.8,426.1 L 202.6,431.1 L 159.2,427.9 L 162.8,420.5 L 193.7,422.3 L 228.5,412.7 L 300.9,346.9 L 332.8,332.9 L 365.1,326.9 L 406.1,334.0 L 454.7,363.9 L 505.6,383.1 L 472.5,422.4 Z M 631.0,488.2 L 626.3,490.3 L 625.2,509.4 L 608.8,512.4 L 595.7,492.8 L 522.7,449.5 L 468.6,426.7 L 505.6,383.1 L 539.3,406.1 L 595.6,420.3 L 619.8,433.6 L 634.4,450.5 L 648.7,483.6 L 631.0,488.2 Z M 583.3,488.3 L 600.0,496.3 L 608.8,512.4 L 625.2,509.4 L 623.2,532.5 L 612.7,552.2 L 595.9,548.5 L 568.3,550.8 L 567.6,511.8 L 506.0,508.2 L 480.9,502.9 L 420.3,466.8 L 437.3,456.5 L 468.6,426.7 L 522.7,449.5 L 583.3,488.3 Z M 568.0,530.9 L 568.3,550.8 L 527.5,557.0 L 521.6,566.0 L 505.1,575.7 L 502.7,585.4 L 443.4,571.8 L 424.7,562.9 L 383.7,531.5 L 368.8,499.4 L 420.3,466.8 L 480.9,502.9 L 506.0,508.2 L 567.6,511.8 L 568.0,530.9 Z M 330.4,439.2 L 389.4,450.4 L 420.3,466.8 L 332.5,521.2 L 318.1,535.4 L 311.3,552.3 L 302.5,551.7 L 244.3,531.1 L 295.6,454.7 L 311.1,443.1 L 330.4,439.2 Z M 261.5,430.6 L 291.9,430.4 L 309.7,443.7 L 290.7,460.4 L 244.3,531.1 L 200.0,522.7 L 149.5,525.0 L 145.9,465.3 L 159.2,427.9 L 202.6,431.1 L 243.8,426.1 L 261.5,430.6 Z M 310.1,607.6 L 308.5,636.1 L 293.1,625.0 L 269.6,617.1 L 155.6,599.9 L 149.5,525.0 L 220.0,524.8 L 295.1,550.2 L 311.3,552.3 L 310.1,607.6 Z M 465.8,651.1 L 449.2,672.3 L 394.1,656.8 L 364.8,654.2 L 347.1,645.2 L 308.5,636.1 L 314.3,542.1 L 328.6,524.2 L 368.8,499.4 L 383.7,531.5 L 424.7,562.9 L 443.4,571.8 L 513.5,589.7 L 465.8,651.1 Z M 147.1,495.1 L 155.6,599.9 L 141.0,596.9 L 136.9,607.9 L 62.9,599.7 L 62.8,592.6 L 18.8,592.4 L 11.6,559.0 L 26.3,520.6 L 26.4,499.8 L 19.6,499.2 L 14.3,483.8 L 42.1,470.6 L 49.0,460.5 L 53.6,445.4 L 49.8,414.0 L 54.7,413.7 L 49.4,395.1 L 101.3,402.2 L 162.8,420.5 L 147.2,457.6 L 147.1,495.1 Z',
    centerPoint: { x: 348.0, y: 504.0 },
    landmarkIcon: '🌾',
    landmarkLabel: 'Meinerswijk & GelreDome',
    highlights: [
      {
        name: 'Uiterwaardenpark Meinerswijk',
        category: 'natuur',
        description:
          'Struinen door 270 hectare ongerepte uiterwaarden, zandstranden aan de Rijn, konikpaarden, bevers en Galloway runderen.',
        address: 'Meinerswijk',
        tip: 'Struin buiten de gebaande paden langs de rivier voor ultieme rust en vergezichten op de Arnhemse skyline.',
      },
      {
        name: 'Castellum Meinerswijk',
        category: 'bezienswaardigheid',
        description:
          'Archeologisch monument van de Romeinse Limes (UNESCO Werelderfgoed) met gereconstrueerde muren en uitkijktoren.',
        address: 'M पं Meinerswijk',
      },
      {
        name: 'GelreDome Stadion',
        category: 'cultuur',
        description:
          'De multifunctionele evenementenarena van Vitesse, megaconcerten van wereldsterren en grote dance-events.',
        address: 'Batavierenweg 25',
      },
      {
        name: 'Winkelcentrum & Park Kronenburg',
        category: 'winkelen',
        description:
          'Het grootste overdekte winkelcentrum van Oost-Nederland met meer dan 100 winkels.',
        address: 'Kronenburgpassage',
      },
      {
        name: 'RijnWaalpad & Dijkfietspaden',
        category: 'actief',
        description:
          'Snelfietsroute richting Nijmegen over de schilderachtige Rijndijken.',
        address: 'Drielsedijk / Malburgse Bandijk',
      },
    ],
    transportInfo: {
      ov: 'Station Arnhem Zuid verzorgt snelle verbindingen richting Nijmegen en Zutphen. Trolleybus 7 en buslijnen verbinden alle wijken razendsnel met Arnhem Centraal.',
      bike: 'Via de Nelson Mandelabrug en John Frostbrug fiets je binnen 5-8 minuten van Zuid naar de Binnenstad.',
      parking: 'Zeer ruime parkeervoorzieningen bij GelreDome, Kronenburg en Transferium Arnhem-Zuid.',
    },
    heroImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
    articleTags: ['arnhem-zuid', 'meinerswijk', 'gelredome', 'uiterwaarden', 'kronenburg', 'limes'],
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
