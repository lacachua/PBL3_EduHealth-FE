import DataTable from '../../../shared/components/core/DataTable';
import StatusBadge from '../../../shared/components/core/StatusBadge';

const ROLE_TONE = {
  admin: 'danger',
  nurse: 'info',
  student: 'neutral',
  system: 'neutral',
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
      headerClassName: 'w-[13%] min-w-[120px]',
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
      headerClassName: 'w-[15%] min-w-[130px]',
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
      render: (row) => (
        <StatusBadge tone={ROLE_TONE[String(row.actorRole || '').toLowerCase()] || 'neutral'}>
          {row.roleLabel || '--'}
        </StatusBadge>
      ),
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
      headerClassName: 'w-[15%] min-w-[130px]',
      cellClassName: 'max-w-[180px]',
      render: (row) => {
        const label = row.targetLabel || row.targetTypeLabel || '--';
        return (
          <>
            <div className="truncate text-[13px] font-medium text-on-surface" title={label}>{label}</div>
            <div className="text-[11px] text-on-surface-muted">{row.targetTypeLabel || '--'}</div>
          </>
        );
      },
    },
    {
      key: 'detail',
      header: 'Chi tiết',
      headerClassName: 'w-[32%] min-w-[220px]',
      cellClassName: 'text-[13px] text-on-surface-variant max-w-[360px]',
      render: (row) => <p className="line-clamp-2" title={row.description}>{row.description}</p>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      onRowClick={onSelect}
      containerClassName="overflow-x-auto rounded-2xl border border-outline-variant bg-surface [scrollbar-width:thin] min-h-[360px]"
      tableClassName="min-w-[960px] w-full text-left text-sm"
    />
  );
};

export default SystemLogsTable;
