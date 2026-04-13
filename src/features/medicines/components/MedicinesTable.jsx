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
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} onRowClick={onViewDetail} />;
};

export default MedicinesTable;
