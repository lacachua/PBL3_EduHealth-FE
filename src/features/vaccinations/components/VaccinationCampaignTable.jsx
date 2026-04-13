import React from 'react';
import VaccinationStatusBadge from './VaccinationStatusBadge';

const VaccinationCampaignTable = ({ rows, loading, error, onRetry, onViewDetail }) => {
  if (loading) {
    return <p className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-4 text-sm text-[#64748B]">Đang tải danh sách đợt tiêm...</p>;
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
      <table className="min-w-[980px] w-full text-left text-sm">
        <thead className="nurse-table-head-strong text-[11px] uppercase tracking-[0.08em]">
          <tr>
            <th className="px-4 py-3">Đợt tiêm</th>
            <th className="px-4 py-3">Ngày tiêm</th>
            <th className="px-4 py-3">Đối tượng</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 text-right">Tổng HS</th>
            <th className="px-4 py-3 text-right">Đã tiêm</th>
            <th className="px-4 py-3 text-right">Chờ tiêm</th>
            <th className="px-4 py-3">Tiến độ</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E2E8F0]">
          {!rows.length ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-[#64748B]" colSpan={8}>
                Không có đợt tiêm phù hợp với bộ lọc hiện tại.
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr
                key={item.id}
                className="group cursor-pointer hover:bg-[#F8FAFC]"
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
                  <p className="text-sm font-semibold text-[#0F172A] transition group-hover:text-[#166534]">{item.name}</p>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    {item.id}
                    {' • '}
                    {item.vaccineName}
                    {' • Mũi '}
                    {item.doseNumber}
                  </p>
                </td>
                <td className="px-4 py-3 text-[#334155]">{item.scheduledDateLabel}</td>
                <td className="px-4 py-3 text-[#334155]">{item.targetTypeLabel}</td>
                <td className="px-4 py-3">
                  <VaccinationStatusBadge label={item.statusLabel} className={item.statusBadgeClassName} />
                </td>
                <td className="px-4 py-3 text-right font-semibold text-[#0F172A]">{item.statistics.totalStudents}</td>
                <td className="px-4 py-3 text-right text-[#166534] font-semibold">{item.statistics.doneCount}</td>
                <td className="px-4 py-3 text-right text-[#B45309] font-semibold">{item.statistics.pendingCount}</td>
                <td className="px-4 py-3 min-w-[170px]">
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-2 rounded-full bg-[#15803D]"
                        style={{ width: `${Math.max(0, Math.min(100, item.statistics.progressPercent || 0))}%` }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-[#334155]">{item.statistics.progressPercent}%</p>
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
