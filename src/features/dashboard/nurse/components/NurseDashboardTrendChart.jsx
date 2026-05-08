import React from 'react';
import { AppBarChart } from '../../../../shared/components/charts';
import ErrorState from '../../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../../shared/components/core/LoadingSpinner';

const NurseDashboardTrendChart = ({ trend, loading, onRetry }) => {
  const points = Array.isArray(trend?.points) ? trend.points : [];
  const hasError = trend?.status === 'error';

  return (
    <section className="app-card-shell flex h-full min-h-[312px] flex-col rounded-2xl p-4 sm:p-4.5">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div>
          <p className="app-overline mb-1">Hiệu suất tiếp nhận</p>
          <h2 className="app-section-title">Lượt khám 7 ngày gần nhất</h2>
          <p className="app-meta-text mt-0.5">Theo dõi khối lượng tiếp nhận theo từng ngày.</p>
        </div>
        <span className="rounded-full border border-outline-variant bg-surface px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
          Tổng {trend?.totalVisits || 0} lượt
        </span>
      </div>

      {loading && !points.length ? <LoadingSpinner label="Đang tải biểu đồ lượt khám..." /> : null}

      {hasError ? (
        <ErrorState message={trend?.error || 'Không thể tải dữ liệu lượt khám trong 7 ngày.'} onRetry={onRetry} />
      ) : null}

      {!loading && !hasError && !points.length ? null : null}

      {!hasError && points.length ? (
        <div className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-3 pb-2 pt-3">
          <AppBarChart
            data={points}
            xKey="weekdayLabel"
            yKey="value"
            color="primary"
            height={200}
            tooltipFormatter={(value) => [`${value} lượt khám`, 'Lượt khám']}
            emptyTitle="Chưa có dữ liệu biểu đồ"
            emptyDescription="Biểu đồ sẽ hiển thị khi hệ thống có dữ liệu khám theo ngày."
          />
        </div>
      ) : null}
    </section>
  );
};

export default NurseDashboardTrendChart;
