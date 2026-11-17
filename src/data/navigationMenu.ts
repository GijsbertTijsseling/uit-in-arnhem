export interface SubmenuItem {
  label: string;
  href: string;
  badge?: string;
}

export interface SubmenuColumn {
  title: string;
  items: SubmenuItem[];
}

export interface NavMenuSection {
  label: string;
  href: string;
  description?: string;
  columns?: SubmenuColumn[];
  featuredCta?: {
    title: string;
    description: string;
    href: string;
    buttonText: string;
    imageUrl?: string;
  };
}

export const NAVIGATION_MENU: NavMenuSection[] = [
  {
    label: 'Uitagenda',
    href: '/agenda',
    description: 'Alles wat er vandaag, morgen en dit weekend te beleven is in Arnhem.',
    columns: [
      {
        title: 'Wanneer',
        items: [
          { label: 'Volledige agenda', href: '/agenda' },
          { label: 'Vandaag in Arnhem', href: '/agenda?filter=vandaag' },
          { label: 'Morgen te doen', href: '/agenda?filter=morgen' },
          { label: 'Dit weekend in Arnhem', href: '/agenda?filter=weekend', badge: 'Populair' },
          { label: 'Deze week', href: '/agenda?filter=this_week' },
        ],
      },
      {
        title: 'Genres & Podia',
        items: [
          { label: 'Concerten & Live muziek', href: '/agenda?category=muziek' },
          { label: 'Theater & Dans', href: '/agenda?category=theater-dans' },
          { label: 'Exposities & Musea', href: '/agenda?category=kunst-expo' },
          { label: 'Film & Cinema', href: '/agenda?category=film' },
          { label: 'Festivals & Evenementen', href: '/agenda?category=festival' },
        ],
      },
      {
        title: 'Cultuurhuizen',
        items: [
          { label: 'Musis & Stadstheater', href: '/agenda?category=theater-dans' },
          { label: 'Luxor Live', href: '/agenda?category=muziek' },
          { label: 'Focus Filmtheater', href: '/agenda?category=film' },
          { label: 'Theater aan de Rijn', href: '/agenda?category=theater-dans' },
          { label: 'Museum Arnhem', href: '/agenda?category=kunst-expo' },
        ],
      },
      {
        title: 'Zelf Meedoen',
        items: [
          { label: 'Gratis uitjes in Arnhem', href: '/artikelen?tag=gratis' },
          { label: 'Uitjes met kinderen', href: '/artikelen?tag=kinderen' },
          { label: 'Redactietips van de week', href: '/agenda?filter=weekend' },
          { label: 'Evenement aanmelden', href: '/admin/agenda/new', badge: 'Gratis' },
        ],
      },
    ],
    featuredCta: {
      title: 'Zelf iets organiseren?',
      description: 'Meld je concert, voorstelling, expo of workshop gratis aan voor onze culturele uitagenda.',
      href: '/admin/agenda/new',
      buttonText: 'Evenement insturen',
      imageUrl: 'https://uitinarnhem.nl/wp-content/uploads/2026/11/55002413960_8f66c3aa22_o-2-1.jpg',
    },
  },
  {
    label: 'Zien en doen',
    href: '/zien-en-doen',
    description: 'Ontdek winkels, culinaire adresjes, musea, parken en de leukste wijken van Arnhem.',
    columns: [
      {
        title: 'Shoppen & Mode',
        items: [
          { label: 'Winkelaanbod in de binnenstad', href: '/zien-en-doen' },
          { label: 'De 7straatjes boetieks', href: '/artikelen?tag=7straatjes' },
          { label: 'Modekwartier Klarendal', href: '/artikelen?tag=modekwartier' },
          { label: 'Markten in Arnhem (vrij/za)', href: '/artikelen?tag=markt' },
          { label: 'Vintage & Conceptstores', href: '/artikelen?category=winkelen' },
        ],
      },
      {
        title: 'Eten en drinken',
        items: [
          { label: '10x Koffiebars in Arnhem', href: '/artikelen?category=eten-drinken' },
          { label: 'Lunchen & Brunchen', href: '/artikelen?category=eten-drinken' },
          { label: 'Diner & Restaurants', href: '/artikelen?category=eten-drinken' },
          { label: 'Zomerse terrassen aan de Rijn', href: '/artikelen?tag=rijnkade' },
          { label: 'Borrel & Cafés op de Korenmarkt', href: '/artikelen?category=eten-drinken' },
        ],
      },
      {
        title: 'Cultuur & Historie',
        items: [
          { label: 'Musea & Kunst (Museum Arnhem)', href: '/agenda?category=kunst-expo' },
          { label: 'Slag om Arnhem & John Frostbrug', href: '/artikelen?category=cultuur' },
          { label: 'Kastelen & Bronbeek', href: '/artikelen?category=cultuur' },
          { label: 'Rozet Cultuurhuis', href: '/artikelen?category=cultuur' },
          { label: 'Introdans & Oostpool', href: '/agenda?category=theater-dans' },
        ],
      },
      {
        title: 'Activiteiten & Natuur',
        items: [
          { label: 'Wat te doen in Arnhem? (Gids)', href: '/zien-en-doen' },
          { label: '10x Gratis dingen om te doen', href: '/artikelen?tag=gratis' },
          { label: 'Wat te doen met kinderen', href: '/artikelen?tag=kinderen' },
          { label: 'Wandelen in Park Sonsbeek', href: '/artikelen?tag=sonsbeek' },
          { label: 'Fietsen op de Veluwezoom', href: '/plan-je-bezoek' },
        ],
      },
      {
        title: 'Wijken van Arnhem',
        items: [
          { label: 'Modekwartier (Klarendal)', href: '/artikelen?tag=modekwartier' },
          { label: 'De 7straatjes (Centrum)', href: '/artikelen?tag=7straatjes' },
          { label: 'Park Sonsbeek & Villa', href: '/artikelen?tag=sonsbeek' },
          { label: 'De Rijnkade & Stadsblokken', href: '/artikelen?tag=rijnkade' },
          { label: 'Spijkerkwartier', href: '/artikelen?category=ontdekken' },
        ],
      },
    ],
    featuredCta: {
      title: 'Topgids door Arnhem',
      description: 'Van zwoele terrassen aan het water tot wandelingen door het groenste park van Nederland.',
      href: '/zien-en-doen',
      buttonText: 'Ontdek alle tips',
      imageUrl: 'https://uitinarnhem.nl/wp-content/uploads/2020/08/Sonsbeekmarkt.jpg',
    },
  },
  {
    label: 'Plan je bezoek',
    href: '/plan-je-bezoek',
    description: 'Praktische info over bereikbaarheid, parkeren, trolleybussen en overnachten.',
    columns: [
      {
        title: 'Bereikbaarheid',
        items: [
          { label: 'Met de trein naar Arnhem Centraal', href: '/plan-je-bezoek' },
          { label: 'Parkeren & Parkeergarages', href: '/plan-je-bezoek' },
          { label: 'P+R GelreDome', href: '/plan-je-bezoek' },
          { label: 'De Arnhemse Trolleybus', href: '/plan-je-bezoek' },
          { label: 'OV-Fiets & fietshuur', href: '/plan-je-bezoek' },
        ],
      },
      {
        title: 'Overnachten',
        items: [
          { label: 'Hotels in de binnenstad', href: '/plan-je-bezoek' },
          { label: 'B&Bs in het Modekwartier', href: '/plan-je-bezoek' },
          { label: 'Slapen aan de Rijn', href: '/plan-je-bezoek' },
          { label: 'Weekendje Arnhem plannen', href: '/plan-je-bezoek' },
        ],
      },
      {
        title: 'Toeristische Info',
        items: [
          { label: 'Bezoekerscentrum Rozet (VVV)', href: '/plan-je-bezoek' },
          { label: 'Stadsplattegrond & wandelgidsen', href: '/plan-je-bezoek' },
          { label: 'Openbaar toilet & toegankelijkheid', href: '/plan-je-bezoek' },
          { label: 'Contact met de stad', href: '/contact' },
        ],
      },
    ],
    featuredCta: {
      title: 'Dagje of weekend Arnhem?',
      description: 'Bekijk praktische reisinformatie, parkeertips en de beste slaapplekken in de stad.',
      href: '/plan-je-bezoek',
      buttonText: 'Plan je reis',
      imageUrl: '/images/bridge_uiterwaarden.jpg',
    },
  },
  {
    label: 'Nieuws',
    href: '/artikelen',
    description: 'Verhalen, achtergronden, interviews en cultureel nieuws uit Arnhem.',
    columns: [
      {
        title: 'Rubrieken',
        items: [
          { label: 'Alle artikelen & verhalen', href: '/artikelen' },
          { label: 'Eten & Drinken recensies', href: '/artikelen?category=eten-drinken' },
          { label: 'Kunst, Theater & Muziek', href: '/artikelen?category=cultuur' },
          { label: 'Nieuwe hotspots in Arnhem', href: '/artikelen?category=ontdekken' },
          { label: 'Lijstjes & weekendtips', href: '/artikelen?category=tips' },
        ],
      },
      {
        title: 'Interviews & Verhalen',
        items: [
          { label: 'Arnhemse ondernemers', href: '/artikelen?category=cultuur' },
          { label: 'Vrijwilligers in the spotlight', href: '/artikelen' },
          { label: 'Dansers & muzikanten', href: '/artikelen?category=cultuur' },
          { label: 'Stadsgidsen & wandelaars', href: '/artikelen?category=ontdekken' },
        ],
      },
      {
        title: 'Dossiers',
        items: [
          { label: '3FM Serious Request Glazen Huis', href: '/artikelen/14382', badge: 'Uitgelicht' },
          { label: 'Arnhemse Stadsprijs', href: '/artikelen' },
          { label: 'Culturele Seizoensopening', href: '/artikelen?category=cultuur' },
        ],
      },
    ],
    featuredCta: {
      title: 'Het Glazen Huis naar Arnhem!',
      description: '3FM Serious Request strijkt dit jaar neer in Arnhem voor de Nederlandse Brandwonden Stichting.',
      href: '/artikelen/14382',
      buttonText: 'Lees het verhaal',
      imageUrl: 'https://uitinarnhem.nl/wp-content/uploads/2026/11/55002413960_8f66c3aa22_o-2-1.jpg',
    },
  },
  {
    label: 'Over ons',
    href: '/over-ons',
    description: 'Over Stichting Uit in Arnhem, onze redactie, adverteren en missie.',
    columns: [
      {
        title: 'Over het platform',
        items: [
          { label: 'Over Uit in Arnhem', href: '/over-ons' },
          { label: 'Onze missie & onafhankelijkheid', href: '/over-ons#missie' },
          { label: 'Redactie & medewerkers', href: '/over-ons#team' },
        ],
      },
      {
        title: 'Samenwerken',
        items: [
          { label: 'Adverteren & Partnerschappen', href: '/contact' },
          { label: 'Zelf evenement insturen', href: '/admin/agenda/new' },
          { label: 'Tip de redactie', href: '/contact' },
        ],
      },
      {
        title: 'Colofon',
        items: [
          { label: 'Contactgegevens', href: '/contact' },
          { label: 'Privacybeleid & Cookies', href: '/over-ons#privacy' },
          { label: 'Redactie inloggen (CMS)', href: '/admin' },
        ],
      },
    ],
    featuredCta: {
      title: 'Voor en door Arnhemmers',
      description: 'Uit in Arnhem is hét onafhankelijke platform voor cultuur, horeca en verhalen uit de Rijnstad.',
      href: '/over-ons',
      buttonText: 'Lees meer over ons',
      imageUrl: 'https://uitinarnhem.nl/wp-content/uploads/2024/05/Street-Art-Tour-20230804_105441-scaled.jpg',
    },
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Stel een vraag, meld een culturele tip of neem contact op met onze redactie.',
    columns: [
      {
        title: 'Direct contact',
        items: [
          { label: 'Contactformulier', href: '/contact' },
          { label: 'E-mail: info@uitinarnhem.nl', href: 'mailto:info@uitinarnhem.nl' },
          { label: 'Tip de redactie', href: '/contact' },
        ],
      },
      {
        title: 'Evenementen & Pers',
        items: [
          { label: 'Gratis evenement aanmelden', href: '/admin/agenda/new' },
          { label: 'Persberichten insturen', href: '/contact' },
          { label: 'Adverteren & Partners', href: '/contact' },
        ],
      },
      {
        title: 'Social Media',
        items: [
          { label: 'Instagram (@uitinarnhem)', href: 'https://instagram.com' },
          { label: 'TikTok', href: 'https://tiktok.com' },
          { label: 'Facebook', href: 'https://facebook.com' },
        ],
      },
    ],
    featuredCta: {
      title: 'Heb je een gouden tip?',
      description: 'Ken je een nieuwe hotspot, bijzonder concert of cultureel initiatief? Tip onze redactie!',
      href: '/contact',
      buttonText: 'Stuur ons een bericht',
      imageUrl: 'https://uitinarnhem.nl/wp-content/uploads/2024/01/juune1-c-jonas-de-witte-vierkant-2959072273_2734816142.jpg',
    },
  },
];
