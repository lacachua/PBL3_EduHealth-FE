
import VaccinationStatusBadge from './VaccinationStatusBadge';

const VaccinationCampaignTable = ({ rows, loading, error, onRetry, onViewDetail }) => {
  if (loading) {
    return <p className="app-panel-shell px-3 py-4 text-sm text-on-surface-variant">Đang tải danh sách đợt tiêm...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
        <p>{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="app-focus-ring mt-2 rounded-lg border border-danger/35 bg-surface px-2.5 py-1 text-xs font-semibold text-danger"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-outline-variant bg-surface [scrollbar-width:thin]">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead className="app-table-head text-[11px] uppercase tracking-[0.08em]">
          <tr>
            <th className="w-[30%] px-4 py-3">Đợt tiêm</th>
            <th className="w-[16%] px-4 py-3">Ngày tiêm</th>
            <th className="w-[16%] px-4 py-3">Đối tượng</th>
            <th className="w-[16%] px-4 py-3">Trạng thái</th>
            <th className="w-[22%] px-4 py-3">Tiến độ</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant">
          {!rows.length ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-on-surface-variant" colSpan={5}>
                Không có đợt tiêm phù hợp với bộ lọc hiện tại.
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr
                key={item.id}
                className="group app-interactive cursor-pointer hover:bg-surface-container-low"
                onClick={() => onViewDetail(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onViewDetail(item);
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <td className="px-4 py-3 min-w-[220px]">
                  <p className="text-sm font-semibold text-on-surface transition group-hover:text-primary">{item.name}</p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {item.id}
                    {' • '}
                    {item.vaccineName}
                    {' • Mũi '}
                    {item.doseNumber}
                  </p>
                </td>
                <td className="px-4 py-3 text-on-surface">{item.scheduledDateLabel}</td>
                <td className="px-4 py-3 text-on-surface">{item.targetTypeLabel}</td>
                <td className="px-4 py-3">
                  <VaccinationStatusBadge label={item.statusLabel} className={item.statusBadgeClassName} />
                </td>
                <td className="px-4 py-3 min-w-[200px]">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant">Tổng: <span className="font-semibold text-on-surface">{item.statistics.totalStudents}</span></span>
                      <span className="text-success font-semibold">{item.statistics.doneCount} đã tiêm</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-outline-variant">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${Math.max(0, Math.min(100, item.statistics.progressPercent || 0))}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VaccinationCampaignTable;
