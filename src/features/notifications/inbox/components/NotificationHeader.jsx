import React from 'react';

const NotificationHeader = ({
  title,
  subtitle,
  onRefresh,
  onMarkAllRead,
  onCompose,
  canCompose,
  canMarkAllRead,
  composeLabel,
}) => {
  return (
    <section className="app-panel-shell app-filter-toolbar flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="app-overline">Thông báo</p>
        <h1 className="app-section-title mt-0.5">{title}</h1>
        <p className="app-meta-text mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onRefresh} className="app-focus-ring app-btn-secondary px-3">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Làm mới
        </button>
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={!canMarkAllRead}
          className="app-focus-ring app-btn-secondary px-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          Đã đọc tất cả
        </button>
        {canCompose ? (
          <button type="button" onClick={onCompose} className="app-focus-ring app-btn-primary px-3.5">
            <span className="material-symbols-outlined text-[18px]">edit_square</span>
            {composeLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default NotificationHeader;
