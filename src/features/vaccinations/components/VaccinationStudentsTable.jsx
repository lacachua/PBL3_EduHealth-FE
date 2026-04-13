import React from 'react';
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
    + (showResultColumns ? 3 : 0)
    + 1;

  if (loading) {
    return <p className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-4 text-sm text-[#64748B]">Đang tải danh sách học sinh...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
        <p>{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg border border-[#FCA5A5] px-2.5 py-1 text-xs font-semibold text-[#B91C1C]"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white [scrollbar-width:thin]">
      <table className={`w-full text-left text-sm ${showResultColumns ? 'min-w-[1080px]' : 'min-w-[920px]'}`}>
        <thead className="nurse-table-head-strong sticky top-0 z-[1] text-[11px] uppercase tracking-[0.08em]">
          <tr>
            <th className="px-4 py-3">Học sinh</th>
            <th className="px-4 py-3">Lớp</th>
            {showCampaignColumn ? <th className="px-4 py-3">Đợt tiêm</th> : null}
            {showScheduledDateColumn ? <th className="px-4 py-3">Ngày dự kiến</th> : null}
            <th className="px-4 py-3">Trạng thái tiêm</th>
            {showResultColumns ? <th className="px-4 py-3">Ngày tiêm thực tế</th> : null}
            {showResultColumns ? <th className="px-4 py-3">Số lô</th> : null}
            {showResultColumns ? <th className="px-4 py-3">Ghi chú</th> : null}
            <th className="px-3 py-3 text-right">Hành động</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E2E8F0]">
          {!rows.length ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-[#64748B]" colSpan={colSpan}>
                {emptyMessage || 'Không có dữ liệu phù hợp.'}
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.studentVaccinationId} className="hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 min-w-[220px]">
                  <p className="font-semibold text-[#0F172A]">{item.student?.fullName || '--'}</p>
                  <p className="text-xs text-[#64748B]">
                    {item.student?.studentCode || '--'}
                    {' • '}
                    Mã hồ sơ {item.student?.studentId || '--'}
                  </p>
                </td>
                <td className="px-4 py-3 text-[#334155]">{item.student?.className || '--'}</td>
                {showCampaignColumn ? (
                  <td className="px-4 py-3 min-w-[220px]">
                    {hasCampaignAction ? (
                      <button
                        type="button"
                        onClick={() => onOpenCampaign(item)}
                        className="nurse-focus-ring text-left text-sm font-semibold text-[#0F172A] hover:text-[#166534]"
                      >
                        {item.campaignName || '--'}
                      </button>
                    ) : (
                      <p className="text-sm font-semibold text-[#0F172A]">{item.campaignName || '--'}</p>
                    )}
                    <p className="text-xs text-[#64748B]">{item.campaignId || '--'} • {item.scheduledDateLabel || '--'}</p>
                  </td>
                ) : null}
                {showScheduledDateColumn ? <td className="px-4 py-3 text-[#334155]">{item.scheduledDateLabel || '--'}</td> : null}
                <td className="px-4 py-3">
                  <VaccinationStatusBadge label={item.statusLabel} className={item.statusBadgeClassName} />
                </td>
                {showResultColumns ? <td className="px-4 py-3 text-[#334155]">{item.vaccinatedAtLabel || '--'}</td> : null}
                {showResultColumns ? <td className="px-4 py-3 font-mono text-xs text-[#334155]">{item.lotNumber || '--'}</td> : null}
                {showResultColumns ? (
                  <td className="px-4 py-3 text-[#334155]" title={item.note || '--'} style={clampTwoLinesStyle}>
                    {item.note || '--'}
                  </td>
                ) : null}
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex justify-end gap-1.5">
                    <VaccinationRowActionButton
                      icon="history"
                      label="Lịch sử"
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
