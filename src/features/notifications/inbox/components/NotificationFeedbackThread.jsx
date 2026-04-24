import React from 'react';
import { getRoleLabel } from '../constants/notificationTypes';
import NotificationSourceBadge from './NotificationSourceBadge';

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

const getInitials = (name) => {
  const words = String(name || 'EH').trim().split(/\s+/).slice(-2);
  return words.map((word) => word[0]).join('').toUpperCase() || 'EH';
};

const NotificationFeedbackThread = ({
  feedbacks = [],
  loading,
  source,
  sourceNote,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-on-surface">Phản hồi</h3>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            Các phản hồi nằm trong thông báo này, không tạo broadcast mới.
          </p>
        </div>
        <NotificationSourceBadge source={source} label={source === 'LIVE' ? 'Phản hồi thật' : 'Phản hồi mẫu'} />
      </div>

      {sourceNote ? (
        <div className="rounded-xl border border-warning/25 bg-warning-soft px-3 py-2 text-xs text-warning">
          {sourceNote}
        </div>
      ) : null}

      <div className="max-h-[260px] space-y-3 overflow-y-auto rounded-2xl border border-outline-variant bg-surface px-3 py-3">
        {loading ? <p className="text-sm text-on-surface-variant">Đang tải phản hồi...</p> : null}

        {!loading && !feedbacks.length ? (
          <p className="text-sm text-on-surface-variant">Chưa có phản hồi nào.</p>
        ) : null}

        {!loading && feedbacks.length ? feedbacks.map((feedback) => (
          <article key={feedback.feedbackId} className="flex gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary-soft text-xs font-bold text-primary">
              {getInitials(feedback.senderName)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-on-surface">{feedback.senderName}</span>
                <span className="text-xs text-on-surface-variant">{formatDateTime(feedback.createdAt)}</span>
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex rounded-full border border-outline-variant bg-surface px-2 py-0.5 text-[11px] text-on-surface-variant">
                  {getRoleLabel(feedback.senderRole)}
                </span>
                {feedback.status ? (
                  <span className="inline-flex rounded-full border border-outline-variant bg-surface px-2 py-0.5 text-[11px] text-on-surface-variant">
                    {feedback.status}
                  </span>
                ) : null}
              </span>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">{feedback.content}</p>
            </span>
          </article>
        )) : null}
      </div>
    </section>
  );
};

export default NotificationFeedbackThread;
