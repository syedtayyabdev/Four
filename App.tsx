
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { MenuScreen } from './components/MenuScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CartScreen } from './components/CartScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OrderSuccessScreen } from './components/OrderSuccessScreen';
import { RiderDashboard } from './components/RiderDashboard';
import { OrdersScreen } from './components/OrdersScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { CartItem, MenuItem, ViewState, User, Order } from './types';
import { User as UserIcon, Code, ShieldCheck } from 'lucide-react';

interface FlyingItem {
  id: string;
  x: number;
  y: number;
  image: string;
  targetX: number;
  targetY: number;
}

function App() {
  const [view, setView] = useState<ViewState>('splash');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  // Apply theme to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#050505';
      document.body.classList.add('dark');
    } else {
      document.body.style.backgroundColor = '#f9fafb';
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persistence: User and Cart
  useEffect(() => {
    const savedUser = localStorage.getItem('four_app_user_v2');
    const savedCart = localStorage.getItem('four_app_cart_v2');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Auth sync failed", e);
      }
    }

    if (savedCart) {
        try {
            setCart(JSON.parse(savedCart));
        } catch (e) {
            console.error("Cart sync failed", e);
        }
    }
  }, []);

  useEffect(() => {
      localStorage.setItem('four_app_cart_v2', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (loggedInUser: User) => {
    // If logging in as owner, override name to Syed Tayyab as requested
    const finalUser = loggedInUser.role === 'owner' ? { ...loggedInUser, name: 'SYED TAYYAB' } : loggedInUser;
    setUser(finalUser);
    localStorage.setItem('four_app_user_v2', JSON.stringify(finalUser));
    if (finalUser.role === 'rider') setView('rider-dashboard');
    else if (finalUser.role === 'owner') setView('owner-dashboard');
    else setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('four_app_user_v2');
    localStorage.removeItem('four_app_cart_v2');
    setCart([]);
    setView('auth');
  };

  const addToCart = (item: MenuItem | CartItem, e?: React.MouseEvent) => {
    if (e) {
        const targetIconId = 'cart-header-icon'; // Always fly to header cart for consistency
        const targetElement = document.getElementById(targetIconId);
        
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;
            
            const startX = e.clientX;
            const startY = e.clientY;

            const newFlyingItem: FlyingItem = {
                id: Math.random().toString(36).substr(2, 9),
                x: startX,
                y: startY,
                image: item.image,
                targetX: targetX - startX,
                targetY: targetY - startY
            };

            setFlyingItems(prev => [...prev, newFlyingItem]);
            
            // Remove after animation completes
            setTimeout(() => {
                setFlyingItems(prev => prev.filter(fi => fi.id !== newFlyingItem.id));
            }, 800);
        }
    }

    setCart(prev => {
        const newItem = 'cartItemId' in item ? (item as CartItem) : { ...item, cartItemId: Math.random().toString(36).substr(2, 9), quantity: 1 } as CartItem;
        return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== id));
  };

  const handleProductClick = (item: MenuItem) => {
      setSelectedProduct(item);
      setView('product-detail');
  };

  const handlePlaceOrder = (order: Order) => {
      setActiveOrder(order);
      setCart([]);
      setView('tracking');
  };

  const handleNavigateAfterSplash = (target: ViewState) => {
      if (user) {
          if (user.role === 'rider') setView('rider-dashboard');
          else if (user.role === 'owner') setView('owner-dashboard');
          else setView('home');
      } else {
          setView(target);
      }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const renderView = () => {
    if (user?.role === 'rider') {
        return <RiderDashboard user={user} onLogout={handleLogout} />;
    }
    
    // Detailed Owner Dashboard
    if (user?.role === 'owner') {
        return (
            <div className="p-6 text-center space-y-6 bg-brand-black min-h-screen flex flex-col justify-center animate-fade-in relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(220,20,60,0.05)_0%,transparent_70%)] pointer-events-none"></div>

                <div className="relative inline-block mx-auto mb-4">
                    <div className="absolute inset-0 bg-brand-red rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <div className="w-28 h-28 bg-brand-card border-2 border-brand-red rounded-full flex items-center justify-center relative shadow-[0_0_40px_rgba(220,20,60,0.4)]">
                        <UserIcon size={50} className="text-brand-red" />
                        <div className="absolute -bottom-1 -right-1 bg-brand-red p-2 rounded-xl border-2 border-brand-card">
                            <Code size={16} className="text-white" />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <ShieldCheck size={14} className="text-brand-red" />
                        <span className="text-[10px] text-brand-red font-black uppercase tracking-[0.4em]">App Creator & Chief Architect</span>
                    </div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter shadow-sm">SYED TAYYAB</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[9px] opacity-60">Full Authority Access Level 10</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full pt-6">
                    <div className="bg-brand-card p-5 rounded-3xl border border-gray-800 text-left relative group hover:border-brand-red transition-all">
                        <div className="absolute top-3 right-3 text-[8px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded italic">Live</div>
                        <p className="text-[8px] text-gray-500 font-black uppercase mb-1 tracking-widest">Total Revenue</p>
                        <p className="text-xl font-black text-white italic">RS 124,500</p>
                    </div>
                    <div className="bg-brand-card p-5 rounded-3xl border border-gray-800 text-left relative group hover:border-brand-red transition-all">
                        <div className="absolute top-3 right-3 text-[8px] font-black text-brand-red bg-brand-red/10 px-2 py-0.5 rounded italic">Active</div>
                        <p className="text-[8px] text-gray-500 font-black uppercase mb-1 tracking-widest">Fleet Power</p>
                        <p className="text-xl font-black text-white italic">12 Units</p>
                    </div>
                </div>

                <div className="pt-16 space-y-6">
                    <button 
                        onClick={() => setView('home')} 
                        className="text-white font-black uppercase text-[10px] tracking-[0.4em] bg-brand-card border border-gray-800 px-10 py-4 rounded-full hover:border-brand-red hover:shadow-[0_0_20px_rgba(220,20,60,0.2)] transition-all active:scale-95"
                    >
                        Enter Public Front-End
                    </button>
                    <br />
                    <button 
                        onClick={handleLogout} 
                        className="text-gray-600 font-black uppercase text-[9px] tracking-[0.4em] border-b border-gray-900 hover:text-brand-red hover:border-brand-red transition-all pb-1 mt-4"
                    >
                        Terminate System Session
                    </button>
                </div>
            </div>
        );
    }

    switch (view) {
      case 'splash': return <SplashScreen onNavigate={handleNavigateAfterSplash} />;
      case 'onboarding': return <OnboardingScreen onNavigate={setView} />;
      case 'auth': return <AuthScreen onNavigate={setView} onLogin={handleLogin} />;
      case 'home': return <HomeScreen onNavigate={setView} onAddToCart={addToCart} onProductClick={handleProductClick} />;
      case 'menu': return <MenuScreen onAddToCart={addToCart} onProductClick={handleProductClick} onNavigate={setView} />;
      case 'product-detail': return <ProductDetailScreen item={selectedProduct} onNavigate={setView} onAddToCart={addToCart} />;
      case 'cart': return <CartScreen items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onNavigate={setView} onPlaceOrder={handlePlaceOrder} />;
      case 'checkout': return <OrderSuccessScreen cartItems={cart} onNavigate={setView} onPlaceOrder={handlePlaceOrder} user={user} onUpdateUser={setUser} />;
      case 'tracking': return <OrderTrackingScreen order={activeOrder} onNavigate={setView} />;
      case 'profile': return <ProfileScreen user={user} onNavigate={setView} onLogout={handleLogout} onUpdateUser={setUser} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
      case 'order-history': return <OrdersScreen onNavigate={setView} />; 
      case 'notifications': return <NotificationsScreen onNavigate={setView} />;
      default: return <HomeScreen onNavigate={setView} onAddToCart={addToCart} onProductClick={handleProductClick} />;
    }
  };

  const hideNav = ['splash', 'onboarding', 'auth', 'product-detail', 'checkout', 'tracking', 'notifications'].includes(view) || user?.role === 'rider' || (user?.role === 'owner' && view === 'owner-dashboard');

  return (
    <Layout cartCount={totalItems} currentView={view} onNavigate={setView} hideNav={hideNav} isDarkMode={isDarkMode} onToggleTheme={toggleTheme}>
      {renderView()}
      
      {/* Flying Items Animation Overlay */}
      {flyingItems.map(item => (
          <div 
              key={item.id}
              className="fixed pointer-events-none z-[9999] animate-fly-to-cart"
              style={{ 
                  left: item.x - 24, 
                  top: item.y - 24,
                  '--tw-fly-x': `${item.targetX}px`,
                  '--tw-fly-y': `${item.targetY}px`
              } as any}
          >
              <div className="w-12 h-12 rounded-full border-2 border-brand-red bg-brand-card overflow-hidden shadow-2xl">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
          </div>
      ))}
    </Layout>
  );
}

export default App;
