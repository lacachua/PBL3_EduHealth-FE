import React from 'react';

const SUMMARY_ITEMS = [
  { id: 'total', label: 'Tổng thông báo', icon: 'notifications' },
  { id: 'unread', label: 'Chưa đọc', icon: 'mark_email_unread' },
  { id: 'read', label: 'Đã đọc', icon: 'drafts' },
  { id: 'sent', label: 'Đã gửi', icon: 'send' },
];

const NotificationSummaryCards = ({
  summary,
  showSent = true,
}) => {
  const items = SUMMARY_ITEMS.filter((item) => item.id !== 'sent' || showSent);

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.id} className="app-kpi-card app-tone-primary app-tone-surface">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="app-kpi-label">{item.label}</p>
              <p className="app-kpi-value">{Number(summary?.[item.id] || 0)}</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-surface text-primary">
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </span>
          </div>
        </article>
      ))}
    </section>
  );
};

export default NotificationSummaryCards;
