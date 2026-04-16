import React from 'react';
import { Link } from 'react-router-dom';

const NurseDashboardQuickActions = ({ actions = [] }) => {
  return (
    <section className="app-card-shell rounded-2xl p-3.5 sm:p-4">
      <div className="mb-2">
        <p className="app-overline mb-1">Tác vụ ưu tiên</p>
        <h2 className="app-section-title">Thao tác nhanh</h2>
        <p className="app-meta-text mt-0.5">Truy cập nhanh các khu vực nghiệp vụ điều dưỡng trong ngày.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className="app-focus-ring app-interactive rounded-xl border border-outline-variant bg-surface px-2.5 py-2.5 hover:border-primary/28 hover:bg-primary-soft/35"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary-soft text-primary">
                <span className="material-symbols-outlined text-[18px]">{action.icon}</span>
              </span>
              <span className="material-symbols-outlined text-[15px] text-on-surface-muted">arrow_forward</span>
            </div>
            <p className="app-card-title mt-1.5 leading-5">{action.label}</p>
            <p className="mt-1 text-[11px] font-semibold text-on-surface-muted">Mở khu vực xử lý</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NurseDashboardQuickActions;
