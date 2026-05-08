import React from 'react';
import { AppStackedBarChart } from '../../../shared/components/charts';

const HEALTH_STATUS_SERIES = [
  { key: 'highRisk', label: 'Nguy cơ cao', color: 'danger' },
  { key: 'followUp', label: 'Theo dõi', color: 'warning' },
  { key: 'stable', label: 'Ổn định', color: 'success' },
];

const AdminReportMainChart = ({ data = [], meta }) => {
  const chartTitle = meta?.title || 'Phân bố trạng thái sức khỏe theo lớp';
  const chartDescription = meta?.description || 'Theo dõi tỷ trọng ổn định, theo dõi và nguy cơ cao trên từng lớp học.';

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm md:p-6">
      <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-lg font-bold text-on-surface">{chartTitle}</h4>
          <p className="text-sm text-on-surface-variant">{chartDescription}</p>
          {meta?.groupingHint ? <p className="mt-1 text-xs text-on-surface-muted">{meta.groupingHint}</p> : null}
        </div>
      </div>

      <AppStackedBarChart
        data={data}
        xKey="label"
        series={HEALTH_STATUS_SERIES}
        height={288}
        tooltipFormatter={(value, name) => [`${value} học sinh`, name]}
        emptyTitle="Không có dữ liệu biểu đồ"
        emptyDescription="Không có dữ liệu biểu đồ phù hợp với bộ lọc hiện tại."
      />
    </section>
  );
};

export default AdminReportMainChart;
