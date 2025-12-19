import React, { useState, useEffect } from 'react';
import { ViewState, MenuItem, Category } from '../types';
import { BANNERS, CATEGORIES, MENU_ITEMS } from '../constants';
import { MapPin, Search, Bell, Flame, ChevronRight, Mic, X } from 'lucide-react';
import { ProductCard } from './ui/ProductCard';

interface HomeScreenProps {
  onNavigate: (view: ViewState) => void;
  onAddToCart: (item: MenuItem, e?: React.MouseEvent) => void;
  onProductClick: (item: MenuItem) => void;
}

type TabType = 'Order Now' | 'Sides' | 'Drinks' | 'Categories';

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onAddToCart, onProductClick }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Order Now');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Auto-cycle banners
  useEffect(() => {
    if (searchQuery) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [searchQuery]);

  const getFilteredItems = () => {
    let items = MENU_ITEMS;
    
    if (searchQuery.trim()) {
      return items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeTab) {
      case 'Sides':
        return items.filter(item => item.category === 'Fries' || item.category === 'Wings');
      case 'Drinks':
        return items.filter(item => item.category === 'Drinks' || item.category === 'Shakes');
      default:
        return items.filter(item => item.isPopular).slice(0, 4);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };

    recognition.start();
  };

  const featuredItems = getFilteredItems();

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Section */}
      <div className="flex justify-between items-end">
        <div>
           <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">Delivering to</p>
           <div className="flex items-center gap-1 text-brand-red cursor-pointer premium-hover rounded-lg p-1" onClick={() => onNavigate('profile')}>
              <MapPin size={14} className="animate-bounce" />
              <span className="text-white font-black text-xs truncate max-w-[180px] uppercase italic">DHA Phase 6, Lahore</span>
           </div>
        </div>
        <button 
          onClick={() => onNavigate('notifications')}
          className="bg-brand-card p-2.5 rounded-full border border-gray-800 text-gray-400 hover:text-white relative active:scale-95 transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,20,60,0.3)] hover:border-brand-red/50"
        >
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-red rounded-full border-2 border-black animate-pulse"></span>
        </button>
      </div>

      {/* Search Bar with Voice Control */}
      <div className="relative group">
         {isListening && (
           <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce z-10">
              <div className="bg-brand-red text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(220,20,60,0.5)] uppercase tracking-[0.2em] flex items-center gap-2 border border-white/20">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                 Listening...
              </div>
           </div>
         )}
         
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-red transition-colors" size={18} />
         <input 
            type="text" 
            placeholder="Search burgers, pizzas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-brand-card border rounded-2xl py-4 pl-12 pr-12 text-white text-sm outline-none transition-all shadow-xl font-medium ${isListening ? 'border-brand-red ring-4 ring-brand-red/10' : 'border-gray-800 focus:border-brand-red'}`}
         />
         <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-2 text-gray-600 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
            <button 
                onClick={startVoiceSearch}
                className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isListening ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(220,20,60,0.6)]' : 'text-gray-600 hover:text-brand-red hover:bg-brand-card'}`}
                aria-label="Voice Search"
            >
                {isListening ? (
                  <div className="flex gap-0.5 items-center justify-center h-4">
                     <div className="w-0.5 h-full bg-white animate-voice-wave [animation-delay:-0.4s]"></div>
                     <div className="w-0.5 h-full bg-white animate-voice-wave [animation-delay:-0.2s]"></div>
                     <div className="w-0.5 h-full bg-white animate-voice-wave"></div>
                  </div>
                ) : (
                  <Mic size={18} />
                )}
            </button>
         </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex bg-brand-card p-1.5 rounded-2xl border border-gray-800 shadow-2xl">
          {(['Order Now', 'Sides', 'Drinks', 'Categories'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => tab === 'Categories' ? onNavigate('menu') : setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${activeTab === tab && !searchQuery ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 italic' : 'text-gray-500 hover:text-gray-300 hover:text-brand-red'}`}
              >
                {tab}
              </button>
          ))}
      </div>

      {!searchQuery && activeTab === 'Order Now' && (
          <>
            {/* Premium Animated Banners Slider */}
            <div className="relative h-48 w-full rounded-[2rem] overflow-hidden shadow-2xl group premium-hover">
                {BANNERS.map((banner, index) => (
                    <div 
                        key={banner.id} 
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        onClick={() => onNavigate('menu')}
                    >
                        <img 
                            src={banner.image} 
                            alt={banner.title} 
                            className={`w-full h-full object-cover ${index === currentBanner ? 'animate-ken-burns' : ''}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-10">
                            <span className={`text-brand-red font-black text-[11px] tracking-[0.4em] mb-2 uppercase italic ${index === currentBanner ? 'animate-fade-in stagger-1' : 'opacity-0'}`}>
                                {banner.title}
                            </span>
                            <h3 className={`text-white font-black text-3xl w-3/4 leading-[0.85] uppercase italic mb-5 ${index === currentBanner ? 'animate-fade-in stagger-2' : 'opacity-0'}`}>
                                {banner.subtitle}
                            </h3>
                            <div className={`flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] group-hover:gap-4 transition-all ${index === currentBanner ? 'animate-fade-in stagger-3' : 'opacity-0'}`}>
                                MISSION START <ChevronRight size={14} className="text-brand-red" />
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Dots Indicators */}
                <div className="absolute bottom-4 left-10 z-20 flex gap-2">
                    {BANNERS.map((_, idx) => (
                        <div 
                            key={idx} 
                            onClick={(e) => { e.stopPropagation(); setCurrentBanner(idx); }}
                            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${idx === currentBanner ? 'w-8 bg-brand-red shadow-[0_0_10px_rgba(220,20,60,0.8)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                        />
                    ))}
                </div>
                
                {/* Glassmorphic Badge Overlay */}
                <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Limited Offer</span>
                </div>
            </div>

            {/* Categories Quick Access */}
            <div>
                <div className="flex justify-between items-end mb-4 px-1">
                    <h2 className="text-sm font-black text-white uppercase italic tracking-widest">Categories</h2>
                    <button onClick={() => onNavigate('menu')} className="text-[10px] text-brand-red font-black uppercase tracking-widest">See All</button>
                </div>
                <div className="flex gap-4 overflow-x-auto -mx-4 px-4 scrollbar-hide">
                    {CATEGORIES.slice(0, 5).map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => onNavigate('menu')}
                            className="flex flex-col items-center gap-3 min-w-[70px] group"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-brand-card border border-gray-800 flex items-center justify-center text-2xl shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:border-brand-red group-hover:shadow-[0_0_20px_rgba(220,20,60,0.4)] group-active:scale-90">
                                {cat.emoji}
                            </div>
                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter group-hover:text-white transition-colors">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>
          </>
      )}

      {/* Featured Grid / Tab Content */}
      <div className="pt-2">
         <div className="flex justify-between items-center mb-4 px-1">
             <h2 className="text-lg font-black text-white flex items-center gap-2 italic uppercase">
                 {searchQuery ? (
                    <>Search results for "{searchQuery}"</>
                 ) : activeTab === 'Order Now' ? (
                    <><Flame size={20} className="text-brand-red animate-pulse" /> Trending Now</>
                 ) : (
                    activeTab
                 )}
             </h2>
             {!searchQuery && activeTab === 'Order Now' && (
                <button onClick={() => onNavigate('menu')} className="text-[10px] text-brand-red font-black uppercase tracking-widest">View All</button>
             )}
         </div>
         <div className="grid grid-cols-2 gap-4">
             {featuredItems.length > 0 ? (
                 featuredItems.map(item => (
                    <div key={item.id} className="animate-fade-in">
                        <ProductCard 
                          item={item} 
                          onAdd={(e, itemData) => { e.stopPropagation(); onAddToCart(itemData, e); }} 
                          onDetail={onProductClick}
                        />
                    </div>
                 ))
             ) : (
                <div className="col-span-2 py-20 text-center text-gray-600 font-black uppercase text-xs tracking-widest">
                    No items found {searchQuery ? 'matching your search' : 'in this category'}
                </div>
             )}
         </div>
      </div>
    </div>
  );
};