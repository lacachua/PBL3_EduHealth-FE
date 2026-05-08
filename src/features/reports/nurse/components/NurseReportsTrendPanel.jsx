import { AppBarChart } from '../../../../shared/components/charts';
import SectionCard from '../../../../shared/components/core/SectionCard';

const NurseReportsTrendPanel = ({ trend }) => {
  const items = Array.isArray(trend?.items) ? trend.items : [];
  const totalValue = items.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <SectionCard
      title="Xu hướng lượt khám"
      className="app-card-shell flex h-full flex-col rounded-xl p-0"
      headerClassName="mb-0 flex items-start justify-between px-4 pt-3.5"
      titleClassName="app-section-title"
      subtitleClassName="app-meta-text mt-0.5 leading-4"
      actions={(
        <span className="rounded-full border border-outline-variant bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
          Tổng số: {totalValue} lượt khám
        </span>
      )}
    >
      <div className="flex flex-1 flex-col p-4 pt-3">
        <p className="app-overline mb-2">Thống kê theo tuần</p>
        <div className="flex min-h-[360px] flex-1 flex-col rounded-xl border border-outline-variant bg-surface-container-low px-3 pb-2 pt-3">
          <AppBarChart
            data={items}
            xKey="label"
            yKey="value"
            valueLabel="Lượt khám"
            color="primary"
            height={320}
            tooltipFormatter={(value) => [`${value} lượt khám`, 'Lượt khám']}
            emptyTitle="Chưa có dữ liệu xu hướng"
            emptyDescription="Biểu đồ sẽ hiển thị khi bộ lọc trả về dữ liệu phù hợp."
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default NurseReportsTrendPanel;
