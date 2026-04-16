import React from 'react';
import EmptyState from '../../../../shared/components/admin/EmptyState';
import SectionCard from '../../../../shared/components/admin/SectionCard';

const deltaToneClassMap = {
  up: 'text-success',
  down: 'text-danger',
  stable: 'text-on-surface-variant',
};

const alertToneClassMap = {
  danger: 'border-danger/25 bg-danger-soft text-danger',
  warning: 'border-warning/25 bg-warning-soft text-warning',
  info: 'border-info/25 bg-info-soft text-info',
};

const NurseReportsInsightsPanel = ({ insights }) => {
  const medicines = Array.isArray(insights?.topMedicines) ? insights.topMedicines : [];
  const alerts = Array.isArray(insights?.alerts) ? insights.alerts : [];

  return (
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      <SectionCard
        title="Top thuốc sử dụng"
        subtitle="Phát hiện nhóm thuốc cần bổ sung"
        className="app-card-shell rounded-xl p-0"
        headerClassName="mb-0 flex items-start justify-between px-4 pt-3.5"
        titleClassName="text-[15px] font-bold text-on-surface"
        subtitleClassName="mt-0.5 text-[11px] text-on-surface-variant leading-4"
      >
        <div className="space-y-1.5 p-4 pt-3">
          {!medicines.length ? (
            <EmptyState
              title="Không có dữ liệu thuốc"
              description="Danh sách top thuốc sẽ hiển thị khi có dữ liệu cấp phát."
            />
          ) : (
            medicines.map((item) => {
              const deltaPrefix = item.deltaPercent > 0 ? '+' : '';
              const deltaClassName = deltaToneClassMap[item.trend] || deltaToneClassMap.stable;

              return (
                <article key={item.id} className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-on-surface">{item.name}</p>
                    <span className={`text-[11px] font-semibold ${deltaClassName}`}>
                      {deltaPrefix}{item.deltaPercent}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-on-surface-variant">
                    <p className="truncate">{item.category}</p>
                    <span className={`rounded-full border px-2 py-0.5 font-semibold ${item.stockStatus === 'low' ? 'border-danger/25 bg-danger-soft text-danger' : 'border-outline-variant bg-surface text-on-surface-variant'}`}>
                      {item.stockLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-on-surface-variant">Số lượt dùng: <span className="font-semibold text-on-surface">{item.usedQuantity}</span></p>
                </article>
              );
            })
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Cảnh báo & gợi ý"
        subtitle="Điểm cần ưu tiên xử lý trong kỳ"
        className="app-card-shell rounded-xl p-0"
        headerClassName="mb-0 flex items-start justify-between px-4 pt-3.5"
        titleClassName="text-[15px] font-bold text-on-surface"
        subtitleClassName="mt-0.5 text-[11px] text-on-surface-variant leading-4"
      >
        <div className="space-y-1.5 p-4 pt-3">
          {!alerts.length ? (
            <EmptyState
              title="Chưa có cảnh báo"
              description="Các cảnh báo tự động sẽ hiển thị tại đây khi hệ thống phát hiện bất thường."
            />
          ) : (
            alerts.map((alert) => (
              <article key={alert.id} className={`rounded-lg border px-3 py-2 ${alertToneClassMap[alert.tone] || alertToneClassMap.info}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{alert.title}</h3>
                  <span className="text-[10px] font-semibold">{alert.timeLabel}</span>
                </div>
                <p className="mt-1 text-[12px] leading-[1.35]">{alert.message}</p>
              </article>
            ))
          )}
        </div>
      </SectionCard>
    </section>
  );
};

export default NurseReportsInsightsPanel;
