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
          { label: 'Dit weekend in Arnhem', href: '/agenda?filter=weekend' },
          { label: 'Deze week', href: '/agenda?filter=this_week' },
        ],
      },
      {
        title: 'Genres',
        items: [
          { label: 'Concerten & Live muziek', href: '/agenda?category=muziek' },
          { label: 'Theater & Dans', href: '/agenda?category=theater-dans' },
          { label: 'Exposities & Musea', href: '/agenda?category=kunst-expo' },
          { label: 'Film in Focus Cinema', href: '/agenda?category=film' },
          { label: 'Festivals & Markten', href: '/agenda?category=festival' },
        ],
      },
      {
        title: 'Doen & Ontdekken',
        items: [
          { label: 'Vaste podia & locaties', href: '/locaties' },
          { label: '10x Gratis dingen om te doen', href: '/artikelen/gratis-dingen-doen-arnhem' },
          { label: 'Wat te doen met kinderen', href: '/artikelen/wat-te-doen-in-arnhem-met-kinderen-de-leukste-uitjes-voor-het-hele-gezin' },
          { label: 'Gratis evenement aanmelden', href: '/admin/agenda/new' },
        ],
      },
    ],
    featuredCta: {
      title: 'Zelf een evenement?',
      description: 'Meld je concert, expo, voorstelling of workshop gratis aan voor onze culturele uitagenda.',
      href: '/admin/agenda/new',
      buttonText: 'Evenement aanmelden',
      imageUrl: 'https://uitinarnhem.nl/wp-content/uploads/2026/11/55002413960_8f66c3aa22_o-2-1.jpg',
    },
  },
  {
    label: 'Zien en doen',
    href: '/zien-en-doen',
    description: 'Ontdek restaurants, boetieks, musea, parken en de leukste wijken van Arnhem.',
    columns: [
      {
        title: 'Eten en drinken',
        items: [
          { label: '5x Lekker uit eten in Arnhem', href: '/artikelen/5x-lekker-uit-eten-in-arnhem' },
          { label: 'Craft Coffee & Pastry Arnhem', href: '/artikelen/craft-coffee-pastry-arnhem-in-de-rij-voor-glutenvrij' },
          { label: 'Lunchen bij Ketelhuis Sonsbeek', href: '/artikelen/lunchen-bij-ketelhuis-sonsbeek' },
          { label: 'Hotspot La Colombe', href: '/artikelen/lacolombe' },
          { label: 'Alle horeca & hotspots', href: '/artikelen?category=eten-drinken' },
        ],
      },
      {
        title: 'Wijken van Arnhem',
        items: [
          { label: 'Alle wijken & interactieve kaart', href: '/wijken' },
          { label: 'Centrum & Binnenstad', href: '/wijken/centrum' },
          { label: 'Modekwartier & Klarendal', href: '/wijken/modekwartier' },
          { label: 'Spijkerkwartier', href: '/wijken/spijkerkwartier' },
          { label: 'Sonsbeek & Parken', href: '/wijken/sonsbeek' },
          { label: 'Arnhem-West & Museumkwartier', href: '/wijken/arnhem-west' },
        ],
      },
      {
        title: 'Cultuur & Historie',
        items: [
          { label: 'Bridge to Liberation (Slag om Arnhem)', href: '/artikelen/bridge-to-liberation-herdenking-slag-om-arnhem' },
          { label: 'Museum Bronbeek & Geschiedenis', href: '/artikelen/week-van-de-koloniale-geschiedenis-in-museum-bronbeek' },
          { label: 'Danser Hayden Idrus bij Introdans', href: '/artikelen/hayden-idrus-danser-bij-introdans-arnhem' },
          { label: 'Plekken van Lenneke Wispelwey', href: '/artikelen/de-6-favoriete-plekken-in-arnhem-van-kunstenaar-lenneke-wispelwey' },
          { label: 'Podia & Theateragenda', href: '/agenda?category=theater-dans' },
        ],
      },
      {
        title: 'Activiteiten & Natuur',
        items: [
          { label: '10x Gratis dingen om te doen', href: '/artikelen/gratis-dingen-doen-arnhem' },
          { label: 'Wat te doen met kinderen', href: '/artikelen/wat-te-doen-in-arnhem-met-kinderen-de-leukste-uitjes-voor-het-hele-gezin' },
          { label: 'Cirque de la Liberté Rijnoever', href: '/artikelen/cirque-de-la-liberte' },
          { label: 'Op ontdekking met Arnhem Life', href: '/artikelen/op-ontdekkingstocht-door-arnhem-met-petra-van-arnhem-life' },
        ],
      },
    ],
    featuredCta: {
      title: 'Topgids door Arnhem',
      description: 'Van zwoele terrassen aan de Rijnkade tot wandelingen door het groenste stadspark van Nederland.',
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
          { label: 'De Arnhemse Trolleybus', href: '/plan-je-bezoek' },
        ],
      },
      {
        title: 'Overnachten',
        items: [
          { label: 'Hotels in de binnenstad', href: '/plan-je-bezoek' },
          { label: 'B&Bs in het Modekwartier', href: '/plan-je-bezoek' },
          { label: 'Weekendje Arnhem plannen', href: '/plan-je-bezoek' },
        ],
      },
      {
        title: 'Toeristische Info',
        items: [
          { label: 'Bezoekerscentrum Rozet (VVV)', href: '/plan-je-bezoek' },
          { label: 'Stadsplattegrond & wandelroutes', href: '/plan-je-bezoek' },
          { label: 'Contact met de redactie', href: '/contact' },
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
        title: 'Verhalen & Dossiers',
        items: [
          { label: 'Alle artikelen & verhalen', href: '/artikelen' },
          { label: '3FM Serious Request Glazen Huis', href: '/artikelen/14382' },
          { label: 'Arnhemse Stadsprijs helden', href: '/artikelen/arnhemse-stadsprijs' },
          { label: 'Vrijwilligers in the spotlight', href: '/artikelen/vrijwilliger-in-the-spotlight-sjaak-van-gestel' },
        ],
      },
      {
        title: 'Cultuur & Horeca',
        items: [
          { label: 'Eten & Drinken recensies', href: '/artikelen?category=eten-drinken' },
          { label: 'Kunst, Theater & Muziek', href: '/artikelen?category=cultuur' },
          { label: 'Nieuwe hotspots in de stad', href: '/artikelen?category=ontdekken' },
          { label: 'Lijstjes & weekendtips', href: '/artikelen?category=tips' },
        ],
      },
      {
        title: 'Doe mee',
        items: [
          { label: 'Vacature redacteur Uit in Arnhem', href: '/artikelen/vacature-redacteur-bij-uit-in-arnhem' },
          { label: 'Tip de redactie', href: '/contact' },
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
    description: 'Over UIT in Arnhem, ons team van lokale liefhebbers, samenwerken en onze missie.',
    columns: [
      {
        title: 'Over het platform',
        items: [
          { label: 'Wie we zijn & onze missie', href: '/over-ons' },
          { label: 'Maak kennis met het team', href: '/over-ons#team' },
        ],
      },
      {
        title: 'Samenwerken',
        items: [
          { label: 'Samenwerken & Adverteren', href: '/over-ons#samenwerken' },
          { label: 'Gratis evenement aanmelden', href: '/admin/agenda/new' },
          { label: 'Word onderdeel van de redactie', href: '/over-ons#vacature' },
        ],
      },
      {
        title: 'Contact',
        items: [
          { label: 'Contactformulier', href: '/contact' },
          { label: 'Redactie CMS Login', href: '/admin' },
        ],
      },
    ],
    featuredCta: {
      title: 'Voor en door Arnhemmers',
      description: 'UIT in Arnhem is hét onafhankelijke platform voor cultuur, horeca en verhalen uit de Rijnstad.',
      href: '/over-ons',
      buttonText: 'Lees over ons team',
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
        title: 'Samenwerken',
        items: [
          { label: 'Gratis evenement insturen', href: '/admin/agenda/new' },
          { label: 'Adverteren & Partners', href: '/over-ons#samenwerken' },
        ],
      },
      {
        title: 'Volg ons',
        items: [
          { label: 'Instagram (@uitinarnhem)', href: 'https://www.instagram.com/uitinarnhem/' },
          { label: 'Facebook (UIT in Arnhem)', href: 'https://nl-nl.facebook.com/uitinarnhem/' },
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
