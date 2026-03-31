import React from 'react';

const AlertStat = ({ label, value, toneClass }) => (
  <div className={`rounded-lg border px-3.5 py-3 ${toneClass}`}>
    <p className="text-xs font-semibold uppercase tracking-[0.04em]">{label}</p>
    <p className="mt-1 text-xl font-bold">{value}</p>
  </div>
);

const MedicinesAlertsOverview = ({ loading, error, summary, onRefresh }) => {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-headline text-base font-semibold text-on-surface">Tổng quan cảnh báo kho thuốc</h2>
          <p className="text-xs text-on-surface-variant">Theo dõi nhanh thuốc sắp hết và sắp hết hạn từ dữ liệu API hiện tại.</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-md border border-outline-variant bg-surface px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low"
        >
          Xem danh sách cảnh báo
        </button>
      </div>

      {loading ? <p className="text-sm text-on-surface-variant">Đang tải cảnh báo...</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {!loading && !error ? (
        <div className="grid gap-2 md:grid-cols-3">
          <AlertStat label="Sắp hết" value={summary.lowStockCount} toneClass="border-warning/30 bg-warning-soft text-warning" />
          <AlertStat label="Sắp hết hạn" value={summary.expiringCount} toneClass="border-secondary/25 bg-secondary-container/25 text-secondary" />
          <AlertStat label="Tổng cảnh báo" value={summary.totalAlerts} toneClass="border-outline-variant bg-surface text-on-surface" />
        </div>
      ) : null}
    </div>
  );
};

export default MedicinesAlertsOverview;
