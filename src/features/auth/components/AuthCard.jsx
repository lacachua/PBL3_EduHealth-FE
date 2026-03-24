import React from 'react';

const AuthCard = ({ icon, title, description, className = '', children }) => {
  return (
    <div className={`bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 soft-ambient-shadow border border-outline-variant/10 ${className}`}>
      {(icon || title || description) && (
        <div className="text-center mb-10">
          {icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container/10 text-primary mb-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
              </span>
            </div>
          )}
          {title && <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">{title}</h1>}
          {description && <p className="text-on-surface-variant text-sm font-light">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default AuthCard;
