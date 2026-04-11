import React from 'react';

const VaccinationStatusBadge = ({ label, className }) => {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className || 'bg-[#E2E8F0] text-[#475569]'}`}>
      {label}
    </span>
  );
};

export default VaccinationStatusBadge;
