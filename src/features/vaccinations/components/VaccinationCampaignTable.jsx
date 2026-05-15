import React, { useMemo } from 'react';
import DataTable from '../../../shared/components/core/DataTable';
import StatusBadge from '../../../shared/components/core/StatusBadge';

const VaccinationCampaignTable = ({ rows, onViewDetail }) => {
  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Đợt tiêm / Vaccine',
      headerClassName: 'w-[38%] min-w-[280px]',
      render: (row) => (
        <div className="w-full text-left">
          <p className="text-sm font-bold text-on-surface transition group-hover:text-primary">{row.name}</p>
          <p className="mt-0.5 text-[11px] text-on-surface-variant">
            {row.vaccineName}
            {' • Mũi '}
            {row.doseNumber}
          </p>
        </div>
      ),
    },
    {
      key: 'scheduledDateLabel',
      header: 'Ngày tiêm',
      headerClassName: 'w-[12%] min-w-[110px]',
      cellClassName: 'text-xs font-medium text-on-surface-variant',
    },
    {
      key: 'targetTypeLabel',
      header: 'Đối tượng',
      headerClassName: 'w-[14%] min-w-[110px]',
      cellClassName: 'text-xs text-on-surface-variant',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'w-[18%] min-w-[140px]',
      render: (row) => (
        <StatusBadge tone={row.statusBadgeClassName?.includes('success') ? 'success' : row.statusBadgeClassName?.includes('warning') ? 'warning' : 'neutral'}>
          {row.statusLabel}
        </StatusBadge>
      ),
    },
    {
      key: 'progress',
      header: 'Tiến độ',
      headerClassName: 'w-[18%] min-w-[160px]',
      render: (row) => (
        <div className="space-y-1.5 w-full">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-on-surface-variant">Tổng: <span className="font-bold text-on-surface">{row.statistics.totalStudents}</span></span>
            <span className="text-success font-bold">{row.statistics.doneCount} đã tiêm</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-outline-variant overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-primary"
              style={{ width: `${Math.max(0, Math.min(100, row.statistics.progressPercent || 0))}%` }}
            />
          </div>
        </div>
      ),
    },
  ], [onViewDetail]);

  return (
    <DataTable
      dense
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      onRowClick={onViewDetail}
      tableClassName="min-w-[760px] w-full text-left text-sm"
    />
  );
};

export default VaccinationCampaignTable;
