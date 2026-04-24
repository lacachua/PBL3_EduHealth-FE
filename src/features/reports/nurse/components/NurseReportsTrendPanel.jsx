import React from 'react';
import EmptyState from '../../../../shared/components/core/EmptyState';
import SectionCard from '../../../../shared/components/core/SectionCard';

const NurseReportsTrendPanel = ({ trend }) => {
  const items = Array.isArray(trend?.items) ? trend.items : [];
  const maxValue = Math.max(1, Number(trend?.maxValue) || 0);
  const totalValue = items.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <SectionCard
      title="Xu hướng theo thời gian"
      subtitle="Theo dõi số ca y tế theo bộ lọc đã chọn"
      className="app-card-shell h-full rounded-xl p-0"
      headerClassName="mb-0 flex items-start justify-between px-4 pt-3.5"
      titleClassName="app-section-title"
      subtitleClassName="app-meta-text mt-0.5 leading-4"
      actions={(
        <span className="rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
          Tổng {totalValue}
        </span>
      )}
    >
      <div className="p-4 pt-3">
        <p className="app-overline mb-2">Dòng thời gian nghiệp vụ</p>
        {!items.length ? (
          <EmptyState
            title="Chưa có dữ liệu xu hướng"
            description="Biểu đồ sẽ hiển thị khi bộ lọc trả về dữ liệu phù hợp."
          />
        ) : (
          <>
            <div className="rounded-xl border border-outline-variant bg-surface-container-low px-3.5 pb-2.5 pt-3">
              <div className="flex h-40 items-end gap-2 sm:h-44">
                {items.map((item, index) => {
                  const heightPercent = Math.max(12, Math.round((item.value / maxValue) * 100));
                  const isPeak = item.value === maxValue;
                  const isLast = index === items.length - 1;

                  return (
                    <div key={item.id} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                      <p className="text-[11px] font-semibold text-on-surface-variant">{item.value}</p>
                      <div className="relative h-full w-full max-w-[60px] rounded-t-md bg-outline-variant/50">
                        <div
                          className={`absolute bottom-0 left-0 right-0 rounded-t-md transition-[height,background-color] duration-300 ${isPeak || isLast ? 'bg-primary' : 'bg-success'}`}
                          style={{ height: `${heightPercent}%` }}
                          aria-label={`${item.label}: ${item.value}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 grid gap-1 text-center text-[11px] font-semibold text-on-surface-variant" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
                {items.map((item) => (
                  <p key={`${item.id}-label`} className="truncate">{item.label}</p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </SectionCard>
  );
};

export default NurseReportsTrendPanel;
