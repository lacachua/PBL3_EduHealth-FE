import React from 'react';
import {
  canViewNotificationRecipients,
} from '../constants/notificationComposeConfig';
import {
  getNotificationTypeMeta,
  getRoleLabel,
  TYPE_TONE_CLASS_MAP,
} from '../constants/notificationTypes';

const formatDateTime = (value) => {
  if (!value) {
    return '--';
  }

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return '--';
  }

  return timestamp.toLocaleString('vi-VN');
};

const InfoRow = ({ label, value }) => {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
};

const NotificationDetailModal = ({
  open,
  loading,
  item,
  role,
  currentUser,
  onClose,
  onViewFullPage,
}) => {
  if (!open) {
    return null;
  }

  const typeMeta = getNotificationTypeMeta(item?.type, role);
  const typeToneClassName = TYPE_TONE_CLASS_MAP[typeMeta.tone] || TYPE_TONE_CLASS_MAP.info;
  const canViewRecipients = canViewNotificationRecipients({ role, notification: item, currentUser });
  const recipients = item?.recipients || [];
  const imageUrl = item?.imageUrl;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/45 px-0 py-0 backdrop-blur-[1px] sm:items-center sm:px-4 sm:py-6">
      <div className="flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-outline-variant bg-surface shadow-[0_16px_44px_rgba(15,23,42,0.18)] sm:h-auto sm:max-h-[88vh] sm:rounded-3xl">
        <header className="flex items-start justify-between gap-3 border-b border-outline-variant px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <p className="app-overline">Chi tiết thông báo</p>
            <h2 className="app-section-title mt-0.5 line-clamp-2">{item?.title || 'Đang tải...'}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-semibold ${typeToneClassName}`}>
                {typeMeta.label}
              </span>
              {item?.visibility ? (
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary-soft/10 px-2 py-0.5 font-semibold text-primary">
                  {item.visibility === 'PUBLIC' ? 'Public bản tin' : item.visibility === 'INTERNAL' ? 'Nội bộ' : 'Nội bộ + Public'}
                </span>
              ) : null}
              {item?.isSentItem ? (
                <span className="font-medium text-on-surface">Đã gửi</span>
              ) : (
                <span>{item?.createdByName || '--'} {item?.createdByRole ? `· ${getRoleLabel(item.createdByRole)}` : ''}</span>
              )}
              <span>{formatDateTime(item?.createdAt)}</span>
              {!item?.isSentItem && item?.currentRecipient ? <span>{item.currentRecipient.isRead ? 'Đã đọc' : 'Chưa đọc'}</span> : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {onViewFullPage ? (
              <button
                type="button"
                onClick={onViewFullPage}
                className="app-focus-ring app-btn-secondary hidden px-3 text-xs sm:inline-flex"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                Xem trang đầy đủ
              </button>
            ) : null}
            <button type="button" onClick={onClose} className="app-focus-ring app-btn-secondary h-9 w-9 rounded-full p-0" aria-label="Đóng chi tiết">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {loading ? (
            <p className="text-sm text-on-surface-variant">Đang tải chi tiết thông báo...</p>
          ) : (
            <div className="space-y-5">
              <section className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5">
                {imageUrl ? (
                  <div className="mb-4 overflow-hidden rounded-2xl border border-outline-variant bg-surface" data-image-wrapper>
                    <img
                      src={imageUrl}
                      alt={item?.title || 'Thông báo'}
                      className="max-h-[420px] w-full object-contain bg-white"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.classList.add('hidden');
                        event.currentTarget.parentElement?.classList.add('hidden');
                      }}
                    />
                  </div>
                ) : null}
                <p className="whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">
                  {item?.content || 'Không có nội dung.'}
                </p>
                {item?.currentRecipient?.readAt ? (
                  <p className="mt-3 text-xs text-on-surface-variant">
                    Đã đọc lúc {formatDateTime(item.currentRecipient.readAt)}
                  </p>
                ) : null}
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InfoRow label="Lớp" value={item?.className} />
                <InfoRow label="Bệnh liên quan" value={item?.diseaseName} />
                <InfoRow label="Đợt tiêm liên quan" value={item?.vaccinationName} />
              </section>

              {canViewRecipients && (recipients.length > 0 || item?.totalRecipients > 0) ? (
                <section className="rounded-2xl border border-outline-variant bg-surface px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-on-surface">Người nhận</h3>
                      <p className="mt-0.5 text-xs text-on-surface-variant">
                        {item?.totalRecipients > 0 ? `${item.totalRecipients} người nhận trong thông báo này.` : `${recipients.length} người nhận trong thông báo này.`}
                      </p>
                    </div>
                    {item?.readCount !== undefined ? (
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <span className="flex items-center gap-1 text-success">
                          <span className="material-symbols-outlined text-[16px]">done_all</span>
                          {item.readCount} đã đọc
                        </span>
                        <span className="flex items-center gap-1 text-warning">
                          <span className="material-symbols-outlined text-[16px]">mark_email_unread</span>
                          {item.unreadCount} chưa đọc
                        </span>
                      </div>
                    ) : null}
                  </div>
                  {recipients.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {recipients.slice(0, 8).map((recipient) => (
                        <span key={`${recipient.id}-${recipient.userId}`} className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1 text-xs text-on-surface-variant">
                          {recipient.fullName} · {getRoleLabel(recipient.role)}{recipient.isRead ? ' · Đã đọc' : ''}
                        </span>
                      ))}
                      {recipients.length > 8 ? (
                        <span className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-1 text-xs text-on-surface-variant">
                          +{recipients.length - 8} người khác
                        </span>
                      ) : null}
                    </div>
                  )}
                </section>
              ) : null}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
