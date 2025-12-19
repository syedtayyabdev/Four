import React, { useEffect } from 'react';
import { ViewState } from '../types';
import { UtensilsCrossed, Code } from 'lucide-react';

interface SplashScreenProps {
  onNavigate: (view: ViewState) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('onboarding');
    }, 4500); 
    return () => clearTimeout(timer);
  }, [onNavigate]);

  const foundingPartners = [
    "Saad Ur Rehman",
    "Aroob Jatoi",
    "Iqra Kanwal",
    "Areeb Pervaiz"
  ];

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] overflow-hidden">
      {/* Central Logo */}
      <div className="relative animate-pulse-slow mb-4">
         <div className="text-7xl font-black tracking-widest text-white relative flex items-center italic">
            F<span className="relative inline-block text-brand-red">
                O
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <UtensilsCrossed size={38} className="rotate-90" />
                </div>
            </span>UR
         </div>
      </div>

      {/* Loading Indicator */}
      <div className="mt-4 flex gap-3">
         <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
         <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce [animation-delay:-0.15s]"></div>
         <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-bounce"></div>
      </div>
      
      {/* Creator Credits Section */}
      <div className="absolute bottom-12 flex flex-col items-center gap-6 animate-fade-in [animation-delay:0.5s] w-full px-6">
          <div className="text-center group">
              <div className="flex items-center justify-center gap-2 mb-1">
                 <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gray-800"></div>
                 <p className="text-gray-500 text-[9px] tracking-[0.4em] uppercase font-black opacity-60">App Creator</p>
                 <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gray-800"></div>
              </div>
              <p className="text-white text-xl tracking-[0.3em] uppercase font-black italic shadow-lg group-hover:text-brand-red transition-colors duration-500">
                SYED TAYYAB
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2 opacity-30">
                  <Code size={10} className="text-brand-red" />
                  <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white">Full Stack Engineering</span>
              </div>
          </div>
          
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-gray-900 to-transparent"></div>

          <div className="text-center space-y-2">
              <p className="text-white text-[8px] tracking-[0.2em] uppercase font-bold opacity-30">Founding Partners</p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 max-w-xs mx-auto">
                {foundingPartners.map((name, i) => (
                  <p 
                    key={name} 
                    className={`text-gray-500 text-[9px] tracking-[0.2em] uppercase font-black italic animate-fade-in`}
                    style={{ animationDelay: `${1.2 + (i * 0.2)}s`, animationFillMode: 'both' }}
                  >
                    {name}
                  </p>
                ))}
              </div>
          </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-brand-red/20 rounded-tl-lg"></div>
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-brand-red/20 rounded-br-lg"></div>
    </div>
  );
};