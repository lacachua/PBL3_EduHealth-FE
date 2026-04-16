import React from 'react';

const CARD_META = [
  {
    key: 'totalMedicines',
    title: 'Tổng số thuốc',
    valueClassName: 'text-on-surface',
    icon: 'medication',
    iconClassName: 'bg-primary-soft text-primary',
  },
  {
    key: 'lowStockCount',
    title: 'Thuốc sắp hết',
    valueClassName: 'text-warning',
    icon: 'warning',
    iconClassName: 'bg-warning-soft text-warning',
  },
  {
    key: 'expiringCount',
    title: 'Sắp hết hạn',
    valueClassName: 'text-danger',
    icon: 'event_busy',
    iconClassName: 'bg-danger-soft text-danger',
  },
  {
    key: 'inactiveCount',
    title: 'Ngưng sử dụng',
    valueClassName: 'text-on-surface-variant',
    icon: 'toggle_off',
    iconClassName: 'bg-surface-container-low text-on-surface-variant',
  },
];

const MedicinesSummaryCards = ({ summary, loading }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
              {summary?.[card.key] ?? 0}
            </p>
          )}
        </article>
      ))}
    </div>
  );
};

export default MedicinesSummaryCards;
