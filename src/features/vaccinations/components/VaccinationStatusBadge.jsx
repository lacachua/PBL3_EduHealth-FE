import React from 'react';

const VaccinationStatusBadge = ({ label, className }) => {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className || 'bg-surface-container-low text-on-surface-variant'}`}>
      {label}
    </span>
  );
};

export default VaccinationStatusBadge;
