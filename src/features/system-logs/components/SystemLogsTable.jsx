import React from 'react';

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
  return (
    <div className="overflow-x-auto bg-surface">
      <table className="w-full text-left text-sm text-on-surface-variant">
        <thead className="border-b border-outline-variant bg-surface-container-low text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted">
          <tr>
            <th className="px-5 py-3.5 whitespace-nowrap">Thời gian</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Người dùng</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Vai trò</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Hành động</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Đối tượng</th>
            <th className="px-5 py-3.5">Chi tiết</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/60">
          {rows.map((row) => {
            const { dateLabel, timeLabel } = formatDateParts(row.createdAt);
            const roleClass = roleToneClass[row.actorRole] || 'border border-outline-variant bg-surface-container-high text-on-surface-variant';
            const actionClass = actionToneClass[row.action] || 'text-on-surface-variant';

            return (
              <tr
                key={row.id}
                onClick={() => onSelect?.(row)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect?.(row);
                  }
                }}
                role="button"
                tabIndex={0}
                className="cursor-pointer transition-colors hover:bg-surface-container-low focus:bg-surface-container-low focus:outline-none"
              >
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="text-[13px] font-medium text-on-surface">{dateLabel}</div>
                  <div className="text-[11px] text-on-surface-muted">{timeLabel}</div>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="text-[13px] font-medium text-on-surface">{row.actorName || '--'}</div>
                  {row.actorUsername && (
                    <div className="text-[11px] text-on-surface-muted">@{row.actorUsername}</div>
                  )}
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <span className={`inline-flex rounded px-2.5 py-0.5 text-[10px] font-semibold ${roleClass}`}>
                    {row.roleLabel || '--'}
                  </span>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className={`font-semibold text-[13px] ${actionClass}`}>{row.actionLabel || '--'}</div>
                  <div className="text-[11px] text-on-surface-muted">{row.moduleLabel || '--'}</div>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="text-[13px] font-medium text-on-surface">{row.targetLabel || row.targetTypeLabel || '--'}</div>
                  <div className="text-[11px] text-on-surface-muted">{row.targetTypeLabel || '--'}</div>
                </td>
                <td className="max-w-[220px] px-5 py-3.5 align-middle text-[13px] text-on-surface-variant 2xl:max-w-[360px]">
                  <p className="line-clamp-2" title={row.description}>{row.description}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SystemLogsTable;
