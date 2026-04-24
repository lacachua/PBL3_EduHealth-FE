import React from 'react';
import {
  normalizeSource,
  SOURCE_LABELS,
  SOURCE_TONE_CLASS_MAP,
} from '../constants/notificationTypes';

const NotificationSourceBadge = ({
  source = 'PENDING',
  label,
  className = '',
}) => {
  const normalized = normalizeSource(source);
  const toneClassName = SOURCE_TONE_CLASS_MAP[normalized] || SOURCE_TONE_CLASS_MAP.PENDING;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClassName} ${className}`}>
      {label || SOURCE_LABELS[normalized] || SOURCE_LABELS.PENDING}
    </span>
  );
};

export default NotificationSourceBadge;
