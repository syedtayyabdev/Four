
import React, { useState, useEffect, useRef } from 'react';
import { Order, User } from '../types';
import { api } from '../api';
import { socket } from '../socket';
import { MapPin, Phone, Navigation, AlertCircle, Activity, Globe, ArrowLeft, CheckCircle2, MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { Button } from './ui/Button';

interface RiderDashboardProps {
  user: User | null;
  onLogout: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'rider' | 'customer';
  text: string;
  time: string;
}

export const RiderDashboard: React.FC<RiderDashboardProps> = ({ user, onLogout }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'customer', text: 'Please ensure the burger is extra smashed!', time: '2:30 PM' },
    { id: '2', sender: 'rider', text: 'Roger that. Mission in progress.', time: '2:31 PM' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadOrders = async () => {
      const data = await api.getAllOrders();
      setOrders(data);
      if (selectedOrder) {
          const fresh = data.find(o => o.id === selectedOrder.id);
          if (fresh) setSelectedOrder(fresh);
      }
  };

  useEffect(() => {
    loadOrders();
    
    const handleNewOrder = (newOrder: Order) => {
      setOrders(prev => [newOrder, ...prev]);
    };

    socket.on('new_order', handleNewOrder);
    socket.on('order_status_update', loadOrders);

    return () => {
      socket.off('new_order', handleNewOrder);
      socket.off('order_status_update', loadOrders);
    };
  }, [selectedOrder?.id]);

  useEffect(() => {
    setShowOtpInput(false);
    setOtpInput('');
    setError('');
    setIsChatOpen(false);
  }, [selectedOrder?.id]);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            setIsTracking(true);
            
            if (selectedOrder && selectedOrder.status === 'out_for_delivery') {
                api.updateRiderLocation(selectedOrder.id, latitude, longitude);
            }
        },
        (err) => {
            console.error("GPS Error:", err.message);
            setIsTracking(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [selectedOrder?.status, selectedOrder?.id]);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleUpdateStatus = async (status: Order['status']) => {
      if (!selectedOrder) return;
      await api.updateOrderStatus(selectedOrder.id, status);
      loadOrders();
  };

  const handleCompleteDelivery = async () => {
      if (!selectedOrder) return;
      if (otpInput === selectedOrder.otp) {
          await api.updateOrderStatus(selectedOrder.id, 'delivered');
          setSelectedOrder(null);
          setOtpInput('');
          setError('');
          loadOrders();
      } else {
          setError('Verification Failed: Invalid Customer OTP');
      }
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'rider',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setChatMessage('');
  };

  if (isChatOpen && selectedOrder) {
    return (
      <div className="fixed inset-0 bg-brand-black z-[100] flex flex-col animate-fade-in">
        <header className="px-6 py-4 bg-brand-card border-b border-gray-800 flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-white">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-white font-black uppercase italic tracking-tighter text-lg">{selectedOrder.customerName || 'Customer'}</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Secure Link Active</span>
              </div>
            </div>
          </div>
          <a href={`tel:${selectedOrder.customerPhone}`} className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
            <Phone size={18} />
          </a>
        </header>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-black/40">
          <div className="flex justify-center mb-4">
            <span className="text-[8px] font-black text-gray-700 bg-gray-900/50 px-3 py-1 rounded-full uppercase tracking-[0.3em]">Encrypted Mission Communication</span>
          </div>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'rider' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 relative ${m.sender === 'rider' ? 'bg-brand-red text-white rounded-tr-none shadow-[0_5px_15px_rgba(220,20,60,0.2)]' : 'bg-brand-card text-gray-300 border border-gray-800 rounded-tl-none'}`}>
                <p className="text-xs font-medium leading-relaxed">{m.text}</p>
                <span className={`text-[8px] mt-1 block font-black uppercase opacity-50 ${m.sender === 'rider' ? 'text-right' : 'text-left'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-brand-card border-t border-gray-800 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="flex gap-3 bg-black border border-gray-800 rounded-2xl p-2 pl-4 items-center focus-within:border-brand-red transition-all">
            <input 
              type="text" 
              placeholder="Type mission update..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="bg-transparent flex-grow text-white text-xs font-bold outline-none placeholder:text-gray-700"
            />
            <button 
              onClick={sendMessage}
              className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-lg shadow-brand-red/20 active:scale-90 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
      return (
          <div className="p-6 pb-40 space-y-6 animate-fade-in bg-brand-black min-h-screen">
              <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-white active:scale-95 transition-all">
                      <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-black text-white uppercase italic">Mission Control</h2>
              </div>

              {/* Real-Time GPS Status Bar */}
              <div className={`p-4 rounded-xl flex items-center justify-between border transition-all duration-500 ${isTracking ? 'bg-brand-red/5 border-brand-red/30' : 'bg-red-900/10 border-red-900/30'}`}>
                  <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-brand-red animate-pulse' : 'bg-gray-700'}`}></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                          {isTracking ? 'Live GPS Sync Active' : 'Awaiting GPS Lock'}
                      </span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-red font-bold">
                      {currentLocation ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 'FIXING POSITION...'}
                  </span>
              </div>

              <div className="bg-brand-card border border-brand-red/20 rounded-2xl p-5 space-y-4 shadow-[0_0_15px_rgba(220,20,60,0.1)]">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-xs font-black text-brand-red uppercase italic tracking-tighter">Order: #{selectedOrder.id}</span>
                      <span className="text-[10px] text-green-500 font-black uppercase italic animate-pulse">{selectedOrder.status.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                          <MapPin size={24} className="text-brand-red" />
                      </div>
                      <div className="flex-grow">
                          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Target</p>
                          <p className="text-sm text-white font-bold italic leading-snug mb-4">{selectedOrder.deliveryAddress.details}</p>
                          
                          <div className="pt-3 border-t border-gray-800/50">
                             <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-gray-800/30">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-gray-500 font-bold uppercase">Customer Contact</span>
                                    <span className="text-xs text-white font-black font-mono tracking-wider">{selectedOrder.customerPhone || '03XX XXXXXXX'}</span>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                      onClick={() => setIsChatOpen(true)}
                                      className="flex items-center gap-2 bg-gray-900 border border-gray-800 text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:border-brand-red/50 hover:text-brand-red"
                                  >
                                      <MessageSquare size={12} /> Chat
                                  </button>
                                  <a 
                                      href={`tel:${selectedOrder.customerPhone || '03001234567'}`} 
                                      className="flex items-center gap-2 bg-brand-red text-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand-red/20 active:scale-95 transition-all"
                                  >
                                      <Phone size={12} /> Call
                                  </a>
                                </div>
                             </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-black/50 p-4 rounded-xl border border-gray-800/50 space-y-3">
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-gray-800 pb-2">Loadout</p>
                      {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs">
                              <span className="text-white font-black italic">{item.quantity}x {item.name}</span>
                              <span className="text-gray-500 font-bold">RS {item.price * item.quantity}</span>
                          </div>
                      ))}
                      <div className="flex justify-between text-sm font-black pt-2 border-t border-gray-800 uppercase italic">
                          <span className="text-white">Collect</span>
                          <span className="text-brand-red">RS {selectedOrder.total}</span>
                      </div>
                  </div>
              </div>

              {/* Action Control Panel */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-brand-black/95 backdrop-blur-md border-t border-gray-900 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-50">
                  {selectedOrder.status === 'placed' && (
                      <Button fullWidth className="h-16 rounded-2xl bg-orange-600 border-orange-600 shadow-xl shadow-orange-900/30" onClick={() => handleUpdateStatus('preparing')}>
                          Initialize Preparation
                      </Button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                      <Button fullWidth className="h-16 rounded-2xl bg-blue-600 border-blue-600 shadow-xl shadow-blue-900/30" onClick={() => handleUpdateStatus('out_for_delivery')}>
                          Start Delivery Run
                      </Button>
                  )}
                  {selectedOrder.status === 'out_for_delivery' && (
                      !showOtpInput ? (
                          <Button 
                              fullWidth 
                              className="h-16 rounded-2xl bg-green-600 border-green-600 shadow-xl shadow-green-900/20" 
                              onClick={() => setShowOtpInput(true)}
                          >
                              I Have Arrived at Destination
                          </Button>
                      ) : (
                          <div className="bg-brand-card p-6 rounded-3xl border border-green-500/30 space-y-4 shadow-2xl animate-fade-in">
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Customer Verification</p>
                                <button onClick={() => setShowOtpInput(false)} className="text-[10px] text-gray-600 font-black uppercase">Cancel</button>
                              </div>
                              <input 
                                  type="number"
                                  placeholder="OTP CODE"
                                  value={otpInput}
                                  onChange={e => setOtpInput(e.target.value.slice(0, 4))}
                                  className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-center text-4xl font-black text-white outline-none focus:border-brand-red transition-all tracking-[0.3em] shadow-[inset_0_0_15px_rgba(220,20,60,0.05)]"
                              />
                              {error && <p className="text-xs text-red-500 text-center font-black animate-shake uppercase">{error}</p>}
                              <Button 
                                  fullWidth
                                  className="h-16 rounded-2xl bg-green-600 border-green-600 shadow-xl shadow-green-900/20" 
                                  onClick={handleCompleteDelivery}
                              >
                                  Verify & Complete Mission
                              </Button>
                          </div>
                      )
                  )}
                  {selectedOrder.status === 'delivered' && (
                      <Button fullWidth className="h-16 rounded-2xl" onClick={() => setSelectedOrder(null)}>Return to Roster</Button>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in pb-32 bg-brand-black min-h-screen">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Operations</h1>
            <button onClick={onLogout} className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-brand-red transition-all active:scale-95 shadow-lg">
                <AlertCircle size={22} />
            </button>
        </div>

        {/* Global GPS Overview */}
        <div className={`p-5 rounded-2xl flex items-center justify-between transition-all duration-500 border-2 ${isTracking ? 'bg-green-500/5 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-red-900/10 border-red-900/20'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden ${isTracking ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                    {isTracking ? <Globe size={28} className="animate-spin-slow" /> : <Activity size={28} />}
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Network</p>
                    <p className={`text-lg font-black uppercase italic leading-none ${isTracking ? 'text-green-500' : 'text-red-500'}`}>
                        {isTracking ? 'Live' : 'Searching...'}
                    </p>
                </div>
            </div>
            {currentLocation && (
                <div className="flex flex-col items-end">
                    <span className="text-[8px] text-gray-600 font-bold uppercase mb-1">Position</span>
                    <span className="text-[10px] font-mono text-white font-bold">
                        {currentLocation.lat.toFixed(3)} / {currentLocation.lng.toFixed(3)}
                    </span>
                </div>
            )}
        </div>

        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Active Tasks</h3>
                <span className="text-[9px] text-brand-red font-bold uppercase">{orders.filter(o => o.status !== 'delivered').length} Orders</span>
            </div>
            
            {orders.filter(o => o.status !== 'delivered').length === 0 ? (
                <div className="bg-brand-card border border-gray-800 p-12 rounded-3xl text-center space-y-4">
                    <CheckCircle2 size={40} className="text-gray-800 mx-auto" />
                    <p className="text-gray-600 font-black uppercase text-xs tracking-[0.2em]">No pending drops...</p>
                </div>
            ) : (
                orders.filter(o => o.status !== 'delivered').map(order => (
                    <div 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-brand-card border border-gray-800 p-6 rounded-3xl flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group hover:border-brand-red/50 shadow-xl relative overflow-hidden"
                    >
                        <div className="space-y-3 flex-grow">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black bg-brand-red/10 text-brand-red border border-brand-red/20 px-2 py-0.5 rounded italic uppercase">COD</span>
                                <span className="text-base font-black text-white italic">#{order.id}</span>
                                <span className={`text-[9px] font-black uppercase ml-auto px-2 py-1 rounded-full border ${order.status === 'out_for_delivery' ? 'text-blue-500 border-blue-500/20' : 'text-orange-500 border-orange-500/20'}`}>
                                    {order.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-gray-600 mt-0.5" />
                                <p className="text-xs text-gray-400 line-clamp-1 font-bold italic">{order.deliveryAddress.details}</p>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
                                <span className="text-xs text-white font-black">RS {order.total}</span>
                                <span className="text-[10px] text-brand-red font-black uppercase tracking-widest flex items-center gap-1">Open <Navigation size={10} /></span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};
