import React from 'react';

const AuthCard = ({ className = '', children }) => {
  return (
    <div className={`rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_18px_36px_-20px_rgba(25,28,30,0.32)] sm:p-6 ${className}`}>
      {children}
    </div>
  );
};

export default AuthCard;
