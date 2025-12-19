
import React, { useEffect, useState, useMemo } from 'react';
import { Order, ViewState } from '../types';
import { api } from '../api';
import { socket } from '../socket';
import { Button } from './ui/Button';
import { Phone, MessageSquare, CheckCircle, Smartphone, MapPin, Clock, ArrowLeft, Bike, Navigation, Globe, Utensils } from 'lucide-react';

interface OrderTrackingScreenProps {
  order: Order | null;
  onNavigate: (view: ViewState) => void;
}

// Stylized Map Component for a premium feel without API Key dependencies
const TacticalMap = ({ status, riderLocation }: { status: string, riderLocation: {lat: number, lng: number} | null }) => {
  // Simulate a path from Restaurant (A) to Home (B)
  const restaurantPos = { x: 30, y: 70 };
  const homePos = { x: 70, y: 25 };
  
  // Calculate rider position based on status and real GPS if available
  const riderPos = useMemo(() => {
    if (status === 'delivered') return homePos;
    if (status === 'preparing' || status === 'placed') return restaurantPos;
    
    // If we have real GPS data, we'd map it here. 
    // For the demo, we'll use a progress-based animation if GPS is static.
    return { x: 50, y: 45 }; // Mid-point for "on route"
  }, [status, riderLocation]);

  return (
    <div className="absolute inset-0 bg-[#080808] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 0)', 
        backgroundSize: '24px 24px',
        opacity: 0.4 
      }}></div>
      
      {/* Scanning Radar Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(220,20,60,0.05)_50%,transparent_100%)] animate-[spin_10s_linear_infinite]"></div>
      </div>

      {/* SVG Map Layer */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Roads Simulation */}
        <path d="M 0 70 L 30 70 L 70 25 L 100 25" fill="none" stroke="#111" strokeWidth="4" />
        <path d="M 30 0 L 30 100" fill="none" stroke="#111" strokeWidth="2" />
        <path d="M 70 0 L 70 100" fill="none" stroke="#111" strokeWidth="2" />
        
        {/* Route Path (Highlighted) */}
        <path 
          d="M 30 70 L 70 25" 
          fill="none" 
          stroke="rgba(220, 20, 60, 0.2)" 
          strokeWidth="1" 
          strokeDasharray="2,2" 
        />
        
        {/* Animated Rider Connection Line */}
        {status === 'out_for_delivery' && (
           <line 
            x1={restaurantPos.x} y1={restaurantPos.y} 
            x2={riderPos.x} y2={riderPos.y} 
            stroke="rgba(220, 20, 60, 0.4)" 
            strokeWidth="0.5"
            strokeDasharray="1,1"
           />
        )}
      </svg>

      {/* Markers */}
      
      {/* Restaurant */}
      <div 
        className="absolute transition-all duration-1000"
        style={{ left: `${restaurantPos.x}%`, top: `${restaurantPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-brand-red/10 rounded-full animate-ping opacity-20"></div>
          <div className="w-8 h-8 bg-brand-card border border-gray-800 rounded-xl flex items-center justify-center text-brand-red shadow-lg">
            <Utensils size={14} />
          </div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 px-2 py-1 rounded text-[7px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
            FOUR Kitchen
          </div>
        </div>
      </div>

      {/* User Home */}
      <div 
        className="absolute transition-all duration-1000"
        style={{ left: `${homePos.x}%`, top: `${homePos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative">
          <div className="w-8 h-8 bg-brand-card border border-gray-800 rounded-xl flex items-center justify-center text-white shadow-lg">
            <MapPin size={14} />
          </div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 px-2 py-1 rounded text-[7px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
            Your Bunker
          </div>
        </div>
      </div>

      {/* The Rider (Flash) */}
      <div 
        className="absolute transition-all duration-700 ease-in-out z-30"
        style={{ left: `${riderPos.x}%`, top: `${riderPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative">
          <div className={`w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(220,20,60,0.5)] border-2 border-white/10 transition-opacity duration-500 ${status === 'out_for_delivery' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <Bike size={24} className="animate-bounce" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-brand-red"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ order, onNavigate }) => {
  const [status, setStatus] = useState<Order['status']>(order?.status || 'placed');
  const [estTimes, setEstTimes] = useState<string[]>([]);
  const [riderLocation, setRiderLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (order) {
        const base = new Date(order.date);
        const times = [
            base.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            new Date(base.getTime() + 10 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            new Date(base.getTime() + 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            new Date(base.getTime() + 35 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ];
        setEstTimes(times);
    }
  }, [order]);

  useEffect(() => {
    if (!order) return;

    const handleStatusUpdate = (data: { orderId: string, status: Order['status'] }) => {
      if (data.orderId === order.id) {
        setStatus(data.status);
      }
    };

    const handleLocationUpdate = (data: { orderId: string, lat: number, lng: number }) => {
      if (data.orderId === order.id) {
        setRiderLocation({ lat: data.lat, lng: data.lng });
      }
    };

    socket.on('order_status_update', handleStatusUpdate);
    socket.on('rider_location_update', handleLocationUpdate);

    api.getOrderStatus(order.id).then(setStatus);
    api.getRiderLocation(order.id).then(setRiderLocation);

    return () => {
      socket.off('order_status_update', handleStatusUpdate);
      socket.off('rider_location_update', handleLocationUpdate);
    };
  }, [order]);

  if (!order) return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
          <div className="w-20 h-20 bg-brand-card rounded-full border border-gray-800 flex items-center justify-center text-gray-700 mb-2">
            <Smartphone size={32} />
          </div>
          <h2 className="text-xl font-black text-white uppercase italic">No Active Missions</h2>
          <p className="text-gray-500 text-sm max-w-xs">You have no pending deliveries. Ready to satisfy those cravings?</p>
          <Button className="mt-4" onClick={() => onNavigate('home')}>Order Now</Button>
      </div>
  );

  const STATUS_STEPS = [
      { id: 'placed', label: 'Order Confirmed', desc: 'Secure connection established', estLabel: 'Logged at' },
      { id: 'preparing', label: 'In Kitchen', desc: 'Smashing your burgers now', estLabel: 'Prep Start' },
      { id: 'out_for_delivery', label: 'On Route', desc: 'Rider is navigating to you', estLabel: 'Dispatch' },
      { id: 'delivered', label: 'Delivered', desc: 'Order completed. Enjoy!', estLabel: 'Arrival' },
  ];

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === status);

  return (
    <div className="min-h-screen flex flex-col pb-32 animate-fade-in bg-brand-black">
        {/* Tactical Map View - Replaced the broken iframe */}
        <div className="h-[45vh] bg-brand-black relative w-full overflow-hidden border-b border-brand-red/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
             <TacticalMap status={status} riderLocation={riderLocation} />
             
             <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-black/20 pointer-events-none"></div>

             {/* Dynamic Location Card Overlay */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
                 {status !== 'out_for_delivery' && (
                     <div className="bg-brand-card/80 backdrop-blur-md border border-brand-red/30 p-4 rounded-3xl shadow-2xl animate-fade-in">
                        <p className="text-[10px] text-brand-red font-black uppercase tracking-[0.3em] mb-1">Package Verification</p>
                        <div className="text-4xl font-black text-white tracking-[0.2em] italic">{order.otp}</div>
                     </div>
                 )}
             </div>
             
             <button onClick={() => onNavigate('home')} className="absolute top-6 left-6 w-12 h-12 bg-black/80 border border-brand-red/30 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-lg active:scale-95 transition-all z-50">
                <ArrowLeft size={20} />
             </button>
        </div>

        <div className="flex-grow bg-brand-card -mt-10 rounded-t-[3rem] relative z-20 p-8 space-y-8 border-t border-brand-red/30 shadow-[0_-20px_60px_rgba(0,0,0,0.9)]">
            <div className="w-16 h-1 bg-gray-900 rounded-full mx-auto mb-2 opacity-50"></div>
            
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                        {status === 'delivered' ? 'Mission Success' : 'Live Tracking'}
                    </h2>
                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">OPERATIONAL ID: {order.id}</p>
                </div>
                {status !== 'delivered' && (
                    <div className="text-right flex flex-col items-end">
                        <span className="flex items-center gap-1.5 text-[10px] text-brand-red font-black uppercase tracking-widest mb-1">
                            <Clock size={12} className="animate-pulse" />ETA
                        </span>
                        <p className="text-3xl font-black text-white italic leading-none">18m</p>
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="space-y-0 pl-4 ml-3 relative">
                <div className="absolute left-0 top-2 bottom-6 w-0.5 bg-gray-900">
                    <div 
                        className="absolute left-0 top-0 w-full bg-brand-red transition-all duration-1000 shadow-[0_0_15px_rgba(220,20,60,0.5)]" 
                        style={{ height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />
                </div>

                {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const isLast = idx === STATUS_STEPS.length - 1;
                    
                    return (
                        <div key={step.id} className={`relative pl-12 ${isLast ? '' : 'pb-10'}`}>
                            <div className={`absolute -left-[10px] top-1.5 w-5 h-5 rounded-full border-2 transition-all duration-700 z-10 ${isCompleted ? 'bg-brand-red border-brand-red shadow-[0_0_15px_rgba(220,20,60,0.6)]' : 'bg-brand-black border-gray-800'}`}>
                                {isCompleted && <div className="w-full h-full flex items-center justify-center"><CheckCircle size={10} className="text-white" /></div>}
                            </div>
                            
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className={`text-base font-black uppercase italic transition-colors ${isCompleted ? 'text-white' : 'text-gray-800'}`}>{step.label}</h4>
                                    <p className={`text-[11px] font-medium transition-colors ${isCurrent ? 'text-brand-red' : 'text-gray-600'}`}>{step.desc}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className={`text-[10px] font-black uppercase tracking-tighter ${isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>{step.estLabel}</p>
                                    <p className={`text-xs font-black italic ${isCompleted ? 'text-white' : 'text-gray-900'}`}>{estTimes[idx] || '--:--'}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rider Identity Card */}
            {status !== 'delivered' && status !== 'placed' && (
                <div className="bg-brand-black/50 rounded-[2rem] p-6 flex items-center justify-between border border-brand-red/10 group hover:border-brand-red/30 transition-all shadow-2xl">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-brand-red/10 border border-brand-red/20 flex items-center justify-center relative overflow-hidden">
                            <Bike size={28} className="text-brand-red z-10" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/5 to-transparent animate-pulse"></div>
                        </div>
                        <div>
                            <p className="text-white font-black uppercase italic text-lg tracking-tight">Hamza 'Flash' Ali</p>
                            <p className="text-[10px] text-brand-red font-black uppercase tracking-[0.2em] mt-1">Verified Elite Rider</p>
                        </div>
                    </div>
                    <div className="flex gap-2.5">
                        <a href="tel:03001234567" className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 text-white flex items-center justify-center shadow-lg hover:border-brand-red hover:text-brand-red transition-all active:scale-90">
                            <Phone size={20} />
                        </a>
                        <button className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 text-white flex items-center justify-center shadow-lg hover:border-brand-red hover:text-brand-red transition-all active:scale-90">
                            <MessageSquare size={20} />
                        </button>
                    </div>
                </div>
            )}
            
            <div className="pt-4">
                <Button variant="outline" fullWidth onClick={() => onNavigate('home')} className="border-gray-800 text-gray-700 hover:text-white hover:border-brand-red hover:shadow-[0_0_20px_rgba(220,20,60,0.2)] transition-all">
                    Dismiss Active View
                </Button>
            </div>
        </div>
    </div>
  );
};
