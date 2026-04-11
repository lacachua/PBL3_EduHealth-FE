import React from 'react';
import DataTable from '../../../shared/components/admin/DataTable';
import StatusBadge from '../../../shared/components/admin/StatusBadge';

const CatalogLookupTable = ({ rows, onViewDetail }) => {
  const columns = [
    { key: 'code', header: 'Mã danh mục', cellClassName: 'whitespace-nowrap font-semibold text-on-surface' },
    { key: 'name', header: 'Tên danh mục', cellClassName: 'font-medium text-on-surface' },
    { key: 'shortDescription', header: 'Mô tả ngắn', cellClassName: 'max-w-[320px] text-on-surface-variant' },
    { key: 'updatedAt', header: 'Cập nhật gần nhất', cellClassName: 'whitespace-nowrap text-on-surface-variant' },
    {
      key: 'status',
      header: 'Trạng thái',
      cellClassName: 'whitespace-nowrap',
      render: (row) => <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge>,
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-on-surface-variant">Nhấn vào từng dòng để xem chi tiết danh mục.</p>
      <DataTable
        columns={columns}
        rows={rows}
        dense
        getRowKey={(row) => row.id}
        onRowClick={onViewDetail}
        rowClassName="transition-colors duration-150 hover:bg-secondary-container/15 focus-within:bg-secondary-container/20"
      />
    </div>
  );
};

export default CatalogLookupTable;
