import React, { useMemo } from 'react';
import EmptyState from '../../../../shared/components/admin/EmptyState';
import SectionCard from '../../../../shared/components/admin/SectionCard';

const buildPieGradient = (items) => {
  if (!items.length) {
    return 'conic-gradient(var(--app-border) 0deg 360deg)';
  }

  let angle = 0;
  const stops = items.map((item) => {
    const start = angle;
    const span = Math.round((Math.max(0, Number(item.ratio) || 0) / 100) * 360);
    angle += span;
    const end = Math.min(360, angle);
    return `${item.color || 'var(--app-border)'} ${start}deg ${end}deg`;
  });

  if (angle < 360) {
    stops.push(`var(--app-border) ${angle}deg 360deg`);
  }

  return `conic-gradient(${stops.join(', ')})`;
};

const NurseReportsDiseasePanel = ({ disease }) => {
  const items = Array.isArray(disease?.items) ? disease.items : [];
  const totalCases = Number(disease?.totalCases || 0);

  const pieGradient = useMemo(() => buildPieGradient(items), [items]);

  return (
    <SectionCard
      title="Phân bố bệnh lý"
      subtitle="Tỷ trọng nhóm triệu chứng trong kỳ"
      className="nurse-card-soft h-full rounded-xl p-0"
      headerClassName="mb-0 flex items-start justify-between px-4 pt-3.5"
      titleClassName="text-[15px] font-bold text-on-surface"
      subtitleClassName="mt-0.5 text-[11px] text-on-surface-variant leading-4"
      actions={(
        <span className="rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant">
          {totalCases} ca
        </span>
      )}
    >
      <div className="p-4 pt-3">
        {!items.length ? (
          <EmptyState
            title="Không có dữ liệu bệnh lý"
            description="Hệ thống chưa ghi nhận nhóm bệnh cho bộ lọc hiện tại."
          />
        ) : (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative mx-auto h-32 w-32 shrink-0 rounded-full" style={{ background: pieGradient }}>
                <div className="absolute inset-[16px] flex items-center justify-center rounded-full bg-surface text-center">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-muted">Tổng ca</p>
                    <p className="text-[1.72rem] font-extrabold leading-none text-on-surface">{totalCases}</p>
                  </div>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-outline-variant bg-surface px-2.5 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                      <span className="text-[11px] font-semibold text-on-surface-variant">{item.count} ca ({item.ratio}%)</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-outline-variant/70">
                      <div className="h-full rounded-full" style={{ width: `${item.ratio}%`, background: item.color || 'var(--app-border)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default NurseReportsDiseasePanel;
