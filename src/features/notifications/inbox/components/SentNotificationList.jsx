import React from 'react';
import SentNotificationCard from './SentNotificationCard';

const SentNotificationList = ({
  role,
  items,
  loading,
  error,
  emptyTitle = 'Chưa có thông báo nào được gửi',
  emptyDescription = 'Các thông báo và bản tin bạn gửi sẽ xuất hiện tại đây.',
  onOpen,
  onRetry,
}) => {
  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface px-4 py-8 text-center sm:px-6">
        <p className="text-sm font-medium text-on-surface-variant">Đang tải danh sách đã gửi...</p>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface px-4 py-8 text-center sm:px-6">
        <span className="material-symbols-outlined mb-2 text-[48px] text-danger/75">error</span>
        <p className="mb-4 text-sm font-medium text-danger">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="app-focus-ring app-btn-secondary px-4 text-sm"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface px-4 py-8 text-center sm:px-6">
        <span className="material-symbols-outlined mb-3 text-[48px] text-on-surface-variant/50">send</span>
        <h3 className="mb-1.5 text-base font-semibold text-on-surface">{emptyTitle}</h3>
        <p className="max-w-md text-sm text-on-surface-variant">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <SentNotificationCard
          key={`sent-${item.notificationId}`}
          item={item}
          role={role}
          onOpen={(id) => onOpen(id, 'sent')}
        />
      ))}
    </div>
  );
};

export default SentNotificationList;
