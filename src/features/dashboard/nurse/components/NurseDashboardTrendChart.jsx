import React from 'react';
import EmptyState from '../../../../shared/components/admin/EmptyState';
import ErrorState from '../../../../shared/components/admin/ErrorState';
import LoadingSpinner from '../../../../shared/components/admin/LoadingSpinner';

const NurseDashboardTrendChart = ({ trend, loading, onRetry }) => {
  const points = Array.isArray(trend?.points) ? trend.points : [];
  const hasError = trend?.status === 'error';

  return (
    <section className="app-card-shell flex h-full min-h-[312px] flex-col rounded-2xl p-4 sm:p-4.5">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-on-surface">Lượt khám 7 ngày gần nhất</h2>
          <p className="mt-0.5 text-xs text-on-surface-variant">Theo dõi khối lượng tiếp nhận theo từng ngày.</p>
        </div>
        <span className="rounded-full border border-outline-variant bg-surface px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">
          Tổng {trend?.totalVisits || 0} lượt
        </span>
      </div>

      {loading && !points.length ? <LoadingSpinner label="Đang tải biểu đồ lượt khám..." /> : null}

      {hasError ? (
        <ErrorState message={trend?.error || 'Không thể tải dữ liệu lượt khám trong 7 ngày.'} onRetry={onRetry} />
      ) : null}

      {!loading && !hasError && !points.length ? (
        <EmptyState
          title="Chưa có dữ liệu biểu đồ"
          description="Biểu đồ sẽ hiển thị khi hệ thống có dữ liệu khám theo ngày."
        />
      ) : null}

      {!hasError && points.length ? (
        <div className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-3.5 pb-2 pt-3">
          <div className="flex h-40 items-end gap-2 md:h-44">
            {points.map((point, index) => {
              const isToday = index === points.length - 1;

              return (
                <div key={point.id} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <div className="text-[10px] font-semibold text-on-surface-variant">{point.value}</div>
                  <div className="relative h-full w-full max-w-[56px] rounded-t-md bg-outline-variant/55">
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-t-md ${isToday ? 'bg-[#15803D]' : 'bg-[#4ADE80]'}`}
                      style={{ height: `${point.heightPercent}%` }}
                      aria-label={`${point.weekdayLabel} ${point.dateLabel}: ${point.value} lượt khám`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-on-surface-variant">
            {points.map((point) => (
              <div key={`${point.id}-label`}>
                <div>{point.weekdayLabel}</div>
                <div className="text-on-surface-muted">{point.dateLabel}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default NurseDashboardTrendChart;
