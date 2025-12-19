
import React, { useState, useEffect } from 'react';
import { ViewState, Order } from '../types';
import { api } from '../api';
// Added Navigation to the list of lucide-react imports
import { ShoppingBag, Clock, ChevronRight, ArrowLeft, Package, RefreshCw, Search, X, Filter, Navigation } from 'lucide-react';
import { Button } from './ui/Button';

interface OrdersScreenProps {
  onNavigate: (view: ViewState) => void;
}

type FilterStatus = 'All' | 'Pending' | 'Completed' | 'Cancelled';

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrders();
      // Sort by date descending
      setOrders(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'preparing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'out_for_delivery': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'cancelled': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-brand-red bg-brand-red/10 border-brand-red/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    // Status Filter
    let matchesStatus = true;
    if (activeFilter === 'Pending') {
      matchesStatus = ['placed', 'preparing', 'out_for_delivery'].includes(order.status);
    } else if (activeFilter === 'Completed') {
      matchesStatus = order.status === 'delivered';
    } else if (activeFilter === 'Cancelled') {
      matchesStatus = order.status === 'cancelled';
    }

    // Search Filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(query);
      const matchesItem = order.items.some(item => item.name.toLowerCase().includes(query));
      matchesSearch = matchesId || matchesItem;
    }

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">My Orders</h2>
        <button 
          onClick={loadOrders} 
          className="w-10 h-10 rounded-full bg-brand-card border border-gray-800 flex items-center justify-center text-gray-400 active:rotate-180 transition-transform duration-500 hover:text-white"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-red transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID or Item..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-card border border-gray-800 rounded-2xl py-4 pl-12 pr-12 text-white text-sm outline-none focus:border-brand-red transition-all shadow-xl font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {(['All', 'Pending', 'Completed', 'Cancelled'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all italic ${
                activeFilter === status 
                ? 'bg-brand-red text-white border-brand-red shadow-[0_0_15px_rgba(220,20,60,0.3)]' 
                : 'bg-brand-card text-gray-500 border-gray-800 hover:border-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Retrieving History...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-brand-card rounded-full border border-gray-800 flex items-center justify-center text-gray-700">
            {searchQuery ? <Search size={32} /> : <ShoppingBag size={32} />}
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-black uppercase italic text-lg">
                {searchQuery ? 'No matches found' : `No ${activeFilter.toLowerCase()} orders`}
            </h3>
            <p className="text-gray-500 text-xs max-w-[200px] mx-auto">
                {searchQuery ? 'Try searching for a different item or order ID.' : 'Ready to start a new mission? Check out our menu!'}
            </p>
          </div>
          {!searchQuery && (
            <Button onClick={() => onNavigate('menu')} variant="outline" className="px-8">
                Explore Menu
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-brand-card border border-gray-800 rounded-3xl p-5 hover:border-brand-red/30 transition-all active:scale-[0.98]"
              onClick={() => order.status !== 'delivered' && order.status !== 'cancelled' ? onNavigate('tracking') : null}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Order ID</span>
                  <p className="text-sm font-black text-white italic">#{order.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest italic ${getStatusColor(order.status)}`}>
                  {order.status.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-400 font-bold">{item.quantity}x {item.name}</span>
                    <span className="text-white font-black">RS {item.price * item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-[10px] text-brand-red font-black italic">+{order.items.length - 2} more items</p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[9px] text-gray-600 font-black uppercase mb-0.5">Total Bill</p>
                    <p className="text-sm font-black text-white italic">RS {order.total}</p>
                  </div>
                  {['placed', 'preparing', 'out_for_delivery'].includes(order.status) ? (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('tracking'); }}
                        className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red hover:bg-brand-red/20 transition-all"
                    >
                        <Navigation size={16} />
                    </button>
                  ) : (
                    <button className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-brand-gold hover:border-brand-gold transition-colors">
                        <RefreshCw size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
