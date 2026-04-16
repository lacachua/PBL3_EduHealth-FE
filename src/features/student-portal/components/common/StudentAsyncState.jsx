import React from 'react';

export const StudentLoadingState = ({ label = 'Đang tải dữ liệu...' }) => {
  return (
    <section className="space-y-4">
      <div className="student-hero-gradient app-panel-shell rounded-3xl border border-primary/20 p-5">
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
    <section className="rounded-3xl border border-danger/35 bg-danger-soft p-5 text-sm text-danger">
      <p className="font-medium">{message || 'Không thể tải dữ liệu.'}</p>
      <button
        type="button"
        onClick={onRetry}
        className="app-focus-ring app-interactive mt-3 inline-flex items-center rounded-xl border border-danger/40 bg-white px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger-soft/40"
      >
        Tải lại
      </button>
    </section>
  );
};
