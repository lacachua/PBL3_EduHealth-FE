import React from 'react';

const CARD_META = [
  {
    key: 'totalMedicines',
    title: 'Tổng số thuốc',
    valueClassName: 'text-[#0F172A]',
    icon: 'medication',
    iconClassName: 'bg-[#ECFDF3] text-[#15803D]',
  },
  {
    key: 'lowStockCount',
    title: 'Thuốc sắp hết',
    valueClassName: 'text-[#B45309]',
    icon: 'warning',
    iconClassName: 'bg-[#FEF3C7] text-[#B45309]',
  },
  {
    key: 'expiringCount',
    title: 'Sắp hết hạn',
    valueClassName: 'text-[#B91C1C]',
    icon: 'event_busy',
    iconClassName: 'bg-[#FEE2E2] text-[#B91C1C]',
  },
  {
    key: 'inactiveCount',
    title: 'Ngưng sử dụng',
    valueClassName: 'text-slate-600',
    icon: 'toggle_off',
    iconClassName: 'bg-slate-100 text-slate-600',
  },
];

const MedicinesSummaryCards = ({ summary, loading }) => {
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
              {summary?.[card.key] ?? 0}
            </p>
          )}
        </article>
      ))}
    </div>
  );
};

export default MedicinesSummaryCards;
