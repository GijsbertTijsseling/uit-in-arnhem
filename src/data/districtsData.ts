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
  innerLines?: string[];
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
  // Curving, prominent river ribbon between northern and southern districts
  path:
    'M 40,360 C 160,355 240,330 330,312 C 380,302 440,302 490,320 C 560,345 640,390 730,425 C 800,450 860,470 930,480 L 930,515 C 860,505 800,485 730,460 C 640,425 560,380 490,355 C 440,338 380,338 330,348 C 240,366 160,391 40,396 Z',
  centerline: '',
  labelPoint: { x: 670, y: 442 },
  bridges: [
    {
      name: 'Spoorbrug Arnhem',
      x1: 326,
      y1: 311,
      x2: 326,
      y2: 350,
      year: '1879',
    },
    {
      name: 'Nelson Mandelabrug',
      x1: 390,
      y1: 302,
      x2: 390,
      y2: 340,
      year: '1977',
    },
    {
      name: 'John Frostbrug',
      x1: 495,
      y1: 321,
      x2: 495,
      y2: 357,
      year: '1944 Slag om Arnhem',
    },
    {
      name: 'Andrej Sacharovbrug (Pleijroute)',
      x1: 735,
      y1: 427,
      x2: 735,
      y2: 462,
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
      'M 350,265 L 510,265 L 510,323 C 460,303 400,303 350,314 Z',
    centerPoint: { x: 430, y: 288 },
    innerLines: ["M 430,265 L 430,306"],
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
      'M 510,275 L 675,275 L 675,345 L 510,345 Z',
    centerPoint: { x: 592, y: 310 },
    innerLines: ["M 595,275 L 595,345"],
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
      'M 510,175 L 675,180 L 675,275 L 510,275 Z',
    centerPoint: { x: 592, y: 225 },
    innerLines: ["M 590,178 L 590,275"],
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
      'M 260,165 L 510,175 L 510,265 L 350,265 L 350,215 L 260,215 Z',
    centerPoint: { x: 395, y: 215 },
    innerLines: ["M 430,173 L 425,265"],
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
      'M 90,165 L 260,165 L 260,215 L 350,215 L 350,314 C 270,332 180,358 40,360 L 90,165 Z',
    centerPoint: { x: 210, y: 275 },
    innerLines: ["M 175,165 L 175,355", "M 260,215 L 260,335"],
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
      'M 90,45 L 870,45 L 870,180 L 675,180 L 510,175 L 260,165 L 90,165 Z',
    centerPoint: { x: 480, y: 105 },
    innerLines: ["M 360,45 L 350,105 L 410,170", "M 620,45 L 610,115 L 590,177"],
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
      'M 675,180 L 870,180 L 925,480 C 860,470 800,450 730,425 C 640,390 560,345 500,323 L 510,345 L 675,345 L 675,275 L 675,180 Z',
    centerPoint: { x: 765, y: 295 },
    innerLines: ["M 770,180 L 770,435", "M 675,345 L 730,425"],
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
      'M 40,396 C 160,391 240,366 330,348 C 380,338 440,338 490,355 C 560,380 640,425 730,460 C 800,485 860,505 930,515 L 930,640 L 40,640 Z',
    centerPoint: { x: 480, y: 520 },
    innerLines: ["M 330,348 L 330,640", "M 640,425 L 640,640", "M 40,515 L 930,515"],
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
