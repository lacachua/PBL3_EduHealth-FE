import React, { useMemo } from 'react';
import DataTable from '../../../../shared/components/core/DataTable';
import StatusBadge from '../../../../shared/components/core/StatusBadge';

const MedicinesTable = ({ rows, onView }) => {
  const columns = useMemo(() => [
    {
      key: 'medicine',
      header: 'Thuốc / Hoạt chất',
      headerClassName: 'w-[45%] min-w-[280px]',
      render: (row) => (
        <div className="w-full text-left">
          <p className="line-clamp-2 text-sm font-bold text-on-surface transition group-hover:text-primary">
            {row.name || '--'}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-on-surface-variant" title={row.activeIngredient}>
            {row.activeIngredient || '--'}
          </p>
        </div>
      ),
    },
    {
      key: 'packaging',
      header: 'Quy cách',
      headerClassName: 'w-[15%] min-w-[120px]',
      cellClassName: 'text-xs text-on-surface-variant',
      render: (row) => <p className="line-clamp-1">{row.packaging || '--'}</p>,
    },
    {
      key: 'currentStock',
      header: 'Tồn kho',
      headerClassName: 'w-[12%] min-w-[100px] text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="text-sm font-bold text-on-surface">
          {row.currentStock}
          <span className="ml-1 text-[10px] font-medium text-on-surface-variant">{row.unitLabel}</span>
        </div>
      ),
    },
    {
      key: 'nearestExpiryDateLabel',
      header: 'Hạn dùng',
      headerClassName: 'w-[12%] min-w-[110px]',
      cellClassName: 'text-xs font-medium text-on-surface-variant',
      render: (row) => row.nearestExpiryDateLabel || '--',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'w-[16%] min-w-[150px]',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          <StatusBadge tone={row.statusBadgeClass?.includes('success') ? 'success' : row.statusBadgeClass?.includes('danger') ? 'danger' : 'neutral'}>
            {row.statusLabel}
          </StatusBadge>
          {row.alertLabel && row.alertBadgeClass && !row.alertBadgeClass.includes('transparent') ? (
            <StatusBadge tone={row.alertBadgeClass.includes('danger') ? 'danger' : 'warning'}>
              {row.alertLabel}
            </StatusBadge>
          ) : null}
        </div>
      ),
    },
  ], []);

  return (
    <DataTable
      dense
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      onRowClick={onView}
      tableClassName="min-w-[840px] w-full text-left text-sm"
    />
  );
};

export default MedicinesTable;
