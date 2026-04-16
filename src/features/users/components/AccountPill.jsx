import React from 'react';

const AccountPill = ({ children, className = '' }) => (
  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4 tracking-[0.01em] ${className}`}>
    {children}
  </span>
);

export default AccountPill;
