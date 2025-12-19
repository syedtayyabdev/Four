import React, { useState } from 'react';
import { ViewState, MenuItem, CartItem, ProductSize, Addon } from '../types';
import { Button } from './ui/Button';
import { ArrowLeft, Star, Clock, Flame, Check } from 'lucide-react';

interface ProductDetailScreenProps {
  item: MenuItem | null;
  onNavigate: (view: ViewState) => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ item, onNavigate, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(item?.sizes?.[0]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  if (!item) return null;

  const toggleAddon = (addon: Addon) => {
    if (selectedAddons.find(a => a.name === addon.name)) {
      setSelectedAddons(prev => prev.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons(prev => [...prev, addon]);
    }
  };

  const calculateTotal = () => {
    let total = selectedSize ? selectedSize.price : item.price;
    total += selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return total * quantity;
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      ...item,
      cartItemId: Math.random().toString(36).substr(2, 9),
      quantity,
      selectedSize,
      selectedAddons,
      price: selectedSize ? selectedSize.price : item.price, 
      instructions
    };
    onAddToCart(cartItem);
    onNavigate('menu');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-brand-black flex flex-col overflow-y-auto pb-safe animate-fade-in">
        {/* Header Image */}
        <div className="relative h-72 w-full shrink-0">
            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent" />
            <button 
                onClick={() => onNavigate('menu')}
                className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white z-10 hover:scale-110 hover:bg-brand-red/80 transition-all premium-hover"
            >
                <ArrowLeft size={20} />
            </button>
        </div>

        <div className="px-6 -mt-10 relative flex-grow pb-32">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-black text-white italic uppercase leading-none w-3/4 tracking-tighter">{item.name}</h1>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-brand-red italic shadow-sm">RS {item.price}</span>
                </div>
            </div>

            <div className="flex gap-4 text-xs text-gray-400 mb-6">
                <div className="flex items-center gap-1"><Star size={12} className="text-brand-gold fill-current" /> {item.rating} ({item.reviewCount})</div>
                <div className="flex items-center gap-1"><Clock size={12} /> {item.prepTime}</div>
                <div className="flex items-center gap-1"><Flame size={12} /> 350 kcal</div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">{item.description}</p>

            {/* Sizes */}
            {item.sizes && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-white uppercase mb-3 italic tracking-widest">Choose Size</h3>
                    <div className="space-y-2">
                        {item.sizes.map((size) => (
                            <div 
                                key={size.name}
                                onClick={() => setSelectedSize(size)}
                                className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all premium-hover ${selectedSize?.name === size.name ? 'border-brand-red bg-brand-red/10 shadow-[0_0_20px_rgba(220,20,60,0.15)] scale-[1.02]' : 'border-gray-800 bg-gray-900'}`}
                            >
                                <span className={`font-bold transition-colors ${selectedSize?.name === size.name ? 'text-white italic' : 'text-gray-400'}`}>{size.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 text-sm font-bold">RS {size.price}</span>
                                    {selectedSize?.name === size.name && <div className="w-5 h-5 bg-brand-red rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(220,20,60,0.8)]"><Check size={12} className="text-white" /></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Addons */}
            {item.addons && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-white uppercase mb-3 italic tracking-widest">Add Extras</h3>
                    <div className="space-y-2">
                        {item.addons.map((addon) => {
                            const isSelected = selectedAddons.some(a => a.name === addon.name);
                            return (
                                <div 
                                    key={addon.name}
                                    onClick={() => toggleAddon(addon)}
                                    className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all premium-hover ${isSelected ? 'border-brand-red bg-brand-red/10 shadow-[0_0_15px_rgba(220,20,60,0.1)] scale-[1.01]' : 'border-gray-800 bg-gray-900'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-brand-red border-brand-red shadow-[0_0_8px_rgba(220,20,60,0.5)]' : 'border-gray-600'}`}>
                                            {isSelected && <Check size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-white italic' : 'text-gray-400'}`}>{addon.name}</span>
                                    </div>
                                    <span className="text-gray-500 text-sm font-bold">+ RS {addon.price}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-white uppercase mb-3 italic tracking-widest">Special Instructions</h3>
                <textarea 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="E.g. No onions, extra spicy..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-brand-red transition-all font-medium premium-hover"
                    rows={3}
                />
            </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center gap-4 z-50">
             <div className="flex items-center gap-3 bg-gray-900 rounded-full px-4 py-3 border border-gray-800 shadow-inner">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white text-xl font-bold w-6 hover:scale-125 transition-transform">-</button>
                  <span className="text-white font-black italic min-w-[20px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-white text-xl font-bold w-6 hover:scale-125 transition-transform hover:text-brand-red">+</button>
             </div>
             <Button fullWidth onClick={handleAddToCart} className="shadow-[0_10px_30px_-10px_rgba(220,20,60,0.6)]">
                Add • RS {calculateTotal()}
             </Button>
        </div>
    </div>
  );
};