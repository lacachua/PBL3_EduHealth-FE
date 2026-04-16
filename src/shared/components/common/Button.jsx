import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-3 rounded-xl font-bold transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 active:scale-[0.98] flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'signature-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary/5',
    outline: 'bg-transparent text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-low',
    ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-low',
    white: 'bg-white text-primary hover:bg-surface-container-lowest shadow-xl',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
