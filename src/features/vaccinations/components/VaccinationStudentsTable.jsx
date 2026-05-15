import React, { useMemo } from 'react';
import DataTable from '../../../shared/components/core/DataTable';
import StatusBadge from '../../../shared/components/core/StatusBadge';
import ActionDropdown from '../../../shared/components/admin/ActionDropdown';

const VaccinationStudentsTable = ({
  rows,
  emptyMessage,
  onOpenHistory,
  onOpenUpdate,
  onOpenCampaign,
  showCampaignColumn = false,
  showResultColumns = true,
  showScheduledDateColumn = false,
}) => {
  const columns = useMemo(() => {
    const cols = [
      {
        key: 'student',
        header: 'Học sinh',
        headerClassName: 'w-[25%] min-w-[200px]',
        render: (row) => (
          <div className="w-full text-left">
            <p className="truncate text-sm font-bold text-on-surface">{row.student?.fullName || '--'}</p>
            <p className="mt-0.5 truncate text-[11px] text-on-surface-variant">
              {row.student?.studentCode || '--'} • Lớp {row.student?.className || '--'}
            </p>
          </div>
        ),
      },
    ];

    if (showCampaignColumn) {
      cols.push({
        key: 'campaign',
        header: 'Đợt tiêm',
        headerClassName: 'w-[25%] min-w-[200px]',
        render: (row) => (
          <div className="w-full text-left">
            {typeof onOpenCampaign === 'function' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCampaign(row);
                }}
                className="app-focus-ring truncate text-left text-sm font-bold text-on-surface transition hover:text-primary"
              >
                {row.campaignName || '--'}
              </button>
            ) : (
              <p className="truncate text-sm font-bold text-on-surface">{row.campaignName || '--'}</p>
            )}
            <p className="mt-0.5 truncate text-[11px] text-on-surface-variant">{row.scheduledDateLabel || '--'}</p>
          </div>
        ),
      });
    }

    if (showScheduledDateColumn) {
      cols.push({
        key: 'scheduledDate',
        header: 'Ngày dự kiến',
        headerClassName: 'w-[12%] min-w-[110px]',
        cellClassName: 'text-xs text-on-surface-variant',
        render: (row) => row.scheduledDateLabel || '--',
      });
    }

    cols.push({
      key: 'status',
      header: 'Tiêm chủng',
      headerClassName: 'w-[15%] min-w-[130px]',
      render: (row) => (
        <StatusBadge tone={row.statusBadgeClassName?.includes('success') ? 'success' : row.statusBadgeClassName?.includes('warning') ? 'warning' : 'neutral'}>
          {row.statusLabel}
        </StatusBadge>
      ),
    });

    if (showResultColumns) {
      cols.push(
        {
          key: 'result',
          header: 'Ngày tiêm / Lô',
          headerClassName: 'w-[15%] min-w-[140px]',
          cellClassName: 'text-xs text-on-surface-variant',
          render: (row) => (
            <div>
              <p className="font-medium text-on-surface">{row.vaccinatedAtLabel || '--'}</p>
              {row.lotNumber ? <p className="mt-0.5 text-[10px]">Lô: <span className="font-mono">{row.lotNumber}</span></p> : null}
            </div>
          ),
        },
        {
          key: 'note',
          header: 'Ghi chú',
          headerClassName: 'w-[20%] min-w-[160px]',
          render: (row) => (
            <p className="line-clamp-2 text-[11px] text-on-surface-variant leading-relaxed" title={row.note}>
              {row.note || '--'}
            </p>
          ),
        }
      );
    }

    cols.push({
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'w-[10%] min-w-[110px] text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onOpenUpdate(row)}
            className="app-focus-ring inline-flex h-8 items-center justify-center rounded-lg bg-primary-soft px-3 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            Cập nhật
          </button>

          <ActionDropdown
            menuWidth={200}
            items={[
              {
                id: 'history',
                label: 'Lịch sử tiêm tổng hợp',
                icon: 'history',
                onClick: () => onOpenHistory(row),
              }
            ]}
          />
        </div>
      ),
    });

    return cols;
  }, [onOpenCampaign, onOpenHistory, onOpenUpdate, showCampaignColumn, showResultColumns, showScheduledDateColumn]);

  return (
    <DataTable
      dense
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.studentVaccinationId}
      emptyMessage={emptyMessage}
      tableClassName={`w-full text-left text-sm ${showResultColumns ? 'min-w-[860px]' : 'min-w-[760px]'}`}
    />
  );
};

export default VaccinationStudentsTable;
