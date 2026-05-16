import React, { useMemo } from 'react';
import DataTable from '../../../../shared/components/core/DataTable';
import StatusBadge from '../../../../shared/components/core/StatusBadge';

const MedicinesTable = ({ rows, onView }) => {
  const columns = useMemo(() => [
    {
      key: 'medicine',
      header: 'Thuốc / Hoạt chất',
      headerClassName: 'w-[30%] min-w-[200px]',
      render: (row) => (
        <div className="w-full text-left">
          <p className="line-clamp-2 text-sm font-bold text-on-surface transition group-hover:text-primary">
            {row.name || 'Chưa có dữ liệu'}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-on-surface-variant" title={row.activeIngredient}>
            {row.activeIngredient || 'Chưa có dữ liệu'}
          </p>
        </div>
      ),
    },
    {
      key: 'currentStock',
      header: 'Tồn kho',
      headerClassName: 'w-[20%] min-w-[120px] text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div>
          <div className="text-sm font-bold text-on-surface">
            {row.currentStock != null ? row.currentStock : 'Chưa có dữ liệu'}
            {row.currentStock != null && row.unitLabel && <span className="ml-1 text-[10px] font-medium text-on-surface-variant">{row.unitLabel}</span>}
          </div>
          {row.warningThreshold != null && (
            <div className="mt-0.5 text-[11px] text-on-surface-variant">
              Cảnh báo: {row.warningThreshold} {row.unitLabel || ''}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'w-[15%] min-w-[120px]',
      render: (row) => (
        <StatusBadge tone={row.statusBadgeClass?.includes('success') ? 'success' : row.statusBadgeClass?.includes('danger') ? 'danger' : 'neutral'}>
          {row.statusLabel || 'Chưa có dữ liệu'}
        </StatusBadge>
      ),
    },
    {
      key: 'alert',
      header: 'Cảnh báo',
      headerClassName: 'w-[20%] min-w-[140px]',
      render: (row) => (
        <StatusBadge tone={row.alertBadgeClass?.includes('danger') ? 'danger' : row.alertBadgeClass?.includes('warning') ? 'warning' : 'neutral'}>
          {row.alertLabel || 'Ổn định'}
        </StatusBadge>
      ),
    },
    {
      key: 'nearestExpiryDateLabel',
      header: 'Hạn gần nhất',
      headerClassName: 'w-[15%] min-w-[110px]',
      cellClassName: 'text-xs font-medium text-on-surface-variant',
      render: (row) => row.nearestExpiryDateLabel || 'Chưa có dữ liệu',
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
