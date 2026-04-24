import React from 'react';
import DataTable from '../../../shared/components/core/DataTable';
import StatusBadge from '../../../shared/components/core/StatusBadge';

const CatalogLookupTable = ({ rows, onViewDetail }) => {
  const columns = [
    { key: 'code', header: 'Mã danh mục', headerClassName: 'w-[15%] min-w-[120px]', cellClassName: 'whitespace-nowrap font-semibold text-on-surface' },
    { key: 'name', header: 'Tên danh mục', headerClassName: 'w-[25%] min-w-[180px]', cellClassName: 'font-medium text-on-surface' },
    { 
      key: 'shortDescription', 
      header: 'Mô tả', 
      headerClassName: 'w-[35%] min-w-[240px]', 
      cellClassName: 'text-on-surface-variant',
      render: (row) => <p className="line-clamp-2">{row.shortDescription || row.description || '--'}</p>
    },
    { key: 'updatedAt', header: 'Cập nhật gần nhất', headerClassName: 'w-[15%] min-w-[140px]', cellClassName: 'whitespace-nowrap text-on-surface-variant' },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'w-[10%] min-w-[120px]',
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
        tableClassName="min-w-[800px] w-full text-left text-sm"
      />
    </div>
  );
};

export default CatalogLookupTable;
