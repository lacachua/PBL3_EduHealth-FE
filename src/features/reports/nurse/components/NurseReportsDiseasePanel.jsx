import React from 'react';
import EmptyState from '../../../../shared/components/core/EmptyState';
import SectionCard from '../../../../shared/components/core/SectionCard';

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
  const pieGradient = buildPieGradient(items);

  return (
    <SectionCard
      title="Phân bố nhóm bệnh"
      subtitle="Tỷ trọng các nhóm bệnh trong khoảng thời gian báo cáo."
      className="app-card-shell h-full rounded-xl p-0"
      headerClassName="mb-0 flex items-start justify-between px-4 pt-3.5"
      titleClassName="app-section-title"
      subtitleClassName="app-meta-text mt-0.5 leading-4"
      actions={(
        <span className="rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
          Tổng số: {totalCases} ca
        </span>
      )}
    >
      <div className="p-4 pt-3">
        <p className="app-overline mb-2">Cơ cấu nhóm bệnh</p>
        {!items.length ? (
          <EmptyState
            title="Không có dữ liệu bệnh lý"
            description="Hệ thống chưa ghi nhận nhóm bệnh cho bộ lọc hiện tại."
          />
        ) : (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3">
            <div className="grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
              <div className="relative mx-auto h-36 w-36 shrink-0 rounded-full" style={{ background: pieGradient }}>
                <div className="absolute inset-[18px] flex items-center justify-center rounded-full bg-surface text-center">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-on-surface-muted">Tổng số</p>
                    <p className="text-[1.75rem] font-extrabold leading-none text-on-surface">{totalCases}</p>
                    <p className="text-[11px] font-semibold text-on-surface-variant">ca</p>
                  </div>
                </div>
              </div>

              <div className="min-w-0 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-outline-variant bg-surface px-2.5 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color || 'var(--app-border)' }} />
                        <p className="truncate text-sm font-semibold text-on-surface">{item.label}</p>
                      </div>
                      <span className="shrink-0 text-[12px] font-semibold text-on-surface-variant">
                        {item.count} ca ({item.ratio}%)
                      </span>
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
