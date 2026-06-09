import { useMemo } from 'react';
import DataTable from '../../../../shared/components/core/DataTable';
import StatusBadge from '../../../../shared/components/core/StatusBadge';

const MedicinesTable = ({ rows, onView, onStockIn }) => {
  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'Tên thuốc',
      headerClassName: 'min-w-[180px]',
      render: (row) => <p className="line-clamp-2 text-sm font-bold text-on-surface">{row.name || '--'}</p>,
    },
    {
      key: 'activeIngredient',
      header: 'Hoạt chất',
      headerClassName: 'min-w-[150px]',
      render: (row) => <p className="line-clamp-2 text-xs text-on-surface-variant">{row.activeIngredient || '--'}</p>,
    },
    {
      key: 'unit',
      header: 'Đơn vị',
      headerClassName: 'min-w-[90px]',
      render: (row) => row.unitLabel || row.unit || '--',
    },
    {
      key: 'packaging',
      header: 'Quy cách',
      headerClassName: 'min-w-[150px]',
      render: (row) => <p className="line-clamp-2 text-xs text-on-surface-variant">{row.packaging || '--'}</p>,
    },
    {
      key: 'currentStock',
      header: 'Tổng tồn kho',
      headerClassName: 'min-w-[125px] text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div>
          <p className="text-sm font-bold text-on-surface">{row.currentStock ?? '--'}</p>
          <p className="text-[11px] text-on-surface-variant">Cảnh báo: {row.warningThreshold ?? '--'}</p>
        </div>
      ),
    },
    {
      key: 'nearestExpiryDateLabel',
      header: 'Hạn gần nhất',
      headerClassName: 'min-w-[115px]',
      render: (row) => row.nearestExpiryDateLabel || '--',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'min-w-[120px]',
      render: (row) => (
        <StatusBadge tone={row.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {row.statusLabel || '--'}
        </StatusBadge>
      ),
    },
    {
      key: 'alerts',
      header: 'Cảnh báo',
      headerClassName: 'min-w-[150px]',
      render: (row) => (
        <div className="flex flex-col items-start gap-1">
          {row.isLowStock ? <StatusBadge tone="warning">Tồn thấp</StatusBadge> : null}
          {row.isExpiringSoon ? <StatusBadge tone="danger">Sắp hết hạn</StatusBadge> : null}
          {!row.isLowStock && !row.isExpiringSoon ? <StatusBadge tone="neutral">Ổn định</StatusBadge> : null}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'min-w-[125px] text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <button
          type="button"
          data-row-click-stop="true"
          onClick={(event) => {
            event.stopPropagation();
            onStockIn(row);
          }}
          className="app-btn-secondary app-focus-ring rounded-lg px-2.5 py-1.5 text-xs font-semibold"
        >
          Nhập thêm lô
        </button>
      ),
    },
  ], [onStockIn]);

  return (
    <DataTable
      dense
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      onRowClick={onView}
      tableClassName="min-w-[1300px] w-full text-left text-sm"
    />
  );
};

export default MedicinesTable;
