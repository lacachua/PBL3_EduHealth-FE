import React from 'react';

const toneClassMap = {
  neutral: 'border-outline-variant bg-surface text-on-surface-variant',
  info: 'border-info/25 bg-info-soft text-info',
  success: 'border-success/25 bg-success-soft text-success',
  warning: 'border-warning/25 bg-warning-soft text-warning',
  danger: 'border-danger/25 bg-danger-soft text-danger',
};

const StatusBadge = ({ children, tone = 'neutral' }) => {
  const toneClass = toneClassMap[tone] || toneClassMap.neutral;

  return <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold ${toneClass}`}>{children}</span>;
};

export default StatusBadge;
