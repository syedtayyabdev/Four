
import React, { useState, useEffect } from 'react';
import { ViewState, AppNotification } from '../types';
import { Bell, ArrowLeft, Trash2, ShoppingBag, Gift, Info, CheckCircle2 } from 'lucide-react';

interface NotificationsScreenProps {
  onNavigate: (view: ViewState) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: 'Welcome to FOUR!',
      message: 'Your account is now active. Use code FIRST20 for 20% off your first burger.',
      time: 'Just now',
      isRead: false,
      type: 'promo'
    },
    {
      id: '2',
      title: 'Operational Update',
      message: 'We are now delivering in DHA Phase 8. Hot smash burgers are just a tap away.',
      time: '2 hours ago',
      isRead: true,
      type: 'system'
    },
    {
        id: '3',
        title: 'Order Delivered',
        message: 'Hope you enjoyed your London BBQ burger! Rate your experience now.',
        time: 'Yesterday',
        isRead: true,
        type: 'order'
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order': return <ShoppingBag size={18} className="text-brand-red" />;
      case 'promo': return <Gift size={18} className="text-brand-gold" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-20 bg-brand-black min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="w-10 h-10 rounded-full bg-brand-card border border-gray-800 flex items-center justify-center text-white active:scale-90 transition-transform">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Alerts</h2>
        </div>
        <button 
            onClick={markAllRead}
            className="text-[10px] font-black text-brand-red uppercase tracking-widest border-b border-brand-red/30"
        >
            Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
            <div className="w-20 h-20 bg-brand-card rounded-full border border-gray-800 flex items-center justify-center text-gray-700 opacity-20">
                <Bell size={32} />
            </div>
            <div className="space-y-2">
                <h3 className="text-white font-black uppercase italic text-lg">Clear Skies</h3>
                <p className="text-gray-500 text-xs max-w-[200px] mx-auto">No new notifications at the moment. We'll ping you when something hot arrives!</p>
            </div>
        </div>
      ) : (
        <div className="space-y-4">
            {notifications.map((n) => (
                <div 
                    key={n.id} 
                    className={`p-5 rounded-3xl border transition-all relative overflow-hidden group ${n.isRead ? 'bg-brand-card/40 border-gray-800/50' : 'bg-brand-card border-brand-red/20 shadow-[0_0_20px_rgba(220,20,60,0.05)]'}`}
                >
                    {!n.isRead && <div className="absolute top-0 left-0 w-1 h-full bg-brand-red"></div>}
                    
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-gray-900 border border-gray-800' : 'bg-brand-red/10 border border-brand-red/30'}`}>
                            {getIcon(n.type)}
                        </div>
                        <div className="flex-grow space-y-1">
                            <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-black uppercase italic ${n.isRead ? 'text-gray-400' : 'text-white'}`}>{n.title}</h4>
                                <span className="text-[9px] font-bold text-gray-600 uppercase whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className={`text-xs leading-relaxed ${n.isRead ? 'text-gray-600' : 'text-gray-400'}`}>{n.message}</p>
                            
                            <div className="pt-3 flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => deleteNotification(n.id)}
                                    className="text-gray-700 hover:text-brand-red transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                                {!n.isRead && (
                                    <button className="text-brand-red">
                                        <CheckCircle2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      <div className="pt-10">
          <div className="bg-brand-red/5 border border-brand-red/20 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white">
                    <Gift size={16} />
                  </div>
                  <span className="text-xs font-black text-white uppercase italic">Active Promotion</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
                  Refer a friend to FOUR and get <span className="text-brand-red">FREE LOADED FRIES</span> on your next order. Your unique code: <span className="text-white">FOUR-HAMZA-123</span>
              </p>
          </div>
      </div>
    </div>
  );
};
