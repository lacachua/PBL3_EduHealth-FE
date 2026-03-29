import React from 'react';
import ActionDropdown from '../../../shared/components/admin/ActionDropdown';
import DataTable from '../../../shared/components/admin/DataTable';
import StatusBadge from '../../../shared/components/admin/StatusBadge';

const CatalogTable = ({ rows, onEdit, onDelete }) => {
  const columns = [
    { key: 'id', header: 'Mã danh mục', cellClassName: 'font-semibold text-on-surface' },
    { key: 'name', header: 'Tên danh mục', cellClassName: 'text-on-surface' },
    { key: 'updatedAt', header: 'Cập nhật', cellClassName: 'text-on-surface-variant' },
    { key: 'status', header: 'Trạng thái', render: (row) => <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge> },
    {
      key: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end">
          <ActionDropdown
            items={[
              { id: 'edit', label: 'Chỉnh sửa', icon: 'edit', onClick: () => onEdit(row) },
              { id: 'delete', label: 'Xóa', icon: 'delete', onClick: () => onDelete(row) },
            ]}
          />
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />;
};

export default CatalogTable;
