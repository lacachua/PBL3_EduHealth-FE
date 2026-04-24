import React from 'react';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
  inputClassName = '',
  iconClassName = '',
  ariaLabel,
}) => {
  return (
    <label className={`relative w-full ${className}`}>
      <span className={`material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] leading-none text-on-surface-muted ${iconClassName}`}>search</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        className={`app-search-input app-focus-ring app-input w-full text-[13px] ${inputClassName}`}
      />
    </label>
  );
};

export default SearchInput;
