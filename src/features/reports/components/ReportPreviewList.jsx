import React from 'react';
import DataTable from '../../../shared/components/admin/DataTable';
import StatusBadge from '../../../shared/components/admin/StatusBadge';

const ReportPreviewList = ({ rows }) => {
  const columns = [
    { key: 'id', header: 'Mã báo cáo', cellClassName: 'font-semibold text-on-surface' },
    { key: 'title', header: 'Tên báo cáo', cellClassName: 'text-on-surface' },
    { key: 'reportTypeLabel', header: 'Loại', cellClassName: 'text-on-surface-variant' },
    { key: 'rangeLabel', header: 'Kỳ dữ liệu', cellClassName: 'text-on-surface-variant' },
    { key: 'scopeLabel', header: 'Phạm vi', cellClassName: 'text-on-surface-variant' },
    { key: 'generatedAt', header: 'Thời điểm tạo', cellClassName: 'text-on-surface-variant' },
    { key: 'status', header: 'Trạng thái', render: (row) => <StatusBadge tone={row.statusTone}>{row.statusLabel}</StatusBadge> },
  ];

  return <DataTable columns={columns} rows={rows} getRowKey={(row) => row.id} />;
};

export default ReportPreviewList;
