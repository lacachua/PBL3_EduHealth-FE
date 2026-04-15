import React from 'react';

export const StudentLoadingState = ({ label = 'Đang tải dữ liệu...' }) => {
  return (
    <section className="space-y-4">
      <div className="student-hero-gradient rounded-3xl border border-primary/20 p-5 shadow-[0_10px_22px_rgba(19,51,71,0.08)]">
        <p className="text-sm font-medium text-on-surface-variant">{label}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`student-skeleton-${index}`} className="h-20 animate-pulse rounded-xl border border-white/70 bg-white/70" />
          ))}
        </div>
      </div>
    </section>
  );
};

export const StudentErrorState = ({ message, onRetry }) => {
  return (
    <section className="rounded-3xl border border-danger/35 bg-danger-soft p-5 text-sm text-danger shadow-[0_8px_20px_rgba(191,76,76,0.12)]">
      <p className="font-medium">{message || 'Không thể tải dữ liệu.'}</p>
      <button
        type="button"
        onClick={onRetry}
        className="student-focus-ring student-interactive mt-3 inline-flex items-center rounded-xl border border-danger/40 bg-white px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger-soft/40"
      >
        Tải lại
      </button>
    </section>
  );
};
