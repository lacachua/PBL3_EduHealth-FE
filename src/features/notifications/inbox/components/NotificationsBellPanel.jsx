import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import NotificationSourceBadge from './NotificationSourceBadge';

const formatRelativeTime = (value) => {
  const timestamp = new Date(value || '').getTime();
  if (!Number.isFinite(timestamp)) {
    return '--';
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (diffMinutes < 1) {
    return 'vừa xong';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  return `${Math.floor(diffHours / 24)} ngày trước`;
};

const NotificationsBellPanel = ({
  open,
  onClose,
  title = 'Thông báo',
  items = [],
  unreadCount = 0,
  loading = false,
  error = '',
  source = 'pending',
  sourceNote = '',
  onViewAll,
  onSelectItem,
  onMarkAllRead,
  canMarkAllRead = false,
}) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (panelRef.current?.contains(event.target)) {
        return;
      }

      onClose?.();
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, open]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[75]">
      <div className="absolute inset-0 bg-transparent sm:bg-transparent" />

      <section
        ref={panelRef}
        className="absolute inset-x-0 bottom-0 top-auto flex max-h-[78vh] flex-col rounded-t-3xl border border-outline-variant bg-surface shadow-[0_16px_40px_rgba(15,23,42,0.18)] sm:bottom-auto sm:left-auto sm:right-4 sm:top-[74px] sm:w-[388px] sm:rounded-3xl"
      >
        <header className="border-b border-outline-variant px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-on-surface">{title}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Không có thông báo chưa đọc'}
              </p>
            </div>
            <NotificationSourceBadge source={source} />
          </div>

          {sourceNote ? (
            <p className="mt-2 text-xs text-on-surface-variant">{sourceNote}</p>
          ) : null}
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {loading ? (
            <p className="px-1 text-sm text-on-surface-variant">Đang tải thông báo gần đây...</p>
          ) : null}

          {error ? (
            <p className="px-1 text-sm text-danger">{error}</p>
          ) : null}

          {!loading && !error && !items.length ? (
            <p className="px-1 text-sm text-on-surface-variant">Chưa có thông báo gần đây.</p>
          ) : null}

          {!loading && !error && items.length ? (
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.notificationId}
                  type="button"
                  onClick={() => onSelectItem?.(item)}
                  className={`app-focus-ring flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition hover:border-primary/20 hover:bg-surface-container-low ${
                    item.currentRecipient?.isRead
                      ? 'border-outline-variant bg-surface'
                      : 'border-primary/20 bg-primary-soft/10'
                  }`}
                >
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.currentRecipient?.isRead ? 'bg-outline-variant' : 'bg-primary'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="line-clamp-1 text-sm font-semibold text-on-surface">{item.title}</span>
                      <span className="shrink-0 text-[11px] text-on-surface-variant">{formatRelativeTime(item.createdAt)}</span>
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm text-on-surface-variant">{item.content}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-outline-variant px-4 py-3">
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={!canMarkAllRead || unreadCount <= 0}
            className="app-focus-ring app-btn-secondary px-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            Đã đọc tất cả
          </button>

          <button
            type="button"
            onClick={onViewAll}
            className="app-focus-ring app-btn-primary px-3.5"
          >
            Xem tất cả
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
};

export default NotificationsBellPanel;
