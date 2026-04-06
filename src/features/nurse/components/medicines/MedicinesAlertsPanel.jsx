import React from 'react';

const AlertItem = ({ item, actionLabel, onAction }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2">
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-[#0F172A]">{item.medicineName}</p>
      <p className="text-xs text-[#64748B]">
        Tồn: {item.currentStock} | Mức cảnh báo: {item.warningThreshold}
        {item.nearestExpiryDateLabel !== '--' ? ` | Hạn: ${item.nearestExpiryDateLabel}` : ''}
      </p>
    </div>

    <button
      type="button"
      onClick={() => onAction(item.medicineId)}
      className="nurse-focus-ring rounded-lg border border-[#D1FAE5] bg-[#ECFDF3] px-2.5 py-1.5 text-xs font-semibold text-[#166534]"
      aria-label={`${actionLabel} ${item.medicineName}`}
    >
      {actionLabel}
    </button>
  </div>
);

const AlertSection = ({
  title,
  icon,
  toneClassName,
  badgeClassName,
  items,
  emptyLabel,
  actionLabel,
  onAction,
}) => (
  <article className={`flex h-full min-h-[188px] flex-col rounded-2xl border p-4 ${toneClassName}`}>
    <header className="mb-3 flex items-center justify-between">
      <h3 className="inline-flex items-center gap-1.5 text-sm font-bold">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        {title}
      </h3>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${badgeClassName}`}>
        {items.length}
      </span>
    </header>

    <div className="space-y-2">
      {items.length ? (
        items.map((item) => (
          <AlertItem
            key={`${item.alertType}-${item.medicineId}`}
            item={item}
            actionLabel={actionLabel}
            onAction={onAction}
          />
        ))
      ) : (
        <p className="rounded-xl border border-dashed border-current/30 bg-white/70 px-3 py-2 text-xs">{emptyLabel}</p>
      )}
    </div>
  </article>
);

const MedicinesAlertsPanel = ({ alerts, loading, error, onOpenMedicine }) => {
  const lowStock = alerts.filter((item) => item.alertType === 'LOW_STOCK');
  const expiring = alerts.filter((item) => item.alertType === 'EXPIRING');

  return (
    <section className="space-y-3">
      {loading ? <p className="text-sm text-[#64748B]">Đang tải cảnh báo kho thuốc...</p> : null}
      {error ? <p className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">{error}</p> : null}

      {!loading && !error ? (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <AlertSection
            title="Cảnh báo sắp hết"
            icon="warning"
            toneClassName="border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]"
            badgeClassName="bg-[#FEF3C7] text-[#92400E]"
            items={lowStock}
            emptyLabel="Hiện không có thuốc nào ở mức sắp hết."
            actionLabel="Nhập kho"
            onAction={onOpenMedicine}
          />

          <AlertSection
            title="Cảnh báo sắp hết hạn"
            icon="event_busy"
            toneClassName="border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]"
            badgeClassName="bg-[#FEE2E2] text-[#991B1B]"
            items={expiring}
            emptyLabel="Hiện không có thuốc sắp hết hạn trong 30 ngày tới."
            actionLabel="Xem chi tiết"
            onAction={onOpenMedicine}
          />
        </div>
      ) : null}
    </section>
  );
};

export default MedicinesAlertsPanel;
