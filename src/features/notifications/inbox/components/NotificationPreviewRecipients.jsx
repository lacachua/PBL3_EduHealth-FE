import React from 'react';
import { getRoleLabel } from '../constants/notificationTypes';
import NotificationSourceBadge from './NotificationSourceBadge';

const NotificationPreviewRecipients = ({
  preview,
  loading,
  error,
}) => {
  const recipients = preview?.recipients || [];

  return (
    <section className="rounded-2xl border border-outline-variant bg-surface px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-on-surface">Preview người nhận</h3>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            {loading ? 'Đang tính người nhận...' : `${Number(preview?.totalRecipients || 0)} người nhận dự kiến`}
          </p>
        </div>
        <NotificationSourceBadge source={preview?.source || 'MOCK'} label="Preview từ dữ liệu mẫu" />
      </div>

      {error ? <p className="mt-2 text-xs font-semibold text-danger">{error}</p> : null}

      {recipients.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {recipients.slice(0, 5).map((recipient) => (
            <span key={recipient.userId} className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1 text-xs text-on-surface-variant">
              {recipient.fullName} · {getRoleLabel(recipient.role)}
            </span>
          ))}
          {recipients.length > 5 ? (
            <span className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1 text-xs text-on-surface-variant">
              +{recipients.length - 5} người khác
            </span>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm text-on-surface-variant">Chưa có người nhận phù hợp với lựa chọn hiện tại.</p>
      )}
    </section>
  );
};

export default NotificationPreviewRecipients;
