import React from 'react';
import { MenuItem } from '../../types';
import { Plus, Info } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  onAdd: (e: React.MouseEvent, item: MenuItem) => void;
  onDetail?: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onAdd, onDetail }) => {
  return (
    <div 
      className="bg-brand-card rounded-2xl overflow-hidden border border-gray-800 shadow-lg flex flex-col h-full relative group transition-all duration-500 ease-out hover:scale-[1.05] hover:border-brand-red/60 hover:shadow-[0_0_30px_rgba(220,20,60,0.35)]"
      onClick={() => onDetail?.(item)}
    >
      {item.isPopular && (
        <div className="absolute top-3 left-3 bg-brand-gold text-black text-[9px] font-black px-3 py-1.5 rounded-full z-20 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(255,215,0,0.3)] animate-glow italic transform transition-all duration-500 group-hover:rotate-[-4deg] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]">
          Best Seller
        </div>
      )}
      
      <div className="relative h-40 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* View Details Overlay Button - Visible on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <button 
                onClick={(e) => { e.stopPropagation(); onDetail?.(item); }}
                className="bg-brand-black/80 border border-brand-red text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(220,20,60,0.5)] transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
            >
                <Info size={12} className="text-brand-red" /> View Details
            </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow relative">
        <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-brand-red transition-colors italic">{item.name}</h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-grow font-medium">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800/50">
          <div className="flex flex-col">
              <span className="text-xl font-black text-white italic">
                <span className="text-[10px] align-top text-brand-red mr-1 not-italic">RS</span>
                {item.price}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); onDetail?.(item); }}
                className="text-[9px] font-bold text-brand-red uppercase tracking-widest mt-1 hover:underline text-left"
              >
                View Details
              </button>
          </div>
          
          <button 
            onClick={(e) => onAdd(e, item)}
            className="w-11 h-11 rounded-2xl bg-brand-red flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,20,60,0.3)] hover:scale-110 hover:shadow-[0_0_25px_rgba(220,20,60,0.7)] active:scale-90 transition-all duration-300"
            aria-label="Add to cart"
          >
            <Plus size={22} strokeWidth={3} />
          </button>
        </div>
      </div>
      
      {/* Red Neon Border Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-brand-red/40 pointer-events-none transition-all duration-500 shadow-[0_0_0_rgba(220,20,60,0)] group-hover:shadow-[inset_0_0_15px_rgba(220,20,60,0.1)]" />
    </div>
  );
};