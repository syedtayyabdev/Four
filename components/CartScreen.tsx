import React, { useState } from 'react';
import { CartItem, ViewState, Order } from '../types';
import { Button } from './ui/Button';
import { Minus, Plus, Trash2, Smartphone, Ticket, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CartScreenProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onNavigate: (view: ViewState) => void;
  onPlaceOrder: (order: Order) => void;
}

const VALID_COUPONS: Record<string, { type: 'percent' | 'flat', value: number, description: string }> = {
  'FIRST20': { type: 'percent', value: 0.20, description: '20% Welcome Discount Applied' },
  'FOURSMASH': { type: 'flat', value: 300, description: 'RS 300 Smash Credit Applied' },
  'LAHORE50': { type: 'percent', value: 0.50, description: '50% Lahore Special Applied' },
};

export const CartScreen: React.FC<CartScreenProps> = ({ items, onUpdateQuantity, onRemove, onNavigate }) => {
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => {
    let price = item.price;
    if(item.selectedAddons) {
        price += item.selectedAddons.reduce((s, a) => s + a.price, 0);
    }
    return sum + (price * item.quantity);
  }, 0);
  
  const deliveryFee = 150;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);
    const code = coupon.toUpperCase().trim();

    if (!code) {
      setCouponError('Please enter a mission code');
      return;
    }

    if (appliedCoupon === code) {
      setCouponError('This code is already active');
      return;
    }

    const couponData = VALID_COUPONS[code];

    if (couponData) {
      let calculatedDiscount = 0;
      if (couponData.type === 'percent') {
        calculatedDiscount = subtotal * couponData.value;
      } else {
        calculatedDiscount = couponData.value;
      }

      setDiscount(calculatedDiscount);
      setAppliedCoupon(code);
      setCouponSuccess(couponData.description);
      setCoupon('');
    } else {
      const expiredCodes = ['RAMADAN', 'EID2024'];
      if (expiredCodes.includes(code)) {
        setCouponError('This code has expired');
      } else {
        setCouponError('Invalid mission code. Use FIRST20');
      }
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponSuccess(null);
  };

  const handleCheckout = () => {
    onNavigate('checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-gray-600">
            <Smartphone size={32} />
        </div>
        <h2 className="text-xl font-bold text-white uppercase italic">Your Box is Empty</h2>
        <Button onClick={() => onNavigate('menu')} variant="outline" className="mt-4">
          Go to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Your Box</h2>
        <span className="text-xs font-bold text-brand-red bg-brand-red/10 px-3 py-1 rounded-full border border-brand-red/20 uppercase tracking-widest">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {/* Scrollable Items Area */}
      <div className="space-y-4 pb-64">
        {items.map(item => (
          <div key={item.cartItemId} className="bg-brand-card p-4 rounded-2xl border border-gray-800 flex gap-4 relative group premium-hover">
            <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <div className="flex-grow flex flex-col justify-between py-0.5">
              <div className="flex justify-between items-start">
                <div className="pr-8 space-y-1">
                    <h3 className="font-bold text-white text-sm leading-tight uppercase italic group-hover:text-brand-red transition-colors">{item.name}</h3>
                    
                    {/* Size Display */}
                    {item.selectedSize && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-brand-red"></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.selectedSize.name}</p>
                        </div>
                    )}

                    {/* Addons Display */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.selectedAddons.map((addon, idx) => (
                                <span key={idx} className="text-[9px] font-bold bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                    + {addon.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => onRemove(item.cartItemId)} 
                    className="text-gray-600 hover:text-red-500 absolute top-4 right-4 p-1 rounded-full hover:bg-red-500/10 transition-all hover:scale-125"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <span className="font-black text-white text-base">
                    <span className="text-[10px] text-brand-red mr-0.5">RS</span>
                    {(item.price + (item.selectedAddons?.reduce((s,a)=>s+a.price,0) || 0)) * item.quantity}
                </span>
                
                <div className="flex items-center gap-3 bg-black/50 rounded-xl p-1 border border-gray-800/50 shadow-inner">
                  <button 
                    onClick={() => onUpdateQuantity(item.cartItemId, -1)} 
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all hover:scale-110"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-black text-white min-w-[20px] text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.cartItemId, 1)} 
                    className="w-7 h-7 flex items-center justify-center text-white bg-brand-red rounded-lg shadow-lg shadow-brand-red/20 active:scale-90 transition-all hover:scale-110 hover:shadow-[0_0_12px_rgba(220,20,60,0.5)]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Coupon Section */}
        <div className="space-y-3">
            <div className="bg-brand-card rounded-2xl p-4 flex gap-3 border border-gray-800 items-center premium-hover">
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-brand-red">
                    <Ticket size={20} />
                </div>
                <input 
                    type="text" 
                    placeholder="PROMO CODE (TRY FIRST20)" 
                    value={coupon}
                    onChange={e => {
                      setCoupon(e.target.value);
                      setCouponError(null);
                    }}
                    className="bg-transparent flex-grow outline-none text-white text-xs font-black uppercase tracking-widest placeholder:text-gray-700"
                />
                <button 
                    onClick={handleApplyCoupon} 
                    className="bg-gray-900 border border-gray-800 hover:border-brand-red hover:text-brand-red text-gray-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
                >
                    Apply
                </button>
            </div>

            {couponError && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-900/10 border border-red-900/20 rounded-xl text-[10px] font-black text-red-500 uppercase tracking-widest animate-shake">
                <AlertCircle size={14} /> {couponError}
              </div>
            )}

            {couponSuccess && (
              <div className="flex items-center justify-between px-4 py-2 bg-green-900/10 border border-green-900/20 rounded-xl text-[10px] font-black text-green-500 uppercase tracking-widest animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} /> {couponSuccess}
                </div>
                <button onClick={removeCoupon} className="text-gray-500 hover:text-white underline">Remove</button>
              </div>
            )}
        </div>
      </div>

      {/* Fixed Bottom Checkout Section */}
      <div className="fixed bottom-[4.5rem] left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-gray-800 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 rounded-t-[2.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.8)]">
         <div className="space-y-2 mb-4 px-2">
             <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>RS {subtotal}</span>
             </div>
             {discount > 0 && (
                 <div className="flex justify-between text-[10px] font-black text-brand-red uppercase tracking-widest">
                    <span>Discount</span>
                    <span>- RS {Math.round(discount)}</span>
                 </div>
             )}
              <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <span>Delivery Fee</span>
                <span>RS {deliveryFee}</span>
             </div>
         </div>

         <div className="flex justify-between items-end mb-6 px-2">
            <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Total Bill</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-xs font-black text-brand-red">RS</span>
                    <span className="text-3xl font-black text-white italic tracking-tighter">{Math.round(total)}</span>
                </div>
            </div>
            <div className="text-right">
                <span className="text-[10px] bg-green-500/10 text-green-500 font-black px-2 py-1 rounded-md uppercase tracking-widest border border-green-500/20">
                    COD ONLY
                </span>
            </div>
         </div>

         <Button fullWidth onClick={handleCheckout} className="h-16 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(220,20,60,0.5)]">
            Confirm Order Details <ChevronRight size={18} />
         </Button>
      </div>
    </div>
  );
};