import React from 'react';

const CARD_META = [
  {
    key: 'totalCampaigns',
    title: 'Tổng đợt tiêm',
    valueClassName: 'text-on-surface',
    icon: 'vaccines',
    iconClassName: 'bg-primary-soft text-primary',
  },
  {
    key: 'pendingStudents',
    title: 'Chờ tiêm',
    valueClassName: 'text-warning',
    icon: 'hourglass_empty',
    iconClassName: 'bg-warning-soft text-warning',
  },
  {
    key: 'completionRate',
    title: 'Tỷ lệ hoàn thành',
    valueClassName: 'text-info',
    icon: 'monitoring',
    iconClassName: 'bg-info-soft text-info',
    renderValue: (value) => `${value}%`,
  },
];

const VaccinationSummaryCards = ({ summary, loading }) => {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {CARD_META.map((card) => (
        <article key={card.key} className="app-kpi-card h-full">
          <div className="mb-3 flex items-center justify-between">
            <p className="app-kpi-label">{card.title}</p>
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.iconClassName}`}>
              <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
            </span>
          </div>

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded bg-outline-variant" />
          ) : (
            <p className={`app-kpi-value text-3xl ${card.valueClassName}`}>
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
