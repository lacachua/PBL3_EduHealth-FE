import React from 'react';

const VARIANT_CLASS_MAP = {
  neutral: 'app-row-action',
  accent: 'app-row-action app-row-action-primary',
};

const VaccinationRowActionButton = ({
  icon,
  label,
  onClick,
  variant = 'neutral',
}) => {
  const variantClassName = VARIANT_CLASS_MAP[variant] || VARIANT_CLASS_MAP.neutral;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`app-focus-ring inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-semibold ${variantClassName}`}
    >
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {label}
    </button>
  );
};

export default VaccinationRowActionButton;
