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
        className="h-11 w-full rounded-lg border border-[var(--field-border)] bg-[var(--field-bg)] px-3 pl-9 text-sm text-on-surface outline-none transition placeholder:text-[var(--field-placeholder)] focus:border-[var(--field-focus)] focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
};

export default SearchInput;
