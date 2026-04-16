import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Tìm kiếm...', className = '' }) => {
  return (
    <label className={`relative w-full ${className}`}>
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted">search</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="app-focus-ring app-input w-full pl-9 pr-3 text-[13px]"
      />
    </label>
  );
};

export default SearchInput;
