import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../../../shared/components/core/EmptyState';
import ErrorState from '../../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../../shared/components/core/LoadingSpinner';

const panelMeta = {
  medicineAlerts: {
    title: 'Cảnh báo kho thuốc',
    subtitle: 'Thuốc dưới ngưỡng và sắp hết hạn cần xử lý.',
    cta: 'Mở kho thuốc',
  },
  pendingVaccinations: {
    title: 'Tiêm chủng cần xử lý',
    subtitle: 'Danh sách học sinh chưa hoàn thành tiêm chủng.',
    cta: 'Mở danh sách',
  },
};

const renderMedicineAlertItem = (item) => {
  const stockLabel = Number.isFinite(item.currentStock) ? `${item.currentStock}` : '--';
  const thresholdLabel = Number.isFinite(item.warningThreshold) ? `${item.warningThreshold}` : '--';

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[13px] font-semibold text-on-surface">{item.medicineName}</p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.alertType === 'EXPIRING' ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'}`}>
          {item.alertTypeLabel}
        </span>
      </div>
      <p className="mt-0.5 text-[11px] text-on-surface-variant">Tồn kho {stockLabel} / Ngưỡng {thresholdLabel} • Hạn {item.nearestExpiryDateLabel}</p>
    </div>
  );
};

const renderPendingVaccinationItem = (item) => {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-semibold text-on-surface">{item.studentName}</p>
      <p className="mt-0.5 truncate text-[11px] text-on-surface-variant">{item.studentCode} • Lớp {item.className} • {item.campaignName}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.statusBadgeClassName}`}>
          {item.statusLabel}
        </span>
        <span className="text-[11px] text-on-surface-variant">{item.scheduledDateLabel}</span>
      </div>
    </div>
  );
};

const renderPanelItem = (panelKey, item) => {
  if (panelKey === 'medicineAlerts') {
    return renderMedicineAlertItem(item);
  }

  return renderPendingVaccinationItem(item);
};

const defaultPanelKeys = ['medicineAlerts', 'pendingVaccinations'];

const NurseDashboardSidePanels = ({
  panels,
  loading,
  onRetry,
  panelKeys = defaultPanelKeys,
  maxItemsByPanel,
  className = 'space-y-3',
}) => {
  const isSinglePanelLayout = panelKeys.length === 1;

  const resolvedMaxItemsByPanel = {
    medicineAlerts: 3,
    pendingVaccinations: 3,
    ...(maxItemsByPanel || {}),
  };

  return (
    <div className={className}>
      {panelKeys.map((panelKey) => {
        const panel = panels?.[panelKey] || { items: [], status: 'empty', error: '', to: '/nurse/dashboard' };
        const metadata = panelMeta[panelKey] || panelMeta.pendingVaccinations;
        const maxItems = Math.max(1, Number(resolvedMaxItemsByPanel[panelKey] || 3));
        const visibleItems = Array.isArray(panel.items) ? panel.items.slice(0, maxItems) : [];

        return (
          <section key={panelKey} className={`app-card-shell rounded-2xl p-3 ${isSinglePanelLayout ? 'h-full flex flex-col' : ''}`}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="app-overline mb-1">Danh sách ưu tiên</p>
                <h3 className="app-card-title">{metadata.title}</h3>
                <p className="app-meta-text mt-0.5">{metadata.subtitle}</p>
              </div>
              <Link
                to={panel.to}
                className="app-focus-ring app-btn-secondary px-2"
              >
                {metadata.cta}
              </Link>
            </div>

            {loading && !visibleItems.length ? <LoadingSpinner label="Đang tải dữ liệu..." size="sm" /> : null}

            {panel.status === 'error' ? (
              <ErrorState
                message={panel.error || 'Không thể tải dữ liệu cho khối thông tin này.'}
                onRetry={onRetry}
              />
            ) : null}

            {!loading && panel.status !== 'error' && !panel.items?.length ? (
              <EmptyState
                title="Chưa có dữ liệu"
                description="Khối thông tin sẽ hiển thị khi có bản ghi phù hợp."
              />
            ) : null}

            {visibleItems.length ? (
              <div className="space-y-1.5 rounded-xl border border-outline-variant bg-surface-container-low p-2">
                {visibleItems.map((item) => (
                  <Link
                    key={item.id}
                    to={panel.to}
                    className="app-focus-ring app-interactive flex items-start gap-2 rounded-lg border border-outline-variant bg-surface px-2 py-1.5 hover:border-primary/25 hover:bg-primary-soft/35"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {renderPanelItem(panelKey, item)}
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
};

export default NurseDashboardSidePanels;
