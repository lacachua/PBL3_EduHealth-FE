import React from 'react';
import DataTable from '../../../shared/components/admin/DataTable';
import StatusBadge from '../../../shared/components/admin/StatusBadge';

const CatalogLookupTable = ({ rows, onViewDetail }) => {
  const columns = [
    { key: 'code', header: 'Mã danh mục', cellClassName: 'font-semibold text-on-surface' },
    { key: 'name', header: 'Tên danh mục', cellClassName: 'text-on-surface' },
    { key: 'shortDescription', header: 'Mô tả ngắn', cellClassName: 'max-w-[320px] text-on-surface-variant' },
    { key: 'updatedAt', header: 'Cập nhật gần nhất', cellClassName: 'text-on-surface-variant' },
    { key: 'status', header: 'Trạng thái', render: (row) => <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge> },
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

export default CatalogLookupTable;
