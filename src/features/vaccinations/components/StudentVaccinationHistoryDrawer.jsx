
import EmptyState from '../../../shared/components/core/EmptyState';
import ErrorState from '../../../shared/components/core/ErrorState';
import LoadingSpinner from '../../../shared/components/core/LoadingSpinner';
import NurseDrawerShell from '../../../shared/components/nurse/NurseDrawerShell';
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
    <NurseDrawerShell
      open={open}
      onClose={onClose}
      title="Lịch sử tiêm tổng hợp"
      subtitle={studentLabel ? `Xem toàn bộ lịch sử tiêm của ${studentLabel}` : 'Xem toàn bộ lịch sử tiêm của học sinh'}
      widthClass="max-w-[720px]"
    >
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
          <table className="min-w-[760px] w-full text-left text-sm">
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
                  <td className="px-4 py-3 text-on-surface">{item.note || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </NurseDrawerShell>
  );
};

export default StudentVaccinationHistoryDrawer;
