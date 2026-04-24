import React from 'react';
import { getNotificationTypeMeta, getRoleLabel, TYPE_TONE_CLASS_MAP } from '../constants/notificationTypes';
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

const buildContextChips = (item) => [
  item.className ? `Lớp ${item.className}` : '',
  item.diseaseName ? item.diseaseName : '',
  item.vaccinationName ? item.vaccinationName : '',
].filter(Boolean);

const NotificationCard = ({
  item,
  role,
  onOpen,
}) => {
  const typeMeta = getNotificationTypeMeta(item.type, role);
  const typeToneClassName = TYPE_TONE_CLASS_MAP[typeMeta.tone] || TYPE_TONE_CLASS_MAP.info;
  const isRead = Boolean(item.currentRecipient?.isRead);
  const contextChips = buildContextChips(item);

  return (
    <button
      type="button"
      onClick={() => onOpen(item.notificationId)}
      className={`app-focus-ring app-interactive flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition hover:border-primary/25 hover:bg-surface-container-low ${
        isRead ? 'border-outline-variant bg-surface' : 'border-primary/20 bg-primary-soft/10'
      }`}
    >
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${isRead ? 'bg-outline-variant' : 'bg-primary'}`} />

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="line-clamp-1 text-sm font-semibold text-on-surface">{item.title}</span>
            <span className="mt-0.5 block text-xs text-on-surface-variant">
              {item.createdByName} · {getRoleLabel(item.createdByRole)} · {formatRelativeTime(item.createdAt)}
            </span>
          </span>
          <span className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${typeToneClassName}`}>
              {typeMeta.label}
            </span>
            {item.source !== 'LIVE' ? <NotificationSourceBadge source={item.source} /> : null}
          </span>
        </span>

        <span className="mt-2 line-clamp-2 block text-sm leading-6 text-on-surface-variant">{item.content}</span>

        <span className="mt-2 flex flex-wrap items-center gap-1.5">
          {contextChips.map((chip) => (
            <span key={chip} className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[11px] text-on-surface-variant">
              {chip}
            </span>
          ))}
          {item.feedbackCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[11px] text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">forum</span>
              {item.feedbackCount} phản hồi
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
};

export default NotificationCard;
