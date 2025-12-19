import React, { useState, useEffect } from 'react';
import { ViewState, User, Address, Order } from '../types';
import { User as UserIcon, MapPin, Settings, LogOut, ChevronRight, ArrowLeft, Package, Clock, ShoppingBag, Info, Shield, FileText, Check, Plus, Camera, Calendar, Trash2, Heart, Wallet, Ticket, Bell, Moon, Sun, Star, Home, Briefcase, Navigation, Code } from 'lucide-react';
import { Button } from './ui/Button';
import { api } from '../api';

interface ProfileScreenProps {
  user: User | null;
  onNavigate: (view: ViewState) => void;
  onLogout?: () => void;
  onUpdateUser?: (user: User) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onNavigate, onLogout, onUpdateUser, isDarkMode, onToggleTheme }) => {
  const [view, setView] = useState<'main' | 'addresses' | 'add-address' | 'settings' | 'edit-profile' | 'legal' | 'favorites' | 'wallet' | 'coupons'>('main');
  const [legalType, setLegalType] = useState<'About' | 'Policy' | 'Terms' | 'Refund'>('About');
  
  const [editForm, setEditForm] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    dob: user?.dob || '',
    gender: user?.gender || 'Male'
  });

  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    label: 'Home',
    area: '',
    city: 'Lahore',
    details: '',
    landmark: '',
    contactName: user?.name || '',
    contactNumber: user?.phone || '',
    isDefault: false
  });

  const handleSaveProfile = () => {
    if (!user) return;
    const updatedUser: User = { ...user, ...editForm };
    onUpdateUser?.(updatedUser);
    localStorage.setItem('four_app_user_v2', JSON.stringify(updatedUser));
    setView('main');
  };

  const handleSaveAddress = () => {
    if (!user || !addressForm.details || !addressForm.area) {
        alert("Please fill in the required fields (Address & Area)");
        return;
    }
    
    const newAddress: Address = {
        ...addressForm as Address,
        id: Math.random().toString(36).substr(2, 9)
    };
    
    const updatedUser: User = { 
        ...user, 
        addresses: addressForm.isDefault 
            ? [...user.addresses.map(a => ({...a, isDefault: false})), newAddress]
            : [...user.addresses, newAddress]
    };
    
    onUpdateUser?.(updatedUser);
    localStorage.setItem('four_app_user_v2', JSON.stringify(updatedUser));
    setView('addresses');
    
    // Reset form for next time
    setAddressForm({
        label: 'Home',
        area: '',
        city: 'Lahore',
        details: '',
        landmark: '',
        contactName: user?.name || '',
        contactNumber: user?.phone || '',
        isDefault: false
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    const updatedUser = { ...user, addresses: updatedAddresses };
    onUpdateUser?.(updatedUser);
    localStorage.setItem('four_app_user_v2', JSON.stringify(updatedUser));
  };

  const handleDeleteAddress = (addressId: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
    const updatedUser = { ...user, addresses: updatedAddresses };
    onUpdateUser?.(updatedUser);
    localStorage.setItem('four_app_user_v2', JSON.stringify(updatedUser));
  };

  const renderLegal = () => {
      const titles = { 
        'About': 'About FOUR', 
        'Policy': 'Privacy Policy', 
        'Terms': 'Terms & Conditions', 
        'Refund': 'Refund Policy' 
      };
      
      const contents = {
          'About': `Welcome to FOUR – Lahore's premium destination for the ultimate smash burger experience.

Founded on the principle of "Four Ingredients, Perfection," we specialize in the art of the 110G beef patty, smashed to perfection on high-heat grills to create that signature caramelized crust.

Our mission is to bring high-end, chef-quality fast food to the streets of Lahore. 

App Creator:
• SYED TAYYAB (Lead Developer & Architect)

Founding Partners:
• Saad Ur Rehman (Ducky Bhai)
• Aroob Jatoi
• Iqra Kanwal
• Areeb Pervaiz

Version: 2.5.0 Pro
Region: Lahore, Pakistan`,

          'Policy': `Effective Date: May 20, 2024

At FOUR, we take your privacy as seriously as our burgers. 

1. DATA COLLECTION
We collect your phone number for authentication, your name for personalized service, and your precise location only when the app is active to ensure accurate delivery.

2. USE OF DATA
Your data is used exclusively to facilitate order fulfillment, rider navigation, and security verification (OTP). 

3. THIRD-PARTY DISCLOSURE
We DO NOT sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your data stays within the FOUR ecosystem.

4. SECURITY
We implement industry-standard encryption for all data transmissions. Your payment (COD) details are handled in person at your doorstep, minimizing digital financial risk.`,

          'Terms': `Welcome to the FOUR Platform. By accessing this app, you agree to the following:

1. ELIGIBILITY
You must provide a valid Lahore-based phone number to receive a verification OTP.

2. ORDERING & PRICING
All prices are in PKR. Prices are subject to change based on market ingredient costs. We reserve the right to refuse service for suspicious or prank orders.

3. DELIVERY
Our riders operate under "Mission Control" protocols. While we aim for sub-30 minute delivery, external factors like Lahore traffic or weather may affect timing.

4. USER CONDUCT
Account holders are responsible for maintaining the confidentiality of their session. Harassment of riders or staff will result in immediate permanent account termination.

Created & Developed by SYED TAYYAB. All rights reserved.`,

          'Refund': `We stand by our Smash Guarantee. If it's not perfect, we make it right.

1. DELAYS
If your order exceeds 60 minutes from confirmation (excluding extreme weather), you are eligible for a 50% discount on your next order via FOUR Wallet.

2. QUALITY ISSUES
If an item is missing, incorrect, or doesn't meet our quality standards, please take a photo and contact support via the app within 15 minutes of delivery.

3. RESOLUTION
Refunds are processed as "FOUR Wallet Credit" which can be used for future missions. Cash refunds are only provided for completely undelivered pre-paid promotional orders.

4. CANCELLATION
Orders can be cancelled within 2 minutes of placement. Once preparation begins in the FOUR Kitchen, cancellation is not possible.`
      };

      return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('main')} className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-white active:scale-90 transition-transform premium-hover">
                  <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{titles[legalType]}</h2>
            </div>
            <div className="bg-brand-card p-8 rounded-[2rem] border border-gray-800 shadow-2xl relative overflow-hidden group premium-hover">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Shield size={80} className="text-brand-red" />
                </div>
                <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-line relative z-10 font-medium">
                  {contents[legalType]}
                </p>
            </div>
            <div className="flex items-center gap-2 justify-center py-4 opacity-30">
                <Check size={12} className="text-brand-red" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">FOUR Official Document</span>
            </div>
        </div>
      );
  };

  const renderMain = () => (
    <div className="space-y-8 pb-10">
       <div className="flex justify-between items-start">
            <h1 className="text-3xl font-black text-white uppercase italic">Profile</h1>
            <button onClick={onToggleTheme} className="w-10 h-10 rounded-full bg-brand-card border border-gray-800 flex items-center justify-center text-white premium-hover">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
       </div>
       
       <div className="flex items-center gap-4 p-4 bg-brand-card rounded-2xl border border-gray-800 relative group premium-hover">
            <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-brand-red flex items-center justify-center text-gray-400 relative overflow-hidden shadow-[0_0_15px_rgba(220,20,60,0.2)]">
                <UserIcon size={32} />
                <div className="absolute bottom-0 right-0 bg-brand-red p-1.5 rounded-full border-2 border-brand-card">
                    <Camera size={10} className="text-white" />
                </div>
            </div>
            <div className="flex-grow">
                <h2 className="text-xl font-black text-white uppercase italic group-hover:text-brand-red transition-colors">{user?.name || 'Customer'}</h2>
                <p className="text-gray-500 text-xs font-bold tracking-widest">{user?.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => setView('edit-profile')} className="text-brand-red text-[10px] font-black uppercase border-b border-brand-red/30 hover:scale-110 transition-transform">Edit Information</button>
                    {user?.name === 'SYED TAYYAB' && (
                        <div className="flex items-center gap-1 bg-brand-red/10 px-2 py-0.5 rounded border border-brand-red/20">
                            <Code size={10} className="text-brand-red" />
                            <span className="text-[8px] font-black text-brand-red uppercase">Creator</span>
                        </div>
                    )}
                </div>
            </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-card p-4 rounded-2xl border border-gray-800 flex flex-col items-center gap-1 group premium-hover">
                <span className="text-gray-500 text-[9px] font-black uppercase">Wallet</span>
                <span className="text-white font-black text-lg italic group-hover:text-brand-red transition-colors">RS 500</span>
                <Wallet size={16} className="text-brand-red mt-1" />
            </div>
            <div className="bg-brand-card p-4 rounded-2xl border border-gray-800 flex flex-col items-center gap-1 group premium-hover">
                <span className="text-gray-500 text-[9px] font-black uppercase">Coupons</span>
                <span className="text-white font-black text-lg italic group-hover:text-brand-gold transition-colors">5</span>
                <Ticket size={16} className="text-brand-gold mt-1" />
            </div>
       </div>

       <div className="space-y-2">
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] px-1 mb-2">My Menu</p>
           {[
               { id: 'addresses', label: 'Saved Addresses', icon: MapPin, action: () => setView('addresses') },
               { id: 'order-history', label: 'Order History', icon: Package, action: () => onNavigate('order-history') },
               { id: 'notifications', label: 'Notifications', icon: Bell, action: () => onNavigate('notifications') },
           ].map((item) => (
                <button key={item.id} onClick={item.action} className="w-full bg-brand-card p-4 rounded-xl border border-gray-800 flex items-center justify-between group premium-hover">
                    <div className="flex items-center gap-4">
                        <item.icon className="text-gray-500 group-hover:text-brand-red transition-colors" size={18} />
                        <span className="text-white text-xs font-bold uppercase tracking-wide group-hover:italic transition-all">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-700 group-hover:text-brand-red transition-colors" />
                </button>
           ))}
       </div>

       <div className="space-y-2">
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] px-1 mb-2">Legal & Support</p>
           {[
               { id: 'Terms', label: 'Terms & Conditions' },
               { id: 'Policy', label: 'Privacy Policy' },
               { id: 'About', label: 'About FOUR' },
               { id: 'Refund', label: 'Refund Policy' },
           ].map((l) => (
                <button 
                    key={l.id} 
                    onClick={() => { setLegalType(l.id as any); setView('legal'); }} 
                    className="w-full bg-brand-card/50 p-4 rounded-xl border border-gray-800/50 flex items-center justify-between group premium-hover"
                >
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">{l.label}</span>
                    <ChevronRight size={14} className="text-gray-800" />
                </button>
           ))}
       </div>

       <div className="pt-4 space-y-3">
           <button onClick={onLogout} className="w-full p-4 rounded-xl border border-red-900/50 text-red-500 flex items-center justify-center gap-2 font-black uppercase text-xs hover:bg-red-500/5 hover:border-red-500 transition-all hover:scale-[1.02]">
               <LogOut size={16} /> Log Out Session
           </button>
       </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => setView('main')} className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-white active:scale-95 transition-transform premium-hover">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-black text-white uppercase italic">Addresses</h2>
            </div>
            <button onClick={() => setView('add-address')} className="flex items-center gap-1.5 text-brand-red text-[10px] font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all">
                <Plus size={14} /> Add New
            </button>
        </div>

        <div className="space-y-4 pb-20">
            {user?.addresses.length === 0 ? (
              <div className="text-center py-20 bg-brand-card/30 rounded-3xl border border-dashed border-gray-800">
                <MapPin size={40} className="mx-auto text-gray-700 mb-4 opacity-20" />
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">No saved locations</p>
                <Button onClick={() => setView('add-address')} variant="outline" className="mt-4 px-8">Add My First Location</Button>
              </div>
            ) : (
              user?.addresses.map(addr => (
                <div 
                  key={addr.id} 
                  className={`p-5 rounded-2xl border transition-all duration-500 relative group premium-hover ${addr.isDefault ? 'border-brand-red bg-brand-red/5 shadow-[0_0_30px_rgba(220,20,60,0.15)] scale-[1.02]' : 'bg-brand-card border-gray-800 hover:border-gray-700'}`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white uppercase italic tracking-tighter">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="flex items-center gap-1 text-[8px] bg-brand-red text-white px-2.5 py-1 rounded-full italic font-black uppercase shadow-[0_0_10px_rgba(220,20,60,0.5)]">
                                <Check size={8} strokeWidth={4} /> Default
                              </span>
                            )}
                        </div>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 rounded-lg text-gray-700 hover:text-red-500 transition-all hover:scale-125">
                          <Trash2 size={14} />
                        </button>
                    </div>
                    
                    <div className="flex gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${addr.isDefault ? 'bg-brand-red/10 border-brand-red/20 text-brand-red' : 'bg-gray-900 border-gray-800 text-gray-500 group-hover:border-brand-red/30'}`}>
                        <MapPin size={18} />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs text-gray-400 font-medium leading-relaxed pr-2 italic group-hover:text-white transition-colors">{addr.details}, {addr.area}, {addr.city}</p>
                      </div>
                    </div>

                    {!addr.isDefault && (
                      <div className="pt-4 border-t border-gray-800/50 flex justify-end">
                        <button 
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-brand-red/50 hover:text-brand-red hover:bg-brand-red/5 transition-all active:scale-95"
                        >
                          <Star size={12} className="text-brand-gold" /> Set as Default
                        </button>
                      </div>
                    )}
                </div>
              ))
            )}
        </div>
    </div>
  );

  const renderAddAddress = () => (
    <div className="space-y-6 pb-20 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView('addresses')} className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-white active:scale-95 transition-transform premium-hover">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Add Location</h2>
        </div>

        <div className="space-y-6">
            {/* Label Selector */}
            <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Address Label</p>
                <div className="flex gap-3 bg-brand-card p-1.5 rounded-2xl border border-gray-800">
                    {([
                        { id: 'Home', icon: Home },
                        { id: 'Office', icon: Briefcase },
                        { id: 'Other', icon: MapPin }
                    ] as const).map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setAddressForm({...addressForm, label: l.id})}
                            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 premium-hover ${addressForm.label === l.id ? 'bg-brand-red text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <l.icon size={14} />
                            <span className="text-[10px] font-black uppercase italic">{l.id}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">House / Flat / Street</p>
                    <input 
                        type="text" 
                        placeholder="e.g. House 42, Street 10"
                        value={addressForm.details}
                        onChange={e => setAddressForm({...addressForm, details: e.target.value})}
                        className="w-full bg-brand-card border border-gray-800 rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-brand-red outline-none transition-all premium-hover"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Area / Sector</p>
                    <input 
                        type="text" 
                        placeholder="e.g. DHA Phase 6"
                        value={addressForm.area}
                        onChange={e => setAddressForm({...addressForm, area: e.target.value})}
                        className="w-full bg-brand-card border border-gray-800 rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-brand-red outline-none transition-all premium-hover"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Nearby Landmark (Optional)</p>
                    <input 
                        type="text" 
                        placeholder="e.g. Near Jalal Sons"
                        value={addressForm.landmark}
                        onChange={e => setAddressForm({...addressForm, landmark: e.target.value})}
                        className="w-full bg-brand-card border border-gray-800 rounded-xl px-5 py-4 text-white text-sm font-bold focus:border-brand-red outline-none transition-all premium-hover"
                    />
                </div>

                <div className="space-y-2 pt-4">
                    <button 
                        onClick={() => setAddressForm({...addressForm, isDefault: !addressForm.isDefault})}
                        className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform"
                    >
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${addressForm.isDefault ? 'bg-brand-red border-brand-red shadow-[0_0_10px_rgba(220,20,60,0.5)]' : 'border-gray-800 bg-brand-card'}`}>
                            {addressForm.isDefault && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${addressForm.isDefault ? 'text-white' : 'text-gray-600'}`}>Set as Default Delivery Address</span>
                    </button>
                </div>
            </div>

            <div className="pt-8">
                <Button fullWidth onClick={handleSaveAddress} className="h-16 rounded-2xl shadow-[0_0_30px_rgba(220,20,60,0.3)]">
                    Save Mission Destination
                </Button>
            </div>
        </div>
    </div>
  );

  const renderEditProfile = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <button onClick={() => setView('main')} className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-white premium-hover"><ArrowLeft size={20} /></button>
            <h2 className="text-2xl font-black text-white uppercase italic">Edit Profile</h2>
        </div>
        <div className="space-y-4">
            <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-brand-card border border-gray-800 rounded-xl px-5 py-4 text-white font-bold focus:border-brand-red outline-none premium-hover" />
            <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full bg-brand-card border border-gray-800 rounded-xl px-5 py-4 text-white font-bold focus:border-brand-red outline-none premium-hover" />
            <Button fullWidth onClick={handleSaveProfile}>Save Mission Data</Button>
        </div>
    </div>
  );

  return (
    <div className="animate-fade-in p-6 bg-brand-black min-h-screen">
      {view === 'main' && renderMain()}
      {view === 'edit-profile' && renderEditProfile()}
      {view === 'addresses' && renderAddresses()}
      {view === 'add-address' && renderAddAddress()}
      {view === 'legal' && renderLegal()}
    </div>
  );
};
