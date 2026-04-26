
import VaccinationStatusBadge from './VaccinationStatusBadge';
import VaccinationRowActionButton from './VaccinationRowActionButton';

const clampTwoLinesStyle = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const VaccinationStudentsTable = ({
  rows,
  loading,
  error,
  emptyMessage,
  onRetry,
  onOpenHistory,
  onOpenUpdate,
  onOpenCampaign,
  showCampaignColumn = false,
  showResultColumns = true,
  showScheduledDateColumn = false,
}) => {
  const hasCampaignAction = showCampaignColumn && typeof onOpenCampaign === 'function';
  const colSpan = 5
    + (showCampaignColumn ? 1 : 0)
    + (showScheduledDateColumn ? 1 : 0)
    + (showResultColumns ? 2 : 0)
    + 1;

  if (loading) {
    return <p className="app-panel-shell px-3 py-4 text-sm text-on-surface-variant">Đang tải danh sách học sinh...</p>;
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
      <table className={`w-full text-left text-sm ${showResultColumns ? 'min-w-[840px]' : 'min-w-[760px]'}`}>
        <thead className="app-table-head sticky top-0 z-[1] text-[11px] uppercase tracking-[0.08em]">
          <tr>
            <th className="px-4 py-3">Học sinh</th>
            <th className="px-4 py-3">Lớp</th>
            {showCampaignColumn ? <th className="px-4 py-3">Đợt tiêm</th> : null}
            {showScheduledDateColumn ? <th className="px-4 py-3">Ngày dự kiến</th> : null}
            <th className="px-4 py-3">Trạng thái tiêm</th>
            {showResultColumns ? <th className="px-4 py-3">Ngày tiêm & Số lô</th> : null}
            {showResultColumns ? <th className="px-4 py-3">Ghi chú</th> : null}
            <th className="px-3 py-3 text-right">Hành động</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant">
          {!rows.length ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-on-surface-variant" colSpan={colSpan}>
                {emptyMessage || 'Không có dữ liệu phù hợp.'}
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.studentVaccinationId} className="app-interactive hover:bg-surface-container-low">
                <td className="px-4 py-3 min-w-[220px]">
                  <p className="font-semibold text-on-surface">{item.student?.fullName || '--'}</p>
                  <p className="text-xs text-on-surface-variant">
                    {item.student?.studentCode || '--'}
                    {' • '}
                    Mã hồ sơ {item.student?.studentId || '--'}
                  </p>
                </td>
                <td className="px-4 py-3 text-on-surface">{item.student?.className || '--'}</td>
                {showCampaignColumn ? (
                  <td className="px-4 py-3 min-w-[220px]">
                    {hasCampaignAction ? (
                      <button
                        type="button"
                        onClick={() => onOpenCampaign(item)}
                        className="app-focus-ring text-left text-sm font-semibold text-on-surface hover:text-primary"
                      >
                        {item.campaignName || '--'}
                      </button>
                    ) : (
                      <p className="text-sm font-semibold text-on-surface">{item.campaignName || '--'}</p>
                    )}
                    <p className="text-xs text-on-surface-variant">{item.campaignId || '--'} • {item.scheduledDateLabel || '--'}</p>
                  </td>
                ) : null}
                {showScheduledDateColumn ? <td className="px-4 py-3 text-on-surface">{item.scheduledDateLabel || '--'}</td> : null}
                <td className="px-4 py-3">
                  <VaccinationStatusBadge label={item.statusLabel} className={item.statusBadgeClassName} />
                </td>
                {showResultColumns ? (
                  <td className="px-4 py-3 text-on-surface min-w-[140px]">
                    <p>{item.vaccinatedAtLabel || '--'}</p>
                    {item.lotNumber ? <p className="text-xs text-on-surface-variant mt-0.5">Lô: <span className="font-mono">{item.lotNumber}</span></p> : null}
                  </td>
                ) : null}
                {showResultColumns ? (
                  <td className="px-4 py-3 text-on-surface" title={item.note || '--'} style={clampTwoLinesStyle}>
                    {item.note || '--'}
                  </td>
                ) : null}
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex justify-end gap-1.5">
                    <VaccinationRowActionButton
                      icon="history"
                      label="Lịch sử tiêm tổng hợp"
                      onClick={() => onOpenHistory(item)}
                      variant="neutral"
                    />
                    <VaccinationRowActionButton
                      icon="edit"
                      label="Cập nhật"
                      onClick={() => onOpenUpdate(item)}
                      variant="accent"
                    />
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

export default VaccinationStudentsTable;
