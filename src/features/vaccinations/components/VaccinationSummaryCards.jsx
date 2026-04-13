import React from 'react';

const CARD_META = [
  {
    key: 'totalCampaigns',
    title: 'Tổng đợt tiêm',
    valueClassName: 'text-[#0F172A]',
    icon: 'vaccines',
    iconClassName: 'bg-[#ECFDF3] text-[#15803D]',
  },
  {
    key: 'activeCampaigns',
    title: 'Đang hoạt động',
    valueClassName: 'text-[#166534]',
    icon: 'event_available',
    iconClassName: 'bg-[#DCFCE7] text-[#166534]',
  },
  {
    key: 'pendingStudents',
    title: 'Chờ tiêm',
    valueClassName: 'text-[#B45309]',
    icon: 'hourglass_empty',
    iconClassName: 'bg-[#FEF3C7] text-[#B45309]',
  },
  {
    key: 'completionRate',
    title: 'Tỷ lệ hoàn thành',
    valueClassName: 'text-[#1D4ED8]',
    icon: 'monitoring',
    iconClassName: 'bg-[#DBEAFE] text-[#1D4ED8]',
    renderValue: (value) => `${value}%`,
  },
];

const VaccinationSummaryCards = ({ summary, loading }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARD_META.map((card) => (
        <article key={card.key} className="nurse-card-soft h-full rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">{card.title}</p>
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.iconClassName}`}>
              <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
            </span>
          </div>

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
          ) : (
            <p className={`text-3xl font-extrabold leading-none ${card.valueClassName}`}>
              {typeof card.renderValue === 'function'
                ? card.renderValue(summary?.[card.key] ?? 0)
                : (summary?.[card.key] ?? 0)}
            </p>
          )}
        </article>
      ))}
    </div>
  );
};

export default VaccinationSummaryCards;
