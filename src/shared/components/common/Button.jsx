import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'app-focus-ring inline-flex items-center justify-center gap-2 px-4';
  
  const variants = {
    primary: 'app-btn-primary',
    secondary: 'app-btn-secondary',
    outline: 'app-btn-secondary bg-transparent',
    danger: 'app-btn-danger',
    white: 'app-btn-secondary bg-white',
  };

  const variantClass = variants[variant] || variants.primary;

  return (
    <button 
      className={`${baseStyles} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
