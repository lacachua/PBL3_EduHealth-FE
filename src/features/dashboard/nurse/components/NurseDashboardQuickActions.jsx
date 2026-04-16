import React from 'react';
import { Link } from 'react-router-dom';

const NurseDashboardQuickActions = ({ actions = [] }) => {
  return (
    <section className="app-card-shell rounded-2xl p-3.5 sm:p-4">
      <div className="mb-2">
        <h2 className="text-base font-bold text-on-surface">Thao tác nhanh</h2>
        <p className="mt-0.5 text-xs text-on-surface-variant">Truy cập nhanh các khu vực nghiệp vụ điều dưỡng trong ngày.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className="app-focus-ring app-interactive rounded-xl border border-outline-variant bg-surface px-2.5 py-2.5 hover:border-primary/25 hover:bg-primary-soft/35"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                <span className="material-symbols-outlined text-[18px]">{action.icon}</span>
              </span>
              <span className="material-symbols-outlined text-[15px] text-on-surface-muted">arrow_forward</span>
            </div>
            <p className="mt-1.5 text-[13px] font-semibold leading-5 text-on-surface">{action.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NurseDashboardQuickActions;
