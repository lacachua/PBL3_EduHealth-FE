import React from 'react';
import DataTable from '../../../shared/components/admin/DataTable';
import StatusBadge from '../../../shared/components/admin/StatusBadge';

const MedicinesTable = ({ rows, onViewDetail }) => {
  const columns = [
    { key: 'name', header: 'Tên thuốc', cellClassName: 'font-semibold text-on-surface' },
    { key: 'activeIngredient', header: 'Hoạt chất', cellClassName: 'text-on-surface' },
    { key: 'unit', header: 'Đơn vị', cellClassName: 'text-on-surface-variant' },
    { key: 'currentStock', header: 'Tồn kho', cellClassName: 'text-on-surface' },
    { key: 'nearestExpiryDate', header: 'Hạn gần nhất', cellClassName: 'text-on-surface-variant' },
    { key: 'status', header: 'Trạng thái', render: (row) => <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge> },
    { key: 'alerts', header: 'Cảnh báo', render: (row) => <StatusBadge tone={row.alertTone}>{row.alertLabel}</StatusBadge> },
    {
      key: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <button
          type="button"
          onClick={() => onViewDetail(row)}
          className="inline-flex items-center gap-1 rounded-md border border-outline-variant px-2.5 py-1.5 text-xs font-semibold text-on-surface-variant transition hover:bg-surface"
        >
          Xem chi tiết
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />;
};

export default MedicinesTable;
