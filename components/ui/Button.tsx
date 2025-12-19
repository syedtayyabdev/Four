import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-3xl font-bold text-sm uppercase tracking-wide transition-all duration-500 ease-out hover:scale-[1.04] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-red text-white border-2 border-brand-red neon-border hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,20,60,0.5)]",
    secondary: "bg-white text-black border-2 border-white hover:bg-gray-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]",
    outline: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};