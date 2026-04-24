import React from 'react';

import DataTable from '../../../shared/components/core/DataTable';

const roleToneClass = {
  admin: 'border border-info/25 bg-info-soft text-info',
  nurse: 'border border-success/25 bg-success-soft text-success',
  student: 'border border-primary/25 bg-primary-soft text-primary',
  system: 'border border-outline-variant bg-surface-container-high text-on-surface-variant',
};

const actionToneClass = {
  create_user: 'text-success',
  lock_user: 'text-warning',
  update_health_profile: 'text-info',
  create_examination: 'text-info',
  stock_in_medicine: 'text-info',
  update_vaccination_status: 'text-info',
  sync_system_data: 'text-warning',
  create: 'text-success',
  update: 'text-info',
  delete: 'text-danger',
  sync: 'text-warning',
};

const formatDateParts = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { dateLabel: value, timeLabel: '' };
  const dateLabel = date.toLocaleDateString('vi-VN');
  const timeLabel = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return { dateLabel, timeLabel };
};

const SystemLogsTable = ({ rows, onSelect }) => {
  const columns = [
    {
      key: 'createdAt',
      header: 'Thời gian',
      headerClassName: 'w-[15%] min-w-[120px]',
      cellClassName: 'whitespace-nowrap',
      render: (row) => {
        const { dateLabel, timeLabel } = formatDateParts(row.createdAt);
        return (
          <>
            <div className="text-[13px] font-medium text-on-surface">{dateLabel}</div>
            <div className="text-[11px] text-on-surface-muted">{timeLabel}</div>
          </>
        );
      },
    },
    {
      key: 'user',
      header: 'Người dùng',
      headerClassName: 'w-[15%] min-w-[140px]',
      cellClassName: 'whitespace-nowrap',
      render: (row) => (
        <>
          <div className="text-[13px] font-medium text-on-surface">{row.actorName || '--'}</div>
          {row.actorUsername && (
            <div className="text-[11px] text-on-surface-muted">@{row.actorUsername}</div>
          )}
        </>
      ),
    },
    {
      key: 'role',
      header: 'Vai trò',
      headerClassName: 'w-[10%] min-w-[100px]',
      cellClassName: 'whitespace-nowrap',
      render: (row) => {
        const roleClass = roleToneClass[row.actorRole] || 'border border-outline-variant bg-surface-container-high text-on-surface-variant';
        return (
          <span className={`inline-flex rounded px-2.5 py-0.5 text-[10px] font-semibold ${roleClass}`}>
            {row.roleLabel || '--'}
          </span>
        );
      },
    },
    {
      key: 'action',
      header: 'Hành động',
      headerClassName: 'w-[15%] min-w-[140px]',
      cellClassName: 'whitespace-nowrap',
      render: (row) => {
        const actionClass = actionToneClass[row.action] || 'text-on-surface-variant';
        return (
          <>
            <div className={`font-semibold text-[13px] ${actionClass}`}>{row.actionLabel || '--'}</div>
            <div className="text-[11px] text-on-surface-muted">{row.moduleLabel || '--'}</div>
          </>
        );
      },
    },
    {
      key: 'target',
      header: 'Đối tượng',
      headerClassName: 'w-[15%] min-w-[140px]',
      cellClassName: 'whitespace-nowrap',
      render: (row) => (
        <>
          <div className="text-[13px] font-medium text-on-surface">{row.targetLabel || row.targetTypeLabel || '--'}</div>
          <div className="text-[11px] text-on-surface-muted">{row.targetTypeLabel || '--'}</div>
        </>
      ),
    },
    {
      key: 'detail',
      header: 'Chi tiết',
      headerClassName: 'w-[30%] min-w-[220px]',
      cellClassName: 'text-[13px] text-on-surface-variant 2xl:max-w-[360px]',
      render: (row) => <p className="line-clamp-2" title={row.description}>{row.description}</p>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      onRowClick={onSelect}
      tableClassName="min-w-[960px] w-full text-left text-sm"
    />
  );
};

export default SystemLogsTable;
