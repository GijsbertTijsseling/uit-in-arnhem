import { Article, AgendaItem } from '@/types';

// Helper to generate dynamic dates relative to current date
const now = new Date();
const addDays = (days: number, hour = 20, min = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'de-beste-koffiebars-in-het-modekwartier',
    title: 'De 6 fijnste koffiebars & verborgen terrassen in het Modekwartier',
    excerpt: 'Van specialty coffee bij Stella by Starlight tot homemade cinnamon buns in Klarendal: ontdek de ultieme cafeïne-hotspots van Arnhem.',
    content: `Het Modekwartier in Klarendal bruist als nooit tevoren. Tussen de ateliers van lokale ontwerpers, vintage boetieks en ambachtelijke ateliers vind je enkele van de meest sfeervolle koffieplekken van Arnhem.

### 1. Stella by Starlight
Een creatieve huiskamer aan het Sonsbeekplein waar vintage meubels en specialty coffee elkaar ontmoeten. Bestel een flat white met havermelk en geniet van de ontspannen jazz op de achtergrond.
*Adres: Coehoornstraat 33, Arnhem*

### 2. Koffie & Kunst in Klarendal
In het hart van de wijk vind je deze lichte espressobar. De bonen worden wekelijks lokaal gebrand in Oost-Nederland en de appeltaart wordt gebakken volgens familierecept.
*Adres: Sonsbeeksingel 104, Arnhem*

### 3. Caspar
Dé favoriete ontmoetingsplek voor creatieven uit de wijk. Naast uitstekende filterkoffie serveren ze hier een wisselende seizoenslunch en lokale bieren van Durs en Katjelam.
*Adres: Elspeterstraat 1, Arnhem*

### 4. Momento aan de Rijn
Zit je liever met uitzicht op het water? Momento combineert een minimalistisch Scandinavisch interieur met biologische bonen en versgebakken zuurdesem toasts.
*Adres: Oude Oeverstraat 120, Arnhem*`,
    featured_image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    ],
    author_name: 'Sanne van den Berg',
    category: 'eten-drinken',
    tags: ['Koffie', 'Modekwartier', 'Hotspots', 'Ontbijt'],
    status: 'published',
    is_featured: true,
    layout_template: 'listicle',
    cta_block: {
      heading: 'Zelf een unieke koffiehotspot ontdekt?',
      description: 'Tip de redactie van Uit in Arnhem en deel je favoriete parel met tienduizenden stadsgenoten.',
      button_label: 'Tip de redactie',
      button_url: '/over-ons#contact',
    },
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'art-2',
    slug: 'museum-arnhem-kunst-uitzicht-rijn',
    title: 'Museum Arnhem: Hedendaags realisme met panoramisch uitzicht over de Rijn',
    excerpt: 'Na de spectaculaire vernieuwing en de uitkragende vleugel zwevend over de stuwwal is Museum Arnhem dé cultuurparel die je gezien moet hebben.',
    content: `Hoog boven de Rijn torent Museum Arnhem uit. De nieuwe vleugel steekt maar liefst vijftien meter uit over de glooiende morenewal, waardoor je tijdens het bewonderen van magisch-realistische meesterwerken uitkijkt over de uiterwaarden van de rivier.

### Een dialoog tussen heden en verleden
De collectie staat bekend om haar sterke focus op hedendaagse kunst, vrouwelijke kunstenaars en maatschappelijke vraagstukken. In de grote benedenzaal wisselen hedendaagse installaties elkaar af, terwijl in de historische koepel stilte heerst.

### De Beeldentuin
Vergeet na je museumbezoek niet een wandeling te maken door de gratis toegankelijke beeldentuin. Tussen eeuwenoude bomen vind je beelden van o.a. Henry Moore en geniet je op het terras van Café Pierre van verse citroen-meringuetaart.`,
    featured_image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Daan Meijer',
    category: 'cultuur',
    tags: ['Museum', 'Kunst', 'Architectuur', 'Rijn'],
    status: 'published',
    is_featured: true,
    layout_template: 'editorial_story',
    cta_block: {
      heading: 'Boek je tickets met tijdslot',
      description: 'Vermijd rijen in het weekend en reserveer direct je museumticket online.',
      button_label: 'Bekijk openingstijden & tickets',
      button_url: 'https://www.museumarnhem.nl',
    },
    published_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'art-3',
    slug: 'nachtleven-in-arnhem-willemeen-luxor-live',
    title: 'Nachtvlinders opgelet: De ultieme club- en concertgids voor Arnhem',
    excerpt: 'Van intieme kelderraves in Willemeen tot grootschalige clubnachten in Luxor Live: zo klinkt Arnhem na middernacht.',
    content: `Wie denkt dat Arnhem om 23:00 uur gaat slapen, heeft de kelder van Willemeen of de historische zaal van Luxor Live nog niet ontdekt.

De Arnhemse underground dance-scene is springlevend. Collectieven zoals Sound Architecture en Nachtparlement organiseren maandelijks avonden die tot ver in het oosten bekendstaan om hun warme sfeer en vooruitstrevende line-ups.

### Luxor Live
Gevestigd in een prachtig gerestaureerd monumentaal pand aan het Willemsplein. Met een vlijmscherp L-Acoustics soundsystem en clubavonden variërend van 80s & 90s tot diepe techno.

### Willemeen
Het oudste jongerencentrum van Nederland, maar nog altijd de meest dwarse en energieke underground venue van de stad. Van skate-punk tot electro-breakbeat.`,
    featured_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Lars Jansen',
    category: 'nachtleven',
    tags: ['Nachtleven', 'Luxor Live', 'Clubs', 'Concerten'],
    status: 'published',
    is_featured: false,
    layout_template: 'standard',
    published_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'art-4',
    slug: 'wandelen-door-sonsbeek-en-zijpendaal',
    title: 'De groene longen van Arnhem: Een wandelroute door Park Sonsbeek & Zypendaal',
    excerpt: 'Watervallen, een sprookjesachtige Witte Villa en glooiende weides. Arnhem is niet voor niets een van de groenste steden van Europa.',
    content: `Park Sonsbeek begint direct achter het Centraal Station en loopt naadloos over in de landgoederen Zypendaal en Gulden Bodem. Binnen vijf minuten wandelen stap je van het futuristische stationsplein in een romantisch Engels landschapspark met kabbelende beken en kletterende watervallen.

Maak een tussenstop bij het Nederlands Watermuseum of strijk neer bij De Boerderij voor een ambachtelijke pannenkoek met lokaal appelsap.`,
    featured_image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Eva Huisman',
    category: 'ontdekken',
    tags: ['Sonsbeek', 'Natuur', 'Wandelen', 'Parken'],
    status: 'published',
    is_featured: false,
    layout_template: 'visual_gallery',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    ],
    published_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'art-5',
    slug: 'vintage-en-design-shoppen-in-de-7straatjes',
    title: 'Scharnier van smaak: Vintage, vinyl en concept stores in de 7straatjes',
    excerpt: 'Vergeet de standaard winkelketens; in de 7straatjes van Arnhem vind je eigenzinnige boetieks en duurzame mode.',
    content: `De historische binnenstad herbergt met de 7straatjes (o.a. Arke Noachstraat, Kerkstraat, Eiland en Bentinckstraat) het meest karakteristieke winkelgebied.

Hier snuffel je tussen Japanse denim, vinylplaten, handgemaakte keramiek en Scandinavisch antiek. Tussendoor proef je ambachtelijke chocola of een glas natuurwijn.`,
    featured_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Sanne van den Berg',
    category: 'winkelen',
    tags: ['Shoppen', '7straatjes', 'Vintage', 'Mode'],
    status: 'published',
    is_featured: false,
    layout_template: 'standard',
    published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];

