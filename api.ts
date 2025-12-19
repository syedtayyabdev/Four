
import { Order, User, Address } from './types';
import { socket } from './socket';

// Persistent Storage Helpers
const STORAGE_KEYS = {
  USER: 'four_app_user_v2', // Match App.tsx version
  ORDERS: 'four_app_orders_v2',
  RIDER_LOCS: 'four_app_rider_locs_v2'
};

const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const api = {
  sendOtp: async (phone: string): Promise<boolean> => {
    console.log(`[REAL SMS GATEWAY] Sending Auth OTP to ${phone}: 1234`);
    return new Promise(resolve => setTimeout(() => resolve(true), 1200));
  },

  sendOrderOtp: async (phone: string): Promise<boolean> => {
    console.log(`[REAL SMS GATEWAY] Sending Order Confirmation OTP to ${phone}: 5678`);
    return new Promise(resolve => setTimeout(() => resolve(true), 1200));
  },

  verifyOtp: async (code: string, role: 'customer' | 'rider' = 'customer'): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code === '1234' || code === '5678') {
          const newUser: User = {
            phone: 'Real User',
            name: role === 'rider' ? 'Active Rider' : 'Valued Customer',
            role,
            addresses: [
              { 
                id: '1', 
                label: 'Home', 
                details: 'House 123, Street 4', 
                area: 'DHA Phase 6', 
                city: 'Lahore', 
                isDefault: true 
              }
            ]
          };
          resolve(newUser);
        } else {
          reject('Invalid OTP. Please use test code 1234.');
        }
      }, 1500);
    });
  },

  createOrder: async (order: Omit<Order, 'id' | 'status' | 'date' | 'otp'>): Promise<Order> => {
    const orders = getStoredOrders();
    const newOrder: Order = {
      ...order,
      id: `FOUR${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'placed',
      date: new Date().toISOString(),
      paymentMethod: 'Cash on Delivery',
      otp: Math.floor(1000 + Math.random() * 9000).toString()
    };
    orders.push(newOrder);
    saveOrders(orders);
    
    // Notify "server" / socket of new order
    socket.emit('new_order', newOrder);
    
    return new Promise(resolve => setTimeout(() => resolve(newOrder), 1500));
  },

  getAllOrders: async (): Promise<Order[]> => {
    return Promise.resolve(getStoredOrders());
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<void> => {
    const orders = getStoredOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      saveOrders(orders);
      // REAL-TIME: Emit update via socket
      socket.emit('order_status_update', { orderId, status });
    }
    return new Promise(resolve => setTimeout(resolve, 500));
  },

  getOrderStatus: async (orderId: string): Promise<Order['status']> => {
    const orders = getStoredOrders();
    const order = orders.find(o => o.id === orderId);
    return order ? order.status : 'placed';
  },

  updateRiderLocation: async (orderId: string, lat: number, lng: number): Promise<void> => {
    const locs = JSON.parse(localStorage.getItem(STORAGE_KEYS.RIDER_LOCS) || '{}');
    const update = { lat, lng, timestamp: Date.now() };
    locs[orderId] = update;
    localStorage.setItem(STORAGE_KEYS.RIDER_LOCS, JSON.stringify(locs));
    
    // REAL-TIME: Emit location via socket
    socket.emit('rider_location_update', { orderId, ...update });
    
    return Promise.resolve();
  },

  getRiderLocation: async (orderId: string): Promise<{lat: number, lng: number} | null> => {
    const locs = JSON.parse(localStorage.getItem(STORAGE_KEYS.RIDER_LOCS) || '{}');
    return Promise.resolve(locs[orderId] || null);
  }
};
