import React from 'react';
import DataTable from '../../../shared/components/core/DataTable';

const MedicineMovementsTable = ({ rows }) => {
  const columns = [
    { key: 'type', header: 'Loại biến động', cellClassName: 'text-on-surface' },
    { key: 'quantity', header: 'Số lượng', cellClassName: 'text-on-surface' },
    { key: 'stockBefore', header: 'Tồn trước', cellClassName: 'text-on-surface-variant' },
    { key: 'stockAfter', header: 'Tồn sau', cellClassName: 'text-on-surface-variant' },
    { key: 'batchNumber', header: 'Batch', cellClassName: 'text-on-surface-variant' },
    { key: 'expiryDate', header: 'Hạn dùng', cellClassName: 'text-on-surface-variant' },
    { key: 'reason', header: 'Lý do', cellClassName: 'text-on-surface-variant' },
    { key: 'createdBy', header: 'Người tạo', cellClassName: 'text-on-surface-variant' },
    { key: 'createdAt', header: 'Thời gian', cellClassName: 'text-on-surface-variant' },
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(row, index) => row.movementId || index} />;
};

export default MedicineMovementsTable;
