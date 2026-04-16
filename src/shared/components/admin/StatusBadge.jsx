import React from 'react';

const toneClassMap = {
  neutral: 'border-outline-variant bg-surface-container-low text-on-surface-variant',
  info: 'border-info/35 bg-info-soft text-info',
  success: 'border-success/35 bg-success-soft text-success',
  warning: 'border-warning/35 bg-warning-soft text-warning',
  danger: 'border-danger/35 bg-danger-soft text-danger',
};

const StatusBadge = ({ children, tone = 'neutral' }) => {
  const toneClass = toneClassMap[tone] || toneClassMap.neutral;

  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4 tracking-[0.01em] ${toneClass}`}>{children}</span>;
};

export default StatusBadge;
