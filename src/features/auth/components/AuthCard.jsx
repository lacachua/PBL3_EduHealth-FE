import React from 'react';

const AuthCard = ({ className = '', children }) => {
  return (
    <div className={`rounded-2xl bg-auth-surface p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
};

export default AuthCard;
