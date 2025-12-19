
export type Category = 'Burgers' | 'Chicken' | 'Fries' | 'Wings' | 'Pizzas' | 'Drinks' | 'Shakes' | 'Deals';

export interface ProductSize {
  name: string;
  price: number;
}

export interface Addon {
  name: string;
  price: number;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isPopular?: boolean;
  calories?: string;
  rating: number;
  reviewCount: number;
  prepTime: string;
  sizes?: ProductSize[];
  addons?: Addon[];
  reviews?: Review[];
}

export interface CartItem extends MenuItem {
  cartItemId: string;
  quantity: number;
  selectedSize?: ProductSize;
  selectedAddons?: Addon[];
  instructions?: string;
}

export type ViewState = 
  | 'splash' 
  | 'onboarding' 
  | 'auth' 
  | 'home' 
  | 'menu' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'tracking' 
  | 'profile'
  | 'order-history'
  | 'rider-dashboard'
  | 'owner-dashboard'
  | 'notifications';

export interface User {
  phone: string;
  name?: string;
  email?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  photo?: string;
  role: 'customer' | 'rider' | 'owner';
  addresses: Address[];
  walletBalance?: number;
}

export interface Address {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  labelName?: string;
  details: string;
  area: string;
  city: string;
  landmark?: string;
  contactName?: string;
  contactNumber?: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  date: string;
  paymentMethod: 'Cash on Delivery';
  deliveryAddress: Address;
  customerName?: string;
  customerPhone?: string;
  otp: string; 
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'promo' | 'system';
}
