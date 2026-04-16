import React from 'react';

const AuthCard = ({ className = '', children }) => {
  return (
    <div className={`rounded-2xl border border-auth-border/70 bg-auth-surface/96 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] sm:p-5 ${className}`}>
      {children}
    </div>
  );
};

export default AuthCard;
