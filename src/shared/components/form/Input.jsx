import React from 'react';

const Input = ({ label, icon, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
              {icon}
            </span>
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-4 bg-surface-container-high border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all duration-200 outline-none ${error ? 'ring-2 ring-error' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-error text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
