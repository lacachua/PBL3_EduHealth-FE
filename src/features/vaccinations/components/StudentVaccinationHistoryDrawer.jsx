
import EmptyState from '../../../shared/components/core/EmptyState';
import ErrorState from '../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';
import NurseModalShell from '../../../shared/components/nurse/NurseModalShell';
import VaccinationStatusBadge from './VaccinationStatusBadge';

const StudentVaccinationHistoryDrawer = ({
  open,
  onClose,
  studentLabel,
  status,
  error,
  rows,
}) => {
  return (
    <NurseModalShell
      open={open}
      onClose={onClose}
      title="Lịch sử tiêm tổng hợp"
      subtitle={studentLabel ? `Xem toàn bộ lịch sử tiêm của ${studentLabel}` : 'Xem toàn bộ lịch sử tiêm của học sinh'}
      maxWidthClass="max-w-[960px]"
    >
      <div className="min-h-[300px]">
        {status === 'loading' ? <LoadingSpinner label="Đang tải lịch sử tiêm..." /> : null}

        {status === 'error' ? <ErrorState message={error} /> : null}

        {status === 'empty' ? (
          <EmptyState
            title="Chưa có lịch sử tiêm tổng hợp"
            description="Chưa có lịch sử tiêm cho học sinh này"
          />
        ) : null}

        {status === 'success' ? (
          <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface [scrollbar-width:thin]">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="app-table-head text-[11px] uppercase tracking-[0.08em]">
                <tr>
                  <th className="px-4 py-3">Đợt tiêm</th>
                  <th className="px-4 py-3">Vaccine</th>
                  <th className="px-4 py-3 text-right">Mũi số</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày tiêm</th>
                  <th className="px-4 py-3">Số lô</th>
                  <th className="px-4 py-3">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {rows.map((item) => (
                  <tr key={item.studentVaccinationId} className="app-interactive hover:bg-surface-container-low">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-on-surface">{item.campaignName}</p>
                      <p className="text-xs text-on-surface-variant">{item.campaignId}</p>
                    </td>
                    <td className="px-4 py-3 text-on-surface">{item.vaccineName}</td>
                    <td className="px-4 py-3 text-right font-semibold text-on-surface">{item.doseNumber}</td>
                    <td className="px-4 py-3">
                      <VaccinationStatusBadge label={item.statusLabel} className={item.statusBadgeClassName} />
                    </td>
                    <td className="px-4 py-3 text-on-surface">{item.vaccinatedAtLabel}</td>
                    <td className="px-4 py-3 font-mono text-xs text-on-surface">{item.lotNumber || '--'}</td>
                    <td className="px-4 py-3 text-on-surface">
                      {item.note ? (
                        <span className="line-clamp-2 text-[11px] text-on-surface-variant leading-relaxed" title={item.note}>{item.note}</span>
                      ) : (
                        <span className="text-[11px] italic text-on-surface-variant/70">Không có ghi chú</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </NurseModalShell>
  );
};

export default StudentVaccinationHistoryDrawer;
