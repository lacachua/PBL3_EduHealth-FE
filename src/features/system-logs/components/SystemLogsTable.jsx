import React from 'react';
import DataTable from '../../../shared/components/admin/DataTable';
import StatusBadge from '../../../shared/components/admin/StatusBadge';

const SystemLogsTable = ({ rows }) => {
  const columns = [
    { key: 'occurredAt', header: 'Thời gian', cellClassName: 'text-on-surface-variant' },
    { key: 'actorName', header: 'Người thao tác', cellClassName: 'font-semibold text-on-surface' },
    { key: 'moduleLabel', header: 'Module', cellClassName: 'text-on-surface' },
    { key: 'actionLabel', header: 'Hành động', cellClassName: 'text-on-surface-variant' },
    { key: 'targetTypeLabel', header: 'Đối tượng', cellClassName: 'text-on-surface-variant' },
    { key: 'message', header: 'Mô tả', cellClassName: 'text-on-surface' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge>,
    },
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />;
};

export default SystemLogsTable;
