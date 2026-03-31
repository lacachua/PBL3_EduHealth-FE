import React from 'react';

const AdminReportFloatingAction = ({ onCreateRecord }) => {
  return (
    <button
      type="button"
      onClick={onCreateRecord}
      className="group fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl transition-all hover:scale-110"
      aria-label="Tạo hồ sơ mới"
    >
      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        add
      </span>
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-xl border border-on-surface-variant/20 bg-on-surface px-4 py-2 text-[11px] font-black uppercase tracking-widest text-surface opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        Tạo hồ sơ mới
      </span>
    </button>
  );
};

export default AdminReportFloatingAction;
