import { 
  Search, 
  Home, 
  Calendar, 
  Tv, 
  PlaySquare, 
  Gamepad2, 
  User, 
  Settings,
  Star,
  Users
} from 'lucide-react';

export interface ContentItem {
  id: string;
  title: string;
  image: string;
  description?: string;
  year?: string;
  series?: string;
  genre?: string;
  time?: string;
  live?: boolean;
  type: 'movie' | 'series' | 'tv';
  videoUrl?: string;
  rating?: string;
  director?: string;
  cast?: string;
  isKids?: boolean;
}

export const SIDEBAR_ITEMS = [
  { icon: Home, id: 'home', label: 'Domů' },
  { iconPath: '/search.png', id: 'search', label: 'Hledat' },
  { iconPath: '/archive.png', id: 'archive', label: 'Archiv' },
  { iconPath: '/livetv.png', id: 'tv', label: 'Živé vysílání' },
  { iconPath: '/recordings.png', id: 'recordings', label: 'Nahrávky' },
  { iconPath: '/favourites.png', id: 'favorites', label: 'Oblíbené' },
  { iconPath: '/downloads.png', id: 'downloads', label: 'Stahování' },
  { iconPath: '/settings.png', id: 'settings', label: 'Nastavení' },
];

export const MOCK_TV_CHANNELS: ContentItem[] = [
  {
    id: 'tv1',
    title: 'Na lovu: Hvězdný speciál',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=600',
    time: '18:05 - 19:30',
    description: 'Oblíbená vědomostní soutěž v exkluzivním vydání s celebritami. Dokáží hvězdy porazit obávaného Lovce a vyhrát peníze na charitu?',
    live: true,
    type: 'tv',
    genre: 'Soutěžní',
    rating: '8.2'
  },
  {
    id: 'tv2',
    title: 'Události',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=600',
    time: '19:00 - 19:52',
    description: 'Hlavní zpravodajská relace dne. Nejdůležitější události z domova i ze světa, analýzy a reportáže.',
    live: true,
    type: 'tv',
    genre: 'Zpravodajství',
    rating: '7.5'
  },
  {
    id: 'tv3',
    title: 'Vesnicopis',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
    time: '19:00 - 19:20',
    description: 'Dokumentární cyklus o krásách a tradicích českého venkova. Objevte skrytá místa a zajímavé osudy lidí.',
    live: true,
    type: 'tv',
    genre: 'Dokumentární',
    rating: '8.8'
  },
  {
    id: 'tv4',
    title: 'Hlavní Zprávy',
    image: 'https://images.unsplash.com/photo-1585829365294-118484e7ad1d?auto=format&fit=crop&q=80&w=600',
    time: '18:55 - 19:40',
    description: 'Aktuální přehled nejdůležitějších zpráv. Rychle, objektivně a ze všech úhlů pohledu.',
    live: true,
    type: 'tv',
    genre: 'Zpravodajství',
    rating: '7.0'
  },
  {
    id: 'tv5',
    title: 'Stroj času',
    image: 'https://images.unsplash.com/photo-1510511459019-5dee997dd1db?auto=format&fit=crop&q=80&w=600',
    time: '20:00 - 21:30',
    description: 'Cesta do historie prostřednictvím unikátních archivních záběrů. Jaký byl svět před padesáti lety?',
    live: false,
    type: 'tv',
    genre: 'Historický',
    rating: '9.1'
  }
];

export const MOCK_RECOMMENDED: ContentItem[] = [
  {
    id: 'rec1',
    title: 'Survivor',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=400',
    description: 'Jedinečná výzva o přežití je zde – jste na ni připraveni? Tropický ráj se pro skupinu soutěžících změní v noční můru, ve které budou muset bojovat nejen s nedostatkem jídla a pohodlí, ale hlavně mezi sebou. Pohádková výhra čeká jen na jednoho. Kdo se stane posledním přeživším?',
    year: '2022',
    genre: 'Reality show',
    type: 'series',
    rating: '9.4',
    cast: 'Jeff Probst, Soutěžící',
    director: 'Charlie Parsons',
    isKids: false
  },
  {
    id: 'rec2',
    title: 'Extrémní proměny',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    description: 'Třináct odvážných dobrovolníků pod vedením Marika Košťála se rozhodlo změnit svůj život od základů. Sledujte jejich rok plný dřiny, odříkání a neuvěřitelných proměn nejen těla, ale i ducha.',
    year: '2023',
    genre: 'Dokument',
    type: 'series',
    rating: '8.9',
    cast: 'Maroš Molnár, Dobrovolníci',
    director: 'Peter Núñez',
    isKids: false
  },
  {
    id: 'rec3',
    title: 'Spider-Man: Bez domova',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=400',
    description: 'Poprvé ve filmové historii Spider-Mana je odhalena identita našeho sousedského hrdiny a jeho zodpovědnost se dostává do konfliktu s normálním životem. Když Peter požádá Doctora Strange o pomoc, kouzlo vyvolá trhlinu, kterou se do světa dostanou nejmocnější padouši, kteří kdy bojovali se Spider-Manem v jakémkoliv vesmíru.',
    year: '2021',
    genre: 'Akční / Sci-Fi',
    type: 'movie',
    rating: '9.2',
    cast: 'Tom Holland, Zendaya, Benedict Cumberbatch',
    director: 'Jon Watts',
    isKids: true
  },
  {
    id: 'rec4',
    title: 'Ruža pre nevestu',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400',
    description: 'Jeden charismatický mládenec, dvacet žen a nekonečně mnoho romantických okamžiků i vypjatých emocí. Která z nich nakonec získá jeho srdce a zasnoubí se s ním?',
    year: '2024',
    genre: 'Reality show',
    type: 'series',
    rating: '6.5',
    cast: 'Radko Urbanyak, Soutěžící',
    director: 'Lukáš Zednikovič',
    isKids: false
  },
  {
    id: 'rec5',
    title: 'Jdou na smrt',
    image: 'https://images.unsplash.com/photo-1536440136628-81981240318c?auto=format&fit=crop&q=80&w=400',
    description: 'Syrový pohled na osudy vojáků v první linii během nejhorších bitev historie. Příběh o odvaze, strachu a lidskosti v nelidských podmínkách.',
    year: '2022',
    genre: 'Válečný',
    type: 'movie',
    rating: '8.7',
    cast: 'Jan Novák, Martin Král',
    director: 'Karel Svoboda',
    isKids: false
  },
  {
    id: 'rec6',
    title: 'Specialisté',
    image: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?auto=format&fit=crop&q=80&w=400',
    description: 'Tým elitních vyšetřovatelů řeší nejsložitější kriminální případy v Praze. Moderní kriminalistika, napětí a osobité postavy.',
    year: '2023',
    genre: 'Krimi',
    type: 'series',
    rating: '8.3',
    cast: 'Martin Dejdar, Jiří Hána',
    director: 'Róbert Šveda',
    isKids: false
  }
];
