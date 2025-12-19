import React, { useState } from 'react';
import { CATEGORIES, MENU_ITEMS } from '../constants';
import { MenuItem, Category, ViewState } from '../types';
import { ProductCard } from './ui/ProductCard';
import { ArrowLeft, Search } from 'lucide-react';

interface MenuScreenProps {
  onAddToCart: (item: MenuItem, e?: React.MouseEvent) => void;
  onProductClick: (item: MenuItem) => void;
  onNavigate: (view: ViewState) => void;
}

type TabType = 'Order Now' | 'Sides' | 'Drinks' | 'Categories';

export const MenuScreen: React.FC<MenuScreenProps> = ({ onAddToCart, onProductClick, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Categories');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const getFilteredItems = () => {
    let items = MENU_ITEMS;
    
    // Primary Tab Filtering
    if (activeTab === 'Sides') {
      items = items.filter(item => item.category === 'Fries' || item.category === 'Wings');
    } else if (activeTab === 'Drinks') {
      items = items.filter(item => item.category === 'Drinks' || item.category === 'Shakes');
    }

    // Secondary Category Filtering (only if 'Categories' tab is active or for sub-filtering)
    if (activeTab === 'Categories' && activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  const handleTabChange = (tab: TabType) => {
    if (tab === 'Order Now') {
      onNavigate('home');
    } else {
      setActiveTab(tab);
      setActiveCategory('All');
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Menu</h2>
        <div className="w-10 h-10 rounded-full bg-brand-card border border-gray-800 flex items-center justify-center text-gray-500 hover:text-brand-red hover:border-brand-red transition-all cursor-pointer">
           <Search size={18} />
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex bg-brand-card p-1.5 rounded-2xl border border-gray-800 shadow-2xl">
          {(['Order Now', 'Sides', 'Drinks', 'Categories'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${activeTab === tab ? 'bg-brand-red text-white shadow-lg italic' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {tab}
              </button>
          ))}
      </div>

      {/* Secondary Category Bar (Only visible on Categories tab) */}
      {activeTab === 'Categories' && (
        <div className="sticky top-16 z-40 bg-brand-black/95 backdrop-blur-md py-2 -mx-4 px-4 border-b border-gray-800 flex overflow-x-auto gap-3 scrollbar-hide">
            <button
                onClick={() => setActiveCategory('All')}
                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-[10px] font-black border transition-all uppercase tracking-widest italic premium-hover ${
                    activeCategory === 'All' 
                    ? 'bg-brand-red text-white border-brand-red shadow-[0_0_15px_rgba(220,20,60,0.3)]' 
                    : 'bg-brand-card text-gray-500 border-gray-800'
                }`}
            >
                All
            </button>
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as Category)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-[10px] font-black border transition-all uppercase tracking-widest italic premium-hover ${
                    activeCategory === cat.id 
                        ? 'bg-brand-red text-white border-brand-red shadow-[0_0_15px_rgba(220,20,60,0.3)]' 
                        : 'bg-brand-card text-gray-500 border-gray-800'
                    }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[50vh] pt-2">
        {filteredItems.length > 0 ? (
            filteredItems.map(item => (
                <div key={item.id} className="animate-fade-in">
                    <ProductCard 
                      item={item} 
                      onAdd={(e, itemData) => {e.stopPropagation(); onAddToCart(itemData, e)}} 
                      onDetail={onProductClick}
                    />
                </div>
            ))
        ) : (
            <div className="col-span-2 py-40 text-center text-gray-700 font-black uppercase text-xs tracking-widest flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-2xl opacity-20">🍽️</div>
                No Items Found
            </div>
        )}
      </div>
    </div>
  );
};