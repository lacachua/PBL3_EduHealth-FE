const AlertStat = ({ label, value, stripClass, chipClass }) => (
  <div className="rounded-lg border border-outline-variant bg-surface p-3">
    <span className={`mb-2 block h-1 w-full rounded ${stripClass}`} />
    <p className="text-xs font-semibold uppercase tracking-[0.04em] text-on-surface-variant">{label}</p>
    <div className="mt-1 flex items-center justify-between gap-2">
      <p className="text-xl font-bold text-on-surface">{value}</p>
      <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${chipClass}`}>Theo dõi</span>
    </div>
  </div>
);

const MedicinesAlertsOverview = ({ loading, error, summary, onRefresh }) => {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface p-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-headline text-base font-semibold text-on-surface">Tổng quan cảnh báo kho thuốc</h2>
          <p className="text-xs text-on-surface-variant">Theo dõi nhanh thuốc sắp hết và sắp hết hạn từ dữ liệu hiện có.</p>
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
          <AlertStat
            label="Sắp hết"
            value={summary.lowStockCount}
            stripClass="bg-warning"
            chipClass="border-warning/25 bg-warning-soft text-warning"
          />
          <AlertStat
            label="Sắp hết hạn"
            value={summary.expiringCount}
            stripClass="bg-info"
            chipClass="border-info/25 bg-info-soft text-info"
          />
          <AlertStat
            label="Tổng cảnh báo"
            value={summary.totalAlerts}
            stripClass="bg-primary"
            chipClass="border-primary/25 bg-primary-soft text-primary"
          />
        </div>
      ) : null}
    </div>
  );
};

export default MedicinesAlertsOverview;
