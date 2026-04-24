import React from 'react';
import NotificationCard from './NotificationCard';

const NotificationList = ({
  role,
  items = [],
  loading,
  error,
  emptyTitle,
  emptyDescription,
  onOpen,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="mt-4 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4 text-sm text-on-surface-variant">
        Đang tải danh sách thông báo...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-2xl border border-danger/25 bg-danger-soft px-4 py-4 text-sm text-danger">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={onRetry} className="app-focus-ring app-btn-secondary px-3">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mt-4 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-6 text-center">
        <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-outline-variant bg-surface text-on-surface-variant">
          <span className="material-symbols-outlined text-[22px]">notifications_off</span>
        </span>
        <p className="mt-3 text-sm font-semibold text-on-surface">{emptyTitle}</p>
        <p className="mx-auto mt-1 max-w-[520px] text-sm text-on-surface-variant">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <NotificationCard key={item.notificationId} item={item} role={role} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default NotificationList;
