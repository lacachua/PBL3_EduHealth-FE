import React from 'react';

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

const LoadingSpinner = ({ label = 'Đang tải dữ liệu...', size = 'md' }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center justify-center gap-2 py-6 text-sm text-on-surface-variant" role="status" aria-live="polite">
      <span className={`inline-block animate-spin rounded-full border-outline-variant border-t-secondary ${sizeClass}`} />
      <span>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
