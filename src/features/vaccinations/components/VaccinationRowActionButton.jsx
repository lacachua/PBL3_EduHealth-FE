import React from 'react';

const VARIANT_CLASS_MAP = {
  neutral: 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]',
  accent: 'border-[#D1FAE5] bg-[#ECFDF3] text-[#166534] hover:bg-[#DCFCE7]',
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
      className={`nurse-focus-ring inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] font-semibold ${variantClassName}`}
    >
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {label}
    </button>
  );
};

export default VaccinationRowActionButton;
