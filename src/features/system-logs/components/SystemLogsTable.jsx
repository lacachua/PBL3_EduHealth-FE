import React from 'react';

const roleToneClass = {
  admin: 'bg-emerald-100 text-emerald-800',
  nurse: 'bg-blue-100 text-blue-800',
  student: 'bg-amber-100 text-amber-800',
  system: 'bg-slate-200 text-slate-800',
};

const actionToneClass = {
  create_user: 'text-emerald-700',
  lock_user: 'text-amber-700',
  update_health_profile: 'text-sky-700',
  create_examination: 'text-cyan-700',
  stock_in_medicine: 'text-indigo-700',
  update_vaccination_status: 'text-blue-700',
  sync_system_data: 'text-orange-700',
  create: 'text-emerald-700',
  update: 'text-blue-700',
  delete: 'text-red-700',
  sync: 'text-orange-700',
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
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-[#f8fafc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th className="px-5 py-3.5 whitespace-nowrap">Thời gian</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Người dùng</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Vai trò</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Hành động</th>
            <th className="px-5 py-3.5 whitespace-nowrap">Đối tượng</th>
            <th className="px-5 py-3.5">Chi tiết</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => {
            const { dateLabel, timeLabel } = formatDateParts(row.createdAt);
            const roleClass = roleToneClass[row.actorRole] || 'bg-slate-100 text-slate-600';
            const actionClass = actionToneClass[row.action] || 'text-slate-700';

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
                className="cursor-pointer transition-colors hover:bg-slate-50/80 focus:bg-slate-50/80 focus:outline-none"
              >
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="font-medium text-slate-800 text-[13px]">{dateLabel}</div>
                  <div className="text-[11px] text-slate-500">{timeLabel}</div>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="font-medium text-slate-800 text-[13px]">{row.actorName || '--'}</div>
                  {row.actorUsername && (
                    <div className="text-[11px] text-slate-500">@{row.actorUsername}</div>
                  )}
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <span className={`inline-flex rounded border border-transparent px-2.5 py-0.5 text-[10px] font-semibold ${roleClass}`}>
                    {row.roleLabel || '--'}
                  </span>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className={`font-semibold text-[13px] ${actionClass}`}>{row.actionLabel || '--'}</div>
                  <div className="text-[11px] text-slate-500">{row.moduleLabel || '--'}</div>
                </td>
                <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                  <div className="font-medium text-slate-800 text-[13px]">{row.targetLabel || row.targetTypeLabel || '--'}</div>
                  <div className="text-[11px] text-slate-500">{row.targetTypeLabel || '--'}</div>
                </td>
                <td className="px-5 py-3.5 align-middle max-w-[220px] 2xl:max-w-[360px] text-[13px] text-slate-600">
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
