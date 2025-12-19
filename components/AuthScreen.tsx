import React, { useState, useEffect, useRef } from 'react';
import { ViewState, User } from '../types';
import { Button } from './ui/Button';
import { api } from '../api';
import { AlertCircle, Phone, ArrowLeft, Loader2, Bike, User as UserIcon, ShieldCheck, Mail } from 'lucide-react';

interface AuthScreenProps {
  onNavigate: (view: ViewState) => void;
  onLogin: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate, onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [role, setRole] = useState<'customer' | 'rider'>('customer');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async () => {
    if (phone.length < 10) return setError('Please enter a valid 10-digit phone number');
    setLoading(true);
    setError(null);
    try {
      await api.sendOtp(phone);
      setStep('otp');
      setTimer(30);
      setOtp(['', '', '', '']); // Reset OTP on resend
      setTimeout(() => inputRefs[0].current?.focus(), 150);
    } catch (e) {
      setError('Failed to reach server. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 4) return setError('Please enter the complete 4-digit verification code');
    setLoading(true);
    setError(null);
    try {
      const user = await api.verifyOtp(code, role);
      onLogin({ ...user, phone, role });
    } catch (e: any) {
      setError(e.toString() || 'The code you entered is incorrect. Try 1234.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    
    // Auto-submit if last digit filled
    if (value && index === 3) {
        setTimeout(() => handleVerifyOtp(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const resendOtp = () => {
    if (timer === 0) {
      handleSendOtp();
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 pt-12 pb-6 flex flex-col animate-fade-in">
       <header className="flex items-center justify-between mb-8">
          <button 
            onClick={() => step === 'otp' ? setStep('phone') : onNavigate('onboarding')} 
            className="text-white w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-brand-red font-bold text-[10px] uppercase tracking-widest">
              <ShieldCheck size={14} className={step === 'otp' ? 'animate-pulse' : ''} /> 
              {step === 'phone' ? 'Secure Auth' : 'Encrypted Session'}
          </div>
       </header>

       <div className="flex-grow">
         <h1 className="text-4xl font-black text-white italic uppercase mb-2 tracking-tighter leading-tight">
            {step === 'phone' ? 'Welcome to FOUR' : 'Check SMS'}
         </h1>
         <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            {step === 'phone' 
              ? 'Join Lahore\'s most exclusive smash burger community.' 
              : `We've sent a 4-digit code to +92 ${phone}. It might take a moment.`}
         </p>

         {step === 'phone' && (
           <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setRole('customer')}
                className={`flex-1 p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${role === 'customer' ? 'border-brand-red bg-brand-red/10 text-brand-red' : 'border-gray-800 bg-gray-900 text-gray-500 hover:border-gray-700'}`}
              >
                  <div className={`p-3 rounded-full ${role === 'customer' ? 'bg-brand-red text-white' : 'bg-black text-gray-700'}`}>
                    <UserIcon size={24} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Order Food</span>
              </button>
              <button 
                onClick={() => setRole('rider')}
                className={`flex-1 p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${role === 'rider' ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-gray-800 bg-gray-900 text-gray-500 hover:border-gray-700'}`}
              >
                  <div className={`p-3 rounded-full ${role === 'rider' ? 'bg-brand-gold text-black font-black' : 'bg-black text-gray-700'}`}>
                    <Bike size={24} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Delivery</span>
              </button>
           </div>
         )}

         {step === 'phone' ? (
           <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="flex gap-3">
                 <div className="bg-brand-card border border-gray-800 rounded-2xl px-5 py-5 text-gray-400 font-black flex items-center justify-center shadow-lg">
                    +92
                 </div>
                 <div className="flex-grow relative">
                    <input 
                        type="tel" 
                        placeholder="3XX XXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full bg-brand-card border border-gray-800 rounded-2xl px-5 py-5 text-white font-black tracking-[0.1em] outline-none focus:border-brand-red transition-all shadow-lg text-lg placeholder:text-gray-800"
                    />
                    <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
                 </div>
              </div>
           </div>
         ) : (
           <div className="space-y-10">
              <div className="flex gap-4 justify-between max-w-sm mx-auto">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="number"
                      inputMode="numeric"
                      value={digit}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className={`w-16 h-20 bg-brand-card border-2 rounded-2xl text-center text-3xl font-black text-white outline-none transition-all shadow-xl ${digit ? 'border-brand-red shadow-brand-red/10' : 'border-gray-800 focus:border-white'}`}
                    />
                  ))}
              </div>

              <div className="text-center space-y-4">
                 <button 
                    disabled={timer > 0} 
                    onClick={resendOtp}
                    className={`text-[10px] font-black uppercase tracking-widest transition-all px-6 py-3 rounded-full border ${timer > 0 ? 'text-gray-700 border-gray-900' : 'text-brand-red border-brand-red/30 bg-brand-red/5 hover:bg-brand-red/10'}`}
                 >
                    {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code Now'}
                 </button>
                 <p className="text-[9px] text-gray-600 font-bold uppercase">Problems with SMS? Try 1234 for testing.</p>
              </div>
           </div>
         )}
         
         {error && (
            <div className="mt-8 p-4 bg-red-900/10 border border-red-900/50 rounded-2xl flex items-start gap-3 text-red-500 text-xs animate-shake">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p className="font-bold">{error}</p>
            </div>
         )}
       </div>

       <div className="mt-auto pt-6">
         <Button 
            fullWidth 
            onClick={step === 'phone' ? handleSendOtp : handleVerifyOtp}
            disabled={loading || (step === 'phone' && phone.length < 10)}
            className={`h-16 rounded-2xl shadow-2xl ${role === 'rider' && step === 'phone' ? 'bg-brand-gold border-brand-gold text-black hover:bg-yellow-500' : ''}`}
         >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (step === 'phone' ? 'Get Verification Code' : 'Sign Up to FOUR')}
         </Button>
         <p className="text-[10px] text-gray-600 text-center mt-4 uppercase font-bold tracking-[0.2em] opacity-50">By continuing, you agree to our Terms</p>
       </div>
    </div>
  );
};