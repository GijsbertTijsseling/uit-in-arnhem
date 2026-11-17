import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Sparkles,
  Mail,
  MapPin,
  Compass,
  Calendar,
  Camera,
  UtensilsCrossed,
  Music,
  ArrowRight,
  Send,
  Users
} from 'lucide-react';

export const metadata = {
  title: 'Over ons | Het team van UIT in Arnhem',
  description: 'Maak kennis met het team achter UIT in Arnhem. Hét online platform voor cultuur, horeca, evenementen en de mooiste verhalen uit de Rijnstad.',
};

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  quote?: string;
  tags: string[];
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Rein Aalbers',
    role: 'Eigenaar & Campagnemanager',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/09/DSC06905-klein-e1727707002545-500x500.jpg',
    bio: 'Rein is 37 jaar en woont in hartje Klarendal, om de hoek bij Sugar Hill. Met zijn nieuwsgierigheid is Rein altijd op zoek naar verborgen plekjes; dat ene nieuwe koffietentje in de stad of die verscholen binnentuin in het Spijkerkwartier. Zijn passie voor groen Arnhem combineert hij met zijn liefde voor eten en drinken. Zo werkt hij als gastheer in de achtertuin van Arnhem, bij Bistrobar Beaune in Rozendaal aan de rand van de Posbank.',
    quote: 'Altijd op zoek naar die verborgen parels in Klarendal en het Spijkerkwartier.',
    tags: ['Klarendal', 'Bistrobar Beaune', 'Hotspots', 'Groen Arnhem'],
  },
  {
    name: 'Gijs Tijsseling',
    role: 'Eigenaar & Webdeveloper',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/09/Kopie-van-foto_bert-500x500.png',
    bio: 'Na zijn studie Sterrenkunde in Amsterdam en wat omzwervingen in de Randstad is Gijs terug op het oude nest in Arnhem. Met zijn hond, vrouw en twee kinderen wandelt hij letterlijk vanuit zijn achtertuin Landgoed Mariëndaal in. Ook Gijs is het liefst buiten, maar tegen een pubquiz in Café Sint Jan of een feestje in Luxor Live zegt hij geen nee. Als je Gijs kwijt bent, is de kans groot dat hij op zijn vaste stekje in het zuiden van Portugal aan het kitesurfen is.',
    quote: 'Van sterrenkunde tot het moderne platform voor Arnhem.',
    tags: ['Mariëndaal', 'Sint Jan', 'Luxor Live', 'Webdevelopment'],
  },
  {
    name: 'Marleen',
    role: 'Redacteur & Cultuurspecialist',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/10/Marleen-website-1-500x500.png',
    bio: 'Marleen is een grote aanwinst voor het team van UIT in Arnhem. Eindelijk iemand van ‘over de brug’ die laat zien dat er in Arnhem Zuid genoeg te beleven is! Met haar passie voor cultuur is Marleen regelmatig in het theater, bij Luxor Live of één van de andere podia te vinden. Sinds haar komst is onze online agenda altijd tiptop gevuld. Arnhem is natuurlijk haar grote liefde, maar voor een concertje van Bruce Springsteen (“The Boss”) in het buitenland draait ze haar hand ook niet om.',
    quote: 'Cultuur brengt Arnhem samen, van noord tot diep in zuid.',
    tags: ['Arnhem Zuid', 'Theater & Podia', 'Luxor Live', 'Bruce Springsteen'],
  },
  {
    name: 'Jort Blummel',
    role: 'Fotograaf',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/10/Jort-website-500x500.png',
    bio: 'Onvermoeibaar en altijd vrolijk. Dat is Jort. Als fotograaf reist hij bands en artiesten achterna door heel Nederland. Ook voor UIT in Arnhem schiet hij de mooiste plaatjes. Ken je Jort niet van de beelden van uitzinnige fans op de Jansplaats, dan wel van zijn andere passie: hardlopen. Overdag werkt hij bij RUN2DAY in de stad en als hij dan nog tijd overhoudt, rent hij door de parken of doet hij een rondje bruggen.',
    quote: 'De energie en dynamiek van Arnhem vangen in één krachtig beeld.',
    tags: ['Concertfotografie', 'RUN2DAY', 'Rondje Bruggen', 'Festivals'],
  },
  {
    name: 'Marloes Tiedink',
    role: 'Content Creator & Fijnproever',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/10/Marloes-website-500x500.png',
    bio: 'Wil je op de hoogte zijn van de leukste eettentjes, de beste restaurants en de nieuwste hotspots in onze stad? Dan moet je bij Marloes zijn. Deze Arnhemse hobbykok kan niet alleen zelf heerlijk eten maken, ze is ook een kei in het vastleggen en delen van culinaire adresjes. Ze deelt maandelijks haar favoriete ontdekkingen in de stad en neemt iedereen mee in haar smaakvolle avonturen.',
    quote: 'Arnhem zit boordevol heerlijke smaken en creatieve ondernemers.',
    tags: ['Horeca Hotspots', 'Culinair Arnhem', 'Recepten', 'Binnenstad'],
  },
  {
    name: 'Lizzy',
    role: 'Content Creator',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2026/02/Lizzy-500x500.jpg',
    bio: 'Met haar achtergrond in Toerisme Management en ervaring in de marketingwereld zet Lizzy zich dagelijks in om de Arnhemse horeca, evenementen en lokale initiatieven zichtbaar te maken. Lizzy heeft een grote passie voor eten en drinken en is vaak in Arnhem te vinden om nieuwe terrassen en restaurants te ontdekken — het liefst onder het genot van een goed glas wijn.',
    quote: 'Arnhemse gezelligheid en gastvrijheid zichtbaar maken voor iedereen.',
    tags: ['Toerisme', 'Social Media', 'Wijn & Terras', 'Evenementen'],
  },
  {
    name: 'Larissa Derks',
    role: 'Fotograaf',
    image: 'https://uitinarnhem.nl/wp-content/uploads/2024/10/Larissa-website-1-500x500.png',
    bio: 'Larissa is al van kinds af aan gek van muziek. Niet zo vreemd dus dat je haar regelmatig in de concertzalen van Arnhem weet te vinden. Inmiddels is ze niet alleen huisfotograaf van Musis & Stadstheater, maar reist ze mee met artiesten om beelden te schieten op festivals en bij poppodia door heel Nederland. Larissa is één bonk energie en het liefst altijd onderweg met haar camera.',
    quote: 'Vastleggen hoe muziek en theater mensen in het hart raken.',
    tags: ['Musis & Stadstheater', 'Live Muziek', 'Theaterfotografie', 'Poppodia'],
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-16 pb-20 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4F00] bg-[#FFF3ED] border border-[#FF4F00]/20 px-4 py-1.5 rounded-full shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-[#FF4F00]" />
            <span>Voor en door Arnhemmers</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-zinc-950 tracking-tight leading-tight">
            Wij zijn <span className="text-[#FF4F00]">UIT in Arnhem</span>
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-700 font-medium max-w-3xl mx-auto leading-relaxed">
            Hét online platform dat jou laat zien wat er in onze bruisende Rijnstad te doen is!
          </p>

          <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Van intieme voorstellingen tot zwoele foodfestivals, en van verborgen koffiebars tot dampende zalen in Luxor Live en Musis: UIT in Arnhem neemt jou overal mee naartoe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#team"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white font-bold text-sm hover:bg-[#FF4F00] transition-colors shadow-md"
            >
              <Users className="w-4 h-4" />
              <span>Maak kennis met ons team</span>
            </a>
            <a
              href="#samenwerken"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-800 font-bold text-sm border border-zinc-200 hover:border-[#FF4F00] hover:text-[#FF4F00] transition-colors shadow-sm"
            >
              <span>Samenwerken & Adverteren</span>
            </a>
          </div>
        </div>
      </section>

      {/* Missie & Pijlers */}
      <section id="missie" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-stone-50 border border-stone-200/80 p-8 rounded-3xl space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-zinc-900">Echt & Onafhankelijk</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Geen droge persberichten of commerciële trucjes, maar persoonlijke en oprechte tips van redacteuren die dagelijks in Arnhem wonen, werken en genieten.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 p-8 rounded-3xl space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-zinc-900">Compleet & Actueel</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Van de grote podia tot kleine wijkinitiatieven: met honderden evenementen in onze Uitagenda weet je altijd precies wat er vandaag, morgen of dit weekend te beleven is.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 p-8 rounded-3xl space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3ED] text-[#FF4F00] flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-zinc-900">Voor en door de stad</h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Arnhem is een stad met karakter — groen, creatief en vol energie. We verbinden publiek, artiesten, horecaondernemers en cultuurmakers met elkaar.
            </p>
          </div>
        </div>
      </section>

      {/* Het Team Section */}
      <section id="team" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF4F00] bg-[#FFF3ED] px-3.5 py-1 rounded-full">
            <span>De gezichten achter het platform</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-zinc-950 tracking-tight">
            Het team van UIT in Arnhem
          </h2>
          <p className="text-zinc-600 text-base leading-relaxed">
            Ons team is heel divers: van horecaliefhebber tot cultuurfreak en van fotograaf tot journalist. Maar allemaal met één gedeelde passie: Arnhem.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Member Photo */}
              <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-heading font-black text-2xl drop-shadow-sm">{member.name}</h3>
                  <p className="text-xs font-medium text-orange-200 tracking-wide uppercase">{member.role}</p>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-zinc-600 text-sm leading-relaxed">{member.bio}</p>

                {member.quote && (
                  <div className="border-l-2 border-[#FF4F00] pl-3 py-1 text-xs italic text-zinc-700 bg-stone-50 rounded-r-lg">
                    “{member.quote}”
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
                  {member.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold text-zinc-600 bg-stone-100 px-2.5 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Card: Word jij onze nieuwe collega? */}
          <div
            id="vacature"
            className="bg-gradient-to-br from-[#FF4F00] to-[#E04500] text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Doe mee</span>
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                Jij? Word onderdeel van de redactie!
              </h3>
              <p className="text-orange-100 text-sm leading-relaxed">
                UIT in Arnhem is een platform voor Arnhemmers, door Arnhemmers! We zijn altijd op zoek naar mensen met een warm hart voor de stad die hun passie willen delen.
              </p>
              <p className="text-orange-100 text-sm leading-relaxed">
                Wil je zelf schrijven, fotograferen, video’s maken of meedenken over de leukste content van de stad?
              </p>
            </div>

            <div className="space-y-3 relative z-10 pt-4">
              <Link
                href="/artikelen/vacature-redacteur-bij-uit-in-arnhem"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-orange-50 transition-colors shadow-lg"
              >
                <span>Bekijk vacature redacteur</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black/20 text-white font-medium text-xs hover:bg-black/30 transition-colors"
              >
                <span>Of stuur een open berichtje</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Samenwerken Section */}
      <section id="samenwerken" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-wider">
              <span>Samenwerken & Zichtbaarheid</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
              Jouw evenement of organisatie uitgelicht in Arnhem?
            </h2>

            <p className="text-zinc-300 text-base leading-relaxed">
              Organiseer je een festival, concert, voorstelling of expositie? Of wil je jouw horecagelegenheid onder de aandacht brengen bij tienduizenden actieve inwoners en bezoekers van Arnhem? Wij helpen met gerichte promotie via onze website, sociale media en de maandelijkse UITmail.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <h4 className="font-heading font-bold text-white text-base">Gratis Agenda Plaatsing</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Iedereen kan culturele activiteiten gratis aanmelden voor onze Uitagenda. Na een snelle redactiecheck staat jouw event online.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/agenda/new"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4F00] hover:text-white transition-colors"
                  >
                    <span>Event nu aanmelden</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <h4 className="font-heading font-bold text-white text-base">Campagnes & Partners</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Sponsoring, uitgelichte artikelen, video-reportages op Instagram of maatwerk partnerships om maximale impact in de stad te bereiken.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4F00] hover:text-white transition-colors"
                  >
                    <span>Neem contact op</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-full bg-[#FF4F00] text-white font-bold text-sm hover:bg-[#E04500] transition-colors shadow-lg"
              >
                Kom langs voor een kop koffie
              </Link>
              <a
                href="mailto:info@uitinarnhem.nl"
                className="px-6 py-3.5 rounded-full bg-zinc-800 text-zinc-200 font-bold text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
              >
                info@uitinarnhem.nl
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-4">
        <h3 className="font-heading font-black text-2xl text-zinc-900">
          Mis nooit meer wat er speelt in Arnhem
        </h3>
        <p className="text-zinc-600 text-sm leading-relaxed">
          Volg onze avonturen dagelijks op social media of stuur onze redactie jouw tips door.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a
            href="https://www.instagram.com/uitinarnhem/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-4 py-2 rounded-full border border-stone-300 text-zinc-700 hover:border-[#FF4F00] hover:text-[#FF4F00] transition-colors"
          >
            Instagram @uitinarnhem
          </a>
          <a
            href="https://nl-nl.facebook.com/uitinarnhem/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-4 py-2 rounded-full border border-stone-300 text-zinc-700 hover:border-[#FF4F00] hover:text-[#FF4F00] transition-colors"
          >
            Facebook Pagina
          </a>
        </div>
      </section>
    </div>
  );
}
