import React from 'react';

const AdminReportHeader = ({ title, description, onRefresh }) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">{description}</p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface"
      >
        <span className="material-symbols-outlined text-[18px]">refresh</span>
        Làm mới dữ liệu
      </button>
    </div>
  );
};

export default AdminReportHeader;
