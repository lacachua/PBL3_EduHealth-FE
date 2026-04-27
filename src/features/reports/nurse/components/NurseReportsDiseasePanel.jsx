import { useMemo } from 'react';
import { AppDonutChart } from '../../../../shared/components/charts';
import SectionCard from '../../../../shared/components/core/SectionCard';

const buildDiseaseDonutItems = (items, totalCases, maxItems = 5) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  if (items.length <= maxItems) {
    return items;
  }

  const sorted = [...items].sort((a, b) => (b.count || 0) - (a.count || 0));
  const topItems = sorted.slice(0, maxItems - 1);
  const otherItems = sorted.slice(maxItems - 1);

  const otherCount = otherItems.reduce((sum, item) => sum + (item.count || 0), 0);
  const otherRatio = totalCases > 0 ? Math.round((otherCount / totalCases) * 100) : 0;

  return [
    ...topItems,
    {
      id: 'other-group',
      label: 'Khác',
      count: otherCount,
      ratio: otherRatio,
      color: 'var(--app-border)',
    },
  ];
};

const NurseReportsDiseasePanel = ({ disease }) => {
  const items = Array.isArray(disease?.items) ? disease.items : [];
  const totalCases = Number(disease?.totalCases || 0);

  const displayItems = useMemo(() => {
    return buildDiseaseDonutItems(items, totalCases, 5);
  }, [items, totalCases]);

  const donutData = displayItems.map((item) => ({
    name: item.label,
    value: item.count,
    color: item.color,
    ratio: item.ratio || 0,
  }));

  return (
    <SectionCard
      title="Phân bố nhóm bệnh"
      className="app-card-shell flex h-full flex-col rounded-xl p-0"
      headerClassName="mb-0 flex items-start justify-between px-4 pt-3.5"
      titleClassName="app-section-title"
      subtitleClassName="app-meta-text mt-0.5 leading-4"
      actions={(
        <span className="rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
          Tổng số: {totalCases} ca
        </span>
      )}
    >
      <div className="flex flex-1 flex-col p-4 pt-3">
        <p className="app-overline mb-2">Cơ cấu nhóm bệnh</p>

        {!displayItems.length ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-6 text-center">
            <span className="material-symbols-outlined text-2xl text-on-surface-muted">pie_chart</span>
            <p className="mt-2 text-sm font-semibold text-on-surface">Không có dữ liệu bệnh lý</p>
            <p className="mt-1 text-[12px] text-on-surface-variant">Hệ thống chưa ghi nhận nhóm bệnh cho bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <div className="relative mx-auto w-full max-w-[260px]">
              <AppDonutChart
                data={donutData}
                nameKey="name"
                valueKey="value"
                colorKey="color"
                ratioKey="ratio"
                unit="ca"
                centerLabel="Tổng số"
                centerValue={totalCases}
                centerSublabel="ca"
                height={160}
                innerRadius={46}
                outerRadius={72}
                showTooltip={true}
                emptyTitle="Không có dữ liệu"
                emptyDescription="Chưa có nhóm bệnh."
              />
            </div>

            <div className="mt-4 flex w-full flex-col gap-2">
              {displayItems.map((item) => (
                <div key={item.id} className="flex w-full items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ background: item.color || 'var(--app-border)' }}
                    />
                    <span className="min-w-0 font-semibold text-on-surface" title={item.label}>{item.label}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="whitespace-nowrap text-sm font-semibold text-on-surface-variant">
                      {item.count} ca
                    </span>
                    <span className="whitespace-nowrap rounded-full border border-outline-variant bg-surface-container px-3 py-1 text-sm font-semibold">
                      {item.ratio}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default NurseReportsDiseasePanel;
