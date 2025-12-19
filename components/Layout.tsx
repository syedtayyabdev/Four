import React from 'react';
import { ShoppingBag, Home, User, Menu as MenuIcon, UtensilsCrossed } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  hideNav?: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, cartCount, currentView, onNavigate, hideNav, isDarkMode, onToggleTheme }) => {
  const bgClass = isDarkMode ? 'bg-brand-black' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-white' : 'text-black';
  const headerBg = isDarkMode ? 'bg-black/90' : 'bg-white/90';
  const borderClass = isDarkMode ? 'border-white/5' : 'border-black/5';

  if (hideNav) {
    return (
      <div className={`min-h-screen ${bgClass} relative overflow-x-hidden transition-colors duration-500`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} relative overflow-x-hidden transition-colors duration-500`}>
      {/* Background Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span className={`text-[25vw] font-black uppercase ${isDarkMode ? 'text-brand-dark/10' : 'text-gray-300/20'} rotate-[-15deg] whitespace-nowrap select-none watermark`}>
          FOUR
        </span>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 ${headerBg} backdrop-blur-md border-b ${borderClass} flex items-center justify-between h-16 transition-colors`}>
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
           <div className={`text-xl font-black tracking-widest ${textClass} relative flex items-center transition-transform group-hover:scale-110`}>
            F<span className="relative inline-block text-brand-red">
                O
                <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <UtensilsCrossed size={12} className="rotate-90" />
                </div>
            </span>UR
           </div>
        </div>

        <button 
          id="cart-header-icon"
          className={`relative p-2 ${textClass} hover:text-brand-red transition-all hover:scale-125`}
          onClick={() => onNavigate('cart')}
        >
          <ShoppingBag size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-20 px-4 pb-32 min-h-screen">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-black/95' : 'bg-white/95'} border-t ${borderClass} z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.8)] transition-colors`}>
        <div className="flex justify-around items-center h-16 px-2 relative">
          <NavButton 
            icon={<Home size={22} />} 
            label="Home" 
            isActive={currentView === 'home'} 
            onClick={() => onNavigate('home')} 
            isDarkMode={isDarkMode}
          />
          <NavButton 
            icon={<MenuIcon size={22} />} 
            label="Menu" 
            isActive={currentView === 'menu'} 
            onClick={() => onNavigate('menu')} 
            isDarkMode={isDarkMode}
          />
          
          <div className="relative -top-8">
            <button 
                id="cart-nav-icon"
                onClick={() => onNavigate('cart')}
                className={`w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center shadow-[0_0_20px_rgba(220,20,60,0.6)] border-4 ${isDarkMode ? 'border-black' : 'border-white'} transition-all hover:scale-110 hover:shadow-[0_0_35px_rgba(220,20,60,0.8)] active:scale-90`}
            >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                   <span className="absolute top-0 right-0 w-5 h-5 bg-white text-brand-red text-xs font-bold rounded-full flex items-center justify-center border border-brand-red">
                     {cartCount}
                   </span>
                )}
            </button>
          </div>

          <NavButton 
            icon={<UtensilsCrossed size={22} />} 
            label="Orders" 
            isActive={currentView === 'order-history' || currentView === 'tracking'} 
            onClick={() => onNavigate('order-history')} 
            isDarkMode={isDarkMode}
          />
          <NavButton 
            icon={<User size={22} />} 
            label="Profile" 
            isActive={currentView === 'profile'} 
            onClick={() => onNavigate('profile')} 
            isDarkMode={isDarkMode}
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ icon, label, isActive, onClick, isDarkMode }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, isDarkMode: boolean }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 gap-1.5 transition-all duration-300 hover:scale-110 ${isActive ? 'text-brand-red scale-110' : (isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-black')}`}
  >
    <div className={`${isActive ? 'filter drop-shadow-[0_0_8px_rgba(220,20,60,0.5)]' : ''}`}>
        {icon}
    </div>
    <span className="text-[10px] font-bold tracking-wide uppercase">{label}</span>
  </button>
);