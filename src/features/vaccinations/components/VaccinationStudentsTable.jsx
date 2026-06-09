import React, { useMemo } from 'react';
import DataTable from '../../../shared/components/core/DataTable';
import StatusBadge from '../../../shared/components/core/StatusBadge';

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
        headerClassName: 'w-[20%] min-w-[160px]',
        render: (row) => (
          <div className="w-full text-left">
            <p className="truncate text-sm font-bold text-on-surface">{row.student?.fullName || '--'}</p>
          </div>
        ),
      },
      {
        key: 'className',
        header: 'Lớp',
        headerClassName: 'w-[10%] min-w-[70px]',
        render: (row) => (
          <p className="truncate text-sm text-on-surface-variant">
            {row.student?.className || '--'}
          </p>
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
            row.note ? (
              <p className="line-clamp-2 text-[11px] text-on-surface-variant leading-relaxed" title={row.note}>
                {row.note}
              </p>
            ) : (
              <p className="text-[11px] italic text-on-surface-variant/70">Không có ghi chú</p>
            )
          ),
        }
      );
    }

    cols.push({
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'w-[10%] min-w-[90px] text-right',
      cellClassName: 'text-right',
      render: (row) => {
        const isDone = row.status === 'DONE';

        return (
          <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              disabled={isDone}
              onClick={() => {
                if (!isDone) {
                  onOpenUpdate(row);
                }
              }}
              className={`app-focus-ring inline-flex h-8 items-center justify-center rounded-lg px-3 text-[11px] font-bold transition-colors ${
                isDone
                  ? 'cursor-not-allowed bg-surface-container-low text-on-surface-variant'
                  : 'bg-primary-soft text-primary hover:bg-primary hover:text-on-primary'
              }`}
            >
              {isDone ? '\u0110\u00e3 ti\u00eam' : 'C\u1eadp nh\u1eadt'}
            </button>
          </div>
        );
      },
    });

    return cols;
  }, [onOpenCampaign, onOpenUpdate, showCampaignColumn, showResultColumns, showScheduledDateColumn]);

  return (
    <DataTable
      dense
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.studentVaccinationId}
      onRowClick={onOpenHistory}
      emptyMessage={emptyMessage}
      tableClassName={`w-full text-left text-sm ${showResultColumns ? 'min-w-[860px]' : 'min-w-[760px]'}`}
    />
  );
};

export default VaccinationStudentsTable;