export const MOCK_EVENTS: AgendaItem[] = [
  {
    id: 'evt-1',
    slug: 'sonsbeek-openlucht-jazz-sessie',
    title: 'Sonsbeek Open Air Jazz & Soul Session',
    short_description: 'Live improvisaties en zwoele jazzklanken onder de monumentale bomen bij het Theekoepeltje.',
    full_description: `Komende zondag toveren getalenteerde musici van het ArtEZ Conservatorium het grasveld rondom het Theekoepeltje in Sonsbeek om tot een intieme openlucht jazzclub. 

Neem je eigen picknickkleed mee, haal een glas biologische cider bij de pop-up bar en geniet van originele composities, swingende standards en moderne neo-soul arrangementen. Toegang is gratis, donaties voor de muzikanten worden gewaardeerd!`,
    hero_image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    category: 'muziek',
    start_date: addDays(0, 16, 0), // Today
    end_date: addDays(0, 20, 0),
    venue_name: 'Park Sonsbeek (Theekoepel)',
    venue_address: 'Zypendaalseweg 24',
    venue_city: 'Arnhem',
    coordinates: { lat: 51.9882, lng: 5.9038 },
    price_type: 'free',
    price_from: 0,
    ticket_url: '',
    organizer_name: 'ArtEZ & Sonsbeek Cultuur',
    status: 'published',
    is_highlight: true,
  },
  {
    id: 'evt-2',
    slug: 'luxor-live-nachtparlement-techno',
    title: 'Nachtparlement: Deep Melodic & Groove Techno',
    short_description: 'De toonaangevende Arnhemse clubnacht keert terug naar de grote zaal van Luxor Live.',
    full_description: `Na twee uitverkochte edities is Nachtparlement terug in Luxor Live! Met een meeslepende lichtshow, lasers en hypnotiserende techno sets van toonaangevende artiesten uit binnen- en buitenland.

Line-up:
- Colyn (Afterlife)
- Laura van Hal (Resident)
- Jesse Maas

Deuren openen om 23:00 uur. Leeftijd 18+.`,
    hero_image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    category: 'muziek',
    start_date: addDays(1, 23, 0), // Tomorrow
    end_date: addDays(2, 5, 0),
    venue_name: 'Luxor Live',
    venue_address: 'Willemsplein 10',
    venue_city: 'Arnhem',
    coordinates: { lat: 51.9845, lng: 5.9012 },
    price_type: 'paid',
    price_from: 18.5,
    ticket_url: 'https://www.luxorlive.nl',
    organizer_name: 'Luxor Live',
    status: 'published',
    is_highlight: true,
  },
  {
    id: 'evt-3',
    slug: 'focus-filmtheater-open-air-cinema',
    title: 'Dakbioscoop: Klassiekers onder de sterrenhemel',
    short_description: 'Unieke filmvertoning op het panoramische dakterras van Focus Filmtheater aan het Audrey Hepburnplein.',
    full_description: `Elke zomeravond presenteert Focus Filmtheater speciale openluchtvertoningen op het dakterras. Met draadloze koptelefoons voor kristalhelder geluid geniet je van filmklassiekers en recente arthouse parels met uitzicht op de verlichte Eusebiuskerk.

Inclusief een welkomstdrankje van de bar. Bij slecht weer verhuist de vertoning naar de grote zaal.`,
    hero_image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    category: 'film',
    start_date: addDays(2, 21, 30), // This weekend
    end_date: addDays(2, 23, 45),
    venue_name: 'Focus Filmtheater',
    venue_address: 'Audrey Hepburnplein 1',
    venue_city: 'Arnhem',
    coordinates: { lat: 51.9806, lng: 5.9103 },
    price_type: 'paid',
    price_from: 12.5,
    ticket_url: 'https://www.focusfilmtheater.nl',
    organizer_name: 'Focus Filmtheater',
    status: 'published',
    is_highlight: true,
  },
  {
    id: 'evt-4',
    slug: 'musis-stadstheater-symfonieorkest',
    title: 'Phion Symfonieorkest: Klankwerelden van Mahler & Ravel',
    short_description: 'Een adembenemende avond in de Parkzaal van Musis met het gerenommeerde Phion orkest.',
    full_description: `De Parkzaal van Musis Stadstheater staat internationaal bekend om haar fenomenale akoestiek en de gigantische glazen achterwand die uitkijkt over het Musispark. Phion brengt onder leiding van gastdirigent Elena Schwarz een meeslepend programma met werken van Maurice Ravel en Gustav Mahler.`,
    hero_image_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    category: 'theater-dans',
    start_date: addDays(3, 20, 0),
    end_date: addDays(3, 22, 15),
    venue_name: 'Musis Stadstheater',
    venue_address: 'Velperbinnensingel 15',
    venue_city: 'Arnhem',
    coordinates: { lat: 51.9839, lng: 5.9142 },
    price_type: 'paid',
    price_from: 24.0,
    ticket_url: 'https://www.musisenstadstheater.nl',
    organizer_name: 'Musis & Stadstheater Arnhem',
    status: 'published',
    is_highlight: false,
  },
  {
    id: 'evt-5',
    slug: 'rijnkade-food-truck-festival-proef-arnhem',
    title: 'Proef de Rijn: Food Truck & Craft Beer Markt',
    short_description: 'Ruim 25 mobiele keukens, streekproducten uit Gelderland en live akoestische muziek aan de kade.',
    full_description: `Drie dagen lang verandert de Rijnkade in een bruisend foodfestival. Proef houtovenpizza's, verse oesters, veganistische taco's en bieren van lokale microbrouwerijen.

Er is een overdekte kinderhoek met circustheatershows en live sets van Arnhemse singer-songwriters tot zonsondergang.`,
    hero_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    category: 'eten-drinken-markten',
    start_date: addDays(5, 12, 0),
    end_date: addDays(7, 22, 0),
    venue_name: 'Lage Rijnkade',
    venue_address: 'Rijnkade 45',
    venue_city: 'Arnhem',
    coordinates: { lat: 51.9774, lng: 5.9118 },
    price_type: 'free',
    price_from: 0,
    ticket_url: '',
    organizer_name: 'Stichting Rijnkade Evenementen',
    status: 'published',
    is_highlight: true,
  },
  {
    id: 'evt-6',
    slug: 'mode-ontwerp-route-klarendal',
    title: 'Mode & Design Atelierroute Klarendal',
    short_description: 'Kijk achter de schermen bij meer dan 30 toonaangevende mode- en productontwerpers.',
    full_description: `Tijdens de halfjaarlijkse Atelierroute openen Arnhemse modeontwerpers, meubelmakers, juweliers en keramisten hun deuren voor het publiek. Wandel van studio naar studio, bekijk unieke collecties en ontmoet de makers persoonlijk.`,
    hero_image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    category: 'kunst-expo',
    start_date: addDays(6, 11, 0),
    end_date: addDays(6, 17, 30),
    venue_name: 'Modekwartier Arnhem',
    venue_address: 'Klarendalseweg 130',
    venue_city: 'Arnhem',
    coordinates: { lat: 51.9895, lng: 5.9182 },
    price_type: 'free',
    price_from: 0,
    ticket_url: '',
    organizer_name: 'DOCK Modekwartier',
    status: 'published',
    is_highlight: false,
  }
];

export const ARTICLE_CATEGORIES = [
  { id: 'all', label: 'Alles' },
  { id: 'eten-drinken', label: 'Eten & Drinken', description: 'Koffiebars, terrassen & restaurants' },
  { id: 'cultuur', label: 'Cultuur', description: 'Musea, theater & exposities' },
  { id: 'winkelen', label: 'Winkelen', description: 'Modekwartier & 7straatjes' },
  { id: 'ontdekken', label: 'Ontdekken', description: 'Sonsbeek & verborgen plekken' },
  { id: 'nachtleven', label: 'Nachtleven', description: 'Clubs, bars & concerten' },
];

export const EVENT_CATEGORIES = [
  { id: 'all', label: 'Alles' },
  { id: 'muziek', label: 'Muziek & Concerten' },
  { id: 'theater-dans', label: 'Theater & Dans' },
  { id: 'film', label: 'Film' },
  { id: 'festival', label: 'Festivals' },
  { id: 'kunst-expo', label: 'Kunst & Expo' },
  { id: 'eten-drinken-markten', label: 'Eten, Drinken & Markten' },
  { id: 'kinderen-familie', label: 'Familie & Kids' },
  { id: 'sport-outdoor', label: 'Sport & Buiten' },
];
