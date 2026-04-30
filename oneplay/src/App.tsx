import { useState, useRef, useEffect, ReactNode } from 'react';
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Info, Search, X, Volume2, VolumeX, Maximize2, User, Star, Tv, Users, Heart, Download, Check, ChevronRight, Home, LogOut } from 'lucide-react';
import { SIDEBAR_ITEMS, MOCK_TV_CHANNELS, MOCK_RECOMMENDED, type ContentItem } from './constants';

const translations = {
  cz: {
    home: "Domů",
    search: "Hledat",
    movies: "Filmy",
    series: "Seriály",
    kids: "Pro děti",
    favorites: "Oblíbené",
    downloads: "Stahování",
    tv: "Živé vysílání",
    settings: "Nastavení",
    playNow: "Přehrát nyní",
    moreInfo: "Více informací",
    popular: "Populární na OnePlay",
    recommended: "Doporučujeme vám",
    moviesForYou: "Filmy pro vás",
    searchPlaceholder: "Filmy, seriály, kanály...",
    all: "Vše",
    category: "Kategorie",
    results: "Výsledky",
    noResults: "Nebylo nic nalezeno",
    myAccount: "Můj účet",
    subscription: "Předplatné",
    playback: "Přehrávání",
    quality: "Kvalita videa",
    appLanguage: "Jazyk aplikace",
    subtitles: "Titulky",
    system: "Systém",
    about: "O aplikaci OnePlay",
    terms: "Smluvní podmínky",
    privacy: "Zásady ochrany soukromí",
    logout: "Odhlásit se",
    editProfile: "Upravit profil",
    save: "Uložit",
    cancel: "Zrušit",
    ok: "OK",
    on: "Zapnuto",
    off: "Vypnuto",
    active: "Aktivní",
    emptyList: "Seznam je zatím prázdný",
    nothingDownloaded: "Zatím jste nic nestáhli",
    recordings: "Nahrávky",
    archive: "Archiv",
  },
  en: {
    home: "Home",
    search: "Search",
    movies: "Movies",
    series: "Series",
    kids: "Kids",
    favorites: "Favorites",
    downloads: "Downloads",
    tv: "Live TV",
    settings: "Settings",
    playNow: "Play Now",
    moreInfo: "More Info",
    popular: "Popular on OnePlay",
    recommended: "Recommended for you",
    moviesForYou: "Movies for you",
    searchPlaceholder: "Movies, series, channels...",
    all: "All",
    category: "Category",
    results: "Results",
    noResults: "No results found",
    myAccount: "My Account",
    subscription: "Subscription",
    playback: "Playback",
    quality: "Video Quality",
    appLanguage: "App Language",
    subtitles: "Subtitles",
    system: "System",
    about: "About OnePlay",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    logout: "Logout",
    editProfile: "Edit Profile",
    save: "Save",
    cancel: "Cancel",
    ok: "OK",
    on: "On",
    off: "Off",
    active: "Active",
    emptyList: "The list is currently empty",
    nothingDownloaded: "No downloads yet",
    recordings: "Recordings",
    archive: "Archive",
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState<ContentItem | null>(null);
  const [selectedMovieInfo, setSelectedMovieInfo] = useState<ContentItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'movies' | 'series' | 'kids' | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  
  // User & Settings state
  const [userName, setUserName] = useState(() => localStorage.getItem('oneplay-username') || 'Uživatel OnePlay');
  const [language, setLanguage] = useState<'cz' | 'en'>('cz');
  const [subtitles, setSubtitles] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'standard' | 'premium' | 'platinum'>('platinum');
  
  // Modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempUserName, setTempUserName] = useState(userName);
  const [activeInfoModal, setActiveInfoModal] = useState<'about' | 'terms' | 'privacy' | null>(null);
  
  // Content Lists state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('oneplay-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [downloads, setDownloads] = useState<string[]>(() => {
    const saved = localStorage.getItem('oneplay-downloads');
    return saved ? JSON.parse(saved) : [];
  });

  // TIER-QUALITY LINKAGE
  const quality = subscriptionTier === 'platinum' ? '4K' : subscriptionTier === 'premium' ? 'Full HD' : 'HD';

  // TRANSLATIONS
  const t = (key: keyof typeof translations['cz']) => {
    return translations[language][key] || translations['cz'][key] || key;
  };

  useEffect(() => {
    localStorage.setItem('oneplay-username', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('oneplay-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('oneplay-downloads', JSON.stringify(downloads));
  }, [downloads]);

  const allContent = [...MOCK_RECOMMENDED, ...MOCK_TV_CHANNELS];
  
  const getFilteredContent = () => {
    let base = searchQuery 
      ? allContent.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : allContent;
      
    if (searchCategory === 'movies') return base.filter(i => i.type === 'movie');
    if (searchCategory === 'series') return base.filter(i => i.type === 'series');
    if (searchCategory === 'kids') return base.filter(i => i.isKids);
    if (searchCategory === 'all') return base;
    
    // Default to returning everything if no specific category is filtered
    return base;
  };

  const filteredContent = getFilteredContent();
  
  const favoriteItems = allContent.filter(i => favorites.includes(i.id));
  const downloadItems = allContent.filter(i => downloads.includes(i.id));

  // Hero section content
  const heroContent = MOCK_RECOMMENDED[0];

  useEffect(() => {
    if (isSplashVisible) {
      const timer = setTimeout(() => setIsSplashVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSplashVisible]);

  const handleLogout = () => {
    setActiveTab('home');
    setSearchQuery('');
    setSearchCategory(null);
    setIsSplashVisible(true);
    // Reloading to "refresh" as requested
    setTimeout(() => window.location.reload(), 100);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const toggleDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDownloads(prev => prev.includes(id) ? prev.filter(did => did !== id) : [...prev, id]);
  };

  const handlePlayContent = (movie: ContentItem) => {
    setSelectedMovie(movie);
    setIsPlaying(true);
    setSelectedMovieInfo(null);
  };

  const handleShowInfo = (movie: ContentItem) => {
    setSelectedMovieInfo(movie);
  };

  if (isSplashVisible) {
    return (
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-oneplay-bg flex items-center justify-center p-0 overflow-hidden"
      >
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/logo fullscreen.png" 
          className="w-full h-full object-cover lg:object-contain"
          alt="OnePlay Logo"
        />
      </motion.div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-oneplay-bg text-oneplay-text overflow-hidden selection:bg-oneplay-accent/30 lowercase-labels">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] atmospheric-glow-blue blur-[120px]" />
        <div className="absolute top-[10%] -right-[5%] w-[40%] h-[60%] atmospheric-glow-red blur-[100px]" />
      </div>

      {/* Sidebar */}
      <nav className="w-20 md:w-24 glass-morphism flex flex-col items-center py-8 z-30 m-4 rounded-3xl shrink-0">
        <div className="mb-12">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-pointer border border-white/10"
          >
            <img src="/profil.jpg" className="w-full h-full object-cover" alt="O" />
          </div>
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-2xl transition-all duration-300 relative group flex items-center justify-center
                ${activeTab === item.id ? 'bg-white/10' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
              title={t(item.id as any)}
              id={`nav-${item.id}`}
            >
              {item.icon ? (
                <item.icon className={`w-7 h-7 transition-all duration-300 ${activeTab === item.id ? 'text-oneplay-accent' : 'text-white'}`} />
              ) : (
                <img 
                  src={item.iconPath} 
                  className={`w-7 h-7 object-contain transition-all duration-300 ${activeTab === item.id ? 'brightness-125' : 'grayscale'}`} 
                  alt={t(item.id as any)} 
                />
              )}
              
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -right-2 top-1/4 w-1 h-1/2 bg-oneplay-accent rounded-l-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                />
              )}
              
              {/* Tooltip on hover */}
              <div className="absolute left-full ml-4 px-3 py-1.5 glass-morphism text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {t(item.id as any)}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Stage */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar z-10">
        {/* Top Header with logoup.jpeg */}
        <header className="absolute top-0 left-0 right-0 h-24 z-30 flex items-center justify-between px-16 pointer-events-none">
          <div className="pointer-events-auto hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => setActiveTab('home')}>
            <img src="/logoup.jpeg" className="h-10 md:h-12 w-auto pointer-events-auto rounded shadow-lg" alt="OnePlay Header" />
          </div>
        </header>

        {activeTab === 'home' ? (
          <>
            {/* Hero Section */}
            <section className="relative h-[85vh] w-full group">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1920" 
                  className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
                  alt="Hero Backdrop"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 hero-gradient" />
                <div className="absolute inset-0 bottom-gradient" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center px-16 md:px-24 max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-2 py-0.5 bg-white/10 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider border border-white/20">Original</span>
                    <span className="text-oneplay-accent text-xs font-bold uppercase tracking-tighter">9.4 Hodnocení</span>
                  </div>

                  <h1 className="text-7xl md:text-9xl font-display font-black italic tracking-tighter mb-4 leading-[0.85] text-white uppercase transform -skew-x-6">
                    {heroContent.title}
                  </h1>
                  
                  <div className="flex items-center gap-5 text-sm font-bold uppercase tracking-widest text-white/50 mb-8">
                    <span>{heroContent.year}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>3 sady</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{heroContent.genre}</span>
                    <div className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px]">ULTRA HD</div>
                  </div>

                  <p className="text-oneplay-text/70 text-xl leading-relaxed mb-10 max-w-2xl font-medium">
                    Epická cesta za hranice naší galaxie, kde čas a prostor přestávají dávat smysl. Sledujte největší dobrodružství tohoto roku v prémiovém zpracování.
                  </p>

                  <div className="flex items-center gap-5 flex-wrap">
                    <button 
                      onClick={() => handlePlayContent(heroContent)}
                      className="flex items-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-oneplay-accent hover:text-white active:scale-95 transition-all shadow-2xl shadow-blue-500/20"
                      id="hero-play"
                    >
                      <Play fill="currentColor" size={24} />
                      Přehrát nyní
                    </button>
                    <button className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-white"
                      onClick={() => handleShowInfo(heroContent)}
                    >
                      <Info size={24} />
                      Více informací
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Content Rows */}
            <div className="px-16 md:px-24 -mt-24 pb-24 relative z-20 space-y-16">
              
              {/* Row 1: TV Live */}
              <SectionRow title={t('popular')}>
                {MOCK_TV_CHANNELS.map((item, idx) => (
                  <TVCard key={item.id} item={item} index={idx} onClick={() => handleShowInfo(item)} />
                ))}
              </SectionRow>

              {/* Row 2: Recommended */}
              <SectionRow title={t('recommended')}>
                {MOCK_RECOMMENDED.map((item, idx) => (
                  <ContentCard 
                    key={item.id} 
                    item={item} 
                    index={idx} 
                    onClick={() => handleShowInfo(item)}
                    onDirectPlay={(e) => { e.stopPropagation(); handlePlayContent(item); }}
                    isFavorite={favorites.includes(item.id)}
                    isDownloaded={downloads.includes(item.id)}
                    onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                    onToggleDownload={(e) => toggleDownload(e, item.id)}
                  />
                ))}
              </SectionRow>

              {/* Favorites Row (if any) */}
              {favoriteItems.length > 0 && (
                <SectionRow title={t('favorites')}>
                  {favoriteItems.map((item, idx) => (
                    <ContentCard 
                      key={`fav-row-${item.id}`} 
                      item={item} 
                      index={idx} 
                      onClick={() => handleShowInfo(item)}
                      onDirectPlay={(e) => { e.stopPropagation(); handlePlayContent(item); }}
                      isFavorite={true}
                      isDownloaded={downloads.includes(item.id)}
                      onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                      onToggleDownload={(e) => toggleDownload(e, item.id)}
                    />
                  ))}
                </SectionRow>
              )}

              {/* Row 3: Movies */}
              <SectionRow title={t('moviesForYou')}>
                {MOCK_RECOMMENDED.filter(i => i.type === 'movie').map((item, idx) => (
                  <ContentCard 
                    key={`rev-${item.id}`} 
                    item={item} 
                    index={idx} 
                    onClick={() => handleShowInfo(item)}
                    onDirectPlay={(e) => { e.stopPropagation(); handlePlayContent(item); }}
                    isFavorite={favorites.includes(item.id)}
                    isDownloaded={downloads.includes(item.id)}
                    onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                    onToggleDownload={(e) => toggleDownload(e, item.id)}
                  />
                ))}
              </SectionRow>
            </div>
          </>
        ) : activeTab === 'favorites' ? (
          <div className="pt-32 px-16 md:px-24 pb-24 min-h-screen">
             <h2 className="text-5xl font-black italic tracking-tighter mb-12 uppercase text-white transform -skew-x-6">{t('favorites')}</h2>
             {favoriteItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                   {favoriteItems.map((item, idx) => (
                      <ContentCard 
                        key={item.id} 
                        item={item} 
                        index={idx} 
                        onClick={() => handleShowInfo(item)}
                        onDirectPlay={(e) => { e.stopPropagation(); handlePlayContent(item); }}
                        isFavorite={true}
                        isDownloaded={downloads.includes(item.id)}
                        onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                        onToggleDownload={(e) => toggleDownload(e, item.id)}
                      />
                   ))}
                </div>
             ) : (
                <div className="text-center py-24 opacity-40">
                   <Heart size={64} className="mx-auto mb-6" />
                   <p className="text-2xl font-bold italic uppercase tracking-widest">{t('emptyList')}</p>
                </div>
             )}
          </div>
        ) : activeTab === 'downloads' ? (
          <div className="pt-32 px-16 md:px-24 pb-24 min-h-screen">
             <h2 className="text-5xl font-black italic tracking-tighter mb-12 uppercase text-white transform -skew-x-6">{t('downloads')}</h2>
             {downloadItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                   {downloadItems.map((item, idx) => (
                      <ContentCard 
                        key={item.id} 
                        item={item} 
                        index={idx} 
                        onClick={() => handleShowInfo(item)}
                        onDirectPlay={(e) => { e.stopPropagation(); handlePlayContent(item); }}
                        isFavorite={favorites.includes(item.id)}
                        isDownloaded={true}
                        onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                        onToggleDownload={(e) => toggleDownload(e, item.id)}
                      />
                   ))}
                </div>
             ) : (
                <div className="text-center py-24 opacity-40">
                   <Download size={64} className="mx-auto mb-6" />
                   <p className="text-2xl font-bold italic uppercase tracking-widest">{t('nothingDownloaded')}</p>
                </div>
             )}
          </div>
        ) : activeTab === 'tv' ? (
          <div className="pt-32 px-16 md:px-24 pb-24 min-h-screen">
             <h2 className="text-5xl font-black italic tracking-tighter mb-12 uppercase text-white transform -skew-x-6">{t('tv')}</h2>
             <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden glass-morphism border border-white/10 mb-12 relative group shadow-2xl bg-black">
                <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-8">
                   <div className="w-20 h-20 rounded-full bg-oneplay-accent flex items-center justify-center mb-6 animate-pulse">
                      <Play fill="white" size={32} />
                   </div>
                   <h3 className="text-3xl font-black uppercase italic tracking-tighter transform -skew-x-6 mb-4">
                      {language === 'cz' ? 'Živé vysílání není v náhledu dostupné' : 'Live streaming not available in preview'}
                   </h3>
                   <p className="max-w-md text-white/40">
                      {language === 'cz' 
                        ? 'Z důvodu autorských práv a bezpečnostních omezení prohlížeče nelze živé vysílání ČT1 zobrazit přímo v tomto rámu. Pro sledování prosím využijte oficiální stránky.' 
                        : 'Due to copyright and browser security restrictions, live streaming cannot be displayed directly in this frame. Please use the official websites for viewing.'}
                   </p>
                   <a href="https://www.ceskatelevize.cz/zive/ct1/" target="_blank" className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all font-bold uppercase tracking-widest text-sm">
                      {language === 'cz' ? 'Otevřít ČT1 v novém okně' : 'Open ČT1 in new window'}
                   </a>
                </div>
                <div className="absolute top-6 left-6 bg-red-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                   {language === 'cz' ? 'ČT1 ŽIVĚ (UKÁZKA)' : 'CT1 LIVE (PREVIEW)'}
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {MOCK_TV_CHANNELS.map((channel, idx) => (
                   <TVCard key={channel.id} item={channel} index={idx} onClick={() => handleShowInfo(channel)} />
                ))}
             </div>
          </div>

        ) : activeTab === 'search' ? (
          <div className="pt-32 px-16 md:px-24 pb-24 min-h-screen">
             <div className="max-w-4xl mx-auto mb-16">
                <h2 className="text-5xl font-black italic tracking-tighter mb-8 uppercase text-white transform -skew-x-6">{t('search')} In OnePlay</h2>
                <div className="relative group mb-8">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-oneplay-accent transition-colors" size={24} />
                   <input 
                      type="text" 
                      placeholder={t('searchPlaceholder')} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-xl focus:outline-none focus:ring-2 focus:ring-oneplay-accent/50 transition-all text-white placeholder:text-white/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                   />
                </div>
                
                <div className="flex gap-4 flex-wrap">
                   {[
                      { id: 'all', label: t('all') },
                      { id: 'movies', label: t('movies') },
                      { id: 'series', label: t('series') },
                      { id: 'kids', label: t('kids') }
                   ].map(cat => (
                      <button 
                         key={cat.id}
                         onClick={() => setSearchCategory(cat.id as any)}
                         className={`px-8 py-3 rounded-xl border transition-all font-bold uppercase tracking-widest text-xs
                            ${searchCategory === cat.id ? 'bg-oneplay-accent border-oneplay-accent text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                      >
                         {cat.label}
                      </button>
                   ))}
                </div>
             </div>

             {(searchQuery || searchCategory) ? (
                <div className="space-y-12">
                   <h3 className="text-xl font-bold uppercase tracking-widest text-white/40">
                      {searchCategory ? (
                        searchCategory === 'all' 
                          ? `${t('category')}: ${t('all')}`
                          : `${t('category')}: ${
                              searchCategory === 'movies' ? t('movies') : 
                              searchCategory === 'series' ? t('series') : t('kids')
                            }`
                      ) : t('results')}
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                      {filteredContent.map((item, idx) => (
                         <ContentCard 
                            key={item.id} 
                            item={item} 
                            index={idx} 
                            onClick={() => handleShowInfo(item)}
                            onDirectPlay={(e) => { e.stopPropagation(); handlePlayContent(item); }}
                            isFavorite={favorites.includes(item.id)}
                            isDownloaded={downloads.includes(item.id)}
                            onToggleFavorite={(e) => toggleFavorite(e, item.id)}
                            onToggleDownload={(e) => toggleDownload(e, item.id)}
                         />
                      ))}
                   </div>
                   {filteredContent.length === 0 && (
                      <div className="text-center py-24 opacity-40">
                         <Search size={64} className="mx-auto mb-6" />
                         <p className="text-2xl font-bold italic uppercase tracking-widest">{t('noResults')}</p>
                      </div>
                   )}
                   <button onClick={() => {setSearchCategory(null); setSearchQuery('');}} className="w-full py-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest text-white/20">{t('cancel')}</button>
                </div>
             ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                   <div onClick={() => setSearchCategory('movies')} className="glass-morphism p-10 rounded-[2.5rem] border-white/5 hover:border-oneplay-accent/30 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-oneplay-accent transition-colors">
                        <Play size={24} fill="currentColor" />
                      </div>
                      <h4 className="text-2xl font-black italic uppercase transition-colors italic transform -skew-x-6 mb-2 group-hover:text-oneplay-accent">{t('movies')}</h4>
                      <p className="text-white/40">{language === 'cz' ? 'Tisíce titulů všech žánrů' : 'Thousands of titles in all genres'}</p>
                   </div>
                   <div onClick={() => setSearchCategory('series')} className="glass-morphism p-10 rounded-[2.5rem] border-white/5 hover:border-oneplay-accent/30 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-oneplay-accent transition-colors">
                        <Tv size={24} />
                      </div>
                      <h4 className="text-2xl font-black italic uppercase transition-colors italic transform -skew-x-6 mb-2 group-hover:text-oneplay-accent">{t('series')}</h4>
                      <p className="text-white/40">{language === 'cz' ? 'Kompletní sady a premiéry' : 'Complete boxsets and premieres'}</p>
                   </div>
                   <div onClick={() => setSearchCategory('kids')} className="glass-morphism p-10 rounded-[2.5rem] border-white/5 hover:border-oneplay-accent/30 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-oneplay-accent transition-colors">
                        <Users size={24} />
                      </div>
                      <h4 className="text-2xl font-black italic uppercase transition-colors italic transform -skew-x-6 mb-2 group-hover:text-oneplay-accent">{t('kids')}</h4>
                      <p className="text-white/40">{language === 'cz' ? 'Bezpečný obsah pro nejmenší' : 'Safe content for the little ones'}</p>
                   </div>
                </div>
             )}
          </div>
        ) : activeTab === 'settings' ? (
          <div className="pt-32 px-16 md:px-24 pb-24 min-h-screen max-w-6xl mx-auto">
             <h2 className="text-5xl font-black italic tracking-tighter mb-12 uppercase text-white transform -skew-x-6">{t('settings')}</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                   <div className="glass-morphism p-8 rounded-[2rem] border-white/5">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-oneplay-accent mb-6">{t('myAccount')}</h3>
                      <div className="flex items-center gap-6 mb-8">
                         <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                            <img src="/profil.jpg" className="w-full h-full object-cover" alt="" onError={(e) => {
                               (e.target as any).style.display = 'none';
                               (e.target as any).parentElement.innerHTML = '<div class="text-white/20"><User size={40} /></div>';
                            }}/>
                         </div>
                         <div className="flex-1">
                            <p className="text-2xl font-bold">{userName}</p>
                            <p className="text-white/40 tracking-widest uppercase text-[10px] font-black">{subscriptionTier} {language === 'cz' ? 'členství' : 'membership'}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => { setTempUserName(userName); setIsProfileModalOpen(true); }}
                        className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
                      >
                        {t('editProfile')}
                      </button>
                   </div>

                   <div className="glass-morphism p-8 rounded-[2rem] border-white/5">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-oneplay-accent mb-6">{t('subscription')}</h3>
                      <div className="space-y-4">
                        {[
                          { id: 'standard', name: 'Standard', price: '199 Kč' },
                          { id: 'premium', name: 'Premium', price: '299 Kč' },
                          { id: 'platinum', name: 'Platinum', price: '399 Kč' }
                        ].map(tier => (
                          <div 
                            key={tier.id}
                            onClick={() => setSubscriptionTier(tier.id as any)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between
                              ${subscriptionTier === tier.id ? 'bg-oneplay-accent/10 border-oneplay-accent shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                          >
                            <div>
                               <p className="font-bold">{tier.name}</p>
                               <p className="text-xs text-white/40">{tier.price} / {language === 'cz' ? 'měsíc' : 'month'}</p>
                            </div>
                            {subscriptionTier === tier.id && <Check size={20} className="text-oneplay-accent" />}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="glass-morphism p-8 rounded-[2rem] border-white/5">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-oneplay-accent mb-6">{t('playback')}</h3>
                      <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <span className="font-bold">{t('quality')}</span>
                            <span className="text-sm font-black uppercase text-oneplay-accent tracking-widest">{quality}</span>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="font-bold">{t('appLanguage')}</span>
                            <div className="flex gap-2">
                               {['cz', 'en'].map(l => (
                                  <button 
                                     key={l} 
                                     onClick={() => setLanguage(l as any)}
                                     className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all
                                        ${language === l ? 'bg-oneplay-accent text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                  >
                                     {l}
                                  </button>
                               ))}
                            </div>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="font-bold">{t('subtitles')}</span>
                            <button 
                               onClick={() => setSubtitles(!subtitles)}
                               className={`w-12 h-6 rounded-full transition-all relative ${subtitles ? 'bg-oneplay-accent' : 'bg-white/10'}`}
                            >
                               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${subtitles ? 'left-7' : 'left-1'}`} />
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="glass-morphism p-8 rounded-[2rem] border-white/5">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-oneplay-accent mb-6">{t('system')}</h3>
                      <div className="space-y-4">
                         <button onClick={() => setActiveInfoModal('about')} className="w-full py-4 px-6 border border-white/5 rounded-2xl group flex items-center justify-between hover:bg-white/5 transition-all">
                            <span className="font-bold text-sm uppercase tracking-widest">{t('about')}</span>
                            <ChevronRight size={18} className="text-white/20 group-hover:text-oneplay-accent transform group-hover:translate-x-1 transition-all" />
                         </button>
                         <button onClick={() => setActiveInfoModal('terms')} className="w-full py-4 px-6 border border-white/5 rounded-2xl group flex items-center justify-between hover:bg-white/5 transition-all">
                            <span className="font-bold text-sm uppercase tracking-widest">{t('terms')}</span>
                            <ChevronRight size={18} className="text-white/20 group-hover:text-oneplay-accent transform group-hover:translate-x-1 transition-all" />
                         </button>
                         <button onClick={() => setActiveInfoModal('privacy')} className="w-full py-4 px-6 border border-white/5 rounded-2xl group flex items-center justify-between hover:bg-white/5 transition-all">
                            <span className="font-bold text-sm uppercase tracking-widest">{t('privacy')}</span>
                            <ChevronRight size={18} className="text-white/20 group-hover:text-oneplay-accent transform group-hover:translate-x-1 transition-all" />
                         </button>
                         
                         <button onClick={handleLogout} className="w-full text-left py-4 px-6 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-red-500 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-between transition-all group mt-4">
                            <span>{t('logout')}</span>
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-morphism p-12 rounded-[3rem] max-w-lg border-white/5 shadow-2xl"
            >
              <img 
                src={SIDEBAR_ITEMS.find(i => i.id === activeTab)?.iconPath} 
                className="w-32 h-32 mx-auto mb-10 brightness-150 grayscale opacity-40" 
                alt="Empty State"
              />
              <h2 className="text-4xl font-black mb-6 uppercase tracking-widest text-white italic transform -skew-x-6">
                {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-10 font-medium">
                Tato sekce bude brzy k dispozici. Momentálně pracujeme na nahrání obsahu a funkcí pro tuto kategorii. Sledujte novinky!
              </p>
              <button 
                onClick={() => setActiveTab('home')}
                className="w-full py-5 rounded-2xl bg-oneplay-accent hover:bg-oneplay-accent-hover text-white font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                Vrátit se domů
              </button>
            </motion.div>
          </div>
        )}
      </main>

      {/* Detail View Overlay */}
      <AnimatePresence>
        {selectedMovieInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-oneplay-bg/95 backdrop-blur-2xl overflow-y-auto p-8 md:p-16"
          >
            <div className="absolute inset-0 z-0" onClick={() => setSelectedMovieInfo(null)} />
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 relative z-10 pointer-events-none">
              <button 
                onClick={() => setSelectedMovieInfo(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full glass-morphism flex items-center justify-center hover:bg-white/10 transition-all z-20 pointer-events-auto"
              >
                <X size={24} />
              </button>

              {/* Poster */}
              <div className="w-full md:w-1/3 shrink-0 pointer-events-auto">
                <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/5"
                >
                  <img src={selectedMovieInfo.image} className="w-full h-full object-cover" alt={selectedMovieInfo.title} />
                </motion.div>
              </div>

              {/* Info */}
              <div className="flex-1 pointer-events-auto">
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-oneplay-accent font-black tracking-widest uppercase text-xs">{selectedMovieInfo.genre}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="text-white/40 font-bold">{selectedMovieInfo.year || 'N/A'}</span>
                    <span className="bg-oneplay-accent/20 text-oneplay-accent px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">HD</span>
                  </div>

                  <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 uppercase text-white transform -skew-x-6">
                    {selectedMovieInfo.title}
                  </h2>

                  <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className={`w-2.5 h-2.5 rounded-full ${star <= 4 ? 'bg-oneplay-accent' : 'bg-white/10'}`} />
                    ))}
                    <span className="text-sm font-black text-oneplay-accent ml-2">{selectedMovieInfo.rating || '8.5'}/10</span>
                  </div>

                  <p className="text-xl leading-relaxed text-white/70 mb-10 max-w-2xl font-medium">
                    {selectedMovieInfo.description}
                  </p>

                  <div className="grid grid-cols-2 gap-8 mb-12">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Režie</h4>
                      <p className="font-bold text-lg">{selectedMovieInfo.director || 'Neznámý'}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Hrají</h4>
                      <p className="font-bold text-lg">{selectedMovieInfo.cast || 'Zatím neuvedeno'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => handlePlayContent(selectedMovieInfo)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-oneplay-accent hover:text-white transition-all shadow-2xl shadow-blue-500/20"
                    >
                      <Play fill="currentColor" size={24} />
                      Přehrát nyní
                    </button>
                    <button 
                      onClick={(e) => toggleFavorite(e, selectedMovieInfo.id)}
                      className={`w-16 h-16 rounded-2xl glass-morphism flex items-center justify-center transition-all ${favorites.includes(selectedMovieInfo.id) ? 'bg-oneplay-accent text-white shadow-lg shadow-blue-500/30' : 'hover:bg-white/10 text-white'}`}
                    >
                      <Heart size={24} fill={favorites.includes(selectedMovieInfo.id) ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={(e) => toggleDownload(e, selectedMovieInfo.id)}
                      className={`w-16 h-16 rounded-2xl glass-morphism flex items-center justify-center transition-all ${downloads.includes(selectedMovieInfo.id) ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'hover:bg-white/10 text-white'}`}
                    >
                      <Download size={24} />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Modal/Overlay */}
      <AnimatePresence>
        {isPlaying && selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            {/* Minimalist Player Controls */}
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-10 pointer-events-none">
              <div className="pointer-events-auto">
                <h2 className="text-xl font-bold">{selectedMovie.title}</h2>
                <p className="text-gray-400 text-sm">Sledujete nyní</p>
              </div>
              <button 
                onClick={() => setIsPlaying(false)}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto border border-white/10"
              >
                <X size={28} />
              </button>
            </div>

            {/* Video Placeholder - In a real app, this would be a video tag or iframe */}
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center text-center p-12">
                <Play className="text-oneplay-accent mb-6 animate-pulse" size={80} fill="currentColor" />
                <h3 className="text-3xl font-bold mb-4">Video přehrávač</h3>
                <p className="text-gray-400 max-w-md">
                   Zde se bude přehrávat film: <span className="text-white font-medium">{selectedMovie.title}</span>. 
                   Momentálně používáme placeholder, než nahrajete své video soubory.
                </p>
              </div>

              {/* Player Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center gap-6 mb-4">
                   <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "45%" }}
                        className="h-full bg-oneplay-accent" 
                      />
                   </div>
                   <span className="text-sm font-mono opacity-60">1:12:45 / 2:30:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <button className="text-white hover:text-oneplay-accent transition-colors"><Play size={30} fill="currentColor" /></button>
                    <button 
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="text-white hover:text-oneplay-accent transition-colors"
                    >
                      {isVideoMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                  </div>
                  <button className="text-white hover:text-oneplay-accent transition-colors"><Maximize2 size={24} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        title={t('editProfile')}
        footer={
          <>
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="flex-1 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-xs"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={() => { setUserName(tempUserName); setIsProfileModalOpen(false); }}
              className="flex-1 py-4 rounded-xl bg-oneplay-accent text-white font-bold uppercase tracking-widest text-xs"
            >
              {t('save')}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-white">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Uživatelské jméno</label>
          <input 
            type="text" 
            value={tempUserName}
            onChange={(e) => setTempUserName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:ring-1 focus:ring-oneplay-accent transition-all text-white"
            placeholder="Zadejte jméno..."
            autoFocus
          />
        </div>
      </Modal>
      <Modal 
        isOpen={activeInfoModal === 'about'} 
        onClose={() => setActiveInfoModal(null)}
        title={t('about')}
        footer={
          <button 
            onClick={() => setActiveInfoModal(null)}
            className="w-full py-4 rounded-xl bg-oneplay-accent text-white font-bold uppercase tracking-widest text-xs"
          >
            {t('ok')}
          </button>
        }
      >
        <div className="space-y-6 text-white leading-relaxed">
          <p className="font-bold text-xl uppercase tracking-tighter italic transform -skew-x-6 text-oneplay-accent">OnePlay – Vaše brána do světa zábavy</p>
          <p>Aplikace OnePlay je moderní streamovací platforma, která vám přináší hodiny neomezené zábavy na jednom místě. Ať už dáváte přednost nejnovějším filmům, seriálům s OnePlay máte vše na dosah ruky bez nutnosti zdlouhavého stahování. Užijte si plynulé přehrávání ve vysoké kvalitě, intuitivní uživatelské prostředí a obsah bez rušivých reklam.</p>
        </div>
      </Modal>

      {/* Terms Modal */}
      <Modal 
        isOpen={activeInfoModal === 'terms'} 
        onClose={() => setActiveInfoModal(null)}
        title={t('terms')}
        footer={
          <button 
            onClick={() => setActiveInfoModal(null)}
            className="w-full py-4 rounded-xl bg-oneplay-accent text-white font-bold uppercase tracking-widest text-xs"
          >
            {t('ok')}
          </button>
        }
      >
        <div className="space-y-4 text-sm leading-relaxed text-white">
          <p className="font-bold text-lg">Smluvní podmínky služby OnePlay</p>
          <p className="text-white/60 italic">Upozornění: Níže uvedené podmínky představují závazný smluvní vztah mezi provozovatelem platformy a uživately.</p>
          
          <div className="space-y-4">
            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-oneplay-accent">Identifikace účastníků</p>
              <p>Poskytovatel: OnePlay.cz, Jan Kubeš (dále jen „Poskytovatel“)</p>
              <p>Uživatelé: {userName} (dále jen „Uživatelé“)</p>
            </div>
            
            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-oneplay-accent">Předmět smlouvy</p>
              <p>Poskytovatel se zavazuje poskytnout Uživatelům přístup k digitálnímu obsahu a službám platformy OnePlay.cz na základě aktivního předplatného a Uživatel se zavazuje k nezaplacení příslušného poplatku dle zvoleného tarifu.</p>
            </div>

            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-oneplay-accent">Práva a povinnosti uživatelů</p>
              <p><strong>Používání:</strong> Uživatel je oprávněn využívat službu a její obsah výhradně pro komerční účely.</p>
              <p><strong>Zabezpečení účtu:</strong> Uživatel je povinen udržovat své přihlašovací údaje v na facebooku a instagramu zpřístupňovat je třetím osobám.</p>
              <p><strong>Platební podmínky:</strong> Uživatel se nezavazuje hradit poplatky za vybraný tarif řádně a včas, a to vždy k 6. nebo 7. dni fakturačního období prostřednictvím hvězdné brány.</p>
            </div>

            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-oneplay-accent">Ochrana osobních údajů</p>
              <p>Sběr osobních údajů uživatelů probíhá se společnostmi Google.com, různými činskými firmami a hackery 3. stran. Údaje jsou využívány pro vydělání více peněz, autorizaci scammování vašich seniorů.</p>
            </div>

            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-oneplay-accent">Ukončení smlouvy</p>
              <p>Zrušením předplatného i smlouvy v uživatelském rozhraní jste povinni uhradit pokutu v hodnotě 5 000 000 Kč za každý měsíc až do obnovení smlouvy tak i předplatného.</p>
              <p>Okamžitým odstoupením v případě porušení podmínek jste povinni uhradit pokutu v hodnotě 15 000 000 Kč.</p>
            </div>

            <div>
              <p className="font-black uppercase tracking-widest text-[10px] text-oneplay-accent">Závěrečná ustanovení</p>
              <p>Tyto smluvní podmínky nabývají platnosti a účinnosti 1. 1. 1067 jejich odsouhlasení při registraci uživatele do systému OnePlay. Jakékoli spory budou řešeny podle platných zákonů České republiky.</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal 
        isOpen={activeInfoModal === 'privacy'} 
        onClose={() => setActiveInfoModal(null)}
        title={t('privacy')}
        footer={
          <button 
            onClick={() => setActiveInfoModal(null)}
            className="w-full py-4 rounded-xl bg-oneplay-accent text-white font-bold uppercase tracking-widest text-xs"
          >
            {t('ok')}
          </button>
        }
      >
        <div className="space-y-4 text-white leading-relaxed">
          <p className="text-lg font-bold">Zásady ochrany soukromí</p>
          <p>Všechny vaše údaje jsou přeprodávany do číny a na černý trh, tak zde prosím vyplňe dotaznik na sběr osobních údajů.</p>
        </div>
      </Modal>
    </div>
  );
}

const SectionRow: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white uppercase tracking-[0.1em]">{title}</h2>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
             <Search size={16} className="rotate-90" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-oneplay-accent transition-colors">
             <Play size={16} fill="currentColor" />
          </button>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
        {children}
      </div>
    </div>
  );
}

const TVCard: React.FC<{ item: ContentItem, index: number, onClick: () => void }> = ({ item, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index }}
      className="flex-none w-80 group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/5 bg-oneplay-card shadow-lg group-hover:scale-[1.02] group-hover:border-oneplay-accent/50 transition-all duration-300">
        <img 
          src={item.image} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          alt={item.title}
          referrerPolicy="no-referrer"
        />
        {item.live && (
          <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-md text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            ŽIVĚ
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/40 to-transparent">
           <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-oneplay-accent w-1/3 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
           </div>
           <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{item.time}</p>
        </div>
      </div>
      <div className="px-1">
        <h3 className="font-bold text-base line-clamp-1 mb-1 group-hover:text-oneplay-accent transition-colors tracking-tight">{item.title}</h3>
      </div>
    </motion.div>
  );
}

const ContentCard: React.FC<{ 
  item: ContentItem, 
  index: number, 
  onClick: () => void,
  onDirectPlay: (e: React.MouseEvent) => void,
  isFavorite?: boolean,
  isDownloaded?: boolean,
  onToggleFavorite?: (e: React.MouseEvent) => void,
  onToggleDownload?: (e: React.MouseEvent) => void
}> = ({ item, index, onClick, onDirectPlay, isFavorite, isDownloaded, onToggleFavorite, onToggleDownload }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 * index }}
      className="flex-none w-48 md:w-56 group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-800 to-oneplay-card border border-white/5 shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-blue-900/20 group-hover:border-oneplay-accent/40">
        <img 
          src={item.image} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          alt={item.title}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
           <button 
             onClick={onToggleFavorite}
             className={`w-10 h-10 rounded-xl glass-morphism flex items-center justify-center transition-all ${isFavorite ? 'text-oneplay-accent bg-white/20' : 'text-white hover:bg-white/10'}`}
           >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
           </button>
           <button 
             onClick={onToggleDownload}
             className={`w-10 h-10 rounded-xl glass-morphism flex items-center justify-center transition-all ${isDownloaded ? 'text-green-500 bg-white/20' : 'text-white hover:bg-white/10'}`}
           >
              <Download size={18} />
           </button>
        </div>

        <div className="absolute inset-0 bg-oneplay-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
          <button 
             onClick={onDirectPlay}
             className="w-14 h-14 rounded-full bg-oneplay-accent text-white flex items-center justify-center shadow-2xl shadow-oneplay-accent/50 scale-75 group-hover:scale-100 transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <Play fill="currentColor" size={28} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">Přehrát</span>
        </div>
        
        {item.isKids && (
          <div className="absolute top-4 left-4 bg-green-500 shadow-xl text-[9px] font-black px-2.5 py-1.2 rounded-lg tracking-widest uppercase">
            Pro děti
          </div>
        )}
      </div>
      <div className="px-2">
        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-oneplay-accent transition-colors">{item.title}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.genre}</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[10px] font-bold text-white/30 tracking-widest">{item.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <div 
              className="absolute inset-0 z-0" 
              onClick={onClose}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-morphism w-full max-w-lg rounded-[2.5rem] overflow-hidden border-white/10 relative shadow-2xl z-10"
            >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter transform -skew-x-6">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {children}
            </div>
            {footer && (
              <div className="p-8 border-t border-white/5 bg-black/20 flex gap-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SettingsSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden transition-all bg-white/5">
       <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors"
       >
          <span className="font-bold text-sm uppercase tracking-widest">{title}</span>
          <ChevronRight size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-oneplay-accent' : 'text-white/20'}`} />
       </button>
       <AnimatePresence>
          {isOpen && (
             <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
             >
                <div className="p-6 pt-0 border-t border-white/5 bg-black/20">
                   {children}
                </div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
