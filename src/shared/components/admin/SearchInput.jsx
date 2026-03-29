import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Tìm kiếm...', className = '' }) => {
  return (
    <label className={`relative w-full ${className}`}>
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant bg-surface py-2.5 pl-9 pr-3 text-sm text-on-surface outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
      />
    </label>
  );
};

export default SearchInput;
