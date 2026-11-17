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

export const RHINE_RIVER: RiverData = {
  name: 'Nederrijn',
  path: 'M 25,412 C 160,402 320,398 430,404 C 505,412 640,416 895,415 L 895,442 C 640,446 505,442 420,434 C 300,430 160,434 25,442 Z',
  labelPoint: { x: 670, y: 432 },
  bridges: [
    {
      name: 'Spoorbrug Arnhem',
      x1: 270,
      y1: 400,
      x2: 270,
      y2: 432,
      year: '1879 / 1952',
    },
    {
      name: 'Nelson Mandelabrug',
      x1: 360,
      y1: 398,
      x2: 360,
      y2: 431,
      year: '1977',
    },
    {
      name: 'John Frostbrug',
      x1: 505,
      y1: 412,
      x2: 505,
      y2: 442,
      year: '1935 / 1950',
    },
    {
      name: 'Andrej Sacharovbrug',
      x1: 760,
      y1: 416,
      x2: 760,
      y2: 446,
      year: '1987',
    },
  ],
};

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
      'M 320,340 L 380,335 L 440,330 L 470,332 L 490,370 L 505,412 L 430,404 L 360,398 L 320,398 L 310,370 Z',
    centerPoint: { x: 410, y: 370 },
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
      'M 470,332 L 520,335 L 625,335 L 635,375 L 640,416 L 570,414 L 505,412 L 490,370 Z',
    centerPoint: { x: 555, y: 375 },
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
      'M 450,205 L 530,205 L 640,220 L 665,280 L 625,335 L 520,335 L 440,330 L 465,270 Z',
    centerPoint: { x: 535, y: 270 },
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
      'M 210,200 L 380,195 L 450,205 L 465,270 L 440,330 L 380,335 L 320,340 L 250,290 Z',
    centerPoint: { x: 330, y: 265 },
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
      'M 140,110 L 210,200 L 250,290 L 320,340 L 310,370 L 320,398 L 230,402 L 120,406 L 30,412 L 45,320 L 75,220 Z',
    centerPoint: { x: 180, y: 310 },
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
      'M 140,110 L 320,35 L 530,25 L 740,40 L 850,95 L 830,185 L 750,225 L 640,220 L 530,205 L 380,195 L 210,200 Z',
    centerPoint: { x: 480, y: 115 },
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
      'M 640,220 L 750,225 L 830,185 L 850,95 L 890,130 L 895,260 L 890,415 L 760,416 L 640,416 L 635,375 L 625,335 L 665,280 Z',
    centerPoint: { x: 755, y: 320 },
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
      'M 30,442 L 180,434 L 300,430 L 420,434 L 505,442 L 640,446 L 760,446 L 890,442 L 880,530 L 830,610 L 660,630 L 450,635 L 240,625 L 70,610 L 40,520 Z',
    centerPoint: { x: 460, y: 535 },
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
