import React, { useState } from 'react';
import { ViewState } from '../types';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  onNavigate: (view: ViewState) => void;
}

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    title: 'PREMIUM SMASH BURGERS',
    desc: 'Experience the crunch and juice of our signature smash technique.'
  },
  {
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    title: 'LIGHTNING FAST DELIVERY',
    desc: 'Hot and fresh food delivered to your doorstep in minutes.'
  },
  {
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80',
    title: 'ORDER IN SECONDS',
    desc: 'Seamless ordering experience with secure payments.'
  }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onNavigate('auth');
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
        {/* Image Section */}
        <div className="relative flex-grow w-full overflow-hidden">
             {SLIDES.map((slide, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={slide.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
             ))}
        </div>

        {/* Content Section */}
        <div className="px-6 pb-12 pt-8 space-y-6 bg-black">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-white italic uppercase leading-none tracking-tight">
                    {SLIDES[currentSlide].title}
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    {SLIDES[currentSlide].desc}
                </p>
            </div>

            <div className="flex items-center justify-between pt-4">
                {/* Dots */}
                <div className="flex gap-2">
                    {SLIDES.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-brand-red' : 'w-2 bg-gray-700'}`} 
                        />
                    ))}
                </div>

                <button 
                    onClick={handleNext}
                    className="w-14 h-14 rounded-full bg-brand-red flex items-center justify-center text-white neon-border active:scale-95 transition-all"
                >
                    <ArrowRight size={24} />
                </button>
            </div>
            
            {currentSlide === 0 && (
                <button onClick={() => onNavigate('auth')} className="w-full text-center text-gray-500 text-xs uppercase tracking-widest mt-4">Skip</button>
            )}
        </div>
    </div>
  );
};