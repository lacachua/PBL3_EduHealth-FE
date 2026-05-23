import React, { useState } from 'react';
import { getNotificationTypeMeta, getRoleLabel, TYPE_TONE_CLASS_MAP } from '../constants/notificationTypes';

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
  const [imageError, setImageError] = useState(false);
  const imageUrl = item.imageUrl;
  const showImage = Boolean(imageUrl && !imageError);

  return (
    <button
      type="button"
      onClick={() => onOpen(item.notificationId)}
      className={`app-focus-ring app-interactive flex w-full flex-col sm:flex-row items-start gap-3 sm:gap-4 rounded-2xl border p-3.5 sm:p-4 text-left transition hover:border-primary/25 hover:bg-surface-container-low ${
        isRead ? 'border-outline-variant bg-surface' : 'border-primary/20 bg-primary-soft/10'
      }`}
    >
      {showImage ? (
        <span className="w-full sm:w-40 sm:shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
          <img
            src={imageUrl}
            alt={item.title}
            className="aspect-[16/9] sm:aspect-[4/3] w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </span>
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col sm:flex-row items-start gap-3">
        <span className={`mt-1.5 hidden sm:block h-2.5 w-2.5 shrink-0 rounded-full ${isRead ? 'bg-outline-variant' : 'bg-primary'}`} />

        <span className="min-w-0 flex-1 w-full">
          <span className="flex flex-wrap items-start justify-between gap-2">
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className={`sm:hidden h-2.5 w-2.5 shrink-0 rounded-full ${isRead ? 'bg-outline-variant' : 'bg-primary'}`} />
                <span className="app-clamp-2 text-sm font-semibold text-on-surface">{item.title}</span>
              </span>
              <span className="mt-1 block text-xs text-on-surface-variant">
                {item.createdByName} · {getRoleLabel(item.createdByRole)} · {formatRelativeTime(item.createdAt)}
              </span>
            </span>
            <span className="flex shrink-0 flex-wrap justify-end gap-1.5">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${typeToneClassName}`}>
                {typeMeta.label}
              </span>
            </span>
          </span>

          <span className="app-clamp-2 mt-2 text-sm leading-6 text-on-surface-variant">{item.content}</span>

          {contextChips.length > 0 ? (
            <span className="mt-2 flex flex-wrap items-center gap-1.5">
              {contextChips.map((chip) => (
                <span key={chip} className="inline-flex items-center rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[11px] text-on-surface-variant">
                  {chip}
                </span>
              ))}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
};

export default NotificationCard;
