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
      'M 365.0,308.0 L 370.0,255.0 L 430.0,245.0 L 490.0,255.0 L 505.6,363.1 L 454.7,343.9 L 404.4,313.4 Z',
    centerPoint: { x: 435, y: 300 },
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
      'M 505.6,363.1 L 490.0,255.0 L 640.0,265.0 L 640.0,340.0 L 540.0,386.0 Z',
    centerPoint: { x: 565, y: 320 },
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
      'M 490.0,255.0 L 640.0,265.0 L 655.0,195.0 L 565.0,195.0 L 525.0,225.0 Z',
    centerPoint: { x: 575, y: 235 },
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
      'M 260.4,215.2 L 274.4,213.2 L 356.0,166.6 L 408.2,146.0 L 422.5,144.5 L 430.0,245.0 L 370.0,255.0 L 358.9,254.5 L 311.5,241.1 L 260.4,215.2 Z M 422.5,144.5 L 463.1,136.8 L 518.5,132.7 L 536.8,179.7 L 546.9,205.2 L 565.0,195.0 L 525.0,225.0 L 490.0,255.0 L 430.0,245.0 L 422.5,144.5 Z',
    centerPoint: { x: 445, y: 195 },
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
      'M 311.5,241.1 L 358.9,254.5 L 370.0,255.0 L 365.0,308.0 L 332.8,310.0 L 310.0,320.0 L 280.0,332.0 L 251.0,340.0 L 218.6,343.7 L 228.9,338.8 L 231.1,330.3 L 240.1,327.4 L 233.1,300.8 L 214.7,292.7 L 223.5,252.3 L 210.7,251.4 L 217.3,219.7 L 260.4,215.2 Z M 358.9,254.5 L 304.5,266.4 L 298.2,273.6 L 296.9,305.6 L 332.8,310.0 L 365.0,308.0 Z',
    centerPoint: { x: 295, y: 285 },
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
    centerPoint: { x: 430, y: 85 },
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
      'M 540.0,386.0 L 593.0,399.4 L 616.0,410.7 L 633.6,429.2 L 648.7,463.6 L 664.2,483.5 L 693.7,504.7 L 735.8,528.0 L 766.8,544.2 L 735.8,506.2 L 731.2,473.0 L 737.5,451.8 L 748.9,434.2 L 790.7,399.9 L 712.0,341.8 L 685.3,329.6 L 640.0,340.0 L 540.0,386.0 Z M 640.0,265.0 L 640.0,340.0 L 685.3,329.6 L 688.1,275.3 L 640.0,265.0 Z M 640.0,265.0 L 655.0,195.0 L 745.9,204.4 L 765.0,233.0 L 688.1,275.3 L 640.0,265.0 Z M 565.0,195.0 L 518.5,132.7 L 576.0,123.8 L 707.4,114.6 L 730.3,159.0 L 745.9,204.4 L 655.0,195.0 L 565.0,195.0 Z M 745.9,204.4 L 765.0,233.0 L 877.7,299.4 L 974.4,364.4 L 843.7,381.3 L 790.7,399.9 L 748.9,434.2 L 712.0,341.8 L 685.3,329.6 L 688.1,275.3 L 745.9,204.4 Z',
    centerPoint: { x: 755, y: 300 },
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
      'M 472.5,432.4 L 446.9,458.4 L 420.3,476.8 L 394.5,462.1 L 351.2,451.6 L 327.1,449.3 L 309.7,453.7 L 287.6,439.6 L 259.3,440.5 L 243.8,436.1 L 202.6,441.1 L 159.2,437.9 L 160.0,382.0 L 218.6,373.7 L 251.0,370.0 L 280.0,362.0 L 310.0,350.0 L 332.8,340.0 L 348.0,337.0 L 350.7,338.5 L 377.7,337.3 L 404.4,343.4 L 419.1,350.4 L 454.7,373.9 L 505.6,393.1 L 472.5,432.4 Z M 631.0,498.2 L 626.3,500.3 L 625.2,519.4 L 608.8,522.4 L 595.7,502.8 L 522.7,459.5 L 468.6,436.7 L 505.6,393.1 L 539.3,416.1 L 593.0,429.4 L 616.0,440.7 L 633.6,459.2 L 648.7,493.6 L 631.0,498.2 Z M 583.3,498.3 L 600.0,506.3 L 608.8,522.4 L 625.2,519.4 L 623.2,542.5 L 612.7,562.2 L 595.9,558.5 L 568.3,560.8 L 567.6,521.8 L 506.0,518.2 L 480.9,512.9 L 420.3,476.8 L 437.3,466.5 L 468.6,436.7 L 522.7,459.5 L 583.3,498.3 Z M 568.0,540.9 L 568.3,560.8 L 527.5,567.0 L 521.6,576.0 L 505.1,585.7 L 502.7,595.4 L 443.4,581.8 L 424.7,572.9 L 383.7,541.5 L 368.8,509.4 L 420.3,476.8 L 480.9,512.9 L 506.0,518.2 L 567.6,521.8 L 568.0,540.9 Z M 330.4,449.2 L 389.4,460.4 L 420.3,476.8 L 332.5,531.2 L 318.1,545.4 L 311.3,562.3 L 302.5,561.7 L 244.3,541.1 L 295.6,464.7 L 311.1,453.1 L 330.4,449.2 Z M 261.5,440.6 L 291.9,440.4 L 309.7,453.7 L 290.7,470.4 L 244.3,541.1 L 200.0,532.7 L 149.5,535.0 L 145.9,475.3 L 159.2,437.9 L 202.6,441.1 L 243.8,436.1 L 261.5,440.6 Z M 310.1,617.6 L 308.5,646.1 L 293.1,635.0 L 269.6,627.1 L 155.6,609.9 L 149.5,535.0 L 220.0,534.8 L 295.1,560.2 L 311.3,562.3 L 310.1,617.6 Z M 465.8,661.1 L 449.2,682.3 L 394.1,666.8 L 364.8,664.2 L 347.1,655.2 L 308.5,646.1 L 314.3,552.1 L 328.6,534.2 L 368.8,509.4 L 383.7,541.5 L 424.7,572.9 L 443.4,581.8 L 513.5,599.7 L 465.8,661.1 Z M 147.1,505.1 L 155.6,609.9 L 141.0,606.9 L 136.9,617.9 L 62.9,609.7 L 62.8,602.6 L 18.8,602.4 L 11.6,569.0 L 26.3,530.6 L 26.4,509.8 L 19.6,509.2 L 14.3,493.8 L 42.1,480.6 L 49.0,470.5 L 53.6,455.4 L 49.8,424.0 L 54.7,423.7 L 49.4,405.1 L 101.3,412.2 L 162.8,430.5 L 147.2,467.6 L 147.1,505.1 Z',
    centerPoint: { x: 348, y: 505 },
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
