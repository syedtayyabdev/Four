
import React, { useState } from 'react';
import { CartItem, Order, ViewState, User, Address } from '../types';
import { Button } from './ui/Button';
import { MapPin, ArrowLeft, Wallet, Check, ChevronRight, ShoppingBag, ShieldCheck, Info, Home, Briefcase, Plus } from 'lucide-react';
import { api } from '../api';

interface OrderSuccessScreenProps {
  onNavigate: (view: ViewState) => void;
  cartItems: CartItem[];
  onPlaceOrder: (order: Order) => void;
  user: User | null;
  onUpdateUser?: (user: User) => void;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({ onNavigate, cartItems, onPlaceOrder, user, onUpdateUser }) => {
  const [isAddingAddress, setIsAddingAddress] = useState(user?.addresses.length === 0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(user?.addresses.find(a => a.isDefault) || user?.addresses[0] || null);
  const [exactChange, setExactChange] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  // Quick Address Form State
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    label: 'Home',
    area: '',
    city: 'Lahore',
    details: '',
  });

  const subtotal = cartItems.reduce((sum, item) => {
    let price = item.price;
    if(item.selectedAddons) price += item.selectedAddons.reduce((s, a) => s + a.price, 0);
    return sum + (price * item.quantity);
  }, 0);
  
  const deliveryFee = 0; 
  const total = subtotal + deliveryFee;

  const handleQuickAddAddress = () => {
    if (!user || !addressForm.details || !addressForm.area) {
        alert("Please enter both House/Street and Area.");
        return;
    }

    const newAddress: Address = {
        ...addressForm as Address,
        id: Math.random().toString(36).substr(2, 9),
        isDefault: user.addresses.length === 0
    };

    const updatedUser: User = { ...user, addresses: [...user.addresses, newAddress] };
    onUpdateUser?.(updatedUser);
    localStorage.setItem('four_app_user_v2', JSON.stringify(updatedUser));
    
    setSelectedAddress(newAddress);
    setIsAddingAddress(false);
  };

  const handlePlaceFinalOrder = async () => {
    if (isAddingAddress) {
        handleQuickAddAddress();
        return;
    }

    if (!selectedAddress) {
        setIsAddingAddress(true);
        return;
    }

    setLoading(true);
    try {
        const order = await api.createOrder({
            items: cartItems,
            total,
            paymentMethod: 'Cash on Delivery',
            deliveryAddress: selectedAddress,
            customerName: user?.name || 'Customer',
            customerPhone: user?.phone || '0000000000'
        });
        onPlaceOrder(order);
    } catch (e) {
        alert('Order failed. Try again.');
    } finally {
        setLoading(false);
    }
  };

  const renderAddressSection = () => {
    if (isAddingAddress) {
        return (
            <div className="bg-brand-card p-6 rounded-3xl border border-brand-red animate-fade-in space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Add Delivery Address</p>
                    {user?.addresses.length! > 0 && (
                        <button onClick={() => setIsAddingAddress(false)} className="text-[10px] text-gray-600 font-black uppercase">Cancel</button>
                    )}
                </div>
                
                <div className="flex gap-2 bg-black/50 p-1 rounded-xl mb-4">
                    {([
                        { id: 'Home', icon: Home },
                        { id: 'Office', icon: Briefcase }
                    ] as const).map(l => (
                        <button 
                            key={l.id}
                            onClick={() => setAddressForm({...addressForm, label: l.id})}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-[10px] font-black uppercase italic transition-all ${addressForm.label === l.id ? 'bg-brand-red text-white' : 'text-gray-600'}`}
                        >
                            <l.icon size={12} /> {l.id}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    <input 
                        type="text" 
                        placeholder="House / Flat / Street #" 
                        value={addressForm.details}
                        onChange={e => setAddressForm({...addressForm, details: e.target.value})}
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-brand-red outline-none"
                    />
                    <input 
                        type="text" 
                        placeholder="Area / Sector (e.g. DHA Phase 5)" 
                        value={addressForm.area}
                        onChange={e => setAddressForm({...addressForm, area: e.target.value})}
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-xs font-bold focus:border-brand-red outline-none"
                    />
                </div>
                <p className="text-[8px] text-gray-600 font-bold uppercase text-center mt-2">Required to initiate delivery mission</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Delivery Address</p>
                <button onClick={() => onNavigate('profile')} className="text-brand-red text-[10px] font-black uppercase tracking-widest">Change</button>
            </div>
            {selectedAddress ? (
                <div className="bg-brand-card p-5 rounded-2xl border border-brand-red shadow-[0_0_20px_rgba(220,20,60,0.1)]">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-brand-red" />
                        <span className="text-xs font-black text-white uppercase italic">{selectedAddress.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{selectedAddress.details}, {selectedAddress.area}</p>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="w-full bg-brand-card p-8 rounded-2xl border border-dashed border-brand-red/40 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all"
                >
                    <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red">
                        <Plus size={24} />
                    </div>
                    <p className="text-[10px] text-white font-black uppercase tracking-widest">Click to Enter Address</p>
                </button>
            )}
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-black pb-32 animate-fade-in relative px-6 pt-4">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => onNavigate('cart')} className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-white active:scale-95 transition-transform">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Checkout</h2>
        </div>

        <div className="space-y-6">
            {/* Delivery Location Section */}
            {renderAddressSection()}

            {/* Payment Section */}
            <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Payment Method</p>
                <div className="bg-brand-card p-5 rounded-2xl border border-brand-red flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-red/5 blur-3xl"></div>
                    <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center text-brand-red">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <span className="text-sm font-black text-white uppercase italic block">Cash on Delivery</span>
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Pay in person after delivery</span>
                        </div>
                    </div>
                    <div className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center relative">
                        <Check size={14} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-brand-card p-6 rounded-3xl border border-gray-800 space-y-4">
                <div className="flex justify-between items-end pt-2">
                    <span className="text-lg font-black text-white italic uppercase tracking-tighter">Total Bill</span>
                    <span className="text-2xl font-black text-brand-red italic tracking-tighter">RS {total}</span>
                </div>
            </div>

            {/* Instructions Banner */}
            <div className="bg-black/40 border border-gray-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-brand-gold">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Safe Operation Protocol</span>
                </div>
                <ul className="space-y-3">
                    {[
                        "Order will be prepared fresh",
                        "Show OTP code to rider for security",
                        "Pay total amount in cash only"
                    ].map((txt, i) => (
                        <li key={i} className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 shrink-0"></div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase leading-tight">{txt}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/95 backdrop-blur-md border-t border-gray-900 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-50">
            <Button 
                fullWidth 
                onClick={handlePlaceFinalOrder} 
                disabled={loading}
                className="h-16 rounded-2xl shadow-[0_0_30px_rgba(220,20,60,0.3)]"
            >
                {loading ? 'Processing...' : (isAddingAddress ? 'Save & Continue' : (selectedAddress ? 'Place Cash Order' : 'Set Delivery Address'))}
            </Button>
        </div>
    </div>
  );
};
