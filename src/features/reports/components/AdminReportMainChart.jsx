import React from 'react';

const clampPercent = (value) => Math.max(0, Math.min(100, Number(value || 0)));

const ClassBar = ({ item }) => {
  const total = Number(item.stable || 0) + Number(item.followUp || 0) + Number(item.highRisk || 0);
  const stablePct = clampPercent(Number.isFinite(item.stablePct) ? item.stablePct : (total ? Math.round((item.stable / total) * 100) : 0));
  const followUpPct = clampPercent(Number.isFinite(item.followUpPct) ? item.followUpPct : (total ? Math.round((item.followUp / total) * 100) : 0));
  const highRiskPct = clampPercent(Number.isFinite(item.highRiskPct) ? item.highRiskPct : (total ? Math.round((item.highRisk / total) * 100) : 0));
  const label = item.label || item.className || item.grade || '-';

  return (
    <div className="group relative z-10 flex h-full w-20 shrink-0 cursor-pointer flex-col-reverse items-center gap-1">
      <span className="mt-3 max-w-full truncate text-[11px] font-bold text-on-surface-muted" title={label}>{label}</span>
      <div className="w-12 rounded-t-sm bg-success" style={{ height: `${stablePct}%` }} />
      <div className="w-12 bg-warning" style={{ height: `${followUpPct}%` }} />
      <div className="w-12 bg-danger" style={{ height: `${highRiskPct}%` }} />
      <div className="pointer-events-none absolute -top-24 left-1/2 z-20 min-w-[160px] -translate-x-1/2 rounded-lg bg-on-surface px-2.5 py-2 text-[10px] text-surface opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        <p className="font-bold">{label}</p>
        <p>Ổn định: {item.stable}</p>
        <p>Theo dõi: {item.followUp}</p>
        <p>Cảnh báo: {item.highRisk}</p>
      </div>
    </div>
  );
};

const AdminReportMainChart = ({ data = [], meta }) => {
  const chartTitle = meta?.title || 'Phân bố trạng thái sức khỏe theo lớp';
  const chartDescription = meta?.description || 'Theo dõi tỷ trọng ổn định, theo dõi và nguy cơ cao trên từng lớp học.';
  const chartWidth = Math.max(560, data.length * 96);

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm md:p-6">
      <div className="mb-8 flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-lg font-bold text-on-surface">{chartTitle}</h4>
          <p className="text-sm text-on-surface-variant">{chartDescription}</p>
          {meta?.groupingHint ? <p className="mt-1 text-xs text-on-surface-muted">{meta.groupingHint}</p> : null}
        </div>

        <div className="flex max-w-full flex-wrap items-center gap-3 rounded-xl border border-outline-variant bg-surface p-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-success" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Ổn định</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Theo dõi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-danger" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Nguy cơ cao</span>
          </div>
        </div>
      </div>

      {data.length ? (
        <div className="max-w-full overflow-x-auto pb-2 [scrollbar-width:thin]">
          <div
            className="relative flex h-72 max-w-none items-end gap-4 border-b border-outline-variant/50 pb-2 pl-8 pr-4"
            style={{ width: `${chartWidth}px` }}
          >
            <div className="pointer-events-none absolute inset-0 flex h-full w-full flex-col justify-between pr-4 text-[10px] font-bold text-on-surface-muted">
              <div className="w-full border-t border-outline-variant/30 pt-1">100%</div>
              <div className="w-full border-t border-outline-variant/30 pt-1">75%</div>
              <div className="w-full border-t border-outline-variant/30 pt-1">50%</div>
              <div className="w-full border-t border-outline-variant/30 pt-1">25%</div>
              <div />
            </div>

            {data.map((item) => (
              <ClassBar key={item.id || item.classId || item.label || item.grade} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface px-4 py-8 text-center text-sm text-on-surface-variant">
          Không có dữ liệu biểu đồ phù hợp với bộ lọc hiện tại.
        </div>
      )}
    </section>
  );
};

export default AdminReportMainChart;
